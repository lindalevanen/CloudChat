import {
  applyMiddleware, createStore, combineReducers, compose,
} from 'redux';

import thunkMiddleware from 'redux-thunk';

// import logger from 'redux-logger';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { firebaseReducer } from 'react-redux-firebase';

import { initMiddleware as initFirebaseMiddleware } from './utils/firebase';

import { appStatusReducer } from './appStatus/reducer';
import { chatReducer } from './chat/reducer';
import { settingsReducer } from './settings/reducer';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['settings'],
};

const rootReducer = combineReducers({
  chat: chatReducer,
  appStatus: appStatusReducer,
  firebase: firebaseReducer,
  settings: settingsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

let store;

export default function configureStore(preloadedState) {
  const middlewares = [thunkMiddleware];
  const middlewareEnhancer = applyMiddleware(...middlewares);

  const enhancers = compose(
    initFirebaseMiddleware(),
    middlewareEnhancer,
  );
  store = createStore(persistedReducer, preloadedState, enhancers);
  const persistor = persistStore(store);

  return { store, persistor };
}

export const getState = () => store.getState();
