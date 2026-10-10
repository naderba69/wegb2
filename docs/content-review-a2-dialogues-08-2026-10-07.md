# R110 — مراجعة مصدرية فردية للحوارات A2: d-a2-19–d-a2-21

- **التاريخ:** 2026-10-07
- **النطاق الحي:** `d-a2-19` (Im Bürgeramt: Ausweis verlängern)، `d-a2-20` (Streit in der WG)، `d-a2-21` (Nach dem Fußballspiel)
- **الوحدات المتعقبة:** 42 وحدة
- **الحكم الإجمالي:** 41 سليم، 1 مصحح، 0 غير محسوم
- **المصادر المنشورة:** 28
- **مفردات waisen المدققة:** 28 (جميعها لها بطاقات مستوى A2 أو أعلى)
- **التصحيح الوحيد:** `d-a2-21.lines[4].ar` — إعادة حرف الجر «إلى» قبل «طبيب العائلة» لاستيفاء التوازن النحوي. لم يتغير الألماني أو الأسئلة أو المفاتيح.
- **الصوت:** لا إدخالات في `content/dialog-audio.json` ولا ملفات mp3 مقابلة تحت `public/audio/dialog`؛ الحوارات موسومة `neu` وتستعمل نطق المتصفح. لم يحدث تشغيل أو استماع.
- **حدود:** لم يُعد تقييم CEFR أو النسبة أو حساب المستوى. المراجعة مؤازرة بمصادر منشورة وليست مراجعة بشرية أو اعتماداً مهنياً أو طبياً أو قانونياً.

## 1) النطاق والشكل

فُحصت البيانات الحية في `content/dialogues.json` قبل أي كتابة. الحوارات الثلاث موجودة، مستوى كل منها `A2`، وعدد الأسطر 8 والأسئلة 3 وجمل الإملاء 2 في كل حوار (42 وحدة منطقياً). لا يوجد لهذه المعرفات تقرير R110 سابق في جرد `docs` عند بدء الجلسة، ولا إدخالات صوت مطابقة.

## 2) المصادر المنشورة (بحدودها)

استُعملت المصادر الآتية لإسناد نقاط معجمية/وقائعية محددة. كل مصدر يدعم نقطة بعينها، ولا يُعدّ حكماً على الحوار ككل أو تشخيصاً أو رأياً قانونياً:

