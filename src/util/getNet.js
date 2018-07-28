
import { list, latest, latestLst } from '../services/book';
import { Storage } from './index'

export async function refreshChapter(booklist) {
  let tasks = [];
  let marklist = [];
  if(booklist == null || booklist.length === 0) return ;
  for (let i = 0, j = booklist.length; i < j; i++) {
    if (booklist[i].img === '-1') continue;
    marklist.push(`${booklist[i].bookName}_${booklist[i].plantformId}_list`);
    tasks.push({
      title: booklist[i].latestChapter,
      url: booklist[i].source[booklist[i].plantformId]
    });
  }
  let resArray = await latestLst(tasks); // 使用promise.all 并行执行网络请求，减少等待时间。
  let res = [];
  typeof resArray !== 'string' && resArray.filter((x, index) => {
    if (x !== '-1') {
      let n = [];
      for (let i = 0, j = x.list.length; i < j; i++) {
        n.push({
          key: x.list[i].url,
          title: (x.list[i].title.length > 25 ? x.list[i].title.substr(0, 18) + '...' : x.list[i].title)
        });
      }
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