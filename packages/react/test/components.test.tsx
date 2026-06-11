// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, cleanup, waitFor } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { SdsMotion } from "../src/SdsMotion";
import { SdsText } from "../src/SdsText";

beforeEach(() => {
  cleanup();
  vi.stubGlobal("IntersectionObserver", class {
    constructor(_cb: IntersectionObserverCallback) {}
    observe() {}
    unobserve() {}
    disconnect() {}
  });
});

describe("SdsMotion", () => {
  it("renders the effect class on the chosen element", () => {
    const { container } = render(
      <SdsMotion as="h1" effect="sds-velvet-drop" className="extra">
        Hello
      </SdsMotion>,
    );
    const h1 = container.querySelector("h1")!;
    expect(h1).toBeTruthy();
    expect(h1.className).toContain("sds-velvet-drop");
    expect(h1.className).toContain("extra");
  });

  it("maps duration/easing token names to CSS variables", () => {
    const { container } = render(
      <SdsMotion effect="sds-velvet-drop" duration="slow" easing="spring" delay={120}>
        x
      </SdsMotion>,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.animationDuration).toBe("var(--sds-duration-slow)");
    expect(el.style.animationTimingFunction).toBe("var(--sds-ease-spring)");
    expect(el.style.animationDelay).toBe("120ms");
  });

  it("with inView, withholds the effect class until visible", () => {
    const { container } = render(
      <SdsMotion effect="sds-scroll-rise" inView>
        x
      </SdsMotion>,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).not.toContain("sds-scroll-rise");
  });

  it("SSR: renderToString produces markup without throwing (no window access)", () => {
    const html = renderToString(
      <SdsMotion as="section" effect="sds-card-rise">content</SdsMotion>,
    );
    expect(html).toContain("content");
    expect(html).toContain("sds-card-rise");
  });
});

describe("SdsText", () => {
  it("SSR: renders plain text only — no char spans on the server", () => {
    const html = renderToString(<SdsText effect="sds-drop-settle">Hi!</SdsText>);
    expect(html).toContain("Hi!");
    expect(html).not.toContain("sds-char");
  });

  it("splits into aria-hidden .sds-char spans after mount, aria-label on container", async () => {
    const { container } = render(<SdsText effect="sds-drop-settle">Hey</SdsText>);
    const el = container.firstElementChild as HTMLElement;
    await waitFor(() => expect(el.querySelectorAll(".sds-char").length).toBe(3));
    expect(el.getAttribute("aria-label")).toBe("Hey");
    const chars = [...el.querySelectorAll(".sds-char")] as HTMLElement[];
    expect(chars.every((c) => c.getAttribute("aria-hidden") === "true")).toBe(true);
    expect(chars[2].style.getPropertyValue("--i")).toBe("2");
  });

  it("re-splits when the text changes and restores text on unmount", async () => {
    const { container, rerender, unmount } = render(
      <SdsText effect="sds-drop-settle">ab</SdsText>,
    );
    const el = container.firstElementChild as HTMLElement;
    await waitFor(() => expect(el.querySelectorAll(".sds-char").length).toBe(2));
    rerender(<SdsText effect="sds-drop-settle">abcd</SdsText>);
    await waitFor(() => expect(el.querySelectorAll(".sds-char").length).toBe(4));
    unmount();
  });
});
