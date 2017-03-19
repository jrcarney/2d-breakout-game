## Lesson two: Moving the ball by defining a drawing loop
In this lesson we learned how to setup a drawing loop which repaints a ball to the canvas every 10 milliseconds.

We made the ball move by updating its x and y axis every 10 milliseconds but hit an issue with the ball leaving a 'trail'. To remove the 'trail', we cleared the canvas enabling the illusion the ball is moving.

We also organised our code into single purpose functions, to make our code more readable.

**Note:** To make the javascript more modern i decided to wrap the program in an IFFE, and change the function declarations to function expressions.

### Drawing a moving ball to the canvas
- [ ] We reused the html structure, canvas element, canvas ID and 2D rendering context from lesson 1
- [ ] Initialised the starting position of the ball when the program loads in variables `x` and `y`
- [ ] Initialised the ball postion in `dx` and `dy` variables (these get updated in our 'draw loop' during program execution)
- [ ] We used javascripts `setInterval()` function (with an interval of 10 milliseconds) to call our custom`draw()` function
- [ ] Our `draw()` function takes care of 
 - [ ] - Clearing the canvas: this forms part of the 'ball moving' illusion
 - [ ] - Invoking the `drawBall()` function: this actually takes care of drawing the ball to the canvas
 - [ ] - Updating the `dx` and `dy` variables after drawBall() invoction (the ball will gets a new postion on the canvas)
- The call stack is returned to `setInterval()` and it repeats the process

