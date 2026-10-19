"use client";
// ⚖️ M3 (R287): اقتراح إعادة توزيع المهارات — يظهر فقط عند هيمنة حقيقية موثّقة
import { KOMPETENZ_AR } from "@/lib/kompetenz";
import { skillUmschichtung } from "@/lib/skillplan";
import type { Progress } from "@/lib/types";

export function SkillBalancePlan({ progress }: { progress: Progress }) {
  const v = skillUmschichtung(progress);
  if (!v.dominant) return null;
  return (
    <section className="card" data-testid="skill-balance-plan" style={{ padding: "0.85rem 1rem", display: "grid", gap: "0.35rem", borderInlineStart: "5px solid var(--color-gold)" }}>
      <strong>⚖️ خطّتك تقترح إعادة توزيع (M3)</strong>
      <div style={{ fontSize: "0.88rem", lineHeight: 1.9 }}>
        في آخر 14 يومًا شكّلت مهارة <strong>{KOMPETENZ_AR[v.dominant]}</strong> نسبة <strong className="rtl-num">{Math.round(v.anteil * 100)}٪</strong> من محاولاتك المؤرّخة (<span className="rtl-num">{v.eintraege}</span> محاولة).
        لذلك خصّص في تدريبك الحرّ القادم <strong className="rtl-num">{v.vonMinuten}</strong> دقيقة أقلّ لها، ووزّعها:
        {v.ziele.map((z) => ` ${KOMPETENZ_AR[z.hand]} ${z.minuten} دقائق`).join(" ·")}.
      </div>
      <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)" }}>
        السبب معلن: الامتحان لا يعوّض مهارة بأخرى. هذا «فرض ناعم» بالاقتراح والسبب — مهام خطّتك الإلزامية لا تتغيّر، والتنفيذ من وجهة «تدرّب» في الشريط السفلي.
      </div>
    </section>
  );
}
