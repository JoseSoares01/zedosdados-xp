// MitchIvin XP - Lógica do Aplicativo e Mecanismo do Paint

// Estado de arrastar janela
let draggingWindow = null;
let dragStartX = 0;
let dragStartY = 0;
let windowStartX = 0;
let windowStartY = 0;

// Estado de desenho do aplicativo Paint
let paintCanvas = null;
let paintCtx = null;
let isDrawing = false;
let paintTool = 'pencil'; // lápis (pencil), pincel (brush), borracha (eraser)
let paintColor = '#000000';
let paintSize = 1;
let lastX = 0;
let lastY = 0;

// Inicializa quando o DOM estiver carregado
window.addEventListener('DOMContentLoaded', () => {
  // Login mobile + bloqueio de acesso
  initMobileLogin();

  // Inicia o relógio
  updateClock();
  setInterval(updateClock, 1000);

  // Inicializa os manipuladores da barra de tarefas
  updateTaskbarHandles();

  // Inicializa o aplicativo Paint no Canvas
  initPaint();

  // Inicializa os comportamentos de passar o mouse/clicar no Menu Iniciar
  initStartMenuInteraction();

  // Adiciona um listener de clique no desktop para limpar seleções/menus
  document.getElementById('desktop').addEventListener('click', (e) => {
    // 1. Fecha o Menu Iniciar ao clicar fora dele
    const startMenu = document.getElementById('start-menu');
    const startBtn = document.querySelector('.xp-start-btn');
    if (startMenu.style.display === 'flex' && !startMenu.contains(e.target) && !startBtn.contains(e.target)) {
      startMenu.style.display = 'none';
      if (startBtn) startBtn.classList.remove('active');
    }

    // 2. Limpa a seleção do ícone ao clicar no plano de fundo do desktop
    if (e.target.id === 'desktop' || e.target.classList.contains('xp-desktop-icons')) {
      clearIconSelections();
    }
  });

  // Associa ouvintes globais de mousemove e mouseup para arrastar janelas
  document.addEventListener('mousemove', dragMove);
  document.addEventListener('mouseup', dragEnd);
});

// Atualiza o relógio do sistema na bandeja da barra de tarefas
function updateClock() {
  const clockEl = document.getElementById('system-time');
  if (!clockEl) return;
  
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  
  clockEl.textContent = `${hours}:${minutes}`;
}

// Manipuladores de seleção de ícones
function selectIcon(element, event) {
  event.stopPropagation(); // Impede que o ouvinte de clique do desktop desmarque imediatamente
  clearIconSelections();
  element.classList.add('selected');
}

function clearIconSelections() {
  document.querySelectorAll('.xp-desktop-icon').forEach(icon => {
    icon.classList.remove('selected');
  });
}

// Gerenciamento de janelas: Abrir
function openWindow(id) {
  const win = document.getElementById(id);
  if (!win) return;
  
  win.style.display = 'flex';
  focusWindow(id);
  updateTaskbarHandles();
}

// Gerenciamento de janelas: Foco (trazer para a frente)
function focusWindow(id) {
  // Remove a classe ativa de todas as janelas
  document.querySelectorAll('.xp-window').forEach(w => {
    w.classList.remove('active');
  });
  
  // Adiciona a classe ativa a esta janela
  const win = document.getElementById(id);
  if (win) {
    win.classList.add('active');
  }
  
  // Fecha o menu iniciar
  const startMenu = document.getElementById('start-menu');
  if (startMenu) startMenu.style.display = 'none';
  const startBtn = document.querySelector('.xp-start-btn');
  if (startBtn) startBtn.classList.remove('active');

  updateTaskbarHandles();
}

// Gerenciamento de janelas: Fechar
function closeWindow(id) {
  const win = document.getElementById(id);
  if (!win) return;

  if (win.classList.contains('maximized')) {
    win.classList.remove('maximized');
    win.style.width = win.dataset.prevWidth || win.style.width;
    win.style.height = win.dataset.prevHeight || 'auto';
    win.style.left = win.dataset.prevLeft || win.style.left;
    win.style.top = win.dataset.prevTop || win.style.top;
    const maxBtnIcon = win.querySelector('.maximize-btn .xp-window-control-icon');
    if (maxBtnIcon) maxBtnIcon.src = 'icons/Windows XP Icons/Maximize.png';
  }

  win.style.display = 'none';
  updateTaskbarHandles();
}

