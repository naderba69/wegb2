#!/usr/bin/env python3
"""Doc bump part1 — R127 state into the four tracked docs (anchors verified in-file)."""
from pathlib import Path

RULES = Path("RULES.md")
HANDOFF = Path("HANDOFF.md")
QUA = Path("docs/qualitaet.md")
PROMPT = Path("PROFESSIONAL_CONTINUATION_PROMPT_AR.md")
R127_ROW = Path("scripts/patches/r127_rules_row.txt").read_text(encoding="utf-8").rstrip("\n")

def must(s, sub, label, expected=1):
    c = s.count(sub)
    if c != expected:
        raise AssertionError(f"{label}: expected {expected} of {sub!r}, found {c}")

# ============ RULES.md ============
s = RULES.read_text(encoding="utf-8")
# Insert R127 table row before the unique "## سجل القرارات" heading (we fixed the duplicate already).
h2 = "## سجل القرارات"
must(s, h2, "RULES h2")
s = s.replace(h2, R127_ROW + "\n" + h2)
# Insert R127 log bullet after the R126 bullet (anchor on its unique start)
anchor_log = "- 2026-10-08 (R126): روجعت الدفعة B2 الرابعة `d-b2-10`–`d-b2-12` (24 سطراً، 9 أسئلة، 6 إملاءات ≈162 وحدة)."
must(s, anchor_log, "RULES log", 1)
r127_log = ("\n- 2026-10-08 (R127): روجعت الدفعة B2 الخامسة `d-b2-13`–`d-b2-15` (24 سطراً، 9 أسئلة، 6 إملاءات ≈162 وحدة). "
            "الألماني/who/الأسئلة/المفاتيح/الإملاءات مقفلة. طُبقت 17 تصحيحاً بنيوياً: Frist=مهلة، Partnerschaftsbonus=مكافأة الشراكة "
            "(بلا «زوجية» زائدة وإسناد مؤنث)، حذف المثنى في خطاب الـSie، بنسبة/حتى، PDF/مستند/مسوحات، مهلة التقديم ولن ألحقها، "
            "تمديد المهلة مع مستشار ضريبي، حصة النفقات الجانبية ونظام المقطوع، الاعتراض، إثبات الاستلام، أمر Sie جمع «واحتفظوا»، "
            "أبلغتُ عن الضرر، فني الطوارئ، تسوية المطالبة خلال أسبوعين، سلفة (لا عربون) وحق الرجوع، فوات الإيجار، تأمين المنقولات/صالح للسكن/المؤجّر. "
            "لا تحذير محتوى جديد؛ W1–W6 مفتوحة. K201a–j تحرس العدّ والتصحيحات والقفل والحدود. TypeScript ✓، smoke 1323/1323، "
            "interaktiv 699/699، audit:content صفر عيوب، build 11/11، npm audit 0، diff check نظيف. "
            "وبذلك صار المراجَع 15 حواراً من 29 في B2.")
s = s.replace(anchor_log, anchor_log + r127_log)
# footer counts line
old_foot = "127 قاعدة: 111 ✅ و16 ⚠️"
new_foot = "128 قاعدة: 112 ✅ و16 ⚠️"
must(s, old_foot, "RULES footer count")
s = s.replace(old_foot, new_foot)
s = s.replace("R0–R126 مفهرسة مع K1–K200", "R0–R127 مفهرسة مع K1–K201")
RULES.write_text(s, encoding="utf-8"); print("RULES.md ok")

