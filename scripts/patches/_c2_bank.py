# -*- coding: utf-8 -*-
"""R178 (C2): Vertiefungsbibliothek B2+/C1 — NUR Ergaenzung, ausserhalb der 378 Tage.
8 C1-Texte + 6 C1-Dialoge mit Glossar und Verstaendnisfragen. Struktur wie leseleiter."""
import json

T = []  # texte
D = []  # dialoge

# ─── TEXTE ───
T.append({
 "id": "vf-t1", "level": "C1",
 "titelDe": "Wissenschaft verständlich machen: Die neue Kunst der Vermittlung",
 "titelAr": "تبسيط العلم: فنّ التواصل الجديد",
 "de": "Noch vor wenigen Jahrzehnten galt Wissenschaftskommunikation als Einbahnstraße: Forschende veröffentlichten ihre Ergebnisse in Fachzeitschriften, und die Öffentlichkeit erfuhr – wenn überhaupt – nur Bruchstücke davon. Heute hat sich dieses Verhältnis grundlegend gewandelt. Universitäten betreiben eigene Podcasts, Institute erklären ihre Arbeit in kurzen Videos, und komplexe Studien werden in allgemein verständlicher Sprache zusammengefasst. Der Grund liegt auf der Hand: Wer öffentliche Gelder erhält, muss der Gesellschaft Rechenschaft darüber ablegen, was mit diesen Mitteln geschieht. Zugleich wächst der Bedarf an verlässlicher Einordnung. In Krisenzeiten, etwa während einer Pandemie, verbreiten sich Gerüchte schneller als geprüfte Fakten. Wissenschaftlerinnen und Wissenschaftler, die sich verständlich äußern können, leisten deshalb einen Beitrag zur demokratischen Meinungsbildung. Allerdings birgt die Vereinfachung auch Risiken. Wer Forschungsergebnisse zu stark verkürzt, verzerrt sie womöglich: Aus einer vorsichtigen Vermutung wird in der Schlagzeile schnell eine scheinbare Gewissheit. Gute Wissenschaftskommunikation muss daher beides leisten – zugänglich sein und zugleich die Grenzen des Wissens ehrlich benennen. Viele Hochschulen reagieren darauf mit eigenen Ausbildungsprogrammen: Doktorandinnen und Doktoranden lernen dort, ihre Dissertation in drei Minuten so zu erklären, dass auch Laien folgen können. Die Kunst besteht nicht darin, Fachbegriffe zu vermeiden, sondern sie im richtigen Moment einzuführen und anschaulich zu erklären.",
 "ar": "قبل بضعة عقود فقط، كان التواصل العلمي يُعدّ طريقًا باتجاه واحد: كان الباحثون ينشرون نتائجهم في مجلات متخصصة، ولم يكن الجمهور يعرف – إن عرف أصلًا – سوى شذرات منها. أمّا اليوم فقد تغيّرت هذه العلاقة جذريًا. تُدير الجامعات ملفات بودكاست خاصة بها، وتشرح المعاهد عملها في مقاطع فيديو قصيرة، وتُلخَّص الدراسات المعقدة بلغة مفهومة للجميع. والسبب واضح: من يتلقى أموالًا عامة يجب أن يُحاسَب أمام المجتمع عمّا يُفعل بهذه الوسائل. وفي الوقت نفسه يتزايد الاحتياج إلى تصنيف موثوق. ففي أوقات الأزمات، كما أثناء جائحة، تنتشر الشائعات أسرع من الحقائق المدقّقة. لذلك فإنّ العلماء القادرين على التعبير بوضوح يُسهمون في تكوين الرأي الديمقراطي. غير أنّ التبسيط ينطوي أيضًا على مخاطر. فمن يختصر نتائج البحث أكثر من اللازم قد يشوّهها: إذ تتحوّل الفرضية الحذرة في العنوان سريعًا إلى يقين ظاهري. لذا يجب على التواصل العلمي الجيّد أن يحقق الأمرين: أن يكون في المتناول وأن يُسمّي حدود المعرفة بصدق في الوقت نفسه. وتستجيب جامعات كثيرة لذلك ببرامج تدريب خاصة: يتعلّم طلاب الدكتوراه هناك شرح أطروحتهم في ثلاث دقائق بحيث يستطيع حتى غير المتخصصين المتابعة. والفنّ لا يكمن في تجنّب المصطلحات المتخصصة، بل في تقديمها في اللحظة المناسبة وشرحها بشكل ملموس.",
 "glossar": [
   {"de": "die Einbahnstraße", "ar": "طريق باتجاه واحد (مجازًا: تواصل من طرف واحد)"},
   {"de": "Rechenschaft ablegen", "ar": "تقديم حساب / الخضوع للمساءلة"},
   {"de": "die Einordnung", "ar": "التصنيف في سياق / وضع الشيء في إطاره"},
   {"de": "verzerren", "ar": "تشويه / تحريف"},
   {"de": "die Gewissheit", "ar": "اليقين"},
   {"de": "zugänglich", "ar": "في المتناول / سهل الوصول والفهم"},
   {"de": "der Laie", "ar": "غير المتخصص / العامي في مجال ما"},
   {"de": "anschaulich", "ar": "بشكل ملموس وواضح بالصور والأمثلة"}],
 "fragen": [
   {"id": "vf-t1-q1", "promptDe": "Wie war Wissenschaftskommunikation früher?", "promptAr": "كيف كان التواصل العلمي في الماضي؟",
    "options": ["Ein Dialog mit der Öffentlichkeit", "Eine Einbahnstraße von der Forschung zum Publikum", "Vor allem über soziale Medien organisiert", "Nur für Krisenzeiten gedacht"], "answer": "Eine Einbahnstraße von der Forschung zum Publikum",
    "explanationAr": "النص يقول: «galt Wissenschaftskommunikation als Einbahnstraße»."},
   {"id": "vf-t1-q2", "promptDe": "Warum müssen Forschende heute Rechenschaft ablegen?", "promptAr": "لماذا يجب على الباحثين اليوم تقديم حساب؟",
    "options": ["Weil sie öffentliche Gelder erhalten", "Weil Verlage es verlangen", "Weil Podcasts beliebt sind", "Weil Laien es fordern"], "answer": "Weil sie öffentliche Gelder erhalten",
    "explanationAr": "النص: «Wer öffentliche Gelder erhält, muss der Gesellschaft Rechenschaft darüber ablegen»."},
   {"id": "vf-t1-q3", "promptDe": "Welche Gefahr birgt zu starke Vereinfachung?", "promptAr": "ما خطر التبسيط المفرط؟",
    "options": ["Sie kostet zu viel Zeit", "Sie kann Ergebnisse verzerren", "Sie braucht Fachbegriffe", "Sie verhindert Podcasts"], "answer": "Sie kann Ergebnisse verzerren",
    "explanationAr": "النص: «Wer Forschungsergebnisse zu stark verkürzt, verzerrt sie womöglich»."},
   {"id": "vf-t1-q4", "promptDe": "Worin besteht laut Text die eigentliche Kunst?", "promptAr": "فيما يكمن الفنّ الحقيقي بحسب النص؟",
    "options": ["Fachbegriffe ganz zu vermeiden", "Nur noch Videos zu produzieren", "Fachbegriffe im richtigen Moment einzuführen und anschaulich zu erklären", "Dissertationen abzuschaffen"], "answer": "Fachbegriffe im richtigen Moment einzuführen und anschaulich zu erklären",
    "explanationAr": "النص: «Die Kunst besteht nicht darin, Fachbegriffe zu vermeiden, sondern sie im richtigen Moment einzuführen und anschaulich zu erklären»."}]})

