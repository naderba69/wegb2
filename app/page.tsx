"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useProgress } from "@/lib/store";
import { buildDay, dayScore, debtsFrom, planPct, modulOf } from "@/lib/plan";
import { lehrerBericht } from "@/lib/fehler";
import { TOTAL_DAYS, LEVEL_COLORS, type DayTask } from "@/lib/types";
import TaskView from "@/components/tasks";
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

const TYPE_LABEL: Record<string, string> = {
  lerntag: "يوم تعلّم",
  festigung: "يوم تثبيت وكتابة",
  wochencheck: "فحص أسبوعي",
  abschluss: "يوم ختامي",
};

export default function Today() {
  const { progress, submitTask, closeDay, setSrs, saveExam } = useProgress();
  const lang = effectiveLang(progress);
  const day = progress.plan.day;
  const plan = useMemo(() => buildDay(day, progress), [day, progress]);
  const [step, setStep] = useState(0);
  const [points, setPoints] = useState<Record<string, { score: number; total: number }>>({});
  const [confirmClose, setConfirmClose] = useState(false);
  const [justClosed, setJustClosed] = useState<{ day: number; debts: number } | null>(null);

  const task = plan.tasks[step];
  const resultOf = (id: string) => progress.plan.tasks[id];
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
            <Stat label="امتحانات المراحل" value={`${Object.values(progress.exams ?? {}).filter((e) => e.passed).length}/${Object.keys(progress.exams ?? {}).length}`} />
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
  const unpassed = plan.tasks.filter((tk) => {
    const r = resultOf(tk.id);
    const local = localOf(tk.id);
    const passed = r?.passed ?? (local.total > 0 && local.score / local.total >= 0.8);
    return !passed;
  });

  return (
    <div className="fadein" style={{ display: "grid", gap: "1rem" }}>
      {/* ── الترويسة: الخلاصة فقط — لا قوائم ولا تشوّش ── */}
      <header
        className="card"
        style={{ padding: "1.1rem 1.3rem", background: "linear-gradient(135deg, var(--color-cola-soft), white 65%)" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: "1.25rem", color: "var(--color-cola)" }}>
              {t("appTitle", lang)}
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)" }}>
              خطة يومية مُحكَمة — بلا توهان، من اليوم 1 إلى اليوم {TOTAL_DAYS}
            </div>
            <div
              data-test="modul-etikett"
              style={{ marginTop: "0.3rem", fontSize: "0.86rem", fontWeight: 800, color: "var(--color-cola)" }}
            >
              {modulOf(day).etikett} · {modulOf(day).modul.titelAr}
              <span style={{ fontWeight: 500, color: "var(--color-ink2)" }}>
                {" "}({modulOf(day).schritt}/{modulOf(day).schritte}) — {modulOf(day).modul.inhalteAr}
              </span>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
            <span className="chip" style={{ borderColor: LEVEL_COLORS[plan.phase], color: LEVEL_COLORS[plan.phase] }}>
              {plan.phase}
            </span>
            <span className="chip">{TYPE_LABEL[plan.type]}</span>
            <ProfilWahl />
            {progress.settings.examDate && (
              <span className="chip" style={{ borderColor: "var(--color-b2)", color: "var(--color-b2)", fontWeight: 700 }}>
                📅 {examCountdown(progress.settings.examDate, progress.settings.examName)}
              </span>
            )}
            <Link href="/drucken" className="chip" style={{ cursor: "pointer", textDecoration: "none", color: "inherit", minHeight: "44px", display: "inline-flex", alignItems: "center" }}>
              🖨 ورقةُ الشفرات
            </Link>
            <Link href="/einstellungen" className="chip" style={{ cursor: "pointer", textDecoration: "none", color: "inherit" }}>
              ⚙️
            </Link>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", marginTop: "0.7rem", marginBottom: "0.3rem" }}>
          <strong>
            اليوم <span className="rtl-num">{day}</span> من <span className="rtl-num">{TOTAL_DAYS}</span> · الأسبوع{" "}
            <span className="rtl-num">{plan.week}</span> · ⏱ <span className="rtl-num">{totalMinutes}</span> دقيقة
          </strong>
          <span className="rtl-num" style={{ color: "var(--color-ink2)" }}>
            {planPct(progress)}%
          </span>
        </div>
        <div className="progressbar">
          <div style={{ width: `${planPct(progress)}%`, background: LEVEL_COLORS[plan.phase] }} />
        </div>
        <XpBar progress={progress} />
        <div style={{ fontSize: "0.78rem", color: "var(--color-ink2)", marginTop: "0.35rem" }}>
          🔒 الغد يُفتح فقط بإغلاق اليوم · ما لم يُتقَن يُرحَّل تعويضاً إلزامياً إلى الغد
        </div>
      </header>

      <RadarKarte progress={progress} />
      <WegWeiser progress={progress} />

      <KatalogLeiste />
      <ModulTor day={day} />
      <AusspracheTrainer satz="Ich möchte einen Termin vereinbaren." ar="أودُّ تحديدَ موعد." level={plan.phase === "Abschluss" ? "B2" : plan.phase} />
      <SchreibKorrektur minWoerter={plan.phase === "A1" ? 30 : plan.phase === "A2" ? 50 : plan.phase === "B1" ? 80 : 120} />
      <KartenExport />

      {!progress.settings.placed && <Einstufung />}

      {/* ————— 🎓 الجناح التعليمي: اليوم نفسه هو بطل هذا الجناح ————— */}
      <WingKopf fluegel="kurs" />

      <Wochenplan progress={progress} />

      {justClosed && justClosed.day === day - 1 && (
        <div className="card fadein" style={{ padding: "0.9rem 1.1rem", background: "var(--color-gold-soft)", fontWeight: 700 }}>
          🎉 أُغلق يوم {justClosed.day} بنجاح!{" "}
          {justClosed.debts > 0
            ? `تمّ رفع ${justClosed.debts} من المهام تعويضاً إلزامياً إلى اليوم — أنجزها أولاً.`
            : "كل المهام أُتقنت ≥80% — لا تعويضات."}
        </div>
      )}

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

      {progress.plan.debt.length > 0 && plan.tasks.some((tk) => tk.mandatory) && (
        <div className="card" style={{ padding: "0.8rem 1.1rem", borderInlineStart: "5px solid var(--color-cola)" }}>
          <strong>📥 تعويضات اليوم ({progress.plan.debt.length})</strong>
          <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)" }}>
            مهمة اليوم الأول/الثانية تحمل ما لم يُنجز سابقاً — نفّذها قبل الجديد.
          </div>
        </div>
      )}

      {/* ── شريط مهام اليوم ── */}
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
        {plan.tasks.map((tk, i) => {
          const r = resultOf(tk.id);
          const passed = r?.passed;
          return (
            <button
              key={tk.id}
              className="chip"
              style={{
                cursor: "pointer",
                background: i === step ? "var(--color-cola)" : passed ? "var(--color-a1)" : "white",
                color: i === step || passed ? "white" : undefined,
              }}
              onClick={() => setStep(i)}
            >
              {passed ? "✓" : i + 1}. {kindIcon(tk.kind)}
            </button>
          );
        })}
      </div>

      {task && (
        <>
          <div className="card" style={{ padding: "0.7rem 1.1rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
            <div>
              <strong>
                المهمة {step + 1}/{plan.tasks.length}: <De>{task.titleDe}</De>
              </strong>
              <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)" }}>
                {task.titleAr} · ⏱ {task.minutes} دقيقة
                {task.mandatory && " · تعويض إلزامي"}
              </div>
            </div>
            {resultOf(task.id)?.passed && <span className="chip" style={{ color: "var(--color-a1)", borderColor: "var(--color-a1)" }}>مُتقَنة ≥80%</span>}
          </div>

          <TaskView
            key={`${task.id}-${step}-${resultOf(task.id)?.attempts ?? 0}`}
            task={task}
            lang={lang}
            day={day}
            srs={progress.srs}
            onSrs={setSrs}
            onPoints={onPoints}
            voiceName={progress.settings.voiceName}
            rate={progress.settings.rate}
          />

          <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", flexWrap: "wrap" }}>
            <button className="btn btn-ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
              ← السابق
            </button>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {!resultOf(task.id) ? (
                <button className="btn btn-primary" onClick={submitCurrent}>
                  سلّم المهمة ({(localOf(task.id).score)} / {Math.max(localOf(task.id).total, 1)}) ✓
                </button>
              ) : (
                <span className="chip" style={{ padding: "0.5rem 0.9rem" }}>
                  النتيجة: <span className="rtl-num">{resultOf(task.id).score}</span>/
                  <span className="rtl-num">{resultOf(task.id).total}</span>{" "}
                  {resultOf(task.id).passed ? "ناجحة ✅" : "ستُرحَّل تعويضاً ⚠️"}
                </span>
              )}
              {step < plan.tasks.length - 1 && (
                <button className="btn btn-ghost" onClick={() => setStep((s) => s + 1)}>
                  التالي ←
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── بوابة إغلاق اليوم ── */}
      <div className="card" style={{ padding: "1.1rem 1.3rem", textAlign: "center" }}>
        {!confirmClose ? (
          <>
            <strong>🛑 إنهاء اليوم</strong>
            <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)", margin: "0.4rem 0 0.7rem" }}>
              {allSubmitted
                ? "كل المهام مُسلَّمة. أغلق اليوم لفتح الغد."
                : `لم تُسلَّم كل المهام بعد (${plan.tasks.length - plan.tasks.filter((tk) => resultOf(tk.id)).length} متبقية).`}
            </div>
            <button className="btn btn-gold" onClick={() => setConfirmClose(true)}>
              إنهاء اليوم والانتقال إلى الغد ←
            </button>
          </>
        ) : (
          <>
            <strong>تأكيد الإغلاق</strong>
            <div style={{ margin: "0.6rem 0", lineHeight: 1.8 }}>
              {unpassed.length === 0 ? (
                <>✨ أتقنت كل المهام (≥80%) — لا تعويضات. الغد محتواه الجديد فقط.</>
              ) : (
                <>⚠️ <strong>{unpassed.length}</strong> من المهام لم تُتقَن — ستُرحَّل <strong>إلزامية</strong> إلى أول الغد:</>
              )}
              <ul style={{ listStyle: "none", padding: 0, margin: "0.5rem 0", fontSize: "0.88rem" }}>
                {unpassed.map((tk) => (
                  <li key={tk.id}>• {tk.titleAr}</li>
                ))}
              </ul>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
              <button className="btn btn-gold" onClick={doCloseDay}>
                نعم، أغلق وارفع التعويضات
              </button>
              <button className="btn btn-ghost" onClick={() => setConfirmClose(false)}>
                لا، أريد إتقانها أولاً
              </button>
            </div>
          </>
        )}
      </div>

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

function kindIcon(kind: DayTask["kind"]) {
  switch (kind) {
    case "wiederholen":
      return "🔁";
    case "grammatik":
      return "📘";
    case "wortschatz":
      return "🃏";
    case "hoeren":
      return "🎧";
    case "lesen":
      return "📖";
    case "schreiben":
      return "✍️";
    case "sprechen":
      return "🗣️";
    default:
      return "✅";
  }
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
