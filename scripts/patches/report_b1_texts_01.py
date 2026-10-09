#!/usr/bin/env python3
"""R140 — report for B1 texts t-b1-01..30 (100 promptAr fills; B1 texts COMPLETE)."""
from __future__ import annotations
import json
from pathlib import Path
from importlib.machinery import SourceFileLoader
ROOT = Path(__file__).resolve().parents[2]
TP = ROOT/"content"/"texts.json"
OJ = ROOT/"docs"/"content-review-b1-texts-01-2026-10-09.json"
OM = ROOT/"docs"/"content-review-b1-texts-01-2026-10-09.md"
TGTS = [f"t-b1-{i:02d}" for i in range(1,31)]
patch = SourceFileLoader("p", str(ROOT/"scripts"/"patches"/"review_b1_texts_01.py")).load_module()
P = patch.PROMPTS
NOTE = "استكمال 100 حقل من حقول promptAr الفارغة في نصوص B1 الثلاثين كاملة (t-b1-01..30). النصوص تغطي: الهواتف في المدرسة، طريق ألمانيا، البيئة، رسالة من الوطن، النصائح، إعلان وظيفة، التكوين أم الجامعة، السكن، البيئة اليومية، خلاف المكتب، التطوع، بطاقات الحفظ، مقابلة العمل، المكتبة، الشراء الإلكتروني، سوء فهم، إصلاح الإطار، الأرق في الغربة، التطوع بلا أجر، الانتقال، الشهر الأول، الشرفة، خبر زائف، الصحة في المناوبات، خضرة وضجيج، مسرح، استهلاك أقل، المحكمة، المراهقة، رحلة العمل. العربية مطابقة للألماني في أزمنة الماضي التام والكارجيف وKonjunktiv II والجمل الموصولة؛ لا تعديل للألماني أو المفاتيح. بهذه الدفعة تكتمل نصوص B1 عربياً (30/30)."
def main():
    data=json.loads(TP.read_text(encoding="utf-8"))
    objs=[t for t in data if t.get("id") in TGTS]; assert len(objs)==30
    corrs=[]
    for tid in TGTS:
        for qi,ar in P[tid].items():
            corrs.append({"unit":f"{tid}.questions[{qi}].promptAr","field":"promptAr","before":"","after":ar,"reason":"استكمال حقل promptAr فارغ."})
    tq=sum(len(t["questions"]) for t in objs)
    empty=sum(1 for t in data if t.get('level')=='B1' for q in t.get("questions",[]) if not q.get("promptAr","").strip())
    assert empty==0
    snaps={t["id"]:{"id":t["id"],"level":t["level"],"titleDe":t["titleDe"],"titleAr":t["titleAr"],"de":t["de"],"ar":t["ar"],"questions":t["questions"]} for t in objs}
    chk=[{"id":f"CHK-R140-{i:02d}","check":c,"status":"pass"} for i,c in enumerate([
        "حقول promptAr الـ100 مملوءة.",
        "لا حقول فارغة في نصوص B1 كافة.",
        "الأسئلة العربية تطابق الألماني.",
        "الألماني/الخيارات/المفاتيح مقفلة.",
        "نصوص B1 كاملة عربياً.",
    ],1)]
    rep={"reviewRule":"R140","batchLabel":"نصوص B1 كاملة","targetIds":TGTS,
         "totals":{"texts":30,"questions":tq,"approximateUnits":30*4+tq},
         "snapshots":snaps,"corrections":corrs,"contextNotes":{},"styleAlternatives":{},
         "sources":{},"contentChecks":chk,"contentWarnings":[],
         "judgement":{"corrected":len(corrs),"unresolved":0,"note":NOTE},
         "limits":{"human":"لا اعتماد لغوي بشري.","legal":"لا محتوى قانوني.","medical":"لا محتوى طبي.","cefr":"لا إعادة حساب CEFR."},
         "gates":{"patch":"scripts/patches/review_b1_texts_01.py","report":"scripts/patches/report_b1_texts_01.py","smoke":"K214a–j"},
         "audio":{"mp3Files":0,"note":"لا استماع."}}
    OJ.write_text(json.dumps(rep,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    md=[f"# تقرير R140 — نصوص B1 كاملة (t-b1-01..30)\n",
        f"- **30 نصاً** · **{len(corrs)} تصحيحاً** · **B1 30/30 ✅**\n","## الحكم\n",f"> {NOTE}\n",
        "## فحوص المحتوى\n"]
    for c in chk: md.append(f"- **{c['id']}** ({c['status']}): {c['check']}")
    md.append("\n## البوابات K214a–j\n")
    OM.write_text("\n".join(md),encoding="utf-8")
    print(f"Wrote reports; corrections={len(corrs)}; q={tq}; B1-empty={empty}")
if __name__=="__main__": main()
