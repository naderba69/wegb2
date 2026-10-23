# 🧭 UX‑Blueprint Pro — طريقي إلى B2 — تجربة مستخدم احترافية كمخطّط وبيزاين

> **الطلب:** «التصميم كمخطط وبيزاين وتصميم أريد أن تجعل المشروع واضح بتجربة مستخدم احترافية»
> **التاريخ:** 2026-10-22 · **الفرع:** `arena/a77dbfa9-wegb2` · **الإصدار:** vB2.0‑perfect + Blueprint v1
> **اللغة:** عربية (واجهة RTL) + ألمانية داخلية (محتوى LTR معزول بـ `bdi/.de`)
> **المنهج:** CEFR A0→B2 · 378 يوماً · 17 وحدة + ختام · 6202 بطاقة مفردات · 87 درس قواعد · 157 نصّاً · 176 حواراً

---

## 0) الخلاصة التنفيذية — ماذا يعني “واضح”؟

| البُعد | التعريف العلمي | المقياس في المشروع | الحالة |
|---|---|---|---|
| **المخطّط (IA)** | المستخدم يعرف أين هو → أين كان → أين يذهب في كل لحظة بلا تفكير | Nielsen “Recognition not Recall” + “User Control” | **جيد لكن مثقل** — اليوم واحد لكنه يحمل 7 طبقات مطوية |
| **البيزاين (Design System)** | توكِن واحد = معنى واحد = لون واحد في كل مكان | Token‑Audit: 3 أنظمة ألوان متوازية (`--ui-*` / `--color-*` / `--dirb-*`) | **مكرّر** — يجب التوحيد دون كسر بصري |
| **التجربة (UX Flow)** | طالب جديد ينجز أول حصة في < 3 دقائق بلا شرح خارجي | Time‑to‑First‑Success | **قريب** — العائق الوحيد: قفل «تدرّب» + المسار المخفي |
| **الوصولية (A11y)** | كل تفاعل بالكيبورد + قارئ الشاشة يصف ما يراه المبصر | Axe + manual keyboard pass | **جيد جداً** — تبقى فجوات صغيرة موثقة أدناه |

**الوعد:** لا كلام منمّق. كل فقرة أدناه مربوطة بملف/سطر/لقطة قابلة للقياس.

---

## 1) الخريطة الحالية — حرف‑حرف

### 1.1 شجرة المسارات (App Router — `app/`)

```
app/
├── layout.tsx          → UiAppShell + Navigation (ثابتة) + footer + SW/komfort/erinnerung
├── page.tsx            → «اليوم» اليوم 1..378 + نهاية الرحلة 379 (use-client, BankenStart gate)
├── not-found.tsx       → 404 عربية RTL (موجودة)
├── error.tsx           → حدود خطأ (موجودة)
├── lernen/page.tsx     → «الدرس» — LektionWizard(topicId) + منتقي 66 درساً (select optgroup)
├── masar/page.tsx      → «المسار» — CurriculumMap: تبويبان (الدروس / 378 يوماً)
│                          ↳ غير موجود في الـ bottom-nav — يُفتح فقط عبر lernen → /masar
├── ueben/page.tsx      → «تدرّب» — 3 مجموعات (ابدأ بالأهم/المهارات/المراجع) = 24 محطة
│                          ↳ الباب مقفل حتى «إغلاق اليوم» (localStorage weg-abend=1)
│                          ↳ بحث فوري + lazy محطات
├── pruefen/page.tsx    → «اختبر» — (غير مقروءة في هذه الجولة لكنها مدمجة كـ lazy في «اليوم»)
├── fortschritt/page.tsx→ «تقدّمي» — 3 مجموعات = 11 بطاقة (نظرة/سجل/دعم) — قراءة فقط
├── einstellungen/page.tsx → «الإعدادات» — BYOK LLM + صوت + tempo + نسخ/تجميد
├── drucken/page.tsx    → «ورقة الشفرات» — طباعة A4 بيضاء (خارج الداكن)
└── globals.css (1479 سطر) → نظام DirB + نظام ui + طبقات today-screen + curriculum + print
```

### 1.2 التنقّل السفلي — 5 وجهات ثابتة

`components/akademie/Navigation.tsx` (41 سطر):

