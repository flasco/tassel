import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Easing,
  Dimensions,
  Text,
  Animated
} from 'react-native';
import PropTypes from 'prop-types';

export const LONG = 2000;
export const SHORT = 1000;

const { width, height } = Dimensions.get('window');

class ToastView extends Component {
  static propTypes = {
    time: PropTypes.number
  };

  moveAnim = new Animated.Value(height / 12);
  opacityAnim = new Animated.Value(0);
  dismissHandler = null;

  constructor(props) {
    super(props);
    this.state = {
      message: props.message !== undefined ? props.message : '',
      time: props.time && props.time < 1500 ? SHORT : LONG
    };
  }

  render() {
    return (
      <View style={styles.container} pointerEvents="none">
        <Animated.View
          style={[
            styles.textContainer,
            { bottom: this.moveAnim, opacity: this.opacityAnim }
          ]}
        >
          <Text style={styles.defaultText}>{this.state.message}</Text>
        </Animated.View>
      </View>
    );
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      message: nextProps.message !== undefined ? nextProps.message : '',
      time: nextProps.time && nextProps.time < 1500 ? SHORT : LONG
    });
    clearTimeout(this.dismissHandler)
    this.timingDismiss()
  }

  componentDidMount() {
    Animated.timing(this.moveAnim, {
      toValue: height / 8,
      duration: 80,
      easing: Easing.ease
    }).start(this.timingDismiss);
    Animated.timing(this.opacityAnim, {
      toValue: 1,
      duration: 100,
      easing: Easing.linear
    }).start();
  }

  componentWillUnmount() {
    clearTimeout(this.dismissHandler);
  }

  timingDismiss = () => {
    this.dismissHandler = setTimeout(() => {
      this.dismiss()
    }, this.state.time)
  };

  dismiss = () => {
    Animated.timing(this.opacityAnim, {
      toValue: 0,
      duration: 100,
      easing: Easing.linear
    }).start(this.onDismiss);
  };

  onDismiss = () => {
    if (this.props.onDismiss) {
      this.props.onDismiss();
    }
  };
}

const styles = StyleSheet.create({
  textContainer: {
    backgroundColor: 'rgba(0,0,0,.6)',
    borderRadius: 8,
    padding: 10,
    maxWidth: width / 3 * 2,
    alignSelf: 'flex-end'
  },
  defaultText: {
    color: '#FFF',
    fontSize: 15,
  },
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center'
  }
});
export default ToastView;
