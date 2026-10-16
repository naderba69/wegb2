// lib/redemittel.ts — بنك وسائل التعبير الوظيفية (C3/R176)
// العقد: عبارات مصنّفة بوظيفتها البلاغية وبأجزاء الامتحان التي تخدمها (A2–B2)،
// لكلّ عبارة مثالٌ كامل بترجمته؛ الاختيار حتميّ بالبذرة، والتدريب استرجاعٌ ذاتيّ لا تصحيحٌ آليّ مدّعى.

import { redemittelBank, type RedemittelItem } from "./content";

export const REDE_FUNKTIONEN: { key: string; ar: string }[] = [
  { key: "einleitung", ar: "افتتاح وتقديم" },
  { key: "meinung", ar: "إبداء الرأي" },
  { key: "begruendung", ar: "تعليل وتسبيب" },
  { key: "zustimmung", ar: "موافقة وتأييد" },
  { key: "widerspruch", ar: "اعتراض ومخالفة" },
  { key: "vergleich", ar: "مقارنة وموازنة" },
  { key: "vorschlag", ar: "اقتراح وتخطيط" },
  { key: "zusammenfassung", ar: "تلخيص وخاتمة" },
  { key: "beschwerde", ar: "شكوى ومطالبة" },
  { key: "nachfrage", ar: "استفسار وتوضيح" },
  { key: "beschreibung", ar: "وصف وترتيب" },
];

export type RedeTeil = "sprechen1" | "sprechen2" | "sprechen3" | "forum" | "brief";

export const REDE_TEILE: { key: RedeTeil; ar: string }[] = [
  { key: "sprechen1", ar: "تحدّث 1 — تعارف" },
  { key: "sprechen2", ar: "تحدّث 2 — عرض ووصف" },
  { key: "sprechen3", ar: "تحدّث 3 — مناقشة وتخطيط" },
  { key: "forum", ar: "كتابة — منتدى ورأي" },
  { key: "brief", ar: "كتابة — رسالة وشكوى" },
];

export const funktionAr = (key: string): string => REDE_FUNKTIONEN.find((f) => f.key === key)?.ar ?? key;

/** مولّد حتمي (mulberry32) */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function mischen<T>(arr: readonly T[], r: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** عبارات جزءِ امتحانٍ واحد بترتيبٍ حتميّ بالبذرة (لألواح التهيئة في مهامّ الكلام والكتابة) */
export function redemittelFuerTeil(teil: RedeTeil, seed: number, anzahl = 4): RedemittelItem[] {
  const pool = redemittelBank.filter((x) => x.teile.includes(teil));
  if (!pool.length) return [];
  return mischen(pool, rng(seed * 31 + teil.length * 7)).slice(0, Math.min(anzahl, pool.length));
}

/** جولة تدريب إكمال/استرجاع حتمية من البنك كله */
export function drillRunde(seed: number, anzahl = 8): RedemittelItem[] {
  if (!redemittelBank.length) return [];
  return mischen(redemittelBank, rng(seed * 17 + 3)).slice(0, Math.min(anzahl, redemittelBank.length));
}

export type { RedemittelItem };
