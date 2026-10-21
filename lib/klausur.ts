// محرّك المحاكاة الامتحانية — Probeklausur بتوقيت رسمي وتقييم Goethe
import type { Exercise, Level } from "./types";
import { TOTAL_DAYS } from "./types";
import { texts, dialogues, writingTasks, grammarMap, sentences, muendlich, leseText } from "./content";
import { levelOf, pickN, rng, clozeFromSatz } from "./plan";

export interface KlausurWriteTask {
  taskDe: string;
  taskAr: string;
  criteria: string[];
  sample: string;
  noteAr?: string[];
}
export interface KlausurSection {
  key: "Lesen" | "Hören" | "Struktur" | "Schreiben" | "Sprechen";
  titleDe: string;
  titleAr: string;
  minutes: number;
  realExamHint: string;
  items: Exercise[];
  passages?: { titleDe: string; de: string }[];
  dialogueId?: string;
  write?: KlausurWriteTask;
  sprechen?: { titelDe: string; titelAr: string; auftrag: string; stuetzen: string[]; kriterien: { de: string; ar: string }[]; zeit_s: number; teil: number };
}
export interface Klausur {
  level: Level;
  sections: KlausurSection[];
  total: number;
}

/** بناء نموذج محاكاة حتمي من مخزون المرحلة (بذرة اليوم) */
export function buildKlausur(day: number): Klausur {
  const d0 = Math.min(Math.max(day, 1), TOTAL_DAYS);
  const lvl = levelOf(d0);
  const rand = rng(d0 * 313 + 29);

  const ts = pickN(texts.filter((t) => t.level === lvl), 2, rand);
  const lesen: Exercise[] = ts.flatMap((t) =>
    leseText(t).questions.slice(0, 2).map((q) => ({ ...q, id: `k-l-${q.id}` }))
  );

  const dlg = pickN(dialogues.filter((x) => x.level === lvl), 1, rand)[0];
  const hoeren: Exercise[] = dlg
    ? [
        ...dlg.questions.slice(0, 2).map((q) => ({ ...q, id: `k-h-${q.id}` })),
        ...dlg.dictation.slice(0, 2).map((s, i) => ({
          id: `k-h-${dlg.id}-di${i}`,
          type: "dictation" as const,
          promptDe: "Diktiert — schreibe den Satz",
          promptAr: "سمّع الجملة واكتبها",
          answer: [s],
          explanationDe: s,
        })),
      ]
    : [];

  const topics = Object.values(grammarMap).filter((t) => t.level === lvl);
  const gEx = topics.flatMap((t) => t.exercises);
  const clozes = pickN(sentences.filter((s) => s.level === lvl), 3, rand).map((s, i) =>
    clozeFromSatz(s, i, rand)
  );
  const struktur = [...pickN(gEx, 6, rand), ...clozes].map((e, i) => ({ ...e, id: `k-s-${e.id}-${i}` }));

  const w = pickN(writingTasks.filter((x) => x.level === lvl), 1, rand)[0];

  // ── توقيت Goethe الحقيقي (65/40/60-75/15) — B1=60 كتابة، B2=75، A-levels مختصرة تربويًا
  const schreibenMin = lvl === "B2" ? 75 : lvl === "B1" ? 60 : lvl === "A2" ? 30 : 20;
  // sprechenMin مدمجة في Sprechen-Teile (8+7=15)
  const muendlichPool2 = muendlich.filter((x) => x.teil === 2 && (x as any).level === lvl);
  const muendlichPool3 = muendlich.filter((x) => x.teil === 3 && (x as any).level === lvl);
  // fallback: إن لم توجد بطاقات مستوى دقيق، خذ أي مستوى
  const c2 = (muendlichPool2[0] ?? muendlich.filter((x) => x.teil === 2)[d0 % Math.max(muendlich.filter((x) => x.teil === 2).length, 1)]);
  const c3 = (muendlichPool3[0] ?? muendlich.filter((x) => x.teil === 3)[(d0 * 7 + 3) % Math.max(muendlich.filter((x) => x.teil === 3).length, 1)]);
  const sprechenSections: KlausurSection[] = [];
  if (c2) sprechenSections.push({
    key: "Sprechen" as const, titleDe: "Sprechen — Präsentation", titleAr: "العرض — «" + c2.titel_ar + "»",
    minutes: 8, realExamHint: "Goethe الحقيقي: 15 دقيقة تحضير + 15 دقيقة امتحان (عرض 4د + نقاش 5د) — هنا 8د (عرض + أسئلة).", items: [], sprechen: { titelDe: c2.titel_de, titelAr: c2.titel_ar, auftrag: c2.auftrag_de ?? "", stuetzen: c2.stuetzen ?? [], kriterien: c2.kriterien ?? [], zeit_s: 240, teil: 2 },
  });
  if (c3) sprechenSections.push({
    key: "Sprechen" as const, titleDe: "Sprechen — Diskussion", titleAr: "النقاش", minutes: 7,
    realExamHint: "Goethe: 5د نقاش مع الشريك — اقتراح + موافقة/اعتراض + سؤال.", items: [], sprechen: { titelDe: c3.titel_de, titelAr: c3.titel_ar, auftrag: c3.auftrag_de ?? "", stuetzen: c3.stuetzen ?? [], kriterien: c3.kriterien ?? [], zeit_s: 300, teil: 3 },
  });
  const allSections: KlausurSection[] = [
    {
      key: "Lesen",
      titleDe: "Lesen",
      titleAr: "القراءة — نصّان و4 أسئلة (Goethe: 65د)",
      minutes: 65,
      realExamHint: "Goethe الحقيقي B1/B2: 65 دقيقة · 5 أجزاء · 30 مهمة (Blog/E-Mail/Anzeige/Zeitung/Vorschrift) — هنا تدريب بنفس التوقيت.",
      items: lesen,
      passages: ts.map((t) => ({ titleDe: t.titleDe, de: leseText(t).de })),
    },
    {
      key: "Hören",
      titleDe: "Hören",
      titleAr: "الاستماع — حوار + أسئلة + إملاء (Goethe: 40د)",
      minutes: 40,
      realExamHint: "Goethe الحقيقي: 40 دقيقة · 4 أجزاء (Durchsagen/Vortrag/Gespräch/Diskussion) — سماع 1×/2× حسب الجزء.",
      items: hoeren,
      dialogueId: dlg?.id,
    },
    {
      key: "Struktur",
      titleDe: "Grammatik & Wortschatz",
      titleAr: "القواعد والمفردات — 9 تمارين (مدمجة في Goethe)",
      minutes: 15,
      realExamHint: "في Goethe لا قسم مستقل — القواعد موزعة على Lesen/Schreiben — هنا تدرّبها معزولة 15د إضافية للتقوية.",
      items: struktur,
    },
    {
      key: "Schreiben",
      titleDe: "Schreiben",
      titleAr: lvl === "B2" ? "الكتابة — Goethe 75د (Forum 150W + Nachricht 100W)" : lvl === "B1" ? "الكتابة — Goethe 60د (3 نصوص: 80/80/40W)" : "الكتابة — مهمة كاملة",
      minutes: schreibenMin,
      realExamHint: lvl === "B2" ? "Goethe B2 الحقيقي: 75 دقيقة (Forum ≥150W + Nachricht 100W) — هنا نفس التوقيت." : lvl === "B1" ? "Goethe B1 الحقيقي: 60 دقيقة (E-Mail 80W + Forum 80W + E-Mail 40W) — هنا 60د." : "مستوى A: مهمة كتابة واحدة بالتوقيت المختصر.",
      items: [],
      write: w
        ? { taskDe: w.taskDe, taskAr: w.taskAr, criteria: w.criteria, sample: w.sample, noteAr: w.noteAr }
        : undefined,
    },
    ...sprechenSections,
  ];
  return {
    level: lvl,
    total: allSections.reduce((n, s) => n + s.minutes, 0),
    sections: allSections,
  };
}

