import React from 'react';
import { Text, View, TouchableOpacity, Linking } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { connect } from 'react-redux';

import { serverInfo } from '@api/book';
import { createAct, NavigationActions, Storage } from '@util';

import styles from './index.style';

class Menu extends React.PureComponent {
  state = {
    collapsed: true
  };

  componentWillUnmount() {
    //重写组件的setState方法，直接返回空
    this.setState = () => {};
  }

  leanMore = () => {
    serverInfo();
  };

  cleanData = () => {
    this.props.dispatch(createAct('list/operationAdd')());
    Storage.clear(0); // 清理缓存
    Storage.clear(1); // 清理章节目录
    alert('缓存已清理');
  };

  navigate = (routeName, params) => {
    this.props.dispatch(
      NavigationActions.navigate({
        routeName,
        params
      })
    );
  };

  _collapsed = () => {
    const collapsed = !this.state.collapsed;
    this.setState({ collapsed });
  };

  render() {
    const { collapsed } = this.state;
    return (
      <View style={styles.menu}>
        <View style={styles.itemX}>
          <Text style={styles.itemY}>{`当前已阅读字数:  ${(
            this.props.readNum / 10000
          ).toFixed(2)} W`}</Text>
        </View>
        <TouchableOpacity
          onPress={() => this.navigate('Sear', { addBook: this.props.addBook })}
        >
          <Text style={styles.item}>搜索</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this._collapsed}>
          <Text style={styles.item}>排行</Text>
        </TouchableOpacity>
        <Collapsible collapsed={collapsed}>
          <TouchableOpacity
            onPress={() =>
              this.navigate('RnkL', { addBook: this.props.addBook, gender: 0 })
            }
          >
            <Text style={styles.subItem}>起点男生</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              this.navigate('RnkL', { addBook: this.props.addBook, gender: 1 })
            }
          >
            <Text style={styles.subItem}>起点女生</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              this.navigate('SourceRank', { addBook: this.props.addBook, gender: 1 })
            }
          >
            <Text style={styles.subItem}>书源排行</Text>
          </TouchableOpacity>
        </Collapsible>

        <TouchableOpacity onPress={this.leanMore}>
          <Text style={styles.item}>查看服务器</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.cleanData}>
          <Text style={styles.item}>清理所有缓存</Text>
        </TouchableOpacity>
        <Text
          style={styles.copyRight}
          onPress={() => {
            Linking.openURL('https://github.com/flasco');
          }}
        >
          Start at Thu
        </Text>
      </View>
    );
  }
}

function select(state) {
  return {
    readNum: state.app.readNum
  };
}
export default connect(select)(Menu);
