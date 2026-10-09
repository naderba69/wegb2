# تقرير R133 — أول دفعة A0 (d-a0-01..d-a0-03)

**التاريخ:** 2026-10-08 · **القاعدة:** R133 · **البوابات:** K207a–j

## النطاق

أول دفعة A0: d-a0-01..03 (تحية، أرقام وجمع، تهجئة الاسم) — الحوارات الثلاث بلا waisen.

## الإجمالي

- حوارات: **3** · أسطر: **12** · أسئلة: **9** · إملاءات: **9** · وحدات≈**120**

## الحكم

- **سليمة:** 115 · **مصححة:** 5 · **غير محسومة:** 0
- خمسة تصحيحات/استكمالات عربية في حقول promptAr الفارغة: خمسة أسئلة في d-a0-01/02/03 كانت بلا نص سؤال عربي فأُكملت بأسئلة عربية فصيحة قصيرة مطابقة لألماني A0 ومطابقة نمط بقية مستويات الملف (سؤال عربي لكل promptDe): «مَن يَقول Freut mich؟» و«مَن يقول شكراً؟» و«هل الجملة «الناتج أربعة» صحيحة؟» و«أيّة حروف يتهجّاها B؟» و«ماذا يطلب A من B؟». لم تُعدَّل الألماني أو الخيارات أو المفاتيح أو الإملاءات أو الشرح. لا تحذيرات محتوى. الألماني/الأسئلة/الخيارات/المفاتيح/الإملاءات مقفلة. لا تغيير في W1–W6.

## التصحيحات المطبقة

- `d-a0-01.questions[2].promptAr`: من «» إلى «مَنْ يَقول «سعيدة بلقائك»؟» — ملء حقل promptAr الفارغ لـWer sagt «Freut mich»؟
- `d-a0-02.questions[1].promptAr`: من «» إلى «مَنْ يَقول «شكراً»؟» — ملء promptAr الفارغ لـWer sagt «Danke!»؟
- `d-a0-02.questions[2].promptAr`: من «» إلى «هل الجملة «الناتج أربعة» صحيحة؟» — ملء promptAr الفارغ لسؤال صح/خطأ (Das Ergebnis ist vier).
- `d-a0-03.questions[1].promptAr`: من «» إلى «أيَّةَ حروفٍ يَتهجّاها B؟» — ملء promptAr الفارغ لـWelche Buchstaben buchstabiert B؟
- `d-a0-03.questions[2].promptAr`: من «» إلى «ماذا يَطلُب A مِن B؟» — ملء promptAr الفارغ لـWas bittet A B zu tun؟ (buchstabieren).

## تحذيرات محتوى (غير معدّلة)

- لا تحذيرات محتوى جديدة في هذه الدفعة. تظل التحذيرات W1–W6 (دفعات سابقة، وآخرها W6 في d-b2-11.L2 بسقف «11٪») مفتوحةً وموثّقة في مواضعها.

## فحوص المحتوى

- d-a0-01: التحيّة متسقة: Hallo! ← Guten Tag! ← سؤال الاسم ← تعارف ← Freut mich ← Auf Wiedersehen! مفاتح Q0/Q1/Q2 مطابقة.
- d-a0-02: حساب 1+2=3 متسق: سؤال الجمع ← الجواب الصحيح ← شكر؛ سؤال الصح/الخطأ يؤكد falsch (1+2=3 لا 4).
- d-a0-03: تهجئة Ali متسقة: طلب Buchstabiere ← A–L–I ← شكر؛ المطلوب فعل buchstabieren لا zählen/schreiben/lesen.
- لا تحذيرات محتوى جديدة؛ المواد كلها مفردات A0 تأسيسية بلا قيود قانونية/طبية. الألماني/الخيارات/المفاتيح/الإملاءات مقفلة.

## ملاحظات سياقية (غير معدّلة)

### d-a0-01
- تحية غير رسمية Hallo! ورسمية Guten Tag! سؤال الاسم بِـdu (Wie heißt du?) ثم وداع Auf Wiedersehen!
  - المصدر: d-a0-01-q0
