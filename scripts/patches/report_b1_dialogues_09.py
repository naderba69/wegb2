#!/usr/bin/env python3
"""R122 — review report for ninth (final) B1 batch d-b1-31..d-b1-32."""
from __future__ import annotations
import json, glob
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
D = json.loads((ROOT / "content/dialogues.json").read_text(encoding="utf-8"))
AUDIO = json.loads((ROOT / "content/dialog-audio.json").read_text(encoding="utf-8"))
SCOPE = ["d-b1-31", "d-b1-32"]
OUT_JSON = ROOT / "docs/content-review-b1-dialogues-09-2026-10-08.json"
OUT_MD = ROOT / "docs/content-review-b1-dialogues-09-2026-10-08.md"

CORRECTIONS = [
 {"unit": "d-b1-31.lines[2].ar", "old": "أتفهَّمُ ذلك. ومع هذا كانت مكالمةٌ قصيرةٌ لتكفي.", "new": "أتفهَّمُ ذلك. ومع ذلك كانت تكفي مكالمةٌ قصيرة.",
  "rationale": "(أ) «hätte gereicht» صيغة مخالفة للواقع (Konjunktiv II der Vergangenheit): الفعل لم يقع؛ و«كانت … لتكفي» (كان + لام + مضارع منصوب) تفيد القدر/التحقيق لا المخالفة، فالصواب «كانت تكفي» (نمط الملف: d-b1-01.L3 «لو كانت … لوافقتُ»). (ب) «Trotzdem» يُترجَم في الملف «ومع ذلك» (d-b1-01.L2) لا «ومع هذا»."},
 {"unit": "d-b1-31.lines[4].ar", "old": "حسناً. نثبّتُ الأمرَ هكذا.", "new": "حسناً. إذن نثبّتُ الأمرَ هكذا.",
  "rationale": "«Dann halten wir das so fest»: سقطت «Dann» في العربية؛ والنمط الداخلي يترجمها «إذن» (d-b1-14.L5 «استريحوا إذن»، d-b2-02.L4 «إذن نواصل مع الجدول الزمني»)."},
 {"unit": "d-b1-32.lines[2].ar", "old": "هذا يزولُ غالباً. المهمُّ أن يقرأَ بصوتٍ عالٍ أكثر.", "new": "هذا يزولُ غالباً. المهمُّ أن يُكثِرَ من القراءةِ بصوتٍ عالٍ.",
  "rationale": "«öfter laut liest»: «öfter» اسم تفضيل من «oft» (=häufiger، تكرار أعلى)، وإلصاق «أكثر» بـ«عالٍ» يُوهم زيادة علوّ الصوت؛ «يُكثِر من القراءة» ينقل التكرار وحده."},
 {"unit": "d-b1-32.lines[4].ar", "old": "خمسَ عشرةَ دقيقةً تكفي إن كانَ بانتظام.", "new": "خمسَ عشرةَ دقيقةً تكفي إن كانَ ذلك بانتظامٍ.",
  "rationale": "«wenn es regelmäßig geschieht»: «es» فاعل غائب في العربية؛ «كان» بلا مرفوع تُقرأ عاميّة، فيُضاف «ذلك» ويُتمّ التنوين «بانتظامٍ» (والشرط في الانتظام كما في شرح Q1)."},
]