T.append({
 "id": "vf-t2", "level": "C1",
 "titelDe": "Die Stadt der kurzen Wege: Urbaner Wandel mit Maß",
 "titelAr": "مدينة المسافات القصيرة: تحوّل حضري بلا إفراط",
 "de": "Immer mehr europäische Städte experimentieren mit dem Konzept der Fünfzehn-Minuten-Stadt: Alle wichtigen Einrichtungen des Alltags – Schule, Arztpraxis, Supermarkt, Arbeitsplatz und Grünanlage – sollen zu Fuß oder mit dem Fahrrad innerhalb einer Viertelstunde erreichbar sein. Befürworter sehen darin weit mehr als ein Verkehrsprojekt. Wer kurze Wege hat, spart nicht nur Zeit, sondern begegnet auch häufiger seinen Nachbarn; Quartiere werden lebendiger, und der öffentliche Raum gewinnt an Bedeutung. Kritiker wenden jedoch ein, dass sich eine gewachsene Stadt nicht am Reißbrett neu ordnen lasse. Mieten in gut angebundenen Vierteln steigen bereits, sodass einkommensschwache Haushalte an den Stadtrand verdrängt werden – genau dorthin, wo die Wege wieder lang sind. Hinzu kommt die Frage der Zumutbarkeit: Nicht jede Tätigkeit lässt sich in Wohnungsnähe verlagern, und viele Berufe erfordern spezialisierte Standorte. Stadtforscher empfehlen deshalb einen behutsamen Umbau statt radikaler Verbote: bessere Radwege, gemischte Nutzung in Erdgeschossen und eine Verdichtung, die den Charakter der Viertel respektiert. Entscheidend sei, die Bewohner frühzeitig einzubeziehen, statt Konzepte über ihre Köpfe hinweg durchzusetzen. Wo das gelingt, berichten Anwohner nach wenigen Jahren von einer spürbar höheren Lebensqualität – auch ohne dass jemand auf sein Auto verzichten musste.",
 "ar": "تُجرّب مدن أوروبية متزايدة مفهوم مدينة الخمس عشرة دقيقة: ينبغي أن تكون جميع مرافق الحياة اليومية المهمة – المدرسة وعيادة الطبيب والسوبرماركت ومكان العمل والمساحة الخضراء – في متناول القدم أو الدراجة خلال ربع ساعة. ويرى المؤيدون في ذلك أكثر بكثير من مشروع مروري. فمن لديه مسافات قصيرة لا يوفّر الوقت فحسب، بل يلتقي جيرانه أيضًا بصورة متكررة أكثر؛ وتصبح الأحياء أكثر حيوية، ويكتسب الفضاء العام أهمية أكبر. غير أنّ النقاد يعترضون بأنّ مدينة نمت عبر التاريخ لا يمكن إعادة ترتيبها على لوحة الرسم. فالإيجارات في الأحياء جيدة الاتصال ترتفع بالفعل، بحيث تُدفع الأسر ذات الدخل الضعيف إلى أطراف المدينة – بالضبط حيث تصبح المسافات طويلة مجددًا. وتُضاف إلى ذلك مسألة المعقولية: فلا يمكن نقل كل نشاط إلى قرب السكن، وتتطلب مهن كثيرة مواقع متخصصة. لذلك يوصي باحثو المدن بإعادة بناء حذرة بدل الحظر الراديكالي: ممرات دراجات أفضل، واستخدام مختلط في الطوابق الأرضية، وتكثيف يحترم طابع الأحياء. والحاسم هو إشراك السكان مبكرًا بدل فرض المفاهيم من فوق رؤوسهم. وحيثما ينجح ذلك، يتحدث السكان بعد سنوات قليلة عن جودة حياة أعلى بشكل ملموس – حتى دون أن يضطر أحد إلى الاستغناء عن سيارته.",
 "glossar": [
   {"de": "das Quartier", "ar": "الحيّ السكني"},
   {"de": "am Reißbrett", "ar": "على لوحة الرسم (نظريًا من الصفر)"},
   {"de": "verdrängen", "ar": "إزاحة / دفع بعيدًا"},
   {"de": "die Zumutbarkeit", "ar": "المعقولية / ما يمكن تحمّله"},
   {"de": "behutsam", "ar": "بحذر وتأنٍّ"},
   {"de": "die Verdichtung", "ar": "التكثيف العمراني"},
   {"de": "über ihre Köpfe hinweg", "ar": "من فوق رؤوسهم (دون إشراك المعنيين)"},
   {"de": "verlagern (sich ~ lassen)", "ar": "قابل للنقل إلى مكان آخر"}],
 "fragen": [
   {"id": "vf-t2-q1", "promptDe": "Was bedeutet die Fünfzehn-Minuten-Stadt?", "promptAr": "ما المقصود بمدينة الخمس عشرة دقيقة؟",
    "options": ["Alle Autos werden verboten", "Wichtige Einrichtungen sind in 15 Minuten erreichbar", "Man darf nur 15 Minuten parken", "Die Innenstadt schließt nach 15 Minuten"], "answer": "Wichtige Einrichtungen sind in 15 Minuten erreichbar",
    "explanationAr": "النص: مرافق الحياة اليومية «innerhalb einer Viertelstunde erreichbar»."},
   {"id": "vf-t2-q2", "promptDe": "Welches Problem nennen die Kritiker?", "promptAr": "ما المشكلة التي يذكرها النقاد؟",
    "options": ["Zu viele Radwege", "Steigende Mieten verdrängen arme Haushalte an den Stadtrand", "Zu wenig Grünanlagen", "Schulen sind zu nah"], "answer": "Steigende Mieten verdrängen arme Haushalte an den Stadtrand",
    "explanationAr": "النص: الإيجارات ترتفع و«einkommensschwache Haushalte an den Stadtrand verdrängt werden»."},
   {"id": "vf-t2-q3", "promptDe": "Was empfehlen Stadtforscher stattdessen?", "promptAr": "بمَ يوصي باحثو المدن بدلًا من ذلك؟",
    "options": ["Radikale Verbote", "Einen behutsamen Umbau mit Bewohnerbeteiligung", "Neue Städte auf dem Land", "Keine Veränderung"], "answer": "Einen behutsamen Umbau mit Bewohnerbeteiligung",
    "explanationAr": "النص: «einen behutsamen Umbau statt radikaler Verbote» و«die Bewohner frühzeitig einzubeziehen»."},
   {"id": "vf-t2-q4", "promptDe": "Was berichten Anwohner gelungener Projekte?", "promptAr": "ما الذي يرويه سكان المشاريع الناجحة؟",
    "options": ["Sie mussten ihr Auto verkaufen", "Spürbar höhere Lebensqualität, ohne dass jemand aufs Auto verzichten musste", "Die Wege wurden länger", "Die Mieten sanken überall"], "answer": "Spürbar höhere Lebensqualität, ohne dass jemand aufs Auto verzichten musste",
    "explanationAr": "النص: «eine spürbar höhere Lebensqualität – auch ohne dass jemand auf sein Auto verzichten musste»."}]})

