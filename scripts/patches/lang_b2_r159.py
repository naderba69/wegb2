# -*- coding: utf-8 -*-
"""R159: نسخ طويلة (lang) لخمسة نصوص B2 لاحقة ثالثة (t-b2-31..35) — توسعة أمينة لوقائعها
مع حفظ علامات الأمثلة المختَلقة وتحوّطات عدم التعميم، ضمن نطاق العرض 220–270 كلمة،
نمط 5 أسئلة (3 mc + صواب/خطأ + إكمال). يُنشئ content/lang/b2-31-35.json (idempotent)."""
import json, os, collections, re

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "content", "lang", "b2-31-35.json")
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

E["t-b2-31"] = collections.OrderedDict([
  ("de", "Dieses Beispiel ist erfunden. Frau Sahli pendelt seit ihrer Beförderung an Arbeitstagen insgesamt siebzig Kilometer zwischen ihrem Dorf und der Kreisstadt. Um sechs Uhr morgens steht sie im Parkhaus am Bahnhof, abends ist sie meist erst um sieben zurück. Täglich braucht sie etwa drei Stunden für den Weg; verpasst sie in der Kreisstadt den Anschluss, sind es vier. Ihr Mann arbeitet im Dorf, die Kinder gehen dort zur Schule, und das Eigenheim ist längst abbezahlt. Umziehen scheint logisch, doch Arbeit, Schule und das bezahlte Eigenheim binden die Familie fest ans Dorf.\n\nSie prüfte Alternativen, eine nach der anderen: Eine Mitfahrgelegenheit passte nicht zu ihren Arbeitszeiten, der Fernbus fährt zu selten, und ein Nachtzug ist für die kurze Strecke unpraktisch. Das Elektroauto half eine Zeit lang, bis die einzige Ladestation im Ort drei Wochen ausfiel. „Die Verkehrswende wird in der Stadt geplant und auf dem Land ausgehalten“, sagt sie und meint damit ihren eigenen Alltag. Bei Lastenrädern lächelt sie nur müde: Auf ihrem ländlichen Arbeitsweg lösen sie das Anschlussproblem nicht.\n\nIhr Kompromiss ist deshalb kein Umzug: An zwei Tagen arbeitet sie im Homeoffice, an den drei übrigen Tagen fährt sie mit der Bahn. Im Zug arbeitet sie schon; ihr Arbeitgeber zählt diese Zeit gemäß einer Vereinbarung als Arbeitszeit. Auch die Straßensperrung wegen einer neuen Brücke nimmt sie gelassen, weil sie nicht mehr mit dem Auto fahren muss. Ob dieser Kompromiss auf Dauer trägt, weiß sie nicht. Aber auf die Frage „Pendeln oder umziehen?“ hat sie vorerst eine dritte Antwort gefunden."),
  ("ar", "مثال مُختَلق كما ينصّ النص: السيدة صهلي تتنقل منذ ترقيتها سبعين كيلومتراً في أيام العمل بين قريتها ومدينة المقاطعة، ثلاث ساعات يومياً وأربع عند فوات الوصلة. الانتقال يبدو منطقياً لكن زوجها يعمل في القرية وأولادها في مدرستها وبيتهم المملوك مدفوع كاملاً — روابط تبقي العائلة. جرّبت البدائل: مشاركة سيارة لا تناسب أوقاتها، وحافلة بعيدة نادرة، وقطار ليلي غير عملي لمسافة قصيرة، وسيارة كهربائية ساعدت حتى تعطّلت محطة الشحن الوحيدة ثلاثة أسابيع؛ تقول إن التحوّل المروري يُخطَّط في المدينة ويُتحمَّل في الريف، وتبتسم بتعب عند ذكر دراجات الشحن فمشكلة الوصلات لا تحلّها. حلّها الوسط لا انتقال: يومان عمل منزلي وثلاثة أيام بالقطار تعمل فيهما أثناء الرحلة ويحتسبها ربّ عملها وقتَ عمل بالاتفاق، وإغلاق الطريق لجسر جديد لا يقلقها لتركها السيارة؛ لا تدري إن صمد الحل طويلاً، لكن سؤال «تنقّل أم انتقال؟» وجد عندها جواباً ثالثاً مؤقتاً."),
  ("questions", [
    Q("t-b2-31", 1, "mc", "Warum zieht Frau Sahli nicht in die Kreisstadt um?",
      "Arbeit des Mannes, Schule der Kinder und das abgezahlte Eigenheim binden die Familie ans Dorf", "الدليل في النص: «Arbeit, Schule und das bezahlte Eigenheim binden die Familie fest ans Dorf».",
      ["Arbeit des Mannes, Schule der Kinder und das abgezahlte Eigenheim binden die Familie ans Dorf", "Sie findet keine Wohnung", "Die Bahn ist schneller als der Umzug"]),
    Q("t-b2-31", 2, "mc", "Welche Alternative scheiterte an der Infrastruktur?",
      "das Elektroauto, als die einzige Ladestation drei Wochen ausfiel", "الدليل في النص: «bis die einzige Ladestation im Ort drei Wochen ausfiel».",
      ["das Elektroauto, als die einzige Ladestation drei Wochen ausfiel", "die Mitfahrgelegenheit wegen der Arbeitszeiten", "der Nachtzug wegen der kurzen Strecke"]),
    Q("t-b2-31", 3, "mc", "Was zählt ihr Arbeitgeber als Arbeitszeit?",
      "die Arbeitszeit im Zug, gemäß einer Vereinbarung", "الدليل في النص: «ihr Arbeitgeber zählt diese Zeit gemäß einer Vereinbarung als Arbeitszeit».",
      ["die Arbeitszeit im Zug, gemäß einer Vereinbarung", "auch die Autofahrt", "die Zeit im Stau"]),
    Q("t-b2-31", 4, "truefalse", "Am Ende entscheidet sie sich doch für den Umzug in die Kreisstadt.",
      "falsch", "الدليل في النص: «Ihr Kompromiss ist deshalb kein Umzug».",
      ["richtig", "falsch"]),
    Q("t-b2-31", 5, "fill", "An zwei Tagen arbeitet sie im ___, an den übrigen fährt sie mit der Bahn.",
      "Homeoffice", "الدليل في النص: «An zwei Tagen arbeitet sie im Homeoffice».",
      None),
  ]),
])

