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
  const defaultOrbit = "45deg 75deg 70%";

  function resetCADPosition() {
    // 1. Reset Orbit Angles & Distance Zoom
    cadViewer.cameraOrbit = "45deg 75deg 70%";
    
    // 2. Reset Field of View (Camera Lens Zoom)
    cadViewer.fieldOfView = "auto";
    
    // 3. Reset Pan Position (Center Target)
    cadViewer.cameraTarget = "auto auto auto";
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
// CAROUSEL & INFINITE LOOP SYSTEM
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('projectTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const filterPills = document.querySelectorAll('.filter-pill');

  if (!track) return;

  let activeCategory = 'all';
  let currentPage = 0;
  let isAnimating = false;

  function getItemsPerPage() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3; // 3 slots on desktop
  }

  function getFilteredProjects() {
    if (activeCategory === 'all') return PROJECTS_DATA;
    return PROJECTS_DATA.filter(p => p.category === activeCategory);
  }

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

  // Groups cards into pages and renders them
  function renderTrack() {
    const filtered = getFilteredProjects();
    const itemsPerPage = getItemsPerPage();
    const pages = [];
    
    // Group cards into page wrappers
    for (let i = 0; i < filtered.length; i += itemsPerPage) {
      const pageItems = filtered.slice(i, i + itemsPerPage);
      const pageHTML = `<div class="project-page">${pageItems.map(createCardHTML).join('')}</div>`;
      pages.push(pageHTML);
    }
    
    track.innerHTML = pages.join('');
    
    // Reset to first frame position instantly on filter
    currentPage = 0;
    track.style.transition = 'none'; // Temporarily disable slide animation
    track.style.transform = `translateX(0px)`;
    
    // Force a browser repaint so the transition applies to future slides
    track.offsetHeight; 
    track.style.transition = 'transform 0.5s cubic-bezier(0.1, 0.9, 0.2, 1)';
  }

  // Smooth sliding logic (No wobble classes needed)
  function slideToPage(targetPage, direction) {
    if (isAnimating) return;

    const filtered = getFilteredProjects();
    const itemsPerPage = getItemsPerPage();
    const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;

    // Infinite loop math
    let newPage = targetPage;
    if (newPage >= totalPages) newPage = 0;
    if (newPage < 0) newPage = totalPages - 1;

    const containerWidth = track.parentElement.getBoundingClientRect().width;
    
    // Calculate pixel translate using the new 80px gap between pages
    const targetX = -(newPage * (containerWidth + 80));

    isAnimating = true;
    track.style.transform = `translateX(${targetX}px)`;

    // Unlock interactions after 0.5s (matches CSS transition time)
    setTimeout(() => {
      currentPage = newPage;
      isAnimating = false;
    }, 500); 
  }

  // Infinite Arrow Listeners
  nextBtn.addEventListener('click', () => slideToPage(currentPage + 1, 'next'));
  prevBtn.addEventListener('click', () => slideToPage(currentPage - 1, 'prev'));

  // Category Filter Handler
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      activeCategory = pill.getAttribute('data-filter');
      renderTrack();
    });
  });

  // Handle Window Resize
  window.addEventListener('resize', renderTrack);

  // Initial Load
  renderTrack();
});