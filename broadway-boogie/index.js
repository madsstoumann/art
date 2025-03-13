import * as common from '../common.js';

const GUI = document.querySelector('gui-control');
const storageKey = 'broadwayboogie';
const svg = document.getElementById('svg');

// Canvas: #ad4835, #e9d3b0

GUI.addRange('Grid', 50, '', { min: 5, max: 100, name: 'gridsize' });

GUI.addSelect('Palette', 'Mondrian', '', { 
  options: [
		{ key: 'Mondrian', value: '#E8CD26 #9F3E37 #4469B9 #E0E2DF' },
    { key: 'Bauhaus Originals', value: '#e47a2c #baccc0 #6c958f #40363f #d7a26c #ae4935 #f7e6d4' }, 
    { key: 'Weimar Heritage', value: '#4f507d #aba59f #eba027 #1f1c16 #998a74 #e2471f #56704a #e2805f' },
    { key: 'Modernist Spectrum', value: '#D32F2F #1976D2 #FFC107 #388E3C #F57C00 #7B1FA2 #455A64 #FBC02D' },
    { key: 'Classic Bauhaus Tones', value: '#A63334 #3E5F8A #F2BF7C #7D807D #E7A95E #4C4B40 #83988E #D9C9A5' },
    { key: 'Dusty Weimar Shades', value: '#8D5A4A #526A82 #C4A981 #6A706E #B5803A #635D52 #A4B3A2 #CFC1A4' },
    { key: 'Industrial Grays', value: '#6B6E70 #4B4F52 #919497 #2D2E30 #A6A8AB #3A3C3F #C1C3C5 #787A7C' },
		{ key: 'Muted Blue', value: '#4A637D #6E8499 #98A9B5 #2F4A66 #5B7490 #7D92A6 #A3B3C0 #3E5C7A' },
    { key: 'Muted Terracotta', value: '#A2543A #B67F5E #D2A98A #8F6C5A #E8C3A6 #704B3E #C0876C #5A3D31' },
    { key: 'Autumn Modernism', value: '#7F4E2A #9B7042 #C49973 #5D6A5B #A77A4A #8C5B39 #B89675 #6E553C' },
    { key: 'Vintage Pastels', value: '#9A7F6B #A99488 #D1B5AC #82746E #B2A196 #C7B8AE #E3D4CD #746258' },
    { key: 'Olive & Ochre', value: '#5D5B39 #75744A #B3B077 #8A8558 #A39F6E #6E6C4D #D2CE98 #8F8D64' },
  ], 
  name: 'palette'
});

common.commonConfig(GUI, '#F0F1EC');
GUI.addEventListener('gui-input', (event) => common.handleGuiEvent(event, svg, GUI, storageKey, bauhaus));
common.init(GUI, storageKey, []);

/* === MAIN FUNCTION === */

function bauhaus(svg, controls) {
	const { width, height } = common.getViewBox(svg);
	const gridsize = controls.gridsize.valueAsNumber;
  const colors = controls.palette.value.split(' ');
	
	const rectHeight = width / gridsize;
	const elements = '';
	// const elements = [...new Array(gridsize * gridsize)].map((_cell, cellIndex) => {
	// 	const colIndex = cellIndex % columns;
	// 	const rowIndex = Math.floor(cellIndex / columns);

	// 	return `
	// 		<rect width="${boxWidth}" height="${boxWidth}" fill="${bgFill}" />
	// 		`;
	// }).join('');

	svg.innerHTML = `
		<g transform="translate(${width / 2} ${height / 2})>
			${elements}
		</g>`;
}
