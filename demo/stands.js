var stand_regions = {
  "bronce": [{"x":0.01,"y":0.01,"w":0.27,"h":0.47,"url":"link1","elem":{}},{"x":0.29,"y":0.01,"w":0.27,"h":0.47,"url":"link2","elem":{}},{"x":0.82,"y":0.56,"w":0.13,"h":0.1,"url":"maps","elem":{}}],
  "plata": [],
  "oro": []
}

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

var stands = [];

var intersection = null;

function standClick (intersection) {
  window.intersection = intersection;

  var index = stands.indexOf(intersection.object);
  var coords = intersection.uv;

  var tipo = stands_data[index].tipo;
  var regiones = stand_regions[tipo];

  console.log("Click Stand", tipo, coords, regiones);

  var region;
  for(var i = 0; i < regiones.length; i++) {
    var r = regiones[i];
    var x = coords.x, y = 1-coords.y;
    if (x > r.x &&
        y > r.y &&
        x < r.x + r.w &&
        y < r.y + r.h) {
      region = r;
      break;
    }
  }

  if (region) {
    console.log("Click Region", region.url);
    loadContent(region.url);
  }
}


function cargarStands () {
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

      if (standsLoaded == 3) {
        stands_data.forEach(function (std) {
          var tipo = tipos_stands[std.tipo];
          var stand = new THREE.Mesh(tipo.geom, tipo.mat);
          stand.position.set(std.x, 0, std.z);
          stand.rotation.y = std.rot;

          stands.push(stand);
          Engine.scene.add(stand);
        });
      }
    });
  });

  var mouseVector = new THREE.Vector2();
  var caster = new THREE.Raycaster();

  Input.onclick(function (dt) {
    mouseVector.set(dt.x, -dt.y);
    caster.setFromCamera(mouseVector, Engine.camera);
    //arrow.position.copy(caster.ray.origin);
    //arrow.setDirection(caster.ray.direction);
    var intersects = caster.intersectObjects( stands );
    if (intersects.length > 0) {
      var intersection = intersects[0];
      standClick(intersection);
      /*
      var object = intersect.object;
      var index = intersect.faceIndex;
      var allUvs = object.geometry.faceVertexUvs[0];
      var uvs = allUvs[index];
      clickData.intersect = intersect;
      clickData.
      clickData.uvs = uvs;
      var textureCoords = {
        x: (uvs[0].x + uvs[1].x + uvs[2].x)/3,
        y: (uvs[0].y + uvs[1].y + uvs[2].y)/3,
      };
      clickData.coords = textureCoords;
      //console.log(textureCoords);
      apply(textureCoords.x, textureCoords.y);
      */
    }
  })
}
