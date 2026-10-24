"use client";
import { useMemo } from "react";
import type { DayPlan, DayTask, Progress, TaskResult } from "@/lib/types";
import { KindIcon } from "@/components/dirb/icons";
import { grammarMap, getText, getDialogue } from "@/lib/content";
import type { RitualUrteil } from "@/lib/ritual";
import { aufgabeGesperrt } from "@/lib/ritual";

type StepId = 1 | 2 | 3 | 4 | 5;

const STEP_META: Record<StepId, { icon: string; titleAr: string; titleDe: string; descAr: string }> = {
  1: { icon: "🔁", titleAr: "التهيئة والاسترجاع", titleDe: "Abruf & Aufwärmen", descAr: "استرجاع تراكمي + كبسولة 1/7/30" },
  2: { icon: "📖", titleAr: "الدرس — اكتشف وافهم", titleDe: "Entdecken & Verstehen", descAr: "قاعدة اليوم — المشهد قبل الشرح" },
  3: { icon: "🎧", titleAr: "استمع واقرأ", titleDe: "Hören & Lesen", descAr: "مفردات + نص + حوار مسموع" },
  4: { icon: "✍️", titleAr: "اكتب وتحدّث", titleDe: "Schreiben & Sprechen", descAr: "إنتاج حر — كتابة ومحادثة" },
  5: { icon: "✅", titleAr: "ثبّت واختبر", titleDe: "Festigen & Prüfen", descAr: "فحص اليوم + دفتر الأخطاء + الإغلاق" },
};

// BAMF BSK B2 — map theme substring → Lebenswelt label
function bamfForTheme(theme: string): string | null {
  const t = theme.toLowerCase();
  if (t.includes("wohnen") || t.includes("stadt") || t.includes("miete")) return "🏠 Wohnen";
  if (t.includes("arbeit") || t.includes("beruf") || t.includes("digital")) return "💼 Arbeit";
  if (t.includes("mobilität") || t.includes("verkehr") || t.includes("pendeln") || t.includes("tiket")) return "🚃 Mobilität";
  if (t.includes("notruf") || t.includes("gesund") || t.includes("pflege")) return "🏥 Gesundheit";
  if (t.includes("kita") || t.includes("schule") || t.includes("familie")) return "👨‍👩‍👧 Familie";
  if (t.includes("behörde") || t.includes("anerkennung") || t.includes("bürgeramt")) return "🏛️ Behörde";
  if (t.includes("feiertag") || t.includes("urlaub") || t.includes("alltag")) return "📅 Alltag";
  if (t.includes("recht") || t.includes("mietrecht")) return "🏠 Wohnen";
  return null;
}
function themeForTask(task: DayTask): string | null {
  if (task.textId) { const txt = getText(task.textId) as any; if (txt?.theme) return txt.theme; if (txt?.titleDe) return txt.titleDe; }
  if (task.dialogueId) { const dlg = getDialogue(task.dialogueId) as any; if (dlg?.theme) return dlg.theme; if (dlg?.titleDe) return dlg.titleDe; }
  return null;
}
function bamfBadge(task: DayTask): string | null {
  const theme = themeForTask(task);
  return theme ? bamfForTheme(theme) : null;
}

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

  return (
    <section className="today-stepper" aria-label="خريطة اليوم — 5 خطوات" data-testid="today-stepper">
      {/* Progress header — Verlag-style: Karte nicht Spielbrett (distinctive, kein Duolingo-Klon) */}
      <div className="today-stepper-head">
        <div className="today-stepper-title">🗺️ خريطة يومك — خط واحد واضح <span style={{fontWeight:400, fontSize:"0.78rem", color:"var(--ui-muted)"}} dir="ltr">— Verlag: klar · ruhig · akademisch</span></div>
        <div className="today-stepper-progress" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100} aria-label={`التقدم ${doneCount} من ${totalSteps}`}>
          <div className="today-stepper-bar">
            <div className="today-stepper-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="today-stepper-pct rtl-num">{doneCount}/{totalSteps}</span>
        </div>
        <p className="today-stepper-hint">الخطوات الخمس مرئية دائماً — التالية تُفتح بعد إتمام الحالية. لا تخطٍّ بلا إتقان.</p>
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
              {/* Rail */}
              <div className="today-step-rail" aria-hidden>
                <div className={`today-step-dot ${isDone ? "is-done" : isActive ? "is-active" : "is-locked"}`}>
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
                    <div className="today-step-desc">{meta.descAr} · <span className="rtl-num">{tasks.length}</span> {tasks.length === 1 ? "مهمة" : "مهام"}</div>
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

                      const badge = bamfBadge(t);
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
                          aria-label={`${t.titleAr} — ${t.minutes} دقيقة${gesperrt ? " مقفلة" : passed ? " منجزة" : ""}${badge ? ` — ${badge}` : ""}`}
                        >
                          <KindIcon kind={t.kind} className="today-step-task-icon" />
                          <span className="today-step-task-title">{t.titleAr}</span>
                          {badge && <span className="chip" style={{ fontSize:"0.65rem", padding:"0.1rem 0.35rem", background:"var(--color-paper2)" }}>{badge}</span>}
                          <span className="today-step-task-meta rtl-num">{t.minutes}د</span>
                          <span className="today-step-task-state">{gesperrt ? "🔒" : passed ? "✓" : submitted ? "◐" : "○"}</span>
                        </button>
                      );
                    })}
                    {sid === 3 && (() => {
                      const themen = [...new Set(tasks.map((x) => themeForTask(x)).filter(Boolean) as string[])];
                      const bamfs = [...new Set(tasks.map((x) => bamfBadge(x)).filter(Boolean) as string[])];
                      if (themen.length === 0) return null;
                      return (
                        <div data-testid={`today-step-${sid}-bamf`} style={{ marginTop:"0.4rem", padding:"0.45rem 0.6rem", borderRadius:"0.5rem", background:"var(--color-paper2)", borderInlineStart:"3px solid #3b82f6", fontSize:"0.78rem", display:"grid", gap:"0.25rem" }}>
                          <div style={{ fontWeight:800, color:"#1e3a8a" }}>🌍 B2-Praxis heute — {bamfs.join(" · ")}</div>
                          <div style={{ color:"var(--color-ink2)", lineHeight:1.7 }}>{themen.slice(0,2).join(" · ")} — BAMF Lebenswelt heute im Fokus → تدرّب في <span style={{ fontWeight:800 }}>تدرّب › 🌍 الحياة</span></div>
                        </div>
                      );
                    })()}
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
                    🔒 أتمّ الخطوة السابقة أولاً — {STEP_META[(sid - 1) as StepId]?.titleAr ?? ""}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <p className="today-stepper-footnote">💡 تلميح: انقر على أي مهمة داخل الخطوة النشطة للانتقال إليها فوراً. الاسترجاع قبل الجديد دائماً.</p>
    </section>
  );
}
