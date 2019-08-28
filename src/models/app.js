import { siteMap } from '@api/book';
import { createAction, Storage } from '@util';

export default {
  namespace: 'app',
  state: {
    menuFlag: false,
    sunnyMode: true,
    siteMap: {},
    readNum: 0
  },
  reducers: {
    initState(state, { payload }) {
      return {
        ...state,
        sunnyMode: payload.sunnyMode,
        readNum: payload.readNum || 0,
        siteMap: payload.siteMap
      };
    },
    readNumAdd(state, { payload }) {
      return {
        ...state,
        readNum: state.readNum + payload
      };
    },
    modeSwitch(state, { payload }) {
      return { ...state, menuFlag: !state.menuFlag };
    },
    modeContrl(state, { payload }) {
      return { ...state, menuFlag: payload };
    },
    sunnyModeSwh(state, { payload }) {
      return { ...state, sunnyMode: !state.sunnyMode };
    }
  },
  effects: {
    *appInit(action, { call, put }) {
      const appState = yield call(Storage.get, 'appState', {});
      const sites = yield call(siteMap);
      if (sites !== -1) appState.siteMap = sites;
      yield put(createAction('initState')(appState));
    },
    *menuSwitch(action, { call, put }) {
      yield put(createAction('modeSwitch')());
    },
    *sunnyModeSwitch(action, { call, put }) {
      yield put(createAction('sunnyModeSwh')());
    },
    *menuCtl({ flag }, { call, put }) {
      yield put(createAction('modeContrl')(flag));
    },
    *readAdd({ num }, { call, put }) {
      yield put(createAction('readNumAdd')(num));
    }
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'appInit' });
    }
  }
};
