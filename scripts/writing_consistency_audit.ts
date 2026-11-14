import fs from "node:fs";
import path from "node:path";

type WritingTask = {
  id: string;
  level?: string;
  taskDe: string;
  taskAr?: string;
  criteria: string[];
  sample: string;
  noteAr: string[];
  zielWort?: number;
  [key: string]: unknown;
};

type WritingReviewEntry = {
  id: string;
  level: string;
  decision: "corrected" | "confirmed-current";
  previous: WritingTask;
  current: WritingTask;
};

type WritingReviewFixture = {
  schema: string;
  batch: string;
  scope: string;
  entries: WritingReviewEntry[];
};

const tasks = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "content", "writing.json"), "utf8"),
) as WritingTask[];
const review02 = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "scripts", "fixtures", "writing-reviewed-02.json"), "utf8"),
) as WritingReviewFixture;
const byId = new Map(tasks.map((task) => [task.id, task]));
const errors: string[] = [];
const wordRiskIds = new Set([
  "w-b2-07", "w-b2-11", "w-a2-12", "w-a2-17", "w-b1-23",
  "w-b1-24", "w-b1-25", "w-b2-24", "w-b2-26", "w-b2-28",
]);
const sentenceRiskIds = new Set([
  "w-a1-01", "w-a1-06", "w-a2-06", "w-a1-08", "w-a0-06",
]);
const words = (text: string): number =>
  text.match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu)?.length ?? 0;

for (const task of tasks) {
  const visibleWordTarget = task.taskDe.match(/ca\.\s*(\d+)\s*Wörter/);
  if (visibleWordTarget) {
    const expected = Number(visibleWordTarget[1]);
    if (task.zielWort !== expected) {
      errors.push(
        `${task.id}: taskDe asks ca. ${expected} words but zielWort=${task.zielWort ?? "missing"}`,
      );
    }
  }

  if (wordRiskIds.has(task.id)) {
    if (!task.zielWort) {
      errors.push(`${task.id}: missing zielWort for reviewed sample-length risk`);
    } else {
      const ratio = words(task.sample) / task.zielWort;
      if (ratio < 0.8 || ratio > 1.2) {
        errors.push(
          `${task.id}: reviewed sample has ${words(task.sample)} words for target ${task.zielWort} (${(ratio * 100).toFixed(1)}%)`,
        );
      }
    }
  }
}

const count = (text: string, fragment: string): number =>
  text.split(fragment).length - 1;
const sentenceMarks = (text: string): number =>
  text.match(/[.!?](?=\s|$)/g)?.length ?? 0;
const sentenceRange = (taskDe: string): [number, number] | null => {
  const range = taskDe.match(/(\d+)[–-](\d+)\s+Sätze/);
  if (range) return [Number(range[1]), Number(range[2])];
  const exact = taskDe.match(/(\d+)\s+Sätze/);
  return exact ? [Number(exact[1]), Number(exact[1])] : null;
};
for (const id of sentenceRiskIds) {
  const task = byId.get(id);
  if (!task) {
    errors.push(`missing reviewed sentence-count task ${id}`);
    continue;
  }
  const range = sentenceRange(task.taskDe);
  const actual = sentenceMarks(task.sample);
  if (!range || actual < range[0] || actual > range[1]) {
    errors.push(
      `${id}: reviewed sample has ${actual} sentence marks; expected ${range?.join("–") ?? "an explicit range"}`,
    );
  }
}
const requireTask = (id: string): WritingTask => {
  const task = byId.get(id);
  if (!task) throw new Error(`missing writing task ${id}`);
  return task;
};

const a102 = requireTask("w-a1-02");
if (a102.criteria.some((criterion) => criterion.includes("الأرقام مكتوبة بالألمانية"))) {
  errors.push("w-a1-02: obsolete criterion contradicts the form sample's numeric notation");
}

const a104 = requireTask("w-a1-04");
for (const form of ["stehe um halb sieben auf", "ziehe ich mich schnell an", "kaufe ich im Supermarkt ein"]) {
  if (!a104.sample.includes(form)) {
    errors.push(`w-a1-04: reviewed separable-verb model is missing «${form}»`);
  }
}

const a105 = requireTask("w-a1-05");
if (!a105.sample.includes("Möchtest du")) {
  errors.push("w-a1-05: note requires an explicit Möchtest du invitation, but sample lacks it");
}
if (sentenceMarks(a105.sample) !== 4) {
  errors.push(`w-a1-05: reviewed four-sentence sample has ${sentenceMarks(a105.sample)} sentence marks`);
}

const a201 = requireTask("w-a2-01");
if (sentenceMarks(a201.sample) !== 6) {
  errors.push(`w-a2-01: reviewed sample must have 6 sentences, got ${sentenceMarks(a201.sample)}`);
}
const a201Perfekt =
  count(a201.sample, " bin ") +
  (a201.sample.startsWith("Bin ") ? 1 : 0) +
  count(a201.sample, " habe ");
if (a201Perfekt !== 5) {
  errors.push(`w-a2-01: reviewed model must expose 5 Perfekt auxiliaries, got ${a201Perfekt}`);
}

