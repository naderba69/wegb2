# R107 — مراجعة الحوارات A2 d-a2-10–d-a2-12

**التاريخ:** 2026-10-05 · **الفرع:** `arena/01a0fee7-wegb2` · **التقرير:** `docs/content-review-a2-dialogues-05-2026-10-05.json`

## الخلاصة والنطاق

رُوجعت **42 وحدة** من البيانات الحية: 3 بيانات حوار (وتحققت 25 مفردة waisen داخل بياناتها)، 24 سطراً، 9 أسئلة مع الخيارات والمفاتيح والشروح، و6 جمل إملاء. النتيجة: **35 سليماً، وحقل واحد مصحح، و6 أسطر غير محسومة سياقياً**؛ لا يُعد غير المحسوم خطأً لغوياً. استُشهد بـ**83 صفحة/مرجعاً منشوراً**، وربط كل عنصر بمصدر أو أكثر.

التصحيح الوحيد: `d-a2-12.lines[3].ar`؛ أُعيد معنى `steigt` إلى «ترتفع». لم تتغير الألمانية ولا قيمة 27 ولا شهر أبريل. بقيت صحة التوقعات الجوية غير متحققة. لا توجد تصحيحات قانونية/واقعية تخمينية.

## المنهج

استُخرجت المعرفات واللقطات من `content/dialogues.json` بعد فحص Git والتقارير. لكل عنصر أدناه دليل منشور وحكم وإجراء منفصل، ثم لقطة البيانات. تدعم صفحات PONS/Duden المعاني المعجمية فقط؛ ويُستخدم UBA و§536 BGB وDWD بحدود ما تقوله صفحاتها. التصنيف «سليم» يعني عدم ثبوت خطأ يحتاج تعديلاً، ولا يلغي الملاحظات الأسلوبية المدرجة.

## سجل كل عنصر

