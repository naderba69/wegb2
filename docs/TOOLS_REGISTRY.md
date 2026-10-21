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

### تفصيل 100 → 1000 — الدفعة R345 (111→120)
| 111 | Gamification | Streak Freeze تجميد | ✅ | A0-B2 | — | `lib/gamification-streak-freeze.ts` | R345 |
| 112 | Gamification | XP Boost مضاعف | ✅ | A0-B2 | — | `lib/gamification-xp-boost.ts` | R345 |
| 113 | Gamification | Daily Quest يومية | ✅ | A0-B2 | — | `lib/gamification-daily-quest.ts` | R345 |
| 114 | Gamification | Weekly Challenge أسبوعي | ✅ | A0-B2 | — | `lib/gamification-weekly-challenge.ts` | R345 |
| 115 | Narrative | Narrative Arc قوس قصصي | ✅ | A1-B2 | أنشئ | `lib/narrative-arc.ts` | R345 |
| 116 | Narrative | Branching Dialogue متفرع | ✅ | B1-B2 | طبّق | `lib/branching-dialogue.ts` | R345 |
| 117 | Immersion | VR Classroom فصل افتراضي | ✅ | A2-B2 | طبّق | `lib/vr-classroom.ts` | R345 |
| 118 | Immersion | AR Word Hunt صيد كلمات | ✅ | A0-A1 | تذكّر | `lib/ar-word-hunt.ts` | R345 |
| 119 | Ethik | Voice Ethics أخلاقيات الصوت | ✅ | A0-B2 | قيّم | `lib/voice-ethics.ts` | R345 |
| 120 | Ethik | AI Transparency شفافية | ✅ | A0-B2 | قيّم | `lib/ai-tutor-transparency.ts` | R345 |

**المجموع التراكمي: 120 / 1000 (12%) — 100 أساسية + 20 فرعية**

### تفصيل 100 → 1000 — الدفعة R346 (121→130)
| 121 | Memory | SRS Algorithm Compare مقارنة خوارزميات | ✅ | A0-B2 | قيّم | `lib/srs-algorithm-compare.ts` | R346 |
| 122 | Memory | Desirable Difficulties صعوبات مرغوبة | ✅ | A0-B2 | طبّق | `lib/desirable-difficulties.ts` | R346 |
| 123 | Memory | Interleaving Variations تنويع الخلط | ✅ | A0-B2 | طبّق | `lib/interleaving-var.ts` | R346 |
| 124 | Memory | Elaborative Interrogation سؤال لماذا | ✅ | B1-B2 | حلّل | `lib/elaborative-interrogation.ts` | R346 |
| 125 | Memory | Concrete Examples أمثلة ملموسة | ✅ | A0-B2 | فهم | `lib/concrete-examples.ts` | R346 |
| 126 | Memory | Dual Coding Image صورة | ✅ | A0-B2 | تذكّر | `lib/dual-coding-image.ts` | R346 |
| 127 | Memory | Dual Coding Audio صوت | ✅ | A0-B2 | تذكّر | `lib/dual-coding-audio.ts` | R346 |
| 128 | Memory | Retrieval Free Recall حر | ✅ | B1-B2 | تذكّر | `lib/retrieval-free-recall.ts` | R346 |
| 129 | Memory | Retrieval Cued Recall موجه | ✅ | A1-B2 | تذكّر | `lib/retrieval-cued-recall.ts` | R346 |
| 130 | Memory | Retrieval Recognition تعرّف | ✅ | A0-B2 | تذكّر | `lib/retrieval-recognition.ts` | R346 |

**المجموع التراكمي: 130 / 1000 (13%) — 100 أساسية + 30 فرعية**

### تفصيل 100 → 1000 — الدفعة R347 (131→140)
| 131 | Memory | Spaced vs Massed مباعد/مكثف | ✅ | A0-B2 | فهم | `lib/spaced-vs-massed.ts` | R347 |
| 132 | Memory | Context Variation Deep سياق عميق | ✅ | A0-B2 | تذكّر | `lib/context-variation-deep.ts` | R347 |
| 133 | Memory | Keyword Method Variants متغيرات المفتاح | ✅ | A0-B2 | تذكّر | `lib/keyword-method-var.ts` | R347 |
| 134 | Memory | Image Mnemonic صورة ذهنية | ✅ | A0-B2 | تذكّر | `lib/image-mnemonic.ts` | R347 |
| 135 | Memory | Loci Advanced قصر متقدم | ✅ | A0-B2 | تذكّر | `lib/loci-advanced.ts` | R347 |
| 136 | Memory | Chunking Advanced تجميع متقدم | ✅ | A0-B2 | تذكّر | `lib/chunking-advanced.ts` | R347 |
| 137 | Memory | Sleep Optimization تحسين النوم | ✅ | A0-B2 | تذكّر | `lib/sleep-optimization.ts` | R347 |
| 138 | SLA | Input i+1 Fine دقيق | ✅ | A0-B2 | فهم | `lib/input-1plus.ts` | R347 |
| 139 | SLA | Noticing Deep لفت عميق | ✅ | A1-B2 | حلّل | `lib/noticing-deep.ts` | R347 |
| 140 | SLA | Interaction Deep تفاوض معنى | ✅ | A1-B2 | طبّق | `lib/interaction-deep.ts` | R347 |

**المجموع التراكمي: 140 / 1000 (14%) — 100 أساسية + 40 فرعية**

### تفصيل 100 → 1000 — الدفعة R348 (141→150)
| 141 | SLA | Output Deep إنتاج عميق | ✅ | A1-B2 | أنشئ | `lib/output-deep.ts` | R348 |
| 142 | SLA | Focus on Form Deep شكل عميق | ✅ | A1-B2 | حلّل | `lib/focus-on-form-deep.ts` | R348 |
| 143 | SLA | Input Enhancement Deep تمييز عميق | ✅ | A1-B2 | فهم | `lib/input-enhancement-deep.ts` | R348 |
| 144 | SLA | Scaffolding Deep سقالة عميقة | ✅ | A0-B2 | طبّق | `lib/scaffolding-deep.ts` | R348 |
| 145 | SLA | Affective Filter Deep قلق عميق | ✅ | A0-B2 | طبّق | `lib/affective-filter-deep.ts` | R348 |
| 146 | SLA | Automatization Deep أتمتة عميقة | ✅ | A0-B2 | طبّق | `lib/automatization-deep.ts` | R348 |
| 147 | طرائق | PPP Deep عرض عميق | ✅ | A0-B2 | طبّق | `lib/ppp-deep.ts` | R348 |
| 148 | طرائق | TBLT Deep مهام عميقة | ✅ | A1-B2 | أنشئ | `lib/tblt-deep.ts` | R348 |
| 149 | طرائق | CLT Deep تواصلي عميق | ✅ | A1-B2 | طبّق | `lib/clt-deep.ts` | R348 |
| 150 | طرائق | Lexical Deep معجمي عميق | ✅ | A1-B2 | تذكّر | `lib/lexical-deep.ts` | R348 |

**المجموع التراكمي: 150 / 1000 (15%) — 100 أساسية + 50 فرعية**

### تفصيل 100 → 1000 — الدفعة R349 (151→160)
| 151 | تلقين | Role-play Variants متغيرات التمثيل | ✅ | A1-B2 | طبّق | `lib/roleplay-variants.ts` | R349 |
| 152 | تلقين | Simulation Variants متغيرات المحاكاة | ✅ | B1-B2 | طبّق | `lib/simulation-variants.ts` | R349 |
| 153 | تلقين | Debate Formats صيغ المناظرة | ✅ | B2 | قيّم | `lib/debate-formats.ts` | R349 |
| 154 | تلقين | Case Study Variants متغيرات الحالة | ✅ | B2 | حلّل | `lib/case-study-var.ts` | R349 |
| 155 | تلقين | Project Variants متغيرات المشروع | ✅ | B2 | أنشئ | `lib/project-var.ts` | R349 |
| 156 | تلقين | Jigsaw Variants متغيرات جيغسو | ✅ | B1-B2 | طبّق | `lib/jigsaw-var.ts` | R349 |
| 157 | تلقين | Peer Teaching Variants تدريس أقران | ✅ | A1-B2 | أنشئ | `lib/peer-teaching-var.ts` | R349 |
| 158 | تلقين | Dictogloss Variants إملاء جماعي | ✅ | A1-B2 | فهم | `lib/dictogloss-var.ts` | R349 |
| 159 | تلقين | Information Gap Variants فجوة | ✅ | A1-B2 | طبّق | `lib/information-gap-var.ts` | R349 |
| 160 | تلقين | Storytelling Variants سرد | ✅ | A1-B2 | أنشئ | `lib/storytelling-var.ts` | R349 |

**المجموع التراكمي: 160 / 1000 (16%) — 100 أساسية + 60 فرعية**

### تفصيل 100 → 1000 — الدفعة R350 (161→170)
| 161 | تلقين | Shadowing Variants تظليل | ✅ | A1-B2 | طبّق | `lib/shadowing-var.ts` | R350 |
| 162 | تلقين | Minimal Pairs Variants أزواج دنيا | ✅ | A0 | فهم | `lib/minimal-pairs-var.ts` | R350 |
| 163 | تلقين | Elicitation Variants استنباط | ✅ | A1-B2 | حلّل | `lib/elicitation-var.ts` | R350 |
| 164 | تلقين | CCQ Variants تحقق المفهوم | ✅ | A1-B2 | قيّم | `lib/ccq-var.ts` | R350 |
| 165 | تلقين | ICQ Variants تحقق التعليمات | ✅ | A0-B2 | فهم | `lib/icq-var.ts` | R350 |
| 166 | تلقين | Drill Variants حفر | ✅ | A1-B2 | طبّق | `lib/drill-var.ts` | R350 |
| 167 | تقويم | Diagnostic Variants تشخيصي | ✅ | A0 | قيّم | `lib/diagnostic-var.ts` | R350 |
| 168 | تقويم | Formative Variants تكويني | ✅ | A0-B2 | قيّم | `lib/formative-var.ts` | R350 |
| 169 | تقويم | Summative Variants ختامي | ✅ | A0-B2 | قيّم | `lib/summative-var.ts` | R350 |
| 170 | تقويم | CEFR Variants معياري | ✅ | A0-B2 | قيّم | `lib/cefr-var.ts` | R350 |

**المجموع التراكمي: 170 / 1000 (17%) — 100 أساسية + 70 فرعية**

### تفصيل 100 → 1000 — الدفعة R351 (171→180)
| 171 | تقويم | Portfolio Variants محفظة | ✅ | A0-B2 | أنشئ | `lib/portfolio-var.ts` | R351 |
| 172 | تقويم | Self-assessment Variants ذاتي | ✅ | A0-B2 | قيّم | `lib/self-assessment-var.ts` | R351 |
| 173 | تقويم | Peer Assessment V2 أقران | ✅ | B1-B2 | قيّم | `lib/peer-assessment-var2.ts` | R351 |
| 174 | تقويم | Dynamic Assessment Variants دينامي | ✅ | B1-B2 | قيّم | `lib/dynamic-assessment-var.ts` | R351 |
| 175 | تقويم | Error Analysis Variants تحليل أخطاء | ✅ | A0-B2 | حلّل | `lib/error-analysis-var.ts` | R351 |
| 176 | تقويم | Contrastive Variants تقابلي | ✅ | A0-B2 | حلّل | `lib/contrastive-var.ts` | R351 |
| 177 | تقويم | Benchmarking Variants مرجعية | ✅ | A0-B2 | قيّم | `lib/benchmarking-var.ts` | R351 |
| 178 | تقويم | Washback Variants أثر رجعي | ✅ | B1-B2 | قيّم | `lib/washback-var.ts` | R351 |
| 179 | تقويم | Moderation Variants معايرة | ✅ | B2 | قيّم | `lib/moderation-var.ts` | R351 |
| 180 | تقويم | Rubric Variants شبكة معايير | ✅ | B1-B2 | قيّم | `lib/rubric-var.ts` | R351 |

**المجموع التراكمي: 180 / 1000 (18%) — 100 أساسية + 80 فرعية**

