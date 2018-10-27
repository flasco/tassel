import React, { Component } from 'react';
import {
  Text, View, TouchableHighlight, AppState,
  SwipeableFlatList, StatusBar, AsyncStorage, Image,
  Alert
} from 'react-native';
import { Icon, Badge } from 'react-native-elements';
import SideMenu from 'react-native-side-menu';
import SplashScreen from 'react-native-splash-screen';
import SwipeableQuickActions from 'SwipeableQuickActions';
import { connect } from 'react-redux';

import { createAct, Storage } from '../../util';

import Menu from '../Menu';
import Toast from '../../component/Toast';

import styles from './index.style';

let tht;

class BookListScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      title: '古意流苏',
      headerBackTitle: ' ',
      headerStyle: { backgroundColor: '#000', borderBottomWidth: 0 },
      headerRight: (
        <Icon
          name='ios-add'
          onPress={() => { tht.props.dispatch(createAct('app/menuSwitch')()); }}
          underlayColor={'transparent'}
          type='ionicon'
          color='#ddd'
          size={42}
          iconStyle={{ marginRight: 15 }} />
      ),
      headerTitleStyle: { color: '#ddd', alignSelf: 'center' }
    };
  };
  constructor(props) {
    super(props);
    tht = this;
    this.addBook = this.addBook.bind(this);
    this.deleteBook = this.deleteBook.bind(this);
    AppState.addEventListener('change', this.onAppStateChange);
  }

  componentDidMount() {
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
    this.onRefresh();
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.onAppStateChange);
  }

  onAppStateChange = async (e) => {
    if (e === 'inactive' && this.props.operationNum > 0) {
      this.props.dispatch(createAct('list/operationClear')());
      Storage.mapSave();
      await AsyncStorage.multiSet([
        ['appState', JSON.stringify(this.props.app)],
        ['booklist', JSON.stringify(this.props.list)],
        ['fattenList', JSON.stringify(this.props.fattenList)]
      ]);
    }
  }

  deleteBook(deleteId) {
    this.props.dispatch(createAct('list/listDelete')({
      list: this.props.list,
      bookId: deleteId
    }))
  }

  callback = (msg) => {
    this.refs.toast.show(msg);
  }

  onRefresh = () => {
    if (this.props.isInit) {
      this.props.list != null && this.props.list.length > 0 && this.props.dispatch(createAct('list/listUpdate')({
        list: this.props.list,
        fattenList: this.props.fattenList,
        isFatten: this.props.isFatten,
        callback: this.callback
      }))
    } else {
      setTimeout(() => {
        this.props.isInit ?
        this.props.list != null && this.props.list.length > 0 && this.props.dispatch(createAct('list/listUpdate')({
            list: this.props.list,
            fattenList: this.props.fattenList,
            isFatten: this.props.isFatten,
            callback: this.callback
          })) : this.onRefresh()
      }, 247)
    }
  }

  fattenBook = (bookId) => {
    this.props.dispatch(createAct('list/fattenBook')({ fattenList: this.props.fattenList, list: this.props.list, bookId }));
  }

  addBook(data) {
    this.props.dispatch(createAct('list/listAdd')({
      list: this.props.list,
      book: {
        ...data,
        latestChapter: '待检测',
        latestRead: new Date().getTime(),
        isUpdate: false,
        updateNum: 0,
      }
    }))
  }

  renderRow = (item) => {
    let rowData = item.item;
    let rowID = item.index;
    let SMode = this.props.app.sunnyMode;
    let { navigate } = this.props.navigation;
    if (rowData.img === '-1') {
      return (
        <TouchableHighlight style={SMode ? styles.sunnyMode.rowStyle : styles.nightMode.rowStyle}
          underlayColor={SMode ? styles.sunnyMode.underlayColor : styles.nightMode.underlayColor}
          activeOpacity={0.7}
          onPress={() => navigate('FattenBlock')}>
          <View style={{ flexDirection: 'row' }}>
            <Image source={require('../../assert/noImg.jpg')} style={styles.coverStyle} />
            <View style={{ paddingLeft: 15 }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={SMode ? styles.sunnyMode.titleStyle : styles.nightMode.titleStyle}>{rowData.bookName}</Text>
                {this.props.isFatten && <Badge value={`待杀`} containerStyle={styles.fattenBadgeStyle} textStyle={{ fontSize: 11 }} />}
              </View>
              <Text style={SMode ? styles.sunnyMode.subTitleStyle : styles.nightMode.subTitleStyle}>{rowData.desc}</Text>
            </View>
          </View>
        </TouchableHighlight>
      )
    }
    return (
      <TouchableHighlight style={SMode ? styles.sunnyMode.rowStyle : styles.nightMode.rowStyle}
        underlayColor={SMode ? styles.sunnyMode.underlayColor : styles.nightMode.underlayColor}
        activeOpacity={0.7}
        onLongPress={() => navigate('BookDet', { book: rowData })}
        onPress={() => {
          navigate('Read', { book: rowData });
          setTimeout(() => {
            this.props.dispatch(createAct('list/bookRead')({ list: this.props.list, bookId: rowID }))
          }, 1000);
        }}>
        <View style={{ flexDirection: 'row' }}>
          <Image source={{ uri: rowData.img }} style={styles.coverStyle} />
          <View style={{ paddingLeft: 15 }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={SMode ? styles.sunnyMode.titleStyle : styles.nightMode.titleStyle}>{rowData.bookName}</Text>
              {rowData.isUpdate && <Badge value={`更新`} containerStyle={styles.badgeStyle} textStyle={{ fontSize: 11 }} />}
            </View>
            <Text style={SMode ? styles.sunnyMode.subTitleStyle : styles.nightMode.subTitleStyle}>{rowData.updateNum > 10 ? `距上次点击已更新${rowData.updateNum}章` : `${rowData.latestChapter.length > 15 ? (rowData.latestChapter.substr(0, 15) + '...') : rowData.latestChapter}`}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  renderActions = (item) => {
    let SMode = this.props.app.sunnyMode;
    let rowData = item.item;
    let rowId = item.index;
    const fattenColor = SMode ? '#000' : '#ddd';
    if (rowData.img === '-1') return null;
    return (
      <SwipeableQuickActions style={{ backgroundColor: SMode ? styles.sunnyMode.rowStyle.backgroundColor : styles.nightMode.rowStyle.backgroundColor }}>
        <TouchableHighlight
          underlayColor={'transparent'}
          onPress={() => this.fattenBook(rowId)}>
          <View style={{ width: 50, flexDirection: 'column', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
            <Icon
              name='ios-star-outline'
              type='ionicon'
              color={fattenColor}
              size={24} />
            <Text style={{ color: fattenColor, fontSize: 10 }}>养肥</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor={'transparent'}
          onPress={() => {
            Alert.alert('Warning', '真的要删除掉本书吗？', [{
              text: 'Cancel'
            }, {
              text: 'Delete', onPress: () => {
                this.deleteBook(rowId)
              }
            }]);
          }}>
          <View style={{ width: 50, flexDirection: 'column', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
            <Icon
              name='ios-trash'
              type='ionicon'
              color='red'
              size={24} />
            <Text style={{ color: 'red', fontSize: 10 }}>删除</Text>
          </View>
        </TouchableHighlight>
      </SwipeableQuickActions>
    )
  }

  render() {
    if (!this.props.isInit) return null;
    const menu = <Menu navigation={this.props.navigation} addBook={this.addBook} />;
    const { dispatch, list, app: { menuFlag, sunnyMode } } = this.props;
    return (
      <View style={sunnyMode ? styles.sunnyMode.container : styles.nightMode.container}>
        <SideMenu
          menu={menu}
          isOpen={menuFlag}
          onChange={openFlag => dispatch(createAct('app/menuCtl')({ flag: openFlag }))}
          menuPosition={'right'}
          disableGestures={true}>
          <View style={sunnyMode ? styles.sunnyMode.container : styles.nightMode.container}>
            <StatusBar barStyle='light-content' />
            <SwipeableFlatList
              data={list}
              bounceFirstRowOnMount={false}//屏蔽第一次滑动
              onRefresh={this.onRefresh}
              refreshing={this.props.loadingFlag}
              ItemSeparatorComponent={() => <View style={sunnyMode ? styles.sunnyMode.solid : styles.nightMode.solid} />}
              maxSwipeDistance={100}
              renderQuickActions={this.renderActions}
              renderItem={this.renderRow}
              keyExtractor={(item, index) => `${item.bookName}-${item.author}`} />
            <Toast ref="toast" />
          </View>
        </SideMenu>
      </View>
    );
  }
}

function select({ list, app }) {
  return {
    app,
    list: list.list,
    isInit: list.init,
    isFatten: list.isFatten,
    fattenList: list.fattenList,
    loadingFlag: list.loadingFlag,
    operationNum: list.operationNum,
  }
}

export default connect(select)(BookListScreen);