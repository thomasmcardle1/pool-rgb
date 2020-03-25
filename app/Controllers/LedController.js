// const Gpio = require('pigpio').Gpio;

const { fork } = require('child_process');
const Color = use('App/Models/Color');
// const Mode = use('App/Models/Mode');
const Env = use('Env')
// import { threadId } from 'worker_threads';

class LedController {

  constructor(mode) {
    this._speed = 1000; // 1 second
    this._color = new Color();
    this._mode = mode;
    this._scheme = null;

    if (Env.get('RED_GPIO')) this._RED_LED = new Gpio(Env.get('RED_GPIO'), {mode: Gpio.OUTPUT});
    if (Env.get('BLUE_GPIO')) this._GREEN_LED = new Gpio(Env.get('GREEN_GPIO'), {mode: Gpio.OUTPUT});
    if (Env.get('GREEN_GPIO')) this._BLUE_LED = new Gpio(Env.get('BLUE_GPIO'), {mode: Gpio.OUTPUT});
    if (Env.get('WHITE_GPIO')) this._WHITE_LED = new Gpio(Env.get('WHITE_GPIO'), {mode: Gpio.OUTPUT});

    this.setColorModeWhite();
  }

  changeColor(red, green, blue, white = null) {
    this._color = {red, green, blue, white}
    this.setColorGPIOPins();
    return this.toString();
  }

  setModeScheme(newMode, scheme) {
    newMode = newMode.toUpperCase();
    if (!this._mode.setMode(newMode)) return false;
    console.log(scheme);
    if(this._mode.currentMode() == 'scheme') this.spawnColorWheelColorScheme(scheme);
  }

  setMode(newMode, color) {
    newMode = newMode.toUpperCase();
    if (!this._mode.setMode(newMode)) return false;

    this.killColorWheelProcess();
    if(this._mode.currentMode() == 'WHEEL') this.spawnColorWheel();
    if(this._mode.currentMode() == 'WHITE') this.setColorModeWhite();
    if(this._mode.currentMode() == 'RGB') {
      this.changeColor(color.red, color.green, color.blue, (color.white ? color.white : null))
    }
  }

  setColorGPIOPins() {
    console.log(`set color pins: (${this._color.red}, ${this._color.green}, ${this._color.blue}, ${this._color.white})`)
    if (this._RED_LED) this._RED_LED.pwmWrite(this._color.red);
    if (this._GREEN_LED) this._GREEN_LED.pwmWrite(this._color.green);
    if (this._BLUE_LED) this._BLUE_LED.pwmWrite(this._color.blue);
    if (this._WHITE_LED) this._WHITE_LED.pwmWrite(this._color.white);
  }

  getColor() {
    return this._color;
  }

  getMode() {
    return this._mode;
  }

  setColorModeWhite() {
    this.changeColor(255, 255, 255, 255);
  }

  /************** Functions to control child process ****************/
  spawnColorWheel () {
    this._wheel_process = fork('app/Scripts/ColorWheel.js');

    this._wheel_process.on('message', (msg) => {
      console.log(msg);
      if (msg.colors) {
        this.changeColor(msg.colors.red, msg.colors.green, msg.colors.blue);
      }
    });

    this._wheel_process.on('exit', function(){
      console.log('Child exited!');
    });

    this._wheel_process.send({ 'color': this._color, 'speed': this._speed, 'run': true});
    this._speed = this._speed - 200;
    console.log("speed set to: " + this._speed);
  }

  setColorWheelSpeed (newSpeed) {
    this._speed = newSpeed;
    this.killColorWheelProcess();
    this.spawnColorWheel();
  }

  killColorWheelProcess () {
    if (this._wheel_process) this._wheel_process.kill('SIGINT');
  }

  spawnColorWheelColorScheme(colorscheme) {
    console.log(colorscheme);
  }
  /******************************************************************/

  toString() {
    return {mode: this._mode, color: this._color, speed: this._speed}
  }
}

module.exports = LedController;