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
  tables: Record<string, unknown>[];
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

const readJson = <T>(relativePath: string): T => JSON.parse(
  fs.readFileSync(path.join(process.cwd(), relativePath), "utf8"),
) as T;
const grammar = readJson<Record<string, GrammarTopic>>("content/grammar.json");
const review01 = readJson<ReviewFixture>("scripts/fixtures/grammar-reviewed-01.json");
const review02 = readJson<ReviewFixture>("scripts/fixtures/grammar-reviewed-02.json");
const review03 = readJson<ReviewFixture>("scripts/fixtures/grammar-reviewed-03.json");
const errors: string[] = [];
const expectedA0 = new Set([
  "a0-begrussung", "a0-buchstaben", "a0-zahlen", "a0-artikel",
  "a0-du-sie", "a0-aussprache-vowels", "a0-aussprache-umlaut", "a0-satzbau",
]);
const expectedA1 = new Set([
  "a1-sein-haben", "a1-pronomen", "a1-praesens", "a1-trennbar", "a1-zahlen",
  "a1-akkusativ", "a1-modalverben", "a1-dativ", "a1-wechsel", "a1-imperativ",
  "a1-perfekt-einf", "a1-war-hatte", "a1-plural", "a1-zeitpraep",
  "a1-aussprache-ch", "a1-aussprache-r", "a1-aussprache-sp-st",
  "a1-aussprache-auslaut", "a1-pruefungsstrategie",
]);
const expectedA2 = new Set([
  "a2-praeteritum", "a2-perfekt", "a2-weil-dass", "a2-wechsel", "a2-modal",
  "a2-dativ", "a2-negation", "a2-imperativ", "a2-reflexiv", "a2-steigerung",
  "a2-futur", "a1-futur-einf", "a2-praeteritum-grund", "a2-konj2-hoflich",
  "a2-verb-praep", "a2-adjektiv-einfach", "a1-weil-dass", "a2-verschmolzene",
  "a2-neben", "a2-demo", "a2-wasfuer", "a2-pruefungsstrategie",
]);

const validateBatch = (
  fixture: ReviewFixture,
  batch: string,
  expectedIds: Set<string>,
  level: string,
  expectedCorrected: number,
  expectedConfirmed: number,
): void => {
  const ids = new Set(fixture.entries.map((entry) => entry.id));
  const corrected = fixture.entries.filter((entry) => entry.decision === "corrected");
  const confirmed = fixture.entries.filter((entry) => entry.decision === "confirmed-current");
  if (fixture.schema !== "wegb2-reviewed-grammar-decision-batch-v1"
    || fixture.batch !== batch
    || fixture.entries.length !== expectedIds.size
    || ids.size !== expectedIds.size
    || [...expectedIds].some((id) => !ids.has(id))
    || corrected.length !== expectedCorrected
    || confirmed.length !== expectedConfirmed
    || fixture.entries.some((entry) => entry.level !== level || !entry.rationale.trim())) {
    errors.push(
      `${batch}: unexpected fixture scope/counts: ${fixture.schema}/${fixture.batch}/${fixture.entries.length}/${ids.size}/${corrected.length}/${confirmed.length}`,
    );
  }
  if (!fixture.scope.includes("triage only")
    || !fixture.scope.includes("not correction generators")
    || !fixture.scope.includes("not independent linguistic, phonetic, CEFR, or exam sign-off")) {
    errors.push(`${batch}: fixture must preserve its triage and external-sign-off claim boundary`);
  }

  for (const entry of fixture.entries) {
    const actual = grammar[entry.id];
    if (!actual) {
      errors.push(`${batch}: missing grammar topic ${entry.id}`);
      continue;
    }
    if (actual.id !== entry.id
      || actual.level !== level
      || entry.previous.id !== entry.id
      || entry.current.id !== entry.id
      || entry.previous.level !== level
      || entry.current.level !== level
      || JSON.stringify(actual) !== JSON.stringify(entry.current)) {
      errors.push(`${entry.id}: ${batch} identity or reviewed full-topic content drifted`);
    }
    const changed = JSON.stringify(entry.previous) !== JSON.stringify(entry.current);
    if ((entry.decision === "corrected" && !changed)
      || (entry.decision === "confirmed-current" && changed)) {
      errors.push(`${entry.id}: ${batch} decision does not match its bounded transition`);
    }
  }
};

