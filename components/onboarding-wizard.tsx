"use client";
import { useState } from "react";
import { useProgress } from "@/lib/store";
import { speakAny } from "@/lib/speech";
import type { Lernziel, Tempo } from "@/lib/types";

const ZIELE: { id: Lernziel; labelDe: string; labelAr: string; descAr: string; icon: string }[] = [
  { id: "bamf", labelDe: "BAMF Integrationskurs", labelAr: "اندماج BAMF + جنسية", descAr: "تدريب اختياري على مؤسسات الحياة والاندماج", icon: "🏛️" },
  { id: "pflege", labelDe: "Pflege / Arbeit", labelAr: "تمريض / عمل مناوبات", descAr: "تدريب اختياري على لغة الرعاية والعمل", icon: "🩺" },
  { id: "studium", labelDe: "Studium", labelAr: "دراسة جامعية", descAr: "قراءة وكتابة إضافيتان للسياق الأكاديمي", icon: "🎓" },
  { id: "arbeit", labelDe: "Arbeit / Ausbildung", labelAr: "عمل / تدريب مهني", descAr: "مقابلات ومواقف مهنية اختيارية", icon: "🔧" },
  { id: "allgemein", labelDe: "Allgemein B2", labelAr: "لغة عامة B2", descAr: "هدف مفتوح مع بقاء الخطة الأساسية كما هي", icon: "🌍" },
];

