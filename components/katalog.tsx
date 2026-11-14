"use client";
// 📚 دليل الأجنحة (Modulhandbuch) + 📈 سجل دليل التدريب — العمود الفقري المرئي للنظام
// يُولَّد كله من سجلّ الأنشطة الموحّد (lib/aktivitaeten.ts) — لا قوائم متناثرة.
import type { Progress } from "@/lib/types";
import { AKTIVITAETEN, FLUEGEL_META, type Fluegel } from "@/lib/aktivitaeten";
import { KOMPETENZEN, KOMPETENZ_AR, kompetenzWerte, evidenzUebersicht } from "@/lib/kompetenz";

const HAND: Record<string, string> = {
  Lesen: "📖", Hoeren: "👂", Schreiben: "✍️", Sprechen: "🗣️", Grammatik: "🧩", Wortschatz: "🗂️",
};

/** ترويسة جناح: اسم + غايته + فهرس أنشطته من السجلّ. */
export function WingKopf({ fluegel }: { fluegel: Fluegel }) {
  const meta = FLUEGEL_META.find((f) => f.id === fluegel)!;
  const acts = AKTIVITAETEN.filter((a) => a.fluegel === fluegel);
  return (
    <div id={`wing-${fluegel}`} className="card" style={{ padding: "0.9rem 1.2rem", borderInlineStart: "5px solid var(--color-cola)", background: "var(--color-cola-soft)" }}>
      <div style={{ fontWeight: 900, fontSize: "1.08rem", color: "var(--color-cola)" }}>{meta.emoji} {meta.titel}</div>
      <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)", margin: "0.15rem 0 0.45rem" }}>{meta.unter}</div>
      <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
        {acts.map((a) => (
          <span key={a.id} className="chip" style={{ fontSize: "0.72rem", opacity: a.status === "geplant" ? 0.55 : 1 }} title={a.merkmal}>
            {a.emoji} {a.titel.split(" — ")[0]} {a.status === "geplant" ? "⏳" : ""}
          </span>
        ))}
      </div>
    </div>
  );
}

