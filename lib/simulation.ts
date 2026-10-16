/**
 * ═══════════════════════════════════════════════════════════════════
 *  محرّك محاكاة Goethe-Zertifikat B2 — E1/R171 (خارطة الطريق)
 * ═══════════════════════════════════════════════════════════════════
 *  جلسة موقوتة بأربع وحدات بصيغة الامتحان الرسمي (أحكام تنفيذ Goethe B2):
 *  قراءة 65د · استماع ≈40د · كتابة 75د · تحدّث 15د بعد 15د تحضير؛
 *  كلّ وحدة 100 نقطة، والنجاح 60، ولا تعويض بين الوحدات.
 *  البنود كلّها من بنوك المشروع (نصوص/حوارات/كتابة/بطاقات شفهي B2)،
 *  والتوليد حتميّ بالبذرة: البذرة نفسها ⇒ المحاكاة نفسها.
 *
 *  الصدق: هذه محاكاة تدريبية لا امتحان رسمي ولا توقّع نتيجة.
 *  القراءة والاستماع يُصحَّحان آليًا؛ الكتابة والتحدّث بتقييم ذاتي
 *  بشبكة معايير معلنة (والتصحيح الذكي الاختياري R170 استشاري لا يدخل النقاط).
 * ═══════════════════════════════════════════════════════════════════
 */

import { texts, dialogues, writingTasks, muendlich, kontaktKarten } from "./content";

/** صيغة Goethe B2 المرجعية — الأزمنة والعتبات من أحكام التنفيذ الرسمية */
export const SIM_FORM = {
  lesenMinuten: 65,
  hoerenMinuten: 40,
  schreibenMinuten: 75,
  sprechenVorbereitungMinuten: 15,
  sprechenMinuten: 15,
  passPunkte: 60,
  lesenZiel: 30,
  hoerenZiel: 25,
} as const;

