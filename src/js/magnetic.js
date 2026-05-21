/* ==========================================================================
   SDS MOTION — PREMIUM SPRING-PHYSICS MAGNETIC ENGINE
   ========================================================================== */

(function () {
  'use strict';

  function initMagneticEngine() {
    const magneticItems = document.querySelectorAll('.sds-magnetic, mf-magnetic');

    magneticItems.forEach(el => {
      if (el.dataset.sdsMagneticBound) return;
      el.dataset.sdsMagneticBound = "true";

      // Configurable properties
      const range = parseFloat(el.getAttribute('data-sds-range') || '50');
      const spring = parseFloat(el.getAttribute('data-sds-spring') || '0.12'); // Stiffness
      const damping = parseFloat(el.getAttribute('data-sds-damping') || '0.78'); // Friction

      // Physics variables
      let currentX = 0;
      let currentY = 0;
      let targetX = 0;
      let targetY = 0;
      let vx = 0;
      let vy = 0;
      let isHovered = false;
      let animationFrameId = null;

      // Wrap inner content to apply the offset transforms cleanly
      let child = el.firstElementChild;
      if (!child) return;

      // Ensure child has absolute positioning or transforms are handled correctly
      child.style.transition = 'none'; // Overrides CSS transitions to avoid clash with physics loops

      function updatePhysics() {
        // Spring equations: acceleration = spring * (target - current) - damping * velocity
        const ax = spring * (targetX - currentX) - damping * vx;
        const ay = spring * (targetY - currentY) - damping * vy;

        vx += ax;
        vy += ay;
        currentX += vx;
        currentY += vy;

        // Apply physical transform offset
        child.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;

        // Stop loop if resting and mouse is not hovered to save CPU
        const isResting = Math.abs(vx) < 0.01 && Math.abs(vy) < 0.01 && Math.abs(targetX - currentX) < 0.01 && Math.abs(targetY - currentY) < 0.01;
        if (!isHovered && isResting) {
          child.style.transform = '';
          currentX = 0; currentY = 0;
          vx = 0; vy = 0;
          animationFrameId = null;
        } else {
          animationFrameId = requestAnimationFrame(updatePhysics);
        }
      }

      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        
        // Find centers
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Distance from cursor to element center
        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;
        const distance = Math.hypot(distX, distY);

        if (distance < range) {
          isHovered = true;
          // Magnetic pull: pull coordinate fractionally (e.g. 35% of distance)
          targetX = distX * 0.38;
          targetY = distY * 0.38;
        } else {
          isHovered = false;
          targetX = 0;
          targetY = 0;
        }

        if (!animationFrameId) {
          animationFrameId = requestAnimationFrame(updatePhysics);
        }
      });

      el.addEventListener('mouseleave', () => {
        isHovered = false;
        targetX = 0;
        targetY = 0;

        if (!animationFrameId) {
          animationFrameId = requestAnimationFrame(updatePhysics);
        }
      });
    });
  }

  // Self-starting hook
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMagneticEngine);
  } else {
    initMagneticEngine();
  }

  window.SDSMagneticEngine = {
    init: initMagneticEngine
  };

})();
