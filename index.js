const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const keyInput = document.querySelector('.imageloader--input');
const mainCenter = document.querySelector('.main--center');
const img = new Image();
let keyWord;
img.crossOrigin = 'Anonymous';
let toolId;
let lastClass;
let lastId;
const toolsFirst = document.querySelector('.tools-first');
let mode;

if (localStorage.lastClass && localStorage.lastId) {
  lastClass = localStorage.lastClass;
  lastId = localStorage.lastId;
  document.getElementById(localStorage.lastId).className += ' tools--item-active';
} else {
  lastClass = 'tools--item tools--item-icon tools--pencil';
  localStorage.lastId = 'pencil';
  lastId = 'pencil';
  document.getElementById('pencil').className += ' tools--item-active';
}

function toolAction() {
  canvas.onmousemove = null;
  localStorage.imageData = canvas.toDataURL();
}

function getToolClass(event) {
  document.getElementById(lastId).className = lastClass;
  toolId = event.target.id;
  lastClass = document.getElementById(toolId).className;
  lastId = toolId;
  localStorage.lastId = toolId;
  localStorage.lastClass = lastClass;
  document.getElementById(toolId).className += ' tools--item-active';
}

function drawNewImage() {
  ctx.clearRect(0, 0, 512, 512);
  const paddingLeft = (512 - img.width) / 2;
  const paddingTop = (512 - img.height) / 2;
  ctx.drawImage(img, paddingLeft, paddingTop, img.width, img.height);
}

async function getLinkToImage() {
  const url = `https://api.unsplash.com/photos/random?query=town,${keyWord}&client_id=87c1f6c6cdd0450d8c61daf43d295032801f90ce7edc9b001f8731711943d27d`;
  const response = await fetch(url);
  response.json()
    .then(
      (data) => data.urls.small,
    )
    .then((imgUrl) => {
      img.src = imgUrl;
      img.onload = function () {
        drawNewImage();
        localStorage.imageData = canvas.toDataURL();
        return img;
      };
    })
    .catch((error) => alert(error.type));
}

function getKeyWord() {
  keyWord = keyInput.value;
  if (keyWord) {
    getLinkToImage();
  } else {
    alert('Enter a keyword');
  }
}

function getTarget(event) {
  const target = event.target.className;
  if (target === 'imageloader--button') {
    getKeyWord();
  } else if (target === 'main--canvas') {
    mode[lastId](event);
  } else if (target === 'main--clear_button') {
    ctx.clearRect(0, 0, 512, 512);
    localStorage.imageData = null;
  }
}

function pencil(event) {
  let x0 = Math.floor(event.offsetX);
  let y0 = Math.floor(event.offsetY);
  ctx.fillRect(x0, y0, 1, 1);
  canvas.onmousemove = function (evnt) {
    const x1 = Math.floor(evnt.offsetX);
    const y1 = Math.floor(evnt.offsetY);
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const dirx = (x1 - x0 > 0) ? 1 : -1;
    const diry = (y1 - y0 > 0) ? 1 : -1;
    let err = dx - dy;
    while (true) {
      if ((x0 === x1) && (y0 === y1)) {
        break;
      }
      const doubleErr = 2 * err;
      if (doubleErr > -dy) {
        err -= dy;
        x0 += dirx;
      }
      if (doubleErr < dx) {
        err += dx;
        y0 += diry;
      }
      ctx.fillRect(x0, y0, 1, 1);
    }
  };
}

function fillBucket() {
  alert('This function is not ready yet');
}

function chooseColor() {
  alert('This function is not ready yet');
}

function transform() {
  alert('This function is not ready yet');
}

mode = {
  pencil,
  transform,
  'fill-bucket': fillBucket,
  'choose-color': chooseColor,
};

if (localStorage.imageData !== 'null') {
  img.src = localStorage.imageData;
  img.onload = function drawImage() {
    ctx.drawImage(img, 0, 0);
  };
}
toolsFirst.addEventListener('mousedown', getToolClass);

canvas.addEventListener('mouseup', toolAction);

mainCenter.addEventListener('mousedown', getTarget);
