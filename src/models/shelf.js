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
    isFatten: false,
    list: [{
      bookName: '天醒之路',
      author: '蝴蝶蓝',
      img: 'http://www.xs.la/BookFiles/BookImages/64.jpg',
      desc: '“路平，起床上课。”\n“再睡五分钟。”\n“给我起来！”\n哗！阳光洒下，照遍路平全身。\n“啊！！！”惊叫声顿时响彻云霄，将路平的睡意彻底击碎，之后已是苏唐摔门而出的怒吼：“什么条件啊你玩裸睡？！”\n......',
      latestChapter: '上架感言!',
      plantformId: 1,
      latestRead: 0,
      isUpdate: false,
      updateNum: 0,
      source: {
        '1': 'http://www.xs.la/0_64/',
        '2': 'http://www.kanshuzhong.com/book/36456/',
      }
    }],
    fattenList: []
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    },
  },
  effects: {
    *listInit(action, { call, put }) { //fix
      const list = yield call(Storage.get, 'booklist');
      const fattenList = yield call(Storage.get, 'fattenList');
      // 截止2018-02-07 之前的所有app用户需要走一遍这个代码更新一下source， 2018-02-14之后删除。
      // list && list.length > 0 && list.filter(x => {
      //   x.latestRead === undefined && (x.latestRead = 0)
      //   x.source[1] && x.source[1].indexOf('m.xs') === -1 && (x.source[1] = x.source[1].replace(/www/, 'm'));
      // });
      // fattenList && fattenList.length > 0 && fattenList.filter(x => {
      //   x.latestRead === undefined && (x.latestRead = 0)
      //   x.source[1] && x.source[1].indexOf('m.xs') === -1 && (x.source[1] = x.source[1].replace(/www/, 'm'));
      // });

      yield put(createAction('updateState')({ init: true, list, fattenList }));
    },
    *operationClear(action, { call, put }) {
      yield put(createAction('updateState')({ operationNum: 0 }));
    },
    *operationAdd(action, { select, call, put }) {
      let operationNum = yield select(state => state.list.operationNum) + 1;
      yield put(createAction('updateState')({ operationNum }));
    },
    *changeOrigin({ id, change }, { select, call, put }) {
      let list = yield select(state => state.list.list);
      list[id].plantformId = change;
      yield put(createAction('updateState')({ list }));
    },
    *listUpdate({ callback }, { select, call, put }) {
      yield put(createAction('updateState')({ loadingFlag: true }));
      let listState = yield select(state => state.list);
      let tasks = [refreshChapter(listState.list), refreshChapter(listState.fattenList)];
      const resArr = yield call(Promise.all, tasks);
      let updateBook = 0;
      resArr[0].filter((x, index) => {
        if (x !== undefined) {
          let updateNum = listState.list[index].updateNum + x.num;
          listState.list[index].latestChapter = x.title;
          listState.list[index].isUpdate = updateNum > 0;
          listState.list[index].updateNum = updateNum;
          if (x.num !== -1) {
            updateBook++
          } else {
            callback && callback(`有一本书籍抓取失败了。。`);
          }
        }
      });
      resArr[1].filter((x, index) => {
        if (x !== undefined) {
          let updateNum = listState.fattenList[index].updateNum + x.num;
          listState.fattenList[index].latestChapter = x.title;
          listState.fattenList[index].isUpdate = updateNum > 0;
          listState.fattenList[index].updateNum = updateNum;
          !listState.isFatten && updateNum > 30 && (listState.isFatten = true);
        }
      });
      callback && callback(`${updateBook}本书有更新`);
      yield put(createAction('updateState')({
        list: listState.list,
        loadingFlag: false,
        isFatten: listState.isFatten,
        fattenList: listState.fattenList,
        operationNum: listState.operationNum + 1,
      }));
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
    *fattenBook({ bookId }, { select, call, put }) {
      let listState = yield select(state => state.list);
      let book = listState.list.splice(bookId, 1);
      if (listState.fattenList.length === 0) {
        listState.list.push({
          bookName: '养肥区',
          author: 'admin',
          img: '-1',
          desc: '书籍变肥的地方~',
          latestChapter: '待检测',
          plantformId: 1,
          latestRead: -1,
          isUpdate: false,
          updateNum: 0,
          source: {
            '1': '',
            '2': '',
          }
        });
      }
      listState.fattenList.unshift(...book);
      yield put(createAction('updateState')({
        list: [...listState.list],
        fattenList: [...listState.fattenList],
        operationNum: listState.operationNum + 1,
      }));
    },
    *moveBook({ bookId }, { select, call, put }) {
      let listState = yield select(state => state.list);
      let book = listState.fattenList.splice(bookId, 1);
      insertionSort(listState.list);
      if (listState.fattenList.length === 0) {
        listState.list.pop(); //弹出养肥区（因为养肥区的readTime为0，排序之后必定在最后）
      }
      listState.list.unshift(...book);
      yield put(createAction('updateState')({
        list: [...listState.list],
        fattenList: [...listState.fattenList],
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
