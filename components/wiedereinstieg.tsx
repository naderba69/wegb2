"use client";
// 🌱 M15 (R287): لافتة وضع الاستئناف — ما يُخفَّض ولماذا، بلا عقاب
import { resumeZustand } from "@/lib/wiedereinstieg";
import type { Progress } from "@/lib/types";

export function WiedereinstiegBanner({ progress, minuten, normaleMinuten }: { progress: Progress; minuten: number; normaleMinuten: number }) {
  const z = resumeZustand(progress);
  if (!z.aktiv) return null;
  return (
    <section className="card" data-testid="wiedereinstieg-banner" style={{ padding: "0.85rem 1rem", display: "grid", gap: "0.3rem", borderInlineStart: "5px solid var(--color-a1)" }}>
      <strong>🌱 وضع الاستئناف — الجلسة {z.sitzung ?? 1} من 2 (M15)</strong>
      <div style={{ fontSize: "0.88rem", lineHeight: 1.9 }}>
        عدتَ بعد غياب <strong className="rtl-num">{z.gapDays}</strong> يومًا. لذلك تعرض خطّة اليوم المراجعات الحرجة والمهام الإلزامية فقط
        (<strong className="rtl-num">{minuten}</strong> بدل <strong className="rtl-num">{normaleMinuten}</strong> دقيقة)،
        وبطاقاتك الحرجة المستحقّة الآن: <strong className="rtl-num">{z.kritischeKarten}</strong>.
      </div>
      <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)" }}>
        لا محتوى جديدًا في جلستي العودة ولا ديون عقابية عمّا أُجّل — الهدف استرجاع الإيقاع أولًا.
      </div>
    </section>
  );
}
