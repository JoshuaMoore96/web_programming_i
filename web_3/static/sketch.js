/*
 * @name Animation
 * @description The circle moves.
 */
// Where is the circle
let x, y;
let x2, y2;

function setup() {
  createCanvas(720, 400);
  // Starts in the middle
  x = width / 2;
  y = height;
  x2 = x;
  y2 = y;
}

function draw() {
  background(200);

  // Draw a circle
  stroke(50);
  fill(100);
  ellipse(x, y, 24, 24);
  ellipse(x2, y2, 24, 24);

  // Jiggling randomly on the horizontal axis
  x = x + random(-1, 1);
  x2 = x2 + random(-1, 1);
  // Moving up at a constant speed
  y = y - 1;
  y2 = y2 - 1/2;

  // Reset to the bottom
  if (y < 0) {
    y = height;
  }
}