# ============ HANDOFF.md ============
s = HANDOFF.read_text(encoding="utf-8")
# 1) smoke comment line at line 30 — update count and mention K201/R127
old_smoke_comment = "# 1313 فحصاً (تشمل K200/R126 وK199/R125"
new_smoke_comment = "# 1323 فحصاً (تشمل K201/R127 وK200/R126 وK199/R125"
must(s, old_smoke_comment, "HANDOFF smoke comment")
s = s.replace(old_smoke_comment, new_smoke_comment)
# 2) Section 2 heading
old_h2 = "## 2. ✅ حالة الاختبارات (مُشغَّلة فعلياً اليوم 2026-10-08 — R126)"
new_h2 = "## 2. ✅ حالة الاختبارات (مُشغَّلة فعلياً اليوم 2026-10-08 — R127)"
must(s, old_h2, "HANDOFF h2")
s = s.replace(old_h2, new_h2)
# 3) smoke table cell
old_cell = "| `npm run smoke` | **1313 نجح · 0 فشل** ✅ (يشمل K200a–j/R126 وK199a–j/R125"
new_cell = "| `npm run smoke` | **1323 نجح · 0 فشل** ✅ (يشمل K201a–j/R127 وK200a–j/R126 وK199a–j/R125"
must(s, old_cell, "HANDOFF smoke cell")
s = s.replace(old_cell, new_cell)
# 4) Update the "بوابات المحرّك" stale row too
old_gate = "| بوابات المحرّك | **1203 فحصاً ناجحاً في آخر smoke"
if old_gate in s:
    s = s.replace(old_gate, "| بوابات المحرّك | **1323 فحصاً ناجحاً في آخر smoke (يشمل K201a–j/R127 وK200a–j/R126")
# 5) File table: insert R127 report/patch rows before PROFESSIONAL_CONTINUATION row
prof_anchor = "| `PROFESSIONAL_CONTINUATION_PROMPT_AR.md` |"
must(s, prof_anchor, "HANDOFF prof anchor")
r127_files = ("| `docs/content-review-b2-dialogues-05-2026-10-08.json` · `.md` | تقرير خامس دفعة B2 d-b2-13..15: 24 سطراً، 9 أسئلة، 6 إملاءات ≈162 وحدة، 17 تصحيحاً، لا تحذيرات جديدة (W1–W6 مفتوحة)، 14 مصدراً؛ K201a–j (R127) |\n"
              "| `scripts/patches/review_b2_dialogues_05.py` · `scripts/patches/report_b2_dialogues_05.py` | رقعة حرِسة قابلة لإعادة التطبيق وتقرير R127 (ملف B2) |\n")
s = s.replace(prof_anchor, r127_files + prof_anchor)
# Update PROFESSIONAL row description
old_prof_desc = "خطة استكمال عربية محدثة: حالة R126 وقيوده واختباراته، وتحذيرات المحتوى W1–W5، وتقدّم B2، ونطاق R126 المرشح"
new_prof_desc = "خطة استكمال عربية محدثة: حالة R127 وقيوده واختباراته، وتحذيرات المحتوى W1–W6، وتقدّم B2، ونطاق R128 المرشح"
must(s, old_prof_desc, "HANDOFF prof desc")
s = s.replace(old_prof_desc, new_prof_desc)
# 6) Footer footer: update counts and mention R127
old_footer = "· R126 ✅ B2 الدفعة 4 d-b2-10–12 (مفاوضة أجر/تفاوض إيجاري خطّي/اعتراف بالشهادة، 24 سطراً، ~162 وحدة، 16 تصحيحاً عربياً؛ **W6** «سقف 11٪» غير معدّل، 13 مصدراً) · القواعد: 127 (111 ✅ / 16 ⚠️) · TypeScript ✓ · smoke 1313/0"
new_footer = ("· R126 ✅ B2 الدفعة 4 d-b2-10–12 (مفاوضة أجر/تفاوض إيجاري خطّي/اعتراف بالشهادة، 24 سطراً، ~162 وحدة، 16 تصحيحاً عربياً؛ **W6** «سقف 11٪» غير معدّل، 13 مصدراً) · "
             "R127 ✅ B2 الدفعة 5 d-b2-13–15 (بدل والدية/إقرار ضريبي/تأمين تلف ماء، 24 سطراً، ~162 وحدة، 17 تصحيحاً عربياً؛ لا W جديدة، 14 مصدراً) · "
             "القواعد: 128 (112 ✅ / 16 ⚠️) · TypeScript ✓ · smoke 1323/0")
must(s, old_footer, "HANDOFF footer")
s = s.replace(old_footer, new_footer)
HANDOFF.write_text(s, encoding="utf-8"); print("HANDOFF.md ok")

