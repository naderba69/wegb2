import fs from "node:fs";
import path from "node:path";

type WritingTask = {
  id: string;
  taskDe: string;
  criteria: string[];
  sample: string;
  noteAr: string[];
  zielWort?: number;
};

const tasks = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "content", "writing.json"), "utf8"),
) as WritingTask[];
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

if (errors.length) {
  console.error("❌ Writing consistency audit failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  "✅ Writing consistency: visible ca.-word targets match zielWort; all 42 reviewed PA-035 findings remain fixed.",
);
console.log(
  "ℹ️ This gate checks the reviewed target, sample-length, sentence-count, and task/criterion/sample/note corrections; it does not certify all writing models or exam claims.",
);
