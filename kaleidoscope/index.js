import * as common from '../common.js';
import Delaunay from '../delaunay.js';
const GUI = document.querySelector('gui-control');
const storageKey = 'kaleidoscope';
const svg = document.getElementById('svg');

GUI.addRange('Points', 170, '', { min: 3, max: 512, name: 'numpoints' });

GUI.addColor('Line color', '#FFFFFF', '', { name: 'stroke' });
GUI.addRange('Line width', 0.15, '', { min: 0, max: 1.4, step: 0.01, name: 'strokewidth' });
GUI.addColor('Start color', '#d92926', '', { name: 'startcolor' });
GUI.addColor('End color', '#993366', '', { name: 'endcolor' });
GUI.addCheckbox('Square', '1', '', { 'data-unchecked': '0', name: 'square' });
common.commonConfig(GUI, '#bf4040');
GUI.addEventListener('gui-input', (event) => common.handleGuiEvent(event, svg, GUI, storageKey, drawTriangles));
common.init(GUI, storageKey, []);

/* === MAIN FUNCTION === */

function drawTriangles(svg, controls) {
	const { width, height } = common.getViewBox(svg);
	const endColor = controls.endcolor.value;
	const numPoints = controls.numpoints.valueAsNumber;
	const square = !controls.square.checked;
	const startColor = controls.startcolor.value;
	const [h1, s1, l1] = common.hexToHSL(startColor);
	const [h2, s2, l2] = common.hexToHSL(endColor);

	let vertices = new Array(numPoints).fill().map(() => {
		let x = Math.random() - 0.5, y = Math.random() - 0.5;
		if (square) {
			do {
				x = Math.random() - 0.5;
				y = Math.random() - 0.5;
			} while (x * x + y * y > 0.25);
		}
		x = (x * 0.96875 + 0.5) * width;
		y = (y * 0.96875 + 0.5) * height;
		return [x, y];
	});

	const triangles = Delaunay.triangulate(vertices);
	let output = '';

	for (let i = 0; i < triangles.length; i+=3) {
		let [x, y] = vertices[triangles[i]];
		let [a, b] = vertices[triangles[i+1]];
		let [c, d] = vertices[triangles[i+2]];

		// Interpolate a random color between startColor and endColor
		const t = Math.random();
		const h = h1 + t * (h2 - h1);
		const s = s1 + t * (s2 - s1);
		const l = l1 + t * (l2 - l1);
		output += `<path d="M${x} ${y} L${a} ${b} L${c} ${d}Z" fill="hsl(${h}, ${s}%, ${l}%)"></path>`;
	}
	svg.innerHTML = output;
}
