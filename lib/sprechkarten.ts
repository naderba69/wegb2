// lib/sprechkarten.ts — بطاقات محادثة الامتحان المسجّلة (E5/R174)
// العقد: بطاقات الأجزاء الثلاثة من بنك الشفهي، تحضيرٌ موقوت بصيغة الامتحان،
// تسجيلٌ محليٌّ فقط (يعيش في ذاكرة الجلسة ولا يُحفظ أبدًا)، وتقييمٌ ذاتيٌّ
// بشبكةٍ رباعية معلنة — التطبيق لا يحكم على النطق آليًّا في أيّ موضع.

import { kontaktKarten, muendlich, type KontaktKarte, type MuendlichKarte } from "./content";
import { RUBRIK_PUNKTE } from "./simulation";

export type SprechLevel = "A2" | "B1" | "B2";

export const SPRECH_LEVELS: { id: SprechLevel; labelAr: string; formatAr: string }[] = [
  { id: "A2", labelAr: "A2 — نحو DTZ", formatAr: "بطاقات مستوى A2، تحضير 20 دقيقة (صيغة DTZ)" },
  { id: "B1", labelAr: "B1 — Goethe/DTZ", formatAr: "بطاقات مستوى B1، تحضير 15 دقيقة (صيغة Goethe)" },
  { id: "B2", labelAr: "B2 — Goethe/telc", formatAr: "بطاقات مستوى B2، تحضير 15 دقيقة (صيغة Goethe)" },
];

/** دقائق التحضير الرسمية قبل التحدّث: Goethe ‏(B1/B2) ‏15، وDTZ ‏20 */
export const VORBEREITUNG_MIN: Record<SprechLevel, number> = { A2: 20, B1: 15, B2: 15 };

/** مولّد حتمي (mulberry32) — كالمحاكاة */
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

function ziehe<T>(pool: readonly T[], r: () => number): T | null {
  if (!pool.length) return null;
  return pool[Math.floor(r() * pool.length)];
}

export interface SprechRunde {
  level: SprechLevel;
  seed: number;
  /** جزء 1: تعارف/أسئلة تمهيدية — إحماء غير مُقيَّم */
  kontakt: KontaktKarte | null;
  /** جزء 2: عرض/وصف (Vortrag) */
  teil2: MuendlichKarte | null;
  /** جزء 3: مناقشة/تخطيط (Diskussion) */
  teil3: MuendlichKarte | null;
  vorbereitungMin: number;
}

/** جولة بطاقات حتمية بالبذرة من بنك الشفهي وحده، بمستوى واحد نقي. */
export function baueSprechRunde(seed: number, level: SprechLevel): SprechRunde {
  const r = rng(seed * 31 + (level === "A2" ? 7 : level === "B1" ? 13 : 17));
  return {
    level,
    seed,
    kontakt: ziehe(kontaktKarten.filter((k) => k.level === level), r),
    teil2: ziehe(muendlich.filter((k) => k.teil === 2 && k.level === level), r),
    teil3: ziehe(muendlich.filter((k) => k.teil === 3 && k.level === level), r),
    vorbereitungMin: VORBEREITUNG_MIN[level],
  };
}

/** ميزانية التحدّث بالثواني من البطاقة (احتياطي: 3/4/5 دقائق للأجزاء 1/2/3) */
export function sprechBudgetSekunden(teil: 1 | 2 | 3, karte?: { zeit_s?: number } | null): number {
  if (karte?.zeit_s && karte.zeit_s > 0) return karte.zeit_s;
  return teil === 1 ? 180 : teil === 2 ? 240 : 300;
}

/**
 * شبكة التقييم الذاتي الرباعية (بعد سماع تسجيلك بنفسك):
 * طلاقة · مفردات · تراكيب · نطق كما قدّرته أنت — لا قياس آليًّا للنطق هنا.
 * الدرجات بالمقياس نفسه في المحاكاة: A..E ← ‏25/19/13/6/0.
 */
export const SPRECH_KRITERIEN = [
  { key: "fluessigkeit", de: "Flüssigkeit", ar: "الطلاقة: استمررتُ بلا توقّفات طويلة تائهة" },
  { key: "wortschatz", de: "Wortschatz", ar: "المفردات: كلمات مناسبة للموقف بلا بحثٍ مرهق" },
  { key: "strukturen", de: "Strukturen", ar: "التراكيب: جمل متنوّعة لا جمل قصيرة متطابقة" },
  { key: "aussprache", de: "Aussprache (von dir selbst gehört)", ar: "النطق: كما سمعتُه أنا في تسجيلي واضحًا مفهومًا" },
] as const;

export type SprechKriteriumKey = (typeof SPRECH_KRITERIEN)[number]["key"];

/** مجموع شبكة ذاتية (4 معايير × درجة 0..4) بمقياس RUBRIK_PUNKTE */
export function selbstPunkte(stufen: readonly number[]): number {
  return stufen.reduce((a, s) => a + (RUBRIK_PUNKTE[s] ?? 0), 0);
}
