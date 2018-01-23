import React from 'react';

import dva from './util/dva';
import Tassel from './routers';
import appModel from './models/app';
import shelfModel from './models/shelf';
import routerModel from './models/router';

const app = dva({
  initialState: {},
  models: [appModel, shelfModel,routerModel],
  onError(e) {
    console.log('onError', e)
  },
})

const App = app.start(<Tassel />)

export default App;