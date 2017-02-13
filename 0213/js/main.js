const stages = [
  [
    "@|*"
  ],[
    "@    ",
    "-    ",
    ".|.|.",
    "    -",
    "    *"
  ],[
    ". .|. .",
    "-      ",
    "@     *"
  ],[
    "@ .  ",
    "  -  ",
    ".|.|.",
    "  -  ",
    "  . *"
  ],[
    "  *   .  ",
    "  -      ",
    "@ .|.|. .",
    "  -      ",
    "  .   .  "
  ],[
    "* .|. .",
    "       ",
    "    .  ",
    "    -  ",
    "    .  ",
    "       ",
    "@ . .|."
  ],[
    ". . . .",
    "    -  ",
    "@ .|.|.",
    "    -  ",
    ". . . .",
    "       ",
    ". * . ."
  ],[
    "@|#|. *"
  ],[
    "@ .|. .",
    "-      ",
    "# # # .",
    "      -",
    "* # # .",
    "       ",
    ". . #|."
  ],[
    ". . @ .|.|. . . .",
    "                 ",
    "                #",
    "                -",
    "                #",
    "                 ",
    "* . . .|.|. . . .",
  ],[
    ". .         .|.",
    "            - -",
    ". .         .|.",
    "- -            ",
    ". .|. .        ",
    "               ",
    ". .|. .        ",
    "    - -        ",
    "#   . .|. .    ",
    "               ",
    "#   @ .|. .    ",
    "        - -    ",
    "#       . .|. .",
    "               ",
    "* # # # . .|. ."
  ],[
    "@ .|.   . .|. .|. .",
    "          -       -",
    ".   .   . .|. .|. .",
    "          -        ",
    ". .|. .|. .|.|.|.|."
  ]
];

