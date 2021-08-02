const apps = {
	dotring: () => {
		/* Returns an array of points (`number`) placed on a circle with `radius` */
		const coords = (number, arr = []) => {
			const frags = 360 / number;
			for (let i = 0; i <= number; i++) {
					arr.push((frags / 180) * i * Math.PI);
			}
			return arr;
		}
		const colors = colorArray.value.split('|');
		const useColorArray = colors.length > 1;

		const fill = () => useColorArray ? colors[R(colors.length)] : `hsl(${R(hueMax.valueAsNumber, hueMin.valueAsNumber)}, ${R(satMax.valueAsNumber, satMin.valueAsNumber)}%, ${R(lightMax.valueAsNumber, lightMin.valueAsNumber)}%)`;
		let s = `<circle cx="500" cy="500" r="${dotSize.valueAsNumber}" fill="${fill()}" />`;

		for (let i = 1; i <= numRings.valueAsNumber; i++ ) {
			const r = randomRadius.checked ? R(500,1) : spread.valueAsNumber * i;
			const theta = coords(dotsPerRing.valueAsNumber * i);
			for (let j = 0; j < theta.length; j++) {
				const x = 500 - Math.round(r * (Math.cos(theta[j])));
				const y = 500 - Math.round(r * (Math.sin(theta[j])));
				s+= `<circle cx="${x}" cy="${y}" r="${randomDotSize.checked ? R(35,2) : dotSize.valueAsNumber}" fill="${fill()}" />`
			}
		}
		g.innerHTML = s;
	},

	mosaic: () => {
		const fill = () => `hsl(${R(hueMax.valueAsNumber, hueMin.valueAsNumber)}, ${R(satMax.valueAsNumber, satMin.valueAsNumber)}%, ${R(lightMax.valueAsNumber, lightMin.valueAsNumber)}%)`;
		const stroke = () => `hsl(${hueBg.valueAsNumber}, ${satBg.valueAsNumber}%, ${lightBg.valueAsNumber}%)`;
		const height = (canvasRatio.valueAsNumber * 10) / tileHeight.valueAsNumber;
		const width = 1000 / tileWidth.valueAsNumber;

		//TODO : Merge with canvas-settings
		g.setAttribute('transform', `skewX(${skewX.valueAsNumber}) skewY(${skewY.valueAsNumber})`);

		let s = '';
		for (let y = 0; y <= height; y++ ) {
			for (let x = 0; x<= width; x++ ) {
				let X = offsetRows.checked && (y % 2) ? (x * tileWidth.valueAsNumber) - (tileWidth.valueAsNumber / 2) : x * tileWidth.valueAsNumber;
				let Y = y * tileHeight.valueAsNumber;
				s+= `<rect
					width="${tileWidth.valueAsNumber}"
					height="${tileHeight.valueAsNumber}"
					x="${randomPos.checked ? R(1000) : X}"
					y="${randomPos.checked ? R(1000) : Y}"
					ry="${borderRadius.valueAsNumber}"
					fill="${fill()}" ${strokeWidth.valueAsNumber ? `stroke="${stroke()}" stroke-width="${strokeWidth.valueAsNumber}"` : ''} />`;
			}
		}
		g.innerHTML = s;
	},

	particles: () => {
		{
			let s = '';
			let points = coords(numDots.valueAsNumber, 1000, canvasRatio.valueAsNumber * 10);
			// const length = points.length;
			// points = points.concat(settings.static);
			points.forEach((coord, index) => {
				const [x, y] = [...coord];
				// const static = index >= length;
				s+= points.map(arr => {
					const [x1, y1] = [...arr];
					const distance = checkDistance(x, y, x1, y1);
					const alpha = 1 - distance / distRadius.valueAsNumber;
					
					if (alpha > 0) return `<line x1="${x1}" y1="${y1}" x2="${x}" y2="${y}" stroke="${randomColor(alpha)}" stroke-width="0.5" />`}).join('');
				s+= `<circle cx="${x}" cy="${y}" r="${R(radius.valueAsNumber, 2)}" fill="${randomColor()}" />`;
			});
			g.innerHTML = s;
		}
	},

	polyline: () => {
		let coords = new Array(numPoints.valueAsNumber).fill().map(() => {
			let x = Math.random() - 0.5, y = Math.random() - 0.5;
			x = (x * 0.96875 + 0.5) * 1000;
			y = (y * 0.96875 + 0.5) * (scaleCanvas.checked ? canvasRatio.valueAsNumber * 10 : 1000);
			return [x, y]
		})

		const stroke = randomColor();
		let fill;
		
		switch(app.elements.fillType.value) {
			case 'color': fill = stroke.replace('1)', '0.7)'); break;
			case 'circles': fill = 'url(#circles)'; break;
			case 'hstripes': fill = 'url(#hstripes)'; break;
			case 'vstripes': fill = 'url(#vstripes)'; break;
			default: fill = 'none'; break;
		}


		let polyline = `<polyline fill="${fill}" points="${coords.join(' ')} ${coords[0]}" stroke-linecap="round" stroke-width="${strokeWidth.valueAsNumber}" stroke="${stroke}" />`;

		let circles = coords.map(coord => {
			const [cx, cy] = [...coord];
			return `
				<circle cx="${cx}" cy="${cy}" r="5" fill="${stroke}" />
				<circle cx="${cx}" cy="${cy}" r="${R(100)}" fill="hsla(${hueBg.valueAsNumber}, ${satBg.valueAsNumber}%, 90%, 0.6)" stroke="${stroke}" stroke-width="${R(20,0)}" />`;
		}).join('');

		g.innerHTML = polyline + (showCircles.checked ? circles : '');
	},

	rectcircles: () => {
		let coords = new Array(numElements.valueAsNumber).fill().map(() => {
			let x = Math.random() - 0.5, y = Math.random() - 0.5;
			x = (x * 0.96875 + 0.5) * 1000;
			y = (y * 0.96875 + 0.5) * canvasRatio.valueAsNumber * 10;
			return [x, y]
		})
	
		let circles = coords.map(coord => {
			const [x, y] = [...coord];
			let height = R(heightEnd.valueAsNumber, heightStart.valueAsNumber);
			const width = R(widthEnd.valueAsNumber, widthStart.valueAsNumber);
			if ((height - width) < 0) height = heightStart.valueAsNumber + width;
			return `
				<g transform="translate(${x},${y}) rotate(${randomRotate.checked ? R(360) : rotateShapes.valueAsNumber})">
					<rect y="${width / 2}" width="${width}" height="${height - width}" fill="${randomColor()}" />
					<circle r="${width / 2}" cx="${width / 2}" cy="${width / 2}" fill="${randomColor()}" />
					<circle r="${width / 2}" cx="${width / 2}" cy="${height - (width / 2)}" fill="${randomColor()}" />
				</g>	
			`;
		}).join('');

		g.innerHTML = circles;
	},

	stripes: () => {
		const d = direction.checked;
		const w = 1000;
		const h = canvasRatio.valueAsNumber * 10;
		const n = numStripes.valueAsNumber;
	
		const l = Math.floor(d ? h / n : w / n);
		let r = randomInts(n, Math.ceil(l/3), Math.floor(l*3), n, d ? h : w);
		shuffleArray(r);
	
		let j = 0, s = '';
		for (let i = 0; i < n; i++) {
			const unit = r[i];
			const a = ` fill="hsl(${R(hueMax.valueAsNumber, hueMin.valueAsNumber)},${R(satMax.valueAsNumber, satMin.valueAsNumber)}%,${R(lightMax.valueAsNumber, lightMin.valueAsNumber)}%)"`
			s+= `<rect ${a} width="${d ? w : unit}" height="${d ? unit : h}" x="${d ? 0 : j}" y="${d ? j : 0}" />`
			j+= unit;
		}
		g.innerHTML = s;
	},

	squarecircles: () => {
		const fill = () => `hsl(${R(hueMax.valueAsNumber, hueMin.valueAsNumber)}, ${R(satMax.valueAsNumber, satMin.valueAsNumber)}%, ${R(lightMax.valueAsNumber, lightMin.valueAsNumber)}%)`;
		const width = 1000 / numRow.valueAsNumber;

		let s = '';
		for (let y = 0; y <= numRow.valueAsNumber; y++ ) {
			for (let x = 0; x<= numRow.valueAsNumber; x++ ) {
				const X = x * width;
				const Y = y * width;
				const circleX = randomCirclePos.checked ? R(X + width, X) : X + (width / 2);
				const circleY = randomCirclePos.checked ? R(Y + width, Y) : Y + (width / 2);
				s+= `
				<clipPath id="cp${y}${x}">
					<rect width="${width}" height="${width}" x="${X}" y="${Y}" />
				</clipPath>
				<rect
					width="${width}"
					height="${width}"
					x="${X}"
					y="${Y}"
					fill="${fill()}" />
					<circle
					clip-path="url(#cp${y}${x})"
					cx="${circleX}"
					cy="${circleY}"
					r="${width / (randomCircleSize.checked ? R(50,2) : circleSize.valueAsNumber)}"
					fill="${fill()}" />`;
			}
		}
		g.innerHTML = s;
	},

	squares: () => {
		let s = '';
		for (let i = 0; i <= numSquares.valueAsNumber; i++ ) {
				let width = 1000 - (i * gapSize.valueAsNumber * 1.5);
				s+= `
				<rect
					width="${width}"
					height="${width}"
					x="${(1000 - width) / 2}"
					y="${(1000 - width) - (i * gapSize.valueAsNumber * 0.25)}"
					ry="${i > 0 ? borderRadius.valueAsNumber : 0}"
					fill="${randomColor()}" />`;
		}
		g.innerHTML = s;
	},

	triangles: () => {
		let vertices = new Array(numPoints.valueAsNumber).fill().map(() => {
			let x = Math.random() - 0.5, y = Math.random() - 0.5;
			if (circularSquare.checked) {
				do {
					x = Math.random() - 0.5;
					y = Math.random() - 0.5;
				} while (x * x + y * y > 0.25);
			}
			x = (x * 0.96875 + 0.5) * 1000;
			y = (y * 0.96875 + 0.5) * (scaleCanvas.checked ? canvasRatio.valueAsNumber * 10 : 1000);
			return [x, y]
		})
	
		const triangles = Delaunay.triangulate(vertices);
		let s = '';
	
		for(i = 0; i < triangles.length; i+=3 ) {
			let [x, y] = vertices[triangles[i]];
			let [a, b] = vertices[triangles[i+1]];
			let [c, d] = vertices[triangles[i+2]];
			s+= `<path fill="hsl(${R(hueMax.valueAsNumber, hueMin.valueAsNumber)}, ${R(satMax.valueAsNumber, satMin.valueAsNumber)}%, ${R(lightMax.valueAsNumber, lightMin.valueAsNumber)}%)"
			d="M${x} ${y} L${a} ${b} L${c} ${d}Z" stroke="hsl(${hueStroke.valueAsNumber}, ${satStroke.valueAsNumber}%, ${lightStroke.valueAsNumber}%)" stroke-width="${strokeWidth.valueAsNumber}"></path>`;
		}
		g.innerHTML = s;
	},

	wheel: () => {
		const circle = (i, strokeColor, radius = 445, strokes = 20, strokeWidth = 1, cx = 500, cy = 500, strokeDash = 3000) => `
		<circle cx="${cx}" cy="${cy}" r="${radius}" stroke="${strokeColor}" fill="none" stroke-dasharray="${(i + 1) * (Math.PI * 2) / (strokes / radius)} ${strokeDash}" stroke-width="${strokeWidth}"></circle>\n`;

		let s = '';
		const u = radius.valueAsNumber / numRings.valueAsNumber;
		const lightness = 60 / numRings.valueAsNumber;
		for (let j = 0; j < numRings.valueAsNumber; j++) {
			let i = numStrokes.valueAsNumber;
			let r = radius.valueAsNumber - (j * u); if (r < 0) r = u;
			s += `<g transform-origin="50% 50%" transform="rotate(${R(rotateMax.valueAsNumber, rotateMin.valueAsNumber)})">`;
			while (i--) {
				const sc = colorWheel.checked ? `hsl(${(i+1) * (360 / numStrokes.valueAsNumber)}, 100%, ${30 + (j * lightness)}%)` : `hsl(${R(hueMax.valueAsNumber, hueMin.valueAsNumber)}, ${R(satMax.valueAsNumber, satMin.valueAsNumber)}%, ${R(lightMax.valueAsNumber, lightMin.valueAsNumber)}%)`;
				s += circle(i, sc, r, numStrokes.valueAsNumber, u, cx.valueAsNumber, cy.valueAsNumber, strokeDash.valueAsNumber);
			}
			s += `</g>`;
		}
		g.innerHTML = s;
	}
}