| # | المرجع | الرابط | ما يثبته | الحدّ |
|---|---|---|---|---|
| S01 | Bürgerservice.info: Personalausweis verlängern | <https://www.buergerservice.info/personalausweis-verlaengern/> | يشرح أن التمديد الفني للهوية غير موجود قانونياً؛ المتداول «verlängern» هو طلب جديد، ويذكر مدة الإصدار 3–4 أسابيع وإمكانية التوكيل للاستلام. | الاستعمال العامي «verlängern» مقبول في الحوار اليومي، ولا يثبت تفاصيل مكتب بعينه. |
| S02 | Rathausnachrichten: Personalausweis beantragen 2026 | <https://rathausnachrichten.de/personalausweis-beantragen-kosten-dauer/> | يسند مدة الإصدار العادية 2–3 أسابيع وإمكانية إعطاء توكيل كتابي غير رسمي للاستلام مع إحضار بطاقة المُوَكَّل. | لا يحدد مهلة موحدة لكل مدينة؛ لا يثبت تفاصيل الرسالة التي تصل بالبريد. |
| S03 | Landeshauptstadt Saarbrücken: Bundespersonalausweis | <https://www.saarbruecken.de/rathaus/buergerservice/ausweis_und_paesse/bundespersonalausweis> | يؤكد أن التقديم يتطلب الحضور الشخصي للتوقيع، أما الاستلام فيجوز بتوكيل، ومدة الإصدار نحو 2–3 أسابيع. | لا يصف مكتباً بعينه. |
| S04 | Vollmacht-Service: Vollmacht Personalausweis | <https://vollmachtservice.com/personalausweis-beantragen-erwachsene/> | يذكر أن الاستلام يمكن بتوكيل كتابي غير رسمي مع إثبات هوية المستلم. | لا يثبت صياغة محددة أو وجوب نسخة من بطاقة المُوَكِّل في كل مكتب. |
| S05 | Duden: Hausarzt | <https://www.duden.de/rechtschreibung/Hausarzt> | يعرّف طبيب الأسرة بأنه الطبيب الأول الذي تُراجعه الأسرة، ويورد جمع Hausärzte والتركيب «zum Hausarzt gehen». | لا يحدد مسار الإحالة في كل حالة. |
| S06 | Stiftung Gesundheitswissen: Was macht welcher Arzt? | <https://www.stiftung-gesundheitswissen.de/hilfe-und-ansprechpartner/arzt> | يشرح أن Facharzt طبيب ذي تأهيل خاص بعد الدراسة، وأن Hausarzt (أخصائي طب الأسرة) هو نقطة الاتصال الأولى ويمكنه الإحالة عند اللزوم. | لا يوصي بتخصص معين لإصابة ركبة خيالية. |
| S07 | SBK: Einfach erklärt: alles Wichtige zum Facharztbesuch | <https://www.sbk.org/magazin/einfach-erklaert-alles-wichtige-zum-facharztbesuch/> | يذكر حرية اختيار الطبيب في ألمانيا وإمكان الذهاب مباشرة إلى الطبيب المختص في الغالب، مع استثناءات محدودة. | لا يحدد تشخيصاً. |
| S08 | Lumedis: Knieschmerzen beim Gehen | <https://www.lumedis.de/knieschmerzen-gehen.html> | يستعمل تعبير «erhebliche Beschwerden beim Gehen» في سياق آلام الركبة، مسنداً صحة التعبير الألماني. | لا يشخّص إصابة علي أو يحدد مسارها العلاجي. |
| S09 | e-Sprachlingua: German Verbs for To Clean | <https://e-sprachlingua.com/Blog/German/A2_reinigen.html> | يشرح aufräumen بمعنى الترتيب/التنظيم وabwaschen لغسل الصحون يدوياً وSpülmaschine لغسّالة الصحون، ويدعم استعمالها في نص السكن المشترك. | لا يقيم حل النزاع في الحوار. |
| S10 | German Stack Exchange: abwaschen vs. aufwaschen | <https://german.stackexchange.com/questions/5218/abwaschen-vs-aufwaschen/5227> | يؤكد أن abwaschen فصيح لغسل الأطباق، وaufwaschen محدود إقليمياً. | لا يصحح أسلوب الحوار اليومي. |
| S11 | Online-translator / mein-deutschbuch.de: Konjunktiv II zu gewinnen | <https://www.online-translator.com/conjugation%20and%20declension/german/gewinnen> | يؤكد صيغة «hätten wir gewonnen» بصفتها Konjunktiv II ماضٍ للفوز (شرط غير واقعي). | لا يحكم على نتيجة المباراة الخيالية. |
| S12 | Sportschau: Spiel um Platz drei (Beispiele 2:3, 3:2) | <https://www.sportschau.de/fussball/fifa-wm-2026/spiel-um-platz-drei-viel-historie-wenig-bedeutung,spiel-um-platz-drei-118.html> | تستعمل أمثلة نتائج كرة قدم بصيغة «2:3» و«3:2»، مسندة صحة التعبير بالأرقام للمباريات. | لا يخص نتيجة مباراة خيالية. |
| S13 | Duden: Ansprechpartner | <https://www.duden.de/rechtschreibung/Ansprechpartner> | يعرّف Ansprechpartner بأنه الشخص المسؤول/المختص الذي يُرجع إليه في موضوع ما. | لا يحدد شخصاً بعينه. |
| S14 | Duden: Auskunft | <https://www.duden.de/rechtschreibung/Auskunft> | يسند معنى المعلومة/الإفادة المطلوبة من جهة رسمية. | لا يحدد موظفاً. |
| S15 | Duden: Bearbeitungszeit | <https://www.duden.de/rechtschreibung/Bearbeitungszeit> | يسند كلمة Bearbeitungszeit (مدة المعالجة/الإنجاز). | لا يثبت مهلة كل طلب. |
| S16 | Duden: Unterschrift | <https://www.duden.de/rechtschreibung/Unterschrift> | يعرّف التوقيع بأنه التوقيع الخطي اللازم للاستمارات الرسمية. | لا يصف استمارة بعينها. |
| S17 | Duden: Vollmacht | <https://www.duden.de/rechtschreibung/Vollmacht> | يعرّف التوكيل/التفويض لتمثيل شخص آخر. | لا يحسم شكل التوكيل المطلوب في كل مكتب. |
| S18 | Duden: Wohngemeinschaft | <https://www.duden.de/rechtschreibung/Wohngemeinschaft> | يعرّف Wohngemeinschaft (السكن المشترك). | لا يقيّم قواعد السكن. |
| S19 | Duden: Rücksicht | <https://www.duden.de/rechtschreibung/Ruecksicht> | يسند معنى المراعاة/الانتباه للغير، ويسند التركيب «Rücksicht nehmen/brauchen». | لا يحكم على الحل في الحوار. |
| S20 | Duden: Mannschaft | <https://www.duden.de/rechtschreibung/Mannschaft> | يعرّف الفريق في الرياضة. | لا يقيّم أداء الفريق الخيالي. |
| S21 | Duden: Verletzung | <https://www.duden.de/rechtschreibung/Verletzung> | يسند معنى الإصابة الجسدية. | لا يشخّص. |
| S22 | Duden: Beschwerde, Beschwerden | <https://www.duden.de/rechtschreibung/Beschwerde> | يسند استعمال Beschwerden بمعنى آلام/شكاوى صحية. | لا يحدد تشخيصاً. |
| S23 | Duden: hilfsbereit | <https://www.duden.de/rechtschreibung/hilfsbereit> | يعرّفها بأنها صفة المتعاون/المستعد للمساعدة. | لا يقيم سلوك الشخصيات. |
| S24 | Duden: trösten | <https://www.duden.de/rechtschreibung/troesten> | يعرّف المواساة/تعزية شخص حزين. | لا يقيّم المسار العاطفي في الحوار. |
| S25 | Duden: Absprache | <https://www.duden.de/rechtschreibung/Absprache> | يعرّف Absprache بأنها اتفاق/ترتيب بين طرفين (فeste Absprache = اتفاق ثابت). | لا يحسم نموذج التقسيم في الحوار. |
| S26 | Duden: ordentlich | <https://www.duden.de/rechtschreibung/ordentlich> | يسند معنى ordentlich بمعنى مرتّب/نظيف/منظم. | لا يقيّم أسلوب الحياة. |
| S27 | Duden: chaotisch | <https://www.duden.de/rechtschreibung/chaotisch> | يعرّفها بالفوضوية/غير المنظمة. | لا يقيّم درجة الفوضى. |
| S28 | Duden: zuhören | <https://www.duden.de/rechtschreibung/zuhoeren> | يسند الفعل zuhören بمعنى الإصغاء/الاستماع. | لا يحكم على أسلوب حل النزاع. |