E["t-b2-32"] = collections.OrderedDict([
  ("de", "Dieses Beispiel ist erfunden. Meine Nichte ist sechzehn und braucht morgens etwa vierzig Minuten fürs Make-up, das aussehen soll, als trüge sie keines. Als ich sie fragte, für wen sie sich so zurechtmache, antwortete sie offener, als ich erwartet hatte: „Fürs Selfie. Ohne Filter geht das nicht mehr.“ Sie orientiert sich an einem Schönheitsideal, das sie vor allem auf Bildschirmen sieht. Viele dieser Bilder sind retuschiert; sie weiß das genau, doch es verändert ihren Blick auf sich selbst nicht.\n\nIch wollte ihr Eitelkeit vorwerfen, ließ es aber. Eitelkeit ist alt; neu ist vor allem die Reichweite des Vergleichs. Früher verglich man sich vielleicht mit den Mitschülerinnen, heute vergleicht man sich mit Bildern unzähliger Unbekannter. Manches modische Outfit wird von einem Label gesponsert, ein ganzes Styling-Team gestaltet den Look. Was künstlich gemacht ist, kann am Bildschirm völlig natürlich aussehen; ein unretuschiertes Gesicht erscheint daneben fast unfertig. Das ist eine Beobachtung aus dieser Geschichte, keine Aussage über alle Jugendlichen.\n\nWir probierten es eine Woche lang anders: Sie postete stilvolle Bilder ganz ohne digitale Retusche. Die Likes sanken, aber die Nachrichten von Freundinnen wurden mehr. „Du siehst aus wie du“, schrieb eine von ihnen. Das Experiment belegt weder die Ursache dieser Reaktionen noch eine langfristige Veränderung ihres Selbstbewusstseins. „Attraktiv“ sei vielleicht ein Wort für Bilder, sagt sie jetzt; für Menschen brauche man ein anderes Wort."),
  ("ar", "مثال مُختَلق: ابنة أخت الراوية في السادسة عشرة تحتاج أربعين دقيقة صباحاً لمكياج يبدو كأنه غير موجود — «من أجل السيلفي، وبلا مرشّح لا يعود ممكناً». مثلها الأعلى للجمال يأتي من الشاشات ومعظم الصور ملمّسة برامجياً؛ تعرف ذلك ولا يتغير نظرها إلى نفسها. كادت الراوية تتهمها بالغرور ثم أمسكت: الغرور قديم، الجديد مدى المقارنة — أمس زميلات الصف واليوم صور غرباء لا يُحصون، وبعض الأزياء برعاية علامات وفريق تجميل كامل، فيبدو المصنوع طبيعياً على الشاشة والوجه غير الملمّس ناقصاً — ملاحظة من هذه القصة لا حكم على كل المراهقين كما ينبّه النص. جرّبتا أسبوعاً صوراً أنيقة دون أي تلميس رقمي: قلّت الإعجابات وكثرت رسائل الصديقات («تبدين كما أنتِ»). لا يثبت التجريب سبب ردود الفعل ولا تغييراً طويل الأمد في ثقتها بنفسها؛ «جذّابة» ربما كلمة للصور، أما البشر فيحتاجون كلمة أخرى، كما تقول الآن."),
  ("questions", [
    Q("t-b2-32", 1, "mc", "Was ist laut Text an der heutigen Situation vor allem neu?",
      "die Reichweite des Vergleichs mit unzähligen Unbekannten", "الدليل في النص: «neu ist vor allem die Reichweite des Vergleichs». الغرور نفسه قديم.",
      ["die Reichweite des Vergleichs mit unzähligen Unbekannten", "die Eitelkeit selbst", "das Make-up"]),
    Q("t-b2-32", 2, "mc", "Was geschah in der Woche ohne Retusche?",
      "Die Likes sanken, aber Freundinnen schrieben mehr Nachrichten", "الدليل في النص: «Die Likes sanken, aber die Nachrichten von Freundinnen wurden mehr».",
      ["Die Likes sanken, aber Freundinnen schrieben mehr Nachrichten", "Alle fanden die Bilder hässlich", "Sie bekam mehr Likes als vorher"]),
    Q("t-b2-32", 3, "mc", "Woran orientiert sich die Nichte bei ihrem Aussehen?",
      "an einem Schönheitsideal, das sie auf Bildschirmen sieht", "الدليل في النص: «Sie orientiert sich an einem Schönheitsideal, das sie vor allem auf Bildschirmen sieht».",
      ["an einem Schönheitsideal, das sie auf Bildschirmen sieht", "an ihren Mitschülerinnen allein", "an ihrer Tante"]),
    Q("t-b2-32", 4, "truefalse", "Viele Bilder auf den Bildschirmen sind retuschiert, und die Nichte weiß das.",
      "richtig", "الدليل في النص: «Viele dieser Bilder sind retuschiert; sie weiß das genau».",
      ["richtig", "falsch"]),
    Q("t-b2-32", 5, "fill", "„Fürs Selfie. Ohne ___ geht das nicht mehr.“",
      "Filter", "الدليل في النص: «Ohne Filter geht das nicht mehr».",
      None),
  ]),
])

