import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ColorPicker from './ColorPicker'
import {CONFIG} from './Constants';

class AddColor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      colors : {
        red: 255,
        green: 255,
        blue: 255,
        white: 255
      }
    }

    this.updateColor = this.updateColor.bind(this);
    this.updateName = this.updateName.bind(this);
  }

  addColor(event) {
    event.preventDefault();
    axios.request({
      method: 'post',
      url: `http://${CONFIG.ip}:${CONFIG.port}/api/color`,
      data: {
        name: this.state.name,
        red: this.state.colors.red,
        green: this.state.colors.green,
        blue: this.state.colors.blue,
        white: this.state.colors.white
      }
    }).then(response => {
      console.log(this.props.history);
      this.props.history.push('/colors');
    })
  }

  updateColor(rgbw) {
    this.setState({colors: rgbw});
  }

  updateName(e) {
    this.setState({name: e.target.value});
  }

  render() {
    return (
      <div>
        <div className="text-left"> <Link to='/colors' className="btn btn-secondary">Back </Link> </div>        
        <form onSubmit={this.addColor.bind(this)} className="container pt-2">
          <h1> Add Color </h1>
          <div className="input-group mb-3">
            <input type="text" className="form-control" placeholder="Name" value={this.state.name} onChange={this.updateName}/>
          </div>
          <ColorPicker updateColor={this.updateColor}/>
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
          <input type="submit" value="Save Color" className="btn btn-primary pt-2" />
        </form>
      </div>
    )
  }
}

export default AddColor;
