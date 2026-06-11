/**
 * SDS Motion Forge — TypeScript Declarations
 * @packageDocumentation
 *
 * Usage in TypeScript projects:
 *
 * ```ts
 * import '@salkomdesignstudio/sds-motion-forge/dist/motion.min.css';
 * ```
 *
 * For bundlers that require explicit CSS module declarations
 * (e.g. Vite with `moduleResolution: bundler`), this file
 * marks the CSS import as a valid side-effect module.
 */

/** CSS module declaration — the import has side effects (injects styles). */
declare module '@salkomdesignstudio/sds-motion-forge/dist/motion.css' {}
declare module '@salkomdesignstudio/sds-motion-forge/dist/motion.min.css' {}
declare module '@salkomdesignstudio/sds-motion-forge/motion.css' {}
declare module '@salkomdesignstudio/sds-motion-forge/motion.min.css' {}
declare module '@salkomdesignstudio/sds-motion-forge' {}

/** Per-category standalone bundles (v5) — each includes core (tokens, modifiers, reduced-motion). */
declare module '@salkomdesignstudio/sds-motion-forge/categories/core' {}
declare module '@salkomdesignstudio/sds-motion-forge/categories/text' {}
declare module '@salkomdesignstudio/sds-motion-forge/categories/buttons' {}
declare module '@salkomdesignstudio/sds-motion-forge/categories/inputs' {}
declare module '@salkomdesignstudio/sds-motion-forge/categories/cards' {}
declare module '@salkomdesignstudio/sds-motion-forge/categories/loaders' {}
declare module '@salkomdesignstudio/sds-motion-forge/categories/scroll' {}
declare module '@salkomdesignstudio/sds-motion-forge/dist/categories/core.css' {}
declare module '@salkomdesignstudio/sds-motion-forge/dist/categories/core.min.css' {}
declare module '@salkomdesignstudio/sds-motion-forge/dist/categories/text.css' {}
declare module '@salkomdesignstudio/sds-motion-forge/dist/categories/text.min.css' {}
declare module '@salkomdesignstudio/sds-motion-forge/dist/categories/buttons.css' {}
declare module '@salkomdesignstudio/sds-motion-forge/dist/categories/buttons.min.css' {}
declare module '@salkomdesignstudio/sds-motion-forge/dist/categories/inputs.css' {}
declare module '@salkomdesignstudio/sds-motion-forge/dist/categories/inputs.min.css' {}
declare module '@salkomdesignstudio/sds-motion-forge/dist/categories/cards.css' {}
declare module '@salkomdesignstudio/sds-motion-forge/dist/categories/cards.min.css' {}
declare module '@salkomdesignstudio/sds-motion-forge/dist/categories/loaders.css' {}
declare module '@salkomdesignstudio/sds-motion-forge/dist/categories/loaders.min.css' {}
declare module '@salkomdesignstudio/sds-motion-forge/dist/categories/scroll.css' {}
declare module '@salkomdesignstudio/sds-motion-forge/dist/categories/scroll.min.css' {}

/**
 * All 100 text animation class names.
 * Apply to any inline or block text element.
 *
 * Some classes require `.sds-char` child spans with `--i` index variable
 * (use the splitter in motion-interactive.min.js or build them manually):
 *   sds-center-burst, sds-drop-settle, sds-explode-formation,
 *   sds-gravity-bounce, sds-kinetic-wave, sds-signal-wave,
 *   sds-arc-orbit, sds-stagger-chars, sds-wave-cascade
 */
