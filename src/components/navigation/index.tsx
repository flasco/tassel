import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/Foundation';
import { HeaderBackButton, NavigationScreenProp } from 'react-navigation';
import { judgeIphoneX } from '../../util';

import styles from './index.style';

const { height, width } = Dimensions.get('window');

const BAR_OUTPUT = [judgeIphoneX ? 88 : 64, 0];
const BOTTOM_OUTPUT = [judgeIphoneX ? 90 : 50, 0];

interface INavigateProps {
  getChapterUrl: (url: string) => void;
  reLoad: (needRefresh: boolean) => void;
  recordSave: () => void;
  SModeChange: () => void;
  showAlertSelected: () => void;
  navigation: NavigationScreenProp<null>;
  currentBook: any;
  currentRecord: any;
  bookChapterLst: any[];
}

interface IFooterItemProps {
  onPress: () => void;
  icon: string;
  title: string;
}

const FooterItem: React.FC<IFooterItemProps> = ({ onPress, icon, title }) => {
  return (
    <TouchableOpacity style={styles.footerItems.container} onPress={onPress}>
      <Icon name={icon} size={20} color={'#aaa'} />
      <Text style={styles.footerItems.text}>{title}</Text>
    </TouchableOpacity>
  );
};

export default class Navigat extends React.PureComponent<INavigateProps> {
  state = {
    show: new Animated.Value(1),
    barShow: false,
  };

  DoCache = () => {
    this.props.showAlertSelected();
  };

  JmptoChapterList = () => {
    this.props.navigation.navigate('ChaL', {
      url: this.props.currentBook.url,
      name: this.props.currentBook.bookName,
      bookChapterLst: this.props.bookChapterLst,
      chap: this.props.currentRecord.recordChapterNum,
      callback: url => {
        this.clickShow(false);
        this.props.getChapterUrl(url);
      },
    });
  };
  isAnimate = false;

  clickShow = (status = true) => {
    if (this.isAnimate) return;
    this.isAnimate = true;
    Animated.timing(this.state.show, {
      toValue: status ? 0 : 1,
      duration: 120,
      easing: Easing.out(Easing.poly(4)),
    }).start(event => {
      if (event.finished) {
        this.isAnimate = false;
      }
    });
    this.setState({
      barShow: status,
    });
  };

  JmptoChooseSource = () => {
    this.props.navigation.navigate('Origin', {
      book: this.props.currentBook,
      reLoad: needRefresh => this.props.reLoad(needRefresh),
      callback: url => this.props.getChapterUrl(url),
    });
  };

  renderHeader = () => {
    return (
      <Animated.View
        style={{
          height: this.state.show.interpolate({
            inputRange: [0, 1],
            outputRange: BAR_OUTPUT,
          }),
          backgroundColor: '#000',
          paddingTop: 20,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            position: 'absolute',
            bottom: 0,
            right: 0,
            left: 0,
          }}
        >
          <HeaderBackButton
            title="返回"
            tintColor={'#ddd'}
            onPress={() => {
              this.props.recordSave();
              this.props.navigation.goBack();
            }}
          />
          <Text
            style={styles.originText}
            onPress={() => {
              this.JmptoChooseSource();
            }}
          >
            换源
          </Text>
        </View>
      </Animated.View>
    );
  };

  renderContentTrigger = () => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.clickShow(false);
        }}
      >
        <View style={{ flex: 1 }} />
      </TouchableWithoutFeedback>
    );
  };

  footerOptMap = [
    {
      title: '切换',
      icon: 'burst',
      onPress: () => this.props.SModeChange(),
    },
    {
      title: '目录',
      icon: 'list',
      onPress: this.JmptoChapterList,
    },
    {
      title: '缓存',
      icon: 'download',
      onPress: () => this.DoCache(),
    },
    {
      title: '设置',
      icon: 'widget',
      onPress: () => alert('coming soon...'),
    },
  ];

  renderFooter = () => {
    return (
      <Animated.View
        style={[
          styles.footer,
          {
            height: this.state.show.interpolate({
              inputRange: [0, 1],
              outputRange: BOTTOM_OUTPUT,
            }),
            paddingBottom: judgeIphoneX ? 20 : 0,
          },
        ]}
      >
        {this.footerOptMap.map(({ title, icon, onPress }, index) => (
          <FooterItem title={title} icon={icon} onPress={onPress} key={index} />
        ))}
      </Animated.View>
    );
  };

  render() {
    return (
      <Animated.View
        style={{
          backgroundColor: 'transparent',
          position: 'absolute',
          height,
          width,
          zIndex: this.state.show.interpolate({
            inputRange: [0, 1],
            outputRange: BAR_OUTPUT,
          }),
          opacity: this.state.show.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
          }),
        }}
      >
        <StatusBar
          translucent
          backgroundColor={'#000'}
          barStyle="light-content"
          hidden={!this.state.barShow}
        />
        {this.renderHeader()}
        {this.renderContentTrigger()}
        {this.renderFooter()}
      </Animated.View>
    );
  }
}
