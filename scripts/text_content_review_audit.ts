import fs from "node:fs";
import path from "node:path";

type TextQuestion = {
  id: string;
  type: string;
  promptDe: string;
  promptAr?: string;
  options?: string[];
  answer: string | string[];
  explanationAr?: string;
  [key: string]: unknown;
};

type ReadingText = {
  id: string;
  level: string;
  titleDe: string;
  titleAr: string;
  de: string;
  ar: string;
  questions: TextQuestion[];
  [key: string]: unknown;
};

type ReviewEntry = {
  id: string;
  level: string;
  decision: "corrected" | "confirmed-current";
  rationale: string;
  previous: ReadingText;
  current: ReadingText;
};

type ReviewFixture = {
  schema: string;
  batch: string;
  reviewedAt: string;
  scope: string;
  entries: ReviewEntry[];
};

const readJson = <T>(relativePath: string): T => JSON.parse(
  fs.readFileSync(path.join(process.cwd(), relativePath), "utf8"),
) as T;
const texts = readJson<ReadingText[]>("content/texts.json");
const review01 = readJson<ReviewFixture>("scripts/fixtures/texts-reviewed-01.json");
const byId = new Map(texts.map((text) => [text.id, text]));
const errors: string[] = [];
const expectedA0 = new Set([
  "t-a0-01", "t-a0-02", "t-a0-03", "t-a0-04", "t-a0-05",
  "t-a0-06", "t-a0-07", "t-a0-08", "t-a0-09", "t-a0-10",
  "t-a0-011", "t-a0-012", "t-a0-013", "t-a0-014", "t-a0-015",
]);

if (texts.length !== 157 || byId.size !== 157) {
  errors.push(`reading-text bank count or identity drifted: ${texts.length}/${byId.size} instead of 157/157`);
}
const a0Texts = texts.filter((text) => text.level === "A0");
if (a0Texts.length !== 15 || a0Texts.reduce((sum, text) => sum + text.questions.length, 0) !== 45) {
  errors.push("A0 reading scope drifted from 15 complete texts and 45 questions");
}

const ids = new Set(review01.entries.map((entry) => entry.id));
const corrected = review01.entries.filter((entry) => entry.decision === "corrected");
const confirmed = review01.entries.filter((entry) => entry.decision === "confirmed-current");
if (review01.schema !== "wegb2-reviewed-text-decision-batch-v1"
  || review01.batch !== "PA-037-01"
  || review01.reviewedAt !== "2026-11-04"
  || review01.entries.length !== 15
  || ids.size !== 15
  || [...expectedA0].some((id) => !ids.has(id))
  || corrected.length !== 12
  || confirmed.length !== 3
  || review01.entries.some((entry) => entry.level !== "A0" || !entry.rationale.trim())) {
  errors.push("PA-037-01: unexpected fixture scope, counts, levels, or decision metadata");
}
if (!review01.scope.includes("triage only")
  || !review01.scope.includes("not correction generators")
  || !review01.scope.includes("not independent linguistic, translation, CEFR, or exam sign-off")) {
  errors.push("PA-037-01: fixture must preserve triage and external-sign-off claim boundaries");
}

for (const entry of review01.entries) {
  const actual = byId.get(entry.id);
  if (!actual) {
    errors.push(`PA-037-01: missing reading text ${entry.id}`);
    continue;
  }
  if (actual.id !== entry.id
    || actual.level !== "A0"
    || entry.previous.id !== entry.id
    || entry.current.id !== entry.id
    || entry.previous.level !== "A0"
    || entry.current.level !== "A0"
    || JSON.stringify(actual) !== JSON.stringify(entry.current)) {
    errors.push(`${entry.id}: identity, level, or reviewed full-text content drifted`);
  }
  const changed = JSON.stringify(entry.previous) !== JSON.stringify(entry.current);
  if ((entry.decision === "corrected" && !changed)
    || (entry.decision === "confirmed-current" && changed)) {
    errors.push(`${entry.id}: decision does not match its bounded transition`);
  }
  const questionIds = entry.current.questions.map((question) => question.id);
  if (entry.current.questions.length !== 3
    || new Set(questionIds).size !== 3
    || entry.current.questions.some((question) => !question.promptDe.trim()
      || !String(question.promptAr ?? "").trim()
      || !String(question.explanationAr ?? "").trim())) {
    errors.push(`${entry.id}: reviewed question count, identity, prompt, or explanation drifted`);
  }
  for (const question of entry.current.questions) {
    if (question.type === "mc"
      && (!Array.isArray(question.options)
        || !question.options.includes(String(question.answer)))) {
      errors.push(`${question.id}: multiple-choice answer is absent from its options`);
    }
  }
}

