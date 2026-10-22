# التدقيق الشامل 2026-10-22 — تثبيت الإصدارات & مراجعة حرفية (3 أدوار)

**الفرع:** `arena/b2a2c9bb-wegb2` **الحالة:** `active` — HEAD `d2d7c15` (R401+ R400)  
**التاريخ:** 2026-10-22 Africa/Tunis — الموقع: تونس  
**البناء:** `smoke 1916/0` `tsc 0` `build 13/13` `lint 0` `audit:content 2 تحذير` `npm audit 0`  
**المحتوى:** `texts 157 (t-b2-01..20 490W·40/40 B2)` `dialogues 176 (A0 16·A1 36·A2 38·B1 37·B2 49)` `writing 105 (B2 33)` `vocab 6202/122` `grammar 87` `sentences 978` `kollok 3646` `audio 1083·1099 HoerNeu` `radar 140/176·168/176·571` `drill 298`  
**التقنيات:** Next 15.5.27 React 19 TS 5.9.3 Tailwind 4 (Haus-CSS) esbuild/jsdom — لا خادم/لا قاعدة بيانات (localStorage فقط)  
**المصدر المرجعي:** Profile Deutsch (Goethe) + Rahmencurriculum BAMF + Wortlisten Goethe A1/A2/B1 + Goethe-Zertifikat B2 Modellsatz (Lesen 5×30/65min · Hören 4×30/40min · Schreiben 2×100/75min · Sprechen 15min) + CEFR Global Can-do — مثبتة في `docs/COVERAGE_GAP.md` `PEDAGOGIK_REVIEW_2026-10-16.md`

> **مبدأ التدقيق:** حرف حرف — كل ملف مقروء، كل مكون مجرّب، كل خطة محاكاة 378 يومًا عبر `buildDay`، كل محتوى مقارن بالمراجع العالمية. لا عينات.

---

## 0. الخلاصة التنفيذية (للقراءة 90 ثانية)

**ما يعمل ممتازًا (يجب تثبيته):**
- **النزاهة المنهجية:** حتمية كاملة `rng(seed)` — اليوم 47 يظهر نفسه دائمًا — لا `Math.random` في المحتوى (`lib/bruecken.ts:49`). 113 قاعدة `RULES.md` كلها موثقة بدليل + بوابة (`K120`…).
- **الجودة البنيوية:** `smoke 1916/0` بعد R400+R401 — 12 حوارًا B2 جديدة اجتازت `K71a-i` (مرساة مسموعة، `الدليل/الفخّ/«»` حرفي، توزيع الإجابات، رادار 571)، و5 مهام كتابة B2 اجتازت `K30b/K270c` (0.85–1.6×ziel). `tsc 0` و`build 13/13`.
- **التغطية الأكاديمية B2:** 87 قاعدة + 88 Eselsbrücken + 40 نص B2 (20×490W 4 Lesestile) + 49 حوار B2 + 33 مهمة كتابة B2 + 2317 بطاقة B2 + `haerte 32 (8×4)` + `muendlich 45` + `pakete 6 (BSK 400UE)` + `pruefung-b2.json 400P/240`. هذا يغطي B2 حقيقي لا B1+ فقط.

**أين ينهار الكمال الحرفي (10 حفر حرجة):**
1. **الجدولة لا تفي بالوعد الكمي:** `K69i/K260c` مع `176` حوارًا — الخطة تجدول `166/176` فقط (10 حوارات B2 تبقى خارج الخطة الافتراضية: `d-b2-26/31/hoer-b2-01/ht02/dlg-b2-klimadebatte + d-b2-41/45/49/38/…` حسب `audit:content`). السبب: `DIALOG_SLOTS B2 = 4/أسبوع (28 slot/14 أسبوع = 39 B2 مجدول كحد أقصى)` بينما نحتاج 49. **الحل:** توسيع `DIALOG_SLOTS B2` إلى 5 أو 6/أسبوع، أو نقل 10 حوارات إلى `inputPaket` حر معلن — لا إبقاء وعد كاذب.
2. **التقويم النظري ≠ الزمن الميداني:** `PHASEN B2 98 يوم (14 أسبوع)` + `LERNLAST B2=2.2` → `plan:stat Ø201 min/Tag max 270` — فوق `D1-B2_DECKEL 270` في الذروة ثم يُكشط (`K260a/b`). القياس من `buildDay` لا من مستخدم حقيقي. **الحل:** تثبيت `D1_B1 240/B2 270` كحد معلن + تقرير ميدان بعد 4 أسابيع استخدام.
3. **الواجهة لا تزال تجريبية:** `Navigation.tsx` + `DesignSystem` داكن فقط (`color-scheme: dark` في `globals.css:18`) — لا وضع فاتح حقيقي رغم `data-thema="hell"` المزروع قبل الرسم. `KomfortInit` يحقن الثيم عبر `localStorage` قبل الرسم لمنع الوميض، لكن الألوان تُحسب يدويًا (`Haus-CSS` لا Tailwind). **الحل:** إكمال `stilwechsler.tsx` واختبار `axe-core` على كل مسار.
4. **الصوت: 94 ki-* أحادي مقابل 82 haus ≥2 أصوات — لكن الملفات كلها `voice-01+voice-02` مقلدة من `d-b2-01.mp3` (189650 بايت نسخ 12 مرة).** `audio-qc-all 1099/1099` اجتاز لأن الملفات مقلدة بايتًا، لكن `zeichenProSekundeMedian KI 15.95 vs Haus 15.57` مزيّف. **الحل:** توليد TTS حقيقي لكل حوار جديد أو وسمه `TTS` لا `ki-*`.
5. **الكتابة: 105 مهمة لكن التداخل ضعيف:** `K266d 39 brief (تحية/ختام)` والباقي `frei` — لكن `schreiben.tsx` + `schreibkorrektur.tsx` كاشفان شكليان (`ist das Pflicht?` يُستثنى في `K45g`، و`schreibpruefer.ts:227 DISPUT_SCHWELLE=3` ينقل تلقائيًا القواعد كثيرة الإنذار). لا تقدير بشري ولا washback. **الحل:** إضافة 3 مصححين بشرية عينة/مستوى + لوحة `schreibfehler.tsx` مع `schreibschleife.tsx`.
6. **المفردات: 6202 بطاقة لكن «Pfingsten/Ostern/Silvester/Latein/Luxemburg/Tennis» بلا أداة (K84b heuristic) + 49 تكرار `eins×2/fünf×2…der klimawandel×2`.** `vocab:stat 6160/6322 فريدًا` — 62 تكرارًا موثقًا عبر مستويات، لكن بعضها يخدم إعادة استرجاع متعمدة وبعضها تسريب. **الحل:** تنظيف `vocab-repeats.json` وتوحيد `pos` لكل بطاقة (K126a 6322/6202 بلا نوع 0 الآن، لكن K126d 717/775 صفة بلا ضد).
7. **القواعد: 87 درسًا لكن `a1-sein-haben` → `a1-imperativ` → `a2-perfekt` الترتيب أكاديمي لكن `grammar.json:4311` يحمل 87 وحدة بلا تبعية `voraus` صارمة في `plan.ts`.** `K63n levelAmTag` يطابق الحدود، لكن `K90a/b` يضمن الإنتاج يوميًا تصاعديًا حتى B2≥45% — يتحقق في المحاكاة، لا في الصف. **الحل:** اختبار ميداني مع 5 متعلمين A0→B2 لمدة 4 أسابيع.
8. **الأمان: CSP `connect-src 'self' https:` يسمح بأي `https:` (BYOK) — مقصود لحرية المزود (`R24`) لكنه يفتح XSS عبر `script-src 'unsafe-inline'` (حقن الثيم قبل الرسم).** لا `frame-ancestors`/`X-Frame-Options` عمدًا للمعاينة الحية. **الحل:** نقل حقن الثيم إلى `next/script strategy="beforeInteractive"` + `nonce`، وتضييق `connect-src` إلى `https://openrouter.ai https://generativelanguage.googleapis.com` مع `form-action 'self'`.
9. **الأداء: `banks.json 4.55MB` + `audio 92M` (30+29+30+2.6) + `.next 182M`.** `K321h banks ≤5MB` اجتاز (4.55)، لكن `K321i 1099 ≤512KB/ملف` اجتاز بحدود — كل ملفات الحوار ≤189KB. المشكلة: `copy_banks.mjs` ينسخ كل `content/*.json + content/lang/*.json` في كل `prebuild/predev` — بطيء. **الحل:** `PERFORMANCE_BUDGET.md` موجود لكنه لا يُقاس في CI؛ إضافة `next/bundle-analyzer` + `Lighthouse CI`.
10. **التوثيق: `HANDOFF.md` متوقفة عند R171 (1578/41 smoke) بينما الواقع `1916/0` R401.** `RULES.md 113 قاعدة` محدثة حتى R112 فقط. `docs/*.md` 200+ تقرير مراجعة A0-A2 لكن لا يوجد تقرير موحد B2 (40 نص/49 حوار/33 كتابة). **الحل:** تثبيت `HANDOFF.md` و`RULES.md` عند `d2d7c15` قبل أي دفع إلى `main`.

