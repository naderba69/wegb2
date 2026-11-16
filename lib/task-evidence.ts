// PA-016 — construct-aware evidence routing for generated plan tasks.
// This classifies the material actually attached to a task, never TaskKind alone.

import {
  dialogues,
  getDeck,
  grammarMap,
  kontaktKarten,
  monologKartenExtra,
  muendlich,
  partnerKarten,
  sentences,
  texts,
  writingTasks,
} from "./content";
import type {
  DayTask,
  Exercise,
  Kompetenz,
  KompetenzEvidenceLevel,
  KompetenzResponseMode,
  Level,
  TaskEvidenceDescriptor,
} from "./types";

const PRODUKTIV = new Set<Kompetenz>(["Schreiben", "Sprechen"]);

function levelLabel(levels: Set<Level>, fallback: Level): KompetenzEvidenceLevel {
  if (levels.size > 1) return "mixed";
  return levels.values().next().value ?? fallback;
}

function responseMode(exercises: Exercise[] | undefined): KompetenzResponseMode {
  if (!exercises?.length) return "activity_completion";
  const selected = exercises.some((exercise) => ["mc", "truefalse", "order"].includes(exercise.type));
  const constructed = exercises.some((exercise) => ["fill", "translate", "dictation", "umformung"].includes(exercise.type));
  if (selected && constructed) return "mixed_response";
  return constructed ? "short_constructed_response" : "selected_response";
}

const LEVELS = new Set<Level>(["A0", "A1", "A2", "B1", "B2"]);
function contentLevel<T extends { id: string; level?: string }>(items: T[], id?: string): Level | undefined {
  const level = id ? items.find((item) => item.id === id)?.level : undefined;
  return level && LEVELS.has(level as Level) ? level as Level : undefined;
}

/**
 * Attach one normalized descriptor per construct. Weights sum to 1 within a task and
 * route profile evidence; they are not difficulty parameters or psychometric weights.
 */
