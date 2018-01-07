import {
  LIST_ADD,
  LIST_READ,
  LIST_DELETE,
  LIST_UPDATE,
  LIST_INIT,
  LOADING_CTL,
  FETCH_FAILED,
  OPERATION_CLEAR,
  OPERATION_ADD,
  ORIGIN_CHANGE
} from '../actions/actionTypes';

import { insertionSort } from '../util/sort'

export const listState = {
  loadingFlag: false,
  isInit: false,
  operationNum: 0,
  errorMes: '',//等待完善抓取失败返回信息的功能。。
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
}

export default list = (state = listState, action) => {
  switch (action.type) {
    case OPERATION_CLEAR:
      state.operationNum = 0;
      return Object.assign({}, state);
    case OPERATION_ADD:
      state.operationNum++;
      return Object.assign({}, state);
    case ORIGIN_CHANGE:
      state.list[action.id].plantformId = action.change;
      return Object.assign({}, state);
    case LOADING_CTL:
      return Object.assign({}, state, { loadingFlag: action.flag });
    case LIST_INIT:
      if (action.list && action.list.length > 0) {
        action.list.filter(x => x.latestRead === undefined && (x.latestRead = 0));
        return Object.assign({}, state, { list: action.list, isInit: true });
      } else {
        return Object.assign({}, state, { isInit: true });
      }
    case LIST_ADD:
      state.list.unshift(action.book);
      state.operationNum++;
      return Object.assign({}, state, { list: [...state.list] });
    case FETCH_FAILED:
      state.loadingFlag = false;
      return Object.assign({}, state);
    case LIST_READ:
      state.operationNum++;
      state.list[action.bookId].isUpdate = false; //阅读开始 清空检测到的更新。
      state.list[action.bookId].updateNum = 0;
      state.list[action.bookId].latestRead = new Date().getTime()
      insertionSort(state.list)
      return Object.assign({}, state, { list: [...state.list] });
    case LIST_DELETE:
      state.operationNum++;
      state.list.splice(action.bookId, 1);
      return Object.assign({}, state, { list: [...state.list] });
    case LIST_UPDATE:
      action.info.filter((x, index) => {
        if (x !== undefined) {
          state.operationNum++;
          let updateNum = state.list[index].updateNum + x.num; //记录之前的更新章节
          state.list[index].latestChapter = x.title;
          state.list[index].isUpdate = updateNum > 0;
          state.list[index].updateNum = updateNum;
        }
      });
      state.loadingFlag = false;
      return Object.assign({}, state, { list: [...state.list] });
    default:
      return state;
  }
}

