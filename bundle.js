/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var MovingObject = __webpack_require__(1);
	var Util = __webpack_require__(2);
	var Asteroid = __webpack_require__(3);
	// var Ship = require('./ship.js');
	var Game = __webpack_require__(4);
	var GameView = __webpack_require__(7);

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


/***/ },
/* 1 */
/***/ function(module, exports) {

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


/***/ },
/* 2 */
/***/ function(module, exports) {

	function Util() {

	}

	Util.prototype.inherits = function (childClass, superClass) {
	  function Surrogate(){ }
	  Surrogate.prototype = superClass.prototype;

	  childClass.prototype = new Surrogate();
	  childClass.prototype.constructor = childClass;
	};

	Util.prototype.multiplyVector = function(vector, magnitude) {

	};

	Util.prototype.angleMagnitudeToCartesian = function (angle, magnitude) {
	  return [magnitude * Math.cos(angle), magnitude * Math.sin(angle)];
	};

	Util.prototype.extractAngle = function(vector) {

	  var xVel = vector[0];
	  var yVel = vector[1];
	  var angle = Math.atan2(yVel, xVel);
	  if (xVel === 0) {
	    if (yVel > 0) {
	      angle = 1.5 * Math.PI;
	    } else {
	      angle = 0.5 * Math.PI;
	    }
	  }
	  return angle;

	}

	module.exports = Util;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(2);
	var MovingObject = __webpack_require__(1);
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


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Asteroid = __webpack_require__(3);
	var Ship = __webpack_require__(5);

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


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(2);
	var MovingObject = __webpack_require__(1);
	var Game = __webpack_require__(4);
	var Bullet = __webpack_require__(6);

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


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var MovingObject = __webpack_require__(1);
	var Util = __webpack_require__(2);
	var Asteroid = __webpack_require__(3);
	var FadingAsteroid = __webpack_require__(9);

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


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(4);
	var key = __webpack_require__(8);
	var Asteroid = __webpack_require__(3);

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


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	//     keymaster.js
	//     (c) 2011-2013 Thomas Fuchs
	//     keymaster.js may be freely distributed under the MIT license.

	;(function(global){
	  var k,
	    _handlers = {},
	    _mods = { 16: false, 18: false, 17: false, 91: false },
	    _scope = 'all',
	    // modifier keys
	    _MODIFIERS = {
	      '⇧': 16, shift: 16,
	      '⌥': 18, alt: 18, option: 18,
	      '⌃': 17, ctrl: 17, control: 17,
	      '⌘': 91, command: 91
	    },
	    // special keys
	    _MAP = {
	      backspace: 8, tab: 9, clear: 12,
	      enter: 13, 'return': 13,
	      esc: 27, escape: 27, space: 32,
	      left: 37, up: 38,
	      right: 39, down: 40,
	      del: 46, 'delete': 46,
	      home: 36, end: 35,
	      pageup: 33, pagedown: 34,
	      ',': 188, '.': 190, '/': 191,
	      '`': 192, '-': 189, '=': 187,
	      ';': 186, '\'': 222,
	      '[': 219, ']': 221, '\\': 220
	    },
	    code = function(x){
	      return _MAP[x] || x.toUpperCase().charCodeAt(0);
	    },
	    _downKeys = [];

	  for(k=1;k<20;k++) _MAP['f'+k] = 111+k;

	  // IE doesn't support Array#indexOf, so have a simple replacement
	  function index(array, item){
	    var i = array.length;
	    while(i--) if(array[i]===item) return i;
	    return -1;
	  }

	  // for comparing mods before unassignment
	  function compareArray(a1, a2) {
	    if (a1.length != a2.length) return false;
	    for (var i = 0; i < a1.length; i++) {
	        if (a1[i] !== a2[i]) return false;
	    }
	    return true;
	  }

	  var modifierMap = {
	      16:'shiftKey',
	      18:'altKey',
	      17:'ctrlKey',
	      91:'metaKey'
	  };
	  function updateModifierKey(event) {
	      for(k in _mods) _mods[k] = event[modifierMap[k]];
	  };

	  // handle keydown event
	  function dispatch(event) {
	    var key, handler, k, i, modifiersMatch, scope;
	    key = event.keyCode;

	    if (index(_downKeys, key) == -1) {
	        _downKeys.push(key);
	    }

	    // if a modifier key, set the key.<modifierkeyname> property to true and return
	    if(key == 93 || key == 224) key = 91; // right command on webkit, command on Gecko
	    if(key in _mods) {
	      _mods[key] = true;
	      // 'assignKey' from inside this closure is exported to window.key
	      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = true;
	      return;
	    }
	    updateModifierKey(event);

	    // see if we need to ignore the keypress (filter() can can be overridden)
	    // by default ignore key presses if a select, textarea, or input is focused
	    if(!assignKey.filter.call(this, event)) return;

	    // abort if no potentially matching shortcuts found
	    if (!(key in _handlers)) return;

	    scope = getScope();

	    // for each potential shortcut
	    for (i = 0; i < _handlers[key].length; i++) {
	      handler = _handlers[key][i];

	      // see if it's in the current scope
	      if(handler.scope == scope || handler.scope == 'all'){
	        // check if modifiers match if any
	        modifiersMatch = handler.mods.length > 0;
	        for(k in _mods)
	          if((!_mods[k] && index(handler.mods, +k) > -1) ||
	            (_mods[k] && index(handler.mods, +k) == -1)) modifiersMatch = false;
	        // call the handler and stop the event if neccessary
	        if((handler.mods.length == 0 && !_mods[16] && !_mods[18] && !_mods[17] && !_mods[91]) || modifiersMatch){
	          if(handler.method(event, handler)===false){
	            if(event.preventDefault) event.preventDefault();
	              else event.returnValue = false;
	            if(event.stopPropagation) event.stopPropagation();
	            if(event.cancelBubble) event.cancelBubble = true;
	          }
	        }
	      }
	    }
	  };

	  // unset modifier keys on keyup
	  function clearModifier(event){
	    var key = event.keyCode, k,
	        i = index(_downKeys, key);

	    // remove key from _downKeys
	    if (i >= 0) {
	        _downKeys.splice(i, 1);
	    }

	    if(key == 93 || key == 224) key = 91;
	    if(key in _mods) {
	      _mods[key] = false;
	      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = false;
	    }
	  };

	  function resetModifiers() {
	    for(k in _mods) _mods[k] = false;
	    for(k in _MODIFIERS) assignKey[k] = false;
	  };

	  // parse and assign shortcut
	  function assignKey(key, scope, method){
	    var keys, mods;
	    keys = getKeys(key);
	    if (method === undefined) {
	      method = scope;
	      scope = 'all';
	    }

	    // for each shortcut
	    for (var i = 0; i < keys.length; i++) {
	      // set modifier keys if any
	      mods = [];
	      key = keys[i].split('+');
	      if (key.length > 1){
	        mods = getMods(key);
	        key = [key[key.length-1]];
	      }
	      // convert to keycode and...
	      key = key[0]
	      key = code(key);
	      // ...store handler
	      if (!(key in _handlers)) _handlers[key] = [];
	      _handlers[key].push({ shortcut: keys[i], scope: scope, method: method, key: keys[i], mods: mods });
	    }
	  };

	  // unbind all handlers for given key in current scope
	  function unbindKey(key, scope) {
	    var multipleKeys, keys,
	      mods = [],
	      i, j, obj;

	    multipleKeys = getKeys(key);

	    for (j = 0; j < multipleKeys.length; j++) {
	      keys = multipleKeys[j].split('+');

	      if (keys.length > 1) {
	        mods = getMods(keys);
	      }

	      key = keys[keys.length - 1];
	      key = code(key);

	      if (scope === undefined) {
	        scope = getScope();
	      }
	      if (!_handlers[key]) {
	        return;
	      }
	      for (i = 0; i < _handlers[key].length; i++) {
	        obj = _handlers[key][i];
	        // only clear handlers if correct scope and mods match
	        if (obj.scope === scope && compareArray(obj.mods, mods)) {
	          _handlers[key][i] = {};
	        }
	      }
	    }
	  };

	  // Returns true if the key with code 'keyCode' is currently down
	  // Converts strings into key codes.
	  function isPressed(keyCode) {
	      if (typeof(keyCode)=='string') {
	        keyCode = code(keyCode);
	      }
	      return index(_downKeys, keyCode) != -1;
	  }

	  function getPressedKeyCodes() {
	      return _downKeys.slice(0);
	  }

	  function filter(event){
	    var tagName = (event.target || event.srcElement).tagName;
	    // ignore keypressed in any elements that support keyboard data input
	    return !(tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA');
	  }

	  // initialize key.<modifier> to false
	  for(k in _MODIFIERS) assignKey[k] = false;

	  // set current scope (default 'all')
	  function setScope(scope){ _scope = scope || 'all' };
	  function getScope(){ return _scope || 'all' };

	  // delete all handlers for a given scope
	  function deleteScope(scope){
	    var key, handlers, i;

	    for (key in _handlers) {
	      handlers = _handlers[key];
	      for (i = 0; i < handlers.length; ) {
	        if (handlers[i].scope === scope) handlers.splice(i, 1);
	        else i++;
	      }
	    }
	  };

	  // abstract key logic for assign and unassign
	  function getKeys(key) {
	    var keys;
	    key = key.replace(/\s/g, '');
	    keys = key.split(',');
	    if ((keys[keys.length - 1]) == '') {
	      keys[keys.length - 2] += ',';
	    }
	    return keys;
	  }

	  // abstract mods logic for assign and unassign
	  function getMods(key) {
	    var mods = key.slice(0, key.length - 1);
	    for (var mi = 0; mi < mods.length; mi++)
	    mods[mi] = _MODIFIERS[mods[mi]];
	    return mods;
	  }

	  // cross-browser events
	  function addEvent(object, event, method) {
	    if (object.addEventListener)
	      object.addEventListener(event, method, false);
	    else if(object.attachEvent)
	      object.attachEvent('on'+event, function(){ method(window.event) });
	  };

	  // set the handlers globally on document
	  addEvent(document, 'keydown', function(event) { dispatch(event) }); // Passing _scope to a callback to ensure it remains the same by execution. Fixes #48
	  addEvent(document, 'keyup', clearModifier);

	  // reset modifiers to false whenever the window is (re)focused.
	  addEvent(window, 'focus', resetModifiers);

	  // store previously defined key
	  var previousKey = global.key;

	  // restore previously defined key and return reference to our key object
	  function noConflict() {
	    var k = global.key;
	    global.key = previousKey;
	    return k;
	  }

	  // set window.key and window.key.set/get/deleteScope, and the default filter
	  global.key = assignKey;
	  global.key.setScope = setScope;
	  global.key.getScope = getScope;
	  global.key.deleteScope = deleteScope;
	  global.key.filter = filter;
	  global.key.isPressed = isPressed;
	  global.key.getPressedKeyCodes = getPressedKeyCodes;
	  global.key.noConflict = noConflict;
	  global.key.unbind = unbindKey;

	  if(true) module.exports = assignKey;

	})(this);


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(2);
	var Asteroid = __webpack_require__(3);

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


/***/ }
/******/ ]);