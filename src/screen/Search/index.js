import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, AlertIOS, InteractionManager } from 'react-native';
import React, { Component } from 'react';


import { SearchBar, Button } from 'react-native-elements';
import styles from './index.style';

import { search } from '../../services/book';

class SearchScreen extends React.PureComponent {
  constructor(props) {
    super(props);

    this.renderRow = this.renderRow.bind(this);
    this.SearchBook = this.SearchBook.bind(this);
    this.pressFunc = this.pressFunc.bind(this);

    this.state = {
      text: '',
      dataSource: '',
      hint: '输入后点击 done 即可搜索书籍。',
    };
  }

  componentDidMount() {
    let bookNam = this.props.navigation.state.params.bookNam || '';
    if (bookNam !== '') {
      this.setState({
        text: bookNam,
      }, () => {
        this.SearchBook(bookNam);
      });
    }
  }

  componentWillUnmount() {
    //重写组件的setState方法，直接返回空
    this.setState = (state, callback) => {
      return;
    };
  }

  async SearchBook(text) {
    let { data } = await search(text);
    // console.log(data);
    if (data === 'error...') {
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
  }

  pressFunc(rowData) {
    const { navigate } = this.props.navigation;
    navigate('BookDet', {
      book: rowData,
      addBook: this.props.navigation.state.params.addBook
    });
  }

  renderRow(item) {
    let rowData = item.item;
    const { navigate } = this.props.navigation;
    return (
      <TouchableOpacity
        onPress={() => { this.pressFunc(rowData); }}>
        <View style={{
          height: 52
        }}>
          <Text style={styles.rowStyle}>
            {`${rowData.bookName} - ${rowData.author}`}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ height: 16, backgroundColor: '#000' }} />
        <View style={[{ flexDirection: 'row', backgroundColor: '#000' }]}>
          <SearchBar
            onChangeText={(text) => this.setState({ text })}
            containerStyle={{ backgroundColor: '#000', flex: 7 }}
            inputStyle={{ backgroundColor: '#ddd' }}
            returnKeyType={'search'}
            autoCorrect={false}
            icon={{ color: '#86939e', name: 'search' }}
            onSubmitEditing={() => {
              if (this.state.text !== '') {
                this.SearchBook(this.state.text);
              }
            }}
            placeholder='输入关键字' />
          <Button style={{ flex: 1, width: 20, justifyContent: 'center', marginLeft: 12, alignItems: 'center' }}
            title='取消'
            containerViewStyle={{ backgroundColor: '#000' }}
            buttonStyle={{ backgroundColor: 'transparent' }}
            onPress={() => {
              this.props.navigation.goBack();
            }}
          />

        </View>
        <Text style={styles.hint}>{this.state.hint}</Text>
        <FlatList
          style={{
            flex: 1
          }}
          data={this.state.dataSource}
          renderItem={this.renderRow}
          ItemSeparatorComponent={()=><View style={styles.solid} />}
          getItemLayout={(data, index) => ({ length: 52, offset: 53 * index, index })}//行高38，分割线1，所以offset=39
          keyExtractor={(item, index) => index} />
      </View>
    );
  }
}


export default SearchScreen;