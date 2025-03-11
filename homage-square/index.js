import * as common from '../common.js';
const GUI = document.querySelector('gui-control');
const storageKey = 'homagesquare';
const svg = document.getElementById('svg');

GUI.addRange('Squares', 4, '', { min: 2, max: 20, name: 'squares' });
GUI.addRange('X offset', 0, '', { min: -1, max: 1, step: 0.01, name: 'xoffset' });
GUI.addRange('Y offset', 0.25, '', { min: -1, max: 1, step: 0.01, name: 'yoffset' });
GUI.addRange('Spacing', 1.5, '', { min: 1, max: 3, step: 0.1, name: 'spacing' });
GUI.addColor('Color', '#ff0055', '', { name: 'color' });
GUI.addRange('Light factor', 0.75, '', { min: 0.1, max: 2, step: 0.01, name: 'lightnessfactor' });
GUI.addCheckbox('Reverse', '0', '', { name: 'reverse' });
common.commonConfig(GUI, '#080828');
GUI.addEventListener('gui-input', (event) => common.handleGuiEvent(event, svg, GUI, storageKey, homageSquare));
common.init(GUI, storageKey, []);

/* === MAIN FUNCTION === */

function homageSquare(svg, controls) {
  const { width, height } = common.getViewBox(svg);
  const squares = controls.squares.valueAsNumber;
  const [h, s, l] = common.hexToHSL(controls.color.value);
  const reverse = controls.reverse.checked;
  const lightnessFactor = controls.lightnessfactor.valueAsNumber;
  const xOffsetFactor = controls.xoffset.valueAsNumber;
  const yOffsetFactor = controls.yoffset.valueAsNumber;
  const spacingFactor = controls.spacing.valueAsNumber;
  const maxSquareSize = Math.min(width, height);
  const decrement = maxSquareSize / (squares * spacingFactor);

  const minLightness = l * (1 - lightnessFactor);
  const maxLightness = l;

  const elements = Array.from({ length: squares }, (_, index) => {
    const baseFactor = reverse ? ((squares - index - 1) / (squares - 1)) : (index / (squares - 1));
    const currentL = minLightness + (maxLightness - minLightness) * baseFactor;
    const squareSize = maxSquareSize - (index * decrement);
    const xOffset = index * decrement * xOffsetFactor;
    const yOffset = index * decrement * yOffsetFactor;
    if (index === 0) svg.style.backgroundColor = `hsl(${h}, ${s}%, ${currentL}%)`;
    return `
      <rect
        width="${squareSize}"
        height="${squareSize}"
        x="${(width - squareSize) / 2 + xOffset}"
        y="${(height - squareSize) / 2 + yOffset}"
        fill="hsl(${h}, ${s}%, ${currentL}%)">
      </rect>`;
  }).join('');
  svg.innerHTML = `<g>${elements}</g>`;
}
