"use client";
// 🗺️ A18 (R283): خريطة إنجاز مرئية — الطريق A0→B2 من PHASEN وخطة المتعلم الحقيقية، عرض فقط بلا روابط
import { PHASEN } from "@/lib/phasen";
import { TOTAL_DAYS, type Level, type Progress } from "@/lib/types";

const LEVELS: Level[] = ["A0", "A1", "A2", "B1", "B2"];
const ICON: Record<Level, string> = { A0: "🌱", A1: "🌿", A2: "🌳", B1: "🏔️", B2: "🏆" };

export function LernLandkarte({ progress }: { progress: Progress }) {
  const tage = progress.plan.days ?? {};
  const aktuell = progress.plan.day;
  const zeilen = LEVELS.map((lv) => {
    const von = PHASEN[lv].von;
    const bis = lv === "B2" ? TOTAL_DAYS : PHASEN[lv].bis;
    let fertig = 0;
    for (let d = von; d <= bis; d++) if (tage[d]?.closed) fertig++;
    const gesamt = bis - von + 1;
    return { lv, von, bis, gesamt, fertig, pct: Math.round((fertig / gesamt) * 100), hier: aktuell >= von && aktuell <= bis };
  });
  const gesamtFertig = zeilen.reduce((a, z) => a + z.fertig, 0);

  return (
    <section className="card fadein" data-testid="landkarte" style={{ padding: "1.1rem 1.3rem" }}>
      <div style={{ fontWeight: 900, fontSize: "1.05rem" }}>🗺️ خريطة إنجازك — من A0 إلى B2</div>
      <p style={{ fontSize: "0.82rem", color: "var(--color-ink2)" }}>
        كل محطة تُحسب من أيام خطّتك المغلقة فعليًا (<span className="rtl-num">{gesamtFertig}</span> من <span className="rtl-num">{TOTAL_DAYS}</span> يومًا). 🏁 = يوم اختبار نهاية المستوى.
      </p>
      <div style={{ display: "grid", gap: "0.55rem" }}>
        {zeilen.map((z) => (
          <div key={z.lv} style={{ border: `2px solid ${z.hier ? "var(--color-gold)" : "var(--color-line)"}`, borderRadius: 12, padding: "0.6rem 0.9rem", background: z.hier ? "var(--color-paper)" : "transparent" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.4rem" }}>
              <strong>{ICON[z.lv]} {z.lv} {z.hier && <span className="chip">📍 أنت هنا</span>}</strong>
              <span style={{ fontSize: "0.8rem", color: "var(--color-ink2)" }}>
                الأيام <span className="rtl-num">{z.von}–{z.bis}</span> · أغلقت <span className="rtl-num">{z.fertig}/{z.gesamt}</span> · <span className="rtl-num">{z.pct}٪</span> {z.lv !== "B2" && "· 🏁"}
              </span>
            </div>
            <div style={{ height: 10, borderRadius: 5, background: "var(--color-line)", marginTop: "0.4rem", overflow: "hidden" }}>
              <div style={{ width: `${z.pct}%`, height: "100%", background: z.pct === 100 ? "var(--color-a1)" : "var(--color-gold)", transition: "width .4s" }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
