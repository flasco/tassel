import { judgeIphoneX } from '../../util';

export default {
  centr: {
    marginTop: 75,
    textAlign: 'center',
    fontSize: 18,
  },
  cancel: {
    height: 36,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 7,
  },
  SunnyMode_container: {
    backgroundColor: '#acc7a7',
  },
  SunnyMode_Title: {
    color: '#576457',
  },
  SunnyMode_text: {
    color: '#0d2a0f',
  },
  MoonMode_container: {
    backgroundColor: '#0c0c0c',
  },
  MoonMode_Title: {
    color: '#474747',
  },
  MoonMode_text: {
    color: '#5b5b5b',
  },
  MoonMode_Bottom: {
    color: '#424242',
  },
  container: {
    flex: 1,
  },
  title: {
    marginTop: judgeIphoneX ? 48 : 8,
    paddingLeft: 20,
    lineHeight: 14,
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
    marginBottom: 21,
  },
  textsize: {
    textAlign: 'justify',
    flex: 1,
    marginTop: 12,
    marginLeft: 20,
    fontSize: 23,
    fontStyle: 'normal',
    lineHeight: 40
  },
}