# تقرير R156 — مراجعة النصوص A1 (t-a1-021..035)

- **التاريخ:** 11 أكتوبر 2026
- **النطاق:** النصوص الخمسة عشر غير المغطاة سابقاً في مراجعة نصوص A1؛ فُحصت الجمل الألمانية وترجماتها والأسئلة الثلاثون وخياراتها ومفاتيحها وشروحها.
- **الرقعة:** `scripts/patches/review_a1_texts_04.py` — 23 انتقالاً محروساً بقيم سابقة دقيقة؛ التشغيل قابل للتكرار.
- **الحصيلة:** 15 نصاً، 1,619 كلمة ألمانية، 202 علامة نهاية جملة/دور حواري، 30 سؤالاً، 23 حقلاً مصححاً، غير محسوم: 0.

## الحكم

> صُحّح استعمال Warmmiete وترجمته، وعدد الأحذية في العربية، واتساق الطبيبة مع العنوان وصياغة التشخيص كاحتمال. وُحّدت أسئلة نص عطلة نهاية الأسبوع مع ضمير المتكلم، واكتمل دليل سؤال الأحد. صُقلت إحالة البائعة والإرشاد عند الإشارة، وفُصل العصير عن الأواني دون اختراع تفصيل أو تسجيل صوتي. بقيت مفاتيح الأسئلة الثلاثين مطابقة. لا ادعاء بالاستماع أو بمراجعة CEFR أو بالتحقق الخارجي من أسعار/طقس/نصيحة طبية.

## ملخص الموارد

| المعرّف | العنوان | الكلمات | الأسئلة | الحقول | خلاصة التدقيق |
|---|---|---:|---:|---:|---|
| `t-a1-021` | عائلة كريم في كولونيا / Karims Familie in Köln | 98 | 2 | 0 | العائلة والأعمار وأماكن الإقامة والزيارة السنوية والهاتف متسقة؛ مفتاحا السكن والزيارة يطابقان النص. |
| `t-a1-022` | روتيني اليومي / Mein Tagesablauf | 110 | 2 | 0 | أوقات اليوم والتنقل والفطور والعمل متسقة؛ «halb sieben» = السادسة والنصف، ومكونات الفطور واضحة. |
| `t-a1-023` | شقتي / Meine Wohnung | 113 | 2 | 5 | الغرف والأثاث متسقة؛ صحّح المصطلح إلى Warmmiete وترجمته. مبلغ 600 يورو رقم داخل قصة تدريبية، لا مرجع لسوق الإيجار. |
| `t-a1-024` | نهاية أسبوع في لايبزيغ / Ein Wochenende in Leipzig | 121 | 2 | 0 | مسار الحياة اليومية والترام والمخبز والحديقة متسق داخل مشهد لا يحدد عنواناً حقيقياً؛ الجوابان مدعومان. |
| `t-a1-025` | في السوبرماركت / Im Supermarkt | 119 | 2 | 2 | قائمة المشتريات والبطاقة والإجمالي 12 يورو متسقة كما يوردها النص؛ لم تُخترع أسعار مفردة غير موجودة. |
| `t-a1-026` | يوم مشمس في الحديقة / Ein sonniger Tag im Park | 110 | 2 | 0 | طقس اليوم والأنشطة المسائية سرد تدريبي؛ 20 درجة تقريبية مذكورة وتطابق المفتاح، لا تقرير طقس راهن موثق. |
| `t-a1-027` | هوايتي: كرة القدم / Mein Hobby | 105 | 2 | 0 | كرة القدم والقاعة والمرمى ووقت اللعب متسقة؛ سؤالا مكان اللعب وما بعده لهما دليل مباشر. |
| `t-a1-028` | مهنتي / Mein Beruf | 108 | 2 | 0 | المهنة والورشة وساعات العمل مترابطة؛ سؤال الشركة يطابق وصف إنتاج آلات للسيارات. |
| `t-a1-029` | ملابسي / Meine Kleidung | 103 | 2 | 1 | الملابس والألوان والإضافات الشتوية متسقة؛ صُحّح فقط الجمع في ترجمة الأحذية. |
| `t-a1-030` | زيارة الطبيبة / Besuch bei der Ärztin | 119 | 2 | 2 | تطابق مرجع الطبيبة وأزيل الجزم بالتشخيص؛ الوصفة والدواء غير محددين، والنص حوار تدريبي لا إرشاد طبي. |
| `t-a1-031` | حيواني الأليف / Mein Haustier | 111 | 2 | 0 | اسم القطة وعمرها وألوانها وروتينها متسق؛ الإجابتان لهما شاهدان حرفيان. |
| `t-a1-032` | عطلة نهاية الأسبوع / Am Wochenende | 101 | 2 | 10 | روتين السبت والأحد متسق؛ وُحّدت الأسئلة والاختيارات والمفاتيح مع Ich وأصبح شرح سؤال الأحد يغطي جزأي الإجابة. |
| `t-a1-033` | الطعام والشراب / Essen und Trinken | 99 | 2 | 0 | الفطور والغداء والعشاء والمشروبات متسقة؛ السؤالان يختبران معلومات منصوصاً عليها. |
| `t-a1-034` | السؤال عن الطريق إلى محطة القطار / Nach dem Weg zum Bahnhof fragen | 90 | 2 | 1 | الاتجاه عند الإشارة وخط الحافلة 3 واضحان؛ صُقلت عبارة الانعطاف لمنع فهمها بعد تجاوز الإشارة. |
| `t-a1-035` | عيد ميلادي / Geburtstag | 112 | 2 | 2 | العمر والهدايا وتسلسل المناسبة متسق؛ صُقلت جملة ما على الطاولة ولم تُضف باقة إلى ترجمة Blumen. |