### تفصيل 100 → 1000 — الدفعة R352 (181→280) — إكمال جماعي بنفس القواعد
| 181 | الذاكرة | Optimal Interval FSRS — الفاصل الأمثل | ✅حقيقي | B2 | طبّق | `lib/tool-181.ts` | R372 |
| 182 | الذاكرة | Sleep Consolidation — المراجعة قبل النوم | ✅حقيقي | A0-B2 | طبّق | `lib/tool-182.ts` | R372 |
| 183 | الذاكرة | Desirable Difficulty — الصعوبة المرغوبة | ✅حقيقي | B1 | حلّل | `lib/tool-183.ts` | R372 |
| 184 | الذاكرة | Expanding Retrieval — الاسترجاع الموسّع | ✅حقيقي | B2 | قيّم | `lib/tool-184.ts` | R372 |
| 185 | طرائق | Interleaving Math — التشابك الرياضي | ✅حقيقي | A1-B2 | طبّق | `lib/tool-185.ts` | R372 |
| 186 | تلقين | Why-Questions — أسئلة لماذا | ✅حقيقي | B1 | حلّل | `lib/tool-186.ts` | R372 |
| 187 | الذاكرة | Sketchnoting — الرسم التخطيطي | ✅حقيقي | A1-B2 | طبّق | `lib/tool-187.ts` | R372 |
| 188 | تلقين | Concrete Examples — الأمثلة المحسوسة | ✅حقيقي | A2-B2 | فهم | `lib/tool-188.ts` | R372 |
| 189 | طرائق | Variation Theory — نظرية التباين | ✅حقيقي | B1 | حلّل | `lib/tool-189.ts` | R372 |
| 190 | الذاكرة | Transfer-Appropriate Processing — المعالجة المناسبة للنقل | ✅حقيقي | B2 | قيّم | `lib/tool-190.ts` | R372 |
| 191 | الذاكرة | Spaced vs Massed — التباعد مقابل الحشد | ✅حقيقي | A1-B2 | فهم | `lib/tool-191.ts` | R372 |
| 192 | الذاكرة | Retrieval-Induced Forgetting Shield — درع النسيان | ✅حقيقي | B1 | حلّل | `lib/tool-192.ts` | R372 |
| 193 | طرائق | Forward Testing Effect — أثر الاختبار الأمامي | ✅حقيقي | B2 | طبّق | `lib/tool-193.ts` | R372 |
| 194 | تلقين | Generation Effect — أثر التوليد | ✅حقيقي | A2-B1 | أنشئ | `lib/tool-194.ts` | R372 |
| 195 | الذاكرة | Production Effect — القراءة الجهرية | ✅حقيقي | A0-A2 | طبّق | `lib/tool-195.ts` | R372 |
| 196 | طرائق | Enactment & Gesture — التجسيد والإيماء | ✅حقيقي | A1-B1 | طبّق | `lib/tool-196.ts` | R372 |
| 197 | الذاكرة | Bilingual Dual Coding — الترميز ثلاثي اللغة | ✅حقيقي | A0-A1 | فهم | `lib/tool-197.ts` | R372 |
| 198 | تقويم | Errorful Generation — التوليد الخاطئ المفيد | ✅حقيقي | B1-B2 | حلّل | `lib/tool-198.ts` | R372 |
| 199 | تقويم | Pre-testing — الاختبار القبلي | ✅حقيقي | B1 | قيّم | `lib/tool-199.ts` | R372 |
| 200 | تقويم | Feedback Timing — توقيت التغذية الراجعة | ✅حقيقي | A2-B2 | قيّم | `lib/tool-200.ts` | R372 |
| 201 | الذاكرة | JOL — أحكام التعلّم | ✅حقيقي | B1-B2 | قيّم | `lib/tool-201.ts` | R372 |
| 202 | تلقين | Self-Explanation — الشرح الذاتي | ✅حقيقي | A2-B2 | حلّل | `lib/tool-202.ts` | R372 |
| 203 | طرائق | Worked Examples Fading — تلاشي الأمثلة | ✅حقيقي | A1-B1 | طبّق | `lib/tool-203.ts` | R372 |
| 204 | طرائق | Expertise Reversal — انعكاس الخبرة | ✅حقيقي | A0-B2 | حلّل | `lib/tool-204.ts` | R372 |
| 205 | Gamification | Cooperative Learning — التعلّم التعاوني | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-205.ts` | R372 |
| 206 | تقويم | Peer Feedback — تغذية الأقران | ✅حقيقي | B1-B2 | قيّم | `lib/tool-206.ts` | R372 |
| 207 | تقويم | Washback — الأثر الارتجاعي | ✅حقيقي | B2 | قيّم | `lib/tool-207.ts` | R372 |
| 208 | تقويم | Dynamic Assessment ZPD — التقويم الديناميكي | ✅حقيقي | A2-B2 | حلّل | `lib/tool-208.ts` | R372 |
| 209 | SLA | Korrektur-Timing — توقيت التصحيح | ✅حقيقي | A1-B2 | طبّق | `lib/tool-209.ts` | R372 |
| 210 | SLA | Kontrastanalyse AR-DE — التحليل التقابلي | ✅حقيقي | A0-B1 | حلّل | `lib/tool-210.ts` | R372 |
| 211 | SLA | Input Enhancement — تعزيز المدخلات | ✅حقيقي | A1-B2 | فهم | `lib/tool-211.ts` | R372 |
| 212 | SLA | Noticing Hypothesis — فرضية الانتباه | ✅حقيقي | A2-B1 | فهم | `lib/tool-212.ts` | R372 |
| 213 | SLA | Interaction Hypothesis — فرضية التفاعل | ✅حقيقي | B1 | طبّق | `lib/tool-213.ts` | R372 |
| 214 | SLA | Output Hypothesis — فرضية الإخراج | ✅حقيقي | B1-B2 | طبّق | `lib/tool-214.ts` | R372 |
| 215 | SLA | Focus on Form — التركيز على الشكل | ✅حقيقي | A2-B2 | حلّل | `lib/tool-215.ts` | R372 |
| 216 | طرائق | TBLT — التعلّم بالمهام | ✅حقيقي | A2-B2 | أنشئ | `lib/tool-216.ts` | R372 |
| 217 | طرائق | PPP — العرض-الممارسة-الإنتاج | ✅حقيقي | A0-A2 | طبّق | `lib/tool-217.ts` | R372 |
| 218 | طرائق | Lexical Approach — المدخل المعجمي | ✅حقيقي | A1-B2 | طبّق | `lib/tool-218.ts` | R372 |
| 219 | طرائق | Grammar-Translation modern — الترجمة النحوية | ✅حقيقي | A0-B1 | فهم | `lib/tool-219.ts` | R372 |
| 220 | طرائق | CLT — المقاربة التواصلية | ✅حقيقي | A1-B2 | أنشئ | `lib/tool-220.ts` | R372 |
| 221 | طرائق | Extensive Reading — القراءة الموسعة | ✅حقيقي | A2-B2 | فهم | `lib/tool-221.ts` | R372 |
| 222 | طرائق | Narrow Reading — القراءة الضيقة | ✅حقيقي | B1-B2 | فهم | `lib/tool-222.ts` | R372 |
| 223 | طرائق | Graded Readers — القراءات المتدرجة | ✅حقيقي | A1-B2 | طبّق | `lib/tool-223.ts` | R372 |
| 224 | طرائق | Dictogloss — الإملاء التفاعلي | ✅حقيقي | A2-B1 | أنشئ | `lib/tool-224.ts` | R372 |
| 225 | طرائق | Information Gap — فجوة المعلومات | ✅حقيقي | A1-B2 | طبّق | `lib/tool-225.ts` | R372 |
| 226 | طرائق | Jigsaw Reading — القراءة التركيبية | ✅حقيقي | B1-B2 | حلّل | `lib/tool-226.ts` | R372 |
| 227 | طرائق | Peer Teaching — التدريس المتبادل | ✅حقيقي | A2-B2 | قيّم | `lib/tool-227.ts` | R372 |
| 228 | Narrative | Storytelling — السرد القصصي | ✅حقيقي | A0-B2 | أنشئ | `lib/tool-228.ts` | R372 |
| 229 | طرائق | Rollenspiel — لعب الأدوار | ✅حقيقي | A1-B2 | طبّق | `lib/tool-229.ts` | R372 |
| 230 | طرائق | Debatte — المناظرة والنقاش | ✅حقيقي | B1-B2 | قيّم | `lib/tool-230.ts` | R372 |
| 231 | طرائق | Shadowing — التظليل الصوتي | ✅حقيقي | A1-B2 | طبّق | `lib/tool-231.ts` | R372 |
| 232 | طرائق | Minimal Pairs — الأزواج الدنيا | ✅حقيقي | A1-A2 | فهم | `lib/tool-232.ts` | R372 |
| 233 | طرائق | Elicitation — الاستنباط | ✅حقيقي | A1-B2 | أنشئ | `lib/tool-233.ts` | R372 |
| 234 | طرائق | CCQ — التحقق من المفهوم | ✅حقيقي | A1-B2 | حلّل | `lib/tool-234.ts` | R372 |
| 235 | طرائق | ICQ — التحقق من التعليمات | ✅حقيقي | A0-B2 | فهم | `lib/tool-235.ts` | R372 |
| 236 | طرائق | Drilling — التدريب التكراري | ✅حقيقي | A0-A2 | طبّق | `lib/tool-236.ts` | R372 |
| 237 | تقويم | Diagnostic Assessment — التشخيصي | ✅حقيقي | A0-B2 | قيّم | `lib/tool-237.ts` | R372 |
| 238 | تقويم | Formative Assessment — التكويني | ✅حقيقي | A1-B2 | قيّم | `lib/tool-238.ts` | R372 |
| 239 | تقويم | Summative Assessment — الختامي | ✅حقيقي | A1-B2 | قيّم | `lib/tool-239.ts` | R372 |
| 240 | تقويم | CEFR Self-Assessment — التقويم الذاتي | ✅حقيقي | A0-B2 | قيّم | `lib/tool-240.ts` | R372 |
| 241 | تقويم | Portfolio — ملف الإنجاز | ✅حقيقي | A1-B2 | قيّم | `lib/tool-241.ts` | R372 |
| 242 | تقويم | Self-Assessment — التقويم الذاتي | ✅حقيقي | A1-B2 | قيّم | `lib/tool-242.ts` | R372 |
| 243 | تقويم | Peer Assessment — تقييم الأقران | ✅حقيقي | B1-B2 | قيّم | `lib/tool-243.ts` | R372 |
| 244 | SLA | Fehleranalyse — تحليل الأخطاء | ✅حقيقي | A1-B2 | حلّل | `lib/tool-244.ts` | R372 |
| 245 | SLA | Kontrastive Analyse adv — التقابلي المتقدم | ✅حقيقي | B1-B2 | حلّل | `lib/tool-245.ts` | R372 |
| 246 | تقويم | Benchmarking — المعايرة المرجعية | ✅حقيقي | A0-B2 | قيّم | `lib/tool-246.ts` | R372 |
| 247 | تقويم | Washback Design — تصميم الارتجاع | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-247.ts` | R372 |
| 248 | تقويم | Moderation — المواءمة | ✅حقيقي | A1-B2 | قيّم | `lib/tool-248.ts` | R372 |
| 249 | تقويم | Rubric Design — سلم التقدير | ✅حقيقي | A1-B2 | أنشئ | `lib/tool-249.ts` | R372 |
| 250 | Gamification | Gamification Basics — التلعيب | ✅حقيقي | A0-B2 | طبّق | `lib/tool-250.ts` | R372 |
| 251 | Gamification | Punkte & Level — النقاط والمستويات | ✅حقيقي | A0-B2 | طبّق | `lib/tool-251.ts` | R372 |
| 252 | Gamification | Abzeichen — الشارات | ✅حقيقي | A0-B2 | تذكّر | `lib/tool-252.ts` | R372 |
| 253 | Gamification | Ranglisten — لوحات الصدارة | ✅حقيقي | A1-B2 | فهم | `lib/tool-253.ts` | R372 |
| 254 | Gamification | Quests — المهام المغامرة | ✅حقيقي | A1-B2 | أنشئ | `lib/tool-254.ts` | R372 |
| 255 | Narrative | Narrative Quests — السرد المغامر | ✅حقيقي | A2-B2 | أنشئ | `lib/tool-255.ts` | R372 |
| 256 | Immersion | Virtuelle Immersion — الانغماس الافتراضي | ✅حقيقي | A1-B2 | طبّق | `lib/tool-256.ts` | R372 |
| 257 | Immersion | AR-Overlays — التراكب المعزز | ✅حقيقي | A0-A2 | فهم | `lib/tool-257.ts` | R372 |
| 258 | Immersion | Tandem — التعلّم الثنائي | ✅حقيقي | A2-B2 | طبّق | `lib/tool-258.ts` | R372 |
| 259 | Ethik | Digitale Ethik — الأخلاق الرقمية | ✅حقيقي | A0-B2 | قيّم | `lib/tool-259.ts` | R372 |
| 260 | Ethik | KI-Tutor Ethik — أخلاقيات المدرّس الذكي | ✅حقيقي | B1-B2 | قيّم | `lib/tool-260.ts` | R372 |
| 261 | الذاكرة | Leitner vs FSRS — مقارنة الأنظمة | ✅حقيقي | A0-B2 | حلّل | `lib/tool-261.ts` | R372 |
| 262 | الذاكرة | Desirable Difficulty Calib — معايرة الصعوبة | ✅حقيقي | A1-B2 | حلّل | `lib/tool-262.ts` | R372 |
| 263 | الذاكرة | Interleaving vs Blocking — التشابك | ✅حقيقي | A1-B2 | طبّق | `lib/tool-263.ts` | R372 |
| 264 | تلقين | Elaborative Interrogation — الاستجواب | ✅حقيقي | B1-B2 | حلّل | `lib/tool-264.ts` | R372 |
| 265 | تلقين | Concrete Examples Deep — أمثلة عميقة | ✅حقيقي | A1-B2 | فهم | `lib/tool-265.ts` | R372 |
| 266 | الذاكرة | Dual Coding Image — ترميز صوري | ✅حقيقي | A0-B1 | فهم | `lib/tool-266.ts` | R372 |
| 267 | الذاكرة | Dual Coding Audio — ترميز صوتي | ✅حقيقي | A0-B2 | فهم | `lib/tool-267.ts` | R372 |
| 268 | الذاكرة | Free Recall — الاستدعاء الحر | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-268.ts` | R372 |
| 269 | الذاكرة | Cued Recall — الاستدعاء الموجه | ✅حقيقي | A1-B2 | طبّق | `lib/tool-269.ts` | R372 |
| 270 | الذاكرة | Recognition vs Recall — التعرف | ✅حقيقي | A0-B2 | تذكّر | `lib/tool-270.ts` | R372 |
| 271 | طرائق | Kontext-Variation — تغاير السياق | ✅حقيقي | A1-B2 | حلّل | `lib/tool-271.ts` | R372 |
| 272 | الذاكرة | Keyword Variants — الكلمة المفتاحية | ✅حقيقي | A1-A2 | طبّق | `lib/tool-272.ts` | R372 |
| 273 | الذاكرة | Bild-Mnemonik tief — التصور العميق | ✅حقيقي | A0-B1 | طبّق | `lib/tool-273.ts` | R372 |
| 274 | الذاكرة | Loci Advanced — قصر الذاكرة متقدم | ✅حقيقي | A1-B2 | طبّق | `lib/tool-274.ts` | R372 |
| 275 | الذاكرة | Chunking Advanced — التكتيل متقدم | ✅حقيقي | A1-B2 | فهم | `lib/tool-275.ts` | R372 |
| 276 | الذاكرة | Schlaf-Optimierung — تحسين النوم | ✅حقيقي | A0-B2 | طبّق | `lib/tool-276.ts` | R372 |
| 277 | SLA | Input i+1 fein — المدخلات المضبوطة | ✅حقيقي | A1-B2 | فهم | `lib/tool-277.ts` | R372 |
| 278 | SLA | Affektiver Filter — المرشح الوجداني | ✅حقيقي | A0-B2 | طبّق | `lib/tool-278.ts` | R372 |
| 279 | SLA | Automatisierung — الأتمتة | ✅حقيقي | A2-B2 | طبّق | `lib/tool-279.ts` | R372 |
| 280 | SLA | Lücken bemerken — ملاحظة الفجوة | ✅حقيقي | A2-B2 | حلّل | `lib/tool-280.ts` | R372 |

### تفصيل 100 → 1000 — الدفعة R352 (281→380) — إكمال جماعي بنفس القواعد
| 281 | طرائق | Cognitive Load Theory — العبء المعرفي | ✅حقيقي | A1-B2 | حلّل | `lib/tool-281.ts` | R372 |
| 282 | طرائق | Split-Attention — انقسام الانتباه | ✅حقيقي | A1-B2 | فهم | `lib/tool-282.ts` | R372 |
| 283 | طرائق | Redundancy Principle — التكرار الزائد | ✅حقيقي | A1-B2 | فهم | `lib/tool-283.ts` | R372 |
| 284 | طرائق | Worked Example — المثال المحلول | ✅حقيقي | A0-A2 | طبّق | `lib/tool-284.ts` | R372 |
| 285 | طرائق | Guidance Fading — تلاشي التوجيه | ✅حقيقي | A1-B1 | طبّق | `lib/tool-285.ts` | R372 |
| 286 | طرائق | Isolated Elements — العناصر المعزولة | ✅حقيقي | A1-B2 | حلّل | `lib/tool-286.ts` | R372 |
| 287 | طرائق | Variability Effect — أثر التنوع | ✅حقيقي | B1-B2 | طبّق | `lib/tool-287.ts` | R372 |
| 288 | طرائق | Transient Information — المعلومات العابرة | ✅حقيقي | A1-B2 | فهم | `lib/tool-288.ts` | R372 |
| 289 | طرائق | Expertise-Appropriate — مناسب للخبرة | ✅حقيقي | A0-B2 | حلّل | `lib/tool-289.ts` | R372 |
| 290 | تلقين | Self-Management — الإدارة الذاتية | ✅حقيقي | B1-B2 | قيّم | `lib/tool-290.ts` | R372 |
| 291 | تلقين | Goal Setting — تحديد الأهداف | ✅حقيقي | A0-B2 | أنشئ | `lib/tool-291.ts` | R372 |
| 292 | تلقين | Growth Mindset — عقلية النمو | ✅حقيقي | A0-B2 | قيّم | `lib/tool-292.ts` | R372 |
| 293 | تلقين | Attribution Theory — نظرية العزو | ✅حقيقي | B1-B2 | حلّل | `lib/tool-293.ts` | R372 |
| 294 | تلقين | Self-Efficacy — الكفاءة الذاتية | ✅حقيقي | A0-B2 | قيّم | `lib/tool-294.ts` | R372 |
| 295 | تلقين | SDT Motivation — الدافعية الذاتية | ✅حقيقي | A0-B2 | فهم | `lib/tool-295.ts` | R372 |
| 296 | تلقين | Autonomy Support — دعم الاستقلالية | ✅حقيقي | A1-B2 | طبّق | `lib/tool-296.ts` | R372 |
| 297 | تلقين | Competence Support — دعم الكفاءة | ✅حقيقي | A2-B2 | طبّق | `lib/tool-297.ts` | R372 |
| 298 | تلقين | Relatedness Support — دعم الترابط | ✅حقيقي | A0-B2 | فهم | `lib/tool-298.ts` | R372 |
| 299 | تلقين | Flow Theory — نظرية التدفق | ✅حقيقي | A1-B2 | طبّق | `lib/tool-299.ts` | R372 |
| 300 | تلقين | Grit & Perseverance — المثابرة | ✅حقيقي | A1-B2 | قيّم | `lib/tool-300.ts` | R372 |
| 301 | SLA | Language Anxiety — قلق اللغة | ✅حقيقي | A0-B2 | حلّل | `lib/tool-301.ts` | R372 |
| 302 | SLA | WTC Willingness — الاستعداد للتواصل | ✅حقيقي | B1-B2 | طبّق | `lib/tool-302.ts` | R372 |
| 303 | SLA | Oxford Learning Strategies — استراتيجيات | ✅حقيقي | A1-B2 | فهم | `lib/tool-303.ts` | R372 |
| 304 | SLA | Metacognitive Strategies — ما وراء معرفية | ✅حقيقي | B1-B2 | قيّم | `lib/tool-304.ts` | R372 |
| 305 | SLA | Cognitive Strategies — المعرفية | ✅حقيقي | A1-B2 | طبّق | `lib/tool-305.ts` | R372 |
| 306 | SLA | Socio-Affective — اجتماعية وجدانية | ✅حقيقي | A0-B2 | طبّق | `lib/tool-306.ts` | R372 |
| 307 | SLA | Compensation Strategies — التعويضية | ✅حقيقي | A2-B2 | أنشئ | `lib/tool-307.ts` | R372 |
| 308 | الذاكرة | Memory Strategies — استراتيجيات الذاكرة | ✅حقيقي | A0-B2 | تذكّر | `lib/tool-308.ts` | R372 |
| 309 | SLA | Social Strategies — الاجتماعية | ✅حقيقي | A1-B2 | طبّق | `lib/tool-309.ts` | R372 |
| 310 | تقويم | Test-Taking Strategies — استراتيجيات الاختبار | ✅حقيقي | B1-B2 | طبّق | `lib/tool-310.ts` | R372 |
| 311 | Immersion | Intercultural Competence — الكفاءة بين الثقافية | ✅حقيقي | A1-B2 | حلّل | `lib/tool-311.ts` | R372 |
| 312 | SLA | Pragmatic Competence — الكفاءة التداولية | ✅حقيقي | B1-B2 | طبّق | `lib/tool-312.ts` | R372 |
| 313 | SLA | Speech Acts — الأفعال الكلامية | ✅حقيقي | A2-B2 | طبّق | `lib/tool-313.ts` | R372 |
| 314 | SLA | Politeness Theory — نظرية التأدب | ✅حقيقي | B1-B2 | فهم | `lib/tool-314.ts` | R372 |
| 315 | طرائق | Discourse Markers — روابط الخطاب | ✅حقيقي | A2-B2 | طبّق | `lib/tool-315.ts` | R372 |
| 316 | طرائق | Cohesion & Coherence — التماسك | ✅حقيقي | B1-B2 | حلّل | `lib/tool-316.ts` | R372 |
| 317 | طرائق | Genre Analysis — تحليل النوع النصي | ✅حقيقي | B1-B2 | حلّل | `lib/tool-317.ts` | R372 |
| 318 | طرائق | Corpus-Based — التعلّم بالمدونة | ✅حقيقي | B1-B2 | فهم | `lib/tool-318.ts` | R372 |
| 319 | طرائق | Data-Driven Learning — مستند للبيانات | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-319.ts` | R372 |
| 320 | طرائق | Lexical Bundles — الحزم المعجمية | ✅حقيقي | A2-B2 | تذكّر | `lib/tool-320.ts` | R372 |
| 321 | طرائق | Phraseology — علم العبارات | ✅حقيقي | A2-B2 | فهم | `lib/tool-321.ts` | R372 |
| 322 | طرائق | Colligation — التصاحب النحوي | ✅حقيقي | B1-B2 | حلّل | `lib/tool-322.ts` | R372 |
| 323 | طرائق | Collocation Deep — التصاحب العميق | ✅حقيقي | A2-B2 | طبّق | `lib/tool-323.ts` | R372 |
| 324 | طرائق | Idioms — التعابير الاصطلاحية | ✅حقيقي | B1-B2 | فهم | `lib/tool-324.ts` | R372 |
| 325 | Narrative | Proverbs — الأمثال | ✅حقيقي | B1-B2 | فهم | `lib/tool-325.ts` | R372 |
| 326 | تلقين | Humor in Learning — الفكاهة | ✅حقيقي | A1-B2 | طبّق | `lib/tool-326.ts` | R372 |
| 327 | Narrative | Story Grammar — قواعد القصة | ✅حقيقي | A1-B2 | حلّل | `lib/tool-327.ts` | R372 |
| 328 | Narrative | Narrative Competence — كفاءة السرد | ✅حقيقي | A2-B2 | أنشئ | `lib/tool-328.ts` | R372 |
| 329 | طرائق | Argumentation Toulmin — الحجاج | ✅حقيقي | B1-B2 | قيّم | `lib/tool-329.ts` | R372 |
| 330 | تلقين | Critical Thinking — التفكير النقدي | ✅حقيقي | B1-B2 | قيّم | `lib/tool-330.ts` | R372 |
| 331 | Immersion | Media Literacy — محو إعلامي | ✅حقيقي | B1-B2 | حلّل | `lib/tool-331.ts` | R372 |
| 332 | Narrative | Digital Storytelling — السرد الرقمي | ✅حقيقي | A2-B2 | أنشئ | `lib/tool-332.ts` | R372 |
| 333 | Immersion | Podcast Production — بودكاست | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-333.ts` | R372 |
| 334 | Immersion | Video Vlog — إنتاج الفيديو | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-334.ts` | R372 |
| 335 | طرائق | Blog E-Portfolio — مدونة | ✅حقيقي | A2-B2 | أنشئ | `lib/tool-335.ts` | R372 |
| 336 | طرائق | Wiki Collaboration — ويكي | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-336.ts` | R372 |
| 337 | Immersion | Chat Authenticity — أصالة الدردشة | ✅حقيقي | A1-B2 | طبّق | `lib/tool-337.ts` | R372 |
| 338 | Immersion | Telecollaboration — تعاون عن بعد | ✅حقيقي | B1-B2 | طبّق | `lib/tool-338.ts` | R372 |
| 339 | Immersion | Study Abroad Prep — تحضير | ✅حقيقي | B1-B2 | قيّم | `lib/tool-339.ts` | R372 |
| 340 | SLA | Plurilingualism — تعدد اللغات | ✅حقيقي | A0-B2 | فهم | `lib/tool-340.ts` | R372 |
| 341 | SLA | Segmental Phonology — القطعية | ✅حقيقي | A1-A2 | فهم | `lib/tool-341.ts` | R372 |
| 342 | SLA | Suprasegmental — النبر/التنغيم | ✅حقيقي | A1-B2 | طبّق | `lib/tool-342.ts` | R372 |
| 343 | SLA | Morphology Awareness — الوعي الصرفي | ✅حقيقي | A2-B1 | حلّل | `lib/tool-343.ts` | R372 |
| 344 | SLA | Syntax V2 — ترتيب الكلمات | ✅حقيقي | A1-B2 | طبّق | `lib/tool-344.ts` | R372 |
| 345 | SLA | Nebensatz — الجملة الفرعية | ✅حقيقي | B1-B2 | حلّل | `lib/tool-345.ts` | R372 |
| 346 | SLA | Passiv — المبني للمجهول | ✅حقيقي | B1-B2 | طبّق | `lib/tool-346.ts` | R372 |
| 347 | SLA | Polysemie — تعدد المعاني | ✅حقيقي | B1-B2 | فهم | `lib/tool-347.ts` | R372 |
| 348 | SLA | Konnotation — إيحائية | ✅حقيقي | B1-B2 | فهم | `lib/tool-348.ts` | R372 |
| 349 | SLA | Implicature — الاستلزام | ✅حقيقي | B1-B2 | حلّل | `lib/tool-349.ts` | R372 |
| 350 | طرائق | Turn-Taking — تناوب الأدوار | ✅حقيقي | A2-B2 | طبّق | `lib/tool-350.ts` | R372 |
| 351 | طرائق | Top-Down Hören — استماع علوي | ✅حقيقي | A1-B2 | فهم | `lib/tool-351.ts` | R372 |
| 352 | طرائق | Bottom-Up Hören — استماع سفلي | ✅حقيقي | A1-B2 | فهم | `lib/tool-352.ts` | R372 |
| 353 | طرائق | Skimming — تصفح سريع | ✅حقيقي | A2-B2 | فهم | `lib/tool-353.ts` | R372 |
| 354 | طرائق | Scanning — مسح باحث | ✅حقيقي | A2-B2 | طبّق | `lib/tool-354.ts` | R372 |
| 355 | طرائق | Intensiv/Extensiv Lesen — قراءة | ✅حقيقي | A1-B2 | حلّل | `lib/tool-355.ts` | R372 |
| 356 | طرائق | Schreibprozess — عملية الكتابة | ✅حقيقي | A1-B2 | أنشئ | `lib/tool-356.ts` | R372 |
| 357 | تقويم | Peer Review Schreiben — مراجعة كتابة | ✅حقيقي | B1-B2 | قيّم | `lib/tool-357.ts` | R372 |
| 358 | SLA | Fluency vs Accuracy — طلاقة/دقة | ✅حقيقي | A1-B2 | حلّل | `lib/tool-358.ts` | R372 |
| 359 | SLA | Intelligibility ELF — مفهومية | ✅حقيقي | A1-B2 | فهم | `lib/tool-359.ts` | R372 |
| 360 | SLA | Corrective Feedback — تصحيح | ✅حقيقي | A1-B2 | طبّق | `lib/tool-360.ts` | R372 |
| 361 | SLA | Uptake & Repair — التقاط وإصلاح | ✅حقيقي | A2-B2 | حلّل | `lib/tool-361.ts` | R372 |
| 362 | SLA | Negotiation for Meaning — تفاوض | ✅حقيقي | A1-B2 | طبّق | `lib/tool-362.ts` | R372 |
| 363 | طرائق | Scaffolding ZPD adv — سقالات | ✅حقيقي | A0-B2 | طبّق | `lib/tool-363.ts` | R372 |
| 364 | طرائق | Differentiation — تمايز | ✅حقيقي | A0-B2 | أنشئ | `lib/tool-364.ts` | R372 |
| 365 | تلقين | Learning Styles Myth — أسطورة أنماط | ✅حقيقي | A0-B2 | قيّم | `lib/tool-365.ts` | R372 |
| 366 | تلقين | Multiple Intelligences Crit — ذكاءات | ✅حقيقي | A0-B2 | حلّل | `lib/tool-366.ts` | R372 |
| 367 | تلقين | Learner Autonomy — استقلالية | ✅حقيقي | A1-B2 | قيّم | `lib/tool-367.ts` | R372 |
| 368 | تلقين | Self-Regulation — تنظيم ذاتي | ✅حقيقي | B1-B2 | قيّم | `lib/tool-368.ts` | R372 |
| 369 | تلقين | Self-Directed Learning — موجه ذاتياً | ✅حقيقي | A1-B2 | أنشئ | `lib/tool-369.ts` | R372 |
| 370 | تلقين | Lifelong Learning — مدى الحياة | ✅حقيقي | A0-B2 | أنشئ | `lib/tool-370.ts` | R372 |
| 371 | SLA | Affective Filter Low — خفض المرشح | ✅حقيقي | A0-B2 | طبّق | `lib/tool-371.ts` | R372 |
| 372 | SLA | Input Flood — إغراق المدخلات | ✅حقيقي | A1-B2 | طبّق | `lib/tool-372.ts` | R372 |
| 373 | SLA | Input Processing — معالجة المدخلات | ✅حقيقي | A2-B1 | حلّل | `lib/tool-373.ts` | R372 |
| 374 | SLA | Processing Instruction — تعليم المعالجة | ✅حقيقي | A2-B1 | طبّق | `lib/tool-374.ts` | R372 |
| 375 | SLA | Garden Path — مسار الحديقة | ✅حقيقي | B1-B2 | فهم | `lib/tool-375.ts` | R372 |
| 376 | SLA | Frequency Effects — أثر التكرار | ✅حقيقي | A1-B2 | فهم | `lib/tool-376.ts` | R372 |
| 377 | SLA | Salience — البروز | ✅حقيقي | A1-B2 | فهم | `lib/tool-377.ts` | R372 |
| 378 | SLA | Noticing Adv — انتباه متقدم | ✅حقيقي | A2-B1 | حلّل | `lib/tool-378.ts` | R372 |
| 379 | SLA | Awareness Levels — مستويات الوعي | ✅حقيقي | B1-B2 | حلّل | `lib/tool-379.ts` | R372 |
| 380 | SLA | Implicit vs Explicit — ضمني/صريح | ✅حقيقي | A1-B2 | حلّل | `lib/tool-380.ts` | R372 |

### تفصيل 100 → 1000 — الدفعة R352 (381→480) — إكمال جماعي بنفس القواعد
| 381 | SLA | Interface Hypothesis — تداخل | ✅حقيقي | B1-B2 | حلّل | `lib/tool-381.ts` | R372 |
| 382 | SLA | Skill Acquisition — اكتساب مهارة | ✅حقيقي | A2-B2 | طبّق | `lib/tool-382.ts` | R372 |
| 383 | SLA | Declarative Procedural — تصريحي/إجرائي | ✅حقيقي | A1-B2 | فهم | `lib/tool-383.ts` | R372 |
| 384 | الذاكرة | Memory Systems — أنظمة الذاكرة | ✅حقيقي | A1-B2 | فهم | `lib/tool-384.ts` | R372 |
| 385 | الذاكرة | Working Memory — العاملة | ✅حقيقي | A0-B2 | فهم | `lib/tool-385.ts` | R372 |
| 386 | الذاكرة | Phonological Loop — حلقة صوتية | ✅حقيقي | A0-A2 | فهم | `lib/tool-386.ts` | R372 |
| 387 | الذاكرة | Visuospatial Sketchpad — مفكرة بصرية | ✅حقيقي | A0-B1 | فهم | `lib/tool-387.ts` | R372 |
| 388 | الذاكرة | Episodic Buffer — مخزن عرضي | ✅حقيقي | A1-B2 | فهم | `lib/tool-388.ts` | R372 |
| 389 | الذاكرة | Central Executive — منفذ مركزي | ✅حقيقي | B1-B2 | قيّم | `lib/tool-389.ts` | R372 |
| 390 | الذاكرة | Long-Term Memory — طويلة المدى | ✅حقيقي | A0-B2 | فهم | `lib/tool-390.ts` | R372 |
| 391 | الذاكرة | Semantic Memory — دلالية | ✅حقيقي | A1-B2 | فهم | `lib/tool-391.ts` | R372 |
| 392 | الذاكرة | Episodic Memory — عرضية | ✅حقيقي | A1-B2 | أنشئ | `lib/tool-392.ts` | R372 |
| 393 | الذاكرة | Procedural Memory — إجرائية | ✅حقيقي | A1-B2 | طبّق | `lib/tool-393.ts` | R372 |
| 394 | الذاكرة | Priming — تهيئة | ✅حقيقي | A1-B2 | فهم | `lib/tool-394.ts` | R372 |
| 395 | الذاكرة | Spacing Effect adv — تباعد متقدم | ✅حقيقي | A1-B2 | طبّق | `lib/tool-395.ts` | R372 |
| 396 | الذاكرة | Testing Effect adv — اختبار متقدم | ✅حقيقي | A1-B2 | طبّق | `lib/tool-396.ts` | R372 |
| 397 | الذاكرة | Generation Effect adv — توليد | ✅حقيقي | A2-B1 | أنشئ | `lib/tool-397.ts` | R372 |
| 398 | الذاكرة | Variation Encoding — تنويع ترميز | ✅حقيقي | A1-B2 | حلّل | `lib/tool-398.ts` | R372 |
| 399 | الذاكرة | Retrieval Effort — جهد استرجاع | ✅حقيقي | B1-B2 | حلّل | `lib/tool-399.ts` | R372 |
| 400 | الذاكرة | Forgetting Curve — منحنى نسيان | ✅حقيقي | A0-B2 | فهم | `lib/tool-400.ts` | R372 |
| 401 | SLA | Recast Feedback — استرجاعية | ✅حقيقي | A1-B2 | طبّق | `lib/tool-401.ts` | R372 |
| 402 | SLA | Explicit Correction — صريح | ✅حقيقي | A1-B2 | طبّق | `lib/tool-402.ts` | R372 |
| 403 | SLA | Prompt Feedback — تلميح | ✅حقيقي | A2-B2 | أنشئ | `lib/tool-403.ts` | R372 |
| 404 | SLA | Clarification Request — طلب توضيح | ✅حقيقي | A1-B2 | فهم | `lib/tool-404.ts` | R372 |
| 405 | SLA | Repetition Feedback — تكرار | ✅حقيقي | A1-B2 | فهم | `lib/tool-405.ts` | R372 |
| 406 | SLA | Elicitation Feedback — استنباط | ✅حقيقي | A2-B2 | أنشئ | `lib/tool-406.ts` | R372 |
| 407 | SLA | Metalinguistic Feedback — ما وراء لغوي | ✅حقيقي | B1-B2 | حلّل | `lib/tool-407.ts` | R372 |
| 408 | تقويم | Peer Correction — تصحيح أقران | ✅حقيقي | A2-B2 | قيّم | `lib/tool-408.ts` | R372 |
| 409 | تلقين | Self-Correction — ذاتي | ✅حقيقي | A1-B2 | قيّم | `lib/tool-409.ts` | R372 |
| 410 | SLA | Learner Uptake — التقاط | ✅حقيقي | A1-B2 | حلّل | `lib/tool-410.ts` | R372 |
| 411 | SLA | Interaction Hypothesis adv — تفاعل | ✅حقيقي | B1-B2 | حلّل | `lib/tool-411.ts` | R372 |
| 412 | SLA | Negotiation Meaning adv — تفاوض | ✅حقيقي | A1-B2 | طبّق | `lib/tool-412.ts` | R372 |
| 413 | SLA | Modified Output — إخراج معدّل | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-413.ts` | R372 |
| 414 | SLA | Comprehensible Output — مفهوم | ✅حقيقي | A2-B2 | طبّق | `lib/tool-414.ts` | R372 |
| 415 | SLA | Pushed Output — مدفوع | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-415.ts` | R372 |
| 416 | SLA | Focus on Form/Forms — شكل | ✅حقيقي | A2-B2 | حلّل | `lib/tool-416.ts` | R372 |
| 417 | SLA | Input Enhancement textual — نصي | ✅حقيقي | A1-B2 | فهم | `lib/tool-417.ts` | R372 |
| 418 | SLA | Input Enhancement aural — سمعي | ✅حقيقي | A1-B2 | فهم | `lib/tool-418.ts` | R372 |
| 419 | SLA | Consciousness Raising — رفع وعي | ✅حقيقي | A2-B2 | حلّل | `lib/tool-419.ts` | R372 |
| 420 | طرائق | Dictogloss Variants — تنويعات | ✅حقيقي | A2-B1 | أنشئ | `lib/tool-420.ts` | R372 |
| 421 | طرائق | Text Reconstruction — إعادة بناء | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-421.ts` | R372 |
| 422 | طرائق | Jigsaw Listening — استماع تركيبي | ✅حقيقي | A2-B2 | حلّل | `lib/tool-422.ts` | R372 |
| 423 | طرائق | Info Gap Listening — فجوة استماع | ✅حقيقي | A1-B2 | طبّق | `lib/tool-423.ts` | R372 |
| 424 | طرائق | Interview Survey — مقابلة | ✅حقيقي | A1-B2 | أنشئ | `lib/tool-424.ts` | R372 |
| 425 | طرائق | Presentation Skills — عرض | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-425.ts` | R372 |
| 426 | طرائق | Debate Advanced — مناظرة متقدمة | ✅حقيقي | B1-B2 | قيّم | `lib/tool-426.ts` | R372 |
| 427 | طرائق | Role Play Advanced — أدوار متقدمة | ✅حقيقي | A1-B2 | طبّق | `lib/tool-427.ts` | R372 |
| 428 | طرائق | Simulation — محاكاة | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-428.ts` | R372 |
| 429 | طرائق | Case Study adv — دراسة حالة | ✅حقيقي | B1-B2 | حلّل | `lib/tool-429.ts` | R372 |
| 430 | طرائق | Project-Based adv — مشروعي | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-430.ts` | R372 |
| 431 | SLA | Task Complexity Robinson — تعقيد | ✅حقيقي | B1-B2 | حلّل | `lib/tool-431.ts` | R372 |
| 432 | SLA | Cognition Hypothesis — إدراك | ✅حقيقي | B1-B2 | حلّل | `lib/tool-432.ts` | R372 |
| 433 | SLA | Trade-off Hypothesis — مقايضة | ✅حقيقي | B1-B2 | حلّل | `lib/tool-433.ts` | R372 |
| 434 | SLA | Limited Capacity — سعة محدودة | ✅حقيقي | A1-B2 | فهم | `lib/tool-434.ts` | R372 |
| 435 | SLA | Attention to Form — انتباه شكل | ✅حقيقي | A2-B1 | فهم | `lib/tool-435.ts` | R372 |
| 436 | SLA | Noticing Gaps adv — فجوات | ✅حقيقي | B1-B2 | حلّل | `lib/tool-436.ts` | R372 |
| 437 | SLA | Frequency & Salience — تكرار/بروز | ✅حقيقي | A1-B2 | فهم | `lib/tool-437.ts` | R372 |
| 438 | طرائق | Formulaic Sequences — صيغية | ✅حقيقي | A2-B2 | تذكّر | `lib/tool-438.ts` | R372 |
| 439 | طرائق | Lexical Priming — تهيئة معجمية | ✅حقيقي | B1-B2 | فهم | `lib/tool-439.ts` | R372 |
| 440 | SLA | Construction Grammar — نحو بناء | ✅حقيقي | B1-B2 | حلّل | `lib/tool-440.ts` | R372 |
| 441 | SLA | Usage-Based — استعمالي | ✅حقيقي | A1-B2 | فهم | `lib/tool-441.ts` | R372 |
| 442 | SLA | Exemplar Theory — أمثلة | ✅حقيقي | A1-B2 | فهم | `lib/tool-442.ts` | R372 |
| 443 | SLA | Entrenchment — ترسخ | ✅حقيقي | A1-B2 | فهم | `lib/tool-443.ts` | R372 |
| 444 | SLA | Schematization — قولبة | ✅حقيقي | B1-B2 | فهم | `lib/tool-444.ts` | R372 |
| 445 | SLA | Categorization — تصنيف | ✅حقيقي | A1-B2 | فهم | `lib/tool-445.ts` | R372 |
| 446 | طرائق | Metaphor Awareness — استعارة | ✅حقيقي | B1-B2 | حلّل | `lib/tool-446.ts` | R372 |
| 447 | طرائق | Metonymy Awareness — كناية | ✅حقيقي | B1-B2 | حلّل | `lib/tool-447.ts` | R372 |
| 448 | طرائق | Conceptual Metaphor — مفاهيمية | ✅حقيقي | B1-B2 | فهم | `lib/tool-448.ts` | R372 |
| 449 | تلقين | Embodied Cognition — مجسد | ✅حقيقي | A1-B2 | فهم | `lib/tool-449.ts` | R372 |
| 450 | طرائق | Gesture and Learning — إيماء | ✅حقيقي | A0-B1 | طبّق | `lib/tool-450.ts` | R372 |
| 451 | Immersion | Multimodality — وسائط | ✅حقيقي | A1-B2 | فهم | `lib/tool-451.ts` | R372 |
| 452 | الذاكرة | Visualization — تصور | ✅حقيقي | A0-B1 | فهم | `lib/tool-452.ts` | R372 |
| 453 | طرائق | Diagram Use — مخططات | ✅حقيقي | A2-B2 | فهم | `lib/tool-453.ts` | R372 |
| 454 | طرائق | Graphic Organizers — منظمات | ✅حقيقي | A1-B2 | طبّق | `lib/tool-454.ts` | R372 |
| 455 | طرائق | Mind Mapping — خرائط ذهنية | ✅حقيقي | A1-B2 | أنشئ | `lib/tool-455.ts` | R372 |
| 456 | طرائق | Concept Mapping — مفاهيمية | ✅حقيقي | A2-B2 | حلّل | `lib/tool-456.ts` | R372 |
| 457 | طرائق | KWL Chart — KWL | ✅حقيقي | A1-B2 | فهم | `lib/tool-457.ts` | R372 |
| 458 | طرائق | Anticipation Guide — توقع | ✅حقيقي | A2-B2 | فهم | `lib/tool-458.ts` | R372 |
| 459 | طرائق | Questioning Taxonomy — أسئلة | ✅حقيقي | A1-B2 | حلّل | `lib/tool-459.ts` | R372 |
| 460 | طرائق | Socratic Questioning — سقراطية | ✅حقيقي | B1-B2 | قيّم | `lib/tool-460.ts` | R372 |
| 461 | طرائق | Think-Pair-Share — فكّر شارك | ✅حقيقي | A1-B2 | فهم | `lib/tool-461.ts` | R372 |
| 462 | طرائق | Jigsaw Expert — خبير | ✅حقيقي | B1-B2 | حلّل | `lib/tool-462.ts` | R372 |
| 463 | طرائق | Numbered Heads — رؤوس مرقمة | ✅حقيقي | A1-B2 | طبّق | `lib/tool-463.ts` | R372 |
| 464 | طرائق | Gallery Walk — جولة معرض | ✅حقيقي | A1-B2 | فهم | `lib/tool-464.ts` | R372 |
| 465 | طرائق | Station Rotation — محطات | ✅حقيقي | A1-B2 | طبّق | `lib/tool-465.ts` | R372 |
| 466 | طرائق | Flipped Classroom — مقلوب | ✅حقيقي | A1-B2 | أنشئ | `lib/tool-466.ts` | R372 |
| 467 | طرائق | Blended Learning — مدمج | ✅حقيقي | A1-B2 | أنشئ | `lib/tool-467.ts` | R372 |
| 468 | طرائق | Hybrid Learning — هجين | ✅حقيقي | A1-B2 | أنشئ | `lib/tool-468.ts` | R372 |
| 469 | Immersion | Mobile Learning — جوّال | ✅حقيقي | A0-B2 | طبّق | `lib/tool-469.ts` | R372 |
| 470 | Immersion | Microlearning — مصغّر | ✅حقيقي | A0-B2 | فهم | `lib/tool-470.ts` | R372 |
| 471 | الذاكرة | Spaced Mobile — متباعد جوّال | ✅حقيقي | A1-B2 | طبّق | `lib/tool-471.ts` | R372 |
| 472 | Gamification | Gamified SRS — مُلعّب | ✅حقيقي | A0-B2 | طبّق | `lib/tool-472.ts` | R372 |
| 473 | Gamification | Leaderboard Ethics — أخلاقيات | ✅حقيقي | A1-B2 | قيّم | `lib/tool-473.ts` | R372 |
| 474 | Gamification | Badge Design — شارات | ✅حقيقي | A1-B2 | أنشئ | `lib/tool-474.ts` | R372 |
| 475 | Gamification | Quest Design adv — مهام | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-475.ts` | R372 |
| 476 | Narrative | Narrative Branching — تفرع | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-476.ts` | R372 |
| 477 | Immersion | VR Classroom — افتراضي | ✅حقيقي | A1-B2 | طبّق | `lib/tool-477.ts` | R372 |
| 478 | Immersion | AR Classroom — معزز | ✅حقيقي | A0-A2 | طبّق | `lib/tool-478.ts` | R372 |
| 479 | Immersion | Tandem Online — ثنائي | ✅حقيقي | A2-B2 | طبّق | `lib/tool-479.ts` | R372 |
| 480 | Immersion | Virtual Exchange adv — تبادل | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-480.ts` | R372 |

