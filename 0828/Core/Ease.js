Util.register("Ease",_=>{
  const e = {};

  function konOrig(f,d,x){
    let dur = d;
    let easing = f;
    let from = x;
    let to = x;
    let cur = 0;
    let value = x;
    let processed = false;
    const o = _=>value;
    let lerp = a=>(x,y)=>x*(1-a)+y*a;
    function handle(v,act){
      const localDur = dur;
      const localEasing = easing;
      return Q.delay(_=>{
        from = value;
        to = v;
        cur = 0;
        const p = _ => processed = false;
        const h = _ => Q.do(function*(){
          if(processed){
            yield act;
            return Q.pure(false);
          }else{
            cur++;
            cur = Math.min(cur,localDur);
            value = lerp(localEasing(cur/localDur))(from,to);
            processed = true;
            if(cur<localDur)return Q.pure(true);
            else{
              yield act;
              return Q.pure(false);
            }
          }
        });
        return World.easeRegister(p,h);
      });
    }
    // R
    o.dur = _=>dur;
    // R
    o.target = _=>to;
    // a -> C ()
    o.to = v=>handle(v,Q.pure());
    // a -> C ()
    o.wait = v=>Q.waitUntil(done=>handle(v,done));
    // a -> C ()
    o.force = v=>Q.action(_=>{
      from = to = value = v;
      cur = dur;
    });
    // C () -> C ()
    o.reflected = proc=>{
      const oldE = easing;
      easing = x=>1-oldE(1-x);
      return Q.bind(proc,_=>Q.action(_=>{
        easing = oldE;
      }));
    };
    // duration
    o.duration = d=>proc=>{
      const oldD = dur;
      dur = d;
      return Q.bind(proc,_=>Q.action(_=>{
        dur = oldD;
      }));
    };
    // easing
    o.easing = e=>proc=>{
      const oldE = easing;
      easing = e.func;
      return Q.bind(proc,_=>Q.action(_=>{
        easing = oldE;
      }));
    };
    return o;
  }
  function kon(f){
    const k = dur=>({begin:x=>konOrig(f,dur,x)});
    k.sequent = (i,n,d)=>{
      return kon(x=>{
        const p = x/d - i/(n-1)*(1/d-1);
        return f(Math.max(0,Math.min(1,p)));
      });
    };
    k.func = f;
    return k;
  }
  function prims(f){
    const p = {};
    p.linear = kon(f(x=>x));
    p.quad = kon(f(x=>x*x));
    p.cubic = kon(f(x=>x*x*x));
    p.quart = kon(f(x=>x*x*x*x));
    p.quint = kon(f(x=>x*x*x*x*x));
    p.pow = (n)=>kon(f(x=>Math.pow(x,n)));
    p.smooth = kon(f(x=>x*x*(3-x)/2));
    p.expo = kon(f(x=>Math.pow(2,-(1-x)*10)));
    p.sine = kon(f(x=>Math.sin(x*Math.PI/2)));
    p.circ = kon(f(x=>1-Math.sqrt(1-x*x)));
    p.back = kon(f(x=>x*x*(2.70158*x-1.70158)));
    p.elastic = kon(f(x=>(((56*x-105)*x+60)*x-10)*x*x));
    p.bounce = kon(f(x=>{
      var pow2, bounce = 4;
      while ( x < ( ( pow2 = Math.pow( 2, --bounce ) ) - 1 ) / 11 ) {}
      return 1 / Math.pow( 4, 3 - bounce ) - 7.5625 * Math.pow( ( pow2 * 3 - 2 ) / 22 - x, 2 );
    }));
    return p;
  }
  e.in = prims(f=>x=>f(x));
  e.out = prims(f=>x=>1-f(1-x));
  e.inOut = prims(f=>x=>{
    if(x<0.5)return f(x*2)/2;
    else return 1-f(2-2*x)/2;
  });
  return e;
});
