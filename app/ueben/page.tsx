"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useProgress } from "@/lib/store";
import { buildDay } from "@/lib/plan";
import { grammarMap } from "@/lib/content";
import ExerciseSet from "@/components/exercises";
import { FehlerLabor } from "@/components/fehlerlabor";
import { UebungenCard } from "@/components/trainer";
import { BlitzDrill } from "@/components/blitz";
import { HoerLabor, LueckDiktat } from "@/components/hoeren";
import { MündlichLabor } from "@/components/muendlich";
import { VortragsBühne } from "@/components/vortrag";
import { InterviewArena } from "@/components/interview2";
import { BriefSchmiede } from "@/components/briefe";
import { LebensSzenarien } from "@/components/szenarien";
import { TiefenLexikon } from "@/components/tiefenlex";
import { KatalogLeiste } from "@/components/katalog";

/**
 * 💪 وجهة «تدرّب» (P3):
 * · الباب مقفل حتى إغلاق يومك (الميثاق: الطابور أولاً) — والقفل يذكر سببه (K113).
 * · ترتيب الأولوية معلن حرفياً (K112): زائد الدرس ← أخطاؤك ← التدريب الحرّ ←
 *   المهارات ← المعجم ← الكاتالوج.
 * · زائد التمارين (>3) يَرتحلُ من المعالج إلى «تدريب إضافي» هنا (K114).
 * شاشة واحدة في كل مرة: القائمة أو محطة واحدة بباب رجوع.
 */
const UEBEN_REIHENFOLGE = "zusatz,fehlerlabor,uebungen,blitz,hoeren,lueck,muendlich,vortrag,interview,briefe,szenarien,tiefen,katalog";

const KARTE: Record<string, { icon: string; titel: string; unter: string }> = {
  zusatz: { icon: "➕", titel: "تدريب إضافي", unter: "ما زاد عن 3 تمارين في درس اليوم — لا يمرُّ ولا يضيع" },
  fehlerlabor: { icon: "🔬", titel: "معمل تحليل الخطأ", unter: "أخطاؤك أولاً: ستّة أسباب · عائلات · حرارة · خطأ الشهر" },
  uebungen: { icon: "🗂️", titel: "التدريب الحرّ", unter: "بطاقات ومفردات وشفرات — SRS حرّ بلا موعد" },
  blitz: { icon: "⚡", titel: "برقّ", unter: "جولة سريعة: سؤال واحد لا ينتظر" },
  hoeren: { icon: "🎧", titel: "معمل الاستماع", unter: "نصوص مقروءة بصوت مُنتَج — استماع واحد يُحسب" },
  lueck: { icon: "🩳", titel: "فجوات الإملاء", unter: "أكمل ما نُقص من الجملة — أذنك تكتب" },
  muendlich: { icon: "🗣️", titel: "المختبر الشفوي", unter: "تحدَّث ثم تلقَّ تصحيحاً صوتياً" },
  vortrag: { icon: "🎤", titel: "خشبة العرض", unter: "عِرْض مُوقَّت بهدوء — دقة ووقت" },
  interview: { icon: "🤝", titel: "ساحة المقابلة", unter: "محاكاة مقابلة عمل بأسئلة حقيقية" },
  briefe: { icon: "✉️", titel: "مِسبَك الرسائل", unter: "اكتب رسالة ورقيّة مُحكَمة" },
  szenarien: { icon: "🏙️", titel: "سيناريوهات الحياة", unter: "طبيب · بنك · دوام — مواقف واقعية" },
  tiefen: { icon: "📖", titel: "المعجم العميق", unter: "بحثٌ حرٌّ في بنك الكلمات كله" },
  katalog: { icon: "🗃️", titel: "الكاتالوج", unter: "كل تدريبات الأكاديمية في قائمة واحدة" },
};

