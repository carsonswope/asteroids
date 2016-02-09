// var Ship = require('./ship.js');

function MovingObject(options) {
  this.pos = options['pos'];
  this.vel = options['vel'];
  this.radius = options['radius'];
  this.color = options['color'];
  this.game = options['game'];
}

MovingObject.prototype.draw = function(ctx) {
  ctx.fillStyle = this.color;
  ctx.beginPath();

  ctx.arc(
    this.pos[0],
    this.pos[1],
    this.radius,
    0,
    2 * Math.PI,
    false
  );

  ctx.fill();
};

MovingObject.prototype.move = function(dT) {
  // debugger
  // if (!dT) { dT = 20; }
  this.pos[0] += this.vel[0] * dT / 20;
  this.pos[1] += this.vel[1] * dT / 20;

  this.pos = this.game.wrap([this.pos[0], this.pos[1]], this);
};

MovingObject.prototype.isCollidedWithOtherObject = function (otherObject) {
  return otherObject.radius + this.radius >
         this.distance(this.pos, otherObject.pos);
};


MovingObject.prototype.collideWith = function (otherObject) {

};

MovingObject.prototype.distance = function (pos1, pos2) {
  return Math.sqrt(
    Math.pow((pos1[0] - pos2[0]), 2) + Math.pow((pos1[1] - pos2[1]), 2)
  );
};



module.exports = MovingObject;
