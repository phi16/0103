const Util = (_=>{
  const u = {};
  u.realWidth = 0;
  u.realHeight = 0;
  u.width = 800;
  u.height = 600;
  let handlers = {};
  u.register = (name,short,f)=>{
    if(typeof f === "undefined"){
      handlers[name] = {func:short};
    }else{
      handlers[name] = {short:short,func:f};
    }
  };
  window.onload = function(){
    u.canvas = document.getElementById("canvas");
    function make(name){
      return (x,y,w,h)=>{
        u[name].style.left = x + "px";
        u[name].style.top = y + "px";
        u[name].style.width = w + "px";
        u[name].style.height = h + "px";
      };
    }
    function resize(){
      const w = document.getElementById("container").clientWidth;
      const h = document.getElementById("container").clientHeight;
      u.realLeft = u.canvas.style.left = (w-u.width)/2;
      u.realTop = u.canvas.style.top = (h-u.height)/2;
      u.realWidth = u.canvas.width = u.width;
      u.realHeight = u.canvas.height = u.height;
    }
    resize();
    window.onresize = resize;
    Object.keys(handlers).forEach(n=>{
      window[n] = handlers[n].func();
      if(handlers[n].short){
        window[handlers[n].short] = window[n];
      }
    });
  };
  u.clone = obj=>{
    var copy;
    if (null == obj || "object" != typeof obj) return obj;
    if (obj instanceof Date) {
      copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }
    if (obj instanceof Array) {
      copy = [];
      for (var i=0,len=obj.length;i<len;i++) {
        copy[i] = u.clone(obj[i]);
      }
      return copy;
    }
    if (obj instanceof Object) {
      copy = {};
      for (var attr in obj) {
        if(obj.hasOwnProperty(attr))copy[attr] = u.clone(obj[attr]);
      }
      return copy;
    }
    throw new Error("Unable to clone");
  };
  u.pad = (n,val)=>{
    const str = "00"+Math.floor(val+0.5);
    return str.substr(str.length-2,2);
  };
  u.handCursor = _=>document.body.style.cursor = "pointer";
  u.autoCursor = _=>document.body.style.cursor = "auto";
  u.measure = (text,size)=>{
    let w;
    R.withContext(ctx=>{
      w = ctx.measureText(text).width;
    });
    if(text.length>0 && text[text.length-1]=="。")w -= 5;
    return w*size/10;
  };
  u.hash = v=>{
    if(v instanceof Array){
      let acc = v.length|0;
      for(let i=0;i<v.length;i++){
        acc ^= u.hash(v[i]);
        acc = acc*16777619|0;
      }
      return acc;
    }else if(typeof v === "string" || v instanceof String){
      let acc = v.length|0;
      for(let i=0;i<v.length;i++){
        acc ^= u.hash(v.charCodeAt(i));
        acc = acc*16777619|0;
      }
      return acc;
    }else if(v instanceof Function){ // Easing
      return u.hash(v());
    }else if(v.ease!==undefined){ // Active Frame
      return u.hash(v.ease());
    }else if(v.value!==undefined && v.expo!==undefined){ // Number Listetener
      return u.hash([v.value(),v.expo()]);
    }else if(v.loaded!==undefined && v.name!==undefined){ // Image
      return u.hash([v.loaded(),v.name]);
    }else{
      return v*16777619|0;
    }
  };

  let randomSeed = (Math.floor(Math.random()*4294967295)+1)|0;
  u.seed = seed=>{
    randomSeed = seed;
  };
  u.random = n=>{
    randomSeed ^= randomSeed << 13;
    randomSeed ^= randomSeed >> 17;
    randomSeed ^= randomSeed << 5;
    return (randomSeed % n + n) % n;
  };
  return u;
})();
