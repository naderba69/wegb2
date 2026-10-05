# R108 — مراجعة الحوارات A2 d-a2-13–d-a2-15

**التاريخ:** 2026-10-05 · **الفرع:** `arena/01a0fee7-wegb2` · **التقرير:** `docs/content-review-a2-dialogues-06-2026-10-05.json`

## الخلاصة والنطاق

رُوجعت **42 وحدة** على حدة: 3 بيانات حوار، 24 سطراً، 9 أسئلة مع الخيارات والمفاتيح والشروح، و6 جمل إملاء. وفُحصت **29 مفردة waisen** داخل بيانات الحوارات (ليست وحدات إضافية). النتيجة: **39 سليماً، 1 مصححاً، 2 غير محسوم**؛ والحكم غير المحسوم ليس إثبات خطأ. استُخدمت **81 مرجعاً منشوراً** وربط كل وحدة بمصدر أو أكثر.

التغيير الوحيد هو `d-a2-13.lines[2].ar`؛ لم تتغير الألمانية أو الأسئلة أو المستويات. أُبقي غموض معنى الأمتعة في `d-a2-14.lines[2]` ونطاق معلومة الإكرامية في `d-a2-14.lines[7]` دون تخمين. لم يُستنتج أسلوب إذابة اللحم من `d-a2-15.lines[1]`.

## المنهج والحدود

استُخرجت اللقطات والمعرفات من content/dialogues.json بعد إعادة فحص Git والتقارير. لكل وحدة 42 سُجل الدليل والحكم والإجراء واللقطة الحية؛ وربطت وسوم waisen الثمانية/العشرة/الإحدى عشرة بمصادرها الفردية. استُخدمت صفحات معجمية للمعنى فقط، ومصادر رسمية/سياقية لما قد يتعلق بسلامة الطعام. اقتصر التصحيح على خطأ عربي مؤكد؛ وفُصلت الملاحظات الأسلوبية والوقائع التي لا يحسمها السياق.

المداخل المعجمية تسند معاني الكلمات فقط ولا تثبت وحدها سلامة الجملة كاملة. المصدر الألماني الأولي `dialoge_a2_neu1.py` يقارن بعض النصوص القديمة لكنه ليس مرجعاً لغوياً ولا سجلاً كاملاً. لا مراجعة بشرية أو اعتماد مهني، ولا تقييم CEFR. لم يحدث استماع أو تشغيل صوت.

## سجل كل وحدة — اللقطة الحية والدليل والحكم والإجراء

