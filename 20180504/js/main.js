var Main = Poyo.scene("Main",(Po)=>{
  var scene = {};
  let posX = 0;
  let velX = 0;
  let camX = 0;
  let camZ = 1;
  let hitCount = 0;
  let goalPos = 100000;
  let startTime = new Date();
  let endTime = new Date();
  let goal = false;
  let blocks = [];
  let pressing = false;
  window.addEventListener('keydown',_=>{
    pressing = true;
  });
  window.addEventListener('touchdown',_=>{
    pressing = true;
  });
  window.addEventListener('touchup',e=>{
    pressing = false;
  });
  window.addEventListener('keyup',e=>{
    pressing = false;
  });
  let nextBlock = 100;
  function genBlock() {
    nextBlock += 3000;
    blocks.push({x:nextBlock,y:Math.random()*500,vy:(Math.random()*2-1)*10});
  }
  for(let i=0;i<20;i++) genBlock();
  let genShift = nextBlock;
  let hit = 0;
  scene.step = ()=>{
    posX += velX;
    if(!pressing && goalPos > posX) {
      velX += 0.5;
      camX += (posX - camX) / 12.0;
    } else {
      velX *= 0.5;
      camX += (posX - camX) / 4.0;
    }
    if(velX > 100.0) velX = 100.0;
    camZ = 1 + Math.sqrt(velX/10.0);
    hit -= 0.01;
    if(hit < 0) hit = 0;
    if(nextBlock - genShift < posX) {
      genBlock();
    }
    for(let i=0;i<blocks.length;i++){
      let b = blocks[i];
      if(b.x - posX < -10000) {
        blocks.splice(i,1);
        i--;
      } else {
        b.y += b.vy;
        b.vy -= 1;
        if(b.y < 0) {
          b.y = 0;
          b.vy = 50;
          if(b.x < posX && posX < b.x+1000) {
            goalPos += 10000;
            hit = 1;
            hitCount++;
          }
        }
      }
    }
    if(posX < goalPos) {
      endTime = new Date();
    } else if(goal == false) {
      let passed = Math.floor((endTime - startTime)/1000*10)/10;
      setTimeout(_=>{
        window.open("https://twitter.com/intent/tweet?text="+encodeURI("[The Impact] " + passed + "sec(" + hitCount + ") https://phi16.github.io/Jam/20180504")+"&hashtags=traP3jam","_blank");
      },2000);
      goal = true;
    }
  };
  scene.draw = (R)=>{
    Shape.rect(Po.size.x,Po.size.y).with(R.fill(Color.white).draw);
    R.translated(Po.size.x/2,Po.size.y/2,_=>{
      R.scaled(1/camZ,1/camZ,_=>{
        Shape.rect(Po.size.x*camZ,Po.size.y*camZ).translate(-Po.size.x*camZ/2,-Po.size.y*camZ/2).with(R.fill(Color.make(0.1,0.1,0.1)).draw);
        Shape.rect(Po.size.x*camZ,Po.size.y*camZ).translate(-Po.size.x*camZ/2,200).with(R.fill(Color.make(0.2,0.2,0.2)).blur(Color.make(0,0,0),10).draw);
        R.translated(-(-camX+posX)*1.5-posX,200,_=>{
          blocks.forEach(b=>{
            if(b.x > goalPos) return;
            Shape.rect(1000,Po.size.y*camZ).translate(b.x,-Po.size.y*camZ).with(R.fill(Color.make(0.08,0.08,0.08)).draw);
            Shape.rect(1000,Po.size.y*camZ).translate(b.x,-Po.size.y*camZ-b.y).with(R.fill(Color.make(0.5,1,1)).blur(Color.make(0,1,1),10).draw);
          });
          Shape.rect(100,Po.size.y*camZ).translate(goalPos,-Po.size.y*camZ).with(R.fill(Color.make(1,1,0.5)).blur(Color.make(1,1,0),10).draw);
          Shape.circle(20).translate(posX,-20).with(R.fill(Color.make(1,0.5-hit*0.5,1-hit*1)).blur(Color.make(1,0,1-hit*1),10).draw);
          let perc = Math.floor((goalPos-posX)/1000*10)/10;
          Shape.text(goal ? "Goal!" : perc+"%").leftUp.scale(30,30).translate(posX,20).with(R.fill(Color.make(1,1,1)).blur(Color.make(1,1,1),10).draw);
          let passed = Math.floor((endTime - startTime)/1000*10)/10;
          Shape.text(passed + "s").leftUp.scale(30,30).translate(posX,60).with(R.fill(Color.make(1,1,1)).blur(Color.make(1,1,1),10).draw);
        });
      });
    });
  };
  return scene;
});
