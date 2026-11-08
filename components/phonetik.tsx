"use client";
// 🔊 A5 (R282): مسار الصوتيات المتدرج A0→A2 — تمييز تباينات صوتية، نطق جهازي (TTS) معلن، بلا حكم نطق
import { useMemo, useState } from "react";
import { PHONETIK_EINHEITEN } from "@/lib/phonetikdaten";
import { bewerteHoerKontrast, pruefbareKontrastIndizes, starteHoerKontrast, type HoerKontrastQuiz } from "@/lib/minimalpaare";
import { speakDe, speechAvailable } from "@/lib/speech";

export function PhonetikStation() {
  const [stufe, setStufe] = useState<"alle" | "A0" | "A1" | "A2">("alle");
  const [quiz, setQuiz] = useState<HoerKontrastQuiz | null>(null);

  const einheiten = useMemo(() => PHONETIK_EINHEITEN.filter((e) => stufe === "alle" || e.stufe === stufe), [stufe]);
  const ttsVerfuegbar = speechAvailable();

  const rate = (einheitId: string) => {
    const einheit = PHONETIK_EINHEITEN.find((item) => item.id === einheitId);
    const next = starteHoerKontrast(einheit, quiz);
    if (!einheit || !next) return;
    // لا نعرض سؤالاً يزعم أن كلمة سُمعت إذا رفض المتصفح تشغيل TTS.
    if (!speakDe(einheit.paare[next.paar][next.seite])) return;
    setQuiz(next);
  };

  const antwort = (wahl: "a" | "b") => {
    if (!quiz) return;
    const einheit = PHONETIK_EINHEITEN.find((item) => item.id === quiz.einheit);
    const result = bewerteHoerKontrast(quiz, einheit, wahl);
    if (result.angenommen) setQuiz(result.quiz);
  };

  return (
    <section className="card fadein" data-testid="phonetik-station" style={{ padding: "1.2rem" }}>
      <h2 style={{ marginTop: 0 }}>🔊 مسار الصوتيات — التمييز السمعي A0→A2</h2>
      <p style={{ fontSize: "0.85rem", color: "var(--color-ink2)" }}>
        صوت التمارين من نطق جهازك (TTS) — ليس تسجيلات منزلية، والاختبار يقيس <strong>تمييزك السمعي</strong> فقط ولا يقيّم نطقك.
        أزواج المحطة أمثلة تباين صوتي؛ ليست كل مجموعة زوجًا أدنى بالمعنى اللساني الصارم.
      </p>
      <p data-testid="phonetik-datenschutz" style={{ fontSize: "0.8rem", color: "var(--color-ink2)" }}>
        🔒 لا تستخدم المحطة الميكروفون، ولا تحفظ نتيجتك، ولا ترسل صوتًا أو إجابة إلى خدمة خارجية.
      </p>
      {!ttsVerfuegbar && <p role="status" style={{ color: "var(--color-cola)" }}>⚠️ متصفحك بلا نطق مدمج — تبقى القواعد والأزواج مقروءة، والتمييز السمعي يحتاج متصفحًا ناطقًا.</p>}
      <div role="group" aria-label="تصفية وحدات الصوتيات حسب المستوى" style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", margin: "0.6rem 0" }}>
        {(["alle", "A0", "A1", "A2"] as const).map((s) => (
          <button
            type="button"
            key={s}
            className="chip"
            aria-pressed={stufe === s}
            onClick={() => { setStufe(s); setQuiz(null); }}
            style={{ cursor: "pointer", fontWeight: stufe === s ? 900 : 400 }}
          >
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
                  <button type="button" className="btn btn-ghost" disabled={!ttsVerfuegbar} onClick={() => speakDe(p.a)}>🔊 {p.a}</button>
                  <span style={{ color: "var(--color-ink2)" }}>{p.aAr}</span>
                  <span style={{ opacity: 0.6 }}>↔</span>
                  <button type="button" className="btn btn-ghost" disabled={!ttsVerfuegbar} onClick={() => speakDe(p.b)}>🔊 {p.b}</button>
                  <span style={{ color: "var(--color-ink2)" }}>{p.bAr}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "0.5rem", fontSize: "0.85rem", color: "var(--color-ink2)" }}>
              {e.saetze.map((s, i) => (
                <div key={i}>
                  <button type="button" className="chip" disabled={!ttsVerfuegbar} style={{ cursor: ttsVerfuegbar ? "pointer" : "not-allowed" }} onClick={() => speakDe(s.de)}>🔊 جملة</button>{" "}
                  <span dir="ltr" style={{ unicodeBidi: "isolate" }}>{s.de}</span> — {s.ar}
                </div>
              ))}
            </div>
            <div style={{ marginTop: "0.6rem", display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
              <button
                type="button"
                className="btn btn-primary"
                data-testid={`phonetik-test-${e.id}`}
                disabled={!ttsVerfuegbar || pruefbareKontrastIndizes(e).length === 0}
                onClick={() => rate(e.id)}
              >
                🎲 اختبر سمعك في هذه الوحدة
              </button>
              {e.quizHinweisAr && <span data-testid={`phonetik-test-hinweis-${e.id}`} style={{ fontSize: "0.82rem", color: "var(--color-ink2)" }}>{e.quizHinweisAr}</span>}
              {quiz && quiz.einheit === e.id && (
                <span style={{ display: "inline-flex", gap: "0.4rem", alignItems: "center", flexWrap: "wrap" }}>
                  <button type="button" className="btn btn-ghost" data-testid="phonetik-antwort-a" disabled={quiz.beantwortet} onClick={() => antwort("a")}>{e.paare[quiz.paar].a}</button>
                  <button type="button" className="btn btn-ghost" data-testid="phonetik-antwort-b" disabled={quiz.beantwortet} onClick={() => antwort("b")}>{e.paare[quiz.paar].b}</button>
                  <span role="status" aria-live="polite" data-testid="phonetik-quiz-feedback" style={{ fontSize: "0.85rem" }}>
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
