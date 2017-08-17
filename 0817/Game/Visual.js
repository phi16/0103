Util.register("Visual",_=>{
  const v = {};

  const waitQ = {};
  v.wait = str=>Q.do(function*(){
    if(!waitQ[str])waitQ[str] = Q.emptyBox();
    return Q.takeBox(waitQ[str]);
  });
  v.emit = (str,data)=>Q.do(function*(){
    if(!waitQ[str])waitQ[str] = Q.emptyBox();
    return Q.putBox(waitQ[str],data);
  });

  Q.run(Q.do(function*(){
    const shape = Shape.rect(0,0,Util.width,Util.height);

    const cScale = 0.6;

    let camX = 0, camY = Util.height*0.3;

    let x = 60, y = Util.height, vx = 0, vy = 0, angle = 0;
    let shooting = false, submerge = false;
    let sca = 0, goalPos = Util.width*3;
    let goal = false, startTime = 0, endTime = 0;

    const chara = Image.get("res/chara.png");
    const arm = Image.get("res/arm.png");
    const drop = Image.get("res/drop.png");
    const gate = Image.get("res/gate.png");
    const gate2 = Image.get("res/gate2.png");
    const water = Image.get("res/water.jpg");

    let drops = [];
    let dropPoints = {};

    let blockList = [
    //  {x:800,y:400,w:400,h:200}
    ];
    let blockShape = [];
    blockShape.push(Shape.rect(0,Util.height,Util.width*10,Util.height));
    blockList.forEach(l=>{
      blockShape.push(Shape.rect(l.x,l.y,l.w,l.h));
    });
    blockShape = Shape.union(blockShape);

    let pressKey = [];
    window.addEventListener("keydown",e=>{
      pressKey[e.keyCode] = true;
    });
    window.addEventListener("keyup",e=>{
      pressKey[e.keyCode] = false;
    });
    function isPressing(kc){
      if(pressKey[kc.charCodeAt(0)]){
        if(startTime==0)startTime = new Date();
        return true;
      }else return false;
    }

    const render = _=>{
      R.fill(Color.rgb(1,1,1))(Shape.rect(0,0,Util.width,Util.height));
      R.translate(-camX,-camY)(_=>{
        R.shadowed(0,0,10,Color.rgba(0,0,0,0.5))(_=>{
          R.fill(Color.rgb(1,1,1))(blockShape);
        });
        R.translate(goalPos+60-gate.width()/2,Util.height-gate.height())(_=>{
          gate.draw();
        });
        R.translate(x,y-chara.height()*cScale)(_=>{
          R.scaleAt(chara.width()*0.5*cScale,chara.height()*cScale,1-sca*sca,1-sca*sca)(_=>{
            R.scale(cScale,cScale)(_=>{
              R.translate(-vx*5,-vy*5)(_=>{
                R.alpha(0.4)(_=>{
                  chara.draw();
                });
              });
              chara.draw();
              R.rotateAt(chara.width()*0.42,chara.height()*0.5,angle+0.36)(_=>{
                arm.draw();
              });
            });
          });
        });
        drops.forEach(d=>{
          R.translate(d.x,d.y)(_=>{
            R.scale(0.4,0.4)(_=>{
              R.rotate(-Math.atan2(d.vx,d.vy))(_=>{
                R.translate(-drop.width()/2,0)(_=>{
                  drop.draw();
                });
              });
            });
          });
        });
        let charaShape = Shape.circle(x+chara.width()*0.4*cScale,y,20*sca*sca+0.01);
        let po = [charaShape];
        Object.keys(dropPoints).forEach(v=>{
          let o = dropPoints[v];
          po.push(
            Shape.translate(o.x,o.y)(
              Shape.rotate(o.a)(
                Shape.scale(4,2)(
                  Shape.circle(0,0,20)))));
        });
        R.clip(Shape.union(po))(_=>{
          let blocks = [charaShape];
          blocks.push(blockShape);
          R.clip(Shape.union(blocks))(_=>{
            for(let i=0;i<10;i++){
              R.translate(i*water.width()*1.5,400)(_=>{
                R.scale(1.5,1.5)(_=>{
                  water.draw();
                });
              });
            }
          });
        });
        R.translate(goalPos+60-gate2.width()/2,Util.height-gate.height())(_=>{
          gate2.draw();
        });
      });
      let col = Color.rgb(0.8,0.8,0.8);
      R.shadowed(0,1,2,Color.rgb(0.4,0.4,0.4))(_=>{
        if(startTime==0){
          R.fill(col)(Shape.numberText(10,10,20,"0.000sec [Space/A/D/Click]",-1,-1));
        }else if(endTime==0){
          let t = (new Date() - startTime)/1000 + "sec";
          R.fill(col)(Shape.numberText(10,10,20,t,-1,-1));
        }else{
          let t = (endTime - startTime)/1000 + "sec";
          R.fill(col)(Shape.numberText(10,10,20,t,-1,-1));
        }
      });
    };
    const handler = box=>Q.do(function*(){
      yield Q.join.any([Q.do(function*(){
        yield Q.listen(Q.do(function*(){
          const b = yield box.receive;
          if(b.mouse){
            let m = b.mouse;
            m.x -= x+chara.width()*0.42*cScale-camX;
            m.y -= y-chara.height()*0.5*cScale-camY;
            if(m.x*m.x+m.y*m.y < 0.001) angle = 0;
            else angle = Math.atan2(m.y,m.x);
            if(m.press){
              if(startTime==0)startTime = new Date();
              shooting = true;
            }
            if(m.release){
              if(startTime==0)startTime = new Date();
              shooting = false;
            }
          }
        }));
        let frame = 0;
        yield Q.listen(Q.do(function*(){
          if(isPressing(' ')){
            let ok = false;
            let cx = x+chara.width()*0.4*cScale;
            let cy = y;
            Object.keys(dropPoints).forEach(v=>{
              let p = dropPoints[v];
              let dx = cx-p.x;
              let dy = cy-p.y;
              if(dx*dx+dy*dy < 80*80){
                ok = true;
              }
            });
            if(ok){
              submerge = true;
            }else{
              submerge = false;
            }
          }else submerge = false;
          if(submerge){
            if(isPressing('D'))vx+=0.5;
            if(isPressing('A'))vx-=0.5;
            sca += 0.05;
          }else{
            if(isPressing('D'))vx+=0.2;
            if(isPressing('A'))vx-=0.2;
            sca -= 0.05;
          }
          if(sca<0)sca=0;
          if(sca>1)sca=1;
          x += vx;
          y += vy;
          vx *= 0.9;
          vy += 0.1;
          if(x<0)x=vx=0;
          if(y>Util.height)y=Util.height,vy=0;
          if(x>goalPos){
            goal = true;
            submerge = false;
            endTime = new Date();
          }

          /*
          for(let i=0;i<blockList.length;i++){
            let b = blockList[i];
            if(Shape.rect(b.x,b.y,b.w,b.h).region(d.x,d.y)){
              let d1 = Math.abs(b.x-d.x);
              let d2 = Math.abs(b.y-d.y);
              let d3 = Math.abs(b.x+b.w-d.x);
              let d4 = Math.abs(b.y+b.h-d.y);
              let m = Math.min(d1,Math.min(d2,Math.min(d3,d4)));
              if(m==d1 || m==d3)a=Math.PI/2;
              else a=0;
            }
          }*/

          if(x-camX<0+100)camX = x-100;
          if(x-camX>Util.width-300)camX = x-Util.width+300;
          if(y-camY<0+300)camY = y-300;
          if(y-camY>Util.height-50)camY = y-Util.height+50;
          if(camX<0)camX=0;
          for(let i=0;i<drops.length;i++){
            let d = drops[i];
            d.x += d.vx;
            d.y += d.vy;
            d.vy += 0.1;
            if(blockShape.region(d.x,d.y)){
              let a;
              if(d.y > Util.height)a=0;
              for(let i=0;i<blockList.length;i++){
                let b = blockList[i];
                if(Shape.rect(b.x,b.y,b.w,b.h).region(d.x,d.y)){
                  let d1 = Math.abs(b.x-d.x);
                  let d2 = Math.abs(b.y-d.y);
                  let d3 = Math.abs(b.x+b.w-d.x);
                  let d4 = Math.abs(b.y+b.h-d.y);
                  let m = Math.min(d1,Math.min(d2,Math.min(d3,d4)));
                  if(m==d1 || m==d3)a=Math.PI/2;
                  else a=0;
                }
              }
              dropPoints[[d.x,d.y]] = {x:d.x,y:d.y,a:a};
              drops.splice(i,1);
              i--;
            }
          }
          if(shooting && !submerge){
            if(frame%15==0){
              const d = {};
              d.x = x+chara.width()*0.48*cScale;
              d.y = y-chara.height()*0.46*cScale;
              d.vx = Math.cos(angle)*6;
              d.vy = Math.sin(angle)*6;
              d.x += d.vx * 5;
              d.y += d.vy * 5;
              drops.push(d);
            }
            frame++;
          }else{
            frame = 0;
          }
          yield Q.switch;
        }));
        yield Q.abort;
      }),Q.do(function*(){
        while(1){
          if(goal)break;
          yield Q.switch;
        }
      })]);
      vx = 0;
      for(let i=0;i<30;i++){
        sca-=0.05;
        if(sca<0)sca=0;
        drops = [];
        yield Q.switch;
      }
      let time = 0;
      while(1){
        let t = time%170/150;
        if(t<1){
          t = t*2-1;
          t = 1-t*t;
          t *= chara.height()*0.5*cScale;
          y = Util.height-t;
        }else y = Util.height;
        yield Q.switch;
        time++;
        if(time==510){
          let t = (endTime-startTime)/1000 + "sec";
          window.open("https://twitter.com/intent/tweet?text="+encodeURI("Score : " + t + " https://phi16.github.io/Jam/0817")+"&hashtags=traP3jam","_blank");
        }
      }
      yield Q.abort;
    });
    const view = yield View.make(_=>({mouse:_}),shape,render,handler);
    Screen.register("Visual",view);
  }));

  return v;
});