## التصحيحات التفصيلية

تُعرض القيم السابقة واللاحقة من مقارنة `HEAD` السابق للدفعة ببيانات `content/texts.json` الحالية. القوائم تعرض خيارات السؤال كاملة عند تغييرها.

### `t-a1-021` — عائلة كريم في كولونيا / Karims Familie in Köln

- لم يتطلب النص تصحيحاً مثبتاً؛ فُحصت فقراته وترجمته وأسئلته ومفاتيحه. العائلة والأعمار وأماكن الإقامة والزيارة السنوية والهاتف متسقة؛ مفتاحا السكن والزيارة يطابقان النص.

### `t-a1-022` — روتيني اليومي / Mein Tagesablauf

- لم يتطلب النص تصحيحاً مثبتاً؛ فُحصت فقراته وترجمته وأسئلته ومفاتيحه. أوقات اليوم والتنقل والفطور والعمل متسقة؛ «halb sieben» = السادسة والنصف، ومكونات الفطور واضحة.

### `t-a1-023` — شقتي / Meine Wohnung

- **`t-a1-023.ar`** — ترجمة Warmmiete إلى «الإيجار الشامل» بدلاً من حصر المعنى في التدفئة وحدها.
  - قبل: «شقتي ليست كبيرة لكنها مشرقة جداً. فيها غرفتان ومطبخ وحمّام وشرفة صغيرة. في غرفة المعيشة أريكة وطاولة وتلفاز. أنام مع زوجتي في إحدى الغرف. والغرفة الثانية مكتبنا. يدخل ضوء كثير من النوافذ صباحاً. أطبخ كل مساء في المطبخ. وهناك أيضاً طاولة صغيرة وأربعة كراسٍ. في الشرفة كرسيان وكثير من الزهور. أحب تناول الفطور هناك في الصيف. الإيجار الشامل للتدفئة ستمئة يورو. تقع الشقة قرب موقف حافلات. يزورنا أصدقاؤنا في نهاية الأسبوع ونشرب القهوة في غرفة المعيشة. أنا راضٍ جداً عن شقتي.»
  - بعد: «شقتي ليست كبيرة لكنها مشرقة جداً. فيها غرفتان ومطبخ وحمام وشرفة صغيرة. في غرفة المعيشة أريكة وطاولة وتلفاز. أنام مع زوجتي في إحدى الغرف. والغرفة الثانية مكتبنا. يدخل ضوء كثير من النوافذ صباحاً. أطبخ كل مساء في المطبخ. وهناك أيضاً طاولة صغيرة وأربعة كراسٍ. في الشرفة كرسيان وكثير من الزهور. أحب تناول الفطور هناك في الصيف. يبلغ الإيجار الشامل (Warmmiete) ستمئة يورو. تقع الشقة قرب موقف حافلات. يزورنا أصدقاؤنا في نهاية الأسبوع ونشرب القهوة في غرفة المعيشة. أنا راضٍ جداً عن شقتي.»
