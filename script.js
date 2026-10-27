/* =============================================================
   MJMP Portfolio — script.js
   Vanilla JavaScript — no frameworks required.
   Covers:
     1. Dark / Light mode toggle (persisted in localStorage)
     2. Mobile hamburger menu
     3. Navbar scroll shadow + active nav link highlight
     4. Scroll-triggered fade-in animations (IntersectionObserver)
     5. Project modal pop-up (open / close / keyboard / overlay click)
     6. Contact form validation + success notification
   ============================================================= */

'use strict';

/* ─────────────────────────────────────────────────────────────
   1. DARK / LIGHT MODE
────────────────────────────────────────────────────────────── */
const htmlEl        = document.documentElement;
const themeToggle   = document.getElementById('themeToggle');
const iconSun       = document.getElementById('iconSun');
const iconMoon      = document.getElementById('iconMoon');

/**
 * Apply the given theme ('dark' | 'light') to <html> and
 * swap the toggle icon accordingly.
 */
function applyTheme(theme) {
  if (theme === 'dark') {
    htmlEl.classList.add('dark');
    iconSun.classList.remove('hidden');
    iconMoon.classList.add('hidden');
  } else {
    htmlEl.classList.remove('dark');
    iconSun.classList.add('hidden');
    iconMoon.classList.remove('hidden');
  }
}

// Initialise from localStorage (or system preference as fallback)
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  applyTheme(savedTheme);
} else {
  // Respect the user's OS preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefersDark ? 'dark' : 'light');
}

// Toggle on button click
themeToggle.addEventListener('click', () => {
  const isDark = htmlEl.classList.contains('dark');
  const next   = isDark ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('theme', next);
});


/* ─────────────────────────────────────────────────────────────
   2. MOBILE HAMBURGER MENU
────────────────────────────────────────────────────────────── */
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu    = document.getElementById('mobileMenu');

mobileMenuBtn.addEventListener('click', () => {
  const isOpen = !mobileMenu.classList.contains('hidden');
  mobileMenu.classList.toggle('hidden', isOpen);
  mobileMenuBtn.setAttribute('aria-expanded', String(!isOpen));
});

// Close mobile menu when a link inside it is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
  });
});


/* ─────────────────────────────────────────────────────────────
   3. NAVBAR — SCROLL SHADOW + ACTIVE LINK HIGHLIGHT
────────────────────────────────────────────────────────────── */
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

// Add shadow class when page is scrolled down
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
  highlightNavLink();
}, { passive: true });

/**
 * Determine which section is currently most visible in the viewport
 * and mark the corresponding nav link as active.
 */
function highlightNavLink() {
  const sections = ['about', 'education', 'organization', 'projects', 'skills', 'contact'];
  let current    = '';

  sections.forEach(id => {
    const section = document.getElementById(id);
    if (!section) return;
    const rect = section.getBoundingClientRect();
    // Section is "in view" when its top is within the upper 60% of the viewport
    if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= 0) {
      current = id;
    }
  });

  navLinks.forEach(link => {
    const href = link.getAttribute('href').replace('#', '');
    link.classList.toggle('active', href === current);
  });
}


/* ─────────────────────────────────────────────────────────────
   4. SCROLL-TRIGGERED FADE-IN ANIMATIONS
────────────────────────────────────────────────────────────── */
const fadeEls = document.querySelectorAll('.fade-in');

if ('IntersectionObserver' in window) {
  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target); // animate only once
        }
      });
    },
    { threshold: 0.12 }
  );
  fadeEls.forEach(el => fadeObserver.observe(el));
} else {
  // Fallback for browsers without IntersectionObserver
  fadeEls.forEach(el => el.classList.add('visible'));
}


/* ─────────────────────────────────────────────────────────────
   5. PROJECT MODAL POP-UP
────────────────────────────────────────────────────────────── */
const projectModal   = document.getElementById('projectModal');
const modalClose     = document.getElementById('modalClose');
const modalGallery   = document.getElementById('modalGallery');
const modalTitle     = document.getElementById('modalTitle');
const modalLinkWrap  = document.getElementById('modalLinkWrap');
const modalLink      = document.getElementById('modalLink');
const projectCards   = document.querySelectorAll('.project-card');

/**
 * Data for each project modal.
 * key  = value of data-project attribute on the card
 * images = array of { src, alt } for the gallery
 */