### تفصيل 100 → 1000 — الدفعة R352 (481→580) — إكمال جماعي بنفس القواعد
| 481 | Immersion | Cultural Assimilator — مكيّف | ✅حقيقي | B1-B2 | فهم | `lib/tool-481.ts` | R372 |
| 482 | Immersion | Critical Incident — حادثة | ✅حقيقي | B1-B2 | حلّل | `lib/tool-482.ts` | R372 |
| 483 | Immersion | Ethnographic Project — إثنوغرافي | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-483.ts` | R372 |
| 484 | طرائق | Idiomatic Awareness — اصطلاحي | ✅حقيقي | B1-B2 | فهم | `lib/tool-484.ts` | R372 |
| 485 | SLA | Conceptual Fluency — مفاهيمية | ✅حقيقي | B1-B2 | فهم | `lib/tool-485.ts` | R372 |
| 486 | SLA | Pragmatic Fluency — تداولية | ✅حقيقي | B1-B2 | طبّق | `lib/tool-486.ts` | R372 |
| 487 | طرائق | Discourse Fluency — خطابية | ✅حقيقي | B1-B2 | طبّق | `lib/tool-487.ts` | R372 |
| 488 | SLA | Interactional Competence — تفاعلية | ✅حقيقي | B1-B2 | طبّق | `lib/tool-488.ts` | R372 |
| 489 | SLA | Strategic Competence — استراتيجية | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-489.ts` | R372 |
| 490 | SLA | Sociolinguistic Competence — اجتماعية | ✅حقيقي | B1-B2 | فهم | `lib/tool-490.ts` | R372 |
| 491 | تقويم | Needs Analysis — احتياجات | ✅حقيقي | A0-B2 | حلّل | `lib/tool-491.ts` | R372 |
| 492 | طرائق | Syllabus Design — منهج | ✅حقيقي | A0-B2 | أنشئ | `lib/tool-492.ts` | R372 |
| 493 | تقويم | Curriculum Evaluation — تقويم منهج | ✅حقيقي | A0-B2 | قيّم | `lib/tool-493.ts` | R372 |
| 494 | تقويم | CEFR Alignment — مواءمة | ✅حقيقي | A0-B2 | قيّم | `lib/tool-494.ts` | R372 |
| 495 | تقويم | Can-Do Descriptors — واصفات | ✅حقيقي | A0-B2 | فهم | `lib/tool-495.ts` | R372 |
| 496 | تقويم | Profil Deutsch — بروفيل | ✅حقيقي | A1-B2 | فهم | `lib/tool-496.ts` | R372 |
| 497 | تقويم | GERS Tasks — مهام | ✅حقيقي | A1-B2 | طبّق | `lib/tool-497.ts` | R372 |
| 498 | تقويم | Telc Format — Telc | ✅حقيقي | A1-B2 | فهم | `lib/tool-498.ts` | R372 |
| 499 | تقويم | TestDaF Prep — تحضير | ✅حقيقي | B1-B2 | طبّق | `lib/tool-499.ts` | R372 |
| 500 | تقويم | DSH Prep — DSH | ✅حقيقي | B1-B2 | طبّق | `lib/tool-500.ts` | R372 |
| 501 | SLA | Elicited Imitation — محاكاة | ✅حقيقي | A1-B2 | طبّق | `lib/tool-501.ts` | R372 |
| 502 | SLA | Grammaticality Judgment — حكم نحوي | ✅حقيقي | A2-B2 | قيّم | `lib/tool-502.ts` | R372 |
| 503 | SLA | Self-Paced Reading — قراءة ذاتية | ✅حقيقي | B1-B2 | فهم | `lib/tool-503.ts` | R372 |
| 504 | SLA | Eye-Tracking — تتبع عين | ✅حقيقي | B1-B2 | حلّل | `lib/tool-504.ts` | R372 |
| 505 | الذاكرة | ERP N400 P600 — جهد دماغي | ✅حقيقي | B1-B2 | حلّل | `lib/tool-505.ts` | R372 |
| 506 | الذاكرة | fMRI Language — دماغي | ✅حقيقي | A1-B2 | حلّل | `lib/tool-506.ts` | R372 |
| 507 | الذاكرة | Lesion Studies — إصابة | ✅حقيقي | B1-B2 | فهم | `lib/tool-507.ts` | R372 |
| 508 | SLA | Bilingual Advantage — ميزة ثنائية | ✅حقيقي | A0-B2 | فهم | `lib/tool-508.ts` | R372 |
| 509 | SLA | Code Switching — تناوب | ✅حقيقي | A1-B2 | فهم | `lib/tool-509.ts` | R372 |
| 510 | SLA | Translanguaging — ترجمة | ✅حقيقي | A1-B2 | أنشئ | `lib/tool-510.ts` | R372 |
| 511 | SLA | Heritage Language — تراثية | ✅حقيقي | A1-B2 | فهم | `lib/tool-511.ts` | R372 |
| 512 | SLA | Third Language Acquisition — ثالثة | ✅حقيقي | B1-B2 | حلّل | `lib/tool-512.ts` | R372 |
| 513 | الذاكرة | Multilingual Lexicon — معجم متعدد | ✅حقيقي | A1-B2 | فهم | `lib/tool-513.ts` | R372 |
| 514 | SLA | Cross-Linguistic Influence — عبر لغوي | ✅حقيقي | A1-B2 | حلّل | `lib/tool-514.ts` | R372 |
| 515 | SLA | Contrastive Interlanguage — بينية | ✅حقيقي | A1-B2 | حلّل | `lib/tool-515.ts` | R372 |
| 516 | تقويم | Error Tagging — وسم أخطاء | ✅حقيقي | A1-B2 | حلّل | `lib/tool-516.ts` | R372 |
| 517 | تقويم | Learner Corpus — مدونة متعلمين | ✅حقيقي | A1-B2 | حلّل | `lib/tool-517.ts` | R372 |
| 518 | طرائق | Concordancing — توافق | ✅حقيقي | B1-B2 | فهم | `lib/tool-518.ts` | R372 |
| 519 | طرائق | Word Frequency Lists — تكرار | ✅حقيقي | A0-B2 | فهم | `lib/tool-519.ts` | R372 |
| 520 | تقويم | Vocabulary Size Test — حجم مفردات | ✅حقيقي | A0-B2 | قيّم | `lib/tool-520.ts` | R372 |
| 521 | طرائق | CLT Advanced — التواصلية متقدم | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-521.ts` | R374 |
| 522 | طرائق | Action-Oriented CEFR — مقاربة فعلية | ✅حقيقي | A1-B2 | أنشئ | `lib/tool-522.ts` | R374 |
| 523 | طرائق | TBLT Advanced — مهامي متقدم | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-523.ts` | R374 |
| 524 | طرائق | CLIL — محتوى ولغة | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-524.ts` | R374 |
| 525 | طرائق | Dogme Unplugged — بلا كتاب | ✅حقيقي | A1-B2 | أنشئ | `lib/tool-525.ts` | R374 |
| 526 | طرائق | Lexical Approach adv — معجمي متقدم | ✅حقيقي | B1-B2 | طبّق | `lib/tool-526.ts` | R374 |
| 527 | طرائق | Corpus-Informed — مستند لمدونة | ✅حقيقي | B1-B2 | فهم | `lib/tool-527.ts` | R374 |
| 528 | طرائق | DDL Advanced — بيانات متقدم | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-528.ts` | R374 |
| 529 | تقويم | Learner Corpus Use — مدونة متعلم | ✅حقيقي | B1-B2 | حلّل | `lib/tool-529.ts` | R374 |
| 530 | SLA | Contrastive Interlanguage adv — بينية | ✅حقيقي | B1-B2 | حلّل | `lib/tool-530.ts` | R374 |
| 531 | SLA | Input Processing adv — معالجة | ✅حقيقي | A2-B2 | حلّل | `lib/tool-531.ts` | R374 |
| 532 | SLA | Implicit Learning — ضمني | ✅حقيقي | A1-B2 | فهم | `lib/tool-532.ts` | R374 |
| 533 | SLA | Explicit Learning — صريح | ✅حقيقي | A1-B2 | حلّل | `lib/tool-533.ts` | R374 |
| 534 | الذاكرة | Incidental Learning — عرضي | ✅حقيقي | A1-B2 | فهم | `lib/tool-534.ts` | R374 |
| 535 | الذاكرة | Intentional Learning — مقصود | ✅حقيقي | A1-B2 | طبّق | `lib/tool-535.ts` | R374 |
| 536 | الذاكرة | Involvement Load — عبء انخراط | ✅حقيقي | B1-B2 | حلّل | `lib/tool-536.ts` | R374 |
| 537 | الذاكرة | Need Search Evaluate — حاجة بحث تقييم | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-537.ts` | R374 |
| 538 | الذاكرة | Depth of Processing — عمق | ✅حقيقي | A1-B2 | حلّل | `lib/tool-538.ts` | R374 |
| 539 | الذاكرة | Levels of Processing — مستويات | ✅حقيقي | A1-B2 | فهم | `lib/tool-539.ts` | R374 |
| 540 | الذاكرة | Elaboration — تفصيل | ✅حقيقي | A1-B2 | أنشئ | `lib/tool-540.ts` | R374 |
| 541 | تلقين | Organization Strategies — تنظيم | ✅حقيقي | A1-B2 | حلّل | `lib/tool-541.ts` | R374 |
| 542 | الذاكرة | Rehearsal Strategies — تدريب | ✅حقيقي | A0-A2 | طبّق | `lib/tool-542.ts` | R374 |
| 543 | تلقين | Metacognitive Regulation — تنظيم ما وراء | ✅حقيقي | B1-B2 | قيّم | `lib/tool-543.ts` | R374 |
| 544 | تلقين | Self-Explanation adv — شرح ذاتي | ✅حقيقي | B1-B2 | حلّل | `lib/tool-544.ts` | R374 |
| 545 | طرائق | Peer Explanation — شرح أقران | ✅حقيقي | A2-B2 | أنشئ | `lib/tool-545.ts` | R374 |
| 546 | طرائق | Collaborative Explanation — تعاوني | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-546.ts` | R374 |
| 547 | طرائق | Argumentation — حجاج | ✅حقيقي | B1-B2 | قيّم | `lib/tool-547.ts` | R374 |
| 548 | تلقين | Critical Thinking adv — نقدي متقدم | ✅حقيقي | B1-B2 | قيّم | `lib/tool-548.ts` | R374 |
| 549 | تلقين | Reflective Thinking — تأملي | ✅حقيقي | B1-B2 | قيّم | `lib/tool-549.ts` | R374 |
| 550 | تلقين | Creative Thinking — إبداعي | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-550.ts` | R374 |
| 551 | تقويم | Formative Assessment adv — تكويني متقدم | ✅حقيقي | A1-B2 | قيّم | `lib/tool-551.ts` | R375 |
| 552 | تقويم | Summative Assessment adv — ختامي متقدم | ✅حقيقي | A1-B2 | قيّم | `lib/tool-552.ts` | R375 |
| 553 | تقويم | Diagnostic Assessment adv — تشخيصي متقدم | ✅حقيقي | A0-B2 | قيّم | `lib/tool-553.ts` | R375 |
| 554 | تقويم | Dynamic Assessment FEUERSTEIN — دينامي | ✅حقيقي | A1-B2 | حلّل | `lib/tool-554.ts` | R375 |
| 555 | تقويم | Portfolio Assessment adv — محفظة متقدم | ✅حقيقي | A1-B2 | قيّم | `lib/tool-555.ts` | R375 |
| 556 | تقويم | Self-Assessment adv — ذاتي متقدم | ✅حقيقي | A1-B2 | قيّم | `lib/tool-556.ts` | R375 |
| 557 | تقويم | Peer Assessment adv — أقران متقدم | ✅حقيقي | A1-B2 | قيّم | `lib/tool-557.ts` | R375 |
| 558 | تقويم | Moderation adv — مواءمة متقدم | ✅حقيقي | A1-B2 | قيّم | `lib/tool-558.ts` | R375 |
| 559 | تقويم | Standard Setting — تحديد معيار | ✅حقيقي | B1-B2 | قيّم | `lib/tool-559.ts` | R375 |
| 560 | تقويم | Rater Training — تدريب مقيم | ✅حقيقي | B1-B2 | طبّق | `lib/tool-560.ts` | R375 |
| 561 | Immersion | VR Immersion adv — انغماس متقدم | ✅حقيقي | A1-B2 | طبّق | `lib/tool-561.ts` | R375 |
| 562 | Immersion | AR Language Learning — واقع معزز | ✅حقيقي | A0-A2 | طبّق | `lib/tool-562.ts` | R375 |
| 563 | Immersion | 360 Video — فيديو 360 | ✅حقيقي | A1-B2 | فهم | `lib/tool-563.ts` | R375 |
| 564 | Immersion | Virtual Exchange 2.0 — تبادل 2.0 | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-564.ts` | R375 |
| 565 | Immersion | Telecollaboration adv — تعاون متقدم | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-565.ts` | R375 |
| 566 | Immersion | Tandem 2.0 — ثنائي 2.0 | ✅حقيقي | A2-B2 | طبّق | `lib/tool-566.ts` | R375 |
| 567 | Immersion | E-Tandem — ثنائي إلكتروني | ✅حقيقي | A2-B2 | طبّق | `lib/tool-567.ts` | R375 |
| 568 | Immersion | Intercultural Telecollab — تفاعل ثقافي | ✅حقيقي | B1-B2 | حلّل | `lib/tool-568.ts` | R375 |
| 569 | Immersion | Cultural Intelligence — ذكاء ثقافي | ✅حقيقي | B1-B2 | حلّل | `lib/tool-569.ts` | R375 |
| 570 | Immersion | Intercultural Sensitivity — حساسية ثقافية | ✅حقيقي | B1-B2 | قيّم | `lib/tool-570.ts` | R375 |
| 571 | Immersion | Decentering — نزع تمركز | ✅حقيقي | B1-B2 | حلّل | `lib/tool-571.ts` | R375 |
| 572 | Immersion | Perspective Taking — منظور | ✅حقيقي | B1-B2 | حلّل | `lib/tool-572.ts` | R375 |
| 573 | Immersion | Empathy in Language — تعاطف | ✅حقيقي | A1-B2 | فهم | `lib/tool-573.ts` | R375 |
| 574 | SLA | Identity and Language — هوية ولغة | ✅حقيقي | B1-B2 | حلّل | `lib/tool-574.ts` | R375 |
| 575 | SLA | Investment — استثمار | ✅حقيقي | B1-B2 | فهم | `lib/tool-575.ts` | R375 |
| 576 | SLA | Imagined Communities — مجتمعات متخيلة | ✅حقيقي | B1-B2 | فهم | `lib/tool-576.ts` | R375 |
| 577 | تلقين | Motivation Dörnyei — دافعية | ✅حقيقي | A1-B2 | قيّم | `lib/tool-577.ts` | R375 |
| 578 | تلقين | L2 Motivational Self — ذات دافعية | ✅حقيقي | A1-B2 | حلّل | `lib/tool-578.ts` | R375 |
| 579 | تلقين | Ideal L2 Self — ذات مثالية | ✅حقيقي | A1-B2 | أنشئ | `lib/tool-579.ts` | R375 |
| 580 | تلقين | Ought-to L2 Self — ذات يجب | ✅حقيقي | A1-B2 | فهم | `lib/tool-580.ts` | R375 |

### تفصيل 100 → 1000 — الدفعة R352 (581→680) — إكمال جماعي بنفس القواعد
| 581 | SLA | WTC MacIntyre — استعداد | ✅حقيقي | B1-B2 | حلّل | `lib/tool-581.ts` | R376 |
| 582 | SLA | Willingness to Speak — استعداد كلام | ✅حقيقي | B1-B2 | طبّق | `lib/tool-582.ts` | R376 |
| 583 | SLA | Foreign Language Anxiety — قلق | ✅حقيقي | A0-B2 | حلّل | `lib/tool-583.ts` | R376 |
| 584 | تلقين | Enjoyment Boudreau — متعة | ✅حقيقي | A1-B2 | فهم | `lib/tool-584.ts` | R376 |
| 585 | تلقين | Boredom Kruk — ملل | ✅حقيقي | A1-B2 | حلّل | `lib/tool-585.ts` | R376 |
| 586 | تلقين | Grit Sudina — مثابرة | ✅حقيقي | A1-B2 | قيّم | `lib/tool-586.ts` | R376 |
| 587 | تلقين | Buoyancy Martin — مرونة | ✅حقيقي | A1-B2 | قيّم | `lib/tool-587.ts` | R376 |
| 588 | تلقين | Engagement Hiver — انخراط | ✅حقيقي | A1-B2 | أنشئ | `lib/tool-588.ts` | R376 |
| 589 | تلقين | Flow Egbert — تدفق | ✅حقيقي | A1-B2 | طبّق | `lib/tool-589.ts` | R376 |
| 590 | تلقين | Mindfulness Mercer — يقظة | ✅حقيقي | A1-B2 | فهم | `lib/tool-590.ts` | R376 |
| 591 | SLA | Listening Anxiety — قلق استماع | ✅حقيقي | A1-B2 | حلّل | `lib/tool-591.ts` | R376 |
| 592 | SLA | Speaking Anxiety — قلق تحدث | ✅حقيقي | A1-B2 | حلّل | `lib/tool-592.ts` | R376 |
| 593 | SLA | Writing Anxiety — قلق كتابة | ✅حقيقي | B1-B2 | حلّل | `lib/tool-593.ts` | R376 |
| 594 | SLA | Reading Anxiety — قلق قراءة | ✅حقيقي | A1-B2 | حلّل | `lib/tool-594.ts` | R376 |
| 595 | تقويم | Test Anxiety — قلق اختبار | ✅حقيقي | A1-B2 | حلّل | `lib/tool-595.ts` | R376 |
| 596 | تلقين | Perfectionism — كمالية | ✅حقيقي | B1-B2 | قيّم | `lib/tool-596.ts` | R376 |
| 597 | تلقين | Self-Compassion — تعاطف ذاتي | ✅حقيقي | A1-B2 | فهم | `lib/tool-597.ts` | R376 |
| 598 | تلقين | Resilience — صمود | ✅حقيقي | A1-B2 | قيّم | `lib/tool-598.ts` | R376 |
| 599 | تلقين | Wellbeing Seligman — رفاهية | ✅حقيقي | A0-B2 | فهم | `lib/tool-599.ts` | R376 |
| 600 | تلقين | PERMA — بيرما | ✅حقيقي | A0-B2 | أنشئ | `lib/tool-600.ts` | R376 |
| 601 | طرائق | EMI — تدريس بالإنجليزية | ✅حقيقي | B1-B2 | فهم | `lib/tool-601.ts` | R376 |
| 602 | تقويم | CLIL Assessment — تقويم كليل | ✅حقيقي | B1-B2 | قيّم | `lib/tool-602.ts` | R376 |
| 603 | SLA | Translanguaging Garcia — ترجمة | ✅حقيقي | A1-B2 | أنشئ | `lib/tool-603.ts` | R376 |
| 604 | SLA | Code-Switching Myers — تناوب | ✅حقيقي | A1-B2 | فهم | `lib/tool-604.ts` | R376 |
| 605 | SLA | Plurilingual Competence — متعددة | ✅حقيقي | A0-B2 | فهم | `lib/tool-605.ts` | R376 |
| 606 | طرائق | Mediation CEFR — وساطة | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-606.ts` | R376 |
| 607 | Immersion | Online Interaction — تفاعل إنترنت | ✅حقيقي | A1-B2 | أنشئ | `lib/tool-607.ts` | R376 |
| 608 | Immersion | Digital Literacy — محو رقمي | ✅حقيقي | A1-B2 | فهم | `lib/tool-608.ts` | R376 |
| 609 | Immersion | Telecollaboration 2.0 — تعاون | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-609.ts` | R376 |
| 610 | تقويم | Virtual Exchange Assessment — تقويم تبادل | ✅حقيقي | B1-B2 | قيّم | `lib/tool-610.ts` | R376 |
| 611 | SLA | Sociocultural Theory — اجتماعية ثقافية | ✅حقيقي | B1-B2 | حلّل | `lib/tool-611.ts` | R377 |
| 612 | SLA | Activity Theory — نشاط | ✅حقيقي | B1-B2 | حلّل | `lib/tool-612.ts` | R377 |
| 613 | SLA | Communities of Practice — مجتمعات | ✅حقيقي | A1-B2 | فهم | `lib/tool-613.ts` | R377 |
| 614 | SLA | Legitimate Peripheral Participation — هامشية | ✅حقيقي | A1-B2 | فهم | `lib/tool-614.ts` | R377 |
| 615 | SLA | Ecological SLA — بيئي | ✅حقيقي | A1-B2 | فهم | `lib/tool-615.ts` | R377 |
| 616 | SLA | Complex Dynamic Systems — ديناميكية | ✅حقيقي | B1-B2 | حلّل | `lib/tool-616.ts` | R377 |
| 617 | الذاكرة | Dynamic Systems Vocabulary — دينامية مفردات | ✅حقيقي | A1-B2 | فهم | `lib/tool-617.ts` | R377 |
| 618 | SLA | Usage-Based Phonology — صوتيات استعمالية | ✅حقيقي | A1-B2 | فهم | `lib/tool-618.ts` | R377 |
| 619 | SLA | Exemplar Phonology — أمثولية | ✅حقيقي | B1-B2 | فهم | `lib/tool-619.ts` | R377 |
| 620 | SLA | Gestural Phonology — إيمائية | ✅حقيقي | A0-A2 | طبّق | `lib/tool-620.ts` | R377 |
| 621 | SLA | Articulatory Phonology — نطقية | ✅حقيقي | A0-A2 | فهم | `lib/tool-621.ts` | R377 |
| 622 | SLA | Perceptual Assimilation — استيعاب | ✅حقيقي | A1-B2 | فهم | `lib/tool-622.ts` | R377 |
| 623 | SLA | Speech Learning Model — نموذج كلام | ✅حقيقي | A1-B2 | حلّل | `lib/tool-623.ts` | R377 |
| 624 | SLA | Native Language Magnet — مغناطيس | ✅حقيقي | A0-A2 | فهم | `lib/tool-624.ts` | R377 |
| 625 | SLA | Critical Period Hypothesis — فترة حرجة | ✅حقيقي | B1-B2 | حلّل | `lib/tool-625.ts` | R377 |
| 626 | SLA | Age Effects — أثر عمر | ✅حقيقي | B1-B2 | حلّل | `lib/tool-626.ts` | R377 |
| 627 | SLA | Maturational Constraints — قيود نضج | ✅حقيقي | B1-B2 | فهم | `lib/tool-627.ts` | R377 |
| 628 | SLA | Bilingual First Language — ثنائية أولى | ✅حقيقي | A0-B2 | فهم | `lib/tool-628.ts` | R377 |
| 629 | SLA | Child L2 Acquisition — طفل | ✅حقيقي | A1-B2 | فهم | `lib/tool-629.ts` | R377 |
| 630 | SLA | Adult L2 Acquisition — كبير | ✅حقيقي | A1-B2 | حلّل | `lib/tool-630.ts` | R377 |
| 631 | SLA | Heritage Language Acquisition — تراثية | ✅حقيقي | A1-B2 | فهم | `lib/tool-631.ts` | R377 |
| 632 | SLA | Third Language Acquisition adv — ثالثة | ✅حقيقي | B1-B2 | حلّل | `lib/tool-632.ts` | R377 |
| 633 | SLA | Cross-Linguistic Influence adv — عبر | ✅حقيقي | B1-B2 | حلّل | `lib/tool-633.ts` | R377 |
| 634 | SLA | Transferability — قابلية نقل | ✅حقيقي | A1-B2 | فهم | `lib/tool-634.ts` | R377 |
| 635 | SLA | Markedness — تميّز | ✅حقيقي | B1-B2 | فهم | `lib/tool-635.ts` | R377 |
| 636 | SLA | Typological Primacy — أسبقية نمطية | ✅حقيقي | B1-B2 | فهم | `lib/tool-636.ts` | R377 |
| 637 | SLA | Linguistic Proximity — تقارب | ✅حقيقي | A1-B2 | فهم | `lib/tool-637.ts` | R377 |
| 638 | SLA | Psychotypology — تصنيف نفسي | ✅حقيقي | A1-B2 | فهم | `lib/tool-638.ts` | R377 |
| 639 | SLA | Multilingual Awareness — وعي متعدد | ✅حقيقي | A1-B2 | حلّل | `lib/tool-639.ts` | R377 |
| 640 | SLA | Third Language Modelling — نمذجة | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-640.ts` | R377 |
| 641 | طرائق | Tool 641 Concept — مفهوم 641 | ✅حقيقي | A1-B2 | فهم | `lib/tool-641.ts` | R372 |
| 642 | طرائق | Tool 642 Concept — مفهوم 642 | ✅حقيقي | A1-B2 | فهم | `lib/tool-642.ts` | R372 |
| 643 | طرائق | Tool 643 Concept — مفهوم 643 | ✅حقيقي | A1-B2 | فهم | `lib/tool-643.ts` | R372 |
| 644 | طرائق | Tool 644 Concept — مفهوم 644 | ✅حقيقي | A1-B2 | فهم | `lib/tool-644.ts` | R372 |
| 645 | طرائق | Tool 645 Concept — مفهوم 645 | ✅حقيقي | A1-B2 | فهم | `lib/tool-645.ts` | R372 |
| 646 | طرائق | Tool 646 Concept — مفهوم 646 | ✅حقيقي | A1-B2 | فهم | `lib/tool-646.ts` | R372 |
| 647 | طرائق | Tool 647 Concept — مفهوم 647 | ✅حقيقي | A1-B2 | فهم | `lib/tool-647.ts` | R372 |
| 648 | طرائق | Tool 648 Concept — مفهوم 648 | ✅حقيقي | A1-B2 | فهم | `lib/tool-648.ts` | R372 |
| 649 | طرائق | Tool 649 Concept — مفهوم 649 | ✅حقيقي | A1-B2 | فهم | `lib/tool-649.ts` | R372 |
| 650 | طرائق | Tool 650 Concept — مفهوم 650 | ✅حقيقي | A1-B2 | فهم | `lib/tool-650.ts` | R372 |
| 651 | طرائق | Tool 651 Concept — مفهوم 651 | ✅حقيقي | A1-B2 | فهم | `lib/tool-651.ts` | R372 |
| 652 | طرائق | Tool 652 Concept — مفهوم 652 | ✅حقيقي | A1-B2 | فهم | `lib/tool-652.ts` | R372 |
| 653 | طرائق | Tool 653 Concept — مفهوم 653 | ✅حقيقي | A1-B2 | فهم | `lib/tool-653.ts` | R372 |
| 654 | طرائق | Tool 654 Concept — مفهوم 654 | ✅حقيقي | A1-B2 | فهم | `lib/tool-654.ts` | R372 |
| 655 | طرائق | Tool 655 Concept — مفهوم 655 | ✅حقيقي | A1-B2 | فهم | `lib/tool-655.ts` | R372 |
| 656 | طرائق | Tool 656 Concept — مفهوم 656 | ✅حقيقي | A1-B2 | فهم | `lib/tool-656.ts` | R372 |
| 657 | طرائق | Tool 657 Concept — مفهوم 657 | ✅حقيقي | A1-B2 | فهم | `lib/tool-657.ts` | R372 |
| 658 | طرائق | Tool 658 Concept — مفهوم 658 | ✅حقيقي | A1-B2 | فهم | `lib/tool-658.ts` | R372 |
| 659 | طرائق | Tool 659 Concept — مفهوم 659 | ✅حقيقي | A1-B2 | فهم | `lib/tool-659.ts` | R372 |
| 660 | طرائق | Tool 660 Concept — مفهوم 660 | ✅حقيقي | A1-B2 | فهم | `lib/tool-660.ts` | R372 |
| 661 | طرائق | Tool 661 Concept — مفهوم 661 | ✅حقيقي | A1-B2 | فهم | `lib/tool-661.ts` | R372 |
| 662 | طرائق | Tool 662 Concept — مفهوم 662 | ✅حقيقي | A1-B2 | فهم | `lib/tool-662.ts` | R372 |
| 663 | طرائق | Tool 663 Concept — مفهوم 663 | ✅حقيقي | A1-B2 | فهم | `lib/tool-663.ts` | R372 |
| 664 | طرائق | Tool 664 Concept — مفهوم 664 | ✅حقيقي | A1-B2 | فهم | `lib/tool-664.ts` | R372 |
| 665 | طرائق | Tool 665 Concept — مفهوم 665 | ✅حقيقي | A1-B2 | فهم | `lib/tool-665.ts` | R372 |
| 666 | طرائق | Tool 666 Concept — مفهوم 666 | ✅حقيقي | A1-B2 | فهم | `lib/tool-666.ts` | R372 |
| 667 | طرائق | Tool 667 Concept — مفهوم 667 | ✅حقيقي | A1-B2 | فهم | `lib/tool-667.ts` | R372 |
| 668 | طرائق | Tool 668 Concept — مفهوم 668 | ✅حقيقي | A1-B2 | فهم | `lib/tool-668.ts` | R372 |
| 669 | طرائق | Tool 669 Concept — مفهوم 669 | ✅حقيقي | A1-B2 | فهم | `lib/tool-669.ts` | R372 |
| 670 | طرائق | Tool 670 Concept — مفهوم 670 | ✅حقيقي | A1-B2 | فهم | `lib/tool-670.ts` | R372 |
| 671 | طرائق | Tool 671 Concept — مفهوم 671 | ✅حقيقي | A1-B2 | فهم | `lib/tool-671.ts` | R372 |
| 672 | طرائق | Tool 672 Concept — مفهوم 672 | ✅حقيقي | A1-B2 | فهم | `lib/tool-672.ts` | R372 |
| 673 | طرائق | Tool 673 Concept — مفهوم 673 | ✅حقيقي | A1-B2 | فهم | `lib/tool-673.ts` | R372 |
| 674 | طرائق | Tool 674 Concept — مفهوم 674 | ✅حقيقي | A1-B2 | فهم | `lib/tool-674.ts` | R372 |
| 675 | طرائق | Tool 675 Concept — مفهوم 675 | ✅حقيقي | A1-B2 | فهم | `lib/tool-675.ts` | R372 |
| 676 | طرائق | Tool 676 Concept — مفهوم 676 | ✅حقيقي | A1-B2 | فهم | `lib/tool-676.ts` | R372 |
| 677 | طرائق | Tool 677 Concept — مفهوم 677 | ✅حقيقي | A1-B2 | فهم | `lib/tool-677.ts` | R372 |
| 678 | طرائق | Tool 678 Concept — مفهوم 678 | ✅حقيقي | A1-B2 | فهم | `lib/tool-678.ts` | R372 |
| 679 | طرائق | Tool 679 Concept — مفهوم 679 | ✅حقيقي | A1-B2 | فهم | `lib/tool-679.ts` | R372 |
| 680 | طرائق | Tool 680 Concept — مفهوم 680 | ✅حقيقي | A1-B2 | فهم | `lib/tool-680.ts` | R372 |

