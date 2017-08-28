Util.register("Render","R",_=>{
  const r = {};
  // Action = () -> ()
  // Context
  let canvas = document.getElementById("canvas");
  let context = document.getElementById("canvas").getContext('2d');
  // [R]
  let aff = [1,0,0,0,1,0];
  r.affineArray = _=>aff;
  let cov = (p,q)=>true;
  r.coverShape = _=>cov;
  // [R] -> [R]
  function affProd(a){
    let b = aff;
    let c = [0,0,0,0,0,0];
    c[0] = a[0] * b[0] + a[3] * b[1];
    c[1] = a[1] * b[0] + a[4] * b[1];
    c[2] = a[2] * b[0] + a[5] * b[1] + b[2];
    c[3] = a[0] * b[3] + a[3] * b[4];
    c[4] = a[1] * b[3] + a[4] * b[4];
    c[5] = a[2] * b[3] + a[5] * b[4] + b[5];
    return c;
  }
  // ()
  r.refresh = _=>{
    canvas.width = canvas.width;
  };
  // Color -> Shape -> ()
  r.fill = color=>shape=>{
    context.fillStyle = Color.cssString(color);
    context.beginPath();
    shape.path(context,true);
    context.fill();
  };
  // (R,Color) -> Shape -> ()
  r.stroke = (width,color)=>shape=>{
    context.strokeStyle = Color.cssString(color);
    context.lineWidth = width;
    context.beginPath();
    shape.path(context,false);
    context.stroke();
  };
  // Shape -> Action -> ()
  r.clip = shape=>act=>{
    context.save();
    context.beginPath();
    shape.path(context,true);
    context.clip();
    act();
    context.restore();
  };
  // (R,R,R,Color) -> Action -> ()
  r.shadowed = (x,y,d,color)=>act=>{
    context.save();
    context.shadowColor = Color.cssString(color);
    context.shadowOffsetX = x * aff[0] + y * aff[1];
    context.shadowOffsetY = x * aff[3] + y * aff[4];
    context.shadowBlur = d * Math.abs(aff[0]*aff[4] - aff[1]*aff[3]);
    act();
    context.restore();
  };

  // (R,R,R,R,R,R) -> Action -> ()
  r.affine = (a,b,c,d,e,f)=>act=>{
    let af = aff;
    aff = affProd([a,b,c,d,e,f]);
    context.save();
    context.transform(a,d,b,e,c,f);
    act();
    context.restore();
    aff = af;
  };
  // (R,R) -> Action -> ()
  r.translate = (a,b)=>act=>{
    let af = aff;
    aff = affProd([1,0,a,0,1,b]);
    context.save();
    context.translate(a,b);
    act();
    context.restore();
    aff = af;
  };
  // R -> Action -> ()
  r.rotate = a=>act=>{
    let af = aff;
    let ca = Math.cos(a), sa = Math.sin(a);
    aff = affProd([ca,-sa,0,sa,ca,0]);
    context.save();
    context.rotate(a);
    act();
    context.restore();
    aff = af;
  };
  // (R,R) -> Action -> ()
  r.scale = (a,b)=>act=>{
    let af = aff;
    aff = affProd([a,0,0,0,b,0]);
    context.save();
    context.scale(a,b);
    act();
    context.restore();
    aff = af;
  }
  // (R,R,R) -> Action -> ()
  r.rotateAt = (x,y,a)=>act=>{
    return r.translate(x,y)(_=>r.rotate(a)(_=>r.translate(-x,-y)(act)));
  };
  // (R,R,R,R) -> Action -> ()
  r.scaleAt = (x,y,a,b)=>act=>{
    return r.translate(x,y)(_=>r.scale(a,b)(_=>r.translate(-x,-y)(act)));
  };

  // R -> Action -> ()
  r.alpha = a=>act=>{
    context.save();
    context.globalAlpha *= a;
    act();
    context.restore();
  };

  r.onContext = ctx=>act=>{
    const oldCtx = context;
    context = ctx;
    act();
    context = oldCtx;
  };
  r.clipCover = shape=>act=>{
    const oldCov = cov;
    const sh = Shape.affine(aff[0],aff[1],aff[2],aff[3],aff[4],aff[5])(shape);
    cov = (p,q)=>oldCov(p,q) && sh.inside(p,q);
    act();
    cov = oldCov;
  };

  r.withContext = act=>{
    act(context);
  };
  return r;
});
