# مراجعة الحوارات A2 — الدفعة 01

**التاريخ:** 2026-10-05
**النطاق:** `d-a2-31` و`d-a2-32` من السجل الحي؛ فجوة A1 `d-a1-28`–`d-a1-30` تبقى منفصلة وغير محسومة.

## التغطية والحكم

- **24 وحدة**: 2 بيانات حوار، 11 سطراً، 5 أسئلة بكل حقولها، و6 جمل إملاء؛ إضافةً إلى فحص ملفي الصوت وجودهما وحجمهما.
- أحكام العناصر: **15 سليمة؛ 7 مصححة؛ 2 غير محسومة**.
- أُصلحت 7 حقول نصية: تحية `Guten Tag`، مطابقة المخاطبة للمؤنث في سطرين، تقييد شرح مهلة 14 يوماً بوعد البائع في الحوار، وترجمة `Krankmeldung` وشرحيها في سؤالي الفهم والإكمال.
- ثلاث ملاحظات سياقية/تربوية ظلت مفتوحة؛ لا تعني أن العناصر أخطاء مؤكدة. لا تغيير على محتوى الحالة القانونية دون تحديد نوع البيع، ولا على شرح `innerhalb` دون معرفة هدفه.
- ملفا الصوت موجودان والحجم يطابق الفهرس؛ لم يُدّعَ سماعهما أو التحقق من النطق.

## التصحيحات المؤكدة

