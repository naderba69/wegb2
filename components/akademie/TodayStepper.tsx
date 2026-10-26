"use client";
import { useMemo } from "react";
import type { DayPlan, DayTask, Progress, TaskResult } from "@/lib/types";
import { KindIcon } from "@/components/dirb/icons";
import { grammarMap } from "@/lib/content";
import type { RitualUrteil } from "@/lib/ritual";
import { aufgabeGesperrt } from "@/lib/ritual";

// BAMF mapping for Step 3 badges (matching TodayB2Praxis)
const BAMF_STEP3: Record<string, { emoji: string; label: string }> = {
  wohnen: { emoji: "🏠", label: "السكن" },
  behoerde: { emoji: "🏛️", label: "الجهات" },
  gesundheit: { emoji: "🏥", label: "الصحة" },
  arbeit: { emoji: "💼", label: "العمل" },
  familie: { emoji: "👨‍👩‍👧", label: "العائلة" },
  mobilitaet: { emoji: "🚃", label: "التنقّل" },
  alltag: { emoji: "📅", label: "يومي" },
};
function bamfForStep3(titleDe: string): { emoji: string; label: string } | null {
  const l = titleDe.toLowerCase();
  if (l.includes("wohnung") || l.includes("miete") || l.includes("haus") || l.includes("wohnen")) return BAMF_STEP3.wohnen;
  if (l.includes("amt") || l.includes("behörde") || l.includes("anmeldung") || l.includes("visum")) return BAMF_STEP3.behoerde;
  if (l.includes("arzt") || l.includes("krank") || l.includes("apotheke") || l.includes("gesund")) return BAMF_STEP3.gesundheit;
  if (l.includes("arbeit") || l.includes("bewerbung") || l.includes("job") || l.includes("betrieb") || l.includes("beruf")) return BAMF_STEP3.arbeit;
  if (l.includes("kind") || l.includes("familie") || l.includes("kita")) return BAMF_STEP3.familie;
  if (l.includes("ticket") || l.includes("bahn") || l.includes("verkehr") || l.includes("führerschein")) return BAMF_STEP3.mobilitaet;
  return null;
}

type StepId = 1 | 2 | 3 | 4 | 5;

const STEP_META: Record<StepId, { icon: string; titleAr: string; titleDe: string; descAr: string }> = {
  1: { icon: "🔁", titleAr: "التهيئة والاسترجاع", titleDe: "Abruf & Aufwärmen", descAr: "استرجاع تراكمي + كبسولة 1/7/30" },
  2: { icon: "📖", titleAr: "الدرس — اكتشف وافهم", titleDe: "Entdecken & Verstehen", descAr: "قاعدة اليوم — المشهد قبل الشرح" },
  3: { icon: "🎧", titleAr: "استمع واقرأ", titleDe: "Hören & Lesen", descAr: "مفردات + نص + حوار مسموع" },
  4: { icon: "✍️", titleAr: "اكتب وتحدّث", titleDe: "Schreiben & Sprechen", descAr: "إنتاج حر — كتابة ومحادثة" },
  5: { icon: "✅", titleAr: "ثبّت واختبر", titleDe: "Festigen & Prüfen", descAr: "فحص اليوم + دفتر الأخطاء + الإغلاق" },
};

function stepOf(task: DayTask): StepId {
  if (task.kind === "wiederholen" || task.verifyFor) return 1;
  if (task.kind === "grammatik") return 2;
  if (["wortschatz", "lesen", "hoeren", "aussprache"].includes(task.kind)) return 3;
  if (["schreiben", "sprechen", "partner", "briefe", "schulsim"].includes(task.kind)) return 4;
  return 5; // check + injected + fehler etc.
}

export function groupTasksByStep(tasks: DayTask[]): Map<StepId, DayTask[]> {
  const map = new Map<StepId, DayTask[]>([[1, []], [2, []], [3, []], [4, []], [5, []]]);
  for (const t of tasks) {
    const s = stepOf(t);
    map.get(s)!.push(t);
  }
  return map;
}

