import React, { Component } from 'react';
import { Text, View, ListView, TouchableOpacity, TouchableHighlight, StatusBar, AsyncStorage, RefreshControl, Image, AppState, AppStateIOS } from 'react-native';
import Swipeout from 'react-native-swipeout';
import { Icon, Badge } from 'react-native-elements';
import SideMenu from 'react-native-side-menu';
import SplashScreen from 'react-native-splash-screen';

import { connect } from 'react-redux';

import { listAdd, listDelete, listUpdate, listInit, listRead, OperationClear } from '../../actions/list'
import { menuCtl, menuSwitch } from '../../actions/app';

import Menu from '../Menu';
import styles from './index.style';

let tht;

class ListRow extends React.Component {
  render() {
    const { rowData, navigate, rowID, SMode } = this.props;
    return (
      <Swipeout
        right={[{
          component: (
            <View style={{ flexDirection: 'column', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
              <Icon
                name='ios-trash-outline'
                type='ionicon'
                color='red'
                size={24} />
              <Text style={{ color: 'red', fontSize: 10 }}>删除</Text>
            </View>
          ),
          onPress: () => {
            this.props.deleteBook(rowID);
          },
          backgroundColor: SMode ? styles.sunnyMode.rowStyle.backgroundColor : styles.nightMode.rowStyle.backgroundColor,
          color: 'red'
        }]}
        backgroundColor={SMode ? styles.sunnyMode.rowStyle.backgroundColor : styles.nightMode.rowStyle.backgroundColor}>
        <TouchableHighlight style={SMode ? styles.sunnyMode.rowStyle : styles.nightMode.rowStyle}
          underlayColor={SMode ? styles.sunnyMode.underlayColor : styles.nightMode.underlayColor}
          activeOpacity={0.7}
          onLongPress={() => {
            navigate('BookDet', { book: rowData });
          }}
          onPress={() => {
            navigate('Read', { book: rowData, id: rowID });
            setTimeout(() => {
              tht.props.dispatch(listRead(rowID))
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
      </Swipeout >
    );
  }
}

class BookPackage extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      title: '古意流苏',
      headerBackTitle: ' ',
      headerStyle: {
        backgroundColor: '#000'
      },
      headerRight: (
        <TouchableOpacity onPress={() => {
          tht.props.dispatch(menuSwitch());
        }}>
          <Icon
            name='ios-add'
            type='ionicon'
            color='#ddd'
            size={42}
            iconStyle={{
              marginRight: 15
            }} />
        </TouchableOpacity>
      ),
      headerTitleStyle: {
        color: '#ddd',
        alignSelf: 'center'
      }
    };
  };
  constructor(props) {
    super(props);
    tht = this;

    this.addBook = this.addBook.bind(this);
    this.deleteBook = this.deleteBook.bind(this);
    this.renderRow = this.renderRow.bind(this);
    AppState.addEventListener('change', async (e) => {
      if (e === 'inactive' && this.props.operationNum > 0) {
        this.props.dispatch(OperationClear())
        await AsyncStorage.setItem('booklist', JSON.stringify(this.props.list))
      }
    });
    props.dispatch(listInit());
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
    this.props.dispatch(listDelete(deleteId));
  }

  renderRow(rowData, sectionID, rowID) {
    const { navigate } = this.props.navigation;
    return (
      <ListRow rowData={rowData} rowID={rowID} SMode={this.props.SMode} navigate={navigate} deleteBook={this.deleteBook} />
    )
  }

  onRefresh = () => {
    if (this.props.isInit) {
      this.props.dispatch(listUpdate(this.props.list))
    } else {
      setTimeout(() => {
        this.props.isInit ? this.props.dispatch(listUpdate(this.props.list)) : this.onRefresh()
      }, 521);
    }
  }

  addBook(data) {
    this.props.dispatch(listAdd({
      ...data,
      latestChapter: '待检测',
      latestRead: new Date().getTime()
    }));
  }

  render() {
    const menu = <Menu navigation={this.props.navigation} addBook={this.addBook} />;
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    const { dispatch, list, loadingFlag, isInit, SMode } = this.props;
    if (!isInit) return null;
    return ((
      <View style={SMode ? styles.sunnyMode.container : styles.nightMode.container}>
        <StatusBar barStyle='light-content' />
        <SideMenu
          menu={menu}
          isOpen={this.props.menuFlag}
          onChange={openFlag => dispatch(menuCtl(openFlag))}
          menuPosition={'right'}
          disableGestures={true}>
          <View style={SMode ? styles.sunnyMode.container : styles.nightMode.container}>
            <ListView
              style={{ flex: 1 }}
              refreshControl={
                <RefreshControl
                  refreshing={loadingFlag}
                  onRefresh={this.onRefresh}
                  title="Loading..."
                  titleColor={SMode ? styles.sunnyMode.loadingColor : styles.nightMode.loadingColor} />}
              enableEmptySections={true}
              dataSource={ds.cloneWithRows(list)}
              renderSeparator={() => <View style={SMode ? styles.sunnyMode.solid : styles.nightMode.solid} />}
              renderRow={this.renderRow} />
          </View>
        </SideMenu>
      </View>
    ));
  }
}

function select(state) {
  return {
    list: state.list.list,
    isInit: state.list.isInit,
    menuFlag: state.app.menuFlag,
    loadingFlag: state.list.loadingFlag,
    operationNum: state.list.operationNum,
    SMode: state.app.sunnyMode,
  }
}

export default connect(select)(BookPackage);