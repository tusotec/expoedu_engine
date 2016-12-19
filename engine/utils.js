var Coord = function (x,y) {
  this.x = x;
  this.y = y;
};

Coord.prototype.distance = function (other) {
  var a = this.x - other.x;
  var b = this.y - other.y;
  return Math.sqrt(a*a + b*b);
};
Coord.prototype.clone = function () {
  return new Coord(this.x, this.y);
};
Coord.prototype.copy = function (other) {
  this.x = other.x;
  this.y = other.y;
};
Coord.prototype.plus = function (other) {
  return new Coord(this.x + other.x, this.y + other.y);
}
Coord.prototype.minus = function (other) {
  return new Coord(this.x - other.x, this.y - other.y);
}
Coord.prototype.add = function (other) {
  this.x += other.x;
  this.y += other.y;
}
Coord.prototype.toAngle = function () {
  var angle = Math.atan2(this.x, this.y);
  var length = Math.sqrt(this.x*this.x + this.y*this.y);
  return new Angle(angle, length);
}

var Angle = function (angle, length) {
  this.angle = angle;
  this.length = (length==undefined)? 1 : length;
}
Angle.prototype.clone = function () { return new Angle(this.angle, this.length); }
Angle.prototype.normalize = function () {
  if (this.length > 0) { this.length = 1; }
}
Angle.prototype.normalized = function () { return this.clone().normalize(); }
Angle.prototype.toCoord = function () {
  var x = Math.sin(this.angle) * this.length;
  var y = Math.cos(this.angle) * this.length;
  return new Coord(x, y);
}
Angle.lerp = function (a, b, t) {
  t = t>1? 1 : (t<0? 0 : t); // Clamp01
  function lerp (a, b) {return a + t*(b-a)}
  function anglerp (a, b) {
    var d = a-b;
    if (d >  Math.PI) {a -= Math.PI*2;}
    if (d < -Math.PI) {a += Math.PI*2;}
    return lerp(a,b);
  }
  return new Angle(
    anglerp(a.angle, b.angle),
    lerp(a.length, b.length)
  );
}