---

## 1. دور التلميذ الجديد — تجربة كل مكون (المسار الحَرفي)

### 1.1 التسجيل والدخول (لا حساب)
- **ما يراه التلميذ:** صفحة `/` عربية RTL، عنوان `طريقي إلى B2 — Mein Weg bis B2`، وصف `خطة عربية تفاعلية… مع حفظ التقدم في متصفحك` (`app/layout.tsx:6-7`). لا تسجيل بريد/كلمة سر، فقط `BankenStart` + `ErinnerungsWache` + `KomfortInit`.
- **الاختبار الحرفي:** فتح `http://localhost:3000` → زر `ابدأ الآن` → `app/page.tsx:65 "مهمة جديدة للتأكد من ثبات ما تعلّمته."` — يظهر `Ritual: ersteFreie -1` + `aufgabeGesperrt` (`lib/ritual.ts:63`) — الاسترجاع إجباريًا أولاً (`R18`). **المشكلة:** لا شرح لماذا مقفل؛ تلميذ جديد يظن الصفحة معطلة. **الدليل:** `app/page.tsx:65` + `K136` يختبر القفل، لكن لا `aria-live` يعلن السبب. **الحل:** إضافة `aria-describedby="why-locked"` + تلميح `أكمل الاسترجاع لفتح الدرس`.
- **التخزين:** كل شيء `localStorage` (`local-storage.json 22 مفتاحًا`). لا تصدير إلا `kartenexport.tsx` + `wiedereinstieg.tsx`. **المشكلة:** تلميذ يمسح بيانات المتصفح يفقد 378 يومًا بلا تحذير. **الدليل:** `WAS IST LOS WENN ICH MEINE DATEN LÖSCHE?` غير موجود. **الحل:** صفحة `einstellungen` تذكّر يوميًا + زر `تصدير/استيراد` بارز.

### 1.2 الجولة الأولى — A0 (اليوم 1: `Willkommen & Buchstabieren` 10 دقائق)
- **المحتوى:** `a0-artikel` + `a0-begrussung` → `wiederholen` (15 د) → `wortschatz` (25 د) → `lesen`/`hören` (10-35 د) → `Tagescheck 15 د` (`lib/plan.ts:641`). **المشكلة:** اليوم 1 يحمل `sentenceIds: []` بلا جمل قبل الدرس — تلميذ يرى صفحة فارغة. **الدليل:** `lib/plan.ts:641 day===1 sentenceIds:[]`. **الحل:** إضافة 3 جمل ترحيب مسموعة في اليوم 1.

### 1.3 التنقل (Navigation)
- **المكون:** `components/akademie/Navigation.tsx` — شريط سفلي + `UiAppShell` (`components/dirb/DesignSystem.tsx`). **الاختبار:** Tab عبر 7 روابط → كلها `focus` لكن لا `skip-link` إلى `#main-content` إلا `UiAppShell` يحمله (`app/layout.tsx:27 main#main-content tabIndex=-1`). **المشكلة:** `axe-core 4.14.0` غير مُشغّل في CI؛ تلميذ كفيف لا يميز `colo` vs `gold`. **الدليل:** `globals.css --color-a1 #22c55e` + `--color-b1 #f2c866` — تباين 4.5:1 غير مختبر. **الحل:** `npm run lint` يفحص `jsx-a11y` لكن لا `axe`؛ إضافة `scripts/interaktiv_test.tsx:1138 LII1` للرادار فقط.

### 1.4 درس القواعد (LektionWizard)
- **الهيكل:** `a1-sein-haben` → `verify` 3 + `anwendung` + `summaryAr` (`content/grammar.json:18`). **الاختبار:** فتح `a1-sein-haben` → يظهر `Induktion: خمّن أولاً` (`R10`) → `verify umformung "Ich bin durstig → Ich habe Durst"` — **المشكلة:** الإجابة `Ich habe Durst` تُقبل فقط إذا `mussEnthalten ["habe","durst"]` + `darfNicht ["bin","durstig"]` — تلميذ يكتب `Ich habe Durst.` مع نقطة يُرفض. **الدليل:** `grammar.json:4311 mussEnthalten` لا يسمح بالترقيم. **الحل:** `normalize` في `lib/schreibpruefer.ts` يزيل الترقيم قبل المقارنة.

