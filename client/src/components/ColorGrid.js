import React, { Component } from 'react';

class ColorGrid extends Component {
  render () {
    const colors = this.props.colors.map((color, key) => {
      return (
          <div
            key={key}
            details={color}
            className="text-capitalize col-6 p-2 btn"
            onClick={() => this.props.onColorClick(color)}
            >
              <div
                className="tile align-middle"
                style={{
                  backgroundColor: `rgb(${color.red},${color.green},${color.blue})`,
                }}>
                {color.name}
              </div>
          </div>
        // <ColorItem key={key} details={color}/>
        //<li className="collection-item" key={key} id={color.id}> {`Red: ${color.red} Green: ${color.green} Blue: ${color.blue} White: ${color.white}`} <i className="fas fa-trash-alt" style={{color:'red', float: 'right'}} onClick={() => {this.removeColor(color.id)}}></i></li>
      )
    })
    return (
      <div className="row">
        {colors}
      </div>
    )
  }
}

export default ColorGrid;