T.append({
 "id": "vf-t3", "level": "C1",
 "titelDe": "Lebenslanges Lernen: Berufsbilder im Umbruch",
 "titelAr": "التعلّم مدى الحياة: مهن في طور التحوّل",
 "de": "Der Gedanke, man lerne einen Beruf und übe ihn dann vierzig Jahre unverändert aus, gehört zunehmend der Vergangenheit an. Automatisierung und künstliche Intelligenz verändern Tätigkeiten nicht nur in Fabriken, sondern längst auch in Büros, Kanzleien und Krankenhäusern. Studien gehen davon aus, dass ein erheblicher Teil der heutigen Aufgabenprofile innerhalb eines Jahrzehnts wegfällt oder sich grundlegend wandelt. Daraus folgt jedoch keineswegs, dass menschliche Arbeit überflüssig wird. Vielmehr verschiebt sich ihr Schwerpunkt: Routinetätigkeiten übernehmen Maschinen, während Urteilsvermögen, Empathie und kreative Problemlösung an Wert gewinnen. Für Beschäftigte bedeutet das eine dauerhafte Lernbereitschaft. Arbeitgeber wiederum stehen in der Pflicht, Weiterbildung nicht als Belohnung für wenige, sondern als selbstverständlichen Teil der Arbeitszeit zu organisieren. Wo das gelingt, zeigen sich bemerkenswerte Effekte: Teams, die regelmäßig geschult werden, berichten von höherer Motivation und geringerer Fluktuation. Auch der Staat ist gefordert – etwa durch Bildungsgutscheine, die unabhängig vom jeweiligen Arbeitgeber eingelöst werden können. Wer lebenslanges Lernen ernst nimmt, darf es schließlich nicht dem Zufall oder der Brieftasche des Einzelnen überlassen. Lernen wird damit zu einer Infrastrukturaufgabe, vergleichbar mit Straßen oder Stromnetzen: unsichtbar, solange sie funktioniert, aber unverzichtbar.",
 "ar": "أصبحت فكرة أن يتعلّم المرء مهنة ثم يمارسها أربعين عامًا دون تغيير تنتمي بشكل متزايد إلى الماضي. فالأتمتة والذكاء الاصطناعي يغيّران الأنشطة ليس في المصانع فقط، بل منذ زمن أيضًا في المكاتب ومكاتب المحاماة والمستشفيات. وتفترض الدراسات أنّ جزءًا كبيرًا من ملامح المهام الحالية سيختفي خلال عقد أو يتغير جذريًا. لكن لا يترتب على ذلك بأي حال أنّ العمل البشري سيصبح زائدًا عن الحاجة. بل ينتقل مركز ثقله: تتولى الآلات المهام الروتينية، بينما يكتسب حسن التقدير والتعاطف وحل المشكلات الإبداعي قيمة أكبر. ويعني ذلك للموظفين استعدادًا دائمًا للتعلّم. أما أصحاب العمل فعليهم واجب تنظيم التدريب المستمر لا كمكافأة للقليلين، بل كجزء بديهي من وقت العمل. وحيثما ينجح ذلك، تظهر آثار ملفتة: فالفرق التي تتلقى تدريبًا منتظمًا تتحدث عن دافعية أعلى وتنقّل أقل للموظفين. والدولة أيضًا مطالبة – مثلًا عبر قسائم تعليمية يمكن صرفها بمعزل عن صاحب العمل المعني. فمن يأخذ التعلّم مدى الحياة على محمل الجد لا يجوز له في النهاية أن يتركه للصدفة أو لمحفظة الفرد. وهكذا يصبح التعلّم مهمة بنية تحتية، شبيهة بالطرق أو شبكات الكهرباء: غير مرئية ما دامت تعمل، لكن لا غنى عنها.",
 "glossar": [
   {"de": "der Umbruch", "ar": "تحوّل جذري / منعطف"},
   {"de": "das Aufgabenprofil", "ar": "ملمح المهام في وظيفة ما"},
   {"de": "das Urteilsvermögen", "ar": "حسن التقدير والتمييز"},
   {"de": "die Fluktuation", "ar": "تنقّل الموظفين بين الشركات"},
   {"de": "die Pflicht (in der ~ stehen)", "ar": "يكون ملزمًا / عليه واجب"},
   {"de": "einlösen", "ar": "صرف / استبدال (قسيمة بقيمتها)"},
   {"de": "die Brieftasche", "ar": "المحفظة"},
   {"de": "unverzichtbar", "ar": "لا غنى عنه"}],
 "fragen": [
   {"id": "vf-t3-q1", "promptDe": "Was gehört laut Text der Vergangenheit an?", "promptAr": "ما الذي أصبح من الماضي بحسب النص؟",
    "options": ["Berufe überhaupt", "Einen Beruf lernen und 40 Jahre unverändert ausüben", "Fabrikarbeit", "Weiterbildung"], "answer": "Einen Beruf lernen und 40 Jahre unverändert ausüben",
    "explanationAr": "النص: «Der Gedanke, man lerne einen Beruf und übe ihn dann vierzig Jahre unverändert aus, gehört zunehmend der Vergangenheit an»."},
   {"id": "vf-t3-q2", "promptDe": "Was gewinnen an Wert, wenn Maschinen Routinen übernehmen?", "promptAr": "ما الذي يكتسب قيمة حين تتولى الآلات الروتين؟",
    "options": ["Längere Arbeitszeiten", "Urteilsvermögen, Empathie und kreative Problemlösung", "Weniger Pausen", "Mehr Kontrolle"], "answer": "Urteilsvermögen, Empathie und kreative Problemlösung",
    "explanationAr": "النص: «während Urteilsvermögen, Empathie und kreative Problemlösung an Wert gewinnen»."},
   {"id": "vf-t3-q3", "promptDe": "Welche Effekte zeigen geschulte Teams?", "promptAr": "ما آثار الفرق المدربة بانتظام؟",
    "options": ["Höhere Motivation und geringere Fluktuation", "Mehr Überstunden", "Weniger Gehalt", "Größere Büros"], "answer": "Höhere Motivation und geringere Fluktuation",
    "explanationAr": "النص: «höherer Motivation und geringerer Fluktuation»."},
   {"id": "vf-t3-q4", "promptDe": "Womit vergleicht der Text das Lernen am Ende?", "promptAr": "بمَ يقارن النص التعلّم في الختام؟",
    "options": ["Mit einem Wettbewerb", "Mit Infrastruktur wie Straßen oder Stromnetzen", "Mit einem Hobby", "Mit einer Prüfung"], "answer": "Mit Infrastruktur wie Straßen oder Stromnetzen",
    "explanationAr": "النص: «vergleichbar mit Straßen oder Stromnetzen»."}]})

