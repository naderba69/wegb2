/**
 * ═══════════════════════════════════════════════════════════════════
 *  🔍 الاستقراء قبل القاعدة — Entdeckendes Lernen (Induktion zuerst)
 * ═══════════════════════════════════════════════════════════════════
 *  الترتيب القديم في درس القواعد: ملخّص ← قواعد ← أمثلة ← تمارين. أي أن
 *  المتعلّم يقرأ القاعدة ثم يرى ما يؤكّدها — فلا يُنتج شيئاً قبل أن يُلقَّن.
 *  البحث (Kapur 2008 «Productive Failure»؛ Schwartz & Bransford 1998
 *  «A Time for Telling») ثابت: **محاولةُ استنتاجِ القاعدة من الأمثلة قبل
 *  الشرح ترفع الاحتفاظ والنقل، حتى لو أخفقت المحاولة** — لأنها تُنشئ
 *  «الفجوة» التي يملؤها الشرح بعدها.
 *
 *  لذلك يُقلب الترتيب بلا محتوى جديد: أمثلةُ الدرس نفسِها ← «ما القاعدة
 *  التي تراها؟» ← ثمّ يُكشف الدرس كاملاً. القاعدة الصحيحة تُعرض بين قواعد
 *  دروسٍ أخرى من المستوى نفسه (مشتّتات حقيقية لا مختلقة)، والاختيار الخاطئ
 *  لا يُعاقَب: هو إخفاقٌ مُنتِج، ويُكشف بعده الدرس بالطريقة نفسها.
 *
 *  المبدأ الصادق: بابُ «أرني القاعدة مباشرة» موجودٌ ومرئيّ — لكنه يُسجَّل
 *  تخطّياً لا إجابة، ولا نقطةَ عليه.
 * ═══════════════════════════════════════════════════════════════════
 */

import type { GrammarTopic } from "./types";

export const MIN_BEISPIELE = 2;

/** هل يصلح الدرس للاستقراء؟ يحتاج مثالين على الأقل وقاعدةً واحدة */
export function induktionMoeglich(t: GrammarTopic): boolean {
  return (t.examples?.length ?? 0) >= MIN_BEISPIELE && (t.rules?.length ?? 0) >= 1;
}

export interface EntdeckungsFrage {
  /** الخيارات: قواعد بصيغتها الألمانية مع شرحها العربي */
  optionen: { de: string; ar: string; richtig: boolean; quelle: string }[];
  /** فهرس الصحيح داخل optionen */
  richtigIndex: number;
}

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return h >>> 0;
}

const STUFEN = ["A0", "A1", "A2", "B1", "B2"] as const;
/** بُعد المستوى: 0 نفسه، 1 مجاور، 2+ بعيد — المشتّت البعيد ضجيجٌ لا تعليم (V7) */
export function stufenAbstand(a: string, b: string): number {
  return Math.abs(STUFEN.indexOf(a as (typeof STUFEN)[number]) - STUFEN.indexOf(b as (typeof STUFEN)[number]));
}

/**
 * سؤال الاكتشاف: القاعدة الأولى للدرس + حتى 3 قواعد من دروس أخرى، مرتبةً
 * ببُعد المستوى (نفسه ثمّ المجاور ثمّ البعيد) فبالبذرة الحتمية.
 */
export function entdeckungsFrage(t: GrammarTopic, alle: GrammarTopic[], seed = 0): EntdeckungsFrage | null {
  if (!induktionMoeglich(t)) return null;
  const richtig = t.rules[0];
  const kandidaten = alle
    .filter((x) => x.id !== t.id && x.rules?.length)
    .sort((a, b) => stufenAbstand(a.level, t.level) - stufenAbstand(b.level, t.level) || hash(a.id + t.id) - hash(b.id + t.id))
    .map((x) => ({ de: x.rules[0].de, ar: x.rules[0].ar, richtig: false, quelle: x.id }))
    .filter((o) => o.de !== richtig.de)
    .slice(0, 3);
  const opts = [{ de: richtig.de, ar: richtig.ar, richtig: true, quelle: t.id }, ...kandidaten];
  // دوران حتمي بدل خلط عشوائي — الموضع يتغيّر مع البذرة، ولا يثبت عند الأوّل
  const rot = hash(t.id + ":" + seed) % opts.length;
  const gedreht = [...opts.slice(rot), ...opts.slice(0, rot)];
  return { optionen: gedreht, richtigIndex: gedreht.findIndex((o) => o.richtig) };
}

export type EntdeckungsErgebnis = "richtig" | "falsch" | "uebersprungen";

/** رسالة ما بعد المحاولة — تُقال بصدق ولا تعاقب */
export function ergebnisText(e: EntdeckungsErgebnis): string {
  switch (e) {
    case "richtig": return "استنتجتَها بنفسك — الشرح الآن تثبيتٌ لما بنيتَه، لا تلقين.";
    case "falsch": return "ليست هي — وهذا مفيد: الفجوة التي شعرتَ بها الآن هي ما سيملؤه الشرح. اقرأه وأنت تبحث عن الفرق.";
    case "uebersprungen": return "تخطّيتَ الاستنتاج. الشرح متاح، لكن الأثر أضعف — جرّب في الدرس القادم أن تخمّن أولاً.";
  }
}
