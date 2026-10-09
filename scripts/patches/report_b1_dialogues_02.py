#!/usr/bin/env python3
"""R115 — review report for second B1 batch d-b1-07..d-b1-09."""
from __future__ import annotations
import json, glob
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
D = json.loads((ROOT/"content/dialogues.json").read_text(encoding="utf-8"))
AUDIO = json.loads((ROOT/"content/dialog-audio.json").read_text(encoding="utf-8"))
SCOPE=[f"d-b1-{i:02d}" for i in range(7,10)]
OUT_JSON=ROOT/"docs/content-review-b1-dialogues-02-2026-10-08.json"
OUT_MD=ROOT/"docs/content-review-b1-dialogues-02-2026-10-08.md"

CORRECTIONS=[
 {"unit":"d-b1-07.lines[2].ar","old":"ينبغي أن تعمل أقل أمام الشاشة وتاخد استراحات.","new":"ينبغي أن تعملوا أقل أمام الشاشة وتأخذوا استراحات.",
  "rationale":"الألماني «Sie sollten …» صيغة رسمية مخاطَبة للمفرد بصيغة الجمع؛ يطابقها عربي «أنتم»/«تعملوا» (تمشياً مع اتفاق المشروع في d-b1-02 وd-b1-06، ومع السطر التالي في الحوار نفسه «kommen Sie»→«تعالوا»)، و«تاخد» صيغة عامية تصحح إلى «تأخذوا»."},
 {"unit":"d-b1-09.lines[4].ar","old":"وهل يمكنك تغيير الغرفة ربما؟","new":"وهل يمكنكم تغيير الغرفة ربما؟",
  "rationale":"«könnten Sie …» صيغة رسمية للاستقبال الفندقي (و«mein Herr» من الموظف يؤكد الرسمية)؛ الاتفاق يترجم Sie الرسمية بالجمع «يمكنكم»."},
]

CONTEXT_NOTES={
 "d-b1-07":[
  {"note":"الحوار صياغة B1 نموذجية في زيارة الطبيب/الفحص وينصح بتقليل وقت الشاشة وأخذ فترات راحة. الألماني (Bildschirmarbeit, Pausen, Schmerzen zurückkommen, sofort wiederkommen) سليم لغوياً.","source":"Goethe/BAMF B1-Rahmen Arztgespräch-Muster; Duden."},
  {"note":"⚠️ حدود طبية: النص لا يتضمن تشخيصاً أو توصية علاجية حقيقية؛ الاقتراح بتقليل الشاشة عام وتعليمي وليس استشارة طبية.","source":"حدود المناهج الدراسية B1; المعلومات العامة لا تحل محل الاستشارة."},
 ],
 "d-b1-08":[
  {"note":"حوار WG (شقة مشتركة) عن المطبخ الفوضوي وجدول تنظيف وشراء مشترك يوفر المال. المفردات Putzplan وEinkaufsliste مناسبة لـB1.","source":"Goethe: B1 Alltagsthemen Wohngemeinschaft; DW B1 WG-Alltag."},
 ],
 "d-b1-09":[
  {"note":"حوار شكوى فندقية عن تعطل التدفئة وإرسال فني ثم تبديل الغرفة إلى 205 frei und warm. المفردات واقعية.","source":"Goethe/DW B1 Hotelreklamation; Duden «Reklamation», «Heizung defekt»."},
 ],
}

STYLE_ALTERNATIVES={
 "d-b1-07":[
  {"phrase":"Gott sei Dank!","alternative":"Zum Glück!","note":"كلاهما صحيح؛ Gott sei Dank أكثر تعبيراً دينياً/ثقافياً."},
  {"phrase":"الفحص يبيّن","alternative":"الفحص يُظهر","note":"بيّن ويُظهر فصيحان؛ الثاني أشيع طبياً."},
 ],
 "d-b1-08":[
  {"phrase":"Jeder macht einmal pro Woche sauber.","alternative":"كل واحد ينظف مرة في الأسبوع","note":"«كل ينظف» اختصار تعليمي وليس خطأ."},
 ],
 "d-b1-09":[
  {"phrase":"Was ist denn los, mein Herr?","alternative":"Was ist das Problem?","note":"«Was ist denn los» ألطف وأقرب للاستقبال الفندقي."},
 ],
}

SOURCES={
 "d-b1-07":[{"id":"S1","citation":"Goethe/BAMF B1 Arztgespräch-Muster","url":"https://www.goethe.de/"},{"id":"S2","citation":"Duden: «Befund», «Bildschirmarbeit»","url":"https://www.duden.de/"}],
 "d-b1-08":[{"id":"S3","citation":"Goethe Institut: B1 Wohngemeinschaft","url":"https://www.goethe.de/"},{"id":"S4","citation":"DW Learn German B1: WG-Alltag","url":"https://www.dw.com/"}],
 "d-b1-09":[{"id":"S5","citation":"Goethe/DW B1 Hotelreklamation","url":"https://www.goethe.de/"},{"id":"S6","citation":"Duden: «Reklamation»","url":"https://www.duden.de/rechtschreibung/Reklamation"}],
}

by={d["id"]:d for d in D}
scope=[];units=lt=qt=dt=0
for did in SCOPE:
    dlg=by[did];lines=dlg["lines"];qs=dlg["questions"];dc=dlg.get("dictation") or []
    lu=sum(len([k for k in ln if k in ("who","de","ar")]) for ln in lines)
    qu=sum(len(q) for q in qs); u=4+lu+qu+len(dc)
    units+=u;lt+=len(lines);qt+=len(qs);dt+=len(dc)
    scope.append({"id":did,"level":dlg["level"],"titleDe":dlg["titleDe"],"titleAr":dlg["titleAr"],"lines":len(lines),"questions":len(qs),"dictation":len(dc),"units":u,"hasWaisenField":"waisen" in dlg,"who":[ln["who"] for ln in lines]})

