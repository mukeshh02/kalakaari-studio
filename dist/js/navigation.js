(() => {
  const trigger = document.querySelector('.studio-services-trigger');
  const panel = document.getElementById('studio-services-menu');
  const header = document.querySelector('header [data-id="b2e2be6"]') || document.querySelector('header .elementor-element-b2e2be6');
  if (!header) return;

  // 1. Top viewport fade vignette so website content fades cleanly behind floating header
  let vignette = document.querySelector('.studio-top-fade-vignette');
  if (!vignette) {
    vignette = document.createElement('div');
    vignette.className = 'studio-top-fade-vignette';
    vignette.setAttribute('aria-hidden', 'true');
    document.body.prepend(vignette);
  }

  // 2. Services dropdown menu (Desktop)
  let closeTimer;
  const open = () => {
    if (!panel || !trigger) return;
    clearTimeout(closeTimer);
    panel.removeAttribute('inert');
    panel.classList.add('is-open');
    header.classList.add('menu-open');
    trigger.setAttribute('aria-expanded', 'true');
  };
  const close = () => {
    if (!panel || !trigger) return;
    clearTimeout(closeTimer);
    panel.classList.remove('is-open');
    panel.setAttribute('inert', '');
    header.classList.remove('menu-open');
    trigger.setAttribute('aria-expanded', 'false');
  };
  const scheduleClose = () => { closeTimer = setTimeout(close, 180); };

  if (trigger && panel) {
    trigger.addEventListener('click', open);
    trigger.addEventListener('mouseenter', open);
    header.addEventListener('mouseenter', () => clearTimeout(closeTimer));
    header.addEventListener('mouseleave', scheduleClose);
    document.addEventListener('pointerdown', (event) => {
      if (!header.contains(event.target)) close();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && panel.classList.contains('is-open')) {
        close();
        trigger.focus();
      }
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 1024) close();
    });
  }

  // 3. Floating Menu Fade-on-Scroll System
  let lastScrollY = window.scrollY || 0;
  let ticking = false;
  let touchTimer;

  const updateScrollState = () => {
    const currentY = Math.max(0, window.scrollY || 0);
    const delta = currentY - lastScrollY;

    if (currentY > 28) {
      header.classList.add('is-scrolled');
      vignette.classList.add('is-active');

      if (delta > 3 && currentY > 70) {
        header.classList.add('is-scrolling-down');
      } else if (delta < -6) {
        header.classList.remove('is-scrolling-down');
      }
    } else {
      header.classList.remove('is-scrolled', 'is-scrolling-down');
      vignette.classList.remove('is-active');
    }

    lastScrollY = currentY;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollState);
      ticking = true;
    }
  }, { passive: true });

  // Wake up floating menu to 100% opacity when hovered or touched
  const wakeHeader = () => {
    clearTimeout(touchTimer);
    header.classList.add('is-touched');
  };
  const unWakeHeader = (delay = 0) => {
    clearTimeout(touchTimer);
    if (delay > 0) {
      touchTimer = setTimeout(() => header.classList.remove('is-touched'), delay);
    } else {
      header.classList.remove('is-touched');
    }
  };

  header.addEventListener('pointerenter', wakeHeader);
  header.addEventListener('pointerleave', () => unWakeHeader(0));
  header.addEventListener('touchstart', wakeHeader, { passive: true });
  header.addEventListener('touchend', () => unWakeHeader(2200), { passive: true });

  // Initial check
  updateScrollState();
})();
