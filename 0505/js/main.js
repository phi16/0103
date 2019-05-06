let stages = [ {
    A: {x:-2,y:0,e:{
      a: {B:0}
    },i:true},
    B: {x:2,y:0,e:{},a:true}
  },{
    A: {x:-3,y:0,e:{
      p: {B:0},
    },i:true},
    B: {x:0,y:0,e:{
      i: {C:0},
      o: {D:0},
    }},
    C: {x:3,y:-2,e:{}},
    D: {x:3,y:2,e:{},a:true}
  },{
    A: {x:-3,y:-1.5,e:{
      h: {B:0},
    },i:true},
    B: {x:-3,y:1.5,e:{
      e: {C:0},
    }},
    C: {x:0,y:1.5,e:{
      l: {D:0},
      o: {E:0}
    }},
    D: {x:0,y:-1.5,e:{
      l: {C:0}
    }},
    E: {x:3,y:1.5,e:{},a:true}
  },{
    A: {x:-4,y:0,e:{
      a: {B:0}
    }},
    B: {x:-2,y:-2,e:{
      a: {C:0},
      b: {E:0}
    },i:true},
    C: {x:-2,y:2,e:{
      a: {A:0,D:0},
    },i:true},
    D: {x:2,y:2,e:{
      b: {F:0}
    }},
    E: {x:2,y:-2,e:{},a:true},
    F: {x:4,y:2,e:{},a:true},
  },{
    A: {x:0,y:-4,e:{
      a: {A:[Math.PI/2,4],B:0}
    },i:true},
    B: {x:Math.sqrt(3)*2,y:-2,e:{
      a: {C:0},
      b: {B2:0}
    }},
    C: {x:Math.sqrt(3)*2,y:2,e:{
      a: {D:0},
      b: {C2:0}
    }},
    D: {x:0,y:4,e:{
      a: {E:0},
      b: {D2:0}
    }},
    E: {x:-Math.sqrt(3)*2,y:2,e:{
      a: {F:0},
      b: {E2:0}
    }},
    F: {x:-Math.sqrt(3)*2,y:-2,e:{
      a: {A:0},
      b: {F2:0}
    }},
    B2: {x:Math.sqrt(3)*2*1.5,y:-2*1.5,e:{},a:true},
    C2: {x:Math.sqrt(3)*2*1.5,y:2*1.5,e:{},a:true},
    D2: {x:0,y:1,e:{},a:true},
    E2: {x:-Math.sqrt(3)*2*1.5,y:2*1.5,e:{},a:true},
    F2: {x:-Math.sqrt(3)*2*1.5,y:-2*1.5,e:{},a:true},
  },{
    A: {x:0,y:-3,e:{
      a: {B:0,D:0}
    },i:true},
    B: {x:-2,y:-1,e:{
      b: {C:0}
    },a:true},
    C: {x:-2,y:1,e:{
      a: {C:[Math.PI/2,4]},
      b: {B:0}
    }},
    D: {x:2,y:-1,e:{
      a: {E:0},
      b: {G:0}
    },v:true},
    E: {x:0,y:1,e:{
      a: {D:0},
      b: {F:0}
    }},
    F: {x:2,y:3,e:{
      a: {G:0},
      b: {E:0},
    },v:true},
    G: {x:4,y:1,e:{
      a: {F:0},
      b: {D:0}
    },v:true}
  },{
    A: {x:-3,y:-3,e:{
      a: {B:0}
    },i:true},
    B: {x:0,y:-3,e:{
      a: {B:[Math.PI/2,4]},
      b: {C:0}
    }},
    C: {x:3,y:-3,e:{},a:true},
    T0: {x:-2,y:-1,e:{
      0: {T1:0}
    },i:true},
    T1: {x:-2-2,y:-1+Math.sqrt(3)*2,e:{
      0: {T2:0}
    },v:true},
    T2: {x:-2+2,y:-1+Math.sqrt(3)*2,e:{
      0: {T0:0}
    },v:true},
    S0: {x:2-0.2,y:-1+0.2,e:{
      0: {S1:0}
    },i:true},
    S1: {x:2-0.2,y:2+0.2,e:{
      0: {S2:0}
    },v:true},
    S2: {x:5-0.2,y:2+0.2,e:{
      0: {S3:0}
    },v:true},
    S3: {x:5-0.2,y:-1+0.2,e:{
      0: {S0:0}
    },v:true},
  },{
    A0: {x:-3,y:-3,e:{
      b: {A0:[-Math.PI/2,2]},
      a: {A1:0}
    },i:true},
    A1: {x:0,y:-3,e:{
      a: {A1:[-Math.PI/2,2]},
      b: {A2:0}
    }},
    A2: {x:3,y:-3,e:{
      0: {A2:[-Math.PI/2,2]}
    },a:true},
    B0: {x:-3,y:-1,e:{
      a: {B0:[-Math.PI/2,2]},
      b: {B1:0}
    },i:true},
    B1: {x:0,y:-1,e:{
      b: {B1:[-Math.PI/2,2]},
      a: {B2:0}
    }},
    B2: {x:3,y:-1,e:{
      0: {B2:[-Math.PI/2,2]}
    },v:true},
    C0: {x:-6,y:1,e:{
      0: {C1:0}
    },i:true},
    C1: {x:-4,y:1,e:{
      0: {C2:0}
    }},
    C2: {x:-2,y:1,e:{
      0: {C3:0}
    }},
    C3: {x:-0,y:1,e:{
      0: {C4:0}
    }},
    C4: {x:2,y:1,e:{
      0: {C5:0}
    }},
    C5: {x:4,y:1,e:{
      0: {C6:0}
    },a:true},
    C6: {x:6,y:1,e:{
      0: {C6:[-Math.PI/2,2]}
    },v:true},
    D0: {x:-4,y:3,e:{
      a: {D1:0},
      b: {D0:[Math.PI/2,2]}
    },i:true},
    D1: {x:-2,y:3,e:{
      a: {D2:0},
      b: {D1:[Math.PI/2,2]}
    }},
    D2: {x:0,y:3,e:{
      a: {D3:0},
      b: {D2:[Math.PI/2,2]}
    }},
    D3: {x:2,y:3,e:{
      a: {D4:0},
      b: {D3:[Math.PI/2,2]}
    },a:true},
    D4: {x:4,y:3,e:{
      0: {D4:[Math.PI/2,2]},
    },v:true},
  },{
    A0: {x:-4.5,y:-3,e:{
      0: {A0:[-Math.PI/2,2]},
      b: {A1:0}
    },i:true},
    A1: {x:-1.5,y:-3,e:{
      a: {A2:0}
    }},
    A2: {x:1.5,y:-3,e:{
      b: {A3:0},
    }},
    A3: {x:4.5,y:-3,e:{
      0: {A3:[-Math.PI/2,2]}
    },v:true},
    B0: {x:-4.5+3.25,y:-1.5,e:{
      a: {B1:0}
    },i:true,a:true},
    B1: {x:-4.5+3.25,y:1,e:{
      0: {B2:0}
    }},
    B2: {x:-2+3.25,y:1,e:{
      a: {B3:0}
    }},
    B3: {x:-2+3.25,y:-1.5,e:{
      0: {B0:0}
    }},
    D0: {x:-5,y:2.5,e:{
      b: {D1:0},
      a: {D0:[Math.PI/2,2]}
    },i:true},
    D1: {x:-2.5,y:2.5,e:{
      b: {D2:0},
      a: {D1:[Math.PI/2,2]}
    }},
    D2: {x:0,y:2.5,e:{
      b: {D3:0},
      a: {D2:[Math.PI/2,2]}
    }},
    D3: {x:2.5,y:2.5,e:{
      b: {D4:0},
      a: {D3:[Math.PI/2,2]}
    },a:true},
    D4: {x:5,y:2.5,e:{
      0: {D4:[Math.PI/2,2]},
    },v:true},
  },{
    A: {x:0,y:-Math.sqrt(3),e:{
      e: {B:0}
    },i:true},
    B: {x:2,y:Math.sqrt(3),e:{
      n: {C:0}
    }},
    C: {x:-2,y:Math.sqrt(3),e:{
      d: {A:0}
    }},
    D: {x:0,y:1/Math.sqrt(3),e:{},a:true}
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
      current[n][n] = {"":true};
    }
  });
  vanish = {};
  stageIx++;
}
let alive = true;
function resetActor() {
  current = {};
  current[""] = {};
  Object.keys(graph).forEach(n=>{
    let p = graph[n];
    if(p.i) {
      current[""][n] = {"":true};
    }
  });
  vanish = {};
  alive = true;
}
loadStage();

