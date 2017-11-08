let launch = _=>{

let stageIx = 0;
let stages = [
  [
    "0000000",
    "0111110",
    "0111110",
    "0111110",
    "0111110",
    "0111110",
    "0000000"
  ],[
    "0000000",
    "0000000",
    "0011100",
    "0011100",
    "0011100",
    "0000000",
    "0000000"
  ],[
    "0000000",
    "0001000",
    "0011100",
    "0111110",
    "0011100",
    "0001000",
    "0000000"
  ],[
    "0000000",
    "0001100",
    "0111100",
    "0110110",
    "0011110",
    "0011000",
    "0000000"
  ],[
    "0000000",
    "0011100",
    "0110110",
    "0100010",
    "0110110",
    "0011100",
    "0000000"
  ],[
    "0000000",
    "0110110",
    "0010100",
    "0111110",
    "0100010",
    "0111010",
    "0000000"
  ],[
    "0000000",
    "0111110",
    "0111110",
    "0010100",
    "0111110",
    "0111110",
    "0000000"
  ],[
    "0000000",
    "0111110",
    "0111010",
    "0110110",
    "0101110",
    "0111110",
    "0000000"
  ],[
    "0011100",
    "0110110",
    "1111111",
    "1010101",
    "1111111",
    "0110110",
    "0011100"
  ],[
    "1110100",
    "1000100",
    "1011111",
    "1010101",
    "1111101",
    "0010001",
    "0010111"
  ],[
    "0001000",
    "0001000",
    "1011111",
    "1110111",
    "1111101",
    "0001000",
    "0001000"
  ],[
    "1111111",
    "1001001",
    "1011101",
    "1111111",
    "1011101",
    "1001001",
    "1111111"
  ],[
    "0000000",
    "0001000",
    "0101110",
    "0111110",
    "0111010",
    "0001000",
    "0000000"
  ],[
    "0111110",
    "0010100",
    "0011100",
    "0111110",
    "0011100",
    "0010100",
    "0111110"
  ],[
    "0000000",
    "0011110",
    "0101010",
    "0111110",
    "0101010",
    "0011100",
    "0000000"
  ]
];
let endStage = [
  "0000000",
  "0000000",
  "0000000",
  "0001000",
  "0000000",
  "0000010",
  "0000000"
];
let opti = [5,3,3,4,4,4,4,4,8,4,4,5,3,3,3];
let slide = 0;
let stageList = [];
let count = 0;
let countSize = 0;
let startTime = new Date() - 0;
let lastTT = 0;
let timeSize = 0;
let score = 0;
let scoreSize = 0;

let timeline = (_=>{
  let t = {};
  let mx = 0, my = 0;
  let tiles = [];
  function newStage(){
    if(stageList.length == 0){
      for(let i=0;i<stages.length;i++){
        stageList.push(i);
      }
      for(let i=0;i<stageList.length-1;i++){
        let j = i + Math.floor((stageList.length-i) * Math.random());
        let t = stageList[i];
        stageList[i] = stageList[j];
        stageList[j] = t;
      }
    }
    stageIx = stageList.pop();
    count = 0;
    tiles = [];
    for(let i=-7;i<7;i++){
      for(let j=-7;j<7;j++){
        let x = -(i+j)/2, y = (i-j)/2;
        if(Math.abs(x-Math.floor(x)-0.5) < 0.001 || Math.abs(y-Math.floor(y)-0.5) < 0.001) continue;
        if(-3 <= x && x <= 3 && -3 <= y && y <= 3) {
          if(stages[stageIx][y+3].charAt(x+3) == "1"){
            tiles.push({x:x,y:y,effect:0,float:0,vf:0,delay:0,flip:false,color:0});
          }
        }
      }
    }
    game = true;
  }
  function endGame(){
    count = 0;
    tiles = [];
    for(let i=-7;i<7;i++){
      for(let j=-7;j<7;j++){
        let x = -(i+j)/2, y = (i-j)/2;
        if(Math.abs(x-Math.floor(x)-0.5) < 0.001 || Math.abs(y-Math.floor(y)-0.5) < 0.001) continue;
        if(-3 <= x && x <= 3 && -3 <= y && y <= 3) {
          if(endStage[y+3].charAt(x+3) == "1"){
            tiles.push({x:x,y:y,effect:0,float:0,vf:0,delay:0,flip:false,color:0});
          }
        }
      }
    }
    game = false;
  }
  newStage();
  t.render = _=>{
    // Background
    A.rect(U=>{
      U.f("color",1,0.9,0.7,1);
      U.f("origin",0,0);
      U.f("size",scrW,scrH);
    });
    // Tile
    tiles.forEach(t=>{
      if(t.delay > 0){
        t.delay--;
        if(t.delay == 0) {
          t.vf += 1;
          t.flip = true;
        }
      }
      t.float += t.vf;
      t.vf -= 0.1;
      if(t.float < 0)t.float = t.vf = 0;
      if(t.flip) {
        t.color += (1 - t.color) / 4;
      }
      A.tile(U=>{
        U.f("color",t.color);
        U.f("effect",t.effect*t.effect);
        U.f("center",scrW/2+slide,-100+scrH/2+t.float*3);
        U.f("move",t.x*110, t.y*110);
        U.f("size",50,50);
      });
    });
    R.text(scrW-40,40-scrH,160+countSize*10,"right",count);
    let tt = startTime ? ((30 - (new Date() - startTime) / 1000) + "").substr(0,5) : "0.000";
    if(tt.charAt(0) != lastTT){
      lastTT = tt.charAt(0);
      timeSize = 5;
    }
    R.text(-scrW+80,scrH-150,80+timeSize*10,"left",tt);
    if(game){
      R.text(-scrW+40,40-scrH,100+scoreSize*10,"left",score);
    }else{
      R.text(-scrW+40,40-scrH,300,"left",score);
    }
    countSize -= 1;
    if(countSize < 0)countSize = 0;
    timeSize -= 1;
    if(timeSize < 0)timeSize = 0;
    scoreSize -= 1;
    if(scoreSize < 0)scoreSize = 0;

    if(!game){
      R.text(40+scrW/2+slide,-120,40,"center","Twitter");
      R.text(0+slide,-120,40,"center","Restart");
    }
  };
  t.stream = Pipe.sink(event=>Q.do(function*(){
    let mouseX = 0, mouseY = 0;
    while(1){
      let e = yield event;
      if(e.move) {
        mouseX = e.x;
        mouseY = e.y;
      }
      if(e.down) {
        let ok = false;
        tiles.forEach(t=>{
          if(t.x == mx && t.y == my && !t.flip){
            ok = true;
          }
        });
        if(ok){
          if(game){
            let dirs = [[1,0],[0,1],[-1,0],[0,-1]];
            dirs.forEach(d=>{
              let p = 0;
              while(1){
                ex = mx + d[0]*p;
                ey = my + d[1]*p;
                let i = false;
                tiles.forEach(t=>{
                  if(t.x == ex && t.y == ey){
                    t.delay += p*4 + 1;
                    i = true;
                  }
                });
                p++;
                if(!i) break;
              }
            });
            count++;
            countSize = 5;
          }else{
            if(mx == 2 && my == 2){
              window.open("https://twitter.com/intent/tweet?text="+encodeURI("[Plus Splash] Score : " + score + " https://phi16.github.io/Jam/1108")+"&hashtags=traP3jam","_blank");
            }else if(mx == 0 && my == 0){
              for(let i=0;i<30;i++){
                while("frame" !== (yield event));
              }
              for(let i=0;i<30;i++){
                slide += i*i;
                while("frame" !== (yield event));
              }
              newStage();
              mx = my = -4;
              mouseX = mouseY = 0;
              slide = -scrW;
              score = 0;
              for(let i=0;i<30;i++){
                slide += (0 - slide) / 4.;
                while("frame" !== (yield event));
              }
              startTime = new Date() - 0;
            }
          }
        }
      }
      if(e === "frame"){
        let x = mouseX, y = mouseY;
        x -= scrW/2, y -= -100 + scrH/2;
        y *= 4, x *= 2;
        [x,y] = [x+y, x-y];
        x /= 110, y /= 110;
        x /= 2, y /= 2;
        x = Math.floor(x+0.5), y = Math.floor(y+0.5);
        mx = x;
        my = y;
        tiles.forEach(t=>{
          if(t.x == x && t.y == y){
            t.effect += (1 - t.effect) / 4.;
          }else{
            t.effect += (0 - t.effect) / 4.;
          }
        });

        if(game){
          let exist = false;
          tiles.forEach(t=>{
            if(!t.flip) exist = true;
          });
          if(!exist) {
            for(let i=0;i<30;i++){
              while("frame" !== (yield event));
            }
            tiles.forEach(t=>{
              let m = t.y - t.x + 5;
              t.delay = m*2+1;
            });
            for(let i=0;i<30;i++){
              while("frame" !== (yield event));
            }
            for(let i=0;i<30;i++){
              slide += i*i;
              while("frame" !== (yield event));
            }
            if(count == opti[stageIx]){
              startTime += 3000;
              timeSize = 5;
              score++;
              scoreSize = 5;
            }
            newStage();
            mx = my = -4;
            mouseX = mouseY = 0;
            slide = -scrW;
            for(let i=0;i<30;i++){
              slide += (0 - slide) / 4.;
              while("frame" !== (yield event));
            }
          }

          let tt = 30 - (new Date() - startTime) / 1000;
          if(tt < 0){
            startTime = null;
            for(let i=0;i<30;i++){
              while("frame" !== (yield event));
            }
            for(let i=0;i<30;i++){
              slide += i*i;
              while("frame" !== (yield event));
            }
            endGame();
            mx = my = -4;
            mouseX = mouseY = 0;
            slide = -scrW;
            for(let i=0;i<30;i++){
              slide += (0 - slide) / 4.;
              while("frame" !== (yield event));
            }
          }
        }
      }
    }
  }));
  return t;
})();

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
