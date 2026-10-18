"use client";
// 🔗 A14 (R295): إنتاج متلازمات موجَّه — اكتب كلمة الشريك بنفسك في الإطار
import { useMemo, useState } from "react";
import { kollokProduktion, partnerOk } from "@/lib/kollokproduktion";
import { speakDe } from "@/lib/speech";

export function KollokProduktionStation() {
  const [runde, setRunde] = useState(0);
  const items = useMemo(() => kollokProduktion(11 + runde * 17, 6), [runde]);
  const [eingaben, setEingaben] = useState<Record<number, string>>({});
  const [geprueft, setGeprueft] = useState(false);
  const punkte = items.filter((it, i) => partnerOk(eingaben[i] ?? "", it.partner)).length;
  if (items.length === 0) return null;
  return (
    <section className="card" data-testid="kollokproduktion" style={{ padding: "1rem 1.1rem", background: "var(--color-paper2)", display: "grid", gap: "0.6rem" }}>
      <strong>🔗 إنتاج المتلازمات (A14) — من الذاكرة لا من الخيارات</strong>
      <div style={{ fontSize: "0.84rem", color: "var(--color-ink2)", lineHeight: 1.9 }}>
        كل إطار متلازمة حقيقية من بنكك ناقصها كلمة الشريك. اكتبها بنفسك (الحروف الكبيرة/الصغيرة لا تهمّ) — إنتاج موجَّه، ثم قارن واسمع الصواب.
      </div>
      {items.map((it, i) => {
        const ok = geprueft && partnerOk(eingaben[i] ?? "", it.partner);
        const falsch = geprueft && !ok;
        return (
          <div key={i} style={{ display: "grid", gap: "0.25rem" }}>
            <div style={{ fontSize: "0.88rem" }}>
              <span style={{ color: "var(--color-ink2)" }}>{it.karte.ar} — </span>
              <span className="de" dir="ltr" style={{ fontWeight: 700 }}>{it.rahmen}</span>
            </div>
            <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", flexWrap: "wrap" }}>
              <input
                dir="ltr"
                lang="de"
                data-testid={`kollokprod-input-${i}`}
                value={eingaben[i] ?? ""}
                disabled={geprueft}
                onChange={(e) => setEingaben((a) => ({ ...a, [i]: e.target.value }))}
                style={{ padding: "0.45rem 0.6rem", borderRadius: "0.5rem", border: falsch ? "2px solid #c62828" : ok ? "2px solid var(--color-good, #2e7d32)" : undefined, minHeight: "44px" }}
              />
              {geprueft && (
                <span style={{ fontSize: "0.86rem" }}>
                  {ok ? "✓" : <>الصواب: <strong className="de" dir="ltr">{it.kollok}</strong></>}
                  <button type="button" className="btn btn-ghost" onClick={() => speakDe(it.kollok)} style={{ marginInlineStart: "0.4rem" }}>🔊</button>
                </span>
              )}
            </div>
          </div>
        );
      })}
      {!geprueft ? (
        <button className="btn btn-primary" data-testid="kollokprod-pruefen" onClick={() => setGeprueft(true)} style={{ justifySelf: "start" }}>صحّح إنتاجي</button>
      ) : (
        <div data-testid="kollokprod-ergebnis" style={{ fontWeight: 800 }}>
          أنتجتَ من الذاكرة <span className="rtl-num">{punkte}/{items.length}</span> متلازمة صحيحة.
          <button className="btn" data-testid="kollokprod-neu" onClick={() => { setRunde((r) => r + 1); setEingaben({}); setGeprueft(false); }} style={{ marginInlineStart: "0.6rem" }}>جولة أخرى</button>
        </div>
      )}
    </section>
  );
}
