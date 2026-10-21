import type { Level } from "./types";

/**
 * 📚 R300 (Wunsch des Besitzers: neuer Inhalt, alle Stufen) — freie Lese- und
 * Dialogtexte außerhalb des 378-Tage-Plans. Ehrlichkeitsregeln wie überall:
 * Hören nur über die Geräte-Stimme des Lernenden (ausgewiesen), keine
 * Hausaufnahmen, keine Planänderung. Betreut über K325.
 */
export interface StoffFrage {
  frageDe: string;
  optionen: string[];
  richtig: number;
  erklaerAr: string;
}

/**
 * 🗣️ R305/خ15: مهمّة «وساطة لغوية» (Sprachmittlung) — الركن الخامس في CEFR Companion
 * Volume 2020 إلى جانب الاستماع/القراءة/الكتابة/التحدث: نقل معنى نصّ ألماني إلى شخص لا
 * يقرأ الألمانية، لا ترجمة حرفية. اختيارية، بعد أسئلة الفهم، لنصوص/حوارات B1/B2 فقط
 * (حيث يصبح محتوى الحياة اليومية بالألمانية واقعًا محتملاً لمتعلم عربي في ألمانيا).
 */
export interface MediationAufgabe {
  aufgabeAr: string;
  punkteAr: string[];
}

/**
 * 📰 R305/خ18: «طابِق كل فقرة بعنوانها» — نمط Goethe Lesen Teil 1 (Überschriften zuordnen).
 * عدد العناوين في `optionen` أكبر من عدد الفقرات عمدًا (مُضلِّلات لا تطابق أيّ فقرة)،
 * و`richtig[i]` هو فهرس العنوان الصحيح للفقرة رقم i داخل `optionen` — مطابقة لا اختيار.
 */
export interface UeberschriftenAufgabe {
  optionen: string[];
  richtig: number[];
}

export interface FreierText {
  id: string;
  stufe: Level;
  art: "geschichte" | "alltag" | "wissen";
  titelDe: string;
  titelAr: string;
  absaetze: string[];
  fragen: StoffFrage[];
  mediation?: MediationAufgabe;
  ueberschriften?: UeberschriftenAufgabe;
}

export interface FreierDialog {
  id: string;
  stufe: Level;
  titelDe: string;
  titelAr: string;
  zeilen: { wer: string; de: string; ar: string }[];
  fragen: StoffFrage[];
  mediation?: MediationAufgabe;
}

