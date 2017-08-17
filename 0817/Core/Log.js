Util.register("Log",_=>{
  const l = {};
  const debug = false;
  const store = [];
  l.def = function(){
    if(debug){
      console.log.apply(null,arguments);
    }else{
      const po = [];
      for(let i=0;i<arguments.length;i++){
        po.push(arguments[i]);
      }
      store.push({def:JSON.stringify(po)});
    }
  };
  l.err = function(){
    if(debug){
      console.error.apply(null,arguments);
    }else{
      const po = [];
      for(let i=0;i<arguments.length;i++){
        po.push(arguments[i]);
      }
      store.push({err:JSON.stringify(po)});
    }
  };
  l.dump = _=>{
    for(let i=0;i<store.length;i++){
      if(store[i].def){
        console.log.apply(null,JSON.parse(store[i].def));
      }else{
        console.error.apply(null,JSON.parse(store[i].err));
      }
    }
  };
  return l;
});
