(function (window) {

var Collision = {
  epsilon: 0.1,
  iterations: 5,
};
  
//=== Vec ===//

  function Vec (x,y) {
    this.x = x || 0;
    this.y = y || 0;

    this.length = Math.sqrt(x*x + y*y);
  }

  Collision.Vec = Vec;

  Vec.prototype.add = function (that) {
    return new Vec(this.x + that.x, this.y + that.y);
  }

  Vec.prototype.sub = function (that) {
    return new Vec(this.x - that.x, this.y - that.y);
  }

  Vec.prototype.dist = function (that) {
    return this.sub(that).length;
  }

  Vec.prototype.eq = function (that) {
    return this.x == that.x && this.y == that.y;
  }

  Vec.prototype.scaled = function (s) {
    return new Vec(this.x*s, this.y*s);
  }

  Vec.prototype.withLength = function (l) {
    return this.scaled(l/this.length);
  } 

  Vec.prototype.toPolar = function () {
    var angle = Math.atan2(this.x, this.y);
    return new Polar(angle, this.length);
  }

  Vec.prototype.dot = function (that) {
    return this.x*that.x + this.y*that.y;
  }

//=== Polar ===//

  function Polar (a, d) {
    this.a = a || 0;
    this.d = d || 0;
  }

  Collision.Polar = Polar;

  Polar.prototype.toVec = function () {
    var x = Math.cos(this.a)*this.d;
    var y = Math.sin(this.a)*this.d;
    return new Vec(x,y);
  }

  Polar.prototype.rotate = function (angle) {
    return new Polar(this.a + angle, this.d);
  }

/*
  //=== Matrix ===//

  function Matrix (a,b,c,d) {
    // fila, columna
    this.a = a; // 0, 0
    this.b = b; // 0, 1
    this.c = c; // 1, 0
    this.d = d; // 1, 1

    // +---+
    // |a b|
    // |c d|
    // +---+
  }

  Matrix.identity = new Matrix(1,0,0,1);

  Matrix.prototype.apply = function (vec) {
    return new Vec(this.a*vec.x + this.b*vec.y, this.c*vec.x + this.d*vec.y);
  }
*/

//=== Box ===//
  function Box(l,r,t,b) {
    this.l = l;
    this.r = r;
    this.t = t;
    this.b = b;
  }

  Collision.Box = Box;

  Box.fromPoints = function (a, b) {
    return new Box(
      Math.min(a.x, b.x),
      Math.max(a.x, b.x),
      Math.max(a.y, b.y),
      Math.min(a.y, b.y)
    );
  }

  Box.intercept = function (a, b) {
    return !(
      a.r<b.l ||
      b.r<a.l ||
      a.t<b.b ||
      b.t<a.b
    );
    // Cada una de estas condiciones asegura que no se tocan, si alguna se 
    // cumple, no hay intersección. Si todas fallan, hay una intersección.
  }

  Box.prototype.combine = function (that) {
    return new Box(
      Math.min(this.l, that.l),
      Math.max(this.t, that.r),
      Math.max(this.t, that.t),
      Math.min(this.b, that.b)
    );
  }

  Box.prototype.intercept = function (that) {
    return Box.intercept(this, that);
  }

//=== Rect ===//

  function Rect (a, b) {
    // la ecuación canónica: y = a*x + b
    // no puede representar rectas verticales

    // ecuación: a*x + b*y + c = 0
    // corte en x: -c/b
    // corte en y: -c/a
    // pendiente:  -a/b
    this.a = a ? Number(a) : 0;
    this.b = b ? Number(b) : 0;
    //this.c = c ? Number(c) : 0;
  }

  Collision.Rect = Rect;

  Rect.fromPoints = function (a, b) {
    var m=(b.y-a.y)/(b.x-a.x);
    return Rect.fromPend(m, a);
  }

  Rect.fromPend = function (m, _p) {
    var p = _p || new Vec();
    var b = p.y - m*p.x;
    return new Rect(m, b, p);
  }

  Rect.prototype.dist = function (p) {
    var a = this.a;
    var b = this.b;
    // ? Lo saqué de wikipedia
    return Math.abs(a*p.x - p.y + b)/Math.sqrt(a*a + 1);
  }

  Rect.prototype.angle = function () {
    return Math.atan(this.a);
  }

  Rect.prototype.getY = function (x) {
    return this.a*x + this.b;
  }

  Rect.prototype.perpendicular = function (p) {
    return Rect.fromPend(-1/this.a, p);
  }

  Rect.prototype.intersect = function (that) {
    var x = (that.b-this.b) / (this.a-that.a);
    var y = this.getY(x);
    return new Vec(x, y);
  }

  Rect.prototype.closestPoint = function (p) {
    return this.intersect(this.perpendicular(p));
  }

//=== Segment ===//

  function Segment (a, b) {
    this.a = a || new Vec();
    this.b = b || new Vec();

    this.length = this.a.dist(this.b);

    this.box = Box.fromPoints(this.a, this.b);

    // Normalmente el primer punto está a la izquierda del segundo (su valor
    // en x es menor), si no es así, están invertidos.
    // Si las dos x están igual, es una recta vertical, en este caso normalmente
    // el primer punto está más abajo (porque la pendiente es positiva).
    var p = a.x!=b.x ? a.x<b.x : a.y<b.y;
    this.p = p;

    this.rect = Rect.fromPoints(this.a, this.b);

    var angle = Math.atan(this.rect.angle());

    // Para mis propósitos, la normal siempre va a la izquierda.
    // Si está invertida, la recta va hacia atrás, y la normal va a la derecha.
    this.normal = p ? angle-(Math.PI/2) : angle+(Math.PI/2);
  }

  Collision.Segment = Segment;

  Segment.prototype.closestPoint = function (p) {
    //return this.rect.closestPoint(p);

    var ab = this.b.sub(this.a);
    var ap = p.sub(this.a);

    // Proyectar ap en ab, y luego hacerlo relativo a ab
    var t = ab.dot(ap) / ab.dot(ab);
    // ab.dot(ab) es la logitud de ab al cuadrado

    // No salir del segmento
    if (t<0) {t=0;}
    if (t>1) {t=1;}

    // Obtener el punto final
    return this.a.add(ab.scaled(t));
  }

  Segment.prototype.dist = function (p) {
    return this.closestPoint(p).dist(p);
  }

  Segment.prototype.collide = function (p, r) {
    var closest = this.closestPoint(p);
    var normal = p.sub(closest);
    var d = normal.length;
    if (d < r) {
      return p.add(normal.withLength(r-d));
    }
    return p;
  }

//=== Polygon ===//

  function Polygon (data, flipped) {
    this.flipped = !!flipped;
    this.data = data;

    this.vertices = [];
    for (var i = 0; i < data.length; i+=2) {
      this.vertices.push(new Vec(data[i], data[i+1]));
    }

    this.segments = [];
    var last = this.vertices.length-1;
    for (var i = 0; i < last; i++) {
      var a = this.vertices[i];
      var b = this.vertices[i+1];
      this.segments.push(new Segment(a, b));
    }

    var a = this.vertices[last];
    var b = this.vertices[0];
    this.segments.push(new Segment(a, b));
  }

  Collision.Polygon = Polygon;

  Polygon.prototype.closestPoint = function (p) {
    var last_d = 0;
    var last_c = null;
    this.segments.forEach(function (segment) {
      var c = segment.closestPoint(p);
      var d = c.dist(p);
      if (last_c === null || d < last_d) {
        last_c = c;
        last_d = d;
      }
    });
    return last_c;
  }

  Polygon.prototype.collide = function (_p, r) {
    var last = new Vec();
    var p = _p;
    while (!p.eq(last)) {
      last = p;
      this.segments.forEach(function (segment) {
        p = segment.collide(p, r);
      });
    }
    return p;
  }

//=== Circle ===//

  function Circle (p, r) {
    this.p = p;
    this.r = r

    this.box = new Box(p.x-r, p.x+r, p.y+r, p.y-r);
  }

  Collision.Circle = Circle;

  Circle.prototype.calcBox = function () {
    var x = this.p.x;
    var y = this.p.y;
    var r = this.r;
    this.box = new Box(x-r, x+r, y+r, y-r);
  }

  Circle.prototype.setxy = function (x,y) {
    this.p = new Vec(x,y);
    this.calcBox()
  }

  Circle.prototype.closestPoint = function (p) {
    return p.sub(this.p).withLength(this.r).add(this.p);
  }

  Circle.prototype.collideWith = function (that, count) {
    if (typeof count != "number") { count = 0; }

    if (!(that instanceof Collection)) {
      that = new Collection([that]);
    }

    var previous = this.p;

    var normals = [];

    // Recolectar las normales de todos los puntos de contacto
    // Los puntos en sí no me interesan
    for (var i = 0; i < that.objects.length; i++) {
      var obj = that.objects[i];
      if (this.box.intercept(obj.box)) {
        var obj = that.objects[i];
        var point = obj.closestPoint(this.p);
        var normal = this.p.sub(point);
        if (normal.length < this.r) {
          normals.push(normal);
        }
      }
    }

    // No hay contacto
    if (normals.length == 0) { return; }

    
    // Método 1:
    // En esquinas cerradas, a veces este método hace que el círculo
    // atraviese una de las paredes, porque una empuja primero, demasiado,
    // y termina del otro lado de la otra pared.

    // Seleccionar la normal más corta
    var normal = normals[0];
    for (var i = 1; i < normals.length; i++) {
      if (normals[i].length < normal.length) {
        normal = normals[i];
      }
    }

    // Mover el círculo lo suficiente para que este en la punta del
    // vector normal
    var movement = normal.withLength(this.r - normal.length);
    this.p = this.p.add(movement);
    this.calcBox();


    /*
    // Método 2:
    // En esquinas abiertas, este método aleja el círculo mucho más
    // de lo necesario, y en esquinas cerradas toma más iteraciones
    // que el primero en mover el círculo lo suficiente

    // Calcular el vector de movimiento de cada normal
    var moves = [];
    for (var i = 0; i < normals.length; i++) {
      var normal = normals[i];
      var move = normal.withLength(this.r - normal.length);
      moves.push(move);
    }

    // Sumar todos los movimientos
    var movement = new Vec(0,0);
    for (var i = 0; i < moves.length; i++) {
      movement = movement.add(moves[i]);
    }

    this.p = this.p.add(movement);
    this.calcBox();
    */

    // Seguir haciendo colisiones hasta que la posición apenas cambie
    // o hasta que ya se hayan hecho demasiadas
    if (previous.dist(this.p) > Collision.epsilon && count < Collision.iterations)
    { this.collideWith(that, count+1); }
  }

//=== Geometry ===//

  function Geometry (data, pos, angle) {
    this.data = data;
    if (pos === undefined || pos === null) { pos = new Vec(0,0); }
    if (angle === undefined || angle === null) { angle = 0; }
    this.p = pos;
    this.a = angle;

    // Estos puntos están en coordenadas polares, no cartesianas
    this.points = [];

    for (var i = 0; i < data.length; i+=2) {
      var x = data[i];
      var y = data[i+1];
      var point = new Vec(x,y).toPolar();
      this.points.push(point);
    }

    this.makeSegments();
  }

  Collision.Geometry = Geometry;

  Geometry.prototype.makeSegments = function () {
    this.segments = [];
    this.vertices = [];

    for (var i = 0; i < this.points.length; i++) {
      var polar = this.points[i].rotate(this.a);
      var vert = polar.toVec().add(this.p);
      this.vertices.push(vert);
    }

    var last = this.vertices.length - 1;
    for (var i = 0; i < last; i++) {
      var a = this.vertices[i];
      var b = this.vertices[i+1];
      this.segments.push(new Segment(a,b));
    }
    this.segments.push(new Segment(this.vertices[last], this.vertices[0]));

    // Calcular Caja
    this.box = this.segments[0].box;
    for (var i=1; i < this.segments.length; i++) {
      var seg = this.segments[i];
      var box = seg.box;
      //console.log(seg, box);
      this.box = this.box.combine(box);
    }
  }

  Geometry.prototype.closestPoint = function (p) {
    var closest = this.segments[0].closestPoint(p);
    for (var i = 0; i < this.segments.length; i++) {
      var point = this.segments[i].closestPoint(p);
      if (point.dist(p) < closest.dist(p)) {
        closest = point;
      }
    }

    return closest;
  }

//=== Collection ===//

  function Collection (objs) {
    this.objects = [];

    if (objs instanceof Array) {
      for (var i = 0; i < objs.length; i++) {
        this.add(objs[i]);
      }
    }
  }

  Collision.Collection = Collection;

  Collection.prototype.add = function (obj) {
    if (obj instanceof Polygon) {
      for (var i = obj.segments.length - 1; i >= 0; i--) {
        var segment = obj.segments[i]
        this.add(segment);
      }
    } else {
      this.objects.push(obj);
    }
  }

window.Collision = Collision;
})(window);