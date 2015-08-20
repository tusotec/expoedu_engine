var keys = {"up": false, "down": false, "left": false, "right": false};
var keyscoll = {"up": false, "down": false, "left": false, "right": false};
var band = {"up": false, "down": false, "left": false, "right": false};

document.addEventListener('keydown', function (event) {
  switch (event.keyCode) {
    case 38:
    case 87: // W
      keys.up = true;
      keyscoll.up = true;
      keyscoll.down = keyscoll.left = keyscoll.right = false;
      break;
    case 37:
    case 65: // A
      keys.left = true;
      keyscoll.left = true;
      keyscoll.down = keyscoll.up = keyscoll.right = false;
      break;
    case 83:
    case 40: // S
      keys.down = true;
      keyscoll.down = true;
      keyscoll.up = keyscoll.left = keyscoll.right = false;
      break;
    case 68:
    case 39: // D
      keys.right = true;
      keyscoll.right = true;
      keyscoll.down = keyscoll.left = keyscoll.up = false;
      break;
  }
}, false);
document.addEventListener('keyup', function (event) {
  switch (event.keyCode) {
    case 38:
    case 87: // W
      keys.up = false;
      break;
    case 37:
    case 65: // A
      keys.left = false;
      break;
    case 83:
    case 40: // S
      keys.down = false;
      break;
    case 68:
    case 39: // D
      keys.right = false;
      break;
  }
}, false);

var mouse = {
  "dragging": false,
  "startX": 0, "startY": 0,
  "deltaX": 0, "deltaY": 0,
  "movedX": 0, "movedY": 0
};

function updateMouse () {
  mouse.deltaX = mouse.movedX;
  mouse.deltaY = mouse.movedY;
  mouse.startX += mouse.movedX;
  mouse.startY += mouse.movedY;
  mouse.movedX = 0;
  mouse.movedY = 0;
}
var mouseDown = function (event) {
  mouse.dragging = true;
  mouse.startX = event.clientX;
  mouse.startY = event.clientY;
}
var mouseUp = function (event) {
  mouse.dragging = false;
}
var mouseMove = function (event) {
  if (mouse.dragging) {
    mouse.movedX = event.clientX - mouse.startX;
    mouse.movedY = event.clientY - mouse.startY;
  }
}
document.addEventListener('mousedown', mouseDown, false );
document.addEventListener('mouseup', mouseUp, false );
document.addEventListener('mousemove', mouseMove, false );

document.addEventListener('mousedown', mouseDown, false );
document.addEventListener('mouseup', mouseUp, false );
document.addEventListener('mousemove', mouseMove, false );

window.CharacterController = function(params) {
  this.mesh = params.mesh;
  this.cam = params.cam;
  this.velocity = params.velocity || 1;
  this.distance = params.distance || 1;
  this.yAngle = params.camerAngle || 0; // Angulo en radianes.
  this.xAngle = 0;
  this.maxAngle = params.maxAngle || 1.4; // Aprox. PI/2
  this.xSensibility = params.xSensibility || 100;
  this.ySensibility = params.ySensibility || 100;
  this.characterAngle = 0;
  this.moveAngle = 0;

  this.updatePosition = function (delta) {
    if (delta == undefined) {delta = 1;}

    var x = 0, y = 0;
    if (keys.up && !band.up){y -= 1;}
    if (keys.down && !band.down){y += 1;}
    if (keys.left && !band.left){x -= 1;}
    if (keys.right && !band.right){x += 1;}

    if (x != 0 || y != 0) {
      // atan2: función trigonométrica para convertir coordenadas cartesianas
      // a angulos polares. En radianes.
      this.characterAngle = Math.atan2(x, y);
      var angle = this.characterAngle + this.yAngle;

      this.mesh.rotation.y = angle;

      // Mover al personaje en dirección a la que miramos.
      this.mesh.position.x += Math.sin(angle) * delta * this.velocity;
      this.mesh.position.z += Math.cos(angle) * delta * this.velocity;
    }
  };

  this.updateMouse = function () {
    if (mouse.dragging) {
      this.xAngle -= -mouse.movedY / this.ySensibility;
      this.yAngle -= mouse.movedX / this.xSensibility;
      if (this.yAngle > Math.PI) {this.yAngle -= Math.PI*2;}
      if (this.yAngle < Math.PI) {this.yAngle += Math.PI*2;}
      if (this.xAngle > this.maxAngle) {this.xAngle = this.maxAngle}
      if (this.xAngle < -this.maxAngle) {this.xAngle = -this.maxAngle}
      updateMouse();
    }
  };

  this.updateCamera = function () {
    var campos = this.cam.position;
    var center = this.mesh.position;

    var xDist = Math.cos(this.xAngle)*this.distance;
    var yDist = Math.sin(this.xAngle)*this.distance;

    campos.x = Math.sin(this.yAngle)*xDist + center.x;
    campos.y = center.y + yDist;
    campos.z = Math.cos(this.yAngle)*xDist + center.z;

    this.cam.lookAt(center);
  };
};