#!/usr/bin/env python3
"""R123 — review report for first B2 batch d-b2-01..d-b2-03."""
from __future__ import annotations
import json, glob
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
D = json.loads((ROOT / "content/dialogues.json").read_text(encoding="utf-8"))
AUDIO = json.loads((ROOT / "content/dialog-audio.json").read_text(encoding="utf-8"))
SCOPE = ["d-b2-01", "d-b2-02", "d-b2-03"]
OUT_JSON = ROOT / "docs/content-review-b2-dialogues-01-2026-10-08.json"
OUT_MD = ROOT / "docs/content-review-b2-dialogues-01-2026-10-08.md"

CORRECTIONS = [
 {"unit": "d-b2-01.lines[0].ar", "old": "سيدتي بيرغر، كيف تقيّمون سياسة المناخ حتى الآن؟", "new": "سيدة بيرغر، كيف تقيّمون سياسة المناخ حتى الآن؟",
  "rationale": "«Frau Berger» نداءً = «سيدة بيرغر» بنمط الملف (d-b2-08.L0 «سيدة حداد»، d-a2-07.L0 «يا سيدة كلاين»)؛ و«سيدتي» نداءُ تملكٍ لا مقابل له في الألماني (والضمير «تقيّمون» يطابق Sie الصريح)."},
 {"unit": "d-b2-01.lines[3].ar", "old": "الأمر يتعلق باستثمارات مستدامة. بدونها ستكون كل الأهداف وهمية.", "new": "الأمر يتعلق باستثمارات مستدامة. بدونها لكانت كل الأهداف وهمية.",
  "rationale": "«wären alle Ziele illusorisch» صيغة مخالفة للواقع (Konjunktiv II)، و«ستكون» تقلبها وعداً مستقبلياً؛ النمط الداخلي في المخالفة: d-b1-01.L3 «لو كانت لدى الشركة قواعد جيدة لوافقتُ»."},
 {"unit": "d-b2-01.lines[4].ar", "old": "الحكومة تعتبر بالأرقام أنها كافية.", "new": "في المقابل، ترى الحكومة أن الأرقام كافية.",
  "rationale": "(أ) «hält dagegen» = في المقابل/ردّاً على ذلك. (ب) «تعتبر بالأرقام أنها» تركيب ركيك وضميره ملتبس؛ والصواب «ترى أن الأرقام كافية» كما في معنى «für ausreichend halten»."},
 {"unit": "d-b2-01.lines[5].ar", "old": "هذا التفاؤل، بلطف شديد، يصعب تبريره.", "new": "هذا التفاؤل، بعبارةٍ لطيفة، يصعب فهمه.",
  "rationale": "(أ) «gelinde gesagt» = «بعبارةٍ لطيفة/وبصياغةٍ مخفَّفة» (DWDS: «etwas mit einem gelinden Ausdruck, Wort bezeichnen») لا «بلطف شديد». (ب) «nachvollziehbar» = مفهوم/مُستساغ، ونمط الملف «هذا مفهوم» (d-b2-04.L3) لا «تبريره»."},
 {"unit": "d-b2-02.lines[3].ar", "old": "بالطبع. الحاسم أن التدريبات التي خططنا لها تجري موازية.", "new": "بالطبع. الحاسم أن الدورات التدريبية التي خططنا لها تجري بالتوازي.",
  "rationale": "(أ) «Schulungen» = دورات تدريبية، و«التدريبات» تلتبس بـ«تدريب» بمعنى Praktikum المستعمل في d-b1-23. (ب) «تجري موازية» بلا متعلِّق ركيكة؛ و«begleitend stattfinden» = «تجري بالتوازي» (DWDS: begleitend ≈ gleichzeitig, parallel)."},
 {"unit": "d-b2-03.lines[0].ar", "old": "هل قرأت المقال؟ من المزعوم أن الشركة صفّحت الأرقام.", "new": "هل قرأت المقال؟ يُقالُ إنّ الشركةَ جمّلت الأرقام.",
  "rationale": "(أ) «schönen» = تجميل الأرقام/تزيينها (Duden: «schöner, angenehmer, besser erscheinen lassen»؛ Synonyme: beschönigen, frisieren, schönfärben) لا «تصحيحها» — خطأ معنى صريح. (ب) «angeblich» = «يُقال إنّ»، و«من المزعوم أن» تركيب ركيك."},
 {"unit": "d-b2-03.lines[3].ar", "old": "بالضبط. بدون بيانات موثوقة يكون الاستنتاج بلا مصداقية.", "new": "بالضبط. بدون بيانات موثوقة يكون الاستنتاج باطلاً.",
  "rationale": "«hinfällig» = باطل/غير ذي مفعول (Duden: gegenstandslos, ungültig؛ thefreedictionary: nicht mehr gültig) لا «بلا مصداقية»."},
]

