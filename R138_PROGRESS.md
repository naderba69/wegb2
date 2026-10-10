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
| P-10 | سيناريوهات Goethe الناقصة | ⚠️ جزئي | أضيف Fahrkarte (A1)، Reklamation Hotel (A2)، Terminabsage (A2)، Krankenversicherung (A2). لا يزال ناقصاً: **Bank/Konto-Eröffnung، Mietvertrag**. |
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
- يمرّ `npx next build` (13 صفحة static + وراءات مشتركة) بنجاح.
- كل دفعة R138m-n-o-p-q مرفوعة إلى `origin/arena/d30141a7-wegb2`.

## 4) بنود اختيارية لدفعات لاحقة
- P-10 المتبقي: حوارات Bank/Konto-Eröffnung وMietvertrag (A2/B1).
- تحقّق بصري لمكوّنات `briefe`/`schulsim`/`partner` (تذهب إلى PartnerTask/الـfallback الحالي — تعمل وظيفياً).
- جعل click على chips الخاصة بـEselsbrücken في بطاقات المفردات يفتح الشفرة كاملة (حالياً مجرد إشارة).
