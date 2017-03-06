window.onload = ()=>{
  Picture.load("title","/Jam/0306/res/title.png");
  Picture.load("number","/Jam/0306/res/number.png");
  Picture.load("forbidden","/Jam/0306/res/forbidden.png");
  Picture.load("arrow","/Jam/0306/res/arrow.png");
  Poyo.start("canvas",[Main]);
  var resize = ()=>{
    document.getElementById("canvas").width = document.getElementById("container").clientWidth;
    document.getElementById("canvas").height = document.getElementById("container").clientHeight;
  };
  resize();
  window.onresize = resize;
};
