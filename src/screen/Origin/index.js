import React from 'react';
import { Text, View, FlatList, TouchableHighlight } from 'react-native';
import { HeaderBackButton } from 'react-navigation';
import { Badge } from 'react-native-elements';
import { connect } from 'react-redux';

import { latest } from '../../api/book';
import { webSite } from '../../config';
import { createAct, spliceLine, getAndroidStyle } from '../../util';

import styles from './index.style';

class OriginScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      title: `${navigation.state.params.book.bookName}`,
      headerLeft: (
        <HeaderBackButton
          title="返回"
          tintColor={'#ddd'}
          onPress={() => {
            navigation.goBack();
          }}
        />
      ),
      headerStyle: {
        backgroundColor: '#000',
        borderBottomWidth: 0,
        ...getAndroidStyle(),
      },
      headerTitleStyle: {
        color: '#ddd',
        alignSelf: 'center'
      }
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
    this.dataList = [];
    this.getOrigin();
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  getOrigin = async () => {
    let originList = this.props.navigation.state.params.book.source;
    let tasks = [],
      list = [];
    for (let i in originList) {
      tasks.push(latest(originList[i]));
    }
    let res = await Promise.all(tasks);
    let j = 0;
    for (let i in originList) {
      this.dataList.push({
        site: i,
        latestChapter: res[j++],
        isSelect: i === `${this.props.navigation.state.params.book.plantformId}`
      });
    }
    this.setState({ loading: false });
  };

  renderRow = item => {
    let rowData = item.item;
    const { SMode } = this.props;
    return (
      <TouchableHighlight
        style={SMode ? styles.sunnyMode.rowStyle : styles.nightMode.rowStyle}
        underlayColor={'transparent'}
        activeOpacity={0.7}
        onPress={() => {
          let boo =
            rowData.site !==
            this.props.navigation.state.params.book.plantformId;
          this.props.dispatch(
            createAct('list/changeOrigin')({
              id: 0, // 因为那时候已经因为排序而来到了第一名。
              change: rowData.site,
              latestChapter: rowData.latestChapter,
              bookName: this.props.navigation.state.params.book.bookName
            })
          );
          this.props.navigation.state.params.reLoad(boo);
          this.props.navigation.goBack();
        }}
      >
        <View>
          <View style={{ flexDirection: 'row' }}>
            <Text
              style={
                SMode
                  ? styles.sunnyMode.titleStyle
                  : styles.nightMode.titleStyle
              }
            >
              {webSite[rowData.site]}
            </Text>
            {rowData.isSelect && (
              <Badge
                value={`当前选择`}
                containerStyle={
                  SMode
                    ? styles.sunnyMode.badgeStyle
                    : styles.nightMode.badgeStyle
                }
                textStyle={{ fontSize: 11 }}
              />
            )}
          </View>
          <Text style={styles.sunnyMode.subTitleStyle}>
            {`${spliceLine(rowData.latestChapter, 23)}`}
          </Text>
        </View>
      </TouchableHighlight>
    );
  };

  render() {
    const { SMode } = this.props;
    if (this.state.loading)
      return (
        <View
          style={
            SMode ? styles.sunnyMode.container : styles.nightMode.container
          }
        >
          <Text
            style={[
              { marginTop: 15, textAlign: 'center' },
              SMode ? null : { color: '#ddd' }
            ]}
          >
            Please Wait...
          </Text>
        </View>
      );
    return (
      <View
        style={SMode ? styles.sunnyMode.container : styles.nightMode.container}
      >
        <FlatList
          style={{ flex: 1 }}
          data={this.dataList}
          renderItem={this.renderRow}
          ItemSeparatorComponent={() => (
            <View
              style={SMode ? styles.sunnyMode.solid : styles.nightMode.solid}
            />
          )}
          getItemLayout={(data, index) => ({
            length: 70,
            offset: 71 * index,
            index
          })} //行高38，分割线1，所以offset=39
          keyExtractor={(item, index) => `${index}`}
        />
      </View>
    );
  }
}

function select(state) {
  return {
    SMode: state.app.sunnyMode
  };
}

export default connect(select)(OriginScreen);
