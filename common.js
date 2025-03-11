import GuiControl from 'https://browser.style/ui/gui-control/index.js';
export { GuiControl };

/* === DOWNLOAD === */

function downloadContent(content, filename) {
	const type = getMimeType(filename);
	const blob = new Blob([content], { type });
	const link = document.createElement('a');
	link.href = URL.createObjectURL(blob);
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(link.href);
}

function getMimeType(filename) {
	const extension = filename.split('.').pop().toLowerCase();
	switch (extension) {
		case 'txt': return 'text/plain';
		case 'html': return 'text/html';
		case 'css': return 'text/css';
		case 'js': return 'application/javascript';
		case 'json': return 'application/json';
		case 'xml': return 'application/xml';
		case 'svg': return 'image/svg+xml';
		case 'png': return 'image/png';
		case 'jpg': 
		case 'jpeg': return 'image/jpeg';
		case 'gif': return 'image/gif';
		case 'pdf': return 'application/pdf';
		default: return 'application/octet-stream';
	}
}

/* === SVG UTILS === */



export function createLinePath(id, startX, amplitude, lineWidth, frequency, height) {
	let d = '';
	for (let y = 0; y < height; y++) {
		const x = startX + Math.sin(y * frequency) * amplitude;
		if (y === 0) {
			d += `M${x},${y}`;
		} else {
			d += ` L${x},${y}`;
		}
	}

	const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
	path.setAttribute("id", id);
	path.setAttribute("d", d);
	path.setAttribute("stroke-width", lineWidth);
	path.setAttribute("fill", "none");
	return path;
}

export function meshPolygons(coords, xLines = 10, yLines = 10, hueStart = 0, hueEnd = 360) {
	const [c1, c2, c3, c4] = coords;
	const G = document.createElementNS("http://www.w3.org/2000/svg", "g");

	for (let i = 0; i < xLines; i++) {
		for (let j = 0; j < yLines; j++) {
			const t1 = i / xLines;
			const t2 = (i + 1) / xLines;
			const u1 = j / yLines;
			const u2 = (j + 1) / yLines;

			const x1 = (1 - t1) * c1[0] + t1 * c2[0];
			const y1 = (1 - t1) * c1[1] + t1 * c2[1];
			const x2 = (1 - t2) * c1[0] + t2 * c2[0];
			const y2 = (1 - t2) * c1[1] + t2 * c2[1];

			const x3 = (1 - t1) * c4[0] + t1 * c3[0];
			const y3 = (1 - t1) * c4[1] + t1 * c3[1];
			const x4 = (1 - t2) * c4[0] + t2 * c3[0];
			const y4 = (1 - t2) * c4[1] + t2 * c3[1];

			const xTopLeft = (1 - u1) * x1 + u1 * x3;
			const yTopLeft = (1 - u1) * y1 + u1 * y3;
			const xTopRight = (1 - u1) * x2 + u1 * x4;
			const yTopRight = (1 - u1) * y2 + u1 * y4;

			const xBottomLeft = (1 - u2) * x1 + u2 * x3;
			const yBottomLeft = (1 - u2) * y1 + u2 * y3;
			const xBottomRight = (1 - u2) * x2 + u2 * x4;
			const yBottomRight = (1 - u2) * y2 + u2 * y4;

			const rect = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
			rect.setAttribute("points", `${xTopLeft},${yTopLeft} ${xTopRight},${yTopRight} ${xBottomRight},${yBottomRight} ${xBottomLeft},${yBottomLeft}`);
			const hue = hueStart + Math.random() * (hueEnd - hueStart);
			const saturation = 40 + Math.random() * 40;
			const lightness = 30 + Math.random() * 30;
			rect.setAttribute("fill", `hsl(${hue}, ${saturation}%, ${lightness}%)`);

			G.appendChild(rect);
		}
	}
	return G;
}


export function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
	let angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
	return {
			x: centerX + (radius * Math.cos(angleInRadians)),
			y: centerY + (radius * Math.sin(angleInRadians))
	};
}

export function rotatePoint(cx, cy, x, y, angle) {
	const radians = (Math.PI / 180) * angle;
	const cos = Math.cos(radians);
	const sin = Math.sin(radians);
	const nx = (cos * (x - cx)) - (sin * (y - cy)) + cx;
	const ny = (sin * (x - cx)) + (cos * (y - cy)) + cy;
	return [nx, ny];
}

export function scalePoint(cx, cy, x, y, scale) {
	const dx = x - cx;
	const dy = y - cy;
	return [cx + dx * scale, cy + dy * scale];
}