- **`t-a1-023.de`** — استبدال تركيب «Miete ... warm» بصيغة الاسم المركب القياسية «Warmmiete beträgt».
  - قبل: «Meine Wohnung ist nicht groß, aber sehr hell. Sie hat zwei Zimmer, eine Küche, ein Bad und einen kleinen Balkon. Im Wohnzimmer stehen ein Sofa, ein Tisch und ein Fernseher. In einem Zimmer schlafen meine Frau und ich. Das zweite Zimmer ist unser Arbeitszimmer. Am Morgen kommt viel Licht durch die Fenster. In der Küche koche ich jeden Abend. Dort stehen auch ein kleiner Tisch und vier Stühle. Auf dem Balkon stehen zwei Stühle und viele Blumen. Im Sommer frühstücke ich dort gern. Die Miete ist sechshundert Euro warm. Die Wohnung liegt nahe an einer Bushaltestelle. Am Wochenende besuchen uns Freunde, und wir trinken Kaffee im Wohnzimmer. Ich bin sehr zufrieden mit meiner Wohnung.»
  - بعد: «Meine Wohnung ist nicht groß, aber sehr hell. Sie hat zwei Zimmer, eine Küche, ein Bad und einen kleinen Balkon. Im Wohnzimmer stehen ein Sofa, ein Tisch und ein Fernseher. In einem Zimmer schlafen meine Frau und ich. Das zweite Zimmer ist unser Arbeitszimmer. Am Morgen kommt viel Licht durch die Fenster. In der Küche koche ich jeden Abend. Dort stehen auch ein kleiner Tisch und vier Stühle. Auf dem Balkon stehen zwei Stühle und viele Blumen. Im Sommer frühstücke ich dort gern. Die Warmmiete beträgt sechshundert Euro. Die Wohnung liegt nahe an einer Bushaltestelle. Am Wochenende besuchen uns Freunde, und wir trinken Kaffee im Wohnzimmer. Ich bin sehr zufrieden mit meiner Wohnung.»
- **`t-a1-023.questions[1].explanationAr`** — توحيد الشرح مع اللفظ الجديد في النص ومع المفتاح 600 Euro.
  - قبل: «الدليل في النص: «Die Miete ist sechshundert Euro warm.» — الإيجار 600 يورو warm.»
  - بعد: ««Die Warmmiete beträgt sechshundert Euro.» — الإيجار الشامل يبلغ 600 يورو.»
- **`t-a1-023.questions[1].promptAr`** — مطابقة السؤال العربي لمفهوم الإيجار الشامل.
  - قبل: «كم الإيجار شاملاً التدفئة؟»
  - بعد: «كم تبلغ قيمة الإيجار الشامل؟»
- **`t-a1-023.questions[1].promptDe`** — صياغة سؤال الإيجار بالمصطلح الألماني الموحد في النص.
  - قبل: «Wie hoch ist die Miete warm?»
  - بعد: «Wie hoch ist die Warmmiete?»

### `t-a1-024` — نهاية أسبوع في لايبزيغ / Ein Wochenende in Leipzig

- لم يتطلب النص تصحيحاً مثبتاً؛ فُحصت فقراته وترجمته وأسئلته ومفاتيحه. مسار الحياة اليومية والترام والمخبز والحديقة متسق داخل مشهد لا يحدد عنواناً حقيقياً؛ الجوابان مدعومان.

### `t-a1-025` — في السوبرماركت / Im Supermarkt

- **`t-a1-025.ar`** — إبراز أن البائعة هي التي تسلّم الإيصال، ومطابقة التوضيح للألمانية.
  - قبل: «اليوم أذهب إلى السوبرماركت. أحتاج إلى الحليب والخبز والبيض والتفاح والجبن. المتجر كبير وفيه منتجات كثيرة. أبحث عن الحليب أولاً، ثم آخذ الخبز والبيض. أشتري أيضاً الطماطم وزجاجة ماء. التفاح عليه عرض اليوم. أقارن الأسعار وآخذ كيساً صغيراً معي. ألتقي جارتي في المتجر. نتحدث قليلاً عن الطقس. ثم أذهب إلى الصندوق. يقف أمامي شخصان. تقول البائعة: «مرحباً». أدفع بالبطاقة عند الصندوق وتعطيني الإيصال. المجموع اثنا عشر يورو. في البيت أضع الحليب والماء في الثلاجة، وأضع الخبز في الخزانة.»
  - بعد: «اليوم أذهب إلى السوبرماركت. أحتاج إلى الحليب والخبز والبيض والتفاح والجبن. المتجر كبير وفيه منتجات كثيرة. أبحث عن الحليب أولاً، ثم آخذ الخبز والبيض. أشتري أيضاً الطماطم وزجاجة ماء. التفاح عليه عرض اليوم. أقارن الأسعار وآخذ كيساً صغيراً معي. ألتقي جارتي في المتجر. نتحدث قليلاً عن الطقس. ثم أذهب إلى الصندوق. يقف أمامي شخصان. تقول البائعة: «مرحباً». أدفع بالبطاقة عند الصندوق، ثم تعطيني البائعة الإيصال. المجموع اثنا عشر يورو. في البيت أضع الحليب والماء في الثلاجة، وأضع الخبز في الخزانة.»
