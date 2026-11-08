#!/usr/bin/env tsx
/** Structural and evidence audit for the internal grammar coverage profile. */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

type Rule = { de: string; ar: string };
type Topic = {
  id: string; level: string; titleDe: string; titleAr: string; ziel: string;
  voraus?: string[]; rules?: Rule[]; examples?: unknown[]; pitfalls?: unknown[];
  verify?: Array<{ id: string }>; exercises?: Array<{ id: string }>;
  anwendung?: { de?: string; ar?: string; candoIds?: string[] };
};
type MatrixTopic = {
  id: string; level: string; prerequisiteTopicIds: string[];
  evidence: { scope: string; verifyIds: string[]; exerciseIds: string[]; canDoIds: string[]; rules: number; examples: number; pitfalls: number };
};
type MatrixFeature = {
  id: string; topicId: string; ruleIndex: number; level: string; descriptorDe: string; descriptorAr: string; sourceRefs: string[];
  status: { definition: string; externalSourceMapping: string; cefrLevelAssignment: string; linguisticReview: string; directAssessmentEvidence: string };
};
type Matrix = {
  schemaVersion: number; generatedFrom: string; sourceSha256: string; claimStatus: string; claimAr: string;
  summary: { topics: number; candidateFeatures: number; rules: number; examples: number; pitfalls: number; verifyItems: number; exerciseItems: number; topicsWithCanDo: number; topicsWithoutCanDo: string[]; sourceVerifiedFeatures: number; directlyAssessedFeatures: number; humanReviewedFeatures: number };
  externalSources: Array<{ id: string; status: string; snapshot: string | null; sha256: string | null; reviewedBy: string | null; reviewedAt: string | null }>;
  topics: MatrixTopic[]; features: MatrixFeature[];
};

const ROOT = process.cwd();
const strict = process.argv.includes("--strict-external");
const raw = readFileSync(resolve(ROOT, "content/grammar.json"));
const grammar = JSON.parse(raw.toString("utf8")) as Record<string, Topic>;
const matrix = JSON.parse(readFileSync(resolve(ROOT, "content/grammar-profile-matrix.json"), "utf8")) as Matrix;
let passed = 0;
const failed: string[] = [];
const check = (condition: unknown, label: string) => condition ? (passed++, console.log(`✓ ${label}`)) : (failed.push(label), console.error(`✗ ${label}`));

console.log("=== INTERNAL GERMAN GRAMMAR PROFILE AUDIT ===\n");
const topics = Object.values(grammar);
const expectedFeatures = topics.flatMap((topic) => (topic.rules ?? []).map((rule, index) => ({ topic, rule, index: index + 1 })));
const expectedHash = createHash("sha256").update(raw).digest("hex");
check(matrix.schemaVersion === 1 && matrix.generatedFrom === "content/grammar.json", "المصفوفة مولدة من مصدر القواعد المعلن");
check(matrix.sourceSha256 === expectedHash, "بصمة مصدر القواعد تطابق المصفوفة ولا توجد نسخة قديمة");
check(matrix.claimStatus === "internal-evidence-map-not-official-ggp" && /لا تدعي مطابقة/.test(matrix.claimAr), "حد الادعاء يمنع تسمية المصفوفة GGP رسمية");
check(matrix.topics.length === topics.length && matrix.summary.topics === topics.length, `كل موضوعات القواعد ممثلة (${topics.length})`);
check(matrix.features.length === expectedFeatures.length && matrix.summary.candidateFeatures === expectedFeatures.length, `كل عبارات rules ممثلة كسمات مرشحة (${expectedFeatures.length})`);
check(new Set(matrix.topics.map((item) => item.id)).size === matrix.topics.length && new Set(matrix.features.map((item) => item.id)).size === matrix.features.length, "معرفات الموضوعات والسمات فريدة");

const matrixTopics = new Map(matrix.topics.map((item) => [item.id, item]));
check(topics.every((topic) => matrixTopics.get(topic.id)?.level === topic.level), "كل مستوى وموضوع يعودان إلى سجل المصدر الصحيح");
check(topics.every((topic) => matrixTopics.get(topic.id)?.evidence.scope === "topic-level-not-direct-feature-mapping"), "كل الأدلة مصنفة على مستوى الموضوع دون تضخيم إلى مستوى السمة");
check(topics.every((topic) => {
  const item = matrixTopics.get(topic.id);
  return JSON.stringify(item?.evidence.verifyIds) === JSON.stringify((topic.verify ?? []).map((entry) => entry.id)) &&
    JSON.stringify(item?.evidence.exerciseIds) === JSON.stringify((topic.exercises ?? []).map((entry) => entry.id));
}), "مراجع التحقق والتمارين في كل الموضوعات تطابق المصدر");
check(topics.every((topic) => (topic.verify?.length ?? 0) > 0 && (topic.exercises?.length ?? 0) > 0 && topic.ziel.trim().length > 10), "كل موضوع يحمل هدفاً داخلياً وتحققاً وتمارين");
const topicsWithoutCanDo = topics.filter((topic) => !(topic.anwendung?.candoIds?.length)).map((topic) => topic.id);
check(matrix.summary.topicsWithCanDo === topics.length - topicsWithoutCanDo.length && JSON.stringify(matrix.summary.topicsWithoutCanDo) === JSON.stringify(topicsWithoutCanDo), `فجوة Can-Do الخارجية معلنة بدقة (${topicsWithoutCanDo.length} موضوعاً)`);

const featureMap = new Map(matrix.features.map((item) => [item.id, item]));
check(expectedFeatures.every(({ topic, rule, index }) => {
  const id = `IGGP-${topic.id}-R${String(index).padStart(2, "0")}`;
  const feature = featureMap.get(id);
  return Boolean(feature) && feature?.topicId === topic.id && feature.ruleIndex === index && feature.level === topic.level && feature.descriptorDe === rule.de && feature.descriptorAr === rule.ar;
}), "كل السمات المرشحة تطابق الوصف والمستوى والمرجع الداخلي");
check(matrix.features.every((feature) => feature.sourceRefs.length === 0 && feature.status.externalSourceMapping === "pending" && feature.status.directAssessmentEvidence === "pending-item-level-map"), "لا مصدر خارجي أو قياس مباشر مزور في أي سمة");

const sourceVerified = matrix.externalSources.filter((source) => source.status === "verified" && source.snapshot && source.sha256 && source.reviewedBy && source.reviewedAt).length;
const pendingFeatures = matrix.features.filter((feature) => feature.status.externalSourceMapping !== "verified" || feature.status.linguisticReview !== "verified" || feature.status.directAssessmentEvidence !== "verified").length;
check(matrix.summary.rules === expectedFeatures.length && matrix.summary.sourceVerifiedFeatures === 0 && matrix.summary.directlyAssessedFeatures === 0 && matrix.summary.humanReviewedFeatures === 0, "الملخص يفرق بين الاستخراج الداخلي والتحقق الأكاديمي الخارجي");

console.log(`\nTECHNICAL PROFILE: ${failed.length ? "FAIL" : "PASS"} — ${passed} checks passed, ${failed.length} failed.`);
console.log(`ACADEMIC READINESS: ${sourceVerified}/${matrix.externalSources.length} sources verified; ${matrix.features.length - pendingFeatures}/${matrix.features.length} features fully reviewed.`);
if (failed.length) process.exit(1);
if (strict && (sourceVerified !== matrix.externalSources.length || pendingFeatures > 0)) process.exit(2);
