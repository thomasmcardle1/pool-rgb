'use strict'

const Model = use('Model')

class Mode {
  constructor() {
    this.modes = ['RGB', 'WHITE', 'WHEEL', 'SCHEME'];
    this.current = "RGB";
  }

  currentMode () {
    return this.current;
  }

  getAllModes() {
    return this.modes;
  }

  setMode(mode) {
    mode = mode.toUpperCase();
    console.log(mode)
    if (this.modes.includes(mode)) {
      this.current = mode;
    } else {
      return false;
    }
    console.log(`current mode set: ${this.current}`);
    return this.current;
  }
}

module.exports = Mode;