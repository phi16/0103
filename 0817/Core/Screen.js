Util.register("Screen",_=>{
  const s = {};
  const scrs = {};
  const popups = [];
  const disable = {};
  s.register = (name,view,b)=>{
    scrs[name] = view;
    if(b)disable[name] = true;
  };
  s.get = name=>scrs[name];
  s.emit = (name,data)=>scrs[name].post.send(data);
  s.render = _=>{
    for(let i of Object.keys(scrs)){
      const scr = scrs[i];
      if(!disable[i])scr.render();
    }
    for(let i=0;i<popups.length;i++){
      popups[i].render();
    }
  };
  s.addPopup = view=>{
    popups.push(view);
  };
  s.removePopup = view=>{
    const ix = popups.indexOf(view);
    if(ix!=-1)popups.splice(ix,1);
  };
  return s;
});
