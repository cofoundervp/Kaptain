import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as HomeActions from '../actions/HomeActions';

require('../../assets/styles/app.scss');
require('./Home.scss');

let kaptainImg = require('../../assets/images/kaptain.png');

class Home extends Component {
  render() {
    const {title, dispatch} = this.props;
    const actions = bindActionCreators(HomeActions, dispatch);
    return (
      <main>
        <h1 className="text home">Welcome {title}!</h1>
        <h2>Hello world Nat!</h2>
        <img src={kaptainImg} alt="Kaptain" />
        <button onClick={e => actions.changeTitle(prompt())}>
          Update Title
        </button>
      </main>
    );
  }
}

export default connect(state => state.Sample)(Home)
