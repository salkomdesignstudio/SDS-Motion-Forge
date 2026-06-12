/* GENERATED rotating snippet sample (week 24) — scripts/docs/generate-framework-samples.js
   Builds in CI type-check the registry-generated effect unions. */
import { Component } from "@angular/core";
import { SdsMotionDirective, SdsTextDirective } from "@salkomdesignstudio/motion-forge-angular";

@Component({
  selector: "app-snippets",
  standalone: true,
  imports: [SdsMotionDirective, SdsTextDirective],
  template: `
    <section>
      <div sdsMotion="sds-roll-in" easing="spring">Roll In</div>
      <div sdsMotion="sds-shimmer-sweep" easing="spring">Shimmer Sweep</div>
      <div sdsMotion="sds-slide-blur-left" easing="spring">Slide Blur Left</div>
      <button sdsMotion="sds-btn-gravity" duration="fast">Gravity</button>
      <button sdsMotion="sds-btn-kinetic" duration="fast">Kinetic</button>
      <button sdsMotion="sds-btn-momentum" duration="fast">Momentum</button>
      <div sdsMotion="sds-input-flicker" easing="spring">Flicker</div>
      <div sdsMotion="sds-input-ghost" easing="spring">Ghost</div>
      <div sdsMotion="sds-input-ink" easing="spring">Ink Stroke</div>
      <div sdsMotion="sds-card-ink" easing="spring">Ink</div>
      <div sdsMotion="sds-card-momentum" easing="spring">Momentum</div>
      <div sdsMotion="sds-card-portal" easing="spring">Depth Portal</div>
      <div sdsMotion="sds-loader-glitch" easing="spring">Glitch</div>
      <div sdsMotion="sds-loader-infinity" easing="spring">Infinity</div>
      <div sdsMotion="sds-loader-neon-ring" easing="spring">Neon Ring</div>
      <div sdsMotion="sds-scroll-clip-right" inView replay>Clip Right</div>
      <div sdsMotion="sds-scroll-drift" inView replay>Drift</div>
      <div sdsMotion="sds-scroll-flip" inView replay>Flip Reveal</div>
    </section>
  `,
})
export class SnippetsComponent {}
