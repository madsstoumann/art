import * as common from '../common.js';
const GUI = document.querySelector('gui-control');
const storageKey = 'rileyfragment';
const svg = document.getElementById('svg');

GUI.addRange('Segments', 10, '', { min: 2, max: 24, name: 'segments' });
GUI.addRange('X1', 85, '', { min: 0, max: 100, step: 0.1, name: 'x' });
GUI.addRange('Y1', 60, '', { min: 0, max: 100, step: 0.1, name: 'y' });
GUI.addRange('X2', 40, '', { min: 0, max: 100, step: 0.1, name: 'x2' });
GUI.addRange('Y2', 20, '', { min: 0, max: 100, step: 0.1, name: 'y2' });
GUI.addColor('Color', '#1D1D1D', '', { name: 'color' });
GUI.addRange('Scale', 0.8, '', { min: 0, max: 2, step: 0.025, name: 'scale' });
common.commonConfig(GUI, '#F9F9EB');
GUI.addEventListener('gui-input', (event) => common.handleGuiEvent(event, svg, GUI, storageKey, rileyFragment));
common.init(GUI, storageKey, []);

/* === MAIN FUNCTION === */

function rileyFragment(svg, controls) {
  const { width, height } = common.getViewBox(svg);
  const segments = controls.segments.valueAsNumber;
  const scale = controls.scale.valueAsNumber;
  
  const translateX = width / 2;
  const translateY = height / 2;

  // Y-axis displacement points
  const y1 = -translateY + (controls.y.valueAsNumber / 100) * height;
  const y2 = -translateY + (controls.y2.valueAsNumber / 100) * height;
  
  // X-axis displacement factors - separate for left and right sides
  const xLeftDisplacement = controls.x.valueAsNumber / 100;
  const xRightDisplacement = controls.x2.valueAsNumber / 100;

  const length = 2 * segments + 1;
  const segmentWidth = width / length;
  const polygons = [];

  // First half - ending at progressive y-scale (from y to y2)
  for (let i = 0; i < segments; i++) {
    const xPos = (i * 2 + 1) * segmentWidth - translateX;
    const isRightSide = xPos > 0;
    
    // Choose displacement factor based on which side we're on
    const displacementFactor = isRightSide ? xRightDisplacement : xLeftDisplacement;
    
    // Calculate shifts for both edges separately
    const leftEdgeShift = displacementFactor * Math.abs(xPos) * Math.sign(xPos);
    const rightEdgeShift = displacementFactor * Math.abs(xPos + segmentWidth) * Math.sign(xPos + segmentWidth);
    
    // Calculate y positions for left and right edges based on their x-positions
    // Map the x position to a position on the y1-y2 line
    const leftEdgeX = xPos - leftEdgeShift;
    const leftEdgeY = y1 + ((leftEdgeX + translateX) / width) * (y2 - y1);
    
    const rightEdgeX = xPos + segmentWidth - rightEdgeShift;
    const rightEdgeY = y1 + ((rightEdgeX + translateX) / width) * (y2 - y1);
    
    const points = [
      `${xPos},${-translateY}`, // Top left
      `${xPos + segmentWidth},${-translateY}`, // Top right
      `${rightEdgeX},${rightEdgeY}`, // Bottom right with proper y position
      `${leftEdgeX},${leftEdgeY}` // Bottom left with proper y position
    ].join(' ');
    
    polygons.push(`<polygon points="${points}" fill="${controls.color.value}" />`);
  }

  // Second half - starting at progressive y-scale (from y to y2)
  for (let i = 0; i < segments; i++) {
    const xPos = (i * 2 + 1) * segmentWidth - translateX;
    const isRightSide = xPos > 0;
    
    // Choose displacement factor based on which side we're on
    const displacementFactor = isRightSide ? xRightDisplacement : xLeftDisplacement;
    
    // Calculate shifts for both edges separately
    const leftEdgeShift = displacementFactor * Math.abs(xPos) * Math.sign(xPos);
    const rightEdgeShift = displacementFactor * Math.abs(xPos + segmentWidth) * Math.sign(xPos + segmentWidth);
    
    // Calculate y positions for left and right edges based on their x-positions
    const leftEdgeX = xPos - leftEdgeShift;
    const leftEdgeY = y1 + ((leftEdgeX + translateX) / width) * (y2 - y1);
    
    const rightEdgeX = xPos + segmentWidth - rightEdgeShift;
    const rightEdgeY = y1 + ((rightEdgeX + translateX) / width) * (y2 - y1);
    
    const points = [
      `${leftEdgeX},${leftEdgeY}`, // Top left with proper y position
      `${rightEdgeX},${rightEdgeY}`, // Top right with proper y position
      `${xPos + segmentWidth},${translateY}`, // Bottom right
      `${xPos},${translateY}` // Bottom left
    ].join(' ');
    
    polygons.push(`<polygon points="${points}" fill="${controls.color.value}" />`);
  }

  svg.innerHTML = `<g transform="translate(${translateX} ${translateY}) scale(${scale})">
    ${polygons.join('\n')}
  </g>`;
}