- **`t-a1-025.de`** — تسمية البائعة صراحةً بدلاً من ضمير «Sie» بعد ذكر الصندوق، لتثبيت مرجع من تسلّم الإيصال.
  - قبل: «Heute gehe ich zum Supermarkt. Ich brauche Milch, Brot, Eier, Äpfel und Käse. Der Supermarkt ist groß und hat viele Produkte. Zuerst suche ich die Milch, dann hole ich Brot und Eier. Ich kaufe auch Tomaten und eine Flasche Wasser. Die Äpfel sind heute im Angebot. Ich vergleiche die Preise und nehme eine kleine Tüte mit. Im Laden treffe ich meine Nachbarin. Wir sprechen kurz über das Wetter. Dann gehe ich zur Kasse. Vor mir stehen zwei Personen. Die Verkäuferin sagt: „Guten Tag.“ An der Kasse bezahle ich mit Karte. Sie gibt mir den Kassenbon. Alles kostet zusammen zwölf Euro. Zu Hause stelle ich die Milch und das Wasser in den Kühlschrank. Das Brot kommt in den Schrank.»
  - بعد: «Heute gehe ich zum Supermarkt. Ich brauche Milch, Brot, Eier, Äpfel und Käse. Der Supermarkt ist groß und hat viele Produkte. Zuerst suche ich die Milch, dann hole ich Brot und Eier. Ich kaufe auch Tomaten und eine Flasche Wasser. Die Äpfel sind heute im Angebot. Ich vergleiche die Preise und nehme eine kleine Tüte mit. Im Laden treffe ich meine Nachbarin. Wir sprechen kurz über das Wetter. Dann gehe ich zur Kasse. Vor mir stehen zwei Personen. Die Verkäuferin sagt: „Guten Tag.“ An der Kasse bezahle ich mit Karte. Die Verkäuferin gibt mir den Kassenbon. Alles kostet zusammen zwölf Euro. Zu Hause stelle ich die Milch und das Wasser in den Kühlschrank. Das Brot kommt in den Schrank.»

### `t-a1-026` — يوم مشمس في الحديقة / Ein sonniger Tag im Park

- لم يتطلب النص تصحيحاً مثبتاً؛ فُحصت فقراته وترجمته وأسئلته ومفاتيحه. طقس اليوم والأنشطة المسائية سرد تدريبي؛ 20 درجة تقريبية مذكورة وتطابق المفتاح، لا تقرير طقس راهن موثق.

### `t-a1-027` — هوايتي: كرة القدم / Mein Hobby

- لم يتطلب النص تصحيحاً مثبتاً؛ فُحصت فقراته وترجمته وأسئلته ومفاتيحه. كرة القدم والقاعة والمرمى ووقت اللعب متسقة؛ سؤالا مكان اللعب وما بعده لهما دليل مباشر.

### `t-a1-028` — مهنتي / Mein Beruf

- لم يتطلب النص تصحيحاً مثبتاً؛ فُحصت فقراته وترجمته وأسئلته ومفاتيحه. المهنة والورشة وساعات العمل مترابطة؛ سؤال الشركة يطابق وصف إنتاج آلات للسيارات.

### `t-a1-029` — ملابسي / Meine Kleidung

- **`t-a1-029.ar`** — تصحيح العدد: الألمانية تقول Schuhe جمعاً؛ صيغت العربية «زوجاً من الأحذية» بدلاً من مفرد حذاء.
  - قبل: «أرتدي اليوم بنطال جينز أزرق وقميصاً أبيض وحذاءً أسود. أرتدي في الشتاء سترة دافئة، وأحياناً وشاحاً وقفازات أيضاً. ألبس في الصيف سراويل قصيرة وقمصاناً قصيرة الأكمام. أحب في البيت ارتداء بنطال مريح وقميص قديم. لا أحتاج إلى ملابس خاصة للعمل. أذهب يوم السبت مع صديقتي إلى متجر. تبحث هي عن فستان وأحتاج أنا إلى جوارب جديدة. أجرب سترة خضراء في المتجر. إنها تناسبني لكنها غالية قليلاً. لا أشتريها. نعود إلى البيت بالحافلة في النهاية.»
  - بعد: «أرتدي اليوم بنطال جينز أزرق وقميصاً أبيض وزوجاً من الأحذية السوداء. أرتدي في الشتاء سترة دافئة، وأحياناً وشاحاً وقفازات أيضاً. ألبس في الصيف سراويل قصيرة وقمصاناً قصيرة الأكمام. أحب في البيت ارتداء بنطال مريح وقميص قديم. لا أحتاج إلى ملابس خاصة للعمل. أذهب يوم السبت مع صديقتي إلى متجر. تبحث هي عن فستان وأحتاج أنا إلى جوارب جديدة. أجرب سترة خضراء في المتجر. إنها تناسبني لكنها غالية قليلاً. لا أشتريها. نعود إلى البيت بالحافلة في النهاية.»

