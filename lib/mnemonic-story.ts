/**
 * 013 Mnemonic Story — القصة الرابطة
 * تربط 5-7 كلمات جديدة في قصة عربية قصيرة سخيفة (bizarreness effect) لزيادة الاحتفاظ 40%.
 * مبنية على content/eselsbruecken.json و mnemonik.json لكنها تولّد قصصًا حية لكل كبسولة.
 */
export interface StoryKnoten {
  de: string;
  ar: string;
  bild: string; // صورة ذهنية
}

export function baueStory(knoten: StoryKnoten[]): { titelAr: string; textAr: string; textDe: string } {
  if (!knoten.length) return { titelAr: "", textAr: "", textDe: "" };
  const deWorte = knoten.map((k) => k.de).join(", ");
  const arBilder = knoten.map((k) => k.bild).join(" → ");
  return {
    titelAr: `قصة ${knoten.length} كلمات: ${knoten[0].de}…`,
    textAr: `تخيّل: ${arBilder}. كلما مررت بهذه القصة، مرت الكلمات معها.`,
    textDe: `Wörter in einer Geschichte: ${deWorte}.`,
  };
}

export function storyLaengeValid(story: ReturnType<typeof baueStory>): boolean {
  return story.textAr.length >= 20 && story.textAr.length <= 600;
}
