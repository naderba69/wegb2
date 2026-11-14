import fs from "node:fs";
import path from "node:path";

type VocabCard = {
  id?: string;
  de?: string;
  level?: string;
  posInfo?: string;
};

type VocabDeck = {
  level?: string;
  cards?: VocabCard[];
};

type ReviewEntry = Required<Pick<VocabCard, "id" | "de" | "posInfo">> & {
  deck?: string;
  level?: string;
  previousPosInfo?: string;
  decision?: "corrected" | "confirmed-current";
};

type ReviewFixture = {
  schema: string;
  batch?: string;
  reviewedAt: string;
  scope: string;
  entries: ReviewEntry[];
};

const root = process.cwd();
const vocab = JSON.parse(
  fs.readFileSync(path.join(root, "content", "vocab.json"), "utf8"),
) as Record<string, VocabDeck>;
const fixturePaths = [
  "vocab-posinfo-reviewed.json",
  "vocab-posinfo-reviewed-02.json",
  "vocab-posinfo-reviewed-03.json",
  "vocab-posinfo-reviewed-04.json",
  "vocab-posinfo-reviewed-05.json",
  "vocab-posinfo-reviewed-06.json",
  "vocab-posinfo-reviewed-07.json",
  "vocab-posinfo-reviewed-08.json",
  "vocab-posinfo-reviewed-09.json",
  "vocab-posinfo-reviewed-10.json",
  "vocab-posinfo-reviewed-11.json",
  "vocab-posinfo-reviewed-12.json",
  "vocab-posinfo-reviewed-13.json",
];
const fixtures = fixturePaths.map((name) => JSON.parse(
  fs.readFileSync(path.join(root, "scripts", "fixtures", name), "utf8"),
) as ReviewFixture);

