const scrW = 800;
const scrH = 600;
let R, A;

window.addEventListener("load",_=>{
  const cvs = document.getElementById("canvas");
  const gl = cvs.getContext("webgl");

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
    locs.push("resolution");
    locs.forEach(loc=>{
      po[loc] = gl.getUniformLocation(program,loc);
    });
    function setting(spec, args){
      let n = args.length - 1;
      let func = "uniform" + (args.length - 1) + spec;
      let name = args[0];
      let as = [];
      for(let i=0;i<n;i++)as.push(args[i+1]);
      gl[func](po[name],as);
    }
    let setter = {
      i: function(){setting("iv",arguments);},
      f: function(){setting("fv",arguments);}
    };
    return f=>{
      gl.useProgram(program);
      f(setter);
      setting("fv",["resolution",scrW,scrH]);
      gl.bindAttribLocation(program,0,"position");
      gl.bindBuffer(gl.ARRAY_BUFFER,vbo);
      gl.vertexAttribPointer(0,2,gl.FLOAT,false,8,0);
      gl.enableVertexAttribArray(0);
      gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
    };
  }

  const textCvs = document.getElementById("text");
  const ctx = textCvs.getContext('2d');
  ctx.font = "25px 'number'";
  ctx.fillStyle = "rgb(128,64,0)";

  R = {
    make: makeRender,
    clear: _=>{
      gl.clear(gl.COLOR_BUFFER_BIT);
      ctx.clearRect(0,0,scrW,scrH);
    },
    rect:(x,y,w,h)=>{
      ctx.beginPath();
      ctx.rect(x/2+scrW/2,scrH/2-y/2,w/2,h/2);
      ctx.fill();
    },
    text:(x,y,s,align,text)=>{
      ctx.textAlign = align;
      ctx.font = (s/2) + "px 'number'";
      ctx.fillText(text,x/2+scrW/2,scrH/2-y/2);
    }
  };
  A = makeAssets(makeRender);
  launch();
});