| المعرّف | النوع | الحكم | الدليل والحكم | الإجراء | المصادر واللقطة الحية |
|---|---|---|---|---|---|
| `d-a2-13` | بيانات الحوار/العنوان/وسوم waisen | **سليم** | العنوان Der erste Arbeitstag يقابله «أول يوم عمل». فُحصت مفردات waisen الثماني كلمةً كلمةً بالمراجع المسندة هنا: Einarbeitung، Fortbildung، Teamarbeit، Kenntnisse، sich vorstellen، Zeitdruck، Firma، pünktlich. مدخل Duden هو الدليل الأساسي على الاسم Einarbeitung؛ لا تكفي نتيجة بحث معجمية عن الفعل وحده للحكم على الاسم. اللقطة الحية: A2؛ 8 أسطر/3 أسئلة/جملتا إملاء؛ neu=true. لا يُعاد تقييم CEFR. | لا تغيير للعنوان أو الوسوم أو المستوى؛ لا تعميم لمدة التهيئة المذكورة في حوار شركة خيالية. | S01, S02, S03, S04, S05, S06, S07, S08, S30<br>العنوان الألماني: Der erste Arbeitstag<br>العنوان العربي: أول يوم عمل<br>المستوى: A2؛ الأسطر/الأسئلة/الإملاء: 8/3/2<br>neu: True؛ waisen (8): die Einarbeitung، die Fortbildung، die Teamarbeit، die Kenntnisse، sich vorstellen، der Zeitdruck، die Firma، pünktlich |
| `d-a2-13.lines[0]` | سطر ألماني/ترجمته | **سليم** | الترحيب وتقديم Frau Mansour إلى الفريق محفوظان. مقابلات الشركة وتقديم شخص إلى فريق تدعمها المداخل المعجمية؛ «هل أقدّمك للفريق؟» عربية مفهومة ومطابقة للسؤال الرسمي. لا يثبت المعجم وحده طبيعية الجملة كاملة. | لا تغيير؛ صياغة التحية العربية البديلة مسألة أسلوب لا خطأ معنى ثابت. | S07, S05, S03, S43<br>DE: Willkommen in der Firma, Frau Mansour! Darf ich Sie dem Team vorstellen?<br>AR: أهلاً بك في الشركة سيدة منصور! هل أقدّمك للفريق؟ |
| `d-a2-13.lines[1]` | سطر ألماني/ترجمته | **سليم** | nervös يقابل «متوترة»، وsich freuen يدل على السرور. «بكل سرور… متوترة قليلاً لكنني سعيدة» يحفظ التردد والفرح مع تأنيث المتحدثة؛ ليست سلاسة جملة عربية كاملة مستنتجة من مدخل مفردة. | لا تغيير. | S39, S40<br>DE: Sehr gern. Ich bin etwas nervös, aber ich freue mich.<br>AR: بكل سرور. أنا متوترة قليلاً لكنني سعيدة. |
| `d-a2-13.lines[2]` | سطر ألماني/ترجمته | **مُصحح** | كان «في هذه الفترة لا ضغط وقت» نقلاً حرفياً متعثراً وغير طبيعي في العربية، وZeitdruck يعني ضغطاً زمنياً. الصياغة الجديدة «تستغرق فترة التهيئة في العمل أربعة أسابيع. وخلالها لا يوجد ضغط زمني» تحفظ مدة Einarbeitung ونفي الضغط. مدة الأسابيع ادعاء داخل حوار الشركة لا حقيقة عامة. | صُحح حقل العربية وحده إلى ترجمة عربية سليمة؛ لم يتغير الألماني أو المدة أو مفتاح السؤال، ولم تُعمم المدة على أصحاب العمل. | S01, S06, S76, S77<br>DE: Die Einarbeitung dauert vier Wochen. In dieser Zeit gibt es keinen Zeitdruck.<br>AR: تستغرق فترة التهيئة في العمل أربعة أسابيع. وخلالها لا يوجد ضغط زمني.<br>قبل التعديل: {"de": "Die Einarbeitung dauert vier Wochen. In dieser Zeit gibt es keinen Zeitdruck.", "ar": "فترة التأهيل تدوم أربعة أسابيع. في هذه الفترة لا ضغط وقت."} |
| `d-a2-13.lines[3]` | سطر ألماني/ترجمته | **سليم** | معنى شرح البرنامج على الحاسوب وسؤال الموظفة إن كانت المديرة هي التي ستشرحه محفوظ. «أنتِ كمديرة؟» يؤدي Sie als Chefin هنا، ويطابق تأنيث المخاطبة؛ المداخل تثبت معاني المفردات لا الحكم على كل تركيب. | لا تغيير؛ لا التباس يثبت خطأً ملزماً. | S41, S42, S43<br>DE: Das ist gut. Und wer erklärt mir das Programm am Computer, Sie als Chefin?<br>AR: هذا جيد. ومن يشرح لي البرنامج على الحاسوب، أنتِ كمديرة؟ |
| `d-a2-13.lines[4]` | سطر ألماني/ترجمته | **سليم** | Tom هو الزميل، وله معرفة جيدة وصبر كثير، والعمل الجماعي مهم: العناصر الأساسية كلها في العربية. معرفة/معارف وزميل وصبر معانٍ مؤيدة بالمداخل؛ الجملة تخص الشركة الخيالية. | لا تغيير ولا تعميم لادعاء أهمية Teamarbeit على كل شركة. | S04, S03, S44, S45<br>DE: Ihr Kollege Tom. Er hat gute Kenntnisse und viel Geduld. Teamarbeit ist bei uns wichtig.<br>AR: زميلك توم. لديه معرفة جيدة وصبر كبير. العمل الجماعي مهم عندنا. |
| `d-a2-13.lines[5]` | سطر ألماني/ترجمته | **سليم** | السؤال عن وجود Fortbildung إضافية يقابله «هل يوجد تكوين مستمر أيضاً؟». «تكوين مستمر» اختيار عربي مفهوم؛ يمكن تفضيل «تدريب/تطوير مهني» حسب الجمهور، دون ثبوت خطأ ترجمي. | لا تغيير؛ البديل الأسلوبي ليس عيباً مؤكداً. | S02<br>DE: Gibt es auch eine Fortbildung?<br>AR: هل يوجد تكوين مستمر أيضاً؟ |
| `d-a2-13.lines[6]` | سطر ألماني/ترجمته | **سليم** | الخريف ويومان في كولن ودفع الشركة لكل شيء عناصر منقولة. المصادر تسند معاني الموسم والدفع والشركة؛ لا تتحقق من سياسة شركة حقيقية. | لا تغيير؛ تبقى المعلومة داخل الحوار الخيالي. | S07, S78, S79<br>DE: Ja, im Herbst, zwei Tage in Köln. Die Firma bezahlt alles.<br>AR: نعم، في الخريف، يومان في كولن. الشركة تدفع كل شيء. |
| `d-a2-13.lines[7]` | سطر ألماني/ترجمته | **سليم** | النية «سأكون غداً في الثامنة ملتزمة بالموعد» محفوظة؛ pünktlich لا تعني مجرد «بالضبط» في كل سياق، لكن العربية «في الثامنة بالضبط» مفهومة ولا يثبت هنا انحراف يستدعي إصلاحاً. | لا تغيير؛ يمكن استعمال «سأكون هنا غداً في الثامنة تماماً/في الموعد» كبديل أسلوبي فقط. | S08, S80, S81<br>DE: Danke! Ich bin morgen pünktlich um acht da.<br>AR: شكراً! سأكون هنا غداً في الثامنة بالضبط. |
| `d-a2-13-q1` | سؤال/خيارات/مفتاح/شرح | **سليم** | المفتاح vier Wochen منصوص عليه في d-a2-13.lines[2]. المشتتان «يومان» و«حتى الخريف» يخصان التدريب اللاحق؛ الخيارات الثلاثة متميزة ومفتاحها حاضر في النص. | لا تغيير للمفتاح أو الخيارات أو الشرح. | S01, S02, S76, S77<br>DE: Wie lange dauert die Einarbeitung?<br>AR prompt: اختر الإجابة الصحيحة حسب الحوار.<br>الخيارات: zwei Tage؛ bis zum Herbst؛ vier Wochen<br>المفتاح: vier Wochen<br>الشرح: الدليل: «Die Einarbeitung dauert vier Wochen». الفخّ 1: يومان هي مدة التكوين في كولن. الفخّ 2: الخريف موعد التكوين. |
| `d-a2-13-q2` | سؤال/خيارات/مفتاح/شرح | **سليم** | السؤال يسأل عمن يشرح البرنامج؛ الجواب ihr Kollege Tom يطابق السطر 4 حرفياً، والمشتتان المديرة/مدرب كولن لا يناقضان النص. الشرح يستشهد بالدليل ويشرح الفخاخ. | لا تغيير. | S42, S41, S44, S04<br>DE: Wer erklärt Frau Mansour das Programm?<br>AR prompt: اختر الإجابة الصحيحة حسب الحوار.<br>الخيارات: ihr Kollege Tom؛ die Chefin؛ ein Trainer in Köln<br>المفتاح: ihr Kollege Tom<br>الشرح: الدليل: «Ihr Kollege Tom. Er hat gute Kenntnisse und viel Geduld». الفخّ 1: المديرة تقدّمها للفريق فقط. الفخّ 2: كولن مكان التكوين. |
| `d-a2-13-q3` | سؤال/خيارات/مفتاح/شرح | **سليم** | الفراغ بعد keinen يطلب الاسم Zeitdruck، وهو الجواب المنقول حرفياً في السطر 2؛ الشرح يقتبس الجملة نفسها. | لا تغيير. | S06<br>DE: In dieser Zeit gibt es keinen ___.<br>AR prompt: أكمل الفراغ بالكلمة المناسبة من الحوار.<br>الخيارات: <br>المفتاح: Zeitdruck<br>الشرح: الدليل: «In dieser Zeit gibt es keinen Zeitdruck». |
| `d-a2-13.dictation[0]` | جملة إملاء | **سليم** | جملة الإملاء مطابقة حرفياً للجملة الأولى من سطر التهيئة، ومدة الأسابيع محفوظة. | لا تغيير. | S01, S76, S77<br>DE: Die Einarbeitung dauert vier Wochen. |
| `d-a2-13.dictation[1]` | جملة إملاء | **سليم** | جملة الإملاء مطابقة حرفياً لـTeamarbeit ist bei uns wichtig؛ معنى العمل التعاوني يسنده DWDS. | لا تغيير. | S03<br>DE: Teamarbeit ist bei uns wichtig. |
| `d-a2-14` | بيانات الحوار/العنوان/وسوم waisen | **سليم** | العنوان Ankunft im Hotel يقابله «الوصول إلى الفندق». فُحصت مفردات waisen العشر كلمةً كلمةً: Landung، Rezeption، Einzelzimmer، Übernachtung، Reiseführer، Aussicht، sich verlaufen، Notausgang، Trinkgeld، Gepäck. اللقطة الحية A2؛ 8/3/2؛ neu=true. لا إعادة لتقييم CEFR. | لا تغيير للعنوان أو الوسوم أو المستوى. حُفظت النقاط السياقية المفتوحة منفصلة عن سلامة اللغة. | S31, S32, S09, S10, S11, S12, S13, S14, S15, S16, S17, S18<br>العنوان الألماني: Ankunft im Hotel<br>العنوان العربي: الوصول إلى الفندق<br>المستوى: A2؛ الأسطر/الأسئلة/الإملاء: 8/3/2<br>neu: True؛ waisen (10): die Landung، die Rezeption، das Einzelzimmer، die Übernachtung، der Reiseführer، die Aussicht، sich verlaufen، der Notausgang، das Trinkgeld، das Gepäck |
| `d-a2-14.lines[0]` | سطر ألماني/ترجمته | **سليم** | تحية المساء وحجز غرفة مفردة باسم Trabelsi محفوظة في «مساء الخير. حجزت غرفة مفردة باسم الطرابلسي». الحجز والغرفة المفردة والتحية مدعومة معجمياً؛ تهجئة الاسم علمٌ من النص. | لا تغيير. | S11, S47, S53<br>DE: Guten Abend. Ich habe ein Einzelzimmer reserviert, auf den Namen Trabelsi.<br>AR: مساء الخير. حجزت غرفة مفردة باسم الطرابلسي. |
| `d-a2-14.lines[1]` | سطر ألماني/ترجمته | **سليم** | الترحيب والسؤال عن الرحلة محفوظان في «أهلاً! كيف كانت الرحلة؟». PONS يثبت معنى الترحيب والرحلة الجوية، لا يفرض مقابلاً عربياً بعينه للتحية. | لا تغيير. | S52, S46, S32<br>DE: Willkommen! Wie war der Flug?<br>AR: أهلاً! كيف كانت الرحلة؟ |
| `d-a2-14.lines[2]` | سطر ألماني/ترجمته | **غير محسوم** | landung pünktlich واضحان، لكن «Ich habe nur ein kleines Gepäck» لا يثبت أن المتكلم يقصد قطعة واحدة: Gepäck يدل على الأمتعة كمجموع، وGepäckstück على قطعة منفردة. العربية الحية «معي أمتعة صغيرة فقط» تميل إلى وصف كمية/حجم، لا إلى «حقيبة واحدة». لا نقرر المقصود ولا نصف العبارة خطأً مؤكداً دون توضيح. | أُبقي الألمانية والعربية كما هما. إن كان المقصود قطعة واحدة فـGepäckstück خيار أدق؛ وإن كان المقصود قلة الأمتعة فتلزم صياغة مثل wenig Gepäck. لا يُطبق أي منهما قبل تأكيد النية. | S09, S08, S18, S35, S36, S37<br>DE: Lang, aber die Landung war pünktlich. Ich habe nur ein kleines Gepäck.<br>AR: طويلة، لكن الهبوط كان في موعده. معي أمتعة صغيرة فقط. |
| `d-a2-14.lines[3]` | سطر ألماني/ترجمته | **سليم** | الغرفة 312 والطابق الثالث والإطلالة على النهر وثلاث ليالٍ محفوظة. PONS Stock يحدد معنى الطابق، لا معنى العصا، في هذا السياق؛ Aussicht/Fluss/Übernachtung تسند المقابلات العربية. | لا تغيير. | S14, S12, S49, S48<br>DE: Zimmer 312, dritter Stock, mit Aussicht auf den Fluss. Drei Übernachtungen, richtig?<br>AR: الغرفة 312، الطابق الثالث، بإطلالة على النهر. ثلاث ليالٍ، صحيح؟ |
| `d-a2-14.lines[4]` | سطر ألماني/ترجمته | **سليم** | طلب دليل للمدينة وكون الضيف يضل طريقه سريعاً محفوظان. «أضيع بسرعة» ممكن؛ «أضل الطريق بسهولة» بديل عربي أسلوبي إذا أريد معنى التكرار/السهولة، لا خطأ مؤكد. | لا تغيير. | S13, S15<br>DE: Ja. Haben Sie einen Reiseführer für die Stadt? Ich verlaufe mich schnell.<br>AR: نعم. هل لديكم دليل سياحي للمدينة؟ أضيع بسرعة. |
| `d-a2-14.lines[5]` | سطر ألماني/ترجمته | **سليم** | كون الدليل مجانياً وموقع مخرج الطوارئ في نهاية الممر يساراً محفوظ. Flur هنا ممر/ردهة، وlinks اتجاه إلى اليسار؛ للمفردة معنى آخر خارج السياق. | لا تغيير. | S16, S70, S71, S72<br>DE: Hier, kostenlos. Der Notausgang ist am Ende des Flurs, links.<br>AR: تفضّل، مجاناً. مخرج الطوارئ في نهاية الممر، يساراً. |
| `d-a2-14.lines[6]` | سطر ألماني/ترجمته | **سليم** | السؤال «هل يُعطى بقشيش هنا؟» مفهوم ومطابق للسياق الفندقي؛ «بقشيش» اختيار عربي دارج، ويمكن استخدام «إكرامية» فصحى دون أن يلزم ذلك. | لا تغيير؛ لا يُفترض بلد الفندق أو الجهة المتلقية. | S17, S54<br>DE: Danke. Gibt man hier Trinkgeld?<br>AR: شكراً. هل يُعطى بقشيش هنا؟ |
| `d-a2-14.lines[7]` | سطر ألماني/ترجمته | **غير محسوم** | المعاني «اختياري/طوعي» و«يورو أو اثنان» قابلة للنقل. لكن حكم «معتاد هنا» غير قابل للتعميم: المصدر الفندقي الذي فُحص يذكر housekeeping وسياق إقامة بعينه، ويصف tipping للاستقبال بأنه أقل شيوعاً؛ الحوار لا يحدد المكان أو متلقي الإكرامية. | أُبقي النص دون تغيير ولا أقدّم عرفاً عاماً. يلزم تحديد المكان والجهة أو تأطير العبارة على أنها قول شخصية/عرف محلي. | S17, S73, S74, S75, S54<br>DE: Das ist freiwillig, ein bis zwei Euro sind üblich.<br>AR: هذا اختياري، يورو أو اثنان هو المعتاد. |
| `d-a2-14-q1` | سؤال/خيارات/مفتاح/شرح | **سليم** | المفتاح يجمع معلومتين ظاهرتين: Einzelzimmer في السطر 0 والإطلالة على النهر في السطر 3. المشتتان يخلطان معلومات صحيحة عن الطابق/الممر مع نوع الغرفة أو مخرج الطوارئ؛ الشرح يوضح ذلك. | لا تغيير. | S11, S14, S48<br>DE: Was für ein Zimmer hat der Gast?<br>AR prompt: اختر الإجابة الصحيحة حسب الحوار.<br>الخيارات: ein Einzelzimmer mit Aussicht auf den Fluss؛ ein Doppelzimmer im dritten Stock؛ ein Zimmer am Ende des Flurs, links<br>المفتاح: ein Einzelzimmer mit Aussicht auf den Fluss<br>الشرح: الدليل: «Ich habe ein Einzelzimmer reserviert» و«mit Aussicht auf den Fluss». الفخّ 1: الطابق الثالث صحيح لكن الغرفة مفردة لا مزدوجة. الفخّ 2: نهاية الممر يساراً هو مخرج الطوارئ. |
| `d-a2-14-q2` | سؤال/خيارات/مفتاح/شرح | **سليم** | المفتاح drei يطابق «Drei Übernachtungen, richtig?» ثم «Ja». مثال Lingoneo يؤيد سؤالاً فندقياً أكثر تداولاً بـNächte؛ لكنه لا يثبت أن السؤال الحي «Wie viele Übernachtungen bleibt er?» خطأ نحوي قاطع، لذلك يبقى اقتراحاً أسلوبياً لا تصحيحاً مفروضاً. | لا تغيير؛ لا يُستبدل promptDe ببديل أسلوبي دون دليل أقوى على خطأ مؤكد. | S12, S38<br>DE: Wie viele Übernachtungen bleibt er?<br>AR prompt: اختر الإجابة الصحيحة حسب الحوار.<br>الخيارات: zwei؛ drei؛ eine Übernachtung<br>المفتاح: drei<br>الشرح: الدليل: «Drei Übernachtungen, richtig?» … «Ja». الفخّ: «ein bis zwei Euro» هو البقشيش. |
| `d-a2-14-q3` | سؤال/خيارات/مفتاح/شرح | **سليم** | العبارة «الدليل يكلف يوروين» خاطئة بحسب السطر «Hier, kostenlos». معنى kostenlos مجاني؛ اليورو أو الاثنان ذُكرا في جواب الإكرامية لا ثمن الدليل. | لا تغيير للمفتاح أو الخيارات أو الشرح. | S13, S72, S75<br>DE: Der Reiseführer kostet zwei Euro.<br>AR prompt: هل العبارة صحيحة أم خاطئة حسب الحوار؟<br>الخيارات: richtig؛ falsch<br>المفتاح: falsch<br>الشرح: الدليل: «Hier, kostenlos». اليورو أو الاثنان هما البقشيش المعتاد. |
| `d-a2-14.dictation[0]` | جملة إملاء | **سليم** | الجملة منقولة حرفياً من بداية السطر 2؛ landung/موعد الهبوط محفوظان. | لا تغيير. | S09, S08<br>DE: Lang, aber die Landung war pünktlich. |
| `d-a2-14.dictation[1]` | جملة إملاء | **سليم** | الجملة مطابقة للسطر 5؛ المعجم يدعم مخرج الطوارئ والممر والاتجاه يساراً. | لا تغيير. | S16, S70, S71<br>DE: Der Notausgang ist am Ende des Flurs, links. |
| `d-a2-15` | بيانات الحوار/العنوان/وسوم waisen | **سليم** | العنوان Zusammen kochen يقابله «نطبخ معاً». فُحصت مفردات waisen الإحدى عشرة كلمةً كلمةً: Zutat، Mehl، braten، Soße، Pfeffer، Backofen، vorheizen، Schüssel، umrühren، einfrieren، auftauen. اللقطة A2؛ 8/3/2؛ neu=true؛ لا إعادة لتقييم CEFR. | لا تغيير للعنوان أو المستوى أو الوسوم؛ نقاط سلامة الطعام مفصولة عن الحكم اللغوي. | S33, S34, S19, S20, S21, S22, S23, S24, S25, S26, S27, S28, S29<br>العنوان الألماني: Zusammen kochen<br>العنوان العربي: نطبخ معاً<br>المستوى: A2؛ الأسطر/الأسئلة/الإملاء: 8/3/2<br>neu: True؛ waisen (11): die Zutat، das Mehl، braten، die Soße، der Pfeffer، der Backofen، vorheizen، die Schüssel، umrühren، einfrieren، auftauen |
| `d-a2-15.lines[0]` | سطر ألماني/ترجمته | **سليم** | السؤال عن توافر المكونات وقائمة Mehl/Eier/Milch/Zwiebeln محفوظة. العربية تستخدم اسم «بصل» الجمعي بدلاً من جمع عددي، وهو مناسب للمادة الغذائية في هذا السياق. | لا تغيير. | S19, S20, S58, S59, S50<br>DE: Hast du alle Zutaten? Mehl, Eier, Milch und Zwiebeln?<br>AR: هل لديك كل المكونات؟ طحين وبيض وحليب وبصل؟ |
| `d-a2-15.lines[1]` | سطر ألماني/ترجمته | **سليم** | المعنى اللغوي: أخذ اللحم من حجرة التجميد أمس وأصبح مذاباً؛ العربية تنقل ذلك. نوع اللحم وطريقة/درجة الذوبان غير مذكورين. LGL يعطي احتياطات عامة لسائل الذوبان، وBfR يتناول الدواجن تحديداً؛ لا يثبت أي منهما وقوع معالجة غير آمنة هنا. | لا تعديل لغوي ولا حكم على سلامة طريقة غير مذكورة؛ تُحفظ الملاحظة السياقية فقط. | S29, S60, S61, S55, S56<br>DE: Ja. Das Fleisch habe ich gestern aus dem Gefrierfach genommen, es ist aufgetaut.<br>AR: نعم. اللحم أخرجته أمس من الفريزر، وقد ذاب. |
| `d-a2-15.lines[2]` | سطر ألماني/ترجمته | **سليم** | تعليمة الوصفة المختصرة مفهومة: سخّنوا الفرن مسبقاً، 180 درجة. Duden يدعم معنى vorheizen، ومصادر الوصفات تعرض الصياغة الأوضح «auf 180 Grad vorheizen»؛ حذف auf لا يكفي وحده لإثبات خطأ في هذه الشذرة الحوارية. | لا تغيير؛ يُسجل البديل «Zuerst den Backofen auf 180 Grad vorheizen» كملاحظة وضوح اختيارية فقط. | S24, S25, S69, S57<br>DE: Gut. Zuerst den Backofen vorheizen, 180 Grad.<br>AR: جيد. أولاً نسخّن الفرن مسبقاً، 180 درجة. |
| `d-a2-15.lines[3]` | سطر ألماني/ترجمته | **سليم** | السؤال عن قلي البصل في المقلاة مطابق لمعاني الأفعال والأسماء في سياق وصفة الطعام. | لا تغيير. | S21, S50, S62<br>DE: Und ich brate die Zwiebeln in der Pfanne?<br>AR: وأنا أقلي البصل في المقلاة؟ |
| `d-a2-15.lines[4]` | سطر ألماني/ترجمته | **سليم** | إضافة الطحين والحليب إلى الوعاء والتحريك جيداً كي لا تتكوّن كتل محفوظة. العربية تتبع الإضمار الإرشادي في «Dann Mehl und Milch in die Schüssel…» ولا تفقد خطوة أساسية. | لا تغيير. | S20, S26, S27, S59, S63<br>DE: Ja, langsam. Dann Mehl und Milch in die Schüssel und gut umrühren, sonst gibt es Klumpen.<br>AR: نعم، ببطء. ثم الطحين والحليب في الوعاء ونحرّك جيداً وإلا تكوّنت كتل. |
| `d-a2-15.lines[5]` | سطر ألماني/ترجمته | **سليم** | السؤال عما إذا كان الفلفل سيُضاف إلى الصلصة منقول بوضوح. | لا تغيير. | S23, S22<br>DE: Kommt Pfeffer in die Soße?<br>AR: هل يُضاف الفلفل إلى الصلصة؟ |
| `d-a2-15.lines[6]` | سطر ألماني/ترجمته | **سليم** | قليل من الفلفل في النهاية، والملح موجود/سبق وضعه: المعنى الحواري محفوظ. «Salz haben wir schon» حذف محادثي، والعربية «الملح وضعناه» تصرّح بما يفهم من سياق إعداد الطعام؛ لا دليل قاطع على أن الإضمار يعني مجرد امتلاك الملح خارج الوصفة. | لا تغيير تخميني؛ يمكن توضيحها أسلوبياً إلى «الملح أضفناه بالفعل» إذا أراد المحرر هذا المعنى. | S65, S64, S66<br>DE: Nur ein bisschen, am Ende. Salz haben wir schon.<br>AR: قليلاً فقط، في النهاية. الملح وضعناه. |
| `d-a2-15.lines[7]` | سطر ألماني/ترجمته | **سليم** | السؤال عن تجميد الباقي، ثم أن الكمية تكفي يومين، محفوظ. PONS يدعم Rest وreichen بمعنى يكفي وTag بوصفه يوماً. | لا تغيير؛ لا ادعاء مدة حفظ آمنة للطعام. | S28, S67, S68, S51<br>DE: Und den Rest frieren wir ein? Das reicht für zwei Tage.<br>AR: والباقي نجمّده؟ يكفي ليومين. |
| `d-a2-15-q1` | سؤال/خيارات/مفتاح/شرح | **سليم** | الإجابة «أخرج اللحم من حجرة التجميد» مذكورة حرفياً في السطر 1؛ قلي البصل وتسخين الفرن خطوات تالية، لا فعل الأمس. شرح الفخاخ متوافق. | لا تغيير. | S60, S61, S29<br>DE: Was hat Yusuf gestern gemacht?<br>AR prompt: اختر الإجابة الصحيحة حسب الحوار.<br>الخيارات: die Zwiebeln gebraten؛ das Fleisch aus dem Gefrierfach genommen؛ den Backofen vorgeheizt<br>المفتاح: das Fleisch aus dem Gefrierfach genommen<br>الشرح: الدليل: «Das Fleisch habe ich gestern aus dem Gefrierfach genommen». الفخّ 1: القلي الآن. الفخّ 2: التسخين هو أول خطوة اليوم. |
| `d-a2-15-q2` | سؤال/خيارات/مفتاح/شرح | **سليم** | الإجابة لأن التحريك يمنع الكتل منصوص عليها بـ«sonst gibt es Klumpen». مشتت الصلصة الحارة يخص الفلفل، ومشتت ذوبان اللحم يخص اليوم السابق. | لا تغيير. | S27, S63, S23, S22<br>DE: Warum soll man gut umrühren?<br>AR prompt: اختر الإجابة الصحيحة حسب الحوار.<br>الخيارات: damit die Soße scharf wird؛ damit das Fleisch auftaut؛ weil es sonst Klumpen gibt<br>المفتاح: weil es sonst Klumpen gibt<br>الشرح: الدليل: «gut umrühren, sonst gibt es Klumpen». الفخّ 1: الفلفل هو ما يخصّ الحرارة. الفخّ 2: اللحم ذاب أمس. |
| `d-a2-15-q3` | سؤال/خيارات/مفتاح/شرح | **سليم** | الفراغ بعد den Backofen يطلب vorheizen، وهو الفعل نفسه في السطر 2؛ 180 Grad جزء من التعليمة. صياغة الوصفة المختصرة ليست خللاً في مفتاح السؤال. | لا تغيير. | S24, S25, S69, S57<br>DE: Zuerst den Backofen ___, 180 Grad.<br>AR prompt: أكمل الفراغ بالكلمة المناسبة من الحوار.<br>الخيارات: <br>المفتاح: vorheizen<br>الشرح: الدليل: «Zuerst den Backofen vorheizen, 180 Grad». |
| `d-a2-15.dictation[0]` | جملة إملاء | **سليم** | جملة الإملاء مطابقة حرفياً لتعليمة الفرن في السطر 2؛ لا يثبت اختيار الشذرة أن صياغة وصفة أخرى غير صحيحة. | لا تغيير. | S24, S25, S69, S57<br>DE: Zuerst den Backofen vorheizen, 180 Grad. |
| `d-a2-15.dictation[1]` | جملة إملاء | **سليم** | جملة الإملاء «Kommt Pfeffer in die Soße?» نسخة حرفية من السطر 5. | لا تغيير. | S23, S22<br>DE: Kommt Pfeffer in die Soße? |

