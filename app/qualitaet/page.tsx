import type { Metadata } from "next";
import Link from "next/link";
import { readFileSync } from "node:fs";
import { join } from "node:path";

type Alignment = {
  productClaim: { ar: string };
  targets: Array<{
    id: string;
    sourceReviewStatus: string;
    sources: Array<{ id: string; url: string }>;
    requirements: Array<{
      id: string;
      workingRequirement: string;
      workingRequirementAr: string;
      implementationStatus: string;
      sourceReviewStatus: string;
    }>;
  }>;
  externalGates: Array<{ id: string; titleAr: string; ownerRole: string; status: string }>;
};

type GrammarProfile = {
  claimAr: string;
  summary: { topics: number; candidateFeatures: number; sourceVerifiedFeatures: number; directlyAssessedFeatures: number; humanReviewedFeatures: number };
};

type ToolSummary = {
  total: number;
  citationLabels: number;
  genericPrototypeModules: number;
  resolvedExactDuplicateGroups: number;
  reviewedDecisions: number;
  productIntegrated: number;
  fieldValidated: number;
  claimAr: string;
};

type ExternalEvidence = {
  sourceArtifacts: Array<{ status: string }>;
  requirementReviews: Array<{ status: string }>;
  gateReviews: Array<{ status: string }>;
};

type RealWorldProgram = {
  automatedPreflight: Array<{ status: string }>;
  testCases: Array<{ status: string }>;
};

function readJson<T>(name: string): T {
  return JSON.parse(readFileSync(join(process.cwd(), "content", name), "utf8")) as T;
}

const alignment = readJson<Alignment>("accreditation-alignment.json");
const grammarProfile = readJson<GrammarProfile>("grammar-profile-matrix.json");
const toolSummary = readJson<ToolSummary>("tool-catalog-summary.json");
const externalEvidence = readJson<ExternalEvidence>("external-evidence.json");
const realWorld = readJson<RealWorldProgram>("real-world-validation.json");

export const metadata: Metadata = {
  title: "الجودة والمواءمة — WegB2",
  description: "حالة مواءمة WegB2 مع Goethe B2 وtelc B2 وحدود الاعتماد والمراجعات الخارجية.",
};

const statusLabel: Record<string, string> = {
  implemented: "منفّذ برمجياً",
  verified: "مراجع وموقّع",
  pending: "ينتظر مراجعة المصدر",
  "official-snapshot-pending": "ينتظر حفظ المصدر الرسمي وتوقيعه",
  "pending-external": "ينتظر جهة خارجية",
  passed: "مكتمل",
};

