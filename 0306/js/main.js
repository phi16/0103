var Main = Poyo.scene("Main",(Po)=>{
  var scene = {};
  let rows = [];
  let stacks = [];
  let forbidden = [[0,1],[1,1]];
  const size = 40;
  let lookAhead = 0;
  let lookAheadMot = -1;
  let stageY = 0;
  let state = "wait";
  let stackY = 0;
  let current, currentX, currentY;
  let waitFrame = 0;
  let score = 0;
  let badIndex = 0;
  let failTurn = 0;
  let leftEvent = _=>{}, upEvent = _=>{}, rightEvent = _=>{}, downEvent = _=>{};
  function createStage(){
    for(let i=0;i<4;i++){
      forbidden[i%2][Math.floor(i/2)] = Math.random() < 0.5 ? 1 : 0;
    }
    rows = [];
    for(let i=0;i<9;i++){
      let r = [];
      for(let j=0;j<5;j++){
        let c = Math.random() < 0.5 ? 1 : 0;
        if(i==0)r.push(c);
        else{
          if(j==0){
            r.push(c);
          }else{
            if(r[j-1]==forbidden[0][0] && rows[0][j-1]==forbidden[1][0] && rows[0][j]==forbidden[1][1]){
              r.push(1-forbidden[0][1]);
            }else{
              r.push(c);
            }
          }
        }
      }
      rows.unshift(r);
    }
  }
  function safe(a){
    for(let i=1;i<5;i++){
      if(rows[0][i-1]==forbidden[1][0] && rows[0][i]==forbidden[1][1] && a[i-1]==forbidden[0][0] && a[i]==forbidden[0][1]){
        return false;
      }
    }
    return true;
  }
  function calc(i,a){
    let cnt = 0;
    if(i==stacks.length){
      const b = a.concat([]);
      for(let j=0;j<5;j++){
        if(safe(b))cnt++;
        b.push(b.shift());
      }
    }else{
      let p = stacks[i].concat([]);
      for(let j=0;j<5;j++){
        if(safe(p)){
          rows.unshift(p);
          cnt += calc(i+1,a);
          rows.shift();
        }
        p.push(p.shift());
      }
    }
    return cnt;
  }
  function makeLine(){
    let argmins = [], minCount = -1;
    let all = [];
    for(let i=0;i<32;i++){
      let a = [];
      let u = 1;
      for(let j=0;j<5;j++){
        a.push(Math.floor(i/u)%2);
        u*=2;
      }
      let d = calc(0,a);
      if(d!=0){
        all.push(a);
        if(minCount==-1 || minCount >= d){
          if(minCount>d)argmins = [];
          argmins.push(a);
          minCount = d;
        }
      }
    }
    if(minCount==-1){
      const a = [];
      for(let i=0;i<5;i++)a.push(Math.random()<0.5?1:0);
      stacks.push(a);
      if(failTurn==0)failTurn=1;
    }else{
      if(Math.random()<0.7){
        stacks.push(argmins[Math.floor(Math.random()*argmins.length)]);
      }else{
        stacks.push(all[Math.floor(Math.random()*all.length)]);
      }
    }
  }
  createStage();
  makeLine();
  window.addEventListener("keydown",(e)=>{
    if(e.keyCode==37)leftEvent();
    if(e.keyCode==38)upEvent();
    if(e.keyCode==39)rightEvent();
  });
  function rotate(x){
    if(x==-1)current.push(current.shift());
    else current.unshift(current.pop());
    currentX = -x*size;
  }
  scene.step = ()=>{
    if(state=="wait"){
      waitFrame++;
      if(waitFrame >= 20){
        current = stacks.shift();
        currentX = currentY = 0;
        state = "fall";
        stackY = -40;
      }
    }else if(state=="fall"){
      currentY+=0.2;
      upEvent = _=>currentY=240;
      leftEvent = _=>rotate(-1);
      rightEvent = _=>rotate(1);
      if(currentY >= 240){
        upEvent = leftEvent = rightEvent = _=>{};
        stageY = -size;
        waitFrame = 0;
        if(safe(current)){
          rows.unshift(current);
          rows.splice(10);
          current = null;
          state = "wait";
          score++;
          stackY = 0;
          makeLine();
          if(score==1 || score==2 || score==3){
            makeLine();
            lookAhead++;
          }
          if(failTurn!=0)failTurn++;
        }else{
          state="end";
        }
      }
    }else if(state=="end"){
      if(waitFrame==20){
        for(let i=1;i<5;i++){
          if(rows[0][i-1]==forbidden[1][0] && rows[0][i]==forbidden[1][1] && current[i-1]==forbidden[0][0] && current[i]==forbidden[0][1]){
            badIndex = i-1;
            break;
          }
        }
      }
      if(waitFrame==100){
        window.open("https://twitter.com/intent/tweet?text="+encodeURI("[Forbidden Drop Estimator] Score : " + score + " https://phi16.github.io/Jam/0306")+"&hashtags=traP3jam","_blank");
      }
      waitFrame++;
    }
    currentX += (0-currentX)/4;
    stageY += (0-stageY)/4;
    lookAheadMot += (lookAhead - lookAheadMot)/4;
  };
  scene.draw = (R)=>{
    function cube(x,y,c){
      Shape.rect(size,size).translate(x*size,y*size).with(R.fill(c?Color.white:Color.black).draw);
      Shape.rect(size-4,size-4).translate(x*size+2,y*size+2).with(R.stroke(2,c?Color.black:Color.white).blur(5,c?Color.black:Color.white).draw);
    }
    Shape.rect(Po.size.x,Po.size.y).with(R.fill(Color.black).draw);
    R.translated((Po.size.x-800)/2,(Po.size.y-600)/2,_=>{
      Shape.rect(800,600).with(R.fill(Color.make(0.2,0.2,0.2)).draw);
      R.translated(400-size*2.5,0,_=>{
        for(let i=0;i<600/size;i++){
          Shape.line(0,i*size,size*5,i*size).with(R.stroke(2,Color.white.alpha(0.3)).draw);
        }
        for(let i=0;i<5;i++){
          Shape.line(i*size,0,i*size,600).with(R.stroke(2,Color.white.alpha(0.3)).draw);
        }
        R.translated(0,lookAheadMot*size+stageY,_=>{
          R.translated(0,stackY,_=>{
            for(let i=0;i<stacks.length;i++){
              const r = stacks[i];
              for(let j=0;j<5;j++){
                cube(j,-i,r[j]);
              }
            }
          });
          if(current)R.translated(currentX,currentY,_=>{
            for(let j=-1;j<6;j++){
              cube(j,0,current[(j+5)%5]);
            }
          });
          R.translated(0,currentY,_=>{
            Shape.rect(size*2,size*2).translate(-size*2,-size/2).with(R.fill(Color.make(0.2,0.2,0.2)).draw);
            Shape.rect(size*2,size*2).translate(5*size,-size/2).with(R.fill(Color.make(0.2,0.2,0.2)).draw);
          });
          R.translated(0,280,_=>{
            for(let i=0;i<rows.length;i++){
              const r = rows[i];
              for(let j=0;j<5;j++){
                cube(j,i,r[j]);
              }
            }
          });
        });
        Shape.line(-3,0,-3,600).with(R.stroke(3,Color.white).blur(3,Color.yellow).draw);
        Shape.line(5*size+3,0,5*size+3,600).with(R.stroke(3,Color.white).blur(3,Color.yellow).draw);

        R.translated(300,(600-2*size)/2,_=>{
          cube(0,0,forbidden[0][0]);
          cube(1,0,forbidden[0][1]);
          cube(0,1,forbidden[1][0]);
          cube(1,1,forbidden[1][1]);
        });
        Shape.rect(size*2+6,size*2+6).translate(300-3,(600-2*size)/2-3).with(R.stroke(3,Color.make(1,0.9,0.9)).blur(3,Color.red).draw);
        if(state=="end" && waitFrame>=25){
          let a = waitFrame<=40 ? (waitFrame-25)/15 : 1;
          if(failTurn!=0){
            Shape.line(-10,failTurn*size,5*size+10,failTurn*size).translate(0,6*size+lookAheadMot*size+stageY+3).with(R.stroke(3,Color.make(1,0.75,0.5).alpha(a)).blur(3,Color.yellow).draw);
          }
          Shape.rect(size*2+6,size*2+6).translate(badIndex*size-3,6*size+lookAheadMot*size+stageY-3).with(R.stroke(3,Color.make(1,0.5,0.5).alpha(a)).blur(3,Color.red).draw);
        }
      });
      Shape.image("title").scale(0.5,0.5).translate(25,360).with(R.blur(5,Color.cyan).draw);
      Shape.image("forbidden").scale(0.3,0.3).translate(570,160).with(R.blur(5,Color.red).draw);
      let digits = score==0 ? 1 : Math.floor(Math.log10(score)+1);
      // 50x83
      let ten = 1;
      for(let i=digits-1;i>-1;i--){
        let d = Math.floor(score/ten)%10;
        Shape.imageClipped("number",d*50,0,50,83).scale(2,2).translate(-digits*100+i*100+250,70).with(R.blur(5,Color.blue).draw);
        ten*=10;
      }
      Shape.image("arrow").translate(450,350).scale(1.2,1.2).with(R.blur(5,Color.orange).draw);
      Shape.rect(800,600).translate(0,600).with(R.fill(Color.black).draw);
      Shape.rect(800,600).translate(0,-600).with(R.fill(Color.black).draw);
    });
  };
  return scene;
});
