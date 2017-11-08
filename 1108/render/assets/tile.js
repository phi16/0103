defineAsset("tile",make=>{

const vs = `
precision mediump float;
attribute vec2 position;
varying vec2 coord;
uniform vec2 resolution;
uniform vec2 center;
uniform vec2 size;
uniform vec2 move;
void main(void){
  mat2 rot = mat2(0.5,0.5,0.25,-0.25);
  vec2 pos = position * rot * size + center + move * rot;
  coord = position;
  gl_Position = vec4(pos / resolution * 2. - 1.,0,1);
}
`;

const fs = `
precision mediump float;
varying vec2 coord;
uniform float effect;
uniform float color;
void main(void){
  vec3 col = mix(mix(vec3(0,0.5,1),vec3(0.5,1.5,1.5),effect),vec3(1,0.5,0),color);
  float h = max(abs(coord.x),abs(coord.y));
  if(h < 0.7) col = mix(mix(vec3(0,0.2,0.4),vec3(1,2,2),effect),vec3(1,1,0),color);
  col *= (coord.x - coord.y) * 0.2 + 0.8;
  gl_FragColor = vec4(col,1);
}
`;

return make(vs,fs,["color","effect","center","move","size"]);

});
