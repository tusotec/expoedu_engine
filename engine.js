window.Engine = {
  canvas: null,
  container: null,
  renderer: null,
  scene: null,
  camera: null,
  light: null,
  clock: null,
  update: function () {console.log("Update loop is empty!!")},
  running: false,
  fps: 0,
  _functions: {
    init: [],
    preUpdate: [],
    load: []
  },
  webgl: true,
  mobile:false,
  loader: null,
  loads: []
};

window.Engine.loader = new THREE.JSONLoader();

var defaultParams = {
  width: 640,
  height: 480,
  near: 0.1,
  far: 1000,
  fps: 0,
  webgl: true,
  mobile: false
};

function extend (obj1, obj2) {
  function addObj (a, b) {
    if (b) {
      for (var i in b) {
        a[i] = b[i];
      }
    }
  }
  var nobj = {};
  addObj(nobj, obj1);
  addObj(nobj, obj2);
  return nobj;
}

window.Engine.setSize = function (width, height) {
  this.renderer.setSize(width, height);
  this.camera.aspect = width / height;
  this.camera.updateProjectionMatrix();
}

function onResize () {
  var width = Engine.container.clientWidth;
  var height = Engine.container.clientHeight;
  Engine.setSize(width, height);
}

window.Engine.init = function (inparams) {
  var params = extend(defaultParams, inparams);
  var width = params.width, height = params.height;

  this.fps = params.fps;
  
  if (params.webgl) {
    this.renderer = new THREE.CanvasRenderer();
    //this.renderer = new THREE.WebGLRenderer();
  } else {
    this.renderer = new THREE.SoftwareRenderer();
  }
  this.renderer.setSize(width, height);

  this.canvas = this.renderer.domElement;
  this.container = params.container;

  if (params.container) {
    params.container.appendChild(this.canvas);
  }

  this.scene = new THREE.Scene();

  this.ambient = new THREE.AmbientLight(0xffffff);
  this.sun = new THREE.DirectionalLight(0xffffff, 1);
  this.sun.position.set(1, 5, 1)

  this.scene.add(this.ambient);
  //this.scene.add(this.sun);

  this.camera = new THREE.PerspectiveCamera(
    45, width/height, params.near, params.far);

  this.clock = new THREE.Clock();

  window.addEventListener("resize", onResize);

  for (var i = 0; i < this._functions.init.length; i++) {
    this._functions.init[i]();
  }
};

window.Engine.onInit = function (func) {
  this._functions.init.push(func);
}

window.Engine.preUpdate = function (func) {
  this._functions.preUpdate.push(func);
}

window.Engine.render = function() {
  var eng = window.Engine;
  if (eng.running) {
    if (eng.fps > 0) {
      setTimeout(function () {requestAnimationFrame(eng.render);}, 1000/eng.fps);
    } else {
      requestAnimationFrame(renderFunc);
    }
  }

  var delta = eng.clock.getDelta();
  
  for (var i = 0; i < eng._functions.preUpdate.length; i++) {
    eng._functions.preUpdate[i]();
  }

  eng.update(delta);

  eng.renderer.render(eng.scene, eng.camera);
}

window.Engine.setFps = function (value) {this.fps = value;}

window.Engine.pause = function () {
  this.running = false;
}

window.Engine.jsonLoad = function (url, callback) {
  myfun = function (endf) {
    window.Engine.loader.load(url, function (geom, mats) {
      callback(geom, mats);
      endf();
    });
  }
  window.Engine.loads.push(myfun);
}

window.Engine.objloader = new THREE.OBJLoader();

window.Engine.objLoad = function (url, material, callback) {
  myfun = function (endf) {
    window.Engine.objloader.load(url, material, function (object) {
      callback(object);
      endf();
    });
  }
  window.Engine.loads.push(myfun);
}

window.Engine.ajaxLoad = function (url, callback) {

}

window.Engine.onLoad = function (f) {
  this._functions.load.push(f);
}

window.Engine.loadUpdate = function (loaded, toLoad) {
  console.log("loaded: " + loaded + "/" + toLoad);
}

window.Engine.loadAll = function () {
  var loaded = 0;
  var loads = window.Engine.loads;
  var toLoad = loads.length;
  var lfun = function () {
    loaded += 1;
    window.Engine.loadUpdate(loaded, toLoad);
    if (loaded >= toLoad) {
      for (var i = 0; i < window.Engine._functions.load.length; i++) {
        window.Engine._functions.load[i]();
      }
    }
  }
  for (var i = 0; i < loads.length; i++) {
    loads[i](lfun);
  }
}

window.Engine.start = function () {
  onResize();
  if (!this.running) {
    this.running = true;
    this.render();
  }
}