var Main = Poyo.scene("Main",(Po)=>{
  var scene = {};
  let stageIdx = 0;
  const sz = 80;
  let circleAnim = Po.ease(0).cubic.inOut(20);
  let colorAnim = Po.ease(0).exp.out(50);
  let oldCurPos = {x:0,y:0};
  let curPos = {x:0,y:0};
  let goalPos = {x:0,y:0};
  let stageWidth = 0;
  let stageHeight = 0;
  let stageData = [];
  let mirrorV = [];
  let mirrorH = [];
  let getStage = (x,y)=>{
    if(0<=x && x<stageWidth && 0<=y && y<stageHeight){
      let p = x*2, q = y*2;
      let c = stageData[q][p];
      return c;
    }else return " ";
  };
  function loadStage(i){
    let s = stages[i];
    stageWidth = (s[0].length+1)/2;
    stageHeight = (s.length+1)/2;
    stageData = s;
    goalPos.x = goalPos.y = -1;
    for(let i=0;i<stageWidth;i++){
      for(let j=0;j<stageHeight;j++){
        if(getStage(i,j)=="@")curPos = {x:i,y:j};
        if(getStage(i,j)=="*")goalPos = {x:i,y:j};
      }
    }
    oldCurPos.x = curPos.x;
    oldCurPos.y = curPos.y;
    let mv = [], mh = [];
    mirrorV = [];
    mirrorH = [];
    for(let i=0;i<stageWidth-1;i++){
      for(let j=0;j<stageHeight;j++){
        if(s[j*2][i*2+1]=="|")mv.push({x:i+0.5,y:j});
      }
    }
    for(let i=0;i<stageWidth;i++){
      for(let j=0;j<stageHeight-1;j++){
        if(s[j*2+1][i*2]=="-")mh.push({x:i,y:j+0.5});
      }
    }

    mv.forEach((m)=>{
      mirrorV.push(
        Shape.rect(sz*0.08,sz*0.8)
        .translate(Po.size.x/2 - (stageWidth-1)/2*sz,Po.size.y/2 - (stageHeight-1)/2*sz)
        .translate(m.x*sz-sz*0.08/2,m.y*sz-sz*0.8/2).with(Po.button(()=>{
          if(circleAnim.done && !moveFailed){
            oldCurPos.x = curPos.x;
            oldCurPos.y = curPos.y;
            curPos.x = m.x*2 - curPos.x;
            circleAnim.force(0);
            circleAnim.set(1);
          }
        }))
      );
    });
    mh.forEach((m)=>{
      mirrorH.push(
        Shape.rect(sz*0.8,sz*0.08)
        .translate(Po.size.x/2 - (stageWidth-1)/2*sz,Po.size.y/2 - (stageHeight-1)/2*sz)
        .translate(m.x*sz-sz*0.8/2,m.y*sz-sz*0.08/2).with(Po.button(()=>{
          if(circleAnim.done && !moveFailed){
            oldCurPos.x = curPos.x;
            oldCurPos.y = curPos.y;
            curPos.y = m.y*2 - curPos.y;
            circleAnim.force(0);
            circleAnim.set(1);
          }
        }))
      );
    });
  }

  let nextStageTimer = 0;
  let firstFrame = true;
  let moveFailed = false;
  scene.step = ()=>{
    if(firstFrame){
      loadStage(stageIdx);
      firstFrame = false;
    }
    if(!circleAnim.done && !moveFailed){
      let cx = (1-circleAnim())*oldCurPos.x + circleAnim()*curPos.x;
      let cy = (1-circleAnim())*oldCurPos.y + circleAnim()*curPos.y;
      if(getStage(Math.round(cx),Math.round(cy))==" "){
        colorAnim.force(1);
        colorAnim.set(0);
        circleAnim.set(0);
        moveFailed = true;
      }
    }
    if(circleAnim.done && !moveFailed){
      if(getStage(curPos.x,curPos.y)=="#"){
        colorAnim.force(1);
        colorAnim.set(0);
        circleAnim.set(0);
        moveFailed = true;
      }
    }
    if(circleAnim.done && moveFailed){
      let tx = curPos.x, ty = curPos.y;
      curPos.x = oldCurPos.x;
      curPos.y = oldCurPos.y;
      oldCurPos.x = tx;
      oldCurPos.y = ty;
      circleAnim.force(1);
      moveFailed = false;
    }
    if(circleAnim.done && curPos.x==goalPos.x && curPos.y==goalPos.y && nextStageTimer==0){
      Po.removeAllButton();
      nextStageTimer = 1;
    }
    if(nextStageTimer!=0){
      nextStageTimer++;
      if(nextStageTimer > 20){
        stageIdx++;
        loadStage(stageIdx);
        nextStageTimer = 0;
      }
    }
  };
  scene.draw = (R)=>{
    Shape.rect(Po.size.x,Po.size.y).with(R.fill(Color.make(0.9,1.0,1.0)).draw);
    R.translated(Po.size.x/2 - (stageWidth-1)/2*sz,Po.size.y/2 - (stageHeight-1)/2*sz,()=>{
      for(let i=0;i<stageWidth;i++){
        for(let j=0;j<stageHeight;j++){
          if(getStage(i,j)!=" "){
            R.translated(i*sz,j*sz,()=>{
              Shape.rect(sz,sz).translate(-sz/2,-sz/2).with(R.fill(Color.make(0.6,0.9,0.9)).shadow(10).draw);
            });
          }
        }
      }
      for(let i=0;i<stageWidth;i++){
        for(let j=0;j<stageHeight;j++){
          if(getStage(i,j)!=" "){
            if(getStage(i,j)=="#"){
              R.translated(i*sz,j*sz,()=>{
                Shape.rect(sz,sz).translate(-sz/2,-sz/2).with(R.fill(Color.make(0.6,0.7,0.9)).draw);
              });
            }else{
              R.translated(i*sz,j*sz,()=>{
                Shape.rect(sz,sz).translate(-sz/2,-sz/2).with(R.fill(Color.make(0.6,0.9,0.9)).draw);
              });
            }
          }
        }
      }
      if(goalPos.x>=0){
        R.translated(goalPos.x*sz,goalPos.y*sz,()=>{
          Shape.polygon([-sz*0.2,0,0,sz*0.2,sz*0.2,0,0,-sz*0.2]).with(R.fill(Color.make(0.1,0.9,0.6)).shadow(10).draw);
        });
      }
      let cx = (1-circleAnim())*oldCurPos.x + circleAnim()*curPos.x;
      let cy = (1-circleAnim())*oldCurPos.y + circleAnim()*curPos.y;
      R.translated(cx*sz,cy*sz,()=>{
        Shape.circle(sz*0.3).with(R.fill(Color.make(1.0,0.9*(1-colorAnim()*0.5),0.6*(1-colorAnim()))).shadow(10).draw);
      });
    });
    mirrorV.forEach((m)=>{
      m.with(R.fill(Color.make(1,1,1)).shadow(10).draw);
    });
    mirrorH.forEach((m)=>{
      m.with(R.fill(Color.make(1,1,1)).shadow(10).draw);
    });
  };
  return scene;
});
