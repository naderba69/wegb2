#!/usr/bin/env python3
"""R132 — review report for tenth B2 batch d-b2-31..32 (last)."""
from __future__ import annotations
import json, glob
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
D = json.loads((ROOT / "content/dialogues.json").read_text(encoding="utf-8"))
AUDIO = json.loads((ROOT / "content/dialog-audio.json").read_text(encoding="utf-8"))
SCOPE = ["d-b2-31", "d-b2-32"]
OUT_JSON = ROOT / "docs/content-review-b2-dialogues-10-2026-10-08.json"
OUT_MD = ROOT / "docs/content-review-b2-dialogues-10-2026-10-08.md"

CORRECTIONS = [
 {
  "unit": "d-b2-31.lines[2].ar",
  "old": "بأيِّ معنىً نفعتْكَ هذه المدّةُ مهنياً؟",
  "new": "كيف أفادتْكَ هذه المدةُ مهنياً؟",
  "rationale": "Inwiefern … weitergebracht=كيف أفادك (لا «بأي معنى نفعتك»)."
 },
 {
  "unit": "d-b2-31.lines[3].ar",
  "old": "تعلَّمتُ ترتيبَ الأولوياتِ تحتَ الضغط، وهو ما ينفعُني يومياً اليوم.",
  "new": "تعلَّمتُ ترتيبَ الأولوياتِ تحتَ الضغط، وهو ما يفيدُني يومياً في عملي.",
  "rationale": "zugutekommt=يُفيد، تكرار «اليوم/يومياً» زائد."
 },
 {
  "unit": "d-b2-31.lines[5].ar",
  "old": "سأفحصُ المهامَّ أوّلاً ثمَّ أنسّقُ الأولوياتِ جماعياً.",
  "new": "سأستعرضُ المهامَّ أوّلاً ثمَّ أنسّقُ الأولوياتِ جماعياً.",
  "rationale": "sichten=استعراض/فرز (لا «فحص» بمعنى امتحان)."
 },
 {
  "unit": "d-b2-32.lines[0].ar",
  "old": "تحديدُ سرعةٍ عامٌّ سينقذُ أرواحاً ويخفضُ الانبعاثات.",
  "new": "حدُّ سرعةٍ عامٍّ سينقذُ أرواحاً ويخفضُ الانبعاثات.",
  "rationale": "Tempolimit=حد السرعة (لا «تحديد» كمصدر)."
 },
 {
  "unit": "d-b2-32.lines[4].ar",
  "old": "بهذا أقبل. إذن نحنُ متّفقانِ من حيثُ المبدأ.",
  "new": "أقبلُ بهذا. إذن نحنُ متّفقانِ من حيثُ المبدأ.",
  "rationale": "Damit kann ich leben=أقبل بهذا (تقديم الجارّ والمجرور)."
 }
]

CONTEXT_NOTES = {
 "d-b2-31": [
  {
   "note": "Lebenslauf-Lücke 8 Monate pflege+Fachkurs: رعاية الأم ودورة تخصصية بجانبها (Q0).",
   "source": "d-b2-31-q0"
  },
  {
   "note": "unter Belastung priorisieren: ترتيب الأولويات تحت الضغط (Q0).",
   "source": "d-b2-31-q0"
  },
  {
   "note": "Angenommen + Konjunktiv II تفتح سؤالاً افتراضياً؛ يردّ بسرد خطوتين: sichten → abstimmen (Q1/Q2).",
   "source": "d-b2-31-q1"
  }
 ],
 "d-b2-32": [
  {
   "note": "Tempolimit rettet Leben/senkt Emissionen (Q0).",
   "source": "d-b2-32-q0"
  },
  {
   "note": "Einsparung geringer als behauptet اعتراض توبياس؛ يارا تردّ «Selbst wenn … kostet nichts und wirkt sofort» (Q1).",
   "source": "d-b2-32-q1"
  },
  {
   "note": "Tobias stimmt zu «sofern gleichzeitig in Schienen investiert» → اتفاق مبدئي (Q2).",
   "source": "d-b2-32-q2"
  }
 ]
}

STYLE_ALTERNATIVES = {
 "d-b2-31": [
  {
   "phrase": "كيف أفادتك",
   "alternative": "إلى أي مدى طوّرتك",
   "note": "«Inwiefern weitergebracht». "
  },
  {
   "phrase": "تحت الضغط",
   "alternative": "في ظل الضغط",
   "note": "«unter Belastung». "
  },
  {
   "phrase": "سأستعرض",
   "alternative": "سأحصر",
   "note": "«sichten» الفرز. "
  }
 ],
 "d-b2-32": [
  {
   "phrase": "حد سرعة",
   "alternative": "سقف سرعة",
   "note": "«Tempolimit». "
  },
  {
   "phrase": "أقبل بهذا",
   "alternative": "أستطيع التعايش مع هذا",
   "note": "«Damit kann ich leben». "
  },
  {
   "phrase": "من حيث المبدأ",
   "alternative": "مبدئياً",
   "note": "«im Grundsatz». "
  }
 ]
}

