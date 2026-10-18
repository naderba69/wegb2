/**
 * 🎭 A25 (R293, Experten-Audit): Feinpragmatik — طلب ملطّف، اعتذار،
 * اعتراض مهذب، فكاهة خفيفة. الصيغة الأصحّ هي الألطف فعليًا في الموقف
 * (Konjunktiv II ووصلات التلطيف)، لا الأطول ولا الأكثر خضوعًا.
 */
export interface PragmatikSituation {
  id: string;
  kategorie: "entschuldigung" | "bitte" | "widerspruch" | "humor" | "absage" | "kritik";
  situationAr: string;
  optionen: string[];
  richtig: number;
  erklaerungAr: string;
}

export const PRAGMATIK_KATEGORIE_AR: Record<PragmatikSituation["kategorie"], string> = {
  entschuldigung: "اعتذار",
  bitte: "طلب ملطّف",
  widerspruch: "اعتراض مهذب",
  humor: "فكاهة خفيفة",
  absage: "رفض مهذب",
  kritik: "نقد ملطّف",
};

export const PRAGMATIK: PragmatikSituation[] = [
  {
    id: "pr-01", kategorie: "entschuldigung",
    situationAr: "تأخرتَ عن اجتماع عمل بسبب القطار. ماذا تقول عند دخولك؟",
    optionen: [
      "Ich bin zu spät. Pech gehabt.",
      "Es tut mir wirklich leid, dass ich zu spät bin — der Zug hatte Verspätung.",
      "Es ist nicht meine Schuld, der Zug war schuld!",
    ],
    richtig: 1,
    erklaerungAr: "اعتذار صريح (Es tut mir leid) + سبب قصير بلا اتهام أحد — لا لامبالاة ولا دفاع عدائي.",
  },
  {
    id: "pr-02", kategorie: "bitte",
    situationAr: "تريد يوم إجازة من مديرك يوم الجمعة.",
    optionen: [
      "Ich nehme am Freitag frei, okay?",
      "Geben Sie mir bitte bitte den Freitag frei!",
      "Wäre es möglich, dass ich am Freitag freinehme? Ich würde die Stunden nächste Woche nachholen.",
    ],
    richtig: 2,
    erklaerungAr: "Wäre es möglich + würde (Konjunktiv II) تلطّف الطلب، وتعويض مقترح يجعله سهل القبول.",
  },
  {
    id: "pr-03", kategorie: "widerspruch",
    situationAr: "في مناقشة، زميلك يقول رأيًا تخالفه. كيف تعترض؟",
    optionen: [
      "Da haben Sie sicher einen Punkt, aber ich sehe das ein bisschen anders, weil …",
      "Das ist einfach falsch.",
      "Sie haben überhaupt keine Ahnung.",
    ],
    richtig: 0,
    erklaerungAr: "إقرار جزئي أولًا (einen Punkt haben) ثمّ اختلاف ملطّف (ein bisschen anders) مع تعليل — الاعتراض يحفظ العلاقة.",
  },
  {
    id: "pr-04", kategorie: "absage",
    situationAr: "دعاك جارك للعشاء ولا تستطيع الذهاب.",
    optionen: [
      "Nein, keine Lust.",
      "Vielleicht im nächsten Leben.",
      "Das ist sehr nett von Ihnen, aber ich kann leider nicht — ich habe schon etwas vor.",
    ],
    richtig: 2,
    erklaerungAr: "شكر (sehr nett von Ihnen) + leider + سبب موجز — رفض واضح بلا جرح ولا كذب مفضوح.",
  },
  {
    id: "pr-05", kategorie: "bitte",
    situationAr: "لم تفهم ما قاله المعلّم وتريده أن يعيده ببطء.",
    optionen: [
      "Sprich langsamer!",
      "Entschuldigung, könnten Sie das bitte noch einmal langsamer sagen?",
      "Ich verstehe gar nichts, egal.",
    ],
    richtig: 1,
    erklaerungAr: "Entschuldigung + könnten Sie (Konjunktiv II) + bitte — الطلب المهذب صيغة ثابتة احفظها كما هي.",
  },
  {
    id: "pr-06", kategorie: "kritik",
    situationAr: "زميلك يعرض عليك نصّه لتراجعه، وفيه موضع ضعيف.",
    optionen: [
      "Der Text ist schlecht.",
      "Alles falsch — schreib ihn neu.",
      "Der Anfang ist schon richtig gut; an einer Stelle könnte man den Satz vielleicht noch klarer machen.",
    ],
    richtig: 2,
    erklaerungAr: "قوة أولًا ثمّ موضع واحد محدد ملطّفًا بـkönnte man + vielleicht — نقد يُسمَع بدل أن يُرفَض.",
  },
  {
    id: "pr-07", kategorie: "humor",
    situationAr: "سكب زميلك قهوة قربك واعتذر مرتبكًا. ردّ خفيف يفكّ التوتر:",
    optionen: [
      "Kein Problem — mein Hemd wollte sowieso einen neuen Look.",
      "Pass gefälligst besser auf!",
      "Das wird teuer für dich.",
    ],
    richtig: 0,
    erklaerungAr: "سخرية من الذات/الموقف لا من الشخص (neuen Look) — الفكاهة الألمانية الآمنة تضحك معك لا عليك.",
  },
  {
    id: "pr-08", kategorie: "widerspruch",
    situationAr: "تريد مقاطعة المتحدث في اجتماع لتضيف نقطة مهمة الآن.",
    optionen: [
      "Hören Sie sofort auf zu reden!",
      "Ich sage einfach gar nichts.",
      "Darf ich kurz einhaken? Das passt genau zu einem Punkt von vorhin.",
    ],
    richtig: 2,
    erklaerungAr: "Darf ich kurz einhaken? إذن مهذب + ربط بما قيل — مقاطعة تضيف ولا تصادر الكلام.",
  },
  {
    id: "pr-09", kategorie: "bitte",
    situationAr: "تحتاج يومًا إضافيًا لتسليم واجب للمعلّم.",
    optionen: [
      "Ich gebe das später ab, fertig.",
      "Ich gebe mir Mühe, aber ich bräuchte einen Tag länger — wäre das in Ordnung?",
      "Sie müssen mir mehr Zeit geben!",
    ],
    richtig: 1,
    erklaerungAr: "bräuchte + wäre das in Ordnung? (Konjunktiv II) — طلب بصيغة سؤال يترك للآخر قراره.",
  },
  {
    id: "pr-10", kategorie: "kritik",
    situationAr: "غرفتك في الفندق صاخبة وتريد تغييرها دون شجار.",
    optionen: [
      "Dieses Zimmer ist eine Katastrophe!",
      "Ich beschwere mich jetzt offiziell!",
      "Ich wollte nur fragen, ob es vielleicht ein ruhigeres Zimmer gäbe — die Straße ist ziemlich laut.",
    ],
    richtig: 2,
    erklaerungAr: "Ich wollte nur fragen, ob … gäbe — شكوى في صيغة سؤال ملطّف تحصل على الغرفة غالبًا.",
  },
];
