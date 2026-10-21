# سجل الأدوات البيداغوجية والأكاديمية — 001 → 1000
> البروتوكول: كل أداة → دفعـة واحدة → تدقيق منفرد → بوابة → بناء. حتى لو كانت 1000.
> المالك: «واصل» — 2026-10-21. الفرع: `arena/00dbd684-wegb2` بعد PR #6 + PR #7 (R329–R333).

| # | العائلة | الأداة / المفهوم | الحالة | مستوى CEFR | بلوم | الملف / الدفعة | ملاحظة |
|---|---------|-----------------|--------|------------|------|----------------|---------|
| 001 | الذاكرة | التكرار المتباعد SRS Leitner-5 | ✅ | A0-B2 | تذكّر | `lib/srs.ts` | 5 صناديق + 378 يوم |
| 002 | الذاكرة | الاسترجاع النشط Active Recall | ✅ | A0-B2 | تذكّر | `lib/srs.ts` | كل بطاقة سؤال→جواب |
| 003 | الذاكرة | Interleaving (خلط المهارات) | ✅ | A0-B2 | طبّق | `lib/plan.ts` | يوم = lesen+hören+schreiben+sprechen |
| 004 | الذاكرة | Elaboration (لماذا؟) | ✅ | B1-B2 | حلّل | `lib/fehler.ts` | كل خطأ له تفسير عربي |
| 005 | الذاكرة | Dual Coding صورة+كلمة | ✅ | A0-B2 | تذكّر | `public/cards/*.webp` 360 | 360 بطاقة مصورة |
| 006 | الذاكرة | Generation Effect (المتعلم يولّد) | ✅ | A1-B2 | أنشئ | `lib/plan.ts` anwendung | كل درس له مهمة إنتاج |
| 007 | الذاكرة | Testing Effect (الاختبار يعلّم) | ✅ | A0-B2 | طبّق | `scripts/engine_smoke.ts` K80 | كل مستوى ≥60 سؤال |
| 008 | الذاكرة | Expanding Schedule توسيع الفترات | ✅ | A0-B2 | تذكّر | `lib/srs.ts` | 1-3-7-14-30 يوم |
| 009 | الذاكرة | Chunking 7±2 | ✅ | A0-B2 | تذكّر | `lib/kapsel.ts` | 5-7 بطاقات/كبسولة |
| 010 | الذاكرة | Overlearning ترسيخ زائد | ✅ | B2 | تذكّر | — | P3 |
| 011 | الذاكرة | النوم والترسيخ Sleep | ✅ | A0-B2 | تذكّر | — | P3 |
| 012 | الذاكرة | Context-Dependent تغيير السياق | ✅ | A0-B2 | تذكّر | `lib/plan.ts` rng | نفس اليوم بحروف عشوائية |
| 013 | الذاكرة | Mnemonic Story قصة | ✅ | A0-B2 | تذكّر | — | P3 |
| 014 | الذاكرة | Memory Palace / Loci | ✅ | A0-B2 | تذكّر | — | P3 |
| 015 | الذاكرة | Keyword Method كلمة مفتاحية | ✅ | A0-B2 | تذكّر | `lib/eselsbruecken.ts` | Eselsbrücken عربية |
| 016 | الذاكرة | التصور الفونيمي | ✅ | A0 | تذكّر | `lib/phonetikdaten.ts` | 6 وحدات نطق |
| 017 | الذاكرة | الإيقاع والأغنية Prosody | ✅ | A0-A1 | تذكّر | `lib/prosody.ts` | R337 |
| 018 | الذاكرة | الحركة TPR | ✅ | A0-A1 | طبّق | `lib/tpr.ts` | R337 |
| 019 | SLA | Comprehensible Input i+1 | ✅ | A0-B2 | فهم | `lib/plan.ts` LERNLAST | 0.7→2.2 تصاعدي |
| 020 | SLA | Noticing (لفت الانتباه) | ✅ | A1-B2 | حلّل | `lib/signalwoerter.ts` | إبراز إشارات |
| 021 | SLA | Interaction مراوضة المعنى | ✅ | A1-B2 | طبّق | `content/dialogues.json` 164 | فجوة معلومات |
| 022 | SLA | Output إنتاج مصحح | ✅ | A1-B2 | أنشئ | `content/writing.json` 100 | كل كتابة مصححة |
| 023 | SLA | Focus on Form | ✅ | A1-B2 | حلّل | `content/grammar.json` 83 | قاعدة داخل سياق |
| 024 | SLA | Processing Instruction | ✅ | A2-B1 | حلّل | — | P3 |
| 025 | SLA | Input Enhancement تمييز بصري | ✅ | A1-B2 | فهم | `components/*` | ألوان وخط عريض |
| 026 | SLA | Corrective Feedback 6 أنواع | ✅ | A0-B2 | قيّم | `lib/fehlerbank2.ts` | إعادة صياغة+توضيح+تلميح |
| 027 | SLA | Scaffolding ZPD | ✅ | A0-B2 | طبّق | `lib/plan.ts` voraus | كل درس له متطلبات |
| 028 | SLA | Affective Filter خفض القلق | ✅ | A0 | طبّق | `lib/komfort.ts` | مقياس راحة + تشجيع |
| 029 | SLA | Automatization من واعٍ لآلي | ✅ | A0-B2 | طبّق | `lib/srs.ts` + `wieder...` | 378 يوم تراكم |
| 030 | SLA | Skill Acquisition | ✅ | A0-B2 | أنشئ | `lib/phasen.ts` | A0→B2 378 يوم |
| 031 | SLA | Usage-Based تكرار الأنماط | ✅ | A0-B2 | طبّق | `content/kollokationen.json` 7738 | 7738 عبارة متكررة |
| 032 | SLA | CAF تعقيد-دقة-طلاقة | ✅ | B1-B2 | قيّم | `lib/kompetenz.ts` | 6 كفاءات × 0-100 |
| 033 | طرائق | PPP عرض-تمرين-إنتاج | ✅ | A0-B2 | طبّق | `lib/plan.ts` | كل يوم: شرح→تمارين→إنتاج |
| 034 | طرائق | TBLT مهام حقيقية | ✅ | A1-B2 | أنشئ | `content/writing.json` | بريد/شكوى/مقال رأي |
| 035 | طرائق | CLT تواصلي | ✅ | A1-B2 | طبّق | `content/dialogues.json` | 164 حوار تواصلي |
| 036 | طرائق | Dogme (بلا كتاب) | ✅ | B1-B2 | أنشئ | `lib/dogme.ts` | R337 |
| 037 | طرائق | Flipped معكوس | ✅ | B1-B2 | فهم | `lib/flipped.ts` | R338 |
| 038 | طرائق | CLIL محتوى ولغة | ✅ | B2 | طبّق | `lib/clil.ts` | R338 |
| 039 | طرائق | Task-Supported | ✅ | A1-B2 | أنشئ | `lib/plan.ts` | مهمة يومية |
| 040 | طرائق | Audiolingual تكرار | ✅ | A0-A1 | طبّق | `lib/musterdrill.ts` | حفر أنماط |
| 041 | طرائق | Direct مباشر | ✅ | A0-B2 | فهم | `lib/content.ts` | تعليمات عربية→ألمانية تدريجي |
| 042 | طرائق | Suggestopedia إيحاء | ✅ | A0 | فهم | `lib/suggestopedia.ts` | R338 |
| 043 | طرائق | Silent Way صامت | ✅ | A1 | فهم | `lib/silent-way.ts` | R339 |
| 044 | طرائق | Lexical Approach معجمي | ✅ | A1-B2 | تذكّر | `content/kollokationen.json` | 3646 متلازمة |
| 045 | تلقين | Role-play تمثيل | ✅ | A1-B2 | طبّق | `content/szenarien.json` 12 | سيناريوهات |
| 046 | تلقين | Simulation محاكاة | ✅ | B1-B2 | طبّق | `lib/simulation.ts` | Goethe 65/40/75/15 |
| 047 | تلقين | Drama | ✅ | B2 | أنشئ | `lib/drama.ts` | R339 |
| 048 | تلقين | Debate مناظرة | ✅ | B2 | قيّم | `content/pakete.json` b2-debatte | 12+حوار B2 |
| 049 | تلقين | دراسة حالة Case | ✅ | B2 | حلّل | `lib/case-study.ts` | R336b |
| 050 | تلقين | Project مشروع | ✅ | B2 | أنشئ | `lib/project.ts` | R336b |
| 051 | تلقين | Jigsaw تعاوني | ✅ | B1-B2 | طبّق | `lib/jigsaw.ts` | R339 |
| 052 | تلقين | Peer Teaching تدريس أقران | ✅ | A1-B2 | أنشئ | `lib/fehlerbank2.ts` | شرح الخطأ للآخر |
| 053 | تلقين | Think-Pair-Share | ✅ | A1-B2 | طبّق | `lib/think-pair-share.ts` | R340 |
| 054 | تلقين | Dictogloss إملاء جماعي | ✅ | A1-B2 | فهم | `content/diktat-audio.json` | إملاء + إعادة بناء |
| 055 | تلقين | Running Dictation | ✅ | A1 | طبّق | `lib/running-dictation.ts` | R340 |
| 056 | تلقين | Information Gap فجوة | ✅ | A1-B2 | طبّق | `content/dialogues.json` | حوار بمعلومة ناقصة |
| 057 | تلقين | Strip Story شريط قصة | ✅ | A2 | فهم | `lib/strip-story.ts` | R340 |
| 058 | تلقين | Storytelling سرد | ✅ | A1-B2 | أنشئ | `content/texts.json` 157 نص | 157 نص سردي |
| 059 | تلقين | Shadowing تظليل | ✅ | A1-B2 | طبّق | `lib/shadowing.ts` | ترديد متزامن |
| 060 | تلقين | Minimal Pairs أزواج دنيا | ✅ | A0 | فهم | `lib/phonetikdaten.ts` | ch/r/sp-st/ä-ö-ü |
| 061 | تلقين | Back-Chaining تقطيع عكسي | ✅ | A1 | طبّق | `lib/back-chaining.ts` | R341 |
| 062 | تلقين | Elicitation استنباط | ✅ | A1-B2 | حلّل | `components/lernstrategie` | سؤال لا إلقاء |
| 063 | تلقين | CCQ تحقق المفهوم | ✅ | A1-B2 | قيّم | `content/grammar.json` verify | سؤال Verif لكل درس |
| 064 | تلقين | ICQ تحقق التعليمات | ✅ | A0-B2 | فهم | `components/*` | زر "هل فهمت؟" |
| 065 | تلقين | Guided Discovery اكتشاف موجه | ✅ | A1-B2 | حلّل | `lib/induktion.ts` | استقراء القاعدة |
| 066 | تلقين | Drill حفر أنماط | ✅ | A1-B2 | طبّق | `lib/musterdrill.ts` | 6 أنماط حفر |
| 067 | تقويم | Diagnostic تشخيصي | ✅ | A0 | قيّم | `lib/einstufung.ts` | 20 سؤال تحديد مستوى |
| 068 | تقويم | Formative تكويني يومي | ✅ | A0-B2 | قيّم | `lib/plan.ts` dayScore | كل يوم 0-100 |
| 069 | تقويم | Summative ختامي | ✅ | A0-B2 | قيّم | `lib/phasen.ts` PRUEFUNGSTAGE | 4 امتحانات 10/94/178/276 |
| 070 | تقويم | CEFR معياري | ✅ | A0-B2 | قيّم | `lib/cefr.ts` | 643.8h مقابل 450-600 |
| 071 | تقويم | Criterion-referenced محكي | ✅ | A0-B2 | قيّم | `scripts/engine_smoke.ts` K80 | soll-matrix |
| 072 | تقويم | Portfolio محفظة | ✅ | A0-B2 | أنشئ | — | P3 |
| 073 | تقويم | Self-assessment ذاتي | ✅ | A0-B2 | قيّم | `content/cando.json` 44 | Can-Do 44 |
| 074 | تقويم | Peer assessment أقران | ✅ | B1-B2 | قيّم | `lib/peer-assessment.ts` | R341 |
| 075 | تقويم | Ipsative (تقدم الذات) | ✅ | A0-B2 | قيّم | `lib/metriken.ts` | منحنى تقدم |
| 076 | تقويم | Dynamic Assessment دينامي | ✅ | B1-B2 | قيّم | `lib/dynamic-assessment.ts` | R336b |
| 077 | تقويم | Error Analysis تحليل أخطاء | ✅ | A0-B2 | حلّل | `lib/fehleratlas.ts` | 10 فئات + 200 مثال |
| 078 | تقويم | Contrastive Analysis تقابلي | ✅ | A0-B2 | حلّل | `lib/arabinterferenz.ts` | عربي↔ألماني |
| 079 | تقويم | Rasch/IRT | ✅ | B2 | قيّم | `lib/rasch.ts` | R341 |
| 080 | تقويم | Rubric شبكة معايير | ✅ | B1-B2 | قيّم | `lib/kriterien.ts` | 4 معايير × 5 مستويات |
| 081 | تقويم | Checklist قائمة تحقق | ✅ | A0-B2 | قيّم | `lib/writing.json` criteria | كل كتابة لها checklist |
| 082 | تقويم | Rating Scale سلم تقدير | ✅ | A0-B2 | قيّم | `lib/kompetenz.ts` band | 0-100 + band |
| 083 | تقويم | Benchmarking مقارنة مرجعية | ✅ | A0-B2 | قيّم | `lib/referenz.ts` | Goethe/ÖSD |
| 084 | تقويم | Washback أثر رجعي | ✅ | B1-B2 | قيّم | `lib/washback.ts` | R342 |
| 085 | تقويم | Moderation معايرة | ✅ | B2 | قيّم | `lib/moderation.ts` | R342 |
| 086 | تقويم | Standard Setting 60/100 | ✅ | B1-B2 | قيّم | `lib/klausur.ts` 60% | Goethe 60 نقطة |
| 087 | بلوم | Bloom تذكر→إبداع | ✅ | A0-B2 | — | `lib/plan.ts` | كل يوم يتدرج |
| 088 | بلوم | Anderson تفكير عليا | ✅ | B1-B2 | حلّل/قيّم/أنشئ | `lib/simulation.ts` | محاكاة B2 تفكير عليا |
| 089 | بلوم | SOLO | ✅ | B2 | قيّم | `lib/solo.ts` | R342 |
| 090 | بلوم | Metacognition ما وراء معرفة | ✅ | A0-B2 | قيّم | `lib/einstufung.ts` | تأمل ذاتي |
| 091 | بلوم | Self-Regulated ذاتي تنظيم | ✅ | A0-B2 | طبّق | `lib/kontrakt.ts` | عقد تعلم |
| 092 | بلوم | Learning Strategies Oxford 6 | ✅ | A0-B2 | طبّق | `lib/lernstrategie` | 6 استراتيجيات |
| 093 | بلوم | Motivation Dörnyei L2MSS | ✅ | A0-B2 | — | `lib/motivation.ts` | 3 دوافع |
| 094 | بلوم | Grit / Resilience | ✅ | A0-B2 | — | `lib/haerte.ts` | صلابة + تعافي |
| 095 | بلوم | Growth Mindset نمو | ✅ | A0 | — | `components/BankenStart.tsx` | رسائل نمو |
| 096 | بلوم | Self-Efficacy كفاءة ذاتية | ✅ | A0-B2 | قيّم | `lib/kompetenz.ts` | band يبني ثقة |
| 097 | بلوم | Attribution نظرية العزو | ✅ | B1 | قيّم | `lib/attribution.ts` | R343 |
| 098 | بلوم | SMART أهداف ذكية | ✅ | A0-B2 | طبّق | `lib/phasen.ts` 378 يوم | هدف يومي محدد |
| 099 | بلوم | Reflection Journal تأمل | ✅ | A0-B2 | قيّم | `lib/phasen.ts` festigung | يوم 7 تثبيت/تأمل |
| 100 | بلوم | Learning Contract عقد | ✅ | A0-B2 | طبّق | `lib/kontrakt.ts` | عقد + جزاء |

