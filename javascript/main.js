var canvas = undefined;
var video = undefined;

function setLoader(visible) {
  var el = document.getElementById('loader');
  el.style.display = visible ? 'inline-block' : 'none';
}

function showEyes(eyes) {
  var ctx = canvas.getContext('2d');
  var image = new Image();
  image.src = "./image/nc32765.png";
  image.addEventListener('load', function(){
    var length = Math.min(2, eyes.length);
    for (var i = 0; i < length; i++) {
      var rect = eyes[i];
      var height = image.height * rect.width / image.width;
      var y = rect.y + rect.height - height;
      ctx.drawImage(image, rect.x, y, rect.width, height);
    };
  })
}

function detectEyes(image, nose_rect) {
  new HAAR.Detector(haarcascade_eye).image(image).complete(function(){
    if (this.objects.length > 0) {
      alert('PUSH!!!! 「PUSH」のボタンを押してみて');
      var eyes = this.objects;
      canvas.onclick = function(e) {
        if (nose_rect.x < e.offsetX &&
          e.offsetX < nose_rect.x + nose_rect.width &&
          nose_rect.y < e.offsetY &&
          e.offsetY < nose_rect.y + nose_rect.height){
            showEyes(eyes);
          }
      };
    }
  }).detect(1, 1.1, 0.1, 1, true);
};

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
      momo.src = './image/momo.png';
      momo.addEventListener('load', function() {
        ctx.drawImage(momo, rect.x, rect.y, rect.width, rect.height);
      });
      detectEyes(image, rect);
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
