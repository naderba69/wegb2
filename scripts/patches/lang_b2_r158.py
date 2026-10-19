# -*- coding: utf-8 -*-
"""R158: نسخ طويلة (lang) لخمسة نصوص B2 لاحقة ثانية (t-b2-26..30) — توسعة أمينة لوقائعها
بتحوّطاتها القانونية كما هي وعلامة الأمثلة المختَلقة محفوظة، ضمن نطاق العرض 220–270 كلمة،
نمط 5 أسئلة (3 mc + صواب/خطأ + إكمال). يُنشئ content/lang/b2-26-30.json (idempotent)."""
import json, os, collections, re

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "content", "lang", "b2-26-30.json")
AR = re.compile(r"[\u0600-\u06FF]")

def Q(tid, n, typ, promptDe, answer, expl, options=None):
    q = collections.OrderedDict()
    q["id"] = f"{tid}-l{n}"
    q["type"] = typ
    q["promptDe"] = promptDe
    if options is not None:
        q["options"] = options
    q["answer"] = answer
    q["explanationAr"] = expl
    return q

E = {}

E["t-b2-26"] = collections.OrderedDict([
  ("de", "Als das erste Windrad hinter dem Dorf geplant wurde, war die Stimmung angespannt. Man sprach über Schattenwurf am Morgen, über Infraschall und mögliche gesundheitliche Folgen sowie über den Mindestabstand zu den letzten Häusern. Eine vom Umweltbundesamt beauftragte Studie hatte an fünf Standorten Infraschallpegel unter der Hörschwelle gemessen. Hörversuche an drei Standorten zeigten zugleich: Die Lästigkeit stieg mit der Modulationstiefe; schon die bloße Wahrnehmbarkeit der Amplitudenmodulation erhöhte sie. Ein Windpark, hieß es im Dorf, gehöre aufs Meer, nicht ins Tal.\n\nDie Wende kam mit einem anderen Modell. Statt eines fremden Betreibers gründete eine Gruppe aus dem Ort eine Genossenschaft für den Bürgerwindpark. Interessierte konnten Anteile erwerben, und ein Teil möglicher Erträge sollte in der Region bleiben. Frühere Kritiker begannen nun, mögliche Erlöse durchzurechnen und zu prüfen, ob eine Einspeisevergütung infrage kam. Der Bürgermeister lernte daraus: Akzeptanz kann wachsen, wenn Menschen mitentscheiden und von den Erträgen profitieren; Broschüren allein reichen dafür selten aus.\n\nGelöst ist damit längst nicht alles. Ohne Netzausbau lässt sich der Ökostrom aus dem Windpark nicht vollständig in die Stadt transportieren, und gegen die geplante Stromtrasse klagt das Nachbardorf. Auf dem Dach der Schule liefert inzwischen Solarenergie Strom für die Küche, und das alte Kraftwerk am Fluss läuft nur noch während der Heizperiode. Erneuerbare Energie beseitigt Konflikte nicht automatisch; sie rücken nur näher an die Häuser, sobald Anlagen in der Umgebung geplant werden."),
  ("ar", "عندما خُطط لأول توربين رياح خلف القرية توترت الأجواء: ظلّ الصباح الصوتي، ودون-الصوتيات وآثارها الصحية المحتملة، والمسافة الدنيا عن البيوت. دراسة كلفتها وكالة البيئة الاتحادية قاست في خمسة مواقع مستويات دون-صوتية دون عتبة السمع، بينما أظهرت تجارب استماع في ثلاثة مواقع أن الانزعاج يزيد مع عمق التضمين وأن مجرد إدراك تضمين السعة يرفعه. جاء التحوّل بنموذج آخر: تعاونية محلية لحديقة رياح المواطنين بدل مشغّل غريب، أسهم يشتريها المهتمون وبقاء جزء من العائدات في المنطقة، فبدأ منتقدون سابقون يحسبون الإيرادات ويدرسون تعرفة التغذية. درس العمدة: القبول ينمو بالمشاركة في القرار والانتفاع لا بالكتيبات وحدها. لم يُحسم كل شيء: دون توسعة الشبكة لا يصل كل التيار الأخضر إلى المدينة، والقرية المجاورة تقاضي خط الربط المقترح، وعلى سطح المدرسة ألواح شمسية للمطبخ، ومحطة النهر القديمة تعمل في موسم التدفئة فقط — الطاقة المتجددة لا تلغي النزاعات، تقرّبها إلى البيوت فحسب."),
  ("questions", [
    Q("t-b2-26", 1, "mc", "Was brachte die Wende in der Debatte um den Windpark?",
      "das Genossenschaftsmodell mit Anteilen für die Menschen vor Ort", "الدليل في النص: «gründete eine Gruppe aus dem Ort eine Genossenschaft» و«ein Teil möglicher Erträge sollte in der Region bleiben».",
      ["das Genossenschaftsmodell mit Anteilen für die Menschen vor Ort", "eine neue Studie zum Infraschall", "ein Verbot durch den Bürgermeister"]),
    Q("t-b2-26", 2, "mc", "Was zeigten die Hörversuche der Studie?",
      "Die Lästigkeit stieg mit der Modulationstiefe", "الدليل في النص: «Die Lästigkeit stieg mit der Modulationstiefe».",
      ["Die Lästigkeit stieg mit der Modulationstiefe", "Infraschall war deutlich hörbar", "Niemand fühlte sich gestört"]),
    Q("t-b2-26", 3, "mc", "Was lernte der Bürgermeister laut Text?",
      "Akzeptanz wächst durch Mitentscheidung und Teilhabe an Erträgen", "الدليل في النص: «Akzeptanz kann wachsen, wenn Menschen mitentscheiden und von den Erträgen profitieren».",
      ["Akzeptanz wächst durch Mitentscheidung und Teilhabe an Erträgen", "Broschüren überzeugen am besten", "Man muss Kritiker ignorieren"]),
    Q("t-b2-26", 4, "truefalse", "Die Studie maß an fünf Standorten Infraschallpegel unter der Hörschwelle.",
      "richtig", "الدليل في النص: «Infraschallpegel unter der Hörschwelle gemessen».",
      ["richtig", "falsch"]),
    Q("t-b2-26", 5, "fill", "Ein Teil möglicher ___ sollte in der Region bleiben.",
      "Erträge", "الدليل في النص: «ein Teil möglicher Erträge sollte in der Region bleiben».",
      None),
  ]),
])

