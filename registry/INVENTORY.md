# SDS Motion Forge — Source Inventory (v4.0.3 baseline)

Generated 2026-06-11T04:00:33.337Z from `src\motion.css` by `scripts/analyze-css.js`.
This file is generated — do not hand-edit. The JSON source of truth is `registry/inventory.json`.

## Totals

- Classes: **388**
  - buttons: 50
  - cards: 49
  - infrastructure: 3
  - inputs: 51
  - interactive: 7
  - loaders: 51
  - modifiers: 18
  - scroll: 55
  - text: 104
- Keyframes defined: **324**, referenced: **324**
- Referenced but UNDEFINED keyframes: `sds-charOrbitBob`
- Defined but unreferenced keyframes: `sds-jellyKf`

## Compositor safety

- Fully compositor-safe (transform/opacity/filter/clip-path only): **247**
- Paint-only offenders (box-shadow / border-color / background-position etc. — no layout): **105**
- Layout-triggering offenders (quarantine list for R4): **36**

### Layout-triggering classes (quarantined, never silently changed — R1/R2)

| Class | Layout properties animated |
|---|---|
| `sds-blur-focus` | letter-spacing |
| `sds-btn-burst` | outline-offset, outline-width |
| `sds-btn-morph` | border-radius |
| `sds-btn-outline-grow` | outline-offset, outline-width |
| `sds-btn-pulse-border` | border-width |
| `sds-btn-shock` | outline-offset, outline-width |
| `sds-card-liquid-border` | border-radius |
| `sds-card-morph` | border-radius |
| `sds-cinema-title` | letter-spacing |
| `sds-cipher-reveal` | letter-spacing |
| `sds-ink-bleed` | letter-spacing |
| `sds-input-border-beam` | outline-offset, outline-width |
| `sds-input-echo` | outline-offset, outline-width |
| `sds-input-expand` | border-radius |
| `sds-input-ink` | outline-offset |
| `sds-input-morph` | border-radius |
| `sds-input-morph-ph` | letter-spacing |
| `sds-input-orbit` | outline-offset |
| `sds-loader-bar` | transform-origin |
| `sds-loader-cascade` | height |
| `sds-loader-cube` | border-radius |
| `sds-loader-dna` | top |
| `sds-loader-expand` | border-radius |
| `sds-loader-fluid` | border-radius |
| `sds-loader-matrix` | height |
| `sds-loader-morph` | border-radius |
| `sds-loader-type` | width |
| `sds-morph-word` | letter-spacing |
| `sds-prism-split` | letter-spacing |
| `sds-ripple-text` | letter-spacing |
| `sds-scramble-decode` | letter-spacing |
| `sds-scroll-cinema` | letter-spacing |
| `sds-tracking-contract` | letter-spacing |
| `sds-tracking-expand` | letter-spacing |
| `sds-typewriter-pro` | width |
| `sds-typing-caret` | width |

## Duration usage (drives Phase 0 token scale)

| Duration | Uses |
|---|---|
| `2s` | 56 |
| `0.8s` | 46 |
| `3s` | 30 |
| `var(--sds-duration)` | 27 |
| `0.9s` | 24 |
| `4s` | 22 |
| `1s` | 21 |
| `1.2s` | 20 |
| `1.4s` | 15 |
| `2.4s` | 15 |
| `1.6s` | 14 |
| `0.6s` | 12 |
| `1.8s` | 12 |
| `0.7s` | 11 |
| `2.5s` | 9 |
| `2.2s` | 7 |
| `1.1s` | 6 |
| `5s` | 5 |
| `0.5s` | 5 |
| `2.6s` | 4 |
| `2.8s` | 4 |
| `0.3s` | 3 |
| `0.85s` | 2 |
| `0.75s` | 2 |
| `1.5s` | 2 |
| `3.5s` | 1 |
| `0.65s` | 1 |
| `0.45s` | 1 |
| `0.4s` | 1 |
| `24s` | 1 |
| `6s` | 1 |

## Easing usage (drives Phase 0 token scale)

