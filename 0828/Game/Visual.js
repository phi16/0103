Util.register("Visual",_=>{
  const v = {};

  const waitQ = {};
  v.wait = str=>Q.do(function*(){
    if(!waitQ[str])waitQ[str] = Q.emptyBox();
    return Q.takeBox(waitQ[str]);
  });
  v.emit = (str,data)=>Q.do(function*(){
    if(!waitQ[str])waitQ[str] = Q.emptyBox();
    return Q.putBox(waitQ[str],data);
  });

  Q.run(Q.do(function*(){
    const shape = Shape.rect(0,0,Util.width,Util.height);

    const render = _=>{
      R.fill(Color.rgb(1,1,1))(Shape.rect(0,0,Util.width,Util.height));
    };
    const handler = box=>Q.do(function*(){
      yield Q.listen(Q.do(function*(){
        const b = yield box.receive;
        if(b.mouse){
          console.log(b.mouse);
        }
      }));
      yield Q.abort;
    });
    const view = yield View.make(_=>({mouse:_}),shape,render,handler);
    Screen.register("Visual",view);
  }));

  return v;
});