| المعرّف | النوع | الحكم | الدليل والحكم | الإجراء | المصدر/اللقطة الحية |
|---|---|---|---|---|---|
| `d-a2-10` | بيانات الحوار/العنوان/وسوم waisen | **سليم** | العنوان «Schimmel im Bad / عفن في الحمّام» يطابق معنى Schimmel بوصفه عفناً في سياق الجدار وBad بمعنى الحمّام. وفُحصت مدخلات waisen الثمانية كلمةً كلمةً: Hausmeister، lüften، Schimmel، Feuchtigkeit، Mangel، Mietminderung، sich beschweren، Hausverwaltung؛ تسندها مداخل PONS/تعريف Duden المدرجة هنا. اللقطة الحية: A2، 8 أسطر، 3 أسئلة، جملتا إملاء. لم يُعَد تقييم CEFR. | لا تغيير؛ حُفظت بيانات الحوار والوسوم كما هي، ولم يُعد تقييم مستوى CEFR. | S01, S02, S06, S07, S12, S15, S19, S20, S25<br>العنوان الألماني: Schimmel im Bad<br>العنوان العربي: عفن في الحمّام<br>المستوى: A2؛ الأسطر/الأسئلة/الإملاء: 8/3/2<br>neu: True؛ waisen (8): der Hausmeister, lüften, der Schimmel, die Feuchtigkeit, der Mangel, die Mietminderung, sich beschweren, die Hausverwaltung  |
| `d-a2-10.lines[0]` | سطر ألماني/ترجمته | **سليم** | التحية ومفردات العفن والحمّام والجدار والزاوية متوافقة مع المداخل المعجمية والسياق. «طاب يومك» مفهوم ورسمي، وقد يبدو أدبياً أكثر من «مرحباً»؛ هذه ملاحظة أسلوبية لا خطأ معنى مؤكداً. | لا تغيير؛ لا تُفرض صيغة عربية واحدة للتحية. | S03, S01, S02, S04, S05<br>DE: Guten Tag, Herr Kaya. Im Bad ist Schimmel an der Wand, oben in der Ecke.<br>AR: طاب يومك سيد كايا. في الحمّام عفن على الجدار، في الزاوية العليا. |
| `d-a2-10.lines[1]` | سطر ألماني/ترجمته | **سليم** | lüften regelmäßig تقابل التهوية بانتظام، وUBA يوصي بتهوية مكثفة بعد الاستحمام ويذكر 5–10 دقائق في الحمّام؛ عشر دقائق تقع ضمن المجال المنشور. المصدر يقيّد المدة بالظروف، لذا لا أعمّمها كقاعدة ثابتة لكل مبنى. muss/«يجب» متطابقان في درجة الإلزام بوصفهما كلام الشخصية. | لا تغيير؛ يبقى النص حواراً تعليمياً لا إرشاداً عاماً مستقلاً عن الظروف. | S07, S08, S09, S10, S11<br>DE: Lüften Sie regelmäßig? Nach dem Duschen muss das Fenster zehn Minuten offen sein.<br>AR: هل تهوّين بانتظام؟ بعد الاستحمام يجب أن تبقى النافذة مفتوحة عشر دقائق. |
| `d-a2-10.lines[2]` | سطر ألماني/ترجمته | **سليم** | المقابلات المعجمية Fenster=نافذة، Feuchtigkeit=رطوبة، bleiben=بقي، klein=صغير؛ الترجمة العربية تحفظ معنى بقاء الرطوبة وصغر النافذة. | لا تغيير. | S11, S12, S13, S14<br>DE: Ja, jeden Tag. Aber die Feuchtigkeit bleibt, das Fenster ist sehr klein.<br>AR: نعم، كل يوم. لكن الرطوبة تبقى، فالنافذة صغيرة جداً. |
| `d-a2-10.lines[3]` | سطر ألماني/ترجمته | **غير محسوم** | Mangel يقابل عيباً، لكن الجزم «ليس خطأك» لا يُستنتج من مجرد بقاء الرطوبة وصغر النافذة: يذكر UBA أسباباً من رطوبة الاستعمال وأسباباً في المبنى، ويقيّد §536 BGB الأثر القانوني بعيب يؤثر في الاستعمال التعاقدي. لا توجد معاينة أو وقائع كافية لتحديد السبب أو المسؤولية. عربياً «لا خطؤك» مفهومة لكنها أقل سلاسة من «وليس خطأك»؛ هذه ملاحظة أسلوبية منفصلة عن عدم الحسم الموضوعي. | أُبقي الحقل بلا تعديل تخميني، ولا أقدّم حكماً قانونياً؛ يلزم سياق/تحرير يخفف الجزم إذا أريد عرضها كقاعدة واقعية. | S15, S16, S17, S18, S19, S22<br>DE: Dann ist es ein Mangel an der Wohnung, nicht Ihr Fehler. Ich schreibe das der Hausverwaltung.<br>AR: إذن هو عيب في الشقة لا خطؤك. سأكتب ذلك لإدارة العقار. |
| `d-a2-10.lines[4]` | سطر ألماني/ترجمته | **سليم** | sich beschweren يعني تقديم شكوى؛ والترجمة تسأل بوضوح إن كان على المستأجرة أن تشتكي بنفسها أم يكفي بلاغ الحارس. | لا تغيير. | S20, S06<br>DE: Muss ich mich auch selbst beschweren, oder reicht es, wenn der Hausmeister das meldet?<br>AR: هل يجب أن أشتكي بنفسي أيضاً، أم يكفي أن يبلّغ الحارس؟ |
| `d-a2-10.lines[5]` | سطر ألماني/ترجمته | **سليم** | schriftlich/Foto/Datum تقابل كتابياً/صورة/تاريخ. Duden يعرّف Mietminderung بخفض الإيجار لعيب في المأجور، و§536 يشرح شرط تأثير العيب؛ صيغة kann ... prüfen/«تستطيع ... النظر في» لا تعد المتعلّمة باستحقاق أو نتيجة حتمية. | لا تغيير؛ أبقيت الصياغة الاحتمالية، ولم تُقدّم كنصيحة قانونية. | S20, S21, S22, S23, S24, S25, S26, S27, S28, S18, S19<br>DE: Ja, bitte schriftlich, mit Foto und Datum. Dann kann die Verwaltung eine Mietminderung prüfen.<br>AR: نعم، كتابياً من فضلك، مع صورة وتاريخ. عندها تستطيع الإدارة النظر في تخفيض الإيجار. |
| `d-a2-10.lines[6]` | سطر ألماني/ترجمته | **سليم** | السؤال عن موعد مجيء شخص، والترجمة العربية تؤدي المعنى. استعمال المضارع الألماني لموعد قريب لا يتطلب مستقبلاً صريحاً في العربية هنا. | لا تغيير. | S30<br>DE: Und wann kommt jemand?<br>AR: ومتى يأتي أحد؟ |
| `d-a2-10.lines[7]` | سطر ألماني/ترجمته | **سليم** | Handwerker=حرفي/صاحب حرفة، nächste Woche=الأسبوع القادم، Dienstag=الثلاثاء، um neun=في التاسعة؛ الترجمة تحفظ الموعد. | لا تغيير؛ صحة الموعد داخل الحوار لا تثبت موعداً واقعياً. | S29, S30, S31, S32, S33<br>DE: Der Handwerker kommt nächste Woche, am Dienstag um neun.<br>AR: الحرفيّ يأتي الأسبوع القادم، الثلاثاء في التاسعة. |
| `d-a2-10-q1` | سؤال/خيارات/مفتاح/شرح | **سليم** | المفتاح يطابق تعليل الحارس في الحوار: بقاء الرطوبة وصغر النافذة. عبارة «laut Hausmeister» تقصر السؤال على ما يقوله النص؛ لا تثبت صحة الاستنتاج الواقعي/القانوني المفتوح في السطر d-a2-10.lines[3]. | لا تغيير للمفتاح أو الخيارات؛ يُقرأ كفهم للحوار فقط. | S12, S14, S16, S17<br>DE: Warum ist der Schimmel laut Hausmeister nicht der Fehler der Mieterin?<br>AR prompt: اختر الإجابة الصحيحة حسب الحوار.<br>الخيارات: Weil sie nicht lüftet.؛ Weil der Handwerker zu spät kommt.؛ Weil das Fenster sehr klein ist und die Feuchtigkeit bleibt.<br>المفتاح: Weil das Fenster sehr klein ist und die Feuchtigkeit bleibt.<br>الشرح: الدليل: «die Feuchtigkeit bleibt, das Fenster ist sehr klein» ثم «Dann ist es ein Mangel an der Wohnung, nicht Ihr Fehler». الفخّ 1: التهوية سأل عنها وهي تهوّي يومياً. الفخّ 2: الحرفيّ موعد لا سبب. |
| `d-a2-10-q2` | سؤال/خيارات/مفتاح/شرح | **سليم** | المفتاح «schriftlich, mit Foto und Datum» منقول حرفياً من السطر؛ المشتتان الهاتف/مقابلة الحرفي لا يناقضان النص. | لا تغيير. | S20, S21, S22, S23, S24<br>DE: Wie soll sich die Mieterin beschweren?<br>AR prompt: اختر الإجابة الصحيحة حسب الحوار.<br>الخيارات: schriftlich, mit Foto und Datum؛ telefonisch beim Hausmeister؛ persönlich beim Handwerker<br>المفتاح: schriftlich, mit Foto und Datum<br>الشرح: الدليل: «Ja, bitte schriftlich, mit Foto und Datum». الفخّ 1: الحارس هو من تكلّمه الآن. الفخّ 2: الحرفيّ يأتي للإصلاح. |
| `d-a2-10-q3` | سؤال/خيارات/مفتاح/شرح | **سليم** | العبارة صحيحة بحسب الموعد المنصوص عليه «nächste Woche, am Dienstag um neun»؛ الحكم هنا على اتساق السؤال مع الحوار لا على موعد فعلي. | لا تغيير. | S29, S31, S32, S33<br>DE: Der Handwerker kommt am Dienstag um neun.<br>AR prompt: هل العبارة صحيحة أم خاطئة حسب الحوار؟<br>الخيارات: richtig؛ falsch<br>المفتاح: richtig<br>الشرح: الدليل: «Der Handwerker kommt nächste Woche, am Dienstag um neun». |
| `d-a2-10.dictation[0]` | جملة إملاء | **سليم** | جملة الإملاء نسخة حرفية من d-a2-10.lines[0].de؛ مفردات العفن والحمّام والجدار والزاوية مسندة معجمياً. | لا تغيير. | S01, S02, S04, S05<br>DE: Im Bad ist Schimmel an der Wand, oben in der Ecke. |
| `d-a2-10.dictation[1]` | جملة إملاء | **سليم** | جملة الإملاء تطابق حرفياً الجملة الثانية من d-a2-10.lines[5].de؛ Mietminderung مصطلح خفض إيجار، وprüfen تعني فحص/النظر، لا ضمان النتيجة. | لا تغيير. | S18, S19, S25, S26, S27, S28<br>DE: Dann kann die Verwaltung eine Mietminderung prüfen. |
| `d-a2-11` | بيانات الحوار/العنوان/وسوم waisen | **سليم** | العنوان «Anruf im Büro / مكالمة في المكتب» يطابق الموضوع والمكان. وفُحصت مدخلات waisen الثمانية كلمةً كلمةً: Anruf، besetzt، weiterleiten، Sprachnachricht، Ansage، nachfragen، erreichen، Bestätigung؛ تسندها مداخل PONS وتعريف Duden المدرجة هنا. اللقطة الحية: A2، 8 أسطر، 3 أسئلة، جملتا إملاء. لم يُستنتج مستوى جديد من الوسم. | لا تغيير؛ حُفظت بيانات الحوار والوسوم كما هي، ولم يُعد تقييم مستوى CEFR. | S34, S35, S38, S39, S40, S41, S43, S44, S48, S50<br>العنوان الألماني: Anruf im Büro<br>العنوان العربي: مكالمة في المكتب<br>المستوى: A2؛ الأسطر/الأسئلة/الإملاء: 8/3/2<br>neu: True؛ waisen (8): der Anruf, besetzt, weiterleiten, die Sprachnachricht, die Ansage, nachfragen, erreichen, die Bestätigung  |
| `d-a2-11.lines[0]` | سطر ألماني/ترجمته | **سليم** | Firma Neumann هي شركة نويمان، والتحية ووظيفة سؤال الخدمة متسقان مع تحية هاتفية؛ PONS يعرض نظيراً وظيفياً «Wie kann ich Ihnen helfen?». «بمَ أخدمك؟» عربية سليمة رسمية، وإن كان «كيف أساعدك؟» خياراً أسلوبياً آخر. | لا تغيير؛ لا أتعامل مع البديل الأسلوبي كخطأ ترجمة. | S34, S35, S03, S36, S37<br>DE: Firma Neumann, guten Tag. Was kann ich für Sie tun?<br>AR: شركة نويمان، طاب يومك. بمَ أخدمك؟ |
| `d-a2-11.lines[1]` | سطر ألماني/ترجمته | **سليم** | المتصل يعرّف بنفسه، وerreichen في سياق الاتصال يعني الوصول إلى الشخص/الاتصال به؛ «أريد الوصول إلى السيدة لانغ» دقيقة حرفياً ومفهومة. «أود التحدث إلى السيدة لانغ» أكثر تداولاً هاتفياً، لكنه بديل أسلوبي لا إصلاح لازم. | لا تغيير. | S03, S39, S52<br>DE: Guten Tag, hier Karim Saidi. Ich möchte Frau Lang erreichen.<br>AR: طاب يومك، معك كريم السعيدي. أريد الوصول إلى السيدة لانغ. |
| `d-a2-11.lines[2]` | سطر ألماني/ترجمته | **سليم** | Anruf=مكالمة، besetzt=مشغولة/مشغول، weiterleiten=تحويل، Kollege=زميل؛ الترجمة تحفظ انشغال السيدة وعرض تحويل المكالمة إلى زميلها. | لا تغيير؛ المعجم يدعم الكلمة ولا يفرض أن «الشخص» لا «الخط» هو المشغول. | S38, S40, S41, S42<br>DE: Frau Lang ist gerade besetzt. Soll ich den Anruf an ihren Kollegen weiterleiten?<br>AR: السيدة لانغ مشغولة الآن. هل أحوّل المكالمة إلى زميلها؟ |
| `d-a2-11.lines[3]` | سطر ألماني/ترجمته | **سليم** | nachfragen=استفسر، Bestätigung=تأكيد، angekommen=وصل؛ الترجمة تحافظ على نية الاستفسار والسؤال عن وصول التأكيد. | لا تغيير. | S43, S44, S45<br>DE: Nein danke. Ich wollte nur nachfragen: Ist meine Bestätigung angekommen?<br>AR: لا شكراً. أردت فقط الاستفسار: هل وصل تأكيدي؟ |
| `d-a2-11.lines[4]` | سطر ألماني/ترجمته | **سليم** | E-Mail من gestern تعني رسالة من أمس، وdie Bestätigung ist da تفيد أن التأكيد حاضر/وصل. «التأكيد موجود» مفهومة؛ «وصل التأكيد» بديل أسلوبي أوضح في بعض السياقات لا خطأ مثبت. | لا تغيير. | S46, S47, S44<br>DE: Ich sehe hier eine E-Mail von gestern. Ja, die Bestätigung ist da.<br>AR: أرى هنا إيميلاً من أمس. نعم، التأكيد موجود. |
| `d-a2-11.lines[5]` | سطر ألماني/ترجمته | **سليم** | Duden يعرّف Sprachnachricht رسالة منطوقة عبر الهاتف/خدمة مراسلة ويورد مثال تركها؛ hinterlassen=ترك. «رسالة صوتية» مقابلة سليمة في السياق. | لا تغيير. | S48, S49<br>DE: Sehr gut. Kann ich Frau Lang eine Sprachnachricht hinterlassen?<br>AR: ممتاز. هل يمكنني ترك رسالة صوتية للسيدة لانغ؟ |
| `d-a2-11.lines[6]` | سطر ألماني/ترجمته | **سليم** | Ansage=إعلان/إفادة مسموعة، وبعدها يُطلب ذكر الاسم والرقم؛ العربية تنقل التعليمات. في سياق البريد الصوتي «بعد الإعلان» أقل تحديداً من «بعد سماع التعليمات المسجلة»، لكنه مفهوم ومسنود بالمعنى المعجمي، فهذه ملاحظة وضوح لا خطأ مؤكد. | لا تغيير. | S50, S51, S52, S53<br>DE: Ja. Nach der Ansage sprechen Sie bitte Ihren Namen und Ihre Nummer.<br>AR: نعم. بعد الإعلان قل اسمك ورقمك من فضلك. |
| `d-a2-11.lines[7]` | سطر ألماني/ترجمته | **سليم** | zurückrufen تعني إعادة الاتصال؛ الترجمة تسأل إن كانت السيدة ستتصل به مجدداً اليوم. | لا تغيير. | S54<br>DE: Danke. Und sie ruft heute noch zurück?<br>AR: شكراً. وهل تعاود الاتصال اليوم؟ |
| `d-a2-11-q1` | سؤال/خيارات/مفتاح/شرح | **سليم** | الاختيار «Sie ist gerade besetzt» يطابق سبب عدم الحديث المذكور؛ البدائل عن الزميل والبريد لا يقولها الحوار سبباً. | لا تغيير. | S38, S40<br>DE: Warum kann Karim Frau Lang nicht sprechen?<br>AR prompt: اختر الإجابة الصحيحة حسب الحوار.<br>الخيارات: Sie ist gerade besetzt.؛ Sie ist bei ihrem Kollegen.؛ Ihre E-Mail ist nicht angekommen.<br>المفتاح: Sie ist gerade besetzt.<br>الشرح: الدليل: «Frau Lang ist gerade besetzt». الفخّ 1: الزميل هو من عُرض تحويل المكالمة إليه. الفخّ 2: الإيميل وصل («die Bestätigung ist da»). |
| `d-a2-11-q2` | سؤال/خيارات/مفتاح/شرح | **سليم** | بعد Ansage يطلب النص ذكر الاسم والرقم؛ الخيار الصحيح مطابق، والمشتتان عن كتابة رقم السكرتيرة/إرسال بريد غير واردين في التعليمات. | لا تغيير. | S50, S51, S52, S53<br>DE: Was soll Karim nach der Ansage tun?<br>AR prompt: اختر الإجابة الصحيحة حسب الحوار.<br>الخيارات: die Nummer der Sekretärin aufschreiben؛ seinen Namen und seine Nummer sprechen؛ eine E-Mail an den Kollegen schicken<br>المفتاح: seinen Namen und seine Nummer sprechen<br>الشرح: الدليل: «Nach der Ansage sprechen Sie bitte Ihren Namen und Ihre Nummer». الفخّ 1: رقمه هو لا رقم السكرتيرة. الفخّ 2: الإيميل كان أمس ووصل. |
| `d-a2-11-q3` | سؤال/خيارات/مفتاح/شرح | **سليم** | الفراغ يستلزم weiterleiten من الحوار. مع الفعل الناقص soll يأتي المصدر في نهاية العبارة، وweiterleiten يكتب مصدراً واحداً؛ يدعم Collins ترتيب الفعل الناقص. | لا تغيير. | S38, S41, S42, S55<br>DE: Soll ich den Anruf an ihren Kollegen ___?<br>AR prompt: أكمل الفراغ بالكلمة المناسبة من الحوار.<br>الخيارات: <br>المفتاح: weiterleiten<br>الشرح: الدليل: «Soll ich den Anruf an ihren Kollegen weiterleiten?» — فعل منفصل في المصدر بعد soll. |
| `d-a2-11.dictation[0]` | جملة إملاء | **سليم** | جملة الإملاء نسخة حرفية من d-a2-11.lines[2].de؛ besetzt يوافق معنى مشغول. | لا تغيير. | S40<br>DE: Frau Lang ist gerade besetzt. |
| `d-a2-11.dictation[1]` | جملة إملاء | **سليم** | السؤال الإملائي منقول حرفياً من d-a2-11.lines[3].de؛ Bestätigung=تأكيد وankommen=وصل. | لا تغيير. | S44, S45<br>DE: Ist meine Bestätigung angekommen? |
| `d-a2-12` | بيانات الحوار/العنوان/وسوم waisen | **سليم** | العنوان «Der Wetterbericht im Radio / نشرة الطقس في الراديو» يطابق الموضوع والوسيط. وفُحصت مدخلات waisen التسعة كلمةً كلمةً: Gewitter، Wolke، Wind، Temperatur، Vorhersage، Frost، Hitze، bewölkt، neblig؛ تسندها مداخل PONS المدرجة هنا. اللقطة الحية: A2، 8 أسطر، 3 أسئلة، جملتا إملاء. لا يحدد النص مدينة أو تاريخاً/عاماً للنشرة. | لا تغيير؛ حُفظت بيانات الحوار والوسوم كما هي، ولم يُعد تقييم مستوى CEFR. | S56, S57, S58, S60, S62, S65, S68, S73, S76, S77, S83<br>العنوان الألماني: Der Wetterbericht im Radio<br>العنوان العربي: نشرة الطقس في الراديو<br>المستوى: A2؛ الأسطر/الأسئلة/الإملاء: 8/3/2<br>neu: True؛ waisen (9): das Gewitter, die Wolke, der Wind, die Temperatur, die Vorhersage, der Frost, die Hitze, bewölkt, neblig  |
| `d-a2-12.lines[0]` | سطر ألماني/ترجمته | **غير محسوم** | لغوياً: Vorhersage=توقعات، morgen=غداً، neblig=ضبابي، Flüsse=أنهار؛ العربية مفهومة، و«صباحاً ضباب» حذفٌ برقي لـ«يكون الجو ضبابياً» يمكن قبوله في نشرة مختصرة، لا خطأ معنى قاطع. أما صدق توقع الضباب قرب الأنهار فلا يُتحقق منه لأن المكان والتاريخ غير محددين؛ DWD يعدّ الظاهرة والفترة والموقع/المنطقة عناصر لازمة لتقييم التنبؤ. | لا تغيير؛ سُجل الادعاء الجوي غير المتحقق منفصلاً عن سلامة الترجمة. | S58, S59, S60, S61, S82<br>DE: Und jetzt die Vorhersage für morgen. Am Morgen ist es neblig, besonders an den Flüssen.<br>AR: والآن التوقعات ليوم غد. صباحاً ضباب، خصوصاً قرب الأنهار. |
| `d-a2-12.lines[1]` | سطر ألماني/ترجمته | **غير محسوم** | ترجمة bewölkt/bleibt/bis zehn Uhr ثم الشمس مطابقة لغوياً. لكن التنبؤ المحدد بغيوم حتى العاشرة لا يمكن مطابقته مع رصد أو نشرة حقيقية دون موقع وتاريخ/عام؛ هذا عدم تحقق سياقي لا خطأ لغوياً مثبتاً. | لا تغيير؛ لا أصف التوقع بالصحيح أو الخاطئ واقعياً. | S62, S13, S63, S64, S82<br>DE: Richtig. Bis zehn Uhr bleibt es bewölkt, dann kommt die Sonne.<br>AR: صحيح. حتى العاشرة يبقى الجو غائماً ثم تظهر الشمس. |
| `d-a2-12.lines[2]` | سطر ألماني/ترجمته | **سليم** | Wie warm wird es? يسأل عن درجة الدفء، و«كم ستكون الحرارة؟» صياغة عربية طبيعية في سياق نشرة الطقس. إنه سؤال لغوي في الحوار لا تقرير عن قيمة فعلية. | لا تغيير. | S65, S69<br>DE: Wie warm wird es?<br>AR: كم ستكون الحرارة؟ |
| `d-a2-12.lines[3]` | سطر ألماني/ترجمته | **مُصحح** | PONS يسند steigen/ansteigen إلى الصعود أو الارتفاع. الترجمة السابقة «تصل الحرارة» تحفظ بلوغ القيمة لكنها تسقط معنى الارتفاع الصريح في steigt auf؛ عُدّلت إلى «ترتفع درجة الحرارة إلى 27 درجة». تظل صحة 27 درجة في أبريل غير قابلة للتحقق دون موقع وتاريخ/عام (الملاحظة الجوية المفتوحة)، ولم يُغيّر الرقم أو الادعاء الألماني. | عُدّل الحقل العربي وحده عبر رقعة مشروطة؛ لا يعني التصحيح أن التنبؤ واقعي أو متحقق. | S65, S66, S67, S68, S69, S70, S82<br>DE: Die Temperatur steigt auf 27 Grad. Das ist keine Hitze, aber sehr warm für April.<br>AR: ترتفع درجة الحرارة إلى 27 درجة. ليس حرّاً شديداً لكنه دافئ جداً لشهر أبريل. |
| `d-a2-12.lines[4]` | سطر ألماني/ترجمته | **سليم** | Und am Abend? تقابل «وفي المساء؟» مباشرةً؛ لا يحتوي السطر وحده على دعوى جوية. | لا تغيير. | S71<br>DE: Und am Abend?<br>AR: وفي المساء؟ |
| `d-a2-12.lines[5]` | سطر ألماني/ترجمته | **غير محسوم** | المفردات والترجمة متوافقتان: مساءً، رياح قوية من الغرب، وعاصفة رعدية في الجبال. التوقع المحدد غير قابل للتحقق دون موقع وفترة معرّفين؛ DWD يذكر صعوبة بعض الظواهر الموضعية. | لا تغيير؛ لا تُعد الملاحظة دليلاً على أن النشرة خاطئة. | S71, S72, S73, S74, S75, S76, S82<br>DE: Am Abend kommt starker Wind aus dem Westen, und in den Bergen gibt es ein Gewitter.<br>AR: في المساء تأتي رياح قوية من الغرب، وفي الجبال عاصفة رعدية. |
| `d-a2-12.lines[6]` | سطر ألماني/ترجمته | **غير محسوم** | ترجمة سؤال عدم وجود الصقيع في الليل سليمة. وجود/عدم وجود الصقيع نفسه ادعاء جوي محلي غير قابل للتحقق من دون الموقع والتاريخ. | لا تغيير. | S77, S78, S82<br>DE: Also kein Frost mehr in der Nacht?<br>AR: إذن لا صقيع بعد الآن في الليل؟ |
| `d-a2-12.lines[7]` | سطر ألماني/ترجمته | **غير محسوم** | المعاني: لا صقيع، خذوا سترة معكم، والريح باردة؛ الترجمة تحفظها. لكن واقع عدم الصقيع وبرودة الريح في النشرة لا يمكن التحقق منهما بلا مكان/تاريخ؛ لا يصنّف ذلك خطأ ترجمة. | لا تغيير؛ تُفصل صحة الادعاء الجوي عن الترجمة. | S77, S79, S80, S81, S82<br>DE: Nein, kein Frost. Aber nehmen Sie eine Jacke mit, der Wind ist kalt.<br>AR: لا، لا صقيع. لكن خذوا سترة معكم، فالرياح باردة. |
| `d-a2-12-q1` | سؤال/خيارات/مفتاح/شرح | **سليم** | الخيار neblig, besonders an den Flüssen يطابق حرفياً ما يقوله الحوار عن الصباح؛ الخيارات الأخرى تخص الشمس بعد العاشرة والعاصفة مساءً. هذا تحقق نصي، لا تصديق لنشرة حقيقية. | لا تغيير؛ يبقى الادعاء الجوي غير متحقق. | S58, S59, S60, S61, S82<br>DE: Wie ist das Wetter morgen früh?<br>AR prompt: اختر الإجابة الصحيحة حسب الحوار.<br>الخيارات: sonnig ab dem Morgen؛ neblig, besonders an den Flüssen؛ ein Gewitter in den Bergen<br>المفتاح: neblig, besonders an den Flüssen<br>الشرح: الدليل: «Am Morgen ist es neblig, besonders an den Flüssen». الفخّ 1: الشمس بعد العاشرة. الفخّ 2: العاصفة في المساء. |
| `d-a2-12-q2` | سؤال/خيارات/مفتاح/شرح | **سليم** | النص يحدد مكان Gewitter am Abend بأنه in den Bergen؛ الغرب مصدر الرياح والأنهار موضع الضباب، لذا المفتاح منفرد داخل الحوار. | لا تغيير؛ لا تحقق خارجي من الطقس. | S71, S74, S75, S76, S82<br>DE: Wo gibt es am Abend ein Gewitter?<br>AR prompt: اختر الإجابة الصحيحة حسب الحوار.<br>الخيارات: an den Flüssen؛ im Westen؛ in den Bergen<br>المفتاح: in den Bergen<br>الشرح: الدليل: «in den Bergen gibt es ein Gewitter». الفخّ 1: الأنهار مكان الضباب. الفخّ 2: الغرب مصدر الرياح. |
| `d-a2-12-q3` | سؤال/خيارات/مفتاح/شرح | **سليم** | العبارة «In der Nacht gibt es Frost» خاطئة بحسب جواب الشخصية «Nein, kein Frost»؛ لا يثبت ذلك واقع الطقس خارج النص. | لا تغيير. | S77, S78, S82<br>DE: In der Nacht gibt es Frost.<br>AR prompt: هل العبارة صحيحة أم خاطئة حسب الحوار؟<br>الخيارات: richtig؛ falsch<br>المفتاح: falsch<br>الشرح: الدليل: «Nein, kein Frost». |
| `d-a2-12.dictation[0]` | جملة إملاء | **سليم** | جملة الإملاء نسخة حرفية من d-a2-12.lines[1].de؛ cloudiness until zehn Uhr then Sonne. تطابقها النصي سليم مع بقاء صحة التوقع الواقعية غير متحققة. | لا تغيير. | S62, S13, S63, S64<br>DE: Bis zehn Uhr bleibt es bewölkt, dann kommt die Sonne. |
| `d-a2-12.dictation[1]` | جملة إملاء | **سليم** | جملة الإملاء نسخة حرفية من d-a2-12.lines[5].de؛ مفردات الريح والغرب والجبل والعاصفة الرعدية مدعومة معجمياً. | لا تغيير. | S71, S72, S73, S74, S75, S76<br>DE: Am Abend kommt starker Wind aus dem Westen, und in den Bergen gibt es ein Gewitter. |

