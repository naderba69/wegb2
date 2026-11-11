import type { Metadata } from "next";
import Link from "next/link";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { zaehleVpDialogPool } from "@/lib/vollpruefung-pool";
import { calculateScaffoldMetrics, SCAFFOLD_LEVELS, type ScaffoldTopic } from "@/lib/scaffold-metrics";

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
  decisionBreakdown: Record<string, number>;
  reviewedDecisions: number;
  pendingTriage: number;
  relatedCatalogReferences: number;
  candidateLiveImplementations: number;
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

type DialogBank = Array<{
  id: string;
  level: string;
  questions?: Array<{ options?: string[]; answer?: string }>;
}>;
type DialogAudio = { einsaetze: Array<{ id: string; file: string }> };
type ScaffoldBaseline = { reviewRule: string; asOf: string; nonBlockingRatios: boolean };
type ScaffoldReview = {
  reviewRule: string;
  claimBoundary: { independentHumanReview: boolean; candidateIsConfirmedDefect: boolean };
  summary: { reviewed: number; retained: number; removedRedundant: number; byLevel: Record<string, number> };
};

function readJson<T>(name: string): T {
  return JSON.parse(readFileSync(join(process.cwd(), "content", name), "utf8")) as T;
}

const alignment = readJson<Alignment>("accreditation-alignment.json");
const grammarProfile = readJson<GrammarProfile>("grammar-profile-matrix.json");
const toolSummary = readJson<ToolSummary>("tool-catalog-summary.json");
const externalEvidence = readJson<ExternalEvidence>("external-evidence.json");
const realWorld = readJson<RealWorldProgram>("real-world-validation.json");
const dialogBank = readJson<DialogBank>("dialogues.json");
const dialogAudio = readJson<DialogAudio>("dialog-audio.json");
const grammarBank = readJson<Record<string, ScaffoldTopic>>("grammar.json");
const scaffoldBaseline = readJson<ScaffoldBaseline>("scaffold-metrics-baseline.json");
const scaffoldReview = readJson<ScaffoldReview>("scaffold-review-b1-b2.json");
const dialogPool = zaehleVpDialogPool(dialogBank, new Set(dialogAudio.einsaetze.map((einsatz) => einsatz.id)));
const scaffoldMetrics = calculateScaffoldMetrics(grammarBank);

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
            <br /><small>{toolSummary.reviewedDecisions} قرار فرز · {toolSummary.pendingTriage} بانتظار الفرز · تنفيذ حي مرشح: {toolSummary.candidateLiveImplementations} · {toolSummary.relatedCatalogReferences} إحالة مفاهيمية · {toolSummary.resolvedExactDuplicateGroups}/8 تكرارات حرفية محلولة · {toolSummary.productIntegrated} موصولة بدليل كامل</small>
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
          <p style={{ color: "var(--color-ink2)" }}>
            قرارات الفرز: {toolSummary.decisionBreakdown.defer ?? 0} مؤجلة · {toolSummary.decisionBreakdown["research-only"] ?? 0} للبحث فقط · {toolSummary.decisionBreakdown["reject-not-applicable"] ?? 0} مرفوضة لعدم الملاءمة · {toolSummary.decisionBreakdown["merge-duplicate"] ?? 0} دمج تكرار.
          </p>
          <p style={{ marginBottom: 0, color: "var(--color-ink2)" }}>
            الجرد الحالي كشف {toolSummary.genericPrototypeModules} نموذجاً عاماً و{toolSummary.citationLabels} تسمية مرجع أولية؛ لا تُعد هذه مراجع موثقة أو مزايا إنتاجية.
          </p>
        </details>
      </section>

      <section className="card" data-testid="scaffold-transparency" style={{ padding: "1rem", display: "grid", gap: "0.7rem" }}>
        <h2 style={{ margin: 0 }}>شفافية السقالة القوسية حسب المستوى</h2>
        <p style={{ margin: 0, lineHeight: 1.85 }}>
          هذا مقياس رصد غير مانع: يحصي كل علامة <span className="de">(...)</span> في سؤال القواعد مرة واحدة، ولا يحكم بأنها خطأ. المرشح المرتبط بفراغ يحتاج قراراً تحريرياً حالةً بحالة؛ أما تكرار الجواب حرفياً فعيب مستقل يجب أن يبقى صفراً.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.7rem" }}>
          <div className="card" style={{ padding: "0.8rem" }}>
            <strong className="rtl-num">{scaffoldMetrics.parenthetical}/{scaffoldMetrics.items}</strong><br />
            بنداً يحمل علامة قوسية
          </div>
          <div className="card" style={{ padding: "0.8rem" }}>
            <strong className="rtl-num">{scaffoldMetrics.blankLinked}</strong><br />
            مرشحاً مرتبطاً بفراغ
          </div>
          <div className="card" style={{ padding: "0.8rem" }}>
            <strong className="rtl-num">{scaffoldMetrics.exactLeaks}</strong><br />
            تسريباً حرفياً مؤكداً
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
          {SCAFFOLD_LEVELS.map((level) => {
            const metric = scaffoldMetrics.byLevel[level];
            return <span className="chip" key={level}>{level}: {metric.parenthetical}/{metric.items} ({metric.parentheticalPct.toFixed(1)}%)</span>;
          })}
        </div>
        <p data-testid="scaffold-review-summary" style={{ margin: 0, lineHeight: 1.8 }}>
          مراجعة {scaffoldReview.reviewRule}: {scaffoldReview.summary.reviewed}/{scaffoldReview.summary.reviewed} حالة B1/B2 لها قرار صريح؛ احتُفظ بـ{scaffoldReview.summary.retained} وأزيلت {scaffoldReview.summary.removedRedundant} أقواس زائدة كررت معلومات خيارات MC. هذه مراجعة تحريرية داخلية وليست توقيع خبير تربوي مستقل.
        </p>
        <p style={{ margin: 0, color: "var(--color-ink2)", lineHeight: 1.8 }}>
          خط الأساس {scaffoldBaseline.reviewRule} مؤرخ في {scaffoldBaseline.asOf}: هذه إشارات مراجعة وليست عيوباً مؤكدة، ولا نفرض عتبات CEFR اعتباطية قبل دليل تربوي مستقل.
        </p>
      </section>

      <section className="card" data-testid="dialog-pool-transparenz" style={{ padding: "1rem", display: "grid", gap: "0.7rem" }}>
        <h2 style={{ margin: 0 }}>شفافية مخزون الاستماع المصغّر</h2>
        <p style={{ margin: 0, lineHeight: 1.85 }}>
          يدخل الحوار جولة التدريب إذا كان له صوت وسؤال اختيار من متعدد واحد صالح على الأقل؛ لم يعد الحوار ذو السؤال الواحد يُقصى صامتاً.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.7rem" }}>
          <div className="card" style={{ padding: "0.8rem" }}><strong className="rtl-num">{dialogPool.gesamt.akzeptiert}/{dialogPool.gesamt.gesamt}</strong><br />حواراً مقبولاً في المخزون</div>
          <div className="card" style={{ padding: "0.8rem" }}><strong className="rtl-num">{dialogPool.gesamt.ausgeschlossen}</strong><br />حواراً مقصى مع سبب</div>
          <div className="card" style={{ padding: "0.8rem" }}><strong className="rtl-num">{dialogPool.gesamt.mitEinerMc}</strong><br />حواراً له سؤال MC واحد</div>
          <div className="card" style={{ padding: "0.8rem" }}><strong className="rtl-num">{dialogPool.gesamt.mcFragen}</strong><br />سؤال MC صالح · {dialogPool.gesamt.sonstigeFragen} سؤالاً خارج مسار MC</div>
        </div>
        <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
          {["A0", "A1", "A2", "B1", "B2"].map((level) => {
            const pool = dialogPool.nachStufe[level];
            return pool ? <span className="chip" key={level}>{level}: {pool.akzeptiert}/{pool.gesamt} مقبول</span> : null;
          })}
        </div>
        <p style={{ margin: 0, color: "var(--color-ink2)", lineHeight: 1.8 }}>
          القبول في المخزون لا يعني أن الجولة الحالية محاكاة رسمية كاملة: الجولة تنتقي حوارين فقط وتعرض عدد بنودها الفعلي، بينما يظل هدف B2 المرجعي 30 بنداً في أربعة أجزاء بانتظار توسعة موثقة.
        </p>
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
