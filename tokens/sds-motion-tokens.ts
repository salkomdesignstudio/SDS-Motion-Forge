/**
 * SDS Motion Forge — Motion Tokens (generated)
 * Source of truth: tokens/motion.tokens.json
 * Regenerate with: npm run build:tokens
 * DO NOT EDIT BY HAND.
 */

export const SDS_DURATION = {
  /** Micro-feedback: focus rings, validation flashes, press states. Existing uses: sds-input-focus, sds-input-ink. */
  instant: '0.3s',
  /** Quick entrances and snappy UI moves. Identical to the sds-fast modifier (0.4s). */
  fast: '0.4s',
  /** Default entrance duration. Identical to the legacy --sds-duration default (0.8s) — the most-used entrance duration in the library (73 direct/indirect uses). */
  base: '0.8s',
  /** Deliberate, cinematic entrances. Identical to the sds-slow modifier (1.4s); 15 direct uses. */
  slow: '1.4s',
  /** Hero-scale reveals. Identical to the sds-xslow modifier (2.2s). */
  slower: '2.2s',
  /** Ambient loops and atmosphere (glow, aurora, drift). 30 direct uses of 3s in v4.0.3. */
  dramatic: '3s',
} as const;

export const SDS_EASING = {
  /** The SDS signature ease-out (legacy --sds-easing default, 100+ uses). Confident deceleration with a soft landing. Use for most entrances. */
  standard: 'cubic-bezier(0.22, 1, 0.36, 1)',
  /** Expo-style deceleration — starts very fast, lands very softly. Use for large translations and streaks (liquid-rise, streak-in, slide-blur). */
  decelerate: 'cubic-bezier(0.16, 1, 0.3, 1)',
  /** Anticipate-then-accelerate (back-in). Element winds up slightly, then commits. Use for exits and weight-drop style falls. */
  accelerate: 'cubic-bezier(0.6, -0.28, 0.74, 0.05)',
  /** Cubic ease-out used by the multi-bounce choreography family (bounce-in-up, gravity-bounce, drop-bounce). Strong start, controlled settle. */
  emphasized: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  /** Back-out overshoot (~6%). The library's signature 'pop' — use for scale/pop entrances and spring settles (12 uses). */
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  /** Anticipation + overshoot on both ends. Use for playful gravity effects (gravity-drop, card-snap; 8 uses). */
  bounce: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)',
} as const;

export const SDS_DISTANCE = {
  /** Subtle entrance offset — text lines, list items. */
  sm: '24px',
  /** Standard entrance offset — cards, sections. */
  md: '48px',
  /** Dramatic entrance offset — heroes, full-bleed media. */
  lg: '80px',
} as const;

export type SdsDurationToken = keyof typeof SDS_DURATION;
export type SdsEasingToken = keyof typeof SDS_EASING;
export type SdsDistanceToken = keyof typeof SDS_DISTANCE;

/** CSS custom property name for a duration token, e.g. durationVar('base') -> '--sds-duration-base' */
export const durationVar = (t: SdsDurationToken): string => `--sds-duration-${t}`;
export const easingVar = (t: SdsEasingToken): string => `--sds-ease-${t}`;
export const distanceVar = (t: SdsDistanceToken): string => `--sds-distance-${t}`;
