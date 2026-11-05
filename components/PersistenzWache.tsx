"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PROGRESS_SAVE_ERROR_EVENT } from "@/lib/store";

/** Sichtbare, globale Warnung statt stiller Datenverluste bei blockiertem/vollem localStorage. */
export function PersistenzWache() {
  const [fehler, setFehler] = useState(false);

  useEffect(() => {
    const melden = () => setFehler(true);
    window.addEventListener(PROGRESS_SAVE_ERROR_EVENT, melden);
    return () => window.removeEventListener(PROGRESS_SAVE_ERROR_EVENT, melden);
  }, []);

  if (!fehler) return null;
  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        position: "fixed",
        insetInline: "0.75rem",
        bottom: "5.5rem",
        zIndex: 1000,
        maxWidth: "52rem",
        marginInline: "auto",
        padding: "0.8rem 1rem",
        borderRadius: "0.75rem",
        border: "2px solid var(--color-cola)",
        background: "var(--ui-surface-raised)",
        boxShadow: "0 8px 30px rgb(0 0 0 / 0.28)",
        lineHeight: 1.8,
      }}
    >
      <strong>⛔ لم يُحفَظ آخر تغيير.</strong>{" "}
      تخزين المتصفح ممتلئ أو محظور؛ أبقينا الحالة المحفوظة السابقة ولم نعرض نجاحاً وهمياً.
      حرّر مساحة أو اسمح بالتخزين، ثم أعد المحاولة. يمكنك مراجعة النسخ الاحتياطي من{" "}
      <Link href="/einstellungen">الإعدادات</Link>.
      <button type="button" className="btn btn-ghost" onClick={() => setFehler(false)} style={{ marginInlineStart: "0.6rem", minHeight: "44px" }}>
        فهمت
      </button>
    </div>
  );
}
