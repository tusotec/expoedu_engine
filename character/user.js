//(function () {

var User = {
  init: function (params) {
    // Debe invocarse después del Motor.
    this.params = params;
    this.character = params.character;

    this.distance = params.distance || 1;
    this.yOff = params.yOff || 0;
    this.yAngle = params.camerAngle || 0; // Angulo en radianes.
    this.xAngle = 0;
    this.maxAngle = params.maxAngle || 1.4; // Aprox. PI/2
    this.xSensibility = params.xSensibility || 100;
    this.ySensibility = params.ySensibility || 100;

    var that = this;

    // No puedo hacer `Engine.onPreupdate(this.update)` porque cambiaría el `this`.
    Engine.onPreupdate(function (delta) {
      that.updateMouse();
      that.updateCamera();
      that.update(delta);
    });
  },
  updateMouse: function () {
    if (mouse.dragging) {
      this.xAngle -= -mouse.deltaY / this.ySensibility;
      this.yAngle -= mouse.deltaX / this.xSensibility;
      if (this.yAngle > Math.PI) {this.yAngle -= Math.PI*2;}
      if (this.yAngle < Math.PI) {this.yAngle += Math.PI*2;}
      if (this.xAngle > this.maxAngle) {this.xAngle = this.maxAngle}
      if (this.xAngle < -this.maxAngle) {this.xAngle = -this.maxAngle}
    }
  },
  updateCamera: function () {
    var campos = Engine.camera.position;
    var center = this.character.mesh.position.clone();
    center.y += this.yOff;

    var xDist = Math.cos(this.xAngle)*this.distance;
    var yDist = Math.sin(this.xAngle)*this.distance;

    campos.x = Math.sin(this.yAngle)*xDist + center.x;
    campos.y = center.y + yDist;
    campos.z = Math.cos(this.yAngle)*xDist + center.z;

    Engine.camera.lookAt(center);
  },
  update: function (delta) {
    var x = 0, y = 0;
    if (Input.keys.up){y -= 1;}
    if (Input.keys.down){y += 1;}
    if (Input.keys.left){x -= 1;}
    if (Input.keys.right){x += 1;}

    if (Input.joystick.touch.active) {
      x = Input.joystick.touch.x / Input.joystick.width;
      y = Input.joystick.touch.y / Input.joystick.height;
    }

    var coords = new Coord(x, y);
    var angle = coords.toAngle();
    if (angle.length > 0) {
      angle.angle += this.yAngle;
      angle.normalize();
      this.character.setDirection(angle);
    } else {
      this.character.stop();
    }
  }
};

Engine.User = User;

//})();