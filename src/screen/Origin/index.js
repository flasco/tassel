import React from 'react';
import { Text, View, FlatList, TouchableHighlight } from 'react-native';
import { HeaderBackButton } from 'react-navigation';
import { connect } from 'react-redux';

import { latest } from '../../services/book';
import { changeOrigin } from '../../actions/list'

import { Badge } from 'react-native-elements';

import { webSite } from '../../config';

import styles from './index.style';

class OriginScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: `${navigation.state.params.book.bookName}`,
      headerLeft: (
        <HeaderBackButton
          title='返回'
          tintColor={'#ddd'}
          onPress={() => {
            navigation.goBack();
          }} />
      ),
      headerStyle: {
        backgroundColor: '#000'
      },
      headerTitleStyle: {
        color: '#ddd',
        alignSelf: 'center'
      }
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    }
    this.dataList = [];
    this.getOrigin();
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  getOrigin = async () => {
    let originList = this.props.navigation.state.params.book.source;
    let tasks = [], list = [];
    for (let i in originList) {
      tasks.push(latest(originList[i]));
    }
    let res = await Promise.all(tasks);
    let j = 0;
    for (let i in originList) {
      this.dataList.push({
        site: i,
        latestChapter: res[j++],
        isSelect: i === `${this.props.navigation.state.params.book.plantformId}`
      })
    }
    this.setState({ loading: false })
  }

  _keyExtractor = (item, index) => index;

  _renderRow = (item) => {
    let rowData = item.item;
    const { SMode } = this.props;
    return (
      <TouchableHighlight style={SMode ? styles.sunnyMode.rowStyle : styles.nightMode.rowStyle}
        underlayColor={SMode ? styles.sunnyMode.underlayColor : styles.nightMode.underlayColor}
        activeOpacity={0.7}
        onPress={() => {
          this.props.dispatch(changeOrigin({
            id:this.props.navigation.state.params.readId,
            change:rowData.site
          }))
          this.props.navigation.state.params.reLoad();
          this.props.navigation.goBack();
        }}>
        <View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={SMode ? styles.sunnyMode.titleStyle : styles.nightMode.titleStyle}>
              {webSite[rowData.site]}
            </Text>
            {rowData.isSelect && <Badge value={`当前选择`} containerStyle={SMode ? styles.sunnyMode.badgeStyle : styles.nightMode.badgeStyle} textStyle={{ fontSize: 11 }} />}
          </View>
          <Text style={styles.sunnyMode.subTitleStyle}>
            {`${rowData.latestChapter.length > 23 ? (rowData.latestChapter.substr(0, 23) + '...') : rowData.latestChapter}`}
          </Text>
        </View>
      </TouchableHighlight >
    );
  }

  render() {
    if (this.state.loading) return null;
    const { SMode } = this.props;
    return (
      <View style={SMode ? styles.sunnyMode.container : styles.nightMode.container}>
        <FlatList
          style={{ flex: 1 }}
          data={this.dataList}
          renderItem={this._renderRow}
          ItemSeparatorComponent={() => <View style={styles.sunnyMode.solid} />}
          getItemLayout={(data, index) => ({ length: 70, offset: 71 * index, index })}//行高38，分割线1，所以offset=39
          keyExtractor={this._keyExtractor} />
      </View>
    );
  }
}

function select(state) {
  return {
    SMode: state.app.sunnyMode,
  }
}

export default connect(select)(OriginScreen);