E["t-b2-27"] = collections.OrderedDict([
  ("de", "Frau Öztürk arbeitet seit zwölf Jahren in einer Verbraucherzentrale. Sie sagt, die Fälle hätten sich kaum verändert; nur die Verpackung sei heute eine andere. Früher kam die Kundschaft mit einem Katalog in der Hand, heute kommt sie mit einem Handy. Das Prinzip aber bleibt gleich: Ein Lockvogel zieht die Menschen an, und das Kleingedruckte holt sie zurück.\n\nIn ihrer Beratung sei die Abo-Falle besonders häufig: ein kostenloser Probemonat, ein hochwertig aussehendes Angebot, ein Schnäppchen mit Countdown, das zur Eile drängt. Nach dem Probezeitraum kann ein kostenpflichtiges Abonnement weiterlaufen, wenn dies wirksam vereinbart wurde und die Kundin oder der Kunde nicht rechtzeitig kündigt. Auch Mogelpackungen seien ein häufiges Thema: gleiche Verpackungsgröße, weniger Inhalt, gleicher Preis. Ob das rechtlich eine Irreführung ist, hängt vom Einzelfall und vom Gesamteindruck der Verpackung ab; eine Füllmengenangabe allein schließt sie nicht automatisch aus.\n\nViele wüssten außerdem nicht, dass es beim Kauf im Laden kein allgemeines Rückgaberecht für mangelfreie Ware gibt, nur weil sie später nicht gefällt. Wer einen mangelfreien Pullover umtauschen möchte, ist normalerweise auf die Kulanz des Händlers angewiesen. Bei einem Sachmangel dagegen kann man reklamieren und gesetzliche Gewährleistungsrechte geltend machen; dafür gelten Fristen und Bedingungen. Den Unterschied zwischen Umtausch und Reklamation erklärt Frau Öztürk täglich. Bei bestimmten Wettbewerbsverstößen können qualifizierte Verbraucherverbände eine Abmahnung aussprechen; ob das schneller wirkt als ein Gerichtsverfahren, hängt vom Fall ab."),
  ("ar", "السيدة أوزتورك تعمل منذ اثني عشر عاماً في مركز حماية مستهلك: القضايا لم تتغير تقريباً، تغيّرت العبوة فقط (أمس كتالوج واليوم هاتف). المبدأ واحد: طُعم يجذب والحروف الصغيرة تسترد. أكثر ما تراه مصيدة الاشتراكات: شهر تجريبي مجاني وعرض يبدو فاخراً وصفقة بعدّاد تنازلي يستعجلك؛ وبعد التجربة قد يستمر اشتراك مدفوع إن اتُّفق عليه بفاعلية ولم تُلغِ في الوقت. وحيل العبوات: الحجم نفسه ومحتوى أقل وسعر نفسه — وكون ذلك قانوناً تضليلاً يتبع الحالة المفردة والانطباع الكلي، فذكر كمية التعبئة وحده لا ينفيه تلقائياً. ويجهل كثيرون أن لا حق عاماً لإرجاع سلعة سليمة في المتجر لمجرد أنها لم تعد تعجبهم: الاستبدال إذن من كرم التاجر عادة، أما العيب الحقيقي فيجيز الشكوى وحقوق الضمان القانوني ضمن آجال وشروط. هذا الفرق بين الاستبدال والشكوى تشرحه يومياً؛ وعند مخالفات منافسة معينة تستطيع جمعيات مستهلك مؤهلة إصدار إنذار، وأيكون أسرع من القضاء فذلك بحسب الحالة."),
  ("questions", [
    Q("t-b2-27", 1, "mc", "Was ist die beschriebene Abo-Falle?",
      "Nach einem kostenlosen Probemonat läuft ein Abo kostenpflichtig weiter", "الدليل في النص: «Nach dem Probezeitraum kann ein kostenpflichtiges Abonnement weiterlaufen». بشرط الاتفاق الفعّال وعدم الإلغاء في الوقت.",
      ["Nach einem kostenlosen Probemonat läuft ein Abo kostenpflichtig weiter", "Ein Abo ist immer kostenlos", "Man kann nie kündigen"]),
    Q("t-b2-27", 2, "mc", "Was gilt für den Umtausch mangelfreier Ware im Laden?",
      "Es gibt kein allgemeines Rückgaberecht; man ist auf Kulanz angewiesen", "الدليل في النص: «kein allgemeines Rückgaberecht für mangelfreie Ware» و«auf die Kulanz des Händlers angewiesen».",
      ["Es gibt kein allgemeines Rückgaberecht; man ist auf Kulanz angewiesen", "Man kann alles 30 Tage zurückgeben", "Der Händler muss immer umtauschen"]),
    Q("t-b2-27", 3, "mc", "Wer kann bei Wettbewerbsverstößen eine Abmahnung aussprechen?",
      "qualifizierte Verbraucherverbände", "الدليل في النص: «können qualifizierte Verbraucherverbände eine Abmahnung aussprechen».",
      ["qualifizierte Verbraucherverbände", "jeder einzelne Kunde", "nur die Polizei"]),
    Q("t-b2-27", 4, "truefalse", "Beim Kauf im Laden darf man mangelfreie Ware jederzeit zurückgeben, wenn sie nicht gefällt.",
      "falsch", "الدليل في النص: «beim Kauf im Laden kein allgemeines Rückgaberecht für mangelfreie Ware».",
      ["richtig", "falsch"]),
    Q("t-b2-27", 5, "fill", "Ein ___ zieht die Menschen an, und das Kleingedruckte holt sie zurück.",
      "Lockvogel", "الدليل في النص: «Ein Lockvogel zieht die Menschen an».",
      None),
  ]),
])

