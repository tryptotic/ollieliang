// ===== Scroll-triggered reveal =====
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach((el) => revealObserver.observe(el));

// ===== Projects nav dropdown (hover on desktop, click/tap on touch) =====
const projectsTrigger = document.getElementById('projectsTrigger');
const projectsDropdown = document.getElementById('projectsDropdown');
if (projectsTrigger && projectsDropdown) {
  projectsTrigger.addEventListener('click', () => {
    const isOpen = projectsDropdown.classList.toggle('open');
    projectsTrigger.setAttribute('aria-expanded', String(isOpen));
    projectsTrigger.classList.toggle('open', isOpen);
  });
  document.addEventListener('click', (e) => {
    if (!projectsTrigger.contains(e.target) && !projectsDropdown.contains(e.target)) {
      projectsDropdown.classList.remove('open');
      projectsTrigger.classList.remove('open');
      projectsTrigger.setAttribute('aria-expanded', 'false');
    }
  });
}

// ===== Project grid category filter =====
const filterPills = document.querySelectorAll('.filter-pill');
const projectCards = document.querySelectorAll('.project-card');
filterPills.forEach((pill) => {
  pill.addEventListener('click', () => {
    filterPills.forEach((p) => p.classList.remove('active'));
    pill.classList.add('active');
    const filter = pill.dataset.filter;
    projectCards.forEach((card) => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
    });
  });
});

// ===== Lightbox for project-page image galleries =====
const lightbox = document.getElementById('lightbox');
if (lightbox) {
  const lightboxImg = lightbox.querySelector('img');
  document.querySelectorAll('.gallery img').forEach((img) => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
    });
  });
  lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
    lightbox.classList.remove('open');
  });
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.classList.remove('open');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') lightbox.classList.remove('open');
  });
}

// ===== Header Movement =====
const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  // If scrolled down more than 10px, add the 'scrolled' class
  if (window.scrollY > 100) {
    header.classList.add('scrolled');
  } else {
    // When back at the very top, remove it
    header.classList.remove('scrolled');
  }
});

// ===== Reset CAD Pos and View =====
const cadViewer = document.getElementById('heroCAD');
if (cadViewer) {
  let idleTimer = null;
  const IDLE_TIMEOUT = 5000; // 5000ms = 5 seconds

  // The original target position and zoom you set in HTML
  const defaultOrbit = "45deg 75deg 100%";

  function resetCADPosition() {
    // Smoothly resets camera orbit and zoom distance back to original 45deg view
    cadViewer.cameraOrbit = defaultOrbit;
  }

  function userInteracted() {
    // Clear any existing timer while user is dragging/zooming
    clearTimeout(idleTimer);

    // Start a fresh 5-second countdown after they release/stop interacting
    idleTimer = setTimeout(() => {
      resetCADPosition();
    }, IDLE_TIMEOUT);
  }

  // Listen for user touch, mouse drag, wheel scroll, or click gestures on the 3D model
  cadViewer.addEventListener('camera-change', (event) => {
    // Trigger reset countdown only when the change comes from user input
    if (event.detail.source === 'user-interaction') {
      userInteracted();
    }
  });
}