let stages = [ {
    A: {x:-2,y:0,e:{
      a: {
        B: 0
      }
    },i:true},
    B: {x:2,y:0,e:{},a:true}
  },{
    A: {x:0,y:-1,e:{
      e: {
        B: 0
      }
    },i:true},
    B: {x:1.5,y:1,e:{
      n: {
        C: 0
      }
    }},
    C: {x:-1.5,y:1,e:{
      d: {
        A: 0
      }
    }},
    D: {x:0,y:3,e:{},a:true}
  }
];
let graph = {};
let current = {};
let vanish = {};

let stageIx = 0;
let motionPos = 0;
function loadStage() {
  graph = stages[stageIx];
  current = {};
  Object.keys(graph).forEach(n=>{
    let p = graph[n];
    if(p.i) {
      current[n] = {};
      current[n][n] = true;
    }
  });
  stageIx++;
}
loadStage();

let transitTimer = 0;
let toNext = false;
function transit(key) {
  if(!(97 <= key.charCodeAt(0) && key.charCodeAt(0) <= 122) && key != ".") return;
  if(toNext) return;
  vanish = {};
  let newCurrent = {};
  let onp = {};
  Object.keys(current).forEach(k=>{
    Object.keys(current[k]).forEach(k2=>{
      let p = graph[k2];
      if(p.e[key]) {
        if(!newCurrent[k2]) newCurrent[k2] = {};
        Object.keys(p.e[key]).forEach(k3=>{
          newCurrent[k2][k3] = true;
          onp[k3] = true;
        });
      } else {
        vanish[k2] = true;
      }
    });
  });
  current = newCurrent;
  transitTimer = 0;

  let comp = true;
  Object.keys(graph).forEach(n=>{
    let p = graph[n];
    if(p.a) {
      if(!onp[n]) comp = false;
    }
  });
  Object.keys(graph).forEach(n=>{
    let p = graph[n];
    if(p.v) {
      if(onp[n]) comp = false;
    }
  });
  if(comp) toNext = true;
}

