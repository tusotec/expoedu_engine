var stands_data = [
  // Stands tipo BRONCE PAB 1
  {tipo: "bronce", x:-63, z:-46, rot: 1.5708},
  {tipo: "bronce", x:-63, z:-74, rot: 1.5708},
  {tipo: "bronce", x:-63, z:-102, rot: 1.5708},
  {tipo: "bronce", x:-63, z:-136, rot: 1.5708},
  {tipo: "bronce", x:-63, z:-164, rot: 1.5708},
  
  {tipo: "bronce", x:-5, z:-60, rot: -1.5708},
  {tipo: "bronce", x:-5, z:-88, rot: -1.5708},
  {tipo: "bronce", x:-5, z:-122, rot: -1.5708},
  {tipo: "bronce", x:-5, z:-150, rot: -1.5708},
  {tipo: "bronce", x:-5, z:-178, rot: -1.5708},
  
  {tipo: "bronce", x:-45, z:-76, rot: 3.1416},
  {tipo: "bronce", x:-23, z:-67, rot: 0},
  {tipo: "bronce", x:-45, z:-157, rot: 3.1416},
  {tipo: "bronce", x:-23, z:-148, rot: 0},
  
  // Stand BRONCE PAB 2
  {tipo: "bronce", x:5, z:-46, rot: 1.5708},
  {tipo: "bronce", x:5, z:-74, rot: 1.5708},
  {tipo: "bronce", x:5, z:-102, rot: 1.5708},
  {tipo: "bronce", x:5, z:-136, rot: 1.5708},
  {tipo: "bronce", x:5, z:-164, rot: 1.5708},
  
  {tipo: "bronce", x:63, z:-60, rot: -1.5708},
  {tipo: "bronce", x:63, z:-88, rot: -1.5708},
  {tipo: "bronce", x:63, z:-122, rot: -1.5708},
  {tipo: "bronce", x:63, z:-150, rot: -1.5708},
  {tipo: "bronce", x:63, z:-178, rot: -1.5708},
  
  {tipo: "bronce", x:23, z:-76, rot: 3.1416},
  {tipo: "bronce", x:45, z:-67, rot: 0},
  {tipo: "bronce", x:23, z:-157, rot: 3.1416},
  {tipo: "bronce", x:45, z:-148, rot: 0},
  
  // Stands tipo PLATA PAB 1
  {tipo: "plata", x:-63, z:-60, rot: 1.5708},
  {tipo: "plata", x:-63, z:-88, rot: 1.5708},
  {tipo: "plata", x:-63, z:-122, rot: 1.5708},
  {tipo: "plata", x:-63, z:-150, rot: 1.5708},
  {tipo: "plata", x:-63, z:-178, rot: 1.5708},
  
  {tipo: "plata", x:-5, z:-46, rot: -1.5708},
  {tipo: "plata", x:-5, z:-74, rot: -1.5708},
  {tipo: "plata", x:-5, z:-102, rot: -1.5708},
  {tipo: "plata", x:-5, z:-136, rot: -1.5708},
  {tipo: "plata", x:-5, z:-164, rot: -1.5708},
  
  {tipo: "plata", x:-45, z:-67, rot: 0},
  {tipo: "plata", x:-23, z:-76, rot: 3.1416},
  {tipo: "plata", x:-45, z:-148, rot: 0},
  {tipo: "plata", x:-23, z:-157, rot: 3.1416},

  //Stands tipo PLATA PAB 2
  {tipo: "plata", x:5, z:-60, rot: 1.5708},
  {tipo: "plata", x:5, z:-88, rot: 1.5708},
  {tipo: "plata", x:5, z:-122, rot: 1.5708},
  {tipo: "plata", x:5, z:-150, rot: 1.5708},
  {tipo: "plata", x:5, z:-178, rot: 1.5708},
  
  {tipo: "plata", x:63, z:-46, rot: -1.5708},
  {tipo: "plata", x:63, z:-74, rot: -1.5708},
  {tipo: "plata", x:63, z:-102, rot: -1.5708},
  {tipo: "plata", x:63, z:-136, rot: -1.5708},
  {tipo: "plata", x:63, z:-164, rot: -1.5708},
  
  {tipo: "plata", x:23, z:-67, rot: 0},
  {tipo: "plata", x:45, z:-76, rot: 3.1416},
  {tipo: "plata", x:23, z:-148, rot: 0},
  {tipo: "plata", x:45, z:-157, rot: 3.1416},

  // Stands tipo ORO PAB 1
  {tipo: "oro", x:-43, z:-46, rot: 3.1416},
  {tipo: "oro", x:-25, z:-46, rot: 3.1416},
  {tipo: "oro", x:-40, z:-100, rot: -1.5708},
  {tipo: "oro", x:-28, z:-100, rot: 1.5708},
  {tipo: "oro", x:-40, z:-124, rot: -1.5708},
  {tipo: "oro", x:-28, z:-124, rot: 1.5708},
  {tipo: "oro", x:-43, z:-178, rot: 0},
  {tipo: "oro", x:-25, z:-178, rot: 0},
  
  // Stands tipo ORO PAB 2
  {tipo: "oro", x:25, z:-46, rot: 3.1416},
  {tipo: "oro", x:43, z:-46, rot: 3.1416},
  {tipo: "oro", x:28, z:-100, rot: -1.5708},
  {tipo: "oro", x:40, z:-100, rot: 1.5708},
  {tipo: "oro", x:28, z:-124, rot: -1.5708},
  {tipo: "oro", x:40, z:-124, rot: 1.5708},
  {tipo: "oro", x:25, z:-178, rot: 0},
  {tipo: "oro", x:43, z:-178, rot: 0}
]

var tipos_stands_data = [
  { nombre: "bronce", obj: "stands/std_bronce.json", img: "stands/expo_stand_bronce_diff.jpg", occ: "stands/expo_stand_bronce_occ.jpg"},
  { nombre: "plata" , obj: "stands/std_plata.json" , img: "stands/expo_stand_plata_diff.jpg" , occ: "stands/expo_stand_plata_occ.jpg" },
  { nombre: "oro"   , obj: "stands/std_oro.json"   , img: "stands/expo_stand_oro_diff.jpg"   , occ: "stands/expo_stand_oro_occ.jpg"   }
]

var tipos_stands = {}
tipos_stands_data.forEach(function (tipo) {
  var mat = new THREE.MeshPhongMaterial({
    map: THREE.ImageUtils.loadTexture(tipo.img),
    //lightMap: THREE.ImageUtils.loadTexture(tipo.occ)
    aoMap: THREE.ImageUtils.loadTexture(tipo.occ)
  });
  Engine.jsonLoad(tipo.obj, function (geom, mats) {
    tipos_stands[tipo.nombre] = {geom: geom, mat: mat};
  });
})

var stands = []

Engine.onLoad(function () {
  stands_data.forEach(function (std) {
    var tipo = tipos_stands[std.tipo];
    var stand = new THREE.Mesh(tipo.geom, tipo.mat);
    stand.position.set(std.x, 0, std.z);
    stand.rotation.y = std.rot;
    stands.push(stand);
  });
});