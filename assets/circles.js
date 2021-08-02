function G(event) {
  if (event?.target && event.target.dataset.ignore) return;
  const w = S.getAttribute('width')-0;
  const h = S.getAttribute('height')-0;
  const r = A.elements.r.valueAsNumber;
  const z = A.elements.z.valueAsNumber;
  const x = Math.ceil(w / z);
  const y = Math.ceil(h / z);

  let s = '';
  ty = 0;
  for (let i = 1; i <= y; i++) {
    tx = 0;
    for (let j = 1; j <= x; j++) {
      const cx = (j * z) + tx;
      const cy = (i * z) + ty;
      s+= `<circle cx="${cx}" cy="${cy}" r="${r}" fill="hsl(${R(A.elements.he.valueAsNumber, A.elements.hs.valueAsNumber)}, ${R(A.elements.se.valueAsNumber, A.elements.ss.valueAsNumber)}%, ${R(A.elements.le.valueAsNumber, A.elements.ls.valueAsNumber)}%)" />`
      tx+= r;
    }
    ty += r;
  }
  S.innerHTML = s;
}

const O = new ResizeObserver(entries => {
  S.setAttribute('height', document.documentElement.clientHeight);
  S.setAttribute('width', document.body.offsetWidth);
  G();
});
A.addEventListener('input', G);
O.observe(document.body);

function R(max, min = 0) {
  return Math.floor(Math.random() * (max - min) + min);
};

function saveSVG(svg, ext = 'png') {
  const D = (href, name) => {
    const L = document.createElement('a');
    L.download = name;
    L.style.opacity = "0";
    document.body.append(L);
    L.href = href;
    L.click();
    L.remove()
  }
  const P = (p) => getComputedStyle(document.body).getPropertyValue(p).trim();

  const h = P('--h');
  const s = P('--s');
  const {width, height} = svg.getBBox(); 
  let clone = svg.outerHTML.replaceAll('var(--h)', h).replaceAll('var(--s)', s);
  const blob = new Blob([clone],{type:'image/svg+xml;charset=utf-8'});
  const format = { png: '', jpg: 'image/jpg', webp: 'image/webp' };
  const img = new Image();

  img.onload = () => {
    const C = document.createElement('canvas');
    C.width = width;
    C.height = height;
    const X = C.getContext('2d');
    X.fillStyle = `hsl(${h}, ${s}, 20%)`;
    X.fillRect(0, 0, width, height);
    X.drawImage(img, 0, 0, width, height);
    D(C.toDataURL(format[ext], 1), `image.${ext}`)
  };
  img.src = URL.createObjectURL(blob);
}
/* FOR DEMO */
if (document.body.offsetWidth > 700) cp.checked = true;