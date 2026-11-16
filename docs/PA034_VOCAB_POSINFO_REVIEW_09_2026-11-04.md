# PA-034 — مراجعة تصريفات المفردات، الدفعة 09

**التاريخ:** 2026-11-04

## النطاق

راجعت هذه الدفعة داخلياً بنداً بنداً الرؤوس متعددة الكلمات المتبقية في B2 بعد قراءة الرأس والمثال والقيمة الحالية. شملت المراجعة 68 رأساً، وأسفرت عن **49 تصحيحاً**، كلها B2 وكلها رؤوس متعددة الكلمات، وفيها 37 رأساً يحوي الضمير `sich`. كان تجميع المستوى ووجود المسافة والضمير أدوات فرز فقط؛ لم يُطبق regex أو مولد صرف على البنك.

ومع الدفعات الثماني السابقة صار المجموع المحروس **698 بطاقة**: A0=4، A1=79، A2=109، B1=308، B2=198.

## ما صُحح

تغطي القرارات:

- ترتيب المكمل مع صيغة Perfekt في `sich kümmern um`, `sich unterhalten über`, `sich freuen auf`, `sich einigen auf`, `wirken auf`, `sich bewerben um`؛
- الأفعال الانعكاسية وموقع الضمير: `sich überprüfen`, `sich vertippen`, `sich beruhigen`, `sich schämen`, `sich einleben`, `sich ausbreiten`, `sich ummelden`؛
- الرؤوس ذات ضمائر المفعول: `jdn bloßstellen → stellt jdn bloß ...` و`jdm etwas vorwerfen → warf ... vor/hat ... vorgeworfen`؛
- الأفعال القوية والمساعد الصحيح: `an seine Grenzen stoßen → stieß/ist ... gestoßen`، و`sitzen bleiben → blieb/ist sitzen geblieben`، و`umsteigen auf → stieg/ist ... umgestiegen`، و`geradeaus fahren → fuhr/ist ... gefahren`؛
- Ersatzinfinitiv في `sich impfen lassen` و`sich scheiden lassen`؛
- الفعل الحامل في `stolz sein auf`، والانفصال والقوة في `ansehen als`، والتراكيب `betrachten als` و`halten für`؛
- صيغاً اشتقاقية صحيحة مثل `hat sich ausgebreitet`, `hat sich eingearbeitet`, `hat sich verschlechtert`, `hat sich qualifiziert`.

أبقت المراجعة 19 رأساً خارج fixture لأن صيغ الفعل الحامل كانت صحيحة بالفعل، ومنها `sich streiten`, `sich versöhnen`, `sich trennen`, `sich krankmelden`, `in den Ruhestand gehen`, `sich leisten können`, `sich an die Verkehrsregeln halten`, و`führen zu`. لم يُعد غياب المكمل من بعض الصيغ وحده سبباً للتغيير.

يحفظ `scripts/fixtures/vocab-posinfo-reviewed-09.json` لكل قرار المعرف والبنك والمستوى والرأس والقيمة السابقة والمصححة. تطبق الرقعة `scripts/patches/apply_vocab_posinfo_review_pa034_09.py` القرار فقط عند التطابق الكامل، وترفض انجراف النطاق، وهي قابلة للإعادة من دون تغيير جديد.

## الحراسة

- `npm run audit:vocab-posinfo` يحرس الآن 698/698 عبر تسعة fixtures ويمنع تكرار المعرفات أو انجراف البنك/المستوى/الرأس/الصيغة.
- K415a–c تحرس حجم الدفعة ومستواها وعدد الرؤوس متعددة الكلمات والانعكاسية والاستبعادات الـ19 وقرارات المكمل والقوة وErsatzinfinitiv والمساعد والفعل الحامل وحدود الرقعة والادعاء.
- يثبت فحص diff أن 49 بطاقة فقط تغيرت في `content/vocab.json` وأن الحقل الوحيد المتغير فيها هو `posInfo`، مع تطابق القيم السابقة والمصححة مع HEAD والـfixture 49/49.

## التحقق المحلي

- أعادت الرقعة `applied 49 corrections` ثم `applied 0 corrections; 49 already current`.
- نجحت بوابة التصريف 698/698، وTypeScript وESLint وsmoke ‏2471/2471 وinteraktiv ‏1027/1027.
- نجحت تدقيقات المحتوى والأنماط المعروفة والخطة والتبعيات والنزاهة المتأثرة، ونجح build الإنتاجي في 19/19 مساراً.
- تطابق البنك العام المشتق مع قرارات الدفعة 49/49.

## حدود الادعاء والمتبقي

هذه مراجعة داخلية محدودة وليست توقيعاً لغوياً خارجياً. من 1164 بطاقة تحمل `posInfo` صارت 698 محروسة، بينما تبقى **466 بطاقة غير مشمولة بالـfixtures**: منها 442 ذات ثلاث صيغ و24 ذات تنسيق آخر. تشمل البقية 29 رأساً متعدد الكلمات ذات ثلاث صيغ، لكن وجود المسافة لا يجعلها أخطاء. عدم الشمول لا يعني الخطأ، ونجاح البوابة لا يعتمد الحقول المتبقية ولا يثبت CEFR أو الجاهزية.
