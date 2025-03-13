import * as common from '../common.js';
const GUI = document.querySelector('gui-control');
const storageKey = 'subwaymap';
const svg = document.getElementById('svg');

GUI.addRange('Lines', 8, '', { min: 2, max: 20, name: 'lines' });
GUI.addSelect('Palette', 'Subway', '', { 
  options: [
    {
      key: 'Subway',
      value: '#FF0A0A #008D41 #009CD3 #FFC600 #FF6319 #6CBE45 #FF8080 #80C6A0 #80CEE9 #FFE380 #FFB18C #B5DFA2'
    },
    {
      key: 'Stanley Donwood',
      value: '#D0001D #0D5436 #093588 #FDA223 #F8551A #101624 #EAEFF0'
    },
		{
			key:  'Pink Caviar',
			value: '#DDC09B #DDD8B9 #4B3985 #D96028 #3B0B04 #9F9C99 #437D3D #F7C945 #F3F0E7 #020003 #191B59 #A22017'
		},
		{
			key:  'Masonite', 
			value: '#BB3331 #8A8D95 #F3D654 #882D2F #463781 #A16834 #47A2CD #C75C91 #E2713C #273D78 #999DA1 #DF6738 #885F54 #204E3E #D1C74C #2B6767',
			extra: '#141414 #C13431 #3581C0 #2C674A #28638A #C74533 #66589F #E37242 #9594A1 #2A634A #7A8EAD #C4893D #244C94 #BB7142 #E9973E #D75235',
		}
  ],
  name: 'palette'
});
common.commonConfig(GUI, '#E7E7E7');
GUI.addEventListener('gui-input', (event) => common.handleGuiEvent(event, svg, GUI, storageKey, subwayMap));
common.init(GUI, storageKey, []);

/* === MAIN FUNCTION === */

function subwayMap(svg, controls) {
  const { width, height } = common.getViewBox(svg);
  const subwayLines = controls.lines.valueAsNumber;
  const margin = 5;
  const elements = [];
  
  // Original colors and their lighter versions
  const colors = controls.palette.value.split(' ');

  const generateSubwayLine = () => {
    const points = [];
    const numPoints = Math.floor(Math.random() * 3) + 3;
    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: margin + Math.random() * (width - margin * 2),
        y: margin + Math.random() * (height - margin * 2),
      });
    }
    const path = points.reduce((acc, point, i) => {
      if (i === 0) return `M ${point.x} ${point.y}`;
      const prev = points[i - 1];
      const cpLen = Math.hypot(point.x - prev.x, point.y - prev.y) * 0.5;
      const cp1x = prev.x + cpLen;
      const cp1y = prev.y;
      const cp2x = point.x - cpLen;
      const cp2y = point.y;
      return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${point.x} ${point.y}`;
    }, '');
    return { path, points };
  };

  const paths = [];
  const stations = [];

  for (let i = 0; i < subwayLines; i++) {
    const color = colors[i % colors.length];
    const { path, points } = generateSubwayLine();
    const isDashed = i > 5 && Math.random() < 0.5 ? ' stroke-dasharray="2"' : '';
    
    paths.push(`<path d="${path}" fill="none" stroke="${color}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"${isDashed}/>`);
    stations.push(
      `<circle cx="${points[0].x}" cy="${points[0].y}" r="1" fill="white" stroke="black" stroke-width=".5"/>`,
      `<circle cx="${points[points.length - 1].x}" cy="${points[points.length - 1].y}" r="1" fill="white" stroke="black" stroke-width=".5"/>`
    );
  }

  svg.innerHTML = `<g>${paths.join('')}${stations.join('')}</g>`;
}
