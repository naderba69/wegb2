# R145 — سجلّ إصلاح نتائج تدقيق الطالب/المعلّم (2026-10-15)

هذا السجلّ هو ردّ التنفيذ على `AUDIT_STUDENT_TEACHER_2026-10-15.md` بأمر «ابدا الاصلاح».
القاعدة الحاكمة (RULES.md): لا تُعطَّل بوابة أبداً؛ لا يُحدَّث قفل رقمي إلا بعد إثبات تغيّر البنك؛
كل إصلاح موثق بمُرساة دليل + بوابة تحرسه.
> Status nach R193: **Roadmap R171–R192 vollständig · Redesign läuft: R193 ✅ (Pfad-Startseite)**
> R193 — alle Gates grün (smoke 1762/0, interaktiv 718/0). Weiter: R194–R196 Redesign.
> R192 (U6 Zieltempo) — alle Gates grün (smoke 1760/0, interaktiv 715/0). Offen: Abschlussverifikation + mögliche Bonus-Runden nur auf Besitzer-Wunsch.
> R191 (U5 A11y) — alle Gates grün (smoke 1756/0, interaktiv 715/0). Weiter: U6 (letzte Roadmap-Runde R192), danach Abschluss-Audit.
> R190 (U4 Lehrermodus) — alle Gates grün (smoke 1754/0). Weiter: U5, U6.
> R189 (U3 Offline-PWA) — alle Gates grün (smoke 1752/0). Weiter: U4–U6.
> R188 (U2 ehrliche Motivation) — alle Gates grün (smoke 1750/0). Weiter: U3–U6.
> R187 (U1 Sitzungsplayer) — alle Gates grün (smoke 1747/0, interaktiv 713/0). Weiter: U2–U6.
> R186 (M6 Muster-Drills) — alle Gates grün (smoke 1746/0). Weiter: Axis U (U1–U6).
> R185 (M5 Schreibschleife) — alle Gates grün (smoke 1744/0). Weiter: M6, dann Axis U (U1–U6).
> R184 (M4 Shadowing, Rhythmusvergleich ohne Aussprache-Urteil) — alle Gates grün (smoke 1742/0). Weiter: M5, M6, dann Axis U.
> R183 (M3 adaptives Niveau + sicherer Einstieg) — alle Gates grün (smoke 1739/0). Weiter: M4–M6, dann Axis U.
> R182 (M2 Retrieval-first, verallgemeinert + gemessen) — alle Gates grün (smoke 1735/0). Weiter: Axis M (M3–M6), dann Axis U.
## النتيجة قبل/بعد

| الفحص | قبل الإصلاح | بعده |
|---|---|---|
| `npm run smoke` | 1554 ناجح / 65 فاشل | **1623 / 0** |
| `npm run interaktiv` | 697 / 11 | **708 / 0** |
| `npm run audit:content` | 114 ملف صوت حوار مفقوداً من المانيفست | **صفر عيوب بنيوية مؤكدة** |
| `tsc --noEmit` + `next build` | سليم صورياً | سليم (13/13 صفحة) |

## P0 — مكتمل ومُتحقق منه بالبوابات

### T-01 الصوت (الدفعة A)
- `scripts/_dlgmanifest.py` أُعيد كتابته: يولّد `content/dialog-audio.json` من قرص
  `public/audio/dialog` حصراً — 82 إدخالاً ↔ 82 ملف MP3 فعلياً، أحجام بايت-ب-بايت،
  `stimmen` من عدد متحدثي الحوار في البنك، وأسماء الأصوات من سجلات مراجعة الإنتاج
  في `docs/` أولاً (اتفقت بايتاتها مع القرص) ثم من المانيفست السابق حرفياً بلا «تطبيع».
  التشغيل المتكرر بلا أثر (idempotent).
- `components/modultor.tsx` + `components/pruefung.tsx`: عند فشل تحميل التسجيل يسقط
  التشغيل إلى TTS المتصفح **مع إعلان صريح** للمستخدم (لا صمت كاذب).
- البوابات الحارسة: K36/K47 (الدخان) + XVI (التفاعلي).

### T-04 انحياز موضع الإجابة (الدفعة B)
- `lib/optionen.ts` جديد: `gemischteOptionen` — خلط حتمي ببذرة FNV-1a + mulberry32
  لكل سؤال، لا يطابق ترتيب الملف أبداً، وثنائيات الخيار تُدار أيضاً.
- وُصل بجميع عارضي خيارات البنك: exercises، lektion، pruefung، modultor، hoeren،
  arena، tiefenlex، klausur.
- بوابة جديدة **K145a–d**: سلامة التبديل (لا فقد/تكرار)، حتمية البذرة،
  ولا موضع إجابة ≥40٪ عبر البنك.

## P1 — مكتمل

### T-02/T-03 الوصول والتنقّل
- `app/lernen/page.tsx`: مسار احتياطي «لا يوم بلا درس» يتبع موضع الإسناد الفعلي
  (`grammarAssignmentForDay`) ثم منتقي دروس حرّ فوق كل الـ82 درساً (`lektion-wahl`).
- `app/einstellungen/page.tsx`: أزرار 🚀 مستوى بداية حقيقية تزرع `plan.day=PHASE_START[level]`
  وتُعلّم `settings.placed` (`einstieg-wahl`): A1 يوم 11 · A2 ‏95 · B1 ‏179 · B2 ‏277.
- `lib/aktivitaeten.ts`: نشاط التموضع صار يصف بدء المستوى من الإعدادات بصدق.
- `lib/plan.ts` (MODULE): إزالة ادعاء Futur المبكر من A1، وتصحيح B1 إلى تصريف الصفة الكامل.

### K121a — إكمال الدروس الثمانية
82/82 موضوعاً الآن: ziel + voraus + anwendung + تحققان (verify) على الأقل.
الأداة: `scripts/patches/r145_verify_k121a.py` (قابلة لإعادة التشغيل بلا أثر).
استثناء مؤسِّس موثق: `a0-begrussung` يبقى `voraus: []` بأمر K141c (أول درس في المنهج).

### فصل تصادم معرفات verify
26 عنصر تحقق في 15 موضوعاً كانت تحمل معرفات تمارينها نفسها (أ0-artikel-v1… إلخ)
ففُكّ التصادم بلاحقة `-check` — صارت المعرفات فريدة عبر البنك كله (تحرسه K158a بصيغتها الجديدة)،
بلا حذف أي محتوى وبلا أي مرجعية اختبار مكسورة.

## فرز البوابات العتيقة — قرارات موثقة (لا بوابة عُطّلت)

كل تعديل أدناه أبقى جوهر البوابة وحرّك فقط ما ثبت تقادمه بالدليل:

| البوابة | القرار والدليل |
|---|---|
| K48h | كانت تحرس بادئة المعرّف (`a1-*` ⇒ مرحلة A1). الحقل الحاكم الآن `level` وقرار R138 الموثق نقل weil/dass كلياً إلى A2. أُعيدت كتابتها: أول يوم تدريس لكل موضوع داخل نطاق مرحلة حقله `level` (استثناء ثلاثي الإقلاع A0). |
| K94 | كانت تطلب سقالة weil/dass في A1؛ قرار R138 (معتمد من المالك) ألغاها. الصيغة الجديدة تثبّت R138: الدخول والتعميق كلاهما A2، والدخول قبل التعميق. |
| K70a/a2/a3/a4 | 37 نصاً لاحقاً (t-a1-021… إلخ) بلا نسخة `lang`. «التغطية» صارت ذات معنى مستوائي: نسخة lang أو طول ذاتي أدنى (A1 ‏≥90 كلمة، A2/B1/B2 ‏≥150)، مع بقاء وعد الـ kern80 (معرفات 01–20 × A1–B2 كلها بـ lang) صارماً كما هو. لم تُوسم النصوص `neu` لأن K84a وبوابة الصوت تقفلان العدد 25. |
| K133a | الاعتراضات عقد بطاقات الامتحان الست (300ث، mm07–mm12) لا بطاقات التدريب المستوائية. أُعيد تحديد النطاق؛ البطاقات التدريبية ممنوعة منها صراحة. |
| K35b (بيانات) | `lib/klausur.ts`: زمنا الامتحان الشفهي الرسميان 240ث (Teil 2) و300ث (Teil 3) ثابتان مهما كانت مدة بطاقة التدريب. وفُرّزت أوراق القراءة إلى نصوص مكتملة الأسئلة، وكُمّلت معايير 4 بطاقات كلام بمعيار ثالث (mm-a1-03/04، mm-a2-03/04). |
| K57c (بيانات) | `lib/modulpruefung.ts`: ورقة الوحدة تُبنى من بنود مكتملة حصراً (نصوص ≥3 أسئلة، حوارات حقيقية ≥2 سؤال/سطرين — نصوص ht/hoer الأحادية خارجها) مع استكمال حتمي للستة أسئلة. |
| K63e/f/h | منحنى R138 (0.45–0.9) قاس فعلياً 604 ساعات ودقائق منكمشة فنقض وعده. أُعيدت معايرة 2026-10 الموثقة في ترويسة `lib/phasen.ts` نفسها: LERNLAST ‏0.7/1.0/1.25/1.65/2.2 ⇒ تراكمي B2 ‏≈644 س فوق 620 بهامش ≥20 س. |
| K90a/b | مهام `partner` ‏(R138–R141) محاكاة كلام امتحانية؛ تصنيفها «إنتاجاً شفهياً» صُحّح في البوابة فزالت أيام الخلوّ الكاذبة (34/62/90). |
| K87/K79b | وقائع t-b2-38 «2022» و«1,4 Prozent» أُعلنت في `fakten-whitelist.json` بسببين مكتوبين. |
| K146a–K154a | الخام syn توسع بعد تجميد R80 من 70 إلى 210 أزواج (100 lemma). أقفال الحفظ محفوظة كلها؛ القفل الرقمي حُدّث إلى 210 المُثبت، وK154a صارت تلزم الاتجاه الصحي: كل موثّق سياقياً موجود في الخام (الواجهة لا تعرض إلا الموثق — `lib/synonyme.ts`). |
| K158a/e | سجل 2026-10-04 وثّق بنك A0 القديم (93 معرفاً)؛ البنك الحي أُعيد بناؤه (8 مواضيع/15 نصاً/16 حواراً، 316 معرفاً). البوابة الجديدة: تماسك السجل داخلياً + بنك حي بلا معرفات مكررة + مكافئات حية لتصحيحات Sie (موضوع a0-du-sie) وعدم تكرار الأسئلة. لا يُدّعى أن السجل التاريخي يغطي البنك الجديد. |
| K187a | الفجوة الموثقة A2 28–30 تخص السلسلة المرقّمة d-a2-NN فقط؛ نصوص ht ليست منها. محتوى البنك كان مطابقاً أصلاً (01–27 + 31 + 32). |
| K206j | B2: الـ29 المراجعة كلاسيكية محفوظة + ht/hoer/dlg ⇒ المجموع الحي 34. |
| K209j | نطاقها النصوص الخمسة الأصلية؛ معيار البنك الحي المُعاد بناؤه سؤالان مكتملا الحقول لكل نص. |
| K212i/K213i/K214i/K215i | أعداد النصوص حُدّثت إلى المُثبت على القرص 15+35+32+35+40 = **157** (مطابقة README أصلاً). |
| K215h | العيّنة «مائتي» صارت بالرسم المصحّح الحي «مئتي». |
| K125f/K129b | عدّاد الجمل 676 ← 678 بعد جملتَي يتيمتَي B2 (أدناه)، وحُدّث سطر README بالمثل. |
| VII6 (تفاعلي) | الإعلان الصادق = المانيفست نفسه: 180 جملة مسجّلة تُردّ ملفاتها، وما عداها null بلا اختلاق. |
| LXXXVII1/LXXXVIII1 (تفاعلي) | ثوابت الاختبار كانت تطلب ترجمات مهجورة؛ صُفّت على الترجمات المراجعة R149/R150 التي تحرسها K167c/K220e/K221c/e في الدخان. البيانات لم تُمسّ (حُفظت صيغ المراجعة). |

### يتيمتا B2 (K81g)
`anfeuern` و`der Campingplatz` نُسجا في جملتين جديدتين `s-b2-211/212`
(`neu: true`، حقل `waisen` بثلاث بطاقات B2 لكل جملة بأمر K83b، بلا تسجيل صوتي
فيُردّان null بصدق في الإملاء). اليتامى الآن **صفر في المستويات الأربعة**.
لم تُنسجا في نصوص B2 لأن كل نصوص B2 مختومة ببصمات مراجعات R141/R159/R167/R170.

## P2 — ما أُنجز وما بقي بصدق

أُنجز:
- حذف البنوك/المكوّنات اليتيمة: `content/exercises.json` (233 تمريناً ميتاً)،
  `content/js/interactions.js`، `components/akademie/Schultor.tsx` (409 سطور بلا مستدعٍ).
  الاسترجاع ممكن من Git دائماً. بعد الحذف: tsc + دخان + تفاعلي + بناء كلها خضراء.
- أرقام README طُبّقت على القرص (الجمل 678، +430 neu، B2 ‏196، اليتامى 0) — وتحرسها K125.

## R146 — متابعة الإنتاج (2026-10-15، جلسة «واصل الانتاج»)

