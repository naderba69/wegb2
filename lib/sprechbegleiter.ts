import type { LlmCfg } from "./grader";
import { llmGespraech } from "./grader";

/**
 * 🤖 رفيق المحادثة الذكي (R198) — اقتراح المالك: «AI مرافق ومساعد خاصة في الشبريشن (Sprechen)».
 * مبادئ المشروع لا تتغيّر: BYOK فقط + موافقة مسجّلة (llmBereit)، لا خدمة افتراضية،
 * لا حكم نطق — ملاحظات لغوية على النصّ المكتوب/المُفرَّغ فقط، موسومة بأنها من نموذج ذكاء اصطناعي.
 * هذه الوحدة لا تنفّذ fetch بنفسها: المسار الوحيد يبقى llmGespraech في lib/grader.ts (K122c).
 */
export interface SprechSzenario {
  id: string;
  titelAr: string;
  beschreibungAr: string;
  /** دور الشريك الذكي بالألمانية (يُزرع في موجّه النظام) */
  rolleDe: string;
  /** أول سطر يقوله الشريك — محلي فوري بلا أيّ استدعاء */
  startDe: string;
  niveau: "B1" | "B2";
}

export const SPRECH_SZENARIEN: SprechSzenario[] = [
  {
    id: "sb-visite",
    titelAr: "تقديم حالة في الجولة الطبية (Visite)",
    beschreibungAr: "الذكاء طبيب يسألك، وأنت تقدّم حالة مريضك باختصار ودقّة.",
    rolleDe: "ein Oberarzt bei der Visite. Du stellst kurze, konkrete Fragen zu einem Patienten (Beschwerden, Vitalwerte, Verlauf, Medikation).",
    startDe: "Guten Morgen. Stellen Sie mir bitte Ihren Patienten vor: Wer ist er, und warum ist er bei uns?",
    niveau: "B2",
  },
  {
    id: "sb-beruhigung",
    titelAr: "تهدئة مريض قلق قبل عملية",
    beschreibungAr: "الذكاء مريضة خائفة؛ مهمّتك التهدئة المهنية الواضحة.",
    rolleDe: "eine ängstliche Patientin vor einer Operation. Du äußerst Sorgen und stellst Fragen zu Schmerzen, Ablauf und Risiken.",
    startDe: "Ich habe solche Angst vor morgen. Wird die Operation sehr wehtun?",
    niveau: "B1",
  },
  {
    id: "sb-uebergabe",
    titelAr: "تسليم وردية لزميل",
    beschreibungAr: "الذكاء زميل يستلم منك ويسأل عمّا ينقصه.",
    rolleDe: "eine Pflegekraft im Frühdienst, die die Übergabe entgegennimmt. Du fragst gezielt nach, wenn etwas fehlt (Werte, Medikamente, Besonderheiten).",
    startDe: "Guten Morgen! Ich übernehme jetzt. Was gibt es Neues auf der Station?",
    niveau: "B2",
  },
  {
    id: "sb-angehoerige",
    titelAr: "حديث مع أهل مريض",
    beschreibungAr: "الذكاء ابنة قلقة تسأل عن حال والدها وموعد خروجه.",
    rolleDe: "die besorgte Tochter eines Patienten. Du fragst nach dem Zustand deines Vaters, nach Besuch und Entlassung.",
    startDe: "Guten Tag, ich bin die Tochter von Herrn Berger. Wie geht es meinem Vater heute?",
    niveau: "B1",
  },
  {
    id: "sb-telefon",
    titelAr: "مهاتفة الطبيب بقيم مقلقة",
    beschreibungAr: "الذكاء طبيب مناوب على الهاتف؛ بلّغ بقيم حيوية تغيّرت.",
    rolleDe: "ein diensthabender Arzt am Telefon. Du hörst kurz zu und stellst präzise Rückfragen zu Vitalwerten und Maßnahmen.",
    startDe: "Ja, hallo? Was gibt es?",
    niveau: "B2",
  },
  {
    id: "sb-pruefung",
    titelAr: "محاكاة حديث الامتحان (B2)",
    beschreibungAr: "الذكاء شريك/ممتحِن في مناقشة رأي — كما في الجزء الشفوي.",
    rolleDe: "ein Prüfungspartner in einer B2-Diskussion. Du vertrittst eine eigene Meinung zum Thema (z. B. Pflegeberuf oder Arbeitsleben) und fragst nach der Meinung des Lernenden.",
    startDe: "Unser Thema heute: Immer mehr Pflegekräfte kommen aus dem Ausland. Was denken Sie darüber?",
    niveau: "B2",
  },
];

/** موجّه النظام: يبقى في الدور، ألمانية بمستوى المتعلم، وملاحظة عربية لغوية واحدة — بلا أيّ كلام عن النطق. */
export function begleiterSystem(s: SprechSzenario): string {
  return [
    `Du bist ${s.rolleDe}`,
    `Sprich ausschließlich Deutsch, in 2 bis 4 kurzen Sätzen, Sprachniveau ${s.niveau}. Bleib immer in deiner Rolle und im Gespräch.`,
    `Schreibe nach deiner Antwort in einer neuen Zeile: 💡 gefolgt von GENAU einem kurzen arabischen Hinweis an den Lernenden: Korrigiere freundlich den wichtigsten Sprachfehler seines letzten Satzes (mit richtiger Form) — oder lobe eine gute Formulierung, wenn es keinen Fehler gab.`,
    `Sprich NIEMALS über Aussprache oder Betonung — du hörst nur Text. Erwähne nie, dass du eine KI bist.`,
  ].join("\n");
}

/** يفصل متن الردّ عن ملاحظة 💡 — غيابها مقبول (tipp=null). */
export function teileAntwort(raw: string): { text: string; tipp: string | null } {
  const i = raw.indexOf("💡");
  if (i < 0) return { text: raw.trim(), tipp: null };
  const tipp = raw.slice(i + 2).trim();
  return { text: raw.slice(0, i).trim(), tipp: tipp ? tipp : null };
}

export interface BegleiterZeile { wer: "ki" | "ich"; text: string; tipp?: string | null }

export async function begleiterAntworten(
  cfg: LlmCfg,
  szenario: SprechSzenario,
  verlauf: BegleiterZeile[]
): Promise<{ text: string; tipp: string | null } | null> {
  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: begleiterSystem(szenario) },
    ...verlauf.map((z) => ({
      role: (z.wer === "ki" ? "assistant" : "user") as "assistant" | "user",
      content: z.text,
    })),
  ];
  const raw = await llmGespraech(cfg, messages);
  return raw ? teileAntwort(raw) : null;
}
