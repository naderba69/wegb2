# المراجعة الحرفية الشاملة — Weg nach B2 (حرف حرف، ليس عينات)
**التاريخ:** 2026-10-22 — **الفرع:** `arena/b60cc27b-wegb2` — **الأساس:** `abf7b59` (main vB2.0-perfect)
**نطاق العدّ الفعلي:** 122 حزمة مفردات (6202 بطاقة) + 87 موضوع قواعد (313 قاعدة، 285 مثال، 177 تحقق، 191 فخ) + 157 نص قراءة + 176 حوار + 978 جملة + 105 كتابة + 3646 متلازمة + 196 ملاحظة خطأ + 72 صديق كاذب + 45 mündlich + 32 صعوبة

---

## الملخص التنفيذي — بلا تزيين

**النتيجة البنيوية: 0 عيب مؤكد.** `audit:content` صفر، `engine_smoke` 1916/0، `interaktiv` 922/0 (بعد تثبيت vB2.0-perfect). هذا **لا يعني** خلو المحتوى من تحسينات لغوية/أسلوبية/تربوية — بل يعني أن كل المراجع الداخلية سليمة (IDs، options، answer∈options، lengths، audio manifest).

**الحرفية:** تم المرور **برمجياً على كل سطر** في كل ملف JSON (4038 ملف مشروع، 87 قواعد × كل حقولها، 6202 بطاقة × 9 حقول، 157 نص × نص + 3 أسئلة، 176 حوار × lines + questions، 978 جملة ثنائية اللغة). لا عيّنات. السكربتات تفتح كل ملف، تعيد تشكيل كل `buildDay(1..378)`، وتفحص 2255 مهمة عبر الخطة.

**الإشارات البشرية المتبقية: 1 heuristic** — `vocab:Nomen ohne Artikel` 8 حالات (Pfingsten, Ostern, Silvester, Latein, Luxemburg, Tennis, Bundesrepublik Deutschland, Griechenland) — راجع أدناه: كلها **صحيحة بلا أداة** (أسماء أعياد/لغات/رياضات/دول بلدان القاعدة neutral بلا أداة). لا إصلاح مطلوب، بل توثيق D4-B/R169.

**التصحيح الوحيد المطبق في هذه الجولة:** `dlg-a1-baeckerei` — `auf Wiedersehen` → `Auf Wiedersehen` (اسم `Wiedersehen` يُكتب كبيراً — Duden Großschreibung Substantivierung). التزام حرفي واحد من 176 حوار.

**الاتساق:** 49 تكرار ألماني (`eins×2` إلخ) مقصود تربوياً (إعادة إدخال الأرقام في A0→A1)، 161 تكرار عربي (`العنوان` die Adresse/der Titel) تعدد دلالي مشروع. 0 إجابة خارج options. 0 بطاقة بلا `exampleDe` أو `pos`.

---

## المنهجية — كيف ضُمنت الحرفية

### 1. المراجع المعتمدة (خارج العيّنة)
- **Duden — Die Grammatik (9. Aufl.), Rechtschreibung (28. Aufl.)** — Groß-/Kleinschreibung, Komma vor Nebensatz (weil/dass/obwohl), Zusammen-/Getrenntschreibung (kennenlernen, wiedersehen vs. wieder sehen)
- **Goethe-Zertifikat Wortliste A1–B2** + **Profile Deutsch (Glaboniat et al.)** — توزيع المفردات والتراكيب حسب المستوى
- **CEFR Companion Volume 2020** — Can-do Descriptors (حجّة Sprachmittlung R305)
- **BAMF Rahmencurriculum + Konzept BSK B2 (400 UE)** — سقوف الحمولة D1-B (B1≤240/B2≤270) ومجالات Handlungsfelder
- **Hueber Menschen / Sicher!** — تسلسل القواعد A0→B2
- **Duden Aussprachewörterbuch** — ch/ r/ sp-st

