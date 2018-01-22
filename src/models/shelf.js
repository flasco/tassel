import { createAction, Storage } from '../util';
import { refreshChapter, refreshSingleChapter } from '../util/getNet';
import { insertionSort } from '../util';

export default {
  namespace: 'list',
  state: {
    init: false,
    operationNum: 0,
    loadingFlag: false,
    btnLoading: false,
    isContain: false,
    errorMes: '', //等待完善抓取失败返回信息的功能。。
    list: [{
      bookName: '天醒之路',
      author: '蝴蝶蓝',
      img: 'http://www.xs.la/BookFiles/BookImages/64.jpg',
      desc: '“路平，起床上课。”\n“再睡五分钟。”\n“给我起来！”\n哗！阳光洒下，照遍路平全身。\n“啊！！！”惊叫声顿时响彻云霄，将路平的睡意彻底击碎，之后已是苏唐摔门而出的怒吼：“什么条件啊你玩裸睡？！”\n......',
      latestChapter: '待检测',
      plantformId: 1,
      latestRead: 0,
      isUpdate: false,
      updateNum: 0,
      source: {
        '1': 'http://www.xs.la/0_64/',
        '2': 'http://www.kanshuzhong.com/book/36456/',
      }
    }],
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    },
  },
  effects: {
    *operationClear(action, { call, put }) {
      yield put(createAction('updateState')({ operationNum: 0 }));
    },
    *operationAdd(action, { call, put }) {
      yield put(createAction('updateState')({ operationNum: state.operationNum + 1 }));
    },
    *changeOrigin({ id, change }, { select, call, put }) {
      let list = yield select(state => state.list.list);
      list[id].plantformId = change;
      yield put(createAction('updateState')({ list }));
    },
    *listUpdate(action, { select, call, put }) {
      yield put(createAction('updateState')({ loadingFlag: true }));
      let listState = yield select(state => state.list);
      const latestInfo = yield call(refreshChapter, listState.list);
      latestInfo.filter((x, index) => {
        if (x !== undefined) {
          let updateNum = listState.list[index].updateNum + x.num; //记录之前的更新章节
          listState.list[index].latestChapter = x.title;
          listState.list[index].isUpdate = updateNum > 0;
          listState.list[index].updateNum = updateNum;
        }
      });
      yield put(createAction('updateState')({
        list: listState.list, loadingFlag: false, operationNum: listState.operationNum + 1
      }));
    },
    *listInit(action, { call, put }) { //fix
      const list = yield call(Storage.get, 'booklist', false);
      if (list && list.length > 0) {
        list.filter(x => x.latestRead === undefined && (x.latestRead = 0));
        yield put(createAction('updateState')({ list }));
      }
      yield put(createAction('updateState')({ init: true }));
    },
    *listAdd({ book }, { select, call, put }) {
      yield put(createAction('updateState')({ btnLoading: true }));
      let listState = yield select(state => state.list);
      const latestBook = yield call(refreshSingleChapter, book);
      listState.list.unshift(latestBook);
      yield put(createAction('updateState')({
        list: listState.list,
        operationNum: listState.operationNum + 1,
        btnLoading: false,
        isContain: true
      }));
    },
    *setContain({ flag }, { call, put }) {
      yield put(createAction('updateState')({
        isContain: flag
      }));
    },
    *listDelete({ bookId }, { select, call, put }) { //fix
      let listState = yield select(state => state.list);
      listState.list.splice(bookId, 1);
      yield put(createAction('updateState')({
        list: listState.list,
        operationNum: listState.operationNum + 1
      }));
    },
    *bookRead({ bookId }, { select, call, put }) {
      let listState = yield select(state => state.list);
      listState.list[bookId].isUpdate = false; //阅读开始 清空检测到的更新。
      listState.list[bookId].updateNum = 0;
      listState.list[bookId].latestRead = new Date().getTime();
      insertionSort(listState.list);
      yield put(createAction('updateState')({
        list: listState.list,
        operationNum: listState.operationNum + 1
      }));
    },
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'listInit' });
    },
  },
}
