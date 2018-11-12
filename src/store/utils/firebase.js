import * as firebase from 'firebase';
import { reactReduxFirebase } from 'react-redux-firebase';
import omit from 'lodash/omit';
import uuidv4 from 'uuid/v4';

const config = {
  apiKey: 'AIzaSyATNwognBzftHzPB5BkfQF5IBJSF_4uaAY',
  authDomain: 'snazzy-narwhal-on-fire.firebaseapp.com',
  databaseURL: 'https://snazzy-narwhal-on-fire.firebaseio.com',
  projectId: 'snazzy-narwhal-on-fire',
  storageBucket: 'snazzy-narwhal-on-fire.appspot.com',
  messagingSenderId: '502454037799',
};

const STORAGE_METADATA_PATH = 'storageMetadata/';

firebase.initializeApp(config);

function generateUid() {
  return uuidv4();
}
export function initMiddleware() {
  return reactReduxFirebase(firebase, {
    userProfile: 'users',
    enableRedirectHandling: false,
    profileParamsToPopulate: ['chats:chats'],
    autoPopulateProfile: true,
  });
}

export function createChatUser(firebaseRef, credentials, profile) {
  return firebaseRef.createUser(credentials, profile);
}

export function loginChatUser(firebaseRef, credentials) {
  return firebase.login(credentials);
}

function uploadImageWithMetadata(firebaseRef, file, filePath, fileName, fileOwner) {
  const options = {
    name: fileName,
    metadataFactory: (uploadRes) => {
      const { metadata } = uploadRes;
      const cleanMeta = omit({ ...metadata, fileOwner }, [
        'cacheControl',
        'contentLanguage',
        'customMetadata',
      ]);
      return cleanMeta;
    },
  };
  return firebaseRef.uploadFile(
    filePath,
    file,
    `${STORAGE_METADATA_PATH}/${filePath}`,
    options,
  );
}

export function uploadImage(firebaseRef, file, profileUid) {
  return uploadImageWithMetadata(
    firebaseRef,
    file,
    `gallery/${profileUid}`,
    `${generateUid()}.jpg`,
    profileUid,
  );
}

export function uploadAvatar(firebaseRef, file, profileUid) {
  return uploadImageWithMetadata(
    firebaseRef,
    file,
    `userAvatars/${profileUid}`,
    `${generateUid()}.jpg`,
    profileUid,
  );
}
