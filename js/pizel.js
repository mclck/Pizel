$(function() {
  $("#files")[0].addEventListener("change", fileSelect, false);
});

function fileSelect(evt) {
  var old_element = $("input[type=range]")[0];
  var new_element = old_element.cloneNode(true);
  old_element.parentNode.replaceChild(new_element, old_element);

  var img = new Image();
  var reader = new FileReader();
  reader.readAsDataURL(evt.target.files[0]);
  reader.onload = (
    function() {
      return function(e) {
        img.src = e.target.result;
      };
    })(evt.target.files[0]);
  img.onload = function() {
    draw(img);
    if (evt.target.files[0].size < 200000) {
      $("input[type=range]")[0].addEventListener("input", function() {
        draw(img);
      }, false);
    } else {
      $("input[type=range]")[0].addEventListener("change", function() {
        draw(img);
      }, false);
    }
  }
}

function draw(img) {
  $("img, a, canvas").remove();
  $("#result").append("<canvas width=" + img.width / $("input[type=range]").val() + ", height=" + img.height / $("input[type=range]").val() + "> </canvas>");
  var ctx = $("canvas").get(0).getContext("2d");
  ctx.drawImage(img, 0, 0, img.width / $("input[type=range]").val(), img.height / $("input[type=range]").val());
  var newIMG = convertCanvasToImage($("canvas").get(0));
  $("#result").append("<canvas width=" + newIMG.width * $("input[type=range]").val() + ", height=" + newIMG.height * $("input[type=range]").val() + "> </canvas>");
  var ctx = $("canvas").get(0).getContext("2d");
  ctx.mozImageSmoothingEnabled = false;
  ctx.msImageSmoothingEnabled = false;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(newIMG, 0, 0, newIMG.width * $("input[type=range]").val(), newIMG.height * $("input[type=range]").val());
  $("#result").append(convertCanvasToImage($("canvas").get(0)));
  $(".result").append("<a href=" + $("img").attr("src") + " download='pizel.png' >download</a>");
}

function convertCanvasToImage(canvas) {
  var image = new Image();
  image.src = canvas.toDataURL("image/png");
  canvas.remove();
  return image;
}

function convertImageToCanvas(image) {
  var canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  canvas.getContext("2d").drawImage(image, 0, 0);
  return canvas;
}
