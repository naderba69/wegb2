#!/usr/bin/env python3
"""R116 — review report for third B1 batch d-b1-10..d-b1-12."""
from __future__ import annotations
import json, glob
from pathlib import Path

ROOT=Path(__file__).resolve().parents[2]
D=json.loads((ROOT/"content/dialogues.json").read_text(encoding="utf-8"))
AUDIO=json.loads((ROOT/"content/dialog-audio.json").read_text(encoding="utf-8"))
SCOPE=[f"d-b1-{i:02d}" for i in range(10,13)]
OUT_JSON=ROOT/"docs/content-review-b1-dialogues-03-2026-10-08.json"
OUT_MD=ROOT/"docs/content-review-b1-dialogues-03-2026-10-08.md"

CORRECTIONS=[
 {"unit":"d-b1-10.lines[0].ar","old":"مساءُ الخير، أريدُ التسجيلَ في دورةِ الألمانية.","new":"طابَ يومُكم، أريدُ التسجيلَ في دورةِ الألمانية.",
  "rationale":"الألماني «Guten Tag» تحية نهار (يقابلها في d-b1-06 «طاب يومكم»)، لا «مساء الخير» (تلك Guten Abend في d-b1-09). سياق الحوار (موعد اختبار التاسعة صباحاً) يؤكد النهار."},
 {"unit":"d-b1-10.lines[1].ar","old":"بكلِّ سرور. هل أجريتِ اختبارَ تحديدِ المستوى بعدُ؟","new":"بكلِّ سرور. هل أجريتُم اختبارَ تحديدِ المستوى بعدُ؟",
  "rationale":"«Haben Sie …؟» صيغة رسمية للمخاطَب (فراو فيبر)، والاتفاق يترجم «Sie» بالجمع «أجريتم» لا المؤنث المفرد «أجريتِ» (التي تقابل du-form)."},
 {"unit":"d-b1-10.lines[3].ar","old":"نعم، وإلا لم تُناسِبْك المجموعة. الاختبارُ الخميسَ التاسعةَ صباحاً.","new":"نعم، وإلا لم تناسبكم المجموعة. الاختبارُ الخميسَ الساعةَ التاسعةَ صباحاً.",
  "rationale":"«sonst passt die Gruppe nicht» ضمن خطاب رسمي، فضمير المخاطَب جمع «تناسبكم» لا مفرد مذكر «تناسبك» (خطأ أيضاً في جنس Frau)؛ وأضيف «الساعة» لـ«um neun» لأنه موعد ساعة (التاسعة صباحاً) لا رقم 9 مجرداً."},
 {"unit":"d-b1-11.lines[0].ar","old":"شكراً على الموعد — كانَ الإعلانُ واعداً في الصور.","new":"شكراً على الموعد — كانَ الإعلانُ واعداً.",
  "rationale":"«في الصور» إضافة غير موجودة في الألماني «die Anzeige klang vielversprechend». وفق البروتوكول لا تُضاف معلومات لا ينصّ عليها الألماني."},
 {"unit":"d-b1-11.lines[1].ar","old":"بسرور. المطبخُ مؤثَّث: البوقُ والحوضُ والخزائنُ تبقى.","new":"بسرور. المطبخُ مؤثَّث: الموقدُ والحوضُ والخزائنُ تبقى.",
  "rationale":"«der Herd» هو الموقد (مِوقد الطبخ/الفرن) وليس «البوق» (الذي يعني trumpet أو بوق/قرن). مصادر: deutale.com Herd→موقد/فرن، معجم المعاني/البراق «موقد = stove/cooker»."},
 {"unit":"d-b1-12.lines[3].ar","old":"افتح فمَك رجاءً … تشبه عدوى فيروسية، لا بكتيرية.","new":"افتح فمَك رجاءً … يبدو أنَّها عدوى فيروسية.",
  "rationale":"الألماني «Das sieht nach einer Virusinfektion aus» لا يذكر «لا بكتيرية»؛ إضافة الجملة «لا بكتيرية» زيادة على النص الأصلي. كذلك «تشبه» أضعف من «يبدو/يبدو أنها» المقابل لـ«sieht nach … aus»."},
 {"unit":"d-b1-12.lines[5].ar","old":"نعم — فحتى يومَين بعدَ آخرِ ذروةِ حرارةٍ لا يدخلُها.","new":"نعم — لا يجوز له الذهابُ حتى يومينِ بعدَ آخرِ ارتفاعٍ في الحرارة.",
  "rationale":"(أ) «bis zwei Tage nach dem letzten Fieber darf er nicht hin» يعني «لا يجوز له الذهاب/الحضور حتى يومين بعد آخر حمى»؛ العبارة «لا يدخلها» لا تعكس «darf» (الإذن/السماح بالذهاب إلى الروضة). (ب) «ذروة حرارة» ليست في الألماني؛ يُقال «ارتفاع في الحرارة/آخر حمى». (ج) «فحتى» خطأ إملائي/صرفي، الصواب «حتى» مع فعل الاقتدار/السماح."},
]

