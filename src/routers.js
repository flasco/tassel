import { StackNavigator } from 'react-navigation';

import BookListScreen from './screen/BookListScreen';
import CatalogScreen from './screen/CatalogScreen';
import ReadScreen from './screen/ReadScreen';
import SearchScreen from './screen/SearchScreen';
import RankScreen from './screen/RankScreen'
import BookDetScreen from './screen/BookDetScreen';
import FattenListScreen from './screen/FattenListScreen';

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
  FattenBlock: { screen: FattenListScreen },
}, {
    mode: 'modal',
    navigationOptions: {
      gesturesEnabled: false
    }
  });

export default Tassel;