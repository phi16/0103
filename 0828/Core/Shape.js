Util.register("Shape","S",_=>{
  const s = {};
  // Region = (R,R) -> Bool
  // Path   = (Context,Bool) -> ()
  // (Region,Path) -> Shape
  function kon(region,path){
    return {region:region,path:path,inside:region};
  }

  s.empty = kon((p,q)=>{
    return false;
  },(ctx,isFill)=>{
  });
  // (R,R,R,R) -> Shape
  s.line = (x1,y1,x2,y2)=>kon((p,q)=>{
    return false;
  },(ctx,isFill)=>{
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
  });
  // (R,R,R,R) -> Shape
  s.rect = (x,y,w,h)=>kon((p,q)=>{
    return x <= p && p <= x+w && y <= q && q <= y+h;
  },(ctx,isFill)=>{
    ctx.rect(x,y,w,h);
  });
  // (R,R,R) -> Shape
  s.circle = (x,y,r)=>kon((p,q)=>{
    return (x-p)*(x-p)+(y-q)*(y-q) <= r*r;
  },(ctx,isFill)=>{
    ctx.moveTo(x+r,y);
    ctx.arc(x,y,r,0,2*Math.PI,false);
  });
  // (R,R,R,R) -> Shape
  s.centerRect = (x,y,w,h)=>s.rect(x-w/2,y-h/2,w,h);
  // (R,R,R,R,R) -> Shape
  s.roundRect = (x,y,w,h,r)=>kon((p,q)=>{
    let p1 = p - x - w/2;
    let q1 = q - y - h/2;
    let p2 = Math.max(0,Math.abs(p1)-w/2+r);
    let q2 = Math.max(0,Math.abs(q1)-h/2+r);
    return p2*p2+q2*q2 <= r*r;
  },(ctx,isFill)=>{
    ctx.moveTo(x+r,y,w,h);
    ctx.arc(x+w-r,y+r,r,-Math.PI/2,0,false);
    ctx.arc(x+w-r,y+h-r,r,0,Math.PI/2,false);
    ctx.arc(x+r,y+h-r,r,Math.PI/2,-Math.PI,false);
    ctx.arc(x+r,y+r,r,-Math.PI,-Math.PI/2,false);
  });
  // [R] -> Shape
  s.lines = (ps)=>kon((p,q)=>{
    return false;
  },(ctx,isFill)=>{
    ctx.moveTo(ps[0],ps[1]);
    for(let i=2;i<ps.length;i+=2){
      ctx.lineTo(ps[i],ps[i+1]);
    }
  });
  // [R] -> Shape
  s.polygon = (ps)=>kon((p,q)=>{
    return false; // TODO?
  },(ctx,isFill)=>{
    ctx.moveTo(ps[0],ps[1]);
    for(let i=2;i<ps.length;i+=2){
      ctx.lineTo(ps[i],ps[i+1]);
    }
    ctx.lineTo(ps[0],ps[1]);
  });
  // (R,R,R,String,{-1,0,1},{-1,0,1}) -> Shape
  s.text = (x,y,s,str,xb,yb)=>kon((p,q)=>{
    return false;
  },(ctx,isFill)=>{
    ctx.save();
    ctx.textAlign = xb==0 ? "center" : xb==1 ? "right" : "left";
    ctx.textBaseline = yb==0 ? "middle" : yb==1 ? "alphabetic" : "hanging";
    ctx.font = "10px mplus";
    ctx.translate(x,y);
    ctx.scale(s/10,s/10);
    if(isFill)ctx.fillText(str,0,0);
    else ctx.strokeText(str,0,0);
    ctx.restore();
  });
  // (R,R,R,String,{-1,0,1},{-1,0,1}) -> Shape
  s.numberText = (x,y,s,str,xb,yb)=>kon((p,q)=>{
    return false;
  },(ctx,isFill)=>{
    ctx.save();
    ctx.textAlign = xb==0 ? "center" : xb==1 ? "right" : "left";
    ctx.textBaseline = yb==0 ? "middle" : yb==1 ? "alphabetic" : "hanging";
    ctx.font = "11.5px 'alte din'";
    ctx.translate(x,y);
    ctx.scale(s/10,s/10);
    if(isFill)ctx.fillText(str,0,0);
    else ctx.strokeText(str,0,0);
    ctx.restore();
  });

  // [Shape] -> Shape
  s.union = (us)=>kon((p,q)=>{
    let b = false;
    us.forEach(u=>{
      if(u.region(p,q))b = true;
    });
    return b;
  },(ctx,isFill)=>{
    us.forEach(u=>{
      u.path(ctx,isFill);
    });
  });
  // [Shape] -> Shape
  s.intersect = (us)=>kon((p,q)=>{
    let b = true;
    us.forEach(u=>{
      if(!u.region(p,q))b = false;
    });
    return b;
  },(ctx,isFill)=>{
    us.forEach(u=>{
      u.path(ctx,isFill);
    });
  });
  // Shape -> Shape
  s.invert = (s)=>kon((p,q)=>{
    return !s.region(p,q);
  },(ctx,isFill)=>{
    ctx.rect(-1000,-1000,2000,2000);
    s.path(ctx,isFill);
  });
  // (() -> Shape) -> Shape
  s.delay = (act)=>kon((p,q)=>{
    return act().region(p,q);
  },(ctx,isFill)=>{
    act().path(ctx,isFill);
  });

  // (R,R,R,R,R,R) -> Shape -> Shape
  s.affine = (a,b,c,d,e,f)=>act=>kon((p,q)=>{
    let ix = -b*f + b*q + e*c - e*p
    let iy =  a*f - a*q - d*c + d*p
    let z = b*d - a*e
    return act.region(ix/z,iy/z);
  },(ctx,isFill)=>{
    ctx.save();
    ctx.transform(a,d,b,e,c,f);
    act.path(ctx,isFill);
    ctx.restore();
  });
  // (R,R) -> Shape -> Shape
  s.translate = (a,b)=>act=>kon((p,q)=>{
    let x = p-a;
    let y = q-b;
    return act.region(x,y);
  },(ctx,isFill)=>{
    ctx.save();
    ctx.translate(a,b);
    act.path(ctx,isFill);
    ctx.restore();
  });
  // R -> Shape -> Shape
  s.rotate = a=>act=>kon((p,q)=>{
    let x =  p*Math.cos(a)+q*Math.sin(a);
    let y = -p*Math.sin(a)+q*Math.cos(a);
    return act.region(x,y);
  },(ctx,isFill)=>{
    ctx.save();
    ctx.rotate(a);
    act.path(ctx,isFill);
    ctx.restore();
  });
  // (R,R) -> Shape -> Shape
  s.scale = (a,b)=>act=>kon((p,q)=>{
    let x = p/a;
    let y = q/b;
    return act.region(x,y);
  },(ctx,isFill)=>{
    ctx.save();
    ctx.scale(a,b);
    act.path(ctx,isFill);
    ctx.restore();
  });
  // (R,R,R,R) -> Shape -> Shape
  s.rotateAt = (x,y,a)=>act=>{
    return s.translate(x,y)(s.rotate(a)(s.translate(-x,-y)(act)));
  };
  // (R,R,R,R) -> Shape -> Shape
  s.scaleAt = (x,y,a,b)=>act=>{
    return s.translate(x,y)(s.scale(a,b)(s.translate(-x,-y)(act)));
  };
  return s;
});
