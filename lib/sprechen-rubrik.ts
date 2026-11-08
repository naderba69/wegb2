/**
 * 🎙️ تقييم Sprechen B2 — Rubrik Goethe 0-5×4 = 20 → 100 نقطة
 * المعايير الأربعة الرسمية (Goethe-Zertifikat B2 Sprechen):
 *  - Aufgabenerfüllung (إنجاز المهمة)
 *  - Kohärenz und Flüssigkeit (تماسك وطلاقة)
 *  - Wortschatz (ثروة معجمية)
 *  - Korrektheit (صحة لغوية)
 * كل معيار 0-5، المجموع 20 يُحوّل إلى 100 (×5)
 */

export type RubrikKriterium = "aufgabenerfuellung" | "kohaerenz" | "wortschatz" | "korrektheit";

export interface RubrikBewertung {
  aufgabenerfuellung: number; // 0-5
  kohaerenz: number;
  wortschatz: number;
  korrektheit: number;
  gesamt20: number;
  gesamt100: number;
  bestanden: boolean; // ≥12/20 ≈ 60/100
  feedbackAr: string[];
}

export const RUBRIK_LABEL: Record<RubrikKriterium, { de:string; ar:string }> = {
  aufgabenerfuellung: { de: "Aufgabenerfüllung", ar: "إنجاز المهمة" },
  kohaerenz: { de: "Kohärenz & Flüssigkeit", ar: "التماسك والطلاقة" },
  wortschatz: { de: "Wortschatz", ar: "الثروة المعجمية" },
  korrektheit: { de: "Korrektheit", ar: "الصحة اللغوية" },
};

export function bewerteRubrik(scores: Record<RubrikKriterium, number>): RubrikBewertung {
  const clamp = (n:number)=> Math.max(0, Math.min(5, Math.round(n)));
  const a = clamp(scores.aufgabenerfuellung);
  const k = clamp(scores.kohaerenz);
  const w = clamp(scores.wortschatz);
  const r = clamp(scores.korrektheit);
  const gesamt20 = a+k+w+r;
  const gesamt100 = gesamt20 * 5;
  const bestanden = gesamt20 >= 12; // 60%
  const feedbackAr: string[] = [];
  if (a < 3) feedbackAr.push("إنجاز المهمة: أضف مقدمة وخاتمة وتعامل مع كل نقاط المهمة.");
  if (k < 3) feedbackAr.push("التماسك: استخدم روابط (weil, obwohl, deshalb, dagegen) وأوقف مؤقت بين الأفكار.");
  if (w < 3) feedbackAr.push("المعجم: نوّع المفردات — تجنب تكرار gut/schön واستخدم Kollokationen من البطاقات.");
  if (r < 3) feedbackAr.push("الصحة: راجع تطابق الفاعل والفعل وترتيب الفعل في الجملة الفرعية.");
  if (feedbackAr.length===0) feedbackAr.push("أداء متوازن — واصل التدريب مع شريك.");
  return { aufgabenerfuellung:a, kohaerenz:k, wortschatz:w, korrektheit:r, gesamt20, gesamt100, bestanden, feedbackAr };
}

/** محاكاة شريك B2 — branching dialogue بسيط لـ Teil 3 (Diskussion) */
export interface PartnerPrompt {
  id: string;
  thema: string; // e.g. "Vier-Tage-Woche"
  rolleA: string; // learner
  rolleB: string; // bot
  startDe: string;
  wendungen: string[]; // Redemittel للمناقشة
  antworten: Record<string, string>; // choice -> bot reply
}

export const PARTNER_THEMEN: PartnerPrompt[] = [
  {
    id: "partner-01",
    thema: "Vier-Tage-Woche",
    rolleA: "Du bist für Vier-Tage-Woche",
    rolleB: "Bot ist dagegen (Arbeitsbelastung)",
    startDe: "Ich finde, vier Tage sind genug, wenn die Produktivität gleich bleibt. Was meinst du?",
    wendungen: ["Meiner Meinung nach","Ich bin der Ansicht","Einerseits ... andererseits","Das überzeugt mich nicht, weil","Könntest du ein Beispiel nennen?"],
    antworten: {
      "Ich stimme zu — weniger Stress": "Weniger Stress klingt gut, aber was ist mit Pflege und Gastronomie, wo Präsenz nötig ist?",
      "Produktivität bleibt gleich": "Studien zeigen das für Büroarbeit, aber nicht für jede Branche. Wie siehst du Pflege?",
      "Mehr Freizeit für Familie": "Familie profitiert, doch wer bezahlt den fünften Tag, wenn Umsatz sinkt?",
    }
  },
  {
    id: "partner-02",
    thema: "Digitalisierung in der Schule",
    rolleA: "Du bist für Tablets im Unterricht",
    rolleB: "Bot ist skeptisch (Didaktik fehlt)",
    startDe: "Tablets können Lernen individualisieren. Findest du nicht auch?",
    wendungen: ["Ich sehe das so","Der Vorteil ist","Allerdings muss man bedenken","Wie würdest du das lösen?"],
    antworten: {
      "Individualisierung hilft": "Individualisierung ja, aber ohne Konzept ist Tablet nur teures Papier. Was ist Konzept?",
      "Lehrer brauchen Schulung": "Genau — Schulung fehlt in vielen Plänen. Wer finanziert das?",
      "Motivation steigt": "Motivation kurzfristig ja, aber verpufft sie ohne gute Aufgaben?",
    }
  },
  {
    id: "partner-03",
    thema: "Wohnen in der Stadt vs Land",
    rolleA: "Du bevorzugst Stadt",
    rolleB: "Bot bevorzugt Land",
    startDe: "In der Stadt gibt es kurze Wege und viele Jobs. Warum ziehst du aufs Land?",
    wendungen: ["Für mich ist wichtig","Im Gegensatz dazu","Das stimmt, jedoch","Was wäre ein Kompromiss?"],
    antworten: {
      "Stadt hat Jobs": "Jobs ja, aber Mieten sind hoch und Lärm belastet. Ist Land nicht gesünder?",
      "Kultur in der Stadt": "Kultur ja, aber Land bietet Natur und Gemeinschaft. Wie verbindest du beides?",
      "Besser pendeln": "Pendeln kostet Zeit und Geld. Wäre Homeoffice ein Kompromiss?",
    }
  },
];
