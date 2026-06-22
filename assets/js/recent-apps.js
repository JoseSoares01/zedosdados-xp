const RECENT_APPS = [
  { name: 'Adobe After Effects', domain: 'adobe.com', url: 'https://www.adobe.com/products/aftereffects.html' },
  { name: 'Adobe Illustrator', domain: 'adobe.com', url: 'https://www.adobe.com/products/illustrator.html' },
  { name: 'Adobe InDesign', domain: 'adobe.com', url: 'https://www.adobe.com/products/indesign.html' },
  { name: 'Adobe Photoshop', domain: 'adobe.com', url: 'https://www.adobe.com/products/photoshop.html' },
  { name: 'Adobe Premiere Pro', domain: 'adobe.com', url: 'https://www.adobe.com/products/premiere.html' },
  { name: 'Blender', domain: 'blender.org', url: 'https://www.blender.org' },
  { name: 'ChatGPT', domain: 'openai.com', url: 'https://chat.openai.com' },
  { name: 'Claude', domain: 'anthropic.com', url: 'https://claude.ai' },
  { name: 'Cursor', domain: 'cursor.com', url: 'https://cursor.com' },
  { name: 'Davinci Resolve', domain: 'blackmagicdesign.com', url: 'https://www.blackmagicdesign.com/products/davinciresolve' },
  { name: 'Docker', domain: 'docker.com', url: 'https://www.docker.com' },
  { name: 'Git', domain: 'git-scm.com', url: 'https://git-scm.com' },
  { name: 'GitHub CoPilot', domain: 'github.com', url: 'https://github.com/features/copilot' },
  { name: 'OBS Studio', domain: 'obsproject.com', url: 'https://obsproject.com' },
  { name: 'VS Code', domain: 'code.visualstudio.com', url: 'https://code.visualstudio.com' },
  { name: 'Wordpress', domain: 'wordpress.org', url: 'https://wordpress.org' }
];

function renderRecentApps() {
  const panel = document.getElementById('start-menu-recent-panel');
  if (!panel) return;

  panel.innerHTML = RECENT_APPS.map(app => `
    <a class="xp-recent-item" href="${app.url}" target="_blank" rel="noopener"
      onclick="event.stopPropagation()">
      <img src="https://www.google.com/s2/favicons?domain=${app.domain}&sz=32" alt="" width="16" height="16">
      <span>${app.name}</span>
    </a>
  `).join('');
}
