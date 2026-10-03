// محرّك دفتر الأخطاء والتكيّف — «ذاكرة المدرّس» التي لا تنسى أخطاءك
import { PHASE_START, levelAmTag } from "./phasen";
import type {
  Exercise,
  FehlerEintrag,
  FehlerState,
  GrammarTopic,
  Progress,
} from "./types"; import { TOTAL_DAYS } from "./types";
import { newCard, reviewCard, isDue } from "./srs";
import { sicherheitsZeile } from "./sicherheit";

export const FEHLER_KAT: Record<string, string> = {
  "falsche-freunde": "فخاخ زائفة",
  wortstellung: "ترتيب الكلمات",
  artikel: "الأدوات",
  praeposition: "حروف الجر والحالات",
  zeitform: "الأزمنة والأفعال",
  "zahlen-zeit": "أرقام ووقت",
  konstruktion: "تراكيب وصياغة",
  schreibung: "كتابة وهمزات",
  wortschatz: "مفردات",
  sonst: "أخرى",
};

export function normKey(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ").slice(0, 70);
}

/** إدراج خطأ في الدفتر — الخطأ المتكرّر يصبح مراجعة فاشلة (يقترب موعده) */
export function upsertFehler(p: Progress, e: FehlerEintrag): Progress {
  const key = normKey(`${e.falsch}|${e.richtig}`);
  const fehler = { ...(p.fehler ?? {}) };
  const prev = fehler[key];
  fehler[key] = {
    ...e,
    key,
    first: prev?.first ?? new Date().toISOString().slice(0, 10),
    srs: prev ? reviewCard(prev.srs, 0) : newCard(),
    treffer: (prev?.treffer ?? 0) + 1,
  };
  const weak = { ...(p.weak ?? {}) };
  const wk = e.quelle ?? e.art;
  weak[wk] = (weak[wk] ?? 0) + 1;
  return { ...p, fehler, weak };
}

/** تقييم مراجعة خطأ: أصاب ← يبتعد موعده؛ أخطأ ← يعود غداً بإذن */
export function gradeFehlerIn(p: Progress, key: string, ok: boolean): Progress {
  const fehler = { ...(p.fehler ?? {}) };
  const st = fehler[key];
  if (!st) return p;
  const weak = { ...(p.weak ?? {}) };
  const wk = st.quelle ?? st.art;
  if (ok) {
    fehler[key] = { ...st, srs: reviewCard(st.srs, st.srs.reps <= 1 ? 2 : 4), treffer: 0 };
    if (weak[wk]) weak[wk] = Math.max(0, Math.round(weak[wk] * 0.7 * 100) / 100);
  } else {
    fehler[key] = { ...st, srs: reviewCard(st.srs, 0), treffer: st.treffer + 1 };
    weak[wk] = (weak[wk] ?? 0) + 1;
  }
  return { ...p, fehler, weak };
}

/** الأخطاء المستحقّة اليوم (تكرار متباعد) */
export function dueFehler(p: Progress, max = 8): FehlerState[] {
  return Object.values(p.fehler ?? {})
    .filter((f) => isDue(f.srs))
    .sort((a, b) => a.srs.due.localeCompare(b.srs.due))
    .slice(0, max);
}

