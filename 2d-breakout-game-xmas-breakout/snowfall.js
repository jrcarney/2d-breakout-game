(function () {
 
  // Will it be a storm or peaceful?
  var COUNT = 300;
 
  // Get our cotaniner
  var snowContainer = document.querySelector('.snowContainer');
 
  // Create the canvas element
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
 
  // Get the size of the container, that's why we defined the height in the HTML
  var width = snowContainer.clientWidth;
  var height = snowContainer.clientHeight;
  var i = 0;
  var active = false;
 
  function onResize() {
    width = snowContainer.clientWidth;
    height = snowContainer.clientHeight;
    canvas.width = width;
    canvas.height = height;
    ctx.fillStyle = '#FFF';
 
    requestAnimFrame(update);
  }
 
  var Snowflake = function () {
    this.x = 0;
    this.y = 0;
    this.vy = 0;
    this.vx = 0;
    this.r = 0;
 
    this.reset();
  }
  
  // You can set up the 
  Snowflake.prototype.reset = function() {
    this.x = Math.random() * width;
    this.y = Math.random() * -height;
    
    // More speed? Change this
    this.vy = 1 + Math.random() * 3;
    this.vx = 0.5 - Math.random();
 
    // Bigger snow?
    this.r = 1 + Math.random() * 2;
 
    this.o = 0.5 + Math.random() * 0.5;
  }
 
  canvas.style.position = 'absolute';
  canvas.style.left = canvas.style.top = '0';
 
  var snowflakes = [], snowflake;
  for (i = 0; i < COUNT; i++) {
    snowflake = new Snowflake();
    snowflake.reset();
    snowflakes.push(snowflake);
  }
 
  function update() {
 
    ctx.clearRect(0, 0, width, height);
 
    for (i = 0; i < COUNT; i++) {
      snowflake = snowflakes[i];
      snowflake.y += snowflake.vy;
      snowflake.x += snowflake.vx;
 
      ctx.globalAlpha = snowflake.o;
      ctx.beginPath();
      ctx.arc(snowflake.x, snowflake.y, snowflake.r, 0, Math.PI * 2, false);
      ctx.closePath();
      ctx.fill();
 
      if (snowflake.y > height) {
        snowflake.reset();
      }
    }
 
    requestAnimFrame(update);
  }
 
  // shim layer with setTimeout fallback
  window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
              window.setTimeout(callback, 1000 / 60);
            };
  })();
 
  onResize();
  window.addEventListener('resize', onResize, false);
 
  snowContainer.appendChild(canvas);
})();
