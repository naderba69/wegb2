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
      <div className="today-screen fadein dirb" data-testid="ueben-gesperrt">
        <div className="dirb-close dirb-hero-anim">
          <div style={{ fontSize: "2.6rem" }} aria-hidden>🔒</div>
          <h1 className="dirb-title" style={{ fontSize: "1.4rem" }}>تدرّب يفتح بعد إغلاق يومك</h1>
          <p className="dirb-sub" style={{ lineHeight: 1.9 }}>
            هكذا اتفقنا: الطابور أولاً — همّةُ اليوم تُنجَز ثم تُراجَع أخطاؤه ثم يُغلَق،
            وعندها يُفتح التدريب الحرّ لمساءٍ هادئ. لا زرَّ تخطٍّّ ولا طريقٌ جانبي.
          </p>
          <p className="dirb-sub" style={{ fontSize: "0.8rem" }}>
            الطريق: مهامّ اليوم ← مراجعة الأخطاء ← «تأكيد إغلاق اليوم».
          </p>
          <Link href="/" className="dirb-start" style={{ textDecoration: "none" }}>
            ↩ عُد إلى «اليوم» وأكمل طابورك
          </Link>
        </div>
      </div>
    );
  }

  // ── محطة مَرتحِلة: تدريب إضافي ──
  if (offen === "zusatz") {
    return (
      <div className="today-screen fadein dirb">
        <button type="button" className="dirb-back" onClick={() => setOffen(null)}>
          → كل التدريبات
        </button>
        <div className="dirb-station-head">
          <div className="dirb-kicker">➕ ZUSATZ</div>
          <h1 className="dirb-station-title">تدريب إضافي</h1>
          <div className="dirb-station-sub">تمارين درس اليوم التي زادت عن الثلاثة — ركّبناها هنا بدل أن نمرّرها.</div>
        </div>
        <section className="dirb-station">
          <ExerciseSet items={parkExercises} onPoints={() => {}} />
        </section>
      </div>
    );
  }

  // ── محطة مفتوحة: شاشة واحدة بباب رجوع ──
  if (offen) {
    const k = KARTE[offen];
    return (
      <div className="today-screen fadein dirb">
        <button type="button" className="dirb-back" data-testid="ueben-zurueck" onClick={() => setOffen(null)}>
          → كل التدريبات
        </button>
        {k && (
          <div className="dirb-station-head">
            <div className="dirb-kicker">{k.icon} ÜBEN</div>
            <h1 className="dirb-station-title">{k.titel}</h1>
            <div className="dirb-station-sub">{k.unter}</div>
          </div>
        )}
        <section className="dirb-station">
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
    <div className="today-screen fadein dirb" data-testid="ueben-liste">
      <header className="dirb-tabhead dirb-hero-anim">
        <div className="dirb-kicker">💪 ÜBEN</div>
        <h1 className="dirb-title">تدرّب</h1>
        <div className="dirb-sub">ترتيبُ الأولوية — الأخطاءَ قبل السرعة</div>
      </header>

      {offenBleibt && (
        <div className="dirb-hinweis dirb-hero-anim-2" data-testid="ueben-hinweis">
          طابورُ اليومِ ما زال مفتوحاً — درِّب ثم <Link href="/">عُد إلى «اليوم»</Link> حتى تُغلقه.
        </div>
      )}

      <div className="dirb-menu dirb-hero-anim-2">
        {ids.map((id) => {
          const k = KARTE[id];
          if (!k) return null;
          return (
            <button
              key={id}
              type="button"
              data-testid={`ueben-karte-${id}`}
              onClick={() => setOffen(id)}
              className="dirb-menu-btn"
            >
              <span className="dirb-menu-ico" aria-hidden>{k.icon}</span>
              <span className="dirb-menu-txt">
                <b>{k.titel}</b>
                <span>{k.unter}</span>
              </span>
              <span className="dirb-chev" aria-hidden>←</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
