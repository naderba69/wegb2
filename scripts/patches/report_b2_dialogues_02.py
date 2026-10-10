#!/usr/bin/env python3
"""R124 — review report for second B2 batch d-b2-04..d-b2-06."""
from __future__ import annotations
import json, glob
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
D = json.loads((ROOT / "content/dialogues.json").read_text(encoding="utf-8"))
AUDIO = json.loads((ROOT / "content/dialog-audio.json").read_text(encoding="utf-8"))
SCOPE = ["d-b2-04", "d-b2-05", "d-b2-06"]
OUT_JSON = ROOT / "docs/content-review-b2-dialogues-02-2026-10-08.json"
OUT_MD = ROOT / "docs/content-review-b2-dialogues-02-2026-10-08.md"

CORRECTIONS = [
 {"unit": "d-b2-04.lines[0].ar", "old": "أودّ الحديث عن تعويضي.", "new": "أودّ الحديث عن أجري.",
  "rationale": "«Vergütung» = الأجر/المقابل عن العمل (DWDS: «das Bezahlen, Entlohnen einer (Arbeits-)Leistung … Arbeitsentgelt, Kostenerstattung») لا «التعويض»، وهو في الملف للمقابل عن خسارةٍ أو فوات: d-b2-27.L2 «أتنازلتُ عن التعويض» (Schadensersatz)، d-b2-16.L6 «أفُرصةُ تعويض؟» (Nachschreibtermin)، d-b2-23.L0 «تعويضُها» (Ausgleich)؛ والاسم «الأجر» ثابت في d-b2-10.L1 «أجرياً» (tariflich)."},
 {"unit": "d-b2-04.lines[4].ar", "old": "بشرط تعهد مكتوب للعام القادم أكون موافقاً.", "new": "بشرط تعهد خطي للعام القادم أكون موافقاً.",
  "rationale": "توحيد «schriftlich» بسنّة الملف «خطي»: d-b2-17.L6 «اتفاقٌ خطيٌّ»، d-b2-20.L7 «خطيًّا»، d-b2-22.L3 «الخطيةِ»، d-b2-10.L7 «خطياً» (Duden: «durch Aufschreiben, Niederschreiben festgehalten»)؛ و«Zusage» = تعهد/وعد ملزم (Duden: «Zusicherung, sich … jemandes Wünschen entsprechend zu verhalten»)، فبقي «تعهد» وحُدِّد النعت «خطي»."},
 {"unit": "d-b2-05.lines[1].ar", "old": "اللغة ساحرة وإن بدت الحبكة متوقعة قليلاً.", "new": "اللغة بارعة وإن بدت الحبكة متوقعة قليلاً.",
  "rationale": "«brillant» = بارع/بديع/باهر (Duden: «glänzend, hervorragend, sehr gut»، Beispiel «eine brillante Rede»)؛ و«ساحرة» تنقل لون الفتنة السحرية لا الجودة الفنية."},
 {"unit": "d-b2-05.lines[2].ar", "old": "أنا أرى العكس. تطوّر الشخصيات يقنعني تحديداً.", "new": "أنا أرى الأمر على نحوٍ آخر. تطوّر الشخصيات تحديداً هو ما يقنعني.",
  "rationale": "(أ) «anders» = «على نحوٍ آخر/مختلف» (Duden: «auf andere, abweichende Art und Weise, abweichend, verschieden») لا «العكس» (Gegenteil). (ب) «gerade» تقييد قصرٍ: «تطوّر الشخصيات تحديداً هو ما يقنعني» أفصح من «يقنعني تحديداً»."},
 {"unit": "d-b2-05.lines[3].ar", "old": "أعترف، الشخصية الرئيسية مصمّمة بطبقات معقّدة.", "new": "أعترف، الشخصية الرئيسية مصمّمة على طبقات متعددة.",
  "rationale": "«vielschichtig» حرفياً «متعدد الطبقات»؛ DWDS: المعنى 1 «in vielen Schichten»، والثاني «aus vielen verschiedenartigen Komponenten zusammengesetzt, kompliziert» («ein vielschichtiger Charakter»)؛ و«معقّدة» تحذف «viel-» وتقدّم المعنى الثاني على الأول في وصف بناء الشخصية."},
 {"unit": "d-b2-06.lines[1].ar", "old": "استبدال المعلّم خطأ مفاهيمي. الذكاء الاصطناعي يُعدّ لكنه لا يربّي.", "new": "استبدال المعلّم خطأ مفاهيمي. الذكاء الاصطناعي يستطيع التحضير لكنه لا يربّي.",
  "rationale": "(أ) «يُعدّ» المكتوبة بلا حركة على العين تلتبس بـ«يُعَدّ» (يُعتبر)، والمماثل في الملف بمعنى الاحتساب: d-b2-10.L4 «أَعُدُّ … إيراداً». (ب) «vorbereiten» هنا = تحضير الدروس (Duden: «der Lehrer bereitet seinen Unterricht, eine Stunde vor») والمصدر «التحضير» يحفظ حذف المفعول كما في «kann vorbereiten». (ج) «يحضّر» ثابت في الملف: d-a2-23.Q0 «الأم تحضّر الأطباق»."},
 {"unit": "d-b2-06.lines[4].ar", "old": "في الاعتماد: من يستهلك النتائج فقط ينسى التفكير.", "new": "في الاعتماد: من يستهلك النتائج فقط يفقد القدرة على التفكير.",
  "rationale": "«verlernen» = فقدان مهارة مكتسبة بالإهمال (WAHRIG/DWDS: «etwas, das man gelernt hat, nicht mehr können»؛ thefreedictionary: «eine Fähigkeit durch Nichtgebrauch verlieren») لا مجرّد «ينسى»؛ و«يفقد» ثابت في الملف: d-b1-01.L1 «لكنه يفقد التواصل»."},
]

