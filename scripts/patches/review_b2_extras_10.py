#!/usr/bin/env python3
"""Apply the narrowly scoped R154 review to five supplementary B2 resources."""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

DATA_PATH = Path("content/dialogues.json")
TARGET_IDS = [
    "dlg-b2-mietvertrag",
    "hoer-b2-01",
    "d-b2-ht01",
    "d-b2-ht02",
    "d-b2-ht03",
]

# Exact, guarded transitions only; the patch is safe to re-run.
EDITS: list[tuple[str, tuple[Any, ...], Any, Any]] = [
    ("dlg-b2-mietvertrag", ("lines", 0, "de"), "Frau Saleh, hier ist der Mietvertrag. Die Kaltmiete beträgt 720 Euro, die Nebenkosten liegen bei 180 Euro warm.", "Frau Saleh, hier ist der Mietvertrag. Die Kaltmiete beträgt 720 Euro und die Nebenkosten liegen bei 180 Euro. Zusammen sind das 900 Euro Warmmiete."),
    ("dlg-b2-mietvertrag", ("lines", 0, "ar"), "الآنسة صالح، هذا عقد الإيجار. الإيجار الأساسي 720 يورو والتكاليف الجانبية 180 يورو، أي الإيجار الإجمالي 900 يورو.", "السيدة صالح، هذا عقد الإيجار. الإيجار الأساسي 720 يورو، والتكاليف الجانبية 180 يورو. ويبلغ الإيجار الإجمالي 900 يورو."),
    ("dlg-b2-mietvertrag", ("lines", 1, "de"), "Ist die Kaution vereinbart? Üblich sind drei Kaltmieten, oder?", "Wie hoch ist die Kaution im Vertrag? Sie entspricht drei Kaltmieten, oder?"),
    ("dlg-b2-mietvertrag", ("lines", 1, "ar"), "هل تم الاتفاق على التأمين؟ المعتاد ثلاثة إيجارات أساسية، أليس كذلك؟", "ما قيمة وديعة الضمان في العقد؟ إنها تعادل ثلاثة أشهر من الإيجار الأساسي، أليس كذلك؟"),
    ("dlg-b2-mietvertrag", ("lines", 2, "ar"), "نعم، التأمين 2160 يورو ويُدفع في حساب تأمين منفصل.", "نعم، تبلغ وديعة الضمان 2160 يورو، وتُودَع في حساب ضمان منفصل."),
    ("dlg-b2-mietvertrag", ("lines", 4, "de"), "Für Sie gilt die gesetzliche Frist von drei Monaten. In den ersten zwei Jahren gibt es eine Staffelmiete von zwei Prozent pro Jahr.", "Für Sie gilt die gesetzliche Frist von drei Monaten. Für die ersten zwei Jahre ist eine Staffelmiete vereinbart; die Beträge und Termine stehen im Vertrag."),
    ("dlg-b2-mietvertrag", ("lines", 4, "ar"), "تنطبق عليك المهلة القانونية وهي ثلاثة أشهر. في أول عامين هناك إيجار متدرّج بنسبة 2% سنوياً.", "تنطبق عليك المهلة القانونية البالغة ثلاثة أشهر. وفي أول عامين، اتُّفق على إيجار متدرّج؛ وترد مبالغ الزيادة ومواعيدها في العقد."),
    ("dlg-b2-mietvertrag", ("lines", 6, "de"), "Streichen in neutralen Farben ist erlaubt, Bohrungen bitte nur in Absprache. Bei Auszug muss die Wohnung in dem Zustand übergeben werden, wie Sie sie übernommen haben.", "Neutrale Wandfarben sind in Ordnung. Bitte sprechen Sie geplante Bohrungen vorher mit mir ab. Normale Gebrauchsspuren sind kein Problem; was bei Auszug nötig ist, richtet sich nach dem Vertrag und dem Zustand der Wohnung."),
    ("dlg-b2-mietvertrag", ("lines", 6, "ar"), "الطلاء بألوان محايدة مسموح، والثقوب يرجى أن تكون بالاتفاق. عند المغادرة يجب تسليم الشقة بحالة الاستلام.", "الألوان المحايدة للجدران مقبولة. يُرجى التنسيق معي مسبقاً بشأن الثقوب المخطط لها. آثار الاستعمال العادية لا مشكلة فيها؛ وما يلزم عند المغادرة يتحدد وفق العقد وحالة الشقة."),
    ("dlg-b2-mietvertrag", ("lines", 7, "ar"), "جيد، سأقرأ العقد بهدوء ثم أرسله إليك موقّعاً.", "حسناً، سأقرأ العقد مرة أخرى على مهل، ثم أعيده إليك موقّعاً."),
    ("dlg-b2-mietvertrag", ("questions", 0, "explanationAr"), "الدليل: الإيجار الأساسي 720 يورو والتكاليف الجانبية 180 يورو، ومجموعهما 900 يورو. الفخّ: 2160 يورو هو مبلغ التأمين، لا الإيجار الشهري.", "الدليل: الإيجار الأساسي 720 يورو والتكاليف الجانبية 180 يورو؛ ومجموعهما 900 يورو كإيجار إجمالي. الفخّ: 2160 يورو مبلغ وديعة الضمان، لا الإيجار الشهري."),
    ("dlg-b2-mietvertrag", ("questions", 1, "promptAr"), "في أي حساب يُدفع التأمين؟", "إلى أي حساب تُودَع وديعة الضمان؟"),
    ("dlg-b2-mietvertrag", ("questions", 1, "explanationAr"), "الدليل: يُودَع مبلغ التأمين في حساب Kautionskonto منفصل. الفخّ: المبلغ لا يُدفع نقداً ولا إلى الحساب الخاص للمؤجّرة؛ المقصود حساب التأمين المنفصل.", "الدليل: ينص الحوار على إيداع وديعة الضمان في حساب منفصل مخصص لها. الفخّ: ليس الحساب الشخصي للمؤجّرة ولا الدفع النقدي عند التسليم."),
    ("dlg-b2-mietvertrag", ("dictation", 0), "Die Kaltmiete beträgt 720 Euro, die Nebenkosten liegen bei 180 Euro warm.", "Die Kaltmiete beträgt 720 Euro und die Nebenkosten liegen bei 180 Euro."),
    ("dlg-b2-mietvertrag", ("dictation", 1), "In den ersten zwei Jahren gibt es eine Staffelmiete von zwei Prozent pro Jahr.", "Für die ersten zwei Jahre ist eine Staffelmiete vereinbart; die Beträge und Termine stehen im Vertrag."),

    ("hoer-b2-01", ("lines", 0, "de"), "F: Frau Dr. Weber, wie beurteilen Sie die Situation auf dem deutschen Arbeitsmarkt für ausländische Fachkräfte? – W: Grundsätzlich ist die Nachfrage hoch, insbesondere in technischen Berufen und im Gesundheitswesen. Das Problem liegt oft weniger in der Qualifikation als vielmehr in der Anerkennung der Abschlüsse und in den Sprachkenntnissen. A2- oder B1-Kenntnisse reichen oft nicht aus. Viele Arbeitgeber fordern heute mindestens B2, in manchen Bereichen sogar C1. Außerdem spielt interkulturelle Kompetenz eine immer größere Rolle. Mein Rat: frühzeitig Deutsch lernen und die Anerkennung bereits im Heimatland beantragen.", "Wie beurteilen Sie die Situation auf dem deutschen Arbeitsmarkt für ausländische Fachkräfte? – Grundsätzlich ist die Nachfrage hoch, insbesondere in technischen Berufen und im Gesundheitswesen. Das Problem liegt oft weniger in der Qualifikation als vielmehr in der Anerkennung der Abschlüsse und in den Sprachkenntnissen. A2- oder B1-Kenntnisse reichen für manche Tätigkeiten nicht aus. Einige Arbeitgeber fordern mindestens B2, in bestimmten Bereichen sogar C1. Außerdem spielt interkulturelle Kompetenz eine immer größere Rolle. Mein Rat: frühzeitig Deutsch lernen und die Anerkennung bereits im Heimatland beantragen."),
    ("hoer-b2-01", ("lines", 0, "ar"), "س: د. فِبَر، كيف تقيّمين وضع سوق العمل الألماني للكفاءات الأجنبية؟ – ج: الطلب مرتفع أساساً، خصوصاً في المهن التقنية والصحة. المشكلة غالباً ليست في المؤهل بل في معادلة الشهادات ومستوى اللغة. مستوى A2 أو B1 لا يكفي غالباً. كثير من أرباب العمل يطلبون B2 على الأقل، وفي بعض المجالات C1. كما تلعب الكفاءة بين الثقافات دوراً أكبر فأكبر. نصيحتي: تعلّم الألمانية مبكراً، وقدّم طلب المعادلة وأنت في بلدك.", "س: كيف تقيّمين وضع سوق العمل الألماني للكفاءات الأجنبية؟ – ج: بوجه عام، الطلب مرتفع، خصوصاً في المهن التقنية ومجال الصحة. وغالباً لا تكمن المشكلة في المؤهل نفسه بقدر ما تكمن في الاعتراف بالشهادات ومستوى اللغة. وقد لا تكفي معرفة A2 أو B1 لبعض الوظائف. ويطلب بعض أرباب العمل B2 على الأقل، وفي مجالات معينة C1. كما تزداد أهمية الكفاءة بين الثقافات. نصيحتي: تعلّموا الألمانية مبكراً، وقدّموا طلب معادلة الشهادة منذ وجودكم في بلدكم."),
    ("hoer-b2-01", ("questions", 0, "promptDe"), "Was ist nach Frau Weber das größere Problem?", "Was ist laut der Expertin das größere Problem?"),
    ("hoer-b2-01", ("questions", 0, "promptAr"), "ما المشكلة الأكبر بحسب فِبَر؟", "ما المشكلة الأكبر بحسب الخبيرة؟"),
    ("hoer-b2-01", ("questions", 0, "explanationAr"), "الدليل: قالت إن المشكلة غالباً ليست في المؤهلات نفسها، بل في الاعتراف بالشهادات ومعرفة اللغة. الفخّ: ذُكرت الحاجة العالية إلى التخصصات التقنية والكفاءة الثقافية أيضاً، لكنهما ليستا المشكلة التي حدّدتها.", "الدليل: تذكر الإجابة الاعتراف بالشهادات واللغة بوصفهما الصعوبة الأبرز، لا المؤهل نفسه. الفخّ: ارتفاع الطلب في بعض المهن والكفاءة بين الثقافات ذُكرا أيضاً، لكنهما ليسا المشكلة المحددة."),
    ("hoer-b2-01", ("questions", 1, "promptDe"), "Welches Sprachniveau fordern viele Arbeitgeber mindestens?", "Welches Sprachniveau wird zuerst als Mindestanforderung genannt?"),
    ("hoer-b2-01", ("questions", 1, "promptAr"), "ما المستوى اللغوي المطلوب على الأقل؟", "ما المستوى اللغوي الذي ذُكر أولاً بوصفه الحد الأدنى؟"),
    ("hoer-b2-01", ("questions", 1, "explanationAr"), "الدليل: قالت إن A2 أو B1 لا يكفيان غالباً، وإن كثيراً من أصحاب العمل يطلبون B2 على الأقل، وقد يطلب بعضهم C1. الفخّ: C1 مطلب أعلى في مجالات معينة، لا الحد الأدنى العام.", "الدليل: ذُكر B2 أولاً كحد أدنى لدى بعض أصحاب العمل، ثم C1 لبعض المجالات. الفخّ: C1 أعلى ويخص مجالات معينة، وليس المستوى الأول المذكور."),
    ("hoer-b2-01", ("dictation", 0), "Die Nachfrage ist hoch, insbesondere in technischen Berufen.", "Grundsätzlich ist die Nachfrage hoch, insbesondere in technischen Berufen und im Gesundheitswesen."),

    ("d-b2-ht01", ("situationDe",), "Radiomeldung: Klimaprotest blockiert Autobahn", "Fiktive Radiomeldung: Klimaprotest auf einer Autobahn"),
    ("d-b2-ht01", ("situationAr",), "خبر في الراديو: احتجاج مناخي يغلق طريقاً سريعاً", "خبر إذاعي افتراضي: احتجاج مناخي على طريق سريع"),
    ("d-b2-ht01", ("titleDe",), "Radiomeldung: Klimaprotest blockiert Autobahn", "Fiktive Radiomeldung: Klimaprotest auf einer Autobahn"),
    ("d-b2-ht01", ("titleAr",), "خبر في الراديو: احتجاج مناخي يغلق طريقاً سريعاً", "خبر إذاعي افتراضي: احتجاج مناخي على طريق سريع"),
    ("d-b2-ht01", ("lines", 0, "de"), "Aktivisten der Gruppe «Letzte Generation» haben heute Morgen die A100 in Berlin blockiert, indem sie sich auf der Fahrbahn festklebten.", "Umweltaktivisten haben heute Morgen eine Autobahn in einer Großstadt blockiert, indem sie sich auf der Fahrbahn festklebten."),
    ("d-b2-ht01", ("lines", 0, "ar"), "ناشطون من مجموعة «الجيل الأخير» أغلقوا الطريق السريع A100 في برلين صباحاً بلصق أنفسهم على الطريق.", "أغلق ناشطون بيئيون صباح اليوم طريقاً سريعاً في مدينة كبيرة، بعد أن ألصقوا أنفسهم بسطح الطريق."),
    ("d-b2-ht01", ("lines", 1, "de"), "Die Polizei hat mit der Räumung begonnen. Bislang kam es zu einem Stau von etwa 14 Kilometern. Die A100 ist stadteinwärts seit 7 Uhr gesperrt, die Räumung wird voraussichtlich bis zum Mittag dauern.", "Die Polizei hat mit der Räumung begonnen. Es kam zu einem langen Stau. Die Straße ist stadteinwärts gesperrt; die Räumung wird voraussichtlich bis zum Mittag dauern."),
    ("d-b2-ht01", ("lines", 1, "ar"), "بدأت الشرطة بالإخلاء. الازدحام يبلغ ١٤ كيلومتراً. الطريق مغلق باتجاه المدينة منذ الساعة ٧ ومن المتوقع أن يستمر الإخلاء حتى الظهيرة.", "بدأت الشرطة إخلاء الطريق. وحدث ازدحام طويل. وأُغلق المسار المتجه إلى داخل المدينة؛ ومن المتوقع أن تستمر عملية الإخلاء حتى الظهر."),
    ("d-b2-ht01", ("questions", 0, "explanationAr"), "الدليل: توقّع المذيع أن تستمر إزالة العوائق حتى الظهر. الفخّ: السابعة وقت بدء الإغلاق، والثامنة أو المساء ليسا وقت انتهاء الإزالة المذكور.", "الدليل: توقّع المذيع أن تستمر عملية الإخلاء حتى الظهر. الفخّ: الإغلاق بدأ صباحاً، لكن وقت انتهائه المتوقع هو الظهر، لا الثامنة أو المساء."),
    ("d-b2-ht01", ("dictation", 0), "Aktivisten der Gruppe «Letzte Generation» haben heute Morgen die A100 in Berlin blockiert, indem sie sich auf der Fahrbahn festklebten.", "Umweltaktivisten haben heute Morgen eine Autobahn in einer Großstadt blockiert, indem sie sich auf der Fahrbahn festklebten."),

    ("d-b2-ht02", ("situationDe",), "Anrufbeantworter: Firma Müller & Söhne (Kundenrückruf)", "Anrufbeantworter: Büro geschlossen und Notdienst"),
    ("d-b2-ht02", ("situationAr",), "جهاز الرد الآلي لشركة مولر وأبناء (ردّ مكالمة عميل)", "جهاز الرد الآلي: إغلاق المكتب وخدمة المناوبة"),
    ("d-b2-ht02", ("titleDe",), "Anrufbeantworter: Firma Müller & Söhne (Kundenrückruf)", "Anrufbeantworter: Büro geschlossen und Notdienst"),
    ("d-b2-ht02", ("titleAr",), "جهاز الرد الآلي لشركة مولر وأبناء (ردّ مكالمة عميل)", "جهاز الرد الآلي: إغلاق المكتب وخدمة المناوبة"),
    ("d-b2-ht02", ("lines", 0, "de"), "Guten Tag, Sie haben die Firma Müller & Söhne erreicht. Heute ist Freitag, der 10. Oktober, unser Büro ist bereits geschlossen.", "Guten Tag, Sie haben unser Büro erreicht. Es ist heute bereits geschlossen."),
    ("d-b2-ht02", ("lines", 0, "ar"), "نهاركم سعيد، لقد اتصلتم بشركة مولر وأبناء. اليوم الجمعة ١٠ تشرين الأول ومكتبنا مغلق.", "مرحباً، لقد اتصلتم بمكتبنا، وهو مغلق اليوم."),
    ("d-b2-ht02", ("lines", 1, "de"), "Unsere Öffnungszeiten am Montag sind 8 bis 17 Uhr. In dringenden Fällen erreichen Sie unseren Notdienst unter der 0228-900 100. Vielen Dank für Ihr Verständnis.", "Unsere Öffnungszeiten am Montag sind von 8 bis 17 Uhr. In dringenden Fällen finden Sie die Rufnummer unseres Notdienstes in Ihren Vertragsunterlagen. Vielen Dank für Ihr Verständnis."),
    ("d-b2-ht02", ("lines", 1, "ar"), "ساعات العمل الإثنين من ٨ حتى ١٧. في الحالات الطارئة اتصل بخدمة الطوارئ على ٠٢٢٨-٩٠٠١٠٠. شكراً لتفهمكم.", "ساعات عملنا يوم الاثنين من 8 إلى 17. في الحالات العاجلة، تجدون رقم خدمة المناوبة في مستنداتكم التعاقدية. شكراً لتفهمكم."),
    ("d-b2-ht02", ("questions", 0, "promptDe"), "Welche Nummer wählt man in dringenden Fällen?", "Wo finden Kundinnen und Kunden die Nummer des Notdienstes?"),
    ("d-b2-ht02", ("questions", 0, "promptAr"), "ما الرقم المطلوب في الحالات الطارئة؟", "أين يجد العملاء رقم خدمة المناوبة؟"),
    ("d-b2-ht02", ("questions", 0, "options"), ["Notdienst: 0228-900 100", "Notdienst: 110", "Notdienst: 112"], ["In den Vertragsunterlagen", "Im Büro während der Öffnungszeiten", "Im Büro am Montag"]),
    ("d-b2-ht02", ("questions", 0, "answer"), "Notdienst: 0228-900 100", "In den Vertragsunterlagen"),
    ("d-b2-ht02", ("questions", 0, "explanationAr"), "الدليل: أعلنت الشركة رقم مناوبتها للحالات العاجلة: 0228-900 100. الفخّ: 110 و112 رقما طوارئ عامّان، لا رقم مناوبة الشركة.", "الدليل: تشير الرسالة إلى أن رقم خدمة المناوبة موجود في المستندات التعاقدية. الفخّ: تُذكر أوقات المكتب، لكن لا يقال إن الرقم يُعطى فيه أو خلال الدوام."),
    ("d-b2-ht02", ("dictation", 0), "Guten Tag, Sie haben die Firma Müller & Söhne erreicht.", "Guten Tag, Sie haben unser Büro erreicht."),

    ("d-b2-ht03", ("situationDe",), "Wissenschaftsmeldung: KI und der Arbeitsmarkt", "Beispiel: KI und der Arbeitsmarkt"),
    ("d-b2-ht03", ("situationAr",), "خبر علمي: الذكاء الاصطناعي وسوق العمل", "مثال: الذكاء الاصطناعي وسوق العمل"),
    ("d-b2-ht03", ("titleDe",), "Wissenschaftsmeldung: KI und der Arbeitsmarkt", "Beispiel: KI und der Arbeitsmarkt"),
    ("d-b2-ht03", ("titleAr",), "خبر علمي: الذكاء الاصطناعي وسوق العمل", "مثال: الذكاء الاصطناعي وسوق العمل"),
    ("d-b2-ht03", ("lines", 0, "de"), "Eine neue Untersuchung des Instituts für Arbeitsmarkt- und Berufsforschung analysiert, wie künstliche Intelligenz berufliche Aufgaben verändert. Die Forschenden erwarten, dass einige Tätigkeiten automatisiert werden, während in anderen Bereichen neue Aufgaben entstehen. Besonders betroffen sein könnten wiederkehrende Büro- und Verwaltungsaufgaben. Aus der Untersuchung lässt sich jedoch keine sichere Zahl künftig wegfallender Stellen ableiten. Entscheidend seien Weiterbildung und die Frage, ob Unternehmen KI unterstützend statt ersetzend einsetzen.", "Betrachten wir ein Beispiel: Künstliche Intelligenz könnte berufliche Aufgaben verändern. Einige Tätigkeiten könnten automatisiert werden, während in anderen Bereichen neue Aufgaben entstehen. Besonders betroffen sein könnten wiederkehrende Büro- und Verwaltungsaufgaben. Aus diesem Beispiel lässt sich jedoch keine sichere Zahl künftig wegfallender Stellen ableiten. Entscheidend wären Weiterbildung und die Frage, ob Unternehmen KI unterstützend statt ersetzend einsetzen."),
    ("d-b2-ht03", ("lines", 0, "ar"), "تحلل دراسة جديدة لمعهد بحوث سوق العمل والمهن كيف يغيّر الذكاء الاصطناعي المهام المهنية. ويتوقع الباحثون أتمتة بعض الأنشطة، في حين تنشأ مهام جديدة في مجالات أخرى. وقد تتأثر خصوصاً المهام المكتبية والإدارية المتكررة. لكن لا يمكن استنتاج رقم مؤكد للوظائف التي ستختفي مستقبلاً. ويعتمد الأمر على التدريب المستمر وعلى ما إذا كانت الشركات تستخدم الذكاء الاصطناعي للمساعدة أم للاستبدال.", "لننظر في مثال: قد يغيّر الذكاء الاصطناعي المهام المهنية. وقد تُؤتمت بعض الأنشطة، في حين تنشأ مهام جديدة في مجالات أخرى. وقد تتأثر خصوصاً المهام المكتبية والإدارية المتكررة. لكن لا يمكن استنتاج عدد مؤكد للوظائف التي قد تختفي مستقبلاً من هذا المثال. ويتوقف الأمر على التدريب المستمر وعلى ما إذا كانت الشركات تستخدم الذكاء الاصطناعي للمساعدة لا للاستبدال."),
    ("d-b2-ht03", ("questions", 0, "promptDe"), "Was lässt sich laut Sprecher NICHT sicher aus der Untersuchung ableiten?", "Welche Aussage lässt sich aus dem Beispiel nicht sicher ableiten?"),
    ("d-b2-ht03", ("questions", 0, "promptAr"), "ما الذي لا يمكن استنتاجه على نحو مؤكد من الدراسة؟", "ما الذي لا يمكن استنتاجه على نحو مؤكد من المثال؟"),
    ("d-b2-ht03", ("questions", 0, "options"), ["Die genaue Zahl künftig wegfallender Arbeitsplätze", "Dass sich berufliche Aufgaben verändern können", "Dass Weiterbildung wichtig bleibt"], ["Eine sichere Zahl künftig wegfallender Stellen", "Dass einige Tätigkeiten automatisiert werden könnten", "Dass in anderen Bereichen neue Aufgaben entstehen"]),
    ("d-b2-ht03", ("questions", 0, "answer"), "Die genaue Zahl künftig wegfallender Arbeitsplätze", "Eine sichere Zahl künftig wegfallender Stellen"),
    ("d-b2-ht03", ("questions", 0, "explanationAr"), "الدليل: يوضح المتحدث أنه لا يمكن استنتاج عدد مؤكد للوظائف التي ستختفي. الفخّ: توقّع أتمتة بعض المهام لا يقدّم رقماً محدداً للوظائف.", "الدليل: يذكر المتحدث أنه لا يمكن استنتاج عدد مؤكد للوظائف التي قد تختفي من المثال. الفخّ: احتمال أتمتة بعض المهام أو ظهور مهام أخرى لا يقدم رقماً محدداً للوظائف."),
    ("d-b2-ht03", ("dictation", 0), "Eine neue Untersuchung analysiert, wie künstliche Intelligenz berufliche Aufgaben verändert.", "Betrachten wir ein Beispiel: Künstliche Intelligenz könnte berufliche Aufgaben verändern."),
]

