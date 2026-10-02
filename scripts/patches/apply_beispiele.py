# -*- coding: utf-8 -*-
"""Wendet eine Beispiel-Batch an und prüft: Wort in Satz (Präfixverben), Länge, kein Arabisch, keine Dubletten, Übersetzung."""
import re,json,sys,importlib
nr=sys.argv[1]
sys.path.insert(0,"scripts/patches"); B=importlib.import_module(f"beispiele_{nr}").B
v=json.load(open("content/vocab.json"))
PREF=("voraus","zusammen","zurück","durch","über","unter","wieder","weiter","ab","an","auf","aus","bei","ein","mit","nach","vor","zu","weg","um","fest","statt","teil","kennen","fern","hin","her","fort","los","frei")
AR=re.compile(r'[\u0600-\u06FF]')
def norm(s): return " "+re.sub(r'[^a-zäöüß0-9 ]'," ",s.lower())+" "
def part_ok(w,low):
    base=w[:-2] if w.endswith("en") and len(w)>4 else (w[:-1] if w.endswith("n") and len(w)>4 else w)
    if base[:max(4,len(base)-2)] in low: return True
    for p in PREF:
        if w.startswith(p) and len(w)>len(p)+2:
            rest=w[len(p):]; rb=rest[:-2] if rest.endswith("en") else rest
            if rb[:max(3,len(rb)-2)] in low and (f" {p} " in low or (p+"ge"+rb[:3]) in low or (p+rb[:3]) in low): return True
    return False
def ok_word(word,de):
    low=norm(de); w=re.sub(r'^(der|die|das|sich)\s+','',word.lower().replace('é','e')).strip(); w=re.sub(r'\s+(auf|über|um|von|an|für)$','',w); w=re.sub(r'\b(jdn|jdm|etwas|seine|sich)\b','',w)
    return all(part_ok(p,low) for p in re.split(r"[\s-]+",w) if len(p)>2)
alle={c["exampleDe"] for d in v.values() for c in d["cards"] if c.get("exampleDe") and c["id"] not in B}
n=0;bad=[]
for d in v.values():
    for c in d["cards"]:
        if c["id"] in B:
            de,ar=B[c["id"]]; wc=len(de.split())
            if not ok_word(c["de"],de): bad.append((c["id"],c["de"],"WORT"))
            if not 4<=wc<=18: bad.append((c["id"],f"LEN{wc}"))
            if AR.search(de): bad.append((c["id"],"AR"))
            if not AR.search(ar): bad.append((c["id"],"noAR"))
            if de in alle: bad.append((c["id"],"DUP"))
            alle.add(de); c["exampleDe"]=de; c["exampleAr"]=ar; n+=1
print(n,len(B),bad)
if not bad and n==len(B):
    json.dump(v,open("content/vocab.json","w"),ensure_ascii=False,indent=1)
    bb=json.load(open("content/beispiele-batches.json")); bb["batches"]=[b for b in bb["batches"] if b["nr"]!=int(nr)]+[{"nr":int(nr),"datum":"2026-09-29","ids":sorted(B)}]
    json.dump(bb,open("content/beispiele-batches.json","w"),ensure_ascii=False,indent=0); print("OK geschrieben")
