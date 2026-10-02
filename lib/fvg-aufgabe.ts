/**
 * يولّد تدريباً أسبوعياً على Funktionsverbgefüge (B2 فقط) — سؤال اختيار من متعدد
 * على الفعل الوظيفي المناسب.
 */
import { FVG_LIST, fvgOf, type FVG } from "./fvg";
import type { Exercise, Level } from "./types";

const VERBEN = ["treffen", "stellen", "stehen", "kommen", "nehmen", "üben", "ergreifen",
  "spielen", "machen", "bringen", "geben", "erstatten"];

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

/** حقنة أسبوعية لـFVG في مرحلة B2 (يعود null بلا شيء في المراحل الأدنى) */
export function baueFvgAufgabe(day: number, level: Level, wochencheck: boolean): Exercise | null {
  if (level !== "B2" || !wochencheck) return null;
  const f: FVG = fvgOf(day);
  const ablenker = shuffle(VERBEN.filter((v) => v !== f.verb), day).slice(0, 3);
  const options = shuffle([f.verb, ...ablenker], day + 13);
  return {
    id: `fvg-${day}`,
    type: "mc",
    promptDe: `${f.nomen} … — Welches Funktionsverb passt?`,
    promptAr: `ما الفعل الوظيفي المناسب لتركيب «${f.nomen}» بمعنى ${f.bedeutungAr}؟`,
    options,
    answer: f.verb,
    explanationAr: `التركيب الصحيح: ${f.ausdruck} — ${f.bedeutungAr}. مثال: ${f.beispiel} تنبيه: ${f.hinweisAr}`,
    hint: f.ausdruck,
  };
}