export type SdsTextAnimation =
  | 'sds-arc-orbit'
  | 'sds-aurora-text'
  | 'sds-blur-focus'
  | 'sds-bounce-drop'
  | 'sds-bounce-in-up'
  | 'sds-center-burst'
  | 'sds-char-orbit'
  | 'sds-chromatic-shift'
  | 'sds-cinema-title'
  | 'sds-cipher-reveal'
  | 'sds-color-cycle'
  | 'sds-data-stream'
  | 'sds-depth-charge'
  | 'sds-depth-warp'
  | 'sds-door-open'
  | 'sds-drop-settle'
  | 'sds-echo-out'
  | 'sds-elastic-bounce'
  | 'sds-elastic-stamp'
  | 'sds-explode-formation'
  | 'sds-film-burn'
  | 'sds-flicker-on'
  | 'sds-flip-x'
  | 'sds-flip-y'
  | 'sds-float-bob'
  | 'sds-focus-pull'
  | 'sds-fold-down'
  | 'sds-fold-up'
  | 'sds-glitch-flicker'
  | 'sds-glitch-slide'
  | 'sds-glow-pulse'
  | 'sds-gradient-sweep'
  | 'sds-grand-entrance'
  | 'sds-gravity-bounce'
  | 'sds-gravity-drop'
  | 'sds-heartbeat-text'
  | 'sds-heat-shimmer'
  | 'sds-highlight-burn'
  | 'sds-hologram-text'
  | 'sds-ink-bleed'
  | 'sds-iris-open'
  | 'sds-jello'
  | 'sds-kinetic-wave'
  | 'sds-levitate'
  | 'sds-light-speed'
  | 'sds-liquid-rise'
  | 'sds-magnetic-drift'
  | 'sds-morph-word'
  | 'sds-neon-flare'
  | 'sds-neon-flicker-in'
  | 'sds-neon-pulse-text'
  | 'sds-oscillate'
  | 'sds-perspective-swing'
  | 'sds-phantom-blur'
  | 'sds-pixel-in'
  | 'sds-pop-in'
  | 'sds-prism-split'
  | 'sds-refract'
  | 'sds-reveal-down'
  | 'sds-reveal-up'
  | 'sds-ripple-text'
  | 'sds-roll-in'
  | 'sds-rubber-band'
  | 'sds-scramble-decode'
  | 'sds-shadow-lift'
  | 'sds-shatter-in'
  | 'sds-shimmer-sweep'
  | 'sds-signal-wave'
  | 'sds-skew-slide'
  | 'sds-slant-rise'
  | 'sds-slice-reveal'
  | 'sds-slide-blur-left'
  | 'sds-slide-blur-right'
  | 'sds-smoke-reveal'
  | 'sds-split-reveal'
  | 'sds-spotlight-text'
  | 'sds-squash-stretch'
  | 'sds-stagger-chars'
  | 'sds-static-burst'
  | 'sds-streak-in'
  | 'sds-strike-through'
  | 'sds-swing-in'
  | 'sds-tada'
  | 'sds-tracking-contract'
  | 'sds-tracking-expand'
  | 'sds-typewriter-pro'
  | 'sds-typing-caret'
  | 'sds-underline-grow'
  | 'sds-unfurl'
  | 'sds-vapor-rise'
  | 'sds-velocity-blur-text'
  | 'sds-velvet-drop'
  | 'sds-wave-cascade'
  | 'sds-weight-drop'
  | 'sds-wipe-left'
  | 'sds-wipe-right'
  | 'sds-wobble'
  | 'sds-word-blur-in'
  | 'sds-zoom-far'
  | 'sds-zoom-punch';

/** All 50 button animation class names. Apply to `<button>` elements. */
export type SdsButtonAnimation =
  | 'sds-btn-amp'
  | 'sds-btn-aurora'
  | 'sds-btn-border-flow'
  | 'sds-btn-bounce'
  | 'sds-btn-burst'
  | 'sds-btn-charge'
  | 'sds-btn-crystal'
  | 'sds-btn-depth-press'
  | 'sds-btn-dissolve'
  | 'sds-btn-edge'
  | 'sds-btn-energy'
  | 'sds-btn-fire'
  | 'sds-btn-flare'
  | 'sds-btn-float'
  | 'sds-btn-flux'
  | 'sds-btn-glow-core'
  | 'sds-btn-glow-surge'
  | 'sds-btn-gradient-shift'
  | 'sds-btn-gravity'
  | 'sds-btn-gravity-pull'
  | 'sds-btn-heartbeat'
  | 'sds-btn-hologram'
  | 'sds-btn-ice'
  | 'sds-btn-kinetic'
  | 'sds-btn-lift'
  | 'sds-btn-liquid'
  | 'sds-btn-magnetic'
  | 'sds-btn-magnetic-trail'
  | 'sds-btn-momentum'
  | 'sds-btn-morph'
  | 'sds-btn-neon'
  | 'sds-btn-neon-trace'
  | 'sds-btn-outline-grow'
  | 'sds-btn-plasma'
  | 'sds-btn-press'
  | 'sds-btn-pulse-border'
  | 'sds-btn-quantum'
  | 'sds-btn-radar'
  | 'sds-btn-recoil'
  | 'sds-btn-ripple'
  | 'sds-btn-rotate'
  | 'sds-btn-scan'
  | 'sds-btn-shimmer'
  | 'sds-btn-shock'
  | 'sds-btn-split'
  | 'sds-btn-stretch'
  | 'sds-btn-swipe'
  | 'sds-btn-tilt'
  | 'sds-btn-volt'
  | 'sds-btn-warp';

