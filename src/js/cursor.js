/* ==========================================================================
   SDS MOTION — CURSOR ENGINE v1.0
   Spring-based cursor physics: magnetic attraction, repulsion, particle trails,
   fluid drag, gravity wells, click ripples. All RAF-based, GPU-only.
   ========================================================================== */

(function (global) {
  'use strict';

  /* Spring solve — velocity-based spring integrator ────────────────────── */
  function spring(current, target, velocity, stiffness, damping) {
    var force = (target - current) * stiffness;
    velocity = (velocity + force) * damping;
    return { pos: current + velocity, vel: velocity };
  }

  /* ─── Particle Trail Pool ─────────────────────────────────────────────── */
  var trailPool = [];
  var trailMax  = 20;
  var trailDots = [];
  var mouseX = 0, mouseY = 0;
  var trailActive = false;

  function createTrailParticle() {
    var dot = document.createElement('div');
    dot.className = 'sds-trail-particle';
    document.body.appendChild(dot);
    return dot;
  }

  function getTrailParticle() {
    for (var i = 0; i < trailPool.length; i++) {
      if (trailPool[i]._dead) return trailPool[i];
    }
    if (trailPool.length < trailMax) {
      var dot = createTrailParticle();
      trailPool.push(dot);
      return dot;
    }
    return null;
  }

  function spawnTrailDot(x, y) {
    var dot = getTrailParticle();
    if (!dot) return;
    dot._dead = false;
    dot.className = 'sds-trail-particle';
    dot.style.left = x + 'px';
    dot.style.top  = y + 'px';
    dot.style.width  = (4 + Math.random() * 6) + 'px';
    dot.style.height = dot.style.width;
    dot.style.opacity = '1';
    dot.style.transform = 'translate(-50%, -50%) scale(1)';

    setTimeout(function () {
      dot.classList.add('dying');
      setTimeout(function () {
        dot._dead = true;
        dot.className = 'sds-trail-particle';
      }, 500);
    }, 80);
  }

  /* ─── Cursor Ring ──────────────────────────────────────────────────────── */
  var ringX = 0, ringY = 0, ringVX = 0, ringVY = 0;
  var ring = null, dot_ = null;
  var ringActive = false;
  var trailInterval = null;

  function initCursorRing(container) {
    ring = container.querySelector('.sds-cursor-ring');
    dot_ = container.querySelector('.sds-cursor-dot');
    if (!ring && !dot_) return;

    ringActive = true;
    ringX = mouseX; ringY = mouseY;
    requestAnimationFrame(tickRing);
  }

  function tickRing() {
    if (!ringActive) return;
    var s = spring(ringX, mouseX, ringVX, 0.12, 0.78);
    var sy = spring(ringY, mouseY, ringVY, 0.12, 0.78);
    ringX = s.pos; ringVX = s.vel;
    ringY = sy.pos; ringVY = sy.vel;

    if (ring) ring.style.transform = 'translate(' + (ringX - 20) + 'px, ' + (ringY - 20) + 'px)';
    if (dot_) dot_.style.transform = 'translate(' + (mouseX - 3) + 'px, ' + (mouseY - 3) + 'px)';
    requestAnimationFrame(tickRing);
  }

  /* ─── Magnetic Elements ──────────────────────────────────────────────── */
  var magnets = [];

  function initMagnetics() {
    document.querySelectorAll('.sds-cursor-magnetic').forEach(function (el) {
      if (el._sds_mag) return;
      el._sds_mag = true;
      var ox = 0, oy = 0, vx = 0, vy = 0;
      var rect = el.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top  + rect.height / 2;
      var range = parseFloat(el.dataset.range || 80);
      var s = parseFloat(el.dataset.spring || 0.18);
      var d = parseFloat(el.dataset.damping || 0.78);
      var raf;

      function tick() {
        rect = el.getBoundingClientRect();
        cx = rect.left + rect.width / 2;
        cy = rect.top  + rect.height / 2;
        var dx = mouseX - cx, dy = mouseY - cy;
        var dist = Math.sqrt(dx * dx + dy * dy);

        var tx = 0, ty = 0;
        if (dist < range) {
          tx = dx * 0.45;
          ty = dy * 0.45;
        }
        var rx = spring(ox, tx, vx, s, d);
        var ry = spring(oy, ty, vy, s, d);
        ox = rx.pos; vx = rx.vel;
        oy = ry.pos; vy = ry.vel;
        el.style.transform = 'translate3d(' + ox + 'px, ' + oy + 'px, 0)';
        raf = requestAnimationFrame(tick);
      }
      tick();
      magnets.push({ el: el, cancel: function () { cancelAnimationFrame(raf); } });
    });
  }

  /* ─── Repulsion Elements ──────────────────────────────────────────────── */
  function initRepulsion() {
    document.querySelectorAll('.sds-cursor-repulsion').forEach(function (el) {
      if (el._sds_rep) return;
      el._sds_rep = true;
      var range = parseFloat(el.dataset.range || 70);

      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top  + rect.height / 2;
        var dx = e.clientX - cx, dy = e.clientY - cy;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < range) {
          var force = (range - dist) / range;
          el.style.transform = 'translate3d(' + (-dx * force * 0.4) + 'px, ' + (-dy * force * 0.4) + 'px, 0)';
        }
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = 'translate3d(0, 0, 0)';
      });
    });
  }

  /* ─── Click Ripple Physics ───────────────────────────────────────────── */
  function initClickRipple() {
    document.querySelectorAll('.sds-click-ripple-zone').forEach(function (zone) {
      if (zone._sds_rip) return;
      zone._sds_rip = true;
      zone.addEventListener('click', function (e) {
        var rect = zone.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var size = Math.max(rect.width, rect.height) * 2;
        var dot = document.createElement('div');
        dot.className = 'sds-click-ripple-particle';
        dot.style.cssText = 'width:' + size + 'px;height:' + size + 'px;left:' + (x - size/2) + 'px;top:' + (y - size/2) + 'px;';
        zone.appendChild(dot);
        dot.addEventListener('animationend', function () { dot.remove(); });
      });
    });
  }

  /* ─── Splatter Burst ────────────────────────────────────────────────── */
  function initSplatterBurst() {
    document.querySelectorAll('.sds-splatter-zone').forEach(function (zone) {
      if (zone._sds_spl) return;
      zone._sds_spl = true;
      zone.addEventListener('click', function (e) {
        var rect = zone.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        for (var i = 0; i < 8; i++) {
          var dot = document.createElement('div');
          dot.className = 'sds-splatter-burst-dot';
          var angle = (i / 8) * Math.PI * 2;
          var dist  = 24 + Math.random() * 28;
          dot.style.cssText = 'left:' + x + 'px;top:' + y + 'px;--tx:' + (Math.cos(angle) * dist) + 'px;--ty:' + (Math.sin(angle) * dist) + 'px;';
          zone.style.position = 'relative';
          zone.appendChild(dot);
          dot.addEventListener('animationend', function () { dot.remove(); });
        }
      });
    });
  }

  /* ─── Physics Ball ───────────────────────────────────────────────────── */
  function initPhysicsBalls() {
    document.querySelectorAll('.sds-physics-ball').forEach(function (ball) {
      if (ball._sds_phys) return;
      ball._sds_phys = true;

      var container = ball.parentElement;
      var x = 0, y = 0, vx = 2, vy = 1.5;
      var gravity = 0.3, damping = 0.72;

      function tick() {
        var cr = container.getBoundingClientRect();
        var br = ball.getBoundingClientRect();
        var cw = cr.width - br.width;
        var ch = cr.height - br.height;

        vy += gravity;
        x += vx; y += vy;

        if (x <= 0)  { x = 0;  vx = Math.abs(vx) * damping; }
        if (x >= cw) { x = cw; vx = -Math.abs(vx) * damping; }
        if (y <= 0)  { y = 0;  vy = Math.abs(vy) * damping; }
        if (y >= ch) { y = ch; vy = -Math.abs(vy) * damping; }

        ball.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0)';
        requestAnimationFrame(tick);
      }
      tick();
    });
  }

  /* ─── Pendulum ───────────────────────────────────────────────────────── */
  function initPendulums() {
    document.querySelectorAll('.sds-pendulum-js').forEach(function (el) {
      if (el._sds_pend) return;
      el._sds_pend = true;
      var angle = -24 * Math.PI / 180;
      var velocity = 0;
      var damping = 0.995;
      var gravity = 0.008;

      function tick() {
        velocity += -gravity * Math.sin(angle);
        velocity *= damping;
        angle += velocity;
        el.style.transform = 'rotate(' + (angle * 180 / Math.PI) + 'deg)';
        requestAnimationFrame(tick);
      }
      tick();
    });
  }

  /* ─── Gravity Well ───────────────────────────────────────────────────── */
  function initGravityWell() {
    document.querySelectorAll('.sds-gravity-well').forEach(function (well) {
      if (well._sds_gw) return;
      well._sds_gw = true;
      var targets = well.querySelectorAll('.sds-gravity-well-target');

      targets.forEach(function (target) {
        var ox = 0, oy = 0, vx = 0, vy = 0;
        var wellRect, tRect, cx, cy, tx, ty;

        function tick() {
          wellRect = well.getBoundingClientRect();
          tRect = target.getBoundingClientRect();
          cx = wellRect.left + wellRect.width / 2;
          cy = wellRect.top + wellRect.height / 2;
          tx = tRect.left + tRect.width / 2;
          ty = tRect.top + tRect.height / 2;

          var wx = mouseX, wy = mouseY;
          var dx = cx - tx, dy = cy - ty;
          var dist = Math.sqrt(dx * dx + dy * dy);
          var strength = dist < 100 ? 0.04 : 0;

          var rx = spring(ox, dx * strength, vx, 0.15, 0.78);
          var ry = spring(oy, dy * strength, vy, 0.15, 0.78);
          ox = rx.pos; vx = rx.vel;
          oy = ry.pos; vy = ry.vel;

          target.style.transform = 'translate3d(' + ox + 'px, ' + oy + 'px, 0)';
          requestAnimationFrame(tick);
        }
        tick();
      });
    });
  }

  /* ─── Force Field Spotlight ──────────────────────────────────────────── */
  function initForceFields() {
    document.querySelectorAll('.sds-force-field').forEach(function (el) {
      if (el._sds_ff) return;
      el._sds_ff = true;

      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        el.style.setProperty('--ff-x', x + 'px');
        el.style.setProperty('--ff-y', y + 'px');
        var pseudo = el.style;
        pseudo.setProperty('background-image',
          'radial-gradient(circle 120px at ' + x + 'px ' + y + 'px, rgba(63,109,246,0.12), transparent)');
      });
      el.addEventListener('mouseleave', function () {
        el.style.backgroundImage = '';
      });
    });
  }

  /* ─── Pressure Wave Text ─────────────────────────────────────────────── */
  function initPressureWave() {
    document.querySelectorAll('.sds-pressure-wave').forEach(function (el) {
      if (el._sds_pw) return;
      el._sds_pw = true;
      var chars = el.querySelectorAll('.sds-char');
      var t = 0;

      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var mx = e.clientX - rect.left;
        chars.forEach(function (ch, i) {
          var cr = ch.getBoundingClientRect();
          var chCx = cr.left + cr.width / 2 - rect.left;
          var dist = Math.abs(mx - chCx);
          var wave = Math.max(0, 1 - dist / 50) * 14;
          ch.style.transform = 'translateY(' + (-wave) + 'px) scale(' + (1 + wave * 0.02) + ')';
        });
      });
      el.addEventListener('mouseleave', function () {
        chars.forEach(function (ch) {
          ch.style.transform = '';
        });
      });
    });
  }

  /* ─── Word Orbit ────────────────────────────────────────────────────── */
  function initWordOrbit() {
    document.querySelectorAll('.sds-word-orbit').forEach(function (el) {
      if (el._sds_wo) return;
      el._sds_wo = true;
      var words = el.querySelectorAll('.sds-word');

      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var mx = e.clientX - rect.left - rect.width / 2;
        var my = e.clientY - rect.top  - rect.height / 2;

        words.forEach(function (w, i) {
          var angle = (i / words.length) * Math.PI * 2;
          var dist = 8;
          var tx = Math.cos(angle) * mx * 0.12 * dist / 8;
          var ty = Math.sin(angle) * my * 0.12 * dist / 8;
          w.style.transform = 'translate3d(' + tx + 'px, ' + ty + 'px, 0)';
        });
      });
      el.addEventListener('mouseleave', function () {
        words.forEach(function (w) { w.style.transform = ''; });
      });
    });
  }

  /* ─── Cursor Trail Text Highlight ────────────────────────────────────── */
  function initCursorTrailText() {
    document.querySelectorAll('.sds-cursor-trail-text').forEach(function (el) {
      if (el._sds_ctt) return;
      el._sds_ctt = true;
      var chars = el.querySelectorAll('.sds-char');
      var lastLit = -1;

      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var mx = e.clientX - rect.left;
        var closest = -1, minDist = Infinity;

        chars.forEach(function (ch, i) {
          var cr = ch.getBoundingClientRect();
          var cx = cr.left + cr.width / 2 - rect.left;
          var d = Math.abs(mx - cx);
          if (d < minDist) { minDist = d; closest = i; }
        });

        if (closest !== lastLit) {
          chars.forEach(function (c) { c.classList.remove('lit'); });
          if (closest >= 0) chars[closest].classList.add('lit');
          lastLit = closest;
        }
      });
      el.addEventListener('mouseleave', function () {
        chars.forEach(function (c) { c.classList.remove('lit'); });
      });
    });
  }

  /* ─── Global Mouse Tracker ───────────────────────────────────────────── */
  function startMouseTracker() {
    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (trailActive) {
        spawnTrailDot(e.clientX, e.clientY);
      }
    });
  }

  /* ─── Public API ─────────────────────────────────────────────────────── */
  var SDSCursorEngine = {
    mouseX: 0, mouseY: 0,

    init: function (opts) {
      opts = opts || {};
      startMouseTracker();
      initMagnetics();
      initRepulsion();
      initClickRipple();
      initSplatterBurst();
      initPhysicsBalls();
      initPendulums();
      initGravityWell();
      initForceFields();
      initPressureWave();
      initWordOrbit();
      initCursorTrailText();

      if (opts.ring) {
        var container = opts.ring === true ? document.body : opts.ring;
        initCursorRing(container);
      }

      if (opts.trail) {
        trailActive = true;
      }
    },

    enableTrail: function () { trailActive = true; },
    disableTrail: function () { trailActive = false; },

    spawnRipple: function (zone, x, y) {
      var size = Math.max(zone.offsetWidth, zone.offsetHeight) * 2;
      var dot = document.createElement('div');
      dot.className = 'sds-click-ripple-particle';
      dot.style.cssText = 'width:' + size + 'px;height:' + size + 'px;left:' + (x - size/2) + 'px;top:' + (y - size/2) + 'px;';
      zone.appendChild(dot);
      dot.addEventListener('animationend', function () { dot.remove(); });
    }
  };

  global.SDSCursorEngine = SDSCursorEngine;

})(window);
