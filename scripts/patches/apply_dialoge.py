# -*- coding: utf-8 -*-
"""Neue Dialoge anwenden + Vorpruefung: Belege woertlich, Antwort in Optionen, Arabisch in ar/explanationAr, kein Arabisch in de,
   >=8 verwaiste Karten pro Dialog tatsaechlich im Text (Stamm), Fallen: jeder Distraktor hat Anker im Dialog, truefalse-Balance."""
import json,sys,re,importlib
mod=importlib.import_module(sys.argv[1]); D=mod.D; LEVEL=sys.argv[2]
AR=re.compile(r'[\u0600-\u06FF]')
d=json.load(open("content/dialogues.json")); ids={x["id"] for x in d}
v=json.load(open("content/vocab.json")); cards={c["de"]:c for dk in v.values() for c in dk["cards"]}
def norm(s): return re.sub(r'[^a-zäöüß0-9 ]',' ',s.lower().replace("é","e"))
def stamm(w):
    x=re.sub(r'^(der|die|das|sich)\s+','',w.lower()).split()[0]; return x[:max(4,len(x)-2)]
bad=[]; tf=[]
out=[]
for dl in D:
    de=" ".join(l[1] for l in dl["lines"]); low=norm(de)
    if dl["id"] in ids: bad.append((dl["id"],"ID exists"))
    if len(dl["lines"])<6: bad.append((dl["id"],"lines"))
    for who,de_,ar in dl["lines"]:
        if AR.search(de_) or not AR.search(ar): bad.append((dl["id"],"ar/de",de_[:30]))
    fehl=[w for w in dl["waisen"] if w not in cards or stamm(w) not in low]
    if len(dl["waisen"])-len(fehl)<8: bad.append((dl["id"],"waisen<8",fehl))
    for w in dl["waisen"]:
        if w in cards and cards[w]["level"]!=LEVEL: bad.append((dl["id"],"level",w))
    qs=[]
    for i,q in enumerate(dl["questions"],1):
        q=dict(q); q["id"]=f"{dl['id']}-q{i}"
        e=q["explanationAr"]
        if not AR.search(e): bad.append((q["id"],"noAR"))
        for m in re.findall(r'«([^»]+)»',e):
            for p in re.split(r'…',m):
                p=p.strip(" .,;:„“\"")
                if len(p)>=12 and p not in de: bad.append((q["id"],"ZITAT",p[:40]))
        if q["type"]=="mc":
            if q["answer"] not in q["options"] or len(set(q["options"]))!=len(q["options"]): bad.append((q["id"],"opt"))
            for o in q["options"]:
                if o==q["answer"]: continue
                toks=[t for t in norm(o).split() if len(t)>=4]
                if not any(t[:max(4,len(t)-2)] in low for t in toks): bad.append((q["id"],"kein Anker",o))
            q["falle"]=True
            # تدويرُ موضعِ الصحيح حتميًّا حسبَ رقمِ الحوارِ والسؤال
            o=list(q["options"]); o.remove(q["answer"]); o.insert((int(dl["id"].split("-")[-1])+i)%len(q["options"]),q["answer"]); q["options"]=o
        if q["type"]=="truefalse":
            if q["answer"] not in ("richtig","falsch"): bad.append((q["id"],"tf"))
            tf.append(q["answer"])
        if q["type"]=="fill":
            a=q["answer"] if isinstance(q["answer"],list) else [q["answer"]]
            if not any(x in de for x in a): bad.append((q["id"],"fill nicht im Text"))
        qs.append(q)
    for s in dl["dictation"]:
        if s not in de: bad.append((dl["id"],"dictation nicht im Text",s[:30]))
    out.append({"id":dl["id"],"level":LEVEL,"titleDe":dl["titleDe"],"titleAr":dl["titleAr"],"lines":[{"who":w,"de":x,"ar":a} for w,x,a in dl["lines"]],"questions":qs,"dictation":dl["dictation"],"neu":True,"waisen":dl["waisen"]})
r=tf.count("richtig")
if tf and not (0.3<=r/len(tf)<=0.7): bad.append(("tf-balance",r,len(tf)))
print(len(D),bad)
if not bad:
    d.extend(out); json.dump(d,open("content/dialogues.json","w"),ensure_ascii=False,indent=1); print("OK",len(d))
