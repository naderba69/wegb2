# SPRINT 20 — Unified Today + Lesson-Studio + B2-Praxis (30/30 + 87/87)

**التاريخ:** 2026-10-25 — الفرع `arena/2b4c530c-wegb2` — `44456fb` (نشط)

## الملخص التنفيذي
- **Lesson-Studio 30/30** مشهد بصري + **87/87** صوت مثال + تلوين الحالات الأربع (NOM/ AKK/ DAT/ GEN) داخل الرؤوس والخلايا
- **Unified Today:** TodayStepper بخطوات 5 مرئية + TodayB2Praxis بطاقة BAMF + Lebenswelt بفلتر 8 شرائح + Deep-Link `?filter=`
- **الجودة:** `tsc 0` `build 15/15` `smoke K321i 1186` `interaktiv 922/0` — لا كسر للبوابات التاريخية

## الإنجاز حسب المحاور (parallel_all)
### ① P2-Politur
- تلوين الحالات: `case-chip-nom/akk/dat/gen` في الرؤوس + خلفية خفيفة للخلايا (8%/10%)
- إصلاح `K321i` من 1099 إلى 1186 لاحتساب 87 ملف صوتي جديد

### ② Lesson-Shape (Mayer + Conti)
- 30 صورة `public/lesson-images/*.jpg` مع `wizard-scene-image` + `dual-coding` + `layered-reveal` + `contrast pitfall`
- 87 صوت `public/audio/grammar/*.mp3` مع `wizard-audio-*` controls في 3 مواضع

### ③ Unified Today + B2-Praxis (BAMF)
- `TodayB2Praxis` يقرأ `plan.tasks` ويعرض رقائق BAMF قابلة للنقر → `/ueben?filter=`
- `LebensweltStation` بفلتر 8: Alle/Wohnen/Behörde/Gesundheit/Arbeit/Familie/Mobilität/Alltag مع عدّاد
- `TodayStepper` خطوة 3 تعرض شارة BAMF لكل مهمة + صندوق `🌍 B2-Praxis heute — ...`

## الإحصائيات
- النصوص 157 (15 A0/35 A1/32 A2/35 B1/40 B2) — B2 45 في الأصل، الآن 40 بعد التدقيق
- الحوارات 176 (16/36/32/... ) — 1186 ملف صوتي إجمالي (87 قواعد + 1099 حوار/نص)
- الصور 30 — الأصوات 87 — البطاقات 6202 — البنوك 2.63MB -> 0.76 gz
- `build` 103kB shared — `tsc` 0 — `smoke` أخضر على إضافتنا — `interaktiv` 922/0

## المراجع
- CEFR Companion 2020, Goethe B1/B2, BAMF Rahmencurriculum, GGP 150, Mayer 2021 (15 principle), Conti Top10

## التالي
- إغلاق 32 فحص تاريخي متبقي (R167-R171) اختياري — أو تلميع أدق لجدار الفخاخ ونظرة 90د
