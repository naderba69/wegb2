"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useProgress, saveProgress, planeVerifikation } from "@/lib/store";
import { buildDay, dayScore, debtsFrom, modulOf } from "@/lib/plan";
import { TOTAL_DAYS } from "@/lib/types";
import { grammarMap } from "@/lib/content";
import { ritualUrteil, aufgabeGesperrt } from "@/lib/ritual";
import { KindIcon } from "@/components/dirb/icons";
import { Wochenplan } from "@/components/wochen";
import { ProfilWahl } from "@/components/profil";
import { Klassenzimmer } from "@/components/akademie/Klassenzimmer";

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

/** شاشة «اليوم»: مهمة واحدة في المقدمة؛ الأدوات والبدائل قابلة للفتح عند الحاجة. */
export default function Today() {
  const { progress, submitTask, closeDay, setSrs, saveExam, update } = useProgress();
  const day = progress.plan.day;
  const plan = useMemo(() => buildDay(day, progress), [day, progress]);
  const [step, setStep] = useState(0);
  const [points, setPoints] = useState<Record<string, { score: number; total: number }>>({});
  const [confirmClose, setConfirmClose] = useState(false);

  const resultOf = (id: string) => progress.plan.tasks[id];
  // 🔐 بوابة الجلسة: الجديد لا يُرى قبل تسليم الاسترجاع (lib/ritual.ts)
  const ritual = ritualUrteil(plan, progress);
  const stepFrei = aufgabeGesperrt(ritual, step) ? Math.max(0, ritual.ersteFreie - 1) : step;
  const localOf = (id: string) => points[id] ?? { score: 0, total: 0 };
  const totalMinutes = plan.tasks.reduce((acc, tk) => acc + tk.minutes, 0);

  // 🎯 هدف اليوم: المنجَز من المخطَّط (tempo) بالدقائق
  const doneMin = plan.tasks.reduce((acc, tk) => acc + (resultOf(tk.id) ? tk.minutes : 0), 0);
  const zielMin = plan.zielMin > 0 ? plan.zielMin : totalMinutes;
  const tagesPct = zielMin > 0 ? Math.min(100, Math.round((doneMin / zielMin) * 100)) : 0;
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
  const scrollToTraining = () => {
    document.getElementById("dirb-training")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const startToday = () => {
    if (allTodayDone) {
      document.getElementById("dirb-abschluss")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
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
              <li>واصل نحو C1: كتابة أكاديمية + Konjunktiv في النصوص الأدبية + محادثات طويلة.</li>
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
    setPoints((old) => {
      const cur = old[task.id] ?? { score: 0, total: 0 };
      return { ...old, [task.id]: { score: cur.score + p, total: cur.total + m } };
    });
  };

  const submitCurrent = () => {
    localStorage.removeItem("weg-abend"); // أوّلُ مهمّةٍ في اليومِ الجديدِ تُعيدُ قفلَ التدريب الحرّ
    const task = plan.tasks[stepFrei];
    if (!task) return;
    const local = localOf(task.id);
    // 🎯 إنجازُ تدريبِ درسٍ يجدول تحققَ استقلاله بعد 3 أيام (مهمة جديدة لا إعادة)
    if (task.topicId && (grammarMap[task.topicId]?.verify ?? []).length > 0 && !progress.verify?.[task.topicId]) {
      planeVerifikation(task.topicId, day);
    }
    submitTask(day, task.id, local.score, local.total, task.kind, undefined, task.verifyFor);
    // امتحان مرحلة/ختامي: سجّل النتيجة في كشوف Zeugnis
    if (task.exam && local.total > 0) {
      const pct = Math.round((local.score / local.total) * 100);
      saveExam(day, pct, pct >= 80);
    }
    if (step < plan.tasks.length - 1) setStep(step + 1);
  };

  const doCloseDay = () => {
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
    localStorage.setItem("weg-abend", "1"); // مساءُ ما بعدِ الإغلاق: بابُ «تدرّب» يُفتح
    setConfirmClose(false);
    setStep(0);
    setPoints({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const allSubmitted = plan.tasks.every((tk) => resultOf(tk.id) || localOf(tk.id).total > 0);

  /** 🧘 «يوم سيّئ»: تجميد السلسلة وعبور اليوم بلا ديون ولا عقاب (K-badDay) */
  const badDayToday = () => {
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
          [day]: { closed: true, score: 0, total: 0, tasksDone: 0, tasksTotal: 0, at: new Date().toISOString(), badDay: true } as never,
        },
      },
    }));
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
      <header className="dirb-hero-anim">
        <div className="dirb-date-row">
          <span className="dirb-date">{dateAr}</span>
          <span className="dirb-pill">اليوم الدراسي <span className="rtl-num">{day}</span> / <span className="rtl-num">{TOTAL_DAYS}</span></span>
        </div>
        <h1 className="dirb-giant">خطوتك اليوم</h1>
      </header>

      {held && (
        <section className="dirb-held dirb-hero-anim-2" aria-label="خطوتك التالية" data-testid="today-primary-step">
          <KindIcon kind={held.kind} className="dirb-held-icon" />
          <div className="dirb-held-skill">{SKILL_AR[held.kind] ?? held.kind}</div>
          <div className="dirb-held-ar">{held.titleAr}</div>
          <div className="dirb-held-lektion" lang="de" dir="ltr">{held.titleDe}</div>
          <div className="dirb-held-meta">
            ⏱ <span className="rtl-num">{held.minutes}</span> دقيقة · <span lang="de" dir="ltr">{plan.phase}</span>
          </div>
          <div className="dirb-held-grund">💡 {heldGrund}</div>
          {heldFertig && <div className="dirb-held-done">✓ أُنجزت هذه الخطوة</div>}
          <button type="button" className="dirb-start" onClick={startToday} data-testid="held-start">
            {allTodayDone ? "راجع نهاية اليوم" : heldBestanden ? "ابدأ الخطوة التالية" : heldFertig ? "حاول مرة أخرى" : "ابدأ الآن"}
            <span aria-hidden>←</span>
          </button>
        </section>
      )}

      <section className="dirb-tagesziel dirb-hero-anim-2" aria-label="هدف اليوم">
        <div className="dirb-tagesziel-top">
          <span className="dirb-tagesziel-title">هدف اليوم</span>
          <span className="dirb-tagesziel-min">
            <span className="rtl-num">{doneMin}</span> من <span className="rtl-num">{zielMin}</span> دقيقة
          </span>
        </div>
        <div className="dirb-bar" role="progressbar" aria-label="التقدم في هدف اليوم" aria-valuenow={tagesPct} aria-valuemin={0} aria-valuemax={100}>
          <div className="dirb-fill" style={{ width: `${Math.max(tagesPct, tagesPct > 0 ? 8 : 0)}%` }}>
            <span className="rtl-num">{tagesPct}%</span>
          </div>
        </div>
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
              <button
                key={tk.id}
                type="button"
                role="listitem"
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
            );
          })}
        </div>
      </details>
      <p className="dirb-time-hint" data-testid="zeit-hinweis">الأوقات تقديرية ومرنة؛ خذ استراحة أو تابع لاحقاً.</p>

      <Wochenplan progress={progress} />

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
          submitCurrent={submitCurrent}
          doCloseDay={doCloseDay}
          badDayToday={badDayToday}
          confirmClose={confirmClose}
          setConfirmClose={setConfirmClose}
          unpassed={unpassed}
          allSubmitted={allSubmitted}
          onSrs={setSrs}
          showCurrentHero={false}
        />
      </div>
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
