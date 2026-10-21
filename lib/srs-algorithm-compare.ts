/**
 * 121 SRS Algorithm Compare — مقارنة Leitner/SM2/FSRS: اختيار الأمثل حسب المستوى.
 */
export const SRS_ALGOS = [{ id: "leitner", name: "Leitner-5" }, { id: "fsrs", name: "FSRS-4.5" }, { id: "sm2", name: "SM-2" }] as const;
export function besteFuer(level: string): string { return level==="A0" ? "leitner" : "fsrs"; }
