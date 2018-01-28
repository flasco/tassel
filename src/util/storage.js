import { AsyncStorage } from 'react-native'
let keyMap = [];
get('Tassel@keyMap', [
  new Set(),  //cacheMap:
  new Set(),  //listMap:
  new Set(),  //recordMap:
]).then(val => {
  val = typeof val === 'string' ? JSON.parse(val) : val;
  for (let i = 0; i < 3; i++) {
    keyMap[i] = val[i].size !== undefined ? val[i] : new Set(); //检测是否为set类型
  }
});

function mapSave() { // type < 0的时候全部清空
  AsyncStorage.setItem('Tassel@keyMap', JSON.stringify(keyMap));
}

function clear(type = 0) { // type < 0的时候全部清空
  if (type > -1 && type < 3) {
    multiRemove(keyMap[type]).then(() => {
      keyMap[type] = new Set();
    })
  } else {
    AsyncStorage.clear();
  }
}

function get(key, defaultValue = null) {
  return AsyncStorage.getItem(key).then(value =>
    (value !== null ? JSON.parse(value) : defaultValue)
  )
}

/**
 * 
 * @param {string} key 
 * @param {*} value 
 * @param {number} type 存储的级别定义
 */
function set(key, value, type = 0) {
  type > -1 && type < 3 && keyMap[type].add(key);  //type = 0 默认是cache
  return AsyncStorage.setItem(key, JSON.stringify(value));
}

function remove(key) {
  return AsyncStorage.removeItem(key);
}

function multiGet(keys) {
  return AsyncStorage.multiGet([...keys]).then(stores => {
    const data = {};
    stores.forEach((result, i, store) => {
      data[i] = JSON.parse(store[i][1]);
    });
    return data;
  })
}

function multiRemove(keys) {
  return AsyncStorage.multiRemove([...keys]);
}

export default {
  clear,
  get,
  set,
  remove,
  multiGet,
  multiRemove,
  mapSave
}