export function OnboardingWizard() {
  const { progress, update, ready } = useProgress();
  const [step, setStep] = useState(1);
  const [ziel, setZiel] = useState<Lernziel | null>(null);
  const [tempo, setTempo] = useState<Tempo>("regelmaessig");
  if (!ready) return null;
  const done = progress.settings.onboardingDone;
  if (done) return null;

  const speichern = () => {
    update((p) => ({
      ...p,
      settings: { ...p.settings, tempo, onboardingDone: true, lernziel: ziel ?? "allgemein" },
    }));
  };

  return (
    <div role="dialog" aria-modal="true" aria-label="معالج البداية — اختر هدفك ووتيرتك" style={{ position: "fixed", inset: 0, zIndex: 80, background: "rgb(11 16 32 / 0.78)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div className="card" style={{ maxWidth: 560, width: "100%", padding: "1rem 1.1rem", background: "var(--ui-surface)", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <strong>👋 مرحباً — 60 ثانية قبل أن نبدأ</strong>
          <span className="chip">{step}/2</span>
        </div>
        <div style={{ height: 6, background: "var(--color-paper)", borderRadius: 3, margin: "0.6rem 0", overflow: "hidden" }}>
          <div style={{ width: `${step * 50}%`, height: "100%", background: "var(--ui-green)", transition: "width 200ms" }} />
        </div>
        {/* P1 onboarding/video — 60ث ترحيب: فيديو/صوت يشرح 378ي = 152د/ي */}
        <div data-testid="onboarding-willkommen-60s" style={{ background: "var(--color-paper2)", border: "1px solid var(--color-line)", borderRadius: "0.7rem", padding: "0.6rem 0.8rem", marginBottom: "0.6rem" }}>
          <div style={{ fontWeight: 800, fontSize: "0.85rem" }}>🎬 60 ثانية — ماذا ستفعل في 378 يوماً؟</div>
          <div style={{ fontSize: "0.78rem", color: "var(--color-ink2)", lineHeight: 1.7 }}>378 يوماً = 152د/يوم B2 متوسط داخل السقف — البداية سؤال استرجاع، والجديد حتمي (لا توهان)، والتعويض تلقائي. اختر هدفك ووتيرتك وانطلق.</div>
          <audio controls preload="none" src="/willkommen-60s.mp3" onError={(e) => { (e.currentTarget as HTMLAudioElement).style.display = "none"; }} style={{ width: "100%", marginTop: "0.4rem" }} />
          <button type="button" className="btn btn-ghost" style={{ marginTop: "0.35rem", width: "100%", minHeight: "44px" }} onClick={() => speakAny("Willkommen bei Weg nach B2. In 378 Tagen erreichst du B2 mit 152 Minuten pro Tag im B2-Abschnitt. Jeden Tag wartet eine Abruf-Frage, dann neues Material, unverlierbar deterministisch. Wähle jetzt dein Ziel und dein Tempo.", { rate: 0.95 })}>▶ استمع للترحيب 60ث (TTS)</button>
          <div style={{ fontSize: "0.70rem", color: "var(--color-ink2)", marginTop: "0.2rem" }}>تسجيل بشري قادم — الآن TTS + نص يكفي لـ D1 (Mayer Modality+Segmenting).</div>
        </div>

        {step === 1 && (
          <>
            <p style={{ fontSize: "0.88rem", color: "var(--color-ink2)", margin: "0.2rem 0 0.6rem" }}>
              خطتك الأساسية 378 يوماً وليست سباقاً. اختر هدفك لنُظهر محطة تدريب اختيارية مناسبة مع سببها؛ الاختيار لا يحذف درساً ولا يفتح قفلاً.
            </p>
            <div role="group" aria-label="اختر هدف التعلم" style={{ display: "grid", gap: "0.45rem" }}>
              {ZIELE.map(z => (
                <button key={z.id} type="button" data-testid={`onboarding-lernziel-${z.id}`} aria-pressed={ziel === z.id} onClick={() => setZiel(z.id)} className="dirb-menu-btn" style={{ width: "100%", textAlign: "start", borderColor: ziel === z.id ? "var(--ui-green)" : undefined, background: ziel === z.id ? "var(--ui-green-soft)" : undefined, padding: "0.6rem 0.8rem", borderRadius: "0.8rem", display: "flex", gap: "0.6rem", alignItems: "center", cursor: "pointer", minHeight: "44px" }}>
                  <span style={{ fontSize: "1.2rem" }}>{z.icon}</span>
                  <span style={{ flex: 1 }}>
                    <b style={{ display: "block", fontSize: "0.92rem" }}>{z.labelAr} — {z.labelDe}</b>
                    <span style={{ fontSize: "0.78rem", color: "var(--color-ink2)" }}>{z.descAr}</span>
                  </span>
                  <span className="chip" style={{ borderColor: ziel === z.id ? "var(--ui-green)" : undefined }}>{ziel === z.id ? "✓" : "اختر"}</span>
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.7rem" }}>
              <button className="btn btn-primary" disabled={!ziel} onClick={() => setStep(2)} style={{ flex: 1, minHeight: "44px" }}>التالي — اختر وتيرتك →</button>
            </div>
            <p style={{ fontSize: "0.72rem", color: "var(--color-ink2)", marginTop: "0.4rem" }}>ستستطيع تغييره لاحقاً من الإعدادات → Tempo. لا فيديو 60ث مسجّل بعد — هذا النص + الصوت التوضيحي يكفي لـ D1.</p>
          </>
        )}

        {step === 2 && (
          <>
            <p style={{ fontSize: "0.88rem", fontWeight: 800 }}>اختر إيقاع البطاقات الجديدة:</p>
            <div role="group" aria-label="اختر إيقاع البطاقات الجديدة" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", margin: "0.5rem 0" }}>
              {([
                { id: "leicht", label: "leicht", sub: "حتى 3 بطاقات/يوم", desc: "خفيف" },
                { id: "regelmaessig", label: "regelmaessig", sub: "حتى 5 بطاقات/يوم", desc: "افتراضي" },
                { id: "intensiv", label: "intensiv", sub: "حتى 10 بطاقات/يوم", desc: "مكثّف" },
              ] as const).map(o => (
                <button key={o.id} type="button" data-testid={`onboarding-tempo-${o.id}`} aria-pressed={tempo === o.id} onClick={() => setTempo(o.id)} style={{ padding: "0.6rem 0.4rem", borderRadius: "0.7rem", border: `2px solid ${tempo === o.id ? "#22c55e" : "var(--color-line)"}`, background: tempo === o.id ? "rgb(34 197 94 / 0.14)" : "transparent", cursor: "pointer", minHeight: "72px" }}>
                  <b style={{ display: "block", fontSize: "0.82rem" }}>{o.label}</b>
                  <span style={{ fontSize: "0.7rem", color: "var(--color-ink2)" }}>{o.sub}</span>
                  <span style={{ fontSize: "0.68rem", display: "block", color: "var(--color-ink2)" }}>{o.desc}</span>
                </button>
              ))}
            </div>
            <div className="card" data-testid="onboarding-profil-grenze" style={{ padding: "0.6rem 0.8rem", background: "var(--color-paper2)", fontSize: "0.8rem", lineHeight: 1.7 }}>
              الهدف والإيقاع يظلان في ملفك المحلي ويؤثران في اقتراح اختياري وفي حدّ البطاقات الجديدة فقط. لا يغيّران ترتيب خطة 378 يوماً أو أقفالها أو تقدير دقائق مهامها، ولا يرسلان بياناتك إلى شبكة.
            </div>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.7rem" }}>
              <button className="btn btn-ghost" onClick={() => setStep(1)} style={{ minHeight: "44px" }}>← رجوع</button>
              <button className="btn btn-primary" onClick={speichern} style={{ flex: 1, minHeight: "44px" }}>ابدأ رحلتك 378ي ✓</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
