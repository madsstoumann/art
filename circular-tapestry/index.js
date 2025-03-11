import * as common from '../common.js';
const GUI = document.querySelector('gui-control');
const storageKey = 'wheel';
const svg = document.getElementById('svg');

GUI.addRange('Rings', 12, '', { min: 1, max: 30, name: 'numrings' });
GUI.addRange('Strokes', 20, '', { min: 1, max: 50, name: 'strokes' });
GUI.addColor('Start hue', '#ff0000', '', { name: 'starthue' });
GUI.addColor('End hue', '#0000ff', '', { name: 'endhue' });
GUI.addRange('Rotate min.', 0, '', { min: 1, max: 30, name: 'rotatemin', value: 0 });
GUI.addRange('Rotate max.', 180, '', { min: 0, max: 360, name: 'rotatemax' });
GUI.addRange('Scale', 0.9, '', { min: 0, max: 2, step: 0.025, name: 'scale' });
common.commonConfig(GUI, '#3fa673');
GUI.addEventListener('gui-input', (event) => common.handleGuiEvent(event, svg, GUI, storageKey, wheel));
common.init(GUI, storageKey, []);

/* === MAIN FUNCTION === */

function wheel(svg, controls) {
  const { width, height } = common.getViewBox(svg);
  const endHue = controls.endhue.value;
  const numRings = controls.numrings.valueAsNumber;
  const rotateMin = controls.rotatemin.valueAsNumber;
  const rotateMax = controls.rotatemax.valueAsNumber;
  const numStrokes = controls.strokes.valueAsNumber;
  const scale = controls.scale.valueAsNumber;
  const startHue = controls.starthue.value;

  const cx = width / 2;
  const cy = height / 2;
  const [H, _S, _L] = common.hexToHSL(startHue);
  const [H2, _S2, _L2] = common.hexToHSL(endHue);
  const radius = Math.min(width, height) / 2;
  let s = '';

  const strokeDash = 3000;
  const strokeWidth = radius / numRings;

  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke-width', strokeWidth);

  for (let j = 0; j < numRings; j++) {
    let i = numStrokes;
    let r = radius - (j * strokeWidth); 
    if (r < 0) r = strokeWidth;
    
    s += `<g transform-origin="50% 50%" transform="rotate(${common.random(rotateMin, rotateMax)})">`;
    
    while (i--) {
      const strokeColor = `hsl(${common.random(H, H2)}, ${common.random(25, 75)}%, ${common.random(30, 80)}%)`;
      const dashArrayValue = (i + 1) * (Math.PI * 2) / (numStrokes / r);
      s += `
        <circle 
          cx="${cx}" 
          cy="${cy}" 
          r="${r}" 
          stroke="${strokeColor}" 
          stroke-dasharray="${dashArrayValue} ${strokeDash}">
        </circle>`;
    }
    s += `</g>`;
  }

  const translateX = (width / 2) * (1 - scale);
  const translateY = (height / 2) * (1 - scale);

  svg.innerHTML = `<g transform="translate(${translateX}, ${translateY}) scale(${scale})">${s}</g>`;
}