SOURCES = {
 "d-b2-31": [
  {
   "id": "S1",
   "citation": "Duden: Lebenslauf = السيرة الذاتية؛ Lücke = فجوة زمنية.",
   "url": "https://www.duden.de/rechtschreibung/Lebenslauf"
  },
  {
   "id": "S2",
   "citation": "Duden: weiterbringen = يُفيد/يطوّر مهنياً.",
   "url": "https://www.duden.de/rechtschreibung/weiterbringen"
  },
  {
   "id": "S3",
   "citation": "Duden: priorisieren = يرتّب الأولويات.",
   "url": "https://www.duden.de/rechtschreibung/priorisieren"
  },
  {
   "id": "S4",
   "citation": "Duden: sichten = يستعرض/يفرز.",
   "url": "https://www.duden.de/rechtschreibung/sichten"
  }
 ],
 "d-b2-32": [
  {
   "id": "S5",
   "citation": "Duden: Tempolimit = حد السرعة.",
   "url": "https://www.duden.de/rechtschreibung/Tempolimit"
  },
  {
   "id": "S6",
   "citation": "Duden: Emission = انبعاث.",
   "url": "https://www.duden.de/rechtschreibung/Emission"
  },
  {
   "id": "S7",
   "citation": "Duden: Selbst wenn = حتى لو.",
   "url": "https://www.duden.de/rechtschreibung/selbst"
  },
  {
   "id": "S8",
   "citation": "Duden: sofern = شريطة أن.",
   "url": "https://www.duden.de/rechtschreibung/sofern"
  }
 ]
}

CONTENT_CHECKS = [
 "d-b2-31: مقابلة العمل متسقة: فجوة 8 أشهر (رعاية أم+دورة) → كيف أفادت مهنياً؟ → تعلّم ترتيب الأولويات تحت الضغط → سؤال افتراضي (فريق مُثقَل) → أستعرض ثم أنسّق جماعياً. Q0 صحيح/فخّان، Q1 ملء Angenommen، Q2 صحيح (خطوتان).",
 "d-b2-32: سجال حد السرعة متسق: ينقذ أرواحاً ويخفض انبعاثات → التوفير أقل من المُدَّعى → حتى لو صغير لا يكلّف → موافق شريطة الاستثمار في السكك → اتفاق مبدئي. Q0 صحيح/فخّان، Q1 ملء Selbst، Q2 خطأ (اتفاق مبدئي لا خصومة مفتوحة).",
 "لا تحذيرات محتوى جديدة؛ W1–W6 مفتوحة."
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
 "reviewRule": "R132", "date": "2026-10-08",
 "scope": "عاشر دفعة B2 (الأخيرة): d-b2-31..32 (مقابلة عمل: سؤال الفجوة، سجال حد السرعة) — الحواران بلا waisen.",
 "dialogues": scope,
 "totals": {"dialogues": 2, "lines": lt, "questions": qt, "dictation": dt, "approximateUnits": units},
 "corrections": CORRECTIONS, "contextNotes": CONTEXT_NOTES, "styleAlternatives": STYLE_ALTERNATIVES, "sources": SOURCES,
 "contentWarnings": CONTENT_WARNINGS, "contentChecks": CONTENT_CHECKS,
 "audio": {"manifestEntries": ah, "mp3Files": mh, "note": "لا استماع ولا ادعاء صوتي."},
 "waisen": {"present": False, "note": "الحوارات الثلاثة بلا حقل waisen (فحص صريح لكل كائن)."},
 "judgement": {"correct": units - 5, "corrected": 5, "unresolved": 0,
  "note": "خمسة تصحيحات عربية مؤكدة — d-b2-31 (3): Inwiefern weitergebracht=كيف أفادتك (لا «بأي معنى نفعتك»)، zugutekommt=يفيدني في عملي (حذف تكرار «اليوم/يومياً»)، sichten=أستعرض (لا «أفحص» بمعنى امتحان)؛ d-b2-32 (2): Tempolimit=حد سرعة (لا «تحديد» مصدر)، Damit kann ich leben=أقبل بهذا (تقديم الجار والمجرور، لا «بهذا أقبل» الذي يوهم «هكذا أقبل»). الحواران قصيران (6+5=11 سطراً)؛ الأسئلة/المفاتيح/الإملاءات مقفلة. لا تحذيرات محتوى جديدة؛ W1–W6 مفتوحة. الألماني/who/الأسئلة/المفاتيح/الإملاءات مقفلة."},
 "limits": {"cefr": "لم يُعد تقييم CEFR أو النسبة.", "audio": "لا استماع ولا توليد صوتي.", "human": "ليست مراجعة بشرية.",
            "legal": "سياق مقابلة عمل/سجال سياسة نقل عام: التصحيحات لغوية، لا مشورة قانونية.",
            "medical": "لا محتوى طبي في هذه الدفعة.",
            "professional": "لا توصيات مهنية؛ مفردات مقابلة وسجال لا نصائح."},
 "gates": {"planned": "K206a–j"},
}
OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
OUT_JSON.write_text(json.dumps(rep, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

md = []
md.append("# تقرير R132 — عاشر دفعة B2 (d-b2-31..32) — الدفعة الأخيرة\n\n")
md.append("**التاريخ:** 2026-10-08 · **القاعدة:** R132 · **البوابات:** K206a–j\n\n")
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
