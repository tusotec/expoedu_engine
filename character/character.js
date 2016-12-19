//(function () {

Character = function (params) {
  this.params = params;
  this.mesh = params.mesh;
  this.velocity = params.velocity || 1; // metros por segundo
  this.yPos = params.yPos || 0;

  this.direction = new Angle(0,0);
  this.nextDirection = null;
  this.target = null;

  this.height = params.height || 1;
  this.width = params.width || 0.5;
  // Por defecto se usa MANUAL
  if ((params.type == Character.KINEMATIC ||
      params.type == Character.DYNAMIC) && Engine.Physics) {
    this.physics = true;

    var shape = new CANNON.Cylinder(this.radius, this.radius, this.height, 8);
    this.body = new CANNON.Body({mass: 1});
    this.body.addShape(shape);
    this.body.fixedRotation = true;
    Engine.Physics.world.add(this.body);
  } else { this.physics = false; }

  this.smoothness = params.smoothness || 5;

  var that = this;
  Engine.onPreupdate(function (delta) { that.update(delta) });
};

Character.MANUAL = 0; // No usa física, así que no reacciona a nada
Character.DYNAMIC = 1; // Reacciona a fuerzas y a colisiones
Character.KINEMATIC = 2; // Reacciona a fuerzas pero no a colisiones

Character.prototype = {
  setPosition: function (pos) {
    if (this.physics) {
      this.body.position.set(pos.x, this.yPos, pos.y);
    } else {
      this.mesh.position.set(pos.x, this.yPos, pos.y);
    }
  },
  getPosition: function () {
    return new Coord(
      this.mesh.position.x,
      this.mesh.position.z
    );
  },
  moveTo: function (pos) {
    this.target = pos;
    //this.setPosition(pos);
  },
  setDirection: function (angle) {
    //this.direction = angle;
    this.target = null;
    this.nextDirection = angle;
    //this.mesh.rotation.y = angle.angle;
  },
  stop: function () {
    if (this.direction.length > 0) {
      this.setDirection(new Angle(this.direction.angle, 0));
    }
  },
  update: function (delta) {
    if (this.target) {
      var dir = this.target.minus(this.getPosition());
      var angle = dir.toAngle();
      if (angle.length > 0.1) {
        angle.length *= 2;
        if (angle.length > 1) {angle.length = 1;}
        this.nextDirection = angle;
      } else {
        this.stop();
        this.target = null;
      }
    }
    if (this.nextDirection) {
      this.direction = Angle.lerp(this.direction, this.nextDirection, delta*this.smoothness);
      this.mesh.rotation.y = this.direction.angle;
      if (this.direction.angle - this.nextDirection.angle < 0.01 &&
          this.direction.length - this.nextDirection.length < 0.01) {
        this.nextDirection = null;
      }
    }
    if (this.physics) {
      var vel = this.direction.toCoord();
      this.body.velocity.set(vel.x, 0, vel.y);
      this.body.position.y = 0;
      this.mesh.position.copy(this.body.position);
    } else {
      if (this.direction.length == 0) return;
      var ndir = this.direction.clone();
      ndir.length *= this.velocity * delta;
      var prev = this.getPosition();
      var next = prev.plus(ndir.toCoord());
      this.setPosition(next);
    }
  }
};

Engine.Character = Character;

//})();