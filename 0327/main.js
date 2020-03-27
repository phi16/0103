function hue(h,l,d) {
  const a = h*Math.PI*2;
  let r = Math.cos(a+0)*0.5+0.5;
  let g = Math.cos(a+Math.PI*2/3)*0.5+0.5;
  let b = Math.cos(a-Math.PI*2/3)*0.5+0.5;
  r = (1-(1-r)*l) * d;
  g = (1-(1-g)*l) * d;
  b = (1-(1-b)*l) * d;
  r = Math.round(r*255);
  g = Math.round(g*255);
  b = Math.round(b*255);
  return "rgb(" + r + "," + g + "," + b + ")";
}
const Renderer = (X,w,h)=>{
  X.textAlign = "center";
  X.textBaseline = "middle";
  X.lineCap = X.lineJoin = "round";
  const r = {};
  function shape(s) {
    return {
      fill: c=>{
        s();
        X.fillStyle = c;
        X.fill();
      },
      stroke: (c,b)=>{
        s();
        X.strokeStyle = c;
        X.lineWidth = b;
        X.stroke();
      }
    }
  }
  r.text = (t,x,y,s)=>{
    return {
      fill: c=>{
        X.fillStyle = c;
        X.font = s + "px Righteous";
        X.fillText(t,x,y);
      },
      stroke: (c,b)=>{
        X.strokeStyle = c;
        X.lineWidth = b;
        X.font = s + "px Righteous";
        X.strokeText(t,x,y);
      }
    }
  };
  r.shape = s=>shape(_=>{
    X.beginPath();
    s();
  });
  r.poly = (x,y,s,n,a)=>shape(_=>{
    X.beginPath();
    for(let i=0;i<=n;i++) {
      const dx = Math.cos((i/n+a)*Math.PI*2), dy = Math.sin((i/n+a)*Math.PI*2);
      if(i == 0) X.moveTo(x+dx*s, y+dy*s);
      else X.lineTo(x+dx*s,y+dy*s);
    }
  });
  r.circle = (x,y,r)=>shape(_=>{
    X.beginPath();
    X.arc(x,y,r,0,2*Math.PI,false);
  });
  r.rect = (x,y,w,h)=>shape(_=>{
    X.beginPath();
    X.rect(x,y,w,h);
  });
  r.line = (x0,y0,x1,y1)=>shape(_=>{
    X.beginPath();
    X.moveTo(x0,y0);
    X.lineTo(x1,y1);
  });
  r.translated = (x,y,cb)=>{
    X.save();
    X.translate(x,y);
    cb();
    X.restore();
  };
  r.rotated = (a,cb)=>{
    X.save();
    X.rotate(a);
    cb();
    X.restore();
  };
  r.scaled = (s,cb)=>{
    X.save();
    X.scale(s,s);
    cb();
    X.restore();
  };
  r.default = {
    X: X,
    w: w,
    h: h
  };
  return r;
};

let X, R;
let baseHue = 0.22;
function hh(u) {
  return baseHue + u*0.2;
}
function eb(x) {
  x = 1 - x;
  const b = 5;
  return 1 - x*x*((b+1)*x-b);
}
const Cell = (iniFace, border, borderDir)=>{
  const c = {};
  c.border = border;
  c.face = iniFace;
  let sc = 1;
  c.set = u=>{
    if(c.face != u) sc = 2;
    c.face = u;
  };
  c.attractor = false;
  let attrM = 0;
  c.attract = _=>{
    if(c.attractor) return;
    c.attractor = true;
    c.attrFace = 1 - c.face;
    c.attrDir = Math.random() < 0.5;
  };
  c.resolve = _=>{
    c.attractor = false;
  }
  c.render = _=>{
    sc += (1 - sc) / 4.0;
    if(!c.attractor) {
      attrM -= 0.05;
      if(attrM < 0) attrM = 0;
    } else {
      attrM += 0.05;
      if(attrM > 1) attrM = 1;
    }
    const s = 50 * sc;
    const h = hh(c.face);
    const bu = border ? c.attrFace == c.face ? 0.5 + attrM*0.5 : 0.5 : 1;
    R.rect(-s,-s,s*2,s*2).fill(hue(h,1,0.5*bu));
    R.rect(-s+1,-s+1,s*2-2,s*2-2).stroke(hue(h,1,0.8*bu),2);

    if(attrM > 0.01) {
      const s = 30 * eb(attrM);
      const h = hh(c.attrFace);
      let a = borderDir/4 + (c.attrDir ? 0.5 : 0);
      let dx = 0, dy = 0;
      if(c.attrDir) {
        dx -= Math.cos(a*Math.PI*2)*s*0.3;
        dy -= Math.sin(a*Math.PI*2)*s*0.3;
      };
      a += Math.pow(1-attrM, 3);
      R.poly(dx,dy,s,3,a).fill(hue(h,1,0.5));
      R.poly(dx,dy,s,3,a).stroke(hue(h,1,0.8),4);
    }
  };
  return c;
};

