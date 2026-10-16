"use client";
// 🪜 سلّم القراءة (C1/R175): نصوص جسرية قصيرة بين A0 وA1 — مفردات مقيدة ببطاقات
// A0/A1، وكلّ جديد في مسرد النص، وأسئلة من متن النص نفسه، بلا أيّ صوت مُرفوع:
// الاستماع بصوت جهازك الآلي كما هو موسوم.
import { useMemo, useState } from "react";
import { useProgress } from "@/lib/store";
import { leseleiter, type LeiterText } from "@/lib/content";
import {
  LEITER_STUFEN,
  leiterFortschritt,
  stufeAbgeschlossen,
  stufeFrei,
  texteDerStufe,
  textBestanden,
  woerterZaehlen,
} from "@/lib/leseleiter";
import { gemischteOptionen } from "@/lib/optionen";
import { logK } from "@/lib/kompetenz";
import { speakDe, stopSpeech } from "@/lib/speech";
import { De, DeBlock } from "./De";

export function LeseLeiter() {
  const { progress, update } = useProgress();
  const best = useMemo(() => progress.leseleiter ?? {}, [progress.leseleiter]);
  const fortschritt = useMemo(() => leiterFortschritt(best), [best]);
  const ersteOffene = LEITER_STUFEN.find((s) => stufeFrei(best, s.stufe) && !stufeAbgeschlossen(best, s.stufe))?.stufe ?? 6;
  const [stufe, setStufe] = useState<number>(ersteOffene);
  const [textId, setTextId] = useState<string | null>(null);
  const [antworten, setAntworten] = useState<Record<string, string>>({});
  const [gezeigt, setGezeigt] = useState(false);
  const [zeigUebersetzung, setZeigUebersetzung] = useState(false);

  const text: LeiterText | null = useMemo(() => leseleiter.find((t) => t.id === textId) ?? null, [textId]);
  const richtig = text ? text.fragen.filter((f) => antworten[f.id] === f.answer).length : 0;

  const waehleText = (t: LeiterText) => {
    stopSpeech();
    setTextId(t.id);
    setAntworten({});
    setGezeigt(false);
    setZeigUebersetzung(false);
  };

  const abgeben = () => {
    if (!text) return;
    const g = text.fragen.length;
    setGezeigt(true);
    update((p) => {
      const alt = p.leseleiter?.[text.id];
      const neu = !alt || richtig > alt.r ? { r: richtig, g } : alt;
      return logK({ ...p, leseleiter: { ...(p.leseleiter ?? {}), [text.id]: neu } }, "Lesen", richtig / g >= 2 / 3);
    });
  };

  if (!leseleiter.length)
    return <div className="card" style={{ padding: "0.9rem 1rem" }}>تُحمَّل نصوص السلّم…</div>;

  return (
    <div className="card" style={{ padding: "0.9rem 1rem", background: "var(--color-paper2)" }}>
      <div style={{ fontWeight: 800, marginBottom: "0.3rem" }}>🪜 سلّم القراءة — من جُمَل A0 إلى نصوص A1</div>
      <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)", marginBottom: "0.6rem", lineHeight: 1.85 }}>
        ستّ محطات × ثلاثة نصوص قصيرة متدرّجة الطول. مفردات كلّ نصّ من بطاقات A0/A1 التي درستَها، وكلّ كلمة جديدة
        في مسرد النصّ نفسه قبل القراءة، والأسئلة من متن النصّ لا من خارجه. أتمم نصوص محطةٍ (ثلثا الأسئلة على الأقلّ في كلّ نصّ) لتُفتح التالية.
        أجزتَ حتى الآن <b className="rtl-num">{fortschritt.bestanden}</b> من <b className="rtl-num">{fortschritt.gesamt}</b> نصًّا.
      </div>

      {!text && (
        <>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.6rem" }}>
            {LEITER_STUFEN.map((s) => {
              const frei = stufeFrei(best, s.stufe);
              const fertig = stufeAbgeschlossen(best, s.stufe);
              return (
                <button
                  key={s.stufe} type="button" disabled={!frei}
                  className={stufe === s.stufe ? "btn btn-primary" : "btn btn-ghost"}
                  onClick={() => setStufe(s.stufe)}
                  title={frei ? s.labelAr : "أتمم المحطة السابقة أولًا"}
                >
                  {fertig ? "✅" : frei ? "🪜" : "🔒"} {s.labelAr} ({s.minW}–{s.maxW} كلمة)
                </button>
              );
            })}
          </div>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {texteDerStufe(stufe).map((t) => {
              const e = best[t.id];
              const okBest = textBestanden(best, t.id);
              return (
                <button key={t.id} type="button" className="card" style={{ padding: "0.7rem 0.9rem", textAlign: "start", cursor: "pointer" }} onClick={() => waehleText(t)}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.4rem" }}>
                    <strong><De>{t.titelDe}</De> — {t.titelAr}</strong>
                    <span className="rtl-num" style={{ fontWeight: 800, color: okBest ? "var(--color-a1)" : "var(--color-ink2)" }}>
                      {e ? `${okBest ? "✅" : "📖"} أفضل نتيجة: ${e.r}/${e.g}` : "لم يُقرأ بعد"}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "var(--color-ink2)" }}>
                    <span className="rtl-num">{woerterZaehlen(t.de)}</span> كلمة · {t.glossar.length} كلمات في المسرد · 3 أسئلة من النصّ
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}

      {text && (
        <div className="fadein">
          <button type="button" className="btn btn-ghost" onClick={() => { stopSpeech(); setTextId(null); }}>→ نصوص المحطة {text.stufe}</button>
          <div className="card" style={{ padding: "0.8rem 1rem", marginTop: "0.5rem" }}>
            <div style={{ fontWeight: 800, marginBottom: "0.3rem" }}>
              <De>{text.titelDe}</De> — {text.titelAr} <span style={{ color: "var(--color-ink2)", fontWeight: 600 }}>(<span className="rtl-num">{woerterZaehlen(text.de)}</span> كلمة)</span>
            </div>
            <div style={{ marginBottom: "0.5rem" }}>
              <div style={{ fontWeight: 700, fontSize: "0.85rem", marginBottom: "0.25rem" }}>📚 مسرد النصّ — كلمات جديدة قبل القراءة:</div>
              <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                {text.glossar.map((g) => (
                  <span key={g.de} className="chip"><De>{g.de}</De> = {g.ar}</span>
                ))}
              </div>
            </div>
            <DeBlock className="lesetext" >{text.de}</DeBlock>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
              <button type="button" className="btn btn-ghost" onClick={() => speakDe(text.de, { rate: 0.85 })}>🔊 استمع بصوت جهازك (نطق آلي من متصفّحك)</button>
              <button type="button" className="btn btn-ghost" onClick={() => setZeigUebersetzung((z) => !z)}>{zeigUebersetzung ? "إخفاء الترجمة" : "أرني الترجمة بعد محاولتي"}</button>
            </div>
            {zeigUebersetzung && <div style={{ marginTop: "0.5rem", lineHeight: 1.9 }}>{text.ar}</div>}
          </div>

          <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.6rem" }}>
            {text.fragen.map((f, fi) => {
              const optionen = gemischteOptionen(f.options, f.id);
              const gewaehlt = antworten[f.id];
              return (
                <div key={f.id} className="card" style={{ padding: "0.6rem 0.8rem" }}>
                  <div style={{ fontWeight: 700 }}>
                    {fi + 1}. <De>{f.promptDe}</De> <span style={{ color: "var(--color-ink2)" }}>— {f.promptAr}</span>
                  </div>
                  <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginTop: "0.4rem" }}>
                    {optionen.map((o) => {
                      const aktiv = gewaehlt === o;
                      const richtigOpt = gezeigt && o === f.answer;
                      const falschOpt = gezeigt && aktiv && o !== f.answer;
                      return (
                        <button
                          key={o} type="button" disabled={gezeigt}
                          className="chip"
                          style={{
                            cursor: gezeigt ? "default" : "pointer", minHeight: 36,
                            background: richtigOpt ? "var(--color-a1)" : falschOpt ? "var(--color-cola)" : aktiv ? "var(--color-gold)" : "var(--ui-surface-raised)",
                            color: richtigOpt || falschOpt ? "var(--ui-on-accent)" : undefined,
                          }}
                          onClick={() => setAntworten((a) => ({ ...a, [f.id]: o }))}
                        >
                          <De>{o}</De>
                        </button>
                      );
                    })}
                  </div>
                  {gezeigt && (
                    <div style={{ fontSize: "0.85rem", marginTop: "0.35rem", color: gewaehlt === f.answer ? "var(--color-a1)" : "var(--color-cola)", fontWeight: 600 }}>
                      {gewaehlt === f.answer ? "✅ صحيح — " : "✗ ليس تمامًا — "}{f.explanationAr}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!gezeigt ? (
            <button type="button" className="btn btn-primary" style={{ marginTop: "0.6rem" }} disabled={Object.keys(antworten).length < text.fragen.length} onClick={abgeben}>
              صحّح أسئلتي ({Object.keys(antworten).length}/{text.fragen.length})
            </button>
          ) : (
            <div style={{ marginTop: "0.6rem", display: "flex", gap: "0.4rem", flexWrap: "wrap", alignItems: "center" }}>
              <strong>
                نتيجتك: <span className="rtl-num">{richtig}/{text.fragen.length}</span>
                {richtig / text.fragen.length >= 2 / 3 ? " — نصٌّ مُتقن ✅" : " — أعد القراءة وحاول من جديد"}
              </strong>
              <button type="button" className="btn btn-ghost" onClick={() => waehleText(text)}>↺ إعادة المحاولة</button>
              <button type="button" className="btn btn-ghost" onClick={() => { stopSpeech(); setTextId(null); }}>→ بقية النصوص</button>
              {stufeAbgeschlossen(best, text.stufe) && text.stufe < 6 && (
                <span style={{ fontWeight: 700, color: "var(--color-a1)" }}>🎉 أتممت المحطة {text.stufe} — المحطة {text.stufe + 1} مفتوحة الآن</span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
