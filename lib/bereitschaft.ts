// lib/bereitschaft.ts — تحليلات الاستعداد للامتحان (E3/R173)
// العقد: كل رقم هنا يُشتق من نتائج المتعلّم المسجَّلة في متصفّحه فقط
// (محاولات المحاكاة في simulationen) — بلا أي تنبؤ وبأحكامٍ موثّقة العتبات.
// خطّ النجاح المرجعي = 60 (Goethe/telc)؛ نطاقات الوصف تُسمّي الواقع المسجّل ولا تعد بشيء.

import type { Progress } from "./types";
import { formatById, type SimFormatId } from "./simulation";

export type FertKey = "lesen" | "hoeren" | "schreiben" | "sprechen";

export const FERT_AR: Record<FertKey, string> = {
  lesen: "📖 القراءة",
  hoeren: "🎧 الاستماع",
  schreiben: "✍️ الكتابة",
  sprechen: "🗣️ التحدّث",
};

/** الكتابة والتحدّث في المحاكاة تقييمٌ ذاتيّ بالشبكة — دليلٌ أخفّ، يُصرَّح به. */
export const FERT_SELBST: Record<FertKey, boolean> = {
  lesen: false,
  hoeren: false,
  schreiben: true,
  sprechen: true,
};

export const BESTEHENS_LINIE = 60;

export type Trend = "steigend" | "fallend" | "stabil";

export interface FertBilanz {
  key: FertKey;
  /** عدد محاولات المحاكاة المعتبرة */
  versuche: number;
  /** متوسط آخر ثلاث محاولات (نقاط 0–100) أو null بلا بيانات */
  mittel: number | null;
  /** آخر قيمة مسجّلة */
  letzter: number | null;
  /** كم من آخر (حتى) ثلاث محاولات فوق خطّ النجاح */
  ueberLinie: number;
  trend: Trend | null;
  /** شريط الوصف: يُسمّي السجلّ، لا المستقبل */
  bandAr: string;
  farbe: string;
}

type Versuch = NonNullable<Progress["simulationen"]>[number];

const runde = (n: number) => Math.round(n * 10) / 10;

/** محاولات صيغة واحدة مرتّبة زمنيًا (الأقدم ← الأحدث)؛ القديم بلا صيغة = Goethe B2. */
export function versucheVon(p: Progress, formatId?: SimFormatId): Versuch[] {
  const alle = [...(p.simulationen ?? [])].sort((a, b) => a.datum.localeCompare(b.datum));
  if (!formatId) return alle;
  return alle.filter((v) => ((v.format as SimFormatId | undefined) ?? "goethe-b2") === formatId);
}

function bandFuer(versuche: number, mittel: number | null, ueberLinie: number): { bandAr: string; farbe: string } {
  if (versuche === 0 || mittel === null)
    return { bandAr: "لا محاولات محاكاة مسجّلة بعد", farbe: "var(--color-mid)" };
  if (versuche === 1)
    return { bandAr: "محاولة واحدة — لا تكفي لأيّ حكم", farbe: "var(--color-mid)" };
  if (mittel >= 70 && ueberLinie >= 2)
    return { bandAr: "ثابتة فوق خطّ النجاح (60) في المحاكاة", farbe: "var(--color-a1)" };
  if (mittel >= BESTEHENS_LINIE)
    return { bandAr: "فوق خطّ النجاح لكن بهامشٍ ضيّق", farbe: "var(--color-gold)" };
  if (mittel >= 50)
    return { bandAr: "قريبة تحت الخطّ — فجوة قابلة للإغلاق", farbe: "var(--color-b2)" };
  return { bandAr: "دون الخطّ بوضوح حتى الآن", farbe: "var(--color-cola)" };
}