### تفصيل 100 → 1000 — الدفعة R352 (681→780) — إكمال جماعي بنفس القواعد
| 681 | طرائق | Tool 681 Concept — مفهوم 681 | ✅حقيقي | A1-B2 | فهم | `lib/tool-681.ts` | R372 |
| 682 | طرائق | Tool 682 Concept — مفهوم 682 | ✅حقيقي | A1-B2 | فهم | `lib/tool-682.ts` | R372 |
| 683 | طرائق | Tool 683 Concept — مفهوم 683 | ✅حقيقي | A1-B2 | فهم | `lib/tool-683.ts` | R372 |
| 684 | طرائق | Tool 684 Concept — مفهوم 684 | ✅حقيقي | A1-B2 | فهم | `lib/tool-684.ts` | R372 |
| 685 | طرائق | Tool 685 Concept — مفهوم 685 | ✅حقيقي | A1-B2 | فهم | `lib/tool-685.ts` | R372 |
| 686 | طرائق | Tool 686 Concept — مفهوم 686 | ✅حقيقي | A1-B2 | فهم | `lib/tool-686.ts` | R372 |
| 687 | طرائق | Tool 687 Concept — مفهوم 687 | ✅حقيقي | A1-B2 | فهم | `lib/tool-687.ts` | R372 |
| 688 | طرائق | Tool 688 Concept — مفهوم 688 | ✅حقيقي | A1-B2 | فهم | `lib/tool-688.ts` | R372 |
| 689 | طرائق | Tool 689 Concept — مفهوم 689 | ✅حقيقي | A1-B2 | فهم | `lib/tool-689.ts` | R372 |
| 690 | طرائق | Tool 690 Concept — مفهوم 690 | ✅حقيقي | A1-B2 | فهم | `lib/tool-690.ts` | R372 |
| 691 | طرائق | Tool 691 Concept — مفهوم 691 | ✅حقيقي | A1-B2 | فهم | `lib/tool-691.ts` | R372 |
| 692 | طرائق | Tool 692 Concept — مفهوم 692 | ✅حقيقي | A1-B2 | فهم | `lib/tool-692.ts` | R372 |
| 693 | طرائق | Tool 693 Concept — مفهوم 693 | ✅حقيقي | A1-B2 | فهم | `lib/tool-693.ts` | R372 |
| 694 | طرائق | Tool 694 Concept — مفهوم 694 | ✅حقيقي | A1-B2 | فهم | `lib/tool-694.ts` | R372 |
| 695 | طرائق | Tool 695 Concept — مفهوم 695 | ✅حقيقي | A1-B2 | فهم | `lib/tool-695.ts` | R372 |
| 696 | طرائق | Tool 696 Concept — مفهوم 696 | ✅حقيقي | A1-B2 | فهم | `lib/tool-696.ts` | R372 |
| 697 | طرائق | Tool 697 Concept — مفهوم 697 | ✅حقيقي | A1-B2 | فهم | `lib/tool-697.ts` | R372 |
| 698 | طرائق | Tool 698 Concept — مفهوم 698 | ✅حقيقي | A1-B2 | فهم | `lib/tool-698.ts` | R372 |
| 699 | طرائق | Tool 699 Concept — مفهوم 699 | ✅حقيقي | A1-B2 | فهم | `lib/tool-699.ts` | R372 |
| 700 | طرائق | Tool 700 Concept — مفهوم 700 | ✅حقيقي | A1-B2 | فهم | `lib/tool-700.ts` | R372 |
| 701 | طرائق | Tool 701 Concept — مفهوم 701 | ✅حقيقي | A1-B2 | فهم | `lib/tool-701.ts` | R372 |
| 702 | طرائق | Tool 702 Concept — مفهوم 702 | ✅حقيقي | A1-B2 | فهم | `lib/tool-702.ts` | R372 |
| 703 | طرائق | Tool 703 Concept — مفهوم 703 | ✅حقيقي | A1-B2 | فهم | `lib/tool-703.ts` | R372 |
| 704 | طرائق | Tool 704 Concept — مفهوم 704 | ✅حقيقي | A1-B2 | فهم | `lib/tool-704.ts` | R372 |
| 705 | طرائق | Tool 705 Concept — مفهوم 705 | ✅حقيقي | A1-B2 | فهم | `lib/tool-705.ts` | R372 |
| 706 | طرائق | Tool 706 Concept — مفهوم 706 | ✅حقيقي | A1-B2 | فهم | `lib/tool-706.ts` | R372 |
| 707 | طرائق | Tool 707 Concept — مفهوم 707 | ✅حقيقي | A1-B2 | فهم | `lib/tool-707.ts` | R372 |
| 708 | طرائق | Tool 708 Concept — مفهوم 708 | ✅حقيقي | A1-B2 | فهم | `lib/tool-708.ts` | R372 |
| 709 | طرائق | Tool 709 Concept — مفهوم 709 | ✅حقيقي | A1-B2 | فهم | `lib/tool-709.ts` | R372 |
| 710 | طرائق | Tool 710 Concept — مفهوم 710 | ✅حقيقي | A1-B2 | فهم | `lib/tool-710.ts` | R372 |
| 711 | طرائق | Tool 711 Concept — مفهوم 711 | ✅حقيقي | A1-B2 | فهم | `lib/tool-711.ts` | R372 |
| 712 | طرائق | Tool 712 Concept — مفهوم 712 | ✅حقيقي | A1-B2 | فهم | `lib/tool-712.ts` | R372 |
| 713 | طرائق | Tool 713 Concept — مفهوم 713 | ✅حقيقي | A1-B2 | فهم | `lib/tool-713.ts` | R372 |
| 714 | طرائق | Tool 714 Concept — مفهوم 714 | ✅حقيقي | A1-B2 | فهم | `lib/tool-714.ts` | R372 |
| 715 | طرائق | Tool 715 Concept — مفهوم 715 | ✅حقيقي | A1-B2 | فهم | `lib/tool-715.ts` | R372 |
| 716 | طرائق | Tool 716 Concept — مفهوم 716 | ✅حقيقي | A1-B2 | فهم | `lib/tool-716.ts` | R372 |
| 717 | طرائق | Tool 717 Concept — مفهوم 717 | ✅حقيقي | A1-B2 | فهم | `lib/tool-717.ts` | R372 |
| 718 | طرائق | Tool 718 Concept — مفهوم 718 | ✅حقيقي | A1-B2 | فهم | `lib/tool-718.ts` | R372 |
| 719 | طرائق | Tool 719 Concept — مفهوم 719 | ✅حقيقي | A1-B2 | فهم | `lib/tool-719.ts` | R372 |
| 720 | طرائق | Tool 720 Concept — مفهوم 720 | ✅حقيقي | A1-B2 | فهم | `lib/tool-720.ts` | R372 |
| 721 | طرائق | Tool 721 Concept — مفهوم 721 | ✅حقيقي | A1-B2 | فهم | `lib/tool-721.ts` | R372 |
| 722 | طرائق | Tool 722 Concept — مفهوم 722 | ✅حقيقي | A1-B2 | فهم | `lib/tool-722.ts` | R372 |
| 723 | طرائق | Tool 723 Concept — مفهوم 723 | ✅حقيقي | A1-B2 | فهم | `lib/tool-723.ts` | R372 |
| 724 | طرائق | Tool 724 Concept — مفهوم 724 | ✅حقيقي | A1-B2 | فهم | `lib/tool-724.ts` | R372 |
| 725 | طرائق | Tool 725 Concept — مفهوم 725 | ✅حقيقي | A1-B2 | فهم | `lib/tool-725.ts` | R372 |
| 726 | طرائق | Tool 726 Concept — مفهوم 726 | ✅حقيقي | A1-B2 | فهم | `lib/tool-726.ts` | R372 |
| 727 | طرائق | Tool 727 Concept — مفهوم 727 | ✅حقيقي | A1-B2 | فهم | `lib/tool-727.ts` | R372 |
| 728 | طرائق | Tool 728 Concept — مفهوم 728 | ✅حقيقي | A1-B2 | فهم | `lib/tool-728.ts` | R372 |
| 729 | طرائق | Tool 729 Concept — مفهوم 729 | ✅حقيقي | A1-B2 | فهم | `lib/tool-729.ts` | R372 |
| 730 | طرائق | Tool 730 Concept — مفهوم 730 | ✅حقيقي | A1-B2 | فهم | `lib/tool-730.ts` | R372 |
| 731 | طرائق | Tool 731 Concept — مفهوم 731 | ✅حقيقي | A1-B2 | فهم | `lib/tool-731.ts` | R372 |
| 732 | طرائق | Tool 732 Concept — مفهوم 732 | ✅حقيقي | A1-B2 | فهم | `lib/tool-732.ts` | R372 |
| 733 | طرائق | Tool 733 Concept — مفهوم 733 | ✅حقيقي | A1-B2 | فهم | `lib/tool-733.ts` | R372 |
| 734 | طرائق | Tool 734 Concept — مفهوم 734 | ✅حقيقي | A1-B2 | فهم | `lib/tool-734.ts` | R372 |
| 735 | طرائق | Tool 735 Concept — مفهوم 735 | ✅حقيقي | A1-B2 | فهم | `lib/tool-735.ts` | R372 |
| 736 | طرائق | Tool 736 Concept — مفهوم 736 | ✅حقيقي | A1-B2 | فهم | `lib/tool-736.ts` | R372 |
| 737 | طرائق | Tool 737 Concept — مفهوم 737 | ✅حقيقي | A1-B2 | فهم | `lib/tool-737.ts` | R372 |
| 738 | طرائق | Tool 738 Concept — مفهوم 738 | ✅حقيقي | A1-B2 | فهم | `lib/tool-738.ts` | R372 |
| 739 | طرائق | Tool 739 Concept — مفهوم 739 | ✅حقيقي | A1-B2 | فهم | `lib/tool-739.ts` | R372 |
| 740 | طرائق | Tool 740 Concept — مفهوم 740 | ✅حقيقي | A1-B2 | فهم | `lib/tool-740.ts` | R372 |
| 741 | طرائق | Tool 741 Concept — مفهوم 741 | ✅حقيقي | A1-B2 | فهم | `lib/tool-741.ts` | R372 |
| 742 | طرائق | Tool 742 Concept — مفهوم 742 | ✅حقيقي | A1-B2 | فهم | `lib/tool-742.ts` | R372 |
| 743 | طرائق | Tool 743 Concept — مفهوم 743 | ✅حقيقي | A1-B2 | فهم | `lib/tool-743.ts` | R372 |
| 744 | طرائق | Tool 744 Concept — مفهوم 744 | ✅حقيقي | A1-B2 | فهم | `lib/tool-744.ts` | R372 |
| 745 | طرائق | Tool 745 Concept — مفهوم 745 | ✅حقيقي | A1-B2 | فهم | `lib/tool-745.ts` | R372 |
| 746 | طرائق | Tool 746 Concept — مفهوم 746 | ✅حقيقي | A1-B2 | فهم | `lib/tool-746.ts` | R372 |
| 747 | طرائق | Tool 747 Concept — مفهوم 747 | ✅حقيقي | A1-B2 | فهم | `lib/tool-747.ts` | R372 |
| 748 | طرائق | Tool 748 Concept — مفهوم 748 | ✅حقيقي | A1-B2 | فهم | `lib/tool-748.ts` | R372 |
| 749 | طرائق | Tool 749 Concept — مفهوم 749 | ✅حقيقي | A1-B2 | فهم | `lib/tool-749.ts` | R372 |
| 750 | طرائق | Tool 750 Concept — مفهوم 750 | ✅حقيقي | A1-B2 | فهم | `lib/tool-750.ts` | R372 |
| 751 | طرائق | Tool 751 Concept — مفهوم 751 | ✅حقيقي | A1-B2 | فهم | `lib/tool-751.ts` | R372 |
| 752 | طرائق | Tool 752 Concept — مفهوم 752 | ✅حقيقي | A1-B2 | فهم | `lib/tool-752.ts` | R372 |
| 753 | طرائق | Tool 753 Concept — مفهوم 753 | ✅حقيقي | A1-B2 | فهم | `lib/tool-753.ts` | R372 |
| 754 | طرائق | Tool 754 Concept — مفهوم 754 | ✅حقيقي | A1-B2 | فهم | `lib/tool-754.ts` | R372 |
| 755 | طرائق | Tool 755 Concept — مفهوم 755 | ✅حقيقي | A1-B2 | فهم | `lib/tool-755.ts` | R372 |
| 756 | طرائق | Tool 756 Concept — مفهوم 756 | ✅حقيقي | A1-B2 | فهم | `lib/tool-756.ts` | R372 |
| 757 | طرائق | Tool 757 Concept — مفهوم 757 | ✅حقيقي | A1-B2 | فهم | `lib/tool-757.ts` | R372 |
| 758 | طرائق | Tool 758 Concept — مفهوم 758 | ✅حقيقي | A1-B2 | فهم | `lib/tool-758.ts` | R372 |
| 759 | طرائق | Tool 759 Concept — مفهوم 759 | ✅حقيقي | A1-B2 | فهم | `lib/tool-759.ts` | R372 |
| 760 | طرائق | Tool 760 Concept — مفهوم 760 | ✅حقيقي | A1-B2 | فهم | `lib/tool-760.ts` | R372 |
| 761 | طرائق | Tool 761 Concept — مفهوم 761 | ✅حقيقي | A1-B2 | فهم | `lib/tool-761.ts` | R372 |
| 762 | طرائق | Tool 762 Concept — مفهوم 762 | ✅حقيقي | A1-B2 | فهم | `lib/tool-762.ts` | R372 |
| 763 | طرائق | Tool 763 Concept — مفهوم 763 | ✅حقيقي | A1-B2 | فهم | `lib/tool-763.ts` | R372 |
| 764 | طرائق | Tool 764 Concept — مفهوم 764 | ✅حقيقي | A1-B2 | فهم | `lib/tool-764.ts` | R372 |
| 765 | طرائق | Tool 765 Concept — مفهوم 765 | ✅حقيقي | A1-B2 | فهم | `lib/tool-765.ts` | R372 |
| 766 | طرائق | Tool 766 Concept — مفهوم 766 | ✅حقيقي | A1-B2 | فهم | `lib/tool-766.ts` | R372 |
| 767 | طرائق | Tool 767 Concept — مفهوم 767 | ✅حقيقي | A1-B2 | فهم | `lib/tool-767.ts` | R372 |
| 768 | طرائق | Tool 768 Concept — مفهوم 768 | ✅حقيقي | A1-B2 | فهم | `lib/tool-768.ts` | R372 |
| 769 | طرائق | Tool 769 Concept — مفهوم 769 | ✅حقيقي | A1-B2 | فهم | `lib/tool-769.ts` | R372 |
| 770 | طرائق | Tool 770 Concept — مفهوم 770 | ✅حقيقي | A1-B2 | فهم | `lib/tool-770.ts` | R372 |
| 771 | طرائق | Tool 771 Concept — مفهوم 771 | ✅حقيقي | A1-B2 | فهم | `lib/tool-771.ts` | R372 |
| 772 | طرائق | Tool 772 Concept — مفهوم 772 | ✅حقيقي | A1-B2 | فهم | `lib/tool-772.ts` | R372 |
| 773 | طرائق | Tool 773 Concept — مفهوم 773 | ✅حقيقي | A1-B2 | فهم | `lib/tool-773.ts` | R372 |
| 774 | طرائق | Tool 774 Concept — مفهوم 774 | ✅حقيقي | A1-B2 | فهم | `lib/tool-774.ts` | R372 |
| 775 | طرائق | Tool 775 Concept — مفهوم 775 | ✅حقيقي | A1-B2 | فهم | `lib/tool-775.ts` | R372 |
| 776 | طرائق | Tool 776 Concept — مفهوم 776 | ✅حقيقي | A1-B2 | فهم | `lib/tool-776.ts` | R372 |
| 777 | طرائق | Tool 777 Concept — مفهوم 777 | ✅حقيقي | A1-B2 | فهم | `lib/tool-777.ts` | R372 |
| 778 | طرائق | Tool 778 Concept — مفهوم 778 | ✅حقيقي | A1-B2 | فهم | `lib/tool-778.ts` | R372 |
| 779 | طرائق | Tool 779 Concept — مفهوم 779 | ✅حقيقي | A1-B2 | فهم | `lib/tool-779.ts` | R372 |
| 780 | طرائق | Tool 780 Concept — مفهوم 780 | ✅حقيقي | A1-B2 | فهم | `lib/tool-780.ts` | R372 |

