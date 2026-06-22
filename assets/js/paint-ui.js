const PAINT_PALETTE = [
  '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
  '#808040', '#004040', '#0080FF', '#004080', '#4000FF', '#804000',
  '#FFFFFF', '#C0C0C0', '#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF',
  '#FFFF80', '#00FF80', '#80FFFF', '#8080FF', '#FF8000', '#FF8080'
];

const PAINT_TOOLS = [
  { id: 'freeform', title: 'Free-Form Select', svg: '<path d="M2 3l2 1 1 3 2-1 1 2 3 1-1 2 2 2-2 1 1 3-2 0-1 3-3-1-2 2-2-1-1-3-2 1-2-2z" fill="#fff" stroke="#000"/>' },
  { id: 'rect-select', title: 'Select', svg: '<rect x="3" y="3" width="10" height="10" fill="none" stroke="#000" stroke-dasharray="2 1"/>' },
  { id: 'eraser', title: 'Eraser', svg: '<path d="M3 9l4-4 6 6-4 4H3z" fill="#f5c6cb" stroke="#000"/><path d="M2 12h8" stroke="#000"/>' },
  { id: 'fill', title: 'Fill With Color', svg: '<path d="M8 2l-1 6h2L8 2zm-4 7h8l-1 5H5l-1-5z" fill="#36f" stroke="#000"/><rect x="11" y="11" width="3" height="3" fill="#f00"/>' },
  { id: 'pick-color', title: 'Pick Color', svg: '<path d="M12 2L6 8l1 5 5-1 6-6-6-6z" fill="#ff9" stroke="#000"/><circle cx="4" cy="12" r="2" fill="#0f0" stroke="#000"/>' },
  { id: 'magnifier', title: 'Magnifier', svg: '<circle cx="7" cy="7" r="4" fill="#cff" stroke="#000"/><line x1="10" y1="10" x2="14" y2="14" stroke="#000" stroke-width="2"/>' },
  { id: 'pencil', title: 'Pencil', svg: '<path d="M2 13l2-1 9-9 2 2-9 9-1 2z" fill="#ff9" stroke="#000"/><line x1="9" y1="5" x2="11" y2="7" stroke="#000"/>' },
  { id: 'brush', title: 'Brush', svg: '<path d="M3 12s2 1 4-1l5-5-1-1-5 5c-2 2-3 2-3 2z" fill="#630" stroke="#000"/><path d="M2 14c1-1 2-1 2-1" stroke="#000" stroke-width="2"/>' },
  { id: 'airbrush', title: 'Airbrush', svg: '<rect x="2" y="8" width="8" height="4" fill="#ccc" stroke="#000"/><path d="M10 9h3M10 11h3" stroke="#000"/><circle cx="13" cy="8" r="1" fill="#666"/><circle cx="14" cy="11" r="1" fill="#666"/>' },
  { id: 'text', title: 'Text', svg: '<text x="4" y="13" font-size="12" font-family="serif" font-weight="bold" fill="#000">A</text>' },
  { id: 'line', title: 'Line', svg: '<line x1="3" y1="13" x2="13" y2="3" stroke="#000" stroke-width="2"/>' },
  { id: 'curve', title: 'Curve', svg: '<path d="M3 12 Q8 2 13 12" fill="none" stroke="#000" stroke-width="2"/>' },
  { id: 'rectangle', title: 'Rectangle', svg: '<rect x="3" y="4" width="10" height="8" fill="none" stroke="#000" stroke-width="2"/>' },
  { id: 'polygon', title: 'Polygon', svg: '<polygon points="8,2 13,7 11,13 5,13 3,7" fill="none" stroke="#000" stroke-width="1.5"/>' },
  { id: 'ellipse', title: 'Ellipse', svg: '<ellipse cx="8" cy="8" rx="6" ry="5" fill="none" stroke="#000" stroke-width="2"/>' },
  { id: 'rounded-rect', title: 'Rounded Rectangle', svg: '<rect x="3" y="4" width="10" height="8" rx="2" fill="none" stroke="#000" stroke-width="2"/>' }
];

function renderPaintUI() {
  const toolsGrid = document.getElementById('paint-tools-grid');
  const colorsGrid = document.getElementById('paint-colors-grid');
  if (!toolsGrid || !colorsGrid) return;

  toolsGrid.innerHTML = PAINT_TOOLS.map((tool, i) => `
    <button type="button" class="xp-paint-tool-btn${tool.id === 'pencil' ? ' active' : ''}"
      id="tool-${tool.id}" title="${tool.title}" onclick="selectPaintTool('${tool.id}')">
      <svg class="xp-paint-tool-icon" viewBox="0 0 16 16" aria-hidden="true">${tool.svg}</svg>
    </button>
  `).join('');

  colorsGrid.innerHTML = PAINT_PALETTE.map(hex => `
    <button type="button" class="xp-paint-color-box" style="background-color:${hex}"
      title="${hex}" onclick="selectPaintColor('${hex}', false, event)"
      oncontextmenu="selectPaintColor('${hex}', true, event); return false;"></button>
  `).join('');

  updatePaintColorPreview();
}
