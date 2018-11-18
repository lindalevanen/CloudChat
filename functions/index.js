const functions = require('firebase-functions');
const admin = require('firebase-admin');
const spawn = require('child-process-promise').spawn;
const path = require('path');
const os = require('os');
const fs = require('fs');
const glob = require('glob')

const region = 'europe-west1'
admin.initializeApp();

function getFileName(key, tempName) {
  console.log(`getFileName ${key}_${tempName}`);
  return `${key}_${tempName}`
}

function resizePromise(configuration, tempFileName, tempFileName) {
  const { key, resolution } = configuration;
  console.log(`resizePromise: ${key} / ${tempFileName}`);
  const fileName = getFileName(key, tempFileName);
+  console.log(`fileName ${fileName}`);
  return spawn('convert', [tempFileName, '-thumbnail', resolution, fileName])
}

function uploadPromise(configuration, tempFilePath, tempFileName, metadata) {
  const { key, resolution } = configuration;
  console.log(`uploadPromise: ${key}`);
  const fileName = getFileName(key, tempFileName);
  console.log(`fileName ${fileName}`);
  // Uploading the thumbnail.
  return bucket.upload(tempFilePath, {
    destination: uploadFilePath,
    metadata,
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
  console.log(`filePath ${filePath}`);
  const fileName = path.basename(filePath);
  console.log(`fileName ${fileName}`);
  // Exit if the image is already a thumbnail.
  if (fileName.startsWith('thumb_')) {
    return console.log('Already a Thumbnail.');
  }

  // Download file from bucket.
  const bucket = admin.storage().bucket(fileBucket);
  const tempPath = os.tmpdir()
  const tempFilePath = path.join(tempPath, fileName);
  console.log(`tempFilePath ${tempFilePath}`);
  const metadata = {
    contentType,
  };
  await bucket.file(filePath).download({ destination: tempFilePath });
  console.log('Image downloaded locally to', tempFilePath);
  // Generate a thumbnail using ImageMagick to resolutions thumb (200x200 px), low (640×480 px), high (1280×960 px)
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
  // WIP: make sure these work for all files&resolutions
  // Resize images
  const resizePromises = resolutions.map(i => resizePromise(i, tempFilePath, fileName));
  const converted = Promise.all(resizePromises);
  console.log(`${resolutions.length} thumbnails created at ${tempFilePath}`);
  // Upload images
  const uploadPromises = resolutions.map(i => uploadPromise(i, tempPath, fileName, metadata));
  const uploaded = Promise.all(uploadPromises);
  console.log(`${resolutions.length} images uploaded`);
  // Once the thumbnail has been uploaded delete the local file to free up disk space.
  console.log('Deleting files...');
  files = glob.glob(`*${tempFilePath}`, (err, files) => {
    if (err) {
      console.err(err);
      return err
    }
    console.log(`Deleting files ${files}`);
    files.forEach(fs.unlinkSync);
    return files
  });
  console.log(`Deleted files ${files}`);
  return files
});
