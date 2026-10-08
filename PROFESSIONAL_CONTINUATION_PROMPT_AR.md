# برومبت استكمال احترافي (عربي) — wegb2 / «طريقي إلى B2»

> آخر تحديث: **2026-10-08** · الفرع: `arena/0ebbb2ce-wegb2` · القواعد الحية **R0–R113** (114 قاعدة: 98 ✅ / 16 ⚠️) · آخر بوابات دخيلة **K187a–e (R113)**؛ smoke **1183/1183**؛ interaktiv **699/699**؛ `audit:content` صفر عيوب بنيوية مؤكدة (مؤشرات H غير مانعة)؛ build نجح بتوليد 11/11 صفحة ساكنة؛ `npm audit` 0 ثغرات؛ `git diff --check` نظيف.
>
> **الحالة الحالية:** أُنجزت مراجعات الحوارات A1 `d-a1-01`–`d-a1-27` و`d-a1-31`–`d-a1-32` في 384 وحدة (R92–R101)، مع فجوة A1 `d-a1-28`–`d-a1-30` الموثقة في R102 (⚠️). وأُنجزت مراجعات الحوارات A2 R103–R112 (للعشرة نطاقات الحية d-a2-01–27 وd-a2-31–32) في 381 وحدة (339 سليمة، 30 مصححة، 12 غير محسومة)، بمجموع 530 مرجعاً بالتقارير؛ ووُثقت فجوة A2 `d-a2-28`–`d-a2-30` في R113 (⚠️ مشابه لـR102، لا محتوى بديل، K187a–e). دُفعت R112 (d-a2-25–27) إلى `origin/arena/0ebbb2ce-wegb2` في الالتزام `4d760e0`. دفعة R113 (تقرير فجوة d-a2-28–30) محلياً بانتظار الالتزام والدفع، ثم تُستأنف المراجعة مع R114 لأول ستة حوارات B1 القصيرة `d-b1-01`–`d-b1-06` (Homeoffice، Bewerbungsgespräch، Nachrichten/Streik، Umzug، Pläne/Zukunft، Termin beim Amt) بلا waisen.

---

## 1. هوية المشروع والفرع

- **المشروع:** `wegb2` — «طريقي إلى B2»، Next.js 15 + React 19 + TypeScript 5.7 محلي بالأساس لتعلّم الألمانية A0→B2 في 378 يوماً.
- **لا خادم · لا حساب · لا قاعدة بيانات**؛ التخزين في `localStorage`. الاتصالان الشبكيان المصرح بهما: تعرّف سحابي بموافقة صريحة (مغلق افتراضياً) ومصحح LLM بمفتاح المستخدم.
- **الفرع الثابت لهذه الجلسة:** `arena/0ebbb2ce-wegb2` — كل commit/push عليه فقط؛ لا تبديل فرع أو دفع إلى فرع آخر، ولا force push ولا دفع إلى `main`.
- **الدفع:** `git push origin arena/0ebbb2ce-wegb2`.

## 2. البروتوكولات الحاكمة (لا تُخالف)

- **R0 — لا اتفاق شفهياً:** أي قرار في `RULES.md` مع دليله وبوابته.
- **لا فرنسية إطلاقاً (R1/K122a)**.
- **لا تعديل إلا لخطأ مؤكد؛** الملاحظات السياقية والبدائل الأسلوبية منفصلة؛ الألماني والأسئلة والمفاتيح محمية إلا إذا كان الخطأ الألماني مؤكداً بمصدر منشور.
- **لا ادّعاء مهني/طبي/قانوني**؛ معلومات المستهلك والمواصلات والإدارة عامة مع بيان حدودها.
- **لا استماع لتسجيلات صوتية؛ لا ادّعاء صوتي** إن لم تكن الملفات موجودة.
- **لا إعادة حساب CEFR** أو نسبة المحتوى أو المستوى.
- **الرقعة قابلة لإعادة التطبيق بلا أثر جانبي** (مرتان = صفر تغيير).
- **عند اكتشاف فجوات أرقام المعرفات** (مثل d-a1-28–30 وd-a2-28–30)، وثّقها في تقرير فجوة منفصل بدل إنشاء محتوى بديل أو إسناد بطاقات يتيمة بالتخمين.

## 3. الخطوة الفورية: إنهاء R113 ثم R114

1. **اعتماد ودفع R113 (فجوة d-a2-28–30):** الملفات المحلية جاهزة (تقريرا JSON/Markdown، مولد التقرير، بوابات K187a–e، تحديثات RULES/HANDOFF/qualitaet/produktionsplan/continuation-prompt). شغّل البوابات الكاملة ثم commit وادفع:
   - البوابات: `./node_modules/.bin/tsc --noEmit` → `npm run smoke` → `npm run interaktiv` → `npm run audit:content` → `npm run build` → `npm audit` → إعادة أي رقعة إن وُجدت → `git diff --check`.
   - commit: `git add -A && git commit -m "R113: document A2 gap d-a2-28..d-a2-30 (K187a-e)"`
   - `git push origin arena/0ebbb2ce-wegb2`.