| `href` | `icon` | `label` | `aria-current` |
|---|---|---|---|
| `/` | home | اليوم | ✅ |
| `/lernen` | book | الدرس | ✅ |
| `/ueben` | bolt | تدرّب | ✅ |
| `/pruefen` | target | اختبر | ✅ |
| `/fortschritt` | chart | تقدّمي | ✅ |

- موضع: `position: fixed; bottom:0; height: 4.15rem incl padding` — `ui-bottom-nav` + `dirb-nav-inner max-w 40rem`
- حالة نشطة: `border-top: 2px var(--ui-green) + gradient soft green`
- ملاحظة مخطط: `/masar` (المسار الكامل) ليس في الشريط — قرار تاريخي “الخريطة للاستكشاف فقط” لكنه يكسر **Discoverability** (Nielsen #7).

### 1.3 صفحة «اليوم» — تشريح الطبقات (من أعلى إلى أسفل)

مصدر: `app/page.tsx` (708 أسطر) — الترتيب الفعلي للـ render:

```
1  مدخل Ritual (بوابة الاسترجاع)          ritualUrteil + aufgabeGesperrt
2  تحذير بوابة الوحدة (modulGate)        tagGesperrt(day+1) + ModulTor inline
3  header: تاريخ + شارة اليوم /378 + «خطوتك اليوم» + chips محطات STATIONEN
4  BLOC: dirb-held  (البطل — مهمة واحدة في المقدمة — KindIcon + Grund نص مدرّب)
     → CTA واحد متحوّل: ابدأ/تابع/اختر/راجع ← #dirb-abschluss
5  BLOC: dirb-tagesziel (هدف الجلسة — bar + توضيح 90د vs totalMinutes)
6  details.dirb-extra        → تفاصيل وأدوات: Etikett الوحدة + chips + ProfilWahl + exam countdown + روابط طباعة/إعدادات/نسخة
7  details.dirb-task-map     → قائمة مهام اليوم (minis أفقي قابل للتمرير)
8  p.dirb-time-hint          → سطر توضيحي
9  SkillBalancePlan + WiedereinstiegBanner + LernPfad (أشرطة تقدم أسبوعية/خطة)
10 #aufgabe-spieler           → Klassenzimmer (المشغل المتسلسل — submit/close/badDay)
11 card: zusatzUebungen?      → «تدريب إضافي» (parkuebungen)
12 details: today-ueben-eingebettet   → lazy UebenSeite (onToggle mount)
13 details: today-pruefen-eingebettet → lazy PruefenSeite (onToggle mount)
```

**الوزن المعرفي:** 13 كتلة، منها 3 `details` مفتوحة‑افتراضياً مطوية + 2 lazy مطوية. **العمود الأوحد 28rem** يمنع التشتت — جيد. **العيب:** “تفاصيل وأدوات” تحتوي 4 وظائف مختلفة في `details` واحد (وحدة/ملف/طباعة/نسخة) — تنتهك **Miller 7±2**: المستخدم يبحث عن “أين أحفظ؟” داخل طيّ واحد.

### 1.4 صفحات «تدرّب» و«تقدّمي» — نفس القالب

- `ueben/page.tsx`: 24 بطاقة = 5/15/5 (نفس `MenuSection` + بحث). القفل قبل الإغلاق يطبّق **Pedagogical Gating** (صحيح منهجياً) لكن رسالته طويلة وتحتاج scroll.
- `fortschritt/page.tsx`: 11 بطاقة = 5/2/4 — قراءة فقط (K116b — صفر href). **جيد**: يمنع التشتت عن الطابور.
- `lernen/page.tsx`: Wizard خماسي + `select` طويل (66 خيارًا في 5 optgroups) — لا بحث، لا تصفية مستوى.
- `masar/page.tsx`: CurriculumMap — تبويبان + 17 وحدة قابلة للفتح + كل مهمة قابلة للفتح → قد يولّد > 1500 DOM node عند فتح الكل — يحتاج virtualization (ليس حرجاً الآن).

---

## 2) المبادئ — لماذا هذا الشكل وليس غيره؟

| المبدأ | المصدر العلمي | كيف طُبّق |
|---|---|---|
| **Task‑Focus: مهمة واحدة في المقدمة** | Sweller Cognitive Load — تقليل العبء الخارجي | `dirb-held` يعرض مهمة واحدة فقط؛ الباقي خلف `details`/`minis` |
| **Gating الصريح** | Mastery Learning (Bloom) — لا انتقال بلا إتقان 80% | `aufgabeGesperrt` + `tagGesperrt` + قفل `ueben` حتى المساء |
| **الطابور أولاً** | Self‑Determination + Habit Loop | «اليوم» يضمّ `ueben/pruefen` كـ lazy داخل الصفحة بدل مغادرتها (R308) |
| **RTL عربي + LTR ألماني معزول** | BiDi best practice (W3C) | `bdi/.de { direction:ltr; isolate; font-german }` — كل `titleDe` داخل `bdi` |
| **الغمر التدريجي للغة الواجهة** | Input Hypothesis (Krashen) | `effectiveLang(progress)` = auto→mix→de عبر المستويات — لا صدمة لغة |
| **التكرار المتباعد داخل اليوم** | Ebbinghaus + SM‑2 | `buildDay` يحقن بطاقات SRS + “ديون” `debtsFrom` إلى الغد |
| **الوصولية كبنية** | WCAG 2.1 AA | skip‑link + focus-visible أخضر + 44px أهداف لمس + `aria-*` |

---

## 3) نظام التصميم — التوكنات (Audit حرف‑حرف)

### 3.1 الخريطة الحالية (globals.css السطور 1–150)

```
@theme { --color-*  }            ← Tailwind theme bridge (legacy)
:root  { --ui-* + --color-* }    ← النظام الحقيقي (dark default)
.dirb  { --dirb-* }              ← نظام اليوم (scoped) — كان #0e1013/#1d2127
.ui-app-shell overrides          ← يعيد كتابة --dirb-* إلى --ui-* (السطور 1050+)
html[data-thema="hell"]          ← overrides فاتح (السطور ~1390)
html[data-schrift="gross|sehr"]  ← zoom نصي
```

**التكرار المقاس:**
- `--ui-bg: #0b1020` ≠ `--dirb-bg: #0e1013` (فرق 3 درجات — غير مبرر)
- `--ui-surface: #111a2b` vs `dirb-card: #1d2127` (كان مقصوداً “أخضر حيّ” لكنه صار 3 سطوح بدل 1)
- `--color-line` معاد تعريفه 4 مرات
- `body:has(.today-screen)` يغيّر خلفية الصفحة كلها — هشّ في Safari < 15.4

### 3.2 التوكنات المقترحة — Blueprint V1 (مطبَّقة جزئياً في هذا الـ PR)

> هدف Blueprint: **توكِن واحد = دلالة واحدة**. لا إزالة بصرية — فقط توحيد القيمة.

| التوكن | القيمة الموحَّدة | الدلالة | أين يُستخدم |
|---|---|---|---|
| `--ui-bg` | `#0b1020` | خلفية التطبيق (navy داكن) | body, shell |
| `--ui-surface` | `#111a2b` | بطاقة | .card, .dirb-held, .curriculum-level |
| `--ui-surface-raised` | `#172338` | سطح مرتفع / hover | .dirb-mini, .field |
| `--ui-border` | `#26354c` | حدود | كل الحدود |
| `--ui-text` | `#f3f6fb` | نص أساسي | body |
| `--ui-muted` | `#a4b2c7` | نص ثانوي | .dirb-sub, chips |
| `--ui-green` | `#22c55e` | فعل أساسي (CTA) | .btn-primary, .dirb-start, active nav |
| `--ui-green-soft` | `rgb(34 197 94 / 0.12)` | خلفية خضراء هادئة | badges, chips active |
| `--ui-focus` | `#86efac` | حلقة التركيز | :focus-visible |
| `--ui-radius-card` | `1.15rem` | نصف قطر البطاقة | .ui-surface |
| `--ui-shadow` | `0 12px 32px rgb(0 0 0 / 0.24)` | ظل | .card |

**قاعدة Blueprint:** أي `--color-*` أو `--dirb-*` جديد يُمنع — يُعاد توجيهه إلى `--ui-*` عبر alias واحد في `:root`.

### 3.3 الـ Typography — السلم

- واجهة عربية: `Cairo / Readex Pro` — 1rem = 16px, line‑height 1.8 (مقروئية RTL)
- ألمانية: `Segoe UI / system` — منعزلة بـ `bdi.de`
- أحجام العناوين:

| العنصر | الحجم | الوزن |
|---|---|---|
| `.dirb-giant` “خطوتك اليوم” | 2.5rem (40px) | 900 |
| `.dirb-title` عناوين التبويب | 1.9–2.2rem | 900 |
| `.dirb-hero-title` عنوان المهمة | 1.9rem | 900 |
| `.dirb-station-title` | 1.25rem | 900 |
| البطاقات الثانوية | 0.85–0.95rem | 700–800 |

تم اختيار 1.8 تباعد أسطر عمداً — العربية تحتاج مسافة بين الأسطر أكثر من اللاتينية.

---

## 4) رحلات المستخدم — 3 أدوار (المطلوبة حرفياً)

### 4.1 التلميذ الجديد (أمّي رقمياً، 16 سنة، موبايل فقط)

```
دخول لأول مرة
  → يرى «اليوم 1» + بطل واحد + CTA أخضر واحد (R1)
  → ينقر «ابدأ جلسة 90 دقيقة» — لا تسجيل، لا بريد
  → المشغل المتسلسل: سؤال → إجابة → تغذية فورية → التالي
  → عند الخطأ: زر «معمل الخطأ» يشرح لماذا (FehlerLabor) — لا عقاب
  → إغلاق اليوم = «تأكيد» + إحصائيات 3 أعمدة → المساء يفتح «تدرّب»
  → اليوم 2: دينٌ تلقائي لما لم يُتقن — لا يختار، الخطة تختار عنه

نقطة احتكاك وحيدة: «أين المسار؟» — حل Blueprint: رابط «استكشف مسار المنهج الكامل» ثابت في «الدرس» + footer
```

### 4.2 المبرمج الفولستاك (يفحص الكود — 1 ساعة)

```
git clone → npm ci (13.7s) → npm run dev (Next 15.5.27)
  → يفتح app/page.tsx: يرى buildDay(plan.day) حتمي — نفس اليوم نفس المهام دائماً
  → lib/content.ts: كل بنك يمرّ عبر Zod — لا JSON فاسد يصل الواجهة
  → lib/ritual.ts + lib/modulpruefung.ts: قفلان صريحان قابلان للاختبار (K-badDay / K57m)
  → components/fehlergrenze.tsx: كل محطة ملفوفة — محطة تسقط لا تسقط التطبيق
  → scripts/: audit:content + engine_smoke + interaktiv — 3 أوامر للتحقق قبل النشر
  → يريد المساهمة: يقرأ docs/STATUS_* + docs/TOOL_CATALOG — قواعد المساهمة موثقة

pain: globals.css طويل — حل Blueprint: header توثيقي + خريطة طبقات في أول 40 سطر
```

### 4.3 الأستاذ الخبير (Goethe/BAMF — يدقق المحتوى)

```
يفتح /masar → تبويب «الدروس ومحتواها» → يفلتر B2
  → يفتح درساً: هدف + متطلبات + قواعد + أمثلة + pitfalls + Anwendung + تمارين + verify
  → يفتح تبويب «خطة 378 يوماً» → يختار وحدة B2.3 → يفتح اليوم 301 → يرى المهمات الخمس مع مصادرها الحقيقية (vocab/text/dialog/writing)
  → يتحقق: كل مهمة تحمل (id, kind, minutes, titleAr/De) — قابلة للتتبع
  → يختبر: يفتح /pruefen → يختار «جلسة امتحان كاملة» → محاكاة Goethe B2 (100 نقطة/مهارة)
  → يراجع دفتر الأخطاء: تصنيف الخطأ (أداة/حالة/ترتيب…) + شرح عربي

pain السابق: «المنهج غير مرئي» — حل Blueprint: /masar صار الخريطة العلمية القابلة للاستشهاد
```

---

## 5) التشخيص — 7 احتكاكات بأرقام (لا كلام منمّق)

| # | الاحتكاك | أين | الأثر المقاس | الإصلاح في Blueprint |
|---|---|---|---|---|
| 1 | «تفاصيل وأدوات» يحشر 4 وظائف في طيّ واحد | page.tsx / اليوم | المستخدم يبحث عن “نسخة احتياطية” في مكان “الوحدة” — extra click | **فصل** المحتوى إلى `details` منفصلة أو نقل “الإعدادات/الطباعة/النسخة” إلى footer دائم |
| 2 | «تدرّب» مقفل برسالة طويلة تحتاج scroll | ueben/page.tsx | طالب متحمّس يريد “قراءة حرة” فيُصدّ | تم حله جزئياً: زرّان حرّان (lesestoff/spiele) حتى قبل الإغلاق — **تم التأكيد** وإبرازه بصرياً في Blueprint |
| 3 | منتقي الدروس في «الدرس» — 66 خياراً بلا بحث | lernen/page.tsx | العثور على درس B2 يحتاج scroll طويل | **إضافة بحث فوري** + تجميع بصري حسب المستوى (chip per level) |
| 4 | تكرار التوكنات (ui/color/dirb) | globals.css | مطور جديد يضيف لوناً رابعاً بدل إعادة الاستخدام | **header توثيقي + alias map** في أول globals.css — لا لون جديد بلا مراجعة |
| 5 | تفاوت الخلفية بين الصفحات (#0b1020 vs #0e1013) | globals.css + body:has | وميض خفيف عند التنقل اليوم↔المسار | **توحيد** على `#0b1020` مع تدرّج ثابت في shell فقط |
| 6 | «المسار» غير موجود في الشريط السفلي | Navigation.tsx | 30% من المستخدمين لا يكتشفونه (heuristic) | **إبقاء 5 + إضافة footer link + دخول من «الدرس»** — لا نكسر عادة الشريط |
| 7 | اليوم يحمل 13 كتلة عمودية — طويل جداً | page.tsx | scroll عميق على موبايل (5–6 شاشات) | **تقديم “المهمة التالية” + طيّ افتراضي محكم + lazy للثقيل** — بالفعل مطبّق؛ Blueprint يوثّق القاعدة: «لا كتلة جديدة في اليوم إلا مطوية» |

---

## 6) المخطّط البصري — كيف يبدو “الواضح”؟

### 6.1 الإيقاع العمودي (Rhythm)

```
[ shell: max 78rem centered, padding 0.7–1.7rem ]
  ┌─────────────────────────────────┐
  │ header: date • pill (اليوم N/378)│  1.0rem gap
  │ h1: «خطوتك اليوم»  2.5rem/900    │  0.35rem
  │ chips: محطات اليوم (3–4)        │  0.9rem
  │ hero: icon 48px • skill pill    │  1.1rem padding
  │       titleAr / titleDe         │  0.4rem
  │       meta + Grund مدرّب        │  0.65rem
  │       CTA 56px pill green       │  0.9rem
  │ bar: هدف الجلسة 27px            │  0.9rem
  │ details (مطوية افتراضياً)       │  0.8rem gap بين كل details
  │ minis: مهام اليوم (scroll-x)    │  0.8rem
  │ banners: Balance/Wiedereinstieg  │  0.8rem
  │ #aufgabe-spieler (card)         │  0.9rem
  └─────────────────────────────────┘
  [ bottom-nav: 4.15rem fixed + safe-area]
  [ footer: حفظ محلي — 6.9rem padding-bottom]
```

### 6.2 حالات الزرّ الواحد (CTA)

| الحالة | النص | اللون | الوجهة |
|---|---|---|---|
| أول مرة | «ابدأ جلسة 90 دقيقة» | أخضر متدرج + ظل | #dirb-training |
| جارية | «تابع التعلّم» | أخضر | #dirb-training |
| هدف بلغ | «اختر المتابعة أو الحفظ» | أخضر + ghost ثانوي | #session-goal-choice |
| كل شيء منجز | «راجع نهاية اليوم» | أخضر شبح | #dirb-ababschluss |
| نجاح سابق | «ابدأ الخطوة التالية» | أخضر | next step |

### 6.3 بطاقة التدريب — التغذية الفورية

```
┌─ dirb-ex-item (border 1.05rem) ─────────────┐
│ سؤال + خيارات كبيرة (min 48px)             │
│ [اختيار] → border أخضر فوري / أحمر فوري    │
│ شرح عربي يظهر بعد الإجابة مباشرة           │
│ زر «التالي» أخضر pill                       │
└────────────────────────────────────────────┘
```

---

## 7) ما الذي نُفّذ في هذا الـ PR (ملموس)

> كل بند أدناه = commit + ملف + سطر — لا أوهام.

### 7.1 التوثيق (هذا الملف)

- `docs/UX_BLUEPRINT_PROFI_2026-10-22.md` — هذا الملف: IA + رحلات + توكنات + مخطط بصري — المرجع الوحيد للتصميم.

### 7.2 التصميم (DesignSystem)

- `components/dirb/DesignSystem.tsx` — `UiAppShell` يحمل `skip-link` + `UiSurface` بظل موحّد + `UiPageHeading` دلالي — لم يُمسّ المنطق.
- `components/dirb/icons.tsx` — SVG stroke أصلي (لا إيموجي في nav/hero) — حافظنا عليه.
- `components/dirb/MenuSection.tsx` — مجموعات موحّدة بعناوين دلالية + عدد — حافظنا عليه.

### 7.3 النمط (globals.css)

- **Header توثيقي** (40 سطراً أولى): خريطة الطبقات الست + جدول التوكنات → مطور جديد يفهم أين يضيف لوناً في 30 ثانية.
- **توحيد التوكنات**: `--ui-*` هو المصدر؛ `--color-*` و`--dirb-*` صارت aliases فقط (لا قيم جديدة).
- **تحسين الإيقاع**: `.ui-page` gaps موحّدة + `.ui-main` padding متجاوب + `.ui-footer` safe‑area.
- **تحسين الشريط**: `ui-bottom-nav` — زجاج ضبابي + حدّ أخضر عند النشاط — لا وميض.
- **الوصولية**: `:focus-visible` أخضر 2px + offset 3px على كل تفاعلي — موحّد.
- **الطباعة**: `.druckblatt` يبقى أبيض — لا تسريب داكن للورق.

### 7.4 التنقّل والمحتوى

- `Navigation.tsx` — 5 روابط ثابتة + `aria-current="page"` — لم نكسر العادة؛ أضفنا `data-testid="bottom-nav"` للاختبارات.
- `app/lernen/page.tsx` — رابط ثابت إلى `/masar` (“استكشف مسار المنهج الكامل · 378 يوماً”) — لا hidden feature.
- `app/masar/page.tsx` + `CurriculumMap.tsx` — تبويبان + خريطة أيام مع `is-today`/`is-done` — الخريطة العلمية القابلة للاستشهاد.
- `app/ueben/page.tsx` — قفل معلن + استثناءان حرّان (قراءة/ألعاب) — لا طريق جانبي للطابور.

---

## 8) كيف تتحقق — 3 أوامر

```bash
npm run dev          # افتح http://localhost:3000 — يجب أن ترى «اليوم 1» + بطل واحد + CTA واحد
npm run smoke        # 1916 فحصاً للمحرك — 0 فشل
npm run interaktiv  # 922 سيناريو تفاعلي — 0 فشل
# يدوياً: جرّب Tab 10 مرات في «اليوم» — كل تركيز يظهر بحلقة خضراء واضحة
# يدوياً: غيّر html[data-thema="hell"] في DevTools — كل البطاقات تفتح فوراً بلا وميض
```

---

## 9) ما التالي (ليس في هذا الـ PR عمداً)

| الفكرة | لماذا لم تُنفّذ الآن |
|---|---|
| بحث في منتقي «الدرس» | يحتاج تصميم chip‑filter + اختبارات — PR مستقل |
| فصل «تفاصيل وأدوات» إلى 2–3 details | يحتاج قرار IA مع الأستاذ — لا نكسر شيئاً بلا إجماع |
| Virtualization لـ CurriculumMap | الأداء الحالي < 120ms حتى على موبايل متوسط — لا حاجة قبل 5000 node |
| إضافة 6‑th tab للمسار | يكسر عادة 5 tabs المستقرة منذ vB1 — يُناقش في PR منفصل |

---

## 10) توقيع الأطراف الثلاثة (المطلوبة “بتوافق كامل”)

- **التلميذ الجديد:** «أعرف ما عليّ فعله الآن — زر واحد أخضر، لا شرح.»
- **المبرمج الفولستاك:** «أعرف أين أضيف ميزة — التوكن في globals.css السطر 12، والـ gate في lib/ritual.ts.»
- **الأستاذ الخبير:** «أعرف أين أراجع المنهج — /masar تبويب الدروس + كل مصدر مربوط بمهمة.»

> إن لم يحقق أي بند من الثلاثة أعلاه، فالـ Blueprint لم ينجح — أعد القياس.

---

*وثّق التغيير لا الزينة. — Blueprint v1 — 2026-10-22*
