import "@salkomdesignstudio/sds-motion-forge/dist/motion.min.css";
import type { ReactNode } from "react";

export const metadata = { title: "SDS Motion Forge × Next.js" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: 40 }}>{children}</body>
    </html>
  );
}
