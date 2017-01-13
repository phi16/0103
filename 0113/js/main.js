var Main = Poyo.scene("Main",(Po)=>{
  var scene = {};
  var x = 0;
  scene.step = ()=>{
    x++;
  };
  scene.draw = (R)=>{
    R.translated(320,240,()=>{
      Shape.circle(40).with(R.fill(Color.orange).shadow(10).draw);
    });
  };
  return scene;
});