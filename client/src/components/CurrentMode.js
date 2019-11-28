import React, {Component} from 'react';
import axios from 'axios';
import {CONFIG} from './Constants';

class CurrentModeBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: null,
      color: null
    }

    this.getCurrentStatus = this.getCurrentStatus.bind(this);
  }
  
  getCurrentStatus() {
    axios.get(`http://${CONFIG.ip}:${CONFIG.port}/controller/mode`)
    .then(response => {
      this.setState({mode : response.data});
    })
    .catch((error) => {
      console.log(error);
    })

    axios.get(`http://${CONFIG.ip}:${CONFIG.port}/controller/color`)
    .then(response => {
      this.setState({color : response.data});
    })
    .catch((error) => {
      console.log(error);
    })
  }

  componentDidMount() {
    this.getCurrentStatus();
    // setInterval(this.getCurrentStatus, 5000);
  }

  render() {
    return (
      this.state.mode && this.state.color &&
      <div className="text-right">

        <div className="pr-3 current-bar text-capitalize"> {this.state.mode}
          <span className="ml-2 px-2 current-color" style={{
            backgroundColor: `rgb(${this.state.color.red},${this.state.color.green},${this.state.color.blue})`,
          }}></span>
        </div>
      </div>
    )
  }
}

export default CurrentModeBar;