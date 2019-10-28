import { Dimensions, StyleSheet } from 'react-native';
const { width } = Dimensions.get('window');

export default StyleSheet.create({
  origin: {
    padding: 12,
    color: '#ddd',
    fontSize: 17,
    bottom: 1,
    right: 12,
    position: 'absolute'
  },
  footer: {
    alignItems: 'center',
    backgroundColor: '#000',
    zIndex: 2,
    width: width,
    position: 'absolute',
    bottom: 0,
    left: 0,
    flexDirection: 'row'
  },
  item: {
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    color: '#aaa',
    fontSize: 12
  }
});
