import React from 'react';
import {
  Text,
  View,
  Dimensions,
  ActionSheetIOS,
  AppState,
  InteractionManager,
  TouchableWithoutFeedback
} from 'react-native';

import queue from 'async/queue';
import { connect } from 'react-redux';

import Toast from '@components/Toast';
import ViewPager from '@components/viewPager';
import getContextArr from '@util/getContextArr';
import Navigat from '@components/Navigat';
import { content, list } from '@api/book';

import {
  delay,
  createAct,
  Storage,
  judgeIphoneX,
  spliceLine
} from '../../util';

import styles from './index.style';

let allTask = 0,
  finishTask = 0;
let bookMapFlag, bookRecordFlag, chapterLstFlag;
let operationSum = 0;

const { width, height } = Dimensions.get('window');

// 差的40 是 marginTop 加了40
const textContainerHeight = height - (judgeIphoneX ? 88 : 48);

class ReadScreen extends React.PureComponent {
  failedCnt = 0;
  constructor(props) {
    super(props);
    this.currentBook = props.navigation.state.params.book;
    AppState.addEventListener('change', this.onAppStateChange);
    this.q = queue(this.fetchQueue, 5);
    this.q.drain = () => {
      Toast.show(`Task finished at ${finishTask}/${allTask}`);
      finishTask = 0;
    };
    this.state = {
      loadFlag: true, //判断是出于加载状态还是显示状态
      currentItem: '', //作为章节内容的主要获取来源。
      goFlag: 0 //判断是前往上一章（-1）还是下一章（1）
    };
    this.initConf();
  }

  onAppStateChange = e => {
    if ((e === 'inactive' || e === 'background') && operationSum > 0) {
      operationSum = 0;
      this.recordSave();
    }
  };

  componentWillUnmount() {
    AppState.removeEventListener('change', this.onAppStateChange);
  }

  fetchQueue = async (url, callback) => {
    let n = (100 * (finishTask / allTask)) >> 0; //取整
    if (n % 15 === 0) Toast.show(`Task process:${n}%`);
    if (this.chapterMap[url] === undefined) {
      const data = await content(url, false);
      await delay(1000); //设置抓取延时
      data !== -1 && (this.chapterMap[url] = data);
    }
    finishTask++;
    callback();
  };

  initConf = async (needRefresh = false) => {
    const { bookName, plantformId, source } = this.currentBook;
    bookRecordFlag = `${bookName}_${plantformId}_record`;
    chapterLstFlag = `${bookName}_${plantformId}_list`;
    bookMapFlag = `${bookName}_${plantformId}_map`;

    const storageResArr = await Storage.multiGet([
      bookRecordFlag,
      chapterLstFlag,
      bookMapFlag
    ]);
    this.chapterLst = storageResArr[1] || [];
    this.chapterMap = storageResArr[2] || new Map();
    this.bookRecord = storageResArr[0] || {
      recordChapterNum: 0,
      recordPage: 1
    };
    if (this.chapterLst.length === 0 || needRefresh) {
      Toast.show('章节内容走心抓取中...');
      this.chapterLst = await list(source[plantformId]);
      if (this.chapterLst.length === 0) {
        this.setState({
          currentItem: {
            title: '章节抓取失败',
            content: '章节抓取失败...',
            prev: 'error',
            next: 'error'
          },
          loadFlag: false,
          goFlag: 0
        });
        return;
      }
    }
    this.getNet(this.bookRecord.recordChapterNum, 0);
  };

  recordSave = () => {
    InteractionManager.runAfterInteractions(() => {
      Storage.multiSet(
        [
          [bookMapFlag, JSON.stringify(this.chapterMap)],
          [chapterLstFlag, JSON.stringify(this.chapterLst)],
          [bookRecordFlag, JSON.stringify(this.bookRecord)]
        ],
        [0, 1, 2]
      );
    });
  };

  downloadChapter = async size => {
    const i = this.bookRecord.recordChapterNum,
      j = this.chapterLst.length;
    const End = i + size < j ? i + size : j;
    allTask = End - i;
    for (let n = i; n < End; n++) {
      this.q.push(this.chapterLst[n].key);
    }
  };

  reload = needRefresh => {
    this.initConf(needRefresh).then(() => {
      this.props.navigation.navigate('ChaL', {
        url: this.currentBook.url,
        name: this.currentBook.bookName,
        bookChapterLst: this.chapterLst,
        chap: this.bookRecord.recordChapterNum,
        callback: url => {
          this.nav.clickShow(false);
          this.getChapterUrl(url);
        }
      });
    });
  };

