# -*- coding: utf-8 -*-
"""R147: تطهير بنك syn الخام إلى invariant R72–R80 الموثق (70 زوجاً موثّقاً سياقياً فقط).
التوسعة الصامتة (100 lemma/210 أزواج) ثبت بالفحص أنها يتيمة كلياً: 29 مصدراً ليست بطاقات،
و111 زوجاً غير مربوطة بـ card.syn، ولا مستهلِك منتج للملف (lib/synonyme يقرأ kontext فقط).
الإزالة لا تغيّر شيئاً مرئياً للمتعلم، والأزواج محفوظة في سجل Git لاسترجاعها بدفعة موثقة.
Idempotent: لا يزيل إلا ما ليس في synonyme-kontext.json."""
import json, os, collections

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
RAW_P = os.path.join(ROOT, "content", "synonyme.json")
KON_P = os.path.join(ROOT, "content", "synonyme-kontext.json")

raw = json.load(open(RAW_P, encoding="utf8"), object_pairs_hook=collections.OrderedDict)
kon = json.load(open(KON_P, encoding="utf8"))
documented = {(s, t) for s, alts in kon.items() for t in alts}

out = collections.OrderedDict()
removed = 0
for source, targets in raw.items():
    keep = [t for t in targets if (source, t) in documented]
    removed += len(targets) - len(keep)
    if keep:
        out[source] = keep

total = sum(len(v) for v in out.values())
assert total == 70, total
json.dump(out, open(RAW_P, "w", encoding="utf8"), ensure_ascii=False, indent=2)
print(f"R147 raw syn purge: removed {removed} orphan pairs; raw bank = {total} documented pairs / {len(out)} lemmas")
