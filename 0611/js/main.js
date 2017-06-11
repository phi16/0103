var Main = Poyo.scene("Main",(Po)=>{
  var scene = {};
  const pi = 3.1415926535;
  var root = {stalk:true,length:10};
  const moss = Color.make(14/255,92/255,35/255);
  const lmoss = Color.make(24/255,128/255,40/255);
  const green = Color.make(36/255,174/255,74/255);
  const lime = Color.make(149/255,191/255,21/255);
  const brown = Color.make(133/255,70/255,47/255);
  const camPos = {x:400,y:400,z:10};
  let boundary = {};
  let leafs = [];
  let light = [];
  let lightDir = {x:-(Math.random()*2-1)*0.3,y:1};
  let stock = 1;
  let startDate = new Date();
  let began = false;
  function calcBoundary(){
    function traverse(node){
      let h = node.length;
      if(node.leaf){
        return [{x:0,y:-h/2,s:h*0.65,leaf:node}];
      }else if(node.stalk){
        return [{x:0,y:-h,dir:0,stalk:node}];
      }else if(node.grow){
        let l = traverse(node.left);
        let r = traverse(node.right);
        let r1 = node.direction - node.diff/2, r2 = node.direction + node.diff/2;
        l.forEach(p=>{
          let x = p.x * Math.cos(r1) - p.y * Math.sin(r1);
          let y = p.x * Math.sin(r1) + p.y * Math.cos(r1);
          p.x = x;
          p.y = y - h;
          if(p.dir!==undefined)p.dir += r1;
        });
        r.forEach(p=>{
          let x = p.x * Math.cos(r2) - p.y * Math.sin(r2);
          let y = p.x * Math.sin(r2) + p.y * Math.cos(r2);
          p.x = x;
          p.y = y - h;
          if(p.dir!==undefined)p.dir += r2;
        });
        return [].concat(l,r);
      }
    }
    let points = traverse(root);
    boundary = {left:0,right:0,top:0,bottom:1};
    leafs = [];
    points.forEach(p=>{
      boundary.left = Math.min(boundary.left,p.x);
      boundary.right = Math.max(boundary.right,p.x);
      boundary.top = Math.min(boundary.top,p.y);
      boundary.bottom = Math.max(boundary.bottom,p.y);
      if(p.leaf){
        leafs.push(p);
      }
      if(p.stalk){
        p.stalk.real = {x:p.x,y:p.y,d:p.dir};
      }
    });
  }
  calcBoundary({x:0,y:0},root);
  function collide(p){
    for(let i=0;i<leafs.length;i++){
      let l = leafs[i];
      let x = p.x - l.x;
      let y = p.y - l.y;
      if(x*x+y*y < l.s*l.s){
        return l.leaf;
      }
    }
    return false;
  }
  function addLightEffect(x,y){
    // mendoi
  }
  window.addEventListener("mousedown",_=>{
    const rel = {x:Po.mouse.x-(Po.size.x-800)/2,y:Po.mouse.y-(Po.size.y-600)/2};
    const pos = {x:(rel.x-camPos.x)/camPos.z,y:(rel.y-camPos.y)/camPos.z};
    function traverse(pos,node,act){
      if(!node)return;
      let h = node.length;
      if(node.leaf){
        pos.y += h*0.7;
        if(pos.x*pos.x + pos.y*pos.y < h*0.6*h*0.6){
          act(node);
        }
      }else if(node.stalk){
        pos.y += h;
        if(pos.x*pos.x + pos.y*pos.y < h/2*h/2){
          act(node);
        }
      }else if(node.grow){
        pos.y += h;
        let r1 = -node.direction + node.diff/2, r2 = -node.direction - node.diff/2;
        let p1 = {
          x:pos.x * Math.cos(r1) - pos.y * Math.sin(r1),
          y:pos.x * Math.sin(r1) + pos.y * Math.cos(r1)
        };
        let p2 = {
          x:pos.x * Math.cos(r2) - pos.y * Math.sin(r2),
          y:pos.x * Math.sin(r2) + pos.y * Math.cos(r2)
        };
        traverse(p1,node.left,act);
        traverse(p2,node.right,act);
      }
    }
    let procd = false;
    if(stock<=0)return;
    traverse({x:pos.x,y:pos.y},root,e=>{
      if(procd)return;
      if(e.leaf){
        delete e.leaf;
        e.stalk = true;
        boundary = {left:0,right:0,top:0,bottom:0};
        calcBoundary();
        procd = true;
        stock--;
      }else if(e.stalk){
        let dx = e.real.x - pos.x;
        let dy = e.real.y - pos.y;
        let dir = dx*dx+dy*dy<0.001 ? 0 : Math.atan2(-dx,dy) - e.real.d;
        delete e.stalk;
        e.grow = true;
        e.direction = dir;
        e.diff = pi/4 + Math.random()*pi/3;
        let sc1 = Math.random()*0.3 + 0.9;
        let sc2 = Math.random()*0.3 + 0.9;
        e.left = {leaf:true,length:e.length*sc1};
        e.right = {leaf:true,length:e.length*sc2};
        boundary = {left:0,right:0,top:0,bottom:0};
        calcBoundary();
        procd = true;
        stock--;
        if(!began){
          startDate = new Date();
          began = true;
        }
      }
    });
  });
  scene.step = ()=>{
    let cxto = 400 - (boundary.left + boundary.right) / 2 * camPos.z;
    let cyto = 300 - (boundary.top + boundary.bottom) / 2 * camPos.z;
    camPos.x += (cxto - camPos.x) / 4.0;
    camPos.y += (cyto - camPos.y) / 4.0;
    let z1 = (boundary.right - boundary.left) / 800;
    let z2 = (boundary.bottom - boundary.top) / 600;
    camPos.z += (Math.min(10,0.6/Math.max(z1,z2)) - camPos.z) / 4.0;

    let bbw = Math.max((boundary.right - boundary.left) * 3,100);
    if(Math.random()<Math.sqrt(bbw)/10*0.03){
      let center = (boundary.left + boundary.right) / 2;
      let width = bbw;
      let po = Math.random()*width - width/2 + center;
      let y = Math.min(boundary.top*4,-40);
      light.push({x:po+y*lightDir.x/lightDir.y,y:y});
    }
    let lspeed = 2;
    light.forEach(l=>{
      l.x += lightDir.x * lspeed;
      l.y += lightDir.y * lspeed;
    });
    for(let i=0;i<light.length;i++){
      let l = light[i];
      if(l.y > 0){
        light.splice(i,1);
        i--;
        addLightEffect(l.x,l.y);
      }else{
        let n = collide(l);
        if(n){
          light.splice(i,1);
          i--;
          addLightEffect(l.x,l.y);
          n.glow = 1.0;
          stock++;
        }
      }
    }
  };
  scene.draw = (R)=>{
    function traverse(node){
      if(!node)return;
      let h = node.length;
      if(node.leaf){
        if(node.glow){
          Shape.leaf(h*1.3).with(R.fill(Color.mix(moss,node.glow*0.5,Color.white)).shadow(10,lmoss).draw);
          if(node.glow>=0.1)node.glow -= 0.1;
        }else{
          Shape.leaf(h*1.3).with(R.fill(moss).shadow(10,lmoss).draw);
        }
        Shape.line(0,0,0,-h).with(R.stroke(2,green).shadow(1,green).draw);
        Shape.line(0,0,0,-h).with(R.stroke(1,lime).shadow(2,green).draw);
      }else if(node.stalk){
        Shape.line(0,0,0,-h).with(R.stroke(3,green).shadow(1,green).draw);
        Shape.line(0,0,0,-h).with(R.stroke(2,lime).shadow(2,green).draw);
        Shape.circle(h/2).translate(0,-h).with(R.fill(Color.yellow.alpha(0.2)).draw);
        Shape.circle(h/2).translate(0,-h).with(R.stroke(0.2,Color.yellow.alpha(0.7)).draw);
      }else if(node.grow){
        R.translated(0,-h,_=>{
          R.rotated(node.direction,_=>{
            R.rotated(-node.diff/2,_=>{
              traverse(node.left);
            });
            R.rotated(node.diff/2,_=>{
              traverse(node.right);
            });
          });
        });
        Shape.line(0,0,0,-h).with(R.stroke(3,green).shadow(1,green).draw);
        Shape.line(0,0,0,-h).with(R.stroke(2,lime).shadow(2,green).draw);
      }
    }
    Shape.rect(Po.size.x,Po.size.y).with(R.fill(Color.white).draw);
    R.translated((Po.size.x-800)/2,(Po.size.y-600)/2,_=>{
      R.clipped(0,0,800,600,_=>{
        Shape.rect(800,600).with(R.fill(Color.make(0.4,0.6,1)).draw);
        Shape.rect(800,600).translate(0,camPos.y).with(R.fill(brown).shadow(5,brown).draw);
        R.translated(camPos.x,camPos.y,_=>{
          R.scaled(camPos.z,camPos.z,_=>{
            traverse(root);
          });
        });
        Shape.rect(800,600).translate(0,camPos.y).with(R.fill(brown).draw);
        R.translated(camPos.x,camPos.y,_=>{
          R.scaled(camPos.z,camPos.z,_=>{
            light.forEach(l=>{
              let b = 10;
              Shape.line(l.x,l.y,l.x-b*lightDir.x,l.y-b*lightDir.y).with(R.stroke(0.3,Color.white).shadow(5,Color.yellow).draw);
              Shape.circle(0.5).translate(l.x,l.y).with(R.fill(Color.white).shadow(10,Color.yellow).draw);
            });
            if(stock>0){
              let w = 3;
              R.translated(-(stock-1)/2*w,5,_=>{
                for(let i=0;i<stock;i++){
                  Shape.circle(1).translate(i*w,0).with(R.fill(Color.white).shadow(10,Color.yellow).draw);
                }
              });
            }
          });
        });
        if(leafs.length==0 && stock==0)Shape.text("Game Over!").leftDown.scale(30,30).translate(10,600-10-38-70).with(R.fill(Color.white).shadow(8,Color.yellow).draw);
        if(began)Shape.text("Elapsed: " + Math.floor((new Date()-startDate)/1000) + "s").leftDown.scale(30,30).translate(10,600-10-38).with(R.fill(Color.white).shadow(8,Color.yellow).draw);
        let p = Math.floor(-boundary.top);
        let str;
        if(p<1000) str = p + "mm";
        else if(p<1000000) str = p/1000 + "m";
        else str = Math.floor(p/1000)/1000 + "km";
        Shape.text("Height: " + str).leftDown.scale(30,30).translate(10,600-10).with(R.fill(Color.white).shadow(8,Color.yellow).draw);
      });
      Shape.text("[Click]").down.scale(30,30).translate(400,-20).with(R.fill(Color.black).draw);
    });
  };
  return scene;
});
