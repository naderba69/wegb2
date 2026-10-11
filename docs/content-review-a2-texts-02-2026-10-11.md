# تقرير R157 — مراجعة نصوص A2 المتبقية (t-a2-21..30 و031..032)

- **التاريخ:** 11 أكتوبر 2026
- **النطاق:** 12 نصاً A2 غير مشمولة في التقارير السابقة؛ تدقيق النصين الألماني والعربي والعناوين والأسئلة الأربعة والعشرين وخياراتها ومفاتيحها وشروحها.
- **الرقعة:** `scripts/patches/review_a2_texts_02.py` — 32 انتقالاً محروساً بالقيم السابقة، قابلة لإعادة التشغيل.
- **الحصيلة:** 12 نصاً، 1,886 كلمة ألمانية، 206 علامات نهاية جملة/دور حواري، 24 سؤالاً، 32 حقلاً مصححاً، غير محسوم: 0.
- **التحقق:** K228a–f: ‏6/6 ناجحة؛ smoke ‏1510 نجاحات و38 إخفاقاً معروفاً (مقابل R156: ‏1504/38)، بلا إخفاق جديد. تدقيق المحتوى البنيوي والبناء وTypeScript اجتازت؛ interactive ‏682/17 بالإخفاقات المعروفة نفسها.

## الحكم

> صُحّح الجزم الطبي إلى اشتباه، وأزيلت نسبة مكالمة افتراضية إلى شركة تأمين حقيقية. وُسمت أمثلة الأسعار والعناوين والمسارات وجداول الدروس بأنها أمثلة، لا بيانات راهنة. وُحّدت صيغة سؤال الدورة مع المتكلم، وطابقنا زمن الماضي في ترجمة اختبار عطلة نهاية الأسبوع، وصقلنا جولة البحيرة وتسوية فاتورة التأمين. حُصر جواب انتقال سارة وشرحه في أسباب النص، وصُحح معنى عنوان روتين لوكاس ووصفة الكسكس. بقيت الأسئلة الأربعة والعشرون ومفاتيحها موجودة وصالحة. لا ادعاء بالاستماع أو التحقق الطبي/السكني الخارجي.

## ملخص الموارد

| المعرّف | العنوان | الكلمات | الأسئلة | الحقول | نتيجة التدقيق |
|---|---|---:|---:|---:|---|
| `t-a2-21` | موعد لينا عند الطبيب: اشتباه بالإنفلونزا / Linas Arzttermin: Verdacht auf Grippe | 154 | 2 | 4 | صيغت حالة الإنفلونزا كاشتباه. الزمن (ثلاثة أيام) والنصائح المنقولة والأسئلة متطابقة؛ المشهد لا يُعرض كتوجيه طبي. |
| `t-a2-22` | رسالة إلى المعلمة / Eine E-Mail an die Lehrerin | 157 | 2 | 0 | رسالة الاعتذار والطلب إلى المعلمة واضحة؛ سبب الغياب وتعويض الدرس متطابقان، ولا تعديل لازم. |
| `t-a2-23` | مثال: وصف الطريق إلى المحطة / Beispiel: Wegbeschreibung zum Bahnhof | 167 | 2 | 2 | خط السير/المسافة/الثماني دقائق مثال تدريبي غير مربوط بمدينة أو محطة حقيقية؛ السؤالان لهما دليل مباشر. |
| `t-a2-24` | عطلة نهاية أسبوعي / Mein Wochenende | 153 | 2 | 1 | طابقنا ترجمة يوم الاختبار زمن الماضي الألماني، وصقلنا تعبير الجولة حول البحيرة؛ بقية تسلسل السبت والأحد والجوابين متسق. |
| `t-a2-25` | مثال: محادثة في السوبرماركت / Beispiel: Ein Gespräch im Supermarkt | 171 | 2 | 2 | أماكن الحليب والخبز والخضار والدفع متسقة؛ سعر الطماطم محدد كعنصر في مثال لا سعر سوق حالي. |
| `t-a2-26` | مثال: دعوة إلى عيد ميلاد / Beispiel: Eine Einladung zum Geburtstag | 153 | 2 | 2 | موعد السبت والساعة والعنوان وخط المترو عناصر دعوة تدريبية؛ سؤالا الرد والوصول يطابقانها. |
| `t-a2-27` | مثال: البحث عن شقة / Beispiel: Eine Wohnung suchen | 151 | 2 | 2 | الحد الأقصى 600 يورو والإيجار الأساسي 580 يورو متسقان؛ أرقام المساحة والإيجار داخل مثال لا نصيحة سكنية. |
| `t-a2-28` | مثال: اتصال بصندوق تأمين صحي / Beispielanruf bei einer Krankenkasse | 154 | 2 | 4 | أزيل اسم AOK كي لا تُنسب إجراءات عامة إلى جهة حقيقية بلا مصدر؛ صيغت تسوية الفاتورة بدقة أكبر، وبقيت مشروطة بسريان التأمين. |
| `t-a2-29` | مثال: دورة ألمانية جديدة / Beispiel: Ein neuer Deutschkurs | 153 | 2 | 7 | أيام الدورة وساعاتها والغرض من الشهادة متسقة في مثال؛ وُحّد السؤال مع صيغة Ich. |
| `t-a2-30` | طبقي المفضل / Mein Lieblingsgericht | 152 | 2 | 2 | وصفة عائلية للكسكس؛ صُحح عنوان Lieblingsgericht ومعنى Paprika وscharf، دون تعميمها على كل وصفات تونس. |
| `t-a2-031` | مثال: الانتقال إلى لايبزيغ / Beispiel: Ein Umzug nach Leipzig | 153 | 2 | 5 | قصة الانتقال والعمل والإيجار مثال غير إحصائي؛ حُصر المفتاح والشرح في الوظيفة الجديدة والإيجار المرتفع المصرح به. |
| `t-a2-032` | روتين يومي صحي / Ein gesunder Tagesablauf | 168 | 2 | 1 | روتين لوكاس وصف شخصي داخل نص تدريبي، لا توصية صحية عامة؛ صُحح العنوان إلى «روتين يومي صحي»، والترجمة ومفتاحا الشوكولاتة والجري متسقة. |

