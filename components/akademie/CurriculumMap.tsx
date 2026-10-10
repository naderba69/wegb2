"use client";

import { useMemo, useState } from "react";
import type { Exercise, GrammarTopic, Level, Progress, TaskKind } from "@/lib/types";
import { CURRICULUM_SCHEDULE_VERSION, TOTAL_DAYS, emptyProgress } from "@/lib/types";
import { COURSE_TOPIC_ORDER, grammarAssignmentForDay } from "@/lib/plan";
import { CURRICULUM_LEVELS, CURRICULUM_SECTIONS, buildCurriculumDay } from "@/lib/curriculum";
import {
  getDeck,
  getDialogue,
  getText,
  getWriting,
  grammarMap,
  leseText,
  sentences,
  vocabMap,
  deFormOf,
} from "@/lib/content";
import { planPct } from "@/lib/plan";
import { UiPageHeading } from "@/components/dirb/DesignSystem";

const LEVEL_ORDER: Level[] = ["A0", "A1", "A2", "B1", "B2"];
const LEVEL_TITLE: Record<Level, string> = {
  A0: "التهيئة",
  A1: "الأساسيات",
  A2: "التوسّع",
  B1: "الاستقلال",
  B2: "الإتقان المتقدم",
};
const TASK_LABEL: Record<TaskKind, string> = {
  wiederholen: "مراجعة",
  grammatik: "قواعد",
  wortschatz: "مفردات",
  hoeren: "استماع",
  lesen: "قراءة",
  schreiben: "كتابة",
  sprechen: "تحدّث",
  aussprache: "نطق",
  schulsim: "محاكاة",
  briefe: "رسائل",
  partner: "شريك",
  check: "فحص",
};
const DAY_TYPE_LABEL = {
  lerntag: "تعلّم",
  festigung: "تثبيت",
  wochencheck: "فحص أسبوعي",
  abschluss: "ختام",
} as const;

function PromptList({ items, label }: { items: Exercise[]; label: string }) {
  if (!items.length) return null;
  return (
    <section className="curriculum-source-block">
      <h5>{label} · {items.length}</h5>
      <ol className="curriculum-prompts">
        {items.map((exercise, index) => (
          <li key={exercise.id ?? `${label}-${index}`}>
            {exercise.promptAr && <span>{exercise.promptAr}</span>}
            {exercise.promptDe && <span className="curriculum-de">{exercise.promptDe}</span>}
            {exercise.options?.length ? <small>{exercise.options.join(" · ")}</small> : null}
          </li>
        ))}
      </ol>
      <p className="curriculum-muted">تظهر الإجابات داخل التدريب، لا في خريطة الاستكشاف.</p>
    </section>
  );
}

