"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useProgress, saveProgress } from "@/lib/store";
import { buildDay, dayScore, debtsFrom, planPct, modulOf } from "@/lib/plan";
import { TOTAL_DAYS, LEVEL_COLORS } from "@/lib/types";
import { ritualUrteil, aufgabeGesperrt } from "@/lib/ritual";
import { Einstufung } from "@/components/fehler-ui";
import { effectiveLang, t } from "@/lib/i18n";
import { XpBar, Wochenplan } from "@/components/wochen";
import { ProfilWahl } from "@/components/profil";
import { activeProfile } from "@/lib/profiles";
import { Klassenzimmer } from "@/components/akademie/Klassenzimmer";

const TYPE_LABEL: Record<string, string> = {
  lerntag: "يوم تعلّم",
  festigung: "يوم تثبيت وكتابة",
  wochencheck: "فحص أسبوعي",
  abschluss: "يوم ختامي",
};

/**
 * 📅 شاشة «اليوم» — الطابور المتسلسل:
 * ترويسة (أين أنا؟) ← تهيئة إن لزمت ← جدول الأسبوع (مطويّ) ← Klassenzimmer
 * (بوابة الاسترجاع ← Stepper ← مراجعة الأخطاء ← إغلاق يدوي ← كبسولة المساء).
 * لا بطاقات خزانة ولا روابط قفز — كل شيء آخر في وجهاته (K100–K102).
 */
