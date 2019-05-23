import { spliceLine } from '../util';
import { get, post } from '../util/request';

import { serverIps, searchIp } from '../config';

const getIp = (() => {
  let prevIp;
  let lockTime = Date.now();

  return () => {
    const current = Date.now();
    if (prevIp == null || current - lockTime > 3600 * 1000) {
      const currenthours = new Date().getHours();
      const curPoi = currenthours >= 9 && currenthours < 22 ? 0 : 1;
      prevIp = serverIps[curPoi];
      lockTime = current;
    }
    // return 'http://localhost:3000';
    return prevIp;
  };
})();

export function serverInfo() {
  let msg = getIp() === serverIps[0] ? '服务器当前为主线' : '服务器当前为备用';
  alert(msg);
}

export async function sourceRank() {
  const data = await get(`${getIp()}/v2/source-rank`);
  return data;
}

export async function content(url, showMsg = true) {
  const data = await get(`${getIp()}/v2/analysis?action=2&url=${url}`, showMsg);
  return data;
}

export async function latest(url) {
  const data = await get(`${getIp()}/v2/analysis?action=3&url=${url}`);
  return data;
}

export async function latestLst(list) {
  const data = await post(`${getIp()}/v2/analysis`, list);
  return data;
}

/**
 * 输入url 返回书籍列表
 * @param {String} url
 */
export async function list(url) {
  // /m.xs/g.test(url) && (url = url + 'all.html');
  const data = await get(`${getIp()}/v2/analysis?action=1&url=${url}`);
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
  const data = await get(`${getIp()}/v2/rnklist?p=${page}&gender=${gender}`);
  return data;
}

export async function search(name, author = '', pid = '') {
  const data = await get(
    `${searchIp}/v2/sear?name=${name}&aut=${author}&pid=${pid}`
  );
  return data;
}

export async function siteMap() {
  const data = await get(`${getIp()}/v2/site-map`);
  return data;
}
