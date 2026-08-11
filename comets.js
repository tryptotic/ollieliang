// ===== Comet background =====
// Renders a field of small drifting comet "rings" across the FULL document
// height (not just one viewport), so comets keep appearing no matter how
// far down the page you scroll. Tinted to the site's purple accent colors.

(function () {
  const canvas = document.getElementById('comet-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height, dpr;

  // Reads the *document's* full scrollable height, not just the viewport,
  // so the canvas (and the comets on it) cover every section of the page.
  function getDocHeight() {
    const body = document.body;
    const html = document.documentElement;
    return Math.max(
      body.scrollHeight, body.offsetHeight,
      html.clientHeight, html.scrollHeight, html.offsetHeight
    );
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = getDocHeight();

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // --- Config ---
  const AREA_PER_COMET = 26000;   // lower = more comets
  const TRAIL_FADE = 0.06;        // lower = longer-lingering trails
  const MIN_SPEED = 0.2;
  const MAX_SPEED = 0.45;
  const MIN_RADIUS = 2;
  const MAX_RADIUS = 4;
  const RING_WIDTH = 1.1;
  const MIN_ALPHA = 0.45;
  const MAX_ALPHA = 0.9;

  // Purple palette pulled from the site's own CSS variables, with a
  // graceful fallback in case the stylesheet hasn't loaded yet.
  const rootStyle = getComputedStyle(document.documentElement);
  function cssVar(name, fallback) {
    const v = rootStyle.getPropertyValue(name).trim();
    return v || fallback;
  }
  function hexToRgb(hex) {
    const m = hex.replace('#', '');
    const bigint = parseInt(m.length === 3
      ? m.split('').map((c) => c + c).join('')
      : m, 16);
    return `${(bigint >> 16) & 255}, ${(bigint >> 8) & 255}, ${bigint & 255}`;
  }
  const ACCENT = hexToRgb(cssVar('--accent', '#9333ea'));
  const ACCENT_2 = hexToRgb(cssVar('--accent-2', '#b57bf5'));
  const COLORS = [ACCENT, ACCENT_2, '235, 220, 255'];

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  class Comet {
    constructor() {
      this.speed = rand(MIN_SPEED, MAX_SPEED);
      this.radius = rand(MIN_RADIUS, MAX_RADIUS);
      this.alpha = rand(MIN_ALPHA, MAX_ALPHA);
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.spawn(true);
    }

    spawn(initial = false) {
      const margin = 20;
      let angle;

      if (initial) {
        // Scatter across the whole document on first load, so comets are
        // already visible in every section instead of only entering at top.
        this.x = rand(0, width);
        this.y = rand(0, height);
        angle = rand(0, Math.PI * 2);
        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;
        return;
      }

      const edge = Math.floor(rand(0, 4));
      switch (edge) {
        case 0: // top edge
          this.x = rand(0, width);
          this.y = -margin;
          angle = rand(Math.PI * 0.25, Math.PI * 0.75);
          break;
        case 1: // bottom edge
          this.x = rand(0, width);
          this.y = height + margin;
          angle = rand(Math.PI * 1.25, Math.PI * 1.75);
          break;
        case 2: // left edge
          this.x = -margin;
          this.y = rand(0, height);
          angle = rand(-Math.PI * 0.25, Math.PI * 0.25);
          break;
        default: // right edge
          this.x = width + margin;
          this.y = rand(0, height);
          angle = rand(Math.PI * 0.75, Math.PI * 1.25);
          break;
      }

      this.vx = Math.cos(angle) * this.speed;
      this.vy = Math.sin(angle) * this.speed;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      const margin = 20;
      if (this.x < -margin || this.x > width + margin || this.y < -margin || this.y > height + margin) {
        this.spawn();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${this.color}, ${this.alpha})`;
      ctx.lineWidth = RING_WIDTH;
      ctx.stroke();
    }
  }

  let comets = [];
  function initComets() {
    // Clear to fully transparent (not opaque black) — the canvas sits on
    // top of the purple blob gradients (.grid-backdrop::before/::after),
    // so it must stay see-through or it will blot those out completely.
    ctx.clearRect(0, 0, width, height);

    const count = Math.max(1, Math.floor((width * height) / AREA_PER_COMET));
    comets = Array.from({ length: count }, () => new Comet());
  }

  let resizeTimer = null;
  function handleResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      initComets();
    }, 120);
  }

  resize();
  initComets();

  window.addEventListener('resize', handleResize);

  // The document can grow after load (fonts, images, dropdown toggles,
  // reveal animations) which changes scrollHeight — keep the canvas in
  // sync so comets always cover the full page, not just the first paint.
  let lastHeight = getDocHeight();
  const heightWatcher = new ResizeObserver(() => {
    const h = getDocHeight();
    if (Math.abs(h - lastHeight) > 4) {
      lastHeight = h;
      handleResize();
    }
  });
  heightWatcher.observe(document.body);

  function animate() {
    // Trails work by using "destination-out" to gradually erase old comet
    // strokes toward full transparency (rather than painting solid black
    // over them), which is what lets the purple blob gradients behind the
    // canvas keep showing through as comets fade — a flat black fade rect
    // would otherwise dim/hide the backdrop a little more on every frame.
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = `rgba(0, 0, 0, ${TRAIL_FADE})`;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'source-over';

    for (const comet of comets) {
      comet.update();
      comet.draw();
    }

    requestAnimationFrame(animate);
  }

  animate();
})();
