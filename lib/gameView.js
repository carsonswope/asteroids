var Game = require('./game.js');
var key = require('./keymaster.js');
var Asteroid = require('./asteroid.js');

function GameView(game, ctx) {
    this.game = game;
    this.ctx = ctx;
}

GameView.prototype.start = function () {
  this.setupKeys();
  var view = this;
  var time = 0;
  var dT = 0;

  var step = function (newTime) {
    dT = newTime - time;
    time = newTime;
    // debugger
//
    view.checkKeys(dT);

    if (Math.random() > 0.95 && view.game.asteroids.length < 24) {
      var rad = view.game.randomSize();
      var pos = view.game.randomPosition();

      var i = Math.random();
      if (i < 0.25) {
        pos[0] = -rad;
      } else if (i < 0.50) {
        pos[1] = -rad;
      } else if (i < 0.75) {
        pos[0] = view.game.DIM_X+rad;
      } else {
        pos[1] = view.game.DIM_Y+rad;
      }
      // debugger;
      view.game.asteroids.push( new Asteroid({

        pos: pos,
        game: view.game,
        radius: rad,
        vel: view.game.randomVelocity(rad)

      }));
    }

    view.game.moveObjects(dT);
    view.game.checkCollisions();
    debugger;
    view.game.draw(view.ctx);

    if (view.game.lives > 0) {
      requestAnimationFrame(step);
    } else {
      view.ctx.fillText("game over", 100,100);
    }

  };

  requestAnimationFrame(step);
};

GameView.prototype.checkKeys = function (dT) {
  if (key.isPressed('left')) {
    this.game.ship.turn(dT * -Math.PI/360);
  }
  if (key.isPressed('right')) {
    this.game.ship.turn(dT * Math.PI/360);
  }

  if (key.isPressed('up')) {
    this.game.ship.power(dT / 150);
  }
};

GameView.prototype.setupKeys = function () {
  var ship = this.game.ship;
  // key('left',function () {
  //   ship.turn(-Math.PI/4);
  // });
  // key('right', function () {
  //   ship.turn(Math.PI/4);
  // });
  // key('up', function() {
  //   ship.power(1);
  // });
  key('space', function () {
    ship.fireBullet();
  });
};

module.exports = GameView;
