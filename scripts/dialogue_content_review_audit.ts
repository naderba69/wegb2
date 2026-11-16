import fs from "node:fs";
import path from "node:path";

type DialogueLine = {
  who: string;
  de: string;
  ar: string;
};

type DialogueQuestion = {
  id: string;
  type: string;
  promptDe: string;
  promptAr?: string;
  options?: string[];
  answer: string | string[];
  explanationAr?: string;
};

type Dialogue = {
  id: string;
  level: string;
  titleDe: string;
  titleAr: string;
  lines: DialogueLine[];
  questions: DialogueQuestion[];
  dictation?: string[];
  cultural_theme?: string;
  cultural_note?: string;
  [key: string]: unknown;
};

type ReviewEntry = {
  id: string;
  level: string;
  decision: "corrected" | "confirmed-current";
  rationale: string;
  previous: Dialogue;
  current: Dialogue;
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
const dialogues = readJson<Dialogue[]>("content/dialogues.json");
const review01 = readJson<ReviewFixture>("scripts/fixtures/dialogues-reviewed-01.json");
const byId = new Map(dialogues.map((dialogue) => [dialogue.id, dialogue]));
const errors: string[] = [];
const expectedA0 = new Set([
  "d-a0-01", "d-a0-02", "d-a0-03", "d-a0-04", "d-a0-05",
  "d-a0-06", "d-a0-07", "d-a0-08", "d-a0-09", "d-a0-10",
  "d-a0-11", "d-a0-12", "d-a0-13", "d-a0-ht01", "d-a0-ht02",
  "d-a0-ht03",
]);

if (dialogues.length !== 176 || byId.size !== 176) {
  errors.push(`dialogue bank count or identity drifted: ${dialogues.length}/${byId.size} instead of 176/176`);
}
const a0Dialogues = dialogues.filter((dialogue) => dialogue.level === "A0");
if (a0Dialogues.length !== 16
  || a0Dialogues.reduce((sum, dialogue) => sum + dialogue.lines.length, 0) !== 68
  || a0Dialogues.reduce((sum, dialogue) => sum + dialogue.questions.length, 0) !== 35) {
  errors.push("A0 dialogue scope drifted from 16 complete dialogues, 68 lines, and 35 questions");
}

const ids = new Set(review01.entries.map((entry) => entry.id));
const corrected = review01.entries.filter((entry) => entry.decision === "corrected");
const confirmed = review01.entries.filter((entry) => entry.decision === "confirmed-current");
if (review01.schema !== "wegb2-reviewed-dialogue-decision-batch-v1"
  || review01.batch !== "PA-038-01"
  || review01.reviewedAt !== "2026-11-04"
  || review01.entries.length !== 16
  || ids.size !== 16
  || [...expectedA0].some((id) => !ids.has(id))
  || corrected.length !== 16
  || confirmed.length !== 0
  || review01.entries.some((entry) => entry.level !== "A0" || !entry.rationale.trim())) {
  errors.push("PA-038-01: unexpected fixture scope, counts, levels, or decision metadata");
}
if (!review01.scope.includes("triage only")
  || !review01.scope.includes("not correction generators")
  || !review01.scope.includes("not independent")
  || !review01.scope.includes("CEFR")
  || !review01.scope.includes("exam sign-off")) {
  errors.push("PA-038-01: fixture must preserve triage and external-sign-off claim boundaries");
}

for (const entry of review01.entries) {
  const actual = byId.get(entry.id);
  if (!actual) {
    errors.push(`PA-038-01: missing dialogue ${entry.id}`);
    continue;
  }
  if (actual.id !== entry.id
    || actual.level !== "A0"
    || entry.previous.id !== entry.id
    || entry.current.id !== entry.id
    || entry.previous.level !== "A0"
    || entry.current.level !== "A0"
    || JSON.stringify(actual) !== JSON.stringify(entry.current)) {
    errors.push(`${entry.id}: identity, level, or reviewed full-dialogue content drifted`);
  }
  const changed = JSON.stringify(entry.previous) !== JSON.stringify(entry.current);
  if ((entry.decision === "corrected" && !changed)
    || (entry.decision === "confirmed-current" && changed)) {
    errors.push(`${entry.id}: decision does not match its bounded transition`);
  }
  if (!entry.current.titleDe.trim() || !entry.current.titleAr.trim()
    || entry.current.lines.some((line) => !line.who.trim() || !line.de.trim() || !line.ar.trim())) {
    errors.push(`${entry.id}: reviewed title, speaker, or bilingual line is empty`);
  }
  const questionIds = entry.current.questions.map((question) => question.id);
  if (new Set(questionIds).size !== questionIds.length
    || entry.current.questions.some((question) => !question.promptDe.trim()
      || !String(question.promptAr ?? "").trim()
      || !String(question.explanationAr ?? "").trim())) {
    errors.push(`${entry.id}: reviewed question identity, prompt, or explanation drifted`);
  }
  for (const question of entry.current.questions) {
    if ((question.type === "mc" || question.type === "truefalse")
      && (!Array.isArray(question.options) || !question.options.includes(String(question.answer)))) {
      errors.push(`${question.id}: answer is absent from its options`);
    }
  }
  if ((entry.current.dictation ?? []).some((sentence) =>
    !entry.current.lines.some((line) => line.de.includes(sentence)))) {
    errors.push(`${entry.id}: dictation segment is absent from the reviewed German lines`);
  }
}

const dialogue = (id: string): Dialogue => {
  const value = byId.get(id);
  if (!value) throw new Error(`missing dialogue ${id}`);
  return value;
};
const question = (dialogueId: string, questionId: string): DialogueQuestion | undefined =>
  dialogue(dialogueId).questions.find((item) => item.id === questionId);

if (!question("d-a0-01", "d-a0-01-q1")?.explanationAr?.includes("Ich heiße Ali")
  || dialogue("d-a0-02").lines[0].ar !== "كم يساوي واحد زائد اثنين؟"
  || dialogue("d-a0-03").titleDe !== "Einen Namen buchstabieren"
  || question("d-a0-04", "d-a0-04-q1")?.promptAr !== "من أين تأتي ليلى؟") {
  errors.push("A0 first set: evidence, Arabic arithmetic/origin wording, or spelling-title decisions regressed");
}
if (dialogue("d-a0-05").lines[2].de !== "Buchstabieren Sie den Namen bitte."
  || question("d-a0-06", "d-a0-06-q2")?.answer !== "Ein Glas Wasser"
  || dialogue("d-a0-08").cultural_theme !== "Farewells"
  || dialogue("d-a0-09").lines[1].ar !== "ثمنه 2.50 يورو.") {
  errors.push("A0 daily-life set: spelling request, extra-order ambiguity, farewell metadata, or price translation regressed");
}
if (dialogue("d-a0-11").lines[4].de !== "Gut, ich untersuche Sie jetzt."
  || dialogue("d-a0-12").cultural_theme !== "Family"
  || dialogue("d-a0-13").cultural_theme !== "Asking for directions"
  || question("d-a0-ht01", "d-a0-ht01-q2")?.promptAr !== "ما رقم المسار؟"
  || dialogue("d-a0-ht02").cultural_theme !== "Shopping and prices"
  || dialogue("d-a0-ht03").lines[0].ar !== "مرحباً! ماذا ترغب؟") {
  errors.push("A0 final set: medical boundary, family/directions metadata, railway terminology, shopping topic, or café address regressed");
}

const reviewedCurrent = JSON.stringify(review01.entries.map((entry) => entry.current));
for (const stale of [
  "German greetings typically include handshakes",
  "Weihnachten - Christmas traditions",
  "Umwelt - Environmental awareness",
  "Bierbrauerei - German beer culture",
  "الإجابة الصحيحة محدَّدة بالأزرار",
  "Gut, trinken Sie viel Wasser und ruhen Sie sich aus.",
]) {
  if (reviewedCurrent.includes(stale)) {
    errors.push(`PA-038 stale, generic, unrelated, or unbounded content returned: ${stale}`);
  }
}

if (errors.length) {
  console.error("❌ Dialogue content review audit failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  "✅ Dialogue content review: all 16 bounded A0 full-dialogue decisions match (16 corrected, 0 confirmed-current; 68 lines and 35 questions).",
);
console.log(
  "ℹ️ This gate protects reviewed A0 titles, situations, speakers, German and Arabic lines, questions, options, answers, explanations, dictation, metadata, ambiguity, register, and claim boundaries; 160 A1–B2 dialogues, independent linguistic/translation, cultural, medical, audio, CEFR, and exam sign-off remain outside this batch.",
);
