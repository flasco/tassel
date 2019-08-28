import React from 'react';
import { View } from 'react-native';

import styles from './styles';

interface IActionProps {
  style?: object;
}

const QuickActions: React.FC<IActionProps> = ({ children, style }) => {
  let buttons: any = [];

  if (children instanceof Array) {
    for (let i = 0; i < children.length; i++) {
      buttons.push(children[i]);

      if (i < children.length - 1) {
        buttons.push(<View key={i} style={styles.divider} />);
      }
    }
  } else {
    buttons = children;
  }
  return <View style={[styles.background, style]}>{buttons}</View>;
};

export default QuickActions;
