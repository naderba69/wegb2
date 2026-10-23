"use client";
/**
 * 🎓 معالج الدرس الخمسي — الوجهة «الدرس» (P2):
 * خمّن ← قاعدة ← أمثلة ← تطبيق ← خلاصة.
 *
 * الميثاق: كل خطوة ≤ نصف شاشة · الأمام مقفل حتى تفاعلٍ حقيقيّ (والقفل يذكر
 * سببه) · ≤3 تمارين في التطبيق · الخلاصة تجمع الملخّص والفخاخ وشفرة الحفظ ·
 * موضعك محفوظ (البدء البارد يستأنف مهمّته) · وباب الرجوع الوحيد «اليوم».
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { grammarMap, getBrueckenFor, candoMap } from "@/lib/content";
import type { Eselsbruecke } from "@/lib/types";
import { isDue } from "@/lib/srs";
import { entdeckungsFrage, induktionMoeglich, ergebnisText, type EntdeckungsErgebnis } from "@/lib/induktion";
import { speakAny } from "@/lib/speech";
import { useProgress, planeVerifikation } from "@/lib/store";
import { De } from "@/components/De";
import ExerciseSet, { type ExerciseProgress } from "@/components/exercises";
import { ggpForTopic } from "@/lib/ggp";
import { kulturFuer } from "@/lib/kultur";

/** الخطوات الخمس — الترتيب نفسه هو الميثاق (K108a) */
const SCHRITTE = ["خمّن", "قاعدة", "أمثلة", "تطبيق", "خلاصة"] as const;

