import { refreshChapter } from '../src/util/getNet';

test.only('测试refresh Function', async () => {
  let list = [{
    bookName: '天醒之路',
    author: '蝴蝶蓝',
    img: 'http://www.xs.la/BookFiles/BookImages/64.jpg',
    desc: '“路平，起床上课。”\n“再睡五分钟。”\n“给我起来！”\n哗！阳光洒下，照遍路平全身。\n“啊！！！”惊叫声顿时响彻云霄，将路平的睡意彻底击碎，之后已是苏唐摔门而出的怒吼：“什么条件啊你玩裸睡？！”\n......',
    latestChapter: '上架感言!',
    plantformId: 2,
    latestRead: 0,
    isUpdate: false,
    updateNum: 0,
    source: {
      '1': 'http://www.xs.la/0_64/',
      '2': 'http://www.kanshuzhong.com/book/36456/',
    }
  }]
  let res = await refreshChapter(list);
  console.log(res)
});