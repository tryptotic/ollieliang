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

// ===== Lightbox for project-page image galleries =====
const lightbox = document.getElementById('lightbox');
if (lightbox) {
  const lightboxImg = lightbox.querySelector('img');
  document.querySelectorAll('.gallery img, .gallery-pair img').forEach((img) => {
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
  let isPointerDown = false; // Tracks if mouse button or touch is held down
  const IDLE_TIMEOUT = 5000; // 5-second delay after interaction ends
  const defaultOrbit = "45deg 75deg 100%"; // 100% framing distance

  function resetCADPosition() {
    // Only reset if the user isn't currently holding click/touch down
    if (!isPointerDown) {
      cadViewer.cameraOrbit = defaultOrbit;
      cadViewer.fieldOfView = "auto";
      cadViewer.cameraTarget = "auto auto auto";
    }
  }

  function userInteracting() {
    // Stop any pending reset countdown while actively dragging or holding
    clearTimeout(idleTimer);
  }

  function userInteractionEnded() {
    clearTimeout(idleTimer);

    // Switch the auto-rotate delay to 5 seconds for all subsequent idle cycles
    cadViewer.autoRotateDelay = IDLE_TIMEOUT;

    // Start 5-second countdown after release
    idleTimer = setTimeout(() => {
      resetCADPosition();
    }, IDLE_TIMEOUT);
  }

  // 1. Listen for active camera movement
  cadViewer.addEventListener('camera-change', (event) => {
    if (event.detail.source === 'user-interaction') {
      userInteracting();
    }
  });

  // 2. Track pointer down / holding states
  cadViewer.addEventListener('pointerdown', () => {
    isPointerDown = true;
    userInteracting();
  });

  // 3. Track pointer release / interaction end
  window.addEventListener('pointerup', () => {
    if (isPointerDown) {
      isPointerDown = false;
      userInteractionEnded();
    }
  });
}

//metallic color for cads
function tuneMaterials(viewerEl, { baseColor, metallic, roughness }) {
  if (!viewerEl) return;
  viewerEl.addEventListener('load', () => {
    viewerEl.model.materials.forEach((mat) => {
      mat.pbrMetallicRoughness.setBaseColorFactor(baseColor);
      mat.pbrMetallicRoughness.setMetallicFactor(metallic);
      mat.pbrMetallicRoughness.setRoughnessFactor(roughness);
    });
  });
}

// exploded view — medium gray
tuneMaterials(document.getElementById('metallic'), {
  baseColor: [0.55, 0.55, 0.58, 1.0],
  metallic: 0.3,
  roughness: 0.6
});

// <!-- Wires up the PDF modal: click any .pdf-trigger to open, close via the × button, clicking outside, or Escape -->
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('pdfModal');
  const scrollArea = document.getElementById('drawingScroll');
  const closeBtn = document.getElementById('pdfModalClose');

  document.querySelectorAll('.pdf-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const pages = trigger.dataset.pages.split(',').map(p => p.trim()).filter(Boolean);
      scrollArea.innerHTML = '';
      pages.forEach((src) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Engineering drawing page';
        scrollArea.appendChild(img);
      });
      modal.classList.add('is-open');
    });
  });

  function closeModal() {
    modal.classList.remove('is-open');
    scrollArea.innerHTML = ''; // fully unloads the images, nothing lingers behind
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
});






