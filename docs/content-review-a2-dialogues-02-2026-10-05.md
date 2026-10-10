# مراجعة الحوارات A2 — الدفعة 02

**التاريخ:** 2026-10-05
**النطاق:** `d-a2-01`–`d-a2-03` من السجل الحي؛ فجوة A1 `d-a1-28`–`d-a1-30` تبقى منفصلة وغير محسومة ولا يُستدل عليها من `d-a1-31`–`d-a1-32`.

## التغطية والحكم

- **38 وحدة**: 3 بيانات حوار، 20 سطراً مع الترجمة، 6 أسئلة بجميع حقولها، و9 جمل إملاء؛ وفُحصت ملفات الصوت الثلاثة وجوداً وحجماً.
- أحكام العناصر: **36 سليمة؛ تصحيحان مؤكدان؛ 0 غير محسوم**. لا تعني هذه النتيجة مراجعة بقية حوارات A2 أو بقية المستويات.
- `d-a2-01-q1`: عُدل شرح العدد الترتيبي من صيغة مستقلة مكتوبة بحرف صغير إلى المثال السياقي `am zwölften Juli = في اليوم الثاني عشر من يوليو.`؛ يذكر Duden أن العدد الصغير وصفي قبل الاسم، والمستقل يكتب كبيراً ([S10](#s10), [S11](#s11)).
- `d-a2-02.lines[1]`: أضيفت «شكراً» المقابلة لـ`danke` التي كانت ساقطة من الترجمة ([S26](#s26), [S27](#s27)).
- لا تعديل لبقية الأسطر أو الأسئلة أو الإملاء. الترجمة الحرفية المفهومة لـ`Guten Tag`، ومشتتات الأسئلة، ومقطع الإملاء القصير، لم تُحوّل إلى أخطاء بلا دليل.

## التصحيحات المؤكدة

1. **`d-a2-01-q1`**: بقي المفتاح `zwölften` كما هو؛ اقتصر الإصلاح على الشرح، لأن `am zwölften Juli` وصفٌ للاسم التالي ويأخذ الحرف الصغير، بينما المثال المستقل `der Zwölfte` يُكتب بحرف كبير. الشرح الجديد يطابق نص سؤال العودة ([S10](#s10), [S11](#s11)).
2. **`d-a2-02.lines[1]`**: الترجمة القديمة «بخير» أسقطت `danke`؛ PONS يسند `Gut` = أنا بخير و`danke` = شكراً. أصبح السطر «أهلاً مهدي! بخير، شكراً. ما الجديد؟» ([S26](#s26), [S27](#s27), [S28](#s28)).

## المقارنة التاريخية المحدودة

عُثر في `scripts/patches/a_dialog_fallen.py` على ثلاثة سجلات أسئلة مطابقة بالمعرّف فقط. الملف سجل تحرير للمشتتات، لا مرجع لغوي ولا نسخة كاملة للحوار. اختلاف المشتت أو ترتيبه لا يثبت خطأً وحده؛ لا يوجد في الملفات المفحوصة خط أساس تاريخي مطابق للعناوين والأسطر والإملاء.

| المعرّف | السجل في ملف المشتتات | الحي | الحكم |
|---|---|---|---|
| `d-a2-01-q2` | neben dem Reisebüro؛ im Zentrum, gegenüber vom Bahnhof؛ in München am Stadtrand<br>المفتاح: `im Zentrum, gegenüber vom Bahnhof` | neben dem Bahnhof in München؛ in München am Stadtrand؛ im Zentrum, gegenüber vom Bahnhof<br>المفتاح: `im Zentrum, gegenüber vom Bahnhof` | في السجل التاريخي استُبدل مشتت «neben dem Reisebüro» في النسخة الحية بـ«neben dem Bahnhof in München»، وتغير ترتيب خيارَي المركز/أطراف المدينة؛ بقي المفتاح نفسه. الاختلاف وحده لا يثبت خطأً. |
| `d-a2-02-q1` | seinen Geburtstag؛ eine Party am Samstag um acht؛ den Geburtstag von Selma<br>المفتاح: `seinen Geburtstag` | seinen Geburtstag؛ eine Party am Samstag um acht؛ den Geburtstag von Selma<br>المفتاح: `seinen Geburtstag` | الخيارات والمفتاح متطابقة بين سجل المشتتات والحي. |
| `d-a2-03-q2` | dreimal am Tag؛ zweimal am Tag؛ drei Tage lang einmal<br>المفتاح: `dreimal am Tag` | zweimal am Tag؛ dreimal am Tag؛ drei Tage lang einmal<br>المفتاح: `dreimal am Tag` | تغير ترتيب الخيارات فقط؛ بقيت المجموعة والمفتاح، فلا يصنف الترتيب وحده خطأً. |

## فحص الصوت

| الحوار | الملف | الحجم في البيان | الحجم الفعلي | الوجود | الصوت/عدد الأصوات في البيان |
|---|---|---:|---:|---|---|
| `d-a2-01` | `/audio/dialog/d-a2-01.mp3` | 162065 | 162065 | نعم | `voice-01+voice-02` / 2 |
| `d-a2-02` | `/audio/dialog/d-a2-02.mp3` | 148708 | 148708 | نعم | `voice-01+voice-02` / 2 |
| `d-a2-03` | `/audio/dialog/d-a2-03.mp3` | 181726 | 181726 | نعم | `voice-01+voice-02` / 2 |

التحقق مقتصر على وجود الملف ومطابقة الحجم؛ لم يُستمع إلى الصوت ولم تُراجع المطابقة الصوتية.

## سجل كل عنصر

| المعرّف | النوع | اللقطة الحية بعد المراجعة | الحكم | الدليل والحيثية | الإجراء | المصادر |
|---|---|---|---|---|---|---|
| `d-a2-01` | بيانات الحوار: العنوان والمستوى والبنية | العنوان: `Im Reisebüro` / في مكتب السفر<br>المستوى المخزن: `A2`؛ الأسطر/الأسئلة/الإملاء 6/2/3؛ waisen: False | **سليم** | Im Reisebüro يقابل «في مكتب السفر». البنية الحية: 6 أسطر وسؤالان و3 جمل إملاء؛ وسم A2 محفوظ كما هو ولا يعاد تقييم CEFR. | لا تعديل. | [S2](#s2), [S5](#s5) |
| `d-a2-01.lines[0]` | سطر حوار ألماني وترجمته | المتحدث `Kundin`<br>DE: `Guten Tag. Ich möchte im Juli nach München fahren.`<br>AR: طاب يومكم. أريد السفر إلى ميونخ في يوليو. | **سليم** | Ich möchte … nach München fahren تنقل رغبة السفر إلى ميونخ في يوليو. PONS يسند möchte وfahren واسم المدينة والشهر. Guten Tag تحية عامة؛ «طاب يومكم» مفهوم ولا يضيف وقتاً محدداً. | لا تعديل. | [S1](#s1), [S3](#s3), [S4](#s4), [S5](#s5), [S6](#s6) |
| `d-a2-01.lines[1]` | سطر حوار ألماني وترجمته | المتحدث `Agent`<br>DE: `Gern. Hin- und Rückfahrkarte?`<br>AR: بكل سرور. تذكرة ذهاب وإياب؟ | **سليم** | Gern تقابل «بكل سرور»، وHin- und Rückfahrkarte تذكرة ذهاب وإياب؛ السؤال والترجمة يحفظان الاستفهام. | لا تعديل. | [S7](#s7), [S8](#s8), [S9](#s9) |
| `d-a2-01.lines[2]` | سطر حوار ألماني وترجمته | المتحدث `Kundin`<br>DE: `Ja, hin am fünften, zurück am zwölften Juli.`<br>AR: نعم، الذهاب في الخامس والعودة في الثاني عشر من يوليو. | **سليم** | تحدد الجملة الذهاب في الخامس والعودة في الثاني عشر من يوليو. صيغة am zwölften Juli صفةٌ قبل اسم فتبقى صغيرة؛ ترتيب التاريخ في الألمانية والعربية متوافق. | لا تعديل. | [S5](#s5), [S9](#s9), [S10](#s10), [S11](#s11) |
| `d-a2-01.lines[3]` | سطر حوار ألماني وترجمته | المتحدث `Agent`<br>DE: `Der Zug kostet achtzig Euro pro Person.`<br>AR: القطار بثمانين يورو للشخص. | **سليم** | Der Zug = القطار؛ kostet achtzig Euro pro Person يثبت السعر لكل شخص. الترجمة «القطار بثمانين يورو للشخص» أمينة للمعنى. | لا تعديل. | [S12](#s12), [S13](#s13), [S14](#s14) |
| `d-a2-01.lines[4]` | سطر حوار ألماني وترجمته | المتحدث `Kundin`<br>DE: `Gut. Können Sie auch ein Hotel reservieren?`<br>AR: جيد. هل يمكنكم حجز فندق أيضاً؟ | **سليم** | Können Sie … reservieren? سؤال مهذب عن إمكان حجز فندق أيضاً؛ المقابلات العربية تحفظ الطلب والمعنى. | لا تعديل. | [S15](#s15), [S16](#s16), [S17](#s17) |
| `d-a2-01.lines[5]` | سطر حوار ألماني وترجمته | المتحدث `Agent`<br>DE: `Natürlich. Ein Doppelzimmer im Zentrum, gegenüber vom Bahnhof.`<br>AR: بالطبع. غرفة مزدوجة في الوسط، مقابل المحطة. | **سليم** | Doppelzimmer im Zentrum, gegenüber vom Bahnhof = غرفة مزدوجة في وسط المدينة مقابل المحطة. «مقابل» يطابق gegenüber، ولا يخلطها بـneben. | لا تعديل. | [S18](#s18), [S19](#s19), [S20](#s20), [S21](#s21) |
| `d-a2-01-q1` | سؤال إكمال وشرح كتابة العدد الترتيبي | النوع `fill`<br>DE: `Rückfahrt am ___ Juli.`<br>AR: أكمل الفراغ بالكلمة المناسبة من الحوار.<br>الخيارات: لا خيارات<br>المفتاح: `zwölften؛ 12.`<br>الشرح الحي: am zwölften Juli = في اليوم الثاني عشر من يوليو.<br>**قبل:** explanationAr: der zwölfte = الثاني عشر. | **مُصحح** | الإجابة zwölften صحيحة في السياق am zwölften Juli؛ Duden يكتب العدد الترتيبي صغيراً قبل الاسم، وكبيراً إذا استقل اسماً مثل der Zwölfte. الشرح السابق عرض المثال مستقلاً بصيغة der zwölfte، فكان الحرف صغيراً خطأً في ذلك السياق؛ استُبدل بمثال الحوار نفسه لتفادي الالتباس. | استُبدل الشرح بـam zwölften Juli = في اليوم الثاني عشر من يوليو؛ لم يتغير المفتاح أو السؤال. | [S10](#s10), [S11](#s11), [S5](#s5) |
| `d-a2-01-q2` | سؤال اختيار من متعدد ومشتتاته | النوع `mc`<br>DE: `Wo ist das Hotel?`<br>AR: اختر الإجابة الصحيحة حسب الحوار.<br>الخيارات: neben dem Bahnhof in München؛ in München am Stadtrand؛ im Zentrum, gegenüber vom Bahnhof<br>المفتاح: `im Zentrum, gegenüber vom Bahnhof`<br>الشرح الحي: الدليل: «Ein Doppelzimmer im Zentrum, gegenüber vom Bahnhof». الفخّ 1: «neben» ≠ «gegenüber». الفخّ 2: ميونيخ صحيحة لكن «Stadtrand» يناقض «Zentrum». | **سليم** | المفتاح im Zentrum, gegenüber vom Bahnhof يطابق السطر. neben يصف المجاورة لا المقابلة، وStadtrand يناقض Zentrum؛ المشتتات لا تغيّر المفتاح الصحيح. | لا تعديل. | [S18](#s18), [S19](#s19), [S20](#s20), [S21](#s21), [S62](#s62), [S63](#s63) |
| `d-a2-01.dictation[0]` | جملة إملاء | `Ich möchte im Juli nach München fahren.` | **سليم** | الجملة تطابق سطر الحوار الأول حرفياً وتحفظ الرغبة والسفر والشهر والوجهة. | لا تعديل. | [S3](#s3), [S4](#s4), [S5](#s5), [S6](#s6) |
| `d-a2-01.dictation[1]` | جملة إملاء | `Der Zug kostet achtzig Euro pro Person.` | **سليم** | الجملة تطابق سطر السعر حرفياً؛ Zug وkosten وpro Person منقولة دون تغيير للمبلغ أو وحدة الشخص. | لا تعديل. | [S12](#s12), [S13](#s13), [S14](#s14) |
| `d-a2-01.dictation[2]` | جملة إملاء | `Ein Doppelzimmer im Zentrum.` | **سليم** | مقطع إملاء حرفي من جواب الوكيل «Ein Doppelzimmer im Zentrum …»؛ استعماله كعبارة جوابية قصيرة ملائم للسياق. | لا تعديل. | [S18](#s18), [S19](#s19) |
| `d-a2-02` | بيانات الحوار: العنوان والمستوى والبنية | العنوان: `Am Telefon: Einladung` / على الهاتف: دعوة<br>المستوى المخزن: `A2`؛ الأسطر/الأسئلة/الإملاء 7/2/3؛ waisen: False | **سليم** | Am Telefon: Einladung = «على الهاتف: دعوة». البنية: 7 أسطر وسؤالان و3 جمل إملاء؛ وسم A2 مخزّن كما هو، لا حكم جديداً على CEFR. | لا تعديل. | [S22](#s22), [S23](#s23) |
| `d-a2-02.lines[0]` | سطر حوار ألماني وترجمته | المتحدث `Mehdi`<br>DE: `Hallo Selma, hier ist Mehdi. Wie geht's?`<br>AR: مرحباً سلمى، مهدي معك. كيف حالك؟ | **سليم** | Hallo تحية، وWie geht's? تقابل «كيف حالك؟»؛ «مهدي معك» صياغة عربية طبيعية لافتتاح المكالمة hier ist Mehdi. | لا تعديل. | [S22](#s22), [S24](#s24), [S25](#s25) |
| `d-a2-02.lines[1]` | سطر حوار ألماني وترجمته | المتحدث `Selma`<br>DE: `Hi Mehdi! Gut, danke. Was gibt's Neues?`<br>AR: أهلاً مهدي! بخير، شكراً. ما الجديد؟<br>**قبل:** ar: أهلاً مهدي! بخير. ما الجديد؟ | **مُصحح** | Gut تقابل «بخير» وWas gibt's Neues? تقابل «ما الجديد؟»، لكن الترجمة الحية أسقطت danke = «شكراً». هذا نقص دلالي مؤكد، لا تفضيل أسلوبي. | أُضيفت «شكراً» بعد «بخير»؛ بقية الترجمة باقية. | [S26](#s26), [S27](#s27), [S28](#s28) |
| `d-a2-02.lines[2]` | سطر حوار ألماني وترجمته | المتحدث `Mehdi`<br>DE: `Am Samstag feiere ich meinen Geburtstag. Kommst du?`<br>AR: يوم السبت أحتفل بعيد ميلادي. هل تأتين؟ | **سليم** | Am Samstag feiere ich meinen Geburtstag تنقل السبت والاحتفال بعيد المتكلم؛ Kommst du? ترجمت «هل تأتين؟» على مخاطبة Selma المؤنثة. | لا تعديل. | [S29](#s29), [S30](#s30), [S31](#s31), [S32](#s32) |
| `d-a2-02.lines[3]` | سطر حوار ألماني وترجمته | المتحدث `Selma`<br>DE: `Oh, gern! Wann beginnt die Party?`<br>AR: أوه، بكل سرور! متى تبدأ الحفلة؟ | **سليم** | Oh, gern! جواب قبول، وWann beginnt die Party? سؤال عن وقت بدء الحفلة؛ الترجمة تحفظ المعنى. | لا تعديل. | [S7](#s7), [S33](#s33), [S34](#s34) |
| `d-a2-02.lines[4]` | سطر حوار ألماني وترجمته | المتحدث `Mehdi`<br>DE: `Um achtzehn Uhr bei mir zu Hause.`<br>AR: في السادسة مساءً عندي في البيت. | **سليم** | Um achtzehn Uhr = الساعة 18:00 (السادسة مساءً)، وbei mir zu Hause = عندي في البيت؛ الترجمة صحيحة. تحويل 18:00 إلى السادسة مساءً حساب نظام 24 ساعة، لا ادعاء لغوي إضافي. | لا تعديل. | [S35](#s35), [S36](#s36) |
| `d-a2-02.lines[5]` | سطر حوار ألماني وترجمته | المتحدث `Selma`<br>DE: `Super. Soll ich etwas mitbringen?`<br>AR: رائع. هل أحضر شيئاً معي؟ | **سليم** | Soll ich etwas mitbringen? سؤال عمّا إذا كان ينبغي إحضار شيء؛ «هل أحضر شيئاً معي؟» يحفظ modal sollen والفعل المنفصل mitbringen. | لا تعديل. | [S37](#s37), [S38](#s38) |
| `d-a2-02.lines[6]` | سطر حوار ألماني وترجمته | المتحدث `Mehdi`<br>DE: `Nur gute Laune!`<br>AR: مزاجاً جيداً فقط! | **سليم** | Nur gute Laune! = مزاج جيد فقط؛ يقابل النقل الحرفي المقصود في ختام الدعوة ولا يضيف غرضاً آخر. | لا تعديل. | [S39](#s39), [S40](#s40) |
| `d-a2-02-q1` | سؤال فهم واختيار من متعدد | النوع `mc`<br>DE: `Was feiert Mehdi?`<br>AR: اختر الإجابة الصحيحة حسب الحوار.<br>الخيارات: seinen Geburtstag؛ eine Party am Samstag um acht؛ den Geburtstag von Selma<br>المفتاح: `seinen Geburtstag`<br>الشرح الحي: الدليل: «Am Samstag feiere ich meinen Geburtstag». الفخّ 1: الحفلة في «achtzehn Uhr» لا الثامنة. الفخّ 2: عيد ميلاد مهدي لا سلمى. | **سليم** | المفتاح seinen Geburtstag يطابق Am Samstag feiere ich meinen Geburtstag. المشتت الذي يذكر um acht لا يطابق 18 Uhr؛ يظل الفرق في وقت البدء واضحاً ولا يغير المفتاح. | لا تعديل. | [S29](#s29), [S30](#s30), [S31](#s31), [S35](#s35) |
| `d-a2-02-q2` | سؤال إكمال وشرح الفعل المنفصل | النوع `fill`<br>DE: `Soll ich etwas ___?`<br>AR: أكمل الفراغ بالكلمة المناسبة من الحوار.<br>الخيارات: لا خيارات<br>المفتاح: `mitbringen`<br>الشرح الحي: mitbringen = أحضر معي. | **سليم** | المفتاح mitbringen يكمّل Soll ich etwas …?، ويحفظ معنى إحضار شيء مع المتكلم؛ الشرح العربي صحيح. | لا تعديل. | [S37](#s37), [S38](#s38) |
| `d-a2-02.dictation[0]` | جملة إملاء | `Am Samstag feiere ich meinen Geburtstag.` | **سليم** | تطابق جملة الحوار عن الاحتفال بعيد الميلاد حرفياً. | لا تعديل. | [S29](#s29), [S30](#s30), [S31](#s31) |
| `d-a2-02.dictation[1]` | جملة إملاء | `Um achtzehn Uhr bei mir zu Hause.` | **سليم** | تطابق الجملة التي تحدد 18 Uhr وbei mir zu Hause؛ لا خطأ في الصياغة الألمانية. | لا تعديل. | [S35](#s35), [S36](#s36) |
| `d-a2-02.dictation[2]` | جملة إملاء | `Soll ich etwas mitbringen?` | **سليم** | تطابق سؤال Selma عن إحضار شيء؛ علامة الاستفهام والفعل المنفصل محفوظان. | لا تعديل. | [S37](#s37), [S38](#s38) |
| `d-a2-03` | بيانات الحوار: العنوان والمستوى والبنية | العنوان: `Beim Arzt` / عند الطبيب<br>المستوى المخزن: `A2`؛ الأسطر/الأسئلة/الإملاء 7/2/3؛ waisen: False | **سليم** | Beim Arzt = «عند الطبيب». البنية: 7 أسطر وسؤالان و3 جمل إملاء؛ المستوى A2 قيمة مخزنة لا يعاد تقييمها. | لا تعديل. | [S41](#s41) |
| `d-a2-03.lines[0]` | سطر حوار ألماني وترجمته | المتحدث `Arzt`<br>DE: `Guten Tag. Was fehlt Ihnen?`<br>AR: طاب يومكم. ماذا بك؟ | **سليم** | Was fehlt Ihnen? سؤال عن العارض/ما بالمريض. «طاب يومكم» ترجمة حرفية مفهومة لـGuten Tag؛ لا يظهر خطأ معنى مثبت، فلا تعديل. | لا تعديل. | [S1](#s1), [S42](#s42) |
| `d-a2-03.lines[1]` | سطر حوار ألماني وترجمته | المتحدث `Patient`<br>DE: `Seit drei Tagen tut mir der Hals weh, und ich habe Fieber.`<br>AR: منذ ثلاثة أيام يؤلمني حلقي وعندي حُمّى. | **سليم** | Seit drei Tagen تعني منذ ثلاثة أيام؛ tut mir der Hals weh يصف ألماً في الحلق، وFieber = حمّى. الترجمة العربية تحفظ المدة والعارضين. | لا تعديل. | [S43](#s43), [S44](#s44), [S45](#s45), [S46](#s46), [S48](#s48) |
| `d-a2-03.lines[2]` | سطر حوار ألماني وترجمته | المتحدث `Arzt`<br>DE: `Haben Sie auch Husten?`<br>AR: هل لديك سعال أيضاً؟ | **سليم** | Husten = سعال؛ سؤال الطبيب والترجمة «هل لديك سعال أيضاً؟» متوافقان. | لا تعديل. | [S47](#s47) |
| `d-a2-03.lines[3]` | سطر حوار ألماني وترجمته | المتحدث `Patient`<br>DE: `Ja, ein bisschen. Und ich bin sehr müde.`<br>AR: نعم، قليلاً. وأنا متعب جداً. | **سليم** | ein bisschen = قليلاً وsehr müde = متعب جداً؛ الترجمة تحفظ المقدار والصفة. | لا تعديل. | [S49](#s49), [S50](#s50) |
| `d-a2-03.lines[4]` | سطر حوار ألماني وترجمته | المتحدث `Arzt`<br>DE: `Ich schreibe Ihnen ein Rezept. Nehmen Sie die Medizin dreimal am Tag.`<br>AR: سأكتب لك وصفة. خذ الدواء ثلاث مرات يومياً. | **سليم** | الترجمة تقابل كتابة وصفة وأخذ الدواء ثلاث مرات يومياً. هذا فحص لغوي فقط؛ لا يقيّم سلامة نصيحة علاجية أو جرعة طبية. | لا تعديل. | [S51](#s51), [S52](#s52), [S53](#s53), [S54](#s54) |
| `d-a2-03.lines[5]` | سطر حوار ألماني وترجمته | المتحدث `Patient`<br>DE: `Danke. Muss ich zu Hause bleiben?`<br>AR: شكراً. هل يجب أن أبقى في البيت؟ | **سليم** | Danke = شكراً؛ Muss ich …? = هل يجب عليّ…؟، وzu Hause bleiben = البقاء في البيت؛ الترجمة العربية تحفظ العناصر الثلاثة. | لا تعديل. | [S27](#s27), [S55](#s55), [S36](#s36), [S56](#s56) |
| `d-a2-03.lines[6]` | سطر حوار ألماني وترجمته | المتحدث `Arzt`<br>DE: `Ja, zwei Tage. Trinken Sie viel Tee!`<br>AR: نعم، يومين. اشرب شاياً كثيراً! | **سليم** | Trinken Sie viel Tee! تعني اشرب شاياً كثيراً؛ الصيغة العربية تحفظ الأمر والكمية والمشروب. | لا تعديل. | [S57](#s57), [S58](#s58), [S59](#s59), [S60](#s60), [S61](#s61) |
| `d-a2-03-q1` | سؤال إكمال وشرح المفردة | النوع `fill`<br>DE: `Seit drei Tagen tut ihm der ___ weh.`<br>AR: أكمل الفراغ بالكلمة المناسبة من الحوار.<br>الخيارات: لا خيارات<br>المفتاح: `Hals`<br>الشرح الحي: der Hals = الحلق. | **سليم** | المفتاح Hals يطابق موضع الألم في الجملة؛ tut ihm weh تركيب الألم نفسه مع ضمير الغائب، أما الحوار فيستعمل tut mir weh للمتكلم. الشرح Hals = الحلق ملائم للسياق. | لا تعديل. | [S43](#s43), [S44](#s44), [S45](#s45), [S46](#s46) |
| `d-a2-03-q2` | سؤال فهم واختيار من متعدد | النوع `mc`<br>DE: `Wie oft soll er die Medizin nehmen?`<br>AR: اختر الإجابة الصحيحة حسب الحوار.<br>الخيارات: zweimal am Tag؛ dreimal am Tag؛ drei Tage lang einmal<br>المفتاح: `dreimal am Tag`<br>الشرح الحي: الدليل: «Nehmen Sie die Medizin dreimal am Tag». الفخّ 1: «zwei» هو أيام البقاء في البيت. الفخّ 2: «drei Tage» مدّة ألم الحلق. | **سليم** | المفتاح dreimal am Tag يطابق تكرار أخذ الدواء؛ PONS يورد المقابل dreimal täglich. يميز الشرح بين عدد المرات وبين يومي البقاء ومدة الأعراض. | لا تعديل. | [S52](#s52), [S53](#s53), [S54](#s54) |
| `d-a2-03.dictation[0]` | جملة إملاء | `Seit drei Tagen tut mir der Hals weh.` | **سليم** | تطابق جملة المريض عن ألم الحلق منذ ثلاثة أيام حرفياً. | لا تعديل. | [S43](#s43), [S44](#s44), [S45](#s45), [S46](#s46) |
| `d-a2-03.dictation[1]` | جملة إملاء | `Nehmen Sie die Medizin dreimal am Tag.` | **سليم** | تطابق تعليمات الطبيب في النص الحي حرفياً؛ التقرير لا يقيّم مضمونها كإرشاد طبي. | لا تعديل. | [S52](#s52), [S53](#s53), [S54](#s54) |
| `d-a2-03.dictation[2]` | جملة إملاء | `Trinken Sie viel Tee!` | **سليم** | تطابق أمر شرب الشاي حرفياً؛ مفردات الفعل والكمية والمشروب موثقة. | لا تعديل. | [S57](#s57), [S58](#s58), [S59](#s59) |

## الحدود

- هذه مراجعة مساعد ذكاء اصطناعي مدعومة بمصادر منشورة؛ ليست مراجعة بشرية أو اعتماداً مهنياً.
- قيم المستوى A2 بقيت كما خُزنت؛ لم يُعد تقييم CEFR ولم تُعدّل النسبة أو طريقة حساب المستوى.
- حوار الطبيب راجع لغوياً فقط؛ لا يثبت هذا التقرير سلامة نصيحة علاجية ولا يقدم اعتماداً أو استشارة سريرية.
- فحص الصوت اقتصر على وجود ملفات MP3 وتطابق حجم كل ملف مع البيان؛ لم يُستمع إليها ولم تُقارن بالكلام سطراً بسطراً.
- المقارنة التاريخية محصورة بثلاثة سجلات أسئلة في scripts/patches/a_dialog_fallen.py؛ لم يُعثر في الملفات المفحوصة على خط أساس تاريخي كامل للعناوين والأسطر والإملاء، ولا يُعمّم الغياب على تاريخ Git قبل نقطة الأساس shallow.
- فجوة d-a1-28–d-a1-30 باقية منفصلة وغير محسومة؛ لم يُنشأ لها محتوى بديل ولم تُستخدم d-a1-31–d-a1-32 لتخمينها.

## المصادر المنشورة

تُستخدم القواميس والقواعد لإسناد الحكم اللغوي؛ لا تعيد هذه الصفحات تقييم المستوى، ولا تمثل الفحوص الآلية اعتماداً مهنياً.

<a id="s1"></a>S1 — [PONS — Guten Tag (German–Arabic)](https://en.pons.com/translate/german-arabic/Guten+Tag). يعرض «مرحباً» و«نهارك سعيد» مقابلاتٍ للتحية Guten Tag؛ لا يخصصها للمساء.
<a id="s2"></a>S2 — [PONS — Reisebüro (German–Arabic)](https://en.pons.com/translate/german-arabic/Reiseb%C3%BCro). يسند معنى مكتب السفر/وكالة السفر في عنوان الحوار.
<a id="s3"></a>S3 — [PONS — fahren (German–Arabic)](https://en.pons.com/translate/german-arabic/fahren). يسند فعل التنقل/السفر بـfahren في سياق رحلة إلى مدينة.
<a id="s4"></a>S4 — [PONS — München (German–Arabic)](https://en.pons.com/translate/german-arabic/M%C3%BCnchen). يوثق اسم مدينة München وكتابته؛ تُنقل عربياً ميونخ/ميونيخ.
<a id="s5"></a>S5 — [PONS — Juli (German–Arabic)](https://en.pons.com/translate/german-arabic/Juli). يسند مقابِل الشهر Juli: يوليو.
<a id="s6"></a>S6 — [PONS — möchten (German–Arabic)](https://en.pons.com/translate/german-arabic/m%C3%B6chten). يعرض was möchten Sie? = ماذا تريد؛ يسند دلالة Ich möchte على الرغبة.
<a id="s7"></a>S7 — [PONS — gern (German–Arabic)](https://en.pons.com/translate/german-arabic/gern). يعرض gern = بسرور، بما يطابق الرد الإيجابي.
<a id="s8"></a>S8 — [PONS — Fahrkarte (German–Arabic)](https://en.pons.com/translate/german-arabic/Fahrkarte). يعرض Fahrkarte = تذكرة سفر/ركوب.
<a id="s9"></a>S9 — [PONS — zurück (German–Arabic)](https://en.pons.com/translate/german-arabic/zur%C3%BCck). يعرض التعبير hin und zurück Fahrkarte = ذهاباً وإياباً.
<a id="s10"></a>S10 — [Duden — Datum](https://www.duden.de/sprachwissen/rechtschreibregeln/datum). يعرض صيغ التاريخ مع am، ومنها am Montag, 5. April، ويبين أن اليوم التقويمي مع am يمكن أن يأتي في الداتيف أو الأكوزاتيف.
<a id="s11"></a>S11 — [Duden — Schreibung der Ordnungszahlen](https://www.duden.de/sprachwissen/sprachratgeber/Schreibung-der-Ordnungszahlen). الأعداد الترتيبية تُكتب كبيرة عموماً حين تستقل/تُسمّى، وصغيرة فقط حين تستعمل صفةً قبل اسم؛ لذلك am zwölften Juli صغيرة وder Zwölfte مستقلة كبيرة.
<a id="s12"></a>S12 — [PONS — Zug (German–Arabic)](https://en.pons.com/translate/german-arabic/Zug). يسند معنى Zug = قطار في السياق.
<a id="s13"></a>S13 — [PONS — kosten (German–Arabic)](https://en.pons.com/translate/german-arabic/kosten). يسند دلالة kosten على أن السعر يبلغ مبلغاً.
<a id="s14"></a>S14 — [PONS — Person (German–Arabic)](https://en.pons.com/translate/german-arabic/Person). يسند معنى Person = شخص؛ عبارة pro Person تعني لكل شخص.
<a id="s15"></a>S15 — [PONS — können (German–Arabic)](https://en.pons.com/translate/german-arabic/k%C3%B6nnen). يسند دلالة الإمكان/القدرة في سؤال Können Sie …?
<a id="s16"></a>S16 — [PONS — reservieren (German–Arabic)](https://en.pons.com/translate/german-arabic/reservieren). يسند reservieren = يحجز.
<a id="s17"></a>S17 — [PONS — Hotel (German–Arabic)](https://en.pons.com/translate/german-arabic/Hotel). يسند معنى Hotel = فندق.
<a id="s18"></a>S18 — [PONS — Doppelzimmer (German–Arabic)](https://en.pons.com/translate/german-arabic/Doppelzimmer). يسند نوع الغرفة المزدوجة/المعدة لشخصين.
<a id="s19"></a>S19 — [PONS — Zentrum (German–Arabic)](https://en.pons.com/translate/german-arabic/Zentrum). يسند معنى Zentrum = المركز/وسط المدينة بحسب السياق.
<a id="s20"></a>S20 — [PONS — gegenüber (German–Arabic)](https://en.pons.com/translate/german-arabic/gegen%C3%BCber). يسند معنى gegenüber = مقابل، لا بجانب.
<a id="s21"></a>S21 — [PONS — Bahnhof (German–Arabic)](https://en.pons.com/translate/german-arabic/Bahnhof). يسند Bahnhof = محطة القطار/المحطة.
<a id="s22"></a>S22 — [PONS — Telefon (German–Arabic)](https://en.pons.com/translate/german-arabic/Telefon). يسند عنوان Am Telefon: على الهاتف.
<a id="s23"></a>S23 — [PONS — Einladung (German–Arabic)](https://en.pons.com/translate/german-arabic/Einladung). يعرض Einladung = دعوة؛ يسند عنوان الدعوة.
<a id="s24"></a>S24 — [PONS — Hallo (German–Arabic)](https://en.pons.com/translate/german-arabic/hallo). يعرض Hallo للتحية = مرحباً، وفي الهاتف = ألو.
<a id="s25"></a>S25 — [PONS — Wie geht es dir? (German–Arabic)](https://en.pons.com/translate/german-arabic/Wie+geht+es+dir). يعرض Wie geht es dir? = كيف حالك؟؛ يسند الترجمة العربية للسؤال.
<a id="s26"></a>S26 — [PONS — gut (German–Arabic)](https://en.pons.com/translate/german-arabic/guten). يعرض es geht mir gut = أنا بخير، فيسند الجزء Gut من الرد.
<a id="s27"></a>S27 — [PONS — danke (German–Arabic)](https://en.pons.com/translate/german-arabic/danke). يعرض danke = شكراً؛ يسند استعادة الجزء الساقط من الترجمة.
<a id="s28"></a>S28 — [PONS — Neues (German–Arabic)](https://en.pons.com/translate/german-arabic/Neues). يعرض nichts Neues = لا جديد؛ يسند سؤال Was gibt's Neues?
<a id="s29"></a>S29 — [PONS — Samstag (German–Arabic)](https://en.pons.com/translate/german-arabic/Samstag). يسند Samstag = السبت.
<a id="s30"></a>S30 — [PONS — feiern (German–Arabic)](https://en.pons.com/translate/german-arabic/feiern). يسند فعل الاحتفال في Am Samstag feiere ich …
<a id="s31"></a>S31 — [PONS — Geburtstag (German–Arabic)](https://en.pons.com/translate/german-arabic/Geburtstag). يسند Geburtstag = عيد الميلاد؛ ويُستعمل مع feiern للاحتفال بعيد الميلاد.
<a id="s32"></a>S32 — [PONS — kommen (German–Arabic)](https://en.pons.com/translate/german-arabic/kommen). يسند kommen = يأتي/يحضر؛ يطابق سؤال دعوة Selma للحضور.
<a id="s33"></a>S33 — [PONS — beginnen (German–Arabic)](https://en.pons.com/translate/german-arabic/beginnen). يسند beginnen = يبدأ.
<a id="s34"></a>S34 — [PONS — Party (German–Arabic)](https://en.pons.com/translate/german-arabic/Party). يسند Party = حفلة.
<a id="s35"></a>S35 — [Duden — Schreibung von Uhrzeitangaben](https://www.duden.de/sprachwissen/sprachratgeber/Uhrzeitangaben). يعرض التوقيت الشفهي بصيغ مثل um drei Uhr وum fünfzehn Uhr؛ يثبت استعمال صيغة الساعة، و18 Uhr تساوي السادسة مساءً بتحويل 24 ساعة.
<a id="s36"></a>S36 — [PONS — Hause (German–Arabic)](https://en.pons.com/translate/german-arabic/Hause). يعرض zu Hause = في البيت وnach Hause = إلى البيت.
<a id="s37"></a>S37 — [PONS — sollen (German–Arabic)](https://en.pons.com/translate/german-arabic/sollen). يسند الدلالة المطلوبة في Soll ich etwas …?، أي هل ينبغي/هل أفعل؟
<a id="s38"></a>S38 — [PONS — mitbringen (German–Arabic)](https://en.pons.com/translate/german-arabic/mitbringen). يسند معنى إحضار شيء مع المتكلم في سؤال Soll ich etwas mitbringen?
<a id="s39"></a>S39 — [PONS — gute Laune (German–English)](https://en.pons.com/translate/german-english/gute+Laune). يعرض gute Laune = good mood؛ يسند معنى «مزاج جيد».
<a id="s40"></a>S40 — [PONS — mood (English–Arabic)](https://en.pons.com/translate/english-arabic/mood). يعرض mood مقابلاً لـمزاج/حالة مزاجية؛ يُقرأ مع S39 لإسناد العبارة كاملةً.
<a id="s41"></a>S41 — [PONS — Arzt (German–Arabic)](https://en.pons.com/translate/german-arabic/Arzt). يسند Arzt = طبيب وعنوان Beim Arzt = عند الطبيب.
<a id="s42"></a>S42 — [PONS — fehlen (German–Arabic)](https://en.pons.com/translate/german-arabic/fehlen). يسند سؤال Was fehlt Ihnen? إلى معنى ما بك/ما الذي تشكوه؟
<a id="s43"></a>S43 — [PONS — seit (German–Arabic)](https://en.pons.com/translate/german-arabic/seit). يعرض seit + Dativ = منذ؛ يسند بداية مدة الأعراض.
<a id="s44"></a>S44 — [Duden — wehtun](https://www.duden.de/rechtschreibung/wehtun). يعرف الفعل بأنه مصدر للألم، ويورد مثال der Kopf tut mir weh؛ يسند تركيب tut mir der Hals weh.
<a id="s45"></a>S45 — [PONS — Hals (German–Arabic)](https://en.pons.com/translate/german-arabic/Hals). يعرض Hals بمعنى العنق، وكذلك (Kehle)؛ يسند استعماله التشريحي في الشكوى.
<a id="s46"></a>S46 — [PONS — throat (English–Arabic)](https://en.pons.com/translate/english-arabic/throat). يعرض throat بمقابلات عربية منها الحلق/الحنجرة؛ مع S45 يسند المقصود من Hals في سياق الألم.
<a id="s47"></a>S47 — [PONS — Husten (German–Arabic)](https://en.pons.com/translate/german-arabic/Husten). يسند Husten = سعال.
<a id="s48"></a>S48 — [PONS — Fieber (German–Arabic)](https://en.pons.com/translate/german-arabic/Fieber). يسند Fieber = حمى/حمّى.
<a id="s49"></a>S49 — [PONS — ein bisschen (German–Arabic)](https://en.pons.com/translate/german-arabic/ein+bisschen). يعرض bisschen = قليلاً؛ يسند جواب المريض.
<a id="s50"></a>S50 — [PONS — müde (German–Arabic)](https://en.pons.com/translate/german-arabic/m%C3%BCde). يسند müde = متعب.
<a id="s51"></a>S51 — [PONS — Rezept (German–Arabic)](https://en.pons.com/translate/german-arabic/Rezept). يعرض Rezept بمعنى وصفة، بما فيه السياق الطبي.
<a id="s52"></a>S52 — [PONS — nehmen (German–Arabic)](https://en.pons.com/translate/german-arabic/nehmen). يعرض nehmen = يأخذ/يتناول؛ يسند الفعل في التعليمات اللغوية.
<a id="s53"></a>S53 — [PONS — Medizin (German–Arabic)](https://en.pons.com/translate/german-arabic/Medizin). يميّز Medizin (Arznei) = دواء، لا الطب بوصفه علماً.
<a id="s54"></a>S54 — [PONS — three times a day (English–German)](https://en.pons.com/translate/english-german/three+times+a+day). يعرض three times a day = dreimal täglich؛ يسند تكرار الجرعة لغوياً لا طبياً.
<a id="s55"></a>S55 — [PONS — müssen (German–Arabic)](https://en.pons.com/translate/german-arabic/m%C3%BCssen). يعرض ich muss = يجب عليّ أن؛ يسند سؤال Muss ich zu Hause bleiben?
<a id="s56"></a>S56 — [PONS — bleiben (German–Arabic)](https://en.pons.com/translate/german-arabic/bleiben). يسند bleiben = يبقى/يمكث.
<a id="s57"></a>S57 — [PONS — trinken (German–Arabic)](https://en.pons.com/translate/german-arabic/trinken). يسند trinken = يشرب.
<a id="s58"></a>S58 — [PONS — viel (German–Arabic)](https://en.pons.com/translate/german-arabic/viel). يسند viel = كثيراً/كثير؛ يصف مقدار الشاي.
<a id="s59"></a>S59 — [PONS — Tee (German–Arabic)](https://en.pons.com/translate/german-arabic/Tee). يسند Tee = شاي.
<a id="s60"></a>S60 — [PONS — zwei (German–Arabic)](https://en.pons.com/translate/german-arabic/zwei). يعرض zwei = اثنان/اثنتان، ويعطي für zwei Tage = لمدة يومين؛ يسند الجواب المختصر على مدة البقاء.
<a id="s61"></a>S61 — [PONS — Tag (German–Arabic)](https://en.pons.com/translate/german-arabic/Tag). يعرض Tag = يوم؛ يسند المدة الزمنية zwei Tage.
<a id="s62"></a>S62 — [PONS — neben (German–Arabic)](https://en.pons.com/translate/german-arabic/neben). يعرض neben مكانياً = بجانب؛ يميّزه عن gegenüber = مقابل.
<a id="s63"></a>S63 — [PONS — Stadtrand (German–Arabic)](https://en.pons.com/translate/german-arabic/Stadtrand). يعرض Stadtrand = ضواحي المدينة؛ يبيّن تعارضه مع وصف الفندق بأنه في Zentrum.