## التصحيحات التفصيلية

القيم «قبل/بعد» مأخوذة من مقارنة `HEAD` السابق للدفعة مع `content/texts.json` الحالية. القوائم تعرض خيارات السؤال كاملة عند تعديلها.

### `t-a2-21` — موعد لينا عند الطبيب: اشتباه بالإنفلونزا / Linas Arzttermin: Verdacht auf Grippe

- **`t-a2-21.ar`** — مطابقة الترجمة للاشتباه الطبي، لا لنتيجة تشخيص مؤكدة.
  - قبل: «اسمي لينا. لديّ اليوم موعد مع الدكتور مولر. أشعر بتوعّك منذ ثلاثة أيام. لديّ سعال وزكام ورأسي يؤلمني. أكون في العيادة عند التاسعة. يجب أولاً أن أُظهر بطاقة التأمين عند الاستقبال. ثم أنتظر في غرفة الانتظار. بعد خمس عشرة دقيقة تناديني المساعدة الطبية. يقيس الطبيب حرارتي ويستمع إلى رئتيّ. يقول إن لديّ إنفلونزا. يكتب لي وصفة وينصحني بشرب الكثير من الشاي والبقاء في السرير يومين. تشرح لي المساعدة الطبية في أي صيدلية أستطيع صرف الوصفة. أشتري الأقراص من هناك لاحقاً. أخبر مديري على الهاتف أنني مريضة ولن أذهب إلى العمل اليوم. ثم أعود مباشرة إلى البيت. أستريح وأشرب كوباً من الشاي. إذا لم أشعر بتحسن غداً، أتصل بالعيادة مرة أخرى.»
  - بعد: «اسمي لينا. لديّ اليوم موعد مع الدكتور مولر. أشعر بتوعّك منذ ثلاثة أيام. لديّ سعال وزكام ورأسي يؤلمني. أكون في العيادة عند التاسعة. يجب أولاً أن أُظهر بطاقة التأمين عند الاستقبال. ثم أنتظر في غرفة الانتظار. بعد خمس عشرة دقيقة تناديني المساعدة الطبية. يقيس الطبيب حرارتي ويستمع إلى رئتيّ. يرجّح الطبيب إصابتي بالإنفلونزا. يكتب لي وصفة وينصحني بشرب الكثير من الشاي والبقاء في السرير يومين. تشرح لي المساعدة الطبية في أي صيدلية أستطيع صرف الوصفة. أشتري الأقراص من هناك لاحقاً. أخبر مديري على الهاتف أنني مريضة ولن أذهب إلى العمل اليوم. ثم أعود مباشرة إلى البيت. أستريح وأشرب كوباً من الشاي. إذا لم أشعر بتحسن غداً، أتصل بالعيادة مرة أخرى.»
