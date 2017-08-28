Util.register("Color",_=>{
  const c = {};
  // Color -> String
  c.cssString = col=>{
    const r = Math.floor(Math.min(255,Math.max(0,col.r*256)));
    const g = Math.floor(Math.min(255,Math.max(0,col.g*256)));
    const b = Math.floor(Math.min(255,Math.max(0,col.b*256)));
    const a = Math.min(1,  Math.max(0,col.a));
    return "rgba("+r+","+g+","+b+","+a+")";
  };
  // (R,R,R,R) -> Color
  function kon(r,g,b,a){
    return {r:r,g:g,b:b,a:a};
  }
  // (R,R,R) -> Color
  c.rgb = (r,g,b)=>{
    return kon(r,g,b,1);
  };
  // (R,R,R) -> Color
  c.rgb255 = (r,g,b)=>{
    return kon(r/255,g/255,b/255,1);
  };
  // (R,R,R,R) -> Color
  c.rgba = (r,g,b,a)=>{
    return kon(r,g,b,a);
  };
  // (R,R,R,R) -> Color
  c.rgb255a = (r,g,b,a)=>{
    return kon(r/255,g/255,b/255,a);
  };
  c.alpha = (col,a)=>{
    return kon(col.r,col.g,col.b,a);
  };
  c.mix = (c1,c2,a)=>{
    let b = 1-a;
    return kon(c1.r*a+c2.r*b,c1.g*a+c2.g*b,c1.b*a+c2.b*b,c1.a*a+c2.a*b);
  };
  c.white = c.rgb(1,1,1);
  c.black = c.rgb(0,0,0);
  return c;
});
