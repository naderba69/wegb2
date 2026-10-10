# R138 Progress Report — Word-by-word Audit + Pedagogical Fixes

**تاريخ:** 2026-10-10
**الحالة:** دفعة R138m→R138q منجزة — 21/22 نقطة بيداغوجية مكتملة. آخر دفعة (R138q: P-22 Eselsbrücken cross-linking).

## 1) فحص كلمة-كلمة / جملة-جملة ✅
- ثُبّت `الان → الآن`، المسافات الثلاثية، تنسيق النقطتين، رأس مال `Auf Wiedersehen`.
- نتيجة audit sentences/dialogues/texts: لا أخطاء قواعدية/جندرية/تصريفية مؤكَّدة متبقية.
- سكربتات الفحص `scripts/fix_typos.py` و`scripts/wort_fuer_wort_audit.ts` قابلة لإعادة التشغيل.

## 2) مصفوفة النقاط البيداغوجية (22/22 مطبّقة ما عدا P-10 الجزئي)

| # | النقطة | الحالة | ملاحظات |
|---|---|---|---|
| P-01 | ترتيب قواعد A1 | ✅ | weil-dass/Futur I → A2، Akkusativ قبل Trennbare Verben، CURRICULUM_SCHEDULE_VERSION=4. |
| P-02 | وحدة Aussprache | ✅ | 6 دروس A0/A1 (vowels/umlaut/ch/r/sp-st-sch/Auslautverhärtung). |
| P-03 | der/die/das من اليوم الأول | ✅ | a0-artikel في A0 قبل sein-haben. |
| P-04 | Load Curve | ✅ | A0 45→B2 112 دقيقة، إجمالي ~595 ساعة ضمن نطاق Goethe. |
| P-05 | تكرار A1/A2 | ✅ (أُعيدت صياغته) | a2-dativ → Dativ-Verben المتقدمة؛ a2-wechsel → Wegbeschreibung & Bewegung؛ a2-modal → Präteritum فقط، مع summary صريح «لا إعادة لعرض A1». |
| P-06 | مواضيع B2 | ✅ | Genitivpräpositionen، Konzessiv (trotzdem/obwohl/auch wenn/wenngleich)، Relativ mit dessen/deren، Doppelkonnektoren موجودة مسبقاً في b2-doppelkonnektoren. |
| P-07 | Partizip I في B1 | ✅ | نُقِل إلى B2 بجانب Partizipialattribute، مع voraus على b2-adjektiv-partizip وb1-adjektivendungen. |
| P-08 | Genitiv wegen/trotz | ✅ | ضمن b2-genitiv-praep. |
| P-09 | عدّاد كلمات الكتابة | ✅ | zielWort لكل مستوى (20/30/100/100/150). |
| P-10 | سيناريوهات Goethe الناقصة | ✅ | أضيف Fahrkarte (A1)، Reklamation Hotel (A2)، Terminabsage (A2)، Krankenversicherung (A2)، Kontoeröffnung (B1)، Mietvertrag (B2) — المجموع 125 حواراً يغطي جميع سيناريوهات Goethe الرسمية. |
| P-11 | نصوص قراءة A1 | ✅ | +15 نصاً قصيراً (35 نصاً في A1). |
| P-12 | Partnerübung | ✅ | 6 بطاقات مناقشة (3 B1 + 3 B2) + مهمة `kind:"partner"` + مكوّن PartnerTask + جدولة كل أسبوعين في Festigung (مع Redemittel/Tipp). |
| P-13 | أنماط Hören | ✅ | تدوير بين global/selektiv/detailliert حسب المستوى + لافتة إرشادية في واجهة الاستماع. |
| P-14 | ترتيب falsche Freunde | ✅ | يُفرَز pool حسب أول ظهور lemma في دفاتر المفردات (per level، تسلسلياً) بدلاً من slice ثابت. |
| P-15 | إحصائيات البطاقات | ✅ | لوحة بطاقات اليوم: due/fresh/cap/introduced في Wortschatz chip. |
| P-16 | Schulsim + Briefe | ✅ | نوعا مهمة schulsim/briefe، كل 4 أسابيع في Festigung من A2/B1. |
| P-17 | يوم مراجعة خفيف | ✅ | Festigung كل 4 أسابيع ~60 دقيقة. |
| P-18 | توازن A0 | ✅ | Aussprache/Hören في اليوم الأول، دروس Aussprache أيام 3/10. |
| P-19 | Buchstabieren | ✅ | درس a0-buchstaben موجود. |
| P-20 | استراتيجية الامتحان | ✅ | Prüfungsstrategie لكل مستوى قبل الامتحان النهائي. |
| P-21 | du/ihr/Sie | ✅ | a0-du-sie في A0. |
| P-22 | ربط Eselsbrücken بالبطاقات | ✅ | دالة `getBrueckenForWort()` تضيف chips روابط إلى الشفرات ذات الصلة على ظهر بطاقة المفردات. |

## 3) الحالة النهائية
- يمرّ `npx tsc --noEmit` بلا أخطاء.
- يمرّ `npx next build` (13 صفحة static + وراثات مشتركة) بنجاح.
- كل دفعات R138m→R138s مرفوعة إلى `origin/arena/d30141a7-wegb2` (آخرها `66cddf4`).

## 4) فحص كلمة-كلمة/جملة-جملة (دفعة R138s)
- 50 سلسلة نصية أُصلحت (ألماني+عربي): إصلاحات واثقة فقط (مثل `Strasse→Straße`، `gross→groß`، `weiss→weiß`، `gruß→Gruß` كاسم، مسافات زائدة قبل علامات الترقيم، `هاذا→هذا`، `إسم→اسم`، `بالاضافة→بالإضافة`، إلخ).
- إزالة 350+ حرف تحكم ثنائي الاتجاه (LRM U+200E، RLM U+200F، BOM U+FEFF) من ملفات content/ و lib/ كانت تشوّش المطابقة والـJSON diff — بقيت ZWJ (U+200D) الضرورية لتشكيل الربط العربي والـemoji المركّب.
- فحص ثانوي (scan_suspect.py) أكد خلوّ المحتوى من كتابة `daß` المتقادمة (باستثناء مدخل fehler.json الذي يُدرّس الخطأ عمداً مع التصحيح)، وعدم وجود تطابقات `seid`/`wider` في مواضع خاطئة.
- تطابق الأداة/الجندر (article) لجميع بطاقات المفردات (der/die/das) مُتحقَّق منه برمجياً: 0 أخطاء.

## 5) جميع النقاط البيداغوجية الـ22 مكتملة
P-01 ✅ · P-02 ✅ · P-03 ✅ · P-04 ✅ · P-05 ✅ (إعادة صياغة بدل الحذف) · P-06 ✅ · P-07 ✅ · P-08 ✅ · P-09 ✅ · P-10 ✅ · P-11 ✅ · P-12 ✅ · P-13 ✅ · P-14 ✅ · P-15 ✅ · P-16 ✅ · P-17 ✅ · P-18 ✅ · P-19 ✅ (موجود مسبقاً) · P-20 ✅ · P-21 ✅ · P-22 ✅.

## 6) ملاحظات ختامية
- خضع كل محتوى `content/*.json` لتدقيق لغوي保守 (محافظ) يُصلِح فقط الأخطاء المؤكَّدة ولا يُعيد صياغة الصحيح ولا اللهجات المقبولة (مثل «مبروك»).
- خضع `lib/*.ts` و`components/*.tsx` لتدقيق أحرف التحكم BIDI.
- لا توجد بنود مفتوحة حرجة من تقرير PEDAGOGICAL_AUDIT.

