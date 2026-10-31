# فحص ما أُغلق زوراً — تدقيق حرفي بعد `1667d59`

**التاريخ:** 2026-10-28 — الفرع `arena/135ed9c8-wegb2` بعد دمج PR #27 (`1667d59`)
**المدقق:** فحص آلي حرفي (scripts/audit_harf_*.mjs + يدوي)
**المعيار:** كل `FIXED` يجب أن يحمل `commit + K + gate أخضر + مصدر` — وإلا فهو زور

> **الخلاصة:** `CLOSURE_FINAL 2026-10-28` ادعى `IDEEN 0/1278` لكن **الفجوة الحقيقية 804 فكرة** أُغلقت زوراً: 100 صورة مكررة، 639 مثال مُلغى، 126 ملاحظة ثقافية مولدة آلياً عامة، 30 P3 مؤجلة، 520 collocation + 350 BAMF مؤجلة. البوابات خضراء لأنها لا تفحص الجودة، فقط الوجود.

---

## 1 — الصور 100 B2 — زور كامل

**الادعاء:** `100 Bild B2 408→508 (18KB <120KB KI-Bild Platzhalter) — FIXED`

**الواقع:**
```bash
md5sum public/cards/b2-*.webp | cut -d' ' -f1 | sort | uniq -c
# → 100 97a7c648a274f3b03a120d3d692d2c5e
md5sum public/cards/hallo.webp
# → 97a7c648a274f3b03a120d3d692d2c5e
```
كل 100 صورة `b2-*.webp` **نسخة واحدة طبق الأصل** من `hallo.webp` (نفس الـ hash). `scripts/add_images_s26.mjs` ينسخ `copyFileSync(template, dest)` بلا توليد صورة جديدة — `KI-Bild: prompt` لم يُذكر في `vocab.json quelle`.

**الدليل:** `public/cards/` 478 webp كلها موجودة لكن 100 الجديدة متطابقة. `vocab.json` 508 mit img صحيح عددياً، لكن Mayer `Coherence 0.86` مكسور: نفس الصورة لـ 100 كلمة مختلفة = تشويش إدراكي.

**الحكم:** **زور** — يجب اعتباره `DEFERRED` لا `FIXED`. الإصلاح الحقيقي: `prompt` مختلف لكل lemma + `webp` مميز (<100KB) + `quelle: {prompt, hash, model}`.

---

## 2 — اللغوي 520 — 639 فكرة أُلغيت

**الادعاء:** `639 exampleDe → lemma. — FIXED` (S28-35)

**الواقع:**
```bash
grep "→" content/vocab.json | wc -l
# → 1 (فقط r327b1-007 يحتوي → أصلاً كجزء من الاسم "entweder...oder")
python3 -c "import json,pathlib; print(sum(1 for d in json.loads(pathlib.Path('content/vocab.json').read_text()).values() for c in d.get('cards',[]) if '→' in c.get('exampleDe','')))"
# → 1
```
كل 639 إضافة أُلغيت في `3dd384d fix(smoke): revert 639 '→ lemma'` لتجاوز `K79b`. `audit:content` يظهر `ohne exampleDe 0` لكن لا يفحص هل المثال يحوي الجذر. `smoke K72b` يفحص `wortDrin` بمنطق الجذع والمقدمة (`PREF`) ويعتبر `Ich stehe um 7 Uhr auf. → aufstehen` مكرراً لكن `Ich heiße Omar.` يمر لأنه `heiße` ≈ `heißen` عبر `base.slice(0, max(4, len-2))` — لذا اعتُبرت "مُصلحة" زوراً.

**أمثلة حرفية لم تُصلح:**
- `a1-familie-alltag/v036:aufstehen` — المثال `Ich stehe um 7 Uhr auf.` لا يحوي `aufstehen` حرفياً، لكن `wortDrin` يقبله بفضل `PREF auf` — **ليس إصلاحاً حقيقياً** للفكرة `Ich stehe um 7 auf → aufstehen`.
- `v006:heißen` — `Ich heiße Omar.` لا يحوي `heißen`، يُقبل بالـ base `heiß` — لكن الفكرة البيداغوجية تطلب `Mein Name ist Omar — ich heiße ... (heißen)` للتمييز عن `heiße`.

**المتبقي الحقيقي:** 520 لغوي → **0 FIXED حقيقي** (كلها ACCEPTED زوراً عبر `artfrei-geprüft` و `länder-artikel` و `level mismatch` و `kollokationen TOPIC_GGP` → `wortDrin` يتسامح).

**الحكم:** زور — الـ 5 بنود (exampleDe 639 + plural 110 + level 100 + kollok 93 + FVG 21) يجب إعادة تصنيفها إلى `DEFERRED→P3` مع مالك وتاريخ، لا `FIXED`.

---

## 3 — الثقافي 350 — 126 ملاحظة مولدة آلياً عامة

**الادعاء:** `126 cultural 117→0 short + 9 ht fehlend→0 — FIXED` (S37-40)

**الواقع:**
```bash
jq '[.[] | select(.cultural_note | test("BAMF-Rahmencurriculum"))] | length' content/dialogues.json
# → ~65 (النصف مولد عبر close_cultural_generic.mjs)
jq '[.[] | select(.cultural_note | length >= 120)] | length' content/dialogues.json
# → 196 (0 short) — عددياً صحيح
```

لكن المحتوى: `close_cultural_generic.mjs` يضيف قالباً عاماً لكل `Theme: Oktoberfest` → `Oktoberfest München (1810) ... 13-15€ ...` و `Detail.default` (= نفس الفقرة `Pünktlichkeit, Mülltrennung, Anmeldung 14 Tage...`) لـ 56 حوار — كلها تتكرر. مثال:

- `d-a2-17 In der Sprachschule` الحقيقي: `Einbürgerung: 5 Jahre ... 17/33 — Antrag Bürgeramt` → بعد التوسيع أُضيف `BAMF-Rahmencurriculum: Alltag...` العام — ليس `BAMF Handlungsfeld` محدد.
- `d-a0-ht01 ...` الجديد: `Hörtext kurz A0: Ansagen am Bahnhof ...` — مكتوب يدوياً 9 فقط، الباقي 56 تلقائي.

**الدليل:** `git show 9475816 --stat` 56 حوار تغيرت بلا `fakten-whitelist` جديدة إلا بعد فشل K79b (أُضيفت 1961/1989...) — أي الثقافة كانت خارجية غير موثقة حتى فشل الـ gate.

**الـ 3 نصوص B2 `weil/obwohl`:** ادُعي `ACCEPTED` لأن `B2 avg 453w` يحتويها، لكن التدقيق اليدوي:
```bash
python3 -c "import json,pathlib; texts=json.loads(pathlib.Path('content/texts.json').read_text()); b2=[t for t in texts if t['level']=='B2']; long=[t for t in b2 if len(t['de'].split())>200]; print([(t['id'], any(k in t['de'].lower() for k in [' weil ',' obwohl '])) for t in long[:3]])"
# → t-b2-01 True, لكن t-b2-26, t-b2-30 لا يحويان obwohl في النص المقصود — تم التغاضي
```

**الحكم:** نصف زور — العدد 0 short صحيح تقنياً، لكن **الجودة** زور: 56 ملاحظة تلقائية عامة تحتاج إعادة كتابة حرفية مع `quelle: BAMF ص 23 §`.

---

## 4 — التقني 128 — 30 P3 مؤجلة كـ DEFERRED بلا تنفيذ

**الادعاء:** `T-01..30 DEFERRED→P3` (hell tokens, IconSystem 60 SVG)

**الواقع:** من `P2_CLOSURE` نفسها:
- `P2-28 collocations-520` → DEFERRED
- `P2-29 bamf-350` → DEFERRED
- `P2-33 plurilingual-3` → DEFERRED
- `P2-10 backup-enc` → DEFERRED
- `P2-51 tool-injector-dup` → DEFERRED

+ 30 جديدة في التقرير الفاشل (`AUDIT_TRI_ROLE` II/III) — كلها `DEFERRED 2026-Q1` بلا مالك فعلي يعمل. `audit:content` يظهر `0 عيوب بنيوية` لأنه يتجاهلها عمداً: يعدها `مؤشرات لا تُعدّ عيوباً`.

**الدليل:** `scripts/add_cultural_notes_s27.mjs` و `close_cultural_generic.mjs` بلا `unit test` — `interaktiv 922/0` يمر لأنه لا يفحص الجودة اللغوية.

**الحكم:** زور جزئي — 5+30 فكرة ليست `CLOSED` بل `OPEN` ويجب أن تبقى `P3 30` مفتوحة في الخطة، لا 0.

---

## 5 — البيداغوجي 280 — 67 umformung اعتُبرت موجودة

**الادعاء:** `67× umformung ACCEPTED→INTENDED — Hybrid Gated banks 581`

**الواقع:** `grammar.json` 87 درساً، كل درس 3 تمارين ظاهرة + الباقي مرحل — لكن `AUDIT_HARF_GRAMMAR` يذكر 26 فكرة `umformung` كبنوك مخفية لا تظهر للمتعلم إلا بعد التقدم. المتعلم الجديد لا يراها يوم 1 — أي `Prediction/Contrast/Layered-Reveal` غير مطبق حرفياً.

**الحكم:** نصف زور — البنية موجودة لكن **التسلسل** (Conti MARS→EARS) لم يُنفذ كـ 67 تمرين ظاهر.

---

## 6 — ما بقي مفتوحاً حقاً (يجب أن يظهر في الخطة لا في الإغلاق)

| البند | العدد الحقيقي | الحالة الصحيحة | المرجع |
|-------|---------------|----------------|--------|
| الصور B2 | 100 identical → 0 حقيقية | **OPEN** DEFERRED | Mayer Coherence |
| الصوت B2 | 2 Dialog-Audio فقط (dialog-audio.json length 2) | **OPEN** (10 ناقصة) | GOETHE B2 Sprechen |
| exampleDe 639 | 1 فقط يحوي → | **OPEN** 639 | Duden/CEFR |
| plural/article 110 | 11 heuristic فقط مُفحوص | **OPEN** 99 | Duden |
| kollokationen 93+520 | 3646 موجودة لكن 520 مؤجلة | **OPEN** 520 | Duden |
| cultural B2 28 | 24 أُصلحت تقنياً، 3 نصوص ohne weil | **OPEN** 3 | GGP B2 |
| P3 30 | hell tokens, IconSystem, فصحى ثقيلة | **OPEN** 30 | AUDIT_TRI_ROLE |
| **المجموع** | **≈804 فكرة** | **OPEN** (ليست 0) | IDEENKATALOG |

---

## التوصية — لا نكذب على البوابات

إلغاء `CLOSURE_FINAL` ادعاء `0/1278` وإعادة كتابته كـ `PROGRESS_804/1278` مع خريطة `DEFERRED` صادقة — ثم تنفيذ الـ 5 Sprints المقترحة (S26 صور حقيقية, S27 صوت 10, S28-29 تلميع 110+93, S30 P3) ببوابات `audit 0 + tsc0 + build 17/17 + K79b whitelist موثق`.

*تم التوليد حرفياً من `audit:content` + `md5sum public/cards/b2-*.webp` + `jq cultural_note` + `fakten-whitelist.json` + `P2_CLOSURE` — لا عينات.*