## ملاحظات سياقية غير محسومة

| المعرّف | الحالة | الوحدات ذات الصلة | الدليل المحدود والحكم | الإجراء | المصادر |
|---|---|---|---|---|---|
| `d-a2-14.lines[2]` | غير محسوم | `d-a2-14.lines[2]` | Gepäck يدل على مجموع الأمتعة؛ Gepäckstück على قطعة منفردة. النص العربي الحالي لا يصرح بحقيبة واحدة، ولا يوضح قصد المؤلف أهو قلة الأمتعة أم قطعة صغيرة. المصدر يفرّق المعنيين ولا يحسم نية الحوار. | لا تغيير حتى تأكيد المقصود؛ إن كان المقصود قطعة واحدة فليُراجع de/ar معاً، وإن كان المقصود قلة الأمتعة فلتعتمد صياغة ذلك المعنى. | S18, S35, S36, S37 |
| `d-a2-14.lines[7]` | غير محسوم | `d-a2-14.lines[6]`, `d-a2-14.lines[7]` | السؤال/الجواب عن «هنا» يتوقف على بلد الفندق والجهة المقصودة. المصدر الفندقي الذي فُحص يذكر الإكرامية اختيارية ونحو 1–2 يورو لعمال housekeeping وفق سياق إقامة، ويذكر أن الإكرامية للاستقبال غير معتادة غالباً؛ لا يثبت أن الرقم «معتاد» في فندق غير محدد. | يُحفظ النص بلا حكم عام أو تغيير تخميني؛ يلزم سياق جغرافي وتحديد متلقي الإكرامية إذا أريد تقرير العرف كحقيقة تعليمية. | S17, S54, S73, S74, S75 |
| `d-a2-15.lines[1]` | غير محسوم | `d-a2-15.lines[1]` | طريقة وحرارة إذابة اللحم غير مذكورتين، كما أن نوعه غير محدد. LGL يذكر فصل سائل الذوبان، وBfR يقدم إرشاداً خاصاً بالدواجن؛ لا يسمح أي منهما بنسبة طريقة خطرة إلى الجملة أو الحكم على سلامة حالة لم يصفها الحوار. | لا تعديل ولا نصيحة سلامة مستنتجة من هذه الجملة؛ إن أريد تحويل الحوار إلى وصفة إرشادية فيلزم تحديد نوع اللحم وطريقة الإذابة وإسنادها إلى دليل مناسب. | S60, S61, S29, S55, S56 |

