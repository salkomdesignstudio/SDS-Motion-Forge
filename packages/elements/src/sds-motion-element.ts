import { SDS_EFFECT_META, type SdsEffect } from "./generated/effects";

const DURATION_TOKENS = new Set(["instant", "fast", "base", "slow", "slower", "dramatic"]);
const EASING_TOKENS = new Set(["standard", "decelerate", "accelerate", "emphasized", "spring", "bounce"]);

/**
 * `<sds-motion effect="sds-card-rise" in-view replay delay="200" duration="slow" easing="spring">`
 *
 * SHADOW DOM IS INTENTIONALLY OFF: SDS effects are plain page-level CSS
 * classes — tokens (`--sds-*`), the reduced-motion neutralization block and
 * the user's theme overrides all live in light-DOM stylesheets. A shadow root
 * would isolate the element from exactly the styles that make it animate.
 */
export class SdsMotionElement extends HTMLElement {
  static observedAttributes = ["effect", "in-view", "replay", "delay", "duration", "easing"];

  private observer: IntersectionObserver | null = null;
  private appliedEffect: string | null = null;

  connectedCallback(): void {
    this.upgrade();
  }

  disconnectedCallback(): void {
    this.teardownObserver();
  }

  attributeChangedCallback(): void {
    if (this.isConnected) this.upgrade();
  }

  private get effect(): SdsEffect | null {
    return (this.getAttribute("effect") as SdsEffect) || null;
  }

  private upgrade(): void {
    const effect = this.effect;
    if (!effect) return;

    // timing attributes
    const delay = this.getAttribute("delay");
    if (delay) this.style.animationDelay = /^\d+$/.test(delay) ? `${delay}ms` : delay;
    const duration = this.getAttribute("duration");
    if (duration) {
      const v = DURATION_TOKENS.has(duration) ? `var(--sds-duration-${duration})` : duration;
      const meta = SDS_EFFECT_META[effect];
      this.style.setProperty("--sds-duration", v);
      if (!meta || (!meta.requiresChildren && !meta.requiresCharSplit)) this.style.animationDuration = v;
    }
    const easing = this.getAttribute("easing");
    if (easing) {
      const v = EASING_TOKENS.has(easing) ? `var(--sds-ease-${easing})` : easing;
      const meta = SDS_EFFECT_META[effect];
      this.style.setProperty("--sds-easing", v);
      if (!meta || (!meta.requiresChildren && !meta.requiresCharSplit)) this.style.animationTimingFunction = v;
    }

    if (this.hasAttribute("in-view") && typeof IntersectionObserver !== "undefined") {
      this.gateOnViewport(effect);
    } else {
      this.applyEffect(effect);
    }
  }

  private applyEffect(effect: string): void {
    if (this.appliedEffect && this.appliedEffect !== effect) {
      this.classList.remove(this.appliedEffect);
    }
    this.classList.add(effect);
    this.appliedEffect = effect;
  }

  private removeEffect(): void {
    if (this.appliedEffect) this.classList.remove(this.appliedEffect);
  }

  private gateOnViewport(effect: string): void {
    this.teardownObserver();
    const replay = this.hasAttribute("replay");
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.applyEffect(effect);
            if (!replay) this.teardownObserver();
          } else if (replay) {
            this.removeEffect();
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );
    this.observer.observe(this);
  }

  private teardownObserver(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}
