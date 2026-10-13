(() => {
  const tabsWrap = document.querySelector('.studio-pricing-tabs-wrap');
  const tabsTrack = document.querySelector('.studio-pricing-tabs');
  const tabs = [...document.querySelectorAll('.studio-pricing-tabs [role="tab"]')];
  const tabGlider = document.querySelector('.studio-tab-glider');
  const subtabsContainer = document.getElementById('studio-pricing-subtabs');
  const cards = document.getElementById('studio-pricing-cards');
  if (!tabs.length || !subtabsContainer || !cards) return;

  // Base rates and services carried over from Kalakaari Studio data
  const services = {
    wedding: {
      unit: 'film',
      quantities: [1, 4, 8],
      options: [
        ['Wedding highlight', 5000],
        ['Documentary highlight', 7000],
        ['Wedding film documentary', 7000]
      ]
    },
    reels: {
      unit: 'reel',
      quantities: [1, 4, 8],
      options: [
        ['Short reel (up to 40 sec)', 800],
        ['Long reel (90 sec)', 1500]
      ]
    },
    album: {
      unit: 'sheet',
      quantities: [30, 60, 100],
      options: [
        ['Basic album design', 45],
        ['Medium album design', 55],
        ['Pro album design', 70]
      ]
    },
    photo: {
      unit: 'photo',
      quantities: [20, 50, 100],
      options: [
        ['Basic photo editing', 60],
        ['Pro photo editing', 80]
      ]
    },
    commercial: {
      unit: 'video',
      quantities: [1, 3, 6],
      options: [
        ['Commercial video', 4999],
        ['Social media video', 3000]
      ]
    }
  };

  const discounts = [0, 7, 15];
  const tierNames = ['Single Project', 'Studio Pack', 'Volume Pack'];
  const money = (n, decimals = 0) => '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  let category = 'wedding';
  let selectedOptionIndex = 0;

  function moveGlider(container, activeEl, glider) {
    if (!container || !activeEl || !glider) return;
    glider.style.transform = `translate3d(${activeEl.offsetLeft}px, ${activeEl.offsetTop}px, 0)`;
    glider.style.width = `${activeEl.offsetWidth}px`;
    glider.style.height = `${activeEl.offsetHeight}px`;
    glider.style.opacity = '1';
  }

  function centerInScroll(container, el) {
    if (!container || !el) return;
    const containerWidth = container.clientWidth;
    const elOffset = el.offsetLeft;
    const elWidth = el.offsetWidth;
    const target = elOffset - (containerWidth / 2) + (elWidth / 2);
    container.scrollTo({
      left: Math.max(0, target),
      behavior: 'smooth'
    });
  }

  function renderCards() {
    const service = services[category];
    const [name, rate] = service.options[selectedOptionIndex] || service.options[0];
    cards.innerHTML = service.quantities.map((qty, index) => {
      const discount = discounts[index];
      const original = rate * qty;
      const total = Math.round(original * (1 - discount / 100));
      const unitRate = rate * (1 - discount / 100);
      const unitLabel = service.unit + (qty === 1 ? '' : 's');
      const details = `${name}, ${qty} ${unitLabel}, ${discount}% volume discount, estimated total ${money(total)}`;
      const href = `https://wa.me/918654989156?text=${encodeURIComponent(`Hello Kalakaari Studios! I would like a quote for ${details}. Please confirm the scope and turnaround.`)}`;
      return `<article class="studio-price-card${index === 1 ? ' is-featured' : ''}">
        <span class="studio-price-discount">${discount}% discount</span>
        <h3>${tierNames[index]}</h3>
        <p class="studio-price-quantity">${qty} ${unitLabel}</p>
        <div class="studio-price-rate"><strong>${money(unitRate, Number.isInteger(unitRate) ? 0 : 2)}</strong><span>/ ${service.unit}</span></div>
        <div class="studio-price-total"><span>Estimated total</span><strong>${money(total)}</strong></div>
        ${discount ? `<p class="studio-price-savings">Save ${money(original - total)} on this pack</p>` : '<p class="studio-price-savings">Listed base rate</p>'}
        <a class="studio-price-cta" href="${href}" target="_blank" rel="noopener">Request this package <span aria-hidden="true">→</span></a>
      </article>`;
    }).join('');
  }

  function renderSubtabs() {
    const service = services[category];
    let subGlider = subtabsContainer.querySelector('.studio-subtab-glider');
    subtabsContainer.innerHTML = '';
    if (!subGlider) {
      subGlider = document.createElement('div');
      subGlider.className = 'studio-subtab-glider';
      subGlider.setAttribute('aria-hidden', 'true');
    }
    subtabsContainer.appendChild(subGlider);

    if (selectedOptionIndex >= service.options.length) {
      selectedOptionIndex = 0;
    }

    const buttons = service.options.map(([optName], idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.role = 'tab';
      btn.setAttribute('aria-selected', idx === selectedOptionIndex ? 'true' : 'false');
      btn.tabIndex = idx === selectedOptionIndex ? 0 : -1;
      btn.textContent = optName;
      btn.addEventListener('click', () => {
        selectedOptionIndex = idx;
        buttons.forEach((b, i) => {
          const isAct = i === selectedOptionIndex;
          b.setAttribute('aria-selected', isAct ? 'true' : 'false');
          b.tabIndex = isAct ? 0 : -1;
        });
        moveGlider(subtabsContainer, btn, subGlider);
        centerInScroll(subtabsContainer, btn);
        renderCards();
      });
      subtabsContainer.appendChild(btn);
      return btn;
    });

    requestAnimationFrame(() => {
      if (buttons[selectedOptionIndex]) {
        moveGlider(subtabsContainer, buttons[selectedOptionIndex], subGlider);
        centerInScroll(subtabsContainer, buttons[selectedOptionIndex]);
      }
    });
  }

  function setCategory(key, focus = false) {
    category = key;
    selectedOptionIndex = 0;
    subtabsContainer.scrollLeft = 0;
    let activeTab = null;
    tabs.forEach(tab => {
      const active = tab.dataset.service === key;
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
      tab.tabIndex = active ? 0 : -1;
      if (active) {
        activeTab = tab;
        if (focus) tab.focus();
      }
    });
    if (activeTab && tabGlider) {
      moveGlider(tabsTrack, activeTab, tabGlider);
      centerInScroll(tabsWrap, activeTab);
    }
    renderSubtabs();
    renderCards();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => setCategory(tab.dataset.service));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      setCategory(tabs[next].dataset.service, true);
    });
  });

  window.addEventListener('resize', () => {
    const curTab = tabs.find(t => t.dataset.service === category);
    if (curTab && tabGlider) {
      moveGlider(tabsTrack, curTab, tabGlider);
      centerInScroll(tabsWrap, curTab);
    }
    const subBtns = subtabsContainer.querySelectorAll('button');
    const subGlider = subtabsContainer.querySelector('.studio-subtab-glider');
    if (subBtns[selectedOptionIndex] && subGlider) {
      moveGlider(subtabsContainer, subBtns[selectedOptionIndex], subGlider);
      centerInScroll(subtabsContainer, subBtns[selectedOptionIndex]);
    }
  });

  // Delay glider calculation on load to ensure fonts are fully rendered
  window.addEventListener('load', () => {
    setCategory(category);
  });
  setTimeout(() => {
    setCategory(category);
  }, 250);

  setCategory(category);
})();