E["t-b2-28"] = collections.OrderedDict([
  ("de", "Im Viertel am Bahnhof eröffneten innerhalb von zwei Jahren drei Cafés, ein Yogastudio und ein Laden für Fahrräder, die mehr kosten als ein Kleinwagen. Die Zeitung nannte diesen Wandel Aufwertung. Eine Familie im dritten Stock, deren Miete nach der Sanierung um ein Drittel gestiegen war, erlebte ihn ganz anders. Gentrifizierung bezeichnet die Aufwertung eines Viertels; Verdrängung kann folgen: Man wird nicht gekündigt, sondern kann sich das Wohnen dort kaum noch leisten.\n\nEin Mietspiegel bietet eine Übersicht über die ortsübliche Vergleichsmiete. Bei bestimmten Erhöhungen begrenzt die Kappungsgrenze den Anstieg innerhalb von drei Jahren. Die Stadt kann ihr Vorkaufsrecht nur in gesetzlich geregelten Fällen und zum Wohl der Allgemeinheit ausüben. Ein Zweckentfremdungsverbot kann in einzelnen Kommunen die Ferienvermietung einschränken; die örtlichen Regeln unterscheiden sich jedoch. Der Leerstand des alten Postgebäudes dauert seit sieben Jahren an, und Bewohner beklagen, dass das Verbot kaum kontrolliert werde.\n\nBeim Bürgerentscheid im Frühjahr ging es um den Bebauungsplan für den letzten freien Platz: Nachverdichtung mit sechzig Wohnungen oder Stadtbegrünung mit Bäumen und einem Spielplatz. Die Gegner warnten vor Versiegelung und der Bebauung einer wichtigen Frischluftschneise. Die Befürworter fragten, wo die Familien sonst wohnen sollten. Am Ende gewann die Bebauung knapp, mit der Auflage, das Dach zu begrünen. Bürgerbeteiligung garantiert keine Zufriedenheit; sie soll Betroffenen aber Gehör verschaffen. Ob man ein Viertel aufwerten kann, ohne seine Bewohner zu verlieren, bleibt die eigentliche Frage."),
  ("ar", "في حي المحطة خلال عامين ثلاثة مقاهٍ واستوديو يوغا ومتجر دراجات أغلى من سيارة صغيرة: الصحافة سمّته «ترقية» للحي، بينما عاشته عائلة في الطابق الثالث ارتفع إيجارها بعد التجديد ثلثاً تجربة مختلفة تماماً. منذ سنوات وأبنية البريد القديمة خالية ويشتكي السكان أن حظر إساءة الاستخدام (كحظر تأجير العطلات الذي تختلف قواعده بين بلدية وأخرى) لا يُراقب تقريباً. في استفتاء المواطنين الربيعي حول آخر ساحة خالية: تكثيف عمراني بستين شقة أم خضرة حضرية بأشجار وملعب؟ حذّر الخصوم من ختم التربة وبناء ممر هواء نقي، وسأل المؤيدون أين ستسكن العائلات إذن. فاز البناء بفارق ضئيل بشرط تخضير السطح. المشاركة لا تضمن الرضا لكنها تمنح المعنيين صوتاً مسموعاً، والسؤال الحقيقي باقٍ: هل يمكن ترقية حي دون فقدان سكانه؟"),
  ("questions", [
    Q("t-b2-28", 1, "mc", "Was beklagen die Bewohner am Zweckentfremdungsverbot?",
      "dass es kaum kontrolliert werde", "الدليل في النص: «Bewohner beklagen, dass das Verbot kaum kontrolliert werde».",
      ["dass es kaum kontrolliert werde", "dass es zu streng sei", "dass es zu teuer sei"]),
    Q("t-b2-28", 2, "mc", "Was gewann beim Bürgerentscheid im Frühjahr?",
      "die Bebauung mit sechzig Wohnungen, knapp und mit Dachbegrünung", "الدليل في النص: «Am Ende gewann die Bebauung knapp, mit der Auflage, das Dach zu begrünen».",
      ["die Bebauung mit sechzig Wohnungen, knapp und mit Dachbegrünung", "die Stadtbegrünung mit Spielplatz", "keine der beiden Optionen"]),
    Q("t-b2-28", 3, "mc", "Was bedeutet Verdrängung laut Text?",
      "Man wird nicht gekündigt, kann sich das Wohnen aber kaum noch leisten", "الدليل في النص: «Man wird nicht gekündigt, sondern kann sich das Wohnen dort kaum noch leisten».",
      ["Man wird nicht gekündigt, kann sich das Wohnen aber kaum noch leisten", "Alle Mieter werden sofort gekündigt", "Die Mieten sinken stark"]),
    Q("t-b2-28", 4, "truefalse", "Die Miete der Familie im dritten Stock stieg nach der Sanierung um ein Drittel.",
      "richtig", "الدليل في النص: «deren Miete nach der Sanierung um ein Drittel gestiegen war».",
      ["richtig", "falsch"]),
    Q("t-b2-28", 5, "fill", "Die ___ begrenzt den Anstieg der Miete innerhalb von drei Jahren.",
      "Kappungsgrenze", "الدليل في النص: «begrenzt die Kappungsgrenze den Anstieg innerhalb von drei Jahren».",
      None),
  ]),
])

