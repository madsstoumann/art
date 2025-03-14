import * as common from '../common.js';
const GUI = document.querySelector('gui-control');
const storageKey = 'squares';
const svg = document.getElementById('svg');

GUI.addRange('Gridsize', 16, '', { min: 2, max: 32, name: 'gridsize' });
GUI.addColor('Color 1', '#FFFFFF', '', { name: 'colorone' });
GUI.addColor('Color 2', '#000000', '', { name: 'colortwo' });

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

  const cellSize = width / gridsize;
  const patternSize = cellSize * 2;

  const centerX = (width - width * scale) / 2;
  const centerY = (height - height * scale) / 2;
  
  svg.innerHTML = `
  <defs>
    <pattern id="checkerPattern" width="${patternSize}" height="${patternSize}" patternUnits="userSpaceOnUse">
      <rect x="0" y="0" width="${cellSize}" height="${cellSize}" fill="${colorTwo}" />
      <rect x="${cellSize}" y="${cellSize}" width="${cellSize}" height="${cellSize}" fill="${colorTwo}" />
      <rect x="${cellSize * 0.1}" y="${cellSize * 1.1}" width="${cellSize * 0.3}" height="${cellSize * 0.3}" fill="${colorTwo}" />
      <rect x="${cellSize * 1.6}" y="${cellSize * 0.6}" width="${cellSize * 0.3}" height="${cellSize * 0.3}" fill="${colorTwo}" />
      <rect x="${cellSize * 1.1}" y="${cellSize * 0.1}" width="${cellSize * 0.3}" height="${cellSize * 0.3}" fill="${colorTwo}" />
      <rect x="${cellSize * 0.6}" y="${cellSize * 1.6}" width="${cellSize * 0.3}" height="${cellSize * 0.3}" fill="${colorTwo}" />
      <rect x="${cellSize * 0.6}" y="${cellSize * 0.6}" width="${cellSize * 0.3}" height="${cellSize * 0.3}" fill="${colorOne}" />
      <rect x="${cellSize * 1.1}" y="${cellSize * 1.1}" width="${cellSize * 0.3}" height="${cellSize * 0.3}" fill="${colorOne}" />
      <rect x="${cellSize * 0.1}" y="${cellSize * 0.1}" width="${cellSize * 0.3}" height="${cellSize * 0.3}" fill="${colorOne}" />
      <rect x="${cellSize * 1.6}" y="${cellSize * 1.6}" width="${cellSize * 0.3}" height="${cellSize * 0.3}" fill="${colorOne}" />
    </pattern>
  </defs>
  <g transform="translate(${centerX} ${centerY}) scale(${scale})">
    <rect width="${width}" height="${height}" fill="url(#checkerPattern)" />
  </g>`;
}
