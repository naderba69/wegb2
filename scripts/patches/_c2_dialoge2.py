# -*- coding: utf-8 -*-
"""R178 (C2): Vertiefungs-Dialoge Teil B (vf-d4..d6)."""
from _c2_dialoge import dial

DIALOGE_B = []

DIALOGE_B.append(dial("vf-d4", "Beim Projektstart: Erwartungen klären", "في انطلاق مشروع: توضيح التوقعات",
[
 {"who": "Projektleiterin", "de": "Willkommen zur Kick-off-Runde. Bevor wir Termine verteilen, sollten wir klären, was am Ende konkret vorliegen muss.", "ar": "مرحبًا بكم في اجتماع الانطلاق. قبل أن نوزّع المواعيد، ينبغي أن نوضّح ما الذي يجب أن يكون جاهزًا في النهاية بشكل ملموس."},
 {"who": "Entwickler", "de": "Aus technischer Sicht brauchen wir zuerst eine stabile Testumgebung. Ohne die können wir keine belastbaren Aussagen machen.", "ar": "من الناحية التقنية نحتاج أولًا إلى بيئة اختبار مستقرة. بدونها لا يمكننا إعطاء بيانات موثوقة."},
 {"who": "Vertrieb", "de": "Die Kunden erwarten allerdings schon im März eine erste Demo. Lässt sich das irgendwie darstellen?", "ar": "غير أن العملاء يتوقعون عرضًا أوليًا في مارس بالفعل. هل يمكن تحقيق ذلك بشكل ما؟"},
 {"who": "Projektleiterin", "de": "Eine Demo mit Beispieldaten wäre machbar, solange wir ehrlich kennzeichnen, was noch fehlt.", "ar": "عرض ببيانات تجريبية سيكون ممكنًا، بشرط أن نشير بصدق إلى ما ينقص بعد."},
 {"who": "Entwickler", "de": "Damit kann ich leben. Wichtig ist mir nur, dass wir keine Funktionen versprechen, die noch nicht einmal konzipiert sind.", "ar": "يمكنني القبول بذلك. المهم لي فقط ألا نعد بوظائف لم تُصمَّم أصلًا بعد."},
 {"who": "Vertrieb", "de": "Verstanden. Ich formuliere es gegenüber den Kunden als Ausblick, nicht als Zusage.", "ar": "مفهوم. سأصيغه أمام العملاء كتطلّع مستقبلي، لا كوعد."},
 {"who": "Projektleiterin", "de": "Genau so. Und damit wir gar nicht erst aneinander vorbeireden: Wir treffen uns ab sofort jeden Montag für fünfzehn Minuten, kurz und ohne Präsentationen.", "ar": "تمامًا هكذا. وحتى لا نتحدث دون أن يسمع بعضنا بعضًا أصلًا: سنلتقي من الآن كل اثنين لمدة خمس عشرة دقيقة، بشكل قصير وبلا عروض تقديمية."},
 {"who": "Entwickler", "de": "Einverstanden. Wer dokumentiert die Entscheidungen?", "ar": "اتفقنا. من يوثّق القرارات؟"},
 {"who": "Projektleiterin", "de": "Ich führe ein fortlaufendes Protokoll, das für alle einsehbar ist. Widersprüche bitte sofort ansprechen, nicht erst bei der Abnahme.", "ar": "سأحتفظ بمحضر مستمر متاح للجميع للاطّلاع. الاعتراضات من فضلكم فورًا، لا عند التسليم أولًا."},
 {"who": "Vertrieb", "de": "Gut. Dann fasse ich die Kundenzusagen bis Mittwoch zusammen und stimme sie hier noch einmal ab.", "ar": "جيد. إذن سألخّص وعود العملاء حتى الأربعاء وأنسّقها هنا مرة أخرى."},
 {"who": "Projektleiterin", "de": "Perfekt. Wenn wir so arbeiten, sehe ich dem März-Termin gelassen entgegen.", "ar": "ممتاز. إذا عملنا بهذا الشكل، فإني أنظر إلى موعد مارس بهدوء."}],
[
 {"id": "vf-d4-q1", "promptDe": "Was braucht die Technik zuerst?", "promptAr": "ما الذي تحتاجه التقنية أولًا؟",
  "options": ["Mehr Kunden", "Eine stabile Testumgebung", "Neue Büros", "Eine Demo"], "answer": "Eine stabile Testumgebung",
  "explanationAr": "يقول: «brauchen wir zuerst eine stabile Testumgebung»."},
 {"id": "vf-d4-q2", "promptDe": "Unter welcher Bedingung ist die März-Demo machbar?", "promptAr": "بأي شرط يكون عرض مارس ممكنًا؟",
  "options": ["Wenn ehrlich gekennzeichnet wird, was noch fehlt", "Wenn alle Überstunden machen", "Wenn Kunden weniger erwarten", "Gar nicht"], "answer": "Wenn ehrlich gekennzeichnet wird, was noch fehlt",
  "explanationAr": "تقول: «solange wir ehrlich kennzeichnen, was noch fehlt»."},
 {"id": "vf-d4-q3", "promptDe": "Was wird zum wöchentlichen Ritual?", "promptAr": "ما الذي يصبح طقسًا أسبوعيًا؟",
  "options": ["Lange Präsentationen", "Fünfzehn Minuten Treffen jeden Montag ohne Präsentationen", "Kundenbesuche", "Protokolle am Freitag"], "answer": "Fünfzehn Minuten Treffen jeden Montag ohne Präsentationen",
  "explanationAr": "تقول: «jeden Montag für fünfzehn Minuten, kurz und ohne Präsentationen»."}]))

