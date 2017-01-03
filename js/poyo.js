var Color = (()=>{
  var c = {};
  c.make = (r,g,b,a)=>{
    var ai = a == null ? 1.0 : a;
    var u = {r:r,g:g,b:b,a:ai};
    u.style = ()=>{
      var ri = Math.floor(u.r*255);
      var gi = Math.floor(u.g*255);
      var bi = Math.floor(u.b*255);
      var ai = u.a;
      return "rgba(" + ri + "," + gi + "," + bi + "," + ai + ")";
    };
    u.alpha = (v)=>{
      return c.make(u.r,u.g,u.b,v);
    }
    return u;
  };
  c.apply = (u,a,b)=>{
    return c.make(u.r*a+b,u.g*a+b,u.b*a+b,u.a);
  };
  c.format = (e)=>{
    var d = parseInt(e,16);
    var r = d >> 16;
    var g = d >> 8 & 0xff;
    var b = d & 0xff;
    return c.make(r/255,g/255,b/255);
  };
  c.mix = (x,i,y)=>{
    var r = x.r*(1-i)+y.r*i;
    var g = x.g*(1-i)+y.g*i;
    var b = x.b*(1-i)+y.b*i;
    var a = x.a*(1-i)+y.a*i;
    return c.make(r,g,b,a);
  };
  c.clone = (x)=>{
    return c.make(x.r,x.g,x.b,x.a);
  }
  c.red = c.format("ff0000");
  c.green = c.format("00ff00");
  c.blue = c.format("0000ff");
  c.cyan = c.format("00ffff");
  c.magenta = c.format("ff00ff");
  c.yellow = c.format("ffff00");
  c.white = c.format("ffffff");
  c.grey = c.format("7f7f7f");
  c.black = c.format("000000");
  c.orange = c.format("ff7f00");
  c.purple = c.format("7f00ff");
  c.brown = c.format("7f3f00");
  return c;
})();

var Load = (url,cb)=>{
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      cb(this.responseText);
    }
  };
  xhr.open('GET',url);
  xhr.send();
};

var Picture = (()=>{
  var p = {};
  var images = {};
  var pending = 0;
  p.load = (tag,img)=>{
    var i = new Image();
    i.src = img;
    pending++;
    i.onload = ()=>{
      pending--;
      console.log("P.complete : " + tag + "(" + pending + ")");
    };
    images[tag] = i;
  };
  p.done = ()=>{
    return pending==0;
  };
  p.get = (tag)=>{
    return images[tag];
  };
  return p;
})();

var Music = (function(){
  var m = {};
  var buffers = {};
  var pending = 0;
  var musicGain = 1;
  var soundGain = 1;
  var BASE = 0.25;
  m.load = function(tag,str){
    var a = new Audio();
    a.src = str;
    pending++;
    a.onloadeddata = function(){
      pending--;
      console.log("M.complete : " + tag + "(" + pending + ")");
    };
    buffers[tag] = a;
  };
  m.done = function(){
    return pending==0;
  };
  m.gain = function(tag,lev){
    if(!buffers[tag])return;
    buffers[tag].volume = lev * BASE;
  };
  m.seek = function(tag,seek){
    if(!buffers[tag])return;
    var seekable = buffers[tag].seekable;
    if(seekable.start(0) <= seek && seek <= seekable.end(0)){
      buffers[tag].currentTime = seek;
      return true;
    }
    return false;
  };
  m.play = function(tag){
    if(!buffers[tag])return;
    buffers[tag].loop = false;
    buffers[tag].volume = musicGain * BASE;
    buffers[tag].play();
  };
  m.loop = function(tag){
    if(!buffers[tag])return;
    buffers[tag].loop = true;
    buffers[tag].volume = musicGain * BASE;
    buffers[tag].play();
  };
  m.loopFromPoint = function(tag,point){
    if(!buffers[tag])return;
    buffers[tag].ontimeupdate = function(){
      var rTime = buffers[tag].duration - buffers[tag].currentTime;
      if(rTime < 1) m.seek(tag, point - rTime);
    };
    m.play(tag);
  };
  m.once = function(tag){
    if(!buffers[tag])return;
    var a = buffers[tag].cloneNode();
    a.onended = function(){
      delete a;
    };
    a.loop = false;
    a.volume = soundGain * BASE;
    a.play();
  };
  m.stop = function(tag){
    if(!buffers[tag])return;
    buffers[tag].ontimeupdate = function(){};
    buffers[tag].pause();
    buffers[tag].currentTime = 0;
  };
  m.setMusicGain = function(d){
    musicGain = d;
  };
  m.setSoundGain = function(d){
    soundGain = d;
  };
  m.fadeout = function(tag,d){
    if(!buffers[tag])return;
    var dvdt = - buffers[tag].volume / d;
    var cVol = buffers[tag].volume;
    var timer = setInterval(function(){
      if((cVol += dvdt) <= 0){
        clearInterval(timer);
        m.stop(tag);
      }else{
        buffers[tag].volume = cVol;
      }
    }, 1);
  };
  m.amp = function(m,f){
    var mu = musicGain;
    var sn = soundGain;
    musicGain *= m;
    soundGain *= m;
    f();
    musicGain = mu, soundGain = sn;
  }
  return m;
})();

