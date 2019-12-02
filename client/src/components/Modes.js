import React, { Component } from 'react';
import axios from 'axios';
import {CONFIG} from './Constants';
import { Link } from 'react-router-dom';
import SelectColor from './SelectColor';
import SelectScheme from './SelectScheme';

import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
const Handle = Slider.Handle;

class Modes extends Component {
  constructor() {
    super();
    this.state = {
      modes : [],
      current: "",
      selectColor: false,
      selectScheme: false,
      speed: 0,
    }

    this.changeMode = this.changeMode.bind(this)
    this.setColorWhite = this.setColorWhite.bind(this)
    this.showAllModes = this.showAllModes.bind(this)
    this.setColorWheel = this.setColorWheel.bind(this)
    this.setRGBColor = this.setRGBColor.bind(this)
    this.handleSliderChange = this.handleSliderChange.bind(this)
    this.onSliderChange = this.onSliderChange.bind(this)
    this.setScheme = this.setScheme.bind(this)
  }

  componentWillMount() {
    this.getModes();
    this.getCurrentMode();
  }

  getCurrentMode() {
    axios.get(`http://${CONFIG.ip}:${CONFIG.port}/controller/mode`)
    .then(response => {
      this.setState({current : response.data}, () => {
        console.log(this.state)});
    })
  }

  getModes() {
    axios.get(`http://${CONFIG.ip}:${CONFIG.port}/controller/modes`)
      .then(response => {
        console.log(response.data);
        this.setState({modes : response.data}, () => { console.log(this.state)});
      })
  }

  setColorWhite() {
    axios.request({
      method: 'post',
      url: `http://${CONFIG.ip}:${CONFIG.port}/controller/mode/white`,
      data: { mode: this.state.mode}
    }).then(response => {
      this.setState({
        selectScheme: false,
        selectColor: false
      })
    })
  }

  setColorWheel() {
    this.setState({colorWheelSpeed: true}, () => {
      axios.request({
        method: 'post',
        url: `http://${CONFIG.ip}:${CONFIG.port}/controller/mode/wheel`,
        data: { mode: this.state.mode}
      }).then(response => {
        this.setState({
          selectScheme: false,
          selectColor: false
        })
      })
    })
  }

  setRGBColor(color) {
    this.setState({selectColor: false}, () => {
      axios.request({
        method: 'post',
        url: `http://${CONFIG.ip}:${CONFIG.port}/controller/mode/rgb`,
        data: { color: color ? color : this.state.color}
      }).then(response => {
        this.setState({
          selectScheme: false,
          selectColor: false
        })
      })
    })
  }

  setScheme(scheme) {
    axios.request({
        method: 'post',
        url: `http://${CONFIG.ip}:${CONFIG.port}/controller/mode/scheme`,
        data: { scheme: scheme}
      }).then(response => {
        this.setState({
          selectScheme: false,
          selectColor: false
        })
      })
  }

  handleSliderChange(props) {
    const { value, dragging, index, ...restProps } = props;
    return (
      <Tooltip
        prefixCls="rc-slider-tooltip"
        overlay={value}
        visible={dragging}
        placement="top"
        key={index}
      >
        <Handle value={value} {...restProps} />
      </Tooltip>
    );
  };

  onSliderChange(value) {
    this.setState({speed: value}, () => {
      axios.request({
        method: 'post',
        url: `http://${CONFIG.ip}:${CONFIG.port}/controller/mode/wheel/speed`,
        data: { speed: this.state.speed}
      }).then(response => {
        this.setState({
          selectScheme: false,
          selectColor: false
        })
      })
    });
  }

  changeMode(mode) {
    this.setState({colorWheelSpeed: false});
    switch(mode) {
      case 'WHITE':
        this.setState({current: 'WHITE'});
        this.setColorWhite();
        break;
      case 'RGB':
        this.setState({current: 'RGB', selectColor : true});
        break;
      case 'SCHEME':
        this.setState({current: 'SCHEME', selectScheme: true});
        break;
      case 'WHEEL':
        this.setState({current: 'WHEEL'});
        this.setColorWheel();
        break;
    }
  }

  showAllModes() {
    this.setState({selectColor: false})
  }

  render() {
    const modeItems = this.state.modes.map((mode, key) => {
      return (
        <li onClick={() => this.changeMode(mode)} className="btn list-group-item text-capitalize" name={mode} key={key}> {mode} </li>
      )
    })
    return (
      <div>
        <h1> Modes </h1>
        <div className="jumbotron">
        <h1 className="text-centered">Current Mode: {this.state.current} </h1>
        </div>
        {
          this.state.current == 'WHEEL' &&
          <div className="container pb-5">
            <h2> Set Color Wheel Speed </h2>
            <Slider
              value={this.state.speed}
              min={0}
              max={255}
              defaultValue={0}
              onChange={this.onSliderChange}
              handle={this.handleSliderChange}
              railStyle={{ height: 25 }}
              trackStyle={{ height: 25 }}
              handleStyle={{
                height: 28,
                width: 28,
                marginTop: -2,
              }}
            />
          </div>
        }
        {
          this.state.selectColor && this.state.current == 'RGB' &&
          <SelectColor setRGBColor={this.setRGBColor} history={this.props.history} backToModes={this.showAllModes} />
        }
        {
          this.state.current == 'SCHEME' && this.state.selectScheme &&
          <SelectScheme onSchemeChange={this.setScheme} /> 
        }
        {
          !this.state.selectScheme && !this.state.selectColor &&
          <ul className="list-group">
            { modeItems }
          </ul>
        }
      </div>
    )
  }
}

export default Modes;
