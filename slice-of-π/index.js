import * as common from '../common.js';
const GUI = document.querySelector('gui-control');
const storageKey = 'π';
const svg = document.getElementById('svg');

const PI_DIGITS = "3141592653589793238462643383279502884197169399375105820974944592307816406286208998628034825342117067982148086513282306647093844609550582231725359408128481117450284102701938521105559644622948954930381964428810975665933446128475648233786783165271201909145648566923460348610454326648213393607260249141273724587006606315588174881520920962829254091715364367892590360011330530548820466521384146951941511609433057270365759591953092186117381932611793105118548074462379962749567351885752724891227938183011949129833673362440656643086021394946395224737190702179860943702770539217176293176752384674818467669405132000568127145263560827785771342757789609173637178721468440901224953430146549585371050792279689258923542019956112129021960864034418159813629774771309960518707211349999998372978049951059731732816096318595024459455346908302642522308253344685035261931188171010003137838752886587533208381420617177669147303598253490428755468731159562863882353787593751957781857780532171226806613001927876611195909216420198";

GUI.addRange('Gridsize', 4, '', { min: 2, max: 32, step: 2, name: 'gridsize' });
GUI.addSelect('Palette', 'Masonite Too', '', { 
  options: [
    { key: 'Bauhaus Originals', value: '#e47a2c #baccc0 #6c958f #40363f #d7a26c #ae4935 #f7e6d4 #c25528 #8b7756 #496b67 #745a63 #ebc096 #863625 #dfd1c5 #f09c5a #95b1a5 #305047 #231c21' }, 
    { key: 'Weimar Heritage', value: '#4f507d #aba59f #eba027 #1f1c16 #998a74 #e2471f #56704a #e2805f #686ca3 #7d7872 #d9870e #3a3832 #b3a590 #b8381a #3e513a #cd6748 #7a7ca5 #c5c0bd' },
    { key: 'Modernist Spectrum', value: '#D32F2F #1976D2 #FFC107 #388E3C #F57C00 #7B1FA2 #455A64 #FBC02D #9C1E1E #0D5AA0 #E6A800 #276C2C #BC6000 #5E1785 #2F3E45 #F59800 #E35C5C #42A5F5' },
    { key: 'Classic Bauhaus Tones', value: '#A63334 #3E5F8A #F2BF7C #7D807D #E7A95E #4C4B40 #83988E #D9C9A5 #7E2425 #294268 #E8A452 #5C5F5A #D99032 #2F2E24 #5C726A #C5AF7F #C25956 #6085B6' },
    { key: 'Dusty Weimar Shades', value: '#8D5A4A #526A82 #C4A981 #6A706E #B5803A #635D52 #A4B3A2 #CFC1A4 #6B4437 #3A4D5E #B09166 #515756 #94682D #47443C #7E8B7C #B9AA8B #AC7C6B #6E8CA9' },
    { key: 'Industrial Grays', value: '#6B6E70 #4B4F52 #919497 #2D2E30 #A6A8AB #3A3C3F #C1C3C5 #787A7C #55585A #33373A #7D8084 #1A1B1D #8D8F93 #25272A #D6D8DC #9B9EA1 #3F4143 #242629' },
    { key: 'Muted Blue', value: '#4A637D #6E8499 #98A9B5 #2F4A66 #5B7490 #7D92A6 #A3B3C0 #3E5C7A #374A5E #5D7185 #7D8D9A #223B54 #496179 #617992 #8E9DAA #2D4B6A #294057 #4C6279' },
    { key: 'Muted Terracotta', value: '#A2543A #B67F5E #D2A98A #8F6C5A #E8C3A6 #704B3E #C0876C #5A3D31 #7E4029 #9F6848 #C08C6B #6E5346 #D9AA8B #583B30 #A36F58 #442E25 #B36B50 #D4BDA4' },
    { key: 'Autumn Modernism', value: '#7F4E2A #9B7042 #C49973 #5D6A5B #A77A4A #8C5B39 #B89675 #6E553C #653D1F #8D5F30 #B78754 #485249 #986B3F #704828 #A48665 #584229 #AD693B #D5B99C' },
    { key: 'Vintage Pastels', value: '#9A7F6B #A99488 #D1B5AC #82746E #B2A196 #C7B8AE #E3D4CD #746258 #856A57 #968073 #C09E93 #665952 #A08E82 #B4A399 #D6C0B6 #5A4A42 #B59888 #DBD0C7' },
    { key: 'Olive & Ochre', value: '#5D5B39 #75744A #B3B077 #8A8558 #A39F6E #6E6C4D #D2CE98 #8F8D64 #49472C #626139 #9E9B66 #76724A #8A875A #5A593D #C4C080 #7A7752 #383625 #CECA8A' },
    { key: 'Pink Caviar', value: '#DDC09B #DDD8B9 #4B3985 #D96028 #3B0B04 #9F9C99 #437D3D #F7C945 #F3F0E7 #020003 #191B59 #A22017 #C9AD89 #BFBCA0 #362B61 #AE4F21 #5D0A06 #7C7976' },
    { key: 'Masonite', value: '#BB3331 #8A8D95 #F3D654 #882D2F #463781 #A16834 #47A2CD #C75C91 #E2713C #273D78 #999DA1 #DF6738 #885F54 #204E3E #D1C74C #2B6767 #8F2726 #74767D' },
    { key: 'Masonite Too', value: '#141414 #C13431 #3581C0 #2C674A #28638A #C74533 #66589F #E37242 #9594A1 #2A634A #7A8EAD #C4893D #244C94 #BB7142 #E9973E #D75235 #080808 #972825' }
  ], 
  name: 'palette'
});