DIALOGE_B.append(dial("vf-d5", "Beratungsgespräch: Umschulung mit Mitte vierzig", "حديث استشاري: إعادة تأهيل في منتصف الأربعينيات",
[
 {"who": "Beraterin", "de": "Guten Tag, Herr Krüger. Sie überlegen, sich beruflich noch einmal neu zu orientieren. Erzählen Sie mir gern mehr.", "ar": "نهارك سعيد، سيد كروغر. أنت تفكّر في إعادة توجيه نفسك مهنيًا من جديد. حدّثني أكثر من فضلك."},
 {"who": "Herr Krüger", "de": "Ich bin seit zwanzig Jahren Lagerleiter. Die Arbeit wird zunehmend automatisiert, und ehrlich gesagt: Ich möchte nicht die nächsten zwanzig Jahre dasselbe machen.", "ar": "أنا مدير مخزن منذ عشرين عامًا. العمل يصبح مؤتمتًا بشكل متزايد، وبصراحة: لا أريد أن أفعل الشيء نفسه في العشرين سنة القادمة."},
 {"who": "Beraterin", "de": "Das ist ein nachvollziehbarer Wunsch. Haben Sie schon eine Richtung im Kopf?", "ar": "هذه رغبة مفهومة. هل لديك اتجاه في ذهنك بالفعل؟"},
 {"who": "Herr Krüger", "de": "Ich könnte mir etwas mit Menschen vorstellen, vielleicht in der Beratung oder im sozialen Bereich. Aber mit Mitte vierzig noch einmal von vorn anzufangen, macht mir auch Angst.", "ar": "أستطيع تصوّر شيء مع الناس، ربما في الاستشارة أو المجال الاجتماعي. لكن البدء من جديد في منتصف الأربعينيات يخيفني أيضًا."},
 {"who": "Beraterin", "de": "Diese Sorge höre ich oft. Dabei bringen Sie etwas mit, das kein Zertifikat ersetzt: zwei Jahrzehnte Erfahrung im Umgang mit Teams und schwierigen Situationen.", "ar": "أسمع هذا القلق كثيرًا. وفي الحقيقة تحمل معك ما لا تعوّضه أي شهادة: عقدين من الخبرة في التعامل مع الفرق والمواقف الصعبة."},
 {"who": "Herr Krüger", "de": "Das stimmt wohl. Aber formal fehlt mir jede Qualifikation in dem Bereich.", "ar": "هذا صحيح على الأرجح. لكن رسميًا تنقصني أي مؤهّل في ذلك المجال."},
 {"who": "Beraterin", "de": "Dafür gibt es Wege: Eine Umschulung dauert in der Regel zwei Jahre und wird unter bestimmten Voraussetzungen gefördert. Daneben existieren berufsbegleitende Lehrgänge.", "ar": "لهذا توجد طرق: إعادة التأهيل تستغرق عادة سنتين وتُدعَّم بشروط معينة. وإلى جانبها توجد دورات أثناء العمل."},
 {"who": "Herr Krüger", "de": "Berufsbegleitend klänge realistischer. Ich muss schließlich meine Familie versorgen.", "ar": "أثناء العمل يبدو أكثر واقعية. ففي النهاية يجب أن أعيل أسرتي."},
 {"who": "Beraterin", "de": "Verständlich. Mein Vorschlag: Wir schauen uns drei konkrete Angebote an und prüfen, welche Anerkennung Ihre Erfahrung dort findet.", "ar": "مفهوم. اقتراحي: ننظر في ثلاثة عروض ملموسة ونفحص أيّ اعتراف تجده خبرتك هناك."},
 {"who": "Herr Krüger", "de": "Das klingt nach einem machbaren ersten Schritt. Muss ich mich heute schon festlegen?", "ar": "يبدو ذلك خطوة أولى قابلة للتنفيذ. هل يجب أن أحسم أمري اليوم بالفعل؟"},
 {"who": "Beraterin", "de": "Keinesfalls. Nehmen Sie die Unterlagen mit, schlafen Sie darüber und kommen Sie in zwei Wochen wieder. Entscheidungen dieser Tragweite brauchen Zeit.", "ar": "إطلاقًا. خذ المستندات معك، ونم عليها (فكّر بهدوء)، وعُد بعد أسبوعين. فقرارات بهذا الحجم تحتاج وقتًا."},
 {"who": "Herr Krüger", "de": "Vielen Dank. Allein, dass es konkrete Optionen gibt, nimmt mir schon einen Teil der Angst.", "ar": "شكرًا جزيلًا. مجرّد وجود خيارات ملموسة يزيل عني جزءًا من الخوف بالفعل."}],
[
 {"id": "vf-d5-q1", "promptDe": "Warum will Herr Krüger sich umorientieren?", "promptAr": "لماذا يريد السيد كروغر تغيير اتجاهه؟",
  "options": ["Er hat gekündigt", "Seine Arbeit wird automatisiert und er will nicht 20 Jahre dasselbe machen", "Er zieht um", "Sein Chef verlangt es"], "answer": "Seine Arbeit wird automatisiert und er will nicht 20 Jahre dasselbe machen",
  "explanationAr": "يقول: «Die Arbeit wird zunehmend automatisiert» و«Ich möchte nicht die nächsten zwanzig Jahre dasselbe machen»."},
 {"id": "vf-d5-q2", "promptDe": "Was bringt Herr Krüger laut Beraterin mit?", "promptAr": "ما الذي يحمله السيد كروغر معه بحسب المستشارة؟",
  "options": ["Zertifikate", "Zwei Jahrzehnte Erfahrung mit Teams und schwierigen Situationen", "Ersparnisse", "Einen Studienabschluss"], "answer": "Zwei Jahrzehnte Erfahrung mit Teams und schwierigen Situationen",
  "explanationAr": "تقول: «zwei Jahrzehnte Erfahrung im Umgang mit Teams und schwierigen Situationen»."},
 {"id": "vf-d5-q3", "promptDe": "Wozu rät die Beraterin am Ende?", "promptAr": "بمَ تنصح المستشارة في النهاية؟",
  "options": ["Sofort kündigen", "Unterlagen mitnehmen, darüber schlafen und in zwei Wochen wiederkommen", "Gleich einen Vertrag unterschreiben", "Alles aufgeben"], "answer": "Unterlagen mitnehmen, darüber schlafen und in zwei Wochen wiederkommen",
  "explanationAr": "تقول: «Nehmen Sie die Unterlagen mit, schlafen Sie darüber und kommen Sie in zwei Wochen wieder»."}]))

