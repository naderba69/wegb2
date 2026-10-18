"use client";
// 🗣️ A7 (R294): سيناريوهات تحدّث تفاعلية — تفاوض ومناقشة وشكوى ومقاطعة مهذبة
import { useState } from "react";
import { DIALOG_KATEGORIE_AR, DIALOGSZENARIEN } from "@/lib/dialogszenarien";
import { speakDe } from "@/lib/speech";

const STUFE_AR = { stark: "✅ حركة قوية", schwach: "🟡 ممكنة لكن ضعيفة", unhoeflich: "⛔ غير مهذبة/ضارة" } as const;

export function DialogSzenarien() {
  const [szenarioId, setSzenarioId] = useState(DIALOGSZENARIEN[0].id);
  const [zug, setZug] = useState(0);
  const [wahl, setWahl] = useState<number | null>(null);
  const [starke, setStarke] = useState(0);
  const s = DIALOGSZENARIEN.find((x) => x.id === szenarioId) ?? DIALOGSZENARIEN[0];
  const fertig = zug >= s.zuege.length;
  const aktuell = fertig ? null : s.zuege[zug];

  const waehleSzenario = (id: string) => { setSzenarioId(id); setZug(0); setWahl(null); setStarke(0); };

  return (
    <section className="card" data-testid="dialogszenarien" style={{ padding: "1rem 1.1rem", background: "var(--color-paper2)", display: "grid", gap: "0.6rem" }}>
      <strong>🗣️ تحدّث تفاعلي (A7) — تفاوض · مناقشة · شكوى · مقاطعة مهذبة</strong>
      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
        {DIALOGSZENARIEN.map((x) => (
          <button key={x.id} type="button" className="chip" data-testid={`szenario-${x.id}`} onClick={() => waehleSzenario(x.id)} style={{ cursor: "pointer", minHeight: "44px", background: x.id === szenarioId ? "var(--color-gold)" : undefined, color: x.id === szenarioId ? "var(--ui-on-accent)" : undefined }}>
            {DIALOG_KATEGORIE_AR[x.kategorie]}: {x.titelAr}
          </button>
        ))}
      </div>
      <div style={{ fontSize: "0.86rem", color: "var(--color-ink2)", lineHeight: 1.9 }}>{s.kontextAr} تدريب جلسة موجَّه — اسمع الشريك واختر حركتك؛ لا تقييم نطق هنا.</div>
      {!fertig && aktuell && (
        <>
          <div className="card" style={{ padding: "0.6rem 0.8rem" }}>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
              <strong>شريكك:</strong>
              <button type="button" className="btn btn-ghost" data-testid="szenario-hoeren" onClick={() => speakDe(aktuell.partnerDe)}>🔊 اسمعه</button>
            </div>
            <div className="de" dir="ltr" style={{ lineHeight: 1.9 }}>{aktuell.partnerDe}</div>
            <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)" }}>{aktuell.partnerAr}</div>
          </div>
          <div style={{ display: "grid", gap: "0.35rem" }}>
            {aktuell.optionen.map((o, i) => (
              <button
                key={i}
                type="button"
                className="btn"
                data-testid={`szenario-opt-${i}`}
                disabled={wahl !== null}
                onClick={() => { setWahl(i); if (o.stufe === "stark") setStarke((z) => z + 1); }}
                style={{ textAlign: "start", border: wahl === null ? undefined : o.stufe === "stark" ? "2px solid var(--color-good, #2e7d32)" : i === wahl ? "2px solid #c62828" : undefined }}
              >
                <span className="de" dir="ltr">{o.de}</span>
              </button>
            ))}
          </div>
          {wahl !== null && (
            <div data-testid="szenario-feedback" style={{ fontSize: "0.88rem", lineHeight: 1.9 }}>
              <strong>{STUFE_AR[aktuell.optionen[wahl].stufe]}.</strong> {aktuell.optionen[wahl].feedbackAr}
              <div><button className="btn btn-primary" data-testid="szenario-weiter" onClick={() => { setZug((z) => z + 1); setWahl(null); }}>{zug + 1 < s.zuege.length ? "الجولة التالية" : "إنهاء السيناريو"}</button></div>
            </div>
          )}
        </>
      )}
      {fertig && (
        <div data-testid="szenario-ergebnis" style={{ fontWeight: 800 }}>
          أنهيت «{s.titelAr}»: حركات قوية <span className="rtl-num">{starke}/{s.zuege.length}</span> — {starke === s.zuege.length ? "تفاوض نظيف من أول مرة!" : "أعد السيناريو وجرّب الحركات الخضراء لترسخ."}
          <button className="btn" data-testid="szenario-neustart" onClick={() => waehleSzenario(s.id)} style={{ marginInlineStart: "0.6rem" }}>إعادة</button>
        </div>
      )}
    </section>
  );
}
