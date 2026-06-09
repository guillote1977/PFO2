/* ============================================
   NovaSpark Landing Page — JavaScript
   Mobile menu, sticky header, scroll reveal
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ── Elements ──────────────────────────────
  const header    = document.getElementById('header');
  const menuBtn   = document.getElementById('menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = mobileNav.querySelectorAll('.mobile-nav__link');

  // ── Sticky Header on Scroll ───────────────
  let lastScroll = 0;
  const SCROLL_THRESHOLD = 20;

  function handleScroll() {
    const currentScroll = window.scrollY;

    if (currentScroll > SCROLL_THRESHOLD) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }

    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run once on load

  // ── Mobile Menu Toggle ────────────────────
  let isMenuOpen = false;

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    menuBtn.classList.toggle('active', isMenuOpen);
    mobileNav.classList.toggle('active', isMenuOpen);
    menuBtn.setAttribute('aria-expanded', isMenuOpen);
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
  }

  function closeMenu() {
    if (!isMenuOpen) return;
    isMenuOpen = false;
    menuBtn.classList.remove('active');
    mobileNav.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  menuBtn.addEventListener('click', toggleMenu);

  // Close menu when clicking a mobile nav link
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // ── Scroll Reveal (Intersection Observer) ─
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1,
      }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: just show everything
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // ── Smooth Scroll for Anchor Links ────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Animated Counter for Hero Stats ───────
  const statValues = document.querySelectorAll('.hero__stat-value');

  function animateValue(el, start, end, suffix, duration) {
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.floor(start + (end - start) * eased);

      if (suffix === '%') {
        el.textContent = current.toFixed(1) + suffix;
      } else if (suffix === 'x') {
        el.textContent = current + suffix;
      } else {
        el.textContent = current.toLocaleString('es-ES') + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // Ensure final value is exact
        el.textContent = el.dataset.finalValue;
      }
    }

    requestAnimationFrame(step);
  }

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          statValues.forEach(stat => {
            const text = stat.textContent.trim();
            stat.dataset.finalValue = text;

            if (text.includes('K+')) {
              const num = parseFloat(text);
              animateValue(stat, 0, num, 'K+', 1800);
            } else if (text.includes('%')) {
              const num = parseFloat(text);
              animateValue(stat, 0, num, '%', 1800);
            } else if (text.includes('x')) {
              const num = parseInt(text);
              animateValue(stat, 0, num, 'x', 1200);
            }
          });

          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  const statsContainer = document.querySelector('.hero__stats');
  if (statsContainer) statsObserver.observe(statsContainer);
});
