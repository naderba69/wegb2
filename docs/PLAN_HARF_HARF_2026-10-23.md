# خطة المراجعة حرف حرف — كل المحتوى بمراجعه (2026-10-23)
> **المبدأ:** لا عينات — كل حرف يُفتح ويُطابق بمرجع معتمد. المعلم الخبير يأطر كل خطوة منهجياً.

## المراجع المعتمدة (لكل محور)
| المحور | المرجع الأساسي | ملفنا | التحقق |
|--------|----------------|-------|--------|
| **M1 المفردات** | Goethe Wortliste A1-A2-B1 + Duden + Frequency | `vocab.json` 6200 | تطابق مستوى CEFR + تهجئة + مقال/جمع |
| **M2 القواعد** | GGP 150 + Profile Deutsch + Duden Grammatik | `grammar.json` 87 | كل قاعدة تطابق GGP + مثال + فخ |
| **M3 النصوص** | CEFR Lesen descriptors + Goethe Modelltest B1/B2 | `texts.json` 157 | طول CEFR + أسئلة تأويلية |
| **M4 الحوارات** | Goethe Hören Prüfungsformat 4 Teile | `dialogues.json` 176 | تغطية الأنواع + Hören-Modus |
| **M5 الكتابة** | Goethe Schreiben 60/75 د | `writing.json` 105 | معيار + نموذج |
| **M6 الخطة** | CEFR Stunden + GGP توزيع | `lib/plan.ts` 378 يوم | 643.8h في النطاق 450-600 |

## المسارات الثلاثة المتوازية
### مسار 1 — القواعد أولاً (اخترتَه) ✅ منجز P0=0
- سكربت `audit_harf_grammar.mjs` يفحص 87 درس حرفاً
- **النتيجة الآن:** P0 0 · P1 0 (بعد إصلاح 6 GGP + 2 pitfalls) · P2 147 أسلوبي (غالباً إيجابي) · أفكار 67
- ملف: `docs/AUDIT_HARF_GRAMMAR_2026-10-23.md`

### مسار 2 — المفردات (~6200) ⏳ قادم
- سكربت `audit_harf_vocab.mjs`:
  - هل كل `article/plural` يطابق Duden؟
  - هل `level` يطابق Goethe-Liste (93 كلمة A1 ناقصة سابقاً — نتحقق الآن)؟
  - هل `exampleDe` تحتوي الكلمة نفسها؟

### مسار 3 — النصوص/الحوارات/الكتابة (157+176+105) ⏳ قادم
- سكربت `audit_harf_content.mjs`:
  - طول CEFR حقيقي (A1 35-50w → B2 220-420w)
  - أسئلة global/selektiv/detailliert تغطية 100%

## سجل الأفكار 1000 (المعلم المنهجي)
| الفئة | عدد الأفكار | مثال |
|-------|------------|------|
| بيداغوجية (Conti/Mayer) | 250 | Spaced Retrieval, Interaction+Feedback |
| لغوية (GGP/Kollok) | 300 | Wortbildung, N-Deklination, Nominalstil |
| ثقافية (Rahmencurriculum) | 200 | Ausländerbehörde, Kita, Arbeitsvertrag |
| تقنية (Performance) | 250 | banks 2.53M, TodayStepper, GGP-Filter |
> كل فكرة تسجّل حتى لو 1000 — لا نحذف، نُصنف ونُرتب sprints كما في `BUILD_UNIFIED_TODAY`.

## البوابات الثابتة
- **بعد كل إصلاح:** `tsc 0 · build 15/15 · smoke 1916/0 · interaktiv 922/0 · audit:content 0` — إن سقطت بوابة، الإصلاح لم يكتمل
- **لا دمج قبل 0 P0** — قاعدة ذهبية أكاديمية

## التقدم الآن
- [x] خطة حكمّة + أدوات
- [x] مراجعة القواعد حرف حرف (P0 0)
- [ ] مراجعة المفردات حرف حرف
- [ ] مراجعة النصوص/الحوارات حرف حرف
- [ ] سجل 1000 فكرة مصنف
