import * as ActionTypes from '../constants/ActionTypes';

let defaultState = {
  title: 'Home'
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case ActionTypes.TITLE_CHANGED:
      return {...state, title: action.text};
    default:
      return state;
  }
}
