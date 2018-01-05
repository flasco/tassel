
import axios from 'axios';

const ServerIp = 'https://flasco.leanapp.cn';
const StorageIp = 'https://testdb.leanapp.cn';
const ServerSpareIp = 'https://flascospare.leanapp.cn';
let Ip = ServerIp;

export function changeServer() {
  let currentHours = new Date().getHours();
  let msg = '当前无需切换';
  if ((currentHours >= 21 || currentHours < 9) && Ip !== ServerSpareIp) {
    Ip = ServerSpareIp;
    msg = '服务器已切换至备用';
  } else if (currentHours < 21 && currentHours >= 9 && Ip !== ServerIp) {
    Ip = ServerIp;
    msg = '服务器已切换至主线';
  }
  alert(msg);
}

export async function content(url) {
  return await axios.get(`${Ip}/Analy_x?action=2&url=${url}`, { timeout: 5000 });
}

export async function list(url) {
  let { data } = await axios.get(`${Ip}/Analy_x?action=1&url=${url}`, { timeout: 5000 });
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