"use client";
import { useState } from "react";
import { FehlerRevue } from "./FehlerRevue";
import { loadProgress, saveProgress } from "@/lib/store";
import { effektiveRate } from "@/lib/rate";
import {
  type DayPlan,
  type DayTask,
  type Progress,
  type TaskResult,
  type SrsState,
  LEVEL_COLORS,
} from "@/lib/types";
import { grammarMap, getDeck } from "@/lib/content";
import TaskView from "@/components/tasks";
import { TagesKapsel } from "@/components/kapsel";
import { stationOfTask, STATIONEN } from "@/components/stationen";
import { kapselSaetzeAbend } from "@/lib/kapsel";
import { speakDe } from "@/lib/speech";
import { aufgabeGesperrt, sperrText, type RitualUrteil } from "@/lib/ritual";
import { De } from "@/components/De";
import { KindIcon } from "@/components/dirb/icons";

interface KlassenzimmerProps {
  progress: Progress;
  day: number;
  plan: DayPlan;
  stepFrei: number;
  setStep: (i: number) => void;
  ritual: RitualUrteil;
  resultOf: (id: string) => TaskResult | undefined;
  localOf: (id: string) => { score: number; total: number };
  onPoints: (p: number, m: number) => void;
  /** نتيجة استرجاع كبسولة (M1) تُحجز في فواصل المتعلم. */
  onKapselErgebnis?: (satzId: string, ok: boolean) => void;
  submitCurrent: () => void;
  doCloseDay: () => void;
  badDayToday?: () => void;
  confirmClose: boolean;
  setConfirmClose: (b: boolean) => void;
  unpassed: DayTask[];
  allSubmitted: boolean;
  onSrs: (id: string, state: SrsState) => void;
  /** إيقاف مؤقّت الجلسة وحفظ الوقت المقاس قبل حفظ موضع المهمة. */
  onPauseSession?: () => void;
  /** في شاشة اليوم توجد بطاقة خطوة رئيسية أعلى الصفحة، فلا نكررها داخل المشغّل. */
  showCurrentHero?: boolean;
}

const KIND_AR: Record<string, string> = {
  wiederholen: "استرجاع",
  grammatik: "قواعد",
  wortschatz: "مفردات",
  hoeren: "استماع",
  lesen: "قراءة",
  schreiben: "كتابة",
  sprechen: "تحدّث",
  aussprache: "نطق",
  check: "فحص",
};

