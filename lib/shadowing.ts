/**
 * ═══════════════════════════════════════════════════════════════════
 *  🎙️ M4/R184 · التظليل الصوتي (Shadowing): تسجيل ومقارنة إيقاع
 * ═══════════════════════════════════════════════════════════════════
 *  المتعلّم يسمع نموذجًا (مقاطع استماع KI الموسومة أو حوارات قصيرة
 *  بصوت الدار/KI)، يردّد معه مسجّلًا محليًا، ثم يقارن التطبيق بين
 *  الأصل والتسجيل مقارنةً موجية/زمنية فقط: مدّة ونسبة سرعة وعدد
 *  الوقفات وتشابه مغلف الإيقاع. الإفصاح ملازم: هذه ليست محاكمة
 *  نطق — لا قياس لمخارج الحروف ولا لصحة فونيمات، ولا شيء يُرفع
 *  إلى الشبكة، والتسجيل يبقى بيد المتعلّم (تنزيل اختياري بنفسه).
 * ═══════════════════════════════════════════════════════════════════
 */
import { dialogues, dialogAudioSrc, dialogAudioIstKi, hoerneu } from "./content";
import type { Level } from "./types";

export interface SchattenEinheit {
  id: string;
  titelDe: string;
  titelAr: string;
  level: Level;
  audioSrc: string;
  /** النموذج بصوت مولّد آليًا (يُوسم دائمًا) */
  ki: boolean;
  textDe: string;
  quelle: "hoerneu" | "dialog";
}

/** وحدات التظليل: كلّ مقاطع الاستماع المتنوّع + حوارات قصيرة لها صوت */
export function schattenEinheiten(): SchattenEinheit[] {
  const out: SchattenEinheit[] = [];
  for (const item of hoerneu) {
    item.clips.forEach((clip, i) => {
      if (!clip.datei) return;
      out.push({
        id: `${item.id}-c${i}`,
        titelDe: item.titelDe,
        titelAr: item.titelAr,
        level: item.level as Level,
        audioSrc: clip.datei.replace(/^\/?/, "/"),
        ki: true,
        textDe: clip.zeilen.map((z) => item.zeilen[z]?.de ?? "").filter(Boolean).join(" "),
        quelle: "hoerneu",
      });
    });
  }
  for (const d of dialogues) {
    const src = dialogAudioSrc(d.id);
    if (!src || d.lines.length === 0 || d.lines.length > 8) continue;
    out.push({
      id: `dlg-${d.id}`,
      titelDe: d.titleDe,
      titelAr: d.titleAr,
      level: d.level,
      audioSrc: src.replace(/^\/?/, "/"),
      ki: dialogAudioIstKi(d.id),
      textDe: d.lines.map((l) => l.de).join(" "),
      quelle: "dialog",
    });
  }
  return out.sort((a, b) => a.level.localeCompare(b.level) || a.id.localeCompare(b.id));
}

/** مغلف RMS: نافذة ٥٠ م.ث افتراضيًا، مُطبَّع إلى 0..1 بأعلى قيمة */
export function huellkurve(samples: ArrayLike<number>, sampleRate: number, fensterMs = 50): number[] {
  const fenster = Math.max(1, Math.round((sampleRate * fensterMs) / 1000));
  const out: number[] = [];
  let max = 0;
  for (let i = 0; i < samples.length; i += fenster) {
    let sum = 0; let n = 0;
    for (let j = i; j < Math.min(samples.length, i + fenster); j++) { sum += samples[j] * samples[j]; n++; }
    const rms = Math.sqrt(sum / Math.max(1, n));
    out.push(rms);
    if (rms > max) max = rms;
  }
  return max > 0 ? out.map((v) => v / max) : out;
}

/** إعادة تشكيل منحنى إلى طول ثابت (أخذ أقصى كلّ مجموعة) */
export function kurveAufLaenge(kurve: number[], ziel: number): number[] {
  if (kurve.length === 0 || ziel <= 0) return [];
  if (kurve.length === ziel) return [...kurve];
  const out: number[] = [];
  for (let i = 0; i < ziel; i++) {
    const von = Math.floor((i * kurve.length) / ziel);
    const bis = Math.max(von + 1, Math.floor(((i + 1) * kurve.length) / ziel));
    out.push(Math.max(...kurve.slice(von, bis)));
  }
  return out;
}

/** ارتباط بيرسون بين منحنىين */
export function korrelation(a: number[], b: number[]): number {
  const n = Math.min(a.length, b.length);
  if (n < 2) return 0;
  const ma = a.slice(0, n).reduce((s, v) => s + v, 0) / n;
  const mb = b.slice(0, n).reduce((s, v) => s + v, 0) / n;
  let oben = 0; let ua = 0; let ub = 0;
  for (let i = 0; i < n; i++) {
    const da = a[i] - ma; const db = b[i] - mb;
    oben += da * db; ua += da * da; ub += db * db;
  }
  const nenner = Math.sqrt(ua * ub);
  return nenner === 0 ? 0 : oben / nenner;
}

/** الوقفات: مقاطع دون العتبة بطول ≥ ٣ نوافذ (١٥٠ م.ث) */
export function pausenZaehlen(kurve: number[], _fensterMs = 50, schwelle = 0.12): number {
  let pausen = 0; let lauf = 0;
  for (const v of kurve) {
    if (v < schwelle) { lauf++; } else { if (lauf >= 3) pausen++; lauf = 0; }
  }
  if (lauf >= 3) pausen++;
  return pausen;
}

export interface SchattenVergleich {
  dauerOriginalS: number;
  dauerAufnahmeS: number;
  /** ١٫٠٠ = سرعة الأصل نفسها؛ أكبر = أبطأ */
  verhaeltnis: number;
  /** تشابه مغلف الإيقاع بعد المحاذاة الزمنية (لا تشابه نطق) */
  rhythmusAehnlichkeit: number;
  pausenOriginal: number;
  pausenAufnahme: number;
  kurveOriginal: number[];
  kurveAufnahme: number[];
}

/** المقارنة الكاملة من عينات القناة الأولى للطرفين */
export function vergleicheSchatten(
  original: ArrayLike<number>, originalRate: number,
  aufnahme: ArrayLike<number>, aufnahmeRate: number,
): SchattenVergleich {
  const ko = huellkurve(original, originalRate);
  const ka = huellkurve(aufnahme, aufnahmeRate);
  const ziel = 120;
  const ro = kurveAufLaenge(ko, ziel);
  const ra = kurveAufLaenge(ka, ziel);
  const dauerO = original.length / originalRate;
  const dauerA = aufnahme.length / aufnahmeRate;
  return {
    dauerOriginalS: Math.round(dauerO * 10) / 10,
    dauerAufnahmeS: Math.round(dauerA * 10) / 10,
    verhaeltnis: dauerO > 0 ? Math.round((dauerA / dauerO) * 100) / 100 : 0,
    rhythmusAehnlichkeit: Math.round(korrelation(ro, ra) * 100) / 100,
    pausenOriginal: pausenZaehlen(ko),
    pausenAufnahme: pausenZaehlen(ka),
    kurveOriginal: ro,
    kurveAufnahme: ra,
  };
}