T.append({
 "id": "vf-t4", "level": "C1",
 "titelDe": "Datenschutz im Alltag: Zwischen Bequemlichkeit und Kontrolle",
 "titelAr": "حماية البيانات في الحياة اليومية: بين الراحة والسيطرة",
 "de": "Jede Suchanfrage, jeder Einkauf und nahezu jeder Weg durch die Stadt hinterlässt digitale Spuren. Unternehmen werten diese Daten aus, um Werbung zu personalisieren, Preise anzupassen oder neue Produkte zu entwickeln. Viele Nutzer nehmen das stillschweigend in Kauf: Die Bequemlichkeit kostenloser Dienste scheint den Preis der eigenen Daten aufzuwiegen. Doch diese Rechnung geht nicht für alle auf. Wer beispielsweise ständig dynamische Preise angezeigt bekommt, zahlt unter Umständen mehr als andere – ohne es zu bemerken. Auch Versicherungen und Arbeitgeber interessieren sich zunehmend für Verhaltensdaten, etwa aus Fitness-Apps. Der Gesetzgeber hat mit der Datenschutz-Grundverordnung zwar einen Rahmen geschaffen, der Auskunfts- und Löschrechte garantiert. In der Praxis scheitern viele Bürger jedoch an undurchsichtigen Einwilligungsformularen, die so gestaltet sind, dass man fast zwangsläufig allem zustimmt. Fachleute sprechen von sogenannten Dark Patterns: Gestaltungstricks, die Nutzer zu Entscheidungen verleiten, die sie bei klarem Blick nicht treffen würden. Abhilfe versprechen einfachere Standardeinstellungen, bei denen Datensparsamkeit voreingestellt ist und jede weitergehende Nutzung aktiv gewählt werden muss. Letztlich bleibt der Schutz der Privatsphäre eine gesellschaftliche Aushandlung: Technik allein wird nicht entscheiden, wie viel Beobachtung eine freie Gesellschaft ertragen will.",
 "ar": "كل عملية بحث وكل عملية شراء وتقريبًا كل طريق عبر المدينة يترك آثارًا رقمية. وتقيّم الشركات هذه البيانات لتخصيص الإعلانات أو تعديل الأسعار أو تطوير منتجات جديدة. ويتقبّل مستخدمون كثيرون ذلك بصمت: إذ يبدو أنّ راحة الخدمات المجانية توازن ثمن بياناتهم الخاصة. لكن هذه الحسبة لا تنجح مع الجميع. فمن تُعرض عليه مثلًا أسعار متغيرة باستمرار قد يدفع في ظروف معينة أكثر من غيره – دون أن يلاحظ. كما تهتم شركات التأمين وأصحاب العمل بشكل متزايد بالبيانات السلوكية، مثل بيانات تطبيقات اللياقة. صحيح أنّ المشرّع أنشأ بالإطار العام لحماية البيانات إطارًا يضمن حقوق الاطلاع والحذف. لكنّ المواطنين في الممارسة العملية يفشلون أمام نماذج موافقة غامضة مصممة بحيث يوافق المرء على كل شيء تقريبًا حتمًا. ويتحدث الخبراء عن ما يسمى الأنماط المظلمة: حيل تصميمية تغري المستخدمين بقرارات ما كانوا ليتخذوها بنظر صافٍ. ويُتوقع العلاج من إعدادات افتراضية أبسط، يكون فيها الاقتصاد في البيانات مضبوطًا مسبقًا ويجب اختيار كل استخدام أوسع بشكل فعّال. وفي النهاية يبقى حماية الخصوصية تفاوضًا مجتمعيًا: فالتقنية وحدها لن تقرر كمّ المراقبة التي يريد مجتمع حر تحمّله.",
 "glossar": [
   {"de": "stillschweigend in Kauf nehmen", "ar": "تقبّل شيء بصمت على مضض"},
   {"de": "aufwiegen", "ar": "يوازن / يعادل في القيمة"},
   {"de": "unter Umständen", "ar": "في ظروف معينة / ربما"},
   {"de": "die Einwilligung", "ar": "الموافقة (القانونية)"},
   {"de": "undurchsichtig", "ar": "غامض / غير شفاف"},
   {"de": "verleiten", "ar": "إغراء / دفع إلى فعل خاطئ"},
   {"de": "die Datensparsamkeit", "ar": "الاقتصاد في جمع البيانات"},
   {"de": "die Aushandlung", "ar": "التفاوض / المساومة الجماعية"}],
 "fragen": [
   {"id": "vf-t4-q1", "promptDe": "Warum werten Unternehmen Nutzerdaten aus?", "promptAr": "لماذا تحلّل الشركات بيانات المستخدمين؟",
    "options": ["Um Werbung zu personalisieren und Produkte zu entwickeln", "Um Steuern zu berechnen", "Um Städte zu planen", "Um Fitness zu verbessern"], "answer": "Um Werbung zu personalisieren und Produkte zu entwickeln",
    "explanationAr": "النص: «um Werbung zu personalisieren, Preise anzupassen oder neue Produkte zu entwickeln»."},
   {"id": "vf-t4-q2", "promptDe": "Was sind Dark Patterns?", "promptAr": "ما الأنماط المظلمة؟",
    "options": ["Dunkle Farben in Apps", "Gestaltungstricks, die Nutzer zu ungewollten Entscheidungen verleiten", "Verschlüsselte Daten", "Alte Formulare"], "answer": "Gestaltungstricks, die Nutzer zu ungewollten Entscheidungen verleiten",
    "explanationAr": "النص: «Gestaltungstricks, die Nutzer zu Entscheidungen verleiten»."},
   {"id": "vf-t4-q3", "promptDe": "Woran scheitern viele Bürger in der Praxis?", "promptAr": "بمَ يفشل مواطنون كثيرون عمليًا؟",
    "options": ["An zu kurzen Passwörtern", "An undurchsichtigen Einwilligungsformularen", "An fehlenden Apps", "An hohen Gebühren"], "answer": "An undurchsichtigen Einwilligungsformularen",
    "explanationAr": "النص: «scheitern viele Bürger jedoch an undurchsichtigen Einwilligungsformularen»."},
   {"id": "vf-t4-q4", "promptDe": "Was verspricht laut Text Abhilfe?", "promptAr": "ما العلاج المتوقع بحسب النص؟",
    "options": ["Mehr Werbung", "Standardeinstellungen mit voreingestellter Datensparsamkeit", "Verbot aller Apps", "Längere Formulare"], "answer": "Standardeinstellungen mit voreingestellter Datensparsamkeit",
    "explanationAr": "النص: «bei denen Datensparsamkeit voreingestellt ist»."}]})

