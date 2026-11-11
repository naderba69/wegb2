"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { De } from "./De";
import { baueVpHoerteile, vpTexte, vpDialoge, vpSchreiben, vpSprechen, vpDialogPoolTransparenz, type VpFrage } from "@/lib/vollpruefung";
import { VP_B2_REFERENZ_ITEMS } from "@/lib/vollpruefung-pool";
import { lokalesDatum } from "@/lib/datum";
import { useBankGeneration } from "@/lib/use-bank-generation";

/**
 * 🧪 تدريب امتحاني داخلي (R218/R157/R162): أربعة أقسام بمؤقّت واحد ونتيجة مجمّعة.
 * الاستماع 30 بنداً فعلياً في 4 أجزاء تدريبية؛ القراءة جولة بنك أقصر. كلاهما
 * بتصحيح آلي، والكتابة والتحدّث بتقييم ذاتي معلَن. لا يُكتب تقدّم في الخطة.
 */
const STUFEN = ["A2", "B1", "B2"] as const;
const TRAININGS_MIN: Record<string, number> = { A2: 100, B1: 130, B2: 160 };
type Phase = "start" | "lesen" | "hoeren" | "schreiben" | "sprechen" | "ergebnis";
const PHASEN: Phase[] = ["lesen", "hoeren", "schreiben", "sprechen", "ergebnis"];
const PHASEN_NAME: Record<Phase, string> = {
  start: "البداية", lesen: "📖 القراءة", hoeren: "🎧 الاستماع",
  schreiben: "✍️ الكتابة", sprechen: "🎙️ التحدّث", ergebnis: "🏁 النتيجة",
};

function FragenBlock({ fragen, praefix, antworten, setAntworten, zeigen }: {
  fragen: VpFrage[]; praefix: string; antworten: Record<string, string>;
  setAntworten: (f: (a: Record<string, string>) => Record<string, string>) => void; zeigen: boolean;
}) {
  return (
    <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.5rem" }}>
      {fragen.map((f, fi) => {
        const key = `${praefix}-${fi}`;
        const gewaehlt = antworten[key];
        return (
          <fieldset key={fi} style={{ border: "1px solid var(--color-line)", borderRadius: "0.6rem", padding: "0.5rem 0.7rem" }}>
            <legend style={{ fontSize: "0.9rem", fontWeight: 700 }}><De>{f.promptDe}</De></legend>
            <div style={{ fontSize: "0.82rem", color: "var(--color-ink2)" }}>{f.promptAr}</div>
            {f.options.map((opt) => (
              <label key={opt} style={{ display: "block", padding: "0.25rem 0", cursor: zeigen ? "default" : "pointer" }}>
                <input type="radio" name={key} value={opt} disabled={zeigen}
                  checked={gewaehlt === opt}
                  onChange={() => setAntworten((a) => ({ ...a, [key]: opt }))} />{" "}
                <De>{opt}</De>
                {zeigen && opt === f.answer && <span> ✅</span>}
                {zeigen && gewaehlt === opt && opt !== f.answer && <span> ❌</span>}
              </label>
            ))}
            {zeigen && (
              <div style={{ fontSize: "0.82rem", marginTop: "0.3rem" }}>
                الإجابة: <De>{f.answer}</De>{f.explanationAr ? <span> — {f.explanationAr}</span> : null}
              </div>
            )}
          </fieldset>
        );
      })}
    </div>
  );
}

