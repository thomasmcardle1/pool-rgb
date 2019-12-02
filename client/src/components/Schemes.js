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
      delete: false,
      deletescheme_colors: [],
      deletescheme_name: '',
      deletescheme_id: null,
    }

    this.showDeleteScheme = this.showDeleteScheme.bind(this);
    this.deleteScheme = this.deleteScheme.bind(this);
    this.cancelDelete = this.cancelDelete.bind(this);
  }

  componentWillMount() {
    this.getColorSchemes();
  }

  getDeleteScheme(id) {
    axios.get(`http://${CONFIG.ip}:${CONFIG.port}/api/colorsinscheme/${id}`)
    .then(response => {
      var colors = response.data;
      colors = colors.sort((a,b)=> {
        return a.pivot.order - b.pivot.order;
      });
      
      this.setState({deletescheme_colors: colors});
    })
  }

  showDeleteScheme(id, name) {
    console.log('delete colors');
    this.setState({deletescheme_id: id, deletescheme_name: name, delete: true}, () => {
      this.getDeleteScheme(id);
    })
  }

  deleteScheme() {
    if (this.state.deletescheme_id) {
      axios.request({
        method: 'delete',
        url: `http://${CONFIG.ip}:${CONFIG.port}/api/colorscheme/${this.state.deletescheme_id}`
      }).then(response => {
        this.setState({delete: false}, () => {
          this.getColorSchemes();
        });
      })
    }
  }

  cancelDelete() {
    this.setState({deletescheme_id: null, deletescheme_name: '', deletescheme_colors: [], delete: false});
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
          <div className="btn btn-danger btn-md float-left"onClick={() => this.showDeleteScheme(schemes.id, schemes.name) }>Delete</div>
          {schemes.name}
          <Link to={`/schemes/edit/${schemes.name}/${schemes.id}`} className="btn btn-success btn-md float-right"> <i className="fa fa-edit"/></Link>
        </li>
        // <SchemesItem item={schemes} key={key} />
      )
    })

    const deleteSchemeColors = this.state.deletescheme_colors.map((color, key) => {
      return (
        <li className="list-group-item text-capitalize" key={key}>
          {color.name}
        </li>
      )
    })
    return (
      <div>
      {
        this.state.delete ? 
        <div>
          <h1> Are you sure you want to delete the following scheme? </h1>
          <h2> {this.state.deletescheme_name} </h2>
          {deleteSchemeColors}
          <input type="button" value="Delete Color Scheme" className="btn btn-danger mt-2" onClick={this.deleteScheme}/>
          <input type="button" value="Cancel" className="btn btn-primary mt-2 ml-2" onClick={this.cancelDelete}/>
        </div> :
        <div>
          <h1> Schemes </h1>
          <ul className="list-group"> { schemeItems } </ul>
          <div className="pt-3"> 
            <Link to="schemes/add" className="btn btn-primary btn-md"> <i className="fa fa-plus"></i> Add New Scheme </Link>
          </div>
        </div>
      }
      </div>
    )
  }
}
export default Schemes;