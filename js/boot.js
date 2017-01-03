window.onload = ()=>{
  Picture.load("left","/res/left.png");
  Picture.load("right","/res/right.png");
  Picture.load("standL","/res/standL.png");
  Picture.load("standR","/res/standR.png");
  Picture.load("jumpL","/res/jumpL.png");
  Picture.load("jumpR","/res/jumpR.png");
  Picture.load("block","/res/block.png");
  Picture.load("ground","/res/ground.png");
  Picture.load("flag","/res/flag.png");
  Poyo.start("canvas",[Main]);
  var resize = ()=>{
    document.getElementById("canvas").width = document.getElementById("container").clientWidth;
    document.getElementById("canvas").height = document.getElementById("container").clientHeight;
  };
  resize();
  window.onresize = resize;
};
