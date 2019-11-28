import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ColorPicker from './ColorPicker'
import {CONFIG} from './Constants';
import { copyFileSync } from 'fs';

class AddColor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colors : null,
      name: '',
      expanded: true,
      deleting: false,
    }
    
    this.cancel = this.cancel.bind(this);
    this.getColorbyId = this.getColorbyId.bind(this);
    this.saveColor = this.saveColor.bind(this);
    this.updateName = this.updateName.bind(this);
    this.updateColor = this.updateColor.bind(this);
    this.deleteColor = this.deleteColor.bind(this);
    this.deleteColorPerm = this.deleteColorPerm.bind(this);
  }

  componentWillMount() {
    this.getColorbyId();
  }

  cancel() {
    this.setState({colors: null, deleting: false}, () => {
      this.getColorbyId();
    })
  }

  getColorbyId() {
    axios.get(`http://${CONFIG.ip}:${CONFIG.port}/api/color/${this.props.match.params.id}`)
    .then(response => {
      var colors = response.data;
      var name = colors.name;
      delete colors['name'];
      this.setState({colors, name, changed: false}, () => {console.log(this.state)});
    })
  }

  saveColor(e) {
    e.preventDefault();
    axios.request({
      method: 'put',
      url: `http://${CONFIG.ip}:${CONFIG.port}/api/color/${this.props.match.params.id}`,
      data: { colors: this.state.colors, name: this.state.name }
    }).then(response => {
      console.log(response);
      this.props.history.push('/colors');
    })
    console.log(this.state.colors);
  }

  deleteColor() {
    this.setState({deleting: true})
    axios.request({
      method: 'get',
      url: `http://${CONFIG.ip}:${CONFIG.port}/api/schemeswithcolor/${this.props.match.params.id}`
    }).then(response => {
      this.setState({schemes: response.data});
    })
  }

  deleteColorPerm() {
    axios.request({
      method: 'delete',
      url: `http://${CONFIG.ip}:${CONFIG.port}/api/color/${this.props.match.params.id}`
    }).then(response => {
      console.log(response);
      this.props.history.push('/colors');
    })
  }

  updateColor(rgbw) {
    this.setState({colors: rgbw, changed: true});
  }

  updateName(e) {
    this.setState({name: e.target.value, changed: true});
  }

  render() {
    return (
      <div>
        <div className="text-left"> <Link to='/colors' className="btn btn-secondary">Back </Link> </div>
        { this.state.deleting ? 
          <div className="container pt-2">
            <h1>Attempting to Delete</h1>
            { this.state.schemes ?
              <div>
                <h2 className="text-capitalize">{this.state.name} will also be removed from the following schemes</h2>                            
                <div className="list-group">
                  {this.state.schemes.map((scheme, key)=> (
                    <div className="list-group-item" key={key}>
                      {scheme.name}
                    </div>
                  ))}
                </div>
              </div> :
              <div>
                <h2 className="text-capitalize">Are you sure you want to permanately delete: {this.state.name}</h2>                            
              </div>
            }
            <input type="button" value="Cancel" className="btn btn-primary mr-2 mt-2" onClick={this.cancel}/>
            <input type="button" value="Permanately Delete Color" className="btn btn-danger mt-2" onClick={this.deleteColorPerm}/>
          </div>
        : <div className="container pt-2">
            <h1> Edit Color </h1>
            <div className="input-group mb-3 text-center">
              <input className="form-control" placeholder="Name" value={this.state.name} onChange={this.updateName}/>
            </div>
            <div className="mb-3 text-center">
              <input type="button" value={this.state.expanded ? "Minimize Color Picker" : "Expand Color Picker"} className="btn btn-primary pt-2" onClick={()=>{this.setState({expanded: !this.state.expanded})}}/>
            </div>
            {
              this.state.colors && this.state.expanded &&
              <ColorPicker updateColor={this.updateColor} colors={this.state.colors}/>
            }
            {
              this.state.colors &&
              <div
                className="list-group-item text-capitalize tile-list-item mb-4 row"
                style={{
                  backgroundColor: `rgb(${this.state.colors.red},${this.state.colors.green},${this.state.colors.blue})`,
                }}
                >
              </div>
            }
            { this.state.changed &&
              <input type="button" value="Update Color" className="btn btn-primary pt-2 mr-2 mt-2" onClick={this.saveColor}/>
            }
            { this.state.changed &&
              <input type="button" value="Cancel" className="btn btn-danger pt-2 mr-2 mt-2" onClick={this.cancel}/>
            }
              <input type="button" value="Delete Color" className="btn btn-danger mt-2" onClick={this.deleteColor}/>
          </div>
        }
      </div>
    )
  }
}

export default AddColor;
