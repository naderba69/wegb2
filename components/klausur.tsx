"use client";
// 🎯 Probeklausur — محاكاة امتحان بمؤقّت رسمي لكل قسم، تصحيح أعمى حتى النهاية
import { useEffect, useMemo, useRef, useState } from "react";
import type { Exercise, Progress } from "@/lib/types";
import { buildKlausur, buildSkillKlausur, SKILL_LABELS, klausurNote, sprintPlan, type Klausur, type KlausurSection, type SkillKey } from "@/lib/klausur";
import { getDialogue } from "@/lib/content";
import { normalize } from "@/lib/grader";
import { addFehlerNow, logKN } from "@/lib/store";
import type { Kompetenz } from "@/lib/types";
import { speakAny, speakLine, stopSpeech, listenDe, recognitionAvailable } from "@/lib/speech";
import { De } from "./De";

function gradeItem(ex: Exercise, resp: string): boolean {
  if (!resp.trim()) return false;
  if (ex.type === "mc") return resp === ex.answer;
  const n = normalize(resp);
  const answers = Array.isArray(ex.answer) ? ex.answer : [ex.answer];
  return answers.some((a) => normalize(String(a)) === n);
}

export function ProbeklausurCard({ progress }: { progress: Progress }) {
  const [open, setOpen] = useState(false);
  const [skill, setSkill] = useState<SkillKey | null>(null);
  const sprint = progress.settings.examDate ? sprintPlan(progress.settings.examDate) : null;
  return (
    <>
      <div className="card" style={{ padding: "1rem 1.2rem", borderInlineStart: "5px solid var(--color-b2)" }}>
        <strong>🎯 Probeklausur — محاكاة امتحان كاملة بمؤقّت</strong>
        <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)", margin: "0.3rem 0 0.6rem", lineHeight: 1.8 }}>
          أربعة أقسام بتوقّيت رسمي: قراءة 15د · استماع 12د · قواعد 15د · كتابة 28د — بلا كشف الإجابات حتى النهاية،
          درجة Goethe (النجاح 60%)، وكل خطأ يذهب إلى دفتر الأخطاء. تُبنى من محتوى مرحلتك الحالية.
        </div>
        {sprint && (
          <div style={{ background: "var(--color-gold-soft)", borderRadius: "0.7rem", padding: "0.7rem 0.9rem", margin: "0.5rem 0", fontSize: "0.88rem" }}>
            <strong>
              🏃 Prüfungs-Sprint — بقي <span className="rtl-num">{sprint.days}</span> يوماً (الأسبوع {sprint.current} من 4)
            </strong>
            {sprint.weeks.map((w) => (
              <div key={w.nr} style={{ margin: "0.35rem 0", opacity: w.nr === sprint.current ? 1 : 0.55 }}>
                <strong>
                  {w.nr === sprint.current ? "▶️" : "▫️"} Woche {w.nr}: {w.focus}
                </strong>
                <ul style={{ margin: "0.15rem 0 0", paddingInlineStart: "1.2rem" }}>
                  {w.tasks.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap", marginTop: "0.55rem" }}>
          <button
            className="btn btn-primary"
            style={{ minHeight: "44px" }}
            onClick={() => {
              setSkill(null);
              setOpen(true);
            }}
          >
            🚀 المحاكاة الكاملة (70 دقيقة)
          </button>
          {(Object.keys(SKILL_LABELS) as SkillKey[]).map((sk) => (
            <button
              key={sk}
              className="btn btn-ghost"
              style={{ minHeight: "44px" }}
              onClick={() => {
                setSkill(sk);
                setOpen(true);
              }}
            >
              {sk === "lesen" ? "📖" : sk === "hoeren" ? "🎧" : sk === "schreiben" ? "✍️" : "🗣️"} {SKILL_LABELS[sk].de}
            </button>
          ))}
        </div>
        <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)", marginTop: "0.35rem" }}>
          {skill ? `مُختارةٌ الآن: ${SKILL_LABELS[skill].ar} — تبدأ فوراً بمؤقّتها الخاص` : "أربعُ محاكاتٍ مهاريّةٍ مستقلّة — كلُّ مهارةٍ بورقةٍ وعَدَدٍ ودفترِ أخطاءٍ خاصّ بها"}
        </div>
      </div>
      {open && <KlausurApp progress={progress} skill={skill ?? undefined} onClose={() => setOpen(false)} />}
    </>
  );
}

function KlausurApp({ progress, onClose, skill }: { progress: Progress; onClose: () => void; skill?: SkillKey }) {
  const k: Klausur = useMemo(() => (skill ? buildSkillKlausur(progress.plan.day, skill) : buildKlausur(progress.plan.day)), [progress.plan.day, skill]);
  const [secIdx, setSecIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [wrBy, setWrBy] = useState<Record<number, string>>({});
  const [sprBy, setSprBy] = useState<Record<number, string>>({});
  const [micOn, setMicOn] = useState(false);
  const micRef = useRef<() => void>(() => {});
  const [wrChecks, setWrChecks] = useState<Record<string, boolean>>({});
  const [done, setDone] = useState(false);
  const [left, setLeft] = useState(k.sections[0].minutes * 60);
  const captured = useRef(false);

  const sec = k.sections[secIdx];

  useEffect(() => {
    if (done) return;
    const t = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          next();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secIdx, done]);

  const next = () => {
    stopSpeech();
    if (secIdx < k.sections.length - 1) {
      const ni = secIdx + 1;
      setSecIdx(ni);
      setLeft(k.sections[ni].minutes * 60);
    } else {
      setDone(true);
    }
  };

  // ── التصحيح النهائي + دفتر الأخطاء (مرة واحدة) ──
  const report = useMemo(() => {
    if (!done) return null;
    const per: { key: string; s: number; t: number }[] = [];
    let wrongList: { ex: Exercise; resp: string }[] = [];
    for (const [si, s] of k.sections.entries()) {
      let sc = 0;
      let tot = 0;
      for (const ex of s.items) {
        tot += 1;
        const resp = answers[ex.id] ?? "";
        if (gradeItem(ex, resp)) sc += 1;
        else wrongList.push({ ex, resp });
      }
      if (s.write || s.sprechen) {
        const c = s.write ? s.write.criteria : s.sprechen!.kriterien;
        const chk = Object.entries(wrChecks).filter(([kk, v]) => v && kk.startsWith(`${si}:`)).length;
        tot += c.length;
        sc += chk;
      }
      per.push({ key: s.sprechen ? `${s.key} T${s.sprechen.teil}` : s.key, s: sc, t: tot });
    }
    if (!captured.current) {
      captured.current = true;
      for (const { ex, resp } of wrongList) {
        const right = Array.isArray(ex.answer) ? ex.answer[0] : ex.answer;
        addFehlerNow({
          falsch: resp.trim() || "(leer)",
          richtig: String(right),
          art: ex.type === "dictation" ? "schreibung" : ex.type === "translate" ? "konstruktion" : "sonst",
          ar: ex.explanationAr ?? ex.explanationDe ?? "من المحاكاة الامتحانية",
          quelle: "Probeklausur",
        });
      }
      // توصيل شبكة الكفاءات: كل قسم يغذّي كفاءته (خط أنابيب ③) — النجاح ≥60%
      for (const row of per) {
        const h: Kompetenz =
          row.key === "Lesen" ? "Lesen" : row.key === "Hören" ? "Hoeren" : row.key === "Schreiben" ? "Schreiben" : "Grammatik";
        logKN(h, row.t > 0 && row.s / row.t >= 0.6);
      }
    }
    const s = per.reduce((a, p) => a + p.s, 0);
    const t = per.reduce((a, p) => a + p.t, 0);
    const pct = t ? Math.round((s / t) * 100) : 0;
    return { per, pct, ...klausurNote(pct), wrongCount: wrongList.length };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const mmss = `${String(Math.floor(left / 60)).padStart(2, "0")}:${String(left % 60).padStart(2, "0")}`;

  return (
    <div style={{ position: "fixed", inset: 0, background: "#f5f0e1", zIndex: 60, overflow: "auto", padding: "1rem" }}>
      <div style={{ maxWidth: "46rem", margin: "0 auto" }}>
        {/* شريط المؤقّت */}
        {!done && (
          <div
            className="card weg-print-hide"
            style={{
              padding: "0.7rem 1.1rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              position: "sticky",
              top: 0,
              zIndex: 5,
              background: left < 300 ? "var(--color-cola-soft)" : "white",
            }}
          >
            <strong>
              Teil {secIdx + 1}/{k.sections.length}: {sec.titleDe}
            </strong>
            <span className="rtl-num" style={{ fontSize: "1.3rem", fontWeight: 900, color: left < 300 ? "var(--color-cola)" : "var(--color-cola)" }}>
              ⏱ {mmss}
            </span>
          </div>
        )}

        {!done ? (
          <section className="card" style={{ padding: "1.2rem" }}>
            <h3 style={{ fontWeight: 900 }}>
              {sec.titleDe} — {sec.titleAr}
            </h3>
            <div style={{ fontSize: "0.78rem", color: "var(--color-ink2)", marginBottom: "0.7rem" }}>{sec.realExamHint}</div>

            {sec.passages?.map((p) => (
              <article key={p.titleDe} className="de" style={{ display: "block", background: "var(--color-paper2)", padding: "0.9rem", borderRadius: "0.7rem", margin: "0.5rem 0", lineHeight: 1.9 }}>
                <strong style={{ display: "block", marginBottom: "0.3rem" }}>{p.titleDe}</strong>
                {p.de}
              </article>
            ))}

            {sec.key === "Hören" && sec.dialogueId && (
              <div style={{ display: "flex", gap: "0.5rem", margin: "0.5rem 0", flexWrap: "wrap" }}>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    const dlg = getDialogue(sec.dialogueId!);
                    dlg?.lines.forEach((l, i) => setTimeout(() => speakLine(l.de, undefined, { rate: progress.settings.rate, voiceName: progress.settings.voiceName }), i * 1700));
                  }}
                >
                  ▶️ شغّل التسجيل (بلا نص — 3 مرات فقط*)
                </button>
                <button className="btn btn-ghost" onClick={() => stopSpeech()}>⏹</button>
                <span style={{ fontSize: "0.75rem", color: "var(--color-ink2)", alignSelf: "center" }}>* الاستماع المتكرّر مسموح للتدريب — في الامتحان مرة واحدة</span>
              </div>
            )}

            {sec.items.map((ex, i) => (
              <div key={ex.id} style={{ margin: "0.9rem 0", padding: "0.7rem 0.9rem", background: "white", borderRadius: "0.6rem", border: "1px solid var(--color-line)" }}>
                <div style={{ fontWeight: 700, marginBottom: "0.35rem" }}>
                  <span className="rtl-num">{i + 1}.</span> <De>{ex.promptDe}</De>
                  {ex.promptAr && <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)", fontWeight: 400 }}>{ex.promptAr}</div>}
                </div>
                {ex.type === "mc" ? (
                  <div style={{ display: "grid", gap: "0.3rem" }}>
                    {(ex.options ?? []).map((o) => (
                      <label key={o} style={{ display: "flex", gap: "0.5rem", cursor: "pointer", direction: "ltr", textAlign: "left" }}>
                        <input
                          type="radio"
                          name={ex.id}
                          checked={answers[ex.id] === o}
                          onChange={() => setAnswers((a) => ({ ...a, [ex.id]: o }))}
                        />
                        <span>{o}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <input
                    className="field"
                    style={{ direction: "ltr" }}
                    placeholder="Antwort …"
                    value={answers[ex.id] ?? ""}
                    onChange={(e) => setAnswers((a) => ({ ...a, [ex.id]: e.target.value }))}
                  />
                )}
              </div>
            ))}

            {sec.write && (
              <div style={{ margin: "0.9rem 0" }}>
                <div className="card" style={{ padding: "0.8rem 1rem", background: "var(--color-gold-soft)" }}>
                  <De>{sec.write.taskDe}</De>
                  <div style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>{sec.write.taskAr}</div>
                </div>
                <textarea className="field" rows={8} dir="ltr" style={{ lineHeight: 1.8, width: "100%" }} placeholder="Schreibe hier …" value={wrBy[secIdx] ?? ""} onChange={(e) => setWrBy((m) => ({ ...m, [secIdx]: e.target.value }))} />
                <div style={{ fontWeight: 700, margin: "0.5rem 0 0.3rem" }}>معايير التقييم الذاتي (بصدق!):</div>
                {sec.write.criteria.map((c, i) => (
                  <label key={c} style={{ display: "flex", gap: "0.5rem", cursor: "pointer", margin: "0.2rem 0" }}>
                    <input type="checkbox" checked={!!wrChecks[`${secIdx}:${i}`]} onChange={() => setWrChecks((ch) => ({ ...ch, [`${secIdx}:${i}`]: !ch[`${secIdx}:${i}`] }))} />
                    <span>{c}</span>
                  </label>
                ))}
                <div style={{ fontSize: "0.78rem", color: "var(--color-ink2)", marginTop: "0.3rem" }}>عددُ الكلمات: <span className="rtl-num">{(wrBy[secIdx] ?? "").trim() ? (wrBy[secIdx] ?? "").trim().split(/\s+/).length : 0}</span></div>
              </div>
            )}

            {sec.sprechen && (
              <div className="card" style={{ margin: "0.9rem 0" }}>
                <div style={{ background: "var(--color-paper2)", borderRadius: "0.6rem", padding: "0.8rem 1rem" }}>
                  <strong style={{ fontSize: "1rem" }}>{sec.sprechen.titelDe}</strong>
                  <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)", margin: "0.25rem 0 0.4rem" }}>{sec.sprechen.titelAr} · Teil {sec.sprechen.teil} · {Math.round(sec.sprechen.zeit_s / 60)} دقيقة كلامٍ فعلي (زائدَ تحضيرٍ صامت)</div>
                  <De style={{ display: "block", fontSize: "0.92rem", lineHeight: 1.8 }}>{sec.sprechen.auftrag}</De>
                  <div style={{ marginTop: "0.5rem", fontWeight: 700, fontSize: "0.85rem" }}>دعاماتُ البناء:</div>
                  <ul style={{ margin: "0.15rem 0 0.5rem", paddingInlineStart: "1.15rem", fontSize: "0.85rem" }}>
                    {sec.sprechen.stuetzen.map((x) => (
                      <li key={x}><De>{x}</De></li>
                    ))}
                  </ul>
                  {recognitionAvailable() ? (
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                      <button
                        className="btn"
                        style={{ background: micOn ? "var(--color-cola-soft)" : "var(--color-gold-soft)", minHeight: "44px" }}
                        onClick={() => {
                          if (micOn) {
                            micRef.current();
                            setMicOn(false);
                            return;
                          }
                          setMicOn(true);
                          micRef.current = listenDe((txt) => {
                            setSprBy((m) => ({ ...m, [secIdx]: ((m[secIdx] ?? "") + " " + txt).trim() }));
                            setMicOn(false);
                          }, () => setMicOn(false));
                        }}
                      >
                        {micOn ? "🎙️ جارٍ الاستماع — اضغط للإيقاف" : "🎙️ جرّب الميكروفون (تدريبُ طلاقةٍ لا تصحيحٌ آليّ)"}
                      </button>
                      {sprBy[secIdx] ? <span style={{ fontSize: "0.82rem", color: "var(--color-ink2)" }} dir="ltr">«{sprBy[secIdx]}»</span> : null}
                    </div>
                  ) : (
                    <div style={{ fontSize: "0.78rem", color: "var(--color-ink2)" }}>تعرُّفُ الكلامِ غيرُ متوفّرٍ في متصفّحِك — جرّب Chrome/Edge، أو اكتفِ بالتسجيلِ على هاتفك والمقارنةِ بالدعامات.</div>
                  )}
                </div>
                <div style={{ fontWeight: 700, margin: "0.6rem 0 0.3rem", fontSize: "0.9rem" }}>قيِّمْ نفسَك بصدق — كما ستفعل اللجنة:</div>
                {sec.sprechen.kriterien.map((c, i) => (
                  <label key={c.de} style={{ display: "flex", gap: "0.5rem", cursor: "pointer", margin: "0.2rem 0", minHeight: "44px", alignItems: "center" }}>
                    <input type="checkbox" checked={!!wrChecks[`${secIdx}:${i}`]} onChange={() => setWrChecks((ch) => ({ ...ch, [`${secIdx}:${i}`]: !ch[`${secIdx}:${i}`] }))} />
                    <span>
                      <De>{c.de}</De> <span style={{ color: "var(--color-ink2)", fontSize: "0.85rem" }}>— {c.ar}</span>
                    </span>
                  </label>
                ))}
                <div style={{ fontSize: "0.75rem", color: "var(--color-ink2)", marginTop: "0.3rem" }}>التقديرُ ذاتيٌّ لأنّ الشفاهةَ البشريةَ خارجَ وعدِ المنصّة — الميكروفونُ يثبِتُ الطلاقةَ لا المحتوى.</div>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem" }}>
              <button className="btn btn-ghost" onClick={onClose}>🚪 انسحب</button>
              <button className="btn btn-gold" onClick={next}>
                {secIdx < k.sections.length - 1 ? "سلّم هذا القسم ← التالي" : "سلّم الورقة الأخيرة — Auswerten"}
              </button>
            </div>
          </section>
        ) : (
          report && (
            <section className="card fadein" style={{ padding: "1.4rem", textAlign: "center" }}>
              <div style={{ fontSize: "2.4rem", fontWeight: 900 }} className="rtl-num">
                {report.pct}%
              </div>
              <div style={{ fontWeight: 800 }}>الدرجة: {report.note}</div>
              <div style={{ margin: "0.4rem 0" }}>{report.pct >= 60 ? "🎉 " : "⚠️ "}{report.goethe}</div>
              <div style={{ display: "flex", gap: "0.4rem", justifyContent: "center", flexWrap: "wrap", margin: "0.6rem 0" }}>
                {report.per.map((p) => (
                  <span key={p.key} className="chip">
                    {p.key}: <span className="rtl-num">{p.s}/{p.t}</span>
                  </span>
                ))}
              </div>
              <div style={{ fontSize: "0.9rem", color: "var(--color-ink2)" }}>
                {report.wrongCount > 0
                  ? `📓 أُرسل ${report.wrongCount} خطأً إلى دفتر الأخطاء — ستراها في مراجعتك المتباعدة.`
                  : "✨ ورقة نظيفة! لا أخطاء جديدة في الدفتر."}
              </div>
              {k.sections.filter((x) => x.write).map((x) => (
                <details key={x.titleDe} style={{ marginTop: "0.8rem", textAlign: "start" }}>
                  <summary style={{ cursor: "pointer", fontWeight: 700 }}>نموذج «{x.titleAr}» للمقارنة</summary>
                  <article className="de" style={{ display: "block", background: "var(--color-paper2)", padding: "0.8rem", borderRadius: "0.6rem", marginTop: "0.4rem", lineHeight: 1.85 }}>
                    {x.write!.sample}
                  </article>
                  {x.write!.noteAr ? (
                    <ul style={{ margin: "0.4rem 0 0", paddingInlineStart: "1.2rem", fontSize: "0.84rem", color: "var(--color-ink2)" }}>
                      {x.write!.noteAr.map((n) => (
                        <li key={n}>{n}</li>
                      ))}
                    </ul>
                  ) : null}
                </details>
              ))}
              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginTop: "1rem" }}>
                <button className="btn btn-primary" onClick={onClose}>← رجوع للخطة</button>
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    const k2 = buildKlausur(progress.plan.day + 1000);
                    setAnswers({});
                    setWrChecks({});
                    setWrBy({});
                    setSprBy({});
                    captured.current = false;
                    setSecIdx(0);
                    setLeft(k2.sections[0].minutes * 60);
                    setDone(false);
                    // نموذج جديد ببذرة مختلفة: بناء يدوي عبر استبدال k غير ممكن مع useMemo — نعتمد بذرة اليوم+1000 بإعادة تحميل الحالة
                    window.location.reload();
                  }}
                >
                  🔁 نموذج جديد لاحقاً
                </button>
              </div>
            </section>
          )
        )}
      </div>
    </div>
  );
}

export type { KlausurSection };
