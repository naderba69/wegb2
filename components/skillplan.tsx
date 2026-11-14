"use client";
import Link from "next/link";
import { KOMPETENZ_AR } from "@/lib/kompetenz";
import { skillFoerderplan, skillVerifikationen } from "@/lib/skillplan";
import type { Kompetenz, Progress } from "@/lib/types";

const STATION_AR: Record<string, string> = {
  lesestoff: "قراءة وحوارات حرة",
  hoeren: "معمل الاستماع",
  briefe: "كتابة الرسائل",
  muendlich: "التدريب الشفوي",
  uebungen: "التدريب الحر",
  wortreview: "مراجعة البطاقات",
};

export function SkillBalancePlan({
  progress,
  onRecordDose,
}: {
  progress: Progress;
  onRecordDose?: (hand: Kompetenz) => void;
}) {
  const plan = skillFoerderplan(progress);
  const checks = skillVerifikationen(progress);
  if (plan.dosen.length === 0 && checks.length === 0) return null;
  const checkBySkill = new Map(checks.map((check) => [check.hand, check]));
  const visibleDoses = plan.dosen.filter((dose) => checkBySkill.get(dose.hand)?.status !== "passed");

  return (
    <section className="card" data-testid="skill-remediation-plan" style={{ padding: "0.85rem 1rem", display: "grid", gap: "0.65rem", borderInlineStart: "5px solid var(--color-gold)" }}>
      <div>
        <strong>🧭 جرعات علاجية اختيارية محدودة</strong>
        <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)", lineHeight: 1.8 }} data-testid="skill-remediation-boundary">
          تستعمل فقط نتائج حديثة مصححة آلياً أو خارجياً وغير مساعدة. لا تدخل تقارير الإنجاز أو التقييم الذاتي، ولا تُحذف أو تُرتب أهداف خطة الأيام الـ378. الجرعة تدريب إضافي وليست حكماً على المستوى.
        </div>
      </div>

      {visibleDoses.map((dose) => {
        const check = checkBySkill.get(dose.hand);
        const canRecord = !!onRecordDose && check?.status !== "waiting" && check?.status !== "due" && check?.status !== "passed";
        return (
          <article key={dose.hand} data-testid={`skill-dose-${dose.hand}`} style={{ padding: "0.65rem 0.75rem", border: "1px solid var(--color-line)", borderRadius: "0.7rem", display: "grid", gap: "0.35rem" }}>
            <div style={{ fontSize: "0.88rem", lineHeight: 1.8 }}>
              <strong>{KOMPETENZ_AR[dose.hand]}</strong>: أداء تدريبي داخلي حديث <strong className="rtl-num">{dose.wert}/100</strong> من وزن دليل مؤهل <span className="rtl-num">{dose.measuredWeight}</span>.
              الجرعة المقترحة <strong className="rtl-num">{dose.minuten} دقائق</strong> في «{STATION_AR[dose.station]}».
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
              <Link href={`/ueben?station=${dose.station}`} className="btn btn-ghost" style={{ minHeight: "44px", textDecoration: "none" }}>افتح «{STATION_AR[dose.station]}»</Link>
              {canRecord && (
                <button type="button" className="btn btn-primary" data-testid={`skill-dose-complete-${dose.hand}`} onClick={() => onRecordDose?.(dose.hand)} style={{ minHeight: "44px" }}>
                  أنجزت الجرعة — حدّد تحققاً مؤجلاً
                </button>
              )}
            </div>
          </article>
        );
      })}

      {checks.map((check) => (
        <div key={`verify-${check.hand}`} data-testid={`skill-verify-${check.hand}`} style={{ padding: "0.6rem 0.75rem", borderRadius: "0.65rem", background: "var(--color-paper2)", fontSize: "0.82rem", lineHeight: 1.8 }}>
          <strong>تحقق استقلال {KOMPETENZ_AR[check.hand]}:</strong>{" "}
          {check.status === "waiting" && <>مجدول في <span className="rtl-num">{check.cycle.verifyDueDate}</span>. التدريب أو الإعادة الفورية قبل هذا التاريخ لا تُحسب تحققاً.</>}
          {check.status === "due" && <>مستحق الآن؛ يلزم وزن <span className="rtl-num">3</span> من بنود جديدة غير مساعدة. المتاح بعد الموعد: <span className="rtl-num">{check.measuredWeight}</span>.</>}
          {check.status === "passed" && <>نجح التحقق الداخلي الجديد بنتيجة <span className="rtl-num">{check.score}/100</span>. هذا ثبات تدريبي محلي، لا مستوى CEFR ولا جاهزية امتحان.</>}
          {check.status === "repeat" && <>لم يثبت التحقق الداخلي بعد (<span className="rtl-num">{check.score}/100</span>)؛ اقترحت جرعة جديدة من دون حذف أي هدف أساسي.</>}
        </div>
      ))}
    </section>
  );
}
