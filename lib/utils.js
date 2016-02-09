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
