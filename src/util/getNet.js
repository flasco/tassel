
import { list, latest, latestLst } from '../services/book';
import { Storage, spliceLine } from './index'

export async function refreshChapter(booklist) {
  let tasks = [];
  let marklist = [];
  if(booklist == null || booklist.length === 0) return ;
  booklist.forEach(item => {
    if (item.img !== '-1') {
      marklist.push(`${item.bookName}_${item.plantformId}_list`);
      tasks.push({
        title: item.latestChapter,
        url: item.source[item.plantformId]
      });
    }
  });

  let resArray = await latestLst(tasks);
  let res = [];
  typeof resArray !== -1 && resArray.filter((x, index) => {
    if (x !== '-1') {
      let n = x.list.map(item => {
        return {
          key: item.url,
          title: spliceLine(item.title, 18)
        }
      });

      let num = 0, length = x.list.length;
      for (let i = x.list.length - 1; i >= 0; i--) {
        if (x.list[i].title === booklist[index].latestChapter) {
          num = length - i - 1;
          break;
        }
      }
      booklist[index].latestChapter = x.title;
      res.push({
        title: x.title,
        num
      });
      Storage.set(marklist[index], n, 1);
    } else res.push('-1');
  })
  return res;
}

export async function refreshSingleChapter(book) {
  let bookChapterLstFlag = `${book.bookName}_${book.plantformId}_list`;
  let latest = await get(book.source[book.plantformId], bookChapterLstFlag, book.latestChapter)
  book.latestChapter = latest.title;
  return book;
}

export async function get(url, bookChapterLst, latech) {
  const title = await latest(url);
  if (title === latech) return;
  const data = await list(url);
  let length = data.length, num = 0;
  if (length < 1) return { title: '抓取失败', num: -1 };
  /**
     * 当书籍为未检测的时候不满足条件，num = 0，
     * 但是考虑到一开始添加书籍的时候就不应该显示更新这个状态，所以就这样~
     */
  for (let i = length - 1; i >= 0; i--) {
    if (data[i].title === latech) {
      num = length - i - 1;
      break;
    }
  }
  Storage.set(bookChapterLst, data, 1);
  return { title, num };
}