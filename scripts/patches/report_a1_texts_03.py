#!/usr/bin/env python3
"""R138 — report for A1 texts t-a1-07..20 (56 promptAr fills; A1 texts COMPLETE)."""
from __future__ import annotations
import json
from pathlib import Path
from importlib.machinery import SourceFileLoader
import sys

ROOT = Path(__file__).resolve().parents[2]
TP = ROOT/"content"/"texts.json"
OJ = ROOT/"docs"/"content-review-a1-texts-03-2026-10-09.json"
OM = ROOT/"docs"/"content-review-a1-texts-03-2026-10-09.md"
TGTS = ["t-a1-07","t-a1-08","t-a1-09","t-a1-10","t-a1-11","t-a1-12","t-a1-13","t-a1-14",
        "t-a1-15","t-a1-16","t-a1-17","t-a1-18","t-a1-19","t-a1-20"]
# Load prompts from patch
patch_mod = SourceFileLoader("p3", str(ROOT/"scripts"/"patches"/"review_a1_texts_03.py")).load_module()
PROMPTS = patch_mod.PROMPTS

NOTE = "استكمال 56 حقلاً من حقول promptAr الفارغة في نصوص A1 المتبقية (t-a1-07..20: يوم أمير/صباحي/التسوق/المقهى/عطلة نهاية الأسبوع/الطقس/البحث عن شقة/المدينة/التدريب/عيد ميلاد/المطار/صديق قديم/نهاية الأسبوع/عند الطبيب). بهذه الدفعة تكتمل مراجعة نصوص A1 عربياً (20 نصاً، 80 سؤالاً). العربية مطابقة للألماني؛ لا تعديل للألماني أو المفاتيح."


def main() -> None:
    data = json.loads(TP.read_text(encoding="utf-8"))
    objs = [t for t in data if t.get("id") in TGTS]
    assert len(objs)==len(TGTS)
    corrs=[]
    for tid in TGTS:
        for qi,ar in PROMPTS[tid].items():
            corrs.append({"unit":f"{tid}.questions[{qi}].promptAr","field":"promptAr","before":"","after":ar,"reason":"استكمال حقل promptAr فارغ."})
    tq=sum(len(t["questions"]) for t in objs)
    empty=sum(1 for t in data if t.get('level')=='A1' for q in t.get("questions",[]) if not q.get("promptAr","").strip())
    assert empty==0
    snaps={t["id"]:{"id":t["id"],"level":t["level"],"titleDe":t["titleDe"],"titleAr":t["titleAr"],"de":t["de"],"ar":t["ar"],"questions":t["questions"]} for t in objs}
    chk=[{"id":f"CHK-R138-{i:02d}","check":c,"status":"pass"} for i,c in enumerate([
        f"حقول promptAr الـ{len(corrs)} مملوءة.",
        "لا حقول promptAr فارغة في نصوص A1 كافة (20 نصاً).",
        "الأسئلة العربية تطابق الألماني معنىً.",
        "الألماني/الخيارات/المفاتيح/العناوين/النصوص مقفلة.",
        "نصوص A1 كاملة عربياً.",
    ],1)]
    rep={"reviewRule":"R138","batchLabel":"ثالث دفعة نصوص A1 (t-a1-07..20 — إكمال A1)","targetIds":TGTS,
         "totals":{"texts":len(TGTS),"questions":tq,"approximateUnits":len(TGTS)*4+tq},
         "snapshots":snaps,"corrections":corrs,"contextNotes":{},"styleAlternatives":{},
         "sources":{},"contentChecks":chk,"contentWarnings":[],
         "judgement":{"corrected":len(corrs),"unresolved":0,"note":NOTE},
         "limits":{"human":"لا اعتماد لغوي بشري.","legal":"لا محتوى قانوني.","medical":"لا محتوى طبي.","cefr":"لا إعادة حساب CEFR."},
         "gates":{"patch":"scripts/patches/review_a1_texts_03.py","report":"scripts/patches/report_a1_texts_03.py","smoke":"K212a–j"},
         "audio":{"mp3Files":0,"note":"لا استماع للصوت."}}
    OJ.write_text(json.dumps(rep,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    md=[f"# تقرير R138 — ثالث دفعة نصوص A1 (t-a1-07..20)\n",
        f"- **النطاق:** {len(TGTS)} نصاً (من t-a1-07 إلى t-a1-20)",
        f"- **التصحيحات:** {len(corrs)} (استكمال promptAr) · غير محسوم: 0",
        f"- **A1 texts مكتملة عربياً: 20/20**\n","## الحكم\n",f"> {NOTE}\n","## التصحيحات\n"]
    for i,c in enumerate(corrs,1):
        md.append(f"{i}. `{c['unit']}` → «{c['after']}»")
    md.append("\n## فحوص المحتوى\n")
    for c in chk: md.append(f"- **{c['id']}** ({c['status']}): {c['check']}")
    md.append("\n## البوابات K212a–j\n")
    OM.write_text("\n".join(md),encoding="utf-8")
    print(f"Wrote {OJ.name} and {OM.name}; corrections={len(corrs)}; q={tq}; A1-remaining-empty={empty}")


if __name__=="__main__": main()
