import style from './main.css'

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  distanceFrom(other) {
    var xs = other.x - this.x;
    var ys = other.y - this.y;

    xs *= xs;
    ys *= ys;

    return Math.sqrt(xs + ys);
  }
}

class Particle {
  constructor(x, y, wall) {
    this.p = new Point(x, y);
    this.wall = wall;
    this.density = wall ? 9.0 : 0.0;
    this.force = new Point(0, 0);
    this.velocity = new Point(0, 0);
  }

  distanceFrom(other) {
    return this.p.distanceFrom(other.p);
  }

  get x() { return this.p.x; }
  set x(x) { this.p.x = x; }
  get y() { return this.p.y; }
  set y(y) { this.p.y = y; }
}

Particle.gravity = 1.0;
Particle.pressure = 4.0;
Particle.viscosity = 8.0;


class Canvas {
  constructor() {
    const buffers = [
      document.getElementById("buffer1"),
      document.getElementById("buffer2")
    ];
    const contexts = buffers.map(buf => buf.getContext('2d'));

    this.width = buffers[0].width;
    this.height = buffers[0].height;
    this.ctx = function () {
      // double bufferring
      this.currentBuffer = 1 - this.currentBuffer || 0;
      buffers[1 - this.currentBuffer].style.visibility = 'hidden';
      buffers[this.currentBuffer].style.visibility = 'visible';
      return contexts[this.currentBuffer];
    }

    this.fps = 0;
    this.frameCount = 0;
    this.lastSec = (new Date()).getSeconds();
  }

  resetFromText(text) {
    this.particles = text.split('\n')
      .map((row, y) => row
        .split('')
        .map((c, x) =>
          c == ' ' ? null : [
            new Particle(x, 2 * y, c == '#'),
            new Particle(x, 2 * y + 1, c == '#')
          ])
        .filter(_ => _)
        .reduce((arr, sum) => arr.concat(sum), [])
      )
      .reduce((arr, sum) => arr.concat(sum), []);
  }

  step() {
    // calc density
    const len = this.particles.length;
    var target, particle;
    for (var idx = 0; idx < len; idx++) {
      target = this.particles[idx];
      target.density = target.wall ? 9 : 0;
      for (var iidx = 0; iidx < len; iidx++) {
        particle = this.particles[iidx];
        const d = target.distanceFrom(particle);
        const i = d / 2 - 1;
        if (0 < ~~(1-i))
          target.density += i * i;
      }
    }

    // calc force
    for (var idx = 0; idx < len; idx++) {
      target = this.particles[idx];
      var force = new Point(0, Particle.gravity);
      for (var iidx = 0; iidx < len; iidx++) {
        particle = this.particles[iidx];

        const delta = new Point(target.x - particle.x, target.y - particle.y);
        const d = target.distanceFrom(particle);
        const i = d / 2 - 1;
        if (0 < ~~(1-i)) {
          force.x += i * (delta.x * (3 - target.density - particle.density) * Particle.pressure + (target.velocity.x - particle.velocity.x) * Particle.viscosity) / target.density;
          force.y += i * (delta.y * (3 - target.density - particle.density) * Particle.pressure + (target.velocity.y - particle.velocity.y) * Particle.viscosity) / target.density;
        }
      }
      target.force = force;
    }

    // calc velocity and position
    for (var idx = 0; idx < len; idx++) {
      target = this.particles[idx];
      if (target.wall)
        continue;
      target.velocity.x += target.force.x / 10;
      target.velocity.y += target.force.y / 10;
      target.x += target.velocity.x;
      target.y += target.velocity.y;
    }

  }

  draw() {
    var ctx = this.ctx();
    ctx.fillStyle = 'black';
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.fillStyle = 'darkgreen';
    ctx.font="30px Verdana";

    var node;
    const len = this.particles.length;
    for (var idx = 0; idx < len; idx++) {
      node = this.particles[idx];
      ctx.fillRect(node.x * 8, node.y * 6, 6, 4);
    }

    var second = (new Date()).getSeconds();
    if (this.lastSec != second) {
      this.lastSec = second;
      this.fps = this.frameCount;
      this.frameCount = 0;
    }
    this.frameCount++;

    ctx.fillText("FPS:" + this.fps, this.width - 150, 50);
  }
}

const canvas = new Canvas();
const code = document.getElementById("code");
canvas.resetFromText(code.value);

setInterval(function(){
  canvas.step();
  canvas.draw();
}, 33);

const resetBtn = document.getElementById("resetBtn");

resetBtn.addEventListener("click", function(){
  canvas.resetFromText(code.value);
});

// function render() {
//   canvas.step();
//   canvas.draw();
//   requestAnimationFrame(render);
// }

// render();
