import * as common from '../common.js';

const GUI = document.querySelector('gui-control');
const storageKey = 'floweroflife';
const svg = document.getElementById('svg');

GUI.addRange('Circles', 37, '', { min: 1, max: 169, name: 'numcircles' });
GUI.addRange('Radius', 12, '', { min: 2, max: 100, name: 'radius' });
GUI.addCheckbox('Auto fit', '', '', { name: 'autofit' });
GUI.addColor('Line color', '#F075F0', '', { name: 'stroke' });
GUI.addRange('Line opacity', 0.5, '', { min: 0, max: 1, step: 0.01, name: 'strokeopacity' });
GUI.addRange('Line width', 0.1, '', { min: 0, max: 1, step: 0.01, name: 'linestrokewidth' });
GUI.addColor('Fill', '#b814b8', '', { name: 'fill' });
GUI.addRange('Fill opacity', 0.2, '', { min: 0, max: 1, step: 0.01, name: 'fillopacity' });
GUI.addRange('Scale', 1, '', { min: 0, max: 2, step: 0.025, name: 'scale' });
common.commonConfig(GUI, '#080828');
GUI.addEventListener('gui-input', (event) => common.handleGuiEvent(event, svg, GUI, storageKey, flowerOfLife));
common.init(GUI, storageKey, []);

/* === MAIN FUNCTION === */

function flowerOfLife(svg, controls) {
  const { width, height } = common.getViewBox(svg);
  const autoFit = controls.autofit.checked;
  const fill = controls.fill.value;
  const fillOpacity = controls.fillopacity.valueAsNumber;
  const lineStrokeWidth = controls.linestrokewidth.valueAsNumber;
  const numCircles = controls.numcircles.valueAsNumber;
  const scale = controls.scale.valueAsNumber;
	const stroke = controls.stroke.value;
	const strokeOpacity = controls.strokeopacity.valueAsNumber;

  let radius = controls.radius.valueAsNumber;

	let [H, S, L] = common.hexToHSL(fill);
  svg.style.setProperty('fill', `hsla(${H}, ${S}%, ${L}%, ${fillOpacity})`);

	[H, S, L] = common.hexToHSL(stroke);
	svg.style.setProperty('stroke', `hsla(${H}, ${S}%, ${L}%, ${strokeOpacity})`);

  if (autoFit) {
    const maxDiameter = Math.min(width, height);
    const layers = Math.ceil((Math.sqrt(2 * (numCircles - 1)) - 1) / 2);
    radius = (maxDiameter / 2) / layers;
  }

  const positions = [];
  const angleIncrement = Math.PI / 3;

  if (numCircles > 0) {
    positions.push({ x: 0, y: 0 });
  }

  let currentLayer = 1;
  let totalCircles = 1;

  while (totalCircles < numCircles) {
    for (let i = 0; i < 6; i++) {
      if (totalCircles >= numCircles) break;
      const angle = angleIncrement * i;
      for (let j = 0; j < currentLayer; j++) {
        if (totalCircles >= numCircles) break;
        const x = (currentLayer - j) * radius * Math.cos(angle) + j * radius * Math.cos(angle + Math.PI / 3);
        const y = (currentLayer - j) * radius * Math.sin(angle) + j * radius * Math.sin(angle + Math.PI / 3);
        positions.push({ x, y });
        totalCircles++;
      }
    }
    currentLayer++;
  }

  svg.innerHTML = `<g transform="translate(${width / 2} ${height / 2}) scale(${scale})">${
    positions.map((pos, index) => 
      `<circle cx="${pos.x}" cy="${pos.y}" r="${radius}" stroke-width="${lineStrokeWidth}"></circle>`
    ).join('')
  }</g>`;
}
