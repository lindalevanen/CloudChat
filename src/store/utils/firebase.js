import * as firebase from 'firebase';
import { reactReduxFirebase } from 'react-redux-firebase';
import omit from 'lodash/omit';
import uuidv4 from 'uuid/v4';

const config = {
  apiKey: 'AIzaSyDkeQYJzG9EDpiHKvkQyWPJ-MBOzRtFdg4',
  authDomain: 'mcc-fall-2018-g20-223013.firebaseapp.com',
  databaseURL: 'https://mcc-fall-2018-g20-223013.firebaseio.com',
  projectId: 'mcc-fall-2018-g20-223013',
  storageBucket: 'mcc-fall-2018-g20-223013.appspot.com',
  messagingSenderId: '924342250338',
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

export function uploadAvatar(firebaseRef, file, profileUid) {
  return uploadImageWithMetadata(
    firebaseRef,
    file,
    `userAvatars/${profileUid}`,
    `${generateUid()}.jpg`,
    profileUid,
  );
}

export function sendMessage(firebaseRef, messageString, chatId, userId) {
  if (messageString === '') {
    return Promise.reject(new Error('Empty message not sent'));
  }
  if (!chatId || !userId) {
    return Promise.reject(new Error('chatId or userId missing'));
  }
  const messageData = {
    body: messageString,
    createdAt: Date.now(),
    sender: userId,
    attachment: '',
  };
  return firebaseRef.push(`chats/${chatId}/messages`, messageData);
}