/** تقدير ألماني مبسّط + حكم Goethe (النجاح من 60%) */
export function klausurNote(pct: number): { note: string; goethe: string } {
  const note =
    pct >= 95 ? "1 (sehr gut)" : pct >= 85 ? "2 (gut)" : pct >= 70 ? "3 (befriedigend)" : pct >= 55 ? "4 (ausreichend)" : pct >= 40 ? "5 (mangelhaft)" : "6 (ungenügend)";
  const goethe = pct >= 60 ? "bestanden (Goethe-Schwelle 60%)" : "nicht bestanden (Goethe-Schwelle 60%)";
  return { note, goethe };
}

// ── Prüfungs-Sprint: خطة آخر 30 يوماً قبل الامتحان (حتمية) ─────────────
export interface SprintWoche {
  nr: number;
  focus: string;
  tasks: string[];
}

export function sprintPlan(examDate: string, now = new Date()): { weeks: SprintWoche[]; current: number; days: number } | null {
  const target = new Date(`${examDate}T00:00:00`).getTime();
  const days = Math.ceil((target - now.getTime()) / 86400000);
  if (days > 30 || days < 0) return null;
  const weeks: SprintWoche[] = [
    {
      nr: 1,
      focus: "تأسيس — دفتر الأخطاء والأزمنة",
      tasks: ["Probeklausur 1 مع تحليل الأخطاء", "Konjugationstrainer يومياً (جولتان)", "أغلق 10 أخطاء قديمة من الدفتر"],
    },
    {
      nr: 2,
      focus: "مهارات الامتحان",
      tasks: ["Probeklausur 2", "Diktat-Bootcamp يومياً", "Schreib-Werkstatt Teil 1 ثلاث مرات بالتوقيت"],
    },
    {
      nr: 3,
      focus: "سرعة وثقة",
      tasks: ["Probeklausur 3 بالتزامن الكامل مع المؤقّت", "Sprechtraining يومياً (≥80% مطابقة)", "Schreib-Werkstatt Teil 2 مرتين"],
    },
    {
      nr: 4,
      focus: "الذروة والاستشفاء",
      tasks: ["Probeklausur أخيرة قبل 4 أيام", "فخاخ الموسوعة + دفترك فقط", "نوم مبكر — لا حشو في الليلة الأخيرة"],
    },
  ];
  const current = days <= 7 ? 4 : days <= 14 ? 3 : days <= 21 ? 2 : 1;
  return { weeks, current, days };
}

