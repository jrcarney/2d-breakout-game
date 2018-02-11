## Lesson 6: Build the brick field
> The overall aim of this lesson is to render a few lines of code for the  bricks, using a nested loop that works through a two-dimensional array. First however we need to set up some variables to define information about the bricks such as their width and height,  rows and columns, etc. Add the following lines to your code below the variables which you have previously declared in your program.

In this step we:
- Drew a grid of bricks to the canvas

```javascript
/* @JC 11/1/18: building some bricks */
// Bricks: Initialise the amount and shape and padding
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

// Bricks - 2D array: Each bricks array element Contains an object
// containing the x and y position to paint each brick on the screen.
var bricks = [];
for (c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (r = 0; r < brickRowCount; r++) {
    bricks[c][r] = {
      x: 0,
      y: 0
    };
  }
}
```

```javascript
/**
 * @function drawBricks
 *
 * - Paints columns and rows of bricks to the canvas.
 */
var drawBricks = function() {
  for (c = 0; c < brickColumnCount; c++) {
    for (r = 0; r < brickRowCount; r++) {
      var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
      var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
      bricks[c][r].x = brickX;
      bricks[c][r].y = brickY;
      ctx.beginPath();
      ctx.rect(brickX, brickY, brickWidth, brickHeight);
      ctx.fillStyle = "#0095DD";
      ctx.fill();
      ctx.closePath();
    }
  }
}
```