export default function Today() {
  const { progress, submitTask, closeDay, setSrs, saveExam, update } = useProgress();
  const lang = effectiveLang(progress);
  const day = progress.plan.day;
  const plan = useMemo(() => buildDay(day, progress), [day, progress]);
  const [step, setStep] = useState(0);
  const [points, setPoints] = useState<Record<string, { score: number; total: number }>>({});
  const [confirmClose, setConfirmClose] = useState(false);

  const act = activeProfile();
  const resultOf = (id: string) => progress.plan.tasks[id];
  // 🔐 بوابة الجلسة: الجديد لا يُرى قبل تسليم الاسترجاع (lib/ritual.ts)
  const ritual = ritualUrteil(plan, progress);
  const stepFrei = aufgabeGesperrt(ritual, step) ? Math.max(0, ritual.ersteFreie - 1) : step;
  const localOf = (id: string) => points[id] ?? { score: 0, total: 0 };
  const totalMinutes = plan.tasks.reduce((acc, tk) => acc + tk.minutes, 0);

  // ── نهاية الرحلة: اليوم 271 = الحصيلة النهائية ──
  if (day > TOTAL_DAYS) {
    const closedDays = Object.values(progress.plan.days);
    const totalScore = closedDays.reduce((a, d) => a + d.score, 0);
    const totalMax = closedDays.reduce((a, d) => a + d.total, 0);
    const avg = totalMax ? Math.round((totalScore / totalMax) * 100) : 0;
    const canDoCount = Object.keys(progress.canDo).length;
    return (
      <div className="today-screen fadein card" style={{ padding: "2.2rem", textAlign: "center" }}>
        <div style={{ fontSize: "3rem" }}>🎓</div>
        <h1 style={{ fontWeight: 900, fontSize: "1.7rem", color: "var(--color-cola)" }}>
          اكتملت الرحلة — 270 يوماً حتى B2!
        </h1>
        <p style={{ color: "var(--color-ink2)", margin: "0.8rem auto", maxWidth: "34rem", lineHeight: 1.9 }}>
          بدأتَ من اليوم الأول بلا ضياع، وأتممتَ كل يوم بإغلاقه. هذه حصيلتك العلمية:
        </p>
        <div style={{ display: "flex", gap: "1.2rem", justifyContent: "center", flexWrap: "wrap", margin: "1.2rem 0" }}>
          <Stat label="أيام مُغلقة" value={`${closedDays.length}/270`} />
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
        <div className="card" style={{ padding: "1.1rem", textAlign: "start", background: "var(--color-gold-soft)", marginTop: "1rem" }}>
          <strong>🧭 بعد B2 — خارطة الاستمرار:</strong>
          <ul style={{ paddingInlineStart: "1.2rem", lineHeight: 1.9, marginTop: "0.5rem" }}>
            <li>استمر بالتسميع اليومي (Shadowing) ونصوص B2 الثقيلة.</li>
            <li>خُض نموذج Goethe-Zertifikat B2 الرسمي كاملًا بتوقيت حقيقي.</li>
            <li>واصل نحو C1: كتابة أكاديمية + Konjunktiv في النصوص الأدبية + محادثات طويلة.</li>
            <li>ابدأ مسارًا جديدًا في أي وقت من الإعدادات (تصفير) — الخطة تتكرر بعينها حتمياً.</li>
          </ul>
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
    submitTask(day, task.id, local.score, local.total, task.kind);
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
    <div className="today-screen fadein" style={{ display: "grid", gap: "1rem" }} data-testid="today-screen">
      {/* ── الترويسة: أين أنا؟ (المستوى — الوحدة — الخطوة) ── */}
      <header
        className="card"
        style={{
          padding: "1.2rem",
          background: "linear-gradient(135deg, var(--color-cola-soft), var(--color-card) 65%)",
          border: "1px solid var(--color-line)",
          borderRadius: "1rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.5rem" }}>{act.emoji || "🎓"}</span>
              <div style={{ fontWeight: 900, fontSize: "1.25rem", color: "var(--color-cola)" }}>
                {t("appTitle", lang)}
              </div>
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)", marginTop: "0.15rem" }}>
              مدرستك الافتراضية الخاصة — خطوة بخطوة حتى B2
            </div>
            <div
              data-test="modul-etikett"
              style={{ marginTop: "0.35rem", fontSize: "0.88rem", fontWeight: 800, color: "var(--color-cola)" }}
            >
              {modulOf(day).etikett} · {modulOf(day).modul.titelAr}
              <span style={{ fontWeight: 500, color: "var(--color-ink2)" }}>
                {" "}({modulOf(day).schritt}/{modulOf(day).schritte}) — {modulOf(day).modul.inhalteAr}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", flexWrap: "wrap" }}>
            <span className="chip" style={{ borderColor: LEVEL_COLORS[plan.phase], color: LEVEL_COLORS[plan.phase], fontWeight: 800 }}>
              {plan.phase}
            </span>
            <span className="chip">{TYPE_LABEL[plan.type]}</span>
            <ProfilWahl />
            {progress.settings.examDate && (
              <span className="chip" style={{ borderColor: "var(--color-b2)", color: "var(--color-b2)", fontWeight: 700 }}>
                📅 {examCountdown(progress.settings.examDate, progress.settings.examName)}
              </span>
            )}
            <Link
              href="/drucken"
              className="chip"
              style={{ cursor: "pointer", textDecoration: "none", color: "inherit", minHeight: "44px", display: "inline-flex", alignItems: "center" }}
            >
              🖨 ورقةُ الشفرات
            </Link>
            <Link
              href="/einstellungen"
              className="chip"
              style={{ cursor: "pointer", textDecoration: "none", color: "inherit", minHeight: "44px", display: "inline-flex", alignItems: "center" }}
            >
              ⚙️
            </Link>
            <button
              type="button"
              className="chip"
              title="نسخ احتياطي فوري (JSON) — ينزّل ملفاً يحتوي على كل تقدّمك الآن"
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
              style={{ cursor: "pointer", minHeight: "44px", border: "1px solid var(--color-line)", background: "var(--color-card)", borderRadius: "999px", padding: "0.2rem 0.75rem", fontWeight: 700, color: "var(--color-b1)" }}
            >
              💾 نسخ احتياطي
            </button>
          </div>
        </div>

        {/* ── شريط حالة اليوم: كم متبقٍّ؟ ── */}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", marginTop: "0.9rem", marginBottom: "0.3rem" }}>
          <strong>
            اليوم <span className="rtl-num">{day}</span> من <span className="rtl-num">{TOTAL_DAYS}</span> · الأسبوع{" "}
            <span className="rtl-num">{plan.week}</span> · ⏱ <span className="rtl-num">{totalMinutes}</span> دقيقة
          </strong>
          <span className="rtl-num" style={{ color: "var(--color-ink2)", fontWeight: 700 }}>
            {planPct(progress)}%
          </span>
        </div>
        <div className="progressbar">
          <div style={{ width: `${planPct(progress)}%`, background: LEVEL_COLORS[plan.phase] }} />
        </div>
        <XpBar progress={progress} />
      </header>

      {/* ── تهيئة قبل الطابور: تحديد المستوى إن لم يُحدَّد بعد ── */}
      {!progress.settings.placed && <Einstufung />}

      {/* ── جدول الأسبوع (مطويّ — سطر واحد حتى يُفتح) ── */}
      <Wochenplan progress={progress} />

      {/* ── الطابور: بوابة + مهام + مراجعة الأخطاء + إغلاق يدوي + كبسولة المساء ── */}
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
      />
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
