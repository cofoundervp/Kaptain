import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as HomeActions from '../../actions/HomeActions';

let kaptainImg = require('../../../assets/images/kaptain.png');

@connect((state) => state.Sample)
export default class Home extends Component {
  render() {
    require('./Home.scss');
    const {title, dispatch} = this.props;
    const actions = bindActionCreators(HomeActions, dispatch);
    return (
      <div>
        <h1 className="">Hello hello {title}!</h1>
        <img src={kaptainImg} alt="Kaptain" />
        <button onClick={(e) => actions.changeTitle(prompt())}>
          Update Title
        </button>
      </div>
    );
  }
}
