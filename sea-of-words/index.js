import * as common from '../common.js';
const GUI = document.querySelector('gui-control');
const storageKey = 'words';
const svg = document.getElementById('svg');

GUI.addRange('Lines', 25, '', { min: 2, max: 50, name: 'lines' });
GUI.addRange('Size start', 1, '', { min: 0.1, max: 20, step: 0.1, name: 'sizestart' });
GUI.addRange('Size end', 12, '', { min: 0.1, max: 20, step: 0.1, name: 'sizeend' });
GUI.addRange('Density', 4, '', { min: 1, max: 6, step: 0.1, name: 'density' });
GUI.addColor('Start color', '#263773', '', { name: 'startcolor' });
GUI.addColor('End color', '#8c9dd9', '', { name: 'endcolor' });
GUI.addSelect('Font family', 'fontfamily', '', { 
  options: [
    { key: 'Just Another Hand', value: 'Just Another Hand, cursive' },
    { key: 'Antique', value: 'Superclarendon, Bookman Old Style, URW Bookman, URW Bookman L, Georgia Pro, Georgia, serif' },
    { key: 'Code', value: 'ui-monospace, Cascadia Code, Source Code Pro, Menlo, Consolas, DejaVu Sans Mono, monospace' },
    { key: 'Didone', value: 'Didot, Bodoni MT, Noto Serif Display, URW Palladio L, P052, Sylfaen, serif' },
    { key: 'Handwritten', value: 'Segoe Print, Bradley Hand, Chilanka, TSCu_Comic, casual, cursive' },
    { key: 'Rounded', value: 'ui-rounded, Hiragino Maru Gothic ProN, Quicksand, Comfortaa, Manjari, Arial Rounded MT, Arial Rounded MT Bold, Calibri, source-sans-pro, sans-serif' },
    { key: 'Slab Serif', value: 'Rockwell, Rockwell Nova, Roboto Slab, DejaVu Serif, Sitka Small, serif' },
    { key: 'System UI', value: 'system-ui, sans-serif'}
  ],
  'name': 'fontfamily'
});
GUI.addSelect('Case', 'uppercase', '', { 
  options: [
    { key: 'none', value: 'normal' },
    { key: 'lowercase', value: 'lowercase' },
    { key: 'uppercase', value: 'uppercase' },
    { key: 'capitalize', value: 'capitalize' }
  ],
  'name': 'texttransform'
});
GUI.addTextArea('Words', 'abundance accomplish achievement action adventureaffection ambition appreciation articulate aspirationawesome balance beauty believe blissbrilliant calm carefree celebrate charmcheerful clarity comfort compassion confidencecourage creativity delight determination dignitydream dynamic eager ecstasy eleganceembrace empower enchanting enthusiasm epicexcellent exuberant fabulous faith fantasticflourish fortune freedom friendly fulfillmentgenerous genius genuine glory gracegratitude harmony happiness healing heartwarminghope ideal imagination inspiration integrityjoy jubilant kindness laughter libertylively love magnificent marvelous miraclemotivation noble optimism passion peaceperseverance playful positive prosperity radiantremarkable resilient serenity sincere spectacularstrength success sunshine tranquil triumphvibrant victory wisdom wonderful zest', '', { name: 'words' });
GUI.addRange('Scale', 1, '', { min: 0, max: 1, step: 0.025, name: 'scale' });
common.commonConfig(GUI, '#EAE8DF');
GUI.addEventListener('gui-input', (event) => common.handleGuiEvent(event, svg, GUI, storageKey, drawWords));
common.init(GUI, storageKey, []);

/*=== MAIN FUNCTION ===*/

function drawWords(svg, controls) {
  const { width, height } = common.getViewBox(svg);
  const charDensity = controls.density.valueAsNumber;
  const endColor = controls.endcolor.value;
  const endFontSize = controls.sizeend.valueAsNumber;
  const lines = controls.lines.valueAsNumber;
  const scale = controls.scale.valueAsNumber;
  const startColor = controls.startcolor.value;
  const startFontSize = controls.sizestart.valueAsNumber;
  const words = controls.words.value.split(/\s+/);

  let output = '';
  let totalFontSize = 0;
  const maxHeight = height;
  const textLength = width;

  for (let i = 0; i < lines; i++) {
    const factor = i / (lines - 1);
    totalFontSize += common.interpolate(startFontSize, endFontSize, factor);
  }

  let accumulatedHeight = 0;

  for (let i = 0; i < lines; i++) {
    const factor = i / (lines - 1);
    const fontSize = common.interpolate(startFontSize, endFontSize, factor);
    const normalizedFontSize = (fontSize / totalFontSize) * maxHeight;
    const color = common.interpolateColor(startColor, endColor, factor);
    const charLength = Math.round((textLength / fontSize) * charDensity);

    let sentence = '';
    while (sentence.length < charLength) {
      const randomIndex = Math.floor(Math.random() * words.length);
      const word = words[randomIndex];
      if ((sentence.length + word.length + 1) <= charLength) {
        sentence += (sentence ? ' ' : '') + word;
      } else {
        break;
      }
    }

    accumulatedHeight += normalizedFontSize;
    const yPosition = accumulatedHeight;

    const textElement = `<text y="${yPosition}" font-size="${fontSize}" fill="${color}" textLength="${textLength}">${sentence}</text>`;
    output += textElement;
  }

  const centerX = (width - width * scale) / 2;
  const centerY = (height - height * scale) / 2;
  const svgContent = `
  <defs>
    <style type="text/css">
      @import url('https://fonts.googleapis.com/css2?family=Just+Another+Hand&display=swap');
    </style>
  </defs>
  <g transform="translate(${centerX} ${centerY}) scale(${scale})">${output}</g>`;
  svg.innerHTML = svgContent;
}
