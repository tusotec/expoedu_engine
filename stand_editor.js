//(function () {
  window.Editor = {
    container: null,
    stand: null,
    material: new THREE.MeshPhongMaterial(),
    _onclick: function ()  {/* do nothing */},
    _onselect: function () {/* do nothing */},
    regions: []
  };
  Editor.loadJson = function (url) {
    if (Editor.stand) {
      Engine.scene.remove(Editor.stand);
    }
    Engine.loader.load(url, function (obj, mats) {
      var mesh = new THREE.Mesh(obj, Editor.material);
      Editor.stand = mesh;
      Engine.scene.add(mesh);
    });
  }
  Editor.loadOcclusion = function (url) {
    //if (!stand) {return}
    Editor.material.lightMap = THREE.ImageUtils.loadTexture(url);
    Editor.material.needsUpdate = true;
  }
  Editor.loadTexture = function (url) {
    //if (!stand) {return}
    Editor.material.map = THREE.ImageUtils.loadTexture(url);
    Editor.material.needsUpdate = true;
  }
  Editor.onClick = function (fun) { this._onclick = fun; }
  Editor.onSelect = function (fun) { this._onselect = fun; }
  Editor.init = function () {
    if (Editor.container && Editor.container.jquery) {
      Editor.container = Editor.container.get(0);
    }
    if (!Editor.container) {
      console.warn("No se puede iniciar el Editor, no hay contenedor.");
      return;
    }
    Engine.init({container: Editor.container, fps: 15, width: 500, height: 500,
      autoResize: false});

    var boxGeom = new THREE.BoxGeometry(0.5,1.6,0.5);
    var boxMat = new THREE.MeshBasicMaterial({color:0x0000ff});
    var cube = new THREE.Mesh(boxGeom, boxMat);
    var controller = new CharacterController({mesh: cube, cam: Engine.camera,
      velocity: 3, distance: 8, yOff: 2, disableMovement: true});

    //Engine.scene.add(cube);

    Engine.update = function (delta) {
      //controller.updatePosition(delta);
      controller.updateMouse(delta);
      controller.updateCamera(delta);
    }

    Engine.loadAll();
    Engine.start();

    var mouseVector = new THREE.Vector2();
    var caster = new THREE.Raycaster();

    Input.onclick = function (dt) {
      mouseVector.set(dt.x, -dt.y);
      //mouseVector.set(0, 0);
      caster.setFromCamera(mouseVector, Engine.camera);
      var intersect = caster.intersectObject(Editor.stand)[0];
      if (intersect) {
        var object = intersect.object;
        var index = intersect.faceIndex;  // Índice de la cara
        var allUvs = object.geometry.faceVertexUvs[0]; // Uvs del objeto
        var uvs = allUvs[index];  // Uvs de los vértices de la cara
        var x = (uvs[0].x + uvs[1].x + uvs[2].x)/3;
        var y = (uvs[0].y + uvs[1].y + uvs[2].y)/3;
        // Las coordenadas opengl son de izquierda a derecha y de abajo a
        // arriba, por eso hay que invertir el eje y, para que quede con
        // las coordenadas del resto de aplicaciones, como html
        y = 1-y;
        Editor._onclick(x, y);
        if (Editor.regions) {
          for (var i = 0; i < Editor.regions.length; i++) {
            var p = Editor.regions[i];
            if (x >= p.x && y >= p.y &&
                x <= (p.x + p.w) &&
                y <= (p.y + p.h)) {
              Editor._onselect(p);
            }
          }
        }
      }
    }
  }
  Editor.cargarRegiones = function (obj, xs, ys, ws, hs) {
    var arr = obj.map(function (o) {
      return {
        x: o[xs],
        y: o[ys],
        w: o[ws],
        h: o[hs],
        base: o
      }
    });
    Editor.regions = arr;
    return arr;
  }

// "[{"x":2,"y":3,"alto":12,"ancho":4,"nombre":"primero"},{"x":5,"y":5,"alto":5,"ancho":5,"nombre":"segundo"},{"x":1,"y":2,"alto":3,"ancho":4,"nombre":"tercero"},{"x":4,"y":3,"alto":2,"ancho":1,"nombre":"cuarto"}]"
//})()