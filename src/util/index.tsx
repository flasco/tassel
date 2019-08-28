import React from 'react';
import { Platform, Dimensions } from 'react-native';

export { NavigationActions, StackActions } from 'react-navigation';
import { HeaderBackButton } from 'react-navigation';

export { default as Storage } from './storage';

export const delay = (time: number) => new Promise(resolve => setTimeout(resolve, time));

export const createAction = (type: string) => (payload: any) => ({ type, payload });

export const createAct = (type: string) => (payload: any) => ({ type, ...payload });

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
  const options: any = {
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

export function insertionSort(arr: any[]) {
  let preIndex: any, current: any;
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

export function spliceLine(str: string, count: number) {
  return str.length > count ? str.substr(0, count) + '...' : str;
}
