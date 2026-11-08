import type { PhonetikEinheit } from "./phonetikdaten";

export type KontrastSeite = "a" | "b";

export interface HoerKontrastQuiz {
  einheit: string;
  paar: number;
  seite: KontrastSeite;
  ok: number;
  versuche: number;
  beantwortet: boolean;
  meldung: string;
}

export interface HoerKontrastBewertung {
  quiz: HoerKontrastQuiz;
  angenommen: boolean;
  richtig: boolean;
}

/** Nur auditiv unterscheidbare Kontraste dürfen als Hörfrage erscheinen. */
export function pruefbareKontrastIndizes(einheit: PhonetikEinheit | undefined): number[] {
  if (!einheit || einheit.quizbar === false) return [];
  return einheit.paare
    .map((paar, index) => ({ paar, index }))
    .filter(({ paar }) => paar.auditivPruefbar !== false && paar.a.trim() !== paar.b.trim())
    .map(({ index }) => index);
}

function indexAusZufall(wert: number, laenge: number): number {
  if (laenge <= 1) return 0;
  const sicher = Number.isFinite(wert) ? Math.min(0.999999999, Math.max(0, wert)) : 0;
  return Math.floor(sicher * laenge);
}

/** Startet genau eine reproduzierbar testbare Hörfrage; leere/unprüfbare Einheiten liefern null. */
export function starteHoerKontrast(
  einheit: PhonetikEinheit | undefined,
  vorher: HoerKontrastQuiz | null = null,
  zufall: () => number = Math.random,
): HoerKontrastQuiz | null {
  const indizes = pruefbareKontrastIndizes(einheit);
  if (!einheit || indizes.length === 0) return null;
  const paar = indizes[indexAusZufall(zufall(), indizes.length)];
  const seite: KontrastSeite = zufall() < 0.5 ? "a" : "b";
  return {
    einheit: einheit.id,
    paar,
    seite,
    ok: vorher?.ok ?? 0,
    versuche: vorher?.versuche ?? 0,
    beantwortet: false,
    meldung: "🎧 سمعتَ كلمة — أيّها هي؟",
  };
}

/** Eine abgesendete Hörfrage zählt höchstens einmal, auch bei Doppelklick. */
export function bewerteHoerKontrast(
  quiz: HoerKontrastQuiz,
  einheit: PhonetikEinheit | undefined,
  wahl: KontrastSeite,
): HoerKontrastBewertung {
  if (quiz.beantwortet || !einheit || quiz.einheit !== einheit.id || !einheit.paare[quiz.paar]) {
    return { quiz, angenommen: false, richtig: false };
  }
  const richtig = wahl === quiz.seite;
  const ziel = einheit.paare[quiz.paar][quiz.seite];
  return {
    angenommen: true,
    richtig,
    quiz: {
      ...quiz,
      beantwortet: true,
      ok: quiz.ok + (richtig ? 1 : 0),
      versuche: quiz.versuche + 1,
      meldung: richtig
        ? `✅ صحيح — كانت «${ziel}».`
        : `❌ كانت «${ziel}». اسمع الفرق بالزوجين أدناه ثم ابدأ سؤالاً جديداً.`,
    },
  };
}