CONTEXT_NOTES = {
 "d-b2-01": [
  {"note": "«gelinde gesagt» تعبير اصطلاحي معناه «بعبارةٍ لطيفة/وبصياغةٍ مخفَّفة» (DWDS: «diese Maßnahme scheint mir, gelinde gesagt, etwas übertrieben»)؛ فـ«بلطف شديد» كانت ستُقرأ صفةً للطف المخاطب لا تخفيفاً للحكم.", "source": "dwds.de/wb/gelinde: «etw. mit einem gelinden Ausdruck, Wort bezeichnen»."},
  {"note": "«schwer nachvollziehbar» = يصعب فهمه/استساغته؛ ونمط الملف يقابل «nachvollziehbar» بـ«مفهوم» في d-b2-04.L3، فصُحّح «يصعب تبريره» إلى «يصعب فهمه».", "source": "dwds.de/wb/nachvollziehbar: gedanklich oder gefühlsmäßig zu begreifen, verstehen · مقارنة داخلية d-b2-04.L3."},
  {"note": "«Ohne sie wären alle Ziele illusorisch» مخالفة للواقع (Konjunktiv II)، والعربية الفصيحة تنقلها بلام الجواب «لكانت»؛ والنمط الداخلي في المخالفة d-b1-01.L3.", "source": "duden.de: Konjunktiv I oder II (Vergangenheitsform = Irrealis) + قاعدة المراجعة R123."},
  {"note": "«bei Weitem nicht ausreichen» = «لا تكفي إطلاقاً» مطابقة (DWDS: bei Weitem nicht = längst nicht, ganz und gar nicht, beileibe nicht) — لا تعديل على L1.", "source": "dwds.de/wb/bei Weitem: «⟨bei Weitem nicht (= längst nicht, ganz und gar nicht)⟩»."},
  {"note": "سجلّ المخاطبة: المقدِّمة تخاطب بيرغر بـSie صراحةً («wie bewerten Sie») فالعربية بالجمع «تقيّمون» — مطابق للألماني المقفل.", "source": "النص الألماني المقفل في content/dialogues.json + قاعدة المراجعة R123."},
 ],
 "d-b2-02": [
  {"note": "«Schulungen» = دورات/جلسات تدريبية؛ و«التدريبات» كانت تلتبس بـ«تدريب» (Praktikum) في d-b1-23 «تدريبكِ العملي»، فحُدِّدت «الدورات التدريبية».", "source": "مقارنة داخلية (d-b1-23) + سياق الحوار المهني."},
  {"note": "«begleitend stattfinden» = أن تجري مواكِبةً للتنفيذ؛ وDWDS يضع begleitend في صفّ gleichzeitig/parallel، فصُحّح «تجري بالتوازي».", "source": "dwds.de/wb/parallel: «begleitend · gleichzeitig · parallel»."},
  {"note": "«voraussetzen» = يستلزم/يفترض شرطاً مسبقاً (DWDS: «es als wahr, als möglich oder wirklich annehmen»)، وشرح Q0 «etwas voraussetzen = يستلزم» مطابق — لا تعديل على L1.", "source": "dwds.de/wb/dwb/voraussetzen · dwds.de/wb/dwb/voraussetzen (DWB)."},
  {"note": "«Gleichwohl» = مع ذلك/رغم ذلك (أدبية أعلى من trotzdem)، والترجمة «مع ذلك» مطابقة — لا تعديل على L2.", "source": "dwds.de/wb/dwb/gleichwohl: «als adversativadverb 'dennoch, trotzdem'»."},
  {"note": "خلل نصّي في الألماني المقفل: questions[0].promptDe «Die Digitalisung …» بلا «er» (والصواب Digitalisierung كما في السطر والإملاء) — وُثِّق W5 غير معدّل.", "source": "content/dialogues.json: d-b2-02.lines[1].de وdictation[0] («Digitalisierung») مقابل questions[0].promptDe."},
 ],
 "d-b2-03": [
  {"note": "«schönen» = تجميل الأرقام وتزيينها (Duden: schöner erscheinen lassen؛ beschönigen/frisieren)، وليس تصحيحاً؛ ولذلك صُحّح «صفّحت الأرقام» إلى «جمّلت الأرقام».", "source": "duden.de/rechtschreibung/schoenen · dict.cc: die Zahlen schönen = to massage the figures."},
  {"note": "«hinfällig» = باطل/غير ذي مفعول (Duden: gegenstandslos, ungültig)، فصُحّح «بلا مصداقية» إلى «باطلاً»؛ و«belastbare Daten» = بيانات صلبة/موثوقة فبقيت «موثوقة».", "source": "duden.de/rechtschreibung/hinfaellig: «gegenstandslos, ungültig»."},
  {"note": "«Konzern» = مجمّعة/مجموعة شركات؛ أُبقيت «الشركة» تبسيطاً مقبولاً للسيناريو (مع بديل أسلوبي «المجموعة») حفاظاً على اتساق شرح Q0 الذي يسمّيها «الشركة».", "source": "سياق SZ-Titel «Medienkritik» + شرح Q0 في content/dialogues.json."},
  {"note": "«seriös» = ذو مصداقية/جدّي؛ و«nicht besonders seriös» = «ليس موثوقاً بقدر كبير» مقبولة في L1 — لا تعديل، مع بديل أسلوبي.", "source": "سياق Q0 (خيارات seriös) + دلالة nicht besonders."},
 ],
}

