
//*/

var modelos = [
  {url: "expo/ext_bloques_edificio.json", occ: "expo/ext_bloques_occ.jpg"},
  {url: "expo/ext_arcos_edificio.json", occ: "expo/ext_arcos_occ.jpg"},
  {url: "expo/ext_cielo.json", occ: "expo/ext_cielo_occ.jpg"},
  {url: "expo/ext_fondo_ciudad_lateral.json", occ: "expo/ext_fondo_ciudad_lateral_occ.jpg"},
  {url: "expo/ext_fondo_ciudad.json", occ: "expo/ext_fondo_ciudad_occ.jpg"},
  {url: "expo/pab_pared_techo.json", occ: "expo/pab_pared_techo_occ.jpg"},
  {url: "expo/ext_arboles_1.json", occ: "expo/ext_cielo_occ.jpg"},
  {url: "expo/ext_techos_rojos_edificio.json", occ: "expo/ext_techos_rojos_occ.jpg"},
  {url: "expo/ext_piso_exterior.json", occ: "expo/ext_piso_exterior_occ.jpg"},
  {url: "expo/ext_logo.json", occ: "expo/ext_cielo_occ.jpg"},
  {url: "expo/ext_jardines.json", occ: "expo/ext_jardines_occ.jpg"},
  {url: "expo/ext_arbustos_1.json", occ: "expo/ext_cielo_occ.jpg"},
  {url: "expo/ext_pendones.json", occ: "expo/ext_pendones_occ.jpg"},
  {url: "expo/ext_edf01.json", occ: "expo/ext_edf01_occ.jpg"},
  {url: "expo/ext_edf02.json", occ: "expo/ext_edf01_occ.jpg"},
  //{url: "expo/pab_estructura_techo.json", occ: "expo/ext_cielo_occ.jpg"},
  {url: "expo/ext_vidrios_edificio_3.json", occ: "expo/ext_vidrios_occ.jpg"},
  {url: "expo/ext_vidrios_edificio.json", occ: "expo/ext_vidrios_occ.jpg"},
  {url: "expo/ext_torres_publicidad.json", occ: "expo/ext_torres_publicidad_occ.jpg"},
  {url: "expo/ext_postes.json", occ: "expo/ext_postes_occ.jpg"},
  {url: "expo/ext_piso_entrada.json", occ: "expo/ext_piso_entrada_occ.jpg"},
  {url: "expo/pab_piso.json", occ: "expo/pab_piso_occ.jpg"},
  {url: "expo/pab_paredes.json", occ: "expo/pab_paredes_occ.jpg"},
  {url: "expo/std_expovirtual.json", occ: "expo/expo_stand_expovirtual_occ.jpg"},
  {url: "expo/pab_marcos.json", occ: "expo/pab_piso_occ.jpg"},
  //{url: "expo/pab_valla_2.json", occ: "expo/ext_cielo_occ.jpg"}
];

/*/

var modelos = [
  {url: "expo/ext_bloques_edificio.json", occ: "expo/ext_bloques_occ.jpg"},
  {url: "expo/ext_arcos_edificio.json", occ: "expo/ext_arcos_occ.jpg"},
  {url: "expo/pab_estructura_techo.json", occ: "expo/ext_cielo_occ.jpg"},
  {url: "expo/ext_vidrios_edificio_2.json", occ: "expo/ext_vidrios_occ.jpg"},
  {url: "expo/ext_vidrios_edificio.json", occ: "expo/ext_vidrios_occ.jpg"},
  {url: "expo/ext_piso_entrada.json", occ: "expo/ext_piso_entrada_occ.jpg"},
  {url: "expo/pab_piso.json", occ: "expo/pab_piso_occ.jpg"}
];

//*/

var expo_poly = [
  2.8, 42.47,
  3.16, 9.32,
  25.3, 8.12,
  25.3, 0.7,
  1.7, 0.6,
  1.5, -0.2,
  9.36, -0.1,
  9.3, -25.0,

  -9.3, -25.0,
  -9.36, -0.1,
  -1.5, -0.2,
  -1.7, 0.6,

  -10.2, 0.22,
  -9.8, 3.3,
  -27.7, 3.24,
  -26.6, 8.2,

  -3.16, 9.32,
  -2.8, 42.47,
];

function cargarExpo () {
  var loader = new THREE.JSONLoader();
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
}