E["t-b2-29"] = collections.OrderedDict([
  ("de", "Dr. Amani ist vor sechs Jahren nach Deutschland zugewandert. Sie hatte einen Abschluss in Chemie und in ihrem Heimatland bereits mehrere Jahre im Labor gearbeitet, aber anfangs keine Arbeitserlaubnis. Die Gleichwertigkeitsprüfung ihres Diploms dauerte neun Monate; danach brauchte sie ein halbes Jahr Nachqualifizierung, weil ein Fach im deutschen Lehrplan andere Inhalte vorsah als in ihrer Ausbildung. Ihre Duldung wurde alle sechs Monate verlängert; ihre Bleibeperspektive blieb unklar. Planen konnte sie in dieser Zeit nichts, nicht einmal einen einfachen Zahnarzttermin.\n\nDer Integrationskurs war ihr sprachlich zu leicht, aber die Behördenbriefe blieben schwierig. Ihr Mann kam erst im dritten Jahr nach Deutschland. Heute besitzt sie eine Blaue Karte EU. Unter weiteren Voraussetzungen kann ihr eine Niederlassungserlaubnis nach siebenundzwanzig Monaten Beschäftigung mit Rentenbeiträgen und einfachen Deutschkenntnissen erteilt werden; bei ausreichenden Deutschkenntnissen bereits nach einundzwanzig Monaten. Sie lässt gerade prüfen, ob sie alle Voraussetzungen erfüllt. Eine Kollegin im Labor erklärte ihr jeden Brief vom Amt, Satz für Satz. Dr. Amani sagt: „Willkommenskultur ist kein Plakat am Bahnhof, sondern eine Person, die Zeit hat.“\n\nOb sie die deutsche Staatsangehörigkeit beantragen will, weiß sie noch nicht. Die Einbürgerung wäre ein Schritt, den ihre Eltern kaum verstehen würden. Sie will sich einfügen, ohne die eigene Herkunft aufzugeben, und sie übt das täglich. Die Mehrheitsgesellschaft bemerkt selten, wie viel Übersetzungsarbeit Integration kostet, nicht nur beim Zweitspracherwerb. Ankommen, sagt sie, ist kein Datum, sondern eine Richtung."),
  ("ar", "الدكتورة أماني وصلت إلى ألمانيا قبل ست سنوات بشهادة كيمياء وبلا تصريح عمل: معادلة شهادتها استغرقت تسعة أشهر ثم نصف عام تأهيلاً تكميلياً لاختلاف محتوى مادة في المنهاج الألماني، وكانت إقامتها المؤقتة تُجدَّد كل ستة أشهر وآفاق بقائها غامضة فلا تستطيع تخطيط شيء ولو موعد طبيب أسنان. دورة الاندماج كانت لغوياً أسهل منها لكن رسائل الدوائر بقيت صعبة، وزوجها لحق بها في العام الثالث فقط. اليوم تحمل البطاقة الزرقاء الأوروبية، ويمكن بشروط إضافية منحها إقامة دائمة بعد 27 شهراً من عمل بمساهمات تقاعدية وألمانية بسيطة، أو 21 شهراً بألمانية كافية — وهي تتحقق الآن من استيفائها الشروط. زميلة مخبر كانت تشرح لها كل رسالة رسمية جملة جملة؛ فتقول: «ثقافة الترحاب ليست ملصقاً في المحطة بل شخصاً لديه وقت». لم تحسم أمر التجنس — خطوة لن يفهمها والداها — وتريد الاندماج دون التخلي عن أصلها، وتدرك أن مجتمع الأكثرية قلّما يلاحظ كلفة الترجمة التي يبذلها الاندماج لا في تعلم اللغة الثانية فقط. الوصول عندها ليس تاريخاً بل اتجاهاً."),
  ("questions", [
    Q("t-b2-29", 1, "mc", "Warum dauerte ihre Anerkennung so lange?",
      "Die Prüfung dauerte neun Monate, danach folgte ein halbes Jahr Nachqualifizierung", "الدليل في النص: «Die Gleichwertigkeitsprüfung ihres Diploms dauerte neun Monate; danach brauchte sie ein halbes Jahr Nachqualifizierung».",
      ["Die Prüfung dauerte neun Monate, danach folgte ein halbes Jahr Nachqualifizierung", "Sie hatte kein Diplom", "Sie musste das Studium wiederholen"]),
    Q("t-b2-29", 2, "mc", "Was meint Dr. Amani mit ihrem Satz zur Willkommenskultur?",
      "Sie ist eine Person, die Zeit für einen hat, kein Plakat", "الدليل في النص: «Willkommenskultur ist kein Plakat am Bahnhof, sondern eine Person, die Zeit hat».",
      ["Sie ist eine Person, die Zeit für einen hat, kein Plakat", "Plakate am Bahnhof helfen am meisten", "Kultur lernt man nur im Kurs"]),
    Q("t-b2-29", 3, "mc", "Nach wie vielen Monaten kann sie unter Voraussetzungen eine Niederlassungserlaubnis erhalten?",
      "nach 27 Monaten, bei ausreichenden Deutschkenntnissen nach 21", "الدليل في النص: «nach siebenundzwanzig Monaten» و«bei ausreichenden Deutschkenntnissen bereits nach einundzwanzig Monaten».",
      ["nach 27 Monaten, bei ausreichenden Deutschkenntnissen nach 21", "nach 12 Monaten", "erst nach 5 Jahren"]),
    Q("t-b2-29", 4, "truefalse", "Ihr Mann kam bereits im ersten Jahr nach Deutschland nach.",
      "falsch", "الدليل في النص: «Ihr Mann kam erst im dritten Jahr nach Deutschland».",
      ["richtig", "falsch"]),
    Q("t-b2-29", 5, "fill", "Ankommen ist kein Datum, sondern eine ___.",
      "Richtung", "الدليل في النص: «ist kein Datum, sondern eine Richtung».",
      None),
  ]),
])

