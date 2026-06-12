"use client";

/* GENERATED rotating snippet sample (week 24) — scripts/docs/generate-framework-samples.js
   Builds in CI type-check the registry-generated effect unions. */
import { SdsMotion, SdsText } from "@salkomdesignstudio/motion-forge-react";

export default function Snippets() {
  return (
    <main>
      <SdsMotion effect="sds-roll-in" easing="spring">Roll In</SdsMotion>
      <SdsMotion effect="sds-shimmer-sweep" easing="spring">Shimmer Sweep</SdsMotion>
      <SdsMotion effect="sds-slide-blur-left" easing="spring">Slide Blur Left</SdsMotion>
      <SdsMotion as="button" effect="sds-btn-gravity" duration="fast">Gravity</SdsMotion>
      <SdsMotion as="button" effect="sds-btn-kinetic" duration="fast">Kinetic</SdsMotion>
      <SdsMotion as="button" effect="sds-btn-momentum" duration="fast">Momentum</SdsMotion>
      <SdsMotion effect="sds-input-flicker" easing="spring">Flicker</SdsMotion>
      <SdsMotion effect="sds-input-ghost" easing="spring">Ghost</SdsMotion>
      <SdsMotion effect="sds-input-ink" easing="spring">Ink Stroke</SdsMotion>
      <SdsMotion effect="sds-card-ink" easing="spring">Ink</SdsMotion>
      <SdsMotion effect="sds-card-momentum" easing="spring">Momentum</SdsMotion>
      <SdsMotion effect="sds-card-portal" easing="spring">Depth Portal</SdsMotion>
      <SdsMotion effect="sds-loader-glitch" easing="spring">Glitch</SdsMotion>
      <SdsMotion effect="sds-loader-infinity" easing="spring">Infinity</SdsMotion>
      <SdsMotion effect="sds-loader-neon-ring" easing="spring">Neon Ring</SdsMotion>
      <SdsMotion effect="sds-scroll-clip-right" inView replay>Clip Right</SdsMotion>
      <SdsMotion effect="sds-scroll-drift" inView replay>Drift</SdsMotion>
      <SdsMotion effect="sds-scroll-flip" inView replay>Flip Reveal</SdsMotion>
    </main>
  );
}