if (Object.keys(grammar).length !== 87) {
  errors.push(`grammar topic count drifted: ${Object.keys(grammar).length} instead of 87`);
}
validateBatch(review01, "PA-036-01", expectedA0, "A0", 8, 0);
validateBatch(review02, "PA-036-02", expectedA1, "A1", 16, 3);
validateBatch(review03, "PA-036-03", expectedA2, "A2", 18, 4);
const reviewedIds = [...review01.entries, ...review02.entries, ...review03.entries]
  .map((entry) => entry.id);
if (new Set(reviewedIds).size !== 49) {
  errors.push("PA-036 decision batches overlap or do not contain 49 unique topics");
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

// PA-036-01: bounded A0 regression anchors.
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

// PA-036-02: bounded A1 regression anchors.
if (topic("a1-sein-haben").titleAr.includes("sein (يكون)")
  || !topic("a1-sein-haben").summaryAr.includes("الهوية أو الصفة أو الحالة")) {
  errors.push("a1-sein-haben: bounded identity/state gloss regressed");
}
if (!topic("a1-pronomen").pitfalls.some((item) => JSON.stringify(item).includes("لا يعني ذلك"))
  || !String(exercise("a1-pronomen", "g2e2")?.promptAr).includes("ضمير الغائب الشخصي")) {
  errors.push("a1-pronomen: Dativ scope or personal-pronoun terminology regressed");
}
if (String((topic("a1-praesens").anwendung as Record<string, unknown>).de).includes("؟")
  || !JSON.stringify(topic("a1-praesens").tables).includes("مكان الوجود أو وقوع الحدث")) {
  errors.push("a1-praesens: German punctuation or Wo semantic boundary regressed");
}
if (!String(exercise("a1-zahlen", "g5e3")?.promptAr).includes("halb acht")
  || String(exercise("a1-zahlen", "g5e3")?.promptAr).includes("الثامنة والنصف")) {
  errors.push("a1-zahlen: halb acht Arabic prompt regressed");
}
if (!String(verify("a1-akkusativ", "a1-akkusativ-v2")?.darfNicht).includes("ein stuhl")
  || !String(exercise("a1-akkusativ", "g6e2")?.promptAr).includes("المؤنث Wohnung")) {
  errors.push("a1-akkusativ: Stuhl guard or feminine Wohnung prompt regressed");
}
if (!String(exercise("a1-modalverben", "a1-modalverben-ex02")?.explanationAr).includes("الضرورة أو الواجب")
  || !String(exercise("a1-modalverben", "a1-modalverben-ex03")?.explanationAr).includes("تطابق المصدر شكلاً")) {
  errors.push("a1-modalverben: müssen meaning or wir conjugation explanation regressed");
}
if (!topic("a1-dativ").ziel.includes("aus/nach/von/seit")
  || !topic("a1-dativ").summaryAr.includes("-n أو -s")) {
  errors.push("a1-dativ: reviewed preposition scope or plural-n boundary regressed");
}
if (!String(exercise("a1-imperativ", "a1-imperativ-ex01")?.explanationAr).includes("Bitte في البداية")
  || !JSON.stringify(topic("a1-imperativ").pitfalls).includes("(du)")) {
  errors.push("a1-imperativ: Bitte/Sie order or du scope regressed");
}
if (!topic("a1-perfekt-einf").titleAr.includes("صيغة Perfekt")
  || !JSON.stringify(topic("a1-perfekt-einf").anwendung).includes("Gestern habe ich")) {
  errors.push("a1-perfekt-einf: Perfekt label or yesterday model regressed");
}
if (!JSON.stringify(topic("a1-war-hatte").anwendung).includes("أحد جدّيك أو عن جدّيك")
  || JSON.stringify(topic("a1-plural")).includes("Kind ليست دخيلة")) {
  errors.push("A1 past/plural production scope or plural inference regressed");
}
if (exercise("a1-aussprache-ch", "a1-aussprache-ch-r141e-prod2")?.promptDe !== "Das ___ ist neu. (ch nach u)"
  || !topic("a1-aussprache-ch").summaryAr.includes("/ç/")
  || !topic("a1-aussprache-ch").summaryAr.includes("/x/")) {
  errors.push("a1-aussprache-ch: Das Buch or IPA/articulation boundary regressed");
}
if (!topic("a1-aussprache-r").summaryAr.includes("تنوعات مقبولة")
  || !String(verify("a1-aussprache-r", "a1-ar-v1-check")?.answer).includes("[ɐ]")) {
  errors.push("a1-aussprache-r: accepted variants or unstressed -er scope regressed");
}
const spOptions = exercise("a1-aussprache-sp-st", "a1-aussprache-sp-st-r141e-e02")?.options;
if (!Array.isArray(spOptions)
  || new Set(spOptions).size !== 4
  || exercise("a1-aussprache-sp-st", "a1-aussprache-sp-st-r141e-e02")?.answer !== "/ʃp/"
  || !topic("a1-aussprache-sp-st").tables.every((table) => JSON.stringify(table).includes("/"))) {
  errors.push("a1-aussprache-sp-st: IPA table or unique MC choices regressed");
}
if (!topic("a1-aussprache-auslaut").summaryAr.includes("b/d/g")
  || String(exercise("a1-aussprache-auslaut", "a1-aussprache-auslaut-r141e-e03")?.options).includes("Hund")
  || exercise("a1-aussprache-auslaut", "a1-aussprache-auslaut-r141e-e03")?.answer !== "Tag → [taːk]") {
  errors.push("a1-aussprache-auslaut: bounded devoicing or single-answer MC regressed");
}
if (!topic("a1-pruefungsstrategie").titleDe.startsWith("Interne Prüfungsstrategie")
  || !topic("a1-pruefungsstrategie").summaryAr.includes("لا تُعامل هذه الصفحة مصدراً رسمياً")
  || JSON.stringify(topic("a1-pruefungsstrategie")).includes("30 Wörter")) {
  errors.push("a1-pruefungsstrategie: internal scope or removal of unverified official numbers regressed");
}

// PA-036-03: bounded A2 regression anchors.
if (!topic("a2-praeteritum").summaryAr.includes("لا على تقسيم مطلق")
  || !JSON.stringify(topic("a2-praeteritum").tables).includes("Perfekt أو Präteritum")
  || !topic("a2-perfekt").summaryAr.includes("لا تكفي كلمة «حركة»")
  || !JSON.stringify(topic("a2-perfekt").tables).includes("studieren → studiert")) {
  errors.push("A2 past: reviewed register split, auxiliary boundary, or participle patterns regressed");
}
if (!topic("a2-weil-dass").summaryAr.includes("استعمالات محكية مخصوصة")
  || !JSON.stringify(topic("a2-weil-dass").rules).includes("Modalverb + Infinitiv")
  || !JSON.stringify(topic("a2-wechsel").rules).includes("entlang steht nach dem Nomen meist mit Akkusativ")
  || !String(verify("a2-wechsel", "a2-wechsel-v1")?.promptDe).includes("von draußen")) {
  errors.push("A2 clauses/location: standard-clause or destination/case boundary regressed");
}
if (!JSON.stringify(topic("a2-modal").anwendung).includes("konnte/musste/sollte/wollte/durfte")
  || verify("a2-modal", "a2-modal-v2")?.answer !== "Du musstest gestern lange arbeiten."
  || !JSON.stringify(topic("a2-dativ").pitfalls).includes("beide grammatisch")
  || !topic("a2-dativ").summaryAr.includes("ليس كل Dativ")) {
  errors.push("A2 modal/Dativ: aligned past production or complement/order boundary regressed");
}
if (!topic("a2-negation").summaryAr.includes("نطاق النفي")
  || !JSON.stringify(topic("a2-negation").pitfalls).includes("kontrastiver Korrektur")
  || !topic("a2-imperativ").summaryAr.includes("Arbeite!")
  || !String(verify("a2-imperativ", "a2-imperativ-v2")?.alternativen).includes("Rufe")) {
  errors.push("A2 negation/imperative: scope-sensitive nicht or valid imperative variants regressed");
}
if (verify("a2-reflexiv", "a2-reflexiv-v2")?.promptDe !== "Formuliere den Satz ausdrücklich reflexiv."
  || !JSON.stringify(topic("a2-reflexiv").pitfalls).includes("mir/dir/sich/uns/euch/sich")
  || !JSON.stringify(topic("a2-steigerung").examples).includes("Heute ist es kälter")
  || !topic("a2-steigerung").summaryAr.includes("لا تكفي قاعدة إضافة واحدة")) {
  errors.push("A2 reflexive/comparison: optional reflexive, body-part Dativ, or bounded comparison regressed");
}
if (!JSON.stringify(topic("a2-futur").pitfalls).includes("Ich werde müde“ ist korrekt")
  || topic("a2-praeteritum-grund").titleDe !== "Präteritum von sein und haben: war und hatte"
  || !JSON.stringify(topic("a2-praeteritum-grund").pitfalls).includes("Ich bin krank gewesen")
  || String(topic("a2-praeteritum-grund").titleDe).includes("Modalverben")) {
  errors.push("A2 werden/war-hatte: lexical werden or bounded past-form scope regressed");
}
if (!JSON.stringify(topic("a2-konj2-hoflich").pitfalls).includes("ist eine korrekte Bitte")
  || String(topic("a2-konj2-hoflich").pronTippAr) !== ""
  || !JSON.stringify(topic("a2-verb-praep").rules).includes("leiden an + Dativ")
  || String(topic("a2-verb-praep").pronTippAr) !== "") {
  errors.push("A2 politeness/prepositions: register boundary, complete inventory, or unsupported respelling regressed");
}
if (!topic("a2-adjektiv-einfach").summaryAr.includes("Akkusativ المذكر")
  || exercise("a2-verschmolzene", "a2-versch-n2")?.promptDe !== "Gehst du mit ___ Meer? (an + das)"
  || !JSON.stringify(topic("a2-demo").pitfalls).includes("temporaler Akkusativ")
  || topic("a2-demo").titleDe !== "Begleiter: dieser/jeder/alle") {
  errors.push("A2 adjective/contraction/determiner: endings, ans Meer, or Jeden Tag boundary regressed");
}
if (!topic("a2-pruefungsstrategie").titleDe.startsWith("Interne Prüfungsstrategie")
  || !topic("a2-pruefungsstrategie").summaryAr.includes("لا تُعامل هذه الصفحة مصدراً رسمياً")
  || JSON.stringify(topic("a2-pruefungsstrategie")).includes("Goethe")
  || JSON.stringify(topic("a2-pruefungsstrategie")).includes("100 + 100")) {
  errors.push("a2-pruefungsstrategie: internal scope or removal of unverified provider claims regressed");
}

const currentTextA0 = JSON.stringify(review01.entries.map((entry) => entry.current));
for (const stale of [
  "وفي سويسرا تُكتب Straße", "Buchstabiere deinen Namen und deine Telefonnummer",
  "ch في sechs وacht هو ch حلقي", "Du kannst du sagen", "أول 20 اسماً",
  "أو جاء بعده حرف ساكن واحد", "دام vs دامـه", "Männer = مِنَر",
  "Welches Satz ist richtig?", "\"de\":\"✗ Z = «\"", "\"de\":\"✗ ie =\"",
]) {
  if (currentTextA0.includes(stale)) {
    errors.push(`PA-036-01 stale, malformed, or overgeneralized content returned: ${stale}`);
  }
}
const currentTextA1 = JSON.stringify(review02.entries.map((entry) => entry.current));
for (const stale of [
  "sein = يكون/يوجد", "ضمير الإشارة للمحايد", "شكل المفعول به المذكر بعد suchen",
  "الإجبار = müssen", "الماضي التام (أفعال منتظمة", "Kind ليست دخيلة", "Der ___ ist neu. (ch nach u)",
  "schwaches a (Vata)", "Schprache", "ʃp نعم", "Tag = تاك", "60 دقيقة", "30 Wörter",
  "Hören 20 Min", "Sprechen 15 Min",
]) {
  if (currentTextA1.includes(stale)) {
    errors.push(`PA-036-02 stale, malformed, or overgeneralized content returned: ${stale}`);
  }
}
const currentTextA2 = JSON.stringify(review03.entries.map((entry) => entry.current));
for (const stale of [
  "gesprochen → Perfekt, geschrieben → Präteritum", "entlang + Dativ",
  "laufen = حركة ← Akkusativ", "اكتب أمنياتك الثلاث", "„Ich gebe das Buch meinem Bruder.“ ✗",
  "„Ich kenne nicht diesen Mann.“ ✗", "„Ich werde müde.“ ✗",
  "Präteritum von sein, haben, werden und Modalverben", "✗ Können Sie mir helfen?",
  "über بحرف ü ممدود «يوبا»", "في B2 يصبح استخدامها واجباً", "Gehst du mit ___ Strand",
  "✗ Jeden Tag gehe ich", "Goethe A2", "100 + 100",
]) {
  if (currentTextA2.includes(stale)) {
    errors.push(`PA-036-03 stale, malformed, or overgeneralized content returned: ${stale}`);
  }
}

if (errors.length) {
  console.error("❌ Grammar content review audit failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  "✅ Grammar content review: all 49 bounded A0–A2 full-topic decisions match (42 corrected, 7 confirmed-current).",
);
console.log(
  "ℹ️ This gate protects the reviewed A0–A2 objectives, explanations, rules, tables, examples, pitfalls, checks, exercises, pronunciation guidance, and internal exam-strategy boundary; 38 B1–B2 topics and independent linguistic, phonetic, CEFR, or exam sign-off remain outside these batches.",
);
