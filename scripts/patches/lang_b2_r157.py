# -*- coding: utf-8 -*-
"""R157: نسخ طويلة (lang) لخمسة نصوص B2 لاحقة (t-b2-21..25) — توسعة أمينة لوقائعها
وخطوطها الحجاجية، ضمن نطاق العرض 220–270 كلمة (تقاطع K70b ‏[220,420] مع audit_inhalt
[173,270])، نمط B1/B2: ‏5 أسئلة (3 mc + صواب/خطأ + إكمال). النصوص القصيرة بصماتها
المقفولة لا تُمَسّ. يُنشئ content/lang/b2-21-25.json (idempotent)."""
import json, os, collections, re

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "content", "lang", "b2-21-25.json")
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

E["t-b2-21"] = collections.OrderedDict([
  ("de", "Als Rami erfuhr, dass sein Freund Tarek die Stelle bekommen hatte, auf die sie sich beide beworben hatten, sagte er zuerst gar nichts. Später schrieb er eine kurze Nachricht: „Glückwunsch.“ Ohne Ausrufezeichen, ohne ein weiteres Wort. Tarek las in dieser Kürze eine Kränkung und antwortete drei Tage lang nicht. So begann ein Missverständnis, das ihr Verhältnis beinahe beendet hätte, obwohl keiner der beiden etwas Böses wollte.\n\nIn Wahrheit war Rami weder neidisch noch wütend. Er gönnte Tarek den Erfolg von Herzen, aber die eigene Enttäuschung war an diesem Abend einfach größer als seine Zuneigung. Das ist menschlich, und es wäre kein Problem gewesen, hätte er es offen gesagt. Stattdessen schwieg er, und Schweigen lässt sich in jede Richtung deuten. Tarek deutete Ramis Schweigen als Neid; seine Schwester vermutete sogar, Tarek habe Rami betrügen wollen, weil er ihm nichts vom Bewerbungsgespräch erzählt hatte. Aus einem Satz ohne Ausrufezeichen wurden so zwei Verdächtigungen.\n\nDass die beiden heute wieder zusammen Fußball spielen, liegt an einer einzigen Frage. Tarek rief schließlich an und fragte nicht: „Warum bist du so?“, sondern: „Wie geht es dir damit?“ Diese Frage zeigt Mitgefühl; wer sie stellt, muss weder nachgeben noch sich rechtfertigen, und wer sie hört, muss sein Selbstwertgefühl nicht verteidigen. So konnte Rami ehrlich antworten. Gelassenheit heißt eben nicht, nichts zu fühlen; sie heißt, das Gefühl zu benennen, bevor es den anderen enttäuscht."),
  ("ar", "سوء فهم كاد ينهي صداقة: رامي وطارق تنافسا على الوظيفة نفسها فحصل عليها طارق؛ كتب رامي «مبروك» بلا علامة تعجّب فقرأها طارق إهانة وصمت ثلاثة أيام. الحقيقة أن رامي لم يكن حسوداً ولا غاضباً — بل خيبة أمله تلك الليلة فاقت فرحه لصديقه، والصمت يحتمل كل تأويل: طارق رأى فيه حسداً وذهبت أخته أبعد فارتياباً بخيانة لأنه لم يخبره بالمقابلة. أنقذ الموقف سؤال واحد حين اتصل طارق فسأل «كيف تشعر حيال ذلك؟» بدل «ما بك؟» — سؤال يظهر التعاطف دون مطالبة بالتبرير أو الدفاع عن الذات، فأجاب رامي بصدق. السكينة ليست ألا تشعر، بل أن تسمّي الشعور قبل أن يخيّب الآخر."),
  ("questions", [
    Q("t-b2-21", 1, "mc", "Warum antwortete Tarek drei Tage lang nicht?",
      "Er las Ramis kurze Nachricht als Kränkung", "الدليل في النص: «Tarek las in dieser Kürze eine Kränkung und antwortete drei Tage lang nicht».",
      ["Er las Ramis kurze Nachricht als Kränkung", "Er war verreist", "Er hatte die Nachricht nicht gesehen"]),
    Q("t-b2-21", 2, "mc", "Was unterschied die rettende Frage von einer Anklage?",
      "Sie zeigt Mitgefühl, ohne Rechtfertigung zu verlangen", "الدليل في النص: «Diese Frage zeigt Mitgefühl; wer sie stellt, muss weder nachgeben noch sich rechtfertigen».",
      ["Sie zeigt Mitgefühl, ohne Rechtfertigung zu verlangen", "Sie war länger formuliert", "Sie wurde schriftlich gestellt"]),
    Q("t-b2-21", 3, "mc", "Was bedeutet Gelassenheit laut Text?",
      "das eigene Gefühl zu benennen, bevor es den anderen enttäuscht", "الدليل في النص: «sie heißt, das Gefühl zu benennen, bevor es den anderen enttäuscht». ليست غياب الشعور.",
      ["das eigene Gefühl zu benennen, bevor es den anderen enttäuscht", "gar nichts zu fühlen", "jedem Streit auszuweichen"]),
    Q("t-b2-21", 4, "truefalse", "Rami war neidisch auf Tarek und gönnte ihm die Stelle nicht.",
      "falsch", "الدليل في النص: «Er gönnte Tarek den Erfolg von Herzen».",
      ["richtig", "falsch"]),
    Q("t-b2-21", 5, "fill", "Gelassenheit heißt, das ___ zu benennen, bevor es den anderen enttäuscht.",
      "Gefühl", "الدليل في النص: «das Gefühl zu benennen».",
      None),
  ]),
])

