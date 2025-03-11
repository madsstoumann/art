import * as common from '../common.js';
const GUI = document.querySelector('gui-control');
const storageKey = 'particles';
const svg = document.getElementById('svg');

GUI.addRange('Particles', 35, '', { min: 1, max: 75, name: 'particles' });
GUI.addRange('Proximity', 50, '', { min: 1, max: 100, name: 'proximity' });
GUI.addRange('Radius Max', 1.5, '', { min: 1, max: 8, step: 0.01, name: 'radius' });
GUI.addColor('Color', '#ff0055', '', { name: 'color' });
GUI.addRange('Scale', 1, '', { min: 0, max: 2, step: 0.025, name: 'scale' });
common.commonConfig(GUI, '#080828');
GUI.addEventListener('gui-input', (event) => common.handleGuiEvent(event, svg, GUI, storageKey, particles));
common.init(GUI, storageKey, []);

/* === MAIN FUNCTION === */

function particles(svg, controls) {
	const { width, height } = common.getViewBox(svg);

	const particles = controls.particles.valueAsNumber;
	const proximity = controls.proximity.valueAsNumber;
	const radius = controls.radius.valueAsNumber;
	const scale = controls.scale.valueAsNumber;

	const coords = (amount, w, h) => {
		return Array.from({ length: amount }, () => {
			let x = (Math.random() * 0.96875 + 0.015625) * w;
			let y = (Math.random() * 0.96875 + 0.015625) * h;
			return [x, y];
		});
	};

	const [h, s, l] = common.hexToHSL(controls.color.value);
	const points = coords(particles, width, height);

	const elements = points.map(([x, y]) => {
		const lines = points.map(([x1, y1]) => {
			const distance = Math.sqrt((x1 - x) ** 2 + (y1 - y) ** 2);
			const alpha = 1 - distance / proximity;
			return alpha > 0 
				? `<line x1="${x1}" y1="${y1}" x2="${x}" y2="${y}" stroke="hsla(${h},${s}%,${l}%,${alpha})" stroke-width="0.15" />` 
				: '';
		}).join('');
		const circle = `<circle cx="${x}" cy="${y}" r="${common.random(0.125, radius)}" fill="hsla(${h},${s}%,${l}%)" />`;
		return lines + circle;
	}).join('');

	const translateX = width * (1 - scale) / 2;
	const translateY = height * (1 - scale) / 2;

	svg.innerHTML = `<g transform="translate(${translateX} ${translateY}) scale(${scale})">${elements}</g>`;
}
