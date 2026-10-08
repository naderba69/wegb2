#!/usr/bin/env python3
"""R126 — review report for fourth B2 batch d-b2-10..d-b2-12."""
from __future__ import annotations
import json, glob
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
D = json.loads((ROOT / "content/dialogues.json").read_text(encoding="utf-8"))
AUDIO = json.loads((ROOT / "content/dialog-audio.json").read_text(encoding="utf-8"))
SCOPE = ["d-b2-10", "d-b2-11", "d-b2-12"]
OUT_JSON = ROOT / "docs/content-review-b2-dialogues-04-2026-10-08.json"
OUT_MD = ROOT / "docs/content-review-b2-dialogues-04-2026-10-08.md"

CORRECTIONS = [
 {"unit": "d-b2-10.lines[0].ar", "old": "شكراً على وقتك — وظيفتُكم تهمُّني للغاية.", "new": "شكراً على وقتكم — وظيفتُكم تهمُّني للغاية.",
  "rationale": "«Sie» صريح («dass Sie sich die Zeit nehmen») والخطاب في السطر نفسه جمعٌ («وظيفتُكم») — فتوحّدت المخاطبة بنمط R125 (d-b2-08.L0 «تقيّمون»، d-b2-09.L0 «تقدّمتم»)."},
 {"unit": "d-b2-10.lines[1].ar", "old": "وكذلك. ما الذي تُقَدِّمُه لنفسك أجرياً؟", "new": "وكذلك. وما الأجرُ الذي يخطرُ ببالكم؟",
  "rationale": "(أ) «vorschweben» = «يخطر بالبال/يكون في الذهن» (DWDS: «jmd. sieht etw. in Gedanken vor sich, hat etw. im Sinne»؛ مرادفاته: sich vorstellen, im Sinn haben) لا «تُقَدِّمُه لنفسه». (ب) «tariflich» هنا من جهة الأجر (مفاوضة فردية بلا اتفاق جماعي). (ج) «Ihnen» → جمع «ببالكم»."},
 {"unit": "d-b2-10.lines[2].ar", "old": "في ضوءِ خبرتي، أقولُ 48.000 يورو إجماليّاً (ثمانيةً وأربعين ألفاً).", "new": "في ضوءِ خبرتي، أبلغُ 48.000 يورو إجماليّاً (ثمانيةً وأربعين ألفاً).",
  "rationale": "(أ) «auf eine Summe kommen» = بلوغُ مبلغ (linguee: wir kommen auf eine Summe von …) والملف يقول «تبلغ 250.000 يورو» (d-b2-27.L5) — فـ«أبلغُ» لا «أقولُ». (ب) وشرح Q0 نفسه يسمّي الرقم «مطلبه الأوّل» أي مقداراً لا كلاماً."},
 {"unit": "d-b2-10.lines[3].ar", "old": "هذا يفوقُ هامشَنا؛ خمسةٌ وأربعون ألفاً زائدُ المتغيرِ قابلٌ للنقاش.", "new": "هذا يفوقُ نطاقَنا؛ خمسةٌ وأربعون ألفاً زائدُ حصةٍ متغيّرةٍ قابلٌ للتفاوض.",
  "rationale": "(أ) «Rahmen» = «die äußeren Grenzen, in die etw. einbezogen ist» (DWDS) → «نطاق»، وقد حُفظ «هامش المناورة» لـSpielräume في d-b2-04.L3. (ب) «variabler Anteil» = حصة متغيّرة («Anteil» = حصة بنمط d-b2-18.L6 «حصة صاحب العمل») لا «المتغير» وحدها. (ج) «verhandelbar» من verhandeln = التفاوض (عنوانا d-b2-10 «مفاوضةُ الأجر» وd-b2-11 «تفاوُضٌ خطّي») لا «قابل للنقاش»."},
 {"unit": "d-b2-10.lines[4].ar", "old": "لستُ مُصمِّماً على الرقم — لكني أَعُدُّ وقتَ تدريبي إيراداً غيرَ مباشر.", "new": "لستُ مُصمِّماً على الرقم — لكني أَعُدُّ وقتَ تدريبي أداءً.",
  "rationale": "«Leistung» = «das Geleistete, das Produkt einer körperlichen oder geistigen Arbeit» (DWDS) → «أداء»؛ وشرح Q1 يبيّن المراد: «وقت التكوين يريده أن يُحتسب als Leistung لا أن يُدفع» — فـ«إيراداً غيرَ مباشر» تفسيرٌ خاطئ للمصطلح."},
 {"unit": "d-b2-10.lines[6].ar", "old": "بشرطِ أن تُقَصَّرَ التجربةُ إلى ثلاثةِ أشهر، نكونُ قد اتفقنا.", "new": "بشرطِ ألّا تتجاوزَ فترةُ التجربةِ في العقدِ ثلاثةَ أشهر، نكونُ قد اتفقنا.",
  "rationale": "(أ) «begrenzen auf» = حدّد بالحدّ الأقصى كما في مفتاح Q1 «eine Probezeit von höchstens drei Monaten» — لا «التقصير» «تُقَصَّر». (ب) فاعل الشرط «der Vertrag» فظهر «في العقدِ». (ج) «Probezeit» = «فترة التجربة» بنمط تسمية الفترات في الملف («فترة التهيئة» d-a2-13.L2). (د) «sofern» = «بشرط» (سنّة R125)."},
 {"unit": "d-b2-10.lines[7].ar", "old": "تمّ — ستصلُك نسخةُ العقدِ خطياً غدًا صباحاً.", "new": "تمّ — سيصلُكم التعهدُ خطياً غدًا صباحاً.",
  "rationale": "(أ) «bekommen Sie» (Sie) → جمع «سيصلُكم». (ب) «Zusage» = التعهد/الوعد الملزم (Duden) لا «نسخة العقد»؛ ووحّدها الملف في d-b2-04.L4 بعد R124 («بشرط تعهد خطي»)، وشرح Q2 يثبّت أن المكتوب هو «die Zusage» كاملة."},
 {"unit": "d-b2-11.lines[1].ar", "old": "حججُنا: مؤشّرُ الإيجاراتِ ودراسةُ الجدوى الاقتصادية.", "new": "أدلتُنا: مؤشّرُ الإيجاراتِ وحسابُ الجدوى الاقتصادية.",
  "rationale": "(أ) «Beleg» = Beweisstück/Nachweis (DWDS: «Beleg · Beweis · Beweismittel · Nachweis») → «أدلة» لا «حجج» (arguments)؛ وشرح Q0 نفسه يسمّي مستند الإدارة «دليل الإدارة» ويقول إن طلب النفقات «لا حجّة». (ب) «Wirtschaftlichkeitsberechnung» = حساب (Berechnung)؛ وL3 نفسه يقابل «errechnet» بـ«حسابُ رسالتك» — فـ«حساب الجدوى» أوثق من «دراسة»."},
 {"unit": "d-b2-11.lines[3].ar", "old": "صحيح — حسابُ رسالتك سليم؛ فنُصحِّحُ إلى تسعةٍ فاصلةَ ثمانية بالمئة.", "new": "صحيح — حسابُ رسالتكم سليم؛ فنُصحِّحُ إلى تسعةٍ فاصلةَ ثمانية بالمئة.",
  "rationale": "«Ihr Brief» (Ihr المبنيّ للـSie) → جمع «رسالتكم» بسنّة R125 في توحيد المخاطبة."},
 {"unit": "d-b2-11.lines[5].ar", "old": "يُرسلُ المحضرُ خلالَ أسبوعَين مع الفواتير.", "new": "يُرسلُ المحضرُ خلالَ أربعةَ عشرَ يوماً مع الأدلة.",
  "rationale": "(أ) «binnen vierzehn Tagen» صريحة؛ والملف يقابل «Vierzehn Tage» بـ«أربعة عشر يوماً» (d-a2-26.L6 «أربعة عشر يوماً، لكن بالإيصال فقط»)، وشرح Q2 يبني الفخّ على الرقم نفسه — فـ«أسبوعَين» تُخفي الرقم المرجعي. (ب) «Belege» = الأدلة/المستندات لا «الفواتير» (Rechnungen) — باتساق L1 بعد التصحيح."},
 {"unit": "d-b2-11.lines[7].ar", "old": "وصلَ التأكيدُ بالبريد — شكرًا على منهجيةِ النقاش.", "new": "مؤكَّدٌ بالبريد — شكرًا على إدارةِ النقاشِ بموضوعيةٍ.",
  "rationale": "(أ) «Per Mail bestätigt» بناءٌ اسميّ (Zustandspassiv) = «مؤكَّدٌ بالبريد» لا حدثٌ ماضٍ «وصلَ التأكيد»؛ و«بالبريد» سنّة الملف (d-b1-11.L6، d-b2-19.L2، d-b2-24.L1). (ب) «sachlich» = «nur von der Sache selbst, nicht von Gefühlen … bestimmt; objektiv» (Duden) بسنّة d-b2-19.L2 «بموضوعيةٍ»؛ و«Gesprächsführung» = إدارة/قيادة النقاش لا «منهجية» (methodisch)."},
 {"unit": "d-b2-12.lines[1].ar", "old": "ترجمةٌ مُصدَّق عليها، وقائمةُ مواد، وإثباتُ سنواتِ الخبرةِ العملية.", "new": "ترجمةٌ مُصدَّق عليها، وقائمةُ الموادِّ الدراسية، وإثباتُ الخبرةِ العملية.",
  "rationale": "(أ) «Fächerübersicht» = قائمة/بيان المواد الدراسية (Fächer = مواد، Übersicht = بيان) — فـ«قائمة مواد» المبهمة وُضّحت. (ب) «Nachweis praktischer Tätigkeiten» لا يذكر سنوات؛ ومفتاح Q0 («Praxisnachweis») يعني إثبات الخبرة العملية — فحُذفت «سنوات» الزائدة."},
 {"unit": "d-b2-12.lines[2].ar", "old": "كم تستغرقُ اللجان، وهل يحقُّ لي العملُ بين الأيادي؟", "new": "كم يستغرقُ فحصُ الطلب، وهل يحقُّ لي العملُ خلاله؟",
  "rationale": "(أ) «die Prüfung» = الفحص/البتّ ولا «لجان» في الحوار؛ وشرح Q2 نفسه يقول «ثلاثة أشهر مدّة فحص الطلب»، و«فحص» سنّة الملف (d-b1-07.L0 «الفحص»، d-b2-03.L1 «فحصت المصدر»). (ب) «währenddessen» = خلاله/في أثناءه، و«بين الأيادي» لا تؤدّي المعنى."},
 {"unit": "d-b2-12.lines[3].ar", "old": "ثلاثةُ أشهر نظاماً؛ وبإذنِ مهنتك في وضعِ الانتظار — عملٌ مقيَّدٌ نعم.", "new": "ثلاثةُ أشهر نظاماً؛ وبإذنِ مزاولةِ المهنة في وضعِ الانتظار — نعم، عملٌ مقيَّد.",
  "rationale": "(أ) «Berufserlaubnis» = إذنُ مزاولةِ المهنة (IHK München: «Berufsanerkennung mit gegebenenfalls zusätzlicher Berufserlaubnis … um überhaupt in dem Beruf arbeiten zu dürfen») لا «إذن مهنتك». (ب) ترتيب الجواب الألماني «ja, eingeschränkt» → «نعم، عملٌ مقيَّد»."},
 {"unit": "d-b2-12.lines[5].ar", "old": "يُسنَدُ إليك دوراتٌ تكييفية، أقصاها ستةَ عشرَ شهراً عمليةً موجَّهة.", "new": "يُسنَدُ إليكم دورةٌ تكييفية، أقصاها ستةَ عشرَ شهراً من الممارسةِ العملية.",
  "rationale": "(أ) «bekommen Sie» (Sie) → «إليكم». (ب) «einen Anpassungslehrgang» مفرد → «دورةٌ تكييفية» لا جمع «دورات». (ج) «16 Monate Praxis» = الممارسة العملية (Praxis) بلا «موجَّهة» الزائدة؛ وإجراءات المعادلة (Ausgleichsmaßnahmen) قد تبلغ سنوات في تنظيماتها (AV-L بريمن: «höchstens 3 Jahre») فـ«ستة عشر شهراً» ضمن المدى."},
 {"unit": "d-b2-12.lines[7].ar", "old": "400 يورو مقدَّماً؛ والاستردادُ بحسبِ قانونِ الولاية.", "new": "400 يورو دفعةً مقدَّمة؛ والاستردادُ بحسبِ قانونِ الولاية.",
  "rationale": "«Vorauszahlung» اسمٌ = دفعةٌ مقدَّمة (بنمط d-b2-14.L4 «الدفعةُ المقدمة») لا حال «مقدَّماً»؛ و«Erstattung» = الاسترداد (سنّة d-b1-16.L3، d-a2-31.L2)، و«Landrecht» = قانون الولاية (ملاحظة سياقية أدناه)."},
]

