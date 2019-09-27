import AsyncStorage from '@react-native-community/async-storage';

let keyMap = [];
get('Tassel@keyMap', [
  new Set(), // cacheMap
  new Set(), // listMap
  new Set() // recordMap
]).then(val => {
  val = typeof val === 'string' ? JSON.parse(val) : val;
  for (let i = 0; i < 3; i++) {
    keyMap[i] = val[i].size !== undefined ? val[i] : new Set(); // 检测是否为set类型
  }
});

function mapSave() {
  // type < 0的时候全部清空
  AsyncStorage.setItem('Tassel@keyMap', JSON.stringify(keyMap));
}

function clear(type = 0) {
  // type < 0的时候全部清空
  if (type > -1 && type < 3) {
    multiRemove(keyMap[type]).then(() => {
      keyMap[type] = new Set();
    });
  } else {
    AsyncStorage.clear();
  }
}

function get(key: string, defaultValue = null): Promise<any> {
  return AsyncStorage.getItem(key).then(value =>
    value !== null ? JSON.parse(value) : defaultValue
  );
}

function set(key: string, value: any, type = 0): void {
  if (type > -1 && type < 3) {
    //type = 0 默认是cache
    keyMap[type].add(key);
    AsyncStorage.setItem(key, JSON.stringify(value));
  }
}

function multiSet(array: any[], types: number[]) {
  for (let i = 0, j = array.length; i < j; i++) {
    keyMap[types[i]].add(array[i][0]);
  }
  AsyncStorage.multiSet(array);
}
/**
 *
 * @param {string} key
 */
function remove(key: string) {
  return AsyncStorage.removeItem(key);
}
/**
 *
 * @param {string} keys
 */
function multiGet(keys: string[]): Promise<any> {
  return AsyncStorage.multiGet([...keys]).then(stores => {
    const data = {};
    stores.forEach((result, i, store) => {
      data[i] = JSON.parse(store[i][1]);
    });
    return data;
  });
}

function multiRemove(keys: string[]) {
  return AsyncStorage.multiRemove([...keys]);
}

export default {
  clear,
  get,
  set,
  remove,
  multiGet,
  multiRemove,
  multiSet,
  mapSave
};
