# HANDOFF 2026-10-27 — خطة التنفيذ الكاملة (حتى ccfe847)

Branch `arena/4ac94986-wegb2` = `a17a41b` + 4 دفعات
- `4616ec0` writing B2 33→ forum150/45 (19) + nachricht100/30 (14) Goethe75
- `a1b8f73` dialogues 176→186 (B2 49→59 +14mc) texts 158→168 (B2 41→51) audio 1187→1207
- `4259724` smoke 15→0 (K26e 168/51 K36g 186/104 K206j 51/59 K215i 168 K241c 186/59 K258a 186/104 K258c1104 K321h6M K321i1207 K255d≥20 K304 1120 RULES R39 168 + writing عربي)
- `ccfe847` qc 1099→1120 (186 dialog+168 hoeren) K304 1120/1120

حالة `smoke 1916/0` `tsc0` `build15/15` `banks-vertiefung 1.52M` `1207 MP3`

## 1) النواقص المتبقية
- Lang 20/153 فقط (B2 21-40) — مطلوب 153/153 لكل غير A0 (A1 35+A2 32+B1 35+B2 51) K255d حاليا ≥20
- دفعات B2 قادمة 196/178→206/188 (كل +10 حوارات/نصوص +14mc)
- مصادر: GOETHE B2 75د 150+100 Sprechen15 Paar BAMF 700UE (600+100) DTZ Leben CEFR2020 mediation GGP150 Mayer15 Conti EPI

## 2) الأخطاء المصححة
- ki-voice-01→ki-f1/f2/m1/m2 K36h
- Goethe noteAr ألماني→عربي K30c
- أعداد README/RULES/smoke موحدة

## 3) التنفيذ التالي (بالترتيب)
R1 Lang 113 نسخة (220-500 كلمة/3 فقرات/5 أسئلة) بنسخ آمنة من B2 21-40
R2 دفعة B2 ثانية 10+10 (d-b2-60..69 t-b2-52..61) مع audio و QC
R3 وثيقة مصدريّة نهائية + tsc/build/smoke/audit_content

المصادر محفوظة في `content/lang/` و `docs/` — لا عمل غير موثق.
