import { createAction, Storage } from '../util'

export default {
  namespace: 'app',
  state: {
    menuFlag: false,
    sunnyMode: true,
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    },
  },
  effects: {
    // *loadStorage(action, { call, put }) {
    //   const login = yield call(Storage.get, 'login', false)
    //   yield put(createAction('updateState')({ login, loading: false }))
    // },
    *menuSwitch(action, { select, call, put }) {
      let flag = yield select(state => state.app.menuFlag);
      yield put(createAction('updateState')({ menuFlag: !flag }))
    },
    *menuCtl({ flag }, { call, put }) {
      yield put(createAction('updateState')({ menuFlag: flag }))
    },
    *sunnyModeSwitch(action, { call, put }) {
      let flag = yield select(state => state.app.sunnyMode);
      yield put(createAction('updateState')({ sunnyMode: flag }))
    },
  },
}
