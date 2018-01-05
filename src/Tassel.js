import { Provider } from 'react-redux'
import React from 'react';
import Tassel from './routers';

import store from './store';


export default () => (
  <Provider store={store}>
    <Tassel />
  </Provider>
);