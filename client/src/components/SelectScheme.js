import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {CONFIG} from './Constants';

class SelectScheme extends Component {
  constructor() {
    super();
    this.state = {
      schemes : [],
    }
  }

  componentWillMount() {
    this.getColorSchemes();
  }

  getColorSchemes() {
    axios.get(`http://${CONFIG.ip}:${CONFIG.port}/api/colorschemes`)
      .then(response => {
        console.log(response.data);
        this.setState({schemes : response.data}, () => { console.log(this.state)});
      })
  }

  render() {
    const schemeItems = this.state.schemes.map((schemes, key) => {
      return (
        <li className="list-group-item text-capitalize" key={key} onClick={() => {this.props.onSchemeChange(schemes)}}>
          {schemes.name}
        </li>
      )
    })
    return (
      <div>
        <h1> Schemes </h1>
        <ul className="list-group"> { schemeItems } </ul>
      </div>
    )
  }
}
export default SelectScheme;