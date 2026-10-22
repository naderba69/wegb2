# COVERAGE_GAP — مقارنة المراجع الأكاديمية vs المشروع
**تاريخ:** 2026-10-21 · **المراجع:** CEFR/Global Can-do [Goethe GER A1-B2] · Goethe-Zertifikat B2 Modellsatz [Lesen 5×30/65min · Hören 4×30/40min · Schreiben 2×100/75min · Sprechen 2×15min] · BAMF Rahmencurriculum Integrationskurs + BSK B2 Konzept (400UE/500UE Brücke)

## 1. المنهجية
كل مستوى CEFR يُقاس بـ 4 مهارات × أوصاف can-do إيجابية (ما يستطيع فعله، لا ما يفشل فيه). المشروع يُقاس بـ `content/*.json` (grammar 87 · texts 157 · dialogues 164 · writing 100 · vocab 6202 · eselsbruecken 88 · pakete 6 · haerte 32 · muendlich 45 · pruefung 400P) + `lib/phasen.ts` (378 يوم) + `lib/plan.ts` (D1-B سقف 240/270).

## 2. الجدول المقارن A0→B2

### A0 (1-10) — Basic: التعارف والاحتياجات الملموسة
| المرجع (CEFR/BAMF) | المشروع |
|---|---|
| can-do: تقديم النفس، سؤال/إجابة عن مكان السكن، تفاعل بسيط بشرط بطء الكلام | `vocab a0-start 40` + `dialogues d-a0-* 11` + `texts t-a0-* 15` + `grammar a0-* 8 دروس` — **مكتمل** |
| BAMF: Einkaufen/Wohnen/Gesundheit — نماذج Alltag | `pakete reise` يغطي مطار/فندق لكن لا يغطي Gesundheit/Ämter منفصلاً — **ثغرة: Gesundheit كوحدة مستقلة غائبة** |

### A1 (11-94) — Basic: جمل بسيطة، معلومات شخصية، تسوق، عمل
| المرجع | المشروع |
|---|---|
| Wortliste Goethe A1 ≈ 650 مفردة (مقال: A1 ~500-1000) | `vocab` A1 ≈ 1800 بطاقة (Ø208) — **فائض كمي، لكن التوزيع الأبجدي غير مدقق مقابل القائمة الرسمية** |
| Grammatik: Präsens, Artikel, Nominativ/Akkusativ, W-Fragen, Modalverben [grammatikly A1] | `grammar a1-*` 24 درساً (akkusativ, dativ, perfekt-einf, imperativ, futur-einf...) — **مكتمل بنيوياً** |
| Prüfung: Hören 20min/ Lesen 20min/ Schreiben 20min/ Sprechen 15min | لا محاكاة A1 حقيقية — `haerte` 16 عامة، `muendlich` 16 B1/B2 فقط — **ثغرة: لا بنك A1 امتحاني** |

### A2 (95-178) — Basic: جمل متعلقة بالأهمية المباشرة
| المرجع | المشروع |
|---|---|
| Wortliste A2 + DTZ A2-B1: 1300 مفردة | `vocab` A2 ≈ 2000 — **يغطي لكن بلا تدقيق رسمي** |
| Grammatik: Perfekt, Dativ, trennbare Verben, weil/dass, Komparativ [A2] | `grammar a2-*` 22 درساً — **مكتمل** |
| BAMF: Arbeitssuche/Bewerbung A2 (Lebenslauf 5UE, Beratungsgespräch 5UE) | `pakete gespraech` (مقابلة عمل) + `szenarien` 12 — **جزئي: Bewerbungsmappe كوحدة غير موجودة** |

### B1 (179-276) — Independent: نقاط رئيسية، نص متصل بسيط
| المرجع | المشروع |
|---|---|
| Wortliste B1 ≈ 1800 مفردة | `vocab` B1 ≈ 1800 — **مطابق رقمياً** |
| Grammatik: Präteritum, Relativsätze, Konjunktiv II, Passiv Basis [B1] | `grammar b1-*` 28 درساً — **مكتمل** |
| Prüfung B1/B2: Lesen 5 Teile/65min (Einstellungen 9 + Info 6+6+6+3) | `texts` 157 فيهم B1 → لكن `haerte` لا تفرق B1/B2 — **ثغرة** |
| BAMF B1/B2 Brücke 100UE: Festigung B1 + Erweiterung berufsbezogen | `phasen B1` 98 يوم (14 أسبوع) — **أقل من 300UE BAMF (600h total) → الحمل 188min/Tag (ZIEL 270) مبالغ نظرياً** |

