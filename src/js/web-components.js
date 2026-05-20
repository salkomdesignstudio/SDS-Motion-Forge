/* ==========================================================================
   SDS MOTION — NATIVE WEB COMPONENTS
   ========================================================================== */

(function () {
  'use strict';

  // 1. Text Stagger Reveal Component: <mf-text-reveal>
  class MfTextReveal extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      // Capture structural attributes
      const text = this.textContent.trim();
      const effect = this.getAttribute('effect') || 'fade-up'; // e.g. fade-up, blur-in, skew-in
      const splitBy = this.getAttribute('by') || 'char'; // char or word
      const delay = parseInt(this.getAttribute('delay') || '0');
      const stagger = parseInt(this.getAttribute('stagger') || '40');
      const speed = this.getAttribute('speed') || 'normal'; // slow, normal, fast
      const easing = this.getAttribute('easing') || ''; // spring, smooth, bounce, reveal

      this.innerHTML = ''; // Clear raw text node

      // Modifier style mappings
      const speedClass = speed === 'slow' ? 'sds-slow' : (speed === 'fast' ? 'sds-fast' : (speed === 'instant' ? 'sds-instant' : ''));
      const easeClass = easing ? `sds-${easing}` : '';

      if (splitBy === 'char') {
        const chars = text.split('');
        chars.forEach((char, index) => {
          const span = document.createElement('span');
          if (char === ' ') {
            span.innerHTML = '&nbsp;';
            span.style.display = 'inline-block';
          } else {
            span.textContent = char;
            span.className = `sds-${effect} ${speedClass} ${easeClass}`;
            span.style.display = 'inline-block';
            span.style.setProperty('--sds-delay', `${delay + (index * stagger)}ms`);
          }
          this.appendChild(span);
        });
      } else {
        const words = text.split(' ');
        words.forEach((word, index) => {
          const span = document.createElement('span');
          span.textContent = word;
          span.className = `sds-${effect} ${speedClass} ${easeClass}`;
          span.style.display = 'inline-block';
          span.style.setProperty('--sds-delay', `${delay + (index * stagger)}ms`);
          this.appendChild(span);

          // Append trailing space
          if (index < words.length - 1) {
            const space = document.createElement('span');
            space.innerHTML = '&nbsp;';
            space.style.display = 'inline-block';
            this.appendChild(space);
          }
        });
      }
    }
  }

  // 2. Magnetic Spring Component: <mf-magnetic>
  class MfMagnetic extends HTMLElement {
    connectedCallback() {
      this.classList.add('sds-magnetic');
      // Hover behaviors and spring physics calculations are auto-triggered by magnetic.js selector
    }
  }

  // 3. 3D Spotlight Tilt Card: <mf-tilt-card>
  class MfTiltCard extends HTMLElement {
    connectedCallback() {
      this.classList.add('sds-tilt-3d', 'sds-spotlight');
      const maxTilt = this.getAttribute('max-tilt') || '15';
      this.setAttribute('data-sds-max-tilt', maxTilt);
      // Coordinate logic and tilt updates are auto-triggered by hover.js selector
    }
  }

  // Register elements globally
  if (!customElements.get('mf-text-reveal')) {
    customElements.define('mf-text-reveal', MfTextReveal);
  }
  if (!customElements.get('mf-magnetic')) {
    customElements.define('mf-magnetic', MfMagnetic);
  }
  if (!customElements.get('mf-tilt-card')) {
    customElements.define('mf-tilt-card', MfTiltCard);
  }

})();