STYLE_ALTERNATIVES = {
 "d-b2-01": [
  {"phrase": "بعبارةٍ لطيفة", "alternative": "بلغةٍ ألطف", "note": "«gelinde gesagt» — كلتاهما تؤدي التخفيف القصدي قبل الحكم."},
  {"phrase": "بدونها لكانت كل الأهداف وهمية", "alternative": "لولاها لكانت كل الأهداف وهمية", "note": "«Ohne sie wären …» — «لولا» أفصح في الشرط الممتنع، و«بدونها» أقرب إلى اللفظ الألماني."},
  {"phrase": "لا تكفي إطلاقاً", "alternative": "لا تكفي بأي حال", "note": "«bei Weitem nicht ausreichen» — كلتاهما مطابقة (DWDS: längst nicht / ganz und gar nicht)."},
 ],
 "d-b2-02": [
  {"phrase": "تجري بالتوازي", "alternative": "تواكب التنفيذ خطوةً بخطوة", "note": "«begleitend stattfinden» — الأولى أدقّ لفظاً والثانية أوسع شرحاً."},
  {"phrase": "الدورات التدريبية", "alternative": "الجلسات التدريبية", "note": "«Schulungen» — كلتاهما تفصل المعنى عن Praktikum."},
 ],
 "d-b2-03": [
  {"phrase": "جمّلت الأرقام", "alternative": "زيّنت الأرقام", "note": "«die Zahlen schönen» — كلتاهما تنقل التجميل لا التصحيح."},
  {"phrase": "الشركة", "alternative": "المجموعة", "note": "«Konzern» — البديل أدقّ مؤسسياً، والأصل تبسيط مقبول للسيناريو."},
  {"phrase": "يكون الاستنتاج باطلاً", "alternative": "يسقط الاستنتاج", "note": "«hinfällig» — «باطل» أدقّ حكماً و«يسقط» ألين تعبيراً."},
 ],
}

