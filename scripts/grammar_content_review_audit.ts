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
const review04 = readJson<ReviewFixture>("scripts/fixtures/grammar-reviewed-04.json");
const review05 = readJson<ReviewFixture>("scripts/fixtures/grammar-reviewed-05.json");
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
const expectedB1 = new Set([
  "b1-konj2", "b1-relativ", "b1-konnektoren", "b1-plusquamperfekt",
  "b1-genitiv", "b1-adjektivendungen", "b1-wortbildung", "b1-unbestimmte",
  "b1-verb-praeposition", "b1-passiv", "b1-indirekte-fragen",
  "b1-funktionsverben", "b1-absicht", "b1-konj2-vergangenheit",
  "b1-pruefungsstrategie",
]);
const expectedB2 = new Set([
  "b2-indirekte-rede", "b2-partizip", "b2-bedingung", "b2-funktionsverben",
  "b2-infinitiv", "b2-modalpartikel", "b2-futur-ii",
  "b2-relativ-generalisierend", "b2-doppelkonnektoren", "b2-nominalstil",
  "b1-partizip1", "b2-redew", "b2-adjektiv-partizip",
  "b2-textkonnektoren", "b2-genitiv-praep", "b2-konzessiv",
  "b2-relativ-genitiv", "b2-pruefungsstrategie", "b2-n-deklination",
  "b2-passiv", "b2-konjunktiv2-vht", "b2-nominalisierung",
  "b2-partizipial",
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
validateBatch(review04, "PA-036-04", expectedB1, "B1", 15, 0);
validateBatch(review05, "PA-036-05", expectedB2, "B2", 23, 0);
const reviewedIds = [
  ...review01.entries, ...review02.entries, ...review03.entries,
  ...review04.entries, ...review05.entries,
].map((entry) => entry.id);
if (new Set(reviewedIds).size !== 87) {
  errors.push("PA-036 decision batches overlap or do not contain all 87 unique topics");
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

// PA-036-04: bounded B1 regression anchors.
if (!topic("b1-konj2").summaryAr.includes("صيغة würde + Infinitiv بديل شائع")
  || !String(exercise("b1-konj2", "g11e2")?.explanationAr).includes("Können Sie…? فهي أيضاً طلب صحيح")
  || !topic("b1-relativ").summaryAr.includes("حالته الإعرابية فتحددها وظيفته")) {
  errors.push("B1 Konjunktiv/relative clauses: Ersatzform, politeness, or antecedent/case boundary regressed");
}
if (!topic("b1-konnektoren").summaryAr.includes("يمكن أن يجتمع obwohl وtrotzdem")
  || !JSON.stringify(topic("b1-konnektoren").rules).includes("sodass leitet einen Folgesatz ein")
  || !topic("b1-plusquamperfekt").summaryAr.includes("المهم هو العلاقة الزمنية")
  || JSON.stringify(topic("b1-plusquamperfekt")).includes("indirekte Frage")) {
  errors.push("B1 connectors/past: concessive co-occurrence, result clause, event order, or scope regressed");
}
if (!topic("b1-genitiv").summaryAr.includes("von + Dativ فهو بديل معياري")
  || !JSON.stringify(topic("b1-genitiv").rules).includes("des Tages/des Tags")
  || !topic("b1-adjektivendungen").summaryAr.includes("ein guter Mann")
  || exercise("b1-adjektivendungen", "b1-adj-e11")?.answer !== "Ich helfe einem jungen Mann.") {
  errors.push("B1 Genitiv/adjectives: standard alternatives, -s/-es variation, or declension table/exercise regressed");
}
if (!topic("b1-wortbildung").summaryAr.includes("اختياره ليس قابلاً للتنبؤ دائماً")
  || exercise("b1-wortbildung", "b1-wortbildung-u1")?.answer !== "das Türschloss"
  || !topic("b1-unbestimmte").summaryAr.includes("Ich sehe jemanden/jemand")
  || String(verify("b1-unbestimmte", "b1-unbestimmte-v1")?.promptDe) !== "___ sagt: Übung macht den Meister.") {
  errors.push("B1 word formation/indefinites: lexical linking elements, neutral example, or case variants regressed");
}
if (!topic("b1-verb-praeposition").summaryAr.includes("لا باعتباره توقعاً مضموناً لامتحان")
  || !JSON.stringify(topic("b1-verb-praeposition").rules).includes("Worauf wartest du?")
  || !JSON.stringify(topic("b1-passiv").pitfalls).includes("zukünftigen Zustand ausdrücken")
  || !JSON.stringify(topic("b1-passiv").tables).includes("Dieses Wasser ist trinkbar")
  || JSON.stringify(topic("b1-passiv").tables).includes("Seine Sorge ist verständlich")) {
  errors.push("B1 prepositional verbs/passive: semantic mappings, claim boundary, future state, or Ersatzform scope regressed");
}
if (exercise("b1-indirekte-fragen", "b1-indir-n4")?.answer !== "Kannst du mir sagen, ob das Museum geöffnet ist?"
  || topic("b1-funktionsverben").regel === "Placeholder pending full authoring."
  || !JSON.stringify(topic("b1-funktionsverben").rules).includes("ليست كل FVG رسمية تلقائياً")
  || !topic("b1-absicht").summaryAr.includes("يمكن استعماله أيضاً مع الفاعل نفسه")) {
  errors.push("B1 indirect questions/FVG/purpose: punctuation, authored guidance, register, or damit boundary regressed");
}
if (!topic("b1-konj2-vergangenheit").summaryAr.includes("وفق الفعل المساعد في Perfekt")
  || !JSON.stringify(topic("b1-konj2-vergangenheit").examples).includes("Wäre er doch zu Hause geblieben!")
  || !topic("b1-pruefungsstrategie").titleDe.startsWith("Interne Prüfungsstrategie")
  || !topic("b1-pruefungsstrategie").summaryAr.includes("تختلف بنى امتحانات B1 الرسمية")
  || JSON.stringify(topic("b1-pruefungsstrategie")).includes("Goethe-/telc")) {
  errors.push("B1 past counterfactual/exam strategy: auxiliary, temporal examples, or provider-neutral boundary regressed");
}

// PA-036-05: bounded B2 regression anchors.
if (!topic("b2-indirekte-rede").summaryAr.includes("لا يثبت صدق القول أو كذبه")
  || String(exercise("b2-indirekte-rede", "g15e2")?.answer) !== "habe"
  || !topic("b2-partizip").summaryAr.includes("der angekommene Zug")
  || String(exercise("b2-partizip", "g16e3")?.answer) !== "wohnende") {
  errors.push("B2 indirect speech/participles: evidential boundary, Konjunktiv answer, or attributive semantics regressed");
}
if (!topic("b2-bedingung").summaryAr.includes("لا تفرض معادلة زمنية جامدة")
  || !topic("b2-funktionsverben").summaryAr.includes("أفضل دائماً أو مطابقاً تماماً")) {
  errors.push("B2 conditions/FVG: semantic tense pattern or lexicalized register boundary regressed");
}
if (!topic("b2-infinitiv").summaryAr.includes("قد يكون فاعلها")
  || !JSON.stringify(topic("b2-infinitiv").rules).includes("Komma ist bei um/ohne/anstatt zu")
  || !topic("b2-modalpartikel").summaryAr.includes("ليست نسباً رقمية ثابتة")
  || !JSON.stringify(topic("b2-modalpartikel").pitfalls).includes("doch einfach mal")) {
  errors.push("B2 infinitives/modal particles: control, comma, probability, or particle-order boundary regressed");
}
if (!topic("b2-futur-ii").summaryAr.includes("حدث ماضٍ")
  || !JSON.stringify(topic("b2-futur-ii").rules).includes("kein zukünftiger Zeitanker nötig")
  || !topic("b2-relativ-generalisierend").summaryAr.includes("إذا أدت جملة wer والجملة الرئيسية الوظيفة نفسها")
  || exercise("b2-relativ-generalisierend", "grge2")?.promptDe !== "___ früh übt, wird sicherer.") {
  errors.push("B2 Futur II/generalizing relatives: inference, time-anchor, correlative-case, or exercise repair regressed");
}
if (!topic("b2-doppelkonnektoren").summaryAr.includes("لا توجد قاعدة واحدة")
  || !String(exercise("b2-doppelkonnektoren", "gdke3")?.answer).includes("verschiebst")
  || !topic("b2-nominalstil").summaryAr.includes("ليست التحويلات آلية دائماً")
  || !JSON.stringify(topic("b2-nominalstil").tables).includes("مزيج محتمل")) {
  errors.push("B2 paired connectors/nominal style: syntax, coherent exercise, or contextual style boundary regressed");
}
if (!topic("b1-partizip1").summaryAr.includes("mit einem wartenden Gast")
  || exercise("b1-partizip1", "b1-partizip1-ex02")?.answer !== "laufenden"
  || !topic("b2-redew").summaryAr.includes("استعمال حرفي")
  || !JSON.stringify(topic("b2-redew").rules).includes("Das ist mir Wurst")) {
  errors.push("B2 Partizip-I/idioms: declension, unrelated item, literal reading, or register boundary regressed");
}
if (!topic("b2-adjektiv-partizip").summaryAr.includes("ليس دائماً مبنياً للمجهول")
  || !JSON.stringify(topic("b2-adjektiv-partizip").rules).includes("viele bekannte Schriftsteller")
  || !topic("b2-textkonnektoren").summaryAr.includes("أرقى تلقائياً")
  || exercise("b2-textkonnektoren", "b2-textkonnektoren-n7")?.answer !== "richtig") {
  errors.push("B2 adjectival participles/text connectors: semantic, declension, register, or position guidance regressed");
}
if (!topic("b2-genitiv-praep").summaryAr.includes("Dativ محكية أو إقليمية")
  || !topic("b2-konzessiv").summaryAr.includes("ولا يصبح المعنى تنازلياً")
  || !JSON.stringify(topic("b2-konzessiv").rules).includes("die konzessive Wirkung entsteht hier durch trotzdem")) {
  errors.push("B2 Genitiv prepositions/concession: variation or bei/trotzdem semantic boundary regressed");
}
if (!topic("b2-relativ-genitiv").summaryAr.includes("مذكر أو محايد")
  || verify("b2-relativ-genitiv", "b2-rg-v2-check")?.promptDe !== "Die Frau, ___ Kinder hier wohnen, arbeitet in einer Klinik."
  || !topic("b2-pruefungsstrategie").titleDe.startsWith("Interne Prüfungsstrategie")
  || !topic("b2-pruefungsstrategie").summaryAr.includes("تختلف بنية امتحانات B2 الرسمية")
  || JSON.stringify(topic("b2-pruefungsstrategie")).includes("120–180 Wörter")) {
  errors.push("B2 Genitiv relatives/exam strategy: antecedent classes, sentence repair, or provider-neutral boundary regressed");
}
if (!topic("b2-n-deklination").summaryAr.includes("تصريف مختلط")
  || !JSON.stringify(topic("b2-n-deklination").rules).includes("Herz ist kein schwaches Maskulinum")
  || !topic("b2-passiv").titleDe.includes("mehreren Zeitformen")
  || exercise("b2-passiv", "b2-passiv-e5")?.answer !== "Das Dach ist durch den Sturm zerstört worden."
  || String(exercise("b2-passiv", "b2-passiv-e6")?.answer) !== "wurde") {
  errors.push("B2 N-declension/passive: mixed patterns, Herz class, bounded tense scope, agent/cause, or exercise repair regressed");
}
if (!topic("b2-konjunktiv2-vht").summaryAr.includes("وفق Perfekt للفعل")
  || !JSON.stringify(topic("b2-konjunktiv2-vht").rules).includes("anderen Perspektiv- oder Zukunftskontexten")
  || !topic("b2-nominalisierung").summaryAr.includes("ليست تحويلاً آلياً")
  || String(exercise("b2-nominalisierung", "b2-nom-e8")?.answer) !== "Für"
  || !topic("b2-partizipial").summaryAr.includes("فعلاً سابقاً فاعلياً")
  || JSON.stringify(topic("b2-partizipial")).includes("Eigenhandlung")) {
  errors.push("B2 past counterfactual/nominalization/participles: auxiliary, würde boundary, restructuring, purpose, or semantic guidance regressed");
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
const currentTextB1 = JSON.stringify(review04.entries.map((entry) => entry.current));
for (const stale of [
  "Würde = كل شيء!", "ممنوع الجمع بين obwohl و trotzdem", "Plusquamperfekt + indirekte Frage",
  "von + Dativ يُرفض في الكتابة الأكاديمية والامتحان", "Adjektivendungen (Profis!) + N-Deklination",
  "Tür + Haus", "ones = أفراد", "فهذه الأسئلة مضمونة في كل امتحان", "على الجارّ",
  "Das Haus wird gebaut sein.“ ✗", "الفخ الأول للعرب", "Placeholder pending full authoring.",
  "In B1 erkennst und verstehst du", "وبالفاعلين المختلفين ← damit", "نفس تقسيم Perfekt: الحركة والتغيّر",
  "Goethe-/telc B1", "Lesen 65د", "ca. 100–120 Wörter",
]) {
  if (currentTextB1.includes(stale)) {
    errors.push(`PA-036-04 stale, malformed, or overgeneralized content returned: ${stale}`);
  }
}
const currentTextB2 = JSON.stringify(review05.entries.map((entry) => entry.current));
for (const stale of [
  "قد قالها فعلاً — لا رأيك", "B2 الاحترافي لا تستخدم dass", "Partizip II (= سلبي/منتهٍ دائماً)",
  "Real: Präsens → Präsens/Futur", "FVG دائمًا رسمي", "حتمًا نفس الفاعل", "نسبة يقين: 90–95%",
  "لا يزيد عددها عادةً عن اثنتين", "Zeitanker ضروري", "Singular: wer…der / Plural: wer…die",
  "الفعل يبقى في نفس الموضع في الجملتين", "في رسالة شخصية: تجنبه", "كل الكلمات المنتهية بـ -ung مؤنثة",
  "اقرأ سؤال الامتحان أولاً", "خطأ حرفي:", "موقع 2 دائماً", "bei + Dativ: bei Regen (رغم المطر)",
  "120–180 Wörter", "في Goethe B2 ثلاث دقائق للتحضير", "40 اسمًا مذكرًا ضعيفًا",
  "einzige N-Deklination im Neutrum", "würde في الماضي شفوي فقط", "Komma optional",
]) {
  if (currentTextB2.includes(stale)) {
    errors.push(`PA-036-05 stale, malformed, or overgeneralized content returned: ${stale}`);
  }
}

if (errors.length) {
  console.error("❌ Grammar content review audit failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  "✅ Grammar content review: all 87 bounded A0–B2 full-topic decisions match (80 corrected, 7 confirmed-current).",
);
console.log(
  "ℹ️ This gate protects all reviewed grammar objectives, explanations, rules, tables, examples, pitfalls, checks, exercises, pronunciation guidance, and internal exam-strategy boundaries; independent linguistic, phonetic, CEFR, or exam sign-off remains outside these batches.",
);