E["t-b2-33"] = collections.OrderedDict([
  ("de", "Dieses Beispiel ist erfunden. Als Karim dem Verein beigetreten war, wollte er vor allem Fußball spielen. Fünf Jahre später gehörten zu seiner Freizeitgestaltung auch eine Radtour, Camping am See und ein Mountainbike-Wochenende. Jedes Jahr stand er am Rand des Marathons, um die Teilnehmenden anzufeuern; selbst lief er nie mit. Die vielen Unternehmungen der Gruppe füllten seinen Kalender vollständig; der Verein war für ihn längst mehr als ein Wettbewerb.\n\nIm Pokal stand es nach der regulären Spielzeit unentschieden. Während der Verlängerung erkannte der Schiedsrichter ein Tor wegen einer Abseitsstellung nicht an; er hatte Abseits gepfiffen. Auf der Wiederholungsaufnahme war die Position für Karim nicht eindeutig zu erkennen. Auch nach der Verlängerung blieb es unentschieden, sodass ein Elfmeterschießen folgte. Die Halle war ausverkauft, und die Übertragung lief in zwei Kneipen. Ben, sein bester Freund im Team, beleidigte den Schiedsrichter lautstark; viele in der Halle hörten es.\n\nDer Vorstand verlangte daraufhin eine Entschuldigung von Ben. Ben weigerte sich und erklärte seinen Austritt aus dem Verein. Karim fragte sich, ob er mit seinem Freund austreten oder den Regeln des Vereins treu bleiben sollte. Er blieb — nicht, weil der Schiedsrichter sicher recht hatte, sondern weil ein Verein ohne Regeln nur noch eine Gruppe mit derselben Farbe wäre. Trotzdem wollen Ben und Karim im Mai gemeinsam Rad fahren. Auf dieser Tour gibt es wenigstens keine Schiedsrichter."),
  ("ar", "مثال مُختَلق: انضم كريم للنادي ليلعب كرة القدم فقط، وبعد خمس سنوات صارت أوقات فراغه جولات دراجات وتخييماً على بحيرة وعطلات دراجات جبلية وحضوراً سنوياً على حافة الماراثون مشجعاً دون أن يركض مرة، وملأت أنشطة المجموعة تقويمه — النادي عنده أكثر من منافسة. في الكأس تعادل الفريقان في الوقت الأصلي، وفي التمديد ألغى الحكم هدفاً بداعي التسلل بدت إعادته لكريم غير حاسمة، واستمر التعادل إلى ركلات الترجيح في قاعة ممتلئة وبثٍّ في حانتين، فشتم بن — صديقه الأقرب — الحكم بصوت عالٍ سمعه كثيرون. طلب المجلس اعتذاراً فرفض بن وأعلن انسحابه؛ تردد كريم بين اللحاق بصديقه والوفاء لقواعد النادي، فبقي لا لتيقنه من صحة الحكم بل لأن نادياً بلا قواعد يصير مجرد مجموعة بلون واحد. ورغم ذلك سيقودان الدراجة معاً في أيار — جولة لا حكام فيها على الأقل."),
  ("questions", [
    Q("t-b2-33", 1, "mc", "Warum bleibt Karim am Ende im Verein?",
      "Weil ein Verein ohne Regeln nur eine Gruppe mit derselben Farbe wäre", "الدليل في النص: «weil ein Verein ohne Regeln nur noch eine Gruppe mit derselben Farbe wäre». لا لتيقّنه من قرار الحكم.",
      ["Weil ein Verein ohne Regeln nur eine Gruppe mit derselben Farbe wäre", "Weil der Schiedsrichter sicher recht hatte", "Weil Ben auch bleibt"]),
    Q("t-b2-33", 2, "mc", "Was tat Ben nach dem Spiel?",
      "Er beleidigte den Schiedsrichter und verweigerte die Entschuldigung", "الدليل في النص: «beleidigte den Schiedsrichter lautstark» و«Ben weigerte sich» أمام طلب الاعتذار.",
      ["Er beleidigte den Schiedsrichter und verweigerte die Entschuldigung", "Er entschuldigte sich sofort", "Er wurde Torschütze"]),
    Q("t-b2-33", 3, "mc", "Was füllte Karims Kalender nach fünf Jahren?",
      "die vielen Unternehmungen der Gruppe", "الدليل في النص: «Die vielen Unternehmungen der Gruppe füllten seinen Kalender vollständig».",
      ["die vielen Unternehmungen der Gruppe", "nur das Fußballtraining", "seine Arbeit"]),
    Q("t-b2-33", 4, "truefalse", "Karim bleibt im Verein, obwohl er bei der Abseitsentscheidung unsicher ist.",
      "richtig", "الدليل في النص: «nicht, weil der Schiedsrichter sicher recht hatte» — بقي لسبب القواعد رغم شكّه.",
      ["richtig", "falsch"]),
    Q("t-b2-33", 5, "fill", "Ein Verein ohne ___ wäre nur noch eine Gruppe mit derselben Farbe.",
      "Regeln", "الدليل في النص: «ein Verein ohne Regeln».",
      None),
  ]),
])