let endGame = false, endPop = false;
const cursor = { x: 8, y: 5, face: 0, fm: 0, xm: 8, ym: 5, sc: 2 };
cursor.input = (dx,dy) => {
  if(endGame) return;
  cursor.x += dx, cursor.y += dy;
  cursor.sc = 1.5;
  if(cursor.x < 1) cursor.x = 1;
  if(cursor.y < 1) cursor.y = 1;
  if(cursor.x > 15) cursor.x = 15;
  if(cursor.y > 8) cursor.y = 8;
  cursor.face = field[cursor.x][cursor.y].face;
};
const iniField = [];
for(let i=0;i<15;i++) {
  const u = [];
  for(let j=0;j<8;j++) {
    u.push(Math.random() < 0.5 ? 1 : 0);
  }
  iniField.push(u);
}
const field = [];
for(let i=0;i<17;i++) {
  const u = [];
  for(let j=0;j<10;j++) {
    const border = i == 0 || j == 0 || i == 16 || j == 9;
    const bd = i == 0 ? 0 : j == 0 ? 1 : i == 16 ? 2 : 3;
    const si = i == 0 ? 0 : i == 16 ? 14 : i-1;
    const sj = j == 0 ? 0 : j == 9 ? 7 : j-1;
    const iniFace = iniField[si][sj];
    u.push(Cell(iniFace, border, bd));
  }
  field.push(u);
}
cursor.face = cursor.fm = field[8][5].face;

function ob(x,y) {
  return x < 0 || y < 0 || x > 16 || y > 9;
}

const effects = [];
function addEffect(f, p) {
  const e = {};
  const center = { x: 0, y: 0 };
  p.forEach(u=>{
    center.x += u.x, center.y += u.y;
  });
  center.x /= p.length, center.y /= p.length;
  let t = 0;
  const sc = p.length + "";
  e.end = false;
  e.render = _=>{
    const h = hh(f);
    const sh = R.shape(_=>{
      const i = { x: p[0].x*0.6 + p[1].x*0.4, y: p[0].y*0.6 + p[1].y*0.4 };
      const e = Math.ceil((p.length-2) * Math.pow(1-t,2)) + 1;
      const o = { x: p[e].x*0.6 + p[e-1].x*0.4, y: p[e].y*0.6 + p[e-1].y*0.4 };
      X.moveTo(i.x*100,i.y*100);
      for(let i=1;i<e;i++) {
        X.lineTo(p[i].x*100,p[i].y*100);
      }
      X.lineTo(o.x*100,o.y*100);
    });
    const b = Math.pow(1-t,3);
    sh.stroke(hue(h,1,1),64*b);
    sh.stroke(hue(h,0.5,1),8*b);
    R.text(sc,center.x*100,center.y*100-t*20,200).fill(hue(0,0,Math.min(1,(1-t)*2)*0.8));
    t += 0.04;
    if(t > 1) e.end = true;
  };
  effects.push(e);
}
function addScoreEffect(f, m) {
  const e = {};
  let t = 0;
  const tx = "×" + m;
  e.end = false;
  e.render = _=>{
    const h = hh(f);
    R.text(tx,800,520-t*100,300).fill(hue(h,0.5,Math.min(1,(1-t)*2)*0.8));
    t += 0.01;
    if(t > 1) e.end = true;
  }
  effects.push(e);
}
function renderEffect() {
  X.globalCompositeOperation = "lighter";
  for(let i=0;i<effects.length;i++) {
    effects[i].render();
    if(effects[i].end) {
      effects.splice(i,1);
      i--;
    }
  }
  X.globalCompositeOperation = "source-over";
}

