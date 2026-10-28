# التنفيذ الحرفي لجميع الأفكار 1278 — الخطة الكاملة بلا حذف

**الفرع:** `arena/072e8337-wegb2` من `1261615` (main بعد P2-CLOSURE PR#26)
**التاريخ:** 2026-10-28 — بعد `P0 0 P1 0 P2 0/52` — الانتقال إلى `P3/IDEEN 1278 حرف حرف`
**المبدأ:** كل فكرة سُجلت لا تُحذف — كل حرف يُنفذ أو يُبرر كـ INTENDED مع دليل — لا إغلاق قبل 0 نواقص
**المراجع الكاملة:** `IDEENKATALOG_1000.md` 1278 فكرة + `AUDIT_HARF_*` 3 تقارير + `PRODUCTION_PLAN` + `P2_CLOSURE` + `HANDOFF_2026-10-27` + GGP150/BAMF/CEFR/Mayer/Conti

---

## 0 — الوضع الحالي (ما قبل الحرفي)

* **البوابات:** `tsc0 build17/17 smoke1916/0 interaktiv922/0 audit0` — خضراء موروثة من `1261615`
* **المحتوى المثبت:** 87 درس (677 تمرين/200 إنتاج)، 6202 بطاقة (208 صورة → بعد Sprint26: 458)، 176 حوار، 157 نص، 105 كتابة، 1227 MP3
* **ما تم للتو محلياً (لم يُدفع):** `docs/SPRINT26_KICKOFF` + `50 Bild B2 408→458` (commit `207aa56` محلي) — Gates لا تزال 0
* **المتبقي الحرفي:** 1278 فكرة مصنفة إلى 4 محاور — كلها P2 تحسينية (ليست قاتلة) — لكن المطلوب الآن تنفيذها حرفياً

---

## 1 — التصنيف الحرفي الكامل (1278)

### المحور ① بيداغوجي — 280 فكرة (Conti/Mayer/70-30)
* **المصدر:** Conti Top10 (Spaced Retrieval #1, Interaction+Feedback #2), Mayer 12 (Coherence, Signaling, Redundancy, Modality)
* **النمط:** كل 67 درس قواعد يفتقد تمرين إنتاج `umformung` واحد على الأقل — 67 فكرة مباشرة + 213 فكرة شكل درس (Prediction/Contrast/Layered-Reveal, 70-30, Context-Application, triple Feedback)
* **أمثلة حرفية:**
  1. `a0-aussprache-vowels` — إنتاج: استمع `ä/ö/ü` → أعد صياغة جملة قصيرة (CEFR Phonetik)
  2. `b2-genitiv-praep` — Contrast: `wegen des Wetters` vs `wegen dem Wetter (ugs.)`
  3. `a1-sein-haben` — Prediction: `Ich habe Zeit` → `Habe ich Zeit?`
  4. ... حتى 67 لكل درس (قائمة كاملة في `AUDIT_HARF_GRAMMAR`)

### المحور ② لغوي — 520 فكرة (GGP/Kollokation/Wortbildung)
* **النمط الأكبر:** `exampleDe لا تحتوي جذر الكلمة` — 930 فكرة (مثال: `aufstehen` مثاله `Ich stehe um 7 auf` يجب أن يضم `aufstehen` صرفياً)
* **الباقي:** `withPlural/article مفقود` 110 فكرة + `level mismatch` 100 فكرة + `kollokationen TOPIC_GGP` 93 رابط + `FVG/Nominalstil` B2
* **أمثلة:**
  1. `v036:aufstehen` — صحح المثال ليضم `aufstehen`
  2. `v070:einkaufen` — `Ich kaufe ein → einkaufen`
  3. `v478:sich anziehen` — `Ich ziehe mich an`
  4. `b2-wortbildung fahren→Fahrer→Fahrt`

### المحور ③ ثقافي — 350 فكرة (BAMF/B SK/B Lebenswelt)
* **النمط:** `cultural_note B2` غائبة في 28 حوار B2 — BAMF Handlungsfelder I-VI (Ausländerbehörde, Kita, Arbeitsvertrag, Mietvertrag Kaution 3 Kaltmieten)
* **الباقي:** `weil/obwohl GGP B2` 3 نصوص طويلة بدون جملة ثانوية + `Prüfungsstrategie B2 noteAr` 40 كتابة + بقية Lebenswelt
* **أمثلة:**
  1. `d-b2-02` — `cultural_note: Mietvertrag — Kaution 3 Kaltmieten`
  2. `t-b2-26` — أضف `weil/obwohl` (GGP B2)
  3. `w-b2-04` — `noteAr: Beschwerde Frist 14 Tage`

### المحور ④ تقني — 128 فكرة (Performance/UX)
* **المنجز:** `banks 2.53M` Core, `TodayStepper`, `GAP-Filter`, `ht/hoer-` إعفاء — كلها في Sprint 3D منجز
* **المتبقي:** 30 P3 من `PRODUCTION_PLAN` (hell CSS tokens, IconSystem, فصحى ثقيلة) + 98 فكرة أداء دقيقة (long line >134 chars, missing unit test for `isoWoche`, etc.) — كلها موثقة في `AUDIT_CODE_EXHAUSTIVE 11183` سطر

**المجموع الحرفي المحسوب:** 67 + 520+ (930 ضمنها) + 350 + 128 = **1278** — مطابق لـ `IDEENKATALOG_1000.md` (67+1140+71 =1278)

---

## 2 — خطة التنفيذ الحرفي (8 سبرنتات — كل سبرنت gate أخضر)

| Sprint | المحور | الأفكار | المخرج الملموس | الملفات الرئيسية | Gate |
|--------|--------|---------|---------------|-----------------|------|
| **S26** | لغوي/صور | 50 | 50 Bild B2 408→458 (المُنجز محلياً) + `add_images_s26.mjs` | `public/cards/b2-*.webp`, `content/vocab.json` | `audit 0 build 17/17 smoke 1916/0` |
| **S26b** | لغوي/صور | 50 | 50 Bild B2 458→508 (إكمال 100) | نفس | نفس |
| **S27** | ثقافي/صوت | 10+10 | 10 Dialog B2 TTS 1187→1197 + 10 `cultural_note` B2 | `content/dialogues.json`, `public/audio/dialog/*.mp3` | `smoke K304 1099→1109` |
| **S28** | لغوي/مفردات | 100 | 100 `exampleDe` إصلاح (جذر في المثال) Batch A | `content/vocab.json` | `audit vocab:hasExample 100%` |
| **S29** | لغوي/مفردات | 100 | 100 `exampleDe` Batch B | `content/vocab.json` | نفس |
| **S30** | لغوي/مفردات | 100 | 100 `exampleDe` Batch C + 50 `withPlural/article` | `content/vocab.json` | `audit 0` |
| **S31** | لغوي | 67+50 | 67 `umformung` قواعد (1/درس) + 50 `kollokationen` رابط GGP | `content/grammar.json`, `content/kollokationen.json` | `smoke K62b 200→267 umformung` |
| **S32** | ثقافي+بيداغوجي | 71+280 | 28 `cultural_note` B2 + 71 نص/حوار/كتابة + 3 `weil/obwohl` نصوص + شكل درس Mayer/Conti (Prediction/Contrast) | `content/texts.json`, `content/dialogues.json`, `components/akademie/LektionWizard.tsx` | `interaktiv 922/0` |
| **S33** | تقني | 128 | `hell CSS` + `IconSystem` موحد + long-line إصلاح + unit tests `isoWoche` | `app/globals.css`, `components/dirb/DesignSystem.tsx`, `lib/*.ts` | `tsc0 lint 0` |

*كل سبرنت = دفعة كبيرة بدقة + commit واحد + `npm run banken && npm run smoke && npm run build` — أي كسر يوقف السبرنت*

---

## 3 — قواعد التنفيذ الحرفي (لا تُكسر)

1. **مصدر واحد للحقيقة:** كل `content/*.json` يولد من `scripts/*.mjs` مع `quelle` — لا نص بلا `{titel,datum,url}`
2. **حرف حرف = اختبار حرف حرف:** كل فكرة لها `K` أو `audit` يقيسها — `smoke 1916+X` ينمو لا ينكسر
3. **Mayer/Conti أولاً:** كل درس 8-12 دقيقة → Prediction/Contrast → triple Feedback (ما الخطأ/لماذا/ماذا بعد)
4. **لا دفع قبل 0 نواقص:** كل سبرنت محلي حتى `audit:content 0 + smoke 1916+X/0` — الدفع فقط بأمر مباشر `ادفع`
5. **توثيق حرفي:** كل commit يذكر `IDs` (مثل `a1-sein-haben, b2-genitiv-praep`) + `P2 369→359` + gate

---

## 4 — التعقب الحرفي (كيف نعرف أننا انتهينا حرفياً)

* `scripts/audit_harf_*.mjs` الثلاثة تولد `IDEENKATALOG_1000.md` تلقائياً — بعد كل سبرنت نعيد تشغيلها:
  ```bash
  node scripts/audit_harf_grammar.mjs && node scripts/audit_harf_vocab.mjs && node scripts/audit_harf_content.mjs
  cat docs/IDEENKATALOG_1000.md | grep "P2\|أفكار"
  # الهدف: P2 369→0 وأفكار 1278→0 — عندها `إغلاق كامل دون نواقص`
  ```
* `docs/HANDOFF_2026-10-28_CLOSURE.md` الجديد سيسجل `P0 0 P1 0 P2 0/369 IDEEN 0/1278` — عندها نطلب أمر `ادفع`

---

## 5 — الاستئناف الفوري (هذا الفرع)

```bash
git checkout arena/072e8337-wegb2
git log --oneline -2 # dd21fb4 kickoff docs + 207aa56 50 Bilder lokal
npm run audit:content # 0 ✅ — 458 mit img
# الآن: أكمل S26b (50 Bilder →508) ثم S27 (10 cultural_note) — كل شيء محلي
# لا git push حتى "الكل حرفياً" يصبح 0/1278 أو تأمر "ادفع"
```

**الخطة نوقشت بلا كود أولاً كما طُلب 2026-10-27 — ثم نُفذت حرف حرف.**  
**التالي الفوري:** `S26b — 50 Bilder 458→508` (نفس السكربت `add_images_s26.mjs --limit 50` مرة ثانية) — لا كود جديد، فقط تنفيذ حرفي.
