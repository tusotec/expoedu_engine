
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

var character;

loader.load(character_url, function (geometry, materials) {

  geometry.faceVertexUvs.push(geometry.faceVertexUvs[0]);

  materials.forEach(function (mat) { mat.skinning = true; });

  var material = new THREE.MultiMaterial( materials );

  material = materials[0];
  //material.aoMap = null;

  //material = new MeshBasicMaterial({color: 0xffffff});

  mesh = new THREE.SkinnedMesh(geometry, material);
  character_mesh = mesh;

  var s = 0.3;
  mesh.scale.set( s, s, s );

  // Esto es necesario si el modelo está rotado o movido
  var obj = new THREE.Object3D();
  obj.add(mesh);

  Engine.scene.add( obj );

  character = new Engine.Character({
    mesh: obj,
    velocity: 4, // Tiene que ser exactamente 1.4 para que sincronice con la animación
    playable: true,
    radius: 0.5,
    height: 1.6,

    animationMixer: new THREE.AnimationMixer(mesh),
    walk_anim: "Hombre Caminado",
    idle_anim: "Hombre de pie",
  });

  Engine.User.init({character: character, distance: 4, yOff: 0.8});
});

//=== Expo ===//

cargarExpo();
cargarStands();

// El polígono de colisión está incompleto, aparece rotado y no deja pasar
// a los stands, por eso no lo agrego

// TODO: Las colisiones se rompen con computadoras con bajo FPS, atraviesa
// las paredes. Tengo que revisar eso.

var expoCollision = new Collision.Geometry(
  expo_poly, // vertices
  new Collision.Vec(0,0), // pos
  0 // angle
);
//Engine.Collidables.add(expoCollision);

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

THREE.DefaultLoadingManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
  if (itemsLoaded < itemsTotal-1) {
    document.getElementById("load-status").textContent =
      "Descargando recursos: " + itemsLoaded + " / " + itemsTotal;
  } else {
    document.getElementById("load-status").textContent = "Iniciando Feria";

    hideAdressBar();
    
    setTimeout(function () {
      Engine.start();
      document.getElementById("load-screen").style.display = "none";
      document.getElementById("content").style.visibility = "";
    }, 100); // 0.1 seg
  }
};