- **`t-a2-21.de`** — تبديل «ich habe eine Grippe» إلى «Der Arzt vermutet eine Grippe» لتجنب تشخيص مؤكّد لا يسنده النص.
  - قبل: «Mein Name ist Lina. Heute habe ich einen Termin bei Dr. Müller. Ich fühle mich seit drei Tagen nicht gut. Ich habe Husten und Schnupfen, und mein Kopf tut weh. Ich bin um neun Uhr in der Praxis. Zuerst muss ich am Empfang meine Versichertenkarte zeigen. Dann warte ich im Wartezimmer. Nach fünfzehn Minuten ruft mich die Arzthelferin. Der Arzt misst meine Temperatur und hört meine Lunge ab. Er sagt, ich habe eine Grippe. Er schreibt mir ein Rezept und sagt, ich soll viel Tee trinken und zwei Tage im Bett bleiben. Die Arzthelferin erklärt mir, in welcher Apotheke ich das Rezept abgeben kann. Dort hole ich später die Tabletten. Ich sage meinem Chef am Telefon, dass ich krank bin und heute nicht zur Arbeit komme. Danach fahre ich direkt nach Hause. Ich ruhe mich aus und trinke eine Tasse Tee. Wenn es mir morgen nicht besser geht, rufe ich die Praxis noch einmal an.»
  - بعد: «Mein Name ist Lina. Heute habe ich einen Termin bei Dr. Müller. Ich fühle mich seit drei Tagen nicht gut. Ich habe Husten und Schnupfen, und mein Kopf tut weh. Ich bin um neun Uhr in der Praxis. Zuerst muss ich am Empfang meine Versichertenkarte zeigen. Dann warte ich im Wartezimmer. Nach fünfzehn Minuten ruft mich die Arzthelferin. Der Arzt misst meine Temperatur und hört meine Lunge ab. Der Arzt vermutet eine Grippe. Er schreibt mir ein Rezept und sagt, ich soll viel Tee trinken und zwei Tage im Bett bleiben. Die Arzthelferin erklärt mir, in welcher Apotheke ich das Rezept abgeben kann. Dort hole ich später die Tabletten. Ich sage meinem Chef am Telefon, dass ich krank bin und heute nicht zur Arbeit komme. Danach fahre ich direkt nach Hause. Ich ruhe mich aus und trinke eine Tasse Tee. Wenn es mir morgen nicht besser geht, rufe ich die Praxis noch einmal an.»
- **`t-a2-21.titleAr`** — مطابقة العنوان العربي للاشتباه بالإنفلونزا بدلاً من الجزم بها.
  - قبل: «موعد لينا عند الطبيب والإنفلونزا»
  - بعد: «موعد لينا عند الطبيب: اشتباه بالإنفلونزا»
- **`t-a2-21.titleDe`** — تغيير العنوان من تشخيص قطعي إلى اشتباه، موافقاً لصياغة الأعراض في المشهد.
  - قبل: «Linas Arzttermin und Grippe»
  - بعد: «Linas Arzttermin: Verdacht auf Grippe»

### `t-a2-22` — رسالة إلى المعلمة / Eine E-Mail an die Lehrerin

- لم يظهر عيب مثبت يتطلب تغييراً؛ فُحص النص كله وترجمته والسؤالان ومفتاحاهما. رسالة الاعتذار والطلب إلى المعلمة واضحة؛ سبب الغياب وتعويض الدرس متطابقان، ولا تعديل لازم.

### `t-a2-23` — مثال: وصف الطريق إلى المحطة / Beispiel: Wegbeschreibung zum Bahnhof

- **`t-a2-23.titleAr`** — وسم المسافة والإشارات وخط السير بأنها مثال تدريبي لا وصف طريق حقيقي موثق.
  - قبل: «وصف الطريق إلى المحطة»
  - بعد: «مثال: وصف الطريق إلى المحطة»