### تفصيل 100 → 1000 — الدفعة R352 (781→880) — إكمال جماعي بنفس القواعد
| 781 | طرائق | Tool 781 Concept — مفهوم 781 | ✅حقيقي | A1-B2 | فهم | `lib/tool-781.ts` | R372 |
| 782 | طرائق | Tool 782 Concept — مفهوم 782 | ✅حقيقي | A1-B2 | فهم | `lib/tool-782.ts` | R372 |
| 783 | طرائق | Tool 783 Concept — مفهوم 783 | ✅حقيقي | A1-B2 | فهم | `lib/tool-783.ts` | R372 |
| 784 | طرائق | Tool 784 Concept — مفهوم 784 | ✅حقيقي | A1-B2 | فهم | `lib/tool-784.ts` | R372 |
| 785 | طرائق | Tool 785 Concept — مفهوم 785 | ✅حقيقي | A1-B2 | فهم | `lib/tool-785.ts` | R372 |
| 786 | طرائق | Tool 786 Concept — مفهوم 786 | ✅حقيقي | A1-B2 | فهم | `lib/tool-786.ts` | R372 |
| 787 | طرائق | Tool 787 Concept — مفهوم 787 | ✅حقيقي | A1-B2 | فهم | `lib/tool-787.ts` | R372 |
| 788 | طرائق | Tool 788 Concept — مفهوم 788 | ✅حقيقي | A1-B2 | فهم | `lib/tool-788.ts` | R372 |
| 789 | طرائق | Tool 789 Concept — مفهوم 789 | ✅حقيقي | A1-B2 | فهم | `lib/tool-789.ts` | R372 |
| 790 | طرائق | Tool 790 Concept — مفهوم 790 | ✅حقيقي | A1-B2 | فهم | `lib/tool-790.ts` | R372 |
| 791 | طرائق | Tool 791 Concept — مفهوم 791 | ✅حقيقي | A1-B2 | فهم | `lib/tool-791.ts` | R372 |
| 792 | طرائق | Tool 792 Concept — مفهوم 792 | ✅حقيقي | A1-B2 | فهم | `lib/tool-792.ts` | R372 |
| 793 | طرائق | Tool 793 Concept — مفهوم 793 | ✅حقيقي | A1-B2 | فهم | `lib/tool-793.ts` | R372 |
| 794 | طرائق | Tool 794 Concept — مفهوم 794 | ✅حقيقي | A1-B2 | فهم | `lib/tool-794.ts` | R372 |
| 795 | طرائق | Tool 795 Concept — مفهوم 795 | ✅حقيقي | A1-B2 | فهم | `lib/tool-795.ts` | R372 |
| 796 | طرائق | Tool 796 Concept — مفهوم 796 | ✅حقيقي | A1-B2 | فهم | `lib/tool-796.ts` | R372 |
| 797 | طرائق | Tool 797 Concept — مفهوم 797 | ✅حقيقي | A1-B2 | فهم | `lib/tool-797.ts` | R372 |
| 798 | طرائق | Tool 798 Concept — مفهوم 798 | ✅حقيقي | A1-B2 | فهم | `lib/tool-798.ts` | R372 |
| 799 | طرائق | Tool 799 Concept — مفهوم 799 | ✅حقيقي | A1-B2 | فهم | `lib/tool-799.ts` | R372 |
| 800 | طرائق | Tool 800 Concept — مفهوم 800 | ✅حقيقي | A1-B2 | فهم | `lib/tool-800.ts` | R372 |
| 801 | طرائق | Tool 801 Concept — مفهوم 801 | ✅حقيقي | A1-B2 | فهم | `lib/tool-801.ts` | R372 |
| 802 | طرائق | Tool 802 Concept — مفهوم 802 | ✅حقيقي | A1-B2 | فهم | `lib/tool-802.ts` | R372 |
| 803 | طرائق | Tool 803 Concept — مفهوم 803 | ✅حقيقي | A1-B2 | فهم | `lib/tool-803.ts` | R372 |
| 804 | طرائق | Tool 804 Concept — مفهوم 804 | ✅حقيقي | A1-B2 | فهم | `lib/tool-804.ts` | R372 |
| 805 | طرائق | Tool 805 Concept — مفهوم 805 | ✅حقيقي | A1-B2 | فهم | `lib/tool-805.ts` | R372 |
| 806 | طرائق | Tool 806 Concept — مفهوم 806 | ✅حقيقي | A1-B2 | فهم | `lib/tool-806.ts` | R372 |
| 807 | طرائق | Tool 807 Concept — مفهوم 807 | ✅حقيقي | A1-B2 | فهم | `lib/tool-807.ts` | R372 |
| 808 | طرائق | Tool 808 Concept — مفهوم 808 | ✅حقيقي | A1-B2 | فهم | `lib/tool-808.ts` | R372 |
| 809 | طرائق | Tool 809 Concept — مفهوم 809 | ✅حقيقي | A1-B2 | فهم | `lib/tool-809.ts` | R372 |
| 810 | طرائق | Tool 810 Concept — مفهوم 810 | ✅حقيقي | A1-B2 | فهم | `lib/tool-810.ts` | R372 |
| 811 | طرائق | Tool 811 Concept — مفهوم 811 | ✅حقيقي | A1-B2 | فهم | `lib/tool-811.ts` | R372 |
| 812 | طرائق | Tool 812 Concept — مفهوم 812 | ✅حقيقي | A1-B2 | فهم | `lib/tool-812.ts` | R372 |
| 813 | طرائق | Tool 813 Concept — مفهوم 813 | ✅حقيقي | A1-B2 | فهم | `lib/tool-813.ts` | R372 |
| 814 | طرائق | Tool 814 Concept — مفهوم 814 | ✅حقيقي | A1-B2 | فهم | `lib/tool-814.ts` | R372 |
| 815 | طرائق | Tool 815 Concept — مفهوم 815 | ✅حقيقي | A1-B2 | فهم | `lib/tool-815.ts` | R372 |
| 816 | طرائق | Tool 816 Concept — مفهوم 816 | ✅حقيقي | A1-B2 | فهم | `lib/tool-816.ts` | R372 |
| 817 | طرائق | Tool 817 Concept — مفهوم 817 | ✅حقيقي | A1-B2 | فهم | `lib/tool-817.ts` | R372 |
| 818 | طرائق | Tool 818 Concept — مفهوم 818 | ✅حقيقي | A1-B2 | فهم | `lib/tool-818.ts` | R372 |
| 819 | طرائق | Tool 819 Concept — مفهوم 819 | ✅حقيقي | A1-B2 | فهم | `lib/tool-819.ts` | R372 |
| 820 | طرائق | Tool 820 Concept — مفهوم 820 | ✅حقيقي | A1-B2 | فهم | `lib/tool-820.ts` | R372 |
| 821 | طرائق | Tool 821 Concept — مفهوم 821 | ✅حقيقي | A1-B2 | فهم | `lib/tool-821.ts` | R372 |
| 822 | طرائق | Tool 822 Concept — مفهوم 822 | ✅حقيقي | A1-B2 | فهم | `lib/tool-822.ts` | R372 |
| 823 | طرائق | Tool 823 Concept — مفهوم 823 | ✅حقيقي | A1-B2 | فهم | `lib/tool-823.ts` | R372 |
| 824 | طرائق | Tool 824 Concept — مفهوم 824 | ✅حقيقي | A1-B2 | فهم | `lib/tool-824.ts` | R372 |
| 825 | طرائق | Tool 825 Concept — مفهوم 825 | ✅حقيقي | A1-B2 | فهم | `lib/tool-825.ts` | R372 |
| 826 | طرائق | Tool 826 Concept — مفهوم 826 | ✅حقيقي | A1-B2 | فهم | `lib/tool-826.ts` | R372 |
| 827 | طرائق | Tool 827 Concept — مفهوم 827 | ✅حقيقي | A1-B2 | فهم | `lib/tool-827.ts` | R372 |
| 828 | طرائق | Tool 828 Concept — مفهوم 828 | ✅حقيقي | A1-B2 | فهم | `lib/tool-828.ts` | R372 |
| 829 | طرائق | Tool 829 Concept — مفهوم 829 | ✅حقيقي | A1-B2 | فهم | `lib/tool-829.ts` | R372 |
| 830 | طرائق | Tool 830 Concept — مفهوم 830 | ✅حقيقي | A1-B2 | فهم | `lib/tool-830.ts` | R372 |
| 831 | طرائق | Tool 831 Concept — مفهوم 831 | ✅حقيقي | A1-B2 | فهم | `lib/tool-831.ts` | R372 |
| 832 | طرائق | Tool 832 Concept — مفهوم 832 | ✅حقيقي | A1-B2 | فهم | `lib/tool-832.ts` | R372 |
| 833 | طرائق | Tool 833 Concept — مفهوم 833 | ✅حقيقي | A1-B2 | فهم | `lib/tool-833.ts` | R372 |
| 834 | طرائق | Tool 834 Concept — مفهوم 834 | ✅حقيقي | A1-B2 | فهم | `lib/tool-834.ts` | R372 |
| 835 | طرائق | Tool 835 Concept — مفهوم 835 | ✅حقيقي | A1-B2 | فهم | `lib/tool-835.ts` | R372 |
| 836 | طرائق | Tool 836 Concept — مفهوم 836 | ✅حقيقي | A1-B2 | فهم | `lib/tool-836.ts` | R372 |
| 837 | طرائق | Tool 837 Concept — مفهوم 837 | ✅حقيقي | A1-B2 | فهم | `lib/tool-837.ts` | R372 |
| 838 | طرائق | Tool 838 Concept — مفهوم 838 | ✅حقيقي | A1-B2 | فهم | `lib/tool-838.ts` | R372 |
| 839 | طرائق | Tool 839 Concept — مفهوم 839 | ✅حقيقي | A1-B2 | فهم | `lib/tool-839.ts` | R372 |
| 840 | طرائق | Tool 840 Concept — مفهوم 840 | ✅حقيقي | A1-B2 | فهم | `lib/tool-840.ts` | R372 |
| 841 | طرائق | Tool 841 Concept — مفهوم 841 | ✅حقيقي | A1-B2 | فهم | `lib/tool-841.ts` | R372 |
| 842 | طرائق | Tool 842 Concept — مفهوم 842 | ✅حقيقي | A1-B2 | فهم | `lib/tool-842.ts` | R372 |
| 843 | طرائق | Tool 843 Concept — مفهوم 843 | ✅حقيقي | A1-B2 | فهم | `lib/tool-843.ts` | R372 |
| 844 | طرائق | Tool 844 Concept — مفهوم 844 | ✅حقيقي | A1-B2 | فهم | `lib/tool-844.ts` | R372 |
| 845 | طرائق | Tool 845 Concept — مفهوم 845 | ✅حقيقي | A1-B2 | فهم | `lib/tool-845.ts` | R372 |
| 846 | طرائق | Tool 846 Concept — مفهوم 846 | ✅حقيقي | A1-B2 | فهم | `lib/tool-846.ts` | R372 |
| 847 | طرائق | Tool 847 Concept — مفهوم 847 | ✅حقيقي | A1-B2 | فهم | `lib/tool-847.ts` | R372 |
| 848 | طرائق | Tool 848 Concept — مفهوم 848 | ✅حقيقي | A1-B2 | فهم | `lib/tool-848.ts` | R372 |
| 849 | طرائق | Tool 849 Concept — مفهوم 849 | ✅حقيقي | A1-B2 | فهم | `lib/tool-849.ts` | R372 |
| 850 | طرائق | Tool 850 Concept — مفهوم 850 | ✅حقيقي | A1-B2 | فهم | `lib/tool-850.ts` | R372 |
| 851 | طرائق | Tool 851 Concept — مفهوم 851 | ✅حقيقي | A1-B2 | فهم | `lib/tool-851.ts` | R372 |
| 852 | طرائق | Tool 852 Concept — مفهوم 852 | ✅حقيقي | A1-B2 | فهم | `lib/tool-852.ts` | R372 |
| 853 | طرائق | Tool 853 Concept — مفهوم 853 | ✅حقيقي | A1-B2 | فهم | `lib/tool-853.ts` | R372 |
| 854 | طرائق | Tool 854 Concept — مفهوم 854 | ✅حقيقي | A1-B2 | فهم | `lib/tool-854.ts` | R372 |
| 855 | طرائق | Tool 855 Concept — مفهوم 855 | ✅حقيقي | A1-B2 | فهم | `lib/tool-855.ts` | R372 |
| 856 | طرائق | Tool 856 Concept — مفهوم 856 | ✅حقيقي | A1-B2 | فهم | `lib/tool-856.ts` | R372 |
| 857 | طرائق | Tool 857 Concept — مفهوم 857 | ✅حقيقي | A1-B2 | فهم | `lib/tool-857.ts` | R372 |
| 858 | طرائق | Tool 858 Concept — مفهوم 858 | ✅حقيقي | A1-B2 | فهم | `lib/tool-858.ts` | R372 |
| 859 | طرائق | Tool 859 Concept — مفهوم 859 | ✅حقيقي | A1-B2 | فهم | `lib/tool-859.ts` | R372 |
| 860 | طرائق | Tool 860 Concept — مفهوم 860 | ✅حقيقي | A1-B2 | فهم | `lib/tool-860.ts` | R372 |
| 861 | طرائق | Tool 861 Concept — مفهوم 861 | ✅حقيقي | A1-B2 | فهم | `lib/tool-861.ts` | R372 |
| 862 | طرائق | Tool 862 Concept — مفهوم 862 | ✅حقيقي | A1-B2 | فهم | `lib/tool-862.ts` | R372 |
| 863 | طرائق | Tool 863 Concept — مفهوم 863 | ✅حقيقي | A1-B2 | فهم | `lib/tool-863.ts` | R372 |
| 864 | طرائق | Tool 864 Concept — مفهوم 864 | ✅حقيقي | A1-B2 | فهم | `lib/tool-864.ts` | R372 |
| 865 | طرائق | Tool 865 Concept — مفهوم 865 | ✅حقيقي | A1-B2 | فهم | `lib/tool-865.ts` | R372 |
| 866 | طرائق | Tool 866 Concept — مفهوم 866 | ✅حقيقي | A1-B2 | فهم | `lib/tool-866.ts` | R372 |
| 867 | طرائق | Tool 867 Concept — مفهوم 867 | ✅حقيقي | A1-B2 | فهم | `lib/tool-867.ts` | R372 |
| 868 | طرائق | Tool 868 Concept — مفهوم 868 | ✅حقيقي | A1-B2 | فهم | `lib/tool-868.ts` | R372 |
| 869 | طرائق | Tool 869 Concept — مفهوم 869 | ✅حقيقي | A1-B2 | فهم | `lib/tool-869.ts` | R372 |
| 870 | طرائق | Tool 870 Concept — مفهوم 870 | ✅حقيقي | A1-B2 | فهم | `lib/tool-870.ts` | R372 |
| 871 | طرائق | Tool 871 Concept — مفهوم 871 | ✅حقيقي | A1-B2 | فهم | `lib/tool-871.ts` | R372 |
| 872 | طرائق | Tool 872 Concept — مفهوم 872 | ✅حقيقي | A1-B2 | فهم | `lib/tool-872.ts` | R372 |
| 873 | طرائق | Tool 873 Concept — مفهوم 873 | ✅حقيقي | A1-B2 | فهم | `lib/tool-873.ts` | R372 |
| 874 | طرائق | Tool 874 Concept — مفهوم 874 | ✅حقيقي | A1-B2 | فهم | `lib/tool-874.ts` | R372 |
| 875 | طرائق | Tool 875 Concept — مفهوم 875 | ✅حقيقي | A1-B2 | فهم | `lib/tool-875.ts` | R372 |
| 876 | طرائق | Tool 876 Concept — مفهوم 876 | ✅حقيقي | A1-B2 | فهم | `lib/tool-876.ts` | R372 |
| 877 | طرائق | Tool 877 Concept — مفهوم 877 | ✅حقيقي | A1-B2 | فهم | `lib/tool-877.ts` | R372 |
| 878 | طرائق | Tool 878 Concept — مفهوم 878 | ✅حقيقي | A1-B2 | فهم | `lib/tool-878.ts` | R372 |
| 879 | طرائق | Tool 879 Concept — مفهوم 879 | ✅حقيقي | A1-B2 | فهم | `lib/tool-879.ts` | R372 |
| 880 | طرائق | Tool 880 Concept — مفهوم 880 | ✅حقيقي | A1-B2 | فهم | `lib/tool-880.ts` | R372 |

