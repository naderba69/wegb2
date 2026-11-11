import type { Level } from "./types";
import { exakteAntwortLecks } from "./exercise-hints";

export const SCAFFOLD_LEVELS: readonly Level[] = ["A0", "A1", "A2", "B1", "B2"];

export type ScaffoldExercise = {
  id?: unknown;
  type?: unknown;
  promptDe?: unknown;
  text?: unknown;
  answer?: unknown;
};

export type ScaffoldTopic = {
  id?: unknown;
  level?: unknown;
  exercises?: unknown;
  verify?: unknown;
};

export type ScaffoldLevelMetric = {
  level: Level;
  topics: number;
  items: number;
  parenthetical: number;
  blankLinked: number;
  exactLeaks: number;
  parentheticalPct: number;
};

export type ScaffoldMetrics = {
  topics: number;
  items: number;
  parenthetical: number;
  blankLinked: number;
  exactLeaks: number;
  byLevel: Record<Level, ScaffoldLevelMetric>;
};

function exerciseSources(exercise: ScaffoldExercise): string[] {
  return [...new Set([exercise.promptDe, exercise.text]
    .filter((value): value is string => typeof value === "string"))];
}

/**
 * Returns every non-empty parenthetical marker once. This is deliberately a
 * review signal, not an error classifier: (Konjunktiv II), (Teil 2), a lemma,
 * and an Arabic semantic cue all count here.
 */
export function parentheticalMarkers(exercise: ScaffoldExercise): string[] {
  return [...new Set(exerciseSources(exercise)
    .flatMap((source) => [...source.matchAll(/\(([^()]*)\)/gu)])
    .map((match) => match[1].trim())
    .filter(Boolean))];
}

export function hasParentheticalMarker(exercise: ScaffoldExercise): boolean {
  return parentheticalMarkers(exercise).length > 0;
}

/** A screening candidate only: the prompt has a parenthetical marker and a blank. */
export function isBlankLinkedScaffoldCandidate(exercise: ScaffoldExercise): boolean {
  const sources = exerciseSources(exercise);
  return hasParentheticalMarker(exercise) && sources.some((source) => /_{3,}/u.test(source));
}

function exercisesOf(topic: ScaffoldTopic): ScaffoldExercise[] {
  const exercises = Array.isArray(topic.exercises) ? topic.exercises : [];
  const verify = Array.isArray(topic.verify) ? topic.verify : [];
  return [...exercises, ...verify].filter((item): item is ScaffoldExercise => !!item && typeof item === "object");
}

function pct(part: number, total: number): number {
  return total === 0 ? 0 : Number(((part / total) * 100).toFixed(1));
}

/**
 * Measures the current grammar bank without assigning normative CEFR limits.
 * Ratios are an observability baseline; pedagogical decisions remain case by case.
 */
export function calculateScaffoldMetrics(topicsInput: Record<string, ScaffoldTopic> | ScaffoldTopic[]): ScaffoldMetrics {
  const topics = Array.isArray(topicsInput) ? topicsInput : Object.values(topicsInput);
  const byLevel = Object.fromEntries(SCAFFOLD_LEVELS.map((level) => [level, {
    level,
    topics: 0,
    items: 0,
    parenthetical: 0,
    blankLinked: 0,
    exactLeaks: 0,
    parentheticalPct: 0,
  }])) as Record<Level, ScaffoldLevelMetric>;

  for (const topic of topics) {
    if (!SCAFFOLD_LEVELS.includes(topic.level as Level)) continue;
    const metric = byLevel[topic.level as Level];
    metric.topics += 1;
    for (const exercise of exercisesOf(topic)) {
      metric.items += 1;
      if (hasParentheticalMarker(exercise)) metric.parenthetical += 1;
      if (isBlankLinkedScaffoldCandidate(exercise)) metric.blankLinked += 1;
      metric.exactLeaks += exakteAntwortLecks(exercise).length;
    }
  }

  for (const metric of Object.values(byLevel)) {
    metric.parentheticalPct = pct(metric.parenthetical, metric.items);
  }

  return {
    topics: Object.values(byLevel).reduce((sum, metric) => sum + metric.topics, 0),
    items: Object.values(byLevel).reduce((sum, metric) => sum + metric.items, 0),
    parenthetical: Object.values(byLevel).reduce((sum, metric) => sum + metric.parenthetical, 0),
    blankLinked: Object.values(byLevel).reduce((sum, metric) => sum + metric.blankLinked, 0),
    exactLeaks: Object.values(byLevel).reduce((sum, metric) => sum + metric.exactLeaks, 0),
    byLevel,
  };
}
