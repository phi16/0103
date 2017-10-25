window.addEventListener("load",_=>{

const cvs = document.getElementById("canvas");
const gl = cvs.getContext("webgl");

const scoreCvs = document.getElementById("score");
const ctx = scoreCvs.getContext("2d");
ctx.shadowOffsetX = 0;
ctx.shadowOffsetY = 0;
ctx.shadowBlur = 4;
ctx.shadowColor = "black";
ctx.textAlign = "right";
ctx.fillStyle = "white";

const scrW = 800;
const scrH = 600;

gl.enable(gl.BLEND);
gl.blendFuncSeparate(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA,gl.ONE,gl.ONE);
gl.disable(gl.DEPTH_TEST);
gl.disable(gl.CULL_FACE);
gl.viewport(0,0,scrW,scrH);
gl.clearColor(0,0,0.5,1);

const verts = [-1,-1,-1,1,1,-1,1,1];
const vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER,vbo);
gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(verts),gl.STATIC_DRAW);

function makeRender(vss,fss,locs){
  function makeShader(type,source){
    const s = gl.createShader(type);
    gl.shaderSource(s,source);
    gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){
      console.error(gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  }
  function makeProgram(vs,fs){
    const pr = gl.createProgram();
    gl.attachShader(pr,vs);
    gl.attachShader(pr,fs);
    gl.linkProgram(pr);
    if(!gl.getProgramParameter(pr,gl.LINK_STATUS)){
      console.error(gl.getProgramInfoLog(pr));
      return null;
    }
    return pr;
  }
  const vs = makeShader(gl.VERTEX_SHADER,vss);
  const fs = makeShader(gl.FRAGMENT_SHADER,fss);
  if(!vs || !fs)return null;
  let program = makeProgram(vs,fs);
  if(!program)return null;
  let po = {};
  locs.forEach(loc=>{
    po[loc] = gl.getUniformLocation(program,loc);
  });
  return f=>{
    gl.useProgram(program);
    f(po);
    gl.bindAttribLocation(program,0,"position");
    gl.bindBuffer(gl.ARRAY_BUFFER,vbo);
    gl.vertexAttribPointer(0,2,gl.FLOAT,false,8,0);
    gl.enableVertexAttribArray(0);
    gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
  };
}

const bgVS = `
precision mediump float;
attribute vec2 position;
varying vec2 coord;
void main(void){
  coord = position;
  gl_Position = vec4(coord,0,1);
}
`;
const bgFS = `
precision mediump float;
varying vec2 coord;
uniform float lighten;
void main(void){
  if(coord.y > -0.2){
    gl_FragColor = vec4(vec3(smoothstep(-0.15,-0.2,coord.y)*(-0.05)+0.11),1);
  }else{
    gl_FragColor = vec4(vec3(0.1+lighten*0.25),1);
  }
}
`;
const bgR = makeRender(bgVS,bgFS,["lighten"]);

const cubeVS = `
precision mediump float;
attribute vec2 position;
varying vec2 coord;
uniform vec2 resolution;
uniform vec2 center;
void main(void){
  vec2 pos = position * vec2(120,120) + center;
  coord = position * 1.5;
  gl_Position = vec4(pos / resolution,0,1);
}
`;
const cubeFS = `
precision mediump float;
varying vec2 coord;
uniform float color;
void main(void){
  vec3 col = cos(vec3(1,-1,0)*2./3.*3.141592 + color) * 0.5 + 0.5;
  if(abs(coord.x) < 1. && abs(coord.y) < 1.){
    vec2 c = coord;
    float frame = pow(c.x * 1.1,8.) + pow(c.y * 1.1,8.);
    float core = pow(pow(abs(c.x), 2.) + pow(abs(c.y), 2.), 0.3);
    vec3 ret = col;
    ret *= frame;
    ret += max(0., 1.5 - core) * col;
    gl_FragColor = vec4(ret,1);
  }else{
    float dfx = max(0., abs(coord.x) - 1.), dfy = max(0., abs(coord.y) - 1.);
    float df = max(dfx,dfy);
    gl_FragColor = vec4(vec3(0),exp(-df*20.) - 0.05);
  }
}
`;
const cubeR = makeRender(cubeVS,cubeFS,["center","resolution","color"]);

const lightVS = `
precision mediump float;
attribute vec2 position;
varying vec2 coord;
uniform vec2 resolution;
uniform vec2 center;
uniform float vanish;
void main(void){
  float sz = exp(-vanish/800.);
  float a = -vanish/150.;
  vec2 pos = position * vec2(120,120) * sz;
  pos *= mat2(cos(a),sin(a),-sin(a),cos(a));
  pos += center;
  coord = position * 1.5;
  gl_Position = vec4(pos / resolution,0,1);
}
`;
const lightFS = `
precision mediump float;
varying vec2 coord;
uniform float color;
void main(void){
  vec3 col = cos(vec3(1,-1,0)*2./3.*3.141592 + color + 3.141592) * 0.5 + 0.5;
  vec3 colOrig = cos(vec3(1,-1,0)*2./3.*3.141592 + color) * 0.5 + 0.5;
  if(abs(coord.x) < 1. && abs(coord.y) < 1.){
    vec2 c = coord;
    float frame = pow(pow(abs(c.x * 1.2), 4.) + pow(abs(c.y * 1.2), 4.), 1./4.);
    float core = pow(pow(abs(c.x), 3.) + pow(abs(c.y), 3.), 0.5);
    vec3 ret = vec3(1);
    ret -= frame * col * 0.8;
    ret += max(1.1 - core, 0.);
    ret -= max(0., pow(1.4 - core, 5.)) * col / 3.;
    gl_FragColor = vec4(ret,1);
  }else{
    float dfx = max(0., abs(coord.x) - 1.), dfy = max(0., abs(coord.y) - 1.);
    float df = max(dfx,dfy);
    gl_FragColor = vec4(colOrig*2.,exp(-df*17.) - 0.1);
  }
}
`;
const lightR = makeRender(lightVS,lightFS,["center","resolution","vanish","color"]);

const starVS = `
precision mediump float;
attribute vec2 position;
varying vec2 coord;
uniform vec2 resolution;
uniform vec2 center;
uniform float scale;
uniform float rotate;
void main(void){
  vec2 pos = position * vec2(100,100) * scale;
  float a = rotate;
  pos *= mat2(cos(a),sin(a),-sin(a),cos(a));
  pos += center;
  coord = position * 1.5;
  gl_Position = vec4(pos / resolution,0,1);
}
`;
const starFS = `
precision mediump float;
varying vec2 coord;
void main(void){
  float di = pow(pow(abs(coord.x), 0.7) + pow(abs(coord.y), 0.7), 1./0.7);
  gl_FragColor = vec4(vec3(1.), di<1. ? 1. : exp((1.-di)*8.));
}
`;
const starR = makeRender(starVS,starFS,["center","resolution","scale","rotate"]);

const collisionVS = `
precision mediump float;
attribute vec2 position;
varying vec2 coord;
uniform vec2 resolution;
uniform vec2 center;
uniform float time;
void main(void){
  float scale = max(0., 3.-pow((time-5.)/5.,2.)*2.);
  vec2 pos = position * vec2(120,120) * scale;
  float a = pow(time/10.,3.)*3.;
  pos *= mat2(cos(a),sin(a),-sin(a),cos(a));
  pos += center;
  coord = position * 2.;
  gl_Position = vec4(pos / resolution,0,1);
}
`;
const collisionFS = `
precision mediump float;
varying vec2 coord;
uniform float color;
uniform float time;
void main(void){
  vec3 col = cos(vec3(1,-1,0)*2./3.*3.141592 + color) * 0.5 + 0.5;
  float e = 2.;
  vec2 c = coord.xy;
  if(abs(c.x) < 1. && abs(c.y) < 1.){
    float frame = pow(c.x * 1.1,8.) + pow(c.y * 1.1,8.);
    float core = pow(pow(abs(c.x), 2.) + pow(abs(c.y), 2.), 0.3);
    vec3 ret = col;
    ret *= frame;
    ret += max(0., 1.5 - core) * col;
    ret += max(0., 1.5 - core) * vec3(1);
    gl_FragColor = vec4(ret,1);
  }else{
    float dfx = max(0., abs(c.x) - 1.), dfy = max(0., abs(c.y) - 1.);
    float df = max(dfx,dfy);
    gl_FragColor = vec4(col,exp(-df*10.) - 0.05);
  }
}
`;
const collisionR = makeRender(collisionVS,collisionFS,["center","resolution","color","time"]);

const deadVS = `
precision mediump float;
attribute vec2 position;
varying vec2 coord;
uniform vec2 resolution;
uniform vec2 center;
uniform float time;
void main(void){
  float scale = time;
  vec2 pos = position * vec2(120,120) * scale;
  float a = pow(time/10.,3.)*3.;
  pos *= mat2(cos(a),sin(a),-sin(a),cos(a));
  pos += center;
  coord = position * 2.;
  gl_Position = vec4(pos / resolution,0,1);
}
`;
const deadFS = `
precision mediump float;
varying vec2 coord;
uniform float time;
void main(void){
  vec3 col = vec3(0);
  float e = 2.;
  vec2 c = coord.xy;
  if(abs(c.x) < 1. && abs(c.y) < 1.){
    float frame = pow(c.x * 1.1,8.) + pow(c.y * 1.1,8.);
    float core = pow(pow(abs(c.x), 2.) + pow(abs(c.y), 2.), 0.3);
    vec3 ret = col;
    ret *= frame;
    ret += max(0., 1.5 - core) * col;
    ret += max(0., 1.5 - core) * vec3(0);
    gl_FragColor = vec4(ret,1);
  }else{
    float dfx = max(0., abs(c.x) - 1.), dfy = max(0., abs(c.y) - 1.);
    float df = max(dfx,dfy);
    gl_FragColor = vec4(col,exp(-df*10.) - 0.05);
  }
  if(time > 40.){
    gl_FragColor.a *= 1.-(time-40.)/60.;
  }
}
`;
const deadR = makeRender(deadVS,deadFS,["center","resolution","color","time"]);

let size = 80;
let blockStack = [], cubeSeq = [], blockDispose = [], collision = [];
let colorOf = [7,5,9];
let frame = 0, period = 120, score = 0;
let fail = false, failTime = 0;
let maxScore = 0;

function randGen(){
  let rest = [];
  return _=>{
    if(rest.length == 0){
      rest.push(0,1,2);
      let i,t;
      i = Math.floor(Math.random()*3);
      t=rest[i];rest[i]=rest[0];rest[0]=t;
      i = Math.floor(Math.random()*2)+1;
      t=rest[i];rest[i]=rest[1];rest[1]=t;
      return rest.shift();
    }else{
      return rest.shift();
    }
  };
}
let blockGen = randGen();
let cubeGen = randGen();

function init(){
  frame = 0, period = 120, score = 0;
  blockStack = [];
  fail = false, failTime = 0;
  for(let i=0;i<20;i++){
    blockStack.push({
      hue: blockGen(),
      x: -500,
      y: i*(size*2+5) + 800,
      vy: 0
    });
    cubeSeq.push({
      hue: cubeGen(),
      x: i*size*7,
      y: -35
    });
  }
}
init();

function disposeBlock(){
  let b = blockStack.shift();
  b.vy = -20;
  blockDispose.push(b);
  blockStack.push({
    hue: blockGen(),
    x: -500,
    y: 5000,
    vy: 0
  });
  blockStack.forEach(b=>{
    b.vy = -20.;
  });
}

let fastEff = 0;
function fastEffect(){
  fastEff = 1;
}

function step(){
  for(let i=0;i<blockStack.length;i++){
    let b = blockStack[i];
    let dirY = i==0 ? -35 : blockStack[i-1].y + (size*2+5);
    if(dirY < b.y - 5.){
      b.vy -= 2.;
      b.y += b.vy;
    }else{
      b.y += (dirY - b.y) / 2.;
      b.vy = 0.;
    }
  }
  for(let i=0;i<cubeSeq.length;i++){
    let c = cubeSeq[i];
    let dirX = i*size*7;
    c.x += (dirX - c.x) / 4.;
  }
  for(let i=0;i<blockDispose.length;i++){
    let b = blockDispose[i];
    b.vy -= 4.;
    b.y += b.vy;
    if(b.y < -600){
      blockDispose.splice(i,1);
      i--;
    }
  }
  if(!fail && frame == Math.floor(period/2)){
    let b = blockStack.shift();
    let c = cubeSeq.shift();
    blockStack.push({
      hue: blockGen(),
      x: -500,
      y: 5000,
      vy: 0
    });
    cubeSeq.push({
      hue: cubeGen(),
      x: 5000,
      y: -35
    });
    if(b.hue == c.hue){
      collision.push({
        block: b,
        cube: c,
        time: 0
      });
      score++;
      if(score == 5) period = 100, fastEffect();
      if(score == 10) period = 90, fastEffect();
      if(score == 20) period = 80, fastEffect();
      if(score == 40) period = 70, fastEffect();
      if(score == 60) period = 60, fastEffect();
      if(score == 80) period = 55, fastEffect();
      if(score == 100) period = 50, fastEffect();
    }else{
      fail = true;
      failTime = 0;
    }
  }
}
let pushed = {};
window.addEventListener("keydown",e=>{
  if(pushed[e.keyCode])return;
  disposeBlock();
  pushed[e.keyCode] = true;
});
window.addEventListener("keyup",e=>{
  delete pushed[e.keyCode];
});

function render(){
  gl.clear(gl.COLOR_BUFFER_BIT);
  bgR(q=>{
    gl.uniform1f(q["lighten"], fastEff);
    fastEff-=0.05;
    if(fastEff<0)fastEff=0;
  });
  for(let i=blockDispose.length-1;i>-1;i--){
    let b = blockDispose[i];
    lightR(q=>{
      gl.uniform1f(q["color"],colorOf[b.hue]);
      gl.uniform1f(q["vanish"],-b.y);
      gl.uniform2f(q["center"],b.x,b.y);
      gl.uniform2f(q["resolution"],800,600);
    });
  }
  for(let i=0;i<collision.length;i++){
    let c = collision[i];
    collisionR(q=>{
      gl.uniform1f(q["color"],colorOf[c.cube.hue]);
      gl.uniform2f(q["center"],-100,-35);
      gl.uniform2f(q["resolution"],800,600);
      gl.uniform1f(q["time"],c.time);
    });
    c.time++;
    if(c.time > 10){
      collision.splice(i,1);
      i--;
    }
  }
  for(let i=blockStack.length-1;i>-1;i--){
    let b = blockStack[i];
    lightR(q=>{
      gl.uniform1f(q["color"],colorOf[b.hue]);
      gl.uniform1f(q["vanish"],0);
      gl.uniform2f(q["center"],b.x,b.y);
      gl.uniform2f(q["resolution"],800,600);
    });
  }
  for(let i=cubeSeq.length-1;i>-1;i--){
    let c = cubeSeq[i];
    cubeR(q=>{
      gl.uniform1f(q["color"],colorOf[c.hue]);
      gl.uniform2f(q["center"],c.x,c.y);
      gl.uniform2f(q["resolution"],800,600);
    });
  }
  if(fail){
    deadR(q=>{
      gl.uniform2f(q["center"],-100,-35);
      gl.uniform2f(q["resolution"],800,600);
      gl.uniform1f(q["time"],failTime);
    });
    failTime++;
    if(failTime == 40){
      blockStack = [];
      maxScore = Math.max(score,maxScore);
      score = 0;
    }
    if(failTime > 100){
      init();
    }
  }

  if(!fail){
    starR(q=>{
      if(frame < period * 0.5){
        let t = frame/(period*0.5), e = 1-t;
        gl.uniform2f(q["center"],-600-150*(1-Math.pow(e,2)),-35);
        gl.uniform1f(q["scale"],0.7*(1-Math.pow(e,2)));
        gl.uniform1f(q["rotate"],Math.pow(e,3)*10.);
      }else if(frame < period * 0.5 + 3){
        let t = frame/(period*0.5) - 1, e = 1-t;
        gl.uniform2f(q["center"],-780+3000*(1-Math.pow(e,3)),-35);
        gl.uniform1f(q["rotate"],t*100.);
      }else{
        gl.uniform1f(q["scale"],0);
      }
      gl.uniform2f(q["resolution"],800,600);
    });
  }
  step();
  frame++;
  if(frame > period)frame -= period;

  ctx.clearRect(0,0,800,600);
  if(maxScore){
    ctx.globalAlpha = 0.5;
    ctx.font = "40px 'Josefin Sans'";
    ctx.fillText(maxScore,750,490);
    ctx.globalAlpha = 1;
  }
  ctx.font = "70px 'Josefin Sans'";
  ctx.fillText(score,750,550);

  requestAnimationFrame(render);
}
render();

});
