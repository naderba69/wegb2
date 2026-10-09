#!/usr/bin/env python3
"""R133 — review report for first A0 batch d-a0-01..d-a0-03."""
from __future__ import annotations
import json, glob
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
D = json.loads((ROOT / "content/dialogues.json").read_text(encoding="utf-8"))
AUDIO = json.loads((ROOT / "content/dialog-audio.json").read_text(encoding="utf-8"))
SCOPE = ["d-a0-01", "d-a0-02", "d-a0-03"]
OUT_JSON = ROOT / "docs/content-review-a0-dialogues-01-2026-10-08.json"
OUT_MD = ROOT / "docs/content-review-a0-dialogues-01-2026-10-08.md"

CORRECTIONS = [
 {
  "unit": "d-a0-01.questions[2].promptAr",
  "old": "",
  "new": "مَنْ يَقول «سعيدة بلقائك»؟",
  "rationale": "ملء حقل promptAr الفارغ لـWer sagt «Freut mich»؟"
 },
 {
  "unit": "d-a0-02.questions[1].promptAr",
  "old": "",
  "new": "مَنْ يَقول «شكراً»؟",
  "rationale": "ملء promptAr الفارغ لـWer sagt «Danke!»؟"
 },
 {
  "unit": "d-a0-02.questions[2].promptAr",
  "old": "",
  "new": "هل الجملة «الناتج أربعة» صحيحة؟",
  "rationale": "ملء promptAr الفارغ لسؤال صح/خطأ (Das Ergebnis ist vier)."
 },
 {
  "unit": "d-a0-03.questions[1].promptAr",
  "old": "",
  "new": "أيَّةَ حروفٍ يَتهجّاها B؟",
  "rationale": "ملء promptAr الفارغ لـWelche Buchstaben buchstabiert B؟"
 },
 {
  "unit": "d-a0-03.questions[2].promptAr",
  "old": "",
  "new": "ماذا يَطلُب A مِن B؟",
  "rationale": "ملء promptAr الفارغ لـWas bittet A B zu tun؟ (buchstabieren)."
 }
]

CONTEXT_NOTES = {
 "d-a0-01": [
  {
   "note": "تحية غير رسمية Hallo! ورسمية Guten Tag! سؤال الاسم بِـdu (Wie heißt du?) ثم وداع Auf Wiedersehen!",
   "source": "d-a0-01-q0"
  },
  {
   "note": "«Freut mich» اختصار لـ«Es freut mich, Sie/dich kennenzulernen» = سعيد/سعيدة بلقائك.",
   "source": "d-a0-01-q2"
  },
  {
   "note": "Auf Wiedersehen! صيغة الوداع الرسمية الشائعة (Tschüss غير رسمي).",
   "source": "d-a0-01-d2"
  }
 ],
 "d-a0-02": [
  {
   "note": "«Wie viel ist eins plus zwei?» = كم واحد زائد اثنين؟ الجواب drei=ثلاثة.",
   "source": "d-a0-02-q0"
  },
  {
   "note": "Danke! = شكراً، يقولها السائل A بعد تلقي الجواب.",
   "source": "d-a0-02-q1"
  },
  {
   "note": "1+2=3 لا 4، فالجملة «Das Ergebnis ist vier» خاطئة (Q2 صح/خطأ).",
   "source": "d-a0-02-q2"
  }
 ],
 "d-a0-03": [
  {
   "note": "Buchstabiere bitte deinen Namen! = هجِّ اسمك من فضلك؛ فعل buchstabieren=يُهجّئ الحروف.",
   "source": "d-a0-03-q2"
  },
  {
   "note": "A–L–I تهجئة Ali (B هي المجيب واسمها Ali في الحوار).",
   "source": "d-a0-03-q1"
  },
  {
   "note": "Danke! = شكراً بعد التهجئة؛ نهاية قصيرة نمطية في A0.",
   "source": "d-a0-03-d2"
  }
 ]
}

STYLE_ALTERNATIVES = {
 "d-a0-01": [
  {
   "phrase": "نهارك سعيد!",
   "alternative": "طاب نهارك!",
   "note": "«Guten Tag» تحية رسمية نهارية."
  },
  {
   "phrase": "سعيدة بلقائك!",
   "alternative": "تشرفتُ بك!",
   "note": "«Freut mich!» بلقائك."
  },
  {
   "phrase": "إلى اللقاء!",
   "alternative": "مع السلامة!",
   "note": "«Auf Wiedersehen»."
  }
 ],
 "d-a0-02": [
  {
   "phrase": "كم واحد زائد اثنين؟",
   "alternative": "كم يساوي واحد زائد اثنين؟",
   "note": "«Wie viel ist»."
  },
  {
   "phrase": "شكراً!",
   "alternative": "شكراً جزيلاً!",
   "note": "«Danke»."
  }
 ],
 "d-a0-03": [
  {
   "phrase": "هجِّ اسمك من فضلك!",
   "alternative": "لطفاً، هجِّ اسمك!",
   "note": "«Buchstabiere bitte»."
  }
 ]
}

