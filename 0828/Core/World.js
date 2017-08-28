Util.register("World",_=>{
  const w = {};

  // [{prepare:C (), execute:C Bool}]
  let easeHandler = [];
  // Int
  let frameCount = 0;
  // Int -> [Box ()]
  let queueHandler = {};
  // {count:Int, map:Int -> Sender (Bool | R2)}
  let viewManager = {count:0,map:{}};

  // (() -> (), () -> C Bool) -> C ()
  w.easeRegister = (p,h)=>Q.action(_=>{
    easeHandler.push({prepare:p, execute:h});
  });
  w.viewRegister = (v,c,p)=>Q.action(_=>{
    const id = viewManager.count;
    viewManager.map[id] = {post:v,cover:c,popup:p};
    viewManager.count++;
    return id;
  });
  w.viewRemove = (v)=>Q.action(_=>{
    delete viewManager.map[v.id];
  });
  w.viewRemovePopup = (v)=>Q.action(_=>{
    Object.keys(viewManager.map).forEach(id=>{
      if(v.id <= id){
        delete viewManager.map[id];
      }
    });
  });

  // C ()
  const frameHandler = Q.do(function*(){
    function* procQ(q){
      if(q){
        for(let i=0;i<q.length;i++){
          yield Q.fork(Q.putBox(q[i],{}));
        }
      }
    }
    while(1){
      yield Q.waitMS(16);
      // Easing
      for(let i=0;i<easeHandler.length;i++)easeHandler[i].prepare();
      for(let i=easeHandler.length-1;i>-1;i--){
        const b = yield easeHandler[i].execute();
        if(!b)easeHandler.splice(i,1);
      }
      // Sleep Queue
      yield* procQ(queueHandler[frameCount-1]);
      yield* procQ(queueHandler[frameCount]);
      delete queueHandler[frameCount-1];
      // Update
      frameCount++;
    }
  });
  // Int -> C ()
  w.sleep = frame=>{
    if(frame < 0)frame = 0;
    const target = Math.floor(frame+frameCount);
    const v = Q.emptyBox();
    if(!queueHandler[target])queueHandler[target] = [];
    queueHandler[target].push(v);
    return Q.takeBox(v);
  };
  // Receiver MouseEvent -> C ()
  const mouseHandler = e=>Q.do(function*(){
    while(1){
      const evt = yield e.receive;
      if(evt.data.button == 2)continue;
      const x = evt.data.clientX - Util.realLeft;
      const y = evt.data.clientY - Util.realTop;
      let post = {};
      post.x = x;
      post.y = y;
      if(evt.name == "mousedown")post.down = true;
      if(evt.name == "mouseup")post.up = true;
      if(evt.name == "mousemove")post.move = true;
      let viewKeys = Object.keys(viewManager.map);
      viewKeys.sort((a,b)=>a-b);
      let allOutside = false;
      for(let i=viewKeys.length-1;i>-1;i--){
        let view = viewManager.map[viewKeys[i]];
        if(!view)continue;
        if(!allOutside && view.cover(x,y) && 0<=x && x<=Util.realWidth && 0<=y && y<=Util.realHeight){
           yield view.post.send(post);
        }else yield view.post.send({outside:true,x:x,y:y});
        if(view.popup)allOutside = true;
        if(view.post.origin.full && view.post.origin.full.length > 100){
          Log.err("Memory Leak Detected!!",view);
          yield w.viewRemove({id:viewKeys[i]});
        }
      }
    }
  });
  // String -> Sender {name:String,data:Data} -> C ()
  w.handle = (event,post)=>Q.action(_=>{
    document.addEventListener(event,function(e){
      Q.run(post.send({name:event,data:e}));
    });
  });
  let initialized = false;
  // C ()
  w.initWorld = proc=>Q.do(function*(){
    if(!initialized){
      initialized = true;
      yield Q.fork(frameHandler);
      let mh = yield Q.spawn(mouseHandler);
      yield w.handle("mousedown",mh);
      yield w.handle("mousemove",mh);
      yield w.handle("mouseup",mh);
      yield proc;
    }else{
      throw new Error("World has been initialized");
    }
  });
  return w;
});
