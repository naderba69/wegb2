import type { Progress } from "./types";

/**
 * 🎯 A19 (R284, Experten-Audit ← N31): Umsetzungsabsicht (Wenn-dann-Plan) +
 * Wochenrückblick. Eine Absicht pro ISO-Woche: wann · wo · was — gespeichert
 * lokal in Progress.absicht; beim Wochenwechsel wird erst Rückblick gehalten.
 */
export function isoWoche(d: Date): string {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const tag = (t.getUTCDay() + 6) % 7; // Mo=0
  t.setUTCDate(t.getUTCDate() - tag + 3); // Donnerstag dieser Woche
  const ersterDo = new Date(Date.UTC(t.getUTCFullYear(), 0, 4));
  const tag0 = (ersterDo.getUTCDay() + 6) % 7;
  ersterDo.setUTCDate(ersterDo.getUTCDate() - tag0 + 3);
  const w = 1 + Math.round((t.getTime() - ersterDo.getTime()) / (7 * 86400000));
  return `${t.getUTCFullYear()}-W${String(w).padStart(2, "0")}`;
}

export function absichtStatus(p: Progress, jetzt = new Date()): {
  woche: string;
  aktuelle: Progress["absicht"] | null;
  rueckblickOffen: boolean;
} {
  const woche = isoWoche(jetzt);
  const a = p.absicht ?? null;
  return {
    woche,
    aktuelle: a && a.woche === woche ? a : null,
    rueckblickOffen: !!a && a.woche !== woche && a.erfuellt === undefined,
  };
}
