/**
 * ============================================================
 *  Weg-Engine — البوصلة المولَّدة من سجلّ الأنشطة
 * ============================================================
 *  لا قائمةَ تُختَرع هنا: المرحلة (1..8) تُشتق من يوم الخطة،
 *  واختيار اليوم تُرشِّحه شبكةُ الكفاءات ذاتها — فتتصدر
 *  الأنشطةُ التي تعالج أضعف كفاءة عندك وتُغذّي دفترَ أخطائك،
 *  وما هو أبكر من مستواك يُعرض خلف قفل «يُفتح في المرحلة N»
 *  بدل أن يضيع المتعلم في جدار ثلاثين أكورديون.
 *  حتمي: يومٌ واحد + مستوى واحد = مسارٌ واحد (يُثبِته الدخان K20).
 * ============================================================
 */
import { AKTIVITAETEN, type Aktivitaet } from "./aktivitaeten";
import { KOMPETENZEN, KOMPETENZ_AR, kompetenzWerte } from "./kompetenz";
import { rng } from "./plan";
import { TOTAL_DAYS, type Progress } from "./types";

export const STUFEN = 8;

/** يوم 1..378 ← مرحلة 1..8 (خطية، بلا ثغرات ولا تكرار) */
export function stufeVonTag(day: number): number {
  return Math.min(STUFEN, Math.max(1, Math.floor(((day - 1) * STUFEN) / TOTAL_DAYS) + 1));
}

/** عكسها: المرحلة ← نطاق أيامها المفتوح */
export function tagVonStufe(stufe: number): [number, number] {
  const s = Math.min(STUFEN, Math.max(1, stufe));
  const from = Math.floor(((s - 1) * TOTAL_DAYS) / STUFEN) + 1;
  const to = Math.min(TOTAL_DAYS, Math.floor((s * TOTAL_DAYS) / STUFEN));
  return [from, to];
}

/** مرساة التمرير: ما يملك بطاقة مستقلة بذاته، وما يؤول لجناحه */
const ANKER: Record<string, string> = {
  blitz: "blitz",
  briefe: "briefe",
  interview2: "interview",
  lernstrategie: "lernstrategie",
  muendlich: "muendlich",
  schulsim: "schulsim",
  testarten: "selbsttest",
};
export function ankerVon(a: Aktivitaet): string {
  return ANKER[a.id] ?? `wing-${a.fluegel}`;
}

export type WegItem = { akt: Aktivitaet; anker: string; grundAr: string };
export type Weg = {
  stufe: number;
  von: number;
  bis: number;
  heute: WegItem[];
  offen: WegItem[];
  spaeter: { akt: Aktivitaet; ab: number }[];
};

/** البوصلة كاملة ليوم المتعلم — ثلاثية منتقاة + ما تيسر + المقفل */
export function wegHeute(progress: Progress): Weg {
  const day = progress.plan.day;
  const stufe = stufeVonTag(day);
  const [von, bis] = tagVonStufe(stufe);
  const w = kompetenzWerte(progress);
  const schwach = [...KOMPETENZEN].sort((a, b) => w[a].wert - w[b].wert)[0];
  const hatFehler = Object.keys(progress.fehler ?? {}).length > 0;
  const live = AKTIVITAETEN.filter((a) => a.status === "live" && a.id !== "wegweiser");
  const offenRaw = live.filter((a) => a.stufe[0] <= stufe && stufe <= a.stufe[1]);
  const rand = rng(day * 71 + 7);
  const scored = offenRaw
    .map((a, i) => {
      let score = 0;
      if (a.handlung.includes(schwach) && w[schwach].wert < 75) score += 3;
      if (a.fehlerarten !== "—" && hatFehler) score += 1;
      if (a.nurKatalog) score -= 2;
      return { a, i, score, jitter: rand() * 0.5 };
    })
    .sort((x, y) => y.score - x.score || y.jitter - x.jitter || x.i - y.i);
  const grund = (a: Aktivitaet): string =>
    a.handlung.includes(schwach) && w[schwach].wert < 75
      ? `لأنها تُدرّب «${KOMPETENZ_AR[schwach]}» — أضعف كفاءة عندك الآن (${w[schwach].wert}٪)`
      : a.fehlerarten !== "—" && hatFehler
        ? "لأنها تعالج دفتر أخطائك أيضاً"
        : "لأنها في متناول مرحلتك";
  const items: WegItem[] = scored.map(({ a }) => ({ akt: a, anker: ankerVon(a), grundAr: grund(a) }));
  return {
    stufe,
    von,
    bis,
    heute: items.slice(0, 3),
    offen: items.slice(3),
    spaeter: live.filter((a) => a.stufe[0] > stufe).map((a) => ({ akt: a, ab: a.stufe[0] })),
  };
}
