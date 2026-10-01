// 🔒 بوّابةُ الوحدة + نموذجُ الإتقان
// القاعدةُ التي اشترطَها المالك: لا تُفتَحُ وحدةٌ قبلَ اجتيازِ امتحانِ سابقتِها
// بأربعِ مهاراتٍ، ٨٠٪ مجموعاً — **ولا مهارةَ دونَ ٦٠٪** حتى لا يعبرَ أحدٌ بامتيازِ القراءةِ وحدَه.
import type { Progress, Level } from "./types";
import { MODULE, type Modul, modulOf } from "./plan";
import { texts, dialogues, writingTasks, leseText } from "./content";
import { rng, pickN } from "./plan";

export const GESAMT_SCHWELLE = 80;
export const FACH_SCHWELLE = 60;
export const SPERRE_STUNDEN = 24;

export type PruefTeil = "lesen" | "hoeren" | "schreiben" | "sprechen";
export const TEIL_AR: Record<PruefTeil, string> = {
  lesen: "قراءة", hoeren: "استماع", schreiben: "كتابة", sprechen: "نطق",
};

export type PruefFrage = { id: string; promptDe: string; options?: string[]; answer: string; explanationAr: string };
export type PruefAbschnitt =
  | { teil: "lesen"; titelAr: string; passagen: { titelDe: string; de: string }[]; fragen: PruefFrage[] }
  | { teil: "hoeren"; titelAr: string; dialogIds: string[]; fragen: PruefFrage[] }
  | { teil: "schreiben"; titelAr: string; aufgabeDe: string; aufgabeAr: string; minWoerter: number; kriterien: string[] }
  | { teil: "sprechen"; titelAr: string; saetze: { de: string; ar: string }[] };

export type ModulPruefung = {
  modulNr: number; level: Level; titelAr: string; minuten: number;
  abschnitte: PruefAbschnitt[];
};

export type PruefErgebnis = {
  gesamt: number;                        // ٪ مجموع
  teile: Record<PruefTeil, number>;      // ٪ لكلِّ مهارة
  bestanden: boolean;
  grund: string;                         // سببُ الرسوبِ بالعربية إن وُجِد
  luecken: string[];                     // خريطةُ الثغراتِ لمسارِ الإنقاذ
};

export type ModulStand = {
  versuche: number; best: number; bestanden: boolean;
  zuletzt?: string;                      // ISO
  teile?: Record<PruefTeil, number>;
};

/** رقمُ الوحدةِ المطلَق 1..16 (لأنَّ nr يتكرَّرُ 1..4 في كلِّ مستوى). */
export const modulIndex = (m: Modul) => MODULE.findIndex((x) => x.level === m.level && x.nr === m.nr) + 1;
export const modulNachIndex = (i: number) => MODULE[i - 1];

/** ورقةُ امتحانِ الوحدة — حتميةٌ ببذرةٍ تتغيَّرُ مع كلِّ محاولةٍ فلا تتكرَّرُ الأسئلة. */
export function buildModulPruefung(index: number, versuch = 0): ModulPruefung {
  const m = modulNachIndex(Math.min(Math.max(index, 1), MODULE.length));
  const rand = rng(index * 7919 + versuch * 131 + 17);
  const lv = m.level;

  const tOfLevel = texts.filter((t) => t.level === lv);
  const gewaehlteTexte = pickN(tOfLevel, 2, rand);
  const leseFragen: PruefFrage[] = gewaehlteTexte.flatMap((t) =>
    leseText(t).questions.slice(0, 3).map((q) => ({
      id: `mp${index}-l-${q.id}`,
      promptDe: q.promptDe,
      options: q.type === "truefalse" ? ["richtig", "falsch"] : q.options,
      answer: Array.isArray(q.answer) ? String(q.answer[0]) : String(q.answer),
      explanationAr: q.explanationAr ?? "",
    }))
  );

  const dOfLevel = dialogues.filter((d) => d.level === lv);
  const gewaehlteDialoge = pickN(dOfLevel, 3, rand);
  const hoerFragen: PruefFrage[] = gewaehlteDialoge.flatMap((d) =>
    d.questions.slice(0, 2).map((q) => ({
      id: `mp${index}-h-${q.id}`,
      promptDe: q.promptDe,
      options: q.type === "truefalse" ? ["richtig", "falsch"] : q.options,
      answer: Array.isArray(q.answer) ? String(q.answer[0]) : String(q.answer),
      explanationAr: q.explanationAr ?? "",
    }))
  );

  const wOfLevel = writingTasks.filter((w) => w.level === lv);
  const w = wOfLevel.length ? pickN(wOfLevel, 1, rand)[0] : undefined;

  const sprechSaetze = gewaehlteDialoge[0]
    ? gewaehlteDialoge[0].lines.slice(0, 3).map((l) => ({ de: l.de, ar: l.ar }))
    : [];

  return {
    modulNr: index, level: lv, titelAr: m.titelAr, minuten: 45,
    abschnitte: [
      { teil: "lesen", titelAr: "القراءة — نصّان وستّة أسئلة", passagen: gewaehlteTexte.map((t) => ({ titelDe: t.titleDe, de: leseText(t).de })), fragen: leseFragen },
      { teil: "hoeren", titelAr: "الاستماع — ثلاثة حوارات وستّة أسئلة", dialogIds: gewaehlteDialoge.map((d) => d.id), fragen: hoerFragen },
      {
        teil: "schreiben", titelAr: "الكتابة — مهمّة واحدة",
        aufgabeDe: w?.taskDe ?? "Schreiben Sie eine kurze E-Mail zum Thema des Moduls.",
        aufgabeAr: w?.taskAr ?? "اكتب بريداً قصيراً في موضوع الوحدة.",
        minWoerter: lv === "A1" ? 30 : lv === "A2" ? 50 : lv === "B1" ? 80 : 120,
        kriterien: w?.criteria ?? ["التحية والختام", "الإجابة عن كل النقاط", "روابط الجُمل"],
      },
      { teil: "sprechen", titelAr: "النطق — ثلاث جُمل", saetze: sprechSaetze },
    ],
  };
}

