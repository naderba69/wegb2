/**
 * 🗣️ A7 (R294, Experten-Audit): interaktives Sprechen —
 * Verhandlung, Diskussion, Beschwerde, höfliches Einhaken.
 * Geführte Züge mit Partnerstimme (TTS), drei Antwortzüge je Runde:
 * stark (sachlich + höflich), schwach (zu passiv), unhöflich.
 * Sitzungsübung — keine Sprechprüfung, keine Aussprachebewertung.
 */
export interface DialogOption {
  de: string;
  stufe: "stark" | "schwach" | "unhoeflich";
  feedbackAr: string;
}

export interface DialogZug {
  partnerDe: string;
  partnerAr: string;
  optionen: DialogOption[];
}

export interface DialogSzenario {
  id: string;
  kategorie: "verhandlung" | "diskussion" | "beschwerde" | "besprechung";
  titelAr: string;
  kontextAr: string;
  zuege: DialogZug[];
}

export const DIALOG_KATEGORIE_AR: Record<DialogSzenario["kategorie"], string> = {
  verhandlung: "تفاوض",
  diskussion: "مناقشة",
  beschwerde: "شكوى",
  besprechung: "مقاطعة مهذبة",
};

export const DIALOGSZENARIEN: DialogSzenario[] = [
  {
    id: "dz-dienstplan", kategorie: "verhandlung",
    titelAr: "تفاوض على جدول المناوبات",
    kontextAr: "مشرفتك تريد منك مناوبة ليلية إضافية هذا الأسبوع، وأنت مرتبط بموعد عائلي.",
    zuege: [
      {
        partnerDe: "Wir brauchen am Freitag noch jemanden für die Nachtschicht. Können Sie das übernehmen?",
        partnerAr: "نحتاج شخصًا إضافيًا لمناوبة الجمعة الليلية. هل تستطيع أخذها؟",
        optionen: [
          { de: "Ja, okay, ich mache das schon irgendwie.", stufe: "schwach", feedbackAr: "قبول مترهّل بلا حدود — ستتعب وربما تتراجع لاحقًا. التفاوض يبدأ بذكر قيدك بهدوء." },
          { de: "Nein, das geht gar nicht. Fragen Sie jemand anderen.", stufe: "unhoeflich", feedbackAr: "رفض قاطع بلا بديل — يغلق الباب ويضرّ صورتك المهنية." },
          { de: "Am Freitag habe ich einen wichtigen Familientermin. Aber ich könnte am Samstag die Spätschicht übernehmen — wäre das ein fairer Tausch?", stufe: "stark", feedbackAr: "قيد واضح + بديل ملموس + سؤال تفاوضي (fairer Tausch) — هذا هو التفاوض المحترف." },
        ],
      },
      {
        partnerDe: "Samstag hilft mir nur halb. Freitag bleibt das Problem.",
        partnerAr: "السبت يساعدني جزئيًا فقط. الجمعة هي المشكلة.",
        optionen: [
          { de: "Dann müssen Sie das Problem selbst lösen.", stufe: "unhoeflich", feedbackAr: "تحدٍّ مباشر للمشرفة — خاسر مهنيًا مهما كنت محقًّا." },
          { de: "Verstehe. Was wäre, wenn ich Freitag bis Mitternacht bleibe und Kollege Yilmaz den Rest übernimmt? Ich frage ihn selbst.", stufe: "stark", feedbackAr: "تفهّم (Verstehe) + حلّ وسط محسوب + تحمّل عبء التنفيذ (Ich frage ihn selbst) — يبني ثقة." },
          { de: "Na gut, dann sage ich den Termin eben ab.", stufe: "schwach", feedbackAr: "استسلام مرير سيظهر في أدائك. كان يمكن تقاسم المناوبة بدل إلغاء حياتك." },
        ],
      },
      {
        partnerDe: "Das klingt machbar. Ich trage es so ein.",
        partnerAr: "يبدو هذا قابلًا للتنفيذ. سأدوّنه هكذا.",
        optionen: [
          { de: "Danke für Ihr Verständnis. Könnten wir das kurz schriftlich festhalten, damit es keine Missverständnisse gibt?", stufe: "stark", feedbackAr: "شكر + تثبيت كتابي مهذب — يحمي الطرفين ويُنهي التفاوض بنظافة." },
          { de: "Endlich. Das war ja nicht so schwer.", stufe: "unhoeflich", feedbackAr: "تعليق منتصر بعد اتفاق — يهدم كل ما بنيته في الجولتين." },
          { de: "Wie Sie wollen.", stufe: "schwach", feedbackAr: "برود يوحي أنك مجبر؛ الاتفاق نجح لكن العلاقة خسرت." },
        ],
      },
    ],
  },
  {
    id: "dz-handy", kategorie: "diskussion",
    titelAr: "مناقشة: الهواتف في مكان العمل؟",
    kontextAr: "زميلك يقترح منع الهواتف تمامًا في الاستراحة المشتركة. ناقشه.",
    zuege: [
      {
        partnerDe: "Ich finde, Handys sollten in der Pause komplett verboten werden. Alle starren nur aufs Display.",
        partnerAr: "أرى أن تُمنع الهواتف تمامًا في الاستراحة. الكل يحدّق في الشاشة فقط.",
        optionen: [
          { de: "Das ist doch Unsinn, das geht gar nicht.", stufe: "unhoeflich", feedbackAr: "هجوم على الفكرة وصاحبها — المناقشة انتهت قبل أن تبدأ." },
          { de: "Da ist etwas Wahres dran — wir reden wirklich weniger. Aber ein komplettes Verbot geht mir zu weit, viele warten auf wichtige Anrufe.", stufe: "stark", feedbackAr: "إقرار جزئي ثمّ تحفّظ معلّل — صيغة المناقشة الذهبية: zustimmen + aber + Grund." },
          { de: "Mir egal, macht, was ihr wollt.", stufe: "schwach", feedbackAr: "انسحاب — في المناقشة رأيك جزء من القيمة، لا تصمت عنه." },
        ],
      },
      {
        partnerDe: "Aber ohne Regeln ändert sich doch nichts!",
        partnerAr: "لكن بلا قواعد لن يتغيّر شيء!",
        optionen: [
          { de: "Regeln ja — aber eine freiwillige Vereinbarung wirkt besser als ein Verbot. Zum Beispiel: Handys bleiben beim Essen in der Tasche.", stufe: "stark", feedbackAr: "قبول المبدأ + اقتراح بديل عملي بمثال — تنقل المناقشة من الجدل إلى الحل." },
          { de: "Dann brauchen wir eben einen Chef, der das verbietet.", stufe: "schwach", feedbackAr: "تفويض للسلطة بدل اقتراح — موقف بلا وزن في مناقشة زملاء." },
          { de: "Du übertreibst total.", stufe: "unhoeflich", feedbackAr: "تشخيص للشخص (übertreibst) لا ردّ على الحجة." },
        ],
      },
      {
        partnerDe: "Eine Vereinbarung fürs Essen — das könnte ich mir vorstellen.",
        partnerAr: "اتفاق لوقت الأكل — أستطيع تخيّل ذلك.",
        optionen: [
          { de: "Siehst du, ich hatte recht.", stufe: "unhoeflich", feedbackAr: "انتصار صغير يفسد توافقًا كبيرًا. لا تُعلن الفوز في مناقشة ودّية." },
          { de: "Gut, dann schlagen wir das beim nächsten Teamtreffen gemeinsam vor.", stufe: "stark", feedbackAr: "تحويل التوافق إلى خطوة مشتركة (gemeinsam) — خاتمة مناقشة ناجحة." },
          { de: "Von mir aus.", stufe: "schwach", feedbackAr: "فاتر؛ التوافق كان يستحق حماسًا يثبّته." },
        ],
      },
    ],
  },
  {
    id: "dz-beschwerde", kategorie: "beschwerde",
    titelAr: "شكوى مهذبة في إدارة سكن",
    kontextAr: "التدفئة في شقتك معطلة منذ ثلاثة أيام والشتاء قارس. اتصلتَ بالإدارة.",
    zuege: [
      {
        partnerDe: "Hausverwaltung, guten Tag. Worum geht es?",
        partnerAr: "إدارة السكن، نهارك سعيد. ما الأمر؟",
        optionen: [
          { de: "Die Heizung ist seit drei Tagen kaputt, das ist eine Frechheit!", stufe: "unhoeflich", feedbackAr: "بدء باتهام (Frechheit) — الموظف سيقاومك بدل مساعدتك." },
          { de: "Guten Tag, hier spricht Frau/Herr Haddad. In meiner Wohnung funktioniert die Heizung seit drei Tagen nicht, und es ist sehr kalt. Könnten Sie bitte einen Techniker schicken?", stufe: "stark", feedbackAr: "تعريف بالنفس + وقائع بلا اتهام + طلب محدد مهذب — افتتاح شكوى مثالي." },
          { de: "Äh, die Heizung … geht nicht. Vielleicht schauen Sie mal.", stufe: "schwach", feedbackAr: "غامض ومتردد — بلا مدة ولا طلب واضح، لن يُفتح بلاغ جدّي." },
        ],
      },
      {
        partnerDe: "Wir haben viele Aufträge. Das kann bis nächste Woche dauern.",
        partnerAr: "لدينا طلبات كثيرة. قد يستغرق ذلك حتى الأسبوع القادم.",
        optionen: [
          { de: "Das akzeptiere ich nicht! Ich rufe meinen Anwalt an!", stufe: "unhoeflich", feedbackAr: "تهديد بالمحامي في الجولة الثانية — تصعيد مبكر يجمّد التعاون." },
          { de: "Eine Woche ohne Heizung im Winter ist leider nicht zumutbar. Gibt es eine frühere Möglichkeit — vielleicht einen Notdienst? Ich halte mich gern flexibel.", stufe: "stark", feedbackAr: "حدّ واضح (nicht zumutbar) + سؤال عن بديل + مرونة منك — ضغط مهذب فعّال." },
          { de: "Na ja, dann warte ich eben.", stufe: "schwach", feedbackAr: "قبول أسبوعًا بلا تدفئة — حقّك في سكن دافئ أقوى من هذا التراجع." },
        ],
      },
      {
        partnerDe: "Ich schaue, ob der Notdienst morgen früh kann. Ich rufe Sie zurück.",
        partnerAr: "سأرى إن كان خدمة الطوارئ تستطيع غدًا صباحًا. سأعاود الاتصال بك.",
        optionen: [
          { de: "Bis wann darf ich mit Ihrem Rückruf rechnen? Und könnten Sie mir die Ticketnummer geben?", stufe: "stark", feedbackAr: "موعد محدد + رقم بلاغ — الشكوى المهذبة تُختم دائمًا بما يمكن الرجوع إليه." },
          { de: "Wehe, Sie rufen nicht an.", stufe: "unhoeflich", feedbackAr: "تهديد ختامي — يحوّل وعدًا جيدًا إلى عداوة." },
          { de: "Okay, danke.", stufe: "schwach", feedbackAr: "شكر بلا تثبيت — إن لم يتصلوا لن تملك مرجعًا." },
        ],
      },
    ],
  },
  {
    id: "dz-meeting", kategorie: "besprechung",
    titelAr: "مقاطعة مهذبة في اجتماع",
    kontextAr: "في اجتماع فريق، زميل يعرض خطة وتنقصها معلومة تملكها أنت الآن.",
    zuege: [
      {
        partnerDe: "… und deshalb starten wir die Kampagne am Montag mit dem vollen Budget.",
        partnerAr: "… ولذلك نبدأ الحملة يوم الاثنين بالميزانية الكاملة.",
        optionen: [
          { de: "Stopp! Das Budget wurde gestern gekürzt!", stufe: "unhoeflich", feedbackAr: "مقاطعة صارخة (Stopp) — المعلومة صحيحة لكن الأسلوب يحرج المتحدث." },
          { de: "Darf ich kurz einhaken? Dazu gab es gestern eine neue Information, die uns alle betrifft.", stufe: "stark", feedbackAr: "إذن مهذب (Darf ich kurz einhaken) + تبرير جماعي (betrifft uns alle) — المقاطعة المحترفة." },
          { de: "… (السكوت وترك الخطأ يمرّ)", stufe: "schwach", feedbackAr: "السكوت هنا ليس أدبًا — معلومة خاطئة ستبنى عليها قرارات." },
        ],
      },
      {
        partnerDe: "Ach ja? Was denn für eine Information?",
        partnerAr: "حقًا؟ ما هذه المعلومة؟",
        optionen: [
          { de: "Das Budget wurde um zwanzig Prozent gekürzt. Wenn wir trotzdem voll starten, fehlt am Ende Geld für die zweite Phase.", stufe: "stark", feedbackAr: "حقيقة + أثر عملي على الخطة — المعلومة تخدم القرار لا العرض." },
          { de: "Tja, hätten Sie sich besser informiert.", stufe: "unhoeflich", feedbackAr: "تشفٍّ أمام الفريق — لن تُسمع معلومتك بعدها." },
          { de: "Nur so eine Kleinigkeit, nicht so wichtig.", stufe: "schwach", feedbackAr: "تقليل من معلومة جوهرية — لماذا قاطعتَ إذن؟" },
        ],
      },
      {
        partnerDe: "Gut, dass Sie das sagen. Dann planen wir die zweite Phase kleiner.",
        partnerAr: "من الجيد أنك قلت ذلك. سنخطط المرحلة الثانية أصغر إذن.",
        optionen: [
          { de: "Gern. Ich schicke Ihnen die Zahlen nach dem Meeting zu.", stufe: "stark", feedbackAr: "متابعة موثّقة بعد الاجتماع — تُنهي المقاطعة وتعيد الكلام لصاحبه بكرم." },
          { de: "Sehen Sie, ohne mich läuft hier nichts.", stufe: "unhoeflich", feedbackAr: "غرور ختامي — سيُتجنّب سماعك في المرة القادمة." },
          { de: "Schon gut.", stufe: "schwach", feedbackAr: "مقبول لكنه يفوّت فرصة تثبيت التعاون بعرض الأرقام." },
        ],
      },
    ],
  },
];
