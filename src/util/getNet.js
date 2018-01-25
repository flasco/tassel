
import { AsyncStorage } from 'react-native'
import { list, latest } from '../services/book';

export async function refreshChapter(booklist) {
  let tasks = [];
  for (let i = 0, j = booklist.length; i < j; i++) {
    if (booklist[i].img === '-1') continue;
    let bookChapterLst = `${booklist[i].bookName}_${booklist[i].plantformId}_list`;
    let latech = booklist[i].latestChapter;
    tasks.push(get(booklist[i].source[booklist[i].plantformId], bookChapterLst, latech))
  }
  let resArray = await Promise.all(tasks); // 使用promise.all 并行执行网络请求，减少等待时间。
  resArray.filter((x, index) => {
    x !== undefined && (booklist[index].latestChapter = x.title);
  })
  return resArray;
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
  AsyncStorage.setItem(bookChapterLst, JSON.stringify(data));
  return { title, num };
}