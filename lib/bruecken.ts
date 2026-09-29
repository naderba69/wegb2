/**
 * ═══════════════════════════════════════════════════════════════
 *  مولِّدُ تمارينِ التركات — الشفرةُ تُمتَحَنُ لا تُقرَأُ فقط
 * ═══════════════════════════════════════════════════════════════
 *  يأخذُ تركاتِ الدرسِ الواحدِ ويُولِّدُ منها أسئلةَ اختيارٍ حتميةً
 *  (نفسُ البذرةِ ← نفسُ الأسئلة) على نوعَين:
 *   ① الأداة: «die Zeitung» ← ما أداتُها؟ والشفرةُ هي التفسير.
 *   ② التطبيق: جملةٌ/سطرٌ شاهدٌ ← أيُّ شفرةٍ تحكمُه؟
 *  كلُّ سؤالٍ يحملُ تفسيرَهُ العربيَّ واسمَ شفرتِه، وكلُّ خطأٍ
 *  يُدفَنُ في دفترِ الأخطاءِ بفئتِه الصحيحة.
 */
import type { Eselsbruecke } from "./types";
import { rng } from "./plan";

export interface BrueckeItem {
  id: string;
  art: "artikel" | "zuordnung";
  frageAr: string;
  frageDe: string;
  optionen: string[];
  antwort: string;
  erklaerungAr: string;
  quelleId: string;
  quelleTitel: string;
  kat: string;
}

const ART_RE = /^(der|die|das)\s+([A-ZÄÖÜ][\wäöüß-]*)/;

/** فئةُ دفترِ الأخطاءِ المناسبةُ لقسمِ التركة */
export function katVonSektion(sek: Eselsbruecke["sektion"]): string {
  switch (sek) {
    case "genus":
      return "artikel";
    case "praeposition":
      return "praeposition";
    case "satzbau":
      return "wortstellung";
    case "verb":
      return "zeitform";
    case "adjektiv":
    case "b2":
      return "konstruktion";
    default:
      return "sonst";
  }
}

/** مزجٌ حتميٌّ بالبذرةِ نفسِها — لا Math.random في أيِّ محتوى */
function mische<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * يُولِّدُ حتى `max` سؤالاً من تركاتِ درسٍ واحد.
 * الحتمية: نفسُ (gramId, seed) ← نفسُ الأسئلةِ بنفسِ الترتيب.
 */
export function buildBrueckeItems(
  bruecken: Eselsbruecke[],
  seed: number,
  max = 6,
  /** مَعينُ المشتِّتات: البنكُ كلُّه افتراضاً لا تركاتُ الدرسِ وحدَها — وإلا جفَّ امتحانُ درسٍ ذي تركةٍ واحدة */
  pool: Eselsbruecke[] = bruecken,
): BrueckeItem[] {
  if (!bruecken.length) return [];
  const rand = rng(seed * 7919 + bruecken.length);
  const items: BrueckeItem[] = [];

  // ① أسئلةُ الأداة — من كلِّ سطرٍ ألمانيٍّ يبدأُ بأداةٍ واسمٍ علَم
  for (const b of bruecken) {
    for (const z of b.zeilen) {
      const m = z.de.match(ART_RE);
      if (!m) continue;
      const [, art, wort] = m;
      items.push({
        id: `${b.id}:art:${wort}`,
        art: "artikel",
        frageAr: "ما أداةُ هذا الاسم؟ استحضِرِ الشفرةَ قبلَ أن تُخمِّن.",
        frageDe: `___ ${wort}`,
        optionen: ["der", "die", "das"],
        antwort: art,
        erklaerungAr: `${b.titleAr} — القاعدة: ${z.code} ← ${z.ar}`,
        quelleId: b.id,
        quelleTitel: b.titleAr,
        kat: "artikel",
      });
    }
  }

  // ② أسئلةُ الإسناد — شاهدٌ ألمانيٌّ وأيُّ شفرةٍ تحكمُه (يحتاجُ ثلاثَ تركاتٍ فأكثر للتشتيت)
  const alle = bruecken;
  const stoererPool = pool.length >= 3 ? pool : bruecken;
  if (stoererPool.length >= 3) {
    for (const b of alle) {
      // كلُّ سطرٍ شاهدٍ صالحٍ يُولِّدُ سؤالَه — لا أوَّلُ سطرٍ وحدَه (حتى ثلاثةٍ لكلِّ شفرةٍ كيلا تطغى واحدةٌ على الامتحان)
      const zeugen = b.zeilen.filter((x) => !ART_RE.test(x.de) && x.de.length > 12).slice(0, 3);
      for (const z of zeugen) {
      const stoerer = mische(
        stoererPool.filter((x) => x.id !== b.id && x.sektion === b.sektion).map((x) => x.titleAr),
        rand,
      ).concat(
        mische(stoererPool.filter((x) => x.id !== b.id && x.sektion !== b.sektion).map((x) => x.titleAr), rand),
      ).slice(0, 2);
      if (stoerer.length < 2) continue;
      items.push({
        id: `${b.id}:zu:${z.code.slice(0, 12)}`,
        art: "zuordnung",
        frageAr: "أيُّ شفرةٍ تحكمُ هذا الشاهد؟",
        frageDe: z.de,
        optionen: mische([b.titleAr, ...stoerer], rand),
        antwort: b.titleAr,
        erklaerungAr: `${z.code} ← ${z.ar}`,
        quelleId: b.id,
        quelleTitel: b.titleAr,
        kat: katVonSektion(b.sektion),
        });
      }
    }
  }

  return mische(items, rand).slice(0, max);
}
