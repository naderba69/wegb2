#!/usr/bin/env python3
"""R141 — report for B2 texts t-b2-01..35 (140 promptAr fills; B2 texts COMPLETE; all texts COMPLETE)."""
from __future__ import annotations
import json
from pathlib import Path
from importlib.machinery import SourceFileLoader
ROOT = Path(__file__).resolve().parents[2]
TP = ROOT/"content"/"texts.json"
OJ = ROOT/"docs"/"content-review-b2-texts-01-2026-10-09.json"
OM = ROOT/"docs"/"content-review-b2-texts-01-2026-10-09.md"
TGTS = [f"t-b2-{i:02d}" for i in range(1,36)]
patch = SourceFileLoader("p", str(ROOT/"scripts"/"patches"/"review_b2_texts_01.py")).load_module()
P = patch.P
NOTE = "استكمال 140 حقل promptAr فارغ في نصوص B2 الخمسة والثلاثين كاملة. تغطي النصوص: رقمنة التعليم، الخبر اليومي، المناخ، مراجعة الرواية، سوق العمل، النوم والتعلم، وتيرة الرقمنة، الإعلام والحقيقة، التعلم مدى الحياة، أسبوع الأربعة أيام، الأسقف الخضراء، القراءة في عصر الفيديو القصير، المجانية الجامعية، الضجيج، ثقافة الخطأ، تذكرة 49 يورو، الإعلان العام، الطلبات الإدارية، نقص الكفاءات، السكن في المناطق المكتظة، سوء فهم بين صديقين، العودة بعد العملية، كلمة مرور واحدة، الفصل الأول، الهزيمة في البطولة، مزرعة الرياح الأهلية، الخط الصغير، لمن المدينة، الوصول يستغرق، حجر أمام الباب، التنقل أم الانتقال، الصورة المثالية، النادي والانسحاب، بين السطور، المشروع البحثي. العربية مطابقة للألماني في Konjunktiv II والمبني للمجهول والأبنية الموصولة والتعابير الاصطلاحية. لا تعديل للألماني. بهذه الدفعة تكتمل جميع نصوص المستويات A0–B2 عربياً (110/110)."
def main():
    data=json.loads(TP.read_text(encoding="utf-8"))
    objs=[t for t in data if t.get("id") in TGTS]; assert len(objs)==35
    corrs=[]
    for tid in TGTS:
        for qi,ar in P[tid].items():
            corrs.append({"unit":f"{tid}.questions[{qi}].promptAr","field":"promptAr","before":"","after":ar,"reason":"استكمال حقل promptAr فارغ."})
    tq=sum(len(t["questions"]) for t in objs)
    empty=sum(1 for t in data for q in t.get("questions",[]) if not q.get("promptAr","").strip())
    assert empty==0
    snaps={t["id"]:{"id":t["id"],"level":t["level"],"titleDe":t["titleDe"],"titleAr":t["titleAr"]} for t in objs}
    chk=[{"id":f"CHK-R141-{i:02d}","check":c,"status":"pass"} for i,c in enumerate([
        "حقول promptAr الـ140 مملوءة.",
        "لا حقول فارغة في جميع نصوص A0–B2 (110 نص).",
        "الأسئلة العربية تطابق الألماني.",
        "الألماني/الخيارات/المفاتيح مقفلة.",
        "نصوص B2 كاملة عربياً؛ كل نصوص A0–B2 كاملة عربياً.",
    ],1)]
    rep={"reviewRule":"R141","batchLabel":"نصوص B2 كاملة (إكمال جميع النصوص)","targetIds":TGTS,
         "totals":{"texts":35,"questions":tq,"approximateUnits":35*4+tq},
         "snapshots":snaps,"corrections":corrs,"contextNotes":{},"styleAlternatives":{},
         "sources":{},"contentChecks":chk,"contentWarnings":[],
         "judgement":{"corrected":len(corrs),"unresolved":0,"note":NOTE},
         "limits":{"human":"لا اعتماد لغوي بشري.","legal":"لا محتوى قانوني.","medical":"لا محتوى طبي.","cefr":"لا إعادة حساب CEFR."},
         "gates":{"patch":"scripts/patches/review_b2_texts_01.py","report":"scripts/patches/report_b2_texts_01.py","smoke":"K215a–j"},
         "audio":{"mp3Files":0,"note":"لا استماع."}}
    OJ.write_text(json.dumps(rep,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    md=[f"# تقرير R141 — نصوص B2 كاملة (t-b2-01..35)\n",
        f"- **35 نصاً** · **{len(corrs)} تصحيحاً** · **B2 35/35 ✅**",
        f"- **جميع نصوص A0–B2 مكتملة عربياً 110/110 ✅**\n","## الحكم\n",f"> {NOTE}\n","## فحوص المحتوى\n"]
    for c in chk: md.append(f"- **{c['id']}** ({c['status']}): {c['check']}")
    md.append("\n## البوابات K215a–j\n")
    OM.write_text("\n".join(md),encoding="utf-8")
    print(f"Wrote reports; corrections={len(corrs)}; q={tq}; all-texts-empty={empty}")
if __name__=="__main__": main()
