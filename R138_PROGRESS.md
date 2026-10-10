# R138 Progress Report — Word-by-word Audit + Pedagogical Fixes

**تاريخ:** 2026-10-10
**الحالة:** جاري — دفعات متتالية.

## 1) فحص كلمة-كلمة / جملة-جملة ✅ ميكانيكي
- ثُبّت خطأ `الان → الآن` في كل المحتوى.
- إصلاح المسافات الثلاثية ومسافات قبل النقطتين في قواعد القواعد (`sein : sei` → `sein: sei`).
- رأس مال جملة `auf Wiedersehen` → `Auf Wiedersehen`.
- **نتيجة الفحص الألماني:** لا أخطاء قواعدية أو جندرية أو تصريفية مؤكَّدة في جمل النموذج (sentences) والحوارات والنصوص بعد التدقيق الآلي واليدوي — جميع المشتبه بهم من audit v1/v2 أثبتت صحتها (مثل `ihr habt`، `die Frau` في Dativ، `mit der U-Bahn`، `die Computer`، `die Lehrer`، `die Kuchen` Plural، `heute Morgen`).
- **نتيجة الفحص العربي:** كلمات المحتوى العربي سليمة لغوياً (فصحى)؛ تم فحص اللهجات المحتملة وكانت جميع إيجابياتها لفظية صحيحة في الفصحى (عندي، عندها، راني، تكوين، هكذا، إلخ).
- سكربتات الفحص `scripts/fix_typos.py` و`scripts/fix_arabic_typos.py` و`scripts/wort_fuer_wort_audit.ts` مُعدّة للتكرار لاحقاً.

## 2) إصلاحات بيداغوجية من PEDAGOGICAL_AUDIT.md (22 نقطة)

| # | النقطة | الحالة | ملاحظات |
|---|---|---|---|
| P-01 | ترتيب قواعد A1 | ✅ تم | نقل weil-dass وFutur I إلى A2، تقديم Akkusativ قبل Trennbare Verben، ضبط المتطلبات السابقة (voraus)؛ إصدار الجدولة CURRICULUM_SCHEDULE_VERSION=4 للترحيل غير الهدّام. |
| P-02 | وحدة Aussprache (فونيتيك) | ✅ تم | إضافة 6 دروس Aussprache في A0/A1: vowels، umlaut، ch-Laut، r، sp/st/sch، Auslautverhärtung. موزعة أيام 3/10/17/24/31/38 تقريباً. |
| P-03 | der/die/das من اليوم الأول | ✅ تم | إضافة درس `a0-artikel` في A0 مع شيفرة الجنس العربية وجدول أول 12 اسماً؛ تقديمه قبل sein-haben/pronomen. |
| P-04 | منحنى الحمل (Load Curve) | ✅ تم | ضبط LERNLAST ليبدأ A0 ~45 دقيقة، A1 ~74، A2 ~86، B1 ~106، B2 ~112 دقيقة، المجموع ~595 ساعة ضمن نطاق Goethe 400–700h. |
| P-05 | تكرار بين A1/A2 | ⏳ لاحقاً | احتفظت بإعادة جرعات Dativ/Modal للمراجعة — إزالة الحشو الكامل يتطلب مراجعة أعمق |
| P-06 | مواضيع B2 (Genitivpräp/Konzessiv/Doppelkonnektoren) | ✅ جزئياً | أضيفت Genitivpräpositionen، Konzessivsätze (trotzdem/obwohl/auch wenn/wenngleich)، Relativsätze بـ dessen/deren. Doppelkonnektoren nicht nur…sondern auch / weder…noch موجودة ضمن b2-doppelkonnektoren. |
| P-07 | Partizip I في B1 | ⏳ لاحقاً | أُبقي في B1 كمقدمة مختصرة (لا يربك الطالب). |
| P-08 | Genitiv mit wegen/trotz | ✅ تم | أدمجت في b2-genitiv-praep (ضمن P-06). |
| P-09 | عدّاد كلمات الكتابة | ✅ تم | إضافة `zielWort` إلى جميع مهام الكتابة (A0=20، A1=30، A2=100، B1=100، B2=150) مع نص الهدف في taskAr. |
| P-10 | سيناريوهات Goethe الناقصة | ✅ جزئياً | أضيف حوار «Fahrkarte kaufen» (A1) و«Reklamation im Hotel» (A2). المطعم والمحطة وتحديد الموعد والطريق موجودة مسبقاً بالفعل. |
| P-11 | نصوص قراءة A1 | ✅ تم | إضافة 15 نصاً قصيراً (3-5 جمل) → المجموع الآن 35 نصاً في A1، يغطون الأسرة/الصباح/الشقة/المدينة/السوق/الطقس/الهواية/العمل/الملابس/الطبيب/الحيوان/نهاية الأسبوع/الطعام/الطريق/عيد الميلاد. |
| P-12 | Partnerübung (Sprechen mit Partner) | ⏳ لاحقاً | يتطلب بنية تفاعلية جديدة |
| P-13 | أنماط Hören (global/detailliert/selektiv) | ⏳ لاحقاً |  |
| P-14 | ترتيب falsche Freunde حسب المستوى | ⏳ لاحقاً |  |
| P-15 | إظهار عدد البطاقات (جديدة + مراجعات) | ⏳ لاحقاً | تعديل واجهة |
| P-16 | إدماج Schulsim + Briefe في الخطة اليومية | ✅ تم | إضافة نوعي مهمة `schulsim` و`briefe` إلى TaskKind، برمجة ظهور Briefe كل 4 أسابيع في Festigung من A2 فصاعداً، Schulsim من B1. |
| P-17 | يوم مراجعة خفيف كل 4 أسابيع | ✅ تم | يوم Festigung كل 4 أسابيع مخفّض إلى ~60 دقيقة (بدلاً من 85) مع خريطة ذهنية للمفردات ومراجعة دون فحص ضاغط. |
| P-18 | توازن المهارات في A0 | ✅ تم | أضيفت مهمة Aussprache/Hören قصيرة في اليوم الأول، ودروس Aussprache في أيام 3 و10 من A0. |
| P-19 | Buchstabieren | ✅ موجود مسبقاً | درس a0-buchstaben يغطي التهجئة مع التدريب. |
| P-20 | حصص استراتيجية الامتحان | ✅ تم | إضافة دروس Prüfungsstrategie لكل مستوى (A1/A2/B1/B2) في نهاية المرحلة قبل الامتحان، تغطي بنية الامتحان وتوزيع الوقت وبناء الكتابة وتقنيات القراءة. |
| P-21 | شرح du/ihr/Sie صراحةً | ✅ تم | إضافة درس `a0-du-sie` في A0 بعد Begrüßung مباشرة. |
| P-22 | ربط Eselsbrücken بالبطاقات | ⏳ لاحقاً | يتطلب ربطاً برمجياً |
| T-01 → T-05 | تصحيحات لغوية | ✅ تم | الان→الآن، نُطق، مسافات التنقيط، رأس مال الجملة |