function checkDistance(x1, y1, x2, y2){ 
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function coords(amount, w, h) {
	return new Array(amount).fill().map(() => {
		let x = Math.random() - 0.5;
		let y = Math.random() - 0.5;
		x = (x * 0.96875 + 0.5) * w;
		y = (y * 0.96875 + 0.5) * h;
		return [x, y]
	})
}

function randomColor(opacity = 1) {
	const colors = colorArray.value.split('|');
	const useColorArray = colors.length > 1;
	return useColorArray ? colors[R(colors.length)] : `hsla(${R(hueMax.valueAsNumber, hueMin.valueAsNumber)}, ${R(satMax.valueAsNumber, satMin.valueAsNumber)}%, ${R(lightMax.valueAsNumber, lightMin.valueAsNumber)}%, ${opacity})`;
}

function render(input) {
	if (input?.type === 'range') {
		input.parentNode.dataset.value = `${input.valueAsNumber}${input.dataset.suffix||''}`;
		if (input.name) document.body.style.setProperty(input.name, `${input.valueAsNumber}${input.dataset.suffix||''}`)
	}
	if (input?.hasAttribute('data-ignore')) return;
	if (input?.hasAttribute('data-attr')) {
		setBG();
		g.setAttribute('transform', `rotate(${rotate.valueAsNumber}, 500, ${canvasRatio.valueAsNumber * 5}) scale(${scaleX.valueAsNumber}, ${scaleY.valueAsNumber}) translate(${translateX.valueAsNumber}, ${translateY.valueAsNumber})`);
		return;
	}
	svg.setAttribute('viewBox', `0 0 1000 ${canvasRatio.valueAsNumber * 10}`);
	apps[app.dataset.app]();
}

function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

function randomInts(n, min, max, minSum, maxSum) {
	let ints = [];
	while (n--) {
		const MIN = Math.max(min, minSum - n * max);
		const MAX = Math.min(max, maxSum - n * min);
		const int = R(MAX, MIN);
		minSum -= int;
		maxSum -= int;
		ints.push(int);
	}
	return ints; 
}

/**
 * @function getPreset
 * @description Retrieves preset from localStorage, parses json and loads it
 * @param {Node} element
*/
function getPreset(element) {
	let preset = localStorage.getItem(element.innerText);
	if (preset) preset = JSON.parse(preset);
	loadPreset(preset);
	setBG();
	render();
}

/**
 * @function loadPreset
 * @description Loads a preset, renders preview
 * @param {Object} preset
*/
function loadPreset(preset) {
	Object.entries(preset).forEach(entry => {
		const [key, value] = [...entry];
		if (app.elements[key]?.type === 'checkbox') { 
			app.elements[key].checked = value === 1;
		}
		else if (app.elements[key]?.type === 'range') { 
			app.elements[key].value = value;
			app.elements[key].parentNode.dataset.value = value;
		}
		else {
			app.elements[key].value = value;
		}
	});
	render();
}

/**
 * @function R
 * @description returns a random number between max and min
 * @param {Number} max
 * @param {Number} [min]
 * @param {Boolean} [f]
*/
function R(max, min = 0, f = true) {
	return f ? Math.floor(Math.random() * (max - min) + min) : Math.random() * max;
};

/**
 * @function randomPreset
 * @description Creates a random preset
*/
function randomPreset() {
	app.reset();
	[...app.elements].forEach(input => {
		if (input.hasAttribute('data-random')) {
			if (input.type === 'checkbox') {
				input.checked = R(10, 0) > 5;
			}
			if (input.type === 'range') {
				input.value = R(input.max-0, input.min-0);
				input.parentNode.dataset.value = `${input.value}${input.dataset.suffix||''}`;
			}
		}
	});
	setBG();
	render();
}

/**
 * @function renderPresets
 * @description Checks localStorage for presets, renders to ui.
*/
function renderPresets() {
	let s = '';
	for (const key of Object.keys(localStorage)) {
		s+= `<button data-app-elm="preset" type="button" onclick="getPreset(this)">${key}</button>`;
	}
	presets.innerHTML = s;
}

/**
 * @function saveFile
 * @description Exports canvas to either svg, png, jpg or webp
 * @param {Node} svg
 * @param {String} [ext]
*/
function saveFile(svg, ext = 'png') {
	const download = (href, name) => {
		const L = document.createElement('a');
		L.download = name;
		L.style.opacity = "0";
		document.body.append(L);
		L.href = href;
		L.click();
		L.remove()
	}
	const {width, height} = svg.getBBox(); 
	let clone = svg.outerHTML;
	const blob = new Blob([clone],{type:'image/svg+xml;charset=utf-8'});
	const format = { png: '', jpg: 'image/jpg', webp: 'image/webp' };
	if (ext === 'svg') {
		download(URL.createObjectURL(blob), 'image.svg');
		return;
	}
	const img = new Image();
	img.onload = () => {
		const C = document.createElement('canvas');
		C.width = width;
		C.height = height;
		const X = C.getContext('2d');
		X.drawImage(img, 0, 0, width, height);
		download(C.toDataURL(format[ext], 1), `image.${ext}`)
	};
	img.src = URL.createObjectURL(blob);
}

/**
 * @function savePreset
 * @description Saves current settings to a (localStorage) preset
*/
function savePreset() {
	const name = prompt('Name your preset:', 'my-preset');
	if (!name) return;
	let obj = {};
	[...app.elements].forEach(input => {
		if (input.hasAttribute('data-random')) {
			if (input.type === 'checkbox') {
				obj[input.id] = input.checked ? 1 : 0;
			}
			if (input.type === 'range') {
				obj[input.id] = input.value;
			}
		}
	});
	window.localStorage.setItem(name, JSON.stringify(obj));
	renderPresets();
}

/**
 * @function setBG
 * @description Sets canvas-background
*/
function setBG() {
	svg.setAttribute('style', `background-color: hsl(${hueBg.valueAsNumber}, ${satBg.valueAsNumber}%, ${lightBg.valueAsNumber}%)`);
}

/**
 * @function toggle
 * @description toggle a menu-group
 * @param {Event} event
*/
function toggle(event) {
	summary.forEach(node => {
		if (node !== event.target) node.parentNode.open = false;
	});
}

/* Init */
const summary = app.querySelectorAll('summary');
summary.forEach(node => node.addEventListener('click', toggle));
app.addEventListener('input', (event) => { if (event.target) render(event.target); });
renderPresets();