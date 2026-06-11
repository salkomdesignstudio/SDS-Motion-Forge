export { SdsMotionElement } from "./sds-motion-element";
export { SdsTextElement } from "./sds-text-element";
export type {
  SdsEffect,
  SdsTextEffect,
  SdsButtonsEffect,
  SdsInputsEffect,
  SdsCardsEffect,
  SdsLoadersEffect,
  SdsScrollEffect,
  SdsInteractiveEffect,
} from "./generated/effects";

import { SdsMotionElement } from "./sds-motion-element";
import { SdsTextElement } from "./sds-text-element";

/** Register both elements (idempotent). Call once in app startup. */
export function defineSdsElements(): void {
  if (typeof customElements === "undefined") return; // SSR no-op
  if (!customElements.get("sds-motion")) customElements.define("sds-motion", SdsMotionElement);
  if (!customElements.get("sds-text")) customElements.define("sds-text", SdsTextElement);
}
