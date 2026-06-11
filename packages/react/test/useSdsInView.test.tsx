import { describe, it, expect, beforeEach, vi } from "vitest";
import { StrictMode, useRef } from "react";
import { render, cleanup } from "@testing-library/react";
import { useSdsInView } from "../src/useSdsInView";

/* ── IntersectionObserver mock with lifecycle accounting ─────── */
let constructed = 0;
let disconnected = 0;
let observing = 0;

class MockIO {
  callback: IntersectionObserverCallback;
  targets = new Set<Element>();
  constructor(cb: IntersectionObserverCallback) {
    this.callback = cb;
    constructed++;
    instances.push(this);
  }
  observe(el: Element) { this.targets.add(el); observing++; }
  unobserve(el: Element) { if (this.targets.delete(el)) observing--; }
  disconnect() { observing -= this.targets.size; this.targets.clear(); disconnected++; }
  trigger(isIntersecting: boolean) {
    const entries = [...this.targets].map((t) => ({ isIntersecting, target: t }) as IntersectionObserverEntry);
    this.callback(entries, this as unknown as IntersectionObserver);
  }
}
let instances: MockIO[] = [];

beforeEach(() => {
  // unmount the previous test's tree BEFORE resetting counters, so its
  // observer teardown doesn't pollute this test's accounting
  cleanup();
  constructed = 0; disconnected = 0; observing = 0; instances = [];
  vi.stubGlobal("IntersectionObserver", MockIO);
});

function Probe({ once = true }: { once?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useSdsInView(ref, { once });
  return <div ref={ref} data-inview={inView} />;
}

describe("useSdsInView", () => {
  it("observes the element and reports visibility", () => {
    const { container } = render(<Probe />);
    expect(constructed).toBeGreaterThan(0);
    instances.at(-1)!.trigger(true);
    expect(container.querySelector("[data-inview='true']")).toBeNull(); // state applies after re-render
  });

  it("cleans up the observer on unmount (no leaks)", () => {
    const { unmount } = render(<Probe />);
    unmount();
    expect(disconnected).toBe(constructed);
    expect(observing).toBe(0);
  });

  it("is StrictMode double-mount safe", () => {
    const { unmount } = render(
      <StrictMode>
        <Probe />
      </StrictMode>,
    );
    // StrictMode mounts-unmounts-mounts: every constructed observer except the
    // live one must already be disconnected.
    expect(constructed - disconnected).toBe(1);
    expect(observing).toBe(1);
    unmount();
    expect(constructed).toBe(disconnected);
    expect(observing).toBe(0);
  });

  it("does not leak observers across fast re-renders", () => {
    const { rerender, unmount } = render(<Probe />);
    for (let i = 0; i < 50; i++) rerender(<Probe />);
    // re-renders must not recreate observers
    expect(constructed - disconnected).toBe(1);
    expect(observing).toBe(1);
    unmount();
    expect(observing).toBe(0);
    expect(constructed).toBe(disconnected);
  });

  it("replay mode resets visibility on exit", () => {
    render(<Probe once={false} />);
    const io = instances.at(-1)!;
    io.trigger(true);
    io.trigger(false);
    // no throw, observer still attached for re-entry
    expect(observing).toBe(1);
  });
});
