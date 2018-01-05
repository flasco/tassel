import { Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

export default {
  Navig: {
    height: 64,
    backgroundColor: '#000',
    zIndex: 2,
    width: width,
    position: 'absolute',
    top: 0,
    paddingTop: 20,
    flexDirection: 'row'
  },
  Fotter: {
    height: 50,
    alignItems: 'center',
    backgroundColor: '#000',
    zIndex: 2,
    width: width,
    position: 'absolute',
    bottom: 0,
    left: 0,
    flexDirection: 'row'
  },
  Topper: {
    color: '#FFF', textAlign: 'center', marginTop: 12, fontSize: 16,
  },
  fontCenter: {
    textAlign: 'center',
  },
  FotterItems: {
    color: "#aaa", textAlign: 'center', fontSize: 12,
  },
}