export function getViewBox(svg) {
	const viewBox = svg.getAttribute("viewBox");
	if (!viewBox) {
			throw new Error("Invalid viewBox value");
	}

	const values = viewBox.split(' ').map(Number);
	if (values.length !== 4) {
			throw new Error("viewBox must have four values: min-x, min-y, width, and height");
	}

	const [minX, minY, width, height] = values;

	return { width, height };
}

/* === COLOR ===*/

export function brightness(r, g, b) {
	return (299 * r + 587 * g + 114 * b) / 1000
}

export function hexToHSL(hex) {
	hex = hex.replace(/^#/, '');
	if (hex.length === 3) {
		hex = hex.split('').map(x => x + x).join('');
	}
	const r = parseInt(hex.slice(0, 2), 16) / 255;
	const g = parseInt(hex.slice(2, 4), 16) / 255;
	const b = parseInt(hex.slice(4, 6), 16) / 255;
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	let h, s, l = (max + min) / 2;
	if (max === min) {
		h = s = 0;
	} else {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
		}
		h /= 6;
	}
	return [h * 360, s * 100, l * 100];
}

export function strToHEX(str) {
	const hash = strToHash(str, 5)
	const c = (hash & 0x00FFFFFF)
		.toString(16)
		.toUpperCase()
	return `#${'00000'.substring(0, 6 - c.length) + c}`
}

export function strToHSL(str, saturation = 50, lightness = 50) {
	const hash = strToHash(str, 25)
	return `hsl(${Math.abs(hash % 360)}, ${saturation}%, ${lightness}%)`
}

export function strToRGB(str) {
	const hash = strToHash(str, 10)
	const rgb = [];
	for (let i = 0; i < 3; i++) {
		const value = (hash >> (i * 8)) & 0xFF;
		rgb.push(value);
	}
	return rgb
}

function strToHash(str, lshift = 15) {
	let hash = 0
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << lshift) - hash)
	}
	return hash
}


