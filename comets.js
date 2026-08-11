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
  // Trails are drawn explicitly from each comet's own short position
  // history (below) rather than by leaving old canvas pixels to decay —
  // that's what previously left permanent gray streaks: thin, low-alpha
  // strokes redrawn every frame decay far too slowly for the eye to ever
  // see them fully clear. This approach guarantees every trail segment
  // fully disappears after TRAIL_LENGTH frames, no matter the speed.
  const AREA_PER_COMET = 105000;  // ~4x fewer comets than before (75% cut)
  const TRAIL_LENGTH = 22;        // how many past positions each comet keeps
  const MIN_SPEED = 0.2;
  const MAX_SPEED = 0.4;
  const MIN_RADIUS = 2.5;
  const MAX_RADIUS = 4.5;
  const RING_WIDTH = 1;
  const MIN_ALPHA = 0.28;
  const MAX_ALPHA = 0.5;
  const BLUR = 3.5;               // soft-focus amount, in px
  const GLOW_BLUR = 10;           // very small ambient glow radius, in px
  const GLOW_ALPHA = 0.16;        // how faint the glow halo is

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
      this.trail = [];
      this.spawn(true);
    }

    spawn(initial = false) {
      const margin = 20;
      let angle;

      if (initial) {
        this.x = rand(0, width);
        this.y = rand(0, height);
        angle = rand(0, Math.PI * 2);
        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;
      } else {
        const edge = Math.floor(rand(0, 4));
        switch (edge) {
          case 0:
            this.x = rand(0, width);
            this.y = -margin;
            angle = rand(Math.PI * 0.25, Math.PI * 0.75);
            break;
          case 1:
            this.x = rand(0, width);
            this.y = height + margin;
            angle = rand(Math.PI * 1.25, Math.PI * 1.75);
            break;
          case 2:
            this.x = -margin;
            this.y = rand(0, height);
            angle = rand(-Math.PI * 0.25, Math.PI * 0.25);
            break;
          default:
            this.x = width + margin;
            this.y = rand(0, height);
            angle = rand(Math.PI * 0.75, Math.PI * 1.25);
            break;
        }
        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;
      }

      this.trail = [];
    }

    update() {
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > TRAIL_LENGTH) this.trail.shift();

      this.x += this.vx;
      this.y += this.vy;

      const margin = 20;
      if (this.x < -margin || this.x > width + margin || this.y < -margin || this.y > height + margin) {
        this.spawn();
      }
    }

    draw() {
      for (let i = 1; i < this.trail.length; i++) {
        const prev = this.trail[i - 1];
        const point = this.trail[i];
        const t = i / this.trail.length;
        const segAlpha = this.alpha * t * t * 0.6;
        if (segAlpha < 0.01) continue;

        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(point.x, point.y);
        ctx.strokeStyle = `rgba(${this.color}, ${segAlpha})`;
        ctx.lineWidth = RING_WIDTH;
        ctx.stroke();
      }

      ctx.save();
      ctx.shadowColor = `rgba(${this.color}, ${GLOW_ALPHA})`;
      ctx.shadowBlur = GLOW_BLUR;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${this.color}, ${this.alpha})`;
      ctx.lineWidth = RING_WIDTH;
      ctx.stroke();
      ctx.restore();
    }
  }

  let comets = [];
  function initComets() {
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
    ctx.clearRect(0, 0, width, height);
    ctx.filter = `blur(${BLUR}px)`;

    for (const comet of comets) {
      comet.update();
      comet.draw();
    }

    ctx.filter = 'none';
    requestAnimationFrame(animate);
  }

  animate();
})();
