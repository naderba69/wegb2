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
import { MenuSection } from "@/components/dirb/MenuSection";

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
  zusatz: { icon: "➕", titel: "تدريب إضافي", unter: "تمارين أخرى بقيت من درس اليوم." },
  fehlerlabor: { icon: "🔬", titel: "معمل تحليل الخطأ", unter: "افهم سبب الخطأ وتدرّب على تصحيحه." },
  uebungen: { icon: "🗂️", titel: "التدريب الحرّ", unter: "راجع المفردات والبطاقات وفق حاجتك." },
  blitz: { icon: "⚡", titel: "جولة سريعة", unter: "تدريب قصير من سؤال واحد." },
  hoeren: { icon: "🎧", titel: "معمل الاستماع", unter: "تدرّب على فهم النص المسموع." },
  lueck: { icon: "📝", titel: "إكمال الجمل", unter: "أكمل الكلمات الناقصة في الجملة." },
  muendlich: { icon: "🗣️", titel: "التدريب الشفوي", unter: "تحدّث ثم راجع الملاحظات المتاحة." },
  vortrag: { icon: "🎤", titel: "التحدّث أمام الجمهور", unter: "تدرّب على عرض قصير ضمن وقت محدد." },
  interview: { icon: "🤝", titel: "مقابلة العمل", unter: "تدرّب على الإجابة عن أسئلة المقابلة." },
  briefe: { icon: "✉️", titel: "كتابة الرسائل", unter: "اكتب رسالة تناسب الموقف." },
  szenarien: { icon: "🏙️", titel: "مواقف من الحياة", unter: "طبّق ما تعلّمته في مواقف واقعية." },
  tiefen: { icon: "📖", titel: "معجم المفردات", unter: "ابحث عن كلمة أو معنى عند الحاجة." },
  katalog: { icon: "🗃️", titel: "دليل التدريبات", unter: "استعرض التدريبات المتاحة في الأكاديمية." },
};

const MENU_GROUPS: { id: string; title: string; description: string; items: string[] }[] = [
  {
    id: "ueben-priority",
    title: "ابدأ بالأهم",
    description: "ابدأ بما بقي من الدرس، ثم راجع الأخطاء.",
    items: ["zusatz", "fehlerlabor", "uebungen", "blitz"],
  },
  {
    id: "ueben-skills",
    title: "تدرّب على المهارات",
    description: "اختر مهارة أو طبّق ما تعلّمته في موقف.",
    items: ["hoeren", "lueck", "muendlich", "vortrag", "interview", "briefe", "szenarien"],
  },
  {
    id: "ueben-reference",
    title: "مراجع إضافية",
    description: "للبحث والاستكشاف عند الحاجة.",
    items: ["tiefen", "katalog"],
  },
];

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

  if (!geladen) {
    return (
      <div className="today-screen fadein dirb ui-page" data-testid="ueben-loading" aria-busy="true">
        <header className="dirb-tabhead">
          <h1 className="dirb-title">تدرّب</h1>
          <div className="dirb-sub">لحظات، نجهّز قائمة التدريب.</div>
        </header>
        <div className="dirb-loading-state" role="status" aria-live="polite">
          <span className="dirb-loading-spinner" aria-hidden="true" />
          <span>يُحمّل التطبيق حالة يومك.</span>
        </div>
      </div>
    );
  }

  // ── الباب المقفل: سببٌ معلن وبابٌ واحد (K113b) ──
  if (!abend) {
    return (
      <div className="today-screen fadein dirb ui-page" data-testid="ueben-gesperrt">
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
      <div className="today-screen fadein dirb ui-page">
        <button type="button" className="dirb-back" onClick={() => setOffen(null)}>
          → كل التدريبات
        </button>
        <div className="dirb-station-head">
          <h1 className="dirb-station-title">تدريب إضافي</h1>
          <div className="dirb-station-sub">تمارين الدرس التي يمكنك حلّها بعد المهمة الأساسية.</div>
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
      <div className="today-screen fadein dirb ui-page">
        <button type="button" className="dirb-back" data-testid="ueben-zurueck" onClick={() => setOffen(null)}>
          → كل التدريبات
        </button>
        {k && (
          <div className="dirb-station-head">
            <div className="dirb-kicker">{k.icon} محطة تدريب</div>
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

  // ── القائمة حسب ترتيب الأولوية؛ التقسيم لا يغيّر ترتيبها (K112a) ──
  const ids = UEBEN_REIHENFOLGE.split(",").filter((id) => id !== "zusatz" || hatZusatz);
  const groups = MENU_GROUPS
    .map((group) => ({ ...group, items: group.items.filter((id) => ids.includes(id)) }))
    .filter((group) => group.items.length > 0);
  const renderCard = (id: string) => {
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
  };

  return (
    <div className="today-screen fadein dirb ui-page" data-testid="ueben-liste">
      <header className="dirb-tabhead dirb-hero-anim">
        <h1 className="dirb-title">تدرّب</h1>
        <div className="dirb-sub">اختر مجموعة التدريب التي تناسب ما تحتاجه اليوم.</div>
      </header>

      {offenBleibt && (
        <div className="dirb-hinweis dirb-hero-anim-2" data-testid="ueben-hinweis">
          مهامّ اليوم ما زالت مفتوحة؛ أنجزها من <Link href="/">صفحة اليوم</Link> ثم تابع التدريب هنا.
        </div>
      )}

      <div className="dirb-menu-groups dirb-hero-anim-2">
        {groups.map((group) => (
          <MenuSection
            key={group.id}
            id={group.id}
            title={group.title}
            description={group.description}
            count={group.items.length}
          >
            {group.items.map(renderCard)}
          </MenuSection>
        ))}
      </div>
    </div>
  );
}
