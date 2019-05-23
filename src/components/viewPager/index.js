/**
 * 定制自 race604/react-native-viewpager
 * https://github.com/race604/react-native-viewpager
 */

import React, { PureComponent } from 'react';
import { Dimensions, View, PanResponder, Animated, Easing } from 'react-native';

import DeviceBrightness from 'react-native-device-brightness';
import StaticRenderer from 'react-native/Libraries/Components/StaticRenderer';
import ViewPagerDataSource from './ViewPagerDataSource';

//私人定制
const deviceWidth = Dimensions.get('window').width;
const LeftBoundary = deviceWidth / 4;
const RightBoundary = deviceWidth - LeftBoundary;

class ViewPager extends PureComponent {
  static defaultProps = {
    Gpag: 0,
    initialPage: 0,
    dataSource: {},
    clickBoard: () => {},
    getNextPage: () => {},
    getCurrentPage: () => {},
    getPrevPage: () => {},
    renderPage: () => {}
  };
  static DataSource = ViewPagerDataSource;
  constructor(props) {
    super(props);
    DeviceBrightness.getBrightnessLevel().then(x => {
      this.brightVal = +x; //转型
    });

    const release = (e, gestureState) => {
      if (!this.shouldJmp) {
        this.shouldJmp = true;
        return;
      }
      let relativeGestureDistance = gestureState.dx / deviceWidth,
        vx = gestureState.vx;
      let step = 0;
      if (
        relativeGestureDistance < -0.5 ||
        (relativeGestureDistance < 0 && vx <= -1e-6)
      ) {
        step = 1;
      } else if (
        relativeGestureDistance > 0.5 ||
        (relativeGestureDistance > 0 && vx >= 1e-6)
      ) {
        step = -1;
      }
      /**
       *   x0 是x轴的起始位置
       *   moveX 是x轴的结束滑动位置，如果没滑就是0
       */
      const clickX = gestureState.x0;
      const moveX = gestureState.dx;
      const flag =
        gestureState.moveX === 0
          ? 0
          : gestureState.moveX > gestureState.x0
          ? -1
          : 1;
      if (clickX > LeftBoundary && clickX < RightBoundary && moveX == 0) {
        this.props.clickBoard();
        this.shield++;
        return;
      }

      if ((clickX > RightBoundary && moveX == 0) || flag === 1) {
        this.toprev = 0;
        this.movePage(1, gestureState, moveX !== 0); //moveX !== 0 这里是判断是否启用动画效果
        return;
      } else if ((clickX < LeftBoundary && moveX == 0) || flag === -1) {
        this.toprev = 1;
        this.movePage(-1, gestureState, moveX !== 0);
        return;
      }
      this.movePage(step, gestureState);
    };

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponderCapture: (e, gestureState) => true,
      // Claim responder if it's a horizontal pan
      onMoveShouldSetPanResponder: (e, gestureState) => {
        if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
          if (!this.fling) {
            return true;
          }
        }
      },
      // Touch is released, scroll to the one that you're closest to
      onPanResponderRelease: release,

      onPanResponderTerminate: release,

