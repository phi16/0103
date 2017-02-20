window.onload = ()=>{
  Picture.load("title","/Jam/0220/res/title.png");
  Picture.load("over","/Jam/0220/res/over.png");
  Poyo.start("canvas",[Main]);
  var resize = ()=>{
    document.getElementById("canvas").width = document.getElementById("container").clientWidth;
    document.getElementById("canvas").height = document.getElementById("container").clientHeight;
  };
  resize();
  window.onresize = resize;
};