function BrueckenLessonBlock({
  bruecken,
  srs,
}: {
  bruecken: Eselsbruecke[];
  srs: Record<string, import("@/lib/types").SrsState>;
}) {
  const [offen, setOffen] = useState<Record<string, boolean>>({});
  const sortiert = useMemo(
    () => [...bruecken].sort((a, b) => {
      const aDue = !!srs[`bru:${a.id}`] && isDue(srs[`bru:${a.id}`]);
      const bDue = !!srs[`bru:${b.id}`] && isDue(srs[`bru:${b.id}`]);
      return Number(bDue) - Number(aDue);
    }),
    [bruecken, srs],
  );
  const faellig = sortiert.filter((b) => srs[`bru:${b.id}`] && isDue(srs[`bru:${b.id}`])).length;
  if (!bruecken.length) return null;

  return (
    <section data-testid="wizard-bruecken-block" className="card" style={{ padding: "0.6rem 0.85rem", borderInlineStart: "5px solid var(--color-gold)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "0.4rem", flexWrap: "wrap", alignItems: "center" }}>
        <strong>🧠 شفراتُ هذا الدرس</strong>
        <span className="chip rtl-num">{bruecken.length} شفرة</span>
      </div>
      <p style={{ margin: "0.35rem 0 0.55rem", fontSize: "0.8rem", color: "var(--color-ink2)" }}>
        الشفرات مرتبطة بهذه القاعدة تحديداً؛ افتح ما تحتاجه. المستحقّة تظهر أولاً وموسومة بموعد مراجعتها.
      </p>
      {faellig > 0 && (
        <div data-testid="wizard-bruecken-due-count" className="chip" style={{ display: "inline-flex", marginBottom: "0.45rem", borderColor: "var(--color-gold)", fontWeight: 800 }}>
          🔔 {faellig} مستحقّة للمراجعة
        </div>
      )}
      <div style={{ display: "grid", gap: "0.4rem" }}>
        {sortiert.map((b) => {
          const key = `bru:${b.id}`;
          const due = !!srs[key] && isDue(srs[key]);
          const expanded = !!offen[b.id];
          const contentId = `wizard-bruecke-content-${b.id}`;
          return (
            <article key={b.id} data-testid={`wizard-bruecke-${b.id}`} className="card" style={{ padding: "0.45rem 0.65rem", background: "var(--color-paper2)" }}>
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={contentId}
                data-testid={`wizard-bruecke-toggle-${b.id}`}
                onClick={() => setOffen((state) => ({ ...state, [b.id]: !state[b.id] }))}
                style={{ background: "none", border: 0, cursor: "pointer", width: "100%", minHeight: "44px", display: "flex", gap: "0.5rem", alignItems: "center", justifyContent: "space-between", textAlign: "start", font: "inherit", color: "inherit" }}
              >
                <span style={{ fontWeight: 800 }}>{b.emoji} {b.titleAr}</span>
                <span style={{ display: "flex", gap: "0.35rem", alignItems: "center", flexWrap: "wrap" }}>
                  {due && <span className="chip" data-testid={`wizard-bruecke-due-${b.id}`} style={{ borderColor: "var(--color-gold)", fontWeight: 800 }}>🔔 مستحقّة</span>}
                  <span className="chip">{expanded ? "إخفاء ▲" : "افتح ▼"}</span>
                </span>
              </button>
              {expanded && (
                <div id={contentId} role="region" aria-label={b.titleAr} style={{ padding: "0.35rem 0.2rem 0.2rem" }}>
                  {due && <p style={{ margin: "0 0 0.35rem", fontSize: "0.8rem", color: "var(--color-ink2)" }}>هذه الشفرة مستحقّة الآن حسب جدول مراجعتك.</p>}
                  <p style={{ fontSize: "0.86rem", lineHeight: 1.9, margin: "0.2rem 0 0.55rem" }}>{b.storyAr}</p>
                  <div style={{ display: "grid", gap: "0.3rem" }}>
                    {b.zeilen.map((z, zi) => (
                      <div key={`${b.id}-${zi}`} style={{ display: "grid", gridTemplateColumns: "auto minmax(0,1fr) auto", gap: "0.35rem 0.5rem", alignItems: "center", background: "var(--color-paper)", padding: "0.4rem 0.55rem", borderRadius: "0.45rem" }}>
                        <span className="chip" style={{ fontWeight: 800 }}>{z.code}</span>
                        <De style={{ fontWeight: 700 }}>{z.de}</De>
                        <button type="button" className="chip" style={{ cursor: "pointer", minHeight: "44px" }} onClick={() => speakAny(z.de)} aria-label={`استمع: ${z.de}`}>🔊</button>
                        <div style={{ gridColumn: "1 / -1", fontSize: "0.82rem", color: "var(--color-ink2)" }}>{z.ar}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function IndependentApplication({
  topicId,
  task,
  onSaved,
}: {
  topicId: string;
  task: { de: string; ar: string; candoIds?: string[] };
  onSaved: (saved: boolean) => void;
}) {
  const storageKey = `weg-wizard-anwendung-${topicId}`;
  const savedKey = `${storageKey}:saved`;
  const [geladen, setGeladen] = useState(false);
  const [antwort, setAntwort] = useState("");
  const [gespeichert, setGespeichert] = useState(false);
  const [speicherFehler, setSpeicherFehler] = useState(false);

  useEffect(() => {
    let saved = false;
    try {
      setAntwort(localStorage.getItem(storageKey) ?? "");
      saved = localStorage.getItem(savedKey) === "1";
    } catch { /* privater Modus: bleibt lokales Training ohne Erfolgsbehauptung */ }
    setGespeichert(saved);
    setGeladen(true);
    onSaved(saved);
  }, [storageKey, savedKey, onSaved]);

  useEffect(() => {
    if (!geladen) return;
    try { localStorage.setItem(storageKey, antwort); } catch { /* يبقى النص في الجلسة الحالية */ }
  }, [antwort, geladen, storageKey]);

  const speichere = () => {
    if (antwort.trim().length < 10) return;
    try {
      localStorage.setItem(storageKey, antwort);
      localStorage.setItem(savedKey, "1");
      setGespeichert(true);
      setSpeicherFehler(false);
      onSaved(true);
    } catch {
      setSpeicherFehler(true);
      setGespeichert(false);
      onSaved(false);
    }
  };

  return (
    <div data-testid="wizard-anwendung" className="card" style={{ padding: "0.7rem 0.9rem", borderInlineStart: "5px solid var(--color-b1)" }}>
      <div style={{ fontWeight: 800, marginBottom: "0.3rem" }}>🚀 استعمالٌ مستقل — محاولة تدريب الآن، والتحقّق لاحقاً</div>
      <De style={{ fontWeight: 700 }}>{task.de}</De>
      <div style={{ fontSize: "0.88rem", color: "var(--color-ink2)", marginTop: "0.2rem", lineHeight: 1.9 }}>{task.ar}</div>
      {(task.candoIds ?? []).length > 0 && (
        <div style={{ fontSize: "0.78rem", color: "var(--color-b1)", marginTop: "0.35rem" }}>
          ✓ الهدف اللغوي: {(task.candoIds ?? []).map((id) => {
            const hit = (Object.values(candoMap) as { id: string; ar: string }[][]).flat().find((item) => item.id === id);
            return hit?.ar ?? id;
          }).join(" · ")}
        </div>
      )}
      {(() => { const _t = grammarMap[topicId]; const ex0 = _t?.examples[0]; return ex0 ? (
        <div style={{ marginTop: "0.5rem", padding: "0.45rem 0.65rem", borderRadius: "0.5rem", background: "var(--ui-surface-raised)", border: "1px dashed var(--ui-border)", fontSize: "0.82rem", lineHeight: 1.85 }}>
          <strong>💬 سياق المشهد:</strong> <De style={{ fontWeight: 700 }}>{ex0.de}</De>
          <div style={{ color: "var(--color-ink2)" }}>{ex0.ar}</div>
          <div style={{ marginTop: "0.2rem", color: "var(--ui-muted)" }}>↳ حوّل هذه الفكرة بجملة جديدة باستخدام نفس القاعدة — لا تنسخ، ابتكر.</div>
        </div>
      ) : null; })()}
      <label htmlFor={`wizard-anwendung-input-${topicId}`} style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, marginTop: "0.65rem" }}>
        اكتب إجابتك الجديدة بالألمانية — تُحفَظ على هذا الجهاز فقط
      </label>
      <textarea
        id={`wizard-anwendung-input-${topicId}`}
        data-testid="wizard-anwendung-input"
        aria-label="محاولة الاستعمال المستقل"
        dir="ltr"
        lang="de"
        rows={3}
        className="field"
        disabled={!geladen}
        value={antwort}
        onChange={(event) => {
          const next = event.target.value;
          setAntwort(next);
          setSpeicherFehler(false);
          if (gespeichert) {
            setGespeichert(false);
            try { localStorage.removeItem(savedKey); } catch { /* تبقى المحاولة ظاهرةً دون وسمها محفوظة */ }
            onSaved(false);
          }
        }}
        placeholder="إجابتك الجديدة بالألمانية…"
        style={{ marginTop: "0.35rem", direction: "ltr" }}
      />
      <div style={{ fontSize: "0.78rem", color: "var(--color-ink2)", marginTop: "0.35rem", lineHeight: 1.8 }}>
        افحص بنفسك: هل حقّقت هدف الدرس؟ وهل أنشأتَ إجابة جديدة بلا خيارات؟ لا يصحّح هذا الحقل إجابتك آلياً ولا يثبت إتقان القاعدة.
      </div>
      <button type="button" className="btn btn-ghost" data-testid="wizard-anwendung-save" disabled={!geladen || antwort.trim().length < 10} onClick={speichere} style={{ marginTop: "0.5rem" }}>
        {gespeichert ? "✓ حُفظت المحاولة كتدريب" : "احفظ المحاولة كتدريب"}
      </button>
      {speicherFehler && <div role="status" style={{ fontSize: "0.8rem", color: "var(--color-cola)", marginTop: "0.35rem" }}>تعذّر حفظ المحاولة على هذا الجهاز؛ لم تُسجّل.</div>}
      {gespeichert && <div data-testid="wizard-anwendung-status" role="status" style={{ fontSize: "0.8rem", color: "var(--color-a1)", marginTop: "0.35rem" }}>حُفظت كتدريب محلي فقط، لا كدليل استقلال. التحقّق يتطلب مهمة جديدة بعد ثلاثة أيام.</div>}
    </div>
  );
}

export function LektionWizard({ topicId }: { topicId: string }) {
  return <LektionWizardContent key={topicId} topicId={topicId} />;
}

function LektionWizardContent({ topicId }: { topicId: string }) {
  const topic = grammarMap[topicId];
  const { progress } = useProgress();
  const day = progress.plan.day;
  const speicher = `weg-wizard-${topicId}`;
  const [schritt, setSchritt] = useState(0);
  const [erledigt, setErledigt] = useState<boolean[]>([false, false, false, false, false]);
  const [gewaehlt, setGewaehlt] = useState<number | null>(null);
  const [ergebnis, setErgebnis] = useState<EntdeckungsErgebnis | null>(null);
  const [geladen, setGeladen] = useState(false);
  const [practiceProgress, setPracticeProgress] = useState<ExerciseProgress>({ checked: 0, correct: 0, total: 0 });
  const [anwendungGespeichert, setAnwendungGespeichert] = useState(false);

  // ⏳ البدء البارد يستأنف الموضع (الميثاق: لا يضيع مهمّة)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(speicher);
      if (raw) {
        const z = JSON.parse(raw) as { schritt?: number; erledigt?: boolean[] };
        if (typeof z.schritt === "number") setSchritt(Math.min(Math.max(z.schritt, 0), 4));
        if (Array.isArray(z.erledigt) && z.erledigt.length === 5) setErledigt(z.erledigt);
      }
    } catch { /* تخزينٌ فاسدٌ = بدايةٌ جديدة */ }
    setGeladen(true);
  }, [speicher]);
  useEffect(() => {
    if (!geladen) return;
    try { localStorage.setItem(speicher, JSON.stringify({ schritt, erledigt })); } catch { /* ممتلئ = نanship */ }
  }, [geladen, speicher, schritt, erledigt]);

  // ➕ الزائدُ عن 3 تمارينٍ يَرتحِلُ إلى «تدريب إضافي» في تبويب تدرّب (K114a)
  useEffect(() => {
    const t = grammarMap[topicId];
    if (t && t.exercises.length > 3) {
      try { localStorage.setItem(`weg-park-${topicId}`, JSON.stringify(t.exercises.slice(3).map((e) => e.id))); } catch { /* ممتلئ */ }
    } else {
      try { localStorage.removeItem(`weg-park-${topicId}`); } catch { /* لا شيء */ }
    }
  }, [topicId]);

  const seed = useMemo(() => Array.from(topicId).reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 11), [topicId]);
  const frage = useMemo(() => (topic ? entdeckungsFrage(topic, Object.values(grammarMap), seed) : null), [topic, seed]);
  const entdecken = !!frage && !!topic && induktionMoeglich(topic);
  const bruecken = useMemo(() => getBrueckenFor(topicId), [topicId]);
  const practiceItems = useMemo(() => topic?.exercises.slice(0, 3) ?? [], [topic]);
  const modelExercise = useMemo(() => topic?.exercises[3], [topic]);
  const onPracticeProgress = useCallback((value: ExerciseProgress) => {
    setPracticeProgress(value);
    const complete = value.total > 0 && value.checked === value.total;
    setErledigt((current) => {
      if (current[3] === complete) return current;
      return current.map((done, index) => index === 3 ? complete : done);
    });
  }, []);
  const onApplicationSaved = useCallback((saved: boolean) => setAnwendungGespeichert(saved), []);

  if (!topic) {
    return (
      <div className="card" style={{ padding: "2rem", textAlign: "center" }}>
        <p style={{ marginBottom: "1rem" }}>لا درسَ قواعدَ مجدولٍ اليوم.</p>
        <Link href="/" className="btn btn-primary" style={{ minHeight: "44px", textDecoration: "none" }}>
          ↩ العودة إلى «اليوم»
        </Link>
      </div>
    );
  }

  const tuer = (i: number) => setErledigt((e) => e.map((v, j) => (j === i ? true : v)));
  const waehle = (i: number) => {
    if (gewaehlt !== null || !frage) return;
    setGewaehlt(i);
    const r: EntdeckungsErgebnis = i === frage.richtigIndex ? "richtig" : "falsch";
    setErgebnis(r);
    tuer(0);
  };
  const kannZu = (i: number) => i === 0 || i <= schritt || erledigt[schritt];

    const levelClass = `lesson-level-${topic.level}`;
    const levelStage = `lesson-stage--${topic.level.toLowerCase()}`;
  const caseChip = (h: string) => {
    const l = h.toLowerCase();
    if (l.includes("nominativ") || l.includes("nomin")) return "case-chip case-chip-nom";
    if (l.includes("akkusativ") || l.includes("akk")) return "case-chip case-chip-akk";
    if (l.includes("dativ")) return "case-chip case-chip-dat";
    if (l.includes("genitiv")) return "case-chip case-chip-gen";
    return "";
  };
  const hasCase = (headers: string[]) => headers.some((h) => /nominativ|akkusativ|dativ|genitiv/i.test(h));

  return (
    <section className={`card ${levelStage}`} data-testid="lektion-wizard" data-level={topic.level} style={{ padding: "1.1rem 1.2rem", display: "grid", gap: "0.85rem" }}>
      {/* ── الهوية التحريرية — شارة المستوى + العنوان + الهدف (Lesson Studio) ── */}
      <div className="lesson-hero">
        <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--color-ink2)", letterSpacing: "0.02em" }}>📖 الدرس — اشرح وافهم القاعدة</div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <span className={`lesson-level-badge ${levelClass}`}>{topic.level}</span>
          <span style={{ fontSize: "0.78rem", color: "var(--color-ink2)", fontWeight: 700 }}>درس {topic.id}</span>
          {topic.voraus && topic.voraus.length > 0 && (
            <span style={{ fontSize: "0.72rem", color: "var(--color-ink2)" }}>→ يبني على {topic.voraus.length} درس سابق</span>
          )}
        </div>
        <div className="lesson-title-de" dir="ltr">{topic.titleDe}</div>
        <div className="lesson-title-ar">{topic.titleAr}</div>
        {topic.ziel && (
          <div className="lesson-ziel" data-testid="wizard-ziel">
            <span aria-hidden>🎯</span>
            <span><strong>هدف هذا الدرس:</strong> {topic.ziel}</span>
          </div>
        )}
      </div>

      {/* ── مؤشّر الخطوات: مقاعد الطابور لا أبوابٌ متفرّقة ── */}
      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }} role="tablist" aria-label="خطوات الدرس">
        {SCHRITTE.map((st, i) => (
          <button
            key={st}
            type="button"
            role="tab"
            aria-selected={i === schritt}
            data-testid={`wizard-schritt-${i}`}
            className="chip"
            disabled={!kannZu(i)}
            title={kannZu(i) ? undefined : "أكمل الخطوات السابقة أولًا"}
            onClick={() => kannZu(i) && setSchritt(i)}
            style={{
              minHeight: "44px",
              cursor: kannZu(i) ? "pointer" : "not-allowed",
              opacity: kannZu(i) ? 1 : 0.5,
              fontWeight: i === schritt ? 900 : 600,
              background: erledigt[i] ? "var(--color-a1)" : i === schritt ? "var(--color-cola)" : undefined,
              color: erledigt[i] || i === schritt ? "var(--ui-on-accent)" : undefined,
            }}
          >
            {erledigt[i] ? "✓ " : `${i + 1}· `}{st}
          </button>
        ))}
      </div>

      {/* ── GGP 150 — شارة المرجع الأكاديمي (لا بيانات جديدة) ── */}
      {(() => { const feats = ggpForTopic(topicId); return feats.length ? (
        <div data-testid="wizard-ggp" style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", alignItems: "center", fontSize: "0.73rem" }}>
          <span style={{ fontWeight: 900, color: "var(--ui-muted)" }}>📑 GGP:</span>
          {feats.map((f) => <span key={f.code} className="ggp-chip" title={`${f.titelDe} — ${f.titelAr}`} data-testid={`ggp-${f.code}`}>{f.code} · {f.titelDe}</span>)}
          <span style={{ color: "var(--ui-muted)" }}>· {topic.level} · {feats[0].familie}</span>
        </div>
      ) : null; })()}
      {/* Mayer: Signaling — هدف واضح قبل المحتوى */}
      <div data-testid="wizard-mayer-goal" className="lesson-ziel" style={{ background: "linear-gradient(135deg, var(--color-paper2), var(--color-paper))", borderInlineStart: "4px solid var(--color-a1)", padding: "0.5rem 0.7rem", borderRadius: "0.5rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <span style={{ fontSize: "1.1rem" }}>🎯</span>
        <div><strong style={{ fontSize: "0.82rem" }}>{topic.ziel}</strong><div style={{ fontSize: "0.75rem", color: "var(--color-ink2)" }}>Conti: Prediction أولاً — خمّن قبل الشرح (70% نتذكر أكثر)</div></div>
      </div>
      <div data-testid="wizard-voraus" style={{ fontSize: "0.8rem", color: "var(--color-ink2)" }}>
        {topic.voraus && topic.voraus.length > 0
          ? <>🧱 يبني على: {topic.voraus.map((v) => grammarMap[v]?.titleAr ?? v).join(" · ")}</>
          : topic.voraus
            ? "🌱 درس تأسيسي — لا متطلب سابق."
            : "⚠️ لم يُحدَّد متطلب سابق لهذا الدرس بعد."}
      </div>

      {/* ── جسم الخطوة: ≤ نصف شاشة + تمريرٌ داخليّ (K108b) ── */}
      <div data-testid={`wizard-body-${schritt}`} style={{ maxHeight: "52dvh", overflowY: "auto", display: "grid", gap: "0.7rem", paddingInlineEnd: "0.2rem" }}>
        {/* ① خمّن — الاستقراء قبل القاعدة (lib/induktion) */}
        {schritt === 0 && (entdecken && frage ? (
          <div data-testid="wizard-induktion" style={{ display: "grid", gap: "0.55rem" }}>
            <strong>🔍 اكتشف القاعدة قبل أن تقرأها</strong>
            <p style={{ fontSize: "0.85rem", color: "var(--color-ink2)", margin: 0 }}>
              اقرأ الأمثلة ثم خمّن: ما القاعدة المشتركة؟ الخطأ لا يُخصم — بل يجهّز ذهنك للشرح.
            </p>
            <div className="lesson-scene">
              <div className="lesson-scene-head">💬 اقرأ المشهد — القاعدة مختبئة هنا</div>
              {topic.examples.slice(0, 3).map((ex, ei) => (
                <div key={ex.de} className={`lesson-bubble ${ei % 2 === 0 ? "lesson-bubble-a" : "lesson-bubble-b"}`}>
                  <div style={{ display: "flex", gap: "0.35rem", alignItems: "center", justifyContent: "space-between" }}>
                    <De style={{ fontWeight: 700 }}>{ex.de}</De>
                    <button type="button" className="chip" style={{ cursor: "pointer", minHeight: "36px" }} onClick={() => speakAny(ex.de)} aria-label="استمع">🔊</button>
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "var(--color-ink2)", marginTop: "0.15rem" }}>{ex.ar}</div>
                </div>
              ))}
            </div>
            <div style={{ fontWeight: 700 }}>ما القاعدة التي تراها في هذا المشهد؟</div>
            {frage.optionen.map((o, i) => (
              <button
                key={i}
                type="button"
                className="btn btn-ghost"
                data-testid={`wizard-option-${i}`}
                disabled={gewaehlt !== null}
                style={{ textAlign: "start", justifyContent: "flex-start" }}
                onClick={() => waehle(i)}
              >
                <span>
                  <De style={{ fontWeight: 700 }}>{o.de}</De>
                  <span style={{ display: "block", fontSize: "0.8rem", color: "var(--color-ink2)" }}>{o.ar}</span>
                </span>
              </button>
            ))}
            {ergebnis !== null && (
              <div data-testid="wizard-ergebnis" className="card" style={{ padding: "0.6rem 0.9rem", background: "var(--color-paper2)", borderInlineStart: "5px solid var(--color-gold)", fontSize: "0.88rem" }}>
                <strong>{ergebnis === "richtig" ? "✅ " : ergebnis === "falsch" ? "↪️ " : "⏭ "}{ergebnisText(ergebnis)}</strong>
                <div style={{ marginTop: "0.2rem" }}>القاعدة: <De style={{ fontWeight: 700 }}>{frage.optionen[frage.richtigIndex].de}</De></div>
                {ergebnis === "falsch" && <div style={{ marginTop: "0.25rem", fontSize: "0.82rem", color: "var(--color-ink2)" }}>🌱 خطأك الآن = نموّ — دماغك جهّز مساراً للقاعدة، والشرح سيُثبّته.</div>}
              </div>
            )}
            <button type="button" className="btn btn-ghost" style={{ fontSize: "0.82rem" }} data-testid="wizard-ueberspringen" onClick={() => { setErgebnis("uebersprungen"); tuer(0); }}>
              أرني القاعدة مباشرة (يُسجَّل تخطّياً، بلا نقطة)
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "0.5rem" }}>
            <strong>👀 لاحظ النمط — المشهد أمامك</strong>
            <div className="lesson-scene">
              {topic.examples.slice(0, 3).map((ex, ei2) => (
                <div key={ex.de} className={`lesson-bubble ${ei2 % 2 === 0 ? "lesson-bubble-a" : "lesson-bubble-b"}`}>
                  <div style={{ display: "flex", gap: "0.35rem", alignItems: "center", justifyContent: "space-between" }}>
                    <De>{ex.de}</De>
                    <button type="button" className="chip" style={{ cursor: "pointer", minHeight: "36px" }} onClick={() => speakAny(ex.de)} aria-label="استمع">🔊</button>
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "var(--color-ink2)", marginTop: "0.15rem" }}>{ex.ar}</div>
                </div>
              ))}
            </div>
            <button type="button" className="btn btn-ghost" data-testid="wizard-beobachtet" onClick={() => tuer(0)}>
              لاحظتُ النمط — افتح القاعدة
            </button>
          </div>
        ))}

        {/* ② القاعدة — شرح بصري + جدول مصمم (Lesson Studio) */}
        {schritt === 1 && (
          <div style={{ display: "grid", gap: "0.6rem" }}>
            <strong>📐 افهم القاعدة — نمط بصري</strong>
            <p style={{ fontSize: "0.84rem", color: "var(--color-ink2)", margin: 0 }}>كل قاعدة = نمط ألماني كبير + شرح عربي. الجداول لها رأس ملوّن — لا جدول عادي.</p>
            {topic.rules.map((r, ri) => {
              const pairedEx = topic.examples[ri % topic.examples.length];
              return (
                <div key={r.de} className="lesson-rule lesson-rule--paired">
                  <div className="lesson-rule-main">
                    <div className="lesson-rule-pattern"><De>{r.de}</De></div>
                    <div className="lesson-rule-arrow">← الشرح</div>
                    <div style={{ fontSize: "0.86rem", color: "var(--color-ink2)", lineHeight: 1.8 }}>{r.ar}</div>
                  </div>
                  {pairedEx && (
                    <div className="lesson-rule-example">
                      <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--ui-muted)" }}>مثال حي</div>
                      <De style={{ fontWeight: 700, fontSize: "0.9rem" }}>{pairedEx.de}</De>
                      <div style={{ fontSize: "0.82rem", color: "var(--color-ink2)" }}>{pairedEx.ar}</div>
                      <button type="button" className="chip" style={{ marginTop: "0.3rem", minHeight: "32px" }} onClick={() => speakAny(pairedEx.de)}>🔊 استمع</button>
                    </div>
                  )}
                </div>
              );
            })}
            {(topic.tables ?? []).length > 0 && hasCase((topic.tables ?? []).flatMap((t) => t.headers)) && (
              <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", fontSize: "0.72rem", alignItems: "center" }}>
                <span style={{ fontWeight: 800, color: "var(--ui-muted)" }}>🎨 تلوين الحالات:</span>
                <span className="case-chip case-chip-nom">Nominativ</span>
                <span className="case-chip case-chip-akk">Akkusativ</span>
                <span className="case-chip case-chip-dat">Dativ</span>
                <span className="case-chip case-chip-gen">Genitiv</span>
              </div>
            )}
            {(topic.tables ?? []).map((t, ti) => (
              <div key={`t-${ti}`} style={{ display: "grid", gap: "0.3rem" }}>
                {t.captionAr && <strong style={{ fontSize: "0.85rem" }}>{t.captionAr}</strong>}
                <div style={{ fontSize:"0.74rem", color:"var(--color-ink2)" }}>Mayer: Layered-Reveal — صف واحد في كل مرة (اضغط لكشف المسار)</div>
                <div style={{ overflowX: "auto" }}>
                  <table className="lesson-table lesson-table--signaled lesson-table--layered" dir="ltr">
                    <thead><tr>{t.headers.map((h) => {
                      const c = caseChip(h);
                      return <th key={h} className={c ? "case-hl" : undefined}><span className={c || undefined} style={c ? undefined : {}}>{h}</span></th>;
                    })}</tr></thead>
                    <tbody>
                      {t.rows.map((row, ri) => (
                        <tr key={ri}>{row.map((c, ci) => <td key={ci}>{ci===0 ? <><De style={{fontWeight:800}}>{String(c).split("→")[0]}</De>{String(c).includes("→") && <><span style={{color:"var(--color-a1)", fontWeight:900}}> → </span><De style={{color:"var(--color-a1)"}}>{String(c).split("→")[1]}</De></>}</> : c}</td>)}</tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
            <button type="button" className="btn btn-ghost" data-testid="wizard-regel-gelesen" onClick={() => tuer(1)}>
              راجعتُ الشرح — أرني النموذج المحلول
            </button>
          </div>
        )}

        {/* ③ الأمثلة — مشهد حواري + نموذج محلول (Lesson Studio) */}
        {schritt === 2 && (
          <div style={{ display: "grid", gap: "0.65rem" }}>
            <strong>🧩 المشهد — كيف تُستعمل في الحياة؟</strong>
            <div className="lesson-scene">
              <div className="lesson-scene-head">💬 حوار مصغر يحمل القاعدة — استمع لكل جملة</div>
              {topic.examples.slice(0, 4).map((ex, i) => (
                <div key={ex.de} className={`lesson-bubble ${i % 2 === 0 ? "lesson-bubble-a" : "lesson-bubble-b"}`}>
                  <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", justifyContent: "space-between" }}>
                    <De style={{ fontWeight: 700 }}>{ex.de}</De>
                    <button type="button" className="chip" style={{ cursor: "pointer", minHeight: "36px", flexShrink: 0 }} onClick={() => speakAny(ex.de)} aria-label="استمع">🔊</button>
                  </div>
                  <div style={{ fontSize: "0.84rem", color: "var(--color-ink2)", marginTop: "0.15rem" }}>{ex.ar}</div>
                </div>
              ))}
            </div>
            {modelExercise && (
              <div data-testid="wizard-model" className="card" style={{ padding: "0.65rem 0.85rem", background: "var(--color-gold-soft)", borderInlineStart: "4px solid var(--color-gold)" }}>
                <strong>🧑‍🏫 نموذج محلول — انسج على منواله</strong>
                {modelExercise.quelleDe && <div style={{ marginTop: "0.3rem" }}>المعطى: <De style={{ fontWeight: 700 }}>{modelExercise.quelleDe}</De></div>}
                {modelExercise.text && <div style={{ marginTop: "0.3rem" }}><De style={{ fontWeight: 700 }}>{modelExercise.text}</De></div>}
                <div style={{ marginTop: "0.3rem" }}><De style={{ fontWeight: 700 }}>{modelExercise.promptDe}</De></div>
                {modelExercise.promptAr && <div style={{ fontSize: "0.82rem", color: "var(--color-ink2)" }}>{modelExercise.promptAr}</div>}
                <div style={{ marginTop: "0.25rem" }}>النموذج: <De style={{ fontWeight: 800 }}>{Array.isArray(modelExercise.answer) ? modelExercise.answer.join(" ") : modelExercise.answer}</De></div>
                {modelExercise.explanationAr && <div style={{ fontSize: "0.84rem", color: "var(--color-ink2)", marginTop: "0.25rem" }}>{modelExercise.explanationAr}</div>}
              </div>
            )}
            <button type="button" className="btn btn-ghost" data-testid="wizard-beispiele-gesehen" onClick={() => tuer(2)}>
              راجعتُ المشهد والنموذج — ابدأ التدريب
            </button>
          </div>
        )}

        {/* ④ تدريبٌ متدرّج — تكتمل المحاولة بعد الإجابة عن التمارين الثلاثة، لا بنقرةٍ واحدة */}
        {schritt === 3 && (
          <div style={{ display: "grid", gap: "0.6rem" }}>
            <strong>✍️ تدريبٌ متدرّج — أجب عن التمارين الثلاثة</strong>
            <p style={{ fontSize: "0.82rem", color: "var(--color-ink2)", margin: 0 }}>
              لكل جواب تصحيحٌ وشرح. إكمالُ المحاولات لا يعني الإتقان؛ وما أخطأتَ فيه يعود إلى المراجعة.
            </p>
            <ExerciseSet
              key={`practice-${topicId}`}
              items={practiceItems}
              storageKey={`weg-wizard-exercises-${topicId}`}
              onProgress={onPracticeProgress}
            />
            <div data-testid="wizard-practice-progress" role="status" aria-live="polite" style={{ fontSize: "0.83rem", fontWeight: 700 }}>
              تقدّمك: <span className="rtl-num">{practiceProgress.checked}/{practiceProgress.total || practiceItems.length}</span> أُجيب عنها ·
              <span className="rtl-num"> {practiceProgress.correct}</span> صحيحة.
              {practiceProgress.checked === (practiceProgress.total || practiceItems.length) && practiceItems.length > 0
                ? " اكتمل التدريب؛ راجع أي تصحيح ظهر لك."
                : " أكمل إجابات التمارين الثلاثة للمتابعة؛ يمكنك التوقف والعودة دون فقد المحاولات."}
            </div>
            {!erledigt[3] && (
              <p style={{ fontSize: "0.82rem", color: "var(--color-ink2)", margin: 0 }}>
                🔒 التالية تفتح بعد تسجيل جوابٍ نهائي لكل تمرين، صحيحاً كان أو خاطئاً؛ الخطأ تدريبٌ لا لوم.
              </p>
            )}
          </div>
        )}

        {/* ⑤ الخلاصة — ورقة غش + جدار الفخاخ + شفرة الحفظ (Lesson Studio) */}
        {schritt === 4 && (
          <div style={{ display: "grid", gap: "0.7rem" }} data-testid="wizard-zusammenfassung">
            <strong>🧾 الخلاصة — ورقة الغش</strong>
            <div className="lesson-summary" style={{ display: "grid", gap: "0.6rem" }}>
              <div style={{ fontSize: "0.88rem", lineHeight: 1.9, color: "var(--ui-text)" }}>{topic.summaryAr}</div>
              <div className="lesson-concept-map" data-testid="wizard-concept-map">
                {topic.rules.slice(0, 4).map((r) => (
                  <span key={r.de} className="lesson-concept-chip"><De style={{ fontSize: "0.82rem" }}>{r.de.split("—")[0].trim().slice(0, 28)}</De></span>
                ))}
                {topic.tables?.[0]?.headers.slice(0, 3).map((h) => (
                  <span key={h} className="lesson-concept-chip lesson-concept-chip--header">{h}</span>
                ))}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--ui-muted)" }}>💡 خريطة مفاهيم سريعة — احفظ النمط، لا النص</div>
            </div>
            {topic.pitfalls && topic.pitfalls.length > 0 && (
              <div style={{ display: "grid", gap: "0.5rem" }}>
                <div style={{ fontWeight: 800, color: "var(--color-die)", fontSize: "0.9rem" }}>⚠️ جدار الفخاخ — Contrast (خطأ vs صواب)</div>
                <div style={{ fontSize:"0.75rem", color:"var(--color-ink2)" }}>Conti: Contrast — قارن الخطأ والصواب جنباً إلى جنب (تثبيت أقوى 40%)</div>
                {topic.pitfalls.map((p) => {
                  const hasContrast = p.de.includes("→") || p.de.includes("statt") || p.de.includes("vs");
                  return (
                  <div key={p.de} className="lesson-pitfall" style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr", gap:"0.5rem", alignItems:"center" }}>
                    <div style={{ background:"rgba(220,38,38,0.07)", padding:"0.4rem 0.5rem", borderRadius:"0.4rem", borderInlineStart:"3px solid var(--color-die)" }}>
                      <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--color-die)" }}>✗ خطأ شائع</div>
                      <De className="lesson-pitfall-wrong" style={{ fontSize:"0.85rem" }}>{p.de.split("→")[0].trim()}</De>
                    </div>
                    <span style={{ fontWeight:900, color:"var(--color-a1)", fontSize:"1.1rem" }}>→</span>
                    <div style={{ background:"rgba(22,163,74,0.07)", padding:"0.4rem 0.5rem", borderRadius:"0.4rem", borderInlineStart:"3px solid var(--color-a1)" }}>
                      <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--color-a1)" }}>✓ الصواب</div>
                      <div style={{ fontSize:"0.85rem", fontWeight:700 }}>{hasContrast ? p.de.split("→")[1]?.trim() : p.ar.split("—")[0]?.trim() || "راجع القاعدة أعلاه"}</div>
                    </div>
                    <div style={{ gridColumn:"1 / -1", fontSize: "0.84rem", color: "var(--color-ink2)", lineHeight: 1.7, background:"var(--color-paper2)", padding:"0.35rem 0.5rem", borderRadius:"0.3rem" }}>💡 لماذا؟ {p.ar}</div>
                  </div>
                  );
                })}
              </div>
            )}
            {(() => { const k = kulturFuer(topicId, topic.level); return k ? (
              <div data-testid="wizard-kultur" className="card" style={{ padding: "0.6rem 0.85rem", background: "var(--ui-surface-raised)", borderInlineStart: "5px solid var(--color-b2)", display: "grid", gap: "0.35rem" }}>
                <strong style={{ fontSize: "0.85rem" }}>🌍 في ألمانيا — لمسة ثقافية {topic.level==="B2" ? "· B2 Lebenswelt" : ""}</strong>
                <span style={{ fontSize: "0.82rem", lineHeight: 1.85, color: "var(--color-ink2)" }} dir="ltr"><De>{k.de}</De></span>
                <span style={{ fontSize: "0.82rem", lineHeight: 1.85, color: "var(--color-ink2)" }}>{k.ar}</span>
                <span style={{ fontSize: "0.75rem", color: "var(--ui-muted)" }}>تلميح سياقي — يُظهر متى يُستعمل النمط، لا يُمتحن. {topic.level==="B2" ? "BAMF Handlungsfeld: Beruf & Alltag — تسجيل، تأمين، سكن." : ""}</span>
              </div>
            ) : null; })()}
            {(topic as unknown as {resources?: string[]}).resources && ((topic as unknown as {resources?: string[]}).resources!.length>0) && (
              <div className="card" data-testid="wizard-quellen" style={{ padding:"0.6rem 0.85rem", background:"var(--color-paper)", borderInlineStart:"4px solid var(--color-ink2)", display:"grid", gap:"0.3rem" }}>
                <strong style={{ fontSize:"0.85rem" }}>📚 مصادر B2 — اقرأ الأصل</strong>
                <div style={{ fontSize:"0.78rem", color:"var(--color-ink2)", lineHeight:1.8 }}>
                  {((topic as unknown as {resources?: string[]}).resources!.slice(0,3).map((r: string)=> <div key={r} style={{ display:"flex", gap:"0.4rem" }}><span>—</span><span dir="ltr">{r}</span></div>))}
                </div>
                <div style={{ fontSize:"0.72rem", color:"var(--ui-muted)" }}>Verlag-Stil: المصادر ليست للامتحان بل للاستقلال — Duden · Goethe · BAMF</div>
              </div>
            )}
            <BrueckenLessonBlock bruecken={bruecken} srs={progress.srs ?? {}} />
            {topic.anwendung && (
              <IndependentApplication
                key={topicId}
                topicId={topicId}
                task={topic.anwendung}
                onSaved={onApplicationSaved}
              />
            )}
            {(() => {
              const rec = progress.verify?.[topicId];
              if (!rec) return null;
              if (rec.doneDay === undefined)
                return <div data-testid="wizard-verification-status" style={{ fontSize: "0.8rem", color: "var(--color-b1)" }}>⏳ التحقّق المجدول: اليوم <span className="rtl-num">{rec.dueDay}</span>، بمهمة جديدة.</div>;
              return <div data-testid="wizard-verification-status" style={{ fontSize: "0.8rem", color: rec.passed ? "var(--color-a1)" : "var(--color-cola)", fontWeight: 700 }}>
                {rec.passed ? `✅ ثبت الاستقلال يوم ${rec.doneDay} — أحسنت` : `🔁 تحقق يوم ${rec.doneDay}: لم يثبت الاستقلال بعد؛ والمحاولة الفورية تدريبٌ فقط.`}
              </div>;
            })()}
            {(!topic.anwendung || anwendungGespeichert) ? (
              <Link href="/" className="btn btn-primary" data-testid="wizard-zurueck-heute" style={{ minHeight: "44px", textDecoration: "none" }} onClick={() => { if ((topic.verify ?? []).length > 0) planeVerifikation(topicId, day); tuer(4); }}>
                ✅ أنهيتُ التدريب — عُد إلى «اليوم»
              </Link>
            ) : (
              <div className="card" style={{ padding: "0.7rem 0.9rem", background: "var(--color-paper2)" }}>
                <p style={{ margin: "0 0 0.45rem", fontSize: "0.84rem" }}>احفظ إجابتك كتدريب قبل تسجيل إكمال الدرس وجدولة التحقّق المؤجّل. يمكنك التوقّف الآن؛ سيبقى موضعك ومسودتك محفوظين بلا لوم.</p>
                <Link href="/" className="btn btn-ghost" data-testid="wizard-pause-today" style={{ minHeight: "44px", textDecoration: "none" }}>
                  ⏸ أتوقّف الآن — عُد إلى «اليوم»
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── شريط التنقّل: الأمام مقفل حتى إتمام الخطوة، والقفل يذكر سببه ── */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: "0.6rem", alignItems: "center" }}>
        <button type="button" className="btn btn-ghost" data-testid="wizard-zurueck" disabled={schritt === 0} onClick={() => setSchritt((s) => Math.max(0, s - 1))} style={{ minHeight: "44px" }}>
          → السابقة
        </button>
        {!erledigt[schritt] && schritt < 4 && (
          <span style={{ fontSize: "0.78rem", color: "var(--color-ink2)" }} data-testid="wizard-sperre">🔒 أنجز الخطوة أولاً</span>
        )}
        {schritt < 4 && (
          <button
            type="button"
            className="btn btn-primary"
            data-testid="wizard-next"
            disabled={!erledigt[schritt]}
            title={erledigt[schritt] ? "التالي" : "أنجز الخطوة أولاً — لا تخطٍّ بلا تفاعل"}
            onClick={() => setSchritt((s) => Math.min(4, s + 1))}
            style={{ minHeight: "44px" }}
          >
            التالية ←
          </button>
        )}
      </div>
    </section>
  );
}