CONTEXT_NOTES = {
 "d-b2-04": [
  {"note": "«Das ist nachvollziehbar» = «هذا مفهوم» مطابقة (DWDS: «gedanklich oder gefühlsmäßig zu begreifen»)، وهي السنّة التي ثبّتها تصحيح R123 في d-b2-01.L5 — لا تعديل على L3.", "source": "dwds.de/wb/nachvollziehbar: gedanklich oder gefühlsmäßig zu begreifen, verstehen + سابقة d-b2-01.L5 (R123)."},
  {"note": "«Spielräume … begrenzt» = «هامش المناورة … محدود» مقبولة بوصف الجمع مجموعاً (DWDS: Spielraum مجازاً = Bewegungsfreiheit؛ Handlungsspielraum = «(in der Regel begrenzter) Umfang an Möglichkeiten») — البديل الأسلوبي بجمعٍ صريح أدناه.", "source": "dwds.de/wb/Spielraum: «[übertragen] Bewegungsfreiheit» · dwds.de/wb/Handlungsspielraum: «(in der Regel begrenzter) Umfang an Möglichkeiten»."},
  {"note": "«Allerdings» = «غير أن» تعارض قوي مطابق (DWDS/Duden: allerdings = jedoch, freilich) — لا تعديل على L3.", "source": "سياق تعارض «Allerdings sind die Spielräume dieses Jahr begrenzt» (content/dialogues.json، الألماني المقفل)."},
  {"note": "سجلّ المخاطبة: الرئيسة تخاطب الموظف بـSie صراحةً («Welche Argumente bringen Sie vor?») فالعربية بالجمع «تطرحونها» — مطابق للألماني المقفل؛ و«vorbringen» = طرح الحجة/سوقها.", "source": "النص الألماني المقفل في content/dialogues.json + قاعدة المراجعة R124."},
  {"note": "اتساق السؤال: شرط الموظف في Q1 «eine schriftliche Zusage für nächstes Jahr» يطابق L4 حرفياً بعد التصحيح («تعهد خطي للعام القادم»)، وشرح Q1 يميّز حجّته الماضية عن شرطه.", "source": "content/dialogues.json: d-b2-04.questions[1] وexplanationAr (مقفلان)."},
 ],
 "d-b2-05": [
  {"note": "«wenngleich» = «وإنْ» تعارضٌ مساوٍ لـobwohl مع فعلٍ في الآخر («der Plot etwas vorhersehbar wirkt») — الترجمة «وإن بدت» مطابقة، لا تعديل.", "source": "سياق «Die Sprache ist brillant, wenngleich der Plot etwas vorhersehbar wirkt» (الألماني المقفل)."},
  {"note": "«vorhersehbar» = «متوقعة» مطابقة (etwas, was man vorhersehen kann)، و«etwas» = «قليلاً» نقلها سليم — لا تعديل.", "source": "سياق L1 (الألماني المقفل) + قاعدة المراجعة R124."},
  {"note": "«Zugegeben» = إقرارٌ تمهيدي («أعترف») مطابق، وهو أسلوب حوار الكتاب المتنازَع فيه — أُبقي كما هو.", "source": "سياق L3 (الألماني المقفل)."},
  {"note": "«Es lohnt sich, es zweimal zu lesen»: الضمير الأول حشوٌ صوري والثاني للكتاب، و«يستحق أن يُقرأ مرتين» تنقلهما بنقاءٍ («sich lohnen» = يستحق) — لا تعديل، وشرح Q1 مطابق.", "source": "content/dialogues.json: d-b2-05.lines[5] وquestions[1].explanationAr (مقفلان)."},
  {"note": "سجلّ الحوار: Helena وKarim على «du» («Was hältst du»، «empfehlst du») فالعربية بالمفرد: «ما رأيك»، «تنصح» — مطابق للألماني المقفل.", "source": "النص الألماني المقفل في content/dialogues.json + قاعدة المراجعة R124."},
 ],
 "d-b2-06": [
  {"note": "«Kategorienfehler» مصطلح فلسفي (Gilbert Ryle: category mistake)، و«خطأ مفاهيمي» تبسيط مقبول لسياق المنصّة التربوية — لا تعديل، مع بديل أدقّ أدناه.", "source": "سياق L1 (الألماني المقفل: «Einen Lehrer zu ersetzen, wäre ein Kategorienfehler»)."},
  {"note": "«sofern» = «بشرط» مطابقة (sofern = unter der Bedingung, dass / wenn nur) — لا تعديل على L2.", "source": "سياق L2 (الألماني المقفل) + قاعدة المراجعة R124."},
  {"note": "«Urteilskraft» = «القدرة على الحكم» مطابقة تماماً لتعريفَي DWDS («Fähigkeit, sachlich zu urteilen») وDuden («Fähigkeit, etwas zu beurteilen»)؛ وعلامتا التنصيص في السطر لهما سابقة داخل الملف (d-b1-16.L3، d-a2-23.L7، d-a1-24.L4) — لا تعديل، والبديل الأسلوبي أدناه.", "source": "dwds.de/wb/Urteilskraft: Fähigkeit, sachlich zu urteilen · duden.de/rechtschreibung/Urteilskraft: Fähigkeit, etwas zu beurteilen."},
  {"note": "«Wer nur noch Ergebnisse konsumiert»: «nur noch» حصرٌ بما بعد الآن (لم يعد إلا)، و«فقط» تنقل الحصر دون «لم يعد» — البديل الأسلوبي أدناه، والتصحيح انصبّ على «verlernt» لا على الحصر.", "source": "سياق L4 (الألماني المقفل) + قاعدة المراجعة R124."},
  {"note": "سجلّ المنصّة: ثلاثة أصوات (Moderation/Prof. Weber/Dr. Saleh) بلا مخاطبة مباشرة ولا ضمير مخاطب — والعربية خالية من ضمير المخاطب في الحوار كله، مطابقةً للألماني المقفل.", "source": "النص الألماني المقفل في content/dialogues.json + قاعدة المراجعة R124."},
 ],
}

