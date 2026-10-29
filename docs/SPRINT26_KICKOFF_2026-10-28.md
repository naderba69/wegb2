# Sprint 26 Kickoff — P3 البداية — 2026-10-28

**الفرع:** `arena/072e8337-wegb2` من `1261615` (main بعد PR#26 — P2 مغلقة)
**الحالة:** `tsc0 build17/17 smoke1916/0 interaktiv922/0 audit:content 0` — ورثناها خضراء من `f101540/b4c6d90/1261615`
**المالك:** naderba69 — أداة شخصية 378 يوم — لا حرف يُحذف

---

## 1 — من أين نبدأ؟ (بعد P2)

تم إغلاق `P0 11/11` و `P1 34/34` و `P2 52/52` في `docs/P2_CLOSURE_2026-10-28.md`.
بقي `P3 منخفضة 30` + `IDEENKATALOG 1278→1263` (تحسين مستمر). المبدأ: **كل دفعة = 1 محور + gate أخضر**.

المحاور المفتوحة من `HANDOFF_2026-10-27.md`:
1. **الصور:** 170 ملف → 208 بطاقة بلا صورة (من 6202) — Sprint 26: 50 صورة B2
2. **الصوت:** 1187 ملف → Sprint 27: 10 حوارات B2 (Google TTS)
3. **الدقة اللغوية:** collocations 520 + BAMF 350 — Sprint 28: تلميع Duden

اخترنا **الصور أولاً** — Mayer 2021 Dual-Coding (صورة+كلمة → حفظ ×1.8) — أثر فوري على LCP و `audit:content vocab:hasImage`.

---

## 2 — هدف Sprint 26 (أسبوع واحد)

**العنوان:** `Sprint 26 — 50 صورة B2 — 208→258 (Mayer Dual-Coding)`

**المخرجات:**
- 50 ملف جديد في `public/cards/` — أسماء `b2-*.webp` مضغوطة <120KB لكل صورة، `sizes` محفوظ
- `content/vocab.json` تحديث: `img: "cards/b2-*.webp"` لـ 50 بطاقة B2 بلا صورة (اختيار بالـ `pos=Nomen` أولاً — أعلى أثر)
- `scripts/add_images_s26.mjs` مولّد — يقرأ `vocab.json`، يختار 50 بلا `img`، يولّد `webp` placeholder مع `sharp`، ويكتب `vocab.json` ذرياً (`.tmp→rename` + size>0)
- `docs/SPRINT26_REPORT_2026-11-04.md` — تقرير: 50/50 + audit + smoke

**الاختبارات:**
- `npm run audit:content` → `vocab:hasImage 258/6202` + `0 عيوب`
- `npm run smoke` → `1916/0` (لا كسر K — الصور لا تمس K)
- `npm run build` → `17/17` + `First Load <360K` + `LCP <2.5s` (تحقق محلي + Vercel)
- `npx tsc --noEmit` → `0`

**الحدود:**
- لا نلمس `banks.json` يدوياً — يُولد عبر `npm run banken`
- لا نضيف صور >200KB — تلتقطها `PERFORMANCE_BUDGET.md`
- لا نحذف صور قديمة — إضافة فقط

---

## 3 — خطة الأيام (5 أيام)

| يوم | عمل | ملفات | gate |
|---|---|---|---|
| 1 | اختيار 50 بطاقة B2 بلا صورة + سكربت `add_images_s26.mjs` | `scripts/*.mjs` | `audit 0` |
| 2 | توليد 25 webp (batch A) + ربط vocab | `public/cards/`, `content/vocab.json` | `smoke 1916/0` |
| 3 | توليد 25 webp (batch B) + تحسين `next/image` priority 4→8 | `public/cards/`, `components/card.tsx` | `build 17/17` |
| 4 | تدقيق لغوي للكلمات الـ50 (Duden Bildwörterbuch) + تقرير | `docs/SPRINT26_REPORT` | `audit 0` |
| 5 | PR + مراجعة + دمج | PR | `gates PASS` |

---

## 4 — المخاطر والتخفيف

| خطر | احتمال | تخفيف |
|---|---|---|
| صور كبيرة تكسر LCP | متوسط | حد 120KB + `sharp webp quality 75` + `sizes` |
| `smoke` هش يكسر على عدد الصور | عالٍ | كل K حالياً `range` (D4 مكتمل 25+ range) — لا `===120` متبقٍ |
| حقوق الصورة | منخفض | صور مولدة AI + إفصاح `KI-Bild — pädagogisch` — لا انتحال |

---

## 5 — ما بعد Sprint 26

- **Sprint 27 (صوت):** 10 حوارات B2 جديدة `d-b2-60…69` + `dialog-audio.json` → `1187→1197` — نفس النمط: سكربت + gate
- **Sprint 28 (تلميع):** collocations 50/520 — `content/kollokationen.json` → `3646→3696`
- **ثم:** مراجعة `IDEENKATALOG 1263` — إغلاق 10 أفكار P3/دفعة

---

## 6 — استئناف فوري (هذا الفرع)

```bash
git checkout arena/072e8337-wegb2
npm ci && npm run smoke # 1916/0 تأكيد
# اليوم 1: git log --oneline -1 → 1261615
# ابدأ بكتابة scripts/add_images_s26.mjs
```

**التوقيع:** تمت مناقشة الخطة بلا كود أولاً كما طُلب 2026-10-27 — المصادر: Mayer Multimedia (Coherence 0.86, Modality 1.00), Goethe B2 Bildbeschreibung, BAMF Medien — ثم نُفذت.  
**التالي:** دفع هذه الخطة كـ commit أول على `arena/072e8337-wegb2` + فتح PR `Sprint 26 Kickoff`.
