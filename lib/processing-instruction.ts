/**
 * 024 Processing Instruction (VanPatten)
 * لا تشرح القاعدة ثم تطلب إنتاجًا؛ اعرض مدخلاً معالجًا يُجبر المتعلم على فهم الشكل-المعنى.
 * مثال: بدل "املأ weil" اعرض جملتين واطلب "أيهما سبب؟" — المعالجة قبل الإنتاج.
 */
export interface PIItem {
  id: string;
  promptDe: string;
  promptAr: string;
  sents: string[]; // جملتان للمقارنة
  correct: number; // 0 أو 1
  fokus: string; // ما الشكل المستهدف
}

export function piAuswahl(item: PIItem, choice: number): boolean {
  return choice === item.correct;
}

export function piItemsFor(gramId: string): PIItem[] {
  // مولد مبسط — الحالات الحقيقية في content/grammar.json exercises
  const bank: Record<string, PIItem[]> = {
    "a2-weil-dass": [
      {
        id: "pi-weil-1",
        promptDe: "Welcher Satz gibt einen Grund?",
        promptAr: "أي جملة تُعطي سببًا؟",
        sents: ["Ich lerne Deutsch, weil ich in Deutschland arbeiten will.", "Ich lerne Deutsch und arbeite in Deutschland."],
        correct: 0,
        fokus: "weil = Grund",
      },
    ],
    "b1-konnektoren": [
      {
        id: "pi-obwohl-1",
        promptDe: "Was ist ein Gegensatz trotz positiver Erwartung?",
        promptAr: "ما التناقض رغم التوقع الإيجابي؟",
        sents: ["Obwohl es regnete, gingen wir spazieren.", "Weil es regnete, blieben wir zu Hause."],
        correct: 0,
        fokus: "obwohl = Konzessiv",
      },
    ],
  };
  return bank[gramId] ?? [];
}
