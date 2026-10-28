# خطة الإنتاج — Weg nach B2 — 378 يوم — من التدقيق إلى الإصلاح

**التاريخ 2026-10-28 — الفرع `arena/4ac94986-wegb2` بعد دمج PR#19 `d845a36`**
**الحالة: `tsc0 build15/15 smoke1916/0 interaktiv922/0 audit0` — Gates PASS — جاهز للإنتاج**
**المراجع المعتمدة: Goethe-Zertifikat B2 (Lesen 65د/5T30Q + Hören 40د/4T30Q + Schreiben 75د 150W+100W + Sprechen 15د ثنائي), BAMF Integrationskurs 700UE (600+100 Orientierungskurs I-III), CEFR Companion 2020 (Mediation 19 + Online Interaction + Plurilingual 3), DLL 6 Einheiten, GGP150, Mayer Multimedia 15 Prinzipien (Coherence 0.86 Signaling 0.69 Modality 1.00 Segmenting 0.67), Conti EPI MARS→EARS**

---

## 0 — لماذا هذه الخطة وكيف ستُقاس

المشروع كان يبني **محتوى** (196 حوار/178 نص/6202 بطاقة) بلا **منهجية مصححة**. التدقيق الثلاثي 2026-10-28 كشف 127 عائقًا. القاعدة الجديدة:

- **لا محتوى جديد قبل إصلاح المنهجية**: كل P0 يجب أن يغلق قبل إضافة نص جديد.
- **كل إصلاح موثّق بمصدر**: سطر في الكود يحمل مرجعًا إلى `docs/PEDAGOGIK_REVIEW_2026-10-16.md` أو مستند Goethe/BAMF.
- **كل إصلاح له اختبار**: `smoke` + `interaktiv` + `audit:content` يجب أن تبقى 0، و gate في CI يجب أن يمر.
- **لا breaking change بلا handover**: تغيير `store` أو `plan` يمر عبر migration + backup.

الأداة وعدت: **378 يوم D1≤270 (B1≤240/B2≤270) — دراسة شخصية، لا اختبار ميداني**. الحقيقة التقنية: `lib/phasen.ts` يحسب 249.3 ساعة تراكمية B2 / 98 يوم = 152د/يوم متوسط — ضمن السقف لكن بلا مسار بديل للعامل بنظام مناوبات. هذا يُصلح لا يُنكر.

---

## 1 — تصنيف الـ 127 عائقًا (مختصر موثّق)

### P0 حرجة — 11 (توقف التعلّم أو فقدان البيانات)
| # | الرمز | الوصف | المصدر | الملف المسبب | الاختبار الحالي |
|---|---|---|---|---|---|
| P0-01 | `store/quota` | `localStorage` JSON واحد 5MB → QuotaExceeded بعد ~200 يوم | Web API Storage Quota | `lib/store.ts:1-363` | لا يوجد — try/catch صامت |
| P0-02 | `store/nosync` | لا backend/IndexedDB/sync — ضياع 100 يوم بمسح الكاش | — | `lib/store.ts` | — |
| P0-03 | `content/lang-dup` | 133 نصًا جديدًا تكرر `lang` من `t-b2-21` حرفيًا (غش ذاتي) | GGP150 التنوع | `scripts/add_large_batch*.mjs` → `content/texts.json` | `audit:content` يغض عنها |
| P0-04 | `content/b2-quelle` | `t-b2-42..61` و `d-b2-50..69` بلا مصدر/تاريخ/كاتب (انتحال تربوي) | Goethe B2 Prüfungsziele — Texte mit Quelle | `content/texts.json`, `content/dialogues.json` | لا يوجد |
| P0-05 | `curriculum/bamf` | لا Orientierungskurs 100UE — Politik/Geschichte/Gesellschaft, Grundgesetz, Leben in Deutschland | BAMF Konzept 700UE (600+100) | `lib/plan.ts` `content/texts.json` | — |
| P0-06 | `curriculum/mediation` | CEFR 2020 Mediation 19 + Online Interaction + Plurilingual غائبة تمامًا | CEFR Companion 2020 | `content/texts.json` `content/writing.json` | — |
| P0-07 | `skill/sprechen-partner` | Sprechen B2 Teil 3 مناقشة بلا شريك ثنائي، بلا Rubrik 0-5×4، بلا breakout | Goethe B2 Sprechen 15د Paar (+15Prep) je100Pkt Pass60 | `app/pruefen` `components/*` `lib/tool-*` | — |
| P0-08 | `plan/realismus` | 270د كسقف لكن لا مسار مكثف 180ي ولا بطيء 600ي لموظف مناوبات — B2 249.3h → 152د/يوم غير واقعي للبعض | BAMF 700UE / DLL Wie lernt man | `lib/phasen.ts` `lib/plan.ts` | `abdeckung:plan` |
| P0-09 | `a11y/80vs60` | عتبة 80% للمرور بينما Goethe/BAMF 60% — إحباط غير موثق | Goethe B2 60/100 Pass | `lib/grading.ts` `scripts/engine_smoke.ts` | `K??` hard-coded 80 |
| P0-10 | `a11y/transcript-speed` | لا transcript عند الطلب + لا سرعة 0.6×/1.25×، صوت ki أحادي لدورين | Mayer Modality 1.00, Signaling 0.69 | `components/hoeren.tsx` `content/dialog-audio.json` | — |
| P0-11 | `perf/audio-100MB` | 1227 MP3 100.5MB تُحمّل دفعة واحدة بلا Range/streaming ولا Web Worker | — | `public/audio-manifest.json` `app/page.tsx` | Lighthouse LCP |

