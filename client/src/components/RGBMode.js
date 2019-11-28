import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {CONFIG} from './Constants';
import ColorGrid from './ColorGrid';

class RGBMode extends Component {
  constructor(props) {
    super(props);
    this.state  = {
      mode: CONFIG.mode.rgb,
      colors: null
    }
    this.onColorClick = this.onColorClick.bind(this)
    this.getAllColors = this.getAllColors.bind(this)
  }

  componentWillMount() {
    this.getAllColors();
  }

  onColorClick(color) {
    console.log(color);
    axios.request({
      method: 'post',
      url: `http://${CONFIG.ip}:${CONFIG.port}/controller/mode/rgb`,
      data: { mode: this.state.mode, color: color}
    }).then(response => {
      this.props.history.push('/modes');
    })
  }

  getAllColors() {
    axios.get(`http://${CONFIG.ip}:${CONFIG.port}/api/colors`)
      .then(response => {
        console.log(response.data);
        this.setState({colors : response.data}, () => { console.log(this.state)});
      })
      .catch((error) => {
        console.log(error);
      })
  }

  render() {
    return (
      <div>
        <div className="text-left"> <Link to='/colors' className="btn btn-secondary">Back </Link> </div>
          <div className="container pt-2">
            <h1>Select a color</h1>
            {
              this.state.colors &&
              <ColorGrid colors={this.state.colors} onColorClick={this.onColorClick}/>
            }
          </div>
      </div>
    )
  }
}

export default RGBMode;