T.append({
 "id": "vf-t5", "level": "C1",
 "titelDe": "Gesundheitssystem unter Druck: Pflege braucht neue Antworten",
 "titelAr": "النظام الصحي تحت الضغط: الرعاية تحتاج أجوبة جديدة",
 "de": "Es ist ein offenes Geheimnis: In vielen Ländern Europas fehlen Pflegekräfte in erheblichem Ausmaß. Die Ursachen sind vielfältig – Schichtdienst, körperliche Belastung und eine Bezahlung, die der Verantwortung des Berufs kaum gerecht wird. Zugleich steigt die Zahl pflegebedürftiger Menschen stetig, weil die Bevölkerung älter wird. Einzelne Kliniken reagieren mit Prämien für neue Mitarbeiter, doch solche Maßnahmen verlagern das Problem nur: Was die eine Einrichtung gewinnt, verliert die andere. Nachhaltiger wirken Veränderungen im Arbeitsalltag selbst. Wo Pflegekräfte ihre Dienstpläne mitgestalten können und verlässlich freie Tage haben, sinken Krankenstände und Kündigungen messbar. Auch die Aufwertung der Ausbildung spielt eine Rolle: Ein Pflegestudium, das mit einem akademischen Grad abschließt, eröffnet Karrierewege in Leitung und Lehre und macht den Beruf für Abiturienten attraktiver. Nicht zuletzt verspricht die Digitalisierung Entlastung – vorausgesetzt, sie wird mit den Beschäftigten statt über sie hinweg eingeführt. Dokumentationssoftware, die doppelte Eingaben erspart, schenkt Zeit für das eigentliche: die Zuwendung zum Patienten. Denn am Ende lässt sich gute Pflege nicht allein in Minuten und Kennzahlen messen; sie zeigt sich in der Qualität menschlicher Begegnung.",
 "ar": "إنه سرّ مكشوف: في بلدان أوروبية كثيرة يوجد نقص كبير في أطقم التمريض والرعاية. والأسباب متنوعة – عمل بنظام الورديات، وإجهاد جسدي، وأجر لا يليق بمسؤولية المهنة. وفي الوقت نفسه يزداد عدد المحتاجين إلى الرعاية باستمرار لأن السكان يتقدمون في العمر. وتردّ عيادات مفردة بمكافآت للموظفين الجدد، لكن مثل هذه التدابير تنقل المشكلة فقط: فما تكسبه مؤسسة تخسره أخرى. أما التغييرات في الحياة العملية اليومية نفسها فهي أكثر استدامة في أثرها. فحيثما يستطيع الممرضون المشاركة في تصميم جداول خدمتهم ولديهم أيام عطلة موثوقة، تنخفض الإجازات المرضية والاستقالات بشكل قابل للقياس. كما يلعب رفع قيمة التدريب دورًا: فدراسة تمريض تنتهي بدرجة أكاديمية تفتح مسارات مهنية في القيادة والتدريس وتجعل المهنة أكثر جاذبية لحملة الشهادة الثانوية. وأخيرًا تعد الرقمنة بالتخفيف – شرط أن تُدخل مع الموظفين لا من فوقهم. فبرامج التوثيق التي توفّر الإدخال المزدوج تمنح وقتًا للجوهر: العناية بالمريض. ففي النهاية لا يمكن قياس الرعاية الجيدة بالدقائق والمؤشرات وحدها؛ بل تظهر في جودة اللقاء الإنساني.",
 "glossar": [
   {"de": "die Pflegekraft", "ar": "الممرض / عامل الرعاية"},
   {"de": "gerecht werden", "ar": "يليق بـ / يكون على قدر"},
   {"de": "pflegebedürftig", "ar": "محتاج إلى الرعاية"},
   {"de": "die Prämie", "ar": "مكافأة مالية"},
   {"de": "nachhaltig", "ar": "مستدام"},
   {"de": "der Krankenstand", "ar": "معدل الإجازات المرضية"},
   {"de": "die Aufwertung", "ar": "رفع القيمة والمكانة"},
   {"de": "die Zuwendung", "ar": "العناية والاهتمام الشخصي"}],
 "fragen": [
   {"id": "vf-t5-q1", "promptDe": "Welche Ursachen für den Pflegemangel nennt der Text?", "promptAr": "ما أسباب نقص الرعاية التي يذكرها النص؟",
    "options": ["Zu viele Kliniken", "Schichtdienst, Belastung und Bezahlung", "Zu kurze Ausbildung", "Zu wenig Patienten"], "answer": "Schichtdienst, Belastung und Bezahlung",
    "explanationAr": "النص: «Schichtdienst, körperliche Belastung und eine Bezahlung, die der Verantwortung des Berufs kaum gerecht wird»."},
   {"id": "vf-t5-q2", "promptDe": "Warum helfen Prämien nur begrenzt?", "promptAr": "لماذا لا تساعد المكافآت إلا بشكل محدود؟",
    "options": ["Sie sind verboten", "Sie verlagern das Problem nur zwischen Einrichtungen", "Sie kosten zu wenig", "Niemand will sie"], "answer": "Sie verlagern das Problem nur zwischen Einrichtungen",
    "explanationAr": "النص: «doch solche Maßnahmen verlagern das Problem nur»."},
   {"id": "vf-t5-q3", "promptDe": "Was senkt Krankenstände und Kündigungen messbar?", "promptAr": "ما الذي يخفض الإجازات والاستقالات بشكل قابل للقياس؟",
    "options": ["Mehr Dokumentation", "Dienstpläne mitgestalten und verlässlich freie Tage", "Längere Schichten", "Weniger Urlaub"], "answer": "Dienstpläne mitgestalten und verlässlich freie Tage",
    "explanationAr": "النص: «Wo Pflegekräfte ihre Dienstpläne mitgestalten können und verlässlich freie Tage haben, sinken Krankenstände und Kündigungen messbar»."},
   {"id": "vf-t5-q4", "promptDe": "Worin zeigt sich gute Pflege am Ende?", "promptAr": "فيمَ تظهر الرعاية الجيدة في النهاية؟",
    "options": ["In Kennzahlen", "In Minutenplänen", "In der Qualität menschlicher Begegnung", "In neuer Software"], "answer": "In der Qualität menschlicher Begegnung",
    "explanationAr": "النص: «sie zeigt sich in der Qualität menschlicher Begegnung»."}]})

