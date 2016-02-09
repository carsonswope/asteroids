var Asteroid = require('./asteroid.js');
var Ship = require('./ship.js');

function Game(){
  this.asteroids = [];
  this.bullets = [];
  this.score = 0;
  this.lives = 3;
  this.over = false;
}

// Game.prototype.DIM_X = 640;
// Game.prototype.DIM_Y = 480;
Game.prototype.NUM_ASTEROIDS = 15;

Game.prototype.addShip = function () {
  this.ship = new Ship({
    game: this,
    pos: this.randomPosition()
  });
};

Game.prototype.addAsteroids = function () {
  for (var i = 0; i < this.NUM_ASTEROIDS; i++) {
    var radius = this.randomSize();
    this.asteroids.push(
      new Asteroid( {
        pos: this.randomPosition(),
        game: this,
        radius: radius,
        vel: this.randomVelocity(radius),
       } )
    );
  }
};


Game.prototype.allObjects = function () {

  return this.asteroids.concat([this.ship]).concat(this.bullets);
};

Game.prototype.checkCollisions = function () {
  var collisions = [];
  for (var i = 0; i < this.allObjects().length; i++) {
    for (var j = 0; j < this.allObjects().length; j++) {
      if (i !== j) {
        if (this.allObjects()[i] && this.allObjects()[i].isCollidedWithOtherObject(this.allObjects()[j])) {
          this.allObjects()[i].collideWith(this.allObjects()[j]);
        }
      }
    }
  }
};

Game.prototype.remove = function (obj) {
  if (obj.constructor.name === "Asteroid" || obj.constructor.name === "FadingAsteroid") {
    this.asteroids.splice(this.asteroids.indexOf(obj), 1);
  } else if (obj.constructor.name === "Bullet") {
    this.bullets.splice(this.bullets.indexOf(obj), 1);
  }
};



Game.prototype.wrap = function(pos, obj) {
  var newPos = [];

  if (pos[0] > (this.DIM_X + obj.radius)) { newPos.push(-obj.radius); }
  else if (pos[0] < -obj.radius) { newPos.push(this.DIM_X+obj.radius); }
  else { newPos.push(pos[0]); }

  if (pos[1] > (this.DIM_Y + obj.radius) ) { newPos.push(-obj.radius); }
  else if (pos[1] < -obj.radius) { newPos.push(this.DIM_Y+obj.radius); }
  else { newPos.push(pos[1]); }

  return newPos;

};

Game.prototype.isOutOfBounds = function (pos, radius) {
  if (pos[0] > (this.DIM_X + radius)) { return true; }
  else if (pos[0] < -radius) { return true; }

  if (pos[1] > (this.DIM_Y + radius) ) { return true; }
  else if (pos[1] < -radius) { return true; }

  return false;
};

Game.prototype.draw = function(ctx) {
  ctx.clearRect(0,0,this.DIM_X, this.DIM_Y);
  for (var i = 0; i < this.allObjects().length; i++) {
    this.allObjects()[i].draw(ctx);
  }

  ctx.fill
  ctx.font="30px Courier";
  ctx.fillText("Lives: " + this.lives, 10,30);
  ctx.fillText("Score: " + this.score, 10,60);

};

Game.prototype.moveObjects = function (dT) {
  for (var i = 0; i < this.allObjects().length; i++) {
    this.allObjects()[i].move(dT);
  }
};

Game.prototype.randomPosition = function () {
  return [Math.random() * this.DIM_X, Math.random() * this.DIM_Y ];
};

Game.prototype.randomVelocity = function (size) {
  var angle = Math.random() * Math.PI * 2;
  var magnitude = 3 + Math.random()*5;
  magnitude = magnitude / ((size * size) / 100);

  return [magnitude * Math.cos(angle), magnitude * Math.sin(angle)];

};

Game.prototype.randomSize = function () {
  var x = Math.random();
  var a = 25;
  var b = 0.5;
  var c = 0.4;

  var size = a * Math.pow(Math.E, - (((x - b) * (x - b)) / (2 * (c * c))));

  return size;
};

module.exports = Game;
