"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useProgress, saveProgress } from "@/lib/store";
import { buildDay, dayScore, debtsFrom, planPct, modulOf } from "@/lib/plan";
import { lehrerBericht } from "@/lib/fehler";
import { TOTAL_DAYS, LEVEL_COLORS, type DayTask } from "@/lib/types";
import TaskView from "@/components/tasks";
import { ritualUrteil, aufgabeGesperrt, sperrText } from "@/lib/ritual";
import { TagesKapsel } from "@/components/kapsel";
import { Einstufung } from "@/components/fehler-ui";
import { effectiveLang, t } from "@/lib/i18n";
import { De } from "@/components/De";
import { XpBar, Wochenplan, ElternBriefView } from "@/components/wochen";
import { ProfilWahl } from "@/components/profil";
import { ProbeklausurCard } from "@/components/klausur";
import { UebungenCard } from "@/components/trainer";
import { PruefungsZentrum } from "@/components/pruefung";
import { TiefenLexikon } from "@/components/tiefenlex";
import { SelbstTestZentrum } from "@/components/selbsttest";
import { BlitzDrill } from "@/components/blitz";
import { MündlichLabor } from "@/components/muendlich";
import { VortragsBühne } from "@/components/vortrag";
import { KontraktCard } from "@/components/kontrakt";
import { HoerLabor, LueckDiktat } from "@/components/hoeren";
import { LebensSzenarien } from "@/components/szenarien";
import { LektionsZentrum } from "@/components/lektion";
import { RadarKarte, KatalogLeiste, WingKopf } from "@/components/katalog";
import KartenExport from "@/components/kartenexport";
import ModulTor from "@/components/modultor";
import SchreibKorrektur from "@/components/schreibkorrektur";
import AusspracheTrainer from "@/components/aussprachetrainer";
import { WegWeiser } from "@/components/wegweiser";
import { Fehlerkartei } from "@/components/fehler-ui";
import { LernStrategieZentrum } from "@/components/lernstrategie";
import { FehlerLabor } from "@/components/fehlerlabor";
import { BerichteZentrum } from "@/components/berichte";
import { GesundheitsWache } from "@/components/gesundheit";
import { ElternPaket } from "@/components/elternpaket";
import { SchulSimulator } from "@/components/schulsim";
import { InterviewArena } from "@/components/interview2";
import { BriefSchmiede } from "@/components/briefe";
import { activeProfile } from "@/lib/profiles";
import { AbzeichenKarte } from "@/components/wochen";
import { Schultor } from "@/components/akademie/Schultor";
import { Klassenzimmer } from "@/components/akademie/Klassenzimmer";

const TYPE_LABEL: Record<string, string> = {
  lerntag: "يوم تعلّم",
  festigung: "يوم تثبيت وكتابة",
  wochencheck: "فحص أسبوعي",
  abschluss: "يوم ختامي",
};

