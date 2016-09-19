var value = 0;

function preload()
{
  img = loadImage("flower.png");
}

function setup() {
  createCanvas(720, 400);
  background(30);
}

function draw() {

}

function mousePressed() {
  image(img, mouseX, mouseY, random([10],[300]), random([10],[300]));
}

function keyTyped() {
  if (key === 'd'){
    clear();
    background(random(255));
  }
} 
