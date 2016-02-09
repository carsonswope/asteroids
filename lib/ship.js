var Util = require('./utils.js');
var MovingObject = require('./movingObject.js');
var Game = require('./game.js');
var Bullet = require('./bullet.js');

function Ship (options) {
  if (!options['radius']) {
    options['radius'] = 10;
  }
  if (!options['vel']) {
    options['vel'] = [0,0];
  }
  if (!options['color']) {
    options['color'] = "#0000FF";
  }
  this.angle = 0;

  MovingObject.call(this, options);
}

Util.prototype.inherits(Ship, MovingObject);

Ship.prototype.draw = function (ctx) {
  ctx.fillStyle = this.color;
  ctx.beginPath();

  ctx.arc(
    this.pos[0],
    this.pos[1],
    this.radius,
    this.angle + 1.2 *  Math.PI,
    this.angle + 0.8 * Math.PI,
    false
  );

  ctx.lineTo(
    this.pos[0],
    this.pos[1]
  );


  ctx.fill();


};

Ship.prototype.MAX_VELOCITY = 10;
Ship.prototype.relocate = function () {
  this.pos = this.game.randomPosition();
  this.vel = [0,0];
};

Ship.prototype.power = function (impulse) {
  var xVel = impulse * Math.cos(this.angle) + this.vel[0];
  var yVel = impulse * Math.sin(this.angle) + this.vel[1];

  this.vel = [
    xVel > this.MAX_VELOCITY ? this.MAX_VELOCITY : xVel,
    yVel > this.MAX_VELOCITY ? this.MAX_VELOCITY : yVel
  ];

};

Ship.prototype.turn = function (angle) {
  this.angle += angle;
};

Ship.prototype.move = function (dT) {
  var magnitude = this.extractMagnitude(this.vel) * 0.99;

  var angle = Util.prototype.extractAngle(this.vel);

  this.vel = Util.prototype.angleMagnitudeToCartesian(angle, magnitude);

  MovingObject.prototype.move.call(this, dT);
};


Ship.prototype.fireBullet = function () {
  // debugger;
  var bulletAng = this.angle;
  var offset = Util.prototype.angleMagnitudeToCartesian(this.angle,this.radius);

  var bullet = new Bullet({
    vel: Util.prototype.angleMagnitudeToCartesian(bulletAng, Bullet.prototype.BULLET_VELOCITY),
    pos: [this.pos[0] + offset[0], this.pos[1] + offset[1]],
    game: this.game
  });


  this.game.bullets.push(bullet);
};

// Ship.prototype.angToCartesian = function (angle, magnitude) {
//   return [magnitude * Math.cos(angle), magnitude * Math.sin(angle)];
// };

Ship.prototype.extractMagnitude = function (vector) {
    var xVel = vector[0];
    var yVel = vector[1];

    return Math.sqrt(xVel * xVel + yVel * yVel);
};


module.exports = Ship;