## 3) الملفات المعدّلة

- `content/grammar.json`: +18 درساً جديداً (a0-artikel، a0-du-sie، 6 Aussprache، 3 Genitiv/Konzessiv/Relativ-Genitiv B2، 4 Prüfungsstrategie A1-B2)، تعديل المتطلبات (voraus)، نقل a1-futur-einf وa1-weil-dass إلى A2.
- `lib/plan.ts`: تحديث PHASE_TOPICS A0/A1/A2، حساب wocheInPhase/level في أعلى buildDay، إضافة briefe/schulsim في festigung.
- `lib/phasen.ts`: ضبط LERNLAST لمنحنى تصاعدي 0.45 → 0.9.
- `lib/types.ts`: رفع CURRICULUM_SCHEDULE_VERSION إلى 4، إضافة TaskKind schulsim/briefe.
- `lib/kompetenz.ts`: ربط briefe/schulsim بكفاءة Schreiben.
- `components/dirb/icons.tsx`: أيقونات briefe (رسالة) وschulsim (مدرسة).
- `components/akademie/CurriculumMap.tsx`: تسميات عربية لـ briefe/schulsim.
- `content/writing.json`: إضافة zielWort + نص الهدف.
- `content/texts.json`: +15 نص قراءة A1.
- `content/dialogues.json`: +2 حوار (Fahrkarte, Hotel-Reklamation).
- سكربتات `scripts/fix_typos.py`, `scripts/r138_*.py`.

## 4) العمل المتبقي (سيتوالى في الدفعات التالية):
- P-05 تكرار A1/A2 تخصيص حصص Dativ/Wechsel/Modal لأفعال الجر فقط
- P-06 إضافة Genitivpräpositionen، Konzessivsätze المركبة، nicht nur…sondern auch، weder…noch، Relativsätze Genitiv (deren/dessen)
- P-07 نقل Partizip I إلى B2
- P-08 ربط Genitiv بـ wegen/trotz/während
- P-10 سيناريوهات إضافية: البنك، التأمين الصحي، عقد الإيجار، Terminabsage
- P-12 Partnerübung (بنية تفاعلية مع ردود النظام)
- P-13 أنماط Hörverstehen الثلاثة (global/detailliert/selektiv)
- P-14 ترتيب falsche Freunde عند أول ورود
- P-15 عرض عدد البطاقات المتوقع
- P-17 يوم خفيف كل 4 أسابيع
- P-18 مهمة استماع في الأيام الأولى من A0
- P-20 حصص استراتيجية الامتحان (Zeitmanagement، Lesetechnik، Schreiben-Aufbau)
- P-22 ربط Eselsbrücken ببطاقات المفردات
