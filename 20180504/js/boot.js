window.onload = ()=>{
  Picture.load("5000chou","/Jam/0504/res/5000chou.png");
  Picture.load("moji","/Jam/0504/res/moji.png");
  Poyo.start("canvas",[Main]);
  var resize = ()=>{
    document.getElementById("canvas").width = document.getElementById("container").clientWidth;
    document.getElementById("canvas").height = document.getElementById("container").clientHeight;
  };
  resize();
  window.onresize = resize;
};