CONTEXT_NOTES = {
 "d-b2-10": [
  {"note": "«die Weiterbildungszeit zähle ich als Leistung» — «وقت تدريبي» يقابل Weiterbildungszeit، و«التدريب» سنّة R125 («دورة تدريبية») ومتسق مع «ميزانية تدريب» في L5 — لا تعديل على L4 بعد تصحيح «Leistung».", "source": "مقارنة داخلية (R125: Schulung=دورة تدريبية) + سياق L4/L5 (الألماني المقفل)."},
  {"note": "«Fair. Dann 45.500…» — «منصِف» مقبولة لـ«Fair»؛ و«Homeoffice» وردت في الملف (d-b1-01.L0، d-b2-14.L2) وترجمت هنا «عملٍ منزليٍّ» — صيغة قائمة لا تعديل.", "source": "content/dialogues.json: d-b1-01.L0 · d-b2-14.L2."},
  {"note": "«Abgemacht» تُرجمت «تمّ» (وهي صيغة القبول المستقرّة في الملف) والبديل الأسلوبي «اتفقنا»؛ وشرح Q2 يثبّت أن المكتوب هو التعهد كاملة لا الرقم وحده.", "source": "سياق L7 (الألماني المقفل) + content/dialogues.json: d-b2-10.questions[2]."},
  {"note": "«Was schwebt Ihnen tariflich vor?» — «tariflich» هنا من جهة الأجر لأن المفاوضة فردية بلا اتفاق جماعي، والشاهد تفسير المتحدثة نفسها «45.000 plus variabler Anteil».", "source": "سياق L1/L3 (الألماني المقفل)."},
  {"note": "مفاتيح Q0/Q1/Q2 مطابقة للسطور المقفلة («Dann 45.500…»، «Sofern … Probezeit auf drei Monate»، «die Zusage … schriftlich») — الأسئلة غير معدّلة.", "source": "content/dialogues.json: d-b2-10.questions[0..2] (مقفلة)."},
 ],
 "d-b2-11": [
  {"note": "«ortsübliche Miete» = «الإيجار المعتاد محليًّا» (L0) مقابلة سليمة؛ و«Mietspiegel» = «مؤشّر الإيجارات» بمعنى بيان الأسعار المحلي — لا تعديل على L0/L2 عدا التحذير W6 أدناه.", "source": "سياق L0/L2 + § 558c BGB (تعريف المؤشّر)."},
  {"note": "«zum Ersten» = «أولَ الشهر» (L6) مطابقة؛ و«Sofern alles eintrifft» = «بشرط وصول كل شيء» — سنّة sofern=بشرط (R125).", "source": "سياق L6 (الألماني المقفل) + درس R125."},
  {"note": "«Nebenkostenabrechnung» = «تسوية النفقات الجانبية» (L4) — «النفقات الجانبية» سنّة d-b1-11.L3 وd-b2-14.L3 («المصاريف الجانبية» في d-a2-22 بديل أوسع) — لا تعديل على L4.", "source": "مقارنة داخلية: d-b1-11.L3 · d-b2-14.L3 · d-a2-22.L0."},
  {"note": "«sachliche Gesprächsführung» — الـ«sachlich» في الخطاب الإداري يقابل «الموضوعية» (Duden: objektiv)؛ وقد وُحّد L7 على سنّة d-b2-19.L2 «بموضوعيةٍ».", "source": "duden.de/rechtschreibung/sachlich + content/dialogues.json: d-b2-19.L2."},
  {"note": "مفتاحا Q1/Q2 مطابقان («wir korrigieren auf 9,8 Prozent» و«Sofern alles eintrifft … zum Ersten») وشرحاهما يثبّتان الفخّين (15٪ الطلب الأصلي، و«11٪» سقف النص المقفل) — لا تعديل على الأسئلة.", "source": "content/dialogues.json: d-b2-11.questions[1..2] (مقفلة)."},
 ],
 "d-b2-12": [
  {"note": "«Ingenieurdiplom» = «شهادة الهندسة التونسية» — مقبولة (Diplom = شهادة جامعية في هذا السياق) — لا تعديل على L0.", "source": "سياق L0 (الألماني المقفل)."},
  {"note": "«Gleichwertigkeit» = «التكافؤ» (L4) مصطلح BQFG (Feststellung der Gleichwertigkeit = إثبات التكافؤ) — لا تعديل على L4.", "source": "ihk-muenchen.de (Anerkennung nach BQFG) + سياق L4."},
  {"note": "«im Warteverfahren» = «في وضع الانتظار» وصفٌ للإجراء المعلّق (لا مصطلح قانوني مستقل)؛ و«Regulär drei Monate» = المهلة النظامية للبتّ (BQFG § 6: ثلاثة أشهر بعد اكتمال الأوراق) — لا تعديل على L3 عدا الصياغة.", "source": "ihk-muenchen.de (BQFG-Fristen) + سياق L3."},
  {"note": "«Landrecht» في L7 = قانون الولاية؛ المعجم (DWB/DRW) يورد Landrecht/Landesrecht لمعنى «das im Land geltende Recht» والصيغة الحديثة الشائعة «Landesrecht» — ملاحظة توثيقية لا تعديل، وهي من دواعي إبقاء العربية «قانون الولاية».", "source": "dwds.de/wb/dwb/landrecht · drw.hadw-bw.de (Land(es)recht)."},
  {"note": "مفتاحا Q0/Q2 مطابقان («Beglaubigte Übersetzung, Fächerübersicht, Nachweis…» و«höchstens 16 Monate Praxis») وشرحهما يثبّت الفخّين (الـBerufserlaubnis تُمنح هنا لا تُقدَّم؛ و«Wochen» تبديل وحدة) — لا تعديل على الأسئلة.", "source": "content/dialogues.json: d-b2-12.questions[0,2] (مقفلة)."},
 ],
}

