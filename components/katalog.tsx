"use client";
// 📚 دليل الأجنحة (Modulhandbuch) + 📈 شبكة الكفاءات — العمود الفقري المرئي للنظام
// يُولَّد كله من سجلّ الأنشطة الموحّد (lib/aktivitaeten.ts) — لا قوائم متناثرة.
import type { Progress } from "@/lib/types";
import { AKTIVITAETEN, FLUEGEL_META, type Fluegel } from "@/lib/aktivitaeten";
import { KOMPETENZEN, KOMPETENZ_AR, kompetenzWerte, b2Score, band } from "@/lib/kompetenz";

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

/** شبكة الكفاءات الست + الدرجة الموحّدة B2-Score — شريط دائم فوق كل شيء. */
export function RadarKarte({ progress }: { progress: Progress }) {
  const w = kompetenzWerte(progress);
  const score = b2Score(progress);
  const b = band(score);
  const R = 74, cx = 95, cy = 92;
  const pts = KOMPETENZEN.map((h, i) => {
    const ang = (Math.PI / 3) * i - Math.PI / 2;
    const r = (w[h].wert / 100) * R;
    return { x: cx + r * Math.cos(ang), y: cy + r * Math.sin(ang), h, ang };
  });
  const poly = pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  return (
    <div className="card fadein" style={{ padding: "1.1rem 1.3rem" }}>
      <div style={{ display: "flex", gap: "1.2rem", flexWrap: "wrap", alignItems: "center" }}>
        <svg width="190" height="185" viewBox="0 0 190 185" aria-label="شبكة الكفاءات">
          {[1, 0.66, 0.33].map((f) => (
            <polygon key={f} points={KOMPETENZEN.map((_, i) => {
              const ang = (Math.PI / 3) * i - Math.PI / 2;
              return `${cx + R * f * Math.cos(ang)},${cy + R * f * Math.sin(ang)}`;
            }).join(" ")} fill="none" stroke="var(--color-line)" strokeWidth="1" />
          ))}
          {pts.map((p) => (
            <line key={p.h} x1={cx} y1={cy} x2={cx + R * Math.cos(p.ang)} y2={cy + R * Math.sin(p.ang)} stroke="var(--color-line)" />
          ))}
          <polygon points={poly} fill="var(--color-cola-soft)" stroke="var(--color-cola)" strokeWidth="2" />
          {pts.map((p) => {
            const lx = cx + (R + 18) * Math.cos(p.ang), ly = cy + (R + 16) * Math.sin(p.ang);
            return (
              <text key={p.h} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "10.5px", fill: "var(--color-ink2)", fontWeight: 700 }}>
                {HAND[p.h]}{Math.round(w[p.h].wert)}
              </text>
            );
          })}
        </svg>
        <div style={{ flex: 1, minWidth: "15rem" }}>
          <div style={{ fontWeight: 900, fontSize: "1.05rem", color: "var(--color-cola)" }}>📈 شبكة الكفاءات — Kompetenzprofil</div>
          <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)", margin: "0.2rem 0 0.55rem" }}>
            كل محرّك يغذّي هذه الشبكة الستّة — درجة واحدة صادقة لا تكالب شارات متفرقة.
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.6rem" }}>
            <span style={{ fontSize: "2.3rem", fontWeight: 900, color: b.farbe, lineHeight: 1 }}><span className="rtl-num">{score}</span></span>
            <span className="chip" style={{ borderColor: b.farbe, color: b.farbe, fontWeight: 800 }}>{b.name} — {b.ar}</span>
            <span style={{ fontSize: "0.75rem", color: "var(--color-ink2)" }}>B2-Score / 100</span>
          </div>
          <div style={{ display: "grid", gap: "0.28rem", marginTop: "0.6rem" }}>
            {KOMPETENZEN.map((h) => (
              <div key={h} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem" }}>
                <span style={{ width: "5.4rem" }}>{HAND[h]} {KOMPETENZ_AR[h]}</span>
                <span className="progressbar" style={{ flex: 1, height: 8 }}>
                  <span style={{ display: "block", width: `${w[h].wert}%`, height: "100%", background: "var(--color-cola)" }} />
                </span>
                <span className="rtl-num" style={{ width: "1.6rem", textAlign: "end" }}>{w[h].wert}</span>
                <span style={{ fontSize: "0.66rem", color: "var(--color-ink2)", width: "3.2rem" }}>
                  {w[h].kern !== null ? `مسجَّل ${w[h].versuche}` : "تقديري"}
                </span>
              </div>
            ))}
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
        خريطة المنهج كاملة: ما هو قيد التشغيل ✓ وما هو قيد الإعداد ⏳ — كل نشاط يمرّ بخطّي الأنبوب: شبكة الكفاءات ودفتر الأخطاء.
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
