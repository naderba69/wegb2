# مراجعة مصدرية فردية لحوارات A2 — الدفعة 03

**التاريخ:** 2026-10-05<br>
**النطاق:** `d-a2-04`–`d-a2-06` من `content/dialogues.json` الحي.<br>
**التغطية:** 34 وحدة (3 بيانات حوار، 16 سطراً، 6 أسئلة، 9 إملاءات)؛ 31 سليمة، 2 مصححة، 1 غير محسوم.<br>
**المصادر المنشورة:** 51 مدخلاً موثقاً. كل سجل أدناه يربط المعرّف بالدليل والحكم والإجراء.

## التغييرات المؤكدة

| المعرّف | قبل | بعد | الحكم والمصدر |
|---|---|---|---|
| `d-a2-05.lines[3].ar` | أوه! لا مشكلة. هل كنت مريضاً؟ | أوه! لا مشكلة. هل كنتِ مريضة؟ | Sara مؤنث كما يبين `Sie hat…` في q1؛ الترجمة السابقة استخدمت المخاطب المذكر. المصادر: [S24](#s24)، [S25](#s25)، [S26](#s26). |
| `d-a2-06.lines[0].ar` | طاب يومكم. اشتريت هذه السترة أمس لكنها صغيرة. | طاب يومكم. اشتريت هذه الكنزة أمس، لكنها أصغر من اللازم. | `Pullover` = بلوفر/كنزة؛ `zu` يضيف تجاوز الحد في `zu klein`. المصادر: [S35](#s35)، [S36](#s36)، [S41](#s41)، [S42](#s42). |

لم تتغير أي جملة ألمانية أو مفتاح إجابة. استُخدم سكربت دفعة محمي قابل لإعادة التشغيل: `scripts/patches/review_a2_dialogues_03.py`.

## سجل كل عنصر

| المعرّف | النوع/الحالة | المادة الحية التي روجعت | الدليل والحكم | الإجراء | المصادر |
|---|---|---|---|---|---|
| `d-a2-04` | بيانات — سليم | DE: Im Zug؛ AR: في القطار؛ A2؛ 5 أسطر، سؤالان، 3 إملاءات | عنوان Im Zug وترجمته وسياقه يعكسان حوار السفر بالقطار؛ عدد الأسطر والأسئلة والإملاء سليم في اللقطة الحية. | لا تغيير؛ البيانات الحية مثبتة في اللقطة، ولا يُستنتج منها حكم جديد على CEFR. | [S04](#s04) |
| `d-a2-04.lines[0]` | سطر — سليم | Reisende: DE «Entschuldigung, ist dieser Platz frei?»<br>AR «عفواً، هل هذا المقعد شاغر؟» | Platz بمعنى مقعد وfrei بمعنى غير مشغول/متاح؛ «المقعد شاغر» ينقل معنى السؤال دون نقص. | لا تغيير؛ حُفظ الزوج الألماني/العربي كما هو بعد المراجعة. | [S01](#s01)، [S02](#s02) |
| `d-a2-04.lines[1]` | سطر — سليم | Mann: DE «Ja, bitte. Fährt dieser Zug nach Köln?»<br>AR «نعم، تفضّل. هل هذا القطار يذهب إلى كولونيا؟» | Zug هو القطار؛ nach Köln اتجاهٌ إلى كولونيا. وJa, bitte في جواب إتاحة المقعد هنا إذنٌ/عرضٌ: «نعم، تفضّل»، لا ترجمة آلية لـbitte بمعزل عن المقام. | لا تغيير؛ حُفظ الزوج الألماني/العربي كما هو بعد المراجعة. | [S03](#s03)، [S04](#s04)، [S50](#s50) |
| `d-a2-04.lines[2]` | سطر — سليم | Reisende: DE «Ja, aber in Frankfurt müssen Sie umsteigen.»<br>AR «نعم، لكن في فرانكفورت عليكم تبديل القطار.» | umsteigen هو تغيير وسيلة النقل، وDuden يورد تغيير القطار في محطة وسيطة؛ «في فرانكفورت عليكم تبديل القطار» يحفظ المعلومة. صيغة الجمع العربية قد تُقرأ للتوقير ولا تثبت خطأً في مخاطبة Sie. | لا تغيير؛ حُفظ الزوج الألماني/العربي كما هو بعد المراجعة. | [S05](#s05)، [S06](#s06)، [S21](#s21) |
| `d-a2-04.lines[3]` | سطر — سليم | Mann: DE «Schade! Wie lange dauert die Fahrt?»<br>AR «للأسف! كم يستغرق السفر؟» | Fahrt رحلة، وdauern استغرق؛ «للأسف» ترجمة سياقية مقبولة لـSchade ولا يوجد ما يثبت خطأها. | لا تغيير؛ حُفظ الزوج الألماني/العربي كما هو بعد المراجعة. | [S07](#s07)، [S08](#s08)، [S11](#s11) |
| `d-a2-04.lines[4]` | سطر — سليم | Reisende: DE «Ungefähr vier Stunden.»<br>AR «حوالي أربع ساعات.» | ungefähr = حوالي/تقريباً، وStunden = ساعات؛ العدد والترجمة متطابقان. | لا تغيير؛ حُفظ الزوج الألماني/العربي كما هو بعد المراجعة. | [S09](#s09)، [S10](#s10) |
| `d-a2-04-q1` | سؤال — سليم | DE: Wo muss der Mann umsteigen?<br>AR: اختر الإجابة الصحيحة حسب الحوار.<br>الخيارات: in Köln / nach vier Stunden / in Frankfurt<br>المفتاح: in Frankfurt<br>الشرح: الدليل: «in Frankfurt müssen Sie umsteigen». الفخّ 1: كولن الوجهة. الفخّ 2: أربع ساعات مدّة الرحلة. | السؤال يسأل عن محطة التبديل؛ العبارة الصريحة in Frankfurt müssen Sie umsteigen تثبت المفتاح. كولن الوجهة وأربع ساعات مدة الرحلة لا المحطة. | لا تغيير؛ المفتاح والشرح محفوظان بعد فحص نص الحوار والخيارات. | [S05](#s05)، [S06](#s06)، [S21](#s21) |
| `d-a2-04-q2` | سؤال — سليم | DE: Die Fahrt dauert ungefähr vier ___.<br>AR: أكمل الفراغ بالكلمة المناسبة من الحوار.<br>الخيارات: —<br>المفتاح: Stunden<br>الشرح: ساعات. | Die Fahrt dauert ungefähr vier Stunden؛ الفراغ يقبل Stunden ويطابق الترجمة «ساعات». لا تعارض مع المفتاح. | لا تغيير؛ المفتاح والشرح محفوظان بعد فحص نص الحوار والخيارات. | [S07](#s07)، [S08](#s08)، [S09](#s09)، [S10](#s10) |
| `d-a2-04.dictation[0]` | إملاء — سليم | «Ist dieser Platz frei?» | الجملة القصيرة تطابق سؤال المقعد: هذا Platz شاغر أم لا؛ لا إضافة/حذف في الإملاء. | لا تغيير؛ طوبقت جملة الإملاء بالنص الألماني الحي. | [S01](#s01)، [S02](#s02) |
| `d-a2-04.dictation[1]` | إملاء — سليم | «In Frankfurt müssen Sie umsteigen.» | الجملة تطابق سطر التبديل في فرانكفورت كلمةً ومعنىً. | لا تغيير؛ طوبقت جملة الإملاء بالنص الألماني الحي. | [S05](#s05)، [S06](#s06)، [S21](#s21) |
| `d-a2-04.dictation[2]` | إملاء — سليم | «Ungefähr vier Stunden.» | العبارة تطابق ungefähr vier Stunden؛ «حوالي أربع ساعات» دقيقة. | لا تغيير؛ طوبقت جملة الإملاء بالنص الألماني الحي. | [S09](#s09)، [S10](#s10) |
| `d-a2-05` | بيانات — سليم | DE: Eine Entschuldigung؛ AR: اعتذار؛ A2؛ 6 أسطر، سؤالان، 3 إملاءات | عنوان الاعتذار وسياقه متسقان؛ راجعت اللقطة الحية بما فيها سؤالا السبب والفراغين، دون نقل أي قيمة تاريخية إلى المحتوى. | لا تغيير؛ البيانات الحية مثبتة في اللقطة، ولا يُستنتج منها حكم جديد على CEFR. | [S12](#s12) |
| `d-a2-05.lines[0]` | سطر — سليم | Sara: DE «Hassan, ich muss mich entschuldigen.»<br>AR «حسان، عليّ أن أعتذر.» | müssen + sich entschuldigen تعني وجوب الاعتذار؛ الترجمة «عليّ أن أعتذر» تحفظ الفاعل والمعنى. | لا تغيير؛ حُفظ الزوج الألماني/العربي كما هو بعد المراجعة. | [S13](#s13)، [S21](#s21) |
| `d-a2-05.lines[1]` | سطر — سليم | Hassan: DE «Warum? Was ist passiert?»<br>AR «لماذا؟ ماذا حدث؟» | passieren بمعنى يحدث؛ «ماذا حدث؟» مطابق للسؤال. | لا تغيير؛ حُفظ الزوج الألماني/العربي كما هو بعد المراجعة. | [S22](#s22) |
| `d-a2-05.lines[2]` | سطر — سليم | Sara: DE «Gestern habe ich vergessen, zum Termin zu kommen.»<br>AR «أمس نسيت أن آتي إلى الموعد.» | gestern = أمس، vergessen = نسي، Termin = موعد، kommen = أتى؛ المفعول المصدر zu kommen مرتبط بالموعد. صيغة Perfekt والمحتوى متسقان، والفاصلة مع Infinitivgruppe ظاهرة. | لا تغيير؛ حُفظ الزوج الألماني/العربي كما هو بعد المراجعة. | [S14](#s14)، [S15](#s15)، [S16](#s16)، [S17](#s17)، [S18](#s18)، [S19](#s19)، [S20](#s20)، [S51](#s51) |
| `d-a2-05.lines[3]` | سطر — مُصحح | Hassan: DE «Ach so! Kein Problem. Warst du krank?»<br>AR «أوه! لا مشكلة. هل كنتِ مريضة؟» | تصحيح مؤكد: Sara هي مرجع Sie المؤنثة في جواب d-a2-05-q1 (Sie hat… بصيغة الغائب المفرد). الترجمة السابقة خاطبتها بالمذكر «كنتَ/مريضاً»؛ LibreTexts يثبت كنتِ للمخاطبة المؤنثة، وWiktionary يثبت مريضة مؤنث مريض. | عُدلت العربية إلى «أوه! لا مشكلة. هل كنتِ مريضة؟» لتوافق Sara المؤنثة؛ لم تتغير الجملة الألمانية أو جواب السؤال. | [S23](#s23)، [S24](#s24)، [S25](#s25)، [S26](#s26)، [S32](#s32) |
| `d-a2-05.lines[4]` | سطر — سليم | Sara: DE «Nein, ich hatte einfach viel Arbeit.»<br>AR «لا، كان لديّ عمل كثير فحسب.» | Arbeit تعني العمل وviel الكثرة؛ «كان لديّ عمل كثير فحسب» ينقل الجملة، دون استنتاج مرض أو سبب طبي. | لا تغيير؛ حُفظ الزوج الألماني/العربي كما هو بعد المراجعة. | [S27](#s27)، [S28](#s28) |
| `d-a2-05.lines[5]` | سطر — سليم | Hassan: DE «Macht nichts. Treffen wir uns morgen?»<br>AR «لا عليك. نلتقي غداً؟» | Macht nichts تعني لا بأس/لا يهم؛ morgen = غداً وsich treffen = يلتقيان. «لا عليك. نلتقي غداً؟» مقابل عربي طبيعي للسياق. | لا تغيير؛ حُفظ الزوج الألماني/العربي كما هو بعد المراجعة. | [S29](#s29)، [S30](#s30)، [S31](#s31) |
| `d-a2-05-q1` | سؤال — سليم | DE: Warum entschuldigt sich Sara?<br>AR: اختر الإجابة الصحيحة حسب الحوار.<br>الخيارات: Sie hat vergessen, zum Termin zu kommen. / Sie war krank. / Sie kann morgen nicht kommen.<br>المفتاح: Sie hat vergessen, zum Termin zu kommen.<br>الشرح: الدليل: «Gestern habe ich vergessen, zum Termin zu kommen». الفخّ 1: المرض سأل عنه حسن ونفته سارة. الفخّ 2: الغد اقتراح حسن للقاء. | النص يقول صراحةً: Gestern habe ich vergessen, zum Termin zu kommen. مفتاح النسيان عن الموعد مباشر؛ المرض سؤال نفته Sara والغد اقتراح لاحق. | لا تغيير؛ المفتاح والشرح محفوظان بعد فحص نص الحوار والخيارات. | [S14](#s14)، [S16](#s16)، [S17](#s17)، [S18](#s18)، [S20](#s20)، [S21](#s21)، [S30](#s30) |
| `d-a2-05-q2` | سؤال — سليم | DE: Ich muss mich ___.<br>AR: أكمل الفراغ بالكلمة المناسبة من الحوار.<br>الخيارات: —<br>المفتاح: entschuldigen<br>الشرح: sich entschuldigen = يعتذر. | تقول Sara: Ich muss mich entschuldigen؛ الفعل المنعكس entschuldigen هو الكلمة الناقصة، وشرح المعنى مطابق. | لا تغيير؛ المفتاح والشرح محفوظان بعد فحص نص الحوار والخيارات. | [S13](#s13)، [S21](#s21) |
| `d-a2-05.dictation[0]` | إملاء — سليم | «Ich muss mich entschuldigen.» | إملاء مطابق للسطر الأول من الحوار، بما فيه الفعل المنعكس. | لا تغيير؛ طوبقت جملة الإملاء بالنص الألماني الحي. | [S13](#s13)، [S21](#s21) |
| `d-a2-05.dictation[1]` | إملاء — سليم | «Gestern habe ich vergessen, zum Termin zu kommen.» | إملاء مطابق لجملة النسيان والموعد؛ يحفظ gestern، Perfekt، والفاصلة قبل Infinitivgruppe. | لا تغيير؛ طوبقت جملة الإملاء بالنص الألماني الحي. | [S14](#s14)، [S16](#s16)، [S17](#s17)، [S18](#s18)، [S19](#s19)، [S20](#s20)، [S51](#s51) |
| `d-a2-05.dictation[2]` | إملاء — سليم | «Treffen wir uns morgen?» | إملاء مطابق لسؤال اقتراح اللقاء غداً. | لا تغيير؛ طوبقت جملة الإملاء بالنص الألماني الحي. | [S30](#s30)، [S31](#s31) |
| `d-a2-06` | بيانات — سليم | DE: Umtausch im Geschäft؛ AR: الاستبدال في المتجر؛ A2؛ 5 أسطر، سؤالان، 3 إملاءات | عنوان الاستبدال في المتجر وسياقه متسقان؛ راجعت اللقطة الحية بما فيها طلب إيصال الشراء وتوفر المقاس M. | لا تغيير؛ البيانات الحية مثبتة في اللقطة، ولا يُستنتج منها حكم جديد على CEFR. | [S33](#s33)، [S34](#s34)، [S49](#s49) |
| `d-a2-06.lines[0]` | سطر — مُصحح | Kundin: DE «Guten Tag. Ich habe diesen Pullover gestern gekauft, aber er ist zu klein.»<br>AR «طاب يومكم. اشتريت هذه الكنزة أمس، لكنها أصغر من اللازم.» | تصحيح مؤكد في موضعين: PONS يقابل Pullover/Pulli بـ«بلوفر/كنزة»، لذا «كنزة» أدق من «سترة» العامة؛ zu lang عند PONS = أطول من اللازم وzu viel = أكثر من اللازم، فـzu klein تعني أصغر من اللازم لا صغيرة فقط. | عُدلت العربية إلى «طاب يومكم. اشتريت هذه الكنزة أمس، لكنها أصغر من اللازم.» لتسمية Pullover بدقة وإظهار معنى zu؛ لم تتغير الألمانية. | [S20](#s20)، [S33](#s33)، [S35](#s35)، [S36](#s36)، [S37](#s37)، [S41](#s41)، [S42](#s42) |
| `d-a2-06.lines[1]` | سطر — سليم | Verkäufer: DE «Haben Sie den Kassenzettel dabei?»<br>AR «هل معك الوصل؟» | Kassenzettel هو إيصال/قسيمة الدفع، وdabei في haben … dabei بمعنى «كان معه»؛ «هل معك الوصل؟» ينقل السؤال، والكتابة غير المشكولة لا تحسم جنس المخاطَب. | لا تغيير؛ حُفظ الزوج الألماني/العربي كما هو بعد المراجعة. | [S39](#s39)، [S40](#s40) |
| `d-a2-06.lines[2]` | سطر — سليم | Kundin: DE «Ja, hier. Kann ich eine größere Größe haben?»<br>AR «نعم، تفضّل. هل يمكنني الحصول على مقاس أكبر؟» | Größe للملابس = مقاس، وgrößer أكبر. Ja, hier تعني «نعم، هنا» في جواب سؤال الإيصال؛ «تفضّل» تعبير عربي سياقي عند مناولة الإيصال. لا يثبت الدليل خطأً يستدعي تغييرها. | لا تغيير؛ حُفظ الزوج الألماني/العربي كما هو بعد المراجعة. | [S35](#s35)، [S38](#s38)، [S39](#s39)، [S40](#s40)، [S43](#s43)، [S45](#s45) |
| `d-a2-06.lines[3]` | سطر — سليم | Verkäufer: DE «Moment, ich schaue nach. Ja, Größe M ist da.»<br>AR «لحظة، أتفقّد. نعم، المقاس M متوفر.» | schauen … nach تفقّد، وGröße M ist da تعني أن المقاس M موجود/متوفر؛ الترجمة تحافظ على ذلك. | لا تغيير؛ حُفظ الزوج الألماني/العربي كما هو بعد المراجعة. | [S38](#s38)، [S44](#s44)، [S46](#s46) |
| `d-a2-06.lines[4]` | سطر — سليم | Kundin: DE «Wunderbar, vielen Dank!»<br>AR «رائع، شكراً جزيلاً!» | wunderbar = رائع وvielen Dank = شكراً جزيلاً؛ العبارة سليمة. | لا تغيير؛ حُفظ الزوج الألماني/العربي كما هو بعد المراجعة. | [S47](#s47)، [S48](#s48) |
| `d-a2-06-q1` | سؤال — سليم | DE: Sie hat den Pullover gestern ___.<br>AR: أكمل الفراغ بالكلمة المناسبة من الحوار.<br>الخيارات: —<br>المفتاح: gekauft<br>الشرح: Perfekt لفعل منتظم: ge-kauf-t. | gekauft هي Partizip II الصحيح لـkaufen؛ الجملة تسأل عما اشترته الزبونة أمس، والجواب محفوظ. | لا تغيير؛ المفتاح والشرح محفوظان بعد فحص نص الحوار والخيارات. | [S20](#s20)، [S35](#s35)، [S37](#s37) |
| `d-a2-06-q2` | سؤال — غير محسوم | DE: Was braucht der Verkäufer?<br>AR: اختر الإجابة الصحيحة حسب الحوار.<br>الخيارات: den Kassenzettel / Größe M / die kleinere Größe zurück<br>المفتاح: den Kassenzettel<br>الشرح: الدليل: «Haben Sie den Kassenzettel dabei?». الفخّ 1: المقاس M هو ما تحصل عليه الزبونة. الفخّ 2: البلوفر الصغير تعيده هي، لكن البائع طلب الإيصال. | البائع يطلب Kassenzettel صراحةً؛ المقاس M هو المقاس المتوفر لا الشيء الذي طلبه. الشرح يصف إرجاع المقاس الأصغر: عنوان Umtausch يجعل هذا التصور معقولاً، لكن الحوار لا يصرّح بفعل الإرجاع. لذلك لا أعدّه خطأً مؤكداً ولا أعدّل الشرح؛ تبقى دقة هذا التلميح غير محسومة تربوياً. | لا تعديل؛ احتُفظ بالمفتاح الصحيح، وسُجلت دقة جملة الفخ بوصفها غير محسومة لا خطأً مؤكداً. | [S33](#s33)، [S35](#s35)، [S38](#s38)، [S39](#s39)، [S49](#s49) |
| `d-a2-06.dictation[0]` | إملاء — سليم | «Ich habe diesen Pullover gestern gekauft.» | الإملاء يطابق شراء Pullover أمس؛ لا تغيير في الألمانية أو المفتاح. | لا تغيير؛ طوبقت جملة الإملاء بالنص الألماني الحي. | [S20](#s20)، [S35](#s35)، [S37](#s37) |
| `d-a2-06.dictation[1]` | إملاء — سليم | «Haben Sie den Kassenzettel dabei?» | الإملاء يطابق سؤال البائع المباشر عن إيصال الشراء ووجوده مع الزبونة. | لا تغيير؛ طوبقت جملة الإملاء بالنص الألماني الحي. | [S39](#s39)، [S40](#s40) |
| `d-a2-06.dictation[2]` | إملاء — سليم | «Kann ich eine größere Größe haben?» | الإملاء يطابق طلب مقاس أكبر؛ أكبر من groß في المقارنة، ولا يضيف مقاساً غير مذكور. | لا تغيير؛ طوبقت جملة الإملاء بالنص الألماني الحي. | [S35](#s35)، [S38](#s38)، [S43](#s43) |

## الملاحظة غير المحسومة

- **`d-a2-06-q2`:** الجواب `den Kassenzettel` ثابت لأن البائع يسأل عنه حرفياً. شرح المشتت يفترض أن الزبونة تعيد المقاس الأصغر؛ عنوان `Umtausch` يجعل ذلك تصوراً معقولاً، لكن الحوار لا يذكر فعل الإرجاع صراحةً. هذا حدّ دقة تربوي لا خطأ مؤكد؛ لم أغير الشرح. الأدلة: [S33](#s33)، [S34](#s34)، [S39](#s39).

## المقارنة التاريخية المحدودة

قورنت فقط الأسئلة الثلاثة الموجودة بمعرفاتها في `scripts/patches/a_dialog_fallen.py`. السجل تاريخي للمشتتات وليس نصاً كاملاً ولا مصدراً للحكم اللغوي.

| المعرّف | التاريخي | الحي | الملاحظة |
|---|---|---|---|
| `d-a2-04-q1` | in Köln / in Frankfurt / nach vier Stunden<br>المفتاح: in Frankfurt | in Köln / nach vier Stunden / in Frankfurt<br>المفتاح: in Frankfurt | تغيّر ترتيب الخيارين الثاني/الثالث فقط؛ المجموعة والمفتاح in Frankfurt محفوظان. |
| `d-a2-05-q1` | Sie war krank. / Sie hat vergessen, zum Termin zu kommen. / Sie kann morgen nicht kommen.<br>المفتاح: Sie hat vergessen, zum Termin zu kommen. | Sie hat vergessen, zum Termin zu kommen. / Sie war krank. / Sie kann morgen nicht kommen.<br>المفتاح: Sie hat vergessen, zum Termin zu kommen. | تغيّر ترتيب المشتتات حول المفتاح؛ المفتاح والجمل الثلاث محفوظة. |
| `d-a2-06-q2` | den Kassenzettel / den Pullover in Größe M / die kleinere Größe zurück<br>المفتاح: den Kassenzettel | den Kassenzettel / Größe M / die kleinere Größe zurück<br>المفتاح: den Kassenzettel | تغيّر نص المشتت الثاني من den Pullover in Größe M إلى Größe M؛ المفتاح den Kassenzettel محفوظ. |

توضح المقارنة اختلاف الترتيب في `d-a2-04-q1` و`d-a2-05-q1`، وتغير صياغة مشتت واحد في `d-a2-06-q2`؛ لا تثبت هذه الفروق وحدها وجود خطأ.

## فحص الصوت

اقتصر الفحص على الوجود الفعلي ومطابقة الحجم المعلن، من دون تشغيل أو استماع:

| الحوار | الملف | الحجم في البيان | الحجم الفعلي | الصوت/المتحدثان | النتيجة |
|---|---|---:|---:|---|---|
| `d-a2-04` | `/audio/dialog/d-a2-04.mp3` | 108,757 بايت | 108,757 بايت | `voice-01+voice-02` (2) | موجود ومتطابق؛ لم يُستمع إليه |
| `d-a2-05` | `/audio/dialog/d-a2-05.mp3` | 119,433 بايت | 119,433 بايت | `voice-01+voice-02` (2) | موجود ومتطابق؛ لم يُستمع إليه |
| `d-a2-06` | `/audio/dialog/d-a2-06.mp3` | 129,655 بايت | 129,655 بايت | `voice-01+voice-02` (2) | موجود ومتطابق؛ لم يُستمع إليه |

## المنهج والحدود

- فُحصت العناصر الـ34 من اللقطة الحية؛ لا يعدّ هذا تقريراً لمراجعة حوارات A2 الأخرى.
- استُخدمت المراجع المعجمية لإسناد المعنى/الصيغة موضع الفحص؛ لا تُثبت وحدها الملاءمة التربوية أو مستوى CEFR.
- المقارنة التاريخية محصورة في ثلاثة معرفات من ملف مشتتات؛ لا نملك منه العناوين أو الأسطر أو الإملاء التاريخي.
- لم يُراجع CEFR أو النسبة أو حساب المستوى الممكن. لم يحدث تقييم طبي أو قانوني أو استماع للصوت.
- المراجعة مدعومة بمصادر وهي من مساعد ذكاء اصطناعي؛ ليست مراجعة بشرية أو اعتماداً مهنياً.

## المصادر المنشورة (51)

<a id="s01"></a>S01 — [PONS: Platz](https://en.pons.com/translate/german-arabic/Platz). يورد Platz في معنى Sitz مقابل «مقعد»، وهو المقصود في سؤال خلوّ المقعد.
<a id="s02"></a>S02 — [PONS: frei](https://en.pons.com/translate/german-arabic/frei). يعرض frei بمعنى unbesetzt؛ يدعم معنى المقعد المتاح/الشاغر في هذا السياق.
<a id="s03"></a>S03 — [PONS: bitte](https://en.pons.com/translate/german-arabic/bitte). يفصل معنى bitte عند العرض/الإتاحة ويترجمه «تفضل»، لا يقتصر على طلب «من فضلك».
<a id="s04"></a>S04 — [PONS: Zug](https://en.pons.com/translate/german-arabic/Zug). يسجل معنى Zug في سياق Bahn مقابل «قطار».
<a id="s05"></a>S05 — [PONS: umsteigen](https://en.pons.com/translate/german-arabic/umsteigen). يترجم umsteigen في السفر بتغيير القطار/وسيلة النقل؛ يدعم معنى التبديل في فرانكفورت.
<a id="s06"></a>S06 — [Duden: umsteigen](https://www.duden.de/rechtschreibung/umsteigen). يعرف umsteigen بالانتقال من مركبة إلى أخرى ويورد مثال تغيير القطار في مدينة وسيطة.
<a id="s07"></a>S07 — [PONS: Fahrt](https://en.pons.com/translate/german-arabic/Fahrt). يعرض Fahrt بمعاني «سفر/رحلة/سير» بحسب السياق.
<a id="s08"></a>S08 — [PONS: dauern](https://en.pons.com/translate/german-arabic/dauern). يعرض dauern مقابل «دام/استغرق»، كما في السؤال عن مدة الرحلة.
<a id="s09"></a>S09 — [PONS: ungefähr](https://en.pons.com/translate/german-arabic/ungef%C3%A4hr). يعرض ungefähr ظرفاً بمعنى «تقريباً/حوالي».
<a id="s10"></a>S10 — [PONS: Stunde](https://en.pons.com/translate/german-arabic/Stunde). يعرض Stunde بمعنى «ساعة» الزمنية؛ يدعم إجابة أربع ساعات.
<a id="s11"></a>S11 — [PONS: schade](https://en.pons.com/translate/german-arabic/schade). يسجل الاستعمال التعجبي schade! بمعنى «يا خسارة»؛ «للأسف» في الترجمة تعبير عربي مقابل للسياق لا ترجمة حرفية وحيدة.
<a id="s12"></a>S12 — [PONS: Entschuldigung](https://en.pons.com/translate/german-arabic/Entschuldigung). يعرض Entschuldigung بمعنى «اعتذار»، وهو عنوان الحوار ومضمونه.
<a id="s13"></a>S13 — [PONS: entschuldigen](https://en.pons.com/translate/german-arabic/entschuldigen). يعرض sich entschuldigen بمعنى «اعتذر»؛ يدعم السؤال والتمرين ذي الفراغ.
<a id="s14"></a>S14 — [PONS: Termin](https://en.pons.com/translate/german-arabic/Termin). يعرض Termin بمعنى «موعد»، إضافة إلى معنى الأجل في سياقات أخرى.
<a id="s15"></a>S15 — [Duden: Termin](https://www.duden.de/rechtschreibung/Termin). يعرف Termin كنقطة/موعد محدد ويورد استعمال einen Termin haben/versäumen.
<a id="s16"></a>S16 — [PONS: vergessen](https://en.pons.com/translate/german-arabic/vergessen). يعرض vergessen بمعنى «نسي» ويبين تصريف Perfekt hat vergessen.
<a id="s17"></a>S17 — [Duden: vergessen](https://www.duden.de/rechtschreibung/vergessen_Verb_nicht_erinnern). يعرّف vergessen بمعنى عدم التذكر/النسيان ويورد تصريف Perfekt hat vergessen؛ لا يُستخدم منفرداً لإثبات تركيب مصدر zu.
<a id="s18"></a>S18 — [Duden: Konjugation vergessen](https://www.duden.de/konjugation/vergessen_Verb_nicht_erinnern). يسجل صيغة Infinitiv mit zu: zu vergessen، وتصريف Perfekt hat vergessen.
<a id="s19"></a>S19 — [PONS: kommen](https://en.pons.com/translate/german-arabic/kommen). يعرض kommen بمعنى «جاء/أتى»؛ يدعم zum Termin zu kommen وترجمته «أن آتي إلى الموعد».
<a id="s20"></a>S20 — [PONS: gestern](https://en.pons.com/translate/german-arabic/gestern). يعرض gestern بمعنى «أمس/البارحة».
<a id="s21"></a>S21 — [PONS: müssen](https://en.pons.com/translate/german-arabic/m%C3%BCssen). يعرض ich muss بمعنى «يجب عليّ/عليّ أن»، ويدعم الترجمة العربية للوجوب.
<a id="s22"></a>S22 — [PONS: passieren](https://en.pons.com/translate/german-arabic/passieren). يعرض passieren في معنى geschehen مقابل «حدث/حصل».
<a id="s23"></a>S23 — [PONS: krank](https://en.pons.com/translate/german-arabic/krank). يعرض معنى krank «مريض»؛ يثبت المعنى المعجمي لا جنس المخاطَب.
<a id="s24"></a>S24 — [PONS: sie](https://en.pons.com/translate/german-arabic/sie). يفصل sie للمفرد المؤنث مقابل «هي» عن sie للجمع وعن Sie الرسمية؛ يدعم تحديد Sara مؤنثاً من Sie hat في صيغة الغائب المفرد.
<a id="s25"></a>S25 — [Wiktionary: مريضة](https://en.wiktionary.org/wiki/%D9%85%D8%B1%D9%8A%D8%B6%D8%A9). يصنف مريضة صراحةً صيغة مؤنث مفرد من مريض؛ مصدر صرفي للكلمة المصححة.
<a id="s26"></a>S26 — [LibreTexts Humanities: كان في الماضي](https://human.libretexts.org/Bookshelves/Languages/Arabic/Arabic_Level_Three/06:_Story_From_the_Past/6.01:_Explanation_of__in_Present_and_Past_Tense). يعرض كُنتِ مع أنتِ في المخاطبة المؤنثة، ومثال كنتِ متعبة؛ يثبت مطابقة الفعل والوصف لصيغة المخاطبة المؤنثة.
<a id="s27"></a>S27 — [PONS: Arbeit](https://en.pons.com/translate/german-arabic/Arbeit). يعرض Arbeit بمعنى «عمل»، ويورد أن arbeiten beschäftigt sein يعبّر عن الانشغال بالعمل.
<a id="s28"></a>S28 — [PONS: viel](https://en.pons.com/translate/german-arabic/viel). يعرض viel بمعنى «كثير»، وviel beschäftigt بمعنى «مشغول جداً»؛ يساند معنى viel Arbeit دون ادعاء حرفية واحدة.
<a id="s29"></a>S29 — [PONS: macht nichts](https://en.pons.com/translate/german-arabic/macht+nichts). يعرض es macht nichts مقابل «لا بأس/لا يهم»، وهو معنى التطمين في الحوار.
<a id="s30"></a>S30 — [PONS: morgen](https://en.pons.com/translate/german-arabic/morgen). يعرض ظرف morgen بمعنى «غداً».
<a id="s31"></a>S31 — [PONS: treffen](https://en.pons.com/translate/german-arabic/treffen). يعرض sich treffen مقابل «تلاقى/تقابل/اجتمع».
<a id="s32"></a>S32 — [PONS: ach so](https://en.pons.com/translate/german-arabic/ach+so). يعرض ach so! في معنى الاستيعاب/«هكذا إذاً»، بما يساند «أوه!» في الرد.
<a id="s33"></a>S33 — [PONS: Umtausch](https://en.pons.com/translate/german-arabic/Umtausch). يعرض Umtausch بمعنى «تبديل»، ويدعم سياق عنوان الحوار دون إثبات كل تفصيل غير منطوق.
<a id="s34"></a>S34 — [PONS: Geschäft](https://en.pons.com/translate/german-arabic/Gesch%C3%A4ft). يعرض Geschäft بمعنى «متجر/دكان» في معنى Laden.
<a id="s35"></a>S35 — [PONS: Pullover](https://en.pons.com/translate/german-arabic/Pullover). يعامل Pullover مع مرادف Pulli ويورد المقابلين العربيين «بلوفر» و«كنزة».
<a id="s36"></a>S36 — [Duden: Pullover](https://www.duden.de/rechtschreibung/Pullover). يعرف Pullover لباساً محبوكاً/منسوجاً للجزء العلوي يُلبس عبر الرأس؛ يحدد المرجع المقصود، ولا يفرض مقابلاً عربياً وحيداً.
<a id="s37"></a>S37 — [PONS: kaufen](https://en.pons.com/translate/german-arabic/kaufen). يعرض kaufen بمعنى «اشترى» ويبين Partizip II gekauft في Perfekt.
<a id="s38"></a>S38 — [PONS: Größe](https://en.pons.com/translate/german-arabic/Gr%C3%B6%C3%9Fe). يعرض Größe eines Kleidungsstücks مقابل «مقاس/قياس».
<a id="s39"></a>S39 — [PONS: Kassenzettel](https://en.pons.com/translate/german-arabic/Kassenzettel). يعرض Kassenzettel مقابلاً لسند/قسيمة الدفع، أي إيصال الشراء في سياق المتجر.
<a id="s40"></a>S40 — [PONS: dabei](https://en.pons.com/translate/german-arabic/dabei). يورد er hatte es dabei = «كان معه»، وهو معنى حمل الإيصال.
<a id="s41"></a>S41 — [PONS: zu (Gradadverb)](https://en.pons.com/translate/german-arabic/zu). يعرض zu lang بمعنى «أطول من اللازم» وzu viel بمعنى «أكثر من اللازم»؛ يثبت دلالة تجاوز الحد في zu klein بالقياس التركيبي.
<a id="s42"></a>S42 — [PONS: klein](https://en.pons.com/translate/german-arabic/klein). يعرض klein بمعنى «صغير»؛ عند جمعه مع zu تكون الدلالة «أصغر من اللازم»، لا مجرد صغير.
<a id="s43"></a>S43 — [PONS: groß](https://en.pons.com/translate/german-arabic/gro%C3%9F). يعرض groß <größer> بمعنى كبير؛ يدعم المقارنة/الطلب um eine größere Größe.»
<a id="s44"></a>S44 — [PONS: da](https://en.pons.com/translate/german-arabic/da). يعرض da بمعنى vorhanden/anwesend = «موجود/متوفر»، وهو معنى Größe M ist da.
<a id="s45"></a>S45 — [PONS: hier](https://en.pons.com/translate/german-arabic/hier). يعرض hier بمعنى «هنا»، وهو المقصود في تسليم الإيصال: Ja, hier.
<a id="s46"></a>S46 — [PONS: nachschauen](https://en.pons.com/translate/german-arabic/nachschauen). يعرض nachschauen بمعنى البحث/التفقّد، ويبين انفصال schauen ... nach.
<a id="s47"></a>S47 — [PONS: wunderbar](https://en.pons.com/translate/german-arabic/wunderbar). يعرض wunderbar بمعنى «رائع».
<a id="s48"></a>S48 — [PONS: vielen Dank](https://en.pons.com/translate/german-arabic/vielen+dank?q=vielen+Dank). يعرض vielen Dank مقابل «شكراً جزيلاً».
<a id="s49"></a>S49 — [PONS: Kundin](https://en.pons.com/translate/german-arabic/Kundin). يعرض Kundin بمعنى «زبونة/عميلة»؛ يثبت تأنيث شخصية الحوار d-a2-06.
<a id="s50"></a>S50 — [PONS: nach](https://en.pons.com/translate/german-arabic/nach). يعرض nach في معنى الاتجاه مقابل «إلى/نحو»، كما في قطار إلى كولونيا.
<a id="s51"></a>S51 — [Duden: Komma beim Infinitiv mit zu](https://www.duden.de/sprachwissen/sprachratgeber/Das-Komma-beim-Infinitiv-mit-%E2%80%9Ezu%E2%80%9C). يوضح مواضع الفاصلة مع مجموعة المصدر zu؛ يدعم كتابة الفاصلة في جملة Infinitivgruppe الموسعة، ولا يغني عن فحص مفردات الجملة.
