import * as common from '../common.js';

const GUI = document.querySelector('gui-control');
const storageKey = 'intercation';
const svg = document.getElementById('svg');
GUI.addColor('Color', '#BD1A46', '', { name: 'color' });
GUI.addCheckbox('Rotate', false, '', { name: 'rotate', checked: 'checked' });
common.commonConfig(GUI, '#F0F1EC');
GUI.addEventListener('gui-input', (event) => common.handleGuiEvent(event, svg, GUI, storageKey, interactionColor));
common.init(GUI, storageKey, []);

/* === MAIN FUNCTION === */

function interactionColor(svg, controls) {
	const { width, height } = common.getViewBox(svg);
	const rotate = controls.rotate.checked;
	let [H, S, L] = common.hexToHSL(controls.color.value);

	const rectHeight = height / 8;
	const rectWidth = rectHeight * 3.8;
	const xPos = (width - rectWidth) / 2;

	svg.innerHTML = `
		<g>
			<rect x="${xPos}" y="${0 * rectHeight}" width="${rectWidth}" height="${rectHeight}" 
				fill="hsl(${H + 26}, ${S + 5}%, ${L + 27}%)" 
				${rotate ? 'transform="rotate(-4) translate(0 11)"' : ''} />
			
			<rect x="${xPos}" y="${1 * rectHeight}" width="${rectWidth}" height="${rectHeight}" 
				fill="hsl(${H + 26}, ${S + 1}%, ${L + 12}%)" 
				${rotate ? 'transform="rotate(4) translate(5 1.5)"' : ''} />
			
			<rect x="${xPos}" y="${2 * rectHeight}" width="${rectWidth}" height="${rectHeight}" 
				fill="hsl(${H + 14}, ${S - 3}%, ${L + 19}%)" 
				${rotate ? 'transform="rotate(-2) translate(5 10.5)"' : ''} />
			
			<rect x="${xPos}" y="${3 * rectHeight}" width="${rectWidth}" height="${rectHeight}" 
				fill="hsl(${H + 15}, ${S - 9}%, ${L + 4}%)" 
				${rotate ? 'transform="rotate(-2.5) translate(-6 5.5)"' : ''} />
			
			<rect x="${xPos}" y="${4 * rectHeight}" width="${rectWidth}" height="${rectHeight}" 
				fill="hsl(${H + 12}, ${S + 3}%, ${L + 29}%)" 
				${rotate ? 'transform="rotate(12) translate(22.5 -12)"' : ''} />
			
			<rect x="${xPos}" y="${5 * rectHeight}" width="${rectWidth}" height="${rectHeight}" 
				fill="hsl(${H + 8}, ${S - 33}%, ${Math.max(0, L + 12)}%)" 
				${rotate ? 'transform="rotate(0.51) translate(15 -1)"' : ''} />
			
			<rect x="${xPos}" y="${7 * rectHeight}" width="${rectWidth}" height="${rectHeight}" 
				fill="hsl(${H}, ${S}%, ${L}%)" 
				${rotate ? 'transform="rotate(4.5) translate(10 -12)"' : ''} />
				
			<rect x="${xPos}" y="${6 * rectHeight}" width="${rectWidth}" height="${rectHeight}" 
				fill="hsl(${H + 27}, ${S + 7}%, ${L + 13}%)" 
				${rotate ? 'transform="translate(7.5 -5.5)"' : ''} />
		</g>`;
}
