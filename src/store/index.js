import {
  applyMiddleware, createStore, combineReducers, compose,
} from 'redux';
import thunkMiddleware from 'redux-thunk';
// import logger from 'redux-logger';
import { firebaseReducer } from 'react-redux-firebase';

import { initMiddleware as initFirebaseMiddleware } from './utils/firebase';

import { chatReducer } from './chat/reducer';
import { settingsReducer } from './settings/reducer';

const rootReducer = combineReducers({
  chat: chatReducer,
  firebase: firebaseReducer,
  settings: settingsReducer,
});

let store;

export default function configureStore(preloadedState) {
  const middlewares = [thunkMiddleware];
  const middlewareEnhancer = applyMiddleware(...middlewares);

  const enhancers = compose(
    initFirebaseMiddleware(),
    middlewareEnhancer,
  );

  store = createStore(rootReducer, preloadedState, enhancers);
  return store;
}

export const getState = () => store.getState();
