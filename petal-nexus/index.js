import * as common from '../common.js';
const GUI = document.querySelector('gui-control');
const storageKey = 'petalnexus';
const svg = document.getElementById('svg');

GUI.addRange('Petals', 12, '', { min: 5, max: 30, name: 'petals' });
GUI.addRange('Rings', 4, '', { min: 1, max: 8, name: 'rings' });
GUI.addRange('Petal height', 15, '', { min: 2, max: 25, step: 0.1, value: 10, name: 'petalheight' });
GUI.addRange('Petal width', 5, '', { min: 0, max: 10, step: 0.1, value: 0, name: 'petalwidth' });
GUI.addColor('Petal color', '#a20b3e', '', { name: 'petalcolor' });
GUI.addCheckbox('Saturate', '0', '', { 'data-unchecked': '0', name: 'saturate', checked: 'checked' });
GUI.addColor('Line color', '#e0ac10', '', { name: 'stroke' });
GUI.addRange('Line width', 0.15, '', { min: 0, max: 5, value: 0, step: 0.01, name: 'strokewidth' });
GUI.addColor('Pistil color', '#e0ac10', '', { name: 'pistilcolor' });
GUI.addRange('Pistil size', 4, '', { min: 0, max: 40, name: 'pistilsize' });
GUI.addRange('Scale', 1.2, '', { min: 0, max: 2, step: 0.025, name: 'scale' });
common.commonConfig(GUI, '#326748');
GUI.addEventListener('gui-input', (event) => common.handleGuiEvent(event, svg, GUI, storageKey, petalNexus));
common.init(GUI, storageKey, []);

/* === MAIN FUNCTION === */

function petalNexus(svg, controls) {
	const { width, height } = common.getViewBox(svg);
	const numPetals = controls.petals.valueAsNumber;
	const numRings = controls.rings.valueAsNumber;
	const petalColor = controls.petalcolor.value;
	const petalHeight = controls.petalheight.valueAsNumber;
	const petalWidth = controls.petalwidth.valueAsNumber;
	const pistilColor = controls.pistilcolor.value;
	const pistilSize = controls.pistilsize.valueAsNumber;
	const scale = controls.scale.valueAsNumber;
	const saturate = controls.saturate.checked;

	const baseAngle = 360 / numPetals;
	const ellipseRx = petalWidth ? petalWidth : 22 / numPetals;
	const ellipseRy = petalHeight;
	const [hue, baseSaturation, baseLightness] = common.hexToHSL(petalColor);

	const polarToCartesian = (r, degrees) => {
		const radians = degrees * Math.PI / 180.0;
		return [r * Math.cos(radians), r * Math.sin(radians), degrees];
	};

	const data = Array.from({ length: numRings }, (_, ringIndex) => {
		const currentRadius = pistilSize + ringIndex * (ellipseRy * 0.1);
		const currentNumPetals = numPetals;
		const angleOffset = (360 / currentNumPetals) * ringIndex;
		return Array.from({ length: currentNumPetals }, (_, index) => {
			const angle = (360 / currentNumPetals) * index + angleOffset;
			return polarToCartesian(currentRadius, angle);
		});
	});

	const ringRotationAngles = Array.from({ length: numRings }, (_, index) => {
    switch (index) {
			case 0: return 0;
			case 1: return baseAngle / 2;
			case 2: return baseAngle / 4;
			case 3: return 3 * baseAngle / 4;
			case 4: return baseAngle;
			default: return (index % 2 === 0) ? (index / 2) * baseAngle / 4 : ((index + 1) / 2) * baseAngle / 2;
    }
	});

	svg.innerHTML = `
	<g transform="translate(${width / 2} ${height / 2}) scale(${scale})">
		<circle cx="0" cy="0" r="${pistilSize * 2}" fill="${pistilColor}"></circle>
		${data.reverse().map((ring, ringIndex) => {
			const rotation = ringRotationAngles[ringIndex];
			return `
				<g transform="rotate(${rotation})">
					${ring.map(([x, y, angle]) => {
						const saturation = saturate ? baseSaturation * (0.75 + 0.25 * Math.random()) : baseSaturation;
						const lightness = saturate ? baseLightness * (0.95 + 0.35 * Math.random()) : baseLightness;
						return `<ellipse cx="${x}" cy="${y - ellipseRy}" rx="${ellipseRx}" ry="${ellipseRy}" transform="rotate(${angle + 90} ${x} ${y})" fill="hsl(${hue}, ${saturation}%, ${lightness}%)"></ellipse>`;
					}).join('')}
				</g>`;
		}).join('')}
	</g>`;
}
