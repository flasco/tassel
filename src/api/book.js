import { spliceLine } from '../util';
import { get, post } from '../util/request';

import { serverIps } from '../config';

const currenthours = new Date().getHours();
const curPoi = currenthours >= 9 && currenthours < 22 ? 0 : 1;
let Ip = serverIps[curPoi];

const searchIp = 'https://koapi.leanapp.cn';

export function changeServer() {
  let msg = '当前无需切换';
  if (Ip !== serverIps[0]) {
    Ip = serverIps[0];
    msg = '服务器已切换至主线';
  } else if (Ip !== serverIps[1]) {
    Ip = serverIps[1];
    msg = '服务器已切换至备用';
  }
  alert(msg);
}

export async function content(url, showMsg = true) {
  const data = await get(`${Ip}/v2/analysis?action=2&url=${url}`, showMsg);
  return data;
}

export async function latest(url) {
  const data = await get(`${Ip}/v2/analysis?action=3&url=${url}`);
  return data;
}

export async function latestLst(list) {
  const data = await post(`${Ip}/v2/analysis`, list);
  return data;
}

/**
 * 输入url 返回书籍列表
 * @param {String} url
 */
export async function list(url) {
  // /m.xs/g.test(url) && (url = url + 'all.html');
  const data = await get(`${Ip}/v2/analysis?action=1&url=${url}`);
  if (data !== -1) {
    const n = data.map(item => {
      return {
        key: item.url,
        title: spliceLine(item.title, 18)
      };
    });
    return n;
  }
  return [];
}

export async function rnk(page, gender = 0) {
  const data = await get(`${Ip}/v2/rnklist?p=${page}&gender=${gender}`);
  return data;
}

export async function search(name, author = '', pid = '') {
  const data = await get(`${searchIp}/v2/sear?name=${name}&aut=${author}&pid=${pid}`);
  return data;
}
