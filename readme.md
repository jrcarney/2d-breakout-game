## Lesson 8: Track the score and win
> Destroying the bricks is really cool, but to be even more awesome the game could award points for every brick a user hits, and keep count of the total score.

In this step we:
- Added `drawScore()`: This updates the score when a brick is destroyed
- Added `isGameComplete()`: This detects if all bricks are destroyed and ends the game

```javascript
/**
 * @function isGameComplete
 *
 * - If all the blocks are destroyed, the player has won the game!
 */
var isGameComplete = function() {
  if(bricksDestroyedCount == 15) {
    gameWon = true;
    gameIsOver();
  }
};

```

```javascript
/**
 * @function drawScore
 *
 * Update the score every time a block has been destroyed
 */
 var drawScore = function() {
   document.querySelector('#score').textContent = score += 10;
 };
```

Refactored:
- Moved `moveBallUpward()`, `moveBallHorizontally()` and `gameIsOver()` out of the `draw()` function
  so to 'farm' the logic out of draw and into their own functions
- Moving gameIsOver() out of draw(), enabled me to reuse the logic from gameIsOver(), therefore
  keeping the code more DRY


```javascript
/**
 * @function moveBallUpward
 *
 * The ball hits the paddle: The ball travels upward and the game
 * continues...
 */
var moveBallUpward = function(dy) {
  dy = -dy;
  return dy;
};

/**
 * @function moveBallHorizontally
 *
 * The ball hits the paddle: The ball travels upward and the game
 * continues...
 */
var moveBallHorizontally = function(dx) {
  dx = -dx;
  return dx;
};

/**
 * @function gameIsOver
 *
 * Stop the draw loop and display a 'you won' or 'game over message'
 */
var gameIsOver = function() {

	// Stop calling the draw() game loop when the ball has dissapeared
	// below the bottom of the canvas
	setTimeout(function() {
		clearInterval(interval);
	}, 500);

	// Display some Game over text
	if(gameWon) {
		document.querySelector('#gameOver').textContent = "YOU WIN!!";

	} else {
		document.querySelector('#gameOver').textContent = "GAME OVER";

	}

	document.querySelector('#restartGame').textContent = "RESTART GAME";

	// Prevent the player from moving the paddles when its Game Over
	document.removeEventListener("keydown", keyDownHandler, false);
	document.removeEventListener("keyup", keyUpHandler, false);
};
```
