import React, { PureComponent } from 'react';
import { Animated, Easing } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import {
  createReduxContainer,
  createReactNavigationReduxMiddleware,
  createNavigationReducer
} from 'react-navigation-redux-helpers';

import { connect } from 'react-redux';

import BookListScreen from './screen/BookList';
import CatalogScreen from './screen/Catalog';
import ReadScreen from './screen/Read';
import SearchScreen from './screen/Search';
import RankScreen from './screen/Rank';
import BookDetScreen from './screen/BookDet';
import OriginScreen from './screen/Origin';
import FattenListScreen from './screen/FattenList';
import SourceRankScreen from './screen/SourceRank';

SearchScreen.navigationOptions = () => ({ header: null });
ReadScreen.navigationOptions = () => ({ header: null });

const Tassel = createStackNavigator(
  {
    Home: { screen: BookListScreen },
    ChaL: { screen: CatalogScreen },
    Read: { screen: ReadScreen },
    Sear: { screen: SearchScreen },
    RnkL: { screen: RankScreen },
    BookDet: { screen: BookDetScreen },
    Origin: { screen: OriginScreen },
    FattenBlock: { screen: FattenListScreen },
    SourceRank: { screen: SourceRankScreen }
  },
  {
    mode: 'modal',
    transitionConfig: () => ({
      transitionSpec: {
        duration: 400,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing
      },
      screenInterpolator: sceneProps => {
        const { layout, position, scene } = sceneProps;
        const { index } = scene;

        const height = layout.initHeight;
        const translateY = position.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [height, 0, 0]
        });

        const opacity = position.interpolate({
          inputRange: [index - 1, index - 0.99, index],
          outputRange: [0, 1, 1]
        });

        return { opacity, transform: [{ translateY }] };
      }
    }),
    navigationOptions: {
      gesturesEnabled: false
    }
  }
);

export const routerReducer = createNavigationReducer(Tassel);

export const routerMiddleware = createReactNavigationReduxMiddleware(
  state => state.router
);

const App = createReduxContainer(Tassel);

class Router extends PureComponent {
  render() {
    const { dispatch, router } = this.props;
    return <App dispatch={dispatch} state={router} />;
  }
}

function select({ router }) {
  return { router };
}

export default connect(select)(Router);
