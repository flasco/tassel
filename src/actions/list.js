import {
  LIST_ADD,
  LIST_DELETE,
  LIST_UPDATE,
  LIST_READ,
  LIST_INIT,
  LOADING_CTL,
  FETCH_FAILED,
  OPERATION_CLEAR,
  OPERATION_ADD,
  ORIGIN_CHANGE
} from './actionTypes';

import getNet from '../util/getNet'
import { AsyncStorage } from 'react-native';

export function listInit() {
  return dispatch => {
    dispatch(requestFetch());
    return AsyncStorage.getItem('booklist')
      .then(booklist => JSON.parse(booklist))
      .then(list => {
        dispatch(receivelistInit(list))
      })
  }
}

export function changeOrigin(params) {
  return { type: ORIGIN_CHANGE, ...params }
}

function receivelistInit(list) {
  return { type: LIST_INIT, list }
}

export function listAdd(book) {
  return dispatch => {
    dispatch(requestFetch());
    return getNet.refreshSingleChapter(book)
      .then(latestBook => dispatch(receiveAddFetch(latestBook)))
  }
}

export function OperationAdd() {
  return { type: OPERATION_ADD }
}

export function OperationClear() {
  return { type: OPERATION_CLEAR }
}

function requestFetch(type = 'NULL') {
  return { type }
}

function receiveAddFetch(book) {
  return { type: LIST_ADD, book }
}

export function listDelete(bookId) {
  return { type: LIST_DELETE, bookId }
}

export function loadingCrl(flag) {
  return { type: LOADING_CTL, flag }
}

export function listUpdate(list) {
  return dispatch => {
    dispatch(loadingCrl(true));
    return getNet.refreshChapter(list)
      .then(latestInfo => {
        dispatch(receiveUpdateFetch(latestInfo));
      }).catch(err => {
        dispatch(fetchFailed('request timeout.'))
      })
  }
}

function fetchFailed(message) {
  return { type: FETCH_FAILED, message }
}

function receiveUpdateFetch(info) {
  return { type: LIST_UPDATE, info }
}

export function listRead(bookId) {
  return { type: LIST_READ, bookId }
}