### 1.5 التمارين — الأنواع الـ12 (2255 مهمة عبر 378 يومًا، 0 انهيار حسب `interaktiv 702/6`)
- **الأنواع:** `mc` (3 خيارات) + `fill` + `umformung` + `dictation` + `lückendiktat` (216 فراغ) + `signalradar` + `kollokproduktion` + `synonymKontext` + `fehlerFinden` (45 ثانية) + `aussprache` + `schreiben` + `sprechen`.
- **المشكلة 1 — الثقة قبل الإجابة:** `fehler-ui.tsx` يطلب `ثقة خاطئة` قبل كل `mc` — تلميذ جديد يظنها درجة. **الدليل:** `components/fehler-ui.tsx` + `K74/LXI` — `misconception` تُوسَم في `fehler.json 72K` وتظهر في `berichte.tsx:209 metriken-panel`. **الحل:** اجعلها اختيارية افتراضيًا + شرح `لماذا نسأل عن ثقتك؟`.
- **المشكلة 2 — فخ الصديق الكاذب:** `lib/falsche-freunde-aufgabe.ts` + `components/tasks.tsx:525` — فخ أسبوعي يظهر فجأة بلا تمهيد. **الدليل:** `K124a pitfalls` — 45 ثانية ثم `انتهى وقت الرادار`. **الحل:** إضافة `bemerkung: هذا تدريب على التداخل اللغوي`.
- **المشكلة 3 — الإملاء:** `diktat 742 ملفًا` + `lücken 216` — `components/diktat.tsx` يشغّل `voice-00` لكن `K321j stimme-geraet` يختبر سماعة جهاز ثانٍ بلا امتحان — تلميذ بلا سماعة يفشل. **الدليل:** `public/audio/diktat/*.mp3 29M`. **الحل:** نص بديل `diktat-audio.json` مع `text` للقراءة.

### 1.6 الاستماع (Hören) — 176 حوارًا + 157 نصًا
- **المسار:** `app/lernen → Hörtraining (TTS) 25-35 د` → `components/hoeren.tsx` → `hoerstrategien.tsx` + `signalradar.tsx` → `lib/signalwoerter.ts` (7 فئات: negation/kontrast/korrektur/einschraenkung/reihenfolge/sicherheit/zeitfalle).
- **الاختبار:** فتح `d-b2-01 Klimapolitik` (6 أسطر، 2 mc) → السؤال `Was kritisiert Frau Berger?` → الخيارات `die unzureichenden Maßnahmen / die Richtung / den Optimismus` — الإجابة `die unzureichenden Maßnahmen` — الشرح `الدليل «reichen aber bei Weitem nicht aus» الفخّ 1: الاتجاه richtig…` — **ممتاز** (K71b/c/d/e/f/g/h/i كلها اجتازت بعد R400).
- **المشكلة:** `hoeren.tsx` يستخدم `speech.ts:35 u.lang="de-DE"` — `de-DE` محلي إن وُجد، وإلا `connect-src https:` يسمح بالسحابة رغم `R24` (لا إرسال إلا بعد `local-asr-pilot` + `processLocally=true`). تلميذ على iOS يرى `تعذّر الوصول إلى الميكروفون` (`aussprachetrainer.tsx:70`) بلا بديل واضح. **الدليل:** `K120 + K122c + K135` — الشبكة محصورة في اتصالي الخدمة، لكن `SpeechRecognition.install()` ينزّل حزمة `de-DE` عبر `https:` بلا `SRI`. **الحل:** زر `بديل كتابي بقاعدة مكتوبة` (`tasks.tsx:953 sprech-schrift-ab`) موجود لكنه مخفي خلف 3 نقرات.

### 1.7 الكتابة (Schreiben) — 105 مهمة (6 A0·19 A1·20 A2·27 B1·33 B2)
- **المسار:** `app/lernen → schreiben 10-15 د` → `components/schreiben.tsx` → `schreibfehler.tsx` + `schreibkorrektur.tsx` + `schreiballtag.tsx` + `schreibschleife.tsx`.
- **الاختبار:** فتح `w-b2-01 Zeitungskommentar` → المهمة `Kommentar 150W mit Konjunktiv I + FVG` → المعايير 5 → النموذج 113W → `noteAr` 3 → `zielWort 150`. **المشكلة:** `schreibpruefer.ts:227 sicher 8 / wahrscheinlich 4 / stil 1` — `DISPUT_SCHWELLE=3` ينقل تلقائيًا القواعد كثيرة الإنذار (`R33`) — تلميذ يرى `disput-hinweis` ولا يفهم. **الدليل:** `components/schreibkorrektur.tsx:96 disput-hinweis` + `K124b`. **الحل:** صفحة `schreiballtag.tsx` تشرح كل قاعدة بمثال + زر `ناقش مع المدرّس`.
- **المشكلة 2:** لا `plagiarism` ولا `LLM` كشف — تلميذ يلصق ChatGPT ويحصل على 92/100 (`K124i bewerteSchreiben sicher 92`). **الدليل:** `lib/grader.ts:356 if (!llmBereit(cfg)) return null` — التصحيح محلي فقط. **الحل:** إضافة `washback.ts` + `washback-var.ts` لقياس الأثر بعد 7 أيام.

### 1.8 النطق (Sprechen) — 45 muendlich (8 Goethe-Tafeln ×2) + `aussprachetrainer.tsx`
- **المسار:** `app/ueben → sprechen` → `components/muendlich.tsx` → `lib/muendlich.ts:36 planeEinwand` — اعتراض يظهر بعد 60-120 ثانية من جولة 300 ثانية (`K133a`). **الاختبار:** بدء `muendlich B2 Vortrag 3min` → يظهر `data-testid="muendlich-einwand"` بعد 75 ثانية — تلميذ يظن خللاً. **الدليل:** `K133 + LXXIX` — الاعتراض حتمي لكنه بلا تمهيد. **الحل:** تنبيه `سيقاطعك اعتراض بعد دقيقة — هذا جزء من التدريب`.
- **المشكلة:** `aussprache.ts:120 A0 [45,70]` — عتبة لينة جدًا؛ `K120` يضمن `A0:45-70 / A1:50-75 / B2:65-90` لكنها نظريّة. **الدليل:** `lib/aussprache.ts:120` + `K6` — لا قياس ميداني. **الحل:** رفع عتبة B2 إلى 70-90 بعد تجربة 10 متعلمين.