# Follow-up refinements: these resolve a potentially ambiguous account distractor and align an Arabic conditional with the German hypothetical.
REVISION_EDITS: list[tuple[str, tuple[Any, ...], Any, Any]] = [
    ("dlg-b2-mietvertrag", ("lines", 4, "de"), "Für Sie gilt die gesetzliche Frist von drei Monaten. Für die ersten zwei Jahre ist eine Staffelmiete vereinbart; die Beträge und Termine stehen im Vertrag.", "Für die ordentliche Kündigung gilt in der Regel eine gesetzliche Frist von drei Monaten. Für die ersten zwei Jahre ist eine Staffelmiete vereinbart; die Beträge und Termine stehen im Vertrag."),
    ("dlg-b2-mietvertrag", ("lines", 4, "ar"), "تنطبق عليك المهلة القانونية البالغة ثلاثة أشهر. وفي أول عامين، اتُّفق على إيجار متدرّج؛ وترد مبالغ الزيادة ومواعيدها في العقد.", "بالنسبة إلى الفسخ العادي، تسري في العادة مهلة قانونية مدتها ثلاثة أشهر. وفي أول عامين، اتُّفق على إيجار متدرّج؛ وترد مبالغ الزيادة ومواعيدها في العقد."),
    ("dlg-b2-mietvertrag", ("questions", 1, "options"), ["Auf das Privatkonto der Vermieterin", "Auf ein separates Kautionskonto", "Auf ein separates Konto der Vermieterin", "Bar bei Übergabe"], ["Auf das Privatkonto der Vermieterin", "Auf ein separates Kautionskonto", "Auf das Konto für die Nebenkosten", "Bar bei Übergabe"]),
    ("dlg-b2-mietvertrag", ("questions", 1, "explanationAr"), "الدليل: ينص الحوار على إيداع وديعة الضمان في حساب منفصل مخصص لها. الفخّ: ليس الحساب الشخصي للمؤجّرة ولا الدفع النقدي عند التسليم.", "الدليل: ينص الحوار على إيداع وديعة الضمان في حساب منفصل مخصص لها. الفخّ: ليس الحساب الشخصي للمؤجّرة، ولا حساب التكاليف الجانبية، ولا الدفع النقدي عند التسليم."),
    ("d-b2-ht03", ("lines", 0, "ar"), "لننظر في مثال: قد يغيّر الذكاء الاصطناعي المهام المهنية. وقد تُؤتمت بعض الأنشطة، في حين تنشأ مهام جديدة في مجالات أخرى. وقد تتأثر خصوصاً المهام المكتبية والإدارية المتكررة. لكن لا يمكن استنتاج عدد مؤكد للوظائف التي قد تختفي مستقبلاً من هذا المثال. ويتوقف الأمر على التدريب المستمر وعلى ما إذا كانت الشركات تستخدم الذكاء الاصطناعي للمساعدة لا للاستبدال.", "لننظر في مثال: قد يغيّر الذكاء الاصطناعي المهام المهنية. وقد تُؤتمت بعض الأنشطة، في حين تنشأ مهام جديدة في مجالات أخرى. وقد تتأثر خصوصاً المهام المكتبية والإدارية المتكررة. لكن لا يمكن استنتاج عدد مؤكد للوظائف التي قد تختفي مستقبلاً من هذا المثال. وفي هذا المثال، سيكون التدريب المستمر واستخدام الشركات للذكاء الاصطناعي بوصفه أداةً مساندة لا بديلاً عاملين حاسمين."),
]


