import React from 'react';
import Tassel from './routers';

import dva from './util/dva';

import appModel from './models/app'
import shelfModel from './models/shelf'

const app = dva({
  initialState: {},
  models: [appModel, shelfModel],
  onError(e) {
    console.log('onError', e)
  },
})

const App = app.start(<Tassel />)

export default App;