  showAlertSelected = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['缓存50章', '缓存150章', 'Cancel'],
        cancelButtonIndex: 2
      },
      buttonIndex => {
        const operateArr = [50, 150];
        buttonIndex !== 2 && this.downloadChapter(operateArr[buttonIndex]);
      }
    );
  };

  renderPage = (data, pageID) => {
    const { SMode } = this.props;
    const styleMode = SMode ? styles.sunnyMode : styles.moonMode;
    const title = spliceLine(this.state.currentItem.title, 25);
    return (
      <View style={[styles.container, styleMode.container]}>
        <Text style={[styles.title, styleMode.title]}>{title}</Text>
        <Text style={[styles.textsize, styleMode.text]} numberOfLines={22}>
          {data}
        </Text>
        <View style={styles.bottView}>
          <Text style={[styles.bottom1, !SMode && styles.moonMode.bottom]}>
            {new Date().toTimeString().substring(0, 5)}
          </Text>
          <Text style={[styles.bottom2, !SMode && styles.moonMode.bottom]}>
            {`${+pageID + 1}/${this.pageCount}`}{' '}
          </Text>
        </View>
      </View>
    );
  };

  cacheLoad = async nurl => {
    if (this.chapterMap[nurl] == null) {
      const data = await content(nurl, false);
      if (data !== -1) {
        this.chapterMap[nurl] = data;
        this.failedCnt = 0;
      } else {
        if (this.failedCnt < 3) {
          this.failedCnt = this.failedCnt + 1;
          this.cacheLoad(nurl);
        } else {
          Toast.show(`fetch err, tried cnt:${this.failedCnt}`);
          this.failedCnt = 0;
        }
      }
    }
  };

  getNet = async (index, direct) => {
    index = index <= this.chapterLst.length - 1 && index > -1 ? index : 0; //修复index的越界问题
    this.bookRecord.recordChapterNum = index;
    const nurl = this.chapterLst[index].key;
    if (
      this.chapterMap[nurl] === undefined ||
      typeof this.chapterMap[nurl] === 'string'
    ) {
      const data = await content(nurl, false);
      if (data !== -1) {
        this.chapterMap[nurl] = data;
      } else {
        this.setState({
          currentItem: {
            title: '网络连接超时啦啦啦啦啦',
            content: '网络连接超时.',
            prev: 'error',
            next: 'error'
          },
          loadFlag: false,
          goFlag: direct
        });
        return;
      }
    }
    this.props.dispatch(
      createAct('app/readAdd')({ num: this.chapterMap[nurl].content.length })
    ); //添加阅读的字数
    this.setState({
      currentItem: this.chapterMap[nurl],
      loadFlag: false,
      goFlag: direct
    });
    index < this.chapterLst.length - 1 &&
      this.cacheLoad(this.chapterLst[index + 1].key); //如果当前章节小于倒数第二章就开始预加载
  };

  getNextPage = () => {
    if (this.bookRecord.recordChapterNum < this.chapterLst.length - 1) {
      //防止翻页越界
      this.setState({ loadFlag: true }, () => {
        this.getNet(++this.bookRecord.recordChapterNum, 1); //因为是倒序的
      });
    } else {
      Toast.show('已经是最后一章。');
      return -1;
    }
    return 0;
  };

  getPrevPage = () => {
    if (this.bookRecord.recordChapterNum > 0) {
      //防止翻页越界
      this.setState({ loadFlag: true }, () => {
        this.getNet(--this.bookRecord.recordChapterNum, -1);
      });
    } else {
      Toast.show('已经是第一章。');
    }
  };

  clickBoard = () => {
    this.nav.clickShow();
  };

  SModeChange = () => {
    this.props.dispatch(createAct('app/sunnyModeSwitch')());
  };

  getChapterUrl = index => {
    this.setState(
      {
        loadFlag: true
      },
      () => {
        this.getNet(index, 1);
      }
    );
  };

  getCurrentPage = page => {
    page = page === 0 ? 1 : page;
    this.bookRecord.recordPage !== page && operationSum++;
    this.bookRecord.recordPage = page;
  };

  ds = new ViewPager.DataSource({ pageHasChanged: (p1, p2) => p1 !== p2 });

  getContent = text => {
    // Math.floor 向下取整, 40是行高，-2是因为从0开始计数
    const line = Math.floor(textContainerHeight / 40) - 1;
    let { pages, pageCount } = getContextArr(text, width, line);
    this.pageCount = pageCount;
    return pages;
  };

  drawLoadingView = SMode => (
    <TouchableWithoutFeedback
      onPress={() => {
        this.nav.clickShow();
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={[styles.centr, !SMode && styles.moonMode.text]}>
          Loading...
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );

  drawViewPage = content => (
    <ViewPager
      dataSource={this.ds.cloneWithPages(this.getContent(content))}
      renderPage={this.renderPage}
      getNextPage={this.getNextPage}
      getPrevPage={this.getPrevPage}
      getCurrentPage={this.getCurrentPage}
      clickBoard={this.clickBoard}
      initialPage={this.bookRecord.recordPage - 1}
      Gpag={this.state.goFlag}
    />
  );

  render() {
    const { SMode, navigation } = this.props;
    const styleMode = SMode ? styles.sunnyMode : styles.moonMode;
    return (
      <View style={[styles.container, styleMode.container]}>
        <Navigat
          ref={r => (this.nav = r)}
          navigation={navigation}
          currentBook={this.currentBook}
          recordSave={this.recordSave}
          bookChapterLst={this.chapterLst}
          getChapterUrl={this.getChapterUrl}
          currentRecord={this.bookRecord}
          showAlertSelected={this.showAlertSelected}
          SModeChange={this.SModeChange}
          reLoad={this.reload}
        />
        {this.state.loadFlag
          ? this.drawLoadingView(SMode)
          : this.drawViewPage(this.state.currentItem.content)}
      </View>
    );
  }
}

function select(state) {
  return {
    SMode: state.app.sunnyMode
  };
}

export default connect(select)(ReadScreen);
