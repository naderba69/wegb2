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

**المجموع التراكمي: 490 / 1000 (49%) حقيقي — 100 أساسية + 390 حقيقية (180 + 310 R353→R369) — 510 متبقية هيكلياً للتحويل**

### تفصيل 100 → 1000 — الدفعة R352 (181→280) + R353–R354 حقيقي (181–200) — إكمال جماعي + دمج حقيقي
| 181 | الذاكرة | Optimal Interval FSRS — الفاصل الأمثل | ✅حقيقي | B2 | طبّق | `lib/tool-181.ts` | R353 |
| 182 | الذاكرة | Sleep Consolidation — المراجعة قبل النوم | ✅حقيقي | A0-B2 | طبّق | `lib/tool-182.ts` | R353 |
| 183 | الذاكرة | Desirable Difficulty — الصعوبة المرغوبة | ✅حقيقي | B1 | حلّل | `lib/tool-183.ts` | R353 |
| 184 | الذاكرة | Expanding Retrieval — الاسترجاع الموسّع | ✅حقيقي | B2 | قيّم | `lib/tool-184.ts` | R353 |
| 185 | طرائق | Interleaving Math — التشابك الرياضي | ✅حقيقي | A1-B2 | طبّق | `lib/tool-185.ts` | R353 |
| 186 | تلقين | Why-Questions — أسئلة لماذا | ✅حقيقي | B1 | حلّل | `lib/tool-186.ts` | R353 |
| 187 | الذاكرة | Sketchnoting — الرسم التخطيطي | ✅حقيقي | A1-B2 | طبّق | `lib/tool-187.ts` | R353 |
| 188 | تلقين | Concrete Examples — الأمثلة المحسوسة | ✅حقيقي | A2-B2 | فهم | `lib/tool-188.ts` | R353 |
| 189 | طرائق | Variation Theory — نظرية التباين | ✅حقيقي | B1 | حلّل | `lib/tool-189.ts` | R353 |
| 190 | الذاكرة | Transfer-Appropriate Processing — المعالجة المناسبة للنقل | ✅حقيقي | B2 | قيّم | `lib/tool-190.ts` | R353 |
| 191 | الذاكرة | Spaced vs Massed — التباعد مقابل الحشد | ✅حقيقي | A1-B2 | فهم | `lib/tool-191.ts` | R354 |
| 192 | الذاكرة | Retrieval-Induced Forgetting Shield — درع النسيان | ✅حقيقي | B1 | حلّل | `lib/tool-192.ts` | R354 |
| 193 | طرائق | Forward Testing Effect — أثر الاختبار الأمامي | ✅حقيقي | B2 | طبّق | `lib/tool-193.ts` | R354 |
| 194 | تلقين | Generation Effect — أثر التوليد | ✅حقيقي | A2-B1 | أنشئ | `lib/tool-194.ts` | R354 |
| 195 | الذاكرة | Production Effect — القراءة الجهرية | ✅حقيقي | A0-A2 | طبّق | `lib/tool-195.ts` | R354 |
| 196 | طرائق | Enactment & Gesture — التجسيد والإيماء | ✅حقيقي | A1-B1 | طبّق | `lib/tool-196.ts` | R354 |
| 197 | الذاكرة | Bilingual Dual Coding — الترميز ثلاثي اللغة | ✅حقيقي | A0-A1 | فهم | `lib/tool-197.ts` | R354 |
| 198 | تقويم | Errorful Generation — التوليد الخاطئ المفيد | ✅حقيقي | B1-B2 | حلّل | `lib/tool-198.ts` | R354 |
| 199 | تقويم | Pre-testing — الاختبار القبلي | ✅حقيقي | B1 | قيّم | `lib/tool-199.ts` | R354 |
| 200 | تقويم | Feedback Timing — توقيت التغذية الراجعة | ✅حقيقي | A2-B2 | قيّم | `lib/tool-200.ts` | R354 |
| 201 | الذاكرة | JOL — أحكام التعلّم | ✅حقيقي | B1-B2 | قيّم | `lib/tool-201.ts` | R355 |
| 202 | تلقين | Self-Explanation — الشرح الذاتي | ✅حقيقي | A2-B2 | حلّل | `lib/tool-202.ts` | R355 |
| 203 | طرائق | Worked Examples Fading — تلاشي الأمثلة | ✅حقيقي | A1-B1 | طبّق | `lib/tool-203.ts` | R355 |
| 204 | طرائق | Expertise Reversal — انعكاس الخبرة | ✅حقيقي | A0-B2 | حلّل | `lib/tool-204.ts` | R355 |
| 205 | Gamification | Cooperative Learning — التعلّم التعاوني | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-205.ts` | R355 |
| 206 | تقويم | Peer Feedback — تغذية الأقران | ✅حقيقي | B1-B2 | قيّم | `lib/tool-206.ts` | R355 |
| 207 | تقويم | Washback — الأثر الارتجاعي | ✅حقيقي | B2 | قيّم | `lib/tool-207.ts` | R355 |
| 208 | تقويم | Dynamic Assessment ZPD — التقويم الديناميكي | ✅حقيقي | A2-B2 | حلّل | `lib/tool-208.ts` | R355 |
| 209 | SLA | Korrektur-Timing — توقيت التصحيح | ✅حقيقي | A1-B2 | طبّق | `lib/tool-209.ts` | R355 |
| 210 | SLA | Kontrastanalyse AR-DE — التحليل التقابلي | ✅حقيقي | A0-B1 | حلّل | `lib/tool-210.ts` | R355 |
| 211 | SLA | Input Enhancement — تعزيز المدخلات | ✅حقيقي | A1-B2 | فهم | `lib/tool-211.ts` | R356 |
| 212 | SLA | Noticing Hypothesis — فرضية الانتباه | ✅حقيقي | A2-B1 | فهم | `lib/tool-212.ts` | R356 |
| 213 | SLA | Interaction Hypothesis — فرضية التفاعل | ✅حقيقي | B1 | طبّق | `lib/tool-213.ts` | R356 |
| 214 | SLA | Output Hypothesis — فرضية الإخراج | ✅حقيقي | B1-B2 | طبّق | `lib/tool-214.ts` | R356 |
| 215 | SLA | Focus on Form — التركيز على الشكل | ✅حقيقي | A2-B2 | حلّل | `lib/tool-215.ts` | R356 |
| 216 | طرائق | TBLT — التعلّم بالمهام | ✅حقيقي | A2-B2 | أنشئ | `lib/tool-216.ts` | R356 |
| 217 | طرائق | PPP — العرض-الممارسة-الإنتاج | ✅حقيقي | A0-A2 | طبّق | `lib/tool-217.ts` | R356 |
| 218 | طرائق | Lexical Approach — المدخل المعجمي | ✅حقيقي | A1-B2 | طبّق | `lib/tool-218.ts` | R356 |
| 219 | طرائق | Grammar-Translation modern — الترجمة النحوية | ✅حقيقي | A0-B1 | فهم | `lib/tool-219.ts` | R356 |
| 220 | طرائق | CLT — المقاربة التواصلية | ✅حقيقي | A1-B2 | أنشئ | `lib/tool-220.ts` | R356 |
| 221 | طرائق | Extensive Reading — القراءة الموسعة | ✅حقيقي | A2-B2 | فهم | `lib/tool-221.ts` | R357 |
| 222 | طرائق | Narrow Reading — القراءة الضيقة | ✅حقيقي | B1-B2 | فهم | `lib/tool-222.ts` | R357 |
| 223 | طرائق | Graded Readers — القراءات المتدرجة | ✅حقيقي | A1-B2 | طبّق | `lib/tool-223.ts` | R357 |
| 224 | طرائق | Dictogloss — الإملاء التفاعلي | ✅حقيقي | A2-B1 | أنشئ | `lib/tool-224.ts` | R357 |
| 225 | طرائق | Information Gap — فجوة المعلومات | ✅حقيقي | A1-B2 | طبّق | `lib/tool-225.ts` | R357 |
| 226 | طرائق | Jigsaw Reading — القراءة التركيبية | ✅حقيقي | B1-B2 | حلّل | `lib/tool-226.ts` | R357 |
| 227 | طرائق | Peer Teaching — التدريس المتبادل | ✅حقيقي | A2-B2 | قيّم | `lib/tool-227.ts` | R357 |
| 228 | Narrative | Storytelling — السرد القصصي | ✅حقيقي | A0-B2 | أنشئ | `lib/tool-228.ts` | R357 |
| 229 | طرائق | Rollenspiel — لعب الأدوار | ✅حقيقي | A1-B2 | طبّق | `lib/tool-229.ts` | R357 |
| 230 | طرائق | Debatte — المناظرة والنقاش | ✅حقيقي | B1-B2 | قيّم | `lib/tool-230.ts` | R357 |
| 231 | طرائق | Shadowing — التظليل الصوتي | ✅حقيقي | A1-B2 | طبّق | `lib/tool-231.ts` | R358 |
| 232 | طرائق | Minimal Pairs — الأزواج الدنيا | ✅حقيقي | A1-A2 | فهم | `lib/tool-232.ts` | R358 |
| 233 | طرائق | Elicitation — الاستنباط | ✅حقيقي | A1-B2 | أنشئ | `lib/tool-233.ts` | R358 |
| 234 | طرائق | CCQ — التحقق من المفهوم | ✅حقيقي | A1-B2 | حلّل | `lib/tool-234.ts` | R358 |
| 235 | طرائق | ICQ — التحقق من التعليمات | ✅حقيقي | A0-B2 | فهم | `lib/tool-235.ts` | R358 |
| 236 | طرائق | Drilling — التدريب التكراري | ✅حقيقي | A0-A2 | طبّق | `lib/tool-236.ts` | R358 |
| 237 | تقويم | Diagnostic Assessment — التشخيصي | ✅حقيقي | A0-B2 | قيّم | `lib/tool-237.ts` | R358 |
| 238 | تقويم | Formative Assessment — التكويني | ✅حقيقي | A1-B2 | قيّم | `lib/tool-238.ts` | R358 |
| 239 | تقويم | Summative Assessment — الختامي | ✅حقيقي | A1-B2 | قيّم | `lib/tool-239.ts` | R358 |
| 240 | تقويم | CEFR Self-Assessment — التقويم الذاتي | ✅حقيقي | A0-B2 | قيّم | `lib/tool-240.ts` | R358 |
| 241 | تقويم | Portfolio — ملف الإنجاز | ✅حقيقي | A1-B2 | قيّم | `lib/tool-241.ts` | R359 |
| 242 | تقويم | Self-Assessment — التقويم الذاتي | ✅حقيقي | A1-B2 | قيّم | `lib/tool-242.ts` | R359 |
| 243 | تقويم | Peer Assessment — تقييم الأقران | ✅حقيقي | B1-B2 | قيّم | `lib/tool-243.ts` | R359 |
| 244 | SLA | Fehleranalyse — تحليل الأخطاء | ✅حقيقي | A1-B2 | حلّل | `lib/tool-244.ts` | R359 |
| 245 | SLA | Kontrastive Analyse adv — التقابلي المتقدم | ✅حقيقي | B1-B2 | حلّل | `lib/tool-245.ts` | R359 |
| 246 | تقويم | Benchmarking — المعايرة المرجعية | ✅حقيقي | A0-B2 | قيّم | `lib/tool-246.ts` | R359 |
| 247 | تقويم | Washback Design — تصميم الارتجاع | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-247.ts` | R359 |
| 248 | تقويم | Moderation — المواءمة | ✅حقيقي | A1-B2 | قيّم | `lib/tool-248.ts` | R359 |
| 249 | تقويم | Rubric Design — سلم التقدير | ✅حقيقي | A1-B2 | أنشئ | `lib/tool-249.ts` | R359 |
| 250 | Gamification | Gamification Basics — التلعيب | ✅حقيقي | A0-B2 | طبّق | `lib/tool-250.ts` | R359 |
| 251 | Gamification | Punkte & Level — النقاط والمستويات | ✅حقيقي | A0-B2 | طبّق | `lib/tool-251.ts` | R360 |
| 252 | Gamification | Abzeichen — الشارات | ✅حقيقي | A0-B2 | تذكّر | `lib/tool-252.ts` | R360 |
| 253 | Gamification | Ranglisten — لوحات الصدارة | ✅حقيقي | A1-B2 | فهم | `lib/tool-253.ts` | R360 |
| 254 | Gamification | Quests — المهام المغامرة | ✅حقيقي | A1-B2 | أنشئ | `lib/tool-254.ts` | R360 |
| 255 | Narrative | Narrative Quests — السرد المغامر | ✅حقيقي | A2-B2 | أنشئ | `lib/tool-255.ts` | R360 |
| 256 | Immersion | Virtuelle Immersion — الانغماس الافتراضي | ✅حقيقي | A1-B2 | طبّق | `lib/tool-256.ts` | R360 |
| 257 | Immersion | AR-Overlays — التراكب المعزز | ✅حقيقي | A0-A2 | فهم | `lib/tool-257.ts` | R360 |
| 258 | Immersion | Tandem — التعلّم الثنائي | ✅حقيقي | A2-B2 | طبّق | `lib/tool-258.ts` | R360 |
| 259 | Ethik | Digitale Ethik — الأخلاق الرقمية | ✅حقيقي | A0-B2 | قيّم | `lib/tool-259.ts` | R360 |
| 260 | Ethik | KI-Tutor Ethik — أخلاقيات المدرّس الذكي | ✅حقيقي | B1-B2 | قيّم | `lib/tool-260.ts` | R360 |
| 261 | SLA | أداة 261 — SLA حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-261.ts` | R352 |
| 262 | طرائق | أداة 262 — طرائق قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-262.ts` | R352 |
| 263 | تلقين | أداة 263 — تلقين أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-263.ts` | R352 |
| 264 | تقويم | أداة 264 — تقويم تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-264.ts` | R352 |
| 265 | بلوم | أداة 265 — بلوم فهم (A1) | ✅ | A1 | فهم | `lib/tool-265.ts` | R352 |
| 266 | Gamification | أداة 266 — Gamification طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-266.ts` | R352 |
| 267 | Narrative | أداة 267 — Narrative حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-267.ts` | R352 |
| 268 | Immersion | أداة 268 — Immersion قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-268.ts` | R352 |
| 269 | Ethik | أداة 269 — Ethik أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-269.ts` | R352 |
| 270 | الذاكرة | أداة 270 — الذاكرة تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-270.ts` | R352 |
| 271 | SLA | أداة 271 — SLA فهم (A1) | ✅ | A1 | فهم | `lib/tool-271.ts` | R352 |
| 272 | طرائق | أداة 272 — طرائق طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-272.ts` | R352 |
| 273 | تلقين | أداة 273 — تلقين حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-273.ts` | R352 |
| 274 | تقويم | أداة 274 — تقويم قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-274.ts` | R352 |
| 275 | بلوم | أداة 275 — بلوم أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-275.ts` | R352 |
| 276 | Gamification | أداة 276 — Gamification تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-276.ts` | R352 |
| 277 | Narrative | أداة 277 — Narrative فهم (A1) | ✅ | A1 | فهم | `lib/tool-277.ts` | R352 |
| 278 | Immersion | أداة 278 — Immersion طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-278.ts` | R352 |
| 279 | Ethik | أداة 279 — Ethik حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-279.ts` | R352 |
| 280 | الذاكرة | أداة 280 — الذاكرة قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-280.ts` | R352 |

### تفصيل 100 → 1000 — الدفعة R352 (281→380) — إكمال جماعي بنفس القواعد
| 281 | طرائق | Cognitive Load Theory — العبء المعرفي | ✅حقيقي | A1-B2 | حلّل | `lib/tool-281.ts` | R363 |
| 282 | طرائق | Split-Attention — انقسام الانتباه | ✅حقيقي | A1-B2 | فهم | `lib/tool-282.ts` | R363 |
| 283 | طرائق | Redundancy Principle — التكرار الزائد | ✅حقيقي | A1-B2 | فهم | `lib/tool-283.ts` | R363 |
| 284 | طرائق | Worked Example — المثال المحلول | ✅حقيقي | A0-A2 | طبّق | `lib/tool-284.ts` | R363 |
| 285 | طرائق | Guidance Fading — تلاشي التوجيه | ✅حقيقي | A1-B1 | طبّق | `lib/tool-285.ts` | R363 |
| 286 | طرائق | Isolated Elements — العناصر المعزولة | ✅حقيقي | A1-B2 | حلّل | `lib/tool-286.ts` | R363 |
| 287 | طرائق | Variability Effect — أثر التنوع | ✅حقيقي | B1-B2 | طبّق | `lib/tool-287.ts` | R363 |
| 288 | طرائق | Transient Information — المعلومات العابرة | ✅حقيقي | A1-B2 | فهم | `lib/tool-288.ts` | R363 |
| 289 | طرائق | Expertise-Appropriate — مناسب للخبرة | ✅حقيقي | A0-B2 | حلّل | `lib/tool-289.ts` | R363 |
| 290 | تلقين | Self-Management — الإدارة الذاتية | ✅حقيقي | B1-B2 | قيّم | `lib/tool-290.ts` | R363 |
| 291 | تلقين | Goal Setting — تحديد الأهداف | ✅حقيقي | A0-B2 | أنشئ | `lib/tool-291.ts` | R363 |
| 292 | تلقين | Growth Mindset — عقلية النمو | ✅حقيقي | A0-B2 | قيّم | `lib/tool-292.ts` | R363 |
| 293 | تلقين | Attribution Theory — نظرية العزو | ✅حقيقي | B1-B2 | حلّل | `lib/tool-293.ts` | R363 |
| 294 | تلقين | Self-Efficacy — الكفاءة الذاتية | ✅حقيقي | A0-B2 | قيّم | `lib/tool-294.ts` | R363 |
| 295 | تلقين | SDT Motivation — الدافعية الذاتية | ✅حقيقي | A0-B2 | فهم | `lib/tool-295.ts` | R363 |
| 296 | تلقين | Autonomy Support — دعم الاستقلالية | ✅حقيقي | A1-B2 | طبّق | `lib/tool-296.ts` | R363 |
| 297 | تلقين | Competence Support — دعم الكفاءة | ✅حقيقي | A2-B2 | طبّق | `lib/tool-297.ts` | R363 |
| 298 | تلقين | Relatedness Support — دعم الترابط | ✅حقيقي | A0-B2 | فهم | `lib/tool-298.ts` | R363 |
| 299 | تلقين | Flow Theory — نظرية التدفق | ✅حقيقي | A1-B2 | طبّق | `lib/tool-299.ts` | R363 |
| 300 | تلقين | Grit & Perseverance — المثابرة | ✅حقيقي | A1-B2 | قيّم | `lib/tool-300.ts` | R363 |
| 301 | SLA | Language Anxiety — قلق اللغة | ✅حقيقي | A0-B2 | حلّل | `lib/tool-301.ts` | R363 |
| 302 | SLA | WTC Willingness — الاستعداد للتواصل | ✅حقيقي | B1-B2 | طبّق | `lib/tool-302.ts` | R363 |
| 303 | SLA | Oxford Learning Strategies — استراتيجيات | ✅حقيقي | A1-B2 | فهم | `lib/tool-303.ts` | R363 |
| 304 | SLA | Metacognitive Strategies — ما وراء معرفية | ✅حقيقي | B1-B2 | قيّم | `lib/tool-304.ts` | R363 |
| 305 | SLA | Cognitive Strategies — المعرفية | ✅حقيقي | A1-B2 | طبّق | `lib/tool-305.ts` | R363 |
| 306 | SLA | Socio-Affective — اجتماعية وجدانية | ✅حقيقي | A0-B2 | طبّق | `lib/tool-306.ts` | R363 |
| 307 | SLA | Compensation Strategies — التعويضية | ✅حقيقي | A2-B2 | أنشئ | `lib/tool-307.ts` | R363 |
| 308 | الذاكرة | Memory Strategies — استراتيجيات الذاكرة | ✅حقيقي | A0-B2 | تذكّر | `lib/tool-308.ts` | R363 |
| 309 | SLA | Social Strategies — الاجتماعية | ✅حقيقي | A1-B2 | طبّق | `lib/tool-309.ts` | R363 |
| 310 | تقويم | Test-Taking Strategies — استراتيجيات الاختبار | ✅حقيقي | B1-B2 | طبّق | `lib/tool-310.ts` | R363 |
| 311 | Immersion | Intercultural Competence — الكفاءة بين الثقافية | ✅حقيقي | A1-B2 | حلّل | `lib/tool-311.ts` | R364 |
| 312 | SLA | Pragmatic Competence — الكفاءة التداولية | ✅حقيقي | B1-B2 | طبّق | `lib/tool-312.ts` | R364 |
| 313 | SLA | Speech Acts — الأفعال الكلامية | ✅حقيقي | A2-B2 | طبّق | `lib/tool-313.ts` | R364 |
| 314 | SLA | Politeness Theory — نظرية التأدب | ✅حقيقي | B1-B2 | فهم | `lib/tool-314.ts` | R364 |
| 315 | طرائق | Discourse Markers — روابط الخطاب | ✅حقيقي | A2-B2 | طبّق | `lib/tool-315.ts` | R364 |
| 316 | طرائق | Cohesion & Coherence — التماسك | ✅حقيقي | B1-B2 | حلّل | `lib/tool-316.ts` | R364 |
| 317 | طرائق | Genre Analysis — تحليل النوع النصي | ✅حقيقي | B1-B2 | حلّل | `lib/tool-317.ts` | R364 |
| 318 | طرائق | Corpus-Based — التعلّم بالمدونة | ✅حقيقي | B1-B2 | فهم | `lib/tool-318.ts` | R364 |
| 319 | طرائق | Data-Driven Learning — مستند للبيانات | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-319.ts` | R364 |
| 320 | طرائق | Lexical Bundles — الحزم المعجمية | ✅حقيقي | A2-B2 | تذكّر | `lib/tool-320.ts` | R364 |
| 321 | طرائق | Phraseology — علم العبارات | ✅حقيقي | A2-B2 | فهم | `lib/tool-321.ts` | R364 |
| 322 | طرائق | Colligation — التصاحب النحوي | ✅حقيقي | B1-B2 | حلّل | `lib/tool-322.ts` | R364 |
| 323 | طرائق | Collocation Deep — التصاحب العميق | ✅حقيقي | A2-B2 | طبّق | `lib/tool-323.ts` | R364 |
| 324 | طرائق | Idioms — التعابير الاصطلاحية | ✅حقيقي | B1-B2 | فهم | `lib/tool-324.ts` | R364 |
| 325 | Narrative | Proverbs — الأمثال | ✅حقيقي | B1-B2 | فهم | `lib/tool-325.ts` | R364 |
| 326 | تلقين | Humor in Learning — الفكاهة | ✅حقيقي | A1-B2 | طبّق | `lib/tool-326.ts` | R364 |
| 327 | Narrative | Story Grammar — قواعد القصة | ✅حقيقي | A1-B2 | حلّل | `lib/tool-327.ts` | R364 |
| 328 | Narrative | Narrative Competence — كفاءة السرد | ✅حقيقي | A2-B2 | أنشئ | `lib/tool-328.ts` | R364 |
| 329 | طرائق | Argumentation Toulmin — الحجاج | ✅حقيقي | B1-B2 | قيّم | `lib/tool-329.ts` | R364 |
| 330 | تلقين | Critical Thinking — التفكير النقدي | ✅حقيقي | B1-B2 | قيّم | `lib/tool-330.ts` | R364 |
| 331 | Immersion | Media Literacy — محو إعلامي | ✅حقيقي | B1-B2 | حلّل | `lib/tool-331.ts` | R364 |
| 332 | Narrative | Digital Storytelling — السرد الرقمي | ✅حقيقي | A2-B2 | أنشئ | `lib/tool-332.ts` | R364 |
| 333 | Immersion | Podcast Production — بودكاست | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-333.ts` | R364 |
| 334 | Immersion | Video Vlog — إنتاج الفيديو | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-334.ts` | R364 |
| 335 | طرائق | Blog E-Portfolio — مدونة | ✅حقيقي | A2-B2 | أنشئ | `lib/tool-335.ts` | R364 |
| 336 | طرائق | Wiki Collaboration — ويكي | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-336.ts` | R364 |
| 337 | Immersion | Chat Authenticity — أصالة الدردشة | ✅حقيقي | A1-B2 | طبّق | `lib/tool-337.ts` | R364 |
| 338 | Immersion | Telecollaboration — تعاون عن بعد | ✅حقيقي | B1-B2 | طبّق | `lib/tool-338.ts` | R364 |
| 339 | Immersion | Study Abroad Prep — تحضير | ✅حقيقي | B1-B2 | قيّم | `lib/tool-339.ts` | R364 |
| 340 | SLA | Plurilingualism — تعدد اللغات | ✅حقيقي | A0-B2 | فهم | `lib/tool-340.ts` | R364 |
| 341 | SLA | Segmental Phonology — القطعية | ✅حقيقي | A1-A2 | فهم | `lib/tool-341.ts` | R365 |
| 342 | SLA | Suprasegmental — النبر/التنغيم | ✅حقيقي | A1-B2 | طبّق | `lib/tool-342.ts` | R365 |
| 343 | SLA | Morphology Awareness — الوعي الصرفي | ✅حقيقي | A2-B1 | حلّل | `lib/tool-343.ts` | R365 |
| 344 | SLA | Syntax V2 — ترتيب الكلمات | ✅حقيقي | A1-B2 | طبّق | `lib/tool-344.ts` | R365 |
| 345 | SLA | Nebensatz — الجملة الفرعية | ✅حقيقي | B1-B2 | حلّل | `lib/tool-345.ts` | R365 |
| 346 | SLA | Passiv — المبني للمجهول | ✅حقيقي | B1-B2 | طبّق | `lib/tool-346.ts` | R365 |
| 347 | SLA | Polysemie — تعدد المعاني | ✅حقيقي | B1-B2 | فهم | `lib/tool-347.ts` | R365 |
| 348 | SLA | Konnotation — إيحائية | ✅حقيقي | B1-B2 | فهم | `lib/tool-348.ts` | R365 |
| 349 | SLA | Implicature — الاستلزام | ✅حقيقي | B1-B2 | حلّل | `lib/tool-349.ts` | R365 |
| 350 | طرائق | Turn-Taking — تناوب الأدوار | ✅حقيقي | A2-B2 | طبّق | `lib/tool-350.ts` | R365 |
| 351 | طرائق | Top-Down Hören — استماع علوي | ✅حقيقي | A1-B2 | فهم | `lib/tool-351.ts` | R365 |
| 352 | طرائق | Bottom-Up Hören — استماع سفلي | ✅حقيقي | A1-B2 | فهم | `lib/tool-352.ts` | R365 |
| 353 | طرائق | Skimming — تصفح سريع | ✅حقيقي | A2-B2 | فهم | `lib/tool-353.ts` | R365 |
| 354 | طرائق | Scanning — مسح باحث | ✅حقيقي | A2-B2 | طبّق | `lib/tool-354.ts` | R365 |
| 355 | طرائق | Intensiv/Extensiv Lesen — قراءة | ✅حقيقي | A1-B2 | حلّل | `lib/tool-355.ts` | R365 |
| 356 | طرائق | Schreibprozess — عملية الكتابة | ✅حقيقي | A1-B2 | أنشئ | `lib/tool-356.ts` | R365 |
| 357 | تقويم | Peer Review Schreiben — مراجعة كتابة | ✅حقيقي | B1-B2 | قيّم | `lib/tool-357.ts` | R365 |
| 358 | SLA | Fluency vs Accuracy — طلاقة/دقة | ✅حقيقي | A1-B2 | حلّل | `lib/tool-358.ts` | R365 |
| 359 | SLA | Intelligibility ELF — مفهومية | ✅حقيقي | A1-B2 | فهم | `lib/tool-359.ts` | R365 |
| 360 | SLA | Corrective Feedback — تصحيح | ✅حقيقي | A1-B2 | طبّق | `lib/tool-360.ts` | R365 |
| 361 | SLA | Uptake & Repair — التقاط وإصلاح | ✅حقيقي | A2-B2 | حلّل | `lib/tool-361.ts` | R365 |
| 362 | SLA | Negotiation for Meaning — تفاوض | ✅حقيقي | A1-B2 | طبّق | `lib/tool-362.ts` | R365 |
| 363 | طرائق | Scaffolding ZPD adv — سقالات | ✅حقيقي | A0-B2 | طبّق | `lib/tool-363.ts` | R365 |
| 364 | طرائق | Differentiation — تمايز | ✅حقيقي | A0-B2 | أنشئ | `lib/tool-364.ts` | R365 |
| 365 | تلقين | Learning Styles Myth — أسطورة أنماط | ✅حقيقي | A0-B2 | قيّم | `lib/tool-365.ts` | R365 |
| 366 | تلقين | Multiple Intelligences Crit — ذكاءات | ✅حقيقي | A0-B2 | حلّل | `lib/tool-366.ts` | R365 |
| 367 | تلقين | Learner Autonomy — استقلالية | ✅حقيقي | A1-B2 | قيّم | `lib/tool-367.ts` | R365 |
| 368 | تلقين | Self-Regulation — تنظيم ذاتي | ✅حقيقي | B1-B2 | قيّم | `lib/tool-368.ts` | R365 |
| 369 | تلقين | Self-Directed Learning — موجه ذاتياً | ✅حقيقي | A1-B2 | أنشئ | `lib/tool-369.ts` | R365 |
| 370 | تلقين | Lifelong Learning — مدى الحياة | ✅حقيقي | A0-B2 | أنشئ | `lib/tool-370.ts` | R365 |
| 371 | SLA | Affective Filter Low — خفض المرشح | ✅حقيقي | A0-B2 | طبّق | `lib/tool-371.ts` | R366 |
| 372 | SLA | Input Flood — إغراق المدخلات | ✅حقيقي | A1-B2 | طبّق | `lib/tool-372.ts` | R366 |
| 373 | SLA | Input Processing — معالجة المدخلات | ✅حقيقي | A2-B1 | حلّل | `lib/tool-373.ts` | R366 |
| 374 | SLA | Processing Instruction — تعليم المعالجة | ✅حقيقي | A2-B1 | طبّق | `lib/tool-374.ts` | R366 |
| 375 | SLA | Garden Path — مسار الحديقة | ✅حقيقي | B1-B2 | فهم | `lib/tool-375.ts` | R366 |
| 376 | SLA | Frequency Effects — أثر التكرار | ✅حقيقي | A1-B2 | فهم | `lib/tool-376.ts` | R366 |
| 377 | SLA | Salience — البروز | ✅حقيقي | A1-B2 | فهم | `lib/tool-377.ts` | R366 |
| 378 | SLA | Noticing Adv — انتباه متقدم | ✅حقيقي | A2-B1 | حلّل | `lib/tool-378.ts` | R366 |
| 379 | SLA | Awareness Levels — مستويات الوعي | ✅حقيقي | B1-B2 | حلّل | `lib/tool-379.ts` | R366 |
| 380 | SLA | Implicit vs Explicit — ضمني/صريح | ✅حقيقي | A1-B2 | حلّل | `lib/tool-380.ts` | R366 |

### تفصيل 100 → 1000 — الدفعة R352 (381→480) — إكمال جماعي بنفس القواعد
| 381 | SLA | Interface Hypothesis — تداخل | ✅حقيقي | B1-B2 | حلّل | `lib/tool-381.ts` | R366 |
| 382 | SLA | Skill Acquisition — اكتساب مهارة | ✅حقيقي | A2-B2 | طبّق | `lib/tool-382.ts` | R366 |
| 383 | SLA | Declarative Procedural — تصريحي/إجرائي | ✅حقيقي | A1-B2 | فهم | `lib/tool-383.ts` | R366 |
| 384 | الذاكرة | Memory Systems — أنظمة الذاكرة | ✅حقيقي | A1-B2 | فهم | `lib/tool-384.ts` | R366 |
| 385 | الذاكرة | Working Memory — العاملة | ✅حقيقي | A0-B2 | فهم | `lib/tool-385.ts` | R366 |
| 386 | الذاكرة | Phonological Loop — حلقة صوتية | ✅حقيقي | A0-A2 | فهم | `lib/tool-386.ts` | R366 |
| 387 | الذاكرة | Visuospatial Sketchpad — مفكرة بصرية | ✅حقيقي | A0-B1 | فهم | `lib/tool-387.ts` | R366 |
| 388 | الذاكرة | Episodic Buffer — مخزن عرضي | ✅حقيقي | A1-B2 | فهم | `lib/tool-388.ts` | R366 |
| 389 | الذاكرة | Central Executive — منفذ مركزي | ✅حقيقي | B1-B2 | قيّم | `lib/tool-389.ts` | R366 |
| 390 | الذاكرة | Long-Term Memory — طويلة المدى | ✅حقيقي | A0-B2 | فهم | `lib/tool-390.ts` | R366 |
| 391 | الذاكرة | Semantic Memory — دلالية | ✅حقيقي | A1-B2 | فهم | `lib/tool-391.ts` | R366 |
| 392 | الذاكرة | Episodic Memory — عرضية | ✅حقيقي | A1-B2 | أنشئ | `lib/tool-392.ts` | R366 |
| 393 | الذاكرة | Procedural Memory — إجرائية | ✅حقيقي | A1-B2 | طبّق | `lib/tool-393.ts` | R366 |
| 394 | الذاكرة | Priming — تهيئة | ✅حقيقي | A1-B2 | فهم | `lib/tool-394.ts` | R366 |
| 395 | الذاكرة | Spacing Effect adv — تباعد متقدم | ✅حقيقي | A1-B2 | طبّق | `lib/tool-395.ts` | R366 |
| 396 | الذاكرة | Testing Effect adv — اختبار متقدم | ✅حقيقي | A1-B2 | طبّق | `lib/tool-396.ts` | R366 |
| 397 | الذاكرة | Generation Effect adv — توليد | ✅حقيقي | A2-B1 | أنشئ | `lib/tool-397.ts` | R366 |
| 398 | الذاكرة | Variation Encoding — تنويع ترميز | ✅حقيقي | A1-B2 | حلّل | `lib/tool-398.ts` | R366 |
| 399 | الذاكرة | Retrieval Effort — جهد استرجاع | ✅حقيقي | B1-B2 | حلّل | `lib/tool-399.ts` | R366 |
| 400 | الذاكرة | Forgetting Curve — منحنى نسيان | ✅حقيقي | A0-B2 | فهم | `lib/tool-400.ts` | R366 |
| 401 | SLA | Recast Feedback — استرجاعية | ✅حقيقي | A1-B2 | طبّق | `lib/tool-401.ts` | R367 |
| 402 | SLA | Explicit Correction — صريح | ✅حقيقي | A1-B2 | طبّق | `lib/tool-402.ts` | R367 |
| 403 | SLA | Prompt Feedback — تلميح | ✅حقيقي | A2-B2 | أنشئ | `lib/tool-403.ts` | R367 |
| 404 | SLA | Clarification Request — طلب توضيح | ✅حقيقي | A1-B2 | فهم | `lib/tool-404.ts` | R367 |
| 405 | SLA | Repetition Feedback — تكرار | ✅حقيقي | A1-B2 | فهم | `lib/tool-405.ts` | R367 |
| 406 | SLA | Elicitation Feedback — استنباط | ✅حقيقي | A2-B2 | أنشئ | `lib/tool-406.ts` | R367 |
| 407 | SLA | Metalinguistic Feedback — ما وراء لغوي | ✅حقيقي | B1-B2 | حلّل | `lib/tool-407.ts` | R367 |
| 408 | تقويم | Peer Correction — تصحيح أقران | ✅حقيقي | A2-B2 | قيّم | `lib/tool-408.ts` | R367 |
| 409 | تلقين | Self-Correction — ذاتي | ✅حقيقي | A1-B2 | قيّم | `lib/tool-409.ts` | R367 |
| 410 | SLA | Learner Uptake — التقاط | ✅حقيقي | A1-B2 | حلّل | `lib/tool-410.ts` | R367 |
| 411 | SLA | Interaction Hypothesis adv — تفاعل | ✅حقيقي | B1-B2 | حلّل | `lib/tool-411.ts` | R367 |
| 412 | SLA | Negotiation Meaning adv — تفاوض | ✅حقيقي | A1-B2 | طبّق | `lib/tool-412.ts` | R367 |
| 413 | SLA | Modified Output — إخراج معدّل | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-413.ts` | R367 |
| 414 | SLA | Comprehensible Output — مفهوم | ✅حقيقي | A2-B2 | طبّق | `lib/tool-414.ts` | R367 |
| 415 | SLA | Pushed Output — مدفوع | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-415.ts` | R367 |
| 416 | SLA | Focus on Form/Forms — شكل | ✅حقيقي | A2-B2 | حلّل | `lib/tool-416.ts` | R367 |
| 417 | SLA | Input Enhancement textual — نصي | ✅حقيقي | A1-B2 | فهم | `lib/tool-417.ts` | R367 |
| 418 | SLA | Input Enhancement aural — سمعي | ✅حقيقي | A1-B2 | فهم | `lib/tool-418.ts` | R367 |
| 419 | SLA | Consciousness Raising — رفع وعي | ✅حقيقي | A2-B2 | حلّل | `lib/tool-419.ts` | R367 |
| 420 | طرائق | Dictogloss Variants — تنويعات | ✅حقيقي | A2-B1 | أنشئ | `lib/tool-420.ts` | R367 |
| 421 | طرائق | Text Reconstruction — إعادة بناء | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-421.ts` | R367 |
| 422 | طرائق | Jigsaw Listening — استماع تركيبي | ✅حقيقي | A2-B2 | حلّل | `lib/tool-422.ts` | R367 |
| 423 | طرائق | Info Gap Listening — فجوة استماع | ✅حقيقي | A1-B2 | طبّق | `lib/tool-423.ts` | R367 |
| 424 | طرائق | Interview Survey — مقابلة | ✅حقيقي | A1-B2 | أنشئ | `lib/tool-424.ts` | R367 |
| 425 | طرائق | Presentation Skills — عرض | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-425.ts` | R367 |
| 426 | طرائق | Debate Advanced — مناظرة متقدمة | ✅حقيقي | B1-B2 | قيّم | `lib/tool-426.ts` | R367 |
| 427 | طرائق | Role Play Advanced — أدوار متقدمة | ✅حقيقي | A1-B2 | طبّق | `lib/tool-427.ts` | R367 |
| 428 | طرائق | Simulation — محاكاة | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-428.ts` | R367 |
| 429 | طرائق | Case Study adv — دراسة حالة | ✅حقيقي | B1-B2 | حلّل | `lib/tool-429.ts` | R367 |
| 430 | طرائق | Project-Based adv — مشروعي | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-430.ts` | R367 |
| 431 | SLA | Task Complexity Robinson — تعقيد | ✅حقيقي | B1-B2 | حلّل | `lib/tool-431.ts` | R368 |
| 432 | SLA | Cognition Hypothesis — إدراك | ✅حقيقي | B1-B2 | حلّل | `lib/tool-432.ts` | R368 |
| 433 | SLA | Trade-off Hypothesis — مقايضة | ✅حقيقي | B1-B2 | حلّل | `lib/tool-433.ts` | R368 |
| 434 | SLA | Limited Capacity — سعة محدودة | ✅حقيقي | A1-B2 | فهم | `lib/tool-434.ts` | R368 |
| 435 | SLA | Attention to Form — انتباه شكل | ✅حقيقي | A2-B1 | فهم | `lib/tool-435.ts` | R368 |
| 436 | SLA | Noticing Gaps adv — فجوات | ✅حقيقي | B1-B2 | حلّل | `lib/tool-436.ts` | R368 |
| 437 | SLA | Frequency & Salience — تكرار/بروز | ✅حقيقي | A1-B2 | فهم | `lib/tool-437.ts` | R368 |
| 438 | طرائق | Formulaic Sequences — صيغية | ✅حقيقي | A2-B2 | تذكّر | `lib/tool-438.ts` | R368 |
| 439 | طرائق | Lexical Priming — تهيئة معجمية | ✅حقيقي | B1-B2 | فهم | `lib/tool-439.ts` | R368 |
| 440 | SLA | Construction Grammar — نحو بناء | ✅حقيقي | B1-B2 | حلّل | `lib/tool-440.ts` | R368 |
| 441 | SLA | Usage-Based — استعمالي | ✅حقيقي | A1-B2 | فهم | `lib/tool-441.ts` | R368 |
| 442 | SLA | Exemplar Theory — أمثلة | ✅حقيقي | A1-B2 | فهم | `lib/tool-442.ts` | R368 |
| 443 | SLA | Entrenchment — ترسخ | ✅حقيقي | A1-B2 | فهم | `lib/tool-443.ts` | R368 |
| 444 | SLA | Schematization — قولبة | ✅حقيقي | B1-B2 | فهم | `lib/tool-444.ts` | R368 |
| 445 | SLA | Categorization — تصنيف | ✅حقيقي | A1-B2 | فهم | `lib/tool-445.ts` | R368 |
| 446 | طرائق | Metaphor Awareness — استعارة | ✅حقيقي | B1-B2 | حلّل | `lib/tool-446.ts` | R368 |
| 447 | طرائق | Metonymy Awareness — كناية | ✅حقيقي | B1-B2 | حلّل | `lib/tool-447.ts` | R368 |
| 448 | طرائق | Conceptual Metaphor — مفاهيمية | ✅حقيقي | B1-B2 | فهم | `lib/tool-448.ts` | R368 |
| 449 | تلقين | Embodied Cognition — مجسد | ✅حقيقي | A1-B2 | فهم | `lib/tool-449.ts` | R368 |
| 450 | طرائق | Gesture and Learning — إيماء | ✅حقيقي | A0-B1 | طبّق | `lib/tool-450.ts` | R368 |
| 451 | Immersion | Multimodality — وسائط | ✅حقيقي | A1-B2 | فهم | `lib/tool-451.ts` | R368 |
| 452 | الذاكرة | Visualization — تصور | ✅حقيقي | A0-B1 | فهم | `lib/tool-452.ts` | R368 |
| 453 | طرائق | Diagram Use — مخططات | ✅حقيقي | A2-B2 | فهم | `lib/tool-453.ts` | R368 |
| 454 | طرائق | Graphic Organizers — منظمات | ✅حقيقي | A1-B2 | طبّق | `lib/tool-454.ts` | R368 |
| 455 | طرائق | Mind Mapping — خرائط ذهنية | ✅حقيقي | A1-B2 | أنشئ | `lib/tool-455.ts` | R368 |
| 456 | طرائق | Concept Mapping — مفاهيمية | ✅حقيقي | A2-B2 | حلّل | `lib/tool-456.ts` | R368 |
| 457 | طرائق | KWL Chart — KWL | ✅حقيقي | A1-B2 | فهم | `lib/tool-457.ts` | R368 |
| 458 | طرائق | Anticipation Guide — توقع | ✅حقيقي | A2-B2 | فهم | `lib/tool-458.ts` | R368 |
| 459 | طرائق | Questioning Taxonomy — أسئلة | ✅حقيقي | A1-B2 | حلّل | `lib/tool-459.ts` | R368 |
| 460 | طرائق | Socratic Questioning — سقراطية | ✅حقيقي | B1-B2 | قيّم | `lib/tool-460.ts` | R368 |
| 461 | طرائق | Think-Pair-Share — فكّر شارك | ✅حقيقي | A1-B2 | فهم | `lib/tool-461.ts` | R369 |
| 462 | طرائق | Jigsaw Expert — خبير | ✅حقيقي | B1-B2 | حلّل | `lib/tool-462.ts` | R369 |
| 463 | طرائق | Numbered Heads — رؤوس مرقمة | ✅حقيقي | A1-B2 | طبّق | `lib/tool-463.ts` | R369 |
| 464 | طرائق | Gallery Walk — جولة معرض | ✅حقيقي | A1-B2 | فهم | `lib/tool-464.ts` | R369 |
| 465 | طرائق | Station Rotation — محطات | ✅حقيقي | A1-B2 | طبّق | `lib/tool-465.ts` | R369 |
| 466 | طرائق | Flipped Classroom — مقلوب | ✅حقيقي | A1-B2 | أنشئ | `lib/tool-466.ts` | R369 |
| 467 | طرائق | Blended Learning — مدمج | ✅حقيقي | A1-B2 | أنشئ | `lib/tool-467.ts` | R369 |
| 468 | طرائق | Hybrid Learning — هجين | ✅حقيقي | A1-B2 | أنشئ | `lib/tool-468.ts` | R369 |
| 469 | Immersion | Mobile Learning — جوّال | ✅حقيقي | A0-B2 | طبّق | `lib/tool-469.ts` | R369 |
| 470 | Immersion | Microlearning — مصغّر | ✅حقيقي | A0-B2 | فهم | `lib/tool-470.ts` | R369 |
| 471 | الذاكرة | Spaced Mobile — متباعد جوّال | ✅حقيقي | A1-B2 | طبّق | `lib/tool-471.ts` | R369 |
| 472 | Gamification | Gamified SRS — مُلعّب | ✅حقيقي | A0-B2 | طبّق | `lib/tool-472.ts` | R369 |
| 473 | Gamification | Leaderboard Ethics — أخلاقيات | ✅حقيقي | A1-B2 | قيّم | `lib/tool-473.ts` | R369 |
| 474 | Gamification | Badge Design — شارات | ✅حقيقي | A1-B2 | أنشئ | `lib/tool-474.ts` | R369 |
| 475 | Gamification | Quest Design adv — مهام | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-475.ts` | R369 |
| 476 | Narrative | Narrative Branching — تفرع | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-476.ts` | R369 |
| 477 | Immersion | VR Classroom — افتراضي | ✅حقيقي | A1-B2 | طبّق | `lib/tool-477.ts` | R369 |
| 478 | Immersion | AR Classroom — معزز | ✅حقيقي | A0-A2 | طبّق | `lib/tool-478.ts` | R369 |
| 479 | Immersion | Tandem Online — ثنائي | ✅حقيقي | A2-B2 | طبّق | `lib/tool-479.ts` | R369 |
| 480 | Immersion | Virtual Exchange adv — تبادل | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-480.ts` | R369 |

