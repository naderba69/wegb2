// 🎙️ مدرِّبُ النطق — المرحلةُ الأولى: الإيقاعُ والطلاقة
// كلُّ التحليلِ يجري على عيّناتِ الصوتِ داخلَ الجهاز: لا رفعَ ولا خادومَ ولا نموذج.
// ما يقيسُه: المدّةُ · عددُ المقاطعِ المنطوقةِ · الوقفاتُ ومواضعُها · نسبةُ الكلامِ إلى الصمت.
// ما لا يقيسُه: الأصواتُ المفردة (ü/ch) — تلك مرحلةٌ تالية، ونقولُها صراحةً للمتعلِّم.

export type Level = "A1" | "A2" | "B1" | "B2";

export type Analyse = {
  dauerS: number;        // مدّةُ النطقِ بالثواني
  silben: number;        // مقاطعُ مرصودةٌ بقمَمِ الطاقة
  pausen: number;        // وقفاتٌ ≥ 300 مللي داخلَ الكلام
  sprechAnteil: number;  // نسبةُ الكلامِ إلى المدّةِ كلِّها (0..1)
  tempoSilbenProS: number;
};

export type Bewertung = {
  band: "verstaendlich" | "mit_muehe" | "nah_am_original";
  bandAr: string;
  punkte: number;                 // 0..100
  hinweise: { kurz: string; tatAr: string }[]; // ملاحظةٌ + فعلٌ مطلوب
};

export const BAND_AR: Record<Bewertung["band"], string> = {
  verstaendlich: "🟢 مفهوم",
  mit_muehe: "🟡 مفهومٌ بجهد",
  nah_am_original: "🔵 قريبٌ من الأصل",
};

/** تقديرُ مقاطعِ الجملةِ الألمانيةِ من نصِّها: كلُّ مجموعةِ حركاتٍ مقطع. */
export function silbenImText(satz: string): number {
  const woerter = satz.toLowerCase().replace(/[^a-zäöüß\s]/g, " ").split(/\s+/).filter(Boolean);
  let n = 0;
  for (const w of woerter) {
    const gruppen = w.match(/[aeiouäöü]+/g) ?? [];
    let s = gruppen.length;
    if (/e$/.test(w) && s > 1) s -= 0; // الـe النهائيةُ تُنطَقُ في الألمانية
    n += Math.max(1, s);
  }
  return n;
}

/** المدّةُ المتوقَّعةُ للنموذج: سرعةُ الناطقِ تتدرَّجُ مع المستوى. */
export function zielDauer(satz: string, level: Level): number {
  const proSekunde = { A1: 2.6, A2: 3.0, B1: 3.4, B2: 3.8 }[level];
  return +(silbenImText(satz) / proSekunde).toFixed(2);
}

/** تحليلُ موجةِ الصوت: مغلّفُ الطاقةِ ← مقاطعُ ووقفاتٌ ونسبةُ كلام. */
export function analysiere(samples: Float32Array, sampleRate: number): Analyse {
  const fenster = Math.max(1, Math.floor(sampleRate * 0.02)); // 20 مللي
  const energie: number[] = [];
  for (let i = 0; i + fenster <= samples.length; i += fenster) {
    let s = 0;
    for (let j = i; j < i + fenster; j++) s += samples[j] * samples[j];
    energie.push(Math.sqrt(s / fenster));
  }
  if (!energie.length) return { dauerS: 0, silben: 0, pausen: 0, sprechAnteil: 0, tempoSilbenProS: 0 };

  const max = Math.max(...energie);
  const schwelle = Math.max(max * 0.18, 0.01);
  const laut = energie.map((e) => e > schwelle);

  // مقاطع: قمَمٌ محلّيةٌ فوقَ العتبةِ يفصلُها انخفاض
  let silben = 0, imGipfel = false;
  for (const e of energie) {
    if (e > schwelle && !imGipfel) { silben++; imGipfel = true; }
    else if (e <= schwelle * 0.7) imGipfel = false;
  }

  // وقفات: صمتٌ متّصلٌ ≥ 300 مللي بينَ كلامٍ وكلام
  const minStille = Math.ceil(0.3 / 0.02);
  let pausen = 0, still = 0, hatGesprochen = false;
  for (const l of laut) {
    if (l) { if (still >= minStille && hatGesprochen) pausen++; still = 0; hatGesprochen = true; }
    else still++;
  }

  const dauerS = +(samples.length / sampleRate).toFixed(2);
  const sprechAnteil = +(laut.filter(Boolean).length / laut.length).toFixed(2);
  return { dauerS, silben, pausen, sprechAnteil, tempoSilbenProS: dauerS ? +(silben / dauerS).toFixed(2) : 0 };
}

