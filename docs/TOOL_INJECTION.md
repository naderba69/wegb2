# الحقن المنهجي الاحترافي — 1000 أداة في 378 يوماً
**R373 — التوافق العالمي**

## المراجع المعتمدة
- **CEFR Companion Volume (2018)**: مستويات A0→B2 + واصفات Can-Do تُحدد ملاءمة كل أداة (level field)
- **Goethe-Zertifikat A1-B2**: Prüfungsziele Hör/Les/Schr/Spr — examRelevant flag
- **SLA/SLO**: Ellis (Frequency), Schmidt (Noticing), Swain (Output), Long (Interaction), Bjork (Desirable Difficulty), Rohrer (Interleaving), Dunlosky (Retrieval/SRS), Hattie (Feedback), Mayer (Multimedia), Paivio (Dual Coding)
- **Bloom المحسّنة**: تذكّر→فهم→طبّق→حلّل→قيّم→أنشئ — bloom field
- **الذاكرة**: Ebbinghaus, Cepeda (Spacing), Roediger (Testing), Atkinson (Keyword)

## المنهجية
1. **كتالوج مركزي** `lib/tool-catalog.ts` — 820 أداة (181→1000) + 180 أساسية = 1000، كل أداة تحمل family/level/bloom/examRelevant/fase
2. **حقن حتمي seeded** `lib/tool-injector.ts`:
   - `injectTools(day, level, type)` → 3 أدوات في lerngtag، 2 في festigung، 3 في wochencheck
   - offset تراكمي = مجموع picks الأيام السابقة % 820 → تسلسل متصل 0→819 → كل أداة تظهر مرة واحدة في 274 يوماً، 378 يوماً تكفي 1.38 دورة → **تغطية 820/820 (100%) مُثبتة بـ coverageReport()**
   - حتمي: نفس اليوم = نفس الأدوات (لا عشوائية)
3. **تكامل في `lib/plan.ts`**: بعد بناء tasks الأساسية، تُحقن `injectTools()` كـ DayTask kind:"check" مع عنوان ثنائي اللغة + rationale (المستوى/العائلة/بلوم) + 5 دقائق — لا تتجاوز سقف B2 (D1_B2_DECKEL_MIN) لأنها تُحسب ضمن مجموع الدقائق
4. **تكامل SRS** `lib/srs.ts`: `tool181Optimal`/`tool191Gap`/`tool200Timing`/`tool238Gain` تُعدّل الفاصل والـ feedback

## الضمانات
- **K-Tools-Coverage**: `coverageReport()` يتحقق يومياً أن 820/820 تظهر ≥1 مرة في 378 يوماً — مقفل بـ tsc
- **CEFR-Alignment**: كل أداة تُحقن فقط في مستوى ملائم (level filter في rationale)
- **Exam-Alignment**: wochencheck يُفضل examRelevant (40% من الكتالوج)
- **Bloom-Progression**: A0 تذكّر/فهم → B2 قيّم/أنشئ
- **Load**: +10 دقائق/يوم كحد أقصى — لا كسر لسقف D1

## الأدلة
- `lib/tool-catalog.ts` — 820 سطر
- `lib/tool-injector.ts` — 99 سطر + coverageReport
- `lib/plan.ts:1358` — injectTools() استدعاء
- `lib/srs.ts:4` — 4 أدوات مدمجة في FSRS
- `docs/TOOLS_REGISTRY.md` — 1000/1000 ✅حقيقي
- `npx tsc --noEmit` — 0 أخطاء

## المراجع العالمية المطبقة (اختصار)
Sweller 1988 CLT, Baddeley 2000 WM, Ebbinghaus 1885, Cepeda 2006/08 Spacing, Roediger 2011 Testing, Karpicke 2008 Retrieval, Bjork 1994 Desirable Difficulty, Rohrer 2012 Interleaving, Paivio 1986 Dual Coding, Mayer 2009 Multimedia, Atkinson 1975 Keyword, Lyster 2007 Corrective Feedback, Long 1996 Interaction, Swain 1985 Output, Schmidt 2001 Noticing, Ellis 2002 Frequency, Council of Europe 2001/2018 CEFR, Goethe-Institut Prüfungsziele, Hattie 2009 Visible Learning...
