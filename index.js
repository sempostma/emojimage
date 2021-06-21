var input = document.querySelector("#emojiInput");
var canvas = document.querySelector("#emojiCanvas");
var emojiImage = document.querySelector("#emojiImage");
var downloadEmoji = document.querySelector('#downloadEmoji')
var emojiResolution = document.querySelector('#emojiResolution')
var ctx = canvas.getContext("2d");

input.addEventListener("input", run);
emojiResolution.addEventListener("input", run);

function run() {
  ctx.clearRect(
    0,
    0,
    +canvas.getAttribute("width"),
    +canvas.getAttribute("height")
  );
  var resolution = emojiResolution.value
  var fontSize = +resolution
  if (input.value.length === 0) {
    emojiImage.removeAttribute('src')
    return
  }
  canvas.width = fontSize * input.value.length
  canvas.height = fontSize * 2
  ctx.font = fontSize + "px Arial";
  ctx.fillText(input.value, 0, fontSize);
  var data = cropImageFromCanvas(ctx)
  emojiImage.setAttribute('src', data)
  downloadEmoji.setAttribute('href', data)
  downloadEmoji.setAttribute('download', 'emoji-' + fontSize + '.png')
}

function cropImageFromCanvas(ctx) {
  var canvas = ctx.canvas, 
    w = canvas.width, h = canvas.height,
    pix = {x:[], y:[]},
    imageData = ctx.getImageData(0,0,canvas.width,canvas.height),
    x, y, index;

  var oldW = w, oldH = h

  for (y = 0; y < h; y++) {
    for (x = 0; x < w; x++) {
      index = (y * w + x) * 4;
      if (imageData.data[index+3] > 0) {
        pix.x.push(x);
        pix.y.push(y);
      } 
    }
  }
  pix.x.sort(function(a,b){return a-b});
  pix.y.sort(function(a,b){return a-b});
  var n = pix.x.length-1;

  w = 1 + pix.x[n] - pix.x[0];
  h = 1 + pix.y[n] - pix.y[0];
  var cut = ctx.getImageData(pix.x[0], pix.y[0], w, h);

  canvas.width = w;
  canvas.height = h;
  ctx.putImageData(cut, 0, 0);

  var image = canvas.toDataURL();  //open cropped image in a new window
  canvas.width = oldW;
  canvas.height = oldH;
  return image
}
