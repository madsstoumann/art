import * as common from '../common.js';
const GUI = document.querySelector('gui-control');
const storageKey = 'lunarechoes';
const svg = document.getElementById('svg');

GUI.addRange('Rings', 12, '', { min: 1, max: 30, name: 'numrings' });
GUI.addRange('Dots 1st ring', 7, '', { min: 1, max: 30, name: 'dotsperring' });
GUI.addRange('Dot size', 1.2, '', { min: 0.1, max: 3, step: 0.1, name: 'dotsize' });
GUI.addRange('Spread', 3.6, '', { min: 0.1, max: 10, step: 0.1, name: 'spread' });
GUI.addCheckbox('Rdm. radius', true, '', { name: 'randomradius' });
GUI.addCheckbox('Rdm. size', true, '', { name: 'randomdotsize' });

GUI.addColor('Fill', '#e0ab85', '', { name: 'fill' });
GUI.addRange('Scale', 1, '', { min: 0, max: 2, step: 0.025, name: 'scale' });
common.commonConfig(GUI, '#282060');
GUI.addEventListener('gui-input', (event) => common.handleGuiEvent(event, svg, GUI, storageKey, ringsOfDots));
common.init(GUI, storageKey, []);

/* === MAIN FUNCTION === */

function ringsOfDots(svg, controls) {
  const { width, height } = common.getViewBox(svg);
  const dotSize = controls.dotsize.valueAsNumber;
  const dotsPerRing = controls.dotsperring.valueAsNumber;
  const fill = controls.fill.value;
  const numRings = controls.numrings.valueAsNumber;
  const randomDotSize = controls.randomdotsize.checked;
  const randomRadius = controls.randomradius.checked;
  const scale = controls.scale.valueAsNumber;
  const spread = controls.spread.valueAsNumber;

  const cx = width / 2;
  const cy = height / 2;
  const [H, _S, _L] = common.hexToHSL(fill);
  const maxRadius = Math.min(width, height) / 2;

  const coords = (number) => {
    const frags = 360 / number;
    return Array.from({ length: number }, (_, i) => (frags / 180) * i * Math.PI);
  };

  let s = '';

  for (let i = 1; i <= numRings; i++) {
    const radius = randomRadius ? common.random(1, maxRadius) : spread * i;
    const theta = coords(dotsPerRing * i);
    theta.forEach((angle) => {
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      const currentDotSize = randomDotSize ? common.random(0.2, 3.5) : dotSize;
      const fill = `hsl(${common.random(H, H + 25)}, ${common.random(50, 90)}%, ${common.random(60, 90)}%)`;
      s += `<circle cx="${x}" cy="${y}" r="${currentDotSize}" fill="${fill}" />`;
    });
  }

  const translateX = (width / 2) * (1 - scale);
  const translateY = (height / 2) * (1 - scale);

  svg.innerHTML = `<g transform="translate(${translateX}, ${translateY}) scale(${scale})">${s}</g>`;
}