/** أكثر المواضع ضعفاً (حتمي: ترتيب تنازلي ثم أبجدي) */
export function weakTopics(p: Progress, min = 2): [string, number][] {
  return Object.entries(p.weak ?? {})
    .filter(([, v]) => v >= min)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

// ═════════════ معمل التحليل العميق — Fehlerlabor (Modul N) ═════════════
// تصنيف الأسباب + شجرة العائلات + شبكة الحرارة + الخطأ المقاوم — حتمي كله.

export type Ursache = "neu" | "transfer" | "aehnlichkeit" | "fluechtig" | "geuebt-falsch" | "vergessen";

export const URSACHEN: { id: Ursache; titel: string; erklaerung: string; plan: string[] }[] = [
  { id: "neu", titel: "🆕 مادة جديدة لم تُراجَع", erklaerung: "دخل الدفتر ولم يحن موعده بعد — ليس ضعفاً… بعد.", plan: ["راجعه اليوم ببطاقة واحدة", "اربطه بمثال من حياتك", "أعِد كتابته بخط اليد"] },
  { id: "transfer", titel: "🔁 نقل من العربية (L1-Transfer)", erklaerung: "بناء الجملة العربية يقتحم الألمانية: الأداة، حرف الجر، ترتيب الجملة، الأزمنة.", plan: ["اقرأ قاعدة الموضوع المقابلة", "قارن: جملة عربية ↔ جملة ألمانية", "كوّن جملتين جديدتين بالقاعدة"] },
  { id: "aehnlichkeit", titel: "🪞 تشابه مشوّه / صديق زائف", erklaerung: "كلمة تشبه العربية أو شبيهاً ألمانياً بمعنى آخر — الخداع في الشكل لا المادة.", plan: ["اكتب الزوج متقابلاً: خطأ ↔ صواب مع الفرق", "مثال مضادّ واحد", "اختبر نفسك بعد ساعة"] },
  { id: "fluechtig", titel: "💨 عجلة وإهمال", erklaerung: "القاعدة معروفة لكن الإهمال أدخل الخطأ — لا يُعالَج بالحشو.", plan: ["اقرأ الجملة بصوت عالٍ قبل الكتابة", "دقّق الأداة أولاً ثم الفعل", "بطاقة تعويض في الغد"] },
  { id: "geuebt-falsch", titel: "🪢 تدرّبتَ على الخطأ", erklaerung: "تكرار فاشل أكثر من مرة ركّز الصيغة الخاطئة — تحتاج مسحاً لا مراجعة.", plan: ["امسح الصيغة الخاطئة: اكتب الصواب 3 مرات متباعدة", "سمِّع الصواب ثم اكتبه من الذاكرة", "اتركه اليوم — دعه يستقرّ ثم اختبره"] },
  { id: "vergessen", titel: "🛡️ نسيان يقاوم المراجعة", erklaerung: "راجعتَه وما زال يسقط — يحتاج معالجة خاصة لا تكراراً عمياء.", plan: ["حوّله إلى قصة/صورة ذهنية", "درّبه في سياق جملة حياتية", "مراجعة يومية 3 أيام متتالية"] },
];

/** درجة خطورة الخطأ: سقوط×3 + محاولات فاشلة + جديد */
export function schwere(f: FehlerState): number {
  return f.srs.lapses * 3 + Math.min(f.treffer, 6) + (f.srs.reps === 0 ? 1 : 0);
}

export function ursacheVon(f: FehlerState): Ursache {
  if (f.srs.reps === 0) return "neu";
  if (f.srs.lapses >= 3) return "vergessen";
  if (f.art === "falsche-freunde" || (f.art === "wortschatz" && f.srs.lapses >= 1)) return "aehnlichkeit";
  if (["wortstellung", "artikel", "praeposition", "zeitform", "konstruktion", "zahlen-zeit"].includes(f.art))
    return f.srs.lapses >= 1 ? "transfer" : "fluechtig";
  if (f.treffer >= 2 && f.srs.lapses >= 2) return "geuebt-falsch";
  return f.srs.lapses >= 1 ? "vergessen" : "fluechtig";
}

/** شجرة عائلات الخطأ: كل فئة مع أفرادها مرتّبين بالخطورة */
export function fehlerFamilien(p: Progress): { art: string; titel: string; gl: FehlerState[]; schwere: number }[] {
  const fams = new Map<string, FehlerState[]>();
  for (const f of Object.values(p.fehler ?? {})) {
    const l = fams.get(f.art) ?? [];
    l.push(f);
    fams.set(f.art, l);
  }
  return [...fams.entries()]
    .map(([art, gl]) => ({
      art,
      titel: FEHLER_KAT[art] ?? "أخرى",
      gl: [...gl].sort((a, b) => schwere(b) - schwere(a) || a.key.localeCompare(b.key)),
      schwere: gl.reduce((s, f) => s + schwere(f), 0),
    }))
    .sort((a, b) => b.schwere - a.schwere || a.art.localeCompare(b.art));
}

/** شبكة الحرارة: فئات × آخر 6 أسابيع + عمود «سابق» (حتمي من تواريخ first) */
export function wochenWaerme(p: Progress, wochen = 6): { kat: string[]; zeilen: number[][]; spalten: string[]; max: number } {
  const monday = (d: Date) => {
    const x = new Date(d);
    const w = (x.getDay() + 6) % 7;
    x.setDate(x.getDate() - w);
    x.setHours(0, 0, 0, 0);
    return x;
  };
  const start = monday(new Date());
  const spalten: string[] = [];
  const grenzen: [string, string][] = [];
  for (let i = wochen - 1; i >= 0; i--) {
    const s = new Date(start);
    s.setDate(s.getDate() - 7 * i);
    const e = new Date(s);
    e.setDate(e.getDate() + 7);
    spalten.push(i === 0 ? "هذا الأسبوع" : `قبل ${i}`);
    grenzen.push([s.toISOString().slice(0, 10), e.toISOString().slice(0, 10)]);
  }
  const kat = Object.keys(FEHLER_KAT);
  const zeilen = kat.map(() => spalten.map(() => 0));
  const frueher = kat.map(() => 0);
  for (const f of Object.values(p.fehler ?? {})) {
    const ki = Math.max(0, kat.indexOf(f.art));
    const first = f.first ?? "";
    let platziert = false;
    if (first) {
      for (let c = 0; c < grenzen.length; c++) {
        if (first >= grenzen[c][0] && first < grenzen[c][1]) {
          zeilen[ki][c] += 1;
          platziert = true;
          break;
        }
      }
    }
    if (!platziert) frueher[ki] += 1;
  }
  spalten.push("سابق");
  zeilen.forEach((z, i) => z.push(frueher[i]));
  const max = Math.max(1, ...zeilen.flat());
  return { kat, zeilen, spalten, max };
}

/** الأخطاء المقاومة للمراجعة: سقطت 3+ مرات أو تراكمت عليها الفشل */
export function resistenteFehler(p: Progress): FehlerState[] {
  return Object.values(p.fehler ?? {})
    .filter((f) => f.srs.lapses >= 2 || (f.srs.lapses >= 1 && f.treffer >= 3))
    .sort((a, b) => schwere(b) - schwere(a) || a.key.localeCompare(b.key));
}

/** خطأ الشهر: الأخطر حالياً (حتمي: خطورة ثم المفتاح) */
export function fehlerDesMonats(p: Progress): FehlerState | null {
  const alle = Object.values(p.fehler ?? {});
  if (!alle.length) return null;
  return [...alle].sort((a, b) => schwere(b) - schwere(a) || a.key.localeCompare(b.key))[0];
}

/** تقرير المدرّس الأسبوعي — نصوص حتمية من بيانات المتعلّم */
export function lehrerBericht(p: Progress): string[] {
  const z = lehrerBerichtBasis(p); const sz = sicherheitsZeile(p.sicherheit); return sz ? [...z, sz] : z;
}
function lehrerBerichtBasis(p: Progress): string[] {
  const lines: string[] = [];
  const days = Object.entries(p.plan.days)
    .map(([d, r]) => [Number(d), r] as const)
    .sort((a, b) => a[0] - b[0]);
  const last7 = days.slice(-7);
  if (last7.length) {
    const sc = last7.reduce((s, [, r]) => s + r.score, 0);
    const tot = last7.reduce((s, [, r]) => s + Math.max(r.total, 1), 0);
    const pct = Math.round((sc / Math.max(tot, 1)) * 100);
    lines.push(
      `📊 معدّل آخر ${last7.length} أيام مُغلقة: ${pct}% ${pct >= 80 ? "— أداء متين، واصل" : "— دون عتبة الإتقان 80%: خصّص مراجعة مركّزة"}`
    );
  } else {
    lines.push("📊 لا أيام مُغلقة بعد — أغلق يومك الأول ليبدأ التتبّع.");
  }
  const byKat: Record<string, number> = {};
  Object.values(p.fehler ?? {}).forEach((f) => {
    byKat[f.art] = (byKat[f.art] ?? 0) + 1;
  });
  const top = Object.entries(byKat).sort((a, b) => b[1] - a[1]).slice(0, 3);
  if (top.length) {
    lines.push(`🎯 أكثر نقاط ضعفك: ${top.map(([k, v]) => `${FEHLER_KAT[k] ?? k} (${v})`).join(" · ")}`);
  }
  const due = dueFehler(p, 99).length;
  if (due) {
    lines.push(`📓 دفتر الأخطاء: ${due} خطأً مستحقّاً — مهمة «Fehlerheft» ستظهر في يومك تلقائياً.`);
  }
  const wt = weakTopics(p, 3)[0];
  if (wt) {
    lines.push(`🧭 التوصية: راجع «${wt[0]}» هذا الأسبوع — تكرار أخطائه (${wt[1]}) هو الأعلى.`);
  }
  if (lines.length <= 1 && !top.length) {
    lines.push("✨ نظيف! ابدأ أول مهمة وسيتولّى المدرّس ملاحظة أخطائك وبناء دفترها.");
  }
  return lines;
}

/** أسئلة تحديد المستوى — 12+ سؤالاً عبر المستويات (حتمية): قواعد + قراءة قصيرة + استماع TTS */
export function platzierungsFragen(gmap: Record<string, GrammarTopic>): Exercise[] {
  // 14 سؤالاً من A0 → B2 (2+2+3+3+4) مع سؤالين افتتاحيين عن الأبجدية والتحية لـA0
  const ids = [
    "a0-begrussung",
    "a1-sein-haben",
    "a1-praesens",
    "a1-akkusativ",
    "a2-perfekt",
    "a2-weil-dass",
    "a2-wechsel",
    "b1-relativ",
    "b1-konnektoren",
    "b1-genitiv",
    "b1-konj2",
    "b2-partizip",
    "b2-bedingung",
    "b2-indirekte-rede",
  ];
  const out: Exercise[] = ids.flatMap((id, i) => {
    const t = gmap[id];
    if (!t?.exercises?.length) {
      if (id === "a0-begrussung") {
        return [{
          id: `pl-${i}-${id}`,
          type: "mc",
          promptDe: "Was sagt man auf Deutsch zur Begrüßung?",
          promptAr: "كيف نقول «مرحباً» بالألمانية؟",
          options: ["Tschüss", "Hallo", "Danke", "Bitte"],
          answer: "Hallo",
          explanationAr: "التحية = Hallo، والوداع = Tschüss، الشكر = Danke، من فضلك = Bitte.",
        }];
      }
      return [];
    }
    return [{ ...t.exercises[0], id: `pl-${i}-${id}` }];
  });

  // ── فقرات قراءة قصيرة بمستويات متدرّجة ──
  out.push({
    id: "pl-lesen-a1",
    type: "mc",
    promptDe: "Lesen: „Ich heiße Anna. Ich wohne in Berlin. Ich habe einen Bruder. Er heißt Tom.“ — Wie heißt der Bruder?",
    promptAr: "📖 قراءة (مستوى A1): اقرأ الفقرة القصيرة ثم أجب: ما اسم أخي آنا؟",
    text: "Ich heiße Anna. Ich wohne in Berlin. Ich habe einen Bruder. Er heißt Tom.",
    options: ["Anna", "Berlin", "Tom", "Bruder"],
    answer: "Tom",
    explanationAr: "في الجملة الأخيرة «Er heißt Tom.» — Tom هو اسم الأخ.",
  });
  out.push({
    id: "pl-lesen-b1",
    type: "mc",
    promptDe: "Lesen: „Obwohl das Wetter gestern schlecht war, sind wir spazieren gegangen. Danach haben wir in einem kleinen Café Kaffee getrunken.“ — Was ist richtig?",
    promptAr: "📖 قراءة (مستوى B1): رغم سوء الجو بالأمس، خرجنا للمشي ثم شربنا القهوة في مقهى صغير.",
    text: "Obwohl das Wetter gestern schlecht war, sind wir spazieren gegangen. Danach haben wir in einem kleinen Café Kaffee getrunken.",
    options: [
      "Wir sind zu Hause geblieben.",
      "Wir sind spazieren gegangen und haben Kaffee getrunken.",
      "Das Wetter war sehr gut.",
      "Das Café war sehr groß.",
    ],
    answer: "Wir sind spazieren gegangen und haben Kaffee getrunken.",
    explanationAr: "الجملة «sind wir spazieren gegangen … haben wir … Kaffee getrunken» تؤكد الخيار الصحيح.",
  });

  // ── فقرات استماع (تُنطَق عبر TTS داخل الواجهة؛ السؤال يطلب زر الاستماع) ──
  out.push({
    id: "pl-hoer-a2",
    type: "mc",
    promptDe: "🎧 Hören (▶ اضغط 🔊 على الجملة): „Am Samstag gehe ich mit meiner Freundin ins Kino. Wir sehen einen neuen französischen Film.“ — Wohin geht die Person am Samstag?",
    promptAr: "🎧 استماع (مستوى A2): اضغط 🔊 على زر الاستماع في الأسفل ثم أجب: إلى أين تذهب المتكلمة يوم السبت؟",
    text: "Am Samstag gehe ich mit meiner Freundin ins Kino. Wir sehen einen neuen französischen Film.",
    options: ["ins Theater", "ins Kino", "in die Schule", "zur Arbeit"],
    answer: "ins Kino",
    explanationAr: "تقول الجملة «ins Kino» — السينما.",
    hint: "🔊 استمع ثم اختر",
  });
  out.push({
    id: "pl-hoer-b2",
    type: "truefalse",
    promptDe: "🎧 Hören (▶ اضغط 🔊): „Wenn ich mehr Zeit hätte, würde ich jeden Tag Klavier spielen, aber mein Studium nimmt fast den ganzen Tag in Anspruch.“ — Aussage: Die Person spielt jeden Tag Klavier. Richtig oder falsch?",
    promptAr: "🎧 استماع (مستوى B2): الجملة تتحدث عن أمنية بلا تحقق. العبارة: «الشخص يعزف البيانو كل يوم» — هل هي صحيحة؟",
    text: "Wenn ich mehr Zeit hätte, würde ich jeden Tag Klavier spielen, aber mein Studium nimmt fast den ganzen Tag in Anspruch.",
    options: ["Richtig", "Falsch"],
    answer: "Falsch",
    explanationAr: "«Wenn ich mehr Zeit hätte, würde ich …» = أمنية (Konjunktiv II) لا تتحقق فعلياً؛ الدراسة تشغل كل يومها، إذاً العبارة خاطئة.",
    hint: "🔊 استمع ثم اختر",
  });

  return out;
}

/** اقتراح اليوم الانطلاق حسب نتائج التحديد (≥1 صحيح من كل مستوى) */
export function vorschlagTag(gruppen: Record<string, number>): number {
  if ((gruppen.B2 ?? 0) >= 2) return PHASE_START.B2;
  if ((gruppen.B1 ?? 0) >= 2) return PHASE_START.B1;
  if ((gruppen.A2 ?? 0) >= 2) return PHASE_START.A2;
  if ((gruppen.A1 ?? 0) >= 1) return PHASE_START.A1;
  return PHASE_START.A0; // يبدأ من التهيئة الحقيقية
}

/** رسالة وليّ الأمر — تقرير ثنائي اللغة حتمي من نتائج الطالب (بلا استيراد plan تجنّباً للدورة) */
export function elternBrief(p: Progress): { de: string[]; ar: string[] } {
  const de: string[] = [];
  const ar: string[] = [];
  const day = Math.min(p.plan.day, TOTAL_DAYS);
  const phase = levelAmTag(day);
  de.push(`Ihr Kind ist bei Tag ${day} von 378 (Phase ${phase}) auf dem Weg bis B2.`);
  ar.push(`طفلك في اليوم ${day} من ${TOTAL_DAYS} (مرحلة ${phase}) على الطريق نحو B2.`);
  const days = Object.entries(p.plan.days)
    .map(([d, r]) => [Number(d), r] as const)
    .sort((a, b) => a[0] - b[0]);
  const last7 = days.slice(-7);
  if (last7.length) {
    const sc = last7.reduce((s, [, r]) => s + r.score, 0);
    const tot = last7.reduce((s, [, r]) => s + Math.max(r.total, 1), 0);
    const pct = Math.round((sc / Math.max(tot, 1)) * 100);
    de.push(
      `Durchschnitt der letzten ${last7.length} Lerntage: ${pct}% ${pct >= 80 ? "(Ziel erreicht – weiter so!)" : "(unter dem Ziel 80% – bitte beim Lernen begleiten)."}`
    );
    ar.push(
      `معدّل آخر ${last7.length} أيام تعلّم: ${pct}% ${pct >= 80 ? "(حقق الهدف — أحسنتم!)" : "(دون هدف 80% — يُستحسن مرافقته في المذاكرة)."}`
    );
  } else {
    de.push("Noch keine abgeschlossenen Lerntage – mit dem ersten Tag beginnt die Dokumentation.");
    ar.push("لا أيام مُغلقة بعد — يبدأ التوثيق من اليوم الأول.");
  }
  de.push(`Lerntage in Folge: ${p.streak?.count ?? 0}.`);
  ar.push(`أيام التعلّم المتتالية: ${p.streak?.count ?? 0}.`);
  const nFehler = Object.keys(p.fehler ?? {}).length;
  const due = dueFehler(p, 99).length;
  de.push(`Fehlerheft: ${nFehler} Einträge, davon heute ${due} fällig – die App wiederholt sie automatisch.`);
  ar.push(`دفتر الأخطاء: ${nFehler} مدوَّنة، منها ${due} مستحقّة اليوم — التطبيق يتولّى مراجعتها آلياً.`);
  const kann = Object.keys(p.canDo ?? {}).length;
  de.push(`„Ich kann …“: ${kann} von 32 Zielen sind abgehakt.`);
  ar.push(`أهداف «أستطيع» المُنجَزة: ${kann} من 32.`);
  const exams = Object.entries(p.exams ?? {});
  if (exams.length) {
    const best = Math.max(...exams.map(([, e]) => e.score));
    de.push(`Prüfungen absolviert: ${exams.length}, beste Leistung ${best}%.`);
    ar.push(`امتحانات مُجتازة: ${exams.length}، وأفضل نتيجة ${best}%.`);
  }
  de.push("Täglich 20 konzentrierte Minuten zur gleichen Zeit wirken mehr als lange Einheiten am Wochenende.");
  ar.push("عشرون دقيقة مركّزة يومياً بوقت ثابت أقوى من جلسات طويلة في نهاية الأسبوع.");
  de.push("Mit freundlichen Grüßen – die virtuelle Lehrkraft von „Mein Weg bis B2“.");
  ar.push("مع خالص التقدير — المدرّس الافتراضي في تطبيق «طريقي إلى B2».");
  return { de, ar };
}