STYLE_ALTERNATIVES = {
 "d-b2-04": [
  {"phrase": "بشرط تعهد خطي للعام القادم أكون موافقاً", "alternative": "بشرط وعدٍ خطيٍّ للسنة القادمة لكنتُ موافقاً", "note": "«Unter der Bedingung einer schriftlichen Zusage … wäre ich einverstanden» — «وعدٌ» ألين و«لكنتُ» أفصح شرطاً، والأصل المثبَت أوفى بنبرة التساوض المهني."},
  {"phrase": "هامش المناورة هذا العام محدود", "alternative": "الهوامش هذا العام محدودة", "note": "«Spielräume» (جمع) — الجمع العربي الصريح أدقّ إفراداً لفظيّاً، والاسم المفرد مجموعٌ مقبول."},
  {"phrase": "ما الحجج التي تطرحونها؟", "alternative": "ما هي الحجج التي تسوقونها؟", "note": "«vorbringen» = طرح/سوق الحجة؛ كلتاهما مطابقة، والأولى أرشق في الحوار."},
 ],
 "d-b2-05": [
  {"phrase": "اللغة بارعة", "alternative": "اللغة باهرة", "note": "«brillant» (Duden: glänzend, hervorragend) — «باهرة» تحفظ صلة «blendend» باللمعان، و«بارعة» أخفّ في النقد الأدبي."},
  {"phrase": "أنا أرى الأمر على نحوٍ آخر", "alternative": "لكني أرى غير ذلك", "note": "«Das sehe ich anders» — كلتاهما تنقل الاختلاف لا التقابل، والثانية أهدأ في المخالفة."},
  {"phrase": "مصمّمة على طبقات متعددة", "alternative": "مصوغة بأوجهٍ متعددة", "note": "«vielschichtig angelegt» — «بأوجه» تنقل التركيب المتنوع، و«على طبقات» أقرب إلى الصورة الحرفية (Schichten)."},
 ],
 "d-b2-06": [
  {"phrase": "خطأ مفاهيمي", "alternative": "خطأ في التصنيف (فئوي)", "note": "«Kategorienfehler» — البديل أدقّ فلسفياً (category mistake)، والأصل تبسيط مقبول للسيناريو."},
  {"phrase": "يفقد القدرة على التفكير", "alternative": "يفقد مهارة التفكير", "note": "«verlernt das Denken» — «مهارة» تبرز «ver-» (فقدان ما تُعلّم)، و«القدرة» أوضح للمتعلم."},
  {"phrase": "من يستهلك النتائج فقط", "alternative": "من لم يعد يستهلك إلا النتائج", "note": "«Wer nur noch Ergebnisse konsumiert» — البديل يستوفي «nur noch» (بعد الآن) صراحةً."},
 ],
}

