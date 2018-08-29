defineAsset("trigger",make=>{

const vs = `
precision mediump float;
attribute vec2 position;
varying vec2 coord;
uniform vec2 resolution;
uniform vec2 origin;
uniform float size;
uniform vec2 axis;
void main(void){
  vec2 pos = position * size * 1.4 + origin;
  coord = position * 1.4;
  coord = axis * coord.x + vec2(axis.y,-axis.x) * coord.y;
  gl_Position = vec4(pos / resolution * 2. - 1.,0,1);
}
`;

const fs = `
precision mediump float;
varying vec2 coord;
uniform vec4 color;
float frame(float d) {
  float blur = pow(smoothstep(0.5,0.0,d),2.0) * 0.8;
  float core = 1.2 - pow(max(0.,-d), 0.3) * 0.3;
  return mix(core, blur, smoothstep(-0.1,0.1,d));
}
void main(void){
  float d = max(coord.x+coord.y*2., coord.x-coord.y*2.) - 1.0;
  d = max(d, (-1.0-coord.x) * 2.);
  gl_FragColor = vec4(color.rgb * frame(d), color.a);
}
`;

return make(vs,fs,["color","origin","size","axis"]);

});