### `t-a1-030` — زيارة الطبيبة / Besuch bei der Ärztin

- **`t-a1-030.ar`** — مطابقة جنس الطبيبة للنص، وترجمة «Vielleicht» كاحتمال؛ المشهد تدريبي لا تشخيص موثق.
  - قبل: «أنا في عيادة الطبيبة اليوم. أعاني من الصداع منذ يومين. تسأل الطبيبة: «ماذا يؤلمك؟» أجيب: «رأسي يؤلمني وعندي حمى خفيفة.» تفحصني وتقول: «إنها نزلة برد. اشرب الكثير من الماء واسترح.» ينتظر ثلاثة أشخاص آخرون في العيادة. أجلس في غرفة الانتظار وأقرأ مجلة. تناديني الطبيبة بعد عشرين دقيقة. تسأل: «هل لديك سعال أيضاً؟» أقول: «قليلاً، لكن حلقي لا يؤلمني.» تقيس حرارتي. ثم تكتب وصفة. أشتري الأقراص من الصيدلية. أشرب الماء في البيت وأذهب إلى النوم باكراً. أشعر بتحسن في صباح اليوم التالي.»
  - بعد: «أنا عند الطبيبة اليوم. أعاني من الصداع منذ يومين. تسألني الطبيبة: «ماذا يؤلمك؟» أجيب: «رأسي يؤلمني وعندي حمى خفيفة.» تفحصني وتقول: «ربما تكون نزلة برد. اشرب الكثير من الماء واسترح.» ينتظر ثلاثة أشخاص آخرون في العيادة. أجلس في غرفة الانتظار وأقرأ مجلة. تناديني الطبيبة بعد عشرين دقيقة. تسألني: «هل لديك سعال أيضاً؟» أقول: «قليلاً، لكن حلقي لا يؤلمني.» تقيس حرارتي. ثم تكتب وصفة طبية. أشتري الأقراص من الصيدلية. أشرب الماء في البيت وأذهب إلى النوم باكراً. أشعر بتحسن في صباح اليوم التالي.»
- **`t-a1-030.de`** — توحيد «beim Arzt» مع عنوان الطبيبة ومرجع Ärztin، وصياغة التشخيص احتمالاً («Vielleicht») لا يقيناً من عرضين فقط.
  - قبل: «Heute bin ich beim Arzt. Ich habe seit zwei Tagen Kopfschmerzen. Die Ärztin fragt: „Was tut weh?“ Ich antworte: „Mein Kopf tut weh und ich habe ein bisschen Fieber.“ Sie untersucht mich und sagt: „Das ist eine Erkältung. Trinken Sie viel Wasser und ruhen Sie sich aus.“ In der Praxis warten noch drei Personen. Ich sitze im Wartezimmer und lese eine Zeitschrift. Nach zwanzig Minuten ruft mich die Ärztin. Sie fragt: „Haben Sie auch Husten?“ Ich sage: „Ein wenig, aber mein Hals tut nicht weh.“ Sie misst meine Temperatur. Dann schreibt sie ein Rezept. In der Apotheke kaufe ich die Tabletten. Zu Hause trinke ich Wasser und gehe früh schlafen. Am nächsten Morgen geht es mir besser.»
  - بعد: «Heute bin ich bei der Ärztin. Ich habe seit zwei Tagen Kopfschmerzen. Die Ärztin fragt: „Was tut weh?“ Ich antworte: „Mein Kopf tut weh und ich habe ein bisschen Fieber.“ Sie untersucht mich und sagt: „Vielleicht ist es eine Erkältung. Trinken Sie viel Wasser und ruhen Sie sich aus.“ In der Praxis warten noch drei Personen. Ich sitze im Wartezimmer und lese eine Zeitschrift. Nach zwanzig Minuten ruft mich die Ärztin. Sie fragt: „Haben Sie auch Husten?“ Ich sage: „Ein wenig, aber mein Hals tut nicht weh.“ Sie misst meine Temperatur. Dann schreibt sie ein Rezept. In der Apotheke kaufe ich die Tabletten. Zu Hause trinke ich Wasser und gehe früh schlafen. Am nächsten Morgen geht es mir besser.»

### `t-a1-031` — حيواني الأليف / Mein Haustier

- لم يتطلب النص تصحيحاً مثبتاً؛ فُحصت فقراته وترجمته وأسئلته ومفاتيحه. اسم القطة وعمرها وألوانها وروتينها متسق؛ الإجابتان لهما شاهدان حرفيان.

