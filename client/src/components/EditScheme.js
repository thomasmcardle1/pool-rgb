import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {CONFIG} from './Constants';
import ColorGrid from './ColorGrid';
import Sortable from 'react-sortablejs';

class EditScheme extends Component{
  constructor(props) {
    super(props)
    this.state = {
        colors: [],
        name: this.props.match.params.name,
        changed: false,
        original_colors: null,
        allColors: [],
        editName: false,
    }
    this.getAllColors = this.getAllColors.bind(this);
    this.onColorSelect = this.onColorSelect.bind(this);
    this.updateName = this.updateName.bind(this);
    this.saveColorScheme = this.saveColorScheme.bind(this);
    this.onCancelEdit = this.onCancelEdit.bind(this);
  }

  componentWillMount() {
    this.getColorsInScheme();
    this.getAllColors()
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

  getColorsInScheme() {
    axios.get(`http://${CONFIG.ip}:${CONFIG.port}/api/colorsinscheme/${this.props.match.params.id}`)
    .then(response => {
      var colors = response.data;
      colors = colors.sort((a,b)=> {
        return a.pivot.order - b.pivot.order;
      });
      
      this.setState({colors: colors, changed: false});
    })
  }

  onCancelEdit() {
    this.getColorsInScheme();
  }

  onColorSelect(color) {
    var colors = this.state.colors;
    color = this.state.allColors[color];
    color.order = this.state.colors.length;
    colors.push(color);
    this.setState({addNewColor: false, colors:colors, changed: true});
  }

  onChange(order) {
    console.log(order)
    var orderedColors = [];
    for (var key in order) {
      orderedColors.push(this.state.colors[order[key]]);
    }
    this.setState({colors: orderedColors, changed: true});
  }

  saveColorScheme() {
    axios.request({
      method: 'post',
      url: `http://${CONFIG.ip}:${CONFIG.port}/api/colorscheme/${this.props.match.params.id}`,
      data: { colors: this.state.colors, name: this.state.name }
    }).then(response => {
      this.props.history.push('/schemes');
    })
  }

  removeColor(key) {
    var colors = this.state.colors;
    colors.splice(key, 1);
    this.setState({colors, changed: true});
  }

  updateName(e) {
    this.setState({name: e.target.value, changed: true});
  }

  render() {
    let sortable = null; // sortable instance
    const colors = this.state.colors.map((color, key) => {
      return (
        <li
          className="list-group-item text-capitalize tile-list-item mb-2 row"
          key={key}
          data-id={key}
          style={{
            backgroundColor: `rgb(${color.red},${color.green},${color.blue})`,
          }}
          >
            <div className="row">
              <div className="col-12 align-middle">
                {color.name}
              {/* </div> */}
              {/* <div className="col align-middle"> */}
                <button type="button" className="float-right btn btn-danger" onClick={() => this.removeColor(key)}> <i className="fa fa-trash"></i></button>
              </div>
            </div>
        </li>
        )
      });
    return (
      <div>
        { !this.state.addNewColor &&
        <div>
          <div className="text-left"> <Link to='/schemes' className="btn btn-secondary">Back </Link> </div>

          <br/>
          { !this.state.editName ?
            <div>
              <h1 className="text-capitalize"> {this.state.name} <button type="button" className="btn btn-secondary" onClick={()=>{this.setState({editName: true})}}>Edit</button></h1>
            </div>
            : 
            <div className="input-group mb-3">
              <input type="text" className="form-control" value={this.state.name} onChange={this.updateName} />
              <div className="input-group-append">
                <button className="btn btn-success" type="button" onClick={()=>{this.setState({editName: false})}}>Done</button>
              </div>
            </div>
          }

          <ul className="list-group" >
            <Sortable
              // Sortable options (https://github.com/RubaXa/Sortable#options)
              options={{
              }}

              // [Optional] Use ref to get the sortable instance
              // https://facebook.github.io/react/docs/more-about-refs.html#the-ref-callback-attribute
              ref={(c) => {
                  if (c) { sortable = c.sortable; }
              }}

              // [Optional] A tag or react component to specify the wrapping element. Defaults to "div".
              // In a case of a react component it is required to has children in the component
              // and pass it down.
              tag="ul"

              // [Optional] The onChange method allows you to implement a controlled component and keep
              // DOM nodes untouched. You have to change state to re-render the component.
              // @param {Array} order An ordered array of items defined by the `data-id` attribute.
              // @param {Object} sortable The sortable instance.
              // @param {Event} evt The event object.
              onChange={(order, sortable, evt) => {this.onChange(order)}}
            >
              {colors}
            </Sortable>
          </ul>
          <div className="row">
            <div className="text-left col-6" role="group" >
              <button typ="button" className="btn btn-primary btn-md" onClick={()=>{this.setState({addNewColor: true})}}> Add Color <i className="fa fa-plus"></i></button>
            </div>
            <div className="text-right col-6" role="group" >
              { this.state.changed && <button type="button" className="btn btn-danger" onClick={this.onCancelEdit}>Cancel</button>}
              { this.state.changed && <button type="button" className="btn btn-success" onClick={this.saveColorScheme}>Save</button>}
            </div>
          </div>
        </div>
        }
        {
          this.state.addNewColor &&
          <ColorGrid colors={this.state.allColors} onColorClick={this.onColorSelect}/>
        }
      </div>
    )
  }
}

export default EditScheme;
