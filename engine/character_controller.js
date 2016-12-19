var keyscoll = {"up": false, "down": false, "left": false, "right": false};
var band = {"up": false, "down": false, "left": false, "right": false};

/*function Vector = function (angle, magnitude) {
  this.angle = angle || 0;
  this.magnitude = magnitude || 0;
}

Vector.prototype = {
  angle: 0,
  magnitude: 0,
  setCartesianAngle: function (x, y) {
    this.angle = Math.atan2(x, y);
  },
  setCartesianMagnitude: function (x, y) {
    this.magnitude = Math.sqrt(x*x + y*y);
  }
}

var inputDirection = new Vector();*/

function clamp (x) {
  return x>1? 1 : (x<0? 0 : x);
}

function angleLerp (a, b, t) {
  t = clamp(t);
  var d = a-b;
  if (d >  Math.PI) {a -= Math.PI*2;}
  if (d < -Math.PI) {a += Math.PI*2;}
  return a + t*(b-a);
}

window.CharacterController = function(params) {
  this.mesh = params.mesh;
  this.cam = params.cam;
  this.animations = params.animations || null;
  this.velocity = params.velocity || 1;
  this.distance = params.distance || 1;
  this.yOff = params.yOff || 0;
  this.yAngle = params.camerAngle || 0; // Angulo en radianes.
  this.xAngle = 0;
  this.maxAngle = params.maxAngle || 1.4; // Aprox. PI/2
  this.xSensibility = params.xSensibility || 100;
  this.ySensibility = params.ySensibility || 100;
  this.characterAngle = 0;
  this.moveAngle = 0;
  this.inputAngle = 0;
  this.angleSmooth = params.angleSmooth || 5;
  this.moveSmooth = params.moveSmooth || 5;
  this.currentAnim = null;

  this.disableMovement = params.disableMovement || false;

  this.moveAmount = 0;
  var that = this;

  this.updatePosition = function (delta) {
    if (delta == undefined) {delta = 1;}

    var x = 0, y = 0;
    if (Input.keys.up && !band.up){y -= 1;}
    if (Input.keys.down && !band.down){y += 1;}
    if (Input.keys.left && !band.left){x -= 1;}
    if (Input.keys.right && !band.right){x += 1;}

    if (Input.joystick.touch.active) {
      x = Input.joystick.touch.x / Input.joystick.width;
      y = Input.joystick.touch.y / Input.joystick.height;
    }

    if (x != 0 || y != 0) {
      // atan2: función trigonométrica para convertir coordenadas cartesianas
      // a angulos polares. En radianes.
      this.inputAngle = Math.atan2(x, y);
      this.moveAngle = this.inputAngle + this.yAngle;
      var angle = angleLerp(this.characterAngle, this.moveAngle, delta*this.angleSmooth);
      this.characterAngle = angle;

      this.mesh.rotation.y = angle;
      this.moveAmount += delta * this.moveSmooth;
    } else if (this.moveAmount > 0) {
      this.moveAmount -= delta * this.moveSmooth;
    }

    if (this.moveAmount > 0) {
      this.moveAmount = clamp(this.moveAmount);
      // Mover al personaje en dirección a la que miramos.
      var speed = delta * this.velocity * this.moveAmount;
      this.mesh.position.x += Math.sin(this.characterAngle) * speed;
      this.mesh.position.z += Math.cos(this.characterAngle) * speed;
    }
  };

  this.updateMouse = function () {
    if (mouse.dragging) {
      this.xAngle -= -mouse.deltaY / this.ySensibility;
      this.yAngle -= mouse.deltaX / this.xSensibility;
      if (this.yAngle > Math.PI) {this.yAngle -= Math.PI*2;}
      if (this.yAngle < Math.PI) {this.yAngle += Math.PI*2;}
      if (this.xAngle > this.maxAngle) {this.xAngle = this.maxAngle}
      if (this.xAngle < -this.maxAngle) {this.xAngle = -this.maxAngle}
    }
  };

  this.updateCamera = function () {
    var campos = this.cam.position;
    var center = this.mesh.position.clone();
    center.y += this.yOff;

    var xDist = Math.cos(this.xAngle)*this.distance;
    var yDist = Math.sin(this.xAngle)*this.distance;

    campos.x = Math.sin(this.yAngle)*xDist + center.x;
    campos.y = center.y + yDist;
    campos.z = Math.cos(this.yAngle)*xDist + center.z;

    this.cam.lookAt(center);
  };

  this.updateAnimations = function (delta) {
    if (!this.animations) {return;}
    if (!this.currentAnim) {
      this.currentAnim = this.animations[0];
      this.currentAnim.play();
    }
    var fps = 24;
    //THREE.AnimationHandler.update(1);
  }

  this.update = function (delta) {
    that.updatePosition(delta);
    that.updateMouse();
    that.updateCamera();
    that.updateAnimations(delta);
  }
};