### `t-a1-032` — عطلة نهاية الأسبوع / Am Wochenende

- **`t-a1-032.questions[0].answer`** — مطابقة المفتاح لصيغة المتكلم الجديدة مع الحفاظ على الجواب الصحيح.
  - قبل: «Sie putzt die Wohnung und kauft ein»
  - بعد: «Ich putze die Wohnung und kaufe ein»
- **`t-a1-032.questions[0].explanationAr`** — إسناد الإجابة إلى جملة السبت نفسها، وبصيغة المتكلم.
  - قبل: «الدليل في النص: «Dann putze ich die Wohnung und kaufe ein.» — ينظف الشقة ويتسوق بعد الإفطار يوم السبت.»
  - بعد: ««Dann putze ich die Wohnung und kaufe ein.» — أنظف الشقة وأتسوّق يوم السبت.»
- **`t-a1-032.questions[0].options`** — توحيد الخيارات مع صيغة المتكلم في النص، مع إبقاء المشتتات الثلاثة معقولة ومتميزة.
  - قبل: «Sie putzt die Wohnung und kauft ein، Sie fährt zur Arbeit، Sie besucht einen Arzt»
  - بعد: «Ich putze die Wohnung und kaufe ein، Ich fahre zur Arbeit، Ich besuche einen Arzt»
- **`t-a1-032.questions[0].promptAr`** — مواءمة العربية لسرد المتكلم من دون افتراض جنس الراوي.
  - قبل: «ماذا يفعل المتحدث يوم السبت؟»
  - بعد: «ماذا أفعل يوم السبت؟»
- **`t-a1-032.questions[0].promptDe`** — مواءمة السؤال مع سرد Ich بضمير المتكلم بدلاً من تحويله إلى شخصية مؤنثة غير معرّفة.
  - قبل: «Was macht die Person am Samstag?»
  - بعد: «Was mache ich am Samstag?»
- **`t-a1-032.questions[1].answer`** — مطابقة المفتاح لصيغة المتكلم الجديدة مع الحفاظ على الجواب الصحيح.
  - قبل: «Sie kocht und bereitet ihre Sachen für Montag vor»
  - بعد: «Ich koche und bereite meine Sachen für Montag vor»
- **`t-a1-032.questions[1].explanationAr`** — إضافة دليلي الطهي مساء الأحد والاستعداد ليوم الاثنين؛ الشرح يغطي جزأي الجواب.
  - قبل: «الدليل في النص: «Danach bereite ich meine Sachen für Montag vor.» — تحضّر أشياءها ليوم الاثنين بعد أن تطهو.»
  - بعد: ««Am Sonntagabend koche ich etwas Leckeres. Danach bereite ich meine Sachen für Montag vor.» — أطبخ شيئاً لذيذاً مساء الأحد، ثم أجهّز أشيائي ليوم الاثنين.»
- **`t-a1-032.questions[1].options`** — توحيد الخيارات مع صيغة المتكلم في النص، مع إبقاء المشتتات الثلاثة معقولة ومتميزة.
  - قبل: «Sie kocht und bereitet ihre Sachen für Montag vor، Sie geht ins Kino، Sie arbeitet im Supermarkt»
  - بعد: «Ich koche und bereite meine Sachen für Montag vor، Ich gehe ins Kino، Ich arbeite im Supermarkt»
- **`t-a1-032.questions[1].promptAr`** — مواءمة العربية لسرد المتكلم من دون افتراض جنس الراوي.
  - قبل: «ماذا يفعل المتحدث مساء الأحد؟»
  - بعد: «ماذا أفعل مساء الأحد؟»
- **`t-a1-032.questions[1].promptDe`** — مواءمة السؤال مع سرد Ich بضمير المتكلم بدلاً من تحويله إلى شخصية مؤنثة غير معرّفة.
  - قبل: «Was macht die Person am Sonntagabend?»
  - بعد: «Was mache ich am Sonntagabend?»

### `t-a1-033` — الطعام والشراب / Essen und Trinken

- لم يتطلب النص تصحيحاً مثبتاً؛ فُحصت فقراته وترجمته وأسئلته ومفاتيحه. الفطور والغداء والعشاء والمشروبات متسقة؛ السؤالان يختبران معلومات منصوصاً عليها.

### `t-a1-034` — السؤال عن الطريق إلى محطة القطار / Nach dem Weg zum Bahnhof fragen

- **`t-a1-034.questions[0].explanationAr`** — توضيح أن الانعطاف يساراً يكون عند الوصول إلى الإشارة، لا بعد تجاوزها.
  - قبل: «الدليل في النص: «Gehen Sie geradeaus bis zur Ampel, dann biegen Sie links ab.» — بعد الإشارة انعطف يساراً.»
  - بعد: «الدليل في النص: «Gehen Sie geradeaus bis zur Ampel, dann biegen Sie links ab.» — سر مباشرةً حتى الإشارة ثم انعطف يساراً عندها.»