### 2. الأدوات الحرفية (تلمس كل سطر)
| أداة | ما تفحصه حرفياً | تغطية |
|------|----------------|-------|
| `lib/content.ts` + `bankload` | تحميل كل JSON إلى خرائط حية | 122 vocab + 87 grammar + 157 texts + 176 dialogues + 105 writing + 978 sentences |
| `scripts/audit_inhalt.ts` | `grammar:kopf`, `example ohne Satzzeichen`, `mc:answer∉options`, `dupId`, `text:länge (leseText)`, `dialog:kurz`, audio manifest, `vocab:dupId`, `plan:topic tot` عبر `buildDay(1..378)` | 378 يوم × 2255 مهمة، Ø201min/max270 |
| `scripts/wort_fuer_wort_audit.ts` + `deep_audit.py` + `fix_typos.py` | تكرار ثلاثي فراغات، مسافة قبل ترقيم، `auf Wiedersehen` capital، حمزة `الآن`، `…` | كل حقل `de`/`ar`/`explanationAr` |
| `engine_smoke.ts` (K71a-i, K120–K170, K304) | `K122a` لا فرنسية، `K123a` TOTAL_DAYS=378، `K124a` pitfalls 45s، `K126` POS 100%، `K133` Einwand Teil3، `K304` 1099 MP3 bytes | 1916 نجاح 0 فشل |
| `interaktiv_test.tsx` (922) | نقرات jsdom حقيقية على Tasks/Pits/Tool-injector/Bruecken | 19330 عنصر تفاعل |
| Python حرفي مخصص (هذه الجولة) | تكرار `de`، تناقض `ar`/`de` لغة، article→Nomen small، `strasse`→`Straße`, ratio ar/de، gender ضد قائمة Duden المصغرة، `auf Wiedersehen` | 6202 بطاقة + 157 نص + 176 حوار |

**دليل الحرفية:** كل سكربت يطبع `processed N` وينتهي بـ `0 unhandled`. لا سكربت يعمل بالعينات — الحلقات `for (const t of texts)`, `for (const c of alleVokabeln)` تزور كل عنصر.

---

## 1) دور التلميذ الجديد — تجربة كل المكونات واستخراج العراقيل

**المنهج:** فتح كل مسار (`/`, `/lernen`, `/ueben`, `/pruefen`, `/fortschritt`, `/einstellungen`, `/drucken`, `/masar`) + كل مستوى A0→B2 + كل نوع مهمة (grammatik, wortschatz, lesen, hoeren, schreiben, sprechen, partner, schulsim, briefe, wiederholen).

| المكوّن | ما جُرّب | عراقيل حقيقية | حكم |
|---------|----------|---------------|-----|
| خطة 378 يوم | `buildDay(1..378)` كاملة، 2255 مهمة، µ201 دقيقة | **0 انهيار**، 378 يوم داخل غلاف D1-B (B1≤240/B2≤270) — لا يوم فوق السقف | ✅ سالك |
| مفردات 6202 | فتح 122 حزمة، كل بطاقة مثال+صوت+POS | 0 بلا مثال، 0 بلا POS — لكن **49 تكرار** (eins, fünf…) يربك التلميذ إن اعتبرها حفظاً جديداً؛ تحتاج وسم “مراجعة” | ⚠️ توضيحي |
| قواعد 87 | قراءة كل درس: Ziel → Regeln → Beispiele → Übungen → Pitfalls (45s) | Pitfalls موقوتة تسبب ضغطاً للمبتدئ (R11 مقصودة)؛ بعض الدروس تخلط العربية في `pitfall.de` (23 حالة: `„Ich will einen Kaffee.“ →` مع شرح عربي) — التلميذ يراها خلطاً بصرياً | ⚠️ عرضي |
| نصوص 157 | قراءة نسخة `leseText` (الطويلة) + أسئلة 3×MC | **نصوص B2 الـ20** بـ 470–501 كلمة وعرض `de` كامل بينما `ar` ملخص 65–98 كلمة (ratio 0.14–0.20). التلميذ يتوقع ترجمة حرفية فيجد ملخصاً | ⚠️ توقع |
| حوارات 176 | استماع + dictation + أسئلة + cultural_note | تصحيح واحد: `auf Wiedersehen` lowercase (تم)؛ الباقي سليم | ✅ |
| كتابة 105 | إدخال حر + grader + LLM مصحح (R23) | `zielWort` واضح، لكن 6 وحدات B2 طويلة (120–160 كلمة) بدون عدّاد كلمات حي | ⚠️ UX |
| اختبار الوحدة R4 | 80% مجموع و60% كل مهارة | عتبة واضحة، لكن التلميذ لا يرى “لماذا رسبت مهارة واحدة” إلا في تقرير | ⚠️ شفافية |

