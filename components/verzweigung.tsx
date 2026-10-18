"use client";
// 🌿 A20 (R296): تفرّع إتقان — تسريع/تثبيت مقترح بأسبابه، والخطة الكنسية لا تُمسّ
import { planVerzweigung } from "@/lib/verzweigung";
import type { Progress } from "@/lib/types";

const ART_AR = { beschleunigen: "🚀 فرع التسريع", normal: "🌿 المسار العادي", festigen: "🧱 فرع التثبيت" } as const;

export function VerzweigungPanel({ progress }: { progress: Progress }) {
  const v = planVerzweigung(progress);
  return (
    <div data-testid="verzweigung-panel" className="card" style={{ padding: "0.9rem 1.1rem", background: "var(--color-paper)", fontSize: "0.88rem", display: "grid", gap: "0.3rem" }}>
      <div style={{ fontWeight: 900 }}>🌿 تفرّع الإتقان (A20) — {ART_AR[v.art]}</div>
      <div style={{ lineHeight: 1.9 }}>
        مستواك الحالي {v.level}: احتفاظ البطاقات {v.retention === null ? "غير محسوب بعد" : `${Math.round(v.retention * 100)}٪`} من <span className="rtl-num">{v.karten}</span> بطاقة مُدخلة. {v.grundAr}
      </div>
      <div style={{ fontSize: "0.78rem", color: "var(--color-ink2)" }}>
        التفرّع يوجّه تدريبك الحرّ فقط — خطة الـ378 يومًا وبواباتها وسقوفها لا تتغيّر ولا تُكسر.
      </div>
    </div>
  );
}
