/* ============================================
   Berlin Furries — Script
   ============================================ */

(function () {
  'use strict';

  // --- Theme Toggle (Dark Mode) ---
  const themeToggle = document.querySelector('.theme-toggle');
  const themeIcon = document.querySelector('.theme-icon');
  const html = document.documentElement;

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('bf-theme', theme);
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-label',
      theme === 'dark' ? 'Light Mode umschalten' : 'Dark Mode umschalten'
    );
  }

  // Check saved preference or system preference
  const savedTheme = localStorage.getItem('bf-theme');
  if (savedTheme) {
    setTheme(savedTheme);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme('dark');
  }

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('bf-theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  // --- Mobile Navigation ---
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isOpen);
    navMenu.classList.toggle('open');
    document.body.style.overflow = isOpen ? '' : 'hidden';
  });

  // Close menu when clicking a link
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !navToggle.contains(e.target)) {
      navToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // --- Navbar scroll effect ---
  const navbar = document.querySelector('.navbar');
  let lastScroll = 0;

  function onScroll() {
    const scrollY = window.scrollY;
    navbar.classList.toggle('scrolled', scrollY > 50);
    lastScroll = scrollY;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Scroll Reveal ---
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Stagger animation for sibling cards
          const parent = entry.target.parentElement;
          const siblings = Array.from(parent.querySelectorAll('[data-reveal]'));
          const index = siblings.indexOf(entry.target);
          const delay = index * 100; // 100ms stagger

          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, delay);

          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // --- Paw Click Effect (Easter Egg) ---
  const pawEffectsContainer = document.getElementById('paw-effects');
  const pawEmojis = ['🐾', '🐾', '🐾', '🐾', '🐾', '🦊', '🐺', '🐱', '🐻'];
  let clickCount = 0;

  document.addEventListener('click', (e) => {
    if (prefersReducedMotion) return;

    // Don't fire on interactive elements
    const tag = e.target.closest('a, button, input, select, textarea');
    if (tag) return;

    clickCount++;

    const paw = document.createElement('span');
    paw.className = 'paw-click-effect';
    paw.textContent = pawEmojis[Math.floor(Math.random() * pawEmojis.length)];
    paw.style.left = e.clientX - 15 + 'px';
    paw.style.top = e.clientY - 15 + 'px';

    // Slight random rotation
    paw.style.setProperty('--rotation', (Math.random() * 40 - 20) + 'deg');

    pawEffectsContainer.appendChild(paw);

    paw.addEventListener('animationend', () => paw.remove());

    // Secret: After 10 clicks, show a special message
    if (clickCount === 10) {
      showSecretMessage('🐾 Du hast den geheimen Pfad gefunden! OwO');
    }
  });

  // --- Secret Message Toast ---
  function showSecretMessage(text) {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: linear-gradient(135deg, #b48eed, #ff8fab);
      color: #fff;
      padding: 1rem 2rem;
      border-radius: 50px;
      font-family: var(--font);
      font-weight: 700;
      font-size: 1rem;
      z-index: 10000;
      opacity: 0;
      transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 8px 30px rgba(180, 142, 237, 0.4);
      pointer-events: none;
    `;
    toast.textContent = text;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      setTimeout(() => toast.remove(), 500);
    }, 3000);
  }

  // --- Footer Easter Egg (OwO) ---
  const easterEgg = document.querySelector('.footer-easter');
  if (easterEgg) {
    let easterCount = 0;
    const easterMessages = [
      'OwO',
      'UwU',
      '*notices your website*',
      'What\'s this?',
      '(◕ᴗ◕✿)',
      'OwO *wags tail*',
      '🐺 Awoo!',
    ];

    easterEgg.addEventListener('click', () => {
      easterCount = (easterCount + 1) % easterMessages.length;
      easterEgg.textContent = easterMessages[easterCount];
      easterEgg.style.color = 'var(--lavender)';
      easterEgg.style.fontSize = '1.2rem';

      // Create confetti burst
      if (!prefersReducedMotion) {
        createConfettiBurst(easterEgg);
      }

      setTimeout(() => {
        easterEgg.style.color = '';
        easterEgg.style.fontSize = '';
      }, 2000);
    });
  }

  // --- Mini Confetti Burst ---
  function createConfettiBurst(originEl) {
    const rect = originEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const colors = ['#ffc3d0', '#b48eed', '#a8edea', '#8ec5fc', '#ffecd2', '#f6d365', '#ff8fab'];
    const count = 15;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('span');
      const angle = (Math.PI * 2 * i) / count;
      const distance = 40 + Math.random() * 60;
      const size = 4 + Math.random() * 6;

      particle.style.cssText = `
        position: fixed;
        left: ${cx}px;
        top: ${cy}px;
        width: ${size}px;
        height: ${size}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        opacity: 1;
      `;

      document.body.appendChild(particle);

      requestAnimationFrame(() => {
        particle.style.left = cx + Math.cos(angle) * distance + 'px';
        particle.style.top = cy + Math.sin(angle) * distance + 'px';
        particle.style.opacity = '0';
        particle.style.transform = `scale(0)`;
      });

      setTimeout(() => particle.remove(), 700);
    }
  }

  // --- Gallery item click effect ---
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      item.style.transform = 'scale(0.95)';
      setTimeout(() => {
        item.style.transform = '';
      }, 200);
    });
  });

  // --- Smooth scroll for same-page links (polyfill behavior) ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });

        // Update URL without jumping
        history.pushState(null, '', href);
      }
    });
  });

  // --- Konami Code Easter Egg ---
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;

  document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        konamiIndex = 0;
        activateKonamiMode();
      }
    } else {
      konamiIndex = 0;
    }
  });

  function activateKonamiMode() {
    showSecretMessage('🎮 Konami Code aktiviert! 🐾✨ Awoo~!');

    if (prefersReducedMotion) return;

    // Rain paws!
    const duration = 5000;
    const interval = setInterval(() => {
      const paw = document.createElement('span');
      paw.textContent = pawEmojis[Math.floor(Math.random() * pawEmojis.length)];
      paw.style.cssText = `
        position: fixed;
        top: -30px;
        left: ${Math.random() * 100}vw;
        font-size: ${1 + Math.random() * 2}rem;
        z-index: 10000;
        pointer-events: none;
        opacity: 0.7;
        transition: top ${2 + Math.random() * 3}s linear, opacity 0.5s;
      `;
      document.body.appendChild(paw);

      requestAnimationFrame(() => {
        paw.style.top = '110vh';
      });

      setTimeout(() => {
        paw.style.opacity = '0';
        setTimeout(() => paw.remove(), 600);
      }, 3000);
    }, 100);

    setTimeout(() => clearInterval(interval), duration);
  }

  // --- Parallax on Hero (subtle) ---
  if (!prefersReducedMotion) {
    const heroPaws = document.querySelectorAll('.floating-paw');

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY > window.innerHeight) return; // Only in hero view

      heroPaws.forEach((paw, i) => {
        const speed = 0.2 + (i % 3) * 0.1;
        paw.style.transform = `translateY(${scrollY * speed}px)`;
      });
    }, { passive: true });
  }

  // --- Active Nav Link Highlight ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

  function highlightActiveSection() {
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightActiveSection, { passive: true });
  highlightActiveSection();

  // CSS for active nav link
  const activeStyle = document.createElement('style');
  activeStyle.textContent = `
    .nav-menu a.active {
      color: var(--lavender-deep);
      background: rgba(180, 142, 237, 0.12);
    }
    [data-theme="dark"] .nav-menu a.active {
      color: var(--lavender);
      background: rgba(180, 142, 237, 0.2);
    }
  `;
  document.head.appendChild(activeStyle);

})();
