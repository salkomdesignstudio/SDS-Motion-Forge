import {
  createElement,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type ElementType,
  type ComponentPropsWithoutRef,
  type Ref,
} from "react";
import { type SdsEffect } from "./generated/effects";

export type SdsTextOwnProps<T extends ElementType> = {
  /** Element to render. Default: 'span'. */
  as?: T;
  /** The SDS effect class (typically a char-split text effect). */
  effect: SdsEffect;
  /** The text to animate. Must be a plain string for SSR-safe splitting. */
  children: string;
};

export type SdsTextProps<T extends ElementType = "span"> =
  SdsTextOwnProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof SdsTextOwnProps<T> | "children">;

/**
 * SSR-safe per-character text animation.
 *
 * - On the server (and on first client render) the plain text string is
 *   rendered, so crawlers and users without JS always see the content.
 * - After hydration, the text is split into `.sds-char` spans with the `--i`
 *   stagger index; `aria-label` is set on the container and each char span is
 *   `aria-hidden`, matching the core motion-interactive engine's semantics.
 * - This package ships NO CSS — load the SDS Motion Forge stylesheet once.
 */
function SdsTextRender(
  props: SdsTextProps<ElementType>,
  forwardedRef: Ref<Element>,
) {
  const { as, effect, children, className, ...rest } = props as SdsTextProps<"span">;
  const localRef = useRef<HTMLElement | null>(null);
  useImperativeHandle(forwardedRef, () => localRef.current as Element);

  if (process.env.NODE_ENV !== "production" && typeof children !== "string") {
    // eslint-disable-next-line no-console
    console.warn("[motion-forge-react] <SdsText> children must be a plain string.");
  }

  useEffect(() => {
    const el = localRef.current;
    if (!el || typeof children !== "string") return;

    el.setAttribute("aria-label", children);
    el.textContent = "";
    const frag = document.createDocumentFragment();
    for (let i = 0; i < children.length; i++) {
      const s = document.createElement("span");
      s.className = "sds-char";
      s.setAttribute("aria-hidden", "true");
      s.style.display = "inline-block";
      s.style.setProperty("--i", String(i));
      s.textContent = children[i] === " " ? " " : children[i];
      frag.appendChild(s);
    }
    el.appendChild(frag);

    return () => {
      // restore plain text so unmount/re-split never leaves stale spans
      el.textContent = children;
      el.removeAttribute("aria-label");
    };
  }, [children]);

  return createElement(
    as || "span",
    { ...rest, ref: localRef, className: [effect, className].filter(Boolean).join(" ") },
    children,
  );
}

export const SdsText = forwardRef(
  SdsTextRender as never,
) as unknown as <T extends ElementType = "span">(
  props: SdsTextProps<T> & { ref?: Ref<Element> },
) => ReturnType<typeof createElement>;