E["t-b2-22"] = collections.OrderedDict([
  ("de", "Nach acht Wochen kehrt Frau Lang ins Büro zurück. Im Frühjahr wurde sie am Knie operiert, danach folgten drei Wochen Reha und eine lange Krankschreibung. Die Genesung verlief gut, sagt sie, aber sie hat etwas gelernt, das mit dem Knie wenig zu tun hat: Wie ein Umfeld auf Krankheit reagiert, sagt mehr über das Arbeitsklima aus als jede Umfrage.\n\nIhre Kolleginnen hatten in ihrer Abwesenheit ihre Aufgaben still übernommen. Niemand fragte, wann sie „endlich“ zurückkomme, und niemand legte ihr Berichte auf den Stuhl. Sie schickten ihr nur eine Karte mit guten Wünschen und ein Foto vom ganzen Team. Diese Solidarität war keine Selbstverständlichkeit; in ihrer früheren Firma galt schon eine Erkältung als Schwäche, und wer zur Vorsorge ging, tat das heimlich. Dort war sie, wie sie heute selbst sagt, fast süchtig nach Anerkennung gewesen und hatte jede Pause als verlorene Zeit empfunden.\n\nJetzt dosiert sie die Anstrengung anders. Die Bildschirmarbeit unterbricht sie alle fünfzig Minuten, weil der Physiotherapeut es empfohlen hat, aber auch, weil sie gemerkt hat, dass die Arbeit danach besser wird. Ihr Chef hat dieses Modell inzwischen für das ganze Team übernommen. Ob das die Produktivität steigert, weiß niemand genau. Früher hätte sie in den Pausen schnell E-Mails gelesen; heute geht sie kurz an die frische Luft und spricht mit den anderen. Dass es das Klima verbessert hat, merkt man schon an der Kaffeemaschine, wo die Pausen wieder Gespräche sind und keine verlorene Zeit."),
  ("ar", "عودة السيدة لانغ بعد ثمانية أسابيع (جراحة ركبة وثلاثة أسابيع تأهيل وإجازة مرضية طويلة) ودرسها الأهم لا علاقة له بالركبة: ردّ فعل المحيط على المرض يخبر عن مناخ العمل أكثر من أي استبيان. زميلاتها تولّين مهامها بصمت دون ضغط «متى تعودين أخيراً؟»، خلاف شركتها السابقة حيث كان الزكام ضعفاً والفحص الوقائي سراً، وحيث كانت — كما تعترف — مدمنة على الاعتراف وترى كل استراحة وقتاً ضائعاً. اليوم توزع جهدها: فواصل كل خمسين دقيقة من الشاشة بتوصية المعالج، ولاحظت أن العمل بعدها يتحسّن حتى عمّم مديرها النموذج على الفريق. أثر ذلك في الإنتاجية غير مؤكد، أما أثره في المناخ فيُرى عند آلة القهوة حيث صارت الاستراحات أحاديث لا وقتاً ضائعاً."),
  ("questions", [
    Q("t-b2-22", 1, "mc", "Was hat Frau Lang während ihrer Krankheit vor allem gelernt?",
      "dass die Reaktion des Umfelds auf Krankheit viel über das Arbeitsklima sagt", "الدليل في النص: «Wie ein Umfeld auf Krankheit reagiert, sagt mehr über das Arbeitsklima aus als jede Umfrage».",
      ["dass die Reaktion des Umfelds auf Krankheit viel über das Arbeitsklima sagt", "dass Reha wichtiger ist als Operation", "dass sie den Job wechseln muss"]),
    Q("t-b2-22", 2, "mc", "Wie war ihre frühere Firma laut Text?",
      "Dort galt eine Erkältung als Schwäche und Vorsorge geschah heimlich", "الدليل في النص: «galt schon eine Erkältung als Schwäche, und wer zur Vorsorge ging, tat das heimlich».",
      ["Dort galt eine Erkältung als Schwäche und Vorsorge geschah heimlich", "Dort gab es lange Pausen", "Dort arbeitete niemand gern"]),
    Q("t-b2-22", 3, "mc", "Was hat ihr Chef übernommen?",
      "das Pausenmodell für das ganze Team", "الدليل في النص: «Ihr Chef hat dieses Modell inzwischen für das ganze Team übernommen».",
      ["das Pausenmodell für das ganze Team", "ihre Aufgaben dauerhaft", "die Kosten der Reha"]),
    Q("t-b2-22", 4, "truefalse", "Ihre Kolleginnen übernahmen ihre Aufgaben, ohne ihr Druck zu machen.",
      "richtig", "الدليل في النص: «Ihre Kolleginnen hatten in ihrer Abwesenheit ihre Aufgaben still übernommen» دون أن يسألها أحد متى تعود «أخيراً».",
      ["richtig", "falsch"]),
    Q("t-b2-22", 5, "fill", "Die Bildschirmarbeit unterbricht sie alle ___ Minuten.",
      "fünfzig", "الدليل في النص: «unterbricht sie alle fünfzig Minuten».",
      None),
  ]),
])