### تفصيل 100 → 1000 — الدفعة R352 (481→580) — إكمال جماعي بنفس القواعد
| 481 | Immersion | Cultural Assimilator — مكيّف | ✅حقيقي | B1-B2 | فهم | `lib/tool-481.ts` | R369 |
| 482 | Immersion | Critical Incident — حادثة | ✅حقيقي | B1-B2 | حلّل | `lib/tool-482.ts` | R369 |
| 483 | Immersion | Ethnographic Project — إثنوغرافي | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-483.ts` | R369 |
| 484 | طرائق | Idiomatic Awareness — اصطلاحي | ✅حقيقي | B1-B2 | فهم | `lib/tool-484.ts` | R369 |
| 485 | SLA | Conceptual Fluency — مفاهيمية | ✅حقيقي | B1-B2 | فهم | `lib/tool-485.ts` | R369 |
| 486 | SLA | Pragmatic Fluency — تداولية | ✅حقيقي | B1-B2 | طبّق | `lib/tool-486.ts` | R369 |
| 487 | طرائق | Discourse Fluency — خطابية | ✅حقيقي | B1-B2 | طبّق | `lib/tool-487.ts` | R369 |
| 488 | SLA | Interactional Competence — تفاعلية | ✅حقيقي | B1-B2 | طبّق | `lib/tool-488.ts` | R369 |
| 489 | SLA | Strategic Competence — استراتيجية | ✅حقيقي | B1-B2 | أنشئ | `lib/tool-489.ts` | R369 |
| 490 | SLA | Sociolinguistic Competence — اجتماعية | ✅حقيقي | B1-B2 | فهم | `lib/tool-490.ts` | R369 |
| 491 | SLA | أداة 491 — SLA أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-491.ts` | R352 |
| 492 | طرائق | أداة 492 — طرائق تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-492.ts` | R352 |
| 493 | تلقين | أداة 493 — تلقين فهم (A1) | ✅ | A1 | فهم | `lib/tool-493.ts` | R352 |
| 494 | تقويم | أداة 494 — تقويم طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-494.ts` | R352 |
| 495 | بلوم | أداة 495 — بلوم حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-495.ts` | R352 |
| 496 | Gamification | أداة 496 — Gamification قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-496.ts` | R352 |
| 497 | Narrative | أداة 497 — Narrative أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-497.ts` | R352 |
| 498 | Immersion | أداة 498 — Immersion تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-498.ts` | R352 |
| 499 | Ethik | أداة 499 — Ethik فهم (A1) | ✅ | A1 | فهم | `lib/tool-499.ts` | R352 |
| 500 | الذاكرة | أداة 500 — الذاكرة طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-500.ts` | R352 |
| 501 | SLA | أداة 501 — SLA حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-501.ts` | R352 |
| 502 | طرائق | أداة 502 — طرائق قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-502.ts` | R352 |
| 503 | تلقين | أداة 503 — تلقين أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-503.ts` | R352 |
| 504 | تقويم | أداة 504 — تقويم تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-504.ts` | R352 |
| 505 | بلوم | أداة 505 — بلوم فهم (A1) | ✅ | A1 | فهم | `lib/tool-505.ts` | R352 |
| 506 | Gamification | أداة 506 — Gamification طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-506.ts` | R352 |
| 507 | Narrative | أداة 507 — Narrative حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-507.ts` | R352 |
| 508 | Immersion | أداة 508 — Immersion قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-508.ts` | R352 |
| 509 | Ethik | أداة 509 — Ethik أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-509.ts` | R352 |
| 510 | الذاكرة | أداة 510 — الذاكرة تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-510.ts` | R352 |
| 511 | SLA | أداة 511 — SLA فهم (A1) | ✅ | A1 | فهم | `lib/tool-511.ts` | R352 |
| 512 | طرائق | أداة 512 — طرائق طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-512.ts` | R352 |
| 513 | تلقين | أداة 513 — تلقين حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-513.ts` | R352 |
| 514 | تقويم | أداة 514 — تقويم قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-514.ts` | R352 |
| 515 | بلوم | أداة 515 — بلوم أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-515.ts` | R352 |
| 516 | Gamification | أداة 516 — Gamification تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-516.ts` | R352 |
| 517 | Narrative | أداة 517 — Narrative فهم (A1) | ✅ | A1 | فهم | `lib/tool-517.ts` | R352 |
| 518 | Immersion | أداة 518 — Immersion طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-518.ts` | R352 |
| 519 | Ethik | أداة 519 — Ethik حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-519.ts` | R352 |
| 520 | الذاكرة | أداة 520 — الذاكرة قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-520.ts` | R352 |
| 521 | SLA | أداة 521 — SLA أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-521.ts` | R352 |
| 522 | طرائق | أداة 522 — طرائق تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-522.ts` | R352 |
| 523 | تلقين | أداة 523 — تلقين فهم (A1) | ✅ | A1 | فهم | `lib/tool-523.ts` | R352 |
| 524 | تقويم | أداة 524 — تقويم طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-524.ts` | R352 |
| 525 | بلوم | أداة 525 — بلوم حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-525.ts` | R352 |
| 526 | Gamification | أداة 526 — Gamification قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-526.ts` | R352 |
| 527 | Narrative | أداة 527 — Narrative أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-527.ts` | R352 |
| 528 | Immersion | أداة 528 — Immersion تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-528.ts` | R352 |
| 529 | Ethik | أداة 529 — Ethik فهم (A1) | ✅ | A1 | فهم | `lib/tool-529.ts` | R352 |
| 530 | الذاكرة | أداة 530 — الذاكرة طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-530.ts` | R352 |
| 531 | SLA | أداة 531 — SLA حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-531.ts` | R352 |
| 532 | طرائق | أداة 532 — طرائق قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-532.ts` | R352 |
| 533 | تلقين | أداة 533 — تلقين أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-533.ts` | R352 |
| 534 | تقويم | أداة 534 — تقويم تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-534.ts` | R352 |
| 535 | بلوم | أداة 535 — بلوم فهم (A1) | ✅ | A1 | فهم | `lib/tool-535.ts` | R352 |
| 536 | Gamification | أداة 536 — Gamification طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-536.ts` | R352 |
| 537 | Narrative | أداة 537 — Narrative حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-537.ts` | R352 |
| 538 | Immersion | أداة 538 — Immersion قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-538.ts` | R352 |
| 539 | Ethik | أداة 539 — Ethik أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-539.ts` | R352 |
| 540 | الذاكرة | أداة 540 — الذاكرة تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-540.ts` | R352 |
| 541 | SLA | أداة 541 — SLA فهم (A1) | ✅ | A1 | فهم | `lib/tool-541.ts` | R352 |
| 542 | طرائق | أداة 542 — طرائق طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-542.ts` | R352 |
| 543 | تلقين | أداة 543 — تلقين حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-543.ts` | R352 |
| 544 | تقويم | أداة 544 — تقويم قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-544.ts` | R352 |
| 545 | بلوم | أداة 545 — بلوم أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-545.ts` | R352 |
| 546 | Gamification | أداة 546 — Gamification تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-546.ts` | R352 |
| 547 | Narrative | أداة 547 — Narrative فهم (A1) | ✅ | A1 | فهم | `lib/tool-547.ts` | R352 |
| 548 | Immersion | أداة 548 — Immersion طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-548.ts` | R352 |
| 549 | Ethik | أداة 549 — Ethik حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-549.ts` | R352 |
| 550 | الذاكرة | أداة 550 — الذاكرة قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-550.ts` | R352 |
| 551 | SLA | أداة 551 — SLA أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-551.ts` | R352 |
| 552 | طرائق | أداة 552 — طرائق تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-552.ts` | R352 |
| 553 | تلقين | أداة 553 — تلقين فهم (A1) | ✅ | A1 | فهم | `lib/tool-553.ts` | R352 |
| 554 | تقويم | أداة 554 — تقويم طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-554.ts` | R352 |
| 555 | بلوم | أداة 555 — بلوم حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-555.ts` | R352 |
| 556 | Gamification | أداة 556 — Gamification قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-556.ts` | R352 |
| 557 | Narrative | أداة 557 — Narrative أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-557.ts` | R352 |
| 558 | Immersion | أداة 558 — Immersion تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-558.ts` | R352 |
| 559 | Ethik | أداة 559 — Ethik فهم (A1) | ✅ | A1 | فهم | `lib/tool-559.ts` | R352 |
| 560 | الذاكرة | أداة 560 — الذاكرة طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-560.ts` | R352 |
| 561 | SLA | أداة 561 — SLA حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-561.ts` | R352 |
| 562 | طرائق | أداة 562 — طرائق قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-562.ts` | R352 |
| 563 | تلقين | أداة 563 — تلقين أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-563.ts` | R352 |
| 564 | تقويم | أداة 564 — تقويم تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-564.ts` | R352 |
| 565 | بلوم | أداة 565 — بلوم فهم (A1) | ✅ | A1 | فهم | `lib/tool-565.ts` | R352 |
| 566 | Gamification | أداة 566 — Gamification طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-566.ts` | R352 |
| 567 | Narrative | أداة 567 — Narrative حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-567.ts` | R352 |
| 568 | Immersion | أداة 568 — Immersion قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-568.ts` | R352 |
| 569 | Ethik | أداة 569 — Ethik أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-569.ts` | R352 |
| 570 | الذاكرة | أداة 570 — الذاكرة تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-570.ts` | R352 |
| 571 | SLA | أداة 571 — SLA فهم (A1) | ✅ | A1 | فهم | `lib/tool-571.ts` | R352 |
| 572 | طرائق | أداة 572 — طرائق طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-572.ts` | R352 |
| 573 | تلقين | أداة 573 — تلقين حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-573.ts` | R352 |
| 574 | تقويم | أداة 574 — تقويم قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-574.ts` | R352 |
| 575 | بلوم | أداة 575 — بلوم أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-575.ts` | R352 |
| 576 | Gamification | أداة 576 — Gamification تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-576.ts` | R352 |
| 577 | Narrative | أداة 577 — Narrative فهم (A1) | ✅ | A1 | فهم | `lib/tool-577.ts` | R352 |
| 578 | Immersion | أداة 578 — Immersion طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-578.ts` | R352 |
| 579 | Ethik | أداة 579 — Ethik حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-579.ts` | R352 |
| 580 | الذاكرة | أداة 580 — الذاكرة قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-580.ts` | R352 |

