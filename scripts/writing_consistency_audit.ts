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
  rationale?: string;
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
const review03 = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "scripts", "fixtures", "writing-reviewed-03.json"), "utf8"),
) as WritingReviewFixture;
const review04 = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "scripts", "fixtures", "writing-reviewed-04.json"), "utf8"),
) as WritingReviewFixture;
const review05 = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "scripts", "fixtures", "writing-reviewed-05.json"), "utf8"),
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

const review03Ids = new Set(review03.entries.map((entry) => entry.id));
const review03Corrected = review03.entries.filter((entry) => entry.decision === "corrected");
const review03Confirmed = review03.entries.filter((entry) => entry.decision === "confirmed-current");
if (review03.schema !== "wegb2-reviewed-writing-decision-batch-v1"
  || review03.batch !== "PA-035-03"
  || review03.entries.length !== 20
  || review03Ids.size !== 20
  || review03Corrected.length !== 18
  || review03Confirmed.length !== 2
  || review03.entries.some((entry) => entry.level !== "A2" || !entry.rationale?.trim())) {
  errors.push(
    `unexpected PA-035-03 fixture scope/counts: ${review03.schema}/${review03.batch}/${review03.entries.length}/${review03Ids.size}/${review03Corrected.length}/${review03Confirmed.length}`,
  );
}
if (!review03.scope.includes("triage only")
  || !review03.scope.includes("not correction generators")
  || !review03.scope.includes("not independent linguistic, exam, or CEFR sign-off")) {
  errors.push("PA-035-03 fixture must preserve its triage and external-sign-off claim boundary");
}
for (const entry of review03.entries) {
  const actual = byId.get(entry.id);
  if (!actual) {
    errors.push(`missing PA-035-03 writing task ${entry.id}`);
    continue;
  }
  if (actual.level !== "A2"
    || entry.previous.id !== entry.id
    || entry.current.id !== entry.id
    || entry.previous.level !== "A2"
    || entry.current.level !== "A2"
    || JSON.stringify(actual) !== JSON.stringify(entry.current)) {
    errors.push(`${entry.id}: PA-035-03 identity or reviewed task content drifted`);
  }
  if (entry.decision === "corrected" && JSON.stringify(entry.previous) === JSON.stringify(entry.current)) {
    errors.push(`${entry.id}: corrected PA-035-03 decision has no change`);
  }
  if (entry.decision === "confirmed-current" && JSON.stringify(entry.previous) !== JSON.stringify(entry.current)) {
    errors.push(`${entry.id}: confirmed-current PA-035-03 decision changes the task`);
  }
  const target = entry.current.zielWort;
  if (!target) {
    errors.push(`${entry.id}: PA-035-03 task has no internal word target`);
  } else {
    const ratio = words(entry.current.sample) / target;
    if (ratio < 0.8 || ratio > 1.2) {
      errors.push(
        `${entry.id}: PA-035-03 sample has ${words(entry.current.sample)} words for target ${target} (${(ratio * 100).toFixed(1)}%)`,
      );
    }
    const arabicTarget = entry.current.taskAr?.match(/الهدف:\s*(\d+)\s*كلمة/);
    if (arabicTarget && Number(arabicTarget[1]) !== target) {
      errors.push(`${entry.id}: Arabic target ${arabicTarget[1]} does not match zielWort ${target}`);
    }
  }
  const range = sentenceRange(entry.current.taskDe);
  if (range) {
    const actualMarks = sentenceMarks(entry.current.sample);
    if (actualMarks < range[0] || actualMarks > range[1]) {
      errors.push(`${entry.id}: PA-035-03 sample has ${actualMarks} sentence marks; expected ${range.join("–")}`);
    }
  }
}
const a2Guard03 = JSON.stringify(review03.entries.map((entry) => entry.current));
if (requireTask("w-a2-01").zielWort !== 40
  || requireTask("w-a2-02").zielWort !== 60
  || requireTask("w-a2-11").zielWort !== 80
  || requireTask("w-a2-04").sample.includes("Soll ich zum Arzt kommen")
  || !requireTask("w-a2-05").sample.includes("Bring bitte einen Salat mit")
  || !requireTask("w-a2-07").sample.includes("Donnerstag um 17 Uhr")
  || requireTask("w-a2-10").sample.includes("einen Termin machen")
  || !requireTask("w-a2-13").sample.includes("Ich bin viel geschwommen")
  || !requireTask("w-a2-17").sample.includes("leider absagen")
  || !requireTask("w-a2-18").sample.includes("Passt dir das?")
  || !requireTask("w-a2-19").sample.includes("erstatten Sie mir den Kaufpreis")
  || !requireTask("w-a2-20").sample.includes("Ich interessiere mich sehr für die Wohnung")) {
  errors.push("PA-035-03 guarded target, task/model, register, or naturalness corrections regressed");
}
for (const stale of [
  "habe geschwommen",
  "Mit freundlichen Grüßen,",
  "Viele Grüße,",
  "Herzliche Grüße,",
  "feiere…! / Bring bitte",
  "مرتان Perfekt (bin…gefahren / war)",
  "حرفٌ واحد يُصلح ما يفسده الجميع",
]) {
  if (a2Guard03.includes(stale)) {
    errors.push(`PA-035-03 stale, malformed, or unsupported text returned: ${stale}`);
  }
}

