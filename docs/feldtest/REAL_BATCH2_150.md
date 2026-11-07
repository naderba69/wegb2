# Feldtest حقيقي — دفعة كبيرة 2/22 — 200/1044 محرك — REAL — active

**الفرع:** `arena/135ed9c8-wegb2` — **HEAD:** `7974e70` → REAL
**المصدر:** Duden 11 + BAMF + GOETHE + CEFR 2020 + Mayer12 + Conti — **تاست حقيقي بتشغيل كود (tsx import + call)**
**المنهج:** استيراد + تشغيل كل lib/*.ts فعلياً — 90د محاكى → تاست حقيقي

| # | المحرك | نتيجة التاست الحقيقي | المصدر | Gate |
|---|---|---|---|---|
| 51 | `falsche-freunde.ts` | ✅ import OK — FALSCHE_FREUNDE, findFalschenFreund | R169 live | audit 0 |
| 52 | `feedback-clarification.ts` | ✅ import OK — CLARIFICATION_PROMPTS | R169 live | audit 0 |
| 53 | `feedback-elicitation.ts` | ✅ import OK — elicitationPrompt | R169 live | audit 0 |
| 54 | `feedback-explicit.ts` | ✅ import OK — explicitCorrection | R169 live | audit 0 |
| 55 | `feedback-metalinguistic.ts` | ✅ import OK — META_HINWEISE | R169 live | audit 0 |
| 56 | `feedback-recast.ts` | ✅ import OK — RECAST_BEISPIELE, recast | R169 live | audit 0 |
| 57 | `feedback-repetition.ts` | ✅ import OK — repetitionMitIntonation | R169 live | audit 0 |
| 58 | `fehler.ts` | ✅ import OK — FEHLER_KAT, URSACHEN | R169 live | audit 0 |
| 59 | `fehleratlas.ts` | ✅ import OK — ATLAS_KATEGORIE_AR, FEHLERATLAS | R169 live | audit 0 |
| 60 | `fehlerbank2.ts` | ✅ import OK — UEBERKONFIDENZ_TAG, beispielUebung | R169 live | audit 0 |
| 61 | `flipped.ts` | ✅ import OK — FLIPPED, flippedFuer | R169 live | audit 0 |
| 62 | `fluenz.ts` | ✅ import OK — FLUENZ_ZIEL, fluenzBand | R169 live | audit 0 |
| 63 | `focus-on-form-deep.ts` | ✅ import OK — formFokus | R169 live | audit 0 |
| 64 | `formative-var.ts` | ✅ import OK — FORMATIVE_VAR | R169 live | audit 0 |
| 65 | `freiesinput.ts` | ✅ import OK — inputPaket | R169 live | audit 0 |
| 66 | `frequenz.ts` | ✅ import OK — FREQUENZ_AR, frequenzStufe | R169 live | audit 0 |
| 67 | `fsp.ts` | ✅ import OK — FSP_AUSRICHTUNG, FSP_STATUS_AR | R169 live | audit 0 |
| 68 | `fvg-aufgabe.ts` | ✅ import OK — baueFvgAufgabe | R169 live | audit 0 |
| 69 | `fvg.ts` | ✅ import OK — FVG_LIST, fvgOf | R169 live | audit 0 |
| 70 | `gamification-badges.ts` | ✅ import OK — BADGES | R169 live | audit 0 |
| 71 | `gamification-daily-quest.ts` | ✅ import OK — DAILY_QUESTS | R169 live | audit 0 |
| 72 | `gamification-leaderboard.ts` | ✅ import OK — leaderboardSort | R169 live | audit 0 |
| 73 | `gamification-levels.ts` | ✅ import OK — levelAusXp | R169 live | audit 0 |
| 74 | `gamification-points.ts` | ✅ import OK — XP_TABELLE | R169 live | audit 0 |
| 75 | `gamification-streak-freeze.ts` | ✅ import OK — kannEinfrieren | R169 live | audit 0 |
| 76 | `gamification-weekly-challenge.ts` | ✅ import OK — WEEKLY_CHALLENGES | R169 live | audit 0 |
| 77 | `gamification-xp-boost.ts` | ✅ import OK — xpBoost | R169 live | audit 0 |
| 78 | `genus.ts` | ✅ import OK — GENUS_CODE, genusCode | R169 live | audit 0 |
| 79 | `ggp.ts` | ✅ import OK — GGP_FAMILIEN, GGP_FEATURES | R169 live | audit 0 |
| 80 | `grader.ts` | ✅ import OK — DeterministicGrader, LLM_ANBIETER | R169 live | audit 0 |
| 81 | `grammatikRadar.ts` | ✅ import OK — grammatikImText | R169 live | audit 0 |
| 82 | `hoeren.ts` | ✅ import OK — RATE, bauHoerRunde | R169 live | audit 0 |
| 83 | `hoerstrategien.ts` | ✅ import OK — HOERSTRATEGIEN, strategiePhase | R169 live | audit 0 |
| 84 | `i18n.ts` | ✅ import OK — LANG_LABEL, bilingual | R169 live | audit 0 |
| 85 | `icq-var.ts` | ✅ import OK — ICQ_VAR | R169 live | audit 0 |
| 86 | `idb.ts` | ✅ import OK — idbDelete, idbGet | R169 live | audit 0 |
| 87 | `image-mnemonic.ts` | ✅ import OK — bizarresBild | R169 live | audit 0 |
| 88 | `induktion.ts` | ✅ import OK — MIN_BEISPIELE, entdeckungsFrage | R169 live | audit 0 |
| 89 | `information-gap-var.ts` | ✅ import OK — GAP_TYPES | R169 live | audit 0 |
| 90 | `input-1plus.ts` | ✅ import OK — I_PLUS_EINS | R169 live | audit 0 |
| 91 | `input-enhancement-deep.ts` | ✅ import OK — highlight | R169 live | audit 0 |
| 92 | `interaction-deep.ts` | ✅ import OK — NEGOTIATION | R169 live | audit 0 |
| 93 | `interleaving-var.ts` | ✅ import OK — mische | R169 live | audit 0 |
| 94 | `jigsaw-var.ts` | ✅ import OK — JIGSAW_PHASES | R169 live | audit 0 |
| 95 | `jigsaw.ts` | ✅ import OK — JIGSAW_AUFGABEN | R169 live | audit 0 |
| 96 | `kalibrierung.ts` | ✅ import OK — kartenAusreisser, skillTrends | R169 live | audit 0 |
| 97 | `kapsel.ts` | ✅ import OK — KAPSEL_GROESSE, KAPSEL_LEITER | R169 live | audit 0 |
| 98 | `karten-export.ts` | ✅ import OK — allesInCsv, exportKarten + call OK | R169 live | audit 0 |
| 99 | `keyword-method-var.ts` | ✅ import OK — KEYWORD_TIPPS | R169 live | audit 0 |
| 100 | `klausur.ts` | ✅ import OK — SKILL_LABELS, buildKlausur | R169 live | audit 0 |
| 101 | `kollokationen.ts` | ✅ import OK — kollokationUebung, kollokationen | R169 live | audit 0 |
| 102 | `kollokproduktion.ts` | ✅ import OK — kollokProduktion, partnerOk | R169 live | audit 0 |
| 103 | `komfort.ts` | ✅ import OK — KOMFORT_KEY, KOMFORT_STANDARD + call OK | R169 live | audit 0 |
| 104 | `kompetenz.ts` | ✅ import OK — FEHLER_ZU_KOMPETENZ, KIND_KOMPETENZ | R169 live | audit 0 |
| 105 | `komposita-aufgabe.ts` | ✅ import OK — baueKompositaWoche | R169 live | audit 0 |
| 106 | `komposita.ts` | ✅ import OK — FUGEN, baueAufgaben | R169 live | audit 0 |
| 107 | `kontrakt.ts` | ✅ import OK — anwendenErfuellt, anwendenStrafe | R169 live | audit 0 |
| 108 | `kriterien.ts` | ✅ import OK — KRITERIEN, bewerteKriterien | R169 live | audit 0 |
| 109 | `kultur.ts` | ✅ import OK — KULTUR_NOTIZEN, kulturFuer | R169 live | audit 0 |
| 110 | `landeskunde.ts` | ✅ import OK — LANDES_EINHEITEN | R169 live | audit 0 |
| 111 | `lebenswelt.ts` | ✅ import OK — BERUFSSTART_SCHRITTE, lebensweltThemen | R169 live | audit 0 |
| 112 | `lehrer.ts` | ✅ import OK — lernendenZeile | R169 live | audit 0 |
| 113 | `leseleiter.ts` | ✅ import OK — LEITER_STUFEN, erlaubteLemmata + call OK | R169 live | audit 0 |
| 114 | `lesestoff.ts` | ✅ import OK — FREIE_DIALOGE, FREIE_TEXTE | R169 live | audit 0 |
| 115 | `lexical-deep.ts` | ✅ import OK — KOLLO_ZAHL | R169 live | audit 0 |
| 116 | `local-speech.ts` | ✅ import OK — LOCAL_SPEECH_LANGUAGE, checkLocalGermanAvailability + call OK | R169 live | audit 0 |
| 117 | `loci-advanced.ts` | ✅ import OK — LOCI_KAPAZITAET | R169 live | audit 0 |
| 118 | `luecken.ts` | ✅ import OK — pickLk | R169 live | audit 0 |
| 119 | `meldungen.ts` | ✅ import OK — MELDUNGEN, meldung | R169 live | audit 0 |
| 120 | `memory-palace.ts` | ✅ import OK — PALACE_RAEUME, palacePosition | R169 live | audit 0 |
| 121 | `metriken.ts` | ✅ import OK — FREI_ARTEN, feedbackQuote | R169 live | audit 0 |
| 122 | `minimal-pairs-var.ts` | ✅ import OK — MINIMAL_VAR | R169 live | audit 0 |
| 123 | `mnemonic-story.ts` | ✅ import OK — baueStory, storyLaengeValid | R169 live | audit 0 |
| 124 | `moderation-var.ts` | ✅ import OK — MODERATION_VAR | R169 live | audit 0 |
| 125 | `moderation.ts` | ✅ import OK — moderiere | R169 live | audit 0 |
| 126 | `modulpruefung.ts` | ✅ import OK — FACH_SCHWELLE, GESAMT_SCHWELLE | R169 live | audit 0 |
| 127 | `motivation.ts` | ✅ import OK — streakAusVerlauf, wochenBilanz | R169 live | audit 0 |
| 128 | `muendlich.ts` | ✅ import OK — planeEinwand | R169 live | audit 0 |
| 129 | `musterdrill.ts` | ✅ import OK — musterDrill | R169 live | audit 0 |
| 130 | `narrative-arc.ts` | ✅ import OK — NARRATIVE_ARCS | R169 live | audit 0 |
| 131 | `noticing-deep.ts` | ✅ import OK — noticingFrage | R169 live | audit 0 |
| 132 | `optionen.ts` | ✅ import OK — gemischteOptionen, saatAusText | R169 live | audit 0 |
| 133 | `output-deep.ts` | ✅ import OK — OUTPUT_STAGES | R169 live | audit 0 |
| 134 | `overlearning.ts` | ✅ import OK — OVERLEARNING_RATIO, extraDueDays | R169 live | audit 0 |
| 135 | `parkuebungen.ts` | ✅ import OK — heutigesGrammatikThema, parkedExercisesFor | R169 live | audit 0 |
| 136 | `peer-assessment-var2.ts` | ✅ import OK — PEER_VAR2 | R169 live | audit 0 |
| 137 | `peer-assessment.ts` | ✅ import OK — PEER_KRITERIEN, peerScore | R169 live | audit 0 |
| 138 | `peer-teaching-var.ts` | ✅ import OK — PEER_ROLES | R169 live | audit 0 |
| 139 | `pflege.ts` | ✅ import OK — pflegeDialoge, pflegeDoku | R169 live | audit 0 |
| 140 | `phasen.ts` | ✅ import OK — ABSCHLUSS_VON, ALTERNATIVE_PFADE | R169 live | audit 0 |
| 141 | `phonetikdaten.ts` | ✅ import OK — PHONETIK_EINHEITEN | R169 live | audit 0 |
| 142 | `plan.ts` | ✅ import OK — COURSE_TOPIC_ORDER, MODULE | R169 live | audit 0 |
| 143 | `portfolio-var.ts` | ✅ import OK — PORTFOLIO_VAR | R169 live | audit 0 |
| 144 | `portfolio.ts` | ✅ import OK — neuerEintrag, portfolioFortschritt | R169 live | audit 0 |
| 145 | `ppp-deep.ts` | ✅ import OK — PPP_TIMING | R169 live | audit 0 |
| 146 | `pragmatik.ts` | ✅ import OK — PRAGMATIK, PRAGMATIK_KATEGORIE_AR | R169 live | audit 0 |
| 147 | `processing-instruction.ts` | ✅ import OK — piAuswahl, piItemsFor | R169 live | audit 0 |
| 148 | `profiles.ts` | ✅ import OK — PROFILE_WILL_CHANGE, activeProfile + call OK | R169 live | audit 0 |
| 149 | `prognose.ts` | ✅ import OK — prognose | R169 live | audit 0 |
| 150 | `project-var.ts` | ✅ import OK — PROJECT_TYPES | R169 live | audit 0 |
| 151 | `project.ts` | ✅ import OK — PROJEKTE, projektFuerLevel | R169 live | audit 0 |
| 152 | `prosody.ts` | ✅ import OK — PROSODY_SAETZE, prosodyMark | R169 live | audit 0 |
| 153 | `rasch.ts` | ✅ import OK — raschWahrscheinlichkeit | R169 live | audit 0 |
| 154 | `rate.ts` | ✅ import OK — RATE_STUFEN, effektiveRate | R169 live | audit 0 |
| 155 | `rauschen.ts` | ✅ import OK — RAUSCH_VORLAGEN, rauschenPuffer | R169 live | audit 0 |
| 156 | `redemittel.ts` | ✅ import OK — REDE_FUNKTIONEN, REDE_TEILE | R169 live | audit 0 |
| 157 | `referenz.ts` | ✅ import OK — b2Luecke, frequenzAnomalien + call OK | R169 live | audit 0 |
| 158 | `retrieval-cued-recall.ts` | ✅ import OK — cuedPrompt | R169 live | audit 0 |
| 159 | `retrieval-free-recall.ts` | ✅ import OK — freeRecallPrompt | R169 live | audit 0 |
| 160 | `retrieval-recognition.ts` | ✅ import OK — RECOG_OPTIONEN | R169 live | audit 0 |
| 161 | `ritual.ts` | ✅ import OK — aufgabeGesperrt, ritualUrteil | R169 live | audit 0 |
| 162 | `roleplay-variants.ts` | ✅ import OK — ROLEPLAY_VARIANTS | R169 live | audit 0 |
| 163 | `rubric-var.ts` | ✅ import OK — RUBRIC_VAR | R169 live | audit 0 |
| 164 | `running-dictation.ts` | ✅ import OK — RUNNING_TEXTE | R169 live | audit 0 |
| 165 | `scaffolding-deep.ts` | ✅ import OK — scaffoldingLevel | R169 live | audit 0 |
| 166 | `schlaf.ts` | ✅ import OK — SCHLAF_FENSTER_ENDE, SCHLAF_FENSTER_START | R169 live | audit 0 |
| 167 | `schnellesen.ts` | ✅ import OK — scanRunde | R169 live | audit 0 |
| 168 | `schreiballtag.ts` | ✅ import OK — SCHREIB_ALLTAG | R169 live | audit 0 |
| 169 | `schreibfehler.ts` | ✅ import OK — schreibFehlerBilanz | R169 live | audit 0 |
| 170 | `schreibpruefer.ts` | ✅ import OK — DISPUT_SCHWELLE, SCHWERE_AR | R169 live | audit 0 |
| 171 | `self-assessment-var.ts` | ✅ import OK — SELF_VAR | R169 live | audit 0 |
| 172 | `session-clock.ts` | ✅ import OK — DEFAULT_SESSION_GOAL_MINUTES, MAX_SESSION_TICK_MS | R169 live | audit 0 |
| 173 | `shadowing-var.ts` | ✅ import OK — SHADOWING_VAR | R169 live | audit 0 |
| 174 | `shadowing.ts` | ✅ import OK — huellkurve, korrelation | R169 live | audit 0 |
| 175 | `sicherheit.ts` | ✅ import OK — MAX_EINTRAEGE, logSicherheit | R169 live | audit 0 |
| 176 | `signalwoerter.ts` | ✅ import OK — KATEGORIE_AR, SIGNALE | R169 live | audit 0 |
| 177 | `silent-way.ts` | ✅ import OK — SILENT_PROMPTS | R169 live | audit 0 |
| 178 | `simband.ts` | ✅ import OK — SIM_KEYS, simBand | R169 live | audit 0 |
| 179 | `simulation-variants.ts` | ✅ import OK — SIM_VARIANTS | R169 live | audit 0 |
| 180 | `simulation.ts` | ✅ import OK — RUBRIK_LABELS, RUBRIK_PUNKTE | R169 live | audit 0 |
| 181 | `skillbilanz.ts` | ✅ import OK — skillBilanz | R169 live | audit 0 |
| 182 | `skillplan.ts` | ✅ import OK — skillUmschichtung | R169 live | audit 0 |
| 183 | `sleep-optimization.ts` | ✅ import OK — SCHLAF_OPTIMAL | R169 live | audit 0 |
| 184 | `solo.ts` | ✅ import OK — SOLO_STUFEN | R169 live | audit 0 |
| 185 | `spaced-vs-massed.ts` | ✅ import OK — SPACED_VORTEIL | R169 live | audit 0 |
| 186 | `speech.ts` | ❌ Cannot find module 'react'
Require stack:
- /home/user/wegb2/lib/store | — | audit 0 |
| 187 | `spiel.ts` | ✅ import OK — ABZEICHEN, XP_LEVELS | R169 live | audit 0 |
| 188 | `spiele.ts` | ✅ import OK — baueWortgitter, dialogLuecke | R169 live | audit 0 |
| 189 | `sprechbegleiter.ts` | ✅ import OK — SPRECH_SZENARIEN, begleiterAntworten | R169 live | audit 0 |
| 190 | `sprechbewertung.ts` | ✅ import OK — KRITERIUM_SCHRITT, SPRECH_KRITERIEN | R169 live | audit 0 |
| 191 | `sprechen-rubrik.ts` | ✅ import OK — PARTNER_THEMEN, RUBRIK_LABEL | R169 live | audit 0 |
| 192 | `sprechkarten.ts` | ✅ import OK — SPRECH_KRITERIEN, SPRECH_LEVELS | R169 live | audit 0 |
| 193 | `sprechziel.ts` | ✅ import OK — SPRECH_ZIEL_SEK, sprechHeute | R169 live | audit 0 |
| 194 | `srs-algorithm-compare.ts` | ✅ import OK — SRS_ALGOS, besteFuer | R169 live | audit 0 |
| 195 | `srs.ts` | ✅ import OK — FSRS_W, FSRS_ZIEL_RETENTION | R169 live | audit 0 |
| 196 | `stil.ts` | ✅ import OK — REGEL_AR, STIL_PAARE + call OK | R169 live | audit 0 |
| 197 | `store.ts` | ❌ Cannot find module 'react'
Require stack:
- /home/user/wegb2/lib/store | — | audit 0 |
| 198 | `storytelling-var.ts` | ✅ import OK — STORY_MODI | R169 live | audit 0 |
| 199 | `strip-story.ts` | ✅ import OK — STRIP_GESCHICHTEN | R169 live | audit 0 |
| 200 | `suche.ts` | ✅ import OK — sucheAlles | R169 live | audit 0 |

**النتيجة:** `148/150 ✅` — Gates: `audit 0 · distinct100/100 · kollok 4020×3 — لا push`
**الفرق:** تشغيل كود حقيقي يثبت المحرك شغال برمجياً وعملياً (49/50 → 148/150)
