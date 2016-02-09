var Util = require('./utils.js');
var Asteroid = require('./asteroid.js');

function FadingAsteroid(options) {
  this.step_num = 0;

  if (!options['color']) {
    options['color'] = "rgba(0,0,0," + this.step_num / this.UNTIL_GONE + ")";
  }

  Asteroid.call(this, options);
}

Util.prototype.inherits(FadingAsteroid, Asteroid);

FadingAsteroid.prototype.UNTIL_GONE = 100;

FadingAsteroid.prototype.move = function (dT) {
  this.step_num += 1;
  this.color = "rgba(0,0,0," +
    0.3 * (this.UNTIL_GONE - this.step_num)/this.UNTIL_GONE +
    ")";
  if (this.step_num >= this.UNTIL_GONE) {
    this.game.remove(this);
  } else {
    Asteroid.prototype.move.call(this, dT);
  }
};

module.exports = FadingAsteroid;
