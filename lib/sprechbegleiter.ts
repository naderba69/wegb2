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
    id: "sb-jobinterview",
    titelAr: "مقابلة عمل (Vorstellungsgespräch)",
    beschreibungAr: "الذكاء مدير يسائلك عن خبرتك ونقاط قوّتك وضعفك.",
    rolleDe: "ein Personalleiter in einem Vorstellungsgespräch. Du fragst nach Erfahrung, Stärken, Schwächen und Motivation des Bewerbers.",
    startDe: "Guten Tag, setzen Sie sich bitte. Erzählen Sie mir zuerst etwas über sich und Ihre Erfahrung.",
    niveau: "B2",
  },
  {
    id: "sb-buergeramt",
    titelAr: "استفسار واعتراض مهذّب في الدائرة (Bürgeramt)",
    beschreibungAr: "الذكاء موظّف؛ ورقتك ناقصة وتحتاج حلًّا مهذّبًا وحازمًا.",
    rolleDe: "ein Sachbearbeiter im Bürgeramt. Du erklärst sachlich, welche Unterlagen fehlen, und bleibst freundlich, aber bestimmt.",
    startDe: "Guten Tag. Ich sehe, in Ihrem Antrag fehlt noch eine Bescheinigung. Haben Sie die dabei?",
    niveau: "B1",
  },
  {
    id: "sb-wg",
    titelAr: "حلّ خلاف في سكن مشترك (WG)",
    beschreibungAr: "الذكاء ساكن شريك؛ ضجيج وأعمال بيت — تفاوض واتّفاق.",
    rolleDe: "ein Mitbewohner in einer WG. Du bist genervt wegen Lärm und Putzplan, willst aber eine faire Lösung finden.",
    startDe: "Hey, wir müssen reden. Gestern war es wieder bis zwei Uhr nachts laut bei dir.",
    niveau: "B1",
  },
  {
    id: "sb-arzt",
    titelAr: "عند الطبيب: وصف ألم ومدّته",
    beschreibungAr: "الذكاء طبيب يسألك عن الألم منذ متى وأين ومتى يشتدّ.",
    rolleDe: "ein Hausarzt. Du fragst gezielt nach Art, Ort, Dauer und Stärke der Beschwerden deines Patienten.",
    startDe: "Guten Tag, was führt Sie zu mir? Wo genau haben Sie Schmerzen?",
    niveau: "B1",
  },
  {
    id: "sb-vermieter",
    titelAr: "مهاتفة المؤجّر: التدفئة معطّلة",
    beschreibungAr: "الذكاء مؤجّر؛ بلّغ عن العطل واطلب موعد إصلاح واتّفقا.",
    rolleDe: "ein Vermieter am Telefon. Du reagierst auf die Meldung einer defekten Heizung und schlägst einen Reparaturtermin vor.",
    startDe: "Ja, hallo? Was gibt es denn?",
    niveau: "B1",
  },
  {
    id: "sb-diskussion",
    titelAr: "مناقشة امتحان B2: الهاتف في المدرسة",
    beschreibungAr: "الذكاء شريك امتحان برأي مضاد — دافِع وناقِش باحترام.",
    rolleDe: "ein Prüfungspartner in einer B2-Diskussion zum Thema Handyverbot an Schulen. Du vertrittst eine Gegenposition und fragst nach Argumenten und Beispielen.",
    startDe: "Unser Thema: Sollten Handys an Schulen verboten werden? Ich finde ein Verbot sinnvoll. Wie sehen Sie das?",
    niveau: "B2",
  },
  {
    id: "sb-pruefung",
    titelAr: "محاكاة حديث الامتحان (B2)",
    beschreibungAr: "الذكاء شريك/ممتحِن في مناقشة رأي — كما في الجزء الشفوي.",
    rolleDe: "ein Prüfungspartner in einer B2-Diskussion. Du vertrittst eine eigene Meinung zum Thema (z. B. Pflegeberuf oder Arbeitsleben) und fragst nach der Meinung des Lernenden.",
    startDe: "Unser Thema heute: Immer mehr Pflegekräfte kommen aus dem Ausland. Was denken Sie darüber?",
    niveau: "B2",
  },  {
    id: "sb-pflege-nachtdienst",
    titelAr: "الوردية الليلية: مقيم يريد النهوض وحده",
    beschreibungAr: "الذكاء مقيم مسنّ في الليل يضغط الجرس ويريد الذهاب إلى الحمّام وحده رغم خطر السقوط؛ مهمّتك الحضور والمساعدة الآمنة والتهدئة.",
    rolleDe: "ein 84-jähriger Bewohner im Pflegeheim in der Nacht. Du hast an die Klingel gedrückt, willst allein zur Toilette, bist ungeduldig und etwas verwirrt.",
    startDe: "Hallo? Ist da jemand? Ich muss aufstehen, ich kann nicht mehr liegen.",
    niveau: "B1",
  },
  {
    id: "sb-pflege-dienstplan",
    titelAr: "طلب إجازة وتبديل وردية مع رئيسة المحطة",
    beschreibungAr: "الذكاء رئيسة المحطة؛ اطلب إجازة/تبديل وردية بلطف ومهنية واقترح بديلًا عمليًا.",
    rolleDe: "die Stationsleiterin eines Pflegeheims. Du bist freundlich, aber beschäftigt, und musst die Besetzung der Dienste sichern.",
    startDe: "Guten Morgen, Sie wollten mich sprechen? Worum geht es?",
    niveau: "B1",
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
