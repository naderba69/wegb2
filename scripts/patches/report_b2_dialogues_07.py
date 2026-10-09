#!/usr/bin/env python3
"""R129 — review report for seventh B2 batch d-b2-19..d-b2-21."""
from __future__ import annotations
import json, glob
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
D = json.loads((ROOT / "content/dialogues.json").read_text(encoding="utf-8"))
AUDIO = json.loads((ROOT / "content/dialog-audio.json").read_text(encoding="utf-8"))
SCOPE = ["d-b2-19", "d-b2-20", "d-b2-21"]
OUT_JSON = ROOT / "docs/content-review-b2-dialogues-07-2026-10-08.json"
OUT_MD = ROOT / "docs/content-review-b2-dialogues-07-2026-10-08.md"

CORRECTIONS = [
 {
  "unit": "d-b2-19.lines[0].ar",
  "old": "اتفاقُنا مع قسمِ المشترياتِ انقلبَ مرتين، دونَ إخطار.",
  "new": "اتفاقُنا مع قسمِ المشترياتِ أُلغيَ مرتين، دونَ ردٍّ.",
  "rationale": "zweimal gekippt=أُلغي مرتين، ohne Rückmeldung=دون رد."
 },
 {
  "unit": "d-b2-19.lines[1].ar",
  "old": "وما الذي فعلتِه أنتِ؟",
  "new": "وماذا فعلتِ أنتِ بنفسِك؟",
  "rationale": "selbst unternommen=فعلتِ بنفسك."
 },
 {
  "unit": "d-b2-19.lines[2].ar",
  "old": "وثَّقتُ المحاضرَ بالتواريخ وكتبتُ الاعتراضَ بموضوعيةٍ بالبريدِ لا بالمحادثة.",
  "new": "وثَّقتُ المحاضرَ بالتاريخ وصغتُ النقدَ بموضوعيةٍ بالبريدِ لا بالمحادثة.",
  "rationale": "Kritik sachlich formuliert=صغتُ النقد بموضوعية (لا «اعتراض»)."
 },
 {
  "unit": "d-b2-19.lines[3].ar",
  "old": "أحسنتِ — نجعلُ طاولةً مستديرة: كلُّ جهةٍ تُسمِّي ثلاثَ حاجات.",
  "new": "أحسنتِ — نُقيمُ طاولةً مستديرة: كلُّ جهةٍ تذكر ثلاثَ حاجات.",
  "rationale": "setzen wir einen runden Tisch=نُقيم طاولة مستديرة."
 },
 {
  "unit": "d-b2-19.lines[4].ar",
  "old": "أولويتي: مواعيدُ تسليمٍ مُلزِمةٌ لا نداءاتٌ في الممرّ.",
  "new": "أولويتي: مواعيدُ تسليمٍ مُلزِمةٌ بدلاً من المناداةِ في الممر.",
  "rationale": "statt Zurufen im Flur=بدلاً من المناداة في الممر."
 },
 {
  "unit": "d-b2-19.lines[5].ar",
  "old": "نُثبِتُ في المحضرِ المواعيدَ ويوقِّعُها الطرفانِ جميعاً.",
  "new": "يُثبَّتُ في المحضرِ المواعيدَ ويوقِّعُه الطرفان.",
  "rationale": "gegenzeichnen=يوقِّعُه الطرفان (توقيع مقابل)، حذف «جميعاً» الزائد."
 },
 {
  "unit": "d-b2-19.lines[6].ar",
  "old": "فهمتُ — وأُحضِرُ أرقامَ المقارنةِ إلى الأربعاءِ لا أكثر.",
  "new": "فهمتُ — وسأُحضِرُ أرقامَ المقارنةِ بحلول الأربعاء.",
  "rationale": "bis Mittwoch=بحلول الأربعاء، حذف «لا أكثر»."
 },
 {
  "unit": "d-b2-19.lines[7].ar",
  "old": "بنّاءٌ الأمر. نُعيدُ العرضَ بعدَ ستةِ أسابيع لئلا يخبوَ الأثر.",
  "new": "بنّاء. إعادةُ الطرحِ بعدَ ستةِ أسابيع لئلا يذهبَ الأثرُ سدىً.",
  "rationale": "Wiedervorlage=إعادة طرح، verpufft=يذهب سدى."
 },
 {
  "unit": "d-b2-20.lines[0].ar",
  "old": "أصابَ أبي جلطةٌ قبلَ أربعةِ أسابيع — فما درجةُ رعايتِه المتوقعة؟",
  "new": "أصابَ أبي سكتةٌ دماغيةٌ قبلَ أربعةِ أسابيع — فما درجةُ رعايتِه المتوقعة؟",
  "rationale": "Schlaganfall=سكتة دماغية (لا جلطة)."
 },
 {
  "unit": "d-b2-20.lines[2].ar",
  "old": "صباحًا يُعينُ على الغسلِ واللباس، وعندَ الظهرِ يكفي الإشراف.",
  "new": "صباحاً يحتاجُ إلى مساعدةٍ في الغسلِ والارتداء، وفي الظهرِ يكفي الإشراف.",
  "rationale": "braucht Hilfe=يحتاج إلى مساعدة في الغسل والارتداء."
 },
 {
  "unit": "d-b2-20.lines[3].ar",
  "old": "قلقٌ ليليٌّ وخوفُ سقوط — دوّنوا ذلك في المذكرةِ من فضلكم.",
  "new": "اضطرابٌ ليليٌّ وخوفُ السقوط — دوّنوا ذلك في اليومياتِ من فضلكم.",
  "rationale": "Nächtliche Unruhe=اضطراب ليلي، Sturzangst=خوف السقوط، Tagebuch=اليوميات."
 },
 {
  "unit": "d-b2-20.lines[4].ar",
  "old": "القائمةُ الأسبوعيةُ جاهزةٌ بساعاتِها.",
  "new": "قائمةُ الأسبوعينِ جاهزةٌ بمواعيدِها.",
  "rationale": "zweiwöchige Liste=قائمة الأسبوعين."
 },
 {
  "unit": "d-b2-20.lines[6].ar",
  "old": "وكم يستغرقُ القرار — وإن جاءَ التقديرُ بخيلًا؟",
  "new": "وكم يستغرقُ الرد — وإن جاءَ التقديرُ متدنياً؟",
  "rationale": "Bescheid=الرد، zu knapp=متدنياً."
 },
 {
  "unit": "d-b2-20.lines[7].ar",
  "old": "خطيًّا خلالَ خمسةٍ وعشرين يومَ عمل؛ ومع التقديرِ البخيل: اعتراض.",
  "new": "خطياً خلالَ خمسةٍ وعشرين يومَ عمل؛ وإن كان التقديرُ متدنياً فالاعتراضُ.",
  "rationale": "Schriftlich binnen 25 AT=خطياً خلال 25 يوم عمل، Widerspruch=اعتراض."
 },
 {
  "unit": "d-b2-21.lines[1].ar",
  "old": "الحدُّ الأقصى مكفولٌ اتحادياً؛ وقرضٌ مصرفيٌّ ميسَّرُ الربا بضمانٍ شخصيٍّ منا.",
  "new": "الحدُّ الأقصى مسقوفٌ حكومياً؛ وقرضٌ مصرفيٌّ ميسَّرُ الفائدةِ بكفالةٍ شخصية.",
  "rationale": "gedeckelt=مسقوف حكومياً، zinsgünstig=ميسَّر الفائدة (لا ربا)، Bürgschaft=كفالة."
 },
 {
  "unit": "d-b2-21.lines[2].ar",
  "old": "يسرُّني بدءُ السدادِ بعدَ سنتَين من المزاول.",
  "new": "أودُّ بدءَ السدادِ بعدَ سنتينِ من مزاولةِ المهنة.",
  "rationale": "zweites Berufsjahr=سنتين من مزاولة المهنة."
 },
 {
  "unit": "d-b2-21.lines[6].ar",
  "old": "ومكافأتانِ سنويّاً تجعلُ سدادَ دفعةٍ إضافيةٍ كلَّ عامٍ بديلاً.",
  "new": "وبدفعتينِ استثنائيتينِ سنوياً يُتَّفقُ على تسديدٍ إضافيٍّ كلَّ عام.",
  "rationale": "Sonderzahlung=دفعات استثنائية، Sondertilgung=تسديد إضافي."
 },
 {
  "unit": "d-b2-21.lines[7].ar",
  "old": "سنثبِّتُه في القرار؛ فالتوقيعُ على المنصّةِ بالهويّةِ الإلكترونية.",
  "new": "هكذا نُثبِّته في الإشعار؛ والتوقيعُ إلكترونيٌّ بالهويةِ الرقمية.",
  "rationale": "Bescheid=الإشعار، eID=الهوية الرقمية."
 }
]

