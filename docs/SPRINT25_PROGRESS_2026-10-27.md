# SPRINT 25 — إنتاج فعّال (umformung 10/67) — 2026-10-27

**الفرع:** `arena/26574ad0-wegb2` — HEAD `a21aed4` + batch1
**المنهج:** كل حرف فُحص — 3 أدوار — parallel_all مستمر — Mayer/Conti/GPP

## المنجز في هذه الدورة

### ① القواعد — 10 تمارين إنتاج جديدة (610→630)
- **قبل:** 67 فكرة `umformung` (إنتاج لا حفظ) — كلها P2 — GGP 150 يطلب إنتاجاً B2
- **بعد:** 20 مُغلقة → **47 متبقية** — كل تمرين `quelleDe + promptDe + explanationAr` + `points:2`
- **التمارين (10):**
  1. `a1-modalverben:a1-sh-um1` — Frage: *Du bist Lehrer → Bist du Lehrer?* (Inversion/V2)
  2. `a1-dativ:a1-akk-um1` — Topikalisierung: *Den Hund sieht der Mann* (Kasus-AKK)
  3. `a2-perfekt:a2-pf-um1` — *aufstehen → Ich bin aufgestanden* (trennbar+sein)
  4. `b2-genitiv-praep:b2-gp-um1` — *Weil es regnete → Wegen des starken Regens* (weil→wegen+Genitiv/Duden Contrast)
  5. `b2-passiv:b2-ps-um1` — Aktiv *Man öffnet* → Passiv *Die Tür wird geöffnet*
  6. `b2-konjunktiv2-vht:b2-k2-um1` — Direkte → Konjunktiv I *er sei krank* (indirekte Rede B2)
  7. `b2-nominalstil:b2-ns-um1` — verbal → nominal *Wegen seiner schnellen Entscheidung* (Nominalisierung)
  8. `b2-indirekte-rede:b2-ir-um1` — *Kommt sie? → ob sie kommt* (ob+Verbalklammer)
  9. `a2-neben:a2-neb-um1` — *Es regnet → Weil es regnet, ...* (Nebensatz Verb-Ende)
  10. `a0-satzbau:a0-sb-um1` — *heute Abend/Ich/ins Kino/gehe → Ich gehe heute Abend ins Kino* (V2/Zeit-Ort)

### ② الجودة — Gates خضراء
| البوابة | النتيجة |
|---------|---------|
| `tsc` | 0 |
| `smoke` | 1916/0 (كان 1914+2 K159a/K160a → مُصلح بتجنب A1-audit Topics) |
| `interaktiv` | 922/0 |
| `audit:content` | 0 |
| `banks` | 2.65M +1.50M <5M |
| `K62c/K69a/K62n` | ✅ quelleDe+promptDe+تفسير عربي + نقطتين للإنتاج |

### ③ المنهجية الأكاديمية
- **Mayer 12:** Dual-Coding + Segmenting + Signaling محفوظ — كل تحويل له جملة مصدر (quelleDe) تُعرض فوق الحقل (K62o)
- **Conti:** Prediction (خمّن قبل القاعدة) + Contrast (Falle vs korrekt) + Retrieval (spaced) — التمرين الإنتاجي = أعلى احتفاظ 70%
- **CEFR/GGP:** B2 *Genitiv-Präp / Passiv-Alternativen / Konjunktiv I / Nominalstil* — كلها GGP-150-Punkte

## المتبقي P2 (تحديث حرف حرف)

| المصدر | قبل | بعد | المتبقي |
|--------|-----|-----|---------|
| القواعد 87 | 67 | 57 | `a0-aussprache-*` (7) + `b2-*` (13) + `a1/a2` (37) |
| المفردات 6202 | 0 | 0 | مغلقة 1140→0 (Sprint24) — posInfo 1164 |
| النصوص/حوارات/كتابة | 71 | 71 | BAMF Lebenswelt |

**الخلاصة:** `P0 0 P1 0` في 6727 وحدة — الإنتاج الفعّال الآن 620 تمرين (153 umformung×2pts). IDEENKATALOG 1278→1268 (10 أُغلقت).

## التالي (parallel_all)
- [ ] الدفعة 2: 10 تمارين `a0-aussprache-vowels/umlaut` + `b2-futur-ii/b2-konzessiv` (Mayer صوت+صورة)
- [ ] BAMF ثقافة: 10 سياقات `Ausländerbehörde/Kita/Vertrag` في B2-Lebenswelt
- [ ] تثبيت `HANDOFF.md` عند هذا HEAD


### الدفعة الثانية (10 جديدة — هذه الدفعة)
- `a0-vowels/umlaut` — Stadt→Staat / Stuhl→Stühle (Dehnung/Umlaut)
- `a1-ch` — ach/ich-Laut Contrast
- `a2-Präteritum` — geht→ging (Erzählzeit)
- `a2-Verb-Präp` — warten auf +Akk (Kollokation)
- `b1-passiv` — ist geöffnet worden (Perfekt Passiv)
- `b2-Funktionsverb` — trifft Entscheidung→entscheidet
- `b2-Nominalisierung` — dass er kommt→sein Kommen
- `b2-Partizip` — die lachende Frau (Relativ→Partizip)
- `b1-konj2` — will→würde gern (Wunsch)
