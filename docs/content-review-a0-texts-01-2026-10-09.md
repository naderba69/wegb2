# تقرير R135 — أول دفعة نصوص A0 (t-a0-01..05)

- **قاعدة المراجعة:** R135
- **النطاق:** 5 نصوص A0 (الأبجدية، التحيات، الأرقام 1–10، الأيام، ضمائر الفصل)
- **الوحدات ≈:** 35
- **التصحيحات:** 2 · غير محسوم: 0

## الحكم

> تصحيحان عربيان فقط: استكمال حقلَي promptAr فارغَين في t-a0-03 Q3 وt-a0-04 Q3 (سؤال العمر وسؤال يوم اليوم). روجعت النصوص الخمسة كاملة؛ العربية مطابقة للألماني في التراكيب الأساسية (التحيات، الأرقام، أيام الأسبوع، الضمائر). لا تعديل للألماني أو المفاتيح. لا تحذيرات محتوى جديدة. W1–W4/W6 تبقى مفتوحة، ولا صوت لهذه النصوص.

## التصحيحات

### 1. `t-a0-03.questions[2].promptAr` · `promptAr`
- **قبل:** «»
- **بعد:** «كم عمر الشخص في النص؟»
- **السبب:** استكمال حقل promptAr فارغ لسؤال «Wie alt ist die Person im Text؟» (ثلاثون سنة) مطابقة الألماني ونمط بقية الأسئلة في النص.

### 2. `t-a0-04.questions[2].promptAr` · `promptAr`
- **قبل:** «»
- **بعد:** «ما يوم اليوم في النص؟»
- **السبب:** استكمال حقل promptAr فارغ لسؤال «Welcher Tag ist heute im Text؟» (Montag = الاثنين) مطابقة الألماني والنمط.

## ملاحظات سياقية

### t-a0-01
- نص الأبجدية: سرد الحروف مع لفظ تقريبي؛ العربية لا تنقل لفظ J/V/W (jott/fau/weh) وX/Y (iks/üpsilon) بل تذكر طريقة اللفظ في نظام التهجئة الألمانية — النقل صحيح.
- ß كلمة إيتسيست (Eszett / scharfes S) يُعرَّف «حرفاً» (ein Buchstabe) وهو الجواب الصحيح في Q2.
- الأوملاوت Ä/Ö/Ü ثلاثة أحرف (Umlaute)؛ السؤال Q1 يجيب «drei» مطابقة النص.

### t-a0-02
- تحية «Guten Tag!» تلي «Ich komme aus Tunesien»؛ هي جواب Q3 الرسمي.
- العربية تستعمل «نهارك سعيد» لـGuten Tag و«سعيدة بلقائك» لـFreut mich و«إلى اللقاء» لـAuf Wiedersehen، صياغ سليمة.

### t-a0-03
- الأرقام 1–10 مع الصفر؛ «Ich bin dreißig Jahre alt» يحدد العمر ثلاثين سنة (جواب Q3).
- خمسة زائد واحد = ستة (sechs)؛ تعني zehn=10.

### t-a0-04
- أيام الأسبوع السبعة؛ نهاية الأسبوع السبت والأحد؛ اليوم الاثنين (جواب Q3 المُستكمل).
- العربية تذكر «السبت والأحد هما عطلة نهاية الأسبوع» لـWochenende، مطابقة صحيحة.

### t-a0-05
- ضمائر الفصل (ich/du/er/sie/wir/ihr/Sie) و«هذا اسمي»؛ العربية تضيف ملاحظة «وتُستعمل Sie أيضاً للمخاطَب الرسمي» وهي توضيح مفيد لا ترجمة حرفية مضافة.
- أسئلة النص تختبر ضمائر الفصل؛ المفاتيح مطابقة.

## فحوص المحتوى

- **CHK-R135-01** (pass): حقولا promptAr الفارغان (t-a0-03 Q3 وt-a0-04 Q3) مملوآن.
- **CHK-R135-02** (pass): لا توجد حقول promptAr فارغة في نصوص A0 الخمسة بعد التصحيح.
- **CHK-R135-03** (pass): كل الأسطر الألمانية والعناوين والخيارات والمفاتيح والشرح مقفلة.
- **CHK-R135-04** (pass): الإجابات مطابقة للنص (dreißig/Montag/drei).

## المصادر

### t-a0-01
- Goethe A1 Starter — Alphabet und Buchstabieren. — https://www.goethe.de/de/spr/ueb.html — محتوى A0 للأبجدية وطريقة لفظ الحروف.

### t-a0-02
- Goethe A1 — Begrüßungen und Vorstellung. — https://www.goethe.de/de/spr/ueb/fer.html — Hallo/Guten Tag/Freut mich/Auf Wiedersehen تحيات مستوى A0.

### t-a0-03
- Goethe A1 — Zahlen 1 bis 10 und Alter. — https://www.goethe.de/de/spr/ueb.html — الأرقام الأساسية وذكر العمر بـIch bin … Jahre alt.

### t-a0-04
- Goethe A1 — Wochentage. — https://www.goethe.de/de/spr/ueb.html — أيام الأسبوع السبعة وWochenende.

### t-a0-05
- Goethe A1 — Personalpronomen (ich/du/er/sie/wir/ihr/Sie). — https://www.goethe.de/de/spr/ueb.html — الضمائر ومخاطبة Sie الرسمية.

## الحدود

- **human:** لا اعتماد لغوي بشري؛ المراجعة مصدرية على النص الحي.
- **legal:** لا محتوى قانوني في نصوص A0.
- **medical:** لا محتوى طبي.
- **cefr:** لا إعادة حساب CEFR.

## البوابات K209a–j

- K209a (يُرَحَّل إلى `scripts/engine_smoke.ts`).
- K209b (يُرَحَّل إلى `scripts/engine_smoke.ts`).
- K209c (يُرَحَّل إلى `scripts/engine_smoke.ts`).
- K209d (يُرَحَّل إلى `scripts/engine_smoke.ts`).
- K209e (يُرَحَّل إلى `scripts/engine_smoke.ts`).
- K209f (يُرَحَّل إلى `scripts/engine_smoke.ts`).
- K209g (يُرَحَّل إلى `scripts/engine_smoke.ts`).
- K209h (يُرَحَّل إلى `scripts/engine_smoke.ts`).
- K209i (يُرَحَّل إلى `scripts/engine_smoke.ts`).
- K209j (يُرَحَّل إلى `scripts/engine_smoke.ts`).
