window.onload = ()=>{
  Picture.load("left","/0103/res/left.png");
  Picture.load("right","/0103/res/right.png");
  Picture.load("standL","/0103/res/standL.png");
  Picture.load("standR","/0103/res/standR.png");
  Picture.load("jumpL","/0103/res/jumpL.png");
  Picture.load("jumpR","/0103/res/jumpR.png");
  Picture.load("block","/0103/res/block.png");
  Picture.load("ground","/0103/res/ground.png");
  Picture.load("flag","/0103/res/flag.png");
  Poyo.start("canvas",[Main]);
  var resize = ()=>{
    document.getElementById("canvas").width = document.getElementById("container").clientWidth;
    document.getElementById("canvas").height = document.getElementById("container").clientHeight;
  };
  resize();
  window.onresize = resize;
};
