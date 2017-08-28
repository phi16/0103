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

  const audio = new AudioContext();
  const analyser = audio.createAnalyser();
  analyser.fftSize = 2048;
  const buffLen = analyser.frequencyBinCount;
  const data = new Uint8Array(buffLen);
  const freq = new Uint8Array(buffLen);
  navigator.getUserMedia({audio:true},ms=>{
    const src = audio.createMediaStreamSource(ms);
    src.connect(analyser);
  },e=>{
    console.log(e);
  });

  function normDistr(m,s){
    return x=>1/Math.sqrt(2*Math.PI*s*s)*Math.exp(-Math.pow(x-m,2)/2/s/s);
  }
  function koku(){
    const a = Math.sqrt(-2*Math.log(1-Math.random()));
    const u = Math.cos(2*Math.PI*Math.random());
    return a*u;
  }

  Q.run(Q.do(function*(){
    const shape = Shape.rect(0,0,Util.width,Util.height);

    const ballCols = [
      Color.rgb255(2,219,149),
      Color.rgb255(0,206,206),
      Color.rgb255(89,139,255),
      Color.rgb255(136,106,255),
      Color.rgb255(209,28,255),
      Color.rgb255(255,62,143),
      Color.rgb255(0,0,0)
    ];
    const n = 6;
    const minFreq = 35.8;
    const maxFreq = 73.4;
    let vibras = [];
    let freqPoints = [];
    let crash = [];
    let radius = [];
    let radiusIn = [];
    let dura = 20;
    for(let i=0;i<n;i++){
      vibras.push(0);
      freqPoints.push(minFreq + (maxFreq - minFreq) * i / (n-1));
      crash.push(0);
      radius.push(Ease.in.back.sequent(i,n,0.4)(40).begin(1));
      radiusIn.push(Ease.out.back.sequent(i,n,0.4)(40).begin(0));
      yield radiusIn[i].to(1);
    }
    function init(){
      vibras = [];
      freqPoints = [];
      crash = [];
      radius = [];
      radiusIn = [];
    }
    function* addCircle(){
      vibras.push(0);
      let r = Math.random();
      freqPoints.push(minFreq + (maxFreq - minFreq) * r);
      crash.push(0);
      radius.push(Ease.in.back.sequent(r*100,100,0.4)(80).begin(1));
      radiusIn.push(Ease.out.back(40).begin(0));
      yield radiusIn[radiusIn.length-1].to(1);
    }
    let startTime, currentTime;
    let finish = false, ending = false;
    let score = 0, scoreSize = 0, scoreAlpha = 0;
    let beforeStart = true;
    const render = _=>{
      R.fill(Color.rgb255(49,49,49))(Shape.rect(0,0,Util.width,Util.height));
      let mult = Math.min(1,buffLen/Util.width);
      R.translate(0,Util.height/2)(_=>{
        for(let i=1;i<buffLen;i++){
          R.stroke(4,Color.rgb(0.5,0.5,0.5))(Shape.line((i-1)*mult,data[i-1]-127,i*mult,data[i]-127));
        }
        let space = 8;
        R.translate(3,0)(_=>{
          R.scale(2,1)(_=>{
            for(let i=0;i<60;i++){
              let x = Math.floor(30+i);
              let f = freq[x];
              R.stroke(2,Color.rgb(0.7,0.7,0.7))(Shape.line(i*space,Util.height/2-f,i*space,Util.height/2));
            }
          });
        });
        for(let i=0;i<vibras.length;i++){
          let wid = 120;
          let fi = (freqPoints[i]-minFreq)/(maxFreq-minFreq)*(n-1);
          if(fi>n-1)fi=n-1;
          let ff = Math.floor(fi);
          let color = Color.mix(ballCols[ff],ballCols[ff+1],1-(fi-ff));
          let x = Util.width/2 - (n-1)*wid/2 + fi*wid;
          let rr = radius[i]()*radiusIn[i]();
          if(rr<0)rr = 0;
          if(crash[i]==0){
            let y1 = vibras[i] * 20 * koku();
            let y2 = vibras[i] * 20 * koku();
            R.stroke(40*rr,Color.alpha(color,0.5))(Shape.line(x,y1,x,y2));
            R.fill(color)(Shape.circle(x,y2,20*rr));
          }else{
            let y = 0;
            let rad = 20 + 80 * Math.exp(-crash[i]/10);
            rad *= radius[i]();
            crash[i]++;
            let outer = Shape.invert(Shape.circle(x,y,rad*rr));
            R.clip(outer)(_=>{
              R.fill(color)(Shape.circle(x,y,(rad+10)*rr));
            });
          }
        }
      });
      if(startTime){
        if(currentTime < 0){
          let t = -currentTime/1000;
          let str = Math.ceil(t);
          let po = Math.exp(-(Math.ceil(t)-t)*8) + 1;
          R.translate(Util.width/2,Util.height/2)(_=>{
            R.fill(Color.rgba(1,1,1,0.2))(Shape.numberText(0,0,400*po,str,0,0));
          });
        }else if(currentTime<dura*1000){
          let t = currentTime/1000;
          let str = "Start!";
          let time = Math.floor(dura+1-t);
          let po = Math.exp(-t*10) + 1;
          let vib = Math.exp(-(t-Math.floor(t))*8)/2 + 1;
          let x = koku()*Math.max(0,(vib-0.8)*(t-10)/2);
          let y = koku()*Math.max(0,(vib-0.8)*(t-10)/2);
          R.translate(Util.width/2,Util.height/2)(_=>{
            R.fill(Color.rgba(1,1,1,0.5*(po-1)))(Shape.numberText(0,0,200*po,str,0,0));
            R.fill(Color.rgba(1,1,1,0.8*(1-0.5*(po-1))))(Shape.numberText(x,y-Util.height/2+40,50*vib,time,0,0));
          });
        }else{
          let t = currentTime/1000-dura;
          let str = "Finish!";
          let po = Math.exp(-t) + 1;
          R.translate(Util.width/2,Util.height/2)(_=>{
            R.fill(Color.rgba(1,1,1,0.5*(po-1)+0.1))(Shape.numberText(0,0,200*po,str,0,0));
          });
        }
        if(ending){
          scoreAlpha += 0.01;
          scoreSize += 1;
          let sz = Math.exp(-scoreSize)*0.5 + 1;
          if(scoreAlpha>1)scoreAlpha=1;
          let txt = "Score:" + score;
          R.translate(Util.width/2,0)(_=>{
            R.fill(Color.rgba(1,1,1,scoreAlpha))(Shape.numberText(0,70,80*sz,txt,0,0));
          });
        }
      }
      R.translate(Util.width/2,0)(_=>{
        R.fill(Color.rgba(1,1,1,0.5))(Shape.numberText(0,40,40,"[Voice Only]",0,-1));
      });
    };
    const handler = box=>Q.do(function*(){
      yield Q.listen(Q.do(function*(){
        const b = yield box.receive;
        if(b.mouse){
          //console.log(b.mouse);
        }
      }));
      yield Q.listen(Q.do(function*(){
        analyser.getByteTimeDomainData(data);
        analyser.getByteFrequencyData(freq);

        let dot = [];
        for(let j=0;j<vibras.length;j++)dot.push(0);
        for(let i=0;i<60;i++){
          let x = Math.floor(30+i);
          let f = freq[x];
          for(let j=0;j<vibras.length;j++){
            let fp = normDistr(freqPoints[j],1)(x)*400 - 10;
            dot[j] += fp * f;
          }
        }
        for(let j=0;j<vibras.length;j++){
          if(crash[j]==0){
            if(dot[j] > 10000 && !finish){
              vibras[j] += dot[j]/1000000;
            }else{
              vibras[j] += (0 - vibras[j]) / 4.;
            }
            if(vibras[j] > 3){
              beforeStart = false;
              crash[j] = 1;
            }
          }
        }
        currentTime = new Date() - startTime;

        yield Q.switch;
      }));

      // first act
      while(1){
        let b = true;
        for(let i=0;i<vibras.length;i++){
          if(crash[i]==0)b=false;
        }
        if(b)break;
        yield Q.switch;
      }
      // end anim
      yield Q.waitMS(500);
      for(let i=0;i<vibras.length;i++){
        crash[i] = 10;
      }
      yield Q.waitMS(500);
      for(let i=0;i<vibras.length;i++){
        yield radius[i].to(0);
      }
      yield Q.waitMS(1000);

      init();
      // start anim
      startTime = new Date() - 0 + 3000;

      while(1){
        if(currentTime > 0)break;
        yield Q.switch;
      }

      // start game
      yield Q.join.any([Q.do(function*(){
        while(1){
          yield* addCircle();
          yield Q.waitMS(1000);
        }
      }),Q.do(function*(){
        while(1){
          if(currentTime > dura*1000/2)break;
          yield Q.switch;
        }
      })]);
      yield Q.join.any([Q.do(function*(){
        while(1){
          yield* addCircle();
          yield Q.waitMS(500);
        }
      }),Q.do(function*(){
        while(1){
          if(currentTime > dura*1000)break;
          yield Q.switch;
        }
      })]);

      // end
      finish = true;
      yield Q.waitMS(1500);
      for(let i=0;i<vibras.length;i++){
        if(crash[i]==0)yield radius[i].to(0);
      }
      yield World.sleep(160);
      ending = true;
      yield Q.waitMS(500);
      for(let i=0;i<vibras.length;i++){
        if(crash[i]!=0){
          yield radius[i].to(0);
          yield Q.fork(Q.do(function*(){
            yield World.sleep(30);
            yield v.emit("score");
          }));
        }
      }
      yield Q.listen(Q.do(function*(){
        yield v.wait("score");
        score++;
        scoreSize = 0;
        yield World.sleep(2);
      }));
      yield World.sleep(160);
      yield Q.waitMS(2000);
      // twitter
      window.open("https://twitter.com/intent/tweet?text="+encodeURI("[EIGENFREQ] Score : " + score + " https://phi16.github.io/Jam/0828")+"&hashtags=traP3jam","_blank");

      yield Q.abort;
    });
    const view = yield View.make(_=>({mouse:_}),shape,render,handler);
    Screen.register("Visual",view);
  }));

  return v;
});