SOURCES = {
 "d-b2-01": [
  {"id": "S1", "citation": "duden.de: Konjunktiv I oder II — Vergangenheitsform des Konjunktiv II als Irrealis («hätte ich sie abgeholt»)", "url": "https://www.duden.de/sprachwissen/sprachratgeber/konjunktiv-1-oder-2"},
  {"id": "S2", "citation": "DWDS: nachvollziehbar — gedanklich oder gefühlsmäßig zu begreifen, verstehen (Synonym verständlich, begreiflich)", "url": "https://www.dwds.de/wb/nachvollziehbar"},
  {"id": "S3", "citation": "DWDS: gelinde — «etw. mit einem gelinden Ausdruck, Wort bezeichnen»; umgangssprachlich «gelinde gesagt»", "url": "https://www.dwds.de/wb/gelinde"},
  {"id": "S4", "citation": "DWDS: bei Weitem — «⟨bei Weitem nicht (= längst nicht, ganz und gar nicht)⟩» mit Beispiel «bei weitem nicht ausreichen»", "url": "https://www.dwds.de/wb/bei%20Weitem"},
 ],
 "d-b2-02": [
  {"id": "S5", "citation": "DWDS (DWB): voraussetzen — «etwas voraussetzen, es als wahr, als möglich oder wirklich annehmen»", "url": "https://www.dwds.de/wb/dwb/voraussetzen"},
  {"id": "S6", "citation": "DWDS: parallel — «begleitend · gleichzeitig · parallel»; «parallel laufen, stattfinden»", "url": "https://www.dwds.de/wb/parallel"},
  {"id": "S7", "citation": "DWDS (DWB): gleichwohl — «als adversativadverb 'dennoch, trotzdem'»", "url": "https://www.dwds.de/wb/dwb/gleichwohl"},
 ],
 "d-b2-03": [
  {"id": "S8", "citation": "duden.de: schönen — «schöner, angenehmer, besser erscheinen lassen» (Synonyme: beschönigen, frisieren, schönfärben; «eine geschönte Bilanz»)", "url": "https://www.duden.de/rechtschreibung/schoenen"},
  {"id": "S9", "citation": "dict.cc: die Zahlen schönen = to massage the figures (idiom)", "url": "https://m.dict.cc/deutsch-englisch/die+Zahlen+sch%C3%B6nen.html"},
  {"id": "S10", "citation": "duden.de: hinfällig — 2. gegenstandslos, ungültig («die Pläne sind nunmehr hinfällig»)", "url": "https://www.duden.de/rechtschreibung/hinfaellig"},
  {"id": "S11", "citation": "thefreedictionary.com: hinfällig — «nicht mehr gültig» (≈ gegenstandslos, ungültig)", "url": "https://de.thefreedictionary.com/hinf%C3%A4llig"},
 ],
}

CONTENT_WARNINGS = [
 {"id": "W5", "dialogue": "d-b2-02", "field": "questions[0].promptDe",
  "statement": "«Die Digitalisung setzt eine Infrastruktur ___.»: كلمة «Digitalisung» ناقصة «er» والصواب «Digitalisierung» — وهي مكتوبة صحيحةً في سطر الحوار L1 وفي الإملاء D0، فالأرجح خطأ طباعي في نصّ السؤال.",
  "evidence": "content/dialogues.json: d-b2-02.lines[1].de = «Die Digitalisierung setzt eine Infrastruktur voraus …» · d-b2-02.dictation[0] = «Die Digitalisierung setzt eine Infrastruktur voraus.» مقابل questions[0].promptDe = «Die Digitalisung …».",
  "modified": False,
  "whyNotModified": "نصّ السؤال الألماني من الحقول المقفلة في هذه السلسلة (مراجعة عربية فقط)؛ وتعديله يمسّ promptDe مباشرةً.",
  "recommendation": "مهمة محتوى منفصلة: تصحيح «Digitalisung» إلى «Digitalisierung» في questions[0].promptDe (تغيير حرفَي «er» بلا أثر على المفتاح «voraus»)."},
]