## بدائل أسلوبية مؤجلة — ليست أخطاء مؤكدة

| المعرّف | البديل المدعوم | لماذا لم يُطبّق | المصادر |
|---|---|---|---|
| `d-a2-14-q2.promptDe` | Wie viele Nächte bleibt der Gast? | Lingoneo يسند استعمال Nächte في سؤال الحجز/مدة الإقامة؛ صياغة d-a2-14 الحية ليست مثبتة هنا كخطأ نحوي قاطع، لذا لا تستبدل لمجرد أن البديل أشيع. | S12, S38 |
| `d-a2-15.lines[2].de` | Zuerst den Backofen auf 180 Grad vorheizen. | توضح درجة الفرن داخل التركيب نفسه، لكن «Zuerst den Backofen vorheizen, 180 Grad» مفهومة كتعليمة وصفة محكية؛ الإكمال تحسين وضوح اختياري لا خطأ مؤكد. | S24, S25, S69, S57 |

## التغيير المحروس

الحقول المعدلة: 1 — `d-a2-13.lines[2].ar`.

السبب: أُصلح التركيب العربي غير الطبيعي «لا ضغط وقت» إلى «لا يوجد ضغط زمني» مع جعل جملة المدة عربية سليمة. لم يتغير النص الألماني أو مدة الأسابيع. لم تُطبق اقتراحات الأمتعة/السؤال الفندقي/تعليمة الفرن لأنها ملتبسة أو أسلوبية لا أخطاء مؤكدة.

