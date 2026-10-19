# -*- coding: utf-8 -*-
"""R160: نسخ طويلة (lang) لآخر خمسة نصوص B2 لاحقة (t-b2-36..40) — اكتمال النسخ الطويلة
لكلّ نصّ غير A0. توسعة أمينة لوقائعها مع حفظ التحوّطات الإحصائية وعلامات القصص الخيالية،
ضمن نطاق العرض 220–270 كلمة، نمط 5 أسئلة (3 mc + صواب/خطأ + إكمال). يُنشئ
content/lang/b2-36-40.json (idempotent)."""
import json, os, collections, re

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "content", "lang", "b2-36-40.json")
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

E["t-b2-36"] = collections.OrderedDict([
  ("de", "Eine mögliche Änderung wäre, den Schulbeginn von acht auf neun Uhr zu verlegen. Dafür spricht vor allem, dass viele Jugendliche in der Pubertät abends später einschlafen als jüngere Kinder. Sie sind morgens oft noch müde, was ihre Konzentration und ihr Gedächtnis beeinträchtigen kann. Auch für die psychische Gesundheit kann dauerhafter Schlafmangel problematisch werden. Befürworter meinen deshalb, ein späterer Start könne den Schulalltag besser an den natürlichen Schlafrhythmus vieler Jugendlicher anpassen.\n\nKritiker wenden dagegen ein, dass ein späterer Unterrichtsbeginn viele Eltern vor organisatorische Probleme stellt und mit den Nachmittagsaktivitäten der Jugendlichen kollidieren kann. Wie sich der spätere Beginn auf die schulischen Leistungen auswirkt, sollte man ebenfalls ehrlich prüfen. Busfahrpläne, die Arbeitszeiten der Eltern und die Betreuung jüngerer Geschwister müssten auf jeden Fall berücksichtigt werden. Auch ein späteres Schulende könnte zusätzliche Kosten für Räume und Betreuung verursachen, die jemand tragen muss. Auch die Lehrerinnen und Lehrer müssten ihre Arbeitszeiten neu planen, und manche Familien ihre ganze Woche.\n\nDennoch halte ich einen Modellversuch an einigen Schulen für sinnvoll. Dabei sollte man nicht nur Noten beobachten, sondern auch Schlaf, Wohlbefinden und die Beteiligung im Unterricht. Die Arbeitszeiten des Schulpersonals und die Angebote am Nachmittag müssen ebenfalls in die Planung einbezogen werden. Ein solcher Versuch kostet Geld, aber er liefert endlich Daten statt bloßer Meinungen. Zeigt sich dann, dass Jugendliche ausgeruhter und aufmerksamer sind, sollte man den Schulbeginn insgesamt neu bewerten, statt den frühen Start um jeden Preis als selbstverständlich hinzunehmen."),
  ("ar", "مقال رأي حول تأخير بدء المدرسة من الثامنة إلى التاسعة: يؤيد المقترحَ أن المراهقين في سن البلوغ يخلدون للنوم متأخرين مساءً فيستيقظون متعبين بما يضعف التركيز والذاكرة، وقلة النوم الدائمة قد تضر الصحة النفسية، فيلائم بدء متأخر إيقاع نومهم الطبيعي. يعترض المنتقدون بمشاكل تنظيمية للأهل وتصادم مع أنشطة ما بعد الظهر، ويجب فحص أثره في التحصيل بصدق ومراعاة جداول الحافلات وأوقات عمل الوالدين ورعاية الإخوة الأصغر وكلفة انصراف متأخر من قاعات ورعاية. مع ذلك يرى الكاتب تجربة نموذجية في مدارس مختارة مجدية لا تقيس الدرجات فقط بل النوم والرفاه والمشاركة الصفية وساعات عمل الطاقم وعروض العصر؛ فإن ظهر المراهقون أصفى ذهناً وأكثر انتباهاً وجب إعادة تقييم البدء المبكر بدل اعتباره مسلّمة بأي ثمن."),
  ("questions", [
    Q("t-b2-36", 1, "mc", "Was ist das Hauptargument der Befürworter eines späteren Schulbeginns?",
      "Er passt besser zum Schlafrhythmus vieler Jugendlicher", "الدليل في النص: «ein späterer Start könne den Schulalltag besser an den natürlichen Schlafrhythmus vieler Jugendlicher anpassen».",
      ["Er passt besser zum Schlafrhythmus vieler Jugendlicher", "Die Schulen sparen Geld", "Die Eltern wollen länger schlafen"]),
    Q("t-b2-36", 2, "mc", "Was wenden Kritiker ein?",
      "Organisatorische Probleme für Eltern und Konflikte mit Nachmittagsaktivitäten", "الدليل في النص: «viele Eltern vor organisatorische Probleme stellt» و«mit den Nachmittagsaktivitäten der Jugendlichen kollidieren kann».",
      ["Organisatorische Probleme für Eltern und Konflikte mit Nachmittagsaktivitäten", "Jugendliche lernen morgens am besten", "Die Busse fahren zu früh"]),
    Q("t-b2-36", 3, "mc", "Was sollte ein Modellversuch laut Autor beobachten?",
      "nicht nur Noten, sondern auch Schlaf, Wohlbefinden und Unterrichtsbeteiligung", "الدليل في النص: «nicht nur Noten beobachten, sondern auch Schlaf, Wohlbefinden und die Beteiligung im Unterricht».",
      ["nicht nur Noten, sondern auch Schlaf, Wohlbefinden und Unterrichtsbeteiligung", "nur die Prüfungsergebnisse", "nur die Kosten"]),
    Q("t-b2-36", 4, "truefalse", "Der Autor hält einen Modellversuch an einigen Schulen für sinnvoll.",
      "richtig", "الدليل في النص: «Dennoch halte ich einen Modellversuch an einigen Schulen für sinnvoll».",
      ["richtig", "falsch"]),
    Q("t-b2-36", 5, "fill", "Man sollte nicht nur Noten, sondern auch ___, Wohlbefinden und Unterrichtsbeteiligung beobachten.",
      "Schlaf", "الدليل في النص: «sondern auch Schlaf, Wohlbefinden und die Beteiligung im Unterricht».",
      None),
  ]),
])