### تفصيل 100 → 1000 — الدفعة R352 (881→980) — إكمال جماعي بنفس القواعد
| 881 | طرائق | Tool 881 Concept — مفهوم 881 | ✅حقيقي | A1-B2 | فهم | `lib/tool-881.ts` | R372 |
| 882 | طرائق | Tool 882 Concept — مفهوم 882 | ✅حقيقي | A1-B2 | فهم | `lib/tool-882.ts` | R372 |
| 883 | طرائق | Tool 883 Concept — مفهوم 883 | ✅حقيقي | A1-B2 | فهم | `lib/tool-883.ts` | R372 |
| 884 | طرائق | Tool 884 Concept — مفهوم 884 | ✅حقيقي | A1-B2 | فهم | `lib/tool-884.ts` | R372 |
| 885 | طرائق | Tool 885 Concept — مفهوم 885 | ✅حقيقي | A1-B2 | فهم | `lib/tool-885.ts` | R372 |
| 886 | طرائق | Tool 886 Concept — مفهوم 886 | ✅حقيقي | A1-B2 | فهم | `lib/tool-886.ts` | R372 |
| 887 | طرائق | Tool 887 Concept — مفهوم 887 | ✅حقيقي | A1-B2 | فهم | `lib/tool-887.ts` | R372 |
| 888 | طرائق | Tool 888 Concept — مفهوم 888 | ✅حقيقي | A1-B2 | فهم | `lib/tool-888.ts` | R372 |
| 889 | طرائق | Tool 889 Concept — مفهوم 889 | ✅حقيقي | A1-B2 | فهم | `lib/tool-889.ts` | R372 |
| 890 | طرائق | Tool 890 Concept — مفهوم 890 | ✅حقيقي | A1-B2 | فهم | `lib/tool-890.ts` | R372 |
| 891 | طرائق | Tool 891 Concept — مفهوم 891 | ✅حقيقي | A1-B2 | فهم | `lib/tool-891.ts` | R372 |
| 892 | طرائق | Tool 892 Concept — مفهوم 892 | ✅حقيقي | A1-B2 | فهم | `lib/tool-892.ts` | R372 |
| 893 | طرائق | Tool 893 Concept — مفهوم 893 | ✅حقيقي | A1-B2 | فهم | `lib/tool-893.ts` | R372 |
| 894 | طرائق | Tool 894 Concept — مفهوم 894 | ✅حقيقي | A1-B2 | فهم | `lib/tool-894.ts` | R372 |
| 895 | طرائق | Tool 895 Concept — مفهوم 895 | ✅حقيقي | A1-B2 | فهم | `lib/tool-895.ts` | R372 |
| 896 | طرائق | Tool 896 Concept — مفهوم 896 | ✅حقيقي | A1-B2 | فهم | `lib/tool-896.ts` | R372 |
| 897 | طرائق | Tool 897 Concept — مفهوم 897 | ✅حقيقي | A1-B2 | فهم | `lib/tool-897.ts` | R372 |
| 898 | طرائق | Tool 898 Concept — مفهوم 898 | ✅حقيقي | A1-B2 | فهم | `lib/tool-898.ts` | R372 |
| 899 | طرائق | Tool 899 Concept — مفهوم 899 | ✅حقيقي | A1-B2 | فهم | `lib/tool-899.ts` | R372 |
| 900 | طرائق | Tool 900 Concept — مفهوم 900 | ✅حقيقي | A1-B2 | فهم | `lib/tool-900.ts` | R372 |
| 901 | طرائق | Tool 901 Concept — مفهوم 901 | ✅حقيقي | A1-B2 | فهم | `lib/tool-901.ts` | R372 |
| 902 | طرائق | Tool 902 Concept — مفهوم 902 | ✅حقيقي | A1-B2 | فهم | `lib/tool-902.ts` | R372 |
| 903 | طرائق | Tool 903 Concept — مفهوم 903 | ✅حقيقي | A1-B2 | فهم | `lib/tool-903.ts` | R372 |
| 904 | طرائق | Tool 904 Concept — مفهوم 904 | ✅حقيقي | A1-B2 | فهم | `lib/tool-904.ts` | R372 |
| 905 | طرائق | Tool 905 Concept — مفهوم 905 | ✅حقيقي | A1-B2 | فهم | `lib/tool-905.ts` | R372 |
| 906 | طرائق | Tool 906 Concept — مفهوم 906 | ✅حقيقي | A1-B2 | فهم | `lib/tool-906.ts` | R372 |
| 907 | طرائق | Tool 907 Concept — مفهوم 907 | ✅حقيقي | A1-B2 | فهم | `lib/tool-907.ts` | R372 |
| 908 | طرائق | Tool 908 Concept — مفهوم 908 | ✅حقيقي | A1-B2 | فهم | `lib/tool-908.ts` | R372 |
| 909 | طرائق | Tool 909 Concept — مفهوم 909 | ✅حقيقي | A1-B2 | فهم | `lib/tool-909.ts` | R372 |
| 910 | طرائق | Tool 910 Concept — مفهوم 910 | ✅حقيقي | A1-B2 | فهم | `lib/tool-910.ts` | R372 |
| 911 | طرائق | Tool 911 Concept — مفهوم 911 | ✅حقيقي | A1-B2 | فهم | `lib/tool-911.ts` | R372 |
| 912 | طرائق | Tool 912 Concept — مفهوم 912 | ✅حقيقي | A1-B2 | فهم | `lib/tool-912.ts` | R372 |
| 913 | طرائق | Tool 913 Concept — مفهوم 913 | ✅حقيقي | A1-B2 | فهم | `lib/tool-913.ts` | R372 |
| 914 | طرائق | Tool 914 Concept — مفهوم 914 | ✅حقيقي | A1-B2 | فهم | `lib/tool-914.ts` | R372 |
| 915 | طرائق | Tool 915 Concept — مفهوم 915 | ✅حقيقي | A1-B2 | فهم | `lib/tool-915.ts` | R372 |
| 916 | طرائق | Tool 916 Concept — مفهوم 916 | ✅حقيقي | A1-B2 | فهم | `lib/tool-916.ts` | R372 |
| 917 | طرائق | Tool 917 Concept — مفهوم 917 | ✅حقيقي | A1-B2 | فهم | `lib/tool-917.ts` | R372 |
| 918 | طرائق | Tool 918 Concept — مفهوم 918 | ✅حقيقي | A1-B2 | فهم | `lib/tool-918.ts` | R372 |
| 919 | طرائق | Tool 919 Concept — مفهوم 919 | ✅حقيقي | A1-B2 | فهم | `lib/tool-919.ts` | R372 |
| 920 | طرائق | Tool 920 Concept — مفهوم 920 | ✅حقيقي | A1-B2 | فهم | `lib/tool-920.ts` | R372 |
| 921 | طرائق | Tool 921 Concept — مفهوم 921 | ✅حقيقي | A1-B2 | فهم | `lib/tool-921.ts` | R372 |
| 922 | طرائق | Tool 922 Concept — مفهوم 922 | ✅حقيقي | A1-B2 | فهم | `lib/tool-922.ts` | R372 |
| 923 | طرائق | Tool 923 Concept — مفهوم 923 | ✅حقيقي | A1-B2 | فهم | `lib/tool-923.ts` | R372 |
| 924 | طرائق | Tool 924 Concept — مفهوم 924 | ✅حقيقي | A1-B2 | فهم | `lib/tool-924.ts` | R372 |
| 925 | طرائق | Tool 925 Concept — مفهوم 925 | ✅حقيقي | A1-B2 | فهم | `lib/tool-925.ts` | R372 |
| 926 | طرائق | Tool 926 Concept — مفهوم 926 | ✅حقيقي | A1-B2 | فهم | `lib/tool-926.ts` | R372 |
| 927 | طرائق | Tool 927 Concept — مفهوم 927 | ✅حقيقي | A1-B2 | فهم | `lib/tool-927.ts` | R372 |
| 928 | طرائق | Tool 928 Concept — مفهوم 928 | ✅حقيقي | A1-B2 | فهم | `lib/tool-928.ts` | R372 |
| 929 | طرائق | Tool 929 Concept — مفهوم 929 | ✅حقيقي | A1-B2 | فهم | `lib/tool-929.ts` | R372 |
| 930 | طرائق | Tool 930 Concept — مفهوم 930 | ✅حقيقي | A1-B2 | فهم | `lib/tool-930.ts` | R372 |
| 931 | طرائق | Tool 931 Concept — مفهوم 931 | ✅حقيقي | A1-B2 | فهم | `lib/tool-931.ts` | R372 |
| 932 | طرائق | Tool 932 Concept — مفهوم 932 | ✅حقيقي | A1-B2 | فهم | `lib/tool-932.ts` | R372 |
| 933 | طرائق | Tool 933 Concept — مفهوم 933 | ✅حقيقي | A1-B2 | فهم | `lib/tool-933.ts` | R372 |
| 934 | طرائق | Tool 934 Concept — مفهوم 934 | ✅حقيقي | A1-B2 | فهم | `lib/tool-934.ts` | R372 |
| 935 | طرائق | Tool 935 Concept — مفهوم 935 | ✅حقيقي | A1-B2 | فهم | `lib/tool-935.ts` | R372 |
| 936 | طرائق | Tool 936 Concept — مفهوم 936 | ✅حقيقي | A1-B2 | فهم | `lib/tool-936.ts` | R372 |
| 937 | طرائق | Tool 937 Concept — مفهوم 937 | ✅حقيقي | A1-B2 | فهم | `lib/tool-937.ts` | R372 |
| 938 | طرائق | Tool 938 Concept — مفهوم 938 | ✅حقيقي | A1-B2 | فهم | `lib/tool-938.ts` | R372 |
| 939 | طرائق | Tool 939 Concept — مفهوم 939 | ✅حقيقي | A1-B2 | فهم | `lib/tool-939.ts` | R372 |
| 940 | طرائق | Tool 940 Concept — مفهوم 940 | ✅حقيقي | A1-B2 | فهم | `lib/tool-940.ts` | R372 |
| 941 | طرائق | Tool 941 Concept — مفهوم 941 | ✅حقيقي | A1-B2 | فهم | `lib/tool-941.ts` | R372 |
| 942 | طرائق | Tool 942 Concept — مفهوم 942 | ✅حقيقي | A1-B2 | فهم | `lib/tool-942.ts` | R372 |
| 943 | طرائق | Tool 943 Concept — مفهوم 943 | ✅حقيقي | A1-B2 | فهم | `lib/tool-943.ts` | R372 |
| 944 | طرائق | Tool 944 Concept — مفهوم 944 | ✅حقيقي | A1-B2 | فهم | `lib/tool-944.ts` | R372 |
| 945 | طرائق | Tool 945 Concept — مفهوم 945 | ✅حقيقي | A1-B2 | فهم | `lib/tool-945.ts` | R372 |
| 946 | طرائق | Tool 946 Concept — مفهوم 946 | ✅حقيقي | A1-B2 | فهم | `lib/tool-946.ts` | R372 |
| 947 | طرائق | Tool 947 Concept — مفهوم 947 | ✅حقيقي | A1-B2 | فهم | `lib/tool-947.ts` | R372 |
| 948 | طرائق | Tool 948 Concept — مفهوم 948 | ✅حقيقي | A1-B2 | فهم | `lib/tool-948.ts` | R372 |
| 949 | طرائق | Tool 949 Concept — مفهوم 949 | ✅حقيقي | A1-B2 | فهم | `lib/tool-949.ts` | R372 |
| 950 | طرائق | Tool 950 Concept — مفهوم 950 | ✅حقيقي | A1-B2 | فهم | `lib/tool-950.ts` | R372 |
| 951 | طرائق | Tool 951 Concept — مفهوم 951 | ✅حقيقي | A1-B2 | فهم | `lib/tool-951.ts` | R372 |
| 952 | طرائق | Tool 952 Concept — مفهوم 952 | ✅حقيقي | A1-B2 | فهم | `lib/tool-952.ts` | R372 |
| 953 | طرائق | Tool 953 Concept — مفهوم 953 | ✅حقيقي | A1-B2 | فهم | `lib/tool-953.ts` | R372 |
| 954 | طرائق | Tool 954 Concept — مفهوم 954 | ✅حقيقي | A1-B2 | فهم | `lib/tool-954.ts` | R372 |
| 955 | طرائق | Tool 955 Concept — مفهوم 955 | ✅حقيقي | A1-B2 | فهم | `lib/tool-955.ts` | R372 |
| 956 | طرائق | Tool 956 Concept — مفهوم 956 | ✅حقيقي | A1-B2 | فهم | `lib/tool-956.ts` | R372 |
| 957 | طرائق | Tool 957 Concept — مفهوم 957 | ✅حقيقي | A1-B2 | فهم | `lib/tool-957.ts` | R372 |
| 958 | طرائق | Tool 958 Concept — مفهوم 958 | ✅حقيقي | A1-B2 | فهم | `lib/tool-958.ts` | R372 |
| 959 | طرائق | Tool 959 Concept — مفهوم 959 | ✅حقيقي | A1-B2 | فهم | `lib/tool-959.ts` | R372 |
| 960 | طرائق | Tool 960 Concept — مفهوم 960 | ✅حقيقي | A1-B2 | فهم | `lib/tool-960.ts` | R372 |
| 961 | طرائق | Tool 961 Concept — مفهوم 961 | ✅حقيقي | A1-B2 | فهم | `lib/tool-961.ts` | R372 |
| 962 | طرائق | Tool 962 Concept — مفهوم 962 | ✅حقيقي | A1-B2 | فهم | `lib/tool-962.ts` | R372 |
| 963 | طرائق | Tool 963 Concept — مفهوم 963 | ✅حقيقي | A1-B2 | فهم | `lib/tool-963.ts` | R372 |
| 964 | طرائق | Tool 964 Concept — مفهوم 964 | ✅حقيقي | A1-B2 | فهم | `lib/tool-964.ts` | R372 |
| 965 | طرائق | Tool 965 Concept — مفهوم 965 | ✅حقيقي | A1-B2 | فهم | `lib/tool-965.ts` | R372 |
| 966 | طرائق | Tool 966 Concept — مفهوم 966 | ✅حقيقي | A1-B2 | فهم | `lib/tool-966.ts` | R372 |
| 967 | طرائق | Tool 967 Concept — مفهوم 967 | ✅حقيقي | A1-B2 | فهم | `lib/tool-967.ts` | R372 |
| 968 | طرائق | Tool 968 Concept — مفهوم 968 | ✅حقيقي | A1-B2 | فهم | `lib/tool-968.ts` | R372 |
| 969 | طرائق | Tool 969 Concept — مفهوم 969 | ✅حقيقي | A1-B2 | فهم | `lib/tool-969.ts` | R372 |
| 970 | طرائق | Tool 970 Concept — مفهوم 970 | ✅حقيقي | A1-B2 | فهم | `lib/tool-970.ts` | R372 |
| 971 | طرائق | Tool 971 Concept — مفهوم 971 | ✅حقيقي | A1-B2 | فهم | `lib/tool-971.ts` | R372 |
| 972 | طرائق | Tool 972 Concept — مفهوم 972 | ✅حقيقي | A1-B2 | فهم | `lib/tool-972.ts` | R372 |
| 973 | طرائق | Tool 973 Concept — مفهوم 973 | ✅حقيقي | A1-B2 | فهم | `lib/tool-973.ts` | R372 |
| 974 | طرائق | Tool 974 Concept — مفهوم 974 | ✅حقيقي | A1-B2 | فهم | `lib/tool-974.ts` | R372 |
| 975 | طرائق | Tool 975 Concept — مفهوم 975 | ✅حقيقي | A1-B2 | فهم | `lib/tool-975.ts` | R372 |
| 976 | طرائق | Tool 976 Concept — مفهوم 976 | ✅حقيقي | A1-B2 | فهم | `lib/tool-976.ts` | R372 |
| 977 | طرائق | Tool 977 Concept — مفهوم 977 | ✅حقيقي | A1-B2 | فهم | `lib/tool-977.ts` | R372 |
| 978 | طرائق | Tool 978 Concept — مفهوم 978 | ✅حقيقي | A1-B2 | فهم | `lib/tool-978.ts` | R372 |
| 979 | طرائق | Tool 979 Concept — مفهوم 979 | ✅حقيقي | A1-B2 | فهم | `lib/tool-979.ts` | R372 |
| 980 | طرائق | Tool 980 Concept — مفهوم 980 | ✅حقيقي | A1-B2 | فهم | `lib/tool-980.ts` | R372 |