- **`t-a2-23.titleDe`** — وسم المسافة والإشارات وخط السير بأنها مثال تدريبي لا وصف طريق حقيقي موثق.
  - قبل: «Wegbeschreibung zum Bahnhof»
  - بعد: «Beispiel: Wegbeschreibung zum Bahnhof»

### `t-a2-24` — عطلة نهاية أسبوعي / Mein Wochenende

- **`t-a2-24.ar`** — مطابقة زمن الجملة الألمانية الماضية «hatte» بصيغة الماضي في العربية، وصقل ترجمة «eine Runde um den See» إلى جولة حول البحيرة.
  - قبل: «استيقظت يوم السبت في التاسعة. شربت القهوة وقرأت الجريدة أولاً. ثم نظفت الشقة وتسوقت. كان الطقس لطيفاً، لذلك ذهبت إلى السوبرماركت سيراً على الأقدام. اشتريت هناك خبزاً وفاكهة وحليباً. جاءت صديقتي إلى بيتي بعد الظهر. تسكن في الشارع نفسه. ذهبنا معاً إلى مقهى عند الثالثة وتحدثنا كثيراً. طلبنا القهوة أولاً. ثم تحدثنا عن العمل وخططنا للصيف. تناولت العشاء في البيت مع عائلتي مساءً. نمت طويلاً يوم الأحد وتمشيت في الحديقة. استمعت هناك إلى الموسيقى ومشيت دورة حول البحيرة. درست الألمانية مساءً لأن لديّ اختباراً يوم الاثنين. جهزت حقيبتي لليوم التالي قبل النوم. كانت عطلة نهاية أسبوع هادئة وجميلة إجمالاً.»
  - بعد: «استيقظت يوم السبت في التاسعة. شربت القهوة وقرأت الجريدة أولاً. ثم نظفت الشقة وتسوقت. كان الطقس لطيفاً، لذلك ذهبت إلى السوبرماركت سيراً على الأقدام. اشتريت هناك خبزاً وفاكهة وحليباً. جاءت صديقتي إلى بيتي بعد الظهر. تسكن في الشارع نفسه. ذهبنا معاً إلى مقهى عند الثالثة وتحدثنا كثيراً. طلبنا القهوة أولاً. ثم تحدثنا عن العمل وخططنا للصيف. تناولت العشاء في البيت مع عائلتي مساءً. نمت طويلاً يوم الأحد وتمشيت في الحديقة. استمعت هناك إلى الموسيقى وقمت بجولة حول البحيرة. درست الألمانية مساءً لأن اختباري كان يوم الاثنين. جهزت حقيبتي لليوم التالي قبل النوم. كانت عطلة نهاية أسبوع هادئة وجميلة إجمالاً.»

### `t-a2-25` — مثال: محادثة في السوبرماركت / Beispiel: Ein Gespräch im Supermarkt

- **`t-a2-25.titleAr`** — وسم سعر 1.49 يورو وعرض الطماطم بأنه جزء من حوار تدريبي لا سعر سوق حالي.
  - قبل: «محادثة في السوبرماركت»
  - بعد: «مثال: محادثة في السوبرماركت»
- **`t-a2-25.titleDe`** — وسم سعر 1.49 يورو وعرض الطماطم بأنه جزء من حوار تدريبي لا سعر سوق حالي.
  - قبل: «Ein Gespräch im Supermarkt»
  - بعد: «Beispiel: Ein Gespräch im Supermarkt»

### `t-a2-26` — مثال: دعوة إلى عيد ميلاد / Beispiel: Eine Einladung zum Geburtstag

- **`t-a2-26.titleAr`** — تمييز الدعوة وعنوان الشارع/رقم المبنى كبيانات سيناريو لا عنوان شخص حقيقي.
  - قبل: «دعوة لعيد ميلاد»
  - بعد: «مثال: دعوة إلى عيد ميلاد»
- **`t-a2-26.titleDe`** — تمييز الدعوة وعنوان الشارع/رقم المبنى كبيانات سيناريو لا عنوان شخص حقيقي.
  - قبل: «Eine Einladung zum Geburtstag»
  - بعد: «Beispiel: Eine Einladung zum Geburtstag»