/** حصيلة المهارات الأربع من محاولات المحاكاة (صيغة واحدة أو كلّ الصيغ). */
export function fertigkeitenBilanz(p: Progress, formatId?: SimFormatId): FertBilanz[] {
  const vs = versucheVon(p, formatId);
  const keys: FertKey[] = ["lesen", "hoeren", "schreiben", "sprechen"];
  return keys.map((key) => {
    const werte = vs.map((v) => v.punkte[key]).filter((n) => Number.isFinite(n));
    const versuche = werte.length;
    const letzte3 = werte.slice(-3);
    const mittel = versuche ? runde(letzte3.reduce((a, b) => a + b, 0) / letzte3.length) : null;
    const ueberLinie = letzte3.filter((w) => w >= BESTEHENS_LINIE).length;
    let trend: Trend | null = null;
    if (versuche >= 2) {
      const vorher = werte.slice(0, -1);
      const diff = werte[werte.length - 1] - vorher.reduce((a, b) => a + b, 0) / vorher.length;
      trend = diff >= 5 ? "steigend" : diff <= -5 ? "fallend" : "stabil";
    }
    const band = bandFuer(versuche, mittel, ueberLinie);
    return {
      key,
      versuche,
      mittel,
      letzter: versuche ? werte[werte.length - 1] : null,
      ueberLinie,
      trend,
      bandAr: band.bandAr,
      farbe: band.farbe,
    };
  });
}

/** أضعف مهارةٍ بدليلٍ كافٍ (محاولتان فأكثر) — أساس التوصية الوحيدة. */
export function schwaechsteFertigkeit(bilanzen: FertBilanz[]): FertBilanz | null {
  const belegt = bilanzen.filter((b) => b.versuche >= 2 && b.mittel !== null);
  if (!belegt.length) return null;
  return belegt.reduce((a, b) => ((b.mittel ?? 0) < (a.mittel ?? 0) ? b : a));
}

export interface BereitschaftsFazit {
  /** إجمالي المحاولات المكتملة */
  versucheGesamt: number;
  bestandenAnzahl: number;
  /** عناوين الصيغ التي خاضها المتعلّم مع عدد نجاحاتها */
  proFormat: { formatAr: string; versuche: number; bestanden: number }[];
  /** توصية رقعة واحدة مبنية على أضعف دليل */
  empfehlungAr: string | null;
}

/** ملخّصٌ وصفيٌّ للسجلّ كلِّه + توصية الرقعة التالية (أضعف مهارة موثّقة). */
export function bereitschaftsFazit(p: Progress): BereitschaftsFazit {
  const alle = versucheVon(p);
  const proFormatMap = new Map<string, { versuche: number; bestanden: number }>();
  for (const v of alle) {
    const id = ((v.format as SimFormatId | undefined) ?? "goethe-b2") as SimFormatId;
    const e = proFormatMap.get(id) ?? { versuche: 0, bestanden: 0 };
    e.versuche += 1;
    if (v.bestanden) e.bestanden += 1;
    proFormatMap.set(id, e);
  }
  const proFormat = [...proFormatMap.entries()].map(([id, e]) => ({
    formatAr: formatById(id as SimFormatId).titelAr,
    ...e,
  }));

  const schwach = schwaechsteFertigkeit(fertigkeitenBilanz(p));
  const empfehlungAr = schwach
    ? schwach.mittel !== null && schwach.mittel < BESTEHENS_LINIE
      ? `${FERT_AR[schwach.key]} هي الأضعف في سجلّك (متوسط آخر ٣ محاولات ${schwach.mittel}) — ركّز رقعة تدريب عليها ثم أعد محاكاة كاملة وقارن.`
      : `${FERT_AR[schwach.key]} هي الأقرب إلى الخطّ (متوسط آخر ٣ محاولات ${schwach.mittel}) — هامشها الضيّق هو أول ما يستحق التثبيت.`
    : null;

  return {
    versucheGesamt: alle.length,
    bestandenAnzahl: alle.filter((v) => v.bestanden).length,
    proFormat,
    empfehlungAr,
  };
}

/** أيام حتى موعد الامتحان المضبوط (سالب = مضى) أو null عند غيابه. */
export function tageBisExamen(p: Progress, jetzt: Date = new Date()): number | null {
  const ziel = p.settings.examDate;
  if (!ziel) return null;
  const von = new Date(jetzt.getFullYear(), jetzt.getMonth(), jetzt.getDate()).getTime();
  const bis = new Date(`${ziel}T00:00:00`).getTime();
  if (Number.isNaN(bis)) return null;
  return Math.round((bis - von) / 86400000);
}
