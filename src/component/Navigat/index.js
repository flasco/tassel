import React from 'react';
import {
  Text, View, TouchableOpacity, StatusBar,
  TouchableWithoutFeedback, Animated, Dimensions, Easing
} from 'react-native';
import Icon from 'react-native-vector-icons/Foundation';
import { HeaderBackButton } from 'react-navigation';
import styles from './index.style';

const { height, width } = Dimensions.get('window');

export default class Navigat extends React.PureComponent {
  state = {
    show: new Animated.Value(1),
    barShow: false
  }
  DoCache = () => {
    this.props.showAlertSelected();
  }

  JmptoChapterList = () => {
    this.props.navigation.navigate('ChaL', {
      url: this.props.currentBook.url,
      name: this.props.currentBook.bookName,
      bookChapterLst: this.props.bookChapterLst,
      chap: this.props.currentRecord.recordChapterNum,
      callback: (url) => {
        this.clickShow(false);
        this.props.getChapterUrl(url);
      }
    });
  }
  isAnimate = false;

  clickShow = (status = true) => {
    if (this.isAnimate) return;
    this.isAnimate = true;
    Animated.timing(this.state.show,
      {
        toValue: status ? 0 : 1,
        duration: 120,
        easing: Easing.out(Easing.poly(4)),
      }).start((event) => {
        if (event.finished) {
          this.isAnimate = false;
        }
      });
    this.setState({
      barShow: status
    });
  }

  JmptoChooseSource = () => {
    this.props.navigation.navigate('Origin', {
      book: this.props.currentBook,
      reLoad: (needRefresh) => this.props.reLoad(needRefresh),
      callback: (url) => this.props.getChapterUrl(url)
    });
  }

  render() {
    return (
      <Animated.View
        style={{
          backgroundColor: 'transparent', position: 'absolute', height, width,
          zIndex: this.state.show.interpolate({
            inputRange: [0, 1],
            outputRange: [64, -1]
          }),
          opacity: this.state.show.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0]
          }),
        }}>
        <StatusBar
          barStyle="light-content"
          hidden={!this.state.barShow}
          animation={true} />
        <Animated.View style={{
          height: this.state.show.interpolate({
            inputRange: [0, 1],
            outputRange: [64, 0]
          }), backgroundColor: '#000', paddingTop: 20
        }}>
          <View style={{ flexDirection: 'row', }}>
            <HeaderBackButton
              title='返回'
              tintColor={'#ddd'}
              onPress={() => {
                this.props.recordSave();
                this.props.navigation.goBack();
              }} />
            <Text style={styles.originText}
              onPress={() => {
                this.JmptoChooseSource();
              }}>换源</Text>
          </View>
        </Animated.View>
        <TouchableWithoutFeedback
          onPress={() => { this.clickShow(false); }}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>
        <Animated.View style={[styles.Fotter, {
          height: this.state.show.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0]
          }),
        }]}>
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
        </Animated.View>
      </Animated.View>
    )
  }
}