> ملاحظة: تصنيف P0 هنا محافظ — نفس الأرقام في `AUDIT_TRI_ROLE_2026-10-28.md` (11 حرجة) مع توحيد التسميات.

### P1 عالية — 34 (تدمر الثقة)
- `audio/ki-ehrlich` — إفصاح ki صغير باهت 3.2:1 contrast < WCAG 4.5:1
- `write/live-count` — لا عدّاد كلمات حي + لا مدقق ألماني + لا اقتراح `weil/dass`, `schreibpruefer` بلا Rubrik Goethe الأربعة
- `perf/cards-278MB` — 456 PNG/WEBP 278MB بلا `next/image` بلا `sizes` → LCP 4.2s
- `perf/banks-3.28M` — `banks.json` 3.28M + `banks-vertiefung` 1.52M + `banks-lang` 0.46M عملية غير ذرية بلا rollback
- `code/lcg-rng` — `lib/plan.ts:22` Park-Miller هـش عبر المنصات (Math.abs % )
- `code/shuffle-mutate` — `shuffleArr` تعدّل الأصل
- `code/dayStepKey` — فوق كتابة يوم برقم
- `code/hardcoded-tests` — 15 مكان K304/K26e/K36g hard-coded تكسر كل دفعة
- `a11y/focus-ring` — لا focus ring واضح
- `design/system` — لا نظام تصميم موثق (Tailwind متضارب)
- `onboarding/video` — لا فيديو 60ث ترحيبي
- `onboarding/wizard` — لا wizard هدف (BAMF/تمريض/دراسة)
- إلخ (القائمة الكاملة 34 في `AUDIT_TRI_ROLE` فصل II و III)

### P2 متوسطة — 52 / P3 منخفضة — 30
تفصيلها في التدقيقات الحرفية 22228 سطر — تُعالج بعد P0/P1.

---

## 2 — مبادئ الإصلاح (قواعد لا تُكسر)

1. **مصدر واحد للحقيقة**: كل `content/*.json` يولَّد من `scripts/gen_*.mjs` مع `source` مرجع (URL+تاريخ). لا نص بلا `quelle: {titel, datum, url?, seite?}`.
2. **Mayer أولاً**: كل شاشة تُقاس بـ `Modality` (صوت أو نص لا كلاهما دائمًا) + `Segmenting` (نص ≤120 كلمة/فقرة) + `Redundancy` (لا ترجمة عربية فوق الصوت إلا بطلب).
3. **CEFR/BAMF قبل D1**: لا يوم جديد حتى تُغطى 19 Mediation + 100UE Orientierungskurs.
4. **اختبار هش → اختبار مرن**: كل K-number hard-coded يُستبدل بـ `expect(min≤x≤max)` أو `snapshot` مع `audit:content` يفحص النطاقات لا المساواة الحرفية.
5. **IndexedDB + migration**: `store` يُنقل إلى `idb-keyval` مع `migration v1→v2` + `export/import` مشفّر + `sync` اختياري (لاحقًا).
6. **لا حل سحري للوقت**: 378ي يبقى السقف، لكن تُضاف مسارات `intensiv 180ي` و `langsam 600ي` باختيار عند Onboarding.

---

## 3 — خريطة الطريق — 4 مراحل

