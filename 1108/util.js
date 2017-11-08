const nextFrame = Pipe.source(send=>Q.do(function*(){
  function frameStep(){
    Q.run(send("frame"));
    requestAnimationFrame(frameStep);
  }
  frameStep();
}));

const wholeKey = Pipe.source(send=>Q.do(function*(){
  window.addEventListener("keydown",e=>{
    Q.run(send({down:e.keyCode}));
  });
  window.addEventListener("keyup",e=>{
    Q.run(send({up:e.keyCode}));
  });
}));

const soundPlay = (_=>{
  const ctx = new AudioContext();
  const sound = {};
  function load(name){
    const req = new XMLHttpRequest();
    req.responseType = 'arraybuffer';
    req.addEventListener('loadend',_=>{
      if(req.status !== 200) {
        console.error(name + ".wav: " + req.status);
        return;
      }
      ctx.decodeAudioData(req.response,buff=>{
        sound[name] = buff;
      });
    });
    req.open('GET',"/res/" + name + ".wav",true);
    req.send();
  }
  [].forEach(load);
  return Pipe.drain(name=>{
    const src = ctx.createBufferSource();
    if(!sound[name])return;
    src.buffer = sound[name];
    src.connect(ctx.destination);
    src.start(0);
    src.addEventListener("ended",_=>{
      src.disconnect(0);
    });
  });
})();

function keyInput(corresp){
  let pipe = Pipe.conduit((event,send)=>Q.do(function*(){
    let keyState = {};
    while(1){
      const key = yield event;
      if(key.down){
        if(corresp[key.down] && keyState[key.down]!==true){
          keyState[key.down] = true;
          yield send({key:corresp[key.down],press:true});
        }
      }else if(key.up){
        if(corresp[key.up] && keyState[key.up]!==false){
          keyState[key.up] = false;
          yield send({key:corresp[key.up],press:false});
        }
      }
    }
  }));
  wholeKey.connect(pipe);
  return pipe;
}

const mouseInput = Pipe.source(send=>Q.do(function*(){
  yield Q.switch;
  let rect = document.getElementById("canvas").getBoundingClientRect();
  window.addEventListener("mousemove",e=>{
    Q.run(send({move:true,x:e.clientX-rect.left,y:rect.height - (e.clientY-rect.top)}));
  });
  window.addEventListener("mouseup",e=>{
    Q.run(send({up:true,x:e.clientX-rect.left,y:rect.height - (e.clientY-rect.top)}));
  });
  window.addEventListener("mousedown",e=>{
    Q.run(send({down:true,x:e.clientX-rect.left,y:rect.height - (e.clientY-rect.top)}));
  });
}));
