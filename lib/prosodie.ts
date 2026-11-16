import type { Level } from "./types";

export type ProsodieFokus =
  | "satzakzent"
  | "rhythmus"
  | "reduktion"
  | "verbindung"
  | "intonation"
  | "arabisch-transfer";

export interface ProsodieEinheit {
  id: string;
  level: "B1" | "B2";
  fokus: ProsodieFokus;
  titelDe: string;
  titelAr: string;
  satzDe: string;
  satzAr: string;
  markierungDe: string;
  zielAr: string;
  coachingAr: [string, string, string];
}

/**
 * مسار نبر/إيقاع داخلي لـB1/B2. الجمل والتعليمات مادة تدريبية مؤلفة داخلياً؛
 * لا تمثل معيار نطق رسمي ولا تسمح بتحويل تحليل الطاقة المحلي إلى حكم فونيمي.
 */
export const PROSODIE_EINHEITEN: readonly ProsodieEinheit[] = [
  {
    id: "pro-b1-satzakzent",
    level: "B1",
    fokus: "satzakzent",
    titelDe: "Satzakzent: neue Information",
    titelAr: "نبر المعلومة الجديدة",
    satzDe: "Ich habe den Termin am Dienstag bestätigt, nicht am Donnerstag.",
    satzAr: "أكّدت الموعد يوم الثلاثاء، لا يوم الخميس.",
    markierungDe: "Ich habe den Termin am DIENSTAG bestätigt, nicht am DONNERSTAG.",
    zielAr: "اجعل الكلمتين المتقابلتين أوضح وأطول قليلاً، وخفّف الكلمات الوظيفية بينهما.",
    coachingAr: ["اقرأ المعنى أولاً وحدد التصحيح المقصود.", "شدّد Dienstag وDonnerstag من دون رفع كل الكلمات.", "أدِّ الجملة في مجموعتين يفصل بينهما توقف قصير."],
  },
  {
    id: "pro-b1-rhythmus",
    level: "B1",
    fokus: "rhythmus",
    titelDe: "Satzrhythmus: Inhaltswörter tragen",
    titelAr: "إيقاع الجملة والكلمات الحاملة للمعنى",
    satzDe: "Wenn wir früher losfahren, erreichen wir den Bahnhof noch rechtzeitig.",
    satzAr: "إذا انطلقنا أبكر فسنصل إلى المحطة في الوقت المناسب.",
    markierungDe: "Wenn wir FRÜHER LOSfahren, erREIchen wir den BAHNhof noch RECHTzeitig.",
    zielAr: "حافظ على نبض منتظم للكلمات الحاملة للمعنى، ولا تمنح كل مقطع القوة نفسها.",
    coachingAr: ["صفّق مرة مع كل كلمة بارزة في السطر المعلّم.", "اختصر wenn wir وden بين النبرات.", "لا تتوقف داخل erreichen أو rechtzeitig."],
  },
  {
    id: "pro-b1-reduktion",
    level: "B1",
    fokus: "reduktion",
    titelDe: "Reduktion in häufigen Wortgruppen",
    titelAr: "اختزال الكلمات الشائعة في الكلام المتصل",
    satzDe: "Haben wir noch genug Zeit, oder müssen wir uns beeilen?",
    satzAr: "هل ما زال لدينا وقت كافٍ، أم علينا أن نستعجل؟",
    markierungDe: "HAM wir noch geNUG ZEIT, oder MÜSSN wir uns beEILN?",
    zielAr: "خفف المقاطع غير المنبورة من دون حذف المعنى أو ابتلاع نهاية السؤال.",
    coachingAr: ["قل haben wir بكتلة واحدة لا كلمتين منفصلتين.", "خفف -en في müssen وbeeilen مع بقائه مسموعاً.", "ارفع النغمة قليلاً في السؤال الأول ثم اخفضها في البديل."],
  },
  {
    id: "pro-b1-verbindung",
    level: "B1",
    fokus: "verbindung",
    titelDe: "Wortverbindung ohne harte Grenzen",
    titelAr: "وصل الكلمات من دون حدود حادة",
    satzDe: "Am Abend arbeite ich oft noch an einem anderen Auftrag.",
    satzAr: "في المساء أعمل غالباً على مهمة أخرى.",
    markierungDe: "Am_Abend arbeite_ich_oft noch_an_einem anderen_Auftrag.",
    zielAr: "صِل حدود الكلمات المعلّمة مع إبقاء الحركات واضحة ومن دون وقفة مصطنعة.",
    coachingAr: ["تدرّب أولاً على Am_Abend ثم arbeite_ich_oft.", "خذ نفساً قبل الجملة لا بين الكلمات الموصولة.", "اجعل الوقفة الوحيدة الممكنة قبل noch."],
  },
  {
    id: "pro-b1-intonation",
    level: "B1",
    fokus: "intonation",
    titelDe: "Höfliche Frageintonation",
    titelAr: "تنغيم الطلب المهذب",
    satzDe: "Könnten Sie mir bitte kurz erklären, wie das Formular funktioniert?",
    satzAr: "هل يمكن أن تشرح لي باختصار كيف تعمل الاستمارة؟",
    markierungDe: "KÖNNten Sie mir bitte kurz erKLÄren ↗ | wie das ForMUlAR funktioNIERT ↘?",
    zielAr: "ابدأ الطلب بنغمة غير آمرة، ثم اختم السؤال المضمّن بهبوط واضح.",
    coachingAr: ["لا تشدد Sie وmir؛ النبر على الفعل والمعلومة.", "ارفع النغمة قليلاً قبل الفاصل.", "اخفضها في نهاية funktioniert لأن السؤال المضمّن ليس نعم/لا."],
  },
  {
    id: "pro-b1-arabisch-cluster",
    level: "B1",
    fokus: "arabisch-transfer",
    titelDe: "Konsonantenfolgen ohne Einschubvokal",
    titelAr: "تجمعات السواكن من دون حركة زائدة",
    satzDe: "Brigitte spricht schnell über den neuen Sprachkurs.",
    satzAr: "تتحدث بريغيته بسرعة عن دورة اللغة الجديدة.",
    markierungDe: "BriGITte SPRICHT SCHNELL über den neuen SPRACHkurs.",
    zielAr: "تجنب إدخال حركة بين spr أو schn؛ التحليل المحلي يرصد الإيقاع والمقاطع فقط ولا يحكم على p/b أو مخارج الحروف.",
    coachingAr: ["قل spricht وSprachkurs منفردتين قبل الجملة.", "ابدأ schn في schnell ككتلة واحدة من دون «شِن».", "قارن عدد المقاطع والوقفات، لا تعتبر الدرجة حكماً على صحة p أو ch."],
  },
  {
    id: "pro-b2-kontrastakzent",
    level: "B2",
    fokus: "satzakzent",
    titelDe: "Kontrastakzent in einer Argumentation",
    titelAr: "نبر المقابلة في الحجاج",
    satzDe: "Nicht die Kosten sind das Hauptproblem, sondern die fehlende Planung.",
    satzAr: "ليست التكاليف هي المشكلة الرئيسية، بل غياب التخطيط.",
    markierungDe: "Nicht die KOSTEN sind das Hauptproblem, sondern die fehlende PLANUNG.",
    zielAr: "اجعل قطبي المقابلة واضحين، ولا تحوّل nicht وsondern إلى نبرتين منافستين.",
    coachingAr: ["حدد الكلمتين اللتين تحملان التصحيح.", "أطل الحركة المنبورة قليلاً في Kosten وPlanung.", "حافظ على الجملة قوساً واحداً مع وقفة قصيرة بعد Hauptproblem."],
  },
  {
    id: "pro-b2-rhythmus",
    level: "B2",
    fokus: "rhythmus",
    titelDe: "Informationsstruktur in langen Sätzen",
    titelAr: "بنية المعلومات في الجملة الطويلة",
    satzDe: "Was wir heute entscheiden, wird den weiteren Verlauf des Projekts bestimmen.",
    satzAr: "ما نقرره اليوم سيحدد المسار اللاحق للمشروع.",
    markierungDe: "Was wir HEUTE entSCHEIden | wird den WEIteren VerLAUF des ProJEKTS bestimmen.",
    zielAr: "قسّم الجملة دلالياً إلى وحدتين مع نبض واضح، لا إلى كلمة كلمة.",
    coachingAr: ["اقرأ الوحدة الأولى حتى entscheiden في نفس واحد.", "ابدأ الوحدة الثانية بنبر أخف ثم وجّهها إلى Projekts.", "توقف عند الفاصل النحوي فقط."],
  },
  {
    id: "pro-b2-reduktion",
    level: "B2",
    fokus: "reduktion",
    titelDe: "Reduktion unter Zeitdruck",
    titelAr: "الاختزال الطبيعي مع الحفاظ على الدقة",
    satzDe: "Wenn es darauf ankommt, müssen wir auch unter Zeitdruck präzise reagieren.",
    satzAr: "عندما يكون الأمر حاسماً، علينا أن نستجيب بدقة حتى تحت ضغط الوقت.",
    markierungDe: "Wenn_es daRAUF ankommt | MÜSSN wir auch unter ZEITdruck präZIse reaGIEREN.",
    zielAr: "اختصر الكلمات غير المنبورة، لكن أبق الكلمات الاصطلاحية والدلالية مفهومة.",
    coachingAr: ["صِل Wenn_es وقلها دفعة واحدة.", "خفف -en في müssen من دون حذف الفعل.", "لا تسرع في präzise reagieren؛ هما ذروة المعنى."],
  },
  {
    id: "pro-b2-verbindung",
    level: "B2",
    fokus: "verbindung",
    titelDe: "Satzklammer und Einschub verbinden",
    titelAr: "وصل الجملة مع الجملة الاعتراضية",
    satzDe: "Der Vorschlag, den wir gestern ausführlich besprochen haben, bleibt dennoch umstritten.",
    satzAr: "يبقى المقترح الذي ناقشناه أمس بالتفصيل موضع خلاف.",
    markierungDe: "Der VORschlag | den wir gestern AUSführlich beSPROchen haben | bleibt dennoch umSTRITten.",
    zielAr: "ميّز الاعتراض بنغمة أخف، ثم عُد بوضوح إلى الفعل الرئيس bleibt.",
    coachingAr: ["لا تجعل الاعتراض جملة مستقلة نهائياً.", "خفف البداية den wir gestern ووجّه النبر إلى besprochen.", "بعد الاعتراض، أعد النبض عند bleibt ثم اختم على umstritten."],
  },
  {
    id: "pro-b2-intonation",
    level: "B2",
    fokus: "intonation",
    titelDe: "Höflicher Widerspruch",
    titelAr: "تنغيم الاعتراض المهذب",
    satzDe: "Ich verstehe Ihren Einwand, halte diese Lösung jedoch nicht für ausreichend.",
    satzAr: "أتفهم اعتراضكم، لكنني لا أرى هذا الحل كافياً.",
    markierungDe: "Ich verSTEhe Ihren EINwand ↘ | halte diese LÖsung jedoch NICHT für AUSreichend ↘.",
    zielAr: "أظهر الاعتراف أولاً بنغمة هادئة، ثم اجعل الرفض حازماً من دون عدائية.",
    coachingAr: ["لا ترفع الصوت على Ihren؛ النبر على Einwand.", "ابدأ الجزء الثاني بطاقة جديدة بعد وقفة قصيرة.", "وزع النبر بين nicht وausreichend ولا تصرخ بالكلمتين."],
  },
  {
    id: "pro-b2-arabisch-praesentation",
    level: "B2",
    fokus: "arabisch-transfer",
    titelDe: "Präsentationskadenz ohne monotone Enden",
    titelAr: "إيقاع العرض وتجنب النهايات الرتيبة",
    satzDe: "Zusammenfassend lässt sich sagen: Die Vorteile überwiegen, sofern die Risiken transparent bleiben.",
    satzAr: "وخلاصة القول إن المزايا ترجح، بشرط أن تبقى المخاطر شفافة.",
    markierungDe: "zuSAMmenfassend lässt sich SAgen ↘ | Die VORteile überWIEgen ↘ | sofern die RIsiken transpaRENT bleiben ↘.",
    zielAr: "اجعل لكل وحدة ذروة واحدة ونهاية هابطة؛ لا تمنح كل كلمة النبرة نفسها ولا تضف حركة داخل التجمعات الساكنة.",
    coachingAr: ["قسّم الجملة إلى الوحدات الثلاث المعلّمة.", "لا تتوقف داخل zusammenfassend أو transparent.", "التحليل المحلي يقارن الوقفات والإيقاع فقط؛ لا يثبت جودة المخارج أو اللكنة."],
  },
] as const;

const BY_ID = new Map(PROSODIE_EINHEITEN.map((einheit) => [einheit.id, einheit]));

export function getProsodieEinheit(id: string | undefined): ProsodieEinheit | undefined {
  return id ? BY_ID.get(id) : undefined;
}

/** دوران حتمي؛ يعاد بعد ست وحدات كي تظهر المقارنة أكثر من مرة خلال المرحلة. */
export function prosodieEinheitFuerWoche(level: Level, slot: number): ProsodieEinheit | undefined {
  if (level !== "B1" && level !== "B2") return undefined;
  const pool = PROSODIE_EINHEITEN.filter((einheit) => einheit.level === level);
  return pool[((slot % pool.length) + pool.length) % pool.length];
}
