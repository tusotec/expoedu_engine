window.Engine = {
  canvas: null,
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
    preUpdate: []
  }
};

var defaultParams = {
  width: 640,
  height: 480,
  near: 0.1,
  far: 1000,
  fps: 0
};

window.Engine.init = function (params) {
  if (params == undefined) { params = {}; }
  var width = params.width || defaultParams.width;
  var height = params.height || defaultParams.height;
  var near = params.near || defaultParams.near;
  var far = params.far || defaultParams.far;

  this.fps = params.fps || defaultParams.fps;

  this.renderer = new THREE.WebGLRenderer();
  this.renderer.setSize(width, height);

  this.canvas = this.renderer.domElement;

  if (params.container) {
    params.container.appendChild(this.canvas);
  }

  this.scene = new THREE.Scene();

  //this.light = new THREE.AmbientLight(0xffffff);
  this.ambient = new THREE.AmbientLight(0xffffff);
  this.sun = new THREE.DirectionalLight(0xffffff, 1);
  this.sun.position.set(1, 5, 1)

  this.scene.add(this.ambient);
  this.scene.add(this.sun);

  this.camera = new THREE.PerspectiveCamera(45, width/height, near, far);

  this.clock = new THREE.Clock();

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

var renderFunc = function() {
  window.Engine.render();
}

window.Engine.render = function() {
  var delta = this.clock.getDelta();
  
  for (var i = 0; i < this._functions.preUpdate.length; i++) {
    this._functions.preUpdate[i]();
  }

  this.update(delta);

  this.renderer.render(this.scene, this.camera);
  if (this.running) {
    if (this.fps > 0) {
      setTimeout(function () {requestAnimationFrame(renderFunc);}, 1000/this.fps);
    } else {
      requestAnimationFrame(renderFunc);
    }
  }
}

window.Engine.setFps = function (value) {this.fps = value;}

window.Engine.pause = function () {
  this.running = false;
}

window.Engine.start = function () {
  if (!this.running) {
    this.running = true;
    this.render();
  }
}