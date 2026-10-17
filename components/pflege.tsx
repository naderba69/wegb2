"use client";
import { useState } from "react";
import { pflegeWoerter, pflegeDialoge, pflegeDoku, pflegePruefung, pflegeMedizin, pflegeFachwissen, pflegePhrasen } from "@/lib/pflege";
import { useEffect } from "react";
import { speakAny } from "@/lib/speech";
import { De } from "@/components/De";

/**
 * 🩺 محطة ألمانية التمريض (R197) — مسار Fachsprache إضافي اختياري:
 * مفردات مهنية A2→B2، حوارات عمل حقيقية، نماذج توثيق، وتوجيه لصيغة telc Medizin/Pflege.
 * لا يدخل في خطة الـ378 يومًا ولا في أيّ نتيجة — هدفه جسر B2 العام إلى مكان العمل.
 * الصوت هنا نطق متصفح (speakAny) لا تسجيلات — ولا ندّعي غير ذلك.
 */
const THEMEN: Record<string, string> = {
  koerper: "🧍 أعضاء الجسم",
  symptome: "🤒 الأعراض",
  versorgung: "💉 الرعاية والقياس",
  doku: "🗂️ التوثيق والتسليم",
  medikamente: "💊 الأدوية",
  pflegealltag: "🏥 يوم العمل في القسم",
  notfall: "🚨 الطوارئ",
  anatomie: "🦴 تشريح أعمق",
  befund: "📋 نتائج وإدارة",
  dubletten: "🔤 ألماني ↔ لاتيني طبي",
};