### `t-a2-27` — مثال: البحث عن شقة / Beispiel: Eine Wohnung suchen

- **`t-a2-27.titleAr`** — تأطير حدود الإيجار والمساحة والمبلغ داخل الشقة كقيم قصة تدريبية لا بيانات سوق.
  - قبل: «البحث عن شقة»
  - بعد: «مثال: البحث عن شقة»
- **`t-a2-27.titleDe`** — تأطير حدود الإيجار والمساحة والمبلغ داخل الشقة كقيم قصة تدريبية لا بيانات سوق.
  - قبل: «Eine Wohnung suchen»
  - بعد: «Beispiel: Eine Wohnung suchen»

### `t-a2-28` — مثال: اتصال بصندوق تأمين صحي / Beispielanruf bei einer Krankenkasse

- **`t-a2-28.ar`** — مطابقة الترجمة للمكالمة العامة من دون ادعاء تمثيل AOK، وتوضيح معنى تسوية الحساب في «rechnet ... ab».
  - قبل: «نهارك سعيد، معك خدمة AOK. اسمي كلاين. كيف أستطيع مساعدتك؟ — نهارك سعيد، معكم نادية صالح. سجلت أمس، لكنني لم أحصل على رقم التأمين بعد. كيف يصلني؟ — نرسل الرقم بالبريد بعد معالجة طلبك. وقد يستغرق ذلك بضعة أيام. — هل يمكنني الذهاب إلى الطبيب في هذه الأثناء؟ وهل يجب أن أدفع الفاتورة بنفسي؟ — إذا كان تأمينك سارياً بالفعل، فعادةً ما تتعامل العيادة معنا مباشرةً. يمكنك طلب شهادة عضوية منا وإبرازها للطبيب. — وهل سأحصل على بطاقة التأمين لاحقاً أيضاً؟ — نعم، نرسل البطاقة بالبريد بعد معالجة الطلب. من فضلك تحققي من صحة عنوانك. — سأفعل ذلك. أدوّن المعلومات في دفتري كي لا أنساها. شكراً على المعلومة. — على الرحب والسعة. يمكنك معاودة الاتصال بنا إن كانت لديك أسئلة أخرى. — إلى اللقاء عبر الهاتف!»
  - بعد: «مرحباً، معك صندوق التأمين الصحي. كيف أستطيع مساعدتك؟ — نهارك سعيد، معكم نادية صالح. سجلت أمس، لكنني لم أحصل على رقم التأمين بعد. كيف يصلني؟ — نرسل الرقم بالبريد بعد معالجة طلبك. وقد يستغرق ذلك بضعة أيام. — هل يمكنني الذهاب إلى الطبيب في هذه الأثناء؟ وهل يجب أن أدفع الفاتورة بنفسي؟ — إذا كان تأمينك سارياً بالفعل، فعادةً ما تتولى العيادة تسوية الحساب معنا مباشرةً. يمكنك طلب شهادة عضوية منا وإبرازها للطبيب. — وهل سأحصل على بطاقة التأمين لاحقاً أيضاً؟ — نعم، نرسل البطاقة بالبريد بعد معالجة الطلب. من فضلك تحققي من صحة عنوانك. — سأفعل ذلك. أدوّن المعلومات في دفتري كي لا أنساها. شكراً على المعلومة. — على الرحب والسعة. يمكنك معاودة الاتصال بنا إن كانت لديك أسئلة أخرى. — إلى اللقاء عبر الهاتف!»
