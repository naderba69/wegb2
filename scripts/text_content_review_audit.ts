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
  wordCountDe?: number;
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

type BatchExpectation = {
  fixture: ReviewFixture;
  batch: string;
  level: string;
  ids: Set<string>;
  corrected: number;
  confirmed: number;
};

const readJson = <T>(relativePath: string): T => JSON.parse(
  fs.readFileSync(path.join(process.cwd(), relativePath), "utf8"),
) as T;
const texts = readJson<ReadingText[]>("content/texts.json");
const review01 = readJson<ReviewFixture>("scripts/fixtures/texts-reviewed-01.json");
const review02 = readJson<ReviewFixture>("scripts/fixtures/texts-reviewed-02.json");
const byId = new Map(texts.map((text) => [text.id, text]));
const errors: string[] = [];
const expectedA0 = new Set([
  "t-a0-01", "t-a0-02", "t-a0-03", "t-a0-04", "t-a0-05",
  "t-a0-06", "t-a0-07", "t-a0-08", "t-a0-09", "t-a0-10",
  "t-a0-011", "t-a0-012", "t-a0-013", "t-a0-014", "t-a0-015",
]);
const expectedA1 = new Set([
  "t-a1-01", "t-a1-02", "t-a1-03", "t-a1-04", "t-a1-05",
  "t-a1-06", "t-a1-07", "t-a1-08", "t-a1-09", "t-a1-10",
  "t-a1-11", "t-a1-12", "t-a1-13", "t-a1-14", "t-a1-15",
  "t-a1-16", "t-a1-17", "t-a1-18", "t-a1-19", "t-a1-20",
  "t-a1-021", "t-a1-022", "t-a1-023", "t-a1-024", "t-a1-025",
  "t-a1-026", "t-a1-027", "t-a1-028", "t-a1-029", "t-a1-030",
  "t-a1-031", "t-a1-032", "t-a1-033", "t-a1-034", "t-a1-035",
]);
const expectations: BatchExpectation[] = [
  { fixture: review01, batch: "PA-037-01", level: "A0", ids: expectedA0, corrected: 12, confirmed: 3 },
  { fixture: review02, batch: "PA-037-02", level: "A1", ids: expectedA1, corrected: 25, confirmed: 10 },
];

if (texts.length !== 157 || byId.size !== 157) {
  errors.push(`reading-text bank count or identity drifted: ${texts.length}/${byId.size} instead of 157/157`);
}
const a0Texts = texts.filter((text) => text.level === "A0");
const a1Texts = texts.filter((text) => text.level === "A1");
if (a0Texts.length !== 15 || a0Texts.reduce((sum, text) => sum + text.questions.length, 0) !== 45) {
  errors.push("A0 reading scope drifted from 15 complete texts and 45 questions");
}
if (a1Texts.length !== 35 || a1Texts.reduce((sum, text) => sum + text.questions.length, 0) !== 110) {
  errors.push("A1 reading scope drifted from 35 complete texts and 110 questions");
}

