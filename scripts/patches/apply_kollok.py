# -*- coding: utf-8 -*-
"""Kollokationen-Batch anwenden: Kartenwort in jeder Verbindung, 2–3 Stück, 2–6 Wörter, keine Dubletten, kein Arabisch."""
import re,json,sys,importlib,os
nr=sys.argv[1]
sys.path.insert(0,"scripts/patches"); M=importlib.import_module(f"kollok_{nr}"); K=M.K; AUS=getattr(M,"AUSNAHMEN",{})
from apply_beispiele_lib import ok_word
v=json.load(open("content/vocab.json")); ids={c["id"]:c for d in v.values() for c in d["cards"]}
out=json.load(open("content/kollokationen.json")) if os.path.exists("content/kollokationen.json") else {}
bad=[];seen=set(x for l in out.values() for x in l)
for cid,ks in K.items():
    ks=list(ks); c=ids.get(cid)
    if not c: bad.append((cid,"ID")); continue
    if not 2<=len(ks)<=3: bad.append((cid,"ANZ"))
    for k in ks:
        n=len(k.split())
        if not 2<=n<=6: bad.append((cid,k,"LEN"))
        if re.search(r'[\u0600-\u06FF]',k): bad.append((cid,k,"AR"))
        if not ok_word(c["de"],k): bad.append((cid,k,"WORT"))
        if k in seen and k not in out.get(cid,[]): bad.append((cid,k,"DUP"))
        seen.add(k)
    out[cid]=ks
print(len(K),bad)
if not bad:
    json.dump(out,open("content/kollokationen.json","w"),ensure_ascii=False,indent=1); print("OK",len(out))
    if AUS:
        p="content/kollok-ausnahmen.json"; ex=json.load(open(p)) if os.path.exists(p) else {}
        for cid,g in AUS.items():
            assert cid in ids and cid not in out, cid
            ex[cid]={"de":ids[cid]["de"],"grund":g}
        json.dump(ex,open(p,"w"),ensure_ascii=False,indent=1); print("Ausnahmen",len(ex))
