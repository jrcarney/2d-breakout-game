## Lesson 7: Collision detection
> We have the bricks appearing on the screen already, but the game still isn't that interesting as the ball goes through them. We need to think about adding collision detection so it can bounce off the bricks and break them.

> It's our decision how to implement this, of course, but it can be tough to calculate whether the ball is touching the rectangle or not because there are no helper functions in Canvas for this. For the sake of this tutorial we will do it the easiest way possible. We will check if the center of the ball is colliding with any of the given bricks. This won't give a perfect result every time, and there are much more sophisticated ways to do collision detection, but this will work fine for teaching you the basic concepts.

In this step we:
- Enabled bricks to be destroyed when they are hit by the ball

```javascript
var bricks = [];
for (c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (r = 0; r < brickRowCount; r++) {
    bricks[c][r] = {
      x: 0,
      y: 0,
      status: 1
    };
  }
}

function drawBricks() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
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
}
```

```javascript
/**
 * @function collisionDetection
 *
 * - Sets the status of a brick to zero if the ball hits it.
 */
var collisionDetection = function() {
  for (c = 0; c < brickColumnCount; c++) {
    for (r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];

      // Check for bricks that still exist
      if (b.status == 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;

          // Will force the destroyed brick to no longer render
          b.status = 0;
        }
      }
    }
  }
}
```