export function VollPruefung() {
  const bankGeneration = useBankGeneration();
  const [stufe, setStufe] = useState<string>("B1");
  const [phase, setPhase] = useState<Phase>("start");
  const [antworten, setAntwortenState] = useState<Record<string, string>>({});
  const [selbst, setSelbst] = useState<Record<string, boolean>>({});
  const [sekunden, setSekunden] = useState(TRAININGS_MIN.B1 * 60);
  const setAntworten = (f: (a: Record<string, string>) => Record<string, string>) => setAntwortenState(f);

  const [variante, setVariante] = useState(0);
  const tagesSamen = useMemo(() => Number(lokalesDatum().replaceAll("-", "")), []);
  const samen = tagesSamen + variante * 101;
  const pick = useCallback(<T,>(pool: T[], anzahl: number): T[] => {
    if (!pool.length) return [];
    const start = (samen * 7) % pool.length;
    return Array.from({ length: Math.min(anzahl, pool.length) }, (_, i) => pool[(start + i) % pool.length]);
  }, [samen]);
  const texte = useMemo(() => {
    void bankGeneration;
    return pick(vpTexte.filter((t) => t.level === stufe), 2);
  }, [stufe, pick, bankGeneration]);
  const hoerteile = useMemo(() => {
    void bankGeneration;
    return baueVpHoerteile(vpDialoge, stufe, samen);
  }, [stufe, samen, bankGeneration]);
  const schreibAufgabe = useMemo(() => {
    void bankGeneration;
    return pick(vpSchreiben.filter((w) => w.level === stufe), 1)[0];
  }, [stufe, pick, bankGeneration]);
  const sprechKarte = useMemo(() => {
    void bankGeneration;
    return pick(vpSprechen.filter((k) => !k.level || k.level === stufe), 1)[0]
      ?? vpSprechen[samen % Math.max(1, vpSprechen.length)];
  }, [stufe, pick, samen, bankGeneration]);
  const lesenItems = texte.reduce((summe, text) => summe + text.fragen.length, 0);
  const hoerenItems = hoerteile.reduce((summe, teil) =>
    summe + teil.dialoge.reduce((teilSumme, dialog) => teilSumme + dialog.fragen.length, 0), 0);
  const hoerteileVollstaendig = hoerteile.length === 4 && hoerteile.every((teil) =>
    teil.dialoge.reduce((summe, dialog) => summe + dialog.fragen.length, 0) === teil.zielItems);
  const dialogPool = vpDialogPoolTransparenz.nachStufe[stufe];

  const laueft = phase !== "start" && phase !== "ergebnis";
  useEffect(() => {
    if (!laueft) return;
    const t = setInterval(() => setSekunden((s) => {
      if (s <= 1) { setPhase("ergebnis"); return 0; }
      return s - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [laueft]);

  const zaehle = (items: { fragen: VpFrage[] }[], praefix: (i: number) => string) => {
    let richtig = 0, gesamt = 0;
    items.forEach((item, ii) => item.fragen.forEach((f, fi) => {
      gesamt += 1;
      if (antworten[`${praefix(ii)}-${fi}`] === f.answer) richtig += 1;
    }));
    return { richtig, gesamt };
  };
  const lesenZ = zaehle(texte, (i) => `lesen${i}`);
  const hoerTeilErgebnisse = hoerteile.map((teil, teilIndex) =>
    zaehle(teil.dialoge, (dialogIndex) => `hoeren${teilIndex}-${dialogIndex}`));
  const hoerenZ = hoerTeilErgebnisse.reduce((gesamt, teilErgebnis) => ({
    richtig: gesamt.richtig + teilErgebnis.richtig,
    gesamt: gesamt.gesamt + teilErgebnis.gesamt,
  }), { richtig: 0, gesamt: 0 });
  const schreibKriterien = schreibAufgabe?.criteria ?? [];
  const schreibOk = schreibKriterien.filter((_, i) => selbst[`schreiben-${i}`]).length;
  const sprechKriterien = ["بدأت بجمل كاملة واضحة", "استعملت وسيلتي تعبير على الأقل من الداعمة", "التزمت بالوقت وختمت بخلاصة أو سؤال"];
  const sprechOk = sprechKriterien.filter((_, i) => selbst[`sprechen-${i}`]).length;
  const pct = (r: number, g: number) => (g ? Math.round((r / g) * 100) : 0);
  const ergebnisZeilen = [
    { name: "القراءة", wert: pct(lesenZ.richtig, lesenZ.gesamt), detail: `${lesenZ.richtig}/${lesenZ.gesamt}` },
    { name: "الاستماع", wert: pct(hoerenZ.richtig, hoerenZ.gesamt), detail: `${hoerenZ.richtig}/${hoerenZ.gesamt}` },
    { name: "الكتابة (تقييم ذاتي)", wert: pct(schreibOk, Math.max(1, schreibKriterien.length)), detail: `${schreibOk}/${schreibKriterien.length} معايير` },
    { name: "التحدّث (تقييم ذاتي)", wert: pct(sprechOk, 3), detail: `${sprechOk}/3` },
  ];
  const gesamtPct = Math.round(ergebnisZeilen.reduce((a, z) => a + z.wert, 0) / ergebnisZeilen.length);
  const bestanden = gesamtPct >= 80 && ergebnisZeilen.every((z) => z.wert >= 60);

  const start = () => {
    setAntwortenState({});
    setSelbst({});
    setSekunden(TRAININGS_MIN[stufe] * 60);
    setPhase("lesen");
  };
  const weiter = () => {
    const idx = PHASEN.indexOf(phase as Phase);
    setPhase(PHASEN[Math.min(PHASEN.length - 1, idx + 1)]);
  };
  const bereit = texte.length >= 1 && hoerenItems === 30 && hoerteileVollstaendig && !!schreibAufgabe;

  return (
    <section data-testid="vollpruefung" style={{ display: "grid", gap: "0.8rem" }}>
      <h3 style={{ fontWeight: 800, margin: 0 }}>🧪 تدريب امتحاني داخلي — أربعة أقسام بمؤقّت واحد</h3>
      <p style={{ fontSize: "0.86rem", color: "var(--color-ink2)", margin: 0 }}>
        تدريب مجمّع من بنوك الأكاديمية نفسها بنتيجة داخلية في النهاية. الاستماع جولة فعلية من <b>30 بنداً في 4 أجزاء تدريبية موسومة</b>،
        أما القراءة فهي جولة بنك أقصر وليست محاكاة كاملة. هذه <b>ليست نتيجة Goethe أو telc رسمية</b> ولا ادعاءً بصيغة رسمية، ولا يُسجَّل شيء في خطتك.
        القراءة والاستماع بتصحيح آلي واضح؛ الكتابة والتحدّث ب<b>تقييم ذاتي</b> بالنموذج والمعايير — لا درجة آلية زائفة.
      </p>

      {phase === "start" && (
        <div className="card" style={{ padding: "0.8rem 1rem", display: "grid", gap: "0.6rem" }}>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }} role="group" aria-label="المستوى">
            {STUFEN.map((s) => (
              <button key={s} type="button" data-testid={`vollpruefung-stufe-${s}`} className={stufe === s ? "btn btn-primary" : "btn btn-ghost"}
                style={{ minHeight: "44px" }} onClick={() => setStufe(s)}>{s}</button>
            ))}
          </div>
          <div data-testid="vollpruefung-umfang" style={{ fontSize: "0.88rem", lineHeight: 1.8 }}>
            <strong>حجم هذه التشكيلة:</strong> القراءة {lesenItems} بنداً · الاستماع {hoerenItems} بنداً في {hoerteile.length} أجزاء.
            {stufe === "B2" && (
              <>
                <br />المخطط المرجعي المؤقت: القراءة {VP_B2_REFERENZ_ITEMS.lesen} بنداً والاستماع {VP_B2_REFERENZ_ITEMS.hoeren} بنداً؛
                الاستماع هنا {hoerenItems}/{VP_B2_REFERENZ_ITEMS.hoeren} موزع 8+7+8+7، بينما القراءة {lesenItems}/{VP_B2_REFERENZ_ITEMS.lesen} فقط.
                أسماء الأجزاء تنظيم تدريبي داخلي إلى أن تكتمل مراجعة الصيغة الخارجية الموقعة.
              </>
            )}
          </div>
          <div data-testid="vollpruefung-dialog-pool" style={{ fontSize: "0.82rem", color: "var(--color-ink2)", lineHeight: 1.7 }}>
            مخزون الاستماع للمستوى: {dialogPool ? `${dialogPool.akzeptiert}/${dialogPool.gesamt} حواراً مقبولاً · ${dialogPool.ausgeschlossen} مقصى · ${dialogPool.mitEinerMc} بسؤال اختيار واحد` : "يُحمَّل…"}.
          </div>
          <div style={{ fontSize: "0.88rem" }}>
            ⏱️ سقف وقت التدريب الداخلي: {TRAININGS_MIN[stufe]} دقيقة للأقسام الأربعة. هذا ليس الزمن الرسمي ولا اختبار تحمّل كاملاً.
          </div>
          <button type="button" className="btn btn-primary" style={{ minHeight: "48px" }}
            data-testid="vollpruefung-start" onClick={start} disabled={!bereit}>
            ▶ ابدأ التدريب الداخلي ({stufe})
          </button>
          <button type="button" className="btn btn-ghost" style={{ minHeight: "44px" }}
            data-testid="vollpruefung-variante" onClick={() => setVariante((x) => x + 1)}>
            🔀 تشكيلة تدريب أخرى (رقم {variante + 1}) — نصوص وحوارات مختلفة من البنوك
          </button>
          {!bereit && <div style={{ fontSize: "0.82rem" }}>البنوك تُحمَّل… أعد المحاولة بعد لحظات.</div>}
        </div>
      )}

      {phase !== "start" && (
        <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap" }}>
          <span className="card" style={{ padding: "0.3rem 0.7rem", fontWeight: 800 }}>
            ⏱️ المتبقي: {Math.floor(sekunden / 60)}:{String(sekunden % 60).padStart(2, "0")}
          </span>
          <span style={{ fontSize: "0.85rem" }}>{PHASEN_NAME[phase]} · المستوى {stufe}</span>
        </div>
      )}

      {phase === "lesen" && texte.map((t, i) => (
        <article key={t.id} className="card" style={{ padding: "0.8rem 1rem" }}>
          <div style={{ fontWeight: 800 }}><De>{t.titleDe}</De> <span style={{ fontSize: "0.82rem", color: "var(--color-ink2)" }}>{t.titleAr}</span></div>
          <De style={{ display: "block", lineHeight: 1.9, marginTop: "0.4rem" }}>{t.de}</De>
          <FragenBlock fragen={t.fragen} praefix={`lesen${i}`} antworten={antworten} setAntworten={setAntworten} zeigen={false} />
        </article>
      ))}

      {phase === "hoeren" && hoerteile.map((teil, teilIndex) => {
        const teilItems = teil.dialoge.reduce((summe, dialog) => summe + dialog.fragen.length, 0);
        return (
          <section key={teil.id} data-testid={`vollpruefung-hoerteil-${teilIndex + 1}`} className="card" style={{ padding: "0.8rem 1rem" }}>
            <h4 style={{ margin: 0 }}>{teil.labelAr} — {teilItems}/{teil.zielItems} بنود</h4>
            <p style={{ fontSize: "0.82rem", color: "var(--color-ink2)" }}>
              تسمية تدريبية داخلية؛ استمع أولًا ثم أجب. يظهر النص المكتوب بعد إنهاء الجلسة للمراجعة.
            </p>
            <div style={{ display: "grid", gap: "0.8rem" }}>
              {teil.dialoge.map((d, dialogIndex) => (
                <article key={d.id} style={{ borderTop: dialogIndex ? "1px solid var(--color-line)" : undefined, paddingTop: dialogIndex ? "0.8rem" : 0 }}>
                  <div style={{ fontWeight: 800 }}><De>{d.titleDe}</De> <span style={{ fontSize: "0.82rem", color: "var(--color-ink2)" }}>{d.titleAr}</span></div>
                  {d.audio && <audio controls src={d.audio} style={{ width: "100%" }} aria-label={d.titleDe} />}
                  <FragenBlock fragen={d.fragen} praefix={`hoeren${teilIndex}-${dialogIndex}`} antworten={antworten} setAntworten={setAntworten} zeigen={false} />
                </article>
              ))}
            </div>
          </section>
        );
      })}

      {phase === "schreiben" && schreibAufgabe && (
        <article className="card" style={{ padding: "0.8rem 1rem", display: "grid", gap: "0.5rem" }}>
          <div style={{ fontWeight: 800 }}><De>{schreibAufgabe.titleDe}</De> <span style={{ fontSize: "0.82rem", color: "var(--color-ink2)" }}>{schreibAufgabe.titleAr}</span></div>
          <De style={{ display: "block" }}>{schreibAufgabe.taskDe}</De>
          <div style={{ fontSize: "0.85rem" }}>{schreibAufgabe.taskAr}</div>
          <textarea className="field" rows={12} placeholder="اكتب نصّك الألماني هنا…" aria-label="نص الكتابة" style={{ width: "100%" }} />
          <div style={{ fontSize: "0.83rem", color: "var(--color-ink2)" }}>النموذج والمعايير يظهران في النتيجة لتقيّم نفسك بصدق.</div>
        </article>
      )}

      {phase === "sprechen" && sprechKarte && (
        <article className="card" style={{ padding: "0.8rem 1rem", display: "grid", gap: "0.5rem" }}>
          <div style={{ fontWeight: 800 }}><De>{sprechKarte.titel_de}</De> <span style={{ fontSize: "0.82rem", color: "var(--color-ink2)" }}>{sprechKarte.titel_ar}</span></div>
          <De style={{ display: "block" }}>{sprechKarte.auftrag_de}</De>
          {!!sprechKarte.stuetzen?.length && (
            <div>
              <div style={{ fontSize: "0.85rem" }}>وسائل تعبير داعمة:</div>
              <ul style={{ margin: "0.3rem 0", paddingInlineStart: "1.1rem", lineHeight: 1.9 }}>
                {sprechKarte.stuetzen.map((s) => <li key={s}><De>{s}</De></li>)}
              </ul>
            </div>
          )}
          <div style={{ fontSize: "0.85rem" }}>🎙️ تحدّث بصوت مرتفع (نحو دقيقتين) — وحدك أو مع زميل أو مع رفيق المحادثة إن فعّلته. هنا لا تسجيل ولا تقييم نطق.</div>
        </article>
      )}

      {laueft && (
        <button type="button" className="btn btn-primary" style={{ minHeight: "48px" }} data-testid="vollpruefung-weiter" onClick={weiter}>
          {phase === "sprechen" ? "🏁 إنهاء الجلسة وعرض النتيجة" : "القسم التالي ←"}
        </button>
      )}

      {phase === "ergebnis" && (
        <div style={{ display: "grid", gap: "0.7rem" }}>
          <article className="card" style={{ padding: "0.8rem 1rem" }} data-testid="vollpruefung-ergebnis">
            <div style={{ fontWeight: 800, fontSize: "1.05rem" }}>النتيجة المجمّعة الداخلية: {gesamtPct}%</div>
            <ul style={{ margin: "0.5rem 0", paddingInlineStart: "1.1rem", lineHeight: 2 }}>
              {ergebnisZeilen.map((z) => (
                <li key={z.name}>{z.name}: <b>{z.wert}%</b> ({z.detail})</li>
              ))}
            </ul>
            <div style={{ fontSize: "0.86rem" }}>
              {bestanden
                ? "✅ بمعيار المشروع الداخلي (80% إجمالًا و60% لكل مهارة) تبدو جاهزًا لهذا المستوى — يبقى القرار الأخير للامتحان الرسمي."
                : "📈 لم تُستوفَ عتبة المشروع الداخلية بعد (80% إجمالًا و60% لكل مهارة) — راجع المهارة الأضعف ثم أعد الجلسة."}
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--color-ink2)", marginTop: "0.4rem" }}>
              تذكير: الكتابة والتحدّث قِيّما ذاتيًا؛ في الامتحان الحقيقي يقيّمهما مصحّحون بشريون.
            </div>
          </article>

          {schreibAufgabe && (
            <article className="card" style={{ padding: "0.8rem 1rem" }}>
              <div style={{ fontWeight: 800 }}>✍️ قارن كتابتك بالنموذج وعلّم المعايير المحققة</div>
              <De style={{ display: "block", background: "var(--color-paper2)", padding: "0.6rem 0.8rem", borderRadius: "0.5rem", lineHeight: 1.9, marginTop: "0.4rem" }}>{schreibAufgabe.sample}</De>
              {schreibKriterien.map((c, i) => (
                <label key={c} style={{ display: "block", padding: "0.25rem 0", cursor: "pointer" }}>
                  <input type="checkbox" checked={!!selbst[`schreiben-${i}`]}
                    onChange={() => setSelbst((s) => ({ ...s, [`schreiben-${i}`]: !s[`schreiben-${i}`] }))} /> {c}
                </label>
              ))}
            </article>
          )}

          <article className="card" style={{ padding: "0.8rem 1rem" }}>
            <div style={{ fontWeight: 800 }}>🎙️ تحدّث: قيّم نفسك بصدق</div>
            {sprechKriterien.map((c, i) => (
              <label key={c} style={{ display: "block", padding: "0.25rem 0", cursor: "pointer" }}>
                <input type="checkbox" checked={!!selbst[`sprechen-${i}`]}
                  onChange={() => setSelbst((s) => ({ ...s, [`sprechen-${i}`]: !s[`sprechen-${i}`] }))} /> {c}
              </label>
            ))}
          </article>

          <article className="card" style={{ padding: "0.8rem 1rem" }}>
            <div style={{ fontWeight: 800 }}>📖 مراجعة القراءة (الإجابات والشروح)</div>
            {texte.map((t, i) => (
              <div key={t.id} style={{ marginTop: "0.5rem" }}>
                <div style={{ fontWeight: 700 }}><De>{t.titleDe}</De></div>
                <FragenBlock fragen={t.fragen} praefix={`lesen${i}`} antworten={antworten} setAntworten={setAntworten} zeigen />
              </div>
            ))}
          </article>
          <article className="card" style={{ padding: "0.8rem 1rem" }} data-testid="vollpruefung-hoeren-auswertung">
            <div style={{ fontWeight: 800 }}>🎧 مراجعة الاستماع — {hoerenZ.richtig}/{hoerenZ.gesamt} (مع النص المسموع)</div>
            {hoerteile.map((teil, teilIndex) => (
              <section key={teil.id} style={{ marginTop: "0.8rem" }}>
                <h4 style={{ margin: 0 }}>{teil.labelAr} — {hoerTeilErgebnisse[teilIndex].richtig}/{hoerTeilErgebnisse[teilIndex].gesamt}</h4>
                {teil.dialoge.map((d, dialogIndex) => (
                  <div key={d.id} style={{ marginTop: "0.5rem" }}>
                    <div style={{ fontWeight: 700 }}><De>{d.titleDe}</De></div>
                    <div style={{ fontSize: "0.88rem", lineHeight: 1.9 }}>
                      {d.zeilen.map((z, zi) => <div key={zi}><b>{z.who}:</b> <De>{z.de}</De></div>)}
                    </div>
                    <FragenBlock fragen={d.fragen} praefix={`hoeren${teilIndex}-${dialogIndex}`} antworten={antworten} setAntworten={setAntworten} zeigen />
                  </div>
                ))}
              </section>
            ))}
          </article>
          <button type="button" className="btn btn-ghost" style={{ minHeight: "44px" }} onClick={() => setPhase("start")}>
            ↺ جلسة جديدة
          </button>
        </div>
      )}
    </section>
  );
}
