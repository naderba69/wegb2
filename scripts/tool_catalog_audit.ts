#!/usr/bin/env tsx
/** Honest lifecycle gate for the 181–1000 research/tool catalog. */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import YAML from "yaml";

type Tool = { id: number; family: string; titleDe: string; titleAr: string; level: string; bloom: string; examRelevant: boolean; fase: string; research?: string; desc?: string; code?: string };
type Override = { decision?: string; researchStatus?: string; productStatus?: string; automatedTestStatus?: string; fieldValidationStatus?: string; classification?: string; reviewerRole?: string; reviewedAt?: string; risk?: string; rationaleAr?: string; candidateEvidence?: string[]; productionEvidence?: string; relatedIds?: number[]; canonicalId?: number };
type Governance = { schemaVersion: number; catalog: { firstId: number; lastId: number; expectedEntries: number }; claimAr: string; defaultState: Record<string, string>; allowedDecisions: string[]; allowedProductStatuses: string[]; productionAcceptance: string[]; overrides: Record<string, Override> };
type Summary = { schemaVersion: number; total: number; firstId: number; lastId: number; citationLabels: number; genericPrototypeModules: number; exactDuplicateTitleGroups: Array<{ title: string; ids: number[] }>; resolvedExactDuplicateGroups: number; decisionBreakdown: Record<string, number>; reviewedDecisions: number; pendingTriage: number; relatedCatalogReferences: number; candidateLiveImplementations: number; automatedTested: number; adopted: number; productIntegrated: number; fieldValidated: number; claimAr: string };
type ProductionEvidence = { schemaVersion: number; toolId: number; cycleId: string; lifecycleStatus: string; claimScopeAr: string; learningDesign: { targetLearnerAr: string; learnerVisibleActivities: string[]; measurableOutcomeAr: string; runtimeEvidence: string[] }; sourceReview: { status: string }; automatedTests: { status: string; commands: string[]; testCases: Array<{ id: string; file: string; coversAr: string }> }; accessibilityPrivacyReview: { status: string; accessibilityEvidence: string[]; privacyEvidence: string[]; limitationsAr: string }; fieldValidation: { status: string }; releaseDecision: { productStatus: string; decision: string; reasonAr: string } };
type ReviewItem = { id: number; titleDe: string; titleAr: string; family: string; level: string; bloom: string; citationLabel: string | null; prototypeKind: string; duplicateTitleIds: number[]; status: Record<string, unknown> };
type ReviewMatrix = { schemaVersion: number; claimAr: string; items: ReviewItem[] };

const ROOT = process.cwd();
const strict = process.argv.includes("--strict-production");
const tools = YAML.parse(readFileSync(resolve(ROOT, "content/tools.yaml"), "utf8")) as Tool[];
const governance = JSON.parse(readFileSync(resolve(ROOT, "content/tool-catalog-governance.json"), "utf8")) as Governance;
const summary = JSON.parse(readFileSync(resolve(ROOT, "content/tool-catalog-summary.json"), "utf8")) as Summary;
const reviewMatrix = JSON.parse(readFileSync(resolve(ROOT, "content/tool-catalog-review-matrix.json"), "utf8")) as ReviewMatrix;
let passed = 0;
const failures: string[] = [];
const check = (condition: unknown, label: string) => condition ? (passed++, console.log(`✓ ${label}`)) : (failures.push(label), console.error(`✗ ${label}`));

console.log("=== 820 TOOL/IDEA CATALOG AUDIT ===\n");
check(Array.isArray(tools) && governance.schemaVersion === 1 && summary.schemaVersion === 1, "مصادر الكتالوج والحوكمة والملخص ذات مخطط صالح");
check(tools.length === governance.catalog.expectedEntries && tools.length === 820, "الكتالوج يحتوي 820 سجلاً بالضبط");
const ids = tools.map((tool) => tool.id);
check(Math.min(...ids) === governance.catalog.firstId && Math.max(...ids) === governance.catalog.lastId && new Set(ids).size === tools.length, "المعرفات متصلة وفريدة من 181 إلى 1000");
check(ids.every((id, index) => id === governance.catalog.firstId + index), "لا فجوة أو إعادة ترتيب في معرفات الكتالوج");
check(tools.every((tool) => tool.family && tool.titleDe && tool.titleAr && tool.level && tool.bloom && typeof tool.examRelevant === "boolean" && tool.fase), "الحد الأدنى الوصفي موجود لكل سجل");
check(governance.claimAr.includes("ليست 820 ميزة مدمجة") && governance.defaultState.productStatus === "prototype-not-wired", "حد الادعاء يمنع عد النماذج الأولية مزايا مكتملة");
check(governance.productionAcceptance.length >= 8, "معيار الإنتاج يطلب المصدر والسلوك والقياس والاختبار والإتاحة والخصوصية");

