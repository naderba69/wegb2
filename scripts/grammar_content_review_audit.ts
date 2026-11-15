import fs from "node:fs";
import path from "node:path";

type GrammarTopic = {
  id: string;
  level: string;
  titleDe: string;
  titleAr: string;
  ziel: string;
  summaryAr: string;
  rules: Record<string, unknown>[];
  examples: Record<string, unknown>[];
  pitfalls: Record<string, unknown>[];
  exercises: Record<string, unknown>[];
  verify: Record<string, unknown>[];
  [key: string]: unknown;
};

type ReviewEntry = {
  id: string;
  level: string;
  decision: "corrected" | "confirmed-current";
  rationale: string;
  previous: GrammarTopic;
  current: GrammarTopic;
};

type ReviewFixture = {
  schema: string;
  batch: string;
  scope: string;
  entries: ReviewEntry[];
};

const grammar = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "content", "grammar.json"), "utf8"),
) as Record<string, GrammarTopic>;
const review01 = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "scripts", "fixtures", "grammar-reviewed-01.json"), "utf8"),
) as ReviewFixture;
const errors: string[] = [];
const expectedIds = new Set([
  "a0-begrussung",
  "a0-buchstaben",
  "a0-zahlen",
  "a0-artikel",
  "a0-du-sie",
  "a0-aussprache-vowels",
  "a0-aussprache-umlaut",
  "a0-satzbau",
]);
const ids = new Set(review01.entries.map((entry) => entry.id));
const corrected = review01.entries.filter((entry) => entry.decision === "corrected");
const confirmed = review01.entries.filter((entry) => entry.decision === "confirmed-current");

if (Object.keys(grammar).length !== 87) {
  errors.push(`grammar topic count drifted: ${Object.keys(grammar).length} instead of 87`);
}
if (review01.schema !== "wegb2-reviewed-grammar-decision-batch-v1"
  || review01.batch !== "PA-036-01"
  || review01.entries.length !== 8
  || ids.size !== 8
  || [...expectedIds].some((id) => !ids.has(id))
  || corrected.length !== 8
  || confirmed.length !== 0
  || review01.entries.some((entry) => entry.level !== "A0" || !entry.rationale.trim())) {
  errors.push(
    `unexpected PA-036-01 fixture scope/counts: ${review01.schema}/${review01.batch}/${review01.entries.length}/${ids.size}/${corrected.length}/${confirmed.length}`,
  );
}
if (!review01.scope.includes("triage only")
  || !review01.scope.includes("not correction generators")
  || !review01.scope.includes("not independent linguistic, phonetic, CEFR, or exam sign-off")) {
  errors.push("PA-036-01 fixture must preserve its triage and external-sign-off claim boundary");
}

for (const entry of review01.entries) {
  const actual = grammar[entry.id];
  if (!actual) {
    errors.push(`missing PA-036-01 grammar topic ${entry.id}`);
    continue;
  }
  if (actual.id !== entry.id
    || actual.level !== "A0"
    || entry.previous.id !== entry.id
    || entry.current.id !== entry.id
    || entry.previous.level !== "A0"
    || entry.current.level !== "A0"
    || JSON.stringify(actual) !== JSON.stringify(entry.current)) {
    errors.push(`${entry.id}: PA-036-01 identity or reviewed topic content drifted`);
  }
  if (entry.decision !== "corrected"
    || JSON.stringify(entry.previous) === JSON.stringify(entry.current)) {
    errors.push(`${entry.id}: PA-036-01 corrected decision has no change or unexpected status`);
  }
}

const topic = (id: string): GrammarTopic => {
  const value = grammar[id];
  if (!value) throw new Error(`missing grammar topic ${id}`);
  return value;
};
const exercise = (topicId: string, exerciseId: string): Record<string, unknown> | undefined =>
  topic(topicId).exercises.find((item) => item.id === exerciseId);
const verify = (topicId: string, verifyId: string): Record<string, unknown> | undefined =>
  topic(topicId).verify.find((item) => item.id === verifyId);

