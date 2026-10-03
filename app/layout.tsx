import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navigation from "@/components/akademie/Navigation";

export const metadata: Metadata = {
  title: "طريقي إلى B2 — Mein Weg bis B2",
  description: "خطة يومية مُحكَمة من اليوم 1 إلى B2 — نظام مغلق بلا روابط خارجية",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <main style={{ maxWidth: "56rem", margin: "0 auto", padding: "1rem 1rem 6.5rem" }}>
          {children}
        </main>
      <Navigation />
        <footer
          style={{
            textAlign: "center",
            color: "var(--color-ink2)",
            fontSize: "0.72rem",
            padding: "0 1.2rem 6.2rem",
            maxWidth: "56rem",
            margin: "0 auto",
          }}
        >
          طريقي إلى B2 · نظام مغلق تماماً — كل الشروحات والنصوص والنطق داخل التطبيق · التقدّم في متصفحك
        </footer>
      </body>
    </html>
  );
}
