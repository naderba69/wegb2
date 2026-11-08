#!/usr/bin/env tsx
/** Evidence-receipt gate for the 2 sources + 10 requirements + 7 external gates. */
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

type Source = { id: string; targetId: string; officialUrl: string; status: string; artifactPath: string | null; retrievedAt: string | null; mediaType: string | null; sha256: string | null; licenseNote: string | null; reviewedBy: string | null; reviewedAt: string | null; signatureArtifact: string | null };
type RequirementReview = { id: string; sourceIds: string[]; status: string; verdict: string | null; sourceLocator: string | null; reviewedBy: string | null; reviewerQualification: string | null; reviewedAt: string | null; signatureArtifact: string | null };
type GateReview = { id: string; status: string; reviewedBy: string | null; reviewerQualification: string | null; reviewedAt: string | null; evidenceArtifacts: string[]; signatureArtifact: string | null };
type Dossier = { schemaVersion: number; claimAr: string; sourceArtifacts: Source[]; requirementReviews: RequirementReview[]; gateReviews: GateReview[] };
type Alignment = { targets: Array<{ id: string; sources: Array<{ id: string; url: string }>; requirements: Array<{ id: string }> }>; externalGates: Array<{ id: string }> };

const ROOT = process.cwd();
const strict = process.argv.includes("--strict-evidence");
const dossier = JSON.parse(readFileSync(resolve(ROOT, "content/external-evidence.json"), "utf8")) as Dossier;
const alignment = JSON.parse(readFileSync(resolve(ROOT, "content/accreditation-alignment.json"), "utf8")) as Alignment;
let passed = 0;
const failures: string[] = [];
const check = (condition: unknown, label: string) => condition ? (passed++, console.log(`✓ ${label}`)) : (failures.push(label), console.error(`✗ ${label}`));
const fileExists = (path: string | null) => Boolean(path && existsSync(resolve(ROOT, path)));
const hash = (path: string) => createHash("sha256").update(readFileSync(resolve(ROOT, path))).digest("hex");
const allUnique = (ids: string[]) => new Set(ids).size === ids.length;

console.log("=== EXTERNAL EVIDENCE DOSSIER AUDIT ===\n");
check(dossier.schemaVersion === 1 && dossier.claimAr.includes("لا سجل إنجاز"), "السجل يعرّف نفسه كاستقبال أدلة لا كادعاء إغلاق");
check(dossier.sourceArtifacts.length === 2 && dossier.requirementReviews.length === 10 && dossier.gateReviews.length === 7, "الملف يمثل 2 مصدر + 10 مراجعات + 7 حواجز = 19");
const allIds = [...dossier.sourceArtifacts, ...dossier.requirementReviews, ...dossier.gateReviews].map((item) => item.id);
check(allUnique(allIds), "معرفات وحدات الدليل التسع عشرة فريدة");
const alignmentSourceIds = alignment.targets.flatMap((target) => target.sources.map((source) => source.id)).sort();
const alignmentRequirementIds = alignment.targets.flatMap((target) => target.requirements.map((requirement) => requirement.id)).sort();
const alignmentGateIds = alignment.externalGates.map((gate) => gate.id).sort();
check(JSON.stringify(dossier.sourceArtifacts.map((item) => item.id).sort()) === JSON.stringify(alignmentSourceIds), "مصدرَا الدليل يطابقان سجل المواءمة");
check(JSON.stringify(dossier.requirementReviews.map((item) => item.id).sort()) === JSON.stringify(alignmentRequirementIds), "المراجعات العشر تطابق مطالب المواءمة");
check(JSON.stringify(dossier.gateReviews.map((item) => item.id).sort()) === JSON.stringify(alignmentGateIds), "الحواجز السبعة تطابق سجل المواءمة");

for (const source of dossier.sourceArtifacts) {
  const target = alignment.targets.find((item) => item.id === source.targetId);
  const registrySource = target?.sources.find((item) => item.id === source.id);
  check(registrySource?.url === source.officialUrl, `${source.id}: الرابط مطابق لمصدر الحقيقة`);
  if (source.status === "verified") {
    check(fileExists(source.artifactPath) && Boolean(source.retrievedAt && source.mediaType && source.sha256 && source.licenseNote && source.reviewedBy && source.reviewedAt && fileExists(source.signatureArtifact)), `${source.id}: كل بيانات الحفظ والتوقيع موجودة`);
    if (source.artifactPath && source.sha256 && fileExists(source.artifactPath)) check(hash(source.artifactPath) === source.sha256, `${source.id}: SHA-256 يطابق الملف المحفوظ`);
  } else {
    check(source.status === "pending-source-capture" && !source.artifactPath && !source.sha256 && !source.reviewedBy, `${source.id}: الحالة المعلقة صادقة بلا حقول إنجاز جزئية مضللة`);
  }
}
const sourceMap = new Map(dossier.sourceArtifacts.map((item) => [item.id, item]));
for (const review of dossier.requirementReviews) {
  check(review.sourceIds.length > 0 && review.sourceIds.every((id) => sourceMap.has(id)), `${review.id}: مراجع المصدر معروفة`);
  if (review.status === "verified") {
    check(review.sourceIds.every((id) => sourceMap.get(id)?.status === "verified") && Boolean(review.verdict && review.sourceLocator && review.reviewedBy && review.reviewerQualification && review.reviewedAt && fileExists(review.signatureArtifact)), `${review.id}: لا مراجعة مطلب بلا مصدر محفوظ ومحدد ومراجع موقع`);
  } else {
    check(review.status === "pending-independent-review" && !review.verdict && !review.reviewedBy, `${review.id}: المراجعة المعلقة لا تنتحل رأي خبير`);
  }
}
for (const gate of dossier.gateReviews) {
  if (gate.status === "passed") {
    check(Boolean(gate.reviewedBy && gate.reviewerQualification && gate.reviewedAt && gate.evidenceArtifacts.length && gate.evidenceArtifacts.every(fileExists) && fileExists(gate.signatureArtifact)), `${gate.id}: الحاجز المكتمل يحمل أدلة وتوقيعاً صالحين`);
  } else {
    check(gate.status === "pending-external" && gate.evidenceArtifacts.length === 0 && !gate.reviewedBy, `${gate.id}: الحاجز المعلق بلا نجاح مصطنع`);
  }
}
const pending = [...dossier.sourceArtifacts, ...dossier.requirementReviews, ...dossier.gateReviews].filter((item) => item.status !== "verified" && item.status !== "passed").length;
console.log(`\nDOSSIER STRUCTURE: ${failures.length ? "FAIL" : "PASS"} — ${passed} checks passed, ${failures.length} failed.`);
console.log(`EXTERNAL EVIDENCE: ${19 - pending}/19 signed units; ${pending} pending.`);
if (failures.length) process.exit(1);
if (strict && pending > 0) process.exit(2);
