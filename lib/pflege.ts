import { bankRoh, beiBankenBereit } from "./bankload";

/**
 * 🩺 Fachsprache Pflege (R197) — مسار ألمانية التمريض الإضافي.
 * بنك مستقلّ (content/pflege.json) لا يمسّ العمود الفقري 378 يومًا ولا بنوك الخطة:
 * مفردات مهنية متدرّجة A2→B2، حوارات عمل (Visite/Übergabe/Beruhigung/Angehörige)،
 * نماذج توثيق، وبطاقات صيغة telc Medizin/Pflege كتوجيه تدريبي لا امتحان رسمي.
 */
export interface PflegeWort {
  id: string; de: string; plural: string; ar: string;
  bsp: string; bspAr: string; stufe: "A2" | "B1" | "B2";
  thema: "koerper" | "symptome" | "versorgung" | "doku" | "medikamente" | "pflegealltag" | "notfall" | "anatomie" | "befund"; wortart?: string;
}
export interface PflegeDialogZeile { r: string; de: string; ar: string }
export interface PflegeDialog { id: string; titel: string; ar: string; stufe: string; zeilen: PflegeDialogZeile[] }
export interface PflegeDoku { id: string; titel: string; ar: string; aufgabeDe: string; muster: string; punkte: string[] }
export interface PflegePruefung { id: string; titel: string; ar: string; formatAr: string; uebungAr: string }

export interface PflegeMedFrage { frage: string; optionen: string[]; richtig: number }
export interface PflegeMedLesen { id: string; titel: string; text: string; fragen: PflegeMedFrage[] }
export interface PflegeMedHoeren { id: string; titel: string; transkript: string; fragen: PflegeMedFrage[] }
/** محاكاة Medizin التدريبية (R199): بنود قراءة واستماع بأسلوب بنود telc — ليست مواد telc. */
export const pflegeMedizin: { hinweisAr: string; lesen: PflegeMedLesen[]; hoeren: PflegeMedHoeren[] } = {
  hinweisAr: "", lesen: [], hoeren: [],
};

export const pflegeWoerter: PflegeWort[] = [];
export const pflegeDialoge: PflegeDialog[] = [];
export const pflegeDoku: PflegeDoku[] = [];
export const pflegePruefung: PflegePruefung[] = [];

function fuellePflege(): void {
  const roh = bankRoh("pflege.json") as {
    wortschatz?: PflegeWort[]; dialoge?: PflegeDialog[]; dokumentation?: PflegeDoku[]; pruefung?: PflegePruefung[];
    medizinpruefung?: { hinweisAr: string; lesen: PflegeMedLesen[]; hoeren: PflegeMedHoeren[] };
  } | undefined;
  if (!roh) return;
  if (roh.wortschatz?.length && pflegeWoerter.length === 0) pflegeWoerter.splice(0, 0, ...roh.wortschatz);
  if (roh.dialoge?.length && pflegeDialoge.length === 0) pflegeDialoge.splice(0, 0, ...roh.dialoge);
  if (roh.dokumentation?.length && pflegeDoku.length === 0) pflegeDoku.splice(0, 0, ...roh.dokumentation);
  if (roh.pruefung?.length && pflegePruefung.length === 0) pflegePruefung.splice(0, 0, ...roh.pruefung);
  if (roh.medizinpruefung && pflegeMedizin.lesen.length === 0) {
    pflegeMedizin.hinweisAr = roh.medizinpruefung.hinweisAr;
    pflegeMedizin.lesen.splice(0, 0, ...roh.medizinpruefung.lesen);
    pflegeMedizin.hoeren.splice(0, 0, ...roh.medizinpruefung.hoeren);
  }
}
fuellePflege();
beiBankenBereit(fuellePflege);
