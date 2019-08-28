import React from 'react';
import { Text, View, FlatList, TouchableHighlight } from 'react-native';

import { SearchBar } from 'react-native-elements';
import styles from './index.style';
import { judgeIphoneX } from '@util';

import { search } from '@api/book';

class SearchScreen extends React.PureComponent {
  state = {
    text: '',
    dataSource: '',
    hint: '输入后点击 done 即可搜索书籍。'
  };

  componentDidMount() {
    const { bookNam: bookName = '' } = this.props.navigation.state.params;
    if (bookName !== '') {
      this.setState(
        {
          text: bookName
        },
        () => this.searchBook(bookName)
      );
    }
  }

  componentWillUnmount() {
    //重写组件的setState方法，直接返回空
    this.setState = () => {};
  }

  searchBook = async text => {
    let data = await search(text);
    if (data === 'error...' || data === -1) {
      this.setState({
        dataSource: '',
        hint: '无相关搜索结果。'
      });
    } else {
      this.setState({
        dataSource: data,
        hint: `搜索到${data.length}条相关数据。`
      });
    }
  };

  pressFunc = rowData => {
    const { navigate } = this.props.navigation;
    navigate('BookDet', {
      book: rowData,
      addBook: this.props.navigation.state.params.addBook
    });
  };

  renderRow = item => {
    const rowData = item.item;
    return (
      <TouchableHighlight
        underlayColor="transparent"
        activeOpacity={0.7}
        onPress={() => {
          this.pressFunc(rowData);
        }}
      >
        <View style={{ height: 52 }}>
          <Text style={styles.rowStyle}>
            {`${rowData.bookName} - ${rowData.author}`}
          </Text>
        </View>
      </TouchableHighlight>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View
          style={{ height: judgeIphoneX ? 40 : 16, backgroundColor: '#000' }}
        />
        <View style={[{ flexDirection: 'row', backgroundColor: '#000' }]}>
          <SearchBar
            onChangeText={text => this.setState({ text })}
            containerStyle={{ backgroundColor: '#000', flex: 7 }}
            inputStyle={{ backgroundColor: '#ddd' }}
            returnKeyType={'search'}
            autoCorrect={false}
            icon={{ color: '#86939e', name: 'search' }}
            onSubmitEditing={() => {
              if (this.state.text !== '') {
                this.searchBook(this.state.text);
              }
            }}
            placeholder="输入关键字"
          />
          <TouchableHighlight
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            underlayColor="transparent"
            activeOpacity={0.7}
            onPress={() => {
              this.props.navigation.goBack();
            }}
          >
            <Text style={{ color: '#fff', fontSize: 16 }}>取消</Text>
          </TouchableHighlight>
        </View>
        <Text style={styles.hint}>{this.state.hint}</Text>
        <FlatList
          style={{
            flex: 1
          }}
          data={this.state.dataSource}
          renderItem={this.renderRow}
          ItemSeparatorComponent={() => <View style={styles.solid} />}
          getItemLayout={(data, index) => ({
            length: 52,
            offset: 53 * index,
            index
          })} //行高38，分割线1，所以offset=39
          keyExtractor={(item, index) => `${index}`}
        />
      </View>
    );
  }
}

export default SearchScreen;
