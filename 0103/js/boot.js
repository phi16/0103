window.onload = ()=>{
  Picture.load("left","/Jam/0103/res/left.png");
  Picture.load("right","/Jam/0103/res/right.png");
  Picture.load("standL","/Jam/0103/res/standL.png");
  Picture.load("standR","/Jam/0103/res/standR.png");
  Picture.load("jumpL","/Jam/0103/res/jumpL.png");
  Picture.load("jumpR","/Jam/0103/res/jumpR.png");
  Picture.load("block","/Jam/0103/res/block.png");
  Picture.load("ground","/Jam/0103/res/ground.png");
  Picture.load("flag","/Jam/0103/res/flag.png");
  Poyo.start("canvas",[Main]);
  var resize = ()=>{
    document.getElementById("canvas").width = document.getElementById("container").clientWidth;
    document.getElementById("canvas").height = document.getElementById("container").clientHeight;
  };
  resize();
  window.onresize = resize;
};
