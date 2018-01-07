import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Button, InteractionManager } from 'react-native';

import { LargeList } from "react-native-largelist";

import { list } from '../../services/book';
import { HeaderBackButton } from 'react-navigation';
import { connect } from 'react-redux';

import styles from './index.style';

class CatalogScreen extends React.PureComponent {

  static navigationOptions = ({ navigation }) => {
    return {
      title: `${navigation.state.params.name}`,
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
      headerRight: (
        <Button
          title='gDwn'
          onPress={() => {
            that.list.scrollToEnd(false);
          }}
          color='#ddd'
        ></Button>
      ),
      headerTitleStyle: {
        color: '#ddd',
        alignSelf: 'center'
      }
    };
  };
  constructor(props) {
    super(props);
    that = this;
    this.data = props.navigation.state.params.bookChapterLst;
    this.currentChapterNum = props.navigation.state.params.chap;
  }

  componentDidMount() {
    setTimeout(() => {
      this.list.scrollToIndexPath({ section: 0, row: this.currentChapterNum - 5 }, false);
    }, 100);
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  itemRender = (section, index) => {
    let item = this.data[index];
    return (
      <View>
        <View style={this.props.SMode ? styles.sunnyMode.solid : styles.nightMode.solid} />
        <TouchableHighlight style={{ height: 38 }}
          underlayColor={this.props.SMode?styles.sunnyMode.underlayColor:styles.nightMode.underlayColor}
          activeOpacity={0.7}
          onPress={() => {
            this.props.navigation.state.params.callback(index);
            this.props.navigation.goBack();
          }}>
          <Text style={[styles.sunnyMode.rowStyle, this.currentChapterNum === index ? styles.red : false]}>{item.title}</Text>
        </TouchableHighlight>
      </View>
    );
  }

  _header = () => {
    return (
      <View>
        <Text style={styles.LatestChapter}>[最新章节]</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={this.props.SMode ? styles.sunnyMode.container : styles.nightMode.container}>
        <LargeList
          ref={(q) => this.list = q}
          style={{ flex: 1 }}
          numberOfRowsInSection={() => this.data.length}
          heightForCell={() => 38}
          renderCell={this.itemRender}
          renderHeader={this._header}
          getItemLayout={(data, index) => ({ length: 38, offset: 39 * index, index })} />
      </View>
    );
  }
}

function select(state) {
  return {
    SMode: state.app.sunnyMode,
  }
}

export default connect(select)(CatalogScreen);