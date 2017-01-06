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

    if (Engine.Collidables === undefined) {
      console.warn("Character uses the Collision system, but it's not found");
    } else {
      this.playable = !!params.playable;

      this.radius = params.radius;
      var pos = new Collision.Vec(this.mesh.position.x, this.mesh.position.z);
      this.circle = new Collision.Circle(pos, this.radius);

      if (!this.playable) {
        Engine.Collidables.add(this.circle);
      }
    }

    var $this = this;
    Engine.onPreupdate(function (delta) { $this.update(delta) });
  };

  Character.prototype = {
    setPosition: function (pos) {
      if (this.circle === undefined) {
        this.mesh.position.set(pos.x, this.yPos, pos.y);
        return;
      }

      var circle = this.circle;
      circle.setxy(pos.x, pos.y);
      if (this.playable) {
        circle.collideWith(Engine.Collidables);
      }
      this.mesh.position.set(circle.p.x, this.yPos, circle.p.y);
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

      // Si hay un objetivo, cambiar gradualmente la dirección
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
      
      // Mover el personaje hacia la dirección
      if (this.direction.length == 0) return;
      var ndir = this.direction.clone();
      ndir.length *= this.velocity * delta;
      var prev = this.getPosition();
      var next = prev.plus(ndir.toCoord());
      this.setPosition(next);
    },
    remove: function () {
      Engine.scene.remove(this.mesh);
      Engine.Collidables.remove(this.circle);
    }
  };

  Engine.Character = Character;

//})();