E["t-b2-37"] = collections.OrderedDict([
  ("de", "Das folgende Beispiel ist fiktiv. Als ich vor vier Jahren zum ersten Mal nach Deutschland kam, war ich überrascht, wie direkt Kolleginnen, Kollegen und Nachbarn ihre Meinung äußerten. In der Umgebung, aus der ich komme, galt es oft als höflich, Kritik eher indirekt zu formulieren und zunächst länger über alltägliche Dinge zu sprechen. Einige sagten hier ganz offen: „Das funktioniert so nicht“ oder „Da bin ich anderer Meinung“, ohne unfreundlich wirken zu wollen. Anfangs empfand ich diese Direktheit als Ablehnung meiner Person.\n\nSpäter verstand ich: Direkte Kommunikation muss nicht respektlos sein; sie kann sogar Transparenz und Effizienz fördern. Meine eigenen, eher vorsichtigen Formulierungen galten einigen deutschen Kolleginnen und Kollegen dagegen als unklar oder unentschlossen. Diese Erfahrung zeigte mir, dass Kommunikation immer auch kulturell geprägt ist. Missverständnisse werden seltener, wenn man die eigenen Erwartungen reflektiert und die der anderen ernst nimmt, statt sie sofort zu bewerten.\n\nHeute frage ich nach, wenn ich eine Äußerung nicht richtig verstehe, und ich formuliere meine eigene Meinung klarer als früher. So spreche ich Unklarheiten früh an, bevor sie wachsen. Das kostet manchmal etwas Zeit, kann aber Vertrauen im Team schaffen. Für mich bedeutet gute Kommunikation nicht, immer einer Meinung zu sein. Wichtig ist, dass beide Seiten ihre Erwartungen erklären können. Diese fiktive Geschichte ist kein Urteil über alle Menschen eines Landes; sie zeigt nur, wie eine Person ein Missverständnis erlebt und ihre Einschätzung mit der Zeit verändert."),
  ("ar", "قصة خيالية كما يصرّح النص: قبل أربع سنوات فوجئ الراوي عند وصوله إلى ألمانيا بصراحة الزملاء والجيران في إبداء الرأي، إذ في بيئته يُعدّ التلميح اللطيف للنقد وبدء الحديث بأمور يومية من الأدب؛ وسمع عبارات مثل «هذا لا يعمل هكذا» و«رأيي مخالف» دون قصد إساءة فأحسّها أولاً رفضاً لشخصه. لاحقاً فهم أن الاتصال المباشر ليس قلة احترام بالضرورة بل قد يعزز الشفافية والكفاءة، بينما بدت صياغاته الحذرة لبعض الزملاء الألمان غامضة ومترددة. الدرس أن التواصل مشكّل ثقافياً أيضاً، وسوء الفهم يقلّ حين يتأمل المرء توقعاته ويأخذ توقعات الآخر بجدية لا بحكم فوري. اليوم يسأل مستوضحاً حين لا يفهم ويصوغ رأيه أوضح من قبل فيعالج الغموض مبكراً — يكلّف وقتاً أحياناً لكنه يبني ثقة في الفريق؛ فالتواصل الجيد عنده ليس اتفاقاً دائماً بل قدرة الطرفين على شرح توقعاتهما. والقصة بشهادة النص ليست حكماً على جميع أهل بلد بل تتبّع شخص يختبر سوء فهم وتتغير نظرته مع الوقت."),
  ("questions", [
    Q("t-b2-37", 1, "mc", "Was überraschte den Erzähler anfangs in Deutschland?",
      "wie direkt Kollegen und Nachbarn ihre Meinung äußerten", "الدليل في النص: «wie direkt Kolleginnen, Kollegen und Nachbarn ihre Meinung äußerten».",
      ["wie direkt Kollegen und Nachbarn ihre Meinung äußerten", "dass niemand Kritik äußerte", "dass alle sehr leise sprachen"]),
    Q("t-b2-37", 2, "mc", "Wie wirkten seine vorsichtigen Formulierungen auf deutsche Kollegen?",
      "Sie galten einigen als unklar oder unentschlossen", "الدليل في النص: «galten einigen deutschen Kolleginnen und Kollegen dagegen als unklar oder unentschlossen».",
      ["Sie galten einigen als unklar oder unentschlossen", "Sie wirkten besonders höflich", "Sie wurden nicht bemerkt"]),
    Q("t-b2-37", 3, "mc", "Was tut der Erzähler heute anders?",
      "Er fragt nach und formuliert seine Meinung klarer", "الدليل في النص: «Heute frage ich nach» و«formuliere meine eigene Meinung klarer als früher».",
      ["Er fragt nach und formuliert seine Meinung klarer", "Er vermeidet Gespräche", "Er kritisiert nur noch schriftlich"]),
    Q("t-b2-37", 4, "truefalse", "Die Geschichte beweist, dass alle Menschen eines Landes gleich kommunizieren.",
      "falsch", "الدليل في النص: «ist kein Urteil über alle Menschen eines Landes».",
      ["richtig", "falsch"]),
    Q("t-b2-37", 5, "fill", "Direkte Kommunikation muss nicht ___ sein; sie kann Transparenz und Effizienz fördern.",
      "respektlos", "الدليل في النص: «Direkte Kommunikation muss nicht respektlos sein».",
      None),
  ]),
])