1. `d-a2-31.lines[0]`: `Guten Tag` تحية، لا يحدد أن الوقت مساءً؛ استبدلت «مساء الخير» بـ«مرحباً» وفق مقابلات PONS وDuden ([S1](#s1), [S2](#s2), [S31](#s31)).
2. `d-a2-31.lines[1]` و`lines[5]`: المتلقية `Kundin` امرأة؛ صُحح `أمعكَ` إلى `هل معكِ` و`تستلمُ` إلى `تستلمينَ`، وفق تمييز كَ/كِ وعلامة المضارع للمؤنث ([S7](#s7), [S8](#s8)).
3. `d-a2-31-q1`: رُبطت مهلة الأربعة عشر يوماً بقول البائع في الحوار فقط، كيلا تُفهم كقاعدة عامة؛ حق الإرجاع يختلف حسب نوع الشراء والسياسة ([S18](#s18), [S19](#s19)).
4. `d-a2-32.lines[4]` و`d-a2-32-q1` و`d-a2-32-q2`: `Krankmeldung` إبلاغ عن المرض لجهة العمل، وليس الاسم نفسه للإجازة/الشهادة الطبية؛ صُحح السطر وشرح الفخّ في السؤال الأول وشرح سؤال الإكمال إلى «إشعار بمرضي/إبلاغ جهة العمل» ([S27](#s27), [S28](#s28)).

## ملاحظات غير محسومة — لا تُعامل كأخطاء مثبتة

- `d-a2-31.lines[3]`: وعد البائع بإعادة المبلغ «خلال 14 يوماً» قد يكون سياسة هذا المتجر؛ لا يحدد الحوار بيعاً عن بعد أو شراءً حضورياً. مصادر المستهلك تفرق بين إصلاح/استبدال السلعة المعيبة وحق الانسحاب في البيع عن بعد وسياسة المتجر، لذلك لا يصح تعميم الجملة كقاعدة عامة ولا إثبات أنها خاطئة في وعد المتجر ([S18](#s18), [S19](#s19)). لم أعدلها.
- `d-a2-31-q2`: الجواب `Innerhalb` والجملة صحيحان. قاعدة Genitiv صحيحة عموماً، لكن التركيب المعروض `innerhalb von` يحتوي `von` مع Dativ؛ يمكن توضيح ذلك إن كان الهدف تدريس الحالات لا مجرد إكمال المفردة ([S10](#s10), [S11](#s11)). لم أعدل الشرح.
- `d-a2-32.lines[4]`: نظام eAU يجعل إرسال الشهادة الورقية بالبريد غير الإجراء القياسي لكثير من موظفي التأمين القانوني في ألمانيا منذ 2023، لكن `Krankmeldung` تعني إبلاغ جهة العمل، والموظف لا يزال ملزماً بالإبلاغ؛ نوع التأمين وإجراء الشركة غير محددين، فلا يثبت خطأً ([S27](#s27), [S28](#s28), [S30](#s30)). أبقيت البريد كما هو.

## التاريخ التحريري

قورنت الأسطر الألمانية والعناوين مع `scripts/dialoge_welle.py`، والأسئلة مع `scripts/patches/a_dialog_fallen.py`. النص الألماني الحي مطابق للتأسيس؛ تحديثات الترجمة موضحة أعلاه. تغيّر ترتيب مشتتات d31-q1 دون تغيير المفتاح، كما تغيرت مشتتات d32-q1 مع بقاء `drei Tage` صحيحاً. جمل الإملاء الحية كاملة ومنقولة من الحوار. لا يُعامل اختلاف الترتيب آلياً بوصفه خطأ.

| الحوار/السؤال | التأسيسي | تحرير المشتتات | الحي | الحكم |
|---|---|---|---|---|
| `d-a2-31-q1` | einen Umtausch؛ ihr Geld zurück؛ eine Reparatur | einen neuen Wasserkocher؛ ihr Geld zurück؛ eine Reparatur innerhalb von vierzehn Tagen | ihr Geld zurück؛ einen neuen Wasserkocher؛ eine Reparatur innerhalb von vierzehn Tagen | المفتاح `ihr Geld zurück`؛ تغيرت المشتتات وبقي المفتاح؛ انتقل موضعه من الثاني في patch إلى الأول في الحي. عُدّل الشرح الآن لينسب الأربعة عشر يوماً إلى قول البائع في هذا الحوار فقط، لا إلى قاعدة عامة. |
| `d-a2-31-q2` | ___ von vierzehn Tagen ist das kein Problem. | — | ___ von vierzehn Tagen ist das kein Problem. | المفتاح `Innerhalb`؛ السؤال والمفتاح ثابتان؛ الملاحظة الحالية على اكتمال الشرح النحوي لا على صحة الجواب. |
| `d-a2-31-q3` | Sie bekommt den Betrag mit Karte. | — | Sie bekommt den Betrag mit Karte. | المفتاح `falsch`؛ الموجه والمفتاح لم يتغيرا؛ النص يقول bar. |
| `d-a2-32-q1` | einen Tag؛ drei Tage؛ eine Woche | einen Tag؛ drei Tage؛ bis heute Abend | drei Wochen؛ drei Tage؛ bis heute Abend | المفتاح `drei Tage`؛ تغيرت المشتتات في الحي إلى drei Wochen وbis heute Abend، وتوسع الشرح لتمييز وحدة المدة عن موعد الإرسال؛ وصُحح فيه الشهادة إلى الإشعار لأن المرسل Krankmeldung. |
| `d-a2-32-q2` | Die ___ schicke ich heute per Post. | — | Die ___ schicke ich heute per Post. | المفتاح `Krankmeldung`؛ الكلمة المفتاحية ثابتة؛ عُدّل الشرح العربي الآن لفصل Krankmeldung (الإبلاغ) عن الشهادة الطبية. |

### جمل الإملاء

- **d-a2-31:** التاريخي: Haben Sie den Kassenbon dabei?؛ Ich hätte gern mein Geld zurück.؛ Muss ich etwas unterschreiben? الحي: Guten Tag. Ich habe diesen Wasserkocher vorgestern gekauft, aber er funktioniert nicht.؛ Das tut mir leid. Haben Sie den Kassenbon dabei?؛ Ja, hier. Ich hätte gern mein Geld zurück.
- **d-a2-32:** التاريخي: Ich bin leider krank geworden.؛ Ich habe Fieber.؛ Die Krankmeldung schicke ich per Post. الحي: Guten Morgen, Herr Weber. Ich bin leider krank geworden.؛ Das tut mir leid. Was fehlt Ihnen denn?؛ Ich habe Fieber. Der Arzt hat mich für drei Tage krankgeschrieben.

## فحص الصوت

| المعرّف | الملف | موجود | الحجم المسجل/الفعلي (بايت) | أصوات | حدود الفحص |
|---|---|---|---:|---:|---|
| d-a2-31 | `/audio/dialog/d-a2-31.mp3` | True | 162483/162483 | 2 | وجود وحجم فقط؛ لا استماع ولا تفريغ |
| d-a2-32 | `/audio/dialog/d-a2-32.mp3` | True | 117326/117326 | 2 | وجود وحجم فقط؛ لا استماع ولا تفريغ |

## سجل كل عنصر

سجلات `reviewed` في JSON تحفظ اللقطات الكاملة للحقول الحية؛ الجدول أدناه يعرضها مع الدليل والحكم والإجراء ومصادر الإنترنت.

| المعرّف | العنصر الذي فُحص | النص/الحقول الحية | الحكم | الدليل | الإجراء | المصادر |
|---|---|---|---|---|---|---|
| `d-a2-31` | بيانات الحوار: العنوان والمستوى والبنية | العنوان: `Eine Reklamation` / شكوى على سلعة; المستوى المسجل `A2`؛ الأسطر/الأسئلة/الإملاء 6/3/3؛ waisen موجودة: False | **سليم** | العنوان Eine Reklamation يقابل شكوى تجارية، والسلعة في الحوار غلّاية ماء. المستوى A2 كما هو مخزّن؛ لم أعد تقييم CEFR ولا أضفت وِحدات مفردات غير موجودة. | لا تعديل. | [S3](#s3), [S4](#s4), [S9](#s9) |
| `d-a2-31.lines[0]` | سطر حوار ألماني وترجمته | المتحدث `Kundin`<br>`Guten Tag. Ich habe diesen Wasserkocher vorgestern gekauft, aber er funktioniert nicht.`<br>↔ مرحباً. اشتريتُ هذه الغلّايةَ أوّلَ أمسٍ لكنّها لا تعمل. | **مُصحح** | كان Guten Tag مترجماً بـمساء الخير، وهي تحية مسائية بينما النص لا يحدد المساء. Duden يسجل Guten Tag تحية، وPONS يعطي نهارك سعيد/مرحباً؛ الغلّاية وأول أمس مترجمتان بما يوافق المراجع. | استُبدلت مساء الخير بـمرحباً لتجنب إضافة وقت غير مذكور؛ بقية السطر باقية. | [S1](#s1), [S2](#s2), [S3](#s3), [S4](#s4), [S5](#s5), [S31](#s31) |
| `d-a2-31.lines[1]` | سطر حوار ألماني وترجمته | المتحدث `Verkäufer`<br>`Das tut mir leid. Haben Sie den Kassenbon dabei?`<br>↔ يؤسفُني. هل معكِ إيصالُ الشراء؟ | **مُصحح** | Kundin مؤنث. كان الضمير العربي المشكول أمعكَ للمذكر في خطاب البائع إلى الزبونة؛ كَ للمذكر وكِ للمؤنث. Kassenbon هو إيصال شراء. | استُبدل السؤال بـهل معكِ إيصال الشراء؟ للمخاطبة المؤنثة. | [S6](#s6), [S7](#s7) |
| `d-a2-31.lines[2]` | سطر حوار ألماني وترجمته | المتحدث `Kundin`<br>`Ja, hier. Ich hätte gern mein Geld zurück.`<br>↔ نعم، تفضَّل. أودُّ استردادَ مالي. | **سليم** | الزبونة تسلّم الإيصال إلى البائع الرجل ثم تطلب Geld zurück؛ نعم، هنا، تفضّل صياغة سليمة لمخاطبة البائع، وطلب استرداد المال مطابق للقول الألماني. | لا تعديل. | [S13](#s13), [S14](#s14) |
| `d-a2-31.lines[3]` | سطر حوار ألماني وترجمته + ملاحظة سياقية | المتحدث `Verkäufer`<br>`Innerhalb von vierzehn Tagen ist das kein Problem.`<br>↔ خلالَ أربعةَ عشرَ يوماً لا مشكلة. | **غير محسوم** | Innerhalb von vierzehn Tagen يقابل خلال أربعة عشر يوماً، والجملة سليمة لغوياً. ملاحظة منفصلة: لا يُعرف هل يقصد البائع سياسة متجر بعينه أم قاعدة عامة؛ إرجاع ثمن سلعة معيبة خلال 14 يوماً ليس وصفاً عاماً كافياً للقانون، لكن يمكن للبائع أن يوافق طوعاً. لذلك لا يثبت خطأ في الحوار ولا يصح تعميمه. | تُترك الجملة دون تعديل تخميني؛ إذا كان المقصود قاعدة قانونية عامة فينبغي تحديد سياق البيع/سياسة المتجر أولاً. | [S10](#s10), [S11](#s11), [S18](#s18), [S19](#s19) |
| `d-a2-31.lines[4]` | سطر حوار ألماني وترجمته | المتحدث `Kundin`<br>`Sehr gut. Muss ich etwas unterschreiben?`<br>↔ ممتاز. أعليَّ التوقيعُ على شيء؟ | **سليم** | Muss ich etwas unterschreiben? سؤال عن التوقيع؛ أعليّ التوقيع على شيء تنقل المقصود. لم يظهر دليل على خلل دلالي. | لا تعديل. | [S12](#s12) |
| `d-a2-31.lines[5]` | سطر حوار ألماني وترجمته | المتحدث `Verkäufer`<br>`Nur hier unten, dann bekommen Sie den Betrag bar.`<br>↔ هنا في الأسفلِ فقط، ثمَّ تستلمينَ المبلغَ نقداً. | **مُصحح** | Betrag = المبلغ، bekommen بمعنى الاستلام، وbar = نقداً. البائع يخاطب Kundin؛ كانت تستلمُ بصيغة المذكر، بينما علامة -ينَ هي للمخاطبة المفردة المؤنثة. | صُححت تستلمُ إلى تستلمينَ لمطابقة الزبونة المؤنثة؛ بقي معنى المبلغ النقدي. | [S7](#s7), [S8](#s8), [S15](#s15), [S16](#s16), [S17](#s17) |
| `d-a2-31-q1` | سؤال فهم: الموجه والخيارات والمفتاح والشرح | النوع `mc`<br>DE: `Was möchte die Kundin?`<br>AR: اختر الإجابة الصحيحة حسب الحوار.<br>الخيارات: ihr Geld zurück؛ einen neuen Wasserkocher؛ eine Reparatur innerhalb von vierzehn Tagen<br>المفتاح: `ihr Geld zurück`<br>الشرح: الدليل: «Ich hätte gern mein Geld zurück». الفخّ 1: لم تطلب استبدالاً. الفخّ 2: أربعة عشر يوماً هي المهلة التي ذكرها البائع لقبول طلبها في هذا الحوار، لا مدة إصلاح ولا قاعدة عامة لكل المتاجر.<br>falle: غير موجود | **مُصحح** | المفتاح ihr Geld zurück منصوص عليه، والبديلان لا يطابقان طلب الزبونة. كان الشرح يصف الأربعة عشر يوماً بأنها مهلة استرجاع بصياغة قد تُقرأ قاعدة عامة. صيغ الآن على أنها المهلة التي ذكرها البائع لقبول الطلب في هذا الحوار فقط؛ وتوضح مصادر المستهلك أن الحقوق تختلف بحسب نوع البيع وأن المتجر قد يمنح سياسة طوعية. | حُدث الشرح ليربط الأربعة عشر يوماً بوعد البائع في الحوار، لا بقاعدة عامة؛ لم تتغير الخيارات أو الإجابة الصحيحة. | [S9](#s9), [S13](#s13), [S14](#s14), [S18](#s18), [S19](#s19) |
| `d-a2-31-q2` | سؤال إكمال وشرح القاعدة | النوع `fill`<br>DE: `___ von vierzehn Tagen ist das kein Problem.`<br>AR: أكمل الفراغ بالكلمة المناسبة من الحوار.<br>الخيارات: لا خيارات<br>المفتاح: `Innerhalb`<br>الشرح: innerhalb حرفُ جرٍّ يجرُّ بالمضاف: innerhalb von vierzehn Tagen.<br>falle: غير موجود | **غير محسوم** | الإجابة Innerhalb صحيحة وتطابق الجملة. الشرح يذكر أن innerhalb يأتي مع Genitiv؛ وهذا صحيح عموماً، لكن المثال نفسه يستخدم innerhalb von + Dativ. لا يظهر خطأ في الجواب أو المثال، وقد يحتاج الشرح توضيحاً إذا كان هدفه تعليم الحالة النحوية. | لا تغيير؛ تُسجل ملاحظة تربوية غير محسومة لأن هدف السؤال الظاهر هو إكمال المفردة، لا شرح كل حالات الجر. | [S10](#s10), [S11](#s11) |
| `d-a2-31-q3` | سؤال صح/خطأ وشرحه | النوع `truefalse`<br>DE: `Sie bekommt den Betrag mit Karte.`<br>AR: هل العبارة صحيحة أم خاطئة حسب الحوار؟<br>الخيارات: richtig؛ falsch<br>المفتاح: `falsch`<br>الشرح: في النصِّ: «bekommen Sie den Betrag bar» أي نقداً.<br>falle: غير موجود | **سليم** | القول Sie bekommt den Betrag mit Karte خاطئ حسب السطر الذي يقول den Betrag bar؛ معنى bar هنا نقداً. المفتاح falsch والشرح متسقان. | لا تعديل. | [S15](#s15), [S16](#s16), [S17](#s17) |
| `d-a2-31.dictation[0]` | جملة إملاء | `Guten Tag. Ich habe diesen Wasserkocher vorgestern gekauft, aber er funktioniert nicht.` | **سليم** | جملة ألمانية كاملة مطابقة للسطر الأول؛ تحوي التحية والغلّاية وأول أمس كما في الحوار. | لا تعديل. | [S1](#s1), [S2](#s2), [S3](#s3), [S4](#s4), [S5](#s5), [S31](#s31) |
| `d-a2-31.dictation[1]` | جملة إملاء | `Das tut mir leid. Haben Sie den Kassenbon dabei?` | **سليم** | جملة كاملة مطابقة لسؤال الإيصال في السطر الثاني؛ تتبع نص المتحدث الألماني، ولا تحفظ الترجمة القديمة المصححة. | لا تعديل. | [S6](#s6) |
| `d-a2-31.dictation[2]` | جملة إملاء | `Ja, hier. Ich hätte gern mein Geld zurück.` | **سليم** | جملة كاملة مطابقة لرد الزبونة في السطر الثالث؛ الاسترداد مذكور بوضوح. | لا تعديل. | [S13](#s13), [S14](#s14) |
| `d-a2-32` | بيانات الحوار: العنوان والمستوى والبنية | العنوان: `Krankmeldung beim Chef` / إبلاغُ المديرِ بالمرض; المستوى المسجل `A2`؛ الأسطر/الأسئلة/الإملاء 5/2/3؛ waisen موجودة: False | **سليم** | Krankmeldung beim Chef يقابل إبلاغ المدير بالمرض؛ المتحدثان Amir وWeber، والبنية 5 أسطر وسؤالان وثلاث جمل إملاء. المستوى A2 هو الوسم المخزّن فقط. | لا تعديل. | [S20](#s20), [S24](#s24), [S27](#s27) |
| `d-a2-32.lines[0]` | سطر حوار ألماني وترجمته | المتحدث `Amir`<br>`Guten Morgen, Herr Weber. Ich bin leider krank geworden.`<br>↔ صباحَ الخير سيد فيبر. للأسفِ مرضت. | **سليم** | Guten Morgen تقابل صباح الخير، وkrank geworden تعني أنه مرض. الترجمة العربية تحفظ التحية والمرض والأسف. | لا تعديل. | [S20](#s20), [S21](#s21) |
| `d-a2-32.lines[1]` | سطر حوار ألماني وترجمته | المتحدث `Weber`<br>`Das tut mir leid. Was fehlt Ihnen denn?`<br>↔ يؤسفُني. ما الذي تشكوه؟ | **سليم** | Was fehlt Ihnen denn? سؤال عمّا يشكو منه Amir؛ PONS يعطي المقابل الاستفهامي ما بك/ما بكِ. تشكو هنا تؤدي معنى العارض، وصيغة المذكر تلائم Amir. | لا تعديل. | [S22](#s22) |
| `d-a2-32.lines[2]` | سطر حوار ألماني وترجمته | المتحدث `Amir`<br>`Ich habe Fieber. Der Arzt hat mich für drei Tage krankgeschrieben.`<br>↔ لديَّ حمّى. أعطاني الطبيبُ إجازةً ثلاثةَ أيام. | **سليم** | Fieber = حمى. Duden يعرّف krankgeschrieben بأنه تصديق طبي على عجز مؤقت عن العمل، وPONS يورد شهادة طبية لـKrankschreibung. إجازة ثلاثة أيام تنقل المقصود العام في سياق المرض والطبيب، ولا يثبت الفحص خطأً يلزم تغييره. | لا تعديل؛ يمكن أن تكون شهادة طبية أدق اصطلاحياً، لكن الصياغة الحالية مفهومة وليست خطأً مؤكداً. | [S23](#s23), [S24](#s24), [S25](#s25) |
| `d-a2-32.lines[3]` | سطر حوار ألماني وترجمته | المتحدث `Weber`<br>`Dann kurieren Sie sich bitte richtig aus.`<br>↔ إذنْ تعافَ كما ينبغي. | **سليم** | Duden يعرّف auskurieren بمعنى الشفاء التام والعودة إلى الصحة؛ «إذن تعافَ كما ينبغي» موافقة لمعنى Dann kurieren Sie sich bitte richtig aus. | لا تعديل. | [S26](#s26) |
| `d-a2-32.lines[4]` | سطر حوار ألماني وترجمته + ملاحظة سياقية | المتحدث `Amir`<br>`Die Krankmeldung schicke ich heute noch per Post.`<br>↔ سأُرسِلُ إشعاراً بمرضي اليومَ بالبريد. | **مُصحح** | Duden وPONS يعرّفان Krankmeldung بإبلاغ جهة العمل بالمرض؛ الترجمة السابقة الإجازة المرضية خلطت الإبلاغ بالإجازة/الشهادة. عُدلت إلى إشعار بمرضي. ملاحظة معاصرة: في النظام الألماني، غالباً ما تُرسل شهادة AU إلكترونياً لموظفي التأمين القانوني، مع بقاء واجب إبلاغ صاحب العمل؛ النص يقول Krankmeldung بالبريد ولا يحدد نوع التأمين أو إجراء الشركة، لذلك لا يكفي ذلك لعدّ الحوار خطأً. | صُححت الدلالة إلى إشعار بمرضي. لم تُغيّر وسيلة البريد؛ الملاحظة عن eAU سياقية وغير حاسمة في غياب تفاصيل الحالة. | [S27](#s27), [S28](#s28), [S29](#s29), [S30](#s30) |
| `d-a2-32-q1` | سؤال فهم المدة: الموجه والخيارات والمفتاح والشرح | النوع `mc`<br>DE: `Wie lange ist er krankgeschrieben?`<br>AR: اختر الإجابة الصحيحة حسب الحوار.<br>الخيارات: drei Wochen؛ drei Tage؛ bis heute Abend<br>المفتاح: `drei Tage`<br>الشرح: الدليل: «Der Arzt hat mich für drei Tage krankgeschrieben». الفخّ 1: «drei» صحيح والوحدة خاطئة. الفخّ 2: «heute noch» موعد إرسال الإشعار بالبريد.<br>falle: غير موجود | **مُصحح** | المفتاح drei Tage مطابق لعبارة für drei Tage krankgeschrieben. المشتتات تخلط وحدة المدة أو وقت إرسال الإشعار؛ كان الشرح يسمي Krankmeldung المرسلة بالبريد شهادةً، مع أن Duden وPONS يعرّفانها إبلاغاً بالمرض. صُحح اسم الشيء المرسل إلى الإشعار، وبقي السؤال والمفتاح صحيحين. | عُدّل وصف الفخ الثاني من إرسال الشهادة إلى إرسال الإشعار بالبريد؛ لم تتغير الخيارات أو الإجابة. | [S24](#s24), [S25](#s25), [S27](#s27), [S28](#s28), [S29](#s29) |
| `d-a2-32-q2` | سؤال إكمال وشرح المصطلح | النوع `fill`<br>DE: `Die ___ schicke ich heute per Post.`<br>AR: أكمل الفراغ بالكلمة المناسبة من الحوار.<br>الخيارات: لا خيارات<br>المفتاح: `Krankmeldung`<br>الشرح: Krankmeldung = إبلاغُ جهةِ العملِ بالمرض؛ وفي الحوارِ يرسلُ أميرٌ هذا الإشعارَ بالبريد.<br>falle: غير موجود | **مُصحح** | Krankmeldung هو الإبلاغ عن المرض إلى جهة العمل؛ Duden وPONS يؤيدان هذا المعنى، وmit der Post = بالبريد. الشرح السابق وصفه بأنه ورقة إجازة مرضية، فخلط الإبلاغ بالشهادة/الإجازة. | حُدث الشرح إلى: إبلاغ جهة العمل بالمرض، مع ربطه بإشعار Amir المرسل بالبريد. | [S27](#s27), [S28](#s28), [S29](#s29) |
| `d-a2-32.dictation[0]` | جملة إملاء | `Guten Morgen, Herr Weber. Ich bin leider krank geworden.` | **سليم** | الجملة كاملة وتطابق السطر الأول من الحوار. | لا تعديل. | [S20](#s20), [S21](#s21) |
| `d-a2-32.dictation[1]` | جملة إملاء | `Das tut mir leid. Was fehlt Ihnen denn?` | **سليم** | الجملة كاملة وتطابق سؤال Weber في السطر الثاني. | لا تعديل. | [S22](#s22) |
| `d-a2-32.dictation[2]` | جملة إملاء | `Ich habe Fieber. Der Arzt hat mich für drei Tage krankgeschrieben.` | **سليم** | الجملة كاملة وتطابق السطر الثالث؛ Fieber والمدة والكتابة الطبية منقولة كما في الحوار. | لا تعديل. | [S23](#s23), [S24](#s24), [S25](#s25) |

## المصادر المنشورة

تُستخدم المصادر لتدقيق المعنى والسياق، لا لإعادة تقييم المستوى. المصادر القانونية تصف سياق ألمانيا ولا تُعد استشارة قانونية.

<a id="s1"></a>S1 — [Duden — Tag](https://www.duden.de/rechtschreibung/Tag_Zeiteinheit). يعرض Guten/guten Tag صيغة تحية؛ يثبت أن العبارة تحية عامة، لا مساوية لـGuten Abend.
<a id="s2"></a>S2 — [PONS — Guten Tag (German–Arabic)](https://en.pons.com/translate/german-arabic/Guten+Tag). يعطي نهارك سعيد، سلامات، ومرحباً مقابلاتٍ لـGuten Tag؛ لا يختار مساء الخير.
<a id="s3"></a>S3 — [Duden — Wasserkocher](https://www.duden.de/rechtschreibung/Wasserkocher). يعرّف Wasserkocher جهازاً كهربائياً لغلي الماء؛ يسند معنى الغلّاية في السطر.
<a id="s4"></a>S4 — [Cambridge English–Arabic Dictionary — kettle](https://dictionary.cambridge.org/dictionary/english-arabic/kettle). يترجم kettle إلى غلّاية ويعرّفه وعاءً لغلي الماء؛ يدعم المقابل العربي للمركب Wasserkocher مع تعريف Duden.
<a id="s5"></a>S5 — [PONS — vorgestern (German–Arabic)](https://en.pons.com/translate/german-arabic/vorgestern). يترجم vorgestern إلى أول أمس؛ يقابل أوّل أمس في النص.
<a id="s6"></a>S6 — [Duden — Kassenbon](https://www.duden.de/rechtschreibung/Kassenbon). يربط Kassenbon بـBon/Kassenzettel/Rechnung؛ يسند إيصال الشراء في الحوار.
<a id="s7"></a>S7 — [Madinah Arabic — pronouns and attached forms](https://madinaharabic.com/free-content/grammar/lesson-23/part-4). يفرق في ضمير المخاطب المفرد بين كَ للمذكر وكِ للمؤنث؛ لذلك لا تلائم كَ زبونةً مؤنثة.
<a id="s8"></a>S8 — [Madinah Arabic — feminine singular present verb](https://madinaharabic.com/free-content/grammar/lesson-35/part-2). يشرح علامة -ينَ في الفعل المضارع للمخاطبة المفردة المؤنثة، بمثال تذهبين؛ يسند تصحيح تستلمينَ.
<a id="s9"></a>S9 — [PONS — Reklamation (German–Arabic)](https://en.pons.com/translate/german-arabic/Reklamation). يعطي Reklamation = شكوى؛ يدعم عنوان الحوار وسياق الاعتراض على سلعة معطوبة.
<a id="s10"></a>S10 — [PONS — innerhalb (German–Arabic)](https://en.pons.com/translate/german-arabic/innerhalb). يعطي المعنى الزمني خلال/في غضون، ويعرض داخله mit Genitiv؛ يسند معنى الجملة وقاعدة الشرح العامة.
<a id="s11"></a>S11 — [Leibniz-Institut für Deutsche Sprache (Grammis) — Einfache Strukturen](https://grammis.ids-mannheim.de/systematische-grammatik/1422). يشرح أن Präposition تحكم الحالة، وأن بنية von الداخلية تأتي بالداتيف؛ يساعد على قراءة innerhalb von vierzehn Tagen دون ادعاء أن العبارة خاطئة.
<a id="s12"></a>S12 — [PONS — unterschreiben (German–Arabic)](https://en.pons.com/translate/german-arabic/unterschreiben). يعطي unterschreiben = وقّع/أمضى؛ يسند معنى توقيع الاستمارة.
<a id="s13"></a>S13 — [PONS — Geld (German–Arabic)](https://en.pons.com/translate/german-arabic/Geld). يعطي Geld بمعنى المال/النقود؛ يسند طلب المال في الحوار.
<a id="s14"></a>S14 — [PONS — zurück (German–Arabic)](https://en.pons.com/translate/german-arabic/zur%C3%BCck). يعطي zurück معاني الرجوع/العودة؛ مع Geld zurück والسياق يوافق طلب استرداد المال.
<a id="s15"></a>S15 — [PONS — Betrag (German–Arabic)](https://en.pons.com/translate/german-arabic/Betrag). يعطي Betrag = مبلغ؛ يسند المبلغ في حوار الرد النقدي وسؤال الصح والخطأ.
<a id="s16"></a>S16 — [PONS — bekommen (German–Arabic)](https://en.pons.com/translate/german-arabic/bekommen). يعرض bekommen (empfangen) = استلم؛ يسند معنى حصول الزبونة على المبلغ، مع تصريف العربية المؤنث.
<a id="s17"></a>S17 — [PONS — bar (German–Arabic)](https://en.pons.com/translate/german-arabic/bar). يعطي in bar = نقداً؛ يحسم أن جواب سؤال «mit Karte» خطأ بحسب النص.
<a id="s18"></a>S18 — [Verbraucherzentrale — Gewährleistung und Garantie](https://www.verbraucherzentrale.de/wissen/vertraege-reklamation/kundenrechte/alles-zu-gewaehrleistung-und-garantie-5057). توضح أن علاج السلعة المعيبة يبدأ عادةً بالإصلاح أو الاستبدال، وأن استرداد السعر يرتبط بشروط لاحقة؛ تستخدم لملاحظة السياق لا للحكم بأن البائع ممنوع من رد المال طوعاً.
<a id="s19"></a>S19 — [Verbraucherzentrale — Widerruf, Umtausch und Rückgabe](https://www.verbraucherzentrale.de/wissen/vertraege-reklamation/kundenrechte/von-widerruf-bis-umtausch-wenn-sie-mit-der-ware-nicht-zufrieden-sind-5117). تفرق بين مهلة 14 يوماً في عقود المسافة/الإنترنت وبين الشراء في المتجر، وتذكر أن العودة في المتجر قد تكون سياسة طوعية؛ تسند إبقاء تعميم النص غير محسوم.
<a id="s20"></a>S20 — [PONS — krank (German–Arabic)](https://en.pons.com/translate/german-arabic/krank). يعطي krank = مريض؛ يسند مرض Amir في الحوار.
<a id="s21"></a>S21 — [PONS — Guten Morgen (German–Arabic)](https://en.pons.com/translate/german-arabic/Guten+Morgen). يعطي Guten Morgen = صباح الخير؛ يؤيد الترجمة في الحوار الثاني.
<a id="s22"></a>S22 — [PONS — fehlen (German–Arabic)](https://en.pons.com/translate/german-arabic/fehlen). يعرض Was fehlt Ihnen? بمقابل عربي من نوع ما بك/ما بكِ؛ يثبت وظيفة السؤال عن العارض.
<a id="s23"></a>S23 — [PONS — Fieber (German–Arabic)](https://en.pons.com/translate/german-arabic/Fieber). يعطي Fieber = حمى؛ يسند مفردة السطر والسؤال عن مدة المرض.
<a id="s24"></a>S24 — [Duden — krankschreiben](https://www.duden.de/rechtschreibung/krankschreiben). يعرّف krankschreiben بأنه تصديق الطبيب كتابةً على عجز مؤقت عن العمل بسبب المرض، ويورد für eine Woche krankgeschrieben.
<a id="s25"></a>S25 — [PONS — Krankschreibung (German–Arabic)](https://en.pons.com/translate/german-arabic/Krankschreibung). يعطي Krankschreibung = شهادة طبية؛ يساند تمييزها من Krankmeldung في الشرح.
<a id="s26"></a>S26 — [Duden — auskurieren](https://www.duden.de/rechtschreibung/auskurieren). يعرّف auskurieren بمعنى الشفاء التام والعودة إلى الصحة؛ يسند sich richtig auskurieren = التعافي تماماً كما ينبغي.
<a id="s27"></a>S27 — [Duden — Krankmeldung](https://www.duden.de/rechtschreibung/Krankmeldung). يعرّف Krankmeldung بأنها إبلاغ صاحب العمل أو المدرسة بأن الشخص مريض؛ لا يعرّفها حصراً بوصفها إجازة مرضية.
<a id="s28"></a>S28 — [PONS — Krankmeldung (German–Arabic)](https://en.pons.com/translate/german-arabic/Krankmeldung). يعطي Krankmeldung = إخبار بالمرض؛ يسند تعديل الترجمة والشرح العربيين.
<a id="s29"></a>S29 — [PONS — Post (German–Arabic)](https://en.pons.com/translate/german-arabic/Post). يعطي mit der Post = بالبريد؛ يسند إرسال الإشعار بالبريد.
<a id="s30"></a>S30 — [gesund.bund.de — electronic sick leave notice (eAU)](https://gesund.bund.de/en/die-elektronische-arbeitsunfaehigkeitsbescheinigung-eau). يشرح أن أصحاب التأمين القانوني غالباً لا يرسلون شهادة AU ورقياً منذ 2023، لكن عليهم إبلاغ جهة العمل؛ يسجل ملاحظة سياقية دون إثبات استحالة البريد في كل حالة.
<a id="s31"></a>S31 — [Duden — Abend](https://www.duden.de/rechtschreibung/Abend). يعرّف Abend وقت المساء ويورد Guten Abend صيغة تحية؛ مع مدخل Guten Tag/مقابلات PONS يثبت أن مساء الخير تخص تحية المساء ولا يلزم إسقاطها على Guten Tag.
## الحدود

قُرئ السجل الحي بنداً بنداً: بيانات الحوار، المتحدث والنص والترجمة في كل سطر، كل موجّه وخيارات ومفتاح وشرح لكل سؤال، وكل جملة إملاء. رُبط كل عنصر بمصدر إنترنت ودليل وحكم وإجراء. قورنت الأسطر بملف التأليف والمشتتات بملف التحرير التاريخي. جرى فحص وجود ملفي الصوت وحجميهما فقط؛ لم يُدّعَ الاستماع أو مطابقة الأداء.

هذه مراجعة مساعد ذكاء اصطناعي مدعومة بمصادر، لا اعتماداً مهنياً أو مراجعة بشرية. لم يُعدّل CEFR أو النسبة أو حساب المستوى. فجوة `d-a1-28`–`d-a1-30` بقيت كما هي؛ هذه مراجعة حوارين A2 موجودين ولا تعوّضها.
