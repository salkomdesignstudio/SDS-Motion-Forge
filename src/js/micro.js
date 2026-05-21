/* ==========================================================================
   SDS MOTION — MICRO INTERACTIONS ENGINE v1.0
   Toggle, Number Ticker, Like Burst, Drag-Delete, Swipe-Dismiss,
   Tab Indicator, Accordion, Rating, Progress Ring, Badge, Ripple Press.
   ========================================================================== */

(function (global) {
  'use strict';

  /* ─── Toggle Flip ──────────────────────────────────────────────────────── */
  function initToggles() {
    document.querySelectorAll('.sds-toggle-wrap').forEach(function (wrap) {
      if (wrap._sds_tog) return;
      wrap._sds_tog = true;
      wrap.addEventListener('click', function () {
        wrap.classList.toggle('on');
        var cb = wrap.dataset.onChange;
        if (cb && typeof window[cb] === 'function') window[cb](wrap.classList.contains('on'));
      });
    });
  }

  /* ─── Checkbox Morph ───────────────────────────────────────────────────── */
  function initCheckboxes() {
    document.querySelectorAll('.sds-checkbox-morph').forEach(function (box) {
      if (box._sds_chk) return;
      box._sds_chk = true;
      box.addEventListener('click', function () {
        box.classList.toggle('checked');
      });
    });
  }

  /* ─── Number Ticker ────────────────────────────────────────────────────── */
  function initTickers() {
    document.querySelectorAll('.sds-number-ticker').forEach(function (ticker) {
      if (ticker._sds_tick) return;
      ticker._sds_tick = true;

      var start = parseFloat(ticker.dataset.start || '0');
      var end   = parseFloat(ticker.dataset.end   || '100');
      var dur   = parseFloat(ticker.dataset.duration || '1200');
      var prefix = ticker.dataset.prefix || '';
      var suffix = ticker.dataset.suffix || '';
      var startTime = null;
      var digits = String(Math.round(end)).length;

      ticker.innerHTML = '';

      function buildCols(val) {
        var str = String(Math.round(val)).padStart(digits, '0');
        ticker.innerHTML = prefix;
        str.split('').forEach(function (ch) {
          var col = document.createElement('span');
          col.className = 'sds-ticker-digit-col';
          var inner = document.createElement('div');
          inner.className = 'sds-ticker-inner';
          for (var d = 0; d <= 9; d++) {
            var digit = document.createElement('span');
            digit.className = 'sds-ticker-digit';
            digit.textContent = d;
            inner.appendChild(digit);
          }
          col.appendChild(inner);
          ticker.appendChild(col);
        });
        ticker.innerHTML += suffix;
      }

      function updateTicker(progress) {
        var val = start + (end - start) * progress;
        var str = String(Math.round(val)).padStart(digits, '0');
        var cols = ticker.querySelectorAll('.sds-ticker-digit-col');
        str.split('').forEach(function (ch, i) {
          var n = parseInt(ch, 10);
          if (cols[i]) {
            cols[i].querySelector('.sds-ticker-inner').style.transform = 'translateY(-' + (n * 1.2) + 'em)';
          }
        });
      }

      function animate(ts) {
        if (!startTime) startTime = ts;
        var elapsed = ts - startTime;
        var progress = Math.min(elapsed / dur, 1);
        // ease out cubic
        var eased = 1 - Math.pow(1 - progress, 3);
        updateTicker(eased);
        if (progress < 1) requestAnimationFrame(animate);
      }

      buildCols(start);

      // Observe when visible
      if ('IntersectionObserver' in window) {
        var obs = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              startTime = null;
              requestAnimationFrame(animate);
              obs.disconnect();
            }
          });
        }, { threshold: 0.5 });
        obs.observe(ticker);
      } else {
        requestAnimationFrame(animate);
      }
    });
  }

  /* ─── Like Burst ───────────────────────────────────────────────────────── */
  function initLikeButtons() {
    document.querySelectorAll('.sds-like-btn').forEach(function (btn) {
      if (btn._sds_like) return;
      btn._sds_like = true;

      btn.addEventListener('click', function () {
        var wasLiked = btn.classList.contains('liked');
        btn.classList.toggle('liked');

        if (!wasLiked) {
          // Spawn burst particles
          for (var i = 0; i < 6; i++) {
            var dot = document.createElement('div');
            dot.className = 'sds-burst-particle';
            var angle = (i / 6) * Math.PI * 2;
            var dist  = 18 + Math.random() * 14;
            dot.style.cssText =
              'left: 50%; top: 50%;' +
              '--tx: ' + (Math.cos(angle) * dist).toFixed(1) + 'px;' +
              '--ty: ' + (Math.sin(angle) * dist).toFixed(1) + 'px;' +
              'background: hsl(' + Math.round(Math.random() * 40 + 340) + ', 85%, 60%);';
            btn.style.position = 'relative';
            btn.appendChild(dot);
            dot.addEventListener('animationend', function () { dot.remove(); });
          }
        }
      });
    });
  }

  /* ─── Drag to Delete ───────────────────────────────────────────────────── */
  function initDragDelete() {
    document.querySelectorAll('.sds-drag-delete').forEach(function (el) {
      if (el._sds_drag) return;
      el._sds_drag = true;

      var startX = 0, currentX = 0, isDragging = false;
      var threshold = el.dataset.threshold ? parseFloat(el.dataset.threshold) : 80;

      el.addEventListener('pointerdown', function (e) {
        startX = e.clientX;
        isDragging = true;
        el.classList.add('dragging');
        el.setPointerCapture(e.pointerId);
      });

      el.addEventListener('pointermove', function (e) {
        if (!isDragging) return;
        currentX = e.clientX - startX;
        if (currentX < 0) {
          el.style.transform = 'translateX(' + currentX + 'px)';
          el.style.opacity = String(1 - Math.min(Math.abs(currentX) / (threshold * 1.5), 0.8));
        }
      });

      el.addEventListener('pointerup', function () {
        isDragging = false;
        el.classList.remove('dragging');
        if (currentX < -threshold) {
          el.classList.add('deleting');
          el.addEventListener('transitionend', function () { el.remove(); }, { once: true });
        } else {
          el.style.transform = '';
          el.style.opacity = '';
        }
        currentX = 0;
      });
    });
  }

  /* ─── Swipe Dismiss ────────────────────────────────────────────────────── */
  function initSwipeDismiss() {
    document.querySelectorAll('.sds-swipe-dismiss').forEach(function (el) {
      if (el._sds_sw) return;
      el._sds_sw = true;

      var startX = 0, startTime = 0;
      var threshold = 60, velocityThreshold = 0.4;

      el.addEventListener('pointerdown', function (e) {
        startX = e.clientX;
        startTime = Date.now();
        el.setPointerCapture(e.pointerId);
      });

      el.addEventListener('pointermove', function (e) {
        var dx = e.clientX - startX;
        el.style.transform = 'translateX(' + dx + 'px) rotate(' + (dx * 0.02) + 'deg)';
        el.style.opacity = String(Math.max(0.3, 1 - Math.abs(dx) / 200));
      });

      el.addEventListener('pointerup', function (e) {
        var dx = e.clientX - startX;
        var dt = Date.now() - startTime;
        var velocity = Math.abs(dx) / dt;

        if (Math.abs(dx) > threshold || velocity > velocityThreshold) {
          el.classList.add(dx > 0 ? 'dismissed-right' : 'dismissed-left');
          el.addEventListener('transitionend', function () { el.remove(); }, { once: true });
        } else {
          el.style.transform = '';
          el.style.opacity = '';
        }
      });
    });
  }

  /* ─── Tab Sliding Indicator ────────────────────────────────────────────── */
  function initTabGroups() {
    document.querySelectorAll('.sds-tab-group').forEach(function (group) {
      if (group._sds_tab) return;
      group._sds_tab = true;

      var indicator = group.querySelector('.sds-tab-indicator');
      var items = group.querySelectorAll('.sds-tab-item');

      function updateIndicator(activeItem) {
        if (!indicator) return;
        var groupRect = group.getBoundingClientRect();
        var itemRect  = activeItem.getBoundingClientRect();
        indicator.style.left  = (itemRect.left  - groupRect.left  + 4) + 'px';
        indicator.style.width = (itemRect.width  - 8) + 'px';
      }

      items.forEach(function (item) {
        item.addEventListener('click', function () {
          items.forEach(function (i) { i.classList.remove('active'); });
          item.classList.add('active');
          updateIndicator(item);
        });
      });

      var active = group.querySelector('.sds-tab-item.active');
      if (active) setTimeout(function () { updateIndicator(active); }, 50);
    });
  }

  /* ─── Rating Stars ─────────────────────────────────────────────────────── */
  function initRatingStars() {
    document.querySelectorAll('.sds-star-rating').forEach(function (group) {
      if (group._sds_rate) return;
      group._sds_rate = true;

      var stars = group.querySelectorAll('.sds-star');
      var current = parseInt(group.dataset.rating || '0', 10);

      function render(n) {
        stars.forEach(function (s, i) {
          s.classList.toggle('active', i < n);
        });
      }

      stars.forEach(function (star, i) {
        star.addEventListener('click', function () {
          current = i + 1;
          render(current);
          var cb = group.dataset.onChange;
          if (cb && typeof window[cb] === 'function') window[cb](current);
        });
        star.addEventListener('mouseenter', function () { render(i + 1); });
        star.addEventListener('mouseleave', function () { render(current); });
      });

      render(current);
    });
  }

  /* ─── Accordion ────────────────────────────────────────────────────────── */
  function initAccordions() {
    document.querySelectorAll('.sds-accordion-item').forEach(function (item) {
      if (item._sds_acc) return;
      item._sds_acc = true;

      var header = item.querySelector('.sds-accordion-header');
      if (!header) return;

      header.addEventListener('click', function () {
        item.classList.toggle('open');
      });
    });
  }

  /* ─── Progress Ring ────────────────────────────────────────────────────── */
  function initProgressRings() {
    document.querySelectorAll('.sds-progress-ring').forEach(function (svg) {
      if (svg._sds_ring) return;
      svg._sds_ring = true;

      var fill = svg.querySelector('.sds-progress-ring-fill');
      var r    = fill ? parseFloat(fill.getAttribute('r') || '24') : 24;
      var circ = 2 * Math.PI * r;
      var pct  = parseFloat(svg.dataset.progress || '75') / 100;

      svg.style.setProperty('--circumference', circ);
      svg.style.setProperty('--progress-offset', circ * (1 - pct));

      if (fill) {
        fill.style.strokeDasharray = circ;
        fill.style.strokeDashoffset = circ;
        setTimeout(function () {
          fill.style.strokeDashoffset = circ * (1 - pct);
        }, 100);
      }
    });
  }

  /* ─── Badge Spring ─────────────────────────────────────────────────────── */
  function initBadges() {
    document.querySelectorAll('.sds-badge-spring').forEach(function (badge) {
      if (badge._sds_badge) return;
      badge._sds_badge = true;
      setTimeout(function () { badge.classList.add('show'); }, 300);
    });
  }

  /* ─── Ripple Press ─────────────────────────────────────────────────────── */
  function initRipplePress() {
    document.querySelectorAll('.sds-ripple-press').forEach(function (el) {
      if (el._sds_rp) return;
      el._sds_rp = true;

      el.addEventListener('click', function (e) {
        var rect = el.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var size = Math.max(rect.width, rect.height) * 2.5;
        var dot = document.createElement('div');
        dot.className = 'sds-ripple-dot';
        dot.style.cssText = 'width:' + size + 'px;height:' + size + 'px;left:' + (x - size/2) + 'px;top:' + (y - size/2) + 'px;';
        el.appendChild(dot);
        dot.addEventListener('animationend', function () { dot.remove(); });
      });
    });
  }

  /* ─── Menu Stagger ─────────────────────────────────────────────────────── */
  function initMenuStagger() {
    document.querySelectorAll('[data-sds-menu-trigger]').forEach(function (trigger) {
      if (trigger._sds_menu) return;
      trigger._sds_menu = true;

      var menuId = trigger.dataset.sdsMenuTrigger;
      var menu   = document.getElementById(menuId);
      if (!menu) return;

      trigger.addEventListener('click', function () {
        var isOpen = menu.classList.contains('open');
        menu.classList.toggle('open');
      });
    });
  }

  /* ─── Number Count Trigger ─────────────────────────────────────────────── */
  function initCounters() {
    document.querySelectorAll('.sds-count-up').forEach(function (el) {
      if (el._sds_count) return;
      el._sds_count = true;

      var end  = parseFloat(el.dataset.end || el.textContent || '0');
      var dur  = parseFloat(el.dataset.duration || '1400');
      var prefix = el.dataset.prefix || '';
      var suffix = el.dataset.suffix || '';

      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          obs.disconnect();
          var start = Date.now();
          function frame() {
            var elapsed = Date.now() - start;
            var t = Math.min(elapsed / dur, 1);
            var eased = 1 - Math.pow(1 - t, 3);
            el.textContent = prefix + Math.round(end * eased).toLocaleString() + suffix;
            if (t < 1) requestAnimationFrame(frame);
          }
          requestAnimationFrame(frame);
        });
      }, { threshold: 0.5 });
      obs.observe(el);
    });
  }

  /* ─── Public API ─────────────────────────────────────────────────────── */
  var SDSMicroEngine = {
    init: function () {
      initToggles();
      initCheckboxes();
      initTickers();
      initLikeButtons();
      initDragDelete();
      initSwipeDismiss();
      initTabGroups();
      initRatingStars();
      initAccordions();
      initProgressRings();
      initBadges();
      initRipplePress();
      initMenuStagger();
      initCounters();
    },

    reinit: function () {
      this.init();
    },

    ticker: function (el, from, to, dur) {
      // Manual trigger
    }
  };

  global.SDSMicroEngine = SDSMicroEngine;

})(window);
