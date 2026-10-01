
document.addEventListener('DOMContentLoaded', function () {

  const wrapper = document.getElementById('ytcm-pricing-tabs');
  if (!wrapper) return;

  const tabs = wrapper.querySelectorAll('.e-n-tab-title');
  const panels = wrapper.querySelectorAll('.e-n-tabs-content > div');

  const els = {
    starter: document.getElementById('ytcm-price-starter'),
    pro: document.getElementById('ytcm-price-pro')
  };

  // Store original HTML
  const original = {
    starter: els.starter.innerHTML,
    pro: els.pro.innerHTML
  };

  // Replace full price including optional +
  const renderPrice = (template, value) => {
    return template.replace(/\$\d[\d,]*\+?/g, value);
  };

  const updatePrices = (index) => {
    const panel = panels[index];
    if (!panel) return;

    const starter = panel.getAttribute('data-starter');
    const pro = panel.getAttribute('data-pro');

    if (!starter || !pro) return;

    Object.values(els).forEach(el => {
      if (el) el.style.opacity = 0;
    });

    setTimeout(() => {

      els.starter.innerHTML = renderPrice(original.starter, starter);
      els.pro.innerHTML = renderPrice(original.pro, pro);

      Object.values(els).forEach(el => {
        if (el) el.style.opacity = 1;
      });

    }, 120);
  };

  // Tab clicks
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => updatePrices(index));
  });

  // Initial sync
  const activeIndex = Array.from(tabs).findIndex(tab =>
    tab.getAttribute('aria-selected') === 'true'
  );

  if (activeIndex !== -1) {
    updatePrices(activeIndex);
  }

});