// =========================================================
// PROJECT DATA — edit dates, tags, and thumbnails here.
// Display order is newest-first (sorted by `date`).
// =========================================================
const PROJECTS_DATA = [
  {
    title: 'ME 164 — NX CAD',
    summary: 'Siemens NX CAD coursework — drag-to-rotate 3D model viewer.',
    link: 'projects/me164-cad.html',
    category: 'coursework',
    tags: ['CAD', '3D'],
    date: '2025-05',
    dateLabel: 'May 2025',
    thumbnail: null
  },
  {
    title: 'ECE 2K7 — 555 Timer',
    summary: '555 timer circuit and final project — schematics and results.',
    link: 'projects/ece-555timer.html',
    category: 'coursework',
    tags: ['Electronics'],
    date: '2025-04',
    dateLabel: 'Apr 2025',
    thumbnail: null
  },
  {
    title: 'StarkHacks — Passenger Princess',
    summary: 'Hackathon build — demo video and tech stack.',
    link: 'projects/starkhacks.html',
    category: 'hackathon',
    tags: ['Hackathon', 'Code'],
    date: '2025-02',
    dateLabel: 'Feb 2025',
    thumbnail: null
  },
  {
    title: 'ENGR 133 Coding Project',
    summary: 'Intro engineering coding coursework project.',
    link: 'projects/engr133.html',
    category: 'code',
    tags: ['Code'],
    date: '2024-12',
    dateLabel: 'Dec 2024',
    thumbnail: null
  },
  {
    title: 'ES&P — BB8',
    summary: 'Ball-drive spherical robot build — mechanical and control design.',
    link: 'projects/esap-bb8.html',
    category: 'robotics',
    tags: ['Robotics', 'Mechanisms'],
    date: '2024-08',
    dateLabel: 'Aug 2024',
    thumbnail: null
  },
  {
    title: 'Railside Robotics',
    summary: 'Team build and mentoring work outside of school competition.',
    link: 'projects/railside-robotics.html',
    category: 'robotics',
    tags: ['Robotics'],
    date: '2024-06',
    dateLabel: 'Jun 2024',
    thumbnail: null
  },
  {
    title: 'VEX Robotics',
    summary: 'Competition robot build — design notebook, photos, and match footage.',
    link: 'projects/vex-robotics.html',
    category: 'robotics',
    tags: ['Robotics', 'CAD'],
    date: '2024-03',
    dateLabel: '2023–24',
    thumbnail: null
  },
  {
    title: 'NVHS EDD',
    summary: 'Engineering Design & Development coursework — reports and process docs.',
    link: 'projects/nvhs-edd.html',
    category: 'coursework',
    tags: ['Research', 'Design'],
    date: '2023-05',
    dateLabel: '2022–23',
    thumbnail: null
  }
];

// =========================================================
// PROJECT TIMELINE
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
  const timeline = document.getElementById('projectTimeline');
  const timelineList = document.getElementById('timelineList');
  const filterPills = document.querySelectorAll('.filter-pill');

  if (!timeline || !timelineList) return;

  let activeCategory = 'all';

  function getFilteredProjects() {
    const sorted = [...PROJECTS_DATA].sort((a, b) => b.date.localeCompare(a.date));
    if (activeCategory === 'all') return sorted;
    return sorted.filter((p) => p.category === activeCategory);
  }

  function createThumbHTML(project) {
    if (project.thumbnail) {
      return `<img src="${project.thumbnail}" alt="" class="card-thumb-img">`;
    }
    const initial = project.title.charAt(0);
    return `<div class="card-thumb-placeholder" data-category="${project.category}"><span>${initial}</span></div>`;
  }

  function createEntryHTML(project) {
    const tagsHTML = project.tags.slice(0, 3).map((t) => `<span>${t}</span>`).join('');
    return `
      <article class="timeline-item" data-category="${project.category}">
        <div class="timeline-marker">
          <time class="timeline-date" datetime="${project.date}">${project.dateLabel}</time>
          <span class="timeline-dot" aria-hidden="true"></span>
        </div>
        <a href="${project.link}" class="project-card">
          <div class="card-main">
            <div class="card-top">
              <h3>${project.title}</h3>
              <div class="card-tags">${tagsHTML}</div>
            </div>
            <p class="card-summary">${project.summary}</p>
          </div>
          <div class="card-thumb">${createThumbHTML(project)}</div>
          <span class="card-arrow" aria-hidden="true">→</span>
        </a>
      </article>
    `;
  }

  function renderTimeline() {
    const filtered = getFilteredProjects();
    timelineList.innerHTML = filtered.map(createEntryHTML).join('');
  }

  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      filterPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.getAttribute('data-filter');
      renderTimeline();
    });
  });

  const timelineObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          timeline.classList.add('is-visible');
          timelineObserver.unobserve(timeline);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );
  timelineObserver.observe(timeline);

  renderTimeline();
});