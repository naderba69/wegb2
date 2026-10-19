import type { Progress } from "./types";
import { karteStufe } from "./srs";

/**
 * ✍️ A12 (R284, Experten-Audit ← N19): kumulative Schreibfehler-Bilanz.
 * Quelle ist das echte Fehlerregister (nur Einträge aus Schreib-Kontexten:
 * quelle nennt Brief/Schreiben oder die Konstruktions-Familie der BriefSchmiede).
 * Muster = Fehlerart × Häufigkeit × Wiederholungen (treffer) × noch offen.
 */
export interface SchreibMuster { art: string; ar: string; n: number; treffer: number; offen: number }
export interface SchreibBilanz { gesamt: number; offen: number; neu30: number; muster: SchreibMuster[] }

const istSchreiben = (quelle?: string, art?: string) =>
  /brief|schreib/i.test(quelle ?? "") || art === "konstruktion";

export function schreibFehlerBilanz(p: Progress, now = new Date()): SchreibBilanz {
  const alle = Object.values(p.fehler ?? {}).filter((f) => istSchreiben(f.quelle, f.art));
  const grenze = new Date(now.getTime() - 30 * 86400000).toISOString();
  const gruppen = new Map<string, SchreibMuster>();
  let offen = 0;
  let neu30 = 0;
  for (const f of alle) {
    const istOffen = karteStufe(f.srs) !== "produktiv";
    if (istOffen) offen++;
    if ((f.srs?.introduced ?? "") >= grenze) neu30++;
    const g = gruppen.get(f.art) ?? { art: f.art, ar: f.ar, n: 0, treffer: 0, offen: 0 };
    g.n += 1;
    g.treffer += f.treffer ?? 0;
    if (istOffen) g.offen += 1;
    gruppen.set(f.art, g);
  }
  return {
    gesamt: alle.length,
    offen,
    neu30,
    muster: [...gruppen.values()].sort((a, b) => b.treffer - a.treffer || b.n - a.n),
  };
}