## الملاحظات غير المحسومة

### `d-a2-10.lines[3]` — سببية العفن والمسؤولية

لا تكفي جملة المستأجرة عن التهوية اليومية وصغر النافذة لإثبات أن العفن عيب في المبنى أو أنه ليس من مسؤوليتها. يقول UBA إن أسباب الرطوبة قد تكون من الاستعمال أو من بنية المبنى، بينما §536 BGB يربط تخفيض الإيجار بعيب يؤثر في الاستعمال التعاقدي. هذا لا يحدد سبب هذه الحالة الخيالية أو مسؤوليتها القانونية.

**الإجراء:** أُبقي السطر والسؤال الذي ينسب التفسير إلى الحارس دون تعديل تخميني؛ لا يُعرض كمشورة قانونية. إذا أريد تقريره كحقيقة عامة فيلزم تحرير يوضح أن السبب يحتاج فحصاً. **المصادر:** S15, S16, S17, S18.

### `d-a2-12.lines[0]` — صلاحية النشرة الجوية

تضم النشرة توقعات محددة للغد (ضباباً قرب الأنهار، غيوماً حتى العاشرة، 27 درجة في أبريل، رياحاً غربية وعاصفة رعدية في الجبال، وعدم صقيع ليلاً)، لكن لا تحدد مدينة أو منطقة أو تاريخاً/عاماً. يوضح DWD أن تقييم توقع الطقس يقتضي تحديد الظاهرة والأفق الزمني والمكان/المنطقة؛ لذا لا تثبت المصادر المعجمية أن هذه القيم الجوية صحيحة أو خاطئة. ترجمة steigen صُححت منفصلاً ولا تصادق على القيمة.

