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
  probeklausur: { icon: "📋", titel: "اختبار تجريبي", unter: "Preisprobe: جلسةُ امتحانٍ بتوقيتٍ حقيقيّ" },
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
    return (
      <div className="today-screen fadein" style={{ display: "grid", gap: "1rem" }}>
        <button type="button" className="btn btn-ghost" data-testid="pruefen-zurueck" style={{ minHeight: "44px", justifySelf: "start" }} onClick={() => setOffen(null)}>
          → كل الاختبارات
        </button>
        <section style={{ display: "grid", gap: "1rem" }}>
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
    <div className="today-screen fadein" data-testid="pruefen-liste" style={{ display: "grid", gap: "0.8rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "0.5rem", flexWrap: "wrap" }}>
        <h1 style={{ fontWeight: 900, fontSize: "1.2rem", margin: 0 }}>🎯 اختبر</h1>
        <span style={{ fontSize: "0.82rem", color: "var(--color-ink2)" }}>بوابةُ الوحداتِ أولاً — الماكية لا تسبق البناء</span>
      </header>

      {!simsFrei && (
        <div className="card" data-testid="pruefen-sperre" style={{ padding: "0.65rem 0.95rem", borderInlineStart: "5px solid var(--color-die)", fontSize: "0.85rem", background: "var(--color-rosa-soft)" }}>
          🔒 الماكياتُ مقفلةٌ حتى تجتازَ امتحانَ وحدتك الحالية — الوحدةُ تُختبَرُ حين تكتمل، لا قبل.
        </div>
      )}

      <div style={{ display: "grid", gap: "0.6rem" }}>
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
              className="card"
              style={{ minHeight: "56px", padding: "0.8rem 1rem", textAlign: "start", cursor: gesperrt ? "not-allowed" : "pointer", opacity: gesperrt ? 0.55 : 1, display: "flex", gap: "0.8rem", alignItems: "center" }}
            >
              <span style={{ fontSize: "1.5rem" }} aria-hidden>{gesperrt ? "🔒" : k.icon}</span>
              <span>
                <span style={{ fontWeight: 800, display: "block" }}>{k.titel}</span>
                <span style={{ fontSize: "0.8rem", color: "var(--color-ink2)" }}>{gesperrt ? "مقفل — سببه: امتحانُ الوحدة لم يُجتَز" : k.unter}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