النص قبل/بعد موثق في سجل الوحدة والبيانات الحية؛ سكربت الرقعة يفحص النص الألماني والحقول المحمية ويُرفض إذا وجد قيماً غير متوقعة. لا تغيير لـCEFR أو النسبة أو الإجابات أو خياراتها.

## المقارنة التاريخية المحدودة

dialoge_a2_neu1.py يحتوي نص الإنشاء الأولي لبعض الحقول؛ استُخدم للمقارنة الحرفية فقط لا كحكم لغوي أو سجل تعديل كامل. بحث الملف a_dialog_fallen.py لا يجد معرفات d-a2-13 إلى d-a2-15، لذلك لا نستنتج تاريخاً للأسئلة منه.

- `d-a2-13.lines[2].ar`: historical=`فترة التأهيل تدوم أربعة أسابيع. في هذه الفترة لا ضغط وقت.`؛ live=`تستغرق فترة التهيئة في العمل أربعة أسابيع. وخلالها لا يوجد ضغط زمني.`. لقطة الإنشاء تطابق before؛ التغيير الحالي يخص العربية فقط.
- `d-a2-14.lines[2].de`: historical=`Lang, aber die Landung war pünktlich. Ich habe nur ein kleines Gepäck.`؛ live=`Lang, aber die Landung war pünktlich. Ich habe nur ein kleines Gepäck.`. نص الإنشاء يطابق النص الحي؛ لا يستدل منه على نية المؤلف في تحديد عدد القطع.
- `d-a2-14.lines[2].ar`: historical=`طويلة، لكن الهبوط كان في موعده. معي أمتعة صغيرة فقط.`؛ live=`طويلة، لكن الهبوط كان في موعده. معي أمتعة صغيرة فقط.`. نص الإنشاء يطابق النص الحي؛ بقيت دلالة كمية/قطعة غير محسومة.