function TopicMaterials({ topic, compact = false }: { topic: GrammarTopic; compact?: boolean }) {
  const prerequisiteTitles = (topic.voraus ?? []).map((id) => grammarMap[id]?.titleAr ?? id);
  return (
    <div className="curriculum-topic-material">
      {topic.ziel && <p className="curriculum-goal"><strong>هدف الدرس:</strong> {topic.ziel}</p>}
      <p><strong>يبني على:</strong> {prerequisiteTitles.length ? prerequisiteTitles.join("، ") : "لا متطلب سابق — درس تأسيسي"}</p>
      <p className="curriculum-topic-summary">{topic.summaryAr}</p>

      {topic.rules.length > 0 && (
        <section className="curriculum-source-block">
          <h5>الشرح والقواعد</h5>
          <ul className="curriculum-rule-list">
            {topic.rules.map((rule, index) => (
              <li key={`${topic.id}-rule-${index}`}>
                <span className="curriculum-de">{rule.de}</span>
                <span>{rule.ar}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(topic.tables ?? []).map((table, index) => (
        <section className="curriculum-source-block" key={`${topic.id}-table-${index}`}>
          {table.captionAr && <h5>{table.captionAr}</h5>}
          <div className="curriculum-table-scroll">
            <table className="curriculum-table" dir="ltr">
              <thead><tr>{table.headers.map((header) => <th key={header}>{header}</th>)}</tr></thead>
              <tbody>
                {table.rows.map((row, rowIndex) => (
                  <tr key={`${topic.id}-row-${rowIndex}`}>
                    {row.map((cell, cellIndex) => <td key={`${topic.id}-${rowIndex}-${cellIndex}`}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      {topic.examples.length > 0 && (
        <section className="curriculum-source-block">
          <h5>أمثلة مع ترجمتها</h5>
          <ul className="curriculum-example-list">
            {topic.examples.map((example, index) => (
              <li key={`${topic.id}-example-${index}`}>
                <span className="curriculum-de">{example.de}</span>
                <span>{example.ar}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(topic.pitfalls ?? []).length > 0 && (
        <section className="curriculum-source-block">
          <h5>انتبه إلى</h5>
          <ul className="curriculum-example-list">
            {topic.pitfalls!.map((pitfall, index) => (
              <li key={`${topic.id}-pitfall-${index}`}>
                <span className="curriculum-de">{pitfall.de}</span>
                <span>{pitfall.ar}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {topic.anwendung && (
        <section className="curriculum-application">
          <h5>استعمال مستقل في موقف جديد</h5>
          <p>{topic.anwendung.ar}</p>
          <p className="curriculum-de">{topic.anwendung.de}</p>
        </section>
      )}

      {!compact && <PromptList items={topic.exercises} label="تمارين الدرس" />}
      {compact && <p className="curriculum-muted">يتضمن الدرس {topic.exercises.length} تمارين متدرجة.</p>}
      {(topic.verify ?? []).length > 0 && (
        <p className="curriculum-muted">تحقق مستقل مؤجّل: {topic.verify!.length} بنود جديدة بعد التدريب بثلاثة أيام.</p>
      )}
    </div>
  );
}

function LessonCard({ topicId, index, level }: { topicId: string; index: number; level: Level }) {
  const topic = grammarMap[topicId];
  if (!topic) return null;
  return (
    <details className="curriculum-lesson" data-testid={`curriculum-lesson-${topicId}`}>
      <summary>
        <span className="curriculum-lesson-index">{String(index + 1).padStart(2, "0")}</span>
        <span className="curriculum-lesson-name">
          <strong>{topic.titleAr}</strong>
          <small className="curriculum-de">{topic.titleDe}</small>
        </span>
        <span className="curriculum-level-pill">{level}</span>
      </summary>
      <TopicMaterials topic={topic} />
    </details>
  );
}

function VocabMaterial({ deckId }: { deckId: string }) {
  const deck = getDeck(deckId);
  if (!deck) return <p className="curriculum-muted">لم يُربط بهذه المهمة مخزون مفردات مستقل.</p>;
  return (
    <section className="curriculum-source-block">
      <h5>{deck.titleAr} · {deck.titleDe} · {deck.cards.length} كلمة</h5>
      <div className="curriculum-vocab-list">
        {deck.cards.map((card) => (
          <div className="curriculum-vocab-row" key={card.id}>
            <span className="curriculum-de">{deFormOf(card)}{card.plural ? ` · ${card.plural}` : ""}</span>
            <span>{card.ar}</span>
            {card.exampleDe && <small className="curriculum-de">{card.exampleDe}{card.exampleAr ? ` — ${card.exampleAr}` : ""}</small>}
          </div>
        ))}
      </div>
    </section>
  );
}

function TaskMaterial({ task }: { task: ReturnType<typeof buildCurriculumDay>["plan"]["tasks"][number] }) {
  const topic = task.topicId ? grammarMap[task.topicId] : undefined;
  const deck = task.deckId ? vocabMap[task.deckId] : undefined;
  const text = task.textId ? getText(task.textId) : undefined;
  const dialogue = task.dialogueId ? getDialogue(task.dialogueId) : undefined;
  const writing = task.writeId ? getWriting(task.writeId) : undefined;
  const sentenceRows = (task.sentenceIds ?? []).map((id) => sentences.find((sentence) => sentence.id === id)).filter(Boolean);
  const readable = text ? leseText(text) : undefined;

  return (
    <details className="curriculum-task" data-testid={`curriculum-task-${task.id}`}>
      <summary>
        <span className="curriculum-task-label">{TASK_LABEL[task.kind]}</span>
        <strong>{task.titleAr}</strong>
        <small>{task.minutes} د</small>
      </summary>
      <div className="curriculum-task-content">
        <p className="curriculum-de">{task.titleDe}</p>
        {topic && <TopicMaterials topic={topic} compact />}
        {deck && <VocabMaterial deckId={deck.id} />}
        {text && readable && (
          <section className="curriculum-source-block">
            <h5>{text.titleAr} · {text.titleDe}</h5>
            <p className="curriculum-de curriculum-reading-text">{readable.de}</p>
            <p>{readable.ar}</p>
            {text.lang && (
              <details className="curriculum-alt-source">
                <summary>اعرض النسخة الأخرى المتاحة في المصدر</summary>
                <p className="curriculum-de curriculum-reading-text">{text.lang.de}</p>
                <p>{text.lang.ar}</p>
              </details>
            )}
            <PromptList items={readable.questions} label="أسئلة فهم المقروء" />
          </section>
        )}
        {dialogue && (
          <section className="curriculum-source-block">
            <h5>{dialogue.titleAr} · {dialogue.titleDe}</h5>
            <ol className="curriculum-example-list">
              {dialogue.lines.map((line, index) => (
                <li key={`${dialogue.id}-line-${index}`}>
                  <span className="curriculum-de"><strong>{line.who}:</strong> {line.de}</span>
                  <span>{line.ar}</span>
                </li>
              ))}
            </ol>
            <PromptList items={dialogue.questions} label="أسئلة الاستماع" />
          </section>
        )}
        {writing && (
          <section className="curriculum-source-block">
            <h5>{writing.titleAr} · {writing.titleDe}</h5>
            <p>{writing.taskAr}</p>
            <p className="curriculum-de">{writing.taskDe}</p>
            {writing.criteria.length > 0 && <p><strong>معايير التصحيح:</strong> {writing.criteria.join(" · ")}</p>}
            <details className="curriculum-alt-source">
              <summary>اعرض النموذج المرجعي</summary>
              <p className="curriculum-de">{writing.sample}</p>
            </details>
          </section>
        )}
        {sentenceRows.length > 0 && (
          <section className="curriculum-source-block">
            <h5>جمل ومفردات هذه المهمة</h5>
            <ul className="curriculum-example-list">
              {sentenceRows.map((sentence) => sentence && (
                <li key={sentence.id}>
                  <span className="curriculum-de">{sentence.de}</span>
                  <span>{sentence.ar}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
        {task.quiz && <PromptList items={task.quiz} label="بنود التدريب أو الفحص" />}
        {task.fehlerItems && task.fehlerItems.length > 0 && (
          <section className="curriculum-source-block">
            <h5>أمثلة على مواضع الالتباس</h5>
            {task.fehlerItems.map((item, index) => (
              <p key={`${task.id}-error-${index}`}><span className="curriculum-de">{item.falsch} → {item.richtig}</span> — {item.ar}</p>
            ))}
          </section>
        )}
        {!topic && !deck && !text && !dialogue && !writing && sentenceRows.length === 0 && !task.quiz?.length && !task.fehlerItems?.length && (
          <p className="curriculum-muted">هذه خطوة تنظيمية؛ تفاصيلها تظهر في خطة اليوم عند حلول موعدها.</p>
        )}
      </div>
    </details>
  );
}

function DayCard({ day, progress }: { day: number; progress: Progress }) {
  const [open, setOpen] = useState(false);
  const { plan, section } = buildCurriculumDay(day, progress);
  const saved = progress.plan.days[day];
  const isToday = progress.plan.day === day;
  const status = isToday ? "اليوم" : saved?.closed ? "أُنجز" : day < progress.plan.day ? "سابق" : "قادم";
  const skills = [...new Set(plan.tasks.map((task) => TASK_LABEL[task.kind]))];
  const grammar = grammarAssignmentForDay(day, progress);
  const review = grammar?.status === "review";

  return (
    <article className={`curriculum-day${isToday ? " is-today" : ""}${saved?.closed ? " is-done" : ""}`} data-testid={`map-day-${day}`}>
      <button
        type="button"
        className="curriculum-day-toggle"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="curriculum-day-number">{String(day).padStart(3, "0")}</span>
        <span className="curriculum-day-main">
          <strong>اليوم {day} · {DAY_TYPE_LABEL[plan.type]}</strong>
          <small>{section?.titleAr ?? "الختام"} · الأسبوع {plan.week} · {plan.tasks.length} مهام</small>
        </span>
        <span className={`curriculum-day-status${isToday ? " current" : ""}`}>{status}</span>
      </button>
      <div className="curriculum-day-meta" aria-label="المهارات في هذا اليوم">
        {skills.map((skill) => <span className="curriculum-chip" key={`${day}-${skill}`}>{skill}</span>)}
        {review && <span className="curriculum-chip is-review">مراجعة قاعدة</span>}
      </div>
      {open && (
        <div className="curriculum-day-content">
          <p>{section?.descriptionAr}</p>
          {saved?.closed && <p className="curriculum-muted">هذا اليوم مسجّل كمكتمل. استكشاف التفاصيل لا يغيّر سجلك.</p>}
          <div className="curriculum-task-list">
            {plan.tasks.map((task) => <TaskMaterial key={task.id} task={task} />)}
          </div>
        </div>
      )}
    </article>
  );
}

function ScheduleTab({ progress }: { progress: Progress }) {
  const currentSection = CURRICULUM_SECTIONS.find((section) => progress.plan.day >= section.from && progress.plan.day <= section.to);
  const [selectedId, setSelectedId] = useState(currentSection?.id ?? CURRICULUM_SECTIONS[0].id);
  const selected = CURRICULUM_SECTIONS.find((section) => section.id === selectedId) ?? CURRICULUM_SECTIONS[0];
  const pathProgress = useMemo<Progress>(() => ({
    ...emptyProgress,
    plan: {
      ...emptyProgress.plan,
      day: progress.plan.day,
      curriculumScheduleVersion: progress.plan.curriculumScheduleVersion ?? CURRICULUM_SCHEDULE_VERSION,
      curriculumLegacyThroughDay: progress.plan.curriculumLegacyThroughDay ?? 0,
    },
  }), [progress.plan.day, progress.plan.curriculumScheduleVersion, progress.plan.curriculumLegacyThroughDay]);
  const days = useMemo(
    () => Array.from({ length: selected.to - selected.from + 1 }, (_, index) => selected.from + index),
    [selected.from, selected.to],
  );

  return (
    <section className="curriculum-schedule" data-testid="curriculum-calendar">
      <div className="curriculum-section-nav" aria-label="اختر وحدة أو محطة ختامية">
        {CURRICULUM_SECTIONS.map((section) => (
          <button
            key={section.id}
            type="button"
            className={`curriculum-section-choice${selected.id === section.id ? " active" : ""}`}
            aria-pressed={selected.id === section.id}
            onClick={() => setSelectedId(section.id)}
            data-testid={`map-section-${section.id}`}
          >
            <span>{section.level} · {section.kind === "final" ? "الختام" : `وحدة ${section.unit?.nr}`}</span>
            <strong>{section.titleAr}</strong>
            <small>الأيام {section.from}–{section.to}</small>
          </button>
        ))}
      </div>

      <header className="curriculum-section-head">
        <div>
          <span className="curriculum-kicker">{selected.level} · {selected.kind === "final" ? "المحطة الأخيرة" : `الوحدة ${selected.unit?.nr}`}</span>
          <h2>{selected.titleAr}</h2>
          <p className="curriculum-de">{selected.titleDe}</p>
          <p>{selected.descriptionAr}</p>
        </div>
        <span className="curriculum-range">{selected.from}–{selected.to}</span>
      </header>

      <div className="curriculum-day-list">
        {days.map((day) => <DayCard key={day} day={day} progress={pathProgressWithSavedState(pathProgress, progress)} />)}
      </div>
    </section>
  );
}

function pathProgressWithSavedState(pathProgress: Progress, savedProgress: Progress): Progress {
  return {
    ...pathProgress,
    plan: {
      ...pathProgress.plan,
      days: savedProgress.plan.days,
    },
  };
}

export function CurriculumMap({ progress }: { progress: Progress }) {
  const [tab, setTab] = useState<"lessons" | "days">("lessons");
  const pct = planPct(progress);

  return (
    <section className="curriculum-page ui-page" data-testid="curriculum-map">
      <UiPageHeading className="curriculum-hero">
        <span className="curriculum-kicker">طريق واضح من A0 إلى B2</span>
        <h1>مسار المنهج</h1>
        <p>الدروس مرتّبة حسب المتطلبات، ثم خطة الأيام بكل مهاراتها ومحتواها.</p>
        <div className="curriculum-stats" aria-label="ملخص المسار">
          <span><strong>378</strong><small>يوماً</small></span>
          <span><strong>5</strong><small>مستويات</small></span>
          <span><strong>17</strong><small>وحدة + ختام</small></span>
          <span><strong>{LEVEL_ORDER.reduce((sum, level) => sum + COURSE_TOPIC_ORDER[level].length, 0)}</strong><small>درس قواعد</small></span>
        </div>
        <div className="curriculum-progress-line">
          <span>اليوم {Math.min(progress.plan.day, TOTAL_DAYS)} من {TOTAL_DAYS}</span>
          <div className="curriculum-progress-track" role="progressbar" aria-label="التقدم في الأيام" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
            <span style={{ width: `${pct}%` }} />
          </div>
          <span>{pct}%</span>
        </div>
        <div className="curriculum-hero-links">
          <a className="curriculum-primary-link" href="/">العودة إلى خطة اليوم</a>
          <span>الخريطة للاستكشاف فقط: لا تقدّم اليوم ولا تغيّر التقدم.</span>
        </div>
        {progress.plan.curriculumLegacyThroughDay ? (
          <p className="curriculum-preserve-note">أيامك المسجّلة والأسبوع الجاري محفوظان؛ يبدأ ترتيب الدروس الجديد بعدهما.</p>
        ) : null}
      </UiPageHeading>

      <div className="curriculum-tabs" role="tablist" aria-label="أقسام المسار">
        <button type="button" role="tab" aria-selected={tab === "lessons"} onClick={() => setTab("lessons")} data-testid="curriculum-tab-lessons">
          الدروس ومحتواها <span>66</span>
        </button>
        <button type="button" role="tab" aria-selected={tab === "days"} onClick={() => setTab("days")} data-testid="curriculum-tab-days">
          خطة 378 يوماً <span>17 وحدة</span>
        </button>
      </div>

      {tab === "lessons" ? (
        <div className="curriculum-level-list" role="tabpanel" data-testid="curriculum-lessons-panel">
          {CURRICULUM_LEVELS.map((levelInfo) => {
            const topicIds = COURSE_TOPIC_ORDER[levelInfo.level];
            return (
              <section className="curriculum-level" key={levelInfo.level} data-testid={`curriculum-level-${levelInfo.level}`}>
                <header className="curriculum-level-head">
                  <span className="curriculum-level-pill">{levelInfo.level}</span>
                  <div>
                    <h2>{LEVEL_TITLE[levelInfo.level]}</h2>
                    <p>{levelInfo.from}–{levelInfo.to} يوماً · {topicIds.length} درساً · {levelInfo.summaryAr}</p>
                  </div>
                </header>
                <div className="curriculum-lesson-list">
                  {topicIds.map((topicId, index) => <LessonCard key={topicId} topicId={topicId} index={index} level={levelInfo.level} />)}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div role="tabpanel" data-testid="curriculum-days-panel">
          <p className="curriculum-safe-note">اختر وحدة، ثم افتح اليوم والمهمة لرؤية المادة الأصلية. هذه الخريطة لا تسجّل إنجازاً ولا تغيّر خطة اليوم.</p>
          <ScheduleTab progress={progress} />
        </div>
      )}
    </section>
  );
}
