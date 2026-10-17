"use client";
// 📚 مكتبة التذوّق B2+/C1 (C2/R178): نصوص وحوارات فوق B2 لمن أنهى الخطة.
// خارج خطة الـ378 يومًا تمامًا: لا تُكتب في أيّ تقدّم، ولا تُجدوَل في أيّ يوم،
// ولا تمسّ عتبات النجاح. صوت الحوارات نطقٌ آليٌّ من جهاز المتعلم كما هو موسوم.
import { useMemo, useState } from "react";
import { vertiefungDialoge, vertiefungTexte, type VertiefungDialog, type VertiefungText } from "@/lib/content";
import { gemischteOptionen } from "@/lib/optionen";
import { speakDe } from "@/lib/speech";
import { De, DeBlock } from "./De";

type Auswahl =
  | { art: "text"; item: VertiefungText }
  | { art: "dialog"; item: VertiefungDialog }
  | null;

function FragenBlock({ fragen, schluessel }: { fragen: VertiefungText["fragen"]; schluessel: string }) {
  const [antworten, setAntworten] = useState<Record<string, string>>({});
  const [gezeigt, setGezeigt] = useState(false);
  const punkte = fragen.filter((f) => antworten[f.id] === f.answer).length;
  return (
    <div style={{ marginTop: "1rem" }}>
      <h4 style={{ margin: "0 0 0.5rem" }}>أسئلة الفهم — تحقّق بنفسك</h4>
      {fragen.map((f, i) => {
        const optionen = gemischteOptionen(f.options, schluessel + f.id);
        const gewaehlt = antworten[f.id];
        return (
          <div key={f.id} className="card" style={{ padding: "0.7rem 0.9rem", marginBottom: "0.5rem" }}>
            <div style={{ fontWeight: 600 }}>{i + 1}. <De>{f.promptDe}</De></div>
            <div className="small" style={{ marginBottom: "0.4rem" }}>{f.promptAr}</div>
            <div style={{ display: "grid", gap: "0.3rem" }}>
              {optionen.map((o) => {
                const aktiv = gewaehlt === o;
                const richtig = gezeigt && o === f.answer;
                const falsch = gezeigt && aktiv && o !== f.answer;
                return (
                  <button
                    key={o}
                    type="button"
                    className="btn"
                    disabled={gezeigt}
                    onClick={() => setAntworten((a) => ({ ...a, [f.id]: o }))}
                    style={{
                      textAlign: "start",
                      border: richtig ? "2px solid var(--color-good, #2e7d32)" : falsch ? "2px solid #c62828" : undefined,
                      fontWeight: aktiv ? 700 : 400,
                    }}
                  >
                    <De>{o}</De>
                  </button>
                );
              })}
            </div>
            {gezeigt && <p className="small" style={{ marginTop: "0.4rem" }}>{f.explanationAr}</p>}
          </div>
        );
      })}
      {!gezeigt ? (
        <button
          type="button"
          className="btn btn-primary"
          disabled={Object.keys(antworten).length < fragen.length}
          onClick={() => setGezeigt(true)}
        >
          إظهار النتيجة
        </button>
      ) : (
        <p style={{ fontWeight: 700 }}>
          نتيجتك في هذه الجلسة: {punkte}/{fragen.length}
          {punkte === fragen.length ? " — أحسنت! هذا مستوى C1 الحقيقي." : " — راجع الشروحات أعلاه ثم جرّب نصًّا آخر."}
        </p>
      )}
    </div>
  );
}

function TextAnsicht({ text }: { text: VertiefungText }) {
  const [zeigAr, setZeigAr] = useState(false);
  return (
    <div>
      <DeBlock>{text.de}</DeBlock>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", margin: "0.6rem 0" }}>
        <button type="button" className="btn" onClick={() => speakDe(text.de, { rate: 0.85 })}>
          🔊 استمع بصوت جهازك (نطق آلي من متصفّحك)
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => setZeigAr((z) => !z)}>
          {zeigAr ? "إخفاء الترجمة" : "إظهار الترجمة الكاملة"}
        </button>
      </div>
      {zeigAr && <p className="small" style={{ lineHeight: 1.9 }}>{text.ar}</p>}
      <h4 style={{ margin: "0.8rem 0 0.4rem" }}>مسرد المفردات الصعبة</h4>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
        {text.glossar.map((g) => (
          <span key={g.de} className="card" style={{ padding: "0.25rem 0.6rem" }}>
            <De><b>{g.de}</b></De> — <span className="small">{g.ar}</span>
          </span>
        ))}
      </div>
      <FragenBlock fragen={text.fragen} schluessel={text.id} />
    </div>
  );
}

