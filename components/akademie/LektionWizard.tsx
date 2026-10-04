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

  return (
    <section className="card" data-testid="lektion-wizard" style={{ padding: "1.1rem 1.2rem", display: "grid", gap: "0.8rem" }}>
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

      <div style={{ fontWeight: 900, fontSize: "1.05rem" }}>
        <span style={{ color: "var(--color-cola)" }}>{topic.titleAr}</span>
        {" — "}<De>{topic.titleDe}</De>
      </div>

      {/* ── 🎯 معيار الدرس: الهدف أولاً، ثم المتطلب السابق ── */}
      {topic.ziel && (
        <div data-testid="wizard-ziel" className="card" style={{ padding: "0.6rem 0.9rem", background: "var(--color-a1-soft)", borderInlineStart: "5px solid var(--color-a1)", fontSize: "0.9rem" }}>
          🎯 <strong>هدف هذا الدرس:</strong> {topic.ziel}
        </div>
      )}
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
            {topic.examples.map((ex) => (
              <div key={ex.de} style={{ borderInlineStart: "3px solid var(--color-gold)", paddingInlineStart: "0.7rem" }}>
                <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", flexWrap: "wrap" }}>
                  <De>{ex.de}</De>
                  <button type="button" className="chip" style={{ cursor: "pointer", minHeight: "44px" }} onClick={() => speakAny(ex.de)} aria-label="استمع">🔊</button>
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)" }}>{ex.ar}</div>
              </div>
            ))}
            <div style={{ fontWeight: 700 }}>ما القاعدة التي تراها في هذه الأمثلة؟</div>
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
              </div>
            )}
            <button type="button" className="btn btn-ghost" style={{ fontSize: "0.82rem" }} data-testid="wizard-ueberspringen" onClick={() => { setErgebnis("uebersprungen"); tuer(0); }}>
              أرني القاعدة مباشرة (يُسجَّل تخطّياً، بلا نقطة)
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "0.5rem" }}>
            <strong>👀 لاحظ النمط في الأمثلة</strong>
            {topic.examples.map((ex) => (
              <div key={ex.de} style={{ borderInlineStart: "3px solid var(--color-gold)", paddingInlineStart: "0.7rem" }}>
                <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", flexWrap: "wrap" }}>
                  <De>{ex.de}</De>
                  <button type="button" className="chip" style={{ cursor: "pointer", minHeight: "44px" }} onClick={() => speakAny(ex.de)} aria-label="استمع">🔊</button>
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)" }}>{ex.ar}</div>
              </div>
            ))}
            <button type="button" className="btn btn-ghost" data-testid="wizard-beobachtet" onClick={() => tuer(0)}>
              لاحظتُ النمط — افتح القاعدة
            </button>
          </div>
        ))}

        {/* ② القاعدة — ما يُشرح بعد الفجوة */}
        {schritt === 1 && (
          <div style={{ display: "grid", gap: "0.55rem" }}>
            <strong>📐 افهم القاعدة</strong>
            <p style={{ fontSize: "0.84rem", color: "var(--color-ink2)", margin: 0 }}>اقرأ القاعدة بالعربية والألمانية، ثم قارنها بالنموذج المحلول في الخطوة التالية.</p>
            {topic.rules.map((r) => (
              <div key={r.de} className="card" style={{ padding: "0.6rem 0.85rem", borderInlineStart: "5px solid var(--color-cola)" }}>
                <De style={{ fontWeight: 800 }}>{r.de}</De>
                <div style={{ fontSize: "0.88rem", color: "var(--color-ink2)", marginTop: "0.2rem" }}>{r.ar}</div>
              </div>
            ))}
            <button type="button" className="btn btn-ghost" data-testid="wizard-regel-gelesen" onClick={() => tuer(1)}>
              راجعتُ الشرح — أرني النموذج المحلول
            </button>
          </div>
        )}

        {/* ③ الأمثلة — ما شوهد في خطوة 1 يُثبَّت هنا مشروحاً */}
        {schritt === 2 && (
          <div style={{ display: "grid", gap: "0.55rem" }}>
            <strong>🧩 شاهد نموذجاً محلولاً، ثم قارن بالأمثلة</strong>
            {modelExercise && (
              <div data-testid="wizard-model" className="card" style={{ padding: "0.65rem 0.85rem", background: "var(--color-gold-soft)", borderInlineStart: "4px solid var(--color-gold)" }}>
                <strong>🧑‍🏫 نموذج محلول</strong>
                {modelExercise.quelleDe && <div style={{ marginTop: "0.3rem" }}>المعطى: <De style={{ fontWeight: 700 }}>{modelExercise.quelleDe}</De></div>}
                {modelExercise.text && <div style={{ marginTop: "0.3rem" }}><De style={{ fontWeight: 700 }}>{modelExercise.text}</De></div>}
                <div style={{ marginTop: "0.3rem" }}><De style={{ fontWeight: 700 }}>{modelExercise.promptDe}</De></div>
                {modelExercise.promptAr && <div style={{ fontSize: "0.82rem", color: "var(--color-ink2)" }}>{modelExercise.promptAr}</div>}
                <div style={{ marginTop: "0.25rem" }}>النموذج: <De style={{ fontWeight: 800 }}>{Array.isArray(modelExercise.answer) ? modelExercise.answer.join(" ") : modelExercise.answer}</De></div>
                {modelExercise.explanationAr && <div style={{ fontSize: "0.84rem", color: "var(--color-ink2)", marginTop: "0.25rem" }}>{modelExercise.explanationAr}</div>}
              </div>
            )}
            {topic.examples.map((ex, i) => (
              <div key={ex.de} className="card" style={{ padding: "0.55rem 0.8rem", borderInlineStart: i === 0 ? "3px solid var(--color-b1)" : undefined }}>
                {i === 0 && <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--color-b1)" }}>ابدأ بهذا المثال</div>}
                <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", flexWrap: "wrap" }}>
                  <De style={{ fontWeight: 700 }}>{ex.de}</De>
                  <button type="button" className="chip" style={{ cursor: "pointer", minHeight: "44px" }} onClick={() => speakAny(ex.de)} aria-label="استمع">🔊</button>
                </div>
                <div style={{ fontSize: "0.86rem", color: "var(--color-ink2)" }}>{ex.ar}</div>
              </div>
            ))}
            <button type="button" className="btn btn-ghost" data-testid="wizard-beispiele-gesehen" onClick={() => tuer(2)}>
              راجعتُ النموذج والأمثلة — ابدأ التدريب
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

        {/* ⑤ الخلاصة — الملخّص + الفخاخ + شفرة الحفظ (K110) */}
        {schritt === 4 && (
          <div style={{ display: "grid", gap: "0.65rem" }} data-testid="wizard-zusammenfassung">
            <strong>🧾 الخلاصة</strong>
            <div className="card" style={{ padding: "0.7rem 0.9rem", background: "var(--color-paper2)" }}>{topic.summaryAr}</div>
            {topic.pitfalls && topic.pitfalls.length > 0 && (
              <div className="card" style={{ padding: "0.6rem 0.85rem", borderInlineStart: "5px solid var(--color-die)" }}>
                <div style={{ fontWeight: 800, marginBottom: "0.3rem", color: "var(--color-die)" }}>⚠️ فخاخُ هذا الدرس الشائعة</div>
                {topic.pitfalls.map((p) => (
                  <div key={p.de} style={{ fontSize: "0.86rem", marginBottom: "0.35rem" }}>
                    <De style={{ textDecoration: "line-through", color: "var(--color-die)" }}>{p.de}</De>
                    <div style={{ color: "var(--color-ink2)" }}>{p.ar}</div>
                  </div>
                ))}
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
