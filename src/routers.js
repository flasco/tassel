import React, { PureComponent } from 'react'
import {
  StackNavigator, addNavigationHelpers,
  NavigationActions,
} from 'react-navigation';
import {
  createReduxBoundAddListener,
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';

import { connect } from 'react-redux';

import BookListScreen from './screen/BookList';
import CatalogScreen from './screen/Catalog';
import ReadScreen from './screen/Read';
import SearchScreen from './screen/Search';
import RankScreen from './screen/Rank'
import BookDetScreen from './screen/BookDet';
import OriginScreen from './screen/Origin';
import FattenListScreen from './screen/FattenList';

SearchScreen.navigationOptions = ({ navigation }) => {
  return { header: null };
};

ReadScreen.navigationOptions = ({ navigation }) => {
  return { header: null };
};

const Tassel = StackNavigator({
  Home: { screen: BookListScreen },
  ChaL: { screen: CatalogScreen },
  Read: { screen: ReadScreen },
  Sear: { screen: SearchScreen },
  RnkL: { screen: RankScreen },
  BookDet: { screen: BookDetScreen },
  Origin: { screen: OriginScreen },
  FattenBlock: { screen: FattenListScreen },
}, {
    mode: 'modal',
    navigationOptions: {
      gesturesEnabled: false
    }
  });

export const routerMiddleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.router
)
const addListener = createReduxBoundAddListener('root')

class Router extends PureComponent {
  render() {
    const { dispatch, router } = this.props
    const navigation = addNavigationHelpers({
      dispatch,
      state: router,
      addListener,
    })
    return <Tassel navigation={navigation} />
  }
}

export function routerReducer(state, action = {}) {
  return Tassel.router.getStateForAction(action, state)
}

function select(state) {
  return {
    router: state.router
  }
}

export default connect(select)(Router);