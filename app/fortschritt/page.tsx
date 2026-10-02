"use client";
import { useState } from "react";
import { useProgress } from "@/lib/store";
import { activeProfile } from "@/lib/profiles";
import { Schultor } from "@/components/akademie/Schultor";
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
 * إحدى عشرة محطة تعرضُ ما صنعتَه ولا تدعوكَ إلى محتوى — الطابورُ وحده
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
  schultor: { icon: "🪪", titel: "بطاقة الطالب", unter: "هويّتك ومسارك كما هي — قراءةٌ فقط" },
};

export default function Fortschritt() {
  const { progress } = useProgress();
  const [offen, setOffen] = useState<string | null>(null);

  if (offen) {
    return (
      <div className="today-screen fadein" style={{ display: "grid", gap: "1rem" }}>
        <button type="button" className="btn btn-ghost" data-testid="fortschritt-zurueck" style={{ minHeight: "44px", justifySelf: "start" }} onClick={() => setOffen(null)}>
          → كل الإحصاءات
        </button>
        <section style={{ display: "grid", gap: "1rem" }}>
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
          {offen === "schultor" && <Schultor progress={progress} passiv />}
        </section>
      </div>
    );
  }

  const ids = ["berichte", "radar", "wegweiser", "fehlerkartei", "abzeichen", "gesundheit", "lernstrategie", "eltern", "kontrakt", "wochen", "schultor"];
  return (
    <div className="today-screen fadein" data-testid="fortschritt-liste" style={{ display: "grid", gap: "0.8rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "0.5rem", flexWrap: "wrap" }}>
        <h1 style={{ fontWeight: 900, fontSize: "1.2rem", margin: 0 }}>📈 تقدّمي</h1>
        <span style={{ fontSize: "0.82rem", color: "var(--color-ink2)" }}>مشاهدةٌ سلبية — لا روابطَ محتوى من هنا (الميثاق)</span>
      </header>

      <div style={{ display: "grid", gap: "0.6rem" }}>
        {ids.map((id) => {
          const k = KARTE[id];
          if (!k) return null;
          return (
            <button
              key={id}
              type="button"
              data-testid={`fortschritt-karte-${id}`}
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