const reviewedIds = new Set<string>();
for (const expectation of expectations) {
  const { fixture, batch, level, ids: expectedIds, corrected: expectedCorrected, confirmed: expectedConfirmed } = expectation;
  const ids = new Set(fixture.entries.map((entry) => entry.id));
  const corrected = fixture.entries.filter((entry) => entry.decision === "corrected");
  const confirmed = fixture.entries.filter((entry) => entry.decision === "confirmed-current");
  if (fixture.schema !== "wegb2-reviewed-text-decision-batch-v1"
    || fixture.batch !== batch
    || fixture.reviewedAt !== "2026-11-04"
    || fixture.entries.length !== expectedIds.size
    || ids.size !== expectedIds.size
    || [...expectedIds].some((id) => !ids.has(id))
    || corrected.length !== expectedCorrected
    || confirmed.length !== expectedConfirmed
    || fixture.entries.some((entry) => entry.level !== level || !entry.rationale.trim())) {
    errors.push(`${batch}: unexpected fixture scope, counts, levels, or decision metadata`);
  }
  if (!fixture.scope.includes("triage only")
    || !fixture.scope.includes("not correction generators")
    || !fixture.scope.includes("not independent")
    || !fixture.scope.includes("CEFR")
    || !fixture.scope.includes("exam sign-off")) {
    errors.push(`${batch}: fixture must preserve triage and external-sign-off claim boundaries`);
  }

  for (const entry of fixture.entries) {
    if (reviewedIds.has(entry.id)) errors.push(`${entry.id}: duplicated across PA-037 fixtures`);
    reviewedIds.add(entry.id);
    const actual = byId.get(entry.id);
    if (!actual) {
      errors.push(`${batch}: missing reading text ${entry.id}`);
      continue;
    }
    if (actual.id !== entry.id
      || actual.level !== level
      || entry.previous.id !== entry.id
      || entry.current.id !== entry.id
      || entry.previous.level !== level
      || entry.current.level !== level
      || JSON.stringify(actual) !== JSON.stringify(entry.current)) {
      errors.push(`${entry.id}: identity, level, or reviewed full-text content drifted`);
    }
    const changed = JSON.stringify(entry.previous) !== JSON.stringify(entry.current);
    if ((entry.decision === "corrected" && !changed)
      || (entry.decision === "confirmed-current" && changed)) {
      errors.push(`${entry.id}: decision does not match its bounded transition`);
    }
    const questionIds = entry.current.questions.map((question) => question.id);
    const expectedQuestionCount = level === "A0" ? 3 : entry.id.match(/^t-a1-(?:0[1-9]|1[0-9]|20)$/) ? 4 : 2;
    if (entry.current.questions.length !== expectedQuestionCount
      || new Set(questionIds).size !== expectedQuestionCount
      || entry.current.questions.some((question) => !question.promptDe.trim()
        || !String(question.promptAr ?? "").trim()
        || !String(question.explanationAr ?? "").trim())) {
      errors.push(`${entry.id}: reviewed question count, identity, prompt, or explanation drifted`);
    }
    if (typeof entry.current.wordCountDe === "number"
      && entry.current.wordCountDe !== entry.current.de.split(/\s+/).filter(Boolean).length) {
      errors.push(`${entry.id}: wordCountDe does not match the reviewed German passage`);
    }
    for (const question of entry.current.questions) {
      if (question.type === "mc"
        && (!Array.isArray(question.options)
          || !question.options.includes(String(question.answer)))) {
        errors.push(`${question.id}: multiple-choice answer is absent from its options`);
      }
    }
  }
}
if (reviewedIds.size !== 50) errors.push(`PA-037 reviewed identity total drifted from 50 to ${reviewedIds.size}`);

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

