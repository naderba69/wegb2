# تقرير تدقيق محتوى الحوارات A1 — الدفعة 06

**التاريخ:** 2026-10-05<br>
**النطاق:** d-a1-16 وd-a1-17 وd-a1-18؛ مراجعة فردية للسجلات الحية ومقارنة تاريخية غير مرجعية.

## التغطية والنتيجة

- الوحدات المسجلة: **42** (3 بيانات حوار، 24 سطراً مع ترجمتها، 9 أسئلة بكامل حقولها، و6 جمل إملاء).
- المصادر المنشورة التي فُحصت: **45** (Goethe، Duden، PONS).
- الأحكام: **سليم 36؛ مُصحح 4؛ غير محسوم 2**.
- التصويبات: d-a1-16.lines[1]، d-a1-16.lines[7]، d-a1-16-q1 (مواءمة الشرح)، d-a1-17-q1. الملاحظتان غير المحسومتين: تفاوت du/Sie في بيانات d-a1-18، وسياق استعمال Ausländer والجملة الخيالية في d-a1-18.lines[7].

## المنهج وحدود المراجعة

قُرئت النصوص الحية كاملة قبل التعديل، ثم سُجل معرّف ودليل وحكم وإجراء ومصدر منشور لكل وحدة من الوحدات الـ42. فُحصت الألمانية والعربية والمتحدث والأسئلة والخيارات والمفاتيح والشروح والتعليمات والإملاء ومفردات waisen. استُخدمت Goethe للسياق الموضوعي وDuden/PONS للتهجئة والمعاني والاستعمال، لا لإثبات طبيعية كل جملة. قورنت النسخة التاريخية بعد قراءة JSON الحي، ولم تُمنح أولوية. التقييم الكمي لـCEFR ونسبة المحتوى وحساب المستوى مؤجل؛ وسم A1 سُجل كما هو ولم يُعاد حسابه.