/** سجل المجالات الستة: يفصل الأداء المقاس عن النشاط والتقييم الذاتي. */
export function RadarKarte({ progress }: { progress: Progress }) {
  const w = kompetenzWerte(progress);
  const evidence = evidenzUebersicht(progress);
  const R = 74, cx = 95, cy = 92;
  const pts = KOMPETENZEN.map((h, i) => {
    const ang = (Math.PI / 3) * i - Math.PI / 2;
    const r = ((w[h].wert ?? 0) / 100) * R;
    return { x: cx + r * Math.cos(ang), y: cy + r * Math.sin(ang), h, ang };
  });
  const poly = pts.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");
  return (
    <div className="card fadein" style={{ padding: "1.1rem 1.3rem" }} data-testid="training-evidence-card">
      <div style={{ display: "flex", gap: "1.2rem", flexWrap: "wrap", alignItems: "center" }}>
        <svg width="190" height="185" viewBox="0 0 190 185" aria-label="الأداء التدريبي المقاس؛ القيم المجهولة تظهر بلا نقاط">
          {[1, 0.66, 0.33].map((f) => (
            <polygon key={f} points={KOMPETENZEN.map((_, i) => {
              const ang = (Math.PI / 3) * i - Math.PI / 2;
              return `${cx + R * f * Math.cos(ang)},${cy + R * f * Math.sin(ang)}`;
            }).join(" ")} fill="none" stroke="var(--color-line)" strokeWidth="1" />
          ))}
          {pts.map((point) => (
            <line key={point.h} x1={cx} y1={cy} x2={cx + R * Math.cos(point.ang)} y2={cy + R * Math.sin(point.ang)} stroke="var(--color-line)" />
          ))}
          <polygon points={poly} fill="var(--color-cola-soft)" stroke="var(--color-cola)" strokeWidth="2" />
          {pts.map((point) => {
            const lx = cx + (R + 18) * Math.cos(point.ang), ly = cy + (R + 16) * Math.sin(point.ang);
            return (
              <text key={point.h} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "10.5px", fill: "var(--color-ink2)", fontWeight: 700 }}>
                {HAND[point.h]}{w[point.h].wert ?? "—"}
              </text>
            );
          })}
        </svg>
        <div style={{ flex: 1, minWidth: "15rem" }}>
          <div style={{ fontWeight: 900, fontSize: "1.05rem", color: "var(--color-cola)" }}>📈 سجل التدريب والأداء الداخلي</div>
          <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)", margin: "0.2rem 0 0.55rem", lineHeight: 1.7 }}>
            الأداء لا يظهر إلا بعد 8 أدلة مقاسة صريحة في المجال. الإكمال والتقييم الذاتي محفوظان منفصلين ولا يصنعان مستوى CEFR أو جاهزية امتحان.
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.6rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "2.1rem", fontWeight: 900, color: "var(--color-cola)", lineHeight: 1 }}>
              <span className="rtl-num">{evidence.completeTrainingPerformance ?? "—"}</span>
            </span>
            <span className="chip" style={{ fontWeight: 800 }}>
              {evidence.completeTrainingPerformance === null ? "العينة غير مكتملة" : "متوسط أداء تدريبي داخلي"}
            </span>
            <span style={{ fontSize: "0.75rem", color: "var(--color-ink2)" }}>
              مجالات بعينة كافية: <span className="rtl-num">{evidence.measuredSkills}/{evidence.requiredSkills}</span>
            </span>
          </div>
          <div style={{ display: "grid", gap: "0.32rem", marginTop: "0.6rem" }}>
            {KOMPETENZEN.map((h) => (
              <div key={h} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem" }}>
                <span style={{ width: "5.4rem" }}>{HAND[h]} {KOMPETENZ_AR[h]}</span>
                <span className="progressbar" style={{ flex: 1, height: 8 }}>
                  <span style={{ display: "block", width: `${w[h].wert ?? 0}%`, height: "100%", background: w[h].wert === null ? "var(--color-line)" : "var(--color-cola)" }} />
                </span>
                <span className="rtl-num" style={{ width: "2rem", textAlign: "end" }}>{w[h].wert === null ? "—" : `${w[h].wert}%`}</span>
                <span style={{ fontSize: "0.66rem", color: "var(--color-ink2)", minWidth: "8.2rem" }}>
                  مقاس {w[h].measured} · ذاتي {w[h].selfReported} · نشاط {w[h].activity}
                </span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "0.55rem", fontSize: "0.72rem", color: "var(--color-ink2)" }} data-testid="exam-readiness-not-assessed">
            جاهزية الامتحان: غير مقاسة في التطبيق؛ تحتاج بنوداً مُعايرة ومقيّماً خارجياً، لا XP أو إغلاق أيام.
          </div>
        </div>
      </div>
    </div>
  );
}

/** دليل الأجنحة: كل الأنشطة الحقيقية والمخططة في أربعة أعمدة أكاديمية. */
export function KatalogLeiste() {
  return (
    <div className="card fadein" style={{ padding: "1rem 1.2rem" }}>
      <div style={{ fontWeight: 900, fontSize: "1.05rem", color: "var(--color-cola)" }}>📘 دليل الأجنحة — Modulhandbuch</div>
      <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)", margin: "0.2rem 0 0.7rem" }}>
        خريطة المنهج كاملة: ما هو قيد التشغيل ✓ وما هو قيد الإعداد ⏳ — النشاط والتقييم الذاتي والأداء المقاس تبقى أنواع دليل منفصلة، مع دفتر أخطاء مستقل.
      </div>
      <div style={{ display: "grid", gap: "0.8rem", gridTemplateColumns: "repeat(auto-fit, minmax(14.5rem, 1fr))" }}>
        {FLUEGEL_META.map((f) => (
          <div key={f.id} style={{ border: "1px solid var(--color-line)", borderRadius: 12, padding: "0.65rem 0.75rem", background: "var(--color-paper)" }}>
            <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--color-cola)", marginBottom: "0.35rem" }}>{f.emoji} {f.titel.split(" — ")[0]}</div>
            {AKTIVITAETEN.filter((a) => a.fluegel === f.id).map((a) => (
              <div key={a.id} style={{ display: "flex", gap: "0.35rem", alignItems: "baseline", fontSize: "0.74rem", padding: "0.16rem 0", opacity: a.status === "geplant" ? 0.55 : 1 }}>
                <span>{a.status === "live" ? "✅" : "⏳"}</span>
                <span style={{ fontWeight: 700 }}>{a.emoji} {a.titel}</span>
                <span style={{ color: "var(--color-ink2)", fontSize: "0.66rem" }}>
                  {a.handlung.map((h) => HAND[h]).join("")}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
