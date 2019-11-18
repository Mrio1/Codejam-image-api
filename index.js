const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const img = new Image();
let keyWord;
img.crossOrigin = 'Anonymous';
let toolId;
let imageData;
let mode = {
  'pencil': pencil, 
}
let lastClass;
let lastId;

function getLinkToImage() {
  const url = `https://api.unsplash.com/photos/random?query=town,${keyWord}&client_id=87c1f6c6cdd0450d8c61daf43d295032801f90ce7edc9b001f8731711943d27d`;
  fetch(url)
    .then(res => res.json())
    .then(data => data.urls.small
    )
    .then(function(url){
      img.src = url;
      img.onload = function(){
         drawImage();
       }  
    })
    .catch(error => alert(error.type)
    )
}

function drawImage() {
  ctx.clearRect(0,0,512,512);
  let paddingLeft = (512 - img.width) / 2;
  let paddingTop = (512 - img.height) / 2;
  ctx.drawImage(img,paddingLeft,paddingTop,img.width, img.height);
  ctx.save()
}
// end load link section


const keyInput = document.querySelector('.imageloader--input');
const button = document.querySelector('.imageloader--button');
// load link section
button.addEventListener('mousedown',function() {
  keyWord = keyInput.value;
  if (keyWord) {
    getLinkToImage();
  }
});

/////////////////////////////
function pencil(event){
  localStorage['imageData'] = imageData;
  let x0 = Math.floor(event.offsetX);
  let y0 = Math.floor(event.offsetY);
  ctx.fillRect(x0,y0,1,1);
  canvas.onmousemove = function(event){
    let x1 = Math.floor(event.offsetX);
    let y1 = Math.floor(event.offsetY);
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let dirx = (x1 - x0 > 0)?1 : -1;
    let diry = (y1 - y0 > 0)?1 : -1;
    let err = dx - dy;
    while(true){
      if((x0 == x1) && (y0 == y1)){
        break;
      }
      let doubleErr = 2*err;
      if(doubleErr > -dy){
        err -= dy;
        x0 += dirx;
      }
      if(doubleErr < dx){
        err += dx;
        y0 += diry;
      }
      ctx.fillRect(x0,y0,1,1)
    }
  } 
}

if (localStorage['lastClass'] && localStorage['lastId'] && localStorage['imageData']){
  imageData = localStorage['imageData'];
  lastClass= localStorage['lastClass'];
  lastId = localStorage['lastId'];
  document.getElementById(localStorage['lastId']).className += " tools--item-active";
  imageData = localStorage['imageData'];
} else {
  imageData = ctx.createImageData(512, 512);
  lastClass = 'tools--item tools--item-icon tools--pencil';
  localStorage['lastId'] = 'pencil';
  lastId = 'pencil';
  document.getElementById('pencil').className += " tools--item-active";
}
imageData = ctx.createImageData(512, 512);

ctx.putImageData(imageData,0,0);
let toolsFirst = document.querySelector('.tools-first');

toolsFirst.addEventListener('mousedown',function(){
  document.getElementById(lastId).className = lastClass;
  toolId = event.target.id;
  lastClass = document.getElementById(toolId).className;
  lastId = toolId;
  localStorage['lastId'] = toolId;
  localStorage['lastClass'] = lastClass;
  document.getElementById(toolId).className += " tools--item-active"
});

canvas.addEventListener('mousedown',function(){
    mode[lastId](event);
})
canvas.addEventListener('mouseup',function(){
  canvas.onmousemove = null;
})