if (!text("t-a1-01").ar.includes("كل يوم أنهض")
  || question("t-a1-01", "t-a1-01-q4")?.answer?.[0] !== "Abend"
  || question("t-a1-02", "t-a1-02-q1")?.promptDe !== "Was ist mein Vater von Beruf?"
  || question("t-a1-02", "t-a1-02-q4")?.answer?.[0] !== "Salma"
  || question("t-a1-03", "t-a1-03-q4")?.answer?.[0] !== "Tüte"
  || question("t-a1-04", "t-a1-04-q4")?.answer?.[0] !== "geradeaus"
  || question("t-a1-05", "t-a1-05-q4")?.answer?.[0] !== "Freunden") {
  errors.push("A1 first set: Arabic alignment, narrator perspective, or de-duplicated evidence items regressed");
}
if (question("t-a1-06", "t-a1-06-q3")?.promptDe !== "Ich mag das Zimmer, weil es ___ ist."
  || !text("t-a1-07").ar.includes("السادسة مساءً")
  || question("t-a1-07", "t-a1-07-q4")?.answer?.[0] !== "Kindern"
  || question("t-a1-08", "t-a1-08-q1")?.promptDe !== "Wann stehe ich auf?"
  || question("t-a1-08", "t-a1-08-q4")?.answer?.[0] !== "Buch"
  || !text("t-a1-09").de.endsWith("Zu Hause räume ich die Einkäufe ein.")
  || question("t-a1-09", "t-a1-09-q4")?.answer?.[0] !== "billig"
  || !text("t-a1-10").ar.includes("شبكة الواي فاي مجانية")) {
  errors.push("A1 daily-life set: perspective, chronology, Arabic wording, or replacement evidence regressed");
}
if (text("t-a1-11").titleAr !== "عطلة نهاية الأسبوع: السوق والحديقة"
  || question("t-a1-11", "t-a1-11-q4")?.answer?.[0] !== "Buch"
  || question("t-a1-12", "t-a1-12-q1")?.answer !== "regnerisch und windig"
  || !text("t-a1-13").de.includes("eine kleine Wohnung für dich gefunden")
  || !text("t-a1-14").de.includes("für einen Brief gehe ich zur Post")
  || !text("t-a1-15").de.includes("auf dem zweiten Tabellenplatz")
  || question("t-a1-16", "t-a1-16-q4")?.answer?.[0] !== "Blumen") {
  errors.push("A1 weekend/weather/city set: title, explicit evidence, idiom, or duplicate removal regressed");
}
if (question("t-a1-17", "t-a1-17-q1")?.answer !== "mein Onkel"
  || question("t-a1-17", "t-a1-17-q4")?.answer?.[0] !== "Suppe"
  || !text("t-a1-18").ar.includes("نعرف بعضنا بعضاً")
  || text("t-a1-19").titleAr !== "عطلة نهاية الأسبوع: العائلة والأصدقاء"
  || question("t-a1-19", "t-a1-19-q4")?.answer?.[0] !== "Mutter"
  || !text("t-a1-20").de.includes("Der Arzt sagt: „Sie haben eine Erkältung.")) {
  errors.push("A1 travel/family/clinic set: perspective, Arabic alignment, quotation, or replacement evidence regressed");
}
if (text("t-a1-022").wordCountDe !== 112
  || !text("t-a1-022").de.includes("Wir essen Brot mit Käse und ein Ei.")
  || !text("t-a1-028").ar.includes("أنهض كل يوم")
  || text("t-a1-030").wordCountDe !== 116
  || text("t-a1-030").de.indexOf("Im Wartezimmer") > text("t-a1-030").de.indexOf("Sie untersucht mich")
  || !text("t-a1-031").ar.includes("الماء النظيف")
  || !text("t-a1-035").de.startsWith("Heute habe ich Geburtstag und werde dreißig Jahre alt.")) {
  errors.push("A1 extended set: word counts, clinic chronology, translation, or birthday tense regressed");
}

const currentReviewed = JSON.stringify(expectations.flatMap(({ fixture }) => fixture.entries.map((entry) => entry.current)));
for (const stale of [
  "Die Zahlen 1–10", "ماذا يعمل كريم؟", "Im Kurs sind 12 Studenten",
  "Was macht er am Donnerstag?", "Welche Jahreszeit mag er am liebsten?", "Was bestellt er heute?",
  "Was ist der Vater von ihm?", "Youssef steht um ___ sieben auf.", "Das Brot kostet ___ Euro.",
  "Der Bahnhof ist gegenüber vom ___.", "Sara studiert ___.", "Am Flughafen hat mich mein ___ abgeholt.",
  "في المتوسط يكلف كل شيء", "الماء العذب كل صباح", "Heute habe ich Geburtstag und bin dreißig Jahre alt.",
]) {
  if (currentReviewed.includes(stale)) {
    errors.push(`PA-037 stale, duplicate, mistranslated, or perspective-drifting content returned: ${stale}`);
  }
}

if (errors.length) {
  console.error("❌ Reading-text content review audit failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  "✅ Reading-text content review: all 50 bounded A0–A1 full-text decisions match (37 corrected, 13 confirmed-current).",
);
console.log(
  "ℹ️ This gate protects reviewed titles, German and Arabic passages, metadata, questions, options, answers, explanations, narrator perspective, duplication decisions, and claim boundaries; 107 A2–B2 texts, all 176 dialogues, independent linguistic/translation review, audio revalidation, CEFR calibration, and exam sign-off remain outside these batches.",
);
