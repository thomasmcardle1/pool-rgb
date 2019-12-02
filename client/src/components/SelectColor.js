import React, { Component } from 'react';
import axios from 'axios';
import {CONFIG} from './Constants';
import ColorGrid from './ColorGrid';
import ColorPicker from './ColorPicker';

class SelectColors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allColors: [],
      colorWheel: false
    }
    this.onColorClick = this.onColorClick.bind(this);
    this.backToModes = this.backToModes.bind(this);
    this.onColorWheelChange = this.onColorWheelChange.bind(this);
  }

  componentWillMount() {
    this.getAllColors();
  }

  onColorClick(color) {
    this.props.history.push(`/colors/modes/${color.id}`)
  }

  getAllColors() {
    axios.get(`http://${CONFIG.ip}:${CONFIG.port}/api/colors`)
      .then(response => {
        console.log(response.data);
        this.setState({allColors : response.data}, () => { console.log(this.state)});
      })
      .catch((error) => {
        console.log(error);
      })
  }

  onColorWheelChange(color) {
    console.log(color);
    axios.request({
      method: 'post',
      url: `http://${CONFIG.ip}:${CONFIG.port}/controller/mode/rgb`,
      data: { color: color}
    }).then(response => {
      this.props.history.push('/');
    })
  }

  backToModes() {
    this.props.backToModes();
  }

  render() {
    return (
      <div>
        <h1 className="py-3"> Pick a Saved Color </h1>
        <div className="btn btn-primary mr-2" onClick={this.backToModes}> Back to Modes </div>
        <div className="btn btn-primary" onClick={()=>{this.setState({colorWheel:!this.state.colorWheel})}}> {this.state.colorWheel ? "Hide Color Wheel" : "Show Color Wheel" }</div>
        {
          this.state.colorWheel ?
          <ColorPicker updateColor={this.onColorWheelChange} /> :
          <ColorGrid colors={this.state.allColors} onColorClick={this.props.setRGBColor} />
      }
      </div>
    )
  }
}

export default SelectColors;