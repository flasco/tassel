import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, InteractionManager } from 'react-native';

import Icon from 'react-native-vector-icons/Foundation';
import { HeaderBackButton } from 'react-navigation';
import styles from './index.style';

/**
 * 这个是自定义的StackNavigator导航栏
 * 用在了NovelRead.js中
 - code by Czq
 */
export default class Navigat extends React.PureComponent {
  constructor(props) {
    super(props);

    this.DoCache = this.DoCache.bind(this);
    this.JmptoChapterList = this.JmptoChapterList.bind(this);

    that = this;
  }

  DoCache() {
    this.props.showAlertSelected();
  }

  JmptoChapterList() {
    this.props.navigation
      .navigate('ChaL', {
        url: this.props.urlx,
        name: this.props.bname,
        bookChapterLst: this.props.bookChapterLst,
        chap: this.props.currentChapter,
        callback: (url) => this.props.getChapterUrl(url)
      });
  }

  JmptoChooseSource() {
    this.props.navigation
      .navigate('Origin', {
        book: this.props.currentBook,
        readId: this.props.readId,
        reLoad: () => this.props.reLoad(),
        callback: (url) => this.props.getChapterUrl(url)
      });
  }

  render() {
    if (this.props.choose === 1) {
      return (
        <View style={styles.Navig}>
          <HeaderBackButton
            title='返回'
            tintColor={'#fff'}
            onPress={() => {
              this.props.navigation.goBack();
            }} />
            <Text style={{color:'#fff',fontSize:17,bottom:13,right:24,position:'absolute'}}
              onPress={()=>{
                this.JmptoChooseSource();
              }}>换源</Text>
        </View>
      );
    } else if (this.props.choose === 2) {
      return (
        <View style={styles.Fotter}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.props.SModeChange(); }}>
            <Icon
              name="burst"
              size={20}
              color={'#aaa'}
              style={styles.fontCenter} />
            <Text style={styles.FotterItems}>切换</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1 }} onPress={this.JmptoChapterList}>
            <Icon
              name="list"
              size={20}
              color={'#aaa'}
              style={styles.fontCenter} />
            <Text style={styles.FotterItems}>目录</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.DoCache() }}>
            <Icon
              name="download"
              size={20}
              color={'#aaa'}
              style={styles.fontCenter} />
            <Text style={styles.FotterItems}>缓存</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => { alert('coming soon...') }}>
            <Icon
              name="widget"
              size={20}
              color={'#aaa'}
              style={styles.fontCenter} />
            <Text style={styles.FotterItems}>设置</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }
}