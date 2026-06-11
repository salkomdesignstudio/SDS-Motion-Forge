import {
  Directive,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  afterNextRender,
  inject,
  input,
  output,
  booleanAttribute,
} from "@angular/core";
import { isPlatformBrowser } from "@angular/common";

/**
 * Emits viewport visibility for any element and optionally applies a class
 * while visible (default `sds-in`, matching the core library's inline
 * IntersectionObserver pattern).
 *
 * SSR-safe (no observer on the server), zoneless-compatible (no zone APIs;
 * outputs fire from the IntersectionObserver callback).
 *
 * ```html
 * <section sdsInView (sdsInViewChange)="visible($event)">…</section>
 * <div sdsInView inViewClass="sds-in" class="sds-scroll-rise" data-sds-scroll>…</div>
 * ```
 */
@Directive({
  selector: "[sdsInView]",
  standalone: true,
})
export class SdsInViewDirective implements OnDestroy {
  /** Class applied while in view. Set to '' to disable. Default 'sds-in'. */
  readonly inViewClass = input<string>("sds-in");
  /** Stop observing after first entry. Default true. */
  readonly once = input(true, { transform: booleanAttribute });
  /** Emits true on entry; false on exit (when `once` is false). */
  readonly sdsInViewChange = output<boolean>();

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly platformId = inject(PLATFORM_ID);
  private observer: IntersectionObserver | null = null;

  constructor() {
    afterNextRender(() => this.observe());
  }

  private observe(): void {
    if (!isPlatformBrowser(this.platformId) || typeof IntersectionObserver === "undefined") return;
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (this.inViewClass()) this.el.nativeElement.classList.add(this.inViewClass());
            this.sdsInViewChange.emit(true);
            if (this.once()) this.teardown();
          } else if (!this.once()) {
            if (this.inViewClass()) this.el.nativeElement.classList.remove(this.inViewClass());
            this.sdsInViewChange.emit(false);
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