E["t-b2-23"] = collections.OrderedDict([
  ("de", "Herr Ben Salem benutzte jahrelang ein einziges Passwort: für das Nutzerkonto beim Online-Händler, für die Cloud mit den Familienfotos und sogar für das Spiel seines Sohnes. Er hielt das für praktisch und sparte sich das Nachdenken. Dann kam eine E-Mail, die er für Spam hielt und löschte, und zwei Tage später war das Konto beim Händler gehackt. Bestellt wurde nichts Teures; die Angreifer wollten offenbar nur prüfen, wo dieses Passwort noch überall passt.\n\nDie Beraterin seiner Bank erklärte ihm, dass Cyberkriminalität selten wie im Film aussieht. Oft verwenden Angreifer gestohlene Zugangsdaten und probieren sie automatisch bei vielen anderen Onlinediensten aus. Ein Chatbot der Bank hätte ihm dieselbe Antwort gegeben, sagte sie lachend, aber ohne Kaffee. Ihre Empfehlungen waren einfach: für jedes Konto ein eigenes, starkes Passwort, die Software regelmäßig aktualisieren und ein Backup auch außerhalb der Cloud aufbewahren.\n\nZu Hause stellte er fest, dass das letzte Update auf seinem Handy ein Jahr alt war, weil der Speicher voll war und der Akku bei jeder Installation schwächelte. Die Nutzungsbedingungen der Cloud hatte er nie gelesen; dort stand auch, wie lange die Datenspeicherung nach einer Kündigung weiterläuft. Unter bestimmten Voraussetzungen kann er nach Artikel siebzehn der DSGVO die Löschung seiner personenbezogenen Daten verlangen. Ob der Anbieter löschen muss, hängt von den gesetzlichen Voraussetzungen und möglichen Ausnahmen ab. Er hat die Löschung beantragt, und die Fotos liegen jetzt zusätzlich auf einer kleinen Festplatte in der Küchenschublade."),
  ("ar", "سنوات وكلمة سر واحدة عند السيد بن سالم لكل شيء (متجر وسحابة صور العائلة وحتى لعبة ابنه) ظنّاً منه أنها عملية، حتى حُذفت رسالة ظنّها مزعجة واختُرق حساب المتجر بعد يومين دون سرقة غالية — كان المهاجمون يجرّبون أين تصلح الكلمة أيضاً. مستشارة البنك بيّنت أن الجريمة السيبرانية نادراً ما تشبه الأفلام: بيانات مسروقة تُجرَّب آلياً على خدمات كثيرة. وصاياها بسيطة: كلمة قوية فريدة لكل حساب، وتحديثات منتظمة، ونسخة احتياطية خارج السحابة أيضاً. في البيت اكتشف أن آخر تحديث لهاتفه عمره عام (ذاكرة ممتلئة وبطارية ضعيفة) وأنه لم يقرأ شروط السحابة قط وفيها مدة بقاء البيانات بعد الإلغاء؛ وبموجب المادة 17 من اللائحة الأوروبية يستطيع بشروط معينة طلب محو بياناته رهناً بالاستثناءات القانونية. طلب المحو، وصوره الآن أيضاً على قرص صغير في درج المطبخ."),
  ("questions", [
    Q("t-b2-23", 1, "mc", "Was wollten die Angreifer laut Text vor allem?",
      "prüfen, wo das gestohlene Passwort noch passt", "الدليل في النص: «die Angreifer wollten offenbar nur prüfen, wo dieses Passwort noch überall passt». لم يسرقوا شيئاً غالياً.",
      ["prüfen, wo das gestohlene Passwort noch passt", "teure Produkte bestellen", "die Familienfotos löschen"]),
    Q("t-b2-23", 2, "mc", "Welche drei Empfehlungen gab die Bankberaterin?",
      "eigene Passwörter, Updates und ein Backup außerhalb der Cloud", "الدليل في النص: «für jedes Konto ein eigenes, starkes Passwort, die Software regelmäßig aktualisieren und ein Backup auch außerhalb der Cloud».",
      ["eigene Passwörter, Updates und ein Backup außerhalb der Cloud", "kein Online-Banking mehr", "nur noch Bargeld benutzen"]),
    Q("t-b2-23", 3, "mc", "Warum war sein Handy nicht aktuell?",
      "Der Speicher war voll und der Akku schwach", "الدليل في النص: «weil der Speicher voll war und der Akku bei jeder Installation schwächelte».",
      ["Der Speicher war voll und der Akku schwach", "Er hatte Updates verboten", "Das Handy war neu"]),
    Q("t-b2-23", 4, "truefalse", "Die Angreifer bestellten teure Produkte auf seine Kosten.",
      "falsch", "الدليل في النص: «Bestellt wurde nichts Teures».",
      ["richtig", "falsch"]),
    Q("t-b2-23", 5, "fill", "Die Fotos liegen jetzt zusätzlich auf einer kleinen ___ in der Küchenschublade.",
      "Festplatte", "الدليل في النص: «auf einer kleinen Festplatte in der Küchenschublade».",
      None),
  ]),
])

