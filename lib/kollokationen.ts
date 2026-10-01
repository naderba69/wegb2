import kollokRaw from "@/content/kollokationen.json";
import type { Exercise, VocabCard } from "./types";
import { pickN } from "./plan";

/** المتلازمات اللفظية: لكلّ بطاقة 2–3 عبارات ثابتة تحوي كلمةَ البطاقة (content/kollokationen.json) */
export const kollokationen = kollokRaw as unknown as Record<string, string[]>;

export function kollokationenFuer(card: Pick<VocabCard, "id">): string[] {
  return kollokationen[card.id] ?? [];
}

const norm = (s: string) => s.toLowerCase().replace(/é/g, "e").replace(/[^a-zäöüß0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const STEM = (w: string) => norm(w).replace(/^(der|die|das|sich)\s+/, "").split(" ").filter((p) => p.length > 2).map((p) => p.slice(0, Math.max(4, p.length - 2)));

/** الكلمةُ الشريكةُ في المتلازمة: كلُّ ما ليس كلمةَ البطاقةِ ولا أداةً — تُخفى في التمرين */
export function partnerWort(card: Pick<VocabCard, "de">, kollok: string): string | null {
  const stems = STEM(card.de);
  const woerter = kollok.split(/\s+/);
  const kandidaten = woerter
    .map((w, i) => ({ w, i, n: norm(w) }))
    .filter(({ n }) => n.length > 2 && !/^(eine|einen|einer|eines|einem|ein|der|die|das|den|dem|des|sich|auf|über|von|mit|nach|für|gegen|unter|zwischen|zum|zur|nicht|ohne|dass|laut|wegen|beim|vom|aus|ist|hat|und|oder|als|per|nur|mehr|sehr|ganz|fest|voll|neu|gut|hoch|groß|klein)$/.test(n))
    .filter(({ n }) => !stems.some((st) => n.includes(st)));
  if (!kandidaten.length) return null;
  // الشريكُ الأنسب: آخرُ فعلٍ/اسمٍ في العبارة (الأفعالُ في الآخر، الصفاتُ في الأوّل)
  return kandidaten[kandidaten.length - 1].w;
}

/**
 * تمرينُ «أكمل المتلازمة»: تُخفى الكلمةُ الشريكةُ، والخياراتُ الخاطئةُ شركاءُ بطاقاتٍ أخرى
 * لا يظهرون في أيِّ متلازمةٍ لهذه البطاقة — فلا خيارَ ثانٍ صحيحاً.
 */
export function kollokationUebung(card: VocabCard, alle: VocabCard[], rand: () => number, idx = 0): Exercise | null {
  const ks = kollokationenFuer(card);
  const uebbar = ks.filter((x) => partnerWort(card, x));
  if (!uebbar.length) return null;
  const k = uebbar[idx % uebbar.length];
  const partner = partnerWort(card, k)!;
  const eigeneText = " " + ks.map(norm).join(" ") + " ";
  const eigene = { has: (n: string) => eigeneText.includes(n) };
  const fremde = alle
    .filter((c) => c.id !== card.id && kollokationen[c.id])
    .flatMap((c) => kollokationen[c.id].map((x) => partnerWort(c, x)))
    .filter((p): p is string => !!p && !eigene.has(norm(p)) && norm(p) !== norm(partner));
  const distr = pickN([...new Set(fremde)], 2, rand);
  if (distr.length < 2) return null;
  const masked = k.split(/\s+/).map((w) => (w === partner ? "_____" : w)).join(" ");
  const options = pickN([partner, ...distr], 3, rand);
  return {
    id: `kol-${card.id}-${idx}`,
    type: "mc",
    promptDe: masked,
    promptAr: `أكمل المتلازمة اللفظية لكلمة «${card.de}»`,
    options,
    answer: partner,
    explanationAr: `المتلازمة الثابتة: «${k}». ${card.de} = ${card.ar}. المتلازمات الأخرى: ${ks.filter((x) => x !== k).join(" · ") || "—"}`,
  };
}