1. Duden يثبت وصل `wiederkommen` عند معنى «المجيء مرة أخرى»؛ أُصلح السطر الذي يسأل عن العودة غداً ([S2](#s2)).
2. يفرق PONS بين `Vogel` العام (`طائر`) و`Sperling` (`عصفور/دوري`؛ [S3](#s3)، [S4](#s4))؛ لذلك ضُبطت الترجمة والشرح إلى اللفظ العام دون استنتاج نوع الطائر.
3. سؤال d-a1-17-q1 القديم عن ما يفعله الابن «أولاً» تجاوز ما يثبته الحوار بشأن ترتيب التنفيذ؛ صار السؤال عن أول مهمة محددة تذكرها الأم. يساند Duden دلالة zuerst على الترتيب و«الأول المذكور»، وتساند PONS Aufgabe/nennen معنى صياغة السؤال ([S31](#s31)–[S33](#s33)).
4. يميز Duden duzen عن siezen ([S44](#s44)، [S45](#s45))، لكنه لا يحسم إن كان العنوان عنوان موضوع مستقل؛ بقي بلا تعديل. تحذير Duden عن Ausländer مشروط بالسياق ([S43](#s43))، والموضع لا يحدد بلد الدورة أو المرجع، فلا تعميم ولا تصحيح آلي.
5. التقييم الكمي لـCEFR والنسبة وحساب المستوى الممكن بقي مؤجلاً. وسم A1 نُقل في التقرير كما هو، لا بوصفه نتيجة جديدة.

## مقارنة السكربت التاريخي

قورنت البيانات الحية أولاً بمقاطع [`scripts/patches/dialoge_a1_neu1.py`](../scripts/patches/dialoge_a1_neu1.py). لا يظهر استيراد إنتاجي له في app/components/lib؛ يُعامل كبيانات تأليف تاريخية فقط. المقارنة لا تجعل صيغة تاريخية صحيحة تلقائياً.

| المعرّف | أمثلة من السكربت | المقارنة بالحي بعد القراءة | الحكم والإجراء | المصادر |
|---|---|---|---|---|
| d-a1-16 | الخيارات: am Fluss / auf dem Baum / im Wald / vom Bauernhof / aus dem Wald / vom Fluss / richtig / falsch<br>المفاتيح: am Fluss / vom Bauernhof / richtig<br>مقتطفات: `Schau, ein Vogel auf dem Baum! Er singt.` · `Können wir morgen wieder kommen?` | قبل التصحيح تطابقت العناوين والأسطر الثنائية والمفردات والإملاء والأسئلة ومفاتيحها دلالياً؛ اختلف ترتيب خيارات q1 بين JSON والسكريبت فقط. كلاهما احتوى `wieder kommen` و«عصفور» للفظ Vogel. المقارنة التاريخية لم تصحح الخطأ: Duden وPONS سندا الكتابة المتصلة، وPONS يفرق بين Vogel العام وSperling/عصفور. | صُححت نقطتا الدقة في السجل الحي بمصدريهما؛ بقي ترتيب الخيارات الحي كما هو، ولم يُنسخ من السكريبت. | [S2](#s2), [S3](#s3), [S4](#s4), [S9](#s9), [S10](#s10), [S11](#s11) |
| d-a1-17 | الخيارات: Er kehrt die Küche. / Er wäscht den Topf. / Er bügelt die Hemden. / der Schrank / der Mülleimer / der Korb mit der Wäsche / Seife<br>المفاتيح: Er kehrt die Küche. / der Schrank / Seife<br>مقتطفات: `Du kehrst die Küche. Da ist viel Schmutz auf dem Boden.` · `Die Wäsche wasche ich, du bügelst danach die Hemden.` | كان النص الحي والسكريبت متطابقين دلالياً قبل التدقيق، باستثناء ترتيب خيارات q2. كلاهما يسأل `Was macht der Sohn zuerst?` مع أن الحوار يذكر مهمة أولى ولا يصرح بترتيب الإنجاز؛ كما أن الكيّ مهمة مسندة للابن لاحقاً. | عُدّل سؤال الحي إلى «Welche Aufgabe nennt die Mutter zuerst?» لقياس ترتيب ذكر المهمة المحددة، لا ترتيب تنفيذها؛ بقيت الإجابة والخيارات. لم يمنح وجود السؤال في السكريبت التاريخي أي سلطة. | [S17](#s17), [S27](#s27), [S31](#s31), [S32](#s32), [S33](#s33) |
| d-a1-18 | الخيارات: Deutsch / Französisch / Arabisch / Nein, er ist ledig. / Ja, seine Frau ist in Sfax. / Ja, er ist verheiratet. / richtig / falsch<br>المفاتيح: Deutsch / Nein, er ist ledig. / richtig<br>مقتطفات: `Herr Haddad, welche Nationalität haben Sie?` · `Nein, ich bin ledig. Viele Ausländer im Kurs sind auch ledig.` | العنوان والأسطر والمفردات والأسئلة متطابقة دلالياً؛ اختلف ترتيب خيارات q1 وq2 بين JSON والسكريبت فقط. اختلاف du في العنوان عن Sie في الحوار والتحذير السياقي لكلمة Ausländer قائمان في النسختين؛ وجودهما تاريخياً لا يحسم ملاءمتهما. | لم يُنسخ أي تعديل تاريخي. سُجل تفاوت السجل وتحذير Ausländer كملاحظتين غير محسومتين، ولم تُستبدل المفردة دون معرفة المقصود ومكان الدورة. | [S1](#s1), [S43](#s43), [S44](#s44), [S45](#s45) |

## التصويبات المطبقة

أداة الفحص والتطبيق: [`scripts/patches/review_a1_dialogues_06.py`](../scripts/patches/review_a1_dialogues_06.py). نجح الفحص المسبق دون كتابة، ثم طُبقت التصويبات الخمس الحقلية وأعيدت قراءة JSON وفحص بنيته. إعادة التشغيل بعد التطبيق لم تكتب شيئاً. تحققت الأداة أولاً من بنية الحوارات الثلاثة، ثم قارنت القيم الحية الخمس الدقيقة بالقيم السابقة أو المصححة. نجح dry-run بلا كتابة؛ طُبقت التصويبات بعده، وأعيدت قراءة JSON المحفوظ والتحقق من الخيارات والمفاتيح والشرح. السكربت يرفض الحالة المختلطة أو أي قيمة غير متوقعة، وهو قابل لإعادة التشغيل دون كتابة إذا كانت التصويبات مطبقة.

- d-a1-16.lines[1] وd-a1-16-q1: استبدال «عصفور» بـ«طائر» لأن Vogel غير محدد النوع؛ تزامن اللفظ في شرح المشتت مع السطر.
- d-a1-16.lines[7]: وصل wiederkommen وفق مدخل Duden لمعنى المجيء مجدداً.
- d-a1-17-q1: استبدال سؤال تنفيذ الابن «أولاً» بسؤال أول مهمة محددة تذكرها الأم، وتحديث الشرح لئلا يدعي ترتيب تنفيذ غير منصوص عليه.

## سجل المراجعة بنداً بنداً

كل صف يعرض لقطة الحقول الحية بعد التعديل، ودليل الحكم وإجراءه. «غير محسوم» لا يعني خطأ مثبتاً. في أسئلة الاختيار، promptAr تعليمة عربية عامة («اختر الإجابة…») وليست ترجمة حرفية لنص السؤال؛ فُحصت كتعليمة مستقلة.

| المعرّف | النوع | المحتوى الذي روجع | الحكم | الدليل والنتيجة | الإجراء | المصادر |
|---|---|---|---|---|---|---|
| d-a1-16 | بيانات الحوار: العنوان والسياق ومرساة المفردات | العنوان الألماني: `Ein Spaziergang in der Natur`<br>العنوان العربي: نزهة في الطبيعة<br>المستوى المسجل: `A1`<br>waisen: die Natur، der Baum، der Fluss، der Wald، der Himmel، die Luft، das Tier، der Vogel، das Pferd، die Kuh، der Mond | سليم | العنوان الألماني «Ein Spaziergang in der Natur» والعربي «نزهة في الطبيعة» يصفان المشهد؛ المشي للترفيه والطبيعة والغابة والحيوانات تظهر في النص. راجعت عناصر waisen الأحد عشر (Natur, Baum, Fluss, Wald, Himmel, Luft, Tier, Vogel, Pferd, Kuh, Mond) ووجدتها مستخدمة في الحوار أو مصروفة. هذا فحص لموضوعات وحقول السجل، لا إعادة تقييم لمستوى CEFR المسجل A1. | أُبقي العنوان والمستوى المسجل وwaisen دون تغيير؛ تقييم CEFR والنسبة وحساب المستوى مؤجلة. | [S1](#s1), [S5](#s5), [S6](#s6), [S7](#s7), [S8](#s8), [S9](#s9), [S10](#s10), [S11](#s11), [S12](#s12), [S14](#s14), [S15](#s15), [S16](#s16) |
| d-a1-16.lines[0] | سطر حوار ألماني وترجمته | المتحدث: `Vater`<br>`Komm, wir gehen in den Wald. Die Luft ist heute gut.`<br>↔ تعال، نذهب إلى الغابة. الهواء اليوم جيد. | سليم | «Komm, wir gehen in den Wald» دعوة إلى الذهاب للغابة، والترجمة «تعال، نذهب إلى الغابة» تحفظها. PONS يطابق Wald بالغابة وLuft بالهواء؛ «الهواء اليوم جيد» ترجمة مباشرة مفهومة، ولا تكفي ملاحظة أن «نقي» أشيع لتصحيحها. | لا تعديل؛ لم أستبدل gut بـ«نقي» لأن ذلك سيضيف معنى لا يفرضه النص. | [S1](#s1), [S7](#s7), [S8](#s8) |
| d-a1-16.lines[1] | سطر حوار ألماني وترجمته | المتحدث: `Kind`<br>`Schau, ein Vogel auf dem Baum! Er singt.`<br>↔ انظر، طائر على الشجرة! يغرّد.<br>قبل التصحيح: {"who":"Kind","de":"Schau, ein Vogel auf dem Baum! Er singt.","ar":"انظر، عصفور على الشجرة! يغرّد."} | مُصحح | الجملة الألمانية تقدم `ein Vogel` غير محدد النوع. PONS يعطي `Vogel` = طائر/طير، فيما يربط `Sperling` بـعصفور/دوري؛ لذلك كانت «عصفور» أضيق من النص، فاستبدلتها بـ«طائر». الإسناد `auf dem Baum` والغناء محفوظان. | صُوّبت الترجمة العربية إلى «طائر» مع إبقاء الجملة الألمانية كما هي؛ عُدّل شرح q1 المتصل للمصطلح نفسه. | [S3](#s3), [S4](#s4), [S9](#s9) |
| d-a1-16.lines[2] | سطر حوار ألماني وترجمته | المتحدث: `Vater`<br>`Ja. Und dort am Fluss stehen zwei Pferde.`<br>↔ نعم. وهناك عند النهر يقف حصانان. | سليم | `am Fluss` يطابق «عند النهر»، و`zwei Pferde` يطابق «حصانان». ترتيب الفعل المفرد قبل الفاعل المثنى في «يقف حصانان» صحيح في العربية الفصحى. | لا تعديل. | [S10](#s10), [S11](#s11) |
| d-a1-16.lines[3] | سطر حوار ألماني وترجمته | المتحدث: `Kind`<br>`Ich sehe auch eine Kuh. Ist die Kuh ein Tier aus dem Wald?`<br>↔ أرى بقرة أيضاً. هل البقرة حيوان من الغابة؟ | سليم | `Kuh` = بقرة و`Tier` = حيوان، و`aus dem Wald` = من الغابة. السؤال عن كون البقرة حيوانًا من الغابة مفهوم بوصفه سؤال الطفل في الحوار، لا دعوى علمية خارج المشهد. | لا تعديل؛ تُقرأ العبارة سؤالًا حواريًا لا حقيقة يقررها النص. | [S1](#s1), [S7](#s7), [S12](#s12), [S16](#s16) |
| d-a1-16.lines[4] | سطر حوار ألماني وترجمته | المتحدث: `Vater`<br>`Nein, die Kuh kommt vom Bauernhof. Im Wald leben andere Tiere.`<br>↔ لا، البقرة من المزرعة. في الغابة تعيش حيوانات أخرى. | سليم | الجواب «لا، البقرة من المزرعة» يقابل `Nein, die Kuh kommt vom Bauernhof`؛ والجملة التالية تطابق «في الغابة تعيش حيوانات أخرى». الترجمات المعجمية لـKuh/Bauernhof/Wald موافقة. | لا تعديل. | [S7](#s7), [S12](#s12), [S13](#s13), [S16](#s16) |
| d-a1-16.lines[5] | سطر حوار ألماني وترجمته | المتحدث: `Kind`<br>`Der Himmel ist so blau. Ich liebe die Natur.`<br>↔ السماء زرقاء جداً. أحب الطبيعة. | سليم | `Himmel` = السماء و`Natur` = الطبيعة؛ «زرقاء جداً» تنقل `so blau` في هذا السياق، ثم «أحب الطبيعة» تطابق `Ich liebe die Natur`. | لا تعديل. | [S6](#s6), [S14](#s14) |
| d-a1-16.lines[6] | سطر حوار ألماني وترجمته | المتحدث: `Vater`<br>`Ich auch. Am Abend sehen wir dann den Mond.`<br>↔ وأنا أيضاً. في المساء نرى القمر. | سليم | `Am Abend` = في المساء و`Mond` = القمر؛ «وأنا أيضاً» تستعيد كلام الطفل، وحذف `dann` في العربية لا يغير العلاقة الزمنية الأساسية. | لا تعديل. | [S15](#s15) |
| d-a1-16.lines[7] | سطر حوار ألماني وترجمته | المتحدث: `Kind`<br>`Können wir morgen wiederkommen?`<br>↔ هل نأتي مجدداً غداً؟<br>قبل التصحيح: {"who":"Kind","de":"Können wir morgen wieder kommen?","ar":"هل نأتي مجدداً غداً؟"} | مُصحح | المعنى العربي «هل نأتي مجدداً غداً؟» يطابق المجيء مرة أخرى. Duden يورد `wiederkommen` متصلة بهذا المعنى (noch einmal kommen)، لذا فالفصل في الألمانية هنا تهجئة غير معيارية. | صُححت كتابة الفعل الألماني إلى `wiederkommen`؛ لم تتغير الترجمة لأنها كانت مطابقة للمعنى. | [S2](#s2) |
| d-a1-16-q1 | سؤال فهم: النص والخيارات والمفتاح والشرح والتعليمات | النوع: `mc`<br>السؤال: `Wo stehen die Pferde?`<br>التعليمة العربية: اختر الإجابة الصحيحة حسب الحوار.<br>الخيارات: auf dem Baum / im Wald / am Fluss<br>المفتاح: `am Fluss`<br>الشرح: الدليل: «dort am Fluss stehen zwei Pferde». الفخّ 1: الطائر على الشجرة. الفخّ 2: الغابة هدف النزهة.<br>قبل التصحيح: {"type":"mc","promptDe":"Wo stehen die Pferde?","options":["auf dem Baum","im Wald","am Fluss"],"answer":"am Fluss","explanationAr":"الدليل: «dort am Fluss stehen zwei Pferde». الفخّ 1: العصفور على الشجرة. الفخّ 2: الغابة هدف النزهة.","id":"d-a1-16-q1","falle":true,"promptAr":"اختر الإجابة الصحيحة حسب الحوار."} | مُصحح | السطر يحدد الخيل عند النهر، لذلك `am Fluss` هو المفتاح الوحيد؛ المشتتان على الشجرة وفي الغابة لا يطابقان الموضع. اقتباس الشرح صحيح. عُدّل فقط «العصفور» إلى «الطائر» ليطابق المعنى العام لـVogel في السطر العربي؛ بقيت التعليمات العربية والخيارات والمفتاح كما هي. | صُحّح لفظ المشتت في الشرح إلى «الطائر» اتساقاً مع تصحيح ترجمة السطر؛ لم يتغير المفتاح أو الخيارات. | [S3](#s3), [S4](#s4), [S9](#s9), [S10](#s10), [S11](#s11) |
| d-a1-16-q2 | سؤال فهم: النص والخيارات والمفتاح والشرح والتعليمات | النوع: `mc`<br>السؤال: `Woher kommt die Kuh?`<br>التعليمة العربية: اختر الإجابة الصحيحة حسب الحوار.<br>الخيارات: vom Bauernhof / aus dem Wald / vom Fluss<br>المفتاح: `vom Bauernhof`<br>الشرح: الدليل: «die Kuh kommt vom Bauernhof». الفخّ 1: «Nein» على سؤال الغابة. | سليم | السؤال `Woher kommt die Kuh?` يطلب مصدر البقرة، والنص يقول صراحة `vom Bauernhof`؛ المفتاح موجود بين الخيارات والشرح يقتبس الدليل ويفسر فخ سؤال الغابة. | لا تعديل؛ الخيارات والمفتاح والشرح والتعليمات متسقة. | [S12](#s12), [S13](#s13), [S7](#s7) |
| d-a1-16-q3 | صواب/خطأ: العبارة والمفتاح والشرح والتعليمات | النوع: `truefalse`<br>السؤال: `Der Vogel singt auf dem Baum.`<br>التعليمة العربية: هل العبارة صحيحة أم خاطئة حسب الحوار؟<br>الخيارات: richtig / falsch<br>المفتاح: `richtig`<br>الشرح: الدليل: «ein Vogel auf dem Baum! Er singt». | سليم | `Der Vogel singt auf dem Baum` يركّب معلومتين من السطر نفسه: Vogel على الشجرة، ثم `Er singt`. مفتاح `richtig` والاقتباس العربي للألمانية يدعمانه؛ لا توجد ترجمة عربية مستقلة للعبارة غير التعليمات. | لا تعديل؛ العبارة مدعومة مباشرة بالنص. | [S3](#s3), [S9](#s9) |
| d-a1-16.dictation[0] | جملة إملاء | الجملة: `Die Luft ist heute gut.` | سليم | الجملة `Die Luft ist heute gut.` واردة حرفياً في السطر الأول؛ ترجمة السطر تعكس Luft = هواء. | لا تعديل؛ الإملاء منقول حرفياً من الحوار. | [S8](#s8) |
| d-a1-16.dictation[1] | جملة إملاء | الجملة: `Der Himmel ist so blau.` | سليم | الجملة `Der Himmel ist so blau.` واردة حرفياً في السطر السادس؛ Himmel = سماء. | لا تعديل؛ الإملاء منقول حرفياً من الحوار. | [S14](#s14) |
| d-a1-17 | بيانات الحوار: العنوان والسياق ومرساة المفردات | العنوان الألماني: `Hausarbeit am Samstag`<br>العنوان العربي: أعمال البيت يوم السبت<br>المستوى المسجل: `A1`<br>waisen: die Wäsche، bügeln، kehren، die Seife، das Handtuch، der Herd، der Topf، die Pfanne، voll، leer، der Schmutz | سليم | عنوان «Hausarbeit am Samstag» وترجمته «أعمال البيت يوم السبت» يصفان المهام المنزلية التي يسندها الحوار. راجعت عناصر waisen الإحدى عشرة (Wäsche, bügeln, kehren, Seife, Handtuch, Herd, Topf, Pfanne, voll, leer, Schmutz) ووجدت كل عنصر مستخدماً في النص بصيغته أو تصريفه. لا يُستنتج من هذا حكم جديد على CEFR. | أُبقي العنوان والمرساة والمستوى المسجل؛ لا حساب أو تصنيف مستوى في هذه الدفعة. | [S1](#s1), [S17](#s17), [S18](#s18), [S19](#s19), [S20](#s20), [S21](#s21), [S22](#s22), [S23](#s23), [S25](#s25), [S27](#s27), [S28](#s28), [S30](#s30) |
| d-a1-17.lines[0] | سطر حوار ألماني وترجمته | المتحدث: `Mutter`<br>`Heute ist Samstag. Wir machen zusammen die Hausarbeit.`<br>↔ اليوم السبت. نقوم بأعمال البيت معاً. | سليم | `Heute ist Samstag` يقابل «اليوم السبت»، و`zusammen die Hausarbeit machen` يقابل القيام بأعمال البيت معاً. PONS يطابق Hausarbeit بمعنى العمل المنزلي. | لا تعديل. | [S1](#s1), [S19](#s19) |
| d-a1-17.lines[1] | سطر حوار ألماني وترجمته | المتحدث: `Sohn`<br>`Okay. Was mache ich?`<br>↔ حسناً. ماذا أفعل؟ | سليم | `Okay. Was mache ich?` سؤال الابن عمّا سيفعله، وترجمته «حسناً. ماذا أفعل؟» تحفظه دون حذف معلومة. | لا تعديل. | [S1](#s1) |
| d-a1-17.lines[2] | سطر حوار ألماني وترجمته | المتحدث: `Mutter`<br>`Du kehrst die Küche. Da ist viel Schmutz auf dem Boden.`<br>↔ تكنس المطبخ. هناك وسخ كثير على الأرض. | سليم | PONS يثبت معنى `kehren` في معنى الكنس ويعرض تصريف `du kehrst`؛ `Schmutz` = وسخ، فالمقابل «تكنس المطبخ. هناك وسخ كثير على الأرض» صحيح المعنى. لم أفرض `fegen` بديلاً لأن مصدر الكنس يؤيد الفعل الموجود. | لا تعديل؛ لا دليل على أن اختيار kehren هنا خطأ. | [S17](#s17), [S18](#s18) |
| d-a1-17.lines[3] | سطر حوار ألماني وترجمته | المتحدث: `Sohn`<br>`Und der Herd? Der Topf und die Pfanne sind noch schmutzig.`<br>↔ والموقد؟ القدر والمقلاة ما زالا متّسخين. | سليم | `Herd/Topf/Pfanne` تطابق موقداً وقدراً ومقلاة؛ `noch schmutzig` = ما زالت متسخة. المثنى العربي «ما زالا متّسخين» يعود إلى القدر والمقلاة. | لا تعديل. | [S18](#s18), [S20](#s20), [S21](#s21), [S22](#s22) |
| d-a1-17.lines[4] | سطر حوار ألماني وترجمته | المتحدث: `Mutter`<br>`Die wasche ich mit Seife. Der Mülleimer ist voll, bring ihn bitte raus.`<br>↔ أغسلهما بالصابون. سلة القمامة ممتلئة، أخرجها من فضلك. | سليم | `Die` تعود على القدر والمقلاة المذكورين معاً؛ لذلك «أغسلهما» مطابق للمثنى العربي، و`mit Seife` = بالصابون. `Mülleimer ist voll` و`bring ihn ... raus` نُقلا إلى سلة القمامة الممتلئة وطلب إخراجها؛ تأنيث الضمير العربي يطابق «السلة». | لا تعديل؛ مرجع Die والضمير العربي واضحان من السياق. | [S21](#s21), [S22](#s22), [S23](#s23), [S24](#s24), [S26](#s26) |
| d-a1-17.lines[5] | سطر حوار ألماني وترجمته | المتحدث: `Sohn`<br>`Gut. Und die Wäsche? Der Korb ist auch voll.`<br>↔ حسناً. والغسيل؟ السلة ممتلئة أيضاً. | سليم | `Wäsche` هنا الغسيل، و`Korb` السلة؛ «السلة ممتلئة أيضاً» مفهومة من سياق سلة الغسيل. حذف تحديد «الغسيل» بعد كلمة السلة لا يسبب التباساً في هذا السياق. | لا تعديل. | [S24](#s24), [S25](#s25), [S29](#s29) |
| d-a1-17.lines[6] | سطر حوار ألماني وترجمته | المتحدث: `Mutter`<br>`Die Wäsche wasche ich, du bügelst danach die Hemden.`<br>↔ الغسيل أغسله أنا، وأنت تكوي القمصان بعده. | سليم | التركيب `Die Wäsche wasche ich` يقدّم الغسيل ثم يصرّف الفعل مع ich؛ وبعدها `du bügelst ... danach` يسند الكيّ للابن لاحقاً. العربية تحفظ فصل المهمتين وتوقيتهما، وPONS يطابق Wäsche/waschen/bügeln بالمعاني المستخدمة. | لا تعديل؛ `danach` واضح في الترجمة «بعده». | [S25](#s25), [S26](#s26), [S27](#s27) |
| d-a1-17.lines[7] | سطر حوار ألماني وترجمته | المتحدث: `Sohn`<br>`Und die Handtücher? Der Schrank ist leer.`<br>↔ والمناشف؟ الخزانة فارغة. | سليم | `Handtücher` جمع Handtuch (مناشف)، و`Schrank` خزانة؛ الترجمة تحفظ الاسمين وحالة الخزانة الفارغة. الربط الحواري مقتضب لكنه غير متناقض بما يوجب تغييراً. | لا تعديل؛ لا أضيف جواباً أو تفسيراً غير موجودين في الحوار. | [S28](#s28), [S30](#s30) |
| d-a1-17-q1 | سؤال فهم: النص والخيارات والمفتاح والشرح والتعليمات | النوع: `mc`<br>السؤال: `Welche Aufgabe nennt die Mutter zuerst?`<br>التعليمة العربية: اختر الإجابة الصحيحة حسب الحوار.<br>الخيارات: Er kehrt die Küche. / Er wäscht den Topf. / Er bügelt die Hemden.<br>المفتاح: `Er kehrt die Küche.`<br>الشرح: الدليل: «Du kehrst die Küche»؛ هذه أول مهمة محددة تذكرها الأم، لا دليلاً على ترتيب تنفيذ الأعمال. الفخّ 1: الأم تغسل القدر. الفخّ 2: الكيّ ذُكر «danach».<br>قبل التصحيح: {"type":"mc","promptDe":"Was macht der Sohn zuerst?","options":["Er kehrt die Küche.","Er wäscht den Topf.","Er bügelt die Hemden."],"answer":"Er kehrt die Küche.","explanationAr":"الدليل: «Du kehrst die Küche». الفخّ 1: القدر تغسله الأم. الفخّ 2: الكيّ «danach».","id":"d-a1-17-q1","falle":true,"promptAr":"اختر الإجابة الصحيحة حسب الحوار."} | مُصحح | الصيغة القديمة «Was macht der Sohn zuerst?» تسأل عمّا ينفذه الابن أولاً، لكن الحوار يذكر له مهمة الكنس ولا يصرح بترتيب التنفيذ؛ والكيّ مسند إليه أيضاً لاحقاً (`danach`). صيغ السؤال الآن عن المهمة التي تذكرها الأم أولاً؛ أول مهمة محددة هي كنس المطبخ، فيبقى المفتاح وحيداً وتظل بقية الخيارات مشتتات مناسبة. Duden يثبت دلالة «zuerst» في الترتيب، ويعطي مثال «der zuerst genannte»؛ PONS يساند Aufgabe/nennen. | استُبدل سؤال ترتيب التنفيذ بسؤال ترتيب ذكر المهمة، وحُدّث الشرح كي لا يوحي بأن الحوار يحدد ترتيب إنجاز الأعمال. بقيت الخيارات والمفتاح والتعليمات كما هي. | [S17](#s17), [S27](#s27), [S31](#s31), [S32](#s32), [S33](#s33) |
| d-a1-17-q2 | سؤال فهم: النص والخيارات والمفتاح والشرح والتعليمات | النوع: `mc`<br>السؤال: `Was ist leer?`<br>التعليمة العربية: اختر الإجابة الصحيحة حسب الحوار.<br>الخيارات: der Mülleimer / der Schrank / der Korb mit der Wäsche<br>المفتاح: `der Schrank`<br>الشرح: الدليل: «Der Schrank ist leer». الفخّ: سلة القمامة وسلة الغسيل «voll». | سليم | النص يقول حرفياً `Der Schrank ist leer`؛ المفتاح `der Schrank` موجود بين الخيارات. الشرح يميّز بوضوح بين السلتين الممتلئتين والخزانة الفارغة. | لا تعديل؛ المفتاح والخيارات والشرح متطابقة مع الحوار. | [S24](#s24), [S29](#s29), [S30](#s30) |
| d-a1-17-q3 | ملء فراغ: النص والإجابة والشرح والتعليمات | النوع: `fill`<br>السؤال: `Die wasche ich mit ___.`<br>التعليمة العربية: أكمل الفراغ بالكلمة المناسبة من الحوار.<br>المفتاح: `Seife`<br>الشرح: الدليل: «Die wasche ich mit Seife». | سليم | `Die wasche ich mit ___.` يستعيد تتمة الجملة `mit Seife`؛ الإجابة الوحيدة المقصودة `Seife`، والشرح يقتبس النص حرفياً. | لا تعديل؛ المفتاح يطابق التركيب المنقول. | [S23](#s23), [S26](#s26) |
| d-a1-17.dictation[0] | جملة إملاء | الجملة: `Da ist viel Schmutz auf dem Boden.` | سليم | الجملة `Da ist viel Schmutz auf dem Boden.` موجودة حرفياً في السطر الثالث، وSchmutz = وسخ. | لا تعديل؛ الإملاء منقول حرفياً من الحوار. | [S18](#s18) |
| d-a1-17.dictation[1] | جملة إملاء | الجملة: `Der Mülleimer ist voll, bring ihn bitte raus.` | سليم | الجملة `Der Mülleimer ist voll, bring ihn bitte raus.` موجودة حرفياً في السطر الخامس، والترجمة تميز سلة القمامة عن سلة الغسيل. | لا تعديل؛ الإملاء منقول حرفياً من الحوار. | [S24](#s24) |
| d-a1-18 | بيانات الحوار: العنوان والسياق ومرساة المفردات | العنوان الألماني: `Woher kommst du?`<br>العنوان العربي: من أين أنت؟<br>المستوى المسجل: `A1`<br>waisen: die Heimat، der Ausländer، die Nationalität، die Muttersprache، das Wörterbuch، übersetzen، die Sprache، der Nachname، ledig، verheiratet | غير محسوم | العنوان `Woher kommst du?` يختار المخاطبة غير الرسمية، بينما يبدأ النص بـ`Herr Haddad` ويستخدم Sie/Ihre الرسمية؛ Duden يميز duzen عن siezen. قد يكون العنوان تسمية موضوع عامة لا اقتباساً من هذا الحوار، لذلك أسجل تفاوت سجل تحريري ولا أعدّه خطأً مؤكداً. عناصر waisen العشرة تظهر في النص أو بتصريفها؛ لم يُجرَ تقييم CEFR أو حساب مستوى. | لا تعديل تخمينياً للعنوان أو المستوى؛ يُترك تفاوت السجل ملاحظة تحريرية غير محسومة. | [S1](#s1), [S35](#s35), [S43](#s43), [S44](#s44), [S45](#s45) |
| d-a1-18.lines[0] | سطر حوار ألماني وترجمته | المتحدث: `Lehrer`<br>`Herr Haddad, welche Nationalität haben Sie?`<br>↔ سيد حدّاد، ما جنسيتك؟ | سليم | `Herr Haddad` مع `Sie` صيغة رسمية؛ و`Nationalität` = الجنسية. الترجمة «سيد حدّاد، ما جنسيتك؟» تنقل السؤال، مع ملاحظة أن العربية لا تملك مقابلاً صرفياً مباشراً لتمييز Sie/du في الضمير المستعمل هنا. | لا تعديل؛ فرق السجل في اللغتين لا يثبت خطأً في نقل معنى السؤال. | [S36](#s36), [S45](#s45) |
| d-a1-18.lines[1] | سطر حوار ألماني وترجمته | المتحدث: `Haddad`<br>`Ich bin Tunesier. Meine Heimat ist Sfax.`<br>↔ أنا تونسي. وطني صفاقس. | سليم | `Tunesier` يطابق «تونسي»، و`Heimat` يطابق «الوطن»؛ «وطني صفاقس» ينقل أن صفاقس وطن المتحدث الخيالي، لكنه لا يثبت حقيقة سيرة شخص بعينه. | لا تعديل؛ هذه معلومة شخصية داخل مشهد تعليمي خيالي. | [S34](#s34), [S35](#s35) |
| d-a1-18.lines[2] | سطر حوار ألماني وترجمته | المتحدث: `Lehrer`<br>`Und Ihre Muttersprache ist Arabisch?`<br>↔ ولغتك الأم العربية؟ | سليم | السؤال التأكيدي `Und Ihre Muttersprache ist Arabisch?` يقابل «ولغتك الأم العربية؟»؛ Muttersprache = اللغة الأم، وعلامة الاستفهام محفوظة. | لا تعديل. | [S37](#s37), [S45](#s45) |
| d-a1-18.lines[3] | سطر حوار ألماني وترجمته | المتحدث: `Haddad`<br>`Ja. Ich spreche auch Französisch. Deutsch ist meine dritte Sprache.`<br>↔ نعم. أتكلم الفرنسية أيضاً. الألمانية لغتي الثالثة. | سليم | الجواب يذكر الفرنسية ثم يصرح بأن الألمانية اللغة الثالثة؛ العربية تحفظ `auch` و`dritte Sprache`. السؤال/الجواب لا يخلطان بين اللغة الأم واللغة الثالثة. | لا تعديل؛ العبارة وصف ذاتي خيالي لا يُتحقق من صدقه خارج النص. | [S1](#s1), [S37](#s37) |
| d-a1-18.lines[4] | سطر حوار ألماني وترجمته | المتحدث: `Lehrer`<br>`Sehr gut. Wie schreibt man Ihren Nachnamen?`<br>↔ ممتاز. كيف يُكتب اسم عائلتك؟ | سليم | `Wie schreibt man Ihren Nachnamen?` يسأل عن تهجئة اسم العائلة، والعربية «كيف يُكتب اسم عائلتك؟» تحفظ المعنى بصيغة مبنية للمجهول. الصيغة `Ihren` رسمها الرسمي محفوظ في الألمانية. | لا تعديل. | [S38](#s38), [S45](#s45) |
| d-a1-18.lines[5] | سطر حوار ألماني وترجمته | المتحدث: `Haddad`<br>`H-A-D-D-A-D. Darf ich im Kurs ein Wörterbuch benutzen?`<br>↔ H-A-D-D-A-D. هل يمكنني استعمال قاموس في الدورة؟ | سليم | حروف الاسم المنقولة حرفياً تتبعها إمكانية استعمال قاموس في الدورة؛ Wörterbuch = قاموس/معجم. تكرار الحروف اللاتينية في العربية مقصود لإملاء اسم Haddad. | لا تعديل؛ لا أستبدل اسم الشخص أو أتحقق من هوية واقعية غير موجودة. | [S1](#s1), [S39](#s39) |
| d-a1-18.lines[6] | سطر حوار ألماني وترجمته | المتحدث: `Lehrer`<br>`Ja, aber übersetzen Sie nicht jedes Wort. Sind Sie verheiratet?`<br>↔ نعم، لكن لا تترجم كل كلمة. هل أنت متزوج؟ | سليم | `übersetzen Sie nicht jedes Wort` نهي رسمي عن ترجمة كل كلمة، يتبعه سؤال رسمي عن الزواج؛ PONS يميز معنى übersetzen = يترجم، وverheiratet = متزوج. الصيغة العربية مفهومة مع أن نظام الأدب فيها غير مطابق صرفياً لـSie. | لا تعديل؛ تُسجل ملاحظة اختلاف نظام المخاطبة لا خطأ ترجمة مؤكداً. | [S40](#s40), [S42](#s42), [S45](#s45) |
| d-a1-18.lines[7] | سطر حوار ألماني وترجمته | المتحدث: `Haddad`<br>`Nein, ich bin ledig. Viele Ausländer im Kurs sind auch ledig.`<br>↔ لا، أنا أعزب. كثير من الأجانب في الدورة عزّاب أيضاً. | غير محسوم | PONS يطابق ledig بـ«أعزب»، والترجمة الأولى صحيحة. Duden يعرّف Ausländer بمواطن دولة أجنبية، ويخص تحذيره من التمييز بوصف ذوي الأصل الأجنبي المقيمين في بلد المتكلم؛ الحوار لا يحدد موقع الدورة ولا مرجع الكلمة. كما أن دعوى «كثير من ... في الدورة عزّاب» تخص مشهداً خيالياً ولا تقدم بيانات سكانية. لا تكفي هذه المعطيات لتصحيح الكلمة تلقائياً أو تعميم حكم على جماعة. | أُبقي النص كما هو مع تسجيل تحفظ سياقي فقط؛ لا استبدال تخمينياً بـMigrant/Teilnehmer ولا اعتماد وصف تمييزي دون تحديد المقصود والبلد. | [S1](#s1), [S41](#s41), [S43](#s43) |
| d-a1-18-q1 | سؤال فهم: النص والخيارات والمفتاح والشرح والتعليمات | النوع: `mc`<br>السؤال: `Welche Sprache ist die dritte Sprache von Herrn Haddad?`<br>التعليمة العربية: اختر الإجابة الصحيحة حسب الحوار.<br>الخيارات: Französisch / Deutsch / Arabisch<br>المفتاح: `Deutsch`<br>الشرح: الدليل: «Deutsch ist meine dritte Sprache». الفخّ 1: الفرنسية الثانية. الفخّ 2: العربية الأم. | سليم | السطر يصرح `Deutsch ist meine dritte Sprache`; لذا `Deutsch` هو المفتاح، بينما يذكر أن الفرنسية تُتحدث أيضاً وأن العربية الأم. الخيارات الثلاثة مختلفة والشرح يقتبس الدليل. | لا تعديل؛ المفتاح والشرح يطابقان ترتيب اللغات المصرح به في الحوار. | [S34](#s34), [S37](#s37), [S1](#s1) |
| d-a1-18-q2 | سؤال فهم: النص والخيارات والمفتاح والشرح والتعليمات | النوع: `mc`<br>السؤال: `Ist Herr Haddad verheiratet?`<br>التعليمة العربية: اختر الإجابة الصحيحة حسب الحوار.<br>الخيارات: Ja, seine Frau ist in Sfax. / Ja, er ist verheiratet. / Nein, er ist ledig.<br>المفتاح: `Nein, er ist ledig.`<br>الشرح: الدليل: «Nein, ich bin ledig». الفخّ: صفاقس هي الوطن لا مكان الزوجة. | سليم | الإجابة `Nein, ich bin ledig` تنفي الزواج وتؤيد `Nein, er ist ledig`. الخيار عن زوجة في صفاقس مشتت لا يسنده النص، والشرح يميز الوطن عن مكان الزوجة. | لا تعديل؛ المفاتيح والخيارات والشرح متسقة مع الحوار الخيالي. | [S35](#s35), [S41](#s41), [S42](#s42) |
| d-a1-18-q3 | صواب/خطأ: العبارة والمفتاح والشرح والتعليمات | النوع: `truefalse`<br>السؤال: `Er darf im Kurs ein Wörterbuch benutzen.`<br>التعليمة العربية: هل العبارة صحيحة أم خاطئة حسب الحوار؟<br>الخيارات: richtig / falsch<br>المفتاح: `richtig`<br>الشرح: الدليل: «Ja, aber übersetzen Sie nicht jedes Wort». | سليم | المعلم يجيب `Ja, aber übersetzen Sie nicht jedes Wort` بعد سؤال الإذن باستعمال قاموس؛ لذلك العبارة `Er darf ... ein Wörterbuch benutzen` صحيحة مع القيد المذكور. الشرح يقتبس جواب المعلم. | لا تعديل؛ الشرح يورد القيد بدلاً من إسقاطه. | [S39](#s39), [S40](#s40) |
| d-a1-18.dictation[0] | جملة إملاء | الجملة: `Meine Heimat ist Sfax.` | سليم | الجملة `Meine Heimat ist Sfax.` منقولة حرفياً من السطر الثاني؛ الترجمة المقابلة «وطني صفاقس» محفوظة في الحوار. | لا تعديل؛ لا أتحقق من هوية المتحدث الخيالي أو مسقط رأسه. | [S35](#s35) |
| d-a1-18.dictation[1] | جملة إملاء | الجملة: `Deutsch ist meine dritte Sprache.` | سليم | الجملة `Deutsch ist meine dritte Sprache.` منقولة حرفياً من السطر الرابع، وتطابق «الألمانية لغتي الثالثة». | لا تعديل. | [S1](#s1), [S37](#s37) |

## المصادر المنشورة

فُتحت الصفحات أو استُخدمت نتائجها المباشرة بتاريخ 2026-10-05؛ يدعم كل مصدر نقطة لغوية محددة فقط. القاموس لا يثبت بمفرده طبيعية كل جملة أو وقائع الحوار.


<a id="s1"></a>S1 — [Goethe-Institut — Goethe-Zertifikat A1 Start Deutsch 1 Wortliste](https://www.goethe.de/pro/relaunch/prf/de/A1_SD1_Wortliste_02.pdf). يحدد موضوعات A1 ذات الصلة هنا (الشخص، الجنسية/الأصل، البيئة والحيوانات، المنزل، تعلّم اللغات) تُستخدم هنا لمطابقة المجال الموضوعي فقط، لا لإعادة حساب المستوى.

<a id="s2"></a>S2 — [Duden — wiederkommen](https://www.duden.de/rechtschreibung/wiederkommen). يفصل بين العودة/المجيء مرة أخرى، ويعرض الكتابة المتصلة `wiederkommen` في معنى «noch einmal kommen» مع مثال وتصريف؛ يسند إصلاح تهجئة السطر.

<a id="s3"></a>S3 — [PONS — Vogel (German–Arabic)](https://en.pons.com/translate/german-arabic/Vogel). يعطي للمفردة العامة `Vogel` المقابلين العربيين `طائر` و`طير`؛ يسند إبقاء النوع عاماً.

<a id="s4"></a>S4 — [PONS — Sperling (German–Arabic)](https://en.pons.com/translate/german-arabic/Sperling). يربط `Sperling` بـ`عصفور/دوري`؛ مع S3 يبين أن `عصفور` أخص من `Vogel` في القاموس.

<a id="s5"></a>S5 — [Duden — Spaziergang](https://www.duden.de/rechtschreibung/Spaziergang). يعرّف Spaziergang بأنه مشي/جولة للنزهة أو الاستجمام؛ يسند معنى العنوان فقط، لا حكم مستوى.

<a id="s6"></a>S6 — [PONS — Natur (German–Arabic)](https://en.pons.com/translate/german-arabic/Natur). يعطي معنى Natur = طبيعة، بما يساند ترجمة العنوان والسطر.

<a id="s7"></a>S7 — [PONS — Wald (German–Arabic)](https://en.pons.com/translate/german-arabic/Wald). يعطي معنى Wald = غابة، بما يساند الأسطر ذات الصلة.

<a id="s8"></a>S8 — [PONS — Luft (German–Arabic)](https://en.pons.com/translate/german-arabic/Luft). يعطي Luft = هواء/جو؛ لم تُستنتج منه طبيعية كل تركيب مع gut.

<a id="s9"></a>S9 — [PONS — Baum (German–Arabic)](https://en.pons.com/translate/german-arabic/Baum). يعطي Baum = شجرة، ويدعم مرجع المشتت على الشجرة.

<a id="s10"></a>S10 — [PONS — Fluss (German–Arabic)](https://en.pons.com/translate/german-arabic/Fluss). يعطي Fluss (المجرى المائي) = نهر، ويدعم سؤال موضع الخيل.

<a id="s11"></a>S11 — [PONS — Pferd (German–Arabic)](https://en.pons.com/translate/german-arabic/Pferd). يعطي Pferd = حصان/فرس/خيل وفق السياق؛ الزوجان في الحوار حصانان.

<a id="s12"></a>S12 — [PONS — Kuh (German–Arabic)](https://en.pons.com/translate/german-arabic/Kuh). يعطي Kuh = بقرة.

<a id="s13"></a>S13 — [PONS — Bauernhof (German–Arabic)](https://en.pons.com/translate/german-arabic/Bauernhof). يعطي Bauernhof = مزرعة؛ يسند جواب سؤال البقرة وترجمته.

<a id="s14"></a>S14 — [PONS — Himmel (German–Arabic)](https://en.pons.com/translate/german-arabic/Himmel). يعطي Himmel = سماء.

<a id="s15"></a>S15 — [PONS — Mond (German–Arabic)](https://en.pons.com/translate/german-arabic/Mond). يعطي Mond = قمر.

<a id="s16"></a>S16 — [PONS — Tier (German–Arabic)](https://en.pons.com/translate/german-arabic/Tier). يعطي Tier = حيوان.

<a id="s17"></a>S17 — [PONS — kehren (German–Arabic)](https://en.pons.com/translate/german-arabic/kehren). يميز معنى `kehren` بمعنى `fegen` ويعطي المقابل `كنس`، ويعرض تصريف `du kehrst`؛ يسند معنى الفعل في المهمة.

<a id="s18"></a>S18 — [PONS — Schmutz (German–Arabic)](https://en.pons.com/translate/german-arabic/Schmutz). يعطي Schmutz = وسخ/قذر، بما يساند ترجمة سطر الأرضية والإملاء.

<a id="s19"></a>S19 — [PONS — Hausarbeit (German–Arabic)](https://en.pons.com/translate/german-arabic/Hausarbeit). يعطي معنى العمل المنزلي، ويسند عنوان الحوار وترجمته.

<a id="s20"></a>S20 — [PONS — Herd (German–Arabic)](https://en.pons.com/translate/german-arabic/Herd). يعطي Herd = موقد في معنى جهاز الطهي.

<a id="s21"></a>S21 — [PONS — Topf (German–Arabic)](https://en.pons.com/translate/german-arabic/Topf). يعطي Topf = قدر/طنجرة.

<a id="s22"></a>S22 — [PONS — Pfanne (German–Arabic)](https://en.pons.com/translate/german-arabic/Pfanne). يعطي Pfanne = مقلاة.

<a id="s23"></a>S23 — [PONS — Seife (German–Arabic)](https://en.pons.com/translate/german-arabic/Seife). يعطي Seife = صابون.

<a id="s24"></a>S24 — [PONS — Mülleimer (German–Arabic)](https://en.pons.com/translate/german-arabic/M%C3%BClleimer). يعطي معنى سلة/صندوق القمامة؛ يسند السطر والمشتت.

<a id="s25"></a>S25 — [PONS — Wäsche (German–Arabic)](https://en.pons.com/translate/german-arabic/W%C3%A4sche). يفصل استعمال Wäsche بمعنى الغسيل/المغسولات عن معاني أخرى؛ يساند سياق السلة والغسل.

<a id="s26"></a>S26 — [PONS — waschen (German–Arabic)](https://en.pons.com/translate/german-arabic/waschen). يعطي waschen = غسل ويعرض تصريف الفعل؛ يسند الجملة والفراغ.

<a id="s27"></a>S27 — [PONS — bügeln (German–Arabic)](https://en.pons.com/translate/german-arabic/b%C3%BCgeln). يعطي bügeln = كوى ويعرض تصريفه؛ يسند مهمة القمصان.

<a id="s28"></a>S28 — [PONS — Handtuch (German–Arabic)](https://en.pons.com/translate/german-arabic/Handtuch). يعطي Handtuch = منشفة؛ صيغة الحوار جمع Handtücher.

<a id="s29"></a>S29 — [PONS — Korb (German–Arabic)](https://en.pons.com/translate/german-arabic/Korb). يعطي Korb = سلة.

<a id="s30"></a>S30 — [PONS — Schrank (German–Arabic)](https://en.pons.com/translate/german-arabic/Schrank). يعطي Schrank = خزانة/دولاب.

<a id="s31"></a>S31 — [Duden — zuerst](https://www.duden.de/rechtschreibung/zuerst). يشرح «als Erstes» في ترتيب النشاط، ويورد أيضًا مثال «der zuerst genannte Verfasser» (الأول المذكور)؛ يسند تضييق السؤال إلى أول مهمة تذكرها الأم، لا أول مهمة ينفذها الابن.

<a id="s32"></a>S32 — [PONS — Aufgabe (German–Arabic)](https://en.pons.com/translate/german-arabic/Aufgabe). يعطي Aufgabe في معنى task = مهمة/واجب؛ يسند صياغة سؤال المهمة.

<a id="s33"></a>S33 — [PONS — nennen (German–Arabic)](https://en.pons.com/translate/german-arabic/nennen). يعطي nennen بمعنى يسمّي/يذكر، ويعرض التصريف؛ يسند سؤال «أي مهمة تذكرها الأم؟».

<a id="s34"></a>S34 — [PONS — Tunesier (German–Arabic)](https://en.pons.com/translate/german-arabic/Tunesier). يعطي Tunesier = تونسي؛ لا يثبت هوية المتحدث الخيالي.

<a id="s35"></a>S35 — [PONS — Heimat (German–Arabic)](https://en.pons.com/translate/german-arabic/Heimat). يعطي Heimat = الوطن؛ يسند الترجمة، ولا يثبت مكان إقامة شخصية خيالية.

<a id="s36"></a>S36 — [PONS — Nationalität (German–Arabic)](https://en.pons.com/translate/german-arabic/Nationalit%C3%A4t). يعطي Nationalität = جنسية.

<a id="s37"></a>S37 — [PONS — Muttersprache (German–Arabic)](https://en.pons.com/translate/german-arabic/Muttersprache). يعطي Muttersprache = اللغة الأم؛ يسند السؤال والشرح.

<a id="s38"></a>S38 — [PONS — Nachname (German–Arabic)](https://en.pons.com/translate/german-arabic/Nachname). يعطي Nachname = اسم العائلة/اللقب.

<a id="s39"></a>S39 — [PONS — Wörterbuch (German–Arabic)](https://en.pons.com/translate/german-arabic/W%C3%B6rterbuch). يعطي Wörterbuch = معجم/قاموس.

<a id="s40"></a>S40 — [PONS — übersetzen (German–Arabic)](https://en.pons.com/translate/german-arabic/%C3%BCbersetzen). يميز معنى «يترجم» ويعرض تصريف übersetzen؛ يسند تحذير المعلم والشرح.

<a id="s41"></a>S41 — [PONS — ledig (German–Arabic)](https://en.pons.com/translate/german-arabic/ledig). يعطي ledig = أعزب/عازب؛ لا يثبت الحالة الاجتماعية لشخص حقيقي.

<a id="s42"></a>S42 — [PONS — verheiratet (German–Arabic)](https://en.pons.com/translate/german-arabic/verheiratet). يعطي verheiratet = متزوج.

<a id="s43"></a>S43 — [Duden — Ausländer](https://www.duden.de/rechtschreibung/Auslaender). يعرف اللفظ بأنه مواطن دولة أجنبية، وينبه تحديدًا إلى أن وصف ذوي الأصل الأجنبي المقيمين في بلد المتكلم به يُعدّ على نحو متزايد تمييزيًا؛ هذا التحذير مشروط بالسياق ولا يثبت وحده حكمًا على حوار موقعه غير محدد.

<a id="s44"></a>S44 — [Duden — duzen](https://www.duden.de/rechtschreibung/duzen). يعرف duzen بأنه مخاطبة شخص بصيغة Du؛ يسند ملاحظة اختلاف سجل العنوان عن الحوار.

<a id="s45"></a>S45 — [Duden — siezen](https://www.duden.de/rechtschreibung/siezen). يعرف siezen بأنه مخاطبة شخص بصيغة Sie؛ يسند ملاحظة اختلاف سجل العنوان عن الحوار.

هذه مراجعة مساعد ذكاء اصطناعي مدعومة بالمصادر؛ ليست مراجعة بشرية أو اعتماداً لغوياً أو مدرسياً أو مهنياً. CEFR/النسبة/حساب المستوى مؤجلة.