const text = (id: string): ReadingText => {
  const value = byId.get(id);
  if (!value) throw new Error(`missing reading text ${id}`);
  return value;
};
const question = (textId: string, questionId: string): TextQuestion | undefined =>
  text(textId).questions.find((item) => item.id === questionId);

if (text("t-a0-02").titleDe !== "Zahlen im Alltag"
  || question("t-a0-02", "t-a0-02-q2")?.promptDe !== "Welche Zahl kommt in der Zahlenreihe am Anfang nicht vor?"
  || question("t-a0-05", "t-a0-05-q1")?.promptAr !== "ماذا يقول كريم عن نفسه؟") {
  errors.push("A0 numbers/family: bounded title, sequence reference, or Student-status question regressed");
}
if (!text("t-a0-06").de.includes("zwölf Lernende")
  || text("t-a0-06").de.includes("12 Studenten")
  || !text("t-a0-06").ar.includes("اثنا عشر متعلماً")) {
  errors.push("t-a0-06: learner label, written number, or Arabic classroom alignment regressed");
}
for (const [textId, questionId, expectedPrompt] of [
  ["t-a0-07", "t-a0-07-q3", "Was mache ich am Donnerstag?"],
  ["t-a0-08", "t-a0-08-q3", "Was trinke ich zum Abendbrot?"],
  ["t-a0-09", "t-a0-09-q3", "Um wie viel Uhr gehe ich ins Bett?"],
  ["t-a0-013", "t-a0-013-q3", "Was brauche ich an diesem Montag nicht?"],
  ["t-a0-015", "t-a0-015-q3", "Was mache ich in der Küche?"],
]) {
  if (question(textId, questionId)?.promptDe !== expectedPrompt) {
    errors.push(`${questionId}: reviewed first-person narrator perspective regressed`);
  }
}
if (!text("t-a0-09").ar.startsWith("أنهض عند السابعة")
  || question("t-a0-10", "t-a0-10-q3")?.answer !== "Rot, gelb und braun"
  || question("t-a0-011", "t-a0-011-q3")?.answer !== "Nicht schwer"
  || question("t-a0-012", "t-a0-012-q3")?.answer !== "Kuchen"
  || question("t-a0-014", "t-a0-014-q3")?.answer !== "Freundlich") {
  errors.push("A0 daily routine/distinct comprehension: translation or replacement evidence questions regressed");
}

const currentTextA0 = JSON.stringify(review01.entries.map((entry) => entry.current));
for (const stale of [
  "Die Zahlen 1–10", "ماذا يعمل كريم؟", "Im Kurs sind 12 Studenten",
  "Was macht er am Donnerstag?", "Was trinkt er zum Abendbrot?",
  "Um wie viel Uhr geht er ins Bett?", "Welche Jahreszeit mag er am liebsten?",
  "Wie viele Hefte sind in der Tasche?", "Wen besucht er am Sonntag?",
  "Was braucht er heute nicht?", "Was bestellt er heute?", "Was macht er in der Küche?",
]) {
  if (currentTextA0.includes(stale)) {
    errors.push(`PA-037-01 stale, duplicate, or perspective-drifting content returned: ${stale}`);
  }
}

if (errors.length) {
  console.error("❌ Reading-text content review audit failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  "✅ Reading-text content review: all 15 bounded A0 full-text decisions match (12 corrected, 3 confirmed-current).",
);
console.log(
  "ℹ️ This gate protects the reviewed A0 titles, German and Arabic passages, questions, options, answers, explanations, narrator perspective, duplication decisions, and claim boundaries; 142 A1–B2 texts and independent linguistic, translation, CEFR, or exam sign-off remain outside this batch.",
);