DIALOGE_B.append(dial("vf-d6", "Radiointerview: Zukunft der Bibliotheken", "مقابلة إذاعية: مستقبل المكتبات",
[
 {"who": "Moderatorin", "de": "Zu Gast ist heute Frau Professor Aydın, die zur Zukunft öffentlicher Bibliotheken forscht. Frau Aydın, stirbt die Bibliothek im digitalen Zeitalter?", "ar": "ضيفتنا اليوم السيدة البروفيسورة آيدن، التي تبحث في مستقبل المكتبات العامة. سيدة آيدن، هل تموت المكتبة في العصر الرقمي؟"},
 {"who": "Prof. Aydın", "de": "Diese Frage höre ich seit zwanzig Jahren – und die Bibliotheken sind immer noch da. Was sich ändert, ist ihre Funktion: Weg vom reinen Buchlager, hin zum offenen Aufenthaltsort.", "ar": "أسمع هذا السؤال منذ عشرين عامًا – والمكتبات لا تزال موجودة. ما يتغيّر هو وظيفتها: بعيدًا عن مخزن الكتب المجرّد، نحو مكان مفتوح للبقاء فيه."},
 {"who": "Moderatorin", "de": "Was suchen die Menschen dort, wenn sie Bücher auch zu Hause lesen können?", "ar": "ما الذي يبحث عنه الناس هناك إذا كان بإمكانهم قراءة الكتب في البيت أيضًا؟"},
 {"who": "Prof. Aydın", "de": "Vor allem drei Dinge: einen ruhigen Arbeitsplatz, kompetente Beratung – und einander. Viele kommen, um nicht allein zu sein, ohne etwas kaufen zu müssen.", "ar": "ثلاثة أشياء قبل كل شيء: مكان عمل هادئ، واستشارة مختصة – وبعضهم بعضًا. كثيرون يأتون كي لا يكونوا وحيدين، دون أن يضطروا لشراء شيء."},
 {"who": "Moderatorin", "de": "Gleichzeitig stehen viele Kommunen unter Spardruck. Wo setzt man da den Rotstift an?", "ar": "في الوقت نفسه تواجه بلديات كثيرة ضغط توفير. فأين يضع المرء قلم الحذف الأحمر؟"},
 {"who": "Prof. Aydın", "de": "Hoffentlich nicht bei den Öffnungszeiten. Eine Bibliothek, die nur werktags bis sechzehn Uhr öffnet, schließt genau die aus, die arbeiten – und die sie am dringendsten bräuchten.", "ar": "آمل ألا يكون عند ساعات الفتح. فمكتبة لا تفتح إلا في أيام العمل حتى الرابعة عصرًا تستبعد بالضبط أولئك الذين يعملون – والذين يحتاجونها على أحرّ وجه."},
 {"who": "Moderatorin", "de": "Welche Rolle spielt die Digitalisierung jenseits vom E-Book?", "ar": "ما الدور الذي تلعبه الرقمنة بعيدًا عن الكتاب الإلكتروني؟"},
 {"who": "Prof. Aydın", "de": "Eine größere, als viele denken: Bibliotheken verleihen inzwischen Werkzeuge, bieten Makerspaces mit 3D-Druckern an und helfen älteren Menschen im Umgang mit Behördenportalen.", "ar": "دورًا أكبر مما يظنه كثيرون: فالمكتبات تُعير الآن أدوات، وتقدّم مساحات صناعة بطابعات ثلاثية الأبعاد، وتساعد كبار السن في التعامل مع بوابات السلطات."},
 {"who": "Moderatorin", "de": "Klingt nach einer Institution im Aufwind. Wo sehen Sie die größte Baustelle?", "ar": "يبدو كمؤسسة في صعود. أين ترين أكبر ورشة (مشكلة تحتاج علاجًا)؟"},
 {"who": "Prof. Aydın", "de": "Bei der personellen Ausstattung. Neue Aufgaben mit altem Personalstamm zu bewältigen, überfordert auf Dauer selbst die engagiertesten Teams.", "ar": "في التجهيز البشري. فإنجاز مهام جديدة بطاقم قديم يفوق قدرة أكثر الفرق التزامًا على المدى الطويل."},
 {"who": "Moderatorin", "de": "Ihr Ausblick in einem Satz?", "ar": "تطلّعك في جملة واحدة؟"},
 {"who": "Prof. Aydın", "de": "Die Bibliothek der Zukunft wird weniger ein Ort der Bücher sein als ein Ort der Möglichkeiten – vorausgesetzt, die Politik gibt ihr den Raum dazu.", "ar": "مكتبة المستقبل ستكون مكانًا للإمكانيات أكثر من كونها مكانًا للكتب – بشرط أن تمنحها السياسة المساحة لذلك."}],
[
 {"id": "vf-d6-q1", "promptDe": "Wie verändert sich die Funktion der Bibliothek?", "promptAr": "كيف تتغيّر وظيفة المكتبة؟",
  "options": ["Sie wird zum Buchladen", "Vom reinen Buchlager zum offenen Aufenthaltsort", "Sie schließt", "Sie wird digital abgeschafft"], "answer": "Vom reinen Buchlager zum offenen Aufenthaltsort",
  "explanationAr": "تقول: «Weg vom reinen Buchlager, hin zum offenen Aufenthaltsort»."},
 {"id": "vf-d6-q2", "promptDe": "Wo sollte laut Frau Aydın nicht gespart werden?", "promptAr": "أين ينبغي ألا يُقتَّر فيه بحسب السيدة آيدن؟",
  "options": ["Bei den Öffnungszeiten", "Bei neuen Büchern", "Bei 3D-Druckern", "Bei Veranstaltungen"], "answer": "Bei den Öffnungszeiten",
  "explanationAr": "تقول: «Hoffentlich nicht bei den Öffnungszeiten»."},
 {"id": "vf-d6-q3", "promptDe": "Was ist die größte Baustelle?", "promptAr": "ما أكبر مشكلة تحتاج علاجًا؟",
  "options": ["Zu wenige Bücher", "Die personelle Ausstattung", "Zu viele Besucher", "Die Digitalisierung"], "answer": "Die personelle Ausstattung",
  "explanationAr": "تقول: «Bei der personellen Ausstattung»."}]))
