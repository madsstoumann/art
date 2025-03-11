import * as common from '../common.js';
const GUI = document.querySelector('gui-control');
const storageKey = 'mesh';
const svg = document.getElementById('svg');

GUI.addRange('Lines X', 10, '', { min: 1, max: 50, value: 10, name: 'xlines' });
GUI.addRange('Lines Y', 10, '', { min: 1, max: 50, value: 10, name: 'ylines' });
GUI.addRange('Rotation', -10, '', { min: -90, max: 90, name: 'rotation' });
GUI.addRange('Center X', 50, '', { min: 0, max: 100, name: 'centerx' });
GUI.addRange('Center Y', 50, '', { min: 0, max: 100, name: 'centery' });
GUI.addRange('Scale', 1, '', { min: 0, max: 5, step: 1, name: 'scale' });
GUI.addColor('Start hue', '#4095bf', '', { name: 'starthue' });
GUI.addColor('End hue', '#121c21', '', { name: 'endhue' });
GUI.addColor('Line color', '#FFFFFF', '', { name: 'stroke' });
GUI.addRange('Line width', 0, '', { min: 0, max: 3, step: 0.01, value: 0, name: 'strokewidth' });
common.commonConfig(GUI);
GUI.addEventListener('gui-input', (event) => common.handleGuiEvent(event, svg, GUI, storageKey, drawMesh));
common.init(GUI, storageKey, []);

/* === MAIN FUNCTION === */

function drawMesh(svg, controls) {
	const { width, height } = common.getViewBox(svg);
	const xLines = controls.xlines.valueAsNumber;
	const yLines = controls.ylines.valueAsNumber;
	const startHue = common.hexToHSL(controls.starthue.value)[0];
	const endHue = common.hexToHSL(controls.endhue.value)[0];
	const rotation = controls.rotation.valueAsNumber;
	const scale = controls.scale.valueAsNumber;
	const centerX = (controls.centerx.valueAsNumber / 100) * width;
	const centerY = (controls.centery.valueAsNumber / 100) * height;

	// Adjust coordinates based on the default viewBox dimensions: 0 0 100 100
	let coords = [
		[[0, 0], [width * 0.4, height * 0.4], [width * 0.4, height * 0.6], [0, height]],
		[[width, 0], [width * 0.6, height * 0.4], [width * 0.6, height * 0.6], [width, height]],
		[[0, 0], [width * 0.4, height * 0.4], [width * 0.6, height * 0.4], [width, 0]],
		[[0, height], [width * 0.4, height * 0.6], [width * 0.6, height * 0.6], [width, height]],
		[[width * 0.4, height * 0.4], [width * 0.6, height * 0.4], [width * 0.6, height * 0.6], [width * 0.4, height * 0.6]] // Center
	];

	if (scale !== 1 || rotation !== 0) {
		coords[4] = coords[4].map(([x, y]) => {
			let point = [x, y];
			if (scale !== 1) point = common.scalePoint(centerX, centerY, x, y, scale);
			if (rotation !== 0) point = common.rotatePoint(centerX, centerY, point[0], point[1], rotation);
			return point;
		});
		coords[0][1] = coords[4][0];
		coords[0][2] = coords[4][3];
		coords[1][1] = coords[4][1];
		coords[1][2] = coords[4][2];
		coords[2][1] = coords[4][0];
		coords[2][2] = coords[4][1];
		coords[3][1] = coords[4][3];
		coords[3][2] = coords[4][2];
	}
	svg.innerHTML = coords.map(c => common.meshPolygons(c, xLines, yLines, startHue, endHue).outerHTML).join('');
}
