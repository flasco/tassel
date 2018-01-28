import { StyleSheet, Text, View, FlatList, TextInput, TouchableHighlight, Alert, ActivityIndicator } from 'react-native';
import React, { Component } from 'react';

import { HeaderBackButton } from 'react-navigation'

import { rnk } from '../../services/book';

import styles from './index.style';

class RankScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      title: '起点排行',
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

    this.getNet = this.getNet.bind(this);
    this.JmpToBook = this.JmpToBook.bind(this);
    this.onEndReached = this.onEndReached.bind(this);

    this.currentPage = 1;
    this.state = {
      dataSource: [],
      loadingFlag: true,
      fetchFlag: false,
      FooterText: '上拉加载',
    };
    this.getNet(this.currentPage++);
  }

  componentWillUnmount() {
    //重写组件的setState方法，直接返回空
    this.setState = (state, callback) => {
      return;
    };
  }

  async getNet(page = 1) {
    const data = await rnk(page);
    if(data === -1){
      this.setState({
        dataSource: [],
        fetchFlag: false,
        FooterText: '加载失败',
      });
      return ;
    }
    let source = this.state.dataSource;
    source.push(...data);
    if (page === 1) {
      this.setState({
        dataSource: source,
        loadingFlag: false,
      });
    } else {
      this.setState({
        dataSource: source,
        fetchFlag: false,
        FooterText: '上拉加载',
      });
    }
  }

  JmpToBook(nam, aut) {
    const { navigate } = this.props.navigation;
    navigate('BookDet', {
      bookNam: nam,
      bookAut: aut,
      addBook: this.props.navigation.state.params.addBook
    });
  }

  renderRow = (item) => {
    let rowData = item.item;
    return (
      <TouchableHighlight
        underlayColor='#eeeeee'
        activeOpacity={0.7}
        onPress={() => { this.JmpToBook(rowData.name, rowData.author); }}>
        <View style={{ height: 70 }}>
          <Text style={styles.rowStyle}>
            {`[${rowData.type}]  ${rowData.name} - ${rowData.author}\n${rowData.latestChapter.length > 23 ? (rowData.latestChapter.substr(0, 23) + '...') : rowData.latestChapter}`}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }

  _keyExtractor = (item, index) => `${item.name}${index}`;

  onEndReached() {
    if (this.state.fetchFlag === true) return;
    this.setState({
      FooterText: '正在加载中...',
      fetchFlag: true,
    }, () => {
      this.getNet(this.currentPage++);
    });
  }

  _footer = () => {
    return (
      <View style={styles.footerContainer} >
        {this.state.fetchFlag ? <ActivityIndicator size="small" color="#888888" /> : false}
        <Text style={[styles.footerText, this.state.fetchFlag ? ({ marginLeft: 7 }) : (false)]}>{this.state.FooterText}</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.loadingFlag ? <Text style={{ textAlign: 'center', marginTop: 12, }}>Fetch RnkList...</Text> :
          <FlatList
            style={{ flex: 1 }}
            data={this.state.dataSource}
            renderItem={this.renderRow}
            ItemSeparatorComponent={() => <View style={styles.solid} />}
            getItemLayout={(data, index) => ({ length: 70, offset: 71 * index, index })}//行高70，分割线1，所以offset=71
            keyExtractor={this._keyExtractor}
            onEndReached={this.onEndReached}
            ListFooterComponent={this._footer}
            onEndReachedThreshold={-0.1} />}
      </View>
    );
  }
}

export default RankScreen;