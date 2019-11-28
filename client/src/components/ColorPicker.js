import React, { Component } from 'react';
import iro from "@jaames/iro";

import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const Handle = Slider.Handle;

class ColorPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colors : {
        red : this.props.colors ? this.props.colors.red: 255,
        green : this.props.colors ? this.props.colors.green: 255,
        blue : this.props.colors ? this.props.colors.blue: 255,
        white : this.props.colors ? this.props.colors.white: 0
      },
      name: "",
    }
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.onSliderChange = this.onSliderChange.bind(this);
    this.updateColor = this.updateColor.bind(this);
    this.updateColorName = this.updateColorName.bind(this);
  }


  componentDidMount() {
    console.log(this.props);
    console.log(this.state);
    const picker = new iro.ColorPicker("#color-picker-container", {
      width: "300",
      color : {
        r: this.state.colors.red,
        g: this.state.colors.green,
        b: this.state.colors.blue
      }
    });
    picker.on("color:change", () => {
      var color = {
        red: picker.color.rgb.r,
        green: picker.color.rgb.g,
        blue: picker.color.rgb.b,
      }
      var newColors = Object.assign({}, this.state.colors, color);
      this.setState({colors: newColors}, () => {
        console.log(this.state.colors);
        this.props.updateColor(this.state.colors)
      });
    });
    this.setState({picker})
  }

  onSliderChange(value) {
    var newColors = Object.assign({}, this.state.colors, {white: value});
    this.setState({colors: newColors}, () => {console.log(this.state.colors); this.props.updateColor(this.state.colors)});
  }

  updateColor(e) {
    var colors = this.state.colors;
    colors[e.target.name] = parseInt(e.target.value);
    console.log(e.target.value);
    this.setState({colors}, function() {
      this.props.updateColor(this.state.colors);
      // this.setColorPicker(this.state.colors);
    })
  }

  updateColorName(e) {
    this.setState({name: e.target.value}, function() {
      this.props.updateColor(this.state.colors);
      // this.setColorPicker(this.state.colors);
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

  render() {
    return(
      <div className="row pb-2">
        <div className="col-12">
          <div id="color-picker-container"></div>
        </div>
        
        <div className="col-12 py-2">
          <div className="py-3" style={{maxWidth:"450px"}}>

            <Slider
              value={this.state.colors.white}
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
                // marginLeft: -14,
                marginTop: -2,
                // backgroundColor: 'black',
              }}
            />
          </div>
        </div>
        <div className="col-12">
          <table>
            <tbody>
              <tr className="">
                <td className="text-capitalize"> RED </td>
                <td> <input name="red" type="number" min="0" max="255" className="form-control" value={this.state.colors.red} onChange={this.updateColor}/> </td>
              </tr>
              <tr>
                <td className="text-capitalize"> GREEN </td>
                <td> <input name="green" type="number" min="0" max="255" className="form-control" value={this.state.colors.green} onChange={this.updateColor}/> </td>
              </tr>
              <tr>
                <td className="text-capitalize"> BLUE </td>
                <td> <input name="blue" type="number" min="0" max="255" className="form-control" value={this.state.colors.blue} onChange={this.updateColor}/> </td>
              </tr>
              <tr>
                <td className="text-capitalize"> WHITE </td>
                <td> <input name="white" type="number" min="0" max="255" className="form-control" value={this.state.colors.white} onChange={this.updateColor}/> </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default ColorPicker;
