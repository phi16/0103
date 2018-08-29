let Pipe = {};
Pipe.new = f=>{
  let obj = {};
  f(obj);
  return obj;
};
Pipe.conduit = f=>{
  let box = Q.emptyBox();
  let event = Q.takeBox(box);
  let receiver = [];
  let send = d=>Q.do(function*(){
    for(let i=0;i<receiver.length;i++){
      yield receiver[i].emit(d);
    }
  });
  Q.run(f(event,send));
  return {
    emitWait: d=>Q.putBox(box,d),
    emit: d=>Q.fork(Q.putBox(box,d)),
    connect: p=>{
      receiver.push(p);
    }
  };
};
Pipe.source = f=>{
  let c = Pipe.conduit((_,send)=>Q.do(function*(){
    yield f(send);
  }));
  delete c.emitWait;
  delete c.emit;
  return c;
};
Pipe.sink = f=>{
  let c = Pipe.conduit((event,_)=>Q.do(function*(){
    yield f(event);
  }));
  delete c.connect;
  return c;
};
Pipe.drain = f=>{
  return Pipe.sink(event=>Q.do(function*(){
    while(1){
      f(yield event);
    }
  }));
};
Pipe.blockedSource = f=>{
  let receiver = [];
  let send = d=>Q.do(function*(){
    if(receiver.length == 0) throw new Error("No receiver");
    for(let i=0;i<receiver.length;i++){
      yield receiver[i].emitWait(d);
    }
  });
  Q.run(f(send));
  return {
    connect: p=>{
      receiver.push(p);
    }
  };
};
