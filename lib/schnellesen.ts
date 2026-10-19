import { leseText, texts } from "./content";
import { rng } from "./plan";

/**
 * ⚡ A10 (R292, Experten-Audit): funktionelles Schnelllesen —
 * Skimming (Gist-Frage) + Scanning (Zahlen/Ziele im Text finden),
 * zeitlich begrenzt. Fragen werden deterministisch aus echten
 * Banktexten gebaut; keine erfundenen Inhalte.
 */
export interface ScanFrage {
  frageAr: string;
  optionen: string[];
  richtig: number;
}

export interface ScanRunde {
  textId: string;
  titelDe: string;
  titelAr: string;
  textDe: string;
  gistFrageAr: string;
  gistOptionen: string[];
  gistRichtig: number;
  scan: ScanFrage[];
  sekunden: number;
}

const zahlenIn = (text: string): string[] => [...new Set(text.match(/\d+(?:[.,]\d+)?/g) ?? [])];

const saetzeVon = (text: string): string[] =>
  text.replace(/\s+/g, " ").split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter((s) => s.length > 15);

function scanFragen(textDe: string, rand: () => number): ScanFrage[] {
  const saetze = saetzeVon(textDe);
  const alleZahlen = zahlenIn(textDe);
  const fragen: ScanFrage[] = [];
  for (const satz of saetze) {
    if (fragen.length >= 3) break;
    const z = satz.match(/\d+(?:[.,]\d+)?/);
    if (!z) continue;
    const korrekt = z[0];
    const schluessel = satz
      .split(/\s+/)
      .filter((w) => /^[A-ZÄÖÜ][a-zäöüß]{3,}$/.test(w))
      .sort((a, b) => b.length - a.length)[0];
    if (!schluessel) continue;
    const andere = alleZahlen.filter((n) => n !== korrekt);
    if (andere.length < 2) continue;
    const optionen = [korrekt, andere[0], andere[1]];
    const richtig = Math.floor(rand() * 3);
    const [kopie] = optionen.splice(0, 1);
    optionen.splice(richtig, 0, kopie);
    fragen.push({ frageAr: `ابحث في النص: ما الرقم المرتبط بـ«${schluessel}»؟`, optionen, richtig });
  }
  return fragen;
}

export function scanRunde(samen: number): ScanRunde | null {
  const rand = rng(samen * 7919 + 13);
  const kandidaten = texts.filter((t) => {
    const lang = leseText(t);
    return zahlenIn(lang.de).length >= 3;
  });
  if (kandidaten.length < 3) return null;
  for (let versuch = 0; versuch < kandidaten.length; versuch++) {
    const text = kandidaten[Math.floor(rand() * kandidaten.length)];
    const lang = leseText(text);
    const scan = scanFragen(lang.de, rand);
    if (scan.length < 2) continue;
    const andereTitel = kandidaten.filter((t) => t.id !== text.id);
    const gistOptionen = [text.titleDe, andereTitel[0].titleDe, andereTitel[1].titleDe];
    const gistRichtig = Math.floor(rand() * 3);
    const [echt] = gistOptionen.splice(0, 1);
    gistOptionen.splice(gistRichtig, 0, echt);
    return {
      textId: text.id,
      titelDe: text.titleDe,
      titelAr: text.titleAr,
      textDe: lang.de,
      gistFrageAr: "مسح سريع (Skimming): ما موضوع هذا النص أساسًا؟",
      gistOptionen,
      gistRichtig,
      scan,
      sekunden: 120,
    };
  }
  return null;
}
