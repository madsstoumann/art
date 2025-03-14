import * as common from '../common.js';
const GUI = document.querySelector('gui-control');
const storageKey = 'hypnotic';
const svg = document.getElementById('svg');

GUI.addRange('Rings', 25, '', { min: 1, max: 50, name: 'rings' });
GUI.addRange('Stroke W', 0.5, '', { min: 0.1, max: 5, step: 0.1, name: 'strokeWidth' });
GUI.addSelect('Palette', 'Default', '', { 
  options: [
    {
      key: 'Default',
      value: '#8577C7 #59B64C #E67E33 #B22E2F #3E6740 #9E7B35'
    },
		{
			key: 'Untitled 1966—67 A',
			value: '#A0262A #7C6E2E #C586B2 #7B6D2C #D5E7E3 #E6EDEA #B57D33 #E8F0EC #7F6626 #ECF1ED #A12728 #C19739 #C98BB3 #C19A3A #D5E9E6 #13366A #B68234 #13366A #836B28 #143869 #A5282B #090B0F #CC8CB4 #08090D #D8EAE5'
		},
		{
			key:  'Untitled 1966—67 B',
			value: '#514F5F #787683 #B6B3C7 #797784 #434645 #9BA7C8 #898098 #95A1C0 #3D413F #919EBA #555363 #525659 #BBB4CB #4C5153 #434645 #FFFFFF #908AA1 #FFFFFF #3C4240 #FFFFFF #525060 #6C6A79 #B9B2CA #6B687A #444746'
		},
		{
			key: 'Untitled 1966—67 C',
			value: '#D4AD61 #59240E #F6DAB2 #5A250E #F0E2C3 #F4F2ED #441215 #F5F3EF #2B0F16 #F6F5EF #D5AD5F #0C0B0E #F6DBB6 #0D0C0F #EEE2C5 #AC7F32 #451316 #AC7F32 #2B0F16 #B28334 #D2A95D #140D12 #F1D5AD #170E13 #EEDEC1'
		},
		{
			key: 'Untitled 1966—67 D',
			value: '#D1AF40 #F1CDCD #D8B041 #F5D5D5 #143945 #E0C0D7 #6E9999 #E5C3D7 #162867 #E6C6DC #D4B141 #15396C #DAB142 #173F75 #163E4C #2C673F #71999A #2D6840 #162867 #306E42 #CFAD40 #7B1A1D #D9B041 #7C1B27 #18414E'
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
GUI.addRange('Scale', 1, '', { min: 0, max: 2, step: 0.025, name: 'scale' });
common.commonConfig(GUI, '#082326');
GUI.addEventListener('gui-input', (event) => common.handleGuiEvent(event, svg, GUI, storageKey, hypnotic));
common.init(GUI, storageKey, []);

/* === MAIN FUNCTION === */

function hypnotic(svg, controls) {
  const { width, height } = common.getViewBox(svg);
  const centerX = width / 2;
  const centerY = height / 2;

  const palette = controls.palette.value.split(/\s+/);
  const rings = controls.rings.valueAsNumber;
  const scale = controls.scale.valueAsNumber || 1;
  const strokeWidth = controls.strokeWidth.valueAsNumber || 0;

  const elements = Array.from({ length: rings }, (_, i) => {
    const radius = (i + 1) * 360 / rings / 8;
    const color = palette[i % palette.length];
    return `
      <circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" />
    `;
  }).join('');

  const scaledCenterX = (width - width * scale) / 2;
  const scaledCenterY = (height - height * scale) / 2;
  svg.innerHTML = `<g transform="translate(${scaledCenterX} ${scaledCenterY}) scale(${scale})">
    ${elements}
  </g>`;
}