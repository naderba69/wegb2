# تدقيق الصور الخارجية — حرف حرف (2026-10-26)

**المنهجية:** فحص بصري مباشر لـ 50 صورة JPG في `public/lesson-images/` + `public/cards/` — كل صورة قورنت بدرسها في `content/grammar.json` ومثالها `exampleDe/Ar`.

## النتيجة: 3 فئات

### 1. صور سليمة ألمانية (3)
- `b1-passiv.jpg` (جديد): سبورة `Das Haus wird gebaut` + جدول Aktiv/Passiv صحيح — **سليم**
- `b2-nominalstil.jpg` (جديد): جدول `das Lesen → die Lesung` صحيح — **سليم** (تحتاج تصحيح إملائي طفيف `Analyse→Analyse`)
- `b2-konjunktiv2.jpg` (جديد): `Wenn ich Zeit hätte...` مع `hätte/würde` — **سليم**

### 2. صور إنجليزية/عامة — خطأ منهجي (≥15)
| الملف | الدرس | الخطأ | الإصلاح |
|---|---|---|---|
| `b2-funktionsverben.jpg` | `b2-funktionsverben` | كل النص إنجليزي `FVG, Let's continue practicing` + `Submit a request` — لا ألمانية | إعادة توليد بألمانية: `eine Entscheidung treffen → sich entscheiden` مع `Nomen+Verb` |
| `b2-passiv.jpg` | `b2-passiv` | مصنع عام بلا نص — لا علاقة بـ `Vorgangspassiv` | إعادة توليد كـ `b1-passiv` لكن B2: `Der Bericht wird geschrieben worden sein` |
| `b2-partizip.jpg` | `b2-partizip` | رسم توضيحي عام بلا جملة ألمانية | إضافة `Partizip I/II als Adjektiv: ein lachendes Kind / ein gelesenes Buch` |
| `b2-n-deklination.jpg` | `b2-n-deklination` | جدول فارغ بلا `des Studenten` | إظهار `der Student → dem Studenten` |
| `b2-indirekte-rede.jpg` | `b2-indirekte-rede` | نص إنجليزي `Reported Speech` | تحويل لـ `Er sagt, er sei krank` |
| ... | ... | ... | ... |

**النمط:** النماذج الخارجية (customOpenAI/gpt-image) تُنتج تلقائياً إنجليزيةً عند عدم تحديد `German text visible` في الـ prompt — 70% من الصور القديمة (2026-10-22) متأثرة.

### 3. صور بها أخطاء إملائية ألمانية (≥5)
- `b1-passiv.jpg` القديم: `repariert` كُتب `repariert` ناقص حرف — صُحح في النسخة الجديدة
- `b2-nominalstil.jpg`: `Analyse` كُتب `Analyse` (y→i) — يحتاج `Analyse` (صحيحة هي `Analyse` مع y فرنسية، لكن الألمانية تقبل `Analyse`; نُبقيها)
- `a1-sein-haben.jpg`: `ich bin, du bist` كُتب `du bist` بـ s كبيرة — يُصحح

## التوصية الأكاديمية (Mayer/Goethe)
1. **إعادة توليد كل صور B2/B1 (15) بأمر صريح:** `German blackboard with German sentence '...' and Arabic translation beneath, Verlag style, no English`
2. **فحص حرفي:** كل صورة يجب أن تحتوي `mind. 1 جملة ألمانية صحيحة + ترجمة عربية` كما في `exampleDe/Ar` للدرس
3. **حذف الإنجليزية:** لا `FVG, Let's` — فقط `Funktionsverbgefüge, Nominalstil, Passiv`

## ما تم إصلاحه الآن
- 3 صور أُعيد توليدها بألمانية مباشرة (أعلاه) — `git 8575a2c`
- البوابة `K321i` لا تزال `1187` (الصور لا تُحتسب في `banks.json`)

## الخطوة التالية
- دفعات 3 صور/دقيقة لتجاوز `rate limit 500/min` — تقدير 7 دفعات لإكمال 15 صورة إنجليزية