def get_parent(root: Any, path: tuple[Any, ...]) -> tuple[Any, Any]:
    node = root
    for key in path[:-1]:
        node = node[key]
    return node, path[-1]


def main() -> None:
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    by_id = {item["id"]: item for item in data}
    if len(by_id) != len(data):
        raise SystemExit("duplicate dialogue ids in content/dialogues.json")
    missing = [item for item in TARGET_IDS if item not in by_id]
    if missing:
        raise SystemExit(f"missing target ids: {missing}")
    for item_id in TARGET_IDS:
        if by_id[item_id].get("level") != "B2":
            raise SystemExit(f"unexpected level for {item_id}: {by_id[item_id].get('level')!r}")

    applied = 0
    final_values = {(item_id, path): final for item_id, path, _old, final in REVISION_EDITS}
    for item_id, path, old, new in EDITS:
        parent, key = get_parent(by_id[item_id], path)
        current = parent[key]
        if current == new or current == final_values.get((item_id, path)):
            continue
        if current != old:
            raise SystemExit(f"unexpected value at {item_id}.{path}: {current!r}")
        parent[key] = new
        applied += 1

    for item_id, path, old, new in REVISION_EDITS:
        parent, key = get_parent(by_id[item_id], path)
        current = parent[key]
        if current == new:
            continue
        if current != old:
            raise SystemExit(f"unexpected revision value at {item_id}.{path}: {current!r}")
        parent[key] = new
        applied += 1

    for item_id in TARGET_IDS:
        item = by_id[item_id]
        for question in item.get("questions", []):
            options = question.get("options", [])
            if question.get("type") != "mc" or len(options) != len(set(options)) or question.get("answer") not in options:
                raise SystemExit(f"invalid MC options/key in {item_id}:{question.get('id')}")
        for part in item.get("dictation", []):
            if not any(part in line.get("de", "") for line in item.get("lines", [])):
                raise SystemExit(f"dictation is not an exact German line fragment in {item_id}: {part!r}")

    expected_edits = 65
    if len(EDITS) != 60 or len(REVISION_EDITS) != 5 or len(EDITS) + len(REVISION_EDITS) != expected_edits:
        raise SystemExit(f"expected {expected_edits} guarded edits, got {len(EDITS) + len(REVISION_EDITS)}")
    DATA_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"<R154> applied {applied}/{expected_edits} guarded B2 content edits; questions/dictation verified.")


if __name__ == "__main__":
    main()