if (!String(topic("a0-begrussung").pronTippAr).includes("من دون ملامسة كاملة")
  || exercise("a0-begrussung", "a0-begrussung-ex03")?.promptAr !== "اختر ضمير Dativ المناسب في سؤال الحال."
  || !JSON.stringify(topic("a0-begrussung").pitfalls[2]).includes("Wie geht's dir")) {
  errors.push("a0-begrussung: reviewed articulation, prompt, or question distinction regressed");
}
if (!JSON.stringify(topic("a0-buchstaben").anwendung).includes("Ziffer für Ziffer")
  || !String(verify("a0-buchstaben", "a0-buchstaben-v2")?.explanationAr).includes("Strasse")
  || exercise("a0-buchstaben", "a0-buchstaben-q3")?.promptDe !== "Das w in „Wasser“ klingt wie das englische v."
  || !topic("a0-buchstaben").pitfalls.every((item) => JSON.stringify(item).length > 60)) {
  errors.push("a0-buchstaben: reviewed spelling, Swiss orthography, w-sound, or complete pitfalls regressed");
}
if (!topic("a0-zahlen").rules.some((rule) => JSON.stringify(rule).includes("Januar") && JSON.stringify(rule).includes("Dezember"))
  || !String(topic("a0-zahlen").pronTippAr).includes("chs صوت /ks/")) {
  errors.push("a0-zahlen: reviewed month/date or sechs pronunciation guidance regressed");
}
if (!topic("a0-artikel").ziel.includes("10–12")
  || !topic("a0-artikel").summaryAr.includes("ليست بديلاً عن حفظ الأداة")) {
  errors.push("a0-artikel: reviewed bounded noun scope or conservative gender guidance regressed");
}
if (!topic("a0-du-sie").rules.some((rule) => JSON.stringify(rule).includes("Können wir uns duzen?"))
  || !topic("a0-du-sie").summaryAr.includes("يعتمد الاختيار على العرف والعلاقة والموقف")) {
  errors.push("a0-du-sie: reviewed context-sensitive register guidance regressed");
}
if (!topic("a0-aussprache-vowels").summaryAr.includes("إشارات إملائية لها استثناءات")
  || !String(exercise("a0-aussprache-vowels", "a0-aussprache-vowels-r141e-e03")?.options).includes("die Bahn")) {
  errors.push("a0-aussprache-vowels: reviewed spelling-signal boundary or Bahn article regressed");
}
if (!topic("a0-aussprache-umlaut").ziel.startsWith("تتدرّب")
  || !topic("a0-aussprache-umlaut").summaryAr.includes("يختلف الطول بحسب الكلمة")) {
  errors.push("a0-aussprache-umlaut: bounded objective or vowel-length guidance regressed");
}
if (topic("a0-satzbau").titleDe !== "Der einfache Aussagesatz: Verb auf Position 2"
  || exercise("a0-satzbau", "a0-satzbau-r141e-e04")?.promptDe !== "Welcher Satz ist richtig?"
  || !String(topic("a0-satzbau").summaryDe).includes("Subjekt oder ein anderes Satzglied")) {
  errors.push("a0-satzbau: reviewed V2 summary, title, or grammatical prompt regressed");
}

const currentText = JSON.stringify(review01.entries.map((entry) => entry.current));
for (const stale of [
  "وفي سويسرا تُكتب Straße",
  "Buchstabiere deinen Namen und deine Telefonnummer",
  "ch في sechs وacht هو ch حلقي",
  "Du kannst du sagen",
  "أول 20 اسماً",
  "أو جاء بعده حرف ساكن واحد",
  "دام vs دامـه",
  "Männer = مِنَر",
  "Welches Satz ist richtig?",
  "\"de\":\"✗ Z = «\"",
  "\"de\":\"✗ ie =\"",
]) {
  if (currentText.includes(stale)) {
    errors.push(`PA-036-01 stale, malformed, or overgeneralized content returned: ${stale}`);
  }
}

if (errors.length) {
  console.error("❌ Grammar content review audit failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  "✅ Grammar content review: all 8 bounded A0 full-topic decisions match (8 corrected, 0 confirmed-current).",
);
console.log(
  "ℹ️ This gate protects the reviewed A0 objectives, explanations, rules, examples, pitfalls, checks, exercises, and pronunciation guidance; 79 A1–B2 topics and independent linguistic, phonetic, CEFR, or exam sign-off remain outside this batch.",
);
