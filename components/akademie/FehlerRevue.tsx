"use client";
import { useState } from "react";
import type { Progress } from "@/lib/types";
import { dueFehlerPriorisiert } from "@/lib/fehlerbank2";
import { gradeFehlerNow } from "@/lib/store";

/**
 * 🩹 محطة «مراجعة الأخطاء المتكرّقة» — قبل إغلاق اليوم (K105):
 * لا يُغلق يومٌ وماضيه مفتوح. تُعرض أقدم الأخطاء المستحقّة (الأولوية
 * بحسب تكرارها وثقتها)، ثم يُكشف الجواب بضغطة، ثم تقييم ذاتي
 * (✓ ثابت / ✗ أعيده) يمرّ عبر gradeFehlerNow نفسه المستعمل في SRS —
 * لا إقرار بلا مصحِّح.
 */
export function FehlerRevue({ progress }: { progress: Progress }) {
  const due = dueFehlerPriorisiert(progress, 5);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [graded, setGraded] = useState<Record<string, boolean>>({});

  const sichtbar = due.filter((f) => !graded[f.key]);
  if (sichtbar.length === 0) return null;

  return (
    <section
      data-testid="fehler-revue"
      className="card"
      style={{ padding: "0.9rem 1.1rem", borderInlineStart: "5px solid var(--color-gold)", marginBlock: "0.4rem" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "0.5rem", flexWrap: "wrap" }}>
        <strong>🩹 مراجعة الأخطاء المتكرّقة</strong>
        <span style={{ fontSize: "0.82rem", color: "var(--color-ink2)" }}>
          {sichtbar.length} أخطاء مستحقّة — لا يُغلق اليوم قبلها
        </span>
      </div>
      <ul style={{ listStyle: "none", margin: "0.7rem 0 0", padding: 0, display: "grid", gap: "0.55rem" }}>
        {sichtbar.map((f) => {
          const auf = !!revealed[f.key];
          return (
            <li key={f.key} data-testid="revue-fehler" style={{ border: "1px solid var(--color-line)", borderRadius: "0.7rem", padding: "0.6rem 0.75rem", background: "var(--color-card)" }}>
              <div style={{ fontSize: "0.92rem", color: "var(--color-ink)" }} dir="auto">
                <span style={{ textDecoration: "line-through", color: "var(--color-die)" }}>{f.falsch}</span>
                {auf && (
                  <>
                    {"  →  "}
                    <strong style={{ color: "var(--color-a1)" }}>{f.richtig}</strong>
                  </>
                )}
              </div>
              {f.ar && <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)", marginTop: "0.15rem" }}>{f.ar}</div>}
              {f.srs.lapses >= 3 && (
                <div
                  data-testid="revue-escalation"
                  style={{ fontSize: "0.8rem", marginTop: "0.3rem", color: "var(--color-die)", fontWeight: 800 }}
                >
                  ⚠️ تكرّر {f.srs.lapses} مرات — مسؤوله «{f.art}»: قاعدتُنا ثلاثُ ضرباتٍ ⇒ درسٌ مسؤولٌ وتدريبٌ مركَّزٌ يفتحان مع باب «الدرس».
                </div>
              )}
              {!auf ? (
                <button
                  type="button"
                  className="btn btn-ghost"
                  data-testid="revue-zeigen"
                  style={{ minHeight: "44px", marginTop: "0.35rem" }}
                  onClick={() => setRevealed((r) => ({ ...r, [f.key]: true }))}
                >
                  أظهر الصواب
                </button>
              ) : (
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.4rem" }}>
                  <button
                    type="button"
                    className="btn"
                    data-testid="revue-fest"
                    style={{ minHeight: "44px", flex: 1, background: "var(--color-a1)", color: "var(--ui-on-accent)", border: "none" }}
                    onClick={() => {
                      gradeFehlerNow(f.key, true);
                      setGraded((g) => ({ ...g, [f.key]: true }));
                    }}
                  >
                    ✓ ثابت في ذاكرتي
                  </button>
                  <button
                    type="button"
                    className="btn"
                    data-testid="revue-erneut"
                    style={{ minHeight: "44px", flex: 1, background: "var(--color-die)", color: "white", border: "none" }}
                    onClick={() => {
                      gradeFehlerNow(f.key, false);
                      setGraded((g) => ({ ...g, [f.key]: true }));
                    }}
                  >
                    ✗ أعده المستقبَل
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