STYLE_ALTERNATIVES = {
 "d-b2-10": [
  {"phrase": "وما الأجرُ الذي يخطرُ ببالكم؟", "alternative": "وما الأجرُ الذي في ذهنكم؟", "note": "«vorschweben» — الثانية أقرب إلى «hat etw. im Sinne»، والأولى أطبع في التفاوض."},
  {"phrase": "أعُدُّ وقتَ تدريبي أداءً", "alternative": "أحتسبُ وقتَ تدريبي عملًا", "note": "«als Leistung zählen» — «أحتسب» أصرح في «zählen»، و«أداء» أدقّ في «Leistung»."},
  {"phrase": "سيصلُكم التعهدُ خطياً", "alternative": "ستستلمون التعهدَ كتابةً", "note": "«schriftlich bekommen» — الأولى بنمط «يصل» المستقرّ، والثانية أصرح في الاستلام."},
 ],
 "d-b2-11": [
  {"phrase": "أدلتُنا: مؤشّرُ الإيجارات", "alternative": "مستنداتُنا: بيانُ الإيجارات المحلي", "note": "«Belege» — «مستندات» بديل إداري شائع، و«بيان الإيجارات» شرح لـMietspiegel."},
  {"phrase": "مع الأدلة", "alternative": "ومُرفَقةً بالمستندات", "note": "«samt Belegen» — الثانية أرشق في المراسلات، والأولى أقرب للفظ."},
  {"phrase": "شكرًا على إدارةِ النقاشِ بموضوعيةٍ", "alternative": "شكرًا على سيرِ الحوارِ بموضوعية", "note": "«Gesprächsführung» — «سير الحوار» بديل مألوف، و«بموضوعية» سنّة d-b2-19.L2."},
 ],
 "d-b2-12": [
  {"phrase": "قائمةُ الموادِّ الدراسية", "alternative": "بيانُ الموادِّ الدراسية", "note": "«Fächerübersicht» — «بيان» أدنى إلى «Übersicht»، و«قائمة» أثبت."},
  {"phrase": "فحصُ الطلب", "alternative": "دراسةُ الطلب", "note": "«die Prüfung» — «دراسة» ألين، والأولى أصرح وموافقة لسنّة الملف (d-b1-07)."},
  {"phrase": "دورةٌ تكييفية", "alternative": "دورةُ تأهيلٍ تكيفي", "note": "«Anpassungslehrgang» — «تأهيل تكيفي» يبرز الغاية، و«تكييفية» أنسب اصطلاحاً بالإجراء."},
 ],
}

