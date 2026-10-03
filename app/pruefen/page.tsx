"use client";
import { useState } from "react";
import { useProgress } from "@/lib/store";
import { modulOf } from "@/lib/plan";
import { modulFrei, modulIndex } from "@/lib/modulpruefung";
import ModulTor from "@/components/modultor";
import { ProbeklausurCard } from "@/components/klausur";
import { PruefungsZentrum } from "@/components/pruefung";
import { SelbstTestZentrum } from "@/components/selbsttest";
import { SchulSimulator } from "@/components/schulsim";
import { MenuSection } from "@/components/dirb/MenuSection";

/**
 * 🎯 وجهة «اختبر» (P4): بوابة الوحدات أولاً (ModulTor — شرط المحرّك modulFrei)
 * ثم المحاكاة الأربعة خلف البوابة (K115): امتحان الوحدة يسبقُ أيَّ محاكاة —
 * الماكية لا تسبق البناء. شاشةٌ واحدة في كل مرّة وبابُ رجوعٍ زرّيّ لا رابط.
 */
const KARTE: Record<string, { icon: string; titel: string; unter: string }> = {
  tor: { icon: "🚪", titel: "بوابة الوحدة", unter: "أربع مهارات · 80٪ مجموعاً ولا مهارة دون 60٪" },
  probeklausur: { icon: "📋", titel: "اختبار تجريبي", unter: "جلسة تدريبية بوقت محدد." },
  zentrum: { icon: "🏛️", titel: "مركز الاختبارات", unter: "اختبارات المراحل وسجلّ النتائج." },
  selbsttest: { icon: "🪞", titel: "الاختبار الذاتي", unter: "راجع ما تتقنه وما يحتاج إلى تدريب." },
  schulsim: { icon: "🏫", titel: "محاكاة المدرسة", unter: "تدرّب على يوم اختبار كامل." },
};

export default function Pruefen() {
  const { progress } = useProgress();
  const [offen, setOffen] = useState<string | null>(null);
  const day = progress.plan.day;

  // 🔒 خلف بوابة الوحدات: الماكيات لا تُفتح إلا بجَوْزِ وحدتك الحالية
  const simsFrei = modulFrei(progress, modulIndex(modulOf(day).modul) + 1);

  if (offen) {
    const k = KARTE[offen];
    return (
      <div className="today-screen fadein dirb">
        <button type="button" className="dirb-back" data-testid="pruefen-zurueck" onClick={() => setOffen(null)}>
          → كل الاختبارات
        </button>
        {k && (
          <div className="dirb-station-head">
            <div className="dirb-kicker">{k.icon} محطة اختبار</div>
            <h1 className="dirb-station-title">{k.titel}</h1>
            <div className="dirb-station-sub">{k.unter}</div>
          </div>
        )}
        <section className="dirb-station">
          {offen === "tor" && <ModulTor day={day} />}
          {offen === "probeklausur" && <ProbeklausurCard progress={progress} />}
          {offen === "zentrum" && <PruefungsZentrum progress={progress} />}
          {offen === "selbsttest" && <SelbstTestZentrum progress={progress} />}
          {offen === "schulsim" && <SchulSimulator progress={progress} />}
        </section>
      </div>
    );
  }

  const ids = ["tor", "probeklausur", "zentrum", "selbsttest", "schulsim"];
  const renderCard = (id: string) => {
    const k = KARTE[id];
    if (!k) return null;
    const gesperrt = id !== "tor" && !simsFrei;
    return (
      <button
        key={id}
        type="button"
        data-testid={`pruefen-karte-${id}`}
        disabled={gesperrt}
        aria-describedby={gesperrt ? "pruefen-sperre" : undefined}
        title={gesperrt ? "اجتز اختبار الوحدة أولاً" : undefined}
        onClick={() => !gesperrt && setOffen(id)}
        className="dirb-menu-btn"
      >
        <span className="dirb-menu-ico" aria-hidden>{gesperrt ? "🔒" : k.icon}</span>
        <span className="dirb-menu-txt">
          <b>{k.titel}</b>
          <span>{gesperrt ? "مقفل الآن" : k.unter}</span>
        </span>
        <span className="dirb-chev" aria-hidden>{gesperrt ? "" : "←"}</span>
      </button>
    );
  };
  return (
    <div className="today-screen fadein dirb" data-testid="pruefen-liste">
      <header className="dirb-tabhead dirb-hero-anim">
        <h1 className="dirb-title">اختبر</h1>
        <div className="dirb-sub">اختبر ما تعلّمته بعد إنهاء دروس الوحدة.</div>
      </header>

      <div className="dirb-menu-groups dirb-hero-anim-2">
        <MenuSection
          id="pruefen-unit"
          title="اختبار الوحدة"
          description="ابدأ به قبل المحاكاة."
          count={1}
        >
          {renderCard("tor")}
        </MenuSection>

        {!simsFrei && (
          <div id="pruefen-sperre" className="dirb-sperre" data-testid="pruefen-sperre" role="note">
            🔒 تُفتح الاختبارات الإضافية بعد اجتياز اختبار الوحدة الحالية.
          </div>
        )}

        <MenuSection
          id="pruefen-simulations"
          title="اختبارات إضافية"
          description="خيارات أخرى للتدرّب على الاختبارات."
          count={ids.length - 1}
        >
          {ids.filter((id) => id !== "tor").map(renderCard)}
        </MenuSection>
      </div>
    </div>
  );
}
