"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { bankRoh, initialisiereVertiefung } from "@/lib/bankload";
import { useBankGeneration } from "@/lib/use-bank-generation";
import { progressKeyActive } from "@/lib/profiles";
import {
  MEDIATION_CRITERIA,
  emptyMediationEntry,
  mediationFeedback,
  mediationKannSpeichern,
  mediationStorageKey,
  parseMediationBank,
  parseMediationProgress,
  zaehleMediationWoerter,
  type MediationEntry,
  type MediationLevel,
  type MediationProgress,
} from "@/lib/mediation";

const LEVELS: Array<"all" | MediationLevel> = ["all", "A2", "B1", "B2"];

export default function MediationPage() {
  const generation = useBankGeneration();
  const tasks = useMemo(() => {
    void generation; // Re-parse after the lazily loaded bank announces a new generation.
    return parseMediationBank(bankRoh("mediation.json"));
  }, [generation]);
  const [progress, setProgress] = useState<MediationProgress>({});
  const [storageReady, setStorageReady] = useState(false);
  const [filter, setFilter] = useState<"all" | MediationLevel>("all");
  const [saveMessage, setSaveMessage] = useState("");
  const storageKey = mediationStorageKey(progressKeyActive());

  useEffect(() => { initialisiereVertiefung().catch(() => undefined); }, []);
  useEffect(() => {
    if (!tasks.length) return;
    try {
      const raw = localStorage.getItem(storageKey);
      const parsed = raw ? JSON.parse(raw) : {};
      setProgress(parseMediationProgress(parsed, new Set(tasks.map((task) => task.id))));
    } catch { setProgress({}); }
    setStorageReady(true);
  }, [storageKey, tasks]);
  useEffect(() => {
    if (!storageReady) return;
    try { localStorage.setItem(storageKey, JSON.stringify(progress)); } catch { /* التخزين قد يكون محظوراً */ }
  }, [progress, storageKey, storageReady]);

  const patchEntry = (id: string, patch: Partial<MediationEntry>) => {
    setProgress((current) => ({
      ...current,
      [id]: { ...(current[id] ?? emptyMediationEntry()), ...patch },
    }));
    setSaveMessage("");
  };
  const visible = filter === "all" ? tasks : tasks.filter((task) => task.level === filter);
  const completed = tasks.filter((task) => progress[task.id]?.phase === "saved").length;

  if (!tasks.length) {
    return <div className="today-screen" role="status" aria-live="polite">⏳ جارٍ تحميل بنك الوساطة…</div>;
  }

  return (
    <div className="today-screen fadein dirb ui-page" data-testid="mediation-page">
      <header className="dirb-tabhead">
        <Link href="/ueben" className="dirb-back" style={{ textDecoration: "none" }}>→ تدرّب</Link>
        <h1 className="dirb-title">🔄 ورشة الوساطة اللغوية</h1>
        <p className="dirb-sub" style={{ lineHeight: 1.9 }}>
          اقرأ المدخل، اكتب مسودة، راجعها بأربعة محاور، قارن بالنقاط الأساسية، ثم احفظ نسخة ثانية. هذه ورشة تدريب ذاتي داخلية وليست اختبار CEFR أو تصحيحاً آلياً.
        </p>
        <div className="chip" data-testid="mediation-completion">حُفظت نسخة ثانية في {completed} من {tasks.length} مهمة</div>
      </header>

      <section className="card" style={{ padding: "0.85rem 1rem", marginBottom: "0.8rem", lineHeight: 1.8 }} aria-label="حدود ورشة الوساطة">
        <strong>حدود الدليل:</strong> المهام مستلهمة من أنواع أنشطة الوساطة والتفاعل متعدد اللغات، لكنها مواد داخلية غير معتمدة. لا تمنح درجة أو مستوى، والنموذج مثال ممكن لا إجابة وحيدة.
      </section>

      <div role="group" aria-label="ترشيح مهام الوساطة حسب المستوى" style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap", marginBottom: "0.8rem" }}>
        {LEVELS.map((level) => (
          <button key={level} type="button" className="btn btn-ghost" aria-pressed={filter === level} onClick={() => setFilter(level)} style={{ minHeight: "44px" }}>
            {level === "all" ? `الكل (${tasks.length})` : `${level} (${tasks.filter((task) => task.level === level).length})`}
          </button>
        ))}
      </div>

      {saveMessage && <p role="status" className="card" style={{ padding: "0.65rem 0.8rem", borderInlineStart: "4px solid var(--color-ok)" }}>{saveMessage}</p>}

      <div style={{ display: "grid", gap: "0.8rem" }}>
        {visible.map((task) => {
          const entry = progress[task.id] ?? emptyMediationEntry();
          const feedback = mediationFeedback(task, entry.draft, entry.checkedCriteria);
          const isSaved = entry.phase === "saved";
          return (
            <details key={task.id} className="card" data-testid={`mediation-task-${task.id}`} style={{ padding: "0.9rem 1rem" }}>
              <summary style={{ cursor: "pointer", minHeight: "44px", display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                <strong>{isSaved ? "✓ " : ""}{task.titleAr}</strong>
                <span lang="de" dir="ltr">— {task.titleDe}</span>
                <span className="chip">{task.level} · {task.id}</span>
                <span className="chip">{entry.phase === "draft" ? "مسودة" : entry.phase === "review" ? "قيد المراجعة" : "نسخة ثانية محفوظة"}</span>
              </summary>

              <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
                <section aria-labelledby={`${task.id}-input-heading`} style={{ background: "var(--color-paper2)", padding: "0.8rem", borderRadius: "8px" }}>
                  <h2 id={`${task.id}-input-heading`} style={{ fontSize: "0.9rem", margin: "0 0 0.4rem" }}>{task.inputLabelAr} — <span lang="de" dir="ltr">{task.inputLabelDe}</span></h2>
                  <div lang="de" dir="ltr" style={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }} data-testid={`mediation-input-de-${task.id}`}>{task.inputDe}</div>
                  {task.inputAr && <div lang="ar" dir="rtl" style={{ whiteSpace: "pre-wrap", lineHeight: 1.8, marginTop: "0.55rem", borderTop: "1px solid var(--color-line)", paddingTop: "0.55rem" }}>{task.inputAr}</div>}
                </section>

                <section aria-labelledby={`${task.id}-auftrag-heading`}>
                  <h2 id={`${task.id}-auftrag-heading`} style={{ fontSize: "0.9rem", margin: "0 0 0.35rem" }}>المهمة</h2>
                  <p lang="de" dir="ltr" style={{ lineHeight: 1.8, margin: "0 0 0.3rem" }} data-testid={`mediation-task-de-${task.id}`}>{task.taskDe}</p>
                  <p style={{ color: "var(--color-ink2)", lineHeight: 1.8, margin: 0 }}>{task.taskAr}</p>
                  <dl style={{ display: "grid", gridTemplateColumns: "max-content 1fr", gap: "0.25rem 0.6rem", fontSize: "0.8rem", margin: "0.55rem 0 0" }}>
                    <dt style={{ fontWeight: 800 }}>المتلقي:</dt><dd style={{ margin: 0 }}>{task.audienceAr}</dd>
                    <dt style={{ fontWeight: 800 }}>المخرج:</dt><dd style={{ margin: 0 }}>{task.outputAr}</dd>
                    <dt style={{ fontWeight: 800 }}>نطاق تدريبي:</dt><dd style={{ margin: 0 }}>{task.wordGuide[0]}–{task.wordGuide[1]} كلمة؛ ليس معيار نجاح</dd>
                  </dl>
                  {task.disclaimerAr && <p role="note" style={{ background: "var(--color-warn-soft)", padding: "0.55rem 0.7rem", borderRadius: "7px", fontSize: "0.8rem" }}>⚠️ {task.disclaimerAr}</p>}
                </section>

                <details>
                  <summary style={{ cursor: "pointer", minHeight: "44px" }}>مساند لغوية اختيارية</summary>
                  <ul lang="de" dir="ltr" style={{ lineHeight: 1.8 }}>
                    {task.scaffoldsDe.map((scaffold) => <li key={scaffold}>{scaffold}</li>)}
                  </ul>
                </details>

                <label htmlFor={`${task.id}-draft`} style={{ fontWeight: 800 }}>1. اكتب المسودة</label>
                <textarea
                  id={`${task.id}-draft`}
                  data-testid={`mediation-draft-${task.id}`}
                  className="field"
                  rows={6}
                  dir="auto"
                  value={entry.draft}
                  disabled={entry.phase !== "draft"}
                  onChange={(event) => patchEntry(task.id, { draft: event.target.value })}
                  aria-describedby={`${task.id}-draft-help`}
                  placeholder="اكتب المخرج المطلوب هنا…"
                />
                <div id={`${task.id}-draft-help`} className="tiny muted">{zaehleMediationWoerter(entry.draft)} كلمة · تُحفظ المسودة محلياً في هذا الملف.</div>
                {entry.phase === "draft" && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-testid={`mediation-review-${task.id}`}
                    disabled={zaehleMediationWoerter(entry.draft) < 5}
                    onClick={() => patchEntry(task.id, { phase: "review", revision: entry.draft })}
                  >
                    انتقل إلى المراجعة الذاتية
                  </button>
                )}

                {entry.phase !== "draft" && (
                  <section aria-labelledby={`${task.id}-rubric-heading`} data-testid={`mediation-rubric-${task.id}`} style={{ display: "grid", gap: "0.6rem", borderTop: "1px solid var(--color-line)", paddingTop: "0.75rem" }}>
                    <h2 id={`${task.id}-rubric-heading`} style={{ fontSize: "1rem", margin: 0 }}>2. راجع بأربعة محاور</h2>
                    {task.criteria.map((criterion) => {
                      const definition = MEDIATION_CRITERIA[criterion];
                      const checked = entry.checkedCriteria.includes(criterion);
                      return (
                        <label key={criterion} style={{ display: "flex", alignItems: "flex-start", gap: "0.55rem", cursor: "pointer" }}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => patchEntry(task.id, {
                              checkedCriteria: checked
                                ? entry.checkedCriteria.filter((item) => item !== criterion)
                                : [...entry.checkedCriteria, criterion],
                              phase: "review",
                            })}
                            style={{ marginTop: "0.35rem" }}
                          />
                          <span><strong>{definition.labelAr}</strong> — <span lang="de" dir="ltr">{definition.labelDe}</span><span style={{ display: "block", color: "var(--color-ink2)", fontSize: "0.8rem" }}>{definition.promptAr}</span></span>
                        </label>
                      );
                    })}

                    <div role="status" data-testid={`mediation-feedback-${task.id}`} style={{ background: "var(--color-paper2)", padding: "0.65rem 0.8rem", borderRadius: "8px" }}>
                      <strong>ملاحظات بنيوية للمراجعة — ليست تصحيحاً للغة:</strong>
                      <ul style={{ margin: "0.35rem 0 0", paddingInlineStart: "1.2rem", lineHeight: 1.8 }}>
                        {feedback.map((hint) => <li key={hint}>{hint}</li>)}
                      </ul>
                    </div>

                    <details data-testid={`mediation-keypoints-${task.id}`}>
                      <summary style={{ cursor: "pointer", minHeight: "44px" }}>قارن بالنقاط الأساسية للمدخل</summary>
                      <ul style={{ lineHeight: 1.8 }}>{task.keyPointsAr.map((point) => <li key={point}>{point}</li>)}</ul>
                    </details>
                    <button type="button" className="btn btn-ghost" data-testid={`mediation-model-toggle-${task.id}`} onClick={() => patchEntry(task.id, { showModel: !entry.showModel, phase: "review" })}>
                      {entry.showModel ? "أخفِ النموذج الممكن" : "اعرض نموذجاً ممكناً بعد المحاولة"}
                    </button>
                    {entry.showModel && (
                      <div data-testid={`mediation-model-${task.id}`} style={{ background: "var(--color-paper2)", borderRadius: "8px", padding: "0.75rem" }}>
                        <strong>مثال ممكن، لا إجابة وحيدة:</strong>
                        {task.sampleAr && <p lang="ar" dir="rtl" style={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}>{task.sampleAr}</p>}
                        <p lang="de" dir="ltr" style={{ whiteSpace: "pre-wrap", lineHeight: 1.8, marginBottom: 0 }}>{task.sampleDe}</p>
                      </div>
                    )}

                    <label htmlFor={`${task.id}-revision`} style={{ fontWeight: 800 }}>3. اكتب النسخة الثانية بعد المراجعة</label>
                    <textarea
                      id={`${task.id}-revision`}
                      data-testid={`mediation-revision-${task.id}`}
                      className="field"
                      rows={6}
                      dir="auto"
                      value={entry.revision}
                      onChange={(event) => patchEntry(task.id, { revision: event.target.value, phase: "review" })}
                      placeholder="حرّر النسخة الثانية هنا…"
                    />
                    <div className="tiny muted">{zaehleMediationWoerter(entry.revision)} كلمة في النسخة الثانية.</div>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      <button
                        type="button"
                        className="btn btn-primary"
                        data-testid={`mediation-save-${task.id}`}
                        disabled={!mediationKannSpeichern(task, entry)}
                        onClick={() => {
                          patchEntry(task.id, { phase: "saved", updatedAt: new Date().toISOString() });
                          setSaveMessage(`حُفظت النسخة الثانية لمهمة ${task.id} محلياً ✓`);
                        }}
                      >
                        احفظ النسخة الثانية
                      </button>
                      {isSaved && <button type="button" className="btn btn-ghost" onClick={() => patchEntry(task.id, { phase: "review" })}>عدّل النسخة المحفوظة</button>}
                    </div>
                  </section>
                )}

                <div style={{ fontSize: "0.75rem", color: "var(--ui-muted)", borderInlineStart: "3px solid var(--color-ink2)", padding: "0.4rem 0.6rem" }}>
                  📚 {task.sourceNoteAr} إطار التصميم: أنشطة وساطة داخلية مستلهمة من CEFR Companion Volume، بلا اعتماد أو مطابقة descriptor رسمية.
                </div>
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