SOURCES = {
 "d-b2-10": [
  {"id": "S1", "citation": "DWDS: vorschweben — «jmd. sieht etw., jmdn. in Gedanken vor sich, hat etw., jmdn. im Sinne» (مرادفات: sich vorstellen, im Sinn haben)", "url": "https://www.dwds.de/wb/vorschweben"},
  {"id": "S2", "citation": "DWDS: Rahmen — «die äußeren Grenzen, in die etw. (thematisch Zusammenhängendes) einbezogen ist»", "url": "https://www.dwds.de/wb/Rahmen"},
  {"id": "S3", "citation": "DWDS: Leistung — «das Geleistete, das Produkt einer körperlichen oder geistigen Arbeit»", "url": "https://www.dwds.de/wb/Leistung"},
  {"id": "S4", "citation": "Duden: Zusage — «Zusicherung, sich … jemandes Wünschen entsprechend zu verhalten» + مقارنة داخلية d-b2-04.L4 «تعهد خطي» (تصحيح R124)", "url": "https://www.duden.de/rechtschreibung/Zusage"},
  {"id": "S5", "citation": "linguee (deutsch-englisch): auf eine Summe kommen — «to reach a sum» («wir kommen auf eine Summe von …») + مقارنة داخلية d-b2-27.L5 «تبلغ 250.000 يورو»", "url": "https://www.linguee.de/deutsch-englisch/uebersetzung/wir+kommen+auf+eine+summe+von.html"},
 ],
 "d-b2-11": [
  {"id": "S6", "citation": "§ 558 Abs. 3 BGB (gesetze-im-internet): «nicht um mehr als 20 vom Hundert erhöhen (Kappungsgrenze)»؛ «Der Prozentsatz … beträgt 15 vom Hundert, wenn … besonders gefährdet ist»", "url": "https://www.gesetze-im-internet.de/bgb/__558.html"},
  {"id": "S7", "citation": "§ 558c Abs. 1 BGB: «Ein Mietspiegel ist eine Übersicht über die ortsübliche Vergleichsmiete»", "url": "https://www.gesetze-im-internet.de/bgb/__558c.html"},
  {"id": "S8", "citation": "DWDS: Beleg — «Beweisstück»؛ «Nachweis»؛ مرادفاته: Dokument · Unterlage · Beweismittel", "url": "https://www.dwds.de/wb/Beleg"},
  {"id": "S9", "citation": "Duden: sachlich — «nur von der Sache selbst, nicht von Gefühlen oder Vorurteilen bestimmt; … objektiv» + مقارنة داخلية d-b2-19.L2 «بموضوعيةٍ»", "url": "https://www.duden.de/rechtschreibung/sachlich"},
 ],
 "d-b2-12": [
  {"id": "S10", "citation": "IHK München (BQFG): «Seit 01.12.2012 muss das Verfahren nach § 6 Absatz 3 des BQFG drei Monate nach vollständigem Eingang der Unterlagen abgeschlossen sein»؛ وفيه: Berufserlaubnis مع الاعتراف للمهن المنظّمة", "url": "https://www.ihk-muenchen.de/berufszugang/anerkennung/auslaendische-berufsabschluesse-nach-bqfg/"},
  {"id": "S11", "citation": "Universität Bremen (AV-L): «Der Anpassungslehrgang darf nach gesetzlicher Vorgabe insgesamt höchstens 3 Jahre dauern» — مدى الإجراءات التعويضية", "url": "https://www.uni-bremen.de/zflb/lehramtsstudium/anpassungsstudium-nach-bqfg/bqfg-informationen-fuer-lehrende"},
  {"id": "S12", "citation": "DWDS/DWB: landrecht — «das recht … die ein jeder in seinem heimatlande hat»؛ DRW: Land(es)recht — «das im Land geltende Recht» (والصيغة الحديثة LandEsrecht)", "url": "https://www.dwds.de/wb/dwb/landrecht · https://drw.hadw-bw.de/drw-cgi/zeige?index=lemmata&term=landesrecht"},
  {"id": "S13", "citation": "مقارنة داخلية: d-b2-14.L4 «زادت الدفعةُ المقدمة» تقابل Vorauszahlung بـ«الدفعة المقدمة»", "url": "content/dialogues.json: d-b2-14.L4"},
 ],
}