- **`t-a2-28.de`** — إزالة نسبة المحادثة إلى AOK الحقيقي، مع إبقاء السؤال الإجرائي في إطار تمثيل عام.
  - قبل: «Guten Tag, hier ist die AOK. Mein Name ist Klein. Wie kann ich Ihnen helfen? — Guten Tag, hier spricht Nadia Saleh. Ich habe mich gestern angemeldet, aber meine Versicherungsnummer noch nicht bekommen. Wie erhalte ich sie? — Wir schicken die Nummer per Post, sobald Ihre Anmeldung bearbeitet ist. Das kann einige Tage dauern. — Kann ich in der Zwischenzeit trotzdem zum Arzt gehen? Muss ich die Rechnung selbst bezahlen? — Wenn Ihre Versicherung bereits aktiv ist, rechnet die Praxis normalerweise direkt mit uns ab. Sie können eine Mitgliedsbescheinigung bei uns anfordern und beim Arzt vorzeigen. — Bekomme ich die Versichertenkarte später auch? — Ja, die Karte kommt nach der Bearbeitung ebenfalls per Post. Bitte prüfen Sie, ob Ihre Adresse richtig ist. — Das mache ich. Ich schreibe die Informationen in mein Notizbuch, damit ich sie nicht vergesse. Vielen Dank für die Information. — Gern. Wenn Sie noch Fragen haben, können Sie uns wieder anrufen. — Auf Wiederhören!»
  - بعد: «Guten Tag, hier ist Ihre Krankenkasse. Wie kann ich Ihnen helfen? — Guten Tag, hier spricht Nadia Saleh. Ich habe mich gestern angemeldet, aber meine Versicherungsnummer noch nicht bekommen. Wie erhalte ich sie? — Wir schicken die Nummer per Post, sobald Ihre Anmeldung bearbeitet ist. Das kann einige Tage dauern. — Kann ich in der Zwischenzeit trotzdem zum Arzt gehen? Muss ich die Rechnung selbst bezahlen? — Wenn Ihre Versicherung bereits aktiv ist, rechnet die Praxis normalerweise direkt mit uns ab. Sie können eine Mitgliedsbescheinigung bei uns anfordern und beim Arzt vorzeigen. — Bekomme ich die Versichertenkarte später auch? — Ja, die Karte kommt nach der Bearbeitung ebenfalls per Post. Bitte prüfen Sie, ob Ihre Adresse richtig ist. — Das mache ich. Ich schreibe die Informationen in mein Notizbuch, damit ich sie nicht vergesse. Vielen Dank für die Information. — Gern. Wenn Sie noch Fragen haben, können Sie uns wieder anrufen. — Auf Wiederhören!»
- **`t-a2-28.titleAr`** — توضيح أن المكالمة نموذج تعليمي عام.
  - قبل: «مكالمة مع التأمين الصحي»
  - بعد: «مثال: اتصال بصندوق تأمين صحي»
- **`t-a2-28.titleDe`** — وصف المكالمة بأنها مثال عام، لا اتصال ممثل فعلي لدى شركة بعينها.
  - قبل: «Ein Anruf bei der Krankenversicherung»
  - بعد: «Beispielanruf bei einer Krankenkasse»

### `t-a2-29` — مثال: دورة ألمانية جديدة / Beispiel: Ein neuer Deutschkurs

- **`t-a2-29.questions[1].answer`** — تحديث المفتاح إلى الصيغة نفسها مع بقاء العمل هو السبب المذكور.
  - قبل: «Für ihren Job»
  - بعد: «Für meinen Job»
- **`t-a2-29.questions[1].explanationAr`** — مواءمة الشرح مع الاقتباس الحرفي وصيغة المتكلم.
  - قبل: «الدليل في النص: «Das Zertifikat brauche ich für meinen Job.» — تحتاج إلى الشهادة من أجل عملها.»
  - بعد: ««Das Zertifikat brauche ich für meinen Job.» — أحتاج إلى الشهادة من أجل عملي.»
- **`t-a2-29.questions[1].options`** — تحويل الخيارات إلى صيغة المتكلم لتطابق السؤال والنص، من دون تغيير المشتتات.
  - قبل: «Für ihren Job، Für eine Reise، Für die Universität»
  - بعد: «Für meinen Job، Für eine Reise، Für die Universität»
- **`t-a2-29.questions[1].promptAr`** — إزالة افتراض جنس الراوية وصياغة السؤال بضمير المتكلم.
  - قبل: «لماذا تحتاج المتحدثة إلى الشهادة؟»
  - بعد: «لماذا أحتاج إلى الشهادة؟»
- **`t-a2-29.questions[1].promptDe`** — مطابقة سؤال الغرض من الشهادة مع صيغة ich في النص.
  - قبل: «Wofür braucht die Person das Zertifikat?»
  - بعد: «Wofür brauche ich das Zertifikat?»
- **`t-a2-29.titleAr`** — تأطير جدول الدورة واسم المدرس بوصفه مثالاً لا إعلان دورة راهنة.
  - قبل: «دورة ألمانية جديدة»
  - بعد: «مثال: دورة ألمانية جديدة»
