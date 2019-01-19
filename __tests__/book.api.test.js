import { latestLst, list } from '../src/api/book';

test.skip('test', async () => {
  let res = await list('https://www.xs.la/87_87069/');
  console.log(res);
})

test.skip('测试批量获取最新章节的API', async () => {
  let list = [{
    url: 'https://www.xs.la/87_87069/',
    title: '123',
  }, {
    url: 'http://www.biqu.cm/21_21590/',
    title: '1234',
  }]
  let res = await latestLst(list);
  console.log(res)
});

test.skip('测试批量获取最新章节的API', async () => {
  let list = [{
    title: '上架感言!',
    url: 'http://www.kanshuzhong.com/book/36456/'
  }]
  let res = await latestLst(list);
  console.log(res)
});