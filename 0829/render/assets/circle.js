defineAsset("circle",make=>{

const vs = `
precision mediump float;
attribute vec2 position;
varying vec2 coord;
uniform vec2 resolution;
uniform vec2 origin;
uniform float radius;
uniform vec2 axis;
void main(void){
  vec2 pos = position * radius * 1.4 + origin;
  coord = position * 1.4;
  coord = axis * coord.x + vec2(axis.y,-axis.x) * coord.y;
  gl_Position = vec4(pos / resolution * 2. - 1.,0,1);
}
`;

const fs = `
precision mediump float;
varying vec2 coord;
uniform vec4 color;
uniform float clip;
uniform float angle;
float frame(float d) {
  float blur = pow(smoothstep(0.5,0.0,d),2.0) * 0.8;
  float core = 1.2 - pow(max(0.,-d), 0.3) * 0.3;
  return mix(core, blur, smoothstep(-0.1,0.1,d));
}
void main(void){
  float d = (length(coord) - 1.0) * 1.5;
  float str1 = frame(d);
  float a = angle;
  vec2 coord2 = coord + vec2(0.3,0);
  vec2 n1 = vec2(-cos(a),sin(a)), n2 = vec2(-cos(a),-sin(a));
  d = max(d, - max(dot(n1,coord2), dot(n2,coord2)) * 1.5);
  float str2 = frame(d);
  gl_FragColor = vec4(color.rgb * mix(str1,str2,clip), color.a);
}
`;

return make(vs,fs,["color","origin","radius","clip","axis","angle"]);

});
