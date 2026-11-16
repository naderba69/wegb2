# PA-034 — مراجعة تصريفات المفردات، الدفعة 08

**التاريخ:** 2026-11-04

## النطاق

راجعت هذه الدفعة داخلياً بنداً بنداً الرؤوس متعددة الكلمات المتبقية في B1 بعد قراءة الرأس والمثال والقيمة الحالية. أسفرت المراجعة عن **87 تصحيحاً**، كلها B1 وكلها رؤوس متعددة الكلمات، وفيها 49 رأساً يحوي الضمير `sich`. كان تجميع المستوى ووجود المسافة والضمير أدوات فرز فقط؛ لم يُطبق regex أو مولد صرف على البنك.

ومع الدفعات السبع السابقة صار المجموع المحروس **649 بطاقة**: A0=4، A1=79، A2=109، B1=308، B2=149.

## ما صُحح

تغطي القرارات:

- تصريف الفعل الحامل في التراكيب الوصفية: `sachlich bleiben → bleibt sachlich, blieb sachlich, ist sachlich geblieben`، و`deutlich steigen → steigt deutlich, stieg deutlich, ist deutlich gestiegen`؛
- الأفعال الانعكاسية وموقع الضمير والمكمل: `sich beziehen auf`, `sich auswirken auf`, `sich zurechtfinden`, `sich vorbereiten auf die Prüfung`, `sich auseinandersetzen`؛
- Funktionsverbgefüge والتعابير الثابتة: `Rücksicht nehmen auf`, `zu dem Schluss kommen`, `zum Ausdruck bringen`, `unter Druck stehen`, `etwas in Angriff nehmen`, `ins Stocken geraten`؛
- الأفعال القوية داخل التركيب: `gelten als → galt/gegolten`، و`um Rückmeldung bitten → bat/gebeten`، و`zurückgreifen auf → griff/zurückgegriffen`، و`sich stoßen → stieß/gestoßen`؛
- Ersatzinfinitiv في `sich ablenken lassen` و`darauf ankommen lassen`؛
- المبني للمجهول في `geboren werden → wird geboren, wurde geboren, ist geboren worden`؛
- الرأس المنسق `teilen und kommentieren` بحيث تصرّف الفعلان، وتصحيح `verstehen sich` بحسب المثال مع إبقاء تغيير الدفعة في `posInfo` فقط.

أبقت المراجعة سبعة رؤوس خارج fixture: `loben für`, `protestieren gegen`, `beantragen und bewilligen`, `verfügen über`, `dienen zu`, `abstimmen über`, `einschätzen als`. في ستة منها كانت صيغ الفعل الحامل صحيحة بالفعل ولا يوجب غياب المكمل تكرار التصريف، أما الرأس المنسق `beantragen und bewilligen` فمثاله يبدل الفاعل بين الفعلين ولا يبرر تخمين تمثيل موحد من الفرز وحده.

يحفظ `scripts/fixtures/vocab-posinfo-reviewed-08.json` لكل قرار المعرف والبنك والمستوى والرأس والقيمة السابقة والمصححة. تطبق الرقعة `scripts/patches/apply_vocab_posinfo_review_pa034_08.py` القرار فقط عند التطابق الكامل، وترفض انجراف النطاق، وهي قابلة للإعادة من دون تغيير جديد.

## الحراسة

- `npm run audit:vocab-posinfo` يحرس الآن 649/649 عبر ثمانية fixtures ويمنع تكرار المعرفات أو انجراف البنك/المستوى/الرأس/الصيغة.
- K414a–c تحرس حجم الدفعة ومستواها وعدد الرؤوس متعددة الكلمات والانعكاسية والاستبعادات السبعة وقرارات الفعل الحامل والقوة وErsatzinfinitiv والمبني للمجهول وحدود الرقعة والادعاء.
- يثبت فحص diff أن 87 بطاقة فقط تغيرت في `content/vocab.json` وأن الحقل الوحيد المتغير فيها هو `posInfo`، مع تطابق القيم السابقة والمصححة مع HEAD والـfixture 87/87.

## التحقق المحلي

- أعادت الرقعة `applied 87 corrections` ثم `applied 0 corrections; 87 already current`.
- نجحت بوابة التصريف 649/649، وTypeScript وESLint وsmoke ‏2468/2468 وinteraktiv ‏1027/1027.
- نجحت تدقيقات المحتوى والأنماط المعروفة والخطة والتبعيات والنزاهة المتأثرة، ونجح build الإنتاجي في 19/19 مساراً.
- تطابقت البنوك العامة المشتقة مع قرارات الدفعة 87/87.

## حدود الادعاء والمتبقي

هذه مراجعة داخلية محدودة وليست توقيعاً لغوياً خارجياً. من 1164 بطاقة تحمل `posInfo` صارت 649 محروسة، بينما تبقى **515 بطاقة غير مشمولة بالـfixtures**: منها 491 ذات ثلاث صيغ و24 ذات تنسيق آخر. تشمل البقية 78 رأساً متعدد الكلمات ذات ثلاث صيغ، لكن وجود المسافة لا يجعلها أخطاء. عدم الشمول لا يعني الخطأ، ونجاح البوابة لا يعتمد الحقول المتبقية ولا يثبت CEFR أو الجاهزية.
