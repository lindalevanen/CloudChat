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

function resizePromise(configuration, tempFilePath, tempFileName) {
  const { key, resolution } = configuration;
  console.log(`resizePromise: ${key} / ${tempFileName}`);
  const origFile = `${tempFilePath}/${tempFileName}`;
  const convertedFile = `${tempFilePath}/${getFileName(key, tempFileName)}`;
  console.log(`origFile ${origFile}`);
  console.log(`convertedFile ${convertedFile}`);
  return spawn('convert', [origFile, '-thumbnail', resolution, convertedFile])
}

function uploadPromise(bucket, configuration, tempFilePath, tempFileName, uploadDir, metadata) {
  const { key, resolution } = configuration;
  console.log(`tempFileName ${tempFileName}`);
  console.log(`uploadPromise: ${key}`);
  const fileName = getFileName(key, tempFileName);
  console.log(`fileName ${fileName}`);
  const convertedFile = `${tempFilePath}/${getFileName(key, tempFileName)}`;
  console.log(`convertedFile ${convertedFile}`);
  const fileDest = `${uploadDir}/${fileName}`;
  console.log(`fileDest ${fileDest}`);
  // Uploading the thumbnail.
  return bucket.upload(convertedFile, {
    destination: fileDest,
    metadata,
  });
}

function deleteFiles(tempFilePath) {
  console.log(`deleteFiles ${tempFilePath}`);
  return new Promise( (resolve, reject) => {
    files = glob.glob(`*${tempFilePath}`, (err, files) => {
      if (err) {
        console.err(err);
        reject(err);
      }
      console.log(`Deleting files ${files}`);
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
  console.log(`filePath ${filePath}`);
  const fileName = path.basename(filePath);
  const fileDir = path.dirname(filePath);
  console.log(`fileName ${fileName}`);
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
  console.log(`isResized ${isResized}`);
  if (isResized) {
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
  // Resize images
  const resizePromises = resolutions.map(i => resizePromise(i, tempPath, fileName));
  const converted = await Promise.all(resizePromises);
  console.log(`${resolutions.length} thumbnails created at ${tempFilePath}`);
  // Upload images
  const uploadPromises = resolutions.map(i => uploadPromise(bucket, i, tempPath, fileName, fileDir, metadata));
  console.log('Uploading files...')
  const uploaded = await Promise.all(uploadPromises);
  console.log('Uploaded files');
  console.log(`${resolutions.length} images uploaded`);
  // Once the thumbnail has been uploaded delete the local file to free up disk space.
  console.log('Deleting files...');
  const files = await deleteFiles(tempFilePath)
  console.log(`Deleted files ${files}`);
  return files
});
