import React from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  AppState,
  SwipeableFlatList,
  StatusBar,
  Image,
  Alert
} from 'react-native';
import { Icon, Badge } from 'react-native-elements';
import SideMenu from 'react-native-side-menu';
import SplashScreen from 'react-native-splash-screen';
import SwipeableQuickActions from '@components/SwipeableQuickActions';
import { connect } from 'react-redux';

import {
  createAct,
  Storage,
  spliceLine,
  getDefaultTitleStyle
} from '@util';

import Menu from '@screen/Menu';

import styles from './index.style';

let tht;

class BookListScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      title: '古意流苏',
      headerBackTitle: ' ',
      ...getDefaultTitleStyle(),
      headerRight: (
        <Icon
          name="ios-add"
          onPress={() => {
            tht.props.dispatch(createAct('app/menuSwitch')());
          }}
          underlayColor={'transparent'}
          type="ionicon"
          color="#ddd"
          size={42}
          iconStyle={{ marginRight: 15 }}
        />
      )
    };
  };
  constructor(props) {
    super(props);
    tht = this;
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

  onAppStateChange = async e => {
    const { app, list, fattenList, dispatch, operationNum } = this.props;
    if ((e === 'inactive' || e === 'background') && operationNum > 0) {
      dispatch(createAct('list/operationClear')());
      Storage.mapSave();
      await Storage.multiSet(
        [
          ['appState', JSON.stringify(app)],
          ['booklist', JSON.stringify(list)],
          ['fattenList', JSON.stringify(fattenList)]
        ],
        [2, 2, 2]
      );
    }
  };

  deleteBook = deleteId => {
    this.props.dispatch(
      createAct('list/listDelete')({
        list: this.props.list,
        bookId: deleteId
      })
    );
  };

  onRefresh = () => {
    const { isInit, list, dispatch, fattenList, isFatten } = this.props;
    if (isInit) {
      list &&
        list.length &&
        dispatch(
          createAct('list/listUpdate')({
            list,
            fattenList,
            isFatten
          })
        );
    } else {
      setTimeout(() => {
        isInit
          ? list &&
            list.length &&
            dispatch(
              createAct('list/listUpdate')({
                list,
                fattenList,
                isFatten
              })
            )
          : this.onRefresh();
      }, 247);
    }
  };

  fattenBook = bookId => {
    const { dispatch, fattenList, list } = this.props;
    dispatch(
      createAct('list/fattenBook')({
        list,
        bookId,
        fattenList
      })
    );
  };

  addBook = data => {
    this.props.dispatch(
      createAct('list/listAdd')({
        list: this.props.list,
        book: {
          ...data,
          latestChapter: '待检测',
          latestRead: new Date().getTime(),
          isUpdate: false,
          updateNum: 0
        }
      })
    );
  };

  renderRow = item => {
    const { item: rowData, index: rowID } = item;
    const SMode = this.props.app.sunnyMode;
    const { navigate } = this.props.navigation;
    const styleMode = SMode ? styles.sunnyMode : styles.nightMode;
    if (rowData.img === '-1') {
      return (
        <TouchableHighlight
          style={styleMode.rowStyle}
          underlayColor={styleMode.underlayColor}
          activeOpacity={0.7}
          onPress={() => navigate('FattenBlock')}
        >
          <View style={{ flexDirection: 'row' }}>
            <Image
              source={require('@assets/noImg.jpg')}
              style={styles.coverStyle}
            />
            <View style={{ paddingLeft: 15 }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styleMode.titleStyle}>{rowData.bookName}</Text>
                {this.props.isFatten && (
                  <Badge
                    value={`待杀`}
                    containerStyle={styles.fattenBadgeStyle}
                    textStyle={{ fontSize: 11 }}
                  />
                )}
              </View>
              <Text style={styleMode.subTitleStyle}>{rowData.desc}</Text>
            </View>
          </View>
        </TouchableHighlight>
      );
    }
    return (
      <TouchableHighlight
        style={styleMode.rowStyle}
        underlayColor={styleMode.underlayColor}
        activeOpacity={0.7}
        onLongPress={() => navigate('BookDet', { book: rowData })}
        onPress={() => {
          navigate('Read', { book: rowData });
          setTimeout(() => {
            this.dispatChange('list/bookRead', {
              list: this.props.list,
              bookId: rowID
            });
          }, 1000);
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <Image source={{ uri: rowData.img }} style={styles.coverStyle} />
          <View style={{ paddingLeft: 15 }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styleMode.titleStyle}>{rowData.bookName}</Text>
              {rowData.isUpdate && (
                <Badge
                  value={`更新`}
                  containerStyle={styles.badgeStyle}
                  textStyle={{ fontSize: 11 }}
                />
              )}
            </View>
            <Text style={styleMode.subTitleStyle}>
              {rowData.updateNum > 10
                ? `距上次点击已更新${rowData.updateNum}章`
                : `${spliceLine(rowData.latestChapter, 15)}`}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  renderActions = item => {
    let SMode = this.props.app.sunnyMode;
    const { item: rowData, index: rowId } = item;
    const styleMode = SMode ? styles.sunnyMode : styles.nightMode;
    const fattenColor = SMode ? '#000' : '#ddd';
    if (rowData.img === '-1') return null;
    return (
      <SwipeableQuickActions
        style={{
          backgroundColor: styleMode.rowStyle.backgroundColor
        }}
      >
        <TouchableHighlight
          underlayColor={'transparent'}
          onPress={() => this.fattenBook(rowId)}
        >
          <View
            style={{
              width: 50,
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              justifyContent: 'center'
            }}
          >
            <Icon
              name="ios-star-outline"
              type="ionicon"
              color={fattenColor}
              size={24}
            />
            <Text style={{ color: fattenColor, fontSize: 10 }}>养肥</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor={'transparent'}
          onPress={() => {
            Alert.alert('Warning', '真的要删除掉本书吗？', [
              {
                text: 'Cancel'
              },
              {
                text: 'Delete',
                onPress: () => {
                  this.deleteBook(rowId);
                }
              }
            ]);
          }}
        >
          <View
            style={{
              width: 50,
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              justifyContent: 'center'
            }}
          >
            <Icon name="ios-trash" type="ionicon" color="red" size={24} />
            <Text style={{ color: 'red', fontSize: 10 }}>删除</Text>
          </View>
        </TouchableHighlight>
      </SwipeableQuickActions>
    );
  };

  menu = <Menu navigation={this.props.navigation} addBook={this.addBook} />;

  dispatChange = (str, obj) => {
    this.props.dispatch(createAct(str)(obj));
  };
  render() {
    if (!this.props.isInit) return null;
    const {
      list,
      app: { menuFlag, sunnyMode }
    } = this.props;
    const styleMode = sunnyMode ? styles.sunnyMode : styles.nightMode;
    return (
      <View style={styleMode.container}>
        <SideMenu
          menu={this.menu}
          isOpen={menuFlag}
          onChange={flag => this.dispatChange('app/menuCtl', { flag })}
          menuPosition={'right'}
          disableGestures={true}
        >
          <View style={styleMode.container}>
            <StatusBar
              translucent
              backgroundColor={'#000'}
              barStyle="light-content"
            />
            <SwipeableFlatList
              data={list}
              bounceFirstRowOnMount={false} //屏蔽第一次滑动
              onRefresh={this.onRefresh}
              refreshing={this.props.loadingFlag}
              ItemSeparatorComponent={() => <View style={styleMode.solid} />}
              maxSwipeDistance={100}
              renderQuickActions={this.renderActions}
              renderItem={this.renderRow}
              keyExtractor={(item, index) => `${item.bookName}-${item.author}`}
            />
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
    operationNum: list.operationNum
  };
}

export default connect(select)(BookListScreen);