export function evidenceForTask(task: DayTask, fallbackLevel: Level): TaskEvidenceDescriptor[] {
  const levels = new Map<Kompetenz, Set<Level>>();
  const modes = new Map<Kompetenz, KompetenzResponseMode>();
  const add = (construct: Kompetenz, level?: Level, mode?: KompetenzResponseMode) => {
    const values = levels.get(construct) ?? new Set<Level>();
    values.add(level ?? fallbackLevel);
    levels.set(construct, values);
    if (mode) modes.set(construct, mode);
  };

  if (task.topicId) add("Grammatik", grammarMap[task.topicId]?.level, responseMode(grammarMap[task.topicId]?.exercises));
  if (task.verifyFor) add("Grammatik", grammarMap[task.verifyFor]?.level, responseMode(task.quiz));

  if (task.deckId) {
    const cards = getDeck(task.deckId)?.cards ?? [];
    if (cards.length === 0) add("Wortschatz");
    else cards.forEach((card) => add("Wortschatz", card.level));
    modes.set("Wortschatz", task.quiz?.length ? responseMode(task.quiz) : "activity_completion");
  }

  const text = task.textId ? texts.find((item) => item.id === task.textId) : undefined;
  if (text) add("Lesen", text.level, responseMode(text.questions));
  else if (task.textId) add("Lesen");

  const dialogue = task.dialogueId ? dialogues.find((item) => item.id === task.dialogueId) : undefined;
  if (dialogue) add("Hoeren", dialogue.level, responseMode(dialogue.questions));
  else if (task.dialogueId) add("Hoeren");

  const writing = task.writeId ? writingTasks.find((item) => item.id === task.writeId) : undefined;
  if (writing) add("Schreiben", writing.level, "extended_written_response");
  else if (task.writeId) add("Schreiben", undefined, "extended_written_response");

  const spokenLevel = contentLevel(kontaktKarten, task.kontaktId)
    ?? contentLevel(monologKartenExtra, task.monologId)
    ?? contentLevel(muendlich, task.muendlichId)
    ?? contentLevel(partnerKarten, task.partnerId);
  if (task.kontaktId || task.monologId || task.muendlichId || task.partnerId) {
    add("Sprechen", spokenLevel, "spoken_response");
  }

  if (task.sentenceIds?.length) {
    const sentenceLevels = task.sentenceIds
      .map((id) => sentences.find((sentence) => sentence.id === id)?.level)
      .filter((level): level is Level => level !== undefined);
    if (["sprechen", "aussprache", "partner"].includes(task.kind)) {
      (sentenceLevels.length ? sentenceLevels : [fallbackLevel]).forEach((level) => add("Sprechen", level, "spoken_response"));
    } else if (!task.deckId) {
      // Sentence recall combines lexical retrieval with form/word-order control.
      (sentenceLevels.length ? sentenceLevels : [fallbackLevel]).forEach((level) => {
        add("Wortschatz", level, responseMode(task.quiz));
        add("Grammatik", level, responseMode(task.quiz));
      });
    }
  }

  if (task.fehlerItems?.length || task.fehlerKeys?.length) {
    const arts = task.fehlerItems?.map((item) => item.art) ?? [];
    if (arts.some((art) => art === "falsche-freunde" || art === "wortschatz")) add("Wortschatz");
    if (arts.some((art) => art !== "falsche-freunde" && art !== "wortschatz") || task.fehlerKeys?.length) add("Grammatik");
  }

  // Generated quiz items retain their parent level/construct. Mixed sentence retrieval
  // contributes to form and lexis; untagged legacy/special items use a conservative fallback.
  if (task.quiz?.length && !task.topicId && !task.verifyFor) {
    let tagged = 0;
    for (const exercise of task.quiz) {
      if (!exercise.evidenceConstruct || !exercise.evidenceLevel) continue;
      tagged++;
      const itemMode = responseMode([exercise]);
      if (exercise.evidenceConstruct === "mixed") {
        add("Grammatik", exercise.evidenceLevel, itemMode);
        add("Wortschatz", exercise.evidenceLevel, itemMode);
      } else {
        add(exercise.evidenceConstruct, exercise.evidenceLevel, itemMode);
      }
    }
    if (tagged < task.quiz.length) {
      const untagged = task.quiz.filter((exercise) => !exercise.evidenceConstruct || !exercise.evidenceLevel);
      const isFalseFriend = untagged.length > 0 && untagged.every((exercise) => exercise.id.includes("ff-"));
      const isPretest = task.titleDe.startsWith("Vortest:");
      if (isFalseFriend) add("Wortschatz", fallbackLevel, responseMode(untagged));
      else if (isPretest) add("Grammatik", fallbackLevel, responseMode(untagged));
      else {
        add("Grammatik", fallbackLevel, responseMode(untagged));
        add("Wortschatz", fallbackLevel, responseMode(untagged));
      }
    }
  }

  // Material-free simulator shells still have an explicit productive construct.
  if (levels.size === 0) {
    if (task.kind === "schulsim" || task.kind === "schreiben" || task.kind === "briefe") {
      add("Schreiben", fallbackLevel, "extended_written_response");
    } else if (task.kind === "sprechen" || task.kind === "partner" || task.kind === "aussprache") {
      add("Sprechen", fallbackLevel, "spoken_response");
    } else if (task.kind === "hoeren") add("Hoeren");
    else if (task.kind === "lesen") add("Lesen");
    else if (task.kind === "wortschatz") add("Wortschatz");
    else if (task.kind === "grammatik") add("Grammatik");
    else {
      // A bare review/check is integrated activity, represented without a false single-domain label.
      add("Grammatik");
      add("Wortschatz");
    }
  }

  const constructs = [...levels.keys()];
  const weight = 1 / constructs.length;
  const pureProductive = constructs.length === 1 && PRODUKTIV.has(constructs[0]);
  const assisted = !task.exam && task.kind !== "check" && !task.verifyFor;

  return constructs.map((construct) => ({
    construct,
    level: levelLabel(levels.get(construct) ?? new Set(), fallbackLevel),
    weight,
    evidenceType: pureProductive ? "self_report" : "activity",
    assisted,
    responseMode: construct === "Sprechen"
      ? "spoken_response"
      : construct === "Schreiben"
        ? "extended_written_response"
        : modes.get(construct) ?? responseMode(task.quiz),
    method: "plan_submission",
    sourceId: `${task.id}:${construct}`,
  }));
}