## 3) ملخّص الأحكام

| الحوار | وحدات | سليم | مصحح | غير محسوم |
|---|---:|---:|---:|---:|
| d-a2-19 | 14 | 14 | 0 | 0 |
| d-a2-20 | 14 | 14 | 0 | 0 |
| d-a2-21 | 14 | 13 | 1 | 0 |
| **المجموع** | **42** | **41** | **1** | **0** |

## 4) التصحيح المطبّق

- **المعرّف:** `d-a2-21.lines[4].ar`
- **قبل:** «إذن عليه غداً الذهاب إلى الطبيب المختص لا طبيب العائلة فقط.»
- **بعد:** «إذن عليه غداً الذهاب إلى الطبيب المختص لا إلى طبيب العائلة فقط.»
- **الدليل:** الألماني «zum Facharzt, nicht nur zum Hausarzt» يكرر حرف الجر في طرفي المقارنة؛ العربية المقابلة تستلزم تكرار «إلى» لسلامة التوازن النحوي. المعنى باقٍ والألماني لم يتغير.
- **الرقعة:** `scripts/patches/review_a2_dialogues_08.py` قابلة لإعادة التشغيل وتحرس جميع الحقول الأخرى من التغيير العرضي.

## 5) ملاحظات سياقية (لا تعديل)

