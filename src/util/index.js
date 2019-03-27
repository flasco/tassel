import React from 'react';
import { Platform, Dimensions } from 'react-native';

export { NavigationActions, StackActions } from 'react-navigation';
import { HeaderBackButton } from 'react-navigation';

export { default as Storage } from './storage';

export const delay = time => new Promise(resolve => setTimeout(resolve, time));

export const createAction = type => payload => ({ type, payload });

export const createAct = type => payload => ({ type, ...payload });

// iPhoneX Xs
const X_WIDTH = 375;
const X_HEIGHT = 812;

// iPhoneXR XsMax
const XR_WIDTH = 414;
const XR_HEIGHT = 896;

const { height: D_HEIGHT, width: D_WIDTH } = Dimensions.get('window');

//判断是否为iphoneX或Xs
function isIphoneX() {
  return (
    Platform.OS === 'ios' &&
    ((D_HEIGHT === X_HEIGHT && D_WIDTH === X_WIDTH) ||
      (D_HEIGHT === X_WIDTH && D_WIDTH === X_HEIGHT))
  );
}

export function getAndroidStyle() {
  if (Platform.OS === 'android') {
    return {
      paddingTop: 30,
      height: 80
    };
  }
  return {};
}

export function getDefaultTitleStyle(navigation = null) {
  const options = {
    headerStyle: {
      backgroundColor: '#000',
      borderBottomWidth: 0,
      ...getAndroidStyle()
    },
    headerTitleStyle: {
      color: '#ddd',
      alignSelf: 'center'
    }
  };

  if (navigation) {
    options.headerLeft = (
      <HeaderBackButton
        title="返回"
        tintColor={'#ddd'}
        onPress={() => {
          navigation.goBack();
        }}
      />
    );
  }
  return options;
}

//判断是否为iphoneXR或XsMAX
function isIphoneXR() {
  return (
    Platform.OS === 'ios' &&
    ((D_HEIGHT === XR_HEIGHT && D_WIDTH === XR_WIDTH) ||
      (D_HEIGHT === XR_WIDTH && D_WIDTH === XR_HEIGHT))
  );
}

export const judgeIphoneX = isIphoneX() || isIphoneXR();

export function insertionSort(arr) {
  let preIndex, current;
  for (let i = 1, len = arr.length; i < len; i++) {
    preIndex = i - 1;
    current = arr[i];
    while (preIndex >= 0 && arr[preIndex].latestRead < current.latestRead) {
      arr[preIndex + 1] = arr[preIndex];
      preIndex--;
    }
    arr[preIndex + 1] = current;
  }
  return arr;
}

/**
 * Fisher–Yates 洗牌算法, 将数组随机排列
 * @param {*} arr
 */
export function shuffle(arr) {
  let i = arr.length;
  while (i) {
    let j = Math.floor(Math.random() * i--); // 获取一个随机的小于i的数，用floor进行取整
    [arr[j], arr[i]] = [arr[i], arr[j]]; // 两个数进行交换
  }
}

export function spliceLine(str, count) {
  return str.length > count ? str.substr(0, count) + '...' : str;
}
