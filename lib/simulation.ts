/**
 * ═══════════════════════════════════════════════════════════════════
 *  محرّك محاكاة الامتحانات — E1/R171 + E2/R172 (خارطة الطريق)
 * ═══════════════════════════════════════════════════════════════════
 *  صيغ رسمية موثّقة المصدر:
 *  · Goethe B2/B1: أربع وحدات (قراءة 65د · استماع ≈40د · كتابة 75د ·
 *    تحدّث 15د بعد 15د تحضير)، كلّ وحدة 100 نقطة، النجاح 60، لا تعويض.
 *  · telc B2: مكتوب 140د (قراءة+بنى لغوية 90د · استماع ≈20د بسماعٍ
 *    واحد · كتابة 30د/‏≥150 كلمة) وشفهي ≈15د بعد 20د تحضير؛
 *    النجاح: مكتوب ≥135/225 وشفهي ≥45/75 معًا.
 *  · DTZ (BAMF/telc A2–B1): بنية telc عند B1 بموادّ A2/B1،
 *    والنتيجة مستوى (B1 أو A2) لا نقطة نجاح واحدة.
 *  البنود كلّها من بنوك المشروع، والتوليد حتميّ بالبذرة.
 *  الصدق: محاكاة تدريبية لا امتحان رسمي ولا توقّع نتيجة؛ القراءة
 *  والاستماع والبنى تُصحَّح آليًا، والكتابة والتحدّث بتقييم ذاتي
 *  بشبكة معلنة (التصحيح الذكي R170 استشاريّ خارج النقاط).
 * ═══════════════════════════════════════════════════════════════════
 */

import { texts, dialogues, writingTasks, muendlich, kontaktKarten, luecken } from "./content";

/** صيغة Goethe B2 المرجعية (تبقى مرجع التوافق الخلفي) */
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

export type SimFormatId = "goethe-b2" | "telc-b2" | "goethe-b1" | "dtz";

export interface SimFormat {
  id: SimFormatId;
  titelAr: string;
  level: "B1" | "B2";
  quelleAr: string;
}

export const SIM_FORMATE: SimFormat[] = [
  { id: "goethe-b2", titelAr: "Goethe-Zertifikat B2", level: "B2", quelleAr: "أربع وحدات · 100 نقطة لكلّ وحدة · النجاح 60 ولا تعويض (أحكام تنفيذ Goethe)" },
  { id: "telc-b2", titelAr: "telc Deutsch B2", level: "B2", quelleAr: "مكتوب ≥135/225 وشفهي ≥45/75 معًا · سماعٌ واحد · كتابة ≥150 كلمة (telc)" },
  { id: "goethe-b1", titelAr: "Goethe-Zertifikat B1", level: "B1", quelleAr: "أربع وحدات · 100 نقطة لكلّ وحدة · النجاح 60 ولا تعويض (أحكام تنفيذ Goethe)" },
  { id: "dtz", titelAr: "DTZ — Deutsch-Test für Zuwanderer (A2–B1)", level: "B1", quelleAr: "امتحان الاندماج BAMF/telc: النتيجة مستوى B1 أو A2 (محاكاة بالنسب المئوية)" },
];

export const formatById = (id: SimFormatId): SimFormat => SIM_FORMATE.find((f) => f.id === id) ?? SIM_FORMATE[0];

/** مولّد حتمي (mulberry32) */
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
  format: SimFormatId;
  lesen: { textId: string; fragen: number[] }[];
  /** بنى لغوية (telc/DTZ فقط): نصوص فجوات من بنك luecken */
  sprachbausteine: { lueckenId: string; gaps: number[] }[];
  hoeren: { dialogId: string; fragen: number[]; teil: number; einmal: boolean }[];
  /** teil2 فارغة في صيغ المهمّة الواحدة (telc/DTZ) */
  schreiben: { teil1: string; teil2: string };
  sprechen: { kontaktId?: string; vortragId: string; diskussionId: string };
  /** الأزمنة الفعلية بالدقائق لهذه الصيغة */
  zeiten: { lesen: number; sprachbausteine: number; hoeren: number; schreiben: number; vorbereitung: number; sprechen: number };
  zielLesen: number;
  zielHoeren: number;
}

