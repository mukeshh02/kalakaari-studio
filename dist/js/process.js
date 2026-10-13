/**
 * Kalakaari Studios - Interactive "How It Works" Switcher (Tasty Edits Style)
 * Exact reproduction of tastyedits.com vertical progress line sync and card switching
 */
(function () {
  'use strict';

  function initTastySwitcher() {
    var leftItems = [
      document.querySelector('.tasty-scene-1'),
      document.querySelector('.tasty-scene-2'),
      document.querySelector('.tasty-scene-3')
    ];
    var rightItems = [
      document.querySelector('.switching-layouts-right-1'),
      document.querySelector('.switching-layouts-right-2'),
      document.querySelector('.switching-layouts-right-3')
    ];
    var wholeRight = document.querySelector('.whole-right-side');
    if (!wholeRight || !leftItems[0] || !rightItems[0]) return;

    var lineWrapper = wholeRight.querySelector('.vertical-line-wrapper');
    var lineFill = wholeRight.querySelector('.vertical-line-fill');

    var current = 0;
    var duration = 5000;
    var startTime = null;
    var raf = null;
    var isPaused = false;
    var inViewport = false;

    function positionLine(el) {
      if (!el || !lineWrapper) return;
      var containerRect = wholeRight.getBoundingClientRect();
      var targetRect = el.getBoundingClientRect();
      lineWrapper.style.top = (targetRect.top - containerRect.top) + 'px';
      lineWrapper.style.height = targetRect.height + 'px';
    }

    function activate(index, isUser) {
      current = index;
      startTime = null;

      leftItems.forEach(function (el, i) {
        if (el) el.classList.toggle('switching-active-left', i === index);
      });
      rightItems.forEach(function (el, i) {
        if (el) el.classList.toggle('switching-active-right', i === index);
      });

      positionLine(rightItems[index]);
      if (lineFill) lineFill.style.transform = 'scaleY(0)';

      if (isUser) {
        isPaused = true;
        setTimeout(function () { isPaused = false; }, 6000);
      }
    }

    function loop(timestamp) {
      if (inViewport && !isPaused) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        if (lineFill) lineFill.style.transform = 'scaleY(' + progress + ')';
        if (progress >= 1) {
          activate((current + 1) % 3, false);
        }
      }
      raf = requestAnimationFrame(loop);
    }

    rightItems.forEach(function (item, idx) {
      if (!item) return;
      item.addEventListener('click', function () {
        activate(idx, true);
      });
    });

    wholeRight.addEventListener('mouseenter', function () { isPaused = true; });
    wholeRight.addEventListener('mouseleave', function () { isPaused = false; });

    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          inViewport = entry.isIntersecting;
          if (inViewport) {
            positionLine(rightItems[current]);
          }
        });
      }, { threshold: 0.2 });
      obs.observe(wholeRight);
    } else {
      inViewport = true;
    }

    window.addEventListener('resize', function () {
      positionLine(rightItems[current]);
    });

    window.addEventListener('load', function () {
      positionLine(rightItems[current]);
    });
    setTimeout(function () {
      positionLine(rightItems[current]);
    }, 400);

    activate(0, false);
    raf = requestAnimationFrame(loop);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTastySwitcher);
  } else {
    initTastySwitcher();
  }
})();
