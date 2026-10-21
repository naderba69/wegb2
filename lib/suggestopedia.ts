/**
 * 042 Suggestopedia إيحاء — موسيقى خلفية + استرخاء + نص طويل.
 */
export interface SuggestoSitzung { id: string; musik: string; textDe: string; textAr: string; level: string; }
export const SUGGESTO: SuggestoSitzung[] = [
  { id: "sug-01", musik: "Barock 60bpm", textDe: "Entspannungstext: Reise durch Deutschland", textAr: "نص استرخاء: رحلة عبر ألمانيا", level: "A0" },
];
