import {
  Directive,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  Renderer2,
  afterNextRender,
  inject,
  input,
} from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import type { SdsEffect } from "../generated/effects";

/**
 * Per-character text animation.
 *
 * ```html
 * <h1 sdsText="sds-kinetic-wave">Motion</h1>
 * ```
 *
 * SSR-safe: the server (and pre-hydration client) shows plain text; after
 * render, the text splits into `.sds-char` spans with `--i` stagger indexes
 * via Renderer2. `aria-label` preserves the readable text; char spans are
 * `aria-hidden` — matching the core motion-interactive engine.
 */
@Directive({
  selector: "[sdsText]",
  standalone: true,
})
export class SdsTextDirective implements OnDestroy {
  /** The effect class — typed from the motion registry. */
  readonly sdsText = input.required<SdsEffect>();

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly platformId = inject(PLATFORM_ID);
  private originalText: string | null = null;

  constructor() {
    afterNextRender(() => this.split());
  }

  private split(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const native = this.el.nativeElement;
    const text = native.textContent ?? "";
    if (!text.trim()) return;

    this.originalText = text;
    this.renderer.setAttribute(native, "aria-label", text);
    this.renderer.addClass(native, this.sdsText());
    native.textContent = "";

    for (let i = 0; i < text.length; i++) {
      const span = this.renderer.createElement("span") as HTMLElement;
      this.renderer.addClass(span, "sds-char");
      this.renderer.setAttribute(span, "aria-hidden", "true");
      this.renderer.setStyle(span, "display", "inline-block");
      span.style.setProperty("--i", String(i));
      this.renderer.appendChild(span, this.renderer.createText(text[i] === " " ? " " : text[i]));
      this.renderer.appendChild(native, span);
    }
  }

  ngOnDestroy(): void {
    if (this.originalText !== null && isPlatformBrowser(this.platformId)) {
      this.el.nativeElement.textContent = this.originalText;
      this.renderer.removeAttribute(this.el.nativeElement, "aria-label");
    }
  }
}