const errors: string[] = [];
const [
  firstFixture,
  secondFixture,
  thirdFixture,
  fourthFixture,
  fifthFixture,
  sixthFixture,
  seventhFixture,
  eighthFixture,
  ninthFixture,
  tenthFixture,
  eleventhFixture,
  twelfthFixture,
  thirteenthFixture,
] = fixtures;
if (firstFixture.schema !== "wegb2-reviewed-vocab-posinfo-v1"
  || firstFixture.entries.length !== 110) {
  errors.push(`unexpected PA-034 batch 01 fixture: ${firstFixture.schema}/${firstFixture.entries.length}`);
}
if (secondFixture.schema !== "wegb2-reviewed-vocab-posinfo-batch-v1"
  || secondFixture.batch !== "PA-034-02"
  || secondFixture.entries.length !== 59) {
  errors.push(`unexpected PA-034 batch 02 fixture: ${secondFixture.schema}/${secondFixture.batch}/${secondFixture.entries.length}`);
}
if (thirdFixture.schema !== "wegb2-reviewed-vocab-posinfo-batch-v1"
  || thirdFixture.batch !== "PA-034-03"
  || thirdFixture.entries.length !== 80) {
  errors.push(`unexpected PA-034 batch 03 fixture: ${thirdFixture.schema}/${thirdFixture.batch}/${thirdFixture.entries.length}`);
}
if (fourthFixture.schema !== "wegb2-reviewed-vocab-posinfo-batch-v1"
  || fourthFixture.batch !== "PA-034-04"
  || fourthFixture.entries.length !== 90) {
  errors.push(`unexpected PA-034 batch 04 fixture: ${fourthFixture.schema}/${fourthFixture.batch}/${fourthFixture.entries.length}`);
}
if (fifthFixture.schema !== "wegb2-reviewed-vocab-posinfo-batch-v1"
  || fifthFixture.batch !== "PA-034-05"
  || fifthFixture.entries.length !== 86) {
  errors.push(`unexpected PA-034 batch 05 fixture: ${fifthFixture.schema}/${fifthFixture.batch}/${fifthFixture.entries.length}`);
}
if (sixthFixture.schema !== "wegb2-reviewed-vocab-posinfo-batch-v1"
  || sixthFixture.batch !== "PA-034-06"
  || sixthFixture.entries.length !== 75) {
  errors.push(`unexpected PA-034 batch 06 fixture: ${sixthFixture.schema}/${sixthFixture.batch}/${sixthFixture.entries.length}`);
}
if (seventhFixture.schema !== "wegb2-reviewed-vocab-posinfo-batch-v1"
  || seventhFixture.batch !== "PA-034-07"
  || seventhFixture.entries.length !== 62) {
  errors.push(`unexpected PA-034 batch 07 fixture: ${seventhFixture.schema}/${seventhFixture.batch}/${seventhFixture.entries.length}`);
}
if (eighthFixture.schema !== "wegb2-reviewed-vocab-posinfo-batch-v1"
  || eighthFixture.batch !== "PA-034-08"
  || eighthFixture.entries.length !== 87) {
  errors.push(`unexpected PA-034 batch 08 fixture: ${eighthFixture.schema}/${eighthFixture.batch}/${eighthFixture.entries.length}`);
}
if (ninthFixture.schema !== "wegb2-reviewed-vocab-posinfo-batch-v1"
  || ninthFixture.batch !== "PA-034-09"
  || ninthFixture.entries.length !== 49) {
  errors.push(`unexpected PA-034 batch 09 fixture: ${ninthFixture.schema}/${ninthFixture.batch}/${ninthFixture.entries.length}`);
}
if (tenthFixture.schema !== "wegb2-reviewed-vocab-posinfo-batch-v1"
  || tenthFixture.batch !== "PA-034-10"
  || tenthFixture.entries.length !== 16) {
  errors.push(`unexpected PA-034 batch 10 fixture: ${tenthFixture.schema}/${tenthFixture.batch}/${tenthFixture.entries.length}`);
}
if (eleventhFixture.schema !== "wegb2-reviewed-vocab-posinfo-batch-v1"
  || eleventhFixture.batch !== "PA-034-11"
  || eleventhFixture.entries.length !== 27) {
  errors.push(`unexpected PA-034 batch 11 fixture: ${eleventhFixture.schema}/${eleventhFixture.batch}/${eleventhFixture.entries.length}`);
}
if (twelfthFixture.schema !== "wegb2-reviewed-vocab-posinfo-decision-batch-v1"
  || twelfthFixture.batch !== "PA-034-12"
  || twelfthFixture.entries.length !== 98) {
  errors.push(`unexpected PA-034 batch 12 fixture: ${twelfthFixture.schema}/${twelfthFixture.batch}/${twelfthFixture.entries.length}`);
}
if (thirteenthFixture.schema !== "wegb2-reviewed-vocab-posinfo-decision-batch-v1"
  || thirteenthFixture.batch !== "PA-034-13"
  || thirteenthFixture.entries.length !== 119) {
  errors.push(`unexpected PA-034 batch 13 fixture: ${thirteenthFixture.schema}/${thirteenthFixture.batch}/${thirteenthFixture.entries.length}`);
}
if (fixtures.some((fixture) => !/not (?:an )?external linguistic sign-off/.test(fixture.scope))) {
  errors.push("every review fixture must deny external linguistic sign-off");
}

const cards = Object.entries(vocab).flatMap(([deck, value]) =>
  (value.cards ?? []).map((card) => ({ deck, level: value.level ?? card.level, card })));
const byId = new Map<string, { deck: string; level?: string; card: VocabCard }>();
for (const item of cards) {
  if (!item.card.id) continue;
  if (byId.has(item.card.id)) errors.push(`duplicate vocab id: ${item.card.id}`);
  byId.set(item.card.id, item);
}