CONTEXT_NOTES={
 "d-b1-10":[
  {"note":"حوار التسجيل في دورة لغة مع Einstufungstest ورسوم 83 يورو شهرياً وامتحان مشمول وطلب جواز+Meldebescheinigung يطابق إجراءات دورات الاندماج/التكامل (Integrationskurs) ومعاهد اللغة في ألمانيا.","source":"BAMF Integrationskurs؛ Goethe Institut Anmeldung."},
  {"note":"Meldebescheinigung هنا بمعنى «إثبات/شهادة التسجيل» وهو مستند فعلي يُقدَّم في التسجيلات الإدارية (خلافاً لحالة Anmeldung d-b1-06 حيث نوقشت Wohnungsgeberbestätigung؛ هنا الطلب متعلق بتسجيل الدورة فحسب، لذا Meldebescheinigung مناسبة).","source":"bamf.de؛ handbookgermany.de."},
 ],
 "d-b1-11":[
  {"note":"مفردات الإيجار الألمانية واقعية: Kaltmiete (الإيجار البارد/الأساسي)، Nebenkosten (تكاليف إضافية)، Kaution (وديعة التأمين = إيجاران إلى ثلاثة شهور حسب القانون الألماني)، Selbstauskunft/Schufa (تقرير ذاتي وتقرير ائتمان).","source":"handbookgermany.de rental-contract (Kaution ≤ 3 شهور)؛ zatalana.com حقوق المستأجر."},
  {"note":"«Kaltmiete vierhundertfünfzig» = 450 يورو؛ رقم معقول لشقة صغيرة في مدينة متوسطة.","source":"سياق B1 تعليمي فقط."},
 ],
 "d-b1-12":[
  {"note":"حوار طبيب أطفال عن حمى وطفح وتشخيص عدوى فيروسية (لا مضاد حيوي لأن Antibiotika لا تعمل على الفيروسات، وتعليمات: خافض حرارة، سوائل، مراقبة، والبقاء في البيت حتى يومين بعد آخر حمى لمنع العدوى في الروضة).","source":"RCH.org.au Viral illnesses (Arabic translation)؛ Altibbi عدوى فيروسية."},
  {"note":"⚠️ حدود طبية: النص معلومات عامة لمرحلة B1 ولا يُعدّ توصية علاجية؛ استشر طبيباً للأعراض الفعلية. أعراض الطفح مع الحمى قد تحتاج تقييماً طبياً للحصبة/الجدري/الطفح الوردي.","source":"Kids Health / RCH fact sheet; Goethe/BAMF B1 Arztgespräch."},
 ],
}

STYLE_ALTERNATIVES={
 "d-b1-10":[
  {"phrase":"لمّا (لا يزال/ليس بعد)","alternative":"ليس بعدُ","note":"«لمّا» فصحى (قرآنية وحديثة) بمعنى «لم يحدث بعد»؛ «ليس بعد» أشيع في الأسلوب التعليمي."},
 ],
 "d-b1-11":[
  {"phrase":"الإيجار الجاف","alternative":"الإيجار الأساسي","note":"«الإيجار البارد/الجاف» ترجمة حرفية لـKaltmiete؛ «الإيجار الأساسي» مفهوم عربي أوسع لكنه لا ينقل التعبير الاصطلاحي."},
 ],
 "d-b1-12":[
  {"phrase":"خافِضوا الحرارة","alternative":"اخفضوا الحرارة","note":"كلاهما صحيح؛ «خفض» أشيع في التعليمات الطبية."},
 ],
}

