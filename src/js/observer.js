/* ==========================================================================
   SDS MOTION — VIEWPORT OBSERVER ENGINE
   ========================================================================== */

(function () {
  'use strict';

  function initObserver() {
    // 1. Process stagger containers to dynamically apply staggered delays
    const staggerGroups = document.querySelectorAll('.sds-stagger');
    staggerGroups.forEach(group => {
      // Find all immediate or relevant children that have sds-scroll- or anim classes
      const children = group.querySelectorAll('[class*="sds-scroll-"], [class*="sds-card-"], [class*="sds-btn-"]');
      const staggerGap = parseInt(group.style.getPropertyValue('--sds-stagger-gap') || '80');
      
      children.forEach((child, index) => {
        // Set inline variables so CSS can compute the staggered delays dynamically
        child.style.setProperty('--sds-delay', `${index * staggerGap}ms`);
        child.style.setProperty('--sds-stagger-index', index.toString());
      });
    });

    // 2. Setup IntersectionObserver for scroll-driven animations
    const observerOptions = {
      root: null, // relative to viewport
      rootMargin: '0px 0px -8% 0px', // slightly before bottom of screen for cleaner reveals
      threshold: 0.1 // 10% visible
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        const el = entry.target;
        const isOnce = el.getAttribute('data-sds-once') !== 'false' && !el.classList.contains('sds-repeat');

        if (entry.isIntersecting) {
          el.classList.add('sds-in-view');
          
          // If once, stop observing this element
          if (isOnce) {
            observer.unobserve(el);
          }
        } else {
          // If repeat is active, remove class when it leaves viewport
          if (!isOnce) {
            el.classList.remove('sds-in-view');
          }
        }
      });
    }, observerOptions);

    // Find all scroll animation targets
    const scrollTargets = document.querySelectorAll('[class*="sds-scroll-"]');
    scrollTargets.forEach(target => scrollObserver.observe(target));
  }

  // Self-booting when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initObserver);
  } else {
    initObserver();
  }

  // Export globally under SDSObservations namespace
  window.SDSObservations = {
    init: initObserver
  };

})();
