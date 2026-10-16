/**
 * R145 — خلط خيارات الاختيار من متعدّد حتمياً ببذرة معرّف السؤال.
 * لماذا: قياس R145 وجد الإجابة الصحيحة في الموضع الثاني في 50.4٪ من أسئلة البنوك
 * (1116 سؤالاً) والعارضات تعرض ترتيب الملف كما هو — نمطٌ يُستغَلّ ويُبطل القياس.
 * الخلط حتمي (نفس السؤال = نفس الترتيب عند كل فتح) حتى لا يقفز الترتيب أثناء الحلّ،
 * والتصحيح بالمقارنة بالقيمة لا بالموضع، فلا يتغيّر أيّ منطق درجات.
 */

/** بذرة عددية ثابتة من نص (FNV-1a) */
export function saatAusText(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** مولّد حتمي صغير (mulberry32) */
function mulberry32(saat: number): () => number {
  let a = saat >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** نسخة مخلوطة من الخيارات — تبديل حقيقي بلا فقد ولا تكرار، ثابت لنفس البذرة */
export function gemischteOptionen(optionen: string[], saatSchluessel: string): string[] {
  if (optionen.length < 2) return [...optionen];
  const rand = mulberry32(saatAusText(saatSchluessel));
  const out = [...optionen];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  // حارس صدفة: لا نُبقي ترتيب الملف نفسه إن أمكن تبديله (سؤالان فأكثر)
  if (out.every((o, i) => o === optionen[i])) {
    [out[0], out[1]] = [out[1], out[0]];
  }
  return out;
}