let keyCands = {};
window.onkeydown = (e)=>{
  if(keyCands[e.keyCode]) return;
  keyCands[e.keyCode] = true;
  transit(e.key);
};
window.onkeyup = (e)=>{
  delete keyCands[e.keyCode];
};
var Main = Poyo.scene("Main",(Po)=>{
  var scene = {};
  let time = 0;
  scene.step = ()=>{
    time++;
    transitTimer++;
    motionPos = 0;
    if(toNext && transitTimer > 50) {
      if(transitTimer < 70) {
        motionPos = (transitTimer - 50) / 20;
      } else if(transitTimer == 70) {
        loadStage();
        motionPos = 1;
      } else if(transitTimer < 90) {
        motionPos = -1 + (transitTimer - 70) / 20;
      } else {
        transitTimer = 0;
        toNext = false;
      }
    }
  };
  scene.draw = (R)=>{
    Shape.rect(Po.size.x,Po.size.y).with(R.fill(Color.make(1.0,0.975,0.95)).draw);
    let vMot = 0;
    if(motionPos > 0) {
      vMot = Math.pow(motionPos,3);
    } else {
      vMot = -Math.pow(-motionPos,3);
    }
    R.translated(Po.size.x/2, Po.size.y/2 + vMot*Po.size.y, _=>{
      let nodeRad = 0.3;
      let arrSz = 0.6;
      R.scaled(60,60,_=>{
        // E
        Object.keys(graph).forEach(n=>{
          let p = graph[n];
          Object.keys(p.e).forEach(k=>{
            Object.keys(p.e[k]).forEach(n2=>{
              let p2 = graph[n2];
              let dx = p2.x - p.x, dy = p2.y - p.y;
              let dl = Math.sqrt(dx*dx+dy*dy);
              dx /= dl, dy /= dl;
              let ax = p.x + dx * nodeRad;
              let ay = p.y + dy * nodeRad;
              let bx = p2.x - dx * nodeRad;
              let by = p2.y - dy * nodeRad;
              let cx = (p.x+p2.x)/2;
              let cy = (p.y+p2.y)/2;
              Shape.line(ax,ay,bx-dx*arrSz*0.5,by-dy*arrSz*0.5).with(R.stroke(0.1,Color.make(0.7,0.5,0.1)).shadow(2).draw);
              let tri = [bx,by,bx+arrSz*(-dx+dy*0.4),by+arrSz*(-dy-dx*0.4),bx+arrSz*(-dx-dy*0.4),by+arrSz*(-dy+dx*0.4)];
              Shape.polygon(tri).with(R.fill(Color.make(0.7,0.5,0.1)).shadow(2).draw);
              Shape.text(k).center.scale(0.7,0.7).translate(cx,cy).with(R.stroke(0.2,Color.make(1,1,1)).draw);
              Shape.text(k).center.scale(0.7,0.7).translate(cx,cy).with(R.fill(Color.make(0.4,0.2,0.05)).shadow(2).draw);
            });
          });
        });
        // N
        Object.keys(graph).forEach(n=>{
          let p = graph[n];
          Shape.circle(0.3).translate(p.x,p.y).with(R.fill(Color.make(1,1,1)).shadow(5).draw);
          if(p.a) {
            Shape.circle(0.25).translate(p.x,p.y).with(R.stroke(0.1,Color.make(1,1,0)).shadow(5).draw);
          } else if(p.v) {
            Shape.circle(0.1).translate(p.x,p.y).with(R.fill(Color.make(1,0,0)).shadow(5).draw);
          }
        });
        // C
        Object.keys(current).forEach(k=>{
          let p = graph[k];
          Object.keys(current[k]).forEach(k2=>{
            let p2 = graph[k2];
            let t = Math.min(1,transitTimer*0.01);
            t = 1-Math.pow(1-t,20);
            let px = p.x*(1-t) + p2.x*t;
            let py = p.y*(1-t) + p2.y*t;
            let fr = time*0.02-Math.floor(time*0.02);
            let c1 = -fr * (fr-1) * 5;
            Shape.circle(Math.pow(fr,0.7)*0.5).translate(px,py).with(R.stroke(c1*0.1,Color.make(0.4,0.1,0.1)).shadow(2).draw);
            fr = (time*0.02+0.5)-Math.floor(time*0.02+0.5);
            c1 = -fr * (fr-1) * 5;
            Shape.circle(Math.pow(fr,0.7)*0.5).translate(px,py).with(R.stroke(c1*0.1,Color.make(0.4,0.1,0.1)).shadow(2).draw);
          });
        });
        Object.keys(vanish).forEach(k=>{
          let p = graph[k];
          let t = Math.min(1,transitTimer*0.05);
          let fr = time*0.02-Math.floor(time*0.02);
          let c1 = -fr * (fr-1) * 5;
          t = 1 - t;
          let rec = t*t*(6-5*t);
          R.translated(p.x,p.y,_=>{
            R.scaled(rec,rec,_=>{
              Shape.circle(Math.pow(fr,0.7)*0.5).translate(0,0).with(R.stroke(c1*0.1,Color.make(0.4,0.1,0.1)).shadow(2).draw);
              fr = (time*0.02+0.5)-Math.floor(time*0.02+0.5);
              c1 = -fr * (fr-1) * 5;
              Shape.circle(Math.pow(fr,0.7)*0.5).translate(0,0).with(R.stroke(c1*0.1,Color.make(0.4,0.1,0.1)).shadow(2).draw);
            });
          });
        });
      });
    });
    //Shape.text("abcdefgh").center.scale(100,100).translate(Po.size.x/2,Po.size.y/2).with(R.fill(Color.make(0,0,0)).draw);
    /*
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
    */
  };
  return scene;
});