// Gerenciamento de janelas: Minimizar (alternar exibição)
function minimizeWindow(id) {
  const win = document.getElementById(id);
  if (!win) return;
  win.style.display = 'none';
  updateTaskbarHandles();
}

// Gerenciamento de janelas: Alternar maximização
function maximizeWindow(id) {
  const win = document.getElementById(id);
  if (!win) return;

  const maxBtnIcon = win.querySelector('.maximize-btn .xp-window-control-icon');
  const isMaximized = win.classList.contains('maximized');

  if (isMaximized) {
    win.classList.remove('maximized');
    win.style.width = win.dataset.prevWidth || '500px';
    win.style.height = win.dataset.prevHeight || 'auto';
    win.style.left = win.dataset.prevLeft || '100px';
    win.style.top = win.dataset.prevTop || '100px';
    if (maxBtnIcon) maxBtnIcon.src = 'icons/Windows XP Icons/Maximize.png';
  } else {
    win.dataset.prevWidth = win.style.width;
    win.dataset.prevHeight = win.style.height;
    win.dataset.prevLeft = win.style.left;
    win.dataset.prevTop = win.style.top;

    win.classList.add('maximized');
    win.style.width = '100vw';
    win.style.height = 'calc(100vh - 40px)';
    win.style.left = '0px';
    win.style.top = '0px';
    if (maxBtnIcon) maxBtnIcon.src = 'icons/Windows XP Icons/Restore.png';
  }

  focusWindow(id);
}

// Manipuladores para arrastar janelas
function dragStart(e, id) {
  // Traz a janela para a frente
  focusWindow(id);
  
  const win = document.getElementById(id);
  if (!win || win.classList.contains('maximized')) return; // Não arrasta janelas maximizadas

  // Impede o início do arrasto ao clicar nos botões de controle da janela
  if (e.target.classList.contains('xp-window-control-btn')) return;

  draggingWindow = win;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  
  // Analisa os valores de left/top (padrão é 0 se não estiver definido)
  windowStartX = parseInt(win.style.left) || 0;
  windowStartY = parseInt(win.style.top) || 0;
  
  e.preventDefault();
}

function dragMove(e) {
  if (!draggingWindow) return;
  
  const deltaX = e.clientX - dragStartX;
  const deltaY = e.clientY - dragStartY;
  
  // Calcula as novas coordenadas
  let newX = windowStartX + deltaX;
  let newY = windowStartY + deltaY;

  // Mantém os títulos das janelas legíveis e parcialmente limitados ao desktop
  const desktopWidth = window.innerWidth;
  const desktopHeight = window.innerHeight;
  
  if (newY < 0) newY = 0; // Não deixa a barra de título sumir sob o cabeçalho do navegador
  if (newY > desktopHeight - 60) newY = desktopHeight - 60;
  if (newX < -200) newX = -200;
  if (newX > desktopWidth - 100) newX = desktopWidth - 100;

  draggingWindow.style.left = `${newX}px`;
  draggingWindow.style.top = `${newY}px`;
}

function dragEnd() {
  draggingWindow = null;
}

// Redefine as posições das janelas para um layout em cascata limpo
function resetWindowPositions() {
  const windows = [
    { id: 'window-overview', left: '60px', top: '40px', width: '620px' },
    { id: 'window-colors', left: '100px', top: '80px', width: '680px' },
    { id: 'window-typography', left: '140px', top: '120px', width: '660px' },
    { id: 'window-paint', left: '80px', top: '60px', width: '620px' },
    { id: 'window-components', left: '180px', top: '160px', width: '700px' },
    { id: 'window-layout', left: '220px', top: '200px', width: '640px' },
    { id: 'window-depth', left: '260px', top: '240px', width: '620px' },
    { id: 'window-dos', left: '300px', top: '280px', width: '680px' },
    { id: 'window-responsive', left: '340px', top: '320px', width: '660px' }
  ];

  windows.forEach((cfg) => {
    const win = document.getElementById(cfg.id);
    if (win) {
      win.style.left = cfg.left;
      win.style.top = cfg.top;
      win.style.width = cfg.width;
      win.style.height = 'auto';
    }
  });

  const startMenu = document.getElementById('start-menu');
  if (startMenu) startMenu.style.display = 'none';
  const startBtn = document.querySelector('.xp-start-btn');
  if (startBtn) startBtn.classList.remove('active');
}

