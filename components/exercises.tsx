"use client";
// عارض التمارين — تصحيح فوري عبر Grader مع التغذية الآنية (Modul S):
//   💡 مؤشر ثقة حيّ أثناء الكتابة · 🔍 Diff view كلمةً كلمة · 🔁 إعادة محاولة بلا كشف
// كل هذا يعيش في طبقة التصحيح الموحّدة — فيستفيد كل تمرين في التطبيق دفعةً واحدة.
import { useState } from "react";
import type { Exercise } from "@/lib/types";
import { grader, deepReview, konfidenz, diffWoerter } from "@/lib/grader";
import { addFehlerNow } from "@/lib/store";
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
      });
      if (!gezaehlt) onPoints?.(halb ? Math.round(res.maxPoints / 2) : res.points, res.maxPoints);
      return;
    }

    if (versuche < 1) {
      // 🔁 خانئ — إعادة محاولة أخيرة بلا كشف
      setState(ex.id, { response, checked: false, correct: false, versuche: 1, gezaehlt, retry: true });
      return;
    }

    // ❌ الكشف النهائي: Diff + ثقة + فحص المدرّس + دفتر الأخطاء
    setState(ex.id, { response, checked: true, correct: false, versuche, gezaehlt: true, feedback: res.feedbackAr });
    if (!gezaehlt) onPoints?.(0, res.maxPoints);
    const given = givenOf({ response, checked: true, correct: false, versuche, gezaehlt: true });
    addFehlerNow({
      falsch: given && given.trim() ? given : ex.promptDe,
      richtig: refOf(ex),
      art:
        ex.type === "dictation" || ex.type === "translate"
          ? "schreibweise"
          : ex.type === "fill"
            ? "konstruktion"
            : "wortstellung",
      ar: ex.explanationAr ?? "",
      quelle: ex.promptDe.slice(0, 42),
    });
  };

  // مراجعة المدرّس العميقة للأجوبة الكتابية الخاطئة (ترجمة/تسميع/ملء)
  const deepOf = (ex: Exercise, st?: ItemState) => {
    if (!st?.checked || st.correct) return null;
    if (ex.type !== "translate" && ex.type !== "dictation" && ex.type !== "fill") return null;
    return deepReview(givenOf(st), refOf(ex));
  };

  const getippt = (ex: Exercise) => ex.type === "fill" || ex.type === "dictation" || ex.type === "translate";

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
                      onClick={() => setState(ex.id, { ...emptySt(st), response: opt })}
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
                      onClick={() => setState(ex.id, { ...emptySt(st), response: opt })}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}

            {(ex.type === "fill" || ex.type === "dictation" || ex.type === "translate") && (
              <>
                {ex.text && (
                  <div style={{ marginBottom: "0.5rem" }}>
                    <De>{ex.text.replace("___", "______")}</De>
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
                  placeholder={ex.type === "dictation" ? "Schreibe, was du hörst …" : ex.type === "translate" ? "Übersetze hier …" : "Antwort …"}
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
  const pool = [...answer].sort((a, b) => a.localeCompare(b));
  const chosen = (st?.response as string[]) ?? [];

  const add = (w: string) => {
    if (st?.checked) return;
    if (chosen.includes(w)) return;
    setState(ex.id, { ...emptySt(st), response: [...chosen, w] });
  };
  const remove = (idx: number) => {
    if (st?.checked) return;
    const next = [...chosen];
    next.splice(idx, 1);
    setState(ex.id, { ...emptySt(st), response: next });
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
        {pool.map((w) => (
          <button
            key={w}
            className="chip"
            style={{ cursor: "pointer", opacity: chosen.includes(w) ? 0.35 : 1 }}
            disabled={st?.checked || chosen.includes(w)}
            onClick={() => add(w)}
          >
            {w}
          </button>
        ))}
      </div>
    </div>
  );
}