const overrideIds = Object.keys(governance.overrides);
check(overrideIds.every((id) => ids.includes(Number(id))), "كل override يعود إلى أداة موجودة");
check(Object.values(governance.overrides).every((entry) => entry.decision && governance.allowedDecisions.includes(entry.decision)), "كل override يحمل قراراً من الحالات المسموحة");
check(governance.allowedProductStatuses.includes(governance.defaultState.productStatus) && Object.values(governance.overrides).every((entry) => !entry.productStatus || governance.allowedProductStatuses.includes(entry.productStatus)), "حالات المنتج محصورة في نموذج أولي أو تنفيذ حي مرشح أو تنفيذ مثبت");
check(Object.entries(governance.overrides).every(([id, entry]) => !entry.relatedIds || (Array.isArray(entry.relatedIds) && new Set(entry.relatedIds).size === entry.relatedIds.length && entry.relatedIds.every((relatedId) => relatedId !== Number(id) && ids.includes(relatedId)))), "كل الإحالات المفاهيمية فريدة وتعود إلى سجلات أخرى موجودة");
const sourceFilesUnder = (directory: string): string[] => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const path = resolve(directory, entry.name);
  if (entry.isDirectory()) return sourceFilesUnder(path);
  return /\.(?:ts|tsx|mjs)$/.test(entry.name) && !/[/\\]lib[/\\]tool-\d+\.ts$/.test(path) ? [path] : [];
});
const runtimeCatalogImports = ["app", "components", "lib"].flatMap((directory) => sourceFilesUnder(resolve(ROOT, directory))).flatMap((path) => {
  const found: Array<{ path: string; id: number }> = [];
  for (const match of readFileSync(path, "utf8").matchAll(/from\s+["'][^"']*tool-(\d+)["']/g)) found.push({ path, id: Number(match[1]) });
  return found;
});
check(runtimeCatalogImports.every(({ id }) => governance.overrides[String(id)]?.productStatus === "wired-and-tested"), `لا يستورد مسار التشغيل نموذج كتالوج قبل إثبات دورة الإنتاج (${runtimeCatalogImports.length} استيراد معتمد)`);
const generic = tools.filter((tool) => new RegExp(`tool${tool.id}Gain`).test(tool.code ?? "") && new RegExp(`tool${tool.id}Check`).test(tool.code ?? "")).length;
const citationLabels = tools.filter((tool) => Boolean(tool.research?.trim())).length;
const titleGroups = new Map<string, number[]>();
for (const tool of tools) {
  const key = tool.titleDe.trim().toLocaleLowerCase("de");
  titleGroups.set(key, [...(titleGroups.get(key) ?? []), tool.id]);
}
const duplicateGroups = [...titleGroups.entries()].filter(([, groupedIds]) => groupedIds.length > 1);
check(summary.total === tools.length && summary.firstId === Math.min(...ids) && summary.lastId === Math.max(...ids), "الملخص المولد يطابق النطاق الفعلي");
const snapshotMarker = `<!-- tool-catalog-snapshot reviewed=${summary.reviewedDecisions} pending=${summary.pendingTriage} defer=${summary.decisionBreakdown.defer ?? 0} research=${summary.decisionBreakdown["research-only"] ?? 0} reject=${summary.decisionBreakdown["reject-not-applicable"] ?? 0} merge=${summary.decisionBreakdown["merge-duplicate"] ?? 0} related=${summary.relatedCatalogReferences} candidate=${summary.candidateLiveImplementations} tested=${summary.automatedTested} -->`;
const governedDocs = ["README.md", "docs/TOOL_CATALOG_GOVERNANCE.md"];
check(governedDocs.every((path) => readFileSync(resolve(ROOT, path), "utf8").includes(snapshotMarker)), "وثيقتا الكتالوج الحيّتان تطابقان لقطة الملخص المولد");
check(reviewMatrix.schemaVersion === 1 && reviewMatrix.items.length === tools.length && reviewMatrix.items.every((item, index) => item.id === tools[index].id && item.titleDe === tools[index].titleDe && item.status.productStatus), "مصفوفة المراجعة تفهرس كل فكرة وحالتها بنداً بنداً");
check(reviewMatrix.items.every((item) => JSON.stringify(item.status) === JSON.stringify({ ...governance.defaultState, ...(governance.overrides[String(item.id)] ?? {}) })), "الحالة المولدة لكل بند تطابق الافتراض وقرار المراجعة المسجل");
const reviewedOverrides = Object.entries(governance.overrides).filter(([, entry]) => entry.decision && entry.decision !== "pending-academic-review");
check(reviewedOverrides.every(([, entry]) => Boolean(entry.classification && entry.reviewerRole && entry.reviewedAt && /^\d{4}-\d{2}-\d{2}$/.test(entry.reviewedAt) && entry.risk && ["low", "medium", "high"].includes(entry.risk) && entry.rationaleAr && entry.rationaleAr.length > 40 && Array.isArray(entry.candidateEvidence) && entry.candidateEvidence.every((path) => existsSync(resolve(ROOT, path))))), "كل قرار فرز يحمل تصنيفاً ومبرراً ودور مراجع وتاريخاً ومخاطرة؛ ومسارات الأدلة المرشحة صالحة إن وجدت");
check(Object.values(governance.overrides).every((entry) => ["citation-label-unverified", "verified"].includes(entry.researchStatus ?? governance.defaultState.researchStatus) && ["not-demonstrated", "verified"].includes(entry.automatedTestStatus ?? governance.defaultState.automatedTestStatus) && ["not-tested", "verified-or-not-required"].includes(entry.fieldValidationStatus ?? governance.defaultState.fieldValidationStatus)), "حالات المصدر والاختبار والميدان محصورة في انتقالات دورة الأدلة المعلنة");
const productionEvidence = new Map<number, ProductionEvidence>();
for (const [id, entry] of Object.entries(governance.overrides)) {
  if (!entry.productionEvidence) continue;
  const evidencePath = resolve(ROOT, entry.productionEvidence);
  if (!existsSync(evidencePath)) continue;
  try {
    productionEvidence.set(Number(id), JSON.parse(readFileSync(evidencePath, "utf8")) as ProductionEvidence);
  } catch {
    // The check below reports malformed or missing evidence without claiming acceptance.
  }
}
check(Object.entries(governance.overrides).every(([id, entry]) => !entry.productionEvidence || (entry.productionEvidence.startsWith("evidence/tool-catalog/") && productionEvidence.get(Number(id))?.schemaVersion === 1 && productionEvidence.get(Number(id))?.toolId === Number(id))), "كل دورة إثبات مسجلة في ملف صالح ومقيدة بمعرف بندها");
check(Object.entries(governance.overrides).every(([id, entry]) => {
  if (!entry.productionEvidence) return true;
  const evidence = productionEvidence.get(Number(id));
  return Boolean(evidence && evidence.cycleId && evidence.claimScopeAr.length > 80 && evidence.learningDesign.targetLearnerAr.length > 20 && evidence.learningDesign.learnerVisibleActivities.length > 0 && evidence.learningDesign.measurableOutcomeAr.length > 40 && evidence.learningDesign.runtimeEvidence.every((path) => existsSync(resolve(ROOT, path))) && ["pending", "verified"].includes(evidence.sourceReview.status) && ["pending", "verified-or-not-required"].includes(evidence.fieldValidation.status) && evidence.accessibilityPrivacyReview.status && evidence.accessibilityPrivacyReview.accessibilityEvidence.length > 0 && evidence.accessibilityPrivacyReview.privacyEvidence.length > 0 && evidence.accessibilityPrivacyReview.limitationsAr.length > 40 && evidence.releaseDecision.productStatus === entry.productStatus && evidence.releaseDecision.decision === entry.decision && evidence.releaseDecision.reasonAr.length > 40);
}), "ملفات الإثبات تحدد الادعاء والمتعلم والنشاط والقياس والإتاحة والخصوصية والحدود وقرار الإصدار");
const automatedVerified = Object.entries(governance.overrides).filter(([, entry]) => entry.automatedTestStatus === "verified");
check(automatedVerified.every(([id, entry]) => {
  const evidence = productionEvidence.get(Number(id));
  return Boolean(entry.productionEvidence && evidence?.automatedTests.status === "verified" && evidence.automatedTests.commands.includes("npm run smoke") && evidence.automatedTests.commands.includes("npm run interaktiv") && evidence.automatedTests.testCases.length >= 3 && evidence.automatedTests.testCases.every((testCase) => existsSync(resolve(ROOT, testCase.file)) && readFileSync(resolve(ROOT, testCase.file), "utf8").includes(testCase.id) && testCase.coversAr.length > 20) && evidence.learningDesign.runtimeEvidence.every((path) => existsSync(resolve(ROOT, path))));
}), `الاختبار المثبت مدعوم بحالات سلوكية موجبة وسالبة وحدّية قابلة لإعادة التشغيل (${automatedVerified.length})`);
const wiredAndTested = Object.entries(governance.overrides).filter(([, entry]) => entry.productStatus === "wired-and-tested");
check(wiredAndTested.every(([id, entry]) => {
  const evidence = productionEvidence.get(Number(id));
  return entry.decision === "adopt" && entry.researchStatus === "verified" && entry.automatedTestStatus === "verified" && entry.fieldValidationStatus === "verified-or-not-required" && evidence?.lifecycleStatus === "accepted" && evidence.sourceReview.status === "verified" && evidence.fieldValidation.status === "verified-or-not-required" && evidence.releaseDecision.productStatus === "wired-and-tested" && evidence.releaseDecision.decision === "adopt";
}), `لا يبلغ wired-and-tested إلا بند أغلق المصدر والاختبار والميدان وقرار الإصدار (${wiredAndTested.length})`);
check(summary.genericPrototypeModules === generic && generic === 720, `النماذج العامة غير الموصولة معلنة بدقة (${generic})`);
check(summary.citationLabels === citationLabels && citationLabels === 811, `تسميات المراجع الأولية معدودة دون تسميتها مراجع موثقة (${citationLabels})`);
check(summary.exactDuplicateTitleGroups.length === duplicateGroups.length, `مجموعات العناوين المتطابقة مكشوفة (${duplicateGroups.length})`);
check(summary.resolvedExactDuplicateGroups === duplicateGroups.length && duplicateGroups.every(([, groupedIds]) => groupedIds.slice(1).every((id) => governance.overrides[String(id)]?.decision === "merge-duplicate" && governance.overrides[String(id)]?.canonicalId === groupedIds[0])), `كل التكرارات الحرفية الثمانية مرتبطة بسجل مرجعي واحد (${summary.resolvedExactDuplicateGroups}/${duplicateGroups.length})`);
const expectedDecisionBreakdown = tools.reduce<Record<string, number>>((counts, tool) => {
  const decision = governance.overrides[String(tool.id)]?.decision ?? governance.defaultState.decision;
  counts[decision] = (counts[decision] ?? 0) + 1;
  return counts;
}, {});
check(summary.reviewedDecisions === reviewedOverrides.length && JSON.stringify(summary.decisionBreakdown) === JSON.stringify(expectedDecisionBreakdown) && summary.pendingTriage === (expectedDecisionBreakdown["pending-academic-review"] ?? 0), `قرارات المراجعة محسوبة من السجل البندي (${summary.reviewedDecisions} فرز، ${summary.pendingTriage} معلق)`);
check(reviewedOverrides.length === tools.length && summary.pendingTriage === 0 && overrideIds.length === tools.length, "إغلاق الفرز محفوظ: 820/820 قراراً بندياً ولا سجل معلق");
const relatedCatalogReferences = Object.values(governance.overrides).reduce((count, entry) => count + (entry.relatedIds?.length ?? 0), 0);
check(summary.relatedCatalogReferences === relatedCatalogReferences, `الإحالات المفاهيمية محسوبة دون تسميتها دمجاً (${relatedCatalogReferences})`);
const candidateLiveImplementations = Object.values(governance.overrides).filter((entry) => entry.productStatus === "candidate-live-implementation").length;
check(summary.candidateLiveImplementations === candidateLiveImplementations, `التنفيذات الحية المرشحة مفصولة عن الجاهزية الإنتاجية (${candidateLiveImplementations})`);
check(summary.automatedTested === automatedVerified.length, `الإثباتات الآلية محسوبة من السجل البندي دون تضخيمها إلى جاهزية (${automatedVerified.length})`);
const adopted = Object.values(governance.overrides).filter((entry) => entry.decision === "adopt").length;
const fieldValidated = Object.values(governance.overrides).filter((entry) => entry.fieldValidationStatus === "verified-or-not-required").length;
check(summary.productIntegrated === wiredAndTested.length && summary.fieldValidated === fieldValidated && summary.adopted === adopted, `الاعتماد والتوصيل والميدان محسوبة من الأدلة الفعلية (${adopted}/${wiredAndTested.length}/${fieldValidated})`);

const pending = tools.filter((tool) => {
  const override = governance.overrides[String(tool.id)] ?? {};
  return (override.decision ?? governance.defaultState.decision) === "pending-academic-review" ||
    (override.researchStatus ?? governance.defaultState.researchStatus) !== "verified" ||
    (override.productStatus ?? governance.defaultState.productStatus) !== "wired-and-tested" ||
    (override.fieldValidationStatus ?? governance.defaultState.fieldValidationStatus) !== "verified-or-not-required";
}).length;
console.log(`\nCATALOG STRUCTURE: ${failures.length ? "FAIL" : "PASS"} — ${passed} checks passed, ${failures.length} failed.`);
console.log(`PRODUCTION READINESS: ${tools.length - pending}/${tools.length} entries satisfy the full evidence lifecycle; ${pending} pending.`);
if (failures.length) process.exit(1);
if (strict && pending > 0) process.exit(2);