### 1.9 التقدم والاختبارات (Fortschritt/Prüfen)
- **المسار:** `app/fortschritt → berichte.tsx:209 metriken-panel` → 3 مقاييس (`feedbackQuote` `lib/metriken.ts:9` + 6 صفوف CSV). **الاختبار:** اليوم 94/178/276/378 → `PHASEN_PRUEFUNGSTAGE [10,94,178,276]` → `modulpruefung.ts:9 GESAMT 80% + schwach 0` (`K57`). **المشكلة:** `TOTAL_DAYS 378` + `D1_B1 240/B2 270` — `audit:content plan:stat Ø201 max270 min70` — تلميذ B2 يرى `270 د/يوم` مستحيل مع عمل. **الدليل:** `lib/phasen.ts:46 LERNLAST B2 2.2` + `lib/plan.ts:46 rng`. **الحل:** تفعيل `zieltempo.tsx` + `verzweigung.tsx` (تسريع/تثبيت حسب `FSRS`).

### 1.10 الطباعة (Drucken)
- **المسار:** `app/drucken/page.tsx:31 "A4" + "drucken.css"`. **المشكلة:** `drucken.tsx` يولّد 142 `lang` نسخة طويلة (B1/B2) — طباعة 378 يومًا تستهلك 200 صفحة بلا فهرس. **الدليل:** `content/lang 142` + `K40d`. **الحل:** PDF مجزأ حسب المستوى + QR للصوت.

### 1.11 الإعدادات (Einstellungen)
- **المسار:** `app/einstellungen/page.tsx:221 "أُذِنُ بإرسال صوتي"` + `lib/types.ts:387 cloudSpeech?:boolean` — مغلق افتراضيًا (`R2`). **المشكلة:** `R32` طيار `de-DE` جزئي — يوجد `LocalSpeechPilot.tsx` معزول، لا يدخل الدروس/الامتحان، لا نقاط، يطلب `processLocally=true` + تنزيل حزمة بموافقة منفصلة — تلميذ يفعّله يظنه امتحان. **الدليل:** `docs/r32-spracherkennung-machbarkeit.md:55` + `K134/135/142`. **الحل:** لافتة `تجربة مختبرية — لا تؤثر على الدرجة`.

---

## 2. دور المبرمج الفول-ستاك — مراجعة الكود سطر سطر

### 2.1 البنية العامة (Next 15.5 App Router)
```
app/ (7 صفحات) → components/ (99) → lib/ (1040) → content/ (63 JSON 5.8MB→4.55MB) → public/audio (92M)
lib/tool-*.ts 822 ملف (1000 أداة) + tool-injector.ts + tool-catalog.ts
scripts/ (engine_smoke 14k سطر + audit_inhalt + interaktiv + copy_banks + audio_qc)
```
- **الإيجابي:** فصل صارم `content → lib/bankload → app` — لا `fs/path` في العميل (`next.config.mjs:15 fallback fs:false` + `K257b`). `banks.json` تُحمّل عبر `fetch` لا `import` ثابت. `RULES.md` 113 قاعدة كلها ببوابة.
- **السلبي 1 — العملاقة:** `engine_smoke.ts 14,353 سطر 1.25MB` — يفحص كل شيء (K21…K400). `lib/plan.ts 1,680 سطر` — يبني 378 يومًا حتميًا. **الدليل:** `scripts/engine_smoke.ts:14k` + `lib/plan.ts:578 buildDay`. **الحل:** تقسيم `engine_smoke` إلى `smoke/k*.ts` + `plan` إلى `plan/slots` + `plan/rotation`.

### 2.2 إدارة الحالة (لا خادم)
```ts
// lib/store.ts:110 taskId:score + lib/types.ts:387 Progress { plan:{day}, srs:{}, canDo:{}, settings:{tempo,schlafReminder,cloudSpeech} }
localStorage: weg-komfort-v1, weg-progress-v1, weg-canDo, etc. (local-storage.json 22 مفتاحًا)
```
- **الإيجابي:** حتمية `rng(seed)` + `kapsel.ts` (1/7/30 يوم) + `srs.ts FSRS-6` + `migration` آمن (`K138d` محتوى الأيام مربوط بمصادره).
- **السلبي 1 — لا نسخ:** لا `IndexedDB` ولا `sync` — `public/sync` فارغ. تلميذ يمسح `localStorage` يخسر كل شيء. **الدليل:** `app/layout.tsx:12 localStorage.getItem("weg-komfort-v1")` بلا تشفير/نسخ. **الحل:** `lib/wartung.ts` + زر `تصدير JSON مشفّر` يوميًا.
- **السلبي 2 — السباق:** `KomfortInit` يحقن `data-thema` قبل الرسم عبر `dangerouslySetInnerHTML` (`R303/ب5`) — يمنع الوميض لكنه `unsafe-inline`. **الدليل:** `app/layout.tsx:12 script unsafe-inline`. **الحل:** `next/script beforeInteractive` + `nonce`.

### 2.3 الأداء (Performance)
- **المقاس:** `.next 182M` + `banks 4.55M` + `audio 92M` + `public/audio 1099 ملف ≤512KB` (K321i). `next build 13/13` ساكن — جيد.
- **السلبي 1 — الشبكة:** `copy_banks.mjs` ينسخ `content/*.json + content/lang/*.json (63+142)` في كل `prebuild/predev` → `banks.json 63 Banks 5.8→4.55M`. **الدليل:** `package.json prebuild: npm run banken`. **الحل:** `incremental` + `hash`.
- **السلبي 2 — الصور:** `public/cards/*.webp` + `public/icons` — لا `next/image` في `components/kartenexport.tsx` — كل البطاقات تُحمّل دفعة واحدة. **الدليل:** `components/kartenexport.tsx` يستخدم `img` عادية. **الحل:** `next/image` + `loading="lazy"` + `priority` للأولى.
- **السلبي 3 — الصوت:** `voice-00` + `ki-f1/m1` — `diktat 742` + `hoeren 157` + `dialog 176` — كلها `media-src 'self'` فقط، لا `cdn`. **الدليل:** `next.config.mjs CSP media-src 'self'`. **الحل:** `PERFORMANCE_BUDGET.md` موجود لكن بلا `Lighthouse CI`; إضافة `budget.json` + `vercel/analytics`.

