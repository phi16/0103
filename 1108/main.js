let launch = _=>{

let timeline = (_=>{
  let t = {};
  t.render = _=>{
    A.rect(U=>{
      U.f("color",1,0.5,0,1);
      U.f("origin",0,0);
      U.f("size",scrW,scrH);
    });
  };
  t.stream = Pipe.sink(event=>Q.do(function*(){
    while(1){
      let e = yield event;
    }
  }));
  return t;
})();

keyInput({
  37: "left",  // <
  38: "up",    // ^
  39: "right", // >
  40: "down",  // v
  90: "ccw",   // Z
  88: "cw",    // X
  67: "ccw2",  // C
  16: "hold"   // Shift
}).connect(timeline.stream);
nextFrame.connect(timeline.stream);

let main = Pipe.sink(frame=>Q.do(function*(){
  while(1){
    yield frame;
    R.clear();
    timeline.render();
  }
}));

nextFrame.connect(main);

};