export default function QualitaetPage() {
  const requirements = alignment.targets.flatMap((target) => target.requirements);
  const implemented = requirements.filter((item) => item.implementationStatus === "implemented").length;
  const externalDone = alignment.externalGates.filter((gate) => gate.status === "passed").length;
  const evidenceUnits = [...externalEvidence.sourceArtifacts, ...externalEvidence.requirementReviews, ...externalEvidence.gateReviews];
  const evidenceDone = evidenceUnits.filter((item) => item.status === "verified" || item.status === "passed").length;
  const realWorldDone = realWorld.testCases.filter((item) => item.status === "passed" || item.status === "failed" || item.status === "blocked").length;

  return (
    <div style={{ maxWidth: "960px", margin: "0 auto", padding: "1.25rem 1rem 5rem", display: "grid", gap: "1rem" }}>
      <header className="card" style={{ padding: "1.2rem", display: "grid", gap: "0.7rem" }}>
        <p style={{ margin: 0, color: "var(--color-ink2)", fontWeight: 800 }}>ملف الجودة والشفافية</p>
        <h1 style={{ margin: 0 }}>مواءمة Goethe B2 وtelc B2</h1>
        <p style={{ margin: 0, lineHeight: 1.9 }}>
نعمل على منتج تحضير يستهدف مواءمة الصيغتين وقابل للمراجعة. هذه الصفحة لا تعرض ختم اعتماد؛ بل تفصل ما أثبته الكود عما يحتاج مصدراً رسمياً ومراجعاً بشرياً أو قراراً من الجهة المانحة.
        </p>
      </header>

      <section className="card" role="status" style={{ padding: "1rem", borderInlineStart: "5px solid var(--color-cola)", display: "grid", gap: "0.45rem" }}>
        <strong>حالة الادعاء الآن: المنتج مستقل ولا يحمل اعتماداً رسمياً من Goethe-Institut أو telc gGmbH.</strong>
        <span style={{ lineHeight: 1.8 }}>{alignment.productClaim.ar}</span>
        <span style={{ color: "var(--color-ink2)" }}>المسموح: منتج تحضير ومحاكاة تدريبية وتقييم ذاتي غير رسمي.</span>
      </section>

      <section className="card" style={{ padding: "1rem" }}>
        <h2 style={{ marginTop: 0 }}>الملخص القابل للتحقق</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.7rem" }}>
          <div className="card" style={{ padding: "0.8rem" }}><strong className="rtl-num">{implemented}/{requirements.length}</strong><br />مطالب منفذة برمجياً</div>
          <div className="card" style={{ padding: "0.8rem" }}><strong className="rtl-num">{externalDone}/{alignment.externalGates.length}</strong><br />حواجز خارجية موقعة</div>
          <div className="card" style={{ padding: "0.8rem" }}><strong className="rtl-num">2</strong><br />هدفان: Goethe B2 وtelc B2</div>
        </div>
      </section>

      <section className="card" style={{ padding: "1rem", display: "grid", gap: "0.8rem" }}>
        <h2 style={{ margin: 0 }}>برنامج الإكمال الأكاديمي</h2>
        <p style={{ margin: 0, lineHeight: 1.85 }}>
          الأرقام التالية تفصل الجرد والبنية عن التحقق. وجود سمة أو فكرة في ملف لا يعني أنها معتمدة أو موصولة بالمتعلم.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "0.7rem" }}>
          <div className="card" style={{ padding: "0.8rem" }}>
            <strong className="rtl-num">{grammarProfile.summary.candidateFeatures}</strong><br />
            سمات قواعد مرشحة من {grammarProfile.summary.topics} موضوعاً
            <br /><small>{grammarProfile.summary.sourceVerifiedFeatures} موثقة خارجياً · {grammarProfile.summary.directlyAssessedFeatures} مربوطة مباشرة بقياس</small>
          </div>
          <div className="card" style={{ padding: "0.8rem" }}>
            <strong className="rtl-num">{toolSummary.total}</strong><br />
            فكرة/مفهوم في الكتالوج
            <br /><small>{toolSummary.reviewedDecisions} قرار فرز · {toolSummary.resolvedExactDuplicateGroups}/8 تكرارات حرفية محلولة · {toolSummary.productIntegrated} موصولة بدليل كامل</small>
          </div>
          <div className="card" style={{ padding: "0.8rem" }}>
            <strong className="rtl-num">{evidenceDone}/{evidenceUnits.length}</strong><br />
            وحدات مصدر ومراجعة موقعة
            <br /><small>2 مصدر + 10 مراجعات + 7 حواجز</small>
          </div>
          <div className="card" style={{ padding: "0.8rem" }}>
            <strong className="rtl-num">{realWorldDone}/{realWorld.testCases.length}</strong><br />
            جلسات اختبار واقعي موثقة
            <br /><small>{realWorld.automatedPreflight.length} بوابات مخبرية تمهيدية لا تحل محلها</small>
          </div>
        </div>
        <details>
          <summary style={{ cursor: "pointer", fontWeight: 800 }}>حدود مصفوفة القواعد وكتالوج 820</summary>
          <p style={{ lineHeight: 1.85 }}>{grammarProfile.claimAr}</p>
          <p style={{ lineHeight: 1.85 }}>{toolSummary.claimAr}</p>
          <p style={{ marginBottom: 0, color: "var(--color-ink2)" }}>
            الجرد الحالي كشف {toolSummary.genericPrototypeModules} نموذجاً عاماً و{toolSummary.citationLabels} تسمية مرجع أولية؛ لا تُعد هذه مراجع موثقة أو مزايا إنتاجية.
          </p>
        </details>
      </section>

      {alignment.targets.map((target) => (
        <section key={target.id} className="card" style={{ padding: "1rem", display: "grid", gap: "0.75rem" }}>
          <div>
            <h2 style={{ margin: 0 }}>{target.id === "goethe-b2" ? "Goethe-Zertifikat B2" : "telc Deutsch B2"}</h2>
            <p style={{ margin: "0.25rem 0 0", color: "var(--color-ink2)" }}>
              حالة المصدر: {statusLabel[target.sourceReviewStatus] ?? target.sourceReviewStatus}
            </p>
          </div>
          <ul style={{ margin: 0, paddingInlineStart: "1.3rem", display: "grid", gap: "0.55rem" }}>
            {target.requirements.map((requirement) => (
              <li key={requirement.id} style={{ lineHeight: 1.7 }}>
                <strong className="de">{requirement.id}</strong> — {requirement.workingRequirementAr}
                <br />
                <span style={{ color: "var(--color-ink2)", fontSize: "0.88rem" }}>
                  {statusLabel[requirement.implementationStatus] ?? requirement.implementationStatus} · {statusLabel[requirement.sourceReviewStatus] ?? requirement.sourceReviewStatus}
                </span>
              </li>
            ))}
          </ul>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {target.sources.map((source) => (
              <a key={source.id} className="btn btn-ghost" href={source.url} rel="noreferrer">المصدر الرسمي الخارجي ↗</a>
            ))}
          </div>
        </section>
      ))}

      <section className="card" style={{ padding: "1rem" }}>
        <h2 style={{ marginTop: 0 }}>ما يمنع الاعتماد الآن؟</h2>
        <ol style={{ margin: 0, paddingInlineStart: "1.4rem", display: "grid", gap: "0.7rem" }}>
          {alignment.externalGates.map((gate) => (
            <li key={gate.id} style={{ lineHeight: 1.75 }}>
              <strong>{gate.titleAr}</strong>
              <br />
              <span style={{ color: "var(--color-ink2)" }}>المسؤول: {gate.ownerRole} · الحالة: {statusLabel[gate.status] ?? gate.status}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="card" style={{ padding: "1rem", lineHeight: 1.9 }}>
        <h2 style={{ marginTop: 0 }}>المعيار النهائي</h2>
        <p>لا تتحول عبارة «متوافق» إلى «معتمد» إلا بوثيقة مكتوبة من الجهة صاحبة الاسم. نجاح الاختبارات الآلية يثبت السلوك البرمجي فقط.</p>
        <p style={{ marginBottom: 0 }}>
          التفاصيل التنفيذية محفوظة في ملف خارطة الاعتماد داخل المستودع. راجع أيضاً <Link href="/datenschutz">الخصوصية والبيانات</Link>.
        </p>
      </section>
    </div>
  );
}
