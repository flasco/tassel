import React, { Component } from 'react';
import {
  Text, View, TouchableHighlight, AppState,
  SwipeableFlatList, StatusBar, AsyncStorage, Image,
} from 'react-native';
import { Icon, Badge } from 'react-native-elements';
import SideMenu from 'react-native-side-menu';
import SplashScreen from 'react-native-splash-screen';
import SwipeableQuickActions from 'SwipeableQuickActions';
import { connect } from 'react-redux';

import { createAct } from '../../util'

import Menu from '../Menu';
import styles from './index.style';

let tht;

class BookPackage extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      title: '古意流苏',
      headerBackTitle: ' ',
      headerStyle: { backgroundColor: '#000' },
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

    AppState.addEventListener('change', async (e) => {
      if (e === 'inactive' && this.props.operationNum > 0) {
        this.props.dispatch(createAct('list/operationClear')())
        await AsyncStorage.setItem('appState', JSON.stringify(this.props.app))
        await AsyncStorage.setItem('booklist', JSON.stringify(this.props.list))
      }
    });
  }

  componentDidMount() {
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
    this.onRefresh();
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  deleteBook(deleteId) {
    this.props.dispatch(createAct('list/listDelete')({ bookId: deleteId }))
  }

  onRefresh = () => {
    setTimeout(() => {
      this.props.isInit ?
        this.props.dispatch(createAct('list/listUpdate')()) : this.onRefresh()
    }, 247)

  }

  addBook(data) {
    this.props.dispatch(createAct('list/listAdd')({
      book: {
        ...data,
        latestChapter: '待检测',
        latestRead: new Date().getTime()
      }
    }))
  }

  renderRow = (item) => {
    let rowData = item.item;
    let rowID = item.index;
    let SMode = this.props.SMode;
    let { navigate } = this.props.navigation;
    return (
      <TouchableHighlight style={SMode ? styles.sunnyMode.rowStyle : styles.nightMode.rowStyle}
        underlayColor={SMode ? styles.sunnyMode.underlayColor : styles.nightMode.underlayColor}
        activeOpacity={0.7}
        onLongPress={() => {
          navigate('BookDet', { book: rowData });
        }}
        onPress={() => {
          navigate('Read', { book: rowData, id: rowID });
          setTimeout(() => {
            this.props.dispatch(createAct('list/bookRead')({ bookId: rowID }))
          }, 1000);
        }}>
        <View style={{ flexDirection: 'row' }}>
          <Image source={{ uri: rowData.img }} style={styles.coverStyle} />
          <View style={{ paddingLeft: 15 }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={SMode ? styles.sunnyMode.titleStyle : styles.nightMode.titleStyle}>{rowData.bookName}</Text>
              {rowData.isUpdate && <Badge value={`更新`} containerStyle={SMode ? styles.sunnyMode.badgeStyle : styles.nightMode.badgeStyle} textStyle={{ fontSize: 11 }} />}
            </View>
            <Text style={SMode ? styles.sunnyMode.subTitleStyle : styles.nightMode.subTitleStyle}>{rowData.updateNum > 10 ? `距上次点击已更新${rowData.updateNum}章` : `${rowData.latestChapter.length > 15 ? (rowData.latestChapter.substr(0, 15) + '...') : rowData.latestChapter}`}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  renderActions = (rowData, sectionId, rowId) => {
    let SMode = this.props.SMode;
    return (
      <SwipeableQuickActions style={{ backgroundColor: SMode ? styles.sunnyMode.rowStyle.backgroundColor : styles.nightMode.rowStyle.backgroundColor }}>
        <TouchableHighlight
          onPress={() => this.deleteBook(rowId)}>
          <View style={{ width: 70, flexDirection: 'column', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
            <Icon
              name='ios-trash-outline'
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
    const menu = <Menu navigation={this.props.navigation} addBook={this.addBook} />;
    const { dispatch, list, loadingFlag, SMode, isInit } = this.props;
    if (!isInit) return null;
    return ((
      <View style={SMode ? styles.sunnyMode.container : styles.nightMode.container}>
        <StatusBar barStyle='light-content' />
        <SideMenu
          menu={menu}
          isOpen={this.props.menuFlag}
          onChange={openFlag => dispatch(createAct('app/menuCtl')({ flag: openFlag }))}
          menuPosition={'right'}
          disableGestures={true}>
          <View style={SMode ? styles.sunnyMode.container : styles.nightMode.container}>
            <SwipeableFlatList
              data={list}
              bounceFirstRowOnMount={false}//屏蔽第一次滑动
              onRefresh={this.onRefresh}
              refreshing={loadingFlag}
              ItemSeparatorComponent={() => <View style={SMode ? styles.sunnyMode.solid : styles.nightMode.solid} />}
              maxSwipeDistance={80}
              renderQuickActions={this.renderActions}
              renderItem={this.renderRow}
              keyExtractor={(item, index) => `${item.bookName}-${item.author}`} />
          </View>
        </SideMenu>
      </View>
    ));
  }
}

function select(state) {
  return {
    list: state.list.list,
    isInit: state.list.init,
    menuFlag: state.app.menuFlag,
    loadingFlag: state.list.loadingFlag,
    operationNum: state.list.operationNum,
    SMode: state.app.sunnyMode,
    app: state.app
  }
}

export default connect(select)(BookPackage);