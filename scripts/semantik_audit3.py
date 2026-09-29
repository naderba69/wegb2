#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""تدقيقٌ دلاليٌّ ③: القواعدُ والجُملُ والشفرات — تطابقُ المثالِ مع قاعدتِه، وصدقُ الترجمةِ في البنوكِ الصغيرة."""
import json, re, collections
def J(p): return json.load(open(p,encoding="utf8"))
def melde(l,t):
    print(f"\n=== {t}: {len(l)}")
    for x in l[:14]: print("  ·",x)

G=J("content/grammar.json"); G=G if isinstance(G,list) else list(G.values())
S=J("content/sentences.json"); S=S if isinstance(S,list) else S.get("saetze",[])
E=J("content/eselsbruecken.json"); E=E if isinstance(E,list) else list(E.values())
F=J("content/fehler.json"); F=F if isinstance(F,list) else list(F.values())

# ① الجُملُ: العربيةُ حاضرةٌ والألمانيةُ خالصة
ar=re.compile(r"[\u0600-\u06FF]")
bad=[f'{s.get("id")}: {s.get("de","")[:48]}' for s in S if ar.search(s.get("de",""))]
melde(bad,"جُملٌ فيها عربيةٌ داخلَ الحقلِ الألماني")
bad2=[f'{s.get("id")}: بلا ترجمة' for s in S if not ar.search(s.get("ar",""))]
melde(bad2,"جُملٌ بلا ترجمةٍ عربية")

# ② القواعد: كلُّ درسٍ لهُ أمثلةٌ ألمانيةٌ خالصةٌ وشرحٌ عربي
g_bad=[]
for g in G:
    rid=g.get("id","?")
    for r in g.get("regeln",[]) or g.get("rules",[]) or []:
        de=r.get("de","") if isinstance(r,dict) else str(r)
        arr=r.get("ar","") if isinstance(r,dict) else ""
        if ar.search(de): g_bad.append(f'{rid}: عربيةٌ في الحقلِ الألماني «{de[:40]}»')
        if isinstance(r,dict) and not ar.search(arr): g_bad.append(f'{rid}: قاعدةٌ بلا شرحٍ عربيّ «{de[:40]}»')
melde(g_bad,"قواعدُ مختلطةُ الحقول")

# ③ الشفرات: لكلِّ شفرةٍ درسٌ موجودٌ فعلاً
gids={g.get("id") for g in G}
e_bad=[f'{e.get("id")}: يشيرُ إلى درسٍ غيرِ موجودٍ {e.get("grammarId")}' for e in E
       if e.get("grammarId") and e["grammarId"] not in gids]
melde(e_bad,"شفراتٌ تشيرُ إلى دروسٍ مفقودة")

# ④ بنكُ أخطاءِ العرب: لكلِّ مدخلٍ خطأٌ وصوابٌ مختلفان
f_bad=[f'{i}: الخطأُ والصوابُ متطابقان «{x.get("falsch","")[:40]}»' for i,x in enumerate(F)
       if x.get("falsch") and x.get("falsch")==x.get("richtig")]
melde(f_bad,"مداخلُ خطأٍ وصوابٍ متطابقة")
f_bad2=[f'{i}: بلا شرحٍ عربيّ «{x.get("falsch","")[:40]}»' for i,x in enumerate(F)
        if x.get("falsch") and not ar.search(str(x.get("warum","") or x.get("erklaerung","") or x.get("ar","")))]
melde(f_bad2,"مداخلُ أخطاءٍ بلا تعليلٍ عربيّ")
print("\nالمجموع:",len(bad)+len(bad2)+len(g_bad)+len(e_bad)+len(f_bad)+len(f_bad2))
