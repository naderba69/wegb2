/**
 * 🔊 A32 (R292, Experten-Audit): generiertes Hintergrundrauschen —
 * lokal per WebAudio erzeugt (deterministischer Puffer hier pur),
 * keine Aufnahmen, keine externen Dateien. Pegel/Vorlagen sind
 * Trainingserschwernis, keine Simulation eines echten Ortes.
 */
export function rauschenPuffer(samen: number, sekunden = 2, sampleRate = 44100): Float32Array {
  const n = Math.max(1, Math.floor(sekunden * sampleRate));
  const puffer = new Float32Array(n);
  let s = Math.abs(Math.floor(samen)) % 2147483647;
  if (s <= 0) s += 2147483646;
  let tief = 0;
  for (let i = 0; i < n; i++) {
    s = (s * 16807) % 2147483647;
    const weiss = ((s - 1) / 2147483646) * 2 - 1;
    tief = tief * 0.94 + weiss * 0.06; // Einpol-Tiefpass => braunes Rauschgefühl
    puffer[i] = Math.max(-1, Math.min(1, tief * 3.2));
  }
  return puffer;
}

export interface RauschVorlage {
  id: string;
  nameAr: string;
  gain: number;
}

export const RAUSCH_VORLAGEN: RauschVorlage[] = [
  { id: "ruhig", nameAr: "🌙 هادئ — غرفة بعيدة", gain: 0.05 },
  { id: "strasse", nameAr: "🚗 شارع — حركة مرور", gain: 0.12 },
  { id: "bahnhof", nameAr: "🚉 محطة — صخب كامل", gain: 0.2 },
];
