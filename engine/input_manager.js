window.Input = {
  "keys": {"up": false, "down": false, "left": false, "right": false},
  "mouseDrag": {
    "dragging": false,
    "x": 0, "y": 0,
    "startX": 0, "startY": 0,
    "totalX": 0, "totalY": 0,
    "deltaX": 0, "deltaY": 0,
    "movedX": 0, "movedY": 0
  },
  "zoom": {
    "delta": 0,
    "accumulated": 0,

    "pinching": false,
    "pinch": {
      "total": 0,
      "cur": 0,
    }
  },
  "joystick": {
    "pos": {"x": 0, "y": 0},
    "center": {"x": 0, "y": 0},
    "width": 0, "height": 0,
    "touch": {
      "active": false,
      "x": 0, "y": 0
    }
  },
  "direction": {
    "x": 0, "y": 0
  },
  "click": {
    "active": false,
    "x": 0, "y": 0
  },
  "_onclick": [],
  "onclick": function (callback) {
    Input._onclick.push(callback);
  }
};


// --------- Key Handlers -----------

document.addEventListener('keydown', function (event) {
  switch (event.keyCode) {
    case 38:
    case 87: // W
      Input.keys.up = true;
      break;
    case 37:
    case 65: // A
      Input.keys.left = true;
      break;
    case 83:
    case 40: // S
      Input.keys.down = true;
      break;
    case 68:
    case 39: // D
      Input.keys.right = true;
      break;
  }
}, false);
document.addEventListener('keyup', function (event) {
  switch (event.keyCode) {
    case 38:
    case 87: // W
      Input.keys.up = false;
      break;
    case 37:
    case 65: // A
      Input.keys.left = false;
      break;
    case 83:
    case 40: // S
      Input.keys.down = false;
      break;
    case 68:
    case 39: // D
      Input.keys.right = false;
      break;
  }
}, false);


// --------- Mouse Drag -----------

var mouse = Input.mouseDrag;

var resetMouse = function () {
  mouse.totalX = 0;
  mouse.totalY = 0;
  mouse.movedX = 0;
  mouse.movedY = 0;
  mouse.deltaX = 0;
  mouse.deltaY = 0;
}

Engine.onInit(function () {
  var mc = new Hammer(Engine.canvas);
  var dims = {
    "pos": {"x": 0, "y": 0},
    "center": {"x": 0, "y": 0},
    "width": 0, "height": 0
  };
  mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });

  mc.on("panmove", function(ev) {
    mouse.x = ev.center.x;
    mouse.y = ev.center.y;
    mouse.totalX = ev.deltaX;
    mouse.totalY = ev.deltaY;

    ev.preventDefault();
    return false;
  });

  mc.on("panstart", function (ev) {
    mouse.dragging = true;

    ev.preventDefault();
    return false;
  });

  mc.on("panend", function (ev) {
    mouse.dragging = false;
    resetMouse();

    ev.preventDefault();
    return false;
  });

  mc.on("tap", function (ev) {
    getDimensions();
    Input.click.x = 2*(ev.center.x - dims.center.x)/dims.width;
    Input.click.y = 2*(ev.center.y - dims.center.y)/dims.height;
    Input._onclick.forEach(function (callback) {
      callback(Input.click)
    });
    //Input.onclick(Input.click);
    //Input.onclick(ev);
  });

  mc.get('pinch').set({ enable: true });

  mc.on("pinchstart", function (ev) {
    Input.zoom.pinching = true;

    // No escalar por el valor inicial
    Input.zoom.pinch.old = ev.scale;
  });

  mc.on("pinchend", function (ev) {
    Input.zoom.pinching = false;
  });

  // TODO: esto
  mc.on("pinchmove", function (ev) {
    Input.zoom.pinch.cur = ev.scale;
  });

  Engine.canvas.addEventListener("wheel", function (ev) {
    // ev.deltaY es positivo cuando va hacia abajo, tengo que invertirlo
    var delta;
    switch (ev.deltaMode) {
      case 0: // Pixeles
        delta = -ev.deltaY;
        break;
      case 1: // Líneas
        delta = -ev.deltaY / 20;
        break;
      case 2: // Páginas
        // No soportado
        break;
    }
    Input.zoom.accumulated += delta;
    return false;
  });

  function getDimensions() {
    var box = Engine.canvas.getBoundingClientRect();
    dims.pos.x = box.left;
    dims.pos.y = box.top;
    dims.width = box.right - box.left;
    dims.height = box.bottom - box.top;
    dims.center.x = dims.pos.x + (dims.width / 2);
    dims.center.y = dims.pos.y + (dims.height / 2);
  }
});

Engine.onPreupdate(function () {
  if (mouse.dragging) {
    mouse.deltaX = mouse.totalX - mouse.movedX;
    mouse.deltaY = mouse.totalY - mouse.movedY;
    mouse.movedX = mouse.totalX;
    mouse.movedY = mouse.totalY;
  }

  Input.zoom.delta = Input.zoom.accumulated;
  Input.zoom.accumulated = 0;

  if (Input.zoom.pinching) {
    var pinch = Input.zoom.pinch;
    Input.zoom.delta = pinch.cur - pinch.old;
    pinch.old = pinch.cur;
  }
});


// --------- Joystick -----------


// La posición del joystick y su centro están en coordenadas de la ventana
// (Window space), no en coordenadas del documento, es decir, las coordenadas
// cambian dependiendo del scroll.

Engine.onInit(function () {
  var myElement = document.getElementById('joystick');
  if (!myElement) {return;}
  var joystick = Input.joystick;

  var mc = new Hammer(myElement);
  mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });

  mc.on("panmove", function(ev) {
    getDimensions();

    joystick.touch.x = ev.center.x - joystick.center.x;
    joystick.touch.y = ev.center.y - joystick.center.y;
  });

  mc.on("panstart", function(ev) {
    joystick.touch.active = true;
  });
  mc.on("panend", function(ev) {
    joystick.touch.active = false;
  });

  // Todas las coordenadas están en Window Space.
  function getDimensions() {
    var box = myElement.getBoundingClientRect();
    joystick.pos.x = box.left;
    joystick.pos.y = box.top;
    joystick.width = box.right - box.left;
    joystick.height = box.bottom - box.top;
    joystick.center.x = joystick.pos.x + (joystick.width / 2);
    joystick.center.y = joystick.pos.y + (joystick.height / 2);
  }
})