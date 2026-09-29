#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""تدقيقٌ دلاليٌّ ②: تناسقُ البطاقات — الجمعُ والأداةُ والترجماتُ المتطابقةُ لكلماتٍ مختلفة."""
import json, re, collections
V=json.load(open("content/vocab.json",encoding="utf8"))
karten=[c for d in V.values() for c in d["cards"]]
def melde(l,t):
    print(f"\n=== {t}: {len(l)}")
    for x in l[:16]: print("  ·",x)

# ① الجمعُ يجبُ أن يبدأَ بـdie
pl=[f'{c["id"]} «{c["de"]}» → {c["plural"]}' for c in karten if c.get("plural") and not c["plural"].startswith("die ")]
melde(pl,"جمعٌ لا يبدأُ بـdie")

# ② الأداةُ في الحقلِ يجبُ أن تطابقَ أوّلَ كلمةٍ في المتن
art=[f'{c["id"]} «{c["de"]}» article={c["article"]}' for c in karten if c.get("article") and not c["de"].startswith(c["article"]+" ")]
melde(art,"أداةٌ لا تطابقُ متنَ البطاقة")

# ③ ترجمةٌ عربيةٌ واحدةٌ لكلماتٍ ألمانيةٍ مختلفة (قد تكونُ خلطاً)
byAr=collections.defaultdict(list)
for c in karten: byAr[c["ar"].strip()].append(c["de"])
dup=[f'«{a}» ← {" · ".join(sorted(set(v)))}' for a,v in byAr.items() if len(set(v))>2]
melde(dup,"ترجمةٌ عربيةٌ واحدةٌ لثلاثِ كلماتٍ ألمانيةٍ فأكثر")

# ④ بطاقاتُ الأسماءِ بلا أداة (ما عدا الجموعَ والعبارات)
ohneArt=[f'{c["id"]} «{c["de"]}»' for c in karten
         if re.match(r"^[A-ZÄÖÜ][a-zäöüß]+$", c["de"]) and not c.get("article")]
melde(ohneArt,"اسمٌ مفردٌ بلا أداةٍ معلَنة")

# ⑤ المثالُ الألمانيُّ يجبُ أن ينتهيَ بعلامةٍ ختامية
ohnePunkt=[f'{c["id"]} → {c["exampleDe"]}' for c in karten if c.get("exampleDe") and c["exampleDe"][-1] not in ".!?"]
melde(ohnePunkt,"مثالٌ بلا علامةِ ختام")

# ⑥ الترجمةُ العربيةُ للمثالِ فارغةٌ أو قصيرةٌ جداً
kurz=[f'{c["id"]} «{c["de"]}» → «{c.get("exampleAr","")}»' for c in karten if c.get("exampleDe") and len(c.get("exampleAr",""))<6]
melde(kurz,"ترجمةُ مثالٍ ناقصةٌ أو أقصرُ من ستةِ حروف")
print("\nالمجموع:",len(pl)+len(art)+len(dup)+len(ohneArt)+len(ohnePunkt)+len(kurz))
