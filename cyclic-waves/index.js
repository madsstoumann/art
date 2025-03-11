import * as common from '../common.js';

const GUI = document.querySelector('gui-control');
const storageKey = 'circlecircles';
const svg = document.getElementById('svg');

GUI.addRange('Circles', 100, '', { min: 10, max: 200, name: 'numcircles' });
GUI.addRange('Min Radius', 1, '', { min: 1, max: 25, name: 'minradius' });
GUI.addRange('Max Radius', 15, '', { min: 2, max: 50, name: 'maxradius' });
GUI.addRange('Cycles', 5, '', { min: 1, max: 25, name: 'cycles' });
GUI.addColor('Line color', '#F075F0', '', { name: 'stroke' });
GUI.addRange('Line width', 0.15, '', { min: 0.05, max: 1, step: 0.01, name: 'linestrokewidth' });
GUI.addColor('Fill Start', '#6C6CE0', '', { name: 'fillstart' });
GUI.addColor('Fill End', '#0D0D73', '', { name: 'fillend' });
GUI.addCheckbox('Layered', false, '', { name: 'layered', checked: 'checked' });
GUI.addRange('Scale', 1, '', { min: 0, max: 2, step: 0.025, name: 'scale' });
common.commonConfig(GUI, '#080828');
GUI.addEventListener('gui-input', (event) => common.handleGuiEvent(event, svg, GUI, storageKey, cyclicWaves));
common.init(GUI, storageKey, []);

/* === MAIN FUNCTION === */

function cyclicWaves(svg, controls) {
  const { width, height } = common.getViewBox(svg);
  const cycles = controls.cycles.valueAsNumber;
  const fillEnd = controls.fillend.value;
  const fillStart = controls.fillstart.value;
  const layered = controls.layered.checked;
  const lineStrokeWidth = controls.linestrokewidth.valueAsNumber;
  const maxRadius = controls.maxradius.valueAsNumber;
  const minRadius = controls.minradius.valueAsNumber;
  const numCircles = controls.numcircles.valueAsNumber;
  const scale = controls.scale.valueAsNumber;
  const stroke = controls.stroke.value;

  svg.style.stroke = stroke;
  svg.style.strokeWidth = lineStrokeWidth;

  const placementRadius = Math.min(width, height) / 2 - maxRadius;
  const angleStep = (2 * Math.PI) / numCircles;

  const getCircleRadius = (index) => {
    const cycleLength = numCircles / (cycles * 2);
    const cyclePos = index % cycleLength;
    const isGrowing = Math.floor(index / cycleLength) % 2 === 0;
    const radiusDelta = (maxRadius - minRadius) * (cyclePos / cycleLength);
    return isGrowing ? minRadius + radiusDelta : maxRadius - radiusDelta;
  };

  let circles = Array.from({ length: numCircles }).map((_, index) => {
    const angle = index * angleStep;
    const x = placementRadius * Math.cos(angle);
    const y = placementRadius * Math.sin(angle);
    const radius = getCircleRadius(index);
    return { x, y, radius, index };
  });

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  // Calculate bounding box for centering
  circles.forEach(({ x, y, radius }) => {
    minX = Math.min(minX, x - radius);
    minY = Math.min(minY, y - radius);
    maxX = Math.max(maxX, x + radius);
    maxY = Math.max(maxY, y + radius);
  });

  const boundingBoxCenterX = (minX + maxX) / 2;
  const boundingBoxCenterY = (minY + maxY) / 2;

  const translateX = width / 2 - boundingBoxCenterX;
  const translateY = height / 2 - boundingBoxCenterY;

  if (layered) {
    circles = circles.slice().sort((a, b) => b.radius - a.radius);
  } 

  svg.innerHTML = `<g transform="translate(${translateX} ${translateY}) scale(${scale})">
  ${circles.map(({ x, y, radius }, index) => {
    const factor = index / (numCircles - 1);
    const fillColor = common.interpolateColor(fillStart, fillEnd, factor);
    return `<circle cx="${x}" cy="${y}" r="${radius}" fill="${fillColor}"></circle>`
  }).join('')}</g>`;
}
