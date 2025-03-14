import * as common from '../common.js';
const GUI = document.querySelector('gui-control');
const storageKey = 'squares';
const svg = document.getElementById('svg');

GUI.addRange('Gridsize', 16, '', { min: 2, max: 32, step: 2, name: 'gridsize' });
GUI.addColor('Color 1', '#FFFFFF', '', { name: 'colorone' });
GUI.addColor('Color 2', '#000000', '', { name: 'colortwo' });
GUI.addRange('Square Size', 0.3, '', { min: 0, max: 2, step: 0.025, name: 'squaresize' });
GUI.addRange('Scale', 1, '', { min: 0, max: 2, step: 0.025, name: 'scale' });
common.commonConfig(GUI, '#FFFFFF');
GUI.addEventListener('gui-input', (event) => common.handleGuiEvent(event, svg, GUI, storageKey, squares));
common.init(GUI, storageKey, []);

/* === MAIN FUNCTION === */

function squares(svg, controls) {
  const { width, height } = common.getViewBox(svg);
  const colorOne = controls.colorone.value;
  const colorTwo = controls.colortwo.value;
  const gridsize = controls.gridsize.valueAsNumber;
  const scale = controls.scale.valueAsNumber || 1;

  const cellSize = Math.min(width, height) / gridsize;
  const cols = Math.floor(width / cellSize);
  const rows = Math.floor(height / cellSize);
  const patternWidth = cellSize * cols;
  const patternHeight = cellSize * rows;
  const scaledPatternWidth = patternWidth * scale;
  const scaledPatternHeight = patternHeight * scale;

  const offsetX = (width - scaledPatternWidth) / 2;
  const offsetY = (height - scaledPatternHeight) / 2;
  svg.setAttribute('shape-rendering', 'crispEdges');

  let str = '';
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      const isEvenCell = (col + row) % 2 === 0;
      const baseFill = isEvenCell ? colorTwo : colorOne;
      const smallSquareFill = isEvenCell ? colorOne : colorTwo;

      str += `<rect x="${col * cellSize}" y="${row * cellSize}" width="${cellSize}" height="${cellSize}" fill="${baseFill}" shape-rendering="crispEdges" />`;

      const smallSize = cellSize * controls.squaresize.valueAsNumber;
      const padding = cellSize * 0.075;

      if (Math.floor(col / 4) % 2 === 0) {
        str += `<rect x="${col * cellSize + padding}" y="${row * cellSize + padding}" width="${smallSize}" height="${smallSize}" fill="${smallSquareFill}" shape-rendering="crispEdges" />`;
        str += `<rect x="${col * cellSize + cellSize - padding - smallSize}" y="${row * cellSize + cellSize - padding - smallSize}" width="${smallSize}" height="${smallSize}" fill="${smallSquareFill}" shape-rendering="crispEdges" />`;
      } else {
        str += `<rect x="${col * cellSize + padding}" y="${row * cellSize + cellSize - padding - smallSize}" width="${smallSize}" height="${smallSize}" fill="${smallSquareFill}" shape-rendering="crispEdges" />`;
        str += `<rect x="${col * cellSize + cellSize - padding - smallSize}" y="${row * cellSize + padding}" width="${smallSize}" height="${smallSize}" fill="${smallSquareFill}" shape-rendering="crispEdges" />`;
      }
    }
  }

  svg.innerHTML = `
  <defs>
    <pattern id="squares" width="${patternWidth}" height="${patternHeight}" patternUnits="userSpaceOnUse" shape-rendering="crispEdges">
      ${str}
    </pattern>
  </defs>
  <g transform="translate(${offsetX} ${offsetY}) scale(${scale})">
    <rect width="${patternWidth}" height="${patternHeight}" fill="url(#squares)" shape-rendering="crispEdges" />
  </g>`;
}