- **`t-a2-29.titleDe`** — تأطير جدول الدورة واسم المدرس بوصفه مثالاً لا إعلان دورة راهنة.
  - قبل: «Ein neuer Deutschkurs»
  - بعد: «Beispiel: Ein neuer Deutschkurs»

### `t-a2-30` — طبقي المفضل / Mein Lieblingsgericht

- **`t-a2-30.ar`** — استخدام «البابريكا» مقابلاً لتابل Paprika، وتصحيح scharf إلى مقدار الهريسة/الحدة لا درجة حرارة الطعام.
  - قبل: «طبختي المفضلة هي الكسكس بالخضار ولحم الضأن. تطبخه أمي كل يوم جمعة في تونس. نحتاج إلى الكسكس والجزر والكوسا والحمص والطماطم والبصل والثوم وتوابل مثل الكمون والفلفل الأحمر. تضيف أمي التوابل حسب الذوق. تحضّر الخضار أولاً. تقشّر الجزر وتقطّع الكوسا إلى قطع. يُفرم البصل ناعماً ويُحمّر بقليل من الزيت. ثم يُضاف لحم الضأن والماء والتوابل إلى القدر. يُطهى كل شيء على نار هادئة حتى يطرى اللحم. يُطهى الكسكس على البخار في مصفاة فوق القدر. ويُطهى الحمص معه حتى يطرى. في النهاية تضع أمي الكسكس في طبق كبير وتضع اللحم والخضار فوقه. يكون طعمه لذيذاً جداً مع الهريسة الحارة. توضع الصلصة جانباً كي يختار كل شخص درجة حرارة طعامه. تتناول العائلة كلها الطعام معاً يوم الجمعة.»
  - بعد: «طبقي المفضل هو الكسكس بالخضار ولحم الضأن. تطبخه أمي كل يوم جمعة في تونس. نحتاج إلى الكسكس والجزر والكوسا والحمص والطماطم والبصل والثوم وتوابل مثل الكمون والبابريكا. تضيف أمي التوابل حسب الذوق. تحضّر الخضار أولاً. تقشّر الجزر وتقطّع الكوسا إلى قطع. يُفرم البصل ناعماً ويُحمّر بقليل من الزيت. ثم يُضاف لحم الضأن والماء والتوابل إلى القدر. يُطهى كل شيء على نار هادئة حتى يطرى اللحم. يُطهى الكسكس على البخار في مصفاة فوق القدر. ويُطهى الحمص معه حتى يطرى. في النهاية تضع أمي الكسكس في طبق كبير وتضع اللحم والخضار فوقه. يكون طعمه لذيذاً جداً مع الهريسة الحارة. توضع الصلصة جانباً كي يختار كل شخص بنفسه كمية الهريسة الحارة التي تناسبه. تتناول العائلة كلها الطعام معاً يوم الجمعة.»
- **`t-a2-30.titleAr`** — ترجمة Lieblingsgericht إلى «طبقي المفضل» لا «طبختي المفضلة».
  - قبل: «طبختي المفضلة»
  - بعد: «طبقي المفضل»

### `t-a2-031` — مثال: الانتقال إلى لايبزيغ / Beispiel: Ein Umzug nach Leipzig

- **`t-a2-031.questions[0].answer`** — مطابقة المفتاح للسببين المصرّح بهما: الوظيفة الجديدة وارتفاع إيجار ميونخ.
  - قبل: «Wegen einer neuen Stelle und niedrigeren Mieten»
  - بعد: «Wegen einer neuen Stelle und der hohen Miete in München»
- **`t-a2-031.questions[0].explanationAr`** — مطابقة الشرح للمفرد «Die Miete» وللمعنى الدقيق لـ«zu hoch»؛ الإيجار كان مرتفعاً أكثر من اللازم.
  - قبل: «الدليل في النص: «Sie hatte eine neue Stelle als Grafikdesignerin gefunden. Die Miete in München war zu hoch» — وجدت وظيفة جديدة وكانت إيجارات ميونخ عالية.»
  - بعد: «الدليل في النص: «Sie hatte eine neue Stelle als Grafikdesignerin gefunden. Die Miete in München war zu hoch.» — وجدت وظيفة جديدة، وكان إيجار ميونخ مرتفعاً أكثر من اللازم.»
