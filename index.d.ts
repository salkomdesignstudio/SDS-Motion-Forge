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

/**
 * All animation class names exported as a typed union.
 * Useful for autocomplete in className builders.
 */
export type SdsTextAnimation =
  | 'sds-velvet-drop'
  | 'sds-liquid-rise'
  | 'sds-refract'
  | 'sds-phantom-blur'
  | 'sds-gravity-drop'
  | 'sds-static-burst'
  | 'sds-elastic-stamp'
  | 'sds-slice-reveal'
  | 'sds-char-orbit'
  | 'sds-ink-bleed'
  | 'sds-neon-flare'
  | 'sds-scramble-decode'
  | 'sds-kinetic-wave'
  | 'sds-perspective-swing'
  | 'sds-focus-pull'
  | 'sds-gradient-sweep'
  | 'sds-depth-warp'
  | 'sds-typewriter-pro'
  | 'sds-highlight-burn'
  | 'sds-shatter-in'
  | 'sds-film-burn'
  | 'sds-prism-split'
  | 'sds-weight-drop'
  | 'sds-smoke-reveal'
  | 'sds-arc-orbit'
  | 'sds-depth-charge'
  | 'sds-signal-wave'
  | 'sds-glitch-flicker'
  | 'sds-velocity-blur-text'
  | 'sds-neon-pulse-text';

export type SdsButtonAnimation =
  | 'sds-btn-magnetic'
  | 'sds-btn-liquid'
  | 'sds-btn-energy'
  | 'sds-btn-press'
  | 'sds-btn-edge'
  | 'sds-btn-plasma'
  | 'sds-btn-morph'
  | 'sds-btn-lift'
  | 'sds-btn-shock'
  | 'sds-btn-neon'
  | 'sds-btn-volt'
  | 'sds-btn-glow-surge'
  | 'sds-btn-quantum';

export type SdsInputAnimation =
  | 'sds-input-focus'
  | 'sds-input-focus-glow'
  | 'sds-input-morph'
  | 'sds-input-shimmer'
  | 'sds-input-voltage'
  | 'sds-input-shake'
  | 'sds-input-success'
  | 'sds-input-caret'
  | 'sds-input-morph-ph'
  | 'sds-input-elevate-wrap'
  | 'sds-input-ink'
  | 'sds-input-plasma'
  | 'sds-input-ring'
  | 'sds-input-neon';

export type SdsCardAnimation =
  | 'sds-card-cinematic'
  | 'sds-card-holo'
  | 'sds-card-portal'
  | 'sds-card-shimmer'
  | 'sds-card-magnetic'
  | 'sds-card-warp'
  | 'sds-card-flip'
  | 'sds-card-float'
  | 'sds-card-slice'
  | 'sds-card-glow'
  | 'sds-card-parallax'
  | 'sds-card-depth'
  | 'sds-card-neon';

export type SdsLoaderAnimation =
  | 'sds-loader-orbital'
  | 'sds-loader-fluid'
  | 'sds-loader-dots'
  | 'sds-loader-comet'
  | 'sds-loader-wave'
  | 'sds-loader-ping'
  | 'sds-loader-progress'
  | 'sds-loader-progress-glow'
  | 'sds-loader-skeleton'
  | 'sds-loader-vortex'
  | 'sds-loader-type'
  | 'sds-loader-target';

export type SdsScrollAnimation =
  | 'sds-scroll-rise'
  | 'sds-scroll-fade-up'
  | 'sds-scroll-curtain'
  | 'sds-scroll-warp'
  | 'sds-scroll-slide'
  | 'sds-scroll-scale'
  | 'sds-scroll-radial'
  | 'sds-scroll-blur'
  | 'sds-scroll-tilt'
  | 'sds-scroll-scan'
  | 'sds-scroll-stagger-pop'
  | 'sds-scroll-depth'
  | 'sds-scroll-shatter'
  | 'sds-scroll-phantom'
  | 'sds-scroll-gravity'
  | 'sds-scroll-liquid'
  | 'sds-scroll-velvet'
  | 'sds-scroll-stagger-grid'
  | 'sds-scroll-orbit'
  | 'sds-scroll-glitch';

export type SdsModifier =
  | 'sds-delay-1'
  | 'sds-delay-2'
  | 'sds-delay-3'
  | 'sds-delay-4'
  | 'sds-delay-5'
  | 'sds-delay-6'
  | 'sds-delay-8'
  | 'sds-delay-10'
  | 'sds-fast'
  | 'sds-normal'
  | 'sds-slow'
  | 'sds-xslow'
  | 'sds-once'
  | 'sds-loop'
  | 'sds-alt'
  | 'sds-fill-both'
  | 'sds-fill-forward'
  | 'sds-pause-hover';

export type SdsAnimationClass =
  | SdsTextAnimation
  | SdsButtonAnimation
  | SdsInputAnimation
  | SdsCardAnimation
  | SdsLoaderAnimation
  | SdsScrollAnimation
  | SdsModifier;