export const FREIE_TEXTE: FreierText[] = [
  {
    id: "frei-a0-hund",
    stufe: "A0",
    art: "geschichte",
    titelDe: "Tom und der kleine Hund",
    titelAr: "توم والكلب الصغير",
    absaetze: [
      "Tom ist acht Jahre alt. Er hat einen Hund. Der Hund heißt Max. Max ist klein und braun. Tom und Max sind Freunde.",
      "Am Morgen geht Tom mit Max in den Park. Max läuft schnell. Tom wirft einen Ball. Max bringt den Ball zurück. Am Abend schläft Max in Toms Zimmer. Tom sagt: „Gute Nacht, Max!“",
    ],
    fragen: [
      { frageDe: "Wie heißt der Hund?", optionen: ["Max", "Tom", "Ben"], richtig: 0, erklaerAr: "النص يقول: الكلب اسمه ماكس." },
      { frageDe: "Was wirft Tom im Park?", optionen: ["Einen Stein", "Einen Ball", "Ein Buch"], richtig: 1, erklaerAr: "توم يرمي كرة، وماكس يعيدها." },
      { frageDe: "Wo schläft Max?", optionen: ["In der Küche", "Im Garten", "In Toms Zimmer"], richtig: 2, erklaerAr: "في المساء ينام ماكس في غرفة توم." },
    ],
  },
  {
    id: "frei-a0-morgen",
    stufe: "A0",
    art: "alltag",
    titelDe: "Mein Morgen",
    titelAr: "صباحي",
    absaetze: [
      "Ich stehe um sieben Uhr auf. Ich wasche mein Gesicht und putze meine Zähne. Dann frühstücke ich mit meiner Familie. Ich esse Brot mit Käse und trinke Tee.",
      "Um acht Uhr gehe ich zur Arbeit. Ich fahre mit dem Bus. Der Bus ist oft voll, aber schnell. Um neun Uhr bin ich im Büro. Mein Tag beginnt.",
    ],
    fragen: [
      { frageDe: "Wann steht die Person auf?", optionen: ["Um sechs Uhr", "Um sieben Uhr", "Um neun Uhr"], richtig: 1, erklaerAr: "أستيقظ في السابعة." },
      { frageDe: "Was trinkt die Person zum Frühstück?", optionen: ["Kaffee", "Saft", "Tee"], richtig: 2, erklaerAr: "يشرب الشاي مع الخبز والجبن." },
      { frageDe: "Wie fährt die Person zur Arbeit?", optionen: ["Mit dem Bus", "Mit dem Auto", "Zu Fuß"], richtig: 0, erklaerAr: "يركب الحافلة — غالبًا مزدحمة لكنها سريعة." },
    ],
  },
  {
    id: "frei-a0-park",
    stufe: "A0",
    art: "alltag",
    titelDe: "Ein Tag im Park",
    titelAr: "يوم في الحديقة",
    absaetze: [
      "Heute ist Samstag. Die Sonne scheint und es ist warm. Anna und Ben gehen in den Park. Viele Kinder spielen dort.",
      "Anna und Ben spielen Fußball. Dann haben sie Hunger. Sie kaufen ein Eis. Das Eis ist kalt und lecker. Am Abend gehen sie glücklich nach Hause.",
    ],
    fragen: [
      { frageDe: "Wie ist das Wetter?", optionen: ["Es regnet", "Die Sonne scheint", "Es ist kalt"], richtig: 1, erklaerAr: "الشمس مشرقة والجو دافئ." },
      { frageDe: "Was spielen Anna und Ben?", optionen: ["Tennis", "Karten", "Fußball"], richtig: 2, erklaerAr: "يلعبان كرة القدم." },
      { frageDe: "Was kaufen sie danach?", optionen: ["Ein Eis", "Ein Brot", "Einen Saft"], richtig: 0, erklaerAr: "يشتريان مثلجات — باردة ولذيذة." },
    ],
  },
  {
    id: "frei-a1-fahrrad",
    stufe: "A1",
    art: "geschichte",
    titelDe: "Lina lernt Fahrrad fahren",
    titelAr: "لينا تتعلّم ركوب الدراجة",
    absaetze: [
      "Lina ist 25 Jahre alt und wohnt in einer kleinen Stadt. Sie hat ein neues Fahrrad, aber sie kann noch nicht fahren. Ihr Bruder Karim hilft ihr. Am Sonntag gehen sie zusammen in einen ruhigen Park.",
      "Zuerst hält Karim das Fahrrad fest. Lina fährt langsam und ist ein bisschen nervös. Dann lässt Karim los. Lina fährt allein! Sie lacht und ruft: „Ich kann es!“ Am Ende des Tages fährt sie den ganzen Weg nach Hause.",
    ],
    fragen: [
      { frageDe: "Wer hilft Lina?", optionen: ["Ihre Mutter", "Ihr Bruder Karim", "Eine Freundin"], richtig: 1, erklaerAr: "أخوها كريم يساعدها." },
      { frageDe: "Wo üben sie?", optionen: ["In einem ruhigen Park", "Auf einer großen Straße", "Im Garten"], richtig: 0, erklaerAr: "يتدربان في حديقة هادئة يوم الأحد." },
      { frageDe: "Wie fühlt sich Lina am Anfang?", optionen: ["Müde", "Nervös", "Wütend"], richtig: 1, erklaerAr: "كانت متوترة قليلًا في البداية." },
    ],
  },
  {
    id: "frei-a1-markt",
    stufe: "A1",
    art: "alltag",
    titelDe: "Der Markt am Samstag",
    titelAr: "السوق يوم السبت",
    absaetze: [
      "Jeden Samstag geht Sara auf den Markt. Der Markt ist groß und bunt. Sie kauft frisches Gemüse: Tomaten, Gurken und Kartoffeln. An einem anderen Stand kauft sie Äpfel und Bananen.",
      "Der Verkäufer ist freundlich. Er sagt: „Die Äpfel sind heute besonders süß.“ Sara kauft auch Brot und Blumen für ihre Mutter. Nach einer Stunde geht sie mit zwei schweren Taschen nach Hause.",
    ],
    fragen: [
      { frageDe: "Wann geht Sara auf den Markt?", optionen: ["Jeden Samstag", "Jeden Sonntag", "Am Freitag"], richtig: 0, erklaerAr: "كل يوم سبت." },
      { frageDe: "Was sagt der Verkäufer über die Äpfel?", optionen: ["Sie sind billig", "Sie sind besonders süß", "Sie sind neu"], richtig: 1, erklaerAr: "قال إن التفاح اليوم حلو بشكل خاص." },
      { frageDe: "Für wen sind die Blumen?", optionen: ["Für Sara", "Für den Verkäufer", "Für ihre Mutter"], richtig: 2, erklaerAr: "اشترت زهورًا لوالدتها." },
    ],
  },
  {
    id: "frei-a1-jahreszeiten",
    stufe: "A1",
    art: "wissen",
    titelDe: "Die vier Jahreszeiten",
    titelAr: "الفصول الأربعة",
    absaetze: [
      "In Deutschland gibt es vier Jahreszeiten. Im Frühling ist es mild und die Blumen blühen. Im Sommer ist es warm und die Tage sind lang. Viele Menschen fahren in den Urlaub ans Meer.",
      "Im Herbst fallen die Blätter von den Bäumen und es regnet oft. Im Winter ist es kalt und manchmal schneit es. Die Kinder bauen dann einen Schneemann und trinken heißen Kakao.",
    ],
    fragen: [
      { frageDe: "Wie ist das Wetter im Frühling?", optionen: ["Sehr kalt", "Mild", "Sehr heiß"], richtig: 1, erklaerAr: "في الربيع الجو معتدل وتتفتح الزهور." },
      { frageDe: "Was machen viele Menschen im Sommer?", optionen: ["Sie bauen Schneemänner", "Sie pflanzen Blumen", "Sie fahren ans Meer"], richtig: 2, erklaerAr: "في الصيف يسافر كثيرون إلى البحر." },
      { frageDe: "Wann fällt Schnee?", optionen: ["Im Winter", "Im Herbst", "Im Sommer"], richtig: 0, erklaerAr: "الثلج في الشتاء." },
    ],
  },
  {
    id: "frei-a2-brief",
    stufe: "A2",
    art: "geschichte",
    titelDe: "Ein Brief aus Hamburg",
    titelAr: "رسالة من هامبورغ",
    absaetze: [
      "Vor einem Jahr ist Omar nach Hamburg gezogen. Am Anfang war alles neu und ein bisschen schwer: die Sprache, das Wetter und die vielen Menschen. Er hatte oft Heimweh und hat seine Familie vermisst.",
      "Aber langsam hat er Freunde gefunden. Jetzt spielt er jeden Samstag Fußball im Park und arbeitet in einem kleinen Café. Gestern hat er einen Brief an seine Familie geschrieben: „Mir geht es gut. Hamburg ist jetzt mein zweites Zuhause.“",
    ],
    fragen: [
      { frageDe: "Warum war der Anfang für Omar schwer?", optionen: ["Er hatte keine Wohnung", "Sprache, Wetter und die vielen Menschen waren neu", "Er hatte keine Arbeit"], richtig: 1, erklaerAr: "اللغة والطقس وكثرة الناس — كل شيء كان جديدًا." },
      { frageDe: "Was macht Omar jetzt jeden Samstag?", optionen: ["Er schreibt Briefe", "Er besucht seine Familie", "Er spielt Fußball im Park"], richtig: 2, erklaerAr: "يلعب كرة القدم في الحديقة كل سبت." },
      { frageDe: "Was steht in seinem Brief?", optionen: ["Es geht ihm gut, Hamburg ist sein zweites Zuhause", "Er will zurückfahren", "Er sucht eine neue Wohnung"], richtig: 0, erklaerAr: "كتب أنه بخير وأن هامبورغ صارت بيته الثاني." },
    ],
  },
  {
    id: "frei-a2-umzug",
    stufe: "A2",
    art: "alltag",
    titelDe: "Der Umzug",
    titelAr: "الانتقال إلى بيت جديد",
    absaetze: [
      "Familie Braun zieht am Wochenende um. Die neue Wohnung ist größer und hat einen Balkon. Am Freitag packen alle Kartons ein: Bücher, Kleidung und Geschirr. Die Kinder helfen auch mit und sind sehr aufgeregt.",
      "Am Samstag kommt ein großer Wagen. Zwei Freunde helfen beim Tragen der Möbel. Am Abend ist alles in der neuen Wohnung. Die Familie ist müde, aber glücklich. Sie essen Pizza auf dem Boden und lachen zusammen.",
    ],
    fragen: [
      { frageDe: "Warum zieht die Familie um?", optionen: ["Die alte Wohnung war zu laut", "Die neue Wohnung ist größer und hat einen Balkon", "Der Vater hat eine neue Arbeit"], richtig: 1, erklaerAr: "الشقة الجديدة أكبر ولها شرفة." },
      { frageDe: "Wer hilft beim Tragen der Möbel?", optionen: ["Zwei Freunde", "Die Nachbarn", "Eine Firma allein"], richtig: 0, erklaerAr: "صديقان يساعدان في حمل الأثاث." },
      { frageDe: "Was macht die Familie am Abend?", optionen: ["Sie geht ins Restaurant", "Sie schläft sofort", "Sie isst Pizza auf dem Boden"], richtig: 2, erklaerAr: "يأكلون البيتزا على الأرض وهم متعبون وسعداء." },
    ],
  },
  {
    id: "frei-a2-gesund",
    stufe: "A2",
    art: "wissen",
    titelDe: "Gesund leben",
    titelAr: "العيش بصحة",
    absaetze: [
      "Gesund leben ist nicht schwer. Man sollte jeden Tag Obst und Gemüse essen und viel Wasser trinken. Zucker und fettiges Essen sollte man nur selten essen. Auch Bewegung ist wichtig: Man kann spazieren gehen, Rad fahren oder Sport machen.",
      "Genauso wichtig ist Schlaf. Erwachsene brauchen sieben bis acht Stunden Schlaf pro Nacht. Wer gut schläft und sich bewegt, hat mehr Energie und fühlt sich besser. Kleine Schritte jeden Tag sind besser als große Pläne ohne Taten.",
    ],
    fragen: [
      { frageDe: "Was sollte man jeden Tag essen?", optionen: ["Obst und Gemüse", "Kuchen und Pommes", "Nur Brot"], richtig: 0, erklaerAr: "خضار وفاكهة كل يوم." },
      { frageDe: "Wie lange sollten Erwachsene schlafen?", optionen: ["Vier bis fünf Stunden", "Sieben bis acht Stunden", "Zehn bis zwölf Stunden"], richtig: 1, erklaerAr: "من سبع إلى ثماني ساعات كل ليلة." },
      { frageDe: "Was ist laut Text besser?", optionen: ["Große Pläne ohne Taten", "Gar keine Bewegung", "Kleine Schritte jeden Tag"], richtig: 2, erklaerAr: "خطوات صغيرة يومية أفضل من خطط كبيرة بلا فعل." },
    ],
  },
  {
    id: "frei-b1-homeoffice",
    stufe: "B1",
    art: "wissen",
    titelDe: "Homeoffice: gut oder schlecht?",
    titelAr: "العمل من البيت: جيّد أم سيّئ؟",
    absaetze: [
      "Seit einigen Jahren arbeiten viele Menschen von zu Hause. Das hat klare Vorteile: Man spart Zeit und Geld für den Weg zur Arbeit. Außerdem kann man seine Arbeitszeit oft flexibler planen und mehr Zeit mit der Familie verbringen.",
      "Aber es gibt auch Nachteile. Zu Hause fehlen die Kollegen, und manche Menschen fühlen sich einsam. Es ist auch nicht immer leicht, Arbeit und Freizeit zu trennen. Experten sagen deshalb: Eine Mischung aus Büro und Homeoffice ist für viele die beste Lösung.",
      "Auch der Körper spielt eine Rolle. Wer zu Hause arbeitet, sitzt oft noch länger als im Büro und bewegt sich weniger. Ärzte raten deshalb zu festen Pausen: Jede Stunde kurz aufstehen, mittags eine Runde spazieren gehen und am Abend den Laptop wirklich zuklappen. So bleibt der Kopf frisch und der Rücken gesund. Viele Firmen geben ihren Mitarbeitern deshalb Tipps für gesundes Arbeiten zu Hause.",
    ],
    fragen: [
      { frageDe: "Welcher Vorteil wird NICHT genannt?", optionen: ["Man spart Zeit und Geld", "Man bekommt mehr Gehalt", "Man kann die Zeit flexibler planen"], richtig: 1, erklaerAr: "النص لا يذكر راتبًا أعلى — يذكر توفير الوقت والمال والمرونة." },
      { frageDe: "Warum fühlen sich manche Menschen zu Hause schlecht?", optionen: ["Die Wohnung ist zu klein", "Der Computer ist alt", "Die Kollegen fehlen"], richtig: 2, erklaerAr: "يفتقدون الزملاء ويشعر بعضهم بالوحدة." },
      { frageDe: "Was empfehlen Experten?", optionen: ["Eine Mischung aus Büro und Homeoffice", "Nur noch Homeoffice", "Nur noch Büro"], richtig: 0, erklaerAr: "المزج بين المكتب والبيت هو الحل الأفضل لكثيرين." },
      { frageDe: "Welche Haltung hat der Autor zum Homeoffice?", optionen: ["Er ist komplett dagegen", "Er sieht Vorteile und Nachteile und findet eine Mischung gut", "Er will, dass alle nur noch zu Hause arbeiten"], richtig: 1, erklaerAr: "موقف متوازن: يرى الحسنات والسيئات ويرجّح المزج." },
    ],
    mediation: {
      aufgabeAr: "صديقك لا يقرأ الألمانية ويسألك عن رأي الكاتب في العمل من البيت. لخّص له الفكرة بالعربية في 2–3 جمل.",
      punkteAr: [
        "للعمل من البيت فوائد حقيقية: توفير الوقت والمال ومرونة أكبر في الجدول.",
        "وله عيوب: الشعور بالوحدة وصعوبة الفصل بين العمل والراحة.",
        "نصيحة الخبراء: المزج بين المكتب والبيت، مع فترات راحة منتظمة والعناية بالجسم.",
      ],
    },
  },
  {
    id: "frei-b1-stadt-dorf",
    stufe: "B1",
    art: "alltag",
    titelDe: "Stadt oder Dorf?",
    titelAr: "المدينة أم القرية؟",
    absaetze: [
      "Wo lebt man besser: in der Stadt oder auf dem Dorf? In der Stadt gibt es viele Geschäfte, Kinos und Restaurants. Die Wege sind kurz, und man braucht oft kein Auto. Aber die Wohnungen sind teuer und klein, und es ist fast immer laut.",
      "Auf dem Dorf ist es ruhig und die Luft ist sauber. Die Menschen kennen ihre Nachbarn und helfen einander. Dafür gibt es weniger Arbeit und weniger Freizeitangebote. Am Ende hängt die Entscheidung vom Menschen ab: Wer Ruhe sucht, wählt das Dorf. Wer Abwechslung liebt, bleibt in der Stadt.",
      "Viele Menschen wechseln im Leben sogar mehrmals: Junge Leute ziehen für Ausbildung oder Studium in die Stadt, weil es dort mehr Chancen gibt. Später, mit Kindern, wünschen sich viele ein Haus mit Garten und ziehen zurück aufs Land. Die Frage ist also nicht nur «Stadt oder Dorf?», sondern auch «Was brauche ich in dieser Phase meines Lebens?»",
    ],
    fragen: [
      { frageDe: "Was ist ein Nachteil der Stadt?", optionen: ["Es gibt keine Geschäfte", "Wohnungen sind teuer und klein", "Die Wege sind zu lang"], richtig: 1, erklaerAr: "الشقق غالية وصغيرة والضجيج دائم تقريبًا." },
      { frageDe: "Was ist ein Vorteil des Dorfes?", optionen: ["Viele Kinos", "Kurze Wege zur Arbeit", "Ruhe und saubere Luft"], richtig: 2, erklaerAr: "الهدوء والهواء النقي ومعرفة الجيران." },
      { frageDe: "Wovon hängt die Entscheidung laut Text ab?", optionen: ["Vom Menschen selbst", "Vom Wetter", "Vom Gehalt allein"], richtig: 0, erklaerAr: "القرار يعتمد على الإنسان: من يبحث عن الهدوء يختار القرية." },
      { frageDe: "Was ist die wichtigste Aussage des Textes?", optionen: ["Die Stadt ist immer besser", "Das Dorf ist immer besser", "Es gibt keine beste Antwort für alle — es hängt vom Menschen und seiner Lebensphase ab"], richtig: 2, erklaerAr: "النص يختم بأن القرار يعتمد على الإنسان ومرحلة حياته." },
    ],
    mediation: {
      aufgabeAr: "اشرح لصديق لا يقرأ الألمانية خلاصة هذا النص في 2–3 جمل بالعربية.",
      punkteAr: [
        "المدينة: خدمات ومرافق كثيرة، لكن الشقق غالية وصغيرة والضجيج شبه دائم.",
        "القرية: هدوء وهواء نظيف وجيران متعاونون، لكن فرص عمل وترفيه أقل.",
        "لا إجابة واحدة صحيحة للجميع — القرار يعتمد على الشخص ومرحلة حياته.",
      ],
    },
  },
  {
    id: "frei-b1-schluessel",
    stufe: "B1",
    art: "geschichte",
    titelDe: "Der verlorene Schlüssel",
    titelAr: "المفتاح الضائع",
    absaetze: [
      "Es war spät am Abend, als Jonas nach Hause kam. Er suchte in seiner Tasche nach dem Schlüssel, aber er fand ihn nicht. Sein Handy war fast leer, und es begann zu regnen. Jonas wurde nervös: Alle Nachbarn waren schon im Bett, und er wollte niemanden wecken.",
      "Plötzlich hörte er eine Stimme: „Suchst du etwas?“ Es war Frau Sommer, die alte Nachbarin. Sie hatte seinen Schlüssel am Nachmittag vor dem Haus gefunden und aufgehoben. Jonas war so erleichtert, dass er lachen musste. Am nächsten Tag brachte er ihr einen Blumenstrauß und dankte ihr herzlich.",
      "Seit diesem Abend hat Frau Sommer einen Ersatzschlüssel für Jonas' Wohnung, und er hat einen von ihrer Wohnung. «So sind wir beide sicher», sagt sie. Jonas hat gelernt: Gute Nachbarn sind wie eine zweite Familie — man muss sie nur kennen und ihnen vertrauen. Heute grüßt er sie jeden Morgen mit einem Lächeln im Treppenhaus.",
    ],
    fragen: [
      { frageDe: "Warum war Jonas nervös?", optionen: ["Er hatte seinen Schlüssel verloren und wollte niemanden wecken", "Er hatte Angst vor dem Regen allein", "Er war zu spät zur Arbeit"], richtig: 0, erklaerAr: "فقد المفتاح وكان هاتفه يفرغ والمطر بدأ — ولم يرد إيقاظ أحد." },
      { frageDe: "Wer hatte den Schlüssel gefunden?", optionen: ["Ein Kind", "Frau Sommer, die Nachbarin", "Der Hausmeister"], richtig: 1, erklaerAr: "الجارة العجوز السيدة زومر وجدته بعد الظهر واحتفظت به." },
      { frageDe: "Wie dankte Jonas ihr?", optionen: ["Er lud sie zum Essen ein", "Er gab ihr Geld", "Er brachte ihr einen Blumenstrauß"], richtig: 2, erklaerAr: "أحضر لها باقة زهور في اليوم التالي." },
      { frageDe: "Was hat Jonas aus diesem Abend gelernt?", optionen: ["Man soll immer zwei Handys haben", "Gute Nachbarn sind sehr wertvoll", "Man soll nie spät nach Hause kommen"], richtig: 1, erklaerAr: "تعلّم أن الجيران الطيبين مثل عائلة ثانية." },
    ],
    mediation: {
      aufgabeAr: "احكِ هذه القصة بإيجاز بالعربية لصديق لا يفهم الألمانية (2–3 جمل).",
      punkteAr: [
        "يوناس فقد مفتاحه ليلاً تحت المطر ولم يرد إيقاظ جيرانه.",
        "جارته العجوز السيدة زومر كانت قد وجدته واحتفظت به له.",
        "شكرها بباقة ورد، وتبادلا مفتاحين احتياطيين وأصبحا صديقين.",
      ],
    },
  },
  {
    id: "frei-b2-ki",
    stufe: "B2",
    art: "wissen",
    titelDe: "Künstliche Intelligenz im Alltag",
    titelAr: "الذكاء الاصطناعي في الحياة اليومية",
    absaetze: [
      "Künstliche Intelligenz ist längst kein Thema mehr nur für Experten. Sie steckt in unseren Handys, hilft beim Übersetzen, schlägt Musik vor und beantwortet Fragen in wenigen Sekunden. Viele Menschen nutzen sie täglich, oft ohne es zu bemerken. Befürworter betonen, dass KI uns langweilige Aufgaben abnimmt und uns mehr Zeit für kreative und menschliche Tätigkeiten lässt.",
      "Kritiker warnen dagegen vor den Risiken. Sie fragen: Was passiert mit unseren Daten? Können Maschinen Fehler machen, die niemand bemerkt? Und was geschieht mit Berufen, die durch KI ersetzt werden könnten? Diese Sorgen sind berechtigt, denn neue Technik verändert die Gesellschaft immer schneller, als Gesetze darauf reagieren können.",
      "Entscheidend ist deshalb ein bewusster Umgang. KI sollte ein Werkzeug bleiben, das den Menschen unterstützt, und keine Autorität, der man blind vertraut. Wer ihre Antworten prüft, ihre Grenzen kennt und Verantwortung übernimmt, kann von ihr profitieren, ohne die Kontrolle zu verlieren.",
      "Besonders sichtbar wird der Wandel in der Schule und an der Universität. Schüler lassen sich von der KI Texte erklären, und manche schreiben ihre Hausaufgaben fast vollständig mit ihr. Lehrer müssen deshalb neue Aufgaben stellen, bei denen eigenes Denken zählt. Auch im Beruf verändert sich viel: Im Büro schreibt die KI erste Entwürfe für E-Mails und Berichte, und in der Medizin hilft sie Ärzten, Bilder schneller auszuwerten. Die Entscheidung trifft aber weiterhin der Mensch — und genau das muss so bleiben, sagen viele Fachleute.",
    ],
    fragen: [
      { frageDe: "Was betonen die Befürworter der KI?", optionen: ["Sie macht alle Berufe überflüssig", "Sie nimmt uns langweilige Aufgaben ab", "Sie ist fehlerfrei"], richtig: 1, erklaerAr: "المؤيدون يقولون إنها تريحنا من المهام المملة وتترك وقتًا للإبداع." },
      { frageDe: "Welche Sorge der Kritiker wird genannt?", optionen: ["KI ist zu langsam", "KI ist zu teuer für alle", "Umgang mit Daten und ersetzte Berufe"], richtig: 2, erklaerAr: "المخاوف: بياناتنا، أخطاء لا يلاحظها أحد، ووظائف قد تُستبدل." },
      { frageDe: "Was empfiehlt der Text am Ende?", optionen: ["KI vollständig verbieten", "KI bewusst als Werkzeug nutzen und Antworten prüfen", "Nur Experten dürfen KI nutzen"], richtig: 1, erklaerAr: "التعامل الواعي: أداة مساعدة لا سلطة نثق بها عمياءً، مع فحص الأجوبة." },
      { frageDe: "Wie ist die Grundhaltung des Textes zur KI?", optionen: ["Begeistert ohne Kritik", "Positiv, aber vorsichtig: ein Werkzeug, keine Autorität", "Ablehnend: KI sollte verboten werden"], richtig: 1, erklaerAr: "النبرة إيجابية بحذر: أداة نافعة لا سلطة نثق بها عمياءً." },
    ],
    mediation: {
      aufgabeAr: "لخّص موقف الكاتب من الذكاء الاصطناعي بالعربية في 3 جمل، لشخص لا يقرأ الألمانية.",
      punkteAr: [
        "يرى الكاتب فوائد (توفير الوقت) ومخاطر (البيانات والوظائف) معًا.",
        "يدعو إلى استخدام واعٍ: أداة مساعدة لا سلطة نثق بها عمياءً، مع فحص إجاباتها.",
        "يذكر أثرها في المدرسة والعمل والطب، لكن القرار النهائي يبقى للإنسان.",
      ],
    },
    ueberschriften: {
      optionen: [
        "الذكاء الاصطناعي بين أيدينا يوميًا",
        "مخاوف مشروعة من المخاطر",
        "أداة تخدم الإنسان لا سلطة فوقه",
        "من المدرسة إلى غرفة الطبيب: القرار يبقى بشريًا",
        "حظر الذكاء الاصطناعي بالكامل",
        "الذكاء الاصطناعي سيحلّ محلّ كل عمل بشري قريبًا",
      ],
      richtig: [0, 1, 2, 3],
    },
  },
  {
    id: "frei-b2-wohnen",
    stufe: "B2",
    art: "wissen",
    titelDe: "Wohnen in der Stadt wird immer teurer",
    titelAr: "السكن في المدينة يزداد غلاءً",
    absaetze: [
      "In vielen deutschen Großstädten steigen die Mieten seit Jahren. Besonders junge Menschen, Studierende und Familien mit kleinem Einkommen finden kaum noch bezahlbare Wohnungen. Oft gehen mehr als ein Drittel des Gehalts allein für die Miete drauf. Die Ursachen sind vielfältig: Es werden zu wenige neue Wohnungen gebaut, gleichzeitig ziehen immer mehr Menschen in die Städte, weil es dort Arbeit und Universitäten gibt.",
      "Die Folgen sind im Alltag spürbar. Manche Menschen fahren jeden Tag lange Strecken vom Umland in die Stadt. Andere teilen sich kleine Wohnungen oder bleiben länger bei den Eltern wohnen. Auch für die Städte selbst ist das ein Problem: Wenn Pflegekräfte, Erzieherinnen und Busfahrer sich das Leben in der Stadt nicht mehr leisten können, fehlt wichtiges Personal.",
      "Als Lösungen werden mehr Neubauten, schnellere Genehmigungen und Regeln gegen extreme Mietsteigerungen diskutiert. Einig sind sich die meisten Experten nur in einem Punkt: Ohne mehr Wohnraum wird sich die Lage nicht entspannen.",
      "Die Politik diskutiert seit Jahren über Auswege. Einige Städte bauen wieder mehr Sozialwohnungen, andere begrenzen mit einer Mietpreisbremse, wie stark Mieten bei einem neuen Vertrag steigen dürfen. Doch Experten warnen: Solche Regeln helfen nur kurz, wenn nicht gleichzeitig viel mehr gebaut wird. Ein weiteres Problem sind die langen Genehmigungen: Oft dauert es Jahre, bis ein Bauprojekt starten darf. Schnellere Verfahren und mehr Bauland gelten deshalb als wichtigste Schritte. Bis es so weit ist, werden viele Menschen weiter einen großen Teil ihres Gehalts für die Miete ausgeben müssen.",
    ],
    fragen: [
      { frageDe: "Warum ziehen viele Menschen in die Städte?", optionen: ["Weil es dort Arbeit und Universitäten gibt", "Weil die Mieten dort billiger sind", "Weil das Wetter besser ist"], richtig: 0, erklaerAr: "لأن العمل والجامعات في المدن، بينما البناء الجديد قليل." },
      { frageDe: "Welche Berufsgruppen werden als Beispiel genannt?", optionen: ["Ärzte und Anwälte", "Pflegekräfte, Erzieherinnen und Busfahrer", "Programmierer und Banker"], richtig: 1, erklaerAr: "النص يذكر طواقم التمريض ومربيات الأطفال وسائقي الحافلات." },
      { frageDe: "Worin sind sich die Experten einig?", optionen: ["Mieten müssen verboten werden", "Alle sollen aufs Land ziehen", "Ohne mehr Wohnraum entspannt sich die Lage nicht"], richtig: 2, erklaerAr: "الاتفاق الوحيد: بلا مساكن أكثر لن يتحسّن الوضع." },
      { frageDe: "Was ist die Hauptaussage des Textes?", optionen: ["Die Mieten sollen vom Staat festgelegt werden", "Ohne deutlich mehr neue Wohnungen wird Wohnen in der Stadt teuer bleiben", "Alle Menschen sollen aufs Land ziehen"], richtig: 1, erklaerAr: "الخلاصة: بلا بناء أكثر بكثير لن تنخفض الأزمة." },
    ],
    mediation: {
      aufgabeAr: "لخّص بالعربية أزمة السكن في المدن الألمانية كما يصفها هذا النص.",
      punkteAr: [
        "الإيجارات ترتفع وتبتلع أكثر من ثلث دخل كثير من الناس.",
        "السبب: بناء قليل مقابل إقبال متزايد على المدن للعمل والدراسة.",
        "الحلول المقترحة: بناء أكثر وإجراءات أسرع وقيود على رفع الإيجار — وبلا بناء كافٍ لن يتحسن الوضع.",
      ],
    },
    ueberschriften: {
      optionen: [
        "الإيجارات ترتفع وتلتهم جزءًا كبيرًا من الدخل",
        "الأزمة تمسّ الأفراد والمدن معًا",
        "حلول مقترحة… واتفاق على نقطة واحدة فقط",
        "بين كبح الإيجار وبطء التراخيص: لا حلّ سريع",
        "أسعار الإيجار في انخفاض مستمر منذ سنوات",
        "الحكومة ألغت جميع القيود على البناء",
      ],
      richtig: [0, 1, 2, 3],
    },
  },
  {
    id: "frei-b2-ehrenamt",
    stufe: "B2",
    art: "wissen",
    titelDe: "Ehrenamt: Zeit schenken",
    titelAr: "العمل التطوعي: أن تهب وقتك",
    absaetze: [
      "Millionen Menschen in Deutschland engagieren sich ehrenamtlich, also freiwillig und ohne Bezahlung. Sie trainieren Kinder im Sportverein, helfen bei der Feuerwehr, begleiten ältere Menschen oder geben Nachhilfe. Ohne dieses Engagement würden viele Angebote gar nicht existieren, weil der Staat sie allein nicht finanzieren könnte.",
      "Wer sich ehrenamtlich engagiert, gibt Zeit, bekommt aber auch viel zurück: neue Kontakte, praktische Erfahrungen und das Gefühl, gebraucht zu werden. Gerade für Menschen, die neu in einer Stadt oder in einem Land sind, kann ein Ehrenamt der schnellste Weg sein, Menschen kennenzulernen und die Sprache im echten Leben zu üben.",
      "Natürlich braucht freiwillige Arbeit auch gute Bedingungen: Anerkennung, klare Aufgaben und manchmal eine kleine Aufwandsentschädigung. Denn Engagement soll Freude machen und nicht zur Belastung werden. Wer regelmäßig ein paar Stunden schenkt, stärkt nicht nur andere, sondern die ganze Gesellschaft.",
      "Die Orte, an denen Freiwillige arbeiten, sind überall: bei der Tafel, die Lebensmittel an arme Menschen verteilt, im Sprachcafé, wo Ehrenamtliche mit Geflüchteten Deutsch üben, oder im Krankenhaus, wo sie Patienten besuchen und ihnen vorlesen. Eine von ihnen ist die 68-jährige Frau Berg. Seit ihrer Rente hilft sie zweimal pro Woche im Sprachcafé. «Ich schenke Zeit», sagt sie, «aber ich bekomme Freundschaft und das Gefühl zurück, noch gebraucht zu werden.» Für viele Freiwillige ist das Ehrenamt auch ein Weg, nach der Rente aktiv und mit anderen Menschen verbunden zu bleiben.",
    ],
    fragen: [
      { frageDe: "Was bedeutet „ehrenamtlich“?", optionen: ["Freiwillig und ohne Bezahlung", "Nur für Rentner", "Vom Staat bezahlt"], richtig: 0, erklaerAr: "تطوعي وبلا أجر — كما يشرح النص نفسه." },
      { frageDe: "Warum ist ein Ehrenamt für neue Menschen in einer Stadt besonders wertvoll?", optionen: ["Man bekommt sofort eine Wohnung", "Man lernt Menschen kennen und übt die Sprache im echten Leben", "Man muss keine Steuern zahlen"], richtig: 1, erklaerAr: "علاقات جديدة وخبرة — وممارسة اللغة في الحياة الحقيقية." },
      { frageDe: "Was braucht freiwillige Arbeit laut Text?", optionen: ["Nur mehr Geld vom Staat", "Weniger Aufgaben", "Anerkennung und klare Aufgaben"], richtig: 2, erklaerAr: "تقدير ومهام واضحة وأحيانًا تعويض صغير عن المصاريف." },
      { frageDe: "Warum ist das Ehrenamt laut Text für die ganze Gesellschaft wichtig?", optionen: ["Weil der Staat dadurch Steuern spart und sonst nichts", "Weil viele Angebote ohne Freiwillige gar nicht existieren würden", "Weil Ehrenamtliche bezahlte Arbeiter ersetzen sollen"], richtig: 1, erklaerAr: "لأن عروضًا كثيرة (طعام المحتاجين، مقاهي اللغة) ما كانت لتوجد بلا متطوعين." },
    ],
    mediation: {
      aufgabeAr: "اشرح لصديق لا يقرأ الألمانية ما هو العمل التطوعي في هذا النص وما فائدته.",
      punkteAr: [
        "ملايين يتطوعون بلا أجر في الرياضة والإسعاف ورعاية المسنين وغيرها.",
        "المتطوع يكسب علاقات وخبرة وشعورًا بالقيمة، خصوصًا القادمون الجدد الذين يتعلمون اللغة.",
        "يحتاج العمل التطوعي تقديرًا ومهامًا واضحة حتى يبقى ممتعًا لا عبئًا.",
      ],
    },
    ueberschriften: {
      optionen: [
        "ملايين يتطوّعون بلا مقابل في مجالات متعددة",
        "ما يكسبه المتطوّع لا يقلّ عمّا يمنحه",
        "التطوّع يحتاج شروطًا جيدة ليستمر بفرح",
        "من مقهى اللغة إلى المستشفى: أمثلة من الواقع",
        "التطوّع إلزاميٌّ بقانون جديد",
        "لا فائدة للمتطوّع نفسه من عمله",
      ],
      richtig: [0, 1, 2, 3],
    },
  },
];

