import React from 'react';
import { Text, View, Image } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';

import { createAct, getDefaultTitleStyle } from '@util';

import { search } from '@api/book';
import styles from './index.style';

class BookDetScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      title: `书籍详情`,
      ...getDefaultTitleStyle(navigation),
    };
  };
  constructor(props) {
    super(props);

    this.book = props.navigation.state.params.book;

    this.state = {
      isLoading: this.book === undefined
    };

    this.initx();
  }

  initx = async () => {
    if (this.state.isLoading) {
      const {
        bookNam: name,
        bookAut: author
      } = this.props.navigation.state.params;
      const data = await search(name, author);

      if (data.length < 1 || data[0] == null) {
        // 如果后台没有搜索到本书会返回一段字符串。
        alert('本书没有记录！如果迫切需要加入本书，请及时反馈给开发人员~');
      } else {
        this.book = data[0];
        Object.keys(this.book.source).length &&
          this.setState({ isLoading: false });
        this.props.dispatch(
          createAct('list/setContain')({ flag: this.isContains(this.book) })
        );
      }
    } else {
      this.props.dispatch(
        createAct('list/setContain')({ flag: this.isContains(this.book) })
      );
    }
  };

  isContains = book => {
    if (!book) return false;
    const isEQ = x => x.author === book.author && x.bookName === book.bookName;
    return this.props.list.some(isEQ) || this.props.fattenList.some(isEQ);
  };

  componentWillUnmount() {
    this.setState = () => {};
  }

  render() {
    const { navigate } = this.props.navigation;
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <Text style={{ textAlign: 'center', marginTop: 12 }}>Loading...</Text>
        </View>
      );
    }
    const { img, bookName, author, plantformId, desc } = this.book;
    const { contains, btnLoading, webSite } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.firstView.container}>
          <Image
            style={styles.firstView.left.imgSize}
            source={{ uri: img }}
            defaultSource={require('@assets/noImg.jpg')}
          />
          <View style={styles.firstView.right.container}>
            <Text style={styles.firstView.right.tit}>{bookName}</Text>
            <Text style={styles.firstView.right.subDes}>{author}</Text>
            <Text style={styles.firstView.right.subDes}>
              {webSite[plantformId]}
            </Text>
          </View>
        </View>
        <View style={styles.secondView.container}>
          <Button
            title={contains ? '已存在' : '追书'}
            disabled={btnLoading || contains}
            disabledStyle={styles.secondView.firstButton.disabledStyle}
            onPress={() => {
              this.props.navigation.state.params.addBook(this.book);
            }}
            loading={btnLoading}
            textStyle={
              contains || btnLoading
                ? styles.secondView.firstButton.disText
                : styles.secondView.firstButton.text
            }
            buttonStyle={styles.secondView.firstButton.buttonStyle}
          />
          <Button
            title="开始阅读"
            onPress={() => {
              navigate('Read', {
                book: this.book
              });
            }}
            textStyle={styles.secondView.secondButton.text}
            buttonStyle={styles.secondView.secondButton.buttonStyle}
          />
        </View>
        <View style={styles.solid} />
        <Text style={styles.Desc}>{desc}</Text>
        <View style={styles.solid} />
        <Text style={[styles.Desc, { textAlign: 'center' }]}>
          To be continued...
        </Text>
      </View>
    );
  }
}

function select(state) {
  return {
    webSite: state.app.siteMap,
    list: state.list.list,
    fattenList: state.list.fattenList,
    btnLoading: state.list.btnLoading,
    contains: state.list.isContain
  };
}

export default connect(select)(BookDetScreen);
