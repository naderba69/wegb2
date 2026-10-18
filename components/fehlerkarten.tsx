"use client";
// 🧪 M8 (R288): تحويل أخطاء الكتابة المصحَّحة إلى بطاقات «مختبر أخطاء» —
// الاختيار فردي بيد المتعلم، ولا يدخل الدفترَ شيءٌ بلا تأكيده.
import { useState } from "react";
import { loadProgress, saveProgress } from "@/lib/store";
import { upsertFehler } from "@/lib/fehler";
import type { FehlerEintrag } from "@/lib/types";

export interface KartenVorschlag {
  falsch: string;
  richtig: string;
  ar: string;
  art: FehlerEintrag["art"];
}

export function FehlerKartenWahl({ eintraege, quelle }: { eintraege: KartenVorschlag[]; quelle: string }) {
  const [wahl, setWahl] = useState<Set<number>>(() => new Set(eintraege.map((_, i) => i)));
  const [fertig, setFertig] = useState(false);
  if (eintraege.length === 0) return null;

  const umwandeln = () => {
    let p = loadProgress();
    eintraege.forEach((e, i) => {
      if (wahl.has(i)) p = upsertFehler(p, { ...e, quelle });
    });
    saveProgress(p);
    setFertig(true);
  };

  return (
    <div data-testid="fehlerkarten-wahl" style={{ display: "grid", gap: "0.35rem", marginTop: "0.5rem" }}>
      <div style={{ fontWeight: 800, fontSize: "0.9rem" }}>🧪 مختبر الأخطاء: أكّد ما يدخل دفترك (M8)</div>
      {eintraege.map((e, i) => (
        <label key={i} style={{ display: "flex", gap: "0.45rem", alignItems: "baseline", fontSize: "0.86rem" }}>
          <input
            type="checkbox"
            data-testid={`fehlerkarte-${i}`}
            checked={wahl.has(i)}
            onChange={() => setWahl((alt) => { const n = new Set(alt); if (n.has(i)) n.delete(i); else n.add(i); return n; })}
          />
          <span><span className="de" style={{ fontWeight: 700 }}>{e.falsch}</span> ← <span className="de">{e.richtig}</span> · {e.ar}</span>
        </label>
      ))}
      <button className="btn" data-testid="fehlerkarten-umwandeln" onClick={umwandeln} disabled={fertig || wahl.size === 0} style={{ justifySelf: "start" }}>
        {fertig ? "✅ دخلت المؤكَّدة دفترَ أخطائك (تعود بجدولة متباعدة)" : `📓 حوّل ${wahl.size} خطأً مؤكدًا إلى بطاقات`}
      </button>
    </div>
  );
}