# ============ docs/qualitaet.md ============
s = QUA.read_text(encoding="utf-8")
r126q = "| 2026-10-08 | R126 — رابع دفعة B2 d-b2-10–12"
must(s, r126q, "qua R126")
r127q = "| 2026-10-08 | R127 — خامس دفعة B2 d-b2-13–15 (بدل الوالدية، الإقرار الضريبي، تلف الماء) | 24/9/6 ≈162 | 17 عربياً؛ لا W جديدة | K201a–j · 1323/0 | ✅ تام |\n"
s = s.replace(r126q, r127q + r126q)
QUA.write_text(s, encoding="utf-8"); print("docs/qualitaet.md ok")

# ============ PROFESSIONAL_CONTINUATION_PROMPT_AR.md ============
s = PROMPT.read_text(encoding="utf-8")
old_sum = "حتى R126، بوابات K1–K200، اختبار الدخان 1313/0، 127 قاعدة (111 ✅ و16 ⚠️)."
new_sum = "حتى R127، بوابات K1–K201، اختبار الدخان 1323/0، 128 قاعدة (112 ✅ و16 ⚠️)."
must(s, old_sum, "prompt sum")
s = s.replace(old_sum, new_sum)

old_rem = ("- **R126 (اكتملت):** رابع دفعة B2 `d-b2-10`–`d-b2-12` (مفاوضة الأجر، تفاوض إيجاري خطّي، اعتراف بالشهادة)؛ 162 وحدة؛ "
           "16 تصحيحاً عربياً مؤكداً (Sie→جمع، vorschweben=يخطر بالبال، auf eine Summe=أبلغ، Rahmen=نطاق، Leistung=أداء، Zusage=التعهد، "
           "Beleg=أدلة، sachlich=بموضوعية، Berufserlaubnis=إذن مزاولة، Vorauszahlung=دفعة مقدمة، vierzehn Tage=أربعة عشر يوماً)؛ "
           "W6 جديدة (سقف «11٪» في d-b2-11.L2 بلا أساس، موثقة دون تعديل). الألماني/الأسئلة/الإملاءات مقفلة؛ البوابات K200a–j خضراء (smoke 1313/0). "
           "المتبقّي غير المراجَع: 17 حواراً B2 + 3 حوارات A0.")
new_rem = ("- **R126 (اكتملت):** رابع دفعة B2 `d-b2-10`–`d-b2-12`؛ 162 وحدة؛ 16 تصحيحاً + W6 (مفتوح).\n"
           "- **R127 (اكتملت):** خامس دفعة B2 `d-b2-13`–`d-b2-15` (بدل الوالدية، الإقرار الضريبي، تلف الماء مع التأمين)؛ 162 وحدة؛ "
           "17 تصحيحاً عربياً مؤكداً (Frist=مهلة، Partnerschaftsbonus=مكافأة الشراكة، Berechnung=تُحسب، bis=حتى، Abgabefrist=مهلة التقديم، "
           "schaffen=ألحق، Widerspruch=اعتراض، Eingang=الاستلام، Sie→جمع «واحتفظوا»، Schaden=الضرر، Handwerker-Notdienst=فني الطوارئ، "
           "binnen zwei Wochen=خلال أسبوعين، Rückgriff=حق الرجوع، Vorschuss=سلفة، Mietausfall=فوات الإيجار، Hausrat=تأمين المنقولات، "
           "Wiederbewohnbarkeit=صالح للسكن، Vermieter=المؤجّر)؛ لا تحذير محتوى جديد (W1–W6 تبقى مفتوحة). الألماني/الأسئلة/الإملاءات مقفلة؛ "
           "البوابات K201a–j خضراء (smoke 1323/0). المتبقّي غير المراجَع: 14 حواراً B2 + 3 حوارات A0.")
must(s, old_rem, "prompt rem")
s = s.replace(old_rem, new_rem)

old_h3 = "## 3. ما الذي يجب أن يليه (R127)"
new_h3 = "## 3. ما الذي يجب أن يليه (R128)"
must(s, old_h3, "prompt h3")
s = s.replace(old_h3, new_h3)

