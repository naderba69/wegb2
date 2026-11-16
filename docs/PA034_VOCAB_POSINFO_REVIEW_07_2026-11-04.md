# PA-034 — مراجعة تصريفات المفردات، الدفعة 07

**التاريخ:** 2026-11-04

## النطاق

راجعت هذه الدفعة داخلياً بنداً بنداً 62 بطاقة إضافية بعد قراءة الرأس والمثال والقيمة الحالية. أُعطيت الأولوية للرؤوس المركبة والانعكاسية في A1/A2 لأن المولد القديم كان يصرف أول كلمة أو الصفة/الظرف بدلاً من الفعل الحامل. استُعمل وجود المسافة وشكل السلسلة للفرز فقط؛ لم يُطبق regex أو مولد صرف على البنك.

التوزيع: A1=13، A2=47، B1=1، B2=1. تضم الدفعة 60 رأساً مركباً، منها 22 انعكاسياً، ورأسين مفردين غير منفصلين. ومع الدفعات الست السابقة صار المجموع المحروس **562 بطاقة**: A0=4، A1=79، A2=109، B1=221، B2=149.

## ما صُحح

تغطي القرارات:

- رؤوساً كان المولد يصرف فيها الظرف أو الاسم: `laut lesen → liest laut, las laut, hat laut gelesen`، و`Angst haben → hat Angst, hatte Angst, hat Angst gehabt`، و`Widerspruch einlegen → legt Widerspruch ein ...`، و`Korrektur lesen → liest Korrektur ...`؛
- أفعالاً انعكاسية سقط منها الضمير أو انحرف ترتيب المكمل: `sich bewerben`, `sich entscheiden`, `sich vorbereiten auf`, `sich erinnern an`, `sich Sorgen machen`, `sich verlaufen`؛
- أفعالاً ناقصة و`lassen` مع Ersatzinfinitiv: `absagen müssen → hat absagen müssen`، و`kochen lassen → hat kochen lassen`، و`abtropfen lassen → hat abtropfen lassen`؛
- أفعالاً قوية داخل تركيب: `langsamer sprechen → sprach ... gesprochen`، و`bitten um → bat ... gebeten`، و`einladen zu → lud ... eingeladen`، و`abhängen von → hing ... abgehangen`؛
- عدم الفصل بحسب المعنى والنبر في `umarmen → umarmte, hat umarmt` و`unterstützen → unterstützte, hat unterstützt`؛
- تراكيب حالة وحركة: `pünktlich sein`, `zuständig sein für`, `zufrieden sein mit`, `spazieren gehen`, `satt werden`, `ausziehen aus`.

لم تُغيّر ثلاثة رؤوس مركبة كانت صيغ فعلها الحامل صحيحة بالفعل (`suchen im Internet`, `danken für`, `kündigen zum Monatsende`) لمجرد أنها لا تكرر المكمل في `posInfo`. وبقيت `möchten` خارج الدفعة لأن تمثيلها التعليمي لا يلائم آلياً نموذج Präsens/Präteritum/Perfekt المعتاد ويحتاج قراراً مستقلاً، لا تخميناً من المولد.

يحفظ `scripts/fixtures/vocab-posinfo-reviewed-07.json` لكل قرار المعرف والبنك والمستوى والرأس والقيمة السابقة والمصححة. تطبق الرقعة `scripts/patches/apply_vocab_posinfo_review_pa034_07.py` القرار فقط عند التطابق الكامل، وترفض انجراف النطاق، وهي قابلة للإعادة من دون تغيير جديد.

## الحراسة

- `npm run audit:vocab-posinfo` يحرس الآن 562/562 عبر سبعة fixtures ويمنع تكرار المعرفات أو انجراف البنك/المستوى/الرأس/الصيغة.
- K413a–c تحرس حجم الدفعة وتوزيعها وعدد الرؤوس المركبة/الانعكاسية وقرارات Ersatzinfinitiv والقوة والانفصال وحدود الرقعة والادعاء.
- بقيت مؤشرات المسافة وشكل السلسلة أدوات فرز فقط؛ fixture المحرر هو سجل القرار.

## التحقق المحلي

- أعادت الرقعة `applied 62 corrections` ثم `applied 0 corrections; 62 already current`.
- نجحت بوابة التصريف 562/562، وTypeScript وESLint وsmoke ‏2465/2465 وinteraktiv ‏1027/1027.
- نجحت تدقيقات المحتوى والأنماط المعروفة والخطة والتبعيات والنزاهة المتأثرة، ونجح build الإنتاجي في 19/19 مساراً.
- أثبت فحص diff أن 62 بطاقة فقط تغيرت في `content/vocab.json` وأن الحقل الوحيد المتغير فيها هو `posInfo`، وتطابقت القيم السابقة والمصححة مع HEAD والـfixture 62/62.

## حدود الادعاء والمتبقي

هذه مراجعة داخلية محدودة وليست توقيعاً لغوياً خارجياً. من 1164 بطاقة تحمل `posInfo` صارت 562 محروسة، بينما تبقى **602 بطاقة غير مشمولة بالـfixtures**: منها 578 ذات ثلاث صيغ و24 ذات تنسيق آخر. عدم شمولها لا يعني أنها خاطئة، ونجاح البوابة لا يعتمدها ولا يثبت CEFR أو الجاهزية.