const reviewedIds = new Set<string>();
for (const fixture of fixtures) {
  for (const expected of fixture.entries) {
    if (reviewedIds.has(expected.id)) {
      errors.push(`duplicate reviewed id across fixtures: ${expected.id}`);
      continue;
    }
    reviewedIds.add(expected.id);
    const actual = byId.get(expected.id);
    if (!actual) {
      errors.push(`reviewed card missing from vocab bank: ${expected.id}`);
      continue;
    }
    if (actual.card.de !== expected.de) {
      errors.push(
        `${expected.id}: de changed; expected «${expected.de}», got «${actual.card.de ?? ""}»`,
      );
    }
    if (actual.card.posInfo !== expected.posInfo) {
      errors.push(
        `${expected.id}: posInfo changed; expected «${expected.posInfo}», got «${actual.card.posInfo ?? ""}»`,
      );
    }
    if (expected.deck && actual.deck !== expected.deck) {
      errors.push(`${expected.id}: deck changed; expected ${expected.deck}, got ${actual.deck}`);
    }
    if (expected.level && actual.level !== expected.level) {
      errors.push(`${expected.id}: level changed; expected ${expected.level}, got ${actual.level ?? ""}`);
    }
    if (expected.decision !== undefined
      && expected.decision !== "corrected"
      && expected.decision !== "confirmed-current") {
      errors.push(`${expected.id}: unknown review decision ${String(expected.decision)}`);
    }
    if (expected.previousPosInfo !== undefined) {
      if (expected.decision === "confirmed-current" && expected.previousPosInfo !== expected.posInfo) {
        errors.push(`${expected.id}: confirmed-current decision must preserve posInfo`);
      }
      if (expected.decision !== "confirmed-current" && expected.previousPosInfo === expected.posInfo) {
        errors.push(`${expected.id}: corrected previous and current posInfo must differ`);
      }
    }
  }
}

function countLevels(fixture: ReviewFixture): Record<string, number> {
  return fixture.entries.reduce<Record<string, number>>((counts, entry) => {
    counts[entry.level ?? ""] = (counts[entry.level ?? ""] ?? 0) + 1;
    return counts;
  }, {});
}