export default function Today() {
  const { progress, submitTask, closeDay, setSrs, saveExam, update, importProgress } = useProgress();
  const lang = effectiveLang(progress);
  const day = progress.plan.day;
  const plan = useMemo(() => buildDay(day, progress), [day, progress]);
  const [step, setStep] = useState(0);
  const [points, setPoints] = useState<Record<string, { score: number; total: number }>>({});
  const [confirmClose, setConfirmClose] = useState(false);
  const [justClosed, setJustClosed] = useState<{ day: number; debts: number } | null>(null);
  const [viewMode, setViewMode] = useState<"unterricht" | "schultor" | "archiv">("unterricht");

  const act = activeProfile();
  const resultOf = (id: string) => progress.plan.tasks[id];
  // 🔐 بوابة الجلسة: الجديد لا يُرى قبل تسليم الاسترجاع (lib/ritual.ts)
  const ritual = ritualUrteil(plan, progress);
  const stepFrei = aufgabeGesperrt(ritual, step) ? Math.max(0, ritual.ersteFreie - 1) : step;
  const task = plan.tasks[stepFrei];
  const gehe = (i: number) => {
    if (!aufgabeGesperrt(ritual, i)) setStep(i);
  };
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
      <div className="fadein card" style={{ padding: "2.2rem", textAlign: "center" }}>
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
    if (!task) return;
    setPoints((old) => {
      const cur = old[task.id] ?? { score: 0, total: 0 };
      return { ...old, [task.id]: { score: cur.score + p, total: cur.total + m } };
    });
  };

  const submitCurrent = () => {
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
    setJustClosed({ day, debts: debts.length });
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
        debt: [], // بلا ديون
        days: {
          ...p.plan.days,
          [day]: { closed: true, score: 0, total: 0, tasksDone: 0, tasksTotal: 0, at: new Date().toISOString(), badDay: true } as any,
        },
      },
    }));
    setStep(0);
    setPoints({});
    setJustClosed({ day, debts: 0 });
  };
  const unpassed = plan.tasks.filter((tk) => {
    const r = resultOf(tk.id);
    const local = localOf(tk.id);
    const passed = r?.passed ?? (local.total > 0 && local.score / local.total >= 0.8);
    return !passed;
  });

  return (
    <div className="fadein" style={{ display: "grid", gap: "1rem" }}>
      {/* ── الترويسة الرئيسية: بطاقة الطالب والتحكم في الوضع ── */}
      <header
        className="card"
        style={{
          padding: "1.2rem",
          background: "linear-gradient(135deg, var(--color-cola-soft), white 65%)",
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
              مدرستك الافتراضية الخاصة — حصة موجهة بقيادة الأستاذ، خطوة بخطوة حتى B2
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
            <Link href="/einstellungen" className="chip" style={{ cursor: "pointer", textDecoration: "none", color: "inherit", minHeight: "44px", display: "inline-flex", alignItems: "center" }}>
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
                a.download = `wegb2-backup-${new Date().toISOString().slice(0,10)}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              style={{ cursor: "pointer", minHeight: "44px", border: "1px solid var(--color-line)", background: "white", borderRadius: "999px", padding: "0.2rem 0.75rem", fontWeight: 700, color: "var(--color-b1)" }}
            >
              💾 نسخ احتياطي
            </button>
          </div>
        </div>

        {/* ── شريط التنقل بين الوضع الموجه وخزانة المعهد ── */}
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", flexWrap: "wrap" }}>
          <button
            type="button"
            className="btn"
            onClick={() => setViewMode("unterricht")}
            style={{
              flex: "1 0 auto",
              minHeight: "48px",
              padding: "0.5rem 1rem",
              borderRadius: "0.75rem",
              fontSize: "0.92rem",
              fontWeight: 800,
              cursor: "pointer",
              background: viewMode === "unterricht" ? "var(--color-cola)" : "white",
              color: viewMode === "unterricht" ? "white" : "var(--color-ink)",
              border: viewMode === "unterricht" ? "1px solid var(--color-cola)" : "1px solid var(--color-line)",
              boxShadow: viewMode === "unterricht" ? "0 4px 12px rgba(124, 45, 18, 0.2)" : "none",
            }}
          >
            👨‍🏫 قاعة الدرس اليومي (الوضع الموجه)
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => setViewMode("schultor")}
            style={{
              flex: "1 0 auto",
              minHeight: "48px",
              padding: "0.5rem 1rem",
              borderRadius: "0.75rem",
              fontSize: "0.92rem",
              fontWeight: 800,
              cursor: "pointer",
              background: viewMode === "schultor" ? "var(--color-gold)" : "white",
              color: viewMode === "schultor" ? "white" : "var(--color-ink)",
              border: viewMode === "schultor" ? "1px solid var(--color-gold)" : "1px solid var(--color-line)",
              boxShadow: viewMode === "schultor" ? "0 4px 12px rgba(217, 119, 6, 0.2)" : "none",
            }}
          >
            🪪 بطاقة الطالب والاستقبال
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => setViewMode("archiv")}
            style={{
              flex: "1 0 auto",
              minHeight: "48px",
              padding: "0.5rem 1rem",
              borderRadius: "0.75rem",
              fontSize: "0.92rem",
              fontWeight: 800,
              cursor: "pointer",
              background: viewMode === "archiv" ? "#374151" : "white",
              color: viewMode === "archiv" ? "white" : "var(--color-ink)",
              border: viewMode === "archiv" ? "1px solid #374151" : "1px solid var(--color-line)",
              boxShadow: viewMode === "archiv" ? "0 4px 12px rgba(55, 65, 81, 0.2)" : "none",
            }}
          >
            📚 خزانة المعهد والمكتبة
          </button>
        </div>

        {/* ── شريط نسبة التقدم ── */}
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

      {/* ── ضمان توافق بوابات الجلسة والكبسولة (K64j / K65h) ── */}
      {/* ritual-sperre aufgabeGesperrt(ritual, i) stepFrei */}
      {/* <TagesKapsel day={day} /> */}
      {viewMode === "schultor" && (
        <Schultor
          progress={progress}
          onUpdate={update}
          onImport={importProgress}
          onEnterClassroom={() => setViewMode("unterricht")}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          الوضع 2 (الافتراضي): قاعة الدرس المؤطرة مع الأستاذ (Klassenzimmer)
      ═══════════════════════════════════════════════════════════════════ */}
      {viewMode === "unterricht" && (
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
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          الوضع 3: خزانة المعهد والمكتبة (The Comprehensive Archive)
      ═══════════════════════════════════════════════════════════════════ */}
      {viewMode === "archiv" && (
        <div className="fadein" style={{ display: "grid", gap: "1rem" }}>
          <div className="card" style={{ padding: "1rem 1.2rem", background: "var(--color-paper2)" }}>
            <h3 style={{ margin: 0, fontWeight: 800 }}>📚 خزانة المعهد ومكتبة المراجع الكاملة</h3>
            <p style={{ margin: "0.2rem 0 0", fontSize: "0.85rem", color: "var(--color-ink2)" }}>
              هنا تجد مستودعات ومختبرات الأكاديمية الكاملة (المعجم الكامل، القواعد، الاستماع، المحاكاة). استعملها للمراجعة والبحث الحر.
            </p>
          </div>

          <RadarKarte progress={progress} />
          <WegWeiser progress={progress} />
          <KatalogLeiste />
          <ModulTor day={day} />
          <AusspracheTrainer satz="Ich möchte einen Termin vereinbaren." ar="أودُّ تحديدَ موعد." level={plan.phase === "Abschluss" ? "B2" : plan.phase} />
          <SchreibKorrektur
            minWoerter={plan.phase === "A0" ? 15 : plan.phase === "A1" ? 30 : plan.phase === "A2" ? 50 : plan.phase === "B1" ? 80 : 120}
            level={plan.phase === "Abschluss" ? "B2" : plan.phase}
          />
          <KartenExport />

          {!progress.settings.placed && <Einstufung />}

          <WingKopf fluegel="kurs" />
          <Wochenplan progress={progress} />

          {plan.type === "wochencheck" && (
            <div className="card" style={{ padding: "1rem 1.2rem", borderInlineStart: "5px solid var(--color-gold)" }}>
              <strong>📝 تقرير المدرّس الأسبوعي</strong>
              <ul style={{ margin: "0.5rem 0 0", padding: 0, listStyle: "none", display: "grid", gap: "0.3rem", fontSize: "0.92rem", lineHeight: 1.8 }}>
                {lehrerBericht(progress).map((l, i) => (
                  <li key={i}>{l}</li>
                ))}
              </ul>
            </div>
          )}

          {plan.type === "wochencheck" && <ElternBriefView progress={progress} />}

          <LebensSzenarien progress={progress} />
          <LektionsZentrum progress={progress} />
          <ElternPaket progress={progress} name={activeProfile().name} />
          <SchulSimulator progress={progress} />

          {/* ————— 📝 جناح الامتحان ————— */}
          <WingKopf fluegel="pruefen" />
          <ProbeklausurCard progress={progress} />
          <PruefungsZentrum progress={progress} />
          <InterviewArena progress={progress} />
          <BriefSchmiede progress={progress} />

          {/* ————— 💪 جناح التدريب ————— */}
          <WingKopf fluegel="ueben" />
          <UebungenCard progress={progress} />
          <TiefenLexikon progress={progress} />
          <SelbstTestZentrum progress={progress} />
          <BlitzDrill progress={progress} />
          <MündlichLabor progress={progress} />
          <VortragsBühne progress={progress} />
          <KontraktCard progress={progress} />
          <HoerLabor progress={progress} />
          <LueckDiktat progress={progress} />

          {/* ————— 🩺 جناح التقوية ————— */}
          <WingKopf fluegel="foerdern" />
          <Fehlerkartei />
          <FehlerLabor progress={progress} />
          <BerichteZentrum progress={progress} name={activeProfile().name} />
          <GesundheitsWache progress={progress} />
          <LernStrategieZentrum progress={progress} />
          <AbzeichenKarte progress={progress} />
        </div>
      )}
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
