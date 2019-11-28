import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import ColorItem from './ColorItem';
import {CONFIG} from './Constants';
import ColorGrid from './ColorGrid';

class Colors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allColors: [],
    }
    this.onColorClick = this.onColorClick.bind(this);
    
  }

  componentWillMount() {
    this.getAllColors();
  }

  onColorClick(color) {
    this.props.history.push(`/colors/edit/${color.id}`)
  }

  removeColor(colorId) {
    console.log(colorId);
    axios.delete(`http://${CONFIG.ip}:${CONFIG.port}/api/colors/${colorId}`)
    .then(response => {
      this.getAllColors();
    })
    .catch((error) => {
      console.log(error);
    })
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

  render() {
    return (
      <div>
        <h1 className="py-3"> All Saved Colors <Link to="/colors/add" className="btn btn-primary btn-md"> <i className="fa fa-plus"></i> Add Color </Link></h1>
        <ColorGrid colors={this.state.allColors} onColorClick={this.onColorClick} />
        {/* <button className="btn red right" onClick={this.onDelete.bind(this)}> Delete </button> */}
      </div>
    )
  }
}

export default Colors;
