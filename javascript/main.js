function showButton() {
  var detector;
  var canvas = document.getElementById('canvas');
  canvas.width = this.width;
  canvas.height = this.height;
  canvas.getContext('2d').drawImage(this,0,0);
  new HAAR.Detector(haarcascade_mcs_nose).image(this).complete(function(){
    alert(this.objects.length+" Objects found");
    var rect=this.objects[0];
    var rect2 = this.objects[1];
    var ctx=canvas.getContext('2d');
    var momo = new Image();
    momo.src = '/image/momo.png';
    momo.addEventListener('load', function() {
      ctx.drawImage(momo, rect.x, rect.y, rect.width, rect.height);
    });
    //ctx.strokeRect(rect2.x,rect2.y,rect2.width,rect2.height);
  }).detect(1, 1.1, 0.1, 1, true);
};

window.addEventListener('load', function() {
  var image = new Image();
  image.src = '/image/kanako.jpg';
  image.addEventListener('load', showButton);
});