E["t-b2-38"] = collections.OrderedDict([
  ("de", "Vier-Tage-Modelle unterscheiden sich in Arbeitszeit, Lohn und Branche; ihre Ergebnisse sind deshalb nur begrenzt auf andere Bereiche übertragbar. In Island blieben laut Alda und Autonomy Produktivität und Dienste trotz kürzerer Arbeitszeit meist stabil oder verbesserten sich sogar; das Wohlbefinden der Beschäftigten stieg deutlich. Im britischen Versuch von zweitausendzweiundzwanzig verkürzten einundsechzig Organisationen ihre Arbeitszeit sechs Monate lang, ohne das Gehalt zu kürzen. Allerdings lieferten nur dreiundzwanzig der Organisationen Umsatzdaten; der nach Größe gewichtete Umsatzdurchschnitt stieg um eins Komma vier Prozent. Das allein beweist noch keine Kausalität.\n\nAn der deutschen Pilotstudie nahmen fünfundvierzig Organisationen teil. Die Beschäftigten berichteten von Verbesserungen ihrer mentalen und körperlichen Gesundheit; auch die Krankheitstage gingen leicht zurück, doch der Unterschied war statistisch nicht signifikant. Die Projekte waren zeitlich begrenzt und unterschiedlich aufgebaut, und manche Ergebnisse beruhen auf Selbstauskünften der Teilnehmenden. Auch die Berichte einzelner Firmen klingen oft besser als die gesammelten Daten aller Beteiligten zusammen. Zudem kann eine Vier-Tage-Woche die Wochenstunden reduzieren oder dieselben Stunden auf weniger Tage verteilen; die Folgen für Mensch und Betrieb unterscheiden sich erheblich. In manchen Branchen müssen Öffnungszeiten und Versorgung trotzdem gesichert bleiben.\n\nEin pauschales Erfolgsurteil für alle Branchen wäre daher unangebracht. Künftige Versuche sollten Arbeitsbelastung, Servicequalität, Leistung und Wohlbefinden über längere Zeiträume erfassen. Die Ziele vereinbart man vorher gemeinsam mit den Beschäftigten, und mögliche Nachteile prüft man danach offen. Erst solche Daten zeigen, ob eine kürzere Arbeitswoche am jeweiligen Arbeitsplatz wirklich fair und tragfähig ist."),
  ("ar", "نماذج الأسبوع من أربعة أيام تختلف في ساعات العمل والأجر والقطاع فنتائجها محدودة القابلية للنقل كما ينبّه النص. في آيسلندا وحسب منظمتَي ألدا وأوتونومي بقيت الإنتاجية والخدمات مستقرة غالباً أو تحسنت رغم قصر الوقت وازداد رفاه العاملين. وفي التجربة البريطانية 2022 قلّصت 61 منظمة ساعاتها ستة أشهر دون خفض الرواتب، لكن 23 منظمة فقط قدمت بيانات إيرادات وارتفع متوسطها المرجّح بالحجم 1.4 بالمئة — وهذا وحده لا يثبت سببية. شاركت في الدراسة التجريبية الألمانية 45 منظمة وأبلغ العاملون عن تحسن في الصحة النفسية والجسدية وتراجعت أيام المرض قليلاً دون دلالة إحصائية. المشاريع محدودة زمنياً ومختلفة البناء وبعض نتائجها معتمد على إفادات ذاتية؛ والأسبوع الرباعي قد يقلّص ساعات الأسبوع أو يوزّع الساعات نفسها على أيام أقل بعواقب مختلفة جداً، وفي قطاعات يجب ضمان أوقات العمل والخدمة. لذلك فإن حكم نجاح شامل لكل القطاعات غير مناسب: المطلوب تجارب أطول تقيس عبء العمل وجودة الخدمة والأداء والرفاه باتفاق مسبق على الأهداف مع العاملين وفحص علني للمساوئ بعدها — عندها فقط تتبين عدالة الأسبوع الأقصر واستدامته في كل مكان عمل."),
  ("questions", [
    Q("t-b2-38", 1, "mc", "Was zeigten die isländischen Erfahrungen laut Text?",
      "Produktivität und Dienste blieben meist stabil oder verbesserten sich", "الدليل في النص: «blieben laut Alda und Autonomy Produktivität und Dienste trotz kürzerer Arbeitszeit meist stabil oder verbesserten sich».",
      ["Produktivität und Dienste blieben meist stabil oder verbesserten sich", "Alle Firmen steigerten ihren Umsatz stark", "Die Dienste wurden schlechter"]),
    Q("t-b2-38", 2, "mc", "Warum beweist der britische Umsatzanstieg keine Kausalität?",
      "Nur 23 von 61 Organisationen lieferten Umsatzdaten", "الدليل في النص: «Allerdings lieferten nur dreiundzwanzig der Organisationen Umsatzdaten». والارتفاع 1.4٪ وحده لا يثبت سببية.",
      ["Nur 23 von 61 Organisationen lieferten Umsatzdaten", "Der Umsatz sank in Wahrheit", "Der Versuch dauerte zu lange"]),
    Q("t-b2-38", 3, "mc", "Was sollen künftige Versuche laut Text tun?",
      "Belastung, Servicequalität, Leistung und Wohlbefinden länger erfassen", "الدليل في النص: «sollten Arbeitsbelastung, Servicequalität, Leistung und Wohlbefinden über längere Zeiträume erfassen».",
      ["Belastung, Servicequalität, Leistung und Wohlbefinden länger erfassen", "nur die Umsätze vergleichen", "sofort alle Branchen umstellen"]),
    Q("t-b2-38", 4, "truefalse", "In der deutschen Pilotstudie gingen die Krankheitstage leicht, aber statistisch signifikant zurück.",
      "falsch", "الدليل في النص: «der Unterschied war statistisch nicht signifikant».",
      ["richtig", "falsch"]),
    Q("t-b2-38", 5, "fill", "Nur dreiundzwanzig von einundsechzig Organisationen lieferten ___.",
      "Umsatzdaten", "الدليل في النص: «lieferten nur dreiundzwanzig der Organisationen Umsatzdaten».",
      None),
  ]),
])

