/**
 * توليد تدريبات «أصدقاء كاذبين» عربي-ألماني — تُحقن أسبوعياً كخانة تدريب قصيرة
 * ضمن دروس اليوم من المستوى A1 فصاعداً.
 */
import { FALSCHE_FREUNDE, freundeByLevel, type FalscherFreund } from "./falsche-freunde";
import { seededShuffle } from "./seeded-rng";
import type { Level } from "./types";

export type FalschFreundExercise = {
  id: string;
  type: "mc";
  promptDe: string;
  promptAr: string;
  options: string[];
  answer: number;
  explanationAr: string;
};

/** اختيار ثابت باليوم */
function pick<T>(arr: T[], day: number): T {
  return arr[Math.abs(day * 2654435761) % arr.length];
}

/** يبني تمريناً واحداً لليوم (إن وُجد صديق مناسب) */
export function baueFalschFreundAufgabe(day: number, level: Level): FalschFreundExercise | null {
  const pool = freundeByLevel(level as "A1"|"A2"|"B1"|"B2", 20);
  if (pool.length < 4) return null;
  const f: FalscherFreund = pick(pool, day);
  const richtig = `${f.de} = ${f.ar}`;
  const fall = `${f.de} ← يخطئ: بمعنى «${f.falschBedeutet}» (${f.falschesWort})`;
  // اثنان مُشتِّتان آخران من البنك
  const ablenker = seededShuffle(
    FALSCHE_FREUNDE.filter((x) => x.de !== f.de).map((x) => `${x.de} = ${x.ar}`),
    day
  ).slice(0, 2);
  const opts = seededShuffle([richtig, fall, ...ablenker], day + 7);
  const answer = opts.indexOf(richtig);
  return {
    id: `ff-${day}`,
    type: "mc",
    promptDe: `Was bedeutet „${f.de}“?`,
    promptAr: `ما معنى الكلمة الألمانية «${f.de}»؟`,
    options: opts,
    answer,
    explanationAr: `${f.warhammer} الصديق الكاذب: ${f.falschesWort} = ${f.falschBedeutet}.`,
  };
}