E["t-b2-34"] = collections.OrderedDict([
  ("de", "Dieses Unterrichtsbeispiel ist erfunden. Eine zehnte Klasse liest dieselbe Nachricht in drei Fassungen: als kurze Agenturmeldung, als Leitartikel einer Zeitung und als Clickbait-Beitrag mit zugespitzter Überschrift. Die Schülerinnen und Schüler beschreiben, was jede Version bei den Lesenden bewirkt, statt vorschnell zu entscheiden, wer recht hat.\n\nDie Zuspitzung in der Überschrift und die Untertreibung im Nebensatz erkennen sie rasch. Schwieriger ist das Framing zu durchschauen: Derselbe Zahlenwert kann mit einem kleinen „nur“ heruntergespielt oder mit einem „schon“ als beachtlich gerahmt werden. Noch schwieriger ist die Frage, weshalb gerade dieses Thema überhaupt erscheint. Die Auswahl beeinflusst mit, welche Themen öffentlich als wichtig gelten; genau das nennt man Agenda-Setting. Auch Leitmedien müssen auswählen. Ein Schüler sagt „Echokammer“, eine Mitschülerin findet das pauschal. Die Filterblase selbst sei nicht das Problem, meint sie, sondern das Wohlgefühl darin.\n\nIn dieser Unterrichtsreihe kommt der Faktencheck zuletzt, nicht zuerst. Der Begriff „Fake News“ ist ungenau; Desinformation muss nicht vollständig erfunden sein. Auch richtige Zahlen können durch Auswahl oder fehlenden Kontext in die Irre führen. Deshalb übt die Klasse Quellenkritik: Wer schreibt, wer bezahlt, welche Belege gibt es, und wem nützt der Beitrag? Eine starke Polarisierung der Sprache kann ein Warnsignal sein, aber noch kein Beweis für Meinungsmache. Die Aufmerksamkeitsökonomie kann Reichweite belohnen, doch hohe Reichweite belegt keine Wahrheit. Den wichtigsten Satz hängt die Klasse am Ende selbst an die Wand."),
  ("ar", "مثال دراسي مُختَلق: صف عاشر يقرأ الخبر نفسه بثلاث صيغ — برقية وكالة ومقال رأي ومنشور إثارة بعنوان مبالغ — ويصف أثر كل صيغة في القارئ بدل الحكم المتعجل على الصواب. يميزون سريعاً مبالغة العنوان وتهوين الجمل الثانوية، وأصعب منها التأطير: الرقم نفسه يُصغَّر بـ«فقط» ويُعظَّم بـ«بات». والأصعب سؤال لماذا يظهر هذا الموضوع أصلاً: الاختيار يشارك في تحديد ما يُعدّ مهماً علناً وهو ما يسمى وضع الأجندة، وحتى وسائل الإعلام الرائدة مضطرة للاختيار؛ طالب يقول «غرفة صدى» وزميلة تراه تعميماً — ففقاعة الترشيح ليست هي المشكلة بل الارتياح داخلها. في هذا التسلسل يأتي تدقيق الوقائع آخراً لا أولاً، ومصطلح «أخبار كاذبة» غير دقيق فالتضليل لا يلزم أن يكون مختلقاً بالكامل وقد تضلل أرقام صحيحة بانتقائها أو انتزاع سياقها. يتدربون على نقد المصادر: من كتب ومن موّل وما الأدلة ولمن النفع؟ واستقطاب اللغة الشديد علامة تحذير لا برهان على توجيه للرأي، واقتصاد الانتباه قد يكافئ الانتشار لكن الانتشار العالي لا يثبت الحقيقة — والجملة الأهم علّقتها الصفية بنفسها على الجدار."),
  ("questions", [
    Q("t-b2-34", 1, "mc", "Was tun die Schüler mit den drei Fassungen der Nachricht?",
      "Sie beschreiben ihre Wirkung, statt zu entscheiden, wer recht hat", "الدليل في النص: «beschreiben, was jede Version bei den Lesenden bewirkt, statt vorschnell zu entscheiden, wer recht hat».",
      ["Sie beschreiben ihre Wirkung, statt zu entscheiden, wer recht hat", "Sie stimmen ab, welche wahr ist", "Sie schreiben eine vierte Fassung"]),
    Q("t-b2-34", 2, "mc", "Welches Beispiel für Framing nennt der Text?",
      "Derselbe Zahlenwert wird mit „nur“ verkleinert oder mit „schon“ vergrößert", "الدليل في النص: «kann mit einem kleinen „nur“ heruntergespielt oder mit einem „schon“ als beachtlich gerahmt werden».",
      ["Derselbe Zahlenwert wird mit „nur“ verkleinert oder mit „schon“ vergrößert", "Fotos werden ausgetauscht", "Die Überschrift wird gelöscht"]),
    Q("t-b2-34", 3, "mc", "Welche Fragen gehören zur geübten Quellenkritik?",
      "Wer schreibt, wer bezahlt, welche Belege gibt es, wem nützt es", "الدليل في النص: «Wer schreibt, wer bezahlt, welche Belege gibt es, und wem nützt der Beitrag?».",
      ["Wer schreibt, wer bezahlt, welche Belege gibt es, wem nützt es", "Wie lang ist der Text und wie viele Bilder hat er", "Wer hat die meisten Follower"]),
    Q("t-b2-34", 4, "truefalse", "In der Unterrichtsreihe steht der Faktencheck an erster Stelle.",
      "falsch", "الدليل في النص: «kommt der Faktencheck zuletzt, nicht zuerst».",
      ["richtig", "falsch"]),
    Q("t-b2-34", 5, "fill", "Welche Themen öffentlich als wichtig gelten, beeinflusst die Auswahl mit; das nennt man ___.",
      "Agenda-Setting", "الدليل في النص: «genau das nennt man Agenda-Setting».",
      None),
  ]),
])

