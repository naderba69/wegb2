import { dialogAudioIstKi, dialogAudioSrc, dialogues, hoerenAudio, hoerneu, leseText, texts } from "./content";
import { rng } from "./plan";
import type { Level } from "./types";

/**
 * 📻 A16 (R296, Experten-Audit): erweitertes freies Input —
 * Hör-/Lese-Eingabe außerhalb des Tagesplans, aus vorhandenen
 * Banken zusammengestellt. KI-Erzeugtes ist je Item gekennzeichnet;
 * nichts wird hier neu generiert oder als Hausaufnahme verkauft.
 */
export interface InputItem {
  art: "dialog" | "hoerneu" | "text";
  id: string;
  titelDe: string;
  titelAr: string;
  level: string;
  ki: boolean;
  audio: string | null;
  minuten: number;
}

export function inputPaket(level: Level | "alle", zielMinuten: number, samen: number): InputItem[] {
  const rand = rng(samen * 31 + 7);
  const pool: InputItem[] = [];
  for (const d of dialogues) {
    if (level !== "alle" && d.level !== level) continue;
    pool.push({
      art: "dialog", id: d.id, titelDe: d.titleDe, titelAr: d.titleAr, level: d.level,
      ki: dialogAudioIstKi(d.id), audio: dialogAudioSrc(d.id),
      minuten: Math.max(1, Math.round(d.lines.reduce((a, l) => a + l.de.length, 0) / 700)),
    });
  }
  for (const h of hoerneu) {
    if (level !== "alle" && h.level !== level) continue;
    pool.push({
      art: "hoerneu", id: h.id, titelDe: h.titelDe, titelAr: h.titelAr, level: h.level,
      ki: true, audio: h.clips[0]?.datei ?? null, minuten: 2,
    });
  }
  for (const t of texts) {
    if (level !== "alle" && t.level !== level) continue;
    const lang = leseText(t);
    pool.push({
      art: "text", id: t.id, titelDe: t.titleDe, titelAr: t.titleAr, level: t.level,
      ki: false, audio: hoerenAudio[t.id]?.file ?? null,
      minuten: Math.max(1, Math.round(lang.de.split(/\s+/).length / 130)),
    });
  }
  const gemischt = [...pool];
  for (let i = gemischt.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [gemischt[i], gemischt[j]] = [gemischt[j], gemischt[i]];
  }
  const out: InputItem[] = [];
  let summe = 0;
  for (const item of gemischt) {
    if (summe >= zielMinuten) break;
    out.push(item);
    summe += item.minuten;
  }
  return out;
}