| Easing | Uses |
|---|---|
| `var(--sds-easing)` | 102 |
| `ease-in-out` | 92 |
| `ease` | 76 |
| `linear` | 45 |
| `cubic-bezier(0.34, 1.56, 0.64, 1)` | 12 |
| `steps(1)` | 11 |
| `cubic-bezier(0.16, 1, 0.3, 1)` | 9 |
| `cubic-bezier(0.68, -0.55, 0.27, 1.55)` | 8 |
| `cubic-bezier(0.215, 0.61, 0.355, 1)` | 6 |
| `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | 3 |
| `ease-out` | 3 |
| `step-end` | 3 |
| `cubic-bezier(0.28, 0.84, 0.42, 1)` | 1 |
| `steps(4)` | 1 |
| `steps(10)` | 1 |
| `steps(5)` | 1 |
| `cubic-bezier(0.25, 1, 0.5, 1)` | 1 |
| `steps(3)` | 1 |
| `steps(20)` | 1 |
| `steps(22)` | 1 |
| `cubic-bezier(0.6, -0.28, 0.74, 0.05)` | 1 |
| `cubic-bezier(0.22, 1, 0.36, 1)` | 1 |

## Full class inventory

Legend: CS = compositor-safe, CH = targets children, PE = uses pseudo-elements.

### text (104)

| Class | Keyframes | Duration | Easing | CS | CH | PE | Custom props consumed |
|---|---|---|---|---|---|---|---|
| `sds-arc-orbit` | sds-charOrbit | 0.8s | var(--sds-easing) | ✓ | ✓ |  | --sds-easing |
| `sds-aurora-text` | sds-auroraFlow | 5s | linear | ✗ |  |  | --sds-accent, --sds-primary |
| `sds-blur-focus` | sds-blurFocus | 1.1s | ease | ✗ |  |  | — |
| `sds-bounce-drop-in` | sds-bounceDrop | 1.1s | cubic-bezier(0.215, 0.61, 0.355, 1) | ✓ |  |  | — |
| `sds-bounce-in-up` | sds-bounceInUp | 0.85s | cubic-bezier(0.215, 0.61, 0.355, 1) | ✓ |  |  | — |
| `sds-bounce-loop` | sds-bounceLoop | 1.4s | cubic-bezier(0.28, 0.84, 0.42, 1) | ✓ |  |  | — |
| `sds-center-burst` | sds-centerBurst | 0.75s | cubic-bezier(0.34, 1.56, 0.64, 1) | ✓ | ✓ |  | --burst, --i |
| `sds-char-orbit` | sds-charOrbit, **sds-charOrbitBob (MISSING)** | var(--sds-duration), 2s | var(--sds-easing); ease-in-out | ✓ |  |  | --i, --sds-duration, --sds-easing |
| `sds-chromatic-shift` | sds-chromaticShift | 5s | linear | ✓ |  |  | — |
| `sds-cinema-title` | sds-cinematicTitle | 1.4s | var(--sds-easing) | ✗ |  |  | --sds-easing |
| `sds-cipher-reveal` | sds-cipherReveal | 1.6s | var(--sds-easing) | ✗ |  |  | --sds-easing, --sds-primary |
| `sds-color-cycle` | sds-colorCycle | 4s | linear | ✗ |  |  | --sds-accent, --sds-primary |
| `sds-data-stream` | sds-dataStream | 1s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-depth-charge` | sds-depthWarp | 1.4s | ease | ✓ |  |  | — |
| `sds-depth-warp` | sds-depthWarp | var(--sds-duration) | var(--sds-easing) | ✓ |  |  | --sds-duration, --sds-easing |
| `sds-door-open` | sds-doorOpen | var(--sds-duration) | var(--sds-easing) | ✓ |  |  | --sds-duration, --sds-easing |
| `sds-drop-bounce` | sds-dropBounce | 1.1s | cubic-bezier(0.215, 0.61, 0.355, 1) | ✓ |  |  | — |
| `sds-drop-settle` | sds-dropSettle | 0.65s | cubic-bezier(0.34, 1.56, 0.64, 1) | ✓ | ✓ |  | --i |
| `sds-echo-out` | sds-echoOut | 1s | var(--sds-easing) | ✗ |  |  | --sds-easing |
| `sds-elastic-bounce` | sds-elasticBounce | 1s | cubic-bezier(0.34, 1.56, 0.64, 1) | ✓ |  |  | — |
| `sds-elastic-stamp` | sds-elasticStamp | var(--sds-duration) | var(--sds-easing) | ✓ |  |  | --sds-duration, --sds-easing |
| `sds-explode-formation` | sds-explodeFormation | 0.9s | cubic-bezier(0.34, 1.56, 0.64, 1) | ✓ | ✓ |  | --dr, --dx, --dy, --i |
| `sds-film-burn` | sds-phantomBlur | 1.2s | ease | ✓ |  |  | — |
| `sds-flicker-on` | sds-flickerOn | 1.8s | steps(1) | ✓ |  |  | — |
| `sds-flip-x` | sds-flipX | var(--sds-duration) | var(--sds-easing) | ✓ |  |  | --sds-duration, --sds-easing |
| `sds-flip-y` | sds-flipY | var(--sds-duration) | var(--sds-easing) | ✓ |  |  | --sds-duration, --sds-easing |
| `sds-float-bob` | sds-floatBob | 2.2s | ease-in-out | ✓ |  |  | — |
| `sds-focus-pull` | sds-focusPull | var(--sds-duration) | ease | ✓ |  |  | --sds-duration |
| `sds-fold-down` | sds-foldDown | var(--sds-duration) | var(--sds-easing) | ✓ |  |  | --sds-duration, --sds-easing |
| `sds-fold-up` | sds-foldUp | var(--sds-duration) | var(--sds-easing) | ✓ |  |  | --sds-duration, --sds-easing |
| `sds-glitch-flicker` | sds-glitchFlicker | 2.5s | linear | ✗ |  |  | --sds-accent, --sds-primary, --sds-success |
| `sds-glitch-slide` | sds-glitchSlide | 3s | steps(1) | ✗ |  |  | --sds-accent |
| `sds-glow-pulse` | sds-glowPulse | 2s | ease-in-out | ✗ |  |  | --sds-primary, --sds-primary-dim, --sds-primary-glow |
| `sds-gradient-sweep` | sds-gradSweep | 3s | linear | ✗ |  |  | --sds-accent, --sds-primary |
| `sds-grand-entrance` | sds-grandEntrance | 1.4s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-gravity-bounce` | sds-gravityBounce | 1.2s | cubic-bezier(0.215, 0.61, 0.355, 1) | ✓ |  |  | — |
| `sds-gravity-drop` | sds-gravityDrop | var(--sds-duration) | cubic-bezier(0.68, -0.55, 0.27, 1.55) | ✓ |  |  | --sds-duration |
| `sds-heartbeat-text` | sds-heartbeatText | 1.4s | ease-in-out | ✓ |  |  | — |
| `sds-heat-shimmer` | sds-heatShimmer | 2.6s | ease-in-out | ✓ |  |  | — |
| `sds-highlight-burn` | sds-highlightBurn | var(--sds-duration) | var(--sds-easing) | ✗ |  |  | --sds-duration, --sds-easing, --sds-primary-dim |
| `sds-hologram-text` | sds-hologramText | 4s | linear | ✓ |  |  | — |
| `sds-ink-bleed` | sds-inkBleed | var(--sds-duration), 1.4s | cubic-bezier(0.16, 1, 0.3, 1); cubic-bezier(0.25, 0.46, 0.45, 0.94) | ✗ |  |  | --sds-duration |
| `sds-iris-open` | sds-irisOpen | 0.9s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-jello` | sds-jelloText | 1.2s | ease | ✓ |  |  | — |
| `sds-kinetic-wave` | sds-kineticWave | 1.6s | ease | ✓ | ✓ |  | — |
| `sds-levitate` | sds-levitateText | 2.8s | ease-in-out | ✓ |  |  | — |
| `sds-light-speed` | sds-lightSpeed | 0.6s | ease-out | ✓ |  |  | — |
| `sds-liquid-rise` | sds-liquidRise | var(--sds-duration) | cubic-bezier(0.16, 1, 0.3, 1) | ✓ |  |  | --sds-duration |
| `sds-magnetic-drift` | sds-magnetDrift | 4s | ease-in-out | ✓ |  |  | — |
| `sds-morph-word` | sds-morphWord | 3s | ease-in-out | ✗ |  |  | — |
| `sds-neon-flare` | sds-neonFlare | 2s | ease | ✗ |  |  | --sds-primary, --sds-primary-dim, --sds-primary-glow |
| `sds-neon-flicker-in` | sds-neonFlickerIn | 1.6s | steps(1) | ✗ |  |  | --sds-primary, --sds-primary-dim, --sds-primary-glow |
| `sds-neon-pulse-text` | sds-neonPulseText, sds-neonFlickerText | 2s, 6s | ease-in-out; linear | ✗ |  |  | --sds-primary, --sds-primary-dim, --sds-primary-glow |
| `sds-oscillate` | sds-oscillateText | 2.2s | ease-in-out | ✓ |  |  | — |
| `sds-pendulum` | sds-pendulum | 2.4s | ease-in-out | ✓ |  |  | — |
| `sds-perspective-swing` | sds-perspSwing | var(--sds-duration) | var(--sds-easing) | ✓ |  |  | --sds-duration, --sds-easing |
| `sds-phantom-blur` | sds-phantomBlur | var(--sds-duration) | ease | ✓ |  |  | --sds-duration |
| `sds-pixel-in` | sds-pixelIn | 0.8s | steps(5) | ✓ |  |  | — |
| `sds-pop-in` | sds-popIn | 0.6s | cubic-bezier(0.34, 1.56, 0.64, 1) | ✓ |  |  | — |
| `sds-prism-split` | sds-prismSplit | 2s | cubic-bezier(0.25, 1, 0.5, 1) | ✗ |  |  | — |
| `sds-refract` | sds-refract | 1.4s | steps(3) | ✗ |  | ✓ | --sds-accent, --sds-primary |
| `sds-reveal-down-mask` | sds-revealDown | var(--sds-duration) | var(--sds-easing) | ✓ |  |  | --sds-duration, --sds-easing |
| `sds-reveal-up-mask` | sds-revealUp | var(--sds-duration) | var(--sds-easing) | ✓ |  |  | --sds-duration, --sds-easing |
| `sds-ripple-text` | sds-rippleText | 1.2s | var(--sds-easing) | ✗ |  |  | --sds-easing |
| `sds-roll-in` | sds-rollIn | 0.8s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-rubber-band` | sds-rubberBand | 1.1s | ease | ✓ |  |  | — |
| `sds-scramble-decode` | sds-scramblePulse | 2.5s | ease | ✗ |  |  | — |
| `sds-shadow-lift` | sds-shadowLift | 1.6s | ease-in-out | ✗ |  |  | — |
| `sds-shatter-in` | sds-shatterIn | var(--sds-duration) | var(--sds-easing) | ✓ |  |  | --sds-duration, --sds-easing |
| `sds-shimmer-sweep` | sds-shimmerSweep | 2.2s | ease-in-out | ✗ |  |  | --sds-accent, --sds-primary |
| `sds-signal-wave` | sds-kineticWave | 2s | ease | ✓ | ✓ |  | — |
| `sds-skew-slide` | sds-skewSlide | 0.75s | cubic-bezier(0.16, 1, 0.3, 1) | ✓ |  |  | — |
| `sds-slant-rise` | sds-slantRise | 0.8s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-slice-reveal` | sds-sliceReveal | var(--sds-duration) | var(--sds-easing) | ✓ |  |  | --sds-duration, --sds-easing |
| `sds-slide-blur-left` | sds-slideBlurLeft | 0.8s | cubic-bezier(0.16, 1, 0.3, 1) | ✓ |  |  | — |
| `sds-slide-blur-right` | sds-slideBlurRight | 0.8s | cubic-bezier(0.16, 1, 0.3, 1) | ✓ |  |  | — |
| `sds-smoke-reveal` | sds-focusPull | 1.6s | ease | ✓ |  |  | — |
| `sds-split-reveal` | sds-splitReveal | 0.9s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-spotlight` | sds-spotlightText | 2.4s | ease-in-out | ✓ |  |  | — |
| `sds-squash-stretch` | sds-squashStretch | 0.8s | cubic-bezier(0.34, 1.56, 0.64, 1) | ✓ |  |  | — |
| `sds-stagger-chars` | sds-staggerChar | 0.5s | var(--sds-easing) | ✓ | ✓ |  | --sds-easing |
| `sds-static-burst` | sds-staticBurst | 3s | steps(1) | ✓ |  |  | — |
| `sds-streak-in` | sds-streakIn | 0.7s | cubic-bezier(0.25, 0.46, 0.45, 0.94) | ✓ |  |  | — |
| `sds-strike-through` | sds-strikeThrough | var(--sds-duration) | var(--sds-easing) | ✓ |  | ✓ | --sds-accent, --sds-duration, --sds-easing |
| `sds-swing-in` | sds-swingIn | 0.9s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-tada` | sds-tadaText | 1.4s | ease | ✓ |  |  | — |
| `sds-tracking-contract` | sds-trackingContract | 1s | var(--sds-easing) | ✗ |  |  | --sds-easing |
| `sds-tracking-expand` | sds-trackingExpand | 0.9s | var(--sds-easing) | ✗ |  |  | --sds-easing |
| `sds-typewriter-pro` | sds-typewriterPrem, sds-cursorBlink | 2.5s, 0.8s | steps(20); step-end | ✗ |  |  | --sds-primary |
| `sds-typing-caret` | sds-typingCaretExpand, sds-cursorBlink | 2s, 0.8s | steps(22); step-end | ✗ |  |  | --sds-primary |
| `sds-underline-grow` | sds-underlineGrow | var(--sds-duration) | var(--sds-easing) | ✓ |  | ✓ | --sds-duration, --sds-easing, --sds-primary |
| `sds-unfurl` | sds-unfurlText | 1s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-vapor-rise` | sds-vaporRise | 1.2s | cubic-bezier(0.16, 1, 0.3, 1) | ✓ |  |  | — |
| `sds-velocity-blur-text` | sds-velocityBlur | 0.9s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-velvet-drop` | sds-velvetDrop | var(--sds-duration) | var(--sds-easing) | ✓ |  |  | --sds-duration, --sds-easing |
| `sds-vibrate` | sds-vibrate | 0.3s | linear | ✓ |  |  | — |
| `sds-wave-cascade` | sds-waveCascade | 1.4s | ease-in-out | ✓ | ✓ |  | --i |
| `sds-weight-drop` | sds-gravityDrop | 1.2s | cubic-bezier(0.6, -0.28, 0.74, 0.05) | ✓ |  |  | — |
| `sds-wipe-left` | sds-wipeLeft | var(--sds-duration) | var(--sds-easing) | ✓ |  |  | --sds-duration, --sds-easing |
| `sds-wipe-right` | sds-wipeRight | var(--sds-duration) | var(--sds-easing) | ✓ |  |  | --sds-duration, --sds-easing |
| `sds-wobble` | sds-wobbleText | 1.2s | ease-in-out | ✓ |  |  | — |
| `sds-word-blur-in` | sds-wordBlurIn | 1.1s | ease | ✓ |  |  | — |
| `sds-zoom-out-in` | sds-zoomFar | 0.9s | cubic-bezier(0.16, 1, 0.3, 1) | ✓ |  |  | — |
| `sds-zoom-punch` | sds-zoomPunch | 0.7s | cubic-bezier(0.22, 1, 0.36, 1) | ✓ |  |  | — |

