import { readFileSync } from "node:fs";
import { calculateScaffoldMetrics, SCAFFOLD_LEVELS, type ScaffoldMetrics, type ScaffoldTopic } from "../lib/scaffold-metrics";

type Baseline = ScaffoldMetrics & {
  reviewRule: string;
  asOf: string;
  nonBlockingRatios: boolean;
  method: string;
};

const grammar = JSON.parse(readFileSync("content/grammar.json", "utf8")) as Record<string, ScaffoldTopic>;
const baseline = JSON.parse(readFileSync("content/scaffold-metrics-baseline.json", "utf8")) as Baseline;
const actual = calculateScaffoldMetrics(grammar);
const failures: string[] = [];
let checks = 0;

function check(condition: boolean, message: string): void {
  checks += 1;
  if (!condition) failures.push(message);
}

check(baseline.reviewRule === "R161" && baseline.nonBlockingRatios === true && /^\d{4}-\d{2}-\d{2}$/u.test(baseline.asOf),
  "baseline governance metadata is missing or malformed");
check(baseline.method.includes("review signals, not confirmed defects"),
  "baseline must preserve the non-defect interpretation of scanner candidates");
check(actual.topics === baseline.topics && actual.items === baseline.items,
  `bank size drift: actual ${actual.topics} topics/${actual.items} items, baseline ${baseline.topics}/${baseline.items}`);
check(actual.parenthetical === baseline.parenthetical && actual.blankLinked === baseline.blankLinked,
  `scaffold signal drift: actual ${actual.parenthetical}/${actual.blankLinked}, baseline ${baseline.parenthetical}/${baseline.blankLinked}`);
check(actual.exactLeaks === 0 && baseline.exactLeaks === 0,
  `confirmed exact-answer leaks must remain zero; actual ${actual.exactLeaks}`);
check(SCAFFOLD_LEVELS.every((level) => JSON.stringify(actual.byLevel[level]) === JSON.stringify(baseline.byLevel[level])),
  "per-level scaffold baseline drifted; review the cases and update the dated baseline deliberately");
check(Object.values(actual.byLevel).every((metric) => metric.parenthetical <= metric.items && metric.blankLinked <= metric.parenthetical),
  "metric invariants failed");
check(Object.values(actual.byLevel).reduce((sum, metric) => sum + metric.items, 0) === actual.items,
  "per-level item totals do not add up");

console.log("\nParenthetical scaffold observability (non-blocking ratios)");
console.log("Level  topics  markers/items  blank-linked  ratio");
for (const level of SCAFFOLD_LEVELS) {
  const metric = actual.byLevel[level];
  console.log(`${level.padEnd(5)}  ${String(metric.topics).padStart(6)}  ${`${metric.parenthetical}/${metric.items}`.padStart(13)}  ${String(metric.blankLinked).padStart(12)}  ${metric.parentheticalPct.toFixed(1).padStart(5)}%`);
}
console.log(`TOTAL  ${String(actual.topics).padStart(6)}  ${`${actual.parenthetical}/${actual.items}`.padStart(13)}  ${String(actual.blankLinked).padStart(12)}  exact leaks: ${actual.exactLeaks}`);
console.log(`Scaffold audit: ${checks - failures.length}/${checks} checks passed`);

if (failures.length > 0) {
  for (const failure of failures) console.error(`✗ ${failure}`);
  process.exit(1);
}
