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
const review03 = readJson<ReviewFixture>("scripts/fixtures/texts-reviewed-03.json");
const review04 = readJson<ReviewFixture>("scripts/fixtures/texts-reviewed-04.json");
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
const expectedA2 = new Set([
  "t-a2-01", "t-a2-02", "t-a2-03", "t-a2-04", "t-a2-05",
  "t-a2-06", "t-a2-07", "t-a2-08", "t-a2-09", "t-a2-10",
  "t-a2-11", "t-a2-12", "t-a2-13", "t-a2-14", "t-a2-15",
  "t-a2-16", "t-a2-17", "t-a2-18", "t-a2-19", "t-a2-20",
  "t-a2-21", "t-a2-22", "t-a2-23", "t-a2-24", "t-a2-25",
  "t-a2-26", "t-a2-27", "t-a2-28", "t-a2-29", "t-a2-30",
  "t-a2-031", "t-a2-032",
]);
const expectedB1 = new Set([
  "t-b1-01", "t-b1-02", "t-b1-03", "t-b1-04", "t-b1-05",
  "t-b1-06", "t-b1-07", "t-b1-08", "t-b1-09", "t-b1-10",
  "t-b1-11", "t-b1-12", "t-b1-13", "t-b1-14", "t-b1-15",
  "t-b1-16", "t-b1-17", "t-b1-18", "t-b1-19", "t-b1-20",
  "t-b1-21", "t-b1-22", "t-b1-23", "t-b1-24", "t-b1-25",
  "t-b1-26", "t-b1-27", "t-b1-28", "t-b1-29", "t-b1-30",
  "t-b1-31", "t-b1-32", "t-b1-33", "t-b1-34", "t-b1-35",
]);
const expectations: BatchExpectation[] = [
  { fixture: review01, batch: "PA-037-01", level: "A0", ids: expectedA0, corrected: 12, confirmed: 3 },
  { fixture: review02, batch: "PA-037-02", level: "A1", ids: expectedA1, corrected: 25, confirmed: 10 },
  { fixture: review03, batch: "PA-037-03", level: "A2", ids: expectedA2, corrected: 26, confirmed: 6 },
  { fixture: review04, batch: "PA-037-04", level: "B1", ids: expectedB1, corrected: 30, confirmed: 5 },
];

