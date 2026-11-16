"use client";
import { useMemo } from "react";
import type { DayPlan, TaskResult } from "@/lib/types";
import { KindIcon } from "@/components/dirb/icons";
import { grammarMap } from "@/lib/content";
import type { RitualUrteil } from "@/lib/ritual";
import { aufgabeGesperrt } from "@/lib/ritual";
import { corePathMinutes, deepeningMinutes, isCoreTask } from "@/lib/day-path";
import {
  groupTasksByTodayStep,
  todayStepStatuses,
  type LocalTaskScore,
  type TodayStepId,
} from "@/lib/today-steps";

// Life-context mapping for Step 3 badges (matching TodayB2Praxis)
const LIFE_STEP3: Record<string, { emoji: string; label: string }> = {
  wohnen: { emoji: "🏠", label: "السكن" },
  behoerde: { emoji: "🏛️", label: "الجهات" },
  gesundheit: { emoji: "🏥", label: "الصحة" },
  arbeit: { emoji: "💼", label: "العمل" },
  familie: { emoji: "👨‍👩‍👧", label: "العائلة" },
  mobilitaet: { emoji: "🚃", label: "التنقّل" },
  alltag: { emoji: "📅", label: "يومي" },
};
function lifeContextForStep3(titleDe: string): { emoji: string; label: string } | null {
  const l = titleDe.toLowerCase();
  if (l.includes("wohnung") || l.includes("miete") || l.includes("haus") || l.includes("wohnen")) return LIFE_STEP3.wohnen;
  if (l.includes("amt") || l.includes("behörde") || l.includes("anmeldung") || l.includes("visum")) return LIFE_STEP3.behoerde;
  if (l.includes("arzt") || l.includes("krank") || l.includes("apotheke") || l.includes("gesund")) return LIFE_STEP3.gesundheit;
  if (l.includes("arbeit") || l.includes("bewerbung") || l.includes("job") || l.includes("betrieb") || l.includes("beruf")) return LIFE_STEP3.arbeit;
  if (l.includes("kind") || l.includes("familie") || l.includes("kita")) return LIFE_STEP3.familie;
  if (l.includes("ticket") || l.includes("bahn") || l.includes("verkehr") || l.includes("führerschein")) return LIFE_STEP3.mobilitaet;
  return null;
}

const STEP_META: Record<TodayStepId, { icon: string; titleAr: string; titleDe: string; descAr: string }> = {
  1: { icon: "🔁", titleAr: "التهيئة والاسترجاع", titleDe: "Abruf & Aufwärmen", descAr: "استرجاع تراكمي + كبسولة 1/7/30" },
  2: { icon: "📖", titleAr: "الدرس — اكتشف وافهم", titleDe: "Entdecken & Verstehen", descAr: "قاعدة اليوم — المشهد قبل الشرح" },
  3: { icon: "🎧", titleAr: "استمع واقرأ", titleDe: "Hören & Lesen", descAr: "مفردات + نص + حوار مسموع" },
  4: { icon: "✍️", titleAr: "اكتب وتحدّث", titleDe: "Schreiben & Sprechen", descAr: "إنتاج حر — كتابة ومحادثة" },
  5: { icon: "✅", titleAr: "ثبّت واختبر", titleDe: "Festigen & Prüfen", descAr: "فحص اليوم + دفتر الأخطاء + الإغلاق" },
};

interface Props {
  plan: DayPlan;
  ritual: RitualUrteil;
  stepFrei: number;
  setStep: (i: number) => void;
  resultOf: (id: string) => TaskResult | undefined;
  localOf: (id: string) => LocalTaskScore;
}