GUI.addRange('Scale', 1, '', { min: 0, max: 2, step: 0.025, name: 'scale' });
common.commonConfig(GUI, '#FFFFFF');
GUI.addEventListener('gui-input', (event) => common.handleGuiEvent(event, svg, GUI, storageKey, sliceOfPi));
common.init(GUI, storageKey, []);

/* === MAIN FUNCTION === */

function sliceOfPi(svg, controls) {
  const { width, height } = common.getViewBox(svg);
  const palette = controls.palette.value.split(/\s+/);

  const colorMap = {};
  for (let digit = 1; digit <= 8; digit++) {
    colorMap[digit] = [palette[(digit-1) * 2], palette[(digit-1) * 2 + 1]];
  }
  
  // Special cases for 0 and 9
  colorMap[0] = [palette[16], palette[16]];
  colorMap[9] = [palette[17], palette[17]];

  const gridsize = controls.gridsize.valueAsNumber;
  const scale = controls.scale.valueAsNumber || 1;

  const cellSize = Math.min(width, height) / gridsize;
  const cols = Math.floor(width / cellSize);
  const rows = Math.floor(height / cellSize);
  const patternWidth = cellSize * cols;
  const patternHeight = cellSize * rows;
  const scaledPatternWidth = patternWidth * scale;
  const scaledPatternHeight = patternHeight * scale;

  const offsetX = (width - scaledPatternWidth) / 2;
  const offsetY = (height - scaledPatternHeight) / 2;
  svg.setAttribute('shape-rendering', 'crispEdges');

  // Generate pattern content
  let patternContent = '';
  const smallRectSize = cellSize / 3;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Get Pi digit for this cell
      const position = row * cols + col;
      const piDigit = parseInt(PI_DIGITS.charAt(position % PI_DIGITS.length));
      const [colorOne, colorTwo] = colorMap[piDigit];
      
      // Base cell (background)
      patternContent += `<rect x="${col * cellSize}" y="${row * cellSize}" width="${cellSize}" height="${cellSize}" fill="${colorTwo}" shape-rendering="crispEdges" />`;
      
      // Skip small rectangles for digit 0
      if (piDigit === 0) continue;
      
      // For digit 9, fill all small rectangles with colorOne
      if (piDigit === 9) {
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            patternContent += `<rect x="${col * cellSize + j * smallRectSize}" y="${row * cellSize + i * smallRectSize}" width="${smallRectSize}" height="${smallRectSize}" fill="${colorOne}" shape-rendering="crispEdges" />`;
          }
        }
        continue;
      }

      let remainingToFill = piDigit;
      for (let i = 0; i < 3 && remainingToFill > 0; i++) {
        for (let j = 0; j < 3 && remainingToFill > 0; j++) {
          const fillColor = remainingToFill > 0 ? colorOne : colorTwo;
          patternContent += `<rect x="${col * cellSize + j * smallRectSize}" y="${row * cellSize + i * smallRectSize}" width="${smallRectSize}" height="${smallRectSize}" fill="${fillColor}" shape-rendering="crispEdges" />`;
          remainingToFill--;
        }
      }
    }
  }

  svg.innerHTML = `
  <defs>
    <pattern id="squares" width="${patternWidth}" height="${patternHeight}" patternUnits="userSpaceOnUse" shape-rendering="crispEdges">
      ${patternContent}
    </pattern>
  </defs>
  <g transform="translate(${offsetX} ${offsetY}) scale(${scale})">
    <rect width="${patternWidth}" height="${patternHeight}" fill="url(#squares)" shape-rendering="crispEdges" />
  </g>`;
}
