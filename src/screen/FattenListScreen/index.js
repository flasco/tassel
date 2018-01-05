import React, { Component } from 'react';
import { Text, View, ListView, TouchableOpacity, TouchableHighlight, StatusBar, AsyncStorage, RefreshControl, Image, AppState, AppStateIOS } from 'react-native';
import Swipeout from 'react-native-swipeout';
import { Icon, Badge } from 'react-native-elements';
import { HeaderBackButton } from 'react-navigation';

import { connect } from 'react-redux';

import { listAdd, listDelete, listUpdate, listInit, listRead, OperationClear } from '../../actions/list'
import { menuCtl, menuSwitch } from '../../actions/app';

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
                name='ios-return-left'
                type='ionicon'
                color='#000'
                size={24} />
              <Text style={{ color: '#000', fontSize: 10 }}>移出</Text>
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
            navigate('Read', { book: rowData });
            setTimeout(() => {
              tht.props.dispatch(listRead(rowID))
            }, 1000);
          }}>
          <View style={{ flexDirection: 'row' }}>
            <Image source={{ uri: rowData.img }} style={styles.coverStyle} />
            <View style={{ paddingLeft: 15 }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={SMode ? styles.sunnyMode.titleStyle : styles.nightMode.titleStyle}>{rowData.bookName}</Text>
                {rowData.updateNum >= 30 && <Badge value={`待杀`} containerStyle={SMode ? styles.sunnyMode.badgeStyle : styles.nightMode.badgeStyle} textStyle={{ fontSize: 11 }} />}
              </View>
              <Text style={SMode ? styles.sunnyMode.subTitleStyle : styles.nightMode.subTitleStyle}>{`已经养了${rowData.updateNum}章`}</Text>
            </View>
          </View>
        </TouchableHighlight>
      </Swipeout >
    );
  }
}

class FattenListScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      title: '养肥区',
      headerBackTitle: ' ',
      headerStyle: {
        backgroundColor: '#000'
      },
      headerLeft: (
        <HeaderBackButton
          title='返回'
          tintColor={'#ddd'}
          onPress={() => {
            navigation.goBack();
          }} />
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

    this.deleteBook = this.deleteBook.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  deleteBook(deleteId) {
    // this.props.dispatch(listDelete(deleteId));
  }

  renderRow(rowData, sectionID, rowID) {
    const { navigate } = this.props.navigation;
    return (
      <ListRow rowData={rowData} rowID={rowID} SMode={this.props.SMode} navigate={navigate} deleteBook={this.deleteBook} />
    )
  }

  render() {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    const { dispatch, list, SMode } = this.props;
    console.log(list)
    return ((
      <View style={SMode ? styles.sunnyMode.container : styles.nightMode.container}>
        <StatusBar barStyle='light-content' />
        <View style={SMode ? styles.sunnyMode.container : styles.nightMode.container}>
          <ListView
            style={{ flex: 1 }}
            enableEmptySections={true}
            dataSource={ds.cloneWithRows(list)}
            renderSeparator={() => <View style={SMode ? styles.sunnyMode.solid : styles.nightMode.solid} />}
            renderRow={this.renderRow} />
        </View>
      </View>
    ));
  }
}

function select(state) {
  return {
    list: state.list.fattenList,
    SMode: state.app.sunnyMode,
  }
}

export default connect(select)(FattenListScreen);