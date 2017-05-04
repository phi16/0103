var Main = Poyo.scene("Main",(Po)=>{
  var scene = {};
  let time = 0;
  let camY = 0;
  let y = 0, vy = 0;
  let x = 0, vx = 1.5;
  let aburage = [800], nextA = 1600;
  let abuType = [0];
  let a = 0, va = 0, rota = 0, rotav = 0;
  let cnt = 0, cntx = 800, noga = 0, nogax = 800;
  let wait = 0;
  let gosencho = false;
  let end = false, endTimer = 0;
  let perc = 0.005;
  function update(){
    if(cnt+noga >= 100 || gosencho){
      end = true;
    }
  }
  function init(){
    time = 0;
    camY = 0;
    y = 0, vy = 0;
    x = 0, vx = 1.5;
    aburage = [800], nextA = 1600;
    abuType = [0];
    a = 0, va = 0, rota = 0, rotav = 0;
    cnt = 0, cntx = 800, noga = 0, nogax = 800;
    wait = 0;
    gosencho = false;
    end = false, endTimer = 0;
    perc = 0.01;
  }
  let blur = false;
  window.onfocus = _=>{
    blur = false;
  };
  window.onblur = _=>{
    blur = true;
  };
  scene.step = ()=>{
    if(blur)return;
    time++;
    if(wait>0)wait--;
    vy -= (y - 0) / 4.;
    vy *= 0.6;
    y += vy;
    camY += (y - camY) / 16.;
    x += vx;
    if(end){
      vx *= 0.95;
      endTimer++;
      if(endTimer > 100){
        if(gosencho){
          window.open("https://twitter.com/intent/tweet?text="+encodeURI("[tombi sarais aburage] 5000兆円を手にいれた！ https://phi16.github.io/Jam/0504")+"&hashtags=traP3jam","_blank");
        }else{
          window.open("https://twitter.com/intent/tweet?text="+encodeURI("[tombi sarais aburage] " + (cnt+noga) + "個中" + cnt + "個の油揚げを手にいれた！ https://phi16.github.io/Jam/0504")+"&hashtags=traP3jam","_blank");
        }
        init();
      }
    }
    va -= (a - 0) / 32.;
    va *= 0.7;
    a += va;
    rota += rotav;
    if(cnt>0)cntx += (0 - cntx) / 8.;
    if(noga>0)nogax += (0 - nogax)/8.;
    if(rotav > 0.02){
      rotav += (0 - rotav) / 16.;
    }else{
      rota = rotav = 0;
    }
    while(nextA < x+1000){
      aburage.push(nextA);
      let t = Math.random()<perc?1:0;
      abuType.push(t);
      nextA += 400 + Math.random()*800;
    }
    while(aburage.length > 0 && aburage[0]+200 < x){
      aburage.splice(0,1);
      abuType.splice(0,1);
      noga++;
      update();
      if(vx > 10)vx -= 0.3;
    }
  };
  window.addEventListener('keydown',e=>{
    if(end)return;
    if(e.keyCode==53){
      perc = 0.1;
    }
    if(e.keyCode==32 && wait==0){
      y = 440;
      vy = -0.5;
      a = -Math.PI/2;
      va = 0;
      wait = 10;
      for(let i=0;i<aburage.length;i++){
        if(Math.abs(aburage[i] - x-200) < 50){
          if(vx < 15) vx += 1;
          else vx += Math.random()*6-3;
          cnt++;
          if(abuType[i]==1)gosencho = 1;
          update();
          rota = 0;
          rotav = 1;
          aburage.splice(i,1);
          abuType.splice(i,1);
          i--;
          break;
        }
      }
    }
  });
  scene.draw = (R)=>{
    Shape.rect(Po.size.x,Po.size.y).with(R.fill(Color.white).draw);
    R.translated((Po.size.x-800)/2,(Po.size.y-600)/2,_=>{
      Shape.rect(800,600).with(R.fill(Color.make(0.6,0.9,1)).draw);
      if(cnt){
        if(gosencho){
          Shape.image("moji").scale(0.5,0.5).translate(300,240).with(R.draw);
        }else{
          Shape.text(cnt + " Sarai").right.scale(100,100).translate(800-40+cntx,300).with(R.fill(Color.make(0.5,0.8,1)).draw);
        }
      }
      if(noga)Shape.text(noga + " Nogashi").right.scale(100,100).translate(800-40+nogax,400).with(R.fill(Color.make(0.5,0.8,1)).draw);
      R.translated(0,-camY,_=>{
        R.translated(-(x*0.4)%120,0,_=>{
          for(let i=0;i<11;i++){
            Shape.circle(60).translate(60+i*120,400+120-30).with(R.fill(Color.make(140/255,233/255,27/255)).draw);
          }
        });
        R.translated(-(x*0.8)%80,0,_=>{
          for(let i=0;i<11;i++){
            Shape.circle(40).translate(40+i*80,400+120-10).with(R.fill(Color.make(120/255,215/255,50/255)).draw);
          }
        });
        R.translated(-x%40,0,_=>{
          for(let i=0;i<21;i++){
            Shape.circle(20).translate(20+i*40,400+120).with(R.fill(Color.make(53/255,200/255,105/255)).draw);
          }
        });
        R.translated(200,300,_=>{
          Shape.circle(40).scale(1,0.7).rotate(a+rota+Math.sin(time*Math.PI/80)*0.2).translate(0,-200+Math.sin(time*Math.PI/40)*10+y).with(R.fill(Color.make(1,0.6+0.3*rotav,0.4)).draw);
          Shape.text("とび↓").rightDown.scale(30,30).translate(0,-240+Math.sin(time*Math.PI/40)*10+y).with(R.fill(Color.make(0.5,0.4,0)).draw);
        });
      });
      Shape.rect(800,80+camY).translate(0,400+120-camY).with(R.fill(Color.make(34/255,177/255,56/255)).draw);

      for(let i=0;i<aburage.length;i++){
        R.translated(aburage[i]-400-x,-camY+40,_=>{
          R.translated(400,400,_=>{
            R.rotated(Math.PI/9,_=>{
              if(abuType[i]==0){
                Shape.rect(50,90).with(R.fill(Color.make(1,201/255,14/255)).draw);
              }else{
                Shape.image("5000chou").translate(-150,-55).scale(0.6,0.6).rotate(-Math.PI/2).with(R.draw);
              }
            });
          });
          if(abuType[i]==0){
            Shape.text("↑あぶらげ").leftUp.scale(30,30).translate(50+350,90+420).with(R.fill(Color.make(255/25,239/255,183/255)).draw);
          }else{
            Shape.text("↑").leftUp.scale(30,30).translate(50+350,90+420).with(R.fill(Color.make(255/25,239/255,183/255)).draw);
            Shape.image("moji").scale(0.15,0.15).translate(70+350,90+420).with(R.draw);
          }
        });
      }

      Shape.circle(100).translate(800,0).with(R.fill(Color.make(1,1,0)).blur(120+20*Math.sin(time*Math.PI/40)).draw);
      Shape.rect(1000,600).translate(800,0).with(R.fill(Color.white).draw);
      Shape.rect(1000,500).translate(0,-500).with(R.fill(Color.white).draw);
      Shape.rect(1000,600).translate(-1000,0).with(R.fill(Color.white).draw);
      if(blur){
        Shape.text("P a u s e d").up.scale(30,30).translate(400,620).with(R.fill(Color.make(0.5,0.5,0.5)).draw);
      }else{
        Shape.text("[Space]").up.scale(30,30).translate(400,620).with(R.fill(Color.make(0.8,0.8,0.8)).draw);
        Shape.text("[5]").up.scale(30,30).translate(400,670).with(R.fill(Color.make(0.98,0.98,0.98)).draw);
      }
      if(cnt+noga>=10)Shape.text("あぶらげ100個ちゃれんじ").down.scale(30,30).translate(400,-20).with(R.fill(Color.make(0.8,0.8,0.8)).draw);
    });
  };
  return scene;
});