SOURCES = {
 "d-a0-01": [
  {
   "id": "S1",
   "citation": "Duden: Hallo/Guten Tag/Auf Wiedersehen تحيات أساسية.",
   "url": "https://www.duden.de/rechtschreibung/Hallo"
  },
  {
   "id": "S2",
   "citation": "Duden: heißen = يُدعى/اسمي.",
   "url": "https://www.duden.de/rechtschreibung/heissen"
  },
  {
   "id": "S3",
   "citation": "Goethe A0: Begrüßung und Vorstellung مفردات أساسية.",
   "url": "https://www.goethe.de/"
  }
 ],
 "d-a0-02": [
  {
   "id": "S4",
   "citation": "Duden: plus/zwei/drei/vier أعداد وعملية جمع.",
   "url": "https://www.duden.de/rechtschreibung/plus"
  },
  {
   "id": "S5",
   "citation": "Duden: Danke = شكراً.",
   "url": "https://www.duden.de/rechtschreibung/danke"
  },
  {
   "id": "S6",
   "citation": "Goethe A0: Zahlen 1–10.",
   "url": "https://www.goethe.de/"
  }
 ],
 "d-a0-03": [
  {
   "id": "S7",
   "citation": "Duden: buchstabieren = يُهجّئ.",
   "url": "https://www.duden.de/rechtschreibung/buchstabieren"
  },
  {
   "id": "S8",
   "citation": "Duden: Buchstabe = حرف.",
   "url": "https://www.duden.de/rechtschreibung/Buchstabe"
  },
  {
   "id": "S9",
   "citation": "Goethe A0: Buchstabieren des Namens.",
   "url": "https://www.goethe.de/"
  }
 ]
}

CONTENT_CHECKS = [
 "d-a0-01: التحيّة متسقة: Hallo! ← Guten Tag! ← سؤال الاسم ← تعارف ← Freut mich ← Auf Wiedersehen! مفاتح Q0/Q1/Q2 مطابقة.",
 "d-a0-02: حساب 1+2=3 متسق: سؤال الجمع ← الجواب الصحيح ← شكر؛ سؤال الصح/الخطأ يؤكد falsch (1+2=3 لا 4).",
 "d-a0-03: تهجئة Ali متسقة: طلب Buchstabiere ← A–L–I ← شكر؛ المطلوب فعل buchstabieren لا zählen/schreiben/lesen.",
 "لا تحذيرات محتوى جديدة؛ المواد كلها مفردات A0 تأسيسية بلا قيود قانونية/طبية. الألماني/الخيارات/المفاتيح/الإملاءات مقفلة."
]

CONTENT_WARNINGS = []

by = {d["id"]: d for d in D}
scope = []
units = lt = qt = dt = 0
for did in SCOPE:
    dlg = by[did]; lines = dlg["lines"]; qs = dlg["questions"]; dc = dlg.get("dictation") or []
    lu = sum(len([k for k in ln if k in ("sp", "de", "ar")]) for ln in lines)
    qu = sum(len(q) for q in qs); u = 4 + lu + qu + len(dc)
    units += u; lt += len(lines); qt += len(qs); dt += len(dc)
    scope.append({"id": did, "level": dlg["level"], "titleDe": dlg["titleDe"], "titleAr": dlg["titleAr"],
                  "lines": len(lines), "questions": len(qs), "dictation": len(dc), "units": u,
                  "hasWaisenField": "waisen" in dlg, "speakers": sorted({ln["sp"] for ln in lines})})

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
 "reviewRule": "R133", "date": "2026-10-08",
 "scope": "أول دفعة A0: d-a0-01..03 (تحية، أرقام وجمع، تهجئة الاسم) — الحوارات الثلاث بلا waisen.",
 "dialogues": scope,
 "totals": {"dialogues": 3, "lines": lt, "questions": qt, "dictation": dt, "approximateUnits": units},
 "corrections": CORRECTIONS, "contextNotes": CONTEXT_NOTES, "styleAlternatives": STYLE_ALTERNATIVES, "sources": SOURCES,
 "contentWarnings": CONTENT_WARNINGS, "contentChecks": CONTENT_CHECKS,
 "audio": {"manifestEntries": ah, "mp3Files": mh, "note": "لا استماع ولا ادعاء صوتي."},
 "waisen": {"present": False, "note": "الحوارات الثلاث بلا حقل waisen (فحص صريح لكل كائن)."},
 "judgement": {"correct": units - 5, "corrected": 5, "unresolved": 0,
  "note": "خمسة تصحيحات/استكمالات عربية في حقول promptAr الفارغة: خمسة أسئلة في d-a0-01/02/03 كانت بلا نص سؤال عربي فأُكملت بأسئلة عربية فصيحة قصيرة مطابقة لألماني A0 ومطابقة نمط بقية مستويات الملف (سؤال عربي لكل promptDe): «مَن يَقول Freut mich؟» و«مَن يقول شكراً؟» و«هل الجملة «الناتج أربعة» صحيحة؟» و«أيّة حروف يتهجّاها B؟» و«ماذا يطلب A من B؟». لم تُعدَّل الألماني أو الخيارات أو المفاتيح أو الإملاءات أو الشرح. لا تحذيرات محتوى. الألماني/الأسئلة/الخيارات/المفاتيح/الإملاءات مقفلة. لا تغيير في W1–W6."},
 "limits": {"cefr": "لم يُعد تقييم CEFR أو النسبة.", "audio": "لا استماع ولا توليد صوتي.", "human": "ليست مراجعة بشرية.",
            "legal": "لا سياق قانوني؛ تحيات/أرقام/تهجئة.",
            "medical": "لا محتوى طبي في هذه الدفعة (مفردات تأسيسية).",
            "professional": "لا توصيات مهنية؛ محتوى A0 تعليمي بحت."},
 "gates": {"planned": "K207a–j"},
}
OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
OUT_JSON.write_text(json.dumps(rep, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

md = []
md.append("# تقرير R133 — أول دفعة A0 (d-a0-01..d-a0-03)\n\n")
md.append("**التاريخ:** 2026-10-08 · **القاعدة:** R133 · **البوابات:** K207a–j\n\n")
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
