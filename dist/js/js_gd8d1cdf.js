
document.addEventListener('click', function (event) {
  const pricingTitle = event.target.closest(
    '.e-n-accordion-item-title[data-accordion-index="4"]'
  );

  if (!pricingTitle) return;

  const link = pricingTitle.querySelector('.header-pricing-link');
  if (!link) return;

  event.preventDefault();
  event.stopPropagation();

  const href = link.href;

  const canvasTrigger = document.querySelector(
    '[href*="off_canvas%3A"]:not([href*="%3Aopen"])'
  );

  if (canvasTrigger) {
    canvasTrigger.click();
  }

  setTimeout(() => {
    window.location.href = href;
  }, 150);

}, true);
