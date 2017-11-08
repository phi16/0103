defineAsset("rect",make=>{

const vs = `
precision mediump float;
attribute vec2 position;
varying vec2 coord;
uniform vec2 resolution;
uniform vec2 origin;
uniform vec2 size;
void main(void){
  vec2 pos = (position + 1.) / 2. * size + origin;
  coord = position;
  gl_Position = vec4(pos / resolution * 2. - 1.,0,1);
}
`;

const fs = `
precision mediump float;
varying vec2 coord;
uniform vec4 color;
void main(void){
  gl_FragColor = vec4(color);
}
`;

return make(vs,fs,["color","origin","size"]);

});