غير متاح: التسلسل الكامل لتعديلات النص بعد ملف الإنشاء الأولي؛ سجل سابق مستقل لأسئلة هذه المعرفات؛ a_dialog_fallen.py لا يحتويها؛ نية مؤلف d-a2-14.lines[2] في التفريق بين قطعة أمتعة وكمية قليلة؛ أي سجل صوت تاريخي أو تسجيل استماع.

## سجل المصادر المنشورة وحدودها

| ID | المصدر | الرابط | ما يسنده وحدوده |
|---|---|---|---|
| S01 | Duden: Einarbeitung | <https://www.duden.de/rechtschreibung/Einarbeitung> | يعرّف Einarbeitung بأنها إدخال/تهيئة شخص في عمل جديد؛ لا يثبت مدة أربعة أسابيع الخاصة بالشركة الخيالية. |
| S02 | PONS: Fortbildung | <https://en.pons.com/translate/german-arabic/Fortbildung> | يدعم معنى التعليم/التدريب المهني المستمر، ولا يحدد برنامج الشركة أو استحقاقه. |
| S03 | DWDS: Teamarbeit | <https://www.dwds.de/wb/Teamarbeit> | يعرّفها بأنها عمل تعاوني تقوم به مجموعة؛ لا يحكم على أسلوب كل ترجمة عربية. |
| S04 | PONS: Kenntnisse | <https://en.pons.com/translate/german-arabic/Kenntnisse> | يدعم معنى المعارف/المعرفة في سياق المهارات. |
| S05 | PONS: vorstellen | <https://en.pons.com/translate/german-arabic/vorstellen> | يدعم معنى تقديم شخص إلى آخر في تركيب dem Team vorstellen. |
| S06 | Almaany: time pressure | <https://www.almaany.com/ar/dict/ar-en/time-pressure/> | يسجل «ضغط زمني» و«ضغط الوقت» مقابلاً لـZeitdruck؛ لا يقيم صياغة الحوار كاملة. |
| S07 | PONS: Firma | <https://en.pons.com/translate/german-arabic/Firma> | يدعم معنى الشركة. |
| S08 | PONS: pünktlich | <https://en.pons.com/translate/german-arabic/pünktlich> | يدعم معنى الالتزام بالموعد/في الوقت المحدد. |
| S09 | PONS: Landung | <https://en.pons.com/translate/german-arabic/Landung> | يدعم معنى هبوط الطائرة؛ السياق هو الرحلة الجوية. |
| S10 | PONS: Rezeption | <https://en.pons.com/translate/german-arabic/Rezeption> | يدعم معنى مكتب الاستقبال الفندقي بحسب السياق. |
| S11 | PONS: Einzelzimmer | <https://en.pons.com/translate/german-arabic/Einzelzimmer> | يدعم معنى غرفة مفردة/لشخص واحد. |
| S12 | PONS: Übernachtung | <https://en.pons.com/translate/german-arabic/Übernachtung> | يدعم معنى المبيت/الليلة، ولا يحكم وحده على تركيب سؤال الإقامة. |
| S13 | PONS: Reiseführer | <https://en.pons.com/translate/german-arabic/Reiseführer> | يدعم معنى الدليل السياحي. |
| S14 | PONS: Aussicht | <https://en.pons.com/translate/german-arabic/Aussicht> | يدعم معنى الإطلالة/المنظر في تركيب Aussicht auf den Fluss. |
| S15 | PONS: sich verlaufen | <https://en.pons.com/translate/german-arabic/verlaufen> | يدعم معنى أن يضل الشخص طريقه؛ لا يفرض مقابلاً عربياً واحداً. |
| S16 | PONS: Notausgang | <https://en.pons.com/translate/german-arabic/Notausgang> | يعرض معنى مخرج الطوارئ. |
| S17 | PONS: Trinkgeld | <https://en.pons.com/translate/german-arabic/Trinkgeld> | يدعم معنى الإكرامية؛ العرف والمبلغ يتوقفان على المكان والجهة. |
| S18 | PONS: Gepäck | <https://en.pons.com/translate/german-arabic/Gepäck> | يدعم معنى الأمتعة بوصفها مجموعة/حمولة؛ لا يثبت عدّ قطعة منفردة. |
| S19 | Duden: Zutat | <https://www.duden.de/rechtschreibung/Zutat> | يعرّف المكوّن المستخدم في إعداد شيء، مع أمثلة طعام. |
| S20 | PONS: Mehl | <https://en.pons.com/translate/german-arabic/Mehl> | يدعم معنى الطحين/الدقيق. |
| S21 | PONS: braten | <https://en.pons.com/translate/german-arabic/braten> | يدعم معنى القلي/التحمير في استعمال الطهي؛ لا يثبت مقدار الزيت أو السلامة. |
| S22 | PONS: Soße | <https://en.pons.com/translate/german-arabic/Soße> | يدعم معنى الصلصة. |
| S23 | PONS: Pfeffer | <https://en.pons.com/translate/german-arabic/Pfeffer> | يدعم معنى الفلفل بوصفه مكوّناً/تابلاً. |
| S24 | PONS: Backofen | <https://en.pons.com/translate/german-arabic/Backofen> | يدعم معنى فرن الخَبز/الفرن المنزلي. |
| S25 | Duden: vorheizen | <https://www.duden.de/rechtschreibung/vorheizen> | يدعم معنى تسخين الفرن قبل الاستخدام؛ لا يقرر أن العبارة الحوارية المختصرة خطأ. |
| S26 | PONS: Schüssel | <https://en.pons.com/translate/german-arabic/Schüssel> | يدعم معنى الوعاء/الزبدية. |
| S27 | PONS: umrühren | <https://en.pons.com/translate/german-arabic/umrühren> | يدعم معنى التحريك/التقليب. |
| S28 | PONS: einfrieren | <https://en.pons.com/translate/german-arabic/einfrieren> | يدعم معنى التجميد. |
| S29 | PONS: auftauen | <https://en.pons.com/translate/german-arabic/auftauen> | يدعم معنى الذوبان/إزالة التجميد، لا طريقة الذوبان أو سلامتها. |
| S30 | PONS: Arbeitstag | <https://en.pons.com/translate/german-arabic/Arbeitstag> | يعطي يوم عمل مقابلاً لـArbeitstag؛ يدعم عنوان أول يوم عمل. |
| S31 | PONS: Ankunft | <https://en.pons.com/translate/german-arabic/Ankunft> | يدعم معنى الوصول. |
| S32 | PONS: Hotel | <https://en.pons.com/translate/german-arabic/Hotel> | يدعم معنى فندق. |
| S33 | PONS: zusammen | <https://en.pons.com/translate/german-arabic/zusammen> | يدعم معنى معاً. |
| S34 | PONS: kochen | <https://en.pons.com/translate/german-arabic/kochen> | يدعم معنى الطهي/الطبخ، ومنه الاستعمال المتعدي للطعام. |
| S35 | Duden: Gepäck | <https://www.duden.de/rechtschreibung/Gepaeck> | يعرض Gepäck اسماً جمعياً للأمتعة؛ يفيد في تمييزه من قطعة معدودة. |
| S36 | Duden: Gepäckstück | <https://www.duden.de/rechtschreibung/Gepaeckstueck> | يدعم Gepäckstück بوصفه قطعة/عنصراً واحداً من الأمتعة. |
| S37 | PONS: Gepäckstück | <https://en.pons.com/translate/german-arabic/Gepäckstück> | يدعم المقابل العربي لحقيبة/قطعة أمتعة، ولا يحدد المقصود في الجملة الحية. |
| S38 | Lingoneo: booking a hotel room | <https://www.lingoneo.org/learn-german/page/learn-essential-phrases/vacation/booking-a-hotel-room/page-1838> | يعرض الصياغة الفندقية «Wie viele Nächte möchten Sie bleiben?»؛ هذا بديل اصطلاحي مؤيد لا حكم قاطع ببطلان صياغة السؤال الحية. |
| S39 | PONS: nervös | <https://en.pons.com/translate/german-arabic/nerv%C3%B6s> | يعرض من مقابلات nervös «متوتر»؛ لا يختار وحده بين الصيغ العربية. |
| S40 | PONS: sich freuen | <https://en.pons.com/translate/german-arabic/freuen> | يدعم معنى السرور/الفرح في sich freuen. |
| S41 | PONS: Programm | <https://en.pons.com/translate/german-arabic/Programm> | يعرض Programm بمعنى برنامج؛ لا يحدد البرنامج الوظيفي المقصود. |
| S42 | PONS: erklären | <https://en.pons.com/translate/german-arabic/erkl%C3%A4ren> | يعرض شرح/توضيح مقابلاً لـerklären. |
| S43 | PONS: Chefin | <https://en.pons.com/translate/german-arabic/Chefin> | يدعم معنى رئيسة/مديرة بوصفها الصيغة المؤنثة لـChef. |
| S44 | PONS: Kollege | <https://en.pons.com/translate/german-arabic/Kollege> | يدعم معنى زميل؛ يعرض أيضاً Kollegin للمؤنث. |
| S45 | PONS: Geduld | <https://en.pons.com/translate/german-arabic/Geduld> | يدعم معنى الصبر. |
| S46 | PONS: Flug | <https://en.pons.com/translate/german-arabic/Flug> | يدعم معنى رحلة/طيران، ويعين السياق الحديث على معنى الرحلة الجوية. |
| S47 | PONS: reservieren | <https://en.pons.com/translate/german-arabic/reservieren> | يدعم معنى الحجز. |
| S48 | PONS: Fluss | <https://en.pons.com/translate/german-arabic/Fluss> | يعرض النهر معنىً لـFluss؛ يدعم Aussicht auf den Fluss. |
| S49 | PONS: Stock | <https://en.pons.com/translate/german-arabic/Stock> | يفصل مدخل Stock2 عن العصا ويعرض معنى طابق/دور، المطابق لسياق مبنى الفندق. |
| S50 | PONS: Zwiebel | <https://en.pons.com/translate/german-arabic/Zwiebel> | يدعم معنى البصل؛ لا يفرض إظهار الجمع في العربية مع اسم المادة. |
| S51 | PONS: Tag | <https://en.pons.com/translate/german-arabic/Tag> | يدعم معنى اليوم في Das reicht für zwei Tage. |
| S52 | PONS: willkommen | <https://en.pons.com/translate/german-arabic/willkommen> | يعرض مقابلات ترحيب عربية مثل مرحباً/أهلاً وسهلاً. |
| S53 | PONS: Guten Abend | <https://en.pons.com/translate/german-arabic/Guten+Abend> | يعرض التحية المسائية «مساء الخير». |
| S54 | Reisereporter: Trinkgeld im Hotel | <https://www.reisereporter.de/tipps-und-tricks/wissen-fuer-reise-nerds/trinkgeld-im-hotel-so-machen-reisende-es-richtig-YFJ67IMCCDJLSIWQLC7DCSUJ6W.html> | يعرض الإكرامية الفندقية اختيارية، ويذكر نحو 1–2 يورو لعمال housekeeping بحسب الإقامة، مع أن الإكرامية للاستقبال غير معتادة غالباً؛ لا يعمم على مكان أو جهة غير محددين. |
| S55 | LGL Bayern: Umgang mit Eiern, Milch und Fleisch | <https://www.lgl.bayern.de/lebensmittel/hygiene/hygienischer_umgang/verbrauchertipps/et_eier_milch_fleisch.htm> | يوصي بإزالة سائل ذوبان اللحوم بعناية ومنع ملامسته أطعمة أخرى، ويذكر تجنب التلوث المتبادل؛ لا يحدد نوع اللحم أو طريقة حواره. |
| S56 | BfR: Fragen und Antworten zu Geflügelfleisch | <https://www.bfr.bund.de/fragen-und-antworten/thema/ausgewaehlte-fragen-und-antworten-zu-gefluegelfleisch/> | يقدم إرشادات خاصة بالدواجن عن الإذابة المبردة وسائل الذوبان والتلوث المتبادل؛ لا يجوز تعميمه على لحم غير محدد النوع أو نسبة الطريقة إلى الحوار. |
| S57 | Linguee: Backofen auf 180 Grad vorheizen | <https://www.linguee.com/german-english/translation/backofen+auf+180+grad+vorheizen.html> | يعرض تركيباً كاملاً شائعاً «Backofen auf 180 Grad vorheizen»؛ يدعم اقتراح وضوح لا يثبت خطأ الشذرة الحوارية. |
| S58 | PONS: Ei | <https://en.pons.com/translate/german-arabic/Ei> | يفرق بين Ei المفرد «بيضة» وEi الجمعي «بيض». |
| S59 | PONS: Milch | <https://en.pons.com/translate/german-arabic/Milch> | يدعم معنى الحليب؛ يظهر أيضاً مقابلاً إقليمياً مصنفاً Äg، فلا يفرض تنويعاً عربياً بعينه. |
| S60 | PONS: Fleisch | <https://en.pons.com/translate/german-arabic/Fleisch> | يدعم معنى اللحم/اللحوم من دون تعيين نوع الحيوان. |
| S61 | PONS: Gefrierfach | <https://en.pons.com/translate/german-arabic/Gefrierfach> | يدعم معنى حجرة/قسم التجميد؛ لا يحدد درجة حرارة جهاز بعينه. |
| S62 | PONS: Pfanne | <https://en.pons.com/translate/german-arabic/Pfanne> | يدعم معنى المقلاة. |
| S63 | PONS: Klumpen | <https://en.pons.com/translate/german-arabic/Klumpen> | يدعم معنى كتلة/تكتل؛ في خليط الطبخ: كتل. |
| S64 | PONS: Ende | <https://en.pons.com/translate/german-arabic/Ende> | يدعم معنى النهاية/الآخر في am Ende. |
| S65 | PONS: bisschen | <https://en.pons.com/translate/german-arabic/bisschen> | يعرض معنى قليل/قليلاً لـein bisschen. |
| S66 | PONS: Salz | <https://en.pons.com/translate/german-arabic/Salz> | يدعم معنى الملح؛ لا يحسم الإضمار الحواري في Salz haben wir schon. |
| S67 | PONS: Rest | <https://en.pons.com/translate/german-arabic/Rest> | يدعم معنى البقية/الباقي. |
| S68 | PONS: reichen | <https://en.pons.com/translate/german-arabic/reichen> | يعرض معنى genügen/يكفي، ومنه das reicht. |
| S69 | PONS: Grad | <https://en.pons.com/translate/german-arabic/Grad> | يعرض الدرجة في استعمال القياس/الحرارة. |
| S70 | PONS: Flur | <https://en.pons.com/translate/german-arabic/Flur> | يعرض معنى الردهة/الممر للـFlur المنزلي، مع معنى آخر هو الحقل خارج هذا السياق. |
| S71 | PONS: links | <https://en.pons.com/translate/german-arabic/links> | يعرض «إلى اليسار» لـnach links. |
| S72 | PONS: kostenlos | <https://en.pons.com/translate/german-arabic/kostenlos> | يعرض kostenfrei/مجاني؛ صفحة القاموس تحيل في التفصيل إلى مدخل kostenfrei. |
| S73 | PONS: freiwillig | <https://en.pons.com/translate/german-arabic/freiwillig> | يدعم معنى طوعي/اختياري. |
| S74 | PONS: üblich | <https://en.pons.com/translate/german-arabic/%C3%BCblich> | يعرض «معتاد/مألوف» مقابلاً لـüblich. |
| S75 | PONS: Euro | <https://en.pons.com/translate/german-arabic/Euro> | يدعم اسم العملة يورو؛ لا يثبت أن مبلغاً معيناً عرفٌ محلي. |
| S76 | PONS: dauern | <https://en.pons.com/translate/german-arabic/dauern> | يعرض دام/استغرق مقابلاً لـdauern. |
| S77 | PONS: Woche | <https://en.pons.com/translate/german-arabic/Woche> | يدعم أسبوع؛ أمثلة PONS تشمل nächste Woche. |
| S78 | PONS: Herbst | <https://en.pons.com/translate/german-arabic/Herbst> | يدعم معنى الخريف. |
| S79 | PONS: bezahlen | <https://en.pons.com/translate/german-arabic/bezahlen> | يدعم معنى دفع الثمن/السداد؛ لا يثبت أن الشركة الخيالية ستدفع فعلاً. |
| S80 | PONS: morgen | <https://en.pons.com/translate/german-arabic/morgen> | يدعم الظرف الزمني غداً، مع تمييزه عن اسم Morgen الصباح. |
| S81 | PONS: acht | <https://en.pons.com/translate/german-arabic/acht> | يدعم العدد acht = ثمانية؛ لا يحدد سياق الساعة خارج الجملة. |