**المعرفات المرتبطة:** `d-a2-12.lines[0]`, `d-a2-12.lines[1]`, `d-a2-12.lines[3]`, `d-a2-12.lines[5]`, `d-a2-12.lines[6]`, `d-a2-12.lines[7]`.

**الإجراء:** لا تعديل للوقائع الجوية أو الأسئلة التي تقيس النص؛ تبقى صحة التنبؤ غير محسومة حتى يحدد المؤلف مكاناً وفترة قابلة للتحقق أو يصرح صراحةً بأنه مثال لغوي افتراضي. **المصدر:** S82.

## التصحيح المؤكد قبل/بعد

| المعرّف | قبل | بعد | الحجة |
|---|---|---|---|
| `d-a2-12.lines[3].ar` | تصل الحرارة إلى 27 درجة. ليس حرّاً شديداً لكنه دافئ جداً لشهر أبريل. | ترتفع درجة الحرارة إلى 27 درجة. ليس حرّاً شديداً لكنه دافئ جداً لشهر أبريل. | `steigen/ansteigen` = صعد/ارتفع؛ أُصلح اللفظ العربي فقط. القيمة الجوية نفسها باقية غير متحققة. |

الرقعة المشروطة والقابلة لإعادة التشغيل: `scripts/patches/review_a2_dialogues_05.py`. لا يغيّر التنفيذ إلا الحقل المذكور، ويرفض نصاً ألمانياً/عربياً غير متوقع.

