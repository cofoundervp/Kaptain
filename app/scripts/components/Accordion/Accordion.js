import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

@connect(state => state.Sample)
export default class Accordion extends Component {
  render() {
    require('./Accordion.scss');
    return (
      <ul class="accordion">
        <li>
          <a href="javascript:void(0)" class="js-accordion-trigger">Accordion Item</a>
          <ul class="submenu">
            <li>
              <a href="javascript:void(0)">Sub Item 1</a>
            </li>
            <li>
              <a href="javascript:void(0)">Sub Item 2</a>
            </li>
          </ul>
        </li>
        <li>
          <a href="javascript:void(0)" class="js-accordion-trigger">Another Item</a>
          <ul class="submenu">
            <li>
              <a href="javascript:void(0)">Sub Item 1</a>
            </li>
            <li>
              <a href="javascript:void(0)">Sub Item 2</a>
            </li>
          </ul>
        </li>
      </ul>
    );
  }
}
