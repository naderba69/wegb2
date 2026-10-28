"use client";
import { useEffect, useMemo, useState, lazy, Suspense } from "react";
import Link from "next/link";
import { useProgress, saveProgress, loadProgress, planeVerifikation } from "@/lib/store";
import { buildDay, dayScore, debtsFrom, modulOf } from "@/lib/plan";
import { kapselVerbuche } from "@/lib/kapsel";
import { TOTAL_DAYS } from "@/lib/types";
import { useSessionClock } from "@/hooks/use-session-clock";
import { sessionGoalReached, sessionMinuteTenth } from "@/lib/session-clock";
import { grammarMap } from "@/lib/content";
import { ritualUrteil, aufgabeGesperrt } from "@/lib/ritual";
import { KindIcon } from "@/components/dirb/icons";
import TodayStepper from "@/components/akademie/TodayStepper";
import { TodayB2Praxis } from "@/components/today-b2-praxis";
import { stationOfTask, STATIONEN } from "@/components/stationen";
import { LernPfad } from "@/components/lernpath";
import { ProfilWahl } from "@/components/profil";
import { progressKeyActive } from "@/lib/profiles";
import { OnboardingWizard } from "@/components/onboarding-wizard";
import { Klassenzimmer } from "@/components/akademie/Klassenzimmer";
import { resumeAusloesen, resumeBedarf, resumePlan, resumeZustand } from "@/lib/wiedereinstieg";
import { SkillBalancePlan } from "@/components/skillplan";
import { WiedereinstiegBanner } from "@/components/wiedereinstieg";
import { tagGesperrt } from "@/lib/modulpruefung";
import ModulTor from "@/components/modultor";
import ExerciseSet from "@/components/exercises";
import { heutigesGrammatikThema, parkedExercisesFor } from "@/lib/parkuebungen";
import { FehlerGrenze } from "@/components/fehlergrenze";

// ⚡ R308: تحميلٌ كسولٌ حقيقي — لا تُجلَب شيفرتا «تدرّب»/«اختبر» الثقيلتان (عشرات المحطات)
// ضمن حزمة صفحة «اليوم» (الأكثر زيارةً بفارق كبير) إلا عند فتح القسم فعليًا.
const UebenSeite = lazy(() => import("./ueben/page"));
const PruefenSeite = lazy(() => import("./pruefen/page"));

const TYPE_LABEL: Record<string, string> = {
  lerntag: "يوم تعلّم",
  festigung: "يوم تثبيت وكتابة",
  wochencheck: "فحص أسبوعي",
  abschluss: "يوم ختامي",
};

/** أسماء المهارات التي تظهر في واجهة اليوم بالعربية. */
const SKILL_AR: Record<string, string> = {
  hoeren: "استماع",
  lesen: "قراءة",
  schreiben: "كتابة",
  sprechen: "تحدّث",
  aussprache: "نطق",
  grammatik: "قواعد",
  wortschatz: "مفردات",
  wiederholen: "مراجعة",
  check: "فحص",
};

type TaskPoints = Record<string, { score: number; total: number }>;
/** P1 fix code/dayStepKey: مفاتيح per-profile + per-day لتجنب فوق كتابة يوم برقم عبر الملفات أو عند تغيير التاريخ */
function profilePrefix(): string {
  try { return progressKeyActive(); } catch { return "weg-b2-progress-p1"; }
}
const dayStepKey = (day: number) => `${profilePrefix()}:day-step:${day}`;
const dayPointsKey = (day: number) => `${profilePrefix()}:partial-points:${day}`;
function clearPartialTaskState(taskId: string) {
  try {
    const prefix = `${profilePrefix()}:partial:${taskId}:`;
    const legacyPrefix = `wegb2:partial:${taskId}:`;
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key?.startsWith(prefix) || key?.startsWith(legacyPrefix)) localStorage.removeItem(key);
    }
  } catch { /* التخزين محظور أو ممتلئ */ }
}
function migrateLegacyDayKeys() {
  // ترحيل لمرة واحدة: انسخ مفاتيح wegb2:day-step:N القديمة إلى المفتاح الجديد per-profile إن لم يوجد
  try {
    const prefix = profilePrefix();
    for (let day = 1; day <= 378; day++) {
      const legacy = `wegb2:day-step:${day}`;
      const neu = `${prefix}:day-step:${day}`;
      if (!localStorage.getItem(neu) && localStorage.getItem(legacy)) {
        localStorage.setItem(neu, localStorage.getItem(legacy)!);
      }
      const legacy2 = `wegb2:partial-points:${day}`;
      const neu2 = `${prefix}:partial-points:${day}`;
      if (!localStorage.getItem(neu2) && localStorage.getItem(legacy2)) {
        localStorage.setItem(neu2, localStorage.getItem(legacy2)!);
      }
    }
  } catch { /* */ }
}