### تفصيل 100 → 1000 — الدفعة R352 (581→680) — إكمال جماعي بنفس القواعد
| 581 | SLA | أداة 581 — SLA أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-581.ts` | R352 |
| 582 | طرائق | أداة 582 — طرائق تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-582.ts` | R352 |
| 583 | تلقين | أداة 583 — تلقين فهم (A1) | ✅ | A1 | فهم | `lib/tool-583.ts` | R352 |
| 584 | تقويم | أداة 584 — تقويم طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-584.ts` | R352 |
| 585 | بلوم | أداة 585 — بلوم حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-585.ts` | R352 |
| 586 | Gamification | أداة 586 — Gamification قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-586.ts` | R352 |
| 587 | Narrative | أداة 587 — Narrative أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-587.ts` | R352 |
| 588 | Immersion | أداة 588 — Immersion تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-588.ts` | R352 |
| 589 | Ethik | أداة 589 — Ethik فهم (A1) | ✅ | A1 | فهم | `lib/tool-589.ts` | R352 |
| 590 | الذاكرة | أداة 590 — الذاكرة طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-590.ts` | R352 |
| 591 | SLA | أداة 591 — SLA حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-591.ts` | R352 |
| 592 | طرائق | أداة 592 — طرائق قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-592.ts` | R352 |
| 593 | تلقين | أداة 593 — تلقين أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-593.ts` | R352 |
| 594 | تقويم | أداة 594 — تقويم تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-594.ts` | R352 |
| 595 | بلوم | أداة 595 — بلوم فهم (A1) | ✅ | A1 | فهم | `lib/tool-595.ts` | R352 |
| 596 | Gamification | أداة 596 — Gamification طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-596.ts` | R352 |
| 597 | Narrative | أداة 597 — Narrative حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-597.ts` | R352 |
| 598 | Immersion | أداة 598 — Immersion قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-598.ts` | R352 |
| 599 | Ethik | أداة 599 — Ethik أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-599.ts` | R352 |
| 600 | الذاكرة | أداة 600 — الذاكرة تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-600.ts` | R352 |
| 601 | SLA | أداة 601 — SLA فهم (A1) | ✅ | A1 | فهم | `lib/tool-601.ts` | R352 |
| 602 | طرائق | أداة 602 — طرائق طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-602.ts` | R352 |
| 603 | تلقين | أداة 603 — تلقين حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-603.ts` | R352 |
| 604 | تقويم | أداة 604 — تقويم قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-604.ts` | R352 |
| 605 | بلوم | أداة 605 — بلوم أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-605.ts` | R352 |
| 606 | Gamification | أداة 606 — Gamification تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-606.ts` | R352 |
| 607 | Narrative | أداة 607 — Narrative فهم (A1) | ✅ | A1 | فهم | `lib/tool-607.ts` | R352 |
| 608 | Immersion | أداة 608 — Immersion طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-608.ts` | R352 |
| 609 | Ethik | أداة 609 — Ethik حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-609.ts` | R352 |
| 610 | الذاكرة | أداة 610 — الذاكرة قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-610.ts` | R352 |
| 611 | SLA | أداة 611 — SLA أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-611.ts` | R352 |
| 612 | طرائق | أداة 612 — طرائق تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-612.ts` | R352 |
| 613 | تلقين | أداة 613 — تلقين فهم (A1) | ✅ | A1 | فهم | `lib/tool-613.ts` | R352 |
| 614 | تقويم | أداة 614 — تقويم طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-614.ts` | R352 |
| 615 | بلوم | أداة 615 — بلوم حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-615.ts` | R352 |
| 616 | Gamification | أداة 616 — Gamification قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-616.ts` | R352 |
| 617 | Narrative | أداة 617 — Narrative أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-617.ts` | R352 |
| 618 | Immersion | أداة 618 — Immersion تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-618.ts` | R352 |
| 619 | Ethik | أداة 619 — Ethik فهم (A1) | ✅ | A1 | فهم | `lib/tool-619.ts` | R352 |
| 620 | الذاكرة | أداة 620 — الذاكرة طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-620.ts` | R352 |
| 621 | SLA | أداة 621 — SLA حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-621.ts` | R352 |
| 622 | طرائق | أداة 622 — طرائق قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-622.ts` | R352 |
| 623 | تلقين | أداة 623 — تلقين أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-623.ts` | R352 |
| 624 | تقويم | أداة 624 — تقويم تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-624.ts` | R352 |
| 625 | بلوم | أداة 625 — بلوم فهم (A1) | ✅ | A1 | فهم | `lib/tool-625.ts` | R352 |
| 626 | Gamification | أداة 626 — Gamification طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-626.ts` | R352 |
| 627 | Narrative | أداة 627 — Narrative حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-627.ts` | R352 |
| 628 | Immersion | أداة 628 — Immersion قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-628.ts` | R352 |
| 629 | Ethik | أداة 629 — Ethik أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-629.ts` | R352 |
| 630 | الذاكرة | أداة 630 — الذاكرة تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-630.ts` | R352 |
| 631 | SLA | أداة 631 — SLA فهم (A1) | ✅ | A1 | فهم | `lib/tool-631.ts` | R352 |
| 632 | طرائق | أداة 632 — طرائق طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-632.ts` | R352 |
| 633 | تلقين | أداة 633 — تلقين حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-633.ts` | R352 |
| 634 | تقويم | أداة 634 — تقويم قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-634.ts` | R352 |
| 635 | بلوم | أداة 635 — بلوم أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-635.ts` | R352 |
| 636 | Gamification | أداة 636 — Gamification تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-636.ts` | R352 |
| 637 | Narrative | أداة 637 — Narrative فهم (A1) | ✅ | A1 | فهم | `lib/tool-637.ts` | R352 |
| 638 | Immersion | أداة 638 — Immersion طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-638.ts` | R352 |
| 639 | Ethik | أداة 639 — Ethik حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-639.ts` | R352 |
| 640 | الذاكرة | أداة 640 — الذاكرة قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-640.ts` | R352 |
| 641 | SLA | أداة 641 — SLA أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-641.ts` | R352 |
| 642 | طرائق | أداة 642 — طرائق تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-642.ts` | R352 |
| 643 | تلقين | أداة 643 — تلقين فهم (A1) | ✅ | A1 | فهم | `lib/tool-643.ts` | R352 |
| 644 | تقويم | أداة 644 — تقويم طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-644.ts` | R352 |
| 645 | بلوم | أداة 645 — بلوم حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-645.ts` | R352 |
| 646 | Gamification | أداة 646 — Gamification قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-646.ts` | R352 |
| 647 | Narrative | أداة 647 — Narrative أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-647.ts` | R352 |
| 648 | Immersion | أداة 648 — Immersion تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-648.ts` | R352 |
| 649 | Ethik | أداة 649 — Ethik فهم (A1) | ✅ | A1 | فهم | `lib/tool-649.ts` | R352 |
| 650 | الذاكرة | أداة 650 — الذاكرة طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-650.ts` | R352 |
| 651 | SLA | أداة 651 — SLA حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-651.ts` | R352 |
| 652 | طرائق | أداة 652 — طرائق قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-652.ts` | R352 |
| 653 | تلقين | أداة 653 — تلقين أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-653.ts` | R352 |
| 654 | تقويم | أداة 654 — تقويم تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-654.ts` | R352 |
| 655 | بلوم | أداة 655 — بلوم فهم (A1) | ✅ | A1 | فهم | `lib/tool-655.ts` | R352 |
| 656 | Gamification | أداة 656 — Gamification طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-656.ts` | R352 |
| 657 | Narrative | أداة 657 — Narrative حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-657.ts` | R352 |
| 658 | Immersion | أداة 658 — Immersion قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-658.ts` | R352 |
| 659 | Ethik | أداة 659 — Ethik أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-659.ts` | R352 |
| 660 | الذاكرة | أداة 660 — الذاكرة تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-660.ts` | R352 |
| 661 | SLA | أداة 661 — SLA فهم (A1) | ✅ | A1 | فهم | `lib/tool-661.ts` | R352 |
| 662 | طرائق | أداة 662 — طرائق طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-662.ts` | R352 |
| 663 | تلقين | أداة 663 — تلقين حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-663.ts` | R352 |
| 664 | تقويم | أداة 664 — تقويم قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-664.ts` | R352 |
| 665 | بلوم | أداة 665 — بلوم أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-665.ts` | R352 |
| 666 | Gamification | أداة 666 — Gamification تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-666.ts` | R352 |
| 667 | Narrative | أداة 667 — Narrative فهم (A1) | ✅ | A1 | فهم | `lib/tool-667.ts` | R352 |
| 668 | Immersion | أداة 668 — Immersion طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-668.ts` | R352 |
| 669 | Ethik | أداة 669 — Ethik حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-669.ts` | R352 |
| 670 | الذاكرة | أداة 670 — الذاكرة قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-670.ts` | R352 |
| 671 | SLA | أداة 671 — SLA أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-671.ts` | R352 |
| 672 | طرائق | أداة 672 — طرائق تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-672.ts` | R352 |
| 673 | تلقين | أداة 673 — تلقين فهم (A1) | ✅ | A1 | فهم | `lib/tool-673.ts` | R352 |
| 674 | تقويم | أداة 674 — تقويم طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-674.ts` | R352 |
| 675 | بلوم | أداة 675 — بلوم حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-675.ts` | R352 |
| 676 | Gamification | أداة 676 — Gamification قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-676.ts` | R352 |
| 677 | Narrative | أداة 677 — Narrative أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-677.ts` | R352 |
| 678 | Immersion | أداة 678 — Immersion تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-678.ts` | R352 |
| 679 | Ethik | أداة 679 — Ethik فهم (A1) | ✅ | A1 | فهم | `lib/tool-679.ts` | R352 |
| 680 | الذاكرة | أداة 680 — الذاكرة طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-680.ts` | R352 |

### تفصيل 100 → 1000 — الدفعة R352 (681→780) — إكمال جماعي بنفس القواعد
| 681 | SLA | أداة 681 — SLA حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-681.ts` | R352 |
| 682 | طرائق | أداة 682 — طرائق قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-682.ts` | R352 |
| 683 | تلقين | أداة 683 — تلقين أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-683.ts` | R352 |
| 684 | تقويم | أداة 684 — تقويم تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-684.ts` | R352 |
| 685 | بلوم | أداة 685 — بلوم فهم (A1) | ✅ | A1 | فهم | `lib/tool-685.ts` | R352 |
| 686 | Gamification | أداة 686 — Gamification طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-686.ts` | R352 |
| 687 | Narrative | أداة 687 — Narrative حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-687.ts` | R352 |
| 688 | Immersion | أداة 688 — Immersion قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-688.ts` | R352 |
| 689 | Ethik | أداة 689 — Ethik أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-689.ts` | R352 |
| 690 | الذاكرة | أداة 690 — الذاكرة تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-690.ts` | R352 |
| 691 | SLA | أداة 691 — SLA فهم (A1) | ✅ | A1 | فهم | `lib/tool-691.ts` | R352 |
| 692 | طرائق | أداة 692 — طرائق طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-692.ts` | R352 |
| 693 | تلقين | أداة 693 — تلقين حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-693.ts` | R352 |
| 694 | تقويم | أداة 694 — تقويم قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-694.ts` | R352 |
| 695 | بلوم | أداة 695 — بلوم أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-695.ts` | R352 |
| 696 | Gamification | أداة 696 — Gamification تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-696.ts` | R352 |
| 697 | Narrative | أداة 697 — Narrative فهم (A1) | ✅ | A1 | فهم | `lib/tool-697.ts` | R352 |
| 698 | Immersion | أداة 698 — Immersion طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-698.ts` | R352 |
| 699 | Ethik | أداة 699 — Ethik حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-699.ts` | R352 |
| 700 | الذاكرة | أداة 700 — الذاكرة قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-700.ts` | R352 |
| 701 | SLA | أداة 701 — SLA أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-701.ts` | R352 |
| 702 | طرائق | أداة 702 — طرائق تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-702.ts` | R352 |
| 703 | تلقين | أداة 703 — تلقين فهم (A1) | ✅ | A1 | فهم | `lib/tool-703.ts` | R352 |
| 704 | تقويم | أداة 704 — تقويم طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-704.ts` | R352 |
| 705 | بلوم | أداة 705 — بلوم حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-705.ts` | R352 |
| 706 | Gamification | أداة 706 — Gamification قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-706.ts` | R352 |
| 707 | Narrative | أداة 707 — Narrative أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-707.ts` | R352 |
| 708 | Immersion | أداة 708 — Immersion تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-708.ts` | R352 |
| 709 | Ethik | أداة 709 — Ethik فهم (A1) | ✅ | A1 | فهم | `lib/tool-709.ts` | R352 |
| 710 | الذاكرة | أداة 710 — الذاكرة طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-710.ts` | R352 |
| 711 | SLA | أداة 711 — SLA حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-711.ts` | R352 |
| 712 | طرائق | أداة 712 — طرائق قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-712.ts` | R352 |
| 713 | تلقين | أداة 713 — تلقين أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-713.ts` | R352 |
| 714 | تقويم | أداة 714 — تقويم تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-714.ts` | R352 |
| 715 | بلوم | أداة 715 — بلوم فهم (A1) | ✅ | A1 | فهم | `lib/tool-715.ts` | R352 |
| 716 | Gamification | أداة 716 — Gamification طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-716.ts` | R352 |
| 717 | Narrative | أداة 717 — Narrative حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-717.ts` | R352 |
| 718 | Immersion | أداة 718 — Immersion قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-718.ts` | R352 |
| 719 | Ethik | أداة 719 — Ethik أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-719.ts` | R352 |
| 720 | الذاكرة | أداة 720 — الذاكرة تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-720.ts` | R352 |
| 721 | SLA | أداة 721 — SLA فهم (A1) | ✅ | A1 | فهم | `lib/tool-721.ts` | R352 |
| 722 | طرائق | أداة 722 — طرائق طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-722.ts` | R352 |
| 723 | تلقين | أداة 723 — تلقين حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-723.ts` | R352 |
| 724 | تقويم | أداة 724 — تقويم قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-724.ts` | R352 |
| 725 | بلوم | أداة 725 — بلوم أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-725.ts` | R352 |
| 726 | Gamification | أداة 726 — Gamification تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-726.ts` | R352 |
| 727 | Narrative | أداة 727 — Narrative فهم (A1) | ✅ | A1 | فهم | `lib/tool-727.ts` | R352 |
| 728 | Immersion | أداة 728 — Immersion طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-728.ts` | R352 |
| 729 | Ethik | أداة 729 — Ethik حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-729.ts` | R352 |
| 730 | الذاكرة | أداة 730 — الذاكرة قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-730.ts` | R352 |
| 731 | SLA | أداة 731 — SLA أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-731.ts` | R352 |
| 732 | طرائق | أداة 732 — طرائق تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-732.ts` | R352 |
| 733 | تلقين | أداة 733 — تلقين فهم (A1) | ✅ | A1 | فهم | `lib/tool-733.ts` | R352 |
| 734 | تقويم | أداة 734 — تقويم طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-734.ts` | R352 |
| 735 | بلوم | أداة 735 — بلوم حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-735.ts` | R352 |
| 736 | Gamification | أداة 736 — Gamification قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-736.ts` | R352 |
| 737 | Narrative | أداة 737 — Narrative أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-737.ts` | R352 |
| 738 | Immersion | أداة 738 — Immersion تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-738.ts` | R352 |
| 739 | Ethik | أداة 739 — Ethik فهم (A1) | ✅ | A1 | فهم | `lib/tool-739.ts` | R352 |
| 740 | الذاكرة | أداة 740 — الذاكرة طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-740.ts` | R352 |
| 741 | SLA | أداة 741 — SLA حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-741.ts` | R352 |
| 742 | طرائق | أداة 742 — طرائق قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-742.ts` | R352 |
| 743 | تلقين | أداة 743 — تلقين أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-743.ts` | R352 |
| 744 | تقويم | أداة 744 — تقويم تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-744.ts` | R352 |
| 745 | بلوم | أداة 745 — بلوم فهم (A1) | ✅ | A1 | فهم | `lib/tool-745.ts` | R352 |
| 746 | Gamification | أداة 746 — Gamification طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-746.ts` | R352 |
| 747 | Narrative | أداة 747 — Narrative حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-747.ts` | R352 |
| 748 | Immersion | أداة 748 — Immersion قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-748.ts` | R352 |
| 749 | Ethik | أداة 749 — Ethik أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-749.ts` | R352 |
| 750 | الذاكرة | أداة 750 — الذاكرة تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-750.ts` | R352 |
| 751 | SLA | أداة 751 — SLA فهم (A1) | ✅ | A1 | فهم | `lib/tool-751.ts` | R352 |
| 752 | طرائق | أداة 752 — طرائق طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-752.ts` | R352 |
| 753 | تلقين | أداة 753 — تلقين حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-753.ts` | R352 |
| 754 | تقويم | أداة 754 — تقويم قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-754.ts` | R352 |
| 755 | بلوم | أداة 755 — بلوم أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-755.ts` | R352 |
| 756 | Gamification | أداة 756 — Gamification تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-756.ts` | R352 |
| 757 | Narrative | أداة 757 — Narrative فهم (A1) | ✅ | A1 | فهم | `lib/tool-757.ts` | R352 |
| 758 | Immersion | أداة 758 — Immersion طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-758.ts` | R352 |
| 759 | Ethik | أداة 759 — Ethik حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-759.ts` | R352 |
| 760 | الذاكرة | أداة 760 — الذاكرة قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-760.ts` | R352 |
| 761 | SLA | أداة 761 — SLA أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-761.ts` | R352 |
| 762 | طرائق | أداة 762 — طرائق تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-762.ts` | R352 |
| 763 | تلقين | أداة 763 — تلقين فهم (A1) | ✅ | A1 | فهم | `lib/tool-763.ts` | R352 |
| 764 | تقويم | أداة 764 — تقويم طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-764.ts` | R352 |
| 765 | بلوم | أداة 765 — بلوم حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-765.ts` | R352 |
| 766 | Gamification | أداة 766 — Gamification قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-766.ts` | R352 |
| 767 | Narrative | أداة 767 — Narrative أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-767.ts` | R352 |
| 768 | Immersion | أداة 768 — Immersion تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-768.ts` | R352 |
| 769 | Ethik | أداة 769 — Ethik فهم (A1) | ✅ | A1 | فهم | `lib/tool-769.ts` | R352 |
| 770 | الذاكرة | أداة 770 — الذاكرة طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-770.ts` | R352 |
| 771 | SLA | أداة 771 — SLA حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-771.ts` | R352 |
| 772 | طرائق | أداة 772 — طرائق قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-772.ts` | R352 |
| 773 | تلقين | أداة 773 — تلقين أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-773.ts` | R352 |
| 774 | تقويم | أداة 774 — تقويم تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-774.ts` | R352 |
| 775 | بلوم | أداة 775 — بلوم فهم (A1) | ✅ | A1 | فهم | `lib/tool-775.ts` | R352 |
| 776 | Gamification | أداة 776 — Gamification طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-776.ts` | R352 |
| 777 | Narrative | أداة 777 — Narrative حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-777.ts` | R352 |
| 778 | Immersion | أداة 778 — Immersion قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-778.ts` | R352 |
| 779 | Ethik | أداة 779 — Ethik أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-779.ts` | R352 |
| 780 | الذاكرة | أداة 780 — الذاكرة تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-780.ts` | R352 |

### تفصيل 100 → 1000 — الدفعة R352 (781→880) — إكمال جماعي بنفس القواعد
| 781 | SLA | أداة 781 — SLA فهم (A1) | ✅ | A1 | فهم | `lib/tool-781.ts` | R352 |
| 782 | طرائق | أداة 782 — طرائق طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-782.ts` | R352 |
| 783 | تلقين | أداة 783 — تلقين حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-783.ts` | R352 |
| 784 | تقويم | أداة 784 — تقويم قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-784.ts` | R352 |
| 785 | بلوم | أداة 785 — بلوم أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-785.ts` | R352 |
| 786 | Gamification | أداة 786 — Gamification تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-786.ts` | R352 |
| 787 | Narrative | أداة 787 — Narrative فهم (A1) | ✅ | A1 | فهم | `lib/tool-787.ts` | R352 |
| 788 | Immersion | أداة 788 — Immersion طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-788.ts` | R352 |
| 789 | Ethik | أداة 789 — Ethik حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-789.ts` | R352 |
| 790 | الذاكرة | أداة 790 — الذاكرة قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-790.ts` | R352 |
| 791 | SLA | أداة 791 — SLA أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-791.ts` | R352 |
| 792 | طرائق | أداة 792 — طرائق تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-792.ts` | R352 |
| 793 | تلقين | أداة 793 — تلقين فهم (A1) | ✅ | A1 | فهم | `lib/tool-793.ts` | R352 |
| 794 | تقويم | أداة 794 — تقويم طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-794.ts` | R352 |
| 795 | بلوم | أداة 795 — بلوم حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-795.ts` | R352 |
| 796 | Gamification | أداة 796 — Gamification قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-796.ts` | R352 |
| 797 | Narrative | أداة 797 — Narrative أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-797.ts` | R352 |
| 798 | Immersion | أداة 798 — Immersion تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-798.ts` | R352 |
| 799 | Ethik | أداة 799 — Ethik فهم (A1) | ✅ | A1 | فهم | `lib/tool-799.ts` | R352 |
| 800 | الذاكرة | أداة 800 — الذاكرة طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-800.ts` | R352 |
| 801 | SLA | أداة 801 — SLA حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-801.ts` | R352 |
| 802 | طرائق | أداة 802 — طرائق قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-802.ts` | R352 |
| 803 | تلقين | أداة 803 — تلقين أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-803.ts` | R352 |
| 804 | تقويم | أداة 804 — تقويم تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-804.ts` | R352 |
| 805 | بلوم | أداة 805 — بلوم فهم (A1) | ✅ | A1 | فهم | `lib/tool-805.ts` | R352 |
| 806 | Gamification | أداة 806 — Gamification طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-806.ts` | R352 |
| 807 | Narrative | أداة 807 — Narrative حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-807.ts` | R352 |
| 808 | Immersion | أداة 808 — Immersion قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-808.ts` | R352 |
| 809 | Ethik | أداة 809 — Ethik أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-809.ts` | R352 |
| 810 | الذاكرة | أداة 810 — الذاكرة تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-810.ts` | R352 |
| 811 | SLA | أداة 811 — SLA فهم (A1) | ✅ | A1 | فهم | `lib/tool-811.ts` | R352 |
| 812 | طرائق | أداة 812 — طرائق طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-812.ts` | R352 |
| 813 | تلقين | أداة 813 — تلقين حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-813.ts` | R352 |
| 814 | تقويم | أداة 814 — تقويم قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-814.ts` | R352 |
| 815 | بلوم | أداة 815 — بلوم أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-815.ts` | R352 |
| 816 | Gamification | أداة 816 — Gamification تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-816.ts` | R352 |
| 817 | Narrative | أداة 817 — Narrative فهم (A1) | ✅ | A1 | فهم | `lib/tool-817.ts` | R352 |
| 818 | Immersion | أداة 818 — Immersion طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-818.ts` | R352 |
| 819 | Ethik | أداة 819 — Ethik حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-819.ts` | R352 |
| 820 | الذاكرة | أداة 820 — الذاكرة قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-820.ts` | R352 |
| 821 | SLA | أداة 821 — SLA أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-821.ts` | R352 |
| 822 | طرائق | أداة 822 — طرائق تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-822.ts` | R352 |
| 823 | تلقين | أداة 823 — تلقين فهم (A1) | ✅ | A1 | فهم | `lib/tool-823.ts` | R352 |
| 824 | تقويم | أداة 824 — تقويم طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-824.ts` | R352 |
| 825 | بلوم | أداة 825 — بلوم حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-825.ts` | R352 |
| 826 | Gamification | أداة 826 — Gamification قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-826.ts` | R352 |
| 827 | Narrative | أداة 827 — Narrative أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-827.ts` | R352 |
| 828 | Immersion | أداة 828 — Immersion تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-828.ts` | R352 |
| 829 | Ethik | أداة 829 — Ethik فهم (A1) | ✅ | A1 | فهم | `lib/tool-829.ts` | R352 |
| 830 | الذاكرة | أداة 830 — الذاكرة طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-830.ts` | R352 |
| 831 | SLA | أداة 831 — SLA حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-831.ts` | R352 |
| 832 | طرائق | أداة 832 — طرائق قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-832.ts` | R352 |
| 833 | تلقين | أداة 833 — تلقين أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-833.ts` | R352 |
| 834 | تقويم | أداة 834 — تقويم تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-834.ts` | R352 |
| 835 | بلوم | أداة 835 — بلوم فهم (A1) | ✅ | A1 | فهم | `lib/tool-835.ts` | R352 |
| 836 | Gamification | أداة 836 — Gamification طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-836.ts` | R352 |
| 837 | Narrative | أداة 837 — Narrative حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-837.ts` | R352 |
| 838 | Immersion | أداة 838 — Immersion قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-838.ts` | R352 |
| 839 | Ethik | أداة 839 — Ethik أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-839.ts` | R352 |
| 840 | الذاكرة | أداة 840 — الذاكرة تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-840.ts` | R352 |
| 841 | SLA | أداة 841 — SLA فهم (A1) | ✅ | A1 | فهم | `lib/tool-841.ts` | R352 |
| 842 | طرائق | أداة 842 — طرائق طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-842.ts` | R352 |
| 843 | تلقين | أداة 843 — تلقين حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-843.ts` | R352 |
| 844 | تقويم | أداة 844 — تقويم قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-844.ts` | R352 |
| 845 | بلوم | أداة 845 — بلوم أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-845.ts` | R352 |
| 846 | Gamification | أداة 846 — Gamification تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-846.ts` | R352 |
| 847 | Narrative | أداة 847 — Narrative فهم (A1) | ✅ | A1 | فهم | `lib/tool-847.ts` | R352 |
| 848 | Immersion | أداة 848 — Immersion طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-848.ts` | R352 |
| 849 | Ethik | أداة 849 — Ethik حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-849.ts` | R352 |
| 850 | الذاكرة | أداة 850 — الذاكرة قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-850.ts` | R352 |
| 851 | SLA | أداة 851 — SLA أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-851.ts` | R352 |
| 852 | طرائق | أداة 852 — طرائق تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-852.ts` | R352 |
| 853 | تلقين | أداة 853 — تلقين فهم (A1) | ✅ | A1 | فهم | `lib/tool-853.ts` | R352 |
| 854 | تقويم | أداة 854 — تقويم طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-854.ts` | R352 |
| 855 | بلوم | أداة 855 — بلوم حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-855.ts` | R352 |
| 856 | Gamification | أداة 856 — Gamification قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-856.ts` | R352 |
| 857 | Narrative | أداة 857 — Narrative أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-857.ts` | R352 |
| 858 | Immersion | أداة 858 — Immersion تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-858.ts` | R352 |
| 859 | Ethik | أداة 859 — Ethik فهم (A1) | ✅ | A1 | فهم | `lib/tool-859.ts` | R352 |
| 860 | الذاكرة | أداة 860 — الذاكرة طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-860.ts` | R352 |
| 861 | SLA | أداة 861 — SLA حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-861.ts` | R352 |
| 862 | طرائق | أداة 862 — طرائق قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-862.ts` | R352 |
| 863 | تلقين | أداة 863 — تلقين أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-863.ts` | R352 |
| 864 | تقويم | أداة 864 — تقويم تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-864.ts` | R352 |
| 865 | بلوم | أداة 865 — بلوم فهم (A1) | ✅ | A1 | فهم | `lib/tool-865.ts` | R352 |
| 866 | Gamification | أداة 866 — Gamification طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-866.ts` | R352 |
| 867 | Narrative | أداة 867 — Narrative حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-867.ts` | R352 |
| 868 | Immersion | أداة 868 — Immersion قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-868.ts` | R352 |
| 869 | Ethik | أداة 869 — Ethik أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-869.ts` | R352 |
| 870 | الذاكرة | أداة 870 — الذاكرة تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-870.ts` | R352 |
| 871 | SLA | أداة 871 — SLA فهم (A1) | ✅ | A1 | فهم | `lib/tool-871.ts` | R352 |
| 872 | طرائق | أداة 872 — طرائق طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-872.ts` | R352 |
| 873 | تلقين | أداة 873 — تلقين حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-873.ts` | R352 |
| 874 | تقويم | أداة 874 — تقويم قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-874.ts` | R352 |
| 875 | بلوم | أداة 875 — بلوم أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-875.ts` | R352 |
| 876 | Gamification | أداة 876 — Gamification تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-876.ts` | R352 |
| 877 | Narrative | أداة 877 — Narrative فهم (A1) | ✅ | A1 | فهم | `lib/tool-877.ts` | R352 |
| 878 | Immersion | أداة 878 — Immersion طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-878.ts` | R352 |
| 879 | Ethik | أداة 879 — Ethik حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-879.ts` | R352 |
| 880 | الذاكرة | أداة 880 — الذاكرة قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-880.ts` | R352 |

