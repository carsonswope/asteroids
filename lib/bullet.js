var MovingObject = require('./movingObject.js');
var Util = require('./utils.js');
var Asteroid = require('./asteroid.js');
var FadingAsteroid = require('./fadingAsteroid.js');

function Bullet (options) {

    if (!options['radius']) {
      options['radius'] = 3;
    }
    if (!options['color']) {
      options['color'] = "#FF0000";
    }

    MovingObject.call(this, options);
}

Util.prototype.inherits(Bullet, MovingObject);

Bullet.prototype.BULLET_VELOCITY = 10;

Bullet.prototype.move = function () {
  this.pos[0] += this.vel[0];
  this.pos[1] += this.vel[1];

  if (this.game.isOutOfBounds(this.pos, this.radius)) {

    this.game.remove(this);
  }
};

Bullet.prototype.collideWith = function (otherObject) {
  if (otherObject.constructor.name === "Asteroid") {

    this.game.score += 1;

    var asteroidSize = otherObject.radius / 2;

    for (var i = 0; i < asteroidSize; i++) {
      var smoke = new FadingAsteroid({
          pos: otherObject.pos,
          game: this.game,
          radius: otherObject.radius / 1.5,
          vel: Util.prototype.angleMagnitudeToCartesian(
            Math.random() * 2 * Math.PI,
            Math.random()
          ),
          color: "rgba(0,0,0," + 0.3 + ")"
        }
      )

      this.game.asteroids.push(smoke);
    }



    this.game.remove(otherObject);
    // if (otherObject.radius > 15) {
    //   var radius = otherObject.radius - 5;
    //   this.game.asteroids.push(new Asteroid( {
    //     pos: otherObject.pos,
    //     game: this.game,
    //     radius: radius,
    //     vel: this.game.randomVelocity(radius * 2.5),
    //   } ));
    //   var radius2 = otherObject.radius - radius;
    //   this.game.asteroids.push(new Asteroid( {
    //     pos: otherObject.pos,
    //     game: this.game,
    //     radius: radius,
    //     vel: this.game.randomVelocity(radius * 1.5),
    //   } ));
    //
    // }
    this.game.remove(this);
  }
};

module.exports = Bullet;
