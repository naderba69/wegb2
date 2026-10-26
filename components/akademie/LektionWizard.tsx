"use client";
/**
 * 🎓 معالج الدرس الخمسي — الوجهة «الدرس» (P2):
 * خمّن ← قاعدة ← أمثلة ← تطبيق ← خلاصة.
 *
 * الميثاق: كل خطوة ≤ نصف شاشة · الأمام مقفل حتى تفاعلٍ حقيقيّ (والقفل يذكر
 * سببه) · ≤3 تمارين في التطبيق · الخلاصة تجمع الملخّص والفخاخ وشفرة الحفظ ·
 * موضعك محفوظ (البدء البارد يستأنف مهمّته) · وباب الرجوع الوحيد «اليوم».
 */
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  const [layeredRevealed, setLayeredRevealed] = useState<Record<number, number>>({});
  const [pitfallRevealed, setPitfallRevealed] = useState<Record<number, boolean>>({});

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
  const GENITIV_RE = /\b(wegen|trotz|während|aufgrund|anstatt|statt|innerhalb|außerhalb|dessen|deren|des Regens|des Wetters|des Krieges|des Berichts|eines Briefes)\b/gi;
  const highlightGenitiv = (text: string) => {
    const parts: React.ReactNode[] = [];
    let last = 0;
    let m: RegExpExecArray | null;
    GENITIV_RE.lastIndex = 0;
    while ((m = GENITIV_RE.exec(text)) !== null) {
      if (m.index > last) parts.push(text.slice(last, m.index));
      parts.push(<span key={`${m.index}-${m[0]}`} className="case-chip case-chip-gen" style={{ fontSize: "0.82em", padding: "0.08rem 0.3rem" }}>{m[0]}</span>);
      last = m.index + m[0].length;
    }
    if (last < text.length) parts.push(text.slice(last));
    return parts.length > 1 ? <>{parts}</> : text;
  };
  // 🖼️ Mayer Dual-Coding + Paivio: Text + Bildanker in einem (Sprint 13) — مميز لكل نوع
  const dualCodingInfo = (() => {
    const id = topicId.toLowerCase();
    if (id.includes("wechsel") || id.includes("dativ-akk") || id.includes("dativ/akk")) return { icon: "📍➡️", label: "WO? Dativ (Ort) vs WOHIN? Akkusativ (Richtung) — عربي", de: "auf dem Tisch (Dativ, Ort) → auf den Tisch (Akk, Bewegung) — عربي" };
    if (id.includes("passiv")) return { icon: "🔄", label: "Aktiv → Passiv: Handelnder tritt zurück — عربي", de: "Der Arzt operiert → Es wird operiert (Passiv) — عربي" };
    if (id.includes("konzessiv") || id.includes("obwohl")) return { icon: "⚖️", label: "Kontrast: obwohl X, trotzdem Y — Konzession — عربي", de: "obwohl krank, kam er zur Arbeit — عربي" };
    if (id.includes("konjunktiv")) return { icon: "💭", label: "Wunsch / Unsicherheit → würde/könnte/sei — عربي", de: "Er sagt, er sei krank (Konjunktiv I) — عربي" };
    if (id.includes("relativ")) return { icon: "🔗", label: "Bezug: der/die/das → Nebensatz verbindet — عربي", de: "die Frau, die dort wohnt, … — عربي" };
    if (id.includes("nominal")) return { icon: "📦", label: "Verb → Nomen: Komprimierung (Nominalstil) — عربي", de: "entscheiden → die Entscheidung treffen — عربي" };
    if (id.includes("perfekt") || id.includes("praeteritum")) return { icon: "⏳", label: "Zeitachse: Vergangenheit markieren — عربي", de: "gestern habe ich … / ich war … — عربي" };
    if (id.includes("funktionsverb")) return { icon: "🧩", label: "Funktionsverb: leichtes Verb + starkes Nomen — عربي", de: "eine Entscheidung treffen (statt entscheiden) — عربي" };
    if (id.includes("genitiv") || id === "b2-n-deklination") return { icon: "👑", label: "Genitiv — Besitz & Zugehörigkeit (des/der) — عربي", de: "wegen des Wetters — trotz des Verbots — عربي" };
    if (id.includes("konnektor") || id.includes("konzessiv-2") || id.includes("b2-konnekt")) return { icon: "🔀", label: "Konnektoren: weil → obwohl → damit (Grund/Konzession/Zweck) — عربي", de: "weil es regnet, obwohl er Zeit hat, damit er versteht — عربي" };
    if (topic.level === "A0" || topic.level === "A1") return { icon: "🌱", label: "A0/A1 — أساس بصري + صوت لكل جملة — عربي", de: "Ich bin · Ich habe · Wie heißt du? — عربي" };
    if (topic.level === "B2") return { icon: "🎓", label: "B2 أكاديمي — Vergleich & Nominalstil — عربي", de: "Verbalstil ↔ Nominalstil — Prüfung: 250-500 Wörter — عربي" };
    return { icon: "🧠", label: "Muster: Regel → Beispiel → Anwendung — عربي", de: topic.titleDe };
  })();

  return (
    <section className={`card ${levelStage}`} data-testid="lektion-wizard" data-level={topic.level} style={{ padding: "1.1rem 1.2rem", display: "grid", gap: "0.85rem" }}>
      {/* ── هجين 1+3 — Dark Academy (قمة) + Verlag (جسم) ── */}
      <div className="lesson-hero">
        <div className="lesson-hero-dark">
          <div style={{ position:"relative", zIndex:1, display:"flex", gap:"0.5rem", alignItems:"center", flexWrap:"wrap", fontSize:"0.78rem", fontWeight:800, letterSpacing:"0.04em", opacity:0.9 }}>
            <span style={{ background:"rgb(255 255 255 / 0.14)", border:"1px solid rgb(255 255 255 / 0.22)", padding:"0.12rem 0.5rem", borderRadius:"999px", fontSize:"0.7rem" }}>📖 WEG VERLAG</span>
            <span className={`lesson-level-badge ${levelClass}`} style={{ background:"rgb(255 255 255 / 0.12)", color:"#fff", borderColor:"rgb(255 255 255 / 0.28)" }}>{topic.level}</span>
            <span style={{ color:"#B8C7E0", fontWeight:700 }}>· {topic.id}</span>
            {topic.voraus && topic.voraus.length > 0 && <span style={{ color:"#C8A84E", fontSize:"0.72rem" }}>→ يبني على {topic.voraus.length}</span>}
          </div>
          <div className="lesson-title-de" dir="ltr" style={{ position:"relative", zIndex:1, marginTop:"0.55rem" }}>{topic.titleDe}</div>
          <div className="lesson-title-ar" style={{ position:"relative", zIndex:1 }}>{topic.titleAr}</div>
          <div style={{ position:"relative", zIndex:1, marginTop:"0.45rem", fontSize:"0.72rem", color:"#9FB2CE", display:"flex", gap:"0.4rem", flexWrap:"wrap" }}>
            <span style={{ background:"rgb(200 168 78 / 0.18)", color:"#E8D9A8", padding:"0.1rem 0.45rem", borderRadius:"999px", fontWeight:800, border:"1px solid rgb(200 168 78 / 0.3)" }}>Mayer Dual-Coding</span>
            <span>CEFR {topic.level} · GGP 150 · BAMF</span>
          </div>
        </div>
        <div className="lesson-hero-light">
          {topic.ziel && (
            <div className="lesson-ziel" data-testid="wizard-ziel" style={{ background:"linear-gradient(135deg, #0F1E3A 0%, #162B55 100%)", color:"#E8EEF8", borderInlineStart:"4px solid #C8A84E" }}>
              <span aria-hidden>🎯</span>
              <span><strong style={{ color:"#E8D9A8" }}>هدف هذا الدرس:</strong> {topic.ziel}</span>
            </div>
          )}
          {/* Lesson Studio — مشهد بصري (60 JPG + 60 SVG Verlag — 100%) */}
          <div data-testid="wizard-scene-image" style={{ marginTop: "0.2rem", borderRadius: "0.8rem", overflow: "hidden", border: "1px solid var(--color-line)", background: "var(--color-paper)" }}>
            <img src={`/lesson-images/${topic.id}.jpg`} alt={`مشهد ${topic.titleDe}`} loading="lazy" onError={(e) => { const img = e.currentTarget as HTMLImageElement; if (!img.dataset.triedSvg) { img.dataset.triedSvg = "1"; img.src = `/lesson-images/${topic.id}.svg`; return; } img.style.display = "none"; const fallback = document.getElementById(`fallback-${topic.id}`); if (fallback) fallback.style.display = "flex"; }} style={{ width: "100%", height: "auto", display: "block", maxHeight: "220px", objectFit: "cover" }} />
            <div id={`fallback-${topic.id}`} style={{ display: "none", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.3rem", padding: "1.2rem", background: "linear-gradient(135deg, #FFFCF0 0%, #FDF8E8 100%)", border: "1px dashed rgb(212 193 143 / 0.5)", borderRadius: "0.6rem", textAlign: "center" }}>
              <span style={{ fontSize: "1.6rem" }}>🏛️</span>
              <span style={{ fontWeight: 800, fontSize: "0.85rem", color: "#113A5F" }} dir="ltr">{topic.titleDe}</span>
              <span style={{ fontSize: "0.75rem", color: "var(--ui-muted)" }}>Verlag WEG · صورة الدرس — Mayer مشهد ذهني</span>
            </div>
            <div style={{ padding: "0.4rem 0.6rem", fontSize: "0.72rem", color: "var(--color-ink2)", textAlign: "center" }}>🎨 مشهد الدرس — اربط القاعدة بصورة ذهنية (60/60 Mayer)</div>
          </div>
        </div>
      </div>

      {/* ── مؤشّر الخطوات الهجين — Verlag + Dark Academy (Premium) ── */}
      {(() => {
        const STEP_ICONS = ["🔍","📐","💬","✍️","🧾"];
        return (
          <div className="wizard-stepper" role="tablist" aria-label="خطوات الدرس — 5 مراحل">
            {SCHRITTE.map((st, i) => {
              const isDone = !!erledigt[i];
              const isActive = i === schritt;
              const can = kannZu(i);
              const state = isDone ? "done" : isActive ? "active" : "locked";
              return (
                <React.Fragment key={String(st)}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    data-testid={`wizard-schritt-${i}`}
                    disabled={!can}
                    onClick={() => can && setSchritt(i)}
                    className={`wizard-stepper-item wizard-stepper-item--${state}`}
                    title={can ? `${i+1}. ${st}` : "أكمل الخطوات السابقة أولًا"}
                    style={{ cursor: can ? "pointer" : "not-allowed", opacity: can ? 1 : 0.45, border: isActive ? "1px solid rgb(200 168 78 / 0.45)" : "1px solid transparent" }}
                  >
                    <div className="wizard-stepper-dot">{isDone ? "✓" : STEP_ICONS[i]}</div>
                    <div className="wizard-stepper-label" style={{ fontSize: isActive ? "0.72rem" : "0.68rem" }}>{st}</div>
                    <div style={{ fontSize:"0.6rem", color: isActive ? "#9FB2CE" : isDone ? "#4ADE80" : "#8A9BB5" }}>{i+1}/5</div>
                  </button>
                  {i < SCHRITTE.length - 1 && <div className={`wizard-stepper-line ${isDone ? "wizard-stepper-line--done" : ""}`} aria-hidden />}
                </React.Fragment>
              );
            })}
          </div>
        );
      })()}

      {/* ── GGP 150 — شارة المرجع الأكاديمي (لا بيانات جديدة) ── */}
      {(() => { const feats = ggpForTopic(topicId); return feats.length ? (
        <div data-testid="wizard-ggp" style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", alignItems: "center", fontSize: "0.73rem" }}>
          <span style={{ fontWeight: 900, color: "var(--ui-muted)" }}>📑 GGP:</span>
          {feats.map((f) => <span key={f.code} className="ggp-chip" title={`${f.titelDe} — ${f.titelAr}`} data-testid={`ggp-${f.code}`}>{f.code} · {f.titelDe}</span>)}
          <span style={{ color: "var(--ui-muted)" }}>· {topic.level} · {feats[0].familie}</span>
        </div>
      ) : null; })()}
      {/* Mayer: Signaling — هدف واضح قبل المحتوى */}
      <div data-testid="wizard-mayer-goal" className="lesson-ziel wizard-ziel-bg" style={{ borderInlineStart: "4px solid var(--color-a1)", padding: "0.5rem 0.7rem", borderRadius: "0.5rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
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
          <div data-testid="wizard-induktion" style={{ display: "grid", gap: "0.65rem" }}>
            <div style={{ display:"flex", gap:"0.5rem", alignItems:"center", flexWrap:"wrap" }}>
              <span style={{ background:"#0F1E3A", color:"#E8D9A8", padding:"0.2rem 0.55rem", borderRadius:"999px", fontWeight:900, fontSize:"0.72rem", border:"1px solid rgb(200 168 78 / 0.35)" }}>🔍 خطوة 1/5 — خمّن</span>
              <span style={{ fontSize:"0.72rem", color:"var(--color-ink2)" }}>Conti Prediction — نتذكر 70% أكثر</span>
            </div>
            <strong style={{ fontSize:"1rem" }}>اكتشف القاعدة قبل أن تقرأها</strong>
            <p style={{ fontSize: "0.85rem", color: "var(--color-ink2)", margin: 0, lineHeight:1.8 }}>
              اقرأ المشهد ثم خمّن: ما النمط المشترك؟ الخطأ لا يُخصم — بل يجهّز دماغك للشرح (بحث Gianfranco Conti #1).
            </p>
            <div className="lesson-scene">
              <div className="lesson-scene-head">💬 المشهد — القاعدة مختبئة هنا · استمع لكل جملة</div>
              <audio data-testid="wizard-audio-induktion" controls preload="none" src={`/audio/grammar/${topic.id}-1.mp3`} style={{ width: "100%", height: "32px", margin: "0.35rem 0" }} />
              <div style={{ fontSize: "0.68rem", color: "var(--color-ink2)", textAlign: "center", marginBottom: "0.25rem" }}>🎧 87 مشهد صوتي جاهز • {topic.id}-1.mp3 · Mayer Dual-Coding</div>
              {topic.examples.slice(0, 3).map((ex, ei) => (
                <div key={ex.de} className={`lesson-bubble ${ei % 2 === 0 ? "lesson-bubble-a" : "lesson-bubble-b"}`}>
                  <div style={{ display: "flex", gap: "0.35rem", alignItems: "center", justifyContent: "space-between" }}>
                    <De style={{ fontWeight: 700 }}>{topic.id.includes("genitiv") || topic.id.includes("relativ-genitiv") ? highlightGenitiv(ex.de) : ex.de}</De>
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
                className="lesson-option-btn btn btn-ghost"
                data-testid={`wizard-option-${i}`}
                disabled={gewaehlt !== null}
                style={{ textAlign: "start", justifyContent: "flex-start", minHeight:"44px", width:"100%" }}
                onClick={() => waehle(i)}
              >
                <span>
                  <De style={{ fontWeight: 800 }}>{o.de}</De>
                  <span style={{ display: "block", fontSize: "0.8rem", color: "var(--color-ink2)", marginTop:"0.15rem" }}>{o.ar}</span>
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
              <audio data-testid="wizard-audio-beobachten" controls preload="none" src={`/audio/grammar/${topic.id}-1.mp3`} style={{ width: "100%", height: "32px", margin: "0.35rem 0" }} />
              <div style={{ fontSize: "0.68rem", color: "var(--color-ink2)", textAlign: "center", marginBottom: "0.25rem" }}>🎧 اسمع الأمثلة — 87/87</div>
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
                    <div className="lesson-rule-pattern" style={{ display: "flex", gap: "0.35rem", alignItems: "center", flexWrap: "wrap", justifyContent: "space-between" }}>
                      <De style={{ flex: "1 1 auto" }}>{r.de}</De>
                      <button type="button" className="chip" style={{ cursor: "pointer", minHeight: "32px", flexShrink: 0 }} onClick={() => speakAny(r.de)} aria-label={`استمع للقاعدة: ${r.de}`}>🔊</button>
                    </div>
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
            {/* 🖼️ Dual-Coding Bildanker — Mayer: Verbal + Visual in einem (Sprint 13) */}
            <div data-testid="wizard-dual-coding" className="card wizard-dual-bg" style={{ padding: "0.55rem 0.7rem", borderInlineStart: "4px solid #f59e0b", display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: "1.25rem" }}>{dualCodingInfo.icon}</span>
              <div style={{ flex: 1, minWidth: "180px" }}>
                <div style={{ fontWeight: 900, fontSize: "0.82rem" }}>🖼️ Bild-Anker: {dualCodingInfo.label}</div>
                <div dir="ltr" style={{ fontSize: "0.82rem", color: "var(--color-ink2)" }}><De style={{ fontWeight: 700 }}>{dualCodingInfo.de}</De></div>
              </div>
              <span style={{ fontSize: "0.7rem", background: "rgba(245 158 11 / 0.15)", padding: "0.15rem 0.45rem", borderRadius: "999px", fontWeight: 800, color: "#B45309" }}>Mayer Dual-Coding</span>
            </div>
            {(topic.tables ?? []).length > 0 && hasCase((topic.tables ?? []).flatMap((t) => t.headers)) && (
              <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", fontSize: "0.72rem", alignItems: "center" }}>
                <span style={{ fontWeight: 800, color: "var(--ui-muted)" }}>🎨 تلوين الحالات:</span>
                <span className="case-chip case-chip-nom">Nominativ</span>
                <span className="case-chip case-chip-akk">Akkusativ</span>
                <span className="case-chip case-chip-dat">Dativ</span>
                <span className="case-chip case-chip-gen">Genitiv</span>
              </div>
            )}
            {(topic.tables ?? []).map((t, ti) => {
              const revealed = layeredRevealed[ti] ?? 1;
              const rest = t.rows.length - revealed;
              return (
              <div key={`t-${ti}`} data-testid={`wizard-layered-${ti}`} style={{ display: "grid", gap: "0.3rem" }}>
                {t.captionAr && <strong style={{ fontSize: "0.85rem" }}>{t.captionAr}</strong>}
                <div style={{ fontSize:"0.74rem", color:"var(--color-ink2)" }}>Mayer Segmenting + Conti Retrieval — صف واحد في كل مرة (اكشف المسار خطوة بخطوة)</div>
                <div style={{ overflowX: "auto" }}>
                  <table className="lesson-table lesson-table--signaled lesson-table--layered" dir="ltr">
                    <thead><tr>{t.headers.map((h) => {
                      const c = caseChip(h);
                      return <th key={h} className={c ? "case-hl" : undefined}><span className={c || undefined} style={c ? undefined : {}}>{h}</span></th>;
                    })}</tr></thead>
                    <tbody>
                      {t.rows.slice(0, revealed).map((row, ri) => (
                        <tr key={ri}>{row.map((c, ci) => {
                          const headerClass = caseChip(t.headers[ci] ?? "");
                          const cellStyle: React.CSSProperties | undefined = headerClass.includes("case-chip-nom") ? { background: "rgb(96 165 250 / 0.08)" } : headerClass.includes("case-chip-akk") ? { background: "rgb(74 222 128 / 0.08)" } : headerClass.includes("case-chip-dat") ? { background: "rgb(242 200 102 / 0.08)" } : headerClass.includes("case-chip-gen") ? { background: "rgb(167 139 250 / 0.10)" } : undefined;
                          const cellText = String(c);
                          return <td key={ci} style={{ ...cellStyle, position: "relative" }}>
                            {ci===0 ? <><De style={{fontWeight:800}}>{cellText.split("→")[0]}</De>{cellText.includes("→") && <><span style={{color:"var(--color-a1)", fontWeight:900}}> → </span><De style={{color:"var(--color-a1)"}}>{cellText.split("→")[1]}</De></>}</> : cellText}
                            <button type="button" className="chip" onClick={() => speakAny(cellText)} aria-label={`استمع: ${cellText}`} style={{ cursor: "pointer", minHeight: "24px", minWidth: "26px", padding: "0 0.3rem", fontSize: "0.65rem", marginInlineStart: "0.3rem", verticalAlign: "middle" }}>🔊</button>
                          </td>;
                        })}</tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {rest > 0 ? (
                  <button type="button" className="lesson-reveal-btn" data-testid={`wizard-layered-reveal-${ti}`} onClick={() => setLayeredRevealed((m) => ({ ...m, [ti]: Math.min(t.rows.length, (m[ti] ?? 1) + 1) }))} style={{ justifySelf:"start", minHeight:"36px" }}>▶ اكشف الصف التالي — بقي {rest} · Layered-Reveal</button>
                ) : (
                  <span data-testid={`wizard-layered-done-${ti}`} style={{ fontSize:"0.78rem", color:"#16A34A", fontWeight:800, background:"rgb(22 163 74 / 0.1)", padding:"0.2rem 0.55rem", borderRadius:"999px" }}>✓ كل الصفوف مكشوفة — Mayer Segmenting</span>
                )}
              </div>
              );
            })}
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
              <audio data-testid="wizard-audio-szene" controls preload="none" src={`/audio/grammar/${topic.id}-1.mp3`} style={{ width: "100%", height: "32px", margin: "0.35rem 0" }} />
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
              <div style={{ display: "grid", gap: "0.6rem" }} data-testid="wizard-contrast">
                <div style={{ display:"flex", gap:"0.5rem", alignItems:"center", flexWrap:"wrap" }}>
                  <span style={{ background:"#0F1E3A", color:"#E8D9A8", padding:"0.18rem 0.55rem", borderRadius:"999px", fontWeight:900, fontSize:"0.72rem", border:"1px solid rgb(200 168 78 / 0.35)" }}>⚠️ جدار الفخاخ</span>
                  <span style={{ fontWeight:800, color:"#0F1E3A", fontSize:"0.9rem" }}>Contrast — خطأ vs صواب</span>
                  <span style={{ fontSize:"0.68rem", color:"var(--ui-muted)", background:"rgb(22 163 74 / 0.1)", padding:"0.12rem 0.4rem", borderRadius:"999px" }}>يثبت 40% أكثر</span>
                </div>
                <div style={{ fontSize:"0.73rem", color:"var(--color-ink2)", background:"linear-gradient(180deg, #FFFCF0, #FDF8E8)", padding:"0.4rem 0.6rem", borderRadius:"0.5rem", border:"1px solid rgb(212 193 143 / 0.22)" }}>💡 Conti Contrast + Retrieval: اكتشف الخطأ أولاً — دماغك يبني مساراً، ثم اكشف الصواب ليثبت.</div>
                {topic.pitfalls.map((p, idx) => {
                  const hasContrast = p.de.includes("→") || p.de.includes("statt") || p.de.includes("vs");
                  const revealed = !!pitfallRevealed[idx];
                  const wrong = p.de.split("→")[0].trim();
                  const correct = hasContrast ? p.de.split("→")[1]?.trim() : p.ar.split("—")[0]?.trim() || "راجع القاعدة أعلاه";
                  return (
                  <div key={p.de} data-testid={`wizard-pitfall-${idx}`} className="lesson-pitfall-premium">
                    <div className="lesson-pitfall-header">
                      <span>🎯 فخ {idx+1}</span>
                      <span style={{ flex:1 }} />
                      <span style={{ fontSize:"0.65rem", background: revealed ? "#16A34A" : "rgb(255 255 255 / 0.14)", color: revealed ? "#fff" : "#9FB2CE", padding:"0.1rem 0.4rem", borderRadius:"999px" }}>{revealed ? "✓ مكشوف" : "مخفي"}</span>
                    </div>
                    <div className="lesson-pitfall-body">
                      <div style={{ display:"flex", gap:"0.4rem", alignItems:"center", flexWrap:"wrap" }}>
                        <span style={{ fontSize:"0.68rem", fontWeight:800, background:"rgb(220 38 38 / 0.1)", color:"#DC2626", padding:"0.12rem 0.4rem", borderRadius:"999px", border:"1px solid rgb(220 38 38 / 0.18)" }}>✗ خطأ شائع</span>
                        <De style={{ fontWeight:700, fontSize:"0.9rem" }}>{wrong}</De>
                      </div>
                      {!revealed ? (
                        <button type="button" className="lesson-reveal-btn" data-testid={`wizard-pitfall-reveal-${idx}`} onClick={() => setPitfallRevealed((m) => ({ ...m, [idx]: true }))} style={{ justifySelf:"start", minHeight:"36px" }}>🔍 أين الخطأ؟ اكشف الصواب →</button>
                      ) : (
                        <div style={{ display:"grid", gap:"0.5rem" }}>
                          <div className="lesson-pitfall-contrast">
                            <div className="lesson-pitfall-box lesson-pitfall-box--wrong">
                              <div style={{ fontSize:"0.65rem", fontWeight:800, color:"#DC2626" }}>✗ الخطأ</div>
                              <De style={{ fontSize:"0.82rem", textDecoration:"line-through", opacity:0.85 }}>{wrong}</De>
                            </div>
                            <span style={{ fontWeight:900, color:"#C8A84E", fontSize:"1.2rem", textAlign:"center" }}>→</span>
                            <div className="lesson-pitfall-box lesson-pitfall-box--right">
                              <div style={{ fontSize:"0.65rem", fontWeight:800, color:"#16A34A" }}>✓ الصواب</div>
                              <div style={{ fontSize:"0.85rem", fontWeight:800, color:"#0F1E3A" }}>{correct}</div>
                            </div>
                          </div>
                          <div style={{ fontSize:"0.83rem", color:"var(--color-ink2)", lineHeight:1.7, background:"#FFFCF0", padding:"0.5rem 0.6rem", borderRadius:"0.5rem", border:"1px solid rgb(212 193 143 / 0.22)" }}>
                            <strong style={{ color:"#0F1E3A" }}>💡 لماذا؟</strong> {p.ar}
                          </div>
                          <button type="button" className="btn btn-ghost" data-testid={`wizard-pitfall-hide-${idx}`} onClick={() => setPitfallRevealed((m) => ({ ...m, [idx]: false }))} style={{ justifySelf:"start", minHeight:"32px", fontSize:"0.72rem" }}>إخفاء ←</button>
                        </div>
                      )}
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
            {(() => { const k = kulturFuer(topicId, topic.level); return k ? (
              <div data-testid="wizard-kultur" className="card" style={{ padding: "0.6rem 0.85rem", background: "var(--ui-surface-raised)", borderInlineStart: "5px solid var(--color-b2)", display: "grid", gap: "0.35rem" }}>
                <strong style={{ fontSize: "0.85rem" }}>🌍 في ألمانيا — لمسة ثقافية {topic.level==="B2" ? "· B2 Lebenswelt" : ""} {topic.level==="B2" ? <span style={{ fontWeight:800, fontSize:"0.68rem", background:"rgb(167 139 250 / 0.14)", padding:"0.12rem 0.45rem", borderRadius:"999px", color:"#a78bfa", border:"1px solid rgb(167 139 250 / 0.3)" }}>BAMF I-VI</span> : null}</strong>
                <span style={{ fontSize: "0.82rem", lineHeight: 1.85, color: "var(--color-ink2)" }} dir="ltr"><De>{k.de}</De></span>
                <span style={{ fontSize: "0.82rem", lineHeight: 1.85, color: "var(--color-ink2)" }}>{k.ar}</span>
                <span style={{ fontSize: "0.75rem", color: "var(--ui-muted)" }}>تلميح سياقي — يُظهر متى يُستعمل النمط، لا يُمتحن. {topic.level==="B2" ? "BAMF Handlungsfeld: Beruf/Alltag — تسجيل (Anmeldung) · تأمين (Krankenkasse) · سكن (Mietvertrag) · عمل (Anerkennung)." : ""}</span>
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