export function baueSimulation(seed: number, formatId: SimFormatId = "goethe-b2"): SimPlan {
  const format = formatById(formatId);
  const level = format.level;
  const r = rng(seed);
  const istTelc = formatId === "telc-b2" || formatId === "dtz";

  // قراءة: DTZ يمزج A2+B1 (طبيعة الامتحان)، وغيره مستوى الصيغة فقط
  const textPool = formatId === "dtz"
    ? [...texts.filter((x) => x.level === "B1"), ...texts.filter((x) => x.level === "A2")]
    : texts.filter((x) => x.level === level);
  const lesenZiel = formatId.startsWith("goethe") ? SIM_FORM.lesenZiel : 20;
  const lesen: SimPlan["lesen"] = [];
  let nL = 0;
  for (const t of mischen(textPool, r)) {
    if (nL >= lesenZiel) break;
    const fragen = t.questions.map((_, i) => i);
    lesen.push({ textId: t.id, fragen });
    nL += fragen.length;
  }
  while (nL > lesenZiel && lesen.length) {
    const letzte = lesen[lesen.length - 1];
    letzte.fragen.pop();
    nL--;
    if (!letzte.fragen.length) lesen.pop();
  }

  // بنى لغوية: نصّا فجوات من مستوى الصيغة (B1 عند DTZ)
  const sprachbausteine: SimPlan["sprachbausteine"] = [];
  if (istTelc) {
    for (const lk of mischen(luecken.filter((x) => x.level === level), r).slice(0, 2)) {
      sprachbausteine.push({ lueckenId: lk.id, gaps: lk.gaps.map((_, i) => i) });
    }
  }

  // استماع: telc/DTZ كلّه بسماعٍ واحد؛ Goethe بالأجزاء المتناوبة
  const dialogPool = formatId === "dtz"
    ? [...dialogues.filter((x) => x.level === "B1"), ...dialogues.filter((x) => x.level === "A2")]
    : dialogues.filter((x) => x.level === level);
  const hoerenZiel = formatId.startsWith("goethe") ? SIM_FORM.hoerenZiel : 20;
  const hoeren: SimPlan["hoeren"] = [];
  let nH = 0;
  for (const d of mischen(dialogPool.filter((x) => (x.questions?.length ?? 0) > 0), r)) {
    if (nH >= hoerenZiel) break;
    const teil = (hoeren.length % 4) + 1;
    hoeren.push({ dialogId: d.id, fragen: d.questions.map((_, i) => i), teil, einmal: istTelc ? true : teil % 2 === 1 });
    nH += d.questions.length;
  }
  while (nH > hoerenZiel && hoeren.length) {
    const letzte = hoeren[hoeren.length - 1];
    letzte.fragen.pop();
    nH--;
    if (!letzte.fragen.length) hoeren.pop();
  }

  const w = mischen(writingTasks.filter((x) => x.level === level), r);
  const vortrag = mischen(muendlich.filter((k) => k.level === level && k.teil === 2), r)[0];
  const diskussion = mischen(muendlich.filter((k) => k.level === level && k.teil === 3), r)[0];
  const kontakt = mischen(kontaktKarten.filter((k) => (k.level as unknown as string) === level), r)[0];

  const zeiten = formatId === "telc-b2"
    ? { lesen: 60, sprachbausteine: 30, hoeren: 20, schreiben: 30, vorbereitung: 20, sprechen: 15 }
    : formatId === "dtz"
      ? { lesen: 45, sprachbausteine: 25, hoeren: 25, schreiben: 30, vorbereitung: 15, sprechen: 15 }
      : { lesen: SIM_FORM.lesenMinuten, sprachbausteine: 0, hoeren: SIM_FORM.hoerenMinuten, schreiben: SIM_FORM.schreibenMinuten, vorbereitung: SIM_FORM.sprechenVorbereitungMinuten, sprechen: SIM_FORM.sprechenMinuten };

  return {
    seed,
    format: formatId,
    lesen,
    sprachbausteine,
    hoeren,
    schreiben: { teil1: w[0]?.id ?? "", teil2: istTelc ? "" : (w[1]?.id ?? w[0]?.id ?? "") },
    sprechen: { kontaktId: kontakt?.id, vortragId: vortrag?.id ?? "", diskussionId: diskussion?.id ?? "" },
    zeiten,
    zielLesen: lesenZiel,
    zielHoeren: hoerenZiel,
  };
}