if (texts.length !== 157 || byId.size !== 157) {
  errors.push(`reading-text bank count or identity drifted: ${texts.length}/${byId.size} instead of 157/157`);
}
const a0Texts = texts.filter((text) => text.level === "A0");
const a1Texts = texts.filter((text) => text.level === "A1");
const a2Texts = texts.filter((text) => text.level === "A2");
const b1Texts = texts.filter((text) => text.level === "B1");
if (a0Texts.length !== 15 || a0Texts.reduce((sum, text) => sum + text.questions.length, 0) !== 45) {
  errors.push("A0 reading scope drifted from 15 complete texts and 45 questions");
}
if (a1Texts.length !== 35 || a1Texts.reduce((sum, text) => sum + text.questions.length, 0) !== 110) {
  errors.push("A1 reading scope drifted from 35 complete texts and 110 questions");
}
if (a2Texts.length !== 32 || a2Texts.reduce((sum, text) => sum + text.questions.length, 0) !== 104) {
  errors.push("A2 reading scope drifted from 32 complete texts and 104 questions");
}
if (b1Texts.length !== 35 || b1Texts.reduce((sum, text) => sum + text.questions.length, 0) !== 110) {
  errors.push("B1 reading scope drifted from 35 complete texts and 110 questions");
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
    const expectedQuestionCount = level === "A0" ? 3
      : entry.id.match(/^t-a[12]-(?:0[1-9]|1[0-9]|20)$/) ? 4
        : entry.id.match(/^t-b1-(?:0[1-9]|1[0-9]|20)$/) ? 3
          : entry.id.match(/^t-b1-(?:2[1-9]|30)$/) ? 4 : 2;
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
if (reviewedIds.size !== 117) errors.push(`PA-037 reviewed identity total drifted from 117 to ${reviewedIds.size}`);

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

if (question("t-a2-01", "t-a2-01-q1")?.answer?.[0] !== "bin aufgestanden"
  || question("t-a2-01", "t-a2-01-q4")?.answer?.[0] !== "gelernt"
  || question("t-a2-02", "t-a2-02-q4")?.answer?.[0] !== "Essen"
  || question("t-a2-03", "t-a2-03-q1")?.options?.includes("Er ist billiger.")
  || question("t-a2-03", "t-a2-03-q4")?.answer !== "richtig"
  || question("t-a2-04", "t-a2-04-q4")?.answer?.[0] !== "Aussprache"
  || question("t-a2-05", "t-a2-05-q4")?.answer?.[0] !== "Hause") {
  errors.push("A2 first set: first-person grammar, ambiguity, duplicate removal, or evidence answers regressed");
}
if (!text("t-a2-06").ar.includes("استلقينا على الشاطئ")
  || !text("t-a2-07").de.includes("Sich dreimal pro Woche eine halbe Stunde zu bewegen")
  || question("t-a2-08", "t-a2-08-q1")?.promptDe !== "Warum rufe ich beim Arzt an?"
  || question("t-a2-09", "t-a2-09-q4")?.answer?.[0] !== "Fenster"
  || text("t-a2-10").titleAr !== "انتقال وشيك"
  || question("t-a2-10", "t-a2-10-q4")?.answer?.[0] !== "weiter") {
  errors.push("A2 travel/health set: Arabic alignment, German construction, perspective, or replacement evidence regressed");
}
if (question("t-a2-11", "t-a2-11-q1")?.promptDe !== "Warum war ich im Baumarkt?"
  || !text("t-a2-11").ar.includes("ولمبتين كهربائيتين")
  || !text("t-a2-12").ar.includes("وعد بأن يبدأ في وقت لاحق")
  || question("t-a2-13", "t-a2-13-q4")?.answer?.[0] !== "geduldig"
  || !text("t-a2-14").de.includes("meine Schwester aus Tunis")
  || text("t-a2-14").titleAr !== "زيارة من تونس"
  || !text("t-a2-15").de.includes("zwei Möglichkeiten angeboten")
  || question("t-a2-15", "t-a2-15-q4")?.answer?.[0] !== "Schuss") {
  errors.push("A2 home/course/visit set: terminology, title claim, grammar, narrator perspective, or duplicate removal regressed");
}
if (question("t-a2-16", "t-a2-16-q2")?.answer !== "sie hat beim Lebenslauf geholfen"
  || question("t-a2-17", "t-a2-17-q4")?.answer?.[0] !== "Stecker"
  || question("t-a2-18", "t-a2-18-q4")?.answer?.[0] !== "fünfundzwanzig"
  || !text("t-a2-19").de.includes("zwei Kaltmieten, also 1040 Euro")
  || question("t-a2-19", "t-a2-19-q1")?.promptDe.includes("Warmmiete")
  || question("t-a2-20", "t-a2-20-q1")?.promptDe !== "Warum war mein Bericht nicht fertig?") {
  errors.push("A2 work/contract/housing set: overstatement, plug terminology, duplicate removal, rent evidence, or perspective regressed");
}
if (!text("t-a2-22").ar.includes("عندما تكون مستيقظة")
  || question("t-a2-24", "t-a2-24-q2")?.promptDe !== "Wo war ich am Samstag mit meiner Freundin?"
  || !text("t-a2-26").ar.includes("في موعد أقصاه يوم الخميس")
  || text("t-a2-29").titleAr !== "مثال: دورة جديدة للغة الألمانية"
  || !text("t-a2-031").ar.includes("أفرغت الصناديق وجهزت المطبخ")
  || !text("t-a2-032").ar.includes("أما الآن فينهض في السابعة")) {
  errors.push("A2 extended set: Arabic timing, perspective, deadline, title, unpacking, or aufstehen alignment regressed");
}

if (!text("t-b1-01").de.includes("und trotzdem bleibt")
  || !text("t-b1-02").de.startsWith("Bevor ich nach Deutschland kam")
  || text("t-b1-03").de.includes("70 Prozent")
  || question("t-b1-03", "t-b1-03-q2")?.answer !== "wenn der Nahverkehr besser wäre"
  || !text("t-b1-04").de.startsWith("Lieber Hassan")
  || question("t-b1-05", "t-b1-05-q3")?.answer !== "einen höflichen Rat"
  || question("t-b1-06", "t-b1-06-q3")?.answer?.length !== 3
  || text("t-b1-07").de.includes("45 Prozent")) {
  errors.push("B1 first set: syntax, chronology, unsourced percentages, salutation, meaning, or duplicate-answer decisions regressed");
}
if (!text("t-b1-08").de.includes("Wohnungen oft teuer")
  || !text("t-b1-09").de.includes("die Regeln unterscheiden sich je nach Ort")
  || !text("t-b1-10").de.includes("meine Ideen in der Besprechung als seine eigenen")
  || text("t-b1-11").titleAr !== "التطوع في بنك الطعام"
  || !text("t-b1-12").ar.includes("كنا كلانا نعرف القدر نفسه")
  || !text("t-b1-13").de.includes("etwas von seiner Schärfe nehmen")
  || text("t-b1-14").titleAr !== "المكتبة مكاناً للدراسة") {
  errors.push("B1 daily-life set: claim qualification, recycling scope, ownership, Tafel terminology, Arabic number, or title alignment regressed");
}
if (!text("t-b1-15").de.includes("Bequemlichkeit allein ist nicht entscheidend")
  || !text("t-b1-16").de.includes("Für mich gehören Missverständnisse")
  || !text("t-b1-17").de.includes("die Reifenheber")
  || !text("t-b1-18").ar.includes("قرابة الواحدة والنصف")
  || text("t-b1-19").de.includes("Millionen Menschen")
  || !text("t-b1-19").de.includes("reguläre Stellen nicht ersetzen darf")
  || question("t-b1-20", "t-b1-20-q3")?.promptDe !== "Wie beurteile ich den Umzug heute?") {
  errors.push("B1 experience set: absolute claims, narrator perspective, repair logic, time alignment, or volunteering boundaries regressed");
}
if (!text("t-b1-22").de.includes("Beide fühlten sich im Recht")
  || !text("t-b1-24").de.includes("Ob das mit seinen Änderungen zusammenhängt")
  || text("t-b1-25").titleAr !== "مساحات خضراء أكثر وضجيج أقلّ"
  || !text("t-b1-26").de.includes("Gerade dieses Ende hatte Salma beeindruckt")
  || !text("t-b1-27").de.includes("Energie-, Wasser- und Verpackungsverbrauch")
  || !text("t-b1-29").de.startsWith("Als Mutter war ich")
  || !text("t-b1-30").de.includes("weil ich keine Firmenkreditkarte hatte")) {
  errors.push("B1 extended set: dispute logic, health non-causality, title, word order, environmental scope, narrator identity, or travel rationale regressed");
}
if (text("t-b1-31").wordCountDe !== 183
  || !text("t-b1-31").de.includes("für mich günstigeren Mieten")
  || text("t-b1-32").wordCountDe !== 195
  || !text("t-b1-32").de.includes("Ob diese Veränderungen allein an meiner Ernährung liegen")
  || text("t-b1-33").wordCountDe !== 169
  || text("t-b1-34").wordCountDe !== 172
  || text("t-b1-35").wordCountDe !== 171
  || !text("t-b1-35").de.includes("an mehreren Stellen Mülleimer")) {
  errors.push("B1 final set: word counts, rent and health boundaries, confirmed examples, or bin-placement consistency regressed");
}

const currentReviewed = JSON.stringify(expectations.flatMap(({ fixture }) => fixture.entries.map((entry) => entry.current)));
for (const stale of [
  "Die Zahlen 1–10", "ماذا يعمل كريم؟", "Im Kurs sind 12 Studenten",
  "Was macht er am Donnerstag?", "Welche Jahreszeit mag er am liebsten?", "Was bestellt er heute?",
  "Was ist der Vater von ihm?", "Youssef steht um ___ sieben auf.", "Das Brot kostet ___ Euro.",
  "Der Bahnhof ist gegenüber vom ___.", "Sara studiert ___.", "Am Flughafen hat mich mein ___ abgeholt.",
  "في المتوسط يكلف كل شيء", "الماء العذب كل صباح", "Heute habe ich Geburtstag und bin dreißig Jahre alt.",
  "استلمنا على الشاطئ", "انتظارٌ كبير", "Dreimal pro Woche eine halbe Stunde bewegen reicht schon.",
  "In der Werkstatt hat man mir zwei Möglichkeiten:", "الأجرة الشاملة مع التدفئة", "أخرجت الصناديق ورتبت المطبخ",
  "Lief Hassan", "45 Prozent würden heute eine Ausbildung", "Millionen Menschen ehrenamtlich",
  "Immerhin hundertmal", "Salma hatte gerade dieses Ende beeindruckt", "Obwohl es genug Mülleimer gibt",
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
  "✅ Reading-text content review: all 117 bounded A0–B1 full-text decisions match (93 corrected, 24 confirmed-current).",
);
console.log(
  "ℹ️ This gate protects reviewed titles, German and Arabic passages, metadata, questions, options, answers, explanations, narrator perspective, ambiguity, duplication decisions, and claim boundaries; 40 B2 texts, all 176 dialogues, independent linguistic/translation, legal, medical, or environmental review, audio revalidation, CEFR calibration, and exam sign-off remain outside these batches.",
);