ah=[]
def walk(n):
    if isinstance(n,dict):
        if isinstance(n.get("id"),str) and n["id"] in SCOPE: ah.append(n["id"])
        for v in n.values(): walk(v)
    elif isinstance(n,list):
        for v in n: walk(v)
walk(AUDIO)
mh=[]
for tid in SCOPE: mh.extend(glob.glob(str(ROOT/"public"/"audio"/"**"/f"*{tid}*.mp3"),recursive=True))

rep={
 "reviewRule":"R115","date":"2026-10-08",
 "scope":"الدفعة B1 الثانية d-b1-07..09 (طبيب، WG، فندق) — حوارات قصيرة بلا waisen.",
 "dialogues":scope,
 "totals":{"dialogues":3,"lines":lt,"questions":qt,"dictation":dt,"approximateUnits":units},
 "corrections":CORRECTIONS,"contextNotes":CONTEXT_NOTES,"styleAlternatives":STYLE_ALTERNATIVES,"sources":SOURCES,
 "audio":{"manifestEntries":ah,"mp3Files":mh,"note":"لا استماع ولا ادعاء صوتي؛ وجود الملفات لا يعني سماعها."},
 "waisen":{"present":False,"note":"الحوارات الثلاث بلا حقل waisen؛ لم تُدقق مفردات يتيمة."},
 "judgement":{"correct":units-len(CORRECTIONS),"corrected":len(CORRECTIONS),"unresolved":0,
  "note":"وحدتان عربيتان مصححتان (صيغة Sie→الجمع، فعل عامي→فصحى)؛ الباقي سليم، الألماني/who/الأسئلة/الإملاءات مقفلة."},
 "limits":{"cefr":"لم يُعد تقييم CEFR أو النسبة أو الحساب.","audio":"لا استماع ولا توليد صوتي.","human":"ليست مراجعة بشرية.","legal":"الشكوى الفندقية دراسية عامة وليست مشورة قانونية.","medical":"نصيحة الطبيب عامة ولا تحل محل استشارة طبية فعلية.","professional":"صياغة WG/الفندق دراسية B1 وليست دليلاً مهنياً."},
 "gates":{"planned":"K189a–j"},
}
OUT_JSON.parent.mkdir(parents=True,exist_ok=True)
OUT_JSON.write_text(json.dumps(rep,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
md=[]
md.append("# مراجعة حوارات B1 دفعة 02: d-b1-07–d-b1-09\n\n")
md.append("**التاريخ:** 2026-10-08 · **القاعدة:** R115 · **البوابات:** K189a–j\n\n")
md.append("## النطاق\n\n");md.append(f"{rep['scope']}\n\n")
md.append("## الإجمالي\n\n");t=rep["totals"]
md.append(f"- حوارات: **{t['dialogues']}** · أسطر: **{t['lines']}** · أسئلة: **{t['questions']}** · إملاءات: **{t['dictation']}** · وحدات≈**{t['approximateUnits']}**\n\n")
md.append("## الحكم\n\n");j=rep["judgement"]
md.append(f"- **سليمة:** {j['correct']} · **مصححة:** {j['corrected']} · **غير محسومة:** {j['unresolved']}\n- {j['note']}\n\n")
md.append("## التصحيحات المطبقة\n\n")
for c in rep["corrections"]: md.append(f"- `{c['unit']}`: من «{c['old']}» إلى «{c['new']}» — {c['rationale']}\n")
md.append("\n## ملاحظات سياقية (غير معدّلة)\n\n")
for did,ns in rep["contextNotes"].items():
    md.append(f"### {did}\n")
    for n in ns: md.append(f"- {n['note']}\n  - المصدر: {n['source']}\n")
md.append("\n## بدائل أسلوبية (غير معدّلة)\n\n")
for did,al in rep["styleAlternatives"].items():
    md.append(f"### {did}\n")
    for a in al: md.append(f"- `{a['phrase']}` — بديل: `{a['alternative']}` — {a['note']}\n")
md.append("\n## المصادر\n\n");ts=0
for did,sl in rep["sources"].items():
    md.append(f"### {did}\n")
    for s in sl: md.append(f"- [{s['id']}] {s['citation']} — {s['url']}\n");ts+=1
md.append(f"\n(مجموع المراجع: {ts}.)\n\n")
md.append("## الصوت\n\n")
md.append(f"- إدخالات بيان صوتي: {rep['audio']['manifestEntries'] or 'لا يوجد'}.\n")
md.append(f"- ملفات mp3: {rep['audio']['mp3Files'] or 'لا يوجد'}.\n- {rep['audio']['note']}\n\n")
md.append("## البطاقات اليتيمة\n\n- "+rep["waisen"]["note"]+"\n\n")
md.append("## الحدود\n\n")
for k,v in rep["limits"].items(): md.append(f"- **{k}:** {v}\n")
OUT_MD.write_text("".join(md),encoding="utf-8")
print(f"Wrote {OUT_JSON.name} and {OUT_MD.name}")
print(f"  lines={lt} q={qt} dict={dt} ≈units={units} corrections={len(CORRECTIONS)}")

if __name__=="__main__":
    pass
