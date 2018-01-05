import {
  MENU_CTL,
  MENU_SWITCH,
  SUNNYMODE_SWITCH,
  LOADING_SWITCH
} from './actionTypes';

export function menuSwitch() {
  return { type: MENU_SWITCH }
}

export function menuCtl(flag) {
  return { type: MENU_CTL, flag }
}

export function sunnyModeSwitch() {
  return { type: SUNNYMODE_SWITCH }
}

export function LoadingSwitch() {
  return { type: LOADING_SWITCH }
}