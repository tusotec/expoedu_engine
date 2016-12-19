//(function () {

Character = function (params) {
  this.params = params;
  this.mesh = params.mesh;
  this.velocity = params.velocity || 1; // metros por segundo

  this.direction = new Angle(0,0);

  var that = this;

  // No puedo hacer `Engine.onPreupdate(this.update)` porque cambiaría el `this`.
  Engine.onPreupdate(function (delta) {
    that.update(delta);
  });
};

Character.prototype = {
  setPosition: function (pos) {
    this.mesh.position.x = pos.x;
    this.mesh.position.z = pos.y;
  },
  getPosition: function () {
    return new Coord(
      this.mesh.position.x,
      this.mesh.position.z
    );
  },
  moveTo: function (pos) {
    this.setPosition(pos);
  },
  setDirection: function (angle) {
    this.direction = angle;
    this.mesh.rotation.y = angle.angle;
  },
  update: function (delta) {
    if (this.direction.length == 0) return;
    var ndir = this.direction.clone();
    ndir.length *= this.velocity * delta;
    var prev = this.getPosition();
    var next = prev.plus(ndir.toCoord());
    this.moveTo(next);
  }
};

Engine.Character = Character;

//})();