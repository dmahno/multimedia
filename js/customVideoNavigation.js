//ELEMENT SELECTORS
const player = document.querySelector('.player');
const video = document.querySelector('#video-5');
const playBtn = document.querySelector('.play-btn');
let volumeBtn = document.querySelector('.volume-btn');
let volumeSlider = document.querySelector('.volume-slider');
let volumeFill = document.querySelector('.volume-filled');
let progressSlider = document.querySelector('.progress');
let progressFill = document.querySelector('.progress-filled');
let textCurrent = document.querySelector('.time-current');
let textTotal = document.querySelector('.time-total');
let speedBtns = document.querySelectorAll('.speed-item');
let fullscreenBtn = document.querySelector('.fullscreen');

//GLOBAL VARS
let lastVolume = 1;
let isMouseDown = false;

//PLAYER FUNCTIONS
function togglePlay() {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtn.classList.toggle('paused');
}
function togglePlayBtn() {
  playBtn.classList.toggle('playing');
}

function toggleMute() {
  if (video.volume) {
    lastVolume = video.volume;
    video.volume = 0;
    volumeBtn.classList.add('muted');
    volumeFill.style.width = 0;
  } else {
    video.volume = lastVolume;
    volumeBtn.classList.remove('muted');
    volumeFill.style.width = `${lastVolume * 100}%`;
  }
}
function changeVolume(e) {
  volumeBtn.classList.remove('muted');
  let volume = e.offsetX / volumeSlider.offsetWidth;
  volume < 0.1 ? (volume = 0) : (volume = volume);
  volumeFill.style.width = `${volume * 100}%`;
  video.volume = volume;
  if (volume > 0.7) {
    volumeBtn.classList.add('loud');
  } else if (volume < 0.7 && volume > 0) {
    volumeBtn.classList.remove('loud');
  } else if (volume == 0) {
    volumeBtn.classList.add('muted');
  }
  lastVolume = volume;
}
function neatTime(time) {
  // const hours = Math.floor((time % 86400)/3600)
  let minutes = Math.floor((time % 3600) / 60);
  let seconds = Math.floor(time % 60);
  seconds = seconds > 9 ? seconds : `0${seconds}`;
  return `${minutes}:${seconds}`;
}
function updateProgress(e) {
  progressFill.style.width = `${(video.currentTime / video.duration) * 100}%`;
  textCurrent.innerHTML = `${neatTime(video.currentTime)} / ${neatTime(
    video.duration
  )}`;
  // textTotal.innerHTML = neatTime(video.duration);
  // console.log(progressFill.style.width);
}
function setProgress(e) {
  let newTime = e.offsetX / progressSlider.offsetWidth;
  progressFill.style.width = `${newTime * 100}%`;
  video.currentTime = newTime * video.duration;
}
function launchIntoFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}
function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}
let fullscreen = false;
function toggleFullscreen() {
  fullscreen ? exitFullscreen() : launchIntoFullscreen(player);
  fullscreen = !fullscreen;
}
function setSpeed(e) {
  console.log(parseFloat(this.dataset.speed));
  video.playbackRate = this.dataset.speed;
  speedBtns.forEach((speedBtn) => speedBtn.classList.remove('active'));
  this.classList.add('active');
}
function handleKeypress(e) {
  switch (e.key) {
    case ' ':
      togglePlay();
    case 'ArrowRight':
      video.currentTime += 5;
    case 'ArrowLeft':
      video.currentTime -= 5;
    default:
      return;
  }
}
//EVENT LISTENERS
playBtn.addEventListener('click', togglePlay);
video.addEventListener('click', togglePlay);
video.addEventListener('play', togglePlayBtn);
video.addEventListener('pause', togglePlayBtn);
video.addEventListener('ended', togglePlayBtn);
video.addEventListener('timeupdate', updateProgress);
video.addEventListener('canplay', updateProgress);
volumeBtn.addEventListener('click', toggleMute);
window.addEventListener('mousedown', () => (isMouseDown = true));
window.addEventListener('mouseup', () => (isMouseDown = false));
// volumeSlider.addEventListener('mouseover', changeVolume);
volumeSlider.addEventListener('click', changeVolume);
progressSlider.addEventListener('click', setProgress);
fullscreenBtn.addEventListener('click', toggleFullscreen);
speedBtns.forEach((speedBtn) => {
  speedBtn.addEventListener('click', setSpeed);
});
window.addEventListener('keydown', handleKeypress);
