var Main = Poyo.scene("Main",(Po)=>{
  var scene = {};
  const radius = 80;
  const points = [];
  const lines = []; // but stored as a point
  let index = 0;
  let currentTransition = 0;
  let mx = 0, my = 0, tmx = 0, tmy = 0;
  const proc = (function*(){
    while(1){
      const p = yield;
      points.push(p);
      const q = yield;
      lines.push(q);
    }
  })();
  proc.next();
  let commit = _=>{};
  function calcFit(){
    let ps;
    if(currentTransition > 0.5)ps = points;
    else ps = lines;
    let mix, miy, mil = -1;
    for(let i=0;i<ps.length;i++){
      const x1 = ps[i].x, y1 = ps[i].y;
      for(let j=i+1;j<ps.length;j++){
        const x2 = ps[j].x, y2 = ps[j].y;
        const a = -(y2-y1), b = x2-x1, c = y1*b + x1*a;
        const l = Math.sqrt(a*a+b*b);
        if(l<0.0001)continue;
        const le = c/l;
        const qx = a/l*le, qy = b/l*le;
        const px = qx*radius*radius/le/le, py = qy*radius*radius/le/le;
        const ll = Math.sqrt((px-tmx)*(px-tmx)+(py-tmy)*(py-tmy));
        if(ll>20)continue;
        if(mil<0 || mil>ll){
          mil = ll;
          mix = px, miy = py;
        }
      }
    }
    if(mil>0){
      tmx = mix;
      tmy = miy;
      return;
    }
    ps.forEach(p=>{
      const px = p.x, py = p.y;
      const len = Math.sqrt(px*px+py*py);
      const qx = px*radius*radius/len/len, qy = py*radius*radius/len/len;
      const x1 = qx - 800*py, y1 = qy + 800*px;
      const x2 = qx + 800*py, y2 = qy - 800*px;
      const a = px, b = py, c = -px*qx-py*qy;
      const le = Math.abs(a*tmx+b*tmy+c)/Math.sqrt(a*a+b*b);
      if(le>10)return;
      if(mil<0 || mil>le){
        mil = le;
        const n = (tmx-qx)*px + (tmy-qy)*py > 0 ? -1 : 1;
        mix = tmx + n*px/len*mil;
        miy = tmy + n*py/len*mil;
      }
    });
    if(mil>0){
      tmx = mix;
      tmy = miy;
    }
  }
  window.addEventListener("mousedown",_=>{
    const x = Po.mouse.x - (Po.size.x-800)/2 - 400;
    const y = Po.mouse.y - (Po.size.y-600)/2 - 300;
    tmx = x, tmy = y;
    calcFit();
    commit({x:tmx,y:tmy,i:++index});
  });
  window.addEventListener("mousemove",_=>{
    const x = Po.mouse.x - (Po.size.x-800)/2 - 400;
    const y = Po.mouse.y - (Po.size.y-600)/2 - 300;
    tmx = x, tmy = y;
    calcFit();
  });
  const timeStep = (function*(){
    let committed = false;
    const load = function*(){
      commit = p=>{
        proc.next(p);
        committed = true;
        commit = _=>{};
      };
      while(1){
        if(committed)break;
        yield;
      }
      committed = false;
    };
    while(1){
      yield* load();
      for(let i=0;i<30;i++)yield;
      for(let i=0;i<=30;i++){
        currentTransition = i/30;
        yield;
      }
      yield* load();
      for(let i=0;i<30;i++)yield;
      for(let i=0;i<=30;i++){
        currentTransition = 1-i/30;
        yield;
      }
    }
  })();
  scene.step = ()=>{
    mx += (tmx - mx) / 4;
    my += (tmy - my) / 4;
    timeStep.next();
  };
  function ease(x){
    return x*x*(3-2*x);
  }
  function lerp(a,b,x){
    return a*(1-x) + b*x;
  }
  scene.draw = (R)=>{
    Shape.rect(Po.size.x,Po.size.y).with(R.fill(Color.white).draw);
    function drawObject(p,i){
      const px = p.x, py = p.y;
      const ca = (p.i+4)/12;
      const r = Math.cos(ca*Math.PI*2)*0.5+0.5;
      const g = Math.cos(ca*Math.PI*2 + Math.PI*2/3)*0.5+0.5;
      const b = Math.cos(ca*Math.PI*2 - Math.PI*2/3)*0.5+0.5;
      const color = Color.make(r,g,b);
      const len = Math.sqrt(px*px+py*py);
      const qx = px*radius*radius/len/len, qy = py*radius*radius/len/len;
      const ex = lerp(px,qx,ease(i)), ey = lerp(py,qy,ease(i)), el = lerp(0,1000/len,ease(i));
      const x1 = ex - el*py, y1 = ey + el*px;
      const x2 = ex + el*py, y2 = ey - el*px;
      Shape.line(x1,y1,x2,y2).with(R.stroke(3,color).blur(3).draw);
      Shape.circle(lerp(6,0,i)).translate(ex,ey).with(R.fill(color).blur(5).draw);
    }
    R.translated((Po.size.x-800)/2,(Po.size.y-600)/2,_=>{
      R.translated(400,300,_=>{
        Shape.circle(radius).with(R.stroke(2,Color.make(0.7,0.7,0.7)).draw);
        Shape.line(-Po.size.x/2,0,Po.size.x/2,0).with(R.stroke(2,Color.make(0.7,0.7,0.7)).draw);
        Shape.line(0,-Po.size.y/2,0,Po.size.y/2).with(R.stroke(2,Color.make(0.7,0.7,0.7)).draw);
        Shape.circle(3).translate(mx,my).with(R.fill(Color.make(0.5,0.5,0.5)).draw);
        Shape.circle(20).translate(mx,my).with(R.stroke(2,Color.make(0.8,0.8,0.8)).draw);
        if(currentTransition > 0.5){
          for(let i=0;i<points.length;i++){
            drawObject(points[i],currentTransition);
          }
          for(let i=0;i<lines.length;i++){
            drawObject(lines[i],1-currentTransition);
          }
        }else{
          for(let i=0;i<lines.length;i++){
            drawObject(lines[i],1-currentTransition);
          }
          for(let i=0;i<points.length;i++){
            drawObject(points[i],currentTransition);
          }
        }
      });
    });
  };
  return scene;
});
