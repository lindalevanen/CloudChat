import * as firebase from 'firebase';

const { firMiddleware } = require('redux-firebase-middleware');

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
  return firMiddleware(firebase);
}
