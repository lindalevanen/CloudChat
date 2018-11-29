import * as firebase from 'firebase';
import { reactReduxFirebase } from 'react-redux-firebase';
import omit from 'lodash/omit';
import uuidv4 from 'uuid/v4';
import { Permissions, Notifications } from 'expo';

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
    profileParamsToPopulate: ['chats:chatMetadata'],
    autoPopulateProfile: true,
  });
}

export function createChatUser(firebaseRef, credentials, profile) {
  return firebaseRef.createUser(credentials, profile);
}

export function loginChatUser(firebaseRef, credentials) {
  return firebase.login(credentials);
}

export async function addRoomToUsers(firebaseRef, roomId, userIds) {
  return Promise.all(
    userIds.map(userId => firebaseRef.set(`users/${userId}/chats/${roomId}`, roomId)),
  );
}

export async function registerForPushNotificationsAsync(firebaseRef, user) {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS,
  );
  let finalStatus = existingStatus;

  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== 'granted') {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== 'granted') {
    return;
  }

  // Get the token that uniquely identifies this device
  const token = await Notifications.getExpoPushTokenAsync();

  const updates = {};
  updates['/expoToken'] = token;
  firebaseRef.update(`users/${user.uid}`, updates);
}

export async function createChatRoom(
  firebaseRef,
  groupChat,
  profileUids,
  title,
  imageUrl,
) {
  const members = {};
  profileUids.forEach((id) => {
    members[id] = {
      id,
      joined: Date.now(),
    };
  });
  const roomData = {
    createdAt: Date.now(),
    members,
    groupChat,
  };
  if (title) {
    roomData.title = title;
  }
  if (imageUrl) {
    roomData.avatarUrl = imageUrl;
  }
  const res = await firebaseRef.push('chatMetadata/', roomData);
  const roomID = res.path.pieces_[1]; // very hacky, but these lines will be ultimately removed

  await addRoomToUsers(firebaseRef, roomID, profileUids);

  return res;
}


function uploadImageWithMetadata(
  firebaseRef,
  file,
  filePath,
  fileName,
  fileOwner,
) {
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
  const name = quality !== 'original' ? `${quality}_${uid}` : uid;
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

export function pushChatEvent(firebaseRef, eventData, path) {
  return firebaseRef.push(path, eventData);
}

export function sendMessage(
  firebaseRef,
  messageString,
  chatId,
  sender,
  attachment = null,
) {
  if (messageString === '') {
    return Promise.reject(new Error('Empty message not sent'));
  }
  if (!chatId || !sender) {
    return Promise.reject(new Error('chatId or sender userId missing'));
  }
  const messageEvent = {
    type: 'message',
    timestamp: Date.now(),
    payload: {
      body: messageString,
      sender,
      attachment,
    },
  };

  console.log(messageEvent);
  return pushChatEvent(firebaseRef, messageEvent, `chatEvents/${chatId}`);
}

export function leaveChat(firebaseRef, chatId, userId) {
  if (!chatId || !userId) {
    return Promise.reject(new Error('chatId or userId missing'));
  }
  const res = firebaseRef.remove(
    `chatMetadata/${chatId}/members/${userId}`,
    () => {
      firebaseRef.remove(`users/${userId}/chats/${chatId}`);
    },
  );
  return res;
}