- **`t-a2-031.questions[0].options`** — استبدال استنتاج «إيجارات أقل» بسبب مذكور حرفياً: الإيجار المرتفع في ميونخ.
  - قبل: «Wegen einer neuen Stelle und niedrigeren Mieten، Wegen des Wetters، Weil ihre Familie dort wohnt»
  - بعد: «Wegen einer neuen Stelle und der hohen Miete in München، Wegen des Wetters، Weil ihre Familie dort wohnt»
- **`t-a2-031.titleAr`** — تأطير قصة الانتقال وأرقام الإيجار ومقارنة المدينتين كحالة تعليمية لا إحصاء سوقياً.
  - قبل: «انتقال إلى لايبزيغ»
  - بعد: «مثال: الانتقال إلى لايبزيغ»
- **`t-a2-031.titleDe`** — تأطير قصة الانتقال وأرقام الإيجار ومقارنة المدينتين كحالة تعليمية لا إحصاء سوقياً.
  - قبل: «Ein Umzug nach Leipzig»
  - بعد: «Beispiel: Ein Umzug nach Leipzig»

### `t-a2-032` — روتين يومي صحي / Ein gesunder Tagesablauf

- **`t-a2-032.titleAr`** — ترجمة «Tagesablauf» إلى روتين يومي، لا إلى يوم فقط.
  - قبل: «يوم صحي»
  - بعد: «روتين يومي صحي»

## فحوص المحتوى والبوابات

- **K228a–f: اجتازت البوابات الست.** تحققت من التقرير والرقعة والأعداد، سلامة العناوين والنصوص والأسئلة ومفاتيح MC، التحوّط الطبي والتأميني، مطابقة المفردات والإجابات، والفصل بين مانيفستات الصوت.
- **Smoke:** ‏1510 نجاحات/38 إخفاقاً معروفاً، مقابل R156 ‏1504/38؛ البوابات الست الجديدة ناجحة ولا إخفاق جديد. لم تُعدّل أو تُخفف البوابات القديمة.
- **تفاعلي:** ‏682 نجاحاً/17 إخفاقاً معروفاً، كما في R156. **Audit:** صفر عيوب بنيوية مؤكدة. `npx tsc --noEmit` و`npm run build` و`git diff --check` اجتازت.

## تدقيق الصوت

- `content/dialog-audio.json` (صوت الحوارات): **0** إدخالات لهذه المعرّفات.
- `content/hoeren-audio.json` (الاستماع): **0** إدخالات؛ `content/diktat-audio.json` (الإملاء): **0** إدخالات.
- ملفات مطابقة بالاسم في `public/audio`: **0**. لم يحدث استماع أو توليد أو تعديل؛ لا يُستعمل `neu` بديلاً عن تسجيل مفقود.

## حدود المراجعة والفجوات التالية

- **human / CEFR:** تدقيق تحريري؛ A2 هو الوسم الحالي لا نتيجة اختبار مستقل، ولا اعتماد لغوي بشري.
- **طب:** الحوار الطبي والروتين الصحي أمثلة تعليمية لا نصيحة طبية؛ لم يُراجع طبياً، ولم تُذكر أسماء أدوية أو جرعات.
- **سكن/أسعار/عناوين/دورات:** المبالغ والأوقات والعنوان والمسار وجداول الدورة بيانات داخل سيناريوهات، وليست أسعاراً أو مواعيد حالية موثقة.
- **تأمين:** اسم AOK أزيل؛ شرح الإجراءات حوار عام غير منسوب إلى شركة معينة ولا يُعد بياناً رسمياً.
- ارتفعت تغطية النصوص إلى 147/157؛ بقيت عشرة نصوص: B1=5 وB2=5. فجوتا حوارات A1/A2 28–30 منفصلتان وغير محسومتين.

## النتيجة النهائية

اكتملت مراجعة R157: لا عيوب مؤكدة غير محسومة ضمن النصوص الاثني عشر، وكل انتقال من التصحيحات الـ32 موثق ومحروس. ارتفعت تغطية التدقيق إلى 147/157؛ تبقى عشرة نصوص B1/B2 للدفعات اللاحقة.
