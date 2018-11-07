import {
  applyMiddleware, createStore, combineReducers, compose,
} from 'redux';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';
import { initMiddleware } from './utils/initFirebase';

import { chatReducer } from './chat/reducer';

const rootReducer = combineReducers({ chat: chatReducer });

export default function configureStore(preloadedState) {
  const firebaseMiddleware = initMiddleware();
  const middlewares = [thunkMiddleware, firebaseMiddleware, logger];
  const middlewareEnhancer = applyMiddleware(...middlewares);

  const enhancers = compose(middlewareEnhancer);

  const store = createStore(rootReducer, preloadedState, enhancers);
  return store;
}

console.log('moi');
