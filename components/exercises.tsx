"use client";
// عارض التمارين — تصحيح فوري عبر Grader مع التغذية الآنية (Modul S):
//   💡 مؤشر ثقة حيّ أثناء الكتابة · 🔍 Diff view كلمةً كلمة · 🔁 إعادة محاولة بلا كشف
// كل هذا يعيش في طبقة التصحيح الموحّدة — فيستفيد كل تمرين في التطبيق دفعةً واحدة.
import { useState } from "react";
import type { Exercise } from "@/lib/types";
import { grader, deepReview, konfidenz, diffWoerter } from "@/lib/grader";
import { addFehlerNow, logSicherheitNow } from "@/lib/store";
import { speakAny } from "@/lib/speech";
import { VertrauensBalken, AntwortDiff } from "./ui";
import { LehrerDiff } from "./lehrer";
import { De } from "./De";

interface Props {
  items: Exercise[];
  onPoints?: (points: number, max: number) => void;
}

interface ItemState {
  response: string | string[];
  checked: boolean;
  correct: boolean;
  feedback?: string;
  versuche: number;
  gezaehlt: boolean;
  retry?: boolean;
  /** 🔁 umformung: تشخيصٌ موجَّهٌ بلا كشفِ الجواب يُعرَضُ قبلَ المحاولةِ الأخيرة */
  hinweis?: string;
  /** order: فهارسُ الرموزِ المختارةِ لتمييزِ المكرَّر */
  chosenIdx?: number[];
  /** 🎯 تقييمُ الثقةِ قبلَ الإجابة (mc): true متأكّد، false غيرُ متأكّد، undefined لم يُقيَّم */
  sicher?: boolean;
}

