/**
 * يولّد تدريباً أسبوعياً على فكّ المركَّبات الألمانية (Komposita) — من B1 فصاعداً.
 * يعتمد على مفكِّك المركَّبات في lib/komposita.ts الذي لا يفكّك إلا ما وجد
 * جميعُ مكوِّناته في المعجم (sicher = true).
 */
import { baueAufgaben, baueLexikon, type KompositaAufgabe } from "./komposita";
import { alleVokabeln } from "./content";
import { beiBankenBereit, beiVertiefungBereit } from "./bankload";
import { seededShuffle } from "./seeded-rng";
import type { Exercise, Level } from "./types";

let lexikon = baueLexikon(alleVokabeln);
function aktualisiereKompositaLexikon(): void {
  lexikon = baueLexikon(alleVokabeln);
}
beiBankenBereit(aktualisiereKompositaLexikon);
beiVertiefungBereit(aktualisiereKompositaLexikon);

/**
 * حقنة أسبوعية للمركَّبات من B1 فصاعداً.
 * تعود بمصفوفة من 3 أسئلة اختيار من متعدد على جنس المركَّب (يُشتق من الكلمة الأخيرة Grundwort).
 * في المستويات الأدنى من B1 تعود بمصفوفة فارغة.
 */
export function baueKompositaWoche(day: number, level: Level, wochencheck: boolean): Exercise[] {
  if (!wochencheck) return [];
  if (level !== "B1" && level !== "B2") return [];
  const aufgaben: KompositaAufgabe[] = baueAufgaben(alleVokabeln, lexikon, level, 3, day * 7919 + 31);
  return aufgaben.map((a, i) => {
    const grund = a.zerlegung.teile[a.zerlegung.teile.length - 1];
    const erklaerung =
      `الكلمةُ الأخيرة «${grund.lemma}» هي Grundwort وتأخذ أداة ${grund.article ?? "؟"}، فيكون جنس «${a.wort}» ${a.article}. المعنى: «${a.ar}».`;
    return {
      id: `komp-w-${day}-${i}`,
      type: "mc" as const,
      promptDe: `die / der / das … ${a.wort}? Welcher Artikel ist richtig?`,
      promptAr: `ما أداةُ المركَّب «${a.wort}»؟ (تذكَّر قاعدةَ الكلمةِ الأخيرة!)`,
      options: seededShuffle([...a.optionen], day + i * 7),
      answer: a.article,
      explanationAr: erklaerung,
      hint: `${a.article} ${a.wort}`,
    };
  });
}
