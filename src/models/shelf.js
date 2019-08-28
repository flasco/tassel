import { createAction, Storage, insertionSort } from '@util';
import { refreshChapter, refreshSingleChapter } from '@util/getNet';
import Toast from '@components/Toast';

export default {
  namespace: 'list',
  state: {
    init: false,
    operationNum: 0,
    loadingFlag: false,
    btnLoading: false,
    isContain: false,
    isFatten: false,
    list: [
      {
        bookName: '天醒之路',
        author: '蝴蝶蓝',
        img: 'http://www.xs.la/BookFiles/BookImages/64.jpg',
        desc:
          '“路平，起床上课。”\n“再睡五分钟。”\n“给我起来！”\n哗！阳光洒下，照遍路平全身。\n“啊！！！”惊叫声顿时响彻云霄，将路平的睡意彻底击碎，之后已是苏唐摔门而出的怒吼：“什么条件啊你玩裸睡？！”\n......',
        latestChapter: '上架感言!',
        plantformId: 1,
        latestRead: 0,
        isUpdate: false,
        updateNum: 0,
        source: {
          '1': 'http://www.xs.la/0_64/',
          '2': 'http://www.kanshuzhong.com/book/36456/'
        }
      }
    ],
    fattenList: []
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
    operationSet(state, { payload }) {
      return {
        ...state,
        operationNum: payload > 0 ? state.operationNum + 1 : 0
      };
    },
    originChange(state, { payload }) {
      let list = state.list;
      if (list[payload.id].bookName === payload.bookName) {
        list[payload.id].plantformId = payload.change;
        list[payload.id].latestChapter = payload.latestChapter; // 修复换源之后无法刷新最新章节的bug
      } else {
        Toast.show('不在书架中，换源失败。');
      }
      return { list, ...state };
    },
    containSet(state, { payload }) {
      return { ...state, isContain: payload };
    }
  },
  effects: {
    *listInit(action, { call, put }) {
      const resArr = yield call(Storage.multiGet, ['booklist', 'fattenList']);
      yield put(
        createAction('updateState')({
          init: true,
          list: resArr[0] == null ? [] : resArr[0],
          fattenList: resArr[1] == null ? [] : resArr[1]
        })
      );
    },
    *operationClear(action, { call, put }) {
      yield put(createAction('operationSet')(0));
    },
    *operationAdd(action, { call, put }) {
      yield put(createAction('operationSet')(1));
    },
    *changeOrigin({ id, change, latestChapter, bookName }, { call, put }) {
      yield put(
        createAction('originChange')({ id, change, latestChapter, bookName })
      );
    },
    *listUpdate({ list, fattenList, isFatten }, { call, put }) {
      yield put(createAction('updateState')({ loadingFlag: true }));
      const resArr = yield call(Promise.all, [
        refreshChapter(list),
        refreshChapter(fattenList)
      ]);

      let [updateBook, updateNum] = [0, 0];
      Array.isArray(resArr[0]) &&
        resArr[0].filter((x, index) => {
          if (x !== '-1') {
            // -1 意味着是最新的，无需更新
            if (x.num !== 0) {
              updateNum = list[index].updateNum + x.num;
              list[index].latestChapter = x.title;
              list[index].isUpdate = updateNum > 0;
              list[index].updateNum = updateNum;
              updateBook++;
            }
          }
        });
      Array.isArray(resArr[1]) &&
        resArr[1].filter((x, index) => {
          if (x !== '-1') {
            // -1 意味着是最新的，无需更新
            if (x.num !== 0) {
              updateNum = fattenList[index].updateNum + x.num;
              fattenList[index].latestChapter = x.title;
              fattenList[index].isUpdate = updateNum > 0;
              fattenList[index].updateNum = updateNum;
            }
            !isFatten && updateNum > 30 && (isFatten = true);
          }
        });
      Toast.show(`${updateBook}本书有更新`);
      yield put(
        createAction('updateState')({
          list,
          loadingFlag: false,
          isFatten,
          fattenList
        })
      );
      yield put(createAction('operationSet')(1));
    },
    *listAdd({ book, list }, { select, call, put }) {
      yield put(createAction('updateState')({ btnLoading: true }));
      const latestBook = yield call(refreshSingleChapter, book);
      list.unshift(latestBook);
      yield put(
        createAction('updateState')({
          list,
          btnLoading: false,
          isContain: true
        })
      );
      yield put(createAction('operationSet')(1));
    },
    *setContain({ flag }, { call, put }) {
      yield put(createAction('containSet')(flag));
    },
    *listDelete({ bookId, list }, { select, call, put }) {
      //fix
      list.splice(bookId, 1);
      yield put(
        createAction('updateState')({
          list
        })
      );
      yield put(createAction('operationSet')(1));
    },
    *bookRead({ bookId, list }, { call, put }) {
      list[bookId].isUpdate = false; //阅读开始 清空检测到的更新。
      list[bookId].updateNum = 0;
      list[bookId].latestRead = new Date().getTime();
      insertionSort(list);
      yield put(
        createAction('updateState')({
          list
        })
      );
      yield put(createAction('operationSet')(1));
    },
    *fattenBook({ bookId, list, fattenList }, { select, call, put }) {
      let book = list.splice(bookId, 1);
      if (fattenList.length === 0) {
        list.push({
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
            '2': ''
          }
        });
      }
      fattenList.unshift(...book);
      yield put(
        createAction('updateState')({
          list: [...list],
          fattenList: [...fattenList]
        })
      );
      yield put(createAction('operationSet')(1));
    },
    *moveBook({ bookId }, { select, call, put }) {
      let listState = yield select(state => state.list);
      let book = listState.fattenList.splice(bookId, 1);
      insertionSort(listState.list);
      if (listState.fattenList.length === 0) {
        listState.list.pop(); //弹出养肥区（因为养肥区的readTime为0，排序之后必定在最后）
      }
      listState.list.unshift(...book);
      yield put(
        createAction('updateState')({
          list: [...listState.list],
          fattenList: [...listState.fattenList]
        })
      );
      yield put(createAction('operationSet')(1));
    }
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'listInit' });
    }
  }
};
