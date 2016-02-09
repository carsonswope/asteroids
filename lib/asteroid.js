var Util = require('./utils.js');
var MovingObject = require('./movingObject.js');
// var Ship = require('./ship.js');

function Asteroid(options) {
  if (!options['color']) {
    options['color'] = this.COLOR;
  }
  if (!options['radius']) {
    options['radius'] = this.RADIUS;
  }
  if (!options['vel']) {
    options['vel'] = [0, this.VELOCITY];
  }

  MovingObject.call(this, options);
}

Util.prototype.inherits(Asteroid, MovingObject);

Asteroid.prototype.collideWith = function(otherObject) {
  if (otherObject.constructor.name === "Ship" && this.constructor.name === "Asteroid") {
    this.game.lives -= 1;
    if (this.game.lives == 0) {
      this.game.over = true;
    } else {
      otherObject.relocate();
    }
  }
};

// Asteroid.prototype.COLOR = "#000000";
Asteroid.prototype.COLOR = "rgba(0,0,0,1)";
Asteroid.prototype.RADIUS = 10;
Asteroid.prototype.VELOCITY = 5;

module.exports = Asteroid;