### buttons (50)

| Class | Keyframes | Duration | Easing | CS | CH | PE | Custom props consumed |
|---|---|---|---|---|---|---|---|
| `sds-btn-amp` | sds-btnAmp | 0.6s | ease-in-out | ✓ |  |  | — |
| `sds-btn-aurora` | sds-btnAurora | 4s | ease-in-out | ✗ |  |  | — |
| `sds-btn-border-flow` | sds-btnBorderFlow | 3s | linear | ✗ |  |  | --sds-accent, --sds-primary, --sds-primary-glow |
| `sds-btn-bounce` | sds-btnBounce | 1.4s | cubic-bezier(0.34, 1.56, 0.64, 1) | ✓ |  |  | — |
| `sds-btn-burst` | sds-btnBurst | 2.2s | ease-in-out | ✗ |  |  | --sds-primary-glow |
| `sds-btn-charge` | sds-btnCharge | 2.4s | ease-in-out | ✗ |  |  | --sds-primary-glow |
| `sds-btn-crystal` | sds-btnCrystal | 2.4s | ease-in-out | ✗ |  |  | — |
| `sds-btn-depth-press` | sds-btnDepthPress | 2s | ease-in-out | ✗ |  |  | — |
| `sds-btn-dissolve` | sds-btnDissolve | 3s | ease-in-out | ✓ |  |  | — |
| `sds-btn-edge` | sds-edgeTrace | 2s | linear | ✗ |  |  | --sds-primary |
| `sds-btn-energy` | sds-energyRipple | 2s | ease | ✗ |  |  | --sds-primary-dim, --sds-primary-glow |
| `sds-btn-fire` | sds-btnFire | 2s | ease-in-out | ✗ |  |  | — |
| `sds-btn-flare` | sds-btnFlare | 2.5s | ease-in-out | ✗ |  |  | — |
| `sds-btn-float` | sds-btnFloat | 2.6s | ease-in-out | ✗ |  |  | — |
| `sds-btn-flux` | sds-btnFlux | 1.6s | ease-in-out | ✓ |  |  | — |
| `sds-btn-glow-core` | sds-btnGlowCore | 2.2s | ease-in-out | ✗ |  |  | --sds-primary-dim, --sds-primary-glow |
| `sds-btn-glow-surge` | sds-glowSurge | 2s | ease | ✗ |  |  | — |
| `sds-btn-gradient-shift` | sds-btnGradShift | 4s | ease | ✗ |  |  | --sds-accent, --sds-primary |
| `sds-btn-gravity` | sds-btnGravity | 1.8s | cubic-bezier(0.68, -0.55, 0.27, 1.55) | ✗ |  |  | — |
| `sds-btn-gravity-pull` | sds-btnGravityPull | 2.4s | ease-in-out | ✗ |  |  | — |
| `sds-btn-heartbeat` | sds-btnHeartbeat | 1.2s | ease-in-out | ✓ |  |  | — |
| `sds-btn-hologram` | sds-btnHologram | 4s | linear | ✓ |  |  | — |
| `sds-btn-ice` | sds-btnIce | 3s | ease-in-out | ✗ |  |  | — |
| `sds-btn-kinetic` | sds-btnKinetic | 0.8s | ease-in-out | ✓ |  |  | — |
| `sds-btn-lift` | sds-liftShadow | 2s | ease | ✗ |  |  | — |
| `sds-btn-liquid` | sds-liquidFill | 2s | ease | ✗ |  |  | --sds-primary |
| `sds-btn-magnetic` | sds-magnetPulse | 2s | ease | ✗ |  |  | --sds-primary-glow |
| `sds-btn-magnetic-trail` | sds-btnMagTrail | 2s | ease-in-out | ✗ |  |  | — |
| `sds-btn-momentum` | sds-btnMomentum | 2s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-btn-morph` | sds-morphPill | 2s | ease | ✗ |  |  | — |
| `sds-btn-neon` | sds-neonSign | 4s | ease | ✗ |  |  | --sds-primary-dim, --sds-primary-glow |
| `sds-btn-neon-trace` | sds-btnNeonTrace | 3s | ease | ✗ |  |  | --sds-primary-dim, --sds-primary-glow |
| `sds-btn-outline-grow` | sds-btnOutlineGrow | 2s | ease | ✗ |  |  | --sds-primary-glow |
| `sds-btn-plasma` | sds-plasmaGlow | 3s | ease | ✗ |  |  | --sds-primary-dim, --sds-primary-glow |
| `sds-btn-press` | sds-pressDepth | 1.8s | ease | ✗ |  |  | — |
| `sds-btn-pulse-border` | sds-btnPulseBorder | 2s | ease-in-out | ✗ |  |  | --sds-primary, --sds-primary-glow |
| `sds-btn-quantum` | sds-elasticStamp | 0.8s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-btn-radar` | sds-btnRadar | 2s | ease | ✗ |  |  | — |
| `sds-btn-recoil` | sds-btnRecoil | 2.4s | ease-in-out | ✓ |  |  | — |
| `sds-btn-ripple` | sds-btnRipple | 2s | ease | ✗ |  |  | --sds-primary-glow |
| `sds-btn-rotate` | sds-btnRotate | 4s | linear | ✓ |  |  | — |
| `sds-btn-scan` | sds-btnScan | 2s | linear | ✗ |  |  | — |
| `sds-btn-shimmer` | sds-btnShimmer | 1.8s | ease-in-out | ✗ |  |  | — |
| `sds-btn-shock` | sds-shockwave | 2s | ease | ✗ |  |  | --sds-primary-glow |
| `sds-btn-split` | sds-btnSplit | 2.8s | ease-in-out | ✗ |  |  | --sds-primary, --sds-primary-glow |
| `sds-btn-stretch` | sds-btnStretch | 2s | cubic-bezier(0.34, 1.56, 0.64, 1) | ✓ |  |  | — |
| `sds-btn-swipe` | sds-btnSwipe | 2.4s | ease | ✗ |  |  | — |
| `sds-btn-tilt` | sds-btnTilt | 3s | ease-in-out | ✓ |  |  | — |
| `sds-btn-volt` | sds-voltagePulse | 2.5s | ease | ✗ |  |  | --sds-primary, --sds-primary-glow |
| `sds-btn-warp` | sds-btnWarp | 2.6s | ease-in-out | ✓ |  |  | — |