/** ⏱️ محاكاة Medizin مؤقّتة (R199): 12 بندًا (قراءة+استماع) بزمن مقترح ونتيجة صريحة المصدر. */
function MedizinSimulation() {
  const [aktiv, setAktiv] = useState(false);
  const [antworten, setAntworten] = useState<Record<string, number>>({});
  const [fertig, setFertig] = useState(false);
  const [sekunden, setSekunden] = useState(90 * 60);
  const gesamtFragen = pflegeMedizin.lesen.reduce((a, l) => a + l.fragen.length, 0) + pflegeMedizin.hoeren.reduce((a, h) => a + h.fragen.length, 0);
  useEffect(() => {
    if (!aktiv || fertig) return;
    const t = setInterval(() => setSekunden((s) => {
      if (s <= 1) { setFertig(true); return 0; }
      return s - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [aktiv, fertig]);
  const alle = [
    ...pflegeMedizin.lesen.flatMap((l) => l.fragen.map((f, fi) => ({ schluessel: `${l.id}-${fi}`, richtig: f.richtig }))),
    ...pflegeMedizin.hoeren.flatMap((h) => h.fragen.map((f, fi) => ({ schluessel: `${h.id}-${fi}`, richtig: f.richtig }))),
  ];
  const richtigZahl = alle.filter((a) => antworten[a.schluessel] === a.richtig).length;
  const fragenBlock = (itemId: string, fragen: typeof pflegeMedizin.lesen[0]["fragen"]) => (
    <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.5rem" }}>
      {fragen.map((f, fi) => (
        <fieldset key={fi} style={{ border: "1px solid var(--color-line)", borderRadius: "0.6rem", padding: "0.5rem 0.7rem" }}>
          <legend style={{ fontWeight: 700, fontSize: "0.88rem" }}><De>{f.frage}</De></legend>
          {f.optionen.map((o, oi) => {
            const k = `${itemId}-${fi}`;
            const gewaehlt = antworten[k] === oi;
            const korrekt = fertig && oi === f.richtig;
            const falschGewaehlt = fertig && gewaehlt && oi !== f.richtig;
            return (
              <label key={oi} style={{ display: "flex", gap: "0.45rem", alignItems: "center", minHeight: "40px", cursor: "pointer", fontWeight: korrekt ? 800 : 400, color: falschGewaehlt ? "var(--color-cola)" : undefined }}>
                <input type="radio" name={k} checked={gewaehlt} disabled={fertig}
                  onChange={() => setAntworten((a) => ({ ...a, [k]: oi }))} />
                <De>{o}</De>{korrekt ? " ✓" : falschGewaehlt ? " ✗" : ""}
              </label>
            );
          })}
        </fieldset>
      ))}
    </div>
  );
  return (
    <section data-testid="pflege-medizin">
      <h3 style={{ fontWeight: 800, margin: "0.2rem 0 0.5rem" }}>⏱️ محاكاة telc Medizin/Pflege الموسّعة — قراءة واستماع (90 دقيقة مقترحة)</h3>
      <p style={{ fontSize: "0.82rem", color: "var(--color-ink2)", margin: "0 0 0.5rem" }}>{pflegeMedizin.hinweisAr}</p>
      {!aktiv ? (
        <button type="button" className="btn btn-primary" style={{ minHeight: "46px" }} data-testid="pflege-medizin-start"
          onClick={() => { setAktiv(true); setFertig(false); setAntworten({}); setSekunden(90 * 60); }}>
          ▶ ابدأ المحاكاة ({gesamtFragen} سؤالًا)
        </button>
      ) : (
        <div style={{ display: "grid", gap: "0.7rem" }}>
          <div role="timer" aria-label="الزمن المتبقي" style={{ fontWeight: 800 }}>
            ⏱️ المتبقي: {Math.floor(sekunden / 60)}:{String(sekunden % 60).padStart(2, "0")}
            {fertig && <span data-testid="pflege-medizin-ergebnis"> · النتيجة: {richtigZahl}/{alle.length} ({Math.round((richtigZahl / alle.length) * 100)}%) — محاكاة داخلية، لا نتيجة telc</span>}
          </div>
          {pflegeMedizin.lesen.map((l) => (
            <article key={l.id} className="card" style={{ padding: "0.7rem 0.9rem" }}>
              <div style={{ fontWeight: 800 }}>📖 <De>{l.titel}</De></div>
              <De style={{ display: "block", lineHeight: 1.9, marginTop: "0.3rem" }}>{l.text}</De>
              {fragenBlock(l.id, l.fragen)}
            </article>
          ))}
          {pflegeMedizin.hoeren.map((h) => (
            <article key={h.id} className="card" style={{ padding: "0.7rem 0.9rem" }}>
              <div style={{ fontWeight: 800 }}>🎧 <De>{h.titel}</De></div>
              <button type="button" className="btn btn-ghost" style={{ minHeight: "44px", marginTop: "0.35rem" }}
                onClick={() => speakAny(h.transkript)}>🔊 استمع (صوت متصفح آلي)</button>
              {fragenBlock(h.id, h.fragen)}
              {fertig && <De style={{ display: "block", fontSize: "0.82rem", color: "var(--color-ink2)", marginTop: "0.4rem" }}>{h.transkript}</De>}
            </article>
          ))}
          {!fertig ? (
            <button type="button" className="btn btn-primary" style={{ minHeight: "46px" }} data-testid="pflege-medizin-abgabe" onClick={() => setFertig(true)}>
              ✅ سلّم واعرض النتيجة
            </button>
          ) : (
            <button type="button" className="btn btn-ghost" style={{ minHeight: "46px" }} onClick={() => { setAktiv(false); setFertig(false); setAntworten({}); }}>
              ↩ محاولة جديدة لاحقًا
            </button>
          )}
        </div>
      )}
    </section>
  );
}

/** 🧠 بنك معرفة مهنية (R203): إجابة فورية بشرح عربي — تدريب على نمط أسئلة Kenntnisprüfung. */
function FachwissenQuiz() {
  const [antworten, setAntworten] = useState<Record<number, number>>({});
  const beantwortet = Object.keys(antworten).length;
  const richtigZahl = pflegeFachwissen.filter((f, i) => antworten[i] === f.richtig).length;
  const fertig = beantwortet === pflegeFachwissen.length && pflegeFachwissen.length > 0;
  return (
    <section data-testid="pflege-fachwissen">
      <h3 style={{ fontWeight: 800, margin: "0.2rem 0 0.5rem" }}>🧠 معرفة مهنية بأسلوب Kenntnisprüfung ({pflegeFachwissen.length} سؤالًا)</h3>
      <p style={{ fontSize: "0.82rem", color: "var(--color-ink2)", margin: "0 0 0.6rem" }}>
        أسئلة معرفة تمريضية أساسية (نظافة، وقاية، أدوية، طوارئ، حقوق) بإجابة فورية وشرح.
        تدريب من تأليف المشروع — أسئلة Kenntnisprüfung الحقيقية تحدّدها ولايتك وجهة امتحانها.
        {beantwortet > 0 && <> · أجبتَ عن {beantwortet}/{pflegeFachwissen.length}، الصحيح {richtigZahl}</>}
        {fertig && <strong data-testid="pflege-fachwissen-ergebnis"> · النتيجة النهائية: {richtigZahl}/{pflegeFachwissen.length} ({Math.round((richtigZahl / pflegeFachwissen.length) * 100)}%)</strong>}
      </p>
      <div style={{ display: "grid", gap: "0.55rem" }}>
        {pflegeFachwissen.map((f, i) => {
          const gewaehlt = antworten[i];
          return (
            <fieldset key={i} style={{ border: "1px solid var(--color-line)", borderRadius: "0.6rem", padding: "0.55rem 0.75rem" }}>
              <legend style={{ fontWeight: 700, fontSize: "0.88rem" }}>{i + 1}. <De>{f.frage}</De></legend>
              {f.optionen.map((o, oi) => {
                const istWahl = gewaehlt === oi;
                const zeigen = gewaehlt !== undefined;
                return (
                  <label key={oi} style={{ display: "flex", gap: "0.45rem", alignItems: "center", minHeight: "40px", cursor: zeigen ? "default" : "pointer", fontWeight: zeigen && oi === f.richtig ? 800 : 400, color: zeigen && istWahl && oi !== f.richtig ? "var(--color-cola)" : undefined }}>
                    <input type="radio" name={`fw-${i}`} checked={istWahl} disabled={zeigen}
                      data-testid={i === 0 ? `pflege-fw-${oi}` : undefined}
                      onChange={() => setAntworten((a) => ({ ...a, [i]: oi }))} />
                    <De>{o}</De>{zeigen && oi === f.richtig ? " ✓" : zeigen && istWahl ? " ✗" : ""}
                  </label>
                );
              })}
              {gewaehlt !== undefined && (
                <p style={{ fontSize: "0.82rem", color: "var(--color-ink2)", margin: "0.3rem 0 0" }}>💡 {f.erklaerungAr}</p>
              )}
            </fieldset>
          );
        })}
      </div>
    </section>
  );
}

export function PflegeStation() {
  const [stufe, setStufe] = useState<string>("alle");
  const [dialogId, setDialogId] = useState<string>(pflegeDialoge[0]?.id ?? "");
  const [offeneMuster, setOffeneMuster] = useState<Record<string, boolean>>({});
  const dialog = pflegeDialoge.find((d) => d.id === dialogId) ?? pflegeDialoge[0];
  const woerter = pflegeWoerter.filter((w) => stufe === "alle" || w.stufe === stufe);

  return (
    <div data-testid="pflege-station" style={{ display: "grid", gap: "1rem" }}>
      <p style={{ fontSize: "0.86rem", color: "var(--color-ink2)", margin: 0 }}>
        🩺 مسارٌ إضافي اختياري لمن هدفه العمل في الرعاية الصحية بألمانيا. لا يدخل في خطة الأيام ولا نتائجها —
        وهو جسرٌ من B2 العام إلى لغة مكان العمل. صوت الحوارات نطقُ متصفّحٍ آلي، لا تسجيلات بشرية.
        ولن تشعر أنك تدرس «مادة» منفصلة: كل كلمات هذا المسار الـ133 منسوجة أيضًا في حزم مفرداتك اليومية
        العامة (الصحة والعمل) بمستوياتها، و64 جملةً مهنية (منها عبارات سرير المريض العشر) في بنك جملك العام — فتصلك داخل دروسك العادية في وقتها الطبيعي، وهذه المحطة تعميقٌ اختياري (حوارات وتوثيق ومحاكاة).
      </p>

      {/* ── المفردات المهنية ── */}
      <section>
        <h3 style={{ fontWeight: 800, margin: "0.2rem 0 0.5rem" }}>📚 المفردات المهنية ({woerter.length})</h3>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.6rem" }} role="group" aria-label="تصفية بالمستوى">
          {["alle", "A2", "B1", "B2"].map((s) => (
            <button key={s} type="button" className="chip" data-testid={`pflege-stufe-${s}`}
              onClick={() => setStufe(s)}
              style={{ cursor: "pointer", minHeight: "40px", fontWeight: 700, background: stufe === s ? "var(--color-cola)" : undefined, color: stufe === s ? "var(--ui-on-accent)" : undefined }}>
              {s === "alle" ? "الكلّ" : s}
            </button>
          ))}
        </div>
        <div style={{ display: "grid", gap: "0.45rem" }}>
          {woerter.map((w) => (
            <article key={w.id} data-testid={`pflege-wort-${w.id}`} className="card" style={{ padding: "0.6rem 0.8rem" }}>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "baseline", flexWrap: "wrap" }}>
                <De style={{ fontWeight: 800 }}>{w.de}</De>
                {w.latein && <span className="chip" title="المصطلح الطبي اللاتيني">🏥 <De>{w.latein}</De></span>}
                {w.plural && w.plural !== "—" && <span className="tiny muted">جمع: <De>{w.plural}</De></span>}
                <span className="chip">{w.stufe}</span>
                <span className="chip">{THEMEN[w.thema]}</span>
                <span style={{ fontWeight: 700 }}>{w.ar}</span>
              </div>
              <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", marginTop: "0.3rem", flexWrap: "wrap" }}>
                <De style={{ fontSize: "0.88rem" }}>{w.bsp}</De>
                <button type="button" className="chip" style={{ cursor: "pointer", minHeight: "36px" }} onClick={() => speakAny(w.bsp)} aria-label="استمع إلى جملة المثال">🔊</button>
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--color-ink2)" }}>{w.bspAr}</div>
            </article>
          ))}
        </div>
      </section>

      {/* ── عبارات بجانب السرير A1 ── */}
      <section data-testid="pflege-phrasen">
        <h3 style={{ fontWeight: 800, margin: "0.2rem 0 0.5rem" }}>🛏️ عبارات بجانب السرير — من اليوم الأول (A1)</h3>
        <div style={{ display: "grid", gap: "0.4rem" }}>
          {pflegePhrasen.map((s) => (
            <div key={s.de} style={{ display: "flex", gap: "0.45rem", alignItems: "center", flexWrap: "wrap", borderInlineStart: "3px solid var(--color-a1)", paddingInlineStart: "0.6rem" }}>
              <De style={{ fontWeight: 700 }}>{s.de}</De>
              <button type="button" className="chip" style={{ cursor: "pointer", minHeight: "36px" }} onClick={() => speakAny(s.de)} aria-label="استمع إلى العبارة">🔊</button>
              <span style={{ fontSize: "0.85rem" }}>{s.ar}</span>
              <span style={{ fontSize: "0.78rem", color: "var(--color-ink2)" }}>({s.situation})</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── حوارات العمل ── */}
      <section>
        <h3 style={{ fontWeight: 800, margin: "0.2rem 0 0.5rem" }}>🗣️ حوارات من يوم العمل</h3>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.6rem" }}>
          {pflegeDialoge.map((d) => (
            <button key={d.id} type="button" className="chip" data-testid={`pflege-dialog-${d.id}`}
              onClick={() => setDialogId(d.id)}
              style={{ cursor: "pointer", minHeight: "40px", fontWeight: 700, background: dialog?.id === d.id ? "var(--color-cola)" : undefined, color: dialog?.id === d.id ? "var(--ui-on-accent)" : undefined }}>
              {d.titel}
            </button>
          ))}
        </div>
        {dialog && (
          <div className="card" style={{ padding: "0.8rem 1rem" }}>
            <div style={{ fontWeight: 700, marginBottom: "0.2rem" }}>{dialog.ar} · مستوى {dialog.stufe}</div>
            <p style={{ fontSize: "0.82rem", color: "var(--color-ink2)", margin: "0 0 0.6rem" }}>
              استمع لكلّ سطر، كرّره بصوت مرتفع، ثم تدرّب على دور الممرّض وحده — هكذا تُبنى طلاقة مكان العمل.
            </p>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              {dialog.zeilen.map((z, i) => (
                <div key={i} data-testid="pflege-zeile" style={{ borderInlineStart: "3px solid var(--color-b1)", paddingInlineStart: "0.6rem" }}>
                  <span className="chip" style={{ fontWeight: 800 }}>{z.r}</span>{" "}
                  <De>{z.de}</De>{" "}
                  <button type="button" className="chip" style={{ cursor: "pointer", minHeight: "36px" }} onClick={() => speakAny(z.de)} aria-label="استمع إلى السطر">🔊</button>
                  <div style={{ fontSize: "0.82rem", color: "var(--color-ink2)" }}>{z.ar}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── التوثيق المهني ── */}
      <section>
        <h3 style={{ fontWeight: 800, margin: "0.2rem 0 0.5rem" }}>✍️ التوثيق المهني — اكتب ثم قارن بالنموذج</h3>
        <p style={{ fontSize: "0.85rem", color: "var(--color-ink2)", margin: "0 0 0.5rem" }}>سلّمٌ مدرّج: من كلمات مفردة وأرقام (A1) عبر جمل بسيطة (A2) وتقارير مترابطة (B1) إلى تقرير احترافي بالمبني للمجهول والأسلوب الاسمي (B2).</p>
        <div style={{ display: "grid", gap: "0.6rem" }}>
          {[...pflegeDoku].sort((a, b) => ({ A1: 0, A2: 1, B1: 2, B2: 3 }[a.stufe ?? "B1"] ?? 2) - ({ A1: 0, A2: 1, B1: 2, B2: 3 }[b.stufe ?? "B1"] ?? 2)).map((d) => (
            <article key={d.id} className="card" style={{ padding: "0.7rem 0.9rem" }}>
              <div style={{ fontWeight: 800 }}>{d.titel}{d.stufe ? <span data-testid={`pflege-doku-stufe-${d.id}`} style={{ marginInlineStart: "0.5rem", fontSize: "0.75rem", background: "var(--color-paper2)", borderRadius: "999px", padding: "0.1rem 0.55rem" }}>{d.stufe}</span> : null}</div>
              <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)" }}>{d.ar}</div>
              <De style={{ display: "block", margin: "0.4rem 0", fontSize: "0.9rem" }}>{d.aufgabeDe}</De>
              <textarea className="field" rows={4} placeholder="اكتب تدوينك الألماني هنا…" aria-label={d.titel} style={{ width: "100%" }} />
              <button type="button" className="btn btn-ghost" style={{ marginTop: "0.4rem", minHeight: "44px" }}
                data-testid={`pflege-muster-${d.id}`}
                onClick={() => setOffeneMuster((m) => ({ ...m, [d.id]: !m[d.id] }))}>
                {offeneMuster[d.id] ? "🙈 أخفِ النموذج" : "👁 قارن بالنموذج وقائمة الفحص"}
              </button>
              {offeneMuster[d.id] && (
                <div style={{ marginTop: "0.5rem" }}>
                  <De style={{ display: "block", background: "var(--color-paper2)", padding: "0.6rem 0.8rem", borderRadius: "0.5rem", lineHeight: 1.9 }}>{d.muster}</De>
                  <ul style={{ margin: "0.4rem 0 0", paddingInlineStart: "1.1rem", fontSize: "0.85rem" }}>
                    {d.punkte.map((p) => <li key={p}>{p}</li>)}
                  </ul>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <MedizinSimulation />

      <FachwissenQuiz />

      {/* ── صيغة الامتحان المهني ── */}
      <section>
        <h3 style={{ fontWeight: 800, margin: "0.2rem 0 0.5rem" }}>🎯 نحو امتحان telc Medizin/Pflege — توجيه تدريبي</h3>
        <p style={{ fontSize: "0.82rem", color: "var(--color-ink2)", margin: "0 0 0.5rem" }}>
          هذه بطاقات توجيه على صيغة الامتحان المهني كما تنشرها telc — تدريبٌ عليها، وليست امتحانًا رسميًا ولا بديلًا عن نماذج telc الأصلية قبل التقديم.
        </p>
        <div style={{ display: "grid", gap: "0.5rem" }}>
          {pflegePruefung.map((p) => (
            <article key={p.id} className="card" style={{ padding: "0.7rem 0.9rem" }}>
              <div style={{ fontWeight: 800 }}><De>{p.titel}</De> · {p.ar}</div>
              <p style={{ fontSize: "0.86rem", margin: "0.3rem 0" }}>{p.formatAr}</p>
              <p style={{ fontSize: "0.84rem", color: "var(--color-ink2)", margin: 0 }}>🏃 {p.uebungAr}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
