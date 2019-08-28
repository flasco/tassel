import { judgeIphoneX } from '../../util';

export default {
  centr: {
    marginTop: 75,
    textAlign: 'center',
    fontSize: 18
  },
  cancel: {
    height: 36,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 7
  },
  sunnyMode: {
    container: {
      backgroundColor: '#acc7a7'
    },
    title: {
      color: '#576457'
    },
    text: {
      color: '#0d2a0f'
    },
  },
  moonMode: {
    container: {
      backgroundColor: '#0c0c0c'
    },
    title: {
      color: '#474747'
    },
    text: {
      color: '#5b5b5b'
    },
    bottom: {
      color: '#424242'
    }
  },
  container: {
    flex: 1
  },
  title: {
    marginTop: judgeIphoneX ? 48 : 8,
    paddingLeft: 20,
    lineHeight: 14
  },
  bottom1: {
    flex: 1,
    textAlign: 'left',
    marginLeft: 25,
    lineHeight: 14
  },
  bottom2: {
    flex: 1,
    textAlign: 'right',
    marginRight: 25,
    lineHeight: 14
  },
  bottView: {
    flexDirection: 'row',
    marginBottom: 21
  },
  textsize: {
    textAlign: 'justify',
    flex: 1,
    marginTop: 12,
    marginLeft: 20,
    fontSize: 23,
    fontStyle: 'normal',
    lineHeight: 40
  }
};
