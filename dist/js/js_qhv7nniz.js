
(function () {
  function fixChatsiZIndex() {
    const el = document.getElementById('chatsi-widget-container');

    if (el) {
      el.style.setProperty('z-index', '9998', 'important');
    }
  }

  fixChatsiZIndex();

  new MutationObserver(fixChatsiZIndex).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class']
  });

  setInterval(fixChatsiZIndex, 300);
})();