const review04Ids = new Set(review04.entries.map((entry) => entry.id));
const review04Corrected = review04.entries.filter((entry) => entry.decision === "corrected");
const review04Confirmed = review04.entries.filter((entry) => entry.decision === "confirmed-current");
if (review04.schema !== "wegb2-reviewed-writing-decision-batch-v1"
  || review04.batch !== "PA-035-04"
  || review04.entries.length !== 27
  || review04Ids.size !== 27
  || review04Corrected.length !== 22
  || review04Confirmed.length !== 5
  || review04.entries.some((entry) => entry.level !== "B1" || !entry.rationale?.trim())) {
  errors.push(
    `unexpected PA-035-04 fixture scope/counts: ${review04.schema}/${review04.batch}/${review04.entries.length}/${review04Ids.size}/${review04Corrected.length}/${review04Confirmed.length}`,
  );
}
if (!review04.scope.includes("triage only")
  || !review04.scope.includes("not correction generators")
  || !review04.scope.includes("not independent linguistic, exam, or CEFR sign-off")) {
  errors.push("PA-035-04 fixture must preserve its triage and external-sign-off claim boundary");
}
for (const entry of review04.entries) {
  const actual = byId.get(entry.id);
  if (!actual) {
    errors.push(`missing PA-035-04 writing task ${entry.id}`);
    continue;
  }
  if (actual.level !== "B1"
    || entry.previous.id !== entry.id
    || entry.current.id !== entry.id
    || entry.previous.level !== "B1"
    || entry.current.level !== "B1"
    || JSON.stringify(actual) !== JSON.stringify(entry.current)) {
    errors.push(`${entry.id}: PA-035-04 identity or reviewed task content drifted`);
  }
  if (entry.decision === "corrected" && JSON.stringify(entry.previous) === JSON.stringify(entry.current)) {
    errors.push(`${entry.id}: corrected PA-035-04 decision has no change`);
  }
  if (entry.decision === "confirmed-current" && JSON.stringify(entry.previous) !== JSON.stringify(entry.current)) {
    errors.push(`${entry.id}: confirmed-current PA-035-04 decision changes the task`);
  }
  const target = entry.current.zielWort;
  if (!target) {
    errors.push(`${entry.id}: PA-035-04 task has no internal word target`);
  } else {
    const ratio = words(entry.current.sample) / target;
    if (ratio < 0.8 || ratio > 1.2) {
      errors.push(
        `${entry.id}: PA-035-04 sample has ${words(entry.current.sample)} words for target ${target} (${(ratio * 100).toFixed(1)}%)`,
      );
    }
  }
  const range = sentenceRange(entry.current.taskDe);
  if (range) {
    const actualMarks = sentenceMarks(entry.current.sample);
    if (actualMarks < range[0] || actualMarks > range[1]) {
      errors.push(`${entry.id}: PA-035-04 sample has ${actualMarks} sentence marks; expected ${range.join("–")}`);
    }
  }
}
const b1Guard04 = JSON.stringify(review04.entries.map((entry) => entry.current));
if (!requireTask("w-b1-02").sample.includes("bewerbe ich mich um die Stelle")
  || requireTask("w-b1-04").sample.includes("70 Prozent")
  || requireTask("w-b1-05").zielWort !== 100
  || !requireTask("w-b1-05").taskDe.includes("ca. 100 Wörter")
  || requireTask("w-b1-06").sample.includes("Gehirn im Schlaf")
  || requireTask("w-b1-06").sample.includes("ohne dass ihr müsst")
  || !requireTask("w-b1-07").taskAr?.includes("علّل رأيك بحجّتين")
  || !requireTask("w-b1-10").sample.includes("für sie gehörte Pünktlichkeit")
  || requireTask("w-b1-15").sample.includes("Noten oft schlechter")
  || !requireTask("w-b1-16").sample.includes("In meiner Heimatstadt in Tunesien")
  || !requireTask("w-b1-20").sample.includes("zehn Minuten miteinander sprechen")
  || !requireTask("w-b1-22").sample.endsWith("Liebe Grüße\nSami")
  || !requireTask("w-b1-25").criteria.includes("طلب رد كتابي ضمن مهلة واضحة")
  || !requireTask("w-b1-26").sample.includes("Parkgebühren")
  || !requireTask("w-b1-27").sample.includes("Haus!\n\nWir sind")) {
  errors.push("PA-035-04 guarded target, factual-boundary, register, layout, or naturalness corrections regressed");
}
for (const stale of [
  "Mit freundlichen Grüßen,",
  "70 Prozent würden",
  "so lernt das Gehirn im Schlaf",
  "dann akzeptieren sie alle",
  "Dein Freund Sami Nächstes Mal",
  "experience شخصية",
  "نموذج امتحان B1 الكتابي",
]) {
  if (b1Guard04.includes(stale)) {
    errors.push(`PA-035-04 stale, malformed, or unsupported text returned: ${stale}`);
  }
}

