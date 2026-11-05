#!/usr/bin/env node
/** Build the internal grammar evidence matrix from content/grammar.json.
 * The generated matrix is deliberately not an official GGP claim.
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const grammarPath = join(ROOT, "content", "grammar.json");
const governancePath = join(ROOT, "content", "grammar-profile-governance.json");
const outputPath = join(ROOT, "content", "grammar-profile-matrix.json");
const grammarRaw = readFileSync(grammarPath);
const grammar = JSON.parse(grammarRaw.toString("utf8"));
const governance = JSON.parse(readFileSync(governancePath, "utf8"));

if (!grammar || Array.isArray(grammar) || typeof grammar !== "object") throw new Error("content/grammar.json must be an object map");
if (governance.claimStatus !== "internal-evidence-map-not-official-ggp") throw new Error("Grammar profile claim boundary missing");

const topics = Object.values(grammar).map((topic) => {
  const verifyIds = (topic.verify ?? []).map((item) => item.id);
  const exerciseIds = (topic.exercises ?? []).map((item) => item.id);
  return {
    id: topic.id,
    level: topic.level,
    titleDe: topic.titleDe,
    titleAr: topic.titleAr,
    goalAr: topic.ziel,
    prerequisiteTopicIds: topic.voraus ?? [],
    evidence: {
      scope: "topic-level-not-direct-feature-mapping",
      verifyIds,
      exerciseIds,
      canDoIds: topic.anwendung?.candoIds ?? [],
      applicationDe: topic.anwendung?.de ?? null,
      applicationAr: topic.anwendung?.ar ?? null,
      rules: (topic.rules ?? []).length,
      examples: (topic.examples ?? []).length,
      pitfalls: (topic.pitfalls ?? []).length,
    },
    review: {
      linguisticGerman: "pending-human-review",
      linguisticArabic: "pending-human-review",
      prerequisiteSequence: "pending-human-review",
      directAssessmentMapping: "pending-item-level-map",
    },
  };
});

const features = [];
for (const topic of Object.values(grammar)) {
  for (const [index, rule] of (topic.rules ?? []).entries()) {
    features.push({
      id: `IGGP-${topic.id}-R${String(index + 1).padStart(2, "0")}`,
      topicId: topic.id,
      ruleIndex: index + 1,
      level: topic.level,
      descriptorDe: rule.de,
      descriptorAr: rule.ar,
      sourceRefs: [],
      status: {
        definition: "derived-from-current-curriculum",
        externalSourceMapping: "pending",
        cefrLevelAssignment: "pending-external-review",
        linguisticReview: "pending-human-review",
        directAssessmentEvidence: "pending-item-level-map",
      },
    });
  }
}

const byLevel = {};
for (const feature of features) byLevel[feature.level] = (byLevel[feature.level] ?? 0) + 1;
const total = (field) => topics.reduce((sum, topic) => sum + topic.evidence[field], 0);
const matrix = {
  schemaVersion: 1,
  generatedFrom: "content/grammar.json",
  sourceSha256: createHash("sha256").update(grammarRaw).digest("hex"),
  updated: governance.updated,
  profileId: governance.profileId,
  claimStatus: governance.claimStatus,
  claimAr: governance.claimAr,
  summary: {
    topics: topics.length,
    candidateFeatures: features.length,
    rules: total("rules"),
    examples: total("examples"),
    pitfalls: total("pitfalls"),
    verifyItems: topics.reduce((sum, topic) => sum + topic.evidence.verifyIds.length, 0),
    exerciseItems: topics.reduce((sum, topic) => sum + topic.evidence.exerciseIds.length, 0),
    topicsWithCanDo: topics.filter((topic) => topic.evidence.canDoIds.length > 0).length,
    topicsWithoutCanDo: topics.filter((topic) => topic.evidence.canDoIds.length === 0).map((topic) => topic.id),
    sourceVerifiedFeatures: features.filter((item) => item.status.externalSourceMapping === "verified").length,
    directlyAssessedFeatures: features.filter((item) => item.status.directAssessmentEvidence === "verified").length,
    humanReviewedFeatures: features.filter((item) => item.status.linguisticReview === "verified").length,
    byLevel,
  },
  externalSources: governance.externalSources,
  topics,
  features,
};

writeFileSync(outputPath, `${JSON.stringify(matrix, null, 2)}\n`, "utf8");
console.log(`gen:ggp ${topics.length} topics → ${features.length} candidate grammar features (${matrix.sourceSha256.slice(0, 12)})`);