E["t-b2-39"] = collections.OrderedDict([
  ("de", "Manche Familien ziehen aus teuren Großstädten ins Umland oder ganz aufs Land. Die Gründe können hohe Mieten, enge Wohnungen und der Wunsch nach mehr Natur und Ruhe sein. Doch das Landleben passt nicht für alle. Je nach Region fahren öffentliche Verkehrsmittel deutlich seltener; Arztpraxen und Schulen können weit entfernt sein, und kulturelle Angebote wie Theater oder Kinos sind rar. Homeoffice und Videokonferenzen erleichtern manchen Beschäftigten den Umzug erheblich. Das setzt jedoch ausreichend schnelles Internet voraus, das es noch nicht überall gibt.\n\nEin Staat, der freie Wohnortwahl wirklich ermöglichen will, sollte die fehlende Infrastruktur ausbauen. Sonst könnte die sogenannte Stadtflucht ein Privileg höherer Einkommen bleiben, statt eine echte Wahl für alle zu sein. Vor dem Umzug sollten Familien die Entfernung zu ihren Arbeitsplätzen und die verfügbare Kinderbetreuung sorgfältig prüfen. Wer ohne Auto lebt, braucht eine verlässliche Verbindung zur nächsten Stadt. Vereine und gute Nachbarschaftskontakte können Zugezogenen helfen, schnell Anschluss zu finden. Ein ruhiger Wohnort allein löst nicht alle Probleme. Freunde und die Familie in der Stadt besucht man dann seltener, als man vorher gedacht hatte, und mancher Heimweg dauert länger als die alte Fahrt ins Büro.\n\nGemeinden sollten deshalb neben Wohnraum auch Verkehr und öffentliche Angebote von Anfang an mitplanen. Welche Lösungen passen, hängt von den Bedingungen vor Ort ab. Wer ländliche Regionen stärken will, muss die Bedürfnisse der heutigen Bewohner und der neu Zugezogenen gleichermaßen berücksichtigen. Und solche Lösungen sollten regelmäßig überprüft werden, statt einmal beschlossen und dann vergessen zu werden."),
  ("ar", "تنتقل بعض العائلات من مدن كبرى غالية إلى الضواحي أو الريف بحثاً عن إيجارات أقل ومساكن أوسع وطبيعة وهدوء أكثر. لكن حياة الريف لا تلائم الجميع: فحسب المنطقة تندر وسائل النقل العام وتبتعد العيادات والمدارس وتقلّ العروض الثقافية كالمسارح ودور السينما. العمل المنزلي ومؤتمرات الفيديو يسهّلان الانتقال على بعض الموظفين شرط توفر إنترنت سريع بما يكفي وهو غير متاح في كل مكان بعد؛ ودولة تريد حقاً حرية اختيار السكن عليها توسعة البنية التحتية الناقصة وإلا بقي «الهروب من المدينة» امتيازاً لذوي الدخل المرتفع لا خياراً حقيقياً للجميع. قبل الانتقال فلتفحص العائلات المسافة إلى الأعمال وتوفر الرعاية للأطفال، ومن يعيش بلا سيارة يحتاج وصلة موثوقة إلى أقرب مدينة، فيما تساعد الجمعيات وعلاقات الجيرة الوافدين على الاندماج — فالسكن الهادئ وحده لا يحل كل المشاكل. وعلى البلديات أن تخطط للنقل والعروض العامة مع السكن منذ البداية، بحلول تناسب ظروف كل مكان وتراعي سكانه الحاليين والجدد معاً وتُراجَع بانتظام بدل أن تُقرَّ مرة وتُنسى."),
  ("questions", [
    Q("t-b2-39", 1, "mc", "Welche Gründe für den Wegzug aus der Großstadt nennt der Text?",
      "hohe Mieten, enge Wohnungen und der Wunsch nach Natur und Ruhe", "الدليل في النص: «hohe Mieten, enge Wohnungen und der Wunsch nach mehr Natur und Ruhe».",
      ["hohe Mieten, enge Wohnungen und der Wunsch nach Natur und Ruhe", "schlechtes Wetter in der Stadt", "die Nähe zum Arbeitsplatz"]),
    Q("t-b2-39", 2, "mc", "Was setzt der Umzug mit Homeoffice voraus?",
      "ausreichend schnelles Internet", "الدليل في النص: «Das setzt jedoch ausreichend schnelles Internet voraus».",
      ["ausreichend schnelles Internet", "ein eigenes Auto", "ein großes Haus"]),
    Q("t-b2-39", 3, "mc", "Was sollten Gemeinden neben Wohnraum mitplanen?",
      "Verkehr und öffentliche Angebote", "الدليل في النص: «auch Verkehr und öffentliche Angebote von Anfang an mitplanen».",
      ["Verkehr und öffentliche Angebote", "nur neue Straßen", "nur Werbung für die Region"]),
    Q("t-b2-39", 4, "truefalse", "Ein ruhiger Wohnort löst laut Text allein alle Probleme des Landlebens.",
      "falsch", "الدليل في النص: «Ein ruhiger Wohnort allein löst nicht alle Probleme».",
      ["richtig", "falsch"]),
    Q("t-b2-39", 5, "fill", "Sonst könnte Stadtflucht ein ___ höherer Einkommen bleiben.",
      "Privileg", "الدليل في النص: «ein Privileg höherer Einkommen bleiben».",
      None),
  ]),
])