### `t-a1-035` — عيد ميلادي / Geburtstag

- **`t-a1-035.ar`** — مطابقة تقسيم الجملة، وحذف «باقة» لأنها تفصيل غير موجود في Blumen.
  - قبل: «اليوم عيد ميلادي وأتمّ الثلاثين من عمري. دعوت ستة أصدقاء إلى عيد ميلادي. يأتون في الرابعة بعد الظهر. يجلبون هدايا: كتاباً وزجاجة نبيذ وبطاقة تهنئة. خبزت زوجتي كعكة. نأكل الكعكة معاً ونشرب القهوة. إنه يوم جميل وأنا سعيد جداً. على الطاولة صحون وفناجين وعصير. تتصل أمي وتهنئني. بعد ذلك نلعب لعبة ونستمع إلى الموسيقى. يجلب أحد أصدقائي باقة زهور أيضاً. نلتقط صورة في الحديقة. يعود أصدقائي إلى بيوتهم مساءً. أرتب الفناجين. أنا متعب لكنني راضٍ.»
  - بعد: «اليوم عيد ميلادي وأتمّ الثلاثين من عمري. دعوت ستة أصدقاء إلى عيد ميلادي. يأتون في الرابعة بعد الظهر. يجلبون هدايا: كتاباً وزجاجة نبيذ وبطاقة تهنئة. خبزت زوجتي كعكة. نأكل الكعكة معاً ونشرب القهوة. إنه يوم جميل وأنا سعيد جداً. على الطاولة صحون وفناجين. وهناك عصير أيضاً. تتصل أمي وتهنئني. بعد ذلك نلعب لعبة ونستمع إلى الموسيقى. يجلب أحد أصدقائي زهوراً أيضاً. نلتقط صورة في الحديقة. يعود أصدقائي إلى بيوتهم مساءً. أرتب الفناجين. أنا متعب لكنني راضٍ.»
- **`t-a1-035.de`** — فصل الأطباق والفناجين عن العصير: الأشياء توضع على الطاولة، أما العصير فيُذكر أنه متاح عليها من دون إسناد فعل الوقوف إليه.
  - قبل: «Heute habe ich Geburtstag und bin dreißig Jahre alt. Ich habe sechs Freunde zum Geburtstag eingeladen. Sie kommen am Nachmittag um vier Uhr. Sie bringen Geschenke: ein Buch, eine Flasche Wein und eine Karte. Meine Frau hat einen Kuchen gebacken. Wir essen zusammen Kuchen und trinken Kaffee. Es ist ein schöner Tag und ich bin sehr glücklich. Auf dem Tisch stehen Teller, Tassen und Saft. Meine Mutter ruft an und gratuliert mir. Danach spielen wir ein Spiel und hören Musik. Ein Freund bringt auch Blumen mit. Wir machen ein Foto im Garten. Am Abend gehen meine Freunde nach Hause. Ich räume die Tassen weg. Ich bin müde, aber zufrieden.»
  - بعد: «Heute habe ich Geburtstag und bin dreißig Jahre alt. Ich habe sechs Freunde zum Geburtstag eingeladen. Sie kommen am Nachmittag um vier Uhr. Sie bringen Geschenke: ein Buch, eine Flasche Wein und eine Karte. Meine Frau hat einen Kuchen gebacken. Wir essen zusammen Kuchen und trinken Kaffee. Es ist ein schöner Tag und ich bin sehr glücklich. Auf dem Tisch stehen Teller und Tassen. Es gibt auch Saft. Meine Mutter ruft an und gratuliert mir. Danach spielen wir ein Spiel und hören Musik. Ein Freund bringt auch Blumen mit. Wir machen ein Foto im Garten. Am Abend gehen meine Freunde nach Hause. Ich räume die Tassen weg. Ich bin müde, aber zufrieden.»

## فحوص المحتوى والبوابات

