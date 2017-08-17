Util.register("Socket",_=>{
  const s = {};
  function kon(sock){
    const o = {};
    const queue = {};
    const err = Q.emptyBox();
    sock.on('error',reason=>{
      console.error(reason);
      Log.err(reason);
      Q.run(Q.fork(Q.putBox(err,{failed:reason})));
    });
    sock.on('connect',_=>{
      Log.def("connected");
      Q.run(Q.fork(Q.putBox(err,{success:true})));
    });
    let done = false;
    sock.on('disconnect',_=>{
      if(done)return;
      Util.addChat("通信が切断されました。リロードしてください。","errorChat");
    });
    o.succeeded = Q.delay(_=>Q.takeBox(err));
    o.wait = name=>{
      if(queue[name])return Q.takeBox(queue[name]);
      throw new Error("Undeclared event : " + name);
    };
    o.wait.pretend = name=>{
      if(queue[name])return Q.readBox(queue[name]);
      throw new Error("Undeclared event : " + name);
    };
    o.emit = (name,data)=>{
      sock.emit(name,data);
    };
    o.kill = _=>{
      done = true;
      sock.disconnect();
    };
    o.use = arr=>{
      arr.forEach(a=>{
        if(!queue[a]){
          queue[a] = Q.emptyBox();
          sock.on(a,(d,cb)=>{
            Log.def("%c["+a+"] "+JSON.stringify(d),'color:green');
            Q.run(Q.fork(Q.putBox(queue[a],{data:d,callback:cb})));
          });
        }
      });
    };
    return o;
  }
  s.create = (url,query)=>{
    Log.def("Connect to: " + url);
    if(query){
      let q = [];
      Object.keys(query).forEach(k=>{
        q.push(k + "=" + query[k]);
      });
      return kon(io(url,{forceNew:true,query:q.join("&")}));
    }else{
      return kon(io(url,{forceNew:true}));
    }
  };
  return s;
});
