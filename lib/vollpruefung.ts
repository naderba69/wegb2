import { bankRoh, beiBankenBereit } from "./bankload";

/**
 * 🧪 جلسة امتحان كاملة تجريبية (R218): Lesen + Hören + Schreiben + Sprechen
 * في جلسة واحدة بمؤقّت إجمالي ونتيجة مجمّعة — تُركَّب من البنوك الموجودة
 * (نصوص/حوارات/كتابة/شفوي) دون أن تكتب أي تقدّم في الخطة. محاكاة داخلية،
 * لا نتيجة Goethe/telc رسمية؛ الكتابة والتحدّث بتقييم ذاتي معلَن.
 */
export interface VpFrage { promptDe: string; promptAr: string; options: string[]; answer: string; explanationAr: string }
export interface VpText { id: string; level: string; titleDe: string; titleAr: string; de: string; fragen: VpFrage[] }
export interface VpDialog { id: string; level: string; titleDe: string; titleAr: string; audio: string | null; zeilen: { who: string; de: string }[]; fragen: VpFrage[] }
export interface VpSchreiben { id: string; level: string; titleDe: string; titleAr: string; taskDe: string; taskAr: string; criteria: string[]; sample: string; zielWort?: number }
export interface VpSprechen { id: string; level: string; titel_de: string; titel_ar: string; auftrag_de: string; stuetzen: string[]; kriterien: string[]; zeit_s: number }

export const vpTexte: VpText[] = [];
export const vpDialoge: VpDialog[] = [];
export const vpSchreiben: VpSchreiben[] = [];
export const vpSprechen: VpSprechen[] = [];

interface RohFrage { type?: string; promptDe: string; promptAr: string; options?: string[]; answer: string; explanationAr?: string }
const nurMc = (fragen: RohFrage[] = []): VpFrage[] =>
  fragen.filter((f) => f.options && f.options.length >= 3 && f.answer)
    .map((f) => ({ promptDe: f.promptDe, promptAr: f.promptAr, options: f.options as string[], answer: f.answer, explanationAr: f.explanationAr ?? "" }));

function fuelle(): void {
  const texte = bankRoh("texts.json") as { id: string; level: string; titleDe: string; titleAr: string; de: string; questions: RohFrage[] }[] | undefined;
  if (texte?.length && vpTexte.length === 0) {
    for (const t of texte) {
      const fragen = nurMc(t.questions);
      if (fragen.length >= 3) vpTexte.push({ id: t.id, level: t.level, titleDe: t.titleDe, titleAr: t.titleAr, de: t.de, fragen: fragen.slice(0, 5) });
    }
  }
  const audio = bankRoh("dialog-audio.json") as { einsaetze: { id: string; file: string }[] } | undefined;
  const audioMap = new Map((audio?.einsaetze ?? []).map((e) => [e.id, e.file]));
  const dialoge = bankRoh("dialogues.json") as { id: string; level: string; titleDe: string; titleAr: string; lines: { who: string; de: string }[]; questions: RohFrage[] }[] | undefined;
  if (dialoge?.length && vpDialoge.length === 0) {
    for (const d of dialoge) {
      const fragen = nurMc(d.questions);
      if (fragen.length >= 2 && audioMap.has(d.id)) {
        vpDialoge.push({ id: d.id, level: d.level, titleDe: d.titleDe, titleAr: d.titleAr, audio: audioMap.get(d.id) ?? null, zeilen: d.lines.map((l) => ({ who: l.who, de: l.de })), fragen: fragen.slice(0, 4) });
      }
    }
  }
  const schreiben = bankRoh("writing.json") as VpSchreiben[] | undefined;
  if (schreiben?.length && vpSchreiben.length === 0) vpSchreiben.splice(0, 0, ...schreiben);
  const muendlich = bankRoh("muendlich.json") as { karten: VpSprechen[] } | undefined;
  if (muendlich?.karten?.length && vpSprechen.length === 0) vpSprechen.splice(0, 0, ...muendlich.karten);
}

fuelle();
beiBankenBereit(fuelle);