E["t-b2-24"] = collections.OrderedDict([
  ("de", "Mona hatte den Studienplatz erst im zweiten Anlauf bekommen; die Zulassung kam per Post, und die Einschreibung musste sie persönlich erledigen. Dann saß sie in der ersten Vorlesung, in einem Hörsaal mit vierhundert Plätzen, und verstand nach zwanzig Minuten kaum noch ein Wort. Nicht wegen der Sprache, sondern wegen des Tempos, in dem die Gedanken aufeinanderfolgten.\n\nSie hatte sich das Studium leichter vorgestellt und war in den ersten Tagen oft unsicher. In der Sprechstunde riet ihr die Dozentin zu etwas, das Mona zunächst kindisch fand: einem Lerntagebuch. Jeden Abend drei Zeilen: Was habe ich verstanden, was nicht, und was mache ich morgen dagegen. Nach zwei Wochen sah Mona ein Muster, das sie überraschte. Ihre größte Ablenkung war nicht das Handy, sondern die ständige Sorge, nicht gut genug zu sein. Diese Sorge kostete sie mehr Zeit und Kraft als jede Nachricht auf dem Bildschirm.\n\nFür den ersten Leistungsnachweis, eine Hausarbeit von zwölf Seiten, plante sie deshalb rückwärts: Abgabe, Korrektur, Rohfassung, Gliederung, Lesen. Zeitmanagement heißt für sie seitdem nicht, mehr zu schaffen, sondern früher anzufangen. Die Arbeit wurde mit einer Zwei benotet, und die Dozentin schrieb darunter, die Gliederung sei ungewöhnlich klar. Bis zur Abschlussarbeit sind es noch Jahre, aber die Karteikarten mit den Fachbegriffen liegen schon jetzt in einer Schachtel neben dem Bett. Ihre Kommilitonen lachen manchmal über diese Schachtel, aber einige haben sich schon Karten von ihr ausgeliehen."),
  ("ar", "منى حصلت على مقعدها الجامعي في المحاولة الثانية، وبعد قبول بالبريد وتسجيل حضوري جلست في أول محاضرة بقاعة من أربعمئة مقعد فكفت عن الفهم بعد عشرين دقيقة — لا بسبب اللغة بل سرعة تتابع الأفكار. نصحتها الأستاذة في ساعة المكتب بمذكرة تعلّم عدّتها أولاً طفولية: ثلاث سطور كل مساء (ما فهمتُه، ما لم أفهمه، وما سأفعل غداً حياله). بعد أسبوعين ظهر نمط فاجأها: أكبر مشتّت ليس الهاتف بل قلق دائم من ألا تكون كافية، وهو قلق يستهلك وقتاً وطاقة أكثر من أي إشعار. خططت لأول بحث من اثنتي عشرة صفحة رجوعاً من التسليم: تسليم فتصحيح فمسودة فمخطط فقراءة؛ فصارت إدارة الوقت عندها أن تبدأ مبكراً لا أن تنجز أكثر. نالت علامة جيدة (2) وأشادت الأستاذة بوضوح مخططها الاستثنائي، وبطاقات المصطلحات تنتظر منذ الآن في علبة بجانب سريرها وإن كانت رسالة التخرج بعد سنوات."),
  ("questions", [
    Q("t-b2-24", 1, "mc", "Warum verstand Mona in der ersten Vorlesung kaum noch etwas?",
      "Wegen des Tempos, nicht wegen der Sprache", "الدليل في النص: «Nicht wegen der Sprache, sondern wegen des Tempos».",
      ["Wegen des Tempos, nicht wegen der Sprache", "Weil sie die Sprache nicht konnte", "Weil der Hörsaal zu laut war"]),
    Q("t-b2-24", 2, "mc", "Was zeigte ihr das Lerntagebuch nach zwei Wochen?",
      "Ihre größte Ablenkung war die Sorge, nicht gut genug zu sein", "الدليل في النص: «Ihre größte Ablenkung war nicht das Handy, sondern die ständige Sorge, nicht gut genug zu sein».",
      ["Ihre größte Ablenkung war die Sorge, nicht gut genug zu sein", "Sie lernte zu wenig Vokabeln", "Sie brauchte mehr Kaffee"]),
    Q("t-b2-24", 3, "mc", "Was bedeutet Zeitmanagement für Mona inzwischen?",
      "nicht mehr zu schaffen, sondern früher anzufangen", "الدليل في النص: «nicht, mehr zu schaffen, sondern früher anzufangen».",
      ["nicht mehr zu schaffen, sondern früher anzufangen", "jede Minute zu verplanen", "nachts zu lernen"]),
    Q("t-b2-24", 4, "truefalse", "Die Dozentin lobte die ungewöhnlich klare Gliederung der Hausarbeit.",
      "richtig", "الدليل في النص: «die Gliederung sei ungewöhnlich klar».",
      ["richtig", "falsch"]),
    Q("t-b2-24", 5, "fill", "Die Hausarbeit wurde mit einer ___ benotet.",
      "Zwei", "الدليل في النص: «wurde mit einer Zwei benotet».",
      None),
  ]),
])