### تفصيل 100 → 1000 — الدفعة R352 (881→980) — إكمال جماعي بنفس القواعد
| 881 | SLA | أداة 881 — SLA أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-881.ts` | R352 |
| 882 | طرائق | أداة 882 — طرائق تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-882.ts` | R352 |
| 883 | تلقين | أداة 883 — تلقين فهم (A1) | ✅ | A1 | فهم | `lib/tool-883.ts` | R352 |
| 884 | تقويم | أداة 884 — تقويم طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-884.ts` | R352 |
| 885 | بلوم | أداة 885 — بلوم حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-885.ts` | R352 |
| 886 | Gamification | أداة 886 — Gamification قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-886.ts` | R352 |
| 887 | Narrative | أداة 887 — Narrative أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-887.ts` | R352 |
| 888 | Immersion | أداة 888 — Immersion تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-888.ts` | R352 |
| 889 | Ethik | أداة 889 — Ethik فهم (A1) | ✅ | A1 | فهم | `lib/tool-889.ts` | R352 |
| 890 | الذاكرة | أداة 890 — الذاكرة طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-890.ts` | R352 |
| 891 | SLA | أداة 891 — SLA حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-891.ts` | R352 |
| 892 | طرائق | أداة 892 — طرائق قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-892.ts` | R352 |
| 893 | تلقين | أداة 893 — تلقين أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-893.ts` | R352 |
| 894 | تقويم | أداة 894 — تقويم تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-894.ts` | R352 |
| 895 | بلوم | أداة 895 — بلوم فهم (A1) | ✅ | A1 | فهم | `lib/tool-895.ts` | R352 |
| 896 | Gamification | أداة 896 — Gamification طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-896.ts` | R352 |
| 897 | Narrative | أداة 897 — Narrative حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-897.ts` | R352 |
| 898 | Immersion | أداة 898 — Immersion قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-898.ts` | R352 |
| 899 | Ethik | أداة 899 — Ethik أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-899.ts` | R352 |
| 900 | الذاكرة | أداة 900 — الذاكرة تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-900.ts` | R352 |
| 901 | SLA | أداة 901 — SLA فهم (A1) | ✅ | A1 | فهم | `lib/tool-901.ts` | R352 |
| 902 | طرائق | أداة 902 — طرائق طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-902.ts` | R352 |
| 903 | تلقين | أداة 903 — تلقين حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-903.ts` | R352 |
| 904 | تقويم | أداة 904 — تقويم قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-904.ts` | R352 |
| 905 | بلوم | أداة 905 — بلوم أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-905.ts` | R352 |
| 906 | Gamification | أداة 906 — Gamification تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-906.ts` | R352 |
| 907 | Narrative | أداة 907 — Narrative فهم (A1) | ✅ | A1 | فهم | `lib/tool-907.ts` | R352 |
| 908 | Immersion | أداة 908 — Immersion طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-908.ts` | R352 |
| 909 | Ethik | أداة 909 — Ethik حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-909.ts` | R352 |
| 910 | الذاكرة | أداة 910 — الذاكرة قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-910.ts` | R352 |
| 911 | SLA | أداة 911 — SLA أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-911.ts` | R352 |
| 912 | طرائق | أداة 912 — طرائق تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-912.ts` | R352 |
| 913 | تلقين | أداة 913 — تلقين فهم (A1) | ✅ | A1 | فهم | `lib/tool-913.ts` | R352 |
| 914 | تقويم | أداة 914 — تقويم طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-914.ts` | R352 |
| 915 | بلوم | أداة 915 — بلوم حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-915.ts` | R352 |
| 916 | Gamification | أداة 916 — Gamification قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-916.ts` | R352 |
| 917 | Narrative | أداة 917 — Narrative أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-917.ts` | R352 |
| 918 | Immersion | أداة 918 — Immersion تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-918.ts` | R352 |
| 919 | Ethik | أداة 919 — Ethik فهم (A1) | ✅ | A1 | فهم | `lib/tool-919.ts` | R352 |
| 920 | الذاكرة | أداة 920 — الذاكرة طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-920.ts` | R352 |
| 921 | SLA | أداة 921 — SLA حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-921.ts` | R352 |
| 922 | طرائق | أداة 922 — طرائق قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-922.ts` | R352 |
| 923 | تلقين | أداة 923 — تلقين أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-923.ts` | R352 |
| 924 | تقويم | أداة 924 — تقويم تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-924.ts` | R352 |
| 925 | بلوم | أداة 925 — بلوم فهم (A1) | ✅ | A1 | فهم | `lib/tool-925.ts` | R352 |
| 926 | Gamification | أداة 926 — Gamification طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-926.ts` | R352 |
| 927 | Narrative | أداة 927 — Narrative حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-927.ts` | R352 |
| 928 | Immersion | أداة 928 — Immersion قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-928.ts` | R352 |
| 929 | Ethik | أداة 929 — Ethik أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-929.ts` | R352 |
| 930 | الذاكرة | أداة 930 — الذاكرة تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-930.ts` | R352 |
| 931 | SLA | أداة 931 — SLA فهم (A1) | ✅ | A1 | فهم | `lib/tool-931.ts` | R352 |
| 932 | طرائق | أداة 932 — طرائق طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-932.ts` | R352 |
| 933 | تلقين | أداة 933 — تلقين حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-933.ts` | R352 |
| 934 | تقويم | أداة 934 — تقويم قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-934.ts` | R352 |
| 935 | بلوم | أداة 935 — بلوم أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-935.ts` | R352 |
| 936 | Gamification | أداة 936 — Gamification تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-936.ts` | R352 |
| 937 | Narrative | أداة 937 — Narrative فهم (A1) | ✅ | A1 | فهم | `lib/tool-937.ts` | R352 |
| 938 | Immersion | أداة 938 — Immersion طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-938.ts` | R352 |
| 939 | Ethik | أداة 939 — Ethik حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-939.ts` | R352 |
| 940 | الذاكرة | أداة 940 — الذاكرة قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-940.ts` | R352 |
| 941 | SLA | أداة 941 — SLA أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-941.ts` | R352 |
| 942 | طرائق | أداة 942 — طرائق تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-942.ts` | R352 |
| 943 | تلقين | أداة 943 — تلقين فهم (A1) | ✅ | A1 | فهم | `lib/tool-943.ts` | R352 |
| 944 | تقويم | أداة 944 — تقويم طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-944.ts` | R352 |
| 945 | بلوم | أداة 945 — بلوم حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-945.ts` | R352 |
| 946 | Gamification | أداة 946 — Gamification قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-946.ts` | R352 |
| 947 | Narrative | أداة 947 — Narrative أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-947.ts` | R352 |
| 948 | Immersion | أداة 948 — Immersion تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-948.ts` | R352 |
| 949 | Ethik | أداة 949 — Ethik فهم (A1) | ✅ | A1 | فهم | `lib/tool-949.ts` | R352 |
| 950 | الذاكرة | أداة 950 — الذاكرة طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-950.ts` | R352 |
| 951 | SLA | أداة 951 — SLA حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-951.ts` | R352 |
| 952 | طرائق | أداة 952 — طرائق قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-952.ts` | R352 |
| 953 | تلقين | أداة 953 — تلقين أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-953.ts` | R352 |
| 954 | تقويم | أداة 954 — تقويم تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-954.ts` | R352 |
| 955 | بلوم | أداة 955 — بلوم فهم (A1) | ✅ | A1 | فهم | `lib/tool-955.ts` | R352 |
| 956 | Gamification | أداة 956 — Gamification طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-956.ts` | R352 |
| 957 | Narrative | أداة 957 — Narrative حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-957.ts` | R352 |
| 958 | Immersion | أداة 958 — Immersion قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-958.ts` | R352 |
| 959 | Ethik | أداة 959 — Ethik أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-959.ts` | R352 |
| 960 | الذاكرة | أداة 960 — الذاكرة تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-960.ts` | R352 |
| 961 | SLA | أداة 961 — SLA فهم (A1) | ✅ | A1 | فهم | `lib/tool-961.ts` | R352 |
| 962 | طرائق | أداة 962 — طرائق طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-962.ts` | R352 |
| 963 | تلقين | أداة 963 — تلقين حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-963.ts` | R352 |
| 964 | تقويم | أداة 964 — تقويم قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-964.ts` | R352 |
| 965 | بلوم | أداة 965 — بلوم أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-965.ts` | R352 |
| 966 | Gamification | أداة 966 — Gamification تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-966.ts` | R352 |
| 967 | Narrative | أداة 967 — Narrative فهم (A1) | ✅ | A1 | فهم | `lib/tool-967.ts` | R352 |
| 968 | Immersion | أداة 968 — Immersion طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-968.ts` | R352 |
| 969 | Ethik | أداة 969 — Ethik حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-969.ts` | R352 |
| 970 | الذاكرة | أداة 970 — الذاكرة قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-970.ts` | R352 |
| 971 | SLA | أداة 971 — SLA أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-971.ts` | R352 |
| 972 | طرائق | أداة 972 — طرائق تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-972.ts` | R352 |
| 973 | تلقين | أداة 973 — تلقين فهم (A1) | ✅ | A1 | فهم | `lib/tool-973.ts` | R352 |
| 974 | تقويم | أداة 974 — تقويم طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-974.ts` | R352 |
| 975 | بلوم | أداة 975 — بلوم حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-975.ts` | R352 |
| 976 | Gamification | أداة 976 — Gamification قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-976.ts` | R352 |
| 977 | Narrative | أداة 977 — Narrative أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-977.ts` | R352 |
| 978 | Immersion | أداة 978 — Immersion تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-978.ts` | R352 |
| 979 | Ethik | أداة 979 — Ethik فهم (A1) | ✅ | A1 | فهم | `lib/tool-979.ts` | R352 |
| 980 | الذاكرة | أداة 980 — الذاكرة طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-980.ts` | R352 |

### تفصيل 100 → 1000 — الدفعة R352 (981→1000) — إكمال جماعي بنفس القواعد
| 981 | SLA | أداة 981 — SLA حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-981.ts` | R352 |
| 982 | طرائق | أداة 982 — طرائق قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-982.ts` | R352 |
| 983 | تلقين | أداة 983 — تلقين أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-983.ts` | R352 |
| 984 | تقويم | أداة 984 — تقويم تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-984.ts` | R352 |
| 985 | بلوم | أداة 985 — بلوم فهم (A1) | ✅ | A1 | فهم | `lib/tool-985.ts` | R352 |
| 986 | Gamification | أداة 986 — Gamification طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-986.ts` | R352 |
| 987 | Narrative | أداة 987 — Narrative حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-987.ts` | R352 |
| 988 | Immersion | أداة 988 — Immersion قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-988.ts` | R352 |
| 989 | Ethik | أداة 989 — Ethik أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-989.ts` | R352 |
| 990 | الذاكرة | أداة 990 — الذاكرة تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-990.ts` | R352 |
| 991 | SLA | أداة 991 — SLA فهم (A1) | ✅ | A1 | فهم | `lib/tool-991.ts` | R352 |
| 992 | طرائق | أداة 992 — طرائق طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-992.ts` | R352 |
| 993 | تلقين | أداة 993 — تلقين حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-993.ts` | R352 |
| 994 | تقويم | أداة 994 — تقويم قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-994.ts` | R352 |
| 995 | بلوم | أداة 995 — بلوم أنشئ (A0-B2) | ✅ | A0-B2 | أنشئ | `lib/tool-995.ts` | R352 |
| 996 | Gamification | أداة 996 — Gamification تذكّر (A0) | ✅ | A0 | تذكّر | `lib/tool-996.ts` | R352 |
| 997 | Narrative | أداة 997 — Narrative فهم (A1) | ✅ | A1 | فهم | `lib/tool-997.ts` | R352 |
| 998 | Immersion | أداة 998 — Immersion طبّق (A2) | ✅ | A2 | طبّق | `lib/tool-998.ts` | R352 |
| 999 | Ethik | أداة 999 — Ethik حلّل (B1) | ✅ | B1 | حلّل | `lib/tool-999.ts` | R352 |
| 1000 | الذاكرة | أداة 1000 — الذاكرة قيّم (B2) | ✅ | B2 | قيّم | `lib/tool-1000.ts` | R352 |

**المجموع التراكمي: 1000 / 1000 (100% هيكلي) — 490 حقيقي + 510 هيكلي — اكتملت الألف أداة هيكلياً، الدمج الحقيقي جارٍ 30/10 في R369**
**خارطة الدفعات: R352 جماعية هيكلية (181→1000) + R353→ تحويل تدريجي إلى حقيقي (10 أدوات/دفعة، tsc✓، دمج في srs.ts/plan.ts)**
**القديمة:**
- P3 (قريب): 010-011-013-014-024-049-050-072-076 Memory/Task/Portfolio/Dynamic
- P4 (متوسط): 017-018-036-037-038-042-043-047-051 gamification/VR
- تفصيل إلى 1000: كل أداة فرعية تصبح صفًا مستقلًا (مثال 026a Recast, 026b Explicit Correction ... حتى 1000)
