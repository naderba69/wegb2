import { FALSCHE_FREUNDE } from "./falsche-freunde";

/**
 * 🗺️ A15 (R294, Experten-Audit): kontrastiver Fehleratlas Arabisch↔Deutsch —
 * die wiederkehrenden arabisch geprägten Fehlerfamilien, je mit
 * falsch/richtig-Paar und der einen Regel dahinter. Kuratiert und
 * klein; die falschen Freunde kommen aus dem bestehenden Bankbestand.
 */
export type AtlasKategorie = "wortstellung" | "konnektoren" | "artikel" | "kasus" | "praeposition" | "zeitform" | "falsche-freunde";

export const ATLAS_KATEGORIE_AR: Record<AtlasKategorie, string> = {
  wortstellung: "ترتيب الكلمات",
  konnektoren: "الروابط والجمل الفرعية",
  artikel: "الأداة والجنس",
  kasus: "الحالات (Dativ/Akkusativ)",
  praeposition: "حروف الجر",
  zeitform: "الأزمنة",
  "falsche-freunde": "أصدقاء كاذبون",
};

export interface AtlasEintrag {
  kategorie: AtlasKategorie;
  titelAr: string;
  falsch: string;
  richtig: string;
  regelAr: string;
}

export const FEHLERATLAS: AtlasEintrag[] = [
  // ترتيب الكلمات — الفعل ثانيًا دائمًا
  { kategorie: "wortstellung", titelAr: "الفعل في الموضع الثاني", falsch: "Heute ich gehe ins Büro.", richtig: "Heute gehe ich ins Büro.", regelAr: "العربية تبدأ بالظرف ثم الفاعل؛ الألمانية: الفعل المصريف دائمًا ثانيًا — الظرف أولًا يعني الفاعل بعد الفعل." },
  { kategorie: "wortstellung", titelAr: "الفعل في آخر الفرعية", falsch: "Ich bleibe zu Hause, weil ich bin krank.", richtig: "Ich bleibe zu Hause, weil ich krank bin.", regelAr: "بعد weil/dass/wenn يهاجر الفعل المصريف إلى آخر الجملة الفرعية — عكس العربية تمامًا." },
  { kategorie: "wortstellung", titelAr: "النفي nicht مكانه", falsch: "Ich nicht verstehe das.", richtig: "Ich verstehe das nicht.", regelAr: "nicht لا تسبق الفعل المصريف؛ تنفي الجملة كلها في آخرها أو قبل الجزء المنفي تحديدًا." },
  // روابط
  { kategorie: "konnektoren", titelAr: "deshalb تعكس الترتيب", falsch: "Es regnet, deshalb ich bleibe zu Hause.", richtig: "Es regnet, deshalb bleibe ich zu Hause.", regelAr: "deshalb/dann/trotzdem روابط في الجملة الرئيسة: بعدها الفعل ثم الفاعل (انعكاس)." },
  { kategorie: "konnektoren", titelAr: "wenn أم als", falsch: "Wenn ich ein Kind war, spielte ich draußen.", richtig: "Als ich ein Kind war, spielte ich draußen.", regelAr: "للماضي الواقع مرة واحدة als؛ wenn للحاضر/المستقبل أو التكرار في الماضي." },
  { kategorie: "konnektoren", titelAr: "ob أم wenn", falsch: "Ich weiß nicht, wenn er kommt.", richtig: "Ich weiß nicht, ob er kommt.", regelAr: "للسؤال غير المباشر (هل) استخدم ob؛ wenn للشرط والزمان فقط." },
  // أداة وجنس
  { kategorie: "artikel", titelAr: "جنس لا يُخمَّن من العربية", falsch: "die Mädchen / der Sonne", richtig: "das Mädchen / die Sonne", regelAr: "الجنس الألماني معجمي لا معنوي: Mädchen محايد رغم معناه، وSonne مؤنثة عكس «الشمس» المؤنثة عربيًا صدفةً. احفظ الاسم بأداته دائمًا." },
  { kategorie: "artikel", titelAr: "أسماء البلدان بلا أداة", falsch: "Ich komme aus der Tunesien.", richtig: "Ich komme aus Tunesien.", regelAr: "معظم البلدان محايدة بلا أداة (aus Tunesien/Deutschland)؛ الاستثناءات مغلقة: die Schweiz, die Türkei, der Irak…" },
  { kategorie: "artikel", titelAr: "kein أم nicht", falsch: "Ich habe nicht Geld.", richtig: "Ich habe kein Geld.", regelAr: "نفي الاسم النكرة بـkein (kein Geld/keine Zeit)؛ nicht للفعل والصفات والمعرف بـder/die/das." },
  // حالات
  { kategorie: "kasus", titelAr: "أفعال الـDativ الثابتة", falsch: "Ich helfe dich.", richtig: "Ich helfe dir.", regelAr: "helfen/danken/gehören/folgen تأخذ Dativ دائمًا — العربية «أساعدك» تخدعك نحو Akkusativ." },
  { kategorie: "kasus", titelAr: "حروف جر Dativ الخالصة", falsch: "mit den Bus / seit einen Monat", richtig: "mit dem Bus / seit einem Monat", regelAr: "mit, seit, von, zu, bei, nach, aus تأخذ Dativ دائمًا مهما كان المعنى." },
  { kategorie: "kasus", titelAr: "حروف الجر المزدوجة: wohin/worin", falsch: "Ich gehe in dem Park. / Ich bin in den Park.", richtig: "Ich gehe in den Park. / Ich bin in dem Park.", regelAr: "الحركة نحو (wohin?) بـAkkusativ، والثبات في (wo?) بـDativ — سؤالان يقرران الحالة." },
  // حروف جر
  { kategorie: "praeposition", titelAr: "warten auf لا warten für", falsch: "Ich warte für den Bus.", richtig: "Ich warte auf den Bus.", regelAr: "أفعال كثيرة لها حرف ثابت يُحفظ معها: warten auf, denken an, sich freuen auf/über — لا تترجمه من «لأجل/على» العربية." },
  { kategorie: "praeposition", titelAr: "am/im بالأزمنة", falsch: "in dem Montag / um dem Abend", richtig: "am Montag / am Abend", regelAr: "اليوم والوقت اليومي بـam (am Montag, am Abend)، الساعة بـum (um 8 Uhr)، الشهر والموسم بـim." },
  { kategorie: "praeposition", titelAr: "zu Hause لا bei", falsch: "Ich bin bei Hause.", richtig: "Ich bin zu Hause. / Ich gehe nach Hause.", regelAr: "ثنائية ثابتة: الثبات zu Hause والاتجاه nach Hause — لا حرف آخر مهما بدا منطقيًا." },
  // أزمنة
  { kategorie: "zeitform", titelAr: "Perfekt بـsein لحركات", falsch: "Ich habe nach Berlin gefahren.", richtig: "Ich bin nach Berlin gefahren.", regelAr: "أفعال الحركة وتغيّر الحال (fahren, gehen, werden, sein) تبني Perfekt بـsein لا haben." },
  { kategorie: "zeitform", titelAr: "منذ = Präsens + seit", falsch: "Ich habe seit drei Jahren in Tunis gewohnt. (لمن ما زال يسكن)", richtig: "Ich wohne seit drei Jahren in Tunis.", regelAr: "العربية تستخدم الماضي لما بدأ وما زال؛ الألمانية: حاضر + seit لما لم ينتهِ بعد." },
  { kategorie: "zeitform", titelAr: "Präteritum للأفعال المساعدة", falsch: "Gestern ich habe keine Zeit gehabt. (في الكتابة الرسمية)", richtig: "Gestern hatte ich keine Zeit.", regelAr: "في السرد المكتوب: haben/sein/Modalverben بالماضي البسيط (hatte, war, musste) — وبالحاضر التام لغيرها." },
];

export function atlasEintraege(kategorie?: AtlasKategorie): AtlasEintrag[] {
  const basis = kategorie ? FEHLERATLAS.filter((e) => e.kategorie === kategorie) : FEHLERATLAS;
  if (kategorie === "falsche-freunde") {
    return FALSCHE_FREUNDE.slice(0, 8).map((f) => ({
      kategorie: "falsche-freunde" as const,
      titelAr: `«${f.de}» لا تعني «${f.falschBedeutet}»`,
      falsch: `${f.de} = ${f.falschBedeutet}؟`,
      richtig: `${f.de} = ${f.ar}`,
      regelAr: f.warhammer,
    }));
  }
  return basis;
}