CONTEXT_NOTES = {
 "d-b1-31": [
  {"note": "«Trotzdem» ظرف ربط (Konjunktionaladverb) يتصدّر الجملة ويلزم الفعل الموضع الثاني — وشرح Q1 في الملف («بعدَه الفعلُ مباشرةً») مطابق للقاعدة، والتصحيح يحفظ النمط.", "source": "deutschakademie.de: trotzdem (Verb Position 2) · deutschegrammatik20.de: dennoch/trotzdem."},
  {"note": "«hätte gereicht» صيغة المخالفة الواقعية في الماضي (Konjunktiv II der Vergangenheit): الشرط لم يتحقق فلم تقع المكالمة القصيرة أصلاً — ولذلك استُبدلت «لتكفي» بـ«كانت تكفي».", "source": "duden.de: Konjunktiv I oder II — Vergangenheitsform = Irrealis («hätte abgeholt»)."},
  {"note": "«unter großem Zeitdruck» تعبير اصطلاحي مثبت (unter Zeitdruck stehen/arbeiten/geraten) والعربية «تحت ضغطِ وقتٍ شديد» تؤدي المعنى — تُركت مع بديل أسلوبي.", "source": "dwds.de/wb/Zeitdruck: «unter Zeitdruck stehen, arbeiten, geraten»."},
  {"note": "سجلّ المخاطبة: Nadia تخاطب Jonas بضمير المفرد المذكّر وJonas يخاطبها بكاف المؤنث («معكِ») — مطابق للألماني المقفل (du/du).", "source": "النص الألماني المقفل في content/dialogues.json + قاعدة المراجعة R122."},
 ],
 "d-b1-32": [
  {"note": "«sich melden» في الصف = طلب الكلمة برفع اليد، فـ«قلَّما يرفع يده» ترجمة سليمة لـ«meldet sich selten» (لا «يشارك»).", "source": "dwds.de/wb/melden: ⟨sich melden⟩ (durch Handzeichen) ums Wort bitten · thefreedictionary.com: in der Schule die Hand heben."},
  {"note": "«öfter» صيغة تفضيل من «oft» (häufiger، تكرار أعلى) لا «أعلى صوتاً»؛ ولذلك صُحِّحت L2 إلى «يُكثِر من القراءة».", "source": "schuelerhilfe.de: öfter = Komparativ zu oft."},
  {"note": "«Das legt sich meistens» = nachlassen/aufhören («das legt sich bald wieder»)؛ «هذا يزولُ غالباً» مقبولة ولا تعديل.", "source": "duden.de/rechtschreibung/legen: 6. nachlassen, aufhören, schwinden."},
  {"note": "«Fünfzehn Minuten täglich» توصية المعلمة داخل السيناريو التعليمي بشرط الانتظام (كما في شرح Q1) — ليست قاعدة تربوية موثّقة ولا تُمنح قوة توصية معتمدة.", "source": "شرح Q1 في content/dialogues.json + حدود المراجعة (ليست مراجعة تربوية)."},
 ],
}

STYLE_ALTERNATIVES = {
 "d-b1-31": [
  {"phrase": "ومع ذلك كانت تكفي مكالمةٌ قصيرة", "alternative": "ومع ذلك لكفت مكالمةٌ قصيرة", "note": "«hätte gereicht» — «لكفت» أخصر وأقرب إلى لام المخالفة، والأولى أوضح في تركيب «كان + مضارع»."},
  {"phrase": "إذن نثبّتُ الأمرَ هكذا", "alternative": "فلنثبِّتِ الأمرَ هكذا", "note": "«Dann halten wir das so fest» — الصيغتان فصيحتان والأولى أقرب إلى ترتيب الألماني (Dann=إذن)."},
  {"phrase": "تحت ضغطِ وقتٍ شديد", "alternative": "تحت ضغطٍ زمنيٍّ شديد", "note": "«unter großem Zeitdruck» — الأولى أقرب إلى بنية الألماني، والثانية أجرى على اللسان الفصيح."},
 ],
 "d-b1-32": [
  {"phrase": "أن يُكثِرَ من القراءةِ بصوتٍ عالٍ", "alternative": "أن يقرأَ بصوتٍ عالٍ بمعدَّلٍ أعلى", "note": "«öfter laut liest» — كلتاهما تنقلان التكرار لا علوّ الصوت."},
  {"phrase": "يشاركُ جيداً", "alternative": "يتعاونُ جيداً", "note": "«arbeitet gut mit» — كلتاهما صحيحة؛ الثانية أوضح في معنى التعاون الصفّي."},
 ],
}

SOURCES = {
 "d-b1-31": [
  {"id": "S1", "citation": "deutschakademie.de: trotzdem — Konjunktionaladverb, zwei Hauptsätze, konjugiertes Verb an zweiter Position", "url": "https://www.deutschakademie.de/online-deutschkurs/deutsche-grammatik/wortarten/adverbien/konjunktional/trotzdem/"},
  {"id": "S2", "citation": "deutschegrammatik20.de: Satzverbindung dennoch/trotzdem — Konjunktionaladverb, Verb Position 2", "url": "https://deutschegrammatik20.de/komplexer-satz/ubersicht-satzverbindung/satzverbindung-dennoch/"},
  {"id": "S3", "citation": "duden.de: Konjunktiv I oder II — Vergangenheitsform des Konjunktiv II als Irrealis («hätte ich sie abgeholt»)", "url": "https://www.duden.de/sprachwissen/sprachratgeber/konjunktiv-1-oder-2"},
  {"id": "S4", "citation": "DWDS: Zeitdruck — «unter Zeitdruck stehen, arbeiten, geraten»", "url": "https://www.dwds.de/wb/Zeitdruck"},
 ],
 "d-b1-32": [
  {"id": "S5", "citation": "DWDS: melden — ⟨sich melden⟩ (durch Handzeichen) ums Wort bitten; «die Schüler meldeten sich eifrig»", "url": "https://www.dwds.de/wb/melden"},
  {"id": "S6", "citation": "duden.de: legen — 6. nachlassen, aufhören, schwinden (⟨sich legen⟩: «das legt sich [bald wieder]»)", "url": "https://www.duden.de/rechtschreibung/legen"},
  {"id": "S7", "citation": "schuelerhilfe.de: öfter und öfters — öfter = Komparativ zu oft (häufiger)", "url": "https://www.schuelerhilfe.de/online-lernen/2-deutsch/3987-deutsch-oefter-und-oefters"},
  {"id": "S8", "citation": "thefreedictionary.com: melden — sich melden in der Schule: dem Lehrer zeigen, dass man etwas sagen möchte, indem man die Hand hebt", "url": "https://de.thefreedictionary.com/melden"},
 ],
}