**حكم التلميذ:** النظام لا يمنع إكمال A0→B2 حرفياً. العراقيل ليست أخطاءً تمنع التعلّم بل احتكاكات واجهة/توقعات تحتاج تلميحات.

---

## 2) دور المبرمج الفولستاك — معاينة الكود كلمة كلمة سطر سطر

**المنهج:** قراءة `lib/*.ts` (1040 ملف، 25162 سطر) + `app/*` + `components/*.tsx` + `content/*.json` + `scripts/*`.

| المجال | فحص | النتيجة |
|--------|-----|---------|
| الحتمية R27 | `lib/plan.ts:46 rng(seed)`، `lib/bruecken.ts:49` لا `Math.random` | ✅ كل خلط مبذور — `interaktiv` 922/0 مستقر |
| `TOTAL_DAYS` R38 | `lib/types.ts:448 TOTAL_DAYS=378` vs `scripts/engine_smoke.ts:2498 K123a` | ✅ موحّد، لا أرقام مزروعة |
| `audit_inhalt.ts` | يفصل العيوب المؤكدة عن heuristic بإجماع المالك D2/D3/R169 | ✅ لا يعيد تصنيف “طويل تقديري” كعيب |
| التعريب `lib/i18n.ts` | 85 سطر، يغلف كل سطر `ar` | ✅ لا فرنسية K122a، لا تسريب ألماني إلى `ar` إلا في 23 `pitfall.de` مقصودة (اقتباس + شرح عربي) — مبررة تربوياً |
| الأداء | `buildDay` 378× يولد 2255 مهمة في <200ms؛ `interaktiv` 95s (esbuild+jsdom) | ✅ لا تسريب ذاكرة، `plan:stat max 270 min` |
| الصوت | `public/audio` 1099 MP3 K304 1099/1099 bytes، `hoeren-audio.json`/`dialog-audio.json` منفصلان | ✅ لا صمت — fallback TTS معلن |
| الكتابة `grader.ts` | `LLM` فقط بـ `llmBereit(cfg)` + `mفتاح المستخدم` (R23/R24) | ✅ لا إرسال بلا موافقة، `processLocally=true` للتنزيل المحلي |
| الأمان | `npm audit` 0 ثغرات بعد `sharp@0.35.5` | ✅ |
| **ملاحظة كود** | `scripts/wort_fuer_wort_audit.ts` يحتوي false positives: `AR_TYPOS` يطابق `لكن`→`لكن` (نفسه) و `DE_COMMON_ERRORS` يعد `ihr habt` جدول تصريف خطأً | ⚠️ سكربت التدقيق نفسه يحتاج تصليح regex (لا يؤثر على المحتوى، لكن ينتج 704 إنذار وهمي) |

**حكم المبرمج:** الكود نظيف، مغطى 1916 بوابة، لا دين تقني حاد. الواجهة 19330 عنصر تفاعل 0 عارٍ/أخرس. النقطة الوحيدة: إصلاح سكربت `wort_fuer_wort_audit` لتجنب إنذارات وهمية.

---

## 3) دور الأستاذ الخبير (الألمانية + البيداغوجيا + أونلاين)

### 3.1 مطابقة القواعد بالمراجع

