import React from 'react';

import dva from './util/dva';
import Tassel, { routerMiddleware, routerReducer } from './routers';
import appModel from './models/app';
import shelfModel from './models/shelf';


const app = dva({
  initialState: {},
  models: [appModel, shelfModel],
  extraReducers: { router: routerReducer },
  onAction: [routerMiddleware],
  onError(e) {
    console.log('onError', e);
  }
});

const App = app.start(<Tassel />);

export default App;
