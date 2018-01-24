import React, { Component } from 'react';
import {
  Text, View, TouchableHighlight,
  SwipeableFlatList, StatusBar, Image,
} from 'react-native';
import { Icon, Badge } from 'react-native-elements';
import SwipeableQuickActions from 'SwipeableQuickActions';
import { connect } from 'react-redux';
import { HeaderBackButton } from 'react-navigation'
import { createAct } from '../../util'
import styles from './index.style';

class FattenListScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      title: '养肥区',
      headerStyle: { backgroundColor: '#000' },
      headerTitleStyle: { color: '#ddd', alignSelf: 'center' },
      headerLeft: (
        <HeaderBackButton
          title='返回'
          tintColor={'#ddd'}
          onPress={() => {
            navigation.goBack();
          }} />
      ),
    };
  };

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  moveBook = (bookId) => {
    this.props.dispatch(createAct('list/moveBook')({ bookId }))
  }

  renderRow = (item) => {
    let rowData = item.item;
    let rowId = item.index;
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

  renderActions = (item) => {
    let SMode = this.props.SMode;
    let rowData = item.item;
    let rowId = item.index;
    return (
      <SwipeableQuickActions style={{ backgroundColor: SMode ? styles.sunnyMode.rowStyle.backgroundColor : styles.nightMode.rowStyle.backgroundColor }}>
        <TouchableHighlight
          onPress={() => this.moveBook(rowId)}>
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
    const { fattenList, SMode } = this.props;
    return ((
      <View style={SMode ? styles.sunnyMode.container : styles.nightMode.container}>
        <SwipeableFlatList
          data={fattenList}
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
    fattenList: state.list.fattenList,
    SMode: state.app.sunnyMode,
  }
}

export default connect(select)(FattenListScreen);