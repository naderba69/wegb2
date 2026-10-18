"use client";
// 🌳 A22 (R293): عائلات كلمات واشتقاق منهجي من بنك مفرداتك نفسه
import { useMemo, useState } from "react";
import { ableitungsFrage, wortfamilien } from "@/lib/wortfamilien";

export function WortfamilienStation() {
  const familien = useMemo(() => wortfamilien(3, 12), []);
  const [famIdx, setFamIdx] = useState(0);
  const [frageIdx, setFrageIdx] = useState(0);
  const [wahl, setWahl] = useState<number | null>(null);
  const familie = familien[famIdx];
  const frage = useMemo(() => (familie ? ableitungsFrage(familie, frageIdx) : null), [familie, frageIdx]);
  if (!familie || !frage) return null;
  return (
    <section className="card" data-testid="wortfamilien" style={{ padding: "1rem 1.1rem", background: "var(--color-paper2)", display: "grid", gap: "0.6rem" }}>
      <strong>🌳 عائلات الكلمات والاشتقاق (A22)</strong>
      <div style={{ fontSize: "0.84rem", color: "var(--color-ink2)", lineHeight: 1.9 }}>
        عائلات مجمّعة آليًا من بنك مفرداتك بجذر تقريبي — الأعضاء حقيقية من بطاقاتك، والتجميع تقريبي لا علم أصول. اختر عائلة وتدرّب على أشكالها (-ung/-heit/-keit/-bar/-los…).
      </div>
      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
        {familien.map((f, i) => (
          <button key={f.stamm} type="button" className="chip" data-testid={`familie-${f.stamm}`} onClick={() => { setFamIdx(i); setFrageIdx(0); setWahl(null); }} style={{ cursor: "pointer", background: i === famIdx ? "var(--color-gold)" : undefined, color: i === famIdx ? "var(--ui-on-accent)" : undefined, minHeight: "44px" }}>
            <span className="de" dir="ltr">{f.stamm}…</span> ({f.mitglieder.length})
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
        {familie.mitglieder.map((m) => (
          <span key={m.karte.id} className="chip" style={{ fontSize: "0.8rem" }}>
            <span className="de" dir="ltr" style={{ fontWeight: 700 }}>{m.karte.de}</span>{m.suffix ? ` · -${m.suffix}` : ""} — {m.karte.ar}
          </span>
        ))}
      </div>
      <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{frage.frageAr}</div>
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
        {frage.optionen.map((o, i) => (
          <button
            key={i}
            type="button"
            className="btn"
            data-testid={`ableitung-opt-${i}`}
            onClick={() => setWahl(i)}
            style={{ border: wahl === null ? undefined : i === frage.richtig ? "2px solid var(--color-good, #2e7d32)" : i === wahl ? "2px solid #c62828" : undefined }}
          >
            <span className="de" dir="ltr">{o}</span>
          </button>
        ))}
      </div>
      {wahl !== null && (
        <div data-testid="ableitung-feedback" style={{ fontWeight: 700, fontSize: "0.88rem" }}>
          {wahl === frage.richtig ? "✓ صحيح — هذا الشكل في بنكك فعلًا." : "✗ هذا الشكل مولّد للتمرين وليس في بنكك — الصحيح مُخضرّ."}
          <button className="btn" data-testid="ableitung-naechste" onClick={() => { setFrageIdx((f) => f + 1); setWahl(null); }} style={{ marginInlineStart: "0.6rem" }}>عضو آخر</button>
        </div>
      )}
    </section>
  );
}
