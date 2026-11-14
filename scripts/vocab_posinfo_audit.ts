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
];
const fixtures = fixturePaths.map((name) => JSON.parse(
  fs.readFileSync(path.join(root, "scripts", "fixtures", name), "utf8"),
) as ReviewFixture);

const errors: string[] = [];
const [firstFixture, secondFixture, thirdFixture] = fixtures;
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
    if (expected.previousPosInfo !== undefined && expected.previousPosInfo === expected.posInfo) {
      errors.push(`${expected.id}: reviewed previous and corrected posInfo must differ`);
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
for (const fixture of [secondFixture, thirdFixture]) {
  if (fixture.entries.some((entry) => entry.de.includes(" ") || entry.posInfo.split(",").length !== 3)) {
    errors.push(`${fixture.batch} must remain a bounded single-head, three-principal-part batch`);
  }
}
if (reviewedIds.size !== 249) {
  errors.push(`review fixtures must contain 249 unique entries, got ${reviewedIds.size}`);
}

if (errors.length) {
  console.error("❌ Reviewed vocabulary morphology audit failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `✅ Reviewed vocabulary morphology: ${reviewedIds.size}/${reviewedIds.size} corrected cards match three bounded internal-review fixtures (${fixtures.map((fixture) => fixture.reviewedAt).join(", ")}).`,
);
console.log(
  "ℹ️ This gate prevents regression only for the reviewed PA-034 batches; it does not certify every posInfo field or provide external linguistic sign-off.",
);