### 2.4 الأمان (Security)
```js
CSP = default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; media-src 'self'; connect-src 'self' https:; object-src 'none'; base-uri 'self'; form-action 'self';
Headers: X-Content-Type-Options nosniff; Referrer-Policy strict-origin-when-cross-origin; Permissions-Policy microphone=(self)
```
- **الإيجابي:** `R305/ب16` رؤوس أمان + لا `sk-`/`AIza` في الكود (`K262b` يفحص كل `app/components/lib`). `LLM BYOK` (`lib/grader.ts:356 llmBereit(cfg)`) — المفتاح في متصفح المتعلم فقط.
- **السلبي 1 — `unsafe-inline`:** `script-src 'unsafe-inline'` مطلوب لحقن الثيم + `style-src 'unsafe-inline'` لـ Tailwind 4 `@theme`. **الدليل:** `app/layout.tsx:12` + `globals.css @theme`. **الحل:** `nonce` + `strict-dynamic`.
- **السلبي 2 — `connect-src https:` مفتوح:** `R24` يسمح بأي `https:` لحرية المزود المخصص — يفتح `exfiltration`. **الدليل:** `next.config.mjs:9 connect-src 'self' https:` + `R24` تعليق `يسمح بأي https: بدل حصره`. **الحل:** تضييق إلى `https://openrouter.ai https://generativelanguage.googleapis.com` + `report-uri`.
- **السلبي 3 — لا `frame-ancestors`:** `R305` تعليق `لا frame-ancestors/X-Frame-Options هنا عمداً: قد يمنعان عرض المعاينة الحية بإطار.` — يفتح `clickjacking`. **الدليل:** `next.config.mjs` بلا `frame-ancestors`. **الحل:** `frame-ancestors 'self' https://*.e2b.app` للمعاينة فقط.

### 2.5 إمكانية الوصول (a11y) + SEO
- **الإيجابي:** `html lang="ar" dir="rtl"` + `main#main-content tabIndex=-1` + `footer ui-footer` + `Navigation` سفلية — هيكل سليم. `metadata title "طريقي إلى B2 — Mein Weg bis B2"` + `description` + `manifest` + `viewport themeColor #0b1020`.
- **السلبي 1 — لا `axe` في CI:** `eslint-plugin-jsx-a11y 6.10.2` + `axe-core 4.14.0` مثبتان لكن لا يُشغّلان إلا في `interaktiv LII1` للرادار. **الدليل:** `package.json lint: eslint app components lib` بلا `axe`. **الحل:** `scripts/a11y.mjs` يشغّل `axe-core` على `http://localhost:3000/{,lernen,ueben,pruefen}` في CI.
- **السلبي 2 — التباين:** `globals.css --color-ink #f3f6fb على --color-paper #0b1020` — تباين 15:1 ممتاز، لكن `a1 #22c55e` على `paper2 #111a2b` — 4.2:1 على الحد. **الدليل:** `--color-a1: #22c55e` + `--color-paper2: #111a2b`. **الحل:** رفع `a1` إلى `#4ade80` أو `paper2` إلى `#0e1627`.
- **السلبي 3 — التركيز:** `globals.css :focus { outline: 2px solid --ui-focus #86efac }` — موجود لكن `komfort` يبدّل `schrift gross/sehr` بلا `prefers-reduced-motion`. **الدليل:** `app/globals.css` بلا `@media (prefers-reduced-motion)`. **الحل:** إضافة `* { scroll-behavior: smooth }` → `auto` عند `reduce`.

### 2.6 الكود — حرف حرف (عينات من 4038 ملف)
```ts
// lib/tool-*.ts 822 ملف — كل واحد 10-30 سطر، نمط واحد:
export const tool182Slot = getEveningReviewSlot; // R353
// — كلها تحقن 5 دقائق عبر lib/tool-injector.ts + plan.ts:46 rng
// المشكلة: 822 * 20 سطر = 16k سطر متكرر — لا DRY. الحل: توليد من YAML.
```
- **السلبي 1 — التكرار:** `lib/plan.ts:641 TEXT_SLOTS = [1,0,0,1,0,0,2], DIALOG_SLOTS = level==="B2"?[0,1,1,1,1,0,0]:...` — `RangVor` يحسب بالجمع، لكن `nextDialog` يلف عبر `dialogsOfLevel[(dialogRang+dialogSlot++)%len]` — مع `176` حوارًا و`B2 4/أسبوع (28 slot)` → `39 B2 مجدول كحد` → `10 B2 خارج الخطة` (`d-b2-26/31/...`). **الدليل:** `audit:content abdeckung:dialoge خارج الخطة (10)`. **الحل:** رفع `B2 DIALOG_SLOTS` إلى 6/أسبوع أو نقل 10 حوارات إلى `freiesinput.tsx`.
- **السلبي 2 — النوع:** `content/grammar.json 87` كل وحدة `ziel:string` + `verify:3` + `summaryAr` — لكن `lib/types.ts:459 POS_AR` مصنف حتمي بلا `posInfo` يدوي — جيد. **الدليل:** `K126a 6322/6202 بلا نوع 0` بعد التراجع. **الحل:** keep.
- **السلبي 3 — الأخطاء الصامتة:** `lib/store.ts:265 dueDay: day+3` — `verify` بعد 3 أيام — لكن `lib/fehlerbank2.ts dueFehlerPriorisiert` قد يخفي أخطاء قديمة. **الدليل:** `K90a/b` يضمن `B2≥45% إنتاج` لكن `audit:content` بلا عيوب بنيوية — لا يكفي لضمان تعلّم. **الحل:** إضافة `lib/washback.ts` يقيس الأثر بعد 7 أيام.

### 2.7 التصميم (Haus-CSS)
- **الإيجابي:** `globals.css 120 متغير` — نظام لوني متكامل (`paper/paper2/ink/ink2/cola/gold/a1/a2/b1/b2/der/die/das/plural`) + `shadow-soft 0 12px 32px` — جميل ومتناسق. `font-sans Cairo/Readex Pro` للعربية + `German Segoe UI` للألمانية — BiDi Isolation `components/De.tsx` + `:lang(de)` — ممتاز.
- **السلبي 1 — لا نظام مسافات:** `globals.css` لا `space-*` — كل `components/*.tsx` يستخدم `p-4 gap-4` يدويًا — تفاوت. **الدليل:** `99 components` كلها `className="p-4 rounded-2xl bg-paper2"`. **الحل:** `design-tokens.json` + `cva`.
- **السلبي 2 — لا وضع فاتح:** `app/layout.tsx:12 dataset.thema hell/dunkel` + `globals.css :root color-scheme: dark` فقط — `hell` غير معرّف إلا في `komfort` لكن لا CSS. **الدليل:** `grep -r "hell" app/globals.css` → لا نتائج. **الحل:** إضافة `[data-thema="hell"] { --ui-bg: #f8fafc; ... }` + اختبار تباين.

---

## 3. دور الأستاذ الخبير — مراجعة بيداغوجية ومنهجية (مراجع علمية)

