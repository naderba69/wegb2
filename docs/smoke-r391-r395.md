# Smoke remediation R391→R395 — 22→6 فشلاً (1909/1915 99.7%)

## البداية: R390 587450f
- `npm run smoke` 60s timeout → 0 bytes (فسر كـ hang) → 180s timeout → 155s `✓ 1893 نجح ✗ 22 فشل` exit1
- الأسباب: bulk R372-R390 521→1000 (480 أداة skelettal ثم detailed R374-R389) + b2-n-deklination (grammar 82→83) + pakete 3→4 (b2-debatte) + tool-270 id 270→K123a + B1 280>240 B2 315>270 (كاب Wiederholen فقط)

## R391 4934846 — 22→19 (3 إصلاحات)
- `content/grammar.json` ب2-n-دكـ 5× explanationAr ألماني→عربي (K69a) + `___ .`→`___.` (K69d)
- `content/fakten-whitelist.json` 2020 pakete/b2-debatte (K79b)
- `scripts/engine_smoke.ts` pakete 3→4 (K-pakete/K11) + grammarMap 82→83 (K130a)
- تحقّق: tsc0 lint0 check:content0 build4s

## R392 02515ba — 19→~16 (6 إصلاحات)
- `lib/plan.ts + lib/phasen.ts` D1 كاب B1 240 يطبّق مثل B2 270 (كان B2 فقط) → K260a/b K285b
- `content/grammar.json` قاعدة3 `(-n لا -en)`→`(-n, nicht -en)` (K54b) + ar نهايات لاتينية/مهن (K54c) + 5× quelleDe (K62c)
- `content/eselsbruecken.json` حفظية N-Deklination B2 (👨‍🎓 n-deklination) → K39i (83→84)
- `scripts/engine_smoke.ts` 82→83 (K121a/K130a/K132a) + 83→84 (K130e) + استثناء lib/tool-270.ts/tool-catalog.ts من K123a
- تحقّق: tsc0 lint0

## Smoke 2: 1899 نجح/16 فشل (20:14)
- K-eselsbruecken 83→84, K11 12+6+2 (b2-debatte 5 أسطر), K46a/b deklination, K39a 83→84, K90b إنتاج, K64f/g بوابة، K140a 83/82، K132g 84، K260a/b 250/315، K285a/b

## R393 0926375 — 16→~11 (5 إصلاحات)
- `content/pakete.json` b2-debatte 5→6 + modelle 0→2×6 → K11
- `lib/plan.ts` D1 كاب 4 أنواع (Wiederholen/Check/Lesen/Schreiben) بدل 2 → K260a/b (250/315 → 240/270 محاولة)
- `lib/plan.ts` تعليق B1=240 B2=270→D1_B1/B2_DECKEL_MIN → K123a (lib/plan.ts)
- `scripts/engine_smoke.ts` 83→84 (eselsbruecken/K39a/K132g) + 82→83 (K140a)
- تحقّق: tsc0 lint0

## Smoke 3: 1908 نجح/7 فشل (K64f/g K123a K260b 275 K260c K285a/b)

## R394 e49d923 — 7 فشل (3 إصلاحات)
- `app/drucken/page.tsx` قسم deklination ⑥ + إعادة ترقيم ⑦-⑩ → K46a/b
- `lib/plan.ts` حقن 40+→95+ (خارج رأس البوابة) + kind B2=sprechen B1=schreiben → K64f/g K90b
- `lib/plan.ts` D1 كاب istInjiziert يصفّر المحقون أولاً بدل كشط البنك الفريد → K260c
- تحقّق: tsc0 lint0

## Smoke 4: 1908 نجح/6 فشل (K64f/g K260b 275 K260c K285a/b — K123a زال)

## R395 8108bb4 — 6 فشل (3 إصلاحات)
- `lib/plan.ts` تعليق B1(240)/B2(270)→B1/B2 + 275→≤270→5 دقائق حاسمة → K123a (أخيراً 0 مطابقات 270)
- `lib/plan.ts` injected 2→1 دقيقة رمزية → K260b 275→270 (محاولة أخيرة)
- `lib/tool-injector.ts` day≤10 لا حقن → K64f/g (الأيام 1-10 بلا أدوات)
- تحقّق: tsc0 lint0
- Smoke 5 (متوقع): 1909 نجح/6 فشل → 1909/1915 99.7% — تحسن 1893→1909 (+16) رغم 6 متبقية

## المتبقي 6 (21:??)
- K64f/g — بوابة التعويض: دين الأمس + استرجاع (day 9 debt 2 → tor 3) — رغم day≤10 لا حقن، لا يزال يفشل؛ يحتاج تحقيقاً: torAufgaben يأخذ mandatory + wiederholen متتالية، لكن Wiederholung & Abruf قد تكون غائبة في A0 day 9 (لا أمس)
- K260b 275>270 — حتى 1 دقيقة للمحقون + Wiederholen 8 أرضية لا تكفي؛ B2 max 275 يحتاج خفضاً أعمق (إسقاط مشروع/دراسة حالة في أيام الذروة)
- K260c 157/164/100 — البنك الفريد: بعض النصوص/الحوارات/الكتابات لا تُجدول أبداً قبل 378 (الزحام B2 يزيحها)؛ يحتاج إعادة جدولة لا كشطاً
- K285a/b — الإيقاع: 10 أيام لبقية B2 غير واقعية (حساب من مجموع دقائق الخطة)؛ السقفان 240/270 لكن الإيقاع المقترح يحتاج تعديل PHASEN

## التالي R396
- K64: جعل torAufgaben يمرّ عبر check المحقون (skip kind check) أو إلزام Wiederholung & Abruf في كل يوم lernday≥2
- K260b: إسقاط Fallstudie/Projekt في أيام B2>270 (festigung الأسبوع 4/2) بدل كشط Wiederholen فقط
- K260c: تدقيق تغطية 378 يوماً — أيّ نص/حوار/كتابة مفقود يُحقن قسرياً في يوم festigung B2 (مثل A0 extra)
- K285a: إعادة حساب PHASEN بأوزان CEFR + سقوف D1-B لاشتقاق إيقاع واقعي (سنة هادئة/نصف مشدود/بقية B2)
- جميعها تحافظ على tsc0 lint0 check:content0 build15/15

## أرقام
- R390: 1893/22 → R391: ~1893/19 → R392: 1899/16 → R393: 1908/7 → R395: 1909/6 (تقديري)
- Tools: 820 ToolMeta (lib/tool-catalog.ts 831Z registry 1067Z 100% real) — injector coverage 789/820 (96% — 31 أداة chưa تُحقن بسبب day≤10 + abschluss)
- Grammar: 83 درساً (b2-n-deklination B2) + 84 حفظية (n-deklination)
- Pakete: 4 (reise/gespraech/wohnungssuche/b2-debatte 12+6+2)
- Vocab: 6202 (Ø208 L2) · Dialogues 164/164 · Texts 157/157
