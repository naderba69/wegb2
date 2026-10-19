"use client";
// ⚡ A10 (R292): قراءة سريعة وظيفية موقوتة — مسح للفكرة وبحث عن أرقام في نصوص البنك
import { useEffect, useMemo, useState } from "react";
import { useProgress } from "@/lib/store";
import { scanRunde } from "@/lib/schnellesen";

export function SchnellLesen() {
  const { progress, ready } = useProgress();
  const [lauf, setLauf] = useState(0);
  const runde = useMemo(() => {
    if (!ready) return null;
    for (let v = 0; v < 50; v++) {
      const r = scanRunde(progress.plan.day + lauf * 31 + v);
      if (r) return r;
    }
    return null;
  }, [ready, progress.plan.day, lauf]);
  const [phase, setPhase] = useState<"start" | "laeuft" | "fertig">("start");
  const [rest, setRest] = useState(120);
  const [antworten, setAntworten] = useState<Record<string, number>>({});

  useEffect(() => {
    if (phase !== "laeuft") return;
    const iv = setInterval(() => setRest((r) => {
      if (r <= 1) { setPhase("fertig"); return 0; }
      return r - 1;
    }), 1000);
    return () => clearInterval(iv);
  }, [phase]);

  if (!runde) return null;
  const fragen = [{ id: "gist", frageAr: runde.gistFrageAr, optionen: runde.gistOptionen, richtig: runde.gistRichtig, de: true }, ...runde.scan.map((f, i) => ({ id: `s${i}`, frageAr: f.frageAr, optionen: f.optionen, richtig: f.richtig, de: false }))];
  const punkte = fragen.filter((f) => antworten[f.id] === f.richtig).length;

  return (
    <section className="card" data-testid="schnellesen" style={{ padding: "1rem 1.1rem", background: "var(--color-paper2)", display: "grid", gap: "0.6rem" }}>
      <strong>⚡ قراءة سريعة وظيفية (A10) — Skimming & Scanning</strong>
      {phase === "start" && (
        <>
          <div style={{ fontSize: "0.88rem", lineHeight: 1.9 }}>
            نصّ حقيقي من بنكك و{runde.sekunden} ثانية: أولًا التقط الفكرة العامة بمسح سريع (Skimming)، ثمّ ابحث عن الأرقام المرتبطة بكلمات مفتاحية (Scanning) — كقراءة جدول قطار أو إعلان رسمي. تدريب جلسة فقط.
          </div>
          <button className="btn btn-primary" data-testid="schnellesen-start" onClick={() => { setRest(runde.sekunden); setAntworten({}); setPhase("laeuft"); }} style={{ justifySelf: "start" }}>▶ ابدأ التوقيت</button>
        </>
      )}
      {phase !== "start" && (
        <>
          <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
            <span className="chip rtl-num" data-testid="schnellesen-zeit">⏱ {rest} ث</span>
            <span className="de" dir="ltr" style={{ fontWeight: 700 }}>{runde.titelDe}</span>
          </div>
          <article className="de" dir="ltr" style={{ maxHeight: "16rem", overflowY: "auto", lineHeight: 1.9, background: "var(--color-paper)", padding: "0.8rem", borderRadius: "0.6rem" }}>{runde.textDe}</article>
          {fragen.map((f) => (
            <div key={f.id} style={{ display: "grid", gap: "0.3rem" }}>
              <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{f.frageAr}</div>
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                {f.optionen.map((o, i) => (
                  <button
                    key={i}
                    type="button"
                    className="btn"
                    data-testid={`schnellesen-opt-${f.id}-${i}`}
                    disabled={phase === "fertig"}
                    onClick={() => setAntworten((a) => ({ ...a, [f.id]: i }))}
                    style={{
                      border: phase === "fertig"
                        ? i === f.richtig ? "2px solid var(--color-good, #2e7d32)" : antworten[f.id] === i ? "2px solid #c62828" : undefined
                        : antworten[f.id] === i ? "2px solid var(--color-gold)" : undefined,
                    }}
                  >
                    <span className={f.de ? "de" : "rtl-num"} dir={f.de ? "ltr" : undefined}>{o}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
          {phase === "laeuft" ? (
            <button className="btn btn-primary" data-testid="schnellesen-fertig" onClick={() => setPhase("fertig")} style={{ justifySelf: "start" }}>أنهيت — أرني النتيجة</button>
          ) : (
            <div data-testid="schnellesen-ergebnis" style={{ fontWeight: 800 }}>
              نتيجتك: <span className="rtl-num">{punkte}/{fragen.length}</span> في <span className="rtl-num">{runde.sekunden - rest}</span> ثانية — {punkte === fragen.length ? "مسح نظيف!" : "راجع ما فاتك في النص أعلاه ثم جرّب نصًّا آخر."}
              <button className="btn" data-testid="schnellesen-neu" onClick={() => { setLauf((l) => l + 1); setPhase("start"); }} style={{ marginInlineStart: "0.6rem" }}>نصّ آخر</button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
