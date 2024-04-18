let backgroundLinesCanvas = document.getElementById('');

function registerCanvas(element) {
  backgroundLinesCanvas = element;
  const resizeObserver = new ResizeObserver(draw)
  resizeObserver.observe(element);
}

function draw() {
  if(!backgroundLinesCanvas) return;
  const rect = backgroundLinesCanvas.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;
  backgroundLinesCanvas.width = w;
  backgroundLinesCanvas.height = h;

  // vertical and horizontal padding
  const vp = 14 * h / 100; const hp = 10 * w / 100;

  // vertical and horizontal gap
  const vGap = 24 * h / 100; const hGap = 2 * w / 100;

  const ctx = backgroundLinesCanvas.getContext("2d");
  ctx.beginPath();
  ctx.moveTo(hp            , vp);
  ctx.lineTo(hp + hGap * 40, vp);

  ctx.moveTo(hp + hGap * 6 , vp + vGap * 1);
  ctx.lineTo(hp + hGap * 40, vp + vGap * 1);

  ctx.moveTo(hp + hGap * 12 , vp + vGap * 2);
  ctx.lineTo(hp + hGap * 40, vp + vGap * 2);

  ctx.moveTo(hp + hGap * 18 , vp + vGap * 3);
  ctx.lineTo(hp + hGap * 40, vp + vGap * 3);

  ctx.moveTo(hp            , vp);
  ctx.lineTo(hp + hGap * 18 , vp + vGap * 3);

  ctx.moveTo(hp + hGap * 20 , vp);
  ctx.lineTo(hp + hGap * 29 , vp + vGap * 3);

  ctx.moveTo(hp + hGap * 40 , vp);
  ctx.lineTo(hp + hGap * 40 , vp + vGap * 3);
  ctx.stroke();
}