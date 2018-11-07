import {
  applyMiddleware, createStore, combineReducers, compose,
} from 'redux';
import thunkMiddleware from 'redux-thunk';

import { chatReducer } from './chat/reducer';

const rootReducer = combineReducers({ chat: chatReducer });

export default function configureStore(preloadedState) {
  const middlewares = [thunkMiddleware];
  const middlewareEnhancer = applyMiddleware(...middlewares);

  const enhancers = compose(middlewareEnhancer);

  const store = createStore(rootReducer, preloadedState, enhancers);
  return store;
}
