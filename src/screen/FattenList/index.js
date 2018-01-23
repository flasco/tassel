import React, { Component } from 'react';
import {
  Text, View, SwipeableFlatList, TouchableOpacity,
  TouchableHighlight, StatusBar, AsyncStorage,
  Image, AppState, AppStateIOS
} from 'react-native';
import SwipeableQuickActions from 'SwipeableQuickActions';
import { Icon, Badge } from 'react-native-elements';
import { HeaderBackButton } from 'react-navigation';

import { connect } from 'react-redux';

import styles from './index.style';


class ListRow extends React.Component {
  render() {
    const { rowData, navigate, rowID, SMode } = this.props;
    return (
      <TouchableHighlight style={SMode ? styles.sunnyMode.rowStyle : styles.nightMode.rowStyle}
        underlayColor={SMode ? styles.sunnyMode.underlayColor : styles.nightMode.underlayColor}
        activeOpacity={0.7}
        onLongPress={() => {
          navigate('BookDet', { book: rowData });
        }} >
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
        }} >
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
              name='ios-return-left'
              type='ionicon'
              color='#000'
              size={24} />
            <Text style={{ color: '#000', fontSize: 10 }}>移出</Text>
          </View>
        </TouchableHighlight>
      </SwipeableQuickActions>
    )
  }
  render() {
    const { dispatch, list, SMode } = this.props;
    console.log(list)
    return ((
      <View style={SMode ? styles.sunnyMode.container : styles.nightMode.container}>
        <StatusBar barStyle='light-content' />
        <SwipeableFlatList
          data={list}
          bounceFirstRowOnMount={false}//屏蔽第一次滑动
          ItemSeparatorComponent={() => <View style={SMode ? styles.sunnyMode.solid : styles.nightMode.solid} />}
          maxSwipeDistance={80}
          renderQuickActions={this.renderActions}
          renderItem={this.renderRow}
          keyExtractor={(item, index) => `${item.bookName}-${item.author}`} />

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