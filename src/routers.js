import { StackNavigator } from 'react-navigation';

import BookListScreen from './screen/BookList';
import CatalogScreen from './screen/Catalog';
import ReadScreen from './screen/Read';
import SearchScreen from './screen/Search';
import RankScreen from './screen/Rank'
import BookDetScreen from './screen/BookDet';
import OriginScreen from './screen/Origin';

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
}, {
    mode: 'modal',
    navigationOptions: {
      gesturesEnabled: false
    }
  });

export default Tassel;