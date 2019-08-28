import React from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  SwipeableFlatList,
  Image
} from 'react-native';
import { Icon, Badge } from 'react-native-elements';
import SwipeableQuickActions from '@components/SwipeableQuickActions';
import { connect } from 'react-redux';
import { createAct, getDefaultTitleStyle } from '@util';
import styles from './index.style';

class FattenListScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      title: '养肥区',
      ...getDefaultTitleStyle(navigation)
    };
  };

  componentWillUnmount() {
    this.setState = () => {};
  }

  moveBook = bookId => {
    this.props.dispatch(createAct('list/moveBook')({ bookId }));
  };

  renderRow = item => {
    const rowData = item.item;
    const {
      styleMode,
      navigation: { navigate }
    } = this.props;
    return (
      <TouchableHighlight
        style={styleMode.rowStyle}
        underlayColor={styleMode.underlayColor}
        activeOpacity={0.7}
        onLongPress={() => {
          navigate('BookDet', { book: rowData });
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <Image source={{ uri: rowData.img }} style={styles.coverStyle} />
          <View style={{ paddingLeft: 15 }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styleMode.titleStyle}>{rowData.bookName}</Text>
              {rowData.updateNum >= 30 && (
                <Badge
                  value={`待杀`}
                  containerStyle={styleMode.badgeStyle}
                  textStyle={{ fontSize: 11 }}
                />
              )}
            </View>
            <Text style={styleMode.subTitleStyle}>{`已经养了${
              rowData.updateNum
            }章`}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  renderActions = item => {
    const { SMode, styleMode } = this.props;
    const rowId = item.index;
    const fattenColor = SMode ? '#000' : '#ddd';
    return (
      <SwipeableQuickActions
        style={{
          backgroundColor: styleMode.rowStyle.backgroundColor
        }}
      >
        <TouchableHighlight
          underlayColor={'transparent'}
          onPress={() => this.moveBook(rowId)}
        >
          <View
            style={{
              width: 70,
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              justifyContent: 'center'
            }}
          >
            <Icon
              name="ios-return-left"
              type="ionicon"
              color={fattenColor}
              size={24}
            />
            <Text style={{ color: fattenColor, fontSize: 10 }}>移出</Text>
          </View>
        </TouchableHighlight>
      </SwipeableQuickActions>
    );
  };

  render() {
    const { fattenList, styleMode } = this.props;
    return (
      <View style={styleMode.container}>
        <SwipeableFlatList
          data={fattenList}
          bounceFirstRowOnMount={false} //屏蔽第一次滑动
          ItemSeparatorComponent={() => <View style={styleMode.solid} />}
          maxSwipeDistance={80}
          renderQuickActions={this.renderActions}
          renderItem={this.renderRow}
          keyExtractor={(item, index) => `${item.bookName}-${item.author}`}
        />
      </View>
    );
  }
}

function select(state) {
  return {
    fattenList: state.list.fattenList,
    SMode: state.app.sunnyMode,
    styleMode: state.app.sunnyMode ? styles.sunnyMode : styles.nightMode
  };
}

export default connect(select)(FattenListScreen);