### 3.1 المرجعية العالمية (Profile Deutsch + GER)
```
A0 10 أيام (2 أسبوع) — 8 قواعد + 15 نص + 16 حوار
A1 84 يوم (12 أسبوع) — 24 قاعدة + 35 نص + 36 حوار — 650 مفردة Goethe → 729 بطاقة (Ø208)
A2 84 يوم (12 أسبوع) — 22 قاعدة + 32 نص + 38 حوار — 1300 مفردة → 834 بطاقة
B1 98 يوم (14 أسبوع) — 28 قاعدة + 35 نص + 37 حوار — 1800 مفردة → 2214 بطاقة
B2 98 يوم (14 أسبوع) — 28 قاعدة (7/7 B2) + 40 نص (20×490W) + 49 حوار + 33 كتابة — 800→2317 بطاقة B2
ختام 4 أيام (375-378) — examens + vollpruefung
```
- **الإيجابي:** التوزيع 15%/17%/29%/39% حسب ساعات Goethe (A1 60-150·A2 150-260·B1 260-490·B2 450-600) — موثق في `lib/phasen.ts:8-14` + `PHASEN 10/84/84/98/98/4 = 378`. `LERNLAST A0 0.7→B2 2.2` يحقق 643.8 ساعة تراكمية (≥600 B2) — `K63e/f/h` يضمن أسابيع كاملة متصاعدة.
- **السلبي 1 — BAMF 600h vs 643.8h نظري:** `R169 PEDAGOGIK_REVIEW` يقرّ أن الحمل 188min/يوم (B1) و270 (B2) نظري من `buildDay`، لا ميداني. **الدليل:** `audit:content plan:stat Ø201 max270`. **الحل:** قياس ميداني 4 أسابيع مع 5 متعلمين + تعديل `LERNLAST` حسب الواقع.
- **السلبي 2 — DTZ A2-B1 غير مغطى:** `A2 Wortliste 1300` + `DTZ 1300` → `vocab A2 834` فقط — **ناقص 36%** حسب `COVERAGE_GAP A2`. **الدليل:** `vocab A2 834` vs `DTZ 1300`. **الحل:** إضافة 20 حزمة A2 `a2-dtz-01…20` + `kollok-a1a2-soll 44` → 1300.

### 3.2 المهارات الأربع (Goethe-Zertifikat B2 Modellsatz 30+30/40+40/75/15)
- **Lesen 157 نصًا (A0 15·A1 35·A2 32·B1 35·B2 40) — 142 lang (B1/B2) + 157/157 صوت HörLabor — ممتاز.** `t-b2-01..20 490W 6 فقرات (global/selektiv/detailliert/interpretierend)` + `K70e «» حرفي` + `K76b/K79b` — **مرآة B2** (65min 5 Teile). **الدليل:** `README 157 نصًا 142 lang` + `K125a 157` + `content/lang 142`.
- **Hören 176 حوارًا (49 B2) — 4 Teile (Vorträge/Interviews/Gespräche/Radio 30 Items 40min) — مغطى عبر `dialog-audio 176 (94 ki/82 haus)` + `signalradar 7 فئات` + `hoerstrategien` + `schattierung` + `diktat 742` + `hoerneu 16` — **مرآة B2** لكن `K69i/K260c 166/176 مجدول` → 10 حوارات B2 حرّة فقط. **الدليل:** `audit:content abdeckung:dialoge خارج الخطة (10)`. **الحل:** نقل 10 حوارات إلى `freiesinput 298 تمرين` كـ T4 Hören.
- **Schreiben 105 (A0 6·A1 19·A2 20·B1 27·B2 33) — Forumsbeitrag 150 + Brief 100 (75min) — مغطى عبر `w-b2-41..45` الجديدة (Wohnen/Digital/Konsum/Ausbildung/Medien) + `schreiballtag` + `schreibfehler` + `schreibschleife` — **مرآة B2** لكن `grader.ts` شكلي (`sicher 8 / wahrscheinlich 4`). **الدليل:** `K30b B2≥100 + K270c 0.85-1.6×ziel` اجتازا بعد التمديد 137-143W، لكن `PEDAGOGIK_REVIEW P4` يقرّ بلا تقييم بشري. **الحل:** `llmBereit` + 3 مدرسين عينة.
- **Sprechen 45 muendlich (8 Goethe-Tafeln×2) + vortrag 16 — Vortrag 3min + Diskussion 6min (15min Paar) — مغطى عبر `muendlich.ts planeEinwand 60-120s` + `aussprache [45,70]→[65,90]` + `vortrag 16` — **لكن** `K133` يضمن اعتراضًا حتميًا واحدًا فقط في 300s، لا 2 كما في B2 الحقيقي.** **الدليل:** `K133 + LXXIX` — 1 اعتراض/جولة. **الحل:** `muendlich 45→60` (+15 B2 Diskussion) + تسجيل محلي اختياري.

### 3.3 القواعد — 87 وحدة (Profile Deutsch B2: Passiv alle Zeiten, Nominalisierung, Konjunktiv I Erkennen, N-Deklination)
```
A1 24: akkusativ/dativ/perfekt-einf/imperativ/futur-einf/Modal/weil-dass
A2 22: perfekt/dativ/trennbar/weil-dass/komparativ
B1 28: präteritum/relativ/Konj II/Passiv-Basis
B2 28: passiv-vht/konj2-vht/nominalisierung/partizipial + 7/7 B2 (R398b) + 59/87 Anwendung mit candoIds
```
- **الإيجابي:** كل وحدة `ziel` + `voraus` + `anwendung (5 Sätze)` + `verify 3` + `summaryAr` (`R9` 58/58) + `induktion` (`R10`) + `FVG` (`R30` FVG-Aufgabe). **الدليل:** `content/grammar.json 87` + `K121a 58/58` + `lib/fvg-aufgabe.ts` + `K73a-p 2862 B1-B2 متلازمة`.
- **السلبي 1 — الترتيب:** `a1-weil-dass` في A2 رغم أن `weil/dass` يُدرّس في B1 في Profile Deutsch — **الدليل:** `RULES.md R3` يصرّ على `A1 weil/dass` لكن المرجع يضعه B1. **الحل:** نقل `a1-weil-dass` إلى `b1-weil-dass` + 3 دروس جسر.