// Alterna a exibição do pop-up do Menu Iniciar
function toggleStartMenu() {
  const startMenu = document.getElementById('start-menu');
  const startBtn = document.querySelector('.xp-start-btn');
  if (!startMenu) return;
  
  if (startMenu.style.display === 'flex') {
    startMenu.style.display = 'none';
    if (startBtn) startBtn.classList.remove('active');
  } else {
    // Redefine para a visualização padrão do lado direito sempre que abrir
    const allProgramsBtn = document.getElementById('all-programs-btn');
    const defaultRight = document.getElementById('start-menu-right-default');
    const programsPanel = document.getElementById('start-menu-programs-panel');
    if (allProgramsBtn && defaultRight && programsPanel) {
      programsPanel.style.display = 'none';
      defaultRight.style.display = 'flex';
      allProgramsBtn.classList.remove('active');
    }
    startMenu.style.display = 'flex';
    if (startBtn) startBtn.classList.add('active');
  }
}

// Inicializa as interações de clique/hover do Menu Iniciar
function initStartMenuInteraction() {
  const allProgramsBtn = document.getElementById('all-programs-btn');
  const startMenu = document.getElementById('start-menu');
  const defaultRight = document.getElementById('start-menu-right-default');
  const programsPanel = document.getElementById('start-menu-programs-panel');
  const leftItems = document.querySelectorAll('.xp-start-menu-left .xp-start-menu-item');

  if (!allProgramsBtn || !startMenu || !defaultRight || !programsPanel) return;

  function showPrograms() {
    programsPanel.style.display = 'flex';
    defaultRight.style.display = 'none';
    allProgramsBtn.classList.add('active');
  }

  function hidePrograms() {
    programsPanel.style.display = 'none';
    defaultRight.style.display = 'flex';
    allProgramsBtn.classList.remove('active');
  }

  // Passar o mouse no botão Todos os Programas abre o sub-menu
  allProgramsBtn.addEventListener('mouseenter', showPrograms);
  // Clicar no botão Todos os Programas alterna/abre o sub-menu
  allProgramsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showPrograms();
  });

  // Passar o mouse em qualquer item regular da coluna esquerda restaura a visualização padrão
  leftItems.forEach(item => {
    item.addEventListener('mouseenter', hidePrograms);
  });

  // Sair completamente do menu iniciar restaura a visualização padrão
  startMenu.addEventListener('mouseleave', hidePrograms);
}

// Atualiza os manipuladores na barra de tarefas para representar janelas visíveis
function updateTaskbarHandles() {
  const container = document.getElementById('taskbar-handles');
  if (!container) return;
  
  container.innerHTML = '';
  
  // Mapeia os IDs das janelas para seus nomes na barra de tarefas
  const winNames = {
    'window-about': 'Sobre Mim',
    'window-ie': 'Meus Projetos',
    'window-overview': 'Visão Geral',
    'window-colors': 'Cores',
    'window-typography': 'Tipografia',
    'window-paint': 'Paint',
    'window-components': 'Componentes',
    'window-layout': 'Grade de Layout',
    'window-depth': 'Elevação',
    'window-dos': 'Fazer / Não Fazer',
    'window-responsive': 'Simulador Vídeo'
  };

  // Mapeia os IDs das janelas para seus respectivos ícones na barra de tarefas
  const winIcons = {
    'window-about': 'icons/Windows XP Icons/HTML.png',
    'window-ie': 'icons/Windows XP Icons/Internet Explorer 6.png',
    'window-overview': 'icons/Windows XP Icons/My Computer.png',
    'window-colors': 'icons/Windows XP Icons/Color Profile.png',
    'window-typography': 'icons/Windows XP Icons/Fonts.png',
    'window-paint': 'icons/Windows XP Icons/Paint.png',
    'window-components': 'icons/Windows XP Icons/Control Panel.png',
    'window-layout': 'icons/Windows XP Icons/Tweak UI.png',
    'window-depth': 'janyel/curriculo-pdf.png',
    'window-dos': 'icons/Windows XP Icons/Checklist.png',
    'window-responsive': 'icons/Windows XP Icons/Display Properties.png'
  };

  document.querySelectorAll('.xp-window').forEach(win => {
    // Só mostra o manipulador se a janela NÃO estiver fechada (ou seja, display diferente de 'none')
    if (win.style.display !== 'none') {
      const id = win.id;
      const isActive = win.classList.contains('active');
      
      const handle = document.createElement('div');
      handle.className = `xp-taskbar-item ${isActive ? 'active' : ''}`;
      
      // Carrega o ícone PNG autêntico do aplicativo
      handle.innerHTML = `
        <img src="${winIcons[id] || 'icons/Windows XP Icons/Default.png'}" style="width: 16px; height: 16px; margin-right: 4px; flex-shrink: 0;">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${winNames[id] || id}</span>
      `;
      
      handle.onclick = () => {
        if (isActive) {
          minimizeWindow(id);
        } else {
          openWindow(id);
        }
      };
      
      container.appendChild(handle);
    }
  });
}