/** الحكمُ: نطاقٌ يتدرَّجُ مع المستوى + ملاحظاتٌ قابلةٌ للتنفيذِ لا أوصافٌ عامّة. */
export function bewerteAussprache(a: Analyse, satz: string, level: Level): Bewertung {
  const ziel = zielDauer(satz, level);
  const sollSilben = silbenImText(satz);
  const hinweise: Bewertung["hinweise"] = [];
  let punkte = 100;

  const verhaeltnis = ziel > 0 ? a.dauerS / ziel : 1;
  if (verhaeltnis > 1.6) {
    punkte -= 25;
    hinweise.push({ kurz: `أبطأُ من النموذجِ بـ${Math.round((verhaeltnis - 1) * 100)}٪`, tatAr: "أعِدِ الجملةَ دفعةً واحدةً بلا تقطيعٍ بينَ الكلمات" });
  } else if (verhaeltnis < 0.6) {
    punkte -= 15;
    hinweise.push({ kurz: "أسرعُ من النموذج", tatAr: "أبطئْ قليلاً وانطقْ أواخرَ الكلماتِ كاملةً" });
  }

  if (a.pausen >= 3) {
    punkte -= 20;
    hinweise.push({ kurz: `${a.pausen} وقفاتٍ داخلَ الجملة`, tatAr: "اقرأِ الجملةَ صامتاً مرّتَينِ ثمَّ انطقْها بوقفةٍ واحدةٍ على الأكثر" });
  } else if (a.pausen === 2) {
    punkte -= 8;
    hinweise.push({ kurz: "وقفتانِ داخلَ الجملة", tatAr: "اجعلِ الوقفةَ عندَ الفاصلةِ فقط" });
  }

  const silbenDiff = sollSilben ? Math.abs(a.silben - sollSilben) / sollSilben : 0;
  if (silbenDiff > 0.35) {
    punkte -= 20;
    hinweise.push({ kurz: `مقاطعُ منطوقةٌ ${a.silben} والمتوقَّعُ ${sollSilben}`, tatAr: "لا تبتلعْ أواخرَ الكلمات: -en و-er تُنطَقان" });
  }

  if (a.sprechAnteil < 0.45) {
    punkte -= 15;
    hinweise.push({ kurz: "الصمتُ أكثرُ من الكلام", tatAr: "ابدأِ التسجيلَ بعدَ أن تأخذَ نفَساً، وانطقْ فوراً" });
  }

  punkte = Math.max(0, Math.min(100, punkte));
  // النطاقُ يتدرَّجُ مع المستوى: A1 يكفيهِ الفهم، وB2 يُطلَبُ منه القربُ من الأصل
  const grenzen = { A1: [55, 80], A2: [60, 84], B1: [68, 88], B2: [75, 92] }[level];
  const band: Bewertung["band"] = punkte >= grenzen[1] ? "nah_am_original" : punkte >= grenzen[0] ? "verstaendlich" : "mit_muehe";
  if (!hinweise.length) hinweise.push({ kurz: "إيقاعٌ سليم", tatAr: "أعِدْها مرّةً بسرعةِ النموذجِ لتثبيتِ العادة" });
  return { band, bandAr: BAND_AR[band], punkte, hinweise };
}