export const FREIE_DIALOGE: FreierDialog[] = [
  {
    id: "frei-a0-cafe",
    stufe: "A0",
    titelDe: "Im Café",
    titelAr: "في المقهى",
    zeilen: [
      { wer: "Kellnerin", de: "Guten Tag! Was möchten Sie?", ar: "طاب يومك! ماذا تريد؟" },
      { wer: "Gast", de: "Einen Kaffee, bitte.", ar: "قهوة، من فضلك." },
      { wer: "Kellnerin", de: "Möchten Sie auch ein Stück Kuchen?", ar: "هل تريد قطعة كعك أيضًا؟" },
      { wer: "Gast", de: "Ja, gern. Was kostet der Kuchen?", ar: "نعم بكل سرور. كم ثمن الكعك؟" },
      { wer: "Kellnerin", de: "Drei Euro fünfzig. Der Kaffee kostet zwei Euro.", ar: "ثلاثة يورو ونصف. والقهوة بيوروين." },
      { wer: "Gast", de: "Gut, ich nehme beides. Hier sind sechs Euro.", ar: "حسنًا، آخذ الاثنين. تفضّل ستة يورو." },
      { wer: "Kellnerin", de: "Vielen Dank! Fünfzig Cent zurück.", ar: "شكرًا جزيلًا! نصف يورو باقٍ لك." },
      { wer: "Gast", de: "Danke schön. Auf Wiedersehen!", ar: "شكرًا لك. إلى اللقاء!" },
    ],
    fragen: [
      { frageDe: "Was bestellt der Gast?", optionen: ["Nur einen Tee", "Kaffee und Kuchen", "Nur Kuchen"], richtig: 1, erklaerAr: "طلب قهوة وكعكًا." },
      { frageDe: "Wie viel kostet der Kaffee?", optionen: ["Zwei Euro", "Drei Euro fünfzig", "Sechs Euro"], richtig: 0, erklaerAr: "القهوة بيوروين." },
      { frageDe: "Wie viel Geld bekommt der Gast zurück?", optionen: ["Einen Euro", "Gar nichts", "Fünfzig Cent"], richtig: 2, erklaerAr: "دفع ستة والثمن خمسة ونصف — الباقي نصف يورو." },
    ],
  },
  {
    id: "frei-a0-weg",
    stufe: "A0",
    titelDe: "Wo ist der Bahnhof?",
    titelAr: "أين المحطة؟",
    zeilen: [
      { wer: "Frau", de: "Entschuldigung, wo ist der Bahnhof?", ar: "عفوًا، أين محطة القطار؟" },
      { wer: "Mann", de: "Der Bahnhof ist nicht weit. Gehen Sie geradeaus.", ar: "المحطة ليست بعيدة. امضِ مباشرة." },
      { wer: "Frau", de: "Und dann? Links oder rechts?", ar: "وبعدها؟ يسارًا أم يمينًا؟" },
      { wer: "Mann", de: "An der Ampel gehen Sie links. Dort sehen Sie den Bahnhof.", ar: "عند إشارة المرور اتجه يسارًا. هناك ترى المحطة." },
      { wer: "Frau", de: "Wie lange brauche ich zu Fuß?", ar: "كم أحتاج مشيًا؟" },
      { wer: "Mann", de: "Nur fünf Minuten.", ar: "خمس دقائق فقط." },
      { wer: "Frau", de: "Vielen Dank für Ihre Hilfe!", ar: "شكرًا جزيلًا على مساعدتك!" },
      { wer: "Mann", de: "Gern geschehen. Gute Reise!", ar: "بكل سرور. رحلة سعيدة!" },
    ],
    fragen: [
      { frageDe: "Was sucht die Frau?", optionen: ["Den Bahnhof", "Ein Hotel", "Die Post"], richtig: 0, erklaerAr: "تبحث عن محطة القطار." },
      { frageDe: "Wohin geht sie an der Ampel?", optionen: ["Nach rechts", "Zurück", "Nach links"], richtig: 2, erklaerAr: "عند الإشارة تتجه يسارًا." },
      { frageDe: "Wie lange dauert der Weg?", optionen: ["Zehn Minuten", "Fünf Minuten", "Eine halbe Stunde"], richtig: 1, erklaerAr: "خمس دقائق مشيًا فقط." },
    ],
  },
  {
    id: "frei-a1-baecker",
    stufe: "A1",
    titelDe: "Beim Bäcker",
    titelAr: "عند الخبّاز",
    zeilen: [
      { wer: "Verkäuferin", de: "Guten Morgen! Was darf es sein?", ar: "صباح الخير! ما طلبك؟" },
      { wer: "Kunde", de: "Ich möchte fünf Brötchen und ein Croissant.", ar: "أريد خمسة أرغفة صغيرة وكرواسون." },
      { wer: "Verkäuferin", de: "Gern. Darf es noch etwas sein?", ar: "بكل سرور. شيء آخر؟" },
      { wer: "Kunde", de: "Ja, ein Stück Apfelkuchen, bitte. Was macht das zusammen?", ar: "نعم، قطعة فطيرة تفاح. كم المجموع؟" },
      { wer: "Verkäuferin", de: "Das sind vier Euro zwanzig. Brauchen Sie eine Tüte?", ar: "المجموع أربعة يورو وعشرون. هل تحتاج كيسًا؟" },
      { wer: "Kunde", de: "Nein danke, ich habe eine Tasche dabei.", ar: "لا شكرًا، معي حقيبة." },
      { wer: "Verkäuferin", de: "Sehr gut. Hier, bitte schön. Einen schönen Tag!", ar: "جيد جدًا. تفضّل. يومك سعيد!" },
      { wer: "Kunde", de: "Danke, Ihnen auch!", ar: "شكرًا، ولك أيضًا!" },
    ],
    fragen: [
      { frageDe: "Wie viele Brötchen kauft der Kunde?", optionen: ["Vier", "Fünf", "Sechs"], richtig: 1, erklaerAr: "خمسة أرغفة صغيرة." },
      { frageDe: "Warum braucht er keine Tüte?", optionen: ["Er hat eine Tasche dabei", "Er wohnt nebenan", "Die Tüte ist zu teuer"], richtig: 0, erklaerAr: "لأنه يحمل حقيبة معه." },
      { frageDe: "Was kostet alles zusammen?", optionen: ["4,20 €", "3,50 €", "5,00 €"], richtig: 0, erklaerAr: "المجموع 4.20 يورو." },
    ],
  },
  {
    id: "frei-a1-arzttermin",
    stufe: "A1",
    titelDe: "Ein Termin beim Arzt",
    titelAr: "موعد عند الطبيب",
    zeilen: [
      { wer: "Arzthelferin", de: "Praxis Dr. Weber, guten Tag.", ar: "عيادة الدكتور فيبر، طاب يومك." },
      { wer: "Patient", de: "Guten Tag, hier ist Herr Yilmaz. Ich brauche einen Termin. Ich habe starke Kopfschmerzen.", ar: "طاب يومك، معك السيد يلماز. أحتاج موعدًا. عندي صداع شديد." },
      { wer: "Arzthelferin", de: "Das tut mir leid. Passt Ihnen morgen um zehn Uhr?", ar: "أتمنى لك الشفاء. هل يناسبك غدًا في العاشرة؟" },
      { wer: "Patient", de: "Ja, das passt gut. Muss ich etwas mitbringen?", ar: "نعم، مناسب جدًا. هل عليّ إحضار شيء؟" },
      { wer: "Arzthelferin", de: "Bitte bringen Sie Ihre Versicherungskarte mit.", ar: "أحضر بطاقة التأمين من فضلك." },
      { wer: "Patient", de: "Und wenn die Schmerzen schlimmer werden?", ar: "وإذا اشتدّ الألم؟" },
      { wer: "Arzthelferin", de: "Dann rufen Sie bitte sofort an oder kommen direkt in die Praxis.", ar: "حينها اتصل فورًا أو تعال مباشرة إلى العيادة." },
      { wer: "Patient", de: "Mache ich. Vielen Dank und auf Wiederhören.", ar: "سأفعل. شكرًا وإلى اللقاء." },
    ],
    fragen: [
      { frageDe: "Warum ruft Herr Yilmaz an?", optionen: ["Er hat Kopfschmerzen und braucht einen Termin", "Er will ein Rezept abholen", "Er sucht Arbeit"], richtig: 0, erklaerAr: "عنده صداع شديد ويحتاج موعدًا." },
      { frageDe: "Wann ist der Termin?", optionen: ["Heute um zehn", "Morgen um zehn", "Morgen um zwölf"], richtig: 1, erklaerAr: "غدًا في العاشرة." },
      { frageDe: "Was soll er mitbringen?", optionen: ["Seinen Ausweis", "Geld", "Seine Versicherungskarte"], richtig: 2, erklaerAr: "بطاقة التأمين الصحي." },
    ],
  },
  {
    id: "frei-a2-hotel",
    stufe: "A2",
    titelDe: "Im Hotel einchecken",
    titelAr: "تسجيل الوصول في الفندق",
    zeilen: [
      { wer: "Rezeptionist", de: "Guten Abend, herzlich willkommen im Hotel Sonne.", ar: "مساء الخير، أهلًا بك في فندق الشمس." },
      { wer: "Gast", de: "Guten Abend. Ich habe ein Zimmer reserviert, auf den Namen Haddad.", ar: "مساء الخير. حجزت غرفة باسم حداد." },
      { wer: "Rezeptionist", de: "Einen Moment bitte … Ja, ein Doppelzimmer für drei Nächte. Darf ich Ihren Ausweis sehen?", ar: "لحظة من فضلك… نعم، غرفة مزدوجة لثلاث ليالٍ. هل أرى هويتك؟" },
      { wer: "Gast", de: "Natürlich, hier bitte. Ist das Frühstück inklusive?", ar: "طبعًا، تفضّل. هل الفطور مشمول؟" },
      { wer: "Rezeptionist", de: "Ja, von sieben bis zehn Uhr im Erdgeschoss. Hier ist Ihre Schlüsselkarte, Zimmer 214.", ar: "نعم، من السابعة إلى العاشرة في الطابق الأرضي. هذه بطاقة المفتاح، غرفة 214." },
      { wer: "Gast", de: "Vielen Dank. Gibt es WLAN im Zimmer?", ar: "شكرًا جزيلًا. هل توجد شبكة لاسلكية في الغرفة؟" },
      { wer: "Rezeptionist", de: "Ja, das Passwort steht auf dem Schreibtisch. Einen schönen Aufenthalt!", ar: "نعم، كلمة السر على المكتب. إقامة سعيدة!" },
    ],
    fragen: [
      { frageDe: "Wie lange bleibt der Gast?", optionen: ["Eine Nacht", "Drei Nächte", "Eine Woche"], richtig: 1, erklaerAr: "حجز ثلاث ليالٍ." },
      { frageDe: "Wann gibt es Frühstück?", optionen: ["Von sechs bis neun", "Von acht bis elf", "Von sieben bis zehn"], richtig: 2, erklaerAr: "الفطور من السابعة إلى العاشرة." },
      { frageDe: "Wo steht das WLAN-Passwort?", optionen: ["Auf dem Schreibtisch", "An der Tür", "Im Bad"], richtig: 0, erklaerAr: "كلمة السر على المكتب في الغرفة." },
    ],
  },
  {
    id: "frei-a2-handy",
    stufe: "A2",
    titelDe: "Ein Handy kaufen",
    titelAr: "شراء هاتف",
    zeilen: [
      { wer: "Verkäufer", de: "Kann ich Ihnen helfen?", ar: "هل أستطيع مساعدتك؟" },
      { wer: "Kundin", de: "Ja, ich suche ein neues Handy. Es sollte nicht zu teuer sein, aber eine gute Kamera haben.", ar: "نعم، أبحث عن هاتف جديد. لا أريده غاليًا جدًا، لكن بكاميرا جيدة." },
      { wer: "Verkäufer", de: "Dann empfehle ich dieses Modell. Es kostet 249 Euro und hat viel Speicher.", ar: "أنصحك بهذا الموديل. يكلف 249 يورو وذاكرته كبيرة." },
      { wer: "Kundin", de: "Kann ich es in Raten zahlen?", ar: "هل أستطيع دفعه بالتقسيط؟" },
      { wer: "Verkäufer", de: "Ja, zwölf Monate ohne Zinsen. Möchten Sie einen Vertrag dazu oder Prepaid?", ar: "نعم، اثنا عشر شهرًا بلا فوائد. تريدين عقدًا أم دفعًا مسبقًا؟" },
      { wer: "Kundin", de: "Prepaid bitte, das ist flexibler für mich.", ar: "دفع مسبق، فهو أكثر مرونة لي." },
      { wer: "Verkäufer", de: "Sehr gern. Ich packe es Ihnen ein. Sie haben zwei Jahre Garantie.", ar: "بكل سرور. سأغلّفه لك. عندك ضمان سنتين." },
      { wer: "Kundin", de: "Perfekt, ich nehme es. Vielen Dank für die Beratung!", ar: "ممتاز، سآخذه. شكرًا على النصيحة!" },
    ],
    fragen: [
      { frageDe: "Was ist der Kundin beim Handy wichtig?", optionen: ["Eine gute Kamera und ein fairer Preis", "Ein sehr großer Bildschirm", "Eine bekannte Marke"], richtig: 0, erklaerAr: "كاميرا جيدة وسعر غير مرتفع." },
      { frageDe: "Wie möchte sie zahlen?", optionen: ["Nur bar", "In Raten über zwölf Monate", "Gar nicht"], richtig: 1, erklaerAr: "بالتقسيط اثني عشر شهرًا بلا فوائد." },
      { frageDe: "Was wählt sie statt eines Vertrags?", optionen: ["Einen zweiten Vertrag", "Nichts", "Prepaid"], richtig: 2, erklaerAr: "الدفع المسبق لأنه أكثر مرونة." },
    ],
  },
  {
    id: "frei-b1-wohnung",
    stufe: "B1",
    titelDe: "Die Wohnung besichtigen",
    titelAr: "معاينة شقة",
    zeilen: [
      { wer: "Vermieterin", de: "Kommen Sie herein. Das ist das Wohnzimmer, daneben die Küche mit Balkon.", ar: "تفضّل بالدخول. هذه غرفة المعيشة، وبجانبها المطبخ مع الشرفة." },
      { wer: "Interessent", de: "Die Wohnung ist sehr hell. Wie hoch sind die Nebenkosten?", ar: "الشقة مضيئة جدًا. كم تكاليف الخدمات الإضافية؟" },
      { wer: "Vermieterin", de: "Etwa 120 Euro im Monat, inklusive Heizung und Wasser.", ar: "حوالي 120 يورو شهريًا، شاملة التدفئة والماء." },
      { wer: "Interessent", de: "Und ab wann könnte ich einziehen?", ar: "ومن متى أستطيع السكن؟" },
      { wer: "Vermieterin", de: "Ab dem ersten März wäre die Wohnung frei. Haustiere sind leider nicht erlaubt.", ar: "من الأول من مارس تكون الشقة فارغة. للأسف الحيوانات الأليفة غير مسموح بها." },
      { wer: "Interessent", de: "Das ist in Ordnung, ich habe keine Haustiere. Ich überlege es mir bis morgen und rufe Sie an.", ar: "لا بأس، ليس لديّ حيوانات. سأفكر حتى الغد وأتصل بك." },
      { wer: "Vermieterin", de: "Gern. Nehmen Sie sich Zeit. Auf Wiedersehen!", ar: "بكل سرور. خذ وقتك. إلى اللقاء!" },
    ],
    fragen: [
      { frageDe: "Was ist im Preis der Nebenkosten enthalten?", optionen: ["Nur Wasser", "Heizung und Wasser", "Strom und Internet"], richtig: 1, erklaerAr: "التدفئة والماء داخل 120 يورو." },
      { frageDe: "Ab wann ist die Wohnung frei?", optionen: ["Ab dem ersten März", "Sofort", "Ab April"], richtig: 0, erklaerAr: "من الأول من مارس." },
      { frageDe: "Was ist in der Wohnung verboten?", optionen: ["Rauchen auf dem Balkon", "Musik am Abend", "Haustiere"], richtig: 2, erklaerAr: "الحيوانات الأليفة غير مسموح بها." },
    ],
    mediation: {
      aufgabeAr: "صديقك يبحث عن شقة في ألمانيا ولا يفهم الألمانية — لخّص له أهم ما جاء في هذا الحوار.",
      punkteAr: [
        "تكاليف الخدمات الإضافية حوالي 120 يورو شهريًا، وتشمل التدفئة والماء.",
        "الشقة تصبح فارغة من أول مارس، ولا يُسمح فيها بالحيوانات الأليفة.",
        "المستأجر المحتمل سيفكر حتى الغد ثم يتصل بالمالكة بقراره.",
      ],
    },
  },
  {
    id: "frei-b1-reklamation",
    stufe: "B1",
    titelDe: "Reklamation im Schuhgeschäft",
    titelAr: "شكوى في متجر أحذية",
    zeilen: [
      { wer: "Kundin", de: "Entschuldigung, ich habe diese Schuhe vor zwei Wochen hier gekauft. Jetzt ist die Sohle kaputt.", ar: "عفوًا، اشتريت هذه الأحذية هنا قبل أسبوعين. الآن النعل مكسور." },
      { wer: "Verkäufer", de: "Das tut mir leid. Haben Sie den Kassenbon dabei?", ar: "آسف لذلك. هل معك إيصال الدفع؟" },
      { wer: "Kundin", de: "Ja, hier ist er. Ich hätte gern ein neues Paar oder mein Geld zurück.", ar: "نعم، تفضّله. أريد زوجًا جديدًا أو استرداد مالي." },
      { wer: "Verkäufer", de: "Wir können die Schuhe umtauschen. Ihre Größe haben wir noch da.", ar: "يمكننا استبدال الأحذية. مقاسك ما زال موجودًا." },
      { wer: "Kundin", de: "Gut, dann nehme ich das neue Paar. Kann ich es kurz anprobieren?", ar: "جيد، سآخذ الزوج الجديد. هل أجرّبه بسرعة؟" },
      { wer: "Verkäufer", de: "Natürlich, setzen Sie sich bitte. Passt es so?", ar: "طبعًا، تفضّلي بالجلوس. هل المقاس مناسب هكذا؟" },
      { wer: "Kundin", de: "Ja, perfekt. Vielen Dank für Ihre Hilfe.", ar: "نعم، ممتاز. شكرًا على مساعدتك." },
    ],
    fragen: [
      { frageDe: "Was ist das Problem mit den Schuhen?", optionen: ["Die Farbe gefällt ihr nicht", "Die Sohle ist kaputt", "Sie sind zu klein"], richtig: 1, erklaerAr: "النعل مكسور بعد أسبوعين فقط." },
      { frageDe: "Was zeigt die Kundin dem Verkäufer?", optionen: ["Ihren Ausweis", "Den Kassenbon", "Ein Foto"], richtig: 0, erklaerAr: "إيصال الدفع." },
      { frageDe: "Wie endet das Gespräch?", optionen: ["Sie bekommt ihr Geld zurück", "Sie geht ohne Lösung", "Sie tauscht die Schuhe um"], richtig: 2, erklaerAr: "استبدلت الأحذية بزوج جديد." },
    ],
    mediation: {
      aufgabeAr: "لخّص بالعربية كيف حلّت الزبونة مشكلة حذائها في المتجر.",
      punkteAr: [
        "نعل الحذاء تكسّر بعد أسبوعين فقط من الشراء.",
        "أحضرت إيصال الدفع وطلبت زوجًا جديدًا أو استرداد المال.",
        "البائع استبدل لها الحذاء بنفس المقاس، وانتهى الأمر برضاها.",
      ],
    },
  },
  {
    id: "frei-b2-mietvertrag",
    stufe: "B2",
    titelDe: "Fragen zum Mietvertrag",
    titelAr: "أسئلة حول عقد الإيجار",
    zeilen: [
      { wer: "Mieterin", de: "Bevor ich unterschreibe, hätte ich noch ein paar Fragen zum Vertrag. Wie hoch ist die Kaution genau?", ar: "قبل أن أوقّع، عندي أسئلة عن العقد. كم التأمين بالضبط؟" },
      { wer: "Vermieter", de: "Die Kaution beträgt drei Monatskaltmieten. Sie können sie gern in drei Raten zahlen.", ar: "التأمين ثلاثة أشهر من الإيجار الأساسي. يمكنك دفعه على ثلاث دفعات." },
      { wer: "Mieterin", de: "Das hilft mir sehr. Und wie lang ist die Kündigungsfrist?", ar: "هذا يساعدني كثيرًا. وكم مهلة الإنهاء؟" },
      { wer: "Vermieter", de: "Drei Monate zum Monatsende, wie es gesetzlich üblich ist.", ar: "ثلاثة أشهر لنهاية الشهر، كما هو معتاد قانونًا." },
      { wer: "Mieterin", de: "Muss ich die Wohnung beim Auszug renovieren?", ar: "هل عليّ ترميم الشقة عند المغادرة؟" },
      { wer: "Vermieter", de: "Nur die üblichen Schönheitsreparaturen, also Wände streichen, wenn nötig. Das steht in Paragraph acht.", ar: "فقط الترميمات التجميلية المعتادة، أي طلاء الجدران عند الحاجة. هذا في الفقرة الثامنة." },
      { wer: "Mieterin", de: "Verstanden. Eine letzte Frage: Ist ein Stellplatz für mein Fahrrad im Hof möglich?", ar: "فهمت. سؤال أخير: هل يمكن مكان لدراجتي في الفناء؟" },
      { wer: "Vermieter", de: "Ja, im Keller gibt es einen Fahrradraum. Ich zeige ihn Ihnen gleich.", ar: "نعم، في القبو غرفة للدراجات. سأريك إياها الآن." },
      { wer: "Mieterin", de: "Wunderbar, dann unterschreibe ich gern.", ar: "رائع، إذن أوقّع بسرور." },
    ],
    fragen: [
      { frageDe: "Wie kann die Kaution gezahlt werden?", optionen: ["Nur auf einmal", "In drei Raten", "Erst beim Auszug"], richtig: 1, erklaerAr: "المؤجّر عرض دفعها على ثلاث دفعات." },
      { frageDe: "Was muss die Mieterin beim Auszug machen?", optionen: ["Die Wohnung komplett sanieren", "Nur übliche Schönheitsreparaturen wie Wände streichen", "Gar nichts"], richtig: 1, erklaerAr: "ترميمات تجميلية معتادة فقط، بحسب الفقرة الثامنة." },
      { frageDe: "Wo kann sie ihr Fahrrad abstellen?", optionen: ["Im Treppenhaus", "Im Fahrradraum im Keller", "Nur auf der Straße"], richtig: 1, erklaerAr: "في غرفة الدراجات في القبو." },
    ],
    mediation: {
      aufgabeAr: "صديقك سيوقّع عقد إيجار في ألمانيا قريبًا — لخّص له أهم الشروط من هذا الحوار.",
      punkteAr: [
        "التأمين (Kaution) يعادل ثلاثة أشهر إيجار، ويمكن دفعه على ثلاث دفعات.",
        "مهلة إنهاء العقد ثلاثة أشهر قبل نهاية الشهر، وهذا معتاد قانونًا.",
        "لا تُطلب منها إلا ترميمات تجميلية بسيطة عند المغادرة، ويوجد مكان لدراجتها في القبو.",
      ],
    },
  },
  {
    id: "frei-b2-diskussion",
    stufe: "B2",
    titelDe: "Diskussion: Homeoffice für alle?",
    titelAr: "مناقشة: العمل من البيت للجميع؟",
    zeilen: [
      { wer: "Kollegin", de: "Ich finde, wir sollten alle von zu Hause arbeiten dürfen. Der Weg ins Büro kostet mich jeden Tag eine Stunde.", ar: "أرى أن يُسمح لنا جميعًا بالعمل من البيت. الطريق إلى المكتب يكلفني ساعة كل يوم." },
      { wer: "Kollege", de: "Das stimmt, aber im Büro besprechen wir viele Dinge schneller. Kurze Fragen klärt man am besten persönlich.", ar: "صحيح، لكن في المكتب نناقش أمورًا كثيرة أسرع. الأسئلة القصيرة تُحلّ شخصيًا أفضل." },
      { wer: "Kollegin", de: "Dafür gibt es doch Videotelefonie. Und ehrlich: Zu Hause kann ich mich viel besser konzentrieren als im lauten Großraumbüro.", ar: "لهذا توجد مكالمات الفيديو. وبصراحة: في البيت أركّز أفضل بكثير من المكتب الكبير الصاخب." },
      { wer: "Kollege", de: "Bei der Konzentration gebe ich dir recht. Aber neue Kollegen lernen das Team zu Hause kaum kennen. Das finde ich schade.", ar: "في التركيز أنت محقّة. لكن الزملاء الجدد لا يعرفون الفريق من البيت تقريبًا. هذا مؤسف برأيي." },
      { wer: "Kollegin", de: "Ein guter Punkt. Wie wäre es mit einem Kompromiss: drei Tage Homeoffice und zwei Tage Büro für alle?", ar: "نقطة جيدة. ما رأيك في حلّ وسط: ثلاثة أيام من البيت ويومان في المكتب للجميع؟" },
      { wer: "Kollege", de: "Damit könnte ich gut leben. So bleibt der persönliche Austausch, und wir sparen trotzdem Zeit.", ar: "أستطيع العيش مع هذا جيدًا. هكذا يبقى التواصل الشخصي ونوفر الوقت أيضًا." },
      { wer: "Kollegin", de: "Dann schlagen wir das morgen in der Besprechung so vor.", ar: "إذن نقترح هذا غدًا في الاجتماع." },
    ],
    fragen: [
      { frageDe: "Welches Argument nennt die Kollegin für das Homeoffice?", optionen: ["Sie spart jeden Tag eine Stunde Weg und kann sich besser konzentrieren", "Sie mag ihre Kollegen nicht", "Das Büro ist zu klein"], richtig: 0, erklaerAr: "توفر ساعة طريق يوميًا وتركيزها أفضل من المكتب الصاخب." },
      { frageDe: "Was befürchtet der Kollege?", optionen: ["Die Technik funktioniert nicht", "Neue Kollegen lernen das Team kaum kennen", "Der Chef ist dagegen"], richtig: 1, erklaerAr: "يقلق أن الزملاء الجدد لن يعرفوا الفريق من البيت." },
      { frageDe: "Auf welchen Kompromiss einigen sie sich?", optionen: ["Alle bleiben im Büro", "Nur noch Homeoffice", "Drei Tage Homeoffice und zwei Tage Büro"], richtig: 2, erklaerAr: "حلّ وسط: 3 أيام بيت + يومان مكتب، ويقترحانه في الاجتماع." },
    ],
    mediation: {
      aufgabeAr: "لخّص بالعربية الحل الوسط الذي اتفق عليه الزميلان بخصوص العمل من البيت.",
      punkteAr: [
        "الزميلة تفضّل العمل من البيت: توفير وقت الطريق وتركيز أفضل.",
        "الزميل يرى فائدة الحضور: نقاش أسرع وتعرّف الموظفين الجدد على الفريق.",
        "اتفقا على حل وسط: ثلاثة أيام عمل من البيت ويومان في المكتب.",
      ],
    },
  },
];

export const STOFF_STUFEN: Level[] = ["A0", "A1", "A2", "B1", "B2"];

export function texteFuer(stufe: Level): FreierText[] {
  return FREIE_TEXTE.filter((t) => t.stufe === stufe);
}

export function dialogeFuer(stufe: Level): FreierDialog[] {
  return FREIE_DIALOGE.filter((d) => d.stufe === stufe);
}
