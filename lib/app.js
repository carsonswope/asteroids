var MovingObject = require('./movingObject');
var Util = require('./utils');
var Asteroid = require('./asteroid.js');
// var Ship = require('./ship.js');
var Game = require('./game.js');
var GameView = require('./gameView.js');

var canvasEl = document.getElementsByTagName("canvas")[0];

var g = new Game();

g.DIM_Y = window.innerHeight-25;
g.DIM_X = window.innerWidth-15;

canvasEl.height = g.DIM_Y;
canvasEl.width = g.DIM_X;

var ctx = canvasEl.getContext("2d");

g.addAsteroids();
g.addShip();

var gv = new GameView(g, ctx);
// m.draw(ctx);
// console.log(a);
// a.draw(ctx);
gv.start();
