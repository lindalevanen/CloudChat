import * as firebase from 'firebase';
import { reactReduxFirebase } from 'react-redux-firebase';

const config = {
  apiKey: 'AIzaSyATNwognBzftHzPB5BkfQF5IBJSF_4uaAY',
  authDomain: 'snazzy-narwhal-on-fire.firebaseapp.com',
  databaseURL: 'https://snazzy-narwhal-on-fire.firebaseio.com',
  projectId: 'snazzy-narwhal-on-fire',
  storageBucket: 'snazzy-narwhal-on-fire.appspot.com',
  messagingSenderId: '502454037799',
};

firebase.initializeApp(config);

export function initMiddleware() {
  return reactReduxFirebase(firebase, { userProfile: 'users', enableRedirectHandling: false });
}

export function createChatUser(firebaseRef, credentials, profile) {
  return firebaseRef.createUser(
    credentials,
    profile,
  );
}

export function loginChatUser(firebaseRef, credentials) {
  return firebase.login(credentials);
}
