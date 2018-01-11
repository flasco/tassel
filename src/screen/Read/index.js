import React, { Component } from 'react';
import {
  Text, View, Dimensions, StatusBar, InteractionManager,
  ActionSheetIOS, LayoutAnimation, AsyncStorage, AppState
} from 'react-native';


import async from 'async';
import dateFormat from 'dateformat';
import { connect } from 'react-redux';

import { sunnyModeSwitch } from '../../actions/app';
import Toast from '../../component/Toast';
import ViewPager from '../../component/viewPager';
import getContextArr from '../../util/getContextArr';
import Navigat from '../../component/Navigat';
import { content, list } from '../../services/book';

import { sleep } from '../../util/sleep'

import styles from './index.style';


/**
 * 下载模块
 - code by Czq
 */
let q = async.queue(async (url, callback) => {
  await fetchList(url);
  callback();
}, 5);

q.drain = function () {
  tht.refs.toast.show(`Task finished at ${finishTask}/${allTask}`);
  finishTask = 0;
  AsyncStorage.setItem(bookMapFlag, JSON.stringify(tht.chapterMap));
};

async function fetchList(nurl) {
  let n = 100 * (finishTask / allTask) >> 0; //取整
  if (n % 15 === 0) {
    tht.refs.toast.show(`Task process:${n}%`);
  }
  try {
    if (tht.chapterMap[nurl] === undefined) {
      const { data } = await content(nurl);
      await sleep(1000);
      tht.chapterMap[nurl] = data;
    }
    finishTask++;
  } catch (err) {

  }
  return;
}

let allTask = 0, finishTask = 0;

let tht, bookMapFlag, bookRecordFlag, chapterLstFlag;

const { height, width } = Dimensions.get('window');

class Readitems extends React.PureComponent {
  render() {
    return (
      <View style={[styles.container, this.props.SMode ? (styles.SunnyMode_container) : (styles.MoonMode_container)]}>
        <Text style={[styles.title, this.props.SMode ? (styles.SunnyMode_Title) : (styles.MoonMode_Title)]}>{this.props.title}</Text>
        <Text style={[styles.textsize, this.props.SMode ? (styles.SunnyMode_text) : (styles.MoonMode_text)]} numberOfLines={21}>{this.props.data}</Text>
        <View style={styles.bottView}>
          <Text style={[styles.bottom1, !this.props.SMode && (styles.MoonMode_Bottom)]}>{dateFormat(new Date(), 'H:MM')}</Text>
          <Text style={[styles.bottom2, !this.props.SMode && (styles.MoonMode_Bottom)]} >{this.props.presPag}/{this.props.totalPage} </Text>
        </View>
      </View>
    );
  }
}

class ReadScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    tht = this;
    totalPage = 0;//总的页数
    this.currentBook = props.navigation.state.params.book;

    this.state = {
      loadFlag: true, //判断是出于加载状态还是显示状态
      currentItem: '', //作为章节内容的主要获取来源。
      isVisible: false, //判断导航栏是否应该隐藏
      goFlag: 0, //判断是前往上一章（-1）还是下一章（1）
    };

    this.initConf = this.initConf.bind(this);
    this.showAlertSelected = this.showAlertSelected.bind(this);
    this.download_Chapter = this.download_Chapter.bind(this);
    this.renderPage = this.renderPage.bind(this);
    this.getNet = this.getNet.bind(this);
    this.getNextPage = this.getNextPage.bind(this);
    this.getPrevPage = this.getPrevPage.bind(this);
    this.clickBoard = this.clickBoard.bind(this);
    this.getChapterUrl = this.getChapterUrl.bind(this);
    this.getCurrentPage = this.getCurrentPage.bind(this);
    this.cacheLoad = this.cacheLoad.bind(this);

    this.initConf();

  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  async initConf() {
    bookRecordFlag = `${this.currentBook.bookName}_${this.currentBook.plantformId}_record`;
    chapterLstFlag = `${this.currentBook.bookName}_${this.currentBook.plantformId}_list`;
    bookMapFlag = `${this.currentBook.bookName}_${this.currentBook.plantformId}_map`;

    const tm = await AsyncStorage.multiGet([bookRecordFlag, chapterLstFlag, bookMapFlag])
    this.chapterLst = tm[1][1] !== null ? JSON.parse(tm[1][1]) : [];
    this.chapterMap = tm[2][1] !== null ? JSON.parse(tm[2][1]) : new Map();
    if (this.chapterLst.length !== 0) {
      this.bookRecord = tm[0][1] !== null ? JSON.parse(tm[0][1]) : { recordChapterNum: 0, recordPage: 1 };
    }

    if (this.chapterLst.length === 0) {
      this.refs.toast.show('章节内容缺失，正在抓取中...');
      this.chapterLst = await list(this.currentBook.source[this.currentBook.plantformId]);
      this.bookRecord = { recordChapterNum: 0, recordPage: 1 };
      AsyncStorage.setItem(chapterLstFlag, JSON.stringify(this.chapterLst));
    }

    this.getNet(this.bookRecord.recordChapterNum, 0);

    this.bookRecord.recordPage = 1;    //修复进入章节后从目录进入新章节页数记录不正确的bug
  }

  async download_Chapter(size) {
    const i = this.bookRecord.recordChapterNum, j = this.chapterLst.length;

    const End = i + size < j ? i + size : j;
    allTask = End - i;
    for (let n = i; n < End; n++) {
      q.push(this.chapterLst[n].key);
    }
  }

  reload = () => {
    this.initConf().then(()=>{
      this.props.navigation.navigate('ChaL', {
        url: this.currentBook.url,
        name: this.currentBook.bookName,
        bookChapterLst: this.chapterLst,
        chap: this.bookRecord.recordChapterNum,
        callback: (url) => this.getChapterUrl(url)
      });
    })
  }

  showAlertSelected() {
    ActionSheetIOS.showActionSheetWithOptions({
      options: [
        '缓存50章',
        '缓存150章',
        'Cancel',
      ],
      cancelButtonIndex: 2,
    }, (buttonIndex) => {
      switch (buttonIndex) {
        case 0: {//50章
          this.download_Chapter(50); break;
        }
        case 1: {//150章
          this.download_Chapter(150); break;
        }
      }
    });
  }

  renderPage(data, pageID) {
    return (
      <Readitems
        title={this.state.currentItem.title}
        SMode={this.props.SMode}
        data={data}
        presPag={Number(pageID) + 1}
        totalPage={totalPage} />
    );
  }

  async cacheLoad(nurl) {
    if (this.chapterMap[nurl] === undefined) {
      try {
        const { data } = await content(nurl);
        this.chapterMap[nurl] = data;
        await AsyncStorage.setItem(bookMapFlag, JSON.stringify(this.chapterMap));
      } catch (err) {
        this.refs.toast.show('fetch err');
      }
    }
  }

  async getNet(index, direct) {
    index = (index <= this.chapterLst.length - 1 && index > -1) ? index : 0;
    this.bookRecord.recordChapterNum = index;
    AsyncStorage.setItem(bookRecordFlag, JSON.stringify(this.bookRecord));
    let nurl = this.chapterLst[index].key;

    if (this.chapterMap[nurl] === undefined) {
      try {
        const { data } = await content(nurl);
        this.chapterMap[nurl] = data;
        AsyncStorage.setItem(bookMapFlag, JSON.stringify(this.chapterMap));
      } catch (err) {
        let epp = { title: '网络连接超时啦啦啦啦啦', content: '网络连接超时.', prev: 'error', next: 'error' };
        this.setState({
          currentItem: epp,
          loadFlag: false,
          goFlag: direct,
        });
        return;
      }
    }
    this.setState({
      currentItem: this.chapterMap[nurl],
      loadFlag: false,
      goFlag: direct,
    });
    index < this.chapterLst.length - 1 && this.cacheLoad(this.chapterLst[index + 1].key);
  }

  getNextPage() {
    if (this.bookRecord.recordChapterNum < this.chapterLst.length - 1) {//防止翻页越界
      this.setState({ loadFlag: true }, () => {
        this.getNet(++this.bookRecord.recordChapterNum, 1);//因为是倒序的
      });
    } else {
      this.refs.toast.show('已经是最后一章。');
      return -1;
    }
    return 0;
  }
  getPrevPage() {
    if (this.bookRecord.recordChapterNum > 0) {//防止翻页越界
      this.setState({ loadFlag: true }, () => {
        this.getNet(--this.bookRecord.recordChapterNum, -1);
      });
    } else {
      this.refs.toast.show('已经是第一章。');
    }
  }

  clickBoard() {
    let flag = this.state.isVisible;
    LayoutAnimation.configureNext({
      duration: 200, //持续时间
      create: { // 视图创建
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,// opacity
      },
      update: { // 视图更新
        type: LayoutAnimation.Types.linear,
      },
      delete: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,// opacity
      }
    });
    this.setState({ isVisible: !flag });
  }

  SModeChange = () => {
    this.props.dispatch(sunnyModeSwitch());
  }

  getChapterUrl(index) {
    this.setState({
      loadFlag: true,
      isVisible: false
    }, () => {
      tht.getNet(index, 1);
    });
  }

  getCurrentPage(pag) {
    pag = pag === 0 ? 1 : pag;
    this.bookRecord.recordPage = pag;
    AsyncStorage.setItem(bookRecordFlag, JSON.stringify(this.bookRecord));
  }

  render() {
    const ds = new ViewPager.DataSource({ pageHasChanged: (p1, p2) => p1 !== p2 });
    return (
      <View style={[styles.container, this.props.SMode ? (styles.SunnyMode_container) : (styles.MoonMode_container)]}>
        <StatusBar
          barStyle="light-content"
          hidden={!this.state.isVisible}
          animation={true} />
        {this.state.isVisible &&
          <Navigat
            navigation={this.props.navigation}
            currentBook={this.currentBook}
            reLoad={this.reload}
            readId={this.props.navigation.state.params.id}
            choose={1} />}
        {this.state.loadFlag ? (
          <Text style={[styles.centr, !this.props.SMode && (styles.MoonMode_text)]}>
            Loading...</Text>) :
          (<ViewPager
            dataSource={ds.cloneWithPages(getContextArr(this.state.currentItem.content, width))}
            renderPage={this.renderPage}
            getNextPage={this.getNextPage}
            getPrevPage={this.getPrevPage}
            getCurrentPage={this.getCurrentPage}
            clickBoard={this.clickBoard}
            initialPage={this.bookRecord.recordPage - 1}
            locked={this.state.isVisible}
            Gpag={this.state.goFlag} />)}
        <Toast ref="toast" />
        {this.state.isVisible &&
          <Navigat
            urlx={this.currentBook.url}
            currentChapter={this.bookRecord.recordChapterNum}
            bname={this.currentBook.bookName}
            bookChapterLst={this.chapterLst}
            getChapterUrl={this.getChapterUrl}
            navigation={this.props.navigation}
            showAlertSelected={this.showAlertSelected}
            SModeChange={this.SModeChange}
            choose={2} />}
      </View>
    );
  }
}

function select(state) {
  return {
    SMode: state.app.sunnyMode,
  }
}

export default connect(select)(ReadScreen);