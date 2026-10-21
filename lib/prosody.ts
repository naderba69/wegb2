/**
 * 017 Prosody — الإيقاع والأغنية
 * تقطيع الجملة إلى نبرات وإيقاع لتسهيل الحفظ (خاصة A0-A1).
 */
export function prosodyMark(satz: string): string { return satz.replace(/,/g, " —").replace(/\./g, " ♪"); }
export const PROSODY_SAETZE = ["Guten Morgen — wie geht es dir? ♪", "Eins, zwei, drei — dabei! ♪"];