// ═══ ξ6: محاكياتُ المهارةِ الواحدة — أربعٌ كاملة ═══
export type SkillKey = "lesen" | "hoeren" | "schreiben" | "sprechen";
export const SKILL_LABELS: Record<SkillKey, { de: string; ar: string }> = {
  lesen: { de: "Lesen", ar: "القراءة — 6 نصوص × 3 أسئلة · 30د" },
  hoeren: { de: "Hören", ar: "الاستماع — 3 حوارات مسموعة · 24د" },
  schreiben: { de: "Schreiben", ar: "الكتابة — مهمّتان بتوقيتهما · 45د" },
  sprechen: { de: "Sprechen", ar: "الكلام — عرضٌ ونقاشٌ بمؤقّت · 13د" },
};

export function buildSkillKlausur(day: number, skill: SkillKey): Klausur {
  const d0 = Math.min(Math.max(day, 1), TOTAL_DAYS);
  const lvl = levelOf(d0);
  const rand = rng(d0 * 911 + 7);

  if (skill === "lesen") {
    // R145: ورقة الامتحان من نصوص مكتملة الأسئلة (3+)؛ النصوص ذات السؤالين تخدم الدرس اليومي لا محاكاة الـ18 عنصراً
    const pool = texts.filter((t) => t.level === lvl);
    const voll = pool.filter((t) => leseText(t).questions.length >= 3);
    const ts = pickN(voll.length >= 6 ? voll : pool, 6, rand);
    // ثلاثةُ أسئلةٍ لكلِّ نصٍّ في الورقةِ الامتحانية (18 بالضبط)؛ السؤالُ الرابعُ — إن وُجِدَ — يبقى للتمرينِ اليوميّ
    const items = ts.flatMap((t) =>
      leseText(t).questions.slice(0, 3).map((q) => {
        const base = { ...q, id: `sk-l-${q.id}` } as unknown as Exercise & { type: string };
        if (base.type === "truefalse") return { ...base, type: "mc" as const, options: ["richtig", "falsch"] };
        return base;
      })
    );
    return {
      level: lvl, total: 30,
      sections: [{
        key: "Lesen", titleDe: "Lesen — Modellsatz", titleAr: "القراءة — ستةُ نصوصٍ وثمانيةَ عشرَ سؤالاً", minutes: 30,
        realExamHint: "في Goethe الحقيقي (B1: 65د): نصوصٌ إعلانيةٌ وبريدٌ ومقالٌ طويل — هنا ستّةُ نصوصٍ كاملةٍ من بنكك مع مؤقّتٍ لا يرحم.",
        items, passages: ts.map((t) => ({ titleDe: t.titleDe, de: leseText(t).de })),
      }],
    };
  }

  if (skill === "hoeren") {
    const dlgs = pickN(dialogues.filter((x) => x.level === lvl), 3, rand);
    const secs: KlausurSection[] = dlgs.map((dlg, i) => ({
      key: "Hören", titleDe: `Hören — Teil ${i + 1}`, titleAr: `الاستماعُ ${i + 1} — «${dlg.titleAr}»`, minutes: 8,
      realExamHint: "مرةٌ واحدةٌ تكفي — في القاعةِ لا يُعادُ الشريط. استمعْ ثم أجب، والفقراتُ المملاةُ تُكتب كما تُسمع.",
      items: [
        ...dlg.questions.map((q) => ({ ...q, id: `sk-h-${q.id}` }) as unknown as Exercise),
        ...dlg.dictation.slice(0, 1).map((sx, j) => ({
          id: `sk-h-${dlg.id}-di${j}`, type: "dictation" as const, promptDe: "Diktiert — schreibe den Satz", promptAr: "سمّع واكتب", answer: [sx], explanationDe: sx,
        })),
      ],
      dialogueId: dlg.id,
    }));
    return { level: lvl, total: secs.reduce((n, x) => n + x.minutes, 0), sections: secs };
  }

  if (skill === "schreiben") {
    const pool = writingTasks.filter((x) => x.level === lvl);
    const w = pickN(pool, 2, rand);
    const mk = (t: (typeof w)[number], i: number, min: number): KlausurSection => ({
      key: "Schreiben", titleDe: `Schreiben — Aufgabe ${i + 1}`, titleAr: i === 0 ? "المهمّةُ القصيرة — بريدٌ عمليّ" : "المهمّةُ الطويلة — مقالُ الرأي", minutes: min,
      realExamHint: i === 0 ? "في Goethe: الجزءُ الأول 20د لنصٍّ قصير — درّب السرعةَ والإيجاز." : "الجزءُ الثاني 60د لمقالٍ مُكوَّن — هُنا 30د مكثّفة.",
      items: [],
      write: { taskDe: t.taskDe, taskAr: t.taskAr, criteria: t.criteria, sample: t.sample, noteAr: t.noteAr },
    });
    const secs: KlausurSection[] = [];
    if (w[0]) secs.push(mk(w[0], 0, 15));
    if (w[1]) secs.push(mk(w[1], 1, 30));
    return { level: lvl, total: secs.reduce((n, x) => n + x.minutes, 0), sections: secs };
  }

  // sprechen: بطاقتاُ الشفهيّ الرسميتَين من البنك (عرضٌ ثم نقاش)
  const t2 = muendlich.filter((x) => x.teil === 2);
  const t3 = muendlich.filter((x) => x.teil === 3);
  const c2 = t2[d0 % Math.max(t2.length, 1)];
  const c3 = t3[(d0 * 7 + 3) % Math.max(t3.length, 1)];
  const secs: KlausurSection[] = [];
  if (c2) secs.push({
    key: "Sprechen", titleDe: "Sprechen — Präsentation", titleAr: "العرضُ المصوَّر — «" + c2.titel_ar + "»",
    minutes: 7, realExamHint: "٣د تحضيرٌ صامت ثم ٤د أمام «اللجنة»: وصفٌ واستدلالٌ ورأيٌ واضح — المؤقّتُ هنا يعملُ وأنت تتكلم.",
    items: [], sprechen: { titelDe: c2.titel_de, titelAr: c2.titel_ar, auftrag: c2.auftrag_de ?? "", stuetzen: c2.stuetzen ?? [], kriterien: c2.kriterien ?? [], zeit_s: 240, teil: 2 },
  });
  if (c3) secs.push({
    key: "Sprechen", titleDe: "Sprechen — Diskussion", titleAr: "النقاشُ مع الممتحِنَين", minutes: 6,
    realExamHint: "٥د لنقاشِ المهمة: رأيٌ + حُجّة + سؤالٌ للآخر — الصمتُ أطولَ من ثلاثِ ثوانٍ يُخصمُ أدباً لا زمناً.",
    items: [], sprechen: { titelDe: c3.titel_de, titelAr: c3.titel_ar, auftrag: c3.auftrag_de ?? "", stuetzen: c3.stuetzen ?? [], kriterien: c3.kriterien ?? [], zeit_s: 300, teil: 3 },
  });
  return { level: lvl, total: secs.reduce((n, x) => n + x.minutes, 0), sections: secs };
}
