import React from 'react';
import {
  Text, View, Dimensions,
  StatusBar, ActionSheetIOS, LayoutAnimation, AppState, InteractionManager
} from 'react-native';

import async from 'async';
import { connect } from 'react-redux';

import Toast from '../../component/Toast';
import ViewPager from '../../component/viewPager';
import getContextArr from '../../util/getContextArr';
import Navigat from '../../component/Navigat';
import { content, list } from '../../services/book';

import { delay, createAct, Storage } from '../../util';

import styles from './index.style';

let allTask = 0, finishTask = 0;
let bookMapFlag, bookRecordFlag, chapterLstFlag;
let operationSum = 0;

const { width } = Dimensions.get('window');

class ReadScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.currentBook = props.navigation.state.params.book;
    AppState.addEventListener('change', this.onAppStateChange);
    this.q = async.queue(this.fetchQueue, 5);
    this.q.drain = () => {
      this.toast.show(`Task finished at ${finishTask}/${allTask}`);
      finishTask = 0;
    };

    this.state = {
      loadFlag: true, //判断是出于加载状态还是显示状态
      currentItem: '', //作为章节内容的主要获取来源。
      isVisible: false, //判断导航栏是否应该隐藏
      goFlag: 0, //判断是前往上一章（-1）还是下一章（1）
    };
    this.initConf();
  }

  onAppStateChange = (e) => {
    if (e === 'inactive' && operationSum > 0) {
      operationSum = 0;
      this.recordSave();
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.onAppStateChange);
  }

  fetchQueue = async (url, callback) => {
    let n = 100 * (finishTask / allTask) >> 0; //取整
    if (n % 15 === 0) this.toast.show(`Task process:${n}%`);
    if (this.chapterMap[url] === undefined) {
      const data = await content(url);
      await delay(1000);  //设置抓取延时
      data !== -1 && (this.chapterMap[url] = data);
    }
    finishTask++;
    callback();
  }

  initConf = async (needRefresh = false) => {
    bookRecordFlag = `${this.currentBook.bookName}_${this.currentBook.plantformId}_record`;
    chapterLstFlag = `${this.currentBook.bookName}_${this.currentBook.plantformId}_list`;
    bookMapFlag = `${this.currentBook.bookName}_${this.currentBook.plantformId}_map`;

    const storageResArr = await Storage.multiGet([bookRecordFlag, chapterLstFlag, bookMapFlag]);
    this.chapterLst = storageResArr[1] || [];
    this.chapterMap = storageResArr[2] || new Map();
    this.bookRecord = storageResArr[0] || { recordChapterNum: 0, recordPage: 1 };
    if (this.chapterLst.length === 0 || needRefresh) {
      this.toast.show('章节内容走心抓取中...');
      this.chapterLst = await list(this.currentBook.source[this.currentBook.plantformId]);
      if (this.chapterLst.length === 0) {
        this.setState({
          currentItem: { title: '章节抓取失败', content: '章节抓取失败...', prev: 'error', next: 'error' },
          loadFlag: false,
          goFlag: 0,
        });
        return;
      }
    }
    this.getNet(this.bookRecord.recordChapterNum, 0);
  }

  recordSave = () => {
    InteractionManager.runAfterInteractions(() => {
      Storage.multiSet([
        [bookMapFlag, JSON.stringify(this.chapterMap)],
        [chapterLstFlag, JSON.stringify(this.chapterLst)],
        [bookRecordFlag, JSON.stringify(this.bookRecord)]
      ], [0, 1, 2]);
    });
  }

  download_Chapter = async (size) => {
    const i = this.bookRecord.recordChapterNum, j = this.chapterLst.length;
    const End = i + size < j ? i + size : j;
    allTask = End - i;
    for (let n = i; n < End; n++) {
      this.q.push(this.chapterLst[n].key);
    }
  }

  reload = (needRefresh) => {
    this.initConf(needRefresh).then(() => {
      this.props.navigation.navigate('ChaL', {
        url: this.currentBook.url,
        name: this.currentBook.bookName,
        bookChapterLst: this.chapterLst,
        chap: this.bookRecord.recordChapterNum,
        callback: (url) => this.getChapterUrl(url)
      });
    })
  }

  showAlertSelected = () => {
    ActionSheetIOS.showActionSheetWithOptions({
      options: [
        '缓存50章',
        '缓存150章',
        'Cancel',
      ],
      cancelButtonIndex: 2,
    }, (buttonIndex) => {
      let operateArr = [50, 150];
      this.download_Chapter(operateArr[buttonIndex]);
    });
  }

  renderPage = (data, pageID) => {
    const { SMode } = this.props;
    let title = this.state.currentItem.title;
    title = title.length > 25 ? title.substr(0, 25) + '...' : title;
    return (
      <View style={[styles.container, SMode ? (styles.SunnyMode_container) : (styles.MoonMode_container)]}>
        <Text style={[styles.title, SMode ? (styles.SunnyMode_Title) : (styles.MoonMode_Title)]}>{title}</Text>
        <Text style={[styles.textsize, SMode ? (styles.SunnyMode_text) : (styles.MoonMode_text)]} numberOfLines={22}>{data}</Text>
        <View style={styles.bottView}>
          <Text style={[styles.bottom1, !SMode && (styles.MoonMode_Bottom)]}>{new Date().toTimeString().substring(0, 5)}</Text>
          <Text style={[styles.bottom2, !SMode && (styles.MoonMode_Bottom)]} >{`${+pageID + 1}/${this.pageCount}`} </Text>
        </View>
      </View>
    );
  }

  cacheLoad = async (nurl) => {
    if (this.chapterMap[nurl] === undefined) {
      const data = await content(nurl);
      if (data !== -1) {
        this.chapterMap[nurl] = data;
      } else {
        this.toast.show('fetch err');
      }
    }
  }

  getNet = async (index, direct) => {
    index = (index <= this.chapterLst.length - 1 && index > -1) ? index : 0; //修复index的越界问题
    this.bookRecord.recordChapterNum = index;
    let nurl = this.chapterLst[index].key;
    if (this.chapterMap[nurl] === undefined || typeof this.chapterMap[nurl] === 'string') {
      const data = await content(nurl);
      if (data !== -1) {
        this.chapterMap[nurl] = data;
      } else {
        this.setState({
          currentItem: { title: '网络连接超时啦啦啦啦啦', content: '网络连接超时.', prev: 'error', next: 'error' },
          loadFlag: false,
          goFlag: direct,
        });
        return;
      }
    }
    this.props.dispatch(createAct('app/readAdd')({ num: this.chapterMap[nurl].content.length })) //添加阅读的字数
    this.setState({
      currentItem: this.chapterMap[nurl],
      loadFlag: false,
      goFlag: direct,
    });
    index < this.chapterLst.length - 1 && this.cacheLoad(this.chapterLst[index + 1].key); //如果当前章节小于倒数第二章就开始预加载
  }

  getNextPage = () => {
    if (this.bookRecord.recordChapterNum < this.chapterLst.length - 1) {//防止翻页越界
      this.setState({ loadFlag: true }, () => {
        this.getNet(++this.bookRecord.recordChapterNum, 1);//因为是倒序的
      });
    } else {
      this.toast.show('已经是最后一章。');
      return -1;
    }
    return 0;
  }
  getPrevPage = () => {
    if (this.bookRecord.recordChapterNum > 0) {//防止翻页越界
      this.setState({ loadFlag: true }, () => {
        this.getNet(--this.bookRecord.recordChapterNum, -1);
      });
    } else {
      this.toast.show('已经是第一章。');
    }
  }

  clickBoard = () => {
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
      delete: { // 视图消失
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,// opacity
      }
    });
    this.setState({ isVisible: !flag });
  }

  SModeChange = () => {
    this.props.dispatch(createAct('app/sunnyModeSwitch')());
  }

  getChapterUrl = (index) => {
    this.setState({
      loadFlag: true,
      isVisible: false
    }, () => {
      this.getNet(index, 1);
    });
  }

  getCurrentPage = (page) => {
    page = page === 0 ? 1 : page;
    this.bookRecord.recordPage !== page && operationSum++;
    this.bookRecord.recordPage = page;
  }

  render() {
    const ds = new ViewPager.DataSource({ pageHasChanged: (p1, p2) => p1 !== p2 });
    const { SMode, navigation } = this.props;
    let { pages, pageCount } = getContextArr(this.state.currentItem.content, width);
    this.pageCount = pageCount;
    return (
      <View style={[styles.container, SMode ? (styles.SunnyMode_container) : (styles.MoonMode_container)]}>
        <StatusBar
          barStyle="light-content"
          hidden={!this.state.isVisible}
          animation={true} />
        {this.state.isVisible &&
          <Navigat
            navigation={navigation}
            currentBook={this.currentBook}
            recordSave={this.recordSave}
            reLoad={this.reload}
            choose={1} />}
        {this.state.loadFlag ? (
          <Text style={[styles.centr, !SMode && (styles.MoonMode_text)]}>
            Loading...</Text>) : (<ViewPager
              dataSource={ds.cloneWithPages(pages)}
              renderPage={this.renderPage}
              getNextPage={this.getNextPage}
              getPrevPage={this.getPrevPage}
              getCurrentPage={this.getCurrentPage}
              clickBoard={this.clickBoard}
              initialPage={this.bookRecord.recordPage - 1}
              locked={this.state.isVisible}
              Gpag={this.state.goFlag} />)}
        <Toast ref={(q) => this.toast = q} />
        {this.state.isVisible && <Navigat
          urlx={this.currentBook.url}
          currentChapter={this.bookRecord.recordChapterNum}
          bname={this.currentBook.bookName}
          bookChapterLst={this.chapterLst}
          getChapterUrl={this.getChapterUrl}
          navigation={navigation}
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