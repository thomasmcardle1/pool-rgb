import React, { Component } from 'react';
import axios from 'axios';
import {CONFIG} from './Constants';
import { Link } from 'react-router-dom';

class Modes extends Component {
  constructor() {
    super();
    this.state = {
      modes : [],
      current: ""
    }

    this.changeMode = this.changeMode.bind(this)
    this.setColorWhite = this.setColorWhite.bind(this)
  }

  componentWillMount() {
    this.getModes();
    this.getCurrentMode();
  }

  getCurrentMode() {
    axios.get(`http://${CONFIG.ip}:${CONFIG.port}/controller/mode`)
    .then(response => {
      this.setState({current : response.data}, () => {console.log(this.state)});
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
      this.props.history.push('/');
    })
  }

  changeMode(mode) {
    switch(mode) {
      case 'WHITE':
        console.log('this is white');
        this.setColorWhite();
        break;
      case 'RGB':
        console.log('this is rgb');
        break;
      case 'SCHEME':
        console.log(' this is scheme');
        break;
      case 'WHEEL':
        console.log('this is wheel');
        break;
    }
  }

  getColor() {
    
  }

  render() {
    const modeItems = this.state.modes.map((mode, key) => {
      return (
        <li onClick={() => this.changeMode(mode)} className="btn list-group-item text-capitalize" name={mode}> {mode} </li>
      )
    })
    return (
      <div>
        <h1> Modes </h1>
        <div className="jumbotron">
        <h1 className="text-centered">Current Mode: {this.state.current} </h1>
        </div>
          <ul className="list-group">
            { modeItems }
          </ul>
      </div>
    )
  }
}

export default Modes;
