console.log('Starting Color Scheme Changer!');
var COLORS = {
  red: 255,
  green: 0,
  blue: 0
}
var speed = 500;
var run = false;

process.on('message', (msg) => {
  console.log('Message from parent:', msg);
  if (msg.color) {
    COLORS = {
      red: Math.ceil(msg.color.red/5)*5,
      green: Math.ceil(msg.color.green/5)*5,
      blue: Math.ceil(msg.color.blue/5)*5
    }
  }

  if (msg.speed) {
    console.log("set speed " + msg.speed);
    speed = msg.speed;
  }

  if (msg.run) {
    console.log("Run Process " + msg.run);
    if (msg.run) runCycle();
  }

  if(msg.kill) {
    process.exit();
  }
});

var runCycle = function () {
  console.log('running color scheme changer ....')
  setInterval(() => {
    if(COLORS.red > 0 && COLORS.blue == 0) {
      COLORS.red = COLORS.red - 5;
      COLORS.green = COLORS.green + 5;
    } else if(COLORS.green > 0 && COLORS.red == 0) {
      COLORS.green = COLORS.green - 5;
      COLORS.blue = COLORS.blue + 5;
    } else if(COLORS.blue > 0 && COLORS.green == 0) {
      COLORS.red = COLORS.red + 5;
      COLORS.blue = COLORS.blue - 5;
    } else {
      var min = 'red';
      var keys = Object.keys(COLORS);
      for (var key in keys) {
        if (COLORS[key] < COLORS[min]) min = key;
      }
      if (COLORS[min] - 5 < 0) {
        COLORS[min] = 0;
      } else {
        COLORS[min] = COLORS[min] - 5;
      }
    }
    process.send({ colors: COLORS });
  }, speed);
}

console.log("Process has ended");