### inputs (51)

| Class | Keyframes | Duration | Easing | CS | CH | PE | Custom props consumed |
|---|---|---|---|---|---|---|---|
| `sds-input-active-line` | sds-inputActiveLine | 1.8s | ease-in-out | ✗ |  |  | --sds-primary, --sds-primary-glow |
| `sds-input-aurora` | sds-inputAurora | 4s | ease-in-out | ✗ |  |  | — |
| `sds-input-bloom` | sds-inputBloom | 2.4s | ease-in-out | ✗ |  |  | — |
| `sds-input-border-beam` | sds-inputBorderBeam | 2s | linear | ✗ |  |  | --sds-primary-glow |
| `sds-input-burst` | sds-inputBurst | 1.8s | var(--sds-easing) | ✗ |  |  | --sds-easing, --sds-primary-glow |
| `sds-input-caret` | sds-caretTrail | 2s | ease | ✗ |  |  | --sds-primary-dim |
| `sds-input-charge` | sds-inputCharge | 2.2s | ease-in-out | ✗ |  |  | --sds-primary, --sds-primary-glow |
| `sds-input-comet` | sds-inputComet | 3s | linear | ✗ |  |  | --sds-primary-glow |
| `sds-input-crystal` | sds-inputCrystal | 2.4s | ease-in-out | ✗ |  |  | — |
| `sds-input-depth` | sds-inputDepth | 2.4s | ease-in-out | ✗ |  |  | — |
| `sds-input-echo` | sds-inputEcho | 2.4s | ease-out | ✗ |  |  | --sds-primary-glow |
| `sds-input-electric` | sds-inputElectric | 2s | ease | ✗ |  |  | --sds-primary, --sds-primary-glow |
| `sds-input-elevate-wrap` | — | — | — | ✓ |  |  | --sds-easing, --sds-primary |
| `sds-input-expand` | sds-inputExpand | 0.6s | var(--sds-easing) | ✗ |  |  | --sds-easing |
| `sds-input-fire` | sds-inputFire | 2s | ease-in-out | ✗ |  |  | — |
| `sds-input-flicker` | sds-inputFlicker | 4s | steps(1) | ✓ |  |  | — |
| `sds-input-flow` | sds-inputFlow | 3s | ease-in-out | ✗ |  |  | — |
| `sds-input-focus` | sds-focusField | 0.3s | ease | ✗ |  |  | --sds-primary-dim, --sds-primary-glow |
| `sds-input-focus-glow` | sds-focusField | 0.45s | ease | ✗ |  |  | --sds-primary-dim, --sds-primary-glow |
| `sds-input-frost` | sds-inputFrost | 2s | ease | ✓ |  |  | — |
| `sds-input-ghost` | sds-inputGhost | 3s | ease-in-out | ✗ |  |  | — |
| `sds-input-glitch-valid` | sds-inputGlitchValid | 0.4s | steps(1) | ✗ |  |  | --sds-primary, --sds-success |
| `sds-input-glow-border` | sds-inputGlowBorder | 2s | ease-in-out | ✗ |  |  | --sds-primary, --sds-primary-glow |
| `sds-input-gradient-border` | sds-inputGradBorder | 3s | linear | ✓ |  |  | --sds-accent, --sds-primary |
| `sds-input-gravity` | sds-inputGravity | 0.8s | cubic-bezier(0.68, -0.55, 0.27, 1.55) | ✓ |  |  | — |
| `sds-input-ink` | sds-inkStroke | 0.3s | ease | ✗ |  |  | — |
| `sds-input-kinetic` | sds-inputKinetic | 3s | ease-in-out | ✓ |  |  | — |
| `sds-input-laser` | sds-inputLaser | 1.5s | linear | ✗ |  |  | — |
| `sds-input-momentum` | sds-inputMomentum | 0.7s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-input-morph` | sds-borderMorph | 2.5s | ease | ✗ |  |  | — |
| `sds-input-morph-ph` | sds-morphPlaceholder | 2s | ease | ✗ |  | ✓ | — |
| `sds-input-neon` | sds-neonSign | 4s | ease | ✗ |  |  | --sds-primary-dim, --sds-primary-glow |
| `sds-input-neural` | sds-inputNeural | 3s | ease-in-out | ✗ |  |  | — |
| `sds-input-orbit` | sds-inputOrbit | 2s | linear | ✗ |  |  | — |
| `sds-input-plasma` | sds-plasmaGlow | 3s | ease | ✗ |  |  | --sds-primary-dim, --sds-primary-glow |
| `sds-input-prism` | sds-inputPrism | 4s | linear | ✗ |  |  | — |
| `sds-input-pulse-dot` | sds-inputPulseDot | 1.4s | ease-in-out | ✗ |  |  | --sds-primary, --sds-primary-glow |
| `sds-input-quantum` | sds-inputQuantum | 3s | steps(1) | ✗ |  |  | --sds-primary |
| `sds-input-radar` | sds-inputRadar | 2s | linear | ✗ |  |  | --sds-primary-glow |
| `sds-input-ring` | sds-magnetPulse | 2s | ease | ✗ |  |  | --sds-primary-glow |
| `sds-input-ripple` | sds-inputRipple | 2.4s | ease | ✗ |  |  | --sds-primary-glow |
| `sds-input-scan` | sds-inputScan | 2s | ease | ✗ |  |  | — |
| `sds-input-shake` | sds-seismicShake | 0.5s | ease | ✓ |  |  | — |
| `sds-input-shimmer` | sds-shimmerScan | 2.5s | ease | ✗ |  |  | — |
| `sds-input-solar` | sds-inputSolar | 2.8s | ease-in-out | ✗ |  |  | — |
| `sds-input-success` | sds-successGlow | 0.6s | ease | ✗ |  |  | --sds-success |
| `sds-input-unlock` | sds-inputUnlock | 0.8s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-input-void` | sds-inputVoid | 2.6s | ease-in-out | ✗ |  |  | — |
| `sds-input-voltage` | sds-voltagePulse | 2s | ease | ✗ |  |  | --sds-primary, --sds-primary-glow |
| `sds-input-waveform` | sds-inputWaveform | 1.6s | ease-in-out | ✗ |  |  | --sds-primary |
| `sds-input-zap` | sds-inputZap | 3s | ease | ✗ |  |  | --sds-primary, --sds-primary-glow |

