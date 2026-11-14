import { readFileSync } from "node:fs";
import { exakteAntwortLecks } from "../lib/exercise-hints";
import { parentheticalMarkers, type ScaffoldExercise } from "../lib/scaffold-metrics";

type Bucket = "exercises" | "verify";
type ReviewItem = {
  id: string;
  level: "B1" | "B2";
  topicId: string;
  bucket: Bucket;
  type: string;
  markersBefore: string[];
  /** Optional post-migration markers when a cue was translated out of a wrongly German-labelled Arabic run. */
  markersAfter?: string[];
  promptDeBefore: string;
  promptDeAfter: string;
  textBefore: string | null;
  textAfter: string | null;
  answer: unknown;
  options: unknown;
  decision: "retain" | "remove-redundant";
  classification: string;
  rationaleAr: string;
};
type Review = {
  reviewRule: string;
  claimBoundary: {
    reviewKind: string;
    independentHumanReview: boolean;
    candidateIsConfirmedDefect: boolean;
    noteAr: string;
  };
  summary: {
    reviewed: number;
    retained: number;
    removedRedundant: number;
    byLevel: Record<string, number>;
    byClassification: Record<string, number>;
  };
  items: ReviewItem[];
};
type GrammarTopic = {
  level: string;
  exercises?: Array<ScaffoldExercise & { id?: string; type?: string; options?: unknown }>;
  verify?: Array<ScaffoldExercise & { id?: string; type?: string; options?: unknown }>;
};

const grammar = JSON.parse(readFileSync("content/grammar.json", "utf8")) as Record<string, GrammarTopic>;
const review = JSON.parse(readFileSync("content/scaffold-review-b1-b2.json", "utf8")) as Review;
const failures: string[] = [];
let checks = 0;

function check(condition: boolean, message: string): void {
  checks += 1;
  if (!condition) failures.push(message);
}
function same(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

const current = new Map<string, { topicId: string; level: string; bucket: Bucket; exercise: NonNullable<GrammarTopic[Bucket]>[number] }>();
for (const [topicId, topic] of Object.entries(grammar)) {
  for (const bucket of ["exercises", "verify"] as const) {
    for (const exercise of topic[bucket] ?? []) {
      if (!exercise.id) continue;
      if (current.has(exercise.id)) failures.push(`duplicate exercise id in grammar bank: ${exercise.id}`);
      current.set(exercise.id, { topicId, level: topic.level, bucket, exercise });
    }
  }
}

const reviewedIds = review.items.map((item) => item.id);
const retainedIds = new Set(review.items.filter((item) => item.decision === "retain").map((item) => item.id));
const currentCandidates = [...current.entries()]
  .filter(([, entry]) => (entry.level === "B1" || entry.level === "B2") && parentheticalMarkers(entry.exercise).length > 0)
  .map(([id]) => id)
  .sort();

check(review.reviewRule === "R161" && review.items.length === 97 && new Set(reviewedIds).size === 97,
  "R161 must contain 97 unique pre-edit B1/B2 decisions");
check(review.summary.reviewed === 97 && review.summary.retained === 94 && review.summary.removedRedundant === 3 &&
  review.summary.byLevel.B1 === 35 && review.summary.byLevel.B2 === 62,
  "review summary must preserve 35 B1 + 62 B2 decisions, with 94 retained and 3 removed");
check(review.claimBoundary.reviewKind === "internal-agent-editorial" && review.claimBoundary.independentHumanReview === false &&
  review.claimBoundary.candidateIsConfirmedDefect === false && review.claimBoundary.noteAr.includes("لا توقيع خبير تربوي مستقل"),
  "claim boundary must not impersonate an independent human or classify scanner candidates as defects");
check(same(currentCandidates, [...retainedIds].sort()),
  "every current B1/B2 parenthetical candidate must have one retained decision, with no stale retained item");

for (const item of review.items) {
  const entry = current.get(item.id);
  if (!entry) {
    failures.push(`${item.id}: reviewed exercise is missing`);
    continue;
  }
  const exercise = entry.exercise;
  if (entry.topicId !== item.topicId || entry.level !== item.level || entry.bucket !== item.bucket || exercise.type !== item.type) {
    failures.push(`${item.id}: topic/level/bucket/type drifted`);
  }
  if (exercise.promptDe !== item.promptDeAfter || (exercise.text ?? null) !== item.textAfter ||
      !same(exercise.answer, item.answer) || !same(exercise.options ?? null, item.options)) {
    failures.push(`${item.id}: guarded prompt, answer, options, or text drifted`);
  }
  const beforeMarkers = parentheticalMarkers({ promptDe: item.promptDeBefore, text: item.textBefore });
  if (!same(beforeMarkers, item.markersBefore)) failures.push(`${item.id}: before-marker evidence is inconsistent`);
  const afterMarkers = parentheticalMarkers(exercise);
  if (item.decision === "retain" && !same(afterMarkers, item.markersAfter ?? item.markersBefore)) {
    failures.push(`${item.id}: retained marker changed without a recorded post-migration decision`);
  }
  if (item.decision === "remove-redundant" && (afterMarkers.length !== 0 || item.classification !== "redundant-with-options")) {
    failures.push(`${item.id}: redundant marker was not removed cleanly`);
  }
  if (!item.rationaleAr || item.rationaleAr.length < 30) failures.push(`${item.id}: rationale is missing`);
}
check(failures.length === 0, "all 97 item contracts must remain valid");

const exactLeaks = [...current.values()].flatMap(({ exercise }) => exakteAntwortLecks(exercise));
check(exactLeaks.length === 0, `exact answer leaks returned: ${exactLeaks.join(", ")}`);

const patch = readFileSync("scripts/patches/review_scaffolds_r161.py", "utf8");
check(["b1-absicht-n6", "g16e2", "b2-n-dekl-v2"].every((id) => patch.includes(`\"${id}\"`)) &&
  patch.includes("answer/options guard failed") && patch.includes("already current"),
  "the three edits must remain explicit, guarded, and idempotent");

console.log("\nR161 B1/B2 parenthetical scaffold review");
console.log(`Reviewed: ${review.summary.reviewed} · retained: ${review.summary.retained} · redundant removed: ${review.summary.removedRedundant}`);
for (const [classification, count] of Object.entries(review.summary.byClassification)) {
  console.log(`  ${classification}: ${count}`);
}
console.log(`Scaffold review audit: ${checks - failures.length}/${checks} checks passed`);
if (failures.length > 0) {
  for (const failure of failures) console.error(`✗ ${failure}`);
  process.exit(1);
}
