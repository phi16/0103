Util.register("Sound",_=>{
  const s = {};
  const ctx = new AudioContext();
  s.get = url=>{
    const sound = {};
    sound.play = _=>{
      const src = ctx.createBufferSource();
      src.buffer = sound.data;
      src.connect(ctx.destination);
      src.start(0);
    };
    const req = new XMLHttpRequest();
    req.responseType = 'arraybuffer';
    req.addEventListener('loadend',_=>{
      if(req.status === 200){
        ctx.decodeAudioData(req.response,buff=>{
          sound.data = buff;
        });
      }
    });
    req.open('GET',url,true);
    req.send();
    return sound;
  };
  return s;
});
