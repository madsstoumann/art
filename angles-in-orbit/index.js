import * as common from '../common.js';

const GUI = document.querySelector('gui-control');
const storageKey = 'anglesinorbit';
const svg = document.getElementById('svg');

GUI.addRange('Triangles', 12, '', { min: 3, max: 100, name: 'triangles' });
GUI.addRange('Inner Gap', 0, '', { min: 0, max: 25, name: 'inner', value: 0 });
GUI.addColor('Line color', '#805280', '', { name: 'stroke' });
GUI.addRange('Line width', 0, '', { min: 0, max: 1, step: 0.01, name: 'linestrokewidth', value: 0 });
GUI.addColor('Fill Start', '#7d366b', '', { name: 'fillstart' });
GUI.addColor('Fill End', '#d9a6cc', '', { name: 'fillend' });
GUI.addRange('Scale', 0.95, '', { min: 0, max: 2, step: 0.025, name: 'scale' });
common.commonConfig(GUI, '#282852');
GUI.addEventListener('gui-input', (event) => common.handleGuiEvent(event, svg, GUI, storageKey, anglesInOrbit));
common.init(GUI, storageKey, []);

/* === MAIN FUNCTION === */

function anglesInOrbit(svg, controls) {
  const { width, height } = common.getViewBox(svg);
  const triangles = controls.triangles.valueAsNumber;
  const fillEnd = controls.fillend.value;
  const fillStart = controls.fillstart.value;
  const inner = controls.inner.valueAsNumber;
  const lineStrokeWidth = controls.linestrokewidth.valueAsNumber;
  
  const stroke = controls.stroke.value;
  const scale = controls.scale.valueAsNumber;

  svg.style.stroke = stroke;
  svg.style.strokeWidth = lineStrokeWidth;

  const radius = (Math.min(width, height) / 2);
  const translateX = width / 2;
  const translateY = height / 2;

  const angleStep = (2 * Math.PI) / triangles;
  const polygons = Array.from({ length: triangles }).map((_, index) => {
    const angle = index * angleStep;
    const factor = index / (triangles - 1);
    const fillColor = index < triangles / 2 
              ? common.interpolateColor(fillStart, fillEnd, factor) 
              : common.interpolateColor(fillEnd, fillStart, factor);
    const prevAngle = (index - 1 + triangles) % triangles * angleStep;
    const x1 = radius * Math.cos(angle);
    const y1 = radius * Math.sin(angle);
    const x2 = radius * Math.cos(prevAngle) / 2;
    const y2 = radius * Math.sin(prevAngle) / 2;
    return `<polygon points="${inner * Math.cos(angle)},${inner * Math.sin(angle)} ${x1},${y1} ${x2},${y2}" fill="${fillColor}"/>`;
  });

  svg.innerHTML = `
    <g transform="translate(${translateX}, ${translateY}) scale(${scale})">
      ${polygons.join("")}
    </g>
  `;
}
