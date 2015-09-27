var tipos_stand_nombres = [
  "bro_1", "bro_2", "bro_3",
  "pla_1", "pla_2", "pla_3",
  "oro_1", "oro_2", "oro_3",
]

var modelos_stand = [
  // original:
  // {tipo: "bro_1", occ: "stands/ext_cielo_occ.jpg", px:-36.9, py:0, pz:-97.5, rx: 0, ry: 0, rz: 0},
  
  //Stands tipo BRONCE 2
  {tipo: "bro_2", occ: "stands/ext_cielo_occ.jpg", px:-32.9, py:0, pz:-87.5, rx: 0, ry: 3.1416, rz: 0},
  {tipo: "bro_2", occ: "stands/ext_cielo_occ.jpg", px:-21.9, py:0, pz:-87.5, rx: 0, ry: 3.1416, rz: 0},
  {tipo: "bro_2", occ: "stands/ext_cielo_occ.jpg", px:18.1, py:0, pz:-87.5, rx: 0, ry: 3.1416, rz: 0},
  {tipo: "bro_2", occ: "stands/ext_cielo_occ.jpg", px:29.1, py:0, pz:-51.7, rx: 0, ry: 0, rz: 0},
  
  // Stands tipo BRONCE 1
  {tipo: "bro_1", occ: "stands/ext_cielo_occ.jpg", px:-36.9, py:0, pz:-97.5, rx: 0, ry: 0, rz: 0},
  {tipo: "bro_1", occ: "stands/ext_cielo_occ.jpg", px:-8.9, py:0, pz:-97.5, rx: 0, ry: 0, rz: 0},
  {tipo: "bro_1", occ: "stands/ext_cielo_occ.jpg", px:26.1, py:0, pz:-97.5, rx: 0, ry: 0, rz: 0},
  {tipo: "bro_1", occ: "stands/ext_cielo_occ.jpg", px:29.1, py:0, pz:-71.5, rx: 0, ry: 3.1416, rz: 0},
  {tipo: "bro_1", occ: "stands/ext_cielo_occ.jpg", px:-32.9, py:0, pz:-67.5, rx: 0, ry: 0, rz: 0},
  {tipo: "bro_1", occ: "stands/ext_cielo_occ.jpg", px:-21.9, py:0, pz:-51.5, rx: 0, ry: 0, rz: 0},
  {tipo: "bro_1", occ: "stands/ext_cielo_occ.jpg", px:18.1, py:0, pz:-51.5, rx: 0, ry: 0, rz: 0},
  {tipo: "bro_1", occ: "stands/ext_cielo_occ.jpg", px:-29.9, py:0, pz:-41.5, rx: 0, ry: 3.1416, rz: 0},
  {tipo: "bro_1", occ: "stands/ext_cielo_occ.jpg", px:5.1, py:0, pz:-41.5, rx: 0, ry: 3.1416, rz: 0},
  {tipo: "bro_1", occ: "stands/ext_cielo_occ.jpg", px:33.1, py:0, pz:-41.5, rx: 0, ry: 3.1416, rz: 0},
  
  //Stands tipo BRONCE 3
  {tipo: "bro_3", occ: "stands/ext_cielo_occ.jpg", px:-22.9, py:0, pz:-97.5, rx: 0, ry: 0, rz: 0},
  {tipo: "bro_3", occ: "stands/ext_cielo_occ.jpg", px:12.1, py:0, pz:-97.5, rx: 0, ry: 0, rz: 0},
  {tipo: "bro_3", occ: "stands/ext_cielo_occ.jpg", px:40.1, py:0, pz:-97.5, rx: 0, ry: 0, rz: 0},
  {tipo: "bro_3", occ: "stands/ext_cielo_occ.jpg", px:29.1, py:0, pz:-87.5, rx: 0, ry: 3.1416, rz: 0},
  {tipo: "bro_3", occ: "stands/ext_cielo_occ.jpg", px:-21.9, py:0, pz:-67.5, rx: 0, ry: 0, rz: 0},
  {tipo: "bro_3", occ: "stands/ext_cielo_occ.jpg", px:18.1, py:0, pz:-67.5, rx: 0, ry: 0, rz: 0},
  {tipo: "bro_3", occ: "stands/ext_cielo_occ.jpg", px:-32.9, py:0, pz:-51.5, rx: 0, ry: 0, rz: 0},
  {tipo: "bro_3", occ: "stands/ext_cielo_occ.jpg", px:-43.9, py:0, pz:-41.5, rx: 0, ry: 3.1416, rz: 0},
  {tipo: "bro_3", occ: "stands/ext_cielo_occ.jpg", px:-15.9, py:0, pz:-41.5, rx: 0, ry: 3.1416, rz: 0},
  {tipo: "bro_3", occ: "stands/ext_cielo_occ.jpg", px:19.1, py:0, pz:-41.5, rx: 0, ry: 3.1416, rz: 0},
  
  //Stands tipo PLATA 1
  {tipo: "pla_1", occ: "stands/ext_cielo_occ.jpg", px:5.1, py:0, pz:-97.5, rx: 0, ry: 0, rz: 0},
  {tipo: "pla_1", occ: "stands/ext_cielo_occ.jpg", px:19.1, py:0, pz:-97.5, rx: 0, ry: 0, rz: 0},
  {tipo: "pla_1", occ: "stands/ext_cielo_occ.jpg", px:-32.9, py:0, pz:-71.5, rx: 0, ry: 3.1416, rz: 0},
  {tipo: "pla_1", occ: "stands/ext_cielo_occ.jpg", px:29.1, py:0, pz:-67.5, rx: 0, ry: 0, rz: 0},
  {tipo: "pla_1", occ: "stands/ext_cielo_occ.jpg", px:-21.9, py:0, pz:-55.5, rx: 0, ry: 3.1416, rz: 0},
  {tipo: "pla_1", occ: "stands/ext_cielo_occ.jpg", px:18.1, py:0, pz:-55.5, rx: 0, ry: 3.1416, rz: 0},
  {tipo: "pla_1", occ: "stands/ext_cielo_occ.jpg", px:-22.9, py:0, pz:-41.5, rx: 0, ry: 3.1416, rz: 0},
  {tipo: "pla_1", occ: "stands/ext_cielo_occ.jpg", px:-8.9, py:0, pz:-41.5, rx: 0, ry: 3.1416, rz: 0},
  
  //Stands tipo PLATA 2
  {tipo: "pla_2", occ: "stands/ext_cielo_occ.jpg", px:33.1, py:0, pz:-97.5, rx: 0, ry: 0, rz: 0},
  {tipo: "pla_2", occ: "stands/ext_cielo_occ.jpg", px:-32.9, py:0, pz:-83.5, rx: 0, ry: 0, rz: 0},
  {tipo: "pla_2", occ: "stands/ext_cielo_occ.jpg", px:-21.9, py:0, pz:-83.5, rx: 0, ry: 0, rz: 0},
  {tipo: "pla_2", occ: "stands/ext_cielo_occ.jpg", px:18.1, py:0, pz:-83.5, rx: 0, ry: 0, rz: 0},
  {tipo: "pla_2", occ: "stands/ext_cielo_occ.jpg", px:29.1, py:0, pz:-83.5, rx: 0, ry: 0, rz: 0},
  {tipo: "pla_2", occ: "stands/ext_cielo_occ.jpg", px:-21.9, py:0, pz:-71.5, rx: 0, ry: 3.1416, rz: 0},
  {tipo: "pla_2", occ: "stands/ext_cielo_occ.jpg", px:18.1, py:0, pz:-71.5, rx: 0, ry: 3.1416, rz: 0},
  {tipo: "pla_2", occ: "stands/ext_cielo_occ.jpg", px:-32.9, py:0, pz:-55.5, rx: 0, ry: 3.1416, rz: 0},
  {tipo: "pla_2", occ: "stands/ext_cielo_occ.jpg", px:29.1, py:0, pz:-55.5, rx: 0, ry: 3.1416, rz: 0},
  {tipo: "pla_2", occ: "stands/ext_cielo_occ.jpg", px:-36.9, py:0, pz:-41.5, rx: 0, ry: 3.1416, rz: 0},
  
  //Stands tipo PLATA 3
  {tipo: "pla_3", occ: "stands/ext_cielo_occ.jpg", px:-43.9, py:0, pz:-97.5, rx: 0, ry: 0, rz: 0},
  {tipo: "pla_3", occ: "stands/ext_cielo_occ.jpg", px:-29.9, py:0, pz:-97.5, rx: 0, ry: 0, rz: 0},
  {tipo: "pla_3", occ: "stands/ext_cielo_occ.jpg", px:-15.9, py:0, pz:-97.5, rx: 0, ry: 0, rz: 0},
  {tipo: "pla_3", occ: "stands/ext_cielo_occ.jpg", px:12.1, py:0, pz:-41.5, rx: 0, ry: 3.1416, rz: 0},
  {tipo: "pla_3", occ: "stands/ext_cielo_occ.jpg", px:26.1, py:0, pz:-41.5, rx: 0, ry: 3.1416, rz: 0},
  {tipo: "pla_3", occ: "stands/ext_cielo_occ.jpg", px:40.1, py:0, pz:-41.5, rx: 0, ry: 3.1416, rz: 0},
  
  //Stands tipo ORO 1
  {tipo: "oro_1", occ: "stands/ext_cielo_occ.jpg", px:-43.9, py:0, pz:-76.5, rx: 0, ry: 1.5708, rz: 0},
  {tipo: "oro_1", occ: "stands/ext_cielo_occ.jpg", px:-15.9, py:0, pz:-69.5, rx: 0, ry: 1.5708, rz: 0},
  {tipo: "oro_1", occ: "stands/ext_cielo_occ.jpg", px:-4.9, py:0, pz:-85.5, rx: 0, ry: -1.5708, rz: 0},
  {tipo: "oro_1", occ: "stands/ext_cielo_occ.jpg", px:1.1, py:0, pz:-69.5, rx: 0, ry: 1.5708, rz: 0},
  {tipo: "oro_1", occ: "stands/ext_cielo_occ.jpg", px:12.1, py:0, pz:-85.5, rx: 0, ry: -1.5708, rz: 0},
  {tipo: "oro_1", occ: "stands/ext_cielo_occ.jpg", px:40.1, py:0, pz:-76.5, rx: 0, ry: -1.5708, rz: 0},
  {tipo: "oro_1", occ: "stands/ext_cielo_occ.jpg", px:40.1, py:0, pz:-62.5, rx: 0, ry: -1.5708, rz: 0},
  
  //Stands tipo ORO 2
  {tipo: "oro_2", occ: "stands/ext_cielo_occ.jpg", px:40.1, py:0, pz:-85.5, rx: 0, ry: -1.5708, rz: 0},
  {tipo: "oro_2", occ: "stands/ext_cielo_occ.jpg", px:-4.9, py:0, pz:-69.5, rx: 0, ry: -1.5708, rz: 0},
  {tipo: "oro_2", occ: "stands/ext_cielo_occ.jpg", px:12.1, py:0, pz:-69.5, rx: 0, ry: -1.5708, rz: 0},
  {tipo: "oro_2", occ: "stands/ext_cielo_occ.jpg", px:-43.9, py:0, pz:-53.5, rx: 0, ry: 1.5708, rz: 0},
  {tipo: "oro_2", occ: "stands/ext_cielo_occ.jpg", px:-15.9, py:0, pz:-53.5, rx: 0, ry: 1.5708, rz: 0},
  {tipo: "oro_2", occ: "stands/ext_cielo_occ.jpg", px:1.1, py:0, pz:-53.5, rx: 0, ry: 1.5708, rz: 0},
  
  //Stands tipo ORO 3
  {tipo: "oro_3", occ: "stands/ext_cielo_occ.jpg", px:-43.9, py:0, pz:-85.5, rx: 0, ry: 1.5708, rz: 0},
  {tipo: "oro_3", occ: "stands/ext_cielo_occ.jpg", px:-15.9, py:0, pz:-85.5, rx: 0, ry: 1.5708, rz: 0},
  {tipo: "oro_3", occ: "stands/ext_cielo_occ.jpg", px:1.1, py:0, pz:-85.5, rx: 0, ry: 1.5708, rz: 0},
  {tipo: "oro_3", occ: "stands/ext_cielo_occ.jpg", px:-43.9, py:0, pz:-62.5, rx: 0, ry: 1.5708, rz: 0},
  {tipo: "oro_3", occ: "stands/ext_cielo_occ.jpg", px:-4.9, py:0, pz:-53.5, rx: 0, ry: -1.5708, rz: 0},
  {tipo: "oro_3", occ: "stands/ext_cielo_occ.jpg", px:12.1, py:0, pz:-53.5, rx: 0, ry: -1.5708, rz: 0},
  {tipo: "oro_3", occ: "stands/ext_cielo_occ.jpg", px:40.1, py:0, pz:-53.5, rx: 0, ry: -1.5708, rz: 0},
]