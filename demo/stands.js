var stands_data = [
  // Stands tipo BRONCE PAB 1
  {tipo: "bronce", x:-63, z:-46, rot: 1.5708},
  {tipo: "bronce", x:-5, z:-60, rot: -1.5708},
  {tipo: "bronce", x:-23, z:-67, rot: 0},
  
  // Stands tipo PLATA PAB 1
  {tipo: "plata", x:-63, z:-60, rot: 1.5708},
  {tipo: "plata", x:-5, z:-46, rot: -1.5708},
  {tipo: "plata", x:-45, z:-67, rot: 0},

  // Stands tipo ORO PAB 1
  {tipo: "oro", x:-43, z:-46, rot: 3.1416},
  {tipo: "oro", x:-25, z:-46, rot: 3.1416},
]

var tipos_stands_data = [
  { nombre: "bronce", url: "../stands/std_bronce.json", img: "../stands/expo_stand_bronce_diff.jpg", occ: "../stands/expo_stand_bronce_occ.jpg"},
  { nombre: "plata" , url: "../stands/std_plata.json" , img: "../stands/expo_stand_plata_diff.jpg" , occ: "../stands/expo_stand_plata_occ.jpg" },
  { nombre: "oro"   , url: "../stands/std_oro.json"   , img: "../stands/expo_stand_oro_diff.jpg"   , occ: "../stands/expo_stand_oro_occ.jpg"   }
];

var tipos_stands = {};

var stands = []

var jsonLoader = new THREE.JSONLoader();
var textureLoader = new THREE.TextureLoader();

var standsLoaded = 0;

tipos_stands_data.forEach(function (tipo) {
  jsonLoader.load(tipo.url, function (geom, mats) {
    var mat = new THREE.MeshBasicMaterial({});
    textureLoader.load(tipo.img, function (texture) {
      mat.map = texture;
      mat.needsUpdate = true;
    });
    textureLoader.load(tipo.occ, function (texture) {
      mat.aoMap = texture;
      mat.needsUpdate = true;
    });
    tipos_stands[tipo.nombre] = {geom: geom, mat: mat};
    standsLoaded++;

    // Cuando terminen de cargar todos los tipos, cargar los stands en sí

    // Eso no los agrega a la escena, solo crea los modelos y la posición
    // en la que deberían estar cuando se agregen a la escena

    if (standsLoaded == 3) {
      stands_data.forEach(function (std) {
        var tipo = tipos_stands[std.tipo];
        var stand = new THREE.Mesh(tipo.geom, tipo.mat);
        stand.position.set(std.x, 0, std.z);
        stand.rotation.y = std.rot;

        stands.push(stand);
      });
    }
  });
});

function loadStands () {
  stands.forEach(function (x) {
    Engine.scene.add(x);
  });
}