/** حسابُ النتيجةِ بقاعدتَيها: ٨٠٪ مجموعاً و٦٠٪ في كلِّ مهارة. */
export function bewerte(teile: Record<PruefTeil, number>): PruefErgebnis {
  const werte = (["lesen", "hoeren", "schreiben", "sprechen"] as PruefTeil[]).map((t) => teile[t] ?? 0);
  const gesamt = Math.round(werte.reduce((a, b) => a + b, 0) / 4);
  const schwach = (["lesen", "hoeren", "schreiben", "sprechen"] as PruefTeil[]).filter((t) => (teile[t] ?? 0) < FACH_SCHWELLE);
  const bestanden = gesamt >= GESAMT_SCHWELLE && schwach.length === 0;
  const grund = bestanden
    ? ""
    : gesamt < GESAMT_SCHWELLE
      ? `المجموع ${gesamt}٪ دون ${GESAMT_SCHWELLE}٪`
      : `المجموع كافٍ (${gesamt}٪) لكنّ ${schwach.map((t) => TEIL_AR[t]).join(" و")} دون ${FACH_SCHWELLE}٪ — لا عبورَ بمهارةٍ ساقطة`;
  return { gesamt, teile, bestanden, grund, luecken: schwach.map((t) => TEIL_AR[t]) };
}

/** هل انقضت فترةُ التهدئةِ بعدَ رسوب؟ */
export function darfWiederholen(stand: ModulStand | undefined, jetzt = Date.now()): { erlaubt: boolean; restStunden: number } {
  if (!stand?.zuletzt || stand.bestanden) return { erlaubt: true, restStunden: 0 };
  const vergangen = (jetzt - Date.parse(stand.zuletzt)) / 3_600_000;
  const rest = Math.max(0, SPERRE_STUNDEN - vergangen);
  return { erlaubt: rest <= 0, restStunden: Math.ceil(rest) };
}

/** الوحدةُ مفتوحةٌ إن كانت الأولى أو إن اجتازَ سابقتَها. */
export function modulFrei(progress: Progress, index: number): boolean {
  if (index <= 1) return true;
  return progress.modulPruefungen?.[index - 1]?.bestanden === true;
}

/** هل يقفُ المتعلِّمُ أمامَ بابٍ مغلق؟ (أوّلُ يومٍ في وحدةٍ لم تُفتَحْ بعد) */
export function tagGesperrt(progress: Progress, day: number): { gesperrt: boolean; wartendeModulNr: number } {
  const idx = modulIndex(modulOf(day).modul);
  return { gesperrt: !modulFrei(progress, idx), wartendeModulNr: idx - 1 };
}

/** مسارُ الإنقاذ: ثلاثةُ أيامٍ تستهدفُ المهاراتِ الساقطةَ وحدَها. */
export function rettungsplan(erg: PruefErgebnis): { tag: number; fokusAr: string; aufgabeAr: string }[] {
  const schwach = (["lesen", "hoeren", "schreiben", "sprechen"] as PruefTeil[]).filter((t) => (erg.teile[t] ?? 0) < FACH_SCHWELLE);
  const ziele = schwach.length ? schwach : (["schreiben", "sprechen"] as PruefTeil[]);
  const rezept: Record<PruefTeil, string> = {
    lesen: "نصّان من مستواك مع أسئلتهما، ثمّ إعادة قراءة الجُمل التي أخطأت فيها بصوت عالٍ",
    hoeren: "ثلاثة حوارات: استمع بلا نصّ، ثمّ مع النصّ، ثمّ دوّن الكلمات الإشارية",
    schreiben: "أعد كتابة مهمّة الامتحان بعد مراجعة القواعد التي سقطت، ثمّ قارنها بالنموذج",
    sprechen: "سجّل خمس جُمل من الحوار الأخير وقارن إيقاعك بالنموذج مرّتين",
  };
  return ziele.slice(0, 3).map((t, i) => ({ tag: i + 1, fokusAr: TEIL_AR[t], aufgabeAr: rezept[t] }));
}
