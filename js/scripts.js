const videos = document.querySelectorAll('.video');
const brightnessInput = document.getElementById('brightness-input');
const contrastInput = document.getElementById('contrast-input');
const contrastLabel = document.getElementById('contrast-input-value');
const brightnessLabel = document.getElementById('brightness-input-value');
const volumeText = document.getElementById('volume-text');
const volumeMeter = document.getElementById('volume-meter');
const videoGafu = document.getElementById('video-3');
const canvas = document.getElementById('canvas');
const tmpCanvas = document.getElementById('tmp-canvas');
const ctx = canvas.getContext('2d');
const tmpCtx = tmpCanvas.getContext('2d');

function update() {
  const brightness = brightnessInput.value;
  const contrast = contrastInput.value;
  videos.forEach((video) => {
    video.style.filter = `brightness(${brightness}) contrast(${contrast})`;
    console.log(video);
  });
  brightnessLabel.innerText = brightness;
  contrastLabel.innerText = contrast;
}

[brightnessInput, contrastInput].forEach((input) => {
  input.addEventListener('input', update);
});

document.getElementById('reset').onclick = function () {
  contrastInput.value = 1;
  brightnessInput.value = 1;
  contrastLabel.innerText = '1';
  brightnessLabel.innerText = '1';
  update();
};

// 3rd task

function luminance(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function toGrayscale(imageData) {
  const result = new Uint8Array(imageData.length / 4);
  for (let i = 0; i < imageData.length; i += 4) {
    result[i / 4] = luminance(imageData[i], imageData[i + 1], imageData[i + 2]);
  }
  return result;
}

const RATIO = 6;
tmpCanvas.width = canvas.width / RATIO;
tmpCanvas.height = canvas.height / RATIO;

let prevFrame = new Uint8Array(tmpCanvas.width * tmpCanvas.height);

const DEFAULT_PREV_MOTION_RECT_LIFETIME = 60;
const MOTION_DIFF_THRESHOLD = 30;

let prevMotionRect;
let prevMotionRectLifetime = DEFAULT_PREV_MOTION_RECT_LIFETIME;
function motionDetection() {
  const currentFrame = toGrayscale(
    tmpCtx.getImageData(0, 0, tmpCanvas.width, tmpCanvas.height).data
  );

  let diffLeft = +Infinity;
  let diffRight = -Infinity;
  let diffTop = +Infinity;
  let diffBottom = -Infinity;

  let diffPoints = 0;

  for (let y = 0; y < tmpCanvas.height; y++) {
    for (let x = 0; x < tmpCanvas.width; x++) {
      const index = x + y * tmpCanvas.width;

      const diff = Math.abs(prevFrame[index] - currentFrame[index]);
      if (diff < MOTION_DIFF_THRESHOLD) {
        continue;
      }
      diffPoints++;

      diffLeft = Math.min(diffLeft, x);
      diffRight = Math.max(diffRight, x);

      diffTop = Math.min(diffTop, y);
      diffBottom = Math.max(diffBottom, y);
    }
  }

  prevFrame = currentFrame;

  const motionRect = {
    x: diffLeft * RATIO,
    y: diffTop * RATIO,
    width: (diffRight - diffLeft) * RATIO,
    height: (diffBottom - diffTop) * RATIO,
  };

  const hasMotion = diffPoints > 2;

  if (hasMotion) {
    prevMotionRectLifetime = DEFAULT_PREV_MOTION_RECT_LIFETIME;
    prevMotionRect = motionRect;
    return motionRect;
  }

  if (!hasMotion && prevMotionRectLifetime > 0) {
    prevMotionRectLifetime--;
    return prevMotionRect;
  }
}

function loopPic() {
  ctx.drawImage(videoGafu, 0, 0, canvas.width, canvas.height);
  tmpCtx.drawImage(videoGafu, 0, 0, tmpCanvas.width, tmpCanvas.height);

  const motionRect = motionDetection();
  if (motionRect) {
    ctx.beginPath();
    ctx.rect(motionRect.x, motionRect.y, motionRect.width, motionRect.height);
    ctx.strokeStyle = '#f0376b';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  requestAnimationFrame(loopPic);
}
loopPic();
