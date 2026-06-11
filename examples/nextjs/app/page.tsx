"use client";

import { SdsMotion, SdsText } from "@salkomdesignstudio/motion-forge-react";

export default function Home() {
  return (
    <main>
      {/* SSR smoke: next build prerenders this page on the server.
          SdsText must emit plain text server-side; SdsMotion must not touch
          the DOM during render. */}
      <SdsMotion as="h1" effect="sds-velvet-drop">
        Server-rendered headline
      </SdsMotion>

      <SdsText as="h2" effect="sds-kinetic-wave">
        Motion
      </SdsText>

      <SdsMotion effect="sds-scroll-rise" inView replay duration="slow" easing="spring">
        <p>Enters on scroll, replays on re-entry.</p>
      </SdsMotion>

      <SdsMotion as="button" effect="sds-btn-magnetic" delay={200}>
        Magnetic button
      </SdsMotion>
    </main>
  );
}