let angle = (Math.random() < 0.5 ? 1 : -1) * 0.1, angleBound = angle, effTime = 1000;
let score = 0;
const borders = [];
for(let i=0;i<15;i++) {
  borders.push( { x: i+1, y: 0 });
  borders.push( { x: i+1, y: 9 });
}
for(let i=0;i<8;i++) {
  borders.push( { x: 0, y: i+1 });
  borders.push( { x: 16, y: i+1 });
}
function pathResolve() {
  // detects all connection
  const uf = [];
  for(let i=0;i<17;i++) {
    for(let j=0;j<10;j++) {
      uf.push(i*10+j);
    }
  }
  function find(x) {
    if(uf[x] == x) return x;
    return uf[x] = find(uf[x]);
  }
  function unite(x,y) {
    const u = find(x);
    const v = find(y);
    uf[u] = v;
  }
  const dx = [-1,0,1,0];
  const dy = [0,1,0,-1];
  for(let i=1;i<16;i++) {
    for(let j=1;j<9;j++) {
      const c = field[i][j].face;
      for(let d=0;d<4;d++) {
        const x = i + dx[d], y = j + dy[d];
        if(ob(x,y)) continue;
        const cd = field[x][y].face;
        if(c == cd) unite(i*10+j, x*10+y);
      }
    }
  }
  for(let i=0;i<17;i++) {
    for(let j=0;j<10;j++) {
      find(i*10+j);
    }
  }
  const traversed = {};
  function shortestPath(i,o) {
    const face = field[i.x][i.y].face;
    const a = [];
    for(let i=0;i<17;i++) {
      const u = [];
      for(let j=0;j<10;j++) {
        u.push(10000);
      }
      a.push(u);
    }
    const checked = {};
    const q = [{ loc: i, path: [] }];
    let detectPath = [];
    while(q.length > 0) {
      const p = q.shift();
      const l = p.loc;
      if(l.x == o.x && l.y == o.y) {
        detectPath = p.path;
        break;
      }
      if(checked[l.x*10+l.y]) continue;
      checked[l.x*10+l.y] = true;
      const path = [].concat(p.path, l);
      const dx = [-1,0,1,0];
      const dy = [0,-1,0,1];
      for(let d=0;d<4;d++) {
        const x = l.x + dx[d], y = l.y + dy[d];
        if(ob(x,y)) continue;
        if(field[x][y].face != face) continue;
        if(x == 0 || y == 0 || x == 16 || y == 9) {
          if(x != o.x || y != o.y) continue;
          else if(l.x == i.x && l.y == i.y) continue;
        }
        q.push({ loc: {x:x, y:y}, path: path });
      }
    }
    detectPath.push(o);
    return detectPath;
  }
  function traverse(p) {
    const inDir = [];
    const outDir = [];
    borders.forEach(b=>{
      if(find(b.x*10+b.y) != p) return;
      const c = field[b.x][b.y];
      if(c.attractor && c.face == c.attrFace) {
        if(c.attrDir) inDir.push(b);
        else outDir.push(b);
      }
    });
    if(inDir.length == 0) return;
    if(outDir.length == 0) return;
    let addScore = 0;
    let face = field[Math.floor(p/10)][p%10].face;
    inDir.forEach(iu=>{
      outDir.forEach(ou=>{
        const p = shortestPath(iu, ou);
        addEffect(face, p);
        addScore += p.length;
      });
    });
    addScore *= inDir.length * outDir.length;
    if(inDir.length != 1 || outDir.length != 1) {
      addScoreEffect(face, inDir.length * outDir.length);
    }

    for(let i=0;i<inDir.length;i++) {
      field[inDir[i].x][inDir[i].y].resolve();
    }
    for(let i=0;i<outDir.length;i++) {
      field[outDir[i].x][outDir[i].y].resolve();
    }
    score += addScore;
    angleBound = - Math.sign(angle) * (Math.random() * 0.2 + 0.2);
    effTime = 0;
  }
  for(let i=0;i<17;i++) {
    for(let j=0;j<10;j++) {
      const p = find(i*10+j);
      if(traversed[p]) continue;
      traverse(p);
      traversed[p] = true;
    }
  }
}

let flip = false;
let direction = [false, false, false, false];
document.addEventListener("keydown",e=>{
  if(endGame) return;
  if(!flip) {
    if(e.key == "ArrowDown") cursor.input(0,1);
    if(e.key == "ArrowUp") cursor.input(0,-1);
    if(e.key == "ArrowRight") cursor.input(1,0);
    if(e.key == "ArrowLeft") cursor.input(-1,0);
    if(e.key == " ") {
      flip = true;
      flipTime = 0;
      cursor.face = field[cursor.x][cursor.y].face;
      field[cursor.x][cursor.y].set(1 - cursor.face);
      direction = [true, true, true, true];
    }
  }
});
document.addEventListener("keyup",e=>{
  if(endGame) return;
  if(e.key == " ") {
    flip = false;
    cursor.face = field[cursor.x][cursor.y].face;
    pathResolve();
  }
});
let flipTime = 0;
let curTime = new Date(), nextSpawn = 1;
function spawnChance() {
  if(endGame) return;
  const now = new Date();
  if((now-curTime)/1000 < nextSpawn) return;
  let i = Math.floor(Math.random() * borders.length);
  const b = borders[i];
  field[b.x][b.y].attract();
  curTime = now, nextSpawn = Math.random() * 1 + 1;
}
spawnChance();

