const WMP_DEFAULT_MEDIA = 'assets/media/videos/The Pursuit Of Vikings (Amon Amarth).mp4';
const WMP_SKIP_SECONDS = 10;

let wmpObjectUrl = null;
let wmpIsSeeking = false;
let wmpVolumeBeforeMute = 0.8;

function wmpRoot() {
  return document.getElementById('wmp');
}

function wmpMedia() {
  return document.querySelector('#wmp .player');
}

function wmpSeekEl() {
  return document.querySelector('#wmp .seek');
}

function wmpVolumeEl() {
  return document.querySelector('#wmp .volume');
}

function wmpMuteBtn() {
  return document.querySelector('#wmp .mute');
}

function wmpSetPlayState(playing) {
  wmpRoot()?.classList.toggle('is-playing', Boolean(playing));
}

function wmpEnsureSource() {
  const media = wmpMedia();
  if (!media?.src) {
    wmpOpenDefault();
    return wmpMedia();
  }
  return media;
}

function wmpSyncSeekSlider() {
  if (wmpIsSeeking) return;

  const media = wmpMedia();
  const seek = wmpSeekEl();
  if (!media || !seek) return;

  const duration = media.duration;
  if (!Number.isFinite(duration) || duration <= 0) {
    seek.value = 0;
    return;
  }

  seek.value = String((media.currentTime / duration) * 100);
}

function wmpSyncVolumeSlider() {
  const media = wmpMedia();
  const volume = wmpVolumeEl();
  if (!media || !volume) return;

  const level = media.muted ? 0 : media.volume;
  volume.value = String(Math.round(level * 100));
  wmpMuteBtn()?.classList.toggle('is-muted', media.muted || media.volume === 0);
}

function wmpBindMediaEvents(media) {
  media.addEventListener('timeupdate', wmpSyncSeekSlider);
  media.addEventListener('loadedmetadata', () => {
    wmpSyncSeekSlider();
    wmpSyncVolumeSlider();
  });
  media.addEventListener('durationchange', wmpSyncSeekSlider);
  media.addEventListener('play', () => wmpSetPlayState(true));
  media.addEventListener('pause', () => wmpSetPlayState(false));
  media.addEventListener('volumechange', wmpSyncVolumeSlider);
  media.addEventListener('ended', () => wmpStop());
}

function wmpBindControlEvents(root) {
  const media = wmpMedia();
  const seek = wmpSeekEl();
  const volume = wmpVolumeEl();

  root.querySelector('.play')?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    wmpPlay();
  });

  root.querySelector('.pause')?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    wmpPause();
  });

  root.querySelector('.stop')?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    wmpStop();
  });

  root.querySelector('.previous')?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    wmpPrev();
  });

  root.querySelector('.next')?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    wmpNext();
  });

  root.querySelector('.mute')?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    wmpToggleMute();
  });

  root.querySelector('.fullscreen')?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    wmpToggleFullscreen();
  });

  seek?.addEventListener('pointerdown', () => {
    wmpIsSeeking = true;
  });

  seek?.addEventListener('input', (event) => {
    wmpSeek(event.target.value);
  });

  seek?.addEventListener('change', () => {
    wmpIsSeeking = false;
    wmpSyncSeekSlider();
  });

  seek?.addEventListener('pointerup', () => {
    wmpIsSeeking = false;
    wmpSyncSeekSlider();
  });

  volume?.addEventListener('input', (event) => {
    wmpSetVolume(event.target.value);
  });

  document.addEventListener('fullscreenchange', wmpOnFullscreenChange);

  media?.addEventListener('dblclick', (event) => {
    event.preventDefault();
    wmpToggleFullscreen();
  });
}

function initWmp() {
  const root = wmpRoot();
  const media = wmpMedia();
  if (!root || !media) return;

  media.controls = false;
  media.removeAttribute('controls');
  media.setAttribute('controlsList', 'nodownload noremoteplayback');
  media.setAttribute('disablePictureInPicture', '');
  media.setAttribute('disableRemotePlayback', '');
  media.playsInline = true;

  media.volume = wmpVolumeBeforeMute;
  media.muted = false;

  wmpBindMediaEvents(media);
  wmpBindControlEvents(root);
  wmpSyncVolumeSlider();
  wmpSyncSeekSlider();
}

