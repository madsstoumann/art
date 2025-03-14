import * as common from '../common.js';
const GUI = document.querySelector('gui-control');
const storageKey = 'polygons';
const svg = document.getElementById('svg');

GUI.addRange('Polygons', 16, '', { min: 1, max: 50, name: 'polygons' });
GUI.addRange('Min Size', 10, '', { min: 1, max: 10, step: .1, name: 'minsize' });
GUI.addColor('Line color', '#FFFFFF', '', { name: 'stroke' });
GUI.addRange('Line opacity', 0.25, '', { min: 0, max: 1, step: 0.01, name: 'strokeopacity' });
GUI.addRange('Line width', 0.25, '', { min: 0, max: 1, step: 0.01, name: 'linestrokewidth' });
GUI.addColor('Start', '#14b879', '', { name: 'fillStart' });
GUI.addColor('Stop', '#031c09', '', { name: 'fillEnd' });
GUI.addRange('Fill opacity', 1, '', { min: 0, max: 1, step: 0.01, name: 'fillopacity' });
GUI.addRange('Scale', 0.925, '', { min: 0, max: 2, step: 0.025, name: 'scale' });
common.commonConfig(GUI, '#450C0C');
GUI.addEventListener('gui-input', (event) => common.handleGuiEvent(event, svg, GUI, storageKey, polygons));
common.init(GUI, storageKey, []);

/* === MAIN FUNCTION === */

function polygons(svg, controls) {
  const { width, height } = common.getViewBox(svg);

  const polygons = controls.polygons.valueAsNumber;
  const minSize = controls.minsize.valueAsNumber;
  const scale = controls.scale.valueAsNumber || 1;

  const fillOpacity = controls.fillopacity.valueAsNumber;
  const lineStrokeWidth = controls.linestrokewidth.valueAsNumber;
  const stroke = controls.stroke.value;
  const strokeOpacity = controls.strokeopacity.valueAsNumber;

  const [H, S, L] = common.hexToHSL(stroke);
  svg.style.setProperty('stroke', `hsla(${H}, ${S}%, ${L}%, ${strokeOpacity})`);

  const baseColor = controls.fillStart.value;
  const targetColor = controls.fillEnd.value;
  const initialSideLength = 2 * minSize * Math.sin(Math.PI/3);

  const elements = [...new Array(polygons)].map((_polygon, index) => {
   // Calculate the number of sides for this polygon (minimum 3 = triangle)
   const sides = 3 + index; 
   const radius = initialSideLength / (2 * Math.sin(Math.PI/sides));
   const points = [];
   const startAngle = Math.PI/2 - Math.PI/sides;
   
   // Calculate the offset needed to place the bottom edge exactly at the bottom
   // For a polygon with a flat bottom, the bottom vertices have y = radius * sin(π/2 + π/sides)
   const bottomVertexY = radius * Math.sin(Math.PI/2 + Math.PI/sides);
   const yOffset = height - bottomVertexY;
   
   for (let i = 0; i < sides; i++) {
     const angle = startAngle + i * (2 * Math.PI / sides);
     const x = radius * Math.cos(angle) + width/2;
     const y = radius * Math.sin(angle) + yOffset;
     points.push(`${x},${y}`);
   }

   const interpolationFactor = index / (polygons - 1 || 1);
   const polygonColor = index === 0 ? baseColor : common.interpolateColor(baseColor, targetColor, interpolationFactor);
   
   return `<polygon points="${points.join(' ')}" fill="${polygonColor}" fill-opacity="${fillOpacity}" stroke-width="${lineStrokeWidth}" />`;
 }).reverse().join('');
  
  const centerX = (width - width * scale) / 2;
  const centerY = (height - height * scale) / 2;

  svg.innerHTML = `<g transform="translate(${centerX} ${centerY}) scale(${scale})">${elements}</g>`;
}
