"use client";
import { useEffect, useRef, useState } from "react";
import { useProgress } from "@/lib/store";
import { planArbeitslast } from "@/lib/plan";
import { speakAny } from "@/lib/speech";
import type { Lernziel, Tempo } from "@/lib/types";

const ZIELE: { id: Lernziel; labelDe: string; labelAr: string; descAr: string; icon: string }[] = [
  { id: "bamf", labelDe: "BAMF Integrationskurs", labelAr: "اندماج BAMF + جنسية", descAr: "تدريب اختياري على مؤسسات الحياة والاندماج", icon: "🏛️" },
  { id: "pflege", labelDe: "Pflege / Arbeit", labelAr: "تمريض / عمل مناوبات", descAr: "تدريب اختياري على لغة الرعاية والعمل", icon: "🩺" },
  { id: "studium", labelDe: "Studium", labelAr: "دراسة جامعية", descAr: "قراءة وكتابة إضافيتان للسياق الأكاديمي", icon: "🎓" },
  { id: "arbeit", labelDe: "Arbeit / Ausbildung", labelAr: "عمل / تدريب مهني", descAr: "مقابلات ومواقف مهنية اختيارية", icon: "🔧" },
  { id: "allgemein", labelDe: "Allgemein B2", labelAr: "لغة عامة B2", descAr: "هدف مفتوح مع بقاء الخطة الأساسية كما هي", icon: "🌍" },
];

interface InertState {
  element: HTMLElement;
  hadInert: boolean;
  ariaHidden: string | null;
}

