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

/**
 * 📈 وجهة «تقدّمي» (P4): مشاهدةٌ سلبيةٌ محضة (K116b — صفر href وصفر Link).
 * عشرُ محطاتِ إحصاءٍ تعرضُ ما صنعتَه ولا تدعوكَ إلى محتوى — الطابورُ وحده
 * يملكُ الأبواب. زرُّ الرجوعِ زرٌّ داخليٌّ لا رابط.
 */
const KARTE: Record<string, { icon: string; titel: string; unter: string }> = {
  berichte: { icon: "📊", titel: "تقارير المدرّس", unter: "ما أتقنتَه وما يحتاج تقوية — بلغة المدرّس" },
  radar: { icon: "📡", titel: "رادار الوحدات", unter: "خريطةُ تقدُّمك عبر وحدات المنهج" },
  wegweiser: { icon: "🧭", titel: "البوصلة", unter: "ثلاث وجهاتٍ من سجلّك حسب مرحلتك" },
  fehlerkartei: { icon: "🗂️", titel: "فهرس الأخطاء", unter: "دفترك كاملاً — قراءةٌ فقط" },
  abzeichen: { icon: "🏅", titel: "الأوسمة", unter: "ما فتحتَه من إنجازات" },
  gesundheit: { icon: "🩺", titel: "صحة تعلّمك", unter: "وتيرةُ عملك ونظامُ راحتك" },
  lernstrategie: { icon: "🧠", titel: "استراتيجيات التعلّم", unter: "كيف تدرس — علمُ الطريقة" },
  eltern: { icon: "🏠", titel: "إشراف الأسرة", unter: "تقريرُ الأسرة الأسبوعي" },
  kontrakt: { icon: "📝", titel: "عقد التقدّم", unter: "ساعاتُ الأسبوع والمعاملات المُوقَّعة" },
  wochen: { icon: "📆", titel: "جدول الأسبوع", unter: "نظرةٌ تقويميةٌ على أسبوعك" },
};

export default function Fortschritt() {
  const { progress } = useProgress();
  const [offen, setOffen] = useState<string | null>(null);

  if (offen) {
    const k = KARTE[offen];
    return (
      <div className="today-screen fadein dirb">
        <button type="button" className="dirb-back" data-testid="fortschritt-zurueck" onClick={() => setOffen(null)}>
          → كل الإحصاءات
        </button>
        {k && (
          <div className="dirb-station-head">
            <div className="dirb-kicker">{k.icon} FORTSCHRITT</div>
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
  return (
    <div className="today-screen fadein dirb" data-testid="fortschritt-liste">
      <header className="dirb-tabhead dirb-hero-anim">
        <div className="dirb-kicker">📈 FORTSCHRITT</div>
        <h1 className="dirb-title">تقدّمي</h1>
        <div className="dirb-sub">مشاهدةٌ سلبية — لا روابطَ محتوى من هنا (الميثاق)</div>
      </header>

      <div className="dirb-menu dirb-hero-anim-2">
        {ids.map((id) => {
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
        })}
      </div>
    </div>
  );
}
