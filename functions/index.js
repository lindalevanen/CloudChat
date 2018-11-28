const functions = require('firebase-functions');
const admin = require('firebase-admin');
var fetch = require('node-fetch')

const region = 'europe-west1'
admin.initializeApp();

'use strict';

exports.sendChatMessageNotification = functions.region(region).database.ref('/chats/{chatUid}/messages/{messageUid}')
    .onCreate(async (snapshot, context) => {
      const chatUid = context.params.chatUid;
      const messageUid = context.params.messageUid;
      const messageBody = snapshot.val().body

      console.log('We have a new message UID:', messageUid, 'for chat:', chatUid);

      // Get the list of users in chat.
      var db = admin.database();
      const chatMembers = [];
      const getChatMembersPromise = await admin.database()
        .ref(`/chats/${chatUid}/members`)
        .once('value')
        .then((results) => {
          results.forEach((snapshot) => {
            chatMembers.push(snapshot.val())
          })
          return results
        });
      console.log('getchatmembers', chatMembers)
      // Get device tokens corresponding to members
      const getDeviceTokensPromises = []
      for(let key in chatMembers) {
        if(chatMembers.hasOwnProperty(key)) {
          getDeviceTokensPromises.push(
            admin.database().ref(`/users/${key}/expoToken`).once('value').then((result) => {
              return result.val()
            })
            )
        }
      }

      const results = await Promise.all(getDeviceTokensPromises)
      console.log("promise all devicetokens ", results)

      // Check if there are any device tokens.
      if (results.length === 0) {
        return console.log('There are no notification tokens to send to.');
      }
      const messages = []
      
      responsePromises = []
      for(deviceToken in results) {
        if(deviceToken) {
          console.log("this devicetoken: ", deviceToken)
          messages.push({
            "to": deviceToken,
            "title": `New message from someone`,
            "body": `${messageBody}`
          })
        }
      }
      console.log("all messages: ", messages)

      fetch('https://exp.host/--/api/v2/push/send', {

            method: 'POST',
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify(messages)
          })
    });

/*
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
*/
/**
 * When an image is uploaded in the Storage bucket We generate a thumbnail automatically using
 * ImageMagick.
 */
/*
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
*/