T.append({
 "id": "vf-t6", "level": "C1",
 "titelDe": "Klimapolitik zwischen Anspruch und Wirklichkeit",
 "titelAr": "سياسة المناخ بين الطموح والواقع",
 "de": "Kaum ein Politikfeld ist von einer größeren Kluft zwischen Anspruch und Wirklichkeit geprägt als der Klimaschutz. Nahezu alle Staaten haben sich zu ehrgeizigen Zielen verpflichtet, doch die globalen Emissionen sinken langsamer als nötig – in manchen Regionen steigen sie sogar weiter. Die Gründe sind struktureller Natur: Energieversorgung, Verkehr und Industrie lassen sich nicht per Dekret umbauen, sondern nur in Jahrzehnte währenden Prozessen. Hinzu kommen Zielkonflikte. Billige Energie sichert Arbeitsplätze in der Industrie, verteuert aber den Umstieg, wenn Alternativen noch nicht wettbewerbsfähig sind. Umgekehrt erzeugen Förderprogramme für erneuerbare Energien neue Branchen mit Hunderttausenden Arbeitsplätzen. Erfolgreiche Klimapolitik zeichnet sich deshalb weniger durch spektakuläre Einzelmaßnahmen aus als durch verlässliche Rahmensetzung: Ein langsam, aber stetig steigender CO₂-Preis gibt Unternehmen Planungssicherheit und belohnt jede eingesparte Tonne. Ebenso wichtig ist die soziale Abfederung – wer überdurchschnittlich belastet wird, etwa Pendler auf dem Land, braucht Ausgleich, damit Klimaschutz nicht als Projekt wohlhabender Stadtbewohner wahrgenommen wird. Schließlich entscheidet auch die Glaubwürdigkeit der Politik: Ziele, die wiederholt verkündet und ebenso oft verschoben werden, untergraben das Vertrauen der Bürger in die Ernsthaftigkeit des gesamten Vorhabens.",
 "ar": "لا يكاد يوجد مجال سياسي يتميز بفجوة أكبر بين الطموح والواقع مثل حماية المناخ. فقد التزمت جميع الدول تقريبًا بأهداف طموحة، لكن الانبعاثات العالمية تنخفض ببطء أقل من اللازم – بل ترتفع في بعض المناطق أكثر. والأسباب بنيوية بطبيعتها: فإمدادات الطاقة والنقل والصناعة لا يمكن إعادة بنائها بمرسوم، بل عبر عمليات تستمر عقودًا. تُضاف إلى ذلك تعارضات الأهداف. فالطاقة الرخيصة تؤمّن الوظائف في الصناعة، لكنها تجعل التحوّل أغلى حين لا تكون البدائل قادرة على المنافسة بعد. وبالعكس، تولّد برامج دعم الطاقات المتجددة قطاعات جديدة بمئات آلاف الوظائف. لذلك تتميز سياسة المناخ الناجحة بوضع إطار موثوق أكثر مما تتميز بتدابير فردية مبهرجة: فسعر CO₂ يرتفع ببطء لكن بثبات يمنح الشركات أمانًا في التخطيط ويكافئ كل طن يتم توفيره. ومهم بالقدر نفسه التخفيف الاجتماعي – فمن يتحمل عبئًا فوق المتوسط، مثل المتنقلين في الريف، يحتاج إلى تعويض، حتى لا يُنظر إلى حماية المناخ كمشروع لسكان المدن الأثرياء. وأخيرًا تحسم مصداقية السياسة أيضًا: فالأهداف التي تُعلن مرارًا وتُرحّل بالتكرار نفسه تقوّض ثقة المواطنين في جدية المشروع برمته.",
 "glossar": [
   {"de": "die Kluft", "ar": "الفجوة / الهوة"},
   {"de": "sich verpflichten zu", "ar": "الالتزام بـ"},
   {"de": "per Dekret", "ar": "بمرسوم / بقرار فوقي"},
   {"de": "der Zielkonflikt", "ar": "تعارض الأهداف"},
   {"de": "wettbewerbsfähig", "ar": "قادر على المنافسة"},
   {"de": "die Rahmensetzung", "ar": "وضع الإطار (القواعد العامة)"},
   {"de": "die Abfederung", "ar": "التخفيف / امتصاص الصدمة"},
   {"de": "untergraben", "ar": "تقويض / زعزعة من الأساس"}],
 "fragen": [
   {"id": "vf-t6-q1", "promptDe": "Warum ist der Umbau laut Text so langsam?", "promptAr": "لماذا التحوّل بطيء بحسب النص؟",
    "options": ["Niemand will Klimaschutz", "Energie, Verkehr und Industrie lassen sich nur in Jahrzehnte dauernden Prozessen umbauen", "Es fehlen Ziele", "Die Technik existiert nicht"], "answer": "Energie, Verkehr und Industrie lassen sich nur in Jahrzehnte dauernden Prozessen umbauen",
    "explanationAr": "النص: «lassen sich nicht per Dekret umbauen, sondern nur in Jahrzehnten währenden Prozessen»."},
   {"id": "vf-t6-q2", "promptDe": "Was gibt Unternehmen Planungssicherheit?", "promptAr": "ما الذي يمنح الشركات أمان التخطيط؟",
    "options": ["Einmalige Subventionen", "Ein langsam, aber stetig steigender CO₂-Preis", "Werbekampagnen", "Neue Gesetze ohne Preis"], "answer": "Ein langsam, aber stetig steigender CO₂-Preis",
    "explanationAr": "النص: «Ein langsam, aber stetig steigender CO₂-Preis gibt Unternehmen Planungssicherheit»."},
   {"id": "vf-t6-q3", "promptDe": "Warum braucht es soziale Abfederung?", "promptAr": "لماذا يلزم التخفيف الاجتماعي؟",
    "options": ["Damit Klimaschutz nicht als Projekt wohlhabender Stadtbewohner gilt", "Damit Autos billiger werden", "Damit Pendler umziehen", "Damit Firmen sparen"], "answer": "Damit Klimaschutz nicht als Projekt wohlhabender Stadtbewohner gilt",
    "explanationAr": "النص: «damit Klimaschutz nicht als Projekt wohlhabender Stadtbewohner wahrgenommen wird»."},
   {"id": "vf-t6-q4", "promptDe": "Was untergräbt das Vertrauen der Bürger?", "promptAr": "ما الذي يقوّض ثقة المواطنين؟",
    "options": ["Zu hohe Ziele an sich", "Wiederholt verkündete und verschobene Ziele", "Neue Branchen", "CO₂-Preise"], "answer": "Wiederholt verkündete und verschobene Ziele",
    "explanationAr": "النص: «Ziele, die wiederholt verkündet und ebenso oft verschoben werden, untergraben das Vertrauen»."}]})