/**
 * All 51 input animation class names. Apply to `<input>` or wrapper elements.
 *
 * `sds-input-elevate-wrap` must wrap a `<label>` and `<input>` to work correctly.
 */
export type SdsInputAnimation =
  | 'sds-input-active-line'
  | 'sds-input-aurora'
  | 'sds-input-bloom'
  | 'sds-input-border-beam'
  | 'sds-input-burst'
  | 'sds-input-caret'
  | 'sds-input-charge'
  | 'sds-input-comet'
  | 'sds-input-crystal'
  | 'sds-input-depth'
  | 'sds-input-echo'
  | 'sds-input-electric'
  | 'sds-input-elevate-wrap'
  | 'sds-input-expand'
  | 'sds-input-fire'
  | 'sds-input-flicker'
  | 'sds-input-flow'
  | 'sds-input-focus'
  | 'sds-input-focus-glow'
  | 'sds-input-frost'
  | 'sds-input-ghost'
  | 'sds-input-glitch-valid'
  | 'sds-input-glow-border'
  | 'sds-input-gradient-border'
  | 'sds-input-gravity'
  | 'sds-input-ink'
  | 'sds-input-kinetic'
  | 'sds-input-laser'
  | 'sds-input-momentum'
  | 'sds-input-morph'
  | 'sds-input-morph-ph'
  | 'sds-input-neon'
  | 'sds-input-neural'
  | 'sds-input-orbit'
  | 'sds-input-plasma'
  | 'sds-input-prism'
  | 'sds-input-pulse-dot'
  | 'sds-input-quantum'
  | 'sds-input-radar'
  | 'sds-input-ring'
  | 'sds-input-ripple'
  | 'sds-input-scan'
  | 'sds-input-shake'
  | 'sds-input-shimmer'
  | 'sds-input-solar'
  | 'sds-input-success'
  | 'sds-input-unlock'
  | 'sds-input-void'
  | 'sds-input-voltage'
  | 'sds-input-waveform'
  | 'sds-input-zap';

/**
 * All 49 card animation class names. Apply to card container elements.
 *
 * Some classes animate direct children (`> *`) and require child elements:
 *   sds-card-cascade, sds-card-slice, sds-card-stagger
 */
export type SdsCardAnimation =
  | 'sds-card-aurora'
  | 'sds-card-bloom'
  | 'sds-card-breath'
  | 'sds-card-burst'
  | 'sds-card-cascade'
  | 'sds-card-cinematic'
  | 'sds-card-deep-float'
  | 'sds-card-depth'
  | 'sds-card-drift'
  | 'sds-card-electric'
  | 'sds-card-expand'
  | 'sds-card-flip'
  | 'sds-card-flip-reveal'
  | 'sds-card-float'
  | 'sds-card-fold'
  | 'sds-card-force'
  | 'sds-card-glass'
  | 'sds-card-glitch'
  | 'sds-card-glow'
  | 'sds-card-gravity'
  | 'sds-card-holo'
  | 'sds-card-ink'
  | 'sds-card-iris'
  | 'sds-card-levitate'
  | 'sds-card-liquid-border'
  | 'sds-card-magnetic'
  | 'sds-card-momentum'
  | 'sds-card-morph'
  | 'sds-card-neon'
  | 'sds-card-neon-border'
  | 'sds-card-parallax'
  | 'sds-card-portal'
  | 'sds-card-prism'
  | 'sds-card-rise'
  | 'sds-card-rotate'
  | 'sds-card-scan'
  | 'sds-card-shadow-lift'
  | 'sds-card-shimmer'
  | 'sds-card-slice'
  | 'sds-card-smoke'
  | 'sds-card-snap'
  | 'sds-card-spotlight'
  | 'sds-card-spring'
  | 'sds-card-stagger'
  | 'sds-card-tilt'
  | 'sds-card-unfold'
  | 'sds-card-vortex'
  | 'sds-card-warp'
  | 'sds-card-wave';

