export { NavigationActions } from 'react-navigation'

export { default as Storage } from './storage'

export const delay = time => new Promise(resolve => setTimeout(resolve, time))

export const createAction = type => payload => ({ type, payload })

export const createAct = type => payload => ({ type, ...payload })

export function insertionSort(arr) {
  var len = arr.length;
  var preIndex, current;
  for (var i = 1; i < len; i++) {
    preIndex = i - 1;
    current = arr[i];
    while (preIndex >= 0 && arr[preIndex].latestRead < current.latestRead) {
      arr[preIndex + 1] = arr[preIndex];
      preIndex--;
    }
    arr[preIndex + 1] = current;
  }
  return arr;
}

/**
 * Fisher–Yates 洗牌算法, 将数组随机排列
 * @param {*} arr 
 */
export function shuffle(arr) { 
  let i = arr.length;
  while (i) {
    let j = Math.floor(Math.random() * i--); // 获取一个随机的小于i的数，用floor进行取整
    [arr[j], arr[i]] = [arr[i], arr[j]]; // 两个数进行交换
  }
}