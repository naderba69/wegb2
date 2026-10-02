"use client";
import { useState } from "react";
import { kapselSaetzeAbend, kapselAusTag } from "@/lib/kapsel";
import { speakDe } from "@/lib/speech";
import { De } from "@/components/De";

/**
 * 🌙 كبسولة الليلة — ثلاث جمل من دروس اليوم تُقرأ قبل النوم،
 * وتُسأل بعينها غداً في بوابة الجلسة. لا زرّ «قرأتها»: البرهان أداءُ الغد.
 */
export function TagesKapsel({ day, voiceName, rate }: { day: number; voiceName?: string; rate?: number }) {
  const [offen, setOffen] = useState(false);
  const saetze = kapselSaetzeAbend(day);
  const eigen = kapselAusTag(day);
  if (saetze.length === 0) return null;
  return (
    <section className="card" style={{ padding: "0.9rem 1.1rem", borderInlineStart: "5px solid var(--color-ink2)" }} data-testid="tageskapsel">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
        <div>
          <strong>🌙 كبسولة الليلة — 3 جمل قبل النوم</strong>
          <div style={{ fontSize: "0.82rem", color: "var(--color-ink2)" }}>
            {eigen ? "من دروس اليوم نفسه" : "من مخزون مستواك (يومٌ بلا مهمّة جمل)"} · ستُسألها بعينها غداً في بوابة الجلسة — لا زرَّ «قرأتها»: البرهانُ أداءُ الغد.
          </div>
        </div>
        <button className="btn btn-ghost" onClick={() => setOffen((o) => !o)} aria-expanded={offen} data-testid="kapsel-toggle">
          {offen ? "أخفِ" : "اعرض الكبسولة"}
        </button>
      </div>
      {offen && (
        <ol style={{ margin: "0.7rem 0 0", paddingInlineStart: "1.2rem", display: "grid", gap: "0.55rem" }}>
          {saetze.map((s) => (
            <li key={s.id} data-testid="kapsel-satz">
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "baseline", flexWrap: "wrap" }}>
                <span style={{ fontWeight: 700, fontSize: "1.05rem" }}><De>{s.de}</De></span>
                <button className="chip" style={{ cursor: "pointer" }} onClick={() => speakDe(s.de, { voiceName, rate })} aria-label="استمع">🔊</button>
              </div>
              <div style={{ fontSize: "0.88rem", color: "var(--color-ink2)" }}>{s.ar}</div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
