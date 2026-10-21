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
  const [versuch, setVersuch] = useState(0);

  useEffect(() => {
    if (bankenBereit()) {
      setBereit(true);
      return;
    }
    let abgebrochen = false;
    setFehler(null);
    initialisiereBanken()
      .then(() => {
        if (!abgebrochen) setBereit(true);
      })
      .catch((e) => {
        if (!abgebrochen) setFehler(e instanceof Error ? e.message : String(e));
      });
    return () => {
      abgebrochen = true;
    };
  }, [versuch]);

  if (fehler) {
    return (
      <div dir="rtl" style={{ padding: "3rem 1.5rem", textAlign: "center", fontFamily: "system-ui, sans-serif" }}>
        <p style={{ fontSize: "1.25rem", fontWeight: 700 }}>تعذّر تحميل المحتوى</p>
        <p style={{ opacity: 0.75 }}>لم تصل ملفات البنوك ({fehler}). تحقّق من اتصالك ثم أعد المحاولة.</p>
        {/* 🛟 R305/ت15: زرّ إعادة محاولة خفيف بدل إجبار المستخدم على تحديث الصفحة كلها */}
        <button
          type="button"
          className="btn btn-primary"
          data-testid="banken-retry"
          style={{ marginTop: "1rem", minHeight: "46px" }}
          onClick={() => setVersuch((v) => v + 1)}
        >
          🔄 أعد المحاولة
        </button>
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
