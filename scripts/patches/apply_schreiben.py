# -*- coding: utf-8 -*-
"""Neue Schreibaufgaben: Vorpruefung (Felder, Arabisch in Ar-Feldern, kein Arabisch in De, >=3 Kriterien, Muster-Laenge je Level, keine Prozent/Jahre ausser Whitelist), neu=True."""
import json,sys,re,importlib
W=importlib.import_module(sys.argv[1]).W
AR=re.compile(r'[\u0600-\u06FF]')
w=json.load(open("content/writing.json")); ids={x["id"] for x in w}
LEN={"A1":(25,80),"A2":(50,130),"B1":(80,170),"B2":(120,260)}
bad=[]
for x in W:
    if x["id"] in ids: bad.append((x["id"],"ID"))
    for k in ("titleAr","taskAr"):
        if not AR.search(x[k]): bad.append((x["id"],k))
    for k in ("titleDe","taskDe","sample"):
        if AR.search(x[k]): bad.append((x["id"],k,"AR"))
    if len(x["criteria"])<3 or not all(AR.search(c) for c in x["criteria"]): bad.append((x["id"],"criteria"))
    n=len(x["sample"].split()); lo,hi=LEN[x["level"]]
    if not lo<=n<=hi: bad.append((x["id"],f"sample{n}"))
    if re.search(r'\d{1,3}\s?(%|Prozent)|\b(1[89]\d\d|20[0-4]\d)\b',x["sample"]): bad.append((x["id"],"zahl"))
    x["neu"]=True
print(len(W),bad)
if not bad:
    w.extend(W); json.dump(w,open("content/writing.json","w"),ensure_ascii=False,indent=1); print("OK",len(w))
