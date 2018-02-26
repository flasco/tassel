import { createAction, Storage } from '../util'

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
    readNumAdd(state, { payload }) {
      return {
        ...state,
        readNum: state.readNum + payload
      }
    },
    modeSwitch(state, { payload }) {
      return { ...state, menuFlag: !state.menuFlag }
    },
    modeContrl(state, { payload }) {
      return { ...state, menuFlag: payload }
    },
    sunnyModeSwh(state, { payload }) {
      return { ...state, sunnyMode: !state.sunnyMode }
    }
  },
  effects: {
    *appInit(action, { call, put }) {
      const appState = yield call(Storage.get, 'appState');
      yield put(createAction('updateState')({ ...appState }))
    },
    *menuSwitch(action, { call, put }) {
      yield put(createAction('modeSwitch')())
    },
    *sunnyModeSwitch(action, { call, put }) {
      yield put(createAction('sunnyModeSwh')())
    },
    *menuCtl({ flag }, { call, put }) {
      yield put(createAction('modeContrl')(flag))
    },
    *readAdd({ num }, { call, put }) {
      yield put(createAction('readNumAdd')(num));
    },
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'appInit' });
    },
  },
}