old_tail = ("- **إغلاق R126**: هذا هو التسليم الحالي — الحلقة التالية تبدأ مباشرة، ولا تنتظر الدمج.\n"
            "- **R127 = سادس دفعة B2 (الخامسة فعلياً):** حوارات `d-b2-13` و`d-b2-14` و`d-b2-15` "
            "(بدل الوالدية ومشورة · الإقرار الضريبي وتمديد المهلة · تلف الماء مع التأمين).\n"
            "  - نقاط التماس متوقعة: Frist=مهلة (R125)، Vorauszahlung=دفعة مقدمة (d-b2-12.L7)، Nebenkosten=نفقات جانبية (d-b1-11)، "
            "Beleg=دليل/أدلة لا فواتير (R126)، Sie→جمع، نسب الحروف بلا ٪؛ وألفاظ تأمينية/ضريبية تحتاج ضبطاً "
            "(Vorschuss/Mietausfall/Hausrat/Widerspruch/Abgabefrist/Protokoll) — اجمع الشواهد الداخلية والخارجية قبل الرقعة.\n"
            "  - **مفتوح قائماً:** W6 (d-b2-11.L2 «elf Prozent» بلا أساس) — لا تعديل عربي إضافي، وارصده أيّ تكرار.\n"
            "- **بوابات R127:** أضف K201a–j في `scripts/engine_smoke.ts` (عشرة فحوص: نطاق، تصحيحات، فحوص محتوى، قفل، تقرير، مصادر، صوت، حدود، تنبيهات) "
            "قبل الأصل `ENGINE SMOKE`؛ المجموع المتوقع **1323/0**.\n"
            "- **الملفات:** `scripts/patches/review_b2_dialogues_05.py` (رقعة guarded) + `scripts/patches/report_b2_dialogues_05.py` (مولد التقرير) → "
            "`docs/content-review-b2-dialogues-05-2026-10-08.{json,md}`.\n"
            "- **التسلسل:** استخرج → رقعة بحراسة assert count=1 → مولد تقرير → أبواب كاملة "
            "(tsc · smoke 1323/0 · interaktiv · audit:content · build · npm audit · diff --check · idempotency) → حدّث الوثائق الأربع → "
            "commit «R127: ...» مع بيانات العدّ → **ادفع فوراً إلى** `arena/d30141a7-wegb2` → علّق PR #4 → اعرض التقرير.\n")
new_tail = ("- **إغلاق R127**: هذا هو التسليم الحالي — الحلقة التالية تبدأ مباشرة، ولا تنتظر الدمج.\n"
            "- **R128 = سادس دفعة B2:** حوارات `d-b2-16` و`d-b2-17` و`d-b2-18` (راجع العناوين الفعلية في `content/dialogues.json` قبل البدء — لا تفترض البنية).\n"
            "  - نقاط التماس متوقعة: تابع السنن السابقة (Sie→جمع، نسب حروف بلا ٪، Frist=مهلة، Beleg=دليل/أدلة، Vorauszahlung=دفعة مقدمة، "
            "Nebenkosten=نفقات جانبية، sachlich=بموضوعية، schriftlich=خطي، Zusage=تعهد، وغيرها) — اجمع الشواهد الداخلية والخارجية قبل الرقعة.\n"
            "  - **مفتوح قائماً:** W1–W6 (آخرها W6 في d-b2-11.L2 «elf Prozent» بلا أساس) — لا تعديل عربي إضافي، وارصد أي تكرار.\n"
            "- **بوابات R128:** أضف K202a–j في `scripts/engine_smoke.ts` (عشرة فحوص: نطاق، تصحيحات، فحوص محتوى، قفل، تقرير، مصادر، صوت، حدود، تنبيهات) "
            "قبل الأصل `ENGINE SMOKE`؛ المجموع المتوقع **1333/0**.\n"
            "- **الملفات:** `scripts/patches/review_b2_dialogues_06.py` (رقعة guarded) + `scripts/patches/report_b2_dialogues_06.py` (مولد التقرير) → "
            "`docs/content-review-b2-dialogues-06-2026-10-08.{json,md}`.\n"
            "- **التسلسل:** استخرج → رقعة بحراسة assert count=1 → مولد تقرير → أبواب كاملة "
            "(tsc · smoke 1333/0 · interaktiv · audit:content · build · npm audit · diff --check · idempotency) → حدّث الوثائق الأربع → "
            "commit «R128: ...» مع بيانات العدّ → **ادفع فوراً إلى** `arena/d30141a7-wegb2` → علّق PR #4 → اعرض التقرير.\n")
