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
  "onclick": function (dt) {
    console.log("clicked!! at: " + dt.x + ", " + dt.y);
  }
};


// --------- Key Handlers -----------

document.addEventListener('keydown', function (event) {
  switch (event.keyCode) {
    case 38:
    case 87: // W
      Input.keys.up = true;
      keyscoll.up = true;
      keyscoll.down = keyscoll.left = keyscoll.right = false;
      break;
    case 37:
    case 65: // A
      Input.keys.left = true;
      keyscoll.left = true;
      keyscoll.down = keyscoll.up = keyscoll.right = false;
      break;
    case 83:
    case 40: // S
      Input.keys.down = true;
      keyscoll.down = true;
      keyscoll.up = keyscoll.left = keyscoll.right = false;
      break;
    case 68:
    case 39: // D
      Input.keys.right = true;
      keyscoll.right = true;
      keyscoll.down = keyscoll.left = keyscoll.up = false;
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
  });

  mc.on("panstart", function (ev) {
    mouse.dragging = true;
  })

  mc.on("panend", function (ev) {
    mouse.dragging = false;
    resetMouse();
  })

  mc.on("tap", function (ev) {
    getDimensions();
    Input.click.x = 2*(ev.center.x - dims.center.x)/dims.width;
    Input.click.y = 2*(ev.center.y - dims.center.y)/dims.height;
    Input.onclick(Input.click);
  })

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

Engine.preUpdate(function () {
  if (mouse.dragging) {
    mouse.deltaX = mouse.totalX - mouse.movedX;
    mouse.deltaY = mouse.totalY - mouse.movedY;
    mouse.movedX = mouse.totalX;
    mouse.movedY = mouse.totalY;
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