CONTENT_WARNINGS = [
 {"id": "W6", "dialogue": "d-b2-11", "field": "lines[2].de (وأثرُه في شرحَي Q0/Q1)",
  "statement": "السطر الألماني المقفل: «Genau der Mietspiegel besagt: Kappungsgrenze bei elf Prozent in drei Jahren.» — ينسب إلى مؤشّر الإيجارات سقفَ زيادةٍ مقداره «أحد عشر بالمئة» في ثلاث سنوات، وهو مقدار لا وجود له نظاماً، والمؤشّر ليس مصدر السقف.",
  "evidence": "§ 558 Abs. 3 BGB: السقف القانوني «nicht um mehr als 20 vom Hundert … (Kappungsgrenze)» وينخفض إلى «15 vom Hundert» في الأقاليم المحدّدة بأمر ولائي — لا 11٪. § 558c Abs. 1 BGB: «Ein Mietspiegel ist eine Übersicht über die ortsübliche Vergleichsmiete» — بيان أسعار السوق لا نصّ السقف. ويشارك الشرحان العربيان Q0/Q1 في الأثر (11٪ «سقف الـKappungsgrenze»).",
  "modified": False,
  "whyNotModified": "الألماني وشرح الأسئلة محتوى مقفل لا يُعدَّل داخل دورات المراجعة العربية؛ والتوثيق هنا للتعديل في دورة محتوى معتمدة.",
  "recommendation": "إن أُقرّت دورة تعديل محتوى: «elf Prozent» ← «fünfzehn Prozent» (أو «zwanzig Prozent» بحسب الإقليم) مع إسناد السقف إلى «§ 558 BGB» بدل المؤشّر، وتحديث شرحَي Q0/Q1 (11٪ ← السقف الصحيح). والعربية تبقى أمينة للنص الحالي حتى ذلك الحين."},
]