// Lógica de atualização do testador de tipografia ao vivo
function updateTypoPreview(val) {
  if (!val) val = ' ';
  document.getElementById('preview-ms').textContent = val;
  document.getElementById('preview-tahoma').textContent = val;
  document.getElementById('preview-arial').textContent = val;
}

// Auxiliar para copiar o valor do token de cor
function copyColor(hex) {
  navigator.clipboard.writeText(hex).then(() => {
    showNotification(`Valor HEX ${hex} copiado com sucesso para a área de transferência!`);
  }).catch(() => {
    alert(`HEX value: ${hex}`);
  });
}

// Mostra um balão de notificação clássico do XP a partir do ícone da bandeja
function showNotification(msg) {
  closeWelcomeBalloon(false);

  const desktop = document.getElementById('desktop');
  if (!desktop) return;

  const balloon = document.createElement('div');
  balloon.id = 'xp-balloon';
  balloon.className = 'xp-balloon';
  balloon.innerHTML = `
    <div class="xp-balloon-header">
      <div class="xp-balloon-header-title">
        <img class="xp-balloon-header-icon" src="icons/Windows XP Icons/Information.png" alt="">
        <span>Área de Transferência</span>
      </div>
      <button class="xp-balloon-close" type="button" onclick="closeWelcomeBalloon()" aria-label="Fechar">×</button>
    </div>
    <div class="xp-balloon-content">
      <img class="xp-balloon-icon" src="icons/Windows XP Icons/Information.png" alt="">
      <div class="xp-balloon-body">${msg}</div>
    </div>
  `;

  desktop.appendChild(balloon);
  positionWelcomeBalloon();
  requestAnimationFrame(() => balloon.classList.add('visible'));

  setTimeout(() => closeWelcomeBalloon(), 5000);
}

// Alternar abas dentro da janela de demonstração de componentes
function switchComponentTab(el, tabId) {
  // Desativa todos os links na barra de navegação
  el.parentNode.querySelectorAll('.xp-nav-link').forEach(link => {
    link.classList.remove('active');
  });
  
  // Ativa o link clicado
  el.classList.add('active');
  
  // Oculta todos os painéis de abas
  document.querySelectorAll('.component-tab-content').forEach(panel => {
    panel.style.display = 'none';
  });
  
  // Mostra o painel de aba correspondente
  document.getElementById(tabId).style.display = 'block';
}

// Simulador de viewport para o Playground Responsivo
function setSimulatedWidth(width) {
  const container = document.getElementById('simulated-viewport');
  if (!container) return;
  
  container.style.width = width;
  
  // Modifica as classes das colunas na visualização se a largura simulada for móvel
  const leftCol = document.getElementById('simulated-col-left');
  const rightCol = document.getElementById('simulated-col-right');
  const btn = document.getElementById('simulated-btn');

  if (width === '420px') {
    leftCol.style.gridColumn = 'span 12';
    rightCol.style.gridColumn = 'span 12';
    btn.style.width = '100%';
    btn.style.height = '44px'; // Altura mínima do alvo de toque no celular
  } else {
    leftCol.style.gridColumn = 'span 8';
    rightCol.style.gridColumn = 'span 4';
    btn.style.width = '94px'; // Largura padrão no desktop
    btn.style.height = '30px'; // Altura padrão no desktop
  }
}

// ==========================================
//          MECANISMO DO CANVAS DO MS PAINT
// ==========================================

