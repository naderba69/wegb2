import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navigation from "@/components/akademie/Navigation";
import { UiAppShell } from "@/components/dirb/DesignSystem";

export const metadata: Metadata = {
  title: "طريقي إلى B2 — Mein Weg bis B2",
  description: "خطة عربية تفاعلية لتعلّم الألمانية من A0 إلى B2، مع حفظ التقدّم في متصفحك.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b1020",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <UiAppShell data-ui-shell="ui-app-shell">
          <main id="main-content" className="ui-main" tabIndex={-1}>
            {children}
          </main>
          <Navigation />
          <footer className="ui-footer">
            طريقي إلى B2 · خطتك وتقدّمك محفوظان في هذا المتصفح.
          </footer>
        </UiAppShell>
      </body>
    </html>
  );
}
