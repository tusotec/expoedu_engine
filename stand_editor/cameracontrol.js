var Control = {}

Control.init = function (params) {
  Control.xAngle = params.xAngle || 0;
  Control.yAngle = params.yAngle || 0;
  Control.distance = params.distance || 5;
  Control.offset = params.offset || new THREE.Vector3();
  if (params.yOffset) { Control.offset.y = params.yOffset; }
  Control.xSensibility = params.xSensibility || 100;
  Control.ySensibility = params.ySensibility || 100;
}

Control.update = function (delta) {
  if (mouse.dragging) {
    Control.xAngle -= -mouse.deltaY / Control.ySensibility;
    Control.yAngle -= mouse.deltaX / Control.xSensibility;
    if (Control.yAngle > Math.PI) {Control.yAngle -= Math.PI*2;}
    if (Control.yAngle < Math.PI) {Control.yAngle += Math.PI*2;}
    if (Control.xAngle > Control.maxAngle) {Control.xAngle = Control.maxAngle}
    if (Control.xAngle < -Control.maxAngle) {Control.xAngle = -Control.maxAngle}
  }

  var campos = Engine.camera.position;
  var center = new THREE.Vector3();
  center.y += Control.offset.y;

  var xDist = Math.cos(Control.xAngle)*Control.distance;
  var yDist = Math.sin(Control.xAngle)*Control.distance;

  campos.x = Math.sin(Control.yAngle)*xDist + center.x;
  campos.y = center.y + yDist;
  campos.z = Math.cos(Control.yAngle)*xDist + center.z;

  Engine.camera.lookAt(center);
}

Engine.CameraControl = Control;