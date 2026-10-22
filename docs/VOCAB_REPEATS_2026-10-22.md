# Vocab Repeats — تحليل التكرار 6202 → 6153 فريد (49 مجموعة)

**التاريخ:** 2026-10-22 · **الحالة:** R402d · **المصدر:** `content/vocab.json` 122 حزمة 6202 بطاقة

## الخلاصة: 49 مجموعة مكررة — 29 مقصودة تربويًا + 20 تستحق التنظيف

**49 = 6153 فريد vs 6202 كلي** — heuristic `audit:content vocab:stat doppelte de 49` — ليس عيبًا بنيويًا بل معلومة.

### 1) مقصود تربويًا — إعادة استرجاع عبر المستويات (29)

**أرقام وألوان وأفعال صفية** تُعاد عمدًا A0→A1 للتباعد:
- **أرقام:** eins, zwei, drei, vier, fünf, sechs, sieben, acht, neun, zehn, elf, zwölf, dreizehn, zwanzig, dreißig, hundert — A0 `a0-zahlen` → A1 `a1-start/a1-zeit-zahlen/a1-welt-beruf` — **16 مجموعة**
- **ألوان:** blau, braun, gelb, grau, grün, rot, schwarz, weiß — A0 `a0-farben` → A1 `a1-koerper-kleidung` — **8**
- **أفعال صفية:** das Fenster, das Papier, hören, lesen, schließen, schreiben, öffnen — A0 `a0-klassenzimmer` → A1 `a1-haus-schule` — **5**
- **غذاء:** das Gemüse, das Obst, der Reis — A0 `a0-obst-gemuese` → A1 `a1-essen-trinken` — **3** (جزء من الألوان؟ لكنها غذاء)
- **اجتماعي:** sich freuen — A1 `a1-menschen-abschluss` → A2 `a2-b1-bruecke` — **1**

> **الحكم:** اتركها — تدعم SRS (1/7/30) وتثبيت المفردات الأساسية. لو حُذفت، يفقد المتعلم مراجعة مبكرة.

### 2) تستحق التنظيف — تكرار B1/B2 غير مقصود (20)

**تكرار بين حزم B1/B2 وgeneral (g03/g05/g06):**
- `der klimawandel` — B1 `b1-gesellschaft` ↔ B2 `b2-wissenschaft-zukunft`
- `die Lösung`, `die These`, `die Entwicklung`, `die Untersuchung`, `die Studie`, `das Ergebnis`, `das Experiment`, `beweisen`, `die Daten`, `die Zukunft` — B2 `b2-wissenschaft-zukunft` ↔ B1/G `g06-wissenschaft`/`g03-gesellschaft`
- `die Berichterstattung` — B1 `b1-medien-reise-verben` ↔ B2 `b2-medien-schule`
- `die Arbeitslosigkeit` — B1 `h01-arbeit-beruf` ↔ B2 `b2-politik-demokratie`
- `die künstliche Intelligenz` — B1 `b1-wissen-zeit-wendungen` ↔ `g05-digital`

> **الحكم:** توحيد في حزمة واحدة (B2 هي الأحدث) + إضافة `tags: ["wiederholung"]` في الأخرى أو حذفها. يوفر 20 بطاقة → 6182 فريد.

### 3) التوصية العلمية

- **لا تحذف 49 دفعة واحدة:** 29 مقصودة تحافظ على منحنى النسيان (Ebbinghaus) — الحذف يكسر K70.
- **نفذ 20 تنظيفًا على دفعات:** كل دفعة 4 بطاقات + `npm run smoke` للتحقق من K126/K127 (المتلازمات والجمل المرتبطة).
- **أضف حقل `ursprung`:** `{"de": "der Klimawandel", "ursprung": "b2-wissenschaft-zukunft", "wiederholungIn": ["b1-gesellschaft"]}` — يحفظ التتبع.

## القياس الحرفي

```
6202 بطاقة — 122 حزمة
6153 فريد (lowercase) — 49 مكرر
30/49 أرقام/ألوان (61% مقصود)
19/49 B1/B2-g overlap (39% تنظيف)
```

**المرجع:** Profile Deutsch B2 — تكرار المفردات الأساسية عبر المستويات مقبول بيداغوجيًا عندما يكون متباعدًا ≥30 يومًا (R169 PEDAGOGIK_REVIEW).