CONTENT_CHECKS = [
 "d-b2-10: الأرقام متسقة داخلياً: مطالبة 48.000 ← عرض 45.000 + حصة متغيّرة ← تسوية 45.500 + يومان منزليًّا + 400 ميزانية؛ ومفتاح Q0 يطابق التسوية («Dann 45.500…»).",
 "d-b2-10: شرح Q1 يوثّق الفخّين (العرض الإضافي ليس شرطاً؛ ووقت التدريب يُحتسب أداءً لا أجراً)، وشرح Q2 يوثّق أن التعهد يشمل الصفقة كاملة — الأسئلة المقفلة سليمة.",
 "d-b2-11: الحساب الداخلي متسق: زيادة معلَنة 15٪ ← تصحيح 9,8٪؛ والمهلة «binnen vierzehn Tagen» ظاهرة في الشرح كما في السطر بعد تصحيح «أسبوعَين».",
 "d-b2-11: الفئة النظامية: النص يسمّي سقفاً «أحد عشر بالمئة» لا وجود له (§ 558 Abs. 3: 20٪/15٪) وينسبه إلى المؤشّر (§ 558c: بيان أسعار) — وُثّق في W6 دون تعديل؛ والتصحيح إلى 9,8٪ يبقى سليماً تحت أي سقف قانوني.",
 "d-b2-12: «Regulär drei Monate» = المهلة النظامية للبتّ (BQFG § 6 Abs. 3: ثلاثة أشهر بعد اكتمال الأوراق) — متسقة مع شرح Q2 («مدّة فحص الطلب»).",
 "d-b2-12: «Anpassungslehrgang … höchstens 16 Monate Praxis» ضمن المدى الممكن إجراءً تعويضياً (تصل مدّته في تنظيمات إلى ثلاث سنوات، مثل AV-L بريمن) — لا تعارض يُوثَّق.",
 "d-b2-12: وثائق Q0 («Beglaubigte Übersetzung, Fächerübersicht, Nachweis praktischer Tätigkeiten») أُبقيت كما في المفتاح؛ و«Landrecht» = قانون الولاية (ملاحظة توثيقية للمعجم).",
]

