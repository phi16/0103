Util.register("UI",_=>{
  const u = {};

  // (C (), C (), C ()) -> Handler FocusEvent
  u.button = (def,hov,act,disableCursor)=>box=>Q.do(function*(){
    yield Q.onTerminate(Q.do(function*(){
      yield def;
      if(!disableCursor)Util.autoCursor();
    }));
    let acts;
    function* begin(){
      acts = yield Q.spawn(b=>Q.do(function*(){
        let e;
        while(1){
          yield def;
          while(e = yield b.receive, !e.move && !e.enter);
          yield hov;
          if(!disableCursor)Util.handCursor();
          while(1){
            e = yield b.receive;
            if(e.press){
              while(e = yield b.receive, !e.cancel && !e.release);
              if(e.cancel){
                e = {leave:true};
              }else{
                yield act;
              }
            }
            if(e.leave)break;
          }
          if(!disableCursor)Util.autoCursor();
        }
      }));
    }
    yield* begin();
    while(1){
      let p = yield box.receive;
      if(p.off){
        yield def;
        Util.autoCursor();
        while(p = yield box.receive, !p.on);
        yield* begin();
      }else if(p.on){
      }else{
        yield acts.send(p);
      }
    }
  });
  return u;
});