E["t-b2-35"] = collections.OrderedDict([
  ("de", "Dieses Beispiel ist erfunden. Als Leila zu promovieren begann, hatte sie einen Karteikasten voller Fachbegriffe und für jeden Begriff eine Eselsbrücke. Drei Jahre später leitete sie ein Forschungsprojekt und erhielt eine Förderung für zwei Stellen. Ihre wichtigste Erkenntnis aus dieser Zeit: Zur Wissenschaft gehören neben dem Wissen auch Fristen, Anträge und Absprachen, die man einhalten muss.\n\nIhr fiktives Projekt untersucht, wie Studentinnen und Studenten mit knapp ausreichender Abiturnote in einem Fach mit Numerus clausus lernen. Sie wollte verstehen, warum manche trotz schwacher Note durchhalten und andere aufgeben. Leila befragte zweihundert Personen an drei Fakultäten und begleitete eine Gruppe auf einer Exkursion. Dabei beobachtete sie, wie sich Kenntnisse auch außerhalb des Hörsaals zeigten. In der Auswertung dieser Beispielstudie zählte neben der Effizienz auch eine Person, die Anfängerfragen ernst nahm und geduldig beantwortete. Das gilt für diese erfundene Stichprobe, nicht allgemein. Leila sagt: „Allein kann man effizient lernen; manches versteht man erst im Austausch.“\n\nDie Veröffentlichung dauerte länger als die Studie selbst. Zwei Gutachter wollten mehr Zahlen, ein dritter weniger Deutung. Leila zitiert gern ihre Betreuerin: „Nachhaltigkeit in der Forschung heißt, dass jemand in zehn Jahren noch etwas mit deinen Daten anfangen kann.“ Fragebogen, Anleitung und — soweit Einwilligungen und Datenschutzbestimmungen es zulassen — anonymisierte Auswertungen liegen im Hochschularchiv. Personenbezogene Rohdaten werden dort nicht öffentlich bereitgestellt. Den alten Karteikasten wirft sie trotzdem nicht weg."),
  ("ar", "مثال مُختَلق: بدأت ليلى الدكتوراه بصندوق بطاقات مليء بالمصطلحات وحيلة ذاكرة لكل مصطلح، وبعد ثلاث سنوات قادت مشروعاً بحثياً بتمويل لوظيفتين، وأهم ما تعلمته أن العلم ليس معرفة فقط بل آجالاً وطلبات واتفاقات يجب الوفاء بها. مشروعها المتخيَّل يدرس كيف يتعلم طلبة نجحوا بالكاد في الثانوية في تخصص ذي قبول محدود: استطلعت مئتي شخص في ثلاث كليات ورافقت مجموعة في رحلة علمية ولاحظت كيف تظهر المعرفة خارج قاعة المحاضرات؛ وفي تحليل هذه الدراسة المثال لم تكن الكفاءة وحدها ما يُحتسب بل وجود شخص يأخذ أسئلة المبتدئين بجدية — وهذا يسري على هذه العيّنة المختلقة لا عموماً كما ينبّه النص. تقول: «وحدك قد تتعلم بكفاءة، لكن بعض الأشياء لا تُفهم إلا في التبادل». استغرق النشر أطول من الدراسة نفسها: محكّمان طلبا أرقاماً أكثر وثالث تفسيراً أقل. وتستشهد بمشرفتها: استدامة البحث أن يستطيع أحد بعد عشر سنوات الانتفاع ببياناتك؛ فالاستبيان والدليل والتقييمات مجهّلة الهوية (بقدر ما تسمح الموافقات وقواعد حماية البيانات) محفوظة في أرشيف الجامعة، أما البيانات الخام الشخصية فلا تُنشر علناً — وصندوق بطاقاتها القديم لا ترميه رغم ذلك."),
  ("questions", [
    Q("t-b2-35", 1, "mc", "Was war Leilas wichtigste Erkenntnis?",
      "Zur Wissenschaft gehören auch Fristen, Anträge und Absprachen", "الدليل في النص: «gehören neben dem Wissen auch Fristen, Anträge und Absprachen, die man einhalten muss».",
      ["Zur Wissenschaft gehören auch Fristen, Anträge und Absprachen", "Man braucht nur Fachbegriffe", "Förderung ist unwichtig"]),
    Q("t-b2-35", 2, "mc", "Was zählte in der Auswertung der Beispielstudie neben der Effizienz?",
      "eine Person, die Anfängerfragen ernst nahm", "الدليل في النص: «zählte neben der Effizienz auch eine Person, die Anfängerfragen ernst nahm». ويسري على العيّنة المختلقة فقط.",
      ["eine Person, die Anfängerfragen ernst nahm", "nur die schnellsten Antworten", "die Zahl der Veröffentlichungen"]),
    Q("t-b2-35", 3, "mc", "Was bedeutet Nachhaltigkeit in der Forschung laut ihrer Betreuerin?",
      "dass jemand in zehn Jahren noch etwas mit den Daten anfangen kann", "الدليل في النص: «dass jemand in zehn Jahren noch etwas mit deinen Daten anfangen kann».",
      ["dass jemand in zehn Jahren noch etwas mit den Daten anfangen kann", "dass man schnell publiziert", "dass Daten gelöscht werden"]),
    Q("t-b2-35", 4, "truefalse", "Die personenbezogenen Rohdaten sind im Hochschularchiv öffentlich zugänglich.",
      "falsch", "الدليل في النص: «Personenbezogene Rohdaten werden dort nicht öffentlich bereitgestellt».",
      ["richtig", "falsch"]),
    Q("t-b2-35", 5, "fill", "Für jeden Fachbegriff hatte Leila eine ___ im Karteikasten.",
      "Eselsbrücke", "الدليل في النص: «für jeden Begriff eine Eselsbrücke».",
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
print(f"R159 lang B2 written: +{neu} (file now {len(vorhanden)} entries)")
