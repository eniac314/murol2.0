self.addEventListener('message', function(data) {
  resize(data,this);
}, false);

function resize(data, caller){

  var image = new Image();
  
  image.onload = function(){
    
    var canvas = document.createElement('canvas');
    if(image.height > 600) {
      image.width *= 600 / image.height;
      image.height = 600;
    }
    var ctx = canvas.getContext("2d");
    
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, image.width, image.height);
    var data = canvas.toDataURL("image/png");  
    var result = {
            workerId: data.nextWorker,
            filename: data.filename,
            imageData: data
            // width: image.width,
            // height: image.height
          };
             
    caller.postMessage(result);
  };
  
  image.src = data.imageData;
}