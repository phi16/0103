Util.register("Gacha",_=>{
  const g = {};
  Q.run(World.initWorld(Q.do(function*(){
    yield Q.switch;

    yield Q.fork(Q.do(function*(){
      while(1){
        Screen.render();
        yield World.sleep(0);
      }
    }));

    yield Logic.begin;
  })));
  return g;
});