E["t-b2-30"] = collections.OrderedDict([
  ("de", "Das folgende Beispiel ist erfunden: Vor Haus Nummer vierzehn liegt seit dem Frühjahr ein kleiner Stolperstein im Gehweg, ein Betonstein mit einer Messingplatte. Auf der Platte stehen Name, Geburtsjahr und Schicksal einer im Nationalsozialismus verfolgten Person. Die Zehntklässlerinnen einer nahen Schule recherchierten die Geschichte der Familie, die dort einmal wohnte, und hielten bei der Verlegung eine Gedenkminute. Anders als ein großes Mahnmal mit festen Öffnungszeiten erinnert der Stein Passantinnen und Passanten mitten im Alltag. So zeigt das Beispiel Erinnerungskultur im Kleinen.\n\nNicht alle im Haus waren dafür. Ein Bewohner fragte, ob man nicht irgendwann einen Schlussstrich ziehen könne; seine Großeltern seien doch nur Mitläufer gewesen. Die Lehrerin antwortete, Erinnerungsarbeit stelle den Enkeln keine Schuldfrage. Sie frage vielmehr, wie Menschen damals Verfolgung unterstützten, duldeten oder sich ihr widersetzten, damit heutige Generationen Warnsignale rechtzeitig erkennen können. Wer die Vergangenheit relativiere, schütze nicht die Großeltern, sondern die eigene Bequemlichkeit.\n\nIn dieser Geschichte starb der letzte Zeitzeuge aus der Straße vor zwei Jahren. Sein Interview, eine Aufnahme von dreiundvierzig Minuten, liegt im Schularchiv; die Schülerinnen hörten es, bevor der Stein verlegt wurde. Vergangenheitsbewältigung klingt schwer und meint hier eine konkrete Aufgabe: genau hinsehen, das Geschehene aufarbeiten und Erinnerungen weitergeben. Manchmal beginnt Verharmlosung nicht mit einer offenen Lüge, sondern mit einem Wort, das weniger hart klingt als das Geschehene. Wer der Toten gedenkt, sagt die Lehrerin, tut das nicht für die Toten allein."),
  ("ar", "مثال مُختَلق كما يصرّح النص: أمام البيت رقم 14 حجر عثرة صغير في الرصيف منذ الربيع — حجر خرساني بلوحة نحاسية تحمل اسم شخص اضطُهد في الحقبة النازية وسنة ميلاده ومصيره. طالبات صف عاشر بحثن تاريخ العائلة التي سكنت هناك وأقمن دقيقة صمت عند وضع الحجر؛ وخلافاً لنصب تذكاري كبير بساعات فتح ثابتة يذكّر الحجر المارة وسط يومهم — ثقافة ذاكرة في الصغير. لم يوافق الجميع: سأل أحد السكان أما آن وضع حدّ فاصل فأجداده كانوا مجرد مسايرين؛ أجابت المعلمة أن عمل الذاكرة لا يطرح على الأحفاد سؤال ذنب بل يسأل كيف أيد الناس الاضطهاد أو سكتوا عنه أو قاوموه ليتعرف جيل اليوم على إشارات الإنذار — ومن يهوّن الماضي لا يحمي الأجداد بل راحته هو. آخر شاهد عيان من الشارع مات قبل عامين ومقابلته (43 دقيقة) محفوظة في أرشيف المدرسة سمعتها الطالبات قبل وضع الحجر. معالجة الماضي هنا مهمة ملموسة: النظر بدقة ومراجعة ما حدث وتمرير الذكريات؛ والتهوين يبدأ أحياناً لا بكذبة صريحة بل بكلمة أخف من الحدث نفسه، وإحياء ذكرى الموتى ليس لأجل الموتى وحدهم."),
  ("questions", [
    Q("t-b2-30", 1, "mc", "Was steht auf der Messingplatte des Stolpersteins?",
      "Name, Geburtsjahr und Schicksal einer verfolgten Person", "الدليل في النص: «stehen Name, Geburtsjahr und Schicksal einer im Nationalsozialismus verfolgten Person».",
      ["Name, Geburtsjahr und Schicksal einer verfolgten Person", "die Geschichte des ganzen Hauses", "die Namen der Schülerinnen"]),
    Q("t-b2-30", 2, "mc", "Wie antwortet die Lehrerin auf die Frage nach einem Schlussstrich?",
      "Erinnerungsarbeit stelle den Enkeln keine Schuldfrage", "الدليل في النص: «Erinnerungsarbeit stelle den Enkeln keine Schuldfrage».",
      ["Erinnerungsarbeit stelle den Enkeln keine Schuldfrage", "Man müsse die Vergangenheit vergessen", "Die Enkel seien mitschuldig"]),
    Q("t-b2-30", 3, "mc", "Womit beginnt Verharmlosung laut Text manchmal?",
      "mit einem Wort, das weniger hart klingt als das Geschehene", "الدليل في النص: «mit einem Wort, das weniger hart klingt als das Geschehene».",
      ["mit einem Wort, das weniger hart klingt als das Geschehene", "mit einer offenen Lüge", "mit einem Verbot"]),
    Q("t-b2-30", 4, "truefalse", "Die Lehrerin sagt, Erinnerungsarbeit stelle den Enkeln eine Schuldfrage.",
      "falsch", "الدليل في النص: «stelle den Enkeln keine Schuldfrage» — على العكس تماماً.",
      ["richtig", "falsch"]),
    Q("t-b2-30", 5, "fill", "Das Interview des Zeitzeugen, eine Aufnahme von ___ Minuten, liegt im Schularchiv.",
      "dreiundvierzig", "الدليل في النص: «eine Aufnahme von dreiundvierzig Minuten».",
      None),
  ]),
])

