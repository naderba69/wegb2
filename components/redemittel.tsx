"use client";
// 🧰 بنك وسائل التعبير (C3/R176): عبارات وظيفية مصنّفة بأجزاء الامتحان،
// لكلّ عبارة مثالٌ مترجم، وتدريب استرجاعٍ ذاتيّ (تذكّر ثم قارن) — بلا تصحيح آليّ مدّعى.
import { useMemo, useState } from "react";
import { redemittelBank } from "@/lib/content";
import { REDE_FUNKTIONEN, REDE_TEILE, drillRunde, funktionAr, type RedeTeil } from "@/lib/redemittel";
import { De, DeBlock } from "./De";

export function RedemittelBank() {
  const [teil, setTeil] = useState<RedeTeil | null>(null);
  const [funktion, setFunktion] = useState<string | null>(null);
  const [offenesBeispiel, setOffenesBeispiel] = useState<string | null>(null);
  const [modus, setModus] = useState<"bank" | "drill">("bank");

  const liste = useMemo(
    () =>
      redemittelBank.filter(
        (x) => (!teil || x.teile.includes(teil)) && (!funktion || x.funktion === funktion)
      ),
    [teil, funktion]
  );

  /* تدريب الاسترجاع */
  const [drillSeed, setDrillSeed] = useState(1);
  const runde = useMemo(() => drillRunde(drillSeed * 101 + 7, 8), [drillSeed]);
  const [pos, setPos] = useState(0);
  const [gezeigt, setGezeigt] = useState(false);
  const [bilanz, setBilanz] = useState<{ ja: number; nein: number }>({ ja: 0, nein: 0 });
  const aktuell = runde[pos];

  const bewerten = (ja: boolean) => {
    setBilanz((b) => ({ ja: b.ja + (ja ? 1 : 0), nein: b.nein + (ja ? 0 : 1) }));
    setGezeigt(false);
    setPos((p) => p + 1);
  };

  if (!redemittelBank.length)
    return <div className="card" style={{ padding: "0.9rem 1rem" }}>يُحمَّل بنك العبارات…</div>;

  return (
    <div className="card" style={{ padding: "0.9rem 1rem", background: "var(--color-paper2)" }}>
      <div style={{ fontWeight: 800, marginBottom: "0.3rem" }}>🧰 بنك وسائل التعبير — عبارات الامتحان الوظيفية</div>
      <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)", marginBottom: "0.6rem", lineHeight: 1.85 }}>
        عبارات جاهزة مصنّفة بما تفعله (رأي/تعليل/اعتراض/شكوى…) وبجزء الامتحان الذي تخدمه (A2–B2)، لكلّ عبارة مثالٌ كامل بترجمته.
        تظهر مختاراتٌ منها أيضًا داخل مهامّ التحدّث والكتابة في مواضعها. التدريب هنا استرجاع: تذكّر العبارة ثم اكشفها وقيّم نفسك بصدق.
      </div>

      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.6rem" }}>
        <button type="button" className={modus === "bank" ? "btn btn-primary" : "btn btn-ghost"} onClick={() => setModus("bank")}>📚 تصفّح البنك</button>
        <button type="button" className={modus === "drill" ? "btn btn-primary" : "btn btn-ghost"} onClick={() => { setModus("drill"); setPos(0); setBilanz({ ja: 0, nein: 0 }); setGezeigt(false); }}>🎯 تدريب الاسترجاع</button>
      </div>

      {modus === "bank" && (
        <>
          <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "0.4rem" }}>
            <button type="button" className={!teil ? "btn btn-primary" : "btn btn-ghost"} onClick={() => setTeil(null)}>كلّ الأجزاء</button>
            {REDE_TEILE.map((t) => (
              <button key={t.key} type="button" className={teil === t.key ? "btn btn-primary" : "btn btn-ghost"} onClick={() => setTeil(t.key)}>{t.ar}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "0.6rem" }}>
            <button type="button" className={!funktion ? "btn btn-gold" : "btn btn-ghost"} onClick={() => setFunktion(null)}>كلّ الوظائف</button>
            {REDE_FUNKTIONEN.map((f) => (
              <button key={f.key} type="button" className={funktion === f.key ? "btn btn-gold" : "btn btn-ghost"} onClick={() => setFunktion(f.key)}>{f.ar}</button>
            ))}
          </div>
          <div style={{ fontSize: "0.85rem", marginBottom: "0.5rem" }}><b className="rtl-num">{liste.length}</b> عبارة في هذا الاختيار:</div>
          <div style={{ display: "grid", gap: "0.45rem" }}>
            {liste.map((x) => (
              <div key={x.id} className="card" style={{ padding: "0.6rem 0.8rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.4rem", alignItems: "center" }}>
                  <strong><De>{x.de}</De></strong>
                  <span style={{ fontSize: "0.78rem", color: "var(--color-ink2)" }}>{funktionAr(x.funktion)} · {x.level}</span>
                </div>
                <div style={{ fontSize: "0.88rem", marginTop: "0.15rem" }}>{x.ar}</div>
                {offenesBeispiel === x.id ? (
                  <div style={{ marginTop: "0.35rem", background: "var(--color-paper)", borderRadius: 8, padding: "0.45rem 0.6rem" }}>
                    <DeBlock>{x.beispielDe}</DeBlock>
                    <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)" }}>{x.beispielAr}</div>
                  </div>
                ) : (
                  <button type="button" className="btn btn-ghost" style={{ marginTop: "0.3rem" }} onClick={() => setOffenesBeispiel(x.id)}>مثال في جملة ←</button>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {modus === "drill" && (
        <div>
          {aktuell ? (
            <div className="card" style={{ padding: "0.8rem 1rem" }}>
              <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)", marginBottom: "0.3rem" }}>
                بطاقة <span className="rtl-num">{pos + 1}</span> من <span className="rtl-num">{runde.length}</span> · الوظيفة: {funktionAr(aktuell.funktion)} · {aktuell.level}
              </div>
              <div style={{ fontSize: "1rem", lineHeight: 1.9 }}>
                ما العبارة الألمانية التي معناها: «{aktuell.ar}»؟
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)" }}>جرّب نطقها أو كتابتها في ذهنك كاملةً قبل الكشف — الاسترجاع أولًا هو التدريب.</div>
              {!gezeigt ? (
                <button type="button" className="btn btn-primary" style={{ marginTop: "0.5rem" }} onClick={() => setGezeigt(true)}>اكشف العبارة والمثال</button>
              ) : (
                <div className="fadein" style={{ marginTop: "0.5rem" }}>
                  <div style={{ background: "var(--color-gold-soft)", borderRadius: 8, padding: "0.5rem 0.7rem" }}>
                    <strong><De>{aktuell.de}</De></strong>
                    <DeBlock>{aktuell.beispielDe}</DeBlock>
                    <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)" }}>{aktuell.beispielAr}</div>
                  </div>
                  <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
                    <button type="button" className="btn btn-primary" onClick={() => bewerten(true)}>✅ عرفتها بنفسي</button>
                    <button type="button" className="btn btn-ghost" onClick={() => bewerten(false)}>↺ لم أعرفها — سأراجعها</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="card" style={{ padding: "0.8rem 1rem" }}>
              <strong>انتهت الجولة:</strong> عرفتَ <b className="rtl-num">{bilanz.ja}</b> من <b className="rtl-num">{bilanz.ja + bilanz.nein}</b> بنفسك
              (حكمك أنت على ذاكرتك — لا درجة آلية).
              <div style={{ marginTop: "0.5rem" }}>
                <button type="button" className="btn btn-primary" onClick={() => { setDrillSeed((s) => s + 1); setPos(0); setBilanz({ ja: 0, nein: 0 }); setGezeigt(false); }}>🎯 جولة جديدة</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
