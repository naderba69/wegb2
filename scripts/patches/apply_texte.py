# -*- coding: utf-8 -*-
"""Neue Kurztexte: Belege woertlich, Antwort in Optionen + Distraktor-Anker im Text, fill im Text, >=12 Waisen des Levels, Laenge, tf-Balance, keine Prozent/Jahre, neu=True."""
import json,sys,re,importlib
mod=importlib.import_module(sys.argv[1]); T=mod.T; LEVEL=sys.argv[2]; LEN=tuple(map(int,sys.argv[3].split("-")))
AR=re.compile(r'[\u0600-\u06FF]')
texts=json.load(open("content/texts.json")); ids={t["id"] for t in texts}
v=json.load(open("content/vocab.json")); cards={c["de"]:c for dk in v.values() for c in dk["cards"]}
def norm(s): return re.sub(r'[^a-zäöüß0-9 ]',' ',s.lower().replace("é","e"))
def stamm(w):
    x=re.sub(r'^(der|die|das|sich)\s+','',w.lower()).split()[0]; return x[:max(4,len(x)-2)]
bad=[];tf=[];out=[]
for t in T:
    de=t["de"]; low=norm(de); n=len(de.split())
    if t["id"] in ids: bad.append((t["id"],"ID"))
    if not LEN[0]<=n<=LEN[1]: bad.append((t["id"],f"len{n}"))
    if AR.search(de) or not AR.search(t["ar"]): bad.append((t["id"],"ar/de"))
    if de.count("\n\n")<2: bad.append((t["id"],"absaetze"))
    if re.search(r'\d{1,3}\s?(%|Prozent)|\b(1[89]\d\d|20[0-4]\d)\b',de): bad.append((t["id"],"zahl"))
    drin=[w for w in t["waisen"] if w in cards and cards[w]["level"]==LEVEL and stamm(w) in low]
    if len(drin)<12: bad.append((t["id"],"waisen<12",[w for w in t["waisen"] if w not in drin]))
    qs=[]
    for i,q in enumerate(t["questions"],1):
        q=dict(q); q["id"]=f"{t['id']}-q{i}"; e=q["explanationAr"]
        if not AR.search(e) or "«" not in e: bad.append((q["id"],"beleg"))
        for m in re.findall(r'«([^»]+)»',e):
            for p in re.split(r'…',m):
                p=p.strip(" .,;:„“\"")
                if len(p)>=12 and p not in de: bad.append((q["id"],"ZITAT",p[:40]))
        if q["type"]=="mc":
            if q["answer"] not in q["options"] or len(set(q["options"]))!=3: bad.append((q["id"],"opt"))
            for o in q["options"]:
                if o==q["answer"]: continue
                toks=[x for x in norm(o).split() if len(x)>=4]
                if not any(x[:max(4,len(x)-2)] in low for x in toks): bad.append((q["id"],"kein Anker",o))
            o=list(q["options"]); o.remove(q["answer"]); o.insert((int(t["id"].split("-")[-1])+i)%3,q["answer"]); q["options"]=o
        if q["type"]=="truefalse":
            if q["answer"] not in ("richtig","falsch"): bad.append((q["id"],"tf"))
            tf.append(q["answer"])
        if q["type"]=="fill":
            a=q["answer"] if isinstance(q["answer"],list) else [q["answer"]]
            if not any(re.search(r'\b'+re.escape(x)+r'\b',de) for x in a): bad.append((q["id"],"fill"))
        qs.append(q)
    out.append({"id":t["id"],"level":LEVEL,"titleDe":t["titleDe"],"titleAr":t["titleAr"],"de":de,"ar":t["ar"],"questions":qs,"neu":True,"waisen":t["waisen"]})
r=tf.count("richtig")
if tf and not (0.3<=r/len(tf)<=0.7): bad.append(("tf-balance",r,len(tf)))
print(len(T),bad)
if not bad:
    texts.extend(out); json.dump(texts,open("content/texts.json","w"),ensure_ascii=False,indent=1); print("OK",len(texts))