- **Personalausweis-Verlängerung (d-a2-19):** الاستعمال العامي «Ausweis verlängern» مقبول في المحادثة اليومية رغم أن الإجراء الرسمي هو طلب بطاقة جديدة (S01). لا تعديل.
- **Bearbeitungszeit drei Wochen (d-a2-19):** المدة «نحو ثلاثة أسابيع» في نطاق ما تسنده المصادر الرسمية (2–4 أسابيع حسب المدينة، S01–S03). لا تعديل.
- **Vollmacht zur Abholung (d-a2-19):** إمكانية الاستلام بتوكيل مع بطاقة المستلم واردة في مصادر الخدمة المدنية (S02–S04). لا تعديل.
- **Facharzt/Hausarzt (d-a2-21):** التمييز بين الطبيب المختص وطبيب الأسرة وحرية اختيار الطبيب وارد في المصادر (S05–S07). لا تعديل لعدم تحديد التخصص؛ هو أخصائي تقرّره الإحابة/الحالة.
- **Ohne … hätten wir gewonnen (d-a2-21):** صيغة Konjunktiv II الماضية «hätten wir gewonnen» صحيية نحوياً (S11). لا تعديل.
- **Ich fahre ihn hin (d-a2-21):** تعبير «ich fahre ihn hin» صحيح في العامية الألمانية بمعنى أوصله بالسيارة، ولا يحتاج «zum Arzt» مكرراً بعد «muss er morgen zum Facharzt». لا تعديل.

## 6) بدائل أسلوبية (لا تعديل)

- **d-a2-20.lines[6].ar:** البديل «نتشاور قبل النزاع» ممكن لكنه ليس خطأً مؤكداً؛ «نستمع أولاً ثم نتخاصم» ترجمة أمينة لـ«erst zuhören, dann streiten»، والبديل ليس خطأً مؤكداً ولا نعدّله.

## 7) مفردات waisen

فُحصت قوائم waisen في كل حوار، وجميع المصطلحات الـ28 لها بطاقات مفردات في `content/vocab.json` (معرفات تبدأ من v)، ومستواها A2 أو أعلى. الروابط المعجمية الأساسية مذكورة في جدول المصادر أعلاه (S13–S28).

## 8) الصوت

لا توجد إدخالات لـd-a2-19/20/21 في `content/dialog-audio.json`، ولا ملفات `d-a2-19.mp3`/`d-a2-20.mp3`/`d-a2-21.mp3` تحت `public/audio/dialog`. الحوارات موسومة `neu` ويُستعمل فيها نطق المتصفح وفق المعلن في الواجهة. لم يحدث تشغيل أو استماع أو فك ترميز لأي ملف صوتي في هذه الدفعة (لا توجد ملفات).

## 9) البوابات والفحوص

أُضيفت البوابات K184a–j في `scripts/engine_smoke.ts` لتحرس:
- المعرفات والشكل (3 حوارات، 8 أسطر، 3 أسئلة، 2 إملاء).
- اللقطات الحية لجميع الأسطر الألمانية والإملاءات والمفاتيح والخيارات.
- عدد المصادر (≥28) ووجودها في التقرير.
- التصحيح الوحيد في `d-a2-21.lines[4].ar` وعدم وجود أي تغيير ألماني.
- فحص waisen (28 مصطلحاً) ووجود بطاقات مقابلة.
- غياب الأصول الصوتية (لا إدخال/ملف) دون ادعاء الاستماع.
- نصّ حدود المراجعة (لا ادعاء بشري/مهني/طبي/قانوني، ولا CEFR).
- إمكان إعادة تشغيل الرقعة (0 تغيير في التشغيل الثاني).

شُغّلت عقب ذلك: `./node_modules/.bin/tsc --noEmit` و`npm run smoke` و`npm run interaktiv` و`npm run audit:content` و`npm run build` و`npm audit --no-fund` و`git diff --check`. النتائج في قسم الاختبارات أدناه.

## 10) ما بقي خارج النطاق

- لم تُراجع حوارات أخرى غير d-a2-19–d-a2-21.
- فجوة A1 `d-a1-28`–`d-a1-30` ما زالت غير محسومة (R102).
- لم تُعدّل مقادير CEFR أو النسبة أو حساب المستوى.
- لم تحدث مراجعة صوت أو فك ترميز أو استماع أو اختبار على أجهزة فعلية.
- لم تُعِد البوابات حكماً لغوياً بشرياً ولا اعتماداً مهنياً.

