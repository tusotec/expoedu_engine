if (!CANNON) { throw new Error("CANNON required for engine physics."); }
Engine.Physics = {
  init: function (params) {
    var world = new CANNON.World();
    world.gravity.set(0,0,0);
    world.broadphase = new CANNON.NaiveBroadphase();
    //world.solver.iterations = 20;
    this.world = world;

    Engine.onPreupdate(function (delta) {
      Engine.Physics.update(delta);
    })
  },
  update: function (delta) {
    this.world.step(delta);
  }
};