export default function Ueben() {
  const { progress } = useProgress();
  const [abend, setAbend] = useState(false);
  const [offen, setOffen] = useState<string | null>(null);
  const [geladen, setGeladen] = useState(false);

  useEffect(() => {
    setAbend(localStorage.getItem("weg-abend") === "1");
    setGeladen(true);
  }, []);

  const day = progress.plan.day;
  const plan = useMemo(() => buildDay(day, progress), [day, progress]);
  const offenBleibt = plan.tasks.some((tk) => !progress.plan.tasks[tk.id]);

  // المَرتحَل: زائدُ تمارينِ درسِ اليوم (weg-park- يكتبه المعالج)
  const gramTask = plan.tasks.find((t) => t.kind === "grammatik" && t.topicId);
  const topicId = gramTask?.topicId ?? null;
  const parkIds = useMemo(() => {
    if (!topicId) return [] as string[];
    try {
      const raw = localStorage.getItem(`weg-park-${topicId}`);
      const ids = raw ? (JSON.parse(raw) as string[]) : [];
      return Array.isArray(ids) ? ids : [];
    } catch { return []; }
  }, [topicId]);
  const parkExercises = useMemo(() => {
    if (!topicId || parkIds.length === 0) return [];
    const t = grammarMap[topicId];
    if (!t) return [];
    return t.exercises.filter((e) => parkIds.includes(e.id));
  }, [topicId, parkIds]);
  const hatZusatz = parkExercises.length > 0;

  if (!geladen) return null;

  // ── الباب المقفل: سببٌ معلن وبابٌ واحد (K113b) ──
  if (!abend) {
    return (
      <div className="today-screen fadein" data-testid="ueben-gesperrt" style={{ display: "grid", gap: "1rem" }}>
        <div className="card" style={{ padding: "2rem 1.4rem", textAlign: "center", borderInlineStart: "5px solid var(--color-die)" }}>
          <div style={{ fontSize: "2.4rem" }} aria-hidden>🔒</div>
          <h1 style={{ fontWeight: 900, fontSize: "1.3rem", margin: "0.5rem 0 0.3rem" }}>تدرّب يفتح بعد إغلاق يومك</h1>
          <p style={{ color: "var(--color-ink2)", lineHeight: 1.9, maxWidth: "30rem", margin: "0 auto" }}>
            هكذا اتفقنا: الطابور أولاً — همّةُ اليوم تُنجَز ثم تُراجَع أخطاؤه ثم يُغلَق،
            وعندها يُفتح التدريب الحرّ لمساءٍ هادئ. لا زرَّ تخطٍّّ ولا طريقٌ جانبي.
          </p>
          <p style={{ color: "var(--color-ink2)", fontSize: "0.86rem", margin: "0.6rem 0 1.2rem" }}>
            الطريق: مهامّ اليوم ← مراجعة الأخطاء (FehlerRevue) ← «تأكيد إغلاق اليوم».
          </p>
          <Link href="/" className="btn btn-primary" style={{ minHeight: "44px", textDecoration: "none" }}>
            ↩ عُد إلى «اليوم» وأكمل طابورك
          </Link>
        </div>
      </div>
    );
  }

  // ── محطة مَرتحِلة: تدريب إضافي ──
  if (offen === "zusatz") {
    return (
      <div className="today-screen fadein" style={{ display: "grid", gap: "1rem" }}>
        <button type="button" className="btn btn-ghost" style={{ minHeight: "44px", justifySelf: "start" }} onClick={() => setOffen(null)}>
          → كل التدريبات
        </button>
        <section className="card" style={{ padding: "1.1rem 1.2rem" }}>
          <h1 style={{ fontWeight: 900, fontSize: "1.15rem", margin: "0 0 0.3rem" }}>➕ تدريب إضافي</h1>
          <p style={{ fontSize: "0.85rem", color: "var(--color-ink2)", margin: "0 0 0.8rem" }}>
            تمارين درس اليوم التي زادت عن الثلاثة — ركّبناها هنا بدل أن نمرّرها.
          </p>
          <ExerciseSet items={parkExercises} onPoints={() => {}} />
        </section>
      </div>
    );
  }

  // ── محطة مفتوحة: شاشة واحدة بباب رجوع ──
  if (offen) {
    return (
      <div className="today-screen fadein" style={{ display: "grid", gap: "1rem" }}>
        <button type="button" className="btn btn-ghost" data-testid="ueben-zurueck" style={{ minHeight: "44px", justifySelf: "start" }} onClick={() => setOffen(null)}>
          → كل التدريبات
        </button>
        <section style={{ display: "grid", gap: "1rem" }}>
          {offen === "fehlerlabor" && <FehlerLabor progress={progress} />}
          {offen === "uebungen" && <UebungenCard progress={progress} />}
          {offen === "blitz" && <BlitzDrill progress={progress} />}
          {offen === "hoeren" && <HoerLabor progress={progress} />}
          {offen === "lueck" && <LueckDiktat progress={progress} />}
          {offen === "muendlich" && <MündlichLabor progress={progress} />}
          {offen === "vortrag" && <VortragsBühne progress={progress} />}
          {offen === "interview" && <InterviewArena progress={progress} />}
          {offen === "briefe" && <BriefSchmiede progress={progress} />}
          {offen === "szenarien" && <LebensSzenarien progress={progress} />}
          {offen === "tiefen" && <TiefenLexikon progress={progress} />}
          {offen === "katalog" && <KatalogLeiste />}
        </section>
      </div>
    );
  }

  // ── القائمة حسب ترتيب الأولوية (K112a) ──
  const ids = UEBEN_REIHENFOLGE.split(",").filter((id) => id !== "zusatz" || hatZusatz);
  return (
    <div className="today-screen fadein" data-testid="ueben-liste" style={{ display: "grid", gap: "0.8rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "0.5rem", flexWrap: "wrap" }}>
        <h1 style={{ fontWeight: 900, fontSize: "1.2rem", margin: 0 }}>💪 تدرّب</h1>
        <span style={{ fontSize: "0.82rem", color: "var(--color-ink2)" }}>ترتيبُ الأولوية — الأخطاءَ قبل السرعة</span>
      </header>

      {offenBleibt && (
        <div className="card" data-testid="ueben-hinweis" style={{ padding: "0.6rem 0.9rem", borderInlineStart: "5px solid var(--color-gold)", fontSize: "0.85rem", background: "var(--color-gold-soft)" }}>
          طابورُ اليومِ ما زال مفتوحاً — درِّب ثم <Link href="/" style={{ color: "var(--color-cola)", fontWeight: 800 }}>عُد إلى «اليوم»</Link> حتى تُغلقه.
        </div>
      )}

      <div style={{ display: "grid", gap: "0.6rem" }}>
        {ids.map((id) => {
          const k = KARTE[id];
          if (!k) return null;
          return (
            <button
              key={id}
              type="button"
              data-testid={`ueben-karte-${id}`}
              onClick={() => setOffen(id)}
              className="card"
              style={{ minHeight: "56px", padding: "0.8rem 1rem", textAlign: "start", cursor: "pointer", display: "flex", gap: "0.8rem", alignItems: "center" }}
            >
              <span style={{ fontSize: "1.5rem" }} aria-hidden>{k.icon}</span>
              <span>
                <span style={{ fontWeight: 800, display: "block" }}>{k.titel}</span>
                <span style={{ fontSize: "0.8rem", color: "var(--color-ink2)" }}>{k.unter}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
