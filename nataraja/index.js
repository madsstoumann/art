import * as common from '../common.js';
const GUI = document.querySelector('gui-control');
const storageKey = 'natraja';
const svg = document.getElementById('svg');

GUI.addRange('Columns', 20, '', { min: 1, max: 50, value: 10, name: 'columns' });
GUI.addRange('Rows', 22, '', { min: 1, max: 50, value: 10, name: 'rows' });
GUI.addRange('Skew', -45, '', { min: -45, max: 45, name: 'skew' });
GUI.addColor('Start hue', '#ff0000', '', { name: 'starthue' });
GUI.addColor('End hue', '#ff0080', '', { name: 'endhue' });
common.commonConfig(GUI);
GUI.addEventListener('gui-input', (event) => common.handleGuiEvent(event, svg, GUI, storageKey, nataraja));
common.init(GUI, storageKey, []);

/* === MAIN FUNCTION === */

function nataraja(svg, controls) {
	const { width, height } = common.getViewBox(svg);
	const columns = controls.columns.valueAsNumber;
	const rows = controls.rows.valueAsNumber;
	const startHue = common.hexToHSL(controls.starthue.value)[0];
	const endHue = common.hexToHSL(controls.endhue.value)[0];
	const skew = controls.skew.valueAsNumber;

	const colWidth = width / columns;
	const rowHeight = height / rows;
	const totalRows = rows * 2;

	svg.innerHTML = [...new Array(columns)].map((_col, colIndex) => {
		let rowHTML = '';
		for (let rowIndex = 0; rowIndex < totalRows; rowIndex++) {
			const span = Math.random() < 0.2 ? Math.floor(Math.random() * (3 - 2 + 1)) + 2 : 1;
			const actualSpan = Math.min(span, totalRows - rowIndex);
			const yPos = (rowIndex < rows ? rowIndex : rowIndex - rows) * rowHeight + (rowIndex >= rows ? height : 0);
			rowHTML += `
				<rect width="${colWidth}" height="${rowHeight * actualSpan}" x="${colWidth * colIndex}" y="${yPos}" fill="hsl(${
					common.random(startHue, endHue)}, ${common.random(50, 80)}%, ${common.random(50, 80)}%)">
				</rect>`;
				rowIndex += actualSpan - 1;
			}
		const translateY = skew > 0 ? -height : 0;
		return `<g transform="skewY(${skew}) translate(0, ${translateY})">${rowHTML}</g>`;
	}).join('');
}