SOURCES = {
 "d-b2-04": [
  {"id": "S1", "citation": "DWDS: Vergütung — «das Bezahlen, Entlohnen einer (Arbeits-)Leistung, das Erstatten von Unkosten … Arbeitsentgelt, Kostenerstattung»", "url": "https://www.dwds.de/wb/Verg%C3%BCtung"},
  {"id": "S2", "citation": "Duden: Zusage — 2. «Zusicherung, sich in einer bestimmten Angelegenheit jemandes Wünschen entsprechend zu verhalten» («bindende Zusagen geben»؛ typische Verbindung: «schriftlich»)", "url": "https://www.duden.de/rechtschreibung/Zusage"},
  {"id": "S3", "citation": "Duden: schriftlich — «durch Aufschreiben, Niederschreiben festgehalten; in geschriebener Form» («eine schriftliche Erklärung abgeben»)", "url": "https://www.duden.de/rechtschreibung/schriftlich"},
  {"id": "S4", "citation": "DWDS: nachvollziehbar — «gedanklich oder gefühlsmäßig zu begreifen, verstehen» (syn. verständlich, begreiflich)", "url": "https://www.dwds.de/wb/nachvollziehbar"},
 ],
 "d-b2-05": [
  {"id": "S5", "citation": "Duden: brillant — «glänzend, hervorragend, sehr gut» («eine brillante Rede», «ein brillanter Einfall»)", "url": "https://www.duden.de/rechtschreibung/brillant"},
  {"id": "S6", "citation": "Duden: anders — «auf andere, abweichende Art und Weise, abweichend, verschieden» («anders denken, handeln, fühlen»)", "url": "https://www.duden.de/rechtschreibung/anders"},
  {"id": "S7", "citation": "DWDS: vielschichtig — 1. «in vielen Schichten»؛ 2. «aus vielen verschiedenartigen Komponenten zusammengesetzt, kompliziert» («ein vielschichtiger Charakter»)", "url": "https://www.dwds.de/wb/vielschichtig"},
  {"id": "S8", "citation": "DWDS (WDG, 1974): vielschichtig — «ein v. Charakter; er ist eine v. Persönlichkeit; in diesem Roman wurden psychologische Probleme v. gestaltet»", "url": "https://www.dwds.de/wb/wdg/vielschichtig"},
 ],
 "d-b2-06": [
  {"id": "S9", "citation": "Duden: vorbereiten — 2. «die notwendigen Arbeiten für etwas im Voraus erledigen» («der Lehrer bereitet seinen Unterricht, eine Stunde vor»)", "url": "https://www.duden.de/rechtschreibung/vorbereiten"},
  {"id": "S10", "citation": "DWDS (WAHRIG): verlernen — «etwas, das man gelernt hat, nicht mehr können» («das Schwimmen verlernt man nicht»)", "url": "https://www.dwds.de/wb/wdw/verlernen"},
  {"id": "S11", "citation": "thefreedictionary.com: verlernen — «eine Fähigkeit durch Nichtgebrauch verlieren»", "url": "https://de.thefreedictionary.com/verlernen"},
  {"id": "S12", "citation": "DWDS: Urteilskraft — «Fähigkeit, sachlich zu urteilen»؛ duden.de: «Fähigkeit, etwas zu beurteilen»", "url": "https://www.dwds.de/wb/Urteilskraft"},
  {"id": "S13", "citation": "DWDS: Spielraum — «[übertragen] Bewegungsfreiheit»؛ Handlungsspielraum — «(in der Regel begrenzter) Umfang an Möglichkeiten, die sich bieten …» (Kollokation «begrenzen»)", "url": "https://www.dwds.de/wb/Handlungsspielraum"},
 ],
}

