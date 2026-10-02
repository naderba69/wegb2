/**
 * توليد تدريبات «أصدقاء كاذبين» عربي-ألماني — تُحقن أسبوعياً كخانة تدريب قصيرة
 * ضمن دروس اليوم من المستوى A1 فصاعداً.
 */
import { FALSCHE_FREUNDE, freundeByLevel, type FalscherFreund } from "./falsche-freunde";
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

function shuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = Math.abs(seed) % 2147483647 || 1;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 16807) % 2147483647;
    const j = Math.floor(((s - 1) / 2147483646) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** يبني تمريناً واحداً لليوم (إن وُجد صديق مناسب) */
export function baueFalschFreundAufgabe(day: number, level: Level): FalschFreundExercise | null {
  const pool = freundeByLevel(level as "A1"|"A2"|"B1"|"B2", 20);
  if (pool.length < 4) return null;
  const f: FalscherFreund = pick(pool, day);
  const richtig = `${f.de} = ${f.ar}`;
  const fall = `${f.de} ← يخطئ: بمعنى «${f.falschBedeutet}» (${f.falschesWort})`;
  // اثنان مُشتِّتان آخران من البنك
  const ablenker = shuffle(
    FALSCHE_FREUNDE.filter((x) => x.de !== f.de).map((x) => `${x.de} = ${x.ar}`),
    day
  ).slice(0, 2);
  const opts = shuffle([richtig, fall, ...ablenker], day + 7);
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
