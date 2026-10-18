"use client";
// 🎭 A25 (R293): براغماتية دقيقة — اختر الصيغة الألطف فعليًا في الموقف
import { useState } from "react";
import { PRAGMATIK, PRAGMATIK_KATEGORIE_AR } from "@/lib/pragmatik";

export function PragmatikKarte() {
  const [idx, setIdx] = useState(0);
  const [wahl, setWahl] = useState<number | null>(null);
  const [punkte, setPunkte] = useState(0);
  const s = PRAGMATIK[idx % PRAGMATIK.length];
  return (
    <section className="card" data-testid="pragmatik" style={{ padding: "1rem 1.1rem", background: "var(--color-paper2)", display: "grid", gap: "0.55rem" }}>
      <strong>🎭 براغماتية دقيقة (A25) — {PRAGMATIK_KATEGORIE_AR[s.kategorie]}</strong>
      <div style={{ fontSize: "0.9rem", lineHeight: 1.9 }}>{s.situationAr}</div>
      <div style={{ display: "grid", gap: "0.35rem" }}>
        {s.optionen.map((o, i) => (
          <button
            key={i}
            type="button"
            className="btn"
            data-testid={`pragmatik-opt-${i}`}
            disabled={wahl !== null}
            onClick={() => { setWahl(i); if (i === s.richtig) setPunkte((p) => p + 1); }}
            style={{ textAlign: "start", border: wahl === null ? undefined : i === s.richtig ? "2px solid var(--color-good, #2e7d32)" : i === wahl ? "2px solid #c62828" : undefined }}
          >
            <span className="de" dir="ltr">{o}</span>
          </button>
        ))}
      </div>
      {wahl !== null && (
        <div data-testid="pragmatik-feedback" style={{ fontSize: "0.88rem", lineHeight: 1.9 }}>
          {wahl === s.richtig ? "✓ هذه هي الألطف فعليًا. " : "✗ ليست الأنسب اجتماعيًا. "}{s.erklaerungAr}
          <div>
            <button className="btn" data-testid="pragmatik-naechste" onClick={() => { setIdx((x) => x + 1); setWahl(null); }}>موقف آخر</button>
            <span style={{ marginInlineStart: "0.6rem", fontSize: "0.84rem" }}>أصبت <span className="rtl-num">{punkte}</span> حتى الآن — تدريب جلسة، لا درجة.</span>
          </div>
        </div>
      )}
    </section>
  );
}