/** عارض التمارين — تصحيح فوري عبر Grader (قابل للاستبدال بـ LLM) */
export default function ExerciseSet({ items, onPoints }: Props) {
  const [states, setStates] = useState<Record<string, ItemState>>({});

  const setState = (id: string, s: ItemState) =>
    setStates((prev) => {
      const next = { ...prev, [id]: s };
      return next;
    });

  const refOf = (ex: Exercise) => String(Array.isArray(ex.answer) ? ex.answer[0] : ex.answer);
  const givenOf = (st: ItemState) => (typeof st.response === "string" ? st.response : (st.response as string[]).join(" "));

  const check = (ex: Exercise) => {
    const st = states[ex.id];
    const response = st?.response ?? (ex.type === "order" ? [] : "");
    const versuche = st?.versuche ?? 0;
    const gezaehlt = st?.gezaehlt ?? false;
    const res = grader.grade(ex, response);

    if (res.correct) {
      // ✅ صحيح — من المحاولة الثانية: نصف النقاط بلا سجلّ خطأ
      const halb = versuche >= 1;
      setState(ex.id, {
        response,
        checked: true,
        correct: true,
        versuche,
        gezaehlt: true,
        feedback: halb ? "✅ أصبتَ من المحاولة الثانية — نصف النقاط" : res.feedbackAr,
        sicher: st?.sicher,
      });
      if (!gezaehlt) onPoints?.(halb ? Math.round(res.maxPoints / 2) : res.points, res.maxPoints);
      if (!gezaehlt && ex.type === "mc" && st?.sicher !== undefined) logSicherheitNow({ t: new Date().toISOString(), id: ex.id, sicher: st.sicher, correct: !halb });
      return;
    }

    if (versuche < 1) {
      // 🔁 خانئ — إعادة محاولة أخيرة بلا كشف
      // للتحويل: التشخيصُ الموجَّهُ («ما زلتَ تكتبُ …» / «ينقصك …») يُعطى الآن — هو تلميحٌ لا كشف؛
      // أمّا رسالةُ «النموذج: …» فتكشفُ الجوابَ فلا تُعرَضُ قبلَ المحاولةِ الأخيرة
      const hinweis = ex.type === "umformung" && res.feedbackAr && !res.feedbackAr.includes("النموذج:") ? res.feedbackAr : undefined;
      setState(ex.id, { response, checked: false, correct: false, versuche: 1, gezaehlt, retry: true, hinweis, sicher: st?.sicher });
      return;
    }

    // ❌ الكشف النهائي: Diff + ثقة + فحص المدرّس + دفتر الأخطاء
    setState(ex.id, { response, checked: true, correct: false, versuche, gezaehlt: true, feedback: res.feedbackAr, sicher: st?.sicher });
    if (!gezaehlt) onPoints?.(0, res.maxPoints);
    const ueberkonfident = ex.type === "mc" && st?.sicher === true;
    if (!gezaehlt && ex.type === "mc" && st?.sicher !== undefined) logSicherheitNow({ t: new Date().toISOString(), id: ex.id, sicher: st.sicher, correct: false });
    const given = givenOf({ response, checked: true, correct: false, versuche, gezaehlt: true });
    addFehlerNow({
      falsch: given && given.trim() ? given : ex.promptDe,
      richtig: refOf(ex),
      art:
        ex.type === "dictation" || ex.type === "translate"
          ? "schreibweise"
          : ex.type === "umformung"
            ? "konstruktion"
          : ex.type === "fill"
            ? "konstruktion"
            : "wortstellung",
      ar: (ueberkonfident ? "⚠️ ثقةٌ خاطئة — كنتَ متأكّداً: " : "") + (ex.explanationAr ?? ""),
      quelle: ex.promptDe.slice(0, 42),
    });
  };

  // مراجعة المدرّس العميقة للأجوبة الكتابية الخاطئة (ترجمة/تسميع/ملء)
  const deepOf = (ex: Exercise, st?: ItemState) => {
    if (!st?.checked || st.correct) return null;
    if (ex.type !== "translate" && ex.type !== "dictation" && ex.type !== "fill" && ex.type !== "umformung") return null;
    return deepReview(givenOf(st), refOf(ex));
  };

  const getippt = (ex: Exercise) => ex.type === "fill" || ex.type === "dictation" || ex.type === "translate" || ex.type === "umformung";

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      {items.map((ex, i) => {
        const st = states[ex.id];
        const liveWert = getippt(ex) && st && !st.checked ? konfidenz(givenOf(st), refOf(ex)) : null;
        return (
          <div
            key={ex.id}
            className="card"
            style={{
              padding: "1rem 1.1rem",
              borderInlineStart: st?.checked
                ? st.correct
                  ? "4px solid var(--color-a1)"
                  : "4px solid var(--color-cola)"
                : st?.retry
                  ? "4px solid var(--color-gold)"
                  : undefined,
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: "0.5rem" }}>
              <span style={{ color: "var(--color-ink2)" }} className="rtl-num">
                {i + 1}.
              </span>{" "}
              <De>{ex.promptDe}</De>
              {ex.promptAr && (
                <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)", marginTop: "0.2rem" }}>
                  {ex.promptAr}
                </div>
              )}
            </div>

            {ex.type === "mc" && ex.options && !st?.checked && (
              <div data-testid="sicherheit" style={{ display: "flex", gap: "0.4rem", alignItems: "center", marginBottom: "0.5rem", fontSize: "0.85rem", flexWrap: "wrap" }}>
                <span style={{ color: "var(--color-ink2)" }}>قبلَ أن تجيب — كم أنت متأكّد؟</span>
                <button type="button" className="btn btn-ghost" data-testid="sicher-ja" aria-pressed={st?.sicher === true}
                  style={{ padding: "0.15rem 0.6rem", background: st?.sicher === true ? "var(--color-gold-soft)" : "white" }}
                  onClick={() => setState(ex.id, { ...(st ?? emptySt(st)), sicher: true })}>👍 متأكّد</button>
                <button type="button" className="btn btn-ghost" data-testid="sicher-nein" aria-pressed={st?.sicher === false}
                  style={{ padding: "0.15rem 0.6rem", background: st?.sicher === false ? "var(--color-gold-soft)" : "white" }}
                  onClick={() => setState(ex.id, { ...(st ?? emptySt(st)), sicher: false })}>🤔 غيرُ متأكّد</button>
              </div>
            )}
            {ex.type === "mc" && ex.options && (
              <div style={{ display: "grid", gap: "0.4rem" }}>
                {ex.options.map((opt) => {
                  const selected = st?.response === opt;
                  return (
                    <button
                      key={opt}
                      className="btn btn-ghost"
                      style={{
                        justifyContent: "flex-start",
                        textAlign: "start",
                        background: selected ? "var(--color-gold-soft)" : "white",
                        direction: "ltr",
                      }}
                      disabled={st?.checked}
                      onClick={() => setState(ex.id, { ...emptySt(st), response: opt, sicher: st?.sicher })}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}

            {ex.type === "truefalse" && ex.options && (
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {ex.options.map((opt) => {
                  const selected = st?.response === opt;
                  return (
                    <button
                      key={opt}
                      className="btn btn-ghost"
                      style={{ background: selected ? "var(--color-gold-soft)" : "white" }}
                      disabled={st?.checked}
                      onClick={() => setState(ex.id, { ...emptySt(st), response: opt, sicher: st?.sicher })}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}

            {(ex.type === "fill" || ex.type === "dictation" || ex.type === "translate" || ex.type === "umformung") && (
              <>
                {ex.type === "umformung" && ex.quelleDe && (
                  <div data-testid="umformung-quelle" style={{ marginBottom: "0.5rem", padding: "0.5rem 0.7rem", background: "var(--color-paper2)", borderInlineStart: "3px solid var(--color-gold)", borderRadius: "6px" }}>
                    <span style={{ fontSize: "0.72rem", color: "var(--color-ink2)", display: "block" }}>🔁 حوِّل هذه الجملة:</span>
                    <De style={{ fontWeight: 700 }}>{ex.quelleDe}</De>
                  </div>
                )}
                {ex.text && (
                  <div style={{ marginBottom: "0.5rem" }} data-testid="ex-text">
                    <De>{ex.text.replace("___", "______")}</De>
                    {ex.id.startsWith("pl-hoer") && (
                      <button
                        type="button"
                        className="chip"
                        style={{ marginTop: "0.3rem", cursor: "pointer" }}
                        onClick={() => speakAny(ex.text!)}
                      >
                        🔊 استمع إلى المقطع
                      </button>
                    )}
                  </div>
                )}
                {ex.type === "dictation" && (
                  <button
                    className="btn btn-gold"
                    style={{ marginBottom: "0.5rem" }}
                    disabled={st?.checked}
                    onClick={() => speakAny(ex.answer)}
                  >
                    🔊 اسمع الجملة ثم اكتبها
                  </button>
                )}
                <input
                  className="field"
                  style={{ direction: "ltr", maxWidth: "30rem" }}
                  placeholder={ex.type === "dictation" ? "Schreibe, was du hörst …" : ex.type === "translate" ? "Übersetze hier …" : ex.type === "umformung" ? "Schreibe den umgeformten Satz …" : "Antwort …"}
                  value={(st?.response as string) ?? ""}
                  disabled={st?.checked}
                  onChange={(e) =>
                    setState(ex.id, { ...emptySt(st), response: e.target.value })
                  }
                  onKeyDown={(e) => e.key === "Enter" && !st?.checked && check(ex)}
                />
                {/* 💡 التغذية الآنية: مؤشر ثقة يتحرّك وأنت تكتب — بلا كشف */}
                {liveWert !== null && (st?.response as string)?.trim() && (
                  <div style={{ marginTop: "0.35rem" }}>
                    <VertrauensBalken wert={liveWert} live />
                  </div>
                )}
              </>
            )}

            {ex.type === "order" && <OrderWords ex={ex} st={st} setState={setState} />}

            {ex.hint && !st?.checked && (
              <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)", marginTop: "0.4rem" }}>
                💡 {ex.hint}
              </div>
            )}

            {st?.retry && !st.checked && (
              <div className="card" style={{ padding: "0.5rem 0.8rem", marginTop: "0.55rem", background: "var(--color-gold-soft)", fontSize: "0.85rem" }}>
                🔁 <strong>قريب… لكن غير دقيق.</strong> لديك <strong>محاولة أخيرة بلا كشف</strong> — إن أصبتَ فنصف النقاط.
                {st.hinweis && <div data-testid="umformung-hinweis" style={{ marginTop: "0.3rem", color: "var(--color-cola)" }}>🎯 {st.hinweis}</div>}
              </div>
            )}

            <div style={{ marginTop: "0.7rem", display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
              {!st?.checked && (
                <button className="btn btn-primary" onClick={() => check(ex)}>
                  {st?.retry ? "تحقّق — المحاولة الأخيرة 🔁" : "تحقّق"}
                </button>
              )}
              {st?.checked && (
                <div style={{ fontSize: "0.9rem", flex: 1, minWidth: "16rem" }}>
                  <strong>{st.correct ? "✅" : "❌"}</strong>{" "}
                  <span style={{ color: st.correct ? "var(--color-a1)" : "var(--color-cola)" }}>
                    {st.feedback}
                  </span>
                    {ex.type === "mc" && !st.correct && st.sicher === true && (
                      <div data-testid="ueberkonfidenz" style={{ marginTop: "0.3rem", color: "var(--color-cola)", fontWeight: 700 }}>⚠️ كنتَ متأكّداً وأخطأت — هذه أولى ما يُراجَع؛ سُجّلت في دفتر الأخطاء بعلامة «ثقة خاطئة».</div>
                    )}
                    {ex.type === "mc" && st.correct && st.sicher === false && (
                      <div data-testid="unterkonfidenz" style={{ marginTop: "0.3rem", color: "var(--color-ink2)" }}>🙂 كنتَ غيرَ متأكّد وأصبت — تعرفُ أكثر مما تظنّ.</div>
                    )}
                  {/* 💡 الثقة النهائية + 🔍 المقارنة كلمةً كلمة */}
                  {getippt(ex) && (
                    <div style={{ marginTop: "0.3rem" }}>
                      <VertrauensBalken wert={konfidenz(givenOf(st), refOf(ex))} />
                      {!st.correct && <AntwortDiff gegeben={givenOf(st)} referenz={refOf(ex)} />}
                    </div>
                  )}
                  {(() => {
                    const u = deepOf(ex, st);
                    return u && u.fehler.length > 0 ? (
                      <div style={{ background: "var(--color-paper2)", borderRadius: "0.5rem", padding: "0.5rem 0.7rem", marginTop: "0.35rem" }}>
                        <strong style={{ fontSize: "0.85rem" }}>👨‍🏫 فحص المدرّس:</strong>
                        <LehrerDiff urteil={u} />
                      </div>
                    ) : null;
                  })()}
                  {(ex.explanationAr || ex.explanationDe) && (
                    <div style={{ color: "var(--color-ink2)", marginTop: "0.2rem" }}>
                      {ex.explanationAr}
                      {ex.explanationDe && (
                        <>
                          {" "}
                          — <De>{ex.explanationDe}</De>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function emptySt(st?: ItemState): ItemState {
  return {
    response: (st?.response ?? "") as string | string[],
    checked: false,
    correct: false,
    versuche: st?.versuche ?? 0,
    gezaehlt: st?.gezaehlt ?? false,
    retry: st?.retry,
    chosenIdx: st?.chosenIdx,
  };
}

function OrderWords({
  ex,
  st,
  setState,
}: {
  ex: Exercise;
  st?: ItemState;
  setState: (id: string, s: ItemState) => void;
}) {
  const answer = Array.isArray(ex.answer) ? ex.answer : [ex.answer];
  // كلمات مبعثرة ثابتة (hash بسيط لخلط ثابت)
  // كلمات مبعثرة ثابتة؛ الرموزُ المكرَّرة (مثل «wir» مرتين) تُميَّز بفهرسِها لا بنصِّها
  const pool = answer.map((w, i) => ({ w, i })).sort((a, b) => a.w.localeCompare(b.w) || a.i - b.i);
  const chosen = (st?.response as string[]) ?? [];
  const chosenIdx = st?.chosenIdx ?? [];
  const belegt = (i: number) => chosenIdx.includes(i);

  const add = (w: string, i: number) => {
    if (st?.checked || belegt(i)) return;
    setState(ex.id, { ...emptySt(st), response: [...chosen, w], chosenIdx: [...chosenIdx, i] });
  };
  const remove = (idx: number) => {
    if (st?.checked) return;
    const next = [...chosen], nextIdx = [...chosenIdx];
    next.splice(idx, 1); nextIdx.splice(idx, 1);
    setState(ex.id, { ...emptySt(st), response: next, chosenIdx: nextIdx });
  };

  return (
    <div>
      <div
        style={{
          minHeight: "3rem",
          border: "1px dashed var(--color-line)",
          borderRadius: "0.75rem",
          padding: "0.5rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "0.4rem",
          marginBottom: "0.6rem",
          direction: "ltr",
        }}
      >
        {chosen.length === 0 && (
          <span style={{ color: "var(--color-ink2)", fontSize: "0.85rem" }}>
            اضغط الكلمات بالترتيب الصحيح…
          </span>
        )}
        {chosen.map((w, i) => (
          <button
            key={`${w}-${i}`}
            className="chip"
            style={{ cursor: "pointer", background: "var(--color-gold-soft)" }}
            disabled={st?.checked}
            onClick={() => remove(i)}
          >
            {w} ✕
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", direction: "ltr" }}>
        {pool.map(({ w, i }) => (
          <button
            key={`${w}-${i}`}
            className="chip"
            style={{ cursor: "pointer", opacity: belegt(i) ? 0.35 : 1 }}
            disabled={st?.checked || belegt(i)}
            onClick={() => add(w, i)}
          >
            {w}
          </button>
        ))}
      </div>
    </div>
  );
}
