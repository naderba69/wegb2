/**
 * 101 Recast — إعادة صياغة ضمنية: يصحح المعلم الخطأ دون قطع التدفق.
 * مثال: Learner: "Ich habe gegangen" → Teacher: "Ach, du bist gegangen?"
 */
export function recast(falsch: string, richtig: string): string { return richtig; }
export const RECAST_BEISPIELE = [{ falsch: "Ich habe gegangen", richtig: "Ich bin gegangen" }];