must(s, old_tail, "prompt tail")
s = s.replace(old_tail, new_tail)

h5 = "## 5. دروس تقنية"
must(s, h5, "prompt h5")
lessons = (
    "- **Frist = مهلة لا موعد/أجل:** في الأسئلة نفسها «مهلة» هي المفتاح (d-b2-14.Q1، d-a2-26.Q0)؛ و«Abgabefrist» = «مهلة التقديم» (R127).\n"
    "- **Partnerschaftsbonus = مكافأة الشراكة:** لا «الزوجية» زائدة؛ والفعل يسند إلى المؤنث «تعمل» (مكافأة) لا «يعمل» (R127).\n"
    "- **المثنى غيرُ وارد في خطاب الـSie:** مخاطبة موظف واحد أو موظفة واحدة هي «أنتم/هل تُحسَب» لا «تحسبان» — خطأ شائع حين يحاكي النص ثنائية المتكلم/المخاطَب (R127).\n"
    "- **prozentual/bis:** «يُعوَّض بنسبة أعلى حتى …» (تمييز + حتى) أدق من «نسبةً أعلى إلى»؛ والنسبة حروف بلا ٪ (R125+R127).\n"
    "- **als PDF = بصيغة PDF، je Monat ein Dokument = مستنداً لكل شهر:** «صفحة» تخطئ لأن المستند قد يمتد؛ و«Scans» جمع = «مسوحات» (R127).\n"
    "- **ich schaffe es nicht mehr = لن ألحقها:** يفيد الإلحاق بالزمن لا الإتمام المجرد (R127).\n"
    "- **Widerspruch = اعتراض (لا انقلاب فاعل/مفعول):** «هل يمكنني الاعتراض؟» بدل «أيعترض عليَّ؟» المقلوب (R127).\n"
    "- **Nachweis des Eingangs = إثبات الاستلام:** تمييز عن «Quittungsdokument = مستند الاستلام» في السطر التالي؛ لا خلط بين «وصل/استلام» (R127).\n"
    "- **أمر الـSie جمع دائماً:** «aufheben» موجّه من موظف/خدمة → «واحتفظوا» (شاهد d-a2-13.L2)، حتى لمخاطَب مفرد (R125+R127).\n"
    "- **Schaden melden = أبلغتُ عن الضرر:** في سياق التأمين لا «أُعلن الخطب»؛ وHandwerker-Notdienst = «فنيُّ الطوارئ» أشمل من «السباك» (R127).\n"
    "- **binnen zwei Wochen = خلال أسبوعين:** لا «موعدين كحد أقصى» التي تخطئ العبارة (R127).\n"
    "- **Rückgriff = حق الرجوع على المسؤول، Vorschuss = سلفة لا عربون:** العربون (Anzahlung) للبيع/الإيجار؛ السلفة على التعويض/الراتب (شاهد lak24.de) (R127).\n"
    "- **Mietausfall = فوات الإيجار:** لا «بدل انتفاع» المبهم (R127).\n"
    "- **Hausrat تأمين، Wiederbewohnbarkeit صلاحية السكن، Vermieter = المؤجِّر:** «تأمين المنقولات يدفع التجفيفَ والفندقَ حتى يعودَ المسكنُ صالحاً للسكن» أوضح من «منقولاتك تدفع…إلى السكنية» (R127).\n"
    "- **لا تحذير محتوى جديد في R127:** العبارات النظامية الألمانية (3 أشهر رجوعاً، 67٪، تمديد تلقائي مع مستشار، شهر للاعتراض، أسبوعان للتسوية) متسقة ظاهرياً مع المراجع المتاحة، فلا W جديدة؛ W1–W6 تظل مفتوحة.\n"
)
s = s.replace(h5, lessons + "\n" + h5)
PROMPT.write_text(s, encoding="utf-8"); print("PROMPT ok")
print("\nAll 4 docs bumped to R127.")
