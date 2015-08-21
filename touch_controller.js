
var myElement = document.getElementById('myElement');

// La posición del joystick y su centro están en coordenadas de la ventana
// (Window space), no en coordenadas del documento, es decir, las coordenadas
// cambian dependiendo del scroll.
var joystick = {
  "pos": {"x": 0, "y": 0},
  "center": {"x": 0, "y": 0},
  "width": 0, "height": 0,
  "touch": {
    "active": false,
    "x": 0, "y": 0
  }
}

var mc = new Hammer(myElement);
mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });

mc.on("panmove", function(ev) {
  getDimensions();

  joystick.touch.x = ev.center.x - joystick.center.x;
  joystick.touch.y = ev.center.y - joystick.center.y;

  deltax.textContent = joystick.touch.x;
  deltay.textContent = joystick.touch.y;
});

mc.on("panstart", function(ev) {
  joystick.touch.active = true;
  draggingSpan.textContent = "True";
});
mc.on("panend", function(ev) {
  joystick.touch.active = false;
  draggingSpan.textContent = "False";
  deltax.textContent = 0;
  deltay.textContent = 0;
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