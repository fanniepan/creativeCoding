var poemLines;
function preload() {
  thefont = loadFont('./data/duke.otf');
  poemLines = loadStrings('got.txt');
}
function setup() {
  createCanvas(400, 600);
  textFont(thefont);
}
function draw() {
  background(50);
  //text size changes as you move your mouse
  textSize(12 + (mouseX / width)*30)
  for (var i = 0; i < poemLines.length; i++) {
    fill(128+(i*10));
    text(poemLines[i], 10, 50+i*60);
  }
}
//when the mouse is pressed, it randomizes the poem lines
//i made this to make new poems based on one poem 
function mousePressed() {
  shuffle(poemLines, true);
}