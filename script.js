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










// =========================================================
// EASY PROJECT REORDERING & DATA LIST
// To change order: just move any block higher or lower in this array!
// =========================================================
const PROJECTS_DATA = [
  {
    index: 'A',
    title: 'VEX Robotics',
    summary: 'Competition robot build — design notebook, photos, and match footage.',
    link: 'projects/vex-robotics.html',
    category: 'robotics',
    tags: ['Robotics', 'CAD']
  },
  {
    index: 'B',
    title: 'Railside Robotics',
    summary: 'Team build and mentoring work outside of school competition.',
    link: 'projects/railside-robotics.html',
    category: 'robotics',
    tags: ['Robotics']
  },
  {
    index: 'C',
    title: 'ES&P — BB8',
    summary: 'Ball-drive spherical robot build — mechanical and control design.',
    link: 'projects/esap-bb8.html',
    category: 'robotics',
    tags: ['Robotics', 'Mechanisms']
  },
  {
    index: 'D',
    title: 'NVHS EDD',
    summary: 'Engineering Design & Development coursework — reports and process docs.',
    link: 'projects/nvhs-edd.html',
    category: 'coursework',
    tags: ['Research', 'Design']
  },
  {
    index: 'E',
    title: 'ENGR 133 Coding Project',
    summary: 'Intro engineering coding coursework project.',
    link: 'projects/engr133.html',
    category: 'code',
    tags: ['Code']
  },
  {
    index: 'F',
    title: 'ECE 2K7 — 555 Timer',
    summary: '555 timer circuit and final project — schematics and results.',
    link: 'projects/ece-555timer.html',
    category: 'coursework',
    tags: ['Electronics']
  },
  {
    index: 'G',
    title: 'ME 164 — NX CAD',
    summary: 'Siemens NX CAD coursework — drag-to-rotate 3D model viewer.',
    link: 'projects/me164-cad.html',
    category: 'coursework',
    tags: ['CAD', '3D']
  },
  {
    index: 'H',
    title: 'StarkHacks — Passenger Princess',
    summary: 'Hackathon build — demo video and tech stack.',
    link: 'projects/starkhacks.html',
    category: 'hackathon',
    tags: ['Hackathon', 'Code']
  }
];

// =========================================================
// CAROUSEL & FILTER SYSTEM
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('projectGrid');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const filterPills = document.querySelectorAll('.filter-pill');

  if (!grid) return;

  let activeCategory = 'all';
  let currentPage = 0;
  let isAnimating = false;
  let itemsPerPage = getItemsPerPage();

  function getItemsPerPage() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3; // 3 slots on desktop
  }

  // Filter project array based on selected category
  function getFilteredProjects() {
    if (activeCategory === 'all') return PROJECTS_DATA;
    return PROJECTS_DATA.filter(p => p.category === activeCategory);
  }

  // Create single project card HTML
  function createCardHTML(project) {
    const tagsHTML = project.tags.map(t => `<span>${t}</span>`).join('');
    return `
      <a href="${project.link}" class="project-card">
        <div class="card-corner tl"></div><div class="card-corner tr"></div>
        <div class="card-corner bl"></div><div class="card-corner br"></div>
        <span class="card-index">${project.index}</span>
        <div class="card-body">
          <h3>${project.title}</h3>
          <p class="card-summary">${project.summary}</p>
          <div class="card-tags">${tagsHTML}</div>
        </div>
        <span class="card-arrow">→</span>
      </a>
    `;
  }

  // Render current frame of 3 cards into grid
  function renderPage(page, animateDir = null) {
    const filtered = getFilteredProjects();
    const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
    
    // Clamp page index
    currentPage = Math.max(0, Math.min(page, totalPages - 1));

    const startIndex = currentPage * itemsPerPage;
    const pageItems = filtered.slice(startIndex, startIndex + itemsPerPage);

    // Build cards for current view
    grid.innerHTML = pageItems.map(createCardHTML).join('');

    // Update navigation arrow state
    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage >= totalPages - 1;

    // Trigger elastic wobble animation on slide
    if (animateDir) {
      isAnimating = true;
      const animClass = animateDir === 'next' ? 'anim-slide-next' : 'anim-slide-prev';
      grid.classList.add(animClass);

      setTimeout(() => {
        grid.classList.remove(animClass);
        isAnimating = false;
      }, 550); // Matches CSS keyframe duration
    }
  }

  // Arrow Click Handlers
  nextBtn.addEventListener('click', () => {
    if (isAnimating || nextBtn.disabled) return;
    renderPage(currentPage + 1, 'next');
  });

  prevBtn.addEventListener('click', () => {
    if (isAnimating || prevBtn.disabled) return;
    renderPage(currentPage - 1, 'prev');
  });

  // Filter Buttons Handler
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      activeCategory = pill.getAttribute('data-filter');
      currentPage = 0; // Reset to first page of newly filtered items
      renderPage(0);
    });
  });

  // Handle window resize (e.g. tablet orientation change)
  window.addEventListener('resize', () => {
    const newItems = getItemsPerPage();
    if (newItems !== itemsPerPage) {
      itemsPerPage = newItems;
      renderPage(0);
    }
  });

  // Initial Load
  renderPage(0);
});