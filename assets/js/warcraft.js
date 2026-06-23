const WC_CLICK_SOUND = 'assets/warcraft-menu-master/click.ogg';

let wcClickAudio = null;

function getWarcraftClickAudio() {
  if (!wcClickAudio) {
    wcClickAudio = new Audio(WC_CLICK_SOUND);
    wcClickAudio.preload = 'auto';
  }
  return wcClickAudio;
}

function playWarcraftClick() {
  const audio = getWarcraftClickAudio();
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

function handleWarcraftItemAction(item) {
  playWarcraftClick();

  if (item.dataset.action === 'quit') {
    closeWindow('window-warcraft');
  }
}

function bindWarcraftItem(item) {
  item.addEventListener('click', (e) => {
    e.stopPropagation();
    handleWarcraftItemAction(item);
  });

  item.addEventListener('touchend', (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleWarcraftItemAction(item);
  }, { passive: false });
}

function restartWarcraftAnimations() {
  const stack = document.getElementById('wc-menu-stack');
  if (!stack) return;

  stack.classList.remove('wc-animate');
  stack.querySelectorAll('.wc-item').forEach((item) => {
    item.style.animation = 'none';
    item.style.opacity = '0';
  });

  void stack.offsetWidth;

  stack.classList.add('wc-animate');
  stack.querySelectorAll('.wc-item').forEach((item) => {
    item.style.animation = '';
    item.style.opacity = '';
  });
}

function initWarcraftMenu() {
  const root = document.getElementById('wc-main');
  if (!root) return;

  if (root.dataset.initialized !== 'true') {
    root.dataset.initialized = 'true';
    root.querySelectorAll('.wc-item').forEach(bindWarcraftItem);
  }

  requestAnimationFrame(() => {
    restartWarcraftAnimations();

    setTimeout(() => {
      root.querySelectorAll('.wc-item').forEach((item) => {
        if (parseFloat(getComputedStyle(item).opacity) < 0.1) {
          item.style.opacity = '1';
        }
      });
    }, 1600);
  });
}