T.append({
 "id": "vf-t7", "level": "C1",
 "titelDe": "Die Rückkehr der Handschrift: Schreiben in digitalen Zeiten",
 "titelAr": "عودة الكتابة اليدوية: الكتابة في الزمن الرقمي",
 "de": "Lange galt die Handschrift als Auslaufmodell. Schülerinnen und Schüler tippten Hausaufgaben am Laptop, Studierende fotografierten Tafelbilder statt mitzuschreiben, und selbst Einkaufszettel wanderten ins Smartphone. Doch seit einigen Jahren zeichnet sich eine bemerkenswerte Gegenbewegung ab: Ausgerechnet junge Menschen kaufen wieder Füller und Notizbücher, und Schreibwarenläden verzeichnen steigende Umsätze. Lernforscher überrascht das nicht. Wer von Hand schreibt, ist gezwungen, langsamer zu denken und das Gehörte in eigene Worte zu fassen – ein Prozess, der das Verständnis nachweislich vertieft. Maschinenschreiben dagegen verführt zum wörtlichen Mitprotokollieren, bei dem die Inhalte kaum verarbeitet werden. Hinzu kommt ein ästhetischer Genuss: Das eigene Schriftbild ist unverwechselbar und verleiht Gedanken eine persönliche Note, die kein Standardfont ersetzen kann. Allerdings wäre es verkürzt, Handschrift und Tastatur gegeneinander auszuspielen. Für lange Texte, gemeinsame Bearbeitung und barrierefreies Arbeiten bleibt der Computer unverzichtbar. Die Kunst der Zukunft dürfte im bewussten Wechsel liegen: Notizen von Hand, wo es ums Denken geht – digitale Werkzeuge, wo Tempo und Teilen zählen. So wird die Handschrift nicht zum Relikt, sondern zu einer Kulturtechnik, die man sich bewusst leistet.",
 "ar": "طالما عُدّت الكتابة اليدوية نموذجًا آفلًا. فالتلاميذ كانوا يكتبون الواجبات على الحاسوب المحمول، والطلاب يصوّرون ما على السبورة بدل كتابته، وحتى قائمة التسوق هاجرت إلى الهاتف الذكي. لكن منذ سنوات قليلة تترسم حركة مضادة ملفتة: فالشباب بالذات يشترون مجددًا أقلام الحبر والدفاتر، وتسجّل متاجر القرطاسية مبيعات متزايدة. ولا يفاجأ باحثو التعلم بذلك. فمن يكتب بيده يُجبر على التفكير ببطء أكبر وصياغة المسموع بكلماته الخاصة – وهي عملية تعمّق الفهم بشكل مثبت. أما الكتابة الآلية فتغري بالتدوين الحرفي الذي لا تكاد فيه المحتويات أن تُعالج. يُضاف إلى ذلك متعة جمالية: فخط المرء الخاص لا يُشبه غيره ويمنح الأفكار لمسة شخصية لا يستطيع أي خط قياسي أن يحل محلها. غير أنه سيكون اختزالًا أن نضع الكتابة اليدوية ولوحة المفاتيح في مواجهة بعضهما. فالنصوص الطويلة والتحرير المشترك والعمل الخالي من العوائق يبقى الحاسوب فيها لا غنى عنه. وفن المستقبل سيكمن غالبًا في التنقل الواعي: ملاحظات باليد حيث يتعلق الأمر بالتفكير – وأدوات رقمية حيث تهم السرعة والمشاركة. وهكذا لا تصبح الكتابة اليدوية أثرًا باقيًا، بل تقنية ثقافية يمنح المرء نفسه إياها بوعي.",
 "glossar": [
   {"de": "das Auslaufmodell", "ar": "نموذج آفل / في طريقه للانتهاء"},
   {"de": "die Gegenbewegung", "ar": "حركة مضادة"},
   {"de": "nachweislich", "ar": "بشكل مثبت بالأدلة"},
   {"de": "das Mitprotokollieren", "ar": "التدوين المتزامن لما يقال"},
   {"de": "unverwechselbar", "ar": "لا يُشبه غيره / فريد"},
   {"de": "verkürzt", "ar": "مختزل / مبسّط أكثر من اللازم"},
   {"de": "barrierefrei", "ar": "خالٍ من العوائق (لذوي الاحتياجات)"},
   {"de": "das Relikt", "ar": "أثر باقٍ من زمن مضى"}],
 "fragen": [
   {"id": "vf-t7-q1", "promptDe": "Was kaufen junge Menschen wieder vermehrt?", "promptAr": "ما الذي يشتريه الشباب مجددًا بشكل متزايد؟",
    "options": ["Laptops", "Füller und Notizbücher", "Smartphones", "Tafeln"], "answer": "Füller und Notizbücher",
    "explanationAr": "النص: «kaufen wieder Füller und Notizbücher»."},
   {"id": "vf-t7-q2", "promptDe": "Warum vertieft Handschrift das Verständnis?", "promptAr": "لماذا تعمّق الكتابة اليدوية الفهم؟",
    "options": ["Sie ist schneller", "Man muss langsamer denken und Gehörtes in eigene Worte fassen", "Sie sieht schöner aus", "Sie spart Papier"], "answer": "Man muss langsamer denken und Gehörtes in eigene Worte fassen",
    "explanationAr": "النص: «ist gezwungen, langsamer zu denken und das Gehörte in eigene Worte zu fassen»."},
   {"id": "vf-t7-q3", "promptDe": "Wozu verführt Maschinenschreiben?", "promptAr": "إلى ماذا تغري الكتابة الآلية؟",
    "options": ["Zum wörtlichen Mitprotokollieren ohne Verarbeitung", "Zum Zeichnen", "Zum Langsamschreiben", "Zum Auswendiglernen"], "answer": "Zum wörtlichen Mitprotokollieren ohne Verarbeitung",
    "explanationAr": "النص: «verführt zum wörtlichen Mitprotokollieren»."},
   {"id": "vf-t7-q4", "promptDe": "Worin liegt laut Text die Kunst der Zukunft?", "promptAr": "فيمَ يكمن فنّ المستقبل بحسب النص؟",
    "options": ["Nur noch von Hand schreiben", "Im bewussten Wechsel zwischen Handschrift und digitalen Werkzeugen", "Nur noch tippen", "Schreiben abschaffen"], "answer": "Im bewussten Wechsel zwischen Handschrift und digitalen Werkzeugen",
    "explanationAr": "النص: «Die Kunst der Zukunft dürfte im bewussten Wechsel liegen»."}]})

