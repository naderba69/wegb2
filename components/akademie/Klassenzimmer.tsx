"use client";
import { useState, useMemo, useEffect } from "react";
import { FehlerRevue } from "./FehlerRevue";
import {
  type DayPlan,
  type DayTask,
  type Progress,
  type TaskResult,
  type SrsState,
  LEVEL_COLORS,
} from "@/lib/types";
import { grammarMap, getBrueckenFor, eselsbruecken, fehlerList, getDeck, alleVokabeln, getMnemonik } from "@/lib/content";
import { kapselSaetze, kapselSaetzeAbend } from "@/lib/kapsel";
import { kollokationenFuer } from "@/lib/kollokationen";
import { speakDe } from "@/lib/speech";
import { activeProfile } from "@/lib/profiles";
import TaskView from "@/components/tasks";
import StationsLeiste, { stationOfTask } from "@/components/stationen";
import { TagesKapsel } from "@/components/kapsel";
import { aufgabeGesperrt, sperrText, type RitualUrteil } from "@/lib/ritual";
import { De } from "@/components/De";
import { newCard, reviewCard, todayDeck, newCardCap, MAX_REVIEWS_PER_DAY, isDue } from "@/lib/srs";
import { paarDesTages } from "@/lib/arabinterferenz";
import { addFehlerNow } from "@/lib/store";

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
  submitCurrent: () => void;
  doCloseDay: () => void;
  badDayToday?: () => void;
  confirmClose: boolean;
  setConfirmClose: (b: boolean) => void;
  unpassed: DayTask[];
  allSubmitted: boolean;
  onSrs: (id: string, state: SrsState) => void;
}

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
  submitCurrent,
  doCloseDay,
  badDayToday,
  confirmClose,
  setConfirmClose,
  unpassed,
  allSubmitted,
  onSrs,
}: KlassenzimmerProps) {
  const act = activeProfile();
  const [extendedTime, setExtendedTime] = useState<boolean>(false);
  const [cardRevealed, setCardRevealed] = useState<Record<string, boolean>>({});
  const [activeStation, setActiveStation] = useState<number>(1);
  const [activeCardIdx, setActiveCardIdx] = useState<number>(0);
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);
  const [ratedCards, setRatedCards] = useState<Record<string, number>>({});

  const voiceName = progress.settings.voiceName;
  const rate = progress.settings.rate;

  // 1. استخراج موضوع القواعد للحصة الحالية
  const gramTask = plan.tasks.find((t) => t.kind === "grammatik" && t.topicId);
  const topicId =
    gramTask?.topicId ??
    (plan.phase === "A1"
      ? "a1-sein-haben"
      : plan.phase === "A2"
      ? "a2-perfekt"
      : plan.phase === "B1"
      ? "b1-passiv"
      : "b2-nominalstil");
  const topic = grammarMap[topicId];

  // 2. استخراج شفرة الحفظ المدمجة في هذا الموضوع (Eselsbrücke)
  const topicBruecken = useMemo(() => {
    const list = getBrueckenFor(topicId);
    if (list.length > 0) return list;
    return eselsbruecken.filter((b) => b.level === plan.phase).slice(0, 2);
  }, [topicId, plan.phase]);

  // 3. استخراج فخاخ الامتحان وأخطاء العرب المناسبة للحصة
  const topicPitfalls = topic?.pitfalls ?? [];
  const arabErrors = useMemo(() => {
    return fehlerList.filter((f) => f.level === plan.phase).slice(0, 3);
  }, [plan.phase]);

  // 4. استخراج الكلمات المفتاحية للحصة (5 إلى 7 كلمات مع المتلازمات)
  const keyVocab = useMemo(() => {
    const vTask = plan.tasks.find((t) => t.kind === "wortschatz" && t.deckId);
    if (vTask?.deckId) {
      const d = getDeck(vTask.deckId);
      if (d && d.cards.length > 0) return d.cards.slice(0, 6);
    }
    return alleVokabeln.filter((c) => c.level === plan.phase).slice(0, 6);
  }, [plan.tasks, plan.phase]);

  // 5. جمل إحماء صباحية: كبسولة مساء الأمس (ثلاث جمل من دروس الأمس قُرِئت قبل النوم)
  const warmupSaetze = useMemo(() => {
    if (day <= 1) return [];
    return kapselSaetzeAbend(day - 1);
  }, [day]);

  // دفعة SRS اليومية: بطاقات مستحقة + بطاقات جديدة بسقف الوتيرة
  const srsPile = useMemo(() => {
    const tempo = progress.settings.tempo ?? "regelmaessig";
    const pile = todayDeck(progress.srs, tempo);
    return pile;
  }, [progress.srs, progress.settings.tempo]);

  const newCap = newCardCap(progress.settings.tempo ?? "regelmaessig");
  const newTodayCount = Object.values(progress.srs).filter(
    (s) => s.reps === 0 && s.introduced && new Date(s.introduced).toDateString() === new Date().toDateString()
  ).length;
  const reviewsDoneToday = Object.values(progress.srs).filter((s) => s.reps > 0 && new Date(s.due).toDateString() === new Date().toDateString() && !isDue(s)).length;
  const reviewsRemaining = Math.max(0, MAX_REVIEWS_PER_DAY - reviewsDoneToday);

  const handleCardRating = (quality: 0 | 2 | 4) => {
    const card = keyVocab[activeCardIdx] ?? currentVocabCard;
    if (!card) return;
    const prev = progress.srs[card.id] ?? newCard();
    // لا تُضف بطاقة جديدة إذا تجاوزنا سقف الوتيرة
    const isBrandNew = prev.reps === 0;
    if (isBrandNew && newTodayCount >= newCap) return;
    onSrs(card.id, reviewCard(prev, quality));
    if (quality === 0) {
      addFehlerNow({
        falsch: card.article ? `${card.article} ${card.de}` : card.de,
        richtig: card.ar,
        art: "wortschatz",
        ar: card.exampleDe ? `${card.ar} — مثال: ${card.exampleDe}` : card.ar,
        level: card.level,
        quelle: "فلاشكارد الحصة",
      });
    }
    setRatedCards((prev) => ({ ...prev, [card.id]: quality }));
    onPoints(quality >= 2 ? 1 : 0, 1);
    setIsCardFlipped(false);
    if (activeCardIdx < keyVocab.length - 1) {
      setActiveCardIdx(activeCardIdx + 1);
    }
  };

  const currentVocabCard = keyVocab[activeCardIdx];
  const currentKolloks = currentVocabCard ? kollokationenFuer(currentVocabCard) : [];
  const genderMnemonic = currentVocabCard ? getMnemonik(currentVocabCard.de) : null;
  const interferenzPaar = paarDesTages(day, (plan.phase === "Abschluss" ? "B2" : plan.phase) as "A0"|"A1"|"A2"|"B1"|"B2");

  // المهمة الحالية في المحطة 5
  const currentTask = plan.tasks[stepFrei];

  // ربط المحطة النشطة بالمهمة الحالية (K3: dynamic activeStation)
  useEffect(() => {
    if (!currentTask) return;
    const s = stationOfTask(currentTask);
    const map: Record<string, number> = {
      warmup: 1, aussprache: 1, wortschatz: 2, grammatik: 3, rezeption: 5, produktion: 6,
    };
    setActiveStation(map[s] ?? 1);
  }, [stepFrei, currentTask?.id]);

  const scrollToStation = (id: string, stNum?: number) => {
    if (stNum) setActiveStation(stNum);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="fadein" style={{ display: "grid", gap: "1.4rem" }}>
      {/* ── شريط المحطات الست الأساسي (K-stations) مع تمييز المحطة النشطة ── */}
      <StationsLeiste tasks={plan.tasks} step={stepFrei} zielMin={plan.zielMin} />

      {/* ── شريط التنقل السريع بين محطات الحصة الست (Station Jump Bar) ── */}
      <nav
        aria-label="محطات الحصة اليومية"
        style={{
          position: "sticky",
          top: "0.5rem",
          zIndex: 10,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(8px)",
          borderRadius: "0.85rem",
          padding: "0.5rem",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          border: "1px solid var(--color-line)",
          display: "flex",
          gap: "0.35rem",
          overflowX: "auto",
          scrollbarWidth: "none",
        }}
      >
        <button
          type="button"
          onClick={() => scrollToStation("st-ziele", 1)}
          className="chip"
          style={{
            cursor: "pointer",
            minHeight: "44px",
            padding: "0.4rem 0.85rem",
            fontSize: "0.85rem",
            fontWeight: activeStation === 1 ? 900 : 700,
            background: activeStation === 1 ? "var(--color-cola)" : "white",
            color: activeStation === 1 ? "white" : "var(--color-ink)",
            borderColor: activeStation === 1 ? "var(--color-cola)" : "var(--color-line)",
            boxShadow: activeStation === 1 ? "0 2px 8px rgba(124, 45, 18, 0.25)" : "none",
            transition: "all 0.2s ease",
          }}
        >
          🎯 1. الأهداف
        </button>
        <button
          type="button"
          onClick={() => scrollToStation("st-woerter", 2)}
          className="chip"
          style={{
            cursor: "pointer",
            minHeight: "44px",
            padding: "0.4rem 0.85rem",
            fontSize: "0.85rem",
            fontWeight: activeStation === 2 ? 900 : 700,
            background: activeStation === 2 ? "var(--color-cola)" : "white",
            color: activeStation === 2 ? "white" : "var(--color-ink)",
            borderColor: activeStation === 2 ? "var(--color-cola)" : "var(--color-line)",
            boxShadow: activeStation === 2 ? "0 2px 8px rgba(124, 45, 18, 0.25)" : "none",
            transition: "all 0.2s ease",
          }}
        >
          📚 2. المفردات ({keyVocab.length})
        </button>
        <button
          type="button"
          onClick={() => scrollToStation("st-grammatik", 3)}
          className="chip"
          style={{
            cursor: "pointer",
            minHeight: "44px",
            padding: "0.4rem 0.85rem",
            fontSize: "0.85rem",
            fontWeight: activeStation === 3 ? 900 : 700,
            background: activeStation === 3 ? "var(--color-cola)" : "white",
            color: activeStation === 3 ? "white" : "var(--color-ink)",
            borderColor: activeStation === 3 ? "var(--color-cola)" : "var(--color-line)",
            boxShadow: activeStation === 3 ? "0 2px 8px rgba(124, 45, 18, 0.25)" : "none",
            transition: "all 0.2s ease",
          }}
        >
          📘 3. القاعدة والتريك
        </button>
        <button
          type="button"
          onClick={() => scrollToStation("st-fallen", 4)}
          className="chip"
          style={{
            cursor: "pointer",
            minHeight: "44px",
            padding: "0.4rem 0.85rem",
            fontSize: "0.85rem",
            fontWeight: activeStation === 4 ? 900 : 700,
            background: activeStation === 4 ? "var(--color-cola)" : "white",
            color: activeStation === 4 ? "white" : "var(--color-ink)",
            borderColor: activeStation === 4 ? "var(--color-cola)" : "var(--color-line)",
            boxShadow: activeStation === 4 ? "0 2px 8px rgba(124, 45, 18, 0.25)" : "none",
            transition: "all 0.2s ease",
          }}
        >
          ⚠️ 4. فخاخ الامتحان
        </button>
        <button
          type="button"
          onClick={() => scrollToStation("st-training", 5)}
          className="chip"
          style={{
            cursor: "pointer",
            minHeight: "44px",
            padding: "0.4rem 0.85rem",
            fontSize: "0.85rem",
            fontWeight: activeStation === 5 ? 900 : 700,
            background: activeStation === 5 ? "var(--color-cola)" : "white",
            color: activeStation === 5 ? "white" : "var(--color-ink)",
            borderColor: activeStation === 5 ? "var(--color-cola)" : "var(--color-line)",
            boxShadow: activeStation === 5 ? "0 2px 8px rgba(124, 45, 18, 0.25)" : "none",
            transition: "all 0.2s ease",
          }}
        >
          ✍️ 5. التدريب ({stepFrei + 1}/{plan.tasks.length})
        </button>
        <button
          type="button"
          onClick={() => scrollToStation("st-abschluss", 6)}
          className="chip"
          style={{
            cursor: "pointer",
            minHeight: "44px",
            padding: "0.4rem 0.85rem",
            fontSize: "0.85rem",
            fontWeight: activeStation === 6 ? 900 : 700,
            background: activeStation === 6 ? "var(--color-cola)" : "white",
            color: activeStation === 6 ? "white" : "var(--color-ink)",
            borderColor: activeStation === 6 ? "var(--color-cola)" : "var(--color-line)",
            boxShadow: activeStation === 6 ? "0 2px 8px rgba(124, 45, 18, 0.25)" : "none",
            transition: "all 0.2s ease",
          }}
        >
          🎓 6. الختام والترديد
        </button>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════════
          المحطة 1: الأهداف والتسخين الاسترجاعي (Lernziele & Warm-up)
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        id="st-ziele"
        className="card fadein"
        style={{
          padding: "1.4rem",
          border: "1px solid var(--color-line)",
          background: "linear-gradient(145deg, #ffffff 40%, #faf6f0 100%)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <span className="chip" style={{ background: "var(--color-cola-soft)", color: "var(--color-cola)", fontWeight: 800 }}>
            المحطة 1 · 🎯 الأهداف والاستقبال
          </span>
          <span style={{ fontSize: "0.85rem", color: "var(--color-ink2)" }}>
            ⏱ الحصة الموجهة: 35–45 دقيقة
          </span>
        </div>

        <h2 style={{ fontSize: "1.35rem", fontWeight: 900, color: "var(--color-cola)", margin: "0 0 0.4rem" }}>
          أهلاً بك يا {act.name || "طالب الألمانية"} في حصة اليوم {day}! 👨‍🏫
        </h2>
        <p style={{ fontSize: "0.92rem", color: "var(--color-ink2)", lineHeight: 1.8, margin: 0 }}>
          معك مدرّسك الشخصي. اليوم هدفنا محدد، ولن نتركك حتى تتقن هذه الأهداف الثلاثة:
        </p>

        <div
          style={{
            margin: "1rem 0",
            background: "var(--color-paper2)",
            padding: "1rem 1.2rem",
            borderRadius: "0.8rem",
            borderInlineStart: "5px solid var(--color-cola)",
          }}
        >
          <div style={{ fontWeight: 800, fontSize: "0.95rem", marginBottom: "0.5rem", color: "var(--color-cola)" }}>
            📋 أهداف حصة اليوم الـ 3 (Lernziele):
          </div>
          <ol style={{ paddingInlineStart: "1.2rem", margin: 0, lineHeight: 1.9, fontSize: "0.92rem" }}>
            <li>
              <strong>المفردات:</strong> إتقان 5–7 كلمات محورية مع أداة التعريف بلونها، صيغة الجمع، والمتلازمة اللفظية.
            </li>
            <li>
              <strong>القاعدة:</strong> فهم قاعدة <De style={{ fontWeight: 800 }}>{topic?.titleDe || "الدرس"}</De> ({topic?.titleAr || ""}) وتطبيق شفرة الحفظ السحرية.
            </li>
            <li>
              <strong>فخاخ الامتحان:</strong> كشف المشتتات وأخطاء الترجمة الحرفية من العربية في Goethe و telc.
            </li>
          </ol>
        </div>

        {/* ── تسخين استرجاعي من حصة الأمس ── */}
        {warmupSaetze.length > 0 && (
          <div style={{ marginTop: "1rem", borderTop: "1px dashed var(--color-line)", paddingTop: "0.9rem" }}>
            <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--color-gold)", marginBottom: "0.3rem" }}>
              🔥 إحماء استرجاعي من الأمس (Active Recall):
            </div>
            <p style={{ fontSize: "0.82rem", color: "var(--color-ink2)", margin: "0 0 0.5rem" }}>
              استمع للجملة التالية من كبسولة الأمس واستحضر تركيبها الصحيح:
            </p>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              {warmupSaetze.slice(0, 2).map((s) => (
                <div
                  key={s.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "0.6rem",
                    background: "var(--color-card)",
                    padding: "0.55rem 0.85rem",
                    borderRadius: "0.6rem",
                    border: "1px solid var(--color-line)",
                  }}
                >
                  <div>
                    <De style={{ fontWeight: 800, fontSize: "0.98rem", color: "var(--color-ink)" }}>{s.de}</De>
                    <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)" }}>{s.ar}</div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => speakDe(s.de, { voiceName, rate })}
                    style={{ minHeight: "44px", minWidth: "44px", padding: 0 }}
                    title="استمع للنطق"
                  >
                    🔊
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── تمرين تدخّل صوتي عربي (Arabic Interference) ── */}
        {interferenzPaar && (
          <div style={{ marginTop: "1rem", borderTop: "1px dashed var(--color-line)", paddingTop: "0.9rem" }}>
            <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--color-a1)", marginBottom: "0.3rem" }}>
              🎧 فخّ نطقي عربي لليوم:
            </div>
            <div style={{
              background: "var(--color-card)", padding: "0.7rem 0.9rem", borderRadius: "0.6rem",
              border: "1px solid var(--color-line)", fontSize: "0.88rem",
            }}>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center", marginBottom: "0.4rem" }}>
                {interferenzPaar.de1 === interferenzPaar.de2 ? (
                  <De style={{ fontWeight: 900, fontSize: "1rem" }}>{interferenzPaar.de1}</De>
                ) : (
                  <>
                    <De style={{ fontWeight: 900, color: "var(--color-a1)" }}>{interferenzPaar.de1}</De>
                    <span style={{ color: "var(--color-ink2)" }}>←/→</span>
                    <De style={{ fontWeight: 900, color: "var(--color-b2)" }}>{interferenzPaar.de2}</De>
                  </>
                )}
                <span style={{ fontSize: "0.78rem", color: "var(--color-ink2)" }}>
                  ({interferenzPaar.ar1}{interferenzPaar.de1 !== interferenzPaar.de2 ? ` · ${interferenzPaar.ar2}` : ""})
                </span>
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--color-ink2)", lineHeight: 1.6 }}>
                💡 {interferenzPaar.hinweisAr}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          المحطة 2: مفردات الدرس التأسيسية وجدولة التكرار المتباعد
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="st-woerter" className="card fadein" style={{ padding: "1.4rem", border: "1px solid var(--color-line)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <span className="chip" style={{ background: "var(--color-cola-soft)", color: "var(--color-cola)", fontWeight: 800 }}>
            المحطة 2 · 📚 مفردات الدرس الأساسية (Lektionswortschatz)
          </span>
          <span className="chip" style={{ fontWeight: 800 }}>
            الكلمة {activeCardIdx + 1} من {keyVocab.length}
          </span>
        </div>

        <p style={{ fontSize: "0.9rem", color: "var(--color-ink2)", margin: "0 0 1rem", lineHeight: 1.8 }}>
          مفردات حصة اليوم المحورية: استمع لنطقها بالأداة الملونة، صيغة الجمع، والمتلازمة اللفظية. هذه الكلمات تُودَع تلقائياً في <strong>جدول التكرار المتباعد (SRS)</strong> لتُراجع بنهاية الأسبوع لتثبيتها في الذاكرة طويلة المدى.
        </p>

        {currentVocabCard && (
          <div style={{ display: "grid", gap: "1rem", maxWidth: "34rem", margin: "0 auto" }}>
            <div
              className="flip-card-container"
              onClick={() => setIsCardFlipped(!isCardFlipped)}
            >
              <div className={`flip-card ${isCardFlipped ? "is-flipped" : ""}`}>
                {/* ── الوجه الأمامي (Front): الكلمة الألمانية + أداة ملونة + النطق + المتلازمة ── */}
                <div
                  className="flip-face flip-face-front"
                  style={{
                    borderTop: `6px solid ${
                      currentVocabCard.article === "der"
                        ? "var(--color-der)"
                        : currentVocabCard.article === "die"
                        ? "var(--color-die)"
                        : currentVocabCard.article === "das"
                        ? "var(--color-das)"
                        : "var(--color-plural)"
                    }`,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                    {currentVocabCard.article ? (
                      <span className={
                        currentVocabCard.article === "der"
                          ? "badge-der"
                          : currentVocabCard.article === "die"
                          ? "badge-die"
                          : currentVocabCard.article === "das"
                          ? "badge-das"
                          : "badge-plural"
                      }>
                        {currentVocabCard.article}
                      </span>
                    ) : <span />}
                    <span style={{ fontSize: "0.8rem", color: "var(--color-ink2)" }}>
                      🔄 انقر لكشف المعنى والمثال
                    </span>
                  </div>

                  <div style={{ margin: "1.2rem 0 0.8rem" }}>
                    <De style={{ fontSize: "2rem", fontWeight: 900, color: "var(--color-ink)" }}>
                      {currentVocabCard.de}
                    </De>
                  </div>

                  <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        speakDe(currentVocabCard.de, { voiceName, rate });
                      }}
                      style={{ minHeight: "44px", fontSize: "0.9rem", padding: "0.4rem 1rem" }}
                    >
                      🔊 استمع للنطق
                    </button>
                    {currentKolloks.length > 0 && (
                      <span className="chip" style={{ background: "var(--color-gold-soft)", borderColor: "var(--color-gold)" }}>
                        🤝 <De style={{ fontWeight: 800 }}>{currentKolloks[0]}</De>
                      </span>
                    )}
                    {genderMnemonic && (
                      <div style={{ fontSize: "0.8rem", marginTop: "0.7rem", padding: "0.45rem 0.6rem", borderRadius: "0.5rem", background: "var(--color-paper2, #f7f4ef)", border: "1px dashed var(--color-line)", textAlign: "center", width: "100%" }}>
                        🧠 <strong>ذاكرة الجندر:</strong> {genderMnemonic.tipp}
                      </div>
                    )}
                  </div>
                </div>

                {/* ── الوجه الخلفي (Back): المعنى العربي + صيغة الجمع + المثال المترجم ── */}
                <div className="flip-face flip-face-back">
                  <div style={{ fontSize: "1.35rem", fontWeight: 900, color: "var(--color-cola)", marginBottom: "0.4rem" }}>
                    {currentVocabCard.ar}
                  </div>

                  {currentVocabCard.plural && (
                    <div style={{ marginBottom: "0.6rem" }}>
                      <span className="badge-plural">
                        صيغة الجمع: <De style={{ fontWeight: 900 }}>{currentVocabCard.plural}</De>
                      </span>
                    </div>
                  )}

                  {currentVocabCard.exampleDe && (
                    <div style={{ background: "var(--color-card)", padding: "0.7rem 0.9rem", borderRadius: "0.6rem", border: "1px solid var(--color-line)", margin: "0.4rem 0", width: "100%", textAlign: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}>
                        <De style={{ fontWeight: 800, fontSize: "0.98rem" }}>{currentVocabCard.exampleDe}</De>
                        <button
                          type="button"
                          className="chip"
                          onClick={(e) => {
                            e.stopPropagation();
                            speakDe(currentVocabCard.exampleDe!, { voiceName, rate });
                          }}
                          style={{ cursor: "pointer", minHeight: "36px" }}
                        >
                          🔊
                        </button>
                      </div>
                      {currentVocabCard.exampleAr && (
                        <div style={{ fontSize: "0.82rem", color: "var(--color-ink2)", marginTop: "0.2rem" }}>
                          {currentVocabCard.exampleAr}
                        </div>
                      )}
                    </div>
                  )}

                  {/* أزرار التنقل السلس بين الكلمات */}
                  <div style={{ display: "flex", gap: "0.5rem", width: "100%", marginTop: "0.8rem", justifyContent: "space-between" }}>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      disabled={activeCardIdx === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsCardFlipped(false);
                        setActiveCardIdx(Math.max(0, activeCardIdx - 1));
                      }}
                      style={{ flex: 1, minHeight: "44px", fontSize: "0.85rem", fontWeight: 700 }}
                    >
                      ← السابقة
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardRating(4);
                      }}
                      style={{ flex: 1.4, minHeight: "44px", fontSize: "0.85rem", fontWeight: 800 }}
                    >
                      {activeCardIdx < keyVocab.length - 1 ? "التالية ←" : "اكتملت المفردات ✓"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* شريط مؤشرات البطاقات */}
            <div style={{ display: "flex", gap: "0.4rem", justifyContent: "center", flexWrap: "wrap" }}>
              {keyVocab.map((c, i) => {
                const rated = ratedCards[c.id];
                return (
                  <button
                    key={c.id}
                    type="button"
                    className="chip"
                    onClick={() => {
                      setActiveCardIdx(i);
                      setIsCardFlipped(false);
                    }}
                    style={{
                      cursor: "pointer",
                      minHeight: "40px",
                      background: i === activeCardIdx ? "var(--color-cola)" : rated !== undefined ? "#dcfce7" : "white",
                      color: i === activeCardIdx ? "white" : undefined,
                      fontWeight: 800,
                    }}
                  >
                    {rated !== undefined ? "✓ " : ""}{i + 1}. <De>{c.de.replace(/^(der|die|das)\s+/, "").slice(0, 8)}</De>
                  </button>
                );
              })}
            </div>

            <div style={{ background: "var(--color-gold-soft)", border: "1px solid var(--color-gold)", borderRadius: "0.6rem", padding: "0.6rem 0.9rem", fontSize: "0.84rem", color: "#92400e", textAlign: "center" }}>
              📅 <strong>نظام التكرار المتباعد الأكاديمي:</strong> هذه الكلمات أُدرجت تلقائياً في جدول مراجعاتك بنهاية الأسبوع لضمان ترسيخها.
            </div>
          </div>
        )}
              <div style={{ marginTop: "1.2rem", display: "flex", justifyContent: "space-between", gap: "0.5rem", flexWrap: "wrap" }}>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => scrollToStation("st-ziele", 1)}
            style={{ minHeight: "48px" }}
          >
            ← العودة للأهداف
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => scrollToStation("st-grammatik", 3)}
            style={{ minHeight: "48px", padding: "0.6rem 1.4rem", fontWeight: 800 }}
          >
            الانتقال إلى القاعدة وتريكة الحفظ (المحطة 3) ←
          </button>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          المحطة 3: قلب الحصة — القاعدة وتريك الحفظ المدمج (Grammatik & Eselsbrücke)
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="st-grammatik" className="card fadein" style={{ padding: "1.4rem", border: "1px solid var(--color-line)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <span className="chip" style={{ background: "var(--color-cola-soft)", color: "var(--color-cola)", fontWeight: 800 }}>
            المحطة 3 · 📘 القاعدة وتريك الحفظ
          </span>
          <span className="chip" style={{ borderColor: LEVEL_COLORS[plan.phase], color: LEVEL_COLORS[plan.phase] }}>
            المستوى {plan.phase}
          </span>
        </div>

        {topic ? (
          <div style={{ display: "grid", gap: "1rem" }}>
            <div>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 900, color: "var(--color-cola)", margin: "0 0 0.3rem" }}>
                <De>{topic.titleDe}</De> — {topic.titleAr}
              </h2>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.8, color: "var(--color-ink)", margin: 0 }}>
                {topic.summaryAr}
              </p>
            </div>

            {/* ── القواعد الوظيفية ── */}
            {topic.rules && topic.rules.length > 0 && (
              <div style={{ background: "var(--color-card)", padding: "0.85rem 1.1rem", borderRadius: "0.8rem", border: "1px solid var(--color-line)" }}>
                <div style={{ fontWeight: 800, fontSize: "0.92rem", color: "var(--color-cola)", marginBottom: "0.4rem" }}>
                  📐 القواعد الوظيفية:
                </div>
                <ul style={{ paddingInlineStart: "1.2rem", margin: 0, lineHeight: 1.9, fontSize: "0.9rem" }}>
                  {topic.rules.map((r, idx) => (
                    <li key={idx}>
                      <De style={{ fontWeight: 800 }}>{r.de}</De> — <span>{r.ar}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ── الجداول النحوية ── */}
            {topic.tables && topic.tables.length > 0 && (
              <div style={{ overflowX: "auto" }}>
                {topic.tables.map((tbl, tIdx) => (
                  <div key={tIdx} style={{ marginBottom: "0.6rem" }}>
                    {tbl.captionAr && <div style={{ fontWeight: 700, fontSize: "0.85rem", marginBottom: "0.3rem" }}>{tbl.captionAr}</div>}
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem", background: "var(--color-card)", borderRadius: "0.5rem" }}>
                      <thead>
                        <tr style={{ background: "var(--color-paper2)" }}>
                          {tbl.headers.map((h, hIdx) => (
                            <th key={hIdx} style={{ padding: "0.45rem", borderBottom: "2px solid var(--color-line)", textAlign: "start" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tbl.rows.map((row, rIdx) => (
                          <tr key={rIdx}>
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} style={{ padding: "0.4rem", borderBottom: "1px solid var(--color-line)" }}>
                                <De style={{ fontWeight: cIdx === 0 ? 800 : 500 }}>{cell}</De>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            )}

            {/* ── دليل مخارج الحروف الألمانية للأستاذ ── */}
            <div
              style={{
                background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
                border: "2px solid #86efac",
                borderRadius: "0.9rem",
                padding: "1rem 1.2rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                <span style={{ fontSize: "1.3rem" }}>🎙️</span>
                <strong style={{ fontSize: "1rem", color: "#166534" }}>
                  سر النطق ومخارج الحروف الألمانية (Aussprache-Tipp):
                </strong>
              </div>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.8, color: "#14532d", margin: 0 }}>
                {plan.phase === "A1"
                  ? "صوت ch بعد الحروف الصوتية e, i, ä ينطق بابتسامة خفيفة وملامسة وسط اللسان لسقف الحلق (ich-Laut مثل: ich, nicht)، بينما بعد a, o, u ينطق خاءً عميقة من الحلق (ach-Laut مثل: machen, Buch)."
                  : plan.phase === "A2"
                  ? "أسرار الـ Umlaute: انطق صوت ö بضم شفتيك كأنك تنطق الواو مع وضع لسانك في موضع الياء؛ ونهاية الكلمات -er تُنطق كفتحة مخففة (vokalisiertes r مثل: Wasser -> Vassa)."
                  : plan.phase === "B1"
                  ? "التنغيم والنبر الصوتي (Satzmelodie): ينخفض نبر الصوت في نهاية الجمل الخبرية وجمل W-Fragen، بينما يرتفع بنبرة تساؤلية حادة في نهاية أسئلة Ja/Nein."
                  : "الوقفات الحنجرية الأكاديمية (Knacklaut): فصل البوادئ والكلمات المركبة بهمسة حنجرية واضحة (Glottal Stop) لتبدو لغتك في النقاشات كمتحدث ألماني أصيل."}
              </p>
            </div>

            {/* ── تريك الحفظ وشفرة الذاكرة المدمجة (Eselsbrücke) ── */}
            {topicBruecken.length > 0 && (
              <div
                style={{
                  background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
                  border: "2px solid #f59e0b",
                  borderRadius: "0.9rem",
                  padding: "1.1rem 1.2rem",
                  boxShadow: "0 4px 15px rgba(217, 119, 6, 0.12)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                  <span style={{ fontSize: "1.4rem" }}>⚡</span>
                  <strong style={{ fontSize: "1.05rem", color: "#92400e" }}>
                    تريك الحفظ وشفرة الذاكرة (Eselsbrücke):
                  </strong>
                </div>
                {topicBruecken.map((b) => (
                  <div key={b.id} style={{ marginTop: "0.5rem" }}>
                    <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#78350f" }}>
                      {b.titleAr}
                    </div>
                    <p style={{ fontSize: "0.9rem", lineHeight: 1.8, color: "#92400e", margin: "0.25rem 0 0.45rem" }}>
                      {b.storyAr}
                    </p>
                    {b.zeilen && b.zeilen.length > 0 && (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.35rem" }}>
                        {b.zeilen.map((z, zIdx) => (
                          <div key={zIdx} style={{ background: "var(--color-card)", padding: "0.4rem 0.6rem", borderRadius: "0.4rem", fontSize: "0.82rem", border: "1px solid #fde68a" }}>
                            <span style={{ fontWeight: 900, color: "#b45309" }}>{z.code} ➔ </span>
                            <De style={{ fontWeight: 800 }}>{z.de}</De>
                            <div style={{ color: "var(--color-ink2)", fontSize: "0.75rem" }}>{z.ar}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>القاعدة النحوية جاهزة في المهام اليومية.</div>
        )}
              <div style={{ marginTop: "1.2rem", display: "flex", justifyContent: "space-between", gap: "0.5rem", flexWrap: "wrap" }}>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => scrollToStation("st-woerter", 2)}
            style={{ minHeight: "48px" }}
          >
            ← العودة للمفردات
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => scrollToStation("st-fallen", 4)}
            style={{ minHeight: "48px", padding: "0.6rem 1.4rem", fontWeight: 800 }}
          >
            الانتقال إلى فخاخ الامتحان (المحطة 4) ←
          </button>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          المحطة 4: فخاخ الامتحان ومطبّات الطلاب العرب (Stolpersteine & Pitfalls)
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="st-fallen" className="card fadein" style={{ padding: "1.4rem", border: "1px solid var(--color-line)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <span className="chip" style={{ background: "var(--color-cola-soft)", color: "var(--color-cola)", fontWeight: 800 }}>
            المحطة 4 · ⚠️ فخاخ الامتحان ومطبّات العرب
          </span>
          <span style={{ fontSize: "0.85rem", color: "var(--color-ink2)" }}>
            Goethe & telc Prüfungsfallen
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.6rem" }}>
          <span style={{ fontSize: "1.3rem" }}>🧐</span>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 900, color: "var(--color-cola)", margin: 0 }}>
            تنبيه الأستاذ: أين يخسر الطلاب درجاتهم في الامتحان؟
          </h2>
        </div>
        <p style={{ fontSize: "0.9rem", color: "var(--color-ink2)", lineHeight: 1.8, margin: "0 0 1rem" }}>
          واضعو امتحانات Goethe و telc يركزون على أخطاء الترجمة الحرفية الشائعة بين الطلاب العرب:
        </p>

        {topicPitfalls.length > 0 && (
          <div style={{ display: "grid", gap: "0.7rem", marginBottom: "1rem" }}>
            {topicPitfalls.map((p, idx) => (
              <div
                key={idx}
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderInlineStart: "5px solid #dc2626",
                  borderRadius: "0.75rem",
                  padding: "0.85rem 1.1rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", flexWrap: "wrap" }}>
                  <span style={{ color: "#dc2626", fontWeight: 900, fontSize: "0.95rem" }}>فخ شائع:</span>
                  <De style={{ fontWeight: 800, fontSize: "1rem", color: "#991b1b" }}>{p.de}</De>
                </div>
                <div style={{ marginTop: "0.3rem", fontSize: "0.88rem", color: "#7f1d1d", fontWeight: 600 }}>
                  💡 التصحيح وعلّة الخطأ: {p.ar}
                </div>
              </div>
            ))}
          </div>
        )}

        {arabErrors.length > 0 && (
          <div style={{ background: "var(--color-paper2)", padding: "0.9rem 1.1rem", borderRadius: "0.8rem", border: "1px solid var(--color-line)" }}>
            <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--color-cola)", marginBottom: "0.4rem" }}>
              🛑 فخاخ التداخل العربي الألمانية (L1 Arabic Interference):
            </div>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              {arabErrors.map((err) => (
                <div key={err.id} style={{ background: "var(--color-card)", padding: "0.55rem 0.8rem", borderRadius: "0.5rem", border: "1px solid var(--color-line)", fontSize: "0.85rem" }}>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "baseline" }}>
                    <span style={{ color: "#dc2626", fontWeight: 800 }}>خطأ: <De>{err.falsch}</De></span>
                    <span style={{ color: "var(--color-a1)", fontWeight: 800 }}>✓ صواب: <De>{err.richtig}</De></span>
                  </div>
                  <div style={{ color: "var(--color-ink2)", fontSize: "0.8rem", marginTop: "0.15rem" }}>
                    {err.ar}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
              <div style={{ marginTop: "1.2rem", display: "flex", justifyContent: "space-between", gap: "0.5rem", flexWrap: "wrap" }}>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => scrollToStation("st-grammatik", 3)}
            style={{ minHeight: "48px" }}
          >
            ← العودة للقاعدة
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => scrollToStation("st-training", 5)}
            style={{ minHeight: "48px", padding: "0.6rem 1.4rem", fontWeight: 800 }}
          >
            بدء معمل التطبيق للمهارات الأربع (المحطة 5) ←
          </button>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          المحطة 5: التدريب التفاعلي الموجه وعلاج الأخطاء (Geführtes Training)
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="st-training" className="card fadein" style={{ padding: "1.4rem", border: "1px solid var(--color-line)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <span className="chip" style={{ background: "var(--color-cola-soft)", color: "var(--color-cola)", fontWeight: 800 }}>
            المحطة 5 · ✍️ التدريب الموجه وعلاج الأخطاء
          </span>
          <span style={{ fontSize: "0.85rem", color: "var(--color-ink2)" }}>
            المهمة {stepFrei + 1} من {plan.tasks.length}
          </span>
        </div>

        {/* ── شريط رقائق المهام لليوم ── */}
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.9rem" }}>
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
                  padding: "0.4rem 0.8rem",
                  background: i === stepFrei ? "var(--color-cola)" : passed ? "var(--color-a1)" : "white",
                  color: i === stepFrei || passed ? "white" : undefined,
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

        {ritual.gesperrt && (
          <div
            className="card"
            style={{
              padding: "0.75rem 1.1rem",
              borderInlineStart: "5px solid var(--color-gold)",
              fontSize: "0.9rem",
              marginBottom: "1rem",
              background: "var(--color-gold-soft)",
            }}
            data-testid="ritual-sperre"
          >
            🔐 <strong>{sperrText(ritual)}</strong>
            <div style={{ color: "var(--color-ink2)", fontSize: "0.82rem", marginTop: "0.2rem" }}>
              الاسترجاعُ قبل الجديد — سلّم مهمة الاسترجاع أولاً لتنفتح باقي المهام.
            </div>
          </div>
        )}

        {currentTask && (
          <div style={{ display: "grid", gap: "1rem" }}>
            <div
              style={{
                background: "var(--color-paper2)",
                padding: "0.8rem 1rem",
                borderRadius: "0.6rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
              <div>
                <strong>
                  المهمة {stepFrei + 1}/{plan.tasks.length}: <De>{currentTask.titleDe}</De>
                </strong>
                <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)" }}>
                  {currentTask.titleAr} · ⏱ {currentTask.minutes} دقيقة
                  {currentTask.mandatory && " · تعويض إلزامي"}
                </div>
              </div>
              {resultOf(currentTask.id)?.passed && (
                <span className="chip" style={{ color: "var(--color-a1)", borderColor: "var(--color-a1)", fontWeight: 700 }}>
                  مُتقَنة ≥80% ✓
                </span>
              )}
            </div>

            {/* عارض التمرين التفاعلي */}
            <TaskView
              key={`${currentTask.id}-${stepFrei}-${resultOf(currentTask.id)?.attempts ?? 0}`}
              task={currentTask}
              lang={progress.settings.uiLang === "auto" ? "ar" : progress.settings.uiLang}
              day={day}
              srs={progress.srs}
              onSrs={onSrs}
              onPoints={onPoints}
              voiceName={voiceName}
              rate={rate}
            />

            <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
              <button
                type="button"
                className="btn btn-ghost"
                disabled={stepFrei === 0}
                onClick={() => setStep(Math.max(0, stepFrei - 1))}
                style={{ minHeight: "48px" }}
              >
                ← المهمة السابقة
              </button>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
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
                  <span className="chip" style={{ padding: "0.5rem 0.9rem", minHeight: "48px", display: "inline-flex", alignItems: "center" }}>
                    النتيجة: {resultOf(currentTask.id)?.score} / {resultOf(currentTask.id)?.total}{" "}
                    {resultOf(currentTask.id)?.passed ? "ناجحة ✅" : "ستُرحَّل تعويضاً ⚠️"}
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
                    {aufgabeGesperrt(ritual, stepFrei + 1) ? "🔒 التالي" : "المهمة التالية ←"}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-gold"
                    onClick={() => scrollToStation("st-abschluss")}
                    style={{ minHeight: "48px" }}
                  >
                    الانتقال إلى ختام الحصة ←
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          المحطة 6: ختام الحصة والترديد والكبسولة (Tagesabschluss & Shadowing)
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="st-abschluss" className="card fadein" style={{ padding: "1.4rem", border: "1px solid var(--color-line)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <span className="chip" style={{ background: "var(--color-a1)", color: "white", fontWeight: 800 }}>
            المحطة 6 · 🎓 الختام وتثبيت الذاكرة
          </span>
          <span style={{ fontSize: "0.85rem", color: "var(--color-ink2)" }}>
            Tagesabschluss & Shadowing
          </span>
        </div>

        <div style={{ textAlign: "center", marginBottom: "1.2rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.2rem" }}>🎉</div>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 900, color: "var(--color-cola)", margin: 0 }}>
            أحسنت يا {act.name || "البطل"}! أتممت مسار حصة اليوم {day}!
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--color-ink2)", margin: "0.25rem auto 0", maxWidth: "28rem" }}>
            قبل أن تغلق الدرس، لسانك يحتاج إلى الترديد، وعقلك يحتاج إلى كبسولة نوم هادئة لتثبيت الذاكرة.
          </p>
        </div>

        {/* ── محطة الترديد الظلي الصوتي (Shadowing) والكبسولة ── */}
        <div style={{ margin: "1.2rem 0" }}>
          <TagesKapsel day={day} voiceName={voiceName} rate={rate} />
        </div>

        {/* ── ملخص الإنجاز اليومي ── */}
        <div
          style={{
            background: "var(--color-paper2)",
            padding: "0.9rem 1.1rem",
            borderRadius: "0.8rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
            gap: "0.8rem",
            textAlign: "center",
            marginBottom: "1.2rem",
          }}
        >
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--color-ink2)" }}>المهام المنجزة</div>
            <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "var(--color-cola)" }}>
              {plan.tasks.filter((tk) => resultOf(tk.id)).length} / {plan.tasks.length}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--color-ink2)" }}>المهام الناجحة (≥80%)</div>
            <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "var(--color-a1)" }}>
              {plan.tasks.filter((tk) => resultOf(tk.id)?.passed).length} / {plan.tasks.length}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--color-ink2)" }}>التعويضات المتبقية</div>
            <div style={{ fontSize: "1.25rem", fontWeight: 900, color: unpassed.length > 0 ? "var(--color-gold)" : "var(--color-a1)" }}>
              {unpassed.length === 0 ? "0 تعويضات ✨" : `${unpassed.length} تُرحَّل`}
            </div>
          </div>
        </div>

        {/* ── محطة ٣: مراجعة الأخطاء المتكرّقة (قبل الإغلاق — K105) ── */}
      {allSubmitted && <FehlerRevue progress={progress} />}

      {/* ── قرارات نهاية الحصة الـ 45 دقيقة ── */}
        <div style={{ display: "grid", gap: "0.8rem", textAlign: "center" }}>
          {!confirmClose ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", alignItems: "center" }}>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center", width: "100%", maxWidth: "32rem" }}>
                <button
                  type="button"
                  className="btn btn-gold"
                  onClick={() => setConfirmClose(true)}
                  style={{
                    flex: "2",
                    minWidth: "14rem",
                    minHeight: "56px",
                    fontSize: "1.05rem",
                    fontWeight: 900,
                    borderRadius: "0.85rem",
                    boxShadow: "0 4px 15px rgba(217, 119, 6, 0.25)",
                  }}
                >
                  🛑 إنهاء حصة اليوم وحفظ التقدّم ←
                </button>
                {badDayToday && (
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={badDayToday}
                    title="يوم سيّئ: تُجمَّد السلسلة بلا ديون ولا عقاب."
                    style={{
                      flex: "1",
                      minWidth: "10rem",
                      minHeight: "56px",
                      borderRadius: "0.85rem",
                      border: "1px dashed var(--color-line)",
                      color: "var(--color-ink2)",
                    }}
                  >
                    🧘 يوم سيّئ
                  </button>
                )}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)" }}>
                {allSubmitted
                  ? "كل المهام مُسلَّمة. أغلق اليوم لفتح الغد."
                  : "يمكنك الإغلاق الآن وسيُرحَّل ما لم يُنجز (≤ مهمّتَي دين)؛ أو استعمل «يوم سيّئ» لليالي الصعبة بلا ديون."}
              </div>

              {!extendedTime ? (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setExtendedTime(true)}
                  style={{ minHeight: "44px", fontSize: "0.86rem", marginTop: "0.4rem" }}
                >
                  ⏱️ أريد تمديد الحصة 15 دقيقة إضافية للتحدي والمحادثة
                </button>
              ) : (
                <div
                  className="fadein"
                  style={{
                    marginTop: "0.5rem",
                    padding: "0.8rem 1rem",
                    background: "var(--color-card)",
                    border: "1px dashed var(--color-gold)",
                    borderRadius: "0.6rem",
                    fontSize: "0.88rem",
                  }}
                >
                  🌟 <strong>وضع التمديد مفتوح:</strong> يمكنك مراجعة أي تمرين، أو استكشاف حوارات الاستماع والمحادثة من خزانة المعهد.
                </div>
              )}
            </div>
          ) : (
            <div className="card fadein" style={{ padding: "1.1rem", background: "var(--color-gold-soft)" }}>
              <strong>تأكيد إغلاق اليوم {day}:</strong>
              <div style={{ margin: "0.6rem 0", lineHeight: 1.8, fontSize: "0.9rem" }}>
                {unpassed.length === 0 ? (
                  <>✨ أتقنت كل المهام (≥80%) — لا تعويضات! الغد سيبدأ بمحتواه الجديد فقط.</>
                ) : (
                  <>
                    ⚠️ <strong>{unpassed.length}</strong> من المهام لم تُتقَن — ستُرحَّل <strong>إلزامية</strong> إلى أول الغد:
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
        </div>
      </section>
    </div>
  );
}