interface Props {
  plan: DayPlan;
  progress: Progress;
  ritual: RitualUrteil;
  stepFrei: number;
  setStep: (i: number) => void;
  resultOf: (id: string) => TaskResult | undefined;
  localOf: (id: string) => { score: number; total: number };
}

export default function TodayStepper({ plan, progress: _progress, ritual, stepFrei, setStep, resultOf, localOf }: Props) {
  void _progress;
  const grouped = useMemo(() => groupTasksByStep(plan.tasks), [plan.tasks]);

  // Determine step status: done/active/locked
  const stepStatus = useMemo(() => {
    const status = new Map<StepId, "done" | "active" | "locked">();
    let foundActive = false;
    for (let s = 1 as StepId; s <= 5; s = (s + 1) as StepId) {
      const tasks = grouped.get(s) ?? [];
      if (tasks.length === 0) {
        // Empty step: consider done if previous steps done, unless it's step 2 with no grammar => show as empty but not blocking
        if (s === 2) {
          status.set(s, foundActive ? "locked" : "done"); // no grammar = skip
          continue;
        }
        status.set(s, foundActive ? "locked" : "done");
        continue;
      }
      const allDone = tasks.every((t) => {
        const r = resultOf(t.id);
        if (r) return r.passed;
        const local = localOf(t.id);
        return local.total > 0 && local.score / local.total >= 0.8;
      });
      // ritual lock: if any task in step is gesperrt, step is locked unless it's step 1
      const anyGesperrt = tasks.some((_, idx) => {
        const globalIdx = plan.tasks.indexOf(tasks[idx] as DayTask);
        return globalIdx >= 0 && aufgabeGesperrt(ritual, globalIdx);
      });
      if (s === 1) {
        status.set(s, allDone ? "done" : "active");
        if (!allDone) foundActive = true;
      } else {
        if (foundActive || anyGesperrt) {
          status.set(s, "locked");
        } else if (allDone) {
          status.set(s, "done");
        } else {
          status.set(s, "active");
          foundActive = true;
        }
      }
    }
    return status;
  }, [grouped, resultOf, localOf, ritual, plan.tasks]);

  const doneCount = Array.from(stepStatus.values()).filter((v) => v === "done").length; // B2 Prüfungsbadge: Schritt 4
  const totalSteps = 5;
  const progressPct = Math.round((doneCount / totalSteps) * 100);
  const totalMinutes = plan.tasks.reduce((s, t) => s + (t.minutes ?? 0), 0);

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
          <span style={{ background:"rgb(200 168 78 / 0.18)", color:"#E8D9A8", padding:"0.15rem 0.5rem", borderRadius:"999px", fontWeight:800, border:"1px solid rgb(200 168 78 / 0.3)" }}><span className="rtl-num">⏱ 90</span> د هدف</span>
          <span style={{ background:"rgb(255 255 255 / 0.10)", color:"#E8EEF8", padding:"0.15rem 0.5rem", borderRadius:"999px", border:"1px solid rgb(255 255 255 / 0.18)" }}><span className="rtl-num">{totalMinutes}</span> د اليوم</span>
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
        <p className="today-stepper-hint" style={{ margin:0 }}>الخطوات الخمس مرئية دائماً — التالية تُفتح بعد إتمام الحالية. لا تخطٍّ بلا إتقان. Mayer Segmenting + Conti Retrieval.</p>
      </div>

      {/* Steps */}
      <ol className="today-stepper-steps">
        {([1, 2, 3, 4, 5] as StepId[]).map((sid) => {
          const meta = STEP_META[sid];
          const tasks = grouped.get(sid) ?? [];
          const status = stepStatus.get(sid) ?? "locked";
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
                    <div className="today-step-desc">{meta.descAr} · <span className="rtl-num">{tasks.length}</span> {tasks.length === 1 ? "مهمة" : "مهام"} · <span className="rtl-num">{tasks.reduce((s, t) => s + (t.minutes ?? 0), 0)}</span> د</div>
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
                      const local = localOf(t.id);
                      const passed = r?.passed ?? (local.total > 0 && local.score / local.total >= 0.8);
                      const submitted = !!r || local.total > 0;
                      const globalIdx = plan.tasks.indexOf(t);
                      const gesperrt = globalIdx >= 0 && aufgabeGesperrt(ritual, globalIdx);
                      const isCurrent = globalIdx === stepFrei;

                      return (
                        <button
                          key={t.id}
                          type="button"
                          disabled={gesperrt && !isDone}
                          onClick={() => {
                            if (globalIdx >= 0) {
                              setStep(globalIdx);
                              document.getElementById("aufgabe-spieler")?.scrollIntoView({ behavior: "smooth", block: "start" });
                            }
                          }}
                          className={`today-step-task ${passed ? "is-passed" : submitted ? "is-submitted" : isCurrent ? "is-current" : ""} ${gesperrt ? "is-gesperrt" : ""}`}
                          data-testid={`today-step-${sid}-task-${globalIdx}`}
                          aria-label={`${t.titleAr} — ${t.minutes} دقيقة${gesperrt ? " مقفلة" : passed ? " منجزة" : ""}`}
                        >
                          <KindIcon kind={t.kind} className="today-step-task-icon" />
                          <span className="today-step-task-title">{t.titleAr}</span>
                          {sid === 3 && (() => { const b = bamfForStep3(t.titleDe); return b ? <span className="chip" data-testid={`today-step-3-bamf-${t.id}`} style={{ fontSize: "0.68rem", padding: "0.1rem 0.35rem", background: "var(--color-paper2)", fontWeight: 800 }}>{b.emoji} {b.label}</span> : null; })()}
                          <span className="today-step-task-meta rtl-num">{t.minutes}د</span>
                          <span className="today-step-task-state">{gesperrt ? "🔒" : passed ? "✓" : submitted ? "◐" : "○"}</span>
                        </button>
                      );
                    })}
                    {sid === 3 && tasks.length > 0 && (
                      <div data-testid="today-step-3-bamf" className="card" style={{ padding: "0.5rem 0.7rem", background: "var(--color-paper2)", borderInlineStart: "3px solid var(--color-b2)", fontSize: "0.78rem", lineHeight: 1.7 }}>
                        🌍 <strong>B2-Praxis heute</strong> — {tasks.map((t) => bamfForStep3(t.titleDe)?.label ?? "Alltag").filter((v, i, a) => a.indexOf(v) === i).join(" · ")} · <span style={{ fontSize: "0.72rem", color: "var(--ui-muted)" }}>BAMF Handlungsfelder: Beruf/Alltag — تظهر أيضاً في بطاقة اليوم الموحّد</span>
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

                {isLocked && (() => {
                  const prev = (sid - 1) as StepId;
                  const prevTasks = grouped.get(prev) ?? [];
                  const pending = prevTasks.filter((tt) => {
                    const r = resultOf(tt.id);
                    if (r) return !r.passed;
                    const local = localOf(tt.id);
                    return !(local.total > 0 && local.score / local.total >= 0.8);
                  }).length;
                  return (
                    <div className="today-step-lock-msg" role="note">
                      🔒 أتمّ «{STEP_META[prev]?.titleAr ?? ""}» أولاً — بقي <span className="rtl-num">{pending}</span> مهمة
                    </div>
                  );
                })()}
              </div>
            </li>
          );
        })}
      </ol>

      <p className="today-stepper-footnote">💡 تلميح: انقر على أي مهمة داخل الخطوة النشطة للانتقال إليها فوراً. الاسترجاع قبل الجديد دائماً.</p>
    </section>
  );
}