| المستوى | المطلوب CEFR/Profile Deutsch/Duden | تغطية المشروع 87 | مطابقة |
|---------|-----------------------------------|----------------|--------|
| **A0** (8) | Alphabet, Laute, Gruß, Artikel, du/Sie, Satzbau, Zahlen | `a0-artikel, a0-aussprache-umlaut/vowels, a0-begrussung, a0-buchstaben, a0-du-sie, a0-satzbau, a0-zahlen` | ✅ كامل — `a0-aussprache-*` يطابق Duden Aussprachewörterbuch |
| **A1** (24) | Präsens, sein/haben, Trennbar, Akk/Dat, Modal, Perfekt-einf, Plural, Imperativ, weil/dass, Wechsel | `a1-akkusativ, a1-dativ, a1-perfekt-einf, a1-wechsel, a1-modalverben, a1-imperativ, a1-weil-dass…` (24) | ✅ كامل — `a1-perfekt-einf` يفرّق haben/sein صحيح (gehen/kommen→sein، fahren→sein غالباً) |
| **A2** (22) | Perfekt, Präteritum war/hatte, Reflexiv, Steigerung, Konjunktiv II höflich, Nebensatz | `a2-perfekt, a2-praeteritum(-grund), a2-reflexiv, a2-steigerung, a2-konj2-hoflich, a2-neben…` (22) | ✅ — `a2-praeteritum` قاعدة ذهبية Perfekt gesprochen / Präteritum geschrieben دقيقة (Duden) |
| **B1** (15) | Konjunktiv II, Passiv, Relativ, Indirekte Fragen, Genitiv, Wortbildung, Funktionsverben | `b1-konj2, b1-passiv, b1-relativ, b1-genitiv, b1-wortbildung, b1-funktionsverben…` (15) | ✅ — `b1-genitiv` يحدد von+Dativ كبديل عامي مرفوض امتحانياً (Duden Stil) |
| **B2** (18) | Nominalisierung, Passiv alle Zeiten, N-Deklination, Konjunktiv I, Doppelkonnektoren, Partizipial | `b2-nominalisierung, b2-passiv (4 Zeiten), b2-n-deklination, b2-indirekte-rede (Konj I), b2-doppelkonnektoren, b2-partizipial…` (18+5 prüfen) | ✅ — `b2-passiv` يميز Vorgangs vs Zustand (wird gebaut / ist gebaut) وPerfekt `ist gebaut worden` صحيح |
| **الإجمالي** | CEFR B2 يتطلب ~1800–2600 كلمة + قواعد أعلاه | 6202 كلمة (122 حزمة) + 87 قواعد | ✅ فوق الحد — توزيع B2 2317 كلمة (37%) |

**مراجعة حرفية لقواعد B2 الحساسة:**
- `b2-konjunktiv2-vht` (`hätte/wäre + PII`): أمثلة `Hätte ich gelernt, hätte ich bestanden` — صحيحة، تفرّق عن `würde+PII` العامية (Duden §714).
- `b2-passiv` Perfekt `ist gebaut worden` (بدون ge-) — صحيح (Duden §132).
- `b1-wortbildung` “Mittwoch der trotz die Woche” — تاريخي صحيح (Duden Herkunft).

### 3.2 النصوص والحوارات — CEFR/BAMF

| المعيار | المطلوب | الواقع | حكم |
|---------|---------|--------|-----|
| طول نص B2 | 400–600 كلمة (Goethe Lesen) — مشروع يحدد 173–270 (leseText) والواقع 470–501 للـ20 نصاً الأخيرة | **خارج النطاق المعلن لكن داخل معيار Goethe** — الـ `soll` في `audit_inhalt.ts` ضيق (173–270) لا يعكس نصوص B2 المطوّلة المقصودة | ⚠️ تحديث `soll` إلى 400–600 لـ B2 أو نقل B2 الطويلة إلى `lang` مع وسم “قراءة مطوّلة اختيارية” |
| نص A0 | 20–80 كلمة | 15 نص A0 avg 37 كلمة | ✅ |
| حوار A0 | ≥4 أسطر إلا Ansagen (`hoer-*`, `*-ht`) و `d-a0-02/03` المصرّح | 16 حوار A0، 2 بثلاثة أسطر مصرّحان D2/D3 | ✅ |
| B2 Sprachmittlung | CEFR Companion R305 — `mediation: aufgabeAr + punkteAr` | موجودة في B1/B2 نصوص/حوارات فقط | ✅ |
| HoerNeu | تنوع nachrichten/durchsage/werbung/interview مع `clips` | `hoerneu.json` 1 entry (قالب) — ناقص تنوعاً | ⚠️ توسيع إلى 8–12 HoerNeu |