function initPaint() {
  paintCanvas = document.getElementById('paint-canvas');
  if (!paintCanvas) return;
  
  paintCtx = paintCanvas.getContext('2d');
  
  // Configura o formato das pontas do pincel
  paintCtx.lineCap = 'round';
  paintCtx.lineJoin = 'round';
  
  // Preenche inicialmente a tela com branco
  clearCanvas();
  
  // Ouvintes para desenhar com mouse
  paintCanvas.addEventListener('mousedown', startDrawing);
  paintCanvas.addEventListener('mousemove', draw);
  paintCanvas.addEventListener('mouseup', stopDrawing);
  paintCanvas.addEventListener('mouseleave', stopDrawing);
  
  // Suporte a toque para dispositivos móveis
  paintCanvas.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    const rect = paintCanvas.getBoundingClientRect();
    const mouseEvent = new MouseEvent('mousedown', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    paintCanvas.dispatchEvent(mouseEvent);
  }, { passive: true });

  paintCanvas.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const rect = paintCanvas.getBoundingClientRect();
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    paintCanvas.dispatchEvent(mouseEvent);
  }, { passive: true });

  paintCanvas.addEventListener('touchend', () => {
    const mouseEvent = new MouseEvent('mouseup', {});
    paintCanvas.dispatchEvent(mouseEvent);
  }, { passive: true });
}

function startDrawing(e) {
  isDrawing = true;
  
  // Obtém o deslocamento das coordenadas com base no retângulo do canvas
  const rect = paintCanvas.getBoundingClientRect();
  lastX = e.clientX - rect.left;
  lastY = e.clientY - rect.top;
  
  // Desenha um ponto imediatamente após o clique
  draw(e);
}

function draw(e) {
  if (!isDrawing) return;
  
  const rect = paintCanvas.getBoundingClientRect();
  const currentX = e.clientX - rect.left;
  const currentY = e.clientY - rect.top;
  
  paintCtx.beginPath();
  paintCtx.moveTo(lastX, lastY);
  paintCtx.lineTo(currentX, currentY);
  
  // Configura cores e tamanhos de traço de acordo com a ferramenta ativa
  if (paintTool === 'eraser') {
    paintCtx.strokeStyle = '#FFFFFF';
    paintCtx.lineWidth = 15; // Tamanho fixo da borracha
  } else {
    paintCtx.strokeStyle = paintColor;
    paintCtx.lineWidth = paintTool === 'pencil' ? 1.5 : paintSize;
  }
  
  paintCtx.stroke();
  
  lastX = currentX;
  lastY = currentY;
}

function stopDrawing() {
  isDrawing = false;
}