by = {d["id"]: d for d in D}
scope = []
units = lt = qt = dt = 0
for did in SCOPE:
    dlg = by[did]; lines = dlg["lines"]; qs = dlg["questions"]; dc = dlg.get("dictation") or []
    lu = sum(len([k for k in ln if k in ("who", "de", "ar")]) for ln in lines)
    qu = sum(len(q) for q in qs); u = 4 + lu + qu + len(dc)
    units += u; lt += len(lines); qt += len(qs); dt += len(dc)
    scope.append({"id": did, "level": dlg["level"], "titleDe": dlg["titleDe"], "titleAr": dlg["titleAr"],
                  "lines": len(lines), "questions": len(qs), "dictation": len(dc), "units": u,
                  "hasWaisenField": "waisen" in dlg, "who": sorted({ln["who"] for ln in lines})})

ah = []
def walk(n):
    if isinstance(n, dict):
        if isinstance(n.get("id"), str) and n["id"] in SCOPE: ah.append(n["id"])
        for v in n.values(): walk(v)
    elif isinstance(n, list):
        for v in n: walk(v)
walk(AUDIO)
mh = []
for tid in SCOPE: mh.extend(glob.glob(str(ROOT / "public" / "audio" / "**" / f"*{tid}*.mp3"), recursive=True))

