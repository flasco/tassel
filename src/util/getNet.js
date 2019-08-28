import { list, latest, latestLst } from '@api/book';
import { Storage, spliceLine } from '@util';

export async function refreshChapter(booklist) {
  try {
    const tasks = [];
    const marklist = [];
    if (booklist == null || booklist.length === 0) return;
    booklist.forEach(item => {
      if (item.img !== '-1') {
        marklist.push(`${item.bookName}_${item.plantformId}_list`);
        tasks.push({
          title: item.latestChapter,
          url: item.source[item.plantformId]
        });
      }
    });

    const resArray = await latestLst(tasks);
    const res = [];
    resArray !== -1 &&
      Array.isArray(resArray) &&
      resArray.filter((x, index) => {
        if (x !== '-1') {
          let n = x.list.map(item => {
            return {
              key: item.url,
              title: spliceLine(item.title, 18)
            };
          });

          let num = 0;
          let length = x.list.length;
          for (let i = length - 1; i >= 0; i--) {
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
      });
    return res;
  } catch (e) {}
}

export async function refreshSingleChapter(book) {
  try {
    const bookChapterLstFlag = `${book.bookName}_${book.plantformId}_list`;
    const latest = await get(
      book.source[book.plantformId],
      bookChapterLstFlag,
      book.latestChapter
    );
    book.latestChapter = latest.title;
    return book;
  } catch (error) {}
}

export async function get(url, bookChapterLst, latech) {
  try {
    const title = await latest(url);
    if (title === latech) return;
    const data = await list(url);
    let length = data.length,
      num = 0;
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
  } catch (error) {}
}