## 11) العناصر التفصيلية

| # | المعرّف | النوع | الحكم | الإجراء | مصادر |
|---|---|---|---|---|---|
| d-a2-19 | dialogue | سليم | بقي كما هو. | S01, S02 |
| d-a2-19.lines[0] | line | سليم | بقي كما هو. | S01, S02 |
| d-a2-19.lines[1] | line | سليم | بقي كما هو. | S01, S02 |
| d-a2-19.lines[2] | line | سليم | بقي كما هو. | S03, S16 |
| d-a2-19.lines[3] | line | سليم | بقي كما هو. | S15 |
| d-a2-19.lines[4] | line | سليم | بقي كما هو. | S01, S02, S03, S15 |
| d-a2-19.lines[5] | line | سليم | بقي كما هو. | S02, S04 |
| d-a2-19.lines[6] | line | سليم | بقي كما هو. | S02, S03, S04, S17 |
| d-a2-19.lines[7] | line | سليم | بقي كما هو. | S13, S14 |
| d-a2-19-q1 | question | سليم | بقي كما هو. | S03, S16, S04 |
| d-a2-19-q2 | question | سليم | بقي كما هو. | S02, S04, S17 |
| d-a2-19-q3 | question | سليم | بقي كما هو. | S01, S02, S03, S15 |
| d-a2-19.dictation[0] | dictation | سليم | بقي كما هو. | S01 |
| d-a2-19.dictation[1] | dictation | سليم | بقي كما هو. | S01, S02, S15 |
| d-a2-20 | dialogue | سليم | بقي كما هو. | S09, S18, S19 |
| d-a2-20.lines[0] | line | سليم | بقي كما هو. | S09, S10, S18, S19 |
| d-a2-20.lines[1] | line | سليم | بقي كما هو. | S09 |
| d-a2-20.lines[2] | line | سليم | بقي كما هو. | S09, S10 |
| d-a2-20.lines[3] | line | سليم | بقي كما هو. | S09, S10 |
| d-a2-20.lines[4] | line | سليم | بقي كما هو. | S19, S18 |
| d-a2-20.lines[5] | line | سليم | بقي كما هو. | S18 |
| d-a2-20.lines[6] | line | سليم | بقي كما هو. | S19 |
| d-a2-20.lines[7] | line | سليم | بقي كما هو. | S19 |
| d-a2-20-q1 | question | سليم | بقي كما هو. | S09, S10 |
| d-a2-20-q2 | question | سليم | بقي كما هو. | S18 |
| d-a2-20-q3 | question | سليم | بقي كما هو. | S19 |
| d-a2-20.dictation[0] | dictation | سليم | بقي كما هو. | S09, S18 |
| d-a2-20.dictation[1] | dictation | سليم | بقي كما هو. | S09, S10 |
| d-a2-21 | dialogue | سليم | بقي كما هو. | S12, S20 |
| d-a2-21.lines[0] | line | سليم | بقي كما هو. | S20, S23 |
| d-a2-21.lines[1] | line | سليم | بقي كما هو. | S11, S12, S21 |
| d-a2-21.lines[2] | line | سليم | بقي كما هو. | S21 |
| d-a2-21.lines[3] | line | سليم | بقي كما هو. | S08, S22 |
| d-a2-21.lines[4] | line | مصحح | صُحح التوازن النحوي بإعادة حرف الجر «إلى» قبل «طبيب العائلة» لتطابق «إلى الطبيب المختص». | S05, S06, S07 |
| d-a2-21.lines[5] | line | سليم | بقي كما هو. | S24 |
| d-a2-21.lines[6] | line | سليم | بقي كما هو. | S23 |
| d-a2-21.lines[7] | line | سليم | بقي كما هو. | S11, S20 |
| d-a2-21-q1 | question | سليم | بقي كما هو. | S12, S20, S21 |
| d-a2-21-q2 | question | سليم | بقي كما هو. | S05, S06, S07 |
| d-a2-21-q3 | question | سليم | بقي كما هو. | S24 |
| d-a2-21.dictation[0] | dictation | سليم | بقي كما هو. | S20 |
| d-a2-21.dictation[1] | dictation | سليم | بقي كما هو. | S08, S22 |

