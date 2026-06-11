import {
  createElement,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type CSSProperties,
  type ElementType,
  type ComponentPropsWithoutRef,
  type Ref,
} from "react";
import { useSdsInView } from "./useSdsInView";
import {
  SDS_EFFECT_META,
  SDS_DURATION_TOKEN_VARS,
  SDS_EASING_TOKEN_VARS,
  type SdsEffect,
  type SdsDurationToken,
  type SdsEasingToken,
} from "./generated/effects";

const warned = new Set<string>();

export type SdsMotionOwnProps<T extends ElementType> = {
  /** Element or component to render. Default: 'div'. */
  as?: T;
  /** The SDS effect class. Typed from the motion registry. */
  effect: SdsEffect;
  /** Gate the effect on viewport entry (IntersectionObserver). */
  inView?: boolean;
  /** With inView: remove the effect on exit so it replays on re-entry. */
  replay?: boolean;
  /** Animation delay — milliseconds, or any CSS time string. */
  delay?: number | string;
  /** Duration — an SDS token name ('slow') or any CSS time string ('1.2s'). */
  duration?: SdsDurationToken | (string & {});
  /** Easing — an SDS token name ('spring') or any CSS easing string. */
  easing?: SdsEasingToken | (string & {});
};

export type SdsMotionProps<T extends ElementType = "div"> =
  SdsMotionOwnProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof SdsMotionOwnProps<T>>;

function resolveDuration(d: SdsMotionOwnProps<ElementType>["duration"]): string | undefined {
  if (d == null) return undefined;
  if (d in SDS_DURATION_TOKEN_VARS) return SDS_DURATION_TOKEN_VARS[d as SdsDurationToken];
  return String(d);
}
function resolveEasing(e: SdsMotionOwnProps<ElementType>["easing"]): string | undefined {
  if (e == null) return undefined;
  if (e in SDS_EASING_TOKEN_VARS) return SDS_EASING_TOKEN_VARS[e as SdsEasingToken];
  return String(e);
}

/**
 * Apply any SDS Motion Forge effect to an element.
 *
 * This package ships NO CSS — load the core stylesheet (or a category bundle)
 * once in your app:
 *   import '@salkomdesignstudio/sds-motion-forge/dist/motion.min.css';
 */
function SdsMotionRender(
  props: SdsMotionProps<ElementType>,
  forwardedRef: Ref<Element>,
) {
  const {
    as, effect, inView = false, replay = false,
    delay, duration, easing, className, style, ...rest
  } = props as SdsMotionProps<"div">;

  const localRef = useRef<Element | null>(null);
  useImperativeHandle(forwardedRef, () => localRef.current as Element);

  const visible = useSdsInView(localRef, { once: !replay });
  const meta = SDS_EFFECT_META[effect];
  const active = !inView || visible;

  /* dev-only: warn when the effect's styles are not loaded */
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (!active || !localRef.current || warned.has(effect)) return;
    if (!meta || meta.requiresJs || meta.requiresChildren || meta.requiresCharSplit) return;
    const el = localRef.current as HTMLElement;
    const id = requestAnimationFrame(() => {
      const name = getComputedStyle(el).animationName;
      if (name === "none" || name === "") {
        warned.add(effect);
        // eslint-disable-next-line no-console
        console.warn(
          `[motion-forge-react] "${effect}" produced no animation. ` +
          `Did you load the SDS Motion Forge CSS? ` +
          `import '@salkomdesignstudio/sds-motion-forge/dist/motion.min.css'`,
        );
      }
    });
    return () => cancelAnimationFrame(id);
  }, [active, effect, meta]);

  const styleOut: CSSProperties & Record<string, string> = { ...(style as CSSProperties) } as never;
  if (delay != null) styleOut.animationDelay = typeof delay === "number" ? `${delay}ms` : delay;
  const dur = resolveDuration(duration);
  if (dur) {
    // Child/char-driven effects animate descendants — steer them through the
    // theming custom property; element-level effects take the direct property.
    if (meta && (meta.requiresChildren || meta.requiresCharSplit)) styleOut["--sds-duration"] = dur;
    else { styleOut.animationDuration = dur; styleOut["--sds-duration"] = dur; }
  }
  const ease = resolveEasing(easing);
  if (ease) {
    if (meta && (meta.requiresChildren || meta.requiresCharSplit)) styleOut["--sds-easing"] = ease;
    else { styleOut.animationTimingFunction = ease; styleOut["--sds-easing"] = ease; }
  }

  const cls = [active ? effect : null, className].filter(Boolean).join(" ") || undefined;

  return createElement(as || "div", {
    ...rest,
    ref: localRef,
    className: cls,
    style: styleOut,
  });
}

export const SdsMotion = forwardRef(
  SdsMotionRender as never,
) as unknown as <T extends ElementType = "div">(
  props: SdsMotionProps<T> & { ref?: Ref<Element> },
) => ReturnType<typeof createElement>;
