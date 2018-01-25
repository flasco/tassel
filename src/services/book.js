
import axios from 'axios';
import { serverIp } from '../config';

const StorageIp = 'https://testdb.leanapp.cn';
const currenthours = new Date().getHours();
let Ip = currenthours > 9 && currenthours < 22 ? serverIp[0] : serverIp[1];

export function changeServer() {
  let msg = '当前无需切换';
  if (Ip !== serverIp[0]) {
    Ip = serverIp[0];
    msg = '服务器已切换至主线';
  } else if (Ip !== serverIp[1]) {
    Ip = serverIp[1];
    msg = '服务器已切换至备用';
  }
  alert(msg);
}

export async function content(url) {
  return await axios.get(`${Ip}/analysis?action=2&url=${url}`, { timeout: 5000 });
}

export async function latest(url) {
  let res = '';
  try {
    res = await axios.get(`${Ip}/analysis?action=3&url=${url}`, { timeout: 5000 });
    res = res.data;
  } catch (err) {
    res = '抓取失败'
  }
  return res;

}

/**
 * 输入url 返回书籍列表
 * @param {String} url 
 */
export async function list(url) {
  let { err, data } = await axios.get(`${Ip}/analysis?action=1&url=${url}`, { timeout: 5000 });
  if(err){
    return [];
  }
  let n = [], i = 0;
  while (i < data.length) {
    n.push({
      key: data[i].url,
      title: (data[i].title.length > 25 ? data[i].title.substr(0, 18) + '...' : data[i].title)
    });
    i++;
  }
  return n;
}

export async function rnk(page) {
  return await axios.get(`${Ip}/rnklist?p=${page}`, { timeout: 5000 });
}

export async function search(name, author = '', pid = '') {
  return await axios.get(`${StorageIp}/sear?name=${name}&aut=${author}&pid=${pid}`, { timeout: 5000 });
}