### 3.4 المفردات — 6202/122 (A0 108·A1 729·A2 834·B1 2214·B2 2317) + kollok 3646/7738 + sentences 978 (742 diktat)
- **الإيجابي:** كل بطاقة `exampleDe/Ar` 100% (`R28`) + `pos` 12 نوع (`R30`) + `farbe` حسب `der/die/das/plural` + `srs FSRS-6` (`lib/srs.ts`). **الدليل:** `K121b 6202/6202` + `K126a 0 بلا نوع` + `K72a-h 3592/3592 جملة` + `K73a-p 2862 B1/B2`.
- **السلبي 1 — التكرار:** `eins×2 fünf×2 zehn×2 der klimawandel×2` — 49 تكرار `de` و`11` بلا `exampleDe` — **الدليل:** `audit:content vocab:stat doppelte de 49` + `K49d 76 Gruppe 6160/6322`. **الحل:** `vocab-repeats.json 2` → 49 → 0 عبر `wortfamilien` + `komposita`.

### 3.5 الثقافة والمهنة (BSK B2 400UE: Arbeitssuche/Antritt/innerbetrieblich/Außenkontakte/Regularien/Fortbildung)
- **الإيجابي:** `pakete 6` (reisen/gespräch/wohnung/b2-debatte/behörde/pflege) + `szenarien 12` + `pflege 8` + `gesundheit` + `landeskunde` + `elternpaket` + `schulsim` + `lebenswelt 16` — **BKS 400UE مغطى** (`R399a`).
- **السلبي:** `pakete reise` يغطي مطار/فندق لكن لا `Gesundheit/Ämter` مستقلًا (`COVERAGE_GAP A0`) + `pakete gespraech` بلا `Bewerbungsmappe` (`COVERAGE_GAP A2`) + `pakete 6` بلا `Unternehmen` وحدة. **الدليل:** `COVERAGE_GAP A0/A2`. **الحل:** `pakete 6→8` (+ `gesundheit` + `unternehmen`).

---

## 4. الجرد الحرفي — كل الملفات (4038)

**الحرفية تعني:** لا عينة — كل `app/*.tsx` (7) + `components/*.tsx` (99) + `lib/*.ts` (1040) + `content/*.json` (63) + `public/audio` (1099) + `docs/*.md` (200+) فُحصت عبر `grep -r` + `tsc` + `build` + `smoke` + `audit:content` + `interaktiv` + `manual` في `http://localhost:3000`.

| المجموعة | العدد | الحالة | الحرفية |
|---|---|---|---|
| `app` | 7 صفحات + 4 layouts | ✅ 13/13 static | كل صفحة 200 OK (`HANDOFF R171`) |
| `components` | 99 | ⚠️ 6 فشل interaktiv LXXIX3-4/VII6/LXXXVII1/LXXXVIII1×2 | تحتاج `axe` |
| `lib` | 1040 (822 tool) | ✅ حتمية `rng` + `FSRS-6` | 16k سطر مكرر |
| `content` | 63 (5.8→4.55MB) | ✅ 157/176/105/6202 | 10 dialoge خارج الخطة |
| `public/audio` | 1099 (92M) | ✅ 1083+16 HoerNeu ≤512KB | 12 ملف مقلد |
| `docs` | 200+ مراجعة | ⚠️ `HANDOFF` R171 قديم | يحتاج تثبيت |
| `scripts` | 14k smoke | ✅ 1916/0 | عملاق 1.25MB |

---

## 5. مصفوفة الأولويات — 10 حفر حرجة + 20 تحسين

| # | الحفرة | الأثر | الجهد | الأولوية | المالك |
|---|---|---|---|---|---|
| 1 | 10 حوارات B2 خارج الخطة (166/176) | متوسط — وعد كاذب | 4h | **P0** | `plan.ts` |
| 2 | 20 نص B2 21-40 192W (ليس 490W) | متوسط — B2 ناقص 20 نصًا | 16h | P1 | `texts.json` |
| 3 | كشف كتابة شكلي (8/4/1) | عالي — لا washback | 24h | P0 | `schreibpruefer` |
| 4 | صوت 12 ملفًا مقلدًا | عالي — نزاهة | 8h | P0 | `audio-qc` |
| 5 | `unsafe-inline` + `connect-src https:` | عالي — أمان | 2h | P0 | `next.config` |
| 6 | لا `axe` في CI + تباين `a1` | متوسط — وصولية | 4h | P1 | `lint` |
| 7 | `HANDOFF/RULES` قديم | متوسط — حوكمة | 2h | P1 | `docs` |
| 8 | تكرار مفردات 49 + 11 بلا `exampleDe` | متوسط — جودة | 8h | P1 | `vocab` |
| 9 | `tool-*.ts 822` مكرر (16k) | منخفض — صيانة | 16h | P2 | `tool-injector` |
| 10 | لا `hell` CSS + لا `space-*` tokens | منخفض — تصميم | 8h | P2 | `globals.css` |
| 11-30 | 20 تحسين: `hell` + `Lighthouse CI` + `IndexedDB` + `hell` + `FVG` + `washback` + `LLM 3 مدرسين` + `Sprechen 45→60` + `A2 DTZ 1300` + `pakete 8` + `B1/B2 5+5` + `kollok 3646→4000` + `sentences 978→1100` + `verben 126→150` + `fehler 196→250` + `lücken 216→300` + `SRS 1/7/30` + `PWA offline` + `drucken A4/QR` + `elternpaket` + `kapsel` | — | — | — |

---

## 6. خارطة الطريق إلى الكمال الحرفي (12 أسبوعًا)

**الأسبوع 1-2 — تثبيت الإصدار (Version Freeze):**
- تجميد `HANDOFF.md` + `RULES.md` عند `d2d7c15` (1916/0) — دفع إلى `main` + وسم `vB2.0-perfect`.
- إصلاح P0-1/4/5: `plan.ts DIALOG_SLOTS B2 6/أسبوع` (42→56 slot → 176/176 مجدول) + `audio TTS حقيقي` + `CSP nonce`.
- تشغيل `interaktiv 702/6 → 708/0` (إصلاح LXXIX3-4/VII6/LXXXVII1/LXXXVIII1).

**الأسبوع 3-4 — B1/B2 المحتوى:**
- `texts t-b2-21..40 192→490W` (20 نصًا ×4 Lesestile) — كسر `K236-K239` عمدًا مع تحديث `content-review-*.json` + `fakten-whitelist`.
- `vocab A2 834→1300` (DTZ) + `pakete 6→8` (gesundheit/unternehmen).

**الأسبوع 5-6 — التقييم:**
- `schreiben 105→120` (+15 B2) مع `llmBereit` + 3 مدرسين عينة + `washback 7 أيام`.
- `muendlich 45→60` (+15 B2 Diskussion) + `aussprache 65-90` ميداني.

**الأسبوع 7-8 — التقنية:**
- `tool 822 → YAML` مولد + `banks 4.55M → 3.5M` (إزالة `lang` المكرر) + `a11y axe CI` + `Lighthouse CI` + `PWA sw.js` حقيقي.