tf_r = tf_g = 0
for tid, e in E.items():
    de, ar, qs = e["de"], e["ar"], e["questions"]
    n = len(de.split())
    assert 220 <= n <= 270, (tid, n)  # تقاطع K70b ‏[220,420] مع نطاق عرض audit_inhalt ‏[173,270]
    assert len(de.split("\n\n")) >= 3 and not AR.search(de) and AR.search(ar), tid
    assert len(qs) == 5, tid
    typen = [q["type"] for q in qs]
    assert typen.count("mc") == 3 and typen.count("truefalse") == 1 and typen.count("fill") == 1, (tid, typen)
    for q in qs:
        assert AR.search(q["explanationAr"]), q["id"]
        if q["type"] == "mc":
            assert q["answer"] in q["options"] and len(set(q["options"])) == len(q["options"]), q["id"]
        if q["type"] == "truefalse":
            if q["answer"] == "richtig": tf_r += 1
            else: tf_g += 1
        if q["type"] == "fill":
            assert re.search(r"\b" + re.escape(q["answer"]) + r"\b", de), (q["id"], q["answer"])
        for m in re.finditer(r"«([^»]+)»", q["explanationAr"]):
            for piece in re.split(r"…|\.\.\.", m.group(1)):
                p = piece.strip(" .,;:„“\"")
                assert len(p) < 12 or p in de, (q["id"], p)
print(f"self-checks OK · truefalse richtig/falsch = {tf_r}/{tf_g}")

vorhanden = {}
if os.path.exists(OUT):
    vorhanden = json.load(open(OUT, encoding="utf8"), object_pairs_hook=collections.OrderedDict)
neu = 0
for tid, e in E.items():
    if tid not in vorhanden:
        vorhanden[tid] = e
        neu += 1
json.dump(vorhanden, open(OUT, "w", encoding="utf8"), ensure_ascii=False, indent=2)
print(f"R158 lang B2 written: +{neu} (file now {len(vorhanden)} entries)")