E["t-b2-40"] = collections.OrderedDict([
  ("de", "Lügen gelten vielen Menschen als moralisch verwerflich. Trotzdem sagen Menschen im Alltag manchmal nicht die ganze Wahrheit. Fast jeder kennt eine Situation, in der er selbst nicht ganz ehrlich war und dafür einen Grund hatte, der ihm in dem Moment gut schien. Die Motive dafür unterscheiden sich: Manche Unwahrheiten dienen dem Selbstschutz, etwa um eine Strafe oder eine Blamage zu vermeiden. Andere sollen die Mitmenschen schonen. So kann jemand aus Höflichkeit sagen: „Das Essen hat mir geschmeckt“, obwohl die Person es in Wirklichkeit nicht mochte. Wieder andere Unwahrheiten dienen der Selbstdarstellung: In sozialen Medien stellen manche ihr Leben erfolgreicher oder interessanter dar, als es tatsächlich ist.\n\nProblematisch wird es, wenn Lügen Vertrauen zerstören oder andere bewusst manipulieren. Eine kleine Höflichkeitslüge kann zunächst harmlos erscheinen; erfährt die andere Person später die Wahrheit, kann dieselbe Lüge eine Beziehung jedoch belasten. Manche nennen so etwas Notlüge, andere einfach Feigheit vor einem kurzen, ehrlichen Satz. Entscheidend ist auch, wem eine Aussage nützt und wer durch sie Nachteile hat. Die Grenze zwischen höflichem Schweigen und bewusster Täuschung lässt sich nicht immer leicht ziehen. Ein ehrliches Gespräch kann zunächst unangenehm sein, aber spätere Enttäuschungen verhindern.\n\nEine offene Kommunikationskultur, in der Fehler zugegeben werden dürfen, kann dazu beitragen, unnötige Lügen zu verringern. Sie erleichtert es, Probleme direkt anzusprechen, ohne andere absichtlich zu verletzen. Doch das ist kein Freibrief für jede ungeschminkte Äußerung: Ehrlichkeit braucht Rücksicht und sollte auch daran gemessen werden, ob sie den Beteiligten bei einer Lösung hilft oder nur verletzt."),
  ("ar", "يرى كثيرون الكذب مداناً أخلاقياً ومع ذلك لا يقول الناس في يومهم الحقيقة كاملة أحياناً، لدوافع شتى: بعض الأكاذيب لحماية الذات كتفادي عقوبة أو إحراج، وبعضها لمراعاة مشاعر الآخرين — كأن تقول مجاملةً «أعجبني الطعام» وأنت لم يعجبك — وبعضها لصناعة صورة الذات إذ يعرض أناس حياتهم في وسائل التواصل أنجح وأمتع مما هي. يصبح الأمر مشكلة حين تهدم الأكاذيب الثقة أو تتلاعب بالآخرين عمداً؛ وكذبة المجاملة الصغيرة قد تبدو غير مؤذية أولاً فإذا ظهرت الحقيقة لاحقاً أثقلت العلاقة نفسها. المهم أيضاً لمن تنفع العبارة ومن يتضرر بها، والحد بين الصمت المهذب والخداع المتعمد لا يُرسم دائماً بسهولة، والحديث الصادق قد يزعج حاضراً لكنه يقي خيبات لاحقة. وثقافة تواصل منفتحة يجوز فيها الاعتراف بالأخطاء قد تقلل الأكاذيب غير الضرورية وتيسّر طرح المشاكل مباشرة دون جرح متعمد؛ لكنها ليست رخصة لكل صراحة فجّة: فالصدق يحتاج مراعاة ويُقاس أيضاً بمساعدته الأطراف على حل لا على جرح فقط."),
  ("questions", [
    Q("t-b2-40", 1, "mc", "Welche drei Motive für Unwahrheiten nennt der Text?",
      "Selbstschutz, Schonung anderer und Selbstdarstellung", "الدليل في النص: «dienen dem Selbstschutz» و«sollen die Mitmenschen schonen» و«dienen der Selbstdarstellung».",
      ["Selbstschutz, Schonung anderer und Selbstdarstellung", "Geld, Macht und Ruhm", "Angst, Hunger und Müdigkeit"]),
    Q("t-b2-40", 2, "mc", "Wann werden Lügen laut Text besonders problematisch?",
      "wenn sie Vertrauen zerstören oder andere bewusst manipulieren", "الدليل في النص: «wenn Lügen Vertrauen zerstören oder andere bewusst manipulieren».",
      ["wenn sie Vertrauen zerstören oder andere bewusst manipulieren", "wenn sie klein sind", "wenn sie aus Höflichkeit gesagt werden"]),
    Q("t-b2-40", 3, "mc", "Was kann eine offene Kommunikationskultur bewirken?",
      "Sie kann unnötige Lügen verringern", "الدليل في النص: «kann dazu beitragen, unnötige Lügen zu verringern» — حيث يجوز الاعتراف بالأخطاء.",
      ["Sie kann unnötige Lügen verringern", "Sie macht alle Menschen ehrlich", "Sie verbietet jede Kritik"]),
    Q("t-b2-40", 4, "truefalse", "Eine Höflichkeitslüge kann eine Beziehung belasten, wenn die Wahrheit später herauskommt.",
      "richtig", "الدليل في النص: «erfährt die andere Person später die Wahrheit, kann dieselbe Lüge eine Beziehung jedoch belasten».",
      ["richtig", "falsch"]),
    Q("t-b2-40", 5, "fill", "Manche Unwahrheiten dienen dem ___, etwa um eine Strafe zu vermeiden.",
      "Selbstschutz", "الدليل في النص: «dienen dem Selbstschutz, etwa um eine Strafe oder eine Blamage zu vermeiden».",
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
print(f"R160 lang B2 written: +{neu} (file now {len(vorhanden)} entries)")