CONTENT_WARNINGS = []

CONTENT_CHECKS = [
 "d-b1-31: شرح Q1 («بعدَه الفعلُ مباشرةً») مطابق لقاعدة trotzdem (Konjunktionaladverb والفعل في الموضع الثاني) — والتعديل يحفظ النمط نفسه.",
 "d-b1-31: «hätte gereicht» صيغة مخالفة للواقع في الماضي (Konjunktiv II der Vergangenheit) — الترجمة المصحَّحة «كانت تكفي» تمنع قراءة المكالمة كواقعة فعلية.",
 "d-b1-31: «unter großem Zeitdruck» تعبير اصطلاحي مثبت (DWDS) — «تحت ضغطِ وقتٍ شديد» لا تعارض دلالياً ولا يُعدَّل.",
 "d-b1-32: «sich melden» = طلب الكلمة برفع اليد (DWDS/thefreedictionary) — «قلَّما يرفع يده» سليمة لـ«meldet sich selten».",
 "d-b1-32: «öfter» = Komparativ zu oft (تكرار أعلى) — صُحِّحت L2؛ و«Das legt sich» = nachlassen (Duden) فلا تحذير محتوى في الدفعة.",
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
 "reviewRule": "R122", "date": "2026-10-08",
 "scope": "الدفعة B1 التاسعة والأخيرة d-b1-31..32 (نزاع داخل الفريق، اجتماع أولياء الأمور) بعد فجوة المعرفات 28–30 الموثقة — حواران قصيران بلا waisen.",
 "dialogues": scope,
 "totals": {"dialogues": 2, "lines": lt, "questions": qt, "dictation": dt, "approximateUnits": units},
 "corrections": CORRECTIONS, "contextNotes": CONTEXT_NOTES, "styleAlternatives": STYLE_ALTERNATIVES, "sources": SOURCES,
 "contentWarnings": CONTENT_WARNINGS, "contentChecks": CONTENT_CHECKS,
 "audio": {"manifestEntries": ah, "mp3Files": mh, "note": "لا استماع ولا ادعاء صوتي."},
 "waisen": {"present": False, "note": "الحواران بلا حقل waisen (فحص صريح لكل كائن)."},
 "judgement": {"correct": units - len(CORRECTIONS), "corrected": len(CORRECTIONS), "unresolved": 0,
  "note": "أربعة تصحيحات عربية مؤكدة: المخالفة الواقعية («hätte gereicht» ← «كانت تكفي» لا «لتكفي» التي تفيد القدر)، واستعادة «Dann» المفقود («إذن» بنمط d-b1-14/d-b2-02)، ودلالة «öfter» (تكرار القراءة الجهرية لا علوّ الصوت)، وإتمام فاعل «es» («إن كان ذلك بانتظامٍ»). لا تحذيرات محتوى في هذه الدفعة (لا ادعاءات قانونية أو رقمية جديدة). الألماني/who/الأسئلة/المفاتيح/الإملاءات/الخيارات/الشرح مقفلة لم تُعدَّل."},
 "limits": {"cefr": "لم يُعد تقييم CEFR أو النسبة.", "audio": "لا استماع ولا توليد صوتي.", "human": "ليست مراجعة بشرية.",
            "legal": "الحواران تربوي ومهني بلا ادعاءات قانونية جديدة — والمراجعة ليست مشورة قانونية.",
            "medical": "لا محتوى طبي في هذه الدفعة.",
            "professional": "توصية المعلمة (قراءة جهرية منتظمة) نصٌّ داخل السيناريو لا توصية تربوية معتمدة."},
 "gates": {"planned": "K196a–j"},
}
OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
OUT_JSON.write_text(json.dumps(rep, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

md = []
md.append("# مراجعة حوارات B1 دفعة 09: d-b1-31–d-b1-32\n\n")
md.append("**التاريخ:** 2026-10-08 · **القاعدة:** R122 · **البوابات:** K196a–j\n\n")
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
    md.append("- لا تحذيرات محتوى في هذه الدفعة: الحواران تربوي/مهني بلا ادعاءات قانونية أو رقمية جديدة (لا تعديل على الألماني المقفل).\n")
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