const secondLevelCounts = countLevels(secondFixture);
if (JSON.stringify(secondLevelCounts) !== JSON.stringify({ A1: 26, A2: 9, B1: 16, B2: 8 })) {
  errors.push(`unexpected PA-034-02 level distribution: ${JSON.stringify(secondLevelCounts)}`);
}
const thirdLevelCounts = countLevels(thirdFixture);
if (JSON.stringify(thirdLevelCounts) !== JSON.stringify({ A1: 10, A2: 8, B1: 40, B2: 22 })) {
  errors.push(`unexpected PA-034-03 level distribution: ${JSON.stringify(thirdLevelCounts)}`);
}
const fourthLevelCounts = countLevels(fourthFixture);
if (JSON.stringify(fourthLevelCounts) !== JSON.stringify({ A1: 6, A2: 16, B1: 32, B2: 36 })) {
  errors.push(`unexpected PA-034-04 level distribution: ${JSON.stringify(fourthLevelCounts)}`);
}
const fifthLevelCounts = countLevels(fifthFixture);
if (JSON.stringify(fifthLevelCounts) !== JSON.stringify({ A1: 3, A2: 11, B1: 42, B2: 30 })) {
  errors.push(`unexpected PA-034-05 level distribution: ${JSON.stringify(fifthLevelCounts)}`);
}
const sixthLevelCounts = countLevels(sixthFixture);
if (JSON.stringify(sixthLevelCounts) !== JSON.stringify({ A0: 1, A1: 8, A2: 8, B1: 26, B2: 32 })) {
  errors.push(`unexpected PA-034-06 level distribution: ${JSON.stringify(sixthLevelCounts)}`);
}
for (const fixture of [secondFixture, thirdFixture, fourthFixture, fifthFixture]) {
  if (fixture.entries.some((entry) => entry.de.includes(" ") || entry.posInfo.split(",").length !== 3)) {
    errors.push(`${fixture.batch} must remain a bounded single-head, three-principal-part batch`);
  }
}
const sixthReflexiveHeads = sixthFixture.entries.filter((entry) => entry.de.startsWith("sich "));
if (sixthFixture.entries.some((entry) => entry.posInfo.split(",").length !== 3)
  || sixthReflexiveHeads.length !== 6
  || sixthFixture.entries.some((entry) => entry.de.includes(" ") && !entry.de.startsWith("sich "))) {
  errors.push("PA-034-06 must remain bounded to three principal parts, with exactly six reflexive multiword heads");
}
const seventhLevelCounts = countLevels(seventhFixture);
if (JSON.stringify(seventhLevelCounts) !== JSON.stringify({ A1: 13, A2: 47, B1: 1, B2: 1 })) {
  errors.push(`unexpected PA-034-07 level distribution: ${JSON.stringify(seventhLevelCounts)}`);
}
const seventhMultiwordHeads = seventhFixture.entries.filter((entry) => entry.de.includes(" "));
const seventhSingleHeads = seventhFixture.entries.filter((entry) => !entry.de.includes(" "));
if (seventhFixture.entries.some((entry) => entry.posInfo.split(",").length !== 3)
  || seventhMultiwordHeads.length !== 60
  || JSON.stringify(seventhSingleHeads.map((entry) => entry.de).sort())
    !== JSON.stringify(["umarmen", "unterstützen"])) {
  errors.push("PA-034-07 must remain bounded to 60 multiword heads and the two reviewed inseparable single heads");
}
const eighthLevelCounts = countLevels(eighthFixture);
const eighthReflexiveHeads = eighthFixture.entries.filter((entry) => entry.de.split(" ").includes("sich"));
if (JSON.stringify(eighthLevelCounts) !== JSON.stringify({ B1: 87 })
  || eighthFixture.entries.some((entry) => !entry.de.includes(" ") || entry.posInfo.split(",").length !== 3)
  || eighthReflexiveHeads.length !== 49) {
  errors.push(`PA-034-08 must remain bounded to 87 B1 multiword heads, including 49 reflexive heads: ${JSON.stringify(eighthLevelCounts)}/${eighthReflexiveHeads.length}`);
}
const ninthLevelCounts = countLevels(ninthFixture);
const ninthReflexiveHeads = ninthFixture.entries.filter((entry) => entry.de.split(" ").includes("sich"));
if (JSON.stringify(ninthLevelCounts) !== JSON.stringify({ B2: 49 })
  || ninthFixture.entries.some((entry) => !entry.de.includes(" ") || entry.posInfo.split(",").length !== 3)
  || ninthReflexiveHeads.length !== 37) {
  errors.push(`PA-034-09 must remain bounded to 49 B2 multiword heads, including 37 reflexive heads: ${JSON.stringify(ninthLevelCounts)}/${ninthReflexiveHeads.length}`);
}
const tenthLevelCounts = countLevels(tenthFixture);
const tenthSpecial = tenthFixture.entries.filter((entry) => entry.id === "va-modort-005");
if (JSON.stringify(tenthLevelCounts) !== JSON.stringify({ B2: 7, A1: 2, A2: 1, B1: 6 })
  || tenthFixture.entries.some((entry) => entry.de.includes(" "))
  || tenthFixture.entries.filter((entry) => entry.posInfo.split(",").length === 3).length !== 15
  || tenthSpecial.length !== 1
  || tenthSpecial[0]?.posInfo !== "Konjunktiv II von mögen: ich möchte · du möchtest · wir/Sie möchten") {
  errors.push(`PA-034-10 must remain bounded to 15 single-head principal-part corrections plus the explicit möchten representation: ${JSON.stringify(tenthLevelCounts)}/${tenthSpecial.length}`);
}
const eleventhLevelCounts = countLevels(eleventhFixture);
const eleventhLegacyShorthand = eleventhFixture.entries.filter(
  (entry) => entry.previousPosInfo?.split(",").length !== 3,
);
const eleventhMalformedParticiples = eleventhFixture.entries.filter(
  (entry) => entry.previousPosInfo?.split(",").length === 3,
);
if (JSON.stringify(eleventhLevelCounts) !== JSON.stringify({ A1: 7, A2: 13, B1: 2, B2: 5 })
  || eleventhLegacyShorthand.length !== 24
  || eleventhMalformedParticiples.length !== 3
  || eleventhFixture.entries.some((entry) => entry.posInfo.split(",").length !== 3)) {
  errors.push(`PA-034-11 must remain bounded to 24 expanded legacy shorthands and 3 malformed-participle corrections: ${JSON.stringify(eleventhLevelCounts)}/${eleventhLegacyShorthand.length}/${eleventhMalformedParticiples.length}`);
}
const twelfthLevelCounts = countLevels(twelfthFixture);
const twelfthCorrections = twelfthFixture.entries.filter((entry) => entry.decision === "corrected");
const twelfthConfirmedCurrent = twelfthFixture.entries.filter((entry) => entry.decision === "confirmed-current");
if (JSON.stringify(twelfthLevelCounts) !== JSON.stringify({ A1: 43, A2: 54, A0: 1 })
  || twelfthCorrections.length !== 2
  || twelfthConfirmedCurrent.length !== 96
  || twelfthFixture.entries.some((entry) => entry.posInfo.split(",").length !== 3)
  || twelfthFixture.entries.some((entry) => !["A0", "A1", "A2"].includes(entry.level ?? ""))) {
  errors.push(`PA-034-12 must remain bounded to all 98 residual A0-A2 cards with 2 corrections and 96 confirmed-current decisions: ${JSON.stringify(twelfthLevelCounts)}/${twelfthCorrections.length}/${twelfthConfirmedCurrent.length}`);
}
const thirteenthLevelCounts = countLevels(thirteenthFixture);
const thirteenthCorrections = thirteenthFixture.entries.filter((entry) => entry.decision === "corrected");
const thirteenthConfirmedCurrent = thirteenthFixture.entries.filter((entry) => entry.decision === "confirmed-current");
if (JSON.stringify(thirteenthLevelCounts) !== JSON.stringify({ B1: 119 })
  || thirteenthCorrections.length !== 2
  || thirteenthConfirmedCurrent.length !== 117
  || JSON.stringify(thirteenthCorrections.map((entry) => entry.id).sort())
    !== JSON.stringify(["r315b1-048", "vi-funktio-000"])
  || thirteenthFixture.entries.some((entry) => entry.posInfo.split(",").length !== 3)) {
  errors.push(`PA-034-13 must remain bounded to all 119 residual B1 cards with 2 corrections and 117 confirmed-current decisions: ${JSON.stringify(thirteenthLevelCounts)}/${thirteenthCorrections.length}/${thirteenthConfirmedCurrent.length}`);
}
if (reviewedIds.size !== 958) {
  errors.push(`review fixtures must contain 958 unique entries, got ${reviewedIds.size}`);
}
const unreviewedPosInfo = cards.filter((item) =>
  item.card.id && item.card.posInfo !== undefined && !reviewedIds.has(item.card.id));
if (unreviewedPosInfo.length !== 206
  || unreviewedPosInfo.some((item) => item.level !== "B2")) {
  errors.push(`remaining review gap must stay bounded to 206 B2 posInfo cards, got ${unreviewedPosInfo.length}`);
}

if (errors.length) {
  console.error("❌ Reviewed vocabulary morphology audit failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `✅ Reviewed vocabulary morphology: ${reviewedIds.size}/${reviewedIds.size} reviewed decisions match thirteen bounded internal-review fixtures (${fixtures.map((fixture) => fixture.reviewedAt).join(", ")}).`,
);
console.log(
  "ℹ️ This gate prevents regression only for the reviewed PA-034 batches; it does not certify every posInfo field or provide external linguistic sign-off.",
);