var Shape = (()=>{
  var s = {};
  s.make = (d,c)=>{
    var p = {};
    var aff = [1,0,0,0,1,0];
    var aff2 = [1,0,0,0,1,0];
    function product(a2){
      aff = [
        aff[0]*a2[0]+aff[3]*a2[1],
        aff[1]*a2[0]+aff[4]*a2[1],
        aff[2]*a2[0]+aff[5]*a2[1]+a2[2],
        aff[0]*a2[3]+aff[3]*a2[4],
        aff[1]*a2[3]+aff[4]*a2[4],
        aff[2]*a2[3]+aff[5]*a2[4]+a2[5]
      ];
    }
    p.with = (h)=>{
      if(Array.isArray(h)){
        h.forEach((e)=>{
          e(p);
        });
      }else{
        return h(p);
      }
    };
    p.translate = (x,y)=>{
      product([1,0,x,0,1,y]);
      return p;
    };
    p.rotate = (a)=>{
      var cs = Math.cos(a), si = Math.sin(a);
      product([cs,-si,0,si,cs,0]);
      return p;
    };
    p.scale = (x,y)=>{
      product([x,0,0,0,y,0]);
      return p;
    };
    p.onDraw = (ctx,p1)=>{
      ctx.transform(aff[0],aff[3],aff[1],aff[4],aff[2],aff[5]);
      p1();
      ctx.transform(aff2[0],aff2[3],aff2[1],aff2[4],aff2[2],aff2[5]);
      d(ctx);
    };
    p.onCollide = (x,y,sc,fc)=>{
      var ix = -aff[1]*aff[5]+aff[1]*y+aff[2]*aff[4]-aff[4]*x;
      var iy = aff[0]*aff[5]-aff[0]*y-aff[2]*aff[3]+aff[3]*x;
      var z = aff[1]*aff[3]-aff[0]*aff[4];
      x = ix/z, y = iy/z;
      ix = -aff2[1]*aff2[5]+aff2[1]*y+aff2[2]*aff2[4]-aff2[4]*x;
      iy = aff2[0]*aff2[5]-aff2[0]*y-aff2[2]*aff2[3]+aff2[3]*x;
      z = aff2[1]*aff2[3]-aff2[0]*aff2[4];
      x = ix/z, y = iy/z;
      var b = c(x,y);
      if(b && typeof sc == "function")sc(ix/z,iy/z);
      if(!b && typeof fc == "function")fc(ix/z,iy/z);
      return b;
    };
    p.affined = (f)=>{
      var a = aff;
      aff = [1,0,0,0,1,0];
      f(a);
      aff = a;
    };
    p.postProd = (a2)=>{
      aff2 = [
        aff2[0]*a2[0]+aff2[3]*a2[1],
        aff2[1]*a2[0]+aff2[4]*a2[1],
        aff2[2]*a2[0]+aff2[5]*a2[1]+a2[2],
        aff2[0]*a2[3]+aff2[3]*a2[4],
        aff2[1]*a2[3]+aff2[4]*a2[4],
        aff2[2]*a2[3]+aff2[5]*a2[4]+a2[5]
      ];
      return p;
    }
    p.invert = ()=>{
      return s.make((ctx)=>{
        d(ctx);
        ctx.moveTo(-1000,-1000);
        ctx.lineTo(1000,-1000);
        ctx.lineTo(1000,1000);
        ctx.lineTo(-1000,1000);
        ctx.lineTo(-1000,-1000);
      },(x,y)=>{
        return c(x,y)?false:true;
      });
    }
    return p;
  };
  s.rect = (w,h)=>s.make((ctx)=>{
    ctx.rect(0,0,w,h);
  },(x,y)=>{
    return 0 <= x && x <= w && 0 <= y && y <= h;
  });
  s.circle = (r)=>s.make((ctx)=>{
    ctx.arc(0,0,r,0,Math.PI*2,1);
  },(x,y)=>{
    return x*x + y*y <= r*r;
  });
  s.polygon = (a)=>{
    if(a.length<2)return s.make((ctx)=>{},()=>false);
    return s.make((ctx)=>{
      ctx.moveTo(a[0],a[1]);
      for(var i=0;i<a.length;i+=2){
        ctx.lineTo(a[i],a[i+1]);
      }
    },(x,y)=>{
      var b = false;
      var x1 = 0;
      var y1 = 0;
      var x2 = a[0]-x;
      var y2 = a[1]-y;
      for(var i=0;i<a.length-2;i+=2){
        x1 = x2;
        y1 = y2;
        x2 = a[i+2]-x;
        y2 = a[i+3]-y;
        var r = -y2/y1;
        var rx;
        if(Math.abs(y1) < 0.0001){
          rx = x1;
        }else if(Math.abs(y2) < 0.0001){
          rx = x2;
        }else if(0 <= r){
          rx = (x1*r + x2*1)/(r+1);
        }
        if(rx >= 0)b = !b;
      }
      return b;
    });
  };
  s.roundrect = (w,h,r)=>s.make((ctx)=>{
    ctx.moveTo(0,r);
    ctx.arc(r,h-r,r,Math.PI,Math.PI/2,1);
    ctx.arc(w-r,h-r,r,Math.PI/2,0,1);
    ctx.arc(w-r,r,r,0,Math.PI*3/2,1);
    ctx.arc(r,r,r,Math.PI*3/2,Math.PI,1);
  },(x,y)=>{
    x = Math.abs(x-w/2), y = Math.abs(y-h/2);
    x -= w/2-r;
    y -= h/2-r;
    if(x<0)x=0;
    if(y<0)y=0;
    return x*x+y*y < r*r;
  });
  s.line = (x1,y1,x2,y2)=>s.make((ctx)=>{
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
  },(x,y)=>false);
  s.image = (name)=>{
    var img = Picture.get(name);
    if(!img)return;
    return s.make((ctx)=>{
      ctx.drawImage(img,0,0,img.width,img.height);
    },(x,y)=>{
      return 0 <= x && x <= img.width && 0 <= y && y <= img.height;
    });
  };

  var font;
  opentype.load('/res/KTEGAKI.ttf',(err,f)=>{
    if(err)console.log(err);
    else font = f;
  });
  s.text = (text)=>{
    var f = (x,y)=>{
      var u = s.make(()=>{},()=>{});
      u.size = {x:0,y:0};
      return u;
    };
    if(font){
      var p = font.getPath(text,0,0,1);
      var ix=0,iy=0,ax=0,ay=0,vx,vy;
      for(var i=0;i<p.commands.length;i++){
        if(p.commands[i].x){
          if(p.commands[i].x < ix)ix = p.commands[i].x;
          if(p.commands[i].y < iy)iy = p.commands[i].y;
          if(p.commands[i].x > ax)ax = p.commands[i].x;
          if(p.commands[i].y > ay)ay = p.commands[i].y;
        }
      }
      vx = (ix+ax)/2;
      vy = (iy+ay)/2;
      f = (x,y)=>s.make((ctx)=>{
        for (var i = 0; i < p.commands.length; i += 1) {
          var cmd = p.commands[i];
          if (cmd.type === 'M') {
            ctx.moveTo(cmd.x-x, cmd.y-y);
          } else if (cmd.type === 'L') {
            ctx.lineTo(cmd.x-x, cmd.y-y);
          } else if (cmd.type === 'C') {
            ctx.bezierCurveTo(cmd.x1-x, cmd.y1-y, cmd.x2-x, cmd.y2-y, cmd.x-x, cmd.y-y);
          } else if (cmd.type === 'Q') {
            ctx.quadraticCurveTo(cmd.x1-x, cmd.y1-y, cmd.x-x, cmd.y-y);
          } else if (cmd.type === 'Z') {
            ctx.closePath();
          }
        }
      },(x,y)=>false);
    }
    return {
      center : f(vx,vy),
      left : f(ix,vy),
      right : f(ax,vy),
      up : f(vx,iy),
      down : f(vx,ay),
      leftUp : f(ix,iy),
      rightUp : f(ax,iy),
      leftDown : f(ix,ay),
      rightDown : f(ax,ay),
      size : {x:ax-ix,y:ay-iy}
    };
  };

  s.translate = (x,y)=>(v)=>{
    return v.postProd([1,0,x,0,1,y]);
  };
  s.rotate = (a)=>(v)=>{
    var cs = Math.cos(a), si = Math.sin(a);
    product([cs,-si,0,si,cs,0]);
    return v.postProd([cs,-si,0,si,cs,0]);
  };
  s.scale = (x,y)=>(v)=>{
    return v.postProd([x,0,0,0,y,0]);
  };
  return s;
})();

