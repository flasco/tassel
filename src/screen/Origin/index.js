import React from 'react';
import { Text, View, FlatList, TouchableHighlight } from 'react-native';
import { Badge } from 'react-native-elements';
import { connect } from 'react-redux';

import { latest } from '@api/book';
import { createAct, spliceLine, getDefaultTitleStyle } from '@util';

import styles from './index.style';

class OriginScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      title: `${navigation.state.params.book.bookName}`,
      ...getDefaultTitleStyle(navigation)
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
    this.setState = () => {};
  }

  getOrigin = async () => {
    const { source, plantformId } = this.props.navigation.state.params.book;
    let tasks = [];
    for (let i in source) tasks.push(latest(source[i]));
    const res = await Promise.all(tasks);
    let j = 0;
    for (let i in source) {
      this.dataList.push({
        site: i,
        latestChapter: res[j++],
        isSelect: i === `${plantformId}`
      });
    }
    this.setState({ loading: false });
  };

  originClick = (site, latestChapter) => {
    const {
      reLoad,
      book: { plantformId, bookName }
    } = this.props.navigation.state.params;

    this.props.dispatch(
      createAct('list/changeOrigin')({
        id: 0, // 因为那时候已经因为排序而来到了第一名。
        bookName,
        change: site,
        latestChapter
      })
    );
    reLoad(site !== plantformId);
    this.props.navigation.goBack();
  };

  renderRow = item => {
    const { SMode, webSite } = this.props;
    let { site, isSelect, latestChapter } = item.item;
    const styleMode = SMode ? styles.sunnyMode : styles.nightMode;
    return (
      <TouchableHighlight
        style={styleMode.rowStyle}
        underlayColor={'transparent'}
        activeOpacity={0.7}
        onPress={() => this.originClick(site, latestChapter)}
      >
        <View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styleMode.titleStyle}>{webSite[site]}</Text>
            {isSelect && (
              <Badge
                value={`当前选择`}
                containerStyle={styleMode.badgeStyle}
                textStyle={{ fontSize: 11 }}
              />
            )}
          </View>
          <Text style={styleMode.subTitleStyle}>
            {`${spliceLine(latestChapter, 23)}`}
          </Text>
        </View>
      </TouchableHighlight>
    );
  };

  render() {
    const { SMode } = this.props;
    const styleMode = SMode ? styles.sunnyMode : styles.nightMode;
    let content;
    if (this.state.loading) {
      content = (
        <Text
          style={[
            { marginTop: 15, textAlign: 'center' },
            SMode ? null : { color: '#ddd' }
          ]}
        >
          Please Wait...
        </Text>
      );
    } else {
      content = (
        <FlatList
          style={{ flex: 1 }}
          data={this.dataList}
          renderItem={this.renderRow}
          ItemSeparatorComponent={() => <View style={styleMode.solid} />}
          getItemLayout={(data, index) => ({
            length: 70,
            offset: 71 * index,
            index
          })} //行高38，分割线1，所以offset=39
          keyExtractor={(item, index) => `${index}`}
        />
      );
    }

    return <View style={styleMode.container}>{content}</View>;
  }
}

function select(state) {
  return {
    SMode: state.app.sunnyMode,
    webSite: state.app.siteMap,
  };
}

export default connect(select)(OriginScreen);