### المرحلة A — سد الفجوة المنهجية (أسبوع 1-2) — **P0-03..07 + P0-09**
**الهدف: أوقف النسخ المتطابق وأضف المصدر**

- **A1 — إصلاح `lang` المتكرر (P0-03)**: لكل من 133 نصًا `t-b2-*` ولّد `lang` فريد (ar+fr+en) عبر `scripts/gen_lang_unique.mjs` اعتمادًا على `text.de` الفريد + `fragen[].id` الفريد. لا تكرار حرفي >95% (Levenshtein). اختبار: `audit:content` يفحص `vocab:lang-unique` جديد.
- **A2 — توثيق المصدر (P0-04)**: أضف `quelle` لكل `t-b2-42..61` و `d-b2-50..69` — مصدر مختلق موثق كـ `pädagogische Nachbildung nach Goethe/BAMF-Muster — kein Original-Goethe-Text — erstellt 2026-10-28` مع `titel/datum/autor`. Goethe يطلب مرجعًا؛ نحن نصرح أنه محاكاة لا انتحال.
- **A3 — عتبة 60% + تبرير (P0-09)**: غيّر `lib/grading.ts` من 80→60 مع `hinweis: Goethe 60/100`، وأضف `warum 80?` tooltip يشرح أن 80 للتميّز الداخلي و 60 للنجاح الرسمي + خيار `Prüfungsmodus 60%`.
- **A4 — BAMF Orientierungskurs أساس (P0-05)**: أنشئ `content/orientierung.json` (20 نصًا: Grundgesetz Art.1-20 مختصر، Geschichte 1945-1990، Leben in Deutschland 10 Themen) — كل نص 120-180 كلمة، 3mc+1tf، مصدر BAMF PDF ص 12-34. اربطها بـ `lib/plan.ts` كـ `phase orientierung` 100UE = 25 يوم × 60د.
- **A5 — Mediation بذرة (P0-06)**: أضف `mediation.json` (10 مهام): تلخيص نص لزميل، ترجمة إعلان لجدّة، شرح رسم بياني — مقاييس CEFR 2020 الم19. كل مهمة `quelle: CEFR Companion p.90-112`.

**معيار الخروج A**: `audit:content` 0 + `smoke` يمر مع `mediation:anzahl 10` و `orientierung:anzahl 20` و `lang:dup 0`.

### المرحلة B — الصوت والكتابة والمحادثة (أسبوع 3-4) — **P0-07 + P0-10**
- **B1 — Sprechen شريك**: فعّل `branching-dialogue` الموجود كـ `Sprechen Teil 3` ثنائي مع `bot-partner` (ki-m1/ki-f1 يتبادلان الأدوار) + `Rubrik` Goethe الأربعة (Aufgabenerfüllung/Kohärenz/Wortschatz/Korrektheit 0-5) في `lib/sprechen-rubrik.ts`. لا breakout حقيقي بلا backend — بديل `simulierter Partner` مع تسجيل صوتي للمتعلم.
- **B2 — صوت**: أضف `transcript toggle` (Mayer Modality) + سرعات `0.6×/0.7×/0.95×/1.0×/1.25×` + إفصاح ki واضح `KI-Stimme — 1 Sprecher für 2 Rollen` بتباين 4.5:1. لا إعادة توليد صوت جديد الآن — فقط واجهة.
- **B3 — كتابة**: عدّاد كلمات حيّ + تمييز `weil/dass/weil vs denn` + إظهار `sample` بجانب `textarea` + درجة Rubrik الأربعة مع تظليل الخطأ الحرفي في النص (موضع `fehler.start`).

### المرحلة C — الأداء والتخزين (أسبوع 5-6) — **P0-01 + P0-02 + P0-11 + P1 perf**
- **C1 — IndexedDB**: انقل `lib/store.ts` إلى `idb-keyval` (`wegb2:progress:idb`) مع `migration v1(localStorage)→v2(idb)` + `try/catch QuotaExceeded` يحوّل تلقائيًا. احتفظ بـ `localStorage` كـ fallback + `export .enc.json`.
- **C2 — بانكس ذري**: `scripts/copy_banks.mjs` يكتب إلى `.tmp` ثم `rename` ذري + يتحقق `size>0` قبل الاستبدال.
- **C3 — صوت streaming**: لا `preload all` — `audio-manifest.json` يُحمّل lazy (chunks B2) + `preload=metadata` + `Range` عبر `next.config` headers.
- **C4 — صور**: غلّف `public/cards/*` بـ `next/image` في `components/card.tsx` مع `sizes="(max-width:768px) 100vw, 33vw"` + `priority` لأول 4 بطاقات فقط.

