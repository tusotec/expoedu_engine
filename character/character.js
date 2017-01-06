//(function () {

//=== Basic Character ===//
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

    this.smoothness = params.smoothness || 5;

    var $this = this;
    Engine.onPreupdate(function (delta) { $this.update(delta) });
  };

  Character.prototype = {
    setPosition: function (pos) {
      this.mesh.position.set(pos.x, this.yPos, pos.y);
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
    updateMove: function (delta) {
      if (this.direction.length == 0) return;
      var ndir = this.direction.clone();
      ndir.length *= this.velocity * delta;
      var prev = this.getPosition();
      var next = prev.plus(ndir.toCoord());
      this.setPosition(next);
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
      this.updateMove(delta);
    },
    remove: function () {
      Engine.scene.remove(this.mesh);
    }
  };

  Engine.Character = Character;

//=== Physic Character ===//
  PhysicCharacter = function (params) {
    Character.call(this, params);

    this.radius = params.radius || 1;

    if (!Engine.Physics) {
      console.error("Engine Physics Required");
      return;
    }

    var type = (params.type==PhysicCharacter.DYNAMIC) ?
      CANNON.Body.DYNAMIC : CANNON.Body.KINEMATIC;

    var shape = new CANNON.Cylinder(this.radius, this.radius, this.height, 8);
    this.body = new CANNON.Body({mass: 1, type: type});
    this.body.addShape(shape);
    this.body.fixedRotation = true;
    Engine.Physics.world.add(this.body);
  }

  PhysicCharacter.prototype = Object.create(Character.prototype);

  PhysicCharacter.prototype.setPosition = function (pos) {
    this.body.position.set(pos.x, this.yPos, pos.y);
  }

  PhysicCharacter.prototype.updateMove = function (pos) {
    var vel = this.direction.toCoord();
    this.body.velocity.set(vel.x, 0, vel.y);
    this.body.position.y = 0;
    this.mesh.position.copy(this.body.position);
  }

  PhysicCharacter.DYNAMIC = 0; // Reacciona a fuerzas y a colisiones
  PhysicCharacter.KINEMATIC = 1; // Reacciona a fuerzas pero no a colisiones

  Engine.PhysicCharacter = PhysicCharacter;

//=== Collision Character ===//

  CollisionCharacter = function (params) {
    Character.call(this, params);

    this.radius = params.radius;

    this.manual = (params.type != CollisionCharacter.STATIC);

    var pos = new Collision.Vec(this.mesh.position.x, this.mesh.position.z);
    this.circle = new Collision.Circle(pos, this.radius);

    if (!this.manual) {
      Engine.Collidables.add(this.circle);
    }
  }

  CollisionCharacter.prototype = Object.create(Character.prototype);

  CollisionCharacter.prototype.setPosition = function (pos) {
    var circle = this.circle;
    circle.setxy(pos.x, pos.y);
    if (this.manual) {
      circle.collideWith(Engine.Collidables);
      this.mesh.position.set(circle.p.x, this.yPos, circle.p.y);
    } else {
      this.mesh.position.set(pos.x, this.yPos, pos.y);
    }
  }

  CollisionCharacter.prototype.remove = function () {
    Character.prototype.remove.call(this);
    Engine.Collidables.remove(this.circle);
  }

  CollisionCharacter.MANUAL = 0; // Movido por el usuario
  CollisionCharacter.STATIC = 1; // No Movido por el usuario

  Engine.CollisionCharacter = CollisionCharacter;

//})();