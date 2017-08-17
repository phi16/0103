Util.register("Logic",_=>{
  const l = {};

  const waitQ = {};
  l.wait = str=>Q.do(function*(){
    if(!waitQ[str])waitQ[str] = Q.emptyBox();
    return Q.takeBox(waitQ[str]);
  });
  l.emit = (str,data)=>Q.do(function*(){
    if(!waitQ[str])waitQ[str] = Q.emptyBox();
    return Q.putBox(waitQ[str],data);
  });

  l.begin = Q.do(function*(){
  });
  return l;
});