E["t-b2-25"] = collections.OrderedDict([
  ("de", "Das Turnier endete für den kleinen Verein aus dem Stadtteil im Halbfinale mit einem Elfmeter in der letzten Minute. Der Schiedsrichter hatte ein Foul gesehen, das die Hälfte der Zuschauer nicht gesehen hatte. Die andere Hälfte jubelte. So ist das bei einem Wettkampf: Dieselbe Szene, zwei Wahrheiten, und jeder ist von seiner Seite überzeugt. Nach dem Spiel war es auf den Rängen ungewöhnlich still.\n\nInteressanter als die Niederlage war, was danach geschah. Auf der Mitgliederversammlung zwei Wochen später sprach niemand über den Schiedsrichter. Man sprach über das Training. Die Trainerin legte Zahlen vor: drei Zerrungen und zwei Prellungen in einer Saison, fast alle in der zweiten Halbzeit. Diese Zahlen gehören zur Trainingsgeschichte des Vereins; sie sind keine belegte Statistik. Niemand suchte einen Schuldigen; alle suchten eine Erklärung. Ihre Erklärung dafür war unbequem: Das Ausdauertraining sei gut, das Krafttraining schwach, und vor den Spielen dehne sich kaum jemand länger als zwei Minuten.\n\nDer Verein beschloss daraufhin, disziplinierter zu werden, ohne strenger zu sein: zwei feste Einheiten pro Woche, ein Aufwärmplan, den jeder kennt, und ein Notizbuch, in dem jede Spielerin ihre persönliche Bestleistung selbst einträgt. Seit diesem Beschluss verzeichnete der Verein sieben Beitritte. Die meisten neuen Mitglieder waren Eltern, die vorher nur vom Rand aus angefeuert hatten. Ob die Mannschaft nächstes Jahr eine Runde weiterkommt, ist offen. Sicher ist nur, dass sie besser vorbereitet sein wird, ob sie gewinnt oder verliert."),
  ("ar", "خسر فريق حيّ صغير نصف النهائي بركلة جزاء في الدقيقة الأخيرة رأى الحكم فيها خطأ لم يره نصف الجمهور وهلّل له النصف الآخر — مشهد واحد وحقيقتان كما في كل منافسة. الأهم ما حدث بعدها: في جمعية الأعضاء بعد أسبوعين لم يتكلم أحد عن الحكم بل عن التدريب؛ عرضت المدربة أرقاماً (ثلاث شدات عضلية وكدمتان في موسم، معظمها في الشوط الثاني — من سجل الفريق التدريبي لا إحصاء موثّق) وتفسيراً مزعجاً: التحمّل جيد وتمارين القوة ضعيفة وتمدد قبل المباريات بالكاد يتجاوز دقيقتين. قرر النادي انضباطاً دون قسوة: وحدتان ثابتتان أسبوعياً وخطة إحماء يعرفها الجميع ودفتر تسجّل فيه كل لاعبة أفضل أرقامها بنفسها؛ فانضم سبعة أعضاء جدد معظمهم آباء كانوا يشجعون من الخط الجانبي. التأهل العام القادم غير مؤكد، المؤكد أن الفريق سيكون أفضل استعداداً ربح أم خسر."),
  ("questions", [
    Q("t-b2-25", 1, "mc", "Worüber sprach man auf der Mitgliederversammlung?",
      "über das Training, nicht über den Schiedsrichter", "الدليل في النص: «sprach niemand über den Schiedsrichter. Man sprach über das Training».",
      ["über das Training, nicht über den Schiedsrichter", "nur über den Elfmeter", "über neue Trikots"]),
    Q("t-b2-25", 2, "mc", "Warum war die Erklärung der Trainerin unbequem?",
      "Sie zeigte eigene Schwächen: schwaches Krafttraining und zu kurzes Dehnen", "الدليل في النص: «das Krafttraining schwach, und vor den Spielen dehne sich kaum jemand länger als zwei Minuten».",
      ["Sie zeigte eigene Schwächen: schwaches Krafttraining und zu kurzes Dehnen", "Sie beschuldigte den Schiedsrichter", "Sie wollte mehr Geld"]),
    Q("t-b2-25", 3, "mc", "Wer trat dem Verein nach dem Beschluss bei?",
      "vor allem Eltern, die vorher nur zugeschaut hatten", "الدليل في النص: «Die meisten neuen Mitglieder waren Eltern, die vorher nur vom Rand aus angefeuert hatten».",
      ["vor allem Eltern, die vorher nur zugeschaut hatten", "Profispieler aus der Stadt", "die Zuschauer des Finales"]),
    Q("t-b2-25", 4, "truefalse", "Der Verein beschloss, strenger zu werden und härter zu strafen.",
      "falsch", "الدليل في النص: «disziplinierter zu werden, ohne strenger zu sein» — انضباط لا تشدّد.",
      ["richtig", "falsch"]),
    Q("t-b2-25", 5, "fill", "Die Trainerin legte Zahlen vor: drei Zerrungen und zwei ___ in einer Saison.",
      "Prellungen", "الدليل في النص: «drei Zerrungen und zwei Prellungen in einer Saison».",
      None),
  ]),
])

tf_r = tf_g = 0
for tid, e in E.items():
    de, ar, qs = e["de"], e["ar"], e["questions"]
    n = len(de.split())
    assert 220 <= n <= 270, (tid, n)  # تقاطع K70b ‏[220,420] مع نطاق عرض audit_inhalt ‏[173,270]  # تقاطع K70b ‏[220,420] مع نطاق عرض audit_inhalt ‏[173,270]
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
print(f"R157 lang B2 written: +{neu} (file now {len(vorhanden)} entries)")