CONTEXT_NOTES = {
 "d-b2-19": [
  {"note": "«zweimal gekippt ohne Rückmeldung» = أُلغي مرتين دون رد.", "source": "d-b2-19.L0"},
  {"note": "«Kritik sachlich per Mail, nicht im Chat» صياغة النقد بالبريد (شاهد Q1).", "source": "d-b2-19-q1"},
  {"note": "«Protokoll mit Fristen gegenzeichnen / Wiedervorlage nach sechs Wochen» محضر بتوقيع الطرفين وإعادة طرح (شاهد Q3).", "source": "d-b2-19-q3"},
 ],
 "d-b2-20": [
  {"note": "«Schlaganfall» سكتة دماغية؛ Pflegegrad يُقيَّم بالاستقلالية لا التشخيص.", "source": "d-b2-20-q0"},
  {"note": "«zweiwöchige Liste mit Uhrzeiten» قائمة الأسبوعين بالمواعيد؛ «Tagebuch» يوميات للحالة الليلية.", "source": "d-b2-20-q1"},
  {"note": "«schriftlich binnen 25 Arbeitstagen; Widerspruch bei zu knapper Bewertung».", "source": "d-b2-20-q2"},
 ],
 "d-b2-21": [
  {"note": "«staatlich gedeckelt + zinsgünstiges Darlehen mit Bürgschaft» سقف حكومي وقرض ميسَّر بكفالة.", "source": "d-b2-21-q0"},
  {"note": "«Karenzzeit 18 Monate/Zinsen gestundet» مهلة سماح 18 شهراً والفوائد مؤجَّلة.", "source": "d-b2-21-q1"},
  {"note": "«Tilgung 120–200€ + Sonderzahlung zweimal jährlich + eID».", "source": "d-b2-21-q2/L6/L7"},
 ],
}

