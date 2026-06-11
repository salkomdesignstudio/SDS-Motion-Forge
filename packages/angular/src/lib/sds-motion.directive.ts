import {
  Directive,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  Renderer2,
  afterNextRender,
  booleanAttribute,
  effect,
  inject,
  input,
} from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import {
  SDS_EFFECT_META,
  type SdsEffect,
  type SdsDurationToken,
  type SdsEasingToken,
} from "../generated/effects";

const DURATION_TOKENS = new Set(["instant", "fast", "base", "slow", "slower", "dramatic"]);
const EASING_TOKENS = new Set(["standard", "decelerate", "accelerate", "emphasized", "spring", "bounce"]);

/**
 * Apply any SDS Motion Forge effect class.
 *
 * ```html
 * <h1 sdsMotion="sds-velvet-drop">Hello</h1>
 * <section sdsMotion="sds-scroll-rise" inView replay>…</section>
 * <div sdsMotion="sds-card-rise" duration="slow" easing="spring" [delay]="150">…</div>
 * ```
 *
 * Ships no CSS — add the SDS stylesheet to your application styles.
 * SSR-safe (DOM work behind isPlatformBrowser/afterNextRender) and
 * zoneless-compatible (signal inputs, no zone APIs).
 */
@Directive({
  selector: "[sdsMotion]",
  standalone: true,
})
export class SdsMotionDirective implements OnDestroy {
  /** The effect class — typed from the motion registry. */
  readonly sdsMotion = input.required<SdsEffect>();
  /** Gate the effect on viewport entry. */
  readonly inView = input(false, { transform: booleanAttribute });
  /** With inView: remove on exit so the effect replays on re-entry. */
  readonly replay = input(false, { transform: booleanAttribute });
  /** Animation delay — ms number or CSS time string. */
  readonly delay = input<number | string | null>(null);
  /** Duration — SDS token name or CSS time string. */
  readonly duration = input<SdsDurationToken | string | null>(null);
  /** Easing — SDS token name or CSS easing string. */
  readonly easing = input<SdsEasingToken | string | null>(null);

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly platformId = inject(PLATFORM_ID);
  private observer: IntersectionObserver | null = null;
  private applied: string | null = null;
  private browserReady = false;

  constructor() {
    afterNextRender(() => {
      this.browserReady = true;
      this.sync();
    });
    // react to input changes after initial render (zoneless-safe)
    effect(() => {
      // track all timing/effect inputs
      this.sdsMotion(); this.inView(); this.replay(); this.delay(); this.duration(); this.easing();
      if (this.browserReady) this.sync();
    });
  }

  private sync(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const native = this.el.nativeElement;
    const effectName = this.sdsMotion();
    const meta = SDS_EFFECT_META[effectName];

    const delay = this.delay();
    if (delay !== null && delay !== undefined) {
      this.renderer.setStyle(native, "animation-delay", typeof delay === "number" ? `${delay}ms` : delay);
    }
    const duration = this.duration();
    if (duration) {
      const v = DURATION_TOKENS.has(duration) ? `var(--sds-duration-${duration})` : duration;
      native.style.setProperty("--sds-duration", v);
      if (!meta || (!meta.requiresChildren && !meta.requiresCharSplit)) {
        this.renderer.setStyle(native, "animation-duration", v);
      }
    }
    const easing = this.easing();
    if (easing) {
      const v = EASING_TOKENS.has(easing) ? `var(--sds-ease-${easing})` : easing;
      native.style.setProperty("--sds-easing", v);
      if (!meta || (!meta.requiresChildren && !meta.requiresCharSplit)) {
        this.renderer.setStyle(native, "animation-timing-function", v);
      }
    }

    if (this.inView() && typeof IntersectionObserver !== "undefined") {
      this.gate(effectName);
    } else {
      this.apply(effectName);
    }
  }

  private apply(effectName: string): void {
    if (this.applied && this.applied !== effectName) {
      this.renderer.removeClass(this.el.nativeElement, this.applied);
    }
    this.renderer.addClass(this.el.nativeElement, effectName);
    this.applied = effectName;
  }

  private remove(): void {
    if (this.applied) this.renderer.removeClass(this.el.nativeElement, this.applied);
  }

  private gate(effectName: string): void {
    this.teardown();
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.apply(effectName);
            if (!this.replay()) this.teardown();
          } else if (this.replay()) {
            this.remove();
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );
    this.observer.observe(this.el.nativeElement);
  }

  private teardown(): void {
    this.observer?.disconnect();
    this.observer = null;
  }

  ngOnDestroy(): void {
    this.teardown();
  }
}