T.append({
 "id": "vf-t8", "level": "C1",
 "titelDe": "Wohnen im Alter: Zwischen Eigenheim und Gemeinschaft",
 "titelAr": "السكن في الشيخوخة: بين البيت الخاص والمجتمع",
 "de": "Die Frage, wie man im Alter wohnen möchte, stellen sich viele Menschen erst dann, wenn sie sich nicht mehr ausweichen lässt – nach einem Sturz etwa oder wenn der Garten zur Last wird. Dabei böten frühe Entscheidungen weit mehr Gestaltungsspielraum. Wer mit sechzig über Barrierefreiheit nachdenkt, kann das eigene Haus schrittweise anpassen: schwellenlose Dusche, Treppenlift, ein Schlafzimmer im Erdgeschoss. Andere suchen bewusst den Anschluss an Gleichgesinnte. Wohnprojekte, in denen jede Partei ihre eigene Wohnung hat, Gemeinschaftsräume aber geteilt werden, erfreuen sich wachsender Beliebtheit. Ihr Prinzip lautet: so viel Privatsphäre wie nötig, so viel Gemeinschaft wie gewünscht. Gegenseitige Hilfe im Alltag – vom Blumengießen im Urlaub bis zur Fahrt zum Arzt – ersetzt dort teilweise professionelle Dienste. Freilich sind solche Projekte kein Allheilmittel. Sie verlangen Kompromissbereitschaft und funktionieren nur, solange die Bewohner ihre Konflikte selbst regeln können. Auch finanziell bleibt die Spanne groß: Das umgebaute Eigenheim bindet Vermögen, während Genossenschaftsanteile vergleichsweise günstig sein können. Entscheidend ist weniger die gewählte Form als der Zeitpunkt: Wer sich früh mit der eigenen Vorstellung vom guten Wohnen auseinandersetzt, entscheidet selbst – statt später von Umständen entschieden zu werden.",
 "ar": "إن سؤال كيف يريد المرء أن يسكن في شيخوخته لا يطرحه كثير من الناس على أنفسهم إلا حين لا يعود بالإمكان تجنّبه – بعد سقوط مثلًا أو حين يصبح الحديقة عبئًا. وفي الحقيقة توفّر القرارات المبكرة مساحة تشكيل أوسع بكثير. فمن يفكر في سن الستين في الخلو من العوائق يمكنه تكييف بيته تدريجيًا: دش دون عتبات، ومصعد للدرج، وغرفة نوم في الطابق الأرضي. وآخرون يبحثون بوعي عن الارتباط بأناس مثلهم. فمشاريع سكنية يكون فيها لكل طرف شقته الخاصة بينما تُشارك في الغرف المشتركة تحظى بشعبية متزايدة. ومبدؤها: خصوصية بقدر الحاجة، ومجتمع بقدر الرغبة. والمساعدة المتبادلة في الحياة اليومية – من سقي الزهور في الإجازة إلى التوصيلة إلى الطبيب – تحل هناك جزئيًا محل الخدمات الاحترافية. وبالطبع ليست مثل هذه المشاريع علاجًا لكل شيء. فهي تتطلب استعدادًا للتسوية ولا تنجح إلا ما دام السكان قادرين على تسوية نزاعاتهم بأنفسهم. ماليًا أيضًا يبقى المدى واسعًا: فالبيت الخاص المُعاد تجهيزه يربط ثروة، بينما قد تكون حصص التعاونيات رخيصة نسبيًا. والحاسم ليس الشكل المختار بقدر ما هو التوقيت: فمن يواجه مبكرًا تصوّره الخاص عن السكن الجيّد يقرر بنفسه – بدل أن يُقرَّر عنه لاحقًا بفعل الظروف.",
 "glossar": [
   {"de": "sich nicht ausweichen lassen", "ar": "لا يمكن تجنّبه"},
   {"de": "der Gestaltungsspielraum", "ar": "مساحة التشكيل والتصرف"},
   {"de": "schwellenlos", "ar": "دون عتبات"},
   {"de": "Gleichgesinnte", "ar": "أناس من نفس التفكير والاهتمام"},
   {"de": "das Allheilmittel", "ar": "علاج لكل شيء"},
   {"de": "die Kompromissbereitschaft", "ar": "الاستعداد للتسوية"},
   {"de": "die Genossenschaft", "ar": "التعاونية (السكنية)"},
   {"de": "sich auseinandersetzen mit", "ar": "مواجهة موضوع والتفكير فيه بعمق"}],
 "fragen": [
   {"id": "vf-t8-q1", "promptDe": "Wann stellen sich viele die Wohnfrage erst?", "promptAr": "متى يطرح كثيرون سؤال السكن على أنفسهم؟",
    "options": ["Mit dreißig", "Erst wenn sie sich nicht mehr ausweichen lässt", "Beim Hauskauf", "Nie"], "answer": "Erst wenn sie sich nicht mehr ausweichen lässt",
    "explanationAr": "النص: «erst dann, wenn sie sich nicht mehr ausweichen lässt»."},
   {"id": "vf-t8-q2", "promptDe": "Wie lautet das Prinzip der Wohnprojekte?", "promptAr": "ما مبدأ المشاريع السكنية؟",
    "options": ["Alles wird geteilt", "So viel Privatsphäre wie nötig, so viel Gemeinschaft wie gewünscht", "Keine eigenen Wohnungen", "Nur für Studenten"], "answer": "So viel Privatsphäre wie nötig, so viel Gemeinschaft wie gewünscht",
    "explanationAr": "النص: «so viel Privatsphäre wie nötig, so viel Gemeinschaft wie gewünscht»."},
   {"id": "vf-t8-q3", "promptDe": "Was ersetzt gegenseitige Hilfe teilweise?", "promptAr": "ما الذي تحلّ المساعدة المتبادلة جزئيًا محله؟",
    "options": ["Familienbesuche", "Professionelle Dienste", "Gemeinschaftsräume", "Den Garten"], "answer": "Professionelle Dienste",
    "explanationAr": "النص: «ersetzt dort teilweise professionelle Dienste»."},
   {"id": "vf-t8-q4", "promptDe": "Was ist laut Text wichtiger als die Wohnform?", "promptAr": "ما الأهم من شكل السكن بحسب النص؟",
    "options": ["Der Zeitpunkt der Entscheidung", "Die Größe der Wohnung", "Die Stadt", "Das Vermögen"], "answer": "Der Zeitpunkt der Entscheidung",
    "explanationAr": "النص: «Entscheidend ist weniger die gewählte Form als der Zeitpunkt»."}]})

# ─── DIALOGE (geteilt: _c2_dialoge.py + _c2_dialoge2.py) ───
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _c2_expand import erweitern
erweitern(T)
from _c2_dialoge import DIALOGE_A
from _c2_dialoge2 import DIALOGE_B
D = DIALOGE_A + DIALOGE_B

ids = [t["id"] for t in T] + [d["id"] for d in D]
assert len(ids) == len(set(ids)) == 14
for t in T:
    w = len(t["de"].split())
    assert 230 <= w <= 380, (t["id"], w)
    assert len(t["fragen"]) == 4 and len(t["glossar"]) >= 6
    low = (t["titelDe"] + " " + t["de"]).lower()
    for g in t["glossar"]:
        kern = g["de"].replace("die ", "").replace("der ", "").replace("das ", "").split("(")[0].strip().lower()
        # Stamm-Heuristik: Lemma, Stamm oder trennbares Partizip (ein-ge-löst) im Text?
        PREF = ("ein", "aus", "auf", "ab", "an", "zu", "nach", "vor", "mit", "weiter", "fest")
        treffer = kern in low or (len(kern) > 5 and kern[:5] in low) or any(kern.startswith(p) and ((p + "ge" + kern[len(p):len(p) + 3]) in low or (p + "zu" + kern[len(p):len(p) + 3]) in low) for p in PREF)
        assert treffer, (t["id"], g["de"])
    for f in t["fragen"]:
        assert f["answer"] in f["options"] and len(set(f["options"])) == 4
for d in D:
    assert len(d["lines"]) >= 10 and len(d["fragen"]) == 3
    for f in d["fragen"]:
        assert f["answer"] in f["options"]
import json
json.dump({"texte": T, "dialoge": D}, open("content/vertiefung.json", "w"), ensure_ascii=False, indent=2)
print("OK", len(T), "Texte", len(D), "Dialoge | Text-Woerter:", [len(t['de'].split()) for t in T])