const projectData = {
  1: {
    title: 'Retail Sales & Profit Analysis — Project Gallery',
    images: [
      { src: 'Gambar/Projects Section/Project 1/Retail Sales & Profit Analysis - Project 1/Thumbnail Card/1.png', alt: 'Retail Sales & Profit Analysis — Slide 1' },
      { src: 'Gambar/Projects Section/Project 1/Retail Sales & Profit Analysis - Project 1/Thumbnail Card/2.png', alt: 'Retail Sales & Profit Analysis — Slide 2' },
      { src: 'Gambar/Projects Section/Project 1/Retail Sales & Profit Analysis - Project 1/Thumbnail Card/3.png', alt: 'Retail Sales & Profit Analysis — Slide 3' },
      { src: 'Gambar/Projects Section/Project 1/Retail Sales & Profit Analysis - Project 1/Thumbnail Card/4.png', alt: 'Retail Sales & Profit Analysis — Slide 4' },
      { src: 'Gambar/Projects Section/Project 1/Retail Sales & Profit Analysis - Project 1/Thumbnail Card/5.png', alt: 'Retail Sales & Profit Analysis — Slide 5' },
      { src: 'Gambar/Projects Section/Project 1/Retail Sales & Profit Analysis - Project 1/Thumbnail Card/6.png', alt: 'Retail Sales & Profit Analysis — Slide 6' },
      { src: 'Gambar/Projects Section/Project 1/Retail Sales & Profit Analysis - Project 1/Thumbnail Card/7.png', alt: 'Retail Sales & Profit Analysis — Slide 7' },
      { src: 'Gambar/Projects Section/Project 1/Retail Sales & Profit Analysis - Project 1/Thumbnail Card/8.png', alt: 'Retail Sales & Profit Analysis — Slide 8' },
    ]
  },
  2: {
    title: 'E-Commerce Customer Churn Analysis — Project Gallery',
    images: [
      { src: 'Gambar/Projects Section/Project 2/E-Commerce Customer Churn Analysis - Project 2/Blue and Grey Modern Data Analyst Presentation.png', alt: 'E-Commerce Customer Churn Analysis — Cover' },
      { src: 'Gambar/Projects Section/Project 2/E-Commerce Customer Churn Analysis - Project 2/2.png', alt: 'E-Commerce Customer Churn Analysis — Slide 2' },
      { src: 'Gambar/Projects Section/Project 2/E-Commerce Customer Churn Analysis - Project 2/3.png', alt: 'E-Commerce Customer Churn Analysis — Slide 3' },
      { src: 'Gambar/Projects Section/Project 2/E-Commerce Customer Churn Analysis - Project 2/4.png', alt: 'E-Commerce Customer Churn Analysis — Slide 4' },
    ]
  },
  3: {
    title: 'Netflix Movies & TV Shows Content Analysis — Project Gallery',
    url: 'https://mikhailjonathan24.github.io/netflix-executive-dashboard/',
    images: [
      { src: 'Gambar/Projects Section/Project 3/Netflix Movies & TV Shows Content Analysis/Netflix Executive Dashboard.png', alt: 'Netflix Executive Dashboard' },
    ]
  },
  4: {
    title: 'Global AI Adoption & Workforce Impact Analysis (2020–2026) — Project Gallery',
    images: [
      { src: 'Gambar/Projects Section/Project 4/Global AI Adoption & Workforce Impact Analysis (2020–2026)/1.png', alt: 'Global AI Adoption — Slide 1' },
      { src: 'Gambar/Projects Section/Project 4/Global AI Adoption & Workforce Impact Analysis (2020–2026)/2.png', alt: 'Global AI Adoption — Slide 2' },
      { src: 'Gambar/Projects Section/Project 4/Global AI Adoption & Workforce Impact Analysis (2020–2026)/3.png', alt: 'Global AI Adoption — Slide 3' },
      { src: 'Gambar/Projects Section/Project 4/Global AI Adoption & Workforce Impact Analysis (2020–2026)/4.png', alt: 'Global AI Adoption — Slide 4' },
      { src: 'Gambar/Projects Section/Project 4/Global AI Adoption & Workforce Impact Analysis (2020–2026)/5.png', alt: 'Global AI Adoption — Slide 5' },
      { src: 'Gambar/Projects Section/Project 4/Global AI Adoption & Workforce Impact Analysis (2020–2026)/6.png', alt: 'Global AI Adoption — Slide 6' },
      { src: 'Gambar/Projects Section/Project 4/Global AI Adoption & Workforce Impact Analysis (2020–2026)/7.png', alt: 'Global AI Adoption — Slide 7' },
      { src: 'Gambar/Projects Section/Project 4/Global AI Adoption & Workforce Impact Analysis (2020–2026)/8.png', alt: 'Global AI Adoption — Slide 8' },
      { src: 'Gambar/Projects Section/Project 4/Global AI Adoption & Workforce Impact Analysis (2020–2026)/9.png', alt: 'Global AI Adoption — Slide 9' },
    ]
  }
};

/** Populate the modal gallery for the given project id */
function loadModalContent(projectId) {
  const data = projectData[projectId];
  if (!data) return;

  modalTitle.textContent = data.title;
  modalGallery.innerHTML = data.images
    .map(img =>
      `<img src="${img.src}" alt="${img.alt}"
        class="w-full rounded-xl border border-slate-200 dark:border-slate-600 shadow object-contain bg-slate-50 dark:bg-slate-700/30" />`
    )
    .join('');

  // Show or hide the live link button
  if (data.url) {
    modalLink.href = data.url;
    modalLinkWrap.classList.remove('hidden');
  } else {
    modalLinkWrap.classList.add('hidden');
  }
}

/** Open the modal with a smooth entrance animation */
function openModal(projectId) {
  loadModalContent(projectId);
  projectModal.classList.add('active');
  projectModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden'; // prevent background scroll
  // Return focus to close button for accessibility
  modalClose.focus();
}

/** Close the modal */
function closeModal() {
  projectModal.classList.remove('active');
  projectModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Open on project card click
projectCards.forEach(card => {
  card.addEventListener('click', () => openModal(card.dataset.project));
  // Also support keyboard (Enter / Space) for accessibility
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal(card.dataset.project);
    }
  });
});

// Close via the X button
modalClose.addEventListener('click', closeModal);

// Close when clicking the dark overlay (outside the modal box)
projectModal.addEventListener('click', e => {
  if (e.target === projectModal) closeModal();
});

// Close with the Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && projectModal.classList.contains('active')) {
    closeModal();
  }
});


/* ─────────────────────────────────────────────────────────────
   6. SOCIAL LINKS — no JS needed; links are plain <a> elements
────────────────────────────────────────────────────────────── */
// Social media cards use plain anchor tags — no additional JS required.
