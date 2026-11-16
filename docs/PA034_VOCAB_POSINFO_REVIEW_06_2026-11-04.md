# PA-034 — مراجعة تصريفات المفردات، الدفعة 06

**التاريخ:** 2026-11-04

## النطاق

راجعت هذه الدفعة داخلياً بنداً بنداً 75 بطاقة إضافية بعد قراءة الرأس والمثال والقيمة الحالية. استُعملت مقارنة الأفعال القوية وتجميع جذور `d/t/chn/fn/gn/tm` والبادئات والانعكاس للفرز فقط؛ لم يُطبق مولد صرف أو regex على البنك.

التوزيع: A0=1، A1=8، A2=8، B1=26، B2=32. تضم الدفعة 69 رأساً مفرداً وستة رؤوس انعكاسية. ومع الدفعات الخمس السابقة صار المجموع المحروس **500 بطاقة**: A0=4، A1=66، A2=62، B1=220، B2=148.

## ما صُحح

تغطي القرارات:

- أفعالاً قوية كانت تعرض صيغة ضعيفة أو Partizip مختلقاً: `beweisen → bewies, hat bewiesen`، و`frieren → fror, hat gefroren`، و`reiten → ritt, ist geritten`، و`schwimmen → schwamm, ist geschwommen`، و`wiegen → wog, hat gewogen`؛
- نهايات جذر مشوهة: `atmen → atmet, atmete, hat geatmet`، و`berechnen → berechnet`، و`kennzeichnen → kennzeichnet`، ونسختا `öffnen → öffnet, öffnete, hat geöffnet`؛
- الفصل الصحيح: `darstellen`, `festlegen`, `festsetzen`, `feststellen`, `kennenlernen`, `nahelegen`، وفي المقابل عدم فصل `widerlegen`, `wiederholen`, `überholen`, `überlegen`, `überprüfen`, `überqueren`, `überraschen`, `übersetzen` بحسب الرأس والمثال؛
- ستة أفعال انعكاسية أُعيد فيها الضمير إلى الصيغ الثلاث: `sich entschuldigen`, `sich freuen`, `sich konzentrieren`, `sich kümmern`, `sich vorstellen`, `sich weigern`؛
- المساعد بحسب الاستعمال في المثال: `ist begegnet/gescheitert/geklettert/geritten/geschwommen/gestolpert/getrocknet/verdorben/gewandert`.

يحفظ `scripts/fixtures/vocab-posinfo-reviewed-06.json` لكل قرار المعرف والبنك والمستوى والرأس والقيمة السابقة والمصححة. تطبق الرقعة `scripts/patches/apply_vocab_posinfo_review_pa034_06.py` القرار فقط عند التطابق الكامل، وترفض انجراف النطاق، وهي قابلة للإعادة من دون تغيير جديد.

## الحراسة

- `npm run audit:vocab-posinfo` يحرس الآن 500/500 عبر ستة fixtures ويمنع تكرار المعرفات أو انجراف البنك/المستوى/الرأس/الصيغة.
- K412a–c تحرس حجم الدفعة وتوزيعها والرؤوس الانعكاسية وقرارات القوة والمساعد والانفصال وحدود الرقعة والادعاء.
- بقيت قوائم المقارنة وتجميع الجذور والبادئات أدوات فرز فقط؛ fixture المحرر هو سجل القرار.

## التحقق المحلي

- أعادت الرقعة `applied 75 corrections` ثم `applied 0 corrections; 75 already current`.
- نجحت بوابة التصريف 500/500، وTypeScript وESLint وsmoke ‏2462/2462 وinteraktiv ‏1027/1027.
- نجحت تدقيقات المحتوى والأنماط المعروفة والخطة والتبعيات وبقية بوابات النزاهة المنهجية، ونجح build الإنتاجي في 19/19 مساراً.
- أثبت فحص diff أن 75 بطاقة فقط تغيرت في `content/vocab.json` وأن الحقل الوحيد المتغير فيها هو `posInfo`، وتطابقت القيم السابقة والمصححة مع HEAD والـfixture 75/75.

## حدود الادعاء والمتبقي

هذه مراجعة داخلية محدودة وليست توقيعاً لغوياً خارجياً. كان رقم **49** السابق بقية قائمة فرز آلية بعينها، لا عدداً شاملاً للأخطاء؛ وقد وسّع الفرز الجديد الأنماط وكشف بطاقات خارج تلك القائمة، لذلك لا يصح طرح 75 منه أو إبقاؤه كعداد عيوب مفتوحة. المقياس الصادق الآن هو أن 500 من 1164 حقلاً تحمل `posInfo` محروسة، بينما تبقى **664 حقلاً غير مشمولة بالـfixtures** وتحتاج مراجعة سياقية قبل أي اعتماد. عدم شمولها لا يعني أنها خاطئة، ونجاح البوابة لا يعتمدها ولا يثبت CEFR أو الجاهزية.