function DialogAnsicht({ dialog }: { dialog: VertiefungDialog }) {
  return (
    <div>
      {dialog.lines.map((l, i) => (
        <div key={i} className="card" style={{ padding: "0.55rem 0.8rem", marginBottom: "0.4rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", alignItems: "start" }}>
            <div>
              <b>{l.who}:</b> <De>{l.de}</De>
              <div className="small">{l.ar}</div>
            </div>
            <button type="button" className="btn btn-ghost" aria-label="استمع للسطر" onClick={() => speakDe(l.de, { rate: 0.9 })}>
              🔊
            </button>
          </div>
        </div>
      ))}
      <p className="small">الصوت نطقٌ آليٌّ من متصفّح جهازك (Text-to-Speech) — ليس تسجيلًا بشريًّا.</p>
      <FragenBlock fragen={dialog.fragen} schluessel={dialog.id} />
    </div>
  );
}

export function Vertiefung() {
  const [auswahl, setAuswahl] = useState<Auswahl>(null);
  const titel = useMemo(() => auswahl?.item.titelDe ?? null, [auswahl]);

  if (vertiefungTexte.length === 0 && vertiefungDialoge.length === 0) {
    return <div className="card" style={{ padding: "0.9rem 1rem" }}>تُحمَّل مكتبة التذوّق…</div>;
  }

  return (
    <section className="card" style={{ padding: "1rem 1.1rem", background: "var(--color-paper2)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
        <h3 style={{ margin: 0 }}>📚 مكتبة التذوّق B2+/C1</h3>
        <span className="card" style={{ padding: "0.15rem 0.6rem", fontWeight: 700 }}>بعد B2 · مسار C1 مصغّر</span>
      </div>
      <p className="small" style={{ marginTop: "0.5rem", lineHeight: 1.9 }}>
        هذه المكتبة <b>خارج خطة الـ378 يومًا</b>: مسار C1 مصغّر (12 نصًا و8 حوارات بمسارد وأسئلة تأويلية) لمن أنهى مستوى B2 ويريد
        تجربة المستوى التالي بلا ضغط امتحان. لا تدخل في حساب تقدّمك ولا في عتبات النجاح، ونتائج
        الأسئلة فيها تبقى في جلستك فقط.
      </p>

      {!auswahl ? (
        <>
          <h4 style={{ margin: "0.9rem 0 0.4rem" }}>نصوص C1 ({vertiefungTexte.length})</h4>
          <div style={{ display: "grid", gap: "0.4rem" }}>
            {vertiefungTexte.map((t) => (
              <button
                key={t.id}
                type="button"
                className="card"
                style={{ padding: "0.7rem 0.9rem", textAlign: "start", cursor: "pointer" }}
                onClick={() => setAuswahl({ art: "text", item: t })}
              >
                <De><b>{t.titelDe}</b></De>
                <div className="small">{t.titelAr} · {t.de.split(/\s+/).length} كلمة · {t.fragen.length} أسئلة</div>
              </button>
            ))}
          </div>
          <h4 style={{ margin: "1rem 0 0.4rem" }}>حوارات C1 ({vertiefungDialoge.length})</h4>
          <div style={{ display: "grid", gap: "0.4rem" }}>
            {vertiefungDialoge.map((d) => (
              <button
                key={d.id}
                type="button"
                className="card"
                style={{ padding: "0.7rem 0.9rem", textAlign: "start", cursor: "pointer" }}
                onClick={() => setAuswahl({ art: "dialog", item: d })}
              >
                <De><b>{d.titelDe}</b></De>
                <div className="small">{d.titelAr} · {d.lines.length} سطرًا · {d.fragen.length} أسئلة</div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div>
          <button type="button" className="btn btn-ghost" onClick={() => setAuswahl(null)}>
            ← عودة إلى المكتبة
          </button>
          <h4 style={{ margin: "0.5rem 0" }}>
            <De>{titel ?? ""}</De> <span className="small">· {auswahl.item.titelAr}</span>
          </h4>
          {auswahl.art === "text" ? <TextAnsicht text={auswahl.item} /> : <DialogAnsicht dialog={auswahl.item} />}
        </div>
      )}
    </section>
  );
}
