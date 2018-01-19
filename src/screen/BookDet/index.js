import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';

import { HeaderBackButton } from 'react-navigation';
import { Button } from 'react-native-elements';

import { connect } from 'react-redux';

import Toast from '../../component/Toast';
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

    this.book = props.navigation.state.params.book;

    this.state = {
      isLoading: this.book === undefined,
      contains: this.book !== undefined && this.isContains(this.book),
    }
    this.initx = this.initx.bind(this);

    this.initx();
  }

  async initx() {
    if (this.state.isLoading) {
      let name = this.props.navigation.state.params.bookNam,
        author = this.props.navigation.state.params.bookAut;
      const { data } = await search(name, author);
      this.book = data[0];
      if (typeof this.book === 'string') {
        alert('本书没有记录！如果迫切需要加入本书，请及时反馈给开发人员~');
      } else {
        this.setState({
          isLoading: false,
          contains: this.isContains(this.book)
        })
      }
    }
  }

  isContains = (book) => {
    return this.props.list.filter(x => {
      return x.author === book.author && x.bookName === book.bookName
    }).length > 0;
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
            <Button title={this.state.contains ? '已存在' : '追书'}
              disabled={this.state.contains}
              disabledStyle={styles.secondView.firstButton.disabledStyle}
              onPress={() => {
                this.setState({ contains: true })
                this.props.navigation.state.params.addBook(this.book);
                this.refs.toast.show('书籍添加成功..');
              }}
              textStyle={this.state.contains ? styles.secondView.firstButton.disText : styles.secondView.firstButton.text}
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
          <Toast ref="toast" />
        </View>
      );
    }
  }
}

function select(state) {
  return {
    list: state.list.list,
  }
}

export default connect(select)(BookDetScreen);