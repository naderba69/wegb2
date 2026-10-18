"use client";
// 🔎 M10 (R290): أول ظهور لقاعدة الأسبوع الجديدة ملوّنًا + سؤال ملاحظة واحد
import { useMemo, useState } from "react";
import { bemerkenFrage, type WochenRegel } from "@/lib/bemerken";

export function BemerkenKarte({ textDe, regeln }: { textDe: string; regeln: WochenRegel[] }) {
  const frage = useMemo(() => bemerkenFrage(textDe, regeln), [textDe, regeln]);
  const [wahl, setWahl] = useState<number | null>(null);
  if (!frage) return null;
  const teile = frage.belegSatz.split(frage.beleg);
  return (
    <div data-testid="bemerken-karte" style={{ margin: "0.8rem 0 0.4rem", padding: "0.7rem 0.9rem", borderRadius: "8px", background: "var(--color-gold-soft)", borderInlineStart: "4px solid var(--color-gold)", fontSize: "0.88rem", display: "grid", gap: "0.45rem" }}>
      <div style={{ fontWeight: 800 }}>🔎 لاحظ القاعدة الجديدة ({frage.nameDe} — {frage.nameAr})</div>
      <div>
        أول ظهور لها في نصّك ملوّن هنا:{" "}
        <span className="de" dir="ltr" style={{ lineHeight: 1.9 }}>
          {teile.map((t, i) => (
            <span key={i}>{t}{i < teile.length - 1 && <mark style={{ background: "var(--color-gold)", padding: "0 0.2rem", borderRadius: "0.25rem" }}>{frage.beleg}</mark>}</span>
          ))}
        </span>
      </div>
      <div style={{ fontWeight: 700 }}>سؤال ملاحظة واحد: أيّ جملة فيها «{frage.nameAr}»؟</div>
      <div style={{ display: "grid", gap: "0.35rem" }}>
        {frage.saetze.map((s, i) => (
          <button
            key={i}
            type="button"
            className="btn"
            data-testid={`bemerken-option-${i}`}
            onClick={() => setWahl(i)}
            style={{ textAlign: "start", border: wahl === null ? undefined : i === frage.richtig ? "2px solid var(--color-good, #2e7d32)" : i === wahl ? "2px solid #c62828" : undefined }}
          >
            <span className="de" dir="ltr">{s}</span>
          </button>
        ))}
      </div>
      {wahl !== null && (
        <div data-testid="bemerken-feedback" style={{ fontWeight: 700 }}>
          {wahl === frage.richtig ? "✓ صحيح — الشاهد بالضبط ما لُوّن أعلاه." : "✗ ليس هذا — قارن بالشاهد الملوّن أعلاه ثم انظر للجملة الصحيحة المُخضرّة."}
        </div>
      )}
      <div style={{ fontSize: "0.76rem", color: "var(--color-ink2)" }}>الرصد سطحي بالأنماط (رادار النصوص) — شاهد حقيقي من نصّك، لا تحليل نحوي عميق.</div>
    </div>
  );
}
