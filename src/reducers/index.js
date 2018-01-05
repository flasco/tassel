import { combineReducers } from 'redux';

import list, { listState } from './list';
import app, { appState } from './app';

export const initalState = {
  list: { ...listState },
  app: { ...appState },
}

const rootReducer = combineReducers({
  list,
  app,
});

export default rootReducer;