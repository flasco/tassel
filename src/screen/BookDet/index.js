import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { HeaderBackButton } from 'react-navigation';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';

import { createAct } from '../../util';

import { search } from '../../services/book';
import { webSite } from '../../config';
import styles from './index.style';

class BookDetScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      title: `书籍详情`,
      headerLeft: (
        <HeaderBackButton
          title='返回'
          tintColor={'#ddd'}
          onPress={() => navigation.goBack()} />
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

    this.book = props.navigation.state.params.book;

    this.state = {
      isLoading: this.book === undefined,
    }

    this.initx();
  }

  initx = async () => {
    if (this.state.isLoading) {
      let name = this.props.navigation.state.params.bookNam,
        author = this.props.navigation.state.params.bookAut;
      const data = await search(name, author);
      if (data === -1) {
        alert('抓取失败');
        return;
      }
      this.book = data[0];
      if (typeof this.book === 'string') {
        // 如果后台没有搜索到本书会返回一段字符串。
        alert('本书没有记录！如果迫切需要加入本书，请及时反馈给开发人员~');
      } else {
        this.book.source[1] && this.book.source[1].indexOf('m.xs') === -1 && ( this.book.source[1] = this.book.source[1].replace(/www/,'m'));
        this.setState({ isLoading: false });
        this.props.dispatch(createAct('list/setContain')({ flag: this.isContains(this.book) }));
      }
    } else {
      this.props.dispatch(createAct('list/setContain')({ flag: this.isContains(this.book) }));
    }
  }

  isContains = (book) => {
    if (!book) return false;
    return this.props.list.some(x => x.author === book.author && x.bookName === book.bookName) ||
      this.props.fattenList.some(x => x.author === book.author && x.bookName === book.bookName)
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    const { navigate } = this.props.navigation;
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <Text style={{ textAlign: 'center', marginTop: 12, }}>Loading...</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.firstView.container}>
            <Image
              style={styles.firstView.left.imgSize}
              source={{ uri: this.book.img }}
              defaultSource={require('../../assert/noImg.jpg')} />
            <View style={styles.firstView.right.container}>
              <Text style={styles.firstView.right.tit}>{this.book.bookName}</Text>
              <Text style={styles.firstView.right.subDes}>{this.book.author}</Text>
              <Text style={styles.firstView.right.subDes}>{webSite[this.book.plantformId]}</Text>
            </View>
          </View>
          <View style={styles.secondView.container}>
            <Button title={this.props.contains ? '已存在' : '追书'}
              disabled={this.props.btnLoading || this.props.contains}
              disabledStyle={styles.secondView.firstButton.disabledStyle}
              onPress={() => {
                this.props.navigation.state.params.addBook(this.book);
              }}
              loading={this.props.btnLoading}
              textStyle={this.props.contains || this.props.btnLoading ? styles.secondView.firstButton.disText : styles.secondView.firstButton.text}
              buttonStyle={styles.secondView.firstButton.buttonStyle} />
            <Button title='开始阅读'
              onPress={() => {
                navigate('Read', {
                  book: this.book
                });
              }}
              textStyle={styles.secondView.secondButton.text}
              buttonStyle={styles.secondView.secondButton.buttonStyle} />
          </View>
          <View style={styles.solid} />
          <Text style={styles.Desc}>{this.book.desc}</Text>
          <View style={styles.solid} />
          <Text style={[styles.Desc, { textAlign: 'center' }]}>To be continued...</Text>
        </View>
      );
    }
  }
}

function select(state) {
  return {
    list: state.list.list,
    fattenList: state.list.fattenList,
    btnLoading: state.list.btnLoading,
    contains: state.list.isContain,
  }
}

export default connect(select)(BookDetScreen);