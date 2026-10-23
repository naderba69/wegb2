import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navigation from "@/components/akademie/Navigation";
import { UiAppShell } from "@/components/dirb/DesignSystem";
import RegisterSW from "@/components/RegisterSW";
import BankenStart from "@/components/BankenStart";
import { ErinnerungsWache } from "@/components/erinnerung";
import { KomfortInit } from "@/components/komfort";

export const metadata: Metadata = {
  title: "طريقي إلى B2 — Mein Weg bis B2",
  description: "خطة عربية تفاعلية لتعلّم الألمانية من A0 إلى B2، مع حفظ التقدّم في متصفحك.",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b1020",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* 🛠️ R303/ب5: تطبيق سمات الراحة قبل أول رسم — لا وميض داكنًا لمستخدم الوضع الفاتح */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var c=JSON.parse(localStorage.getItem("weg-komfort-v1")||"null");if(c){var d=document.documentElement;d.dataset.thema=c.thema==="hell"?"hell":"dunkel";d.dataset.schrift=(c.schrift==="gross"||c.schrift==="sehr")?c.schrift:"normal";}}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <BankenStart>
        <UiAppShell data-ui-shell="ui-app-shell">
          <main id="main-content" className="ui-main" tabIndex={-1}>
            {children}
          </main>
          <Navigation />
          <footer className="ui-footer">
            <span>طريقي إلى B2 · خطتك وتقدّمك محفوظان في هذا المتصفح.</span>
            <span aria-hidden className="ui-footer-dot">·</span>
            <a href="/masar" className="ui-footer-link">المسار</a>
            <span aria-hidden className="ui-footer-dot">·</span>
            <a href="/drucken" className="ui-footer-link">ورقة الشفرات</a>
          </footer>
        </UiAppShell>
        </BankenStart>
        <RegisterSW />
        <ErinnerungsWache />
        <KomfortInit />
      </body>
    </html>
  );
}
