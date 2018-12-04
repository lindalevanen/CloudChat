const functions = require('firebase-functions');
const admin = require('firebase-admin');
const spawn = require('child-process-promise').spawn;
const path = require('path');
const os = require('os');
const fs = require('fs');
const glob = require('glob')

var fetch = require('node-fetch')

const region = 'europe-west1'
admin.initializeApp();

'use strict';

exports.deleteImagesFromDeletedGroups = functions.region(region).database.ref('chatMetadata/{chatUid}')
  .onDelete(async (snapshot, context) => {
    const chatUid = context.params.chatUid
    console.log(`Chat ${chatUid} deleted, proceeding to delete its images`)

    const ref = await admin.database().ref(`storageMetadata/chatImages/${chatUid}`)

    const promises = {};
    await ref.once('value').then(snapshot => {
      snapshot.forEach((child) => {
        const bucket = child.bucket;
        const fileName = child.name;
        promises.push(admin.storage().bucket(bucket).file(fileName).delete());
      });
    return;
    });

    Promise.all(promises).then(result => {
      console.log(`Successfully removed ${result.length} images`);
      return;
    })
    .catch(error => {
      console.log(error.message)
    })
  });

function findUrlFromStrings(stringArr) {
  const regexUrl = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/;
  let result = ''
  for (i in stringArr) {
    if (regexUrl.test(stringArr[i])) {
      result = stringArr[i];
      break;
    }
  }
  return result;
}

exports.createUrlPreview = functions.region(region).database.ref('chatEvents/{chatUid}/{messageUid}')
  .onCreate(async (snapshot, context) => {
    const messageType = snapshot.val().type;
    if (messageType !== 'message') {
      console.log("Not a message")
      return null
    }

    const chatUid = context.params.chatUid;
    const messageUid = context.params.messageUid;
    const messageBody = snapshot.val().payload.body;

    const foundUrl = findUrlFromStrings(messageBody.split(" "))
    if (!foundUrl) {
      console.log("No URL in message")
      return null
    }

    console.log(`${foundUrl} seems to be a URL! fetching for preview metadata`)
    const linkPreviewAPIKey = '5c04023cb90a8e4a43d1e77d9026029040b88571813db'
    const linkPreviewURL = 'http://api.linkpreview.net/?key=' + linkPreviewAPIKey + '&q=' + foundUrl

    const previewData = await fetch(linkPreviewURL)
      .then((response) => {
        return response.json();
      })

    const updates = {};
    updates['/previewDataOfURL'] = previewData;

    return admin.database().ref(`chatEvents/${chatUid}/${messageUid}/payload`).update(updates)
  });

exports.deleteGroupsThatHaveNoUser = functions.region(region).database.ref('chatMetadata/{chatUid}/members/')
  .onDelete(async (snapshot, context) => {
    const chatUid = context.params.chatUid
    console.log(`Deleting chat ${chatUid} because last member left`)
    const ref = await admin.database().ref(`chatMetadata/${chatUid}`)
    await ref.remove()
  });

exports.sendChatMessageNotification = functions.region(region).database.ref('/chatEvents/{chatUid}/{messageUid}')
    .onCreate(async (snapshot, context) => {
      //todo clean this up by moving parts of code to functions
      const chatUid = context.params.chatUid;
      const messageUid = context.params.messageUid;
      const messageBody = snapshot.val().payload.body;
      const messageSenderId = snapshot.val().payload.sender;
      const messageSender = await admin.database().ref(`/users/${messageSenderId}/username`).once('value')
      //image or message or something else?
      const messageType = snapshot.val().type;

      console.log(`New ${messageType} UID:`, messageUid, 'for chat:', chatUid);

      // Get the list of users in chat.
      const chatMembers = [];
      const getChatMembersPromise = await admin.database()
        .ref(`/chatMetadata/${chatUid}/members`)
        .once('value')
        .then((results) => {
          results.forEach((snapshot) => {
            chatMembers.push(snapshot.val().id)
          })
          return results
        });
      console.log('Chat members', chatMembers)
      // Get device tokens corresponding to members
      const getDeviceTokensPromises = []

      for(let key in chatMembers) {
        if(chatMembers.hasOwnProperty(key) && chatMembers[key] !== messageSenderId) {
          getDeviceTokensPromises.push(admin.database().ref(`/users/${chatMembers[key]}/expoToken`).once('value'))
        }
      }

      const results = await Promise.all(getDeviceTokensPromises)

      // Check if there are any device tokens.
      if (results.length === 0) {
        return console.log('There are no notification tokens to send to.');
      }
      const notifications = []
      
      responsePromises = []
      for (let i = 0; i < results.length; i++) {
        if(results[i]) {
          notifications.push({
            "to": results[i].val(),
            "title": `${messageSender.val()}`,
            "body": `${messageBody}`
          })
        }
      }
      console.log("All notifications: ", notifications)

      fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(notifications)
      })
    });