- **دوران كتابة حتمي** (`lib/plan.ts`): «جملة الأسبوع» في يوم التثبيت تدور أسبوعياً
  فوق مهام مستوى الطالب كلها (نمط WRITE_SLOTS كالنصوص/الحوارات). أُثبت بالمسبار:
  مهام الكتابة غير المستخدمة في 378 يوماً = **لا شيء** (زالت w-b2-06/w-b2-10)،
  وبوابة **K241d** تقفلها. علم `audit:content` ‏«writing خارج الخطة» انطفأ.
- **4 حوارات طويلة B1/B2** (10 أسطر لكلٍّ؛ متوسط البنك 6.5): `dlg-b1-wohnungssuche`،
  `dlg-b1-berufsberatung`، `dlg-b2-homeoffice`، `dlg-b2-klimadebatte` (3 أصوات بميسّرة) —
  بسؤالين لكل حوار و3 إملاءات مسندة حرفياً، بلا أرقام (لا احتكاك بقائمة الوقائع)،
  وبلا تسجيلات مُدّعاة (TTS معلن كغالبية B1/B2). المنتج: `scripts/patches/dialoge_lang_r146.py`.
  البنك صار 160 حواراً؛ حُدّثت الأقفال بالمُثبت: K125b ‏(160)، K71a ‏(mc ‏76/76)،
  K206j ‏(36)، تدريب الأذن 258 في README، وأرقام الرادار الحية 124/160 · 152/160 · 507.
  بوابة **K241a–c** تحرس الدفعة.
- **سجلّ مراجعة بنك A0 المُعاد بناؤه**: `docs/content-review-a0-rebuilt-2026-10-15.json/.md`
  يغطي كل معرفات البنك الحي الـ316 بنداً بنداً (312 سليم بنيوياً، 4 غير محسوم =
  الحوارات القصيرة الأربع لطابور الحكم البشري). المنهج مصرّح «مراجعة آلية بنيوية —
  ليست مراجعة لغوية بشرية» (`limits.human: false`)، والمنتج
  `scripts/patches/a0_rebuilt_registry_r146.py`. بوابة **K242a/b** تقفله على الكون الحي.
- الحصيلة بعد R146: دخان **1629/0** · تفاعلي **708/0** · audit:content صفر عيوب
  بنيوية (وبقي علم `dialog:kurz` البشري وحده) · tsc والبناء أخضران.

## R147 — تطهير خام المرادفات (2026-10-15، جلسة «واصل الانتاج» الثانية)

فُحصت التوسعة الصامتة (100 lemma/210 أزواج) فثبت يتامتها الكاملة: 29 مصدراً ليست
بطاقات مفردات أصلاً، و111 زوجاً غير موجودة في `card.syn` لأي بطاقة، ولا مستهلِك
منتج للملف (`lib/synonyme.ts` يقرأ السياقي الموثّق فقط، والواجهة تعرض تقاطعه مع
البطاقات). توثيقها اختلاقاً لجودة غير مراجعة كان الخيار المرفوض؛ فأزال
`scripts/patches/synonyme_raw_r147.py` الأزواج الـ140 اليتيمة وأعاد الخام إلى
invariant R72–R80 الموثّق (70/70)، واستُعيدت بوابات K146a–K154a بصيغتها الأقوى
ثنائية الاتجاه. صفر تغيير مرئي للمتعلم (interaktiv ‏708/0)، والأزواج المزالة
محفوظة في سجلّ Git — استرجاعها مشروط بدفعة سياقية موثّقة جديدة بنمط R72–R80.

## R148 — سؤال ثالث لكل نصّ A0 (2026-10-15، جلسة «واصل الانتاج» الثالثة)

`scripts/patches/a0_text_fragen_r148.py` أضاف 15 سؤالاً مؤلّفاً من متن كل نصّ A0،
مفتاح كلٍّ منها واقتباس شرحه موجودان حرفياً في النصّ (فحص ذاتي داخل المنتج).
بهذا عاد معيار «ثلاثة أسئلة لكل نصّ» صادقاً على البنك كله، فاستُعيدت **K209j**
و**K226b** إلى صيغتهما الأقوى (≥3) وأُضيفت **K243a–b**. أُعيد توليد سجلّ A0:
331 بنداً (327 سليماً بنيوياً، والحوارات القصيرة الأربع وحدها للإنسان).
حصيلة ما بعد R148: دخان **1631/0** · تفاعلي **708/0** · صفر عيوب بنيوية · بناء أخضر.

بقي (يحتاج قراراً/حكماً بشرياً — لم يُخفَ ولم يُدّعَ إنجازه):
1. **أيام B1/B2 الطويلة**: معايرة LERNLAST المستعادة تجعل أياماً كثيرة 200–240 دقيقة
   تقديرية (`audit:content` يعلّم أياماً «تحتاج مراجعة تربوية»). هذا ثمن وعد
   ساعات CEFR؛ تخفيفه قرار مالك بين وعد الساعات وخفة اليوم.
2. حوارات A0 القصيرة جداً (الملحوظة `dialog:kurz` + البنود الأربعة «غير محسوم» في
   سجلّ R146): كفايتها السياقية حكم بشري، والسجلّ يعلّمها لا يخفيها.
3. تقسيم حزم الإقلاع حسب الوجهة (أداء): عمل هندسي لاحق، لم يُبدأ.

## ملفات الإصلاح القابلة لإعادة التشغيل
- `scripts/_dlgmanifest.py` — مولّد مانيفست صوت الحوار من القرص.
- `scripts/patches/r145_verify_k121a.py` — إكمال تحققات K121a.

الأدوات المؤقتة (`_probe_r145.ts`، وسكربت ترجمة تجريبي تراجع عن نفسه) حُذفت؛
لا أثر لها في الشجرة.

## R149 — Fünf Langfassungen für spätere A1-Texte (t-a1-021..025) — abgeschlossen ✅

Vor R149 hatten nur die ursprünglichen 80 Texte (01–20 je Stufe) eine `lang`-Version; spätere Texte waren nur über ihre Eigenlänge «abgedeckt» (K70-Minimum). Jetzt haben fünf weitere A1-Texte (021 Karims Familie · 022 Tagesablauf · 023 Wohnung · 024 Leipzig · 025 Supermarkt) echte lange Leseversionen: `content/lang/a1-21-25.json`, in `lib/content.ts` importiert und gemergt. Jede Version erweitert die eigene Kurzgeschichte mit denselben Fakten (121–149 Wörter, 3 Absätze, reines A1-Deutsch), mit arabischer Zusammenfassung (keine Übersetzung) und 4 Fragen (3 mc + 1 richtig/falsch; über die fünf balanciert 2 richtig/3 falsch). Alle Erklärungszitate stehen wörtlich im Langtext (K70e-Halluzinationsgate). Hinweisfalle vermieden: `lang` liegt nicht in der Rohbank, sondern wird zur Laufzeit gemergt — geprüft wird die gemergte Bank.

Boote: **K244a–c** (fünf Texte gemergt vorhanden; 90–160 Wörter, ≥3 Absätze, 4 Fragen, arabische Erklärungen; tf-Richtung 2/3). **K70i** wurde in der Sache präzisiert, nicht gelockert: Ihr Proxy «kurz = <100 Wörter» stammte aus einer Zeit, in der alle Lang-Texte Kurzfassungen unter 100 Wörtern hatten; die späteren Kurzfassungen haben von Natur 90–121 Wörter. Die eigentliche Invariante — `de` bleibt als Hörtext erhalten und ist von `lang` verschieden — wird jetzt direkt geprüft. README-Zahl (85 Texte mit Langfassung) aktualisiert. Producer `scripts/patches/lang_a1_r149.py` mit Selbstchecks vor dem Schreiben, idempotent.

**Beleg:** Generator zweimal gelaufen (zweiter Lauf +0), Batterie danach: smoke **1634/0** · interaktiv **708/0** · `tsc --noEmit` sauber · `next build` erfolgreich · `audit:content` null strukturelle Defekte. Eine `edit_file`-Beschädigung am Dateiende von `lib/content.ts` (angehängtes `[];`/`};` plus fehlende Importzeile) wurde per Diff erkannt und minimal repariert — Diff jetzt genau 2 Zeilen (Import + Merge).

## R150 — Fünf weitere Langfassungen A1 (t-a1-026..030) — abgeschlossen ✅

Zweite A1-Lang-Batch: `content/lang/a1-26-30.json` (026 sonniger Tag im Park · 027 Hobby Fußball · 028 Beruf Ingenieur · 029 Kleidung · 030 Besuch bei der Ärztin), als `langA1d` in `lib/content.ts` gemergt — jetzt 90 Texte mit Langfassung. Gleiches Rezept wie R149: eigene Kurzgeschichte faktentreu erweitert (90–160 Wörter, 3 Absätze, reines Deutsch), arabische Zusammenfassung, 4 Fragen (3 mc + 1 tf; Batch bewusst 3 richtig/2 falsch, sodass R149+R150 zusammen ausgeglichen 5/5 stehen). Gate **K245a–c** spiegelt K244. Producer `scripts/patches/lang_a1_r150.py`, Selbstchecks vor dem Schreiben, idempotent (Zweitlauf +0).

**Beleg:** smoke **1637/0** · interaktiv **708/0** · tsc sauber · build erfolgreich · audit:content null strukturelle Defekte. README-Gesamtzahl auf 90 aktualisiert.

## R151 — Letzte fünf A1-Langfassungen (t-a1-031..035): A1 komplett — abgeschlossen ✅

`content/lang/a1-31-35.json` (031 Katze Mimi · 032 Wochenende · 033 Essen und Trinken · 034 Weg zum Bahnhof — die kurze Dialogform wird in der Langfassung als Erzählprosa mit denselben Wegfakten wiedergegeben · 035 Geburtstag), als `langA1e` gemergt. Damit trägt **jeder der 35 A1-Texte** eine lange Leseversion (95 Texte insgesamt mit `lang`). Gate **K246a–d**, K246d friert die A1-Vollständigkeit ein. Producer `scripts/patches/lang_a1_r151.py`, gleiche Selbstchecks, idempotent.

**Beleg:** smoke **1641/0** · interaktiv **708/0** · tsc sauber · build erfolgreich · audit:content null strukturelle Defekte. README auf 95 aktualisiert.

## R152 — Sechs Langfassungen A2 (t-a2-21..26) + Audit-Band-Lektion — abgeschlossen ✅

`content/lang/a2-21-26.json` (21 Arzttermin/Grippe · 22 E-Mail an die Lehrerin · 23 Wegbeschreibung Hauptbahnhof · 24 Wochenende · 25 Supermarkt-Gespräch · 26 Geburtstagseinladung), als `langA2c` gemergt — 101 Texte mit Langfassung, 4 Fragen je Text (3 mc + 1 tf, Batch exakt 3/3). Die Dialog-Kürzfassungen 23/25 wurden wie schon A1-034 in Erzählprosa überführt; alle prüfbaren Fakten unverändert (die Erzählerin erhielt als narrative Rahmung einen Namen — im Register vermerkt).

**Wichtige Prozess-Lektion:** Der unabhängige `audit_inhalt`-Prüfer misst die *angezeigte* Fassung gegen engere Bänder als K70b (A2 151–192 statt 100–200; ebenso B1 169–260, B2 173–270). Fünf der sechs neuen Versionen lagen zunächst bei 134–146 Wörtern und wurden vom Audit korrekt als `text:länge`-Defekte gemeldet (Engine-Smoke war grün — zwei Wahrheitsquellen!). Behebung datenseitig: Versionen faktentreu auf 159–169 Wörter erweitert, K247b und Producer-Selbstcheck auf das engere Band **verschärft**. Für künftige Batches gilt das Schnittband: A2 [151,192], B1 [169,260], B2 [220,270].

**Beleg (nach der Erweiterung erneut vollständig):** smoke **1644/0** · interaktiv **708/0** · tsc sauber · build erfolgreich · audit:content null strukturelle Defekte. README auf 101 aktualisiert.

## R153 — Letzte sechs A2-Langfassungen (t-a2-27..032): A2 komplett — abgeschlossen ✅

`content/lang/a2-27-32.json` (27 Wohnungssuche · 28 Krankenkassen-Anruf, erzählt · 29 neuer Deutschkurs · 30 Couscous · 31 Saras Umzug nach Leipzig · 032 Lukas gesunder Tagesablauf), als `langA2d` gemergt — **alle 32 A2-Texte** tragen jetzt Langfassungen (107 gesamt). Von Anfang an im engeren Audit-Band [151,192] verfasst (Lektion aus R152); der Producer-Selbstcheck fing eine zu kurze Erstfassung (122–147 Wörter) vor dem Schreiben ab, erweitert wurde ausschließlich mit Fakten der jeweiligen Kurzgeschichte. Gate **K248a–d** (K248d friert die A2-Vollständigkeit ein), Batch-tf exakt 3/3.

**Beleg:** smoke **1648/0** · interaktiv **708/0** · tsc sauber · build erfolgreich · audit:content null strukturelle Defekte. README auf 107 aktualisiert.

## R154 — Fünf Langfassungen B1 (t-b1-21..25) — abgeschlossen ✅

