var carrier; // this is the oscillator we will hear
var modulator; // this oscillator will modulate the frequency of the carrier

var analyzer; // we'll use this visualize the waveform

// the carrier frequency pre-modulation
var carrierBaseFreq = 220;

// min/max ranges for modulator
var modMaxFreq = 112;
var modMinFreq = 0;
var modMaxDepth = 150;
var modMinDepth = -150;


var NUMSINES = 6; // how many of these things can we do at once?
var sines = new Array(NUMSINES); // an array to hold all the current angles
var rad; // an initial radius value for the central sine
var i; // a counter variable

// play with these to get a sense of what's going on:
var fund = 0.009; // the speed of the central sine
var ratio = 0.4; // what multiplier for speed is each additional sine?
var alpha = 10; // how opaque is the tracing system

var trace = false; // are we tracing?


function setup() {
  var cnv = createCanvas(800, 600); // OpenGL mode
  noFill();
  carrier = new p5.Oscillator('sine');
  carrier.amp(0); // set amplitude
  carrier.freq(carrierBaseFreq); // set frequency
  carrier.start(); // start oscillating

  // try changing the type to 'square', 'sine' or 'triangle'
  modulator = new p5.Oscillator('sawtooth');
  modulator.start();

  // add the modulator's output to modulate the carrier's frequency
  modulator.disconnect();
  carrier.freq( modulator );

  // create an FFT to analyze the audio
  analyzer = new p5.FFT();

  // fade carrier in/out on mouseover / touch start
  toggleAudio(cnv);
  rad = height / 4; // compute radius for central circle
  background(255); // clear the screen

  for (i = 0; i < sines.length; i++) {
    sines[i] = PI; // start EVERYBODY facing NORTH
  }
  
}

function draw() {
  if (!trace) {
    background(255); // clear screen if showing geometry
    stroke(0, 255); // black pen
    noFill(); // don't fill
  }
  var modFreq = map(mouseY, height, 0, modMinFreq, modMaxFreq);
  modulator.freq(modFreq);

  // change the amplitude of the modulator
  // negative amp reverses the sawtooth waveform, and sounds percussive
  //
  var modDepth = map(mouseX, 0, width, modMinDepth, modMaxDepth);
  modulator.amp(modDepth);

  // analyze the waveform
  waveform = analyzer.waveform();

  // MAIN ACTION
  push(); // start a transformation matrix
  translate(width / 2, height / 2); // move to middle of screen

  for (i = 0; i < sines.length; i++) // go through all the sines
  {
    var erad = 0; // radius for small "point" within circle... this is the 'pen' when tracing
    // setup for tracing
    if (trace) {
      stroke(0, 0, 0, alpha); //color
      fill(0, 0, 255, alpha / 2); //color
      erad = 30.0 * (1.0 - float(i) / sines.length); // pen width will be related to which sine
    }
    
    var radius = rad / (i + 1); // radius for circle itself
    rotate(sines[i]); // rotate circle
    
    if (!trace) rect(0, 0, radius, radius); // if we're simulating, draw the sine
    push(); // go up one level
    translate(0, radius); // move to sine edge
    if (!trace) ellipse(0, 0, 5, 5); // draw a little circle
    if (trace) rect(0, 0, erad, erad); // draw with erad if tracing as s square 
    pop(); // go down one level
    translate(0, radius); // move into position for next sine
    sines[i] = (sines[i] + (fund/2 + (fund/2 * i * ratio*3))) % TWO_PI; // update angle based on fundamental
  }

  pop(); // pop down final transformation

}

function keyReleased() {
  if (key == ' ') {
    trace = !trace;
    background(50);
  }
}
  // helper function to toggle sound
function toggleAudio(cnv) {
  cnv.mouseOver(function() {
    carrier.amp(1.0, 0.01);
  });
  cnv.touchStarted(function() {
    carrier.amp(1.0, 0.01);
  });
  cnv.mouseOut(function() {
    carrier.amp(0.0, 1.0);
  });
}

//how to change osc based on position of the drawing?