rep = {
 "reviewRule": "R126", "date": "2026-10-08",
 "scope": "رابع دفعة B2: d-b2-10..12 (مفاوضة أجر في مقابلة عمل، تفاوض إيجاري خطّي، اعتراف بالشهادة الأجنبية) — الحوارات الثلاثة بلا waisen.",
 "dialogues": scope,
 "totals": {"dialogues": 3, "lines": lt, "questions": qt, "dictation": dt, "approximateUnits": units},
 "corrections": CORRECTIONS, "contextNotes": CONTEXT_NOTES, "styleAlternatives": STYLE_ALTERNATIVES, "sources": SOURCES,
 "contentWarnings": CONTENT_WARNINGS, "contentChecks": CONTENT_CHECKS,
 "audio": {"manifestEntries": ah, "mp3Files": mh, "note": "لا استماع ولا ادعاء صوتي."},
 "waisen": {"present": False, "note": "الحوارات الثلاثة بلا حقل waisen (فحص صريح لكل كائن)."},
 "judgement": {"correct": units - len(CORRECTIONS), "corrected": len(CORRECTIONS), "unresolved": 0,
  "note": "ستة عشر تصحيحاً عربياً مؤكّداً: d-b2-10 (7): «وقتكم» (Sie)، و«يخطر ببالكم أجرياً» (vorschweben)، و«أبلغُ» (auf eine Summe kommen)، و«نطاقَنا/حصةٍ متغيّرةٍ/قابلٌ للتفاوض» (Rahmen/variabler Anteil/verhandelbar)، و«أداءً» (Leistung)، و«ألّا تتجاوزَ فترةُ التجربةِ…» (begrenzen auf + مفتاح Q1)، و«سيصلُكم التعهدُ» (Zusage + Sie)؛ d-b2-11 (4): «أدلتُنا/حسابُ الجدوى» (Belege/Berechnung)، و«رسالتكم» (Ihr)، و«أربعةَ عشرَ يوماً/مع الأدلة» (binnen vierzehn Tagen/Belege)، و«مؤكَّدٌ بالبريد…إدارةِ النقاشِ بموضوعيةٍ» (Zustandspassiv/sachlich/Gesprächsführung)؛ d-b2-12 (5): «قائمةُ الموادِّ الدراسية…إثباتُ الخبرةِ العملية» (Fächerübersicht/حذف «سنوات»)، و«فحصُ الطلب…خلاله» (Prüfung/währenddessen)، و«إذنِ مزاولةِ المهنة…نعم، عملٌ مقيَّد» (Berufserlaubnis/الترتيب)، و«إليكم دورةٌ تكييفية…من الممارسةِ العملية» (Sie/المفرد/ Praxis)، و«دفعةً مقدَّمة» (Vorauszahlung). جديد التحذيرات: W6 (سقف «11٪» في d-b2-11.L2 — لا وجود نظامياً وينسب خطأً إلى المؤشّر) موثَّق دون تعديل؛ وW5 (d-b2-02.Q0 «Digitalisung») يبقى مفتوحاً كما وُثِّق في R123. الألماني/who/الأسئلة/المفاتيح/الإملاءات/الخيارات/الشرح مقفلة لم تُعدَّل."},
 "limits": {"cefr": "لم يُعد تقييم CEFR أو النسبة.", "audio": "لا استماع ولا توليد صوتي.", "human": "ليست مراجعة بشرية.",
            "legal": "سياق قانوني عام (إيجار/BQFG): التصحيحات لغوية-مصطلحية، وW6 توثيق تحريري لا فتوى — وليست مشورة قانونية.",
            "medical": "لا محتوى طبي في هذه الدفعة.",
            "professional": "لا توصيات مهنية أو مالية؛ حوارات توظيف وإدارة إيجار وإجراءات اعتراف — مفردات لا نصائح."},
 "gates": {"planned": "K200a–j"},
}
OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
OUT_JSON.write_text(json.dumps(rep, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

md = []
md.append("# مراجعة حوارات B2 دفعة 04: d-b2-10–d-b2-12\n\n")
md.append("**التاريخ:** 2026-10-08 · **القاعدة:** R126 · **البوابات:** K200a–j\n\n")
md.append("## النطاق\n\n"); md.append(f"{rep['scope']}\n\n")
md.append("## الإجمالي\n\n"); t = rep["totals"]
md.append(f"- حوارات: **{t['dialogues']}** · أسطر: **{t['lines']}** · أسئلة: **{t['questions']}** · إملاءات: **{t['dictation']}** · وحدات≈**{t['approximateUnits']}**\n\n")
md.append("## الحكم\n\n"); j = rep["judgement"]
md.append(f"- **سليمة:** {j['correct']} · **مصححة:** {j['corrected']} · **غير محسومة:** {j['unresolved']}\n- {j['note']}\n\n")
md.append("## التصحيحات المطبقة\n\n")
for c in rep["corrections"]: md.append(f"- `{c['unit']}`: من «{c['old']}» إلى «{c['new']}» — {c['rationale']}\n")
md.append("\n## تحذيرات محتوى (غير معدّلة)\n\n")
if rep["contentWarnings"]:
    for w in rep["contentWarnings"]:
        md.append(f"### {w['id']} — {w['dialogue']} · `{w['field']}`\n")
        md.append(f"- **الملاحظة:** {w['statement']}\n- **الأدلة:** {w['evidence']}\n")
        md.append(f"- **معدّلة؟:** {'نعم' if w['modified'] else 'لا'} — {w['whyNotModified']}\n- **التوصية:** {w['recommendation']}\n")
else:
    md.append("- لا تحذيرات محتوى جديدة في هذه الدفعة (W5 من الدفعة الأولى يبقى مفتوحاً كما وُثِّق هناك).\n")
md.append("\n## فحوص المحتوى\n\n")
for chk in rep["contentChecks"]: md.append(f"- {chk}\n")
md.append("\n## ملاحظات سياقية (غير معدّلة)\n\n")
for did, ns in rep["contextNotes"].items():
    md.append(f"### {did}\n")
    for n in ns: md.append(f"- {n['note']}\n  - المصدر: {n['source']}\n")
md.append("\n## بدائل أسلوبية (غير معدّلة)\n\n")
for did, al in rep["styleAlternatives"].items():
    md.append(f"### {did}\n")
    for a in al: md.append(f"- `{a['phrase']}` — بديل: `{a['alternative']}` — {a['note']}\n")
md.append("\n## المصادر\n\n"); ts = 0
for did, sl in rep["sources"].items():
    md.append(f"### {did}\n")
    for s in sl: md.append(f"- [{s['id']}] {s['citation']} — {s['url']}\n"); ts += 1
md.append(f"\n(مجموع المراجع: {ts}.)\n\n")
md.append("## الصوت\n\n")
md.append(f"- إدخالات بيان صوتي: {rep['audio']['manifestEntries'] or 'لا يوجد'}.\n- ملفات mp3: {rep['audio']['mp3Files'] or 'لا يوجد'}.\n- {rep['audio']['note']}\n\n")
md.append("## البطاقات اليتيمة\n\n- " + rep["waisen"]["note"] + "\n\n")
md.append("## الحدود\n\n")
for k, v in rep["limits"].items(): md.append(f"- **{k}:** {v}\n")
OUT_MD.write_text("".join(md), encoding="utf-8")
print(f"Wrote {OUT_JSON.name} and {OUT_MD.name}")
print(f"  lines={lt} q={qt} dict={dt} ≈units={units} corrections={len(CORRECTIONS)} warnings={len(CONTENT_WARNINGS)}")
print(f"  sources={ts} audio={len(ah)}/{len(mh)}")

if __name__ == "__main__": pass
