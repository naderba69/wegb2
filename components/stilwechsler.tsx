"use client";
import { useMemo, useState } from "react";
import { STIL_PAARE, REGEL_AR, stilUebungen, registerErkennen, stilProfil, type StilRegel } from "@/lib/stil";
import ExerciseSet from "./exercises";
import { De } from "./De";

const ALLE: StilRegel[] = ["weil-wegen", "obwohl-trotz", "wenn-bei", "nachdem-nach", "bevor-vor", "damit-zu", "indem-durch", "verb-nomen"];

/**
 * 🎚️ مبدّل الأسلوب — أداة منهجية لا كتالوج:
 *  ① استكشاف: مفتاح واحد يقلب الجملة بين الفعلي والاسمي مع تسمية القاعدة.
 *  ② تعرّف: أيّ الجملتين اسمية؟
 *  ③ إنتاج: تحويل في الاتجاهين بمصحّح umformung (تلميح موجَّه قبل الكشف).
 *  ④ مقياس أسلوب لنصّك الحرّ: عدّ لا حكم.
 */
export function StilWechsler({ seed = 0, onPoints }: { seed?: number; onPoints?: (p: number, m: number) => void }) {
  const [regel, setRegel] = useState<StilRegel>(ALLE[seed % ALLE.length]);
  const [nominal, setNominal] = useState(false);
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const paare = useMemo(() => STIL_PAARE.filter((p) => p.regel === regel), [regel]);
  const p = paare[idx % Math.max(paare.length, 1)];
  const r = REGEL_AR[regel];
  const uebungen = useMemo(() => {
    const alle = stilUebungen("beide");
    const rot = seed % alle.length;
    return [...alle.slice(rot), ...alle.slice(0, rot)].slice(0, 6);
  }, [seed]);
  const erkennen = useMemo(() => registerErkennen(6), []);
  const profil = useMemo(() => stilProfil(text), [text]);
  const punkte = onPoints ?? (() => {});

  return (
    <section className="card" style={{ padding: "1rem 1.1rem", borderInlineStart: "5px solid var(--color-b2, var(--color-cola))" }} data-testid="stilwechsler">
      <h3 style={{ fontWeight: 800, margin: 0 }}>🎚️ مبدّل الأسلوب — Verbalstil ⇄ Nominalstil</h3>
      <p style={{ fontSize: "0.85rem", color: "var(--color-ink2)", margin: "0.3rem 0 0.7rem" }}>
        الفكرة نفسها بطريقتين. اقلب المفتاح وراقب ما يتغيّر: الرابط، الحالة الإعرابية، وموضع الفعل.
      </p>

      {/* ① الاستكشاف */}
      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "0.6rem" }}>
        {ALLE.map((k) => (
          <button key={k} className="chip" style={{ cursor: "pointer", background: k === regel ? "var(--color-cola)" : "var(--ui-surface-raised)", color: k === regel ? "var(--ui-on-accent)" : undefined }} onClick={() => { setRegel(k); setIdx(0); }} data-testid={`stil-regel-${k}`}>
            {REGEL_AR[k].titel}
          </button>
        ))}
      </div>
      {p && (
        <div className="card" style={{ padding: "0.8rem 1rem", background: "var(--color-paper2)" }} data-testid="stil-buehne">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--color-ink2)" }}>{nominal ? `اسمي · ${r.nominal}` : `فعلي · ${r.verbal}`}</span>
            <div style={{ display: "flex", gap: "0.4rem" }}>
              <button className="btn btn-primary" onClick={() => setNominal((n) => !n)} data-testid="stil-schalter" aria-pressed={nominal}>
                {nominal ? "⇄ إلى الفعلي" : "⇄ إلى الاسمي"}
              </button>
              <button className="btn btn-ghost" onClick={() => setIdx((i) => i + 1)} disabled={paare.length < 2} data-testid="stil-naechster">جملة أخرى</button>
            </div>
          </div>
          <div style={{ fontSize: "1.15rem", fontWeight: 700, margin: "0.5rem 0 0.2rem" }} data-testid="stil-satz"><De>{nominal ? p.nominal : p.verbal}</De></div>
          <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)" }}>{p.ar}</div>
          <div style={{ fontSize: "0.82rem", marginTop: "0.45rem", borderTop: "1px dashed var(--color-line)", paddingTop: "0.4rem" }}>
            <b>{r.titel}:</b> {r.hinweis}
          </div>
        </div>
      )}

      {/* ② التعرّف */}
      <h4 style={{ fontWeight: 800, margin: "1rem 0 0.4rem" }}>② تعرّف: أيّ الجملتين اسمية؟</h4>
      <ExerciseSet items={erkennen} onPoints={punkte} />

      {/* ③ الإنتاج */}
      <h4 style={{ fontWeight: 800, margin: "1rem 0 0.4rem" }}>③ حوّل بنفسك — في الاتجاهين</h4>
      <ExerciseSet items={uebungen} onPoints={punkte} />

      {/* ④ مقياس أسلوب */}
      <h4 style={{ fontWeight: 800, margin: "1rem 0 0.4rem" }}>④ مقياس أسلوب نصّك</h4>
      <textarea className="field" value={text} onChange={(e) => setText(e.target.value)} rows={4} placeholder="ألصق فقرة من رسالتك الرسمية أو مقالك …" style={{ width: "100%", padding: "0.6rem", borderRadius: 8, border: "1px solid var(--color-line)" }} aria-label="نصّك" data-testid="stil-text" />
      {text.trim().length > 0 && (
        <div style={{ fontSize: "0.86rem", marginTop: "0.4rem" }} data-testid="stil-profil">
          علامات اسمية: <b className="rtl-num">{profil.nominal}</b> · علامات فعلية: <b className="rtl-num">{profil.verbal}</b>
          <span style={{ color: "var(--color-ink2)" }}> — عدٌّ آليّ للروابط وحروف الجرّ واللواحق، لا حكمٌ على الجودة.</span>
          {profil.hinweise.map((h, i) => <div key={i} style={{ marginTop: "0.25rem" }}>💡 {h}</div>)}
        </div>
      )}
    </section>
  );
}
