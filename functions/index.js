const functions = require('firebase-functions');
const admin = require('firebase-admin');
const spawn = require('child-process-promise').spawn;
const path = require('path');
const os = require('os');
const fs = require('fs');
const glob = require('glob')
const vision = require('@google-cloud/vision');
const translate = require('@google-cloud/translate')();
var fetch = require('node-fetch')

const region = 'europe-west1'
admin.initializeApp();

'use strict';

// Translate an incoming message.
exports.translate = functions.region(region).database.ref('/chatEvents/{chatID}/{messageID}')
.onCreate(
    async(snapshot, context) => {

      const LANGUAGES = ['en', 'it', 'es', 'hi', 'fi']
      
      const chatID = context.params.chatID;
      const messageID = context.params.messageID;
      const message = snapshot.val().payload.body
      const messageType = snapshot.val().type
      if(messageType !== 'message') {
        console.log('Not a message')
        return
      }

      detectLanguage = await translate.detect(message)
      let detectedLanguage = detectLanguage[0].language

      if(detectedLanguage) {
        console.log(`Detected language: ${detectedLanguage} . Proceeding to translates`)
      } else {
        console.log('Language not detected, not proceeding with translation')
        return null
      }

      const promises = [];
      LANGUAGES.forEach((targetLanguage) => {
        if(targetLanguage !== detectedLanguage) {
          promises.push(translate.translate(message, {from: detectedLanguage, to: targetLanguage}))
        }
      });

      Promise.all(promises).then(translations => {
        const results = translations
        const result = {}
        
        /**
         * if original message was in one of the translation languages, it was not translated again
         * but we want it into translations also in case someone wants to translate into this language
         */
        
        const originalLangIndex = LANGUAGES.indexOf(detectedLanguage)
        if(originalLangIndex >= 0) {
          results.splice(originalLangIndex, 0, [message])
        }

        for (let i = 0; i < results.length; i++) {
          const lang = LANGUAGES[i]
          const value = results[i][0]
          result[lang] = value
        }

        console.log("Translations done")
        return admin.database().ref(`/chatEvents/${chatID}/${messageID}/payload/translations`).set(result)
      }).catch( (error) => {
        return Promise.reject(error);
      });
  })

exports.addLatestChatEvent = functions.region(region).database.ref('chatEvents/{chatUid}/{messageUid}')
  .onCreate(async (snapshot, context) => {
    const chatUid = context.params.chatUid;
    const chatEvent = snapshot.val();

    const updates = {}
    updates['/lastEvent'] = chatEvent
    return admin.database().ref(`chatMetadata/${chatUid}`).update(updates)
  })

exports.addImageLabel = functions.region(region).database.ref('storageMetadata/chatImages/{chatUid}/{imageUid}')
  .onCreate(async (snapshot, context) => {
    const chatUid = context.params.chatUid;
    const imageUid = context.params.imageUid;
    const imageData = snapshot.val();
    const bucket = imageData.bucket;
    const path = imageData.fullPath;
    const fileName = imageData.name
    const imageGSUrl = 'gs://' + bucket + '/' + path;

    if(!bucket || !path) {
      console.log("bucket or path not found")
      return
    }

    // Creates a client
    const client = new vision.ImageAnnotatorClient();
    const file = await admin.storage().bucket(bucket).file(path)
    const groupTagLabels = ["food", "technology", "screenshot"]

    await client
      .labelDetection(imageGSUrl)
      .then(results => {
        const labels = results[0].labelAnnotations;
        let chosenLabel = labels[0].description; //initialize as the strongest label found

        for (var key in labels) {
          if (labels.hasOwnProperty(key)) {
            const child = labels[key];
            const label = child.description;
            if (groupTagLabels.includes(label)) {
              chosenLabel = label; //setting one of the groupTagLabels
              break;
            }
          }
        }
        const updates = {}
        updates['/imageLabel'] = chosenLabel
        return admin.database().ref(`storageMetadata/chatImages/${chatUid}/${imageUid}`).update(updates)
      })
      .catch(err => {
        console.error('ERROR:', err);
      });
  })

exports.deleteImagesFromDeletedGroups = functions.region(region).database.ref('chatMetadata/{chatUid}')
  .onDelete(async (snapshot, context) => {
    const chatUid = context.params.chatUid
    console.log(`Chat ${chatUid} deleted, proceeding to delete its images`)

    const promises = [];
    const ref = await admin.database().ref(`storageMetadata/chatImages/${chatUid}`)
    await ref.once('value').then(snapshot => {
      snapshot.forEach((childSnapshot) => {
        const child = childSnapshot.val();
        const bucket = child.bucket;
        const fileName = child.name;
        const preFix = `chatImages/${chatUid}/${fileName}`
        promises.push(admin.storage().bucket(bucket).file(preFix).delete());
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
    
    if (previewData.error) {
      return Promise.reject(previewData.error);
    }

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

exports.sendNotificationWhenAddedToGroup = functions.region(region).database.ref('/chatMetadata/{chatUid}/members/{userID}')
  .onCreate(async (snapshot, context) => {
    const chatUid = context.params.chatUid;
    const userID = context.params.userID;
    const ref = await admin.database().ref(`/chatMetadata/${chatUid}`).once('value')
    const original = ref.val();
    const groupChat = original.groupChat;
    if(!groupChat) {
      return
    }
    const title = original.title;
    const creator = original.creator;
    const membersToNotify = [userID];
    // Get device tokens corresponding to members
    const getDeviceTokensPromises = []

    for(let key in membersToNotify) {
      if(membersToNotify.hasOwnProperty(key) && membersToNotify[key] !== creator) {
        getDeviceTokensPromises.push(admin.database().ref(`/users/${membersToNotify[key]}/expoToken`).once('value'))
      }
    }

    const results = await Promise.all(getDeviceTokensPromises)
    if(results.length === 0) {
      return;
    }
    const notifications = []
      
    for (let i = 0; i < results.length; i++) {
      if(results[i]) {
        notifications.push({
          "to": results[i].val(),
          "title": title,
          "body": 'You were added into a group chat'
        })
      }
    }

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(notifications)
    })

  })

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
      const notificationBody = messageType === 'message' ? messageBody : 'Image'
      
      for (let i = 0; i < results.length; i++) {
        if(results[i]) {
          notifications.push({
            "to": results[i].val(),
            "title": `${messageSender.val()}`,
            "body": `${notificationBody}`
          })
        }
      }
      
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
  return spawn('convert', [origFile, '-resize', resolution, convertedFile])
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