CONTENT_CHECKS = [
 "d-b2-01: «bei Weitem nicht ausreichen» = «لا تكفي إطلاقاً» مطابقة (DWDS: längst nicht / ganz und gar nicht) — لا تعديل على L1.",
 "d-b2-01: «wären … illusorisch» مخالفة للواقع (Konjunktiv II) فصُحّحت إلى «لكانت»، بنمط الملف في المخالفة (d-b1-01.L3).",
 "d-b2-02: «voraussetzen» = يستلزم (DWDS DWB) وشرح Q0 مطابق — لا تعديل على L1؛ والمفتاح «voraus» يُقرأ من الإملاء نفسه.",
 "d-b2-02: «Gleichwohl» = مع ذلك/dennoch, trotzdem (DWDS DWB) — الترجمة مطابقة، و«Dann» في L4 قابَلها الملف بـ«إذن».",
 "d-b2-03: «schönen» = تجميل الأرقام لا تصحيحها (Duden) فصُحّح L0؛ و«hinfällig» = باطل/غير ذي مفعول (Duden) فصُحّح L3.",
 "d-b2-03: «seriös» = ذو مصداقية؛ و«nicht besonders seriös» = «ليس موثوقاً بقدر كبير» مقبولة في L1 — لا تعديل.",
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
 "reviewRule": "R123", "date": "2026-10-08",
 "scope": "أول دفعة B2: d-b2-01..03 (مقابلة سياسة المناخ، حوار مهني عن الرقمنة، نقد إعلامي) — الحوارات الثلاثة بلا waisen.",
 "dialogues": scope,
 "totals": {"dialogues": 3, "lines": lt, "questions": qt, "dictation": dt, "approximateUnits": units},
 "corrections": CORRECTIONS, "contextNotes": CONTEXT_NOTES, "styleAlternatives": STYLE_ALTERNATIVES, "sources": SOURCES,
 "contentWarnings": CONTENT_WARNINGS, "contentChecks": CONTENT_CHECKS,
 "audio": {"manifestEntries": ah, "mp3Files": mh, "note": "لا استماع ولا ادعاء صوتي."},
 "waisen": {"present": False, "note": "الحوارات الثلاثة بلا حقل waisen (فحص صريح لكل كائن)."},
 "judgement": {"correct": units - len(CORRECTIONS), "corrected": len(CORRECTIONS), "unresolved": 0,
  "note": "سبعة تصحيحات عربية مؤكدة: نداء Frau X («سيدة» بنمط الملف لا «سيدتي»)، والمخالفة الواقعية («wären … illusorisch» ← «لكانت» لا «ستكون»)، و«hält dagegen/für ausreichend» («في المقابل، ترى الحكومة أن الأرقام كافية»)، واصطلاح «gelinde gesagt» و«nachvollziehbar» («بعبارةٍ لطيفة…يصعب فهمه»)، وفصل Schulungen عن «تدريب/Praktikum» وإصلاح «تجري موازية» ← «تجري بالتوازي»، وخطأ المعنى schönen («جمّلت الأرقام» لا «صفّحت»)، ودقة hinfällig («باطلاً» لا «بلا مصداقية»). وُثِّق W5: خطأ طباعي في الألماني المقفل «Digitalisung». الألماني/who/الأسئلة/المفاتيح/الإملاءات/الخيارات/الشرح مقفلة لم تُعدَّل."},
 "limits": {"cefr": "لم يُعد تقييم CEFR أو النسبة.", "audio": "لا استماع ولا توليد صوتي.", "human": "ليست مراجعة بشرية.",
            "legal": "محتوى الدفعة سياسي عام/مهني/إعلامي بلا ادعاءات قانونية — والمراجعة ليست مشورة قانونية.",
            "medical": "لا محتوى طبي في هذه الدفعة.",
            "professional": "لا توصيات مهنية أو مالية؛ «استثمارات مستدامة» و«الرقمنة» مفردات حوارية لا نصائح."},
 "gates": {"planned": "K197a–j"},
}
OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
OUT_JSON.write_text(json.dumps(rep, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

md = []
md.append("# مراجعة حوارات B2 دفعة 01: d-b2-01–d-b2-03\n\n")
md.append("**التاريخ:** 2026-10-08 · **القاعدة:** R123 · **البوابات:** K197a–j\n\n")
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
    md.append("- لا تحذيرات محتوى في هذه الدفعة.\n")
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
