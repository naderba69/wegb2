"use client";
import { useEffect, useState, type ReactNode } from "react";
import { bankenBereit, initialisiereBanken } from "@/lib/bankload";

/**
 * R163: Starttor für die Banken. In Node sind die Banken synchron da (Prerender/Tests);
 * im Browser lädt der erste Render eine Hülle, dann füllt `/banks.json` alle Container —
 * erst danach rendern die Kinder, damit kein leerer Bankzustand je sichtbar wird.
 * Der Ausgangszustand ist auf Server und Client identisch (Hülle) → keine Hydration-Differenz.
 */
export default function BankenStart({ children }: { children: ReactNode }) {
  const [bereit, setBereit] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);

  useEffect(() => {
    if (bankenBereit()) {
      setBereit(true);
      return;
    }
    initialisiereBanken()
      .then(() => setBereit(true))
      .catch((e) => setFehler(e instanceof Error ? e.message : String(e)));
  }, []);

  if (fehler) {
    return (
      <div dir="rtl" style={{ padding: "3rem 1.5rem", textAlign: "center", fontFamily: "system-ui, sans-serif" }}>
        <p style={{ fontSize: "1.25rem", fontWeight: 700 }}>تعذّر تحميل المحتوى</p>
        <p style={{ opacity: 0.75 }}>لم تصل ملفات البنوك ({fehler}). حدّث الصفحة أو أعد المحاولة.</p>
      </div>
    );
  }
  if (!bereit) {
    return (
      <div dir="rtl" style={{ padding: "3rem 1.5rem", textAlign: "center", fontFamily: "system-ui, sans-serif" }} aria-busy="true">
        <p style={{ fontSize: "1.5rem", fontWeight: 800 }}>طريقي إلى B2</p>
        <p style={{ opacity: 0.75 }}>جارٍ تحميل المحتوى…</p>
      </div>
    );
  }
  return <>{children}</>;
}
