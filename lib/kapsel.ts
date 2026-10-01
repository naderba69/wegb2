/**
 * ═══════════════════════════════════════════════════════════════════
 *  🌙 كبسولة اليوم — Tageskapsel (ثلاث جمل قبل النوم)
 * ═══════════════════════════════════════════════════════════════════
 *  المبدأ: آخرُ ما يُقرأ قبل النوم يُعاد تثبيتُه أثناءه (Diekelmann & Born 2010:
 *  sleep-dependent consolidation)، والاسترجاعُ صباحاً بعد فاصلِ نومٍ أقوى من
 *  الاسترجاع الفوري (spacing + testing). فالكبسولة ليست «محتوى إضافياً» بل
 *  **حلقة مغلقة**:
 *      مساءً: 3 جمل من دروس اليوم نفسه (لا جمل جديدة)
 *      صباحاً: بوابةُ الجلسة (Wiederholung & Abruf) تسأل هذه الجمل الثلاث بعينها
 *  ⇒ البرهانُ على أن الكبسولة قُرئت هو أداءُ الغد، لا زرُّ «قرأتها».
 *
 *  الاشتقاق (حتمي، بلا حالة):
 *   • تُجمَع sentenceIds من مهام اليوم المولَّدة — عدا الاسترجاع (وإلا دارت
 *     جملُ الأمس إلى الأبد) وعدا التعويضات (دَينٌ لا درسٌ) — بترتيب ظهورها.
 *   • أوّل ثلاثٍ مختلفة. إن قلّت (يومٌ بلا مهمّة جمل) تُكمَّل من مخزون المستوى
 *     ببذرة اليوم — فلا يخلو مساءٌ من كبسولة.
 * ═══════════════════════════════════════════════════════════════════
 */

import type { Satz } from "./types";
import { emptyProgress } from "./types";
import { sentences, getSatz } from "./content";

export const KAPSEL_GROESSE = 3;
const memo = new Map<number, string[]>();

/** معرّفات جمل كبسولة يومٍ ما — محفوظة لأن الخطة حتمية */
export function kapselIds(day: number): string[] {
  const d = Math.max(1, day | 0);
  const hit = memo.get(d);
  if (hit) return hit;
  // استيراد كسول لكسر الدور plan ⇄ kapsel (plan يستدعي kapselIds لجملِ الغد)
  const { buildDay, levelOf, pickN, rng } = require("./plan") as typeof import("./plan");
  const plan = buildDay(d, emptyProgress);
  const out: string[] = [];
  for (const t of plan.tasks) {
    if (t.kind === "wiederholen" || t.mandatory) continue;
    for (const id of t.sentenceIds ?? []) if (!out.includes(id) && getSatz(id)) out.push(id);
    if (out.length >= KAPSEL_GROESSE) break;
  }
  if (out.length < KAPSEL_GROESSE) {
    const lvl = levelOf(d);
    const pool = sentences.filter((s) => s.level === lvl && !out.includes(s.id));
    for (const s of pickN(pool, KAPSEL_GROESSE - out.length, rng(d * 131 + 3))) out.push(s.id);
  }
  const res = out.slice(0, KAPSEL_GROESSE);
  memo.set(d, res);
  return res;
}

export function kapselSaetze(day: number): Satz[] {
  return kapselIds(day).map((id) => getSatz(id)).filter((s): s is Satz => !!s);
}

/** هل جملُ الكبسولةِ مأخوذةٌ من دروس اليوم فعلاً (لا من التكميل)؟ — للشفافية على الشاشة */
export function kapselAusTag(day: number): boolean {
  const { buildDay } = require("./plan") as typeof import("./plan");
  const eigene = new Set(buildDay(Math.max(1, day | 0), emptyProgress).tasks.filter((t) => t.kind !== "wiederholen" && !t.mandatory).flatMap((t) => t.sentenceIds ?? []));
  return kapselIds(day).every((id) => eigene.has(id));
}
