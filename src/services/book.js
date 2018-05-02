
import axios from 'axios';
import { serverIp } from '../config';

const StorageIp = 'https://testdb.leanapp.cn';
const currenthours = new Date().getHours();
let Ip = currenthours >= 9 && currenthours < 22 ? serverIp[0] : serverIp[1];

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
  try {
    const { data } = await axios.get(`${Ip}/analysis?action=2&url=${url}`, { timeout: 5000 });
    return data;
  } catch (error) {
    return -1;
  }
}

export async function latest(url) {
  try {
    const { data } = await axios.get(`${Ip}/analysis?action=3&url=${url}`, { timeout: 5000 });
    return data;
  } catch (err) {
    return '抓取失败';
  }
}

export async function latestLst(list) {
  try {
    const { data } = await axios.post(`${Ip}/analysis`, list, { timeout: 5000 });
    return data;
  } catch (err) {
    return '抓取失败';
  }
}

/**
 * 输入url 返回书籍列表
 * @param {String} url 
 */
export async function list(url) {
  try {
    url.indexOf('m.xs') !== -1 && (url = url + 'all.html')
    let { data } = await axios.get(`${Ip}/analysis?action=1&url=${url}`, { timeout: 5000 });
    let n = [], i = 0;
    while (i < data.length) {
      n.push({
        key: data[i].url,
        title: (data[i].title.length > 25 ? data[i].title.substr(0, 18) + '...' : data[i].title)
      });
      i++;
    }
    return n;
  } catch (error) {
    return [];
  }
}

export async function rnk(page) {
  try {
    const { data } = await axios.get(`${Ip}/rnklist?p=${page}`, { timeout: 5000 });
    return data;
  } catch (error) {
    return -1;
  }
}

export async function search(name, author = '', pid = '') {
  try {
    const { data } = await axios.get(`${StorageIp}/sear?name=${name}&aut=${author}&pid=${pid}`, { timeout: 5000 });
    return data;
  } catch (error) {
    return -1;
  }

}