### B2 (277-374) — Independent: نصوص معقدة مجردة، تفاعل مع متحدث أصلي بلا إجهاد
| المرجع CEFR/B2 | المشروع | الحكم |
|---|---|---|
| **Lesen:** Artikel/Berichte مع موقف، نصوص أدبية معاصرة، قراءة مستقلة بتكيف السرعة | `texts` B2 20 نص (220-270 كلمة، 5 أسئلة) — **ناقص 50% من الطول والتعقيد (B2 الحقيقي 400-600 كلمة، 4 أنماط قراءة: selektierendes/globales/interpretierendes)** | **ثغرة كبيرة** |
| **Hören:** Vorträge/Interviews/Gespräche/Äußerungen Radio، 4 Teile 30 Items 40min | `dialogues` 164 لكن Hören B2 مخصص 0 — `hoeren-audio` غير موجود — **ثغرة كبيرة** |
| **Schreiben:** Forumsbeitrag 150W (Meinungsäußerung) + formelle Nachricht 100W (Beruf) 75min | `writing` 100 مهمة لكن لا تمييز Forumsbeitrag vs formelle Nachricht — **ثغرة** |
| **Sprechen:** Vortrag 3min + Diskussion 6min (Paarprüfung 15min) | `muendlich` 16 + `vortrag` — **ناقص 50%** |
| **Grammatik B2:** Passiv alle Zeiten, Nominalisierung, Konjunktiv I (Erkennen), N-Deklination [C1-C2 nominal style] | `grammar b2-*` 87 درساً (7/7 B2) — **مكتمل (R398b: +4 Passiv/Konj2-vht/Nominal/Partizipial)** |
| **Beruf BSK B2 400UE:** Arbeitssuche, Arbeitsantritt, innerbetrieblich, Außenkontakte, Regularien, Fortbildung | `pakete 6` (reisen/gespräch/wohnung/b2-debatte/behörde/pflege) — **مكتمل (R399a)** |

## 3. الفجوات الحرجة (3)

1. **B2 غير مكتمل أكاديمياً:** smoke أخضر (1915/0) = بنية سليمة، لكن B2 الحقيقي يحتاج 4 دروس قواعد + 20 نص/12 حوار B2 امتحاني + 800 مفردة B2 مرجعية — بدونها المشروع “يغطي B1+” لا “يجتاز B2”.

2. **الامتحان غير محاكى:** 400 نقطة Goethe B2 (100×4، حد النجاح 240) ← content/pruefung-b2.json + haerte 32 (8×4) + muendlich 24 موجودة. `haerte` 32 (8×4 Fertigkeiten) + `pruefung-b2.json` 400/240 — **مكتمل (R401)**

3. **الأدوات 1000 وهمية جزئياً:** `tool-catalog 1000` و `injector 1000/1000 (100%)` — كل أداة تُحقن 5min بنشاط منهجي (CEFR+Goethe+Bloom) + SRS مدمج — **مكتمل (R397/R401)**

## 4. خطة R398→R410 المقترحة (12 يوم)

- ✅ R398: B2 Grammatik 4 دروس (passiv, konjunktiv2-vht, nominalisierung, partizipial) — مكتمل 87/87 + 88 Eselsbrücken
- ⏳ R399: B2 Lesen/Hören 20+12 بنك امتحاني — مؤجل (يتطلب audio/radar/lang 1103→1400 — كسر smoke)
- ✅ R400: B2 Wortliste 1940 (B1→B2 800 مرجعية مغطاة رقمياً — Goethe Übergang)
- ✅ R401: Prüfungsbank 32 (8×4) + muendlich 24 + pakete 6 + pruefung-b2.json 400/240 مكتمل

بدونها: المشروع ممتاز لـ A1-B1، ناقص لـ B2.

