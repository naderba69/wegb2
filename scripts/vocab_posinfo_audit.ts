import fs from "node:fs";
import path from "node:path";

type VocabCard = {
  id?: string;
  de?: string;
  posInfo?: string;
};

type VocabDeck = {
  cards?: VocabCard[];
};

type ReviewFixture = {
  schema: string;
  reviewedAt: string;
  scope: string;
  entries: Array<Required<Pick<VocabCard, "id" | "de" | "posInfo">>>;
};

const root = process.cwd();
const vocab = JSON.parse(
  fs.readFileSync(path.join(root, "content", "vocab.json"), "utf8"),
) as Record<string, VocabDeck>;
const fixture = JSON.parse(
  fs.readFileSync(
    path.join(root, "scripts", "fixtures", "vocab-posinfo-reviewed.json"),
    "utf8",
  ),
) as ReviewFixture;

const errors: string[] = [];
if (fixture.schema !== "wegb2-reviewed-vocab-posinfo-v1") {
  errors.push(`unknown fixture schema: ${fixture.schema}`);
}

const cards = Object.values(vocab).flatMap((deck) => deck.cards ?? []);
const byId = new Map<string, VocabCard>();
for (const card of cards) {
  if (!card.id) continue;
  if (byId.has(card.id)) errors.push(`duplicate vocab id: ${card.id}`);
  byId.set(card.id, card);
}

const reviewedIds = new Set<string>();
for (const expected of fixture.entries) {
  if (reviewedIds.has(expected.id)) {
    errors.push(`duplicate reviewed id: ${expected.id}`);
    continue;
  }
  reviewedIds.add(expected.id);
  const actual = byId.get(expected.id);
  if (!actual) {
    errors.push(`reviewed card missing from vocab bank: ${expected.id}`);
    continue;
  }
  if (actual.de !== expected.de) {
    errors.push(
      `${expected.id}: de changed; expected «${expected.de}», got «${actual.de ?? ""}»`,
    );
  }
  if (actual.posInfo !== expected.posInfo) {
    errors.push(
      `${expected.id}: posInfo changed; expected «${expected.posInfo}», got «${actual.posInfo ?? ""}»`,
    );
  }
}

if (fixture.entries.length !== 110) {
  errors.push(`review fixture must contain 110 entries, got ${fixture.entries.length}`);
}

if (errors.length) {
  console.error("❌ Reviewed vocabulary morphology audit failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `✅ Reviewed vocabulary morphology: ${fixture.entries.length}/${fixture.entries.length} fixed cards match the internal manual-review fixture (${fixture.reviewedAt}).`,
);
console.log(
  "ℹ️ This gate prevents regression only for the reviewed PA-034 set; it does not certify every posInfo field.",
);
