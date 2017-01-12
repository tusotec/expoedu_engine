
//=== Configuraciones ===//

Engine.init({container: renderDiv, fps: 18, autoResize: true});

var loader = new THREE.JSONLoader();

//=== Personaje ===//

var character_url = "../personaje.json";
var walk_anim = "HombreAction";
var idle_anim = "HombreAction.002";

var character_mesh = null;
var character_mixer = null;

//character_url = "../robots/expo_robot_1.json";
//walk_anim = "walk";
//idle_anim = "idle";

var controller;

loader.load(character_url, function (geometry, materials) {

  materials.forEach(function (mat) { mat.skinning = true; });

  var material = new THREE.MultiMaterial( materials );

  mesh = new THREE.SkinnedMesh(geometry, material);
  character_mesh = mesh;

  var s = 0.3;
  mesh.scale.set( s, s, s );

  character_mixer = new THREE.AnimationMixer(mesh);

  var clip = character_mixer.clipAction(walk_anim);
  clip.setDuration(1);
  clip.setEffectiveWeight(0);
  clip.play();

  var clip = character_mixer.clipAction(idle_anim);
  clip.setDuration(20);
  clip.setEffectiveWeight(0);
  clip.play();

  // Esto es necesario si el modelo está rotado o movido
  var obj = new THREE.Object3D();
  obj.add(mesh);

  Engine.scene.add( obj );

  controller = new CharacterController({
    mesh: obj, cam: Engine.camera, animations: null,
    velocity: 1.5, angleSmooth: 3, distance: 4, yOff: 0.8});
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

    var walk_clip = character_mixer.clipAction(walk_anim);
    var idle_clip = character_mixer.clipAction(idle_anim);

    var vel = controller.moveAmount;

    walk_clip.setEffectiveWeight(vel);
    idle_clip.setEffectiveWeight(1-vel);

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
