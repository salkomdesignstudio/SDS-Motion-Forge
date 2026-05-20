/* ==========================================================================
   SDS MOTION — 3D PERSPECTIVE TILT & SPOTLIGHT SYSTEM
   ========================================================================== */

(function () {
  'use strict';

  function initHoverEngine() {
    const tiltElements = document.querySelectorAll('.sds-tilt-3d, .sds-spotlight');

    tiltElements.forEach(el => {
      let isTiltActive = el.classList.contains('sds-tilt-3d');
      let isSpotlightActive = el.classList.contains('sds-spotlight');

      // Maximum degrees of tilt rotation
      const maxTilt = parseFloat(el.getAttribute('data-sds-max-tilt') || '15');

      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        
        // Mouse coordinate relative to element bounds
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (isSpotlightActive) {
          // Calculate percentage for spotlight radial gradient
          const spotX = (x / width) * 100;
          const spotY = (y / height) * 100;
          el.style.setProperty('--spot-x', `${spotX}%`);
          el.style.setProperty('--spot-y', `${spotY}%`);
        }

        if (isTiltActive) {
          // Normalize coordinates around element center (-0.5 to 0.5)
          const normX = (x / width) - 0.5;
          const normY = (y / height) - 0.5;

          // Calculate degrees. Turning on X-axis relates to vertical movement (normY)
          // Turning on Y-axis relates to horizontal movement (normX)
          const rotateX = -normY * maxTilt;
          const rotateY = normX * maxTilt;

          el.style.setProperty('--rx', rotateX.toFixed(2));
          el.style.setProperty('--ry', rotateY.toFixed(2));

          // Set directional mouse coords for advanced styles
          el.style.setProperty('--mx', (x / width).toFixed(3));
          el.style.setProperty('--my', (y / height).toFixed(3));
        }
      });

      el.addEventListener('mouseleave', () => {
        // Reset angles smoothly on exit
        el.style.setProperty('--rx', '0');
        el.style.setProperty('--ry', '0');
        
        // Spot shine fades on leave via CSS transition
        el.style.setProperty('--spot-x', '50%');
        el.style.setProperty('--spot-y', '50%');
      });
    });
  }

  // Self-starting hook
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHoverEngine);
  } else {
    initHoverEngine();
  }

  window.SDSHoverEngine = {
    init: initHoverEngine
  };

})();
