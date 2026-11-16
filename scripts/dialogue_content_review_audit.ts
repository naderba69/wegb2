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
const review02 = readJson<ReviewFixture>("scripts/fixtures/dialogues-reviewed-02.json");
const byId = new Map(dialogues.map((dialogue) => [dialogue.id, dialogue]));
const errors: string[] = [];
const expectedA0 = new Set([
  "d-a0-01", "d-a0-02", "d-a0-03", "d-a0-04", "d-a0-05",
  "d-a0-06", "d-a0-07", "d-a0-08", "d-a0-09", "d-a0-10",
  "d-a0-11", "d-a0-12", "d-a0-13", "d-a0-ht01", "d-a0-ht02",
  "d-a0-ht03",
]);
const expectedA1 = new Set([
  "d-a1-01", "d-a1-02", "d-a1-03", "d-a1-04", "d-a1-05", "d-a1-06",
  "d-a1-07", "d-a1-08", "d-a1-09", "d-a1-10", "d-a1-11", "d-a1-12",
  "d-a1-13", "d-a1-14", "d-a1-15", "d-a1-16", "d-a1-17", "d-a1-18",
  "d-a1-19", "d-a1-20", "d-a1-21", "d-a1-22", "d-a1-23", "d-a1-24",
  "d-a1-25", "d-a1-26", "d-a1-27", "d-a1-31", "d-a1-32",
  "dlg-a1-fahrkarte", "hoer-a1-01", "hoer-a1-02", "d-a1-ht01",
  "d-a1-ht02", "d-a1-ht03", "dlg-a1-baeckerei",
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
const a1Dialogues = dialogues.filter((dialogue) => dialogue.level === "A1");
if (a1Dialogues.length !== 36
  || a1Dialogues.reduce((sum, dialogue) => sum + dialogue.lines.length, 0) !== 238
  || a1Dialogues.reduce((sum, dialogue) => sum + dialogue.questions.length, 0) !== 89) {
  errors.push("A1 dialogue scope drifted from 36 complete dialogues, 238 lines, and 89 questions");
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

const ids02 = new Set(review02.entries.map((entry) => entry.id));
const corrected02 = review02.entries.filter((entry) => entry.decision === "corrected");
const confirmed02 = review02.entries.filter((entry) => entry.decision === "confirmed-current");
if (review02.schema !== "wegb2-reviewed-dialogue-decision-batch-v1"
  || review02.batch !== "PA-038-02"
  || review02.reviewedAt !== "2026-11-04"
  || review02.entries.length !== 36
  || ids02.size !== 36
  || [...expectedA1].some((id) => !ids02.has(id))
  || corrected02.length !== 36
  || confirmed02.length !== 0
  || review02.entries.some((entry) => entry.level !== "A1" || !entry.rationale.trim())) {
  errors.push("PA-038-02: unexpected fixture scope, counts, levels, or decision metadata");
}
if (!review02.scope.includes("all 238 line alignments")
  || !review02.scope.includes("all 89 questions")
  || !review02.scope.includes("triage only")
  || !review02.scope.includes("not correction generators")
  || !review02.scope.includes("not independent")
  || !review02.scope.includes("CEFR")
  || !review02.scope.includes("exam sign-off")) {
  errors.push("PA-038-02: fixture must preserve full-scope and external-sign-off claim boundaries");
}

for (const entry of review02.entries) {
  const actual = byId.get(entry.id);
  if (!actual) {
    errors.push(`PA-038-02: missing dialogue ${entry.id}`);
    continue;
  }
  if (actual.id !== entry.id
    || actual.level !== "A1"
    || entry.previous.id !== entry.id
    || entry.current.id !== entry.id
    || entry.previous.level !== "A1"
    || entry.current.level !== "A1"
    || JSON.stringify(actual) !== JSON.stringify(entry.current)) {
    errors.push(`${entry.id}: A1 identity, level, or reviewed full-dialogue content drifted`);
  }
  const changed = JSON.stringify(entry.previous) !== JSON.stringify(entry.current);
  if ((entry.decision === "corrected" && !changed)
    || (entry.decision === "confirmed-current" && changed)) {
    errors.push(`${entry.id}: A1 decision does not match its bounded transition`);
  }
  if (!entry.current.titleDe.trim() || !entry.current.titleAr.trim()
    || !entry.current.cultural_theme?.trim()
    || entry.current.lines.some((line) => !line.who.trim() || !line.de.trim() || !line.ar.trim())) {
    errors.push(`${entry.id}: reviewed A1 title, topic, speaker, or bilingual line is empty`);
  }
  const questionIds = entry.current.questions.map((question) => question.id);
  if (new Set(questionIds).size !== questionIds.length
    || entry.current.questions.some((question) => !question.promptDe.trim()
      || !String(question.promptAr ?? "").trim()
      || !String(question.explanationAr ?? "").trim())) {
    errors.push(`${entry.id}: reviewed A1 question identity, prompt, or explanation drifted`);
  }
  for (const questionItem of entry.current.questions) {
    if ((questionItem.type === "mc" || questionItem.type === "truefalse")
      && (!Array.isArray(questionItem.options) || !questionItem.options.includes(String(questionItem.answer)))) {
      errors.push(`${questionItem.id}: A1 answer is absent from its options`);
    }
  }
  if ((entry.current.dictation ?? []).some((sentence) =>
    !entry.current.lines.some((line) => line.de.includes(sentence)))) {
    errors.push(`${entry.id}: A1 dictation segment is absent from the reviewed German lines`);
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

if (dialogue("d-a1-06").lines[1].de !== "Hier, bitte. Fährt dieser Bus zum Zentrum?"
  || dialogue("d-a1-10").lines[7].de !== "Nein danke, dann bin ich bestimmt satt."
  || question("d-a1-11", "d-a1-11-q2")?.answer !== "Sie untersucht Frau Nasri."
  || dialogue("d-a1-13").lines[4].de !== "Soll ich einen Sitzplatz reservieren?"
  || question("d-a1-14", "d-a1-14-q2")?.answer !== "von Größe und Gewicht") {
  errors.push("A1 first half: bus deixis, idiomatic sequence, medical boundary, reservation wording, or stable postage decision regressed");
}
if (dialogue("d-a1-18").lines[1].de !== "Ich bin Tunesier. Meine Heimat ist Tunesien; ich komme aus Sfax."
  || dialogue("d-a1-20").lines[5].de !== "Gestern, am Montag. Das war kurz, nur eine Stunde."
  || !dialogue("d-a1-23").lines[3].de.includes("voraussichtlich")
  || !dialogue("d-a1-25").lines[5].de.includes("an diesem Automaten")
  || !dialogue("d-a1-26").lines[3].de.startsWith("Hier ist")) {
  errors.push("A1 second half: personal-information alignment, chronology, emergency estimate, ATM scope, or local weather boundary regressed");
}
if (!dialogue("d-a1-ht01").lines[1].de.includes("116 117")
  || !dialogue("d-a1-ht01").lines[1].de.includes("112")
  || dialogue("d-a1-ht03").lines[0].ar !== "انتباه، المسار 5! قطار ICE 621 إلى فرانكفورت سينطلق بعد 5 دقائق. العربات 15–21 في الجزء الخلفي. انتبهوا عند دخول القطار."
  || dialogue("hoer-a1-02").lines[0].de.startsWith("Liebe Kunden!")
  || a1Dialogues.some((item) => item.cultural_note !== undefined)
  || a1Dialogues.some((item) => item.questions.some((itemQuestion) => /اختر|أكمل|املأ/.test(itemQuestion.promptAr ?? "")))) {
  errors.push("A1 final set: emergency numbers, Arabic rail terminology, inclusive address, topic cleanup, or semantic Arabic prompts regressed");
}

const reviewedCurrent = JSON.stringify([...review01.entries, ...review02.entries].map((entry) => entry.current));
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
  "✅ Dialogue content review: all 52 bounded A0–A1 full-dialogue decisions match (52 corrected, 0 confirmed-current; 306 lines and 124 questions).",
);
console.log(
  "ℹ️ This gate protects reviewed A0–A1 titles, situations, speakers, German and Arabic lines, questions, options, answers, explanations, dictation, metadata, ambiguity, register, and claim boundaries; 124 A2–B2 dialogues, independent linguistic/translation, cultural, medical, emergency-services, audio, CEFR, and exam sign-off remain outside these batches.",
);
