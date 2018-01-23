import { createAction, Storage } from '../util'
import storage from '../util/storage';

export default {
  namespace: 'app',
  state: {
    menuFlag: false,
    sunnyMode: true,
    readNum: 0,
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    },
  },
  effects: {
    *appInit(action, { call, put }) {
      const appState = yield call(storage.get, 'appState');
      yield put(createAction('updateState')({ ...appState }))
    },
    *menuSwitch(action, { select, call, put }) {
      let flag = yield select(state => state.app.menuFlag);
      yield put(createAction('updateState')({ menuFlag: !flag }))
    },
    *sunnyModeSwitch(action, { select, call, put }) {
      let flag = yield select(state => state.app.sunnyMode);
      yield put(createAction('updateState')({ sunnyMode: !flag }))
    },
    *menuCtl({ flag }, { call, put }) {
      yield put(createAction('updateState')({ menuFlag: flag }))
    },
    *readAdd({ num }, { select, call, put }) {
      const re = yield select(state => state.app.readNum);
      yield put(createAction('updateState')({ readNum: re + num }));
    },
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'appInit' });
    },
  },
}
