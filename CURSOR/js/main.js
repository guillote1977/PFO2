(function () {
  'use strict';

  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = navMenu.querySelectorAll('.header__link');

  /* Sticky header shadow on scroll */
  function onScroll() {
    header.classList.toggle('header--scrolled', window.scrollY > 10);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile navigation toggle */
  function closeMenu() {
    navToggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function openMenu() {
    navToggle.setAttribute('aria-expanded', 'true');
    navMenu.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  navToggle.addEventListener('click', function () {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });

  navLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  /* Close menu on resize to desktop */
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 768) {
      closeMenu();
    }
  });
})();
