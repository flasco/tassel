import { Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

export default {
  originText: {
    padding: 12,
    color: '#ddd',
    fontSize: 17,
    bottom: 1,
    right: 12,
    position: 'absolute',
  },
  Fotter: {
    alignItems: 'center',
    backgroundColor: '#000',
    zIndex: 2,
    width: width,
    position: 'absolute',
    bottom: 0,
    left: 0,
    flexDirection: 'row'
  },
  fontCenter: {
    textAlign: 'center',
  },
  FotterItems: {
    color: "#aaa", textAlign: 'center', fontSize: 12,
  },
}