/**
 * All 51 loader animation class names. Apply to an empty `<span>` element.
 *
 * Some classes animate direct children and require child elements:
 *   sds-loader-cascade, sds-loader-dots, sds-loader-grid,
 *   sds-loader-signal, sds-loader-wave
 */
export type SdsLoaderAnimation =
  | 'sds-loader-arc'
  | 'sds-loader-bar'
  | 'sds-loader-bounce'
  | 'sds-loader-breath'
  | 'sds-loader-cascade'
  | 'sds-loader-clock'
  | 'sds-loader-comet'
  | 'sds-loader-crystal'
  | 'sds-loader-cube'
  | 'sds-loader-data'
  | 'sds-loader-dna'
  | 'sds-loader-dots'
  | 'sds-loader-electric'
  | 'sds-loader-expand'
  | 'sds-loader-fluid'
  | 'sds-loader-glitch'
  | 'sds-loader-grid'
  | 'sds-loader-helix'
  | 'sds-loader-hex'
  | 'sds-loader-hourglass'
  | 'sds-loader-infinity'
  | 'sds-loader-liquid-ring'
  | 'sds-loader-matrix'
  | 'sds-loader-morph'
  | 'sds-loader-mosaic'
  | 'sds-loader-neon-ring'
  | 'sds-loader-neural'
  | 'sds-loader-orbit-3'
  | 'sds-loader-orbital'
  | 'sds-loader-pendulum'
  | 'sds-loader-ping'
  | 'sds-loader-plasma-ring'
  | 'sds-loader-prism'
  | 'sds-loader-progress'
  | 'sds-loader-progress-glow'
  | 'sds-loader-pulse'
  | 'sds-loader-quantum'
  | 'sds-loader-radar'
  | 'sds-loader-ring'
  | 'sds-loader-ripple'
  | 'sds-loader-signal'
  | 'sds-loader-skeleton'
  | 'sds-loader-snake'
  | 'sds-loader-solar'
  | 'sds-loader-spark'
  | 'sds-loader-star'
  | 'sds-loader-target'
  | 'sds-loader-type'
  | 'sds-loader-vortex'
  | 'sds-loader-warp'
  | 'sds-loader-wave';

/**
 * All 54 scroll-triggered animation class names.
 *
 * Scroll animations fire immediately when the class is applied.
 * To gate them on viewport entry, use one of:
 *   - `data-sds-scroll` attribute + add `sds-in` class via IntersectionObserver
 *   - `data-sds` attribute + load `sds-scroll.min.js` (adds `sds-play` class)
 *   - `sds-scroll-auto` modifier (CSS scroll-driven, Chrome 115+, zero JS)
 *
 * Some classes animate direct children and require child elements:
 *   sds-scroll-stagger-pop, sds-scroll-stagger-grid, sds-scroll-cascade
 */
export type SdsScrollAnimation =
  | 'sds-scroll-blur'
  | 'sds-scroll-bounce'
  | 'sds-scroll-cascade'
  | 'sds-scroll-charge'
  | 'sds-scroll-cinema'
  | 'sds-scroll-clip-left'
  | 'sds-scroll-clip-right'
  | 'sds-scroll-crystallize'
  | 'sds-scroll-curtain'
  | 'sds-scroll-depth'
  | 'sds-scroll-dissolve'
  | 'sds-scroll-drift'
  | 'sds-scroll-elastic'
  | 'sds-scroll-elastic-pop'
  | 'sds-scroll-fade-up'
  | 'sds-scroll-flash'
  | 'sds-scroll-flip'
  | 'sds-scroll-fog'
  | 'sds-scroll-glitch'
  | 'sds-scroll-gravity'
  | 'sds-scroll-hologram'
  | 'sds-scroll-ink'
  | 'sds-scroll-liquid'
  | 'sds-scroll-magnetic'
  | 'sds-scroll-morph'
  | 'sds-scroll-neon'
  | 'sds-scroll-orbit'
  | 'sds-scroll-perspective-left'
  | 'sds-scroll-phantom'
  | 'sds-scroll-prism'
  | 'sds-scroll-punch'
  | 'sds-scroll-radial'
  | 'sds-scroll-rise'
  | 'sds-scroll-scale'
  | 'sds-scroll-scan'
  | 'sds-scroll-shatter'
  | 'sds-scroll-skew'
  | 'sds-scroll-slide'
  | 'sds-scroll-slide-right'
  | 'sds-scroll-snap'
  | 'sds-scroll-spiral'
  | 'sds-scroll-split'
  | 'sds-scroll-spring'
  | 'sds-scroll-stagger-grid'
  | 'sds-scroll-stagger-pop'
  | 'sds-scroll-streak'
  | 'sds-scroll-tilt'
  | 'sds-scroll-unfold'
  | 'sds-scroll-velvet'
  | 'sds-scroll-vortex'
  | 'sds-scroll-warp'
  | 'sds-scroll-warp-in'
  | 'sds-scroll-wave-rise'
  | 'sds-scroll-zoom-blur';

