Util.register("Image",_=>{
  const i = {};
  const imCache = {};
  function imageCache(name){
    if(imCache[name])return imCache[name];
    const elem = document.createElement("img");
    elem.src = name;
    elem.loaded = false;
    elem.onload = _=>{
      elem.loaded = true;
    };
    return imCache[name] = elem;
  }
  function makeImage(name,elem){
    return {
      name : name,
      width : _=>elem.width,
      height : _=>elem.height,
      element : elem,
      loaded : _=>elem.loaded,
      draw : _=>{
        if(elem.loaded)Render.withContext(ctx=>{
          ctx.drawImage(elem,0,0);
        });
      },
      drawClipped : (x,y,w,h)=>{
        if(elem.loaded)Render.withContext(ctx=>{
          ctx.drawImage(elem,x,y,w,h,0,0,w,h);
        });
      }
    };
  }
  i.get = str=>{
    return makeImage(str,imageCache(str));
  };

  var cvsCache = {};
  function canvasCache(name,w,h){
    if(!cvsCache[name] || cvsCache[name].w!=w || cvsCache[name].h!=h){
      let sCvs = document.createElement('canvas');
      sCvs.width = w, sCvs.height = h;
      sCvs.id = name;
      sCvs.loaded = true;
      let sCtx = sCvs.getContext('2d');
      cvsCache[name] = {
        canvas : sCvs,
        context : sCtx,
        w : w,
        h : h,
        value : null
      };
    }
  }
  function beginCache(name,x,y,w,h,rx,ry,v){
    rx = Math.floor(rx), ry = Math.floor(ry);
    canvasCache(name,rx,ry);
    let ch = cvsCache[name];
    if(ch.value != null && ch.value == v)return null;
    let ctx = ch.context;
    ctx.clearRect(0,0,rx,ry);
    ctx.save();
    ctx.scale(rx/w,ry/h);
    ctx.translate(-x,-y);
    return ctx;
  }
  function endCache(name,v){
    let ch = cvsCache[name];
    ch.context.restore();
    ch.value = v;
  }
  i.getCache = function(name){
    return makeImage(name,cvsCache[name].canvas);
  };
  i.cache = function(name,x,y,w,h,rx,ry,value){
    const v = Util.hash(value);
    return act=>{
      const ctx = beginCache(name,x,y,w,h,rx,ry,v);
      if(ctx){
        R.onContext(ctx)(act);
        endCache(name,v);
      }
      const img = i.getCache(name);
      R.translate(x,y)(_=>R.scale(w/rx,h/ry)(img.draw));
    };
  };
  return i;
});