const a202 = requireTask("w-a2-02");
if (sentenceMarks(a202.sample) !== 6) {
  errors.push(`w-a2-02: reviewed sample must have 6 sentences, got ${sentenceMarks(a202.sample)}`);
}
if (count(a202.sample, "weil") !== 2 || count(a202.sample, "dass") !== 1) {
  errors.push(
    `w-a2-02: expected 2× weil and 1× dass; got ${count(a202.sample, "weil")}× weil and ${count(a202.sample, "dass")}× dass`,
  );
}

const review02Ids = new Set(review02.entries.map((entry) => entry.id));
const review02Corrected = review02.entries.filter((entry) => entry.decision === "corrected");
const review02Confirmed = review02.entries.filter((entry) => entry.decision === "confirmed-current");
const review02Levels = review02.entries.reduce<Record<string, number>>((counts, entry) => {
  counts[entry.level] = (counts[entry.level] ?? 0) + 1;
  return counts;
}, {});
if (review02.schema !== "wegb2-reviewed-writing-decision-batch-v1"
  || review02.batch !== "PA-035-02"
  || review02.entries.length !== 25
  || review02Ids.size !== 25
  || review02Corrected.length !== 17
  || review02Confirmed.length !== 8
  || JSON.stringify(review02Levels) !== JSON.stringify({ A0: 6, A1: 19 })) {
  errors.push(
    `unexpected PA-035-02 fixture scope/counts: ${review02.schema}/${review02.batch}/${review02.entries.length}/${review02Ids.size}/${review02Corrected.length}/${review02Confirmed.length}/${JSON.stringify(review02Levels)}`,
  );
}
if (!review02.scope.includes("triage only")
  || !review02.scope.includes("not correction generators")
  || !review02.scope.includes("not independent linguistic, exam, or CEFR sign-off")) {
  errors.push("PA-035-02 fixture must preserve its triage and external-sign-off claim boundary");
}
for (const entry of review02.entries) {
  const actual = byId.get(entry.id);
  if (!actual) {
    errors.push(`missing PA-035-02 writing task ${entry.id}`);
    continue;
  }
  if (actual.level !== entry.level
    || entry.previous.id !== entry.id
    || entry.current.id !== entry.id
    || entry.previous.level !== entry.level
    || entry.current.level !== entry.level
    || JSON.stringify(actual) !== JSON.stringify(entry.current)) {
    errors.push(`${entry.id}: PA-035-02 identity or reviewed task content drifted`);
  }
  if (entry.decision === "corrected" && JSON.stringify(entry.previous) === JSON.stringify(entry.current)) {
    errors.push(`${entry.id}: corrected PA-035-02 decision has no change`);
  }
  if (entry.decision === "confirmed-current" && JSON.stringify(entry.previous) !== JSON.stringify(entry.current)) {
    errors.push(`${entry.id}: confirmed-current PA-035-02 decision changes the task`);
  }
  const target = entry.current.zielWort;
  if (!target) {
    errors.push(`${entry.id}: PA-035-02 task has no internal word target`);
  } else {
    const ratio = words(entry.current.sample) / target;
    if (ratio < 0.8 || ratio > 1.2) {
      errors.push(
        `${entry.id}: PA-035-02 sample has ${words(entry.current.sample)} words for target ${target} (${(ratio * 100).toFixed(1)}%)`,
      );
    }
  }
  const range = sentenceRange(entry.current.taskDe);
  if (range) {
    const actualMarks = sentenceMarks(entry.current.sample);
    if (actualMarks < range[0] || actualMarks > range[1]) {
      errors.push(`${entry.id}: PA-035-02 sample has ${actualMarks} sentence marks; expected ${range.join("–")}`);
    }
  }
}
if (sentenceMarks(requireTask("w-a0-02").sample) !== 3) {
  errors.push("w-a0-02: reviewed model must remain exactly three simple sentences");
}
if (requireTask("w-a0-01").zielWort !== 60
  || requireTask("w-a0-04").zielWort !== 40
  || requireTask("w-a0-05").zielWort !== 40
  || requireTask("w-a1-12").zielWort !== 50
  || !requireTask("w-a1-03").taskAr?.toString().includes("أدوات الملكية")
  || !requireTask("w-a1-10").sample.includes("Geburtsdatum: 12.03.1998")
  || requireTask("w-a1-10").sample.includes("sechsundzwanzig Jahre alt")) {
  errors.push("PA-035-02 guarded target, Arabic-alignment, or form-date corrections regressed");
}
const review02CurrentText = JSON.stringify(review02.entries.map((entry) => entry.current));
for (const stale of ["الألفية الثانية", "كما تُلْمَز", "قارةٌ لا تُساوَم", "يُفحصان في الامتحان"]) {
  if (review02CurrentText.includes(stale)) {
    errors.push(`PA-035-02 stale or unsupported note text returned: ${stale}`);
  }
}

if (errors.length) {
  console.error("❌ Writing consistency audit failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  "✅ Writing consistency: 42 registered PA-035 findings remain fixed; all 25 bounded A0/A1 full-card decisions match (17 corrected, 8 confirmed-current).",
);
console.log(
  "ℹ️ This gate checks the reviewed target, sample-length, sentence-count, task/Arabic/criterion/model/note, and identity decisions; it does not certify the remaining 80 writing cards or provide independent linguistic, exam, or CEFR sign-off.",
);
