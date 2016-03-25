import React, {Component} from 'react';
import {Provider} from 'react-redux';
import configureStore from '../../store/configureStore';
import {Home} from '../../components';
import {renderDevTools} from '../../utils/devTools';

const store = configureStore();

export default class App extends Component {
  render() {
    require('../../../assets/styles/app.scss')
    return (
      <div>

        {/* <Home /> is your app entry point */}
        <Provider store={store}>
          <Home />
        </Provider>

        {/* only renders when running in DEV mode */
          renderDevTools(store)
        }
      </div>
    );
  }
};