var Util = (()=>{
  var u = {};
  u.clone = function(x){
    if(x==null || typeof x !== "object")return x;
    if(x instanceof Array){
      var c = [];
      x.forEach((v)=>{
        c.push(u.clone(v));
      });
      return c;
    }
    if(x instanceof Object){
      var c = {};
      for(var i in x){
        if(x.hasOwnProperty(i)){
          c[i] = u.clone(x[i]);
        }
      }
      return c;
    }
    throw new Error("Failed to clone : " + JSON.stringify(x));
  };
  u.intersect = (x1,y1,w1,h1)=>(x2,y2,w2,h2)=>{
    var xi = Math.max(x1,x2);
    var xa = Math.min(x1+w1, x2+w2);
    var yi = Math.max(y1,y2);
    var ya = Math.min(y1+h1, y2+h2);
    if(xi>xa || yi>ya)return null;
    return {x:xi,y:yi,w:xa-xi,h:ya-yi};
  };
  return u;
})();

var Poyo = (function(){
  var Render = (ctx)=>{
    ctx.lineCap = ctx.lineJoin = "round";
    var colorA = 1, colorB = 0;
    var kon = (p1,p2)=>{
      var k = {};
      k.draw = (shape)=>{
        ctx.save();
        ctx.beginPath();
        shape.onDraw(ctx,p1);
        p2();
        ctx.restore();
      };
      k.fill = (c)=>{
        return kon(p1,()=>{
          p2();
          ctx.fillStyle = Color.apply(c,colorA,colorB).style();
          ctx.fill("evenodd");
        });
      };
      k.stroke = (b,c)=>{
        return kon(p1,()=>{
          p2();
          ctx.strokeStyle = Color.apply(c,colorA,colorB).style();
          ctx.lineWidth = b;
          ctx.stroke();
        });
      };
      k.shadow = (h)=>{
        return kon(()=>{
          p1();
          ctx.shadowColor = Color.black.alpha(0.5).style();
          ctx.shadowBlur = h;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = h/2;
        },p2);
      };
      k.translate = (x,y)=>{
        return kon(()=>{
          p1();
          ctx.translate(x,y);
        },p2);
      };
      k.rotate = (a)=>{
        return kon(()=>{
          p1();
          ctx.rotate(a);
        },p2);
      };
      k.scale = (x,y)=>{
        return kon(()=>{
          p1();
          ctx.scale(x,y);
        },p2);
      };
      return k;
    };
    var r = kon(()=>{},()=>{});
    r.translated = (x,y,f)=>{
      ctx.save();
      ctx.translate(x,y);
      f();
      ctx.restore();
    };
    r.rotated = (a,f)=>{
      ctx.save();
      ctx.rotate(a);
      f();
      ctx.restore();
    };
    r.scaled = (x,y,f)=>{
      ctx.save();
      ctx.scale(x,y);
      f();
      ctx.restore();
    };
    r.transformed = (s,f)=>{
      ctx.save();
      s.affined((a)=>{
        ctx.transform(a[0],a[3],a[1],a[4],a[2],a[5]);
        f();
      });
      ctx.restore();
    }
    r.clipped = (x,y,w,h,f)=>{
      ctx.save();
      ctx.beginPath();
      ctx.rect(x,y,w,h);
      ctx.clip();
      f();
      ctx.restore();
    };
    r.lightened = (d,f)=>{
      var ca = colorA, cb = colorB;
      var da = 1-d, db = d;
      colorA = ca*da, colorB = cb*da + db;
      f();
      colorA = ca, colorB = cb;
    };
    r.darkened = (d,f)=>{
      var ca = colorA, cb = colorB;
      var da = 1-d, db = 0;
      colorA = ca*da, colorB = cb*da + db;
      f();
      colorA = ca, colorB = cb;
    };
    return r;
  };
  var Ease = (P)=>(fst)=>{
    function lerp(v1,a,v2){
      if(v1 instanceof Array){
        var v = [];
        for(var i=0;i<v1.length;i++){
          v.push(lerp(v1[i],a,v2[i]));
        }
        return v;
      }else if(v1 instanceof Object){
        var v = {};
        Object.keys(v1).forEach((k)=>{
          v[k] = lerp(v1[k],a,v2[k]);
        });
        return v;
      }else{
        return v1*(1-a) + v2*a;
      }
    }
    var e = {};
    var kon = (f)=>(dur)=>{
      var v1 = fst;
      var v2 = fst;
      var a = 0;
      var t = 0;
      var cache = null;
      var i = 0;
      var o = ()=>{
        if(cache)return cache;
        return cache = lerp(v1,a,v2);
      };
      o.done = t >= dur;
      o.set = (v)=>{
        v1 = lerp(v1,a,v2);
        v2 = v;
        a = 0;
        t = 0;
        cache = null;
        o.done = t >= dur;
        P(()=>{
          t++;
          if(t>dur)t=dur;
          else cache = null;
          a = f(t/dur);
          return o.done = t >= dur;
        });
        return o;
      };
      o.force = (v)=>{
        a = 1;
        v1 = v2 = v;
        t = dur;
        o.done = true;
        cache = v;
      };
      return o;
    };
    var def = (f)=>{
      return {
        in : kon(f),
        out : kon((x)=>1-f(1-x)),
        inOut : kon((x)=>{
          if(x<0.5){
            return f(x*2)/2;
          }else{
            return 1-f(2-2*x)/2;
          }
        })
      };
    };
    e.linear = def((x)=>x);
    e.smooth = def((x)=>x*x*(3-x)/2);
    e.quad = def((x)=>x*x);
    e.cubic = def((x)=>x*x*x);
    e.quart = def((x)=>x*x*x*x);
    e.quint = def((x)=>x*x*x*x*x);
    e.sine = def((x)=>1-Math.cos(x*Math.PI/2));
    e.circ = def((x)=>1-Math.sqrt(Math.max(0,1-x*x)));
    e.exp = def((x)=>Math.pow(2,-(1-x)*10));
    e.back = def((x)=>x*x*(2.70158*x-1.70158));
    e.softBack = def((x)=>x*x*(2*x-1));

    e.inf = (speed)=>{
      var v = fst;
      var o = ()=>{
        return v;
      };
      o.to = (v2)=>{
        v = lerp(v,speed,v2);
      };
      return o;
    };
    return e;
  };
  var Dialog = (Po,button)=>(msg,a,f)=>{
    if(!(msg instanceof Array))msg = [msg];
    if(!(a instanceof Array))a = [a];
    var d = {done:false};
    var closing = false;
    var al = Po.ease(0).back.out(20).set(1);
    // width : |-space-|text|-space|
    // height : |-bar-|-space-|texts|-space-|buttons|-space-|
    var spaceW = 40;
    var spaceH = 10;
    var padX = 0;
    var padY = 0;
    var fontSize = 30;
    var maxW = 0;
    var maxH = 0;
    msg.forEach((m)=>{
      maxW = Math.max(maxW,Shape.text(m).size.x*fontSize+spaceW*2);
    });
    var texH = msg.length*fontSize;
    var butH = 40;
    var w = 100, h = 150;
    var btns = [];
    var maxL = 0;
    var ix = spaceW;
    a.forEach((at)=>{
      maxL = Math.max(maxL,Shape.text(at).size.x*fontSize+20);
    })
    var index = 0;
    a.forEach((at)=>{
      btns.push({
        shape : ((i)=>{
          return Shape.rect(maxL,butH).translate(ix,spaceH+texH+spaceH).with(button(()=>{
            f(i,()=>{
              al.set(0);
              closing = true;
            });
          }));
        })(index),
        text : Shape.text(at).center.scale(fontSize,fontSize),
        size : {x:maxL,y:butH}
      });
      ix += maxL+spaceW;
      index++;
    });
    maxW = Math.max(maxW,ix);
    maxH = 40+spaceH+texH+spaceH+butH;
    if(w<maxW)w = maxW;
    else padX = (w-maxW)/2;
    if(h<maxH)h = maxH;
    else padY = (h-maxH)/2;
    var frame = Shape.rect(w,h).with(Shape.translate(-w/2,-h/2));
    var exit = Shape.rect(40,20).translate(w/2-40,-h/2).with(button(()=>{
      f(-1,()=>{
        al.set(0);
        closing = true;
      });
    }));

    d.step = ()=>{
      if(closing && al.done)d.done = true;
    };
    d.draw = (R)=>{
      Shape.rect(Po.size.x,Po.size.y).with(R.fill(Color.black.alpha(al()*0.5)).draw);
      R.translated(Po.size.x/2,Po.size.y/2,()=>{
        if(al()>0)R.scaled(al(),al(),()=>{
          frame.with([
            R.fill(Color.white).shadow(20).draw,
            R.stroke(2,Color.black).draw
          ]);
          R.lightened(exit.hover/3.0,()=>{
            exit.with(R.fill(Color.red).draw);
            R.transformed(exit,()=>{
              Shape.line(15,5,25,15).with(R.stroke(2,Color.white).draw);
              Shape.line(25,5,15,15).with(R.stroke(2,Color.white).draw);
            });
          });
          exit.with(R.stroke(2,Color.black).shadow(2).draw);
          Shape.line(-w/2,-h/2+20,w/2-40,-h/2+20).with(R.stroke(2,Color.black).shadow(2).draw);
          R.translated(padX-w/2,padY-h/2+20,()=>{
            for(var i=0;i<msg.length;i++){
              R.translated(maxW/2,spaceH+i*fontSize,()=>{
                Shape.text(msg[i]).up.scale(fontSize,fontSize).with(R.fill(Color.black).draw);
              });
            }
            btns.forEach((b)=>{
              b.shape.with([
                R.fill(Color.white).shadow(5).draw,
                R.stroke(2,Color.black).draw,
              ]);
              R.lightened(b.hover/4.0,()=>{
                R.transformed(b.shape,()=>{
                  R.translated(b.size.x/2,b.size.y/2,()=>{
                    b.text.with(R.fill(Color.black).draw);
                  });
                });
              });
            });
          });
        });
      });
    };
    d.handle = (n,mx,my)=>{
      var dx = Po.size.x/2, dy = Po.size.y/2;
      exit.onCollide(mx-dx,my-dy,(p,q)=>{
        document.body.style.cursor = "pointer";
        if(exit.hover!=2)exit.hover = 1;
        if(n=="MouseDown"){
          exit.handles(p,q);
          exit.hover = 2;
          document.body.style.cursor = "auto";
        }else if(n=="MouseUp"){
          exit.hover = 1;
        }
      },(p,q)=>{
        exit.hover = 0;
      });
      dx += padX-w/2, dy += padY-h/2+20;
      btns.forEach((b)=>{
        b.shape.onCollide(mx-dx,my-dy,(p,q)=>{
          document.body.style.cursor = "pointer";
          if(b.hover!=2)b.hover = 1;
          if(n=="MouseDown"){
            b.shape.handles(p,q);
            b.hover = 2;
            document.body.style.cursor = "auto";
          }else if(n=="MouseUp"){
            b.hover = 1;
          }
        },(p,q)=>{
          b.hover = 0;
        });
      });
    };
    return d;
  };
  var Po = (map,iniN)=>{
    var p = {};
    var cur,old = null;
    var buttonHandler = [];
    var dragHandler = [];
    var stepper = [];
    var changeCursor = (n)=>{
      if(!dialog)document.body.style.cursor = n;
    };
    var transTime = 0;
    var dialog = null;
    var o = {
      button : (h)=>(shape)=>{
        shape.hover = 0;
        shape.enabled = true;
        shape.step = ()=>{
        };
        shape.handle = (n,x,y)=>{
          if(!shape.enabled){
            shape.hover = 0;
            return false;
          }
          var b = false;
          shape.onCollide(x,y,(p,q)=>{
            shape.hover = 1;
            changeCursor("pointer");
            if(n=="MouseDown"){
              h(p,q);
              changeCursor("auto");
              b = true;
            }
          },(p,q)=>{
            shape.hover = 0;
          });
          return b;
        };
        shape.enable = ()=>{
          shape.enabled = true;
        };
        shape.disable = ()=>{
          shape.enabled = false;
        };
        buttonHandler.push(shape);
        return shape;
      },
      drag : (rx,ry,rw,rh)=>(shape)=>{
        var hover = false;
        var drag = false;
        shape.light = 0;
        var px = 0;
        var py = 0;
        shape.step = ()=>{
          if(drag)shape.light += (2-shape.light)/2.0;
          else if(hover)shape.light += (1-shape.light)/2.0;
          else shape.light += (0-shape.light)/2.0;
        };
        shape.handle = (n,x,y)=>{
          function dragTo(p,q){
            changeCursor("pointer");
            if(n=="MouseUp"){
              drag = false;
            }else{
              shape.translate(p-px,q-py);
              var ox,oy;
              shape.affined((a)=>{
                ox = a[2], oy = a[5];
              });
              if(ox<rx)shape.translate(rx-ox,0);
              if(oy<ry)shape.translate(0,ry-oy);
              if(ox>rx+rw)shape.translate(rx+rw-ox,0);
              if(oy>ry+rh)shape.translate(0,ry+rh-oy);
            }
          }
          hover = true;
          var b = false;
          shape.onCollide(x,y,(p,q)=>{
            if(!drag){
              hover = true;
              changeCursor("pointer");
              if(n=="MouseDown"){
                drag = true;
                px = p, py = q;
                dragTo(p,q);
                b = true;
              }
            }else{
              dragTo(p,q);
            }
          },(p,q)=>{
            if(!drag){
              hover = false;
            }else{
              dragTo(p,q);
            }
          });
          return b;
        };
        dragHandler.push(shape);
        return shape;
      },
      dialog : (msg,a,f)=>{
        dialog = Dialog(o,(act)=>(shape)=>{
          shape.handles = act;
          shape.hover = 0;
          return shape;
        })(msg,a,f);
      },
      transit : (n,arg)=>{
        buttonHandler = [];
        dragHandler = [];
        transTime = 0;
        old = cur;
        cur = map[n](o,arg);
      },
      ease : Ease((step)=>{
        stepper.push(step);
      }),
      size : {x:0,y:0},
      mouse : {x:0,y:0},
      time : 0
    };
    p.size = (w,h)=>{
      o.size.x = w;
      o.size.y = h;
    };
    p.step = ()=>{
      if(old!=null){
      if(old.end || cur.spawn){
          var b = false;
          if(old.end){
            old.end(transTime,()=>{
              b = true;
            });
          }else{
            old.step();
          }
          if(cur.spawn){
            cur.spawn(transTime,()=>{
              b = true;
            });
          }else{
            cur.step();
          }
          if(b)old = null;
          transTime++;
        }else{
          old = null;
        }
      }else{
        cur.step();
        buttonHandler.forEach((h)=>{
          if(typeof h.step === "function")h.step();
        });
        dragHandler.forEach((h)=>{
          if(typeof h.step === "function")h.step();
        });
      }
      for(var i=0;i<stepper.length;i++){
        if(stepper[i]()){
          stepper.splice(i,1);
        }
      }
      if(dialog){
        dialog.step();
        if(dialog.done)dialog = null;
      }
      o.time++;
    };
    p.draw = (R)=>{
      if(old!=null){
        var u = false;
        old.draw(R,()=>{
          u = true;
          cur.draw(R,()=>{});
        });
        if(u==false){
          cur.draw(R,()=>{});
        }
      }else{
        cur.draw(R,()=>{});
      }
      if(dialog)dialog.draw(R);
    };
    p.event = (n,e)=>{
      if(dialog && !dialog.done){
        dialog.handle(n,e.clientX,e.clientY);
      }else{
        o.mouse.x = e.clientX;
        o.mouse.y = e.clientY;
        for(var i=dragHandler.length-1;i>-1;i--){
          var h = dragHandler[i];
          if(typeof h.handle === "function"){
            if(h.handle(n,o.mouse.x,o.mouse.y)){
              dragHandler.splice(i,1);
              dragHandler.push(h);
              return;
            }
          }
        }
        for(var i=buttonHandler.length-1;i>-1;i--){
          var h = buttonHandler[i];
          if(typeof h.handle === "function"){
            if(h.handle(n,o.mouse.x,o.mouse.y)){
              return;
            }
          }
        }
      }
    };
    cur = map[iniN](o);
    return p;
  };

  var p = {};
  var pos = {};
  p.scene = (n,h)=>{
    return {name:n,handler:h};
  };
  p.start = (c,a)=>{
    var map = {};
    a.forEach((v)=>{
      map[v.name] = v.handler;
    });
    var po = Po(map,a[0].name);
    var cvs = document.getElementById(c);
    var ctx = cvs.getContext('2d');
    var render = Render(ctx);
    var i = setInterval(()=>{
      ctx.clearRect(0,0,cvs.width,cvs.height);
      po.size(cvs.width,cvs.height);
      po.step();
      po.draw(render);
    },16);
    po.kill = ()=>{
      clearInterval(i);
      delete pos[i];
    };
    pos[i] = po;
    return po;
  };
  window.onmousedown = (e)=>{
    document.body.style.cursor = "auto";
    Object.keys(pos).forEach((c)=>{
      pos[c].event("MouseDown",e);
    });
  };
  window.onmousemove = (e)=>{
    document.body.style.cursor = "auto";
    Object.keys(pos).forEach((c)=>{
      pos[c].event("MouseMove",e);
    });
  };
  window.onmouseup = (e)=>{
    document.body.style.cursor = "auto";
    Object.keys(pos).forEach((c)=>{
      pos[c].event("MouseUp",e);
    });
  };
  return p;
})();


var Key = {left : false, right : false, up : false};

window.onkeydown = (e)=>{
  if(e.keyCode == 37)Key.left = true;
  if(e.keyCode == 38)Key.up = true;
  if(e.keyCode == 39)Key.right = true;
};
window.onkeyup = (e)=>{
  if(e.keyCode == 37)Key.left = false;
  if(e.keyCode == 38)Key.up = false;
  if(e.keyCode == 39)Key.right = false;
};