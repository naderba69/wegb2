import type { MuendlichEinwand } from "./content";

export interface GeplanterEinwand {
  einwand: MuendlichEinwand;
  /** Seconds after start; kept hidden until the speaking timer reaches it. */
  nachSekunden: number;
}

const EINWAND_MIN_SEKUNDEN = 60;
const EINWAND_MAX_SEKUNDEN = 120;

function hashId(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function zufall(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), 1 | value);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Picks one context-specific objection and its reveal time without Math.random,
 * network access, or learner data. Repeating the same day/card/round repeats it.
 */
export function planeEinwand(
  cardId: string,
  einwaende: readonly MuendlichEinwand[],
  day: number,
  zug: number,
): GeplanterEinwand | null {
  if (!einwaende.length) return null;
  const daySeed = Math.imul(Math.max(0, Math.floor(day)), 0x45d9f3b);
  const roundSeed = Math.imul(Math.max(0, Math.floor(zug)), 0x119de1f3);
  const random = zufall((hashId(cardId) ^ daySeed ^ roundSeed) >>> 0);
  const index = Math.floor(random() * einwaende.length);
  const nachSekunden = EINWAND_MIN_SEKUNDEN + Math.floor(random() * (EINWAND_MAX_SEKUNDEN - EINWAND_MIN_SEKUNDEN + 1));
  return { einwand: einwaende[index], nachSekunden };
}
