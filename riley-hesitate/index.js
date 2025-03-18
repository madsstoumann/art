import * as common from '../common.js';
const GUI = document.querySelector('gui-control');
const storageKey = 'rileyhesitate';
const svg = document.getElementById('svg');

GUI.addRange('Columns', 13, '', { min: 5, max: 50, name: 'columns' });
GUI.addRange('Rows', 25, '', { min: 5, max: 50, name: 'rows' });
GUI.addRange('Radius', 2, '', { min: 0.25, max: 4, step: 0.01, name: 'radius' });
GUI.addRange('Flatness', 0.4, '', { min: 0.1, max: 1, step: 0.01, name: 'flatness' });
GUI.addRange('Y', 50, '', { min: 0, max: 100, step: 0.1, name: 'y' });
GUI.addColor('Color 1', '#537AEE', '', { name: 'colorStart' });
GUI.addColor('Color 2', '#AB83A1', '', { name: 'colorMiddle' });
GUI.addColor('Color 3', '#1BAB92', '', { name: 'colorEnd' });
GUI.addRange('Direction', 45, '', { min: 0, max: 360, step: 5, name: 'direction' });
GUI.addRange('Scale', 0.925, '', { min: 0, max: 2, step: 0.025, name: 'scale' });
common.commonConfig(GUI, '#F9F9EB');
GUI.addEventListener('gui-input', (event) => common.handleGuiEvent(event, svg, GUI, storageKey, rileyHesitate));
common.init(GUI, storageKey, []);

/* === MAIN FUNCTION === */

function rileyHesitate(svg, controls) {
  const { width, height } = common.getViewBox(svg);
  const columns = controls.columns.valueAsNumber;
  const colorStart = controls.colorStart.value;
  const colorMiddle = controls.colorMiddle.value;
  const colorEnd = controls.colorEnd.value;
  const direction = controls.direction.valueAsNumber;
  const flat = controls.flatness.valueAsNumber;
  const radius = controls.radius.valueAsNumber;
  const rows = controls.rows.valueAsNumber;
  const scale = controls.scale.valueAsNumber;
  const y = controls.y.valueAsNumber;

  const ellipses = [];
  const flatY = ((y / 100) * height) - (height / 2);
  const spacingX = width / columns;
  const spacingY = height / rows;
  
  // Convert direction to radians
  const directionRad = (direction * Math.PI) / 180;

  for (let row = 0; row < rows; row++) {
    const isEvenRow = row % 2 === 0;
    const colsInThisRow = isEvenRow ? columns : columns - 1;
    const offsetX = isEvenRow ? 0 : spacingX / 2;

    for (let col = 0; col < colsInThisRow; col++) {
      const cx = (col * spacingX) + offsetX - (width / 2) + (spacingX / 2);
      const cy = (row * spacingY) - (height / 2) + (spacingY / 2);
      const distanceFromFlatY = Math.abs(cy - flatY);
      const normalizedDistance = Math.min(1, distanceFromFlatY / (height / 2));

      const rx = radius;
      const ry = rx * (flat + normalizedDistance * (1 - flat));

      const normalizedX = (col + (isEvenRow ? 0 : 0.5)) / columns;
      const normalizedY = row / rows;

      // Calculate gradient factor based on direction
      // This projects the 2D position onto the direction vector
      const gradientFactor = 
        (normalizedX * Math.cos(directionRad) + 
         normalizedY * Math.sin(directionRad));
      
      // Adjust to 0-1 range (in case of negative values from projection)
      const adjustedGradientFactor = Math.min(1, Math.max(0, gradientFactor));
      
      // Interpolate between the three colors based on position
      let fill;
      if (adjustedGradientFactor <= 0.5) {
        // First half: interpolate between colorStart and colorMiddle
        fill = common.interpolateColor(colorStart, colorMiddle, adjustedGradientFactor * 2);
      } else {
        // Second half: interpolate between colorMiddle and colorEnd
        fill = common.interpolateColor(colorMiddle, colorEnd, (adjustedGradientFactor - 0.5) * 2);
      }
      
      ellipses.push(`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" />`);
    }
  }

  const translateX = width / 2;
  const translateY = height / 2;

  svg.innerHTML = `<g transform="translate(${translateX} ${translateY}) scale(${scale})">
    ${ellipses.join('\n')}
  </g>`;
}