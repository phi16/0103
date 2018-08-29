let launch = _=>{

let stages = [
  [
    "O....<"
  ],[
    "O...< ",
    "   .  ",
    "   .  ",
    "   ..."
  ],[
    "O..<  ",
    "     .",
    "     .",
    "     ."
  ],[
    ">.O. .<",
    " .   . ",
    " ..... "
  ],[
    "O...<",
    "     ",
    ">...O"
  ],[
    " O..<",
    " . . ",
    ">..O "
  ],[
    "   . ",
    ">...O",
    " . . ",
    "O...<",
    " .   "
  ],[
    " ..... ",
    " .   v ",
    ">O . O<",
    " ^   . ",
    " ..... "
  ],[
    "  O ",
    "  ^.",
    ".. .",
    " O< "
  ],[
    " ... ",
    ".. ..",
    "O   v",
    ".. ..",
    "^...O"
  ],[
    "O.... .<",
    "    . . ",
    "O.... .<",
    "    . . ",
    "O.... .<"
  ],[
    " .   ",
    " .   ",
    ">...O",
    "v  . ",
    "O  . ",
  ],[
    "  .  ",
    "v.. .",
    "O .O ",
    " > .O",
    "   . ",
    " ... ",
    "   ^ "
  ],[
    "O....<",
    "      ",
    "     .",
    "     ^"
  ],[
    "   ...",
    "   v ^",
    "O...<.",
    "     .",
    "....>."
  ],[
    "     v ",
    "O.....<",
    "   .   ",
    "O.....<"
  ],[
    "    .  ",
    "  O    ",
    "O.. ..<",
    "  . .  ",
    "  . .  ",
    "  . .  ",
    "  ...  ",
    "  ^    "
  ],[
    "   v..",
    "....  ",
    "   . v",
    " ...>O",
    "   .  ",
    "   O  "
  ],[
    "O...........<",
    "             ",
    " ... . . ..  ",
    " .   . . . . ",
    " ... . . . . ",
    " .   . . . . ",
    " ... ... ..  ",
    "             ",
    ">...........O"
  ]
];
let fieldW = 0, fieldH = 0, size = 60;
let baseX = 0, baseY = 0;
let field = [];
let actor = [];
let trigger = [];
let stageTime = 0;
let stageIndex = 0;
function getField(x,y) {
  if(0 <= x && x < fieldW && 0 <= y && y < fieldH) {
    return field[y][x];
  } else return false;
}
function setField(x,y,b) {
  if(0 <= x && x < fieldW && 0 <= y && y < fieldH) {
    field[y][x] = b;
  }
}
function mkActor(i,j) {
  return {x:i,y:j,dx:1,dy:0,t:0,clip:0,s:"stable"};
}
function mkTrigger(i,j,dx,dy) {
  return {x:i,y:j,dx:dx,dy:dy,light:0,s:"stable"};
}
function loadStage(step) {
  stageIndex += step;
  let l = stages[stageIndex];
  field = [];
  actor = [];
  trigger = [];
  let j = 0;
  l.forEach(s=>{
    let p = [];
    for(let i=0;i<s.length;i++) {
      if(s[i] == ".") p.push(true);
      else {
        p.push(false);
        if(s[i] == "O") actor.push(mkActor(i,j));
        if(s[i] == "<") trigger.push(mkTrigger(i,j,-1,0));
        if(s[i] == ">") trigger.push(mkTrigger(i,j,+1,0));
        if(s[i] == "^") trigger.push(mkTrigger(i,j,0,-1));
        if(s[i] == "v") trigger.push(mkTrigger(i,j,0,+1));
      }
    }
    field.push(p);
    j++;
  });
  fieldH = field.length;
  fieldW = fieldH == 0 ? 0 : field[0].length;
  baseX = (scrW - fieldW * size) / 2.0;
  baseY = (scrH - fieldH * size) / 2.0;
  stageTime = 0;
}
function inScreen(x,y) {
  if(x + size < 0) return false;
  if(x - size > scrW) return false;
  if(y + size < 0) return false;
  if(y - size > scrH) return false;
  return true;
}

let timeline = (_=>{
  let t = {};
  loadStage(0);
  let existVisible = true;
  t.render = _=>{
    // Background
    A.rect(U=>{
      U.f["color"](0.1,0.1,0.1,1);
      U.f["origin"](0,0);
      U.f["size"](scrW,scrH);
    });
    existVisible = false;
    let aa = Math.min(1, stageTime / 40.0);
    for(let j=0;j<fieldH;j++) {
      for(let i=0;i<fieldW;i++) {
        if(field[j][i]) {
          A.circle(U=>{
            let x = baseX + i * size;
            let y = baseY + j * size;
            U.f["color"](0.6,0.6,0.2,aa);
            U.f["origin"](x+size/2,y+size/2);
            U.f["radius"](size/6);
            U.f["clip"](0);
            U.f["axis"](1,0);
            U.f["angle"](0);
          });
          existVisible = true;
        }
      }
    }
    actor.forEach(a=>{
      A.circle(U=>{
        let x = baseX + a.x * size;
        let y = baseY + a.y * size;
        let visi = a.s == "dead" ? Math.max(0,1-a.t) : 1.0;
        U.f["color"](1,0.5,0.1,aa*visi);
        U.f["origin"](x+size/2,y+size/2);
        U.f["radius"](size/3);
        U.f["clip"](a.clip);
        U.f["axis"](a.dx,a.dy);
        let angle = Math.abs((a.t + 0.25) % 1 - 0.5) * 2.0 + 0.5;
        if(a.s == "stable") angle = 0;
        if(a.s == "dead") angle = 1;
        U.f["angle"](angle);
        if(visi > 0.5 && inScreen(x+size/2,y+size/2)) existVisible = true;
      });
    });
    trigger.forEach(t=>{
      A.trigger(U=>{
        let x = baseX + t.x * size;
        let y = baseY + t.y * size;
        let m = t.light + 1.0;
        U.f["color"](0.2*m,0.7*m,0.9*m,aa);
        U.f["origin"](x+size/2,y+size/2);
        U.f["size"](size/3);
        U.f["axis"](t.dx,t.dy);
        if(t.light >= 0 && inScreen(x+size/2,y+size/2)) existVisible = true;
      });
    });
    R.text(10,10,80,"left",stageIndex+1,Math.floor(aa*128));
  };
  t.stream = Pipe.sink(event=>Q.do(function*(){
    function* waitFrame(n) {
      while("frame" !== (yield event));
    }
    let mouseX = 0, mouseY = 0;
    while(1){
      let e = yield event;
      if(e.move) {
        mouseX = (e.x - baseX) / size;
        mouseY = (e.y - baseY) / size;
      }
      if(e.down) {
        mouseX = (e.x - baseX) / size;
        mouseY = (e.y - baseY) / size;
        trigger.forEach(t=>{
          if(t.s == "stable" && t.x == Math.floor(mouseX) && t.y == Math.floor(mouseY)) {
            t.s = "move";
          }
        });
      }
      if(e.key && e.key == "R" && e.press) {
        loadStage(0);
      }
      if(e === "frame"){
        trigger.forEach(t=>{
          if(t.s == "stable" && t.x == Math.floor(mouseX) && t.y == Math.floor(mouseY) || t.s == "move") {
            t.light += (1. - t.light) / 4.0;
          } else if(t.s == "collide") {
            t.light += (-1. - t.light) / 4.0;
          } else {
            t.light += (0. - t.light) / 2.0;
          }
          if(t.s == "move") {
            t.x += t.dx * 0.1;
            t.y += t.dy * 0.1;
            actor.forEach(a=>{
              let nx = t.x, ny = t.y;
              let dist = Math.sqrt(Math.pow(nx - a.x,2.0) + Math.pow(ny - a.y,2.0));
              if((a.s == "stable" || a.s == "move") && dist < 0.4) {
                t.s = "collide";
                a.s = "prepare";
                a.x = Math.floor(t.x+0.5);
                a.y = Math.floor(t.y+0.5);
                setField(a.x,a.y,false);
                a.dx = - t.dx;
                a.dy = - t.dy;
                a.clip = 0;
                a.t = 0;
              }
            });
          }
        });
        actor.forEach(a=>{
          if(a.s == "prepare") {
            a.clip += (1.0 - a.clip) / 4.0;
            if(a.clip > 0.999) a.s = "move";
          } else if(a.s == "move") {
            a.x += a.dx * 0.1;
            a.y += a.dy * 0.1;
            a.t += 0.1;
            if(a.t > 0.7) {
              let x = a.x, y = a.y;
              x = Math.floor(x+0.5);
              y = Math.floor(y+0.5);
              setField(x,y,false);
            }
            if(a.t >= 1.0) {
              a.t = 0;
              let x = Math.floor(a.x+0.5);
              let y = Math.floor(a.y+0.5);
              let dx = a.dx, dy = a.dy;
              a.x = x;
              a.y = y;
              if(!getField(x+dx,y+dy)) {
                if(getField(x+dy,y-dx)) {
                  [dx,dy] = [dy,-dx];
                } else if(getField(x-dy,y+dx)) {
                  [dx,dy] = [-dy,dx];
                }
              }
              a.dx = dx, a.dy = dy;
            }
            actor.forEach(a2=>{
              let d = Math.sqrt(Math.pow(a.x-a2.x,2.0) + Math.pow(a.y-a2.y,2.0));
              if(a2.s != "dead" && d < 0.5) {
                if(a != a2) {
                  a.s = "dead";
                  a.t = 0;
                  if(a2.s == "move") {
                    a2.s = "dead";
                    a2.t = 0;
                  }
                }
              }
            })
          } else if(a.s == "dead") {
            a.t += 0.05;
          }
        });
        stageTime++;

        if(!existVisible) {
          // clear
          loadStage(1);
        }
      }
    }
  }));
  return t;
})();

keyInput({
  82: "R"
}).connect(timeline.stream);
mouseInput.connect(timeline.stream);
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
