import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
// import SchemesItem from './SchemesItem';
import {CONFIG} from './Constants';

class Schemes extends Component {
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
        <li className="list-group-item text-capitalize" key={key}>
          {schemes.name}
          <Link to={`/schemes/edit/${schemes.name}/${schemes.id}`} className="btn btn-success btn-md float-right"> <i className="fa fa-edit"/></Link>
        </li>
        // <SchemesItem item={schemes} key={key} />
      )
    })
    return (
      <div>
        <h1> Schemes </h1>
        <ul className="list-group"> { schemeItems } </ul>
        <div className="pt-3"> 
          <Link to="schemes/add" className="btn btn-primary btn-md"> <i className="fa fa-plus"></i> Add New Scheme </Link>
        </div>
      </div>
    )
  }
}
export default Schemes;