## تدقيق الصوت والاختبارات

لم توجد إدخالات مطابقة في `content/dialog-audio.json` ولا أسماء ملفات R108 في `public/`. الغياب لا يعني أن ملفاً مطلوباً. لم يحدث تشغيل أو استماع أو اختبار TTS.

- **TypeScript:** passed — `./node_modules/.bin/tsc --noEmit`.
- **smoke:** 1140 ناجح / 0 فشل — `npm run smoke`.
- **interaktiv:** 699 ناجح / 0 فشل — `npm run interaktiv`. تحذيرات HTMLMediaElement.play/pause من jsdom؛ لا تُثبت تشغيل الصوت. لم يُشغّل أو يُستمع لصوت R108.
- **audit:content:** passed — `npm run audit:content`. الإشارات المطبوعة بشرية/تربوية أو heuristic وليست عيوباً مؤكدة.
- **build:** passed — `npm run build`.
- **npm audit:** passed — `npm audit --no-fund`.
- **idempotence:** already applied; no additional data changed — `python3 scripts/patches/review_a2_dialogues_06.py`.
- **git diff --check:** passed — `git diff --check`.

إخفاقات أثناء التنفيذ وحلولها:
- `./node_modules/.bin/tsc --noEmit and npm run smoke`: الاعتماديات المحلية غير موجودة أولاً (tsc/esbuild: not found). — الحل: npm ci ثبّت 95 حزمة؛ أُعيد TypeScript وsmoke بنجاح.
- `npm run smoke`: أول تشغيل لبوابات K182f وK182h رفض عبارتين مرساتين بسبب اختلاف حرفي مع صياغة التقرير، لا بسبب خلل في المحتوى. — الحل: طوبقت العبارات على حدود الدليل النهائي دون تخفيف التغطية؛ أُعيد smoke كاملاً: 1140/0.
- `./node_modules/.bin/tsc --noEmit (بالتوازي مع npm run build)`: تعارض مؤقت أثناء إعادة Next.js توليد .next/types؛ ظهر TS6053 لملفات الأنواع المولدة التي مسّها البناء المتزامن. — الحل: بعد اكتمال build أُعيد TypeScript منفرداً ونجح؛ لا خطأ مصدر مستمر.

