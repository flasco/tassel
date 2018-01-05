
import { AsyncStorage } from 'react-native'
import { list } from '../services/book';

export default class getNet {
  static async refreshChapter(booklist) {
    let tasks = [];
    for (let i = 0, j = booklist.length; i < j; i++) {
      if(booklist[i].img === '-1') continue;
      let bookChapterLst = `${booklist[i].bookName}_${booklist[i].plantformId}_list`;
      let latech = booklist[i].latestChapter;
      tasks.push(this.get(booklist[i].source[booklist[i].plantformId], bookChapterLst, latech))
    }
    let resArray = await Promise.all(tasks); // 使用promise.all 并行执行网络请求，减少等待时间。
    resArray.filter((x, index) => {
      x !== undefined && (booklist[index].latestChapter = x.title);
    })
    return resArray;
  }

  static async refreshSingleChapter(book) {
    let bookChapterLstFlag = `${book.bookName}_${book.plantformId}_list`;
    let latest = await this.get(book.source[book.plantformId], bookChapterLstFlag, book.latestChapter)
    book.latestChapter = latest.title;
    return book;
  }

  static async get(url, bookChapterLst, latech) {
    const data = await list(url);
    let length = data.length;
    let tit = data[length - 1].title;
    if (tit === latech) {
      return;
    } else {
      let num = 0;
      for (let i = length - 1; i >= 0; i--) {
        /**
         * 当书籍为未检测的时候不满足条件，num = 0，
         * 但是考虑到一开始添加书籍的时候就不应该显示更新这个状态，所以就这样~
         */
        if(data[i].title === latech){
          num = length - i - 1;
          break;
        }
      }
      AsyncStorage.setItem(bookChapterLst, JSON.stringify(data));
      return { title: tit, num };
    }
  }
}