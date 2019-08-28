import { TextProps } from 'react-native';

interface IStyleProps {
  [key: string]: TextProps;
}

export default {
  background: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  divider: {
    width: 4,
  },
} as IStyleProps;