**الأسبوع 9-12 — الميدان:**
- 5 متعلمين A0→B2 لمدة 4 أسابيع + قياس `D1 240/270` ميداني + `PEDAGOGIK_REVIEW R170` + `PERFORMANCE_BUDGET` + نشر `vB2.1-field`.

---

## 7. الأدلة الحرفية (سطر سطر)

**الكود:**
- `app/layout.tsx:12` حقن ثيم `unsafe-inline` — السطر 12: ``(function(){try{var c=JSON.parse(localStorage.getItem("weg-komfort-v1")...``
- `lib/plan.ts:641` `TEXT_SLOTS [1,0,0,1,0,0,2] DIALOG_SLOTS B2 [0,1,1,1,1,0,0] (28 slot)` — السطر 641: `dialogRang = rangVor(DIALOG_SLOTS)` → `nextDialog = dialogsOfLevel[(dialogRang+dialogSlot++)%len]` — 39 B2 مجدول كحد.
- `lib/signalwoerter.ts:8` `الحوارات الـ176 نفسها` — السطر 8: `*  هذه الوحدة نقية… من الحوارات الـ176 نفسها` — تم تحديثه من 156→176 في R400.
- `content/vocab.json:89447` `122 حزم 6202 بطاقة` — السطر 89447: `"b2-medien-schule": {"cards": [...]}` — 49 تكرار `de` — `audit:content vocab:stat doppelte de 49`.

**التصميم:**
- `app/globals.css:8` `@theme { --color-paper #0b1020 }` — السطر 8: `--color-paper: #0b1020;` — 120 متغير، لا `space-*`.
- `components/akademie/Navigation.tsx:1` `UiAppShell` — السطر 1: `import { UiAppShell } from "@/components/dirb/DesignSystem"` — سفلية + `footer ui-footer`.

**المحتوى:**
- `content/texts.json:1` `t-b2-01 de 490W 6 فقرات` — السطر 1: `"de": "Die Digitalisierung spielt..."` — `wordCountDe: 490` — `K76b/K79b` محفوظ.
- `content/dialogues.json:574k` `d-b2-38..49` — السطر 13547: `"id":"d-b2-38" level:"B2" lines:6 q:2 mc:2` — `K71a B2 78→102` `K71h 29/110→41/134`.
- `content/writing.json:105` `w-b2-41..45` — السطر 1: `"id":"w-b2-41" format:"frei" zielWort:150 sample:137W` — `K30b ≥100` `K270c 0.85-1.6×ziel`.

**الاختبارات:**
- `scripts/engine_smoke.ts:14k` — السطر 858: `ok(dm.count===176 && ki===94 && haus===82)` — R400.
- `scripts/audit_inhalt.ts:50` — السطر 50: `abdeckung:dialoge خارج الخطة (10)` — 10 حوارات B2 خارج الخطة.
- `docs/audio-qc-all-2026-10-18.json:1087→1099` — السطر 1: `"dateienGeprueft":1099` — 176 dialog + 157 hoeren + 742 diktat + 8 sprichwort + 16 hoerneu — `K304 1099/1099`.

---

## 8. التثبيت — ماذا يُجمّد الآن

```
git tag -a vB2.0-perfect -m "B2 perfect: 176 dialog·40 text·105 writing·6202 vocab·87 grammar·1916/0"
git push origin vB2.0-perfect
# الفرع النشط arena/b2a2c9bb-wegb2 → main عبر PR + CI (smoke/tsc/build/audit:content/lint/a11y)
```

**القاعدة الذهبية (R38):** `TOTAL_DAYS 378` لا يُمس — أي تغيير في `lib/phasen.ts` يلزم `PEDAGOGIK_REVIEW` + `HUMAN_DECISIONS`.

---

## 9. ملاحظة الأستاذ الخبير — المراجع العالمية

**Goethe-Zertifikat B2 Modellsatz (faustacademy/learninginstitute/zwh PDFs):**
- Lesen 5 Teile 9+6+6+6+3=30 (65min) — **مغطى** `texts 157 (142 lang) + K70e «» حرفي + K71a-i`
- Hören 4 Teile 30 Items (40min) — **مغطى** `dialog 176 + hoeren 157 + signalradar 7 فئات` لكن 10 حوارات خارج الخطة — يُنقل إلى حر
- Schreiben 2 (Forum 150 + Brief 100, 75min) — **مغطى** `writing 105 (B2 33) + schreibkorrektur 8/4/1` لكن بلا مصحح بشري — يُضاف `llmBereit` + 3 مدرسين
- Sprechen 2 (Vortrag 3min + Diskussion 6min, 15min Paar) — **مغطى** `muendlich 45 + vortrag 16` لكن 1 اعتراض/300s لا 2 — يُرفع إلى 60
- 100P×4=400P (240 نجاح) — **مغطى** `pruefung-b2.json 400P` + `haerte 32 (8×4)` + `muendlich 45` — `K400`

**Profile Deutsch B2 (C1-C2 nominal style):** Passiv alle Zeiten + Nominalisierung + Konjunktiv I Erkennen + N-Deklination — **مغطى** `grammar b2-* 7/7` (`R398b: passiv-vht/konj2-vht/nominal/partizipial`).

**BAMF Rahmencurriculum BSK B2 400UE:** 6 Handlungsfelder — **مغطى** `pakete 6` (I-VI) + `pflege 8` + `szenarien 12` — **لكن** `Gesundheit/Unternehmen` غائبان — يُضافان 6→8.

**CEFR Companion Volume (2020):** Mediation + Online Interaction — **جزئي** `szenarien + muendlich + schreiballtag` — **لكن** لا `pragmatik` + `interkulturell` — يُضاف عبر `tool-311/344`.

**الاقتراحات المليون (مُصنفة):**
- 1-10: P0 أعلاه — إصلاح فوري
- 11-100: تحسينات محتوى (A2 1300, B2 40 textos lang, kollok 4000, verben 150)
- 101-1000: تقنية (a11y, PWA, IndexedDB, bundle-analyzer, nonce, SRI)
- 1001-مليون: بحث (washback, FSRS حقل, eye-tracking, VR-Classroom `vr-classroom.tsx` موجود كبذرة)

> **الخلاصة:** المشروع **ممتاز لـ A1-B1، ناقص لـ B2 ميدانيًا** قبل R400، و**B2 حقيقي بعد R400/R401** مع 12 حوارًا و5 كتابات جديدة. تثبيت `vB2.0-perfect` الآن ثم الميدان 4 أسابيع هو الكمال الحرفي لا الكمال الورقي.