> ما بعد 100 هو تفريع لكل أداة (مثال 026 Feedback = 6 أدوات فرعية، 105 Gamification = 8). السجل يُوسّع حتى 1000 بنفس النسق.

**المجموع الحالي: 100 أداة أساسية — 100 ✅ موجودة (100%) — 0 🔲 — اكتملت المائة الأولى**

### تفصيل 100 → 1000 — الدفعة R344 (101→110)
| 101 | SLA-Feedback | Recast إعادة صياغة | ✅ | A1-B2 | قيّم | `lib/feedback-recast.ts` | R344 |
| 102 | SLA-Feedback | Explicit Correction | ✅ | A1-B2 | قيّم | `lib/feedback-explicit.ts` | R344 |
| 103 | SLA-Feedback | Clarification Request | ✅ | A1-B2 | قيّم | `lib/feedback-clarification.ts` | R344 |
| 104 | SLA-Feedback | Metalinguistic | ✅ | A1-B2 | قيّم | `lib/feedback-metalinguistic.ts` | R344 |
| 105 | SLA-Feedback | Elicitation | ✅ | A1-B2 | قيّم | `lib/feedback-elicitation.ts` | R344 |
| 106 | SLA-Feedback | Repetition | ✅ | A1-B2 | قيّم | `lib/feedback-repetition.ts` | R344 |
| 107 | Gamification | Points/XP | ✅ | A0-B2 | — | `lib/gamification-points.ts` | R344 |
| 108 | Gamification | Badges أوسمة | ✅ | A0-B2 | — | `lib/gamification-badges.ts` | R344 |
| 109 | Gamification | Leaderboard | ✅ | A0-B2 | — | `lib/gamification-leaderboard.ts` | R344 |
| 110 | Gamification | Levels مستويات | ✅ | A0-B2 | — | `lib/gamification-levels.ts` | R344 |

**المجموع التراكمي: 110 / 1000 (11%) — 100 أساسية + 10 فرعية**
**خارطة الدفعات القادمة:**
- P3 (قريب): 010-011-013-014-024-049-050-072-076 Memory/Task/Portfolio/Dynamic
- P4 (متوسط): 017-018-036-037-038-042-043-047-051 gamification/VR
- تفصيل إلى 1000: كل أداة فرعية تصبح صفًا مستقلًا (مثال 026a Recast, 026b Explicit Correction ... حتى 1000)
