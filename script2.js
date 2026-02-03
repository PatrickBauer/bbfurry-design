/**
 * Berlin Furries 🐾 — Script
 * Smooth scroll, dark mode, animations, easter eggs
 */

(function () {
  'use strict';

  // ---- Dark Mode Toggle ----
  const toggle = document.querySelector('.dark-mode-toggle');
  const root = document.documentElement;

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('bf-theme', theme);
  }

  // Init from saved preference or system
  const saved = localStorage.getItem('bf-theme');
  if (saved) {
    setTheme(saved);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme('dark');
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('bf-theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  // ---- Mobile Navigation ----
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !expanded);
      navToggle.setAttribute('aria-label', expanded ? 'Menü öffnen' : 'Menü schließen');
      navMenu.classList.toggle('nav-open');
    });

    // Close menu on link click
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Menü öffnen');
        navMenu.classList.remove('nav-open');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Menü öffnen');
        navMenu.classList.remove('nav-open');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('nav-open')) {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Menü öffnen');
        navMenu.classList.remove('nav-open');
        navToggle.focus();
      }
    });
  }

  // ---- Scroll Animations (Intersection Observer) ----
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function initScrollAnimations() {
    const elements = document.querySelectorAll(
      '.section-title, .about-card, .event-card, .gallery-item, .rule-card, .join-btn'
    );

    if (prefersReducedMotion.matches) {
      // If reduced motion, just show everything immediately
      elements.forEach(el => el.classList.add('animate-in'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    elements.forEach(el => observer.observe(el));
  }

  initScrollAnimations();

  // ---- Paw Click Easter Egg ----
  const pawBurstContainer = document.getElementById('paw-burst');
  const pawEmojis = ['🐾', '✨', '💜', '💖', '🌟', '🐺', '🦊'];

  function createPawBurst(x, y) {
    if (prefersReducedMotion.matches) return;

    const count = 8 + Math.floor(Math.random() * 5);
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('span');
      particle.className = 'paw-particle';
      particle.textContent = pawEmojis[Math.floor(Math.random() * pawEmojis.length)];

      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const distance = 60 + Math.random() * 80;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance - 30;
      const rot = (Math.random() - 0.5) * 360;

      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      particle.style.setProperty('--tx', tx + 'px');
      particle.style.setProperty('--ty', ty + 'px');
      particle.style.setProperty('--rot', rot + 'deg');
      particle.style.fontSize = (1 + Math.random() * 1) + 'rem';

      pawBurstContainer.appendChild(particle);

      // Remove after animation
      particle.addEventListener('animationend', () => particle.remove());
    }
  }

  // Clickable paw handlers
  document.querySelectorAll('.clickable-paw').forEach(paw => {
    function handlePawClick(e) {
      const rect = paw.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      createPawBurst(x, y);

      paw.classList.remove('paw-clicked');
      // Force reflow
      void paw.offsetWidth;
      paw.classList.add('paw-clicked');

      setTimeout(() => paw.classList.remove('paw-clicked'), 500);
    }

    paw.addEventListener('click', handlePawClick);
    paw.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handlePawClick(e);
      }
    });
  });

  // ---- Gallery Items — paw burst on click ----
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', (e) => {
      createPawBurst(e.clientX, e.clientY);
    });
  });

  // ---- Smooth Scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion.matches ? 'auto' : 'smooth' });
        // Update URL without scrolling
        history.pushState(null, '', targetId);
      }
    });
  });

  // ---- Navbar shadow on scroll ----
  const navbar = document.querySelector('.navbar');
  let lastScroll = 0;

  function handleNavScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 100) {
      navbar.style.boxShadow = '0 4px 30px var(--nav-shadow)';
    } else {
      navbar.style.boxShadow = '0 2px 20px var(--nav-shadow)';
    }
    lastScroll = scrollY;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // ---- Easter Egg: OwO reveal ----
  const easterEgg = document.querySelector('.easter-egg');
  if (easterEgg) {
    let clickCount = 0;
    easterEgg.addEventListener('click', () => {
      clickCount++;
      if (clickCount >= 3) {
        easterEgg.textContent = 'OwO What\'s this?! UwU 🐾✨';
        easterEgg.style.color = 'var(--accent)';
        easterEgg.style.fontSize = '1.2rem';
        createPawBurst(
          easterEgg.getBoundingClientRect().left + easterEgg.offsetWidth / 2,
          easterEgg.getBoundingClientRect().top
        );
        clickCount = 0;
        setTimeout(() => {
          easterEgg.textContent = 'OwO';
          easterEgg.style.color = '';
          easterEgg.style.fontSize = '';
        }, 3000);
      }
    });
  }

  // ---- Konami Code Easter Egg (↑↑↓↓←→←→BA) ----
  const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a'
  ];
  let konamiIndex = 0;

  document.addEventListener('keydown', (e) => {
    if (e.key === konamiSequence[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiSequence.length) {
        konamiIndex = 0;
        activateKonamiEasterEgg();
      }
    } else {
      konamiIndex = 0;
    }
  });

  function activateKonamiEasterEgg() {
    if (prefersReducedMotion.matches) return;

    // Rain paws from the top!
    const duration = 3000;
    const interval = 100;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;
      if (elapsed >= duration) {
        clearInterval(timer);
        return;
      }

      const paw = document.createElement('span');
      paw.className = 'paw-particle';
      paw.textContent = pawEmojis[Math.floor(Math.random() * pawEmojis.length)];
      paw.style.left = Math.random() * window.innerWidth + 'px';
      paw.style.top = '-20px';
      paw.style.setProperty('--tx', (Math.random() - 0.5) * 100 + 'px');
      paw.style.setProperty('--ty', window.innerHeight + 50 + 'px');
      paw.style.setProperty('--rot', Math.random() * 360 + 'deg');
      paw.style.fontSize = (1.5 + Math.random() * 1.5) + 'rem';
      paw.style.animationDuration = (1.5 + Math.random()) + 's';

      pawBurstContainer.appendChild(paw);
      paw.addEventListener('animationend', () => paw.remove());
    }, interval);
  }
})();
