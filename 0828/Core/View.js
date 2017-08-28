Util.register("View",_=>{
  const v = {};

  function spawnWithKill(kill,handler){
    return Q.spawn(box=>Q.do(function*(){
      yield Q.join.any([Q.takeBox(kill),Q.bind(handler(box),_=>Q.do(function*(){
        while(1)yield box.receive;
      }))]);
      while(1)yield box.receive;
    }));
  }

  // View a = {id:Int, render:Render, post:Sender a,element:DOMElement?}
  // (FocusEvent -> a | null, Shape, Render, Receiver a -> C ()) -> C (View a)
  v.make = (event,shape,render,handler)=>Q.do(function*(){
    const kill = Q.emptyBox();
    const box = yield spawnWithKill(kill,handler);

    let aff = [1,0,0,0,1,0];
    const proc = yield spawnWithKill(kill,me=>Q.do(function*(){
      let x, y;
      function* fire(str){
        const obj = {};
        obj[str] = true;
        let a = aff[0], b = aff[1], c = aff[2];
        let d = aff[3], e = aff[4], f = aff[5];
        let p = x, q = y;
        let ix = -b*f + b*q + e*c - e*p
        let iy =  a*f - a*q - d*c + d*p
        let z = b*d - a*e
        obj.x = ix/z;
        obj.y = iy/z;
        const evt = event(obj);
        if(evt!=null){
          yield box.send(evt);
        }
      }
      function* recv(){
        const e = yield me.receive;
        x = e.x, y = e.y;
        if(e.up)return {left:false,right:null};
        if(e.down)return {left:true,right:null};
        if(e.outside)return {right:false,left:null};
        const shapeMove = Shape.affine(aff[0],aff[1],aff[2],aff[3],aff[4],aff[5])(shape);
        return {right:shapeMove.inside(e.x,e.y),left:null};
      }
      function* outOfShape(){
        const r = yield* recv();
        if(r.right===true){yield* fire("enter"); return hovering;}
        else return outOfShape;
      }
      function* hovering(){
        const r = yield* recv();
        if(r.right===false){yield* fire("leave"); return outOfShape;}
        else if(r.left===true){yield* fire("press"); return dragging;}
        else if(r.right===true){yield* fire("move"); return hovering;}
        else return hovering;
      }
      function* dragging(){
        const r = yield* recv();
        if(r.right===false){yield* fire("leave"); return dragOut;}
        else if(r.left===false){yield* fire("release"); return hovering;}
        else if(r.right===true){yield* fire("drag"); return dragging;}
        else return dragging;
      }
      function* dragOut(){
        const r = yield* recv();
        if(r.right===true){yield* fire("enter"); return dragging;}
        else if(r.left===false){yield* fire("cancel"); return outOfShape;}
        else if(r.right===false){yield* fire("drag"); return dragOut;}
        else return dragOut;
      }
      let p = outOfShape;
      while(1){
        p = yield* p();
      }
    }));
    let cov = (p,q)=>true;
    let removed = false;
    const renderMove = _=>{
      if(!removed){
        cov = Render.coverShape();
        render();
        aff = Util.clone(Render.affineArray());
      }
    };
    const cnt = yield World.viewRegister(proc,(p,q)=>cov(p,q));
    const view = {
      id:cnt,
      render:renderMove,
      post:box,
      remove:Q.do(function*(){
        removed = true;
        cov = _=>false;
        aff = [0,0,0,0,0,0];
        yield World.viewRemove(view);
        yield Q.putBox(kill,{}); // box
        yield Q.putBox(kill,{}); // proc
      })
    };
    return Q.pure(view);
  });
  v.makeRenderer = r=>v.make(_=>null,Shape.empty,r,Q.consume);
  v.makeAnimation = (r,h)=>v.make(_=>null,Shape.empty,r,_=>h);
  v.makeFrame = (r,h)=>v.make(_=>null,Shape.empty,r,h);

  v.makeInput = (event,x,y,w,h,handler)=>Q.do(function*(){
    const kill = Q.emptyBox();
    const box = yield spawnWithKill(kill,handler);
    const dust = yield spawnWithKill(kill,Q.consume);
    let cov = (p,q)=>true;
    const cnt = yield World.viewRegister(dust,(p,q)=>cov(p,q));
    const elem = document.createElement("input");
    elem.type = "text";
    elem.name = "input" + cnt;
    elem.id = "input" + cnt;
    elem.style.position = "absolute";
    elem.style.outline = "0";
    elem.style.fontFamily = "mplus";
    elem.style.fontSize = "20px";
    elem.style.backgroundColor = "rgba(0,0,0,0)";
    elem.style.borderColor = "rgba(0,0,0,0)";
    const fire = (str,arg)=>Q.do(function*(){
      const obj = {};
      obj[str] = arg!==undefined ? arg : true;
      const e = event(obj);
      if(e!=null)yield box.send(e);
    });
    elem.addEventListener("keydown",e=>{
      if(e.keyCode==13)Q.run(fire("return",elem.value));
      else Q.run(fire("update",elem.value));
    });
    elem.addEventListener("keyup",e=>{
      Q.run(fire("update",elem.value));
    });
    elem.addEventListener("focus",e=>{
      Q.run(fire("focus"));
    });
    elem.addEventListener("blur",e=>{
      Q.run(fire("lost"));
    });
    document.getElementById("views").appendChild(elem);
    let removed = false;
    const render = _=>{
      if(!removed){
        cov = Render.coverShape();
        Render.translate(x+w/2,y+h/2)(_=>{
          let a,b,c,d,e,f;
          [a,b,c,d,e,f] = Render.affineArray();
          elem.style.left = Util.realLeft + (-w/2) + "px";
          elem.style.top = Util.realTop + (-h/2) + "px";
          elem.style.width = w + "px";
          elem.style.height = h + "px";
          elem.style.transform = "matrix(" + [a,d,b,e,c,f].join(",") + ")";
        });
      }
    };
    const view = {
      id:cnt,
      render:render,
      post:box,
      element:elem,
      value:_=>elem.value,
      setValue:v=>{
        elem.value = v;
      },
      remove:Q.do(function*(){
        document.getElementById("views").removeChild(elem);
        removed = true;
        cov = _=>false;
        yield World.viewRemove(view);
        yield Q.putBox(kill,{}); // box
        yield Q.putBox(kill,{}); // dust
      })
    };
    return Q.pure(view);
  });

  v.makeScroll = (x,y,w,h,ih,render,handler)=>Q.do(function*(){
    const kill = Q.emptyBox();
    const box = yield spawnWithKill(kill,handler);
    const dust = yield spawnWithKill(kill,Q.consume);
    let cov = (p,q)=>true;
    const cnt = yield World.viewRegister(dust,(p,q)=>cov(p,q));
    const elem = document.createElement("div");
    elem.name = "scroll" + cnt;
    elem.id = "scroll" + cnt;
    elem.style.position = "absolute";
    elem.style.overflowX = "hidden";
    elem.style.overflowY = "scroll";
    const canvas = document.createElement("canvas"); // TODO? : blank!
    elem.appendChild(canvas);
    document.getElementById("views").appendChild(elem);
    const ctx = canvas.getContext("2d");
    let removed = false;
    const renderMove = _=>{
      if(!removed){
        Render.translate(x+w/2,y+h/2)(_=>{
          let a,b,c,d,e,f;
          [a,b,c,d,e,f] = Render.affineArray();
          elem.style.left = Util.realLeft + (-w/2) + "px";
          elem.style.top = Util.realTop + (-h/2) + "px";
          elem.style.width = w + "px";
          elem.style.height = h + "px";
          elem.style.transform = "matrix(" + [a,d,b,e,c,f].join(",") + ")";
          canvas.width = w;
          canvas.height = ih();
        });
        Render.clip(Shape.rect(x,y,w,h))(_=>{
          Render.clipCover(Shape.rect(x,y,w,h))(_=>{
            cov = Render.coverShape();
            Render.translate(x,y-elem.scrollTop)(_=>{
              render();
            });
          });
        });
      }
    };
    const view = {
      id:cnt,
      render:renderMove,
      post:box,
      element:elem,
      remove:Q.do(function*(){
        document.getElementById("views").removeChild(elem);
        removed = true;
        cov = _=>false;
        yield World.viewRemove(view);
        yield Q.putBox(kill,{}); // box
        yield Q.putBox(kill,{}); // dust
      })
    };
    return Q.pure(view);
  });

  v.makePopup = (w,h,viewMaker)=>Q.do(function*(){
    Util.autoCursor();
    const endBox = Q.emptyBox();
    const ePopup = Ease.out.back(15).begin(0);
    const eShadow = Ease.inOut.cubic(15).begin(0);
    yield Q.join.any([Q.do(function*(){
      yield World.sleep(15);
      yield Q.takeBox(endBox);
    }),Q.do(function*(){
      const dust = yield Q.spawn(Q.consume);
      const cnt = yield World.viewRegister(dust,(p,q)=>true,true);
      const elem = document.createElement("canvas");
      elem.name = "canvas" + cnt;
      elem.id = "canvas" + cnt;
      elem.style.position = "absolute";
      document.getElementById("views").appendChild(elem);
      const view = yield viewMaker(Q.putBox(endBox,{}));
      const ctx = elem.getContext("2d");
      yield ePopup.to(1);
      yield eShadow.to(0.8);
      const outerShape = Shape.invert(Shape.rect(0,0,w,h));
      const outerButton = yield View.make(x=>x,outerShape,_=>{},box=>Q.do(function*(){
        while(1){
          const m = yield box.receive;
          if(m.press)break;
        }
        yield Q.putBox(endBox,{});
      }));
      const popup = {
        id:cnt,
        render:_=>{
          elem.style.left = Util.realLeft + "px";
          elem.style.top = Util.realTop + "px";
          elem.width = Util.realWidth;
          elem.height = Util.realHeight;
          R.onContext(ctx)(_=>{
            ctx.save();
            ctx.scale(Util.realHeight/Util.height,Util.realHeight/Util.height);
            R.fill(Color.rgba(0,0,0,eShadow()))(Shape.rect(0,0,Util.width,Util.height));
            R.translate((Util.width-w)/2,(Util.height-h)/2)(_=>{
              R.scaleAt(w/2,h/2,ePopup(),ePopup())(_=>{
                R.shadowed(0,2,5,Color.black)(_=>{
                  R.fill(Color.white)(Shape.rect(0,0,w,h));
                });
                view.render();
              });
              outerButton.render();
            });
            ctx.restore();
          });
        },
        element:elem
      };
      Screen.addPopup(popup);
      yield Q.onTerminate(Q.do(function*(){
        yield World.viewRemovePopup(popup); // this removes all views created after making popup
        yield Q.fork(Q.do(function*(){
          yield eShadow.to(0);
          yield ePopup.easing(Ease.in.back)(Q.do(function*(){
            yield ePopup.wait(0);
          }));
          Screen.removePopup(popup);
          document.getElementById("views").removeChild(elem);
        }));
      }));
      yield Q.abort;
    })]);
  });
  return v;
});
