import {
  Text,
  View,
  FlatList,
  TouchableHighlight,
  ActivityIndicator
} from 'react-native';
import React from 'react';
import get from 'lodash/get';

import { spliceLine, getDefaultTitleStyle } from '@util';

import { rnk } from '@api/book';

import styles from './index.style';

class RankScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      title: '起点排行',
      ...getDefaultTitleStyle(navigation),
    };
  };
  constructor(props) {
    super(props);

    this.currentPage = 1;
    this.gender = get(props, 'navigation.state.params.gender', 0);

    this.state = {
      dataSource: [],
      loadingFlag: true,
      fetchFlag: false,
      FooterText: '上拉加载'
    };
    this.getNet(this.currentPage++);
  }

  componentWillUnmount() {
    //重写组件的setState方法，直接返回空
    this.setState = () => {};
  }

  getNet = async (page = 1) => {
    const data = await rnk(page, this.gender);
    if (data === -1) {
      this.setState({
        // dataSource: [],
        fetchFlag: true,
        FooterText: '加载失败, 上拉重试'
      });
      return;
    }
    const source = this.state.dataSource.concat(data);
    if (page === 1) {
      this.setState({
        dataSource: source,
        loadingFlag: false
      });
    } else {
      this.setState({
        dataSource: source,
        fetchFlag: false,
        FooterText: '上拉加载'
      });
    }
  }

  JmpToBook = (nam, aut) => {
    const { navigate } = this.props.navigation;
    navigate('BookDet', {
      bookNam: nam,
      bookAut: aut,
      addBook: this.props.navigation.state.params.addBook
    });
  }

  renderRow = item => {
    let rowData = item.item;
    return (
      <TouchableHighlight
        underlayColor={'transparent'}
        activeOpacity={0.7}
        onPress={() => {
          this.JmpToBook(rowData.name, rowData.author);
        }}
      >
        <View style={{ height: 70 }}>
          <Text style={styles.rowStyle}>
            {`[${rowData.type}]  ${rowData.name} - ${
              rowData.author
            }\n${spliceLine(rowData.latestChapter, 23)}`}
          </Text>
        </View>
      </TouchableHighlight>
    );
  };

  _keyExtractor = (item, index) => `${item.name}${index}`;

  onEndReached = () => {
    if (this.state.fetchFlag === true) return;
    this.setState(
      {
        FooterText: '正在加载中...',
        fetchFlag: true
      },
      () => {
        this.getNet(this.currentPage++);
      }
    );
  }

  _footer = () => {
    return (
      <View style={styles.footerContainer}>
        {this.state.fetchFlag ? (
          <ActivityIndicator size="small" color="#888888" />
        ) : (
          false
        )}
        <Text
          style={[
            styles.footerText,
            this.state.fetchFlag ? { marginLeft: 7 } : false
          ]}
        >
          {this.state.FooterText}
        </Text>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.loadingFlag ? (
          <Text style={{ textAlign: 'center', marginTop: 12 }}>
            Fetch RnkList...
          </Text>
        ) : (
          <FlatList
            style={{ flex: 1 }}
            data={this.state.dataSource}
            renderItem={this.renderRow}
            ItemSeparatorComponent={() => <View style={styles.solid} />}
            getItemLayout={(data, index) => ({
              length: 70,
              offset: 71 * index,
              index
            })} //行高70，分割线1，所以offset=71
            keyExtractor={this._keyExtractor}
            onEndReached={this.onEndReached}
            ListFooterComponent={this._footer}
            onEndReachedThreshold={-0.1}
          />
        )}
      </View>
    );
  }
}

export default RankScreen;
