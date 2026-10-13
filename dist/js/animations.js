/**
 * ==========================================================================
 * KALAKAARI STUDIOS - SIGNATURE CINEMATIC MOTION SYSTEM
 * Powered by GSAP & ScrollTrigger
 * GPU-Accelerated, Non-Destructive, Choreographed Animation Pipeline
 * ==========================================================================
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. GLOBAL CONFIGURATION & DESIGN TOKENS
  // --------------------------------------------------------------------------
  const isMobile = window.innerWidth <= 1024;
  const isTouchDevice = Boolean(('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth <= 768));
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const CONFIG = {
    durations: {
      fast: 0.4,
      normal: 0.8,
      slow: 1.15,
      capsuleDrop: 0.65,
      capsuleExpand: 0.6,
      themeFade: 0.62,
      countUp: 1.6,
    },
    eases: {
      smooth: 'power3.out',
      theme: 'power2.out',
      bounce: 'back.out(1.7)',
      softBounce: 'back.out(1.3)',
      elastic: 'elastic.out(1, 0.6)',
      pillExpand: 'expo.out',
      splitReveal: 'power4.out',
      pop: 'back.out(1.6)',
    },
    staggers: {
      tight: 0.06,
      normal: 0.09,
      relaxed: 0.14,
    },
    distance: {
      large: isMobile ? 30 : 70,
      medium: isMobile ? 20 : 45,
      small: isMobile ? 12 : 25,
    }
  };

  // Low-end device detection
  const isLowEndDevice = Boolean(
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
    (navigator.deviceMemory && navigator.deviceMemory <= 4)
  );

  // Global Idle & Off-Screen Animation Manager
  const idleRegistry = new Map();
  const idleObserver = ('IntersectionObserver' in window)
    ? new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const item = idleRegistry.get(entry.target);
          if (!item) return;
          if (entry.isIntersecting) {
            entry.target.classList.remove('is-offscreen');
            if (!item.isPlaying && !document.hidden) {
              item.isPlaying = true;
              item.onResume && item.onResume();
            }
          } else {
            entry.target.classList.add('is-offscreen');
            if (item.isPlaying) {
              item.isPlaying = false;
              item.onPause && item.onPause();
            }
          }
        });
      }, { threshold: 0.05, rootMargin: '120px 0px 120px 0px' })
    : null;

  function registerIdleAnimation(element, { onPause, onResume }) {
    if (!element) return;
    idleRegistry.set(element, { onPause, onResume, isPlaying: true });
    if (idleObserver) idleObserver.observe(element);
  }

  document.addEventListener('visibilitychange', () => {
    const isHidden = document.hidden;
    idleRegistry.forEach((item, el) => {
      if (isHidden) {
        if (item.isPlaying) {
          item.isPlaying = false;
          item.onPause && item.onPause();
        }
      } else {
        const rect = el.getBoundingClientRect();
        const inView = rect.top < window.innerHeight + 120 && rect.bottom > -120;
        if (inView && !item.isPlaying) {
          item.isPlaying = true;
          item.onResume && item.onResume();
        }
      }
    });
  }, { passive: true });

  // Helper: Safely add will-change during animation and remove afterwards
  function setGpuProps(el) {
    if (!el) return;
    gsap.set(el, { force3D: true });
  }

  function clearGpuProps(el) {
    if (!el) return;
    if (el.length) {
      el.forEach(item => item && item.style && (item.style.willChange = 'auto'));
    } else if (el.style) {
      el.style.willChange = 'auto';
    }
  }

  // Helper: Text Splitting by Words with Overflow Mask Wrapper
  function splitTextIntoWords(element) {
    if (!element || element.dataset.splitDone) return;
    element.dataset.splitDone = 'true';

    // Support line breaks (e.g. <br>)
    const lineParts = element.innerHTML.split(/<br\s*[\/]?>/i);
    if (lineParts.length > 1) {
      const fullText = element.textContent.replace(/\s+/g, ' ').trim();
      element.setAttribute('aria-label', fullText);
      element.innerHTML = '';
      const allWords = [];
      lineParts.forEach((part) => {
        const temp = document.createElement('div');
        temp.innerHTML = part;
        const lineText = temp.textContent.trim();
        if (!lineText) return;

        const mask = document.createElement('span');
        mask.className = 'split-line-mask';

        const words = lineText.split(/\s+/);
        words.forEach((w, idx) => {
          const wordSpan = document.createElement('span');
          wordSpan.className = 'split-word';
          wordSpan.textContent = w;
          mask.appendChild(wordSpan);
          allWords.push(wordSpan);

          if (idx < words.length - 1) {
            const space = document.createElement('span');
            space.className = 'split-word-space';
            space.innerHTML = '&nbsp;';
            mask.appendChild(space);
          }
        });

        element.appendChild(mask);
      });
      return allWords;
    }

    const rawText = element.textContent.trim();
    if (!rawText) return;

    element.setAttribute('aria-label', rawText);
    element.innerHTML = '';

    const mask = document.createElement('span');
    mask.className = 'split-line-mask';

    const words = rawText.split(/\s+/);
    words.forEach((w, idx) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'split-word';
      wordSpan.textContent = w;
      mask.appendChild(wordSpan);

      if (idx < words.length - 1) {
        const space = document.createElement('span');
        space.className = 'split-word-space';
        space.innerHTML = '&nbsp;';
        mask.appendChild(space);
      }
    });

    element.appendChild(mask);
    return mask.querySelectorAll('.split-word');
  }

  // --------------------------------------------------------------------------
  // 2. SILK SMOOTH SCROLL (LENIS) INTEGRATION
  // --------------------------------------------------------------------------
  let lenisInstance = null;
  function initLenis() {
    if (typeof window.Lenis === 'undefined' || prefersReduced) return;

    try {
      lenisInstance = new window.Lenis({
        duration: 1.25,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.2,
        infinite: false,
      });

      window.lenis = lenisInstance;

      lenisInstance.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenisInstance.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);

      // Smooth scroll for all on-page anchors
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
          const href = anchor.getAttribute('href');
          if (!href || href === '#' || href === '#top') {
            e.preventDefault();
            lenisInstance.scrollTo(0, { duration: 1.2 });
            return;
          }
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            lenisInstance.scrollTo(target, { offset: -95, duration: 1.2 });
          }
        });
      });
    } catch (e) {
      console.warn('[Kalakaari Motion] Lenis init skipped:', e);
    }
  }

  // --------------------------------------------------------------------------
  // 3. TOP SCROLL PROGRESS BAR
  // --------------------------------------------------------------------------
  function initProgressBar() {
    if (prefersReduced) return;
    let bar = document.getElementById('kalakaari-scroll-progress');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'kalakaari-scroll-progress';
      document.body.prepend(bar);
    }

    gsap.to(bar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.25,
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. SHARED DESKTOP MOUSEMOVE & CURSOR ENGINE (ZERO LAYOUT THRASHING)
  // --------------------------------------------------------------------------
  let activeTiltCard = null;
  let activeTiltRect = null;
  let activeMagneticBtn = null;
  let activeBtnRect = null;

  let mouseX = 0;
  let mouseY = 0;
  let mouseDirty = false;

  function initCursor() {
    if (isMobile || isTouchDevice || prefersReduced || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let dot = document.getElementById('kalakaari-cursor-dot');
    let ring = document.getElementById('kalakaari-cursor-ring');

    if (!dot) {
      dot = document.createElement('div');
      dot.id = 'kalakaari-cursor-dot';
      document.body.appendChild(dot);
    }
    if (!ring) {
      ring = document.createElement('div');
      ring.id = 'kalakaari-cursor-ring';
      document.body.appendChild(ring);
    }

    const setDotX = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3' });
    const setDotY = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3' });
    const setRingX = gsap.quickTo(ring, 'x', { duration: 0.25, ease: 'power3' });
    const setRingY = gsap.quickTo(ring, 'y', { duration: 0.25, ease: 'power3' });

    gsap.ticker.add(() => {
      if (!mouseDirty) return;
      mouseDirty = false;

      setDotX(mouseX);
      setDotY(mouseY);
      setRingX(mouseX);
      setRingY(mouseY);

      if (activeTiltCard && activeTiltRect) {
        const x = mouseX - activeTiltRect.left - activeTiltRect.width / 2;
        const y = mouseY - activeTiltRect.top - activeTiltRect.height / 2;
        gsap.to(activeTiltCard, {
          rotateY: (x / activeTiltRect.width) * (isLowEndDevice ? 6 : 12),
          rotateX: -(y / activeTiltRect.height) * (isLowEndDevice ? 6 : 12),
          transformPerspective: 900,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }

      if (activeMagneticBtn && activeBtnRect) {
        const x = (mouseX - activeBtnRect.left - activeBtnRect.width / 2) * 0.22;
        const y = (mouseY - activeBtnRect.top - activeBtnRect.height / 2) * 0.22;
        gsap.to(activeMagneticBtn, { x, y, duration: 0.2, ease: 'power2.out', overwrite: 'auto' });
      }
    });

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      mouseDirty = true;
    }, { passive: true });

    const hoverTargets = 'a, button, [role="button"], input, select, .kalakaari-dropdown-item, .pdf-modal-card';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverTargets)) {
        ring.classList.add('cursor-hover');
      }
    }, { passive: true });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverTargets)) {
        ring.classList.remove('cursor-hover');
      }
    }, { passive: true });
  }

  function setupCardTilt(cards) {
    if (isMobile || isTouchDevice || prefersReduced || isLowEndDevice) return;
    cards.forEach(card => {
      card.classList.add('kalakaari-tilt-card');
      card.addEventListener('mouseenter', () => {
        activeTiltCard = card;
        activeTiltRect = card.getBoundingClientRect();
      }, { passive: true });
      card.addEventListener('mouseleave', () => {
        if (activeTiltCard === card) {
          activeTiltCard = null;
          activeTiltRect = null;
        }
        gsap.to(card, {
          rotateY: 0,
          rotateX: 0,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }, { passive: true });
    });
  }

  function setupMagneticButtons(btns) {
    if (isMobile || isTouchDevice || prefersReduced || isLowEndDevice) return;
    btns.forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        activeMagneticBtn = btn;
        activeBtnRect = btn.getBoundingClientRect();
      }, { passive: true });
      btn.addEventListener('mouseleave', () => {
        if (activeMagneticBtn === btn) {
          activeMagneticBtn = null;
          activeBtnRect = null;
        }
        gsap.to(btn, { x: 0, y: 0, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
      }, { passive: true });
    });
  }

  // --------------------------------------------------------------------------
  // 5. NAVBAR MOTION & HERO MASTER LOAD TIMELINE (FIX A: CURTAIN OVERLAY)
  // --------------------------------------------------------------------------
  function initHeroSection() {
    const heroSection = document.querySelector('.elementor-element-f1a913c') || document.querySelector('main');
    const heroCardContainer = document.querySelector('[data-id="fcd6bfc"]');
    const servicesSection = document.querySelector('[data-id="82e95b1"]') || document.getElementById('services-overview-section');
    const belowFoldSections = document.querySelectorAll(
      '#long-form-video-section, #photos-albums-portrait-section, [data-id="160c280e"], #how-it-works, [data-id="e46edad"], #pricing, footer'
    );
    const pillHeader = document.querySelector('.elementor-element-b2e2be6');
    const navLogo = document.querySelector('.studio-brand, .elementor-element-a274151');
    const navLinks = document.querySelectorAll('.studio-desktop-nav .studio-services-trigger, .studio-desktop-nav a, .elementor-element-5334454 .e-n-menu-item');
    const desktopCta = document.querySelector('.studio-header-cta, .kalakaari-desktop-cta-btn');
    const mobileBurger = document.querySelector('#kalakaari-header-hamburger-btn');

    const heroHeadline = document.querySelector('.elementor-element-cd9ba84 h1, h1.elementor-headline');
    const heroSubhead = document.querySelector('.elementor-element-43d820f');
    const heroBtns = document.querySelectorAll('.elementor-element-f01e3e3 .elementor-button');
    const heroReviewBadge = document.querySelector('.elementor-element-1b976183') || document.querySelector('.elementor-element-561b6221');
    const heroShowcase = document.querySelector('.hero-image-container') || document.querySelector('.elementor-element-0790dca');

    if (prefersReduced) {
      document.documentElement.classList.add('site-ready', 'nav-expanded', 'hero-intro-complete');
      document.body.removeAttribute('style');
      document.documentElement.removeAttribute('style');
      if (pillHeader) gsap.set(pillHeader, { opacity: 1, y: 0 });
      if (heroCardContainer) gsap.set(heroCardContainer, { opacity: 1, y: 0, pointerEvents: 'auto' });
      if (servicesSection) gsap.set(servicesSection, { opacity: 1, y: 0, pointerEvents: 'auto' });
      if (belowFoldSections.length) gsap.set(belowFoldSections, { opacity: 1, pointerEvents: 'auto' });
      if (heroSection) gsap.set(heroSection, { opacity: 1 });
      initAllRemainingSections();
      return;
    }

    const isNarrow = window.innerWidth < 768;

    const masterTl = gsap.timeline({
      paused: true,
      defaults: { ease: CONFIG.eases.smooth },
      onComplete: () => {
        document.body.removeAttribute('style');
        document.documentElement.removeAttribute('style');
        document.documentElement.classList.add('site-ready', 'nav-expanded', 'hero-intro-complete');
        if (belowFoldSections.length) {
          gsap.set(belowFoldSections, { opacity: 1, pointerEvents: 'auto' });
        }
        clearGpuProps([pillHeader, heroHeadline, heroSubhead, heroShowcase]);
        initNavbarScrollReaction(pillHeader);
        initAllRemainingSections();
        initFailSafeVisibility();
        ScrollTrigger.refresh();
      }
    });

    // Ambient floating orbs (subtle, slow drift - desktop only)
    if (!isTouchDevice && window.innerWidth > 768) {
      const orb1 = document.querySelector('.kalakaari-ambient-orb.orb-1');
      const orb2 = document.querySelector('.kalakaari-ambient-orb.orb-2');
      if (orb1) {
        const orb1Tween = gsap.to(orb1, {
          x: isLowEndDevice ? 15 : 35,
          y: isLowEndDevice ? -10 : -25,
          duration: 13,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
        registerIdleAnimation(orb1, {
          onPause: () => orb1Tween.pause(),
          onResume: () => orb1Tween.play()
        });
      }
      if (orb2) {
        const orb2Tween = gsap.to(orb2, {
          x: isLowEndDevice ? -15 : -30,
          y: isLowEndDevice ? 10 : 20,
          duration: 15,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
        registerIdleAnimation(orb2, {
          onPause: () => orb2Tween.pause(),
          onResume: () => orb2Tween.play()
        });
      }
    }

    // Pre-split headline and strictly hide all hero content & below-hero sections so NOTHING snaps in prematurely.
    // Note: heroCardContainer ([data-id="fcd6bfc"]) background canvas stays at opacity: 1 from frame 0 so the background never flashes!
    let headlineWords = null;
    const headlineContainer = heroHeadline ? (heroHeadline.closest('.elementor-element-cd9ba84') || heroHeadline) : null;
    if (heroHeadline) {
      headlineWords = splitTextIntoWords(heroHeadline);
      if (headlineWords && headlineWords.length) {
        gsap.set([headlineContainer, heroHeadline], { opacity: 1, visibility: 'visible' });
        gsap.set(headlineWords, { yPercent: 110, opacity: 0, rotateZ: isNarrow ? 0 : 1.5 });
      } else {
        gsap.set(heroHeadline, { opacity: 0, y: 24 });
      }
    }
    if (heroCardContainer) gsap.set(heroCardContainer, { opacity: 1, y: 0, pointerEvents: 'auto' });
    if (servicesSection) gsap.set(servicesSection, { opacity: 1, y: 0, pointerEvents: 'auto' });
    if (belowFoldSections.length) gsap.set(belowFoldSections, { opacity: 1, pointerEvents: 'auto' });
    if (heroSubhead) gsap.set(heroSubhead, { opacity: 0, y: 20 });
    if (heroBtns && heroBtns.length) gsap.set(heroBtns, { opacity: 0, y: 16 });
    const showcaseSubItems = heroShowcase
      ? heroShowcase.querySelectorAll('.h2s-stage, .h2s-tagline-bar')
      : [];
    if (heroShowcase) {
      gsap.set(heroShowcase, { opacity: 0, scale: 0.97, y: isNarrow ? 14 : 20 });
      if (showcaseSubItems.length) {
        gsap.set(showcaseSubItems, { opacity: 0, y: 14 });
      }
    }
    if (heroReviewBadge) gsap.set(heroReviewBadge, { opacity: 0 });
    const heroArrowSvgInit = document.getElementById('kalakaari-hero-arrow-svg');
    if (heroArrowSvgInit) gsap.set(heroArrowSvgInit, { opacity: 0, visibility: 'hidden' });
    const trustedStripInit = document.querySelector('.elementor-element-850f210') || document.querySelector('.trusted-by-carousel-dark');
    if (trustedStripInit) gsap.set(trustedStripInit, { opacity: 0 });

    // b) Premium Entrance: Sleek floating dot / tablet capsule drops from above and morphs open
    if (pillHeader) {
      setGpuProps(pillHeader);
      gsap.set(pillHeader, { transformOrigin: 'center center' });

      // Identify inner header elements with accurate modern & legacy selectors
      const brandLogo = pillHeader.querySelector('.studio-brand, .elementor-element-a274151');
      const desktopNav = pillHeader.querySelector('.studio-desktop-nav, .elementor-element-5334454');
      const navItems = desktopNav ? desktopNav.querySelectorAll('.studio-services-trigger, a, .e-n-menu-item') : [];
      const desktopCtaBtn = pillHeader.querySelector('.studio-header-cta, .kalakaari-desktop-cta-btn');
      const mobileBurgerBtn = pillHeader.querySelector('#kalakaari-header-hamburger-btn');

      // Create glowing accent dot inside the pill capsule
      let introDot = pillHeader.querySelector('.kalakaari-nav-intro-dot');
      if (!introDot) {
        introDot = document.createElement('div');
        introDot.className = 'kalakaari-nav-intro-dot';
        introDot.setAttribute('aria-hidden', 'true');
        pillHeader.appendChild(introDot);
      }

      // Hide real navigation items during initial compact dot/tablet state
      if (brandLogo) gsap.set(brandLogo, { opacity: 0, x: -14, visibility: 'hidden', pointerEvents: 'none' });
      if (desktopNav) gsap.set(desktopNav, { opacity: 0, visibility: 'hidden', pointerEvents: 'none' });
      if (navItems.length) gsap.set(navItems, { opacity: 0, y: -8 });
      if (desktopCtaBtn) gsap.set(desktopCtaBtn, { opacity: 0, x: 14, scale: 0.94, visibility: 'hidden', pointerEvents: 'none' });
      if (mobileBurgerBtn) gsap.set(mobileBurgerBtn, { opacity: 0, scale: 0.85, visibility: 'hidden', pointerEvents: 'none' });

      // Measure target natural responsive width, height, and padding BEFORE adding .nav-intro-animating
      const targetRect = pillHeader.getBoundingClientRect();
      const isSmall = window.innerWidth <= 1024;
      const targetWidth = (targetRect && targetRect.width > 100)
        ? targetRect.width
        : (isSmall ? Math.min(window.innerWidth * 0.92, 800) : Math.min(1400, window.innerWidth - 48));
      const targetHeight = (targetRect && targetRect.height > 40)
        ? targetRect.height
        : (isSmall ? 58 : 66);
      const targetPadY = isSmall ? 8 : 10;
      const targetPadX = isSmall ? (window.innerWidth <= 767 ? 16 : 18) : 24;

      const startDotSize = isSmall ? 52 : 56;
      const tabletWidth = isSmall ? 84 : 108;

      pillHeader.classList.add('nav-intro-animating');
      pillHeader.style.setProperty('--nav-intro-width', startDotSize + 'px');
      pillHeader.style.setProperty('--nav-intro-height', startDotSize + 'px');
      pillHeader.style.setProperty('--nav-intro-pad-y', '0px');
      pillHeader.style.setProperty('--nav-intro-pad-x', '0px');
      pillHeader.style.setProperty('--nav-glow-alpha', '0.62');
      pillHeader.style.setProperty('--nav-glow-blur', '38px');
      pillHeader.style.setProperty('--nav-border-alpha', '0.42');

      gsap.set(pillHeader, {
        y: -90,
        opacity: 0
      });

      // 1) The glowing dot capsule drops cleanly from above the screen
      masterTl.to(
        pillHeader,
        {
          y: 0,
          opacity: 1,
          duration: 0.44,
          ease: 'power3.out'
        },
        0.00
      );

      // 2) On landing, stretch from compact circular dot into a sleek tablet capsule shape
      const morphState = {
        width: startDotSize,
        height: startDotSize,
        padY: 0,
        padX: 0,
        glowAlpha: 0.62,
        glowBlur: 38,
        borderAlpha: 0.42
      };

      masterTl.to(
        morphState,
        {
          width: tabletWidth,
          height: targetHeight,
          duration: 0.24,
          ease: 'power2.inOut',
          onUpdate: () => {
            pillHeader.style.setProperty('--nav-intro-width', morphState.width.toFixed(2) + 'px');
            pillHeader.style.setProperty('--nav-intro-height', morphState.height.toFixed(2) + 'px');
          }
        },
        0.38
      );

      // 3) Smooth, organic horizontal expansion from tablet into full navbar width using true expo.out deceleration
      masterTl.to(
        morphState,
        {
          width: targetWidth,
          padY: targetPadY,
          padX: targetPadX,
          duration: 0.84,
          ease: 'expo.out',
          onUpdate: () => {
            pillHeader.style.setProperty('--nav-intro-width', morphState.width.toFixed(2) + 'px');
            pillHeader.style.setProperty('--nav-intro-pad-y', morphState.padY.toFixed(2) + 'px');
            pillHeader.style.setProperty('--nav-intro-pad-x', morphState.padX.toFixed(2) + 'px');
          },
          onStart: () => {
            if (introDot) {
              gsap.to(introDot, { opacity: 0, scale: 0.2, duration: 0.24, ease: 'power2.out' });
            }
          },
          onComplete: () => {
            // Dimensions & padding already match settled state 100%, so removing class causes ZERO jump
            pillHeader.classList.remove('nav-intro-animating');
            pillHeader.style.removeProperty('--nav-intro-width');
            pillHeader.style.removeProperty('--nav-intro-height');
            pillHeader.style.removeProperty('--nav-intro-pad-y');
            pillHeader.style.removeProperty('--nav-intro-pad-x');
            pillHeader.style.overflow = 'visible';
            pillHeader.style.willChange = 'auto';
            if (introDot && introDot.parentNode) introDot.remove();
            document.documentElement.classList.add('nav-expanded');
          }
        },
        0.62
      );

      // 4) Smooth, lingering neon shadow decay: instead of snapping off, the warm orange neon aura
      //    gently breathes down over 1.85s into a rich, permanent luxury ambient halo (0.24)
      masterTl.to(
        morphState,
        {
          glowAlpha: 0.24,
          glowBlur: 28,
          borderAlpha: 0.22,
          duration: 1.85,
          ease: 'sine.inOut',
          onUpdate: () => {
            pillHeader.style.setProperty('--nav-glow-alpha', morphState.glowAlpha.toFixed(3));
            pillHeader.style.setProperty('--nav-glow-blur', morphState.glowBlur.toFixed(1) + 'px');
            pillHeader.style.setProperty('--nav-border-alpha', morphState.borderAlpha.toFixed(3));
          }
        },
        1.15
      );

      // 5) Elegant staggered reveal of Logo, Navigation links, and CTA inside the Menu
      if (brandLogo) {
        masterTl.to(
          brandLogo,
          {
            opacity: 1,
            x: 0,
            visibility: 'visible',
            pointerEvents: 'auto',
            duration: 0.50,
            ease: 'power3.out'
          },
          0.90
        );
      }

      if (desktopNav) {
        masterTl.set(desktopNav, { visibility: 'visible', pointerEvents: 'auto' }, 0.90);
        masterTl.to(desktopNav, { opacity: 1, duration: 0.40, ease: 'power2.out' }, 0.90);
      }

      if (navItems.length) {
        masterTl.to(
          navItems,
          {
            opacity: 1,
            y: 0,
            pointerEvents: 'auto',
            duration: 0.44,
            stagger: 0.05,
            ease: 'power3.out'
          },
          0.94
        );
      }

      if (desktopCtaBtn) {
        masterTl.to(
          desktopCtaBtn,
          {
            opacity: 1,
            x: 0,
            scale: 1,
            visibility: 'visible',
            pointerEvents: 'auto',
            duration: 0.50,
            ease: 'power3.out'
          },
          1.04
        );
      }

      if (mobileBurgerBtn) {
        masterTl.to(
          mobileBurgerBtn,
          {
            opacity: 1,
            scale: 1,
            visibility: 'visible',
            pointerEvents: 'auto',
            duration: 0.46,
            ease: 'back.out(1.4)'
          },
          1.04
        );
      }
    }

    // =========================================================================
    // SEAMLESS TOP-TO-DOWN CHOREOGRAPHY (ONE-BY-ONE AFTER MENU OPENS)
    // =========================================================================

    // 1) Level 1 (Directly below Menu): Headline reveals word by word
    if (heroHeadline) {
      if (headlineWords && headlineWords.length) {
        masterTl.to(
          headlineWords,
          {
            yPercent: 0,
            opacity: 1,
            rotateZ: 0,
            duration: 0.50,
            stagger: 0.05,
            ease: 'power3.out',
            clearProps: isNarrow ? 'transform,opacity,visibility,filter' : ''
          },
          0.45
        );
      } else {
        masterTl.to(
          headlineContainer,
          { y: 0, opacity: 1, duration: 0.48, ease: 'power3.out', clearProps: isNarrow ? 'transform,opacity,visibility,filter' : '' },
          0.45
        );
      }
    }

    // 2) Level 2 (Directly below Headline): Paragraph glides up smoothly
    if (heroSubhead) {
      masterTl.to(
        heroSubhead,
        { y: 0, opacity: 1, duration: 0.48, ease: 'power3.out', clearProps: isNarrow ? 'transform,opacity,visibility,filter' : '' },
        0.58
      );
    }

    // 3) Level 3 (Directly below Paragraph): CTA Buttons cascade in one by one
    const btnContainer = document.querySelector('.elementor-element-3e6d869');
    if (btnContainer) {
      masterTl.set(btnContainer, { opacity: 1, visibility: 'visible' }, 0.65);
    }
    if (heroBtns && heroBtns.length >= 2) {
      masterTl.fromTo(
        heroBtns[0],
        { x: isNarrow ? 0 : -14, y: 14, opacity: 0 },
        { x: 0, y: 0, opacity: 1, duration: 0.45, ease: 'power3.out', clearProps: isNarrow ? 'transform,opacity,visibility,filter' : '' },
        0.68
      );
      masterTl.fromTo(
        heroBtns[1],
        { x: isNarrow ? 0 : 14, y: 14, opacity: 0 },
        { x: 0, y: 0, opacity: 1, duration: 0.45, ease: 'power3.out', clearProps: isNarrow ? 'transform,opacity,visibility,filter' : '' },
        0.74
      );
    } else if (heroBtns && heroBtns.length === 1) {
      masterTl.fromTo(
        heroBtns[0],
        { scale: 0.92, y: 14, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.45, ease: CONFIG.eases.bounce, clearProps: isNarrow ? 'transform,opacity,visibility,filter' : '' },
        0.68
      );
    }

    // 4) Level 4: Hero Right-Side Showcase glides in right alongside the text
    if (heroShowcase) {
      masterTl.to(
        heroShowcase,
        { scale: 1, opacity: 1, y: 0, duration: 0.55, ease: 'power3.out', clearProps: isNarrow ? 'transform,opacity,visibility,filter' : '' },
        0.50
      );
      if (showcaseSubItems.length) {
        masterTl.to(
          showcaseSubItems,
          {
            opacity: 1,
            y: 0,
            duration: 0.50,
            stagger: 0.08,
            ease: 'power3.out',
            clearProps: 'transform,opacity'
          },
          0.55
        );
      }

      if (!isNarrow) {
        gsap.to(heroShowcase, {
          y: 24,
          ease: 'none',
          scrollTrigger: {
            trigger: heroSection || document.body,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.3
          }
        });
      }
    }

    // 5) Initialize all sections immediately so scrolling down never hits hidden sections
    document.documentElement.classList.add('site-ready');
    initAllRemainingSections();
    initFailSafeVisibility();

    // 6) Optional Badges & Trust Elements
    const heroArrowSvg = document.getElementById('kalakaari-hero-arrow-svg');
    if (heroArrowSvg) {
      const clipRect = document.getElementById('hero-arrow-clip-rect');
      const textChars = heroArrowSvg.querySelectorAll('.hiw-char');

      gsap.set(heroArrowSvg, { opacity: 1, visibility: 'visible' });
      if (clipRect) gsap.set(clipRect, { attr: { width: 0 } });
      if (textChars.length) gsap.set(textChars, { opacity: 0 });

      if (clipRect) {
        masterTl.to(clipRect, {
          attr: { width: 32 },
          duration: 0.5,
          ease: 'power2.out'
        }, 1.35);
      }

      if (textChars.length) {
        masterTl.fromTo(textChars,
          { opacity: 0, y: -2 },
          { opacity: 1, y: 0, duration: 0.3, stagger: 0.03, ease: 'power1.out' },
          1.40
        );
      }

      const heroArrowIdle = gsap.to(heroArrowSvg, {
        x: 5,
        y: 4,
        duration: 1.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      registerIdleAnimation(heroArrowSvg, {
        onPause: () => heroArrowIdle.pause(),
        onResume: () => heroArrowIdle.play()
      });
    }

    if (heroReviewBadge) {
      masterTl.fromTo(
        heroReviewBadge,
        { y: -20, opacity: 0, scale: 0.92 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: CONFIG.eases.bounce, clearProps: isNarrow ? 'transform,opacity,visibility,filter' : '' },
        1.40
      );
    }

    const trustedStrip = document.querySelector('.elementor-element-850f210') || document.querySelector('.trusted-by-carousel-dark');
    if (trustedStrip) {
      masterTl.fromTo(
        trustedStrip,
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: CONFIG.eases.smooth, clearProps: isNarrow ? 'transform,opacity,visibility,filter' : '' },
        1.45
      );
      registerIdleAnimation(trustedStrip, {
        onPause: () => trustedStrip.classList.add('is-offscreen'),
        onResume: () => trustedStrip.classList.remove('is-offscreen')
      });
    }

    const loader = document.getElementById('kalakaari-theme-curtain');
    if (loader && !prefersReduced) {
      setTimeout(() => {
        document.documentElement.classList.remove('intro-pending');
        gsap.to(loader, {
          opacity: 0,
          duration: 0.25,
          ease: 'power2.inOut',
          onComplete: () => {
            loader.remove();
          }
        });
        masterTl.play(0);
      }, 120);
    } else {
      document.documentElement.classList.remove('intro-pending');
      if (loader) loader.remove();
      masterTl.play(0);
    }
  }

  // --------------------------------------------------------------------------
  // 6. NAVBAR SCROLL INTERACTION (SHRINK ON SCROLL DOWN, EXPAND ON SCROLL UP)
  // --------------------------------------------------------------------------
  function initNavbarScrollReaction(pillHeader) {
    if (!pillHeader || prefersReduced) return;

    const desktopCta = document.querySelector('.studio-header-cta, .kalakaari-desktop-cta-btn');

    ScrollTrigger.create({
      start: 'top -120',
      onUpdate: (self) => {
        const currentScroll = self.scroll();
        if (currentScroll > 180 && self.direction === 1) {
          gsap.to(pillHeader, {
            scale: 0.98,
            duration: 0.35,
            ease: 'power2.out',
            overwrite: 'auto'
          });
          if (desktopCta) {
            gsap.to(desktopCta, {
              scale: 0.96,
              autoAlpha: 1,
              pointerEvents: 'auto',
              duration: 0.25,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          }
        } else if (self.direction === -1 || currentScroll <= 180) {
          gsap.to(pillHeader, {
            scale: 1,
            duration: 0.35,
            ease: 'power2.out',
            overwrite: 'auto'
          });
          if (desktopCta) {
            gsap.to(desktopCta, {
              autoAlpha: 1,
              scale: 1,
              pointerEvents: 'auto',
              duration: 0.35,
              ease: 'back.out(1.5)',
              overwrite: 'auto'
            });
          }
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // 7. ABOUT US + STATS (50+, 30,000+, 1,000s) - RESPONSIVE MATCHMEDIA
  // --------------------------------------------------------------------------
  function initAboutSection() {
    const aboutSection = document.querySelector('.elementor-element-8b2934c');
    if (!aboutSection || prefersReduced) return;

    const heading = aboutSection.querySelector('h2, .elementor-heading-title');
    const statCards = aboutSection.querySelectorAll('.elementor-element-6a910a1, .elementor-element-4b1d08b, .elementor-element-4f6a9cb');

    const mm = gsap.matchMedia();

    // Helper for counter up stats
    function setupCounters(tl) {
      if (!statCards.length) return;
      statCards.forEach((card) => {
        const numElem = Array.from(card.querySelectorAll('*')).find(el => {
          const t = el.textContent.trim();
          return t === '50+' || t === '30,000+' || t === '1,000s';
        });

        if (numElem) {
          const raw = numElem.textContent.trim();
          let target = 0;
          let suffix = '+';

          if (raw.includes('30,000')) target = 30000;
          else if (raw.includes('50')) target = 50;
          else if (raw.includes('1,000')) { target = 1000; suffix = 's'; }

          if (target > 0) {
            const counter = { val: 0 };
            tl.to(
              counter,
              {
                val: target,
                duration: CONFIG.durations.countUp,
                ease: 'power2.out',
                onUpdate: () => {
                  numElem.textContent = Math.floor(counter.val).toLocaleString('en-US') + suffix;
                }
              },
              '-=0.55'
            );
          }
        }
      });
    }

    // DESKTOP: Keep exact current animation and staggers
    mm.add('(min-width: 768px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: aboutSection,
          start: 'top 75%',
          once: true,
        }
      });

      // Keep aboutSection container visible

      if (heading) {
        const words = splitTextIntoWords(heading);
        if (words && words.length) {
          tl.fromTo(words, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.04, ease: CONFIG.eases.splitReveal }, '-=0.4');
        } else {
          tl.fromTo(heading, { y: CONFIG.distance.medium, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.4');
        }
      }

      if (statCards.length) {
        statCards.forEach((card, idx) => {
          const fromX = idx % 2 === 0 ? -CONFIG.distance.large : CONFIG.distance.large;
          tl.fromTo(
            card,
            { x: fromX, opacity: 0, scale: 0.95 },
            { x: 0, opacity: 1, scale: 1, duration: 0.65, ease: CONFIG.eases.smooth },
            `-=${idx === 0 ? 0.3 : 0.45}`
          );
        });
        setupCounters(tl);
      }
    });

    // MOBILE: Compact vertical transforms only, start: 'top 85%', clearProps on complete
    mm.add('(max-width: 767px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: aboutSection,
          start: 'top 85%',
          once: true,
        }
      });

      // Keep aboutSection container visible

      if (heading) {
        tl.fromTo(heading, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, clearProps: 'transform,opacity,visibility,filter' }, '-=0.3');
      }

      if (statCards.length) {
        statCards.forEach((card, idx) => {
          tl.fromTo(
            card,
            { y: 25, opacity: 0, scale: 0.96 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.55,
              ease: CONFIG.eases.smooth,
              clearProps: 'transform,opacity,visibility,filter'
            },
            `-=${idx === 0 ? 0.2 : 0.35}`
          );
        });
        setupCounters(tl);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 8. TESTIMONIALS CAROUSEL - RESPONSIVE MATCHMEDIA
  // --------------------------------------------------------------------------
  function initTestimonialsSection() {
    const testimSection = document.querySelector('.elementor-element-7bcf7d0');
    if (!testimSection || prefersReduced) return;

    const titleBadge = testimSection.querySelector('h2, .elementor-heading-title');
    const slides = testimSection.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate)');

    const mm = gsap.matchMedia();

    // DESKTOP: Full animation
    mm.add('(min-width: 768px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: testimSection,
          start: 'top 75%',
          once: true,
        }
      });

      // Keep testimSection container visible

      if (titleBadge) {
        tl.fromTo(
          titleBadge,
          { y: -CONFIG.distance.medium, scale: 0.9, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, duration: 0.65, ease: CONFIG.eases.bounce },
          '-=0.4'
        );
      }

      if (slides.length) {
        tl.fromTo(
          slides,
          { x: CONFIG.distance.large, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.65,
            stagger: CONFIG.staggers.normal,
            ease: CONFIG.eases.smooth
          },
          '-=0.3'
        );
      }
    });

    // MOBILE: Vertical transforms only, start: 'top 85%'
    mm.add('(max-width: 767px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: testimSection,
          start: 'top 85%',
          once: true,
        }
      });

      // Keep testimSection container visible

      if (titleBadge) {
        tl.fromTo(
          titleBadge,
          { y: -15, scale: 0.95, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, duration: 0.5, ease: CONFIG.eases.bounce, clearProps: 'transform,opacity,visibility,filter' },
          '-=0.3'
        );
      }

      if (slides.length) {
        tl.fromTo(
          slides,
          { y: 20, opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.05,
            ease: CONFIG.eases.smooth,
            clearProps: 'transform,opacity,visibility,filter'
          },
          '-=0.2'
        );
      }
    });
  }

  // --------------------------------------------------------------------------
  // 9. WHAT WE DO (6 FEATURE CARDS + MAGNETIC TILT)
  // --------------------------------------------------------------------------
  function initWhatWeDoSection() {
    const wwdSection = document.querySelector('.elementor-element-82e95b1');
    if (!wwdSection || prefersReduced) return;

    const title = wwdSection.querySelector('h2, .elementor-heading-title');
    const cards = wwdSection.querySelectorAll('.studio-service');

    const mm = gsap.matchMedia();

    // DESKTOP
    mm.add('(min-width: 768px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wwdSection,
          start: 'top 75%',
          once: true,
        }
      });

      // Container stays visible with signature background; animate content

      if (title) {
        tl.fromTo(title, { y: -CONFIG.distance.small, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: CONFIG.eases.bounce }, '-=0.4');
      }

      if (cards.length) {
        tl.fromTo(
          cards,
          { y: CONFIG.distance.large, opacity: 0, scale: 0.94 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            stagger: { amount: 0.45, from: 'start' },
            ease: CONFIG.eases.smooth
          },
          '-=0.25'
        );

        const cardImages = wwdSection.querySelectorAll('img');
        if (cardImages.length) {
          tl.fromTo(
            cardImages,
            { scale: 1.15 },
            { scale: 1, duration: 0.9, stagger: 0.05, ease: 'power2.out' },
            '-=0.6'
          );
        }

        setupCardTilt(cards);
      }
    });

    // MOBILE
    mm.add('(max-width: 767px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wwdSection,
          start: 'top 85%',
          once: true,
        }
      });

      // Container stays visible on mobile

      if (title) {
        tl.fromTo(title, { y: -15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: CONFIG.eases.bounce, clearProps: 'transform,opacity,visibility,filter' }, '-=0.3');
      }

      if (cards.length) {
        tl.fromTo(
          cards,
          { y: 25, opacity: 0, scale: 0.97 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.55,
            stagger: 0.08,
            ease: CONFIG.eases.smooth,
            clearProps: 'transform,opacity,visibility,filter'
          },
          '-=0.2'
        );
      }
    });
  }

  // --------------------------------------------------------------------------
  // 10. LONG-FORM VIDEO (FAN STAGGER + PLAY BUTTON PULSE)
  // --------------------------------------------------------------------------
  function initLongFormSection() {
    const section = document.getElementById('long-form-video-section');
    if (!section || prefersReduced) return;

    const heading = section.querySelector('h2');
    const grid = section.querySelector('.kalakaari-video-grid');
    const cards = grid ? grid.children : [];

    const mm = gsap.matchMedia();

    // DESKTOP
    mm.add('(min-width: 768px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          once: true,
        }
      });

      // Video section container remains visible

      if (heading) {
        tl.fromTo(
          heading,
          { x: -CONFIG.distance.large, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.65, ease: CONFIG.eases.smooth },
          '-=0.4'
        );
      }

      if (cards.length) {
        tl.fromTo(
          cards,
          {
            x: CONFIG.distance.large,
            rotation: (idx) => (idx % 2 === 0 ? 3 : -3),
            opacity: 0,
            scale: 0.92
          },
          {
            x: 0,
            rotation: 0,
            opacity: 1,
            scale: 1,
            duration: 0.75,
            stagger: CONFIG.staggers.normal,
            ease: CONFIG.eases.smooth
          },
          '-=0.3'
        );

        const playIcons = section.querySelectorAll('svg, .play-btn, [class*="play"]');
        if (playIcons.length) {
          tl.fromTo(
            playIcons,
            { scale: 0.8 },
            { scale: 1.25, duration: 0.35, yoyo: true, repeat: 1, stagger: 0.08, ease: 'power2.out' },
            '-=0.2'
          );
        }
      }
    });

    // MOBILE: Vertical transforms only, start: 'top 85%'
    mm.add('(max-width: 767px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          once: true,
        }
      });

      // Video section container remains visible

      if (heading) {
        tl.fromTo(
          heading,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: CONFIG.eases.smooth, clearProps: 'transform,opacity,visibility,filter' },
          '-=0.3'
        );
      }

      if (cards.length) {
        tl.fromTo(
          cards,
          { y: 25, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.55,
            stagger: 0.08,
            ease: CONFIG.eases.smooth,
            clearProps: 'transform,opacity,visibility,filter'
          },
          '-=0.2'
        );
      }
    });
  }

  // --------------------------------------------------------------------------
  // 11. PHOTOS & ALBUM SPREADS (ROTATE-Y 3D FLIP + BADGE POP)
  // --------------------------------------------------------------------------
  function initAlbumSection() {
    const section = document.getElementById('photos-albums-portrait-section');
    if (!section || prefersReduced) return;

    const heading = section.querySelector('h2');
    const grid = section.querySelector('.kalakaari-portrait-grid');
    const cards = grid ? grid.children : [];

    const mm = gsap.matchMedia();

    // DESKTOP
    mm.add('(min-width: 768px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          once: true,
        }
      });

      // Album section container remains visible

      if (heading) {
        tl.fromTo(
          heading,
          { y: -CONFIG.distance.medium, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65, ease: CONFIG.eases.bounce },
          '-=0.4'
        );
      }

      if (cards.length) {
        tl.fromTo(
          cards,
          {
            y: 30,
            opacity: 0,
            scale: 0.95
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.65,
            stagger: 0.08,
            ease: CONFIG.eases.smooth,
            clearProps: 'transform,opacity,visibility,filter'
          },
          '-=0.25'
        );
      }
    });

    // MOBILE: Vertical transforms only, start: 'top 85%'
    mm.add('(max-width: 767px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          once: true,
        }
      });

      // Album section container remains visible

      if (heading) {
        tl.fromTo(
          heading,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: CONFIG.eases.bounce, clearProps: 'transform,opacity,visibility,filter' },
          '-=0.3'
        );
      }

      if (cards.length) {
        tl.fromTo(
          cards,
          { y: 25, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.55,
            stagger: 0.08,
            ease: CONFIG.eases.smooth,
            clearProps: 'transform,opacity,visibility,filter'
          },
          '-=0.2'
        );
      }
    });
  }

  // --------------------------------------------------------------------------
  // 12. HOW IT WORKS (3 STEPS SEQUENCE)
  // --------------------------------------------------------------------------
  function initHowItWorksSection() {
    const hiwSection = document.querySelector('[data-id="d300f2e"]') || document.querySelector('#hide-trigger');
    if (!hiwSection || prefersReduced) return;

    const title = hiwSection.querySelector('h2, .elementor-heading-title');
    const step1 = hiwSection.querySelector('[data-id="677bb2b5"]') || hiwSection.querySelector('[data-id="aafd0c0"]');
    const step2 = hiwSection.querySelector('[data-id="ad19626"]') || hiwSection.querySelector('[data-id="10c766da"]');
    const step3 = hiwSection.querySelector('[data-id="2a1a1ffb"]') || hiwSection.querySelector('[data-id="7eb754d8"]');
    const steps = [step1, step2, step3].filter(Boolean);

    const mm = gsap.matchMedia();

    // DESKTOP
    mm.add('(min-width: 768px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: hiwSection,
          start: 'top 75%',
          once: true,
        }
      });

      // Keep hiwSection container visible

      if (title) {
        tl.fromTo(title, { y: -CONFIG.distance.medium, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: CONFIG.eases.bounce }, '-=0.4');
      }

      if (steps.length) {
        steps.forEach((step, i) => {
          const fromX = i % 2 === 0 ? -CONFIG.distance.medium : CONFIG.distance.medium;

          tl.fromTo(
            step,
            { x: fromX, opacity: 0, scale: 0.95 },
            { x: 0, opacity: 1, scale: 1, duration: 0.65, ease: CONFIG.eases.smooth },
            `-=${i === 0 ? 0.2 : 0.4}`
          );

          const stepNum = step.querySelector('[class*="number"], [class*="step"], h3, h4');
          if (stepNum) {
            tl.fromTo(
              stepNum,
              { scale: 0, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.45, ease: CONFIG.eases.pop },
              '-=0.45'
            );
          }
        });
      }
    });

    // MOBILE: Vertical transforms only, start: 'top 85%'
    mm.add('(max-width: 767px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: hiwSection,
          start: 'top 85%',
          once: true,
        }
      });

      // Keep hiwSection container visible

      if (title) {
        tl.fromTo(title, { y: -15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: CONFIG.eases.bounce, clearProps: 'transform,opacity,visibility,filter' }, '-=0.3');
      }

      if (steps.length) {
        steps.forEach((step, i) => {
          tl.fromTo(
            step,
            { y: 25, opacity: 0, scale: 0.96 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.55,
              ease: CONFIG.eases.smooth,
              clearProps: 'transform,opacity,visibility,filter'
            },
            `-=${i === 0 ? 0.2 : 0.35}`
          );
        });
      }
    });
  }

  // --------------------------------------------------------------------------
  // 13. PRICING SECTION (CARD RISE + GLOW PULSE + PRICE COUNT-UP + GRID WAVE)
  // --------------------------------------------------------------------------
  function initPricingSection() {
    const pricingSection = document.getElementById('pricing') || document.querySelector('[data-id="e46edad"]');
    if (!pricingSection || prefersReduced) return;

    const title = pricingSection.querySelector('h2, .elementor-heading-title');
    const planCards = pricingSection.querySelectorAll('[data-id="47fea16e"], [data-id="40e30937"], [data-id="2138c18f"], [data-id="65aa0354"]');
    const mostPopular = pricingSection.querySelector('[data-id="2138c18f"]') || (planCards.length >= 2 ? planCards[1] : null);
    const featureItems = pricingSection.querySelectorAll('[data-id="5dd26c22"] [data-id], .ytcm-pricing-individual-wrapper');

    const mm = gsap.matchMedia();

    function setupPriceCountUp(tl) {
      const priceElems = pricingSection.querySelectorAll('h2, h3, .elementor-heading-title');
      priceElems.forEach(el => {
        const text = el.textContent.trim();
        const match = text.match(/\$(\d+)/);
        if (match) {
          const target = parseInt(match[1]);
          const counter = { val: 0 };
          tl.to(
            counter,
            {
              val: target,
              duration: 1.2,
              ease: 'power2.out',
              onUpdate: () => {
                el.textContent = '$' + Math.floor(counter.val);
              }
            },
            '-=0.7'
          );
        }
      });
    }

    function setupPricingArrow(tl) {
      const pricingArrowSvg = document.getElementById('kalakaari-pricing-arrow-svg');
      if (pricingArrowSvg) {
        const clipRect = document.getElementById('pricing-arrow-clip-rect');
        const textChars = pricingArrowSvg.querySelectorAll('.hiw-char');

        gsap.set(pricingArrowSvg, { opacity: 1, visibility: 'visible' });
        if (clipRect) gsap.set(clipRect, { attr: { width: 0 } });
        if (textChars.length) gsap.set(textChars, { opacity: 0 });

        if (clipRect) {
          tl.to(clipRect, {
            attr: { width: 32 },
            duration: 0.7,
            ease: 'power2.out'
          }, '-=0.2');
        }

        if (textChars.length) {
          tl.fromTo(textChars,
            { opacity: 0, y: -2 },
            { opacity: 1, y: 0, duration: 0.35, stagger: 0.03, ease: 'power1.out' },
            '-=0.4'
          );
        }

        const pricingArrowIdle = gsap.to(pricingArrowSvg, {
          x: 5,
          y: 4,
          duration: 1.6,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });

        registerIdleAnimation(pricingArrowSvg, {
          onPause: () => pricingArrowIdle.pause(),
          onResume: () => pricingArrowIdle.play()
        });
      }
    }

    // DESKTOP
    mm.add('(min-width: 768px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pricingSection,
          start: 'top 75%',
          once: true,
        }
      });

      // Pricing section container remains visible

      if (title) {
        tl.fromTo(title, { y: -CONFIG.distance.medium, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, ease: CONFIG.eases.bounce }, '-=0.4');
      }

      if (planCards.length) {
        tl.fromTo(
          planCards,
          { y: CONFIG.distance.large, opacity: 0, scale: 0.94 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.75,
            stagger: CONFIG.staggers.normal,
            ease: CONFIG.eases.smooth
          },
          '-=0.3'
        );

        if (mostPopular) {
          tl.to(
            mostPopular,
            {
              scale: 1.04,
              duration: 0.45,
              ease: CONFIG.eases.pop,
              onComplete: () => mostPopular.classList.add('kalakaari-glow-pulse')
            },
            '-=0.2'
          );
        }

        setupPriceCountUp(tl);
      }

      if (featureItems.length) {
        tl.fromTo(
          featureItems,
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            stagger: { from: 'start', amount: 0.4 },
            ease: CONFIG.eases.smooth
          },
          '-=0.3'
        );
      }

      setupPricingArrow(tl);
    });

    // MOBILE
    mm.add('(max-width: 767px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pricingSection,
          start: 'top 85%',
          once: true,
        }
      });

      // Pricing section container remains visible

      if (title) {
        tl.fromTo(title, { y: -15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: CONFIG.eases.bounce, clearProps: 'transform,opacity,visibility,filter' }, '-=0.3');
      }

      if (planCards.length) {
        tl.fromTo(
          planCards,
          { y: 25, opacity: 0, scale: 0.97 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.55,
            stagger: 0.08,
            ease: CONFIG.eases.smooth,
            clearProps: 'transform,opacity,visibility,filter'
          },
          '-=0.2'
        );

        if (mostPopular) {
          tl.to(
            mostPopular,
            {
              scale: 1.02,
              duration: 0.4,
              ease: CONFIG.eases.pop,
              onComplete: () => mostPopular.classList.add('kalakaari-glow-pulse')
            },
            '-=0.15'
          );
        }

        setupPriceCountUp(tl);
      }

      if (featureItems.length) {
        tl.fromTo(
          featureItems,
          { y: 15, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.45,
            stagger: 0.04,
            ease: CONFIG.eases.smooth,
            clearProps: 'transform,opacity,visibility,filter'
          },
          '-=0.2'
        );
      }

      setupPricingArrow(tl);
    });
  }

  // --------------------------------------------------------------------------
  // 14. FEATURE COMPARISON TABLE (ROWS SLIDE IN ONE BY ONE)
  // --------------------------------------------------------------------------
  function initComparisonSection() {
    const featSection = document.getElementById('features') || document.querySelector('[data-id="3f055ba7"]');
    if (!featSection || prefersReduced) return;

    const rows = featSection.querySelectorAll('.e-con-inner > .e-con, [class*="row"], .e-con-child');
    if (!rows.length) return;

    const isNarrow = window.innerWidth < 768;

    gsap.fromTo(
      rows,
      { x: isNarrow ? 0 : -35, y: isNarrow ? 15 : 0, opacity: 0 },
      {
        x: 0,
        y: 0,
        opacity: 1,
        duration: 0.55,
        stagger: 0.04,
        ease: CONFIG.eases.smooth,
        clearProps: isNarrow ? 'transform,opacity,visibility,filter' : '',
        scrollTrigger: {
          trigger: featSection,
          start: isNarrow ? 'top 85%' : 'top 75%',
          once: true,
        }
      }
    );
  }

  // --------------------------------------------------------------------------
  // 15. FAQ ACCORDION (ITEMS FROM LEFT + SMOOTH ROTATING CHEVRON)
  // --------------------------------------------------------------------------
  function initFaqSection() {
    const faqHeading = Array.from(document.querySelectorAll('h2, .elementor-heading-title')).find(el => el.textContent.includes('FAQ'));
    if (!faqHeading || prefersReduced) return;

    const faqParent = faqHeading.closest('.e-con-boxed') || faqHeading.closest('.e-parent');
    if (!faqParent) return;

    const accordions = faqParent.querySelectorAll('.e-n-accordion-item, .elementor-accordion-item, details');
    if (!accordions.length) return;

    const isNarrow = window.innerWidth < 768;

    gsap.fromTo(
      accordions,
      { x: isNarrow ? 0 : -CONFIG.distance.medium, y: isNarrow ? 15 : 0, opacity: 0 },
      {
        x: 0,
        y: 0,
        opacity: 1,
        duration: 0.55,
        stagger: CONFIG.staggers.tight,
        ease: CONFIG.eases.smooth,
        clearProps: isNarrow ? 'transform,opacity,visibility,filter' : '',
        scrollTrigger: {
          trigger: faqParent,
          start: isNarrow ? 'top 85%' : 'top 75%',
          once: true,
        }
      }
    );
  }

  // --------------------------------------------------------------------------
  // 16. FINAL CTA "JOIN THOUSANDS OF TOP CREATORS!"
  // --------------------------------------------------------------------------
  function initFinalCtaSection() {
    const ctaHeading = Array.from(document.querySelectorAll('h2, .elementor-heading-title, p')).find(el => el.textContent.includes('Join thousands'));
    if (!ctaHeading || prefersReduced) return;

    const ctaContainer = ctaHeading.closest('.e-con') || ctaHeading.closest('.e-parent');
    if (!ctaContainer) return;

    const ctaBtns = ctaContainer.querySelectorAll('a, button');
    const isNarrow = window.innerWidth < 768;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ctaContainer,
        start: isNarrow ? 'top 85%' : 'top 80%',
        once: true,
      }
    });

    tl.fromTo(
      ctaHeading,
      { scale: 0.88, opacity: 0, y: 25 },
      { scale: 1, opacity: 1, y: 0, duration: 0.75, ease: CONFIG.eases.pop, clearProps: isNarrow ? 'transform,opacity,visibility,filter' : '' }
    );

    if (ctaBtns.length) {
      tl.fromTo(
        ctaBtns,
        { scale: 0.75, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.55,
          stagger: 0.12,
          ease: CONFIG.eases.bounce,
          clearProps: isNarrow ? 'transform,opacity,visibility,filter' : ''
        },
        '-=0.4'
      );

      setupMagneticButtons(ctaBtns);
    }
  }

  // --------------------------------------------------------------------------
  // 17. FOOTER SECTION
  // --------------------------------------------------------------------------
  function initFooterSection() {
    const footer = document.querySelector('.elementor-element-c0eccf5') || document.querySelector('footer');
    if (!footer || prefersReduced) return;

    const cols = footer.querySelectorAll('.e-con-inner > .e-con, .e-con-child');
    if (cols.length) {
      const isNarrow = window.innerWidth < 768;
      gsap.fromTo(
        cols,
        { y: isNarrow ? 20 : CONFIG.distance.medium, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: CONFIG.staggers.normal,
          ease: CONFIG.eases.smooth,
          clearProps: isNarrow ? 'transform,opacity,visibility,filter' : '',
          scrollTrigger: {
            trigger: footer,
            start: isNarrow ? 'top 90%' : 'top 85%',
            once: true,
          }
        }
      );
    }
  }

  // --------------------------------------------------------------------------
  // 18. DATA-ATTRIBUTES MOTION ENGINE (FOR EASY USER TUNING)
  // --------------------------------------------------------------------------
  function initDataAnimEngine() {
    const elements = document.querySelectorAll('[data-anim]');
    if (!elements.length) return;

    const isNarrow = window.innerWidth < 768;

    elements.forEach(el => {
      const type = el.getAttribute('data-anim') || 'fade';
      const delay = parseFloat(el.getAttribute('data-delay')) || 0;
      const stagger = parseFloat(el.getAttribute('data-stagger')) || 0;

      let fromProps = { opacity: 0 };
      const toProps = {
        opacity: 1,
        duration: CONFIG.durations.normal,
        delay: delay,
        ease: CONFIG.eases.smooth,
        onComplete: () => {
          el.classList.add('anim-done');
          if (isNarrow) {
            el.style.transform = 'none';
          }
        }
      };

      if (stagger) toProps.stagger = stagger;

      switch (type) {
        case 'fly-left':
          fromProps.x = isNarrow ? 0 : -CONFIG.distance.medium;
          fromProps.y = isNarrow ? 20 : 0;
          toProps.x = 0;
          toProps.y = 0;
          break;
        case 'fly-right':
          fromProps.x = isNarrow ? 0 : CONFIG.distance.medium;
          fromProps.y = isNarrow ? 20 : 0;
          toProps.x = 0;
          toProps.y = 0;
          break;
        case 'fly-up':
          fromProps.y = isNarrow ? 20 : CONFIG.distance.medium;
          toProps.y = 0;
          break;
        case 'fly-down':
          fromProps.y = isNarrow ? -20 : -CONFIG.distance.medium;
          toProps.y = 0;
          break;
        case 'scale':
          fromProps.scale = 0.9;
          toProps.scale = 1;
          toProps.ease = CONFIG.eases.bounce;
          break;
        case 'split':
          const words = splitTextIntoWords(el);
          if (words && words.length) {
            gsap.fromTo(words, { yPercent: 100, opacity: 0 }, {
              yPercent: 0,
              opacity: 1,
              duration: 0.75,
              stagger: 0.06,
              ease: CONFIG.eases.splitReveal,
              scrollTrigger: {
                trigger: el,
                start: isNarrow ? 'top 85%' : 'top 80%',
                once: true,
              }
            });
            return;
          }
          break;
        case 'fade':
        default:
          break;
      }

      gsap.fromTo(el, fromProps, {
        ...toProps,
        scrollTrigger: {
          trigger: el,
          start: isNarrow ? 'top 85%' : 'top 80%',
          once: true,
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 19. FIX D: FAIL-SAFE VISIBILITY SAFETY NET (CONTENT NEVER STAYS HIDDEN)
  // --------------------------------------------------------------------------
  let failSafeInitialized = false;
  function initFailSafeVisibility() {
    if (failSafeInitialized) return;
    failSafeInitialized = true;

    // 1. IntersectionObserver safety net: any element entering viewport that
    // stays hidden (> 1.5s after intro completes) is automatically forced visible
    if ('IntersectionObserver' in window) {
      const failSafeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            setTimeout(() => {
              const comp = window.getComputedStyle(el);
              if (parseFloat(comp.opacity) < 0.1 || comp.visibility === 'hidden') {
                el.classList.add('kalakaari-force-visible');
                el.style.opacity = '1';
                el.style.transform = 'none';
                el.style.visibility = 'visible';
              }
            }, 1500);
          }
        });
      }, { threshold: 0.05, rootMargin: '60px 0px 60px 0px' });

      const animatedElements = document.querySelectorAll(
        '[data-anim], .elementor-element-6a910a1, .elementor-element-4b1d08b, .elementor-element-4f6a9cb, ' +
        '#long-form-video-section, #photos-albums-portrait-section, #pricing, .kalakaari-pricing-grid, ' +
        '[data-id="d300f2e"], .elementor-element-7bcf7d0, .elementor-element-82e95b1'
      );
      animatedElements.forEach(el => failSafeObserver.observe(el));
    }
  }

  function initGlobalIntroSafetyFallback() {
    const globalSafetyCheck = () => {
      if (!document.documentElement.classList.contains('site-ready')) {
        document.documentElement.classList.add('site-ready', 'nav-expanded', 'hero-intro-complete');
        initAllRemainingSections();
        initFailSafeVisibility();
        document.body.removeAttribute('style');
        document.documentElement.removeAttribute('style');
      }
    };

    window.addEventListener('load', () => setTimeout(globalSafetyCheck, 6000));
    if (document.readyState === 'complete') setTimeout(globalSafetyCheck, 6000);
  }

  // --------------------------------------------------------------------------
  // 20. REMAINING SECTIONS INITIALIZER (TRIGGERED AFTER HERO MASTER TIMELINE)
  // --------------------------------------------------------------------------
  let remainingSectionsInitialized = false;
  function initAllRemainingSections() {
    if (remainingSectionsInitialized) return;
    remainingSectionsInitialized = true;
    initAboutSection();
    initTestimonialsSection();
    initWhatWeDoSection();
    initLongFormSection();
    initAlbumSection();
    initHowItWorksSection();
    initPricingSection();
    initComparisonSection();
    initFaqSection();
    initFinalCtaSection();
    initFooterSection();
    initDataAnimEngine();
    ScrollTrigger.refresh();
  }

  // --------------------------------------------------------------------------
  // 21. MASTER BOOTSTRAPPER & LIFECYCLE
  // --------------------------------------------------------------------------
  function initAll() {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('[Kalakaari Motion] GSAP/ScrollTrigger not loaded. Animations gracefully bypassed.');
      document.documentElement.classList.add('site-ready', 'nav-expanded', 'hero-intro-complete');
      document.body.removeAttribute('style');
      document.documentElement.removeAttribute('style');
      initAllRemainingSections();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // FIX C: Prevent mobile browser toolbar show/hide from restarting triggers
    ScrollTrigger.config({ ignoreMobileResize: true });

    // Progressive enhancement: add js-anim to <html>
    document.documentElement.classList.add('js-anim');

    // Initialize core top-level engines
    initLenis();
    initProgressBar();
    initCursor();
    initHeroSection();
    initGlobalIntroSafetyFallback();

    // Refresh ScrollTrigger calculations after all images/fonts/assets load
    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
      document.body.removeAttribute('style');
      document.documentElement.removeAttribute('style');
    });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1200);
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  // Expose configuration for user tuning
  window.KalakaariMotion = {
    CONFIG,
    refresh: () => ScrollTrigger.refresh(),
    lenis: () => lenisInstance,
  };

})();
