# -*- coding: utf-8 -*-
"""Neue Uebungssaetze: Vorpruefung (>=3 Waisen des Levels im Satz (Stamm), Arabisch, Laenge 8-26 Woerter, keine Dublette, keine Prozent/Jahre), IDs fortlaufend, neu=True."""
import json,sys,re,importlib,collections
mod=importlib.import_module(sys.argv[1]); S=mod.S
AR=re.compile(r'[\u0600-\u06FF]')
sents=json.load(open("content/sentences.json")); vorhanden={s["de"] for s in sents}
v=json.load(open("content/vocab.json")); cards={c["de"]:c for dk in v.values() for c in dk["cards"]}
def norm(s): return re.sub(r'[^a-zäöüß0-9 -]',' ',s.lower().replace("é","e"))
def stamm(w):
    x=re.sub(r'^(der|die|das|sich|jdn|jdm)\s+','',w.lower())
    x=re.sub(r'^etwas\s+','',x)
    return x.split()[0][:max(4,len(x.split()[0])-2)] if x.split() else ''
nxt=collections.Counter()
for s in sents:
    L=s["id"].split("-")[1]; m=re.match(r"\d+",s["id"].split("-")[2]); n=int(m.group()) if m else 0; nxt[L.upper()]=max(nxt[L.upper()],n)
bad=[];out=[]
for L,de,ar,waisen,tags in S:
    low=norm(de); n=len(de.split())
    if AR.search(de) or not AR.search(ar): bad.append((de[:30],"ar/de"))
    if not 8<=n<=26: bad.append((de[:30],f"len{n}"))
    if de in vorhanden: bad.append((de[:30],"DUP"))
    if re.search(r'\d{1,3}\s?(%|Prozent)|\b(1[89]\d\d|20[0-4]\d)\b',de): bad.append((de[:30],"zahl"))
    drin=[w for w in waisen if w in cards and cards[w]["level"]==L and stamm(w) in low]
    if len(drin)<3: bad.append((de[:30],"waisen<3",[w for w in waisen if w not in drin]))
    nxt[L]+=1
    out.append({"id":f"s-{L.lower()}-{nxt[L]}","level":L,"de":de,"ar":ar,"tags":tags,"neu":True,"waisen":waisen})
print(len(S),bad)
if not bad:
    sents.extend(out); json.dump(sents,open("content/sentences.json","w"),ensure_ascii=False,indent=1); print("OK",len(sents))