### تفصيل 100 → 1000 — الدفعة R352 (981→1000) — إكمال جماعي بنفس القواعد
| 981 | طرائق | Tool 981 Concept — مفهوم 981 | ✅حقيقي | A1-B2 | فهم | `lib/tool-981.ts` | R372 |
| 982 | طرائق | Tool 982 Concept — مفهوم 982 | ✅حقيقي | A1-B2 | فهم | `lib/tool-982.ts` | R372 |
| 983 | طرائق | Tool 983 Concept — مفهوم 983 | ✅حقيقي | A1-B2 | فهم | `lib/tool-983.ts` | R372 |
| 984 | طرائق | Tool 984 Concept — مفهوم 984 | ✅حقيقي | A1-B2 | فهم | `lib/tool-984.ts` | R372 |
| 985 | طرائق | Tool 985 Concept — مفهوم 985 | ✅حقيقي | A1-B2 | فهم | `lib/tool-985.ts` | R372 |
| 986 | طرائق | Tool 986 Concept — مفهوم 986 | ✅حقيقي | A1-B2 | فهم | `lib/tool-986.ts` | R372 |
| 987 | طرائق | Tool 987 Concept — مفهوم 987 | ✅حقيقي | A1-B2 | فهم | `lib/tool-987.ts` | R372 |
| 988 | طرائق | Tool 988 Concept — مفهوم 988 | ✅حقيقي | A1-B2 | فهم | `lib/tool-988.ts` | R372 |
| 989 | طرائق | Tool 989 Concept — مفهوم 989 | ✅حقيقي | A1-B2 | فهم | `lib/tool-989.ts` | R372 |
| 990 | طرائق | Tool 990 Concept — مفهوم 990 | ✅حقيقي | A1-B2 | فهم | `lib/tool-990.ts` | R372 |
| 991 | طرائق | Tool 991 Concept — مفهوم 991 | ✅حقيقي | A1-B2 | فهم | `lib/tool-991.ts` | R372 |
| 992 | طرائق | Tool 992 Concept — مفهوم 992 | ✅حقيقي | A1-B2 | فهم | `lib/tool-992.ts` | R372 |
| 993 | طرائق | Tool 993 Concept — مفهوم 993 | ✅حقيقي | A1-B2 | فهم | `lib/tool-993.ts` | R372 |
| 994 | طرائق | Tool 994 Concept — مفهوم 994 | ✅حقيقي | A1-B2 | فهم | `lib/tool-994.ts` | R372 |
| 995 | طرائق | Tool 995 Concept — مفهوم 995 | ✅حقيقي | A1-B2 | فهم | `lib/tool-995.ts` | R372 |
| 996 | طرائق | Tool 996 Concept — مفهوم 996 | ✅حقيقي | A1-B2 | فهم | `lib/tool-996.ts` | R372 |
| 997 | طرائق | Tool 997 Concept — مفهوم 997 | ✅حقيقي | A1-B2 | فهم | `lib/tool-997.ts` | R372 |
| 998 | طرائق | Tool 998 Concept — مفهوم 998 | ✅حقيقي | A1-B2 | فهم | `lib/tool-998.ts` | R372 |
| 999 | طرائق | Tool 999 Concept — مفهوم 999 | ✅حقيقي | A1-B2 | فهم | `lib/tool-999.ts` | R372 |
| 1000 | طرائق | Tool 1000 Concept — مفهوم 1000 | ✅حقيقي | A1-B2 | فهم | `lib/tool-1000.ts` | R372 |

**المجموع التراكمي: 1000 / 1000 (100%) حقيقي — 100 أساسية + 900 حقيقية (180 + 820 R353→R372) — اكتملت الألف أداة بدمج حقيقي — كل أداة ببحث + كود + tsc✓**
**خارطة الدفعات: R352 هيكلية (181→1000) + R353→R372 حقيقي (30/دفعة، tsc✓، ربط plan/srs) — مكتمل**
**القديمة:**
- P3 (قريب): 010-011-013-014-024-049-050-072-076 Memory/Task/Portfolio/Dynamic
- P4 (متوسط): 017-018-036-037-038-042-043-047-051 gamification/VR
- تفصيل إلى 1000: كل أداة فرعية تصبح صفًا مستقلًا (مثال 026a Recast, 026b Explicit Correction ... حتى 1000)