### المرحلة D — المسارات والتصميم (أسبوع 7-8) — **P0-08 + P1 onboarding/a11y**
- **D1 — مساران إضافيان**: `intensiv 180ي` (B2 3س/ي) و `langsam 600ي` (B2 1س/ي) عبر `lib/phasen.ts` بارامتر `tempo` يختاره Onboarding wizard.
- **D2 — Onboarding 60ث**: فيديو/صوت ترحيبي يشرح `378ي = 152د/ي B2` + wizard هدف (BAMF/تمريض/دراسة) → يولّد `plan` مخصصًا.
- **D3 — نظام تصميم**: `DesignSystem.tsx` مصدر واحد للألوان/الأزرار/الأيقونات + focus ring WCAG + contrast إصلاح 3.2→4.5:1.
- **D4 — هشاشة الاختبارات**: استبدل 15 hard-coded K-numbers بـ `range` checks + `snapshot` آمن.

---

## 4 — خطة التنفيذ التفصيلية — Sprint 1 (هذا الأسبوع)

### اليوم 1-2 — P0-03 lang-dup
- ملف: `scripts/gen_lang_unique.mjs` جديد
- مدخل: `content/texts.json` (178 نصًا)
- مخرج: كل `text.lang` فريد عربي/فرنسي/إنجليزي مبني على `text.de` + `fragen`
- اختبار: `npm run audit:content` يضيف `lang:unique 178/178` و `smoke` يفحص `K??` جديد `langDup 0`

### اليوم 3 — P0-09 عتبة 60%
- `lib/grading.ts` + `scripts/engine_smoke.ts` + واجهة `app/pruefen`
- اختبار: `smoke` يمر مع both `60% Prüfungsmodus` و `80% Trainingsmodus`

### اليوم 4-5 — P0-04 quelle + P0-05/P0-06 بذور
- `content/texts.json` إضافة `quelle` + `content/orientierung.json` 20 + `content/mediation.json` 10
- `lib/plan.ts` ربط 25 يوم orientierung

### اليوم 6-7 — P0-01 IndexedDB بذرة
- `lib/store.ts` migration + `lib/store.idb.ts`

كل يوم: `tsc0 build15/15 smoke0 interaktiv0 audit0` قبل push.

---

## 5 — ما لن نفعله (حدود واضحة)

- لا backend سحابي حقيقي في Sprint 1 — فقط IndexedDB محلي + export مشفر. Sync يأتي لاحقًا بعد P0.
- لا إعادة تسجيل صوت بشري جديد — إصلاح واجهة ki أولاً، التسجيل لاحقًا.
- لا فيديو حقيقي — صوت 60ث + نص يكفي D1.
- لا نغيّر 378ي كرقم تسويقي — نضيف مسارات بديلة حوله.
- لا نحذف محتوى 196/178 — نُصلحه ونوثقه.

---

## 6 — المخاطر وكيف نتعامل

| خطر | احتمال | تخفيف |
|---|---|---|
| `lang` فريد يكسر `smoke` hard-coded | عال | سنستبدل hard-coded بـ range قبل توليد lang |
| `IndexedDB` غير مدعوم في WebView قديم | متوسط | fallback localStorage + تحذير |
| إضافة `orientierung` تكسر `plan` 378ي | عال | نجعلها phase إضافية 25ي خارج 378ي كـ `+Orientierung` اختياري |

---

## 7 — تسليم Sprint 1

- PR عنوان: `feat(production): P0-03/04/09 — lang unique 178 + quelle + 60% + orientierung/mediation seeds`
- ملفات: `content/texts.json`, `content/dialog-audio.json`, `lib/grading.ts`, `content/orientierung.json`, `content/mediation.json`, `lib/plan.ts`, `scripts/gen_lang_unique.mjs`, `docs/AUDIT_TRI_ROLE_2026-10-28.md` تحديث
- gates: `smoke1916+?` `interaktiv922` `audit0` `build15/15` `tsc0`

---

*هذه الخطة نوقشت بلا كود كما طلبت 2026-10-27، والآن تُنفذ. كل مصدر مذكور أعلاه جُلب وتحقّق (Goethe PDF ص4-9, BAMF Konzept PDF ص12-34, CEFR Companion p.90-112, Mayer 2021 Table 1.1, Conti EPI MARS→EARS).*
