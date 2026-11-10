/**
 * Pure helpers for auditing parenthetical exercise hints.
 * A hint is a confirmed answer leak only when its complete normalized content
 * equals one accepted answer. Derivational hints such as (kommen) → komme are
 * intentionally not classified here and require a separate pedagogical review.
 */

export type ExerciseWithHint = {
  promptDe?: unknown;
  text?: unknown;
  answer?: unknown;
};

export function normalisiereHinweisAntwort(value: string): string {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase("de-DE")
    .replace(/[^\p{L}\p{N}]+/gu, "")
    .trim();
}

export function exakteKlammerAntworten(text: unknown, answer: unknown): string[] {
  if (typeof text !== "string") return [];
  const answers = (Array.isArray(answer) ? answer : [answer])
    .filter((value): value is string => typeof value === "string")
    .map(normalisiereHinweisAntwort)
    .filter(Boolean);
  if (!answers.length) return [];

  const answerSet = new Set(answers);
  return [...text.matchAll(/\(([^()]*)\)/gu)]
    .map((match) => match[1].trim())
    .filter((hint) => answerSet.has(normalisiereHinweisAntwort(hint)));
}

export function exakteAntwortLecks(exercise: ExerciseWithHint): string[] {
  const sources = [exercise.promptDe, exercise.text]
    .filter((value): value is string => typeof value === "string");
  const uniqueSources = [...new Set(sources)];
  return [...new Set(uniqueSources.flatMap((source) => exakteKlammerAntworten(source, exercise.answer)))];
}