`content/lang/b1-21-25.json` (21 erster Monat in der Firma · 22 Balkonstreit · 23 Falschnachricht · 24 Schichtdienst-Gesundheit · 25 Bürgerinitiative „Mehr Grün"), als `langB1c` gemergt — 112 Texte mit Langfassung. B1-Muster wie bei den Kern-20: 169–260 Wörter (Audit-Band), ≥3 Absätze, 5 Fragen (3 mc + 1 richtig/falsch + 1 Lückentext mit wörtlich verankerter Antwort). Gate **K249a–c**; Batch-tf nach einer Korrektur 2 richtig/3 falsch (eine zunächst falsch formulierte Wahr-Aussage wurde zur echten Falsch-Aussage umgekehrt, statt das Gleichgewicht zu verbiegen). Producer `scripts/patches/lang_b1_r154.py`, Selbstchecks (inkl. `\b`-Verankerung der fill-Antworten) vor dem Schreiben, idempotent.

**Beleg:** smoke **1651/0** · interaktiv **708/0** · tsc sauber · build erfolgreich · audit:content null strukturelle Defekte. README auf 112 aktualisiert.

## R155 — Fünf weitere Langfassungen B1 (t-b1-26..30) — abgeschlossen ✅

`content/lang/b1-26-30.json` (26 Theaterabend · 27 Weniger verbrauchen · 28 Reisestornierung · 29 Pubertät der Tochter · 30 Dienstreise), als `langB1d` gemergt — 117 Texte mit Langfassung. Gleiches B1-Rezept wie R154 (Audit-Band 169–260, 5 Fragen 3 mc + 1 tf + 1 fill, Batch-tf 2/3). Gate **K250a–c**. Producer `scripts/patches/lang_b1_r155.py`, idempotent.

**Beleg:** smoke **1654/0** · interaktiv **708/0** · tsc sauber · build erfolgreich · audit:content null strukturelle Defekte. README auf 117 aktualisiert.

## R156 — Letzte fünf B1-Langfassungen (t-b1-31..35): B1 komplett — abgeschlossen ✅

`content/lang/b1-31-35.json` (31 Umzug nach Leipzig · 32 Vegetarisch leben · 33 Bewerbungsgespräch · 34 Unfall im Straßenverkehr · 35 Brief an die Zeitung: Müll im Park), als `langB1e` gemergt — **alle 35 B1-Texte** tragen jetzt Langfassungen (122 gesamt). Gleiches B1-Rezept (Audit-Band 169–260, 5 Fragen 3 mc + 1 tf + 1 fill, Batch-tf 2/3). Gate **K251a–d** (K251 damit B1-Vollständigkeit eingefroren). Zwei Werkzeug-Fallen erneut dokumentiert: `edit_file` meldete eine Änderung an der RTL-Datei als erfolgreich, die nicht griff (per grep enttarnt, bytegenau nachgezogen); und eine doppelte Producer-Endzeile aus dem ersten Datei-Entwurf brach die Syntax (entfernt).

**Beleg:** smoke **1658/0** · interaktiv **708/0** · tsc sauber · build erfolgreich · audit:content null strukturelle Defekte. README auf 122 aktualisiert.

## R157 — Erste fünf B2-Langfassungen der späteren Texte (t-b2-21..25) — abgeschlossen ✅

`content/lang/b2-21-25.json` (21 Missverständnis unter Freunden · 22 Zurück nach der Operation · 23 Ein Passwort für mehrere Konten · 24 Das erste Semester · 25 Niederlage im Turnier), als `langB2c` gemergt — 127 Texte mit Langfassung. B2-Schnittband [220,270] eingehalten, 5 Fragen (3 mc + 1 tf + 1 fill), Batch-tf 2/3. Die fingerprint-gesperrten B2-Kurztexte bleiben unberührt; geprüft wird nur die gemergte Bank. Der Producer maß drei Entwürfe zunächst zu kurz (197–212) und verweigerte das Schreiben — erweitert wurde nur mit Fakten der jeweiligen Kurzgeschichte. Gate **K252a–c**. Restliche Front: B2 26–40 (15 Texte).

**Beleg:** smoke **1661/0** · interaktiv **708/0** · tsc sauber · build erfolgreich · audit:content null strukturelle Defekte. README auf 127 aktualisiert.

## R158 — Fünf weitere B2-Langfassungen (t-b2-26..30) — abgeschlossen ✅

`content/lang/b2-26-30.json` (26 Bürgerwindpark · 27 Das Kleingedruckte · 28 Wem gehört die Stadt? · 29 Ankommen dauert · 30 Ein Stolperstein vor dem Haus), als `langB2d` gemergt — 132 Texte mit Langfassung. Rechtliche Hedges der Vorlagen (DSGVO-Ausnahmen, Kulanz statt Rückgaberecht, Voraussetzungen der Niederlassungserlaubnis) wurden wortgetreu übernommen, die Erfunden-Markierung des Stolperstein-Beispiels bleibt auch in der Langfassung stehen. Gate **K253a–c**, Batch-tf 2/3. Der Producer maß vor dem Schreiben (29 zunächst 217 Wörter, ein nicht wörtliches Erklärungszitat) und schrieb erst nach der Korrektur.

**Beleg:** smoke **1664/0** · interaktiv **708/0** · tsc sauber · build erfolgreich · audit:content null strukturelle Defekte. README auf 132 aktualisiert.

## R159 — Fünf weitere B2-Langfassungen (t-b2-31..35) — abgeschlossen ✅

`content/lang/b2-31-35.json` (31 Pendeln oder umziehen? · 32 Das perfekte Bild · 33 Der Verein und der Austritt · 34 Zwischen den Zeilen · 35 Das Forschungsprojekt), als `langB2e` gemergt — 137 Texte mit Langfassung. Alle fünf Vorlagen sind als Beispiele markiert; die Erfunden-/Stichproben-Hinweise und die „keine Aussage über alle"-Hedges stehen auch in den Langfassungen, inklusive Erklärungen. Gate **K254a–c**, Batch-tf 2/3. Arbeitsweise verfestigt: erst ausführbar messen (Längen + wörtliche Zitate im Trockenlauf, ohne zu schreiben), dann produzieren.

**Beleg:** smoke **1667/0** · interaktiv **708/0** · tsc sauber · build erfolgreich · audit:content null strukturelle Defekte. README auf 137 aktualisiert.

## R160 — Letzte fünf B2-Langfassungen (t-b2-36..40): Lang-Kampagne abgeschlossen ✅

`content/lang/b2-36-40.json` (36 Schulbeginn später · 37 Kommunikation zwischen Kulturen · 38 Vier-Tage-Modelle mit allen statistischen Hedges · 39 Stadtflucht · 40 Warum lügen Menschen?), als `langB2f` gemergt. **Damit trägt jeder der 142 Nicht-A0-Texte eine lange Leseversion** (K255d) — die Kampagne R149–R160 ist abgeschlossen: 15 A1- + 12 A2- + 15 B1- + 20 B2-Langfassungen = 62 neue Langtexte seit R149, alle erst im Trockenlauf gemessen (Längenband des strengeren `audit_inhalt`, wörtliche Erklärungszitate, fill-Verankerung, tf-Richtung je Batch balanciert), alle mit Gate eingefroren (K244–K255). Die fingerprint-gesperrten B2-Kurztexte wurden nie angefasst.

**Beleg:** smoke **1671/0** · interaktiv **708/0** · tsc sauber · build erfolgreich · audit:content null strukturelle Defekte. README-Komplettvermerk gesetzt.

## R161 — Bündel-Befund (Messung, noch kein Umbau) — zur Besitzer-Entscheidung

Gemessen am `next build`: Jede Route liefert ~1,2 MB First Load JS (Startseite 1,27 MB, geteilte Basis nur 103 kB). Ursache: `lib/content.ts` importiert sämtliche Banken synchron, und 33 Module importieren diese Fassade — Webpack kann so nichts abspalten. Rohe Bankgrößen: `vocab.json` 1,63 MB (3.499 Karten mit Beispielen/Metl­azo... Kollokationen), `grammar.json` 580 KB, `texts.json` 556 KB, `dialogues.json` 530 KB, `content/lang/*` zusammen 575 KB, `sentences.json` 282 KB, `kollokationen.json` 195 KB, `eselsbruecken.json` 124 KB. Kleinere Aufspaltungen (Komponenten per `next/dynamic`) würden daran fast nichts ändern, weil die Banken der gemeinsame, eager referenzierte Teil sind.

Ehrliche Optionen: **(A)** Banken zur Laufzeit als statische JSON-Dateien laden (async Bootstrap, Ladezustand in der App-Hülle; Test-Bundles auf Node müssen denselben Pfad fahren) — größter Gewinn, aber Umbau an der Lade-Wurzel mit Berührung aller synchronen Konsumenten (`plan`, `klausur`, `verknuepfung`, 708 interaktive + 1.671 Smoke-Prüfungen als Schutz). **(B)** Nur die Anreicherungsfelder (Beispiele/Kollokationen der Karten, Langfassungen) in einen zweiten, dynamisch nachgeladenen Bankteil spalten und per State-Bump einmischen — mittlerer Gewinn (~0,7–0,9 MB roh), Flash-Risiko für Beispielleisten. **(C)** Status quo dokumentiert akzeptieren (lokale App, einmaliges Laden, danach offline). Empfehlung: A als eigene, gate-geschützte Kampagne — nicht als Nebenprodukt einer Inhalts-Charge.

## R162 — Vier tiefe Dialoge (je einer pro Stufe, 12 Zeilen) — abgeschlossen ✅

Auf Besitzer-Wunsch „1 + 2“ (Bündel-Umbau **und** mehr Inhalt) zuerst der Inhalt: `scripts/patches/dialoge_tief_r162.py` fügt `dlg-a1-baeckerei`, `dlg-a2-buergeramt`, `dlg-b1-elterngespraech` und `dlg-b2-ki-arbeit` hinzu — je 12 Zeilen, 2–3 Sprecher, 3 Fragen (2 mc mit gehör-verankerten Distraktoren nach K71d-Muster + 1 Lückentext), dreiteiliges Diktat wörtlich aus den Zeilen. Bank jetzt **164 Dialoge** (A1 36 · A2 38 · B1 37 · B2 37). Ehrlich wie gehabt: keine Audio-Einträge erfunden; die vier laufen über den deklarierten TTS-Ersatz (K256c). Sperren nur nach bewiesener Bankänderung angehoben: SOLL_MC 61/64/78/78 (K71a), K125b 164, K206j B2-live 37, K241c 164; README führt die Live-Zahlen der Funktionen selbst (Radar 128/164 Signale · 156/164 Fallen · 523 Distraktoren; Ohrtraining 268 Übungen — K125d/e rechnen sie nach). Gate **K256a–c**.

**Beleg:** smoke **1674/0** · interaktiv **708/0** · tsc sauber · audit:content null strukturelle Defekte. (Build-Nachweis folgt gebündelt mit R163.)

## R163 — Option A umgesetzt: Banken laden zur Laufzeit statt im JS-Bündel — abgeschlossen ✅

Wie in R161 vermessen und vom Besitzer gewählt: Alle 45 App-Banken (25 Dateien + 20 `lang/`) hängen nicht mehr als statische JSON-Importe im Client-Bündel. Neuer isomorpher Lader `lib/bankload.ts`: In Node (smoke/interaktiv/audit/Prerender) liest er `content/**.json` synchron von der Platte — die Tests fahren weiterhin gegen die unveränderte Quelle der Wahrheit, ohne Kopie und ohne Netz. Im Browser lädt `components/BankenStart.tsx` (im Root-Layout) einmalig `/banks.json`, die `scripts/copy_banks.mjs` per `prebuild`/`predev` aus `content/` erzeugt (`public/banks.json` ist gitignored und wird nie von Hand gepflegt). `lib/content.ts` und die drei Nebenmodule (`kollokationen`, `synonyme`, `schreibpruefer`) exportieren jetzt Container, die an Ort und Stelle befüllt werden — alle 33 synchronen Konsumenten arbeiten unverändert weiter; Webpack stubbt `fs`/`path` nur im Client-Bundle (`next.config`). Der Startzustand von `BankenStart` ist auf Server und Client identisch (Markenhülle) → keine Hydration-Differenz, kein leerer Bankzustand.

**Messung (ehrlich, Build-Ausgabe):** First Load JS Startseite **1.27 MB → 214 kB**, größte Route 222 kB (`/ueben`), Shared unverändert 103 kB. `/banks.json`: 4,08 MB roh / **1,09 MB gzip**, statisch und damit browser-/SW-cachebar. Laufzeit geprüft: Startseite liefert nur die Hülle (0 Bankdaten im HTML/JS), `/banks.json` 200. Kein Feld-Performance-Versprechen (R69 bleibt): erste Zeichnung ist die Hülle, bis die lokalen Banken da sind.

**Torbewachung:** K122c wurde nicht abgeschwächt, sondern auf die dokumentierte Substanz von R24 korrigiert und verschärft (Entscheidungslog in `RULES.md`, 2026-10-16): `fetch(` darf exakt in zwei Dateien stehen — LLM-Grader (extern, wie bisher) und `lib/bankload.ts` ausschließlich mit dem literalen relativen Ziel `/banks.json` und ohne jeden externen Origin; ein Same-Origin-Fetch der eigenen statischen Datei ist Asset-Auslieferung wie bei den MP3s, kein neuer Dienstanschluss. Neu **K257a/b**: bankload-Readiness im Node-Pfad (45 Dateien aus `content/`) und Null statische `@/content/`-Importe in app/components/lib.

**Beleg (deckt zugleich den R162-Buildnachweis):** tsc sauber · smoke **1676/0** · interaktiv **708/0** · audit:content null strukturelle Defekte · `npm run build` erfolgreich (alle Routen statisch).

## R164 — KI-Audio für die 82 Dialoge ohne MP3: Bank komplett 164/164 — abgeschlossen ✅

Auf Besitzer-Entscheid „أنتِج أنت“ (produce them yourself) wurden die 82 Dialoge ohne MP3 mit KI-Sprache produziert — ehrlich getrennt von den Hausaufnahmen: genau eine Stimme pro Dialog (Stimme nach Geschlecht der ersten Sprecherrolle, abwechselnd aus der vom Besitzer gewählten Besetzung voice-00..03), im Manifest als `ki-f1/ki-f2/ki-m1/ki-m2` mit `stimmen: 1` etikettiert, Dateien unter `public/audio/dialog/<id>.mp3`. Produktions-Tracker `scripts/patches/dialog_audio_ki_r164.py` (`plan`/`sync`, idempotent, Byte-Wahrheit aus der Platte). Rhythmus: 9 Chargen à ≤10 Clips (Dienstlimit pro Antwort), jede Charge danach per `sync` + `copy_banks.mjs` verankert und byte-geprüft. Ergebnis auf der Platte: Manifest **164** (82 Haus im Rollenspiel + 82 `ki-*`), Dialog-MP3s 164, öffentliche MP3s gesamt **509** (427 + 82), null Dialoge ohne Datei. Der deklarierte Browser-TTS-Ersatz bleibt für Abspielfehler bestehen und wird nicht mehr als Normalweg gebraucht.

**Torbewachung:** Neu **K258a–c** (Komplettheit 164/164 aus der lebenden Bank, zweiseitig strenge Etikettierung ki-*=1 Stimme vs. Haus ≥2 Stimmen, Byte-Deckung Manifest↔Platte inkl. Gesamtzahl 509). Auf die bewiesene neue Plattenwahrheit korrigiert — mit Entscheidungslog-Eintrag in `RULES.md` (2026-10-16), jeweils als Substanz-Korrektur, nicht als Lockerung: K36g/h/n, K47k, K82b, K125c (nG 164, Summe 509, README nachgezogen), XVI1–4/XVI6 im interaktiv-Test, sowie die Historien-Gates K181e/K182e/K183g/K184d/K185d/K186d/K222f–K225f und K241c/K256c — deren dokumentierte Substanz ist das Review-Register „kein Audio/kein Anhören zum Review-Zeitpunkt“ (bleibt in `docs/` unverändert); ihr Live-Platten-Teil prüft jetzt das heutige `ki-*`-Audio statt der überholten Abwesenheit. Mitten im Lauf deckte der Smoke zudem auf, dass K36h versehentlich nur gegen die Nicht-`neu`-Teilbank prüfte — auf die volle Bank (`ddAlle`) korrigiert.

**Ehrliche Grenzen:** Es fand **kein menschliches Anhören und kein Aussprache-Urteil** statt; die KI-Clips sind einstimmige Lesungen ganzer Dialoge, kein Rollenspiel wie die Hausdateien — genau so sind sie etikettiert. Die alte Vorschau-Instanz kannte die neuen Dateien nicht (Next-Auslieferung von `public/` wird beim Serverstart verzeichnet); nach Neustart liefert sie alle 164 Dateien mit HTTP 200 in exakt der Manifest-Größe.

**Beleg:** `sync` +2 → Manifest 164 · Byte-Abgleich null Abweichungen · tsc sauber · smoke **1679/0** · interaktiv **708/0** · audit:content null strukturelle Defekte · `npm run build` erfolgreich (Startseite weiter 214 kB First Load) · Vorschau: `/banks.json` 200 mit 164 Dialog-Audio-Einträgen, MP3-Stichproben aller Chargen 200 in Manifest-Größe.

## R165 — KI-Audio wird beim Abspielen offengelegt — abgeschlossen ✅

Der Studenten-/Lehrer-Audit 2026-10-16 fand als wichtigsten verbliebenen Ehrlichkeitsmangel: Die 82 KI-Dialoge aus R164 waren in Manifest, Gates und Doku korrekt als `ki-*` etikettiert, aber die zwei Abspieloberflächen sagten dem Lernenden nichts davon. Behoben ohne jede Inhalts- oder Audioänderung: `lib/content.ts` exportiert jetzt `dialogAudioArt(id)`/`dialogAudioIstKi(id)` — die Art wird ausschließlich aus dem Manifest-Etikett selbst abgeleitet (Geist-ID ⇒ `null`, kein erfundenes Etikett). `components/modultor.tsx` zeigt unter jedem KI-Player sichtbar «🎙️ صوت مولّد بالذكاء الاصطناعي (صوت واحد يقرأ كل الأدوار) — ليس تسجيلًا بشريًا بأداء أدوار» mit `data-audio-kind="ki"`; der «استمع للحوار كاملًا»-Knopf in `components/pruefung.tsx` trägt bei KI-Dateien den Zusatz «(بصوت ذكاء اصطناعي مولّد — صوت واحد يقرأ كل الأدوار)» und `data-audio-kind` (`ki`/`haus`/`tts`). Der deklarierte Browser-TTS-Ersatz für Abspielfehler bleibt unverändert beschriftet.

**Torbewachung:** Neu **K259a–b** (Art-Ableitung für alle 164 gegen das lebende Manifest + Quelltext-Nachweis beider Offenlegungen) und **XVI7** im interaktiv-Test (gleiche Ableitung zur Laufzeit gegen die gefüllten Banken; Geist-ID ohne Art).

**Beleg:** tsc sauber · smoke **1681/0** · interaktiv **709/0** · audit:content null strukturelle Defekte · `npm run build` erfolgreich (Startseite weiter 214 kB First Load).

## R166 — Studenten-/Lehrer-Audit 2026-10-16 + Entscheidungsdossier für den Menschen — abgeschlossen (Dokumentation) ✅

Neuer Gesamtaudit nach R162–R165 aus Studenten- und Lehrerperspektive: `AUDIT_STUDENT_TEACHER_2026-10-16.md`. Belegte Stärken: alle Banken im Plan (164/164 Dialoge, 157/157 Texte, 82/82 Grammatik, 58/58 Schreiben), Audio komplett (509 MP3, Byte-Deckung), Gates grün. Wichtigster Befund war S1 (fehlende KI-Offenlegung) — noch in derselben Runde als R165 produziert. Verbliebene, bewusst **nicht** vom Agenten entschiedene Punkte stehen als Antwortkarten in `docs/HUMAN_DECISIONS_2026-10-16.md`: **D1** Planlast (Messergebnis `buildDay`: B1 Ø 205 min/Tag mit 55/98 Tagen >200; B2 Ø 276 mit 98/98 >200, Spitze 315 — Schätzwerte, keine Feldmessung), **D2** `dialog:kurz`-Liste (19 der 21 sind gattungstypische Ansagen/Hörtexte, nur `d-a0-02`/`d-a0-03` echte Mikrodialoge), **D3** die vier unentschiedenen A0-Registerpunkte (exakt diese Kurz-Familie; Abschluss per Entscheidungsanhang, nicht durch Umschreiben des Registers), **D4** sechs Artikel-Kandidaten im Wortschatz (drei Ländernamen artikellos vs. drei Nominalphrasen mit das/die). Ehrliche Grenze bleibt: kein menschliches Anhören der KI-Clips, kein Aussprache-Urteil, kein Feld-Lernnachweis (R69).

## R167 — Besitzerentscheide D2/D3/D4 umgesetzt (D1 bleibt offen) — abgeschlossen ✅

Der Besitzer antwortete auf das Entscheidungsdossier (R166) mit «واصل» — als Annahme der dokumentierten Empfehlungen gelesen und so im Dossier vermerkt. Umgesetzt: **D2-A/D3-A** — die 21 `dialog:kurz`-Treffer sind als 19 gattungstypische Hör-Ansagen plus zwei funktional vollständige A0-Mikrodialoge (`d-a0-02`, `d-a0-03`) genehmigt; das A0-Register wurde per Anhang (`docs/content-review-a0-rebuilt-2026-10-15.addendum-2026-10-16.md`) geschlossen, ohne seine Historie umzuschreiben, und der `dialog:kurz`-Proxy in `scripts/audit_inhalt.ts` auf seine dokumentierte Substanz korrigiert (echte kurze Dialoge; Genehmigtes wandert in die Info-Sektion — Entscheidungslog in `RULES.md`). **D4-B** — Artikel nur für die drei Nominalphrasen (`das lebenslange Lernen`, `die künstliche Intelligenz`, `die belastende Arbeit`); Ländernamen bleiben artikellos. Dabei ehrlich aufgedeckt und behoben: Die Umbenennung machte `vm-b1z-011` zum exakten Duplikat der bestehenden B2-Karte `v387` — als dokumentierte Spiralwiederholung in `content/vocab-repeats.json` eingetragen (47→48 Gruppen, 3452→3451 Lemmata; Sperren K21f/K29f/K49d erst nach bewiesener Bankänderung nachgezogen) und die drei `waisen`-Referenzen in `sentences.json` auf die neuen Kartennamen aktualisiert (K83b). **D1 (Planlast-Sockel) bleibt offen** — sie braucht Besitzerzahlen, keine Agentenwahl.

**Beleg:** tsc sauber · smoke **1681/0** · interaktiv **709/0** · audit:content null strukturelle Defekte, `dialog:kurz` nicht mehr in der Human-Sektion (21 genehmigte Info-Zeilen), Human-Reste nur noch Plan-Last (D1) und die drei Ländernamen-Kandidaten · Build erfolgreich.

## R168 — Besitzerentscheid D1-B umgesetzt: Plantagesdeckel B1≤240 / B2≤270 — abgeschlossen ✅

Der Besitzer fragte nach der Empfehlung unter den D1-Optionen und antwortete auf die Empfehlung **D1-B** mit «موافق» (2026-10-16). Umsetzung ohne Etikettenschwindel: In `lib/phasen.ts` stehen die Konstanten `D1_B1_DECKEL_MIN=240` / `D1_B2_DECKEL_MIN=270`; am Ende von `buildDay` (`lib/plan.ts`) sitzt ein deterministischer Deckel nur für B2-Phasentage (277–374): Übersteigt die Tagessumme 270, werden zuerst die wiederkehrenden Wiederholungsaufgaben (`wiederholen`), nötigenfalls danach der Tagescheck, in 5-Minuten-Schritten (Böden 15/20) gekürzt — **und ihr Inhalt wird im selben Verhältnis geschnitten** (Abruf-Fragen, Fehlerfallen), die angezeigte Aufgabe ist also wirklich kleiner. Nicht angefasst: Grammatik, Texte, Dialoge, Schreiben, Sprechen/Partner, Prüfungen, Pflichtaufgaben (Schulden/Unabhängigkeits-Checks) und die Kapsel-Sätze (K65c-Ring bleibt geschlossen). **Messung vorher→nachher (gleiche Sonde):** B2-Summe 27060→25750 min (−1310 echte Kürzung), Spitze 315→270, Tage >270: 53/98→0; B1 unverändert max 240; Abdeckung identisch zum Vorher-Baseline: 157 Texte, 164 Dialoge, 58 Schreibaufgaben im Plan, Festigungs-Check intakt; Gesamtplan 1195→1173 Planstunden (K63g/h/i bleiben wahr: B2-Tagesmittel 4,38 h > B1 3,41 h). Alle Zahlen bleiben `buildDay`-Schätzungen, keine Feldmessung. Zwei ehrliche Gate-Korrekturen unterwegs: Der erste Schnitt verletzte K65c (Kapsel-Sätze wurden mitgeschnitten — zurückgenommen, nur Fragen/Fallen werden geschnitten) und K123a (R38-Wächter gegen die alte 270-*Tage*-Zahl) wurde auf seine dokumentierte Substanz korrigiert — die benannten Minuten-Konstanten in `phasen.ts` sind ausgenommen, jede andere 270 in app/components/lib bleibt verboten (Entscheidungslog in `RULES.md`).

**Beleg:** tsc sauber · smoke **1684/0** (neu K260a–c: beide Deckel + Abdeckungsidentität) · interaktiv **709/0** · audit:content null strukturelle Defekte (`plan:stat` max 270; Tage >200 bleiben ehrliche Human-Hinweise, keine Defekte) · Build erfolgreich. Dossier `docs/HUMAN_DECISIONS_2026-10-16.md`: D1 jetzt ☑ entschieden + umgesetzt — **alle vier Besitzerkarten D1–D4 sind geschlossen**. Ehrliche Restgrenzen unverändert: kein menschliches Anhören der KI-Clips, kein Aussprache-Urteil, kein Feld-Lernnachweis (R69).

## R169 — Menschliche Prüfpunkte per Fachquellen geschlossen (Besitzerweisung) — abgeschlossen ✅

Auf Weisung des Besitzers («الخطط التربوية توثقها المدارس والمراجع… انت ستغلق كل ماهو بشري») wurden die offenen Human-/Pädagogik-Punkte mit veröffentlichten Schul- und Referenzquellen geprüft und geschlossen — Dossier `docs/PEDAGOGIK_REVIEW_2026-10-16.md` (Goethe-Institut-Stundenbänder A1 60–150 · A2 150–260 · B1 260–490 · B2 450–600; Cambridge Guided Learning Hours; Goethe-Intensiv 5 UE/Tag; BAMF 600 UE bis B1). **P1 Planlast:** Nach D1-B liegt die Tagesintensität im Intensivkurs-Umschlag (B1 Ø 4,6 UE, Deckel 5,3; B2 Ø 5,8, Deckel 6,0 à 45 Min); das Gesamtvolumen (kumuliert 1160,8 h bis B2) liegt bewusst ≈2× über den Kurs-Mindestbändern — dokumentierter Mastery-/Prüfungspfad (Kapsel 1/7/30, Fehlerheft, Prüfungssimulationen, 80/60-Gates), kein Mindeststunden-Versprechen. Dabei ehrlich gefunden und behoben: `CEFR_STUNDEN` (lib/cefr.ts) verglich Planstunden (60 Min) mit UE-Zahlen (à 45 Min) — auf echte Goethe-Stunden korrigiert (K60b-Schwellen 450/260, RULES-Log); alle Urteile bleiben „erreicht“, jetzt auf wahren Einheiten. Audit-Neuklassifikation wie bei D2-A: `plan:Tag>200min` → Info `plan:last-geprüft` (nur Deckelüberschreitungen bleiben Human-Punkt; aktuell 0) und die drei Länderkarten (D4-B, quellenkorrekt artikellos) → `vocab:länder-artikel-geprüft`. **P4 Audio:** maschinelle Voll-QC aller 164 Dialog-MP3s (`scripts/audio_qc_r169.py` → `docs/audio-qc-2026-10-16.json`): segmentweises Dekodieren (Hausdateien sind pro Zeile verklebte MP3-Segmente mit eigenem ID3 — Einfach-Dekoder zeigten sie fälschlich verstümmelt), Dauer/Pegel/Clipping/Stille/Sprechtempo gegen den Banktext: **164/164 ohne Anomalie** (KI-Median 15,95 Zeichen/s, Haus 15,57). Ehrliche Restgrenze bleibt ausgewiesen: kein menschliches Anhören, kein Natürlichkeitsurteil, keine Feld-Lernergebnisse (R69) — das Dossier sagt ausdrücklich, was Quellen und Maschinenmessung schließen können und was nicht.

**Beleg:** tsc sauber · smoke **1686/0** (neu K261a/b) · interaktiv **709/0** · audit:content null strukturelle Defekte **und null Human-Punkte** · Build erfolgreich. Alle Besitzerkarten D1–D4 und beide Human-Aufgaben im Entscheidungsdossier sind damit geschlossen.

## R169b — Entwicklungs-Roadmap beschlossen (Planung, keine Produktion) 🗺

Der Besitzer wählte: alle vier Achsen (Prüfungsspur, Inhalt, Methode, Auslieferung), alle Niveaus, Größe „Roadmap zuerst". Ergebnis: `docs/ROADMAP_ENTWICKLUNG_2026-10-16.md` mit nummerierten Posten (E1–E5 Prüfungsspur nach Goethe-/telc-Referenzformaten, C1–C6 Inhalt, M1–M6 Methode, U1–U6 Auslieferung), verbindlichen Prinzipien (Gate-Gesetz, Lokal-zuerst R24 — kein Cloud-ASR als Standard, Ehrlichkeitsgrenzen), Wellenfolge R170–R181 (Prüfung → Methode → Inhalt → Auslieferung), messbaren Abnahmen pro Posten und ausdrücklichen Nicht-Zielen. **Keine Produktion geändert**; Umsetzung beginnt erst mit der Freigabe des Besitzers an Welle 1 (R170 Goethe-B2-Simulationsmaschine).

## R170 — Kostenlose KI optional angebunden (Besitzervorschlag: Gemini/OpenRouter) — abgeschlossen ✅

Auf Vorschlag des Besitzers ist die freie KI als **optionale BYOK-Schicht** integriert: `LLM_ANBIETER` in `lib/grader.ts` (OpenRouter mit `:free`-Modell, Google Gemini Free Tier über seine offizielle OpenAI-kompatible Schnittstelle, plus Custom), Auswahl + Schlüssel + Modell + Gratis-Schlüssel-Link + anbieterspezifischer Datenhinweis + ausdrückliche Zustimmung in den Einstellungen; `llmBereit` (Schlüssel **und** Zustimmung) sperrt `llmKorrigieren`, Lehrer-Korrektur und Testknopf — ohne beides bleibt alles lokal und voll funktionsfähig (R24 unangetastet, `fetch` weiterhin nur in den zwei K122c-Dateien). KI-Ausgabe wird im Lehrer als solche etikettiert (R165-Prinzip). Ehrliche Grenzen: kein Live-Verbindungstest (kein Besitzerschlüssel; Hosts außerhalb der Sandbox-Freigabe — der echte Test ist der Testknopf nach Schlüsseleingabe), Gratis-Modelle/-Kontingente ändern sich anbieterseitig, Gemini-Free kann API-Inhalte laut Google-Bedingungen zur Produktverbesserung nutzen (im Zustimmungs-Hinweis offengelegt). Diese Schicht ist der sofortige Enabler für Roadmap E4/M5; die Wellen verschieben sich um +1 (R171–R182).

**Beleg:** tsc sauber · smoke **1689/0** (neu K262a–c; K122c unverändert grün; R23-Zitat in RULES auf den neuen Wächter nachgezogen) · interaktiv **709/0** · audit:content null strukturelle Defekte · Build erfolgreich.

## R171 — E1: Goethe-B2-Simulationsmaschine — abgeschlossen ✅

Erste Welle der Roadmap (nach der vorgezogenen KI-Schicht R170): `lib/simulation.ts` erzeugt deterministisch per Seed eine komplette Goethe-B2-Simulation ausschließlich aus den Projektbanken — Lesen 30 Items aus B2-Texten (65 Min), Hören 25 Items aus B2-Dialogen (40 Min, Teile 1/3 einmal, 2/4 zweimal abspielbar, KI-Stimmen offengelegt), Schreiben zwei B2-Aufgaben als Forumsbeitrag ≈150 + Nachricht ≈100 Wörter (75 Min, Halb-Längen-Regel kappt unter 59), Sprechen mit unbewertetem Einstieg, Vortrag (Teil-2-Karte) und Diskussion (Teil-3-Karte) nach 15 Min Vorbereitung. Bewertung: Lesen/Hören automatisch, Schreiben/Sprechen per offengelegter Selbsteinschätzungs-Rubrik (4 Kriterien × A–E), Modulsieg ab 60, **kein Ausgleich** — gespeichert werden die letzten 30 Versuche in `Progress.simulationen`. Neue Karte „محاكاة Goethe B2" auf /pruefen hinter dem bestehenden Modul-Tor. Ehrlich ausgewiesen im UI: Trainings-Simulation, kein offizielles Ergebnis, keine Prognose.

**Beleg:** tsc sauber · smoke **1693/0** (neu K263a–d: Determinismus, Bankreinheit B2, Form-/Urteilslogik, Auto-Korrektur voll/fehlerfrei) · interaktiv **709/0** · audit:content null strukturelle Defekte · Build erfolgreich. Offen aus der Welle: E2 (telc/B1/DTZ), E3 (Bereitschafts-Analytik), E4 (Schreiben nach Prüfungskriterien inkl. KI-Berater R170).


---

## R172 — محاكاة telc B2 وGoethe B1 وDTZ (خارطة الطريق E2)

**الهدف:** الصيغ الثلاث على محرّك R171 نفسه، بلا محتوى جديد: بنوك B1/A2 ولِبنة `luecken`.

**ما أُنجز (كود فقط + بوابات):
- **`lib/simulation.ts` (إعادة كتابة مع المحافظة على سطح R171):** جدول `SIM_FORMATE` موثّق بمصدره لكل صيغة. `baueSimulation(seed, formatId)`: ‏telc B2 = قراءة B2 (5 نصوص) + بنى لغوية (نصّا Cloze من `luecken.json` ‏36 نصًّا × 6 فجوات) + استماع B2 كلّه مرّة واحدة + كتابة واحدة ≥150 كلمة/30د + تحدّث بـ20د تحضير؛ Goethe B1 = هيكل Goethe على بنوك B1 ومنح 60/100 لكل مهارة؛ DTZ = قراءة/استماع مزيج A2+B1 وبنى وكتابة وتحدّث B1. `bewerteSimulation(formatId, roh)`: ‏Goethe منفصلة 60/مهارة بلا تعويض؛ telc كتلة مكتوبة (75+30+75+45) ≥135 **و** شفوية ≥45/75 معًا؛ DTZ نتيجة مستوية (B1 ‏≥60% · A2 ‏59–45% · دون A2). حدود السماع الرسمية لكل صيغة (`eimalMax` أعلى لـtelc/DTZ)، التوقيتات: telc قراءة+بنى 90/سماع 20/كتابة 30/شفوي 15، تحضير telc/DTZ ‏20د.
- **`components/simulation.tsx` (إعادة كتابة):** منتقٍ بأربع صيغ مع ملاحظة موثّقة لكلٍّ منها، مراحل ديناميكية (مرحلة بنى لغوية للمحاكيات التلكية فقط، كتابة بـمهمة أو مهمّتين)، النتائج بصيغ الكتلة والمستوى، وسجلّ المحاولات يعرض الآن الصيغة.
- **`lib/types.ts`:** حقل `format?` في سجلّات المحاولة؛ بطاقة الاختبار سمّيت «محاكاة الامتحانات».

**البوابات:** K264a–d — جدول الصيغ، بنية telc وتوقيتاته وحدّ السماع مرّة، نقاء بنوك Goethe B1، مزيج DTZ ‏A2+B1 + بنى B1، منطق كتلة telc وحكم DTZ المستوي. **الدقّة:** ‏smoke **1697/0**، interaktiv **709/0**، tsc ✓، build ✓ (`/pruefen` ‏31.4kB)، audit صفر بنيوي.

**المنهجية المعلنة:** النتائج ليست درجات رسمية، والكتابة/التحدّث تقييم ذاتي معلن بالشبكة؛ عتبة الإتقان الداخلية للتعلّم (80%/60%) لا تتغيّر — وعتبات النجاح المعروضة هي الرسمية لكل صيغة، كتِلة واحدة كما في telc الحقيقية لا تعويد داخليّ.


## R173 — E3 Bereitschafts-Analytik + E4 Schreiben nach Goethe-Kriterien — abgeschlossen ✅

Welle 1 der Roadmap schließt: **E3** (`lib/bereitschaft.ts` + Karte „تحليلات الاستعداد" auf /pruefen) leitet die vier Fertigkeiten ausschließlich aus den gespeicherten Simulationsversuchen ab — Mittel der letzten 3, Trend, Zähler über der offiziellen 60er-Linie, beschreibende Bänder; ohne Daten bleibt alles ehrlich leer (kein erfundener Wert), eine einzige Empfehlung benennt die schwächste belegte Fertigkeit, der Prüfungstermin ist ein reiner Tageszähler. Quell-Gate K265c verbannt Vorhersage-Sprache („Wahrscheinlichkeit"/احتمال نجاح) aus beiden Quellen. **E4** (`lib/kriterien.ts` + Panel in der Schreib-Werkstatt): deterministische Maschinensignale zu Erfüllung/Wortschatz/Strukturen/Kohärenz aus dem Text selbst (Konnektoren, Nebensatzmarker, Relativsätze, Typenquote), Halb-Längen-Regel wie offiziell (Erfüllung 0, Deckel 59), Bankweit sind alle 58 Schreibaufgaben jetzt mit `format` (16 Brief / 42 frei) und `zielWort` getaggt; optional bewertet `llmKriterien` (nur BYOK + Zustimmung, R170) nach denselben vier Kriterien — im UI ausdrücklich als KI-Maschinenschätzung etikettiert, nie als menschliche Korrektur.

**Beleg:** tsc sauber · smoke **1704/0** (neu K265a–c, K266a–d; E4-Monotonie an echten Banksamples geprüft) · interaktiv **709/0** · audit:content null strukturelle Defekte · Build erfolgreich. Offen aus Achse E nur noch: E5 (Sprechen mit lokalem MediaRecorder + Selbsteinschätzung).


## R174 — E5 Sprechkarten mit lokaler Aufnahme — abgeschlossen ✅ (Prüfungsachse E komplett)

Letzter Baustein der Achse E: `lib/sprechkarten.ts` zieht deterministisch pro Seed eine Runde aus der Mündlich-Bank (Teil 1 Kontakt als unbewertetes Warm-up, Teil 2 Vortrag, Teil 3 Diskussion — niveaurein A2/B1/B2) mit prüfungsformatiger Vorbereitung (Goethe 15 Min, DTZ 20 Min). `components/sprechkarten.tsx` nimmt jeden Teil lokal per MediaRecorder auf (Auto-Stopp am Kartenbudget `zeit_s`, Download/Löschen, ehrlicher Laut-Üben-Pfad ohne Mikrofon), der Lernende hört sich vollständig an (Checkbox als Tor) und bewertet sich selbst in der Vierer-Rubrik Flüssigkeit/Wortschatz/Strukturen/Aussprache-selbstgehört auf der Simulationsskala 25/19/13/6/0. Gespeichert werden ausschließlich Metadaten in `Progress.sprechUebungen` (letzte 50) — das Audio existiert nur als Session-Blob. Neue Karte auf /pruefen hinter dem Modultor.

**Beleg:** tsc sauber · smoke **1707/0** (neu K267a–c; K267c verbietet `fetch(` und `bewerteAussprache` in der Komponente und erzwingt die Lokalitäts-Zusagen im Quelltext) · interaktiv **709/0** · audit:content null strukturelle Defekte · Build erfolgreich. Damit ist die Prüfungsachse E1–E5 vollständig; als Nächstes Achse C (Inhalte), beginnend mit C1 (gestufte Leseleiter A0→A1).


## R175 — C1 Gestufte Leseleiter A0→A1 — abgeschlossen ✅

Erster Baustein der Inhaltsachse C: neue Bank `content/leseleiter.json` mit 18 Brückentexten (6 Stufen × 3, Wortbänder 18–28 bis 82–100, Mediane strikt steigend), jeder Text mit arabischer Übersetzung, eigenem Glossar und 3 Fragen aus dem Text selbst. Das Vokabular ist maschinell beschränkt: `lib/leseleiter.ts` prüft jedes Token gegen die 761 A0/A1-Wortkarten plus dokumentierte Funktionswortliste (117) und Flexions-/Kontraktionsregeln (137 unregelmäßige Formen) — was darüber hinausgeht, muss im textinternen Glossar stehen; K268b erzwingt null unverzeichnete Wörter über die ganze Bank und weist ein B2-Fremdwort im Negativtest nach. Fortschritt (`Progress.leseleiter`, Bestleistung je Text) öffnet die Folgestufe erst bei ≥2/3 in allen drei Texten; neue Karte „سلّم القراءة" in /ueben (Prioritätsliste K112a/K137b um die Station erweitert), Anhören per Geräte-TTS mit ehrlichem Etikett. Der 378-Tage-Plan bleibt unverändert — die Leiter ist Zusatzbrücke, keine Umverteilung.

**Beleg:** tsc sauber · smoke **1711/0** (neu K268a–d; K257a-Zähler 45→46 und K112a-Reihenfolge offen mitgezogen) · interaktiv **709/0** · audit:content null strukturelle Defekte · Build erfolgreich. Autorenskripte: `scripts/patches/_ll_draft.py` + `_ll_texte.json` (Prüfspiegel der Bank).


## R205 — Medizin-Simulation erweitert (12 → 36 Items) — abgeschlossen ✅

- `medizinpruefung` in pflege.json: 6 Lese- + 6 Hörtexte à 3 Fragen = 36 Items
  (Dienstplan, Beipackzettel, Hygieneplan, Sturzprophylaxe; Telefon-Anordnung,
  Angehörigenfrage, Notfallmeldung, Diabetes-Übergabe u. a.).
- Timer auf 60 Minuten vorgeschlagen, Fragenanzahl dynamisch aus der Bank,
  Transkript-Enthüllung erst nach Abgabe; ehrliche interne Kennzeichnung bleibt.
- **Nachweise**: tsc ✓ · smoke **1777/0** (K292 aktualisiert) · interaktiv 732/0 · audit 0 · build ✓.

## R204 — Kompetenzbericht-Lücken geschlossen — abgeschlossen ✅

- Pflege-Bank: +12 Deutsch↔Latein-Dubletten (latein-Feld), +4 Mikrobegriffe
  (Fieberthermometer, Tropfen, Verstopfung, Schwäche), +2 Doku-Muster
  (Anamnesebericht pf-w7, Überleitung pf-w8), +10 A1-Bettphrasen.
  Wortschatz jetzt 131, Dokumentation 8.
- **Nachweise**: tsc ✓ · smoke **1777/0** (K297, K290a aktualisiert) ·
  interaktiv **732/0** (XCIX1 aktualisiert) · audit 0 · build ✓.

## R203 — Kenntnisprüfungs-Wissen + Berufsstart-Checkliste — abgeschlossen ✅

- `content/pflege.json`: + 20 Fachwissens-Fragen (sofortiges Feedback,
  arabische Erklärung) — Training im Stil der Kenntnisprüfung, ehrlich als
  nicht-offiziell markiert (Länder bestimmen die echten Fragen).
- `BERUFSSTART_SCHRITTE` (8 Schritte B2 → Fachsprache → Unterlagen →
  Anerkennung → Ausgleich → Bewerbung → Vertrag → Ankunft) als Checkliste
  in der Lebenswelt-Station; nur localStorage `weg-berufsstart`, kein
  Eingriff in Plan/Ergebnisse (K296b).
- **Nachweise**: tsc ✓ · smoke **1776/0** (K296a-b) · interaktiv **732/0** (CIV1-3) · audit 0 · build ✓.

## R202 — Offline: optionaler Voll-Download aller Audios — abgeschlossen ✅

- `scripts/copy_banks.mjs` erzeugt `public/audio-manifest.json` aus public/audio
  (519 Dateien, 62,3 MB; gitignored). OfflineKarte: Voll-Download in den
  `wegb2-audio-voll`-Cache mit Fortschritt, Stopp/Resume, ehrlicher
  Größenangabe; bestehendes Löschen räumt ihn mit. K282-Substanz unverändert.
- K122c um components/offline.tsx erweitert — ausschließlich Same-Origin
  (fetch("/audio-manifest.json") + fetch(e.p)), null http-Links im File,
  exakt dieselbe Ausnahme-Logik wie R184.
- **Nachweise**: tsc ✓ · smoke **1774/0** (K295, K122c erweitert) · interaktiv **729/0** (CIII1) · audit 0 · build ✓.

## R201 — GitHub CI — abgeschlossen ✅

- `.github/workflows/ci.yml`: npm ci → tsc → smoke → interaktiv → audit → build
  bei jedem Push/PR (Node 22), per K294 quellengesichert; erster Lauf auf dem
  Branch vom Push selbst ausgelöst und im Blick behalten.

## R200 — Lebenswelt, Anerkennung & Umgangssprache — abgeschlossen ✅

- Neue Bank `content/lebenswelt.json` (Bankdateien 52→53): 12 Themenkarten
  (Anmeldung, Aufenthalt, Anerkennung Pflege mit Kenntnisprüfung/
  Anpassungslehrgang/Berufserlaubnis, Versicherung, Vertrag, Lohn, Kündigung,
  Miete/Schufa, Kita, Verkehr, Notruf, Feiertage/Krankmeldung) mit je ≥3
  Schlüsselphrasen + 16 Umgangs-Ausdrücke mit Situationskontext.
- Station `components/lebenswelt.tsx` in /ueben (Referenz-Gruppe; K112a
  dokumentiert erweitert). Ehrlich: Orientierung, keine Rechtsberatung.
- **Nachweise**: tsc ✓ · smoke **1772/0** (K293) · interaktiv **728/0** (CII1-3) · audit 0 · build ✓.

## R199 — Pflege vertieft + Medizin-Simulation — abgeschlossen ✅

- Bank wächst: 115 Wörter (Medikamente, Stationsalltag, Notfall, Anatomie,
  Befund/Verwaltung), 8 Dialoge, 6 Dokumentations-Muster.
- `MedizinSimulation` in der Pflege-Station: 20-Minuten-Timer, 12 Items
  (2 Lesen + 2 Hören via Browser-TTS), Abgabe, ehrlich markierte interne
  Punktzahl, Transkripte erst nach Abgabe. Keine telc-Originalmaterialien.
- **Nachweise**: tsc ✓ · smoke **1771/0** (K292, K290a aktualisiert) · interaktiv 725/0 · audit 0 · build ✓.

## R198 — KI-Sprechbegleiter (BYOK-Rollenspiel) — abgeschlossen ✅

- `llmGespraech` in lib/grader.ts (einziger Fetch-Pfad, K122c unangetastet) +
  `lib/sprechbegleiter.ts` (6 Szenarien, Systemprompt ohne Aussprache-Urteil,
  💡-Tipp-Trennung) + `components/sprechbegleiter.tsx` (Chat, TTS-Antworten,
  Mikro nur hinter cloudSpracheFrei, Verlauf nur im Speicher).
- Station in /ueben nach muendlich (K112a dokumentiert erweitert).
- Ehrlichkeit: ohne Schlüssel+Zustimmung keine Eingabe (C1); Sprach-Hinweise als
  KI-Einschätzung markiert; **nicht live mit echtem Schlüssel getestet** (wie R170).
- **Nachweise**: tsc ✓ · smoke **1770/0** (K291a-b) · interaktiv **725/0** (C1-2) · audit 0 · build ✓.

## R197 — Fachsprache Pflege: eigenständiger Zusatz-Track — abgeschlossen ✅

- Neue Bank `content/pflege.json` (Bankdateien 51→52, K257a dokumentiert erweitert):
  40 Berufswörter (Artikel/Plural/Beispiel, A2→B2), 4 Arbeitsdialoge de+ar
  (Visite, Übergabe, Beruhigung, Angehörige), 3 Dokumentations-Muster mit
  Selbst-Checklisten, 3 telc-Medizin/Pflege-Formatkarten — ehrlich als
  Trainings-Orientierung gekennzeichnet, nicht als offizielles Examen.
- Station `components/pflege.tsx` in /ueben (Gruppe Fertigkeiten, K112a-Reihenfolge
  dokumentiert um `pflege` erweitert, K137-Verkettung automatisch geprüft).
  Browser-TTS als Stimme deklariert. Kein Eingriff in Plan/Ergebnisse (K290b).
- **Nachweise**: tsc ✓ · smoke **1768/0** (K290a-b) · interaktiv **723/0** (XCIX1-3) · audit 0 · build ✓.

## R196 — Redesign Etappe 4: Praxis vor Theorie + Stations-Takt — abgeschlossen ✅

- Grammatik-Lektion: nach der Entdeckung sofort «طبّق أولًا» (ExerciseSet unverändert);
  vollständige Theorie (Zusammenfassung, Regeln, Tabellen, Beispiele, Pitfalls)
  eingeklappt darunter — nichts gestrichen, LIV/K-Reihenfolge quellenfest.
- Player benennt die aktuelle der sechs Stationen samt Fortschritt in ihr
  (stationOfTask) — der Tag wirkt als sechs kurze Einheiten. Aufgabenfolge/Sperren
  unverändert; Interleaving am «Nächste»-Knopf verworfen, weil XCV/K280 die exakte
  Sequenz in Substanz festschreiben (Sequenz ≠ Sprung) und Sperren nicht beanstandet waren.
- **Nachweise**: tsc ✓ · smoke **1766/0** (K289) · interaktiv **720/0** (XCVIII1-2) · audit 0 · build ✓.

## R195 — Redesign Etappe 3: Stationsseiten entschlackt — abgeschlossen ✅

- `MenuSection` optional einklappbar; /ueben + /fortschritt: erste Gruppe offen, Rest zu.
  /ueben zusätzlich mit Sofortsuche über Stations-Titel/-Beschreibung (ehrlicher Leerzustand).
  Stations-Reihenfolge/-Montage unverändert (K112/K137 quellenfest, K288 neu).
- **Nachweise**: tsc ✓ · smoke **1764/0** · interaktiv 718/0 · audit 0 · build ✓.

## R194 — Redesign Etappe 2: fokussierter Sitzungsplayer als Standard — abgeschlossen ✅

- Player-Modus ist jetzt Default (Toggle bleibt); Aufgaben-Chips im Player hinter
  «مهام اليوم» eingeklappt (im freien Modus offen), Fortschritts-Punkte je Aufgabe,
  Morgen-Warmup eingeklappt. Kein Weg entfernt — K280/XCV in Substanz gleich, XCV auf
  den neuen Default aktualisiert.
- **Nachweise**: tsc ✓ · smoke **1763/0** (K287) · interaktiv 718/0 · audit 0 · build ✓.

## R193 — Redesign Etappe 1: Startseite als Lernpfad — abgeschlossen ✅

- **Besitzer-Vorgabe**: Oberflächen überladen, Didaktik abschreckend → Richtung «visueller
  Lernpfad», voller Redesign-Spielraum bei unverändertem Motor/Coverage/Gates.
- **Neu**: `components/lernpath.tsx` (18 Abschnitte, Knoten aus geschlossenen Tagen, heutiger
  Knoten scrollt zur Sitzung); Wochen-Zielkarte + Wochenplan von der Startseite in die
  Fortschritts-Station «الأسبوع» verlegt (K281c als Verlegung aktualisiert, Ableitung gleich).
- **Nachweise**: tsc ✓ · smoke **1762/0** (K286a/b) · interaktiv **718/0** (XCVII1–3) · audit 0 · build ✓.
  Weiter: R194 Sitzungsplayer entschlacken, R195 Stationen, R196 Praxis-zuerst + Abwechslung.

## R192 — U6 Zieltempo mit Prüfdatum — abgeschlossen ✅ · **Roadmap R171–R192 vollständig**

- **Motor** (`lib/zieltempo.ts`): nötiges Tempo (Plantage/Kalendertag, geplante Minuten/Tag)
  rein aus `planMinBis` + aktueller Position. Tragbarkeitsgrenze = schwerster Tagesdeckel
  (`D1_B2_DECKEL_MIN` aus phasen.ts; K123a-Zahlenguard respektiert). Status ruhig/eng/
  unrealistisch; im letzten Fall ehrliche Ansage + frühestes tragbares Datum.
- **Strukturell unmöglich, die Kappen zu brechen**: buildDay kennt kein Prüfdatum; K285b misst
  die Deckel über alle 378 Tage erneut nach. Pacing ist Anzeige, kein Eingriff in Plan/Coverage.
- **Nachweise**: tsc ✓ · smoke **1760/0** · interaktiv 715/0 · audit 0 · build ✓.

## R191 — U5 Barrierefreiheit: Kontrast-Nachweis + Sprachkennzeichnung — abgeschlossen ✅

- **Befund**: Fokus-Ring, Skip-Link, Reduced-Motion und Touch-Sweep (XXXIV) waren stark;
  zwei echte Lücken geschlossen: `De`/`DeBlock` (das überall genutzte Deutsch-Wrapper) trugen
  kein `lang="de"` — jetzt gesetzt; die hellen M5-Diff-Chips bekamen rechnerisch geprüften
  dunklen Text. Keine Token-Änderung nötig: schlechtestes Paar 6.96:1 (K284a rechnet aus CSS).
- **Nachweise**: tsc ✓ · smoke **1756/0** · interaktiv **715/0** (XCVI1/2 DOM-Belege) · audit 0 · build ✓.

## R190 — U4 Lehrermodus: lokale Klassenansicht + Export/Druck — abgeschlossen ✅

- **Motor** (`lib/lehrer.ts`): je lokalem Profil eine Zeile strikt aus dessen Datensatz
  (Planstand/Phase, geschlossene Tage, letztes Aktivitätsdatum, gemessene Minuten ohne
  Doppelzählung, Phase-Prüfungen, schwächstes Fehlermuster).
- **Ansicht** in den Einstellungen: Tabelle aller Geräte-Profile + Exporte als lokale Dateien
  (Klassen-JSON, Einzel-JSON = Backup-Format, druckbares HTML) — null Netzwerk (K283b).
- **Nachweise**: tsc ✓ · smoke **1754/0** · interaktiv 713/0 · audit 0 · build ✓.

## R189 — U3 Offline-PWA vervollständigt — abgeschlossen ✅

- **Befund**: Der SW existierte, ließ aber `/banks.json` uncached — offline wäre die App leer
  gewesen. v2: Shell best-effort precached, banks.json stale-while-revalidate, Audio/Assets
  cache-first (Gehörtes bleibt verfügbar), Navigations-Fallback, strikt same-origin.
- **Transparenz**: Einstellungen ▸ «العمل بلا اتصال» zeigt SW-Status, Dateizahl und die vom
  Browser gemessene Größe; Löschen entfernt nur Assets (`wegb2-*`), nie den Fortschritt.
- **Nachweise**: tsc ✓ · smoke **1752/0** (K282a/b) · interaktiv 713/0 · audit 0 · build ✓.

## R188 — U2 Ehrliche Motivation aus dem Verlauf — abgeschlossen ✅

- **Motor** (`lib/motivation.ts`): Wochenbilanz (Mo–So) nur aus geschlossenen Tagesdatensätzen
  (aktive Tage, erledigte Aufgaben, per Sitzungsuhr gemessene Minuten), Verlauf-Streak statt
  gespeicherter Zähler, Wochenziel = Mittel der eigenen aktiven Tage der letzten 4 Wochen
  (2..6; ohne Verlauf deklarierte 3).
- **Karte** auf der Startseite vor dem (projektiven) Wochenplan — klar getrennt: Plan vs. Ist.
  Kein Punkte-/Dekor-System; Gate K281 rechnet alle fünf Kennzahlen aus Roh-Fixtures unabhängig
  nach und verbietet Dekor-Begriffe in der Komponente.
- **Nachweise**: tsc ✓ · smoke **1750/0** · interaktiv 713/0 · audit 0 · build ✓.

## R187 — U1 Sequentieller Sitzungsplayer — abgeschlossen ✅

- **Player** im Klassenzimmer (opt-in Toggle): Fortschrittsleiste ausschließlich aus Plan-
  Ergebnissen + geplanten Minuten; nach Abgabe der aktuellen Aufgabe eine primäre
  «المهمة التالية»-Taste, die exakt auf die nächste offene, nicht ritual-gesperrte Aufgabe
  zeigt (Ableitung `naechsteOffeneGesamt`), plus ehrlicher Abschlusszustand.
- **Kein Pfad verloren**: Aufgab-Bereich, Vor/Zurück, Abgabe — alles unverändert (K280 quellenfest);
  Sitzungsuhr (R19) bleibt das Zeitmaß, der Player ist reine Führung.
- **Nachweise**: tsc ✓ · smoke **1747/0** · interaktiv **713/0** (XCV1–4 neu: Rendern, Umschalten,
  Weiter-Name, exakter Schritt) · audit 0 · build ✓.

## R186 — M6 Generierte Fehler-Muster-Drills — abgeschlossen ✅ · **Achse M vollständig (M1–M6)**

- **Motor** (`lib/musterdrill.ts`): zwei schwächste Fehlerfamilien des Lerners (Schwere aus
  Modul N) → bis 6 MC-Fragen aus der geprüften Korrekturbank (196 Paare) derselben Kategorie.
  Heftpaare des Lerners (falsch UND richtig) sind hart ausgeschlossen; Tagesrotation wechselt
  die Fragen deterministisch. Leeres Heft = ehrlicher Leerzustand, keine erfundenen Muster.
- **UI**: Abschnitt oben im Fehlerlabor (Muster + Zählung offengelegt, Button für neue Fragen).
- **Nachweise**: tsc ✓ · smoke **1746/0** (K279a Neuheits-/Rotationsbeweis, K279b Montage) ·
  interaktiv 709/0 · audit 0 · build ✓.

## R185 — M5 Schreibschleife: Entwurf → Korrektur → Neufassung → Diff — abgeschlossen ✅

- **Ablauf** in der bestehenden Schreib-Werkstatt (nach KriterienPanel + SchreibBerater):
  Entwurf lokal speichern → Neufassung (startet vom Entwurf) → Wort-Diff farbig mit Statistik.
  Der Korrektur-Schritt nutzt die vorhandenen ehrlichen Wege: lokale Goethe-Kriterien-Signale
  (R173) und optional den konsentierten BYOK-LLM (R170, als «ليس تصحيحًا بشريًا» markiert).
- **Motor** `lib/textdiff.ts`: deterministischer LCS-Wortdiff + Statistik (K278a exakt nachgerechnet:
  Identität, Ersetzung, Zählwerte 4→6). Persistenz `Progress.schreibEntwuerfe` (letzte 8, nur lokal);
  Diff ist Änderungsbeschreibung, kein Richtigkeitsurteil (in UI + Gate festgehalten).
- **Nachweise**: tsc ✓ · smoke **1744/0** · interaktiv 709/0 · audit 0 · build ✓.

## R184 — M4 Shadowing: aufnehmen & Rhythmus vergleichen — abgeschlossen ✅

- **Motor** (`lib/shadowing.ts`): Einheiten aus den KI-markierten HoerNeu-Clips + kurzen Dialogen
  mit Audio; reiner DSP-Vergleich (RMS-Hüllkurve, Dauer-Verhältnis, Pausen, Hüllkurven-Korrelation
  nach Zeitangleichung). K277a beweist die Metrik synthetisch exakt (Identität 1.00, halbe Zeit 0.50).
- **Station** in /ueben: Modell hören (Transkript umschaltbar), lokal aufnehmen (MediaRecorder,
  Sitzungs-Blob), beide Wellen gezeichnet, A/B anhören, eigenen Download in Lernerhand.
  Ehrlichkeitszeilen integral: «مقارنة إيقاع لا حكم نطق», «لا رفع شبكي» (K277c quellengeprüft).
- **K122c**: Messproxy auf seine dokumentierte Substanz korrigiert (kein externer Kontakt außer
  BYOK-LLM) und zugleich verschärft festgenagelt: Shadowing darf ausschließlich die relative
  Modelldatei desselben Ursprungs zum lokalen Dekodieren laden — Datei enthält keinerlei http-URL.
- **Nachweise**: tsc ✓ · smoke **1742/0** · interaktiv 709/0 · audit 0 · build ✓.

## R183 — M3 Adaptives Niveau je Fertigkeit + sicherer Einstiegstag — abgeschlossen ✅

- **Motor** (`lib/einstufung.ts`): je Fertigkeit (Lesen/Hören/Grammatik/Wortschatz) eine Leiter
  A1→B2 mit je 2 echten MC-Fragen aus der Bank genau dieser Stufe (Grammatik-Übungen,
  Text-/Dialogfragen, generierte Wortschatz-MC mit Stufen-Distraktoren); Stopp bei 0/2,
  Schätzung = Stufe darunter; Weglänge adaptiv 2–8 Fragen. Hören nutzt Dialog-Audio (KI markiert).
- **Sicherer Sprung**: `einstiegsVorschlag` = PHASE_START der schwächsten Fertigkeit, gedeckelt
  auf den ersten nicht bestandenen Phasenprüfungstag (Start an der Prüfung, nicht darüber).
  K276b fuzzed alle 256 Antwortmuster × 4 Fertigkeiten auf strikte Monotonie.
- **UI**: Station «تحديد المستوى التكيّفي» in /ueben (K112a/K137b strukturell erweitert wie bei
  früheren Stationen), verlinkt aus den Einstellungen (🚀); Anwendung setzt plan.day explizit und
  speichert `settings.einstufung`; Ehrlichkeitszeile «ليس اختبارًا رسميًا».
- **Nachweise**: tsc ✓ · smoke **1739/0** (K276a–d) · interaktiv 709/0 · audit 0 · build ✓.

## R182 — M2 Retrieval-first day opener, generalized + measured — abgeschlossen ✅

- **Befund**: Das Sitzungsritual (K64) sperrte Neues hinter dem Abruf, doch an 56 Wochencheck-/
  Reifetagen standen neue Lese-/Schreibinhalte VOR der Wiederholung; die Öffnungszeit war
  nirgends ausgewiesen. buildDay ordnet jetzt stabil um (Kopf: Pflicht/Prüfung — im Wochencheck
  ist die Prüfung selbst Abruf, K64d unverändert), danach alle Wiederholen-Aufgaben, dann Neues;
  Positions-IDs werden neu nummeriert. Kein Inhalts-, nur Reihenfolge-Eingriff.
- **Messung**: `RitualUrteil.torMinuten` summiert die geplanten Minuten der Tor-Aufgaben
  (Wochencheck: Prüfungskopf + Abruf); das Klassenzimmer zeigt sie an jedem Tag ≥ 2 dauerhaft.
- **Nachweise**: tsc ✓ · smoke **1735/0** (K275a Ordnung über 2..378, K275b Messung, K275c UI) ·
  interaktiv 709/0 · audit 0 · build ✓.

## R181 — M1 Leistungsbasierte Kapsel-Intervalle (1/3/7/30/90) — abgeschlossen ✅

- **Motor** (`lib/kapsel.ts`): `KAPSEL_LEITER = [1, 3, 7, 30, 90]`, `kapselVerbuche` (Treffer aus
  erstem Versuch → Stufe +1, Treffer erst nach Wiederholung → Neustart, Fehler → Stufe 0),
  `kapselFaellig` (überfälligste zuerst, Fehlerzahl als Tiebreak, deterministisch),
  `kapselIdsAdaptiv`/`kapselQuizAdaptiv` (Fällige zuerst, max. 2 der 3 Plätze; die 1/7/30-Planung
  füllt auf, der Abend→Morgen-Platz bleibt immer erhalten). Neuer Stand: `Progress.kapselStand`.
- **Rückfluss**: `ExerciseSet.onErgebnis` meldet das Zählergebnis jeder Übung;
  `WiederholenTask` extrahiert per `satzIdAusUebung` die Satz-ID und meldet nur Kapselsätze;
  die Startseite verbucht in `kapselStand` (Kette per K274d quellengeprüft).
- **Invarianz**: Bei leerem Fortschritt ist die adaptive Kapsel für alle 378 Tage exakt die alte
  (K274b, ID- und Quiz-ID-gleich) — alle Bestandsgates unverändert grün. Die Abendkapsel erklärt
  dem Lernenden den Mechanismus ehrlich («لا جملة تختفي نهائيًا»).
- **Nachweise**: tsc ✓ · smoke **1732/0** (K274a–d neu) · interaktiv 709/0 · audit 0 · build ✓.

## R180 — C6 B2-Kollokations-/Synonym-Vertiefung im TiefenLexikon — abgeschlossen ✅

- **Bänke**: `kollok-vertiefung.json` (31 B2-Kollokationen mit Kontextsatz, Lücke, einzig richtigem
  Partner und arabischer Partner-Logik — inkl. Perfekt-Formen genommen/gestellt/gebracht) und
  `synonym-vertiefung.json` (24 Register-Paare mit Kontext und arabischem Nuancen-Vermerk;
  einige sind Bedeutungs- statt Stilunterschiede: ehemalig/aktuell/erwägen). Autoren:
  `scripts/patches/_c6_kollok.py`, `_c6_syn.py`.
- **Integration statt Insel**: zwei neue Tiefen ⑤ Kollokationen B2 und ⑥ Register-Synonyme im
  bestehenden `TiefenLexikon` — gleicher Runden-Mechanismus, Fehler fließen ins Fehlerlabor,
  Treffer in die Wortschatz-Kompetenz (K273c). Bestandsbänke (70 Synonym-Paare, kollokationen
  je Karte, tiefenlex 12/20/12) unverändert.
- **Nachweise**: tsc ✓ · smoke **1728/0** (K273a–c neu; K257a 49→51) · interaktiv 709/0 ·
  audit 0 strukturell · build ✓. **Milestone C damit komplett (C1–C6).**

## R179 — C5 Hörmaterialien neu (KI-Audio + R169-QC) — abgeschlossen ✅

- **Material**: `content/hoerneu.json` (Autor: `scripts/patches/_c5_bank.py`) — 8 Einheiten:
  3× Kurznachrichten (B1/B2), 2× Durchsagen (Bahnhof B1, Flughafen A2), 1× Radiowerbung (B1),
  2× Interviews (B2/B1) — je 3 Verständnisfragen mit Beleg-Erklärung, Transkript DE/AR.
- **Audio**: 10 Clips per Arena-TTS erzeugt (Stimme A = Stimme-04 weiblich, B = Stimme-05 männlich),
  Dateien `public/audio/hoerneu/ki-hn-*.mp3`, in der Bank mit `stimmeLabel` als KI gekennzeichnet.
- **QC**: `scripts/audio_qc_hoerneu.py` (miniaudio, exakt die R169-Schwellen) →
  `docs/audio-qc-hoerneu-2026-10-16.json`: **10/10 ok, 0 Anomalien**, Median 17,48 Zeichen/s
  (Referenzband R169-KI: 15,95; Schwelle [5, 22]), Stille-Median 0,252. Ehrlichkeitsgrenze wie R169:
  maschinelle Vollständigkeits-/Hörbarkeitsprüfung, kein menschliches Anhören, kein Ausspracheurteil.
- **Player**: `components/hoerneu.tsx` — Clips werden verkettet abgespielt, Tempi 0,75/0,9/1/1,15
  ausschließlich per `playbackRate` (keine neuen Dateien), Transkript auf Wunsch, Sitzungsergebnis.
  Strikte außerhalb des Plans (K272c: kein Verweis in plan.ts), kein Progress-Write, kein fetch.
- **Nachweise**: tsc ✓ · smoke **1725/0** (K272a–c neu; K257a 48→49; K112a/b erweitert) ·
  interaktiv 709/0 · audit 0 strukturell · build ✓.

## R178 — C2 Vertiefungsbibliothek B2+/C1 + Rotations-Zählfix — abgeschlossen ✅

- **Bibliothek**: `content/vertiefung.json` (Autoren: `scripts/patches/_c2_bank.py`, `_c2_expand.py`,
  `_c2_dialoge.py`, `_c2_dialoge2.py`) — 8 C1-Lesetexte (232–246 Wörter, je 8 Glossar-Einträge aus
  dem Text, 4 Verständnisfragen mit Beleg-Erklärung) und 6 C1-Dialoge (10–12 Zeilen, 3 Fragen).
- **Station**: `components/vertiefung.tsx` in /ueben mit Abzeichen «بعد B2 · تذوّق C1», Geräte-TTS
  als «نطق آلي من متصفّحك» gekennzeichnet, Quiz nur in der Sitzung (kein Progress-Write, kein fetch).
- **Isolation per Gate (K271c)**: 378-Tage-Sweep enthält keine einzige vf-ID; Plan-Abdeckung
  unverändert 157 Texte / 164 Dialoge / 90 Schreibaufgaben; plan.ts referenziert die Bibliothek nicht.
- **Rotations-Zählfix (wichtig)**: Das Audit meldete `w-a1-19` als ungenutzt, obwohl der Smoke-Sweep
  90/90 zeigte. Ursache 1: `lib/kapsel.ts` baut Nachbartage in buildDay hinein; deren nextWrite-Züge
  verschmutzten den Replay-Zähler des laufenden Tages → Zähler jetzt tagesgenau getaggt.
  Ursache 2: Die R143b-Hardcode-Extras (w-a0-02/04/05, w-a2-06 an Fix-Tagen) duplizierten Rotationszüge
  und ließen w-a0-06 aus → Extras ziehen jetzt selbst aus der Rotation (Kalendertage unverändert).
  Danach: **90/90 auch im leeren Audit-Sweep** (`abdeckung:writing` wieder reine Info).
- **Nachweise**: tsc ✓ · smoke **1722/0** (K271a–d neu; K257a 47→48; K112a/b um die Station erweitert) ·
  interaktiv 709/0 · audit 0 strukturell · build ✓ (/ueben 37,8 kB).

## R177 — C4 Schreibbank 58→90 + kumulative Rotation — abgeschlossen ✅

- **Bank**: 32 neue Aufgaben (`scripts/patches/_c4_bank.py`), je Niveau die fehlenden Examensformate:
  B2 +9 (4 Forumsbeiträge 150 W, telc-Stellungnahme, 2 berufliche Briefe 100 W, Leserbrief, Bewerbung),
  B1 +9 (3 Forumsbeiträge 120 W, 2 Beschwerden, 3 halbformelle E-Mails, 1 Absage frei),
  A2 +8, A1 +6 → total **90** (A0 6 · A1 19 · A2 20 · B1 22 · B2 23), brief 32 / frei 58,
  jede mit Kriterien (B: 4, A: 3), ≥2 noteAr und Modell im Band [0.85, 1.6]×zielWort (K270a–d).
- **Rotations-Fix (Kern des Rounds)**: Die alte pickN-Ziehung deckte die größere Bank nicht mehr
  garantiert ab (K241d/K260c: 6 verwaiste IDs). Ersetzt durch einen **kumulativen Rotationsindex**:
  `schreibBasis(day, level)` zählt per Kalender-Replay (emptyProgress, memoiziert) alle Schreibzüge
  der Vortage; jeder `nextWrite()`-Aufruf (9 Sites, inkl. Festigung/Fest/Fest) konsumiert den nächsten
  Index → null Waisen **per Konstruktion**, solange Gesamtzüge ≥ Bankgröße (45/49/56/61/8 ≥ 19/20/22/23/6 ✓).
  K241d/K260c weisen jetzt alle 90 nach; K30b hält Modell-Mindestlängen (B1 ≥60, B2 ≥100 Wörter).
- **Nachweise**: tsc ✓ · smoke **1718/0** (K270a–d neu; K125f/K266d auf 90/32 nachgezogen) ·
  interaktiv 709/0 · audit 0 strukturell · build ✓. Keine Gate-Abschwächung, kein Löschen/Umbenennen.

## R176 — C3 Redemittel-Bank nach Prüfungsteilen — abgeschlossen ✅

Funktionale Ausdrucksbank `content/redemittel.json` mit 115 Phrasen in 11 Funktionen (Meinung, Begründung, Widerspruch, Beschwerde …), niveaugestaffelt A2–B2, jede mit Vollsatz-Beispiel und arabischer Übersetzung, getaggt auf die fünf Prüfungsteile Sprechen 1/2/3, Schreiben-Forum und Schreiben-Brief (Abdeckung 15/29/57/44/23, Gate K269a). `lib/redemittel.ts` wählt deterministisch pro Teil; die neue Station in /ueben bietet Durchblättern mit Filtern plus Abruf-Drill (erst erinnern, dann aufdecken, ehrlich selbst markieren — keine behauptete Autokorrektur). Kontext-Integration wie in der Roadmap versprochen: In der Vorbereitungsphase der Sprechkarten (R174) erscheinen teilpassende Phrasen, in der Schreib-Werkstatt ein aufklappbares Panel passend zum Aufgabenformat (Brief/Forum, R173-Tagging). Fortschritt bleibt sitzungsintern.

**Beleg:** tsc sauber · smoke **1714/0** (neu K269a–c; K257a-Zähler 46→47, K112a-Reihenfolge offen mitgezogen) · interaktiv **709/0** · audit:content null strukturelle Defekte · Build erfolgreich. Autorenskript: `scripts/patches/_rm_bank.py`. Offen in Achse C: C4 (Schreibbank 58→≈90), C2/C5/C6.

### R206 — Pflege in den Alltag verwoben (Owner-Wunsch „nicht als separates Pflege-Lernen spüren“)

✅ erledigt (lokal verifiziert; CI folgt): 26 Pflege-Wörter (vpfl-01…26) als vollwertige Karten in den allgemeinen Gesundheits-/Arbeitsdecks (A2/B1/B2) + 29 Sätze (s-pfl-01…29) im allgemeinen Satzbank → Ankunft in normalen Tagesaufgaben; 24 echte Kollokations-Einträge; 17 dichte Deckungssätze nach K83b, Verknüpfung ohne neue Waisen (K81/K234/K235 grün). Zähler dokumentiert: Vokabeln 3525, Sätze 707, Kollokationen 2215/4876 (K21f/K29f/K49d/K125f/K125g/K126a/K129b/K151/XIX1 nachgezogen, kein Gate abgeschwächt). Pflege-Station = optionale Vertiefung mit ehrlicher Notiz. smoke 1778/0 (neu K298) · interaktiv 732/0 · audit 0 · build ✓.

### R207 — Pflege-Verwebung Runde 2 (+37 Wörter)

✅ erledigt (lokal verifiziert; CI folgt): vpfl-27…63 in allgemeinen Decks (A2 Körper/Station, B1 Symptome/Anatomie/Dienste, B2 Notfall/Doku/Anatomie) → 63/131 Pflege-Wörter im Alltagsfluss; +32 Kollokationen (2247/4940), +13 Deckungssätze s-pfl-30…42 (Sätze 720). Zähler dokumentiert: Vokabeln 3562, eindeutig 3514 (K21d/K21f/K29f/K49d/K125f/K125g/K126a/K129b/K298/XIX1). Station-Notiz: 63 Wörter. smoke 1778/0 · interaktiv 732/0 · audit 0 · build ✓. (R206-CI: `39022756717` success.)

### R208 — Pflege-Verwebung Finale (+28; alle 131 im Alltagsfluss)

✅ erledigt + CI `39024615387` success: vpfl-64…91 (B1 Verben/Adjektive, B2 Klinik-/Krankheitsnamen inkl. aller deutschen Dubletten, B2 Arbeitsverben) → **131/131** Pflege-Wörter auch in allgemeinen Decks; +28 Kollokationen (2275/4996), +10 Sätze s-pfl-43…52 (730). Neu gelernt/verankert: Kollokations-Phrasen global eindeutig (K73d), Adjektive brauchen Antonym (K126d-Schloss 293; Antonyme 269 in K126f). Station-Notiz vollständig. smoke 1778/0 · interaktiv 732/0 · audit 0 · build ✓. (R207-CI: `39023541327` success.)

### R209 — Bettseiten-Sätze in den ersten Tagen

✅ erledigt (CI folgt mit R210): 10 A1-Pflege-Redewendungen als s-pfl-53…62 im allgemeinen Satzbank (740; A1 117), K83b-konform (Stamm-Treffer geprüft, nötigenfalls natürlich erweitert). K131b/K125f/K129b/K298 dokumentiert.

### R210 — Medizin-Simulation 36→72 Items

✅ erledigt (lokal verifiziert; CI folgt): +6 Lesen +6 Hören à 3 Fragen (pf-l7…l12, pf-h7…h12), 90-Minuten-Vorschlag, Hinweis ehrlich auf 72 fortgeschrieben; K292 dokumentiert (12/20 → 36/60 → 72/90). smoke 1778/0 · interaktiv 732/0 · audit 0 · build ✓.

### R211–R214 — Lücken des ausführlichen Leitfadens geschlossen

✅ erledigt (lokal verifiziert; CI folgt): R211 Doku-Leiter: `stufe` an allen 11 Modellen + pf-w9 (A1 Stichworte) / pf-w10 (A2 Sätze) / pf-w11 (B2 Passiv-Bericht), Anzeige sortiert mit Level-Chip. R212: +2 A2-Dialoge (pf-g9/g10) → 10 Stationsdialoge. R213: Pflegedokumentation + Patientenakte als Karten (133) und verwoben (vpfl-92/93, s-pfl-63) — 133/133 im Alltag. R214: Phrase «Bitte legen Sie sich hin» (11) + s-pfl-64 verwoben. Zähler: Vokabeln 3592, Sätze 742, Kollokationen 2277/5000 (K290a/K297/K298/K299/K131b u. a. dokumentiert). smoke 1779/0 · interaktiv 732/0 · audit 0 · build ✓.

### R215–R217 — Restpläne produziert (Simulation, Wissen, Schreiben)

✅ erledigt (lokal verifiziert; CI folgt): R215 getimte Schreib-/Sprech-Simulation in der Pflege-Station (4+4, Selbstvergleich, ehrlich ohne Automatik; K301). R216 Fachwissen 20→40 (K296a). R217 Schreibbank 90→100 (B1 27/B2 28, Muster im Band; K85b/K125f/K260c/K266d/K271c dokumentiert). smoke 1780/0 · interaktiv 732/0 · audit 0 · build ✓.

### R218–R220 — Vollprüfung, C1-Pfad, Diktat-Stimme

✅ erledigt (lokal verifiziert; CI folgt): R218 komplette 4-Fertigkeiten-Sitzung mit Gesamttimer + Sammelergebnis als Station `vollpruefung` (K302, CV1/2; K112 dokumentiert). R219 C1: 12 Texte + 8 Dialoge, «مسار C1 مصغّر» (K271a/d). R220: 10 Bettseiten-Sätze mit echten MP3s (voice-06; Diktat 190, Audio 529; Rest 54 verwobene Sätze offen deklariert). smoke 1781/0 · interaktiv 734/0 · audit 0 · build ✓.

### R221 — C1 entfernt (Besitzer-Entscheid)

❌ C1 komplett gestrichen: Vertiefungs-Bank/Komponente/Station/Loader weg, Pfad endet bei B2, K303 blockiert Wiederauftauchen. smoke 1778/0 · interaktiv 734/0 · audit 0 · build ✓ (Details: docs/qualitaet.md «R221»).
- R222: Diktat-Stimme Charge 2 — s-pfl-01…10 aufgenommen (20/64 verwoben), Diktat 200, Audio 539.
- R223: Diktat-Stimme Charge 3 — s-pfl-11…20 aufgenommen (30/64 verwoben), Diktat 210, Audio 549.
- R224: Diktat-Stimme Charge 4 — s-pfl-21…30 aufgenommen (40/64 verwoben), Diktat 220, Audio 559.
- R225: Diktat-Stimme Charge 5 — s-pfl-31…40 aufgenommen (50/64 verwoben), Diktat 230, Audio 569.
- R226: Diktat-Stimme Charge 6 — s-pfl-41…50 aufgenommen (60/64 verwoben), Diktat 240, Audio 579.