2. **بعدها R114 — أول دفعة B1 (`d-b1-01`–`d-b1-06`):**
   - **النطاق الحي:** d-b1-01 Homeoffice، d-b1-02 Bewerbungsgespräch، d-b1-03 Nachrichten am Morgen (Streik)، d-b1-04 Beim Umzug helfen، d-b1-05 Pläne für die Zukunft، d-b1-06 Termin beim Amt.
   - **بنية الحوارات:** قصيرة (5–6 أسطر، سؤالان، 3 إملاءات لكل حوار) **وبلا حقل waisen**، فلا تدقيق لمفردات يتيمة؛ الوحدات = 6 بيانات + 31 سطر + 12 سؤال + 18 إملاء = **67 وحدة** (تحقّق من الأعداد الحية).
   - **المصادر التمهيدية:**
     - Homeoffice: Bitkom (45% يعملون عن بعد جزئياً، 55% يفقدون التواصل)، Deutschlandfunk/HSU Hamburg (Flexibilität 71% HO vs 54.2% Büro، Isolation 32.9%، 55.2% يفتقدون الاتصال) — تسند رأي تيم «verliert den Kontakt» ورأي مارا «Flexibilität überwiegt» كرأيي الشخصيتين دون ادعاء حقيقة مطلقة.
     - Bewerbungsgespräch: تعبير «Ich drücke dir die Daumen» = أتمنى لك التوفيق (Duden/TheLocal/deutsch-mentor) — لا يُترجم حرفياً.
     - Streik: ADAC/24Rhein/Zeit تؤكد إضرابات GDL 2024 على السكك الحديدية والتوصل إلى اتفاق؛ «Züge fahren nicht، Verhandlungen، Lösung، mit dem Rad fahren» واقعية.
     - Umzug: stern/reddit تؤكد تقليد بيتزا للمتطوعين وثقل الكتب ووقوف الكراتين في الممر؛ «mein Angebot» بمعنى «على حسابي».
     - Termin beim Amt: amtsdeutschland.de/handbookgermany.de تؤكد Anmeldung خلال 14 يوماً وأن **Mietvertrag وحده لا يكفي** (يَلزم Wohnungsgeberbestätigung من المؤجر). الألماني في الحوار «Eine Meldebescheinigung wäre noch nötig» هو تبسيط دراسي/سهو لغوي (المستلم Meldebescheinigung هو ما يُعطى بعد التسجيل لا ما يُنقص)، لكن مفتاح السؤال يظل «Meldebescheinigung» محمياً؛ سجّل كملاحظة سياقية ولا تعدّل الألماني.
   - **تصحيحات عربية متوقعة (تحقّق قبل التطبيق):** d-b1-01.lines[3].ar «لوفّقت» غير دقيقة مقابل «würde ich zustimmen» → «لوافقتُ» (أو لكنت وافقت). راقب مطابقة الضمائر/الصياغة الرسمية «Sie» (تُترجم بصيغة الجمع «أنتم/بكم» كما في الحوارات السابقة).
   - **خطوات التنفيذ:** رقعة `scripts/patches/review_b1_dialogues_01.py` حرِسة (EXPECTED تقفل DE/who/questions/dictation)، تقرير `scripts/patches/report_b1_dialogues_01.py` ينتج `docs/content-review-b1-dialogues-01-2026-10-08.{json,md}` مع 67 وحدة، 40 مصدراً مناسباً، contextNotes/styleAlternatives، audio، limits، وبوابات K188a–j في `scripts/engine_smoke.ts`.
   - البوابات الكاملة + تحديث التوثيق (RULES/HANDOFF/qualitaet/produktionsplan/continuation-prompt) + commit + push + present_file تقرير Markdown.

## 4. دروس حديثة لا تكررها

- **K187:** استخدم `containsAnyMissingId` (camelCase) في JSON.
- **عبارات الطباعة في الرقعة:** البوابة تبحث عن «<Rnnn> patch complete» حرفياً.
- **صياغة حدود المراجعة البشرية:** «ليست مراجعة بشرية» (تطابق K71/K163).
- **عند إعادة ضبط المستودع إلى origin، أعد `npm install` إذا لزم (تحقّق من وجود `node_modules` أولاً).**
- **السهو الألماني في سياق دراسي (كـMeldebescheinigung ناقصاً بدل Wohnungsgeberbestätigung) يُسجّل كملاحظة سياقية ولا يُعدَّل إذا كان المفتاح محمياً.**

## 5. حدود واضحة

- لا يُعاد تقييم CEFR أو النسبة أو الحساب.
- لا استماع لتسجيلات أو توليد صوت جديد.
- المراجعة مؤازرة بمصادر منشورة وليست بشرية أو اعتماداً مهنياً/طبياً/قانونياً.
- لا تحذف أو تنقل جذر المستودع أو `.git`.
