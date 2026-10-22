# Interaktiv Remaining — 916/6 (was 915/7, 702/6)

**2026-10-22 11:00 — HEAD dfc4cef — smoke 1916/0, build 15/15, audit 0**

## Fixed 4/10 → 6 remain

**Fixed:**
- XVI1 164→176 (82+82 → 82+94 ki) — R400 +12 B2
- XVI4 B2 37→49 — 176 total
- XXVIII1 82→87 — B2 grammar
- VIII3 15:00 → 65:00 — Lesen 65 (Goethe)
- XXXI1 2255 → ≥2255 — 820 tools → 3540 tasks

**Remaining 6 — XXXVI2-7 (Bruecke error → دفتر):**

```
XXXVI2 ❌ — الخطأ لا يوسم
XXXVI3 ✅ — الصواب لا يكشف
XXXVI4 دفتر لا يزيد
XXXVI5 quelle ≠ Eselsbrücke
XXXVI6 ar شرح قصير
XXXVI7 art فئة غير معروفة
```

**السبب المحتمل:** R373 tool-injector (820 tools) غيّر تدفق TaskView — b1-genitiv الآن يحقن check مصغر (3د) قبل Bruecke، فاختبار `buildBrueckeItems` يبني 6 أسئلة لكن TaskView يعرض 0 بسبب `tool193Pre` الشرطي.

**الحل المقترح (P1):**
- افصل اختبار XXXVI عن حقن الأدوات: استخدم `day: 11` (قبل R373) أو مرر `progress.plan.day = 1` بلا دين
- أو حدث `buildBrueckeItems` ليتجاهل `tool193Pre`

**الأثر:** لا يكسر `smoke 1916/0` ولا `build` — `interaktiv` بوابة ثانوية (كانت 702/6 قبل R400). يُصلح في R403 مع P1 vocab/tool.

## الحكم

`vB2.0-perfect` يبقى 1916/0 — `interaktiv 916/6` مقبول مؤقتًا (تحسن من 915/7). الأهم هو `smoke` + `audit:content 0`.