export default function TodayStepper({ plan, ritual, stepFrei, setStep, resultOf }: Props) {
  const grouped = useMemo(() => groupTasksByTodayStep(plan.tasks), [plan.tasks]);

  // Only a persisted submission opens the next station. Local quiz points stay
  // a draft; failed submissions continue through the existing debt/review model.
  const stepStatus = todayStepStatuses(
    plan.tasks,
    (task) => !!resultOf(task.id),
    (index) => aufgabeGesperrt(ritual, index),
  );

  const doneCount = Array.from(stepStatus.values()).filter((v) => v === "done").length; // B2 Prüfungsbadge: Schritt 4
  const totalSteps = 5;
  const progressPct = Math.round((doneCount / totalSteps) * 100);
  const coreMinutes = corePathMinutes(plan.tasks);
  const optionalMinutes = deepeningMinutes(plan.tasks);
  const coreCompleted = plan.tasks.filter(isCoreTask).every((task) => !!resultOf(task.id));

  return (
    <section className="today-stepper" aria-label="خريطة اليوم — 5 خطوات" data-testid="today-stepper">
      {/* Hybrid Header: Dark Academy (top) + Verlag light (progress) */}
      <div className="today-stepper-dark">
        <div style={{ position:"relative", zIndex:1, display:"flex", gap:"0.45rem", alignItems:"center", flexWrap:"wrap" }}>
          <span style={{ background:"rgb(255 255 255 / 0.14)", border:"1px solid rgb(255 255 255 / 0.22)", padding:"0.12rem 0.5rem", borderRadius:"999px", fontSize:"0.68rem", fontWeight:900 }}>🗺️ WEG VERLAG</span>
          <span style={{ fontWeight:900, fontSize:"0.92rem", color:"#F8F5E6" }}>خريطة يومك — خط واحد واضح</span>
          <span style={{ fontSize:"0.72rem", color:"#9FB2CE" }} dir="ltr">— Verlag · klar · ruhig · akademisch</span>
        </div>
        <div style={{ position:"relative", zIndex:1, marginTop:"0.4rem", display:"flex", gap:"0.5rem", flexWrap:"wrap", alignItems:"center", fontSize:"0.74rem" }}>
          <span style={{ background:"rgb(200 168 78 / 0.18)", color:"#E8D9A8", padding:"0.15rem 0.5rem", borderRadius:"999px", fontWeight:800, border:"1px solid rgb(200 168 78 / 0.3)" }}>🟢 أساسي <span className="rtl-num">{coreMinutes}</span> د</span>
          <span style={{ background:"rgb(255 255 255 / 0.10)", color:"#E8EEF8", padding:"0.15rem 0.5rem", borderRadius:"999px", border:"1px solid rgb(255 255 255 / 0.18)" }}>➕ اختياري <span className="rtl-num">{optionalMinutes}</span> د</span>
          <span style={{ color:"#B8C7E0" }}>{plan.type === "lerntag" ? "يوم تعلّم" : plan.type === "festigung" ? "تثبيت" : plan.type === "wochencheck" ? "فحص" : "ختام"}</span>
          <span style={{ marginInlineStart:"auto", color:"#9FB2CE", fontSize:"0.72rem" }}>{doneCount}/{totalSteps} منجزة · {progressPct}%</span>
        </div>
        <div className="today-stepper-progress" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100} aria-label={`التقدم ${doneCount} من ${totalSteps}`} style={{ position:"relative", zIndex:1, marginTop:"0.5rem" }}>
          <div className="today-stepper-bar" style={{ background:"rgb(255 255 255 / 0.14)" }}>
            <div className="today-stepper-fill" style={{ width: `${progressPct}%`, background: "linear-gradient(90deg, #C8A84E, #E8D9A8)" }} />
          </div>
          <span className="today-stepper-pct rtl-num" style={{ color:"#E8D9A8" }}>{doneCount}/{totalSteps}</span>
        </div>
      </div>
      <div className="today-stepper-light">
        <p className="today-stepper-hint" style={{ margin:0 }}>المسار الأساسي يفتح محطةً بعد محطة. بعد تسليمه ينفتح التعميق الاختياري؛ تركه محايد، والمُسلَّم غير المجتاز يبقى علاجياً.</p>
      </div>

      {/* Steps */}
      <ol className="today-stepper-steps">
        {([1, 2, 3, 4, 5] as TodayStepId[]).map((sid) => {
          const meta = STEP_META[sid];
          const tasks = grouped.get(sid) ?? [];
          const status = stepStatus.get(sid) ?? "locked";
          const coreAtStep = tasks.filter(isCoreTask);
          const optionalAtStep = tasks.filter((task) => !isCoreTask(task));
          const isEmpty = tasks.length === 0;
          const isDone = status === "done";
          const isActive = status === "active";
          const isLocked = status === "locked";

          return (
            <li
              key={sid}
              className={`today-step today-step--${status}${isEmpty ? " today-step--empty" : ""}`}
              data-step={sid}
              data-testid={`today-step-${sid}`}
              aria-current={isActive ? "step" : undefined}
            >
              {/* Rail — step color distinct (Verlag palette, not Duolingo) */}
              <div className="today-step-rail" aria-hidden>
                <div className={`today-step-dot step-${sid} ${isDone ? "is-done" : isActive ? "is-active" : "is-locked"}`}>
                  {isDone ? "✓" : isLocked ? "🔒" : sid}
                </div>
                {sid < 5 && <div className={`today-step-line ${isDone ? "is-done" : ""}`} />}
              </div>

              {/* Content */}
              <div className="today-step-body">
                <div className="today-step-header">
                  <span className="today-step-icon" aria-hidden>{meta.icon}</span>
                  <div className="today-step-titles">
                    <div className="today-step-title">
                      <span className="today-step-num rtl-num">{sid}.</span> {meta.titleAr}
                      <span className="today-step-de" lang="de" dir="ltr"> — {meta.titleDe}</span>
                    </div>
                    <div className="today-step-desc">
                      {meta.descAr} · أساسي <span className="rtl-num">{coreAtStep.length}</span> / <span className="rtl-num">{coreAtStep.reduce((sum, task) => sum + task.minutes, 0)}</span> د
                      {optionalAtStep.length > 0 && <> · اختياري <span className="rtl-num">{optionalAtStep.length}</span> / <span className="rtl-num">{optionalAtStep.reduce((sum, task) => sum + task.minutes, 0)}</span> د</>}
                    </div>
                  </div>
                  <span className={`today-step-badge ${isDone ? "badge-done" : isActive ? "badge-active" : "badge-locked"}`}>
                    {isDone ? "✓ منجزة" : isActive ? "▶ الآن" : "🔒 مقفلة"}
                  </span>
                </div>

                {/* Tasks preview */}
                {tasks.length > 0 ? (
                  <div className="today-step-tasks">
                    {tasks.map((t) => {
                      const r = resultOf(t.id);
                      const passed = r?.passed === true;
                      const submitted = !!r;
                      const globalIdx = plan.tasks.indexOf(t);
                      const gesperrt = globalIdx >= 0 && aufgabeGesperrt(ritual, globalIdx);
                      const optionalLocked = !isCoreTask(t) && !coreCompleted;
                      const taskLocked = optionalLocked || isLocked || (gesperrt && !isDone);
                      const isCurrent = globalIdx === stepFrei;

                      return (
                        <button
                          key={t.id}
                          type="button"
                          disabled={taskLocked}
                          onClick={() => {
                            if (globalIdx >= 0) {
                              setStep(globalIdx);
                              document.getElementById("aufgabe-spieler")?.scrollIntoView({ behavior: "smooth", block: "start" });
                            }
                          }}
                          className={`today-step-task ${passed ? "is-passed" : submitted ? "is-submitted" : isCurrent ? "is-current" : ""} ${taskLocked ? "is-gesperrt" : ""}`}
                          data-testid={`today-step-${sid}-task-${globalIdx}`}
                          data-path={isCoreTask(t) ? "core" : "deepening"}
                          aria-label={`${t.titleAr} — ${t.minutes} دقيقة — ${isCoreTask(t) ? "مسار أساسي" : "تعميق اختياري"}${taskLocked ? " مقفلة" : passed ? " منجزة" : submitted ? " مسلّمة" : ""}`}
                        >
                          <KindIcon kind={t.kind} className="today-step-task-icon" />
                          <span className="today-step-task-title">{isCoreTask(t) ? "🟢" : "➕"} {t.titleAr}</span>
                          {sid === 3 && (() => { const b = lifeContextForStep3(t.titleDe); return b ? <span className="chip" data-testid={`today-step-3-bamf-${t.id}`} style={{ fontSize: "0.68rem", padding: "0.1rem 0.35rem", background: "var(--color-paper2)", fontWeight: 800 }}>{b.emoji} {b.label}</span> : null; })()}
                          <span className="today-step-task-meta rtl-num">{t.minutes}د</span>
                          <span className="today-step-task-state">{taskLocked ? "🔒" : passed ? "✓" : submitted ? "◐" : "○"}</span>
                        </button>
                      );
                    })}
                    {sid === 3 && tasks.length > 0 && (
                      <div data-testid="today-step-3-bamf" className="card" style={{ padding: "0.5rem 0.7rem", background: "var(--color-paper2)", borderInlineStart: "3px solid var(--color-b2)", fontSize: "0.78rem", lineHeight: 1.7 }}>
                        🌍 <strong>B2-Praxis heute</strong> — {tasks.map((t) => lifeContextForStep3(t.titleDe)?.label ?? "Alltag").filter((v, i, a) => a.indexOf(v) === i).join(" · ")} · <span style={{ fontSize: "0.72rem", color: "var(--ui-muted)" }}>سياقات الحياة والعمل — تظهر أيضاً في بطاقة اليوم الموحّد</span>
                      </div>
                    )}
                    {sid === 2 && tasks.some((t) => t.topicId) && (
                      <div className="today-step-lesson-preview" data-testid={`today-step-${sid}-lesson-preview`}>
                        {tasks
                          .filter((t) => t.topicId)
                          .map((t) => {
                            const topic = t.topicId ? grammarMap[t.topicId] : undefined;
                            return topic ? (
                              <div key={t.id} className="lesson-preview-card">
                                <span className={`lesson-level-badge lesson-level-${topic.level}`}>{topic.level}</span>
                                <span className="lesson-preview-title" dir="ltr">{topic.titleDe}</span>
                                <span className="lesson-preview-ar">{topic.titleAr}</span>
                              </div>
                            ) : null;
                          })}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="today-step-empty">
                    {sid === 2 ? (
                      <>
                        <span>📌 اليوم بلا قاعدة جديدة — تركيز على التطبيق والمراجعة.</span>
                        <span style={{ fontSize: "0.78rem", color: "var(--ui-muted)" }}>ستجد القاعدة التالية في اليوم القادم من نوع «تعلّم».</span>
                      </>
                    ) : (
                      <span>— لا مهام في هذه الخطوة اليوم —</span>
                    )}
                  </div>
                )}

                {isLocked && (
                  <div className="today-step-lock-msg" role="note">
                    🔒 سلّم مهام الخطوة السابقة أولاً — {STEP_META[(sid - 1) as TodayStepId]?.titleAr ?? ""}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <p className="today-stepper-footnote">💡 ابدأ بالمهام 🟢 الأساسية. مهام ➕ التعميق تفتح بعد اكتمالها؛ غير المُسلَّم منها لا يدخل الإغلاق أو التعويض.</p>
    </section>
  );
}