SOURCES={
 "d-b1-10":[{"id":"S1","citation":"BAMF: Anmeldung Integrationskurs (Einstufungstest, Kosten, Unterlagen)","url":"https://www.bamf.de/"},{"id":"S2","citation":"Goethe Institut B1 Anmeldung Sprachkurs","url":"https://www.goethe.de/"}],
 "d-b1-11":[{"id":"S3","citation":"handbookgermany.de: عقود الإيجار في ألمانيا (Kaution, Nebenkosten, Schufa)","url":"https://handbookgermany.de/ar/rental-contract"},{"id":"S4","citation":"Zatalana: حقوق المستأجر (Kaution ≤3 أشهر، Selbstauskunft, Schufa)","url":"https://zatalana.com/"},{"id":"S5","citation":"deutale/Duden: Kaltmiete, Kaution, Herd","url":"https://deutale.com/"}],
 "d-b1-12":[{"id":"S6","citation":"RCH Kids Health Viral illnesses Arabic fact sheet","url":"https://www.rch.org.au/kidsinfo/translated-fact-sheets/Arabic/"},{"id":"S7","citation":"Altibbi: عدوى فيروسية","url":"https://altibbi.com/"},{"id":"S8","citation":"Goethe/BAMF B1 Arztgespräch (Kinderarzt, Fieber, Antibiotika)","url":"https://www.goethe.de/"}],
}

by={d["id"]:d for d in D}
scope=[];units=lt=qt=dt=0
for did in SCOPE:
    dlg=by[did];lines=dlg["lines"];qs=dlg["questions"];dc=dlg.get("dictation") or []
    lu=sum(len([k for k in ln if k in ("who","de","ar")]) for ln in lines)
    qu=sum(len(q) for q in qs);u=4+lu+qu+len(dc)
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
 "reviewRule":"R116","date":"2026-10-08",
 "scope":"الدفعة B1 الثالثة d-b1-10..12 (التسجيل في دورة اللغة، معاينة شقة، طبيب أطفال) — حوارات قصيرة بلا waisen.",
 "dialogues":scope,
 "totals":{"dialogues":3,"lines":lt,"questions":qt,"dictation":dt,"approximateUnits":units},
 "corrections":CORRECTIONS,"contextNotes":CONTEXT_NOTES,"styleAlternatives":STYLE_ALTERNATIVES,"sources":SOURCES,
 "audio":{"manifestEntries":ah,"mp3Files":mh,"note":"لا استماع ولا ادعاء صوتي؛ وجود الملفات ليس سماعاً."},
 "waisen":{"present":False,"note":"الحوارات الثلاث بلا حقل waisen؛ لم تُدقق مفردات يتيمة."},
 "judgement":{"correct":units-len(CORRECTIONS),"corrected":len(CORRECTIONS),"unresolved":0,
  "note":"سبع وحدات عربية مصححة (تحية نهار/مساء، صيغة Sie→جمع، إزالة إضافات غير موجودة في الألماني، تصحيح كلمة «Herd» البوق→الموقد، صياغة طبية تعكس darf nicht bis+Fieber)، الباقي سليمة، الألماني/who/الأسئلة/الإملاءات/الخيارات/الشرح مقفلة."},
 "limits":{"cefr":"لم يُعد تقييم CEFR أو النسبة أو الحساب.","audio":"لا استماع ولا توليد صوتي.","human":"ليست مراجعة بشرية.","legal":"مصطلحات الإيجار/الكوشن/الشوفا سياق دراسي وليست مشورة قانونية.","medical":"الحوار الطبي تعليمي لـB1 ولا يُعدّ توصية علاجية؛ استشارة طبية فعلية مطلوبة.","professional":"صياغة التسجيل والإيجار دراسية وليست دليلاً مهنياً."},
 "gates":{"planned":"K190a–j"},
}
OUT_JSON.parent.mkdir(parents=True,exist_ok=True)
OUT_JSON.write_text(json.dumps(rep,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
md=[]
md.append("# مراجعة حوارات B1 دفعة 03: d-b1-10–d-b1-12\n\n")
md.append("**التاريخ:** 2026-10-08 · **القاعدة:** R116 · **البوابات:** K190a–j\n\n")
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
md.append(f"- إدخالات بيان صوتي: {rep['audio']['manifestEntries'] or 'لا يوجد'}.\n- ملفات mp3: {rep['audio']['mp3Files'] or 'لا يوجد'}.\n- {rep['audio']['note']}\n\n")
md.append("## البطاقات اليتيمة\n\n- "+rep["waisen"]["note"]+"\n\n")
md.append("## الحدود\n\n")
for k,v in rep["limits"].items(): md.append(f"- **{k}:** {v}\n")
OUT_MD.write_text("".join(md),encoding="utf-8")
print(f"Wrote {OUT_JSON.name} and {OUT_MD.name}")
print(f"  lines={lt} q={qt} dict={dt} ≈units={units} corrections={len(CORRECTIONS)}")

if __name__=="__main__": pass