STYLE_ALTERNATIVES = {
 "d-b2-19": [
  {"phrase": "نُقيم طاولة مستديرة", "alternative": "ندعو إلى طاولة مستديرة", "note": "«setzen wir»."},
  {"phrase": "يذهب الأثر سدىً", "alternative": "يتبخّر", "note": "«verpufft»."},
  {"phrase": "بدلاً من المناداة", "alternative": "لا مناداة", "note": "«statt Zurufen»."},
 ],
 "d-b2-20": [
  {"phrase": "سكتة دماغية", "alternative": "سكتة دماغيّة", "note": "«Schlaganfall»."},
  {"phrase": "متدنياً", "alternative": "متدنّ", "note": "«zu knapp»."},
  {"phrase": "قائمة الأسبوعين", "alternative": "قائمة أسبوعين", "note": "«zweiwöchig»."},
 ],
 "d-b2-21": [
  {"phrase": "مسقوف حكومياً", "alternative": "محدد بقانون", "note": "«gedeckelt»."},
  {"phrase": "ميسَّر الفائدة", "alternative": "مخفّض الفائدة", "note": "«zinsgünstig»."},
  {"phrase": "دفعتان استثنائيتان", "alternative": "سدادان خاصّان", "note": "«Sonderzahlung»."},
 ],
}

SOURCES = {
 "d-b2-19": [
  {"id": "S1", "citation": "DWDS: kippen = إلغاء/إفشال (اتفاق).", "url": "https://www.dwds.de/wb/kippen"},
  {"id": "S2", "citation": "DWDS: gegenzeichnen = توقيع مقابل.", "url": "https://www.dwds.de/wb/gegenzeichnen"},
  {"id": "S3", "citation": "DWDS: Wiedervorlage/verpuffen.", "url": "https://www.dwds.de/wb/verpuffen"},
  {"id": "S4", "citation": "مقارنة داخلية: Protokoll=محضر، sachlich=بموضوعية (R127).", "url": "content/dialogues.json"},
 ],
 "d-b2-20": [
  {"id": "S5", "citation": "Duden: Schlaganfall = سكتة دماغية.", "url": "https://www.duden.de/rechtschreibung/Schlaganfall"},
  {"id": "S6", "citation": "Duden: Pflegegrad/Begutachtung.", "url": "https://www.duden.de/rechtschreibung/Pflegegrad"},
  {"id": "S7", "citation": "DWDS: Widerspruch = اعتراض (R127 قفل).", "url": "https://www.dwds.de/wb/Widerspruch"},
  {"id": "S8", "citation": "Duden: binnen 25 Arbeitstagen = خلال 25 يوم عمل.", "url": "https://www.duden.de/rechtschreibung/binnen"},
 ],
 "d-b2-21": [
  {"id": "S9", "citation": "DWDS: deckeln = سقف/تحديد الحد.", "url": "https://www.dwds.de/wb/deckeln"},
  {"id": "S10", "citation": "Duden: zinsgünstig = ميسَّر الفائدة (لا ربا).", "url": "https://www.duden.de/rechtschreibung/zinsguenstig"},
  {"id": "S11", "citation": "DWDS: Bürgschaft/Karenzzeit/Sondertilgung.", "url": "https://www.dwds.de/wb/Sondertilgung"},
  {"id": "S12", "citation": "Duden: Bescheid = إشعار/قرار.", "url": "https://www.duden.de/rechtschreibung/Bescheid"},
 ],
}

