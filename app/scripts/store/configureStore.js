import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {devTools, persistState} from 'redux-devtools';
import * as reducers from '../reducers/index';

let createStoreWithMiddleware;

// Configure the dev tools when in DEV mode
if (__DEV__) {
  createStoreWithMiddleware = compose(
    applyMiddleware(thunkMiddleware),
    devTools(),
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
  )(createStore);
} else {
  createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore);
}

const rootReducer = combineReducers(reducers);

export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(rootReducer, initialState);

  // TODO: fix this https://github.com/reactjs/react-redux/releases/tag/v2.0.0
  if (module.hot) {
    module.hot.accept('../reducers/index', () => {
      const nextReducer = combineReducers(require('../reducers/index'));
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