export function OnboardingWizard() {
  const { progress, update, ready } = useProgress();
  const [step, setStep] = useState(1);
  const [ziel, setZiel] = useState<Lernziel | null>(null);
  const [tempo, setTempo] = useState<Tempo>("regelmaessig");
  const dialogRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const done = progress.settings.onboardingDone;

  /* PA-027: initial focus + focus trap + inert background + focus restoration. */
  useEffect(() => {
    if (!ready || done) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const inertStates: InertState[] = [];
    const makeInert = (element: Element) => {
      if (!(element instanceof HTMLElement) || element === dialog || element.contains(dialog)) return;
      inertStates.push({ element, hadInert: element.hasAttribute("inert"), ariaHidden: element.getAttribute("aria-hidden") });
      element.setAttribute("inert", "");
      element.setAttribute("aria-hidden", "true");
    };

    /* داخل الصفحة نعزل إخوة الطبقة، وخارج <main> نعزل الملاحة والتذييل. */
    const parent = dialog.parentElement;
    if (parent) Array.from(parent.children).forEach((child) => { if (child !== dialog) makeInert(child); });
    const main = dialog.closest("main");
    if (main?.parentElement) Array.from(main.parentElement.children).forEach((child) => { if (child !== main) makeInert(child); });

    headingRef.current?.focus();
    const focusableSelector = [
      "button:not([disabled])",
      "a[href]",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "[tabindex]:not([tabindex='-1'])",
    ].join(",");
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        (dialog.querySelector('[data-testid="onboarding-skip"]') as HTMLButtonElement | null)?.click();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector))
        .filter((element) => !element.hasAttribute("inert") && element.getAttribute("aria-hidden") !== "true");
      if (focusable.length === 0) { event.preventDefault(); headingRef.current?.focus(); return; }
      const activeIndex = focusable.indexOf(document.activeElement as HTMLElement);
      if (activeIndex < 0) {
        event.preventDefault();
        (event.shiftKey ? focusable.at(-1) : focusable[0])?.focus();
      } else if (!event.shiftKey && activeIndex === focusable.length - 1) {
        event.preventDefault();
        focusable[0].focus();
      } else if (event.shiftKey && activeIndex === 0) {
        event.preventDefault();
        focusable.at(-1)?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      for (const state of inertStates) {
        if (!state.hadInert) state.element.removeAttribute("inert");
        if (state.ariaHidden === null) state.element.removeAttribute("aria-hidden");
        else state.element.setAttribute("aria-hidden", state.ariaHidden);
      }
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
    };
  }, [ready, done]);

  if (!ready || done) return null;
  const arbeitslast = planArbeitslast();
  const kernDurchschnitt = Math.round(arbeitslast.durchschnittKernMinutenProTag);
  const vollDurchschnitt = Math.round(arbeitslast.durchschnittMinutenProTag);
  const b2KernDurchschnitt = Math.round(arbeitslast.phasen.B2.durchschnittKernMinutenProTag);

  const speichern = () => {
    update((p) => ({
      ...p,
      settings: { ...p.settings, tempo, onboardingDone: true, lernziel: ziel ?? "allgemein" },
    }));
  };
  const ueberspringen = () => {
    update((p) => ({
      ...p,
      settings: {
        ...p.settings,
        onboardingDone: true,
        lernziel: p.settings.lernziel ?? "allgemein",
        tempo: p.settings.tempo ?? "regelmaessig",
      },
    }));
  };
  const ttsText = `Willkommen bei Weg nach B2. Der Lernplan umfasst ${arbeitslast.tage} Tage und unterstützt deinen Weg in Richtung B2, garantiert aber kein Sprachniveau. Der tägliche Kernpfad liegt intern bei 45 bis 90 Minuten und umfasst im Durchschnitt ${kernDurchschnitt} Minuten, im B2-Abschnitt ${b2KernDurchschnitt} Minuten. Weitere Aufgaben sind freiwillige Vertiefung; zusammen läge der vollständige Katalog im Durchschnitt bei ${vollDurchschnitt} Minuten pro Tag. Diese Aufteilung ist noch nicht in einer Feldstudie validiert.`;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      aria-describedby="onboarding-description"
      style={{ position: "fixed", inset: 0, zIndex: 80, background: "rgb(11 16 32 / 0.78)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
    >
      <div className="card" style={{ maxWidth: 560, width: "100%", padding: "1rem 1.1rem", background: "var(--ui-surface)", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.6rem" }}>
          <h2 id="onboarding-title" ref={headingRef} tabIndex={-1} style={{ fontSize: "1rem", margin: 0 }}>👋 مرحباً — تمهيد سريع قبل أن نبدأ</h2>
          <span className="chip" aria-label={`الخطوة ${step} من 2`}>{step}/2</span>
          <button type="button" className="btn btn-ghost" data-testid="onboarding-skip" onClick={ueberspringen} style={{ minHeight: "44px" }}>تخطَّ الآن</button>
        </div>
        <p id="onboarding-description" style={{ fontSize: "0.78rem", color: "var(--color-ink2)", margin: "0.45rem 0" }}>
          خطوتان لاختيار الهدف وإيقاع البطاقات. يمكنك التخطي الآن أو الضغط على Escape، وتعديل الخيارات لاحقاً من الإعدادات.
        </p>
        <div style={{ height: 6, background: "var(--color-paper)", borderRadius: 3, margin: "0.6rem 0", overflow: "hidden" }}>
          <div style={{ width: `${step * 50}%`, height: "100%", background: "var(--ui-green)", transition: "width 200ms" }} />
        </div>

        <div data-testid="onboarding-zeitmodell" style={{ background: "var(--color-paper2)", border: "1px solid var(--color-line)", borderRadius: "0.7rem", padding: "0.6rem 0.8rem", marginBottom: "0.6rem" }}>
          <div style={{ fontWeight: 800, fontSize: "0.85rem" }}>⏱️ ماذا تعني أرقام الوقت في الخطة؟</div>
          <div style={{ fontSize: "0.78rem", color: "var(--color-ink2)", lineHeight: 1.75 }}>
            الخطة {arbeitslast.tage} يوماً وتدعم التقدّم نحو B2 ولا تضمن بلوغه. المسار الأساسي الداخلي بين <strong>45–90 دقيقة</strong> في الأيام العادية، ومتوسطه المحسوب <strong>{kernDurchschnitt} دقيقة</strong>، وفي قسم B2 <strong>{b2KernDurchschnitt} دقيقة</strong>. ما بعده تعميق اختياري؛ ولو أُنجز الكتالوج كله صار المتوسط <strong>{vollDurchschnitt} دقيقة</strong>. التقسيم لم يُثبت بعد بدراسة التزام أو تعب ميدانية.
          </div>
          <button type="button" className="btn btn-ghost" style={{ marginTop: "0.35rem", width: "100%", minHeight: "44px" }} onClick={() => speakAny(ttsText, { rate: 0.95 })}>▶ استمع إلى الشرح الألماني بصوت المتصفح</button>
          <div style={{ fontSize: "0.70rem", color: "var(--color-ink2)", marginTop: "0.25rem" }}>الصوت مولّد آلياً عند الطلب عبر TTS في متصفحك؛ ليس تسجيلاً بشرياً.</div>
        </div>

        {step === 1 && (
          <>
            <p style={{ fontSize: "0.88rem", color: "var(--color-ink2)", margin: "0.2rem 0 0.6rem" }}>
              خطتك الأساسية {arbeitslast.tage} يوماً وليست سباقاً. اختر هدفك لنظهر محطة تدريب اختيارية مناسبة مع سببها؛ الاختيار لا يحذف درساً ولا يفتح قفلاً.
            </p>
            <div role="group" aria-label="اختر هدف التعلم" style={{ display: "grid", gap: "0.45rem" }}>
              {ZIELE.map((z) => (
                <button key={z.id} type="button" data-testid={`onboarding-lernziel-${z.id}`} aria-pressed={ziel === z.id} onClick={() => setZiel(z.id)} className="dirb-menu-btn" style={{ width: "100%", textAlign: "start", borderColor: ziel === z.id ? "var(--ui-green)" : undefined, background: ziel === z.id ? "var(--ui-green-soft)" : undefined, padding: "0.6rem 0.8rem", borderRadius: "0.8rem", display: "flex", gap: "0.6rem", alignItems: "center", cursor: "pointer", minHeight: "44px" }}>
                  <span style={{ fontSize: "1.2rem" }} aria-hidden>{z.icon}</span>
                  <span style={{ flex: 1 }}>
                    <b style={{ display: "block", fontSize: "0.92rem" }}>{z.labelAr} — <span lang="de" dir="ltr">{z.labelDe}</span></b>
                    <span style={{ fontSize: "0.78rem", color: "var(--color-ink2)" }}>{z.descAr}</span>
                  </span>
                  <span className="chip" style={{ borderColor: ziel === z.id ? "var(--ui-green)" : undefined }}>{ziel === z.id ? "✓" : "اختر"}</span>
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.7rem" }}>
              <button className="btn btn-primary" disabled={!ziel} onClick={() => setStep(2)} style={{ flex: 1, minHeight: "44px" }}>التالي — اختر وتيرتك →</button>
            </div>
            <p style={{ fontSize: "0.72rem", color: "var(--color-ink2)", marginTop: "0.4rem" }}>ستستطيع تغيير الهدف وإيقاع البطاقات لاحقاً من الإعدادات.</p>
          </>
        )}

        {step === 2 && (
          <>
            <p style={{ fontSize: "0.88rem", fontWeight: 800 }}>اختر إيقاع البطاقات الجديدة:</p>
            <div role="group" aria-label="اختر إيقاع البطاقات الجديدة" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", margin: "0.5rem 0" }}>
              {([
                { id: "leicht", label: "leicht", sub: "حتى 3 بطاقات/يوم", desc: "خفيف" },
                { id: "regelmaessig", label: "regelmäßig", sub: "حتى 5 بطاقات/يوم", desc: "افتراضي" },
                { id: "intensiv", label: "intensiv", sub: "حتى 10 بطاقات/يوم", desc: "مكثّف" },
              ] as const).map((o) => (
                <button key={o.id} type="button" data-testid={`onboarding-tempo-${o.id}`} aria-pressed={tempo === o.id} onClick={() => setTempo(o.id)} style={{ padding: "0.6rem 0.4rem", borderRadius: "0.7rem", border: `2px solid ${tempo === o.id ? "#22c55e" : "var(--color-line)"}`, background: tempo === o.id ? "rgb(34 197 94 / 0.14)" : "transparent", cursor: "pointer", minHeight: "72px" }}>
                  <b style={{ display: "block", fontSize: "0.82rem" }} lang="de">{o.label}</b>
                  <span style={{ fontSize: "0.7rem", color: "var(--color-ink2)" }}>{o.sub}</span>
                  <span style={{ fontSize: "0.68rem", display: "block", color: "var(--color-ink2)" }}>{o.desc}</span>
                </button>
              ))}
            </div>
            <div className="card" data-testid="onboarding-profil-grenze" style={{ padding: "0.6rem 0.8rem", background: "var(--color-paper2)", fontSize: "0.8rem", lineHeight: 1.7 }}>
              الهدف والإيقاع يظلان في ملفك المحلي ويؤثران في اقتراح اختياري وفي حد البطاقات الجديدة فقط. لا يغيران ترتيب خطة {arbeitslast.tage} يوماً أو أقفالها أو تقدير دقائق مهامها، ولا يرسلان بياناتك إلى شبكة.
            </div>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.7rem" }}>
              <button className="btn btn-ghost" onClick={() => setStep(1)} style={{ minHeight: "44px" }}>← رجوع</button>
              <button className="btn btn-primary" onClick={speichern} style={{ flex: 1, minHeight: "44px" }}>احفظ وابدأ الخطة ✓</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