let transitTimer = 0;
let toNext = false;
function transit(key) {
  if(toNext) return;
  vanish = {};
  let newCurrent = {};
  let onp = {};
  alive = false;
  Object.keys(current).forEach(k=>{
    Object.keys(current[k]).forEach(k2=>{
      let p = graph[k2];
      let yes = false;
      if(p.e[key]) {
        let kk = key;
        if(!newCurrent[k2]) newCurrent[k2] = {};
        Object.keys(p.e[kk]).forEach(k3=>{
          if(!newCurrent[k2][k3]) {
            newCurrent[k2][k3] = {};
          }
          newCurrent[k2][k3][kk] = true;
          onp[k3] = true;
          alive = true;
        });
        yes = true;
      }
      if(97 <= key.charCodeAt(0) && key.charCodeAt(0) <= 122 && p.e["0"]) {
        let kk = "0";
        if(!newCurrent[k2]) newCurrent[k2] = {};
        Object.keys(p.e[kk]).forEach(k3=>{
          if(!newCurrent[k2][k3]) {
            newCurrent[k2][k3] = {};
          }
          newCurrent[k2][k3][kk] = true;
          onp[k3] = true;
          alive = true;
        });
        yes = true;
      }
      if(!yes) {
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
    if(!alive && transitTimer > 50) {
      resetActor();
      transitTimer = 0;
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
              if(p != p2) {
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
                if(k == "0") k = "";
                Shape.text(k).center.scale(0.7,0.7).translate(cx,cy).with(R.stroke(0.2,Color.make(1,1,1)).draw);
                Shape.text(k).center.scale(0.7,0.7).translate(cx,cy).with(R.fill(Color.make(0.4,0.2,0.05)).shadow(2).draw);
              } else {
                let dir = p.e[k][n2][0];
                let sc = p.e[k][n2][1];
                let a = 0.6;
                let x1 = p.x + Math.cos(dir-a)*sc;
                let y1 = p.y + Math.sin(dir-a)*sc;
                let x2 = p.x + Math.cos(dir+a)*sc;
                let y2 = p.y + Math.sin(dir+a)*sc;
                let x0 = p.x + Math.cos(dir-a)*nodeRad;
                let y0 = p.y + Math.sin(dir-a)*nodeRad;
                let x3 = p.x + Math.cos(dir+a)*nodeRad;
                let y3 = p.y + Math.sin(dir+a)*nodeRad;
                let dx = -Math.cos(dir+a), dy = -Math.sin(dir+a);
                Shape.bezier(x0,y0,x1,y1,x2,y2,x3-dx*arrSz*0.5,y3-dy*arrSz*0.5).with(R.stroke(0.1,Color.make(0.7,0.5,0.1)).shadow(2).draw);
                let tri = [x3,y3,x3+arrSz*(-dx+dy*0.4),y3+arrSz*(-dy-dx*0.4),x3+arrSz*(-dx-dy*0.4),y3+arrSz*(-dy+dx*0.4)];
                Shape.polygon(tri).with(R.fill(Color.make(0.7,0.5,0.1)).shadow(2).draw);
                let cx = x0*0.25+(x1+x2)*0.5*0.75, cy = y0*0.25+(y1+y2)*0.5*0.75;
                if(k == "0") k = "";
                Shape.text(k).center.scale(0.7,0.7).translate(cx,cy).with(R.stroke(0.2,Color.make(1,1,1)).draw);
                Shape.text(k).center.scale(0.7,0.7).translate(cx,cy).with(R.fill(Color.make(0.4,0.2,0.05)).shadow(2).draw);
              }
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
            if(!p) { // reset position
              p = {x:p2.x, y:p2.y-3};
            }
            let t = Math.min(1,transitTimer*0.01);
            t = 1-Math.pow(1-t,20);
            let px = p.x*(1-t) + p2.x*t;
            let py = p.y*(1-t) + p2.y*t;
            if(p == p2) { // Bezier
              let key = Object.keys(current[k][k])[0];
              if(key != "") {
                let dir = p.e[key][k2][0];
                let sc = p.e[key][k2][1];
                let a = 0.6;
                let x0 = p.x;
                let y0 = p.y;
                let x1 = p.x + Math.cos(dir-a)*sc;
                let y1 = p.y + Math.sin(dir-a)*sc;
                let x2 = p.x + Math.cos(dir+a)*sc;
                let y2 = p.y + Math.sin(dir+a)*sc;
                let x3 = p.x;
                let y3 = p.y;
                px = x0 * Math.pow(1-t,3)
                   + 3*x1 * Math.pow(1-t,2) * Math.pow(t,1)
                   + 3*x2 * Math.pow(1-t,1) * Math.pow(t,2)
                   + x3 * Math.pow(t,3);
                py = y0 * Math.pow(1-t,3)
                   + 3*y1 * Math.pow(1-t,2) * Math.pow(t,1)
                   + 3*y2 * Math.pow(1-t,1) * Math.pow(t,2)
                   + y3 * Math.pow(t,3);
                }
            }
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
