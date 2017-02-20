var Main = Poyo.scene("Main",(Po)=>{
  var scene = {};
  let stage = [];
  let intersections = [];
  let state = "title";
  let success = false;
  let animVel = 0;
  let frame = 0;
  let beginTime;
  let wScale = 1;
  let scoreCount = 0;
  function intersection(p,q){
    let a,b,c,d,e,f,g,h;
    if(p.x1!==undefined){
      a=p.x1,b=0,c=p.x2,d=600;
    }else{
      a=0,b=p.y1,c=800,d=p.y2;
    }
    if(q.x1!==undefined){
      e=q.x1,f=0,g=q.x2,h=600;
    }else{
      e=0,f=q.y1,g=800,h=q.y2;
    }
    let e1 = f*g-e*h, e2 = b*c-a*d;
    let dd = (d-b)*(g-e)-(c-a)*(h-f);
    if(Math.abs(dd) < 0.0001)return null;
    return {
      x : (e1*(c-a) - e2*(g-e)) / dd,
      y : (e1*(d-b) - e2*(h-f)) / dd
    };
  }
  function angle(p,q){
    let a,b,c,d;
    if(p.x1!==undefined){
      a = p.x2 - p.x1;
      b = 600;
    }else{
      a = 800;
      b = p.y2 - p.y1;
    }
    let l = Math.sqrt(a*a+b*b);
    a/=l,b/=l;
    if(q.x1!==undefined){
      c = q.x2 - q.x1;
      d = 600;
    }else{
      c = 800;
      d = q.y2 - q.y1;
    }
    l = Math.sqrt(c*c+d*d);
    c/=l,d/=l;
    return a*c+b*d;
  }
  function calcIntersection(){
    intersections = [];
    let once = false;
    for(let i=0;i<stage.length;i++){
      for(let j=i+1;j<stage.length;j++){
        const p = intersection(stage[i],stage[j]);
        if(p && 0 <= p.x && p.x <= 800 && 0 <= p.y && p.y <= 600){
          const a = angle(stage[i],stage[j]);
          if(Math.abs(a) < 0.1){
            if(once){
              return false;
            }
            once = true;
          }
          p.angle = a;
          p.rotate = 0;
          p.morph = 0;
          p.vibrate = 0;
          p.ratio = 1;
          intersections.push(p);
        }
      }
    }
    for(let i=0;i<intersections.length;i++){
      const i1 = intersections[i];
      for(let j=i+1;j<intersections.length;j++){
        const i2 = intersections[j];
        const di = Math.sqrt((i1.x-i2.x)*(i1.x-i2.x) + (i1.y-i2.y)*(i1.y-i2.y));
        if(di < 80)return false;
      }
    }
    return true;
  }
  function initTitle(){
    stage = [];
    let w;
    w = Math.random()*100-50;
    stage.push({x1:400-w*5,x2:400+w});
    w = -800/(100/w)/2;
    stage.push({y1:500-w,y2:500+w});
    stage[0].right = stage[1].right = true;
    scoreCount = -1;
    frame = 0;
    wScale = 1;
    success = false;
    scoreCount = 0;
    state = "title";
    calcIntersection()
  }
  function initStage(){
    stage = [];
    if(Math.random() < 0.5){
      let x1 = Math.random()*(800-100)+50;
      let x2 = Math.random()*(800-100)+50;
      let a = -(x2-x1)/600;
      a = -1 / a;
      let diff = -800/a;
      let y1,y2;
      if(diff>0){
        y1 = Math.random()*(600-diff);
        y2 = y1 + diff;
      }else{
        y2 = Math.random()*(600+diff);
        y1 = y2 - diff;
      }
      stage.push({x1:x1,x2:x2});
      stage.push({y1:y1,y2:y2});
    }else{
      let y1 = Math.random()*(600-100)+50;
      let y2 = Math.random()*(600-100)+50;
      let a = -(y2-y1)/800;
      a = -1 / a;
      let diff = -600/a;
      let x1,x2;
      if(diff>0){
        x1 = Math.random()*(800-diff);
        x2 = x1 + diff;
      }else{
        x2 = Math.random()*(800+diff);
        x1 = x2 - diff;
      }
      stage.push({y1:y1,y2:y2});
      stage.push({x1:x1,x2:x2});
    }
    stage[0].right = stage[1].right = true;
    for(let i=0;i<4;i++){
      for(let k=0;k<10000;k++){
        if(Math.random()<0.5){
          stage.push({x1:Math.random()*800,x2:Math.random()*800});
        }else{
          stage.push({y1:Math.random()*600,y2:Math.random()*600});
        }
        if(!calcIntersection()){
          stage.pop();
        }else{
          break;
        }
      }
    }
    success = false;
    animVel = 0;
    frame = 0;
    if(state=="title"){
      beginTime = new Date();
    }
    state = "game";
    scoreCount++;
  }
  initTitle();
  window.addEventListener("mousedown",_=>{
    let mx = Po.mouse.x - (Po.size.x-800)/2;
    let my = Po.mouse.y - (Po.size.y-600)/2;
    let ix = -1;
    for(let i=0;i<intersections.length;i++){
      let s = intersections[i];
      let dx = s.x - mx;
      let dy = s.y - my;
      let d = Math.sqrt(dx*dx+dy*dy);
      if(d < 30)ix = i;
    }
    if(ix==-1)return;
    if(state=="done")return;
    if(success)return;
    console.log(intersections[ix].angle);
    if(Math.abs(intersections[ix].angle) < 0.00001){
      success = true;
      animVel = 1;
      beginTime = beginTime - 0 + 2000;
      if(new Date() - beginTime < 0) beginTime = new Date();
    }else{
      intersections[ix].vibrate = 1;
    }
  });
  scene.step = ()=>{
    let mx = Po.mouse.x - (Po.size.x-800)/2;
    let my = Po.mouse.y - (Po.size.y-600)/2;
    if(success){
      for(let i=0;i<stage.length;i++){
        let p = stage[i];
        if(p.right && state != "done"){
          p.dist *= 1.7;
        }else{
          p.dist += (0 - p.dist) / 4;
          if(p.dist < 0)p.dist = 0;
        }
      }
      for(let i=0;i<intersections.length;i++){
        let s = intersections[i];
        if(Math.abs(s.angle) < 0.0001 && state != "done"){
          s.ratio+=animVel;
          s.rotate+=(animVel+1)/4;
        }else{
          s.ratio-=0.1;
        }
        if(s.ratio<0)s.ratio = 0;
        s.morph += (0 - s.morph) / 4.0;
        s.vibrate += (0 - s.vibrate) / 16.0;
      }
      animVel-=0.1;
      if(animVel<-2 && state!="done"){
        initStage();
      }
      document.body.style.cursor = "auto";
    }else{
      for(let i=0;i<stage.length;i++){
        let p = stage[i];
        if(p.x1!==undefined){
          let a = -600;
          let b = p.x2 - p.x1;
          let c = p.x1 * 600;
          let d = Math.abs(a*mx+b*my+c) / Math.sqrt(a*a+b*b);
          p.dist = d;
        }else{
          let a = p.y2 - p.y1;
          let b = -800;
          let c = p.y1 * 800;
          let d = Math.abs(a*mx+b*my+c) / Math.sqrt(a*a+b*b);
          p.dist = d;
        }
      }
      document.body.style.cursor = "auto";
      for(let i=0;i<intersections.length;i++){
        let s = intersections[i];
        let dx = s.x - mx;
        let dy = s.y - my;
        let d = Math.sqrt(dx*dx+dy*dy);
        s.dist = d;
        if(d<30){
          s.morph += (1 - s.morph) / 4.0;
          document.body.style.cursor = "pointer";
        }else s.morph += (0 - s.morph) / 4.0;
        s.rotate += Math.min(0.05,Math.sqrt(s.dist) * Math.PI / 360);
        s.vibrate += (0 - s.vibrate) / 16.0;
      }
      frame++;
    }
    if(state=="game"){
      let dur = new Date() - beginTime;
      let e = dur / 30 / 1000;
      if(e > 1){
        state = "done";
        success = true;
        animVel = 1;
        wScale = 100;
        setTimeout(_=>{
          window.open("https://twitter.com/intent/tweet?text="+encodeURI("[RIGHT ANGLE] Score : " + scoreCount + " https://phi16.github.io/Jam/0220")+"&hashtags=traP3jam","_blank");
          initTitle();
        },2000);
      }
    }
    wScale += (1 - wScale) / 4.0;
  };
  scene.draw = (R)=>{
    Shape.rect(Po.size.x,Po.size.y).with(R.fill(Color.black).draw);
    R.translated((Po.size.x-800)/2,(Po.size.y-600)/2,_=>{
      Shape.rect(800,600).with(R.fill(Color.white).draw);
      if(state=="title"){
        R.translated(400,200,_=>{
          R.scaled(0.55,0.55,_=>{
            Shape.image("title").translate(-674.5,-124).with(R.draw);
          });
        });
      }else{
        let dur = new Date() - beginTime;
        let e = Math.min(1,dur / 30 / 1000);
        Shape.rect(800*e,600*e).translate(400-400*e,300-300*e).with(R.fill(Color.make(0.9,0.9,0.9)).draw);
      }
      if(state=="done"){
        R.translated(400,300,_=>{
          R.scaled(0.55*wScale,0.55*wScale,_=>{
            Shape.image("over").translate(-674.5,-124).with(R.draw);
          });
        });
      }
      let barRatio = frame > 30 ? 1 : 1 + (1 - Math.pow((frame+10)/40,3)) * 10;
      for(let i=0;i<stage.length;i++){
        let p = stage[i];
        if(success && p.dist<3)continue;
        let b = Math.sqrt(p.dist) * barRatio;
        if(p.x1!==undefined){
          Shape.line(p.x1-b,0,p.x2-b,600).with(R.stroke(3,Color.black).draw);
          Shape.line(p.x1+b,0,p.x2+b,600).with(R.stroke(3,Color.black).draw);
        }else{
          Shape.line(0,p.y1-b,800,p.y2-b).with(R.stroke(3,Color.black).draw);
          Shape.line(0,p.y1+b,800,p.y2+b).with(R.stroke(3,Color.black).draw);
        }
      }
      let intRatio = frame > 55 ? 1 : frame < 35 ? 0 : 1 + (1 - Math.pow((frame-35)/20,2)) * 10;
      for(let i=0;i<intersections.length;i++){
        const s = intersections[i];
        let rad = Math.sqrt(s.dist) + 20 + s.morph * 20 + s.vibrate * 10 * (3*(Math.random()-0.5) + 3*Math.sin(s.rotate*20));
        rad *= s.ratio * intRatio;
        for(let j=0;j<4;j++){
          let base = j*Math.PI/2 + s.rotate;
          if(rad>=0)Shape.arc(rad,Math.PI*0.3+base,base).translate(s.x,s.y).with(R.stroke(8*s.ratio*Math.sqrt(intRatio),Color.black).draw);
        }
      }
    });
  };
  return scene;
});
