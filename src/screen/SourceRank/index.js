import { Text, View } from 'react-native';
import React from 'react';

import { getDefaultTitleStyle } from '@util';

import { sourceRank } from '@api/book';

import styles from './index.style';

class SourceRankScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      title: '书源排行',
      ...getDefaultTitleStyle(navigation)
    };
  };

  state = {
    rankData: [],
    isLoading: true
  };

  componentDidMount() {
    sourceRank().then(result => {
      const arr = [];
      Object.keys(result).forEach(key =>
        arr.push({ name: key, count: result[key] })
      );
      arr.sort((a, b) => b.count - a.count);
      this.setState({ rankData: arr, isLoading: false });
    });
  }

  componentWillUnmount() {
    //重写组件的setState方法，直接返回空
    this.setState = () => {};
  }

  render() {
    const { isLoading, rankData } = this.state;
    return (
      <View style={styles.container}>
        {isLoading ? (
          <Text style={{ textAlign: 'center', marginTop: 12 }}>Loading...</Text>
        ) : rankData.length ? (
          <Text style={{ textAlign: 'center', marginTop: 12 }}>
            暂无数据...
          </Text>
        ) : (
          rankData.map((item, index) => {
            return (
              <View
                key={index}
                style={{ height: 50, justifyContent: 'center' }}
              >
                <Text style={styles.rowStyle}>
                  {`${index + 1}. ${item.name}  (${item.count})`}
                </Text>
              </View>
            );
          })
        )}
      </View>
    );
  }
}

export default SourceRankScreen;