      // Dragging, move the view with the touch
      onPanResponderMove: (e, gestureState) => {
        const finger = gestureState.numberActiveTouches;
        const moveY = gestureState.dy;

        if (finger === 1) {
          let dx = gestureState.dx;
          let offsetX = -dx / this.state.viewWidth + this.childIndex;
          this.state.scrollValue.setValue(offsetX);
        } else if (finger === 2) {
          if (this.brightVal !== 0.0 && moveY > 0.0) {
            //下滑
            this.brightVal -= 0.01;
            if (this.brightVal < 0.0) {
              this.brightVal = 0.0;
            }
            requestAnimationFrame(() => {
              DeviceBrightness.setBrightnessLevel(this.brightVal);
            });
          } else if (this.brightVal !== 1.0 && moveY < 0.0) {
            //上滑
            this.brightVal += 0.01;
            if (this.brightVal > 1.0) {
              this.brightVal = 1.0;
            }
            requestAnimationFrame(() => {
              DeviceBrightness.setBrightnessLevel(this.brightVal);
            });
          }
          this.shouldJmp && (this.shouldJmp = false);
        }
      }
    });
  }

  shield = 0; // 修复呼出菜单之后下一次滑页出现bug
  fling = false;
  shouldJmp = true;
  toprev = 0;

  childIndex = 0;
  maxPage = this.props.dataSource.getPageCount(); // 最大页数，总页数

  state = {
    currentPage: 0,
    viewWidth: 0,
    scrollValue: new Animated.Value(0)
  };

  animation = (animate, toValue, gs) => {
    return Animated.timing(animate, {
      toValue: toValue,
      duration: 100,
      easing: Easing.linear,
      useNativeDriver: true //使用原生驱动，更加流畅
    });
  };

  componentDidMount() {
    if (!this.isInit) {
      this.isInit = true;
      const { initialPage } = this.props;
      initialPage && this.goToPage(initialPage, false);
    }
    if (this.props.Gpag == 1) {
      this.goToPage(0, false);
    } else if (this.props.Gpag == -1) {
      this.goToPage(this.maxPage - 1, false);
    }
  }

  goToPage(pageNumber, animate = true) {
    if (pageNumber >= 0 && pageNumber <= this.maxPage) {
      this.movePage(pageNumber - this.state.currentPage, null, animate);
    }
  }

  movePage(step, gs, animate = true) {
    let pageCount = this.maxPage;
    let pageNumber = this.state.currentPage + step;

    if (pageNumber >= pageCount && this.toprev == 0) {
      let tmpag = pageNumber;
      pageNumber = 0;
      if (this.props.getNextPage() === -1) {
        pageNumber = tmpag - 1;
      }
      this.props.getCurrentPage(pageNumber + 1);
      return;
    } else if (pageNumber < 0 && this.toprev == 1) {
      this.props.getPrevPage();
      return;
    }

    step !== 0 && this.props.getCurrentPage(pageNumber + 1);
    pageNumber = Math.min(Math.max(0, pageNumber), pageCount - 1);
    const moved = pageNumber !== this.state.currentPage;
    const scrollStep = (moved ? step : 0) + this.childIndex;
    const nextChildIdx = pageNumber > 0 ? 1 : 0;
    const postChange = () => {
      this.fling = false;
      this.childIndex = nextChildIdx;
      this.state.scrollValue.setValue(nextChildIdx);
      this.setState({ currentPage: pageNumber });
    };

    if (animate) {
      this.fling = true;
      this.animation(this.state.scrollValue, scrollStep, gs).start(event => {
        if (event.finished) postChange();
      });
    } else {
      postChange();
    }
  }

  _getPage(pageIdx) {
    let dataSource = this.props.dataSource;
    let pageID = dataSource.pageIdentities[pageIdx];
    return (
      <StaticRenderer
        key={`p_${pageID}`}
        shouldUpdate={true}
        render={this.props.renderPage.bind(
          null,
          dataSource.getPageData(pageIdx),
          pageID,
          this.state.currentPage
        )}
      />
    );
  }

  render() {
    const dataSource = this.props.dataSource;
    let pageIDs = dataSource.pageIdentities;

    let bodyComponents = [];

    let pagesNum = 1; // default center page is in.
    let viewWidth = this.state.viewWidth;

    if (pageIDs.length > 0 && viewWidth > 0) {
      // left page
      if (this.state.currentPage > 0) {
        bodyComponents.push(this._getPage(this.state.currentPage - 1));
        pagesNum++;
      }

      // center page
      bodyComponents.push(this._getPage(this.state.currentPage));

      // right page
      if (this.state.currentPage < pageIDs.length - 1) {
        bodyComponents.push(this._getPage(this.state.currentPage + 1));
        pagesNum++;
      }
    }

    let sceneContainerStyle = {
      width: viewWidth * pagesNum,
      flex: 1,
      flexDirection: 'row'
    };

    let translateX = this.state.scrollValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -viewWidth]
    });

    return (
      <View
        style={{ flex: 1 }}
        onLayout={event => {
          let viewWidth = event.nativeEvent.layout.width;
          if (!viewWidth || this.state.viewWidth === viewWidth) {
            return;
          }
          this.setState({
            viewWidth,
            currentPage: this.state.currentPage
          });
        }}
      >
        <Animated.View
          style={[sceneContainerStyle, { transform: [{ translateX }] }]}
          {...this._panResponder.panHandlers}
        >
          {bodyComponents}
        </Animated.View>
      </View>
    );
  }
}

export default ViewPager;
