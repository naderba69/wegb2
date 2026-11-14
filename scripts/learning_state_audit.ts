import assert from "node:assert/strict";
import { buildDay, debtsFrom } from "../lib/plan";
import { isDue, newCard, reviewCard, todayDeck } from "../lib/srs";
import { emptyProgress, type DebtItem, type Progress, type SrsState, type TaskResult } from "../lib/types";

const DAY = 24 * 60 * 60 * 1000;
const start = new Date("2026-01-01T12:00:00.000Z");
const atDay = (day: number) => new Date(start.getTime() + day * DAY);

let card = newCard(start);
card = reviewCard(card, 2, { now: atDay(0) });
card = reviewCard(card, 2, { now: atDay(1) });
card = reviewCard(card, 2, { now: atDay(2) });
assert.equal(card.successStreak, 3);
assert.deepEqual(card.overDue, [atDay(4).toISOString(), atDay(9).toISOString()]);
card = reviewCard(card, 2, { now: atDay(4) });
assert.deepEqual(card.overDue, [atDay(9).toISOString()]);
assert.equal(isDue(card, atDay(4)), false);
card = reviewCard(card, 0, { now: atDay(9) });
assert.equal(card.successStreak, 0);
assert.equal(card.overDue, undefined);

const dueState = (due: Date, lapses = 0): SrsState => ({
  ...newCard(start),
  reps: 2,
  lapses,
  due: due.toISOString(),
  last: atDay(20).toISOString(),
});
const priority = todayDeck({
  "base-old": dueState(atDay(20)),
  "extra-oldest": { ...dueState(atDay(40)), overDue: [atDay(10).toISOString()] },
  "tie-low": dueState(atDay(25), 0),
  "tie-high": dueState(atDay(25), 5),
}, "regelmaessig", atDay(30)).due;
assert.deepEqual(priority, ["extra-oldest", "base-old", "tie-high", "tie-low"]);

const makeBacklog = (count: number): DebtItem[] => Array.from({ length: count }, (_, index) => ({
  id: `old-${index}`,
  kind: "lesen",
  titleDe: `Lesen ${index}`,
  titleAr: `قراءة ${index}`,
  textId: `text-${index}`,
  from: 40 + index,
}));
for (const count of [0, 1, 2, 4]) {
  const probe = buildDay(50, {
    ...emptyProgress,
    plan: { ...emptyProgress.plan, day: 50, debt: makeBacklog(count) },
  } as Progress);
  assert.equal(probe.tasks.filter((task) => task.debtId).length, Math.min(2, count));
  assert.equal(probe.debtBacklog?.length, count);
}
const backlog = makeBacklog(4);
const progress = {
  ...emptyProgress,
  plan: { ...emptyProgress.plan, day: 50, debt: backlog },
} as Progress;
const plan = buildDay(50, progress);
const scheduled = plan.tasks.filter((task) => task.debtId);
assert.equal(scheduled.length, 2);
assert.equal(plan.debtBacklog?.length, 4);
const results = Object.fromEntries(plan.tasks.map((task) => [task.id, {
  done: true,
  passed: true,
  score: 1,
  total: 1,
  attempts: 1,
}])) as Record<string, TaskResult>;
results[scheduled[1].id] = { done: true, passed: false, score: 0, total: 1, attempts: 2 };
const carried = debtsFrom(plan, results);
assert.deepEqual(new Set(carried.map((debt) => debt.id)), new Set(["old-1", "old-2", "old-3"]));

console.log("✅ Learning-state audit: persistent debt backlog, consumable overlearning dates, real success streaks, and due-card priority are intact.");
console.log("ℹ️ This gate verifies PA-006–PA-008 state transitions; it does not validate learning effectiveness or external CEFR claims.");
