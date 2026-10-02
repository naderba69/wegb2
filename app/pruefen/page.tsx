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

/**
 * 🎯 وجهة «اختبر» (P4): بوابة الوحدات أولاً (ModulTor — شرط المحرّك modulFrei)
 * ثم المحاكاة الأربعة خلف البوابة (K115): امتحان الوحدة يسبقُ أيَّ محاكاة —
 * الماكية لا تسبق البناء. شاشةٌ واحدة في كل مرّة وبابُ رجوعٍ زرّيّ لا رابط.
 */
const KARTE: Record<string, { icon: string; titel: string; unter: string }> = {
  tor: { icon: "🚪", titel: "بوابة الوحدة", unter: "امتحان الوحدة: أربع مهارات · 80٪ مجموعاً ولا مهارة دون 60٪" },
  probeklausur: { icon: "📋", titel: "اختبار تجريبي", unter: "جلسةُ امتحانٍ بتوقيتٍ حقيقيّ" },
  zentrum: { icon: "🏛️", titel: "مركز الاختبارات", unter: "اختبارات المراحل وشهادات الإتقان" },
  selbsttest: { icon: "🪞", titel: "الاختبار الذاتي", unter: "قِسْ مستواك بطرفٍ نقدٍّ لا بتمنّيك" },
  schulsim: { icon: "🏫", titel: "محاكاة المدرسة", unter: "يومُ اختبارٍ كاملٌ في محاكاة" },
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
            <div className="dirb-kicker">{k.icon} PRÜFEN</div>
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
  return (
    <div className="today-screen fadein dirb" data-testid="pruefen-liste">
      <header className="dirb-tabhead dirb-hero-anim">
        <div className="dirb-kicker">🎯 PRÜFEN</div>
        <h1 className="dirb-title">اختبر</h1>
        <div className="dirb-sub">بوابةُ الوحداتِ أولاً — الماكية لا تسبق البناء</div>
      </header>

      {!simsFrei && (
        <div className="dirb-sperre dirb-hero-anim-2" data-testid="pruefen-sperre">
          🔒 الماكياتُ مقفلةٌ حتى تجتازَ امتحانَ وحدتك الحالية — الوحدةُ تُختبَرُ حين تكتمل، لا قبل.
        </div>
      )}

      <div className="dirb-menu dirb-hero-anim-2">
        {ids.map((id) => {
          const k = KARTE[id];
          const gesperrt = id !== "tor" && !simsFrei;
          return (
            <button
              key={id}
              type="button"
              data-testid={`pruefen-karte-${id}`}
              disabled={gesperrt}
              title={gesperrt ? "اجتز امتحان وحدتك أولاً" : undefined}
              onClick={() => !gesperrt && setOffen(id)}
              className="dirb-menu-btn"
            >
              <span className="dirb-menu-ico" aria-hidden>{gesperrt ? "🔒" : k.icon}</span>
              <span className="dirb-menu-txt">
                <b>{k.titel}</b>
                <span>{gesperrt ? "مقفل — سببه: امتحانُ الوحدة لم يُجتَز" : k.unter}</span>
              </span>
              <span className="dirb-chev" aria-hidden>{gesperrt ? "" : "←"}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