function getFileName(key, tempName) {
  return `${key}_${tempName}`
}

function resizePromise(configuration, tempFilePath, tempFileName) {
  const { key, resolution } = configuration;
  const origFile = `${tempFilePath}/${tempFileName}`;
  const convertedFile = `${tempFilePath}/${getFileName(key, tempFileName)}`;
  return spawn('convert', [origFile, '-thumbnail', resolution, convertedFile])
}

function uploadPromise(bucket, configuration, tempFilePath, tempFileName, uploadDir, metadata) {
  const { key, resolution } = configuration;
  const fileName = getFileName(key, tempFileName);
  const convertedFile = `${tempFilePath}/${getFileName(key, tempFileName)}`;
  const fileDest = `${uploadDir}/${fileName}`;
  // Uploading the thumbnail.
  return bucket.upload(convertedFile, {
    destination: fileDest,
    metadata,
  });
}

function deleteFiles(tempFilePath) {
  return new Promise( (resolve, reject) => {
    files = glob.glob(`*${tempFilePath}`, (err, files) => {
      if (err) {
        console.err(err);
        reject(err);
      }
      files.forEach(fs.unlinkSync);
      return(files)
    });
  });
}

/**
 * When an image is uploaded in the Storage bucket We generate a thumbnail automatically using
 * ImageMagick.
 */

exports.createAvatarThumbnail = functions.region(region).storage.object().onFinalize(async (object) => {
  // Object metadata
  const fileBucket = object.bucket; // The Storage bucket that contains the file.
  const filePath = object.name; // File path in the bucket.
  const { contentType } = object; // File content type.

  // Exit if this is triggered on a file that is not an image.
  if (!contentType.startsWith('image/')) {
    return console.log('This is not an image.');
  }

  // Get the file name
  const fileName = path.basename(filePath);
  const fileDir = path.dirname(filePath);
  // Exit if the image is already resized.
  const resolutions = [
    {
      key: 'thumb',
      resolution: '200x200>',
    },
    {
      key: 'low',
      resolution: "640x480>",
    },
    {
      key: 'high',
      resolution: '1280x960>'
    }
  ]
  const isResized = resolutions.some(i => i.key === fileName.slice(0, i.key.length));
  if (isResized) {
    return console.log('Already a Thumbnail.');
  }

  // Download file from bucket.
  const bucket = admin.storage().bucket(fileBucket);
  const tempPath = os.tmpdir()
  const tempFilePath = path.join(tempPath, fileName);
  const metadata = {
    contentType,
  };
  await bucket.file(filePath).download({ destination: tempFilePath });
  console.log('Image downloaded locally to', tempFilePath);
  // Generate a thumbnail using ImageMagick to resolutions thumb (200x200 px), low (640×480 px), high (1280×960 px)
  // Resize images
  const resizePromises = resolutions.map(i => resizePromise(i, tempPath, fileName));
  const converted = await Promise.all(resizePromises);
  console.log(`${resolutions.length} thumbnails created at ${tempFilePath}`);
  // Upload images
  const uploadPromises = resolutions.map(i => uploadPromise(bucket, i, tempPath, fileName, fileDir, metadata));
  const uploaded = await Promise.all(uploadPromises);
  console.log(`${resolutions.length} images uploaded`);
  // Once the thumbnail has been uploaded delete the local file to free up disk space.
  const files = await deleteFiles(tempFilePath)
  console.log(`Deleted files ${files}`);
  return files
});
