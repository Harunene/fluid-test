import style from './main.css'

const example1 = `
#  include<stdio.h>//  .IOCCC                                         Fluid-  #
#  include <unistd.h>  //2012                                         _Sim!_  #
#  include<complex.h>  //||||                     ,____.              IOCCC-  #
#  define              h for(                     x=011;              2012/*  #
#  */-1>x              ++;)b[                     x]//-'              winner  #
#  define              f(p,e)                                         for(/*  #
#  */p=a;              e,p<r;                                        p+=5)//  #
#  define              z(e,i)                                        f(p,p/*  #
## */[i]=e)f(q,w=cabs  (d=*p-  *q)/2-     1)if(0  <(x=1-      w))p[i]+=w*/// ##
   double complex a [  97687]  ,*p,*q     ,*r=a,  w=0,d;    int x,y;char b/* ##
## */[6856]="\\x1b[2J"  "\\x1b"  "[1;1H     ", *o=  b, *t;   int main   (){/** ##
## */for(              ;0<(x=  getc (     stdin)  );)w=x  >10?32<     x?4[/* ##
## */*r++              =w,r]=  w+1,*r     =r[5]=  x==35,  r+=9:0      ,w-I/* ##
## */:(x=              w+2);;  for(;;     puts(o  ),o=b+  4){z(p      [1]*/* ##
## */9,2)              w;z(G,  3)(d*(     3-p[2]  -q[2])  *P+p[4      ]*V-/* ##
## */q[4]              *V)/p[  2];h=0     ;f(p,(  t=b+10  +(x=*p      *I)+/* ##
## */80*(              y=*p/2  ),*p+=p    [4]+=p  [3]/10  *!p[1])     )x=0/* ##
## */ <=x              &&x<79   &&0<=y&&y<23?1[1  [*t|=8   ,t]|=4,t+=80]=1/* ##
## */, *t              |=2:0;    h=" '\`-.|//,\\\\"  "|\\\\_"    "\\\\/\\x23\\n"[x/** ##
## */%80-              9?x[b]      :16];;usleep(  12321)      ;}return 0;}/* ##
####                                                                       ####
###############################################################################
**###########################################################################*/
`

const example2 = `





###  ...............                                                   ###
### .................                                                  ###
### .................                                                  ###
### .................                                                  ###
### .................                                                  ###
### .................                                                  ###
### .................                                                  ###
### .................                                                  ###
### .................                                                  ###
### .................                                                  ###
### .................                                                  ###
### .................                                                  ###
### .................                                                  ###
### .................                                                  ###
### .................                                                  ###
###  ...............                                                   ###
##########################################################################
 ########################################################################

`

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
canvas.resetFromText(example2);
canvas.draw();

setInterval(function(){
  canvas.step();
  canvas.draw();
}, 33);

// function render() {
//   canvas.step();
//   canvas.draw();
//   requestAnimationFrame(render);
// }

// render();