// Seleção de ferramenta
function selectPaintTool(tool) {
  paintTool = tool;
  
  // Atualiza classe ativa da barra de ferramentas
  document.querySelectorAll('.xp-paint-tool-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  const activeBtn = document.getElementById(`tool-${tool}`);
  if (activeBtn) activeBtn.classList.add('active');
}

// Seleção de tamanho do pincel
function selectPaintSize(size, el) {
  paintSize = size;
  
  // Atualiza classe ativa do tamanho do pincel
  document.querySelectorAll('.xp-paint-size-option').forEach(opt => {
    opt.classList.remove('active');
  });
  
  el.classList.add('active');
}

// Seleção de cor
function selectPaintColor(hex) {
  paintColor = hex;
  document.getElementById('paint-color-preview').style.backgroundColor = hex;
}

// Limpa a área de desenho
function clearCanvas() {
  if (!paintCtx || !paintCanvas) return;
  paintCtx.fillStyle = '#FFFFFF';
  paintCtx.fillRect(0, 0, paintCanvas.width, paintCanvas.height);
}

// Internet Explorer — portfólio
function filterPortfolio(category, btn) {
  document.querySelectorAll('.portfolio-nav-item').forEach(item => {
    item.classList.remove('active');
  });
  if (btn) btn.classList.add('active');

  document.querySelectorAll('.portfolio-card').forEach(card => {
    const cats = (card.dataset.category || '').split(' ');
    const show = category === 'all' || cats.includes(category);
    card.classList.toggle('hidden', !show);
  });

  const status = document.getElementById('ie-statusbar');
  if (status) {
    status.textContent = category === 'all'
      ? 'Selecione um projeto para ver detalhes'
      : `Filtrando: ${btn ? btn.textContent.trim() : category}`;
  }
}

function selectPortfolioProject(card, name) {
  document.querySelectorAll('.portfolio-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  const status = document.getElementById('ie-statusbar');
  if (status) status.textContent = `Projeto selecionado: ${name}`;
}

function togglePortfolioTheme() {
  const site = document.getElementById('portfolio-site');
  if (site) site.classList.toggle('portfolio-light');
}

function ieNavigateHome(e) {
  if (e) e.preventDefault();
  filterPortfolio('all', document.querySelector('.portfolio-nav-item[data-filter="all"]'));
  document.querySelectorAll('.portfolio-card').forEach(c => c.classList.remove('selected'));
  const status = document.getElementById('ie-statusbar');
  if (status) status.textContent = 'Selecione um projeto para ver detalhes';
}

// Mobile — login, boas-vindas e acesso bloqueado
const MOBILE_BREAKPOINT = 639;

function isMobile() {
  return window.innerWidth <= MOBILE_BREAKPOINT;
}

function initMobileLogin() {
  const loginBtn = document.getElementById('xp-login-user-btn');
  if (loginBtn) loginBtn.addEventListener('click', startLogin);

  const loggedIn = sessionStorage.getItem('xp-logged-in') === 'true';
  const requireLogin = sessionStorage.getItem('xp-require-login') === 'true';

  if (loggedIn) {
    document.body.classList.add('xp-logged-in');
  } else if (isMobile() || requireLogin) {
    document.body.classList.remove('xp-logged-in');
  } else {
    document.body.classList.add('xp-logged-in');
    sessionStorage.setItem('xp-logged-in', 'true');
  }

  document.querySelectorAll('.xp-desktop-icon[data-window]').forEach(icon => {
    icon.addEventListener('click', (e) => {
      if (!isMobile()) return;
      const windowId = icon.dataset.window;
      if (windowId) {
        selectIcon(icon, e);
        openWindow(windowId);
      }
    });
  });

  window.addEventListener('resize', () => {
    if (!isMobile() && sessionStorage.getItem('xp-require-login') !== 'true') {
      if (sessionStorage.getItem('xp-logged-in') === 'true') {
        document.body.classList.add('xp-logged-in');
      }
    }
  });
}

function startLogin() {
  const login = document.getElementById('xp-login-screen');
  const welcome = document.getElementById('xp-welcome-screen');

  if (login) login.style.display = 'none';

  if (!welcome) {
    completeLogin();
    return;
  }

  welcome.classList.add('active');
  welcome.setAttribute('aria-hidden', 'false');

  setTimeout(() => {
    welcome.classList.add('fade-out');
    setTimeout(() => {
      welcome.classList.remove('active', 'fade-out');
      welcome.setAttribute('aria-hidden', 'true');
      completeLogin();
    }, 450);
  }, 1800);
}

function completeLogin() {
  document.body.classList.add('xp-logged-in');
  sessionStorage.setItem('xp-logged-in', 'true');
  sessionStorage.removeItem('xp-require-login');
  setTimeout(showWelcomeBalloon, 350);
}

function closeStartMenu() {
  const startMenu = document.getElementById('start-menu');
  const startBtn = document.querySelector('.xp-start-btn');
  if (startMenu) startMenu.style.display = 'none';
  if (startBtn) startBtn.classList.remove('active');
}

function showShutdownDialog() {
  closeStartMenu();
  document.body.classList.add('xp-power-active');
  document.getElementById('xp-power-overlay')?.classList.add('visible');
  document.getElementById('xp-shutdown-dialog')?.classList.add('visible');
  document.getElementById('xp-logoff-dialog')?.classList.remove('visible');
}

function showLogoffDialog() {
  closeStartMenu();
  document.body.classList.add('xp-power-active');
  document.getElementById('xp-power-overlay')?.classList.add('visible');
  document.getElementById('xp-logoff-dialog')?.classList.add('visible');
  document.getElementById('xp-shutdown-dialog')?.classList.remove('visible');
}

function closePowerDialog(immediate = false) {
  document.getElementById('xp-shutdown-dialog')?.classList.remove('visible');
  document.getElementById('xp-logoff-dialog')?.classList.remove('visible');

  const removeDim = () => {
    document.body.classList.remove('xp-power-active');
    document.getElementById('xp-power-overlay')?.classList.remove('visible');
  };

  if (immediate) {
    removeDim();
  } else {
    setTimeout(removeDim, 450);
  }
}

function performLogoff() {
  closePowerDialog(true);
  closeWelcomeBalloon(false);
  closeStartMenu();

  sessionStorage.removeItem('xp-logged-in');
  sessionStorage.setItem('xp-require-login', 'true');
  document.body.classList.remove('xp-logged-in');

  const login = document.getElementById('xp-login-screen');
  if (login) login.style.display = '';

  document.querySelectorAll('.xp-window').forEach(w => {
    w.style.display = 'none';
    if (w.classList.contains('maximized')) {
      w.classList.remove('maximized');
      const maxBtnIcon = w.querySelector('.maximize-btn .xp-window-control-icon');
      if (maxBtnIcon) maxBtnIcon.src = 'icons/Windows XP Icons/Maximize.png';
    }
  });
  updateTaskbarHandles();
}

function positionWelcomeBalloon() {
  const balloon = document.getElementById('xp-balloon');
  const trayBtn = document.getElementById('xp-tray-info-btn');
  const desktop = document.getElementById('desktop');
  if (!balloon || !trayBtn || !desktop) return;

  const dRect = desktop.getBoundingClientRect();
  const tRect = trayBtn.getBoundingClientRect();
  const tailOffset = 28;

  balloon.style.bottom = `${dRect.bottom - tRect.top + 4}px`;
  balloon.style.left = 'auto';

  const iconCenterFromRight = dRect.right - (tRect.left + tRect.width / 2);
  balloon.style.right = `${Math.max(8, iconCenterFromRight - tailOffset)}px`;
  balloon.style.setProperty('--balloon-tail-right', `${tailOffset}px`);

  requestAnimationFrame(() => {
    const bRect = balloon.getBoundingClientRect();
    const iconCenterX = tRect.left + tRect.width / 2;
    const tailX = bRect.right - tailOffset;
    const diff = iconCenterX - tailX;
    if (Math.abs(diff) > 2) {
      const currentRight = parseFloat(balloon.style.right) || 8;
      balloon.style.right = `${Math.max(8, currentRight - diff)}px`;
    }
  });
}

function closeWelcomeBalloon(animate = true) {
  const balloon = document.getElementById('xp-balloon');
  const trayBtn = document.getElementById('xp-tray-info-btn');
  if (trayBtn) trayBtn.classList.remove('active');
  if (!balloon) return;

  window.removeEventListener('resize', positionWelcomeBalloon);

  if (animate) {
    balloon.classList.remove('visible');
    setTimeout(() => balloon.remove(), 220);
  } else {
    balloon.remove();
  }
}

function toggleWelcomeBalloon() {
  const existing = document.getElementById('xp-balloon');
  if (existing && existing.classList.contains('visible')) {
    closeWelcomeBalloon();
    return;
  }
  showWelcomeBalloon();
}

function showWelcomeBalloon() {
  closeWelcomeBalloon(false);

  const desktop = document.getElementById('desktop');
  const trayBtn = document.getElementById('xp-tray-info-btn');
  if (!desktop) return;

  const balloon = document.createElement('div');
  balloon.id = 'xp-balloon';
  balloon.className = 'xp-balloon';
  balloon.innerHTML = `
    <div class="xp-balloon-header">
      <div class="xp-balloon-header-title">
        <img class="xp-balloon-header-icon" src="icons/Windows XP Icons/Information.png" alt="">
        <span>Bem-vindo ao MitchIvin XP</span>
      </div>
      <button class="xp-balloon-close" type="button" onclick="closeWelcomeBalloon()" aria-label="Fechar">×</button>
    </div>
    <div class="xp-balloon-content">
      <img class="xp-balloon-icon" src="icons/Windows XP Icons/Information.png" alt="">
      <div class="xp-balloon-body">
        Uma interface fiel ao XP, criada para mostrar o meu trabalho e atenção ao detalhe.
        <div class="xp-balloon-links">
          Começar:
          <a href="#" onclick="openWindow('window-about'); return false;">Sobre Mim</a> |
          <a href="#" onclick="openWindow('window-ie'); return false;">Meus Projetos</a>
        </div>
      </div>
    </div>
  `;
  desktop.appendChild(balloon);

  positionWelcomeBalloon();
  window.addEventListener('resize', positionWelcomeBalloon);

  requestAnimationFrame(() => {
    balloon.classList.add('visible');
    if (trayBtn) trayBtn.classList.add('active');
  });
}