- **K227a–f:** أُضيفت للـsmoke للتحقق من التقرير وأعداد الحقول، سلامة جميع النصوص وأسئلة MC، اصطلاح الإيجار، التحوّط الطبي، إجابات عطلة نهاية الأسبوع، ومانيفستات الصوت؛ اجتازت **6/6**.
- لا تغيير لمتطلبات smoke السابقة ولا استبدال لتسجيل بـ`neu`. `npm run smoke`: **1504 نجاحات و38 إخفاقاً**؛ خط أساس R155 هو **1498/38**، أي لا إخفاق جديد. القائمة الحالية هي نفسها. من الإخفاقات السابقة K212i (يتوقع 20 نص A1 رغم وجود 35) وK215i (يتوقع 110 نصوص بينما توجد 157)؛ لم تُعدّل هذه البوابات.
- `npm run audit:content`: اجتاز مع **صفر عيوب بنيوية مؤكدة**؛ بقيت تنبيهات heuristic ومراجعة بشرية. `npm run interaktiv`: **682 نجاحاً و17 إخفاقاً معروفة**، بمجموعة الإخفاقات نفسها المسجلة بعد R155.
- `npx tsc --noEmit` اجتاز. `npm run build` اجتاز وأنشأ 13 مساراً ثابتاً. `git diff --check` اجتاز. أعيد تشغيل الرقعة: **0/23** في التشغيل الثاني.

## ملحق R162 — تسجيل A1 ومحاذاة مشهد الطقس (2026-10-12)

> يظل `audioAudit` أعلاه لقطة R156 قبل إنتاج الصوت؛ لا تُمحى التاريخية ولا تُحسب أصوات الجهاز تغطيةً ملفية.

- فُحصت نصوص `t-a1-021`–`t-a1-029` جملةً جملة قبل التسجيل. في `t-a1-026` عُدّل الافتتاح من «اليوم» إلى `An einem sonnigen Tag` كي يظل الطقس والحرارة تقريباً داخل مشهد تدريبي لا ادعاءً راهناً؛ عُدّلت العربية إلى «الطقس جميل جداً في يوم مشمس»، وصُحح سؤال `Was mache ich am Nachmittag?` من «ماذا يفعل المتحدث» إلى «ماذا أفعل» لمطابقة ضمير المتكلم. زاد النص ثلاث كلمات، فحُدّث `wordCountDe` من 110 إلى 113.
- اكتُشف أيضاً عدم تطابق عدّ الكلمات في البيانات الوصفية: `t-a1-023` من 114 إلى 113 و`t-a1-025` من 118 إلى 119، وفق عدد المقاطع المفصولة بمسافات كما في مولّد الخطة. صار مجموع نصوص A1 الخمسة عشر **1622** كلمة حالياً (1619 في لقطة R156 +3 من تعديل R162).
- أُنتجت الملفات التسعة `t-a1-021`–`t-a1-029` بالصوت `voice-00 (de-DE, Arena TTS)` وربطت بمانيفستو HörLabor فقط. بقيت ستة نصوص A1 بلا MP3 (`t-a1-030`–`t-a1-035`).
- مع `t-a0-015` في دفعة R162 أصبحت التغطية الإجمالية **104/157**: A0 ‏15/15، A1 ‏29/35، A2 ‏20/32، B1 ‏20/35، B2 ‏20/40. جرى التحقق بنيوياً من ID3 وإطارات MPEG Layer III والحجم؛ **لم يحدث استماع بشري أو تقييم لجودة النطق**.

## تدقيق الصوت

- `content/dialog-audio.json` (صوت الحوارات): **0** إدخالات لهذه المعرّفات.
- `content/hoeren-audio.json` (الاستماع): **0** إدخالات؛ `content/diktat-audio.json` (الإملاء): **0** إدخالات.
- ملفات باسم مطابق في `public/audio`: **0**. لا استماع أو توليد أو تعديل صوت؛ المانيفستات الثلاثة ليست مانيفستو واحداً.

## الحدود والفجوات التالية

- **human:** تدقيق تحريري؛ ليس اعتماداً لغوياً بشرياً مستقلاً.
- **CEFR:** الوسم A1 كما هو في البيانات؛ لم يُجر تقييم CEFR مستقل.
- **طبي:** نص عيادة تدريبي؛ لا يشخّص أو يقدم علاجاً موثقاً، ولا يذكر دواءً أو جرعة محددة.
- **سكن/وقائع:** مبلغ الإيجار والطقس والسيرة أمثلة داخل النصوص، لا بيانات سوق أو أحوال جوية حقيقية.
- بعد R156 تصبح تغطية النصوص 135/157؛ المتبقي 22: A2=12، B1=5، B2=5. فجوتا حوارات A1/A2 28–30 منفصلتان وغير محسومتين.

## النتيجة النهائية

اكتملت مراجعة R156: **15 نص A1، 30 سؤالاً، 23 حقلاً مصححاً و23 انتقالاً محروساً**، بلا غير محسوم في النطاق. ارتفعت التغطية الموثقة إلى 135/157، والمتبقي 22 نصاً (A2=12، B1=5، B2=5). بوابات K227a–f وفحوص البناء والنوع اجتازت؛ لا ادعاء بالاستماع. الدفعة جاهزة للرفع المباشر على فرع الجلسة.
