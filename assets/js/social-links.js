const SOCIAL_LINKS = {
  github: {
    url: 'https://github.com/JoseSoares01',
    displayName: 'O meu Github',
    visitLabel: 'Visitar O meu Github',
    icon: 'assets/icons/Windows XP Icons/Github.png'
  },
  linkedin: {
    url: 'https://www.linkedin.com/in/janyel-rodrigues-1b998a190/',
    displayName: 'O meu LinkedIn',
    visitLabel: 'Visitar O meu LinkedIn',
    icon: 'assets/icons/Windows XP Icons/LinkedIn.png'
  },
  instagram: {
    url: 'https://www.instagram.com/',
    displayName: 'O meu Instagram',
    visitLabel: 'Visitar O meu Instagram',
    icon: 'assets/icons/Windows XP Icons/Instagram.png'
  }
};

let pendingSocialUrl = null;

function showOpenLinkDialog(platform) {
  const cfg = SOCIAL_LINKS[platform];
  if (!cfg) return;

  pendingSocialUrl = cfg.url;
  const dialog = document.getElementById('xp-open-link-dialog');
  const overlay = document.getElementById('xp-open-link-overlay');
  if (!dialog || !overlay) return;

  const titleIcon = document.getElementById('open-link-title-icon');
  const bigIcon = document.getElementById('open-link-big-icon');
  const nameEl = document.getElementById('open-link-name');
  const visitBtn = document.getElementById('open-link-visit-btn');

  if (titleIcon) titleIcon.src = cfg.icon;
  if (bigIcon) bigIcon.src = cfg.icon;
  if (nameEl) nameEl.textContent = cfg.displayName;
  if (visitBtn) visitBtn.textContent = cfg.visitLabel;

  overlay.classList.add('visible');
  dialog.classList.add('visible');
  dialog.setAttribute('aria-hidden', 'false');
  visitBtn?.focus();

  if (typeof closeStartMenu === 'function') closeStartMenu();
}

function closeOpenLinkDialog() {
  pendingSocialUrl = null;
  document.getElementById('xp-open-link-overlay')?.classList.remove('visible');
  const dialog = document.getElementById('xp-open-link-dialog');
  dialog?.classList.remove('visible');
  dialog?.setAttribute('aria-hidden', 'true');
}

function visitPendingSocialLink() {
  if (pendingSocialUrl) window.open(pendingSocialUrl, '_blank', 'noopener');
  closeOpenLinkDialog();
}

function confirmSocialLink(platform, event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  showOpenLinkDialog(platform);
  return false;
}

function initSocialLinkDialogs() {
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-social]');
    if (!el) return;
    e.preventDefault();
    e.stopPropagation();
    showOpenLinkDialog(el.dataset.social);
  });

  document.getElementById('xp-open-link-overlay')?.addEventListener('click', closeOpenLinkDialog);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.getElementById('xp-open-link-dialog')?.classList.contains('visible')) {
      closeOpenLinkDialog();
    }
  });
}