CONTENT_WARNINGS: list = []

CONTENT_CHECKS = [
 "d-b2-04: «Vergütung» = الأجر/المقابل عن العمل (DWDS) لا «التعويض» فصُحّح L0؛ و«Spielräume … begrenzt» = «هامش المناورة … محدود» مطابقة (DWDS: Spielraum مجازاً Bewegungsfreiheit) — لا تعديل على L3.",
 "d-b2-04: «Das ist nachvollziehbar» = «هذا مفهوم» مطابقة بسنّة R123، وصيغة الشرط «wäre ich einverstanden» نقلها «أكون موافقاً» نقلاً سليماً — لا تعديل على L4 غير «مكتوب» ← «خطي».",
 "d-b2-04: شرط Q1 «eine schriftliche Zusage für nächstes Jahr» يطابق L4 حرفياً بعد التصحيح («تعهد خطي للعام القادم»)؛ وشرحه يميّز الحجّة الماضية عن الشرط.",
 "d-b2-05: «brillant» (Duden: glänzend, hervorragend) ← «بارعة»؛ و«anders» (Duden: auf andere, abweichende Art und Weise) ← «على نحوٍ آخر» لا «العكس»؛ و«vielschichtig» (DWDS: in vielen Schichten) ← «على طبقات متعددة».",
 "d-b2-05: «sich lohnen» = يستحق — شرح Q1 مطابق، والمفتاح «lohnt sich» مأخوذ من L5؛ و«Also … trotzdem?» = «إذن … رغم ذلك؟» بنمط R122 (trotzdem = رغم ذلك) — لا تعديل.",
 "d-b2-06: «vorbereiten» (Duden: der Lehrer bereitet seinen Unterricht vor) ← «يستطيع التحضير»، و«verlernen» (WAHRIG: nicht mehr können) ← «يفقد القدرة على التفكير»، و«Urteilskraft» (DWDS/Duden) = «القدرة على الحكم» مطابقة.",
 "d-b2-06: «Kategorienfehler» = خطأ مفاهيمي/فئوي، و«sofern» = بشرط، وQ0/Q1 مفتاحاهما مطابقان للسطور المقفلة — لا تعديل على الألماني ولا على الأسئلة.",
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
 "reviewRule": "R124", "date": "2026-10-08",
 "scope": "ثاني دفعة B2: d-b2-04..06 (تفاوض على الراتب، مناقشة كتاب، منصّة الذكاء الاصطناعي في التعليم) — الحوارات الثلاثة بلا waisen.",
 "dialogues": scope,
 "totals": {"dialogues": 3, "lines": lt, "questions": qt, "dictation": dt, "approximateUnits": units},
 "corrections": CORRECTIONS, "contextNotes": CONTEXT_NOTES, "styleAlternatives": STYLE_ALTERNATIVES, "sources": SOURCES,
 "contentWarnings": CONTENT_WARNINGS, "contentChecks": CONTENT_CHECKS,
 "audio": {"manifestEntries": ah, "mp3Files": mh, "note": "لا استماع ولا ادعاء صوتي."},
 "waisen": {"present": False, "note": "الحوارات الثلاثة بلا حقل waisen (فحص صريح لكل كائن)."},
 "judgement": {"correct": units - len(CORRECTIONS), "corrected": len(CORRECTIONS), "unresolved": 0,
  "note": "سبعة تصحيحات عربية مؤكدة: «Vergütung» ← «أجري» لا «تعويضي» (ونمط «التعويض» في الملف للمقابل عن خسارة/فوات)، وتوحيد «schriftlich» بسنّة الملف «خطي» («تعهد خطي»)، و«brillant» ← «بارعة» لا «ساحرة»، و«Das sehe ich anders» ← «أرى الأمر على نحوٍ آخر» لا «العكس» مع تقديم القصر «تطوّر الشخصيات تحديداً هو ما يقنعني»، و«vielschichtig» ← «على طبقات متعددة» لا «معقّدة»، ورفع لبس «يُعدّ» ← «يستطيع التحضير» (vorbereiten بمعنى تحضير الدروس)، و«verlernt das Denken» ← «يفقد القدرة على التفكير» لا «ينسى». لا تحذيرات نصية جديدة في هذه الدفعة — W5 (d-b2-02) يبقى مفتوحاً كما وُثِّق في تقرير الدفعة الأولى. الألماني/who/الأسئلة/المفاتيح/الإملاءات/الخيارات/الشرح مقفلة لم تُعدَّل."},
 "limits": {"cefr": "لم يُعد تقييم CEFR أو النسبة.", "audio": "لا استماع ولا توليد صوتي.", "human": "ليست مراجعة بشرية.",
            "legal": "محتوى الدفعة مهني/أدبي/تربوي عام بلا ادعاءات قانونية — والمراجعة ليست مشورة قانونية.",
            "medical": "لا محتوى طبي في هذه الدفعة.",
            "professional": "لا توصيات مهنية أو مالية؛ «تفاوض الراتب» و«منصّة الذكاء الاصطناعي» مفردات حوارية لا نصائح."},
 "gates": {"planned": "K198a–j"},
}
OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
OUT_JSON.write_text(json.dumps(rep, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

md = []
md.append("# مراجعة حوارات B2 دفعة 02: d-b2-04–d-b2-06\n\n")
md.append("**التاريخ:** 2026-10-08 · **القاعدة:** R124 · **البوابات:** K198a–j\n\n")
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
