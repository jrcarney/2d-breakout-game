(function() {

			// debugger

			/********************************************************/
			// # SETUP OUR CANVAS AND PROPERTIES
			/********************************************************/

			// Store reference to the canvas element
			var canvas = document.getElementById("gameCanvas");

			// Store reference to 2D rendering context
			// - the tool we can use for painting to the Canvas
			var ctx = canvas.getContext("2d");

			// Initial ball position: Define the ball postion on the canvas
			var x = canvas.width / 2;
            var y = canvas.height - 30;
            
			// New ball position: Increases the amount of dx and dy increases the speed of the ball
			if(localStorage.getItem("dx") ) {
				var dx = parseInt( localStorage.getItem("dx") );
			} else {
				var dx = 3;
			}

			if(localStorage.getItem("dy") ) {
				var dy = parseInt( localStorage.getItem("dy") );
			} else {
				var dy = -3;
			}			

			var ballRadius = 10;

			// Initialise the paddle
			var paddleHeight = 10;
			var paddleWidth = 125;
			var paddleX = (canvas.width - paddleWidth) / 2;

			// Buttons
			var rightPressed = false;
			var leftPressed = false;

			// Bricks: Initialise the amount and shape and padding
			var brickRowCount = 3;
			var brickColumnCount = 10;
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
						y: 0,
						status: 1
					};
				}
			}
			
			if( localStorage.getItem("score") ) {
				var score = parseInt( localStorage.getItem("score") );
			} else {
				var score = 0;
			}
			var bricksDestroyedCount = 0;
			var gameWon = false;

            // Utimately used for stopping the game loop.declaration used for storing 
            // the return value of requestAnimationFrame().
			var frames;

			// Declaration used for stopping the animationFrames
			var stop;
			
			// Declaration used for storing the level the player is on.
			if(localStorage.getItem("level") ) {
				var levelNumber = localStorage.getItem("level");
			} else {
				var levelNumber = 1;
			}

			// Load the audio file
			var jingle = new Audio('jingle.mp3');

			// ############################################################ //
			// @tag: testMode / test mode
			// Set this to true to enter test game mode. only use for testing!!
			// when not testing, set to false
			var overrideCount = false;
			// ############################################################ //

			/********************************************************/
			// # THE DRAW LOOP
			/********************************************************/

			/**
			 * Every time we draw the ball, draw it at a new position
			 */
			var drawBall = function() {
				ctx.beginPath();
				ctx.arc(x, y, ballRadius, 0, Math.PI * 2, false);
				ctx.fillStyle = "#226fff";				
				ctx.fill();			
				ctx.lineWidth = 3;
				ctx.strokeStyle = "black";
				ctx.stroke();
				ctx.closePath();
			};

			/**
			 * Draw the paddle in a different place on screen based on left
			 * right cursor presses
			 */
			var drawPaddle = function() {
				ctx.beginPath();
				ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
				ctx.fillStyle = "darkred";
				ctx.fill();
				ctx.closePath();
			};

			/**
			 * @function drawBricks
			 *
			 * - Paints columns and rows of bricks to the canvas.
			 * - Destroyed bricks no longer render.
			 */
			var drawBricks = function() {
				for (c = 0; c < brickColumnCount; c++) {
					for (r = 0; r < brickRowCount; r++) {
						if (bricks[c][r].status == 1) {
							var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
							var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
							bricks[c][r].x = brickX;
							bricks[c][r].y = brickY;
							ctx.beginPath();
							ctx.rect(brickX, brickY, brickWidth, brickHeight);
							ctx.fillStyle = "green";
							ctx.fill();
							ctx.closePath();
						}
					}
				}
			};

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
								bricksDestroyedCount++;

								//  play brick destroyed sound ( Create file on the fly to avoid timing issues )											
								var brickDestroyed = new Audio('handbell.mp3');	
								var promise = brickDestroyed.play();
								if (promise !== undefined) {
									promise.then(_ => {		
                                                                       					
										brickDestroyed.play();
								}).catch(error => {});
								}							
													
								drawScore();
								isGameComplete();
							}
						}
					}
				}
			}

			/**
			 * @function isGameComplete
			 *
			 * - If all the blocks are destroyed, the player has won the game!
			 */
			var isGameComplete = function() {
				if(overrideCount == true) {
					if(bricksDestroyedCount == 1) {
						gameWon = true;
						gameIsOver();						
					}	

				} else {				
					if(bricksDestroyedCount == 30) {
						gameWon = true;
						gameIsOver();
					}	
				}
			};

			/**
			 * @function drawScore
			 *
			 * Update the score every time a block has been destroyed
			 */
			 var drawScore = function() {				 
				score = score +10;
				localStorage.setItem("score", score);
				document.querySelector('#score').textContent = score;
			 };

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
				scoreCounter();

				// Display Game over text
				if(gameWon) {
					document.querySelector('#gameOver').textContent = "Level complete";
					
					// Display the next level button
					document.querySelector('#nextLevel').style.display = "block";
					document.querySelector('#nextLevel').textContent = "Next level";

					// Stop the game loop
					stop = true;
					stopDrawing(stop);

				} else {
					
					document.querySelector('#gameOver').textContent = "GAME OVER";
					
					// Stop the game loop
					stop = true;
					stopDrawing(stop);
					
					// Display restart game button
					document.querySelector('#restartLevel').textContent = "Restart level";
					localStorage.setItem("score", 0);						
				}

				// Prevent the player from moving the paddles when its Game Over
				document.removeEventListener("keydown", keyDownHandler, false);
				document.removeEventListener("keyup", keyUpHandler, false);							
			};

			// Set the high score
			var scoreCounter = function() {
				if(localStorage.getItem("highScore")){							
					document.querySelector('#highestScore').textContent = localStorage.getItem("highScore");
				} else {					
					document.querySelector('#highestScore').textContent =  "No high score recorded yet";
					localStorage.setItem("highScore", score);
				}				

				if( score > parseInt( localStorage.getItem("highScore") )) {					
					localStorage.setItem("highScore", score);
					document.querySelector('#highestScore').textContent =  parseInt( localStorage.getItem("highScore") );
				}				
			}			
	
			/**
			 * @function draw
			 *
			 * - Clear the canvas, re-draw the bricks and ball.
			 * - The ball is redrawn in a new postion.
			 * - The paddle is redrawn in a new position based on left right button presses
			 * - Allows the ball to dissapear below the canvas, ending the game.
			 */
			var draw = function() {
				// Clear the canvas and re-draw everything
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				drawBricks();
				drawBall();
				drawPaddle();
				collisionDetection();				

				x += dx;
				y += dy;

				/********************************************************/
				// # COLLISION DETECTION
				/********************************************************/

				// If the ball is right edge or less than the left edge,
				// reverse the movement of the ball
				if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
					dx = moveBallHorizontally(dx);
				}

				// 0 is the top edge canvas.height is the bottom edge
				// If the ball is above the top edge reverse the movement of the ball
				if (y + dy < ballRadius) {
					dy = moveBallUpward(dy);

				} else if (y + dy > canvas.height - ballRadius) {

					if (x > paddleX && x < paddleX + paddleWidth) {
						dy = moveBallUpward(dy);

					} else {
						gameIsOver();

					}
				}
				/// End collision detection

				/**
				 * Move the paddle on the left or right side of the canvas based
				 * on whether the left or right buttons were pressed.
				 */
				if (rightPressed && paddleX < canvas.width - paddleWidth) {
					debugger
					paddleX += 7;

				} else if (leftPressed && paddleX > 0) {
					debugger
					paddleX -= 7;

				}

				// Update the score and high score
                scoreCounter();
                
				/**
				 * @function logDrawFn
				 *
				 * Logging function: used to output the position of the x and y position
				 * of the ball.
				 */
				function logDrawFn() {
					console.log('y is: ');
					console.log(y);
					console.log('x is: ');
					console.log(x);
				}			

				// Continue running the game if no stop condition is established.
				if(!stop) {
					animationFn();
				}
			}

			// Framerate controlled by the host environment
			var animationFn = function() {
				frames = requestAnimationFrame(draw);	
			};
			

			// Stop the game loop / animation.
			var stopDrawing = function(stop) {
				if(stop) {
					cancelAnimationFrame(frames);
				}
			};

			// Dispaly the level number in the UI
			var levelNumberUi = function() {				
				if(localStorage.getItem('level')) {
					document.querySelector('#currentLevel').textContent = localStorage.getItem('level');
				} else {
					document.querySelector('#currentLevel').textContent = 1
				}				
			};

			/********************************************************/
			// # ENTER THE DRAW LOOP
			/********************************************************/
			
			// Calls draw which runs requestAnimationFrame(draw);
			draw();

			// Draw the level UI
			levelNumberUi();

			// Play background music after its been loaded
			setInterval(function() {
                var jinglepromise = jingle.play();
                if (jinglepromise !== undefined) {
                    jinglepromise.then(_ => {								
                        jingle.play();
                        jingle.loop = true;
                }).catch(error => {});
                }	                
			}, 1000);			

			/********************************************************/
			// # EVENTS
			/********************************************************/

			/**
			 * Handle left and right movement of the paddle
			 */
			var keyDownHandler = function(e) {
				if (e.keyCode == 39) {		
					rightPressed = true;
				} else if (e.keyCode == 37) {				
					leftPressed = true;
				}
			};
			document.addEventListener("keydown", keyDownHandler, false);

			var keyUpHandler = function(e) {
				if (e.keyCode == 39) {
					rightPressed = false;
				} else if (e.keyCode == 37) {
					leftPressed = false;
				}
			};
			document.addEventListener("keyup", keyUpHandler, false);

			/* touch events */
			var ongoingTouches = [];

			var handleStart = function(evt) {
				//debugger
				//evt.preventDefault();
				// console.log("touchstart.");
				// var el = document.getElementsByTagName("canvas")[0];
				// var ctx = el.getContext("2d");
				var touches = evt.changedTouches;
						
				for (var i = 0; i < touches.length; i++) {
					console.log("touchstart:" + i + "...");
					ongoingTouches.push(copyTouch(touches[i]));
					// var color = colorForTouch(touches[i]);
					// ctx.beginPath();
					// ctx.arc(touches[i].pageX, touches[i].pageY, 4, 0, 2 * Math.PI, false);  // a circle at the start
					// ctx.fillStyle = color;
					// ctx.fill();
					console.log("touchstart:" + i + ".");
				}
			};

			var touchCounter = 500;

			function handleMove(evt) {
				debugger
				//evt.preventDefault();
				// var el = document.getElementsByTagName("canvas")[0];
				//var ctx = el.getContext("2d");
				var touches = evt.changedTouches;
		
				for (var i = 0; i < touches.length; i++) {
					//var color = colorForTouch(touches[i]);
					var idx = ongoingTouchIndexById(touches[i].identifier);
		
					if (idx >= 0) {
					console.log("continuing touch "+idx);
					//ctx.beginPath();
					console.log("ctx.moveTo(" + ongoingTouches[idx].pageX + ", " + ongoingTouches[idx].pageY + ");");
					//ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
					console.log("ctx.lineTo(" + touches[i].pageX + ", " + touches[i].pageY + ");");
					// ctx.lineTo(touches[i].pageX, touches[i].pageY);
					// ctx.lineWidth = 4;
					// ctx.strokeStyle = color;
					// ctx.stroke();
		
					ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
					console.log(".");
					} else {
					console.log("can't figure out which touch to continue");
					}

					

					if(ongoingTouches[idx].pageX < touchCounter) {
						touchCounter = ongoingTouches[idx].pageX;
						paddleX -= 12;
					} 

					if(ongoingTouches[idx].pageX > touchCounter) {
						touchCounter = ongoingTouches[idx].pageX;
						paddleX += 12;
					}
				}
			}

			
			function copyTouch(touch) {
				return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
			}   
			
			function ongoingTouchIndexById(idToFind) {
				for (var i = 0; i < ongoingTouches.length; i++) {
					var id = ongoingTouches[i].identifier;
					
					if (id == idToFind) {
					return i;
					}
				}
				return -1;    // not found
			}

			// var handleEnd = function(e) {
			// 	//  	debugger
			// 	//alert("im made by the touch start event");
			// 	console.log(e);
			// 	debugger
			// 	var touchobj = e.changedTouches[0];
			// 	leftPressed = true;
			// };

			document.addEventListener("touchstart", handleStart, false);			
			//document.addEventListener("touchstart", handleEnd, false);			
			document.addEventListener("touchmove", handleMove, false);			

			/**
			 * Handle restarting of the game
			 */
			var restartLevel = function(e) {
				if (e.target.id == 'restartLevel') {
					window.location.reload();
				}
			};
			document.addEventListener("click", restartLevel, false);

			/**
			 * Increases the difficulty of the game for each level.
			 */
			var nextLevel = function(e) {
				if(e.target.id == 'nextLevel') {					
					function getRandomIntInclusive(min, max) {
						var	min = Math.ceil(min);
						var	max = Math.floor(max);
						return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
					}

					levelNumber++;
					localStorage.setItem("level", levelNumber);
					
					switch(levelNumber) {
						case 1:
						case 2:
						case 3:
							localStorage.setItem("dx", getRandomIntInclusive(1, 3));	
							localStorage.setItem("dy", getRandomIntInclusive(4, 7));		
							break;
						case 4:
						case 5:
						case 6:
							localStorage.setItem("dx", getRandomIntInclusive(3, 6));	
							localStorage.setItem("dy", getRandomIntInclusive(7, 10));		
							break;
						case 7:
						case 8:
						case 9:
							localStorage.setItem("dx", getRandomIntInclusive(6, 9));	
							localStorage.setItem("dy", getRandomIntInclusive(10, 13));		
							break;
						case 10:
						case 11:
						case 12:
							localStorage.setItem("dx", getRandomIntInclusive(8, 9));	
							localStorage.setItem("dy", getRandomIntInclusive(10, 11));		
							break;
					}					
					window.location.reload();
				}
			};
			document.addEventListener("click", nextLevel, false);	
			
			// Reset game to level one
			var newGame = function(e) {
				if(e.target.id == 'newGame') {
					localStorage.setItem("dx", 3);
					localStorage.setItem("dy", -3);
					localStorage.setItem("level",1);
					window.location.reload();
				}				
			};
			document.addEventListener("click", newGame, false);

			window.onload = function() {
				var input = document.querySelector("#gameCanvas").focus();
			  }
		}());
