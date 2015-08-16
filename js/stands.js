 function LoadStand(model, diff, occ, func) {
    var colorTexture = THREE.ImageUtils.loadTexture(diff);
    var shadeTexture = THREE.ImageUtils.loadTexture(occ);
    var uniforms = {
      'color': {type: 'f', value: 0.0},
      'colTex': {type: 't', value: colorTexture},
      'shadTex': {type: 't', value: shadeTexture}
    };
    var material = new THREE.ShaderMaterial({
      'fog': false,
      'uniforms': uniforms,
      'vertexShader': vertexShader.innerHTML,
      'fragmentShader': fragmentShader.innerHTML
    });
    
    var standGeom, stand;

    var loader = new THREE.JSONLoader();
    loader.load(model, function(obj) {
      standGeom = obj;
      stand = new THREE.Mesh(obj, material);
      func(stand);
    });
  }

   var onProgress = function ( xhr ) {
          if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
           // console.log( Math.round(percentComplete, 2) + '% downloaded' );
          }
        };

        var onError = function ( xhr ) {
        };

         function setLoaded(){
    if (loaded) {
      loadingSpan.style.display = "none";
      loadedSpan.style.display = "inline";

      addStand02();
    } else {
      loaded = true;
    }
  }


  function addStand01 () {
    scene.remove(stand02);
    scene.add(stand01);
  
  }

  function addStand02 () {
    scene.remove(stand01);
    scene.add(stand02);
  }

    function rotateCam(obj, center, dist, value) {
    val = value * 3.14159268 * 2;
    obj.rotation.y = val;

    obj.position.x = Math.sin(val)*dist + center.x;
    obj.position.y = center.y;
    obj.position.z = Math.cos(val)*dist + center.z;
  }

  function addCube() {
    scene.add(cube);
  }

  function removeCube() {
    scene.remove(cube);
  }