/* ── التصحيح والحكم ─────────────────────────────────────────────── */

interface FrageMinimal {
  type?: string;
  answer?: unknown;
}

const normAntwort = (s: string) => s.trim().toLocaleLowerCase("de").replace(/\s+/g, " ");

export function antwortRichtig(frage: FrageMinimal, gegeben: string): boolean {
  if (!gegeben?.trim()) return false;
  const ans = Array.isArray(frage.answer) ? frage.answer : [frage.answer];
  return ans.some((a) => a != null && normAntwort(String(a)) === normAntwort(gegeben));
}

export const punkteAusAnteil = (anteil: number): number =>
  Math.round(Math.max(0, Math.min(1, anteil)) * 100);

export const modulBestanden = (punkte: number): boolean => punkte >= SIM_FORM.passPunkte;

export interface SimErgebnis {
  lesen: number;
  hoeren: number;
  schreiben: number;
  sprechen: number;
}

export const simulationBestanden = (e: SimErgebnis): boolean =>
  modulBestanden(e.lesen) && modulBestanden(e.hoeren) && modulBestanden(e.schreiben) && modulBestanden(e.sprechen);

export const RUBRIK_PUNKTE: readonly number[] = [25, 19, 13, 6, 0];
export const RUBRIK_LABELS: readonly string[] = ["ممتاز (A)", "جيد (B)", "مقبول (C)", "ضعيف (D)", "غير كافٍ (E)"];

export function rubrikPunkte(stufen: readonly number[]): number {
  return stufen.reduce((a, s) => a + (RUBRIK_PUNKTE[s] ?? 0), 0);
}

export const woerterZaehlen = (text: string): number => text.trim().split(/\s+/).filter(Boolean).length;

export const schreibenZuKurz = (woerter: number, ziel: number): boolean => woerter < Math.ceil(ziel / 2);

export function schreibenPunkte(rubrik: number, teil1ZuKurz: boolean, teil2ZuKurz: boolean): number {
  return teil1ZuKurz || teil2ZuKurz ? Math.min(rubrik, SIM_FORM.passPunkte - 1) : rubrik;
}

/* ── تقييم الصيغ (E2) ───────────────────────────────────────────── */

export interface Rohwerte {
  lesenAnteil: number;
  sprachAnteil: number;
  hoerenAnteil: number;
  /** شبكة الكتابة 0..100 قبل قاعدة الطول */
  schreibenRubrik: number;
  schreibenZuKurz: boolean;
  /** شبكة التحدّث 0..100 */
  sprechenRubrik: number;
}

export interface BewertungsZeile {
  titelAr: string;
  wert: string;
  ok?: boolean;
  stark?: boolean;
}

export interface SimBewertung {
  zeilen: BewertungsZeile[];
  bestanden: boolean;
  fazitAr: string;
  /** نقاط مئوية للسجلّ الموحّد (قراءة/استماع/كتابة/تحدّث) */
  prozent: SimErgebnis;
}

