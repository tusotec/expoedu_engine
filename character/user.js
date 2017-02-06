(function () {

var User = {
  cameraColliders: [],
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

    this.zoomForce = params.zoomForce || 1;

    // Positivo es cerca, negativo es lejos
    this.zoom = 0;

    var that = this;

    Engine.onPreupdate(function (delta) {
      that.updateMouse();
      that.updateCamera();
      that.update(delta);
    });
  },
  updateMouse: function () {
    var mouse = Input.mouseDrag;
    if (mouse.dragging) {
      this.xAngle -= -mouse.deltaY / this.ySensibility;
      this.yAngle -= mouse.deltaX / this.xSensibility;
      if (this.yAngle > Math.PI) {this.yAngle -= Math.PI*2;}
      if (this.yAngle < Math.PI) {this.yAngle += Math.PI*2;}
      if (this.xAngle > this.maxAngle) {this.xAngle = this.maxAngle}
      if (this.xAngle < -this.maxAngle) {this.xAngle = -this.maxAngle}
    }
    if (Input.zoom.delta != 0) {
      this.zoom += Input.zoom.delta;
    }
  },
  updateCamera: function () {
    // TODO: Simplificar y reducir esta función,
    // es muy larga y el algoritmo es muy complicado

    var campos = Engine.camera.position;
    var center = this.character.mesh.position.clone();
    center.y += this.yOff;

    var distance = this.distance * Math.pow(this.zoomForce+1, -this.zoom);

    var dx = Math.sin(this.yAngle);
    var dz = Math.cos(this.yAngle);
    var dy = Math.sin(this.xAngle);

    var direction = new THREE.Vector3(dx, dy, dz).normalize();

    // Posición tentativa de la cámaradd.
    var newpos = center.clone().add(
      direction.clone().multiplyScalar(distance)
    );

    // Rayo hacia la cámara
    var ray = new THREE.Raycaster(center, direction, 0, distance);
    // Rayo desde la cámara
    var rayback = new THREE.Raycaster(newpos, direction.clone().negate(), 0, distance);

    // Obstrucciones del centro a la cámara
    var cenpts = ray.intersectObjects(this.cameraColliders, true);
    // Obstrucciones de la cámara al centro
    var campts = rayback.intersectObjects(this.cameraColliders, true);

    // Punto más cercano a la cámara.
    var tocam, closest;
    function getClosest () {
      closest = null;

      // Punto con normal hacia la cámara
      var ptcam = campts.length > 0 ? campts[0] : null;

      // Punto con normal hacia el centro
      var ptcen = cenpts.length > 0 ? cenpts[cenpts.length-1] : null;

      // Si ambos puntos existen
      if (ptcam && ptcen) {
        // Distancias hasta la cámara
        var dst1 = ptcam.distance;
        var dst2 = distance - ptcen.distance;

        // Cuando un objeto es una cara con ambos lados visibles, ambos
        // puntos están a la misma distancia, en ese caso tiene prioridad el
        // punto que apunta a la cámara, para que se comporte como un objeto

        // Pero desafortunadamente en ese caso casi nunca son iguales, por lo
        // de la precisión de coma flotante, sino están muuy cerca. Por eso
        // tengo que usar la diferencia en vez de el valor exacto

        var dif = dst2 - dst1;
        // [dif > 0] => [dst2 > dst1]
        if (dif > -0.1) { closest = ptcam; }
        else { closest = ptcen; }
      }
      else if (ptcam) { closest = ptcam; }
      else if (ptcen) { closest = ptcen; }
      else { closest = null; return false; }

      if (closest === ptcam) { campts.shift(); }
      if (closest === ptcen) { cenpts.pop(); }
      tocam = (closest === ptcam);
      return true;
    }

    var newdist = distance;

    var count = 0;
    while (getClosest()) {
      if (!tocam) {
        // El punto con normal apuntando al centro.
        // La cámara está dentro de un objeto.

        // Empujarla hacia afuera

        // pt2.distance: el rayo fue lanzado desde el centro, esta es la
        //   distancia hasta el centro
        // 0.1: acercar la cámara 10cm hacia el centro
        newdist = closest.distance - 0.1;

      } else {
        // El punto con normal apuntando a la cámara.
        // Hay un objeto obstaculizando.

        // Distancia desde el objeto hasta el centro

        // Como el rayo fue lanzado desde la cámara, la distancia
        // hasta el centro es el número inverso
        var dst = distance - closest.distance;

        // Si el objeto está lejos suficiente de la cámara (más de un metro)
        if (newdist - dst > 1) {
          // Entonces esta posición está bien, terminar el algoritmo
          break;
        }
        // Si no, ignorar este punto y continuar, así parece que
        // la cámara está en un objeto y lo atraviesa.
      }
    }

    // Mover la cámara
    var newpos = center.clone().add(
      direction.clone().multiplyScalar(newdist)
    );

    campos.copy(newpos);
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

window.Engine.User = User;

})();