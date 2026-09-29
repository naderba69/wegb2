import { vocabMap } from "@/lib/content";

export type ExportKarte = {
  vorne: string;      // الوجه: الألمانيةُ بأداتِها
  farbe: string;      // مرساةُ اللون: BLAU/ROT/GRÜN
  hinten: string;     // الظهر: عربية (وفرنسيةٌ إن وُجِدَت)
  chunk: string;      // الكتلةُ السياقية
  synonyme: string;   // مرادفات/أضداد
  aussprache: string; // تلميحُ النطق
};

const FARBE_AR: Record<string, string> = { BLAU: "أزرق (der)", ROT: "أحمر (die)", GRÜN: "أخضر (das)" };

/** الحقولُ الستّةُ التي يطلبُها قالبُ البطاقات — من البنكِ لا من التقدير. */
export function exportKarten(deckId: string): ExportKarte[] {
  const deck = (vocabMap as unknown as Record<string, { cards: Record<string, unknown>[] }>)[deckId];
  if (!deck) return [];
  return deck.cards.map((c) => {
    const de = String(c.de ?? "");
    const ar = String(c.ar ?? "");
    const fr = c.fr ? String(c.fr) : "";
    const farbe = c.farbe ? String(c.farbe) : "";
    return {
      vorne: de.toUpperCase(),
      farbe: farbe ? `${farbe} — ${FARBE_AR[farbe] ?? ""}`.trim() : "—",
      hinten: fr ? `${ar} | ${fr}` : ar,
      chunk: c.exampleDe ? `${String(c.exampleDe)} — ${String(c.exampleAr ?? "")}` : "—",
      synonyme: c.synonyme ? String(c.synonyme) : "—",
      aussprache: c.aussprache ? String(c.aussprache) : "—",
    };
  });
}

const esc = (s: string) => s.replace(/;/g, ",").replace(/[\r\n]+/g, " ").trim();

/** CSV بفاصلةٍ منقوطة: يُلصَقُ مباشرةً في Google Sheets أو Anki. */
export function karteninCsv(deckId: string): string {
  const kopf = "Vorderseite;Farbanker;Rückseite;Chunk;Synonyme;Aussprache";
  const zeilen = exportKarten(deckId).map((k) =>
    [k.vorne, k.farbe, k.hinten, k.chunk, k.synonyme, k.aussprache].map(esc).join(";")
  );
  return [kopf, ...zeilen].join("\n");
}

/** كلُّ الحزمِ في ملفٍّ واحد — مع عمودِ الحزمةِ والمستوى. */
export function allesInCsv(): string {
  const kopf = "Deck;Niveau;Vorderseite;Farbanker;Rückseite;Chunk;Synonyme;Aussprache";
  const zeilen: string[] = [];
  for (const [id, deck] of Object.entries(vocabMap as unknown as Record<string, { level: string; cards: unknown[] }>)) {
    for (const k of exportKarten(id)) {
      zeilen.push([id, deck.level, k.vorne, k.farbe, k.hinten, k.chunk, k.synonyme, k.aussprache].map(esc).join(";"));
    }
  }
  return [kopf, ...zeilen].join("\n");
}
