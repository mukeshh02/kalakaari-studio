(() => {
  const trigger = document.querySelector('.studio-services-trigger');
  const panel = document.getElementById('studio-services-menu');
  const header = document.querySelector('header [data-id="b2e2be6"]');
  if (!trigger || !panel || !header) return;

  let closeTimer;
  const open = () => {
    clearTimeout(closeTimer);
    panel.removeAttribute('inert');
    panel.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
  };
  const close = () => {
    clearTimeout(closeTimer);
    panel.classList.remove('is-open');
    panel.setAttribute('inert', '');
    trigger.setAttribute('aria-expanded', 'false');
  };
  const scheduleClose = () => { closeTimer = setTimeout(close, 180); };

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
})();
