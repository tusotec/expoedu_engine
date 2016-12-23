
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
    velocity: 2.6, angleSmooth: 3, distance: 4, yOff: 0.8});
});

//=== Expo ===//

// modelos está definido en ../expo.js

var texture_loader = new THREE.TextureLoader();

// Tengo que hacerlo así de horrible porque los modelos están
// mal exportados

modelos.forEach(function (modelo) {
  var url = "../" + modelo.url;

  loader.load(url, function (geom, mats) {

    // Todo esto debería estar en el archivo del modelo original,
    // pero está mal exportado así que tengo que hacer todo esto
    var mats = mats.map(function (base_mat) {
      var mat = new THREE.MeshBasicMaterial();

      // Debería ser (1,1,1), pero la textura es muy oscura
      mat.color.setRGB(1.1,1.1,1.1);

      // Por estar mal exportado
      mat.map = base_mat.lightMap;

      // Porque son texturas pequeñas que se repiten
      mat.map.wrapT = THREE.RepeatWrapping;
      mat.map.wrapS = THREE.RepeatWrapping;

      // Muchos objetos son transparentes
      mat.transparent = base_mat.transparent;
      mat.depthTest = base_mat.depthTest;
      mat.depthWrite = base_mat.depthWrite;

      // Cargar la oclusión por separado, sí hay una
      if (modelo.occ) {
        var url = "../" + modelo.occ;
        texture_loader.load(url, function (texture) {
          mat.aoMap = texture;
          mat.needsUpdate = true;
        });
      }

      return mat;
    });

    var material = new THREE.MeshFaceMaterial(mats);
    var model = new THREE.Mesh(geom, material);
    Engine.scene.add(model);
  });
});

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

  var joystick = new Hammer(Edocument.getElementById('joystick'));
  joystick.on("panstart tap", hideAdressBar);
})();

hideAdressBar();

Engine.start();