/** مولّد حتمي (mulberry32) — البذرة نفسها تعطي المحاكاة نفسها دائمًا */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function mischen<T>(arr: readonly T[], r: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export interface SimPlan {
  seed: number;
  /** قراءة: نصوص B2 وبنودها (مجموعها lesenZiel) */
  lesen: { textId: string; fragen: number[] }[];
  /** استماع: حوارات B2 وبنودها؛ teil 1–4، والأجزاء الفردية تُسمَع مرة (صيغة Goethe) */
  hoeren: { dialogId: string; fragen: number[]; teil: number; einmal: boolean }[];
  /** كتابة: مهمّتان مختلفتان من بنك B2 (جزء 1 وجزء 2) */
  schreiben: { teil1: string; teil2: string };
  /** تحدّث: تعارف غير مُقيَّم + عرض (Teil 2) + نقاش (Teil 3) */
  sprechen: { kontaktId?: string; vortragId: string; diskussionId: string };
}

export function baueSimulation(seed: number): SimPlan {
  const r = rng(seed);

  // قراءة: نصوص B2 مخلوطة، بنودها كاملة حتى بلوغ الهدف، ثم تقليم الذيل إلى العدد الدقيق
  const lesen: SimPlan["lesen"] = [];
  let nL = 0;
  for (const t of mischen(texts.filter((x) => x.level === "B2"), r)) {
    if (nL >= SIM_FORM.lesenZiel) break;
    const fragen = t.questions.map((_, i) => i);
    lesen.push({ textId: t.id, fragen });
    nL += fragen.length;
  }
  while (nL > SIM_FORM.lesenZiel && lesen.length) {
    const letzte = lesen[lesen.length - 1];
    letzte.fragen.pop();
    nL--;
    if (!letzte.fragen.length) lesen.pop();
  }

  // استماع: حوارات B2 حتى الهدف؛ الجزء يتناوب 1..4، والفرديّ بسماعٍ واحد
  const hoeren: SimPlan["hoeren"] = [];
  let nH = 0;
  for (const d of mischen(dialogues.filter((x) => x.level === "B2" && (x.questions?.length ?? 0) > 0), r)) {
    if (nH >= SIM_FORM.hoerenZiel) break;
    const teil = (hoeren.length % 4) + 1;
    hoeren.push({ dialogId: d.id, fragen: d.questions.map((_, i) => i), teil, einmal: teil % 2 === 1 });
    nH += d.questions.length;
  }
  while (nH > SIM_FORM.hoerenZiel && hoeren.length) {
    const letzte = hoeren[hoeren.length - 1];
    letzte.fragen.pop();
    nH--;
    if (!letzte.fragen.length) hoeren.pop();
  }

  const w = mischen(writingTasks.filter((x) => x.level === "B2"), r);
  const vortrag = mischen(muendlich.filter((k) => k.level === "B2" && k.teil === 2), r)[0];
  const diskussion = mischen(muendlich.filter((k) => k.level === "B2" && k.teil === 3), r)[0];
  const kontakt = mischen(kontaktKarten.filter((k) => (k.level as unknown as string) === "B2"), r)[0];

  return {
    seed,
    lesen,
    hoeren,
    schreiben: { teil1: w[0]?.id ?? "", teil2: w[1]?.id ?? w[0]?.id ?? "" },
    sprechen: { kontaktId: kontakt?.id, vortragId: vortrag?.id ?? "", diskussionId: diskussion?.id ?? "" },
  };
}

/* ── التصحيح والحكم ─────────────────────────────────────────────── */

interface FrageMinimal {
  type?: string;
  answer?: unknown;
}

const normAntwort = (s: string) => s.trim().toLocaleLowerCase("de").replace(/\s+/g, " ");

/** إجابة المتعلّم صحيحة؟ (اختيار/صواب-خطأ/ملء — مقارنة مطبّعة) */
export function antwortRichtig(frage: FrageMinimal, gegeben: string): boolean {
  if (!gegeben?.trim()) return false;
  const ans = Array.isArray(frage.answer) ? frage.answer : [frage.answer];
  return ans.some((a) => a != null && normAntwort(String(a)) === normAntwort(gegeben));
}

/** نسبة [0..1] ← نقاط وحدة من 100 */
export const punkteAusAnteil = (anteil: number): number =>
  Math.round(Math.max(0, Math.min(1, anteil)) * 100);

/** نجاح الوحدة عند عتبة Goethe: 60 */
export const modulBestanden = (punkte: number): boolean => punkte >= SIM_FORM.passPunkte;

export interface SimErgebnis {
  lesen: number;
  hoeren: number;
  schreiben: number;
  sprechen: number;
}

/** نجاح المحاكاة كلّها: كلّ وحدة ≥ 60 — لا تعويض بين الوحدات (رسميًا) */
export const simulationBestanden = (e: SimErgebnis): boolean =>
  modulBestanden(e.lesen) && modulBestanden(e.hoeren) && modulBestanden(e.schreiben) && modulBestanden(e.sprechen);

/** شبكة التقييم الذاتي: 4 معايير × درجات A..E كنقاط (المجموع الأقصى 100) */
export const RUBRIK_PUNKTE: readonly number[] = [25, 19, 13, 6, 0];
export const RUBRIK_LABELS: readonly string[] = ["ممتاز (A)", "جيد (B)", "مقبول (C)", "ضعيف (D)", "غير كافٍ (E)"];

export function rubrikPunkte(stufen: readonly number[]): number {
  return stufen.reduce((a, s) => a + (RUBRIK_PUNKTE[s] ?? 0), 0);
}

export const woerterZaehlen = (text: string): number => text.trim().split(/\s+/).filter(Boolean).length;

/** قاعدة الامتحان: دون نصف الطول المطلوب = المهمّة غير مُنجَزة */
export const schreibenZuKurz = (woerter: number, ziel: number): boolean => woerter < Math.ceil(ziel / 2);

/** نقاط الكتابة النهائية: الشبكة، مع سقف 59 عند قصور طول أيّ جزء (توثيق المحاكاة لقاعدة النصف) */
export function schreibenPunkte(rubrik: number, teil1ZuKurz: boolean, teil2ZuKurz: boolean): number {
  return teil1ZuKurz || teil2ZuKurz ? Math.min(rubrik, SIM_FORM.passPunkte - 1) : rubrik;
}
