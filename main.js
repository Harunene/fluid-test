!function(t){var e={};function n(r){if(e[r])return e[r].exports;var i=e[r]={i:r,l:!1,exports:{}};return t[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)n.d(r,i,function(e){return t[e]}.bind(null,i));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=0)}([function(t,e,n){"use strict";var r=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}();!function(t){t&&t.__esModule}(n(1));function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var s=function(){function t(e,n){i(this,t),this.x=e,this.y=n}return r(t,[{key:"distanceFrom",value:function(t){var e=t.x-this.x,n=t.y-this.y;return e*=e,n*=n,Math.sqrt(e+n)}}]),t}(),o=function(){function t(e,n,r){i(this,t),this.p=new s(e,n),this.wall=r,this.density=r?9:0,this.force=new s(0,0),this.velocity=new s(0,0)}return r(t,[{key:"distanceFrom",value:function(t){return this.p.distanceFrom(t.p)}},{key:"x",get:function(){return this.p.x},set:function(t){this.p.x=t}},{key:"y",get:function(){return this.p.y},set:function(t){this.p.y=t}}]),t}();o.gravity=1,o.pressure=4,o.viscosity=8;var u=new(function(){function t(){i(this,t);var e=[document.getElementById("buffer1"),document.getElementById("buffer2")],n=e.map(function(t){return t.getContext("2d")});this.width=e[0].width,this.height=e[0].height,this.ctx=function(){return this.currentBuffer=1-this.currentBuffer||0,e[1-this.currentBuffer].style.visibility="hidden",e[this.currentBuffer].style.visibility="visible",n[this.currentBuffer]},this.fps=0,this.frameCount=0,this.lastSec=(new Date).getSeconds()}return r(t,[{key:"resetFromText",value:function(t){this.particles=t.split("\n").map(function(t,e){return t.split("").map(function(t,n){return" "==t?null:[new o(n,2*e,"#"==t),new o(n,2*e+1,"#"==t)]}).filter(function(t){return t}).reduce(function(t,e){return t.concat(e)},[])}).reduce(function(t,e){return t.concat(e)},[])}},{key:"step",value:function(){for(var t,e,n=this.particles.length,r=0;r<n;r++){(t=this.particles[r]).density=t.wall?9:0;for(var i=0;i<n;i++){e=this.particles[i];var u=t.distanceFrom(e)/2-1;0<~~(1-u)&&(t.density+=u*u)}}for(r=0;r<n;r++){t=this.particles[r];var c=new s(0,o.gravity);for(i=0;i<n;i++){e=this.particles[i];var f=new s(t.x-e.x,t.y-e.y),a=t.distanceFrom(e)/2-1;0<~~(1-a)&&(c.x+=a*(f.x*(3-t.density-e.density)*o.pressure+(t.velocity.x-e.velocity.x)*o.viscosity)/t.density,c.y+=a*(f.y*(3-t.density-e.density)*o.pressure+(t.velocity.y-e.velocity.y)*o.viscosity)/t.density)}t.force=c}for(r=0;r<n;r++)(t=this.particles[r]).wall||(t.velocity.x+=t.force.x/10,t.velocity.y+=t.force.y/10,t.x+=t.velocity.x,t.y+=t.velocity.y)}},{key:"draw",value:function(){var t,e=this.ctx();e.fillStyle="black",e.clearRect(0,0,this.width,this.height),e.fillStyle="darkgreen",e.font="30px Verdana";for(var n=this.particles.length,r=0;r<n;r++)t=this.particles[r],e.fillRect(8*t.x,6*t.y,6,4);var i=(new Date).getSeconds();this.lastSec!=i&&(this.lastSec=i,this.fps=this.frameCount,this.frameCount=0),this.frameCount++,e.fillText("FPS:"+this.fps,this.width-150,50)}}]),t}());u.resetFromText("\n\n\n\n\n\n###  ...............                                                   ###\n### .................                                                  ###\n### .................                                                  ###\n### .................                                                  ###\n### .................                                                  ###\n### .................                                                  ###\n### .................                                                  ###\n### .................                                                  ###\n### .................                                                  ###\n### .................                                                  ###\n### .................                                                  ###\n### .................                                                  ###\n### .................                                                  ###\n### .................                                                  ###\n### .................                                                  ###\n###  ...............                                                   ###\n##########################################################################\n ########################################################################\n\n"),u.draw(),setInterval(function(){u.step(),u.draw()},33)},function(t,e,n){}]);