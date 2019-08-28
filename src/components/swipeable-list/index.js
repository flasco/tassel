import React from 'react';
import SwipeableRow from './SwipeableRow';
import { FlatList } from 'react-native';

class SwipeableFlatList extends React.Component {
  _flatListRef = null;
  _shouldBounceFirstRowOnMount = false;

  static defaultProps = {
    ...FlatList.defaultProps,
    bounceFirstRowOnMount: true,
    renderQuickActions: () => null,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      openRowKey: null,
    };

    this._shouldBounceFirstRowOnMount = this.props.bounceFirstRowOnMount;
  }

  render() {
    return (
      <FlatList
        {...this.props}
        ref={ref => {
          this._flatListRef = ref;
        }}
        onScroll={this._onScroll}
        renderItem={this._renderItem}
        extraData={this.state}
      />
    );
  }

  _onScroll = (e) => {
    // Close any opens rows on ListView scroll
    if (this.state.openRowKey) {
      this.setState({
        openRowKey: null,
      });
    }

    this.props.onScroll && this.props.onScroll(e);
  };

  _renderItem = (info) => {
    const slideoutView = this.props.renderQuickActions(info);
    const key = this.props.keyExtractor(info.item, info.index);

    // If renderQuickActions is unspecified or returns falsey, don't allow swipe
    if (!slideoutView) {
      return this.props.renderItem(info);
    }

    let shouldBounceOnMount = false;
    if (this._shouldBounceFirstRowOnMount) {
      this._shouldBounceFirstRowOnMount = false;
      shouldBounceOnMount = true;
    }

    return (
      <SwipeableRow
        slideoutView={slideoutView}
        isOpen={key === this.state.openRowKey}
        maxSwipeDistance={this._getMaxSwipeDistance(info)}
        onOpen={() => this._onOpen(key)}
        onClose={() => this._onClose(key)}
        shouldBounceOnMount={shouldBounceOnMount}
        onSwipeEnd={this._setListViewScrollable}
        onSwipeStart={this._setListViewNotScrollable}>
        {this.props.renderItem(info)}
      </SwipeableRow>
    );
  };

  // This enables rows having variable width slideoutView.
  _getMaxSwipeDistance(info) {
    if (typeof this.props.maxSwipeDistance === 'function') {
      return this.props.maxSwipeDistance(info);
    }

    return this.props.maxSwipeDistance;
  }

  _setListViewScrollableTo(value) {
    if (this._flatListRef) {
      this._flatListRef.setNativeProps({
        scrollEnabled: value,
      });
    }
  }

  _setListViewScrollable = () => {
    this._setListViewScrollableTo(true);
  };

  _setListViewNotScrollable = () => {
    this._setListViewScrollableTo(false);
  };

  _onOpen(key) {
    this.setState({
      openRowKey: key,
    });
  }

  _onClose(key) {
    this.setState({
      openRowKey: null,
    });
  }
}

export default SwipeableFlatList;
