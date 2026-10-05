# مراجعة مصدرية فردية لحوارات A2 — الدفعة 04

**التاريخ:** 2026-10-05

**النطاق الحي:** `d-a2-07`–`d-a2-09` من `content/dialogues.json`.

**التغطية:** 33 وحدة (3 بيانات حوار، 17 سطراً، 6 أسئلة، 7 إملاءات)؛ 30 سليمة، 2 مصححتان، و1 غير محسوم.

**المراجع المنشورة:** 55 مدخلاً فريداً موثقاً؛ يحدد كل صف ما يسنده المصدر والحكم والإجراء.

## التصحيحات المؤكدة

| المعرّف | قبل | بعد | الحكم والمصدر |
|---|---|---|---|
| `d-a2-08-q2.explanationAr` | الدليل: «Ich gebe Ihnen Lutschtabletten und einen Tee». الفخّ 1: الماء نصيحة للشرب لا دواء. الفخّ 2: «schlucken» ذُكر كألم. الفخّ 3: الماء لا يُباع هنا. | الدليل: «Ich gebe Ihnen Lutschtabletten und einen Tee». الفخّ 1: «Trinken Sie viel Wasser!» نصيحة للشرب، لا ضمن ما قالت الصيدلانية إنها ستعطيه. الفخّ 2: «schlucken» ورد في وصف ألم البلع، لا كنوع الأقراص. الفخّ 3: لا يذكر الحوار شراء الماء. | الشرح السابق جزم بأن الماء لا يُباع هنا، وهي معلومة لا يذكرها الحوار؛ النص يقول إن الماء نصيحة للشرب، لا ضمن ما قالت الصيدلانية إنها ستعطيه. المصادر: [S22](#s22)، [S23](#s23)، [S24](#s24)، [S25](#s25)، [S26](#s26)، [S27](#s27)، [S28](#s28). |
| `d-a2-09.lines[1].ar` | الثانية عشرة والنصف، الرصيف الخامس. | الساعة الثانية والنصف بعد الظهر، على الرصيف الخامس. | `vierzehn Uhr dreißig` = 14:30، أي الثانية والنصف بعد الظهر؛ ليست 12:30. أُسند «رصيف المحطة» إلى Bahnsteig لا إلى ترجمة Gleis وحدها. المصادر: [S37](#s37)، [S38](#s38)، [S39](#s39)، [S40](#s40)، [S41](#s41)، [S42](#s42)، [S43](#s43). |

لم تتغير جملة ألمانية أو مفتاح إجابة في التصحيحين. سكربت الرقعة المحدودة والقابلة لإعادة التشغيل: `scripts/patches/review_a2_dialogues_04.py`.

## سجل كل عنصر

| المعرّف | النوع/الحكم | اللقطة الحية التي فُحصت | الدليل والحكم | الإجراء | المصادر |
|---|---|---|---|---|---|
| `d-a2-07` | بيانات الحوار/العنوان — سليم | DE: «Der Nachbar und das Paket»<br>AR: «الجار والطرد»<br>A2؛ 5 أسطر، سؤالان، 3 جمل إملاء | العنوان «Der Nachbar und das Paket» يطابق موضوع الجار والطرد؛ اللقطة الحية تحوي خمسة أسطر وسؤالين وثلاث جمل إملاء. لا يستنتج من وسم A2 وحده حكم تربوي جديد. | لا تغيير؛ حُفظ العنوان والبنية الحية كما هما، ولا يُعاد اعتماد مستوى CEFR. | [S01](#s01)، [S02](#s02) |
| `d-a2-07.lines[0]` | سطر حوار ألماني/عربي — سليم | Herr Yilmaz<br>DE: «Guten Morgen, Frau Klein! Ich habe Ihr Paket angenommen.»<br>AR: «صباح الخير يا سيدة كلاين! استلمت طردكم.» | Guten Morgen تقابل «صباح الخير». أخذ الجار الطرد وعبارة Ihr الرسمية ممثلة بضمير الاحترام «ـكم»؛ استلامه الطرد يطابق angenommen في هذا السياق. | لا تغيير؛ حُفظ الزوج الألماني/العربي كما هو بعد المراجعة. | [S02](#s02)، [S03](#s03)، [S08](#s08)، [S13](#s13) |
| `d-a2-07.lines[1]` | سطر حوار ألماني/عربي — سليم | Frau Klein<br>DE: «Oh, danke! Wann ist der Bote gekommen?»<br>AR: «أوه، شكراً! متى جاء الموزّع؟» | Bote هو الساعي/الرسول، وist … gekommen يسأل عن وقت وصوله؛ «الموزّع» تعبير سياقي مفهوم لعامل التوصيل، ولا يثبت المصدر خطأً فيه. | لا تغيير؛ حُفظ الزوج الألماني/العربي كما هو بعد المراجعة. | [S04](#s04)، [S05](#s05)، [S14](#s14) |
| `d-a2-07.lines[2]` | سطر حوار ألماني/عربي — سليم | Herr Yilmaz<br>DE: «Gegen neun Uhr. Ich hatte gerade frei.»<br>AR: «حوالي التاسعة. كنت في راحة.» | gegen neun تعني نحو التاسعة؛ وfrei قد تعني أنه لم يكن يعمل/كان متفرغاً. «كنت في راحة» مفهومة لكنها قد توحي باستراحة فعلية، و«كنت متفرغاً حينها» أصرح؛ هذه ملاحظة دقة/أسلوب لا تثبت خطأً يلزم تغييره. | لا تغيير تخمينياً؛ تُسجّل «كنت متفرغاً حينها» بديلاً أسلوبياً ممكناً لا تصحيحاً مؤكداً. | [S06](#s06)، [S07](#s07) |
| `d-a2-07.lines[3]` | سطر حوار ألماني/عربي — سليم | Frau Klein<br>DE: «Sie sind sehr freundlich. Möchten Sie einen Kaffee?»<br>AR: «أنتم لطفاء جداً. هل تريدون قهوة؟» | Sie للمخاطبة الرسمية في عرض القهوة؛ صيغة الجمع في «أنتم/تريدون» تمثيل عربي ممكن للتوقير، وfreundlich = لطيف/ودود. المعنى محفوظ. | لا تغيير؛ حُفظ الزوج الألماني/العربي كما هو بعد المراجعة. | [S08](#s08)، [S09](#s09)، [S10](#s10) |
| `d-a2-07.lines[4]` | سطر حوار ألماني/عربي — سليم | Herr Yilmaz<br>DE: «Gern, aber nur kurz. Danke!»<br>AR: «بكل سرور، لكن باختصار. شكراً!» | Gern تنقل «بكل سرور». في سياق قبول القهوة، nur kurz يرجح «لكن لفترة قصيرة»؛ «لكن باختصار» مفهومة ويمكن أن تعني بإيجاز، إلا أنها أقل تحديداً لمدة الزيارة. ملاحظة أسلوبية غير كافية لتصحيح إلزامي. | لا تغيير؛ تبقى «لكن لفترة قصيرة» صياغة أدق اختيارية، دون وسم النص الحالي خطأً مؤكداً. | [S11](#s11)، [S12](#s12)، [S14](#s14) |
| `d-a2-07-q1` | سؤال/مفتاح/شرح — سليم | DE: «Wer hat das Paket angenommen?»<br>AR: «اختر الإجابة الصحيحة حسب الحوار.»<br>الخيارات: Frau Klein / Herr Yilmaz / der Bote gegen neun Uhr<br>المفتاح: Herr Yilmaz<br>الشرح الحي: الدليل: «Ich habe Ihr Paket angenommen» — يقولها السيد يلماز. الفخّ 1: فراو كلاين صاحبة الطرد. الفخّ 2: الساعي سلّمه لا استلمه. | قال Herr Yilmaz صراحةً Ich habe Ihr Paket angenommen؛ هو الذي استلم الطرد. Frau Klein صاحبته، والساعي Bote هو من جاء به. المفتاح والشرح يطابقان تسلسل الحوار. | لا تغيير؛ المفتاح والشرح محفوظان بعد مطابقة السطر والخيارات. | [S02](#s02)، [S03](#s03)، [S04](#s04) |
| `d-a2-07-q2` | سؤال/مفتاح/شرح — سليم | DE: «Der Bote ist gegen ___ Uhr gekommen.»<br>AR: «أكمل الفراغ بالكلمة المناسبة من الحوار.»<br>الخيارات: —<br>المفتاح: neun / 9<br>الشرح الحي: التاسعة. | يقول الحوار Gegen neun Uhr؛ الكلمة الناقصة neun صحيحة، وقبول الرقم 9 تمثيل مكافئ للعدد في هذا الفراغ. | لا تغيير؛ المفتاح يقبل لفظ العدد ورقمه، وكلاهما يسنده السطر. | [S06](#s06)، [S55](#s55) |
| `d-a2-07.dictation[0]` | جملة إملاء — سليم | «Ich habe Ihr Paket angenommen.» | الجملة تملي الجزء Ich habe Ihr Paket angenommen من السطر الأول كاملاً، بما فيه الضمير الرسمي والفعل المنفصل صرفياً في Perfekt. | لا تغيير؛ طوبقت الجملة مع السطر الألماني الحي. | [S02](#s02)، [S03](#s03)، [S08](#s08) |
| `d-a2-07.dictation[1]` | جملة إملاء — سليم | «Wann ist der Bote gekommen?» | الجملة تطابق سؤال Wann ist der Bote gekommen? في السطر الثاني كلمةً وتركيباً. | لا تغيير؛ طوبقت الجملة مع السطر الألماني الحي. | [S04](#s04)، [S05](#s05) |
| `d-a2-07.dictation[2]` | جملة إملاء — سليم | «Sie sind sehr freundlich.» | الجملة تطابق Sie sind sehr freundlich من السطر الرابع، وتحفظ صيغة Sie الرسمية. | لا تغيير؛ طوبقت الجملة مع السطر الألماني الحي. | [S08](#s08)، [S09](#s09) |
| `d-a2-08` | بيانات الحوار/العنوان — سليم | DE: «In der Apotheke»<br>AR: «في الصيدلية»<br>A2؛ 6 أسطر، سؤالان، جملتا إملاء | العنوان In der Apotheke يطابق «في الصيدلية»؛ في اللقطة ستة أسطر وسؤالان وجملتا إملاء. لا يُستنتج من الوسم A2 وحده اعتماد ملاءمة المستوى. | لا تغيير؛ حُفظ العنوان والبنية الحية كما هما، ولا يُعاد اعتماد مستوى CEFR. | [S15](#s15)، [S16](#s16) |
| `d-a2-08.lines[0]` | سطر حوار ألماني/عربي — سليم | Apothekerin<br>DE: «Guten Tag! Was kann ich für Sie tun?»<br>AR: «نهاراً سعيداً! كيف أساعدك؟» | Guten Tag تحية، وPONS يعرض «نهارك سعيد/مرحباً» مقابلات لها. «نهاراً سعيداً» ينقل معنى good day لكنه اختيار صياغي أقل اصطلاحية؛ «مرحباً» أو «طاب نهارك» بديل ممكن لا يثبت خطأً. Was kann ich für Sie tun? تقابل سؤال المساعدة. | لا تغيير؛ الاختلاف في صيغة التحية أسلوبي ولا يستلزم استبدالاً إلزامياً. | [S08](#s08)، [S15](#s15) |
| `d-a2-08.lines[1]` | سطر حوار ألماني/عربي — سليم | Karim<br>DE: «Ich habe Halsschmerzen und brauche etwas dagegen.»<br>AR: «عندي ألم في الحلق وأحتاج شيئاً ضده.» | Halsschmerzen تعني ألم الحلق، وbrauche etwas dagegen تفيد الحاجة إلى شيء لذلك الألم. «أحتاج شيئاً ضده» مفهومة وقريبة؛ «شيئاً يخفف الألم» أكثر اصطلاحية بالعربية، لا دليل على خطأ معنى مؤكد. | لا تغيير؛ تُترك الصياغة الحالية مع تسجيل بديل عربي أسلس كملاحظة فقط. | [S17](#s17)، [S18](#s18) |
| `d-a2-08.lines[2]` | سطر حوار ألماني/عربي — سليم | Apothekerin<br>DE: «Seit wann haben Sie die Schmerzen?»<br>AR: «منذ متى تشعر بالألم؟» | Seit wann haben Sie die Schmerzen? يسأل منذ متى بدأ الألم؛ «منذ متى تشعر بالألم؟» تنقل السؤال، وSie للمخاطبة الرسمية ممثلة بضمير المفرد العربي المعتاد في هذا التركيب. | لا تغيير؛ المعنى والاستفهام الزمني محفوظان. | [S08](#s08)، [S19](#s19)، [S20](#s20) |
| `d-a2-08.lines[3]` | سطر حوار ألماني/عربي — سليم | Karim<br>DE: «Seit gestern Abend. Auch schlucken tut weh.»<br>AR: «منذ مساء أمس. وحتى البلع يؤلمني.» | Seit gestern Abend = منذ مساء أمس؛ وAuch schlucken tut weh يذكر أن البلع مؤلم أيضاً. الترجمة العربية تحفظ الزمن وإضافة ألم البلع. | لا تغيير؛ حُفظ الزوج الألماني/العربي كما هو بعد المراجعة. | [S19](#s19)، [S21](#s21)، [S22](#s22) |
| `d-a2-08.lines[4]` | سطر حوار ألماني/عربي — سليم | Apothekerin<br>DE: «Ich gebe Ihnen Lutschtabletten und einen Tee. Trinken Sie viel Wasser!»<br>AR: «سأعطيك أقراصاً للامتصاص وشاياً. اشرب ماءً كثيراً!» | Lutschtablette هي قرص يُمصّ بحسب Duden؛ يسند PONS جزأي Tablette وlutschen، ولا ندّعي أن PONS ترجم المركب مباشرة. الصيدلانية تسمي أقراص المص والشاي ثم تنصح بشرب الماء؛ العربية تنقل ذلك. لم يُقيّم النص كإرشاد طبي. | لا تغيير؛ الترجمة مفهومة. تدقيق صحة النص الطبي/العلاجي خارج هذا النطاق. | [S08](#s08)، [S22](#s22)، [S23](#s23)، [S24](#s24)، [S25](#s25)، [S26](#s26)، [S27](#s27)، [S28](#s28) |
| `d-a2-08.lines[5]` | سطر حوار ألماني/عربي — سليم | Karim<br>DE: «Danke schön. Was macht das zusammen?»<br>AR: «شكراً جزيلاً. كم المجموع؟» | Danke schön تقابل «شكراً جزيلاً». Elon.io يستعمل Was macht das zusammen? للسؤال عن الإجمالي؛ «كم المجموع؟» مقابل عربي سياقي سليم. | لا تغيير؛ حُفظ الزوج الألماني/العربي كما هو بعد المراجعة. | [S29](#s29)، [S30](#s30)، [S45](#s45) |
| `d-a2-08-q1` | سؤال/مفتاح/شرح — سليم | DE: «Was hat Karim?»<br>AR: «اختر الإجابة الصحيحة حسب الحوار.»<br>الخيارات: Kopfschmerzen seit gestern / Halsschmerzen seit drei Tagen / Halsschmerzen seit gestern Abend / Schmerzen beim Schlucken seit gestern Morgen<br>المفتاح: Halsschmerzen seit gestern Abend<br>الشرح الحي: الدليل: «Ich habe Halsschmerzen» و«Seit gestern Abend». الفخّ 1: الرأس لم يُذكر. الفخّ 2: «drei Tage» ليست في هذا الحوار. الفخّ 3: البلع مؤلم فعلاً لكن منذ «Abend» لا «Morgen». | قال Karim Halsschmerzen ثم حدّد Seit gestern Abend؛ يطابق المفتاح. لم يُذكر ألم الرأس أو ثلاثة أيام؛ وألم البلع موجود، لكن «gestern Morgen» لا يطابق مساء أمس. تغيّر مشتت تاريخي فقط لا يثبت خطأ السؤال. | لا تغيير؛ المفتاح والشرح محفوظان بعد فحص الحوار ومقارنة الخيارات. | [S17](#s17)، [S19](#s19)، [S20](#s20)، [S21](#s21) |
| `d-a2-08-q2` | سؤال/مفتاح/شرح — مُصحح | DE: «Was bekommt er?»<br>AR: «اختر الإجابة الصحيحة حسب الحوار.»<br>الخيارات: nur Wasser / Tabletten zum Schlucken / einen Tee und Wasser zum Kaufen / Lutschtabletten und einen Tee<br>المفتاح: Lutschtabletten und einen Tee<br>الشرح الحي: الدليل: «Ich gebe Ihnen Lutschtabletten und einen Tee». الفخّ 1: «Trinken Sie viel Wasser!» نصيحة للشرب، لا ضمن ما قالت الصيدلانية إنها ستعطيه. الفخّ 2: «schlucken» ورد في وصف ألم البلع، لا كنوع الأقراص. الفخّ 3: لا يذكر الحوار شراء الماء. | المفتاح يطابق Ich gebe Ihnen Lutschtabletten und einen Tee. الماء ورد في جملة نصيحة للشرب، لا ضمن ما قالت الصيدلانية إنها ستعطيه. وذكر ألم البلع لا يثبت أنها أعطت أقراصاً للبلع. الشرح السابق زعم أن الماء «لا يُباع هنا»، وهذه دعوى لا يثبتها الحوار؛ صُحح الشرح فقط. | عُدّل شرح الفخّ إلى دليل الحوار: الماء نصيحة للشرب وليس ضمن قائمة ما ستعطيه الصيدلانية؛ لم تتغير الخيارات أو المفتاح أو الألمانية. | [S22](#s22)، [S23](#s23)، [S24](#s24)، [S25](#s25)، [S26](#s26)، [S27](#s27)، [S28](#s28) |
| `d-a2-08.dictation[0]` | جملة إملاء — سليم | «Seit wann haben Sie die Schmerzen?» | الإملاء يطابق سؤال الصيدلانية Seit wann haben Sie die Schmerzen? كاملاً. | لا تغيير؛ طوبقت الجملة مع السطر الألماني الحي. | [S08](#s08)، [S19](#s19)، [S20](#s20) |
| `d-a2-08.dictation[1]` | جملة إملاء — سليم | «Trinken Sie viel Wasser!» | الإملاء يطابق Trinken Sie viel Wasser!، ويحفظ النصيحة بصيغة المخاطبة Sie. | لا تغيير؛ طوبقت الجملة مع السطر الألماني الحي. | [S08](#s08)، [S27](#s27)، [S28](#s28) |
| `d-a2-09` | بيانات الحوار/العنوان — سليم | DE: «Am Bahnhof»<br>AR: «في محطة القطار»<br>A2؛ 6 أسطر، سؤالان، جملتا إملاء | العنوان Am Bahnhof يطابق «في محطة القطار»؛ في اللقطة ستة أسطر وسؤالان وجملتا إملاء. لا يُعاد تقييم وسم A2 من هذا العنوان. | لا تغيير؛ حُفظ العنوان والبنية الحية كما هما، ولا يُستنتج حكم CEFR جديد. | [S31](#s31)، [S32](#s32) |
| `d-a2-09.lines[0]` | سطر حوار ألماني/عربي — سليم | Jonas<br>DE: «Entschuldigung, wann fährt der nächste Zug nach Köln?»<br>AR: «عفواً، متى ينطلق القطار التالي إلى كولونيا؟» | Entschuldigung تؤدي وظيفة «عفواً» في الاستفتاح؛ wann fährt der nächste Zug nach Köln? تسأل عن موعد القطار التالي إلى كولونيا. الترجمة تحفظ المقصد والوجهة. | لا تغيير؛ حُفظ الزوج الألماني/العربي كما هو بعد المراجعة. | [S08](#s08)، [S32](#s32)، [S33](#s33)، [S34](#s34)، [S35](#s35)، [S36](#s36) |
| `d-a2-09.lines[1]` | سطر حوار ألماني/عربي — مُصحح | Mitarbeiterin<br>DE: «Um vierzehn Uhr dreißig, Gleis fünf.»<br>AR: «الساعة الثانية والنصف بعد الظهر، على الرصيف الخامس.» | vierzehn Uhr dreißig هو 14:30 في صيغة 24 ساعة؛ DW يربطه بـhalb drei في نظام 12 ساعة، أي الثانية والنصف بعد الظهر، لا الثانية عشرة والنصف (12:30). Gleis خمسة رقم المسار؛ وللمقابل العربي «رصيف المحطة» استُخدم مدخل Bahnsteig لا Gleis وحده. | صُححت العربية إلى «الساعة الثانية والنصف بعد الظهر، على الرصيف الخامس.»؛ لم تتغير الألمانية أو بيانات المسار. | [S37](#s37)، [S38](#s38)، [S39](#s39)، [S40](#s40)، [S41](#s41)، [S42](#s42)، [S43](#s43) |
| `d-a2-09.lines[2]` | سطر حوار ألماني/عربي — سليم | Jonas<br>DE: «Gibt es eine Rückfahrkarte?»<br>AR: «هل توجد بطاقة ذهاب وإياب؟» | Rückfahrkarte تعني تذكرة ذهاب وإياب؛ «هل توجد بطاقة ذهاب وإياب؟» تنقل السؤال مباشرة. | لا تغيير؛ حُفظ الزوج الألماني/العربي كما هو بعد المراجعة. | [S44](#s44) |
| `d-a2-09.lines[3]` | سطر حوار ألماني/عربي — سليم | Mitarbeiterin<br>DE: «Ja, die kostet neunundzwanzig Euro.»<br>AR: «نعم، ثمنها تسعة وعشرون يورو.» | kosten تعني يكلّف، neunundzwanzig تكتب 29 بحسب Duden، وEuro = يورو؛ «ثمنها تسعة وعشرون يورو» دقيقة. | لا تغيير؛ حُفظ الزوج الألماني/العربي كما هو بعد المراجعة. | [S45](#s45)، [S46](#s46)، [S47](#s47) |
| `d-a2-09.lines[4]` | سطر حوار ألماني/عربي — سليم | Jonas<br>DE: «Eine Fahrkarte zweiter Klasse, bitte.»<br>AR: «تذكرة درجة ثانية من فضلك.» | Fahrkarte تذكرة سفر وzweiter Klasse الدرجة الثانية؛ المفتاح اللغوي محفوظ. «تذكرة من الدرجة الثانية» بديل عربي أتمّ أسلوباً من «تذكرة درجة ثانية»، لكن الحالية مفهومة ولا يثبت خطأها. | لا تغيير؛ ملاحظة الصياغة العربية اختيارية وليست تصحيحاً مؤكداً. | [S48](#s48)، [S49](#s49)، [S51](#s51) |
| `d-a2-09.lines[5]` | سطر حوار ألماني/عربي — سليم | Mitarbeiterin<br>DE: «Hier, bitte. Gute Reise!»<br>AR: «تفضل. رحلة سعيدة!» | Hier, bitte في مقام تسليم التذكرة يقابل «تفضل»، وGute Reise تحية برحلة سعيدة؛ السياق والترجمة متوافقان. | لا تغيير؛ حُفظ الزوج الألماني/العربي كما هو بعد المراجعة. | [S50](#s50)، [S51](#s51)، [S52](#s52) |
| `d-a2-09-q1` | سؤال/مفتاح/شرح — سليم | DE: «Wann fährt der Zug?»<br>AR: «اختر الإجابة الصحيحة حسب الحوار.»<br>الخيارات: um vierzehn Uhr dreißig / um fünfzehn Uhr dreißig / um vierzehn Uhr von Gleis drei / um dreizehn Uhr dreißig<br>المفتاح: um vierzehn Uhr dreißig<br>الشرح الحي: الدليل: «Um vierzehn Uhr dreißig, Gleis fünf». الفخّ 1: vierzehn/fünfzehn. الفخّ 2: الرصيف خمسة لا ثلاثة، و«dreißig» دقائق. الفخّ 3: dreizehn/dreißig. | السطر يحدد Um vierzehn Uhr dreißig؛ نظام 24 ساعة ومقابل 12 ساعة يثبتان 14:30. الخيارتان 13:30 و15:30 تخالفان الزمن المنطوق؛ والخيار الثالث يخلط وقتاً صحيحاً برقم Gleis غير صحيح. المفتاح والشرح متسقان. | لا تغيير؛ المفتاح والشرح محفوظان بعد مطابقة الوقت والمسار في الحوار. | [S37](#s37)، [S38](#s38)، [S39](#s39)، [S40](#s40)، [S41](#s41)، [S53](#s53)، [S54](#s54) |
| `d-a2-09-q2` | سؤال/مفتاح/شرح — غير محسوم | DE: «Was kauft Jonas?»<br>AR: «اختر الإجابة الصحيحة حسب الحوار.»<br>الخيارات: eine Rückfahrkarte für neunundzwanzig Euro / eine Fahrkarte zweiter Klasse / eine Fahrkarte erster Klasse / fünf Fahrkarten<br>المفتاح: eine Fahrkarte zweiter Klasse<br>الشرح الحي: الدليل: «Eine Fahrkarte zweiter Klasse, bitte». الفخّ 1: عن تذكرة العودة سأل فقط ولم يطلبها. الفخّ 2: erster/zweiter. الفخّ 3: «fünf» رقم الرصيف. | Jonas يسأل أولاً عن Rückfahrkarte، ويُقال له إن ثمنها 29 يورو، ثم يطلب Fahrkarte zweiter Klasse. قد يُفهم الطلب الأخير على أنه قبول للتذكرة المعروضة، ولا ينفي الحوار شراء تذكرة ذهاب وإياب. لذلك لا يثبت السياق أن مشتت «eine Rückfahrkarte für neunundzwanzig Euro» خطأ، ولا يحسم أن المفتاح منفرد. السجل التاريخي للمشتت لا يحسم المعنى. | لا تعديل تخمينياً للمفتاح أو الشرح. إن تقرر تحريرياً حسم السؤال لاحقاً، فليُسأل تحديداً «في أي درجة يريد السفر؟» أو يُصرّح بالحوار برفض/طلب تذكرة العودة. | [S44](#s44)، [S45](#s45)، [S47](#s47)، [S48](#s48)، [S49](#s49) |
| `d-a2-09.dictation[0]` | جملة إملاء — سليم | «Wann fährt der nächste Zug nach Köln?» | الإملاء يطابق سؤال Wann fährt der nächste Zug nach Köln? من السطر الأول كاملاً. | لا تغيير؛ طوبقت الجملة مع السطر الألماني الحي. | [S32](#s32)، [S33](#s33)، [S34](#s34)، [S35](#s35)، [S36](#s36) |
| `d-a2-09.dictation[1]` | جملة إملاء — سليم | «Gute Reise!» | الإملاء يطابق Gute Reise! من السطر الأخير حرفياً. | لا تغيير؛ طوبقت الجملة مع السطر الألماني الحي. | [S51](#s51)، [S52](#s52) |

## الملاحظة غير المحسومة

`d-a2-09-q2` بقي كما هو: بعد سؤال Jonas عن تذكرة العودة والسعر، طلب تذكرة درجة ثانية. لا يستبعد الحوار بوضوح أن يكون هذا قبولاً لتذكرة العودة، لذلك لا يُعتمد ادعاء الشرح الحالي بأن العودة «لم تُطلب» ولا يُحسم تداخل المشتت دون تحرير. لا تعديل تخمينياً؛ يمكن تضييق السؤال إلى الدرجة أو توضيح رفض العودة في النص.

## المقارنة التاريخية المحدودة

يقتصر `scripts/patches/a_dialog_fallen.py` على سجلات الأسئلة أدناه؛ لا يغطي العناوين أو السطور أو الإملاء، ولا يُستعمل مرجعاً لغوياً. تغير ترتيب الخيارات لا يثبت خللاً:

| المعرّف | المقارنة المسجلة | الملاحظة |
|---|---|---|
| `d-a2-07-q1` | تاريخي: Frau Klein / Herr Yilmaz / der Bote gegen neun Uhr<br>حي: Frau Klein / Herr Yilmaz / der Bote gegen neun Uhr<br>المفتاح التاريخي/الحي: Herr Yilmaz / Herr Yilmaz | لم تتغير مجموعة الخيارات أو ترتيبها أو المفتاح في السجل التاريخي المحدود. |
| `d-a2-08-q1` | تاريخي: Halsschmerzen seit gestern Abend / Kopfschmerzen seit gestern / Halsschmerzen seit drei Tagen / Fieber und Husten<br>حي: Kopfschmerzen seit gestern / Halsschmerzen seit drei Tagen / Halsschmerzen seit gestern Abend / Schmerzen beim Schlucken seit gestern Morgen<br>المفتاح التاريخي/الحي: Halsschmerzen seit gestern Abend / Halsschmerzen seit gestern Abend | المفتاح محفوظ؛ تغيّر مشتت Fieber und Husten إلى Schmerzen beim Schlucken seit gestern Morgen، مع تغير ترتيب الخيارات. الفارق لا يثبت وحده خللاً. |
| `d-a2-08-q2` | تاريخي: Lutschtabletten und einen Tee / nur Wasser / Tabletten zum Schlucken / einen Tee und Wasser zum Kaufen<br>حي: nur Wasser / Tabletten zum Schlucken / einen Tee und Wasser zum Kaufen / Lutschtabletten und einen Tee<br>المفتاح التاريخي/الحي: Lutschtabletten und einen Tee / Lutschtabletten und einen Tee | مجموعة الخيارات والمفتاح محفوظان مع اختلاف الترتيب؛ شرح السجل التاريخي ليس مرجعاً للحكم الحالي، وصُحح شرح الماء في اللقطة الحية. |
| `d-a2-09-q1` | تاريخي: um vierzehn Uhr dreißig / um fünfzehn Uhr dreißig / um vierzehn Uhr von Gleis drei / um dreizehn Uhr dreißig<br>حي: um vierzehn Uhr dreißig / um fünfzehn Uhr dreißig / um vierzehn Uhr von Gleis drei / um dreizehn Uhr dreißig<br>المفتاح التاريخي/الحي: um vierzehn Uhr dreißig / um vierzehn Uhr dreißig | الخيارات والمفتاح كما في السجل؛ التحقق من الوقت استند إلى مصادر الوقت والحوار لا إلى الأرشيف. |
| `d-a2-09-q2` | تاريخي: eine Fahrkarte zweiter Klasse / eine Rückfahrkarte für neunundzwanzig Euro / eine Fahrkarte erster Klasse / fünf Fahrkarten<br>حي: eine Rückfahrkarte für neunundzwanzig Euro / eine Fahrkarte zweiter Klasse / eine Fahrkarte erster Klasse / fünf Fahrkarten<br>المفتاح التاريخي/الحي: eine Fahrkarte zweiter Klasse / eine Fahrkarte zweiter Klasse | تحرك ترتيب المفتاح والمشتت الأول؛ السجل التاريخي لا يحسم التداخل الدلالي المحتمل بين التذكرة المعروضة والدرجة المطلوبة. |

## فحص الصوت وحدوده

| الحوار | الملف | الحجم في البيان | الحجم الفعلي | الفحص |
|---|---|---:|---:|---|
| `d-a2-07` | `/audio/dialog/d-a2-07.mp3` | 116,907 بايت | 116,907 بايت | موجود ومطابق للحجم؛ لم يُشغّل أو يُستمع إليه أو يُفحص ترميزه/نطقه. |
| `d-a2-08` | `/audio/dialog/d-a2-08.mp3` | 143,883 بايت | 143,883 بايت | موجود ومطابق للحجم؛ لم يُشغّل أو يُستمع إليه أو يُفحص ترميزه/نطقه. |
| `d-a2-09` | `/audio/dialog/d-a2-09.mp3` | 126,956 بايت | 126,956 بايت | موجود ومطابق للحجم؛ لم يُشغّل أو يُستمع إليه أو يُفحص ترميزه/نطقه. |

## حدود المراجعة

- هذه مراجعة مساعد ذكاء اصطناعي مدعومة بمصادر منشورة؛ ليست مراجعة بشرية أو اعتماداً لغوياً/مهنياً.
- فحص الصوت اقتصر على وجود الملفات ومطابقة الحجم بالبايت مع البيان؛ لم يحدث تشغيل أو استماع أو تحقق من فك الترميز أو النطق أو مطابقة الصوت للنص.
- ملف scripts/patches/a_dialog_fallen.py سجل محدود لخيارات ومفاتيح خمسة أسئلة؛ لا يوفّر تاريخاً للعناوين أو الأسطر أو الإملاء، ولا يثبت صحة المحتوى أو خطأه.
- لم تُعَد مراجعة مستوى A2 أو CEFR أو النسبة أو حساب المستوى الممكن؛ لا يثبت وسم المحتوى وحده الملاءمة التربوية.
- حوار الصيدلية خيالي؛ لم يُقيّم كنصيحة صحية أو علاجية.
- المراجع المعجمية تسند معاني محددة؛ لا تثبت وحدها طبيعية كل صياغة عربية أو أثراً تعليمياً.

## المصادر المنشورة

كل صفحة تسند النقطة المبيّنة بجانبها فقط؛ قد يتطلب السياق حكماً منفصلاً عن المعنى المعجمي.

### S01
**PONS: Nachbar**
- الرابط: https://en.pons.com/translate/german-arabic/Nachbar
- ما يسنده: يورد Nachbar بمعنى الجار؛ يسند طرف العنوان وسياق الجوار.

### S02
**PONS: Paket**
- الرابط: https://en.pons.com/translate/german-arabic/Paket
- ما يسنده: يورد Paket بمعنى طرد/حزمة، وهو المقصود في الحوار.

### S03
**PONS: annehmen**
- الرابط: https://en.pons.com/translate/german-arabic/annehmen
- ما يسنده: يسجل annehmen بمعنى قبول/استلام الشيء، ويعرض تصريف Partizip II angenommen.

### S04
**PONS: Bote**
- الرابط: https://en.pons.com/translate/german-arabic/Bote
- ما يسنده: يورد Bote بمعنى الرسول/الساعي، ويدعم وصف عامل توصيل الطرد في السياق.

### S05
**PONS: kommen**
- الرابط: https://en.pons.com/translate/german-arabic/kommen
- ما يسنده: يورد kommen بمعنى جاء/أتى؛ وفي Perfekt مع sein: ist gekommen.

### S06
**PONS: gegen**
- الرابط: https://en.pons.com/translate/german-arabic/gegen
- ما يسنده: يعرض gegen في استعمال الوقت التقريبي؛ gegen neun = نحو التاسعة.

### S07
**PONS: frei**
- الرابط: https://en.pons.com/translate/german-arabic/frei
- ما يسنده: من معاني frei التفرغ/عدم العمل؛ يورد مثال haben wir frei بمعنى يوم عطلة.

### S08
**PONS: Sie**
- الرابط: https://en.pons.com/translate/german-arabic/sie?q=Sie
- ما يسنده: يفصل ضمير المخاطبة الرسمي Sie عن المفرد المؤنث والجمع، ويورد Entschuldigen Sie! مقابلاً سياقياً لـ«عفواً».

### S09
**PONS: freundlich**
- الرابط: https://en.pons.com/translate/german-arabic/freundlich
- ما يسنده: يورد freundlich بمعنى لطيف/ودود، وهو وصف الامتنان لجار أخذ الطرد.

### S10
**PONS: Kaffee**
- الرابط: https://en.pons.com/translate/german-arabic/Kaffee
- ما يسنده: يورد Kaffee بمعنى قهوة.

### S11
**PONS: gern**
- الرابط: https://en.pons.com/translate/german-arabic/gern
- ما يسنده: يورد gern في معنى القبول بسرور/بكل سرور.

### S12
**PONS: kurz**
- الرابط: https://en.pons.com/translate/german-arabic/kurz
- ما يسنده: يسند معنى kurz إلى القِصر/الإيجاز؛ لا يحسم وحده إن كان القصر زمنياً أو في الكلام، لذا سُجلت ملاحظة السياق أسلوبية.

### S13
**PONS: Guten Morgen**
- الرابط: https://en.pons.com/translate/german-arabic/guten+Morgen?q=Guten+Morgen
- ما يسنده: يعرض Guten Morgen مقابل «صباح الخير» مباشرةً.

### S14
**PONS: danke**
- الرابط: https://en.pons.com/translate/german-arabic/danke
- ما يسنده: يورد danke بمعنى «شكراً».

### S15
**PONS: Guten Tag**
- الرابط: https://en.pons.com/translate/german-arabic/guten+Tag?q=Guten_Tag
- ما يسنده: يعرض نهارك سعيد، سلامات، ومرحباً مقابلاتٍ للتحية؛ يفيد في تقويم المعنى لا في فرض صيغة عربية وحيدة.

### S16
**PONS: Apotheke**
- الرابط: https://en.pons.com/translate/german-arabic/Apotheke
- ما يسنده: يورد Apotheke بمعنى صيدلية.

### S17
**PONS: Halsschmerzen**
- الرابط: https://en.pons.com/translate/german-arabic/Halsschmerzen
- ما يسنده: يورد Halsschmerzen بمعنى ألم/آلام الحلق.

### S18
**PONS: dagegen**
- الرابط: https://en.pons.com/translate/german-arabic/dagegen
- ما يسنده: يسند استعمال etwas dagegen إلى شيء يُستعمل/يؤخذ ضد المشكلة أو لتخفيفها.

### S19
**PONS: seit**
- الرابط: https://en.pons.com/translate/german-arabic/seit
- ما يسنده: يعرض seit للمدة التي بدأت في الماضي، ويورد سؤالاً من نمط seit wann?؛ يسند منذ متى/منذ.

### S20
**PONS: Schmerz**
- الرابط: https://en.pons.com/translate/german-arabic/Schmerz
- ما يسنده: يورد Schmerz بمعنى ألم.

### S21
**PONS: Abend**
- الرابط: https://en.pons.com/translate/german-arabic/Abend
- ما يسنده: يورد Abend بمعنى المساء ويعرض gestern Abend بمعنى مساء أمس.

### S22
**PONS: schlucken**
- الرابط: https://en.pons.com/translate/german-arabic/schlucken
- ما يسنده: يورد schlucken بمعنى يبلع؛ في النص يرد وصفاً لألم البلع.

### S23
**Duden: Lutschtablette**
- الرابط: https://www.duden.de/rechtschreibung/Lutschtablette
- ما يسنده: يعرّف Lutschtablette بأنها قرص يُمصّ؛ لم يقدّم PONS في الفحص مدخلاً عربياً مستقلاً للكلمة المركبة.

### S24
**PONS: Tablette**
- الرابط: https://en.pons.com/translate/german-arabic/Tablette
- ما يسنده: يورد Tablette بمعنى قرص/حبّة؛ يدعم مكوّن الاسم المركب لا ترجمته الكاملة وحده.

### S25
**PONS: lutschen**
- الرابط: https://en.pons.com/translate/german-arabic/lutschen
- ما يسنده: يورد lutschen بمعنى يمصّ؛ مع تعريف Duden يسند «أقراصاً للامتصاص».

### S26
**PONS: Tee**
- الرابط: https://en.pons.com/translate/german-arabic/Tee
- ما يسنده: يورد Tee بمعنى شاي.

### S27
**PONS: trinken**
- الرابط: https://en.pons.com/translate/german-arabic/trinken
- ما يسنده: يورد trinken بمعنى يشرب؛ يسند كون جملة الماء نصيحةً للشرب.

### S28
**PONS: Wasser**
- الرابط: https://en.pons.com/translate/german-arabic/Wasser
- ما يسنده: يورد Wasser بمعنى ماء.

### S29
**PONS: dankeschön**
- الرابط: https://en.pons.com/translate/german-arabic/dankesch%C3%B6n
- ما يسنده: يعرض dankeschön مقابل «شكراً جزيلاً».

### S30
**Elon.io: Dialogue—Shopping and Prices**
- الرابط: https://elon.io/grammar/german/texts/dialogue-shopping
- ما يسنده: يستعمل Was macht das zusammen? للسؤال عن مجموع السعر؛ يسند «كم المجموع؟» في سياق الصيدلية، لا بقية الحوار.

### S31
**PONS: Bahnhof**
- الرابط: https://en.pons.com/translate/german-arabic/Bahnhof
- ما يسنده: يورد Bahnhof بمعنى محطة؛ يسند عنوان الحوار Am Bahnhof.

### S32
**PONS: Zug**
- الرابط: https://en.pons.com/translate/german-arabic/Zug
- ما يسنده: يميز Zug بمعنى قطار السكك الحديدية.

### S33
**PONS: fahren**
- الرابط: https://en.pons.com/translate/german-arabic/fahren
- ما يسنده: يسند fahren إلى السفر/السير أو انطلاق وسيلة النقل بحسب السياق.

### S34
**PONS: nach**
- الرابط: https://en.pons.com/translate/german-arabic/nach
- ما يسنده: يعرض nach مع الاتجاه بمعنى إلى؛ يدعم nach Köln.

### S35
**PONS: nächste**
- الرابط: https://en.pons.com/translate/german-arabic/n%C3%A4chste
- ما يسنده: يعرض nächste في الاستعمال الزمني بمعنى القادم/التالي.

### S36
**PONS: Köln**
- الرابط: https://en.pons.com/translate/german-arabic/K%C3%B6ln
- ما يسنده: يورد المقابل العربي لكولن: كولونيا.

### S37
**DW Learn German: Time—12-hour clock**
- الرابط: https://learngerman.dw.com/en/time-12-hour-clock-1/l-37442425/gr-38303328
- ما يسنده: يوضح التعبير بالنظام ذي 12 ساعة، ومنه 14:30 = halb drei؛ يسند الساعة الثانية والنصف بعد الظهر.

### S38
**DW Learn German: Expressing times of the day**
- الرابط: https://learngerman.dw.com/en/expressing-times-of-the-day/l-58581138/gr-60991104
- ما يسنده: يعرض التعبير عن الوقت اليومي بالنظام الرقمي ذي 24 ساعة؛ يثبت أن vierzehn Uhr dreißig هي 14:30.

### S39
**PONS: vierzehn**
- الرابط: https://en.pons.com/translate/german-arabic/vierzehn
- ما يسنده: يورد vierzehn = أربعة عشر (14).

### S40
**PONS: dreißig**
- الرابط: https://en.pons.com/translate/german-arabic/drei%C3%9Fig
- ما يسنده: يورد dreißig = ثلاثون (30).

### S41
**PONS: fünf**
- الرابط: https://en.pons.com/translate/german-arabic/f%C3%BCnf
- ما يسنده: يورد fünf = خمسة؛ يدعم رقم Gleis fünf، مع الاستناد إلى Bahnsteig لا إلى هذا المدخل وحده لترجمة «رصيف».

### S42
**PONS: Gleis**
- الرابط: https://en.pons.com/translate/german-arabic/Gleis
- ما يسنده: يورد Gleis بمعنى خط/قضبان؛ لا يُستخدم وحده لإثبات مقابل «رصيف المحطة».

### S43
**PONS: Bahnsteig**
- الرابط: https://en.pons.com/translate/german-arabic/Bahnsteig
- ما يسنده: يورد Bahnsteig بمعنى رصيف المحطة؛ يسند المقابل العربي في تعليمات الوصول إلى المسار.

### S44
**PONS: Rückfahrkarte**
- الرابط: https://en.pons.com/translate/german-arabic/R%C3%BCckfahrkarte
- ما يسنده: يترجم Rückfahrkarte صراحةً إلى تذكرة ذهاب وإياب؛ مهم لملاحظة تداخل خيارات السؤال الأخير.

### S45
**PONS: kosten**
- الرابط: https://en.pons.com/translate/german-arabic/kosten?q=Kosten
- ما يسنده: يعرض kosten بمعنى يكلّف ومثال wieviel kostet das? = كم يكلّف هذا؟

### S46
**PONS: Euro**
- الرابط: https://en.pons.com/translate/german-arabic/Euro
- ما يسنده: يورد Euro بمعنى يورو.

### S47
**Duden: neunundzwanzig**
- الرابط: https://www.duden.de/rechtschreibung/neunundzwanzig
- ما يسنده: يحدد كتابة neunundzwanzig بالحروف الرقمية 29.

### S48
**PONS: Fahrkarte**
- الرابط: https://en.pons.com/translate/german-arabic/Fahrkarte
- ما يسنده: يترجم Fahrkarte إلى تذكرة سفر/ركوب، ويورد einfache Fahrkarte = تذكرة ذهاب.

### S49
**PONS: Klasse**
- الرابط: https://en.pons.com/translate/german-arabic/Klasse
- ما يسنده: يورد Klasse في معنى Stufe مقابل درجة؛ يدعم zweiter Klasse = الدرجة الثانية.

### S50
**PONS: hier**
- الرابط: https://en.pons.com/translate/german-arabic/hier
- ما يسنده: يورد hier بمعنى هنا، وتُقرأ هنا في سياق مناولة التذكرة.

### S51
**PONS: bitte**
- الرابط: https://en.pons.com/translate/german-arabic/bitte
- ما يسنده: يفصل bitte بين «من فضلك» والاستعمال عند المناولة/العرض مثل «تفضل».

### S52
**PONS: Reise**
- الرابط: https://en.pons.com/translate/german-arabic/Reise
- ما يسنده: يورد Reise بمعنى رحلة/سفر؛ Gute Reise تحية برحلة سعيدة.

### S53
**PONS: fünfzehn**
- الرابط: https://en.pons.com/translate/german-arabic/f%C3%BCnfzehn
- ما يسنده: يورد fünfzehn = خمسة عشر (15)، كما في مشتت وقت السؤال.

### S54
**PONS: dreizehn**
- الرابط: https://en.pons.com/translate/german-arabic/dreizehn
- ما يسنده: يورد dreizehn = ثلاثة عشر (13)، كما في مشتت وقت السؤال.

### S55
**PONS: neun**
- الرابط: https://en.pons.com/translate/german-arabic/neun
- ما يسنده: يورد neun = تسعة؛ يسند جواب الفراغ und gegen neun Uhr.
