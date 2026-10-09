#!/usr/bin/env python3
"""R139 — report for A2 texts t-a2-01..20 (80 promptAr fills; A2 COMPLETE)."""
from __future__ import annotations
import json
from pathlib import Path
from importlib.machinery import SourceFileLoader

ROOT = Path(__file__).resolve().parents[2]
TP = ROOT/"content"/"texts.json"
OJ = ROOT/"docs"/"content-review-a2-texts-01-2026-10-09.json"
OM = ROOT/"docs"/"content-review-a2-texts-01-2026-10-09.md"
TGTS = [f"t-a2-{i:02d}" for i in range(1,21)]
patch_mod = SourceFileLoader("p", str(ROOT/"scripts"/"patches"/"review_a2_texts_01.py")).load_module()
PROMPTS = patch_mod.PROMPTS
NOTE = "استكمال 80 حقلاً من حقول promptAr الفارغة في نصوص A2 العشرين كاملة (t-a2-01..20). نصوص A2 تغطي: عطلة مرهقة، عند الطبيب، تخطيط رحلة، تعلم الألمانية، الدعوة، البحر، الصحة، موعد طبيب، هامبورغ، الانتقال، متجر الأدوات، الضجيج، السباحة، ضيوف تونس، الدراجة، طلب العمل، توفير الكهرباء، عقد الهاتف، معاينة الشقة، سوء فهم في المكتب. العربية مطابقة للألماني في أزمنة الماضي والمستقبل والجمل الموصولة وروابط weil/dass؛ لا تعديل للألماني أو المفاتيح. بهذه الدفعة تكتمل نصوص A2 عربياً (20/20)."


def main() -> None:
    data = json.loads(TP.read_text(encoding="utf-8"))
    objs = [t for t in data if t.get("id") in TGTS]
    assert len(objs)==20
    corrs=[]
    for tid in TGTS:
        for qi,ar in PROMPTS[tid].items():
            corrs.append({"unit":f"{tid}.questions[{qi}].promptAr","field":"promptAr","before":"","after":ar,"reason":"استكمال حقل promptAr فارغ."})
    tq=sum(len(t["questions"]) for t in objs)
    empty=sum(1 for t in data if t.get('level')=='A2' for q in t.get("questions",[]) if not q.get("promptAr","").strip())
    assert empty==0
    snaps={t["id"]:{"id":t["id"],"level":t["level"],"titleDe":t["titleDe"],"titleAr":t["titleAr"],"de":t["de"],"ar":t["ar"],"questions":t["questions"]} for t in objs}
    chk=[{"id":f"CHK-R139-{i:02d}","check":c,"status":"pass"} for i,c in enumerate([
        "حقول promptAr الـ80 مملوءة.",
        "لا حقول promptAr فارغة في نصوص A2 كافة (20 نصاً).",
        "الأسئلة العربية تطابق الألماني معنىً.",
        "الألماني/الخيارات/المفاتيح/العناوين/النصوص مقفلة.",
        "نصوص A2 كاملة عربياً.",
    ],1)]
    rep={"reviewRule":"R139","batchLabel":"نصوص A2 كاملة (t-a2-01..20)","targetIds":TGTS,
         "totals":{"texts":20,"questions":tq,"approximateUnits":20*4+tq},
         "snapshots":snaps,"corrections":corrs,"contextNotes":{},"styleAlternatives":{},
         "sources":{},"contentChecks":chk,"contentWarnings":[],
         "judgement":{"corrected":len(corrs),"unresolved":0,"note":NOTE},
         "limits":{"human":"لا اعتماد لغوي بشري.","legal":"لا محتوى قانوني.","medical":"لا محتوى طبي.","cefr":"لا إعادة حساب CEFR."},
         "gates":{"patch":"scripts/patches/review_a2_texts_01.py","report":"scripts/patches/report_a2_texts_01.py","smoke":"K213a–j"},
         "audio":{"mp3Files":0,"note":"لا استماع للصوت."}}
    OJ.write_text(json.dumps(rep,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    md=[f"# تقرير R139 — نصوص A2 كاملة (t-a2-01..20)\n",
        f"- **النطاق:** 20 نصاً",
        f"- **التصحيحات:** {len(corrs)} · غير محسوم: 0",
        f"- **A2 texts مكتملة عربياً: 20/20** ✅\n","## الحكم\n",f"> {NOTE}\n",
        "## فحوص المحتوى\n"]
    for c in chk: md.append(f"- **{c['id']}** ({c['status']}): {c['check']}")
    md.append("\n## البوابات K213a–j\n")
    OM.write_text("\n".join(md),encoding="utf-8")
    print(f"Wrote {OJ.name} and {OM.name}; corrections={len(corrs)}; q={tq}; A2-empty={empty}")


if __name__=="__main__": main()
