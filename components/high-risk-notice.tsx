import { HIGH_RISK_GOVERNANCE, highRiskGovernanceFor, hasUnverifiedFactualGroups, type HighRiskSurfaceId } from "@/lib/high-risk-governance";

export function HighRiskContentNotice({ surfaceId, compact = false }: { surfaceId: HighRiskSurfaceId; compact?: boolean }) {
  const policy = highRiskGovernanceFor(surfaceId);
  const unverifiedFacts = hasUnverifiedFactualGroups(policy);

  return (
    <aside
      className="card"
      role="note"
      data-testid={`high-risk-notice-${surfaceId}`}
      style={{
        padding: compact ? "0.65rem 0.8rem" : "0.8rem 0.95rem",
        borderInlineStart: "4px solid var(--color-warn, #f59e0b)",
        background: "var(--color-warn-soft, #fff7ed)",
        display: "grid",
        gap: "0.3rem",
        fontSize: "0.84rem",
      }}
    >
      <strong>⚠️ {policy.titleAr}: تدريب غير معتمد، لا إرشاد رسمي أو مهني</strong>
      <span>{policy.noticeAr}</span>
      {!compact && <span>{policy.officialActionAr}</span>}
      <span data-testid={`high-risk-source-status-${surfaceId}`}>
        النطاق: <span lang="en" dir="ltr">{policy.jurisdiction}</span> · مراجعة تصنيف المخاطر: {HIGH_RISK_GOVERNANCE.updatedAt} (ليست مراجعة للوقائع) · المصدر الرسمي وتاريخ الصلاحية: {unverifiedFacts ? "غير مثبتين — التحقق الخارجي معلّق" : "لا ينطبقان على الأمثلة الخيالية"} · مراجعة مختص: معلّقة · تحقق ميداني: معلّق.
      </span>
    </aside>
  );
}
