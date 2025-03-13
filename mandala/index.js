import * as common from '../common.js';
const GUI = document.querySelector('gui-control');
const storageKey = 'mandala';
const svg = document.getElementById('svg');

GUI.addRange('Circles', 15, '', { min: 2, max: 20, name: 'circles' });
GUI.addRange('Arcs CW', 42, '', { min: 0, max: 100, name: 'arcscw' });
GUI.addRange('Arcs CCW', 42, '', { min: 0, max: 100, name: 'arcsccw' });
GUI.addRange('Min. radius', 4, '', { min: 0, max: 40, name: 'radiusmin' });
GUI.addRange('Max. radius', 46, '', { min: 10, max: 100, name: 'radiusmax' });
GUI.addColor('Line color', '#6c3361', '', { name: 'stroke' });
GUI.addRange('Line width', 0.15, '', { min: 0, max: 1.4, step: 0.01, name: 'strokewidth' });
GUI.addColor('Start color', '#ff3773', '', { name: 'startcolor' });
GUI.addColor('End color', '#8c9dd9', '', { name: 'endcolor' });
common.commonConfig(GUI, '#6c3361');
GUI.addEventListener('gui-input', (event) => common.handleGuiEvent(event, svg, GUI, storageKey, drawMandala));
common.init(GUI, storageKey, []);

/* === MAIN FUNCTION === */

function drawMandala(svg, controls) {
  svg.innerHTML = '';
	const { width, height } = common.getViewBox(svg);
  const arcsccw = controls.arcsccw.valueAsNumber;
  const arcscw = controls.arcscw.valueAsNumber;
  const circles = controls.circles.valueAsNumber;
  const endcolor = controls.endcolor.value;
  const radiusmax = controls.radiusmax.valueAsNumber;
  const radiusmin = controls.radiusmin.valueAsNumber;
  const startcolor = controls.startcolor.value;

  const centerX = width / 2;
  const centerY = height / 2;
  const radiusStep = (radiusmax - radiusmin) / (circles - 1);

  for (let i = circles; i--; i >= 0) {
    let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", centerX);
    circle.setAttribute("cy", centerY);
    circle.setAttribute("r", radiusmin + (i * radiusStep));
    circle.setAttribute("fill", common.interpolateColor(startcolor, endcolor, i / circles));
    svg.appendChild(circle);
  }

  function polarToCartesian(cx, cy, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: cx + (radius * Math.cos(angleInRadians)),
      y: cy + (radius * Math.sin(angleInRadians))
    };
  }

  function arcGroup(sweepFlag, arcs) {
    const arcGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    for (let i = 0; i < arcs; i++) {
      const startAngle = i * (360 / arcs);
      const endAngle = startAngle + 360 / arcs;
      const start = polarToCartesian(centerX, centerY, radiusmin, startAngle);
      const end = polarToCartesian(centerX, centerY, radiusmax, endAngle);
      const arcPath = document.createElementNS("http://www.w3.org/2000/svg", "path");

      const pathData = [
        `M ${start.x} ${start.y}`,
        `A ${radiusmax} ${radiusmax} 0 0 ${sweepFlag} ${end.x} ${end.y}`
      ].join(" ");
      
      arcPath.setAttribute("d", pathData);
      arcGroup.appendChild(arcPath);
    }
    return arcGroup;
  }

  svg.appendChild(arcGroup(1, arcscw));
  svg.appendChild(arcGroup(0, arcsccw));
}
