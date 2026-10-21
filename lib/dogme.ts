/**
 * 036 Dogme — بلا كتاب، من كلام المتعلم
 * جلسة توليد حر: المتعلم يكتب 3 جمل عن يومه، تُصحح فوراً.
 */
export interface DogmePrompt { level: string; frageDe: string; frageAr: string; }
export const DOGME_PROMPTS: DogmePrompt[] = [
  { level: "B1", frageDe: "Was hast du heute gelernt?", frageAr: "ماذا تعلمت اليوم؟" },
  { level: "B2", frageDe: "Welche Meinung hast du zum Thema?", frageAr: "ما رأيك في الموضوع؟" },
];
