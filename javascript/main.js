var canvas = undefined;
var video = undefined;

function setLoader(visible) {
  var el = document.getElementById('loader');
  el.style.display = visible ? 'inline-block' : 'none';
}

function detectAndDraw(image) {
  new HAAR.Detector(haarcascade_mcs_nose).image(image).complete(function(){
    setLoader(false);
    canvas.width = image.width;
    canvas.height = image.height;
    var ctx=canvas.getContext('2d');
    ctx.drawImage(image,0,0);
    if (this.objects.length > 0) {
      var rect=this.objects[0];
      var momo = new Image();
      momo.src = '/image/momo.png';
      momo.addEventListener('load', function() {
        ctx.drawImage(momo, rect.x, rect.y, rect.width, rect.height);
      });
    } else {
      if (video) {
        capture();
      }
    }
  }).detect(1, 1.1, 0.1, 1, true);
};

function showButton() {
  setLoader(true);
  detectAndDraw(this);
};

function capture() {
  var _canvas = document.createElement('canvas');
  _canvas.width = video.videoWidth;
  _canvas.height = video.videoHeight;
  _canvas.getContext('2d').drawImage(video, 0, 0);
  var captured = new Image();
  captured.src = _canvas.toDataURL();
  captured.addEventListener('load', showButton);
};

function loadStream(stream) {
  video = document.getElementById('video');
  video.src = webkitURL.createObjectURL(stream);
  setTimeout(capture, 2000);
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
