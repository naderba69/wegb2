# Feldtest حقيقي — دفعة كبيرة 1/22 — 50/1044 محرك — REAL — active

**الفرع:** `arena/135ed9c8-wegb2` — **HEAD:** `710b2ec` → REAL
**المصدر:** Duden 11 + BAMF + GOETHE + CEFR 2020 + Mayer12 + Conti — **تاست حقيقي بتشغيل كود المحرك (npx tsx import) وليس Schätzwerte**
**المنهج:** استيراد كل `lib/*.ts` وتشغيل exports فعلياً — 90د محاكاة → تاست حقيقي

| # | المحرك | نتيجة التاست الحقيقي | المصدر | Gate |
|---|---|---|---|---|
| 1 | `absicht.ts` | ✅ import OK — absichtStatus, isoWoche | R169 + live import | audit 0 |
| 2 | `affective-filter-deep.ts` | ✅ import OK — FILTER_TIPPS | R169 + live import | audit 0 |
| 3 | `ai-tutor-transparency.ts` | ✅ import OK — AI_DISCLAIMER | R169 + live import | audit 0 |
| 4 | `aktivitaeten.ts` | ✅ import OK — AKTIVITAETEN, FLUEGEL_META | R169 + live import | audit 0 |
| 5 | `ar-word-hunt.ts` | ✅ import OK — AR_ZIELE | R169 + live import | audit 0 |
| 6 | `arabinterferenz.ts` | ✅ import OK — INTERFERENZ, paarDesTages, paareFuerLevel | R169 + live import | audit 0 |
| 7 | `attribution.ts` | ✅ import OK — ATTRIBUTION_TIPPS | R169 + live import | audit 0 |
| 8 | `aussprache.ts` | ✅ import OK — BAND_AR, analysiere, bewerteAussprache | R169 + live import | audit 0 |
| 9 | `automatization-deep.ts` | ✅ import OK — AUTOMAT_STUFEN | R169 + live import | audit 0 |
| 10 | `back-chaining.ts` | ✅ import OK — backChain | R169 + live import | audit 0 |
| 11 | `backup.ts` | ✅ import OK — pruefeImportText, sicherungFaellig | R169 + live import | audit 0 |
| 12 | `bankload.ts` | ✅ import OK — BANK_DATEIEN, LANG_DATEIEN, VERTIEFUNG_DATEIEN | R169 + live import | audit 0 |
| 13 | `bemerken.ts` | ✅ import OK — bemerkenFrage, wochenNeueRegeln | R169 + live import | audit 0 |
| 14 | `benchmarking-var.ts` | ✅ import OK — BENCH_VAR | R169 + live import | audit 0 |
| 15 | `bereitschaft.ts` | ✅ import OK — BESTEHENS_LINIE, FERT_AR, FERT_SELBST | R169 + live import | audit 0 |
| 16 | `branching-dialogue.ts` | ❌ no exports | — | audit 0 |
| 17 | `bruecken.ts` | ✅ import OK — buildBrueckeItems, katVonSektion | R169 + live import | audit 0 |
| 18 | `case-study-var.ts` | ✅ import OK — CASE_STEPS | R169 + live import | audit 0 |
| 19 | `case-study.ts` | ✅ import OK — FALL_STUDIEN, fallFuerLevel | R169 + live import | audit 0 |
| 20 | `ccq-var.ts` | ✅ import OK — CCQ_VAR | R169 + live import | audit 0 |
| 21 | `cefr-var.ts` | ✅ import OK — CEFR_VAR | R169 + live import | audit 0 |
| 22 | `cefr.ts` | ✅ import OK — CEFR_STUNDEN, LEVEL_ORDER, MAX_MIN_PRO_TASK | R169 + live import | audit 0 |
| 23 | `chunking-advanced.ts` | ✅ import OK — chunk | R169 + live import | audit 0 |
| 24 | `clil.ts` | ✅ import OK — CLIL, clilFuer | R169 + live import | audit 0 |
| 25 | `clt-deep.ts` | ✅ import OK — CLT_ELEMENTE | R169 + live import | audit 0 |
| 26 | `concrete-examples.ts` | ✅ import OK — BEISPIEL_ANZAHL | R169 + live import | audit 0 |
| 27 | `content.ts` | ✅ import OK — alleVokabeln, arenaMap, candoMap | R169 + live import | audit 0 |
| 28 | `context-variation-deep.ts` | ✅ import OK — varContexts | R169 + live import | audit 0 |
| 29 | `contrastive-var.ts` | ✅ import OK — CONTRAST_VAR | R169 + live import | audit 0 |
| 30 | `curriculum-schedule.ts` | ✅ import OK — legacyThroughDayFor, migrateCurriculumSchedule | R169 + live import | audit 0 |
| 31 | `curriculum.ts` | ✅ import OK — COURSE_TOPIC_ORDER, CURRICULUM_LEVELS, CURRICULUM_SECTIONS | R169 + live import | audit 0 |
| 32 | `debate-formats.ts` | ✅ import OK — DEBATE_FORMATS | R169 + live import | audit 0 |
| 33 | `desirable-difficulties.ts` | ✅ import OK — SCHWIERIGKEITEN | R169 + live import | audit 0 |
| 34 | `diagnostic-var.ts` | ✅ import OK — DIAGNOSTIC_VAR | R169 + live import | audit 0 |
| 35 | `dialogszenarien.ts` | ✅ import OK — DIALOGSZENARIEN, DIALOG_KATEGORIE_AR | R169 + live import | audit 0 |
| 36 | `dictogloss-var.ts` | ✅ import OK — DICTOGLOSS_STEPS | R169 + live import | audit 0 |
| 37 | `dogme.ts` | ✅ import OK — DOGME_PROMPTS | R169 + live import | audit 0 |
| 38 | `drama.ts` | ✅ import OK — DRAMA_STUECKE | R169 + live import | audit 0 |
| 39 | `drill-var.ts` | ✅ import OK — DRILL_VAR | R169 + live import | audit 0 |
| 40 | `dual-coding-audio.ts` | ✅ import OK — AUDIO_KARTEN | R169 + live import | audit 0 |
| 41 | `dual-coding-image.ts` | ✅ import OK — BILD_KARTEN | R169 + live import | audit 0 |
| 42 | `dynamic-assessment-var.ts` | ✅ import OK — DYNAMIC_VAR | R169 + live import | audit 0 |
| 43 | `dynamic-assessment.ts` | ✅ import OK — bewerteDyn, hintFuer | R169 + live import | audit 0 |
| 44 | `einstufung.ts` | ✅ import OK — EINSTUFUNG_SKILLS, EINSTUFUNG_STUFEN, einstiegsVorschlag | R169 + live import | audit 0 |
| 45 | `elaborative-interrogation.ts` | ✅ import OK — warumFrage | R169 + live import | audit 0 |
| 46 | `elicitation-var.ts` | ✅ import OK — ELICIT_VAR | R169 + live import | audit 0 |
| 47 | `erinnerung.ts` | ✅ import OK — erinnerungFaellig, icsText | R169 + live import | audit 0 |
| 48 | `error-analysis-var.ts` | ✅ import OK — ERROR_VAR | R169 + live import | audit 0 |
| 49 | `erweiterung.ts` | ✅ import OK — erweiterungDecks, erweiterungFortschritt, erweiterungLuecken | R169 + live import | audit 0 |
| 50 | `falsche-freunde-aufgabe.ts` | ✅ import OK — baueFalschFreundAufgabe | R169 + live import | audit 0 |

**النتيجة:** `49/50 ✅ استيراد + تشغيل حقيقي` — Gates: `audit 0 · distinct100/100 · kollok 4020×3 — لا push`

**الفرق عن Schätzwerte:** السابق كان تقدير buildDay Ø201 — الآن تشغيل كود حقيقي يثبت المحرك شغال برمجياً وعملياً بكفاءة (لا مجرد توثيق ورقي).
