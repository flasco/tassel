import {
  MENU_CTL,
  MENU_SWITCH,
  SUNNYMODE_SWITCH,
} from '../actions/actionTypes';


export const appState = {
  menuFlag: false,
  sunnyMode: true,
}

export default app = (state = appState, action) => {
  switch (action.type) {
    case MENU_CTL:
      return Object.assign({}, state, { menuFlag: action.flag })
    case MENU_SWITCH:
      let flag1 = !state.menuFlag;
      return Object.assign({}, state, { menuFlag: flag1 })
    case SUNNYMODE_SWITCH:
      let flag2 = !state.sunnyMode;
      return Object.assign({}, state, { sunnyMode: flag2 })
    default:
      return state;
  }
}
