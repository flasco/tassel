import React from 'react';
import { View, StyleSheet } from 'react-native';

class SwipeableQuickActions extends React.Component {
  render() {
    const children = this.props.children;
    let buttons = [];

    // Multiple children
    if (children instanceof Array) {
      for (let i = 0; i < children.length; i++) {
        buttons.push(children[i]);

        if (i < children.length - 1) {
          // Not last button
          buttons.push(<View key={i} style={styles.divider} />);
        }
      }
    } else {
      // 1 child
      buttons = children;
    }

    return <View style={[styles.background, this.props.style]}>{buttons}</View>;
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  divider: {
    width: 4,
  },
});

export default SwipeableQuickActions;