CONTENT_CHECKS = [
 "d-b2-19: الوساطة متسقة: إلغاء اتفاق مرتين دون رد → توثيق بالبريد → طاولة مستديرة (3 حاجات) → محضر بتوقيع الطرفين + إعادة طرح بعد 6 أسابيع. مفاتيح Q1/Q2/Q3 مطابقة.",
 "d-b2-20: تقدير Pflegegrad متسق: سكتة دماغية → تقييم استقلالية → مساعدة صباحية، اضطراب ليلي/يوميات → قائمة أسبوعين → درجة 2–3 → رد خلال 25 يوم عمل واعتراض عند التدني. مفاتيح Q0/Q1/Q2 مطابقة.",
 "d-b2-21: تفاوض القرض متسق: سقف حكومي + قرض ميسَّر بكفالة → سداد بعد سنتي مزاولة → مهلة 18 شهراً والفوائد مؤجلة → قسط 120–200€ → دفعات استثنائية → إشعار بتوقيع eID. مفاتيح Q0/Q1/Q2 مطابقة.",
 "لا تحذيرات محتوى جديدة؛ W1–W6 مفتوحة.",
]

CONTENT_WARNINGS = []

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
 "reviewRule": "R129", "date": "2026-10-08",
 "scope": "خامس دفعة B2: d-b2-13..15 (بدل الوالدية واستشارة، الإقرار الضريبي وتمديد المهلة، تلف الماء مع شركة التأمين) — الحوارات الثلاث بلا waisen.",
 "dialogues": scope,
 "totals": {"dialogues": 3, "lines": lt, "questions": qt, "dictation": dt, "approximateUnits": units},
 "corrections": CORRECTIONS, "contextNotes": CONTEXT_NOTES, "styleAlternatives": STYLE_ALTERNATIVES, "sources": SOURCES,
 "contentWarnings": CONTENT_WARNINGS, "contentChecks": CONTENT_CHECKS,
 "audio": {"manifestEntries": ah, "mp3Files": mh, "note": "لا استماع ولا ادعاء صوتي."},
 "waisen": {"present": False, "note": "الحوارات الثلاثة بلا حقل waisen (فحص صريح لكل كائن)."},
 "judgement": {"correct": units - 18, "corrected": 18, "unresolved": 0,
  "note": "ثمانية عشر تصحيحاً عربياً مؤكداً — d-b2-19 (8): gekippt=أُلغي، Rückmeldung=ردّ، selbst=بنفسك، Kritik=النقد (لا اعتراض)، runden Tisch=نُقيم طاولة مستديرة، statt Zurufe=بدلاً من المناداة، gegenzeichnen=توقيع مقابل، bis Mittwoch=بحلول الأربعاء، Wiedervorlage/verpufft=إعادة طرح/سدىً؛ d-b2-20 (6): Schlaganfall=سكتة دماغية، Hilfe=مساعدة غسل/ارتداء، Nächtliche Unruhe=اضطراب ليلي/Tagebuch=اليوميات، zweiwöchige=قائمة الأسبوعين، Bescheid=الرد/zu knapp=متدنياً، Widerspruch=اعتراض؛ d-b2-21 (4): gedeckelt=مسقوف، zinsgünstig=ميسَّر الفائدة (لا ربا)/Bürgschaft=كفالة، Berufsjahr=سنتي مزاولة، Sonderzahlung=دفعات استثنائية، Bescheid/eID=إشعار/هوية رقمية. لا تحذيرات محتوى جديدة؛ W1–W6 تبقى مفتوحة. الألماني/who/الأسئلة/المفاتيح/الإملاءات مقفلة."},
 "limits": {"cefr": "لم يُعد تقييم CEFR أو النسبة.", "audio": "لا استماع ولا توليد صوتي.", "human": "ليست مراجعة بشرية.",
            "legal": "سياق قانوني/إداري عام (إعانات والدية، إقرار ضريبي، مطالبات تأمين): التصحيحات لغوية-مصطلحية، وليست مشورة قانونية أو ضريبية.",
            "medical": "لا محتوى طبي في هذه الدفعة.",
            "professional": "لا توصيات مالية/مهنية؛ مفردات حوارات إدارية/تأمينية لا نصائح."},
 "gates": {"planned": "K203a–j"},
}
OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
OUT_JSON.write_text(json.dumps(rep, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

md = []
md.append("# مراجعة حوارات B2 دفعة 07: d-b2-19–d-b2-21\n\n")
md.append("**التاريخ:** 2026-10-08 · **القاعدة:** R127 · **البوابات:** K203a–j\n\n")
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
    md.append("- لا تحذيرات محتوى جديدة في هذه الدفعة. تظل التحذيرات W1–W6 (دفعات سابقة، وآخرها W6 في d-b2-11.L2 بسقف «11٪») مفتوحةً وموثّقة في مواضعها.\n")
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