export function bewerteSimulation(formatId: SimFormatId, roh: Rohwerte): SimBewertung {
  const prozent: SimErgebnis = {
    lesen: punkteAusAnteil(roh.lesenAnteil),
    hoeren: punkteAusAnteil(roh.hoerenAnteil),
    schreiben: roh.schreibenZuKurz ? Math.min(roh.schreibenRubrik, 59) : roh.schreibenRubrik,
    sprechen: roh.sprechenRubrik,
  };

  if (formatId === "goethe-b2" || formatId === "goethe-b1") {
    const zeilen: BewertungsZeile[] = [
      { titelAr: "📖 القراءة", wert: `${prozent.lesen}/100`, ok: modulBestanden(prozent.lesen) },
      { titelAr: "🎧 الاستماع", wert: `${prozent.hoeren}/100`, ok: modulBestanden(prozent.hoeren) },
      { titelAr: "✍️ الكتابة (تقييم ذاتي بالشبكة)", wert: `${prozent.schreiben}/100`, ok: modulBestanden(prozent.schreiben) },
      { titelAr: "🗣️ التحدّث (تقييم ذاتي بالشبكة)", wert: `${prozent.sprechen}/100`, ok: modulBestanden(prozent.sprechen) },
    ];
    const bestanden = simulationBestanden(prozent);
    return {
      zeilen, bestanden, prozent,
      fazitAr: bestanden
        ? "ناجح في كلّ الوحدات بصيغة Goethe (كلّ وحدة ≥60، بلا تعويض)."
        : "لم تبلغ كلّ وحدةٍ عتبةَ 60 — في صيغة Goethe لا تعويض بين الوحدات.",
    };
  }

  if (formatId === "telc-b2") {
    const lesenP = Math.round(roh.lesenAnteil * 75);
    const sprachP = Math.round(roh.sprachAnteil * 30);
    const hoerenP = Math.round(roh.hoerenAnteil * 75);
    const schreibenP = roh.schreibenZuKurz
      ? Math.min(Math.round((roh.schreibenRubrik / 100) * 45), 26)
      : Math.round((roh.schreibenRubrik / 100) * 45);
    const schriftlich = lesenP + sprachP + hoerenP + schreibenP;
    const muendlich = Math.round((roh.sprechenRubrik / 100) * 75);
    const bestanden = schriftlich >= 135 && muendlich >= 45;
    return {
      zeilen: [
        { titelAr: "قراءة (Leseverstehen)", wert: `${lesenP}/75` },
        { titelAr: "بنى لغوية (Sprachbausteine)", wert: `${sprachP}/30` },
        { titelAr: "استماع (Hörverstehen)", wert: `${hoerenP}/75` },
        { titelAr: "كتابة (Schriftlicher Ausdruck، تقييم ذاتي)", wert: `${schreibenP}/45` },
        { titelAr: "المكتوب كاملًا", wert: `${schriftlich}/225`, ok: schriftlich >= 135, stark: true },
        { titelAr: "الشفهي (Mündlicher Ausdruck، تقييم ذاتي)", wert: `${muendlich}/75`, ok: muendlich >= 45, stark: true },
      ],
      bestanden, prozent,
      fazitAr: bestanden
        ? "ناجح بصيغة telc: المكتوب ≥135/225 والشفهي ≥45/75 معًا."
        : "صيغة telc تشترط الكتلتين معًا: مكتوب ≥135/225 وشفهي ≥45/75.",
    };
  }

  // DTZ: نتيجة مستوى من النسبة الكلية
  const gesamt = Math.round(((roh.lesenAnteil + roh.sprachAnteil + roh.hoerenAnteil + roh.schreibenRubrik / 100 + roh.sprechenRubrik / 100) / 5) * 100);
  const niveau = gesamt >= 60 ? "B1" : gesamt >= 45 ? "A2" : "unter A2";
  return {
    zeilen: [
      { titelAr: "📖 القراءة", wert: `${prozent.lesen}%` },
      { titelAr: "🧩 البنى اللغوية", wert: `${punkteAusAnteil(roh.sprachAnteil)}%` },
      { titelAr: "🎧 الاستماع", wert: `${prozent.hoeren}%` },
      { titelAr: "✍️ الكتابة (تقييم ذاتي)", wert: `${prozent.schreiben}%` },
      { titelAr: "🗣️ التحدّث (تقييم ذاتي)", wert: `${prozent.sprechen}%` },
      { titelAr: "المستوى المُقدَّر في المحاكاة", wert: niveau, ok: niveau === "B1", stark: true },
    ],
    bestanden: niveau === "B1",
    prozent,
    fazitAr: niveau === "B1"
      ? "بلغتَ مستوى B1 في هذه المحاكاة (‏≥60% إجمالًا)."
      : niveau === "A2"
        ? "نتيجتك عند A2 في هذه المحاكاة (45–59%) — واصل نحو B1."
        : "دون A2 في هذه المحاكاة (<45%) — ركّز على الأساسيات ثم أعد المحاولة.",
  };
}