## التاريخ المحدود وفحص الصوت

ملف `scripts/patches/dialoge_a2_neu1.py` يحمل ترجمة «تصل الحرارة» السابقة، لكنه مصدر إنشاء لا مرجع لغوي. لم نجد معرفات الحوارات الثلاثة في `scripts/patches/a_dialog_fallen.py`؛ لذلك لم تُجر مقارنة تاريخية لخياراتها من ذلك الملف. لا يعيد ذلك بناء تاريخ كل الفروع أو المراجعات.

لم توجد إدخالات صوت لهذه المعرفات في `content/dialog-audio.json`، ولم يظهر ملف باسمها تحت `public`؛ `audioAssetAudit` فارغ. لا يعني ذلك فحص صوت المتصفح: لم يُشغّل TTS أو ملف صوت ولم يحدث استماع أو تحقق نطقي.

## حدود المراجعة

- هذه مراجعة مساعد ذكاء اصطناعي مدعومة بمصادر منشورة؛ ليست مراجعة بشرية أو اعتماداً لغوياً/قانونياً/مهنياً.
- لا توجد إدخالات لهذه الحوارات في content/dialog-audio.json، ولم يعثر مسح أسماء الملفات في public على أصول باسم d-a2-10 أو d-a2-11 أو d-a2-12؛ لذلك audioAssetAudit فارغ. لم يُشغّل متصفح TTS ولم يحدث استماع أو فحص صوت.
- ملف scripts/patches/dialoge_a2_neu1.py مصدر إنشاء أولي يقارن به الحقل المصحح فقط، وليس مرجعاً لغوياً أو تاريخاً كاملاً. ملف scripts/patches/a_dialog_fallen.py لم يتضمن سجلات للأسئلة المستهدفة؛ لا يُستنتج من ذلك غياب تاريخ في مواضع أخرى أو فروع غير مفحوصة.
- لم يُعَد تقييم A2/CEFR أو النسبة أو حساب المستوى الممكن؛ وسم المستوى ليس نتيجة هذه المراجعة.
- الملاحظة القانونية في d-a2-10 تعليمية؛ لم تُقدّم فتوى أو نتيجة قانونية بشأن مستأجر أو مبنى حقيقي.
- وقائع النشرة الجوية في d-a2-12 بلا موقع/تاريخ/عام محدد، لذلك لم تُطابق مع رصد أو توقع حقيقي؛ لا تُصنّف خاطئة لمجرد غياب السياق.
- المداخل المعجمية تسند معاني مفردات بعينها، ولا تحسم بمفردها سلاسة كل جملة عربية أو أثراً تعليمياً.