/**
 * JS-powered interactive animation class names.
 * Requires `motion-interactive.min.js` (loaded with `defer`).
 *
 * `sds-word-morph` requires `data-words="Word1,Word2,Word3"` attribute.
 * `sds-magnetic-pull` and `sds-repulsion-field` accept optional
 * `data-sds-radius="N"` (pixels, default 110).
 */
export type SdsInteractiveAnimation =
  | 'sds-jelly-hover'
  | 'sds-magnetic-pull'
  | 'sds-repulsion-field'
  | 'sds-scatter-return'
  | 'sds-shockwave'
  | 'sds-spring-kerning'
  | 'sds-word-morph';

/**
 * Timing and playback modifier class names.
 * Stack on any animation class.
 *
 * Note: sds-delay-7 and sds-delay-9 do not exist; the sequence
 * jumps 6 → 8 → 10 to match the 0.6s, 0.8s, 1.0s timing steps.
 */
export type SdsModifier =
  | 'sds-alt'
  | 'sds-delay-1'
  | 'sds-delay-2'
  | 'sds-delay-3'
  | 'sds-delay-4'
  | 'sds-delay-5'
  | 'sds-delay-6'
  | 'sds-delay-8'
  | 'sds-delay-10'
  | 'sds-fast'
  | 'sds-fill-both'
  | 'sds-fill-forward'
  | 'sds-loop'
  | 'sds-normal'
  | 'sds-once'
  | 'sds-pause-hover'
  | 'sds-slow'
  | 'sds-xslow';

/**
 * Scroll-gate activation class names (added programmatically or via CSS).
 *
 * - `sds-play`: added by `sds-scroll.min.js` when `[data-sds]` element enters viewport.
 * - `sds-scroll-auto`: add to a scroll animation class to use CSS scroll-driven
 *   animations (Chrome 115+, zero JS required).
 */
export type SdsScrollGate = 'sds-play' | 'sds-scroll-auto';

/** Union of every public SDS Motion Forge class name. */
export type SdsAnimationClass =
  | SdsTextAnimation
  | SdsButtonAnimation
  | SdsInputAnimation
  | SdsCardAnimation
  | SdsLoaderAnimation
  | SdsScrollAnimation
  | SdsInteractiveAnimation
  | SdsModifier
  | SdsScrollGate;

/* ────────────────────────────────────────────────────────────────
   v5 Motion Token Scale (Phase 0)
   Source of truth: tokens/motion.tokens.json (W3C Design Tokens).
   CSS custom properties: --sds-duration-{token}, --sds-ease-{token},
   --sds-distance-{token}. See SPEC.md for the selection matrix.
   ──────────────────────────────────────────────────────────────── */

/** Duration token names. CSS: `--sds-duration-{token}` (instant=0.3s, fast=0.4s, base=0.8s, slow=1.4s, slower=2.2s, dramatic=3s). */
export type SdsDurationToken =
  | 'instant'
  | 'fast'
  | 'base'
  | 'slow'
  | 'slower'
  | 'dramatic';

/** Easing token names. CSS: `--sds-ease-{token}`. */
export type SdsEasingToken =
  | 'standard'
  | 'decelerate'
  | 'accelerate'
  | 'emphasized'
  | 'spring'
  | 'bounce';

/** Entrance-distance token names. CSS: `--sds-distance-{token}` (sm=24px, md=48px, lg=80px). */
export type SdsDistanceToken = 'sm' | 'md' | 'lg';