### cards (49)

| Class | Keyframes | Duration | Easing | CS | CH | PE | Custom props consumed |
|---|---|---|---|---|---|---|---|
| `sds-card-aurora` | sds-cardAurora | 5s | ease-in-out | ✗ |  |  | — |
| `sds-card-bloom` | sds-cardBloom | 3s | ease-in-out | ✗ |  |  | — |
| `sds-card-breath` | sds-cardBreath | 3s | ease-in-out | ✗ |  |  | — |
| `sds-card-burst` | sds-cardBurst | 0.7s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-card-cascade` | sds-cardCascadeChild | 0.6s | var(--sds-easing) | ✓ | ✓ |  | --sds-easing |
| `sds-card-cinematic` | sds-cinematicReveal | var(--sds-duration) | var(--sds-easing) | ✓ |  |  | --sds-duration, --sds-easing |
| `sds-card-deep-float` | sds-cardDeepFloat | 4s | ease-in-out | ✗ |  |  | — |
| `sds-card-depth` | sds-parallaxDepth | 4s | ease | ✓ |  |  | — |
| `sds-card-drift` | sds-cardDrift | 5s | ease-in-out | ✓ |  |  | — |
| `sds-card-electric` | sds-cardElectric | 2.4s | ease | ✗ |  |  | --sds-primary, --sds-primary-glow |
| `sds-card-expand` | sds-cardExpand | 0.9s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-card-flip` | sds-sliceUp | 0.6s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-card-flip-reveal` | sds-cardFlipReveal | 0.8s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-card-float` | sds-ambientFloat | 3s | ease | ✗ |  |  | — |
| `sds-card-fold` | sds-cardFold | 0.8s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-card-force` | sds-cardForce | 2s | ease-in-out | ✗ |  |  | — |
| `sds-card-glass` | sds-cardGlass | 0.7s | ease | ✓ |  |  | — |
| `sds-card-glitch` | sds-cardGlitch | 4s | steps(1) | ✓ |  |  | — |
| `sds-card-glow` | sds-glowSurge | 2.5s | ease | ✗ |  |  | — |
| `sds-card-gravity` | sds-cardGravity | 0.8s | cubic-bezier(0.68, -0.55, 0.27, 1.55) | ✓ |  |  | — |
| `sds-card-holo` | sds-holographicTilt | 4s | ease | ✓ |  |  | — |
| `sds-card-ink` | sds-cardInk | 1s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-card-iris` | sds-cardIris | 0.8s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-card-levitate` | sds-cardLevitate | 3.5s | ease-in-out | ✗ |  |  | — |
| `sds-card-liquid-border` | sds-cardLiquidBorder | 4s | ease-in-out | ✗ |  |  | — |
| `sds-card-magnetic` | sds-magneticHover | 3s | ease | ✗ |  |  | — |
| `sds-card-momentum` | sds-cardMomentum | 0.85s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-card-morph` | sds-cardMorph | 3s | ease-in-out | ✗ |  |  | — |
| `sds-card-neon` | sds-glowSurge | 2.5s | ease | ✗ |  |  | — |
| `sds-card-neon-border` | sds-cardNeonBorder | 3s | ease-in-out | ✗ |  |  | --sds-primary-dim, --sds-primary-glow |
| `sds-card-parallax` | sds-parallaxDepth | 4s | ease | ✓ |  |  | — |
| `sds-card-portal` | sds-depthPortal | var(--sds-duration) | var(--sds-easing) | ✓ |  |  | --sds-duration, --sds-easing |
| `sds-card-prism` | sds-cardPrism | 5s | linear | ✓ |  |  | — |
| `sds-card-rise` | sds-cardRise | 0.8s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-card-rotate` | sds-cardRotate | 0.8s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-card-scan` | sds-cardScan | 0.9s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-card-shadow-lift` | sds-cardShadowLift | 2.8s | ease-in-out | ✗ |  |  | — |
| `sds-card-shimmer` | sds-refractionShimmer | 4s | ease | ✗ |  |  | — |
| `sds-card-slice` | sds-sliceUp | 0.6s | var(--sds-easing) | ✓ | ✓ |  | --sds-easing |
| `sds-card-smoke` | sds-cardSmoke | 1.1s | ease | ✓ |  |  | — |
| `sds-card-snap` | sds-cardSnap | 0.5s | cubic-bezier(0.68, -0.55, 0.27, 1.55) | ✓ |  |  | — |
| `sds-card-spotlight` | sds-cardSpotlight | 4s | ease | ✗ |  |  | — |
| `sds-card-spring` | sds-cardSpring | 0.9s | cubic-bezier(0.34, 1.56, 0.64, 1) | ✓ |  |  | — |
| `sds-card-stagger` | sds-cardStaggerChild | 0.5s | var(--sds-easing) | ✓ | ✓ |  | --sds-easing |
| `sds-card-tilt` | sds-cardTilt | 4s | ease-in-out | ✓ |  |  | — |
| `sds-card-unfold` | sds-cardUnfold | 0.8s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-card-vortex` | sds-cardVortex | 0.7s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-card-warp` | sds-warpGate | var(--sds-duration) | var(--sds-easing) | ✓ |  |  | --sds-duration, --sds-easing |
| `sds-card-wave` | sds-cardWave | 0.9s | var(--sds-easing) | ✓ |  |  | --sds-easing |

### loaders (51)

| Class | Keyframes | Duration | Easing | CS | CH | PE | Custom props consumed |
|---|---|---|---|---|---|---|---|
| `sds-loader-arc` | sds-cometSpin | 0.9s, 1.4s | linear | ✓ |  | ✓ | --sds-accent, --sds-primary |
| `sds-loader-bar` | sds-loaderBar | 1.8s | ease-in-out | ✗ |  | ✓ | --sds-primary, --sds-primary-dim |
| `sds-loader-bounce` | sds-loaderBounce | 0.8s | cubic-bezier(0.215, 0.61, 0.355, 1) | ✓ |  |  | --sds-primary |
| `sds-loader-breath` | sds-loaderBreath | 2s | ease-in-out | ✓ |  |  | --sds-primary |
| `sds-loader-cascade` | sds-loaderCascade | 1s | ease | ✗ | ✓ |  | --sds-primary |
| `sds-loader-clock` | sds-cometSpin | 2s, 24s | linear | ✓ |  | ✓ | --sds-accent, --sds-primary |
| `sds-loader-comet` | sds-cometSpin | 1s | linear | ✓ |  | ✓ | --sds-primary, --sds-primary-dim |
| `sds-loader-crystal` | sds-cometSpin, sds-loaderCrystal | 3s | linear; ease-in-out | ✓ |  |  | --sds-primary |
| `sds-loader-cube` | sds-loaderCube | 2s | ease-in-out | ✗ |  |  | --sds-primary |
| `sds-loader-data` | sds-loaderData | 1.4s | ease-in-out | ✓ |  | ✓ | --sds-primary, --sds-primary-dim |
| `sds-loader-dna` | sds-loaderDna | 1.4s | ease-in-out | ✗ |  | ✓ | --sds-accent, --sds-primary |
| `sds-loader-dots` | sds-particleSync | 1s | ease | ✓ | ✓ |  | --sds-primary |
| `sds-loader-electric` | sds-loaderElectric | 1.5s | ease | ✗ |  |  | --sds-primary, --sds-primary-glow |
| `sds-loader-expand` | sds-loaderExpand | 1.6s | ease-in-out | ✗ |  |  | --sds-primary |
| `sds-loader-fluid` | sds-fluidFlow | 2s | ease | ✗ |  |  | --sds-primary |
| `sds-loader-glitch` | sds-loaderGlitch | 2s | steps(1) | ✓ |  |  | --sds-primary |
| `sds-loader-grid` | sds-loaderGrid | 1.6s | ease-in-out | ✓ | ✓ |  | --sds-primary |
| `sds-loader-helix` | sds-loaderHelix | 1.2s | ease-in-out | ✓ | ✓ |  | --sds-accent, --sds-primary |
| `sds-loader-hex` | sds-cometSpin, sds-loaderHex | 2s | linear; ease-in-out | ✓ |  |  | --sds-primary |
| `sds-loader-hourglass` | sds-loaderHourglass | 1.8s | ease-in-out | ✓ |  |  | --sds-primary |
| `sds-loader-infinity` | sds-cometSpin | 1.2s | linear | ✓ |  | ✓ | --sds-primary |
| `sds-loader-liquid-ring` | sds-cometSpin, sds-loaderLiquidRing | 1s, 3s | linear; ease-in-out | ✓ |  |  | --sds-accent, --sds-primary |
| `sds-loader-matrix` | sds-loaderMatrix | 1.2s | steps(4) | ✗ | ✓ |  | --sds-primary |
| `sds-loader-morph` | sds-loaderMorph | 2.2s | ease-in-out | ✗ |  |  | --sds-accent, --sds-primary |
| `sds-loader-mosaic` | sds-loaderMosaic | 1.8s | ease-in-out | ✓ | ✓ |  | --sds-accent, --sds-primary |
| `sds-loader-neon-ring` | sds-cometSpin, sds-loaderNeonRing | 1s, 2s | linear; ease-in-out | ✗ |  |  | --sds-primary, --sds-primary-dim, --sds-primary-glow |
| `sds-loader-neural` | sds-loaderNeural | 3s | ease-in-out | ✗ |  |  | — |
| `sds-loader-orbit-3` | sds-orbitalA, sds-orbitalB | 1s, 1.4s | linear | ✓ |  | ✓ | --sds-accent, --sds-primary |
| `sds-loader-orbital` | sds-orbitalA, sds-orbitalB | 1.2s, 1.8s | linear | ✓ |  | ✓ | --sds-primary |
| `sds-loader-pendulum` | sds-loaderPendulum | 1.2s | ease-in-out | ✓ |  |  | --sds-primary |
| `sds-loader-ping` | sds-pingCascade | 2s | ease | ✓ | ✓ | ✓ | --sds-primary |
| `sds-loader-plasma-ring` | sds-cometSpin, sds-loaderPlasmaRing | 1.6s, 2.4s | linear; ease-in-out | ✗ |  |  | --sds-primary, --sds-primary-dim, --sds-primary-glow |
| `sds-loader-prism` | sds-cometSpin | 2s | linear | ✓ |  |  | --sds-accent, --sds-primary |
| `sds-loader-progress` | sds-progressGlow | 2s | ease | ✗ |  | ✓ | --sds-primary, --sds-primary-dim, --sds-primary-glow |
| `sds-loader-progress-glow` | sds-progressGlow | 2.4s | ease | ✗ |  |  | --sds-primary-glow |
| `sds-loader-pulse` | sds-loaderPulse | 1s | ease-in-out | ✓ |  |  | --sds-primary |
| `sds-loader-quantum` | sds-loaderQuantum | 1.6s | steps(1) | ✓ |  |  | --sds-primary |
| `sds-loader-radar` | sds-cometSpin | 2s | linear | ✓ |  | ✓ | --sds-primary |
| `sds-loader-ring` | sds-cometSpin | 1s, 1.6s | linear | ✓ |  | ✓ | --sds-accent, --sds-primary |
| `sds-loader-ripple` | sds-loaderRipple | 2s | ease-out | ✓ |  | ✓ | --sds-primary |
| `sds-loader-signal` | sds-loaderSignal | 1.2s | ease-in-out | ✓ | ✓ |  | --sds-primary |
| `sds-loader-skeleton` | sds-skeletonPulse | 1.6s | ease | ✗ |  |  | --sds-primary-dim |
| `sds-loader-snake` | sds-cometSpin | 1.2s | cubic-bezier(0.68, -0.55, 0.27, 1.55) | ✓ |  | ✓ | --sds-primary, --sds-primary-dim |
| `sds-loader-solar` | sds-loaderSolar, sds-cometSpin | 2s, 3s | ease-in-out; linear | ✗ |  | ✓ | --sds-primary, --sds-primary-glow |
| `sds-loader-spark` | sds-loaderSpark, sds-loaderPulse | 1.8s | ease-in-out | ✗ |  | ✓ | --sds-primary, --sds-primary-glow |
| `sds-loader-star` | sds-cometSpin, sds-loaderStar | 2s | linear; ease-in-out | ✓ |  |  | --sds-primary |
| `sds-loader-target` | sds-cometSpin | 4s | linear | ✓ |  | ✓ | — |
| `sds-loader-type` | sds-typewriterPrem, sds-cursorBlink | 2s, 0.8s | steps(10); step-end | ✗ |  |  | --sds-primary |
| `sds-loader-vortex` | sds-vortexSpin | 1.6s | ease | ✓ |  |  | --sds-accent, --sds-primary |
| `sds-loader-warp` | sds-cometSpin, sds-loaderWarp | 1.2s, 2s | linear; ease-in-out | ✓ |  |  | --sds-primary, --sds-primary-dim |
| `sds-loader-wave` | sds-waveBar | 0.9s | ease | ✓ | ✓ |  | --sds-primary |

### scroll (55)

| Class | Keyframes | Duration | Easing | CS | CH | PE | Custom props consumed |
|---|---|---|---|---|---|---|---|
| `sds-scroll-auto` | — | — | — | ✓ |  |  | — |
| `sds-scroll-blur` | sds-blurAscend | 0.8s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-scroll-bounce` | sds-scrollBounce | 0.9s | cubic-bezier(0.215, 0.61, 0.355, 1) | ✓ |  |  | — |
| `sds-scroll-cascade` | sds-scrollCascadeChild | 0.6s | var(--sds-easing) | ✓ | ✓ |  | --sds-easing |
| `sds-scroll-charge` | sds-scrollCharge | 0.8s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-scroll-cinema` | sds-scrollCinema | 1.2s | var(--sds-easing) | ✗ |  |  | --sds-easing |
| `sds-scroll-clip-left` | sds-scrollClipLeft | 0.8s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-scroll-clip-right` | sds-scrollClipRight | 0.8s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-scroll-crystallize` | sds-scrollCrystallize | 1s | ease | ✓ |  |  | — |
| `sds-scroll-curtain` | sds-curtainLift | 0.8s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-scroll-depth` | sds-depthPortal | 0.9s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-scroll-dissolve` | sds-scrollDissolve | 1s | ease | ✓ |  |  | — |
| `sds-scroll-drift` | sds-scrollDrift | 1.2s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-scroll-elastic` | sds-scrollElastic | 1s | cubic-bezier(0.34, 1.56, 0.64, 1) | ✓ |  |  | — |
| `sds-scroll-elastic-pop` | sds-scrollElasticPop | 0.7s | cubic-bezier(0.34, 1.56, 0.64, 1) | ✓ |  |  | — |
| `sds-scroll-fade-up` | sds-viewportRise | 0.8s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-scroll-flash` | sds-scrollFlash | 0.7s | ease | ✓ |  |  | — |
| `sds-scroll-flip` | sds-scrollFlip | 0.8s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-scroll-fog` | sds-scrollFog | 1.2s | ease | ✓ |  |  | — |
| `sds-scroll-glitch` | sds-staticBurst, sds-viewportRise | 0.6s, 0.8s | steps(1); var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-scroll-gravity` | sds-gravityDrop | 0.8s | cubic-bezier(0.68, -0.55, 0.27, 1.55) | ✓ |  |  | — |
| `sds-scroll-hologram` | sds-scrollHologram | 1s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-scroll-ink` | sds-scrollInk | 1s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-scroll-liquid` | sds-liquidRise | 0.8s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-scroll-magnetic` | sds-scrollMagnetic | 0.9s | cubic-bezier(0.16, 1, 0.3, 1) | ✓ |  |  | — |
| `sds-scroll-morph` | sds-scrollMorph | 0.9s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-scroll-neon` | sds-scrollNeon | 1s | var(--sds-easing) | ✗ |  |  | --sds-easing, --sds-primary, --sds-primary-dim, --sds-primary-glow |
| `sds-scroll-orbit` | sds-perspSwing | 0.8s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-scroll-perspective-left` | sds-scrollPerspLeft | 0.8s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-scroll-phantom` | sds-phantomBlur | 0.8s | ease | ✓ |  |  | — |
| `sds-scroll-prism` | sds-scrollPrism | 1s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-scroll-punch` | sds-scrollPunch | 0.6s | cubic-bezier(0.25, 0.46, 0.45, 0.94) | ✓ |  |  | — |
| `sds-scroll-radial` | sds-radialExpand | 0.9s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-scroll-rise` | sds-viewportRise | 0.8s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-scroll-scale` | sds-scaleReveal | 0.8s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-scroll-scan` | sds-scanLine | 0.8s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-scroll-shatter` | sds-shatterIn | 0.8s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-scroll-skew` | sds-scrollSkew | 0.8s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-scroll-slide` | sds-momentumSlide | 0.8s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-scroll-slide-right` | sds-scrollSlideRight | 0.8s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-scroll-snap` | sds-scrollSnap | 0.5s | cubic-bezier(0.68, -0.55, 0.27, 1.55) | ✓ |  |  | — |
| `sds-scroll-spiral` | sds-scrollSpiral | 0.9s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-scroll-split` | sds-scrollSplit | 0.9s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-scroll-spring` | sds-scrollSpring | 0.9s | cubic-bezier(0.34, 1.56, 0.64, 1) | ✓ |  |  | — |
| `sds-scroll-stagger-grid` | sds-viewportRise | 0.6s | var(--sds-easing) | ✓ | ✓ |  | --sds-easing |
| `sds-scroll-stagger-pop` | sds-staggerPop | 0.7s | var(--sds-easing) | ✓ | ✓ |  | --sds-easing |
| `sds-scroll-streak` | sds-scrollStreak | 0.7s | cubic-bezier(0.16, 1, 0.3, 1) | ✓ |  |  | — |
| `sds-scroll-tilt` | sds-tiltReveal | 0.8s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-scroll-unfold` | sds-scrollUnfold | 0.8s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-scroll-velvet` | sds-velvetDrop | 0.8s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-scroll-vortex` | sds-scrollVortex | 0.8s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-scroll-warp` | sds-scrollWarp | 0.9s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-scroll-warp-in` | sds-scrollWarpIn | 0.9s | var(--sds-easing) | ✓ |  |  | --sds-easing |
| `sds-scroll-wave-rise` | sds-viewportRise | 0.7s | var(--sds-easing) | ✓ | ✓ |  | --sds-easing |
| `sds-scroll-zoom-blur` | sds-scrollZoomBlur | 0.9s | var(--sds-easing) | ✓ |  |  | --sds-easing |

### interactive (7)

| Class | Keyframes | Duration | Easing | CS | CH | PE | Custom props consumed |
|---|---|---|---|---|---|---|---|
| `sds-jelly-hover` | — | — | — | ✓ |  |  | — |
| `sds-magnetic-pull` | — | — | — | ✓ | ✓ |  | — |
| `sds-repulsion-field` | — | — | — | ✓ | ✓ |  | — |
| `sds-scatter-return` | — | — | — | ✓ | ✓ |  | — |
| `sds-shockwave` | — | — | — | ✓ | ✓ |  | — |
| `sds-spring-kerning` | — | — | — | ✓ |  |  | — |
| `sds-word-morph` | — | — | — | ✓ |  |  | — |

### modifiers (18)

| Class | Keyframes | Duration | Easing | CS | CH | PE | Custom props consumed |
|---|---|---|---|---|---|---|---|
| `sds-alt` | — | — | — | ✓ | ✓ |  | — |
| `sds-delay-1` | — | — | — | ✓ |  |  | — |
| `sds-delay-10` | — | — | — | ✓ |  |  | — |
| `sds-delay-2` | — | — | — | ✓ |  |  | — |
| `sds-delay-3` | — | — | — | ✓ |  |  | — |
| `sds-delay-4` | — | — | — | ✓ |  |  | — |
| `sds-delay-5` | — | — | — | ✓ |  |  | — |
| `sds-delay-6` | — | — | — | ✓ |  |  | — |
| `sds-delay-8` | — | — | — | ✓ |  |  | — |
| `sds-fast` | — | — | — | ✓ |  |  | — |
| `sds-fill-both` | — | — | — | ✓ |  |  | — |
| `sds-fill-forward` | — | — | — | ✓ |  |  | — |
| `sds-loop` | — | — | — | ✓ | ✓ |  | — |
| `sds-normal` | — | — | — | ✓ |  |  | — |
| `sds-once` | — | — | — | ✓ |  |  | — |
| `sds-pause-hover` | — | — | — | ✓ |  | ✓ | — |
| `sds-slow` | — | — | — | ✓ |  |  | — |
| `sds-xslow` | — | — | — | ✓ |  |  | — |

### infrastructure (3)

| Class | Keyframes | Duration | Easing | CS | CH | PE | Custom props consumed |
|---|---|---|---|---|---|---|---|
| `sds-in` | — | — | — | ✓ |  |  | — |
| `sds-js` | — | — | — | ✓ |  |  | — |
| `sds-play` | — | — | — | ✓ |  |  | — |

## Known anomalies (pre-existing in published 4.0.3 — preserved, not fixed silently)

1. **`sds-charOrbitBob` keyframes are referenced by `.sds-char-orbit .sds-char` but never defined.** The per-char bob does nothing in the published build; only the parent entrance (`sds-charOrbit`) animates. Fixing this changes visible behavior → requires explicit approval (logged for the compatibility report).
2. **`.sds-ink-bleed` is declared twice** (Section 1 and the v4 interactive base block at file end). The later declaration wins: `1.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)` instead of `var(--sds-duration) cubic-bezier(0.16, 1, 0.3, 1)`. The cascade result is the published contract; both declarations must be preserved in order.
3. **`@keyframes sds-jellyKf` exists in CSS but is also injected at runtime** by `motion-interactive.js` (`#__sds-jelly-kf` style tag). Harmless duplication; both must stay.
4. **`index.d.ts` unions name a few classes that do not exist as CSS selectors** (e.g. `sds-reveal-up`/`sds-reveal-down` vs actual `.sds-reveal-up-mask`/`.sds-reveal-down-mask`, `sds-bounce-drop` vs `.sds-bounce-drop-in`, `sds-zoom-far` vs `.sds-zoom-out-in`, `sds-spotlight-text` vs `.sds-spotlight`). Type-level only; types are advisory. Registry must record CSS truth and may add aliases later via RFC.
5. **Extra undocumented classes** beyond README counts: `sds-bounce-loop`, `sds-drop-bounce`, `sds-pendulum`, `sds-vibrate`, `sds-char-orbit` (v4 interactive base rules). They are published API and are inventoried above.
6. **`docs/index.html` embeds an inline copy of text-animation CSS and the interactive engine** — the docs page can diverge from the package. Phase 4 replaces this with single-artifact loading.
