import * as common from '../common.js';

const GUI = document.querySelector('gui-control');
const storageKey = 'broadwayboogie';
const svg = document.getElementById('svg');

GUI.addRange('Grid', 40, '', { min: 5, max: 100, name: 'gridsize' });

GUI.addSelect('Palette', 'Mondrian', '', { 
  options: [
		{ key: 'Mondrian', value: '#E8CD26 #9F3E37 #2B337E #E0E2DF #4E69CA' },
    { key: 'Bauhaus Originals', value: '#e47a2c #baccc0 #6c958f #40363f #d7a26c #ae4935 #f7e6d4' }, 
    { key: 'Weimar Heritage', value: '#4f507d #aba59f #eba027 #1f1c16 #998a74 #e2471f #56704a #e2805f' },
    { key: 'Modernist Spectrum', value: '#D32F2F #1976D2 #FFC107 #388E3C #F57C00 #7B1FA2 #455A64 #FBC02D' },
    { key: 'Classic Bauhaus Tones', value: '#A63334 #3E5F8A #F2BF7C #7D807D #E7A95E #4C4B40 #83988E #D9C9A5' },
    { key: 'Dusty Weimar Shades', value: '#8D5A4A #526A82 #C4A981 #6A706E #B5803A #635D52 #A4B3A2 #CFC1A4' },
    { key: 'Industrial Grays', value: '#6B6E70 #4B4F52 #919497 #2D2E30 #A6A8AB #3A3C3F #C1C3C5 #787A7C' },
		{ key: 'Muted Blue', value: '#4A637D #6E8499 #98A9B5 #2F4A66 #5B7490 #7D92A6 #A3B3C0 #3E5C7A' },
    { key: 'Muted Terracotta', value: '#A2543A #B67F5E #D2A98A #8F6C5A #E8C3A6 #704B3E #C0876C #5A3D31' },
    { key: 'Autumn Modernism', value: '#7F4E2A #9B7042 #C49973 #5D6A5B #A77A4A #8C5B39 #B89675 #6E553C' },
    { key: 'Vintage Pastels', value: '#9A7F6B #A99488 #D1B5AC #82746E #B2A196 #C7B8AE #E3D4CD #746258' },
    { key: 'Olive & Ochre', value: '#5D5B39 #75744A #B3B077 #8A8558 #A39F6E #6E6C4D #D2CE98 #8F8D64' },
  ], 
  name: 'palette'
});

common.commonConfig(GUI, '#F0F1EC');
GUI.addEventListener('gui-input', (event) => common.handleGuiEvent(event, svg, GUI, storageKey, broadwayBoogie));
common.init(GUI, storageKey, []);

function broadwayBoogie(svg, controls) {
  const { width, height } = common.getViewBox(svg);
  const gridsize = controls.gridsize.valueAsNumber;
  const colors = controls.palette.value.split(/\s+/);
  const cellWidth = width / gridsize;
  const cellHeight = height / gridsize;

  function pickColor() {
    const rand = Math.random();
    if (rand < 0.7) return colors[0];

    if (rand < 0.9) {
      const nextCount = Math.min(3, colors.length - 1);
      if (nextCount > 0) {
        const share = 0.2 / nextCount;
        let threshold = 0.7;
        for (let i = 1; i <= nextCount; i++) {
          threshold += share;
          if (rand < threshold) return colors[i];
        }
      }
    }

    return colors.length > 4 ? 
      colors[4 + Math.floor(Math.random() * (colors.length - 4))] : 
      colors[Math.floor(Math.random() * colors.length)];
  }

  const grid = Array.from({length: gridsize}, () => 
    Array.from({length: gridsize}, () => ({ type: 'empty', color: null }))
  );

  for (let y = 0; y < gridsize; y += Math.floor(gridsize / 10) || 1) {
    if (Math.random() < 0.9) {
      const lineColor = pickColor();
      for (let x = 0; x < gridsize; x++) {
        if (grid[y][x].type === 'empty' && Math.random() < 0.9) {
          grid[y][x] = { type: 'line', color: lineColor };
        }
      }
    }
  }

  for (let x = 0; x < gridsize; x += Math.floor(gridsize / 10) || 1) {
    if (Math.random() < 0.9) {
      const lineColor = pickColor();
      for (let y = 0; y < gridsize; y++) {
        if (grid[y][x].type === 'empty' && Math.random() < 0.9) {
          grid[y][x] = { type: 'line', color: lineColor };
        }
      }
    }
  }

  const numBlocks = Math.floor(gridsize * gridsize * 0.04);
  for (let i = 0; i < numBlocks; i++) {
    const bw = Math.floor(Math.random() * 3) + 1;
    const bh = Math.floor(Math.random() * 3) + 1;
    const startX = Math.floor(Math.random() * (gridsize - bw));
    const startY = Math.floor(Math.random() * (gridsize - bh));
    
    const blockColor = pickColor();
    const hasCenter = bw > 1 && bh > 1 && Math.random() < 0.4;
    let centerColor = blockColor;

    if (hasCenter && colors.length > 1) {
      let attempts = 0;
      while (centerColor === blockColor && attempts++ < 5) {
        centerColor = pickColor();
      }
    }

    for (let y = startY; y < startY + bh; y++) {
      for (let x = startX; x < startX + bw; x++) {
        grid[y][x] = { 
          type: 'block', 
          color: (hasCenter && x > startX && x < startX + bw - 1 && 
                 y > startY && y < startY + bh - 1) ? centerColor : blockColor 
        };
      }
    }
  }

  const elements = [];
  for (let y = 0; y < gridsize; y++) {
    for (let x = 0; x < gridsize; x++) {
      const cell = grid[y][x];
      if (cell.type !== 'empty' && cell.color) {
        elements.push(`<rect x="${x * cellWidth}" y="${y * cellHeight}" width="${cellWidth}" height="${cellHeight}" fill="${cell.color}" />`);
      }
    }
  }

  const gridLines = [];
  for (let i = 0; i <= gridsize; i++) {
    gridLines.push(`<line x1="0" y1="${i * cellHeight}" x2="${width}" y2="${i * cellHeight}" />`);
    gridLines.push(`<line x1="${i * cellWidth}" y1="0" x2="${i * cellWidth}" y2="${height}" />`);
  }

  svg.innerHTML = `<g>${elements.join('\n')}${gridLines.join('\n')}</g>`;
}
