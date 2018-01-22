import { StyleSheet, Text, View, Dimensions, TouchableOpacity, AsyncStorage, TouchableWithoutFeedback, Linking } from 'react-native';
import React from 'react';

import { changeServer } from '../../services/book';

import { connect } from 'react-redux';
import { createAct } from '../../util'

import styles from './index.style';
const window = Dimensions.get('window');

class Menu extends React.PureComponent {
  constructor(props) {
    super(props);
    this.leanMore = this.leanMore.bind(this);
    this.CleanData = this.CleanData.bind(this);
  }

  componentWillUnmount() {
    //重写组件的setState方法，直接返回空
    this.setState = (state, callback) => {
      return;
    };
  }

  leanMore() {
    changeServer();
  }

  async CleanData() {
    this.props.dispatch(createAct('list/operationAdd')());
    await AsyncStorage.clear();
    alert('除书架记录之外的数据已经全部清空');
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.menu}>
        <TouchableOpacity onPress={() => navigate('Sear', { addBook: this.props.addBook })}>
          <Text style={styles.item} >Search</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { navigate('RnkL', { addBook: this.props.addBook }); }}>
          <Text style={styles.item} >RankList</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.leanMore}>
          <Text style={styles.item} >Server line Change</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.CleanData}>
          <Text style={styles.item} >CleanAllData</Text>
        </TouchableOpacity>
        <Text style={styles.copyRight} onPress={() => {
          Linking.openURL('https://github.com/flasco');
        }}>Start at Thu</Text>
      </View>
    );
  }
}

function select(state) {
  return {}
}
export default connect(select)(Menu);