function scrollNach(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * مشغّل اليوم: بطاقة المهمة تظهر مرة واحدة فقط في مقدمة الشاشة؛ ويمكن إخفاؤها
 * هنا عند عرض بطاقة خارجية. البدائل قابلة للفتح، والتدريب والتسليم والمراجعة والإغلاق باقية.
 * البيداغوجيا محفوظة: الاسترجاع قبل الجديد، مهمة واحدة في كل مرة، والاستقلال بدليل جديد مؤجل.
 */
export function Klassenzimmer({
  progress,
  day,
  plan,
  stepFrei,
  setStep,
  ritual,
  resultOf,
  localOf,
  onPoints,
  onKapselErgebnis,
  submitCurrent,
  doCloseDay,
  badDayToday,
  confirmClose,
  setConfirmClose,
  unpassed,
  allSubmitted,
  onSrs,
  onPauseSession,
  showCurrentHero = true,
}: KlassenzimmerProps) {
  const voiceName = progress.settings.voiceName;
  const rate = effektiveRate(progress); // M7/R287: Auto-Tempo nach Niveau, manuelle Wahl bleibt
  const lang = progress.settings.uiLang === "auto" ? "ar" : progress.settings.uiLang;
  const [pauseSaved, setPauseSaved] = useState(false);
  // 🎬 R187/U1: وضع الجلسة المتسلسلة — مهمّة ← تسليم ← التالية بزرٍّ واحد، وحرية الرقائق باقية
  const [spieler, setSpieler] = useState(true);
  const savePause = () => {
    onPauseSession?.();
    try { localStorage.setItem(`wegb2:day-step:${day}`, String(stepFrei)); } catch { /* قد يكون التخزين محظوراً */ }
    // Read the latest persisted state; the timer callback may have just recorded minutes.
    saveProgress(loadProgress());
    setPauseSaved(true);
  };

  // المهمة الحالية في المقدّمة + التاليتان
  const currentTask = plan.tasks[stepFrei];
  const naechste = plan.tasks
    .map((tk, i) => ({ tk, i }))
    .filter(({ i }) => i > stepFrei)
    .slice(0, 2);
  const zuvor = naechste.length === 0 && stepFrei > 0
    ? plan.tasks.map((tk, i) => ({ tk, i })).filter(({ i }) => i < stepFrei).slice(-2)
    : [];
  const miniListe = naechste.length > 0 ? naechste : zuvor;

  // 🔥 إحماء الصباح: كبسولة مساء الأمس (3 جمل من دروس الأمس قُرِئت قبل النوم)
  const warmupSaetze = day > 1 ? kapselSaetzeAbend(day - 1) : [];

  const fertig = plan.tasks.length > 0 && plan.tasks.every((tk) => resultOf(tk.id));
  // 🎬 U1: حسابات شريط المشغّل — من نتائج الخطة ودقائقها المخططة لا من ادّعاء
  const erledigtZahl = plan.tasks.filter((tk) => resultOf(tk.id)).length;
  const naechsteOffene = plan.tasks.findIndex((tk, i) => i > stepFrei && !resultOf(tk.id) && !aufgabeGesperrt(ritual, i));
  const naechsteOffeneGesamt = naechsteOffene >= 0 ? naechsteOffene : plan.tasks.findIndex((tk, i) => i !== stepFrei && !resultOf(tk.id) && !aufgabeGesperrt(ritual, i));
  const restMinuten = plan.tasks.filter((tk) => !resultOf(tk.id)).reduce((s, tk) => s + tk.minutes, 0);
  // 🧭 تقطيع اليوم محطاتٍ قصيرة (R196): موقع المهمة الحالية داخل محطّتها الستّ
  const stationJetzt = currentTask ? stationOfTask(currentTask) : null;
  const stationAlle = stationJetzt ? plan.tasks.filter((tk) => stationOfTask(tk) === stationJetzt) : [];
  const stationFertig = stationAlle.filter((tk) => resultOf(tk.id)).length;
  const kicker = !currentTask
    ? "🎉 لا مهامَّ اليوم"
    : fertig
      ? "🎉 أتممتَ مهامَّ اليوم"
      : currentTask.mandatory
        ? "📌 تعويض إلزامي أوّلاً"
        : currentTask.kind === "wiederholen"
          ? "🔁 الاسترجاع قبل الجديد"
          : "▶ مهمّتك الآن";

  const startAktion = () => {
    if (fertig) return scrollNach("dirb-abschluss");
    if (currentTask && resultOf(currentTask.id)?.passed) {
      const nxt = plan.tasks.findIndex((tk, i) => i > stepFrei && !resultOf(tk.id)?.passed);
      if (nxt >= 0 && !aufgabeGesperrt(ritual, nxt)) setStep(nxt);
    }
    scrollNach("dirb-training");
  };

  // 🎯 أهداف اليوم الثلاثة — مشتقّة من مهام الخطة نفسها
  const gramTask = plan.tasks.find((t) => t.kind === "grammatik" && t.topicId);
  const gramTitel = gramTask?.topicId ? grammarMap[gramTask.topicId]?.titleAr : undefined;
  const vokTask = plan.tasks.find((t) => t.kind === "wortschatz" && t.deckId);
  const vokZahl = vokTask?.deckId ? getDeck(vokTask.deckId)?.cards.length : undefined;
  const fertigkeiten = plan.tasks
    .map((t) => t.kind)
    .filter((k) => k === "hoeren" || k === "lesen" || k === "schreiben" || k === "sprechen" || k === "aussprache")
    .filter((k, i, arr) => arr.indexOf(k) === i)
    .map((k) => KIND_AR[k]);

  return (
    <div className="fadein" style={{ display: "grid", gap: "0.9rem" }}>
      {/* ── 🔐 لافتة بوابة الجلسة (تسمّي المطلوب لا «ممنوع» مبهمة) ── */}
      {ritual.gesperrt && (
        <div className="dirb-lock dirb-hero-anim-3" data-testid="ritual-sperre">
          🔐 <strong>{sperrText(ritual)}</strong>
          <small>الاسترجاعُ قبل الجديد — سلّم مهمّة الاسترجاع أولاً لتنفتح باقي المهام.</small>
        </div>
      )}

      {/* ── 🔁 R182/M2: زمن الافتتاحية الاسترجاعية معلَن دائمًا ── */}
      {day > 1 && ritual.torMinuten > 0 && (
        <p className="tiny muted" data-testid="abruf-eroeffnung" style={{ margin: 0 }}>
          🔁 يُفتتح يومك باسترجاعٍ قبل أيّ جديد: نحو <strong>{ritual.torMinuten} دقيقة</strong> مخططة
          {ritual.grund === "wochencheck" ? " (امتحان الأسبوع نفسه + استرجاع)" : ""} — الاسترجاع أولًا دائمًا.
        </p>
      )}

      {/* ── 🦸 البطل: مهمّتك الآن ── */}
      {showCurrentHero && currentTask && (
        <section className="dirb-hero dirb-hero-anim-3" aria-label="مهمتك الآن">
          <div className="dirb-hero-kicker">{kicker}</div>
          <KindIcon kind={currentTask.kind} className="dirb-hero-icon" />
          <h2 className="dirb-hero-title">
            <De>{currentTask.titleDe}</De>
          </h2>
          <div className="dirb-hero-sub">{currentTask.titleAr}</div>
          <div className="dirb-hero-meta">
            ⏱ <span className="rtl-num">{currentTask.minutes}</span> دقيقة ·{" "}
            <span style={{ color: LEVEL_COLORS[plan.phase], fontWeight: 800 }}>{plan.phase}</span> · {KIND_AR[currentTask.kind] ?? currentTask.kind}
            {resultOf(currentTask.id)?.passed ? " · ✓ مُتقَنة" : ""}
          </div>
          <button type="button" className="dirb-start" onClick={startAktion}>
            {fertig ? "أنهِ اليوم" : resultOf(currentTask.id) ? "تابِع المهمة" : "ابدأ المهمة"} <span aria-hidden>←</span>
          </button>
          <div className="dirb-dots" aria-hidden>
            {plan.tasks.map((tk, i) => (
              <span
                key={tk.id}
                className={
                  "dirb-dot" + (resultOf(tk.id) ? " dirb-dot-done" : i === stepFrei ? " dirb-dot-now" : "")
                }
              />
            ))}
          </div>
        </section>
      )}

      {/* ── ⏭ التالي في الطابور ── */}
      {miniListe.length > 0 && (
        <details className="dirb-next-details" data-testid="next-task-details">
          <summary>عرض المهام التالية <span className="rtl-num">({miniListe.length})</span></summary>
          <div className="dirb-mini-grid dirb-hero-anim-3">
          {miniListe.map(({ tk, i }) => {
            const zu = aufgabeGesperrt(ritual, i);
            const passed = resultOf(tk.id)?.passed;
            return (
              <button
                key={tk.id}
                type="button"
                className="dirb-mini"
                disabled={zu}
                title={zu ? sperrText(ritual) : tk.titleAr}
                onClick={() => {
                  if (!aufgabeGesperrt(ritual, i)) {
                    setStep(i);
                    scrollNach("dirb-training");
                  }
                }}
              >
                <span className="dirb-mini-top">
                  <span className="dirb-mini-title">
                    <De>{tk.titleDe}</De>
                  </span>
                  {zu ? (
                    <span className="dirb-mini-lock" aria-hidden>🔒</span>
                  ) : (
                    <KindIcon kind={tk.kind} className="dirb-mini-icon" />
                  )}
                </span>
                <span className="dirb-mini-min">
                  {passed ? "✓ مُتقَنة · " : ""}<span className="rtl-num">{tk.minutes}</span> د · {KIND_AR[tk.kind] ?? tk.kind}
                </span>
                <span className="dirb-mini-sub">{tk.titleAr}</span>
              </button>
            );
          })}
          </div>
        </details>
      )}

      {/* ── 🔥 إحماء الاسترجاع: يظهر مع مهمّة الاسترجاع فقط ── */}
      {currentTask?.kind === "wiederholen" && warmupSaetze.length > 0 && (
        <details className="dirb-details">
          <summary>🔥 إحماء: جمل مساء الأمس — استمع واستحضر قبل أن تُسترجَع</summary>
          <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.6rem" }}>
            {warmupSaetze.map((s) => (
              <div
                key={s.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.6rem",
                  background: "var(--color-paper2)",
                  padding: "0.55rem 0.85rem",
                  borderRadius: "0.6rem",
                  border: "1px solid var(--color-line)",
                }}
              >
                <div>
                  <De style={{ fontWeight: 800, fontSize: "0.95rem" }}>{s.de}</De>
                  <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)" }}>{s.ar}</div>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => speakDe(s.de, { voiceName, rate })}
                  style={{ minHeight: "44px", minWidth: "44px", padding: 0 }}
                  aria-label="استمع"
                >
                  🔊
                </button>
              </div>
            ))}
          </div>
        </details>
      )}

      {/* ── ✍️ التدريب المركّز: مهمّة واحدة + رقائق الطابور ── */}
      <section id="dirb-training" className="dirb-training" aria-label="التدريب المركز">
        <div className="dirb-training-head">
          <span className="dirb-training-title">✍️ التدريب المركّز</span>
          <span className="dirb-training-count">
            المهمة {stepFrei + 1}/{plan.tasks.length}
          </span>
          <button
            type="button"
            className="chip"
            data-testid="sitzung-modus"
            aria-pressed={spieler}
            onClick={() => setSpieler((s) => !s)}
            style={{ minHeight: "40px", cursor: "pointer", fontWeight: 800 }}
          >
            {spieler ? "🎬 وضع الجلسة: يعمل" : "🎬 وضع الجلسة المتسلسلة"}
          </button>
        </div>

        {/* ── 🎬 R187/U1: شريط المشغّل المتسلسل — مهمّة ‹ تسليم ‹ التالية ── */}
        {spieler && (
          <div className="dirb-hero-anim-2" data-testid="sitzung-spieler" style={{ display: "grid", gap: "0.45rem", marginBottom: "0.6rem" }}>
            <div style={{ fontSize: "0.92rem" }}>
              🎬 <strong>جلسة اليوم متسلسلة:</strong> أنجزت <span className="rtl-num">{erledigtZahl}</span> من{" "}
              <span className="rtl-num">{plan.tasks.length}</span> مهام
              {restMinuten > 0 && <> · متبقٍّ مخططًا نحو <span className="rtl-num">{restMinuten}</span> دقيقة</>}
              {" "}· اختر أيّ رقاقة متى شئت — التسلسل لا يلغي حريتك.
            </div>
            {stationJetzt && (
              <div data-testid="sitzung-station" style={{ fontSize: "0.85rem", fontWeight: 700 }}>
                {STATIONEN[stationJetzt].icon} محطّة «{STATIONEN[stationJetzt].ar}»: أنجزتَ {stationFertig} من {stationAlle.length} — يومُك ستُّ محطاتٍ قصيرة لا كتلةً واحدة
              </div>
            )}
            <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }} data-testid="sitzung-fortschritt" role="list" aria-label="تقدّم مهام اليوم">
              {plan.tasks.map((tk, i) => {
                const r = resultOf(tk.id);
                const jetzt = i === stepFrei;
                return (
                  <span
                    key={tk.id}
                    role="listitem"
                    title={`${i + 1}. ${tk.titleAr}${r ? " — مُسلَّمة" : jetzt ? " — الحالية" : ""}`}
                    aria-label={`المهمة ${i + 1}${r ? " مُسلَّمة" : jetzt ? " الحالية" : ""}`}
                    style={{
                      width: "30px", height: "30px", borderRadius: "50%",
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.72rem", fontWeight: 800,
                      border: jetzt ? "3px solid var(--color-gold)" : "1px solid var(--color-line)",
                      background: r ? "var(--color-a1)" : jetzt ? "var(--color-cola)" : "transparent",
                      color: r || jetzt ? "var(--ui-on-accent)" : "var(--color-ink2)",
                    }}
                  >
                    {r ? "✓" : i + 1}
                  </span>
                );
              })}
            </div>
            {currentTask && resultOf(currentTask.id) && naechsteOffeneGesamt >= 0 && (
              <button
                type="button"
                className="btn btn-primary"
                data-testid="sitzung-weiter"
                style={{ minHeight: "52px", fontWeight: 900 }}
                onClick={() => { setStep(naechsteOffeneGesamt); scrollNach("dirb-training"); }}
              >
                ▶ المهمة التالية: {plan.tasks[naechsteOffeneGesamt].titleAr}
              </button>
            )}
            {currentTask && resultOf(currentTask.id) && naechsteOffeneGesamt < 0 && (
              <div data-testid="sitzung-fertig" style={{ fontWeight: 800 }}>
                🏁 لا مهام مفتوحة بعد في هذا اليوم — الجلسة مكتملة، وزرّ إغلاق اليوم في الأسفل حين تريد.
              </div>
            )}
          </div>
        )}

        {/* ── رقائق مهام اليوم: مطوية في وضع الجلسة المركّز، مفتوحة في الوضع الحرّ (R194) ── */}
        <details key={spieler ? "sitzung" : "frei"} data-testid="aufgaben-details" {...(spieler ? {} : { open: true })}>
          <summary style={{ cursor: "pointer", fontWeight: 700, minHeight: "44px", display: "flex", alignItems: "center" }}>
            🗂️ مهام اليوم ({plan.tasks.length}) — اختر أيّ مهمة بحرّية متى شئت
          </summary>
        <div className="dirb-chiprow" role="list" aria-label="مهام اليوم" style={{ marginTop: "0.4rem" }}>
          {plan.tasks.map((tk, i) => {
            const r = resultOf(tk.id);
            const passed = r?.passed;
            const zu = aufgabeGesperrt(ritual, i);
            return (
              <button
                key={tk.id}
                className="chip"
                data-testid={`aufgabe-chip-${i}`}
                aria-disabled={zu}
                title={zu ? sperrText(ritual) : undefined}
                style={{
                  cursor: zu ? "not-allowed" : "pointer",
                  opacity: zu ? 0.55 : 1,
                  minHeight: "46px",
                  flex: "0 0 auto",
                  background: i === stepFrei ? "var(--color-cola)" : passed ? "var(--color-a1)" : undefined,
                  color: i === stepFrei || passed ? "var(--ui-on-accent)" : undefined,
                  fontWeight: 700,
                }}
                onClick={() => {
                  if (!aufgabeGesperrt(ritual, i)) setStep(i);
                }}
              >
                {zu ? "🔒" : passed ? "✓" : i + 1}. {tk.titleAr.split(" ")[0]}
              </button>
            );
          })}
        </div>
        </details>

        {currentTask && (
          <div style={{ display: "grid", gap: "0.8rem" }}>
            <div className="dirb-taskhead">
              <strong>
                المهمة {stepFrei + 1}/{plan.tasks.length}: <De>{currentTask.titleDe}</De>
              </strong>
              <div>
                <small>
                  {currentTask.titleAr} · ⏱ <span className="rtl-num">{currentTask.minutes}</span> دقيقة
                  {currentTask.mandatory && " · تعويض إلزامي"}
                </small>
              </div>
            </div>

            {/* عارض التمرين التفاعلي */}
            <TaskView
              key={`${currentTask.id}-${stepFrei}-${resultOf(currentTask.id)?.attempts ?? 0}`}
              task={currentTask}
              lang={lang}
              day={day}
              srs={progress.srs}
              onSrs={onSrs}
              onPoints={onPoints}
              voiceName={voiceName}
              rate={rate}
              tempo={progress.settings.tempo}
              persistKey={`wegb2:partial:${currentTask.id}`}
              onKapselErgebnis={onKapselErgebnis}
            />

            <div className="dirb-actions">
              <button
                type="button"
                className="btn btn-ghost"
                disabled={stepFrei === 0}
                onClick={() => setStep(Math.max(0, stepFrei - 1))}
                style={{ minHeight: "48px" }}
              >
                ← السابقة
              </button>
              {!resultOf(currentTask.id) ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={submitCurrent}
                  style={{ minHeight: "48px", padding: "0.6rem 1.4rem", fontWeight: 800 }}
                >
                  سلّم المهمة ({localOf(currentTask.id).score} / {Math.max(localOf(currentTask.id).total, 1)}) ✓
                </button>
              ) : (
                <span className="dirb-score">
                  النتيجة: <span className="rtl-num">{resultOf(currentTask.id)?.score} / {resultOf(currentTask.id)?.total}</span>
                  {" "}{resultOf(currentTask.id)?.passed ? "ناجحة ✅" : "ستُرحَّل تعويضاً ⚠️"}
                </span>
              )}
              {stepFrei < plan.tasks.length - 1 ? (
                <button
                  type="button"
                  className="btn btn-ghost"
                  disabled={aufgabeGesperrt(ritual, stepFrei + 1)}
                  title={aufgabeGesperrt(ritual, stepFrei + 1) ? sperrText(ritual) : undefined}
                  onClick={() => {
                    if (!aufgabeGesperrt(ritual, stepFrei + 1)) setStep(stepFrei + 1);
                  }}
                  data-testid="aufgabe-weiter"
                  style={{ minHeight: "48px" }}
                >
                  {aufgabeGesperrt(ritual, stepFrei + 1) ? "🔒 التالي" : "التالية ←"}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-gold"
                  onClick={() => scrollNach("dirb-abschluss")}
                  style={{ minHeight: "48px" }}
                >
                  إلى ختام اليوم ←
                </button>
              )}
            </div>
          </div>
        )}
      </section>

      <section className="card" data-testid="pause-session-panel" style={{ padding: "0.7rem 0.9rem", display: "grid", gap: "0.35rem" }}>
        <button type="button" className="btn btn-ghost" data-testid="pause-and-save" onClick={savePause} style={{ minHeight: "46px" }}>
          ⏸ احفظ التوقّف وتابع لاحقاً
        </button>
        <small style={{ color: "var(--color-ink2)", lineHeight: 1.8 }}>
          يحفظ هذا الزرّ تقدّم المهام المُسلَّمة وموضعك الحالي. تبقى المدخلات التي يدعم نوع المهمة حفظها محلياً مسودّاتٍ إلى أن تسلّمها؛ لا يلزم إكمال القائمة الآن.
          التوقّف لا يغلق اليوم ولا ينشئ فشلاً أو تعويضاً.
        </small>
        {pauseSaved && <div role="status" aria-live="polite" data-testid="pause-saved-message" style={{ fontWeight: 700, color: "var(--color-a1)" }}>
          ✅ حُفظ موضع اليوم والتقدّم المُسلَّم. {!currentTask
            ? "لا توجد مهمة حالية في هذا العرض؛ اليوم ما زال مفتوحاً."
            : !resultOf(currentTask.id)
              ? "المهمة الحالية غير مُسلَّمة، لذلك لا تُسجَّل لها نتيجة؛ يمكنك استكمالها من الموضع نفسه لاحقاً."
              : "المهمة الحالية مُسلَّمة؛ اليوم ما زال مفتوحاً."}
        </div>}
      </section>

      {/* ── 🎯 أهداف اليوم الثلاثة (مطوية — لا تزاحم العمل) ── */}
      <details className="dirb-details">
        <summary>🎯 أهداف اليوم الثلاثة — ماذا سأتقن قبل النوم؟</summary>
        <ol className="dirb-goals">
          <li>
            <strong>المفردات:</strong> {vokZahl ? <>إتقان <span className="rtl-num">{vokZahl}</span> مفردة بأدواتها وجمَلها</> : "مراجعة المفردات وتثبيتها"} — الكلمة تُحفَظ في جملة لا عارية.
          </li>
          <li>
            <strong>القاعدة:</strong> {gramTitel ? <>فهم «{gramTitel}» وتطبيقها</> : "تثبيت قواعد المرحلة"} — تجد الدرس كاملاً في تبويب «الدرس» بالأسفل.
          </li>
          <li>
            <strong>المهارات:</strong> {fertigkeiten.length > 0 ? <>تدريب {fertigkeiten.join(" + ")}</> : "فحص شامل وتثبيت"} — كل مهارة تُدرَّب بتمرينها لا بالقراءة عنها.
          </li>
        </ol>
      </details>

      {/* ── 🌙 كبسولة المساء: 3 جمل تُسأل بعينها صباح الغد ── */}
      <TagesKapsel day={day} voiceName={voiceName} rate={rate} />

      {/* ── محطّة مراجعة الأخطاء المتكرّقة (قبل الإغلاق) ── */}
      {allSubmitted && <FehlerRevue progress={progress} />}

      {allSubmitted && !confirmClose && (
        <div className="card fadein" data-testid="stop-panel" style={{ padding: "0.8rem 1rem", borderInlineStart: "5px solid var(--color-a1)" }}>
          <div style={{ fontWeight: 900 }}>🛑 توقف هنا — يومك مكتمل.</div>
          <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)", marginTop: "0.25rem" }}>
            ➕ نشاط إضافي محدود (اختياري): راجع كبسولة المساء أعلاه أو بطاقة واحدة من دفتر الأخطاء — ثم أغلق اليوم.
          </div>
        </div>
      )}

      {/* ── 🛑 ختام اليوم ── */}
      <section id="dirb-abschluss" className="dirb-close" aria-label="ختام اليوم">
        <div style={{ fontSize: "2rem" }} aria-hidden>🎓</div>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 900, margin: 0, color: "var(--color-ink)" }}>
          ختام اليوم {day}
        </h2>
        <div className="dirb-close-stats">
          <div>
            <small>المهام المنجزة</small>
            <strong className="rtl-num">
              {plan.tasks.filter((tk) => resultOf(tk.id)).length} / {plan.tasks.length}
            </strong>
          </div>
          <div>
            <small>الناجحة (≥80%)</small>
            <strong className="rtl-num" style={{ color: "var(--color-a1)" }}>
              {plan.tasks.filter((tk) => resultOf(tk.id)?.passed).length} / {plan.tasks.length}
            </strong>
          </div>
          <div>
            <small>التعويضات</small>
            <strong className="rtl-num" style={{ color: unpassed.length > 0 ? "var(--color-gold)" : "var(--color-a1)" }}>
              {unpassed.length === 0 ? "0 ✨" : unpassed.length}
            </strong>
          </div>
        </div>

        {!confirmClose ? (
          <div style={{ display: "grid", gap: "0.5rem" }}>
            <button
              type="button"
              className="dirb-start"
              onClick={() => setConfirmClose(true)}
            >
              🛑 إنهاء اليوم وحفظ التقدّم
            </button>
            {badDayToday && (
              <button
                type="button"
                className="dirb-start dirb-start-ghost"
                onClick={badDayToday}
                title="يوم سيّئ: تُجمَّد السلسلة بلا ديون ولا عقاب."
                style={{ minHeight: "2.9rem", fontSize: "0.95rem" }}
              >
                🧘 يوم سيّئ — اعبر بلا ديون
              </button>
            )}
            <small style={{ color: "var(--color-ink2)", fontSize: "0.8rem" }}>
              {allSubmitted
                ? "كل المهام مُسلَّمة. أغلق اليوم لفتح الغد."
                : "يمكنك الإغلاق الآن وسيُرحَّل ما لم يُنجز؛ أو استعمل «يوم سيّئ» لليالي الصعبة بلا ديون."}
            </small>
          </div>
        ) : (
          <div className="card fadein" style={{ padding: "1.1rem", background: "var(--color-gold-soft)", textAlign: "start" }}>
            <strong>تأكيد إغلاق اليوم {day}:</strong>
            <div style={{ margin: "0.6rem 0", lineHeight: 1.8, fontSize: "0.9rem" }}>
              {unpassed.length === 0 ? (
                <>✨ أتقنت كل المهام (≥80%) — لا تعويضات! الغد سيبدأ بمحتواه الجديد فقط.</>
              ) : (
                <>
                  ⚠️ <strong className="rtl-num">{unpassed.length}</strong> من المهام لم تُتقَن — ستُرحَّل <strong>إلزامية</strong> إلى أول الغد:
                  <ul style={{ listStyle: "none", padding: 0, margin: "0.4rem 0" }}>
                    {unpassed.map((tk) => (
                      <li key={tk.id}>• {tk.titleAr}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            <div style={{ display: "flex", gap: "0.6rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button type="button" className="btn btn-gold" onClick={doCloseDay} style={{ minHeight: "46px" }}>
                نعم، أغلق وارفع التعويضات
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setConfirmClose(false)} style={{ minHeight: "46px" }}>
                لا، أريد إتقانها أولاً
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