## المصادر المنشورة

تصف خانة «ما يسنده» الحدّ الذي استُخدم فيه كل مرجع؛ المصدر المعجمي لا يثبت وحده طبيعية الجملة الكاملة. جميع الروابط أدناه فُتحت قبل إدراجها في هذا التقرير.

| المعرّف | المصدر والرابط | ما يسنده في هذه المراجعة |
|---|---|---|
| `S01` | [PONS: Schimmel](https://en.pons.com/translate/german-arabic/Schimmel) | يعرض Schimmel في معنى الغطاء الفطري مقابلاً عربياً هو «عفن»؛ سياق الجدار يعيّن هذا المعنى، لا معنى الحصان الأبيض homonym. |
| `S02` | [PONS: Bad](https://en.pons.com/translate/german-arabic/Bad) | يعرض Bad بمعنى الحمّام عند استعماله للمكان؛ يسند عنوان Schimmel im Bad. |
| `S03` | [PONS: Guten Tag](https://en.pons.com/translate/german-arabic/guten+Tag?q=Guten+Tag) | يعرض مقابلات تحية عربية من بينها «مرحباً» و«نهارك سعيد»؛ لا يفرض مقابلاً واحداً لكل سياق. |
| `S04` | [PONS: Wand](https://en.pons.com/translate/german-arabic/Wand) | يعرض Wand بمعنى جدار/حائط. |
| `S05` | [PONS: Ecke](https://en.pons.com/translate/german-arabic/Ecke) | يعرض Ecke بمعنى زاوية/ركن. |
| `S06` | [PONS: Hausmeister](https://en.pons.com/translate/german-arabic/Hausmeister) | يعرض Hausmeister بمعنى بوّاب/حارس في سياق إدارة المبنى. |
| `S07` | [PONS: lüften](https://en.pons.com/translate/german-arabic/l%C3%BCften) | يعرض lüften (Zimmer) بمعنى تهوية الغرفة. |
| `S08` | [PONS: regelmäßig](https://en.pons.com/translate/german-arabic/regelm%C3%A4%C3%9Fig) | يعرض regelmäßig بمعنى بانتظام/منتظم. |
| `S09` | [Umweltbundesamt: Wie lüfte ich richtig?](https://www.umweltbundesamt.de/themen/gesundheit/umwelteinfluesse-auf-den-menschen/schimmel/wie-luefte-ich-richtig-tipps-tricks-zur) | يوصي بإزالة ذروة الرطوبة في الحمّام بعد الاستحمام بالتهوية المكثفة؛ يذكر فتح النوافذ على اتساعها 5–10 دقائق بعد الاستحمام، مع إيضاح أن المدة تتأثر بالغرفة والحرارة والرياح. |
| `S10` | [PONS: Dusche](https://en.pons.com/translate/german-arabic/Dusche) | يعرض Dusche بمعنى الدش/الاستحمام، ويدعم سياق ما بعد الاستحمام. |
| `S11` | [PONS: Fenster](https://en.pons.com/translate/german-arabic/Fenster) | يعرض Fenster بمعنى نافذة/شباك. |
| `S12` | [PONS: Feuchtigkeit](https://en.pons.com/translate/german-arabic/Feuchtigkeit) | يعرض Feuchtigkeit بمعنى الرطوبة. |
| `S13` | [PONS: bleiben](https://en.pons.com/translate/german-arabic/bleiben) | يعرض bleiben بمعنى بقي/ظلّ؛ يسند «تبقى الرطوبة». |
| `S14` | [PONS: klein](https://en.pons.com/translate/german-arabic/klein) | يعرض klein بمعنى صغير؛ يسند وصف النافذة. |
| `S15` | [PONS: Mangel](https://en.pons.com/translate/german-arabic/Mangel) | يعرض Mangel بمعنى نقص، وفي تركيب Fehler أيضاً «عيب»؛ يسند المعنى المعجمي ولا يثبت سبب العيب أو مسؤوليته. |
| `S16` | [Umweltbundesamt: Häufige Fragen bei Schimmelbefall](https://www.umweltbundesamt.de/themen/gesundheit/umwelteinfluesse-auf-den-menschen/schimmel/haeufige-fragen-bei-schimmelbefall) | يذكر أهمية سلامة المبنى ومنع دخول الرطوبة، والتدفئة والتهوية المنتظمة؛ لا يحسم سبب حالة سكنية بلا فحص. |
| `S17` | [Umweltbundesamt: Schimmel in der Wohnung oder im Büro?](https://www.umweltbundesamt.de/schimmel-in-der-wohnung-im-buero) | يذكر أن أسباب العفن قد تشمل رطوبة ينتجها السكان ولا تخرج بالتهوية، أو رطوبة في المبنى؛ وينبه إلى أن سوء التهوية ليس غالباً السبب الوحيد وأن تحديد السبب يحتاج مختصين. |
| `S18` | [§ 536 BGB — Mietminderung bei Sach- und Rechtsmängeln](https://www.gesetze-im-internet.de/bgb/__536.html) | النص الرسمي يربط خفض الأجرة بعيب يؤثر في صلاحية المأجور للاستعمال التعاقدي وبمقدار مناسب؛ لا يحكم وحده على سبب العفن أو المسؤول في هذا السيناريو. |
| `S19` | [PONS: Hausverwaltung](https://en.pons.com/translate/german-arabic/Hausverwaltung) | يعرض Hausverwaltung بمعنى مكتب/إدارة عقارية. |
| `S20` | [PONS: sich beschweren](https://en.pons.com/translate/german-arabic/beschweren?q=sich+beschweren) | يعرض sich beschweren (bei jemandem über etwas) بمعنى اشتكى؛ يسند فعل تقديم الشكوى. |
| `S21` | [PONS: schriftlich](https://en.pons.com/translate/german-arabic/schriftlich) | يعرض schriftlich بمعنى كتابيّاً/تحريرياً. |
| `S22` | [PONS: schreiben](https://en.pons.com/translate/german-arabic/schreiben) | يعرض schreiben بمعنى كتب؛ يسند «سأكتب ذلك لإدارة العقار». |
| `S23` | [PONS: Foto](https://en.pons.com/translate/german-arabic/Foto) | يعرض Foto بمعنى صورة فوتوغرافية. |
| `S24` | [PONS: Datum](https://en.pons.com/translate/german-arabic/Datum) | يعرض Datum بمعنى تاريخ. |
| `S25` | [Duden: Mietminderung](https://www.duden.de/rechtschreibung/Mietminderung) | يعرّف المصطلح قانونياً بأنه خفض سعر الإيجار بسبب عيب في المأجور؛ لا يثبت استحقاقاً في الحالة الحوارية. |
| `S26` | [PONS: Minderung](https://en.pons.com/translate/german-arabic/Minderung) | يعرض Minderung بمعنى تقليل/إنقاص، دعماً لمكوّن «تخفيض» في المصطلح المركب. |
| `S27` | [PONS: Miete](https://en.pons.com/translate/german-arabic/Miete) | يعرض Miete بمعنى الإيجار/الأجرة. |
| `S28` | [PONS: prüfen](https://en.pons.com/translate/german-arabic/pr%C3%BCfen) | يعرض prüfen بمعنى فحص/تحقق؛ يدعم أن الإدارة «تنظر في» التخفيض لا أنها تضمنه. |
| `S29` | [PONS: Handwerker](https://en.pons.com/translate/german-arabic/Handwerker) | يعرض Handwerker بمعنى صاحب حرفة/حرفي. |
| `S30` | [PONS: kommen](https://en.pons.com/translate/german-arabic/kommen) | يعرض kommen بمعنى جاء/أتى. |
| `S31` | [PONS: Woche](https://en.pons.com/translate/german-arabic/Woche) | يعرض Woche بمعنى أسبوع، ويذكر nächste Woche بمقابل «الأسبوع القادم». |
| `S32` | [PONS: Dienstag](https://en.pons.com/translate/german-arabic/Dienstag) | يعرض Dienstag بمعنى يوم الثلاثاء. |
| `S33` | [PONS: neun](https://en.pons.com/translate/german-arabic/neun) | يعرض neun بمعنى تسعة؛ يدعم قراءة الموعد عند التاسعة. |
| `S34` | [PONS: Firma](https://en.pons.com/translate/german-arabic/Firma) | يعرض Firma بمعنى شركة/مؤسسة. |
| `S35` | [PONS: Büro](https://en.pons.com/translate/german-arabic/B%C3%BCro) | يعرض Büro بمعنى مكتب. |
| `S36` | [PONS: Business Englisch — Telefonphrasen](https://de.pons.com/p/wissensecke/wortschatz-to-go/business-englisch) | يعرض تحية مكتب هاتفية وعبارة How can I help you? مع مقابلها الألماني Wie kann ich Ihnen helfen?؛ شاهد وظيفي لعبارة خدمة المتصل، لا ترجمة عربية حرفية للجملة. |
| `S37` | [PONS: tun](https://en.pons.com/translate/german-arabic/tun) | يعرض معنى tun «فعل/عمل»؛ يُستكمل الحكم على الجملة بوظيفتها الهاتفية في مصدر PONS السابق لا بهذا المدخل المفرد وحده. |
| `S38` | [PONS: Anruf](https://en.pons.com/translate/german-arabic/Anruf) | يعرض Anruf بمعنى مكالمة/اتصال. |
| `S39` | [PONS: erreichen](https://en.pons.com/translate/german-arabic/erreichen) | يعرض erreichen بمعنى بلغ/وصل إلى/تمكّن من الاتصال؛ يسند المقصود في طلب الحديث هاتفياً. |
| `S40` | [PONS: besetzt](https://en.pons.com/translate/german-arabic/besetzt) | يعرض besetzt بمعنى مشغول/محجوز؛ يتفق مع عدم إتاحة الاتصال الآن. |
| `S41` | [PONS: weiterleiten](https://en.pons.com/translate/german-arabic/weiterleiten) | يعرض weiterleiten بمعنى نقل/تحويل إلى؛ يسند تحويل المكالمة. |
| `S42` | [PONS: Kollege](https://en.pons.com/translate/german-arabic/Kollege) | يعرض Kollege بمعنى زميل. |
| `S43` | [PONS: nachfragen](https://en.pons.com/translate/german-arabic/nachfragen) | يعرض nachfragen بمعنى سأل للاستفسار/استفسر. |
| `S44` | [PONS: Bestätigung](https://en.pons.com/translate/german-arabic/Best%C3%A4tigung) | يعرض Bestätigung بمعنى تأكيد. |
| `S45` | [PONS: ankommen](https://en.pons.com/translate/german-arabic/ankommen) | يعرض ankommen بمعنى وصل؛ يسند سؤال وصول التأكيد. |
| `S46` | [PONS: E-Mail](https://en.pons.com/translate/german-arabic/E-Mail) | يعرض E-Mail بمعنى بريد إلكتروني/إيميل. |
| `S47` | [PONS: gestern](https://en.pons.com/translate/german-arabic/gestern) | يعرض gestern بمعنى أمس. |
| `S48` | [Duden: Sprachnachricht](https://www.duden.de/rechtschreibung/Sprachnachricht) | يعرّف Sprachnachricht بأنها رسالة منطوقة تُنقل هاتفياً أو عبر خدمة مراسلة، ويورد مثالاً على تركها؛ يسند «رسالة صوتية». |
| `S49` | [PONS: hinterlassen](https://en.pons.com/translate/german-arabic/hinterlassen) | يعرض hinterlassen في معنى ترك/خلّف؛ يسند ترك رسالة صوتية. |
| `S50` | [PONS: Ansage](https://en.pons.com/translate/german-arabic/Ansage) | يعرض Ansage بمعنى إعلان/إفادة مسموعة؛ في سياق البريد الصوتي «الإعلان» مفهوم، و«التعليمات المسجلة» بديل أوضح أسلوبياً لا تصحيح ملزم. |
| `S51` | [PONS: sprechen](https://en.pons.com/translate/german-arabic/sprechen) | يعرض sprechen بمعنى تكلّم/تحدث؛ يسند طلب ذكر الاسم والرقم. |
| `S52` | [PONS: Name](https://en.pons.com/translate/german-arabic/Name) | يعرض Name بمعنى اسم. |
| `S53` | [PONS: Nummer](https://en.pons.com/translate/german-arabic/Nummer) | يعرض Nummer بمعنى رقم. |
| `S54` | [PONS: zurückrufen](https://en.pons.com/translate/german-arabic/zur%C3%BCckrufen) | يعرض zurückrufen بمعنى اتصل مجدداً/أعاد الاتصال. |
| `S55` | [Collins German Grammar: Modal verbs](https://grammar.collinsdictionary.com/german-easy-learning/how-are-modal-verbs-formed-in-german) | يقرر أن مصدر الفعل المستعمل مع الفعل الناقص يأتي في نهاية الجملة/العبارة في البنية المستهدفة؛ يسند فراغ weiterleiten بعد soll. |
| `S56` | [PONS: Wetterbericht](https://en.pons.com/translate/german-arabic/Wetterbericht) | يعرض Wetterbericht بمعنى تقرير/نشرة الطقس. |
| `S57` | [PONS: Radio](https://en.pons.com/translate/german-arabic/Radio) | يعرض Radio بمعنى راديو/إذاعة. |
| `S58` | [PONS: Vorhersage](https://en.pons.com/translate/german-arabic/Vorhersage) | يعرض Vorhersage بمعنى توقع/تنبؤ. |
| `S59` | [PONS: morgen](https://en.pons.com/translate/german-arabic/morgen) | يعرض morgen بمعنى غداً عند استعماله ظرفاً زمنياً. |
| `S60` | [PONS: neblig](https://en.pons.com/translate/german-arabic/neblig) | يعرض neblig بمعنى ضبابي؛ لا يثبت وقوع الضباب الفعلي. |
| `S61` | [PONS: Fluss](https://en.pons.com/translate/german-arabic/Fluss) | يعرض Fluss بمعنى نهر؛ يسند «قرب الأنهار» في سياق المكان. |
| `S62` | [PONS: bewölkt](https://en.pons.com/translate/german-arabic/bew%C3%B6lkt) | يعرض bewölkt بمعنى غائم/مغطى بالغيوم. |
| `S63` | [PONS: Sonne](https://en.pons.com/translate/german-arabic/Sonne) | يعرض Sonne بمعنى الشمس؛ وفي الجملة «تظهر الشمس». |
| `S64` | [PONS: zehn](https://en.pons.com/translate/german-arabic/zehn) | يعرض zehn بمعنى عشرة؛ يسند وقت العاشرة. |
| `S65` | [PONS: Temperatur](https://en.pons.com/translate/german-arabic/Temperatur) | يعرض Temperatur بمعنى درجة الحرارة. |
| `S66` | [PONS: steigen](https://en.pons.com/translate/german-arabic/steigen) | يعرض steigen بمعنى صعد، وansteigen بمعنى ارتفع/زاد؛ يسند ضرورة حفظ معنى الارتفاع في الترجمة. |
| `S67` | [PONS: Grad](https://en.pons.com/translate/german-arabic/Grad) | يعرض Grad بمعنى درجة؛ لا يثبت واقعية القيمة الجوية. |
| `S68` | [PONS: Hitze](https://en.pons.com/translate/german-arabic/Hitze) | يعرض Hitze بمعنى الحر/الحرارة الشديدة؛ لا يحدد عتبة رقمية ثابتة لكلمة «حر». |
| `S69` | [PONS: warm](https://en.pons.com/translate/german-arabic/warm) | يعرض warm بمعنى دافئ/حار بحسب السياق. |
| `S70` | [PONS: April](https://en.pons.com/translate/german-arabic/April) | يعرض April بمعنى أبريل. |
| `S71` | [PONS: Abend](https://en.pons.com/translate/german-arabic/Abend) | يعرض Abend بمعنى المساء. |
| `S72` | [PONS: stark](https://en.pons.com/translate/german-arabic/stark) | يعرض stark بمعنى قوي؛ يسند وصف الرياح. |
| `S73` | [PONS: Wind](https://en.pons.com/translate/german-arabic/Wind) | يعرض Wind بمعنى ريح/رياح. |
| `S74` | [PONS: Westen](https://en.pons.com/translate/german-arabic/Westen) | يعرض Westen بمعنى الغرب. |
| `S75` | [PONS: Berg](https://en.pons.com/translate/german-arabic/Berg) | يعرض Berg بمعنى جبل؛ جمعه في النص «الجبال». |
| `S76` | [PONS: Gewitter](https://en.pons.com/translate/german-arabic/Gewitter) | يعرض Gewitter بمعنى عاصفة رعدية. |
| `S77` | [PONS: Frost](https://en.pons.com/translate/german-arabic/Frost) | يعرض Frost بمعنى صقيع. |
| `S78` | [PONS: Nacht](https://en.pons.com/translate/german-arabic/Nacht) | يعرض Nacht بمعنى الليل. |
| `S79` | [PONS: Jacke](https://en.pons.com/translate/german-arabic/Jacke) | يعرض Jacke بمعنى سترة/جاكيت. |
| `S80` | [PONS: mitnehmen](https://en.pons.com/translate/german-arabic/mitnehmen) | يعرض mitnehmen بمعنى أخذ الشيء مع المرء. |
| `S81` | [PONS: kalt](https://en.pons.com/translate/german-arabic/kalt) | يعرض kalt بمعنى بارد. |
| `S82` | [Deutscher Wetterdienst: Qualität unserer Wettervorhersagen](https://www.dwd.de/DE/wetter/schon_gewusst/qualitaetvorhersage/qualitaetvorhersage_node.html) | يشرح DWD أن تقييم التنبؤ يحدد الظاهرة والفترة/الأفق الزمني والمكان أو المنطقة، وأن التوقع الموضعي وبعض الظواهر يحملان عدم يقين؛ لا يقدّم تحققاً لنشرة بلا موقع وتاريخ محددين. |

| `S83` | [PONS: Wolke](https://en.pons.com/translate/german-arabic/Wolke) | يعرض die Wolke بمعنى سحابة/غيمة؛ يسند وسم المفردة اليتيمة في بيانات d-a2-12 لا تنبؤاً جوياً. |

## بوابات التحقق

| الاختبار | النتيجة الفعلية |
|---|---|
| `./node_modules/.bin/tsc --noEmit` | ناجح |
| `npm run smoke` | **1130/1130**؛ K181a–h والبوابات السابقة ناجحة |
| `npm run interaktiv` | **699/699**؛ رسائل `HTMLMediaElement.play/pause` غير المنفذة في jsdom لا تثبت صوتاً |
| `npm run audit:content` | **صفر عيوب بنيوية مؤكدة**؛ المؤشرات التربوية غير محسومة وليست عيوباً مثبتة |
| `npm run build` | ناجح؛ 11/11 صفحة ساكنة |
| `npm audit --no-fund` | صفر ثغرات |
| `python scripts/patches/review_a2_dialogues_05.py` | إعادة التشغيل آمنة؛ أفاد بأن التصحيح مطبق ولم يضف فرقاً |
| `git diff --check` | ناجح بعد تحديث الملفات |

في محاولات الفحص الأولية: لم يكن `node_modules` موجوداً؛ بعد `npm ci` اختلف نص K181h حرفياً عن Markdown مرتين (عند إدراج عبارة حدود المراجعة، ثم بعد إضافة جدول النتائج)، فُحدّثت المرساة النصية في الاختبار دون تليين نطاقه. كما صُححت مرساة `RULES.md` التي رفضها K120b بسبب علامة هروب زائدة. لم تُخفّف أي بوابة، وأُعيد smoke كاملاً بعد الإصلاحات؛ النتيجة النهائية 1130/1130. لا تحل هذه البوابات محل مراجعة بشرية ولا تثبت صحة الصوت أو الوقائع الجوية/القانونية.
