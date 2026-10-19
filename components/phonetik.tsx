"use client";
// 🔊 A5 (R282): مسار الصوتيات المتدرج A0→A2 — تمييز سمعي بأزواج دنيا، نطق جهازي (TTS) معلن، بلا حكم نطق
import { useMemo, useState } from "react";
import { PHONETIK_EINHEITEN } from "@/lib/phonetikdaten";
import { speakDe, speechAvailable } from "@/lib/speech";

export function PhonetikStation() {
  const [stufe, setStufe] = useState<"alle" | "A0" | "A1" | "A2">("alle");
  const [quiz, setQuiz] = useState<{ einheit: string; paar: number; seite: "a" | "b"; ok: number; versuche: number; meldung: string } | null>(null);

  const einheiten = useMemo(() => PHONETIK_EINHEITEN.filter((e) => stufe === "alle" || e.stufe === stufe), [stufe]);

  const rate = (einheitId: string) => {
    const e = PHONETIK_EINHEITEN.find((x) => x.id === einheitId);
    if (!e) return;
    const paar = Math.floor(Math.random() * e.paare.length);
    const seite = Math.random() < 0.5 ? "a" : "b";
    speakDe(e.paare[paar][seite]);
    setQuiz((q) => ({ einheit: einheitId, paar, seite, ok: q?.ok ?? 0, versuche: q?.versuche ?? 0, meldung: "🎧 سمعتَ كلمة — أيّها هي؟" }));
  };

  const antwort = (wahl: "a" | "b") => {
    if (!quiz) return;
    const e = PHONETIK_EINHEITEN.find((x) => x.id === quiz.einheit);
    if (!e) return;
    const richtig = wahl === quiz.seite;
    setQuiz({
      ...quiz,
      ok: quiz.ok + (richtig ? 1 : 0),
      versuche: quiz.versuche + 1,
      meldung: richtig ? `✅ صحيح — كانت «${e.paare[quiz.paar][quiz.seite]}».` : `❌ كانت «${e.paare[quiz.paar][quiz.seite]}». اسمع الفرق بالزوجين أدناه ثم أعد المحاولة.`,
    });
  };

  return (
    <section className="card fadein" data-testid="phonetik-station" style={{ padding: "1.2rem" }}>
      <h2 style={{ marginTop: 0 }}>🔊 مسار الصوتيات — التمييز السمعي A0→A2</h2>
      <p style={{ fontSize: "0.85rem", color: "var(--color-ink2)" }}>
        صوت التمارين من نطق جهازك (TTS) — ليس تسجيلات منزلية، والاختبار يقيس <strong>تمييزك السمعي</strong> فقط ولا يقيّم نطقك.
      </p>
      {!speechAvailable() && <p style={{ color: "var(--color-cola)" }}>⚠️ متصفحك بلا نطق مدمج — تبقى القواعد والأزواج مقروءة، والتمييز السمعي يحتاج متصفحًا ناطقًا.</p>}
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", margin: "0.6rem 0" }}>
        {(["alle", "A0", "A1", "A2"] as const).map((s) => (
          <button key={s} className="chip" onClick={() => setStufe(s)} style={{ cursor: "pointer", fontWeight: stufe === s ? 900 : 400 }}>
            {s === "alle" ? "الكل" : s}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gap: "0.9rem" }}>
        {einheiten.map((e) => (
          <div key={e.id} className="card" style={{ padding: "0.9rem 1.1rem", background: "var(--color-paper)" }}>
            <div style={{ fontWeight: 900 }}>
              <span className="chip">{e.stufe}</span> {e.titelAr} <span style={{ color: "var(--color-ink2)", fontWeight: 400 }}>· {e.titelDe}</span>
            </div>
            <p style={{ fontSize: "0.85rem" }}>{e.regelAr}</p>
            <div style={{ display: "grid", gap: "0.35rem" }}>
              {e.paare.map((p, i) => (
                <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap", fontSize: "0.9rem" }}>
                  <button className="btn btn-ghost" onClick={() => speakDe(p.a)}>🔊 {p.a}</button>
                  <span style={{ color: "var(--color-ink2)" }}>{p.aAr}</span>
                  <span style={{ opacity: 0.6 }}>↔</span>
                  <button className="btn btn-ghost" onClick={() => speakDe(p.b)}>🔊 {p.b}</button>
                  <span style={{ color: "var(--color-ink2)" }}>{p.bAr}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "0.5rem", fontSize: "0.85rem", color: "var(--color-ink2)" }}>
              {e.saetze.map((s, i) => (
                <div key={i}>
                  <button className="chip" style={{ cursor: "pointer" }} onClick={() => speakDe(s.de)}>🔊 جملة</button>{" "}
                  <span dir="ltr" style={{ unicodeBidi: "isolate" }}>{s.de}</span> — {s.ar}
                </div>
              ))}
            </div>
            <div style={{ marginTop: "0.6rem", display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
              <button className="btn btn-primary" onClick={() => rate(e.id)}>🎲 اختبر سمعك في هذه الوحدة</button>
              {quiz && quiz.einheit === e.id && (
                <span style={{ display: "inline-flex", gap: "0.4rem", alignItems: "center", flexWrap: "wrap" }}>
                  <button className="btn btn-ghost" data-testid="phonetik-antwort-a" onClick={() => antwort("a")}>{e.paare[quiz.paar].a}</button>
                  <button className="btn btn-ghost" data-testid="phonetik-antwort-b" onClick={() => antwort("b")}>{e.paare[quiz.paar].b}</button>
                  <span data-testid="phonetik-quiz-feedback" style={{ fontSize: "0.85rem" }}>
                    {quiz.meldung} {quiz.versuche > 0 && <>(نتيجتك: <span className="rtl-num">{quiz.ok}/{quiz.versuche}</span>)</>}
                  </span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