- «Freut mich» اختصار لـ«Es freut mich, Sie/dich kennenzulernen» = سعيد/سعيدة بلقائك.
  - المصدر: d-a0-01-q2
- Auf Wiedersehen! صيغة الوداع الرسمية الشائعة (Tschüss غير رسمي).
  - المصدر: d-a0-01-d2
### d-a0-02
- «Wie viel ist eins plus zwei?» = كم واحد زائد اثنين؟ الجواب drei=ثلاثة.
  - المصدر: d-a0-02-q0
- Danke! = شكراً، يقولها السائل A بعد تلقي الجواب.
  - المصدر: d-a0-02-q1
- 1+2=3 لا 4، فالجملة «Das Ergebnis ist vier» خاطئة (Q2 صح/خطأ).
  - المصدر: d-a0-02-q2
### d-a0-03
- Buchstabiere bitte deinen Namen! = هجِّ اسمك من فضلك؛ فعل buchstabieren=يُهجّئ الحروف.
  - المصدر: d-a0-03-q2
- A–L–I تهجئة Ali (B هي المجيب واسمها Ali في الحوار).
  - المصدر: d-a0-03-q1
- Danke! = شكراً بعد التهجئة؛ نهاية قصيرة نمطية في A0.
  - المصدر: d-a0-03-d2

## بدائل أسلوبية (غير معدّلة)

### d-a0-01
- `نهارك سعيد!` — بديل: `طاب نهارك!` — «Guten Tag» تحية رسمية نهارية.
- `سعيدة بلقائك!` — بديل: `تشرفتُ بك!` — «Freut mich!» بلقائك.
- `إلى اللقاء!` — بديل: `مع السلامة!` — «Auf Wiedersehen».
### d-a0-02
- `كم واحد زائد اثنين؟` — بديل: `كم يساوي واحد زائد اثنين؟` — «Wie viel ist».
- `شكراً!` — بديل: `شكراً جزيلاً!` — «Danke».
### d-a0-03
- `هجِّ اسمك من فضلك!` — بديل: `لطفاً، هجِّ اسمك!` — «Buchstabiere bitte».

## المصادر

### d-a0-01
- [S1] Duden: Hallo/Guten Tag/Auf Wiedersehen تحيات أساسية. — https://www.duden.de/rechtschreibung/Hallo
- [S2] Duden: heißen = يُدعى/اسمي. — https://www.duden.de/rechtschreibung/heissen
- [S3] Goethe A0: Begrüßung und Vorstellung مفردات أساسية. — https://www.goethe.de/
### d-a0-02
- [S4] Duden: plus/zwei/drei/vier أعداد وعملية جمع. — https://www.duden.de/rechtschreibung/plus
- [S5] Duden: Danke = شكراً. — https://www.duden.de/rechtschreibung/danke
- [S6] Goethe A0: Zahlen 1–10. — https://www.goethe.de/
### d-a0-03
- [S7] Duden: buchstabieren = يُهجّئ. — https://www.duden.de/rechtschreibung/buchstabieren
- [S8] Duden: Buchstabe = حرف. — https://www.duden.de/rechtschreibung/Buchstabe
- [S9] Goethe A0: Buchstabieren des Namens. — https://www.goethe.de/

(مجموع المراجع: 9.)

## الصوت

- إدخالات بيان صوتي: لا يوجد.
- ملفات mp3: لا يوجد.
- لا استماع ولا ادعاء صوتي.

## البطاقات اليتيمة

- الحوارات الثلاث بلا حقل waisen (فحص صريح لكل كائن).

## الحدود

- **cefr:** لم يُعد تقييم CEFR أو النسبة.
- **audio:** لا استماع ولا توليد صوتي.
- **human:** ليست مراجعة بشرية.
- **legal:** لا سياق قانوني؛ تحيات/أرقام/تهجئة.
- **medical:** لا محتوى طبي في هذه الدفعة (مفردات تأسيسية).
- **professional:** لا توصيات مهنية؛ محتوى A0 تعليمي بحت.
