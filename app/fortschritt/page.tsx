"use client";
import { useState } from "react";
import { useProgress } from "@/lib/store";
import { activeProfile } from "@/lib/profiles";
import { BerichteZentrum } from "@/components/berichte";
import { WegWeiser } from "@/components/wegweiser";
import { RadarKarte } from "@/components/katalog";
import { Fehlerkartei } from "@/components/fehler-ui";
import { AbzeichenKarte } from "@/components/wochen";
import { GesundheitsWache } from "@/components/gesundheit";
import { LernStrategieZentrum } from "@/components/lernstrategie";
import { ElternPaket } from "@/components/elternpaket";
import { KontraktCard } from "@/components/kontrakt";
import { Wochenplan } from "@/components/wochen";
import { MenuSection } from "@/components/dirb/MenuSection";

/**
 * 📈 وجهة «تقدّمي» (P4): مشاهدةٌ سلبيةٌ محضة (K116b — صفر href وصفر Link).
 * عشرُ محطاتِ إحصاءٍ تعرضُ ما صنعتَه ولا تدعوكَ إلى محتوى — الطابورُ وحده
 * يملكُ الأبواب. زرُّ الرجوعِ زرٌّ داخليٌّ لا رابط.
 */
const KARTE: Record<string, { icon: string; titel: string; unter: string }> = {
  berichte: { icon: "📊", titel: "تقارير المدرّس", unter: "ملخّص لما أتقنته وما يحتاج إلى مراجعة." },
  radar: { icon: "📡", titel: "رادار الوحدات", unter: "تابع تقدّمك عبر وحدات المنهج." },
  wegweiser: { icon: "🧭", titel: "البوصلة", unter: "ثلاث خطوات مقترحة وفق مرحلتك." },
  fehlerkartei: { icon: "🗂️", titel: "فهرس الأخطاء", unter: "راجع الأخطاء التي سُجّلت لك." },
  abzeichen: { icon: "🏅", titel: "الأوسمة", unter: "شاهد الإنجازات التي حققتها." },
  gesundheit: { icon: "🩺", titel: "صحة تعلّمك", unter: "تابع وتيرة التعلّم وفترات الراحة." },
  lernstrategie: { icon: "🧠", titel: "استراتيجيات التعلّم", unter: "أفكار تساعدك على تنظيم المذاكرة." },
  eltern: { icon: "🏠", titel: "إشراف الأسرة", unter: "ملخّص أسبوعي لمشاركة الأسرة." },
  kontrakt: { icon: "📝", titel: "عقد التقدّم", unter: "تابع ساعات الأسبوع والاتفاقات المسجّلة." },
  wochen: { icon: "📆", titel: "جدول الأسبوع", unter: "اعرض أسبوعك يوماً بعد يوم." },
};

const MENU_GROUPS: { id: string; title: string; description: string; items: string[] }[] = [
  {
    id: "fortschritt-overview",
    title: "نظرة على التقدّم",
    description: "ملخّص الوحدات والنتائج وخطة الأسبوع.",
    items: ["berichte", "radar", "wegweiser", "wochen"],
  },
  {
    id: "fortschritt-records",
    title: "السجلّ والإنجازات",
    description: "الأخطاء التي رُصدت والإنجازات التي فتحتها.",
    items: ["fehlerkartei", "abzeichen"],
  },
  {
    id: "fortschritt-support",
    title: "الدعم والمتابعة",
    description: "الراحة، وتنظيم المذاكرة، والمتابعة الأسبوعية.",
    items: ["gesundheit", "lernstrategie", "eltern", "kontrakt"],
  },
];

export default function Fortschritt() {
  const { progress } = useProgress();
  const [offen, setOffen] = useState<string | null>(null);

  if (offen) {
    const k = KARTE[offen];
    return (
      <div className="today-screen fadein dirb ui-page">
        <button type="button" className="dirb-back" data-testid="fortschritt-zurueck" onClick={() => setOffen(null)}>
          → كل الإحصاءات
        </button>
        {k && (
          <div className="dirb-station-head">
            <div className="dirb-kicker">{k.icon} تفاصيل التقدّم</div>
            <h1 className="dirb-station-title">{k.titel}</h1>
            <div className="dirb-station-sub">{k.unter}</div>
          </div>
        )}
        <section className="dirb-station">
          {offen === "berichte" && <BerichteZentrum progress={progress} name={activeProfile().name} />}
          {offen === "radar" && <RadarKarte progress={progress} />}
          {offen === "wegweiser" && <WegWeiser progress={progress} />}
          {offen === "fehlerkartei" && <Fehlerkartei />}
          {offen === "abzeichen" && <AbzeichenKarte progress={progress} />}
          {offen === "gesundheit" && <GesundheitsWache progress={progress} />}
          {offen === "lernstrategie" && <LernStrategieZentrum progress={progress} />}
          {offen === "eltern" && <ElternPaket progress={progress} name={activeProfile().name} />}
          {offen === "kontrakt" && <KontraktCard progress={progress} />}
          {offen === "wochen" && <Wochenplan progress={progress} />}
        </section>
      </div>
    );
  }

  const ids = ["berichte", "radar", "wegweiser", "fehlerkartei", "abzeichen", "gesundheit", "lernstrategie", "eltern", "kontrakt", "wochen"];
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
        data-testid={`fortschritt-karte-${id}`}
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
    <div className="today-screen fadein dirb ui-page" data-testid="fortschritt-liste">
      <header className="dirb-tabhead dirb-hero-anim">
        <h1 className="dirb-title">تقدّمي</h1>
        <div className="dirb-sub">تابع ما أنجزته وما يحتاج إلى مراجعة.</div>
      </header>

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
