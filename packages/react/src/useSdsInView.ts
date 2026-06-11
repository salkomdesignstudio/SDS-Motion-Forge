import { useEffect, useRef, useState, type RefObject } from "react";

export interface UseSdsInViewOptions {
  /** IntersectionObserver threshold. Default 0.08 (matches sds-scroll.js). */
  threshold?: number | number[];
  /** IntersectionObserver rootMargin. Default '0px 0px -40px 0px' (matches sds-scroll.js). */
  rootMargin?: string;
  /** Stop observing after the first entry (no replay). Default true. */
  once?: boolean;
}

/**
 * Observe an element and report whether it is in the viewport.
 *
 * - SSR-safe: never touches IntersectionObserver outside the browser; returns
 *   false on the server (and on browsers without IntersectionObserver, where
 *   it resolves to true so content is never hidden).
 * - StrictMode-safe: the observer is created inside the effect and fully torn
 *   down in its cleanup, so double-invoked effects never leak.
 * - Fast re-render safe: re-renders don't recreate the observer; only changes
 *   to the ref target or options do.
 */
export function useSdsInView(
  ref: RefObject<Element | null>,
  options: UseSdsInViewOptions = {},
): boolean {
  const { threshold = 0.08, rootMargin = "0px 0px -40px 0px", once = true } = options;
  const [inView, setInView] = useState(false);
  // Keep `once` behavior stable without re-subscribing when it flips mid-flight.
  const onceRef = useRef(once);
  onceRef.current = once;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      // Ancient browser / non-DOM test env: never hide content.
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            if (onceRef.current) observer.unobserve(entry.target);
          } else if (!onceRef.current) {
            setInView(false);
          }
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, rootMargin, JSON.stringify(threshold)]);

  return inView;
}