const startTime = new Date();
Q.renderCallback.push((aX,aw,ah)=>{
  X = aX;
  R = Renderer(aX,aw,ah);
  R.rect(0,0,aw,ah).fill(hue(0,0,0));

  X.save();
  let w, h;
  const aspectRatio = 1.6/1.1;
  if(aw < aspectRatio * ah) w = aw, h = w / aspectRatio;
  else w = ah * aspectRatio, h = ah;
  X.translate(aw/2,ah/2);
  X.translate(-aw/2,-ah/2);
  X.translate(aw/2-w/2,ah/2-h/2);
  X.scale(w/1600, h/1100);
  X.translate(0,100);

  X.globalCompositeOperation = "lighter";
  for(let i=0;i<17;i++) {
    for(let j=0;j<10;j++) {
      R.translated(i*100, j*100, _=>{
        field[i][j].render();
      });
    }
  }
  effTime += 0.1;
  angle += (angleBound - angle) / 8.0;
  R.translated(800,450,_=>{
    R.rotated(angle,_=>{
      R.scaled(Math.exp(-effTime)*0.1+1,_=>{
        R.text(score,0,50,600).fill(hue(0,0,Math.exp(-effTime)*0.1+0.1));
      });
    });
  });
  X.globalCompositeOperation = "overlay";
  const reTime = (new Date() - startTime) / 1000;
  // -330 ~ 900
  R.translated(0,reTime / 120 * 1230 - 330,_=>{
    R.rotated(0.2,_=>{
      R.rect(-1000+800,0,2000,2000).fill(hue(0,0,0.7));
    });
  });

  X.globalCompositeOperation = "source-over";
  R.rect(-500,-200,2600,200).fill(hue(0,0,0));
  R.rect(-500,900,2600,200).fill(hue(0,0,0));
  R.rect(-200,-500,200,1900).fill(hue(0,0,0));
  R.rect(1600,-500,200,1900).fill(hue(0,0,0));
  R.text("HowToPlay: Arrows / Space",800,-40,50).fill(hue(0,0,0.5));
  const rem = Math.floor(120 - reTime + 1);
  if(rem < -1) {
    R.text("! Finish !",800,940,50).fill(hue(0,0,0.5));
    if(!endGame) {
      for(let i=0;i<17;i++) {
        for(let j=0;j<10;j++) {
          field[i][j].resolve();
        }
      }
      endGame = true;
    }
  } else {
    R.text("Remaining: " + rem + "s",800,940,50).fill(hue(0,0,0.5));
  }
  if(rem == -4 && !endPop) {
    window.open("https://twitter.com/intent/tweet?text="+encodeURI("[Jam0327] Score: " + score + " phi16.github.io/Jam/0327")+"&hashtags=traP3jam","_blank");
    endPop = true;
  }
  function cursorRender() {
    const du = 7 * cursor.sc;
    const h = hh(cursor.fm);
    let s = 50 + du;
    R.rect(-s,-s,s*2,s*2).stroke(hue(h,0.8,1), 4);
    s = 50 - du;
    R.rect(-s,-s,s*2,s*2).stroke(hue(h,0.8,1), 4);
  }
  R.translated(cursor.xm*100,cursor.ym*100,_=>{
    cursorRender();
  });
  cursor.xm += (cursor.x - cursor.xm) / 2.0;
  cursor.ym += (cursor.y - cursor.ym) / 2.0;
  cursor.sc += (1 - cursor.sc) / 4.0;
  cursor.fm += (cursor.face - cursor.fm) / 4.0;

  renderEffect();

  if(flip) {
    const pl = Math.min(16, Math.floor(flipTime));
    flipTime += 0.2;
    const l = Math.min(16, Math.floor(flipTime));
    const x = cursor.x;
    const y = cursor.y;
    const dx = [-1,0,1,0];
    const dy = [0,1,0,-1];
    if(pl != l) {
      for(let d=0;d<4;d++) {
        if(!direction[d]) continue;
        const px = x+dx[d]*l, py = y+dy[d]*l;
        if(ob(px,py)) continue;
        const c = field[px][py];
        if(c.face == cursor.face) {
          c.set(1 - cursor.face);
        } else {
          direction[d] = false;
        }
      }
    }
  } else flipTime = 0;

  X.restore();
  spawnChance();
});
