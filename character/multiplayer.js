//(function () {

var Player = function (id, character) {
  this.id = id;
  this.character = character;
}

var Multiplayer = {
  init: function (params) {
    this.params = params;
    console.log(params);

    this.character = params.character; // Personaje del usuario.
    this.builder = params.builder; // Función que construye un personaje.
    this.rate = params.rate || 0.3;

    this.players = new Array();
    this.id = undefined;

    this.socket = io(params.url);

    var players = this.players;
    var socket = this.socket;
    var character = this.character;

    var that = this;

    socket.on("connected", function (data) {
      console.log("Connecting", data)
      that.id = data.id;
      character.setPosition(new Coord(data.pos.x, data.pos.y));
    });

    socket.on("newplayer", function (data) {
      if (data.id == that.id) return;
      console.log("Player Created", data);
      var nchar = that.builder();
      var player = new Player(data.id, nchar);
      Engine.scene.add(player.character.mesh);
      players.push(player);
      player.character.setPosition(new Coord(data.pos.x, data.pos.y));
    });

    socket.on("removeplayer", function (data) {
      console.log("Player Removed", data);
      var players = that.players;
      var player = that.getPlayer(data.id);
      if (!player) return;
      Engine.scene.remove(player.character.mesh);
      var index = players.indexOf(player);
      if (index > -1) {
        players.splice(index, 1);
      }
    });

    socket.on("refresh", function (refreshes) {
      //console.log("Refresh order!")
      refreshes.forEach(function (refr) {
        if (refr.id == that.id) return;
        var player = that.getPlayer(refr.id);
        if (!player) return;
        player.character.moveTo(new Coord(refr.pos.x, refr.pos.y));
      });
    });

    var counter = 0;
    Engine.onPreupdate(function (delta) {
      counter += delta;
      if (counter > that.rate) {
        counter = 0;
        var pos = character.getPosition();
        var data = {id: that.id, pos: {x: pos.x, y: pos.y}};
        socket.emit("refresh", data);
      }
    });
  },
  getPlayer: function (id) {
    var found = null;
    this.players.forEach(function (player) {
      if (player.id == id) {
        found = player;
      }
    });
    return found;
  }
};

Engine.Multiplayer = Multiplayer;

//})();