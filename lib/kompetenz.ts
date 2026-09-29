// lib/kompetenz.ts — شبكة الكفاءات الموحّدة (CEFR-Kompetenzprofil)
// العقد المعماري: كل محرّك يسجّل عبر logK أي كفاءة تدربها وهل نجحت المحاولة.
// التقدير = 70% أداء مسجَّل حديثاً + 30% مؤشرات تراكمية — حتمي وموثّق بلا خوادم.

import type { Progress, Kompetenz, TaskKind } from "./types";

export const KOMPETENZEN: Kompetenz[] = ["Lesen", "Hoeren", "Schreiben", "Sprechen", "Grammatik", "Wortschatz"];

export const KOMPETENZ_AR: Record<Kompetenz, string> = {
  Lesen: "قراءة",
  Hoeren: "استماع",
  Schreiben: "كتابة",
  Sprechen: "محادثة",
  Grammatik: "قواعد",
  Wortschatz: "مفردات",
};

/** أنواع مهام الخطة ← الكفاءة المستهدفة (خط أنابيب ③ — عبر submitTask). */
export const KIND_KOMPETENZ: Record<TaskKind, Kompetenz> = {
  wiederholen: "Wortschatz",
  grammatik: "Grammatik",
  wortschatz: "Wortschatz",
  hoeren: "Hoeren",
  lesen: "Lesen",
  schreiben: "Schreiben",
  sprechen: "Sprechen",
  check: "Grammatik",
};

/** فئات الأخطاء (FEHLER_KAT) ← الكفاءة المتأثرة (خط أنابيب ① — عبر gradeFehlerNow). */
export const FEHLER_ZU_KOMPETENZ: Record<string, Kompetenz> = {
  "falsche-freunde": "Wortschatz",
  wortstellung: "Grammatik",
  artikel: "Grammatik",
  praeposition: "Grammatik",
  zeitform: "Grammatik",
  "zahlen-zeit": "Hoeren",
  konstruktion: "Schreiben",
  schreibung: "Schreiben",
  wortschatz: "Wortschatz",
  sonst: "Grammatik",
};