/** شاشة «اليوم»: مهمة واحدة في المقدمة؛ الأدوات والبدائل قابلة للفتح عند الحاجة. */
export default function Today() {
  const { progress, ready, submitTask, closeDay, setSrs, saveExam, update } = useProgress();
  const day = progress.plan.day;
  const basePlan = useMemo(() => buildDay(day, progress), [day, progress]);
  const resumeAktiv = resumeZustand(progress).aktiv;
  const plan = useMemo(
    () => (resumeAktiv ? resumePlan(basePlan, progress) : basePlan),
    [basePlan, progress, resumeAktiv]
  );
  const [step, setStep] = useState(0);
  const [stepRestoredDay, setStepRestoredDay] = useState<number | null>(null);
  const [points, setPoints] = useState<TaskPoints>({});
  const [pointsLoadedDay, setPointsLoadedDay] = useState<number | null>(null);
  const [confirmClose, setConfirmClose] = useState(false);
  const [sessionSaved, setSessionSaved] = useState(false);
  // ➕ R307: حالتا طيّ القسمين الجديدين المُدمَجين من «اختبر»/«تدرّب» في تدفّق اليوم نفسه.
  const [examOpen, setExamOpen] = useState(false);
  const [zusatzOffen, setZusatzOffen] = useState(false);
  // ⚡ R308: حالتا فتح القسمين المُدمَجين — يتحكّمان بالتركيب الفعلي (lazy) لا بالعرض البصري فقط
  const [uebenGeoeffnet, setUebenGeoeffnet] = useState(false);
  const [pruefenGeoeffnet, setPruefenGeoeffnet] = useState(false);
  const session = useSessionClock(day, plan.tasks[step]?.id, ready);

  useEffect(() => {
    if (!ready) return;
    migrateLegacyDayKeys();
    let savedStep = 0;
    try {
      const parsed = Number(localStorage.getItem(dayStepKey(day)));
      if (Number.isInteger(parsed) && parsed >= 0) savedStep = parsed;
    } catch { /* يبدأ من المهمة الأولى عند تعذّر التخزين */ }
    setStep(Math.min(savedStep, Math.max(plan.tasks.length - 1, 0)));
    setStepRestoredDay(day);
  }, [ready, day, plan.tasks.length]);

  useEffect(() => {
    if (!ready || stepRestoredDay !== day) return;
    try { localStorage.setItem(dayStepKey(day), String(step)); } catch { /* لا نوقف التدريب إذا مُنع التخزين */ }
  }, [ready, stepRestoredDay, day, step]);

  useEffect(() => {
    if (!ready) return;
    let restored: TaskPoints = {};
    try {
      const raw = localStorage.getItem(dayPointsKey(day));
      const parsed = raw ? JSON.parse(raw) as unknown : null;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        restored = Object.fromEntries(Object.entries(parsed as Record<string, unknown>).flatMap(([id, value]) => {
          if (!value || typeof value !== "object") return [];
          const { score, total } = value as { score?: unknown; total?: unknown };
          return typeof score === "number" && Number.isFinite(score) && typeof total === "number" && Number.isFinite(total)
            ? [[id, { score, total }]]
            : [];
        }));
      }
    } catch { /* مسودّة تالفة = بداية نظيفة، لا فشل لغوي */ }
    setPoints(restored);
    setPointsLoadedDay(day);
  }, [ready, day]);

  // 🌱 M15/R287: عند أول فتح بعد غياب تُسجَّل جلسة الاستئناف قبل أي تحديث آخر
  useEffect(() => {
    if (ready && resumeBedarf(progress)) update((p) => resumeAusloesen(p));
  }, [ready, progress, update]);

  useEffect(() => {
    if (!ready || pointsLoadedDay !== day) return;
    try { localStorage.setItem(dayPointsKey(day), JSON.stringify(points)); } catch { /* لا نوقف التدريب إذا مُنع التخزين */ }
  }, [ready, pointsLoadedDay, day, points]);

  if (!ready) return <div className="today-screen" role="status" aria-live="polite">⏳ جارٍ استعادة خطتك وتقدّمك المحفوظ…</div>;

  const showOnboarding = !(progress as any).settings?.onboardingDone && progress.plan.day <= 3;
  const resultOf = (id: string) => progress.plan.tasks[id];
  // 🔐 بوابة الجلسة: الجديد لا يُرى قبل تسليم الاسترجاع (lib/ritual.ts)
  const ritual = ritualUrteil(plan, progress);
  const stepFrei = aufgabeGesperrt(ritual, step) ? Math.max(0, ritual.ersteFreie - 1) : step;
  const localOf = (id: string) => points[id] ?? { score: 0, total: 0 };
  const totalMinutes = plan.tasks.reduce((acc, tk) => acc + tk.minutes, 0);
  const zielMin = session.clock.goalMinutes || plan.zielMin;
  const sessionTenth = sessionMinuteTenth(session.clock.totalMs);
  const measuredMin = sessionTenth / 10;
  const goalReached = sessionGoalReached(session.clock);
  const tagesPct = zielMin > 0 ? Math.min(100, Math.floor((session.clock.totalMs / (zielMin * 60_000)) * 100)) : 0;
  const dateAr = new Date().toLocaleDateString("ar", { weekday: "long", day: "numeric", month: "long" });

  // الخطوة الحالية هي الوحيدة في بطاقة المقدمة.
  const held = plan.tasks[stepFrei] ?? plan.tasks[0];
  const heldFertig = held ? !!resultOf(held.id) : false;
  const heldBestanden = held ? !!resultOf(held.id)?.passed : false;
  const allTodayDone = plan.tasks.length > 0 && plan.tasks.every((task) => !!resultOf(task.id));
  // سبب الاختيار بلغة بسيطة، مع إبقاء معنى الاسترجاع والتحقق المستقل.
  const heldGrund = !held
    ? ""
    : held.verifyFor
      ? "مهمة جديدة للتأكد من ثبات ما تعلّمته."
      : held.mandatory
        ? `مراجعة لم تكتمل في اليوم ${held.from}؛ نبدأ بها اليوم.`
        : held.exam
          ? "اختبار هذه المرحلة — خذ وقتك وأجب بهدوء."
          : held.kind === "wiederholen"
            ? "مراجعة قصيرة قبل الانتقال إلى الجديد."
            : "هذه هي الخطوة التالية في خطتك.";
  // 🗺️ R306: أهداف درس اليوم بصيغة محطّات — من نفس تصنيف STATIONEN الذي يستخدمه
  // المشغّل المتسلسل أسفل الصفحة (لا تصنيف منافس جديد)، ومُشتقّة من مهام اليوم الفعلية فقط.
  const heuteStationen: { id: string; icon: string; ar: string }[] = [];
  {
    const seen = new Set<string>();
    for (const tk of plan.tasks) {
      const s = stationOfTask(tk);
      if (!seen.has(s)) {
        seen.add(s);
        heuteStationen.push({ id: s, icon: STATIONEN[s].icon, ar: STATIONEN[s].ar });
      }
    }
  }
  // 🔒 R307: بوّابة الوحدة (القاعدة الصريحة في lib/modulpruefung.ts: «لا تُفتَحُ وحدةٌ
  // قبلَ اجتيازِ امتحانِ سابقتِها») كانت مُختبَرةً (K57m) لكن غير ظاهرة في أيّ شاشة حقيقية —
  // الآن تُعرَض هنا صراحةً مع بوّابة الامتحان نفسها مدمجةً في نفس صفحة اليوم، دون حجب
  // مهامّ اليوم الجارية (لا قفل قسري يهدم تغطية الاختبارات القائمة على مئات الأيام).
  // R309: الفحصُ على اليوم التالي (day+1) لا اليوم الحالي — فيلتقط بدقّةٍ اللحظةَ الحرجةَ
  // (آخر يومٍ في الوحدة) حيث يحتاج *الإغلاقُ* إلى الاختبار، لا مجرّد عرض اليوم الحالي.
  const modulGate = tagGesperrt(progress, day + 1);
  // ➕ R307: «زائد الدرس» — نفس تمارين موضوع القواعد المُرحَّلة التي كانت حبيسة «تدرّب»
  // خلف قفل المساء؛ تُعرَض هنا أيضًا فور توفّرها، ضمن تسلسل اليوم نفسه.
  const topicIdHeute = heutigesGrammatikThema(plan);
  const zusatzUebungen = parkedExercisesFor(topicIdHeute);
  const scrollToTraining = () => {
    document.getElementById("dirb-training")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const startToday = () => {
    if (allTodayDone) {
      document.getElementById("dirb-abschluss")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (goalReached && !session.running) {
      document.getElementById("session-goal-choice")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    session.start();
    setSessionSaved(false);
    if (heldBestanden) {
      const next = plan.tasks.findIndex((task, i) => !resultOf(task.id)?.passed && !aufgabeGesperrt(ritual, i));
      if (next >= 0) setStep(next);
    }
    document.getElementById("dirb-training")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const springeZu = (i: number) => {
    setStep(i);
    scrollToTraining();
  };

  // ── نهاية الرحلة: اليوم 271 = الحصيلة النهائية ──
  if (day > TOTAL_DAYS) {
    const closedDays = Object.values(progress.plan.days);
    const totalScore = closedDays.reduce((a, d) => a + d.score, 0);
    const totalMax = closedDays.reduce((a, d) => a + d.total, 0);
    const avg = totalMax ? Math.round((totalScore / totalMax) * 100) : 0;
    const canDoCount = Object.keys(progress.canDo).length;
    return (
      <div className="today-screen fadein ui-page ui-page--today" data-testid="today-screen">
        <div className="dirb-finale">
          <div style={{ fontSize: "3rem" }}>🎓</div>
          <h1 style={{ fontWeight: 900, fontSize: "1.6rem", margin: 0 }}>
            اكتملت الرحلة — {TOTAL_DAYS} يوماً حتى B2!
          </h1>
          <p style={{ color: "var(--color-ink2)", lineHeight: 1.9, margin: 0 }}>
            بدأتَ من اليوم الأول بلا ضياع، وأتممتَ كل يوم بإغلاقه. هذه حصيلتك العلمية:
          </p>
          <div style={{ display: "flex", gap: "1.2rem", justifyContent: "center", flexWrap: "wrap", margin: "0.6rem 0" }}>
            <Stat label="أيام مُغلقة" value={`${closedDays.length}/${TOTAL_DAYS}`} />
            <Stat label="معدّل الإتقان" value={`${avg}%`} />
            <Stat label="أهداف «أستطيع»" value={String(canDoCount)} />
            <Stat label="بطاقات مُدارة" value={String(Object.keys(progress.srs).length)} />
            {Object.keys(progress.exams ?? {}).length > 0 && (
              <Stat
                label="امتحانات المراحل"
                value={`${Object.values(progress.exams ?? {}).filter((e) => e.passed).length}/${Object.keys(progress.exams ?? {}).length}`}
              />
            )}
          </div>
          <div className="card" style={{ padding: "1.1rem", textAlign: "start", background: "var(--color-gold-soft)" }}>
            <strong>🧭 بعد B2 — خارطة الاستمرار:</strong>
            <ul style={{ paddingInlineStart: "1.2rem", lineHeight: 1.9, marginTop: "0.5rem", marginBottom: 0 }}>
              <li>استمر بالتسميع اليومي (Shadowing) ونصوص B2 الثقيلة.</li>
              <li>خُض نموذج Goethe-Zertifikat B2 الرسمي كاملًا بتوقيت حقيقي.</li>
              <li>عمّق B2 حتى الإتقان: نصوص ثقيلة ومحادثات طويلة وكتابة رسمية بلا أخطاء متكررة.</li>
              <li>ابدأ مسارًا جديدًا في أي وقت من الإعدادات (تصفير) — الخطة تتكرر بعينها حتمياً.</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const onPoints = (p: number, m: number) => {
    const task = plan.tasks[stepFrei];
    if (!task) return;
    session.start();
    setSessionSaved(false);
    setPoints((old) => {
      const cur = old[task.id] ?? { score: 0, total: 0 };
      return { ...old, [task.id]: { score: cur.score + p, total: cur.total + m } };
    });
  };

  const submitCurrent = () => {
    localStorage.removeItem("weg-abend"); // أوّلُ مهمّةٍ في اليومِ الجديدِ تُعيدُ قفلَ التدريب الحرّ
    const task = plan.tasks[stepFrei];
    if (!task) return;
    session.checkpoint();
    const local = localOf(task.id);
    const actualTaskMinutes = session.taskMinutes(task.id);
    // 🎯 إنجازُ تدريبِ درسٍ يجدول تحققَ استقلاله بعد 3 أيام (مهمة جديدة لا إعادة)
    if (task.topicId && (grammarMap[task.topicId]?.verify ?? []).length > 0 && !progress.verify?.[task.topicId]) {
      planeVerifikation(task.topicId, day);
    }
    submitTask(day, task.id, local.score, local.total, task.kind, task.minutes, task.verifyFor, actualTaskMinutes);
    clearPartialTaskState(task.id);
    setPoints((old) => {
      const next = { ...old };
      delete next[task.id];
      return next;
    });
    // امتحان مرحلة/ختامي: سجّل النتيجة في كشوف Zeugnis
    if (task.exam && local.total > 0) {
      const pct = Math.round((local.score / local.total) * 100);
      saveExam(day, pct, pct >= 80);
    }
    if (step < plan.tasks.length - 1) setStep(step + 1);
  };

  // R309: القفل الفعلي — فتحٌ مباشر لبوّابة الامتحان بدل الإغلاق المحظور، مع تمرير واضح إليها
  const oeffneModulPruefungJetzt = () => {
    setExamOpen(true);
    document.getElementById("modul-pruefung-mahnung")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const doCloseDay = () => {
    // 🔒 R309: لا تُفتَحُ وحدةٌ قبلَ اجتيازِ امتحانِ سابقتِها (lib/modulpruefung.ts) —
    // قفلٌ فعلي حقيقي هنا لا مطالبة إعلامية فقط: الإغلاق يتوقّف فعلًا عند هذه الحدود.
    if (modulGate.gesperrt) { oeffneModulPruefungJetzt(); return; }
    session.pause();
    const merged: Record<string, { done: boolean; passed: boolean; score: number; total: number; attempts: number }> = {};
    for (const tk of plan.tasks) {
      const r = progress.plan.tasks[tk.id];
      const local = points[tk.id] ?? { score: 0, total: 0 };
      const total = r?.total ?? local.total;
      const score = r?.score ?? local.score;
      merged[tk.id] = {
        done: true,
        passed: r?.passed ?? (total > 0 && score / total >= 0.8),
        score,
        total,
        attempts: r?.attempts ?? 1,
      };
    }
    const ds = dayScore(plan, merged as never);
    const debts = debtsFrom(plan, merged as never);
    closeDay(day, ds.score, Math.max(ds.total, 1), ds.done, ds.tasksTotal, debts);
    for (const task of plan.tasks) clearPartialTaskState(task.id);
    try { localStorage.removeItem(dayPointsKey(day)); } catch { /* التخزين محظور */ }
    localStorage.setItem("weg-abend", "1"); // مساءُ ما بعدِ الإغلاق: بابُ «تدرّب» يُفتح
    setConfirmClose(false);
    setStep(0);
    setPoints({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pauseAndSaveSession = () => {
    session.pause();
    try { localStorage.setItem(dayStepKey(day), String(stepFrei)); } catch { /* position remains in component state */ }
    saveProgress(loadProgress());
    setSessionSaved(true);
  };

  const allSubmitted = plan.tasks.every((tk) => resultOf(tk.id) || localOf(tk.id).total > 0);

  /** 🧘 «يوم سيّئ»: تجميد السلسلة وعبور اليوم بلا ديون ولا عقاب (K-badDay) */
  const badDayToday = () => {
    // 🔒 R309: «يوم سيّئ» لا يلتف حول بوّابة الوحدة — نفس القفل الحقيقي يسري هنا أيضًا
    if (modulGate.gesperrt) { oeffneModulPruefungJetzt(); return; }
    session.pause();
    const today = new Date().toISOString().slice(0, 10);
    update((p) => ({
      ...p,
      badDay: today,
      plan: {
        ...p.plan,
        day: day + 1,
        debt: [],
        days: {
          ...p.plan.days,
          [day]: { closed: true, score: 0, total: 0, tasksDone: 0, tasksTotal: 0, at: new Date().toISOString(), minutenEffektiv: p.plan.minutenEffektivTage?.[day] ?? 0, badDay: true } as never,
        },
      },
    }));
    for (const task of plan.tasks) clearPartialTaskState(task.id);
    try { localStorage.removeItem(dayPointsKey(day)); } catch { /* التخزين محظور */ }
    localStorage.setItem("weg-abend", "1"); // «يومٌ سيّئ» إغلاقٌ أيضاً — والمساء يُفتح
    setStep(0);
    setPoints({});
  };
  const unpassed = plan.tasks.filter((tk) => {
    const r = resultOf(tk.id);
    const local = localOf(tk.id);
    const passed = r?.passed ?? (local.total > 0 && local.score / local.total >= 0.8);
    return !passed;
  });

  return (
    <div className="today-screen fadein dirb ui-page ui-page--today" data-testid="today-screen">
      {showOnboarding && <OnboardingWizard />}
      {modulGate.gesperrt && (
        <section
          id="modul-pruefung-mahnung"
          className="card fadein"
          data-testid="modul-pruefung-mahnung"
          role="note"
          aria-label="اختبار الوحدة السابقة بانتظارك"
          style={{ padding: "0.9rem 1.1rem", marginBottom: "0.8rem", borderInlineStart: "5px solid var(--color-gold)", background: "var(--color-gold-soft)" }}
        >
          <div style={{ fontWeight: 900 }}>📋 اختبار الوحدة {modulGate.wartendeModulNr} بانتظارك</div>
          <p style={{ margin: "0.3rem 0 0.5rem", fontSize: "0.88rem", lineHeight: 1.8 }}>
            🧑‍🏫 <strong>مدرّبك:</strong> يمكنك إكمال مهامّ اليوم كما هي، لكن <strong>إغلاق اليوم والانتقال إلى الوحدة
            التالية مقفلان فعليًا</strong> حتى تجتاز امتحان هذه الوحدة — بحكم القاعدة نفسها، لا استثناء ولا تجاوز بـ«يوم سيّئ».
            خذه الآن من هنا مباشرةً دون مغادرة الصفحة.
          </p>
          <button
            type="button"
            className="btn btn-ghost"
            data-testid="modul-pruefung-toggle"
            onClick={() => setExamOpen((o) => !o)}
            style={{ minHeight: "44px" }}
          >
            {examOpen ? "إخفاء الاختبار" : "📋 ابدأ اختبار الوحدة الآن"}
          </button>
          {examOpen && <div style={{ marginTop: "0.7rem" }}><ModulTor day={day} /></div>}
        </section>
      )}
      <header className="dirb-hero-anim">
        <div className="dirb-date-row">
          <span className="dirb-date">{dateAr}</span>
          <span className="dirb-pill">اليوم الدراسي <span className="rtl-num">{day}</span> / <span className="rtl-num">{TOTAL_DAYS}</span></span>
        </div>
        <h1 className="dirb-giant">خطوتك اليوم</h1>
        {heuteStationen.length > 0 && (
          <div className="dirb-chips" data-testid="today-ziele" aria-label="أهداف درس اليوم — محطّات اليوم">
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-ink2)" }}>🗺️ أهداف اليوم:</span>
            {heuteStationen.map((s) => (
              <span key={s.id} className="chip" style={{ fontSize: "0.78rem" }}>{s.icon} {s.ar}</span>
            ))}
          </div>
        )}
      </header>

      {held && (
        <section className="dirb-held dirb-hero-anim-2" aria-label="خطوتك التالية" data-testid="today-primary-step">
          <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--color-ink2)", letterSpacing: "0.02em" }}>📋 مهمة اليوم — نفّذ الآن</div>
          <KindIcon kind={held.kind} className="dirb-held-icon" />
          <div className="dirb-held-skill">{day === 1 && held.titleDe.includes("Willkommen") ? "تهيئة" : (SKILL_AR[held.kind] ?? held.kind)}</div>
          <div className="dirb-held-ar">{held.titleAr}</div>
          <div className="dirb-held-lektion" lang="de" dir="ltr">{held.titleDe}</div>
          <div className="dirb-held-meta">
            ⏱ <span className="rtl-num">{held.minutes}</span> دقيقة · <span lang="de" dir="ltr">{plan.phase}</span>
          </div>
          <div className="dirb-held-grund" data-testid="today-coach-grund">🧑‍🏫 <strong>مدرّبك:</strong> {heldGrund}</div>
          {heldFertig && <div className="dirb-held-done">✓ أُنجزت هذه الخطوة</div>}
          <button type="button" className="dirb-start" onClick={startToday} data-testid="held-start">
            {allTodayDone
              ? "راجع نهاية اليوم"
              : goalReached && !session.running
                ? "اختر المتابعة أو الحفظ"
                : heldBestanden
                  ? "ابدأ الخطوة التالية"
                  : heldFertig
                    ? "حاول مرة أخرى"
                    : session.running
                      ? "تابع التعلّم"
                      : session.clock.totalMs > 0
                        ? "تابع الجلسة"
                        : "ابدأ جلسة 90 دقيقة"}
            <span aria-hidden>←</span>
          </button>
        </section>
      )}

      {/* 🗺️ Sprint 1B — Unified Today Stepper: 5 خطوات مرئية + مقفلة بصرياً (Hybrid Gated) */}
      <TodayStepper
        plan={plan}
        progress={progress}
        ritual={ritual}
        stepFrei={stepFrei}
        setStep={setStep}
        resultOf={resultOf as any}
        localOf={localOf}
      />
      <TodayB2Praxis />

      <section className="dirb-tagesziel dirb-hero-anim-2" aria-label="هدف الجلسة اليومي" data-testid="session-goal-panel">
        <div className="dirb-tagesziel-top">
          <span className="dirb-tagesziel-title">هدف الجلسة — 90 دقيقة افتراضياً</span>
          <span className="dirb-tagesziel-min" data-testid="session-goal-progress">
            <span className="rtl-num">{measuredMin.toFixed(1)}</span> من <span className="rtl-num">{zielMin}</span> دقيقة مقاسة
          </span>
        </div>
        <div className="dirb-bar" role="progressbar" aria-label="التقدّم نحو هدف الجلسة" aria-valuenow={tagesPct} aria-valuemin={0} aria-valuemax={100}>
          <div className="dirb-fill" style={{ width: `${Math.max(tagesPct, tagesPct > 0 ? 8 : 0)}%` }}>
            <span className="rtl-num">{tagesPct}%</span>
          </div>
        </div>
        <p data-testid="session-time-note" style={{ margin: "0.5rem 0 0", fontSize: "0.82rem", color: "var(--color-ink2)", lineHeight: 1.85 }}>
          المؤقّت يقيس وقت الجلسة الفعلي والصفحة ظاهرة؛ الهدف الحالي <span className="rtl-num">{zielMin}</span> دقيقة (والافتراضي 90). مجموع تقديرات مهام اليوم <span className="rtl-num">{totalMinutes}</span> دقيقة عبر <span className="rtl-num">{plan.tasks.length}</span> مهام — رقم مستقل لا يغيّر المؤقّت ولا يلزمك بإكمال القائمة في جلسة واحدة.
        </p>
        {session.running ? (
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center", marginTop: "0.55rem" }}>
            <span role="status" data-testid="session-running-status">⏱️ الجلسة جارية — الوقت المقاس محفوظ تلقائياً.</span>
            <button type="button" className="btn btn-ghost" data-testid="session-stop-save" onClick={pauseAndSaveSession}>أوقف واحفظ الآن</button>
          </div>
        ) : !goalReached && !allTodayDone ? (
          <button type="button" className="btn btn-primary" data-testid="session-start" disabled={!session.loaded}
            onClick={() => { session.start(); setSessionSaved(false); }} style={{ marginTop: "0.55rem" }}>
            {session.clock.totalMs > 0 ? "تابع الجلسة" : "ابدأ جلسة 90 دقيقة"}
          </button>
        ) : null}
        {session.pauseReason === "idle" && !goalReached && (
          <p role="status" data-testid="session-idle-paused" style={{ margin: "0.45rem 0 0", fontSize: "0.8rem" }}>
            أُوقف المؤقّت بعد عشر دقائق من الخمول؛ يمكنك متابعة الجلسة وقتما تشاء.
          </p>
        )}
        {sessionSaved && (
          <p role="status" data-testid="session-saved" style={{ margin: "0.45rem 0 0", fontSize: "0.82rem", fontWeight: 700 }}>
            ✅ حُفظ موضعك والتقدّم المُسلَّم والمسودّات المدعومة؛ ما لم تسلّمه لا يُسجَّل فشلاً أو تعويضاً.
          </p>
        )}
        {goalReached && (
          <div id="session-goal-choice" data-testid="session-goal-choice" className="card" style={{ padding: "0.7rem 0.85rem", marginTop: "0.65rem", display: "grid", gap: "0.45rem" }}>
            <strong>بلغت هدف الجلسة. يمكنك التوقف والحفظ الآن أو اختيار المزيد.</strong>
            <span style={{ fontSize: "0.82rem", color: "var(--color-ink2)" }}>
              {allTodayDone ? "اكتملت مهام الخطة؛ المتابعة اختيارية للمراجعة." : `ما زالت ${plan.tasks.filter((task) => !resultOf(task.id)).length} مهام متاحة؛ لا يلزم إنهاؤها الآن.`}
            </span>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button type="button" className="btn btn-primary" data-testid="session-more" onClick={() => { session.extend(); setSessionSaved(false); }}>
                المزيد (+30 دقيقة) — أتابع التعلّم
              </button>
              <button type="button" className="btn btn-ghost" data-testid="session-goal-stop" onClick={pauseAndSaveSession}>
                أوقف واحفظ التقدّم
              </button>
            </div>
          </div>
        )}
      </section>

      <details className="dirb-extra" data-testid="today-extra">
        <summary>
          <span>تفاصيل وأدوات</span>
          <span className="dirb-extra-hint">الوحدة · الملف · الطباعة · الإعدادات</span>
        </summary>
        <div className="dirb-extra-content">
          <div className="dirb-etikett" data-test="modul-etikett">
            {modulOf(day).etikett} · {modulOf(day).modul.titelAr}
            <small>{" "}({modulOf(day).schritt}/{modulOf(day).schritte}) — {modulOf(day).modul.inhalteAr}</small>
          </div>
          <div className="dirb-chips">
            <span className="chip">{plan.phase}</span>
            <span className="chip">{TYPE_LABEL[plan.type]}</span>
            <ProfilWahl />
            {progress.settings.examDate && (
              <span className="chip">📅 {examCountdown(progress.settings.examDate, progress.settings.examName)}</span>
            )}
          </div>
          <div className="dirb-extra-actions">
            <Link href="/drucken" className="dirb-extra-action">🖨 ورقة الشفرات</Link>
            <Link href="/einstellungen" className="dirb-extra-action">⚙️ الإعدادات</Link>
            <button
              type="button"
              className="dirb-extra-action"
              title="تنزيل نسخة احتياطية تحتوي على تقدّمك الحالي"
              onClick={() => {
                saveProgress(progress);
                const blob = new Blob([JSON.stringify(progress, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `wegb2-backup-${new Date().toISOString().slice(0, 10)}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
            >
              💾 نسخة احتياطية
            </button>
          </div>
        </div>
      </details>

      <details className="dirb-task-map" data-testid="today-task-map">
        <summary>
          <span>قائمة مهام اليوم</span>
          <span className="dirb-extra-hint">{plan.tasks.length} مهام · تنقّل عند الحاجة</span>
        </summary>
        <div className="dirb-minis" role="list" aria-label="مهام اليوم">
          {plan.tasks.map((tk, i) => {
            const gesperrt = aufgabeGesperrt(ritual, i);
            const fertig = !!resultOf(tk.id);
            const jetzt = i === stepFrei;
            return (
              // ♿ R305/ب14: role="listitem" كان على <button> نفسه (عنصر تفاعلي بدور غير
              // تفاعلي — نمط ARIA غير سليم)؛ الدور الآن على غلاف غير تفاعلي، والزر تفاعلي صرف.
              <div key={tk.id} role="listitem" style={{ display: "contents" }}>
                <button
                  type="button"
                  disabled={gesperrt}
                  data-testid={`held-mini-${i}`}
                  className={"dirb-mini" + (jetzt ? " dirb-mini-jetzt" : "") + (fertig ? " dirb-mini-fertig" : "")}
                  onClick={() => springeZu(i)}
                  aria-label={`${SKILL_AR[tk.kind] ?? tk.kind} — ${tk.minutes} دقائق${gesperrt ? " (مقفولة: سلِّم الاسترجاع أولاً)" : fertig ? (progress.schriftlich?.[tk.id] ? " (مسلَّمة كتابياً — إنجاز لا نطق)" : " (مسلَّمة)") : ""}`}
                >
                  <KindIcon kind={tk.kind} className="dirb-mini-icon" />
                  <span className="dirb-mini-skill">
                    {gesperrt ? "🔒 " : fertig ? "✓ " : ""}
                    {SKILL_AR[tk.kind] ?? tk.kind}
                  </span>
                  <span className="dirb-mini-min"><span className="rtl-num">{tk.minutes}</span> دقيقة</span>
                </button>
              </div>
            );
          })}
        </div>
      </details>
      <p className="dirb-time-hint" data-testid="zeit-hinweis">هدف 90 دقيقة افتراضي للجلسة فقط؛ مجموع تقديرات الخطة مستقل عنه. احفظ التوقّف وعد لاحقاً؛ لن يتحوّل ما لم تسلّمه إلى فشل أو تعويض.</p>

      <SkillBalancePlan progress={progress} />
      {/* Pflege BSK — مسار مستقل لا يُحتسب في الخطة، لكنه ظاهر لمن اختاره */}
      <section className="card" data-testid="pflege-bsk-teaser" style={{ padding: "0.75rem 0.95rem", background: "linear-gradient(180deg, #FFFCF0, #FDF8E8)", borderInlineStart: "4px solid #22c55e", display: "grid", gap: "0.45rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontWeight: 900, color: "#0F2A44" }}>🩺 مسار التمريض BSK — اختياري</span>
          <span style={{ fontSize: "0.72rem", background: "rgb(34 197 94 / 0.12)", padding: "0.15rem 0.5rem", borderRadius: "999px", fontWeight: 800, color: "#15803d" }}>B2 Pflege</span>
        </div>
        <div style={{ fontSize: "0.82rem", lineHeight: 1.8, color: "var(--color-ink2)" }}>
          115 كلمة مهنية + 8 حوارات طوارئ (Visite/Übergabe) — يفتح في <b>تدرّب → ألمانية التمريض</b>. لا يدخل في الـ 378 يوماً ولا يُغيّر خطتك.
        </div>
      </section>
      <WiedereinstiegBanner progress={progress} minuten={totalMinutes} normaleMinuten={basePlan.tasks.reduce((a, t) => a + t.minutes, 0)} />

      <LernPfad progress={progress} />

      <div id="aufgabe-spieler" style={{ scrollMarginTop: "0.8rem" }}>
        <Klassenzimmer
          progress={progress}
          day={day}
          plan={plan}
          stepFrei={stepFrei}
          setStep={setStep}
          ritual={ritual}
          resultOf={resultOf}
          localOf={localOf}
          onPoints={onPoints}
          onKapselErgebnis={(sid, ok) => update((pr) => ({ ...pr, kapselStand: kapselVerbuche(pr.kapselStand, sid, day, ok) }))}
          submitCurrent={submitCurrent}
          doCloseDay={doCloseDay}
          badDayToday={badDayToday}
          confirmClose={confirmClose}
          setConfirmClose={setConfirmClose}
          unpassed={unpassed}
          allSubmitted={allSubmitted}
          onSrs={setSrs}
          showCurrentHero={false}
          onPauseSession={pauseAndSaveSession}
          modulGesperrt={modulGate.gesperrt}
          modulGesperrtNr={modulGate.wartendeModulNr}
          oeffneModulPruefung={oeffneModulPruefungJetzt}
        />
      </div>

      {zusatzUebungen.length > 0 && (
        <section className="card fadein" data-testid="today-zusatz" style={{ padding: "1rem 1.1rem", marginTop: "0.8rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.6rem", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontWeight: 900 }}>➕ تدريب إضافي من درس اليوم</div>
              <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)" }}>
                تمارين زائدة من موضوع القواعد نفسه — <span className="rtl-num">{zusatzUebungen.length}</span> تمرين، اختياري.
              </div>
            </div>
            <button
              type="button"
              className="btn btn-ghost"
              data-testid="today-zusatz-toggle"
              onClick={() => setZusatzOffen((o) => !o)}
              style={{ minHeight: "44px" }}
            >
              {zusatzOffen ? "إخفِ" : "افتح التدريب الإضافي"}
            </button>
          </div>
          {zusatzOffen && (
            <div style={{ marginTop: "0.7rem" }}>
              <ExerciseSet items={zusatzUebungen} onPoints={() => {}} />
            </div>
          )}
        </section>
      )}

      {/* ── R308: دمجٌ لا تشتّت — «تدرّب» و«اختبر» كاملتان هنا، مطويّتان افتراضيًا (K136) ── */}
      {/* نفس مكوّني الصفحتين الحقيقيين بلا نسخة موازية؛ لا حاجة لمغادرة «اليوم» لبلوغ أيّ محطة. */}
      {/* تركيبٌ كسولٌ فعلي (lazy + تركيب شرطي لا مجرّد إخفاء بصري): لا تُجلَب ولا تُركَّب حتى الفتح. */}
      <details
        className="dirb-extra"
        data-testid="today-ueben-eingebettet"
        onToggle={(e) => setUebenGeoeffnet((e.target as HTMLDetailsElement).open)}
      >
        <summary>
          <span>💪 تدرّب — كل محطّات التدريب هنا</span>
          <span className="dirb-extra-hint">بلا مغادرة صفحة اليوم</span>
        </summary>
        <div className="dirb-extra-content">
          {uebenGeoeffnet && (
            <FehlerGrenze>
              <Suspense fallback={<div role="status" aria-live="polite">⏳ يُحمَّل التدريب…</div>}>
                <UebenSeite />
              </Suspense>
            </FehlerGrenze>
          )}
        </div>
      </details>

      <details
        className="dirb-extra"
        data-testid="today-pruefen-eingebettet"
        onToggle={(e) => setPruefenGeoeffnet((e.target as HTMLDetailsElement).open)}
      >
        <summary>
          <span>🎯 اختبر — بوّابة الوحدة وكل محطّات الاختبار هنا</span>
          <span className="dirb-extra-hint">بلا مغادرة صفحة اليوم</span>
        </summary>
        <div className="dirb-extra-content">
          {pruefenGeoeffnet && (
            <FehlerGrenze>
              <Suspense fallback={<div role="status" aria-live="polite">⏳ يُحمَّل الاختبار…</div>}>
                <PruefenSeite />
              </Suspense>
            </FehlerGrenze>
          )}
        </div>
      </details>
    </div>
  );
}

function examCountdown(dateStr: string, name?: string): string {
  const target = new Date(`${dateStr}T00:00:00`).getTime();
  const days = Math.ceil((target - Date.now()) / 86400000);
  const label = name?.trim() ? ` — ${name.trim()}` : "";
  if (days > 1) return `${days} يوماً للامتحان${label}`;
  if (days === 1) return `غداً الامتحان!${label}`;
  if (days === 0) return `اليوم الامتحان!${label}`;
  return `انقضى موعد الامتحان${label}`;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ minWidth: "8rem" }}>
      <div className="rtl-num" style={{ fontSize: "1.7rem", fontWeight: 900, color: "var(--color-cola)" }}>
        {value}
      </div>
      <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)" }}>{label}</div>
    </div>
  );
}
