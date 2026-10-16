"use client";
/**
 * 🌡️ U2/R188 — بطاقة الأسبوع الصادقة: أيام أُغلقت فعلًا، مهام أُنجزت،
 * دقائق قاسها المؤقّت، وهدفٌ من إيقاع المتعلّم نفسه. كلّ رقم قابل
 * للتتبّع إلى سطرٍ في سجلّ تقدّمه — لا نقاط زينة.
 */
import { useMemo } from "react";
import type { Progress } from "@/lib/types";
import { wochenBilanz, streakAusVerlauf } from "@/lib/motivation";

const WOCHENTAGE = ["الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد"];

function heuteIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function WochenZielKarte({ progress }: { progress: Progress }) {
  const heute = heuteIso();
  const bilanz = useMemo(() => wochenBilanz(progress, heute), [progress, heute]);
  const streak = useMemo(() => streakAusVerlauf(progress, heute), [progress, heute]);

  return (
    <section className="card" data-testid="wochen-ziel" style={{ padding: "0.85rem 1rem", display: "grid", gap: "0.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "0.4rem" }}>
        <strong>📆 أسبوعك من سجلّك</strong>
        <span className="tiny muted">ابتداءً من {bilanz.montag}</span>
      </div>
      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }} role="list" aria-label="أيام الأسبوع">
        {bilanz.tage.map((t, i) => (
          <span
            key={t.datum}
            role="listitem"
            className="chip"
            title={`${WOCHENTAGE[i]} ${t.datum}${t.aktiv ? " — يوم مغلق في سجلّك" : ""}`}
            style={{
              minHeight: "38px",
              fontWeight: t.heute ? 900 : 600,
              background: t.aktiv ? "var(--color-a1)" : undefined,
              color: t.aktiv ? "var(--ui-on-accent)" : undefined,
              outline: t.heute ? "2px solid var(--color-cola)" : undefined,
            }}
          >
            {t.aktiv ? "✓" : "·"} {WOCHENTAGE[i].slice(0, 5)}
          </span>
        ))}
      </div>
      <div style={{ fontSize: "0.92rem", lineHeight: 2 }}>
        أغلقتَ <strong>{bilanz.aktiveTage}</strong> {bilanz.aktiveTage === 1 ? "يومًا" : "أيام"} هذا الأسبوع من أصل هدف{" "}
        <strong>{bilanz.zielTage}</strong>
        {bilanz.zielAusVerlauf ? " (من متوسط أيامك النشطة في أسابيعك الأربعة الماضية)" : " (هدف بداية — سيتكيّف مع إيقاعك حين يتكوّن سجلّك)"}
        {bilanz.zielErreicht ? " — بلغتَه ✓" : ""} ·
        أنجزت <strong>{bilanz.aufgabenErledigt}</strong> مهمة في تلك الأيام ·
        وقاس مؤقّت الجلسات <strong>{bilanz.minutenGemessen}</strong> دقيقة فيها
        {streak > 1 ? <> · سلسلة أيامك المغلقة المتتالية: <strong>{streak}</strong></> : ""}.
      </div>
      <p className="tiny muted" style={{ margin: 0, lineHeight: 1.9 }}>
        كلّ رقم هنا يُعاد حسابه من سجلّ أيامك المغلقة ودقائقها المقاسة — لا نقدّم نقاطًا ولا أهدافًا مفروضة من خارج إيقاعك.
      </p>
    </section>
  );
}
