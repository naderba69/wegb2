"use client";
// 🌿 وحة الصحّة — GesundheitsWache (Modul U): سياسات صحّية مدمجة لا أداة شاردة
//   👁 قاعدة 20-20-20: كل 20 دقيقة شاشة ← 20 ثانية نظر إلى نحو 6 أمتار
//   🤒 وضع المريض: حدّ أدنى يومي من 3 خطوات يحفظ السلسلة بلا ضغط ولا كسر
import { useEffect, useState } from "react";
import type { Progress } from "@/lib/types";
import { sentences } from "@/lib/content";
import { useProgress } from "@/lib/store";
import { checkAbzeichen } from "@/lib/spiel";
import { logK } from "@/lib/kompetenz";
import { speakAny } from "@/lib/speech";
import { De } from "./De";

const TAG = () => new Date().toISOString().slice(0, 10);

export function GesundheitsWache({ progress }: { progress: Progress }) {
  const { update } = useProgress();
  const g = progress.gesundheit ?? {};
  const an = g.augenPause !== false;
  const krank = !!g.krank;

  const [sek, setSek] = useState(20 * 60);
  const [pause, setPause] = useState<number | null>(null);
  const [schritte, setSchritte] = useState<Record<number, boolean>>({});

  // الحارس: عدّاد الشاشة ثم استراحة قسرية
  useEffect(() => {
    if (!an || pause !== null) return;
    const t = setInterval(() => {
      setSek((s) => {
        if (s <= 1) {
          setPause(20);
          speakAny("Pause! Sieh zwanzig Sekunden in die Ferne.");
          update((p) => {
            const heute = TAG();
            const alt = p.gesundheit?.pausen;
            const n = alt && alt.tag === heute ? alt.n + 1 : 1;
            return { ...p, gesundheit: { ...p.gesundheit, augenPause: p.gesundheit?.augenPause ?? true, pausen: { tag: heute, n } } };
          });
          return 20 * 60;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [an, pause !== null]);

  // عدّاد الاستراحة نفسها
  useEffect(() => {
    if (pause === null) return;
    if (pause <= 0) {
      setPause(null);
      return;
    }
    const t = setTimeout(() => setPause((p) => (p === null ? null : p - 1)), 1000);
    return () => clearTimeout(t);
  }, [pause]);

  const pausenHeute = g.pausen && g.pausen.tag === TAG() ? g.pausen.n : 0;
  const mmss = `${String(Math.floor(sek / 60)).padStart(2, "0")}:${String(sek % 60).padStart(2, "0")}`;

  // الحدّ الأدنى لليوم المريض — 3 خطوات حتمية من موسوعة الجُمل
  const tag = progress.plan.day;
  const satzA = sentences[(tag * 7) % sentences.length];
  const satzB = sentences[(tag * 13 + 5) % sentences.length];
  const minimal = [
    { emoji: "👂", text: <>استمع لجملة وتسمّعها مرة واحدة: <De>{satzA.de}</De></> },
    { emoji: "📖", text: <>اقرأ هذه وقل جملة من عندك بالمعنى: «{satzA.ar}»</> },
    { emoji: "🛌", text: <>خمس دقائق راحة كاملة بعيداً عن الشاشة — هذا واجب لا ترف.</> },
  ];
  const fertig = Object.values(schritte).filter(Boolean).length;

  return (
    <>
      {/* ————— لوحة الحارس ————— */}
      <div className="card fadein" style={{ padding: "1.1rem 1.3rem", borderInlineStart: "5px solid var(--color-a1)" }}>
        <div style={{ fontWeight: 900, fontSize: "1.05rem", color: "var(--color-cola)" }}>
          🌿 وحة الصحّة — GesundheitsWache <span style={{ fontSize: "0.75rem", color: "var(--color-ink2)" }}>(Modul U)</span>
        </div>
        <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)", margin: "0.2rem 0 0.7rem" }}>
          سياسات صحّية لا أداة: حارس عينيك أثناء التعلّم + حدّ أدنى مُرحّم ليوم المرض — السلسلة تبقى والجسد لا يُضحّى.
        </div>

        {/* 👁 قاعدة 20-20-20 */}
        <div className="card" style={{ padding: "0.8rem 1rem", background: "var(--color-paper)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
            <div style={{ fontWeight: 800 }}>
              👁 قاعدة 20-20-20 — <span style={{ color: "var(--color-ink2)", fontWeight: 400 }}>كل 20 دقيقة شاشة ← 20 ثانية نظر إلى ~6 أمتار</span>
            </div>
            <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
              <span className="chip" style={{ fontWeight: 800, fontSize: "0.95rem", color: an ? "var(--color-a1)" : "var(--color-ink2)" }}>⏱ {an ? mmss : "متوقف"}</span>
              <button
                className="btn btn-ghost"
                style={{ padding: "0.3rem 0.8rem" }}
                onClick={() => update((p) => ({ ...p, gesundheit: { ...p.gesundheit, augenPause: !(p.gesundheit?.augenPause !== false) } }))}
              >
                {an ? "⏸ أوقف الحارس" : "▶️ شغّل الحارس"}
              </button>
            </div>
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--color-ink2)", marginTop: "0.35rem" }}>
            استراحات اليوم: <span className="rtl-num">{pausenHeute}</span> · عند الصفر تظهر استراحة قسرية على الشاشة كلها (20 ثانية) — النظر للأبعد يُرخي عضلة العين ويمنع جفاف الشاشة.
          </div>
        </div>

        {/* 🤒 وضع المريض */}
        <div className="card" style={{ padding: "0.8rem 1rem", marginTop: "0.6rem", background: krank ? "var(--color-gold-soft)" : undefined }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
            <div style={{ fontWeight: 800 }}>
              🤒 وضع المريض — <span style={{ color: "var(--color-ink2)", fontWeight: 400 }}>حدّ أدنى من 3 خطوات يكفي اليوم</span>
            </div>
            <button
              className={krank ? "btn btn-gold" : "btn btn-ghost"}
              style={{ padding: "0.3rem 0.8rem" }}
              onClick={() => update((p) => ({ ...p, gesundheit: { ...p.gesundheit, krank: !p.gesundheit?.krank } }))}
            >
              {krank ? "🤒 فعّال — أطفئه عند الشفاء" : "فعّل عند المرض"}
            </button>
          </div>
          {krank && (
            <div style={{ marginTop: "0.5rem" }}>
              <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)", marginBottom: "0.4rem" }}>
                قاعدة اليوم المريض: <strong>لا تنقطع ولا تُنهك</strong> — ثلاث خطوات فقط تُبقي لغتك حيّة وتُبقي السلسلة محفوظة. باقي الخطة يُرحَّل بلا تعويض جزائي.
              </div>
              {minimal.map((s, i) => (
                <button
                  key={i}
                  className="card"
                  style={{ display: "flex", gap: "0.5rem", width: "100%", textAlign: "start", padding: "0.5rem 0.8rem", marginBottom: "0.35rem", cursor: "pointer", background: schritte[i] ? "rgba(53,94,59,.08)" : "white", border: "1px solid var(--color-line)" }}
                  onClick={() => setSchritte((x) => ({ ...x, [i]: !x[i] }))}
                >
                  <span>{schritte[i] ? "✅" : s.emoji}</span>
                  <span style={{ fontSize: "0.88rem", lineHeight: 1.8 }}>{s.text}</span>
                </button>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.4rem" }}>
                <span style={{ fontSize: "0.78rem", color: "var(--color-ink2)" }}>
                  <span className="rtl-num">{fertig}</span>/3 خطوات · الجملة الثانية للشفاه: <De>{satzB.de}</De>
                </span>
                <button
                  className="btn btn-gold"
                  disabled={fertig < 3}
                  onClick={() => {
                    update((p) => logK(checkAbzeichen({ ...p, xp: (p.xp ?? 0) + 2 }), "Sprechen", true));
                    setSchritte({});
                  }}
                >
                  ✅ أنجزتُ الحدّ الأدنى — احفظ السلسلة
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ————— استراحة قسرية على كامل الشاشة ————— */}
      {pause !== null && (
        <div style={{ position: "fixed", inset: 0, zIndex: 70, background: "rgba(53, 94, 59, 0.92)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div className="card" style={{ padding: "2rem 2.4rem", textAlign: "center", maxWidth: "26rem" }}>
            <div style={{ fontSize: "3rem" }}>👁‍🗨</div>
            <h2 style={{ margin: "0.4rem 0", color: "var(--color-cola)" }}>استراحة العين — 20-20-20</h2>
            <p style={{ color: "var(--color-ink2)", lineHeight: 1.9, margin: "0.4rem 0" }}>
              انظر إلى نقطة تبعد نحو <strong>6 أمتار</strong> (20 قدماً) وارتح عشرين ثانية.
              أرِح كتفيك أيضاً — الجسد جزء من التعلّم.
            </p>
            <div style={{ fontSize: "3.2rem", fontWeight: 900, color: "var(--color-a1)" }} className="rtl-num">
              {pause}
            </div>
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginTop: "0.6rem" }}>
              <button className="btn btn-primary" onClick={() => setPause(null)}>نظرتُ إلى البعيد ✓</button>
              <button className="btn btn-ghost" onClick={() => setPause(null)}>تخطّيتُ ⏭</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
