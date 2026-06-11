import type { SdsEffect } from "./generated/effects";

/**
 * `<sds-text effect="sds-kinetic-wave">Motion</sds-text>`
 *
 * Splits its text content into `.sds-char` spans with `--i` stagger indexes.
 * `aria-label` preserves the readable text; char spans are `aria-hidden`.
 * No shadow DOM — see SdsMotionElement for the rationale.
 */
export class SdsTextElement extends HTMLElement {
  static observedAttributes = ["effect"];

  private originalText: string | null = null;

  connectedCallback(): void {
    // Defer one microtask so children/text are parsed when the element is
    // upgraded before its content (streaming HTML).
    queueMicrotask(() => this.split());
  }

  disconnectedCallback(): void {
    if (this.originalText !== null) {
      this.textContent = this.originalText;
      this.removeAttribute("aria-label");
      this.originalText = null;
    }
  }

  attributeChangedCallback(_name: string, oldVal: string | null, newVal: string | null): void {
    if (!this.isConnected || oldVal === null || oldVal === newVal) return;
    if (oldVal) this.classList.remove(oldVal);
    if (newVal) this.classList.add(newVal);
  }

  private split(): void {
    if (!this.isConnected) return;
    const effect = (this.getAttribute("effect") as SdsEffect) || null;
    const text = this.textContent || "";
    if (!text.trim()) return;

    this.originalText = text;
    this.setAttribute("aria-label", text);
    this.textContent = "";
    if (effect) this.classList.add(effect);
    this.style.display = this.style.display || "inline-block";

    const frag = document.createDocumentFragment();
    for (let i = 0; i < text.length; i++) {
      const s = document.createElement("span");
      s.className = "sds-char";
      s.setAttribute("aria-hidden", "true");
      s.style.display = "inline-block";
      s.style.setProperty("--i", String(i));
      s.textContent = text[i] === " " ? " " : text[i];
      frag.appendChild(s);
    }
    this.appendChild(frag);
  }
}
