# مراجعة الحوارات A1 — الدفعة 10

**التاريخ:** 2026-10-05<br>**النطاق:** أقرب سجلات A1 الموجودة بعد d-a1-25–27 هي `d-a1-31` و`d-a1-32`؛ لم أعثر على `d-a1-28` أو `d-a1-29` أو `d-a1-30` في السجل الحي.

## التغطية والحكم

- **23 وحدة**: 2 بيانات حوار، 11 سطراً، 4 أسئلة بكل حقولها، و6 جمل إملاء.
- الأحكام: **22 سليم؛ 0 مصحح؛ 1 غير محسوم**. لا يوجد خطأ مؤكد استدعى تعديل محتوى.
- التباس غير محسوم واحد: طريقة تمثيل أسماء الأحرف الألمانية بالعربية في `d-a1-31.lines[3]`.
- ملفا الصوت موجودان، والحجمان يطابقان بيانات manifest؛ لم تُختبر مطابقة النطق/المحتوى الصوتي.

## نتائج مركزة

1. دلالة `H-A-D-D-A-D` هي تهجئة الاسم حرفاً حرفاً ([S4](#s4)). التعريب الحالي يكتب أسماء حروف عربية مقابلة، لكنه لا يوضح إن كان المطلوب شرح المعنى أم محاكاة الصوت الألماني. أبقيته غير محسوم دون استبدال تخميني.
2. `Nehmen Sie bitte im Wartezimmer Platz` وترجمتها يؤيدهما مدخل Wartezimmer واصطلاح Platz nehmen ([S5](#s5)، [S6](#s6)).
3. مفردات الطريق دقيقة في سياقها: Ampel إشارة ضوئية، geradeaus إلى الأمام، rechts يميناً، وPostamt مكتب البريد ([S7](#s7)–[S11](#s11)). «الإشارة» بالعربية مختصرة لكنها مفهومة في هذا السياق.
4. `neben der Bank` تعني «بجانب البنك»؛ PONS يسجل معنى Bank المالي ومعنى المقعد، والسياق يرجح المالي. ولأن الجملة تحدد موقعاً ثابتاً، Dativ في `der Bank` صحيح ([S12](#s12)–[S14](#s14)).

## فجوة المعرّفات 28–30

فحصت أيضاً تاريخ Git المتاح ومصادر قوائم البطاقات، من دون اعتبار ذلك تدقيقاً لمحتوى غير موجود. نتيجة التتبّع وحدود النسخة shallow موثقة منفصلة في [تقرير الفجوة `d-a1-28–30`](content-gap-a1-dialogues-28-30-2026-10-05.md) ونسخته [JSON](content-gap-a1-dialogues-28-30-2026-10-05.json). لا تُستبدل هذه المعرّفات بالحوارين 31–32، ولا يجزم التقرير بأنها لم توجد في تاريخ أقدم غير متاح.

## المقارنة بالمصادر التاريخية

قورنت الأسطر والعناوين مع `scripts/dialoge_welle.py`، ثم المشتتات مع `scripts/patches/a_dialog_fallen.py`. العناوين والأسطر الحية مطابقة للتأسيس. شهد السؤالان المتعددان تغييرات تحريرية في المشتتات؛ تحرك ترتيب المفتاح في البيانات الحية لكنه بقي صحيحاً. وتحولت جمل الإملاء إلى اقتباسات كاملة من الأسطر الحية. التفاصيل أدناه؛ لم أعتبر اختلاف الترتيب خطأً.

| الحوار | السؤال | التأسيسي | تحرير المشتتات | الحي | ملاحظة المفتاح |
|---|---|---|---|---|---|
| d-a1-31 | `d-a1-31-q1` | um acht Uhr، um neun Uhr، um zehn Uhr | um neun Uhr bei Frau Bauer، um neun Uhr bei Herrn Haddad، um zehn Uhr bei Frau Bauer | um neun Uhr bei Herrn Haddad، um neun Uhr bei Frau Bauer، um zehn Uhr bei Frau Bauer | `um neun Uhr bei Frau Bauer` — زاد التفصيل ليحدد Frau Bauer، والمفتاح الحالي هو نفسه المفتاح بعد تحرير المشتتات. ترتيب الإجابة الحية انتقل من الموضع الأول في a_dialog_fallen إلى الثاني؛ لا يغير صحة المفتاح. |
| d-a1-31 | `d-a1-31-q2` | Nehmen Sie bitte im ___ Platz. | — | Nehmen Sie bitte im ___ Platz. | `Wartezimmer` — بقي السؤال والمفتاح؛ خُفف الشرح من تعميم «في كل عيادة» إلى عبارة ذات شاهد مباشر من الحوار. |
| d-a1-32 | `d-a1-32-q1` | neben der Bank، hinter der Schule، vor dem Kino | neben der Bank، an der Ampel، fünf Minuten geradeaus, dann links | an der Ampel، fünf Minuten geradeaus, dann links، neben der Bank | `neben der Bank` — استبدلت المشتتات العامة بمعلومات مسموعة لكن موضوعة في دور خاطئ؛ مفتاح الإجابة ثابت، وترتيبه الحي انتقل من الأول إلى الثالث. |
| d-a1-32 | `d-a1-32-q2` | Gehen Sie ___ bis zur Ampel. | — | Gehen Sie ___ bis zur Ampel. | `geradeaus` — الموجه والمفتاح والشرح الأساسي بقوا. |

### تغييرات جمل الإملاء

- **d-a1-31**: التاريخي: Haben Sie einen Termin?، Wie ist Ihr Name, bitte?، Nehmen Sie bitte Platz. الحي: Guten Morgen! Haben Sie einen Termin?، Ja, um neun Uhr bei Frau Bauer.، Wie ist Ihr Name, bitte? أصبحت الجمل الثلاث كاملة ومقتبسة حرفياً من ثلاثة أسطر متتالية؛ الإملاء الثالث التاريخي كان مقتطفاً أقصر من السطر.
- **d-a1-32**: التاريخي: Wo ist die Post?، Gehen Sie geradeaus.، Es sind fünf Minuten zu Fuß. الحي: Entschuldigung, wo ist die Post?، Gehen Sie geradeaus bis zur Ampel.، Dann rechts. Die Post ist neben der Bank. استبدلت المقتطفات بجمل كاملة من السطور الحية؛ الثلاث كلها مطابقة حرفياً للحوار الحالي.

## فحص ملفي الصوت

| ID | المسار | موجود | الحجم المعلن/الفعلي | الأصوات | نطاق الفحص |
|---|---|---|---:|---:|---|
| d-a1-31 | `/audio/dialog/d-a1-31.mp3` | True | 134670/134670 بايت | 2 | وجود وحجم فقط؛ لا تحقق من transcript/النطق |
| d-a1-32 | `/audio/dialog/d-a1-32.mp3` | True | 94773/94773 بايت | 2 | وجود وحجم فقط؛ لا تحقق من transcript/النطق |

## سجل كل عنصر

المعرّفات أدناه تحفظ النص الحي الذي روجع، مع حكم ودليل وإجراء ومصادر مباشرة. «غير محسوم» لا يعني ثبوت الخطأ.

| المعرّف | النوع | النص/البيانات المراجعة | الحكم | الدليل والحكم | الإجراء | المصادر |
|---|---|---|---|---|---|---|
| d-a1-31 | بيانات الحوار: العنوان والمستوى والبنية | العنوان الألماني: `An der Rezeption`<br>العنوان العربي: `في الاستقبال`<br>المستوى المسجل: `A1`<br>الأسطر/الأسئلة/الإملاء: 5/2/3<br>waisen: غير موجودة | سليم | عنوان «An der Rezeption» يقابل «في الاستقبال»، والسياق هو تسجيل صاحب موعد وانتظاره. لا تحتوي بيانات هذا السجل على waisen/مرتكزات مفردات، لذلك لم أفترضها ولم أضفها. وسم A1 هو القيمة المخزنة فقط ولا يعاد تقييمه هنا. | لا تعديل. | [S1](#s1), [S5](#s5), [S18](#s18) |
| d-a1-31.lines[0] | سطر حوار ألماني وترجمته | المتحدث: `Empfang`<br>`Guten Morgen! Haben Sie einen Termin?`<br>↔ `صباحَ الخير! ألديكَ موعد؟` | سليم | التحية والسؤال عن وجود موعد محفوظان. صيغة Sie رسمية؛ «ألديكَ» تخاطب رامي بصيغة المذكر، ولا يوجد تعارض مع السياق. | لا تعديل. | [S1](#s1), [S18](#s18) |
| d-a1-31.lines[1] | سطر حوار ألماني وترجمته | المتحدث: `Rami`<br>`Ja, um neun Uhr bei Frau Bauer.`<br>↔ `نعم، التاسعةَ عندَ السيدةِ باور.` | سليم | الجواب يحدد التاسعة وFrau Bauer؛ ترجمة «التاسعة عند السيدة باور» تنقل الموعد. لا يحدد الألماني صباحاً أو مساءً، والعربية لا تضيف ذلك. | لا تعديل. | [S1](#s1), [S2](#s2) |
| d-a1-31.lines[2] | سطر حوار ألماني وترجمته | المتحدث: `Empfang`<br>`Wie ist Ihr Name, bitte?`<br>↔ `ما اسمُكَ من فضلك؟` | سليم | Wie ist Ihr Name تسأل عن الاسم، والترجمة «ما اسمك» مطابقة للمقصود. | لا تعديل. | [S3](#s3) |
| d-a1-31.lines[3] | سطر حوار ألماني وترجمته | المتحدث: `Rami`<br>`Rami Haddad. Ich buchstabiere: H-A-D-D-A-D.`<br>↔ `رامي حدّاد. أتهجّى: ها-ألف-دال-دال-ألف-دال.` | غير محسوم | Duden يعرّف buchstabieren بأنه نطق أحرف الكلمة بالتتابع. الترجمة العربية تسمي الحروف المكافئة بالعربية «ها-ألف-دال...» ولا تنقل النطق الألماني للأحرف حرفاً بحرف. إن كان الهدف تعريف معنى التهجئة فالصياغة مفهومة؛ وإن كان الهدف تدريب نطق أسماء الحروف الألمانية فقد يلزم إبقاء H-A-D-D-A-D أو إضافة نقل صوتي. لا يحدد السجل أي الهدفين. | تُترك كما هي إلى أن يتحدد هدف هذا السطر؛ لا أستبدل تمثيل الحروف تخميناً. | [S4](#s4) |
| d-a1-31.lines[4] | سطر حوار ألماني وترجمته | المتحدث: `Empfang`<br>`Danke. Nehmen Sie bitte im Wartezimmer Platz.`<br>↔ `شكراً. تفضَّلْ بالجلوسِ في غرفةِ الانتظار.` | سليم | Nehmen Sie bitte im Wartezimmer Platz تعني الجلوس/أخذ مقعد في غرفة الانتظار. الترجمة تحفظ طلب الجلوس والمكان والمخاطب المذكر. | لا تعديل. | [S5](#s5), [S6](#s6) |
| d-a1-31-q1 | سؤال فهم: الموجه والخيارات والمفتاح والشرح | **type:** `mc`<br>**promptDe:** `Wann ist der Termin?`<br>**promptAr:** `اختر الإجابة الصحيحة حسب الحوار.`<br>**options:** um neun Uhr bei Herrn Haddad، um neun Uhr bei Frau Bauer، um zehn Uhr bei Frau Bauer<br>**answer:** `um neun Uhr bei Frau Bauer`<br>**explanationAr:** الدليل: «Ja, um neun Uhr bei Frau Bauer». الفخّ 1: حدّاد هو المريض رامي. الفخّ 2: neun/zehn.<br>**falle:** غير موجود | سليم | الإجابة الحالية «um neun Uhr bei Frau Bauer» تجمع الوقت والطبيبة كما في السطر 1. المشتت «bei Herrn Haddad» يخلط المريض Rami بمقدم الموعد، ومشتت العاشرة يبدل الوقت. | لا تعديل. | [S1](#s1), [S2](#s2) |
| d-a1-31-q2 | سؤال إكمال: الموجه والإجابة والشرح | **type:** `fill`<br>**promptDe:** `Nehmen Sie bitte im ___ Platz.`<br>**promptAr:** `أكمل الفراغ بالكلمة المناسبة من الحوار.`<br>**options:** <br>**answer:** `Wartezimmer`<br>**explanationAr:** الدليل في الحوار: «Nehmen Sie bitte im Wartezimmer Platz» — والعبارة الثابتة: Platz nehmen = يجلس.<br>**falle:** غير موجود | سليم | بعد «im ___ Platz» الكلمة المنقولة حرفياً هي Wartezimmer؛ تركيب Platz nehmen تؤيده أمثلة PONS نفسها. | لا تعديل. | [S5](#s5), [S6](#s6) |
| d-a1-31.dictation[0] | جملة إملاء | `Guten Morgen! Haben Sie einen Termin?` | سليم | جملة كاملة مطابقة لبداية السطر الحواري الأول. | لا تعديل. | [S1](#s1), [S18](#s18) |
| d-a1-31.dictation[1] | جملة إملاء | `Ja, um neun Uhr bei Frau Bauer.` | سليم | جملة كاملة مطابقة للسطر الحواري الثاني؛ الوقت لا يضيف فترة يوم غير مذكورة. | لا تعديل. | [S1](#s1), [S2](#s2) |
| d-a1-31.dictation[2] | جملة إملاء | `Wie ist Ihr Name, bitte?` | سليم | جملة كاملة مطابقة لسؤال الاسم في السطر الحواري الثالث. | لا تعديل. | [S3](#s3) |
| d-a1-32 | بيانات الحوار: العنوان والمستوى والبنية | العنوان الألماني: `Nach dem Weg fragen`<br>العنوان العربي: `السؤالُ عن الطريق`<br>المستوى المسجل: `A1`<br>الأسطر/الأسئلة/الإملاء: 6/2/3<br>waisen: غير موجودة | سليم | عنوان «Nach dem Weg fragen» يقابل «السؤال عن الطريق». يسير النص من طلب موقع البريد إلى إرشادات يميناً ثم تقدير المسافة سيراً. لا توجد waisen في السجل؛ وسم A1 محفوظ كما هو دون إعادة تقييم. | لا تعديل. | [S7](#s7), [S8](#s8), [S9](#s9), [S10](#s10), [S11](#s11), [S12](#s12), [S13](#s13), [S14](#s14), [S15](#s15), [S16](#s16), [S18](#s18) |
| d-a1-32.lines[0] | سطر حوار ألماني وترجمته | المتحدث: `Lena`<br>`Entschuldigung, wo ist die Post?`<br>↔ `معذرةً، أينَ مكتبُ البريد؟` | سليم | السؤال يطلب موقع die Post، وترجمة مكتب البريد تحدد المؤسسة لا البريد المرسل؛ القراءة السياقية مناسبة للطريق. | لا تعديل. | [S11](#s11), [S18](#s18) |
| d-a1-32.lines[1] | سطر حوار ألماني وترجمته | المتحدث: `Passant`<br>`Gehen Sie geradeaus bis zur Ampel.`<br>↔ `امشِ مباشرةً حتى الإشارة.` | سليم | التوجيه مستقيم حتى Ampel. «الإشارة» مختصر مفهوم في سياق الاتجاهات؛ «إشارة المرور» أوضح، لكن لا يثبت أن الترجمة الحالية خاطئة. | لا تعديل؛ تُسجل الوضوح ملاحظة لا خطأ مؤكداً. | [S7](#s7), [S8](#s8), [S9](#s9) |
| d-a1-32.lines[2] | سطر حوار ألماني وترجمته | المتحدث: `Lena`<br>`Und dann?`<br>↔ `ثمَّ؟` | سليم | Und dann? جواب متابعة قصير بعد تعليمات الطريق، وترجمة «ثم؟» تؤدي الوظيفة نفسها. | لا تعديل. | [S9](#s9) |
| d-a1-32.lines[3] | سطر حوار ألماني وترجمته | المتحدث: `Passant`<br>`Dann rechts. Die Post ist neben der Bank.`<br>↔ `ثمَّ يميناً. البريدُ بجانبِ البنك.` | سليم | Dann rechts تقابل «ثم يميناً»، وneben der Bank تقابل «بجانب البنك». استعمال Dativ بعد neben هنا صحيح لأنه يصف موقعاً ثابتاً لا حركة إلى جوار البنك. | لا تعديل. | [S9](#s9), [S10](#s10), [S11](#s11), [S12](#s12), [S13](#s13), [S14](#s14) |
| d-a1-32.lines[4] | سطر حوار ألماني وترجمته | المتحدث: `Lena`<br>`Ist das weit?`<br>↔ `أهوَ بعيد؟` | سليم | Ist das weit سؤال عن البعد؛ «أهو بعيد؟» يحفظ المعنى. | لا تعديل. | [S15](#s15) |
| d-a1-32.lines[5] | سطر حوار ألماني وترجمته | المتحدث: `Passant`<br>`Nein, fünf Minuten zu Fuß.`<br>↔ `لا، خمسُ دقائقَ مشياً.` | سليم | fünf Minuten zu Fuß تعني خمس دقائق مشياً؛ الترجمة لا تضيف وسيلة نقل أو نقطة بداية غير مذكورة. | لا تعديل. | [S16](#s16), [S17](#s17) |
| d-a1-32-q1 | سؤال فهم: الموجه والخيارات والمفتاح والشرح | **type:** `mc`<br>**promptDe:** `Wo ist die Post?`<br>**promptAr:** `اختر الإجابة الصحيحة حسب الحوار.`<br>**options:** an der Ampel، fünf Minuten geradeaus, dann links، neben der Bank<br>**answer:** `neben der Bank`<br>**explanationAr:** الدليل: «Die Post ist neben der Bank». الفخّ 1: الإشارة نقطة الانعطاف. الفخّ 2: «rechts» لا «links».<br>**falle:** غير موجود | سليم | المفتاح «neben der Bank» يقتبس المعلومة الصريحة. الإشارة نقطة انعطاف لا موقع البريد؛ والخيار الثالث يبدل الاتجاه إلى links رغم أن النص يقول rechts. التفسير يوافق الحوار. | لا تعديل. | [S7](#s7), [S8](#s8), [S9](#s9), [S10](#s10), [S11](#s11), [S12](#s12), [S13](#s13), [S14](#s14), [S15](#s15) |
| d-a1-32-q2 | سؤال إكمال: الموجه والإجابة والشرح | **type:** `fill`<br>**promptDe:** `Gehen Sie ___ bis zur Ampel.`<br>**promptAr:** `أكمل الفراغ بالكلمة المناسبة من الحوار.`<br>**options:** <br>**answer:** `geradeaus`<br>**explanationAr:** geradeaus = إلى الأمامِ مباشرة.<br>**falle:** غير موجود | سليم | الفراغ في «Gehen Sie ___ bis zur Ampel» يتطلب geradeaus؛ المفردة واردة في السطر ومطابقة للترجمة «إلى الأمام». | لا تعديل. | [S7](#s7), [S8](#s8), [S9](#s9) |
| d-a1-32.dictation[0] | جملة إملاء | `Entschuldigung, wo ist die Post?` | سليم | جملة كاملة مطابقة للسطر الحواري الأول. | لا تعديل. | [S11](#s11), [S18](#s18) |
| d-a1-32.dictation[1] | جملة إملاء | `Gehen Sie geradeaus bis zur Ampel.` | سليم | جملة كاملة مطابقة لتعليمة الاتجاه في السطر الثاني. | لا تعديل. | [S7](#s7), [S8](#s8), [S9](#s9) |
| d-a1-32.dictation[2] | جملة إملاء | `Dann rechts. Die Post ist neben der Bank.` | سليم | جملة كاملة مطابقة للسطر الرابع، وتحفظ يميناً وموقع البريد بجانب البنك. | لا تعديل. | [S10](#s10), [S11](#s11), [S12](#s12), [S13](#s13), [S14](#s14) |

## المصادر المنشورة

استُخدمت القواميس لإسناد المقابلات المعجمية، والمصادر التعليمية/النحوية لتفسير الاستعمال. قائمة Goethe مرجع كلمات فحسب؛ لا تُستخدم لإعادة تقييم CEFR هنا.

<a id="s1"></a>S1 — [PONS — Termin (German–Arabic)](https://en.pons.com/translate/german-arabic/Termin). يعطي Termin = موعد؛ يثبت معنى موعد Rami واسم الموعد في السؤال.
<a id="s2"></a>S2 — [Duden — Schreibung von Uhrzeitangaben](https://www.duden.de/sprachwissen/sprachratgeber/Uhrzeitangaben). يذكر um drei Uhr أو um fünfzehn Uhr؛ يوضح أن الساعة المفردة لا تصرح صباحاً/مساءً بذاتها.
<a id="s3"></a>S3 — [PONS — Name (German–Arabic)](https://en.pons.com/translate/german-arabic/Name). يعطي Name = اسم؛ يسند السؤال عن اسم Rami.
<a id="s4"></a>S4 — [Duden — buchstabieren](https://www.duden.de/rechtschreibung/buchstabieren). يعرف buchstabieren بأنه ذكر أحرف الكلمة واحداً واحداً وبالترتيب، ويعطي مثالاً على تهجئة الاسم؛ لا يحدد أسلوب نقله الصوتي إلى العربية.
<a id="s5"></a>S5 — [PONS — Wartezimmer (German–Arabic)](https://en.pons.com/translate/german-arabic/Wartezimmer). يعطي Wartezimmer = غرفة الانتظار.
<a id="s6"></a>S6 — [PONS — Platz nehmen (German spelling dictionary)](https://en.pons.com/translate/dictionary-of-german-spelling/Platz+nehmen). يشرح Nehmen Sie bitte Platz = Setzen Sie sich bitte، ويورد مثال «Bitte nehmen Sie im Wartezimmer Platz».
<a id="s7"></a>S7 — [Langenscheidt — Ampel (German–Arabic)](https://en.langenscheidt.com/german-arabic/ampel). يعطي Ampel = إشارة ضوئية؛ يدعم قراءة نقطة الطريق على أنها إشارة مرور.
<a id="s8"></a>S8 — [PONS — geradeaus (German–Arabic)](https://en.pons.com/translate/german-arabic/geradeaus). يعطي geradeaus = إلى الأمام؛ يسند الاتجاه المستقيم في السطر وخيار الإكمال.
<a id="s9"></a>S9 — [Goethe-Institut — Köln: Wegbeschreibung (Arbeitsblätter)](https://lernen.goethe.de/media/iwb/Arbeitsblaetter_Koeln_Wegbeschreibung.pdf). نموذج رسمي لتوجيهات الطريق: geradeaus ثم شارع إلى اليسار/اليمين؛ يسند تسلسل الاتجاهات والسياق لا حقيقة مكانية.
<a id="s10"></a>S10 — [PONS — rechts (German–Arabic)](https://en.pons.com/translate/german-arabic/rechts). يعطي rechts = يميناً/إلى اليمين؛ يثبت تعليمات الاتجاه.
<a id="s11"></a>S11 — [PONS — Postamt (German–Arabic)](https://en.pons.com/translate/german-arabic/Postamt). يعطي Postamt = مكتب بريد؛ مع سياق السؤال عن موقع die Post يدعم «مكتب البريد».
<a id="s12"></a>S12 — [PONS — Bank (German–Arabic)](https://en.pons.com/translate/german-arabic/Bank). يفصل Bank بمعنى المؤسسة المالية عن Bank بمعنى مقعد؛ سياق مكان البريد والترجمة «البنك» يرجح المعنى المالي.
<a id="s13"></a>S13 — [PONS — neben (German–Arabic)](https://en.pons.com/translate/german-arabic/neben). يعطي neben (örtlich) = بجانب؛ يسند تحديد موقع مكتب البريد.
<a id="s14"></a>S14 — [Deutsche Grammatik 2.0 — lokale Bedeutung von neben](https://deutschegrammatik20.de/praepositionen/die-bedeutung-der-prapositionen-ubersicht/die-bedeutung-der-prapositionen-neben/). يفرق بين موقع wo مع neben + Dativ واتجاه wohin مع neben + Akkusativ؛ في «neben der Bank» وصف لموقع ثابت.
<a id="s15"></a>S15 — [PONS — weit (German–Arabic)](https://en.pons.com/translate/german-arabic/weit). يعطي weit بمعنى entfernt = بعيد؛ يسند سؤال هل المكان بعيد.
<a id="s16"></a>S16 — [PONS — zu Fuß (German–Arabic)](https://en.pons.com/translate/german-arabic/zu+Fu%C3%9F). يعطي zu Fuß = على القدمين/مشياً؛ يسند تقدير زمن المسير.
<a id="s17"></a>S17 — [PONS — Minute (German–Arabic)](https://en.pons.com/translate/german-arabic/Minute). يعطي Minute = دقيقة؛ يسند «خمس دقائق».
<a id="s18"></a>S18 — [Goethe-Institut — Goethe-Zertifikat A1 Start Deutsch 1 Wortliste (PDF)](https://www.goethe.de/pro/relaunch/prf/de/A1_SD1_Wortliste_02.pdf). قائمة مفردات رسمية تتضمن Termin وPost والوقت ومفردات الاتجاه؛ تستخدم هنا مرجعاً للكلمات الواردة فقط، لا لإعادة تقييم CEFR أو اعتماد المستوى.

## الحدود

مراجعة مساعد ذكاء اصطناعي مدعومة بمصادر منشورة، لا اعتماداً مهنياً ولا مراجعة بشرية. المستوى المخزن كما هو. لم أعدل `content/dialogues.json` لعدم ثبوت خطأ يستلزم التغيير؛ الأصول الصوتية فُحصت ملفاتها وأحجامها فقط.
