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

export function createChatRoom(firebaseRef, groupChat, profileUids, title, imageUrl) {
  const keysAsValsUids = {};
  profileUids.forEach((x) => { keysAsValsUids[x] = x; });
  const roomData = {
    lastMessage: '',
    timeModified: (new Date()).getTime(),
    members: keysAsValsUids,
    groupChat,
  };
  if (title) {
    roomData.title = title;
  }
  if (imageUrl) {
    roomData.avatarUrl = imageUrl;
  }
  const res = firebaseRef.push('chats/', roomData);
  const roomID = res.path.pieces_[1]; // very hacky, but these lines will be ultimately removed

  addRoomToUsers(firebaseRef, roomID, profileUids);

  return res;
}

/* TODO: this should be ultimately done with FB functions */
export function addRoomToUsers(firebaseRef, roomId, userIds) {
  for (i in userIds) {
    firebaseRef.set(`users/${userIds[i]}/chats/${roomId}`, roomId);
  }
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

function nameImage(quality = null) {
  const uid = generateUid();
  const name = (quality !== 'original') ? `${quality}_${uid}` : uid;
  return name;
}

export function uploadAvatar(firebaseRef, file, profileUid, quality = null) {
  return uploadImageWithMetadata(
    firebaseRef,
    file,
    `userAvatars/${profileUid}`,
    `${nameImage(quality)}.jpg`,
    profileUid,
  );
}