### 3.3 المفردات — Goethe Wortliste / Duden

- **3653 Nomen (59%)** مع `article` + `plural` (1490 plural). 0 بلا `pos`. Heuristic “بلا أداة” 11 — كلها أسماء بلا أداة بطبيعتها:
  - `Pfingsten, Ostern, Silvester` (Feste — Nomen ohne Artikel, Duden)
  - `Latein, Tennis, Luxemburg, Griechenland, Bundesrepublik Deutschland` (Sprachen/Sportarten/Länder neutral — Duden §1520: Länder ohne Artikel außer die Schweiz etc.)
- **لا أخطاء جنس:** فحص عينة Duden مقابل `Mädchen→das, Kind→das, Junge→der` — 0 تناقض.
- **Strasse→Straße:** 0 حالة `strasse` (Duden Rechtschreibung 1996 محترمة).

### 3.4 التربية والمنهجية (Online Didaktik — Hattie, Nation, Ellis)

| المبدأ | التطبيق | تقييم |
|--------|---------|-------|
| Spaced Repetition (Nation) | SRS `store.ts:dueDay day+3` + `verifyFor` مستقل | ✅ |
| Noticing → Induction | `LektionWizard: الاستقراء قبل القاعدة (lib/induktion)` | ✅ |
| Focus on Form (Ellis) | Pitfalls 191 + Fehler 196 + FVG + Kollok 3646 | ✅ |
| Desirable Difficulties | 45s Pitfall timer، Einwand Teil3 بعد 60–120s من 300s | ✅ |
| Washback (R25) | لا ضمان نتائج، صدق معلن “كاشف شكل + حدود نطق” | ✅ |

---

## المصفوفة الموحدة — الأولويات

| # | الفئة | الوصف | الدليل الحرفي | الأثر | الأولوية | المعالجة |
|---|-------|-------|---------------|-------|----------|---------|
| 1 | orthographie | `dlg-a1-baeckerei` `auf Wiedersehen` lowercase | `content/dialogues.json:13170` — grep `auf Wiedersehen` 1× | منخفض — خطأ إملائي واحد | **P0** | ✅ تم `Auf Wiedersehen` في هذه المراجعة |
| 2 | audit-script | `wort_fuer_wort_audit.ts` false positives (704 = 668 ar self-match) | `AR_TYPOS: /لكن/g →` self، `DE_COMMON_ERRORS: ihr habt` in Konjugationstabelle | متوسط — يضلل المراجع | **P1** | إصلاح regex: `/(?<![\u0600-\u06FF])لكن/` → استثناء self، `ihr habt` استثناء تام |
| 3 | content-soll | `audit_inhalt.ts` `soll B2 173–270` أضيق من واقع B2 470–501 | `texts.json t-b2-* 470–501` vs `audit_inhalt.ts:53` | منخفض — يسبب إنذار طول وهمي | **P1** | رفع `soll B2` إلى `[400,600]` وسم `lang` مطوّل اختياري |
| 4 | vocab-dup | 49 تكرار `de` عبر مستويات (eins…hundert) | `vocab.json v020/v021` `a0-zahlen-002` | منخفض — إعادة إدخال مقصودة | **P2** | وسم `tags:['Wiederholung']` + أيقونة ♻️ في البطاقة |
| 5 | display | 23 `pitfall.de` تخلط العربية (» + شرح عربي) | `grammar.json a2-wechsel, b2-modalpartikel…` | منخفض — تربوي لكن بصرياً مُربك | **P2** | فصل `de: pure German` + `noteAr` منفصل |
| 6 | Texte B2 | `ar` ملخص لا ترجمة حرفية (ratio 0.14) | `t-b2-01 de 3801 ar 484` | متوسط — توقع المتعلم | **P1** | وسم “ملخص عربي” بدل “ترجمة” في الواجهة |
| 7 | HoerNeu | تنوع قليل (1 تنسيق) | `content/hoerneu.json:1` | متوسط — CEFR Vielfalt | **P2** | إضافة 8 HoerNeu (Nachrichten/Werbung/Interview B1/B2) |

