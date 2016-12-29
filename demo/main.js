
//=== Configuraciones ===//

Engine.init({container: renderDiv, fps: 18, autoResize: true});

var loader = new THREE.JSONLoader();

//=== Personaje ===//

var character_url = "/three/examples/models/animated/monster/monster.js";

var character_mesh = null;
var character_mixer = null;

var walkAnim = null;

var controller;

loader.load(character_url, function (geometry, materials) {

  // Necesario para el monstruo, no sé si para todos los modelos animados...
  materials.forEach(function (mat) { mat.morphTargets = true; });

  var material = new THREE.MultiMaterial( materials );

  mesh = new THREE.Mesh(geometry, material);
  character_mesh = mesh;

  // El Monstruo es INMENSO
  var s = 0.001;
  mesh.scale.set( s, s, s );

  character_mixer = new THREE.AnimationMixer(mesh);
  walk_anim = geometry.animations[0];

  var clip = character_mixer.clipAction(walk_anim);
  clip.setDuration(1);
  clip.setEffectiveWeight(0);
  clip.play();

  // Esto es necesario porque el modelo del monstruo está rotado
  var obj = new THREE.Object3D();
  obj.add(mesh);
  mesh.rotation.y = -Math.PI/2;
  mesh.position.z = -1;

  Engine.scene.add( obj );

  controller = new CharacterController({
    mesh: obj, cam: Engine.camera, animations: null,
    velocity: 10, angleSmooth: 3, distance: 4, yOff: 0.8});
  // Velocidad del monstruo debería ser 2.6
});

//=== Expo ===//

//cargarExpo();
//cargarStands();

function loadContent (name) {
  var url = "content/" + name + ".html";

  xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4) {
      if (xmlhttp.status == 200) {
        console.warn("Ajax request status", xmlhttp.status);
      }
      modalShow(xmlhttp.responseText);
    }
  }
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

//=== Iniciar ===//

Engine.update = function (delta) {
  if (controller) {
    controller.update(delta);

    var clip = character_mixer.clipAction(walk_anim);

    if (controller.moveAmount > 0) {
      clip.setEffectiveWeight(controller.moveAmount);
    } else {
      clip.setEffectiveWeight(0);
    }
    character_mixer.update( delta );

  }
};

function hideAdressBar () {
  setTimeout( function(){ window.scrollTo(0, 1); }, 100 );
}

(function () {
  var screen = new Hammer(Engine.canvas);
  screen.on("panstart tap", hideAdressBar);

  var joystick = new Hammer(document.getElementById('joystick'));
  joystick.on("panstart tap", hideAdressBar);
})();

hideAdressBar();

Engine.start();