export function interpolateColor(startColor, endColor, factor) {
	const parseColor = color => color.match(/\w\w/g).map(c => parseInt(c, 16));
	const toHex = num => num.toString(16).padStart(2, '0');
	
	const [r1, g1, b1] = parseColor(startColor);
	const [r2, g2, b2] = parseColor(endColor);

	const r = Math.round(interpolate(r1, r2, factor));
	const g = Math.round(interpolate(g1, g2, factor));
	const b = Math.round(interpolate(b1, b2, factor));

	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

/* === UTILS === */
export function interpolate(start, end, factor) { return start + (end - start) * factor; }
export function random(min, max) {return Math.random() * (max - min) + min }

/* === FORM === */

function serializeForm(form) {
	const formData = {};
	for (const element of form.elements) {
		if (element.name) {
			formData[element.name] = element.value;
		}
	}
	return formData;
}

 function storeFormData(form, keyName, storageKey) {
	const serializedData = serializeForm(form);
	const presets = JSON.parse(localStorage.getItem(storageKey)) || [];
	const newPreset = { key: keyName, value: serializedData };

	// Check if the preset already exists
	const existingIndex = presets.findIndex(preset => preset.key === keyName);
	if (existingIndex > -1) {
		presets[existingIndex] = newPreset;
	} else {
		presets.push(newPreset);
	}

	localStorage.setItem(storageKey, JSON.stringify(presets));
}

 function updatePresetOptions(selectElement, storageKey) {
	const presets = JSON.parse(localStorage.getItem(storageKey)) || [];
	selectElement.options.length = 1;

	presets.forEach(preset => {
		const option = document.createElement('option');
		option.value = JSON.stringify(preset.value);
		option.textContent = preset.key;
		selectElement.appendChild(option);
	});
}

function loadStoredForm(form, preset) {
	for (const [key, value] of Object.entries(preset)) {
		const input = form.elements[key];
		if (input) {
			if (input.type === 'checkbox') {
				input.checked = value === input.value;
			} else {
				input.value = value;
			}
			if (!input.dataset.action) input.dispatchEvent(new Event('input', { bubbles: true }));
		}
	}
}

export function commonConfig(GUI, canvasColor = '#ffffff', frameColor = '#f6c6a4') {
	const frameColors = [
		{ name: 'birch', value: '#f6c6a4' },
		{ name: 'maple', value: '#e1b382' },
		{ name: 'oak', value: '#d2b48c' },
		{ name: 'cherry', value: '#d2691e' },
		{ name: 'walnut', value: '#704214' },
		{ name: 'rosewood', value: '#65000b' },
		{ name: 'mahogany', value: '#4a2c2a' },
		{ name: 'ebony', value: '#0c0b0b' },
		{ name: 'brass', value: '#b5a642' },
		{ name: 'bronze', value: '#cd7f32' },
		{ name: 'silver', value: '#c0c0c0' },
		{ name: 'aluminum', value: '#a9a9a9' },
		{ name: 'gunmetal', value: '#2a3439' },
		{ name: 'black', value: '#000000' },
		{ name: 'white', value: '#ffffff' }
	];

	GUI.addDataList('framecolors', frameColors);
	GUI.addGroup('Settings & Tools', [
		(ul) => GUI.addColor('Canvas', canvasColor, '', { name: 'canvas' }, ul),
		(ul) => GUI.addColor('Frame', frameColor, '--frame-c', { name: 'frame', list: 'framecolors' }, ul),
		(ul) => GUI.addCheckbox('Show frame', '1em', '--frame-bdw', { name: 'showframe', checked: 'checked', 'data-unchecked': '0' }, ul),
		(ul) => GUI.addCheckbox('Full screen', '', '', { 'data-action': 'full-width' }, ul),
		(ul) => GUI.addSelect('Size', '', '', { 
			options: [
				{ key: '1:1 (square)', value: '0 0 100 100' },
				{ key: '1:1.25 (16x20in, 40.6x50.8cm)', value: '0 0 100 125' },
				{ key: '1.25:1 (20x16in, 50.8x40.6cm)', value: '0 0 125 100' },
				{ key: '1:1.33 (60x80cm, 23.6x31.5in)', value: '0 0 100 133' },
				{ key: '1.33:1 (80x60cm, 31.5x23.6in)', value: '0 0 133 100' },
				{ key: '1:1.4 (50x70cm, 19.7x27.6in)', value: '0 0 100 140' },
				{ key: '1.4:1 (70x50cm, 27.6x19.7in)', value: '0 0 140 100' },
				{ key: '1:1.5 (24x36in, 61x91.4cm)', value: '0 0 100 150' },
				{ key: '1.5:1 (36x24in, 91.4x61cm)', value: '0 0 150 100' },
			], 
			name: 'size'
		}, ul),
		(ul) => GUI.addSelect('Presets', '', '', { 
			options: [], 
			defaultOption: 'Select a preset',
			'data-action': 'load-preset',
			name: 'presets'
		}, ul),
		(ul) => GUI.addButton('Save', 'Save preset', 'button', { 'data-action': 'save-preset' }, ul),
		(ul) => GUI.addButton('Download', 'Download SVG', 'button', { 'data-action': 'download' }, ul)
	]);
}

export function formDataToObject(formData) {
	const obj = {};
	formData.forEach((value, key) => {
		obj[key] = value;
	});
	return obj;
}

export function mergePresets(existingPresets, defaultPresets) {
	const presetsMap = new Map();
	existingPresets.forEach(preset => presetsMap.set(preset.key, preset));
	defaultPresets.forEach(preset => presetsMap.set(preset.key, preset));
	return Array.from(presetsMap.values());
}

export function handleGuiEvent(event, svg, GUI, storageKey, drawFunction) {
	const { action, input, value } = event.detail;

	switch (action) {
		case 'download':
			downloadContent(svg.outerHTML, `${storageKey}.svg`);
			break;
		case 'full-width':
			document.body.classList.toggle('full-width');
			break;
		case 'load-preset':
			const preset = JSON.parse(value);
			loadStoredForm(GUI.form, preset);
			break;
		case 'save-preset':
			const keyName = prompt('Please enter a name for this preset:');
			if (keyName) {
				storeFormData(GUI.form, keyName, storageKey);
				updatePresetOptions(GUI.form.elements.presets, storageKey);
			}
			break;
		default:
			switch (input.name) {
				case 'canvas':
					svg.style.backgroundColor = value;
					break;
				case 'fontfamily':
					svg.style.fontFamily = value;
					break;
				case 'frame':
					break;
				case 'linecap':
					svg.setAttribute('stroke-linecap', value);
					break;
				case 'size':
					const [x, y, width, height] = value.split(' ');
					svg.style.setProperty('--frame-asr', `${width} / ${height}.`);
					svg.setAttribute('viewBox', value);
					drawFunction(svg, GUI.form.elements);
				case 'stroke':
					svg.style.stroke = value;
					break;
				case 'strokewidth':
					svg.style.strokeWidth = value;
					break;
				case 'texttransform':
					svg.style.textTransform = value;
					break;
				default:
					drawFunction(svg, GUI.form.elements);
			}
			GUI.dispatchEvent(new CustomEvent(`${input.name}-updated`));
	}
}

export function init(GUI, storageKey, defaultPresets) {
	document.addEventListener('DOMContentLoaded', () => {
	const existingPresets = JSON.parse(localStorage.getItem(storageKey)) || [];
	localStorage.setItem(storageKey, JSON.stringify(mergePresets(existingPresets, defaultPresets)));
	updatePresetOptions(GUI.form.elements.presets, storageKey);
	loadStoredForm(GUI.form, formDataToObject(new FormData(GUI.form)));
});
}