function wmpOpenDefault() {
  wmpLoadFromUrl(WMP_DEFAULT_MEDIA);
}

function wmpLoadFromUrl(src) {
  const media = wmpMedia();
  if (!media) return;

  if (wmpObjectUrl) {
    URL.revokeObjectURL(wmpObjectUrl);
    wmpObjectUrl = null;
  }

  media.src = src;
  media.load();
  media.play().catch(() => wmpSetPlayState(false));
}

function wmpOpenFile() {
  document.getElementById('wmp-file-input')?.click();
}

function wmpLoadFile(input) {
  const file = input.files?.[0];
  const media = wmpMedia();
  if (!file || !media) return;

  if (wmpObjectUrl) URL.revokeObjectURL(wmpObjectUrl);
  wmpObjectUrl = URL.createObjectURL(file);
  media.src = wmpObjectUrl;
  media.load();
  media.play().catch(() => wmpSetPlayState(false));
  input.value = '';
}

function wmpPlay() {
  const media = wmpEnsureSource();
  if (!media) return;

  const playPromise = media.play();
  if (playPromise?.catch) {
    playPromise.catch(() => wmpSetPlayState(false));
  }
}

function wmpPause() {
  wmpMedia()?.pause();
}

function wmpStop() {
  const media = wmpMedia();
  if (!media) return;

  media.pause();
  media.currentTime = 0;
  wmpIsSeeking = false;
  wmpSyncSeekSlider();
  wmpSetPlayState(false);
}

function wmpPrev() {
  const media = wmpEnsureSource();
  if (!media) return;

  if (media.currentTime <= 3) {
    media.currentTime = 0;
  } else {
    media.currentTime = Math.max(0, media.currentTime - WMP_SKIP_SECONDS);
  }

  wmpSyncSeekSlider();
}

function wmpNext() {
  const media = wmpEnsureSource();
  if (!media || !Number.isFinite(media.duration)) return;

  media.currentTime = Math.min(media.duration, media.currentTime + WMP_SKIP_SECONDS);
  wmpSyncSeekSlider();
}

function wmpToggleMute() {
  const media = wmpMedia();
  const btn = wmpMuteBtn();
  if (!media) return;

  if (media.muted || media.volume === 0) {
    media.muted = false;
    media.volume = wmpVolumeBeforeMute > 0 ? wmpVolumeBeforeMute : 0.8;
  } else {
    wmpVolumeBeforeMute = media.volume;
    media.muted = true;
  }

  wmpSyncVolumeSlider();
  btn?.classList.toggle('is-muted', media.muted || media.volume === 0);
}

function wmpGetFullscreenElement() {
  return document.fullscreenElement || document.webkitFullscreenElement || null;
}

function wmpRequestFullscreen(element) {
  if (element.requestFullscreen) return element.requestFullscreen();
  if (element.webkitRequestFullscreen) return element.webkitRequestFullscreen();
  return Promise.reject(new Error('Fullscreen not supported'));
}

function wmpExitFullscreen() {
  if (document.exitFullscreen) return document.exitFullscreen();
  if (document.webkitExitFullscreen) return document.webkitExitFullscreen();
  return Promise.resolve();
}

function wmpToggleFullscreen() {
  const target = wmpMedia() || wmpRoot();
  if (!target) return;

  if (wmpGetFullscreenElement()) {
    wmpExitFullscreen()?.catch?.(() => {});
    return;
  }

  wmpRequestFullscreen(target)?.catch?.(() => {});
}

function wmpOnFullscreenChange() {
  wmpRoot()?.classList.toggle('is-fullscreen', Boolean(wmpGetFullscreenElement()));
}

function wmpSeek(value) {
  const media = wmpMedia();
  if (!media || !Number.isFinite(media.duration) || media.duration <= 0) return;

  const pct = Math.min(100, Math.max(0, Number(value)));
  media.currentTime = (pct / 100) * media.duration;
}

function wmpSetVolume(value) {
  const media = wmpMedia();
  if (!media) return;

  const level = Math.min(100, Math.max(0, Number(value))) / 100;
  media.volume = level;

  if (level > 0) {
    media.muted = false;
    wmpVolumeBeforeMute = level;
  } else {
    media.muted = true;
  }

  wmpSyncVolumeSlider();
}

document.addEventListener('DOMContentLoaded', initWmp);
