#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""تدقيقٌ دلاليّ: ما لا تكشفُهُ البواباتُ الشكلية — أرقامٌ لا تتطابق، وأجوبةٌ لا تردُ في نصِّها، وترجماتٌ تُسقِطُ معلومة."""
import json, re, collections

AR_NUM = {"صفر":0,"واحد":1,"واحدة":1,"اثنان":2,"اثنَين":2,"اثنتان":2,"ثلاثة":3,"ثلاث":3,"أربعة":4,"أربع":4,"خمسة":5,"خمس":5,
 "ستة":6,"ست":6,"ستّة":6,"سبعة":7,"سبع":7,"ثمانية":8,"ثماني":8,"تسعة":9,"تسع":9,"عشرة":10,"عشر":10,"اثنا عشر":12,
 "أربعة عشر":14,"خمسة عشر":15,"عشرون":20,"عشرين":20,"ثلاثون":30,"ثلاثين":30,"أربعون":40,"أربعين":40,"خمسون":50,"خمسين":50,
 "ستون":60,"ستين":60,"سبعون":70,"سبعين":70,"ثمانون":80,"ثمانين":80,"تسعون":90,"تسعين":90,"مئة":100,"مائة":100,"ألف":1000,"ستة عشر":16,"سبعة عشر":17,"ثمانية عشر":18,"تسعة عشر":19,"ونصف":30,"والنصف":30,"والربع":15,"التاسعة والأربعين":49,"عشرين":20,"أربعين":40,"الأولى":1,"الثانية":2,"الثالثة":3,"الرابعة":4,"الخامسة":5,"السادسة":6,"السابعة":7,"الثامنة":8,"التاسعة":9,"العاشرة":10,"الحادية عشرة":11,"الثانية عشرة":12,"الثالثة عشرة":13,"الرابعة عشرة":14,"الخامسة عشرة":15,"السادسة عشرة":16,"السابعة عشرة":17,"الثامنة عشرة":18,"ثمانيةَ عشر":18,"خمسةَ عشر":15,"أربعةَ عشر":14,"اثنَي عشر":12,"سبعَ عشرةَ":17,"ستَّ عشرةَ":16,"تسعَ عشرةَ":19,"ثلاثين":30,"خمسين":50,"تسعةٍ وأربعين":49,"تسعةً وأربعين":49,"خمسون":50,"ستّون":60}
DE_NUM = {"null":0,"zwei":2,"drei":3,"vier":4,"fünf":5,"sechs":6,"sieben":7,"acht":8,"neun":9,
 "zehn":10,"elf":11,"zwölf":12,"dreizehn":13,"vierzehn":14,"fünfzehn":15,"sechzehn":16,"siebzehn":17,"achtzehn":18,
 "neunzehn":19,"zwanzig":20,"dreißig":30,"vierzig":40,"fünfzig":50,"sechzig":60,"siebzig":70,"achtzig":80,"neunzig":90,
 "hundert":100,"tausend":1000}

def ziffern(s):  return set(int(x) for x in re.findall(r"\d+", s))

def de_zahlen(s):
    low = s.lower(); out=set()
    for w,v in DE_NUM.items():
        if re.search(rf"\b{w}\b", low): out.add(v)
    return out | ziffern(s)

def ar_zahlen(s):
    out=ziffern(s)
    for w,v in AR_NUM.items():
        if w in s: out.add(v)
    return out

def melde(liste, titel):
    print(f"\n=== {titel}: {len(liste)}")
    for x in liste[:14]: print("  ·", x)

def main():
    befunde=[]
    # ① النصوص: أجوبةُ ملءِ الفراغِ يجبُ أن تردَ في متنِ النصّ
    T=json.load(open("content/texts.json",encoding="utf8"))
    fehlend=[]
    for t in T:
        for q in t["questions"]:
            if q["type"]=="fill":
                ant=q["answer"] if isinstance(q["answer"],list) else [q["answer"]]
                if not any(a.lower() in t["de"].lower() for a in ant):
                    fehlend.append(f'{q["id"]}: {ant} ليست في متنِ النصّ')
    melde(fehlend,"أجوبةُ ملءِ فراغٍ لا ترِدُ حرفياً في النصّ (قد تكونُ استنتاجاً مقصوداً)")
    # ② النصوص والحوارات: أرقامٌ في الألمانيةِ غائبةٌ عن الترجمة
    lücken=[]
    for t in T:
        d,a = de_zahlen(t["de"]), ar_zahlen(t["ar"])
        d = {x for x in d if x >= 3 or str(x) in t["de"]}
        if d-a: lücken.append(f'{t["id"]}: أرقامٌ في الألمانيةِ لا تقابلُها العربية {sorted(d-a)}')
    D=json.load(open("content/dialogues.json",encoding="utf8"))
    for x in D:
        for i,l in enumerate(x["lines"]):
            d,a = de_zahlen(l["de"]), ar_zahlen(l["ar"])
            d = {x for x in d if x >= 3 or str(x) in l["de"]}
            if d-a: lücken.append(f'{x["id"]}:{i}: {sorted(d-a)} | {l["de"][:52]}')
    melde(lücken,"أرقامٌ ألمانيةٌ بلا مقابلٍ في الترجمة")
    # ③ المفردات: أمثلةٌ لا تحوي الكلمةَ نفسَها
    V=json.load(open("content/vocab.json",encoding="utf8"))
    ohne=[]
    for k,deck in V.items():
        for c in deck["cards"]:
            ex=c.get("exampleDe")
            if not ex: continue
            wort=c["de"].split()[-1].lower().rstrip("?!.")
            # اقتطاعُ البادئةِ المنفصلةِ والنهايةِ المتصرِّفة
            for p in ("auf","aus","ab","an","ein","mit","vor","zu","über","unter","durch","zurück","weiter","nach","um","her","hin","wieder"):
                if wort.startswith(p) and len(wort) > len(p)+3: wort=wort[len(p):]; break
            def norm(x): return (x.replace("ä","a").replace("ö","o").replace("ü","u").replace("ß","ss")
                                   .replace("Ä","a").replace("Ö","o").replace("Ü","u"))
            w=norm(wort); e=norm(ex.lower())
            kern=w[:max(4,len(w)-4)]
            if len(w)>3 and kern not in e:
                ohne.append(f'{c["id"]} «{c["de"]}» → {ex[:52]}')
    melde(ohne,"بطاقاتٌ مثالُها لا يحوي الكلمةَ المستهدَفة")
    print("\nالمجموعُ المرصود:", len(fehlend)+len(lücken)+len(ohne))
main()