const review05Ids = new Set(review05.entries.map((entry) => entry.id));
const review05Corrected = review05.entries.filter((entry) => entry.decision === "corrected");
const review05Confirmed = review05.entries.filter((entry) => entry.decision === "confirmed-current");
const expectedB2Ids = new Set([
  ...Array.from({ length: 28 }, (_, index) => `w-b2-${String(index + 1).padStart(2, "0")}`),
  ...Array.from({ length: 5 }, (_, index) => `w-b2-${index + 41}`),
]);
if (review05.schema !== "wegb2-reviewed-writing-decision-batch-v1"
  || review05.batch !== "PA-035-05"
  || review05.entries.length !== 33
  || review05Ids.size !== 33
  || [...expectedB2Ids].some((id) => !review05Ids.has(id))
  || review05Corrected.length !== 33
  || review05Confirmed.length !== 0
  || review05.entries.some((entry) => entry.level !== "B2" || !entry.rationale?.trim())) {
  errors.push(
    `unexpected PA-035-05 fixture scope/counts: ${review05.schema}/${review05.batch}/${review05.entries.length}/${review05Ids.size}/${review05Corrected.length}/${review05Confirmed.length}`,
  );
}
if (!review05.scope.includes("triage only")
  || !review05.scope.includes("not correction generators")
  || !review05.scope.includes("not independent linguistic, exam, or CEFR sign-off")) {
  errors.push("PA-035-05 fixture must preserve its triage and external-sign-off claim boundary");
}
for (const entry of review05.entries) {
  const actual = byId.get(entry.id);
  if (!actual) {
    errors.push(`missing PA-035-05 writing task ${entry.id}`);
    continue;
  }
  if (actual.level !== "B2"
    || entry.previous.id !== entry.id
    || entry.current.id !== entry.id
    || entry.previous.level !== "B2"
    || entry.current.level !== "B2"
    || JSON.stringify(actual) !== JSON.stringify(entry.current)) {
    errors.push(`${entry.id}: PA-035-05 identity or reviewed task content drifted`);
  }
  if (entry.decision !== "corrected" || JSON.stringify(entry.previous) === JSON.stringify(entry.current)) {
    errors.push(`${entry.id}: PA-035-05 corrected decision has no change or unexpected status`);
  }
  const target = entry.current.zielWort;
  if (!target) {
    errors.push(`${entry.id}: PA-035-05 task has no internal word target`);
  } else {
    const actualWords = words(entry.current.sample);
    const ratio = actualWords / target;
    if (ratio < 0.8 || ratio > 1.2) {
      errors.push(
        `${entry.id}: PA-035-05 sample has ${actualWords} words for target ${target} (${(ratio * 100).toFixed(1)}%)`,
      );
    }
  }
}
const b2Guard05 = JSON.stringify(review05.entries.map((entry) => entry.current));
if (!requireTask("w-b2-02").sample.includes("Interesse an der ausgeschriebenen Stelle bekunden")
  || !requireTask("w-b2-02").sample.endsWith("Mit freundlichen Grüßen\nAmina Mansour")
  || !requireTask("w-b2-06").sample.includes("Demzufolge waren sich die Beteiligten")
  || !requireTask("w-b2-07").sample.endsWith("Mit freundlichen Grüßen\nLayla Haddad")
  || !requireTask("w-b2-16").sample.startsWith("Ich bin dafür, soziale Medien grundsätzlich erst ab 16 Jahren")
  || !requireTask("w-b2-19").sample.endsWith("Mit freundlichen Grüßen\nKarim Benali")
  || !requireTask("w-b2-20").sample.endsWith("Mit freundlichen Grüßen\nSara Amri")
  || !requireTask("w-b2-21").sample.endsWith("Vielen Dank und herzliche Grüße\nOmar Haddad")
  || words(requireTask("w-b2-23").sample) < 150
  || !requireTask("w-b2-41").sample.includes("die Vorgaben seien")
  || !requireTask("w-b2-42").sample.includes("weil sie sehr kurzfristig eingeführt wurde")
  || !requireTask("w-b2-43").sample.includes("Dinge ersetzt werden")
  || !requireTask("w-b2-44").sample.endsWith("Mit freundlichen Grüßen\nNora Al-Hadi")
  || !requireTask("w-b2-45").sample.endsWith("gemeinsam wahrnehmen?")) {
  errors.push("PA-035-05 guarded factual-boundary, register, layout, task, or model corrections regressed");
}
for (const stale of [
  "sechzig Prozent der Lehrkräfte",
  "viele Produktivitätsstudien",
  "viele Studien zeigen",
  "Die Forschung zeigt zugleich",
  "Schulen berichten außerdem",
  "Erfahrungen aus anderen Städten zeigen",
  "Diese Darstellung, so die Mieterin, sei irreführend",
  "Das Gespräch bietet zudem die Chance",
  "Diese Entwicklung verdient mehr Aufmerksamkeit",
  "غوته B2 الكتابة",
  "telc-Format",
  "صيغة telc",
]) {
  if (b2Guard05.includes(stale)) {
    errors.push(`PA-035-05 stale, malformed, unsupported, or externally attributed text returned: ${stale}`);
  }
}

if (errors.length) {
  console.error("❌ Writing consistency audit failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  "✅ Writing consistency: 42 registered findings remain fixed; all 105 bounded A0/A1/A2/B1/B2 full-card decisions match (90 corrected, 15 confirmed-current).",
);
console.log(
  "ℹ️ This gate checks reviewed targets, sample length, sentence count, task/Arabic/criterion/model/note alignment, and identity decisions; it does not provide independent linguistic, exam, or CEFR sign-off.",
);
