var canvas = undefined;

function setLoader(visible) {
  var el = document.getElementById('loader');
  el.style.display = visible ? 'inline-block' : 'none';
}

function detectAndDraw(image) {
  new HAAR.Detector(haarcascade_mcs_nose).image(image).complete(function(){
    setLoader(false);
    alert(this.objects.length+" Objects found");
    var rect=this.objects[0];
    var rect2 = this.objects[1];
    var ctx=canvas.getContext('2d');
    var momo = new Image();
    momo.src = '/image/momo.png';
    momo.addEventListener('load', function() {
      ctx.drawImage(momo, rect.x, rect.y, rect.width, rect.height);
    });
  }).detect(1, 1.1, 0.1, 1, true);
};

function showButton() {
  setLoader(true);
  canvas.width = this.width;
  canvas.height = this.height;
  canvas.getContext('2d').drawImage(this,0,0);
  detectAndDraw(this);
};

function loadStream(stream) {
  var video = document.getElementById('video');
  video.src = webkitURL.createObjectURL(stream);
  var _canvas = document.createElement('canvas');
  setTimeout(function() {
    _canvas.width = video.videoWidth;
    _canvas.height = video.videoHeight;
    _canvas.getContext('2d').drawImage(video, 0, 0);
    var captured = new Image();
    captured.src = _canvas.toDataURL();
    captured.addEventListener('load', showButton);
  }, 2000);
};

window.addEventListener('load', function() {
  canvas = document.getElementById('canvas');

  var fileInput = document.getElementById('file');
  fileInput.addEventListener('change', function() {
    reader = new FileReader();
    reader.readAsDataURL(fileInput.files[0]);
    reader.addEventListener('load', function() {
      var image = new Image();
      image.src = reader.result;
      image.addEventListener('load', showButton);
    });
  });
  if (navigator.webkitGetUserMedia) {
    navigator.webkitGetUserMedia({video:true}, loadStream);
  }
});
