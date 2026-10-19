/**
 * ═══════════════════════════════════════════════════════════════════
 *  🎯 M6/R186 · تدريب أنماط الأخطاء المولّدة (Muster-Drill)
 * ═══════════════════════════════════════════════════════════════════
 *  من دفتر أخطاء المتعلّم نفسه: أضعف نمطين (بعائلات الفئات وخطورتها)
 *  يُدرَّبان يوميًا بأسئلة جديدة مولّدة من بنك التصحيح (196 زوجًا) —
 *  لا بإعادة سؤالٍ أخطأ فيه المتعلّم من قبل: أزواج دفتره مستبعدة
 *  صراحةً (الصواب والخطأ معًا)، وتناوب اليوم يبدّل الأسئلة.
 * ═══════════════════════════════════════════════════════════════════
 */
import { fehlerFamilien, FEHLER_KAT } from "./fehler";
import { fehlerList } from "./content";
import type { Exercise, Progress } from "./types";

export interface MusterInfo {
  art: string;
  titel: string;
  schwere: number;
  fragen: number;
}

export interface MusterDrillErgebnis {
  uebungen: Exercise[];
  muster: MusterInfo[];
  /** لا دفتر أخطاء بعد — لا نخترع أنماطًا */
  leer: boolean;
}

function norm(s: string): string {
  return s.trim().toLowerCase();
}
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * تدريب اليوم: حتى ٦ أسئلة على أضعف نمطين من دفتر المتعلّم.
 * حتمي لـ(progress, tag): التناوب اليومي يحرّك نافذة الاختيار داخل البنك.
 */
export function musterDrill(progress: Progress, tag: number, anzahl = 6): MusterDrillErgebnis {
  const fams = fehlerFamilien(progress).slice(0, 2);
  if (fams.length === 0) return { uebungen: [], muster: [], leer: true };

  const imHeft = new Set<string>();
  for (const f of Object.values(progress.fehler ?? {})) {
    imHeft.add(norm(f.falsch));
    imHeft.add(norm(f.richtig));
  }

  const uebungen: Exercise[] = [];
  const muster: MusterInfo[] = [];
  const konten: number[] = fams.map((_, i) =>
    i === 0 ? Math.ceil(anzahl / fams.length) + (fams.length === 1 ? 0 : 0) : Math.floor(anzahl / fams.length),
  );
  // توزيع عادل: الأول يأخذ الباقي عند القسمة غير المتساوية
  if (fams.length > 1) {
    konten[0] = anzahl - konten[1];
  }

  fams.forEach((fam, fi) => {
    const kandidaten = fehlerList.filter(
      (e) => e.kat === fam.art && !imHeft.has(norm(e.falsch)) && !imHeft.has(norm(e.richtig)),
    );
    if (kandidaten.length === 0) {
      muster.push({ art: fam.art, titel: fam.titel, schwere: fam.schwere, fragen: 0 });
      return;
    }
    const start = ((tag * 3) + fi * 2) % kandidaten.length;
    const anzahlHier = Math.min(konten[fi], kandidaten.length);
    let genommen = 0;
    for (let k = 0; k < kandidaten.length && genommen < anzahlHier; k++) {
      const item = kandidaten[(start + k) % kandidaten.length];
      const rnd = mulberry32(hash(`muster-${fam.art}-${item.id}-${tag}`));
      const andereFalsche = kandidaten
        .filter((x) => x.id !== item.id)
        .map((x) => x.falsch)
        .filter((f) => norm(f) !== norm(item.falsch) && norm(f) !== norm(item.richtig));
      const ablenker: string[] = [];
      for (let d = 0; d < andereFalsche.length && ablenker.length < 2; d++) {
        const cand = andereFalsche[(start + d * 5) % andereFalsche.length];
        if (!ablenker.includes(cand)) ablenker.push(cand);
      }
      const options = [item.richtig, item.falsch, ...ablenker];
      for (let j = options.length - 1; j > 0; j--) {
        const mm = Math.floor(rnd() * (j + 1));
        [options[j], options[mm]] = [options[mm], options[j]];
      }
      uebungen.push({
        id: `muster-${fam.art}-${item.id}`,
        type: "mc",
        promptDe: "Welche Form ist richtig?",
        promptAr: `نمط «${FEHLER_KAT[fam.art] ?? fam.art}» (من أضعف أنماطك): اختر الصيغة الصحيحة`,
        options,
        answer: item.richtig,
        explanationAr: item.ar,
      });
      genommen++;
    }
    muster.push({ art: fam.art, titel: fam.titel, schwere: fam.schwere, fragen: genommen });
  });

  return { uebungen, muster, leer: false };
}