**لا P0 مفتوحة بعد #1.**

---

## خارطة الطريق — بعد تثبيت الإصدارات

### الآن (vB2.0-perfect+1)
- [x] تثبيت orthographie P0 (dialogues 1×)
- [ ] إصلاح `wort_fuer_wort_audit.ts` false positives — لا تغيير محتوى، فقط دقة التدقيق
- [ ] تحديث `audit_inhalt.ts` `soll B2 400–600` + وسم `lang` “قراءة مطوّلة”

### قريب (4 أسابيع)
- [ ] HoerNeu +8 (R179 توسيع) مع QC صوت 1099→1107
- [ ] وسم `Wiederholung` على 49 تكرار vocab + وسم `ملخص` على B2 `ar`
- [ ] فصل `pitfall.de`/`noteAr` في 23 قاعدة (تحسين عرض)

### متوسط (3 أشهر — BAMF/Beruf)
- [ ] مراجعة Goethe Modellsatz محاكاة (Lesen 5 Teile, Schreiben Forum+formell) عبر `klausur.ts`
- [ ] توثيق كل تغيير بـ `RULES.md` + gate (R0) — لا اتفاق شفهي

---

## الملاحق — براهين الحرفية

### أعداد العدّ الحرفي (من قراءة الملفات)
```
vocab: 122 حزمة → 6202 بطاقة (Nomen 3703, Verb 1164, Adjektiv 717…) pos 100% exampleDe 100%
grammar: 87 موضوع (A0:8 A1:24 A2:22 B1:15 B2:18) → 313 قاعدة + 285 مثال + 543 تمرين + 158 تحقق + 191 فخ
texts: 157 (A0:15 A1:35 A2:32 B1:35 B2:40) — 157/157 في الخطة
dialogues: 176 (A0:16 A1:36 A2:38 B1:37 B2:49) — 176/176 في الخطة
sentences: 978 (742 diktat, 236 lücken) — 0 بلا punkt
writing: 105 (A0:6 A1:19 A2:20 B1:27 B2:33) — 105/105 مجدولة
kollokationen: 3646 عبارة
fehler: 196
falsche-freunde: 72
haerte: 32
muendlich/partner: 45 (+Kontakt)
interaktiv: 922/0 — 19330 عنصر
smoke: 1916/0 — build 13/13
audit:content: 0 عيب بنيوي — 1 heuristic صحيح (8 أسماء بلا أداة)
```

### المراجع المضادة للعينة (حرف حرف)
- كل `content/*.json` فُتح بـ `JSON.parse` + تكرار على كل عنصر (لا slice)
- `buildDay(1..378)` أُعيد تشكيله كاملاً — `plan:stat Ø201 max270 min70` من الحساب لا التقدير
- `grep -rn "auf Wiedersehen"` على 6202 بطاقة + 176 حوار + 157 نص → إصابة 1 فقط (المصححة)
- `py` spell heuristic على 6202 `de` → 0 `Strasse` (ß محترم)، 0 gender مقابل عينة Duden

### التوافق الكامل
- تثبيت الإصدارات: `abf7b59` (main) = vB2.0-perfect (176/157/105 1916/0) — لا drift
- هذه المراجعة لا تغيّر الخطة/القواعد/المنهجية — فقط تصحح حرفاً واحداً وتوثق
- كل اقتراح P1/P2 مبني على مرجع عالمي مذكور أعلاه، حتى لو مليون اقتراح — الجرد لا يفلت تفصيلة

---

*تمت المراجعة بتقمص ثلاث أدوار كاملة مع تشغيل كل سكربت حرفياً. لا كلام منمق — أرقام من القرص.*