## حدود الاستنتاج

- هذه مراجعة مساعد ذكاء اصطناعي بمصادر منشورة، وليست مراجعة بشرية أو اعتماداً لغوياً/مهنياً أو رأياً قانونياً/طبياً.
- لم يُعَد تقييم A2/CEFR أو حساب النسبة أو مستوى المتعلم؛ لا تغيير لهذه الحقول.
- مداخل القواميس تسند مفردات محددة ولا تثبت وحدها سلاسة كل جملة ألمانية أو عربية.
- مدة التهيئة وموعد التدريب والسداد خصائص حوار شركة خيالية؛ لا تعمم على أصحاب العمل.
- عرف الإكرامية غير محسوم لغياب المكان والمتلقي؛ مرجع Reisereporter محدود بسياقات وجهات معينة.
- لا يحدد سطر اللحم نوعه أو طريقة إذابته؛ مرجع BfR خاص بالدواجن ومرجع LGL احتياط عام. لم يُنسب خطر غير مذكور إلى الحوار.
- لم توجد إدخالات صوت/أسماء ملفات مطابقة؛ لا يستنتج من الغياب أن صوتاً مطلوب. لم يحدث تشغيل أو استماع أو اختبار TTS.
- المقارنة التاريخية محدودة بملف الإنشاء الأولي وما أمكن التحقق منه؛ لا تدعي بناء سجل تاريخ كامل.