/** تسجيل محاولة (ناجحة/خاطئة) على شبكة الكفاءات. */
export function logK(p: Progress, h: Kompetenz, ok: boolean): Progress {
  const arr = [...(p.kompetenzLog || []), { h, ok }];
  return { ...p, kompetenzLog: arr.slice(-600) };
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

function kindPassed(p: Progress, k: TaskKind): number {
  return Object.values(p.plan.tasks || {}).filter((t) => t.kind === k && t.passed).length;
}
function fehlerN(p: Progress, arts: string[]): number {
  return Object.values(p.fehler || {}).filter((f) => arts.includes(f.art)).length;
}

/** المؤشر التراكمي (0-100) لكل كفاءة من معطيات التقدّم الحقيقية. */
function proxy(h: Kompetenz, p: Progress): number {
  switch (h) {
    case "Lesen":
      return clamp(kindPassed(p, "lesen") * 12 + (Object.keys(p.exams ?? {}).length ? 25 : 0) + (Object.keys(p.canDo).length * 2));
    case "Hoeren":
      return clamp(kindPassed(p, "hoeren") * 12 + Math.max(0, 30 - fehlerN(p, ["zahlen-zeit"]) * 4) + (Object.keys(p.exams ?? {}).length ? 15 : 0));
    case "Schreiben":
      return clamp(kindPassed(p, "schreiben") * 13 + Math.max(0, 40 - fehlerN(p, ["schreibung", "konstruktion"]) * 3));
    case "Sprechen":
      return clamp(kindPassed(p, "sprechen") * 14 + Math.max(0, 25 - fehlerN(p, ["falsche-freunde"]) * 3));
    case "Grammatik": {
      const g = fehlerN(p, ["wortstellung", "artikel", "praeposition", "zeitform", "konstruktion"]);
      return clamp(kindPassed(p, "grammatik") * 9 + kindPassed(p, "check") * 6 + Math.max(10, 55 - g * 2.5));
    }
    case "Wortschatz": {
      const kartei = Object.values(p.srs || {});
      const reif = kartei.length ? kartei.reduce((s, x) => s + Math.min(1, x.reps / 6), 0) / kartei.length : 0;
      return clamp(reif * 55 + kindPassed(p, "wortschatz") * 8 + kindPassed(p, "wiederholen") * 5 + Math.min(20, (p.canDo ? Object.keys(p.canDo).length : 0) * 3) - fehlerN(p, ["wortschatz", "falsche-freunde"]) * 2);
    }
  }
}

export type KompetenzWert = { wert: number; kern: number | null; versuche: number };

export function kompetenzWerte(p: Progress): Record<Kompetenz, KompetenzWert> {
  const out = {} as Record<Kompetenz, KompetenzWert>;
  for (const h of KOMPETENZEN) {
    const log = (p.kompetenzLog || []).filter((e) => e.h === h).slice(-80);
    let kern: number | null = null;
    if (log.length >= 8) {
      // آخر 40 محاولة — الأحدث وزنها أثقل
      const last = log.slice(-40);
      let w = 0, sum = 0;
      last.forEach((e, i) => {
        const gewicht = 1 + i / last.length;
        sum += gewicht;
        w += (e.ok ? 1 : 0) * gewicht;
      });
      kern = clamp((w / sum) * 100);
    }
    const px = proxy(h, p);
    out[h] = { kern, versuche: log.length, wert: clamp(kern !== null ? 0.7 * kern + 0.3 * px : px) };
  }
  return out;
}

export type Band = { name: string; ar: string; farbe: string };
export function band(v: number): Band {
  if (v >= 75) return { name: "B2 sicher", ar: "جاهز للامتحان", farbe: "var(--color-a1)" };
  if (v >= 55) return { name: "B1+ → B2", ar: "على مشارف B2", farbe: "var(--color-gold)" };
  if (v >= 35) return { name: "B1", ar: "منتصف الطريق", farbe: "var(--color-b2)" };
  return { name: "A2", ar: "أساس متين أولاً", farbe: "var(--color-mid)" };
}

/** الدرجة الموحّدة B2-Score: متوسط شبكة الكفاءات الست. */
export function b2Score(p: Progress): number {
  const w = kompetenzWerte(p);
  return clamp(KOMPETENZEN.reduce((s, h) => s + w[h].wert, 0) / KOMPETENZEN.length);
}

/** مؤشر الجاهزية للامتحان (Modul T) — حتمي من أربعة عوامل موزونة */
export function pruefungsBereitschaft(p: Progress): {
  gesamt: number;
  teile: { name: string; ar: string; wert: number; gewicht: number }[];
} {
  const w = kompetenzWerte(p);
  const komp = clamp(KOMPETENZEN.reduce((s, h) => s + w[h].wert, 0) / KOMPETENZEN.length);

  // نضج الخطة: الأيام المُغلقة بنجاح ÷ الأيام المنقضية
  const tage = Object.values(p.plan.days || {});
  const vergangen = Math.max(1, (p.plan.day || 1) - 1);
  const geschlossen = tage.filter((d) => d.closed).length;
  const planWert = clamp((geschlossen / vergangen) * 100);

  // صحّة الأخطاء: كل مقاوم -12 نقطة وكل خطأ -1.5
  const fehler = Object.values(p.fehler || {});
  const resistent = fehler.filter((f) => f.srs.lapses >= 2).length;
  const fehlerWert = clamp(100 - resistent * 12 - fehler.length * 1.5);

  // نضج البطاقات: متوسط نضج SRS
  const karten = Object.values(p.srs || {});
  const reif = karten.length ? karten.reduce((s, x) => s + Math.min(1, x.reps / 6), 0) / karten.length : 0;
  const srsWert = clamp(reif * 100);

  const teile = [
    { name: "Kompetenznetz", ar: "شبكة الكفاءات", wert: komp, gewicht: 0.4 },
    { name: "Tagesplan-Reife", ar: "انضباط الخطة اليومية", wert: planWert, gewicht: 0.25 },
    { name: "Fehlergesundheit", ar: "صحّة دفتر الأخطاء", wert: fehlerWert, gewicht: 0.2 },
    { name: "SRS-Reife", ar: "نضج البطاقات", wert: srsWert, gewicht: 0.15 },
  ];
  return { gesamt: clamp(teile.reduce((s, t) => s + t.wert * t.gewicht, 0)), teile };
}

export function bereitBand(v: number): Band {
  if (v >= 80) return { name: "جاهز للامتحان", ar: "خُضه بثقة", farbe: "var(--color-a1)" };
  if (v >= 65) return { name: "جاهز بشرط", ar: "أصلح الفجوات الكبرى أولاً", farbe: "var(--color-gold)" };
  if (v >= 40) return { name: "في الطريق", ar: "الركيزة موجودة والبناء مستمر", farbe: "var(--color-b2)" };
  return { name: "مبكّر", ar: "أساس متين أولاً — لا استعجال", farbe: "var(--color-mid)" };
}
